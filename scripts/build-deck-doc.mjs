// Genera el PDF «documento» (carta vertical) de una presentación deck-stage
// de POU, el que descarga el botón PDF del deck (atributo data-doc-pdf).
//
// Abre la presentación desde un servidor local, le inyecta
// public/classroom/iqya-2031-2026-20/_industry/deck-doc.css (que apila las
// diapositivas como un apunte, aclara las oscuras y expande lo interactivo)
// y la imprime a carta con pie de página. Se emulan medios de PANTALLA: el
// @media print de deck-stage fija cada diapositiva a 1920 px con !important
// desde el shadow DOM y eso le ganaría a deck-doc.css. Regenerar CADA VEZ que
// cambie el HTML de la presentación.
//
// Requisito: Playwright (`npm i -D playwright`) y el sitio servido en local:
//   cd public && python3 -m http.server 8765
// Uso:
//   node scripts/build-deck-doc.mjs Diagramas_de_Ingenieria
//   node scripts/build-deck-doc.mjs Diagramas_de_Ingenieria http://localhost:8765
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../public');
const SLUG = 'iqya-2031-2026-20';
const deck = process.argv[2];
const base = process.argv[3] || 'http://localhost:8765';
if (!deck) { console.error('Uso: node scripts/build-deck-doc.mjs <Carpeta_del_deck> [url-base]'); process.exit(1); }

const dir = path.join(ROOT, 'classroom', SLUG, 'slides', deck);
const htmlName = fs.readdirSync(dir).find((f) => /^Presentacion_.*\.html$/.test(f));
if (!htmlName) { console.error('No encontré Presentacion_*.html en', dir); process.exit(1); }
const html = fs.readFileSync(path.join(dir, htmlName), 'utf8');
const pdfName = (html.match(/data-doc-pdf="([^"]+)"/) || [])[1] || htmlName.replace(/\.html$/, '_documento.pdf');
const css = fs.readFileSync(path.join(ROOT, 'classroom', SLUG, '_industry', 'deck-doc.css'), 'utf8');

const foot = '<div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:7px;color:#8A887F;padding:0 0.5in;'
  + 'display:flex;justify-content:space-between;box-sizing:border-box;"><span>Proyecto de Operaciones Unitarias · IQYA-2031 · 2026-20</span>'
  + '<span class="pageNumber"></span></div>';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } });
  await page.emulateMedia({ media: 'screen' });
  await page.goto(`${base}/classroom/${SLUG}/slides/${deck}/${htmlName}`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: css });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(1500);
  const out = path.join(dir, pdfName);
  await page.pdf({
    path: out, printBackground: true, format: 'Letter',
    margin: { top: '0.45in', bottom: '0.55in', left: '0.3in', right: '0.3in' },
    displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: foot,
  });
  console.log('PDF escrito en', out);
} finally { await browser.close(); }
