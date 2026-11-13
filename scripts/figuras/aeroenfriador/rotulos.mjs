// Los nombres de las piezas del aeroenfriador de tiro forzado, en español (la vista del libro) y en inglés (la lámina de
// la edición impresa), para el capítulo 22 (22.10). Cada rótulo es [ancla, lado, texto, opciones]: el ancla es un punto
// de build.mjs --libro (anclas en out/aero-par-libro.json, en cm) o de libro.mjs (las flechas del aire), el lado dice
// dónde va el texto ('izq' o 'der' del dibujo) y las opciones corren el texto ({ dy }) o lo fijan ({ x, y }, en las
// unidades de la vista). ../intercambiador/libro-comun.mjs los acomoda a la altura de su pieza, sin encimarse.
export const ROTULOS = [
  // a la izquierda: el cabezal de adelante, sus boquillas, la cámara, el ventilador y el motor de adelante y la
  // estructura
  ['BOQ_ENT', 'izq', 'Entra el proceso'],
  ['CAB_DEL', 'izq', 'Cabezal de tapones'],
  ['BOQ_SAL', 'izq', 'Sale el proceso'],
  ['CAMARA', 'izq', 'Cámara (plenum)'],
  ['VENTILADOR', 'izq', 'Ventilador'],
  ['ANILLO', 'izq', 'Anillo del ventilador'],
  ['AIRE_ENT', 'izq', 'Entra el aire'],
  ['MOTOR', 'izq', 'Motor'],
  ['ESTRUCTURA', 'izq', 'Estructura'],
  // arriba: el haz y el aire que sale
  ['AIRE_SAL', 'izq', 'Sale el aire caliente'],
  ['HAZ', 'izq', 'Haz de tubos aleteados'],
  // a la derecha: el cabezal de atrás, sobre la cabeza de la persona, y la persona
  ['CAB_TRAS', 'der', 'Cabezal de tapones\nde atrás'],
  ['PERSONA', 'der', 'Persona de 1,75 m'],
];

export const ROTULOS_EN = [
  ['BOQ_ENT', 'izq', 'Process in'],
  ['CAB_DEL', 'izq', 'Plug header'],
  ['BOQ_SAL', 'izq', 'Process out'],
  ['VENTILADOR', 'izq', 'Fan'],
  ['AIRE_ENT', 'izq', 'Air in'],
  ['MOTOR', 'izq', 'Motor'],
  ['ESTRUCTURA', 'izq', 'Structure'],
  ['AIRE_SAL', 'izq', 'Hot air out'],
  ['HAZ', 'izq', 'Finned-tube bundle'],
  ['CAMARA', 'izq', 'Plenum'],
  ['PERSONA', 'der', 'Person, 1.75 m'],
];

export const DESCRIPCION = 'Aeroenfriador de tiro forzado en isométrico: arriba, el haz de cuatro filas de tubos aleteados entre dos cabezales de ' +
  'tapones, con la boquilla por donde entra el proceso y la de salida en el cabezal de adelante; debajo, la cámara (plenum), sin su panel de ' +
  'adelante, con dos ventiladores axiales, sus anillos, y los motores en su puente; todo sobre una estructura de columnas y vigas. Las flechas ' +
  'azules marcan el aire que entra por debajo de los anillos y las naranjas, el aire caliente que sale por arriba del haz. Junto a la columna de ' +
  'atrás, una persona de 1,75 m de pie en el piso da la escala.';
export const DESCRIPCION_EN = 'Forced-draft air-cooled exchanger in isometric: the bundle of four rows of finned tubes between two plug headers, with ' +
  'the process inlet and outlet on the front header; below, the plenum, with its front panel removed, two axial fans with their rings and the ' +
  'motors on their bridge, all on a frame of columns and beams. Blue arrows show the air entering under the fan rings and orange arrows the ' +
  'warm air leaving above the bundle. A person 1.75 m tall stands by the rear column for scale.';
