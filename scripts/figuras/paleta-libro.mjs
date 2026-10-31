// La paleta de las figuras isométricas del libro de operaciones unitarias.
//
// La única fuente de los colores es la sección `isometricas` de libro/estilo/paleta.json, en el repositorio del
// libro (../libro-operaciones-unitarias, al lado de este). Aquí se lee esa paleta y se aplica a las vistas del
// libro: cada clase de material de cada figura (tl-ss, pb-cast, ml-conc…) toma los tonos de un material de la
// paleta, así el mismo material sale del mismo color en todos los capítulos. Los simuladores no cambian: esto
// solo toca lo que va al libro (las vistas .qmd, estilo/anatomia.css y estilo/anatomia-molienda.css).
//
//   import { aplicarPaleta, cssAnatomia, cssMolienda } from '../paleta-libro.mjs';   // en cada libro.mjs
//
//   node paleta-libro.mjs                 vuelve a pintar las 18 vistas del libro y los dos CSS, sin rehacer los
//                                         dibujos (los rótulos y la geometría quedan como están)
//   node paleta-libro.mjs --revisar       solo dice qué colores de las vistas no están en paleta.json
//   node paleta-libro.mjs --libro RUTA    si el libro está en otra parte (también LIBRO_OU=RUTA)
//
// Si se cambia un color en paleta.json, basta con correr este script. La vista inglesa del V-102
// (en/figuras/02/v102.svg) lleva los colores resueltos: esa se rehace con separador-v102/libro.mjs.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const argv = process.argv;
const argDe = (k) => { const i = argv.indexOf(k); return i > 0 ? argv[i + 1] : undefined; };
export const LIBRO = resolve(argDe('--libro') || process.env.LIBRO_OU || join(AQUI, '../../../libro-operaciones-unitarias/libro'));
export const RUTA_PALETA = join(LIBRO, 'estilo/paleta.json');

/* ── la paleta ─────────────────────────────────────────────────────────────────────────────────────────── */

const HEX = /^#[0-9A-Fa-f]{6}$/;
let CRUDO = null;
export function paleta() {
  if (!CRUDO) {
    if (!existsSync(RUTA_PALETA)) throw new Error(`paleta: no encuentro ${RUTA_PALETA} (¿está el repositorio del libro al lado de este?)`);
    CRUDO = JSON.parse(readFileSync(RUTA_PALETA, 'utf8'));
  }
  return CRUDO;
}

// Como color() de herramientas/paleta.mjs del libro: un hex se queda, «agua.relleno» va a materiales y «tinta», a base.
function colorBase(ref) {
  const P = paleta();
  if (HEX.test(ref)) return ref.toUpperCase();
  const [a, b] = ref.split('.');
  if (b !== undefined) { const m = P.materiales[a]; if (m && HEX.test(m[b] || '')) return m[b].toUpperCase(); }
  else if (HEX.test(P.base[a] || '')) return P.base[a].toUpperCase();
  throw new Error(`paleta: «${ref}» no es un color de paleta.json`);
}

// Un tono por su nombre: «acero.cara», «agua.sombras.0», «hueco.oscuro» van a la sección isometricas; lo demás, como
// colorBase («solido.oscuro» es el tono oscuro del material sólido de materiales; «azul», el de base).
export function tono(ref) {
  if (HEX.test(ref)) return ref.toUpperCase();
  const [a, b, c] = ref.split('.');
  const iso = paleta().isometricas[a];
  if (iso && typeof iso === 'object' && b !== undefined && b in iso) {
    const v = Array.isArray(iso[b]) ? iso[b][Number(c)] : iso[b];
    if (v === undefined) throw new Error(`paleta: «${ref}» no existe`);
    return colorBase(v);
  }
  return colorBase(ref);
}

// Los tonos de un material para las variables del kit: cara (las caras de frente), tapa y las cuatro sombras.
// Con «/corte», la cara cortada (todo en la sombra más oscura, plana: así se lee el corte en todas las figuras);
// «/corte1», el corte de una pieza que va dentro de otra cortada (la sombra siguiente, para separarlas); «/dentro», la
// cara de adentro de una envolvente abierta, detrás de un líquido (el mismo material, un paso más oscuro, porque la luz
// no le llega); «/fondo», el fondo seco de una envolvente abierta, que tiene que quedar atrás de lo que va adentro: los
// grises de la parte de atrás de una pieza en los cortes en 2D (cortes.pieza-atras, el borde), solo para el acero.
export function tonosDe(spec) {
  if (typeof spec === 'object' && spec.plano) { const t = tono(spec.plano); return { cara: t, tapa: t, s: [t, t, t, t] }; }
  const [nombre, modo] = spec.split('/');
  const m = paleta().isometricas[nombre];
  if (!m || !m.sombras) throw new Error(`paleta: «${nombre}» no es un material de isometricas`);
  const cara = colorBase(m.cara), tapa = colorBase(m.tapa), s = m.sombras.map(colorBase);
  if (!modo) return { cara, tapa, s };
  if (modo === 'corte') return { cara: s[0], tapa: s[0], s: [s[0], s[0], s[0], s[0]] };
  if (modo === 'corte1') return { cara: s[1], tapa: s[1], s: [s[1], s[1], s[1], s[1]] };
  if (modo === 'dentro') return { cara: s[2], tapa: s[3], s: [s[0], s[0], s[1], s[2]] };
  if (modo === 'fondo' && nombre === 'acero') { const [b, r, e, m] = ['borde', 'rejilla', 'eje', 'metal.relleno'].map(tono); return { cara: b, tapa: r, s: [e, m, m, b] }; }
  throw new Error(`paleta: modo «${modo}» desconocido`);
}

