// El florentino con los nombres de sus piezas, para el capítulo 17 del libro de operaciones unitarias (Sedimentación
// y decantación):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Escribe figuras/sedimentacion-y-decantacion/_florentino.qmd con el SVG del skill anatomy y los rótulos (línea y punto,
// como el filtro de arena y el tanque agitado), y out/libro-preview.html para revisarla en el navegador. Cada rótulo
// va en su lugar (x, y del texto en unidades del dibujo), a la izquierda o a la derecha de la pieza; un texto con
// «\n» va en dos renglones y la línea llega al primero. La persona de referencia (la que pone build.mjs) lleva su rótulo,
// «Persona de 1,75 m», y no sale en la lámina inglesa (ver más abajo).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
// los colores de las piezas salen de la paleta del libro (estilo/paleta.json), como en todas sus figuras
import { aplicarPaleta } from '../paleta-libro.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/sedimentacion-y-decantacion');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/florentino_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas de sus trazos (relativas después del primer punto); sin los patrones.
// Se mide dos veces: con la persona de referencia (la vista de la web) y sin ella (la lámina inglesa, abajo).
function contorno(texto) {
  const absol = [];
  for (const m of texto.replace(/<defs>[\s\S]*?<\/defs>/, '').matchAll(/ d="M(-?[\d.]+)[ ,]?(-?\.?[\d.]+)((?:[lmz][^"]*)?)"/g)) {
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
  return [Math.min(...absol.map((p) => p[0])), Math.min(...absol.map((p) => p[1])), Math.max(...absol.map((p) => p[0])), Math.max(...absol.map((p) => p[1]))];
}
const iPer = svg.indexOf('<g class="it" data-name="persona"'), fPer = svg.indexOf('<g class="it"', iPer + 10);
if (iPer < 0) throw new Error('Falta la persona en out/fig.svg: corra antes node build.mjs');
const [minX, minY, maxX, maxY] = contorno(svg);
const sinPersona = contorno(svg.slice(0, iPer) + (fPer > 0 ? svg.slice(fPer) : '</g></svg>'));
if (process.argv.includes('--anclas')) {
  console.log('dibujo', r1(minX), r1(minY), r1(maxX), r1(maxY));
  for (const [a, p] of Object.entries(ANCLAS)) { const [x, y] = k.iso(p, P); console.log(a.padEnd(16), r1(x), r1(y)); }
}

