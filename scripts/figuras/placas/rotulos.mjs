// Los nombres de las piezas del intercambiador de placas con juntas, en español (la vista del libro) y en inglés (la
// lámina de la edición impresa), para el capítulo 22 (22.8). Cada rótulo es [ancla, lado, texto, opciones]: el ancla es
// un punto de build.mjs --libro (anclas en out/placas-libro.json, en cm), el lado dice dónde va el texto ('izq' o 'der'
// del dibujo) y las opciones corren el texto ({ dy }) o lo fijan ({ x, y }, en las unidades de la vista).
// ../intercambiador/libro-comun.mjs los acomoda a la altura de su pieza, sin encimarse.
export const ROTULOS = [
  // a la izquierda: la placa fija y sus cuatro conexiones
  ['PLACA_FIJA', 'izq', 'Placa fija\ndel bastidor'],
  ['C_ENT', 'izq', 'Conexión: entra\nel caliente'],
  ['F_SAL', 'izq', 'Conexión: sale\nel frío'],
  ['TORNILLO', 'izq', 'Tornillos de apriete'],
  ['C_SAL', 'izq', 'Conexión: sale\nel caliente'],
  ['F_ENT', 'izq', 'Conexión: entra\nel frío'],
  // arriba a la izquierda, sobre la placa fija: el paquete en corte (en este orden, para que las líneas no se crucen)
  ['PRESION', 'izq', 'Placa de presión', { x: 225, y: 40 }],
  ['PLACAS', 'izq', 'Placas, en corte', { x: 225, y: 60 }],
  ['CANAL_C', 'izq', 'Canal del caliente', { x: 225, y: 80 }],
  ['JUNTA', 'izq', 'Juntas', { x: 225, y: 100 }],
  // arriba a la derecha, sobre la cabeza de la persona, y abajo, bajo la barra guía: así ninguna línea cruza la persona
  ['BARRA_SUP', 'der', 'Barra portadora', { x: 420, y: 24 }],
  ['COLUMNA', 'der', 'Columna de apoyo', { x: 530, y: 44 }],
  ['PERSONA', 'der', 'Persona de 1,75 m'],
  ['BARRA_INF', 'der', 'Barra guía', { x: 420, y: 432 }],
  ['CANAL_F', 'der', 'Canal del frío', { x: 326, y: 470 }],
];

export const ROTULOS_EN = [
  ['PLACA_FIJA', 'izq', 'Fixed frame plate'],
  ['C_ENT', 'izq', 'Hot in'],
  ['F_SAL', 'izq', 'Cold out'],
  ['TORNILLO', 'izq', 'Tightening bolts'],
  ['C_SAL', 'izq', 'Hot out'],
  ['F_ENT', 'izq', 'Cold in'],
  ['PRESION', 'izq', 'Pressure plate', { x: 225, y: 40 }],
  ['PLACAS', 'izq', 'Plates (cut)', { x: 225, y: 60 }],
  ['JUNTA', 'izq', 'Gaskets', { x: 225, y: 100 }],
  ['BARRA_SUP', 'der', 'Carrying bar', { x: 420, y: 24 }],
  ['COLUMNA', 'der', 'Support column', { x: 530, y: 44 }],
  ['PERSONA', 'der', 'Person, 1.75 m'],
  ['BARRA_INF', 'der', 'Guide bar', { x: 420, y: 432 }],
];

export const DESCRIPCION = 'Intercambiador de placas con juntas en isométrico, con el paquete abierto por el plano vertical de su eje: la placa ' +
  'fija del bastidor con sus cuatro conexiones (el caliente entra arriba y sale abajo; el frío entra abajo y sale arriba), la barra portadora ' +
  'arriba y la barra guía abajo, la columna de apoyo, la placa de presión y los tornillos de apriete; en el corte, las placas y sus juntas y los ' +
  'canales del caliente y del frío, alternos, en contracorriente. Junto a la columna, una persona de 1,75 m de pie en el piso da la escala.';
export const DESCRIPCION_EN = 'Gasketed plate heat exchanger in isometric, with the plate pack opened along the vertical plane of its axis: the fixed ' +
  'frame plate with its four connections, the carrying bar and the guide bar, the support column, the pressure plate and the tightening bolts; in ' +
  'the cut, the plates with their gaskets and the alternating hot and cold channels in countercurrent. A person 1.75 m tall stands by the ' +
  'column for scale.';
