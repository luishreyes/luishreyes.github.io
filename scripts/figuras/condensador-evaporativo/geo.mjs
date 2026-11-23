/* Medidas del condensador evaporativo (capítulo 26 del libro de operaciones unitarias). Unidades: 1 = 1 mm. z hacia
   arriba, desde el piso; el largo de la caja va a lo largo de x, el ancho a lo largo de y, y el centro de la planta en
   x = y = 0. El lector mira desde +x, +y: ve el costado largo de +y, que se quitó (el panel entero, del fondo de la
   bandeja al techo), y el extremo de +x, entero, con las conexiones, las persianas y la bomba.
   Las medidas del caso y la fuente de cada pieza están en notas/figuras-isometricas.md del libro. Lo demás (espesores,
   alturas, pasos, separaciones, la caja, el ventilador, la bomba) es dibujo: una elección plausible, no un dato. Las
   bridas siguen ASME B16.5, clase 150, como en las demás figuras. */
export const CE = {
  AZ: 58, EL: 22,
  X: 1500, Y: 900, t: 4,                   // media caja por fuera (3,0 m × 1,8 m) y la lámina (dibujada de 4 mm)
  zPad: 150,                               // la losa de concreto
  pad: { x0: -1700, x1: 1700, y0: -1100, y1: 1100 },
  beam: { y: [-650, 650], h: 150, b: 100, tf: 9, tw: 6, x0: -1560, x1: 1560 },   // dos vigas I bajo la bandeja
  zFloor: 300,                             // fondo de la bandeja (cara de abajo)
  zRim: 800,                               // borde de la bandeja y comienzo de las persianas
  zWater: 600,                             // el agua de la bandeja
  zLouv: 1500,                             // tope de las persianas
  zDeck: 3450,                             // el techo de la caja (cara de abajo)
  /* el haz: circuitos en zigzag en planos verticales y = constante, de tubo de 26,7 mm; cada paso baja 1 en 100 en el
     sentido del flujo y las curvas en U, de 40 mm de radio, unen un paso con el siguiente */
  coil: { xR: 1280, xL: -1280, R: 40, ro: 13.35, n: 10, nc: 32, py: 52, z0: 2660, drop: 26 },
  hdr: { x: 1320, zTop: 2760, zBot: 1590, yEnd: 875 },   // cabezales: de entrada (3 in) y de salida (2 in)
  /* las conexiones de la caja (en el extremo de +x): el vapor y el líquido detrás del centro, el agua del
     distribuidor y la de la bomba adelante */
  yRef: -350, ySpray: 450, yPump: 450, yMake: 750,
  sup: { x: [-1150, 1150], h: 80, b: 50, t: 6 },          // los dos ángulos que cargan el haz
  /* el distribuidor de agua: un cabezal a lo largo de y junto al extremo de +x y cinco ramales a lo largo de x, con
     seis boquillas cada uno */
  spray: { x: 1380, z: 2950, branches: [-720, -360, 0, 360, 720], nozzles: [-1150, -690, -230, 230, 690, 1150], xEnd: -1380 },
  elim: { z0: 3060, z1: 3210, yF: 890, pitch: 30 },       // los eliminadores de gotas: hojas en V a lo largo de y
  /* el ventilador: chimenea de 1,53 m por dentro sobre el techo, el ventilador axial de seis aspas y la malla */
  stack: { r: 765, tw: 3, h: 800, fl: 50, ft: 10 },
  fan: { z: 4040, hub: 140, hubH: 70, tip: 740, chord: 230, t: 6, pitch: 16, n: 6 },
  /* el motor, por fuera de la chimenea, con la correa en su guarda */
  motor: { deg: 18, r: 985, R: 115, L: 380, zBelt: 3885 },
  pump: { x: 2060, z: 420, R: 165, W: 120 },               // la bomba de recirculación: el eje a lo largo de x
  persona: { x: -2150, y: 380, rumbo: -10 },
};
/* tubo cédula 40 y bridas deslizantes ASME B16.5 clase 150: radio exterior e interior del tubo, radio y espesor de la
   brida, radio del círculo de pernos y número de pernos */
export const DN = {
  15: { ro: 10.65, ri: 7.9, fl: 44.45, ft: 11.2, bc: 30.15, nb: 4 },
  25: { ro: 16.7, ri: 13.3, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  40: { ro: 24.15, ri: 20.45, fl: 63.5, ft: 17.5, bc: 49.2, nb: 4 },
  50: { ro: 30.15, ri: 26.25, fl: 76.2, ft: 19.1, bc: 60.35, nb: 4 },
  65: { ro: 36.5, ri: 31.35, fl: 89, ft: 22.4, bc: 69.85, nb: 4 },
  80: { ro: 44.45, ri: 38.95, fl: 95.25, ft: 23.9, bc: 76.2, nb: 4 },
};
// la altura de un paso del haz: el paso i empieza en zs(i) (en el extremo de donde viene) y termina drop más abajo
export const zs = (i) => CE.coil.z0 - i * (2 * CE.coil.R + CE.coil.drop);
export const ze = (i) => zs(i) - CE.coil.drop;
// la y de cada circuito, de atrás (−y) hacia adelante
export const yCirc = (j) => (j - (CE.coil.nc - 1) / 2) * CE.coil.py;
// la z del eje de un paso a lo largo de x (el paso par va hacia −x y el impar hacia +x)
export function zPass(i, x) {
  const { xR, xL, R } = CE.coil, a = xR + R, b = xL - R;
  const u = i % 2 === 0 ? (a - x) / (a - b) : (x - b) / (a - b);
  return zs(i) - CE.coil.drop * u;
}
// el área de afuera del haz (para la nota): los pasos rectos, las curvas y los niples de los cabezales
export function areaHaz() {
  const { xR, xL, R, ro, n, nc } = CE.coil;
  const paso = Math.hypot(xR - xL + 2 * R, CE.coil.drop) - 2 * R, curva = Math.PI * R;
  const largo = nc * (n * paso + (n - 1) * curva + 2 * (Math.PI * R) / 2);
  return { largo, area: 2 * Math.PI * ro * largo };
}
