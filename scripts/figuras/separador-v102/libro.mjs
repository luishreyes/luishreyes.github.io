// El separador V-102 con los nombres de sus piezas, para la edición impresa en inglés del libro (capítulo 2):
//
//   node build.mjs --audit && node libro.mjs --en ../../../../libro-operaciones-unitarias/en/figuras/02/v102.svg
//
// Escribe un solo SVG autónomo: ancho de 318 pt (la caja del texto), alto el que pida el dibujo, medidas en puntos,
// los colores resueltos (sin variables CSS ni la hoja del kit) en un <style> propio y la letra Archivo en cada texto.
// Los rótulos van en inglés, con su línea y su punto, a los dos lados del dibujo. Chromium (Playwright) resuelve los
// estilos del kit y mide los textos con la Archivo del libro. Después: node ../en/herramientas/svg-a-pdf.mjs v102.svg.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const SALIDA = resolve(arg('--en', join(AQUI, '../../../../libro-operaciones-unitarias/en/figuras/02/v102.svg')));
const FUENTES = resolve(arg('--fuentes', join(AQUI, '../../../../libro-operaciones-unitarias/en/estilo/fuentes')));
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/separador_data.json'), 'utf8'));
const svgFuente = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

/* ── medidas de la página ────────────────────────────────────────────── */
const ANCHO = 318, ALTO_MAX = 415;      // pt
const LETRA = 7.5, RENGLON = 8.7;       // pt
const HUECO = 5;                        // del texto al dibujo
const SEP = 3.2;                        // entre dos rótulos
const TRAZO = 0.42;                     // pt de trazo por px de pantalla del kit
const TINTA = '#19222F', PUNTO = '#FFF500';

