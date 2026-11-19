// Los nombres de las piezas del termosifón vertical y del fondo de la columna, en español (la vista del libro) y en
// inglés (la lámina de la edición impresa). Cada rótulo: [ancla, texto, x, y del texto, lado]. El lado dice por dónde
// llega la línea al texto: 'der' (el texto queda a la derecha de la línea), 'izq', o 'cota' (el texto va de canto sobre
// la cota, sin línea). Las anclas son puntos de build.mjs (out/fig_data.json); x, y van en las unidades de la vista.
export const ROTULOS = [
  // a la izquierda, de arriba abajo: la columna, su fondo y el faldón
  ['PLATO2', 'Plato perforado', 205, 112, 'izq'],
  ['VERTEDERO1', 'Vertedero', 205, 176, 'izq'],
  ['BAJANTE1', 'Bajante', 205, 236, 'izq'],
  ['SELLO', 'Bandeja de sello\ndel bajante', 205, 292, 'izq'],
  ['NIVEL', 'Nivel del líquido\nen el fondo', 205, 548, 'izq'],
  ['SUMIDERO', 'Fondo de la columna', 205, 650, 'izq'],
  ['CABEZA', 'Cabeza elíptica', 205, 756, 'izq'],
  ['ROMPE_VORTICE', 'Rompe-vórtice', 205, 806, 'izq'],
  ['FONDO', 'Salida del fondo', 205, 944, 'izq'],
  ['FALDON', 'Faldón', 205, 1006, 'izq'],
  ['ENTRADA_BAJA', 'Línea de entrada\nal rehervidor', 205, 1060, 'izq'],
  ['ACCESO', 'Boca de acceso', 205, 1150, 'izq'],
  ['CIMIENTO', 'Cimiento', 180, 1300, 'izq'],
  ['ORIFICIO', 'Placa de orificio:\nrestricción de la entrada', 420, 1392, 'izq'],
  // arriba, entre la columna y el rehervidor
  ['BOCA_RETORNO', 'Boquilla de retorno,\nsobre el nivel', 545, 246, 'der'],
  // la cota de la cabeza estática, de canto en el hueco entre los dos equipos
  ['COTA', 'Cabeza estática', 497, 800, 'cota'],
  // a la derecha, de arriba abajo: el rehervidor y su lado del vapor
  ['RETORNO_CODO', 'Retorno de la mezcla\na la columna', 900, 372, 'der'],
  ['VAPOR_LINEA', 'Vapor de calentamiento', 900, 520, 'der'],
  ['MEZCLA', 'Bonete de arriba:\nlíquido y vapor', 900, 592, 'der'],
  ['ESPEJO_ARRIBA', 'Espejo de arriba,\na la altura del nivel', 900, 664, 'der'],
  ['VAPOR_BOCA', 'Entrada del vapor', 900, 728, 'der'],
  ['SOPORTE1', 'Placa soporte', 900, 790, 'der'],
  ['TUBOS', 'Tubos: el líquido\nhierve al subir', 900, 836, 'der'],
  ['CORAZA', 'Coraza', 900, 912, 'der'],
  ['VENTEO', 'Venteo de incondensables', 900, 956, 'der'],
  ['ENTRADA_TUBOS', 'Espejo de abajo:\nentrada de los tubos', 900, 1000, 'der'],
  ['CONDENSADO_BOCA', 'Salida del condensado', 900, 1072, 'der'],
  ['BONETE_ABAJO', 'Bonete de abajo,\nlleno de líquido', 900, 1114, 'der'],
  ['TRAMPA', 'Trampa de vapor', 900, 1180, 'der'],
  ['PERSONA', 'Persona de 1,75 m', 900, 1330, 'der'],
];

