// Genera el PDF para los profesores con los resultados de la selección de
// retos del SPDP 2026-20, en el formato del programa del curso (portada negra
// con riel naranja, cabecera con el escudo y capítulos numerados).
//
// Lee los mismos datos que la página /classroom/iqya-3050-2026-20/resultados:
//   components/data/classroom/spdp-retos-2026-20.ts
//   components/data/classroom/spdp-retos-seleccionados-2026-20.ts
//   components/data/classroom/spdp-estudiantes-2026-20.ts
//   components/data/classroom/spdp-resultados-2026-20.ts
//
// Uso (Node 22 lee los .ts directamente):
//   node --experimental-strip-types scripts/build-spdp-seleccion-pdf.mjs
// Regenerar CADA VEZ que cambien las asignaciones.

import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'components/data/classroom');
const OUT = path.join(ROOT, 'public/classroom/iqya-3050-2026-20/documentos/IQYA-3050-Seleccion-de-Retos-2026-20-8B.pdf');

const cargar = (f) => import(pathToFileURL(path.join(DATA, f)).href);
const { retos202620 } = await cargar('spdp-retos-2026-20.ts');
const { retosSeleccionados, otrosCasos, fechaSeleccion, plazoContacto } = await cargar('spdp-retos-seleccionados-2026-20.ts');
const { estudiantes202620 } = await cargar('spdp-estudiantes-2026-20.ts');
const { armarResultados, nombres, personas } = await cargar('spdp-resultados-2026-20.ts');

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  // Playwright global (entornos en la nube)
  const require = createRequire(import.meta.url);
  ({ chromium } = require('/opt/node22/lib/node_modules/playwright'));
}

const res = armarResultados(retos202620, retosSeleccionados, estudiantes202620, otrosCasos);
const t = res.totales;

const fuente = (pkg, archivo) => pathToFileURL(path.join(ROOT, 'node_modules/@fontsource', pkg, 'files', archivo)).href;
const escudo = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, 'assets/uniandes-escudo.png')).toString('base64');
const e = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- piezas ---------- */
const metaReto = (r) => `${e(r.reto.area)} · ${e(r.reto.tipo)} · para ${personas(r.reto.integrantes)}`;
const notas = (r, conAsesor = false) => {
  const n = [];
  if (conAsesor) n.push(`Asesor: ${e(r.reto.asesor)}`);
  if (!conAsesor && r.reto.coasesor) n.push(`Coasesor: ${e(r.reto.coasesor)}`);
  if (r.libres > 0 && r.estudiantes.length) n.push('Queda un cupo');
  if (r.nota) n.push(e(r.nota));
  return n.map((x) => `<span>${x}</span>`).join('') + (r.pendiente ? `<span class="pend"><b>Pendiente.</b> ${e(r.pendiente)}</span>` : '');
};
const filaReto = (r, conAsesor = false) => `
  <tr class="${r.estudiantes.length ? '' : 'vacio'}">
    <td class="c-reto"><span class="id">${r.reto.id}</span><b>${e(r.reto.titulo)}</b><small>${metaReto(r)}</small></td>
    <td class="c-est">${r.estudiantes.length ? r.estudiantes.map((x) => `<div>${e(x)}</div>`).join('') : '<em>Sin estudiantes en esta convocatoria</em>'}</td>
    <td class="c-notas">${notas(r, conAsesor)}</td>
  </tr>`;

const asesorBloque = (a) => `
  <section class="asesor">
    <h3>${e(a.nombre)}</h3>
    <p class="asesor-meta">${a.contactos} ${a.contactos === 1 ? 'estudiante lo contactará' : 'estudiantes lo contactarán'}</p>
    <table class="t-retos">
      <thead><tr><th>Reto</th><th>Estudiantes</th><th>Notas</th></tr></thead>
      <tbody>
        ${a.principal.map((r) => filaReto(r)).join('')}
      </tbody>
    </table>
  </section>`;

const indice = res.estudiantes
  .map((s) =>
    s.retos.length
      ? s.retos
          .map(
            (r, i) => `<tr>${i === 0 ? `<td rowspan="${s.retos.length}" class="c-nom">${e(s.nombre)}</td>` : ''}<td>${r.reto.id} · ${e(r.reto.titulo)}</td><td>${e(r.reto.asesor)}${r.reto.coasesor ? `<small>con ${e(r.reto.coasesor)}</small>` : ''}</td></tr>`,
          )
          .join('')
      : `<tr class="otro"><td class="c-nom">${e(s.nombre)}</td><td>${e(s.otro?.situacion ?? 'Sin reto registrado.')}</td><td>${e(s.otro?.contacto ?? 'Luis H. Reyes')}</td></tr>`,
  )
  .join('');

