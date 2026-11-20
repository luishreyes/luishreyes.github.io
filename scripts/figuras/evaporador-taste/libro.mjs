// La etapa del TASTE con los nombres de sus piezas, para el libro de operaciones unitarias:
//
//   node build.mjs --audit && node build.mjs --detalle --audit
//   node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//   CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina [ruta/taste-stage.svg]
//
// Sin --lamina escribe figuras/evaporacion/_taste.qmd en el libro: la vista entera, el círculo con la boca de un tubo
// ampliada (out/detalle.svg), unido por una línea al círculo chico que marca de dónde sale (su centro se cambia con
// EV_DX y EV_DY), y los rótulos (línea, punto amarillo y texto, a los dos lados del dibujo, cada uno a la altura de su
// pieza y sin encimarse), y out/libro-preview.html y out/libro-preview-620.html para revisarla. Con --lamina escribe la
// lámina de la edición impresa en inglés (en/figuras/24/taste-stage.svg): lo mismo con menos rótulos en inglés, 428 pt
// de ancho, colores resueltos y la letra Archivo, que herramientas/svg-a-pdf.mjs del libro pasa a PDF. Con --anclas,
// una página que muestra dónde cae cada ancla (out/anclas.html).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROTULOS, ROTULOS_EN, PIES, PIES_EN, DESCRIPCION, DESCRIPCION_EN } from './rotulos.mjs';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta, cssAnatomia, revisar } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (key, d) => { const i = process.argv.indexOf(key); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const REPO_LIBRO = resolve(process.env.LIBRO_REPO || join(AQUI, '../../../../libro-operaciones-unitarias'));
for (const f of ['fig.svg', 'fig_data.json', 'detalle.svg', 'detalle_data.json']) if (!existsSync(join(AQUI, 'out', f))) throw new Error(`Falta out/${f}: corra antes node build.mjs y node build.mjs --detalle`);
const r1 = (v) => Math.round(v * 10) / 10;
const SVG = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');
const { P, ANCLAS, CDET, MDET, RDET } = JSON.parse(readFileSync(join(AQUI, 'out/fig_data.json'), 'utf8'));
const DSVG = readFileSync(join(AQUI, 'out/detalle.svg'), 'utf8');
const DD = JSON.parse(readFileSync(join(AQUI, 'out/detalle_data.json'), 'utf8'));
const VISTA = 'evaporacion/_taste';
const cuerpoDe = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<style>[^<]*<\/style>/, '');
const estiloDe = (svg) => (svg.match(/<style>([^<]*)<\/style>/) || [, ''])[1];

// los puntos de los trazos del dibujo (los trazos van con coordenadas relativas después del primero; ver compact() de
// build.mjs), sin los recortes, con los tramos largos subdivididos
function puntos(svg) {
  const out = [];
  // un número puede empezar por el punto y pegarse al anterior («M301.5.9» es 301,5 y 0,9)
  const N = String.raw`-?(?:\d+(?:\.\d*)?|\.\d+)`;
  for (const m of svg.replace(/<defs>[\s\S]*?<\/defs>/g, '').matchAll(new RegExp(` d="M(${N})[ ,]?(${N})((?:[lmz][^"]*)?)"`, 'g'))) {
    let x = Number(m[1]), y = Number(m[2]);
    out.push([x, y]);
    const rest = m[3].match(/[lmz]|-?\d*\.?\d+/g) || [];
    let cmd = '', i = 0, sx = x, sy = y;
    while (i < rest.length) {
      const t = rest[i];
      if (/[lmz]/.test(t)) { cmd = t; if (t === 'z') { x = sx; y = sy; } i++; continue; }
      const dx = Number(t), dy = Number(rest[i + 1]); i += 2;
      // un tramo largo (las columnas, la coraza) deja puntos cada 8 unidades, para que los rótulos lo vean en toda su altura
      if (cmd !== 'm') { const n = Math.floor(Math.hypot(dx, dy) / 8); for (let q = 1; q < n; q++) out.push([x + (dx * q) / n, y + (dy * q) / n]); }
      x += dx; y += dy; if (cmd === 'm') { sx = x; sy = y; cmd = 'l'; }
      out.push([x, y]);
    }
  }
  return out;
}
/* ── la composición: la vista entera, el círculo del detalle y la línea que los une. POS es el centro del círculo, en
   las unidades de la vista entera: a la izquierda de la calandria, bajo los rótulos de la cámara de reparto ── */
