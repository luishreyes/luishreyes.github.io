/**
 * Las páginas del sitio que tienen HTML propio: dirección, título, idioma y si
 * entran al sitemap. `scripts/prerender.mjs` escribe con esto un HTML por
 * página después de `vite build`, para que cada dirección responda 200 con su
 * título y su contenido sin ejecutar JavaScript; `components/Metadatos.tsx`
 * pone el mismo título y la misma dirección canónica al navegar dentro de la app.
 *
 * Una ruta nueva en App.tsx necesita aquí su título (PORTAFOLIO). Las de los
 * cursos salen de los datos del aula. La descripción de las páginas del
 * portafolio es su entrada (`.a-entrada`), que el prerender lee de la página.
 */
import { classroomData, type Course } from './components/data/classroom';
import { ui, type Lang, type UIKey } from './context/i18n';

/** El dominio del CNAME. */
export const SITIO = 'https://portfolio.luishreyes.com';
const NOMBRE = 'Luis H. Reyes';

type Bilingue = { en: string; es: string };

export interface Pagina {
  /** Sin barra final, salvo la portada. */
  ruta: string;
  /** Título completo de la pestaña. */
  titulo: Bilingue;
  /** `'es'` para las páginas de los cursos; `'ui'`, el idioma que escoja el visitante (el HTML va en inglés). */
  idioma: 'es' | 'ui';
  /** Si se omite, el prerender usa la entrada de la página. */
  descripcion?: Bilingue;
  /** Foto para las vistas previas de enlaces; si se omite, la del encabezado de la página. */
  imagen?: string;
  /** `false`: responde 200 pero lleva `noindex` y no entra al sitemap. */
  indexar: boolean;
}

/** Direcciones viejas o atajos: App.tsx las redirige y el build les deja una página que redirige. */
export const REDIRECCIONES: { desde: string; hacia: string }[] = [
  { desde: '/simulators', hacia: '/teaching/strategies#simuladores' },
  { desde: '/principles/teaching', hacia: '/teaching/purpose' },
  { desde: '/principles/philosophy', hacia: '/teaching/philosophy' },
  { desde: '/principles/research', hacia: '/research/purpose' },
  { desde: '/principles/service', hacia: '/service/purpose' },
];

const texto = (clave: UIKey): Bilingue => ({ en: ui[clave].en, es: ui[clave].es });
const igual = (s: string): Bilingue => ({ en: s, es: s });

/** «Título · Sección · Luis H. Reyes». */
const componer = (...partes: Bilingue[]): Bilingue => ({
  en: [...partes.map((p) => p.en), NOMBRE].join(' · '),
  es: [...partes.map((p) => p.es), NOMBRE].join(' · '),
});

const PORTADA: Pagina = {
  ruta: '/',
  titulo: {
    en: `${NOMBRE} · Chemical and Food Engineering · Universidad de los Andes`,
    es: `${NOMBRE} · Ingeniería Química y de Alimentos · Universidad de los Andes`,
  },
  descripcion: {
    en: `${NOMBRE}. ${ui['home.who'].en} ${ui['home.statement'].en}`,
    es: `${NOMBRE}. ${ui['home.who'].es} ${ui['home.statement'].es}`,
  },
  imagen: '/images/site/retrato-luis-h-reyes-2026.jpg',
  idioma: 'ui',
  indexar: true,
};

/** Ruta, título de la página y, si el título solo no basta, la sección a la que pertenece. */
const PORTAFOLIO: [string, UIKey, UIKey?][] = [
  ['/context', 'context.title'],
  ['/trajectory', 'trajectory.title'],
  ['/recognition', 'awards.title'],
  ['/next', 'next.title'],
  ['/school', 'school.title'],
  ['/teaching', 'nav.teaching'],
  ['/teaching/purpose', 'tch.pu.title', 'nav.teaching'],
  ['/teaching/philosophy', 'tch.ph.title', 'nav.teaching'],
  ['/teaching/courses', 'tch.co.title', 'nav.teaching'],
  ['/teaching/strategies', 'tch.st.title', 'nav.teaching'],
  ['/teaching/unit-ops', 'tch.uo.title', 'nav.teaching'],
  ['/teaching/scholarship', 'tch.so.title'],
  ['/teaching/testimonials', 'tch.te.title', 'nav.teaching'],
  ['/teaching/continuing-education', 'training.title'],
  ['/teaching/professional-development', 'profdev.title'],
  ['/research', 'nav.research'],
  ['/research/purpose', 'rc.ph.title', 'nav.research'],
  ['/research/program', 'rc.pg.title'],
  ['/research/products', 'products.title', 'nav.research'],
  ['/research/grants', 'rc.pr.title', 'nav.research'],
  ['/research/students', 'students.title'],
  ['/service', 'nav.service'],
  ['/service/purpose', 'svc.purpose.title', 'nav.service'],
  ['/service/augmented-intelligence', 'ai.title'],
  ['/service/committees', 'committees.title'],
  ['/service/editorial', 'editorial.title'],
  ['/service/editorships', 'editorships.title'],
  ['/service/outreach', 'outreach.title'],
  ['/classroom', 'classroom.title'],
  ['/classroom/archive', 'classroom.archive.title', 'classroom.title'],
];

/** Las páginas cuya entrada no va en `.a-entrada`. */
const DESCRIPCIONES: Record<string, UIKey> = {
  '/classroom': 'classroom.intro',
  '/classroom/archive': 'classroom.archive.intro',
};

/** Curso del SPDP 2026-20: el único con selección, resultados y ética (RetosPage, EticaPage). */
const SPDP_2026_20 = 'iqya-3050-2026-20';

