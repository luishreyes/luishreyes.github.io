// El homogeneizador con los nombres de sus piezas, para el capítulo 15 del libro de operaciones unitarias (Mezclado y
// escalado de tanques agitados, «El homogeneizador por dentro»):
//
//   node build.mjs --audit && node build.mjs --detalle --audit && node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//   CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina [ruta/homogenizer.svg]
//
// Sin --lamina escribe figuras/mezclado/_homogeneizador.qmd en el libro: la vista entera, el círculo con la primera
// etapa ampliada (out/detalle.svg) unido por una línea al círculo chico que marca de dónde sale, y los rótulos (línea y
// punto, como el mezclador estático y la válvula de control); y out/libro-preview.html para revisarla. Con --lamina
// escribe la lámina de la edición impresa en inglés (en/figuras/15/homogenizer.svg): lo mismo, con pocos rótulos en
// inglés, 428 pt de ancho, colores resueltos y la letra Archivo. Con --anclas, una página que muestra dónde cae cada
// ancla (para acomodar los rótulos).
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROTULOS, ROTULOS_EN, DESCRIPCION, DESCRIPCION_EN } from './rotulos.mjs';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta, cssAnatomia, reescribirCss } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
for (const f of ['fig.svg', 'detalle.svg', 'homogeneizador_data.json', 'detalle_data.json']) if (!existsSync(join(AQUI, 'out', f))) throw new Error(`Falta out/${f}: corra antes node build.mjs y node build.mjs --detalle`);
const r1 = (v) => Math.round(v * 10) / 10;
const FIG = { svg: readFileSync(join(AQUI, 'out/fig.svg'), 'utf8'), ...JSON.parse(readFileSync(join(AQUI, 'out/homogeneizador_data.json'), 'utf8')) };
const DET = { svg: readFileSync(join(AQUI, 'out/detalle.svg'), 'utf8'), ...JSON.parse(readFileSync(join(AQUI, 'out/detalle_data.json'), 'utf8')) };

/* ---------- la composición: la vista entera, el detalle y la línea que los une ---------- */
// dónde va el centro del círculo del detalle, en las unidades de la vista entera
const POS_DET = [Number(process.env.HM_DX || 800), Number(process.env.HM_DY || 575)];
const cuerpoDe = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<style>[^<]*<\/style>/, '');
const estiloDe = (svg) => (svg.match(/<style>([^<]*)<\/style>/) || [, ''])[1];
function composicion() {
  const cm = k.iso(FIG.CDET, FIG.P), rm = FIG.RDET / FIG.MDET;
  const tx = POS_DET[0] - DET.W / 2, ty = POS_DET[1] - DET.H / 2;
  const dx = POS_DET[0] - cm[0], dy = POS_DET[1] - cm[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const marca = `<circle class="hm-det-marca" cx="${r1(cm[0])}" cy="${r1(cm[1])}" r="${r1(rm)}"/>` +
    `<path class="hm-det-linea" d="M${r1(cm[0] + ux * rm)} ${r1(cm[1] + uy * rm)}L${r1(POS_DET[0] - ux * DET.RDET)} ${r1(POS_DET[1] - uy * DET.RDET)}"/>`;
  const det = `<g transform="translate(${r1(tx)} ${r1(ty)})">${cuerpoDe(DET.svg)}</g>`;
  const punto = (a, vista) => { const p = vista === 'det' ? DET.ANCLAS[a] : FIG.ANCLAS[a]; if (!p) throw new Error(`Falta el ancla ${a} (${vista})`); const q = k.iso(p, vista === 'det' ? DET.P : FIG.P); return vista === 'det' ? [q[0] + tx, q[1] + ty] : q; };
  const [a0, b0, a1, b1] = contorno(cuerpoDe(FIG.svg).replace(/<defs>[\s\S]*?<\/defs>/g, ''));
  const caja = [Math.min(a0, POS_DET[0] - DET.RDET), Math.min(b0, POS_DET[1] - DET.RDET), Math.max(a1, POS_DET[0] + DET.RDET), Math.max(b1, POS_DET[1] + DET.RDET)];
  return { cuerpo: cuerpoDe(FIG.svg) + marca + det, punto, caja };
}
const CSS_EXTRA = '.hm-det-marca{fill:none;stroke:#525c64;stroke-width:1px}.hm-det-linea{fill:none;stroke:#525c64;stroke-width:1px}';

// el contorno de un dibujo, de las coordenadas de sus trazos (relativas después del primer punto)
function contorno(svg) {
  const absol = [];
  for (const m of svg.matchAll(/ d="M(-?[\d.]+)[ ,]?(-?\.?[\d.]+)((?:[lmz][^"]*)?)"/g)) {
    let x = Number(m[1]), y = Number(m[2]);
    absol.push([x, y]);
    const rest = m[3].match(/[lmz]|-?\d*\.?\d+/g) || [];
    let cmd = '', i = 0, sx = x, sy = y;
    while (i < rest.length) {
      const t = rest[i];
      if (/[lmz]/.test(t)) { cmd = t; if (t === 'z') { x = sx; y = sy; } i++; continue; }
      const dx = Number(t), dy = Number(rest[i + 1]); i += 2;
      x += dx; y += dy; if (cmd === 'm') { sx = x; sy = y; cmd = 'l'; }
      absol.push([x, y]);
    }
  }
  return [Math.min(...absol.map((p) => p[0])), Math.min(...absol.map((p) => p[1])), Math.max(...absol.map((p) => p[0])), Math.max(...absol.map((p) => p[1]))];
}

