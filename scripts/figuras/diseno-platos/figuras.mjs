// Figuras de la presentación «Diseño de platos» (POU 2026-20).
//
// Esquemas en corte y en planta, dibujados aquí en SVG plano: los tres tipos de
// plato, la anatomía, las cuatro formas de salirse de la ventana (con el plato
// en vivo de la diapositiva interactiva), el bajante, la planta de la columna,
// los diámetros comerciales, la caída de presión y la altura.
//
// Los colores no van en el SVG: cada pieza lleva una clase (f-met, f-liq,
// f-esp, f-vap…) que el <style> del deck pinta con los tokens de deloitte.css,
// así el modo oscuro del proyector también las invierte. Las burbujas y las
// gotas se mueven solo en la diapositiva activa y nunca con movimiento reducido.
//
// Uso:  node scripts/figuras/diseno-platos/figuras.mjs
// Reemplaza en el HTML lo que hay entre <!-- DPLAT:nombre --> y <!-- /DPLAT:nombre -->.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(__dirname, '../../../public/classroom/iqya-2031-2026-20/slides/Diseno_de_Platos/Presentacion_Diseno_de_Platos.html');

// ── Utilidades ────────────────────────────────────────────────────────────
const f = (n) => +n.toFixed(1);
const R = (x, y, w, h, c, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" class="${c}"${extra}/>`;
const L = (x1, y1, x2, y2, c, extra = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="${c}"${extra}/>`;
const P = (d, c, extra = '') => `<path d="${d}" class="${c}"${extra}/>`;
const C = (x, y, r, c, extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" class="${c}"${extra}/>`;
const E = (x, y, rx, ry, c, extra = '') => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" class="${c}"${extra}/>`;
const T = (x, y, txt, c = 'f-rot', extra = '') => `<text x="${f(x)}" y="${f(y)}" class="${c}"${extra}>${txt}</text>`;
const G = (c, inner, extra = '') => `<g class="${c}"${extra}>${inner}</g>`;

// Semilla fija: las burbujas salen en el mismo lugar cada vez que se genera.
function azar(seed) {
  return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// Flecha: trazo más punta. La punta toma la dirección del último tramo.
const PUNTA = { 'f-vap': 'f-vapf', 'f-flu': 'f-fluf', 'f-mals': 'f-mal', 'f-cota': 'f-cotaf', 'f-vapg': 'f-vapf' };
function punta(x1, y1, x2, y2, cls, h) {
  const a = Math.atan2(y2 - y1, x2 - x1), w = h * 0.6;
  const bx = x2 - h * Math.cos(a), by = y2 - h * Math.sin(a);
  const px = -Math.sin(a) * w, py = Math.cos(a) * w;
  return { base: [bx, by], tri: `<path d="M${f(x2)} ${f(y2)} L${f(bx + px)} ${f(by + py)} L${f(bx - px)} ${f(by - py)} Z" class="${PUNTA[cls] || cls}"/>` };
}
function flecha(x1, y1, x2, y2, cls = 'f-vap', h = 12, extra = '') {
  const p = punta(x1, y1, x2, y2, cls, h);
  return L(x1, y1, p.base[0], p.base[1], cls, extra) + p.tri;
}
// Flecha por una polilínea [[x,y],…].
function ruta(pts, cls = 'f-vap', h = 11) {
  const n = pts.length, p = punta(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], cls, h);
  const d = pts.slice(0, -1).map((q, i) => (i ? 'L' : 'M') + f(q[0]) + ' ' + f(q[1])).join(' ') + ` L${f(p.base[0])} ${f(p.base[1])}`;
  return P(d, cls) + p.tri;
}
// Cota con sus dos topes.
function cota(x1, y1, x2, y2, tope = 7) {
  const a = Math.atan2(y2 - y1, x2 - x1), px = -Math.sin(a) * tope, py = Math.cos(a) * tope;
  return L(x1, y1, x2, y2, 'f-guia') + L(x1 - px, y1 - py, x1 + px, y1 + py, 'f-guia') + L(x2 - px, y2 - py, x2 + px, y2 + py, 'f-guia');
}

// Plato en corte: la lámina con huecos en las posiciones dadas.
function plato(x1, x2, y, h, huecos = [], ancho = 8) {
  const hs = [...huecos].sort((a, b) => a - b);
  let s = '', x = x1;
  for (const c of hs) { const a = c - ancho / 2; if (a > x) s += R(x, y, a - x, h, 'f-met'); x = c + ancho / 2; }
  if (x2 > x) s += R(x, y, x2 - x, h, 'f-met');
  return s;
}
const serie = (a, b, paso) => { const o = []; for (let x = a; x <= b + 1e-6; x += paso) o.push(x); return o; };

// Burbujas que suben (clase an-sube): cadenas sobre los huecos.
function burbujas(xs, yBase, yTope, rnd, { r0 = 3, r1 = 6.5, porHueco = 3, dur = 2.2, sube = null } = {}) {
  let s = '';
  for (const x of xs) {
    for (let k = 0; k < porHueco; k++) {
      const fr = (k + 0.3 + rnd() * 0.5) / porHueco;
      const y = yBase - fr * (yBase - yTope);
      const r = r0 + (r1 - r0) * fr * (0.6 + rnd() * 0.4);
      const dx = (rnd() - 0.5) * 10 * fr;
      const d = sube ?? -(yBase - yTope) * 0.45;
      s += C(x + dx, y, r, 'f-bur an-sube', ` style="--d:${f(d)}px;animation-delay:-${f(rnd() * dur)}s;animation-duration:${f(dur * (0.85 + rnd() * 0.3))}s"`);
    }
  }
  return s;
}
// Burbujas sueltas dentro de un rectángulo (espuma).
function espuma(x1, x2, y1, y2, n, rnd, r0 = 2.5, r1 = 5, anim = true) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = x1 + rnd() * (x2 - x1), y = y1 + 4 + rnd() * (y2 - y1 - 8), r = r0 + rnd() * (r1 - r0);
    s += C(x, y, r, 'f-bur' + (anim ? ' an-sube' : ''), anim ? ` style="--d:-${f(6 + rnd() * 10)}px;animation-delay:-${f(rnd() * 2)}s"` : '');
  }
  return s;
}
// Gotas (lágrimas) que caen o suben.
function gota(x, y, r, cls = 'f-gota', extra = '') {
  return `<path d="M${f(x)} ${f(y - r * 1.9)} Q${f(x + r * 1.1)} ${f(y - r * 0.4)} ${f(x + r)} ${f(y + r * 0.2)} A${f(r)} ${f(r)} 0 1 1 ${f(x - r)} ${f(y + r * 0.2)} Q${f(x - r * 1.1)} ${f(y - r * 0.4)} ${f(x)} ${f(y - r * 1.9)} Z" class="${cls}"${extra}/>`;
}

