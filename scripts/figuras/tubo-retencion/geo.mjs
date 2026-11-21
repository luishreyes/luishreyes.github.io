/* Medidas del tubo de retención de E-201 con su válvula de desvío, para el capítulo 25 del libro de operaciones
   unitarias. Unidades: 1 = 1 mm; piso en z = 0, z hacia arriba. El serpentín corre a lo largo de x (la entrada del
   tubo en x = 0) y sus tramos se apilan hacia −y (el primero, el más bajo, va adelante, del lado del lector); E-201
   queda en x < 0 con la placa fija mirando hacia +x; la válvula de desvío va delante de E-201, en y = TR.fdv.y.
   Lo que sale del caso (caso.json, e201_tubo) y lo que es del dibujo (SUPUESTO) va marcado en cada línea; las fuentes,
   con su página, están en notas/figuras-isometricas.md del libro. */
export const TR = {
  AZ: 45, EL: 38,
  /* el tubo: sanitario de 2½ in, 63,5 mm por fuera y 60,20 por dentro (capítulo 13, tbl-vl-sanitary; PMO tabla 15,
     p. 318); 23,5 m con el doble de la velocidad media; 4 tramos rectos y 3 curvas de 180° (caso.json) */
  DO: 63.5, DI: 60.2,
  L: 23500, tramos: 4, curvas: 3,
  sube: 0.021,                    // 2,1 cm por metro de tubo (PMO 16p.(B)2.d(4), p. 98): 0,49 m en los 23,5 m
  Rc: 152.4,                      // SUPUESTO: el radio de las curvas en su eje (6 in; los tramos quedan a 304,8 mm)
  z0: 1000,                       // SUPUESTO: la entrada del tubo, a 1 m del piso
  /* el soporte de acero inoxidable (SUPUESTO): tres marcos de tubo cuadrado con patas niveladoras, un travesaño bajo
     los tramos y, por tramo, una varilla y una abrazadera de bisagra que fijan el tubo a su altura */
  est: { x: [450, 2758, 5066], leg: 50, yF: 140, yB: -1054.4, rod: 8, min: 80, zStr: 260, foot: { r: 38, h: 12, stem: 9, hs: 30 } },
  abraz: { w: 30, t: 4, oreja: 14 },
  ferr: { r: 38.75, w: 21, clamp: { r: 46, w: 26 } },   // SUPUESTO: férula de abrazadera de 2½ in (77,5 mm) y su abrazadera
  /* E-201, simplificado: la placa fija con sus boquillas y el comienzo del paquete (SUPUESTO; el 22 dibuja el
     intercambiador entero) */
  e201: { xF: -1100, t: 100, y0: -640, y1: 330, z0: 120, z1: 1700, noz: 100, pack: 380, padY: 50, padZ: 60 },
  // las boquillas en la cara de la placa fija: [y, z]; A, salida del calentamiento; B, entrada del regenerador (lado
  // pasteurizado); C, salida del enfriamiento (SUPUESTO: su posición)
  noz: { A: [0, 1000], B: [-520, 1000], C: [250, 720] },
  /* la salida del tubo: TT-204 y TI-204 en el mismo punto (PMO 16p.(B)2.e, p. 99), PSL-207 después y el codo que
     baja; la línea vuelve a E-201 (SUPUESTO: las distancias) */
  sal: { xT: -130, xP: -300, xC: -480 },
  /* la válvula de desvío: dos vástagos (la de desvío y la de detección de fugas), de asiento, con actuador neumático y
     resorte que la lleva a desvío (PMO 16p.(B)2.b, pp. 96–97; figs. 52 y 53, pp. 269–270). SUPUESTO: las medidas */
  fdv: {
    y: 250, xD: -300, sep: 222, bD: 585,
    rb: 51, rbi: 49,                                   // el cuerpo: 102 mm por fuera, pared de 2 mm
    asiento: { r: 30, s: [[90, 100], [170, 180]], ro: 51 },
    tapon: { r: 36, sello: 3, h: 20, arriba: 150, abajo: 100 },   // el tapón, en desvío (arriba) y adelante (abajo)
    camara: { abajo: [0, 90], medio: [100, 170], arriba: [180, 270] },
    puerto: { medio: 135, arriba: 225, largo: 60 },    // de la pared del cuerpo a la férula
    bonete: [270, 282], linterna: [282, 370], vastago: 10,
    act: { s0: 370, s1: 612, r: 60, ri: 57, tapa: 12, piston: 16, pDesvio: 560, resorte: { rm: 44, rw: 4.5, vueltas: 6.5 } },
    ctrl: { s0: 612, s1: 712, r: 50, domo: 18 },
    abajo: { stub: 48 },                                // el niple del puerto de abajo, hasta su férula
    lineas: { piso: 60, mirilla: [250, 370] },          // las líneas que bajan a TK-201 se cortan a 60 mm del piso
    tt205: 200,                                         // TT-205, a 200 mm de la férula de entrada de la válvula
    adelante: 380,                                      // la línea al llenado se corta 380 mm después de su férula
  },
  persona: { x: 1350, y: 760, rumbo: 205 },
  /* el círculo del detalle: la válvula de desvío en corte (el plano y = TR.fdv.y), M veces más grande, vista casi de
     frente al plano del corte (su propia cámara: AZ, EL) */
  det: { c: [-200, 250, 880], M: 3.5, R: 230, AZ: 75, EL: 20 },   // el círculo mira el corte casi de frente
};

