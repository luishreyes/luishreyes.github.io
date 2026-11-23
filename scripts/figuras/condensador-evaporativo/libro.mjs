// El condensador evaporativo con los nombres de sus piezas, para el capítulo 26 del libro de operaciones unitarias
// (Refrigeración y congelación):
//
//   node build.mjs --audit && node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//
// Escribe figuras/refrigeracion-y-congelacion/_condensador-evaporativo.qmd con el SVG del skill anatomy y los rótulos
// (línea y punto, como el filtro de arena y el florentino), y out/libro-preview.html para revisarla en el navegador (con
// estilo/anatomia.css del libro y el ancho mínimo de 640 px del teléfono). Cada rótulo va en su lugar (x, y del texto en
// unidades del dibujo), a la izquierda o a la derecha de la caja (los de abajo, bajo la losa); un texto con «\n» va en
// dos renglones y la línea llega al primero. La persona de referencia (la que pone build.mjs) lleva su rótulo, «Persona de 1,75 m». Con --anclas imprime
// dónde cae cada ancla, para acomodar los rótulos.
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
const VISTA = 'refrigeracion-y-congelacion/_condensador-evaporativo';
const DEST = join(LIBRO, 'figuras/refrigeracion-y-congelacion');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/fig_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas de sus trazos (relativas después del primer punto); sin los patrones
const absol = [];
for (const m of svg.replace(/<defs>[\s\S]*?<\/defs>/, '').matchAll(/ d="M(-?[\d.]+)[ ,]?(-?\.?[\d.]+)((?:[lmz][^"]*)?)"/g)) {
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
// A la izquierda, lo de arriba (la malla, el ventilador y la chimenea), lo que se ve por el costado abierto (los
// eliminadores, el distribuidor, las boquillas y el haz) y la persona; abajo, lo de la bandeja; a la derecha, el motor
// y lo que llega y sale por el extremo de +x: el amoníaco, el agua y la bomba.
const RS = [
  ['MALLA', 'Malla', 172, 92, 'izq'],
  ['VENTILADOR', 'Ventilador axial', 172, 128, 'izq'],
  ['CHIMENEA', 'Chimenea', 172, 170, 'izq'],
  ['ELIMINADORES', 'Eliminadores de gotas', 74, 262, 'izq'],
  ['DISTRIBUIDOR', 'Distribuidor de agua', 74, 292, 'izq'],
  ['BOQUILLA', 'Boquillas', 74, 320, 'izq'],
  ['HAZ', 'Haz de serpentines', 74, 360, 'izq'],
  ['PERSONA', 'Persona\nde 1,75 m', 14, 500, 'izq'],
  ['AGUA', 'Bandeja con el agua', 150, 800, 'izq'],
  ['FLOTADOR', 'Válvula de flotador', 300, 820, 'izq'],
  ['REBOSE', 'Rebose', 400, 800, 'der'],
  ['MOTOR', 'Motor del ventilador', 470, 150, 'der'],
  ['CORREA', 'Correa en su guarda', 470, 196, 'der'],
  ['VALV_VAPOR', 'Válvula de corte', 645, 318, 'der'],
  ['VAPOR_END', 'Vapor de amoníaco\ndel compresor', 645, 352, 'der'],
  ['CAB_ENTRADA', 'Cabezal de entrada', 645, 410, 'der'],
  ['TUBERIA', 'Tubería al distribuidor', 645, 444, 'der'],
  ['LIQUIDO_END', 'Líquido al recibidor', 645, 524, 'der'],
  ['PERSIANAS', 'Persianas de la\nentrada de aire', 645, 566, 'der'],
  ['CAB_SALIDA', 'Cabezal de salida', 645, 610, 'der'],
  ['PURGA', 'Purga', 645, 640, 'der'],
  ['REPOSICION', 'Agua de reposición', 645, 668, 'der'],
  ['BOMBA', 'Bomba de recirculación', 645, 700, 'der'],
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
const etiqueta = 'Condensador evaporativo de amoníaco, de tiro inducido a contracorriente, en isométrico: una caja de lámina galvanizada de 3,0 m de largo, 1,8 m de ancho y 3,45 m de alto, sobre dos vigas y una losa de concreto, con la chimenea del ventilador encima. ' +
  'Se le quitó el panel entero del costado largo que mira al lector, del fondo de la bandeja al techo, y por ahí se ve adentro. ' +
  'En el medio está el haz: muchos circuitos de tubo de acero que bajan en zigzag, cada paso un poco inclinado hacia donde corre y unido al siguiente por una curva en U, entre el cabezal de entrada, arriba, y el de salida, abajo, los dos junto al extremo de la derecha; el haz descansa en dos perfiles que lo cruzan por debajo. ' +
  'Encima del haz, el distribuidor de agua: un cabezal y cinco ramales con boquillas que rocían gotas azules sobre los tubos. Más arriba, los eliminadores de gotas, un paquete de hojas en V, y el techo. ' +
  'Abajo, la bandeja con el agua, translúcida, con la válvula de flotador que repone el agua y el tubo de rebose; entre la bandeja y el haz queda la entrada del aire, con persianas inclinadas en los otros tres costados. ' +
  'Sobre el techo, la chimenea redonda con la malla de alambre encima; por la malla se ven las seis aspas del ventilador axial, y por fuera de la chimenea va el motor, de eje vertical, con la correa en una guarda amarilla que entra a la chimenea. ' +
  'En el extremo de la derecha, entero, están la puerta de inspección, la placa de datos y las persianas, y salen las conexiones: arriba entra el vapor de amoníaco del compresor y abajo sale el líquido hacia el recibidor, con una pendiente de 1 en 50, cada línea con su válvula de corte y terminada en un par de bridas. ' +
  'Al pie de ese extremo, la bomba de recirculación toma el agua de la bandeja por una válvula y la sube por una tubería que entra por la pared al distribuidor; de esa tubería sale la purga, con su válvula, hacia un embudo sobre el desagüe, y al lado entra el agua de reposición. ' +
  'Flechas blancas muestran el aire que entra por las persianas, sube por el haz y sale por la malla, y el agua que cae de las boquillas. ' +
  'A la izquierda, de pie en el piso, una persona de 1,75 m da la escala: la caja le dobla la estatura.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), VISTA);
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_condensador-evaporativo.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_condensador-evaporativo.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
// de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
const pagina = (ancho) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Condensador evaporativo (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:${ancho}px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`;
writeFileSync(join(AQUI, 'out/libro-preview.html'), pagina(900));
writeFileSync(join(AQUI, 'out/libro-preview-620.html'), pagina(652));
console.log('out/libro-preview.html');