const ROL = {
  '--anatomy-paper': 'cara', '--anatomy-face': 'cara', '--anatomy-top': 'tapa', '--anatomy-lit-top': 'tapa',
  '--anatomy-shade-0': 0, '--anatomy-shade-1': 1, '--anatomy-shade-2': 2, '--anatomy-shade-3': 3, '--anatomy-lit-shade': 3,
};
const tonoDeRol = (t, rol) => (typeof rol === 'number' ? t.s[rol] : t[rol]);
export function variables(spec) {
  const t = tonosDe(spec);
  return Object.entries(ROL).filter(([v]) => !v.includes('lit')).map(([v, rol]) => `${v}:${tonoDeRol(t, rol)}`).join(';');
}

/* ── qué material lleva cada clase ─────────────────────────────────────────────────────────────────────────
   Una clase con un material («acero», «fundicion/corte»…) toma sus variables del kit; una con un objeto cambia cada
   propiedad por el tono que se nombra y, si se da un número, deja ese valor (una opacidad). Las reglas que no son de
   una sola clase van por su selector completo. Las clases de cada figura vienen de su build.mjs (o de pb.css y ml.css):
   si una cambia, revisar() lo dice al escribir la vista. */
const LIQ = 0.45;          // el agua (y los demás líquidos) en corte: el tono más hondo del material con esta opacidad
const LIQ_SUP = 0.32;      // su superficie, vista desde arriba
const corte = (pref) => ({ [`${pref}-cut`]: 'acero/corte' });
export const CLASES = {
  // tanque agitado (capítulo 14): la cáscara flota en el agua de la extracción
  ...corte('ta'), 'ta-ss': 'acero', 'ta-trim': 'acero', 'ta-sub': 'agua', 'ta-drive': 'pintado', 'ta-cast': 'fundicion',
  'ta-lever': 'fundicion', 'ta-peel': 'cascara', 'ta-bore': { fill: 'hueco.claro' },
  'ta-liq': { fill: 'agua.sombras.0', 'fill-opacity': LIQ }, 'ta-flujo': { stroke: 'azul' }, 'ta-flecha': { fill: 'azul' },
  // tanque de llegada (capítulo 13)
  ...corte('tl'), 'tl-ss': 'acero', 'tl-pipe': 'acero', 'tl-sub': 'agua', 'tl-str': 'pintado', 'tl-cast': 'fundicion',
  'tl-yel': 'amarillo', 'tl-conc': 'concreto', 'tl-lever': 'fundicion', 'tl-bore': { fill: 'hueco.claro' },
  'tl-liq': { fill: 'agua.sombras.0', 'fill-opacity': LIQ }, 'tl-mesh': { stroke: 'guia' },
  // filtro de arena (capítulo 9): antracita sobre arena
  ...corte('fa'), 'fa-ss': 'acero', 'fa-pipe': 'acero', 'fa-trim': 'acero', 'fa-sub': 'agua', 'fa-noz': 'acero',
  'fa-cast': 'fundicion', 'fa-lever': 'fundicion', 'fa-gauge': 'pintado', 'fa-dial': { fill: 'acero.cara' },
  'fa-bore': { fill: 'hueco.claro' }, 'fa-bore-dk': { fill: 'hueco.oscuro' }, 'fa-hole': { fill: 'hueco.oscuro' },
  'fa-ant-top': { fill: 'antracita.tapa' }, 'fa-ant-y0': { fill: 'antracita.sombras.3' }, 'fa-ant-x0': { fill: 'antracita.sombras.1' },
  'fa-san-y0': { fill: 'solido.sombras.3' }, 'fa-san-x0': { fill: 'solido.sombras.1' },
  'fa-mixa': { fill: 'antracita.cara' }, 'fa-mixs': { fill: 'solido.sombras.3' },
  'fa-gl': { fill: 'blanco' }, 'fa-gh': { fill: 'blanco' }, 'fa-sl': { fill: 'blanco' }, 'fa-gd': { fill: 'tinta' },
  'fa-sd': { fill: 'solido.oscuro' }, 'fa-sk': { fill: 'antracita.cara' },
  '.fa-medio .iso-line[data-tone="mid"]': { stroke: 'tinta-2' }, '.fa-medio .iso-line[data-tone="lo"]': { stroke: 'guia' },
  'fa-flujo': { stroke: 'azul' }, 'fa-flecha': { fill: 'azul' },
  // florentino (capítulo 10): agua abajo, aceite arriba
  ...corte('fl'), 'fl-ss': 'acero', 'fl-in': 'acero/dentro', 'fl-pipe': 'acero', 'fl-trim': 'acero', 'fl-cast': 'fundicion',
  'fl-lever': 'fundicion', 'fl-cu': 'cobre', 'fl-tierra': 'caucho', 'fl-glw': 'agua', 'fl-glo': 'aceite',
  'fl-bore': { fill: 'hueco.claro' }, 'fl-bore-dk': { fill: 'hueco.oscuro' }, 'fl-malla': { fill: 'hueco.medio' },
  'fl-agua-cara': { fill: 'agua.sombras.0', 'fill-opacity': LIQ }, 'fl-agua-sup': { fill: 'agua.sombras.0', 'fill-opacity': LIQ_SUP },
  'fl-inter': { fill: 'agua.sombras.0', 'fill-opacity': LIQ_SUP },
  'fl-aceite-cara': { fill: 'aceite.sombras.0', 'fill-opacity': 0.7 }, 'fl-aceite-sup': { fill: 'aceite.sombras.0', 'fill-opacity': 0.5 },
  'fl-gota': { fill: 'aceite.oscuro' }, 'fl-brillo': { fill: 'aceite.tapa' },
  '.fl-aceite .iso-line[data-tone="hi"],.fl-liq .iso-line[data-tone="hi"]': { stroke: 'aceite.oscuro' },
  '.fl-aceite .iso-line[data-tone="mid"],.fl-liq .iso-line[data-tone="mid"]': { stroke: 'aceite.medio' },
  '.fl-agua .iso-line[data-tone="lo"]': { stroke: 'agua.oscuro' },
  'fl-flujo': { stroke: 'azul' }, 'fl-flujo-p': { fill: 'azul' }, 'fl-flujo-ac': { stroke: 'aceite.oscuro' }, 'fl-flujo-ac-p': { fill: 'aceite.oscuro' },
  // mezclador estático (capítulo 15): el ácido entra al agua
  ...corte('mz'), 'mz-cut-w': 'fundicion/corte', 'mz-cut-gk': 'caucho/corte', 'mz-ss': 'acero', 'mz-weld': 'fundicion',
  'mz-trim': 'acero', 'mz-sub': 'agua', 'mz-el': 'acero', 'mz-gasket': 'caucho', 'mz-lance': 'acero', 'mz-lance-sub': 'agua',
  'mz-bore': { fill: 'hueco.claro' }, 'mz-bore-dark': { fill: 'hueco.oscuro' }, 'mz-flujo': { stroke: 'azul' }, 'mz-flecha': { fill: 'azul' },
  // válvula de control (capítulo 13)
  '.vc-cut,.vc-cut-tr,.vc-cut-gk,.vc-cut-pk,.vc-cut-rb': 'acero/corte', 'vc-cut-tr': 'acero/corte1', 'vc-cut-gk': 'caucho/corte',
  'vc-cut-pk': 'caucho/corte', 'vc-cut-rb': 'caucho/corte', 'vc-trim': 'acero', 'vc-paint': 'pintado', 'vc-pack': 'caucho',
  'vc-rubber': 'caucho', 'vc-copper-fit': 'cobre', 'vc-copper': 'cobre', 'vc-cast': 'fundicion', 'vc-gasket': 'caucho',
  // impulsores (capítulo 14)
  'im-ss': 'acero', 'im-sh': 'pintado', 'im-hw': 'fundicion', 'im-gh': { material: 'acero', opacity: 0.5 }, 'im-cut': 'acero/corte',
  'im-bore': { fill: 'hueco.medio', stroke: 'hueco.oscuro' }, 'im-sock': { fill: 'hueco.oscuro' },
  // filtro prensa (capítulo 18): la torta, la suspensión y el agua del lavado
  '.fp-cake .iso-fill,.fp-cake .iso-top': { fill: 'solido.cara' }, '.fp-cake .iso-top': { fill: 'solido.tapa' },
  '.fp-cake .iso-shade[data-shade="0"]': { fill: 'solido.sombras.0' }, '.fp-cake .iso-shade[data-shade="1"]': { fill: 'solido.sombras.1' },
  '.fp-cake .iso-shade[data-shade="2"]': { fill: 'solido.sombras.2' }, '.fp-cake .iso-shade[data-shade="3"]': { fill: 'solido.sombras.3' },
  '.fp-cake .iso-line': { stroke: 'solido.oscuro' }, '.fp-slurry .iso-fill,.fp-slurry .iso-shade': { fill: 'suspension.relleno' },
  '.fp-wash .iso-fill,.fp-wash .iso-shade': { fill: 'agua.sombras.0' }, 'fp-flow': { stroke: 'azul' }, 'fp-feed': { stroke: 'suspension.medio' },
  'fp-level': { stroke: 'azul' }, '.fp-over .fp-cake .iso-line': { stroke: 'alerta' }, 'fp-setpoint': { stroke: 'alerta' },
  // separador V-102 (edición inglesa, capítulo 2)
  'sv-cav': 'acero/fondo', 'sv-cutface': 'acero/corte', 'sv-mesh': 'acero', 'sv-concrete': 'concreto',
  'sv-tick': { stroke: 'guia' }, 'sv-needle': { stroke: 'tinta' }, 'sv-hub': { fill: 'tinta' },
  'sv-liqface': { fill: 'agua.sombras.0', 'fill-opacity': LIQ }, 'sv-liqtop': { fill: 'agua.sombras.0', 'fill-opacity': LIQ_SUP },
  'sv-nnl': { stroke: 'azul' }, 'sv-nnlmark': { fill: 'azul' }, 'sv-lgliq': { fill: 'agua.oscuro' }, 'sv-lgvap': { fill: 'vidrio.cara' },
  // instalación de bombeo (capítulo de bombas; estas van en estilo/anatomia.css)
  'pb-cast': 'fundicion', 'pb-conc': 'concreto', 'pb-motor': 'pintado', 'pb-glass': 'vidrio',
  'pb-imp-e': { fill: 'metal.medio', stroke: 'tinta' }, 'pb-imp-f': { fill: 'metal.relleno', stroke: 'tinta' },
  'pb-vane-s': { fill: 'metal.oscuro' }, 'pb-vane': { fill: 'acero.sombras.2', stroke: 'tinta' }, 'pb-hub': { fill: 'acero.sombras.1', stroke: 'tinta' },
  'pb-nut': { fill: 'metal.medio', stroke: 'tinta' }, 'pb-bub': { fill: 'blanco', stroke: 'azul' }, 'pb-col': { fill: 'agua.oscuro' },
  'pb-rod': { fill: 'acero.sombras.2', stroke: 'tinta' }, 'pb-wheel': { fill: 'acero.sombras.1', stroke: 'tinta' },
  'pb-spoke': { stroke: 'metal.oscuro' }, 'pb-bolt': { fill: 'tinta' },
  '.fl-dial .fl-tick': { stroke: 'guia' }, 'fl-needle': { stroke: 'alerta' }, 'fl-redarc': { stroke: 'alerta' }, 'fl-hub': { fill: 'tinta' },
  // equipos de molienda y tamizadora (estos van en estilo/anatomia-molienda.css)
  'ml-cast': 'fundicion', 'ml-steel': 'acero', 'ml-conc': 'concreto', 'ml-motor': 'pintado', 'ml-gear': 'fundicion', 'ml-screen': 'acero',
  'ml-inside': 'acero/fondo', 'ml-belt': 'caucho', 'ml-cutface': { fill: 'acero.sombras.0', stroke: 'guia' },
  'ml-liner': { fill: 'caucho.cara', stroke: 'guia' }, 'ml-dark': { fill: 'hueco.medio' },
  '.ml-dial .ml-tick': { stroke: 'guia' }, 'ml-needle': { stroke: 'alerta' }, 'ml-hub': { fill: 'tinta' }, 'ml-dot': { fill: 'guia' },
  'ml-teeth': { stroke: 'guia' }, 'ml-hole': { fill: 'hueco.oscuro', stroke: 'guia' }, 'ml-bush': { fill: 'cobre.sombras.0', stroke: 'guia' },
  'ml-journal': { fill: 'metal.medio', stroke: 'guia' }, 'ml-keyway': { fill: 'hueco.oscuro' }, 'ml-coil': { stroke: 'guia' },
  'ds-groove': { stroke: 'tinta' }, 'ds-grain': { stroke: 'solido.oscuro' }, 'ds-speck': { fill: 'solido.oscuro' },
  'tz-paint': 'pintado', 'tz-steel': 'acero', 'tz-rubber': 'caucho', 'tz-bezel': 'caucho', 'tz-knob': 'caucho',
  'tz-hammer': 'fundicion', 'tz-cork': 'solido', 'tz-green': 'caucho', 'tz-red': { plano: 'alerta' }, 'tz-cordc': 'caucho',
  'tz-slot': { fill: 'hueco.oscuro', stroke: 'guia' }, 'tz-lcdwin': { fill: 'tinta', stroke: 'tinta' }, 'tz-seg': { fill: 'blanco' },
  '.tz-seg.off': { fill: 'tinta-2' }, 'tz-runled': { fill: 'tinta-2', stroke: 'tinta' }, '.tz-runled.on': { fill: 'alerta' },
  'tz-wire': { stroke: 'tinta-2' }, 'tz-grain': { stroke: 'solido.oscuro' },
};

