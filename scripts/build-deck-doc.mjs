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
//   CURSO=iqya-2031-2027-10 node scripts/build-deck-doc.mjs Presentacion_del_Curso
// Las animaciones de Manim (video.anim) salen con su póster, el último cuadro.
// Si el <html> del deck lleva data-impreso="libro" (POU 2027-10), sale en cambio como la
// edición impresa del libro, con public/classroom/estilo-libro/presentacion.css.
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { actividadesAlFinal } from './lib/actividades-al-final.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../public');
const SLUG = process.env.CURSO || 'iqya-2031-2026-20';
const PERIODO = SLUG.match(/\d{4}-\d{2}$/)?.[0] ?? '';
const deck = process.argv[2];
const base = process.argv[3] || 'http://localhost:8765';
if (!deck) { console.error('Uso: node scripts/build-deck-doc.mjs <Carpeta_del_deck> [url-base]'); process.exit(1); }

const dir = path.join(ROOT, 'classroom', SLUG, 'slides', deck);
const htmlName = fs.readdirSync(dir).find((f) => /^Presentacion_.*\.html$/.test(f));
if (!htmlName) { console.error('No encontré Presentacion_*.html en', dir); process.exit(1); }
const html = fs.readFileSync(path.join(dir, htmlName), 'utf8');
const pdfName = (html.match(/data-doc-pdf="([^"]+)"/) || [])[1] || htmlName.replace(/\.html$/, '_documento.pdf');
// La hoja que apila las diapositivas es la de 2026-20, salvo que el curso traiga la suya.
const propia = path.join(ROOT, 'classroom', SLUG, '_industry', 'deck-doc.css');
const css = fs.readFileSync(fs.existsSync(propia) ? propia : path.join(ROOT, 'classroom', 'iqya-2031-2026-20', '_industry', 'deck-doc.css'), 'utf8')
  + 'video.anim{display:none!important}img.anim-impresion{display:block!important}';

// Con data-impreso="libro" en el <html>, el PDF sale como la edición impresa del libro
// (public/classroom/estilo-libro/presentacion.css): hoja de 7 × 10 in, encabezado y
// números de página desde el @page de la hoja, y una ventana del ancho de la caja de texto.
const LIBRO = /<html[^>]*data-impreso="libro"/.test(html);

const foot = '<div style="width:100%;font-family:Arial,Helvetica,sans-serif;font-size:7px;color:#8A887F;padding:0 0.5in;'
  + `display:flex;justify-content:space-between;box-sizing:border-box;"><span>Proyecto de Operaciones Unitarias · IQYA-2031 · ${PERIODO}</span>`
  + '<span class="pageNumber"></span></div>';

const browser = await chromium.launch({ args: process.getuid?.() === 0 ? ['--no-sandbox'] : [] });
try {
  // Con movimiento reducido, las animaciones por pasos saltan a su final (ver lib/actividades-al-final.mjs).
  const page = await browser.newPage({ viewport: LIBRO ? { width: 571, height: 960 } : { width: 1100, height: 1400 }, reducedMotion: 'reduce' });
  await page.emulateMedia({ media: 'screen' });
  await page.goto(`${base}/classroom/${SLUG}/slides/${deck}/${htmlName}`, { waitUntil: 'networkidle' });
  if (LIBRO) {
    // El @page de 1920 × 1080 que inyecta deck-stage le ganaría a la hoja del libro.
    await page.evaluate(() => {
      document.getElementById('deck-stage-print-page')?.remove();
      document.querySelector('deck-stage').id = 'impreso'; // el prefijo de la hoja: le gana a las reglas de celular
    });
    await page.addStyleTag({ url: `${base}/classroom/estilo-libro/presentacion.css` });
    // El encabezado de cada página lleva el nombre de la presentación (lo que va antes
    // del primer « · » de su <title>) y el periodo.
    const titulo = ((html.match(/<title>([^<]*)<\/title>/) || [])[1] || '').split(' · ')[0].trim();
    if (titulo) {
      const texto = `${titulo}${PERIODO ? ' · ' + PERIODO : ''}`.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      await page.addStyleTag({ content: `@page { @top-left { content: "${texto}" "\\2003\\2003" counter(page); } } @page :first { @top-left { content: none; } }` });
    }
    await page.addStyleTag({ content: 'video.anim{display:none!important}img.anim-impresion{display:block!important}' });
  } else {
    await page.addStyleTag({ content: css });
  }
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  // Los botones con data-doc-final se pulsan hasta el último paso: el PDF muestra el estado completo.
  await page.evaluate(() => document.querySelectorAll('[data-doc-final]').forEach((b) => { for (let i = 0; i < 40 && !b.disabled; i++) b.click(); }));
  // Las animaciones por pasos, en su último paso y con todas sus frases.
  await actividadesAlFinal(page);
  await page.waitForTimeout(1500);
  const out = path.join(dir, pdfName);
  if (LIBRO) {
    // El papel se pasa también aquí: con el de carta por defecto (816 px) el deck
    // volvería a su versión de escritorio al imprimir.
    await page.pdf({ path: out, printBackground: true, preferCSSPageSize: true, width: '178mm', height: '254mm' });
  } else {
    await page.pdf({
      path: out, printBackground: true, format: 'Letter',
      margin: { top: '0.45in', bottom: '0.55in', left: '0.3in', right: '0.3in' },
      displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: foot,
    });
  }
  console.log('PDF escrito en', out);
} finally { await browser.close(); }
