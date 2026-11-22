// El extractor de vapor vivo con los nombres de sus piezas, para el capítulo 32 del libro de operaciones unitarias
// (Arrastre de vapor):
//
//   node build.mjs --audit && node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//
// Escribe figuras/arrastre-de-vapor/_extractor.qmd con el SVG del skill anatomy y los rótulos (línea y punto, como el
// filtro de arena y el florentino), y out/libro-preview.html para revisarla en el navegador (con estilo/anatomia.css
// del libro y el ancho mínimo de 640 px del teléfono). Cada rótulo va en su lugar (x, y del texto en unidades del
// dibujo), a la izquierda o a la derecha del recipiente; un texto con «\n» va en dos renglones y la línea llega al
// primero. La persona de referencia (la que pone build.mjs) lleva su rótulo, «Persona de 1,75 m». Con --anclas imprime
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
const VISTA = 'arrastre-de-vapor/_extractor';
const DEST = join(LIBRO, 'figuras/arrastre-de-vapor');
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
// A la izquierda, lo de la tapa, el corte y la carga, la purga y la persona; a la derecha, lo que llega y sale por la
// franja de la derecha y lo que se ve por el cuarto sin carga (la rejilla y el distribuidor).
const RS = [
  ['PSV', 'Válvula de seguridad', 120, 62, 'izq'],
  ['TAPA', 'Tapa con cierre rápido', 120, 196, 'izq'],
  ['ESPACIO', 'Espacio para\nel hinchamiento', 120, 268, 'izq'],
  ['CANASTA', 'Canasta con la cáscara', 120, 352, 'izq'],
  ['AISLAMIENTO', 'Aislamiento', 120, 425, 'izq'],
  ['PERSONA', 'Persona\nde 1,75 m', 26, 640, 'izq'],
  ['TRAMPA', 'Purga con trampa', 172, 870, 'der'],
  ['CUELLO', 'Cuello de cisne,\nal condensador', 600, 40, 'der'],
  ['TERMOMETRO', 'Termómetro de la salida', 600, 96, 'der'],
  ['MANOMETRO', 'Manómetro', 600, 150, 'der'],
  ['TERMOPARES', 'Termopares del lecho', 600, 500, 'der'],
  ['REJILLA_TOP', 'Rejilla', 600, 614, 'der'],
  ['XV', 'Válvula todo o nada', 600, 638, 'der'],
  ['VAPOR_END', 'Vapor vivo de la caldera', 600, 680, 'der'],
  ['DISTRIBUIDOR', 'Distribuidor de vapor', 600, 718, 'der'],
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
const etiqueta = 'Extractor de arrastre con vapor vivo, en isométrico y en corte: uno de los cuatro de la batería. ' +
  'Un recipiente vertical de acero inoxidable de 1,8 m de diámetro, aislado con lana mineral y su chaqueta de lámina, con el fondo y la tapa elípticos, sobre cuatro patas; se le quitó la mitad que mira al lector entre el fondo, que queda entero como una taza, y el borde de arriba del aislamiento, así que arriba quedan enteros el cuello del cuerpo, las bridas y la tapa. ' +
  'En los dos bordes del corte se ven la pared, la lana amarilla y la chaqueta. ' +
  'Adentro, una canasta de lámina con el fondo perforado, la rejilla, apoyada con una junta sobre un anillo soldado a la pared, lleva 2,0 m de cáscara de naranja desgarrada: trozos naranjas con algunas caras blancas y huecos oscuros entre ellos, dibujados más grandes que los reales. ' +
  'La cáscara queda en el cuarto de atrás a la izquierda, como una tajada; en el cuarto de atrás a la derecha se quitó hasta la rejilla, para que se vean la placa perforada y tres termopozos que entran al lecho por la pared de la derecha a tres alturas. ' +
  'Sobre la cáscara queda un espacio vacío hasta la tapa, para el tercio que se hincha la carga al destilar. ' +
  'Debajo de la rejilla está el pleno, vacío, con un anillo perforado de tubo, el distribuidor, apoyado en ménsulas y alimentado por un brazo que llega de la pared. ' +
  'Por la derecha entra el vapor vivo de la caldera: la línea pasa por una válvula de bola con actuador neumático, la válvula todo o nada, y entra al pleno. ' +
  'Unas flechas blancas muestran el vapor que sale de los agujeros del anillo, sube por la cáscara y sale por arriba. ' +
  'La tapa se cierra con doce abrazaderas en C alrededor de las dos bridas, con un tornillo de manija en T cada una; en ella están la válvula de seguridad, a la izquierda, un manómetro con su sifón y, en el centro, el cuello de cisne de 4 in: sube un poco, dobla y baja con pendiente hacia la derecha, hacia el condensador, con un termómetro de carátula en el tramo que sube y una junta de bridas para soltar la tapa. ' +
  'Abajo, del polo del fondo sale la purga: baja, pasa entre dos patas hacia la izquierda, por una válvula, un filtro en Y y la trampa de flotador, y descarga en un embudo sobre el sumidero del piso. ' +
  'A la izquierda, de pie en el piso junto a la trampa, una persona de 1,75 m da la escala: la rejilla le queda a la altura del hombro.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), VISTA);
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_extractor.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_extractor.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
// de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
const pagina = (ancho) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Extractor de arrastre (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:${ancho}px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`;
writeFileSync(join(AQUI, 'out/libro-preview.html'), pagina(900));
writeFileSync(join(AQUI, 'out/libro-preview-620.html'), pagina(652));
console.log('out/libro-preview.html');
