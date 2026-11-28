// El paquete del compresor de tornillo C-401 con los nombres de sus piezas, para el capítulo 26 del libro de operaciones
// unitarias (Refrigeración y congelación):
//
//   node build.mjs --audit && node build.mjs --detalle --audit
//   node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//
// Escribe figuras/refrigeracion-y-congelacion/_compresor-tornillo.qmd en el libro: la vista entera, el círculo con los
// dos rotores engranados (out/detalle.svg, con su propia cámara, más alta), unido por una línea al círculo chico que
// marca de dónde sale, y los rótulos (línea y punto, como el condensador evaporativo y el ciclón); y
// out/libro-preview.html y out/libro-preview-620.html para revisarla (con estilo/anatomia.css del libro y el ancho
// mínimo de 640 px del teléfono). Cada rótulo va en su lugar (x, y del texto en unidades de la vista entera), a la
// izquierda o a la derecha; un texto con «\n» va en dos renglones y la línea llega al primero. La persona de referencia
// (la que pone build.mjs) lleva su rótulo, «Persona de 1,75 m». Con --anclas escribe out/anclas.html, que muestra dónde
// cae cada ancla, para acomodar los rótulos.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
// el repositorio del libro, al lado de este (en la nube va con mayúscula)
const REPO_LIBRO = ['../../../../libro-operaciones-unitarias', '../../../../Libro-operaciones-unitarias'].map((r) => join(AQUI, r)).find((r) => existsSync(r)) || join(AQUI, '../../../../libro-operaciones-unitarias');
const LIBRO = resolve(arg('--salida', join(REPO_LIBRO, 'libro')));
const VISTA = 'refrigeracion-y-congelacion/_compresor-tornillo';
const DEST = join(LIBRO, 'figuras/refrigeracion-y-congelacion');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
for (const f of ['fig.svg', 'detalle.svg', 'fig_data.json', 'detalle_data.json']) if (!existsSync(join(AQUI, 'out', f))) throw new Error(`Falta out/${f}: corra antes node build.mjs y node build.mjs --detalle`);
const r1 = (v) => Math.round(v * 10) / 10;
const leer = (svg, data) => ({ svg: readFileSync(join(AQUI, 'out', svg), 'utf8'), ...JSON.parse(readFileSync(join(AQUI, 'out', data), 'utf8')) });
const FIG = leer('fig.svg', 'fig_data.json');
const DET = leer('detalle.svg', 'detalle_data.json');

/* ---------- la composición: la vista entera, el detalle y la línea que los une ---------- */
// el centro del círculo y su radio, en unidades de la vista entera: arriba a la derecha, sobre el tablero
const POS = [Number(process.env.CT_DX || 662), Number(process.env.CT_DY || 32)];
const RD = Number(process.env.CT_RD || 116), ESC = RD / DET.RDET;
const cuerpoDe = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<style>[^<]*<\/style>/, '');
const estiloDe = (svg) => (svg.match(/<style>([^<]*)<\/style>/) || [, ''])[1];
const CSS_EXTRA = '.ct-det-marca{fill:none;stroke:#525c64;stroke-width:1px}.ct-det-linea{fill:none;stroke:#525c64;stroke-width:1px}';
const tx = POS[0] - (DET.W / 2) * ESC, ty = POS[1] - (DET.H / 2) * ESC;
function punto(a, vista) {
  const D = vista === 'fig' ? FIG : DET, p = D.ANCLAS[a];
  if (!p) throw new Error(`Falta el ancla ${a} (${vista})`);
  const q = k.iso(p, D.P);
  return vista === 'fig' ? q : [tx + q[0] * ESC, ty + q[1] * ESC];
}
// el círculo chico sobre los rotores, en la vista entera, y la línea al detalle
const cm = k.iso(FIG.CDET, FIG.P), rm = DET.RDET / DET.MDET;
const dx = POS[0] - cm[0], dy = POS[1] - cm[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
const marcas = `<circle class="ct-det-marca" cx="${r1(cm[0])}" cy="${r1(cm[1])}" r="${r1(rm)}"/>` +
  `<path class="ct-det-linea" d="M${r1(cm[0] + ux * rm)} ${r1(cm[1] + uy * rm)}L${r1(POS[0] - ux * RD)} ${r1(POS[1] - uy * RD)}"/>`;
// el detalle lleva su propio clipPath (ctDet): en la página no puede repetirse el de otra figura
const detalle = `<g transform="translate(${r1(tx)} ${r1(ty)}) scale(${ESC.toFixed(4)})">${cuerpoDe(DET.svg)}</g>`;
const cuerpo = cuerpoDe(FIG.svg) + marcas + detalle;

// el contorno de un dibujo, de las coordenadas de sus trazos (relativas después del primer punto); sin los patrones
function contorno(svg) {
  const absol = [];
  for (const m of svg.replace(/<defs>[\s\S]*?<\/defs>/g, '').matchAll(/ d="M(-?[\d.]+)[ ,]?(-?\.?[\d.]+)((?:[lmz][^"]*)?)"/g)) {
    let x = Number(m[1]), y = Number(m[2]);
    absol.push([x, y]);
    const rest = m[3].match(/[lmz]|-?\d*\.?\d+/g) || [];
    let cmd = '', i = 0, sx = x, sy = y;
    while (i < rest.length) {
      const t = rest[i];
      if (/[lmz]/.test(t)) { cmd = t; if (t === 'z') { x = sx; y = sy; } i++; continue; }
      const ddx = Number(t), ddy = Number(rest[i + 1]); i += 2;
      x += ddx; y += ddy; if (cmd === 'm') { sx = x; sy = y; cmd = 'l'; }
      absol.push([x, y]);
    }
  }
  return [Math.min(...absol.map((p) => p[0])), Math.min(...absol.map((p) => p[1])), Math.max(...absol.map((p) => p[0])), Math.max(...absol.map((p) => p[1]))];
}

