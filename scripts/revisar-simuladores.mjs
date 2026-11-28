// Revisa que los simuladores del aula sigan la hoja común (public/classroom/simulador.css) y sus mínimos:
// carga sin errores, nada se sale a lo ancho, los controles miden al menos 24 px con mouse y 44 px con el dedo
// (el estado de la cabecera, 36 px) y ningún rótulo de su <style> baja de 10 px. Ver SIMULADORES.md.
// Los exploradores con la imagen del libro (POU 2027-10: /classroom/explorador-libro.js y su hoja) pasan además
// por lo suyo: cargan el armazón completo y el kit de Dax del curso, no redefinen los colores del libro, caben en
// una pantalla sin desplazar la página a 1440 × 900 y a 1366 × 768 en cada escena, abren la capa «¿Cómo se
// calcula?» de cada escena sin errores y no guardan en localStorage nada que no sea una preferencia de vista.
//
//   node scripts/revisar-simuladores.mjs            todos los de public/classroom/*/simulaciones
//   node scripts/revisar-simuladores.mjs Bernoulli  solo los que contengan esa palabra en el nombre
//
// Sale con 1 si encuentra algo. Levanta su propio servidor estático sobre public/.
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
let chromium;
try { ({ chromium } = await import('playwright')); } catch { ({ chromium } = createRequire('/usr/lib/node_modules/')('playwright')); }

const filtro = process.argv[2] || '';
const archivos = [];
for (const curso of readdirSync(path.join(ROOT, 'classroom'))) {
  const dir = path.join(ROOT, 'classroom', curso, 'simulaciones');
  if (!existsSync(dir) || !statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) if (f.endsWith('.html') && f.includes(filtro)) archivos.push(`classroom/${curso}/simulaciones/${f}`);
}