// La lámina de la edición en inglés lleva menos rótulos
export const ROTULOS_EN = [
  ['PLATO2', 'Sieve tray', 205, 112, 'izq'],
  ['SELLO', 'Seal pan', 205, 292, 'izq'],
  ['NIVEL', 'Liquid level', 205, 548, 'izq'],
  ['SUMIDERO', 'Column bottom', 205, 650, 'izq'],
  ['ROMPE_VORTICE', 'Vortex breaker', 205, 806, 'izq'],
  ['FONDO', 'Bottoms outlet', 205, 944, 'izq'],
  ['FALDON', 'Skirt', 205, 1006, 'izq'],
  ['ENTRADA_BAJA', 'Reboiler inlet line', 205, 1060, 'izq'],
  ['ORIFICIO', 'Restriction orifice', 420, 1392, 'izq'],
  ['BOCA_RETORNO', 'Return nozzle', 545, 252, 'der'],
  ['COTA', 'Static head', 497, 800, 'cota'],
  ['RETORNO_CODO', 'Two-phase return', 900, 378, 'der'],
  ['VAPOR_LINEA', 'Heating steam', 900, 520, 'der'],
  ['MEZCLA', 'Top channel', 900, 598, 'der'],
  ['ESPEJO_ARRIBA', 'Top tubesheet', 900, 664, 'der'],
  ['VAPOR_BOCA', 'Steam inlet', 900, 728, 'der'],
  ['TUBOS', 'Tubes (boiling)', 900, 836, 'der'],
  ['CORAZA', 'Shell', 900, 912, 'der'],
  ['VENTEO', 'Noncondensable vent', 900, 956, 'der'],
  ['ENTRADA_TUBOS', 'Tube inlet', 900, 1006, 'der'],
  ['CONDENSADO_BOCA', 'Condensate outlet', 900, 1072, 'der'],
  ['TRAMPA', 'Steam trap', 900, 1180, 'der'],
  ['PERSONA', '1.75 m person', 900, 1330, 'der'],
];

export const DESCRIPCION = 'El fondo de una columna de platos y su rehervidor de termosifón vertical, en isométrico, abiertos por el plano vertical que pasa por los dos ejes. ' +
  'A la izquierda, la columna sobre su faldón: los dos últimos platos perforados con sus vertederos y bajantes, la bandeja de sello del bajante de abajo, la boquilla del retorno arriba del nivel y, abajo, el líquido del fondo con su nivel, la cabeza elíptica, el rompe-vórtice sobre la boquilla de abajo y la salida del fondo, que baja dentro del faldón y sale por una manga. ' +
  'De la boquilla de abajo, la línea de entrada baja por el faldón, pasa por una placa de orificio entre bridas y sube al bonete de abajo del rehervidor, lleno de líquido. ' +
  'El rehervidor, a la derecha, es un intercambiador vertical de espejos fijos: el líquido entra a los tubos por el espejo de abajo y hierve al subir, más vapor cuanto más arriba; la mezcla sale por el bonete de arriba y vuelve a la columna por el codo y el tramo de retorno. ' +
  'Por la coraza baja el vapor de calentamiento, que entra arriba; el condensado sale abajo, a ras del espejo, hacia la trampa de vapor, y junto a él va el venteo de los incondensables. Dos placas soporte cruzan el haz. ' +
  'Una cota entre los dos equipos marca la cabeza estática: el nivel del líquido de la columna, a la altura del espejo de arriba, sobre la entrada de los tubos. Una persona de 1,75 m de pie en el piso da la escala.';

export const DESCRIPCION_EN = 'The bottom of a tray column and its vertical thermosiphon reboiler, in isometric, opened along the vertical plane through both axes. ' +
  'On the left, the column on its skirt: the last two sieve trays with their weirs and downcomers, the seal pan under the lower downcomer, the return nozzle above the liquid level and, below, the bottom liquid with its level, the elliptical head, the vortex breaker over the bottom nozzle, and the bottoms outlet, which runs down inside the skirt and leaves through a sleeve. ' +
  'From the bottom nozzle, the inlet line runs down through the skirt, passes a restriction orifice between flanges, and rises into the bottom channel of the reboiler, full of liquid. ' +
  'The reboiler, on the right, is a vertical fixed-tubesheet exchanger: the liquid enters the tubes at the bottom tubesheet and boils as it rises, with more vapor the higher it goes; the mixture leaves through the top channel and returns to the column through the elbow and the return line. ' +
  'Heating steam enters the shell at the top and flows down; the condensate leaves at the bottom, flush with the tubesheet, toward the steam trap, with the noncondensable vent beside it. Two support plates cross the bundle. ' +
  'A dimension between the two units marks the static head: the liquid level in the column, at the height of the top tubesheet, above the tube inlet. A 1.75 m figure standing on the floor gives the scale.';
