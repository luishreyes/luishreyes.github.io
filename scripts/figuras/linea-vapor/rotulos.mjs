// Los nombres de las piezas de la línea de vapor, en español (la vista del libro) y en inglés (la lámina de la edición
// impresa). Cada rótulo: [ancla, vista ('fig', o 'd', el detalle de la pared), texto, x, y del texto, lado]. El lado
// dice por dónde llega la línea al texto: 'der' (el texto queda a la derecha de la línea) o 'izq'. Las anclas son
// puntos de build.mjs (out/fig_data.json y out/detalle_data.json); x, y van en las unidades de la vista del libro (las de
// la vista entera; el círculo va abajo, entre la viga y la pierna de goteo, en la posición de libro.mjs).
export const ROTULOS = [
  // arriba, en escalera: lo del tramo de la izquierda y del corte (el de más a la derecha, más abajo)
  ['BANDA', 'fig', 'Bandas de acero inoxidable\ncada 300 mm', 35, -279, 'der'],
  ['CHAQUETA', 'fig', 'Chaqueta de aluminio', 72, -219, 'der'],
  ['TRASLAPO_L', 'fig', 'Traslapo a lo largo, a las dos:\nel borde mira hacia abajo', 127, -174, 'der'],
  ['TRASLAPO_C', 'fig', 'Traslapo de 50 mm: la hoja de\naguas arriba va por fuera', 196, -109, 'der'],
  ['ALAMBRE', 'fig', 'Alambre que amarra la lana', 234, -49, 'der'],
  ['JUNTA_LANA', 'fig', 'Junta de las dos medias cañas', 260, -14, 'der'],
  ['TUBO', 'fig', 'Tubo de acero al carbono de 4 in\ncédula 40: 114,3 mm por fuera', 280, 31, 'der'],
  ['VAPOR', 'fig', 'Vapor saturado a 5 bara\n(152 °C), 1600 kg/h', 387, 96, 'der'],
  ['LANA', 'fig', 'Lana mineral de 50 mm', 410, 156, 'der'],
  ['CONDENSADO', 'fig', 'El condensado corre\npor el fondo del tubo', 435, 203, 'der'],
  // arriba a la derecha: la válvula y la unión de bridas
  ['VASTAGO', 'fig', 'Válvula de compuerta de 4 in', 753, 128, 'der'],
  ['REMATE', 'fig', 'Remate del aislante: deja\nsacar los espárragos', 891, 240, 'der'],
  ['BRIDA', 'fig', 'Bridas de 4 in clase 150\ny ocho espárragos', 927, 310, 'der'],
  // abajo, en escalera: la pierna de goteo, la trampa, las chaquetas desmontables y el extremo
  ['MEDIAS_CANAS', 'fig', 'Medias cañas', 1057, 525, 'der'],
  ['CUBIERTA', 'fig', 'Chaqueta desmontable de las\nbridas, en corte', 946, 575, 'der'],
  ['MANTA', 'fig', 'Chaqueta desmontable de la\nválvula, con correas', 749, 640, 'der'],
  ['CONDENSADO_SALE', 'fig', 'Condensado al retorno', 640, 700, 'der'],
  ['TRAMPA', 'fig', 'Cuerpo de la trampa (capítulo 28)', 615, 752, 'der'],
  ['PIERNA', 'fig', 'Pierna de goteo en un punto bajo,\ncon bolsillo para la mugre', 587, 810, 'der'],
  // en medio: el soporte
  ['ZAPATA', 'fig', 'Zapata soldada al\ntubo: el aislante\npasa por encima', 200, 330, 'der'],
  ['VIGA', 'fig', 'Viga del soporte\nde tubería', 200, 438, 'der'],
  // el detalle de la pared
  ['D_EJE', 'd', 'Temperatura: crece\nhacia la derecha', 228, 548, 'izq'],
  ['D_T20', 'd', 'Aire quieto a 20 °C', 228, 610, 'izq'],
  ['D_CHAQUETA', 'd', 'Chaqueta: 39 °C', 228, 656, 'izq'],
  ['D_LANA', 'd', 'Lana: de 152 a 39 °C', 228, 702, 'izq'],
  ['D_ACERO', 'd', 'Acero: 152 °C', 228, 748, 'izq'],
  ['D_VAPOR', 'd', 'Vapor', 228, 794, 'izq'],
];
// El nombre del círculo, debajo: [vista, texto, dx, dy]
export const PIES = [['d', 'La pared, cinco veces más grande,\ncon su perfil de temperatura', 0, 0]];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición
export const ROTULOS_EN = [
  ['BANDA', 'fig', 'Stainless bands', 35, -40, 'der'],
  ['CHAQUETA', 'fig', 'Aluminum jacket', 72, 0, 'der'],
  ['TRASLAPO_C', 'fig', 'Overlaps shed\nrain downslope', 196, 40, 'der'],
  ['JUNTA_LANA', 'fig', 'Mineral wool, two halves', 260, 105, 'der'],
  ['TUBO', 'fig', '4 in Sch 40 steel pipe', 280, 140, 'der'],
  ['VAPOR', 'fig', 'Steam, 5 bara', 387, 175, 'der'],
  ['CONDENSADO', 'fig', 'Condensate', 435, 210, 'der'],
  ['VASTAGO', 'fig', 'Gate valve', 753, 128, 'der'],
  ['BRIDA', 'fig', 'Flanged joint', 927, 310, 'der'],
  ['CUBIERTA', 'fig', 'Removable blanket,\ncut away', 946, 575, 'der'],
  ['MANTA', 'fig', 'Removable\nblanket', 749, 640, 'der'],
  ['TRAMPA', 'fig', 'Trap body', 615, 715, 'der'],
  ['PIERNA', 'fig', 'Drip leg', 587, 770, 'der'],
  ['ZAPATA', 'fig', 'Welded\nshoe', 200, 340, 'der'],
  ['VIGA', 'fig', 'Rack beam', 200, 438, 'der'],
  ['D_T20', 'd', 'Air, 20 °C', 228, 610, 'izq'],
  ['D_CHAQUETA', 'd', 'Jacket, 39 °C', 228, 656, 'izq'],
  ['D_LANA', 'd', 'Wool', 228, 702, 'izq'],
  ['D_ACERO', 'd', 'Steel, 152 °C', 228, 748, 'izq'],
];
export const PIES_EN = [['d', 'Pipe wall, ×5, with\nthe temperature profile', 0, 0]];

