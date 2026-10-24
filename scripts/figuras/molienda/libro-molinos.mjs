// Los equipos de molienda, quietos y con los nombres de sus piezas, para el libro de operaciones unitarias.
//
//   node libro-molinos.mjs --salida {libro}/figuras/{capítulo} [--solo bolas] [--cajas]
//
// Abre el Explorador de molienda de POU 2027-10 en Chromium (servido desde public/, porque la página pide sus figuras
// con fetch), escoge el material y el equipo, deja correr la simulación de partículas (MillAnim) hasta que la carga se
// asienta, la pausa y saca el SVG de la máquina con lo que la página dibujó en vivo. Las partículas van en un lienzo
// encima del dibujo: se guardan como una imagen WebP con transparencia, en el lugar del lienzo, y quedan dentro del
// SVG. Encima van los rótulos. Escribe un .qmd por equipo (_molino-{eq}.qmd) con el SVG en un bloque de HTML crudo, y
// el CSS propio de la molienda en estilo/anatomia-molienda.css del libro (las clases del kit van en estilo/anatomia.css,
// que escribe bomba/libro.mjs). Con --cajas escribe además, en la carpeta de salida, un PNG de cada figura con las
// cajas y los nombres de todas las piezas, para escoger dónde van los rótulos.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const PUBLICO = resolve(AQUI, '../../../public');
const PAGINA = '/classroom/iqya-2031-2027-10/simulaciones/Explorador_Molienda.html';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const DEST = resolve(arg('--salida', '.'));
const SOLO = arg('--solo', null);
const CAJAS = process.argv.includes('--cajas');