// [ancla, lado, renglones]
const ROTULOS = [
  ['PSV', 'izq', ['PSV-116 with block', 'valve (CSO)']],
  ['INLET', 'izq', ['Inlet nozzle, 8″', '(from E-102)']],
  ['DIVERTER', 'izq', ['Inlet diverter']],
  ['LSHH', 'izq', ['LSHH-115']],
  ['NNL', 'izq', ['Normal liquid', 'level (NNL)']],
  ['TI', 'izq', ['TI-113 thermowell']],
  ['VORTEX', 'izq', ['Vortex breaker']],
  ['OUTLET', 'izq', ['Liquid outlet, 3″', '(to V-103)']],
  ['SKIRT', 'izq', ['Skirt']],
  ['GAS', 'der', ['Gas outlet, 8″', '(to C-101 A/B)']],
  ['PT', 'der', ['PT-105']],
  ['HEAD_TOP', 'der', ['Elliptical head']],
  ['DEMISTER', 'izq', ['Demister pad']],
  ['LT', 'der', ['LT-106 level', 'transmitter']],
  ['BRIDLE', 'der', ['Level bridle']],
  ['SHELL', 'der', ['Shell']],
  ['LG', 'der', ['LG-114 level gauge']],
  ['DRAIN', 'der', ['Drain']],
];
for (const [a] of ROTULOS) if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a}`);

/* ── 1. Chromium: estilos resueltos, cajas de las piezas y anchos de los textos ───────────── */
const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright');
const b64 = (f) => readFileSync(join(FUENTES, f)).toString('base64');
const fuentes = [400, 500, 600].map((w) => `@font-face{font-family:Archivo;font-weight:${w};src:url(data:font/ttf;base64,${b64(`Archivo-${w}.ttf`)})}`).join('');
const nav = await chromium.launch({ args: ['--no-sandbox'], ...(process.env.CHROME_PATH && existsSync(join(process.env.CHROME_PATH, 'chrome')) ? { executablePath: join(process.env.CHROME_PATH, 'chrome') } : {}) });
const pag = await nav.newPage();
await pag.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fuentes}${k.ISO_CSS}</style></head><body><div class="iso" data-theme="light" style="width:700px">${svgFuente}</div></body></html>`, { waitUntil: 'load' });
await pag.evaluate(() => document.fonts.ready);
const res = await pag.evaluate(({ textos, letra }) => {
  const svg = document.querySelector('svg');
  // cada pieza: su caja en unidades del dibujo
  const cajas = [...svg.querySelectorAll('g.it')].map((g) => { const b = g.getBBox(); return [b.x, b.y, b.x + b.width, b.y + b.height]; }).filter((c) => c[2] > c[0]);
  // los estilos resueltos de cada trazo, en clases
  const FORMAS = new Set(['path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon']);
  const clases = new Map();
  const claseDe = (decl) => { if (!clases.has(decl)) clases.set(decl, 'v' + clases.size); return clases.get(decl); };
  const num = (v) => Math.round(parseFloat(v) * 1000) / 1000;
  // primero se leen todos los estilos (las clases de los grupos cambian las variables de sus hijos) y después se limpian
  const todos = [...svg.querySelectorAll('*')], nuevas = new Map(), quitar = [];
  for (const el of todos) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'style') continue;
    const enClip = el.closest('clipPath');
    const cs = getComputedStyle(el);
    const fuera = [];
    if (!enClip && FORMAS.has(tag)) {
      if (cs.display === 'none' || cs.visibility === 'hidden') { quitar.push(el); continue; }
      const d = [];
      d.push(`fill:${cs.fill === 'none' ? 'none' : cs.fill}`);
      if (cs.fill !== 'none' && num(cs.fillOpacity) !== 1) d.push(`fill-opacity:${num(cs.fillOpacity)}`);
      if (cs.stroke !== 'none' && num(cs.strokeWidth) > 0) {
        d.push(`stroke:${cs.stroke}`, `stroke-width:${num(cs.strokeWidth)}`);
        if (num(cs.strokeOpacity) !== 1) d.push(`stroke-opacity:${num(cs.strokeOpacity)}`);
        if (cs.strokeLinecap !== 'butt') d.push(`stroke-linecap:${cs.strokeLinecap}`);
        if (cs.strokeLinejoin !== 'miter') d.push(`stroke-linejoin:${cs.strokeLinejoin}`);
        if (cs.strokeDasharray !== 'none') d.push(`stroke-dasharray:${cs.strokeDasharray}`);
      } else d.push('stroke:none');
      if (num(cs.opacity) !== 1) d.push(`opacity:${num(cs.opacity)}`);
      fuera.push(claseDe(d.join(';')));
    } else if (!enClip && tag === 'g') {
      if (num(cs.opacity) !== 1) fuera.push(claseDe(`opacity:${num(cs.opacity)}`));
    }
    nuevas.set(el, fuera);
  }
  quitar.forEach((el) => el.remove());
  for (const [el, fuera] of nuevas) {
    for (const a of [...el.attributes]) if (a.name === 'class' || a.name.startsWith('data-') || a.name.startsWith('aria-') || a.name === 'role') el.removeAttribute(a.name);
    if (fuera.length) el.setAttribute('class', fuera.join(' '));
  }
  svg.querySelectorAll('style').forEach((st) => st.remove());
  // los anchos de los textos, con la Archivo del libro
  const c = document.createElement('canvas').getContext('2d');
  c.font = `500 ${letra * 100}px Archivo`;
  const anchos = textos.map((t) => c.measureText(t).width / 100);
  return { cajas, css: [...clases].map(([decl, nombre]) => [nombre, decl]), cuerpo: svg.innerHTML, vb: svg.getAttribute('viewBox'), anchos };
}, { textos: ROTULOS.flatMap((r) => r[2]), letra: LETRA });
await nav.close();
const anchoDe = new Map(ROTULOS.flatMap((r) => r[2]).map((t, i) => [t, res.anchos[i]]));

