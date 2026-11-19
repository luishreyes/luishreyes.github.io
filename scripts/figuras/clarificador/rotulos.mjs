// Los nombres de las piezas del clarificador de placas, en español (la vista del libro) y en inglés (la lámina de la
// edición impresa). Cada rótulo: [ancla, vista ('fig', o 'd', el detalle de los canales), texto, x, y del texto, lado].
// El lado dice por dónde llega la línea al texto: 'der' (el texto queda a la derecha de la línea) o 'izq'.
// Las anclas son puntos de build.mjs (out/fig_data.json y out/detalle_data.json); x, y van en las unidades de la vista
// del libro (las de la vista entera; el círculo va abajo, en la posición de libro.mjs).
export const ROTULOS = [
  // arriba
  ['PANTALLA', 'fig', 'Pantalla', 236, 22, 'izq'],
  ['MOTOR', 'fig', 'Motorreductor del barredor', 400, -14, 'der'],
  ['TRANSMISION', 'fig', 'Cadena de transmisión', 400, 26, 'der'],
  ['MENSULA', 'fig', 'Ménsula de la canaleta', 560, 66, 'der'],
  ['CANALETA', 'fig', 'Canaleta del agua clara', 560, 106, 'der'],
  ['VERTEDERO', 'fig', 'Vertederos en V', 720, 146, 'der'],
  // a la izquierda
  ['ENTRADA', 'fig', 'Agua floculada', -14, 170, 'izq'],
  ['ZONA', 'fig', 'Primer cuarto,\nsin placas', -14, 222, 'izq'],
  ['FLOCULO', 'fig', 'Flóculo que cae', -14, 286, 'izq'],
  ['DIFUSOR', 'fig', 'Muro difusor', -14, 318, 'izq'],
  ['PERSONA', 'fig', 'Persona de 1,75 m', -14, 368, 'izq'],
  ['ACTUADOR', 'fig', 'Actuador neumático', -14, 408, 'izq'],
  ['VALVULA', 'fig', 'Válvula de purga', -14, 446, 'izq'],
  ['PURGA', 'fig', 'Lodo al espesador', -14, 522, 'izq'],
  ['TOLVA', 'fig', 'Tolva de lodos', -14, 580, 'izq'],
  // a la derecha
  ['CAJA', 'fig', 'Caja de salida', 920, 240, 'der'],
  ['SALIDA', 'fig', 'Agua clara al filtro\nde doble medio', 920, 300, 'der'],
  ['PEINE', 'fig', 'Peine de las placas', 866, 384, 'der'],
  ['PLACA', 'fig', 'Placas de 1,5 m a 60°,\nseparadas 50 mm', 866, 430, 'der'],
  ['MURO', 'fig', 'Tanque de concreto', 850, 500, 'der'],
  ['ANGULO', 'fig', 'Ángulo de apoyo', 850, 540, 'der'],
  ['RUEDA', 'fig', 'Rueda dentada', 850, 604, 'der'],
  // abajo
  ['PALETA', 'fig', 'Paleta', 196, 660, 'izq'],
  ['CADENA', 'fig', 'Cadena del barredor', 256, 702, 'izq'],
  ['RIEL', 'fig', 'Riel de desgaste', 330, 744, 'izq'],
  ['MONTON', 'fig', 'Lodo arrastrado\nhacia la tolva', 420, 792, 'izq'],
  // el detalle
  ['D_PLACA', 'd', 'Placa de acero\ninoxidable', 900, 780, 'der'],
  ['D_CAE', 'd', 'El flóculo cae\na la placa', 900, 840, 'der'],
  ['D_RESBALA', 'd', 'El lodo resbala\nhacia abajo', 560, 878, 'izq'],
  ['D_SUBE', 'd', 'El agua sube', 560, 948, 'izq'],
];
// El nombre del círculo, debajo: [vista, texto, dx, dy]
export const PIES = [
  ['d', 'Dos canales entre placas,\ncatorce veces más grandes', 0, 0],
];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición: la letra de 7,5 pt queda en unas 24
// unidades del dibujo, más grande que la de la vista del libro
export const ROTULOS_EN = [
  ['ENTRADA', 'fig', 'Flocculated water in', -16, 160, 'izq'],
  ['DIFUSOR', 'fig', 'Perforated baffle', -16, 280, 'izq'],
  ['ZONA', 'fig', 'Inlet zone, no plates', -16, 230, 'izq'],
  ['PERSONA', 'fig', '1.75 m person', -16, 362, 'izq'],
  ['VALVULA', 'fig', 'Sludge blowdown', -16, 470, 'izq'],
  ['TOLVA', 'fig', 'Sludge hopper', -16, 580, 'izq'],
  ['CANALETA', 'fig', 'Launder with V-notch weirs', 540, 90, 'der'],
  ['SALIDA', 'fig', 'Settled water\nto the filter', 930, 296, 'der'],
  ['PLACA', 'fig', 'Plates at 60°,\n50 mm apart', 930, 410, 'der'],
  ['CADENA', 'fig', 'Chain-and-flight\nsludge collector', -16, 650, 'izq'],
  ['D_RESBALA', 'd', 'Sludge slides\ndown', 560, 878, 'izq'],
  ['D_SUBE', 'd', 'Water rises', 560, 948, 'izq'],
  ['D_CAE', 'd', 'Floc settles', 900, 830, 'der'],
];
export const PIES_EN = [
  ['d', 'Two channels, ×14', 0, 0],
];

