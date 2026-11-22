/* Medidas del extractor de vapor vivo V-201, uno de los cuatro de la batería del arrastre de vapor (capítulo 32 del
   libro de operaciones unitarias). Unidades: 1 = 1 mm. z hacia arriba, desde el piso; el eje del recipiente en x = y = 0.
   El corte es una ventana: se quita lo que mira al lector (y > 0) entre la línea de tangencia del fondo y el borde de
   arriba del aislamiento (zt < z < zw). El fondo queda entero, como una taza, y arriba quedan enteros el cuello, las
   bridas, la tapa y sus abrazaderas. La carga va además escalonada: se quita también el cuarto de atrás a la derecha
   (x > 0, y < 0) hasta la rejilla, para que se vean la rejilla perforada y los termopares.
   Las medidas del caso y la fuente de cada pieza están en notas/figuras-isometricas.md del libro. Lo demás (espesores,
   cabezas 2:1, bridas, abrazaderas, patas, alturas, boquillas) es dibujo: una elección plausible, no un dato. Las
   bridas de las boquillas siguen ASME B16.5, clase 150. */
export const EX = {
  AZ: 60, EL: 24,
  R: 900, tw: 6, hd: 450,                 // radio interior (1,8 m del caso), pared y profundidad de las cabezas 2:1 (D/4)
  ins: 50, clad: 1,                       // lana mineral (el caso) y su chaqueta de lámina
  zt: 1000,                               // línea de tangencia del fondo
  zw: 4200,                               // borde de arriba del aislamiento y de la ventana del corte
  /* el pleno y el distribuidor: un anillo de 2 in a 600 mm del eje, 90 mm sobre la tangencia, con 30 agujeros de 1/8 in
     arriba, alimentado por una boquilla de 2 in en la pared; dos ménsulas lo sostienen en la mitad que queda */
  ring: { r: 600, z: 1090, holes: 30, deg: -20, brackets: [-58, -122, -158], bar: [50, 8] },
  /* la canasta: su fondo es la rejilla (placa perforada de 10 mm con barras de 60 × 10 debajo), apoyada con una junta
     sobre un anillo soldado a la pared; la pared de la canasta es de lámina llena de 4 mm (Guenther) */
  plate: { z0: 1400, t: 10, r: 885, hole: 12, pitch: 40, bars: [-600, -300, 0, 300, 600], barH: 60, barT: 10, barR: 830 },
  ledge: { r0: 840, t: 12 }, gasket: { r0: 845, r1: 882, t: 6 },
  basket: { ri: 881, ro: 885, H: 2730, rim: [36, 10] },
  bed: 2000,                              // altura del lecho (el caso); se hincha un tercio (Guenther)
  /* arriba: la brida del cuerpo, la junta, la brida de la tapa y la tapa 2:1 con su faldón; doce abrazaderas en C */
  flange: { z0: 4300, t: 36, ro: 1010 }, lidGasket: { t: 6, r0: 910, r1: 990 }, lidSkirt: 50,
  clamps: { n: 12, phase: 15, w: 40 },
  /* boquillas de la tapa: el cuello de cisne de 4 in en el centro, el manómetro de ½ in y la válvula de seguridad de
     1½ in; en el cuello, el termómetro de la salida */
  goose: { up: 130, rise: 340, bend: 160, run: 1500, slope: 1 / 50, joint: 300, ti: 80 },
  pi: { deg: 15, r: 640 }, psv: { deg: 140, r: 560 },
  /* tres termopares en el lecho, en la franja de la derecha, a 0,3, 1,0 y 1,7 m sobre la rejilla */
  te: { deg: -9, dz: [300, 1000, 1700], tip: 560, r: 11 },
  /* la línea del vapor vivo (2 in) sale de la boquilla del pleno, radial, con la válvula todo o nada */
  steam: { run: 760 },
  /* la purga del polo (1 in): baja, va hacia la izquierda entre dos patas, válvula, filtro en Y, trampa y embudo */
  purge: { zrun: 230, run: 1280 },
  legs: { r: 650, degs: [15, 105, 195, 285], a: 80, rp: 57.15, plate: 115, pt: 20 },
  /* la persona de referencia (../persona.mjs, 1,75 m): de pie a la izquierda, junto a la trampa y al embudo de la
     purga, que se dejan a la vista para ver si la trampa descarga (Guenther) */
  persona: { x: -1300, y: 1100, rumbo: -35 },
};
/* tubo cédula 40 y bridas deslizantes ASME B16.5 clase 150: radio exterior e interior del tubo, radio y espesor de la
   brida, radio del círculo de pernos y número de pernos */
