// La válvula de control de globo con los nombres de sus piezas, para el capítulo 12 del libro de operaciones unitarias
// (Válvulas, tuberías y medición de flujo):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Escribe figuras/valvulas-tuberias-y-medicion-de-flujo/_valvula-control.qmd con el SVG del skill anatomy y los
// rótulos (línea y punto, como el divisor de rifles), y out/libro-preview.html para revisarla en el navegador.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/valvulas-tuberias-y-medicion-de-flujo');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, W, H, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/valvula_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas de sus trazos
const nums = [...svg.matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
const minX = Math.min(...nums.map((p) => p[0])), maxX = Math.max(...nums.map((p) => p[0]));
const minY = Math.min(...nums.map((p) => p[1])), maxY = Math.max(...nums.map((p) => p[1]));

const letra = 15, paso = letra * 1.75, ancho = (t) => t.length * letra * 0.56;
// [ancla, lado, texto]; cada lado se ordena por la altura del punto, así las líneas no se cruzan
const R = [
  ['ACTUADOR', 'izq', 'Actuador de diafragma'],
  ['POSICIONADOR', 'izq', 'Posicionador'],
  ['AIR', 'izq', 'Aire al actuador'],
  ['EMPAQUETADURA', 'izq', 'Empaquetadura'],
  ['BONETE', 'izq', 'Bonete'],
  ['BRIDA_IN', 'izq', 'Brida de entrada'],
  ['RESORTE', 'der', 'Resorte'],
  ['DIAFRAGMA', 'der', 'Diafragma'],
  ['INDICADOR', 'der', 'Indicador de carrera'],
  ['ARCADA', 'der', 'Arcada'],
  ['VASTAGO', 'der', 'Vástago'],
  ['OBTURADOR', 'der', 'Obturador'],
  ['ASIENTO', 'der', 'Asiento'],
  ['BRIDA_OUT', 'der', 'Brida de salida'],
  ['CUERPO', 'der', 'Cuerpo'],
];
const xIzq = minX - 26, xDer = maxX + 26;
const lados = { izq: [], der: [] };
for (const [a, lado, t] of R) {
  if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a}`);
  const [ax, ay] = k.iso(ANCLAS[a], P);
  lados[lado].push({ a, t, ax: r1(ax), ay: r1(ay) });
}
// alturas de los textos: tan cerca de su punto como se pueda, sin encimarse y dentro del alto del dibujo
for (const lista of Object.values(lados)) {
  lista.sort((p, q) => p.ay - q.ay);
  lista.forEach((r) => (r.y = r.ay));
  for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + paso);
  const tope = maxY - 4;
  if (lista.length && lista[lista.length - 1].y > tope) { lista[lista.length - 1].y = tope; for (let i = lista.length - 2; i >= 0; i--) lista[i].y = Math.min(lista[i].y, lista[i + 1].y - paso); }
  const piso = minY + 12;
  if (lista.length && lista[0].y < piso) { lista[0].y = piso; for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + paso); }
}
const trazo = (r, izq) => {
  const x = izq ? xIzq : xDer, fin = izq ? x + 5 : x - 5;
  return `<path class="rot-linea" d="M${r.ax} ${r.ay}L${r1(fin)} ${r1(r.y)}"/><circle class="rot-punto" cx="${r.ax}" cy="${r.ay}" r="3"/>` +
    `<text class="rot-texto" x="${r1(x)}" y="${r1(r.y + letra * 0.35)}" text-anchor="${izq ? 'end' : 'start'}" font-size="${letra}">${r.t}</text>`;
};
let trazos = lados.izq.map((r) => trazo(r, true)).join('') + lados.der.map((r) => trazo(r, false)).join('');
// las flechas del flujo, debajo de los tramos de tubo, paralelas al eje
const flecha = (x0, x1, z, texto) => {
  const a = k.iso([x0, 0, z], P), b = k.iso([x1, 0, z], P), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const h = 11, w = 5.5, base = [b[0] - ux * h, b[1] - uy * h];
  const punta = `M${r1(b[0])} ${r1(b[1])}L${r1(base[0] - uy * w)} ${r1(base[1] + ux * w)}L${r1(base[0] + uy * w)} ${r1(base[1] - ux * w)}Z`;
  const t = texto ? `<text class="rot-texto" x="${r1((a[0] + b[0]) / 2 - uy * 16)}" y="${r1((a[1] + b[1]) / 2 + ux * 16 + letra * 0.35)}" text-anchor="middle" font-size="${letra}">${texto}</text>` : '';
  return `<path class="rot-linea rot-flujo" d="M${r1(a[0])} ${r1(a[1])}L${r1(base[0])} ${r1(base[1])}"/><path class="rot-punto" d="${punta}"/>` + t;
};
trazos += flecha(-252, -200, -52, 'Flujo') + flecha(200, 252, -52, 'Flujo');

const izqAncho = Math.max(...lados.izq.map((r) => ancho(r.t))), derAncho = Math.max(...lados.der.map((r) => ancho(r.t)));
const vx = Math.floor(xIzq - izqAncho - 12), vw = Math.ceil(xDer + derAncho + 12 - vx), vy = Math.floor(minY - 10), vh = Math.ceil(maxY + 30 - vy);
const etiqueta = 'Válvula de control de globo de 2 pulgadas, clase 150, en isométrico y en corte, sobre una línea de agua. ' +
  'Abajo, el cuerpo cortado por el plano del flujo: el agua entra por la brida de la izquierda, baja por la galería de abajo, ' +
  'sube por el puerto del anillo de asiento roscado en el puente y sale por la galería de arriba hacia la brida de la derecha: el paso en S. ' +
  'El obturador perfilado, entero, cuelga del vástago a unos 60 % de su carrera, separado del asiento. ' +
  'Encima, el bonete cortado con el buje guía del poste del obturador y la caja de empaquetadura con sus anillos, el seguidor y la brida del prensaestopas con dos espárragos y sus tuercas. ' +
  'La arcada, de dos columnas, sostiene el actuador; entre ellas, el conector que une el vástago del obturador con el del actuador, con la aguja del indicador de carrera frente a su escala en la columna derecha. ' +
  'Arriba, el actuador neumático de diafragma y resorte, con un cuarto de la caja quitado: el aire entra debajo del diafragma y lo levanta (aire para abrir); el resorte, sobre el plato del diafragma, empuja el obturador contra el asiento si falta el aire (falla cerrada). ' +
  'Las dos tapas de la caja se unen por sus bridas con pernos. En la columna izquierda, el posicionador, con su palanca de realimentación enganchada a un pasador del conector y el tubo que lleva el aire a la tapa de abajo del actuador. ' +
  'A cada lado, un tramo corto de tubo con su brida de cuello soldable, el empaque y los espárragos.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), 'valvulas-tuberias-y-medicion-de-flujo/_valvula-control');
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_valvula-control.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_valvula-control.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos, con el CSS de las piezas y el de los rótulos del libro
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Válvula de control (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{width:900px;margin:20px auto}
.iso-libro svg{display:block;width:100%;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`);
console.log('out/libro-preview.html');
