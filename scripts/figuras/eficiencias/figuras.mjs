// Figuras de la presentación «Eficiencias en destilación» (POU 2026-20).
//
// Las tres razones por las que un plato real no alcanza el equilibrio, en
// corte: el tiempo que tarda el líquido en cruzar, el gradiente de composición
// sobre el plato y el arrastre y el goteo. Usan las piezas y las clases de
// scripts/figuras/diseno-platos/figuras.mjs (el CSS va en el <style> del deck).
//
// Uso:  node scripts/figuras/eficiencias/figuras.mjs
// Reemplaza en el HTML lo que hay entre <!-- EFIC:nombre --> y <!-- /EFIC:nombre -->.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { R, L, P, C, T, azar, flecha, plato, serie, burbujas, gota, svg } from '../diseno-platos/figuras.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HTML = path.resolve(__dirname, '../../../public/classroom/iqya-2031-2026-20/slides/Eficiencias_en_Destilacion/Presentacion_Eficiencias_en_Destilacion.html');

// Geometría común: un plato con el bajante que llega por la izquierda y el que sale por la derecha.
const W1 = 6, W2 = 354, Y = 140, E = 6, AP_IN = 62, AP = 298;
const HUECOS = serie(84, 278, 21);

function base({ espuma = 'f-esp', tope = 100, conArriba = false } = {}) {
  let s = '';
  // Bajante que llega (izquierda), líquido claro
  s += R(W1, conArriba ? 40 : 0, AP_IN - W1, Y - (conArriba ? 40 : 0), 'f-liqc');
  // Espuma o gradiente sobre el plato
  s += R(AP_IN + 4, tope, AP - AP_IN - 4, Y - tope, espuma);
  // Cresta sobre el vertedero y bajante de salida
  s += P(`M${AP - 6} ${tope + 14} Q${AP + 12} ${tope + 8} ${AP + 18} ${tope + 26} L${AP + 24} ${Y + 8} L${AP + 12} ${Y + 8} L${AP + 8} ${tope + 30} Q${AP + 5} ${tope + 20} ${AP - 6} ${tope + 20} Z`, 'f-liq');
  s += R(AP + 4, Y - 10, W2 - AP - 4, 70, 'f-liqc');
  return s;
}
function encima(conArriba = false) {
  let s = plato(W1, AP + 4, Y, E, HUECOS, 7);
  s += R(AP, Y - 26, 4, 26, 'f-met');                       // vertedero
  s += R(AP, Y - 26, 4, 26 + 70, 'f-met');                  // faldón del bajante
  s += R(AP_IN, conArriba ? 40 : 0, 4, Y - 14 - (conArriba ? 40 : 0), 'f-met');
  s += L(W1, 0, W1, 210, 'f-pared') + L(W2, 0, W2, 210, 'f-pared');
  return s;
}

// 1. El tiempo no alcanza: una porción de líquido cruza el plato.
function tiempo() {
  const rnd = azar(51);
  let s = base({ tope: 104 });
  s += burbujas(HUECOS, Y - 3, 108, rnd, { porHueco: 2, r1: 5 });
  for (const x of [120, 200, 260]) s += flecha(x, 204, x, Y + E + 4, 'f-vap', 11);
  s += `<g class="an-cruza">${C(84, 122, 8, 'f-parcela')}</g>`;
  s += flecha(84, 84, 286, 84, 'f-flu', 12);
  s += T(185, 70, 'Cruza en pocos segundos', 'f-rot3b', ' text-anchor="middle"');
  return svg('0 0 360 210', s + encima(), 'fig-razon', 'El líquido cruza el plato en pocos segundos');
}

// 2. El mezclado no es perfecto: el líquido entra rico y sale pobre.
function mezclado() {
  const rnd = azar(52);
  let s = `<defs><linearGradient id="ef-grad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" class="f-rico"/><stop offset="1" class="f-pobre"/></linearGradient></defs>`;
  s += base({ espuma: 'f-grad', tope: 104 });
  s += burbujas(HUECOS, Y - 3, 108, rnd, { porHueco: 2, r1: 5 });
  for (const x of [120, 200, 260]) s += flecha(x, 204, x, Y + E + 4, 'f-vap', 11);
  s += T(AP_IN + 8, 90, 'Entra rico', 'f-rot3b') + T(AP - 6, 90, 'Sale pobre', 'f-rot3', ' text-anchor="end"');
  return svg('0 0 360 210', s + encima(), 'fig-razon', 'El líquido entra rico y sale pobre: la composición cambia a lo largo del plato');
}

// 3. Arrastre y goteo: gotas que suben al plato de arriba y líquido que se cuela.
function arrastre() {
  const rnd = azar(53);
  let s = base({ tope: 112, conArriba: true });
  // Plato de arriba (solo su borde inferior y su líquido)
  s += R(AP_IN + 4, 22, W2 - AP_IN - 4, 12, 'f-esp');
  s += plato(AP_IN, W2, 34, E, HUECOS.map((x) => x + 10), 7);
  s += burbujas(HUECOS, Y - 3, 116, rnd, { porHueco: 2, r1: 5 });
  for (let i = 0; i < 12; i++) {
    const x = AP_IN + 16 + rnd() * (AP - AP_IN - 96), y = 50 + rnd() * 52;
    s += gota(x, y, 2.6 + rnd() * 1.2, 'f-gota an-sube', ` style="--d:-${(18 + rnd() * 14).toFixed(1)}px;animation-delay:-${(rnd() * 1.4).toFixed(2)}s;animation-duration:1.3s"`);
  }
  s += flecha(282, 104, 282, 44, 'f-mals', 9);
  for (const x of HUECOS.filter((_, i) => i % 2)) {
    s += gota(x, Y + E + 14, 3, 'f-gota an-cae', ` style="--d:${(34 + rnd() * 14).toFixed(1)}px;animation-delay:-${(rnd() * 1.6).toFixed(2)}s"`);
  }
  s += T(272, 66, 'Arrastre', 'f-alerta', ' text-anchor="end"');
  s += T(AP - 8, 202, 'Goteo', 'f-alerta', ' text-anchor="end"');
  return svg('0 0 360 210', s + encima(true), 'fig-razon', 'Gotas que el vapor sube al plato de arriba y líquido que se cuela por los orificios');
}

const FIG = { 'razon-tiempo': tiempo(), 'razon-mezcla': mezclado(), 'razon-arrastre': arrastre() };

let html = fs.readFileSync(HTML, 'utf8');
let n = 0;
for (const [k, v] of Object.entries(FIG)) {
  const re = new RegExp(`(<!-- EFIC:${k} -->)[\\s\\S]*?(<!-- /EFIC:${k} -->)`);
  if (!re.test(html)) { console.warn('Falta el marcador', k); continue; }
  html = html.replace(re, `$1${v}$2`); n++;
}
fs.writeFileSync(HTML, html);
console.log(`${n} figuras insertadas en ${path.basename(HTML)}`);
