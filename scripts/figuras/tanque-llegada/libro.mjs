// El tanque de llegada con los nombres de sus piezas, para el capítulo 12 del libro de operaciones unitarias
// (Válvulas, tuberías y medición de flujo):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Escribe figuras/valvulas-tuberias-y-medicion-de-flujo/_tanque-llegada.qmd con el SVG del skill anatomy y los
// rótulos (línea y punto, como la válvula de control), y out/libro-preview.html para revisarla en el navegador.
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
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/tanque_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas absolutas de sus trazos
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

const letra = 13, paso = letra * 1.75, ancho = (t) => t.length * letra * 0.56;
// Los rótulos, en un solo arreglo para traducirlos: [ancla, lado, texto]. Cada lado se ordena por la altura del
// punto, así las líneas no se cruzan.
export const ROTULOS = [
  ['LLEGADA', 'izq', 'Llegada de la bomba'],
  ['VALVULA', 'izq', 'Válvula de control'],
  ['RESPIRADERO', 'izq', 'Respiradero con malla'],
  ['TECHO', 'izq', 'Techo fijo de cono'],
  ['REBOSE', 'izq', 'Rebose'],
  ['BOCA', 'izq', 'Boca de inspección'],
  ['LT', 'izq', 'Transmisor de nivel LT‑101'],
  ['SALIDA', 'izq', 'Salida a la planta'],
  ['ESTRUCTURA', 'izq', 'Estructura'],
  ['BARANDA', 'der', 'Baranda'],
  ['BOCA_TECHO', 'der', 'Boca de inspección del techo'],
  ['HH', 'der', 'Interruptor de muy alto nivel'],
  ['ENTREGA', 'der', 'Entrega bajo el nivel'],
  ['ESCALERA', 'der', 'Escalera con jaula'],
  ['DRENAJE', 'der', 'Drenaje'],
];
const xIzq = minX - 24, xDer = maxX + 24;
const lados = { izq: [], der: [] };
for (const [a, lado, t] of ROTULOS) {
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
  return `<path class="rot-linea" d="M${r.ax} ${r.ay}L${r1(fin)} ${r1(r.y)}"/><circle class="rot-punto" cx="${r.ax}" cy="${r.ay}" r="2.6"/>` +
    `<text class="rot-texto" x="${r1(x)}" y="${r1(r.y + letra * 0.35)}" text-anchor="${izq ? 'end' : 'start'}" font-size="${letra}">${r.t}</text>`;
};
const trazos = lados.izq.map((r) => trazo(r, true)).join('') + lados.der.map((r) => trazo(r, false)).join('');

const izqAncho = Math.max(...lados.izq.map((r) => ancho(r.t))), derAncho = Math.max(...lados.der.map((r) => ancho(r.t)));
const vx = Math.floor(xIzq - izqAncho - 10), vw = Math.ceil(xDer + derAncho + 10 - vx), vy = Math.floor(minY - 10), vh = Math.ceil(maxY + 12 - vy);
const etiqueta = 'El tanque de llegada del caso, en isométrico y en corte: un cilindro vertical de acero de 3,0 m de diámetro con fondo plano y techo fijo de cono, sobre una estructura de cuatro columnas de tubo. ' +
  'El fondo está a 9,0 m sobre el eje de la bomba; la estructura se dibuja con un corte, y abajo quedan los pedestales de concreto y las placas base, a −0,7 m. ' +
  'Se quitó el cuarto del tanque que mira al lector: se ven, cortadas, la envolvente, el ángulo del borde y el techo, y adentro el agua hasta el nivel normal, a 12,0 m, con su superficie. ' +
  'La descarga de la bomba llega por arriba, a 13 m, por un tubo de 2½ in; pasa por la válvula de control de globo, con su actuador de diafragma, por un carrete recto y por el codo de la bajada, y entra por una boquilla del techo. ' +
  'Adentro, el tubo baja hasta 1 m bajo el nivel normal y entrega el agua sumergido. ' +
  'En el techo están el respiradero de cuello de ganso de 2 in, con dos codos y la boca hacia abajo con su malla; la boca de inspección del techo, partida por el corte, con su tapa, su manija y su bisagra; el interruptor de muy alto nivel, cuya horquilla cuelga adentro entre el nivel normal y el rebose; y una baranda en el borde, junto a la escalera. ' +
  'En la envolvente, a la izquierda: el rebose, que empieza a verter a 12,35 m, con su codo y el tubo que baja por fuera junto a una columna hasta un dado de concreto en el piso; la boca de inspección cerca del fondo, con su placa de refuerzo, su tapa empernada, dos manijas y la bisagra; y el transmisor de nivel LT‑101 en la toma de 9,2 m, con su válvula de bloqueo, una pierna de impulso corta y el lado de baja abierto al aire. ' +
  'A la derecha, la escalera con jaula sube del piso al techo. ' +
  'Abajo, del fondo salen la salida a la planta, con un tubo corto adentro que deja el sedimento en el fondo, su válvula de compuerta, el codo y el tubo que sale de la estructura, y el drenaje con su válvula.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), 'valvulas-tuberias-y-medicion-de-flujo/_tanque-llegada');
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_tanque-llegada.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_tanque-llegada.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos, con el CSS de las piezas y el de los rótulos del libro
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Tanque de llegada (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{width:900px;margin:20px auto}
.iso-libro svg{display:block;width:100%;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`);
console.log('out/libro-preview.html');