const svg = (vb, inner, cls = '', label = '') =>
  `<svg viewBox="${vb}" class="fig-svg ${cls}" role="img"${label ? ` aria-label="${label}"` : ''}>${inner}</svg>`;

// ══════════════════════════════════════════════════════════════════════════
// 1. Anatomía de un plato (diapositiva 4)
// ══════════════════════════════════════════════════════════════════════════
function anatomia() {
  const rnd = azar(4);
  const W1 = 110, W2 = 750;           // paredes
  const yA = 200, yB = 440, e = 7;    // plato n y plato n + 1
  const apA = 637, apB = 216;         // faldones de los bajantes
  const hA = serie(245, 605, 30), hB = serie(255, 615, 30);
  let s = '';
  // Bajante que llega del plato de arriba (izquierda) y su líquido
  s += R(W1, 92, apB - W1, yA - 92, 'f-liqc') + R(W1, 70, apB - W1, 22, 'f-esp') + espuma(W1 + 6, apB - 6, 70, 94, 6, rnd);
  // Espuma del plato n y su cresta sobre el vertedero
  s += R(apB + 7, 140, apA - apB - 7, yA - 140, 'f-esp');
  s += P(`M${apA - 8} 168 Q${apA + 14} 160 ${apA + 22} 184 L${apA + 30} 262 L${apA + 15} 262 L${apA + 9} 190 Q${apA + 6} 176 ${apA - 8} 176 Z`, 'f-liq');
  // Bajante de la derecha: zona aireada arriba, líquido claro abajo; pasa bajo el faldón
  s += R(apA + 7, 292, W2 - apA - 7, 30, 'f-esp') + espuma(apA + 12, W2 - 6, 292, 322, 7, rnd);
  s += R(apA + 7, 322, W2 - apA - 7, yB - 322, 'f-liqc');
  s += R(600, yB - 22, apA + 7 - 600, 22, 'f-liqc');
  // Espuma del plato n + 1 y su cresta al bajante de la izquierda
  s += R(apB + 7, 380, apA - apB - 7, yB - 380, 'f-esp');
  s += P(`M${apB + 15} 408 Q${apB - 6} 400 ${apB - 14} 424 L${apB - 22} 500 L${apB - 8} 500 L${apB - 2} 430 Q${apB + 1} 416 ${apB + 15} 416 Z`, 'f-liq');
  s += R(W1, 500, apB - W1, 60, 'f-liqc') + R(W1, 482, apB - W1, 18, 'f-esp');
  // Burbujas: chorros sobre cada hueco
  s += burbujas(hA, yA - 4, 146, rnd, { porHueco: 3 }) + burbujas(hB, yB - 4, 386, rnd, { porHueco: 3 });
  // Vapor entre platos y bajo el plato n + 1
  for (const x of [300, 420, 540]) s += flecha(x, 372, x, 214, 'f-vap', 13);
  for (const x of [330, 450, 570]) s += flecha(x, 552, x, 454, 'f-vap', 13);
  for (const x of [300, 560]) s += flecha(x, 132, x, 40, 'f-vap', 13);
  // Líquido que cruza (sobre la espuma) y que baja por los bajantes
  s += flecha(250, 162, 590, 162, 'f-flu', 13) + flecha(600, 402, 262, 402, 'f-flu', 13);
  s += flecha(163, 20, 163, 150, 'f-flu', 13) + flecha(694, 330, 694, 425, 'f-flu', 13);
  // Platos, vertederos con faldón y paredes
  s += plato(W1, apA + 7, yA, e, hA) + plato(apB, W2, yB, e, hB);
  s += R(apA, 168, 7, 420 - 168, 'f-met') + R(apB, 408, 7, 560 - 408, 'f-met') + R(apB, 0, 7, 180, 'f-met');
  s += L(W1, 0, W1, 560, 'f-pared') + L(W2, 0, W2, 560, 'f-pared');
  // Rótulos
  s += L(250, 124, 610, 124, 'f-guia') + L(250, 124, 250, 132, 'f-guia') + L(610, 124, 610, 132, 'f-guia');
  s += T(430, 112, 'Área activa', 'f-rot', ' text-anchor="middle"');
  s += L(768, 172, 648, 172, 'f-guia') + T(774, 179, 'Vertedero');
  s += L(768, 352, 712, 352, 'f-guia') + T(774, 359, 'Bajante');
  s += L(768, 430, 645, 430, 'f-guia') + T(774, 437, 'Holgura') + T(774, 460, 'paso del líquido', 'f-rot2');
  s += cota(82, yA + e, 82, yB) + T(64, (yA + yB) / 2, 'Espaciamiento', 'f-rot', ` text-anchor="middle" transform="rotate(-90 64 ${(yA + yB) / 2})"`);
  s += T(122, 232, 'Plato n', 'f-rot2') + T(232, 474, 'Plato n + 1', 'f-rot2');
  return svg('0 0 960 560', s, 'fig-anat', 'Corte de dos platos perforados con sus bajantes, la espuma y el vapor');
}