export const DESCRIPCION = 'Un tramo de la línea de vapor de la planta de aceite esencial, al exterior, en isométrico: un tubo de acero al carbono de 4 in cédula 40, forrado con lana mineral de 50 mm y una chaqueta de aluminio, que lleva vapor saturado a 5 bara. ' +
  'A la izquierda, el tubo se apoya en una zapata soldada a su fondo, que pasa por debajo del aislante y se desliza sobre la viga del soporte de tubería entre dos guías. La chaqueta va en hojas con traslapos de 50 mm, la de aguas arriba por fuera, y un traslapo a lo largo, a las dos, con el borde hacia abajo, para que la lluvia escurra; la sujetan bandas de acero inoxidable cada 300 mm. ' +
  'Un corte escalonado quita la chaqueta, luego la lana y luego el acero: se ven las dos medias cañas de lana con su junta y el alambre que las amarra, la pared del tubo y, por dentro, el vapor que corre y una película de condensado en el fondo. ' +
  'En un punto bajo, una pierna de goteo del mismo diámetro, forrada como el tubo, baja hasta un bolsillo desnudo con su tapa; de su costado sale un niple al cuerpo de la trampa, y de ahí el condensado baja al retorno. ' +
  'La válvula de compuerta lleva una chaqueta desmontable de tela, con correas y una bota alrededor del bonete; asoman el arco, el vástago y el volante. La unión de bridas lleva otra chaqueta desmontable, cortada para ver las bridas, la empaquetadura, los espárragos con sus tuercas y el remate del aislante. El extremo de la derecha va cortado: el acero, las dos medias cañas y la chaqueta. ' +
  'Un círculo amplía cinco veces la pared en el corte, con el perfil de temperatura: 152 °C en el vapor y en el acero, la caída por la lana hasta 39 °C en la chaqueta, en aire quieto, y el aire que baja a 20 °C.';

export const DESCRIPCION_EN = 'A run of the steam line of the essential-oil plant, outdoors, in isometric: a 4 in schedule 40 carbon-steel pipe, insulated with 50 mm of mineral wool and an aluminum jacket, carrying saturated steam at 5 bara. ' +
  'On the left, the pipe rests on a shoe welded to its bottom, which passes under the insulation and slides on the pipe-rack beam between two guides. The jacket is made of sheets with 50 mm overlaps, the upstream sheet outside, and a lengthwise overlap at two o’clock with its edge facing down, so rain runs off; stainless-steel bands hold it every 300 mm. ' +
  'A stepped cutaway removes the jacket, then the wool, then the steel: it shows the two halves of the wool with their joint and the tie wire, the pipe wall and, inside, the flowing steam and a film of condensate at the bottom. ' +
  'At a low point, a drip leg of the same diameter, insulated like the pipe, ends in a bare pocket with its cap; a nipple on its side leads to the trap body, and the condensate drains to the return. ' +
  'The gate valve wears a removable fabric blanket with straps and a boot around the bonnet; the yoke, stem and handwheel stand out of it. The flanged joint has another removable blanket, cut away to show the flanges, the gasket, the studs with their nuts and the end of the insulation. The right end is cut: the steel, the two halves of wool and the jacket. ' +
  'A circle enlarges the wall five times, with the temperature profile: 152 °C in the steam and the steel, the drop through the wool to 39 °C at the jacket in still air, and the air falling to 20 °C.';
