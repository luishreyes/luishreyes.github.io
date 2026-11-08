/* Medidas del tanque agitado de los capítulos 14 y 15 del libro de operaciones unitarias (Agitación; Mezclado y
   escalado): el reactor de extracción de pectina de la cáscara de cítricos. Unidades: 1 = 1 mm. z hacia arriba; el
   eje del tanque en x = y = 0.
   El corte quita lo que mira al lector por encima de la línea de tangencia del fondo (y > 0 y z > zt): el fondo
   queda entero, como una taza, y el resto se ve por el plano y = 0.
   Reactor vidriado (el ácido clorhídrico caliente pica el inoxidable): 12 mm de acero al carbono con 2 mm de vidrio,
   T = 2500 mm de diámetro interior, fondo y tapa elípticos 2:1 (profundidad T/4), H = 3000 mm de líquido sobre el
   punto más bajo del fondo (H/T = 1,2). Dos turbinas vidriadas y desmontables de cuatro palas inclinadas a 45°
   (D = 830 mm, D/T = 0,332, palas de W = D/5), bombeando hacia abajo: la de abajo a C = 625 mm del fondo (C/T = 0,25)
   y la de arriba 830 mm (un diámetro) bajo la superficie. Dos bafles de aleta vidriados, colgados de boquillas de la
   tapa en el plano del corte (a 0° y 180°): un tubo DN 100 cerrado con una aleta hacia la pared en su parte de abajo,
   que llega, con el tubo, a unos T/10 de ancho; en el vidriado los bafles no van en la pared (Hemrajani y Tatterson,
   pp. 350 y 355) y con sólidos se piden al menos dos (Atiemo-Obeng y otros, p. 579). Chaqueta de calentamiento en
   la parte cilíndrica, desde la línea de tangencia del fondo, con anillo de 60 mm. */
export const TQ = {
  AZ: 60, EL: 26,
  R: 1250, tw: 14, hd: 625,                       // radio interior, espesor de la pared (12 de acero y 2 de vidrio) y profundidad de las cabezas
  zb: 700, zt: 1325, zt2: 4325, zL: 3700,         // polo interior del fondo, líneas de tangencia, nivel del líquido
  jk: { z0: 1325, z1: 3850, gap: 60, t: 8, cl: 10 },                     // chaqueta: de z0 (la línea de tangencia) a z1, anillo y pared
  // bafles de aleta: tubo de radio ro (pared hasta ri), punta redonda en zb; aleta de w × t de zf0 (junto al tubo; zf0 + slope
  // en el borde) a zf1, a gap de la pared; su boquilla DN 150 (cuello ro/ri hasta z1) con brida y tapa ciega de fl × ft
  fin: { rc: 960, ro: 58, ri: 51, zb: 1380, w: 140, t: 20, zf0: 1460, slope: 60, zf1: 3400, rr: 22 },
  finNoz: { ro: 84, ri: 78, z1: 4940, fl: 140, ft: 28, bc: 120, nb: 8 },
  imp: { D: 830, C: 625, W: 166, t: 16, hub: 95, hubH: 75, phase: 18, sub: 830, phase2: 63 },
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
  /* la persona de referencia (../persona.mjs, 1,75 m; medida del libro): de pie en el piso, a la derecha del tanque y
     un poco hacia el lector, fuera de las patas y bajo la salida de condensado, mirando hacia el frente del tanque */
  persona: { x: 1920, y: 340, rumbo: 165 },
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
