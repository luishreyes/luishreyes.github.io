// El enfriador de glicol empacado con los nombres de sus piezas, para el capítulo 26 del libro de operaciones unitarias
// (Refrigeración y congelación):
//
//   node build.mjs --audit && node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//
// Escribe figuras/refrigeracion-y-congelacion/_enfriador-glicol.qmd con el SVG del skill anatomy y los rótulos (línea y
// punto, como el condensador evaporativo), y out/libro-preview.html y out/libro-preview-620.html para revisarla en el
// navegador (con estilo/anatomia.css del libro y el ancho mínimo de 640 px del teléfono). Cada rótulo va en su lugar (x, y
// del texto en unidades del dibujo), a la izquierda o a la derecha de su línea; un texto con «\n» va en dos renglones y la
// línea llega al primero. La mano de referencia (la que pone build.mjs) lleva su rótulo, «Mano». Con --anclas imprime
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
const VISTA = 'refrigeracion-y-congelacion/_enfriador-glicol';
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
// A la izquierda, lo del glicol: las dos conexiones con su válvula, el tablero con el controlador, el tanque y la bomba.
// Arriba a la izquierda, sobre el techo, lo que se ve detrás, junto al evaporador (la succión, el bulbo, el evaporador)
// y el tapón del tanque; arriba, la mano y lo que va sobre el techo; arriba a la derecha, el motor del ventilador y los
// presostatos. A la derecha, el condensador y lo que lleva su extremo. Abajo, el camino del líquido (el recibidor, la
// línea, el filtro, la mirilla y la válvula de expansión) y el compresor con su calentador.
const RS = [
  ['VALV_GLY', 'Válvula de bola', 84, 152, 'izq'],
  ['GLY_SUP', 'Glicol a 0 °C a la\ncamisa de TK-201', 84, 188, 'izq'],
  ['GLY_RET', 'Glicol que vuelve\nde la camisa', 84, 262, 'izq'],
  ['CONTROLADOR', 'Controlador de\ntemperatura', 84, 322, 'izq'],
  ['TABLERO', 'Tablero', 84, 368, 'izq'],
  ['TANQUE', 'Tanque del glicol', 84, 404, 'izq'],
  ['BOMBA', 'Bomba del glicol', 84, 440, 'izq'],
  ['EVAPORADOR', 'Evaporador de placas soldadas', 345, 40, 'izq'],
  ['SUCCION', 'Succión aislada', 320, 66, 'izq'],
  ['BULBO', 'Bulbo de la válvula', 284, 92, 'izq'],
  ['TAPON', 'Tapón de llenado', 244, 118, 'izq'],
  ['MANO', 'Mano', 430, 22, 'izq'],
  ['MALLA', 'Malla', 486, 22, 'der'],
  ['AIRE_SALE', 'Aire caliente', 600, 22, 'der'],
  ['VENTILADOR', 'Ventilador axial', 680, 54, 'der'],
  ['MOTOR_VENT', 'Motor del ventilador', 740, 92, 'der'],
  ['PRESOSTATOS', 'Presostatos de\nalta y de baja', 740, 128, 'der'],
  ['CAB_ENTRADA', 'Cabezal de entrada', 860, 250, 'der'],
  ['CONDENSADOR', 'Condensador de\ntubos aleteados', 860, 290, 'der'],
  ['AIRE_ENTRA', 'Aire de afuera', 860, 340, 'der'],
  ['DESCARGA', 'Descarga del compresor', 860, 378, 'der'],
  ['CODOS', 'Codos de retorno', 860, 406, 'der'],
  ['PLACA', 'Placa de datos', 860, 528, 'der'],
  ['ADVERTENCIA', 'Refrigerante inflamable', 860, 562, 'der'],
  ['CAB_SALIDA', 'Cabezal de salida', 860, 600, 'der'],
  ['LIQUIDO', 'Línea de líquido', 300, 600, 'izq'],
  ['RECIBIDOR', 'Recibidor', 380, 640, 'izq'],
  ['MIRILLA', 'Mirilla', 520, 660, 'der'],
  ['FILTRO', 'Filtro secador', 495, 690, 'der'],
  ['TXV', 'Válvula de expansión\ntermostática', 452, 722, 'der'],
  ['COMPRESOR', 'Compresor hermético', 664, 700, 'der'],
  ['CALENTADOR', 'Calentador del cárter', 640, 738, 'der'],
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
const etiqueta = 'Enfriador de glicol empacado, de condensador de aire y con propano, en isométrico: un gabinete de lámina de 1,10 m de largo, 0,65 m de fondo y 0,90 m de alto, sobre dos perfiles y una losa de concreto, al aire libre. ' +
  'Se le quitó el panel entero del costado largo que mira al lector, de la base al techo, y por ahí se ve adentro. ' +
  'El extremo de la derecha es el condensador, un serpentín de tubos de cobre con aletas, con la placa de datos y la advertencia del refrigerante inflamable abajo; por la cara de adelante del serpentín se ven los codos de retorno de los tubos y, a un lado, los cabezales de entrada y de salida. ' +
  'En el techo, sobre el condensador, va el ventilador axial con su malla; su motor cuelga adentro de tres brazos. Flechas blancas muestran el aire de afuera que entra por el condensador y sale caliente por la malla. ' +
  'A la derecha, adelante, el compresor hermético, oscuro, sobre cuatro gomas, con el calentador del cárter y la caja de bornes; su descarga sube hasta el cabezal de entrada del condensador. ' +
  'Del cabezal de salida, abajo, el líquido llega recto al recibidor, un cilindro vertical adelante en el medio, con su válvula encima; de ella sale la línea de líquido, de cobre, que corre hacia atrás con el filtro secador y la mirilla y entra a la válvula de expansión termostática. ' +
  'La válvula alimenta el evaporador de placas soldadas, contra la pared de atrás; su bulbo va sujeto a la succión, que sale del evaporador, sube aislada en negro y baja al compresor, y el igualador va de la válvula a la succión, después del bulbo. A la derecha del evaporador, en la pared de atrás, los presostatos de alta y de baja, con sus capilares. ' +
  'A la izquierda, el tanque del glicol, con su tapa, el tapón de llenado, la sonda del controlador y el visor de nivel, y adelante la bomba del glicol con su motor. La bomba sube el glicol y lo saca por el extremo de la izquierda hacia la camisa de TK-201, y el que vuelve entra por el mismo extremo al evaporador y del evaporador baja al tanque; afuera, cada línea lleva su válvula de bola y su unión. ' +
  'En el extremo de la izquierda, por dentro, el tablero con el controlador de temperatura, el interruptor y dos pilotos, y las rejillas de ventilación. ' +
  'Una mano apoyada en el canto de atrás del techo da la escala: el equipo llega a la cintura de una persona.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), VISTA);
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_enfriador-glicol.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_enfriador-glicol.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
// de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
const pagina = (ancho) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Enfriador de glicol (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:${ancho}px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`;
writeFileSync(join(AQUI, 'out/libro-preview.html'), pagina(900));
writeFileSync(join(AQUI, 'out/libro-preview-620.html'), pagina(652));
console.log('out/libro-preview.html');
