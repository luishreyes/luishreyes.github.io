/* Medidas y formas del sistema flash que comparten build.mjs y la página. Sin imports: el mismo texto corre en las dos.
   Unidades: 1 = 1 cm, z hacia arriba. El tambor va en el origen; el tren (bomba, intercambiador, válvula) corre a lo
   largo de y por detrás y a la izquierda. El corte del tambor es el plano vertical por su eje que mira al lector. */
export const FX = {
  AZ: 55, EL: 30,
  // tambor vertical: 64 cm de diámetro interno, 1,7 m entre tangentes (L/D ≈ 3), cabezas 2:1
  DR: { R: 32, TW: 1, z0: 52, z1: 222, hd: 16, lev: 99, legR: 3.4, legTop: 84 },
  IN: { z: 150, r: 4.2, x1: -48, plate: { x: -18, y: 11, z0: 137, z1: 163, t: 0.8 } }, // boquilla de entrada por −x y su deflector
  DEM: { z0: 200, z1: 211, ring: 3.4 },                                              // malla eliminadora de niebla y su anillo
  OUT: { x: 0, y: -13, r: 2.6, z: 16, x1: 104, lcv: 62 },                            // salida de líquido por el fondo
  VAP: { x: -7, y: -7, r: 4.4, z: 262, y1: -104, pcv: -64 },                       // salida de vapor por la cabeza superior
  LG: { y: -64, z0: 72, z1: 188 },                                                   // visor de nivel, al costado por −y
  // el tren
  TR: { x: -100 },
  PU: { y: 222, z: 26, R: 14, w: 10, suc: 262, motor: [194, 154] },
  EX: { z: 150, R: 13, y0: 40, y1: 148, bents: [58, 130], beam: 124 },
  VA: { x: -82, sight: -63 },
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// cabeza 2:1: profundidad h a radio r (0 en el borde, h en el polo)
export const headDepth = (r, R, h) => h * Math.sqrt(Math.max(0, 1 - (r * r) / (R * R)));
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco de corte; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// el contorno del tambor en el plano de corte, (u, z): interior y exterior, de polo a polo por un costado (side = ±1)
export function drumSide(side, inner, n = 18) {
  const { R, TW, z0, z1, hd } = FX.DR, r = inner ? R : R + TW, h = inner ? hd : hd + TW, pts = [];
  for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (1 - i / n); pts.push([side * r * Math.cos(a), z0 - h * Math.sin(a)]); }
  for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (i / n); pts.push([side * r * Math.cos(a), z1 + h * Math.sin(a)]); }
  return pts;
}
// el corte de la pared: una «C» por costado (exterior de abajo arriba, interior de arriba abajo)
export function wallCut(side, n = 18) { return [...drumSide(side, false, n), ...drumSide(side, true, n).reverse()]; }
// volumen de líquido (m³) con el nivel z: la cabeza inferior completa más el cilindro hasta el nivel
export function holdup(z) {
  const { R, z0, hd } = FX.DR, Rm = R / 100;
  const head = (2 / 3) * Math.PI * Rm * Rm * (hd / 100);
  if (z <= z0) { const f = Math.max(0, (z - (z0 - hd)) / hd); return head * f * f * (3 - 2 * f); }
  return head + Math.PI * Rm * Rm * ((z - z0) / 100);
}