// Las piezas que los dibujos dejan en el tema del kit (el acero) y que son de otro material: el nombre de la pieza
// (data-name, como expresión regular) y su material. Van con las clases mat-* de estilo/anatomia.css.
const PIEZAS = {
  divisor: [[/^bandeja\d\.monton$/, 'solido']],
  planta: [
    [/^stand\.(c101[ab]\.block|e10[12]\.pier\d|cwpit|r101\.base|drain\.e101)$/, 'concreto'],
    [/^r101\.(post\d|rail[FB]|mid[FB]|lrail\d|lstand\d+)$/, 'amarillo'],
    [/^stand\.(rack\.|h101\.leg|v102\.leg)/, 'pintado'],
    [/^c101[ab]\.(motor|tbox|skid|mfeet)$/, 'pintado'], [/^c101[ab]\.(casing|feet)$/, 'fundicion'],
  ],
};

// Las vistas del libro (sin .qmd), con lo propio de cada una: piezas (arriba), colores sueltos que el dibujo escribe
// en línea (style="fill:…", con el color tal como sale), granos (una rampa de tonos que se reparte por luminancia),
// degradados (el ácido del mezclador) y la capa de partículas de los molinos.
const RAMPA_GRANO = ['solido.oscuro', 'solido.sombras.0', 'solido.sombras.1'];
export const VISTAS = {
  'agitacion/_impulsores': {},
  'agitacion/_tanque-agitado': {},
  'bombas/_instalacion': {},
  'bombas/_por-dentro': {},
  'caracterizacion-de-solidos-particulados/_divisor': { piezas: PIEZAS.divisor },
  'filtracion/_prensa': {
    variables: { '--fp-cake': 'solido.cara', '--fp-cake-0': 'solido.sombras.0', '--fp-cake-1': 'solido.sombras.1', '--fp-cake-2': 'solido.sombras.2',
      '--fp-cake-3': 'solido.sombras.3', '--fp-cake-top': 'solido.tapa', '--fp-cake-edge': 'solido.oscuro',
      '--fp-slurry': 'suspension.relleno', '--fp-slurry-edge': 'suspension.medio' },
  },
  'los-diagramas-de-ingenieria/_planta-iso': { piezas: PIEZAS.planta },
  'mezclado/_mezclador-estatico': {
    // build.mjs mezcla el color del ácido con el del agua a lo largo del chorro (grads: mzJ de 0 a 0,12 y mzS de
    // 0,14 a 0,92); aquí cada degradado va del ácido puro al agua, con sus extremos donde la mezcla vale 0 y 1. El
    // ácido lleva los tonos de la cáscara, como el ácido de materiales, y su naranja de borde.
    degradados: { mzJ: [0, 0.12], mzS: [0.14, 0.92] },
    roles: { B: ['cascara.sombras.2', 'agua.sombras.2'], T: ['cascara.tapa', 'agua.tapa'], S: ['cascara.sombras.0', 'agua.sombras.0'], E: ['acido.oscuro', 'agua.sombras.0'] },
  },
  'particulas-en-un-fluido/_filtro-arena': {},
  'reduccion-de-tamano/_molino-bolas': { capa: true },
  'reduccion-de-tamano/_molino-disc': { capa: true, granos: { 'ds-grain': RAMPA_GRANO }, colores: { '#e3b23c': 'solido.cara', 'rgb(152,159,166)': 'metal.oscuro' } },
  'reduccion-de-tamano/_molino-mand': { capa: true },
  'reduccion-de-tamano/_molino-mart': { capa: true },
  'reduccion-de-tamano/_molino-rod': { capa: true },
  'sedimentacion-y-decantacion/_florentino': {},
  'tamizado-y-analisis-granulometrico/_tamizadora': { granos: { 'tz-grain': RAMPA_GRANO } },
  'valvulas-tuberias-y-medicion-de-flujo/_tanque-llegada': {},
  'valvulas-tuberias-y-medicion-de-flujo/_valvula-control': {},
};