/* ---------- los rótulos ---------- */
// [ancla, vista ('fig' o 'det'), texto, x, y del texto (primer renglón), lado: 'der' (la línea llega por la izquierda
// del texto) o 'izq']. A la izquierda, la succión, el tren motor y lo que va en el extremo del separador; arriba en el
// medio, la válvula y el filtro de la succión; a la derecha del círculo, los rotores, la descarga y el tablero; abajo,
// bajo la losa, lo que va al frente del separador y el enfriador con su termosifón. La persona está frente al
// tablero: nada de la derecha la cruza.
const RS = [
  ['SUCCION', 'fig', 'Succión del nivel alto', 200, 52, 'izq'],
  ['MOTOR', 'fig', 'Motor de 45 kW', 110, 132, 'izq'],
  ['BASTIDOR', 'fig', 'Bastidor del tren motor', 110, 212, 'izq'],
  ['VISOR', 'fig', 'Visor de nivel', 110, 262, 'izq'],
  ['SEPARADOR', 'fig', 'Separador de aceite', 110, 312, 'izq'],
  ['VALV_SUC', 'fig', 'Válvula de cierre\ny retención', 348, 46, 'der'],
  ['FILTRO_SUC', 'fig', 'Filtro de succión', 348, 98, 'der'],
  ['ALIVIO', 'fig', 'Válvula de seguridad', 394, 128, 'der'],
  ['HEMBRA', 'det', 'Rotor hembra', 792, -40, 'der'],
  ['MACHO', 'det', 'Rotor macho', 792, -6, 'der'],
  ['COMPRESOR', 'det', 'Carcasa del compresor', 792, 60, 'der'],
  ['INYECCION', 'det', 'Inyección de aceite', 792, 96, 'der'],
  ['VALV_DESC', 'fig', 'Válvula de cierre de la\ndescarga, al condensador', 792, 150, 'der'],
  ['TABLERO', 'fig', 'Tablero con\nmanómetros', 792, 204, 'der'],
  ['PERSONA', 'fig', 'Persona\nde 1,75 m', 712, 300, 'der'],
  ['BASE', 'fig', 'Base de canales', 95, 455, 'izq'],
  ['FILTRO_ACEITE', 'fig', 'Filtro de aceite', 185, 492, 'izq'],
  ['BOMBA', 'fig', 'Bomba de aceite', 310, 528, 'izq'],
  ['ENFRIADOR', 'fig', 'Enfriador de aceite', 450, 566, 'izq'],
  ['TS_LIQUIDO', 'fig', 'Líquido del termosifón', 530, 566, 'der'],
  ['REGISTRO', 'fig', 'Registro de los coalescedores', 590, 530, 'der'],
];

if (process.argv.includes('--anclas')) anclas();
else libro();

function anclas() {
  const [a0, b0, a1, b1] = contorno(cuerpoDe(FIG.svg));
  console.log('dibujo', r1(a0), r1(b0), r1(a1), r1(b1), '· detalle', POS, RD);
  let m = '';
  const todas = [...Object.keys(FIG.ANCLAS).map((a) => [a, 'fig']), ...Object.keys(DET.ANCLAS).map((a) => [a, 'det'])];
  for (const [a, vista] of todas) {
    const [x, y] = punto(a, vista);
    if (vista === 'det' && Math.hypot(x - POS[0], y - POS[1]) > RD) continue;
    m += `<circle cx="${r1(x)}" cy="${r1(y)}" r="3" fill="#FFF500" stroke="#19222F"/><text x="${r1(x + 5)}" y="${r1(y - 4)}" font-size="8" fill="#B3261E">${a}${vista === 'fig' ? '' : '·d'}</text>`;
    console.log(a.padEnd(18), vista, r1(x), r1(y));
  }
  const css = readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
  writeFileSync(join(AQUI, 'out/anclas.html'), `<!doctype html><html><head><meta charset="utf-8"><style>${css}${estiloDe(FIG.svg)}${CSS_EXTRA} body{margin:0;background:#fff} svg{display:block}</style></head><body><div class="iso" data-theme="light"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-200 -40 1200 680" width="1800" height="1020">${cuerpo}${m}</svg></div></body></html>`);
  console.log('out/anclas.html');
}