const POS = [Number(process.env.EV_DX || 205), Number(process.env.EV_DY || 430)];
const TD = [POS[0] - DD.W / 2, POS[1] - DD.H / 2];
const MARCA = k.iso(CDET, P), RM = RDET / MDET;
const COMPOS = (() => {
  const dx = POS[0] - MARCA[0], dy = POS[1] - MARCA[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  return `<circle class="ev-det-marca" cx="${r1(MARCA[0])}" cy="${r1(MARCA[1])}" r="${r1(RM)}"/>` +
    `<path class="ev-det-linea" d="M${r1(MARCA[0] + ux * RM)} ${r1(MARCA[1] + uy * RM)}L${r1(POS[0] - ux * RDET)} ${r1(POS[1] - uy * RDET)}"/>` +
    `<g transform="translate(${r1(TD[0])} ${r1(TD[1])})">${cuerpoDe(DSVG)}</g>`;
})();
// un ancla: de la vista entera, o del detalle si empieza por «d:»
const punto = (a) => {
  if (a.startsWith('d:')) { const p = DD.ANCLAS[a.slice(2)]; if (!p) throw new Error(`Falta el ancla ${a}`); const q = k.iso(p, DD.P); return [q[0] + TD[0], q[1] + TD[1]]; }
  if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a}`);
  return k.iso(ANCLAS[a], P);
};
const CIRCULO = Array.from({ length: 48 }, (_, i) => [POS[0] + RDET * Math.cos((Math.PI * 2 * i) / 48), POS[1] + RDET * Math.sin((Math.PI * 2 * i) / 48)]);
const PTS = [...puntos(SVG), ...CIRCULO];

/* ── los rótulos: a los dos lados del dibujo, cada uno a la altura de su pieza y tan cerca del dibujo como se pueda, sin
   encimarse (el mismo acomodo de ../intercambiador/libro-comun.mjs) ── */
function rotulado(lista, pies, { letra, separa = 18, margen = 10 }) {
  const rp = letra * 0.14;
  const pts = PTS;
  const minX = Math.min(...pts.map((p) => p[0])), maxX = Math.max(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1])), maxY = Math.max(...pts.map((p) => p[1]));
  const ancho = (t) => Math.max(...t.split('\n').map((r) => r.length)) * letra * 0.53;
  const franja = (y, n, izq) => {
    const en = pts.filter((p) => p[1] > y - letra * 1.1 && p[1] < y + letra * (0.5 + 1.2 * (n - 1)));
    return en.length ? (izq ? Math.min(...en.map((p) => p[0])) : Math.max(...en.map((p) => p[0]))) : izq ? maxX : minX;
  };
  const lados = { izq: [], der: [] };
  for (const [a, lado, t, op = {}] of lista) {
    const [ax, ay] = punto(a);
    lados[lado].push({ a, t, op, n: t.split('\n').length, ax: r1(ax), ay: r1(ay) });
  }
  for (const col0 of Object.values(lados)) {
    col0.forEach((r) => (r.y = r.op.y ?? r.ay + (r.op.dy || 0)));
    const col = col0.filter((r) => r.op.y === undefined).sort((p, q) => p.y - q.y);
    for (let i = 1; i < col.length; i++) { const prev = col[i - 1]; col[i].y = Math.max(col[i].y, prev.y + letra * 1.6 + (prev.n - 1) * letra * 1.2); }
  }
  for (const r of lados.izq) r.x = r.op.x ?? Math.min(franja(r.y, r.n, true), r.ax - 12) - separa;
  for (const r of lados.der) r.x = r.op.x ?? Math.max(franja(r.y, r.n, false), r.ax + 12) + separa;
  // en cada lado, los textos que se pisarían con la línea de otro se alinean al más alejado
  for (const [col, izq] of [[lados.izq, true], [lados.der, false]]) {
    for (let vuelta = 0; vuelta < 12; vuelta++) {
      let cambio = false;
      for (const r of col) for (const o of col) {
        if (o === r || r.op.x !== undefined || o.op.x !== undefined) continue;
        const w = ancho(o.t), x0 = izq ? o.x - w - 2 : o.x - 2, x1 = izq ? o.x + 2 : o.x + w + 2, y0 = o.y - letra * 0.85, y1 = o.y + letra * (0.45 + 1.2 * (o.n - 1));
        let cruza = false;
        for (let t = 0; t <= 1; t += 0.02) { const x = r.x + (izq ? 5 : -5) + (r.ax - r.x) * t, y = r.y - letra * 0.35 + (r.ay - r.y + letra * 0.35) * t; if (x > x0 && x < x1 && y > y0 && y < y1) cruza = true; }
        if (cruza) { const x = izq ? Math.min(r.x, o.x) : Math.max(r.x, o.x); if (r.x !== x || o.x !== x) { r.x = x; o.x = x; cambio = true; } }
      }
      if (!cambio) break;
    }
  }
  let trazos = '', bx0 = minX, bx1 = maxX, by0 = minY, by1 = maxY;
  for (const [col, izq] of [[lados.izq, true], [lados.der, false]]) for (const r of col) {
    const ex = izq ? r.x + 5 : r.x - 5, ey = r.y - letra * 0.35, rs = r.t.split('\n');
    const tsp = rs.length === 1 ? rs[0] : rs.map((s, i) => `<tspan x="${r1(r.x)}"${i ? ` dy="${r1(letra * 1.2)}"` : ''}>${s}</tspan>`).join('');
    trazos += `<path class="rot-linea" d="M${r.ax} ${r.ay}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r.ax}" cy="${r.ay}" r="${r1(rp)}"/>` +
      `<text class="rot-texto" x="${r1(r.x)}" y="${r1(r.y)}" text-anchor="${izq ? 'end' : 'start'}" font-size="${r1(letra)}">${tsp}</text>`;
    const w = ancho(r.t);
    bx0 = Math.min(bx0, izq ? r.x - w : r.x); bx1 = Math.max(bx1, izq ? r.x : r.x + w);
    by0 = Math.min(by0, r.y - letra); by1 = Math.max(by1, r.y + 4 + (r.n - 1) * letra * 1.2);
  }
  // el nombre del círculo, debajo, centrado, sin línea
  for (const t of pies) {
    // un poco a la derecha del centro, para no llegar a los rótulos del círculo, que van a la izquierda
    const rs = t.split('\n'), y = POS[1] + RDET + letra * 1.25, w = ancho(t), xp = POS[0] + RDET * 0.4;
    const tsp = rs.length === 1 ? rs[0] : rs.map((q, i) => `<tspan x="${r1(xp)}"${i ? ` dy="${r1(letra * 1.2)}"` : ''}>${q}</tspan>`).join('');
    trazos += `<text class="rot-texto rot-pie" x="${r1(xp)}" y="${r1(y)}" text-anchor="middle" font-size="${r1(letra)}">${tsp}</text>`;
    bx0 = Math.min(bx0, xp - w / 2); bx1 = Math.max(bx1, xp + w / 2); by1 = Math.max(by1, y + 4 + (rs.length - 1) * letra * 1.2);
  }
  return { trazos, caja: [Math.floor(bx0 - margen), Math.floor(by0 - margen), Math.ceil(bx1 + margen), Math.ceil(by1 + margen)] };
}
// la letra que queda en «parte» del ancho de la vista (0,015: como las demás figuras del libro)
function conLetra(fn, parte = 0.015) {
  let letra = 14, R;
  for (let vuelta = 0; vuelta < 4; vuelta++) { R = fn(letra); letra = parte * (R.caja[2] - R.caja[0]); }
  return { ...fn(letra), letra };
}

if (process.argv.includes('--lamina')) await lamina();
else if (process.argv.includes('--anclas')) anclas();
else libro();

/* ── dónde cae cada ancla ── */
function anclas() {
  let marcas = '';
  for (const a of [...Object.keys(ANCLAS), ...Object.keys(DD.ANCLAS).map((d) => 'd:' + d)]) { const [x, y] = punto(a); marcas += `<circle cx="${r1(x)}" cy="${r1(y)}" r="3" fill="#FFF500" stroke="#19222F"/><text x="${r1(x + 5)}" y="${r1(y - 4)}" font-size="9" fill="#B3261E">${a}</text>`; }
  const css = readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
  writeFileSync(join(AQUI, 'out/anclas.html'), `<!doctype html><html><head><meta charset="utf-8"><style>${css}${estiloDe(SVG)} body{margin:0;background:#fff} svg{display:block}</style></head><body><div class="iso" data-theme="light"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${P.width ?? 1000} ${P.height ?? 1200}" width="1000" height="1200">${cuerpoDe(SVG)}${COMPOS}${marcas}</svg></div></body></html>`);
  console.log('out/anclas.html');
}

/* ── el libro web ── */
function libro() {
  const LIBRO = resolve(arg('--salida', join(REPO_LIBRO, 'libro')));
  const DEST = join(LIBRO, 'figuras/evaporacion');
  const R = conLetra((letra) => rotulado(ROTULOS, PIES(MDET), { letra }));
  const [vx, vy, x1, y1] = R.caja, vw = x1 - vx, vh = y1 - vy;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${DESCRIPCION}"><style>${estiloDe(SVG)}</style>${cuerpoDe(SVG)}${COMPOS}<g class="rotulos">${R.trazos}</g></svg>`;
  const html = aplicarPaleta(svg, VISTA);
  const fuera = revisar(html);
  if (fuera.size) console.warn('¡Ojo! colores fuera de la paleta:', [...fuera].map(([c, n]) => `${c}×${n}`).join(' '));
  mkdirSync(DEST, { recursive: true });
  writeFileSync(join(DEST, '_taste.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + html + '</div>\n```\n');
  console.log('figuras/evaporacion/_taste.qmd', Math.round(html.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh, '· letra en 640 px:', ((R.letra * 640) / vw).toFixed(1), 'px');
  // una página para revisarla: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas de .iso-libro de
  // estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
  const cssLibro = join(LIBRO, 'estilo/anatomia.css');
  const kit = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : cssAnatomia(k.ISO_CSS, '');
  const pagina = (ancho) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Etapa del TASTE (libro)</title><style>${kit}
body{margin:0;background:#fff;font-family:"Archivo Variable",Archivo,system-ui,sans-serif}.marco{max-width:${ancho}px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:${Math.min(640, ancho)}px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${html}</div></div></body></html>`;
  mkdirSync(join(AQUI, 'out'), { recursive: true });
  writeFileSync(join(AQUI, 'out/libro-preview.html'), pagina(900));
  writeFileSync(join(AQUI, 'out/libro-preview-620.html'), pagina(620));
  console.log('out/libro-preview.html, out/libro-preview-620.html');
}

/* ── la lámina de la edición impresa: la misma vista con pocos rótulos en inglés, 428 pt de ancho, la letra a 7,5 pt,
   los trazos del dibujo a 0,32 pt y los colores resueltos en clases (sin variables ni el CSS del libro) ── */
async function lamina() {
  const SALIDA = resolve(arg('--lamina', join(REPO_LIBRO, 'en/figuras/24/taste-stage.svg')));
  const FUENTES = resolve(arg('--fuentes', join(REPO_LIBRO, 'en/estilo/fuentes')));
  const ANCHO = 428, LETRA = 7.5, TINTA = '#19222F', TRAZO = 0.32;
  let letra = 14, R;
  for (let vuelta = 0; vuelta < 4; vuelta++) { R = rotulado(ROTULOS_EN, PIES_EN(MDET), { letra }); letra = LETRA / (ANCHO / (R.caja[2] - R.caja[0])); }
  R = rotulado(ROTULOS_EN, PIES_EN(MDET), { letra });
  const [vx, vy, x1, y1] = R.caja, vw = x1 - vx, vh = y1 - vy;
  const s = ANCHO / vw, ALTO = Math.ceil(vh * s);
  const b64 = (f) => readFileSync(join(FUENTES, f)).toString('base64');
  const fuentes = [500, 600].map((w) => `@font-face{font-family:Archivo;font-weight:${w};src:url(data:font/ttf;base64,${b64(`Archivo-${w}.ttf`)})}`).join('');
  const { chromium } = await import('playwright');
  const c = process.env.CHROME_PATH, exe = c ? (existsSync(join(c, 'chrome')) ? join(c, 'chrome') : c) : null;
  const nav = await chromium.launch({ args: ['--no-sandbox'], ...(exe && existsSync(exe) ? { executablePath: exe } : {}) });
  const pag = await nav.newPage();
  const rotCss = `.rot-linea{fill:none;stroke:${TINTA};stroke-width:${r1((0.5 / s) * 10) / 10}px}.rot-punto{fill:#FFF500;stroke:${TINTA};stroke-width:${r1((0.5 / s) * 10) / 10}px}.rot-texto{fill:${TINTA};font-family:Archivo;font-weight:600}`;
  const svgIn = aplicarPaleta(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}"><style>${estiloDe(SVG)}</style>${cuerpoDe(SVG)}${COMPOS}<g class="rotulos">${R.trazos}</g></svg>`, VISTA);
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
      if (tag === 'style' || el.closest('clipPath')) continue;
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
      for (const a of [...el.attributes]) if (a.name === 'class' || a.name.startsWith('data-') || a.name.startsWith('aria-') || a.name === 'role' || a.name === 'fill-rule' || a.name === 'style') el.removeAttribute(a.name);
      if (fuera.length) el.setAttribute('class', fuera.join(' '));
    }
    svg.querySelectorAll('style').forEach((st) => st.remove());
    return { cuerpo: svg.innerHTML, css: [...clases] };
  });
  await nav.close();
  const hex = (decl) => decl.replace(/rgba?\((\d+), (\d+), (\d+)(?:, [\d.]+)?\)/g, (_, r, g, b) => '#' + [r, g, b].map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase());
  // los trazos del dibujo: a TRAZO pt de ancho en la hoja (los anchos de la pantalla van en unidades del dibujo); las
  // flechas, que son trazos gruesos, se quedan con el suyo
  const anchoTrazo = (decl) => decl.replace(/stroke-width:([\d.]+)/, (_, w) => (+w > 1.2 ? `stroke-width:${w}` : `stroke-width:${Math.round(((+w * TRAZO) / (s * 0.8)) * 1000) / 1000}`));
  const cssL = res.css.map(([decl, n]) => `.cpo .${n}{${anchoTrazo(hex(decl))}}`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="cpo" width="${ANCHO}pt" height="${ALTO}pt" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${DESCRIPCION_EN}">` + `<style>${cssL}</style>${res.cuerpo}</svg>\n`;
  mkdirSync(dirname(SALIDA), { recursive: true });
  writeFileSync(SALIDA, svg);
  if (/[áéíóúñ¿¡]/i.test(svg.replace(/<style>[\s\S]*?<\/style>/, '').replace(/aria-label="[^"]*"/, ''))) console.warn('¡Ojo! queda texto en español en el SVG');
  console.log(SALIDA, `${ANCHO} × ${ALTO} pt`, Math.round(svg.length / 1024), 'KB', 'escala', s.toFixed(4));
}