// Cada equipo: el material y los tamaños con que corre la simulación (log10 de µm, como los deslizadores de la
// página), la letra, el ancho de las columnas de rótulos a la izquierda y a la derecha del dibujo (izq, der) y los
// rótulos: [pieza, fx, fy, texto, lado, dy]. El punto va en (fx, fy) de la caja de la pieza, en fracciones de su ancho
// y su alto (con la pieza '@', fx y fy son el punto mismo, en unidades del dibujo, para lo que va en el lienzo); el texto va a la altura del punto, corrido dy si se da, y los de cada columna se separan solos para no
// montarse. El recorte (viewBox) es la caja de todo el dibujo más las dos columnas.
const EQUIPOS = {
  mand: {
    mat: 'caliza', lF: 5.0, lP: 4.3, letra: 15, izq: 190, der: 230,
    titulo: 'Trituradora de mandíbulas de un solo toggle con la placa lateral de adelante quitada: la biela, colgada del eje excéntrico, acerca y aleja la mandíbula móvil de la fija, y la roca baja por la cámara hasta salir por la abertura de abajo.',
    rotulos: [
      ['lip', 0.35, 0.3, 'Boca de alimentación', 'izq'],
      ['die.f', 0.25, 0.45, 'Mandíbula fija', 'izq'],
      ['die.m', 0.45, 0.75, 'Mandíbula móvil', 'izq'],
      ['wall', 0.06, 0.75, 'Bastidor', 'izq'],
      ['cv.belt', 0.2, 0.6, 'Banda de descarga', 'izq'],
      ['fw.rim.f', 0.8, 0.2, 'Volante', 'der'],
      ['shaft.stub', 0.5, 0.5, 'Eje excéntrico', 'der'],
      ['@', 352, 268, 'Biela', 'der'],
      ['toggle', 0.6, 0.5, 'Placa de articulación (toggle)', 'der'],
      ['rod.b', 0.6, 0.5, 'Tirante y resorte', 'der'],
      ['mot', 0.7, 0.4, 'Motor y correas', 'der'],
    ],
  },
  rod: {
    mat: 'caliza', lF: 4.3, lP: 3.7, letra: 15, izq: 190, der: 170,
    titulo: 'Molino de rodillos dobles con la tapa lateral de adelante quitada: los dos rodillos giran hacia adentro y aplastan la roca en la luz que los separa; el de la derecha descansa sobre resortes que lo dejan abrirse si entra algo que no se rompe.',
    rotulos: [
      ['hop.a', 0.5, 0.3, 'Tolva', 'izq'],
      ['mot.l', 0.3, 0.4, 'Motor', 'izq'],
      ['roll.l', 0.3, 0.6, 'Rodillo fijo', 'izq'],
      ['@', 248, 318, 'Bastidor', 'izq'],
      ['bin.w3', 0.3, 0.5, 'Caja del producto', 'izq'],
      ['roll.r', 0.6, 0.3, 'Rodillo flotante', 'der'],
      ['spr.rod.n', 0.5, 0.5, 'Resortes de alivio', 'der'],
      ['slide.n', 0.5, 0.5, 'Placa deslizante', 'der'],
      ['mot.r', 0.6, 0.4, 'Motor', 'der'],
    ],
  },
  mart: {
    mat: 'caliza', lF: 4.3, lP: 3.3, letra: 15, izq: 190, der: 170,
    titulo: 'Molino de martillos con la tapa de adelante quitada: el rotor golpea las partículas contra la carcasa y las sigue golpeando hasta que pasan por la criba perforada de abajo.',
    rotulos: [
      ['hopper', 0.3, 0.4, 'Tolva', 'izq'],
      ['shell.a.f', 0.5, 0.45, 'Carcasa', 'der'],
      ['hm.rotor', 0.35, 0.45, 'Rotor con sus martillos', 'izq'],
      ['screen.b', 0.25, 0.75, 'Criba perforada', 'izq'],
      ['spout', 0.4, 0.6, 'Descarga', 'izq'],
      ['sheave.f', 0.6, 0.3, 'Polea', 'der'],
      ['cradle.r', 0.3, 0.5, 'Cuna', 'der'],
      ['mot', 0.7, 0.4, 'Motor', 'der'],
    ],
  },
  bolas: {
    mat: 'caliza', lF: 3.5, lP: 1.9, letra: 15, izq: 190, der: 170,
    titulo: 'Molino de bolas con la mitad del tambor que mira al lector quitada: los levantadores suben la carga de bolas por la pared y la dejan caer sobre el pie de la carga, donde se muele el material.',
    rotulos: [
      ['hop', 0.4, 0.3, 'Tolva de alimentación', 'izq'],
      ['trun.f.f', 0.3, 0.5, 'Muñón de alimentación', 'izq'],
      ['shell', 0.12, 0.55, 'Tambor', 'izq'],
      ['shell', 0.68, 0.52, 'Carga de bolas', 'izq'],
      ['pier.f', 0.3, 0.6, 'Pedestal', 'izq'],
      ['gear.f', 0.5, 0.15, 'Corona', 'der'],
      ['trommel', 0.6, 0.4, 'Trommel de descarga', 'der'],
      ['dis.hop', 0.7, 0.5, 'Tolva del producto', 'der'],
      ['pinion', 0.5, 0.5, 'Piñón', 'der'],
      ['gb', 0.6, 0.4, 'Reductor', 'der'],
      ['mot', 0.7, 0.4, 'Motor', 'der'],
    ],
  },
  disc: {
    mat: 'maiz', lF: 3.4, lP: 2.6, letra: 15, izq: 190, der: 170,
    titulo: 'Molino de discos de un solo rotor con la mitad de abajo de la puerta y del disco fijo quitada: el material entra por el ojo del disco fijo y sale molido por la periferia, entre la cara ranurada del rotor y la del disco fijo.',
    rotulos: [
      ['hopper', 0.3, 0.5, 'Tolva', 'izq'],
      ['gate', 0.2, 0.5, 'Compuerta', 'izq'],
      ['feed:2', 0.3, 0.5, 'Tubo de entrada', 'izq'],
      ['door.a', 0.2, 0.5, 'Puerta con el disco fijo', 'izq'],
      ['tie225.rod', 0.5, 0.5, 'Varillas y resortes de la luz', 'izq'],
      ['bin', 0.3, 0.6, 'Recipiente del producto', 'izq'],
      ['@', 318, 292, 'Cara ranurada del rotor', 'der'],
      ['sheave.f', 0.6, 0.3, 'Polea', 'der'],
      ['mot', 0.7, 0.4, 'Motor', 'der'],
    ],
  },
};