const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><title>Selección de retos · SPDP 2026-20</title>
<style>
@font-face{font-family:Anton;src:url(${fuente('anton', 'anton-latin-400-normal.woff2')})}
@font-face{font-family:Barlow;font-weight:400;src:url(${fuente('barlow', 'barlow-latin-400-normal.woff2')})}
@font-face{font-family:Barlow;font-weight:500;src:url(${fuente('barlow', 'barlow-latin-500-normal.woff2')})}
@font-face{font-family:Barlow;font-weight:600;src:url(${fuente('barlow', 'barlow-latin-600-normal.woff2')})}
@font-face{font-family:Barlow;font-weight:700;src:url(${fuente('barlow', 'barlow-latin-700-normal.woff2')})}
@font-face{font-family:Playfair;src:url(${fuente('playfair-display', 'playfair-display-latin-400-normal.woff2')})}
:root{--ink:#000;--text:#232323;--muted:#6e6a64;--rule:#dcd8d0;--paper:#f5f3ef;--orange:#f1541b;--orange-d:#b93a0b}
@page{size:Letter;margin:1.15in 0.75in 0.85in;
  @top-center{content:"";width:100%;background:url("__CABECERA__") no-repeat center bottom 22px/100% auto}
  @bottom-left{content:"IQYA 3050 · Seminario de Proyecto de Desarrollo Profesional";font-family:Barlow;font-weight:500;font-size:6.5pt;letter-spacing:.2em;text-transform:uppercase;color:#6e6a64;vertical-align:top;padding-top:8px;border-top:1px solid #dcd8d0}
  @bottom-right{content:counter(page) " / " counter(pages);font-family:Barlow;font-weight:500;font-size:6.5pt;letter-spacing:.2em;color:#6e6a64;vertical-align:top;padding-top:8px;border-top:1px solid #dcd8d0}}
@page :first{margin:0;@top-center{content:none}@bottom-left{content:none}@bottom-right{content:none}}
*{box-sizing:border-box}
html,body{margin:0;font-family:Barlow,Arial,sans-serif;color:var(--text);font-size:10.5pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact}
/* portada */
.portada{width:8.5in;height:11in;background:#000;color:#fff;position:relative;page-break-after:always;padding:0.9in 0.75in 0.75in 1.35in;display:flex;flex-direction:column}
.portada::before{content:'';position:absolute;left:0;top:0;bottom:0;width:0.5in;background:var(--orange)}
.portada .riel{position:absolute;left:0.25in;bottom:0.75in;transform:rotate(-90deg);transform-origin:left top;translate:-0.06in 0;font-size:6.5pt;font-weight:600;letter-spacing:.3em;text-transform:uppercase;white-space:nowrap;color:#000}
.portada .kick{font-size:7.5pt;font-weight:500;letter-spacing:.24em;text-transform:uppercase;color:rgba(255,255,255,.7);padding-top:14px;position:relative}
.portada .kick::before{content:'';position:absolute;top:0;left:0;width:1.4in;border-top:2px solid #fff}
.portada .medio{margin-top:auto;margin-bottom:auto}
.portada .curso{font-family:Playfair;color:var(--orange);font-size:15pt;margin-bottom:10px}
.portada h1{font-family:Anton;font-weight:400;text-transform:uppercase;font-size:50pt;line-height:.95;margin:0}
.portada .sub{margin-top:22px;font-size:11pt;line-height:1.55;color:rgba(255,255,255,.82);max-width:4.6in}
.portada .pie{display:flex;gap:0.6in;border-top:1px solid rgba(255,255,255,.3);padding-top:14px}
.portada .pie span{display:block;font-size:6.5pt;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.55);margin-bottom:4px}
.portada .pie div{font-size:9.5pt}
/* capítulos */
h2{font-family:Anton;font-weight:400;text-transform:uppercase;font-size:17pt;color:var(--ink);margin:0 0 12px;padding-bottom:9px;border-bottom:1px solid var(--rule);display:flex;align-items:baseline;gap:10px;page-break-after:avoid}
h2 .n{font-family:Playfair;color:var(--orange);font-size:12pt}
.cap{margin-bottom:30px}
.cap+.cap.salto{page-break-before:always}
p{margin:0 0 10px}
.cifras{display:grid;grid-template-columns:repeat(4,1fr);gap:0 18px;margin:16px 0 18px}
.cifras div{border-top:1px solid var(--rule);padding-top:8px}
.cifras b{display:block;font-family:Anton;font-weight:400;font-size:28pt;line-height:1;color:var(--ink)}
.cifras b.n{color:var(--orange-d)}
.cifras span{display:block;font-size:7pt;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-top:6px}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:7pt;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);padding:6px 8px 6px 0;border-bottom:1.5px solid var(--ink)}
td{padding:7px 8px 7px 0;border-bottom:1px solid var(--rule);vertical-align:top}
td small{display:block;color:var(--muted);font-size:8.5pt}
.t-areas td:not(:first-child),.t-areas th:not(:first-child){text-align:right;width:15%}
.callout{background:var(--paper);border-top:2px solid var(--orange);padding:12px 16px;margin:12px 0}
.callout .et{font-size:7pt;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--orange-d);margin-bottom:6px}
.callout ul{margin:0;padding-left:0;list-style:none}
.callout li{padding-left:16px;position:relative;margin:3px 0}
.callout li::before{content:'—';position:absolute;left:0;color:var(--orange)}
/* asesores */
.asesor{page-break-inside:avoid;margin:0 0 22px}
.asesor h3{font-family:Playfair;font-weight:400;font-size:15pt;color:var(--ink);margin:0}
.asesor-meta{font-size:8pt;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--orange-d);margin:2px 0 6px}
.t-retos .c-reto{width:44%}
.t-retos .c-est{width:28%;font-weight:600;color:var(--ink)}
.t-retos .c-notas{font-size:8.5pt;color:var(--muted)}
.t-retos .c-notas span{display:block;margin-bottom:2px}
.t-retos .c-notas .pend{color:var(--orange-d)}
.t-retos .id{font-family:Anton;color:var(--orange-d);margin-right:6px}
.t-retos tr.vacio td{color:var(--muted)}
.t-retos tr.vacio b{font-weight:500}
.t-retos .c-est em{font-weight:400;font-style:normal;color:var(--muted)}
.t-retos tr.sub td{font-size:7pt;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);padding-top:12px;border-bottom:1.5px solid var(--ink)}
.t-indice .c-nom{font-weight:600;color:var(--ink);width:32%}
.t-indice td{font-size:9.5pt;padding:5px 8px 5px 0}
.t-indice tr.otro td{color:var(--muted)}
.t-indice tr{page-break-inside:avoid}
.abierto{border-left:3px solid var(--ink);padding:6px 12px;margin:0 0 10px;page-break-inside:avoid}
.abierto.p{border-left-color:var(--orange)}
.abierto .et{font-size:7pt;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--orange-d)}
</style></head><body>