/* ── 2. Composición: escala del dibujo y rótulos a los lados ────────────────────────── */
const xs = res.cajas.flatMap((c) => [c[0], c[2]]), ys = res.cajas.flatMap((c) => [c[1], c[3]]);
const B = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
const r1 = (v) => Math.round(v * 100) / 100;
function componer(s) {
  // el dibujo empieza en x = ox; se busca ox para que los dos lados quepan
  const alto = (B[3] - B[1]) * s;
  const oy = 6;
  const aPt = ([x, y], ox) => [ox + (x - B[0]) * s, oy + (y - B[1]) * s];
  const cajasPt = (ox) => res.cajas.map((c) => [ox + (c[0] - B[0]) * s, oy + (c[1] - B[1]) * s, ox + (c[2] - B[0]) * s, oy + (c[3] - B[1]) * s]);
  const intentar = (ox) => {
    const cp = cajasPt(ox);
    const lados = { izq: [], der: [] };
    for (const [a, lado, lineas] of ROTULOS) {
      const [ax, ay] = aPt(k.iso(ANCLAS[a], P), ox);
      lados[lado].push({ a, lado, lineas, ax, ay, ancho: Math.max(...lineas.map((t) => anchoDe.get(t))), alto: lineas.length * RENGLON });
    }
    let techo = 2, piso = oy + alto;
    for (const lista of Object.values(lados)) {
      lista.sort((p, q) => p.ay - q.ay);
      // el centro de cada rótulo, tan cerca de su punto como se pueda y sin encimarse
      lista.forEach((r) => (r.y = r.ay - r.alto / 2));
      for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + lista[i - 1].alto + SEP);
      for (let i = lista.length - 2; i >= 0; i--) lista[i].y = Math.min(lista[i].y, lista[i + 1].y - lista[i].alto - SEP);
      if (lista[0].y < techo) { const d = techo - lista[0].y; lista.forEach((r) => (r.y += d)); for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + lista[i - 1].alto + SEP); }
      piso = Math.max(piso, lista[lista.length - 1].y + lista[lista.length - 1].alto);
      // el borde del texto: lo más cerca del dibujo que permitan las piezas a esa altura
      for (const r of lista) {
        const y0 = r.y - 1.5, y1 = r.y + r.alto + 1.5, enFranja = cp.filter((c) => c[3] > y0 && c[1] < y1);
        r.x = r.lado === 'izq' ? Math.min(...enFranja.map((c) => c[0]), ox + 1e3) - HUECO : Math.max(...enFranja.map((c) => c[2]), ox - 1e3) + HUECO;
        if (!enFranja.length) r.x = r.lado === 'izq' ? Math.min(r.ax - 8, ox) - HUECO : Math.max(r.ax + 8, ox + (B[2] - B[0]) * s) + HUECO;
      }
      // una línea no cruza otro rótulo de su lado: si lo cruza, los dos se alinean al más alejado
      const cruza = (r, o) => { const xe = r.x, ye = r.y + RENGLON * 0.55, bx0 = o.lado === 'izq' ? o.x - o.ancho - 1 : o.x - 1, bx1 = o.lado === 'izq' ? o.x + 1 : o.x + o.ancho + 1, by0 = o.y - 1, by1 = o.y + o.alto + 1;
        for (let t = 0; t <= 1; t += 0.02) { const x = xe + (r.ax - xe) * t, y = ye + (r.ay - ye) * t; if (x > bx0 && x < bx1 && y > by0 && y < by1) return true; } return false; };
      for (let vuelta = 0; vuelta < 20; vuelta++) {
        let cambio = false;
        for (const r of lista) for (const o of lista) if (o !== r && cruza(r, o)) {
          const x = r.lado === 'izq' ? Math.min(r.x, o.x) : Math.max(r.x, o.x);
          if (r.x !== x || o.x !== x) { r.x = x; o.x = x; cambio = true; }
        }
        if (!cambio) break;
      }
    }
    const izq = Math.min(...lados.izq.map((r) => r.x - r.ancho)), der = Math.max(...lados.der.map((r) => r.x + r.ancho));
    return { lados, izq, der, piso, ox, oy };
  };
  // ox: el que deja el mismo margen a los dos lados
  let ox = 100, L = intentar(ox);
  for (let i = 0; i < 6; i++) { ox += ((ANCHO - L.der) - L.izq) / 2; L = intentar(ox); }
  return { s, ...L, alto: L.piso + 4 };
}
let s = 0.5, L = componer(s);
while ((L.izq < 0.5 || L.der > ANCHO - 0.5 || L.alto > ALTO_MAX) && s > 0.05) { s *= 0.995; L = componer(s); }
console.log('escala', s.toFixed(4), 'pt por unidad · dibujo', r1((B[2] - B[0]) * s), '×', r1((B[3] - B[1]) * s), 'pt · márgenes', r1(L.izq), r1(ANCHO - L.der));