// ══════════════════════════════════════════════════════════════════════════
// 2. Los tres tipos de plato (diapositiva 6): en planta y en corte
// ══════════════════════════════════════════════════════════════════════════
const PL = { cx: 240, cy: 60, rx: 226, ry: 48 }; // el plato visto desde arriba, en perspectiva
const toScr = (u, v) => [PL.cx + PL.rx * u, PL.cy + PL.ry * v];

function planta(tipo) {
  const c = 0.74; // cuerda de los bajantes
  const hy = Math.sqrt(1 - c * c);
  let s = '';
  // Disco del plato
  s += E(PL.cx, PL.cy, PL.rx, PL.ry, 'f-disco');
  // Bajante de salida (derecha, hueco) y área de llegada (izquierda, lámina sin agujeros)
  const arco = (sig) => {
    const [x1, y1] = toScr(sig * c, -hy), [x2, y2] = toScr(sig * c, hy);
    return `M${f(x1)} ${f(y1)} A${PL.rx} ${PL.ry} 0 0 ${sig > 0 ? 1 : 0} ${f(x2)} ${f(y2)} Z`;
  };
  s += P(arco(1), 'f-hueco') + P(arco(-1), 'f-llegada');
  // Vertedero: una banda que se levanta sobre la cuerda
  const [wx1, wy1] = toScr(c, -hy), [wx2, wy2] = toScr(c, hy);
  s += P(`M${f(wx1)} ${f(wy1)} L${f(wx2)} ${f(wy2)} L${f(wx2)} ${f(wy2 - 10)} L${f(wx1)} ${f(wy1 - 10)} Z`, 'f-vert');
  // Dispositivos en la zona activa, de atrás hacia adelante
  const paso = { perf: [0.055, 0.17], valv: [0.13, 0.36], camp: [0.19, 0.5] }[tipo];
  const pts = [];
  for (let v = -0.95, fila = 0; v <= 0.95; v += paso[1], fila++) {
    const off = (fila % 2) * paso[0] / 2;
    for (let u = -c + 0.06 + off; u <= c - 0.06; u += paso[0]) {
      if (u * u + v * v < 0.86 * 0.86) pts.push([u, v]);
    }
  }
  pts.sort((a, b) => a[1] - b[1]);
  for (const [u, v] of pts) {
    const [x, y] = toScr(u, v);
    if (tipo === 'perf') s += E(x, y, 2.3, 1.1, 'f-met');
    else if (tipo === 'valv') s += E(x, y + 1.5, 9, 3.4, 'f-met') + E(x, y - 1.5, 9, 3.4, 'f-tapa');
    else s += R(x - 11, y - 9, 22, 9, 'f-cuerpo') + E(x, y, 11, 3.8, 'f-cuerpo') + E(x, y - 9, 11, 3.8, 'f-tapa');
  }
  s += E(PL.cx, PL.cy, PL.rx, PL.ry, 'f-borde');
  return s;
}