const TIPOS = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json', '.mjs': 'text/javascript' };
const server = createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !existsSync(p) || statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TIPOS[path.extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}/`;

const browser = await chromium.launch({ args: process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : [] });
const mouse = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const dedo = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
// el kit de Dax del curso responde vacío: la revisión no depende de la red y mira la página con la letra de respaldo
const KIT = 'https://use.typekit.net/zyg3ceo.css';
const sinKit = (c) => c.route('https://use.typekit.net/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
for (const c of [mouse, dedo]) await sinKit(c);
let malos = 0;

const medir = (min) => {
  const malos = {};
  for (const e of document.querySelectorAll('button, select, input:not([type=checkbox]):not([type=radio])')) {
    if (!e.offsetParent && getComputedStyle(e).position !== 'fixed') continue;
    const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const piso = e.classList.contains('status') ? Math.min(min, 36) : min;
    if (r.height < piso - 0.5) { const k = `${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''} ${Math.round(r.width)}×${Math.round(r.height)}`; malos[k] = (malos[k] || 0) + 1; }
  }
  return { malos, ancho: document.documentElement.scrollWidth > document.documentElement.clientWidth };
};

for (const f of archivos) {
  const html = readFileSync(path.join(ROOT, f), 'utf8');
  const notas = [];
  // los exploradores con la imagen del libro (POU 2027-10) cargan su propia hoja común en lugar de simulador.css
  const usaHoja = html.includes('href="/classroom/simulador.css"') || html.includes('href="/classroom/explorador-libro.css"');
  const propio = (html.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1].replace(/\/\*[A-Z]+_CSS_START\*\/[\s\S]*?\/\*[A-Z]+_CSS_END\*\//g, '');
  const chicos = [...propio.matchAll(/([^{}]*)\{[^}]*font-size:\s*([0-9.]+)px/g)].filter((m) => +m[2] < 10 && !/svg|text|\.iso/.test(m[1]));
  if (chicos.length) notas.push(`letra de menos de 10 px en ${chicos.map((m) => m[1].trim()).join(', ')}`);
  if (/--accent:\s*#(?!4A6F94)/i.test(propio)) notas.push('redefine --accent: los simuladores no llevan identidad propia');
  const libro = html.includes('src="/classroom/explorador-libro.js"');
  const hojaLibro = html.includes('href="/classroom/explorador-libro.css"');
  // la única letra de afuera admitida: el kit de Dax del curso, en los exploradores con la imagen del libro
  const afuera = (html.match(/https?:\/\/(use\.typekit\.net|fonts\.googleapis\.com)[^"' )]*/g) || []).filter((u) => !(hojaLibro && u === KIT) && u !== 'https://use.typekit.net');
  if (afuera.length) notas.push(`carga letras de afuera: ${[...new Set(afuera)].join(', ')}`);
  if (hojaLibro && !libro) notas.push('carga explorador-libro.css sin el armazón /classroom/explorador-libro.js');
  if (libro) {
    if (!hojaLibro) notas.push('carga el armazón sin su hoja /classroom/explorador-libro.css');
    if (!html.includes(`href="${KIT}"`)) notas.push(`no carga el kit de Dax del curso (${KIT})`);
    if (!html.includes('/classroom/vendor/katex/katex.min.js')) notas.push('no carga KaTeX (/classroom/vendor/katex/katex.min.js) antes del armazón');
    if (!/<script id="modelo">/.test(html)) notas.push('el modelo no está en su propio <script id="modelo"> (lo leen las pruebas de los números)');
    if (/--(amarillo|navy|oliva|alerta|azul|sans|serif)\s*:/.test(propio)) notas.push('redefine un color o una letra del libro en su <style>');
  }
  for (const [ctx, min, nombre] of [[mouse, 24, 'mouse'], [dedo, 44, 'dedo']]) {
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(base + f, { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    if (nombre === 'dedo') await p.evaluate(() => { document.querySelectorAll('.ctl').forEach((c) => c.classList.add('open')); document.body.classList.add('hoja-abierta'); });
    const r = await p.evaluate(medir, min);
    if (errs.length) notas.push(`${nombre}: error de JavaScript: ${errs[0]}`);
    if (r.ancho) notas.push(`${nombre}: la página se sale a lo ancho`);
    const k = Object.entries(r.malos);
    if (k.length) notas.push(`${nombre}: controles de menos de ${min} px: ${k.map(([a, n]) => n > 1 ? `${a} (${n})` : a).join(', ')}`);
    await p.close();
  }
  if (libro) notas.push(...await revisarLibro(f));
  const sinHoja = !usaHoja && /Explorador_/.test(f) && !/Graficos/i.test(f);
  if (sinHoja) notas.push('no carga /classroom/simulador.css ni /classroom/explorador-libro.css');
  console.log(`${notas.length ? '✗' : '✓'} ${f}${notas.length ? '\n    ' + notas.join('\n    ') : ''}`);
  malos += notas.length ? 1 : 0;
}
// Lo propio de los exploradores con la imagen del libro: cada escena en una pantalla, la capa y el arranque limpio.
async function revisarLibro(f) {
  const notas = [];
  for (const [w, h] of [[1440, 900], [1366, 768]]) {
    // un contexto nuevo por tamaño: localStorage es del origen y otro simulador pudo dejar algo
    const nombre = `${w} × ${h}`, ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await sinKit(ctx);
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(base + f, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
    const n = await p.evaluate(() => (window.Explorador && window.Explorador.escenas ? window.Explorador.escenas.length : 0));
    if (!n) { notas.push(`${nombre}: no hay window.Explorador (¿falta XL.explorador?)`); await ctx.close(); continue; }
    for (let i = 0; i < n; i++) {
      await p.evaluate((i) => window.Explorador.ir(i), i);
      await p.waitForTimeout(350);
      const m = await p.evaluate(() => ({ id: window.Explorador.escenas[window.Explorador.escena()].id, alto: document.documentElement.scrollHeight - document.documentElement.clientHeight, ancho: document.documentElement.scrollWidth - document.documentElement.clientWidth }));
      if (m.alto > 1 || m.ancho > 1) notas.push(`${nombre}: la escena ${m.id} desplaza la página (${m.ancho} px de más a lo ancho, ${m.alto} a lo alto)`);
      await p.evaluate(() => { window.Explorador.abrirCapa(); const t = document.querySelector('#doc [data-todos]'); if (t) t.click(); });
      await p.waitForTimeout(150);
      const capa = await p.evaluate(() => document.querySelectorAll('#doc .xl-paso').length);
      if (!capa) notas.push(`${nombre}: la capa «¿Cómo se calcula?» de la escena ${i + 1} no tiene pasos`);
      await p.evaluate(() => window.Explorador.cerrarCapa());
    }
    const guardado = await p.evaluate(() => { const k = []; for (let i = 0; i < localStorage.length; i++) k.push(localStorage.key(i)); return k.filter((x) => !x.startsWith('xl:')); });
    if (guardado.length) notas.push(`${nombre}: guarda en localStorage lo que no es una preferencia de vista: ${guardado.join(', ')}`);
    if (errs.length) notas.push(`${nombre}: error de JavaScript al recorrer las escenas: ${errs[0]}`);
    await ctx.close();
  }
  return [...new Set(notas)];
}

await browser.close(); server.close();
console.log(malos ? `\n${malos} de ${archivos.length} con algo por revisar.` : (archivos.length === 1 ? '\nPasa la revisión.' : `\nLos ${archivos.length} pasan la revisión.`));
process.exit(malos ? 1 : 0);
