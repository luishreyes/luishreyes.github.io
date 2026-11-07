// Los nombres de las piezas del ciclón, en español (la vista del libro) y en inglés (la lámina de la edición impresa).
// Cada rótulo: [ancla, vista ('fig', o 'd', el detalle de la válvula rotativa), texto, x, y del texto, lado]. El lado
// dice por dónde llega la línea al texto: 'der' (el texto queda a la derecha de la línea) o 'izq'. Las anclas son
// puntos de build.mjs (out/fig_data.json y out/detalle_data.json); x, y van en las unidades de la vista del libro (las de
// la vista entera; el círculo va abajo a la izquierda, en la posición de libro.mjs).
export const ROTULOS = [
  // a la izquierda, arriba
  ['SALE_GAS', 'fig', 'Sale el gas al\nfiltro de mangas', 150, 40, 'izq'],
  ['DESGASTE_ENTRADA', 'fig', 'Desgaste: el cilindro, justo\ndespués de la entrada', 300, 236, 'izq'],
  ['TUBO_SALIDA', 'fig', 'Tubo de salida (buscador de\nvórtice): 0,5 D; entra 0,5 D', 300, 318, 'izq'],
  ['CILINDRO', 'fig', 'Cuerpo: cilindro de 1,5 D\n(D = 1,2 m)', 300, 400, 'izq'],
  ['GRUESAS', 'fig', 'Partículas gruesas: van a la\npared y bajan en espiral', 300, 482, 'izq'],
  // a la izquierda, el cono
  ['CONO', 'fig', 'Cono de 2,5 D', 300, 812, 'izq'],
  ['POLVO_CONO', 'fig', 'El polvo baja por\nla pared del cono', 300, 868, 'izq'],
  ['DESGASTE_CONO', 'fig', 'Desgaste: el cono, cerca\nde la descarga', 300, 950, 'izq'],
  ['BOCA', 'fig', 'Salida del polvo: 0,375 D', 300, 1032, 'izq'],
  // a la derecha, arriba (sobre el ducto de entrada)
  ['ENTRADA', 'fig', 'Entrada tangencial:\n0,5 D × 0,2 D', 790, 206, 'der'],
  ['ENTRA_AIRE', 'fig', 'Entra el aire con polvo\ndel secador por aspersión', 790, 288, 'der'],
  // a la derecha, abajo del ducto
  ['V_AFUERA', 'fig', 'Vórtice exterior: baja\npegado a la pared', 680, 452, 'der'],
  ['V_ADENTRO', 'fig', 'Vórtice interior: sube por\nel centro, más rápido', 680, 534, 'der'],
  ['OREJA', 'fig', 'Oreja de apoyo', 680, 612, 'der'],
  ['FINAS', 'fig', 'Partículas finas: se van\ncon el gas por el centro', 680, 666, 'der'],
  ['FIN_VORTICE', 'fig', 'Fin del vórtice: 2 D bajo\nel tubo de salida', 680, 760, 'der'],
  ['PATA', 'fig', 'Pata', 680, 1010, 'der'],
  ['NIVEL', 'fig', 'Interruptor de nivel alto', 680, 1088, 'der'],
  ['TOLVA', 'fig', 'Tolva colectora,\nde diámetro D', 680, 1134, 'der'],
  ['POLVO', 'fig', 'Polvo en la tolva', 680, 1210, 'der'],
  ['MOTOR', 'fig', 'Motorreductor', 680, 1268, 'der'],
  ['VALVULA', 'fig', 'Válvula rotativa: deja salir\nel polvo sin dejar entrar aire', 680, 1320, 'der'],
  ['POLVO_SALE', 'fig', 'Polvo al aglomerador', 680, 1440, 'der'],
  // el detalle de la válvula
  ['D_ENTRA', 'd', 'Polvo de la tolva', -45, 1122, 'izq'],
  ['D_PALETA', 'd', 'Paletas con poca\nholgura en la carcasa', -45, 1168, 'izq'],
  ['D_VACIA', 'd', 'Las celdas suben vacías', -45, 1238, 'izq'],
  ['D_ROTOR', 'd', 'Rotor', -45, 1280, 'izq'],
  ['D_CARCASA', 'd', 'Carcasa', -45, 1320, 'izq'],
  ['D_SALE', 'd', 'Sale el polvo', -45, 1376, 'izq'],
  ['D_LLENA', 'd', 'Bajan\nllenas', 262, 1246, 'der'],
];
// El nombre del círculo, debajo: [vista, texto, dx, dy]
export const PIES = [['d', 'La válvula rotativa, casi\ntres veces más grande', 0, 0]];

