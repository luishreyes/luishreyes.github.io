// La tamizadora de golpeteo, quieta y con los nombres de sus piezas, para el libro de operaciones unitarias.
//
//   node build.mjs --eq=tamiz --n=N && node libro-tamiz.mjs --caso caso.json --salida {libro}/figuras/{capítulo}
//
// El caso es un JSON con la pila del análisis y lo que retiene cada tamiz:
//   { "rows": [{ "m": "n.º 18", "a": 1000 }, …],   del tamiz de arriba al de abajo; a, abertura en µm
//     "masas": [m1, …, mN, fondo],                 gramos retenidos en cada tamiz y en el fondo
//     "color": "#d9cfb8",                           el color del material
//     "granos": 360,                                cuántos granos dibujar (cada uno, un incremento de masa igual)
//     "nombre": "_tamizadora.qmd", "titulo": "…" }
// Abre la figura en Chromium con el código en vivo del explorador (FSieve, en out/fig.js), deja caer los granos de
// una vez (snap) hasta el tamiz que los retiene, para la pila y el martillo, y saca el SVG con los rótulos de las
// piezas y de cada tamiz. Escribe el .qmd con el SVG en un bloque de HTML crudo y el CSS propio de la tamizadora en
// estilo/anatomia-molienda.css del libro, con el de los molinos (las clases del kit van en estilo/anatomia.css, que escribe bomba/libro.mjs).
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// los colores salen de la paleta del libro (estilo/paleta.json): los granos van en la rampa del sólido
import { aplicarPaleta, cssMolienda } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const CASO = JSON.parse(readFileSync(resolve(arg('--caso', 'caso.json')), 'utf8'));
const DEST = resolve(arg('--salida', '.'));
const n = CASO.rows.length;
if (n < 3 || n > 9) throw new Error('La tamizadora lleva de 3 a 9 tamices');
if (CASO.masas.length !== n + 1) throw new Error('Hacen falta n masas más la del fondo');
for (const f of [`out/tamiz-${n}.svg`, `out/tamiz-${n}.json`, 'out/fig.js', 'out/fig.css'])
  if (!existsSync(join(AQUI, f))) throw new Error(`Falta ${f}: corra node build.mjs --eq=tamiz --n=${n}`);
const SVG = readFileSync(join(AQUI, `out/tamiz-${n}.svg`), 'utf8');
const D = JSON.parse(readFileSync(join(AQUI, `out/tamiz-${n}.json`), 'utf8'));
const JS = readFileSync(join(AQUI, 'out/fig.js'), 'utf8');
const CSS = readFileSync(join(AQUI, 'out/fig.css'), 'utf8');

// los granos: tantos como pida el caso, repartidos por masa; cada uno con un tamaño al azar (log) dentro de su clase
const total = CASO.masas.reduce((a, b) => a + b, 0), N = CASO.granos || 360;
const cuenta = CASO.masas.map(m => Math.round(N * m / total));
const rows = CASO.rows.map((r, j) => ({ m: r.m, a: r.a, hi: j === 0 ? r.a * 1.41 : CASO.rows[j - 1].a }));
const lo = rows[n - 1].a / 1.41;
let semilla = 7; const azar = () => (semilla = (semilla * 16807) % 2147483647) / 2147483647;
const parts = [];
cuenta.forEach((c, lvl) => {
  const a0 = lvl < n ? rows[lvl].a : lo, a1 = lvl < n ? rows[lvl].hi : rows[n - 1].a;
  for (let i = 0; i < c; i++) parts.push({ size: Math.exp(Math.log(a0) + azar() * (Math.log(a1) - Math.log(a0))), lvl });
});
// los mezcla para que cada nivel no quede con sus granos en orden
for (let i = parts.length - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [parts[i], parts[j]] = [parts[j], parts[i]]; }
const res = { rows, x63: Math.sqrt(rows[0].a * lo), mat: { color: CASO.color || '#d9cfb8' } };

const navegador = await chromium.launch({ args: ['--no-sandbox'] });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 1100 } });
await pagina.setContent(`<!doctype html><meta charset="utf-8"><style>${CSS}</style><div id="host" class="iso" data-theme="light">${SVG}</div><script>${JS}</script>`);
const { svg, cajas } = await pagina.evaluate(({ D, res, parts }) => {
  const host = document.getElementById('host');
  const f = new window.FSieve(host, D);
  f.setRows(res);
  f.update({ sim: { rows: res.rows, parts, done: parts.length, total: parts.length }, dt: 0, snap: true });
  f.update({ sim: { rows: res.rows, parts, done: parts.length, total: parts.length }, dt: 0.05, snap: true });
  const raiz = host.querySelector('svg'), cajas = {};
  for (const g of raiz.querySelectorAll('[data-name]')) { const b = g.getBBox(); cajas[g.getAttribute('data-name')] = [b.x, b.y, b.width, b.height]; }
  return { svg: raiz.outerHTML, cajas };
}, { D, res, parts });
await navegador.close();

