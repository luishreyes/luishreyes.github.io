// Los nombres de las piezas del tubo de retención de E-201 y su válvula de desvío, en español (la vista del libro) y en
// inglés (la lámina de la edición impresa). Cada rótulo: [ancla, vista ('fig', o 'd', el círculo de la válvula en
// corte), texto, x, y del texto, lado]. El lado dice por dónde llega la línea al texto: 'der' (el texto queda a la
// derecha de la línea) o 'izq'. Las anclas son puntos de build.mjs (out/fig_data.json y out/detalle_data.json); x, y van
// en las unidades de la vista del libro (las de la vista entera; el círculo va abajo a la izquierda, en la posición de
// libro.mjs). Ningún número sale de otra parte que el caso (caso.json, e201_tubo) o una fuente leída.
export const ROTULOS = [
  // arriba: la salida del tubo y sus instrumentos
  ['PSL', 'fig', 'PSL-207, presostato del tubo', 250, -50, 'izq'],
  ['VUELTA', 'fig', 'De vuelta al regenerador', 250, 0, 'izq'],
  ['TT204', 'fig', 'TT-204, sensor del registrador-\ncontrolador, a la salida del tubo', 470, -70, 'der'],
  ['TI204', 'fig', 'TI-204, termómetro de referencia,\nen el mismo punto', 530, 0, 'der'],
  // a la derecha: el tubo, la pendiente y el soporte
  ['TRAMO4', 'fig', 'Tubo de retención: sanitario\nde 2½ in, 23,5 m', 800, 120, 'der'],
  ['VARILLAF3', 'fig', 'Sube 2,1 cm por metro (0,49 m):\nvarillas de largo distinto', 1010, 330, 'der'],
  ['CURVA', 'fig', 'Cuatro tramos rectos (6 m como\nmáximo) y tres curvas de 180°', 1040, 590, 'der'],
  ['ABRAZADERA_F', 'fig', 'Abrazaderas de bisagra', 1040, 680, 'der'],
  ['PIE_F', 'fig', 'Soporte de acero inoxidable,\ncon patas niveladoras', 880, 770, 'der'],
  ['PERSONA_RODILLA', 'fig', 'Persona\nde 1,75 m', 420, 470, 'der'],
  // a la izquierda: E-201 y la válvula de desvío
  ['E201', 'fig', 'E-201, simplificado', 55, 50, 'izq'],
  ['AIRE', 'fig', 'Aire de los actuadores', 55, 100, 'izq'],
  ['BOQ_A', 'fig', 'Del calentamiento,\na la entrada del tubo', 55, 150, 'izq'],
  ['CABEZA', 'fig', 'Válvula de desvío de dos\nvástagos: sin aire, desvía', 55, 218, 'izq'],
  ['BOQ_C', 'fig', 'Sale del enfriamiento', 55, 290, 'izq'],
  ['TT205', 'fig', 'TT-205, segundo sensor', 55, 330, 'izq'],
  ['DESVIO_LINEA', 'fig', 'Desvío y fugas, a TK-201', 55, 376, 'izq'],
  ['MIRILLA', 'fig', 'Mirilla de la línea\nde detección de fugas', 55, 424, 'izq'],
  // el círculo de la válvula en corte
  ['D_DETECTOR', 'd', 'Detector de posición', 50, 690, 'izq'],
  ['D_AIRE', 'd', 'El aire, sobre el pistón,\nla lleva adelante', 50, 742, 'izq'],
  ['D_RESORTE', 'd', 'Resorte: sin aire, sube\nel vástago (desvío)', 50, 812, 'izq'],
  ['D_ASIENTO_ARRIBA', 'd', 'Asiento de adelante, cerrado', 50, 895, 'izq'],
  ['D_ENTRA', 'd', 'Jugo frío del enfriamiento', 50, 950, 'izq'],
  ['D_TAPON', 'd', 'Tapón arriba, con su sello', 50, 1005, 'izq'],
  ['D_DESVIO', 'd', 'Baja a TK-201', 50, 1110, 'izq'],
  ['D_PISTON', 'd', 'Pistón', 560, 745, 'der'],
  ['D_ADELANTE', 'd', 'Adelante, al llenado: cerrado', 560, 850, 'der'],
  ['D_DETECCION', 'd', 'Válvula de detección de\nfugas, también en desvío', 560, 905, 'der'],
  ['D_CAMARA_ARRIBA', 'd', 'Entre los vástagos: vacío', 560, 975, 'der'],
  ['D_ASIENTO_ABAJO', 'd', 'Asiento de desvío, abierto', 560, 1030, 'der'],
  ['D_FUGA', 'd', 'Escape de fugas, abierto\na su línea', 560, 1085, 'der'],
];
// El nombre del círculo, debajo: [vista, texto, dx, dy]
export const PIES = [['d', 'La válvula de desvío en corte, en desvío', 0, 0]];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición
export const ROTULOS_EN = [
  ['PSL', 'fig', 'PSL-207', 250, -40, 'izq'],
  ['TT204', 'fig', 'TT-204, recorder-\ncontroller sensor', 470, -70, 'der'],
  ['TI204', 'fig', 'TI-204, indicating\nthermometer', 530, 0, 'der'],
  ['TRAMO4', 'fig', 'Holding tube, 2½ in\nsanitary, 23.5 m', 800, 120, 'der'],
  ['VARILLAF3', 'fig', 'Rises 2.1 cm/m (0.49 m),\nfixed at each height', 1010, 330, 'der'],
  ['CURVA', 'fig', 'Four straight lengths (6 m\nat most), three 180° bends', 1040, 590, 'der'],
  ['PIE_F', 'fig', 'Stainless support', 880, 770, 'der'],
  ['PERSONA_RODILLA', 'fig', '1.75 m\nperson', 420, 470, 'der'],
  ['E201', 'fig', 'E-201 (simplified)', 55, 50, 'izq'],
  ['BOQ_A', 'fig', 'From the heater', 55, 150, 'izq'],
  ['CABEZA', 'fig', 'Dual-stem flow\ndiversion valve', 55, 206, 'izq'],
  ['BOQ_C', 'fig', 'From the cooler', 55, 300, 'izq'],
  ['TT205', 'fig', 'TT-205', 55, 344, 'izq'],
  ['DESVIO_LINEA', 'fig', 'To TK-201', 55, 388, 'izq'],
  ['MIRILLA', 'fig', 'Sight glass', 55, 432, 'izq'],
  ['D_DETECTOR', 'd', 'Position detector', 50, 690, 'izq'],
  ['D_RESORTE', 'd', 'Spring to divert', 50, 812, 'izq'],
  ['D_ASIENTO_ARRIBA', 'd', 'Forward seat, closed', 50, 895, 'izq'],
  ['D_ENTRA', 'd', 'Juice from the cooler', 50, 950, 'izq'],
  ['D_DESVIO', 'd', 'To TK-201', 50, 1110, 'izq'],
  ['D_PISTON', 'd', 'Air piston', 560, 745, 'der'],
  ['D_DETECCION', 'd', 'Leak-detect valve', 560, 905, 'der'],
  ['D_ASIENTO_ABAJO', 'd', 'Divert seat, open', 560, 1030, 'der'],
  ['D_FUGA', 'd', 'Leak escape, open', 560, 1085, 'der'],
];
export const PIES_EN = [['d', 'Diversion valve in section, diverting', 0, 0]];

