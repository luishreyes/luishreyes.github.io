/* Medidas del mezclador estático del capítulo 14 del libro de operaciones unitarias (Mezclado y escalado de tanques
   agitados): el ácido clorhídrico al 32 % que entra a la línea de agua de proceso del reactor de extracción de pectina.
   Unidades: 1 = 1 mm. x a lo largo del flujo (el agua entra por −x), y hacia el lector (el corte quita y > 0), z hacia
   arriba. El eje del tubo es la recta y = z = 0; la cara realzada de la brida de entrada está en x = 0.
   - El tubo: 2½ in cédula 40 (Ø 73,0 × 5,16; diámetro interior D = 62,71 mm), el de la línea de 25 m³/h del caso.
   - Los elementos: Kenics KMS estándar (Paul, 2004, cap. 3, fig. 3-18, p. 119, y cap. 7, p. 426): cinta torcida 180°
     en un largo de 1,5 D, alternando giro derecho e izquierdo, cada una girada 90° respecto a la anterior. Siete
     elementos: los 9,3 D que pide el caso, redondeados a elementos enteros.
   - La lanza: entra por una boquilla de 1 in en la parte de arriba, baja, dobla 90° y descarga en el centro del tubo,
     coaxial y hacia aguas abajo, antes del primer elemento (Paul, cap. 7, p. 462: inyección coaxial al centro).
   - Las bridas: deslizantes ASME B16.5 clase 150 con cara realzada (2½ in en los extremos, 1 in en la boquilla).
   Lo que las fuentes no dan va marcado «dibujo»: es una elección del dibujo, no un dato. */
export const MZ = {
  AZ: 68, EL: 28,
  /* el tubo de 2½ in cédula 40 */
  D: 62.71, ro: 36.5, ri: 31.355,
  /* bridas deslizantes de 2½ in, clase 150 (B16.5): diámetro 177,8, espesor 22,4 con la cara realzada (Ø 104,8 × 1,6),
     cubo Ø 90,4 hasta 28,4 de la cara, agujero 74,7, cuatro agujeros de Ø 19,1 en un círculo de Ø 139,7 */
  fl: { r: 88.9, t: 22.4, rf: 52.4, rfh: 1.6, hub: 45.2, y: 28.4, bore: 37.35, bc: 69.85, hole: 9.55 },
  set: 6.5,                    // el tubo queda 6,5 mm adentro de la cara de la brida (soldadura interior)
  wIn: 5, wHub: 6,             // catetos de las soldaduras de filete: la de adentro y la del cubo
  XL: 916,                     // la cara realzada de la brida de salida
  /* la boquilla de la lanza: tubo de 1 in cédula 80 (Ø 33,4 × 4,55) y brida deslizante de 1 in clase 150 (Ø 108 × 14,2,
     cara realzada Ø 50,8, cubo Ø 49,3 hasta 17,5 de la cara, agujero 34, cuatro agujeros de Ø 15,9 en un círculo de
     Ø 79,4), con su empaque y una brida ciega con la conexión de ¾ in NPT de la lanza */
  noz: { x: 115, ro: 16.7, ri: 12.15, zN: 100, top: 6 },
  nfl: { r: 54, t: 14.2, rf: 25.4, rfh: 1.6, hub: 24.65, y: 17.5, bore: 17.0, bc: 39.7, hole: 7.95 },
  gk: { ri: 16.9, ro: 25.4, t: 1.6 },
  blind: { port: 13.35 },
  stud: { r: 6.35, nut: 22.2, nh: 12.3, out: 4 },     // espárragos de ½ in con tuercas hexagonales pesadas
  fit: { body: 27, bh: 14, neck: 9.5, nk: 2, nut: 22.2, nh: 12 },   // conector de compresión de ¾ in NPT (dibujo)
  /* la lanza: tubo de ½ in (Ø 12,7, pared 1,65; dibujo), doblez de 1,5 diámetros */
  lance: { r: 6.35, bore: 4.7, bend: 19, rise: 36, back: 80 },
  union: { af: 19, len: 24 },                         // la unión del tubo del ácido (dibujo)
  /* los elementos KMS */
  el: { x0: 220, n: 7, LD: 1.5, t: 2.4, gap: 0.1 },  // espesor de la cinta y holgura a la pared: dibujo
  tipGap: 0.5,                                        // la punta de la lanza, medio D antes del primer elemento (dibujo)
};
export const LE = MZ.el.LD * MZ.D;                    // largo de un elemento: 1,5 D = 94,1 mm
export const XE = (i) => MZ.el.x0 + i * LE;           // dónde empieza el elemento i
export const XTIP = MZ.el.x0 - MZ.tipGap * MZ.D;      // la punta de la lanza
export const W = MZ.ri - MZ.el.gap;                   // medio ancho de la cinta
// el ángulo de la cinta en x: el borde de entrada del primero va vertical; cada elemento gira 180° (a la derecha los
// pares, a la izquierda los impares) y empieza girado 90° respecto al final del anterior
export const hand = (i) => (i % 2 === 0 ? 1 : -1);
export const theta0 = (i) => Math.PI / 2 + (i * Math.PI) / 2;
export const thetaAt = (i, x) => theta0(i) + hand(i) * Math.PI * ((x - XE(i)) / LE);
export const dTheta = (i) => (hand(i) * Math.PI) / LE;
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
