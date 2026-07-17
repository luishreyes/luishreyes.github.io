// Genera el PDF imprimible del programa de Proyecto de Operaciones Unitarias
// (IQYA-2031) a partir de la MISMA fuente que la versión web:
// public/classroom/iqya-2031-2026-20/programa.html
//
// Al emular `print`, el botón de descarga se oculta y el documento se pagina
// a carta con cabecera/pie. Regenerar CADA VEZ que cambie programa.html.
//
// Requisito: Playwright (`npm i -D playwright`). Uso:
//   node scripts/build-pou-programa-pdf.mjs
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(__dirname, '../public/classroom/iqya-2031-2026-20/programa.html');
const OUT  = path.resolve(__dirname, '../public/classroom/iqya-2031-2026-20/programa.pdf');

const hf = (left, right) =>
  `<div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;font-weight:600;` +
  `letter-spacing:2.4px;text-transform:uppercase;color:#8A887F;padding:0 0.9in;` +
  `display:flex;justify-content:space-between;box-sizing:border-box;">` +
  `<span>${left}</span><span>${right}</span></div>`;

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto('file://' + HTML, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(1200);
  await page.pdf({
    path: OUT, format: 'Letter', printBackground: true,
    margin: { top: '0.7in', bottom: '0.62in', left: '0.9in', right: '0.9in' },
    displayHeaderFooter: true,
    headerTemplate: hf('Proyecto de Operaciones Unitarias', 'Programa del curso · 2026-20'),
    footerTemplate: hf('IQYA-2031 · Universidad de los Andes', '16 semanas · 3 créditos'),
  });
  console.log('PDF escrito en', OUT);
} finally { await browser.close(); }
