// Los nombres de las piezas de la separadora de discos, en español (la vista del libro) y en inglés (la lámina de la
// edición impresa). Cada rótulo: [ancla, vista ('fig', o 'd', el detalle del canal entre dos discos), texto, x, y del
// texto, lado]. El lado dice por dónde llega la línea al texto: 'der' (el texto queda a la derecha de la línea) o 'izq'.
// Las anclas son puntos de build.mjs (out/fig_data.json y out/detalle_data.json); x, y van en las unidades de la vista
// del libro (las de la vista entera; el círculo va abajo a la izquierda, en la posición de libro.mjs).
export const ROTULOS = [
  // a la izquierda, arriba: la persona de referencia
  ['PERSONA', 'fig', 'Persona\nde 1,75 m', -215, -262, 'der'],
  // arriba
  ['ALIMENTACION', 'fig', 'Entra la mezcla (aceite con agua,\no leche entera), por gravedad', 530, -44, 'der'],
  // a la izquierda, arriba (sobre el motor)
  ['FLUJO_LIVIANO', 'fig', 'Sale el liviano\n(aceite o crema)', 285, 26, 'izq'],
  ['GRAVEDAD', 'fig', 'Disco de gravedad', 245, 146, 'izq'],
  ['BOMBA_LIVIANO', 'fig', 'Bomba centrípeta\ndel liviano', 245, 184, 'izq'],
  ['DISCO_ARRIBA', 'fig', 'Disco de arriba', 245, 248, 'izq'],
  ['ZONA_NEUTRA', 'fig', 'Zona neutra', 245, 286, 'izq'],
  ['LIVIANO', 'fig', 'Liviano: aceite (o crema)', 245, 324, 'izq'],
  ['DISCOS', 'fig', 'Pila de discos', 245, 362, 'izq'],
  // a la izquierda, abajo, más afuera (el motor queda en medio)
  ['PESADO', 'fig', 'Pesado: agua\n(o leche descremada)', 60, 448, 'izq'],
  ['SOLIDO', 'fig', 'Sólido en la cámara', 60, 512, 'izq'],
  ['SELLO', 'fig', 'Anillo de sello', 60, 550, 'izq'],
  ['LUMBRERA', 'fig', 'Lumbreras de descarga', 60, 588, 'izq'],
  ['MOTOR', 'fig', 'Motor', 60, 626, 'izq'],
  ['FONDO_MOVIL', 'fig', 'Fondo móvil', 60, 664, 'izq'],
  ['SOLENOIDE', 'fig', 'Válvula del agua\nde maniobra', 60, 702, 'izq'],
  ['MANIOBRA', 'fig', 'Agua de maniobra', 60, 766, 'izq'],
  // a la derecha, arriba
  ['TUBO', 'fig', 'Tubo fijo de\nalimentación', 745, 40, 'der'],
  ['CAJA', 'fig', 'Caja de salidas', 745, 106, 'der'],
  ['FLUJO_PESADO', 'fig', 'Sale el pesado (agua\no leche descremada)', 745, 146, 'der'],
  ['BOMBA_PESADO', 'fig', 'Bomba centrípeta\ndel pesado', 745, 214, 'der'],
  ['CAPOTA', 'fig', 'Capota del bastidor', 745, 278, 'der'],
  ['TAPA_TAZON', 'fig', 'Capota del tazón', 745, 316, 'der'],
  ['DISTRIBUIDOR', 'fig', 'Distribuidor', 745, 354, 'der'],
  // a la derecha, junto al ciclón
  ['AGUJEROS', 'fig', 'Agujeros de\ndistribución', 905, 404, 'der'],
  ['ANILLO', 'fig', 'Anillo de cierre', 905, 468, 'der'],
  ['DUCTO', 'fig', 'Colector y ducto\ndel sólido', 905, 506, 'der'],
  ['CUERPO', 'fig', 'Cuerpo del tazón', 905, 570, 'der'],
  ['CICLON', 'fig', 'Ciclón del sólido', 905, 608, 'der'],
  ['BASTIDOR', 'fig', 'Bastidor', 905, 646, 'der'],
  ['SALIDA_SOLIDO', 'fig', 'Sale el sólido', 905, 704, 'der'],
  ['COJIN', 'fig', 'Cojines de caucho', 905, 800, 'der'],
  // abajo, bajo el piso
  ['SINFIN', 'fig', 'Tornillo sin fin', 600, 1016, 'der'],
  ['RODAMIENTO_CUELLO', 'fig', 'Rodamiento del cuello', 600, 940, 'der'],
  ['RUEDA', 'fig', 'Rueda de bronce', 600, 978, 'der'],
  ['EJE', 'fig', 'Eje del tazón', 600, 1054, 'der'],
  // el detalle
  ['D_GOTA_AGUA', 'd', 'Gota de agua', 290, 806, 'der'],
  ['D_ACEITE', 'd', 'El aceite va hacia\nel eje por la cara\nde arriba del\ndisco de abajo', 290, 850, 'der'],
  ['D_AGUA', 'd', 'El agua y el sólido van\nhacia afuera por la cara\nde abajo del disco de arriba', 15, 812, 'izq'],
  ['D_NEUTRA', 'd', 'Zona neutra', 15, 912, 'izq'],
  ['D_GOTA_ACEITE', 'd', 'Gota de aceite', 15, 972, 'izq'],
];
// El nombre del círculo, debajo: [vista, texto, dx, dy]
export const PIES = [
  ['d', 'El canal entre dos discos, nueve veces\nmás grande (las gotas, mucho más)', 0, 0],
];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición
export const ROTULOS_EN = [
  ['ALIMENTACION', 'fig', 'Feed in', 530, -40, 'der'],
  ['FLUJO_LIVIANO', 'fig', 'Light phase out', 285, 30, 'izq'],
  ['GRAVEDAD', 'fig', 'Gravity disc', 245, 150, 'izq'],
  ['BOMBA_LIVIANO', 'fig', 'Paring disc', 245, 196, 'izq'],
  ['ZONA_NEUTRA', 'fig', 'Neutral zone', 245, 280, 'izq'],
  ['DISCOS', 'fig', 'Disc stack', 245, 340, 'izq'],
  ['SOLIDO', 'fig', 'Sludge space', 60, 440, 'izq'],
  ['FONDO_MOVIL', 'fig', 'Sliding bowl\nbottom', 60, 566, 'izq'],
  ['MOTOR', 'fig', 'Motor', 60, 642, 'izq'],
  ['MANIOBRA', 'fig', 'Operating water', 60, 702, 'izq'],
  ['FLUJO_PESADO', 'fig', 'Heavy phase out', 745, 150, 'der'],
  ['BOMBA_PESADO', 'fig', 'Paring disc', 745, 214, 'der'],
  ['DISTRIBUIDOR', 'fig', 'Distributor', 745, 330, 'der'],
  ['AGUJEROS', 'fig', 'Distribution\nholes', 905, 410, 'der'],
  ['LUMBRERA', 'fig', 'Discharge port', 60, 500, 'izq'],
  ['CICLON', 'fig', 'Sediment\ncyclone', 905, 600, 'der'],
  ['SINFIN', 'fig', 'Worm gear', 600, 990, 'der'],
  ['PERSONA', 'fig', '1.75 m\nperson', -215, -262, 'der'],
  ['D_ACEITE', 'd', 'Light phase\nmoves in', 290, 840, 'der'],
  ['D_AGUA', 'd', 'Heavy phase and\nsolids move out', 15, 820, 'izq'],
];
export const PIES_EN = [
  ['d', 'Between two discs, ×9', 0, 0],
];

