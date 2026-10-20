/* Medidas y formas del ecofiltro que comparten build.mjs y la página. Sin imports: el mismo texto corre en las dos.
   Unidades: 1 = 1 cm, z hacia arriba. La torre E-101 va en el origen y se abre por el plano vertical de su eje que
   mira al lector (u a lo largo de T, v hacia el lector). El tren de gas (D-101 y los dos ventiladores) va a la
   izquierda y el lazo de riego (TK-103 con la PS-101) a la derecha, los dos detrás del plano de corte. */
export const FX = {
  AZ: 55, EL: 28,
  // la torre: 7,3 m² de sección (3,05 m de diámetro), fondo plano sobre un pedestal, cabeza superior 2:1
  COL: { R: 152.4, TW: 1.6, base: 60, z0: 62, z1: 1030, hd: 76 },
  SUMP: { lev: 112 },                                           // nivel del líquido en el fondo
  IN: { z: 196, r: 15 },                                        // boquilla de entrada del gas, por −x
  GRID: { z0: 258, z1: 278 },                                   // vigas y parrilla de soporte
  BED: { z0: 278, z1: 878, layers: 12 },                        // el lecho: 6 m en capas de 50 cm
  HOLD: { z0: 878, z1: 884 },                                   // la rejilla de sujeción
  SPRAY: { z: 936, r: 3.4, n: 7, h: -96 },                      // cabezal de aspersores a lo largo del corte
  MIST: { z0: 994, z1: 1012, ring: 5 },                          // eliminador de niebla sobre su anillo
  OUT: { r: 18, x: 0, y: -28 },                                 // salida del gas por la cabeza superior
  D2: { R: 42, z0: 1242, z1: 1332, hd: 21 },                    // D-102, montado sobre la salida
  LIQ: { dir: [0.282, -0.959], drop: 76, r: 4.2 },              // del lado de atrás a la derecha: riego y fondo
  // el tren del gas, a lo largo de −x
  D1: { x: -880, y: -150, R: 42, z0: 70, z1: 214, hd: 21, legR: 3.2 },
  FAN: { xA: -440, xB: -650, y: 0, z: 104, w: 36, R0: 36, R1: 64, top: 76, rim: 32, r: 15 },
  HDR: { z: 380, r: 15, xDrop: -262 },                          // colector de descarga
  SUC: { z: 300, y: -150, r: 18 },                              // colector de succión, detrás de los ventiladores
  // el lazo de riego
  TK: { x: 136, y: -464, R: 72, z0: 8, z1: 110, lev: 62 },
  RIS: { r: 3, out: 60, up: 300 },                              // la tubería de riego, a 60 cm de la pared
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// un punto dado en (t a lo largo del corte, h hacia el lector, z)
export function TH(t, h, z, az) { const { T, HV } = axesOf(az === undefined ? FX.AZ : az); return [T[0] * t + HV[0] * h, T[1] * t + HV[1] * h, z]; }
// cabeza 2:1: profundidad h a radio r (0 en el borde, h en el polo)
export const headDepth = (r, R, h) => h * Math.sqrt(Math.max(0, 1 - (r * r) / (R * R)));
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco de corte; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// el contorno de la torre en el plano de corte, (u, z), de la cima al fondo por un costado (side = ±1)
export function colSide(side, inner, n = 20) {
  const { R, TW, base, z0, z1, hd } = FX.COL, r = inner ? R : R + TW, h = inner ? hd : hd + TW, pts = [];
  for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (1 - i / n); pts.push([side * r * Math.cos(a), z1 + h * Math.sin(a)]); }
  pts.push([side * r, inner ? z0 : base]);
  pts.push([0, inner ? z0 : base]);
  return pts;
}
// el corte de la pared y del fondo: una «C» por costado (exterior de la cima al centro del fondo, interior de vuelta)
export function wallCut(side, n = 20) { return [...colSide(side, false, n), ...colSide(side, true, n).reverse()]; }
// el hueco interior en el plano de corte (para recortar lo que se ve adentro)
export function cavity(n = 20) { const l = colSide(-1, true, n), r = colSide(1, true, n); return [...l, ...r.reverse()]; }
// la cara del lecho en el plano de corte, capa por capa
export function layerZ(i) { const { z0, z1, layers } = FX.BED; return [z0 + ((z1 - z0) * i) / layers, z0 + ((z1 - z0) * (i + 1)) / layers]; }
// los aspersores: posición u de cada boquilla a lo largo del cabezal
export function nozzleU(i) { const { R } = FX.COL, n = FX.SPRAY.n, span = 2 * R * 0.66; return -span / 2 + (span * i) / (n - 1); }
// la voluta del ventilador: una espiral logarítmica desde la lengüeta y la boca de descarga hacia arriba, en (u, v)
export function scroll(R0, R1, top, n = 56) {
  const a0 = 0.16, a1 = a0 + 2 * Math.PI, k = Math.log(R1 / R0) / (a1 - a0), pts = [];
  for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n, r = R0 * Math.exp(k * (a - a0)); pts.push([r * Math.cos(a), r * Math.sin(a)]); }
  const s = pts[0], e = pts[n];
  return { poly: [...pts, [e[0], top], [s[0], top]], out: [s[0], e[0]], top, rAt: (a) => R0 * Math.exp(k * (a - a0)) };
}
