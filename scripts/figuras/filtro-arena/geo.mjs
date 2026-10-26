/* Medidas del filtro a presión de doble medio del capítulo 15 del libro de operaciones unitarias (Partículas en un
   fluido): el filtro que limpia el agua de servicios de la planta. Unidades: 1 = 1 mm. z hacia arriba, desde el piso;
   el eje del recipiente en x = y = 0. El corte quita lo que mira al lector por encima de la línea de tangencia del
   fondo (y > 0 y z > zt): el fondo queda entero, como una taza, y el resto se ve por el plano y = 0. El medio va
   además escalonado: se quita también el cuarto de atrás a la derecha (x > 0, y < 0), hasta la placa, para que se
   vean las boquillas sobre ella.
   - Del caso del capítulo (figuras/particulas-en-un-fluido/caso.json del libro): diámetro interior de 1,5 m, 0,30 m de
     arena (ES 0,5 mm) sobre la placa, 0,50 m de antracita (ES 1,0 mm) encima y unos 0,60 m de agua libre hasta el
     distribuidor; se lava cuando la caída del lecho llega a unos 50 kPa.
   - De las fuentes: falso fondo de boquillas sin grava de soporte (ahorra unos 0,5 m de altura) y boquillas que dejan
     pasar aire y agua (Crittenden et al., 2012, cap. 11; Perry, 8.ª ed., p. 18-110).
   Lo demás (cabezas 2:1, espesores, boquillas, bridas, patas, distribuidor, rejilla de las boquillas) es dibujo: una
   elección plausible para un filtro a presión de 1,5 m, no un dato. Las bridas siguen ASME B16.5, clase 150. */
export const FA = {
  AZ: 60, EL: 26,
  R: 750, tw: 8, hd: 375,                 // radio interior, pared y profundidad de las cabezas 2:1 (D/4)
  zt: 1080, zt2: 2780,                    // líneas de tangencia del fondo y de la tapa
  /* el falso fondo: placa de 30 mm soldada a la envolvente, 400 mm sobre la tangencia del fondo, con su anillo de apoyo */
  plate: { z0: 1480, t: 30, ring: { w: 55, t: 12 }, weld: 8 },
  sand: 300, anth: 500, free: 600,        // capas del caso y borde libre hasta el distribuidor
  mix: 25,                                // la interfaz arena–antracita: unos centímetros de mezcla (dibujo)
  /* las boquillas: rejilla cuadrada de 130 mm (unas 55 por m²), corrida media rejilla de los dos planos del corte, con
     cabeza ranurada sobre la placa y cola bajo ella, con el agujero del aire cerca de arriba (todo dibujo) */
  noz: { s: 130, edge: 72, sleeve: 17, sh: 9, head: 27, body: 40, dome: 15, tail: 10.5, L: 220, nut: 15, nh: 12, hole: 34 },
  /* el distribuidor de entrada: la boquilla de la tapa entra 110 mm y descarga sobre una placa deflectora de Ø 460,
     colgada de cuatro pletinas de 50 × 8 (dibujo) */
  dist: { r: 230, t: 10, in: 110, bar: [50, 8] },
  /* boquillas y tuberías: DN y posición (dibujo) */
  vent: { r: 270, deg: 200, h: 110 },     // venteo DN 25 cerca de la corona, con su válvula de alivio de aire
  mh: { r: 465, deg: 300, top: 3330 },    // boca de visita DN 400 en la tapa
  side: { deg: -15, air: 1345, hh: 1665 },// en la franja de la derecha: entrada del aire (pleno) y registro de mano
  bot: { r: 300, rb: 320, out: 150, bw: -40, run: 260 },   // salida (DN 100) y entrada del lavado (DN 150) en el fondo
  legs: { r: 600, degs: [-15, 75, 165, 255], a: 80, rp: 57.15, plate: 115, pt: 20 },
  inlet: { z1: 3320, spool: 330, run: 700 },      // la entrada DN 150 en la corona: cara de la brida y tubería
};
/* tubo cédula 40 y bridas deslizantes ASME B16.5 clase 150: radio exterior e interior del tubo, radio y espesor de la
   brida, radio del círculo de pernos y número de pernos */
export const DN = {
  25: { ro: 16.7, ri: 13.3, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  50: { ro: 30.15, ri: 26.25, fl: 76.2, ft: 19.1, bc: 60.35, nb: 4 },
  100: { ro: 57.15, ri: 51.15, fl: 114.3, ft: 23.9, bc: 95.25, nb: 8 },
  150: { ro: 84.15, ri: 77.05, fl: 139.7, ft: 25.4, bc: 120.65, nb: 8 },
  200: { ro: 109.55, ri: 101.35, fl: 171.45, ft: 28.4, bc: 149.25, nb: 8 },
  400: { ro: 203.2, ri: 193.7, fl: 298.45, ft: 36.6, bc: 269.9, nb: 16 },
};
export const RO = FA.R + FA.tw;
export const ZB = FA.zt - FA.hd;                          // polo interior del fondo
export const ZP0 = FA.plate.z0, ZP = FA.plate.z0 + FA.plate.t;   // cara de abajo y de arriba de la placa
export const ZS = ZP + FA.sand, ZA = ZS + FA.anth;        // techo de la arena y de la antracita
export const ZD = ZA + FA.free;                           // cara de abajo de la placa deflectora
export const ZC = FA.zt2 + FA.hd, ZCO = FA.zt2 + FA.hd + FA.tw;   // corona por dentro y por fuera
const sq = (v) => Math.sqrt(Math.max(0, v));
// las cabezas 2:1, por dentro y por fuera
export const zInTop = (r) => FA.zt2 + FA.hd * sq(1 - (r * r) / (FA.R * FA.R));
export const zOutTop = (r) => FA.zt2 + (FA.hd + FA.tw) * sq(1 - (r * r) / (RO * RO));
export const zInBot = (r) => FA.zt - FA.hd * sq(1 - (r * r) / (FA.R * FA.R));
export const zOutBot = (r) => FA.zt - (FA.hd + FA.tw) * sq(1 - (r * r) / (RO * RO));
// las boquillas de la placa: centros (x, y) en la mitad de atrás, corridos media rejilla de x = 0 y de y = 0
export function nozzles() {
  const { s, edge } = FA.noz, out = [];
  for (let i = -8; i < 8; i++) for (let j = 0; j < 8; j++) {
    const x = (i + 0.5) * s, y = -(j + 0.5) * s;
    if (Math.hypot(x, y) <= FA.R - edge) out.push([x, y]);
  }
  return out;
}
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// un cuarto de disco (x ≤ 0, y ≤ 0) de radio r, en (x, y)
export function quarter(r, n = 24) {
  const out = [[0, 0]];
  for (let i = 0; i <= n; i++) { const t = Math.PI + ((Math.PI / 2) * i) / n; out.push([r * Math.cos(t), r * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
