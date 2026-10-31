// Los cuatro impulsores de bomba con los nombres de sus piezas, para el capítulo 11 del libro de operaciones
// unitarias (Bombas):
//
//   node build.mjs --audit && node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//   CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina [ruta/pump-impellers.svg]
//
// Sin --lamina escribe figuras/bombas/_impulsores.qmd en el libro: las cuatro vistas con sus rótulos y cuatro botones
// (radios con CSS, sin JavaScript) que muestran una a la vez; y out/libro-preview.html para revisarla en el navegador.
// Con --lamina escribe la lámina de la edición impresa en inglés (en/figuras/11/pump-impellers.svg): los cuatro en
// una rejilla de 2 × 2, con su nombre debajo y sin rótulos, 428 pt de ancho, colores resueltos y la letra Archivo.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMPULSORES, ROTULOS, ROTULOS_EN, DESCRIPCION } from './rotulos.mjs';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta, cssAnatomia, reescribirCss } from '../paleta-libro.mjs';

export { IMPULSORES, ROTULOS, ROTULOS_EN };
const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d; };
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
for (const { id } of IMPULSORES) if (!existsSync(join(AQUI, `out/${id}.svg`))) throw new Error(`Falta out/${id}.svg: corra antes node build.mjs`);
const r1 = (v) => Math.round(v * 10) / 10;
const leer = (id) => ({ svg: readFileSync(join(AQUI, `out/${id}.svg`), 'utf8'), ...JSON.parse(readFileSync(join(AQUI, `out/${id}.json`), 'utf8')) });
// el CSS de las clases de las piezas (ib-*), que build.mjs pone dentro de cada SVG
const CLASES = (() => { const m = readFileSync(join(AQUI, 'out/cerrado.svg'), 'utf8').match(/<style>([^<]*)<\/style>/); return m ? m[1] : ''; })();

// el contorno del dibujo, de las coordenadas absolutas de sus trazos
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
  return { absol, minX: Math.min(...absol.map((p) => p[0])), maxX: Math.max(...absol.map((p) => p[0])), minY: Math.min(...absol.map((p) => p[1])), maxY: Math.max(...absol.map((p) => p[1])) };
}
const cuerpoDe = (svg) => svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<style>[^<]*<\/style>/, '').replace(/<defs><\/defs>/, '').replace(/<g class="it" data-name="[^"]*">/g, '<g>');

if (process.argv.includes('--lamina')) await lamina();
else libro();

/* ====================================================================
   el libro web: las cuatro vistas con sus rótulos y el selector
   ==================================================================== */