export const DN = {
  15: { ro: 10.65, ri: 7.9, fl: 44.45, ft: 11.2, bc: 30.15, nb: 4 },
  25: { ro: 16.7, ri: 13.3, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  40: { ro: 24.15, ri: 20.45, fl: 63.5, ft: 17.5, bc: 49.2, nb: 4 },
  50: { ro: 30.15, ri: 26.25, fl: 76.2, ft: 19.1, bc: 60.35, nb: 4 },
  100: { ro: 57.15, ri: 51.15, fl: 114.3, ft: 23.9, bc: 95.25, nb: 8 },
};
export const RO = EX.R + EX.tw;                          // la pared por fuera
export const RW = RO + EX.ins;                           // la lana por fuera
export const RC = RW + EX.clad;                          // la chaqueta por fuera
export const ZB = EX.zt - EX.hd;                         // polo interior del fondo
export const ZP0 = EX.plate.z0, ZP = EX.plate.z0 + EX.plate.t;   // cara de abajo y de arriba de la rejilla
export const ZL = ZP + EX.bed;                           // techo del lecho
export const ZH = ZP + (EX.bed * 4) / 3;                 // el techo del lecho hinchado un tercio
export const ZR = ZP + EX.basket.H;                      // el borde de la canasta
export const ZF0 = EX.flange.z0, ZF1 = ZF0 + EX.flange.t;          // la brida del cuerpo
export const ZG1 = ZF1 + EX.lidGasket.t;                 // la junta
export const ZT0 = ZG1, ZT1 = ZG1 + EX.flange.t;         // la brida de la tapa
export const ZLT = ZT1 + EX.lidSkirt;                    // tangencia de la tapa
const sq = (v) => Math.sqrt(Math.max(0, v));
const HB = EX.hd + EX.tw, HW = HB + EX.ins, HC = HW + EX.clad;
export const HEADS = { HB, HW, HC };
// las cabezas 2:1: por dentro, por fuera, la lana y la chaqueta; el fondo hacia abajo y la tapa hacia arriba
export const zInBot = (r) => EX.zt - EX.hd * sq(1 - (r * r) / (EX.R * EX.R));
export const zOutBot = (r) => EX.zt - HB * sq(1 - (r * r) / (RO * RO));
export const zClBot = (r) => EX.zt - HC * sq(1 - (r * r) / (RC * RC));
export const zInTop = (r) => ZLT + EX.hd * sq(1 - (r * r) / (EX.R * EX.R));
export const zOutTop = (r) => ZLT + HB * sq(1 - (r * r) / (RO * RO));
export const zClTop = (r) => ZLT + HC * sq(1 - (r * r) / (RC * RC));
export const ZPOLO = EX.zt - HC, ZCOR = ZLT + HC;        // el polo y la corona por fuera de la chaqueta
// los agujeros de la rejilla: rejilla cuadrada, dentro del cuarto de atrás a la derecha que se ve (x > 0, y < 0)
export function plateHoles() {
  const { pitch, r, hole } = EX.plate, out = [];
  for (let i = 0; i * pitch < r; i++) for (let j = 0; j * pitch < r; j++) {
    const x = (i + 0.5) * pitch, y = -(j + 0.5) * pitch;
    if (Math.hypot(x, y) <= EX.basket.ri - hole) out.push([x, y]);
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
// un sector de corona entre los ángulos a0 y a1 (radianes), de r0 a r1, en (x, y)
export function sector(r0, r1, a0, a1, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// un cuarto de disco (x ≤ 0, y ≤ 0) de radio r, en (x, y)
export function quarter(r, n = 24) { return sector(0, r, Math.PI, 1.5 * Math.PI, n); }
