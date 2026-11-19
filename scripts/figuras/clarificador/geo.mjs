/* Medidas del clarificador de placas del capítulo 17 del libro de operaciones unitarias: un tanque rectangular con
   el primer cuarto libre y placas inclinadas en los tres cuartos de atrás.
   Unidades: 1 = 1 mm. x a lo largo del tanque (el agua entra por x = 0 y sale por x = L), y hacia el lector (el corte
   quita el muro de y > 0), z hacia arriba. El piso de adentro está en z = 0; el interior va de x = 0 a L, de y = −W a 0.
   Las medidas del caso y la fuente de cada una están en notas/figuras-isometricas.md del libro; lo que no sale de una fuente es «medida
   del libro», escogido para el dibujo. */
export const CL = {
  AZ: 62, EL: 28,
  /* el tanque: concreto, muros de 250 mm sobre una losa de 600 */
  L: 5130, W: 1300, ZW: 3600, ZT: 4200, t: 250,
  raft: { z0: -600, toe: 200 },
  zona: 1282,                                  // el primer cuarto, sin placas (L/4)
  /* la entrada: tubo DN 200 del floculador por el muro de la entrada, a la cámara de entrada */
  inlet: { y: -330, z: 2600, ro: 109.5, ri: 101.5, flR: 170, flT: 24 },
  /* el muro difusor: concreto de 150 mm con 21 orificios de 75 mm (3 columnas × 7 filas) */
  dif: { x0: 300, x1: 450, z1: 3800, r: 37.5, ys: [-1083, -650, -217], zs: [400, 840, 1280, 1720, 2160, 2600, 3040] },
  /* la tolva de lodos, a lo ancho del tanque, bajo la zona de entrada: cara vertical bajo el muro difusor y la otra a 60° */
  hop: { x0: 450, xb: 700, zb: -400, x1: 931 },
  /* la purga: tubo DN 150 del fondo de la tolva, por la losa, a la válvula de cuchilla con actuador neumático */
  purge: { y: -150, ro: 84.15, ri: 78, flR: 140, flT: 22, xv: -880, xe: -1350 },
  /* la pantalla que separa la zona de entrada del agua clara, sobre la primera placa */
  pant: { x0: 1272, x1: 1282, z1: 3800 },
  /* las placas: 1,5 m a 60°, 50 mm libres entre caras, 1,5 mm de acero inoxidable */
  pl: { L: 1500, ang: 60, gap: 50, th: 1.5, ztop: 2900, n: 52, y0: -1290 },
  /* los peines que separan las placas arriba, junto a los muros, y los ángulos donde se apoyan abajo */
  peine: { h: 25, w: 40 },
  ang: { w: 75, t: 6 },
  /* la canaleta del agua clara: en el centro, a lo largo de la zona de placas, con vertederos en V a los dos lados */
  lau: { yc: -650, w: 250, t: 6, z0: 3300, z1: 3600, x0: 1400, notch: 50, pitch: 150, wp: { t: 6, z0: 3480, z1: 3624 }, zwater: 3392 },
  brk: { xs: [1900, 3100, 4300], w: 50, y1: -500 },
  /* la caja de salida, afuera del muro de la salida, y el tubo DN 200 al filtro */
  box: { x1: 5980, y0: -1000, y1: -300, z0: 2780, z1: 3800, t: 6, zwater: 3060 },
  /* el barredor de cadenas y paletas: cuatro ruedas dentadas (9 dientes, cadena de 152,4 mm de paso), dos cadenas, seis
     paletas de 76 × 152 mm a lo ancho */
  col: { r: 223, sp: [[900, 413], [900, 933], [4650, 933], [4650, 413]], cy: [-1150, -150], cw: 30, flight: { t: 76, h: 152, off: 15, y0: -1250, y1: -50 }, n: 6, shaft: 30, rail: { w: 50, t: 10, ys: [-1200, -100] } },
  /* el motorreductor del barredor, sobre la corona del muro de atrás, y la cadena de transmisión */
  drv: { x: 900, rTop: 120, rBot: 150, y: -1228, zTop: 4330 },
  /* la persona de referencia (../persona.mjs, 1,75 m): de pie en el piso de afuera, al nivel de la cara de abajo de la
     losa, entre la válvula de purga y el muro de la entrada, mirando hacia la válvula. La corona del muro, de 250 mm y
     a 4,2 m, no es un lugar para estar de pie. Medida del libro. */
  persona: { x: -1100, y: -1050, piso: -600, rumbo: 76 },
};

// El caso (herramientas/decantadores.py del libro)
export const CASO = { Q: 25, carga: 5, aCub: 5.0, aTanque: 6.667, largo: 5.128, ancho: 1.3, agua: 3.6, L: 1.5, d: 0.05, ang: 60 };

// Las cuentas del dibujo: los orificios del muro difusor, los vertederos de la canaleta, las placas que caben
export function cuentas() {
  const q = CASO.Q / 3600, n = CL.dif.ys.length * CL.dif.zs.length, a = Math.PI * (CL.dif.r / 1000) ** 2;
  const vOr = q / (n * a), hf = (vOr / 0.61) ** 2 / (2 * 9.807);
  const largoVert = 2 * (CL.L - CL.lau.x0) / 1000, cargaVert = CASO.Q / largoVert;
  const notches = 2 * Math.floor((CL.L - CL.lau.x0) / CL.lau.pitch), qn = q / notches;
  const hV = (qn / 1.38) ** 0.4;                  // vertedero en V de 90°: Q = 1,38 H^2,5 (SI)
  const paso = (CL.pl.gap + CL.pl.th) / Math.sin(CL.pl.ang * Math.PI / 180);
  const canales = CL.pl.n - 1, vCanal = q / (canales * CASO.d * CASO.ancho) * 3600;
  const vSub = q / (CASO.ancho * (CL.pl.ztop - CL.pl.L * Math.sin(CL.pl.ang * Math.PI / 180)) / 1000) * 60;   // m/min bajo el paquete
  const vsCanal = vCanal * CASO.d / (CASO.L * Math.cos(CASO.ang * Math.PI / 180) + CASO.d * Math.sin(CASO.ang * Math.PI / 180));
  return { n, vOr, hf: hf * 1000, largoVert, cargaVert, notches, hV: hV * 1000, paso, canales, vCanal, vsCanal, vSub, tubo: q / (Math.PI * 0.1015 ** 2) };
}
