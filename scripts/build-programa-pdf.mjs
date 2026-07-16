// Genera el PDF imprimible del programa de Narrativas Visuales (IQYA-3751)
// en el formato «documento claro» del design system (plantilla Guía).
//
// El PDF sale de la MISMA fuente que la versión web: public/.../programa.html.
// Al emular `print`, ese archivo se re-mapea a la paleta clara (portada con
// visor, capítulos numerados con regla citrón, callouts CLAVE/ÉTICA, tablas
// claras). Aquí sólo lo paginamos a carta y le agregamos cabecera/pie.
//
// Requisito: Playwright (`npm i -D playwright`). Uso:
//   node scripts/build-programa-pdf.mjs
// Regenerar CADA VEZ que cambie el contenido de programa.html.

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(__dirname, '../public/classroom/iqya-3751-2026-20/programa.html');
const OUT = path.resolve(__dirname, '../public/classroom/iqya-3751-2026-20/programa.pdf');

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
  try { await page.evaluate(() => document.fonts.ready); } catch { /* fuentes por CDN */ }
  await page.waitForTimeout(1200);
  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.7in', bottom: '0.62in', left: '0.9in', right: '0.9in' },
    displayHeaderFooter: true,
    headerTemplate: hf('Narrativas Visuales', 'Programa del curso · 2026-20'),
    footerTemplate: hf('De los datos a la historia', 'Electivo · 16 semanas'),
  });
  console.log('PDF escrito en', OUT);
} finally {
  await browser.close();
}