<section class="portada">
  <div class="kick">Resultados de la selección</div>
  <div class="medio">
    <div class="curso">IQYA 3050</div>
    <h1>Selección de<br>retos 2026-20</h1>
    <p class="sub">Quién trabajará con cada asesor en el Proyecto de Desarrollo Profesional de 2027-10. Sesión de selección del ${e(fechaSeleccion)}.</p>
  </div>
  <div class="pie">
    <div><span>Profesor</span>Luis H. Reyes · Profesor Asociado</div>
    <div><span>Correo</span>lh.reyes@uniandes.edu.co</div>
  </div>
  <div class="riel">Uniandes · Ingeniería Química y de Alimentos</div>
</section>

<section class="cap">
  <h2><span class="n">01</span>Resumen</h2>
  <p>En la sesión del ${e(fechaSeleccion)}, los estudiantes del Seminario de Proyecto de Desarrollo Profesional (SPDP) escogieron los retos que desarrollarán en el Proyecto de Desarrollo Profesional (PDP) de 2027-10. Este documento le muestra a cada asesor qué estudiantes trabajarán en sus retos y quiénes lo van a contactar.</p>
  <div class="cifras">
    <div><b class="n">${t.estudiantesConReto}</b><span>de ${t.estudiantesCurso} estudiantes con reto</span></div>
    <div><b>${t.conEstudiantes}</b><span>Retos con estudiantes</span></div>
    <div><b>${t.retos}</b><span>Retos propuestos</span></div>
    <div><b>${t.asesores}</b><span>Asesores</span></div>
  </div>
  <p>${t.dosRetos} estudiantes tienen dos retos, uno de Ingeniería Química y otro de Ingeniería de Alimentos. Los retos por área quedaron así:</p>
  <table class="t-areas">
    <thead><tr><th>Área</th><th>Propuestos</th><th>Con estudiantes</th><th>Estudiantes</th></tr></thead>
    <tbody>${res.areas.map((a) => `<tr><td>${e(a.area)}</td><td>${a.propuestos}</td><td>${a.conEstudiantes}</td><td>${a.estudiantes}</td></tr>`).join('')}</tbody>
  </table>
</section>