function corte(tipo) {
  const rnd = azar({ perf: 11, valv: 12, camp: 13 }[tipo]);
  const y0 = 228, e = 7, sup = { perf: 172, valv: 168, camp: 158 }[tipo];
  let s = '';
  // Espuma sobre el plato
  s += R(0, sup, 480, y0 - sup, 'f-esp');
  if (tipo === 'perf') {
    const hs = serie(40, 440, 40);
    s += burbujas(hs, y0 - 3, sup + 6, rnd, { porHueco: 3, r1: 6 });
    for (const x of [80, 240, 400]) s += flecha(x, 284, x, y0 + e + 4, 'f-vap', 11);
    s += plato(0, 480, y0, e, hs, 8);
    s += L(305, 150, 282, y0 - 2, 'f-guia') + T(310, 150, 'Orificios', 'f-rot2');
  } else if (tipo === 'valv') {
    const xs = [100, 240, 380];
    for (const x of xs) {
      s += flecha(x, 284, x, y0 - 2, 'f-vap', 11);
      s += flecha(x - 18, 211, x - 56, 211, 'f-vap', 10) + flecha(x + 18, 211, x + 56, 211, 'f-vap', 10);
      s += burbujas([x - 56, x + 56], 206, sup + 6, rnd, { porHueco: 2, r1: 6 });
    }
    s += plato(0, 480, y0, e, xs, 34);
    for (const x of xs) {
      s += G('an-valv', R(x - 32, 198, 64, 6, 'f-met') + R(x - 26, 204, 4, 40, 'f-met') + R(x + 22, 204, 4, 40, 'f-met') +
        R(x - 26, 240, 10, 4, 'f-met') + R(x + 16, 240, 10, 4, 'f-met'));
    }
    s += L(330, 150, 352, 196, 'f-guia') + T(250, 146, 'Tapa que sube', 'f-rot2');
  } else {
    const xs = [100, 240, 380];
    for (const x of xs) {
      s += L(x, 286, x, 187, 'f-vap');
      s += ruta([[x, 187], [x - 22, 187], [x - 22, 214], [x - 48, 214]], 'f-vap', 10);
      s += ruta([[x, 187], [x + 22, 187], [x + 22, 214], [x + 48, 214]], 'f-vap', 10);
      s += burbujas([x - 50, x + 50], 210, sup + 6, rnd, { porHueco: 2, r1: 6 });
    }
    s += plato(0, 480, y0, e, xs, 24);
    for (const x of xs) {
      // Chimenea
      s += R(x - 16, 190, 4, y0 - 190, 'f-met') + R(x + 12, 190, 4, y0 - 190, 'f-met');
      // Campana con ranuras al pie
      s += R(x - 32, 176, 64, 5, 'f-met') + R(x - 32, 176, 4, 30, 'f-met') + R(x + 28, 176, 4, 30, 'f-met');
    }
    s += L(212, 146, 222, 175, 'f-guia') + T(140, 140, 'Campana', 'f-rot2');
    s += L(300, 146, 254, 196, 'f-guia') + T(270, 140, 'Chimenea', 'f-rot2');
    s += L(420, 146, 410, 206, 'f-guia') + T(392, 140, 'Ranura', 'f-rot2');
  }
  // Líquido que cruza el plato
  s += flecha(14, sup - 14, 104, sup - 14, 'f-flu', 11);
  return s;
}

function tipoPlato(tipo, nombre) {
  return svg('0 0 480 296', planta(tipo) + corte(tipo), 'fig-tipo', `Plato ${nombre}, en planta y en corte`);
}

// ══════════════════════════════════════════════════════════════════════════
// 3. Cuatro formas de salirse de la ventana (diapositivas 9 y 10)
// ══════════════════════════════════════════════════════════════════════════
// Geometría común: dos platos, el bajante del de arriba a la derecha.
const V = { W1: 8, W2: 352, yA: 70, yB: 196, e: 5, ap: 268, apIn: 78 };
const hA = serie(98, 252, 22), hB = serie(98, 252, 22);

