// Los nombres de las piezas del tren de condensación (el condensador, el subenfriador y el florentino), en español (la
// vista del libro) y en inglés (la lámina de la edición impresa). Cada rótulo es [ancla, lado, texto, opciones]: el
// ancla es un punto de build.mjs (out/fig_data.json, o out/detalle_data.json si empieza por «d:»), el lado dice dónde va el texto ('izq' o 'der' del dibujo) y las
// opciones corren el texto ({ dy }) o lo fijan ({ x, y }, en las unidades de la vista). libro.mjs los acomoda a la
// altura de su pieza, sin encimarse.
export const ROTULOS = [
  // a la izquierda: el vapor, el condensador por su lado izquierdo y el subenfriador
  ['VAPOR', 'izq', 'Vapor del extractor V-201'],
  ['E_CAMARA_T', 'izq', 'Cámara de arriba'],
  ['E_PLACA_T', 'izq', 'Placa de tubos, con las\nbocas de los tubos'],
  ['E_DEFLECTOR', 'izq', 'Deflector'],
  ['E_CORAZA', 'izq', 'Coraza, en corte'],
  ['CW_IN', 'izq', 'Entra el agua de torre'],
  ['E_PLACA_B', 'izq', 'Placa de tubos de abajo'],
  ['E_NIVEL', 'izq', 'El condensado y su nivel'],
  ['SW_OUT', 'izq', 'Sale el agua de servicios', { dy: -40 }],
  ['D_NOMBRE', 'izq', 'Subenfriador E-202,\nde doble tubo'],
  ['D_RETORNO', 'izq', 'Cabezal de retorno'],
  ['D_ROTURA', 'izq', 'Las ramas van partidas'],
  ['D_ANULO', 'izq', 'Ánulo: agua de servicios'],
  ['D_INTERIOR', 'izq', 'Tubo interior: condensado'],
  ['D_SOPORTE', 'izq', 'Soporte'],
  // el detalle: la pared de un tubo
  ['d:D_PARED', 'izq', 'Pared del tubo'],
  ['d:D_VAPOR', 'izq', 'Vapor'],
  ['d:D_GOTAS', 'izq', 'Gotas de limoneno'],
  ['d:D_AGUA', 'izq', 'Agua de torre'],
  ['d:D_PELICULA', 'izq', 'Película de condensado'],
  ['SW_IN', 'izq', 'Entra el agua de servicios'],
  // a la derecha: el condensador por su lado derecho, la estructura, la bajada del condensado, el florentino y la persona
  ['E_CHOQUE', 'der', 'Placa de choque'],
  ['CW_OUT', 'der', 'Sale el agua de torre'],
  ['E_TUBOS', 'der', 'Tubos: el vapor\ncondensa por dentro'],
  ['E_ESTRUCTURA', 'der', 'Estructura'],
  ['E_OREJA', 'der', 'Oreja de apoyo'],
  ['E_NOMBRE', 'der', 'Condensador E-201'],
  ['E_VENTANA', 'der', 'Ventana del deflector'],
  ['E_VENTEO', 'der', 'Venteo de los incondensables'],
  ['COND1', 'der', 'El condensado baja\npor gravedad'],
  ['F_NOMBRE', 'der', 'Florentino V-202', { dy: -40 }],
  ['PERSONA', 'der', 'Persona de 1,75 m'],
];

export const ROTULOS_EN = [
  ['VAPOR', 'izq', 'Vapor from extractor V-201'],
  ['E_PLACA_T', 'izq', 'Tubesheet'],
  ['E_DEFLECTOR', 'izq', 'Baffle'],
  ['E_CORAZA', 'izq', 'Shell (cut)'],
  ['CW_IN', 'izq', 'Cooling-tower water in'],
  ['E_NIVEL', 'izq', 'Condensate level'],
  ['SW_OUT', 'izq', 'Service water out', { dy: -40 }],
  ['D_NOMBRE', 'izq', 'Subcooler E-202'],
  ['D_RETORNO', 'izq', 'Return bend'],
  ['D_ANULO', 'izq', 'Annulus'],
  ['D_INTERIOR', 'izq', 'Inner pipe'],
  ['SW_IN', 'izq', 'Service water in'],
  ['d:D_PARED', 'izq', 'Tube wall'],
  ['d:D_VAPOR', 'izq', 'Vapor'],
  ['d:D_GOTAS', 'izq', 'Limonene drops'],
  ['d:D_AGUA', 'izq', 'Tower water'],
  ['d:D_PELICULA', 'izq', 'Condensate film'],
  ['E_CHOQUE', 'der', 'Impingement plate'],
  ['CW_OUT', 'der', 'Cooling-tower water out'],
  ['E_TUBOS', 'der', 'Tubes'],
  ['E_NOMBRE', 'der', 'Condenser E-201'],
  ['E_VENTEO', 'der', 'Vent'],
  ['COND1', 'der', 'Condensate,\nby gravity'],
  ['F_NOMBRE', 'der', 'Florentine flask V-202', { dy: -40 }],
  ['PERSONA', 'der', 'Person, 1.75 m'],
];

