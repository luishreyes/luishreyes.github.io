// Los nombres de las piezas del intercambiador de doble tubo, en español (la vista del libro) y en inglés (la lámina de
// la edición impresa), para el capítulo 22 (22.10). Cada rótulo es [ancla, lado, texto, opciones]: el ancla es un punto
// de build.mjs --libro (anclas en out/doble-libro.json, en cm), el lado dice dónde va el texto ('izq' o 'der' del
// dibujo) y las opciones corren el texto ({ dy }) o lo fijan ({ x, y }, en las unidades de la vista).
// ../intercambiador/libro-comun.mjs los acomoda a la altura de su pieza, sin encimarse.
export const ROTULOS = [
  ['ENTRA_AN', 'izq', 'Entra el fluido\ndel ánulo'],
  ['PRENSA', 'izq', 'Prensaestopas'],
  ['SALE_INT', 'izq', 'Sale el fluido del\ntubo interior'],
  ['PUENTE', 'izq', 'Puente del ánulo'],
  ['CURVA_INT', 'izq', 'Curva del tubo\ninterior'],
  ['ENTRA_INT', 'izq', 'Entra el fluido del\ntubo interior'],
  ['TUBO_EXT', 'izq', 'Tubo exterior, en corte'],
  ['TUBO_INT', 'izq', 'Tubo interior'],
  ['RETORNO', 'der', 'Cabezal de la curva\nde retorno'],
  ['PERSONA', 'der', 'Persona de 1,75 m'],
  // abajo a la derecha, bajo la horquilla de abajo: así ninguna línea cruza la persona
  ['SOPORTE', 'der', 'Soporte'],
  ['ANULO', 'der', 'Ánulo', { x: 430, y: 318 }],
  ['SALE_AN', 'der', 'Sale el fluido\ndel ánulo', { x: 300, y: 364 }],
];

export const ROTULOS_EN = [
  ['ENTRA_AN', 'izq', 'Annulus in'],
  ['PRENSA', 'izq', 'Packing gland'],
  ['SALE_INT', 'izq', 'Inner pipe out'],
  ['CURVA_INT', 'izq', 'Inner-pipe bend'],
  ['ENTRA_INT', 'izq', 'Inner pipe in'],
  ['TUBO_EXT', 'izq', 'Outer pipe (cut)'],
  ['TUBO_INT', 'izq', 'Inner pipe'],
  ['RETORNO', 'der', 'Return-bend housing'],
  ['PERSONA', 'der', 'Person, 1.75 m'],
  ['ANULO', 'der', 'Annulus', { x: 430, y: 318 }],
  ['SALE_AN', 'der', 'Annulus out', { x: 300, y: 364 }],
];

export const DESCRIPCION = 'Intercambiador de doble tubo en isométrico: tres horquillas apiladas en su soporte, con cada rama del tubo exterior ' +
  'abierta por el plano vertical de su eje para ver el tubo interior, entero, y el ánulo entre los dos. Atrás, el cabezal de la curva de retorno ' +
  'de cada horquilla; adelante, la brida y el prensaestopas de cada rama, las curvas del tubo interior entre horquillas y los puentes del ánulo. ' +
  'El tubo interior lleva el fluido frío y el ánulo el caliente, en contracorriente. Junto a los cabezales de retorno, una persona de 1,75 m de pie ' +
  'en el piso da la escala.';
export const DESCRIPCION_EN = 'Double-pipe exchanger in isometric: three hairpins stacked on their support, each leg of the outer pipe opened along ' +
  'the vertical plane of its axis to show the whole inner pipe and the annulus. At the back, the return-bend housing of each hairpin; at the front, ' +
  'the flange and packing gland of each leg, the inner-pipe bends between hairpins and the annulus jumpers. A person 1.75 m tall stands by the ' +
  'return bends for scale.';