function vineta(estado) {
  const rnd = azar({ normal: 21, inund: 22, arrastre: 23, goteo: 24, bajante: 25 }[estado]);
  const { W1, W2, yA, yB, e, ap, apIn } = V;
  let s = '';
  // Alturas según el estado
  const espA = { normal: 44, inund: 0, arrastre: 40, goteo: 58, bajante: 22 }[estado];  // tope de la espuma del plato n
  const espB = { normal: 168, inund: yA + e, arrastre: 164, goteo: 186, bajante: 168 }[estado];
  const nivBaj = { normal: 140, inund: 34, arrastre: 136, goteo: 160, bajante: 34 }[estado]; // líquido claro en el bajante
  // Bajante que llega al plato n (izquierda)
  s += R(W1, 0, apIn - W1, yA, 'f-liqc');
  // Plato n
  if (estado === 'goteo') s += R(apIn + 4, espA, ap - apIn - 4, yA - espA, 'f-liq');
  else s += R(apIn + 4, espA, ap - apIn - 4, yA - espA, 'f-esp');
  // Bajante de la derecha
  if (estado !== 'inund' && estado !== 'bajante') s += R(ap + 4, nivBaj - 12, W2 - ap - 4, 12, 'f-esp');
  s += R(ap + 4, nivBaj, W2 - ap - 4, yB - nivBaj, 'f-liqc');
  if (estado === 'inund' || estado === 'bajante') s += R(ap + 4, 0, W2 - ap - 4, nivBaj, 'f-esp');
  // Plato n + 1
  s += R(W1, espB, ap + 4 - W1, yB - espB, estado === 'goteo' ? 'f-liq' : 'f-esp');
  s += R(ap - 30, yB - 10, 34, 10, 'f-liqc');

  // Lo que pasa en cada estado
  if (estado === 'normal') {
    s += burbujas(hB, yB - 3, espB + 4, rnd, { porHueco: 2, r1: 5 }) + burbujas(hA, yA - 3, espA + 4, rnd, { porHueco: 2, r1: 5 });
    for (const x of [120, 200]) s += flecha(x, espB - 4, x, yA + e + 6, 'f-vap', 10);
  }
  if (estado === 'inund') {
    s += espuma(apIn + 6, ap - 4, yA + e, yB, 36, rnd, 3, 6) + espuma(apIn + 6, ap - 4, 0, yA, 14, rnd, 3, 6);
    s += espuma(ap + 8, W2 - 4, 0, 60, 8, rnd, 3, 5);
    for (const x of [130, 210]) s += flecha(x, yB + 26, x, yB + e + 2, 'f-vapg', 12);
    s += R(apIn + 4, yA + e, ap - apIn - 4, yB - yA - e, 'f-esp');
  }
  if (estado === 'arrastre') {
    s += burbujas(hB, yB - 3, espB + 4, rnd, { porHueco: 2, r1: 5 }) + burbujas(hA, yA - 3, espA + 4, rnd, { porHueco: 2, r1: 5 });
    for (const x of [112, 228]) s += flecha(x, yB + 26, x, yB + e + 2, 'f-vapg', 12);
    for (let i = 0; i < 26; i++) {
      const x = apIn + 14 + rnd() * (ap - apIn - 28), y = yA + e + 12 + rnd() * (espB - yA - e - 14);
      s += gota(x, y, 2.6 + rnd() * 1.6, 'f-gota an-sube', ` style="--d:-${f(30 + rnd() * 30)}px;animation-delay:-${f(rnd() * 1.4)}s;animation-duration:1.3s"`);
    }
    for (const x of [142, 186, 230]) s += flecha(x, yA + 40, x, yA + e + 2, 'f-mals', 8);
  }
  if (estado === 'goteo') {
    for (const x of hA) {
      s += gota(x, yA + e + 20, 3.4, 'f-gota an-cae', ` style="--d:${f(70 + rnd() * 30)}px;animation-delay:-${f(rnd() * 1.6)}s"`);
      if (rnd() > 0.4) s += gota(x, yA + e + 62, 3, 'f-gota an-cae', ` style="--d:${f(40)}px;animation-delay:-${f(rnd() * 1.6)}s"`);
    }
    s += burbujas([120, 186, 230], yB - 3, espB + 2, rnd, { porHueco: 1, r0: 2, r1: 3 });
    for (const x of [130, 220]) s += P(`M${x} ${yB + 24} L${x} ${yB + e + 6}`, 'f-vapd');
  }
  if (estado === 'bajante') {
    s += burbujas(hB, yB - 3, espB + 4, rnd, { porHueco: 2, r1: 5 }) + espuma(apIn + 6, ap - 4, espA, yA, 10, rnd, 3, 5);
    s += espuma(ap + 8, W2 - 6, 4, yB - 16, 12, rnd, 3, 5);
    s += flecha(310, yB - 18, 310, 18, 'f-mals', 11);
  }

  // Platos, faldones y paredes encima de todo
  s += plato(W1, ap + 4, yA, e, hA, 7) + plato(W1, W2, yB, e, hB, 7);
  s += R(ap, yA - 14, 4, yB - 10 - (yA - 14), 'f-met') + R(apIn, 0, 4, yA - 12, 'f-met');
  s += L(W1, 0, W1, 222, 'f-pared') + L(W2, 0, W2, 222, 'f-pared');
  return s;
}

const ESTADOS = {
  inund: 'Inundación: la espuma llena el espacio entre platos',
  arrastre: 'Arrastre: el vapor lleva gotas al plato de arriba',
  goteo: 'Goteo: el líquido cae por las perforaciones',
  bajante: 'Bajante saturado: el líquido llena el bajante y el vapor sube por él',
  normal: 'Operación normal',
};
const vinetaSvg = (estado) => svg('0 0 360 222', vineta(estado), 'fig-vineta', ESTADOS[estado]);

// La ventana en miniatura con el borde que se cruza.
function ventanita(borde) {
  const pts = { a: [14, 44], b: [76, 39], c: [78, 13], d: [44, 7], e: [16, 11] };
  const lados = { goteo: ['a', 'b'], bajante: ['b', 'c'], inund: ['c', 'd'], arrastre: ['d', 'e'] };
  const fuera = { goteo: [44, 52], bajante: [87, 26], inund: [64, 3], arrastre: [26, 2] };
  let s = L(8, 8, 8, 52, 'f-eje') + L(8, 52, 92, 52, 'f-eje');
  s += P(`M${pts.a} L${pts.b} L${pts.c} L${pts.d} L${pts.e} Z`.replace(/,/g, ' '), 'f-vent');
  const [p, q] = lados[borde];
  s += L(...pts[p], ...pts[q], 'f-ventb');
  s += C(...fuera[borde], 4, 'f-mal');
  s += T(0, 12, 'V', 'f-eje-t') + T(84, 62, 'L', 'f-eje-t');
  return svg('-4 -2 100 68', s, 'fig-ventanita', '');
}

// Plato en vivo de la diapositiva 10: los cinco estados, uno visible a la vez.
function vinetaViva() {
  const g = Object.keys(ESTADOS).map((k) => `<g class="ve ve-${k}">${vineta(k)}</g>`).join('');
  return `<svg viewBox="0 0 360 222" class="fig-svg fig-vineta" id="plato-vivo" data-estado="normal" role="img" aria-label="El plato en el punto de operación">${g}</svg>`;
}

