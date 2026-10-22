// Genera el PDF imprimible del programa de Proyecto de Operaciones Unitarias
// (IQYA-2031) a partir de la MISMA fuente que la versión web:
// public/classroom/iqya-2031-2026-20/programa.html
//
// Al emular `print`, el botón de descarga se oculta y el documento se pagina
// a carta con cabecera/pie. Regenerar CADA VEZ que cambie programa.html.
//
// Requisito: Playwright (`npm i -D playwright`). Uso:
//   node scripts/build-pou-programa-pdf.mjs
//   CURSO=iqya-2031-2027-10 node scripts/build-pou-programa-pdf.mjs
//   CURSO=iqya-2031-2027-10 DOC=reto-aceite-esencial node scripts/build-pou-programa-pdf.mjs
// DOC es el HTML de la raíz del curso (programa por defecto; también la guía del reto).
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SLUG = process.env.CURSO || 'iqya-2031-2026-20';
const DOC = process.env.DOC || 'programa';
const PERIODO = SLUG.match(/\d{4}-\d{2}$/)?.[0] ?? '';
const HTML = path.resolve(__dirname, `../public/classroom/${SLUG}/${DOC}.html`);
const OUT  = path.resolve(__dirname, `../public/classroom/${SLUG}/${DOC}.pdf`);
const RUBRO = DOC === 'programa' ? 'Programa del curso' : 'Guía del reto';
const PIE = DOC === 'programa' ? '16 semanas · 3 créditos' : 'Proyecto semestral';

const hf = (left, right) =>
  `<div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:7.5px;font-weight:600;` +
  `letter-spacing:2.4px;text-transform:uppercase;color:#8A887F;padding:0 0.9in;` +
  `display:flex;justify-content:space-between;box-sizing:border-box;">` +
  `<span>${left}</span><span>${right}</span></div>`;

const browser = await chromium.launch({ args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] });
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
    headerTemplate: hf('Proyecto de Operaciones Unitarias', `${RUBRO} · ${PERIODO}`),
    footerTemplate: hf('IQYA-2031 · Universidad de los Andes', PIE),
  });
  console.log('PDF escrito en', OUT);
} finally { await browser.close(); }