/* ── colores en el texto ───────────────────────────────────────────────────────────────────────────────── */

const COLOR = /#[0-9A-Fa-f]{8}\b|#[0-9A-Fa-f]{6}\b|#[0-9A-Fa-f]{3}\b|rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*(?:,\s*[\d.]+\s*)?\)/g;
const hex2 = (n) => Math.round(n).toString(16).padStart(2, '0');
// un color a [r, g, b, alfa]
export function rgbDe(c) {
  c = c.replace(/\s/g, '');
  let m;
  if ((m = /^#([0-9a-f]{3})$/i.exec(c))) return [...m[1]].map((h) => parseInt(h + h, 16)).concat(1);
  if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(c))) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(m[2] ? parseInt(m[2], 16) / 255 : 1);
  if ((m = /^rgba?\(([\d.]+),([\d.]+),([\d.]+)(?:,([\d.]+))?\)$/i.exec(c))) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  throw new Error(`paleta: no entiendo el color «${c}»`);
}
const aHex = ([r, g, b]) => `#${hex2(r)}${hex2(g)}${hex2(b)}`.toUpperCase();
const luz = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;

// Todos los colores de paleta.json (para revisar)
export function coloresDePaleta() {
  const s = new Set();
  const ver = (v) => { if (typeof v === 'string') { if (HEX.test(v)) s.add(v.toUpperCase()); } else if (v && typeof v === 'object') Object.values(v).forEach(ver); };
  ver(paleta());
  return s;
}

