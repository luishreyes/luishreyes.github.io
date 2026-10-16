/* Medidas del intercambiador de doble tubo que comparten build.mjs y la página. Sin imports: el mismo texto corre en
   las dos. Unidades: 1 = 1 cm, z hacia arriba. Tres horquillas apiladas en su bastidor; cada rama corre a lo largo de
   y: el cabezal de retorno atrás (y < 0) y adelante (y > L), hacia el lector, los prensaestopas, las curvas del tubo
   interior y las boquillas del ánulo. El corte es el plano x = 0: se quita la mitad x > 0 del tubo exterior de cada
   rama para ver el ánulo y, entero adentro, el tubo interior. */
export const DP = {
  AZ: 35, EL: 30,
  L: 210,                                  // largo de cada rama a la vista (entre el cabezal de retorno y la brida del prensaestopas)
  Ri: 8.0, Ro: 8.8, ri: 4.0, ro: 4.6,      // tubo exterior (interno, externo) y tubo interior (interno, externo); el ánulo, algo exagerado
  legs: 6, z0: 40, dz: 28,                 // ramas: la de abajo es la 0; cada horquilla son dos ramas seguidas
  housing: { y0: -22, y1: 0 },             // cabezal de retorno (fundición) que une las dos ramas de cada horquilla
  gland: { fl: 2.4, body: 7.5 },           // brida del tubo exterior y prensaestopas por donde sale el tubo interior
  bend: { dy: 30 },                        // el codo exterior del tubo interior, a esta distancia del prensaestopas
  noz: { dy: 22, x: -5.0, r: 3.0 },        // boquillas del ánulo a dy del extremo de adelante, en la mitad que queda
  sup: [34, 168],                          // soportes
};
export function legZ(k) { return DP.z0 + k * DP.dz; }
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
/* posición a lo largo del recorrido del tubo interior (0 entra, 1 sale) de un punto y en la rama k: el tubo interior
   entra por la rama de abajo adelante y va hacia atrás; en cada rama cambia de sentido */
export function pathPos(k, y) { const f = Math.max(0, Math.min(1, y / DP.L)); return (k + (k % 2 === 0 ? 1 - f : f)) / DP.legs; }
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
