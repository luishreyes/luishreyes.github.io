// Los nombres de las piezas del intercambiador de tubos y coraza AES de una coraza, en español (la vista del libro) y
// en inglés (la lámina de la edición impresa), para el capítulo 22 (22.5, la designación TEMA). Cada rótulo es
// [ancla, lado, texto, opciones]: el ancla es un punto de build.mjs --libro (anclas en out/tc-AES-1-libro.json, en cm),
// el lado dice dónde va el texto ('izq' o 'der' del dibujo) y las opciones corren el texto ({ dy }) o lo fijan ({ x, y },
// en las unidades de la vista). libro-comun.mjs los acomoda a la altura de su pieza, sin encimarse.
export const ROTULOS = [
  // a la izquierda, de arriba abajo: el cabezal de adelante y sus boquillas (la tapa del canal antes que el divisor, para
  // que sus líneas no se crucen)
  ['BOQ_C_ENT', 'izq', 'Boquilla de entrada\nde la coraza'],
  ['BOQ_T_SAL', 'izq', 'Boquilla de salida\nde los tubos'],
  ['CANAL', 'izq', 'Canal: cabezal\nestacionario (A)'],
  ['TAPA_CANAL', 'izq', 'Tapa removible\ndel canal', { dy: -10 }],
  ['DIVISOR', 'izq', 'Divisor de pasos'],
  ['BOQ_T_ENT', 'izq', 'Boquilla de entrada\nde los tubos'],
  // arriba, sobre la coraza: la varilla y la placa de choque, con líneas cortas
  ['VARILLA', 'izq', 'Varilla tensora\ny espaciadores', { x: 330, y: 116 }],
  ['PLACA_CHOQUE', 'der', 'Placa de choque', { x: 202, y: 166 }],
  // arriba, a la izquierda de la persona (de pie detrás de la coraza); a la derecha, de arriba abajo, el cabezal de
  // atrás y lo de abajo
  ['PERSONA', 'izq', 'Persona de 1,75 m'],
  ['TAPA_CORAZA', 'der', 'Tapa de la coraza'],
  ['CABEZAL_FLOT', 'der', 'Tapa del cabezal\nflotante (S)'],
  ['ESPEJO_FLOT', 'der', 'Espejo flotante'],
  ['ANILLO', 'der', 'Anillo partido'],
  ['SILLETA', 'der', 'Silleta'],
  ['BOQ_C_SAL', 'der', 'Boquilla de salida\nde la coraza'],
  ['DEFLECTOR', 'der', 'Deflector segmentado'],
  ['TUBOS', 'der', 'Tubos (cuatro pasos)'],
  ['CORAZA', 'der', 'Coraza de un paso (E)'],
  ['ESPEJO_FIJO', 'der', 'Espejo fijo'],
];

// La lámina de la edición en inglés lleva menos rótulos
export const ROTULOS_EN = [
  ['BOQ_C_ENT', 'izq', 'Shell inlet'],
  ['CANAL', 'izq', 'Channel (A)'],
  ['TAPA_CANAL', 'izq', 'Removable cover'],
  ['DIVISOR', 'izq', 'Pass partition'],
  ['BOQ_T_ENT', 'izq', 'Tube inlet'],
  ['VARILLA', 'izq', 'Tie rod and spacers', { x: 330, y: 122 }],
  ['PLACA_CHOQUE', 'der', 'Impingement plate', { x: 202, y: 166 }],
  ['PERSONA', 'izq', 'Person, 1.75 m'],
  ['CABEZAL_FLOT', 'der', 'Floating head (S)'],
  ['ESPEJO_FLOT', 'der', 'Floating tubesheet'],
  ['ANILLO', 'der', 'Split backing ring'],
  ['DEFLECTOR', 'der', 'Segmental baffle'],
  ['CORAZA', 'der', 'One-pass shell (E)'],
  ['ESPEJO_FIJO', 'der', 'Stationary tubesheet'],
];

export const DESCRIPCION = 'Intercambiador de tubos y coraza AES de una coraza, en isométrico y abierto por el plano vertical de su eje: ' +
  'adelante, el canal (cabezal estacionario A) con su tapa removible, su divisor de pasos y sus dos boquillas; la coraza de un paso (E) con sus ' +
  'boquillas de entrada y salida, la placa de choque bajo la de entrada, el haz de tubos de cuatro pasos (los colores van del paso más caliente al ' +
  'más frío), los deflectores segmentados y una varilla tensora con sus espaciadores; atrás, dentro de la tapa de la coraza, el cabezal flotante (S): ' +
  'el espejo flotante, el anillo partido y la tapa del cabezal flotante. Detrás de la coraza, junto al cabezal flotante, una persona de 1,75 m de pie en el piso da la escala.';
export const DESCRIPCION_EN = 'AES shell-and-tube exchanger, one shell, in isometric, opened along the vertical plane of its axis: the channel ' +
  '(stationary head A) with its removable cover and pass partition, the one-pass shell (E) with its nozzles and the impingement plate under the inlet, ' +
  'the four-pass tube bundle, the segmental baffles and a tie rod with spacers, and, inside the shell cover, the floating head (S) with the floating ' +
  'tubesheet and the split backing ring. A person 1.75 m tall stands behind the shell, by the floating head, for scale.';
