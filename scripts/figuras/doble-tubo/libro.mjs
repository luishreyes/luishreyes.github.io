// El intercambiador de doble tubo con los nombres de sus piezas, para el capítulo 22 del libro de operaciones unitarias
// (Heat exchangers, 22.10: doble tubo y horquillas):
//
//   node build.mjs --libro --audit
//   node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//   CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina [ruta/double-pipe.svg]
//
// Toma la figura del explorador con la persona de referencia (out/doble-libro.svg, de build.mjs --libro), la abre en
// Chromium con el código vivo del explorador (out/fig.js) y un estado quieto en contracorriente: el tubo interior con el
// fluido frío y el ánulo con el caliente, cada uno de un tono de la rampa de la paleta; quita los trazos y los puntos que
// corren. Sin --lamina escribe figuras/intercambiadores-de-calor/_doble-tubo.qmd en el libro (y out/libro-preview.html
// para revisarla); con --lamina, la lámina de la edición en inglés, en/figuras/22/double-pipe.svg. Lo común está en
// ../intercambiador/libro-comun.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_PERSONA } from '../persona.mjs';
import { capturar, colores, cuerpoDe, rotulado, conLetra, libro, lamina } from '../intercambiador/libro-comun.mjs';
import { ROTULOS, ROTULOS_EN, DESCRIPCION, DESCRIPCION_EN } from './rotulos.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
for (const f of ['doble-libro.svg', 'doble-libro.json', 'fig.js']) if (!existsSync(join(AQUI, 'out', f))) throw new Error(`Falta out/${f}: corra antes node build.mjs --libro`);
const SVG = readFileSync(join(AQUI, 'out/doble-libro.svg'), 'utf8');
const DATA = JSON.parse(readFileSync(join(AQUI, 'out/doble-libro.json'), 'utf8'));
const P = DATA.P, ANCLAS = DATA.anclas;

// el frío por el tubo interior y el caliente por el ánulo, cada uno de un solo tono (la rampa va de 0, frío, a 1, caliente)
const cte = (v) => Array(61).fill(v);
const ESTADO = { Tlo: 0, Thi: 1, steam: false, contra: true, tLegIn: 2.5, tLegAn: 3.5, prof: { shell: cte(0.75), tubes: [cte(0.25)] } };
const { svg, css: cssVivo } = colores(await capturar({
  svg: SVG, data: DATA, figJs: readFileSync(join(AQUI, 'out/fig.js'), 'utf8'), clase: 'FDouble', estado: ESTADO, quitar: ['.dp-dash', '.dp-dots'],
}));
const cuerpo = cuerpoDe(svg);
const CSS = readFileSync(join(AQUI, 'dp.css'), 'utf8') + cssVivo + CSS_PERSONA;

if (process.argv.includes('--lamina')) {
  await lamina({ nombre: 'doble-tubo', ingles: 'double-pipe', descripcion: DESCRIPCION_EN, cuerpo, css: CSS, rotular: (letra) => rotulado(svg, P, ANCLAS, ROTULOS_EN, { letra }) });
} else {
  const R = conLetra((letra) => rotulado(svg, P, ANCLAS, ROTULOS, { letra }));
  libro({ aqui: AQUI, nombre: 'doble-tubo', titulo: 'Doble tubo', descripcion: DESCRIPCION, cuerpo, css: CSS, trazos: R.trazos, caja: R.caja, letra: R.letra });
}
