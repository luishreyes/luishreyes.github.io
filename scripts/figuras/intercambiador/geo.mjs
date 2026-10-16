/* Medidas del intercambiador de tubos y coraza que comparten build.mjs y la página. Sin imports: el mismo texto corre
   en las dos. Unidades: 1 = 1 cm, z hacia arriba. Cada coraza va a lo largo de y: el cabezal de entrada (canal) en +y,
   hacia el lector, y el posterior en −y. El corte es el plano x = 0 (vertical, por el eje): se quita la mitad x > 0.
   Las corazas en serie van apiladas en un bastidor; la A arriba. */
export const HX = {
  AZ: 35, EL: 30,
  R: 30, TW: 1, L: 360, hd: 15,                  // coraza: radio interno, pared, largo entre placas y fondo de cabezas 2:1
  TS: 4,                                         // espesor de las placas de tubos
  RF: 38,                                        // radio de bridas y placas fijas
  NB: 6,                                         // bafles dibujados
  CUT: 15,                                       // altura de la ventana del bafle (25 % del diámetro)
  tube: { d: 2.4, p: 3.6, cols: [-1.5, -5.1, -8.7, -12.3], Rb: 27.2 },
  noz: { x: -13, r: 4.2, shellF: 330, shellR: 46, chan: 380 }, // boquillas verticales, corridas hacia atrás
  sad: [80, 290],                                // silletas
  Z0: 74, SP: 104,                               // centro de la coraza de abajo y separación entre corazas apiladas
  front: { B: { flange: 4, cyl: 16 }, A: { cyl: 34, flange: 4, cover: 4 } },
  rear: { M: { flange: 4, cyl: 14 }, U: { straight: 16 }, S: { sflange: 4, Rc: 37, cyl: 26, ft: 3.4, fcyl: 3, Rf: 27.6 } },
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// bafles: posiciones a lo largo de y (de la placa trasera a la delantera) y ventana arriba (+1) o abajo (−1)
export function baffles() { const out = []; for (let k = 1; k <= HX.NB; k++) out.push({ y: (HX.L * k) / (HX.NB + 1), win: k % 2 ? 1 : -1 }); return out; }
// tubos dibujados: filas (z relativa al eje) en cada columna de profundidad (x < 0) dentro del haz
export function tubeRows(Rb = HX.tube.Rb) {
  const { p, cols, d } = HX.tube, out = [];
  cols.forEach((x, c) => { for (let z = -Rb + d / 2 + 0.3; z <= Rb - d / 2 - 0.3; z += p) { if (x * x + z * z <= (Rb - d / 2) ** 2) out.push({ c, x, z: Math.round(z * 100) / 100 }); } });
  return out;
}
// carriles de las particiones para Np pasos: alturas z (relativas) que reparten las filas en bandas parejas, de abajo hacia arriba
export function lanes(Np) {
  const zs = [...new Set(tubeRows().filter((t) => t.c === 0).map((t) => t.z))].sort((a, b) => a - b);
  const out = []; for (let k = 1; k < Np; k++) { const i = Math.round((zs.length * k) / Np); out.push(i > 0 && i < zs.length ? (zs[i - 1] + zs[i]) / 2 : 0); }
  return out;
}
export function bandOf(z, ln) { let b = 0; for (const l of ln) if (z > l) b++; return b; }
// dónde terminan los tubos rectos atrás según el cabezal
export function tubeEnd(head) { return head === "BEU" ? HX.rear.U.straight : head === "AES" ? 0 : 0; }
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// el bafle: medio disco (v = x ≤ 0) sin el segmento de la ventana: arriba (win = +1, u = z > R − CUT) o abajo (win = −1)
export function bafflePoly(win, r = HX.R - 0.4, n = 36) {
  const zc = HX.R - HX.CUT, tc = Math.acos(zc / r), pts = [];
  const t0 = win > 0 ? Math.PI : Math.PI + tc, t1 = win > 0 ? 2 * Math.PI - tc : 2 * Math.PI;
  for (let i = 0; i <= n; i++) { const t = t0 + ((t1 - t0) * i) / n; pts.push([r * Math.cos(t), r * Math.sin(t)]); }
  pts.push(win > 0 ? [zc, 0] : [-zc, 0]);
  return pts.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