// Rótulos de las piezas: [pieza, fx, fy, y del texto, texto]; el punto va en (fx, fy) de la caja de la pieza. Los de la
// izquierda terminan en x = 140 y los de la derecha empiezan en x = 500, donde el dibujo deja espacio a cualquier altura;
// el viewBox se abre 70 unidades a la izquierda para los rótulos de los tamices.
const r1 = v => Math.round(v * 10) / 10, letra = 13, IZQ = 140, DER = 500;
const cj = p => { const c = cajas[p]; if (!c || !c[2]) throw new Error(`La pieza ${p} no está en el dibujo`); return c; };
const en = (p, fx, fy) => { const c = cj(p); return [c[0] + c[2] * fx, c[1] + c[3] * fy]; };
const linea = ([ax, ay], y, t, der) => `<path class="rot-linea" d="M${r1(ax)} ${r1(ay)}L${der ? DER - 4 : IZQ + 4} ${r1(y)}"/>` +
  `<circle class="rot-punto" cx="${r1(ax)}" cy="${r1(ay)}" r="2.6"/>` +
  `<text class="rot-texto" x="${der ? DER : IZQ}" y="${r1(y + letra * 0.35)}" text-anchor="${der ? 'start' : 'end'}" font-size="${letra}">${t}</text>`;
const centro = p => { const c = cj(p); return c[1] + c[3] / 2; };
const yTapa = cj('tz.cover')[1] + 10, yFondo = centro('tz.pan.wall');
const trazos = [
  linea(en('tz.rod-1b', 0, 0.16), cj('tz.rod-1b')[1] + 15, 'Varilla roscada'),
  linea(en('tz.head', 0.25, 0.2), yTapa - 72, 'Martillo'),
  linea(en('tz.bar-1', 0.15, 0.35), yTapa - 30, 'Barra de sujeción'),
  linea(en('tz.cover', 0.03, 0.55), yTapa, 'Tapa con su corcho'),
  linea(en('tz.pan.wall', 0.04, 0.6), yFondo + 4, 'Fondo'),
  linea(en('tz.lcd', 0.5, 0.6), 610, 'Temporizador'),
  linea(en('tz.tower', 0.95, 0.3), cj('tz.tower')[1] + cj('tz.tower')[3] * 0.3, 'Torre del martillo', true),
  linea(en('tz.carrier', 0.97, 0.55), centro('tz.carrier') + 15, 'Plato portatamices', true),
];
// cada tamiz: su designación, su abertura y lo que retuvo, a la izquierda y a la altura de su malla (s0 es el de abajo)
const nbsp = '\u00a0', coma = (v, d) => v.toLocaleString('es-CO', { minimumFractionDigits: d, maximumFractionDigits: d });
for (let k = 0; k < n; k++) {
  const row = rows[n - 1 - k], m = CASO.masas[n - 1 - k], [ax, ay] = en(`tz.s${k}.band`, 0.04, 0.5);
  const abertura = row.a >= 1000 ? coma(row.a / 1000, 2) + nbsp + 'mm' : row.a + nbsp + 'µm';
  trazos.push(linea([ax, ay], ay, `${row.m} · ${abertura} · ${coma(m, 1)}${nbsp}g`));
}
const etiqueta = CASO.titulo || `Tamizadora de golpeteo con una pila de ${n} tamices de 200 mm abierta por delante: cada tamiz retiene los granos que no pasan por su malla.`;
const cuerpo = aplicarPaleta(svg.replace(/(\d+\.\d)\d+/g, '$1')
  .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role)="[^"]*"/g, '')} viewBox="-70 12 710 650" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos.join('')}</g></svg>`), 'tamizado-y-analisis-granulometrico/_tamizadora');
mkdirSync(DEST, { recursive: true });
const nombre = CASO.nombre || '_tamizadora.qmd';
writeFileSync(join(DEST, nombre), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log(join(DEST, nombre), Math.round(cuerpo.length / 1024), 'KB');

// el CSS propio de la molienda (las reglas ml-, ds- y tz- de ml.css), sin el lienzo vivo ni el tema azul de planos y
// con los colores de la paleta; libro-molinos.mjs escribe el mismo archivo con las mismas reglas
const LIBRO = resolve(DEST, '../..');
if (existsSync(join(LIBRO, 'estilo'))) {
  writeFileSync(join(LIBRO, 'estilo/anatomia-molienda.css'), cssMolienda(readFileSync(join(AQUI, 'ml.css'), 'utf8')));
  console.log(join(LIBRO, 'estilo/anatomia-molienda.css'));
}
