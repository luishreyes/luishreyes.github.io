/* Medidas de los siete impulsores del capítulo 14 del libro de operaciones unitarias (Agitación). Unidades: 1 = 1 mm,
   z hacia arriba, el eje del impulsor en x = y = 0 y el plano medio de las palas en z = 0.
   Las proporciones salen de las fuentes del capítulo (la página va al lado); lo demás es «medida del libro»: típico de
   un impulsor así, escogido para la figura. El README lleva la misma lista.

   Las cinco turbinas (hélice, palas inclinadas, hidrofoil, Rushton y paleta) van con el mismo diámetro, D = 450 mm,
   para que se comparen: 18 in es lo más grande que se hace una hélice (McCabe, p. 261). El ancla y la cinta van en su
   tamaño de pared, dentro de un tanque de T = 1200 mm del que se ve la mitad de atrás. */
export const D = 450, R = D / 2;

// lo que comparten las turbinas (medida del libro): eje de 50 mm, chaveta de 14 × 9 (la de un eje de 50 mm), prisioneros
// M12 de cabeza hueca y el perno del extremo del eje con su arandela
export const COMUN = {
  AZ: 52, EL: 28,
  sh: { r: 25, top: 270 },                 // el eje sube hasta z = top, donde se corta
  key: { w: 14, out: 3.5, len: 34, r0: 24 },  // chaveta: ancho, lo que sobresale del eje, largo a la vista, cara de abajo
  set: { r: 6, hex: 3 },                    // prisionero M12: radio del agujero y de la llave hexagonal
};

// hélice marina de tres palas, paso igual al diámetro (paso cuadrado, McCabe p. 261 y tabla 9.2, p. 278); fundida en una
// pieza con su cubo (Paul, p. 354). El contorno, el sesgo y los espesores de las palas son medida del libro.
export const HELICE = {
  n: 3, pitch: D,
  hub: { r: 45, z0: -58, z1: 58, ch: 4 },
  cmax: 0.70 * R, skew: 0.30 * R, t0: 12, t1: 3,
  nut: { r: 19, h: 16 }, washer: { r: 30, h: 4 },
};

// turbina de cuatro palas inclinadas a 45°, palas de W = D/5 (McCabe, tabla 9.2, p. 278; la del caso del capítulo);
// las palas van empernadas a orejas soldadas al cubo (Paul, p. 354). Cubo cuadrado, orejas, pernos M10: medida del libro.
export const PBT = {
  n: 4, ang: 45, W: D / 5, t: 8, r0: 70,
  hub: { h: 46, rc: 6, z0: -62, z1: 62 },
  lug: { t: 10, w: 64, r1: 128 },
  bolts: [86, 114], bolt: { r: 9.2, h: 7, nut: 8, tail: 6, tr: 5 },
  washer: { r: 32, h: 5 }, cap: { r: 13.9, h: 10 },
  phase: 14,
};

// hidrofoil genérico de tres palas: anchas en el cubo y angostas en la punta (McCabe, p. 264), torcidas y con curvatura,
// con menos inclinación en la punta que en el cubo, lo que da un paso casi constante (Paul, p. 357). Los ángulos
// (42° junto al cubo, 20° en la punta), las cuerdas y la curvatura son medida del libro.
export const HIDRO = {
  n: 3, tipAng: 20, flatR: 0.4 * R, c0: 112, c1: 58, camber: 0.05, t0: 10, t1: 4,
  hub: { r: 40, z0: -52, z1: 52, ch: 3 },
  washer: { r: 30, h: 4 }, cap: { r: 13.9, h: 10 },
  phase: 22,
};

// turbina Rushton: disco con seis palas planas verticales de largo L = D/4 y alto W = D/5 (McCabe, tabla 9.2, p. 278, y
// p. 262; Paul, p. 356), disco de 0,75 D (Paul da 0,66 y 0,75 D, p. 356), así media pala queda sobre el disco. Las palas
// van ranuradas sobre el borde del disco y empernadas a dos soportes soldados, uno arriba y otro abajo: medida del libro,
// como los espesores y el cubo.
export const RUSHTON = {
  n: 6, W: D / 5, L: D / 4, disc: { r: 0.375 * D, t: 8 }, t: 8,
  hub: { r: 45, h: 76 },
  clip: { t: 6, r0: 122, r1: 162, h: 30 },
  bolts: [132, 152], bolt: { r: 7.5, h: 5.5, nut: 6.5, tail: 5, tr: 4 },
  washer: { r: 30, h: 4 }, cap: { r: 13.9, h: 10 },
  phase: 10,
};

// paleta plana de dos palas verticales de W = D/5 (McCabe, tabla 9.2, p. 278: «paleta plana, dos palas»), empernadas a
// orejas soldadas al cubo. Orejas, pernos y espesores: medida del libro.
export const PALETA = {
  n: 2, W: D / 5, t: 10, r0: 82,
  hub: { r: 45, z0: -70, z1: 70, ch: 3 },
  lug: { t: 12, h: 76, r1: 142 },
  bolts: [[98, -22], [98, 22], [126, -22], [126, 22]], bolt: { r: 9.2, h: 7, nut: 8, tail: 6, tr: 5 },
  washer: { r: 32, h: 5 }, cap: { r: 13.9, h: 10 },
  phase: 28,
};

// el tanque de las dos de pared (medida del libro): T = 1200 mm, pared de 8 mm, fondo elíptico 2:1 como el del caso
export const TANQUE = { T: 1200, Rt: 600, w: 8, hd: 300, top: 1290 };

// ancla: D = 0,95 T, holgura C = 2,5 % de T, dos brazos verticales de ancho W = D/10 y alto H = D (Perry, p. 18‑28).
// El fondo sigue el del tanque con la misma holgura; cubo abajo, tirantes y collar arriba: medida del libro.
export const ANCLA = {
  AZ: 64, EL: 24,
  D: 0.95 * TANQUE.T, C: 0.025 * TANQUE.T, W: (0.95 * TANQUE.T) / 10, t: 16,
  sh: { r: 40, top: 1440 }, hub: { r: 58, z0: -282, z1: -112 }, collar: { r: 58, z0: 790, z1: 892 },
  stay: { h: 52 },
  cap: { r: 22, h: 14 },
};

// cinta helicoidal doble: dos cintas, D = 0,95 T, ancho W = D/10, paso igual a D y alto H = D (Perry, p. 18‑29). Brazos,
// collares y espesores: medida del libro.
export const CINTA = {
  AZ: 64, EL: 30,
  D: 0.95 * TANQUE.T, W: (0.95 * TANQUE.T) / 10, t: 16, z0: 40,
  sh: { r: 40, top: 1440 }, collar: { r: 60, h: 64 }, arm: { w: 36 },
  cap: { r: 22, h: 14 },
};
