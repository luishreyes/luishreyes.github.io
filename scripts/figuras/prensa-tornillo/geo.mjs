/* Medidas de la prensa de tornillo (expulsor) del capítulo 18 del libro de operaciones unitarias (Filtración, «Apretar
   para sacar el líquido»): una prensa continua de tamaño mediano, de unos 1000 kg/h de semilla oleaginosa acondicionada
   (caliente y en hojuelas), dentro de los 40 a 8000 kg/h de Fellows.
   Unidades: 1 = 1 mm. x a lo largo del eje (las hojuelas entran por la izquierda, en x < 0, y la torta sale por la
   derecha), y hacia el lector, z hacia arriba. El eje del tornillo va en y = 0, z = ZE; el piso, en z = 0.
   El corte: se quita el cuarto de arriba de la jaula que mira al lector (y > 0, z > ZE), y la mitad de adelante de la
   capota, de la bandeja, de la tolva y de la canaleta de la torta (y > 0).

   De las fuentes (con su página; el README dice qué sale de dónde):
   - un cilindro (barril) horizontal robusto con un tornillo helicoidal de acero inoxidable; el paso de los filetes se
     acorta hacia la salida y la última parte del barril va perforada; la presión se regula con el diámetro de la
     salida; el calor de la fricción baja la viscosidad del aceite; 40 a 8000 kg/h; la torta sale con 5 a 18 % de
     aceite (Fellows, 2000, p. 152);
   - un tornillo con el paso que se acorta, y una compuerta a la salida, hidráulica, de resorte o puesta con un
     tornillo; más de 50 000 kPa (Berk, 2013, p. 238); las semillas molidas se acondicionan con calor antes de entrar
     (Berk, 2013, p. 236);
   - el tornillo gira dentro de una malla o un cilindro ranurado; el diámetro del tornillo crece y el paso se acorta
     hacia la salida (Perry, 2008, p. 18-149);
   - la tolva arriba, en la entrada, con un alimentador en las prensas grandes; el cono a la salida, en el eje, que
     regula la contrapresión y el espesor de la torta; el paso menor que el diámetro y el eje a menos de 100 r/min; la
     jaula de barras planas de 12 mm de ancho, 20 a 25 mm de alto y 280 mm de largo, separadas por láminas de acero de
     unos 0,7 mm (0,8 mm a la entrada y 0,31 mm a la salida), en dos mitades unidas con abrazaderas; los gusanos en
     tramos, montados y enchavetados en un eje central, con un collar entre cada dos tramos y, en las prensas grandes,
     cuchillas fijas que bajan de la jaula al espacio del collar para que el material no gire con el tornillo; cada
     tramo con un filete de menos de 350° (Muhammad y otros, 1984, pp. 244–247);
   - el tornillo en un barril (jaula) con ranuras, el material empujado hacia una compuerta de salida; el cocinador
     antes de la prensa (Berk, 1992, FAO, sección 3-1).
   Lo demás es «medida del libro»: típico de una prensa así, escogido para el dibujo. */
export const PT = {
  AZ: 55, EL: 28,
  ZE: 950,                                          // la altura del eje
  /* la jaula: barras de 12 × 30 mm en tres tramos de 280 mm entre cuatro bastidores */
  R: 102,                                           // el radio del agujero de la jaula
  bar: { w: 12, h: 30, kw: 20, nq: 11, L: 280 },    // por cuarto: una barra de cuchillas de 20 mm y 11 barras de 12 mm
  frames: [[0, 50], [330, 380], [660, 710], [990, 1040]],
  frameR: 200,
  tie: { r: 168, rr: 14, nut: 24, angs: [135, 225, 315] },
  /* el tornillo: punta de los filetes a 100 mm del eje; los gusanos y los collares, de la entrada a la salida */
  tip: 100,
  /* [x0, x1, paso, radio del núcleo] de cada gusano; los collares van entre ellos */
  worms: [
    [-470, 0, 180, 45],
    [40, 211, 165, 50],
    [251, 407, 150, 56],
    [447, 588, 135, 62],
    [628, 754, 120, 68],
    [794, 905, 105, 74],
    [945, 1041, 90, 80],
  ],
  collars: [[0, 40, 54], [211, 251, 60], [407, 447, 66], [588, 628, 72], [754, 794, 78], [905, 945, 84]],
  flight: { tRoot: 24, tTip: 14 },
  shaft: 40,
  /* la caja de la entrada (fundición), con la garganta de arriba, y el alimentador vertical con su tolva */
  feed: { x0: -480, x1: 0, ro: 128, flR: 140, flT: 22, neck: { x0: -400, x1: -110, y: 150, t: 22 } },
  feeder: { x: -255, ri: 112, ro: 118, z0: 150, z1: 500, tip: 104, hub: 34, pitch: 150, fz0: 118, fz1: 485, cone: { z1: 790, r1: 380 }, rim: 860, level: 720 },
  /* el soporte del cojinete de empuje, el reductor, el acople y el motor */
  thrust: { x0: -760, x1: -480, r: 160 },
  gear: { x0: -1300, x1: -790, y: 250, z1: 1130, zin: 860 },
  belt: { x0: -1400, x1: -1300, rIn: 120, rM: 150 },
  motor: { x0: -1290, x1: -720, r: 180, z: 1340 },
  /* la salida: el anillo con el asiento cónico, el cono, el husillo, el soporte y el volante */
  seat: { x0: 1040, x1: 1090, r0: 102, r1: 130, ro: 140 },
  cone: { gap: 12, x0: 1046, xLand: 1104, xBack: 1122, rHub: 66, xHub: 1190, spindle: 40 },
  brk: { x0: 1440, x1: 1490, y: 170, boss: 80, bx0: 1425, bx1: 1505 },
  wheel: { x: 1588, r: 175, rr: 12 },
  /* la bandeja del aceite bajo la jaula y la canaleta de la torta bajo el cono */
  tray: { x0: 45, x1: 995, y: -270, zRim: 730, zB0: 500, zB1: 572, zOil: 522, out: { x: 120, y: -95, r: 30, z: 400, y1: 400 } },
  chute: { x0: 1080, x1: 1330, y: -175, z0: 430, z1: 790 },
  hood: { x0: 50, x1: 990, yb: -265, zb: 742, r: 210, ztop: 1200 },
  /* la base de perfiles */
  base: { x0: -1470, x1: 1650, y: 320, h: 180 },
};

/* Las cuentas del dibujo: la compresión del tornillo (volumen de un paso a la entrada y a la salida), la rendija entre
   barras por dentro y por fuera, y una capacidad de orden de magnitud */
export function cuentas() {
  const W = PT.worms, a = (r) => Math.PI * (PT.tip ** 2 - r ** 2);
  const vIn = a(W[0][3]) * W[0][2], vOut = a(W[W.length - 1][3]) * W[W.length - 1][2];
  const B = PT.bar, solid = B.kw + B.nq * B.w, ng = B.nq + 1;
  const gapIn = ((Math.PI / 2) * PT.R - solid) / ng, gapOut = ((Math.PI / 2) * (PT.R + B.h) - solid) / ng;
  // capacidad: volumen de la entrada por vuelta (sin el filete), a 30 r/min, con hojuelas de 550 kg/m³ y un llenado
  // de 0,3 (cifras del libro, no de las fuentes)
  const vVuelta = a(W[0][3]) * (W[0][2] - PT.flight.tTip) * 1e-9, cap = vVuelta * 30 * 60 * 550 * 0.3;
  return { compresion: vIn / vOut, gapIn, gapOut, vVuelta, cap };
}