/* el largo de cada tramo recto: lo que queda de los 23,5 m después de las tres curvas */
export const LS = (TR.L - TR.curvas * Math.PI * TR.Rc) / TR.tramos;
export const YR = (i) => -2 * TR.Rc * i;                                  // la y del tramo i (0 a 3)
export const ZS = (s) => TR.z0 + TR.sube * s;                             // la altura del eje a s mm de la entrada

/* el eje del serpentín: [x, y, z] a s mm de la entrada (s de 0 a L) */
export function ejeEn(s) {
  const L1 = LS, C = Math.PI * TR.Rc;
  let q = s;
  for (let i = 0; i < TR.tramos; i++) {
    const dir = i % 2 === 0 ? 1 : -1, x0 = i % 2 === 0 ? 0 : LS;
    if (q <= L1 || i === TR.tramos - 1) return [x0 + dir * Math.min(q, L1), YR(i), ZS(s)];
    q -= L1;
    if (q <= C) {
      // la curva i: centro en x = (i par ? LS : 0), y = YR(i) − Rc; de y = YR(i) a YR(i + 1)
      const cx = i % 2 === 0 ? LS : 0, cy = YR(i) - TR.Rc, t = q / TR.Rc;
      return [cx + dir * TR.Rc * Math.sin(t), cy + TR.Rc * Math.cos(t), ZS(s)];
    }
    q -= C;
  }
  return null;
}
/* s del comienzo y del final de cada tramo y de cada curva */
export function tramos() {
  const C = Math.PI * TR.Rc, out = [];
  let s = 0;
  for (let i = 0; i < TR.tramos; i++) { out.push({ tipo: "tramo", i, s0: s, s1: s + LS }); s += LS; if (i < TR.curvas) { out.push({ tipo: "curva", i, s0: s, s1: s + C }); s += C; } }
  return out;
}
/* la altura del tramo i sobre su eje en x */
export function zTramo(i, x) {
  const C = Math.PI * TR.Rc, s0 = i * (LS + C);
  const q = i % 2 === 0 ? x : LS - x;
  return ZS(s0 + q);
}

/* Las cuentas del dibujo, para comprobar contra caso.json */
export function cuentas() {
  const C = Math.PI * TR.Rc;
  return { LS, curva: C, largo: TR.tramos * LS + TR.curvas * C, subida: TR.sube * TR.L, zSalida: ZS(TR.L) };
}