<section class="cap">
  <h2><span class="n">02</span>Lo que puede esperar</h2>
  <div class="callout">
    <div class="et">Reunión de 15 minutos</div>
    <ul>
      <li>Entre el ${e(fechaSeleccion.replace('miércoles ', ''))} y el ${e(plazoContacto)}, cada estudiante le escribirá un correo para pedirle una reunión de 15 minutos.</li>
      <li>En ese correo el estudiante debe explicar con claridad el tema de la reunión: la documentación que necesita, la información del reto que quiere aclarar o las condiciones de laboratorio o de la empresa.</li>
      <li>Si el reto tiene coasesor, el estudiante lo pondrá en copia.</li>
    </ul>
  </div>
  <p>Para cualquier duda sobre la selección o el curso, escríbale a Luis H. Reyes (lh.reyes@uniandes.edu.co).</p>
</section>

<section class="cap salto">
  <h2><span class="n">03</span>Estudiantes por asesor</h2>
  ${res.asesores.map(asesorBloque).join('')}
</section>

<section class="cap salto">
  <h2><span class="n">04</span>Lo que queda abierto</h2>
  ${res.pendientes.map((r) => `<div class="abierto p"><div class="et">Por confirmar</div><b>${r.reto.id} · ${e(r.reto.titulo)}</b> (${e(r.reto.asesor)}). ${e(r.pendiente)} Estudiantes: ${e(nombres(r.estudiantes))}.</div>`).join('')}
  ${otrosCasos.map((o) => `<div class="abierto"><div class="et">Caso aparte</div><b>${e(o.nombre)}.</b> ${e(o.situacion)} Contacto: ${e(o.contacto)}.</div>`).join('')}
  ${res.conCupo.length ? `<div class="abierto"><div class="et">Retos con un cupo libre</div>${res.conCupo.map((r) => `${r.reto.id} · ${e(r.reto.titulo)} (${e(r.reto.asesor)}; hoy: ${e(nombres(r.estudiantes))})`).join('<br>')}</div>` : ''}
  ${res.sinEstudiantes.length ? `<div class="abierto"><div class="et">Retos sin estudiantes</div>${res.sinEstudiantes.map((r) => `${r.reto.id} · ${e(r.reto.titulo)} (${e(r.reto.asesor)})`).join('<br>')}</div>` : ''}
</section>

<section class="cap">
  <h2><span class="n">05</span>Índice de estudiantes</h2>
  <table class="t-indice">
    <thead><tr><th>Estudiante</th><th>Reto</th><th>Asesor</th></tr></thead>
    <tbody>${indice}</tbody>
  </table>
</section>
</body></html>`;

// La cabecera del programa (escudo, «SPDP» en Anton, rótulo a la derecha) se
// renderiza aparte como imagen nítida y va en el recuadro superior de cada
// página; las plantillas de cabecera de Chrome no cargan las fuentes del curso
// y se imprimirían también sobre la portada.
const cabeceraHtml = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Anton;src:url(${fuente('anton', 'anton-latin-400-normal.woff2')})}
@font-face{font-family:Barlow;font-weight:500;src:url(${fuente('barlow', 'barlow-latin-500-normal.woff2')})}
html,body{margin:0;background:transparent}
.c{width:672px;height:46px;box-sizing:border-box;display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1.5px solid #000;padding-bottom:7px;font-family:Barlow}
.l{display:flex;align-items:flex-end;gap:9px}
.l img{height:27px}
.s{font-family:Anton;font-size:17px;line-height:1}
.p{font-size:6px;letter-spacing:1.7px;text-transform:uppercase;color:#6e6a64;margin-top:4px}
.r{font-size:8.5px;letter-spacing:2.2px;text-transform:uppercase;color:#6e6a64}
</style></head><body><div class="c"><div class="l"><img src="${escudo}"><div><div class="s">SPDP</div><div class="p">Proyecto de Desarrollo Profesional</div></div></div><div class="r">Selección de retos · 2026-20 (8B)</div></div></body></html>`;

const tmp = path.join(os.tmpdir(), `spdp-seleccion-${process.pid}.html`);
const tmpCab = path.join(os.tmpdir(), `spdp-cabecera-${process.pid}.html`);
fs.writeFileSync(tmpCab, cabeceraHtml);
const browser = await chromium.launch();
try {
  const cab = await browser.newPage({ viewport: { width: 672, height: 46 }, deviceScaleFactor: 4 });
  await cab.goto(pathToFileURL(tmpCab).href, { waitUntil: 'networkidle' });
  await cab.evaluate(() => document.fonts.ready);
  const png = (await cab.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 672, height: 46 } })).toString('base64');
  fs.writeFileSync(tmp, html.replace('__CABECERA__', 'data:image/png;base64,' + png));
  const page = await browser.newPage();
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: OUT,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
  });
  console.log('PDF:', path.relative(ROOT, OUT));
} finally {
  await browser.close();
  fs.rmSync(tmp, { force: true });
  fs.rmSync(tmpCab, { force: true });
}
