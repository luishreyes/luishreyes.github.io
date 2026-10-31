// Los nombres de las piezas del congelador de lecho fluidizado, en español (la vista del libro) y en inglés (la lámina
// de la edición impresa). Cada rótulo: [ancla, vista ('fig', o 'd1' y 'd2', las etapas ampliadas), texto, x, y del
// texto, lado]. El lado dice por dónde llega la línea al texto: 'der' (el texto queda a la derecha de la línea) o 'izq'.
// Las anclas son puntos de build.mjs (out/fig_data.json, out/detalle1_data.json y out/detalle2_data.json); x, y van en
// las unidades de la vista del libro (las de la vista entera; los círculos van abajo, en las posiciones de libro.mjs).
export const ROTULOS = [
  // arriba
  ['PANEL', 'fig', 'Panel de poliuretano con piel de acero', 120, -58, 'der'],
  ['LECHO1', 'fig', 'Primera etapa: el aire levanta las arvejas\ny les congela la costra', 296, -18, 'der'],
  ['VERTEDERO', 'fig', 'Vertedero', 412, 52, 'der'],
  // a la izquierda
  ['ENTRADA', 'fig', 'Arvejas escaldadas', -4, 62, 'izq'],
  ['BANDEJA', 'fig', 'Alimentador vibratorio', -4, 122, 'izq'],
  ['VIBRADOR', 'fig', 'Motovibrador', -4, 180, 'izq'],
  ['BALLESTA', 'fig', 'Ballestas', -4, 236, 'izq'],
  ['BANDA1', 'fig', 'Banda perforada', -4, 300, 'izq'],
  ['LEVAS', 'fig', 'Eje de levas que\nsacude la banda', -4, 350, 'izq'],
  ['RODETE', 'fig', 'Ventilador axial', -4, 430, 'izq'],
  // a la derecha
  ['ROCIADOR', 'fig', 'Rociador del deshielo', 906, 92, 'der'],
  ['SERPENTIN', 'fig', 'Evaporador, con escarcha\nen las aletas', 906, 138, 'der'],
  ['SUCCION', 'fig', 'Líneas del refrigerante', 906, 206, 'der'],
  ['TABIQUE', 'fig', 'Tabique', 906, 248, 'der'],
  ['AIRE', 'fig', 'Aire a −30 °C', 906, 292, 'der'],
  ['LECHO2', 'fig', 'Segunda etapa: capa quieta\nde 10 cm', 906, 342, 'der'],
  ['TAMBOR', 'fig', 'Tambor de la banda', 906, 414, 'der'],
  ['SALIDA', 'fig', 'Arvejas congeladas (IQF)', 906, 470, 'der'],
  // abajo
  ['MOTOR', 'fig', 'Motor del ventilador', 600, 630, 'der'],
  ['SUMIDERO', 'fig', 'Sumidero del deshielo', 600, 666, 'der'],
  // las etapas ampliadas
  ['D_SALTA', 'd1', 'Arvejas en el aire', -16, 520, 'izq'],
  ['D_BURBUJA', 'd1', 'Burbuja', -16, 568, 'izq'],
  ['D_ARVEJA', 'd1', 'Arveja de 6 mm', -16, 616, 'izq'],
  ['D_AIRE', 'd1', 'Aire que sube', -16, 664, 'izq'],
  ['D_CAPA', 'd2', '10 cm de arvejas quietas', 560, 728, 'der'],
  ['D_BARRA', 'd2', 'Rejilla bajo la banda', 560, 790, 'der'],
];
// El nombre de cada círculo, debajo: [vista, texto, dx, dy]
export const PIES = [
  ['d1', 'Primera etapa, diez veces\nmás grande', 0, 0],
  ['d2', 'Segunda etapa, diez veces\nmás grande', 0, 0],
];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición: la letra de 7,5 pt queda en unas 22
// unidades del dibujo, más grande que la de la vista del libro
export const ROTULOS_EN = [
  ['LECHO1', 'fig', 'Stage 1: fluidized bed\n(the crust freezes)', 296, -30, 'der'],
  ['ENTRADA', 'fig', 'Blanched peas in', -4, 70, 'izq'],
  ['BANDEJA', 'fig', 'Vibrating feeder', -4, 140, 'izq'],
  ['VERTEDERO', 'fig', 'Weir', 412, 52, 'der'],
  ['BANDA1', 'fig', 'Perforated belt', -4, 300, 'izq'],
  ['LEVAS', 'fig', 'Belt shaker', -4, 360, 'izq'],
  ['RODETE', 'fig', 'Axial fan', -4, 430, 'izq'],
  ['SERPENTIN', 'fig', 'Evaporator coil,\nfrosted fins', 906, 120, 'der'],
  ['AIRE', 'fig', 'Air at −30 °C', 906, 280, 'der'],
  ['LECHO2', 'fig', 'Stage 2: 10 cm\nfixed bed', 906, 340, 'der'],
  ['SALIDA', 'fig', 'IQF peas out', 906, 470, 'der'],
  ['D_BURBUJA', 'd1', 'Bubble', -16, 568, 'izq'],
  ['D_ARVEJA', 'd1', '6 mm pea', -16, 620, 'izq'],
  ['D_CAPA', 'd2', '10 cm of\nresting peas', 560, 728, 'der'],
];
export const PIES_EN = [
  ['d1', 'Stage 1, ×10', 0, 0],
  ['d2', 'Stage 2, ×10', 0, 0],
];

