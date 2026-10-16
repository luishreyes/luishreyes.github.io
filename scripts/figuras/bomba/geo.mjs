/* Medidas de la instalación de bombeo que comparten build.mjs y la página. Sin imports: el mismo texto corre en las
   dos. Unidades: 1 = 1 cm, z hacia arriba. La bomba es una 2×3-8 de succión axial (carcasa de referencia del
   explorador: impulsor de hasta 203 mm, ojo de 80 mm, succión de 3″ y descarga de 2″), con el eje a lo largo de x: la
   succión mira hacia +x y el motor queda en −x. La voluta está en el plano yz; su ángulo θ se mide desde +y hacia +z
   (el impulsor gira con θ creciente). La lengüeta está en θ = 0 y la garganta sube por el lado +y hasta la boquilla
   de descarga. Se quita la mitad de arriba de la tapa de succión (y de la boquilla de succión) para ver el impulsor. */
export const PB = {
  AZ: 35, EL: 30,
  zA: 42,                                     // altura del eje
  xP: 30,                                     // plano medio del impulsor
  r2: 10.15, r1: 4.0, rh: 2.6,                // impulsor máximo, ojo y cubo
  r3: 11.2, dv: 6.3, wall: 1.4,               // círculo base de la voluta, crecimiento de la espiral y pared
  bw: 3.4,                                    // medio ancho interior de la carcasa (a lo largo de x)
  zT: 20,                                     // alto de la garganta sobre el eje
  vanes: 6, beta1: 18, beta2: 27,             // álabes (ángulos de entrada y salida desde la tangente)
  vane: [-1.4, 1.0],                          // los álabes, de la cara del disco al borde libre (a lo largo de x)
  disk: [-2.2, -1.4],                         // disco de atrás del impulsor abierto
  suc: { r: 3.9, ro: 4.45, len: 10, fr: 9.5, ft: 2.4 },  // boquilla de succión de 3″ (interior, exterior) y su brida
  dis: { r: 2.63, ro: 3.0, len: 8, fr: 7.6, ft: 2.0 },   // boquilla de descarga de 2″
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
/* radio interior de la voluta en θ (0 en la lengüeta, 2π a la entrada de la garganta) */
export function rOut(t) { return PB.r3 + PB.dv * Math.max(0, Math.min(1, t / (2 * Math.PI))); }
export const yThroat = () => [PB.r3, PB.r3 + PB.dv];         // la garganta, entre la lengüeta y la pared de afuera
export const yNoz = () => PB.r3 + PB.dv / 2;                  // eje de la boquilla de descarga
/* θ donde la cara de afuera de la pared de la voluta corta la cara de afuera de la pared de la lengüeta (y = r3 − wall) */
export function tTongue() { let lo = 0.05, hi = 1.5; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if ((rOut(m) + PB.wall) * Math.cos(m) > PB.r3 - PB.wall) lo = m; else hi = m; } return (lo + hi) / 2; }
/* contornos en (y, z) relativos al eje: el de afuera de la carcasa y las mitades de la pared */
export function outerContour(n = 72) {
  const w = PB.wall, tt = tTongue(), pts = [];
  // de la cara de afuera de la lengüeta (arriba de la garganta) hacia abajo, la espiral por arriba, a la izquierda y por abajo, y la garganta de afuera
  pts.push([PB.r3 - w, PB.zT]);
  for (let i = 0; i <= n; i++) { const t = tt + ((2 * Math.PI - tt) * i) / n, r = rOut(t) + w; pts.push([r * Math.cos(t), r * Math.sin(t)]); }
  pts.push([PB.r3 + PB.dv + w, PB.zT]);
  return pts;
}
/* la punta de la lengüeta: donde la espiral cruza la recta y = r3 de la cara de adentro de la garganta */
export function tTip() { let lo = 0.02, hi = 0.6; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (rOut(m) * Math.cos(m) > PB.r3) lo = m; else hi = m; } return (lo + hi) / 2; }
export const zTip = () => rOut(tTip()) * Math.sin(tTip());
/* la pared de la voluta en la mitad de arriba (z ≥ 0): la espiral de θ₀ (la lengüeta) a π, la pared de adentro de la
   garganta y la cuña de la lengüeta entre las dos */