// ══════════════════════════════════════════════════════════════════════════
// 4. Diámetro (diapositiva 14): inundación de diseño, planta, comerciales
// ══════════════════════════════════════════════════════════════════════════
function medidor() {
  const x0 = 12, x1 = 348, px = (p) => x0 + (x1 - x0) * p / 110;
  let s = R(px(0), 40, px(75) - px(0), 18, 'f-esp') + R(px(75), 40, px(85) - px(75), 18, 'f-diseno') +
    R(px(85), 40, px(100) - px(85), 18, 'f-ambar') + R(px(100), 40, px(110) - px(100), 18, 'f-malsuave');
  s += L(px(100), 32, px(100), 66, 'f-mals', ' stroke-width="3"');
  s += T(px(0), 84, '0 %', 'f-rot3') + T(px(75) - 2, 84, '75', 'f-rot3', ' text-anchor="end"') + T(px(85) + 2, 84, '85', 'f-rot3');
  s += T(px(100), 84, '100 %', 'f-rot3', ' text-anchor="middle"');
  s += T(px(80), 26, 'Diseño', 'f-rot3b', ' text-anchor="middle"') + T(px(100) + 4, 26, 'Inunda', 'f-rot3m');
  return svg('0 0 360 94', s, 'fig-medidor', 'Escala de porcentaje de inundación con la franja de diseño entre 75 y 85 %');
}

// Segmento circular con fracción de área fr: devuelve la distancia de la cuerda al centro (en radios).
function cuerda(fr) {
  let lo = 0, hi = Math.PI;
  for (let i = 0; i < 60; i++) { const t = (lo + hi) / 2; ((t - Math.sin(t)) / (2 * Math.PI) < fr) ? lo = t : hi = t; }
  return Math.cos(lo / 2);
}

function plantaColumna({ cx = 104, cy = 104, r = 92, fr = 0.12, rotulos = true, puntos = true } = {}) {
  const d = cuerda(fr) * r, h = Math.sqrt(r * r - d * d);
  const rnd = azar(31);
  let s = C(cx, cy, r, 'f-esp');
  for (let i = 0; i < 26; i++) {
    const a = rnd() * 2 * Math.PI, rr = Math.sqrt(rnd()) * (r - 8), x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
    if (puntos && x < cx + d - 6) s += C(x, y, 3, 'f-vapf');
  }
  s += P(`M${f(cx + d)} ${f(cy - h)} A${r} ${r} 0 0 1 ${f(cx + d)} ${f(cy + h)} Z`, 'f-liqc');
  s += L(cx + d, cy - h, cx + d, cy + h, 'f-met', ' stroke-width="4" style="stroke:var(--gris-1)"');
  s += C(cx, cy, r, 'f-borde');
  if (rotulos) {
    s += L(cx + d + 14, cy + 8, 222, cy + 52, 'f-guia') + T(228, cy + 50, 'Bajante', 'f-rot3b') + T(228, cy + 72, '12 % del área', 'f-rot3');
    s += L(cx - 12, cy - 30, 222, cy - 58, 'f-guia') + T(228, cy - 64, 'Área neta', 'f-rot3b') + T(228, cy - 42, 'la cruza el vapor', 'f-rot3');
  }
  return s;
}

function comerciales() {
  const D = [0.5, 0.6, 0.8, 1.0, 1.2, 1.5, 1.8, 2.0], k = 36, gap = 7, yb = 196;
  let x = 4, s = '', cx08 = 0, cx10 = 0;
  for (const d of D) {
    const r = d * k / 2, cx = x + r;
    s += C(cx, yb - r, r, d === 0.8 || d === 1.0 ? 'f-comb' : 'f-com');
    s += T(cx, yb + 22, String(d.toFixed(1)).replace('.', ','), 'f-rot3', ' text-anchor="middle"');
    if (d === 0.8) cx08 = cx; if (d === 1.0) cx10 = cx;
    x += 2 * r + gap;
  }
  const r82 = 0.82 * k / 2, cxm = (cx08 + cx10) / 2, cym = 74;
  s += C(cxm, cym, r82, 'f-calc');
  s += T(cxm + r82 + 8, cym - 8, 'Calculado', 'f-rot3b') + T(cxm + r82 + 8, cym + 14, '0,82 m', 'f-rot3');
  s += flecha(cxm - 8, cym + r82 + 4, cx08 + 4, yb - 0.8 * k - 6, 'f-cota', 8) + flecha(cxm + 8, cym + r82 + 4, cx10 - 4, yb - 1.0 * k - 6, 'f-cota', 8);
  return svg('0 0 380 226', s, 'fig-comerciales', 'Diámetros comerciales dibujados a escala, de 0,5 a 2,0 m');
}

