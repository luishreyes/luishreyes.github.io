// Los nombres de las piezas del homogeneizador, en español (la vista del libro) y en inglés (la lámina de la edición
// impresa). Cada rótulo: [ancla, vista ('fig' o 'det', el detalle ampliado), texto, x, y del texto, lado]. El lado dice
// por dónde llega la línea al texto: 'der' (el texto queda a la derecha de la línea) o 'izq'. Las anclas son puntos de
// build.mjs (out/homogeneizador_data.json y out/detalle_data.json); x, y van en las unidades de la vista del libro.
export const ROTULOS = [
  ['CARTER', 'fig', 'Cárter', -8, 420, 'izq'],
  ['ACOPLE', 'fig', 'Acoples de los pistones,\na 120° uno del otro', 10, 700, 'der'],
  ['PISTON', 'fig', 'Pistón', 205, 612, 'izq'],
  ['SELLOS', 'fig', 'Doble sello del pistón', 268, 650, 'izq'],
  ['BLOQUE', 'fig', 'Bloque de la bomba', 380, 676, 'izq'],
  ['VDES', 'fig', 'Válvula de descarga', 430, 76, 'izq'],
  ['TAPON', 'fig', 'Tapón de las válvulas', 470, 40, 'izq'],
  ['VSUC', 'fig', 'Válvula de succión', 478, 640, 'der'],
  ['CSUC', 'fig', 'Colector de succión', 442, 708, 'der'],
  ['ENTRADA', 'fig', 'Entrada de la leche', 672, 606, 'izq'],
  ['ACEITE1', 'fig', 'Aceite a presión', 560, 26, 'der'],
  ['ACT1', 'fig', 'Actuador hidráulico', 690, 64, 'der'],
  ['SALIDA', 'fig', 'Leche homogeneizada', 800, 130, 'der'],
  ['ETAPA2', 'fig', 'Segunda etapa', 905, 240, 'der'],
  ['CABEZAL', 'fig', 'Cabezal de homogeneización', 905, 400, 'der'],
  ['FORZADOR', 'det', 'Forzador', 935, 498, 'der'],
  ['ANILLO', 'det', 'Anillo de impacto', 935, 556, 'der'],
  ['RENDIJA', 'det', 'Rendija: unas 0,1 mm,\ndibujada 30 veces más ancha', 800, 726, 'der'],
  ['ASIENTO', 'det', 'Asiento', 680, 670, 'izq'],
];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición: la letra de 7,5 pt queda en unas 22
// unidades del dibujo, más grande que la de la vista del libro
export const ROTULOS_EN = [
  ['ACOPLE', 'fig', 'Plungers, 120° apart', 10, 700, 'der'],
  ['VDES', 'fig', 'Discharge valve', 445, 40, 'izq'],
  ['VSUC', 'fig', 'Suction valve', 478, 650, 'der'],
  ['ENTRADA', 'fig', 'Milk in', 672, 606, 'izq'],
  ['ACT1', 'fig', 'Hydraulic actuator', 600, 40, 'der'],
  ['SALIDA', 'fig', 'Homogenized milk out', 800, 110, 'der'],
  ['ETAPA2', 'fig', 'Second stage', 905, 240, 'der'],
  ['FORZADOR', 'det', 'Forcer', 935, 498, 'der'],
  ['ANILLO', 'det', 'Impact ring', 935, 556, 'der'],
  ['RENDIJA', 'det', 'Gap, about 0.1 mm,\ndrawn 30 times wider', 800, 726, 'der'],
  ['ASIENTO', 'det', 'Seat', 680, 670, 'izq'],
];

export const DESCRIPCION = 'Homogeneizador de alta presión de una máquina de leche, en isométrico y en corte. ' +
  'A la izquierda, la cara del cárter, de la que salen tres pistones de 50 milímetros; cada uno lleva un acople, y los tres acoples quedan a distinta altura de su carrera porque las manivelas van a 120 grados. ' +
  'Los pistones entran al bloque de la bomba, un bloque macizo de acero inoxidable al que se le quitó la mitad que mira al lector: se ve, cortado, el cilindro del pistón de adelante, con su cartucho de doble sello a la entrada. ' +
  'Al fondo del cilindro sube la columna de válvulas: abajo, el colector de succión, que viene de la entrada de la leche por la derecha; encima, la válvula de succión, de disco, cerrada sobre su asiento; arriba, la válvula de descarga, abierta, cada una con su resorte, y el tapón que cierra la columna. Los tapones de los otros dos cilindros asoman en la cara de arriba del bloque. ' +
  'De la cámara de descarga sale un conducto al cabezal de homogeneización, atornillado a la derecha del bloque. En la primera etapa, de eje vertical, la leche sube por el asiento, pasa por la rendija entre el asiento y el forzador, choca con el anillo de impacto y sigue a la segunda etapa, horizontal, que es igual pero trabaja a menor presión. De ahí sale hacia arriba, por un tubo con bridas. ' +
  'Cada forzador lo empuja un émbolo hidráulico; el aceite a presión, encima del émbolo, fija la fuerza. ' +
  'Un círculo amplía la primera etapa: el asiento, el forzador, el anillo de impacto y la rendija, dibujada mucho más ancha de lo que es, con el camino de la leche.';

export const DESCRIPCION_EN = 'A high-pressure milk homogenizer, in isometric, with the half that faces the reader removed. ' +
  'On the left, the crankcase face, from which three 50 mm plungers come out; the couplings of the three sit at different points of the stroke because the cranks are 120 degrees apart. ' +
  'The plungers enter the pump block, a solid stainless-steel block, cut through the front cylinder, with its double plunger seal at the entry. ' +
  'At the end of the cylinder stands the valve stack: the suction manifold at the bottom, fed by the milk inlet on the right; the suction valve, a spring-loaded disc, closed on its seat; the discharge valve above it, open; and the plug that closes the stack. ' +
  'From the discharge chamber a passage leads to the homogenizing head, bolted to the right of the block. In the first stage, vertical, the milk rises through the seat, passes the gap between the seat and the forcer, hits the impact ring and goes on to the second stage, horizontal, which is the same but works at a lower pressure, and leaves upward. ' +
  'Each forcer is pushed by a hydraulic piston; the oil pressure above the piston sets the force. ' +
  'A circle enlarges the first stage: seat, forcer, impact ring and the gap, drawn much wider than it is, with the path of the milk.';
