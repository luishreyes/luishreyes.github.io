// El mezclador estático con los nombres de sus piezas, para el capítulo 14 del libro de operaciones unitarias
// (Mezclado y escalado de tanques agitados):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Escribe figuras/mezclado/_mezclador-estatico.qmd con el SVG del skill anatomy y los rótulos (línea y punto, como el
// tanque agitado y la válvula de control), y out/libro-preview.html para revisarla en el navegador. El dibujo es largo
// y se inclina hacia abajo a la derecha: los rótulos van en los dos triángulos que deja libres, arriba a la derecha y
// abajo a la izquierda, cada uno en su lugar (x, y del texto en unidades del dibujo).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/mezclado');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/mezclador_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas de sus trazos (relativas después del primer punto)
const absol = [];
for (const m of svg.matchAll(/ d="M(-?[\d.]+)[ ,]?(-?\.?[\d.]+)((?:[lmz][^"]*)?)"/g)) {
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

const letra = 15, ancho = (t) => t.length * letra * 0.53;
// [ancla, texto, x, y del texto, lado del texto respecto a la línea]: 'der' (la línea llega por la izquierda del texto)
// o 'izq' (por la derecha)
const RS = [
  ['ACIDO', 'Ácido clorhídrico al 32 %', 74, 34, 'der'],
  ['CONECTOR', 'Conector de compresión', 232, 92, 'der'],
  ['BRIDA_CIEGA', 'Brida ciega', 232, 121, 'der'],
  ['EMPAQUE', 'Empaque', 72, 122, 'izq'],
  ['BOQUILLA', 'Boquilla de 1 in', 232, 150, 'der'],
  ['EL_DER', 'Elemento de giro derecho', 420, 205, 'der'],
  ['EL_IZQ', 'Elemento de giro izquierdo', 512, 232, 'der'],
  ['JUNTA', 'Unión entre elementos, a 90°', 640, 259, 'der'],
  ['BRIDA_OUT', 'Brida de 2½ in, clase 150', 826, 500, 'izq'],
  ['AGUA', 'Agua', 104, 338, 'der'],
  ['LANZA', 'Lanza de inyección del ácido', 162, 372, 'der'],
  ['CHORRO', 'Ácido a la salida de la lanza', 236, 406, 'der'],
  ['TUBO', 'Tubo de 2½ in, cédula 40', 470, 454, 'der'],
];
let trazos = '', bx0 = minX, bx1 = maxX, by0 = minY, by1 = maxY;
for (const [a, t, tx, ty, lado] of RS) {
  if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a}`);
  const [ax, ay] = k.iso(ANCLAS[a], P);
  const w = ancho(t), der = lado === 'der';
  const ex = der ? tx - 5 : tx + 5, ey = ty - letra * 0.35;
  trazos += `<path class="rot-linea" d="M${r1(ax)} ${r1(ay)}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r1(ax)}" cy="${r1(ay)}" r="3"/>` +
    `<text class="rot-texto" x="${tx}" y="${ty}" text-anchor="${der ? 'start' : 'end'}" font-size="${letra}">${t}</text>`;
  bx0 = Math.min(bx0, der ? tx : tx - w); bx1 = Math.max(bx1, der ? tx + w : tx);
  by0 = Math.min(by0, ty - letra); by1 = Math.max(by1, ty + 4);
}
const vx = Math.floor(bx0 - 10), vw = Math.ceil(bx1 + 10 - vx), vy = Math.floor(by0 - 8), vh = Math.ceil(by1 + 10 - vy);
const etiqueta = 'Mezclador estático en una línea de agua de 2½ pulgadas, en isométrico y en corte. ' +
  'Un tramo de tubo horizontal con bridas en los dos extremos, al que se le quitó la mitad que mira al lector: se ven, cortados, la pared del tubo, las bridas y la boquilla de arriba. ' +
  'El agua entra por la izquierda. Por la boquilla de 1 pulgada, cerrada con una brida ciega y un conector de compresión, baja la lanza del ácido clorhídrico al 32 %: entra por arriba, dobla 90 grados y descarga en el centro del tubo, hacia aguas abajo. ' +
  'Medio diámetro más adelante empiezan siete elementos Kenics KMS: cintas torcidas media vuelta en un largo de 1,5 diámetros, una de giro derecho y la siguiente de giro izquierdo, cada una girada 90 grados respecto a la anterior. ' +
  'Un chorro de ácido, dibujado de forma esquemática, sale de la lanza por el eje; la arista de entrada del primer elemento lo parte en dos y cada mitad sigue una cara de la cinta mientras se aclara hasta perderse en el agua. ' +
  'A la derecha, la brida de salida con su cara realzada y el extremo del tubo soldado por dentro.';
const cuerpo = svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`);
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_mezclador-estatico.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_mezclador-estatico.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
// de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mezclador estático (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:900px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`);
console.log('out/libro-preview.html');
