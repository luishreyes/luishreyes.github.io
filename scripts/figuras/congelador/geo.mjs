/* Medidas del congelador de lecho fluidizado de dos etapas (IQF) del capítulo 16 del libro de operaciones unitarias
   (Partículas en un fluido, «Congelar en un lecho fluidizado» y el ejemplo de las arvejas): un equipo de unos 4000 kg/h
   de arvejas, en corte.
   Unidades: 1 = 1 mm. x a lo largo del recorrido de las arvejas (entran por la izquierda, x < 0, y salen por la
   derecha), y hacia el lector (el corte quita la pared de y > 0 y el techo), z hacia arriba. El piso de la planta está
   en z = 0; el interior del recinto va de x = 0 a 5000, de y = −1950 a 0 y de z = 300 hacia arriba.

   De las fuentes (con su página; el README dice qué sale de dónde):
   - aire entre −25 y −35 °C que sube a 2 a 6 m/s por una capa de 2 a 13 cm de producto sobre una bandeja perforada o
     una banda; en dos etapas, primero una capa delgada que forma la costra y después una banda con capas de 10 a 15 cm
     (Fellows, 2000, p. 427); hasta 10 000 kg/h (p. 427); la escarcha en el serpentín y el deshielo (pp. 426–427);
   - las dos etapas: entrada del producto, banda 1, vertedero, banda 2 y la agitación de la banda, que es opcional; la
     primera fluidiza y forma la costra, la segunda termina de congelar el centro sobre la banda, sin fluidizar (Berk,
     2013, pp. 472–474, figs. 20.8 y 20.9);
   - el aire sube vertical por la banda de malla y levanta el producto (Singh y Heldman, 2009, p. 508); los
     ventiladores abajo y el serpentín al lado del lecho, dentro de un recinto aislado (fig. 7.7, p. 509);
   - la arveja de 6 mm, unos 1120 kg/m³, porosidad de 0,40 en reposo, aire a −30 °C en Bogotá: U_mf = 1,45 m/s y
     U_T = 14,5 m/s; una capa de 10 cm pesa 658 Pa (ejemplo 16.6 del libro).
   Lo demás es «medida del libro»: típico de un equipo así, escogido para el dibujo. */