// el nombre del círculo, debajo de él (m: cuántas veces más grande)
export const PIES = (m) => [`Un tubo abierto, ×${m}`];
export const PIES_EN = (m) => [`One tube, opened, ×${m}`];

export const DESCRIPCION = 'El tren de condensación de un arrastre de vapor, en isométrico. ' +
  'Arriba, el condensador E-201: un intercambiador de tubos y coraza vertical, de un paso, cortado por el plano de su eje para ver adentro. ' +
  'El vapor del extractor llega por una línea gruesa desde la izquierda, baja a la cámara de arriba y una placa de choque lo reparte hacia las bocas de los tubos, que se ven en la placa de tubos. ' +
  'El vapor condensa al bajar por dentro de los tubos; el agua de torre entra a la coraza abajo a la izquierda, sube en zigzag por las ventanas de cuatro deflectores, a la izquierda y a la derecha, y sale arriba a la derecha. ' +
  'Abajo, la cámara recoge el condensado, con su nivel y unas gotas que caen de los tubos; sobre el nivel sale el venteo de los incondensables, con su válvula. ' +
  'El condensador se apoya en dos orejas sobre una estructura de dos columnas con ménsulas. ' +
  'Del fondo de la cámara, el condensado baja por gravedad al subenfriador E-202, a la izquierda: horquillas de doble tubo apiladas, con los cabezales de retorno atrás y adelante las bridas, los prensaestopas, las curvas del tubo interior y los puentes del ánulo. ' +
  'Las ramas van partidas y en la rotura se ve la sección: el tubo exterior, el ánulo con el agua de servicios y el tubo interior con el condensado. ' +
  'El condensado entra por la rama de arriba y baja; el agua de servicios entra por la de abajo y sube. ' +
  'De la rama de abajo, el condensado frío sube junto al subenfriador y entra al florentino V-202, a la derecha, en corte, con el aceite arriba y el agua abajo. ' +
  'Junto al florentino, una persona de 1,75 m de pie en el piso da la escala. ' +
  'Un círculo a la izquierda amplía un tubo del haz, abierto por su eje: el vapor baja por el centro y por la pared baja la película de condensado, con gotas de limoneno; afuera, entre el tubo y sus vecinos, el agua de torre.';

export const DESCRIPCION_EN = 'The condensing train of a steam distillation, in isometric. ' +
  'At the top, the condenser E-201: a vertical, single-pass shell-and-tube exchanger cut along its axis. ' +
  'The vapor from the extractor arrives through a large line from the left, enters the top channel, and an impingement plate spreads it over the tube inlets in the tubesheet. ' +
  'The vapor condenses as it flows down inside the tubes; the cooling-tower water enters the shell at the bottom left, rises in a zigzag through the windows of four baffles, and leaves at the top right. ' +
  'The bottom channel collects the condensate, with its level; above the level, the vent for the noncondensables, with its valve. ' +
  'The condenser rests on two lugs on a two-column frame with brackets. ' +
  'From the bottom of the channel the condensate flows by gravity to the subcooler E-202, on the left: stacked double-pipe hairpins with the return bends at the back and, at the front, the flanges, the packing glands, the inner-pipe bends and the annulus jumpers. ' +
  'The legs are drawn broken, and the break shows the section: the outer pipe, the annulus with the service water and the inner pipe with the condensate. ' +
  'The condensate enters the top leg and flows down; the service water enters the bottom leg and flows up. ' +
  'From the bottom leg the cold condensate rises beside the subcooler and enters the Florentine flask V-202, on the right, in section, with the oil on top and the water below. ' +
  'A person 1.75 m tall stands on the floor by the flask for scale. ' +
  'A circle on the left enlarges one tube of the bundle, opened along its axis: the vapor flows down the center and the condensate film runs down the wall, with drops of limonene; outside, between the tube and its neighbors, the tower water.';