function libro() {
  const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
  const DEST = join(LIBRO, 'figuras/bombas');
  const letra = 14, paso = letra * 1.75, ancho = (t) => t.length * letra * 0.56;
  const vistas = IMPULSORES.map(({ id }) => {
    const { svg, P, ANCLAS } = leer(id);
    const { absol, minX, maxX, minY, maxY } = contorno(svg);
    // el borde del texto: lo más cerca del dibujo que permitan las piezas a la altura de cada rótulo
    const franja = (y, izq) => { const en = absol.filter((p) => Math.abs(p[1] - y) < letra * 1.1); return en.length ? (izq ? Math.min(...en.map((p) => p[0])) : Math.max(...en.map((p) => p[0]))) : izq ? maxX : minX; };
    const lados = { izq: [], der: [] };
    for (const [a, lado, t] of ROTULOS[id]) {
      if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a} de ${id}`);
      const [ax, ay] = k.iso(ANCLAS[a], P);
      lados[lado].push({ a, t, ax: r1(ax), ay: r1(ay) });
    }
    // las alturas de los textos: tan cerca de su punto como se pueda, sin encimarse y dentro del alto del dibujo
    for (const lista of Object.values(lados)) {
      lista.sort((p, q) => p.ay - q.ay);
      lista.forEach((r) => (r.y = r.ay));
      for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + paso);
      const tope = maxY - 4;
      if (lista.length && lista[lista.length - 1].y > tope) { lista[lista.length - 1].y = tope; for (let i = lista.length - 2; i >= 0; i--) lista[i].y = Math.min(lista[i].y, lista[i + 1].y - paso); }
      const piso = minY + 12;
      if (lista.length && lista[0].y < piso) { lista[0].y = piso; for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + paso); }
    }
    for (const r of lados.izq) r.x = Math.min(franja(r.y, true), r.ax - 12) - 18;
    for (const r of lados.der) r.x = Math.max(franja(r.y, false), r.ax + 12) + 18;
    // en cada lado, los textos que se pisarían con la línea de otro se alinean al más alejado
    for (const [lista, izq] of [[lados.izq, true], [lados.der, false]]) {
      for (let vuelta = 0; vuelta < 10; vuelta++) {
        let cambio = false;
        for (const r of lista) for (const o of lista) {
          if (o === r) continue;
          const x0 = izq ? o.x - ancho(o.t) - 2 : o.x - 2, x1 = izq ? o.x + 2 : o.x + ancho(o.t) + 2, y0 = o.y - letra * 0.8, y1 = o.y + letra * 0.5;
          let cruza = false;
          for (let t = 0; t <= 1; t += 0.02) { const x = r.x + (izq ? 5 : -5) + (r.ax - r.x) * t, y = r.y + (r.ay - r.y) * t; if (x > x0 && x < x1 && y > y0 && y < y1) cruza = true; }
          if (cruza) { const x = izq ? Math.min(r.x, o.x) : Math.max(r.x, o.x); if (r.x !== x || o.x !== x) { r.x = x; o.x = x; cambio = true; } }
        }
        if (!cambio) break;
      }
    }
    const trazo = (r, izq) => {
      const x = r.x, fin = izq ? x + 5 : x - 5;
      return `<path class="rot-linea" d="M${r.ax} ${r.ay}L${r1(fin)} ${r1(r.y)}"/><circle class="rot-punto" cx="${r.ax}" cy="${r.ay}" r="2.6"/>` +
        `<text class="rot-texto" x="${r1(x)}" y="${r1(r.y + letra * 0.35)}" text-anchor="${izq ? 'end' : 'start'}" font-size="${letra}">${r.t}</text>`;
    };
    const trazos = lados.izq.map((r) => trazo(r, true)).join('') + lados.der.map((r) => trazo(r, false)).join('');
    return { id, cuerpo: cuerpoDe(svg), trazos, x0: Math.min(minX, ...lados.izq.map((r) => r.x - ancho(r.t))) - 6, x1: Math.max(maxX, ...lados.der.map((r) => r.x + ancho(r.t))) + 6, y0: Math.min(minY, ...lados.izq.map((r) => r.y), ...lados.der.map((r) => r.y)) - 12, y1: Math.max(maxY, ...lados.izq.map((r) => r.y), ...lados.der.map((r) => r.y)) + 10 };
  });
  // todas las vistas con la misma caja, así el selector no mueve la página: los tres radiales, que comparten cámara,
  // quedan en el mismo sitio
  if (process.env.IB_CAJAS) for (const v of vistas) console.log(v.id, Math.round(v.x0), Math.round(v.x1), Math.round(v.y0), Math.round(v.y1));
  const vx = Math.floor(Math.min(...vistas.map((v) => v.x0))), vy = Math.floor(Math.min(...vistas.map((v) => v.y0)));
  const vw = Math.ceil(Math.max(...vistas.map((v) => v.x1)) - vx), vh = Math.ceil(Math.max(...vistas.map((v) => v.y1)) - vy);
  const ids = IMPULSORES.map(({ id }) => id);
  const css = [
    '.ibo-sel{margin:0;position:relative}',
    '.ibo-sel .ibo-radio{position:absolute;width:1px;height:1px;margin:0;opacity:0;pointer-events:none}',
    '.ibo-sel .ibo-botones{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px}',
    '.ibo-sel .ibo-botones label{border:2px solid #D3D9DF;background:transparent;color:#19222F;font-size:var(--t-s,15px);font-weight:600;line-height:1.2;padding:8px 14px;min-height:44px;display:flex;align-items:center;margin:0;cursor:pointer}',
    '.ibo-sel .ibo-botones label:hover{border-color:#19222F}',
    '.ibo-sel .ibo-vista{display:none}',
    ids.map((id) => `#ibo-sel-${id}:checked~.ibo-botones label[for="ibo-sel-${id}"]`).join(',') + '{background:#FFF500;border-color:#FFF500}',
    ids.map((id) => `#ibo-sel-${id}:focus-visible~.ibo-botones label[for="ibo-sel-${id}"]`).join(',') + '{outline:3px solid #19222F;outline-offset:2px}',
    ids.map((id) => `#ibo-sel-${id}:checked~.iso-libro .ibo-v-${id}`).join(',') + '{display:block}',
    ...CLASES.split('\n').filter(Boolean).map((r) => `.ibo-sel ${r}`),
  ].join('\n');
  const radios = IMPULSORES.map(({ id }, i) => `<input class="ibo-radio" type="radio" name="ibo-sel" id="ibo-sel-${id}"${i === 0 ? ' checked' : ''}>`).join('\n');
  const botones = `<div class="ibo-botones">${IMPULSORES.map(({ id, es }) => `<label for="ibo-sel-${id}">${es}</label>`).join('')}</div>`;
  const svgs = vistas.map((v) => `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg ibo-vista ibo-v-${v.id}" viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${DESCRIPCION[v.id]}">${v.cuerpo}<g class="rotulos">${v.trazos}</g></svg>`).join('\n');
  const html = aplicarPaleta(`<div class="ibo-sel" role="group" aria-label="Los cuatro tipos de impulsor de bomba: escoja uno para verlo">\n<style>\n${css}\n</style>\n${radios}\n${botones}\n<div class="iso iso-libro" data-theme="light">\n${svgs}\n</div>\n</div>`, 'bombas/_impulsores');
  mkdirSync(DEST, { recursive: true });
  writeFileSync(join(DEST, '_impulsores.qmd'), '```{=html}\n' + html + '\n```\n');
  console.log('_impulsores.qmd', Math.round(html.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);
  // una página para revisarla, con el CSS de las piezas y el de los rótulos del libro, en una columna como la del libro
  const cssLibro = join(DEST, '../../estilo/anatomia.css');
  const kit = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
  writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Impulsores de bomba (libro)</title><style>${kit}
body{margin:0;background:#fff;font-family:"Archivo Variable",Archivo,system-ui,sans-serif;color:#19222F}.marco{max-width:780px;margin:24px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch}
.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}
p{font-size:15px;line-height:1.5;color:#525C64}</style></head>
<body><div class="marco"><p>Vista previa de la figura del capítulo 11 (los cuatro tipos de impulsor).</p>${html}</div></body></html>`);
  console.log('out/libro-preview.html');
}

/* ====================================================================
   la lámina de la edición impresa: 2 × 2, con el nombre en inglés y sin rótulos
   ==================================================================== */
async function lamina() {
  const SALIDA = resolve(arg('--lamina', join(AQUI, '../../../../libro-operaciones-unitarias/en/figuras/11/pump-impellers.svg')));
  const FUENTES = resolve(arg('--fuentes', join(AQUI, '../../../../libro-operaciones-unitarias/en/estilo/fuentes')));
  const ANCHO = 428, LETRA = 7.5, TINTA = '#19222F', TRAZO = 0.32, MARGEN = 4, NOMBRE = 11;
  const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright');
  const b64 = (f) => readFileSync(join(FUENTES, f)).toString('base64');
  const fuentes = [500, 600].map((w) => `@font-face{font-family:Archivo;font-weight:${w};src:url(data:font/ttf;base64,${b64(`Archivo-${w}.ttf`)})}`).join('');
  const exe = process.env.CHROME_PATH ? (existsSync(join(process.env.CHROME_PATH, 'chrome')) ? join(process.env.CHROME_PATH, 'chrome') : process.env.CHROME_PATH) : undefined;
  const nav = await chromium.launch({ args: ['--no-sandbox'], ...(exe && existsSync(exe) ? { executablePath: exe } : {}) });
  const pag = await nav.newPage();
  const datos = IMPULSORES.map(({ id }) => leer(id));
  await pag.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>${fuentes}${cssAnatomia(k.ISO_CSS, '')}${reescribirCss(CLASES)}</style></head><body>${datos.map((d, i) => `<div class="iso" data-theme="light" style="width:600px" data-i="${i}">${d.svg.replace(/<style>[^<]*<\/style>/, '')}</div>`).join('')}</body></html>`, { waitUntil: 'load' });
  await pag.evaluate(() => document.fonts.ready);
  const res = await pag.evaluate((nombres) => {
    const FORMAS = new Set(['path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon']);
    const clases = new Map(), claseDe = (decl) => { if (!clases.has(decl)) clases.set(decl, 'c' + clases.size); return clases.get(decl); };
    const num = (v) => Math.round(parseFloat(v) * 1000) / 1000;
    const svgs = [...document.querySelectorAll('svg')];
    const cajas = svgs.map((svg) => { const bb = svg.querySelector('.ib-items').getBBox(); return [bb.x, bb.y, bb.x + bb.width, bb.y + bb.height]; });
    const cuerpos = svgs.map((svg) => {
      const todos = [...svg.querySelectorAll('*')], nuevas = new Map(), quitar = [];
      for (const el of todos) {
        const tag = el.tagName.toLowerCase();
        if (tag === 'style') continue;
        const cs = getComputedStyle(el), fuera = [];
        if (FORMAS.has(tag)) {
          if (cs.display === 'none' || cs.visibility === 'hidden') { quitar.push(el); continue; }
          const d = [`fill:${cs.fill === 'none' ? 'none' : cs.fill}`];
          if (cs.fill !== 'none' && num(cs.fillOpacity) !== 1) d.push(`fill-opacity:${num(cs.fillOpacity)}`);
          if (cs.stroke !== 'none' && num(cs.strokeWidth) > 0) {
            d.push(`stroke:${cs.stroke}`, `stroke-width:${num(cs.strokeWidth)}`);
            if (num(cs.strokeOpacity) !== 1) d.push(`stroke-opacity:${num(cs.strokeOpacity)}`);
            if (cs.strokeLinecap !== 'butt') d.push(`stroke-linecap:${cs.strokeLinecap}`);
            if (cs.strokeLinejoin !== 'miter') d.push(`stroke-linejoin:${cs.strokeLinejoin}`);
          } else d.push('stroke:none');
          if (num(cs.opacity) !== 1) d.push(`opacity:${num(cs.opacity)}`);
          fuera.push(claseDe(d.join(';')));
        } else if (tag === 'g' && num(cs.opacity) !== 1) fuera.push(claseDe(`opacity:${num(cs.opacity)}`));
        nuevas.set(el, fuera);
      }
      quitar.forEach((el) => el.remove());
      for (const [el, fuera] of nuevas) {
        for (const a of [...el.attributes]) if (a.name === 'class' || a.name.startsWith('data-') || a.name.startsWith('aria-') || a.name === 'role') el.removeAttribute(a.name);
        if (fuera.length) el.setAttribute('class', fuera.join(' '));
      }
      svg.querySelectorAll('style,defs').forEach((st) => st.remove());
      return svg.innerHTML;
    });
    return { cajas, cuerpos, css: [...clases] };
  }, IMPULSORES.map((i) => i.en));
  await nav.close();
  // las escalas: los tres radiales con una (la misma cámara y la misma caja), el axial con otra, a la misma altura
  const T = ['cerrado', 'semiabierto', 'abierto'];
  const idx = (id) => IMPULSORES.findIndex((i) => i.id === id);
  const union = (lista) => { const cs = lista.map((id) => res.cajas[idx(id)]); return [Math.min(...cs.map((c) => c[0])), Math.min(...cs.map((c) => c[1])), Math.max(...cs.map((c) => c[2])), Math.max(...cs.map((c) => c[3]))]; };
  const BT = union(T), BW = union(['axial']);
  const c = ANCHO / 2;
  const sT = (c - 2 * MARGEN) / (BT[2] - BT[0]), hT = (BT[3] - BT[1]) * sT;
  const sW = Math.min((c - 2 * MARGEN) / (BW[2] - BW[0]), hT / (BW[3] - BW[1])), hW = (BW[3] - BW[1]) * sW;
  const fila1 = 2, base1 = fila1 + hT, nombre1 = base1 + NOMBRE, fila2 = nombre1 + 10, alto2 = Math.max(hT, hW), base2 = fila2 + alto2, nombre2 = base2 + NOMBRE, ALTO = Math.ceil(nombre2 + 3);
  const celdas = [];
  const pon = (id, cx, base, B, s) => {
    const ox = cx - ((B[0] + B[2]) / 2 - B[0]) * s, oy = base - (B[3] - B[1]) * s;
    const grupo = T.includes(id) ? 't' : 'w';
    const cuerpo = res.cuerpos[idx(id)].replace(/class="([^"]*)"/g, (_, cl) => `class="${cl.split(' ').map((n) => grupo + n).join(' ')}"`);
    celdas.push(`<g transform="translate(${r1(ox)} ${r1(oy)}) scale(${s.toFixed(5)}) translate(${r1(-B[0])} ${r1(-B[1])})">${cuerpo}</g>`);
  };
  pon('cerrado', c * 0.5, base1, BT, sT);
  pon('semiabierto', c * 1.5, base1, BT, sT);
  pon('abierto', c * 0.5, base2, BT, sT);
  pon('axial', c * 1.5, base2, BW, sW);
  const textos = [
    [IMPULSORES[idx('cerrado')].en, c * 0.5, nombre1], [IMPULSORES[idx('semiabierto')].en, c * 1.5, nombre1],
    [IMPULSORES[idx('abierto')].en, c * 0.5, nombre2], [IMPULSORES[idx('axial')].en, c * 1.5, nombre2],
  ].map(([t, x, y]) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" font-family="Archivo" font-size="${LETRA}" font-weight="600" fill="${TINTA}">${t}</text>`).join('');
  const ancho = (decl, s) => decl.replace(/stroke-width:([\d.]+)/, (_, w) => `stroke-width:${Math.round(((+w * TRAZO) / s) * 1000) / 1000}`);
  // los colores resueltos van en hex, como en paleta.json
  const hex = (decl) => decl.replace(/rgb\((\d+), (\d+), (\d+)\)/g, (_, r, g, b) => '#' + [r, g, b].map((v) => (+v).toString(16).padStart(2, '0')).join('').toUpperCase());
  const css = res.css.map(([decl, n]) => `.ibo .t${n}{${ancho(hex(decl), sT)}}.ibo .w${n}{${ancho(hex(decl), sW)}}`).join('');
  const etiqueta = 'The four impeller types of a centrifugal pump, in isometric. Top row, with the same diameter and at the same scale: a closed impeller, with six backward-curved vanes between a back shroud and a front shroud, the front shroud cut away to show the vanes, a wear ring on the eye and balance holes in the back shroud; and a semi-open impeller, the same vanes on the back shroud alone, with their free edges in view. Bottom row: an open impeller, the same vanes with the back shroud scalloped between them, at the same scale; and, at a smaller scale, the impeller of an axial-flow pump, a large hub with four twisted blades inside the back half of its casing, 0.6 mm from the wall, with the nose cone cut away to show the impeller nut.';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="ibo" width="${ANCHO}pt" height="${ALTO}pt" viewBox="0 0 ${ANCHO} ${ALTO}" role="img" aria-label="${etiqueta}">`
    + `<style>${css}</style>${celdas.join('')}<g>${textos}</g></svg>\n`;
  mkdirSync(dirname(SALIDA), { recursive: true });
  writeFileSync(SALIDA, svg);
  if (/[áéíóúñ¿¡]/i.test(svg.replace(/<style>[\s\S]*?<\/style>/, ''))) console.warn('¡Ojo! queda texto en español en el SVG');
  console.log(SALIDA, `${ANCHO} × ${ALTO} pt`, Math.round(svg.length / 1024), 'KB', 'escalas', sT.toFixed(4), sW.toFixed(4));
}
