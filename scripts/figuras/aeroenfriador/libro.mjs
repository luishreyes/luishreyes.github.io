// El aeroenfriador de tiro forzado con los nombres de sus piezas, para el capítulo 22 del libro de operaciones unitarias
// (Heat exchangers, 22.10: aeroenfriadores):
//
//   node build.mjs --libro --audit
//   node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//   CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina [ruta/air-cooler.svg]
//
// Toma la figura del explorador con la persona de referencia (out/aero-par-libro.svg, de build.mjs --libro: pasos
// pares, la salida en el cabezal de adelante), la abre en Chromium con el código vivo del explorador (out/fig.js) y un
// estado quieto: un paso, el haz en un solo tono de lo caliente y las aspas quietas, con los grises del acero. Quita el
// aire que sube (trazos sueltos que solo se leen en movimiento) y pone en su lugar flechas: azules bajo cada anillo, por
// donde entra el aire, y naranjas sobre el haz, por donde sale caliente. Sin --lamina escribe
// figuras/intercambiadores-de-calor/_aeroenfriador.qmd en el libro (y out/libro-preview.html para revisarla); con
// --lamina, la lámina de la edición en inglés, en/figuras/22/air-cooler.svg. Lo común está en
// ../intercambiador/libro-comun.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_PERSONA } from '../persona.mjs';
import { capturar, colores, cuerpoDe, rotulado, conLetra, libro, lamina, k, r1 } from '../intercambiador/libro-comun.mjs';
import { ROTULOS, ROTULOS_EN, DESCRIPCION, DESCRIPCION_EN } from './rotulos.mjs';
import { AC, topZ } from './geo.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
for (const f of ['aero-par-libro.svg', 'aero-par-libro.json', 'fig.js']) if (!existsSync(join(AQUI, 'out', f))) throw new Error(`Falta out/${f}: corra antes node build.mjs --libro`);
const SVG = readFileSync(join(AQUI, 'out/aero-par-libro.svg'), 'utf8');
const DATA = JSON.parse(readFileSync(join(AQUI, 'out/aero-par-libro.json'), 'utf8'));
const P = DATA.P;

/* ── las flechas del aire ───────────────────────────────────────────────────────────────────────────────── */
// una flecha vertical de a a b (en cm), con la punta en b; cls: ic-aire-f (el aire frío que entra) o ic-aire-c (el
// caliente que sale)
const flecha = (a, b, cls) => {
  const p = k.iso(a, P), q = k.iso(b, P), dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, h = 6, w = 3;
  const base = [q[0] - ux * h, q[1] - uy * h];
  return `<path class="${cls}" d="M${r1(p[0])} ${r1(p[1])}L${r1(base[0])} ${r1(base[1])}"/>` +
    `<path class="${cls}-p" d="M${r1(q[0])} ${r1(q[1])}L${r1(base[0] - uy * w)} ${r1(base[1] + ux * w)}L${r1(base[0] + uy * w)} ${r1(base[1] - ux * w)}Z"/>`;
};
// entra: bajo cada anillo, del lado del lector (delante del motor y del eje), de 0,80 a 1,20 m
const ENTRA = AC.fan.y.map((yf) => [[28, yf + 18], [34, yf - 10]].map(([x, y]) => flecha([x, y, 80], [x, y, 120], 'ic-aire-f')).join(''));
// sale: sobre el haz, de 4 a 36 cm por encima de la fila de arriba
const ZT = topZ() + AC.sup;
const SALE = [55, 150, 245].map((y) => flecha([6, y, ZT + 4], [6, y, ZT + 36], 'ic-aire-c')).join('');
const ANCLAS = { ...DATA.anclas, AIRE_ENT: [28, AC.fan.y[1] + 18, 115], AIRE_SAL: [6, 150, ZT + 28] };
const CSS_FLECHAS = '.ic-aire-f,.ic-aire-c{fill:none;stroke-width:1.6px;stroke-linecap:round}.ic-aire-f{stroke:#2f6db5}.ic-aire-c{stroke:#c8452b}' +
  '.ic-aire-f-p{fill:#2f6db5}.ic-aire-c-p{fill:#c8452b}';

/* ── la figura quieta ───────────────────────────────────────────────────────────────────────────────────── */
// un paso, el proceso en el tono medio de lo caliente (la rampa va de 0, frío, a 1, caliente); el aire de entrada, frío
const cte = (v) => Array(61).fill(v);
const ESTADO = { Np: 1, Tlo: 0, Thi: 1, tTube: 6, vFace: 3.5, prof: { shell: cte(0), tubes: [cte(0.75)] } };
const { svg, css: cssVivo } = colores(await capturar({
  svg: SVG, data: DATA, figJs: readFileSync(join(AQUI, 'out/fig.js'), 'utf8'), clase: 'FAir', estado: ESTADO,
  despues: `var E = ${JSON.stringify(ENTRA)}; E.forEach(function (h, i) { var g = f.svg.querySelector('[data-live="air.in' + i + '.fr"]'); if (g) g.insertAdjacentHTML('beforeend', h); });
var go = f.svg.querySelector('[data-live="air.out"]'); if (go) go.insertAdjacentHTML('beforeend', ${JSON.stringify(SALE)});`,
  quitar: ['.ac-air', '.ac-flow'],
}), { luz: ['ac-bl'] });
const cuerpo = cuerpoDe(svg);
const CSS = readFileSync(join(AQUI, 'ac.css'), 'utf8') + CSS_FLECHAS + cssVivo + CSS_PERSONA;

if (process.argv.includes('--lamina')) {
  await lamina({ nombre: 'aeroenfriador', ingles: 'air-cooler', descripcion: DESCRIPCION_EN, cuerpo, css: CSS, rotular: (letra) => rotulado(svg, P, ANCLAS, ROTULOS_EN, { letra }) });
} else {
  const R = conLetra((letra) => rotulado(svg, P, ANCLAS, ROTULOS, { letra }));
  libro({ aqui: AQUI, nombre: 'aeroenfriador', titulo: 'Aeroenfriador', descripcion: DESCRIPCION, cuerpo, css: CSS, trazos: R.trazos, caja: R.caja, letra: R.letra });
}
