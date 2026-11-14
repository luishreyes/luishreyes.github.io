/* Medidas del termosifón vertical y del fondo de la columna en isométrico.
   Unidades: 1 = 1 mm. z hacia arriba, desde el piso (z = 0). El eje de la columna va en x = 0, y = 0 y el del
   rehervidor en x = TS.reh.x, y = 0: los dos ejes y las dos líneas que los unen quedan en el plano y = 0, que es el
   plano del corte. Los ángulos alrededor de un eje vertical (φ) se miden desde +x hacia +y; la mitad que se dibuja es
   la de atrás, φ ∈ [180°, 360°]. Los tubos van en cuadro, con una fila en el plano del corte. */
export const TS = {
  AZ: 60, EL: 22,
  /* la columna: el fondo con su cabeza elíptica 2:1 sobre un faldón; el cuerpo se corta arriba de los dos platos */
  col: { R: 750, t: 10, sumidero: 1200, arriba: 1150 },
  faldon: { t: 12, anillo: { r0: 690, r1: 860, t: 25 }, pernos: { n: 8, r: 810, d: 30 }, cimiento: { lado: 2100, alto: 300 },
    acceso: { r: 260, phi: 240, z: 900 }, respiraderos: { r: 25, z: 3200, phi: [215, 325] } },
  // los platos perforados: la cubierta, el bajante y su vertedero; la espuma sobre la cubierta y el líquido del bajante
  platos: { espacio: 600, sobreRetorno: 470, t: 4, bajante: 230, vertedero: 50, espuma: 120, anillo: 50, despeje: 40,
    sello: { hondo: 120, ancho: 330, vertedero: 80 } },
  // el rompe-vórtice sobre la boca del fondo: dos placas en cruz
  rompeVortice: { alto: 150, largo: 520, t: 8 },
  /* el rehervidor: espejos fijos, coraza de un paso, dos bonetes con su cabeza elíptica 2:1 y las boquillas axiales */
  reh: { x: 2200, R: 576, t: 10, espejo: 50, bridaR: 665, bridaT: 60, junta: 3, cil: 250, cabeza: 288, pernos: 44,
    tubos: { di: 25, do: 30, L: 2440, paso: 37.5, R: 566 }, soportes: [0.36, 0.68], corteSoporte: 0.3, cuello: 150,
    condensado: 35 },
  /* las líneas: la entrada desde el fondo de la columna hasta el bonete de abajo y el retorno de la mezcla */
  entrada: { ro: 161.95, t: 9.5, bridaR: 241.5, bridaT: 32, codo: 457, z: 1000, orificio: { x: 1300, t: 6, oreja: 110 } },
  retorno: { ro: 330, t: 9.5, bridaR: 435, bridaT: 60, codo: 660, cuello: 180 },
  boquillaFondo: { cuello: 150 },
  manga: { r: 215, t: 8, largo: 90 },
  // la vinaza que sale del fondo de la columna: una boquilla fuera del eje, que baja dentro del faldón y sale por él
  vinaza: { ro: 84.15, t: 7.1, x: -440, y: -230, z: 2450, x1: -1700, bridaR: 140, bridaT: 24 },
  /* el lado del vapor: la entrada arriba de la coraza, la salida del condensado abajo, a la trampa, y el venteo justo
     arriba del condensado, en el extremo frío */
  vapor: { ro: 136.5, phi: -15, z: 280, largo: 380, sube: 1350, bridaR: 203, bridaT: 30 },
  condensado: { ro: 44.45, phi: -10, largo: 450, baja: 620, bridaR: 95, bridaT: 20, x1: 900 },
  trampa: { r: 105, largo: 300, tapaR: 125 },
  venteo: { ro: 16.7, phi: -20, z: 260, largo: 230 },
  patas: { r: 950, phi: [-100, -140], lado: 160, t: 10, oreja: 0.62, pedestal: { lado: 520, alto: 300 } },
  /* la persona de referencia (../persona.mjs, 1,75 m), de pie en el piso */
  persona: { x: 3700, y: 380, rumbo: 215 },
};

/* Las alturas, de abajo hacia arriba, a partir de la línea de entrada y del largo de los tubos */
export function cotas() {
  const E = TS.entrada, Rh = TS.reh, R = TS.retorno, C = TS.col;
  const Z = {};
  Z.E = E.z;                                                      // el eje de la línea de entrada
  // el codo de abajo del rehervidor sube a la brida de la boquilla de abajo; de ahí, el cuello y el bonete
  Z.bridaE0 = Z.E + E.codo;                                       // la cara de abajo de la brida del tubo
  Z.bridaE1 = Z.bridaE0 + E.bridaT;                               // la junta
  Z.bocaE0 = Z.bridaE1 + Rh.junta;                                // la brida de la boquilla
  Z.bocaE1 = Z.bocaE0 + E.bridaT;
  Z.cabezaAbajo = Z.bocaE1 + Rh.cuello;                           // el fondo de afuera de la cabeza de abajo
  Z.cilAbajo = Z.cabezaAbajo + Rh.t + Rh.cabeza;                  // la tangente de la cabeza de abajo
  Z.bridaAbajo = Z.cilAbajo + Rh.cil;                             // la brida del bonete de abajo
  Z.B = Z.bridaAbajo + Rh.bridaT + Rh.junta;                      // la cara de abajo del espejo de abajo: la entrada de los tubos
  Z.L = Z.B + Rh.tubos.L;                                         // la cara de arriba del espejo de arriba: el nivel de la columna
  Z.bridaArriba = Z.L + Rh.junta;
  Z.cilArriba = Z.bridaArriba + Rh.bridaT;
  Z.tanArriba = Z.cilArriba + Rh.cil;
  Z.cabezaArriba = Z.tanArriba + Rh.cabeza + Rh.t;                // lo más alto de la cabeza de arriba, por fuera
  Z.bocaR0 = Z.cabezaArriba + Rh.cuello;                          // la brida de la boquilla de arriba
  Z.bocaR1 = Z.bocaR0 + R.bridaT;
  Z.bridaR0 = Z.bocaR1 + Rh.junta;                                // la brida del tubo de retorno
  Z.bridaR1 = Z.bridaR0 + R.bridaT;
  Z.R = Z.bridaR1 + R.codo;                                       // el eje del retorno
  // la columna
  Z.tanCol = Z.L - C.sumidero;                                    // la tangente de la cabeza de la columna
  Z.fondoCol = Z.tanCol - (C.R + C.t) / 2;                        // lo más bajo de la cabeza, por fuera
  Z.plato1 = Z.R + R.ro + TS.platos.sobreRetorno;                 // la cara de arriba de la cubierta del plato de abajo
  Z.plato2 = Z.plato1 + TS.platos.espacio;
  Z.arriba = Z.plato2 + TS.col.arriba - TS.platos.espacio;        // el corte de arriba del cuerpo
  return Z;
}

/* Los tubos del rehervidor: los centros (x relativo al eje, y) de la fila del corte (y = 0) y de la de atrás */
export function tubos() {
  const T = TS.reh.tubos, p = T.paso, lim = T.R - T.do / 2;
  const fila = (y) => { const out = []; for (let i = -40; i <= 40; i++) { const x = i * p; if (Math.hypot(x, y) <= lim) out.push([x, y]); } return out; };
  let total = 0;
  for (let j = -40; j <= 40; j++) total += fila(j * p).length;
  return { corte: fila(0), atras: fila(-p), total };
}
