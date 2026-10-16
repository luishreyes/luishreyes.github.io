/* Medidas del aeroenfriador de tiro forzado que comparten build.mjs y la página. Sin imports: el mismo texto corre en
   las dos. Unidades: 1 = 1 cm, z hacia arriba. Los tubos aleteados corren a lo largo de y, entre el cabezal de tapones
   de atrás (y < 0) y el de adelante (y > L), hacia el lector, por donde entra el proceso. Debajo del haz, la cámara
   (plenum) con dos ventiladores que empujan el aire hacia arriba; los motores van abajo, en su puente. El corte es el
   plano x = 0 para la cámara y los anillos de los ventiladores (se quita la mitad x > 0); del haz se quita el
   bastidor del lado del lector para ver las cuatro filas. */
export const AC = {
  AZ: 35, EL: 30,
  L: 300,                                   // largo de los tubos entre cabezales (acortado)
  NT: 16, NR: 4,                            // tubos por fila y filas dibujados
  pt: 6.0, d: 2.54, Df: 5.7,                // paso triangular, tubo de 1″ y diámetro de las aletas
  x0: -45,                                  // x del primer tubo de las filas sin desplazar
  zs: 222,                                  // arriba de las vigas: ahí se apoyan los soportes de los tubos
  sup: 2.0,                                 // alto de los soportes de los tubos (y de los sujetadores de arriba)
  hdr: { dy: 14, x: 54, z0: 219.5, z1: 251.5 },  // cabezales de tapones
  col: { x: 58, y: [12, 150, 288], w: 6 },  // columnas (la del medio no lleva columna: solo la viga)
  beam: 8,                                  // alto de las vigas de arriba
  zf: 150,                                  // piso de la cámara
  fan: { y: [82.5, 217.5], R: 46, tip: 44, hub: 9, z: 135.5, ring: [126, 150], blades: 4 },
  bridge: { z: [60, 66, 72], x: 16 },       // vigas bajas, puente de los motores
  motor: { r: 11, z0: 73.5, z1: 101 },
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// centro de la fila r (0 la de arriba): las filas impares van desplazadas medio paso (arreglo triangular)
export function rowZ(r) { return AC.zs + AC.sup + AC.Df / 2 + 0.05 + (AC.NR - 1 - r) * AC.pt * Math.sqrt(3) / 2; }
export function tubeX(r, i) { return AC.x0 + (r % 2 ? AC.pt / 2 : 0) + i * AC.pt; }
export function topZ() { return rowZ(0) + AC.Df / 2; }
/* paso del proceso en la fila dibujada r con Np pasos (el proceso entra por la fila de arriba y baja) */
export function passOf(r, Np) { return Math.min(Np - 1, Math.floor((r * Np) / AC.NR)); }
/* posición a lo largo del recorrido del proceso (0 entra, 1 sale) en la fila r, en y: el paso 0 va del cabezal de
   adelante (y = L) hacia atrás y cada paso cambia de sentido */
export function pathPos(r, y, Np) { const k = passOf(r, Np), s = Math.max(0, Math.min(1, y / AC.L)); return (k + (k % 2 === 0 ? 1 - s : s)) / Np; }
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