/* ── 3. El SVG ─────────────────────────────────────────────────────── */
const ALTO = Math.ceil(L.alto);
const css = res.css.map(([n, decl]) => `.v102 .${n}{${decl.replace(/stroke-width:([\d.]+)/, (_, w) => `stroke-width:${r1((+w * TRAZO) / s * 1000) / 1000}`)}}`).join('');
const rotulos = [...L.lados.izq, ...L.lados.der].map((r) => {
  const izq = r.lado === 'izq', xe = r.x + (izq ? 1.2 : -1.2), ye = r.y + RENGLON * 0.55;
  const tx = r1(r.x), lineas = r.lineas.map((t, i) => `<text x="${tx}" y="${r1(r.y + RENGLON * (i + 0.78))}" text-anchor="${izq ? 'end' : 'start'}" font-family="Archivo" font-size="${LETRA}" font-weight="500" fill="${TINTA}">${t}</text>`).join('');
  return `<path d="M${r1(xe)} ${r1(ye)}L${r1(r.ax)} ${r1(r.ay)}" fill="none" stroke="${TINTA}" stroke-width="0.4"/><circle cx="${r1(r.ax)}" cy="${r1(r.ay)}" r="1.35" fill="${PUNTO}" stroke="${TINTA}" stroke-width="0.4"/>` + lineas;
}).join('');
const etiqueta = 'Cutaway isometric of V-102, the high-pressure separator of the benzene plant: a vertical vessel on a skirt with its front half removed, showing the inlet diverter, the demister pad, the liquid at its normal level, the vortex breaker over the liquid outlet, and the nozzles and instruments outside.';
/* los trazos M, L y Z se reescriben con coordenadas relativas en décimas de unidad (el SVG pesa la mitad) */
function compacto(texto) {
  const num = (v) => { let t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ''); if (t === '-0') t = '0'; return t.replace(/^(-?)0\./, '$1.'); };
  const unir = (lista) => lista.reduce((acc, t) => (!acc ? t : t.startsWith('-') || (t.startsWith('.') && /\.\d*$/.test(acc)) ? acc + t : acc + ' ' + t), '');
  return texto.replace(/ d="([MLZ0-9.\s,-]+)"/g, (todo, d) => {
    const tok = d.match(/[MLZ]|-?\d*\.?\d+(?:e-?\d+)?/g);
    if (!tok) return todo;
    const subs = []; let cur = null, cmd = '';
    for (let i = 0; i < tok.length;) {
      const t = tok[i];
      if (t === 'M' || t === 'L') { cmd = t; i++; continue; }
      if (t === 'Z') { if (cur) cur.cerrado = true; cur = null; i++; continue; }
      const p = [Math.round(Number(t) * 10) / 10, Math.round(Number(tok[i + 1]) * 10) / 10]; i += 2;
      if (cmd === 'M' || !cur) { cur = { pts: [p], cerrado: false }; subs.push(cur); cmd = 'L'; } else cur.pts.push(p);
    }
    let out = '', cx = 0, cy = 0;
    subs.forEach((sp, j) => {
      const [x0, y0] = sp.pts[0];
      out += (j === 0 ? 'M' : 'm') + unir(j === 0 ? [num(x0), num(y0)] : [num(x0 - cx), num(y0 - cy)]);
      cx = x0; cy = y0;
      if (sp.pts.length > 1) {
        const ds = [];
        for (let q = 1; q < sp.pts.length; q++) { ds.push(num(sp.pts[q][0] - cx), num(sp.pts[q][1] - cy)); cx = sp.pts[q][0]; cy = sp.pts[q][1]; }
        out += 'l' + unir(ds);
      }
      if (sp.cerrado) { out += 'z'; cx = x0; cy = y0; }
    });
    return ` d="${out}"`;
  });
}
const cuerpo = compacto(res.cuerpo.replace(/<g>(<\/g>)?/g, (m, c) => (c ? '' : m)));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="v102" width="${ANCHO}pt" height="${ALTO}pt" viewBox="0 0 ${ANCHO} ${ALTO}" role="img" aria-label="${etiqueta}">`
  + `<style>${css}</style>`
  + `<g transform="translate(${r1(L.ox)} ${r1(L.oy)}) scale(${s.toFixed(5)}) translate(${r1(-B[0])} ${r1(-B[1])})">${cuerpo}</g>`
  + `<g>${rotulos}</g></svg>\n`;
mkdirSync(dirname(SALIDA), { recursive: true });
writeFileSync(SALIDA, svg);
if (/[áéíóúñ¿¡]/i.test(svg.replace(/<style>[\s\S]*?<\/style>/, ''))) console.warn('¡Ojo! queda texto en español en el SVG');
console.log(SALIDA, `${ANCHO} × ${ALTO} pt`, Math.round(svg.length / 1024), 'KB');
