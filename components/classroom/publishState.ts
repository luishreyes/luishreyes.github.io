// Publicación manual del material del Classroom (`manualRelease`).
//
// El portafolio es un sitio estático sin backend, así que el estado de
// publicación vive en el propio repositorio: `published/{slug}.json` en la
// rama `main` guarda las semanas que el equipo docente ya publicó. Los
// navegadores lo leen de raw.githubusercontent.com —el repo es público y esa
// lectura no espera al deploy— y el equipo docente lo escribe desde la UI con
// un fine-grained token de GitHub vía la API de contenidos. El workflow de
// deploy ignora `published/**`, de modo que publicar u ocultar una semana no
// reconstruye el sitio: solo cambia el JSON que todos leen.
//
// Igual que la entrega gradual, esto es una capa de presentación, no
// seguridad: los HTML de `public/` siguen siendo archivos estáticos y quien
// conozca la URL exacta puede abrirlos.

const OWNER = 'luishreyes';
const REPO = 'luishreyes.github.io';
const BRANCH = 'main';

const statePath = (slug: string) => `published/${slug}.json`;
const rawUrl = (slug: string) =>
  `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${statePath(slug)}`;
const apiUrl = (slug: string) =>
  `https://api.github.com/repos/${OWNER}/${REPO}/contents/${statePath(slug)}`;

const cacheKey = (slug: string) => `classroom:published:${slug}`;
const TOKEN_KEY = 'classroom:publishToken';

const parseWeeks = (data: unknown): number[] | null => {
  if (!data || typeof data !== 'object') return null;
  const weeks = (data as { weeks?: unknown }).weeks;
  if (!Array.isArray(weeks)) return null;
  return weeks.filter((w): w is number => typeof w === 'number' && Number.isFinite(w));
};

/** Última lectura buena, guardada por si la red o raw.githubusercontent fallan. */
export const readCachedWeeks = (slug: string): number[] | null => {
  try {
    const raw = window.localStorage.getItem(cacheKey(slug));
    return raw ? parseWeeks(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const writeCache = (slug: string, weeks: number[]) => {
  try {
    window.localStorage.setItem(cacheKey(slug), JSON.stringify({ weeks }));
  } catch {}
};

/**
 * Semanas publicadas según el repositorio, o la última copia buena en caché si
 * la red falla. `null` solo cuando nunca se ha podido leer nada: en ese caso
 * el estudiante ve únicamente el material transversal (se falla cerrado).
 */
export const fetchPublishedWeeks = async (slug: string): Promise<number[] | null> => {
  try {
    // La CDN de raw cachea por URL completa: variar la query cada minuto
    // acota la propagación de un cambio a ~1 minuto sin golpear el origen
    // en cada render.
    const v = Math.floor(Date.now() / 60_000);
    const res = await fetch(`${rawUrl(slug)}?v=${v}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const weeks = parseWeeks(await res.json());
    if (weeks) {
      writeCache(slug, weeks);
      return weeks;
    }
    return readCachedWeeks(slug);
  } catch {
    return readCachedWeeks(slug);
  }
};

/** Token de publicación del equipo docente, guardado en este navegador. */
export const getPublishToken = (): string | null => {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const savePublishToken = (token: string | null) => {
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {}
};

/**
 * Publica u oculta una semana: lee el JSON del repo con su `sha`, lo modifica
 * y lo vuelve a subir como un commit a `main`. Si otro miembro del equipo
 * publicó algo en el intermedio (el `sha` ya no coincide), se reintenta sobre
 * el estado fresco. Devuelve la lista de semanas resultante.
 */
export const setWeekPublished = async (
  slug: string,
  week: number,
  on: boolean,
  token: string,
): Promise<number[]> => {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  };

  for (let intento = 0; ; intento++) {
    const cur = await fetch(`${apiUrl(slug)}?ref=${BRANCH}`, { headers, cache: 'no-store' });
    let sha: string | undefined;
    let weeks: number[] = [];
    if (cur.ok) {
      const body = await cur.json();
      sha = body.sha;
      try {
        weeks = parseWeeks(JSON.parse(atob(String(body.content).replace(/\n/g, '')))) ?? [];
      } catch {}
    } else if (cur.status === 401 || cur.status === 403) {
      throw new Error('GitHub rechazó el token. Verifique que sea un fine-grained token vigente con permiso «Contents · Read and write» sobre este repositorio.');
    } else if (cur.status !== 404) {
      // 404 solo significa que el archivo aún no existe: se crea con el PUT.
      throw new Error(`No se pudo leer el estado de publicación (GitHub respondió ${cur.status}).`);
    }

    const next = new Set(weeks);
    if (on) next.add(week);
    else next.delete(week);
    const sorted = [...next].sort((a, b) => a - b);

    const res = await fetch(apiUrl(slug), {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Classroom ${slug}: semana ${week} ${on ? 'publicada' : 'oculta'}`,
        content: btoa(JSON.stringify({ weeks: sorted }, null, 2) + '\n'),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });

    if (res.ok) {
      writeCache(slug, sorted);
      return sorted;
    }
    if (res.status === 409 && intento < 2) continue;
    if (res.status === 401 || res.status === 403) {
      throw new Error('GitHub rechazó el token. Verifique que sea un fine-grained token vigente con permiso «Contents · Read and write» sobre este repositorio.');
    }
    throw new Error(`No se pudo guardar el cambio (GitHub respondió ${res.status}).`);
  }
};
