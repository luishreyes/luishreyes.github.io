// El tanque agitado con los nombres de sus piezas, para el capítulo 13 del libro de operaciones unitarias (Agitación):
//
//   node build.mjs && node libro.mjs --salida ../../../../libro-operaciones-unitarias/libro
//
// Escribe figuras/agitacion/_tanque-agitado.qmd con el SVG del skill anatomy y los rótulos (línea y punto, como la
// válvula de control), y out/libro-preview.html para revisarla en el navegador.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const LIBRO = resolve(arg('--salida', join(AQUI, '../../../../libro-operaciones-unitarias/libro')));
const DEST = join(LIBRO, 'figuras/agitacion');
if (!existsSync(join(AQUI, 'out/fig.svg'))) throw new Error('Falta out/: corra antes node build.mjs');
const KIT = fileURLToPath(new URL('../../../.claude/skills/anatomy', import.meta.url));
const k = await import(KIT + '/kit/iso-kit.mjs');
const { P, ANCLAS } = JSON.parse(readFileSync(join(AQUI, 'out/tanque_data.json'), 'utf8'));
const r1 = (v) => Math.round(v * 10) / 10;
const svg = readFileSync(join(AQUI, 'out/fig.svg'), 'utf8');

// el contorno del dibujo, de las coordenadas absolutas de sus trazos (el primer punto de cada trazo y las tuercas)
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
const minX = Math.min(...absol.map((p) => p[0])), maxX = Math.max(...absol.map((p) => p[0]));
const minY = Math.min(...absol.map((p) => p[1])), maxY = Math.max(...absol.map((p) => p[1]));

const letra = 13, paso = letra * 1.7, ancho = (t) => t.length * letra * 0.56;
// [ancla, lado, texto]; cada lado se ordena por la altura del punto, así las líneas no se cruzan
const RS = [
  ['FEED', 'izq', 'Entrada de cáscara'],
  ['WATER', 'izq', 'Entrada de agua'],
  ['TW', 'izq', 'Termopozo'],
  ['TANQUE', 'izq', 'Tanque'],
  ['CHAQUETA', 'izq', 'Camisa'],
  ['NIVEL', 'izq', 'Nivel del líquido'],
  ['EJE', 'izq', 'Eje'],
  ['IMPULSOR', 'izq', 'Impulsor de palas inclinadas'],
  ['PATAS', 'izq', 'Patas'],
  ['VALVE', 'izq', 'Salida y válvula de fondo'],
  ['MOTOR', 'der', 'Motor'],
  ['REDUCTOR', 'der', 'Reductor'],
  ['LINTERNA', 'der', 'Linterna'],
  ['SELLO', 'der', 'Sello mecánico'],
  ['MH', 'der', 'Boca de hombre'],
  ['DEFLECTOR', 'der', 'Bafle'],
  ['CHAQ_IN', 'der', 'Entrada de vapor a la camisa'],
  ['CHAQ_OUT', 'der', 'Salida de condensado'],
];
const xIzq = minX - 24, xDer = maxX + 24;
const lados = { izq: [], der: [] };
for (const [a, lado, t] of RS) {
  if (!ANCLAS[a]) throw new Error(`Falta el ancla ${a}`);
  const [ax, ay] = k.iso(ANCLAS[a], P);
  lados[lado].push({ a, t, ax: r1(ax), ay: r1(ay) });
}
// alturas de los textos: tan cerca de su punto como se pueda, sin encimarse y dentro del alto del dibujo
for (const lista of Object.values(lados)) {
  lista.sort((p, q) => p.ay - q.ay);
  lista.forEach((r) => (r.y = r.ay));
  for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + paso);
  const tope = maxY - 4;
  if (lista.length && lista[lista.length - 1].y > tope) { lista[lista.length - 1].y = tope; for (let i = lista.length - 2; i >= 0; i--) lista[i].y = Math.min(lista[i].y, lista[i + 1].y - paso); }
  const piso = minY + 12;
  if (lista.length && lista[0].y < piso) { lista[0].y = piso; for (let i = 1; i < lista.length; i++) lista[i].y = Math.max(lista[i].y, lista[i - 1].y + paso); }
}
const trazo = (r, izq) => {
  const x = izq ? xIzq : xDer, fin = izq ? x + 5 : x - 5;
  return `<path class="rot-linea" d="M${r.ax} ${r.ay}L${r1(fin)} ${r1(r.y)}"/><circle class="rot-punto" cx="${r.ax}" cy="${r.ay}" r="2.6"/>` +
    `<text class="rot-texto" x="${r1(x)}" y="${r1(r.y + letra * 0.35)}" text-anchor="${izq ? 'end' : 'start'}" font-size="${letra}">${r.t}</text>`;
};
const trazos = lados.izq.map((r) => trazo(r, true)).join('') + lados.der.map((r) => trazo(r, false)).join('');

