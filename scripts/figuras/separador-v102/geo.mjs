/* Medidas del separador de alta V-102 de la planta de benceno (capítulo 2 del libro). Sin imports.
   Unidades: 1 = 1 cm, z hacia arriba. El eje del recipiente va en el origen. Los ángulos θ de las boquillas se miden
   en el plano del suelo desde la dirección T (la del corte, hacia la derecha de la pantalla) hacia HV (hacia el
   lector): θ entre 180° y 360° es la mitad de atrás, la que queda. */
export const SV = {
  AZ: 55, EL: 30,
  // el recipiente: 1,2 m de diámetro interior, 3,4 m entre tangentes, cabezas elípticas 2:1, pared de 20 mm
  DR: { R: 60, TW: 2, z0: 110, z1: 450, hd: 30 },
  NNL: 110 + 0.35 * 340,                                                   // nivel normal: 0,35 de la altura del cuerpo
  SK: { base: 2.5, ring: [50, 74], bolts: 8, found: 16 },                  // faldón sobre su anillo de base y la fundación
  // entrada de 8″ por la izquierda, con la placa desviadora
  IN: { th: 220, z: 345, r: 10.95, fl: 19.05, ft: 4.4, neck: 22, spool: 30, plate: { s: 28, half: 18, t: 1.2 } },
  DEM: { z0: 408, z1: 423, ring: 5 },                                      // malla y su anillo de apoyo
  GAS: { u: 8, v: -24, r: 10.95, fl: 19.05, ft: 4.4, up: 52, run: 64, th: 330 },   // salida de gas de 8″ por la cabeza superior
  PSV: { u: -30, v: -20 },                                                 // válvula de seguridad con su válvula de bloqueo
  PT: { u: 34, v: -6 },                                                    // transmisor de presión
  OUT: { v: -14, r: 4.45, fl: 10.5, ft: 2.8, th: 160, run: 112 },          // salida de líquido de 3″ por el fondo
  DRN: { u: 24, v: -22, r: 3.0, fl: 8.25 },                                // drenaje de 2″
  BR: { th: 340, rad: 96, r: 4.45, z: [130, 380], z0: 104, z1: 404, nz: 3.0 },   // puente de nivel (standpipe) de 3″
  LG: { off: 17, z: [150, 360] },                                          // visor de vidrio, al lado del puente
  LSHH: { th: 190, z: 296 },
  TI: { th: 196, z: 165 },
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
export const headDepth = (r, R, h) => h * Math.sqrt(Math.max(0, 1 - (r * r) / (R * R)));
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// el contorno del recipiente en el plano de corte, (u, z), de polo a polo por un costado (side = ±1)
export function drumSide(side, inner, n = 24) {
  const { R, TW, z0, z1, hd } = SV.DR, r = inner ? R : R + TW, h = inner ? hd : hd + TW, pts = [];
  for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (1 - i / n); pts.push([side * r * Math.cos(a), z0 - h * Math.sin(a)]); }
  for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (i / n); pts.push([side * r * Math.cos(a), z1 + h * Math.sin(a)]); }
  return pts;
}
export function wallCut(side, n = 24) { return [...drumSide(side, false, n), ...drumSide(side, true, n).reverse()]; }
