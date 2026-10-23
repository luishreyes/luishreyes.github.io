// Las figuras de la bomba para el libro de operaciones unitarias.
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Abre preview.html (el driver de prueba) en Chromium, deja que live.js dibuje
// el impulsor, quita las partículas del líquido (en una figura quieta solo
// confunden) y saca dos vistas del mismo dibujo, con los nombres de las piezas
// en español:
//   figuras/bombas/_instalacion.qmd  la instalación completa
//   figuras/bombas/_por-dentro.qmd   la bomba de cerca, con la carcasa abierta
// Cada .qmd lleva el SVG en un bloque de HTML crudo, para incluirlo en el
// capítulo con {{< include >}}: así el SVG hereda la letra del libro. El CSS de
// las piezas va una sola vez, en estilo/anatomia.css, con el tema claro.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
if (!existsSync(join(AQUI, 'out/fig.css'))) throw new Error('Falta out/: corra antes node build.mjs');

// Cada rótulo: la pieza (data-name), el punto de la pieza al que apunta, en
// fracciones de su caja (fx, fy), y dónde va el texto, en unidades del viewBox.
const VISTAS = {
  instalacion: {
    viewBox: [44, 160, 590, 300],
    letra: 7.6,
    rotulos: [
      { pieza: 'tank', fx: 1, fy: 0.25, x: 548, y: 226, texto: 'Tanque de succión' },
      { pieza: 'lg.glass', fx: 0.5, fy: 0.5, x: 548, y: 287, texto: 'Nivel de vidrio' },
      { pieza: 'suc.red', fx: 0.35, fy: 0.75, x: 548, y: 340, texto: 'Reducción excéntrica' },
      { pieza: 'sv.wheel', fx: 0.85, fy: 0.4, x: 548, y: 382, texto: 'Válvula de compuerta' },
      { pieza: 'dis:7', fx: 1, fy: 0.5, x: 390, y: 182, texto: 'Hacia el proceso', sin: true },
      { pieza: 'gv.body', fx: 1, fy: 0.5, x: 352, y: 214, texto: 'Válvula de globo' },
      { pieza: 'cv.body', fx: 1, fy: 0.55, x: 352, y: 246, texto: 'Válvula de retención' },
      { pieza: 'mot.body', fx: 0.2, fy: 0.3, x: 166, y: 222, texto: 'Motor', fin: true },
      { pieza: 'guard.top', fx: 0.4, fy: 0.2, x: 238, y: 200, texto: 'Acople con su guarda', fin: true },
      { pieza: 'brg.frame', fx: 0.45, fy: 0.85, x: 260, y: 452, texto: 'Caja de rodamientos', fin: true },
      { pieza: 'cas.front', fx: 0.5, fy: 0.95, x: 300, y: 452, texto: 'Bomba centrífuga' },
      { pieza: 'stand.plinth', fx: 0.06, fy: 0.3, x: 128, y: 300, texto: 'Base y pedestal', fin: true },
    ],
  },
  'por-dentro': {
    viewBox: [222, 284, 198, 102],
    letra: 3.2,
    rotulos: [
      { pieza: 'dis.noz', fx: 0.5, fy: 0.3, x: 386, y: 296, texto: 'Boquilla de descarga' },
      { pieza: 'cas.thr', fx: 0.4, fy: 0.15, x: 386, y: 308, texto: 'Garganta de la voluta' },
      { pieza: 'cas.back', fx: 0.92, fy: 0.3, x: 386, y: 320, texto: 'Voluta' },
      { pieza: 'imp', fx: 0.62, fy: 0.42, x: 386, y: 332, texto: 'Impulsor' },
      { pieza: 'suc.noz', fx: 0.7, fy: 0.8, x: 386, y: 356, texto: 'Boquilla de succión' },
      { pieza: 'cas.foot', fx: 0.5, fy: 0.9, x: 386, y: 378, texto: 'Pata de la carcasa' },
      { pieza: 'brg.frame', fx: 0.5, fy: 0.45, x: 268, y: 304, texto: 'Caja de rodamientos', fin: true },
      { pieza: 'brg.sight', fx: 0.5, fy: 0.6, x: 268, y: 346, texto: 'Mirilla del aceite', fin: true },
    ],
  },
};

const navegador = await chromium.launch({ args: ['--no-sandbox'] });
const pagina = await navegador.newPage({ viewport: { width: 1400, height: 1000 } });
await pagina.goto(pathToFileURL(join(AQUI, 'preview.html')).href + '?t=1&q=1');
await pagina.waitForTimeout(800);

const { svg, cajas } = await pagina.evaluate(() => {
  const raiz = document.querySelector('#pbFig svg') || document.querySelector('svg');
  const cajas = {};
  for (const g of raiz.querySelectorAll('[data-name]')) {
    const b = g.getBBox();
    cajas[g.getAttribute('data-name')] = [b.x, b.y, b.width, b.height];
  }
  const copia = raiz.cloneNode(true);
  copia.querySelectorAll('circle.pb-p').forEach(c => c.remove());
  return { svg: copia.outerHTML, cajas };
});
await navegador.close();

const r = v => Math.round(v * 10) / 10;
mkdirSync(join(LIBRO, 'figuras/bombas'), { recursive: true });
for (const [nombre, vista] of Object.entries(VISTAS)) {
  const [vx, vy, vw, vh] = vista.viewBox;
  const trazos = vista.rotulos.map(t => {
    const c = cajas[t.pieza];
    if (!c || !c[2]) throw new Error(`La pieza ${t.pieza} no está en el dibujo`);
    const ax = r(c[0] + c[2] * t.fx), ay = r(c[1] + c[3] * t.fy);
    const fin = t.fin ? 'end' : 'start';
    const tx = t.x + (t.fin ? -1 : 1) * vista.letra * 0.4;
    const linea = t.sin ? '' : `<path class="rot-linea" d="M${ax} ${ay}L${t.x} ${t.y}"/><circle class="rot-punto" cx="${ax}" cy="${ay}" r="${r(vista.letra * 0.2)}"/>`;
    return `${linea}<text class="rot-texto" x="${r(tx)}" y="${r(t.y + vista.letra * 0.35)}" text-anchor="${fin}" font-size="${vista.letra}">${t.texto}</text>`;
  }).join('');
  const etiqueta = nombre === 'instalacion'
    ? 'Dibujo isométrico de una instalación de bombeo: tanque de succión, línea de succión con válvula de compuerta, bomba centrífuga abierta, acople, motor sobre su base y descarga con válvula de retención y válvula de globo.'
    : 'Dibujo isométrico de cerca de una bomba centrífuga de succión axial con la mitad de arriba de la tapa de succión quitada: se ven el impulsor, la voluta, el sello, la caja de rodamientos y el acople.';
  const cuerpo = svg
    .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
    .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`);
  const qmd = '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n';
  writeFileSync(join(LIBRO, `figuras/bombas/_${nombre}.qmd`), qmd);
  console.log(`figuras/bombas/_${nombre}.qmd  ${Math.round(qmd.length / 1024)} KB`);
}

// El CSS de las piezas, con el tema claro por defecto (el oscuro no se usa en el libro).
const css = readFileSync(join(AQUI, 'out/fig.css'), 'utf8')
  .replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
writeFileSync(join(LIBRO, 'estilo/anatomia.css'),
  '/* Las piezas de las figuras isométricas (skill anatomy), con el tema claro.\n' +
  '   Lo escribe scripts/figuras/bomba/libro.mjs del repositorio público: no se edita a mano. */\n' + css);
console.log('estilo/anatomia.css');