const izqAncho = Math.max(...lados.izq.map((r) => ancho(r.t))), derAncho = Math.max(...lados.der.map((r) => ancho(r.t)));
const vx = Math.floor(xIzq - izqAncho - 10), vw = Math.ceil(xDer + derAncho + 10 - vx), vy = Math.floor(minY - 10), vh = Math.ceil(maxY + 12 - vy);
const etiqueta = 'Tanque agitado de acero inoxidable para extraer pectina de la cáscara de cítricos, en isométrico y en corte. ' +
  'El tanque, de 2,5 m de diámetro, tiene fondo y tapa elípticos y está lleno de agua con trozos de cáscara hasta 3 m sobre el fondo. ' +
  'Se le quitó la mitad que mira al lector por encima del fondo: se ven, cortadas, la pared del tanque, la camisa de calentamiento que la envuelve en la parte cilíndrica, la tapa y la boquilla del agitador. ' +
  'Adentro, el eje baja por el centro hasta una turbina de cuatro palas inclinadas a 45 grados, de un tercio del diámetro del tanque y a un cuarto del diámetro sobre el fondo. ' +
  'Cuatro bafles verticales de un décimo del diámetro, a 90 grados entre sí y separados un poco de la pared, rompen el giro del líquido: dos van cortados en el plano del corte, uno entero atrás y el cuarto se fue con la mitad quitada. ' +
  'Flechas en el plano del corte muestran el patrón de flujo axial: el líquido baja por el centro empujado por la turbina, se abre por el fondo, sube junto a la pared y vuelve hacia el eje bajo la superficie. ' +
  'La superficie del líquido es plana y un termopozo baja desde la tapa hasta debajo del nivel. ' +
  'Arriba, sobre la boquilla del agitador, van la brida de montaje, el sello mecánico, la linterna de cuatro columnas con el acople rígido adentro, el reductor de ejes en ángulo y el motor eléctrico horizontal. ' +
  'En la tapa están la boquilla de entrada de la cáscara, con un ramal para el agua, el termopozo y la boca de hombre con su tapa empernada. ' +
  'A la derecha, en la camisa, la entrada de vapor arriba y la salida de condensado abajo. ' +
  'El tanque se apoya en cuatro patas soldadas al fondo; en el centro del fondo sale la descarga con su válvula de bola y un tubo hacia un lado.';
const cuerpo = svg
  .replace(/<svg([^>]*)>/, (_, a) => `<svg${a.replace(/\s(id|viewBox|aria-label|role|width|height)="[^"]*"/g, '')} viewBox="${vx} ${vy} ${vw} ${vh}" role="img" aria-label="${etiqueta}">`)
  .replace(/<\/svg>\s*$/, `<g class="rotulos">${trazos}</g></svg>`);
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, '_tanque-agitado.qmd'), '```{=html}\n<div class="iso iso-libro" data-theme="light">' + cuerpo + '</div>\n```\n');
console.log('_tanque-agitado.qmd', Math.round(cuerpo.length / 1024), 'KB', 'viewBox', vx, vy, vw, vh);

// una página para revisar la figura con los rótulos, con el CSS de las piezas y el de los rótulos del libro
const css = readFileSync(join(AQUI, 'out/fig.css'), 'utf8').replace(/\.iso\[data-theme="light"\]\{/, '.iso,.iso[data-theme="light"]{');
writeFileSync(join(AQUI, 'out/libro-preview.html'), `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Tanque agitado (libro)</title><style>${css}
body{margin:0;background:#fff;font-family:"Archivo Variable",system-ui,sans-serif}.marco{width:900px;margin:20px auto}
.iso-libro svg{display:block;width:100%;height:auto;overflow:visible}
.iso-libro .rot-linea{fill:none;stroke:#19222F;stroke-width:.8px}.iso-libro .rot-punto{fill:#FFF500;stroke:#19222F;stroke-width:1px}
.iso-libro .rot-texto{fill:#19222F;font-weight:600;paint-order:stroke;stroke:rgba(255,255,255,.9);stroke-width:.28em;stroke-linejoin:round}</style></head>
<body><div class="marco"><div class="iso iso-libro" data-theme="light">${cuerpo}</div></div></body></html>`);
console.log('out/libro-preview.html');
