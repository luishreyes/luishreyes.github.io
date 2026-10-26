/* Medidas del divisor de rifles del capítulo 5 del libro de operaciones unitarias.
   Unidades: 1 = 1 mm. x a lo largo de la fila de canaletas, y hacia el lector, z hacia arriba.
   Doce canaletas de 25 mm, un número par para que las dos mitades tengan las mismas; pisos a 45°. */
export const DR = {
  AZ: 135, EL: 35.264,          // isométrico verdadero
  N: 12, w: 25, t: 1.5,         // canaletas: número, ancho y espesor de los tabiques
  L: 300,                       // largo de la fila (N · w)
  Y: 60,                        // media profundidad de la fila de canaletas
  zTop: 270, zLow: 150,         // alturas del piso de una canaleta en su entrada y en su salida (45°)
  lip: 15,                      // labio de salida, más allá del costado
  skirt: 210,                   // borde inferior de los faldones de los costados
  hop: { z1: 330, rim: 8 },     // tolva: altura del borde y ancho del reborde
  endT: 3,                      // espesor de las paredes de los extremos
  leg: 15,                      // tubo cuadrado de las patas
  pan: { x0: 16, x1: 284, y0: 40, y1: 165, h: 45 },
  heap: { y: 102, r: 54, h: 40 },
};