// Cambia los colores de una declaración CSS (prop:valor;…) según el material o el objeto de la clase. Un color con
// alfa (rgba) pasa a hex con su opacidad aparte, en fill-opacity o stroke-opacity.
function declaraciones(cuerpo, spec, tubo, donde) {
  const decls = cuerpo.split(';').map((d) => d.trim()).filter(Boolean).map((d) => { const i = d.indexOf(':'); return [d.slice(0, i).trim(), d.slice(i + 1).trim()]; });
  const mat = typeof spec === 'string' || spec.plano ? spec : spec.material;
  const material = !!mat;
  const t = material ? tonosDe(mat) : null;
  const extra = [];
  for (const d of decls) {
    const [prop, valor] = d;
    if (!COLOR.test(valor)) { COLOR.lastIndex = 0; continue; }
    COLOR.lastIndex = 0;
    let nuevo;
    if (material && prop in ROL) nuevo = tonoDeRol(t, ROL[prop]);
    else if (material && tubo && (prop === 'fill' || prop === 'stroke')) nuevo = { body: t.s[2], shine: t.tapa, shade: t.s[0] }[tubo];
    else if (!material && spec[prop] !== undefined && typeof spec[prop] === 'string') nuevo = tono(spec[prop]);
    if (!nuevo) throw new Error(`paleta: en «${donde}» no sé qué tono va en ${prop}:${valor}`);
    d[1] = valor.replace(COLOR, (c) => {
      const a = rgbDe(c)[3];
      if (a < 1 && (prop === 'fill' || prop === 'stroke')) extra.push([`${prop}-opacity`, a]);
      return nuevo;
    });
  }
  // las opacidades: las que pide la clase, o las del alfa que tenía el color
  if (typeof spec === 'object') for (const [k, v] of Object.entries(spec)) if (typeof v === 'number') extra.push([k, v, true]);
  for (const [k, v, fija] of extra) {
    const d = decls.find((x) => x[0] === k);
    if (d) d[1] = String(fija ? v : Math.round(parseFloat(d[1]) * v * 1000) / 1000);
    else decls.push([k, String(v)]);
  }
  return decls.map(([p, v]) => `${p}:${v}`).join(';');
}