// ══════════════════════════════════════════════════════════════════════════
// 5. El bajante (diapositiva 15): en planta y en corte
// ══════════════════════════════════════════════════════════════════════════
function bajante() {
  const rnd = azar(41);
  let s = plantaColumna({ cx: 130, cy: 175, r: 120, rotulos: false, puntos: false });
  s += T(130, 330, 'En planta', 'f-rot2', ' text-anchor="middle"');
  s += L(228, 230, 262, 266, 'f-guia') + T(266, 276, 'Bajante', 'f-rot3b') + T(266, 296, '10 a 15 %', 'f-rot3');
  s += T(110, 170, 'Área activa', 'f-rot3b', ' text-anchor="middle"') + T(110, 192, 'y de llegada', 'f-rot3', ' text-anchor="middle"');
  // Corte del bajante
  const ox = 330, yA = 120, yB = 320, ap = 600, W2 = 720;
  s += R(ox, 76, ap - ox, yA - 76, 'f-esp') + burbujas(serie(ox + 30, ap - 30, 34), yA - 3, 82, rnd, { porHueco: 2, r1: 5 });
  s += P(`M${ap - 8} 92 Q${ap + 14} 84 ${ap + 22} 108 L${ap + 30} 170 L${ap + 15} 170 L${ap + 9} 114 Q${ap + 6} 100 ${ap - 8} 100 Z`, 'f-liq');
  s += R(ap + 7, 160, W2 - ap - 7, 50, 'f-esp') + R(ap + 7, 210, W2 - ap - 7, yB - 210, 'f-liqc') + R(560, yB - 20, ap + 7 - 560, 20, 'f-liqc');
  for (let i = 0; i < 14; i++) {
    const x = ap + 14 + rnd() * (W2 - ap - 28), y = 168 + rnd() * 100;
    s += C(x, y, 2.5 + rnd() * 3, 'f-bur an-sube', ` style="--d:-${f(30 + rnd() * 30)}px;animation-delay:-${f(rnd() * 2)}s;animation-duration:2.6s"`);
  }
  s += flecha(664, 222, 664, 306, 'f-flu', 13);
  s += plato(ox, ap + 7, yA, 7, serie(ox + 30, ap - 30, 34), 8) + plato(520, W2, yB, 7, [], 8);
  s += R(ap, 88, 7, yB - 20 - 88, 'f-met') + L(W2, 40, W2, 350, 'f-pared');
  s += cota(744, 210, 744, yB) + T(756, 270, 'h', 'f-rot') + `<text x="770" y="277" class="f-sub">liq</text>`;
  s += L(706, 190, 760, 168, 'f-guia') + T(766, 162, 'El gas se', 'f-rot3') + T(766, 182, 'desprende', 'f-rot3');
  s += T(530, 254, 'u', 'f-rot', ' text-anchor="end"') + `<text x="532" y="261" class="f-sub">baj</text>` + L(565, 252, 648, 262, 'f-guia');
  s += T(ox, 60, 'En corte', 'f-rot2');
  return svg('0 0 860 360', s, 'fig-bajante', 'El bajante en planta y en corte, con la zona donde se desprende el gas');
}

// ══════════════════════════════════════════════════════════════════════════
// 6. Caída de presión (diapositiva 16)
// ══════════════════════════════════════════════════════════════════════════
function presion() {
  const x1 = 70, x2 = 140, y1 = 34, y2 = 286, n = 20;
  let s = R(x1, y1, x2 - x1, y2 - y1, 'f-casco');
  for (let i = 0; i < n; i++) {
    const y = y1 + 8 + (i + 0.5) * (y2 - y1 - 16) / n, izq = i % 2 === 0;
    s += L(izq ? x1 : x1 + 14, y, izq ? x2 - 14 : x2, y, 'f-plato');
  }
  s += P(`M${x1} ${y1} Q${(x1 + x2) / 2} ${y1 - 26} ${x2} ${y1}`, 'f-mets');
  s += P(`M${x1} ${y2} Q${(x1 + x2) / 2} ${y2 + 26} ${x2} ${y2}`, 'f-mets');
  // Presión creciente: barra degradada
  s += `<defs><linearGradient id="dp-grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="f-st0"/><stop offset="1" class="f-st1"/></linearGradient></defs>`;
  s += R(166, y1 + 8, 22, y2 - y1 - 16, '', ' fill="url(#dp-grad)"');
  s += flecha(200, y1 + 20, 200, y2 - 20, 'f-cota', 10);
  s += T(214, y1 + 22, 'Domo', 'f-rot2') + T(214, y1 + 50, '101 kPa', 'f-rotg');
  s += T(214, y2 - 30, 'Fondo', 'f-rot2') + T(214, y2 - 2, '≈ 113 kPa', 'f-rotg');
  s += T(214, (y1 + y2) / 2 - 6, '20 platos × 0,6 kPa', 'f-rot') + T(214, (y1 + y2) / 2 + 20, '= unos 12 kPa más', 'f-rot2');
  s += T(452, y2 - 16, 'El agua del fondo hierve', 'f-rot3', ' text-anchor="start"') + T(452, y2 + 6, 'a 103 °C y no a 100 °C', 'f-rot3b');
  return svg('0 0 680 320', s, 'fig-presion', 'La presión crece plato a plato desde el domo hasta el fondo');
}

