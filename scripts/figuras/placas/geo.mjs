/* Medidas del intercambiador de placas que comparten build.mjs y la página. Sin imports: el mismo texto corre en las
   dos. Unidades: 1 = 1 cm, z hacia arriba. El paquete de placas va a lo largo de y: el bastidor fijo con las cuatro
   boquillas en +y, hacia el lector; la placa de presión y la columna de apoyo hacia −y. El corte es el plano x = 0:
   se quita la mitad x > 0 del paquete (y los tornillos de ese lado) para ver los canales. */
export const PX = {
  AZ: 35, EL: 30,
  W: 60, z0: 30, H: 150,              // placa: ancho, borde de abajo, alto
  N: 15, PITCH: 5, T: 0.8,            // placas dibujadas, paso (exagerado) y espesor
  GK: 4.5,                            // franja del empaque arriba y abajo de cada canal
  port: { x: 18, zb: 52, zt: 158, r: 6.4 },  // puertos: el caliente por −x (arriba entra, abajo sale), el frío por +x
  frame: { y0: 75, y1: 87, x: 42, z0: 8, z1: 196 },   // placa fija del bastidor
  press: { th: 11, x: 40, z0: 28, z1: 184 },          // placa de presión (móvil), apoyada en la primera placa
  col: { y0: -118, y1: -106, x: 9 },                   // columna de apoyo
  bar: { w: 5, top: [188, 198], bot: [22, 28] },       // barra portadora arriba y barra guía abajo
  bolts: { x: -36, z: [62, 105, 148], r: 1.5, y0: -17, y1: 93 },
  noz: { len: 16, r: 5.2, fr: 9.4 },
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// y de cada placa; la última se apoya en la placa fija y la primera en la de presión. El canal 0 es del caliente y se alternan
export function plates() { const out = []; for (let i = 0; i < PX.N; i++) { const y1 = PX.frame.y0 - (PX.N - 1 - i) * PX.PITCH; out.push({ i, y0: y1 - PX.T, y1 }); } return out; }
export function channels() { const p = plates(), out = []; for (let i = 0; i + 1 < p.length; i++) out.push({ i, hot: i % 2 === 0, y0: p[i].y1, y1: p[i + 1].y0 }); return out; }