if (process.argv.includes('--lamina')) await lamina();
else if (process.argv.includes('--anclas')) anclas();
else libro();

/* ====================================================================
   las anclas, para acomodar los rótulos
   ==================================================================== */
function anclas() {
  const { cuerpo, punto } = composicion();
  let marcas = '';
  for (const [a, vista] of ROTULOS) { const [x, y] = punto(a, vista); marcas += `<circle cx="${r1(x)}" cy="${r1(y)}" r="3" fill="#FFF500" stroke="#19222F"/><text x="${r1(x + 5)}" y="${r1(y - 4)}" font-size="10" fill="#B3261E">${a}</text>`; }
  const css = readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
  writeFileSync(join(AQUI, 'out/anclas.html'), `<!doctype html><html><head><meta charset="utf-8"><style>${css}${estiloDe(FIG.svg)}${CSS_EXTRA} body{margin:0;background:#fff} svg{display:block}</style></head><body><div class="iso" data-theme="light"><svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 -60 1200 900" width="1200" height="900">${cuerpo}${marcas}</svg></div></body></html>`);
  console.log('out/anclas.html');
}

/* ====================================================================
   el libro web: la vista con sus rótulos
   ==================================================================== */
function rotulado(lista, { letra, texto, marcaDet = true }) {
  const { cuerpo, punto, caja: [mx0, my0, mx1, my1] } = composicion();
  let trazos = '', bx0 = mx0, bx1 = mx1, by0 = my0, by1 = my1;
  const ancho = (t) => t.length * letra * 0.53;
  for (const [a, vista, t, tx, ty, lado] of lista) {
    const [ax, ay] = punto(a, vista);
    // un rótulo puede ir en dos renglones (con «\n»): la línea llega al primero
    const renglones = texto(t).split('\n'), w = Math.max(...renglones.map(ancho)), der = lado === 'der';
    const ex = der ? tx - 5 : tx + 5, ey = ty - letra * 0.35;
    const cuerpoTexto = renglones.length === 1 ? renglones[0] : renglones.map((r, i) => `<tspan x="${tx}"${i ? ` dy="${r1(letra * 1.2)}"` : ''}>${r}</tspan>`).join('');
    trazos += `<path class="rot-linea" d="M${r1(ax)} ${r1(ay)}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r1(ax)}" cy="${r1(ay)}" r="3"/>` +
      `<text class="rot-texto" x="${tx}" y="${ty}" text-anchor="${der ? 'start' : 'end'}" font-size="${letra}">${cuerpoTexto}</text>`;
    bx0 = Math.min(bx0, der ? tx : tx - w); bx1 = Math.max(bx1, der ? tx + w : tx);
    by0 = Math.min(by0, ty - letra); by1 = Math.max(by1, ty + 4 + (renglones.length - 1) * letra * 1.2);
  }
  return { cuerpo, trazos, caja: [Math.floor(bx0 - 10), Math.floor(by0 - 8), Math.ceil(bx1 + 10), Math.ceil(by1 + 10)] };
}
function libro() {
  const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
  const DEST = join(LIBRO, 'figuras/mezclado');
  const { cuerpo, trazos, caja } = rotulado(ROTULOS, { letra: 18, texto: (t) => t });
  const [vx, vy, x1, y1] = caja, vw = x1 - vx, vh = y1 - vy;
  const estilo = `<style>${estiloDe(FIG.svg)}${CSS_EXTRA}</style>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${DESCRIPCION}">${estilo}${cuerpo}<g class="rotulos">${trazos}</g></svg>`;
  const html = aplicarPaleta(svg, 'mezclado/_homogeneizador');
  mkdirSync(DEST, { recursive: true });
  writeFileSync(join(DEST, '_homogeneizador.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + html + '</div>\n```\n');
  console.log('_homogeneizador.qmd', Math.round(html.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);
  // una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
  // de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
  const cssLibro = join(LIBRO, 'estilo/anatomia.css');
  const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
  writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Homogeneizador (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:900px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${html}</div></div></body></html>`);
  console.log('out/libro-preview.html');
}

/* ====================================================================
   la lámina de la edición impresa: la misma vista con pocos rótulos en inglés, colores resueltos
   ==================================================================== */
async function lamina() {
  const SALIDA = resolve(arg('--lamina', join(AQUI, '../../../../libro-operaciones-unitarias/en/figuras/15/homogenizer.svg')));
  const FUENTES = resolve(arg('--fuentes', join(AQUI, '../../../../libro-operaciones-unitarias/en/estilo/fuentes')));
  const ANCHO = 428, LETRA = 7.5, TINTA = '#19222F', TRAZO = 0.32;
  // la letra en unidades del dibujo: la que queda en LETRA pt con la escala de la lámina (dos vueltas bastan)
  let letra = 22, R;
  for (let vuelta = 0; vuelta < 3; vuelta++) { R = rotulado(ROTULOS_EN, { letra, texto: (t) => t }); letra = LETRA / (ANCHO / (R.caja[2] - R.caja[0])); }
  const { cuerpo, trazos, caja } = R;
  const [vx, vy, x1, y1] = caja, vw = x1 - vx, vh = y1 - vy;
  const s = ANCHO / vw, ALTO = Math.ceil(vh * s);
  const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright');
  const b64 = (f) => readFileSync(join(FUENTES, f)).toString('base64');
  const fuentes = [500, 600].map((w) => `@font-face{font-family:Archivo;font-weight:${w};src:url(data:font/ttf;base64,${b64(`Archivo-${w}.ttf`)})}`).join('');
  const exe = process.env.CHROME_PATH ? (existsSync(join(process.env.CHROME_PATH, 'chrome')) ? join(process.env.CHROME_PATH, 'chrome') : process.env.CHROME_PATH) : undefined;
  const nav = await chromium.launch({ args: ['--no-sandbox'], ...(exe && existsSync(exe) ? { executablePath: exe } : {}) });
  const pag = await nav.newPage();
  const rotCss = `.rot-linea{fill:none;stroke:${TINTA};stroke-width:${r1(0.5 / s * 10) / 10}px}.rot-punto{fill:#FFF500;stroke:${TINTA};stroke-width:${r1(0.5 / s * 10) / 10}px}.rot-texto{fill:${TINTA};font-family:Archivo;font-weight:600}`;
  const svgIn = aplicarPaleta(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}"><style>${estiloDe(FIG.svg)}${CSS_EXTRA}</style>${cuerpo}<g class="rotulos">${trazos}</g></svg>`, 'mezclado/_homogeneizador');
  await pag.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fuentes}${cssAnatomia(k.ISO_CSS, '')}${rotCss}</style></head><body><div class="iso" data-theme="light" style="width:${vw}px">${svgIn}</div></body></html>`, { waitUntil: 'load' });
  await pag.evaluate(() => document.fonts.ready);
  const res = await pag.evaluate(() => {
    const FORMAS = new Set(['path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'text']);
    const clases = new Map(), claseDe = (decl) => { if (!clases.has(decl)) clases.set(decl, 'c' + clases.size); return clases.get(decl); };
    const num = (v) => Math.round(parseFloat(v) * 1000) / 1000;
    const svg = document.querySelector('svg');
    const todos = [...svg.querySelectorAll('*')], nuevas = new Map(), quitar = [];
    for (const el of todos) {
      const tag = el.tagName.toLowerCase();
      if (tag === 'style' || el.closest('clipPath') || el.closest('defs')) continue;
      const cs = getComputedStyle(el), fuera = [];
      if (FORMAS.has(tag)) {
        if (cs.display === 'none' || cs.visibility === 'hidden') { quitar.push(el); continue; }
        const d = [`fill:${cs.fill === 'none' ? 'none' : cs.fill}`];
        if (cs.fill !== 'none' && num(cs.fillOpacity) !== 1) d.push(`fill-opacity:${num(cs.fillOpacity)}`);
        if (cs.fillRule === 'evenodd') d.push('fill-rule:evenodd');
        if (cs.stroke !== 'none' && num(cs.strokeWidth) > 0) {
          d.push(`stroke:${cs.stroke}`, `stroke-width:${num(cs.strokeWidth)}`);
          if (num(cs.strokeOpacity) !== 1) d.push(`stroke-opacity:${num(cs.strokeOpacity)}`);
          if (cs.strokeLinecap !== 'butt') d.push(`stroke-linecap:${cs.strokeLinecap}`);
          if (cs.strokeLinejoin !== 'miter') d.push(`stroke-linejoin:${cs.strokeLinejoin}`);
        } else d.push('stroke:none');
        if (num(cs.opacity) !== 1) d.push(`opacity:${num(cs.opacity)}`);
        if (tag === 'text') d.push('font-family:Archivo', `font-weight:${cs.fontWeight}`);
        fuera.push(claseDe(d.join(';')));
      } else if (tag === 'g' && num(cs.opacity) !== 1) fuera.push(claseDe(`opacity:${num(cs.opacity)}`));
      nuevas.set(el, fuera);
    }
    quitar.forEach((el) => el.remove());
    for (const [el, fuera] of nuevas) {
      for (const a of [...el.attributes]) if (a.name === 'class' || a.name.startsWith('data-') || a.name.startsWith('aria-') || a.name === 'role' || a.name === 'fill-rule') el.removeAttribute(a.name);
      if (fuera.length) el.setAttribute('class', fuera.join(' '));
    }
    svg.querySelectorAll('style').forEach((st) => st.remove());
    return { cuerpo: svg.innerHTML, css: [...clases] };
  });
  await nav.close();
  const hex = (decl) => decl.replace(/rgba?\((\d+), (\d+), (\d+)(?:, [\d.]+)?\)/g, (_, r, g, b) => '#' + [r, g, b].map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase());
  // los trazos del dibujo: a TRAZO pt de ancho en la hoja (los anchos de la pantalla van en unidades del dibujo)
  const ancho = (decl) => decl.replace(/stroke-width:([\d.]+)/, (_, w) => `stroke-width:${Math.round(((+w * TRAZO) / (s * 0.8)) * 1000) / 1000}`);
  const css = res.css.map(([decl, n]) => `.hmo .${n}{${ancho(hex(decl))}}`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="hmo" width="${ANCHO}pt" height="${ALTO}pt" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${DESCRIPCION_EN}">`
    + `<style>${css}</style>${res.cuerpo}</svg>\n`;
  mkdirSync(dirname(SALIDA), { recursive: true });
  writeFileSync(SALIDA, svg);
  if (/[áéíóúñ¿¡]/i.test(svg.replace(/<style>[\s\S]*?<\/style>/, '').replace(/aria-label="[^"]*"/, ''))) console.warn('¡Ojo! queda texto en español en el SVG');
  console.log(SALIDA, `${ANCHO} × ${ALTO} pt`, Math.round(svg.length / 1024), 'KB', 'escala', s.toFixed(4));
}