export const CG = {
  AZ: 62, EL: 28,
  /* el recinto: paneles de poliuretano de 150 mm con piel de acero */
  t: 150,
  x0: 0, x1: 5000,                          // interior
  yb: -1950,                                // la cara de adentro de la pared de atrás
  zf: 300,                                  // el piso de adentro (panel de 150 sobre el bastidor)
  ztop: 3000,                               // la corona de las paredes (el techo se quitó)
  base: { z0: 70, z1: 150, w: 100, ys: [-2100, -1100, -100], feet: [0, 1700, 3400, 5000], rf: 45, rp: 70 },
  /* la cubierta de los ventiladores y el tabique que separa el lecho del retorno del aire */
  deck: { z0: 890, z1: 900, y0: -1200 },
  part: { y0: -1210, y1: -1200, z1: 2550 },
  /* los ventiladores axiales: Ø 800 mm, con el motor colgado debajo */
  fan: { xs: [480, 1460, 2950, 4150], y: -520, rin: 410, rout: 420, rfl: 470, flT: 12, z0: 740, bell: 720, rbell: 440,
    rm: 130, zm0: 440, zm1: 710, rs: 22, zh0: 846, zh1: 876, rh: 110, nb: 6, bar: { y: [-110, 110], w: 40, z0: 710, z1: 720, half: 418 } },
  /* las bandas: tambores de Ø 220 mm, banda de 10 mm, 1140 mm de ancho */
  rd: 110, tb: 10, wb: 1140, rsh: 30,
  b1: { z: 1850, xt: 380, xh: 2000 },        // la primera etapa: la cara de arriba de la banda y los tambores
  b2: { z: 1500, xt: 2200, xh: 4750 },       // la segunda
  bars: { w: 20, h: 28, pitch: 200 },        // la rejilla que sostiene la banda
  rail: { y0: -50, y1: -10, h: 30 },
  weir: { x0: 1890, x1: 1900, gap: 7, h: 80 },          // el vertedero al final de la primera etapa
  div: { x0: 1940, x1: 1950 },                          // el tabique entre los dos plenos
  seal: { x1: 2070 },                                   // la placa que cierra el pleno de la segunda etapa
  cam: { x: 1060, r: 52, e: 14, rs: 24, ys: [-900, -500, -60], w: 40, y1: -30 },   // el eje de levas que sacude la banda 1
  /* los lechos */
  bed1: { x0: 470, x1: 1890, h: 70, jump: 75 },          // la capa fluidizada: unos 4,5 cm quieta, 7 expandida
  bed2: { x0: 2250, x1: 4700, h: 100 },                  // la capa de 10 cm del ejemplo
  /* la descarga: canal inclinado que sale por la pared derecha */
  chute: { a: [4890, 1250], b: [5520, 960], y0: -1200, y1: -30, wall: 100, t: 6 },
  /* el alimentador vibratorio, afuera de la pared izquierda */
  pan: { x0: -1300, x1: 420, y0: -1170, y1: -30, z0: 2150, t: 6, wall: 120, layer: 24 },
  feeder: { beams: [[-1180, -1120], [-520, -460]], by: [[-1130, -1070], [-130, -70]], bz: [1900, 1960], bx: [-1420, -160],
    leg: 80, cz: [1820, 1900], cx: -260, motorX: -800, motorR: 75, motorYs: [[-950, -650], [-550, -250]] },
  notchL: { y0: -1210, z0: 2140, z1: 2320 },             // la ranura de la pared izquierda (el alimentador)
  notchR: { y0: -1210, z0: 1100, z1: 1360 },             // la de la derecha (la salida)
  /* el evaporador: serpentín horizontal, el aire baja por sus aletas */
  coil: { x0: 300, x1: 4000, y0: -1950, y1: -1210, z0: 2150, z1: 2550, plate: 12, fin: 12,
    rows: [-1880, -1775, -1670, -1565, -1460, -1355, -1250], ranks: [2200, 2290, 2380, 2470], rt: 14 },
  hood: { w: 200, xl: 130 },                                     // la tapa de las curvas de retorno
  defrost: { y: -1580, z: 2700, r: 24, noz: 9 },         // el rociador del deshielo
  hdr: { liq: { y: -1800, z: 2620, r: 22 }, suc: { y: -1350, z: 2850, r: 32, ins: 22 } },   // las líneas del refrigerante
  drain: { x: 2200, y: -450, r: 90 },
};

// El aire y la arveja del ejemplo 16.6
export const AIRE = { T: -30, rho: 1.056, mu: 15.70e-6, umf: 1.45, ut: 14.5 };
export const ARVEJA = { x: 6, rho: 1120, eps: 0.40 };

// Lo que da el dibujo (para el README y el pie): el caudal de aire de cada etapa con la velocidad escogida, la masa de
// la capa de la segunda etapa y su tiempo de residencia con 4000 kg/h
export function cuentas(cap = 4000) {
  const w = CG.wb / 1000;
  const a1 = w * (CG.bed1.x1 - CG.bed1.x0) / 1000, a2 = w * (CG.bed2.x1 - CG.bed2.x0) / 1000;
  const u1 = 3.5, u2 = 1.2;
  const q1 = a1 * u1, q2 = a2 * u2;
  const masa2 = a2 * (CG.bed2.h / 1000) * (1 - ARVEJA.eps) * ARVEJA.rho;
  const t2 = masa2 / (cap / 3600) / 60;
  const dp2 = (1 - ARVEJA.eps) * ARVEJA.rho * 9.807 * CG.bed2.h / 1000;
  return { a1, a2, u1, u2, q1, q2, qh: (q1 + q2) * 3600, masa2, t2, dp2, r1: u1 / AIRE.umf, r2: u2 / AIRE.umf };
}
