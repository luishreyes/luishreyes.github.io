// Genera el PDF imprimible del handout-02 (taller de crítica 1-2-4) de
// Narrativas Visuales (IQYA-3751), mismo patrón que build-programa-pdf.mjs.
//
// Requisito: Playwright (`npm i -D playwright`). Uso:
//   node scripts/build-handout-02-pdf.mjs
// Regenerar CADA VEZ que cambie handout-02-taller-critica.html.

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(__dirname, '../public/classroom/iqya-3751-2026-20/handout-02-taller-critica.html');
const OUT = path.resolve(__dirname, '../public/classroom/iqya-3751-2026-20/handout-02-taller-critica.pdf');

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
  try { await page.evaluate(() => document.fonts.ready); } catch { /* fuentes locales */ }
  await page.waitForTimeout(1200);
  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: true,
    margin: { top: '0.7in', bottom: '0.62in', left: '0.9in', right: '0.9in' },
    displayHeaderFooter: true,
    headerTemplate: hf('Narrativas Visuales', 'Taller 1-2-4 · Sesión 2 · 2026-20'),
    footerTemplate: hf('¿Le sirve a quien decide?', 'Módulo 1 · Sin IA'),
  });
  console.log('PDF escrito en', OUT);
} finally {
  await browser.close();
}
