// Lo común de las vistas del libro de los cuatro intercambiadores del capítulo 22 (Heat exchangers): el de tubos y
// coraza (este directorio), el de placas (../placas), el de doble tubo (../doble-tubo) y el aeroenfriador
// (../aeroenfriador). Cada uno tiene su libro.mjs y su rotulos.mjs; aquí va lo que comparten:
//
//   capturar()  abre la figura del libro (out/…-libro.svg, la de build.mjs --libro, con la persona) en Chromium con el
//               código vivo del explorador (out/fig.js) y un estado quieto que fija libro.mjs, deja que lo vivo se
//               dibuje (los tubos, los canales, el tubo interior, las aspas), quita lo que solo tiene sentido en
//               movimiento (partículas, trazos de flujo) y devuelve el SVG;
//   colores()   pasa los colores de lo vivo a clases (ic-*) que paleta-libro.mjs pinta con la paleta del libro: la
//               rampa de temperatura de los exploradores (de azul a rojo) va a cinco tonos y las aspas, por su luz, a
//               los grises del acero;
//   rotulado()  pone los rótulos (línea, punto amarillo y texto) a los dos lados del dibujo, cada uno a la altura de su
//               pieza y tan cerca del dibujo como se pueda, sin encimarse;
//   libro()     escribe el .qmd del libro (figuras/intercambiadores-de-calor/_{nombre}.qmd) y una página para revisarlo;
//   lamina()    escribe la lámina de la edición impresa en inglés (en/figuras/22/{nombre}.svg): pocos rótulos en
//               inglés, 428 pt de ancho, colores resueltos y la letra Archivo.
//
// Los colores de las clases de cada figura (hx-, pl-, dp-, ac-) salen de ../paleta-libro.mjs, como en todas las
// figuras del libro; el explorador conserva los suyos (splice.mjs no pasa por aquí).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { aplicarPaleta, cssAnatomia, revisar } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
export const k = await import(KIT + '/kit/iso-kit.mjs');
export const r1 = (v) => Math.round(v * 10) / 10;
export const arg = (key, d) => { const i = process.argv.indexOf(key); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
// el repositorio del libro, al lado del público
export const REPO_LIBRO = resolve(process.env.LIBRO_REPO || join(AQUI, '../../../../libro-operaciones-unitarias'));

/* ── Chromium ─────────────────────────────────────────────────────────────────────────────────────────── */
async function navegador() {
  const { chromium } = await import('playwright');
  const c = process.env.CHROME_PATH;
  const exe = c ? (existsSync(join(c, 'chrome')) ? join(c, 'chrome') : c) : null;
  return chromium.launch({ args: ['--no-sandbox'], ...(exe && existsSync(exe) ? { executablePath: exe } : {}) });
}

/* La figura con lo vivo dibujado. svg y data salen de build.mjs --libro; figJs es out/fig.js (el mismo código del
   explorador); clase, el constructor (FTube, FPlate, FDouble, FAir); estado, lo que la página le pasa en update().
   antes: código que corre entre el constructor y update() (con f, la figura); despues: código que corre después.
   quitar: selectores de lo que se borra. */
export async function capturar({ svg, data, figJs, clase, estado, antes = '', despues = '', quitar = [] }) {
  const nav = await navegador();
  const pag = await nav.newPage({ viewport: { width: 1400, height: 1000 } });
  const errores = [];
  pag.on('pageerror', (e) => errores.push(String(e)));
  await pag.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body><div id="fig">${svg}</div><script>${figJs}
var D = ${JSON.stringify(data)};
var f = new ${clase}(document.getElementById('fig'), D);
${antes}
f.update(${JSON.stringify({ dt: 0, snap: true, ...estado })});
${despues}
</script></body></html>`, { waitUntil: 'load' });
  if (errores.length) { await nav.close(); throw new Error('capturar: ' + errores.join('\n')); }
  const out = await pag.evaluate((quitar) => {
    const s = document.querySelector('#fig svg');
    for (const q of quitar) s.querySelectorAll(q).forEach((e) => e.remove());
    return s.outerHTML;
  }, quitar);
  await nav.close();
  return out;
}

/* ── colores de lo vivo ───────────────────────────────────────────────────────────────────────────────── */
// La rampa de temperatura de los exploradores (TCOL de live.js), de frío a caliente. En el libro cada uno de sus cinco
// puntos va en una clase, ic-s{i} (trazo), ic-f{i} (relleno) o ic-c{i} (parada de un degradado), y paleta-libro.mjs le da
// a cada clase su tono: el frío en el azul de la base y el oscuro del agua, el caliente en el relleno, el medio y el
// oscuro de lo caliente. Las aspas van en ic-l{j}, por su luz, en los grises del acero.
const TCOL = [[47, 109, 181], [111, 168, 220], [233, 227, 211], [236, 154, 96], [200, 69, 43]];
const hexDe = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const rgbDe = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
const luzDe = ([r, g, b]) => 0.299 * r + 0.587 * g + 0.114 * b;
/* Cambia cada rgb(…) de lo vivo (en style o en stop-color) por una clase: la del punto de la rampa más cercano (lo vivo
   pinta con los puntos exactos, porque libro.mjs escoge las temperaturas). luz: las clases cuyos colores se reparten por
   luminancia en NLUZ grises (las aspas). Devuelve el SVG y las reglas de esas clases (con los colores del explorador:
   paleta-libro.mjs los cambia por los de la paleta). */
const NLUZ = 3;
export function colores(svg, { luz = [] } = {}) {
  const lejos = [], usadas = new Map();
  const rangos = {};
  for (const cls of luz) {
    const ls = [...svg.matchAll(new RegExp(`<[a-z]+[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>`, 'g'))].flatMap((m) => (m[0].match(/rgb\([^)]*\)/g) || []).map((c) => luzDe(rgbDe(c))));
    rangos[cls] = [Math.min(...ls), Math.max(...ls)];
  }
  const claseDe = (c, papel, cls, tag) => {
    const rgb = rgbDe(c), porLuz = cls.find((x) => luz.includes(x));
    if (porLuz) {
      const [lo, hi] = rangos[porLuz], j = Math.round(((luzDe(rgb) - lo) / (hi - lo || 1)) * (NLUZ - 1));
      usadas.set(`ic-l${j}`, `fill:${hexDe(rgb)}`);
      return `ic-l${j}`;
    }
    let mejor = 0, dm = Infinity;
    TCOL.forEach((t, i) => { const d = Math.hypot(t[0] - rgb[0], t[1] - rgb[1], t[2] - rgb[2]); if (d < dm) { dm = d; mejor = i; } });
    if (dm > 12) lejos.push(`${tag}.${cls.join('.')} ${c}`);
    const n = `ic-${papel}${mejor}`, prop = { s: 'stroke', f: 'fill', c: 'stop-color' }[papel];
    usadas.set(n, `${prop}:${hexDe(TCOL[mejor])}`);
    return n;
  };
  const out = svg.replace(/<([a-zA-Z]+)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>/g, (todo, tag, attrs, cierre) => {
    if (!/rgb\(/.test(attrs)) return todo;
    const cls = (/class="([^"]*)"/.exec(attrs) || [, ''])[1].split(/\s+/).filter(Boolean), mas = [];
    let a = attrs.replace(/\sstop-color="(rgb\([^)]*\))"/, (m, c) => { mas.push(claseDe(c, 'c', cls, tag)); return ''; });
    a = a.replace(/style="([^"]*)"/, (m, st) => {
      const resto = st.split(';').filter((d) => {
        const i = d.indexOf(':'), prop = d.slice(0, i).trim(), valor = d.slice(i + 1).trim();
        if (!/^rgb\(/.test(valor)) return true;
        mas.push(claseDe(valor, prop === 'stroke' ? 's' : 'f', cls, tag));
        return false;
      }).join(';');
      return resto ? `style="${resto}"` : '';
    });
    if (/rgb\(/.test(a)) lejos.push(`${tag}: ${a}`);
    const todas = [...cls, ...mas].join(' ');
    a = /class="/.test(a) ? a.replace(/class="[^"]*"/, `class="${todas}"`) : ` class="${todas}"${a}`;
    return `<${tag}${a.replace(/\s+$/, '')}${cierre ? '/' : ''}>`;
  });
  if (lejos.length) throw new Error(`colores: lo vivo pinta colores fuera de la rampa (el estado de libro.mjs no cae en sus puntos):\n  ${[...new Set(lejos)].slice(0, 12).join('\n  ')}`);
  return { svg: out, css: [...usadas].map(([n, d]) => `.${n}{${d}}`).join('') };
}

/* ── el dibujo: su cuerpo y su contorno ───────────────────────────────────────────────────────────────── */
// el interior del SVG, sin la raíz (la vista del libro pone la suya, con su viewBox)
export const cuerpoDe = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
// los puntos de todos los trazos (M, L y Z absolutos, como los escriben el kit, persona.mjs y lo vivo) y de los círculos
export function puntos(svg) {
  const out = [];
  for (const m of svg.matchAll(/\sd="([^"]*)"/g)) {
    if (/[a-y]|[A-KN-Y]/.test(m[1].replace(/[eE][-+]?\d/g, ''))) continue; // solo M, L y Z
    const nums = m[1].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || [];
    for (let i = 0; i + 1 < nums.length; i += 2) out.push([+nums[i], +nums[i + 1]]);
  }
  for (const m of svg.matchAll(/<circle[^>]*\scx="(-?[\d.]+)"[^>]*\scy="(-?[\d.]+)"/g)) out.push([+m[1], +m[2]]);
  return out;
}

/* ── los rótulos ──────────────────────────────────────────────────────────────────────────────────────── */
/* lista: [ancla, lado ('izq' o 'der'), texto (con «\n» para un segundo renglón), opciones]; opciones: { dy } corre el
   texto hacia abajo (o arriba) desde la altura de su ancla, { x } fija su x, { y } su y. Las anclas van en las unidades
   de la figura (cm) y se proyectan con P. Devuelve los trazos y la caja (dibujo y textos). */
export function rotulado(svg, P, anclas, lista, { letra, punto = letra * 0.14, separa = 18, margen = 10, extra = [] }) {
  const pts = [...puntos(svg), ...extra];
  const minX = Math.min(...pts.map((p) => p[0])), maxX = Math.max(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1])), maxY = Math.max(...pts.map((p) => p[1]));
  const ancho = (t) => Math.max(...t.split('\n').map((r) => r.length)) * letra * 0.53;
  const renglones = (t) => t.split('\n').length;
  // lo más afuera del dibujo a la altura de un texto (de su primer renglón a su último)
  const franja = (y, n, izq) => {
    const en = pts.filter((p) => p[1] > y - letra * 1.1 && p[1] < y + letra * (0.5 + 1.2 * (n - 1)));
    return en.length ? (izq ? Math.min(...en.map((p) => p[0])) : Math.max(...en.map((p) => p[0]))) : izq ? maxX : minX;
  };
  const lados = { izq: [], der: [] };
  for (const [a, lado, t, op = {}] of lista) {
    if (!anclas[a]) throw new Error(`Falta el ancla ${a}`);
    const [ax, ay] = k.iso(anclas[a], P);
    lados[lado].push({ a, t, op, n: renglones(t), ax: r1(ax), ay: r1(ay) });
  }
  // las alturas: tan cerca de su punto como se pueda, sin encimarse (los que tienen su y fija van aparte: no empujan ni
  // los empujan)
  for (const lista2 of Object.values(lados)) {
    lista2.forEach((r) => (r.y = r.op.y ?? r.ay + (r.op.dy || 0)));
    const col = lista2.filter((r) => r.op.y === undefined).sort((p, q) => p.y - q.y);
    for (let i = 1; i < col.length; i++) {
      const prev = col[i - 1], paso = letra * 1.6 + (prev.n - 1) * letra * 1.2;
      col[i].y = Math.max(col[i].y, prev.y + paso);
    }
  }
  for (const r of lados.izq) r.x = r.op.x ?? Math.min(franja(r.y, r.n, true), r.ax - 12) - separa;
  for (const r of lados.der) r.x = r.op.x ?? Math.max(franja(r.y, r.n, false), r.ax + 12) + separa;
  // en cada lado, los textos que se pisarían con la línea de otro se alinean al más alejado
  for (const [lista2, izq] of [[lados.izq, true], [lados.der, false]]) {
    for (let vuelta = 0; vuelta < 12; vuelta++) {
      let cambio = false;
      for (const r of lista2) for (const o of lista2) {
        if (o === r || r.op.x !== undefined || o.op.x !== undefined) continue;
        const w = ancho(o.t), x0 = izq ? o.x - w - 2 : o.x - 2, x1 = izq ? o.x + 2 : o.x + w + 2, y0 = o.y - letra * 0.85, y1 = o.y + letra * (0.45 + 1.2 * (o.n - 1));
        let cruza = false;
        for (let t = 0; t <= 1; t += 0.02) { const x = r.x + (izq ? 5 : -5) + (r.ax - r.x) * t, y = r.y - letra * 0.35 + (r.ay - r.y + letra * 0.35) * t; if (x > x0 && x < x1 && y > y0 && y < y1) cruza = true; }
        if (cruza) { const x = izq ? Math.min(r.x, o.x) : Math.max(r.x, o.x); if (r.x !== x || o.x !== x) { r.x = x; o.x = x; cambio = true; } }
      }
      if (!cambio) break;
    }
  }
  let trazos = '';
  let bx0 = minX, bx1 = maxX, by0 = minY, by1 = maxY;
  for (const [lista2, izq] of [[lados.izq, true], [lados.der, false]]) for (const r of lista2) {
    const ex = izq ? r.x + 5 : r.x - 5, ey = r.y - letra * 0.35, rs = r.t.split('\n');
    const tsp = rs.length === 1 ? rs[0] : rs.map((s, i) => `<tspan x="${r1(r.x)}"${i ? ` dy="${r1(letra * 1.2)}"` : ''}>${s}</tspan>`).join('');
    trazos += `<path class="rot-linea" d="M${r.ax} ${r.ay}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r.ax}" cy="${r.ay}" r="${r1(punto)}"/>` +
      `<text class="rot-texto" x="${r1(r.x)}" y="${r1(r.y)}" text-anchor="${izq ? 'end' : 'start'}" font-size="${r1(letra)}">${tsp}</text>`;
    const w = ancho(r.t);
    bx0 = Math.min(bx0, izq ? r.x - w : r.x); bx1 = Math.max(bx1, izq ? r.x : r.x + w);
    by0 = Math.min(by0, r.y - letra); by1 = Math.max(by1, r.y + 4 + (r.n - 1) * letra * 1.2);
  }
  return { trazos, caja: [Math.floor(bx0 - margen), Math.floor(by0 - margen), Math.ceil(bx1 + margen), Math.ceil(by1 + margen)], lados };
}
// la letra que queda en «parte» del ancho de la vista (0,015: como las demás figuras del libro, unos 10 px a 640 px)
export function conLetra(fn, parte = 0.015) {
  let letra = 14, R;
  for (let vuelta = 0; vuelta < 4; vuelta++) { R = fn(letra); letra = parte * (R.caja[2] - R.caja[0]); }
  return { ...fn(letra), letra };
}

/* ── el libro web ─────────────────────────────────────────────────────────────────────────────────────── */
/* Escribe figuras/intercambiadores-de-calor/_{nombre}.qmd en el libro y out/libro-preview.html (y -620) para revisarla.
   cuerpo: el interior del dibujo; css: las reglas de la figura (con sus colores de explorador: la paleta los cambia);
   trazos y caja: de rotulado(). */
export function libro({ aqui, nombre, titulo, descripcion, cuerpo, css, trazos, caja, letra }) {
  const LIBRO = resolve(arg('--salida', join(REPO_LIBRO, 'libro')));
  const DEST = join(LIBRO, 'figuras/intercambiadores-de-calor');
  const [vx, vy, x1, y1] = caja, vw = x1 - vx, vh = y1 - vy;
  const vista = `intercambiadores-de-calor/_${nombre}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${descripcion}"><style>${css}</style>${cuerpo}<g class="rotulos">${trazos}</g></svg>`;
  const html = aplicarPaleta(svg, vista);
  const fuera = revisar(html);
  if (fuera.size) console.warn('¡Ojo! colores fuera de la paleta:', [...fuera].map(([c, n]) => `${c}×${n}`).join(' '));
  mkdirSync(DEST, { recursive: true });
  writeFileSync(join(DEST, `_${nombre}.qmd`), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + html + '</div>\n```\n');
  console.log(`figuras/intercambiadores-de-calor/_${nombre}.qmd`, Math.round(html.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh, '· letra en 640 px:', ((letra * 640) / vw).toFixed(1), 'px');
  // una página para revisarla: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas de .iso-libro de
  // estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
  const cssLibro = join(LIBRO, 'estilo/anatomia.css');
  const kit = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : cssAnatomia(k.ISO_CSS, '');
  const pagina = (ancho) => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo} (libro)</title><style>${kit}
body{margin:0;background:#fff;font-family:"Archivo Variable",Archivo,system-ui,sans-serif}.marco{max-width:${ancho}px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:${Math.min(640, ancho)}px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${html}</div></div></body></html>`;
  mkdirSync(join(aqui, 'out'), { recursive: true });
  writeFileSync(join(aqui, 'out/libro-preview.html'), pagina(900));
  writeFileSync(join(aqui, 'out/libro-preview-620.html'), pagina(620));
  console.log('out/libro-preview.html, out/libro-preview-620.html');
}

/* ── la lámina de la edición impresa ──────────────────────────────────────────────────────────────────── */
/* La misma vista con pocos rótulos en inglés: 428 pt de ancho, la letra a 7,5 pt, los trazos del dibujo a 0,32 pt y los
   colores resueltos en clases (sin variables ni el CSS del libro), para que svg-a-pdf.mjs la pase a PDF tal cual.
   rotular(letra) devuelve { trazos, caja } en las unidades del dibujo. */
export async function lamina({ nombre, ingles, descripcion, cuerpo, css, rotular }) {
  const SALIDA = resolve(arg('--lamina', join(REPO_LIBRO, `en/figuras/22/${ingles}.svg`)));
  const FUENTES = resolve(arg('--fuentes', join(REPO_LIBRO, 'en/estilo/fuentes')));
  const ANCHO = 428, LETRA = 7.5, TINTA = '#19222F', TRAZO = 0.32;
  // la letra en unidades del dibujo: la que queda en LETRA pt con la escala de la lámina
  let letra = 14, R;
  for (let vuelta = 0; vuelta < 4; vuelta++) { R = rotular(letra); letra = LETRA / (ANCHO / (R.caja[2] - R.caja[0])); }
  R = rotular(letra);
  const [vx, vy, x1, y1] = R.caja, vw = x1 - vx, vh = y1 - vy;
  const s = ANCHO / vw, ALTO = Math.ceil(vh * s);
  const b64 = (f) => readFileSync(join(FUENTES, f)).toString('base64');
  const fuentes = [500, 600].map((w) => `@font-face{font-family:Archivo;font-weight:${w};src:url(data:font/ttf;base64,${b64(`Archivo-${w}.ttf`)})}`).join('');
  const nav = await navegador();
  const pag = await nav.newPage();
  const rotCss = `.rot-linea{fill:none;stroke:${TINTA};stroke-width:${r1((0.5 / s) * 10) / 10}px}.rot-punto{fill:#FFF500;stroke:${TINTA};stroke-width:${r1((0.5 / s) * 10) / 10}px}.rot-texto{fill:${TINTA};font-family:Archivo;font-weight:600}`;
  const svgIn = aplicarPaleta(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vx} ${vy} ${vw} ${vh}"><style>${css}</style>${cuerpo}<g class="rotulos">${R.trazos}</g></svg>`, `intercambiadores-de-calor/_${nombre}`);
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
      // las paradas de un degradado: su color resuelto, en el atributo
      if (tag === 'stop') {
        const cs = getComputedStyle(el);
        el.setAttribute('stop-color', '#' + cs.stopColor.match(/\d+/g).slice(0, 3).map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase());
        if (num(cs.stopOpacity) !== 1) el.setAttribute('stop-opacity', String(num(cs.stopOpacity)));
        el.removeAttribute('class');
        continue;
      }
      if (tag === 'style' || el.closest('clipPath') || el.closest('linearGradient')) continue;
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
          // el rayado de las aletas del aeroenfriador es un trazo punteado
          if (cs.strokeDasharray && cs.strokeDasharray !== 'none') d.push(`stroke-dasharray:${cs.strokeDasharray.replace(/px/g, '').replace(/,\s*/g, ' ')}`);
        } else d.push('stroke:none');
        if (num(cs.opacity) !== 1) d.push(`opacity:${num(cs.opacity)}`);
        if (tag === 'text') d.push('font-family:Archivo', `font-weight:${cs.fontWeight}`);
        // un degradado (fill o stroke: url(#…)): se queda la referencia
        if (/url\(/.test(cs.fill)) d[0] = 'fill:url(#' + cs.fill.match(/#([^"')]+)/)[1] + ')';
        const iS = d.findIndex((x) => x.startsWith('stroke:'));
        if (iS >= 0 && /url\(/.test(cs.stroke)) d[iS] = 'stroke:url(#' + cs.stroke.match(/#([^"')]+)/)[1] + ')';
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
  // los trazos del dibujo: a TRAZO pt de ancho en la hoja (los anchos de la pantalla van en unidades del dibujo); los de
  // lo vivo (los tubos pintados con un trazo grueso) no son trazos de contorno: se quedan con su ancho
  const anchoTrazo = (decl) => decl.replace(/stroke-width:([\d.]+)/, (_, w) => (+w > 1.2 ? `stroke-width:${w}` : `stroke-width:${Math.round(((+w * TRAZO) / (s * 0.8)) * 1000) / 1000}`));
  const cssL = res.css.map(([decl, n]) => `.cpo .${n}{${anchoTrazo(hex(decl))}}`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="cpo" width="${ANCHO}pt" height="${ALTO}pt" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${descripcion}">` + `<style>${cssL}</style>${res.cuerpo}</svg>\n`;
  mkdirSync(dirname(SALIDA), { recursive: true });
  writeFileSync(SALIDA, svg);
  if (/[áéíóúñ¿¡]/i.test(svg.replace(/<style>[\s\S]*?<\/style>/, '').replace(/aria-label="[^"]*"/, ''))) console.warn('¡Ojo! queda texto en español en el SVG');
  console.log(SALIDA, `${ANCHO} × ${ALTO} pt`, Math.round(svg.length / 1024), 'KB', 'escala', s.toFixed(4));
}
