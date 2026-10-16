/* Medidas del reactor agitado enchaquetado que comparten build.mjs y la página. Sin imports: el mismo texto corre en
   las dos. Unidades: 1 = T/100 (el diámetro interno del tanque vale 100), z hacia arriba desde la cara de adentro del
   fondo plano, el eje del agitador en el origen. El corte es el plano vertical por el eje que mira al lector: se ve la
   mitad de atrás del casco, de la camisa y del aislamiento. Las dos alturas del cuerpo recto (z1) son las dos variantes:
   «a» para H/T hasta 1,3 y «b» para H/T hasta 2. */
export const AG = {
  AZ: 36, EL: 30,
  R: 50, TW: 1, JG: 3.4, JW: 0.9, INS: 5.2, CL: 0.5,   // casco, espacio de la camisa, pared de la camisa, aislamiento, forro
  BT: 1.2,                                             // placa del fondo
  hd: 25,                                              // cabeza superior 2:1
  Z1: { a: 142, b: 214 },                              // cuerpo recto de cada variante
  jTop: 9,                                             // la camisa y el aislamiento terminan jTop por debajo de la línea de tangencia
  floor: -60,
  legs: [204, 336],                                    // patas visibles (θ en grados; las dos de adelante se van con el corte)
};
/* el tanque de vidrio del laboratorio y su agitador de varilla */
export const GL = {
  R: 50, TW: 1.6, BT: 2.6,                             // pared y fondo de vidrio
  Z1: { la: 134, lb: 206 },                            // alto del vidrio de cada variante
  plate: 4.4,                                          // placa base del soporte, bajo el tanque
  chuck: 36,                                           // el mandril empieza chuck por encima del borde
  rod: [-14, -70],                                     // la columna del soporte, atrás a la izquierda (u, v)
};
export const RJI = () => AG.R + AG.TW + AG.JG;                      // cara de adentro de la pared de la camisa
export const RJO = () => RJI() + AG.JW;                             // cara de afuera de la camisa
export const RIO = () => RJO() + AG.INS + AG.CL;                    // cara de afuera del forro
export const ZB = () => -(AG.BT + AG.JG + AG.JW);                   // cara de abajo de la camisa del fondo
export const ZI = () => ZB() - AG.INS - AG.CL;                      // cara de abajo del forro
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// cabeza 2:1: altura sobre la tangencia a radio r
export const headDepth = (r, R, h) => h * Math.sqrt(Math.max(0, 1 - (r * r) / (R * R)));
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
/* el corte por un costado (side = −1 a la izquierda, +1 a la derecha) en el plano (u, z). La boquilla del agitador abre
   la cabeza en la corona (rn) y la de fondo abre el fondo en el eje (rb), así que cada capa queda en dos mitades. */
export function cutSide(layer, side, Z1, rn, rb, n = 20) {
  const { R, TW, BT, hd, JG, CL, jTop } = AG, ro = R + TW, ho = hd + TW, zt = Z1 - jTop, ri = RJI(), rj = RJO(), rs = RIO();
  const arc = (rr, hh, from, to) => { const pts = []; for (let i = 0; i <= n; i++) { const r = from + ((to - from) * i) / n; pts.push([r, Z1 + headDepth(r, rr, hh)]); } return pts; };
  let pts;
  if (layer === "shell") pts = [[rb, -BT], [ro, -BT], ...arc(ro, ho, ro, rn), ...arc(hd > 0 ? R : R, hd, rn, R), [R, 0], [rb, 0]];
  else if (layer === "jacket") pts = [[rb, ZB()], [rj, ZB()], [rj, zt], [ro, zt], [ro, zt - 0.9], [ri, zt - 0.9], [ri, -(BT + JG)], [rb, -(BT + JG)]];
  else if (layer === "ins") pts = [[rb, ZI() + CL], [rs - CL, ZI() + CL], [rs - CL, zt], [rj, zt], [rj, ZB()], [rb, ZB()]];
  else if (layer === "clad") pts = [[rb, ZI()], [rs, ZI()], [rs, zt + 0.6], [ro, zt + 0.6], [ro, zt], [rs - CL, zt], [rs - CL, ZI() + CL], [rb, ZI() + CL]];
  else if (layer === "void") pts = [[ro, zt - 0.9], [ri, zt - 0.9], [ri, -(BT + JG)], [rb, -(BT + JG)], [rb, -BT], [ro, -BT]];
  pts = pts.map(([u, z]) => [side * u, z]);
  return side < 0 ? pts.reverse() : pts;
}
