// El intercambiador de tubos y coraza AES de una coraza con los nombres de sus piezas, para el capítulo 22 del libro de
// operaciones unitarias (Heat exchangers, 22.5: la designación TEMA):
//
//   node build.mjs --head AES --ns 1 --libro --audit
//   node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//   CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina [ruta/shell-and-tube.svg]
//
// Toma la figura del explorador con la persona de referencia (out/tc-AES-1-libro.svg, de build.mjs --libro), la abre
// en Chromium con el código vivo del explorador (out/fig.js) y un estado quieto: cuatro pasos, cada uno de un color de
// la rampa de la paleta (el primero, abajo, el más caliente; el cuarto, arriba, el más frío) y la coraza con el velo
// del fluido frío. Quita lo que solo tiene sentido en movimiento (las partículas de la coraza y los trazos de los
// tubos) y agrega dos piezas de la designación TEMA que el explorador no dibuja: una varilla tensora con sus
// espaciadores en la columna de adelante del haz (en lugar de una fila de tubos, del espejo fijo al último deflector,
// con su tuerca) y la placa de choque bajo la boquilla de entrada de la coraza. Sin --lamina escribe
// figuras/intercambiadores-de-calor/_tubos-coraza.qmd en el libro (y out/libro-preview.html para revisarla); con
// --lamina, la lámina de la edición en inglés, en/figuras/22/shell-and-tube.svg.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_PERSONA } from '../persona.mjs';
import { capturar, colores, cuerpoDe, rotulado, conLetra, libro, lamina, k } from './libro-comun.mjs';
import { ROTULOS, ROTULOS_EN, DESCRIPCION, DESCRIPCION_EN } from './rotulos.mjs';
import { HX, baffles } from './geo.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const G = await import(KIT + '/kit/lathe.mjs');
for (const f of ['tc-AES-1-libro.svg', 'tc-AES-1-libro.json', 'fig.js']) if (!existsSync(join(AQUI, 'out', f))) throw new Error(`Falta out/${f}: corra antes node build.mjs --head AES --ns 1 --libro`);
const SVG = readFileSync(join(AQUI, 'out/tc-AES-1-libro.svg'), 'utf8');
const DATA = JSON.parse(readFileSync(join(AQUI, 'out/tc-AES-1-libro.json'), 'utf8'));
const P = DATA.P, zc = DATA.units[0].zc;

/* ── las piezas que agrega el libro ─────────────────────────────────────────────────────────────────────── */
const BAF = baffles(), XV = HX.tube.cols[0];
// la varilla tensora: en la columna de adelante, en la fila de 13,5 cm sobre el eje (dentro de la zona donde se traslapan
// todos los deflectores, bajo la ventana de arriba), en lugar de esa fila de tubos. Va enroscada en el espejo fijo y
// llega hasta el último deflector, donde la aprieta una tuerca; entre deflectores la cubren los espaciadores
const ZV = 13.5, RV = 0.55, RS = 1.05;
const FY = (z) => G.frameOf([XV, 0, zc + z], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
const cil = (s0, s1, r, cls) => `<g class="${cls}">${k.solidSvg(G.solidOf([[s0, r], [s1, r]], FY(ZV), P, {}), { tone: 'mid' })}</g>`;
const tramo = (kk) => (kk === 0 ? null : [BAF[kk - 1].y + 0.4, kk === BAF.length ? HX.L : BAF[kk].y - 0.4]);
const VARILLA = {};
for (let kk = 1; kk <= BAF.length; kk++) { const [a, b] = tramo(kk); VARILLA[kk] = cil(a, b, RS, 'hx-esp'); }
// del lado del cabezal flotante, el extremo de la varilla y la tuerca contra el último deflector
const y0 = BAF[0].y - 0.4;
VARILLA[0] = cil(y0 - 3.4, y0 - 1.5, RV, 'hx-esp') + cil(y0 - 1.5, y0, 1.25, 'hx-esp');
// la placa de choque: una placa de 12 × 9 cm y 6 mm bajo la boquilla de entrada de la coraza, entre el haz y la coraza
const NZ = DATA.units[0].noz.shellIn, PCH = { x0: -17.4, x1: -8.6, y0: NZ - 6, y1: NZ + 6, z0: zc + 23.3, z1: zc + 23.9 };
const PLACA = `<g class="hx-esp">${k.solidSvg(k.slabOf({ x: PCH.x0, y: PCH.y0, w: PCH.x1 - PCH.x0, d: PCH.y1 - PCH.y0, r: 0.1 }, PCH.z0, PCH.z1 - PCH.z0, P, 2, 0), { tone: 'mid' })}</g>`;
const kPlaca = BAF.length; // la tajada entre el último deflector de adelante y el espejo fijo
const ANCLAS = {
  ...DATA.anclas,
  VARILLA: [XV, (BAF[2].y + BAF[3].y) / 2, zc + ZV + RS],
  PLACA_CHOQUE: [PCH.x1, PCH.y1 - 2, PCH.z1],
};

/* ── la figura quieta ───────────────────────────────────────────────────────────────────────────────────── */
// cuatro pasos de un tono cada uno (la rampa va de 0, frío, a 1, caliente): los dos de abajo en los tonos de lo
// caliente y los dos de arriba en los del frío, así la varilla, gris, se distingue; la coraza con el velo del fluido frío
const cte = (v) => Array(31).fill(v);
const ESTADO = { Np: 4, Tlo: 0, Thi: 1, steam: false, tPass: 3, tComp: 1.2, prof: { units: [{ shell: cte(0.25), tubes: [cte(1), cte(0.75), cte(0.25), cte(0)] }] } };
const { svg, css: cssVivo } = colores(await capturar({
  svg: SVG, data: DATA, figJs: readFileSync(join(AQUI, 'out/fig.js'), 'utf8'), clase: 'FTube', estado: ESTADO,
  // la fila de la varilla no lleva tubos en la columna de adelante
  antes: `f.rows = f.rows.filter(function (t) { return !(t.c === 0 && Math.abs(t.z - ${ZV}) < 0.01); });`,
  despues: `var V = ${JSON.stringify(VARILLA)}; Object.keys(V).forEach(function (kk) { var g = f.svg.querySelector('[data-live="u0.sl' + kk + '"]'); if (g) g.insertAdjacentHTML('beforeend', V[kk]); });
var gp = f.svg.querySelector('[data-live="u0.sl${kPlaca}"]'); if (gp) gp.insertAdjacentHTML('beforeend', ${JSON.stringify(PLACA)});`,
  quitar: ['.hx-sp', '.hx-flow'],
}));
const cuerpo = cuerpoDe(svg);
const CSS = readFileSync(join(AQUI, 'hx.css'), 'utf8') + cssVivo + CSS_PERSONA;

if (process.argv.includes('--lamina')) {
  await lamina({ nombre: 'tubos-coraza', ingles: 'shell-and-tube', descripcion: DESCRIPCION_EN, cuerpo, css: CSS, rotular: (letra) => rotulado(svg, P, ANCLAS, ROTULOS_EN, { letra }) });
} else {
  const R = conLetra((letra) => rotulado(svg, P, ANCLAS, ROTULOS, { letra }));
  libro({ aqui: AQUI, nombre: 'tubos-coraza', titulo: 'Tubos y coraza AES', descripcion: DESCRIPCION, cuerpo, css: CSS, trazos: R.trazos, caja: R.caja, letra: R.letra });
}
