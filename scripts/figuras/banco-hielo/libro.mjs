// El banco de hielo con los nombres de sus piezas, para el capítulo 26 del libro de operaciones unitarias
// (Refrigeración y congelación):
//
//   node build.mjs --audit && node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//
// Escribe figuras/refrigeracion-y-congelacion/_banco-hielo.qmd con el SVG del skill anatomy y los rótulos (línea y
// punto, como el condensador evaporativo), y out/libro-preview.html para revisarla en el navegador (con
// estilo/anatomia.css del libro y el ancho mínimo de 640 px del teléfono). Cada rótulo va en su lugar (x, y del texto en
// unidades del dibujo), a la izquierda o a la derecha del tanque (los de abajo, bajo el pedestal); un texto con «\n» va
// en dos renglones y la línea llega al primero. La persona de referencia (la que pone build.mjs) lleva su rótulo,
// «Persona de 1,75 m». Con --anclas imprime dónde cae cada ancla, para acomodar los rótulos.
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
const VISTA = 'refrigeracion-y-congelacion/_banco-hielo';
const DEST = join(LIBRO, 'figuras/refrigeracion-y-congelacion');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/fig_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas de sus trazos (relativas después del primer punto)
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
// A la izquierda, la línea del retorno y lo que se ve por el costado abierto (el distribuidor, el haz con su hielo, el
// tubo desnudo, las burbujas y la tubería del aire) y la persona; abajo, el agua, los soportes y el pedestal; a la
// derecha, lo de encima del tanque (el separador y sus líneas, el control del espesor y los cabezales) y lo del extremo
// de +x (el soplador, la salida del agua y el visor).
const RS = [
  ['RETORNO_END', 'Agua que vuelve\nde los usuarios', 176, 102, 'izq'],
  ['TAPA', 'Tapa de paneles aislados', 300, 40, 'der'],
  ['HAZ', 'Haz de serpentines', 132, 152, 'izq'],
  ['DISTRIBUIDOR', 'Distribuidor\ndel agua', 100, 214, 'izq'],
  ['PERSONA', 'Persona\nde 1,75 m', 12, 392, 'izq'],
  ['ESPESOR', 'Control del espesor\ndel hielo', 450, 92, 'der'],
  ['AGUA', 'Agua del tanque', 172, 500, 'izq'],
  ['AIRE', 'Tubería de aire', 246, 524, 'izq'],
  ['BURBUJAS', 'Burbujas del aire', 320, 548, 'izq'],
  ['RAMAL', 'Ramal perforado', 394, 572, 'izq'],
  ['TUBO', 'Tubo del serpentín', 474, 596, 'izq'],
  ['HIELO', 'Capa de hielo', 548, 620, 'izq'],
  ['SUCCION_END', 'Vapor a la succión\ndel compresor', 850, 100, 'der'],
  ['VALV_NIVEL', 'Válvula de nivel', 850, 140, 'der'],
  ['LIQUIDO_END', 'Líquido del recibidor', 850, 168, 'der'],
  ['SEPARADOR', 'Separador de baja', 850, 196, 'der'],
  ['PIERNA', 'Pierna de líquido', 850, 224, 'der'],
  ['CAB_VAPOR', 'Cabezal de salida\nde la mezcla', 850, 256, 'der'],
  ['CAB_LIQUIDO', 'Cabezal de entrada\ndel líquido', 850, 296, 'der'],
  ['VISOR', 'Visor de nivel', 850, 380, 'der'],
  ['VALV_SALIDA', 'Válvula de la salida', 850, 440, 'der'],
  ['SALIDA_END', 'Agua helada\na los usuarios', 866, 548, 'der'],
  ['FILTRO', 'Filtro del aire', 780, 598, 'der'],
  ['SOPLADOR', 'Soplador', 780, 650, 'der'],
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
const etiqueta = 'Banco de hielo de amoníaco, de fusión externa, en isométrico: un tanque rectangular abierto a la atmósfera, de 6,25 m de largo, 2,87 m de ancho y 2,6 m de alto por dentro, de lámina de acero con poliuretano y forro, sobre un pedestal de concreto, con una tapa de paneles aislados a la que le faltan dos. ' +
  'Se le quitó la pared entera del costado largo que mira al lector, y por ahí se ve adentro. ' +
  'El haz de serpentines llena el tanque: muchos circuitos verticales de tubo en zigzag, uno detrás de otro, cada tubo cubierto por una capa gruesa de hielo blanco azulado, sobre perfiles en el fondo y una pletina por circuito. En el circuito de adelante falta el hielo en un tramo, junto a una pletina, y se ven el tubo desnudo y el anillo de hielo cortado. ' +
  'El agua, translúcida, llega casi hasta el borde; donde faltan paneles de la tapa se ve su superficie, con los anillos de las burbujas que revientan. En el fondo, la tubería de aire corre por el pasillo de adelante, con ramales bajo el haz, y las burbujas suben por el pasillo. En el extremo de la izquierda está el distribuidor del agua que vuelve de los usuarios, que llega por una línea sobre la tapa. ' +
  'Sobre el agua, junto al extremo de la derecha, van el cabezal de salida de la mezcla y el de entrada del líquido, con el tramo de cada circuito hasta su cabezal. En la tapa, la caja del control del espesor del hielo, con su electrodo, que baja por el pasillo de adelante. ' +
  'El extremo de la derecha está entero: la salida del agua helada con su válvula, el visor de nivel y la placa de datos; al pie, el soplador con su filtro y sus silenciadores, y la descarga del aire, con su retención, que sube junto a la pared y entra sobre el agua. ' +
  'Encima del tanque, sobre dos vigas, el separador de baja aislado, con la pierna de líquido que baja por su válvula al cabezal de entrada, la mezcla que vuelve del cabezal de salida, la succión que sube y va hacia el compresor con su válvula de corte, el líquido que llega del recibidor por la válvula de nivel, la válvula de seguridad y el manómetro. ' +
  'Flechas blancas muestran el agua que entra, corre a lo largo del tanque y sale. A la izquierda, de pie en el piso, una persona de 1,75 m da la escala: el tanque le lleva más de un metro.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), VISTA);
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_banco-hielo.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_banco-hielo.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
// de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
const pagina = (ancho) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Banco de hielo (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:${ancho}px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`;
writeFileSync(join(AQUI, 'out/libro-preview.html'), pagina(900));
writeFileSync(join(AQUI, 'out/libro-preview-620.html'), pagina(652));
console.log('out/libro-preview.html');
