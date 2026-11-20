/* Medidas de una etapa del TASTE (evaporador de película descendente de los cítricos) en isométrico.
   Unidades: 1 = 1 mm, z hacia arriba desde el piso (z = 0). El eje de la calandria va en x = y = 0. Como en el
   condensador del capítulo 23, la calandria se corta por el plano vertical de su eje que mira de frente al lector:
   u va a lo largo del corte (hacia la derecha de la pantalla), n hacia el lector; se dibuja la mitad de atrás (n ≤ 0).
   Los ángulos alrededor de un eje vertical se miden desde +u hacia +n; la mitad de atrás es la de 180° a 360°.
   Son parámetros del dibujo: los tamaños que salen del caso van como entran, y lo demás (espesores, bridas, cámaras,
   soportes, posiciones) es una elección plausible. Tubería de acero inoxidable 10S y bridas ASME B16.5, clase 150. */

/* tubo: radio exterior e interior; brida: radio, espesor, radio del círculo de pernos y número de pernos */
export const DN = {
  25: { ro: 16.7, ri: 13.9, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  40: { ro: 24.15, ri: 21.4, fl: 63.5, ft: 17.5, bc: 49.2, nb: 4 },
  50: { ro: 30.15, ri: 27.4, fl: 76.2, ft: 19.1, bc: 60.3, nb: 4 },
  100: { ro: 57.15, ri: 54.1, fl: 114.3, ft: 23.9, bc: 95.25, nb: 8 },
  250: { ro: 136.5, ri: 132.3, fl: 203.2, ft: 30.2, bc: 181, nb: 12 },
  300: { ro: 161.95, ri: 157.4, fl: 241.3, ft: 31.75, bc: 215.9, nb: 12 },
};

export const EV = {
  AZ: 52, EL: 24,
  /* la calandria: los tubos de 2 in (48 mm por dentro) y 12 m de cara a cara de los espejos, en triángulo de 1,25 do; la
     coraza, del haz más la holgura de haz fijo. El jugo baja por los tubos en película; el vapor de calentamiento va
     por la coraza */
  cal: {
    R: 214.5, tw: 6,                      // coraza: radio interior y pared
    L: 12000,                             // largo de los tubos, de cara de afuera a cara de afuera de los espejos
    ts: 40, RF: 290,                      // espejos (se extienden como bridas): espesor y radio
    tube: { ro: 25.4, ri: 24, p: 63.5, Rb: 208.5 },          // tubos de 2 in en triángulo; radio del haz
    // las posiciones del triángulo que se dejan sin tubo bajo la boquilla del vapor, para la placa de choque
    sinTubo: [[-127, -110], [-31.75, -165]],
    soportes: { n: 3, t: 8, cut: 0.4, gap: 1.6 },             // placas soporte: número, espesor, corte y holgura
    bolts: { bc: 258, n: 16, af: 30, h: 18 },                 // los pernos de las bridas del cuerpo
    // la cámara de reparto, arriba: brida, cilindro y cono (60° de ángulo incluido) hasta el cuello DN 100
    arriba: { flange: 30, cyl: 250, cono: 30, cuello: 100 },
    // la cámara de abajo: brida, cilindro y cono hasta el cuello DN 300 de la mezcla
    abajo: { flange: 30, cyl: 350, cono: 30, cuello: 120 },
    // el tubo reducido con Venturi sobre el cono: entrada DN 40, garganta y salida DN 100
    venturi: { conv: 60, garganta: 20, rg: 10, div: 250, t: 6 },
    // el vapor de calentamiento entra arriba de la coraza (a 400 mm del espejo), con su placa de choque; el venteo,
    // arriba (a 110 mm del espejo); el condensado, abajo, a ras del espejo
    vapor: { deg: 240, dz: 400, cuello: 160, choque: { r: 186, t: 6, media: 26, alto: 300, gap: 0 } },
    venteo: { deg: 330, dz: 110, cuello: 120 },
    condensado: { deg: 315, dz: 45, cuello: 120 },
    // las orejas sobre la estructura y la guía de arriba
    orejas: { degs: [196, 344], w: 180, h: 220, t: 14, z: 10000 },
    guia: { z: 15600, alto: 120, t: 10 },
    estructura: { du: 400, n: -560, col: 160, viga: 160, alto: 15800 },
    // el detalle: la boca del tubo del centro, M veces más grande en un círculo de radio R (unidades de la vista)
    detalle: { M: 20, R: 115 },
  },
  /* el separador ciclónico: el diámetro de Souders y Brown con el K de diseño del caso; la entrada tangencial de la
     mezcla, la salida del vapor arriba y la del jugo por el cono de abajo */
  sep: {
    u: 1500,                              // el eje, a lo largo del corte (su n sale de la entrada tangencial)
    R: 420, tw: 6,                        // radio interior y pared
    cyl: 1700, cabeza: 0.25,              // cilindro y fondo 2:1 de arriba
    conoAng: 30,                          // el cono de abajo: medio ángulo desde la vertical
    salida: 850,                          // la cara de la brida de la salida del jugo, sobre el piso
    cuelloSalida: 100, cuelloVapor: 180,
    entradaDz: 260,                       // el eje de la entrada tangencial, bajo la tangente de arriba
    patas: { n: 3, r: 44.45, fase: 30, pad: { w: 140, h: 220, t: 12 } },   // tres patas de 3 in sobre el cilindro
  },
  /* la línea de la mezcla: del cuello de abajo de la calandria baja un tramo, un codo de radio largo y sigue derecho a la
     entrada tangencial */
  mezcla: { carrete: 150, codo: 457 },
  /* la bomba centrífuga del jugo, de succión axial, delante del separador, con su eje a lo largo del corte: la succión
     baja del separador, viene hacia el lector y entra por la izquierda; el motor, a la derecha */
  bomba: { z: 330, n: 650, succion: 160, casco: { r: 120, ancho: 110 }, soporte: 260, motor: { r: 105, largo: 330 }, base: { alto: 120 } },
  /* la persona de referencia (../persona.mjs, 1,75 m), de pie en el piso, al pie del separador */
  persona: { u: 720, n: 500, rumbo: 160 },
};

/* Las alturas, de abajo hacia arriba: el separador fija la entrada de la mezcla; la calandria sube desde ahí */
export function cotas() {
  const C = EV.cal, S = EV.sep, M = EV.mezcla, D3 = DN[300], D1 = DN[100], D4 = DN[40];
  const Z = {};
  const t30 = Math.tan((S.conoAng * Math.PI) / 180);
  Z.sepSalida = S.salida;                                    // la cara de abajo de la brida de la salida del jugo
  Z.sepCono0 = Z.sepSalida + DN[50].ft + S.cuelloSalida;     // la punta del cono (el cuello DN 50 empieza en la brida)
  Z.sepCono1 = Z.sepCono0 + (S.R - DN[50].ri) / t30;         // la tangente de abajo del cilindro
  Z.sepCil1 = Z.sepCono1 + S.cyl;                            // la tangente de arriba
  Z.sepTop = Z.sepCil1 + S.cabeza * 2 * S.R + S.tw;          // lo más alto de la cabeza, por fuera
  Z.duct = Z.sepCil1 - S.entradaDz;                          // el eje de la entrada tangencial y de la línea de la mezcla
  // la calandria, desde la línea de la mezcla
  Z.lineaFl = Z.duct + M.codo + M.carrete;                   // la cara de abajo de la brida de la línea (entera)
  Z.bocaFl0 = Z.lineaFl + D3.ft;                             // la brida del cuello (cortada)
  Z.bocaFl1 = Z.bocaFl0 + D3.ft;
  Z.conoB0 = Z.bocaFl1 + C.abajo.cuello;                     // el cono de la cámara de abajo
  Z.conoB1 = Z.conoB0 + (C.R - D3.ri) / Math.tan((C.abajo.cono * Math.PI) / 180);
  Z.camB1 = Z.conoB1 + C.abajo.cyl;                          // la brida de la cámara de abajo
  Z.tsB = Z.camB1 + C.abajo.flange;                          // la cara de abajo del espejo de abajo
  Z.s0 = Z.tsB + C.ts;                                       // la coraza
  Z.top = Z.tsB + C.L;                                       // la cara de arriba del espejo de arriba
  Z.s1 = Z.top - C.ts;
  Z.camT0 = Z.top + C.arriba.flange;                         // la cámara de reparto
  Z.conoT0 = Z.camT0 + C.arriba.cyl;
  Z.conoT1 = Z.conoT0 + (C.R - D1.ri) / Math.tan((C.arriba.cono * Math.PI) / 180);
  Z.cuelloT1 = Z.conoT1 + C.arriba.cuello;                   // la brida del cuello DN 100 (cortada)
  Z.bocaT1 = Z.cuelloT1 + D1.ft;
  Z.ventB = Z.bocaT1;                                        // el Venturi: su brida DN 100, el difusor, la garganta, la entrada
  Z.ventD1 = Z.ventB + D1.ft;
  Z.ventG0 = Z.ventD1 + C.venturi.div;
  Z.ventG1 = Z.ventG0 + C.venturi.garganta;
  Z.ventC1 = Z.ventG1 + C.venturi.conv;
  Z.ventT = Z.ventC1 + D4.ft;                                // la cara de arriba de su brida DN 40
  Z.jugo = Z.ventT + D4.ft + 160;                            // el tramo horizontal de la línea del jugo
  return Z;
}

/* Los tubos: el triángulo de 1,25 do con una fila en el plano del corte (n = 0), dentro del haz, sin las posiciones que
   se dejan bajo la boquilla del vapor. Devuelve los centros (u, n) de todos y de la mitad de atrás, y la fila del corte */
export function tubos() {
  const T = EV.cal.tube, dy = T.p * Math.sin(Math.PI / 3), lim = T.Rb - T.ro;
  const todos = [];
  for (let j = -6; j <= 6; j++) {
    const n = j * dy;
    for (let i = -6; i <= 6; i++) {
      const u = (i + (Math.abs(j) % 2) / 2) * T.p;
      if (Math.hypot(u, n) > lim + 1e-6) continue;
      if (EV.cal.sinTubo.some(([a, b]) => Math.abs(a - u) < 1 && Math.abs(b - n) < 1)) continue;
      todos.push({ u, n, fila: j });
    }
  }
  return { todos, atras: todos.filter((t) => t.n < -1), corte: todos.filter((t) => Math.abs(t.n) < 1), total: todos.length };
}