function libro() {
  const letra = 13, renglon = letra * 1.2, ancho = (t) => t.length * letra * 0.55;
  let trazos = '';
  let [bx0, by0, bx1, by1] = contorno(cuerpoDe(FIG.svg));
  bx0 = Math.min(bx0, POS[0] - RD); by0 = Math.min(by0, POS[1] - RD); bx1 = Math.max(bx1, POS[0] + RD); by1 = Math.max(by1, POS[1] + RD);
  for (const [a, vista, t, x, y, lado] of RS) {
    const [ax, ay] = punto(a, vista);
    const lineas = t.split('\n'), w = Math.max(...lineas.map(ancho)), der = lado === 'der';
    const ex = der ? x - 5 : x + 5, ey = y - letra * 0.35;
    const tspans = lineas.map((l, i) => `<tspan x="${x}" dy="${i ? renglon : 0}">${l}</tspan>`).join('');
    trazos += `<path class="rot-linea" d="M${r1(ax)} ${r1(ay)}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r1(ax)}" cy="${r1(ay)}" r="3"/>` +
      `<text class="rot-texto" x="${x}" y="${y}" text-anchor="${der ? 'start' : 'end'}" font-size="${letra}">${tspans}</text>`;
    bx0 = Math.min(bx0, der ? x : x - w); bx1 = Math.max(bx1, der ? x + w : x);
    by0 = Math.min(by0, y - letra); by1 = Math.max(by1, y + (lineas.length - 1) * renglon + 4);
  }
  const vx = Math.floor(bx0 - 10), vw = Math.ceil(bx1 + 10 - vx), vy = Math.floor(by0 - 8), vh = Math.ceil(by1 + 10 - vy);
  const etiqueta = 'El paquete del compresor de tornillo de amoníaco C-401 en isométrico, sobre una base de canales de 2,9 m de largo y 1,1 m de ancho. ' +
    'Abajo, a lo largo de la base, el separador de aceite: un recipiente horizontal de 508 mm de diámetro con cabezas elipsoidales, sobre dos sillas, con el visor de nivel al frente, la válvula de seguridad arriba y, en la cabeza de la derecha, la tapa empernada del registro de los coalescedores. ' +
    'Encima del separador, sobre un bastidor de dos canales apoyado en tres sillas, el tren motor: a la izquierda el motor eléctrico de 45 kW con su caja de conexiones, en el medio el acople de espaciador bajo su guarda amarilla, a la que se le quitó la tapa que mira al lector, y a la derecha el compresor de tornillo, pequeño al lado del motor. ' +
    'A la carcasa del compresor se le quitó la mitad de arriba entre la caja de la succión y la de la descarga, y por ahí se ven los dos rotores helicoidales engranados; un círculo arriba a la derecha los muestra ampliados y vistos desde más arriba: el rotor macho, de cuatro lóbulos, adelante, y el hembra, de seis canales, detrás; bajo ellos va el cilindro de la válvula de corredera, que regula la capacidad. ' +
    'La succión baja por una línea desde arriba a la izquierda, con una flecha, pasa por la válvula de cierre y retención, de ángulo, con su volante, y por el filtro de succión, y entra a la carcasa por arriba. ' +
    'La descarga sale por debajo del compresor y baja al separador; el gas limpio sale por arriba del separador, sube, pasa por la retención y por la válvula de cierre de la descarga, con su volante, y sigue hacia el condensador, con otra flecha. ' +
    'El aceite que se junta en el fondo del separador lo toma la bomba de aceite, al frente y abajo a la derecha, y lo sube al enfriador de aceite, un casco vertical a la derecha, enfriado por termosifón: el amoníaco líquido entra al bonete de abajo por una línea que baja por detrás y la mezcla de líquido y vapor sale por arriba. ' +
    'Del enfriador, el aceite vuelve por el frente del separador, con una flecha, al filtro de aceite, con su manómetro, y del filtro sube a la inyección del compresor. ' +
    'Toda la tubería es de acero. En el extremo de la derecha, sobre un pedestal, el tablero con cuatro manómetros, la pantalla del controlador y los botones, con la parada de emergencia en rojo; frente a él, de pie, una persona de 1,75 m da la escala: el tren motor le llega al pecho.';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}"><style>${estiloDe(FIG.svg)}${CSS_EXTRA}</style>${cuerpo}<g class="rotulos">${trazos}</g></svg>`;
  const html = aplicarPaleta(svg, VISTA);
  mkdirSync(DEST, { recursive: true });
  writeFileSync(join(DEST, '_compresor-tornillo.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + html + '</div>\n```\n');
  console.log('_compresor-tornillo.qmd', Math.round(html.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh, '· letra en 620 px:', ((letra * 620) / vw).toFixed(1), 'px');
  // una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las
  // reglas de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
  const cssLibro = join(LIBRO, 'estilo/anatomia.css');
  const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
  const pagina = (anchoMax) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Compresor de tornillo (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:${anchoMax}px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${html}</div></div></body></html>`;
  writeFileSync(join(AQUI, 'out/libro-preview.html'), pagina(900));
  writeFileSync(join(AQUI, 'out/libro-preview-620.html'), pagina(652));
  console.log('out/libro-preview.html, out/libro-preview-620.html');
}
