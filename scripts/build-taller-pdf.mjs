// Genera el PDF imprimible de un taller de POU (carta, con cabecera y pie)
// a partir de la MISMA fuente que la versión web:
// public/classroom/iqya-2031-2026-20/talleres/<Carpeta>/Taller_*.html
//
// Al emular `print`, el documento usa su propio @media print (oculta la
// barra de progreso, el visor y lo marcado .solo-pantalla). Regenerar CADA
// VEZ que cambie el HTML del taller.
//
// Requisito: Playwright (`npm i -D playwright`) y el sitio servido en local:
//   cd public && python3 -m http.server 8765
// Uso:
//   node scripts/build-taller-pdf.mjs Taller_06
//   node scripts/build-taller-pdf.mjs Taller_06 http://localhost:8765
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../public');
const SLUG = 'iqya-2031-2026-20';
const folder = process.argv[2];
const base = process.argv[3] || 'http://localhost:8765';
if (!folder) { console.error('Uso: node scripts/build-taller-pdf.mjs <Carpeta_del_taller> [url-base]'); process.exit(1); }

const dir = path.join(ROOT, 'classroom', SLUG, 'talleres', folder);
const htmlName = fs.readdirSync(dir).find((f) => /^Taller_.*\.html$/.test(f));
if (!htmlName) { console.error('No encontré Taller_*.html en', dir); process.exit(1); }

const hf = (left, right) =>
  `<div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;font-weight:600;` +
  `letter-spacing:2.4px;text-transform:uppercase;color:#8A887F;padding:0 0.82in;` +
  `display:flex;justify-content:space-between;box-sizing:border-box;">` +
  `<span>${left}</span><span>${right}</span></div>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`${base}/classroom/${SLUG}/talleres/${folder}/${htmlName}`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(1200);
  const out = path.join(dir, htmlName.replace(/\.html$/, '.pdf'));
  await page.pdf({
    path: out, format: 'Letter', printBackground: true,
    margin: { top: '0.75in', bottom: '0.6in', left: '0.9in', right: '0.9in' },
    displayHeaderFooter: true,
    headerTemplate: hf('Proyecto de Operaciones Unitarias', 'IQYA-2031 · 2026-20'),
    footerTemplate: hf('Universidad de los Andes', 'Proyecto de Operaciones Unitarias'),
  });
  console.log('PDF escrito en', out);
} finally { await browser.close(); }
