/* Medidas del florentino del capítulo 16 del libro de operaciones unitarias (Sedimentación y decantación): el
   decantador que separa el condensado del arrastre de vapor de la planta de aceite esencial de cáscara de cítricos
   (agua con un 1,3 % de aceite, casi todo d-limoneno, más liviano que el agua) en aceite y agua. Unidades: 1 = 1 mm.
   z hacia arriba, desde el piso; el eje del recipiente en x = y = 0. El corte quita lo que mira al lector por encima
   del fondo (y > 0 y z > ZF): el fondo plano queda entero y el resto se ve por el plano y = 0.
   - Del caso del capítulo (herramientas/decantadores.py del libro): diámetro interior de 550 mm, H = 2D = 1100 mm, la
     interfase a z₃ = 890 mm, el rebose del aceite a z₁ = 990 mm y el codo de la pierna del agua a z₂ = 975 mm, todas
     desde el fondo por dentro.
   - De las fuentes: la forma del vaso florentino (Başer y Buchbauer, 2010, fig. 4.17: cilindro cerrado, entrada por
     un tubo central que baja hasta cerca de media altura, aceite arriba, pierna exterior que toma el agua del fondo),
     la pierna y la regla H = 2D (Towler y Sinnott, 2022, pp. 605–608) y el rompe-sifón (Perry, 7.ª ed., p. 15-26).
   Lo demás (espesores, bridas, tubos, mirilla, patas, posiciones de las boquillas) es dibujo: una elección plausible
   para un florentino de 0,55 m, no un dato. Tubo de acero inoxidable cédula 10S y bridas ASME B16.5, clase 150. */
export const FL = {
  AZ: 52, EL: 24,
  R: 275, tw: 3,                              // radio interior y pared
  ZF: 420,                                    // cara de adentro del fondo, sobre el piso
  tb: 8, RB: 290,                             // el fondo plano: espesor y radio (sobresale 12 mm de la envolvente)
  H: 1140,                                    // del fondo a la tapa: H = 2D = 1100 más 40 mm, unos 150 mm sobre el rebose
  z1: 990, z2: 975, z3: 890,                  // rebose del aceite, codo de la pierna e interfase, desde el fondo
  flange: { rf: 325, t: 16 },                 // brida de la envolvente (anillo soldado arriba)
  cover: { t: 12 },                           // la tapa plana
  bolts: { bc: 302, n: 16, af: 19, h: 10 },   // pernos de la tapa: círculo, número, tuerca (entre caras) y su alto
  /* el tubo de calma DN 80, que cuelga de la tapa hasta 500 mm del fondo, y el deflector bajo su boca */
  calm: { z0: 500, up: 80, holes: 1055 },     // boca de abajo, cuello sobre la tapa y los agujeros del venteo
  defl: { r: 100, t: 6, gap: 60, bar: [30, 6], over: 40 },
  inlet: { up: 170, run: 420 },               // la entrada DN 32: sube de la brida ciega y va hacia la izquierda
  vent: { r: 185, deg: 290, h: 90, up: 150, over: 96, down: 80 },  // venteo DN 25 en la tapa, con el codo hacia abajo
  /* la pierna del agua DN 32: sale a 50 mm del fondo, baja, da la vuelta en U y sube por fuera hasta el codo de
     rebose, 15 mm bajo el rebose del aceite; de ahí baja al hidrolato. El rompe-sifón sube del codo y entra al espacio
     de cabeza */
  leg: { deg: -30, z: 50, neck: 62, r1: 430, zU: -130, rR: 535, out: 120, zT: -170, vz: 1080, slide: [720, 840] },
  sight: { deg: -16, z0: 780, z1: 960, neck: 66 },  // mirilla de tubo de vidrio con sus dos llaves
  purge: { deg: 183, z: 890, neck: 52 },      // purga de la interfase (DN 15), a la izquierda
  earth: { deg: -2, z: 105 },                 // borne de puesta a tierra
  oil: { deg: 190, neck: 112, down: 230 },    // el rebose del aceite DN 40 (el fondo del agujero a z₁)
  legs: { r: 200, degs: [90, 210, 330], dn: 50, pad: 46, padt: 8, plate: 80, pt: 12 },
};
/* tubo de acero inoxidable cédula 10S y bridas deslizantes ASME B16.5 clase 150: radio exterior e interior del tubo,
   radio y espesor de la brida, radio del círculo de pernos y número de pernos */
export const DN = {
  15: { ro: 10.65, ri: 8.55, fl: 44.45, ft: 11.2, bc: 30.15, nb: 4 },
  25: { ro: 16.7, ri: 13.9, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  32: { ro: 21.1, ri: 18.3, fl: 58.75, ft: 15.7, bc: 44.45, nb: 4 },
  40: { ro: 24.15, ri: 21.35, fl: 63.5, ft: 17.5, bc: 49.2, nb: 4 },
  50: { ro: 30.15, ri: 27.4, fl: 76.2, ft: 19.1, bc: 60.35, nb: 4 },
  80: { ro: 44.45, ri: 41.4, fl: 95.25, ft: 23.9, bc: 76.2, nb: 4 },
};
export const RO = FL.R + FL.tw;
export const ZF = FL.ZF;
export const ZT = FL.ZF + FL.H;                    // cara de abajo de la tapa (cara de arriba de la brida)
export const ZTC = ZT + FL.cover.t;                // cara de arriba de la tapa
export const Z1 = ZF + FL.z1, Z2 = ZF + FL.z2, Z3 = ZF + FL.z3;
/* dentro del tubo de calma no hay aceite: es agua del condensado que baja, y su columna equilibra la de afuera
   (890 mm de agua y 100 de aceite), así que su nivel queda unos 15 mm bajo el rebose del aceite, como la pierna */
export const RHO = { agua: 998.1, aceite: 844.8 };
export const ZW = Z3 + ((FL.z1 - FL.z3) * RHO.aceite) / RHO.agua;
// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// un rectángulo (x0..x1, z0..z1) como polígono
export const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