const letra = 13, renglon = letra * 1.2, ancho = (t) => t.length * letra * 0.55;
// [ancla, texto, x, y del texto (primer renglón), lado: 'der' (la línea llega por la izquierda del texto) o 'izq', clase]
const RS = [
  ['ENTRADA', 'Entrada del condensado', 130, 16, 'der'],
  ['VENTEO', 'Venteo', 330, 80, 'der'],
  ['REBOSE', 'Rebose del aceite\n(al recibo)', -12, 112, 'izq'],
  ['PURGA', 'Purga de la\ninterfase', -12, 214, 'izq'],
  ['ACEITE', 'Capa de aceite', -12, 268, 'izq'],
  ['INTERFASE', 'Interfase', -12, 300, 'izq'],
  ['CALMA', 'Tubo de calma', 100, 330, 'izq'],
  ['GOTAS', 'Gotas de aceite\nque suben', 100, 380, 'izq'],
  ['DEFLECTOR', 'Deflector', 100, 432, 'izq'],
  ['HIDRO_IN', 'Hidrolato (agua)', 100, 482, 'izq'],
  ['PATAS', 'Patas', 100, 722, 'izq'],
  ['DRENAJE', 'Drenaje', 240, 800, 'der'],
  ['ROMPESIFON', 'Rompe-sifón', 480, 165, 'der'],
  ['CODO', 'Codo de rebose', 480, 200, 'der'],
  ['AJUSTE', 'Tramo ajustable', 480, 290, 'der'],
  ['PIERNA', 'Pierna del agua', 480, 390, 'der'],
  ['HIDROLATO', 'Salida del\nhidrolato', 480, 470, 'der'],
  ['MIRILLA', 'Mirilla', 356, 292, 'der'],
  ['TIERRA', 'Puesta\na tierra', 335, 512, 'der'],
  ['CALDERA', 'A la caldera', 520, 738, 'der'],
  ['DESAGUE', 'Al desagüe', 440, 760, 'izq'],
  // la persona de referencia, a la derecha de las válvulas del hidrolato: el rótulo, arriba a la izquierda de la cabeza.
  // Los dos llevan la clase solo-es (ver abajo, la lámina inglesa)
  ['PERSONA', 'Persona de 1,75 m', 660, 120, 'izq', 'solo-es'],
];
let trazos = '', bx0 = minX, bx1 = maxX, by0 = minY, by1 = maxY;
let [ex0, ey0, ex1, ey1] = sinPersona;     // el recorte de la lámina inglesa: sin la persona ni su rótulo
for (const [a, t, tx, ty, lado, clase] of RS) {
  if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a}`);
  const [ax, ay] = k.iso(ANCLAS[a], P);
  const lineas = t.split('\n'), w = Math.max(...lineas.map(ancho)), der = lado === 'der';
  const ex = der ? tx - 5 : tx + 5, ey = ty - letra * 0.35;
  const tspans = lineas.map((l, i) => `<tspan x="${tx}" dy="${i ? renglon : 0}">${l}</tspan>`).join('');
  const rot = `<path class="rot-linea" d="M${r1(ax)} ${r1(ay)}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r1(ax)}" cy="${r1(ay)}" r="3"/>` +
    `<text class="rot-texto" x="${tx}" y="${ty}" text-anchor="${der ? 'start' : 'end'}" font-size="${letra}">${tspans}</text>`;
  trazos += clase ? `<g class="${clase}">${rot}</g>` : rot;
  bx0 = Math.min(bx0, der ? tx : tx - w); bx1 = Math.max(bx1, der ? tx + w : tx);
  by0 = Math.min(by0, ty - letra); by1 = Math.max(by1, ty + (lineas.length - 1) * renglon + 4);
  if (clase !== 'solo-es') {
    ex0 = Math.min(ex0, der ? tx : tx - w); ex1 = Math.max(ex1, der ? tx + w : tx);
    ey0 = Math.min(ey0, ty - letra); ey1 = Math.max(ey1, ty + (lineas.length - 1) * renglon + 4);
  }
}
const vx = Math.floor(bx0 - 10), vw = Math.ceil(bx1 + 10 - vx), vy = Math.floor(by0 - 8), vh = Math.ceil(by1 + 10 - vy);
/* La lámina inglesa: en/herramientas/figuras-17.mjs copia esta figura del libro web dentro de #impresion, y debe salir
   como antes. Allí la persona y su rótulo (clase solo-es) no se ven. El SVG conserva el recorte de antes (viewBox) y la
   persona, que queda a la derecha, se pinta en un relleno a la derecha del SVG (padding-right, con overflow visible):
   en la web el dibujo ocupa lo mismo que con el recorte ancho, y dentro de #impresion el relleno vale 0, así que el
   recorte de antes llena el ancho de la lámina. Como el relleno en % se mide sobre el ancho de la columna y no sobre el
   del SVG, en el teléfono, donde el SVG no baja de 640 px (estilo/libro.scss), el relleno no baja de esa parte de 640.
   Para todo esto la persona solo puede ensanchar el recorte por la derecha. */
const ux = Math.floor(ex0 - 10), uw = Math.ceil(ex1 + 10 - ux), uy = Math.floor(ey0 - 8), uh = Math.ceil(ey1 + 10 - uy);
if (ux !== vx || uy !== vy || uh !== vh) throw new Error(`La persona cambió el recorte por la izquierda, por arriba o por abajo (${vx} ${vy} ${vw} ${vh} contra ${ux} ${uy} ${uw} ${uh}): la lámina inglesa ya no saldría igual`);
const MIN = 640, parte = (vw - uw) / vw;
const relleno = vw > uw ? ` style="box-sizing:border-box;min-width:${MIN}px;padding-right:max(${(100 * parte).toFixed(4)}%,${(MIN * parte).toFixed(2)}px)"` : '';
const impresion = '<style>#impresion .solo-es{display:none}#impresion svg.recorte-ingles{padding-right:0 !important;min-width:0 !important}</style>';
const etiqueta = 'Florentino de la planta de aceite esencial de cáscara de cítricos, en isométrico y en corte. ' +
  'Un recipiente vertical de acero inoxidable de 0,60 m de diámetro y 1,2 m de alto, con fondo plano sobre tres patas y una tapa plana empernada; se le quitó la mitad que mira al lector por encima del fondo, que queda entero. ' +
  'El condensado del arrastre de vapor llega por un tubo desde el condensador y entra por la tapa a un tubo de calma más ancho que baja hasta unos 550 mm del fondo; bajo su boca, un platillo deflector abre el chorro hacia los lados, debajo de la capa de aceite. ' +
  'Adentro hay tres capas: abajo el agua, un poco turbia, con gotas de aceite que suben y se juntan bajo la interfase; encima una capa de aceite ámbar de 100 mm entre la interfase y el rebose; y arriba el espacio de cabeza. Dentro del tubo de calma solo hay agua, con su nivel un poco más bajo que el aceite. ' +
  'A la izquierda, el rebose del aceite: una boquilla cuyo agujero empieza justo en la superficie del aceite, con su válvula hacia el recibo; debajo, a la altura de la interfase, la purga de la capa sucia, con su válvula. ' +
  'A la derecha, la pierna del agua: un tubo que sale cerca del fondo, baja, da la vuelta en U y sube por fuera hasta un codo un poco más bajo que el rebose del aceite, que fija la interfase; tiene un tramo ajustable con prensaestopas. Del codo sube el rompe-sifón, que entra al espacio de cabeza, y el hidrolato baja a dos válvulas: hacia el alambique y hacia el desagüe. ' +
  'También a la derecha, una mirilla de tubo de vidrio muestra el agua abajo y el aceite arriba, y cerca del fondo un borne con un cable de puesta a tierra que baja a una varilla. En la tapa, el venteo con el codo hacia abajo; en el centro del fondo, el drenaje con su válvula. ' +
  'Unas flechas muestran el condensado que baja por el tubo de calma y sale bajo el deflector, el agua que va hacia la pierna, las gotas que suben y el aceite que va hacia el rebose. ' +
  'A la derecha, pasadas las válvulas del hidrolato, una persona de 1,75 m de pie en el piso da la escala: la cabeza le queda a la altura de la tapa del florentino.';
const cuerpo = aplicarPaleta(svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '').replace(/\sclass="([^"]*)"/, ' class="$1 recorte-ingles"')} viewBox="${ux} ${uy} ${uw} ${uh}"${relleno} role="img" aria-label="${etiqueta}">`)
  .replace('<g class="it" data-name="persona"', '<g class="it solo-es" data-name="persona"')
  .replace(/<\/svg>\s*$/, `${impresion}<g class="rotulos">${trazos}</g></svg>`), 'sedimentacion-y-decantacion/_florentino');
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_florentino.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_florentino.qmd', Math.round(cuerpo.length / 1024), 'KB', 'recorte en la web', vx, vy, vw, vh, '· viewBox (el de la lámina inglesa)', ux, uy, uw, uh);

// una página para revisar la figura con los rótulos: el CSS de las piezas del libro (estilo/anatomia.css) y las reglas
// de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px: se desliza de lado)
const cssLibro = join(LIBRO, 'estilo/anatomia.css');
const css = existsSync(cssLibro) ? readFileSync(cssLibro, 'utf8') : readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Florentino (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:900px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`);
console.log('out/libro-preview.html');