// El material de una regla CSS, por su selector completo o por la última clase de cada selector de la lista.
function specDe(selector) {
  const limpio = selector.replace(/\/\*[\s\S]*?\*\//g, '').trim();
  if (CLASES[limpio] !== undefined) return { spec: CLASES[limpio] };
  let hallado = null;
  for (const parte of limpio.split(',').map((s) => s.trim())) {
    const comp = parte.split(/\s+/), ult = comp[comp.length - 1], ant = comp[comp.length - 2];
    let e = null;
    const m = /^\.([\w-]+)$/.exec(ult);
    if (m && CLASES[m[1]] !== undefined) e = { spec: CLASES[m[1]] };
    else if (CLASES[ult] !== undefined) e = { spec: CLASES[ult] };
    else if (/^\.tb-(body|shine|shade)$/.test(ult) && ant && /^\.[\w-]+$/.test(ant) && CLASES[ant.slice(1)] !== undefined) e = { spec: CLASES[ant.slice(1)], tubo: ult.slice(4) };
    if (!e) return null;
    if (hallado && JSON.stringify(hallado) !== JSON.stringify(e)) throw new Error(`paleta: «${limpio}» junta dos materiales`);
    hallado = e;
  }
  return hallado;
}

// Las variables y las reglas del kit (ISO_CSS y lo demás) que no son de un material: el tema claro del libro.
function tema() {
  const T = tonosDe('acero');
  return {
    '--anatomy-page': tono('papel'), '--anatomy-card': tono('blanco'), '--anatomy-text': tono('tinta-2'), '--anatomy-strong': tono('tinta'),
    '--anatomy-muted': tono('guia'), '--anatomy-paper': T.cara, '--anatomy-face': T.cara, '--anatomy-top': T.tapa,
    '--anatomy-shade-0': T.s[0], '--anatomy-shade-1': T.s[1], '--anatomy-shade-2': T.s[2], '--anatomy-shade-3': T.s[3],
    '--anatomy-lit-top': T.tapa, '--anatomy-lit-shade': T.s[3],
    '--anatomy-hi': tono('tinta'), '--anatomy-mid': tono('guia'), '--anatomy-lo': tono('eje'), '--anatomy-faint': tono('borde'), '--anatomy-lit': tono('tinta'),
    '--anatomy-halo': tono('guia'), '--anatomy-dot': tono('tinta'), '--anatomy-ink': tono('tinta'),
    '--anatomy-red': tono('alerta'), '--anatomy-green': tono('oliva'), '--anatomy-blue': tono('azul'),
  };
}

// Las reglas de un CSS con colores: cada una toma los tonos de su material. Las variables del kit con un color de
// respaldo, var(--anatomy-mid,#666), toman el del tema; una regla sin material que ya está en la paleta (los botones de
// los impulsores, el tema) se queda; las demás se cuentan en avisos.
export function reescribirCss(css, avisos = []) {
  const T = tema(), P = coloresDePaleta();
  return css.replace(/([^{}]+)\{([^{}]*)\}/g, (todo, sel, cuerpo) => {
    const c = cuerpo.replace(/var\((--anatomy-[\w-]+),\s*([^)]+)\)/g, (m, v) => (T[v] ? `var(${v},${T[v]})` : m))
      .replace(/var\(--redline,\s*[^)]+\)/g, `var(--redline,${tono('alerta')})`);
    const cols = c.match(COLOR) || [];
    if (!cols.length) return sel + '{' + c + '}';
    const e = specDe(sel);
    if (e) return sel + '{' + declaraciones(c, e.spec, e.tubo, sel.trim()) + '}';
    if (!cols.every((x) => rgbDe(x)[3] === 1 && P.has(aHex(rgbDe(x))))) avisos.push(sel.trim());
    return sel + '{' + c + '}';
  });
}

/* ── las vistas ────────────────────────────────────────────────────────────────────────────────────────── */

// Los degradados del ácido del mezclador: cada uno pasa a dos paradas, del ácido puro (mezcla 0) al agua (mezcla 1),
// con el vector alargado para que esas dos mezclas caigan en sus extremos. El color de cada punto es el mismo de antes.
function degradados(texto, op) {
  return texto.replace(/<linearGradient id="([A-Za-z]+)([BTSE])"([^>]*)>((?:<stop[^>]*\/>)+)<\/linearGradient>/g, (todo, id, rol, attrs, paradas) => {
    const m = op.degradados[id];
    if (!m || /data-paleta/.test(attrs)) return todo;   // los que ya se pintaron se quedan
    const num = (k) => Number(new RegExp(`${k}="([-\\d.]+)"`).exec(attrs)[1]);
    const [x1, y1, x2, y2] = ['x1', 'y1', 'x2', 'y2'].map(num), [m0, m1] = m;
    const en = (q) => [x1 + ((q - m0) / (m1 - m0)) * (x2 - x1), y1 + ((q - m0) / (m1 - m0)) * (y2 - y1)];
    const [a, b] = [en(0), en(1)], r = (v) => Math.round(v * 10) / 10;
    const nuevos = attrs.replace(/x1="[^"]*"/, `x1="${r(a[0])}"`).replace(/y1="[^"]*"/, `y1="${r(a[1])}"`).replace(/x2="[^"]*"/, `x2="${r(b[0])}"`).replace(/y2="[^"]*"/, `y2="${r(b[1])}"`);
    const [de, a_] = op.roles[rol];
    return `<linearGradient id="${id}${rol}" data-paleta="1"${nuevos}><stop offset="0" stop-color="${tono(de)}"/><stop offset="1" stop-color="${tono(a_)}"/></linearGradient>`;
  });
}

