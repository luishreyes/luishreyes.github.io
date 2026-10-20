// Revisa que los simuladores del aula sigan la hoja común (public/classroom/simulador.css) y sus mínimos:
// carga sin errores, nada se sale a lo ancho, los controles miden al menos 24 px con mouse y 44 px con el dedo
// (el estado de la cabecera, 36 px) y ningún rótulo de su <style> baja de 10 px. Ver SIMULADORES.md.
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
  const usaHoja = html.includes('href="/classroom/simulador.css"');
  const propio = (html.match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1].replace(/\/\*[A-Z]+_CSS_START\*\/[\s\S]*?\/\*[A-Z]+_CSS_END\*\//g, '');
  const chicos = [...propio.matchAll(/([^{}]*)\{[^}]*font-size:\s*([0-9.]+)px/g)].filter((m) => +m[2] < 10 && !/svg|text|\.iso/.test(m[1]));
  if (chicos.length) notas.push(`letra de menos de 10 px en ${chicos.map((m) => m[1].trim()).join(', ')}`);
  if (/--accent:\s*#(?!4A6F94)/i.test(propio)) notas.push('redefine --accent: los simuladores no llevan identidad propia');
  if (/typekit|fonts\.googleapis/.test(html)) notas.push('carga letras de afuera');
  for (const [ctx, min, nombre] of [[mouse, 24, 'mouse'], [dedo, 44, 'dedo']]) {
    const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message));
    await p.goto(base + f, { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
    if (nombre === 'dedo') await p.evaluate(() => document.querySelectorAll('.ctl').forEach((c) => c.classList.add('open')));
    const r = await p.evaluate(medir, min);
    if (errs.length) notas.push(`${nombre}: error de JavaScript: ${errs[0]}`);
    if (r.ancho) notas.push(`${nombre}: la página se sale a lo ancho`);
    const k = Object.entries(r.malos);
    if (k.length) notas.push(`${nombre}: controles de menos de ${min} px: ${k.map(([a, n]) => n > 1 ? `${a} (${n})` : a).join(', ')}`);
    await p.close();
  }
  const sinHoja = !usaHoja && /Explorador_/.test(f) && !/Graficos/i.test(f);
  if (sinHoja) notas.push('no carga /classroom/simulador.css');
  console.log(`${notas.length ? '✗' : '✓'} ${f}${notas.length ? '\n    ' + notas.join('\n    ') : ''}`);
  malos += notas.length ? 1 : 0;
}
await browser.close(); server.close();
console.log(malos ? `\n${malos} de ${archivos.length} con algo por revisar.` : (archivos.length === 1 ? '\nPasa la revisión.' : `\nLos ${archivos.length} pasan la revisión.`));
process.exit(malos ? 1 : 0);