export const DESCRIPCION = 'Congelador de lecho fluidizado de dos etapas para arvejas, en isométrico, sin el techo ni la pared que mira al lector. ' +
  'A la izquierda, afuera, el alimentador vibratorio: una bandeja sobre ballestas, con un motovibrador a cada lado, deja caer las arvejas escaldadas por una ranura de la pared. ' +
  'Adentro, la primera etapa: una banda perforada con una capa delgada de arvejas que el aire levanta; el lecho borbotea, con burbujas, y las arvejas saltan. Un eje de levas debajo de la banda la sacude. Al final, un vertedero fija la altura del lecho y las arvejas caen a la segunda banda, más baja y más larga, donde forman una capa quieta de 10 centímetros que sale por un canal en la pared derecha. ' +
  'Debajo de las bandas, una cubierta con cuatro ventiladores axiales, con el motor colgado debajo, empuja el aire hacia arriba a través de las bandas y de las arvejas. Arriba, el aire pasa sobre un tabique y baja por las aletas del evaporador, cubiertas de escarcha, con el rociador del deshielo encima y las líneas del refrigerante que salen por la pared de atrás; por detrás del tabique vuelve a los ventiladores. ' +
  'Las paredes y el piso son paneles de poliuretano con piel de acero. Dos círculos amplían diez veces las dos etapas: en la primera, arvejas de 6 milímetros separadas, con burbujas y arvejas en el aire; en la segunda, una capa apretada y quieta sobre la banda perforada, con el aire que sube entre las arvejas.';

export const DESCRIPCION_EN = 'A two-stage fluidized-bed freezer for peas, in isometric, with the roof and the wall facing the reader removed. ' +
  'Outside on the left, a vibrating feeder on leaf springs drops the blanched peas through a slot in the wall. ' +
  'Inside, the first stage: a perforated belt with a shallow layer of peas lifted by the air; the bed bubbles and the peas jump. A cam shaft under the belt shakes it. At the end, a weir sets the bed height and the peas fall to the second belt, lower and longer, where they form a 10 cm fixed layer that leaves through a chute in the right wall. ' +
  'Below the belts, a deck with four axial fans, each with its motor hanging underneath, pushes the air up through the belts and the peas. Above, the air passes over a partition and down through the frosted fins of the evaporator coil, with the defrost spray header above it; behind the partition it returns to the fans. ' +
  'Two circles enlarge both stages ten times: separate 6 mm peas, bubbles and peas in the air in the first; a tight, still layer on the perforated belt in the second.';