const nombreCurso = (c: Course): string =>
  `${c.kind === 'professional' ? c.title : `${c.code} ${c.title}`} (${c.term})`;

/**
 * Las páginas de un curso. Todas pasan por el código de acceso, así que el HTML
 * solo trae la reja con el nombre del curso: la portada del curso entra al
 * sitemap (salvo los cursos ocultos) y las interiores llevan `noindex`.
 */
function paginasDelCurso(c: Course): Pagina[] {
  const base = `/classroom/${c.slug}`;
  const curso = nombreCurso(c);
  const resumen = igual(c.description);
  const pagina = (ruta: string, titulo: string, descripcion = resumen, indexar = false): Pagina => ({
    ruta,
    titulo: igual(`${titulo} · ${NOMBRE}`),
    descripcion,
    imagen: c.bannerUrl,
    idioma: 'es',
    indexar: indexar && !c.hidden,
  });

  const lista = [pagina(base, curso, resumen, true)];
  if (c.readings.length) lista.push(pagina(`${base}/readings`, `Material del curso · ${curso}`));
  for (const r of c.readings.filter((r) => !r.href)) {
    lista.push(pagina(`${base}/readings/${r.slug}`, `${r.title} · ${curso}`, igual(r.summary)));
  }
  if (c.presentations.length) lista.push(pagina(`${base}/presentations`, `Presentaciones · ${curso}`));
  if (c.simulations?.length) lista.push(pagina(`${base}/simulations`, `Simuladores · ${curso}`));
  if (c.challenges && !c.challenges.href) lista.push(pagina(`${base}/retos`, `${c.challenges.label} · ${curso}`));
  if (c.slug === SPDP_2026_20) {
    lista.push(
      pagina(`${base}/seleccion`, 'Selección de retos · SPDP 2026-20'),
      pagina(`${base}/resultados`, 'Resultados de la selección · SPDP 2026-20'),
      pagina(`${base}/etica`, `Clasifique su reto ante el Comité de Ética · ${curso}`),
    );
  }
  for (const e of c.kind === 'professional' ? c.edcoCourses ?? [] : []) {
    lista.push(pagina(`${base}/cursos/${e.id}`, `${e.title} · ${c.title}`, igual(e.description)));
    if (e.presentationIds?.length) {
      lista.push(pagina(`${base}/cursos/${e.id}/presentations`, `Presentaciones · ${e.title}`, igual(e.description)));
    }
  }
  return lista;
}

let cache: Pagina[] | null = null;

/** Todas las páginas con HTML propio, en el orden del menú. */
export function paginas(): Pagina[] {
  cache ??= [
    PORTADA,
    ...PORTAFOLIO.map(([ruta, titulo, seccion]): Pagina => ({
      ruta,
      titulo: seccion ? componer(texto(titulo), texto(seccion)) : componer(texto(titulo)),
      descripcion: DESCRIPCIONES[ruta] ? texto(DESCRIPCIONES[ruta]) : undefined,
      idioma: 'ui',
      indexar: true,
    })),
    ...classroomData.flatMap(paginasDelCurso),
  ];
  return cache;
}

const sinBarra = (ruta: string): string => (ruta.length > 1 ? ruta.replace(/\/+$/, '') : ruta);

let porRuta: Map<string, Pagina> | null = null;

/** La página de una dirección (con o sin barra final), si tiene HTML propio. */
export function paginaDe(pathname: string): Pagina | undefined {
  porRuta ??= new Map(paginas().map((p) => [p.ruta, p]));
  return porRuta.get(sinBarra(pathname));
}

/** La página o, si no tiene HTML propio (el visor del aula), la más cercana hacia arriba: su curso. */
export function paginaOSuperior(pathname: string): Pagina | undefined {
  for (let ruta = sinBarra(pathname); ruta.length > 1; ruta = ruta.slice(0, ruta.lastIndexOf('/')) || '/') {
    const pagina = paginaDe(ruta);
    if (pagina) return pagina;
  }
  return undefined;
}

/**
 * Si la dirección tiene páginas debajo. Esas páginas se escriben como
 * teaching.html y también como teaching/index.html: GitHub Pages sirve
 * teaching.html para /teaching aunque exista la carpeta (comprobado en vivo el
 * 21 oct 2026), y el index.html responde a quien llega con barra final.
 */
export function tieneHijas(ruta: string): boolean {
  if (ruta === '/') return false;
  const prefijo = `${ruta}/`;
  return paginas().some((p) => p.ruta.startsWith(prefijo)) || REDIRECCIONES.some((r) => r.desde.startsWith(prefijo));
}

/** La dirección completa que se declara como canónica y va en el sitemap. */
export function canonica(ruta: string): string {
  return `${SITIO}${ruta}`;
}

export const tituloDe = (p: Pagina | undefined, lang: Lang): string =>
  (p ?? PORTADA).titulo[p?.idioma === 'es' ? 'es' : lang];

export const idiomaDe = (p: Pagina | undefined, lang: Lang): Lang => (p?.idioma === 'es' ? 'es' : lang);

/** La descripción de la portada, para las páginas que no tienen otra. */
export const descripcionSitio = (lang: Lang): string => PORTADA.descripcion![lang];

/**
 * Una entrada muy corta («Las decisiones que me trajeron hasta aquí.») no dice
 * de quién es la página: se completa con el cargo, como en el pie de página.
 */
export function completarDescripcion(entrada: string, lang: Lang): string {
  const limpio = entrada.replace(/\s+/g, ' ').trim();
  return limpio.length >= 80 ? limpio : `${limpio} ${NOMBRE}, ${ui['footer.role'][lang]}`.trim();
}
