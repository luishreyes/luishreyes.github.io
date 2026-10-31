// El divisor de rifles con los nombres de sus piezas, para el capítulo 5 del libro de operaciones unitarias
// (Caracterización de sólidos particulados):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Escribe figuras/caracterizacion-de-solidos-particulados/_divisor.qmd con el SVG del skill anatomy y los rótulos.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/caracterizacion-de-solidos-particulados');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
mkdirSync(DEST, { recursive: true });
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'divisor_data.json'), 'utf8'));
const r1 = v => Math.round(v * 10) / 10;

const letra = 14;
// [ancla, x y y del rótulo en el lienzo, texto, desplazamiento del punto]
const R = [
  ['TOLVA', 120, 70, 'Tolva de alimentación', 0, 0],
  ['PLACA', 760, 90, 'Placa del equipo', 0, 0],
  ['TABIQUE', 860, 250, 'Canaletas de 25 mm, una sí y una no', 0, 0],
  ['CANALETA', 860, 330, 'Salida hacia la bandeja de este lado', 0, 0],
  ['MONTON', 860, 600, 'Una mitad de la muestra', 0, 0],
  ['BANDEJA', 860, 500, 'Bandeja receptora', 0, 0],
  ['ASA', 60, 330, 'Asa', 0, 0],
  ['PATA', 60, 560, 'Pata y travesaño', 0, 0],
];
const trazos = R.map(([a, x, y, t, dx, dy]) => {
  const [ax, ay] = k.iso(ANCLAS[a], P).map(r1);
  const bx = ax + dx, by = ay + dy;
  const fin = x > bx ? x - 4 : x + 4;
  return `<path class="rot-linea" d="M${bx} ${by}L${fin} ${y}"/><circle class="rot-punto" cx="${bx}" cy="${by}" r="2.6"/>` +
    `<text class="rot-texto" x="${x > bx ? x : x}" y="${r1(y + letra * 0.35)}" text-anchor="${x > bx ? 'start' : 'end'}" font-size="${letra}">${t}</text>`;
}).join('');
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');
const etiqueta = 'Divisor de rifles en isométrico: arriba, la tolva de alimentación; debajo, doce canaletas de 25 mm separadas por tabiques, que desaguan una sí y una no hacia lados opuestos; abajo, a cada lado, una bandeja que recibe la mitad de la muestra. El equipo se apoya en cuatro patas con travesaños y tiene un asa en cada extremo.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="-120 0 1240 760" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`), 'caracterizacion-de-solidos-particulados/_divisor');
writeFileSync(join(DEST, '_divisor.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_divisor.qmd', Math.round(cuerpo.length / 1024), 'KB');