export const DESCRIPCION = 'Separadora centrífuga de discos autodeslodante en isométrico, cortada por un plano que pasa por el eje, sin la mitad que mira al lector, puesta como purificadora de aceite. ' +
  'Abajo, el bastidor de fundición sobre cojines de caucho; el motor horizontal mueve un eje con un freno y una rueda de bronce que engrana con el tornillo sin fin del eje vertical del tazón, que gira en un rodamiento abajo y otro en el cuello. ' +
  'La mezcla entra por gravedad por un tubo fijo, baja al distribuidor, sale bajo la pila de discos y sube por los agujeros alineados de los discos. Entre cada dos discos el aceite, el liviano, va hacia el eje, sube junto al distribuidor y sale por una bomba centrípeta hacia el tubo de la izquierda; el agua, el pesado, va hacia afuera, sube entre el disco de arriba y la capota del tazón, pasa sobre el disco de gravedad y sale por otra bomba centrípeta hacia el tubo de la derecha. La zona neutra entre los dos queda a la altura de los agujeros. ' +
  'El sólido se junta contra la pared, en la cámara del diámetro mayor. El fondo móvil, apretado arriba por el agua de maniobra, baja una fracción de segundo cuando se vacía esa agua, y el sólido sale por las lumbreras al bastidor, que lo lleva por un ducto a un ciclón. A la izquierda, una persona de 1,75 m, de pie en el piso del lado del motor, da la escala. ' +
  'Un círculo amplía el canal entre dos discos: las gotas de agua y el sólido van hacia afuera por la cara de abajo del disco de arriba, y las de aceite hacia el eje por la cara de arriba del disco de abajo.';

export const DESCRIPCION_EN = 'A self-cleaning disc-stack separator in isometric, cut by a plane through the axis with the half facing the reader removed, set up as an oil purifier. ' +
  'Below, the cast frame on rubber cushions; the horizontal motor drives a shaft with a brake and a bronze wheel that meshes with the worm on the vertical bowl spindle, which runs in a lower bearing and a neck bearing. ' +
  'The feed enters by gravity through a stationary pipe, drops to the distributor, leaves under the disc stack and rises through the aligned holes of the discs. Between each pair of discs the oil, the light phase, moves toward the axis, rises along the distributor and leaves through a paring disc to the pipe on the left; the water, the heavy phase, moves outward, rises between the top disc and the bowl hood, passes over the gravity disc and leaves through a second paring disc to the pipe on the right. The neutral zone between them sits at the holes. ' +
  'Solids collect against the wall in the space at the largest diameter. The sliding bowl bottom, held up by operating water, drops for a fraction of a second when that water drains, and the solids leave through the ports into the frame and through a duct to a cyclone. On the left, a 1.75 m figure stands on the floor on the motor side for scale. ' +
  'A circle enlarges the channel between two discs: water droplets and solids move outward along the underside of the upper disc, and oil droplets move inward along the top of the lower disc.';