export const DESCRIPCION = 'El tubo de retención de E-201, el pasteurizador de placas del jugo, con su válvula de desvío, en isométrico. ' +
  'A la izquierda, E-201 simplificado: la placa fija con tres boquillas. De la salida del calentamiento, el jugo entra al tubo de retención, sanitario de 2½ in y 23,5 m, en un serpentín de cuatro tramos rectos de 6 m como máximo y tres curvas de 180°, que sube 2,1 cm por metro: la salida queda 0,49 m más alta que la entrada. ' +
  'El tubo va fijo sobre un soporte de acero inoxidable de tres marcos con patas niveladoras: en cada marco, un travesaño y, por tramo, una varilla y una abrazadera de bisagra; las varillas son de largo distinto porque cada tramo va a su altura. ' +
  'A la salida, en el mismo punto, el sensor del registrador-controlador TT-204 y el termómetro de referencia TI-204; después, el presostato PSL-207, y el tubo vuelve a E-201, al regenerador. ' +
  'Delante de E-201, después de la sección de enfriamiento, la válvula de desvío de dos vástagos, con el segundo sensor TT-205 en su entrada: la válvula de desvío y la de detección de fugas, cada una con su actuador neumático, su cabeza de control y su manguera de aire. Adelante, el jugo sale al llenado; el desviado baja a TK-201, y la línea de detección de fugas, con su mirilla, también. Una persona de 1,75 m está de pie junto al soporte. ' +
  'Un círculo muestra la válvula de desvío en corte, en desvío, vista casi de frente al plano del corte: el jugo frío entra a la cámara del medio, el tapón está arriba y cierra el asiento de adelante, y el jugo baja por el asiento de desvío, abierto, hacia TK-201; entre los dos vástagos no hay jugo, y la válvula de detección, también en desvío, deja abierto el escape de fugas a su línea. Arriba, en cada actuador, el resorte que sin aire sube el vástago, el pistón con el aire encima y, en la cabeza de control, el detector de posición.';

export const DESCRIPCION_EN = 'The holding tube of E-201, the plate pasteurizer of the juice, with its flow diversion valve, in isometric. ' +
  'On the left, E-201 simplified: the fixed frame plate with three nozzles. From the heating section, the juice enters the holding tube, 2½ in sanitary tubing 23.5 m long, laid as a serpentine of four straight lengths of 6 m at most and three 180° bends that rises 2.1 cm per meter: the outlet stands 0.49 m above the inlet. ' +
  'The tube is fixed on a stainless-steel support of three frames on leveling feet: on each frame, a crossbar and, for each length, a rod and a hinged clamp; the rods differ in length because each length sits at its own height. ' +
  'At the outlet, at the same point, the sensor of the recorder-controller TT-204 and the indicating thermometer TI-204; then the pressure switch PSL-207, and the tube returns to the regenerator of E-201. ' +
  'In front of E-201, after the cooling section, the dual-stem flow diversion valve, with the second sensor TT-205 at its inlet: the divert valve and the leak-detect valve, each with its air actuator, control top and air hose. Forward flow goes to the filler; diverted juice drains to TK-201, and so does the leak-detect line with its sight glass. A 1.75 m person stands beside the support. ' +
  'A circle shows the diversion valve in section, diverting, seen almost square to the cut: the cold juice enters the middle chamber, the plug is up against the forward seat, and the juice drains through the open divert seat to TK-201; between the two stems there is no juice, and the leak-detect valve, also diverting, keeps the leak escape open to its line. Above, in each actuator, the spring that lifts the stem when the air fails, the piston with the air above it and, in the control top, the position detector.';