// La lámina de la edición en inglés lleva pocos rótulos, con su propia posición
export const ROTULOS_EN = [
  ['SALE_GAS', 'fig', 'Gas out to\nthe bag filter', 150, 40, 'izq'],
  ['TUBO_SALIDA', 'fig', 'Vortex finder', 300, 318, 'izq'],
  ['GRUESAS', 'fig', 'Coarse particles\nspiral down the wall', 300, 482, 'izq'],
  ['CONO', 'fig', 'Cone', 300, 812, 'izq'],
  ['BOCA', 'fig', 'Dust outlet', 300, 1032, 'izq'],
  ['ENTRADA', 'fig', 'Tangential inlet', 790, 222, 'der'],
  ['ENTRA_AIRE', 'fig', 'Dusty air in', 790, 288, 'der'],
  ['V_AFUERA', 'fig', 'Outer vortex', 680, 462, 'der'],
  ['V_ADENTRO', 'fig', 'Inner vortex', 680, 540, 'der'],
  ['FINAS', 'fig', 'Fines leave\nwith the gas', 680, 666, 'der'],
  ['FIN_VORTICE', 'fig', 'Vortex end', 680, 770, 'der'],
  ['TOLVA', 'fig', 'Collecting hopper', 680, 1140, 'der'],
  ['VALVULA', 'fig', 'Rotary valve', 680, 1330, 'der'],
  ['POLVO_SALE', 'fig', 'Dust to the\nagglomerator', 680, 1440, 'der'],
  ['D_LLENA', 'd', 'Full\npockets', 262, 1246, 'der'],
  ['D_VACIA', 'd', 'Empty pockets\nreturn', -45, 1238, 'izq'],
];
export const PIES_EN = [['d', 'Rotary valve, ×2.7', 0, 0]];

export const DESCRIPCION = 'Ciclón de flujo invertido de alta eficiencia de Stairmand, de 1,2 m de diámetro, en isométrico, cortado por un plano que pasa por el eje, sin la mitad que mira al lector; es uno de los cuatro que recogen el polvo del aire de un secador por aspersión de café instantáneo. ' +
  'El aire con polvo llega por un ducto rectangular y entra tangencial, por una boca de 0,5 D de alto por 0,2 D de ancho en la pared del cilindro, de 1,5 D de alto; debajo sigue un cono de 2,5 D que termina en la salida del polvo, de 0,375 D. El tubo de salida, de 0,5 D, baja 0,5 D desde el techo, hasta el borde de abajo de la entrada, y sube a un codo y al ducto que va al filtro de mangas. ' +
  'Unas flechas muestran el vórtice exterior, que baja en espiral pegado a la pared, y el vórtice interior, que sube por el centro hasta el tubo de salida; el vórtice termina dentro del cono, a 2 D por debajo del tubo de salida. Las partículas gruesas forman una hebra que baja en espiral por la pared hasta la salida; las finas suben por el centro y se van con el gas. Se marcan las dos zonas que más se desgastan: el cilindro justo después de la entrada y el cono cerca de la descarga. ' +
  'El polvo cae a una tolva colectora de diámetro D, con un interruptor de nivel alto, y sale por una válvula rotativa movida por un motorreductor, que lo deja salir hacia el aglomerador sin dejar entrar aire. El ciclón se apoya en dos patas con orejas; las de adelante se van con el corte. ' +
  'Un círculo amplía la válvula: el rotor de ocho paletas gira dentro de la carcasa con poca holgura; las celdas bajan llenas de polvo por un lado y suben vacías por el otro.';

export const DESCRIPCION_EN = 'A Stairmand high-efficiency reverse-flow cyclone, 1.2 m in diameter, in isometric, cut by a plane through the axis with the half facing the reader removed; it is one of four that collect the powder from the air of an instant-coffee spray dryer. ' +
  'The dusty air arrives through a rectangular duct and enters tangentially through an opening 0.5 D high and 0.2 D wide in the wall of the cylinder, which is 1.5 D tall; below it a 2.5 D cone ends in the 0.375 D dust outlet. The 0.5 D vortex finder reaches 0.5 D down from the roof, to the bottom of the inlet, and rises to an elbow and the duct to the bag filter. ' +
  'Arrows show the outer vortex spiralling down along the wall and the inner vortex rising through the centre to the vortex finder; the vortex ends inside the cone, 2 D below the vortex finder. Coarse particles form a strand that spirals down the wall to the outlet; fines rise through the centre and leave with the gas. The two zones that wear most are marked: the cylinder just past the inlet and the cone near the discharge. ' +
  'The powder falls into a collecting hopper of diameter D, with a high-level switch, and leaves through a rotary valve driven by a geared motor, which lets it out to the agglomerator without letting air in. The cyclone stands on two legs with lugs; the front ones are removed with the cut. ' +
  'A circle enlarges the valve: the eight-vane rotor turns inside the housing with a small clearance; the pockets go down full of powder on one side and come back empty on the other.';