// ══════════════════════════════════════════════════════════════════════════
// 7. La altura de la columna (diapositiva 17)
// ══════════════════════════════════════════════════════════════════════════
function altura() {
  const x1 = 150, x2 = 262, cx = (x1 + x2) / 2, ry = 30;
  const yDomo = 62, y1p = 172, yCorte = 312, yUlt = 470, yFondo = 610, yBase = 744;
  let s = '';
  // Fondo con su líquido
  s += P(`M${x1} 540 L${x2} 540 L${x2} ${yFondo} Q${cx} ${yFondo + 2 * ry} ${x1} ${yFondo} Z`, 'f-liqc');
  // Casco y cabezas
  s += P(`M${x1} ${yDomo + ry} Q${cx} ${yDomo - ry} ${x2} ${yDomo + ry} L${x2} ${yFondo} Q${cx} ${yFondo + 2 * ry} ${x1} ${yFondo} Z`, 'f-casco2');
  // Platos con bajantes alternos, con un corte en el medio
  const ys = [y1p, 206, 240, 274, 362, 396, 430, yUlt];
  ys.forEach((y, i) => {
    const izq = i % 2 === 0;
    s += L(izq ? x1 : x1 + 22, y, izq ? x2 - 22 : x2, y, 'f-plato');
    s += L(izq ? x2 - 22 : x1 + 22, y - 9, izq ? x2 - 22 : x1 + 22, y + 24, 'f-plato2');
  });
  const zig = (y0) => { let d = `M${x1 - 10} ${y0}`; for (let x = x1 - 10, k = 0; x < x2 + 10; x += 12, k++) d += ` L${x + 12} ${y0 + (k % 2 ? -5 : 5)}`; return d; };
  s += R(x1 - 6, yCorte - 4, x2 - x1 + 12, 24, 'f-fondo');
  s += P(zig(yCorte - 2), 'f-rotura') + P(zig(yCorte + 18), 'f-rotura');
  // Boquillas: vapor arriba, reflujo, alimentación, retorno del hervidor, fondos
  s += R(cx - 10, 4, 20, yDomo - ry + 6, 'f-boq') + R(x2, 120, 34, 14, 'f-boq') + R(x1 - 34, 286, 34, 14, 'f-boq');
  s += R(x2, 504, 34, 14, 'f-boq') + R(cx - 9, yFondo + ry + 2, 18, 30, 'f-boq');
  s += flecha(cx, 40, cx, 8, 'f-vap', 10) + flecha(x2 + 60, 127, x2 + 6, 127, 'f-flu', 10) + flecha(x1 - 60, 293, x1 - 6, 293, 'f-flu', 10);
  s += flecha(x2 + 60, 511, x2 + 6, 511, 'f-vap', 10);
  // Faldón
  s += P(`M${x1 + 4} ${yFondo + 20} L${x1 + 4} ${yBase} M${x2 - 4} ${yFondo + 20} L${x2 - 4} ${yBase}`, 'f-mets3');
  s += R(cx - 22, 690, 44, 34, 'f-abert');
  s += L(x1 - 30, yBase, x2 + 30, yBase, 'f-piso');
  // Cotas y rótulos a la derecha
  const cx2 = 372;
  const tramo = (a, b, n, t1, t2) => cota(cx2, a, cx2, b) + T(cx2 + 18, (a + b) / 2 - 4, t1, 'f-rotc') + T(cx2 + 18, (a + b) / 2 + 20, t2, 'f-rot3');
  s += tramo(yDomo - ry + 30, y1p, 1, 'Domo', '≈ 1,5 D');
  s += tramo(y1p, yUlt, 2, 'Cuerpo', 'N × espaciamiento');
  s += tramo(yUlt, yFondo + ry, 3, 'Fondo', '≈ 2 m');
  s += tramo(yFondo + ry, yBase, 4, 'Faldón', 'al piso');
  // Diámetro y espaciamiento
  s += cota(x1, 150, x2, 150) + T(cx, 142, 'D', 'f-rot', ' text-anchor="middle"');
  s += cota(118, 206, 118, 240) + T(110, 228, 'esp.', 'f-rot3', ' text-anchor="end"');
  s += T(x1 - 8, 278, 'Alimentación', 'f-rot3', ' text-anchor="end"');
  s += T(x2 + 8, 112, 'Reflujo', 'f-rot3');
  s += T(x2 + 8, 542, 'Del hervidor', 'f-rot3');
  return svg('20 0 560 760', s, 'fig-altura', 'Columna en alzado con el domo, el cuerpo de platos, el fondo y el faldón');
}

// ── Inserción en el HTML ──────────────────────────────────────────────────
const FIG = {
  anatomia: anatomia(),
  'tipo-perf': tipoPlato('perf', 'perforado'),
  'tipo-valv': tipoPlato('valv', 'de válvulas'),
  'tipo-camp': tipoPlato('camp', 'de campanas'),
  'falla-inund': vinetaSvg('inund'),
  'vent-inund': ventanita('inund'),
  'falla-arrastre': vinetaSvg('arrastre'),
  'vent-arrastre': ventanita('arrastre'),
  'falla-goteo': vinetaSvg('goteo'),
  'vent-goteo': ventanita('goteo'),
  'falla-bajante': vinetaSvg('bajante'),
  'vent-bajante': ventanita('bajante'),
  'plato-vivo': vinetaViva(),
  medidor: medidor(),
  planta: svg('0 0 360 210', plantaColumna(), 'fig-planta', 'Planta de la columna: el área neta y el bajante'),
  comerciales: comerciales(),
  bajante: bajante(),
  presion: presion(),
  altura: altura(),
};

let html = fs.readFileSync(HTML, 'utf8');
let n = 0;
for (const [k, v] of Object.entries(FIG)) {
  const re = new RegExp(`(<!-- DPLAT:${k} -->)[\\s\\S]*?(<!-- /DPLAT:${k} -->)`);
  if (!re.test(html)) { console.warn('Falta el marcador', k); continue; }
  html = html.replace(re, `$1${v}$2`); n++;
}
fs.writeFileSync(HTML, html);
console.log(`${n} figuras insertadas en ${path.basename(HTML)}`);