// Un servidor de archivos de public/, para que la página pida sus figuras como en el sitio.
const TIPOS = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const servidor = createServer((q, r) => {
  const ruta = normalize(join(PUBLICO, decodeURIComponent(q.url.split('?')[0])));
  if (!ruta.startsWith(PUBLICO) || !existsSync(ruta)) { r.writeHead(404); r.end(); return; }
  r.writeHead(200, { 'content-type': TIPOS[extname(ruta)] || 'application/octet-stream' });
  r.end(readFileSync(ruta));
});
await new Promise(ok => servidor.listen(0, '127.0.0.1', ok));
const BASE = `http://127.0.0.1:${servidor.address().port}`;

const navegador = await chromium.launch({ args: ['--no-sandbox'] });
const pagina = await navegador.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
pagina.on('pageerror', e => console.error('Error de la página:', e.message));
await pagina.goto(BASE + PAGINA);
await pagina.waitForTimeout(1500);
mkdirSync(DEST, { recursive: true });

const r1 = v => Math.round(v * 10) / 10;
for (const [eq, E] of Object.entries(EQUIPOS)) {
  if (SOLO && SOLO !== eq) continue;
  await pagina.click(`#matBtns [data-mat="${E.mat}"]`);
  await pagina.click(`#millBtns [data-mill="${eq}"]`);
  await pagina.evaluate(() => { if (typeof FMill === 'function') FMill.prototype.flashes = function () {}; });
  await pagina.evaluate(({ lF, lP }) => {
    for (const [id, v] of [['lF', lF], ['lP', lP]]) { const s = document.getElementById(id); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }
  }, E);
  await pagina.waitForTimeout(9000);
  const { svg, cajas, capa } = await pagina.evaluate(() => {
    const host = document.querySelector('#mlFig'), raiz = host.querySelector('svg'), cv = host.querySelector('canvas.ml-live');
    // la misma cuenta de FMill.fit: de unidades del viewBox a píxeles del lienzo
    const r = raiz.getBoundingClientRect(), b = cv.getBoundingClientRect(), dpr = cv.width / b.width;
    const vb = raiz.getAttribute('viewBox').split(/[ ,]+/).map(Number);
    const s = Math.min(r.width / vb[2], r.height / vb[3]);
    const M = [dpr * s, dpr * (r.left - b.left + (r.width - vb[2] * s) / 2 - vb[0] * s), dpr * (r.top - b.top + (r.height - vb[3] * s) / 2 - vb[1] * s)];
    const cajas = {};
    for (const g of raiz.querySelectorAll('[data-name]')) { const c = g.getBBox(); cajas[g.getAttribute('data-name')] = [c.x, c.y, c.width, c.height]; }
    return { svg: raiz.outerHTML, cajas, capa: { url: cv.toDataURL('image/webp', 0.86), x: -M[1] / M[0], y: -M[2] / M[0], w: cv.width / M[0], h: cv.height / M[0] } };
  });
  const todo = Object.values(cajas).filter(c => c[2] > 0 && c[3] > 0);
  const x0 = Math.min(...todo.map(c => c[0])), y0 = Math.min(...todo.map(c => c[1]));
  const x1 = Math.max(...todo.map(c => c[0] + c[2])), y1 = Math.max(...todo.map(c => c[1] + c[3]));
  const XI = x0 - 12, XD = x1 + 12, paso = E.letra * 1.45;
  const cj = p => { const c = cajas[p]; if (!c || !c[2]) throw new Error(`${eq}: la pieza ${p} no está en el dibujo`); return c; };
  const rot = E.rotulos.map(([p, fx, fy, texto, lado, dy]) => { const c = p === '@' ? [fx, fy, 0, 0] : cj(p), ax = c[0] + c[2] * fx, ay = c[1] + c[3] * fy; return { ax, ay, y: ay + (dy || 0), texto, der: lado === 'der' }; });
  // en cada columna, de arriba hacia abajo, cada texto al menos un paso por debajo del anterior
  for (const der of [false, true]) {
    const col = rot.filter(t => t.der === der).sort((a, b) => a.y - b.y);
    for (let i = 1; i < col.length; i++) col[i].y = Math.max(col[i].y, col[i - 1].y + paso);
  }
  const ys = rot.map(t => t.y);
  const vx = XI - E.izq, vy = Math.min(y0, ...ys.map(y => y - paso)) - 6;
  const vw = XD + E.der - vx, vh = Math.max(y1, ...ys.map(y => y + paso)) + 6 - vy;
  const trazos = rot.map(t => {
    const x = t.der ? XD : XI;
    return `<path class="rot-linea" d="M${r1(t.ax)} ${r1(t.ay)}L${t.der ? x - 4 : x + 4} ${r1(t.y)}"/>` +
      `<circle class="rot-punto" cx="${r1(t.ax)}" cy="${r1(t.ay)}" r="${r1(E.letra * 0.2)}"/>` +
      `<text class="rot-texto" x="${x}" y="${r1(t.y + E.letra * 0.35)}" text-anchor="${t.der ? 'start' : 'end'}" font-size="${E.letra}">${t.texto}</text>`;
  }).join('');
  const imagen = `<image class="ml-capa" href="${capa.url}" x="${r1(capa.x)}" y="${r1(capa.y)}" width="${r1(capa.w)}" height="${r1(capa.h)}" preserveAspectRatio="none"/>`;
  const cuerpo = svg.replace(/(\d+\.\d)\d+/g, '$1')
    .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${r1(vx)} ${r1(vy)} ${r1(vw)} ${r1(vh)}" role="img" aria-label="${E.titulo}">`)
    .replace(/<\/svg>\s*$/, `${imagen}<g class="rotulos">${trazos}</g></svg>`);
  const nombre = `_molino-${eq}.qmd`;
  writeFileSync(join(DEST, nombre), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
  console.log(join(DEST, nombre), Math.round(cuerpo.length / 1024), 'KB, de ellos la capa', Math.round(capa.url.length / 1024), 'KB');
  if (CAJAS) {
    const marcas = Object.entries(cajas).filter(([, c]) => c[2] && c[3]).map(([n, c]) =>
      `<rect x="${r1(c[0])}" y="${r1(c[1])}" width="${r1(c[2])}" height="${r1(c[3])}" fill="none" stroke="#d33" stroke-width=".4"/>` +
      `<text x="${r1(c[0] + 1)}" y="${r1(c[1] + 5)}" font-size="5" fill="#d33">${n}</text>`).join('');
    const vista = await navegador.newPage({ viewport: { width: 1400, height: 1000 } });
    await vista.setContent(`<!doctype html><meta charset="utf-8"><style>${readFileSync(join(AQUI, 'out/fig.css'), 'utf8')}.rot-linea{fill:none;stroke:#333;stroke-width:.6}.rot-punto{fill:#333}.rot-texto{fill:#222;font-family:sans-serif}svg{width:1300px;height:auto}</style><div class="iso" data-theme="light">${cuerpo.replace('</svg>', marcas + '</svg>')}</div>`);
    await vista.locator('svg').first().screenshot({ path: join(DEST, `cajas-${eq}.png`) });
    await vista.close();
  }
}
await navegador.close();
servidor.close();

// el CSS propio de la molienda (las reglas ml-, ds- y tz- de ml.css), sin el lienzo vivo ni el tema azul de planos;
// libro-tamiz.mjs escribe el mismo archivo con las mismas reglas
const reglas = readFileSync(join(AQUI, 'ml.css'), 'utf8').match(/[^{}]+\{[^{}]*\}/g)
  .filter(r => !/blueprint|canvas/.test(r)).map(r => r.trim().replace(/^\/\*[\s\S]*?\*\/\s*/, ''));
const LIBRO = resolve(DEST, '../..');
if (existsSync(join(LIBRO, 'estilo'))) {
  writeFileSync(join(LIBRO, 'estilo/anatomia-molienda.css'),
    '/* Las piezas propias de los equipos de molienda y de la tamizadora (skill anatomy). Lo escriben\n   scripts/figuras/molienda/libro-molinos.mjs y libro-tamiz.mjs del repositorio público: no se edita a mano. */\n' + reglas.join('\n') + '\n');
  console.log(join(LIBRO, 'estilo/anatomia-molienda.css'));
}
