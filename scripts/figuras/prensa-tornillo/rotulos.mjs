// Los nombres de las piezas de la prensa de tornillo, en español (la vista del libro) y en inglés (la lámina de la
// edición impresa). Cada rótulo: [ancla, vista ('fig', o 'd', el detalle de las barras), texto, x, y del texto, lado].
// El lado dice por dónde llega la línea al texto: 'der' (el texto queda a la derecha de la línea) o 'izq'.
// Las anclas son puntos de build.mjs (out/fig_data.json y out/detalle_data.json); x, y van en las unidades de la vista
// del libro (las de la vista entera; el círculo va abajo, en la posición de libro.mjs).
export const ROTULOS = [
  // arriba
  ['HOJUELAS', 'fig', 'Hojuelas calientes, del acondicionador', 420, -46, 'der'],
  ['ALIM_MOTOR', 'fig', 'Motorreductor del alimentador', 290, -6, 'izq'],
  ['TOLVA', 'fig', 'Tolva', 290, 40, 'izq'],
  // a la izquierda
  ['MOTOR', 'fig', 'Motor', 95, 110, 'izq'],
  ['CORREAS', 'fig', 'Guarda de\nlas correas', 95, 176, 'izq'],
  ['EMPUJE', 'fig', 'Cojinete\nde empuje', 95, 262, 'izq'],
  ['CAJA', 'fig', 'Caja de\nla entrada', 95, 330, 'izq'],
  ['REDUCTOR', 'fig', 'Reductor', 95, 410, 'izq'],
  ['BASE', 'fig', 'Base de perfiles', 95, 500, 'izq'],
  // junto al alimentador
  ['ALIMENTADOR', 'fig', 'Alimentador\nde tornillo', 560, 112, 'der'],
  ['SUELTO', 'fig', 'Hojuelas\nsueltas', 560, 168, 'der'],
  ['GUSANO_ENTRADA', 'fig', 'Gusano de\nalimentación', 560, 224, 'der'],
  // sobre la jaula
  ['FILETE', 'fig', 'El paso de los filetes\nse acorta hacia la salida', 800, 112, 'der'],
  ['CUCHILLA', 'fig', 'Cuchilla', 800, 172, 'der'],
  ['COLLAR', 'fig', 'Collar', 800, 210, 'der'],
  ['CAPOTA', 'fig', 'Capota', 800, 248, 'der'],
  ['APRETADO', 'fig', 'Torta compacta', 800, 286, 'der'],
  ['NUCLEO', 'fig', 'El núcleo crece', 800, 324, 'der'],
  // a la derecha
  ['CONO', 'fig', 'Cono que regula\nla presión', 1000, 380, 'der'],
  ['HUSILLO', 'fig', 'Husillo', 1000, 440, 'der'],
  ['ANILLO', 'fig', 'Anillo de salida', 1000, 478, 'der'],
  ['VOLANTE', 'fig', 'Volante', 1000, 516, 'der'],
  ['TORTA', 'fig', 'Torta en láminas', 1000, 554, 'der'],
  ['SOPORTE', 'fig', 'Soporte del cono', 1000, 592, 'der'],
  // abajo, bajo la base
  ['BARRAS', 'fig', 'Jaula de barras planas', 445, 662, 'izq'],
  ['ACEITE_SALE', 'fig', 'Aceite crudo', 445, 702, 'izq'],
  ['GOTAS', 'fig', 'El aceite gotea\nentre las barras', 445, 742, 'izq'],
  ['BASTIDOR', 'fig', 'Bastidor', 445, 808, 'izq'],
  ['BANDEJA', 'fig', 'Bandeja del aceite', 445, 848, 'izq'],
  // el detalle
  ['D_TORTA', 'd', 'Torta con aceite\nen los poros', 925, 800, 'der'],
  ['D_RETENIDAS', 'd', 'Los sólidos\nse quedan', 925, 856, 'der'],
  ['D_RENDIJA', 'd', 'Rendija de 0,7 mm, que\nse abre hacia afuera', 925, 912, 'der'],
  ['D_BARRA', 'd', 'Barra de\n12 × 30 mm', 640, 846, 'izq'],
  ['D_GOTA', 'd', 'El aceite pasa\ny gotea', 640, 960, 'izq'],
];
// El nombre del círculo, debajo: [vista, texto, dx, dy]
export const PIES = [
  ['d', 'Dos barras de la jaula,\ncortadas de través, dieciséis\nveces más grandes', 0, 0],
];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición: la letra de 7,5 pt queda en unas 24
// unidades del dibujo, más grande que la de la vista del libro
export const ROTULOS_EN = [
  ['HOJUELAS', 'fig', 'Conditioned flakes in', 420, -46, 'der'],
  ['ALIMENTADOR', 'fig', 'Force\nfeeder', 560, 140, 'der'],
  ['REDUCTOR', 'fig', 'Gear reducer', 95, 410, 'izq'],
  ['FILETE', 'fig', 'Worm pitch shortens\ntoward the discharge', 800, 112, 'der'],
  ['CUCHILLA', 'fig', 'Knife', 800, 190, 'der'],
  ['CONO', 'fig', 'Choke cone', 1000, 390, 'der'],
  ['VOLANTE', 'fig', 'Adjusting\nhandwheel', 1000, 470, 'der'],
  ['TORTA', 'fig', 'Press cake', 1000, 556, 'der'],
  ['ACEITE_SALE', 'fig', 'Crude oil', 330, 652, 'izq'],
  ['BARRAS', 'fig', 'Barrel of flat bars', 445, 702, 'izq'],
  ['BANDEJA', 'fig', 'Oil trough', 445, 746, 'izq'],
  ['D_RETENIDAS', 'd', 'Solids held back', 925, 846, 'der'],
  ['D_RENDIJA', 'd', 'Oil passes\nthe slot', 925, 904, 'der'],
];
export const PIES_EN = [
  ['d', 'Two barrel bars, ×16', 0, 0],
];

