/* Medidas de la sección de reacción de la planta de benceno (capítulo 2 del libro de operaciones unitarias).
   Las comparten el isométrico (build.mjs) y las vistas de planta, de elevación y el isométrico de tubería (libro.mjs).
   Unidades: 1 = 10 cm. x hacia el este, y hacia el sur (hacia el lector en el isométrico), z hacia arriba.
   El rack de tuberías corre de oeste a este por el centro; al norte va la parte caliente y al sur la fría.
   La disposición, las distancias mínimas y la fuente de cada medida están en notas/figuras-isometricas.md del libro. */
export const PB = {
  AZ: 135, EL: 35.264,   // isométrico verdadero: elevación de arctan(1/√2); los tres ejes se acortan igual
  // rack: pórticos cada 6 m, 5 m de ancho, vigas a 5,5 m
  RACK: { xs: [-15, 45, 105, 165, 225, 285], y: 25, z: 52, t: 3, c: 3, x0: -40, x1: 305 },
  LANE: { feed: -16, hps: -10, cws: -3, purge: 4, recycle: 11, flare: 18 },   // carriles de las líneas sobre el rack (y)
  CROSS: 70,                                              // altura de las líneas que cruzan el rack
  // equipos (centro en planta y alturas)
  H101: { x: 18, y: -88, R: 18, leg: 15, z0: 17, z1: 92, cone: 104, rs: 5, stack: 160 },
  E101: { y: -66, z: 24, R: 5, x0: 62, x1: 102, ch: 8 },
  R101: { x: 135, y: -70, R: 12, z0: 24, z1: 144, hd: 6 },
  E102: { y: 52, z: 28, R: 7, x0: 150, x1: 206, ch: 9 },
  V102: { x: 247, y: 52, R: 6, z0: 24, z1: 58, hd: 3 },
  // compresores con el motor al oeste y la carcasa al este (así la bajada a B no cae sobre el motor de A en pantalla)
  C101: { ys: [112, 140], m0: 214, m1: 238, mR: 6, x0: 244, x1: 262, R: 7, z: 13 },
  // tuberías (radio exterior dibujado)
  r: { big: 1.5, mid: 1.1, small: 0.7 },
  // la persona de referencia (../persona.mjs, 1,75 m), de pie en el piso al sureste de los compresores y mirando
  // hacia ellos; rumbo en grados desde +x hacia +y. Solo va en el isométrico. Medida del libro.
  persona: { x: 255, y: 168, rumbo: 225 },
};
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
// cabeza 2:1: profundidad a radio r
export const headDepth = (r, R, h) => h * Math.sqrt(Math.max(0, 1 - (r * r) / (R * R)));
