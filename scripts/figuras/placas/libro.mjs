// El intercambiador de placas con juntas con los nombres de sus piezas, para el capítulo 22 del libro de operaciones
// unitarias (Heat exchangers, 22.8: intercambiadores de placas):
//
//   node build.mjs --libro --audit
//   node libro.mjs [--salida ../../../../libro-operaciones-unitarias/libro]
//   CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina [ruta/plate-exchanger.svg]
//
// Toma la figura del explorador con la persona de referencia (out/placas-libro.svg, de build.mjs --libro), la abre en
// Chromium con el código vivo del explorador (out/fig.js) y un estado quieto en contracorriente: cada canal del caliente
// en dos tonos de la rampa de la paleta (el más oscuro arriba, por donde entra) y cada canal del frío en dos tonos del
// frío (el más oscuro abajo, por donde entra); quita los puntos que corren por los canales. Sin --lamina escribe
// figuras/intercambiadores-de-calor/_placas.qmd en el libro (y out/libro-preview.html para revisarla); con --lamina, la
// lámina de la edición en inglés, en/figuras/22/plate-exchanger.svg. Lo común está en ../intercambiador/libro-comun.mjs.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CSS_PERSONA } from '../persona.mjs';
import { capturar, colores, cuerpoDe, rotulado, conLetra, libro, lamina } from '../intercambiador/libro-comun.mjs';
import { ROTULOS, ROTULOS_EN, DESCRIPCION, DESCRIPCION_EN } from './rotulos.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
for (const f of ['placas-libro.svg', 'placas-libro.json', 'fig.js']) if (!existsSync(join(AQUI, 'out', f))) throw new Error(`Falta out/${f}: corra antes node build.mjs --libro`);
const SVG = readFileSync(join(AQUI, 'out/placas-libro.svg'), 'utf8');
const DATA = JSON.parse(readFileSync(join(AQUI, 'out/placas-libro.json'), 'utf8'));
const P = DATA.P, ANCLAS = DATA.anclas;

// el perfil va de arriba (índice 0) abajo; la mitad de arriba de un tono y la de abajo de otro, partidas entre dos de
// las 16 franjas de cada canal (así ninguna franja cae entre dos tonos). La rampa va de 0 (frío) a 1 (caliente).
const dos = (arriba, abajo) => [...Array(21).fill(arriba), ...Array(20).fill(abajo)];
const ESTADO = { hotShell: true, Tlo: 0, Thi: 1, steam: false, tPass: 4, prof: { shell: dos(1, 0.75), tubes: [dos(0.25, 0)] } };
const { svg, css: cssVivo } = colores(await capturar({
  svg: SVG, data: DATA, figJs: readFileSync(join(AQUI, 'out/fig.js'), 'utf8'), clase: 'FPlate', estado: ESTADO, quitar: ['.pl-dots'],
}));
const cuerpo = cuerpoDe(svg);
const CSS = readFileSync(join(AQUI, 'pl.css'), 'utf8') + cssVivo + CSS_PERSONA;

if (process.argv.includes('--lamina')) {
  await lamina({ nombre: 'placas', ingles: 'plate-exchanger', descripcion: DESCRIPCION_EN, cuerpo, css: CSS, rotular: (letra) => rotulado(svg, P, ANCLAS, ROTULOS_EN, { letra }) });
} else {
  const R = conLetra((letra) => rotulado(svg, P, ANCLAS, ROTULOS, { letra }));
  libro({ aqui: AQUI, nombre: 'placas', titulo: 'Intercambiador de placas', descripcion: DESCRIPCION, cuerpo, css: CSS, trazos: R.trazos, caja: R.caja, letra: R.letra });
}