export const DESCRIPCION = 'Clarificador de placas en isométrico, sin el muro que mira al lector: un tanque rectangular de concreto de 1,3 por 5,1 metros con 3,6 metros de agua. ' +
  'A la izquierda entra el agua floculada por un tubo a una cámara angosta y pasa por los 21 orificios de un muro difusor que la reparte en toda la sección. El primer cuarto del tanque no lleva placas: ahí cae el flóculo pesado y van las ruedas del barredor. ' +
  'Una pantalla separa la zona de entrada del agua clara. En los tres cuartos de atrás, 52 placas de acero inoxidable de 1,5 metros, inclinadas a 60 grados y separadas 50 milímetros, apoyadas en dos ángulos y con un peine arriba: el agua corre bajo el paquete y sube entre las placas, y el lodo resbala por ellas hacia abajo. ' +
  'Arriba, una canaleta con vertederos en V a los dos lados, colgada de ménsulas en el muro de atrás, recoge el agua clara y la lleva a una caja afuera del muro de la salida, de donde sale por un tubo al filtro. ' +
  'En el fondo, un barredor de cadenas y paletas, con cuatro ruedas dentadas y un motorreductor sobre el muro que lo mueve con una cadena, arrastra el lodo por el piso hasta una tolva bajo la zona de entrada; de la tolva sale por un tubo con una válvula de cuchilla y actuador neumático hacia el espesador. Junto a la válvula, en el piso, una persona de 1,75 metros da la escala. ' +
  'Un círculo amplía dos canales entre placas: el agua sube por el centro, el flóculo cae a la placa de abajo y el lodo resbala pegado a ella.';

export const DESCRIPCION_EN = 'A plate settler in isometric, with the wall facing the reader removed: a rectangular concrete tank 1.3 by 5.1 meters with 3.6 meters of water. ' +
  'On the left, flocculated water enters a narrow chamber and passes the 21 ports of a perforated baffle wall that spreads it over the whole section. The first quarter of the tank has no plates. ' +
  'A baffle separates the inlet zone from the settled water. In the last three quarters, 52 stainless steel plates, 1.5 meters long, at 60 degrees and 50 millimeters apart: the water flows under the pack and rises between the plates, and the sludge slides down them. ' +
  'On top, a launder with V-notch weirs on both sides collects the settled water and takes it to an outlet box and the filter. ' +
  'On the floor, a chain-and-flight collector drags the sludge to a hopper under the inlet zone, which is blown down through a knife gate valve to the thickener. A 1.75 meter person stands by the valve for scale. ' +
  'A circle enlarges two channels between plates: the water rises, the floc settles on the lower plate and the sludge slides down along it.';