// Los colores en línea (style="…" de cada elemento): por la clase del elemento, por la variable o por el color mismo.
function enLinea(texto, op, avisos) {
  // las rampas de granos: los colores distintos de cada clase, ordenados por luminancia
  const rampas = {};
  for (const [cls, rampa] of Object.entries(op.granos || {})) {
    const vistos = new Set();
    for (const m of texto.matchAll(new RegExp(`<[a-z]+[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'g'))) {
      const st = /style="([^"]*)"/.exec(m[0]);
      if (st) for (const c of st[1].match(COLOR) || []) if (!coloresDePaleta().has(aHex(rgbDe(c)))) vistos.add(c.replace(/\s/g, ''));
    }
    const ls = [...vistos].map((c) => [c, luz(rgbDe(c))]), lo = Math.min(...ls.map((x) => x[1])), hi = Math.max(...ls.map((x) => x[1]));
    rampas[cls] = new Map(ls.map(([c, l]) => [c, tono(rampa[Math.round(((l - lo) / (hi - lo || 1)) * (rampa.length - 1))])]));
  }
  const colores = new Map(Object.entries(op.colores || {}).map(([c, ref]) => [c.replace(/\s/g, '').toLowerCase(), ref]));
  const PAL = coloresDePaleta();
  return texto.replace(/<([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g, (todo, tag, attrs, cierre) => {
    if (!/style="[^"]*(#[0-9A-Fa-f]{3}|rgb)/.test(attrs) && !/\s(fill|stroke|stop-color)="(#|rgb)/.test(attrs)) return todo;
    const cls = (/class="([^"]*)"/.exec(attrs) || [, ''])[1].split(/\s+/).filter(Boolean);
    const nuevo = attrs.replace(/style="([^"]*)"/, (s, st) => 'style="' + st.split(';').map((d) => {
      const i = d.indexOf(':'); if (i < 0) return d;
      const prop = d.slice(0, i).trim(), valor = d.slice(i + 1);
      if (!COLOR.test(valor)) { COLOR.lastIndex = 0; return d; }
      COLOR.lastIndex = 0;
      return d.slice(0, i + 1) + valor.replace(COLOR, (c) => {
        const k = c.replace(/\s/g, '');
        if (rgbDe(k)[3] === 1 && PAL.has(aHex(rgbDe(k)))) return c;   // ya está en la paleta (otra pasada)
        const g = cls.find((x) => rampas[x]);
        if (g && rampas[g].has(k)) return rampas[g].get(k);
        if (op.variables && op.variables[prop]) return tono(op.variables[prop]);
        if (colores.has(k.toLowerCase())) return tono(colores.get(k.toLowerCase()));
        const e = cls.map((x) => CLASES[x]).find((x) => x && typeof x === 'object' && x[prop]);
        if (e) return tono(e[prop]);
        avisos.push(`${tag}.${cls.join('.')} ${prop}:${c}`);
        return c;
      });
    }).join(';') + '"');
    return `<${tag}${nuevo}${cierre ? '/' : ''}>`;
  });
}

// Pone las clases mat-* a las piezas que el dibujo dejó en el tema del kit.
function piezas(texto, lista) {
  return texto.replace(/<g class="it" data-name="([^"]*)"([^>]*)>/g, (todo, nombre, resto) => {
    const p = lista.find(([re]) => re.test(nombre));
    return p ? `<g class="it mat-${p[1]}" data-name="${nombre}"${resto}>` : todo;
  });
}

// Una vista (el texto del .qmd o del SVG) con los colores de la paleta. Lanza un error si queda un color que no sabe
// de qué material es; revisar() dice si queda alguno fuera de paleta.json.
export function aplicarPaleta(texto, vista = null) {
  const op = (vista && VISTAS[vista]) || {};
  const avisos = [];
  let t = texto.replace(/<style>([\s\S]*?)<\/style>/g, (m, css) => `<style>${reescribirCss(css, avisos)}</style>`);
  if (op.degradados) t = degradados(t, op);
  t = enLinea(t, op, avisos);
  if (op.piezas) t = piezas(t, op.piezas);
  if (avisos.length) throw new Error(`paleta: ${vista || 'la vista'} tiene colores sin material:\n  ${[...new Set(avisos)].join('\n  ')}`);
  return t;
}

// Los colores de un texto que no están en paleta.json (sin contar las imágenes en data:).
export function revisar(texto) {
  const P = coloresDePaleta(), fuera = new Map();
  const limpio = texto.replace(/data:[a-z]+\/[a-z+]+;base64,[A-Za-z0-9+/=]+/g, '');
  for (const c of limpio.match(COLOR) || []) {
    const h = aHex(rgbDe(c));
    if (!P.has(h)) fuera.set(c, (fuera.get(c) || 0) + 1);
  }
  return fuera;
}

/* ── los dos CSS del libro ─────────────────────────────────────────────────────────────────────────────── */

const MATERIALES = () => Object.entries(paleta().isometricas).filter(([, v]) => v && typeof v === 'object' && v.sombras).map(([k]) => k);
const CABECERA_CSS = (quien) => `/* Las piezas de las figuras isométricas (skill anatomy) del libro, con los colores de estilo/paleta.json (sección
   isometricas). Lo escriben scripts/figuras/paleta-libro.mjs${quien} del repositorio público: no se edita a mano. */\n`;

// estilo/anatomia.css: el CSS del kit (ISO_CSS) con el tema claro del libro, las clases mat-* de cada material y las
// de la instalación de bombeo (pb.css), todo con los tonos de la paleta.
export function cssAnatomia(isoCss, pbCss, quien = ' y bomba/libro.mjs') {
  const T = tema();
  // el tema: el bloque oscuro del kit se va (el libro solo usa el claro) y el claro toma los tonos de la paleta
  let kit = isoCss.replace(/\.iso\{[^}]*\}\s*\.iso\[data-theme="light"\]\{[^}]*\}/, () => {
    const vars = Object.entries(T).map(([k, v]) => `${k}:${v}`).join(';');
    return `.iso,.iso[data-theme="light"]{\n  ${vars};\n  --anatomy-halo-opacity:.32;--anatomy-weight:.6px;--anatomy-ease:cubic-bezier(.32,.72,0,1);\n  --anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;--anatomy-lift:none;\n}`;
  });
  if (kit === isoCss) throw new Error('paleta: no encontré los temas en ISO_CSS');
  const avisos = [];
  kit = reescribirCss(kit, avisos);
  const mats = MATERIALES().map((m) => `.iso .mat-${m}{${variables(m)}}`).join('\n');
  const pb = reescribirCss(pbCss, avisos);
  if (avisos.length) throw new Error(`paleta: anatomia.css tiene reglas sin material:\n  ${avisos.join('\n  ')}`);
  return CABECERA_CSS(quien) + kit.trim() + '\n\n/* los materiales de la paleta, para las piezas que el dibujo deja en el tema del kit */\n' + mats + '\n\n' + pb.trim() + '\n';
}

// estilo/anatomia-molienda.css: las reglas ml-, ds- y tz- de ml.css (sin el lienzo vivo ni el tema azul de planos).
export function cssMolienda(mlCss, quien = ', molienda/libro-molinos.mjs y molienda/libro-tamiz.mjs') {
  const reglas = mlCss.match(/[^{}]+\{[^{}]*\}/g).filter((r) => !/blueprint|canvas/.test(r)).map((r) => r.trim().replace(/^\/\*[\s\S]*?\*\/\s*/, ''));
  const avisos = [];
  const css = reescribirCss(reglas.join('\n'), avisos);
  if (avisos.length) throw new Error(`paleta: anatomia-molienda.css tiene reglas sin material:\n  ${avisos.join('\n  ')}`);
  return CABECERA_CSS(quien) + css + '\n';
}

/* ── la capa de partículas de los molinos ────────────────────────────────────────────────────────────────
   El explorador pinta las partículas en un lienzo, con sus colores; el libro las guarda como una imagen WebP dentro
   del SVG. Esta función, que corre en el navegador, cambia cada píxel por el tono de la paleta que le toca: el mineral
   (cálido) va en la rampa del sólido y las bolas de acero (frías), en la del metal oscuro, por su luminancia. */
export function rampasCapa() {
  const r = (lista) => lista.map(([l, ref]) => [l, rgbDe(tono(ref)).slice(0, 3)]);
  return {
    mineral: r([[40, 'tinta'], [70, 'solido.oscuro'], [178, 'solido.sombras.1'], [215, 'solido.cara'], [250, 'solido.tapa']]),
    acero: r([[40, 'tinta'], [95, 'tinta-2'], [150, 'metal.oscuro'], [235, 'metal.relleno']]),
  };
}
// (en el navegador) recolorear(imageData.data, rampas)
export const RECOLOREAR_JS = `function recolorear(px, R) {
  var en = function (rampa, l) {
    if (l <= rampa[0][0]) return rampa[0][1];
    for (var i = 1; i < rampa.length; i++) if (l <= rampa[i][0]) {
      var a = rampa[i - 1], b = rampa[i], t = (l - a[0]) / (b[0] - a[0]);
      return [a[1][0] + (b[1][0] - a[1][0]) * t, a[1][1] + (b[1][1] - a[1][1]) * t, a[1][2] + (b[1][2] - a[1][2]) * t];
    }
    return rampa[rampa.length - 1][1];
  };
  for (var i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue;
    var r = px[i], g = px[i + 1], b = px[i + 2], l = 0.299 * r + 0.587 * g + 0.114 * b;
    var c = en(r - b > 12 ? R.mineral : R.acero, l);
    px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2];
  }
}`;

// Vuelve a pintar las capas de partículas de una vista (las que aún no tienen data-paleta), en Chromium.
async function capas(texto, pagina) {
  const R = rampasCapa();
  const re = /<image class="ml-capa"( data-paleta="1")? href="(data:image\/webp;base64,[A-Za-z0-9+/=]+)"/g;
  let salida = texto;
  for (const m of [...texto.matchAll(re)]) {
    if (m[1]) continue;
    const url = await pagina.evaluate(async ({ url, R, fn }) => {
      const recolorear = new Function(`${fn}; return recolorear;`)();
      const img = new Image(); img.src = url; await img.decode();
      const cv = document.createElement('canvas'); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      const c = cv.getContext('2d'); c.drawImage(img, 0, 0);
      const d = c.getImageData(0, 0, cv.width, cv.height); recolorear(d.data, R); c.putImageData(d, 0, 0);
      return cv.toDataURL('image/webp', 0.86);
    }, { url: m[2], R, fn: RECOLOREAR_JS });
    salida = salida.replace(m[0], `<image class="ml-capa" data-paleta="1" href="${url}"`);
  }
  return salida;
}

/* ── el script ─────────────────────────────────────────────────────────────────────────────────────────── */

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const soloRevisar = argv.includes('--revisar');
  const k = await import(join(AQUI, '../../.claude/skills/anatomy/kit/iso-kit.mjs'));
  let pagina = null, navegador = null;
  let malos = 0;
  for (const vista of Object.keys(VISTAS)) {
    const ruta = join(LIBRO, 'figuras', vista + '.qmd');
    let texto = readFileSync(ruta, 'utf8');
    if (!soloRevisar) {
      texto = aplicarPaleta(texto, vista);
      if (VISTAS[vista].capa) {
        if (!pagina) {
          const { chromium } = await import('playwright');
          navegador = await chromium.launch({ args: ['--no-sandbox'] });
          pagina = await navegador.newPage();
        }
        texto = await capas(texto, pagina);
      }
      writeFileSync(ruta, texto);
    }
    const fuera = revisar(texto);
    malos += fuera.size;
    console.log(`${fuera.size ? '✗' : '✓'} ${vista}.qmd${fuera.size ? '  fuera de la paleta: ' + [...fuera].map(([c, n]) => `${c}×${n}`).join(' ') : ''}`);
  }
  if (navegador) await navegador.close();
  if (!soloRevisar) {
    writeFileSync(join(LIBRO, 'estilo/anatomia.css'), cssAnatomia(k.ISO_CSS, readFileSync(join(AQUI, 'bomba/pb.css'), 'utf8')));
    writeFileSync(join(LIBRO, 'estilo/anatomia-molienda.css'), cssMolienda(readFileSync(join(AQUI, 'molienda/ml.css'), 'utf8')));
  }
  for (const f of ['anatomia.css', 'anatomia-molienda.css']) {
    const fuera = revisar(readFileSync(join(LIBRO, 'estilo', f), 'utf8'));
    malos += fuera.size;
    console.log(`${fuera.size ? '✗' : '✓'} estilo/${f}${fuera.size ? '  fuera de la paleta: ' + [...fuera].map(([c, n]) => `${c}×${n}`).join(' ') : ''}`);
  }
  if (malos) process.exitCode = 1;
}