export function wallUpper(n = 48) {
  const w = PB.wall, tt = tTongue(), t0 = tTip(), out = [];
  for (let i = n; i >= 0; i--) { const t = t0 + ((Math.PI - t0) * i) / n, r = rOut(t); out.push([r * Math.cos(t), r * Math.sin(t)]); }
  out.push([PB.r3, PB.zT], [PB.r3 - w, PB.zT]);
  for (let i = 0; i <= n; i++) { const t = tt + ((Math.PI - tt) * i) / n, r = rOut(t) + w; out.push([r * Math.cos(t), r * Math.sin(t)]); }
  return out.map(([y, z]) => [y, Math.abs(z) < 1e-9 ? 0 : z]);
}
/* la pared de la voluta en la mitad de abajo (z ≤ 0), de θ = π a 2π */
export function wallLower(n = 48) {
  const w = PB.wall, out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n, r = rOut(t) + w; out.push([r * Math.cos(t), r * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n, r = rOut(t); out.push([r * Math.cos(t), r * Math.sin(t)]); }
  return out.map(([y, z]) => [y, Math.abs(z) < 1e-9 ? 0 : z]);
}
/* la pared de afuera de la garganta (z ≥ 0) */
export function wallThroat() { const [a, b] = yThroat(); return [[b, 0], [b + PB.wall, 0], [b + PB.wall, PB.zT], [b, PB.zT]]; }
/* el canal de la voluta en la mitad de arriba (para el fluido): entre el círculo base y la espiral, hasta la lengüeta */
export function passUpper(n = 48) {
  const out = [], t0 = tTip();
  for (let i = 0; i <= n; i++) { const t = (Math.PI * i) / n; out.push([PB.r3 * Math.cos(t), PB.r3 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = t0 + ((Math.PI - t0) * i) / n, r = rOut(t); out.push([r * Math.cos(t), r * Math.sin(t)]); }
  return out.map(([y, z]) => [y, Math.abs(z) < 1e-9 ? 0 : z]);
}
/* la garganta (para el fluido) */
export function passThroat() { const [a, b] = yThroat(); return [[a, 0], [b, 0], [b, PB.zT], [a, PB.zT]]; }
/* el álabe: ángulo de envolvimiento φ(r) desde el ojo hasta r2 (β de β1 a β2, medido desde la tangente) */
export function vaneOff(r, r2 = PB.r2) {
  const b1 = (PB.beta1 * Math.PI) / 180, b2 = (PB.beta2 * Math.PI) / 180, r0 = PB.r1 * 0.95, n = 40;
  let off = 0;
  for (let i = 0; i < n; i++) {
    const ra = r0 + ((r2 - r0) * i) / n, rb = r0 + ((r2 - r0) * (i + 1)) / n;
    if (ra >= r) break;
    const rm = (ra + Math.min(rb, r)) / 2, bt = b1 + ((b2 - b1) * (rm - r0)) / (r2 - r0);
    off -= (Math.min(rb, r) - ra) / (rm * Math.tan(bt));
  }
  return off;
}
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
/* el plano que mira al lector parte la voluta: lo que queda de θ < TS va adelante del impulsor y lo de θ > TS, atrás */
export const TS = (3 * Math.PI) / 4;
/* la pared de arriba entre ta y tb (con la lengüeta y la garganta si ta es la punta de la lengüeta) */
export function wallUpperPart(ta, tb, n = 32) {
  const w = PB.wall, tt = tTongue(), t0 = tTip(), out = [], near = ta <= t0 + 1e-9;
  const a = Math.max(ta, t0);
  for (let i = n; i >= 0; i--) { const t = a + ((tb - a) * i) / n, r = rOut(t); out.push([r * Math.cos(t), r * Math.sin(t)]); }
  if (near) out.push([PB.r3, PB.zT], [PB.r3 - w, PB.zT]);
  const b = near ? tt : ta;
  for (let i = 0; i <= n; i++) { const t = b + ((tb - b) * i) / n, r = rOut(t) + w; out.push([r * Math.cos(t), r * Math.sin(t)]); }
  return out.map(([y, z]) => [y, Math.abs(z) < 1e-9 ? 0 : z]);
}
/* el canal de la voluta entre ta y tb */
export function passPart(ta, tb, n = 32) {
  const out = [], t0 = tTip(), a = Math.max(ta, 0);
  for (let i = 0; i <= n; i++) { const t = a + ((tb - a) * i) / n; out.push([PB.r3 * Math.cos(t), PB.r3 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = Math.max(t0, a) + ((tb - Math.max(t0, a)) * i) / n, r = rOut(t); out.push([r * Math.cos(t), r * Math.sin(t)]); }
  return out.map(([y, z]) => [y, Math.abs(z) < 1e-9 ? 0 : z]);
}
/* una corona entre r0 y r1, de t0 a t1 (en el plano yz, θ desde +y) */
export function arcRing(r0, r1, t0, t1, n = 32) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = t0 + ((t1 - t0) * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = t0 + ((t1 - t0) * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