export const DESCRIPCION = 'Prensa de tornillo para aceite (expulsor) en isométrico, sin el cuarto de arriba de la jaula que mira al lector, para ver el tornillo. ' +
  'A la izquierda, el motor sobre el reductor, con la guarda de las correas, y el soporte del cojinete de empuje. Las hojuelas calientes caen a una tolva, y un alimentador de tornillo vertical las empuja a la caja de la entrada, donde el gusano de alimentación las toma sueltas. ' +
  'El tornillo gira dentro de una jaula de barras planas sujetas por cuatro bastidores y tres tirantes; de un gusano al siguiente el paso de los filetes se acorta y el núcleo crece, y entre gusanos hay un collar y unas cuchillas fijas que bajan de la jaula. ' +
  'En la cara del corte, el material pasa de hojuelas sueltas a una torta compacta. El aceite sale por las rendijas entre las barras, gotea a una bandeja bajo la capota y sale por un tubo. ' +
  'A la salida, un cono deja una rendija anular contra el anillo de salida; el husillo, con su volante, su contratuerca y una escala, acerca o aleja el cono, y la torta sale en láminas por una canaleta. ' +
  'Un círculo amplía dos barras cortadas de través: la rendija de 0,7 milímetros por dentro se abre hacia afuera, las partículas de la torta se quedan contra ella y el aceite pasa y gotea.';

export const DESCRIPCION_EN = 'An oil screw press (expeller) in isometric, with the upper quarter of the barrel facing the reader removed to show the screw. ' +
  'On the left, the motor on top of the gear reducer, with the belt guard, and the thrust bearing housing. Hot flakes drop into a hopper, and a vertical force feeder pushes them into the feed housing, where the feed worm takes them loose. ' +
  'The screw turns inside a barrel of flat bars held by four frames and three tie rods; from one worm to the next the flight pitch shortens and the root grows, with a collar and fixed knives between worms. ' +
  'On the cut faces, the material goes from loose flakes to a compact cake. The oil leaves through the slots between the bars, drips into a trough under the hood and drains through a pipe. ' +
  'At the discharge, a choke cone leaves an annular gap against the discharge ring; the adjusting screw with its handwheel, lock nut and scale moves the cone, and the cake leaves in flakes down a chute. ' +
  'A circle enlarges two bars cut across: the slot, 0.7 millimeters inside, widens outward; the cake particles stay against it and the oil passes and drips.';
