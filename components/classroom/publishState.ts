// Publicación manual del material del Classroom (`manualRelease`).
//
// El portafolio es un sitio estático sin backend, así que el estado de
// publicación vive en el propio repositorio: `published/{slug}.json` en la
// rama `main` guarda las ACTIVIDADES que el equipo docente ya publicó, cada
// una como una llave `tipo:id` (`reading:lectura-01-…`, `pres:trabajo-en-equipo`,
// `sim:manual-diagramas`). Los navegadores lo leen de raw.githubusercontent.com
// —el repo es público y esa lectura no espera al deploy— y el equipo docente
// lo escribe desde la UI con un fine-grained token de GitHub vía la API de
// contenidos. El workflow de deploy ignora `published/**`, de modo que
// publicar u ocultar no reconstruye el sitio: solo cambia el JSON que todos
// leen.
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

/** Tipos de actividad publicable. La llave del JSON es `tipo:id`. */
export type PublishKind = 'reading' | 'pres' | 'sim';

export const itemKey = (kind: PublishKind, id: string): string => `${kind}:${id}`;

const parseItems = (data: unknown): string[] | null => {
  if (!data || typeof data !== 'object') return null;
  const items = (data as { items?: unknown }).items;
  if (!Array.isArray(items)) return null;
  return items.filter((k): k is string => typeof k === 'string');
};

/** Última lectura buena, guardada por si la red o raw.githubusercontent fallan. */
export const readCachedItems = (slug: string): string[] | null => {
  try {
    const raw = window.localStorage.getItem(cacheKey(slug));
    return raw ? parseItems(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const writeCache = (slug: string, items: string[]) => {
  try {
    window.localStorage.setItem(cacheKey(slug), JSON.stringify({ items }));
  } catch {}
};

/**
 * Actividades publicadas según el repositorio, o la última copia buena en
 * caché si la red falla. `null` solo cuando nunca se ha podido leer nada: en
 * ese caso el estudiante ve únicamente el material transversal (se falla
 * cerrado).
 */
export const fetchPublishedItems = async (slug: string): Promise<string[] | null> => {
  try {
    // La CDN de raw cachea por URL completa: variar la query cada minuto
    // acota la propagación de un cambio a ~1 minuto sin golpear el origen
    // en cada render.
    const v = Math.floor(Date.now() / 60_000);
    const res = await fetch(`${rawUrl(slug)}?v=${v}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const items = parseItems(await res.json());
    if (items) {
      writeCache(slug, items);
      return items;
    }
    return readCachedItems(slug);
  } catch {
    return readCachedItems(slug);
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

const TOKEN_ERR =
  'GitHub rechazó el token. Verifique que sea un fine-grained token vigente con permiso «Contents · Read and write» sobre este repositorio.';

/**
 * Publica u oculta un conjunto de actividades en un solo commit: lee el JSON
 * del repo con su `sha`, aplica los cambios y lo vuelve a subir a `main`. Si
 * otro miembro del equipo publicó algo en el intermedio (el `sha` ya no
 * coincide), se reintenta sobre el estado fresco. Devuelve la lista de llaves
 * publicadas resultante.
 */
export const setItemsPublished = async (
  slug: string,
  changes: ReadonlyArray<{ key: string; on: boolean }>,
  token: string,
  message: string,
): Promise<string[]> => {
  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
  };

  for (let intento = 0; ; intento++) {
    const cur = await fetch(`${apiUrl(slug)}?ref=${BRANCH}`, { headers, cache: 'no-store' });
    let sha: string | undefined;
    let items: string[] = [];
    if (cur.ok) {
      const body = await cur.json();
      sha = body.sha;
      try {
        items = parseItems(JSON.parse(atob(String(body.content).replace(/\n/g, '')))) ?? [];
      } catch {}
    } else if (cur.status === 401 || cur.status === 403) {
      throw new Error(TOKEN_ERR);
    } else if (cur.status !== 404) {
      // 404 solo significa que el archivo aún no existe: se crea con el PUT.
      throw new Error(`No se pudo leer el estado de publicación (GitHub respondió ${cur.status}).`);
    }

    const next = new Set(items);
    for (const c of changes) {
      if (c.on) next.add(c.key);
      else next.delete(c.key);
    }
    const sorted = [...next].sort();

    const res = await fetch(apiUrl(slug), {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Classroom ${slug}: ${message}`,
        content: btoa(JSON.stringify({ items: sorted }, null, 2) + '\n'),
        branch: BRANCH,
        ...(sha ? { sha } : {}),
      }),
    });

    if (res.ok) {
      writeCache(slug, sorted);
      return sorted;
    }
    if (res.status === 409 && intento < 2) continue;
    if (res.status === 401 || res.status === 403) throw new Error(TOKEN_ERR);
    throw new Error(`No se pudo guardar el cambio (GitHub respondió ${res.status}).`);
  }
};
