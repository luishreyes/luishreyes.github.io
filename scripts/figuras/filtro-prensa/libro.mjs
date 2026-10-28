// El filtro prensa con los nombres de sus piezas, para el capítulo 17 del libro de operaciones unitarias (Filtración):
//
//   CHROME_PATH=/opt/pw-browsers/chromium node build.mjs --audit
//   node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Abre preview.html en Chromium, congela la figura en un instante del ciclo (ESTADO: a mitad de la filtración, con
// la torta a medio crecer en las cámaras, el filtrado bajando por las caras de las placas y la tolva vacía) y escribe
// figuras/filtracion/_prensa.qmd con el SVG del skill anatomy y los rótulos (línea y punto, como la bomba, el
// florentino y el filtro de arena), y out/libro-preview.html para revisarla en el navegador.
//
// Cada rótulo apunta a un punto de la pieza en coordenadas de la prensa (cm; x a lo largo de la prensa, y hacia
// atrás negativo, z hacia arriba; las medidas son las de build.mjs) y su texto va en (x, y) del dibujo, a la
// izquierda o a la derecha del punto; un texto con «\n» va en dos renglones y la línea llega al primero.
// Los colores de la torta, la suspensión y el agua van dentro del SVG (fp.css): estilo/anatomia.css solo trae el kit.
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/filtracion');
if (!existsSync(join(AQUI, 'out/fig.svg')) || !existsSync(join(AQUI, 'preview.html'))) throw new Error('Falta out/: corra antes node build.mjs --audit');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const D = JSON.parse(readFileSync(join(AQUI, 'press_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;

// el instante del ciclo: filtración (fase f) a la mitad; cada torta llena el 70 % de su media cámara, el manómetro
// marca 4,5 bar, el caudal es el 38 % del inicial y el tanque de filtrado va en el 60 % de la mirilla
const ESTADO = { phase: 'f', k: 0.5, fill: 0.7, P: 4.5, P0: 0, Pset: 0, qrel: 0.38, vfrac: 0.6, Td: 8.5, dt: 0 };
const TORTA = [180, 138, 90], SUSPENSION = [201, 183, 156];

const navegador = await chromium.launch({ args: ['--no-sandbox'], ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
const pagina = await navegador.newPage({ viewport: { width: 1400, height: 1000 } });
await pagina.goto(pathToFileURL(join(AQUI, 'preview.html')).href + '?t=0');
await pagina.waitForTimeout(300);
const { svg, caja } = await pagina.evaluate(([estado, torta, susp]) => {
  const fp = window.__fp;
  fp.reset(); fp.colors(torta, susp); fp.update(estado);
  const raiz = fp.svg;
  // sin las transiciones (en una figura quieta no hacen nada) y sin los datos que solo usa el código en vivo
  raiz.querySelectorAll('[data-live]').forEach((el) => { el.style.removeProperty('transition'); });
  const b = raiz.querySelector('.fp-items').getBBox();
  const copia = raiz.cloneNode(true);
  copia.querySelectorAll('.it').forEach((el) => { el.removeAttribute('data-k'); el.removeAttribute('data-m'); el.removeAttribute('data-piece'); });
  copia.querySelectorAll('[data-live]').forEach((el) => { if (!el.innerHTML && el.tagName === 'g') el.remove(); });
  return { svg: copia.outerHTML, caja: [b.x, b.y, b.width, b.height] };
}, [ESTADO, TORTA, SUSPENSION]);
await navegador.close();

const letra = 9.5, renglon = letra * 1.2, ancho = (t) => t.length * letra * 0.56;
// medidas de build.mjs para los puntos
const PT = D.PT, X0 = D.X0, ZC = D.ZC, ZF = D.ZF, webX = (i) => X0 + i * PT + PT / 2;
// [punto de la pieza (cm), texto, x, y del texto (primer renglón), lado: 'der' (la línea llega por la izquierda del texto) o 'izq']
const RS = [
  [[-80, -33, 70], 'Tanque de suspensión\ncon agitador', 118, 78, 'der'],
  [[-11, 2.4, 106.5], 'Manómetro', 196, 112, 'izq'],
  [[5, -8, 133], 'Cabezal fijo', 222, 44, 'izq'],
  [[webX(6), -20, 127], 'Placas de cámara', 430, 44, 'der'],
  [[74, -20, 131], 'Cabezal móvil', 430, 60, 'der'],
  [[110, -47, 122], 'Barra lateral', 480, 76, 'izq'],
  [[135.5, -38, 133], 'Cabezal trasero', 560, 70, 'der'],
  [[webX(6) + D.WEB / 2 - 0.3, 0, 118], 'Tela filtrante', 418, 114, 'der'],
  [[61, 0, 100], 'Torta', 418, 132, 'der'],
  [[webX(7), -1.5, ZC], 'Canal central de\nalimentación', 418, 152, 'der'],
  [[100, 0, ZC + 3.4], 'Vástago', 448, 222, 'der'],
  [[66, -0.9, ZF], 'Canal de filtrado', 408, 244, 'der'],
  [[145.4, -2, ZC + 4], 'Pistón', 575, 128, 'der'],
  [[158, -8.4, ZC + 1], 'Cilindro\nhidráulico', 575, 150, 'der'],
  [[160, -8, 10], 'Central hidráulica', 600, 418, 'izq'],
  [[128, -8, 30], 'Tolva', 510, 400, 'der'],
  [[70, 0, 10.4], 'Banda transportadora', 390, 396, 'der'],
  [[-14.4, 0.4, 28], 'Tanque de\nfiltrado', 170, 205, 'izq'],
  [[-4.17, 4.52, 20], 'Mirilla', 246, 360, 'der'],
  [[-42, 10, 26], 'Bomba neumática\nde doble diafragma', 120, 372, 'der'],
  [[-51, 24.7, 16], 'Línea de aire\ncomprimido', 82, 372, 'izq'],
];

let trazos = '';
let [bx0, by0, bw, bh] = caja, bx1 = bx0 + bw, by1 = by0 + bh;
for (const [p, t, tx, ty, lado] of RS) {
  const [ax, ay] = k.iso(p, D.P);
  const lineas = t.split('\n'), w = Math.max(...lineas.map(ancho)), der = lado === 'der';
  const ex = der ? tx - 4 : tx + 4, ey = ty - letra * 0.35;
  const tspans = lineas.map((l, i) => `<tspan x="${tx}" dy="${i ? renglon : 0}">${l}</tspan>`).join('');
  trazos += `<path class="rot-linea" d="M${r1(ax)} ${r1(ay)}L${r1(ex)} ${r1(ey)}"/><circle class="rot-punto" cx="${r1(ax)}" cy="${r1(ay)}" r="2.2"/>` +
    `<text class="rot-texto" x="${tx}" y="${ty}" text-anchor="${der ? 'start' : 'end'}" font-size="${letra}">${tspans}</text>`;
  bx0 = Math.min(bx0, der ? tx : tx - w); bx1 = Math.max(bx1, der ? tx + w : tx);
  by0 = Math.min(by0, ty - letra); by1 = Math.max(by1, ty + (lineas.length - 1) * renglon + 4);
}
const vx = Math.floor(bx0 - 6), vw = Math.ceil(bx1 + 6 - vx), vy = Math.floor(by0 - 6), vh = Math.ceil(by1 + 6 - vy);
const etiqueta = 'Filtro prensa de placas de cámara, en isométrico, a mitad de la filtración. ' +
  'El cabezal fijo, las ocho placas, el cabezal móvil y la tolva van en media sección por el eje, sin la barra lateral de adelante; lo demás va entero. ' +
  'A la izquierda, un tanque de suspensión con agitador sobre tres patas; de su fondo sale la succión hacia una bomba neumática de doble diafragma, con sus dos cámaras a los lados del cuerpo central y la línea de aire comprimido que baja a una toma en el piso. ' +
  'La descarga de la bomba sube y entra por el centro del cabezal fijo; en ella va un manómetro. ' +
  'La suspensión recorre el canal central de alimentación, que atraviesa todas las placas, y llena las cámaras. En cada cámara crece una torta parda desde las dos telas filtrantes, una en cada cara de las placas, y entre las dos tortas queda suspensión. ' +
  'El filtrado atraviesa la torta y la tela, baja por la cara de las placas (unas líneas de trazos lo muestran) y sale por el canal de filtrado, abajo, hacia un tanque de filtrado con mirilla, lleno hasta poco más de la mitad. ' +
  'Las placas cuelgan de la barra lateral y las aprieta el cabezal móvil, empujado por el vástago de un cilindro hidráulico abierto, con su pistón adentro, montado en el cabezal trasero; las mangueras del cilindro bajan a la central hidráulica, con su tanque, su bloque de válvulas y su motor. ' +
  'Debajo de las placas, una tolva sin fondo deja caer la torta en la descarga sobre una banda transportadora entre dos tambores; ahora está vacía.';
const fpcss = readFileSync(join(AQUI, 'fp.css'), 'utf8').replace(/;transition:[^;}]*/g, '').replace(/\n/g, '');
const cuerpo = svg
  .replace(/<svg([^>]*)>/, (_, at) => `<svg${at.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}"><style>${fpcss}</style>`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`);
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_prensa.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('figuras/filtracion/_prensa.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos: la letra y el CSS de las piezas del libro (estilo/fuentes.css y
// estilo/anatomia.css) y las reglas de .iso-libro de estilo/libro.scss (en el teléfono la figura no baja de 640 px:
// se desliza de lado)
const est = pathToFileURL(join(LIBRO, 'estilo')).href;
writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Filtro prensa (libro)</title>
<link rel="stylesheet" href="${est}/fuentes.css"><link rel="stylesheet" href="${est}/anatomia.css"><style>
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{max-width:820px;margin:20px auto;padding:0 16px}
.iso-libro{overflow-x:auto;overflow-y:hidden}.iso-libro svg{display:block;width:100%;min-width:640px;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-family:"Archivo Variable",system-ui,sans-serif;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`);
console.log('out/libro-preview.html');
