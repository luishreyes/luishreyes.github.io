/* Medidas del tanque de llegada del capítulo 12 del libro de operaciones unitarias (Válvulas, tuberías y medición de
   flujo). Unidades: 1 = 1 mm. z hacia arriba, medido desde el eje de la bomba (como las cotas del libro); el eje del
   tanque en x = y = 0. Ángulos θ medidos desde +x hacia +y; el lector mira desde θ = AZ.
   El corte quita el cuarto de la envolvente, del techo y del agua que mira al lector (x > 0 y y > 0, por encima del
   fondo); el fondo, la estructura, la escalera y la tubería de afuera van enteros.
   Del libro (@tbl-val-tanque): cilindro vertical de acero de 3,0 m de diámetro sobre una estructura; fondo a 9,0 m;
   nivel normal a 12,0 m; rebose a 12,4 m (aquí, la plantilla de la boca a 12,35 m: borde libre de 0,30 m hasta el
   borde de la envolvente, el mínimo de la Resolución 0330 de 2017, art. 79); techo fijo a 12,8 m; LT‑101 de presión diferencial con la toma a 9,2 m;
   respiradero de cuello de ganso de 2 in con malla; la descarga de 2½ in llega a 13 m y entrega 1 m bajo el nivel
   normal; la válvula de control de globo de 2 in va al final del tramo alto, antes del carrete y el codo de la
   bajada. El resto son medidas del libro (de la figura), típicas de un tanque así. */
export const TL = {
  AZ: 62, EL: 26,
  /* tanque */
  R: 1500, tw: 6,                      // radio interior y espesor de la envolvente (6 mm)
  zb: 9000, zs: 12650, zL: 12000,      // fondo (cara de arriba de la placa), borde de la envolvente, nivel normal
  bot: { r: 1550, t: 8 },              // placa de fondo, sobresale 44 mm de la envolvente
  girth: 10825,                        // costura entre los dos anillos de 1825 mm
  vseams: [[9000, 10825, [150, 330]], [10825, 12650, [240, 60]]],   // costuras verticales de cada anillo
  ang: { a: 65, t: 6 },                // ángulo de coronamiento L 65 × 65 × 6, por fuera
  roof: { slope: 1 / 6, t: 5, over: 80 },   // cono autoportante de pendiente 1:6 (9,5°), placa de 5 mm, alero
  /* estructura */
  ring: { r0: 1390, r1: 1540, z0: 8742, z1: 8992 },   // viga anillo bajo la envolvente
  leg: { r: 1460, ro: 84.15, cap: 140, capT: 12 },    // columnas de tubo de 6 in (168,3 mm), a 45°, 135°, 225°, 315°
  strut: { z: 7200, ro: 44.45 },                      // puntal horizontal de 3 in entre columnas
  brace: { w: 60, t: 8, gus: 10 },                    // diagonales de platina de 60 × 8 y cartelas de 10 mm
  brk: { top: 6800, bot: 500, gap: 350 },             // el corte de la estructura: se esconde de 0,5 m a 6,8 m
  pier: { h: 300, a: 260 },                           // pedestal de concreto de 520 × 520, 300 mm sobre el piso
  base: { a: 160, t: 25 },                            // placa base de 320 × 320 × 25
  grade: -700,                                        // el piso, a −0,7 m
  /* tubería */
  inlet: { th: 250, r: 900, z: 13000, ro: 36.5, end: -2700, dip: 11000 },   // 2½ in: Ø 73,0 mm
  valve: { x: -1270 },                                 // el centro de la válvula de control, en x
  vent: { th: 150, r: 400 },
  over: { th: 150, z: 12350 + 26.6, ro: 30.15, rd: 1850, end: -250 },       // rebose de 2 in: plantilla de la boca a 12,35 m; baja a 1,85 m del eje
  out: { th: 70, r: 1200, ro: 44.45 },                                        // salida de 3 in
  drain: { th: 20, r: 1250, ro: 30.15 },
  /* accesorios */
  rmh: { x: 850, a: 305, ai: 297, top: 12950 },        // boca de inspección del techo, Ø 610, partida por el corte
  smh: { th: 115, z: 9800, a: 305, ai: 297, pad: 480, out: 1690 },   // boca de inspección de la envolvente (24 in)
  lt: { th: 97, z: 9200 },
  hh: { th: 285, r: 1050, z: 12250 },
  lad: { th: -14, r: 1720, half: 225, rw: 60, rt: 12, pitch: 300 },    // escalera: plano de los largueros a r = 1720
  cage: { half: 360, depth: 700, t: 6, h: 50, from: 1500 },            // jaula: aros de 720 mm, desde 2,2 m sobre el piso
  rail: { th0: -60, th1: -27, r: 1530, h: 1070, ro: 21.1 },            // baranda del techo
};
export const RO = TL.R + TL.tw;
export const D2R = Math.PI / 180;
/* el techo: la cara de abajo pasa por el borde de la envolvente; la de arriba, 5 mm más arriba */
export const zRoofU = (r) => TL.zs + (RO - r) * TL.roof.slope;
export const zRoofT = (r) => zRoofU(r) + TL.roof.t / Math.cos(Math.atan(TL.roof.slope));
export const RROOF = RO + TL.ang.a + 15;                 // radio del alero del techo
/* el corte de la estructura: lo de abajo (z ≤ brk.bot real) se dibuja subido SHIFT */
export const SHIFT = TL.brk.top - TL.brk.gap - TL.brk.bot;
export const zDraw = (z) => (z <= TL.brk.bot + 1 ? z + SHIFT : z);
export const pol = (r, deg, z = 0) => [r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z];
/* media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco */
export function halfRing(r0, r1, n = 36, a0 = Math.PI, a1 = 2 * Math.PI) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
