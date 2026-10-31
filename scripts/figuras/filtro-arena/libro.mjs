// El filtro a presión de doble medio con los nombres de sus piezas, para el capítulo 15 del libro de operaciones
// unitarias (Partículas en un fluido):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Escribe figuras/particulas-en-un-fluido/_filtro-arena.qmd con el SVG del skill anatomy y los rótulos (línea y punto,
// como el mezclador estático y el tanque agitado), y out/libro-preview.html para revisarla en el navegador. Cada rótulo
// va en su lugar (x, y del texto en unidades del dibujo), a la izquierda o a la derecha del recipiente; un texto con
// «\n» va en dos renglones y la línea llega al primero.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/particulas-en-un-fluido');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/filtro_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas de sus trazos (relativas después del primer punto); sin los patrones
const trazosSvg = svg.replace(/<defs>[\s\S]*?<\/defs>/, '');
const absol = [];
for (const m of trazosSvg.matchAll(/ d="M(-?[\d.]+)[ ,]?(-?\.?[\d.]+)((?:[lmz][^"]*)?)"/g)) {
  let x = Number(m[1]), y = Number(m[2]);
  absol.push([x, y]);
  const rest = m[3].match(/[lmz]|-?\d*\.?\d+/g) || [];
  let cmd = '', i = 0, sx = x, sy = y;
  while (i < rest.length) {
    const t = rest[i];
    if (/[lmz]/.test(t)) { cmd = t; if (t === 'z') { x = sx; y = sy; } i++; continue; }
    const dx = Number(t), dy = Number(rest[i + 1]); i += 2;
    x += dx; y += dy; if (cmd === 'm') { sx = x; sy = y; cmd = 'l'; }
    absol.push([x, y]);
  }
}
const minX = Math.min(...absol.map((p) => p[0])), maxX = Math.max(...absol.map((p) => p[0]));
const minY = Math.min(...absol.map((p) => p[1])), maxY = Math.max(...absol.map((p) => p[1]));
if (process.argv.includes('--anclas')) {
  console.log('dibujo', r1(minX), r1(minY), r1(maxX), r1(maxY));
  for (const [a, p] of Object.entries(ANCLAS)) { const [x, y] = k.iso(p, P); console.log(a.padEnd(16), r1(x), r1(y)); }
}

const letra = 13, renglon = letra * 1.2, ancho = (t) => t.length * letra * 0.55;
// [ancla, texto, x, y del texto (primer renglón), lado: 'der' (la línea llega por la izquierda del texto) o 'izq']
const RS = [
  ['MANOMETRO_IN', 'Manómetro de la entrada', 300, 22, 'der'],
  ['ENTRADA_TUBO', 'Entrada del agua cruda\ny salida del lavado', 118, 130, 'izq'],
  ['VENTEO', 'Venteo', 118, 178, 'izq'],
  ['DISTRIBUIDOR', 'Distribuidor', 118, 216, 'izq'],
  ['ANTRACITA', 'Antracita', 118, 330, 'izq'],
  ['ARENA', 'Arena', 118, 398, 'izq'],
  ['PLACA', 'Placa de boquillas\n(falso fondo)', 118, 436, 'izq'],
  ['PLENO', 'Pleno', 118, 492, 'izq'],
  ['MANOMETRO_OUT', 'Manómetro de la salida', 118, 592, 'izq'],
  ['SALIDA', 'Salida del agua filtrada', 118, 744, 'izq'],
  ['PATAS', 'Patas', 205, 792, 'izq'],
  ['MANHOL', 'Boca de visita', 512, 118, 'der'],
  ['BOQUILLAS', 'Boquillas', 512, 356, 'der'],
  ['AIRE', 'Entrada del aire', 512, 540, 'der'],
  ['DRENAJE', 'Drenaje', 300, 732, 'der'],
  ['LAVADO', 'Entrada del agua\nde lavado', 512, 692, 'der'],
];
let trazos = '', bx0 = minX, bx1 = maxX, by0 = minY, by1 = maxY;
for (const [a, t, tx, ty, lado] of RS) {
  if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a}`);
  const [ax, ay] = k.iso(ANCLAS[a], P);
  const lineas = t.split('\n'), w = Math.max(...lineas.map(ancho)), der = lado === 'der';
  const ex = der ? tx - 5 : tx + 5, ey = ty - letra * 0.35;
  const tspans = lineas.map((l, i) => `<tspan x="${tx}" dy="${i ? renglon : 0}">${l}</tspan>`).join('');
  trazos += `<path class="rot-linea" d="M${r1(ax)} ${r1(ay)}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r1(ax)}" cy="${r1(ay)}" r="3"/>` +
    `<text class="rot-texto" x="${tx}" y="${ty}" text-anchor="${der ? 'start' : 'end'}" font-size="${letra}">${tspans}</text>`;
  bx0 = Math.min(bx0, der ? tx : tx - w); bx1 = Math.max(bx1, der ? tx + w : tx);
  by0 = Math.min(by0, ty - letra); by1 = Math.max(by1, ty + (lineas.length - 1) * renglon + 4);
}
const vx = Math.floor(bx0 - 10), vw = Math.ceil(bx1 + 10 - vx), vy = Math.floor(by0 - 8), vh = Math.ceil(by1 + 10 - vy);
const etiqueta = 'Filtro a presión de doble medio para el agua de servicios, en isométrico y en corte. ' +
  'Un recipiente vertical de acero de 1,5 m de diámetro, con fondo y tapa elípticos, sobre cuatro patas; se le quitó la mitad que mira al lector por encima del fondo, que queda entero como una taza. ' +
  'Adentro, de abajo hacia arriba: el pleno, que es el espacio bajo una placa plana soldada a la pared; la placa, con una rejilla de boquillas de cabeza ranurada encima y una cola delgada debajo, con un agujerito cerca de arriba; 0,30 m de arena clara directamente sobre la placa, sin grava; 0,50 m de antracita, casi negra y de grano más grueso; y unos 0,60 m de agua libre hasta el distribuidor. ' +
  'El medio queda en el cuarto de atrás a la izquierda, como una tajada: en sus dos caras se ven la arena abajo y la antracita encima, con una interfaz nítida y un poco ondulada; en el cuarto de atrás a la derecha se quitó hasta la placa para que se vean las cabezas de las boquillas. ' +
  'Arriba, el agua cruda entra por la boquilla de la corona y choca con una placa deflectora colgada debajo, que la reparte hacia los lados; por esa misma boquilla sale el agua del lavado. ' +
  'Unas flechas muestran el agua que baja en servicio: entra por la corona, se abre en el distribuidor, baja hacia el medio y, en el pleno, va hacia la salida. ' +
  'En la tapa están el venteo, con su válvula de alivio de aire, y la boca de visita con su tapa empernada. En la tubería de entrada y en la de salida hay un manómetro; los dos juntos leen la caída de presión del lecho. ' +
  'En la pared de la derecha, sobre la placa, un registro de mano y, debajo, la entrada del aire al pleno con su válvula. ' +
  'Abajo salen del fondo la salida del agua filtrada, hacia la izquierda, y la entrada del agua de lavado, hacia la derecha, cada una con su brida y su válvula de mariposa; en el centro, el drenaje con su válvula de bola.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), 'particulas-en-un-fluido/_filtro-arena');
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_filtro-arena.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_filtro-arena.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
// de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Filtro de arena (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:900px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`);
console.log('out/libro-preview.html');
