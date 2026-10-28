// Graba el acercamiento «Del montón al poro» (diatomita.html) como video para el libro.
//
//   CHROME_PATH=/opt/pw-browsers/chromium node grabar.mjs --destino ../../../../libro-operaciones-unitarias/libro/figuras/filtracion
//
// Sirve esta carpeta, three.js de public/classroom/vendor/three y la letra de ../fuentes; abre la página en
// modo video (?video) a 1920 × 1080 y pide cada cuadro con window.__cuadro(t). Reparte los cuadros entre
// varios navegadores (--hilos, 3 por omisión), los une con ffmpeg en H.264 yuv420p con el índice al comienzo
// y guarda el último cuadro como póster en WebP. Los cuadros de trabajo quedan en out/ (ignorado en git).
import { createServer } from 'node:http';
import { readFile, mkdir, rm, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { join, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');   // el Playwright instalado en el sistema

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '../../..');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('fps', 24), DUR = +arg('duracion', 30), HILOS = +arg('hilos', 3), ANCHO = 1920, ALTO = 1080;
const DESTINO = arg('destino'), NOMBRE = arg('nombre', 'del-monton-al-poro');
const N = Math.round(FPS * DUR), OUT = join(AQUI, 'out');

const RUTAS = [['/three/', join(RAIZ, 'public/classroom/vendor/three/')], ['/fuentes/', join(AQUI, '../fuentes/')], ['/', AQUI + '/']];
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.ttf': 'font/ttf' };
const servidor = createServer(async (req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]); if (url === '/') url = '/diatomita.html';
  if (url === '/three/controls/OrbitControls.js') url = '/three/OrbitControls.js';
  const [pre, dir] = RUTAS.find(([p]) => url.startsWith(p));
  try { const datos = await readFile(join(dir, url.slice(pre.length))); res.writeHead(200, { 'content-type': TIPOS[extname(url)] || 'application/octet-stream' }); res.end(datos); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}/?video`;

await rm(OUT, { recursive: true, force: true }); await mkdir(OUT, { recursive: true });
const lanzar = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {};
const t0 = Date.now(); let hechos = 0;
async function hilo(h) {
  const nav = await chromium.launch(lanzar), p = await nav.newPage({ viewport: { width: ANCHO, height: ALTO } });
  p.on('pageerror', e => console.error('error en la página:', e.message));
  await p.goto(base, { waitUntil: 'domcontentloaded', timeout: 300000 });
  await p.waitForFunction(() => window.__listo, null, { timeout: 300000 });
  for (let i = h; i < N; i += HILOS) {
    await p.evaluate(t => window.__cuadro(t), i / (N - 1));
    await p.screenshot({ path: join(OUT, `c${String(i).padStart(5, '0')}.png`), timeout: 300000 });
    if (++hechos % 24 === 0) { const s = (Date.now() - t0) / 1000; console.log(`${hechos}/${N} cuadros, ${Math.round(s)} s, faltan unos ${Math.round(s / hechos * (N - hechos) / 60)} min`); }
  }
  await nav.close();
}
await Promise.all(Array.from({ length: HILOS }, (_, h) => hilo(h)));
servidor.close();

const mp4 = join(OUT, NOMBRE + '.mp4'), webp = join(OUT, NOMBRE + '.webp');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', join(OUT, 'c%05d.png'),
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(OUT, `c${String(N - 1).padStart(5, '0')}.png`), '-quality', '88', webp]);
if (DESTINO) {
  await mkdir(DESTINO, { recursive: true });
  for (const f of [mp4, webp]) await copyFile(f, join(DESTINO, f.split('/').pop()));
  console.log('Publicado en', resolve(DESTINO));
}
console.log(`Listo: ${N} cuadros en ${Math.round((Date.now() - t0) / 60000)} min.`);
