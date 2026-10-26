/* Medidas del tanque agitado del capítulo 13 del libro de operaciones unitarias (Agitación): el reactor de extracción
   de pectina de la cáscara de cítricos. Unidades: 1 = 1 mm. z hacia arriba; el eje del tanque en x = y = 0.
   El corte quita lo que mira al lector por encima de la línea de tangencia del fondo (y > 0 y z > zt): el fondo
   queda entero, como una taza, y el resto se ve por el plano y = 0.
   Tanque de acero inoxidable de T = 2500 mm de diámetro interior, fondo y tapa elípticos 2:1 (profundidad T/4),
   H = 3000 mm de líquido sobre el fondo (H/T = 1,2). Turbina de cuatro palas inclinadas a 45° (D = 830 mm,
   D/T = 0,332, palas de W = D/5) a C = 625 mm del fondo (C/T = 0,25), bombeando hacia abajo. Cuatro deflectores de
   T/10 = 250 mm (los números de potencia del capítulo se midieron con deflectores del 10 % del diámetro), con 30 mm
   de holgura a la pared. Chaqueta de calentamiento en la parte cilíndrica, con anillo de 60 mm. */
export const TQ = {
  AZ: 60, EL: 26,
  R: 1250, tw: 10, hd: 625,                       // radio interior, espesor de la pared y profundidad de las cabezas
  zb: 700, zt: 1325, zt2: 4325, zL: 3700,         // polo interior del fondo, líneas de tangencia, nivel del líquido
  jk: { z0: 1400, z1: 3850, gap: 60, t: 8, cl: 10 },                     // chaqueta: de z0 a z1, anillo y pared
  baf: { w: 250, gap: 30, t: 10, z0: 1375, z1: 4000, clip: 80, clips: [1600, 2550, 3500] },
  imp: { D: 830, C: 625, W: 166, t: 10, hub: 80, hubR: 14, hubH: 75, phase: 18 },
  sh: { r: 40 },                                   // eje de 80 mm
  noz: { ro: 162, ri: 152, z1: 5110, fl: 242, ft: 30 },                  // boquilla del agitador (DN 300)
  mf: { z0: 5140, z1: 5170, r: 242, bc: 222, nb: 12 },                    // brida de montaje del accionamiento
  seal: { r: 105, z1: 5290, gr: 125, gz: 5308, sr: 58, sz: 5338 },        // sello mecánico de cartucho
  lan: { rin: 150, rout: 200, z0: 5170, z1: 5195, post: 5615, top: 5645, rtop: 215, pr: 175 },  // linterna
  cpl: { hub: 70, fl: 112, z0: 5400, z1: 5460, z2: 5480, z3: 5500, z4: 5560 },                // acople rígido
  gb: { x0: -200, x1: 190, y: 165, z0: 5665, z1: 6005, r: 40, fl: 170, flz: 5645 },            // reductor
  mot: { z: 5835, r: 118, x0: 210, x1: 228, x2: 530, x3: 640, rc: 122 },                     // motor
  legs: { r: 900, a: 110, rp: 84, plate: 150, pt: 25 },                   // patas
  out: { r: 57, z1: 540, fl: 114, ft: 22 },                               // salida de fondo (DN 100)
};
export const RO = TQ.R + TQ.tw;
const sq = (v) => Math.sqrt(Math.max(0, v));
// las cabezas 2:1, por dentro y por fuera
export const zInTop = (r) => TQ.zt2 + TQ.hd * sq(1 - (r * r) / (TQ.R * TQ.R));
export const zOutTop = (r) => TQ.zt2 + (TQ.hd + TQ.tw) * sq(1 - (r * r) / (RO * RO));
export const zInBot = (r) => TQ.zt - TQ.hd * sq(1 - (r * r) / (TQ.R * TQ.R));
export const zOutBot = (r) => TQ.zt + -(TQ.hd + TQ.tw) * sq(1 - (r * r) / (RO * RO));
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// un cuadrado de esquinas redondeadas (semilado h, radio rc), en (u, v)
export function roundSquare(h, rc, n = 5) {
  const out = [];
  [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], q) => {
    const cx = sx * (h - rc), cy = sy * (h - rc), a0 = (q * Math.PI) / 2;
    for (let i = 0; i <= n; i++) { const t = a0 + ((Math.PI / 2) * i) / n; out.push([cx + rc * Math.cos(t), cy + rc * Math.sin(t)]); }
  });
  return out;
}
