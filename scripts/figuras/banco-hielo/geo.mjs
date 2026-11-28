/* Medidas del banco de hielo E-402 (capítulo 26 del libro de operaciones unitarias). Unidades: 1 = 1 mm. z hacia
   arriba, desde el piso de la sala de máquinas; el largo del tanque va a lo largo de x, el ancho a lo largo de y. El
   lector mira desde +x, +y: ve el costado largo de +y, que se quitó (la pared entera, del piso del tanque al borde), y
   el extremo de +x, entero, con la salida del agua, el visor de nivel y el soplador.
   Las medidas del caso y la fuente de cada pieza están en notas/figuras-isometricas.md del libro. Lo que ninguna
   fuente da (el largo del tanque, el número de circuitos y de pasos, los diámetros de las conexiones, el separador, el
   soplador, los espesores) es un supuesto del caso, razonable para la carga del nivel alto (168,5 kW pico); las bridas
   siguen ASME B16.5, clase 150, como en las demás figuras. */
export const BH = {
  AZ: 56, EL: 24,
  /* el tanque: las caras de adentro; la pared es de lámina de acero de 8 mm con 100 mm de poliuretano y su forro de
     2 mm por fuera (110 mm en total), y el fondo, la lámina sobre 112 mm de aislamiento, sobre un pedestal de concreto */
  xi0: -3100, xi1: 3150, yi0: -1435, yi1: 1435, tw: 8, wall: 110,
  zPl: 180,                                 // el pedestal de concreto
  pl: { x0: -3420, x1: 3480, y0: -1760, y1: 1760 },
  ZF: 300,                                  // la cara de arriba del fondo del tanque
  zW: 2620,                                 // el agua (160 mm sobre el hielo del paso de arriba)
  zR: 2870, cov: 100,                       // el borde de las paredes y la tapa de paneles aislados
  covX: [-2100, -1050, 0, 1050, 2100],      // las juntas de los paneles de la tapa (faltan los dos de [−2100, 0] y el de +x)
  /* el haz: 20 circuitos en planos verticales y = constante, uno cada 130 mm, cada uno de 18 pasos rectos de 5,5 m,
     uno cada 110 mm de alto, unidos por curvas en U de 52 mm de radio, de tubo de acero galvanizado de 26,7 mm (¾ in);
     el hielo, de 36 mm, el espesor promedio de la ASHRAE */
  coil: { n: 18, nc: 20, pz: 110, py: 130, R: 52, ro: 13.35, ice: 36, xL: -2740, xR: 2760, zb: 540, dD: 125 },
  stations: [-2000, -650, 700, 2050],       // los soportes del haz: perfiles en el fondo y pletinas en cada circuito
  win: [440, 960],                          // el tramo del circuito de adelante sin hielo, para ver el tubo
  /* los cabezales, sobre el agua: el de salida del vapor (4 in) sobre el extremo de los pasos y el de entrada del
     líquido (2½ in) sobre las bajantes */
  hdr: { zV: 2760, zL: 2740, over: 80 },
  /* el separador de baja: un recipiente horizontal de 610 mm (24 in) por 2,0 m entre tangentes, a lo largo de y,
     aislado con 75 mm, sobre dos vigas que cruzan la tapa */
  drum: { r: 305, ins: 80, L: 2000, zc: 3835, beamDx: 250, saddleY: 650 },
  /* el aire: la tubería del soplador entra por el extremo de +x sobre el agua, baja junto a la pared y sigue por el
     fondo a lo largo del pasillo de adelante; de ella salen los ramales a lo ancho, bajo el haz */
  air: { y: 1365, xDown: 3080, zIn: 2790, laterals: [-2600, -1325, 25, 1375, 2550], xEnd: -2820 },
  blower: { x: 3880, y: 1060 },
  dist: { x: -2970, z: 1500, yDrop: -700 },  // el distribuidor del agua de retorno, en el extremo de −x
  out: { y: -600, z: 520 },                   // la salida del agua helada, en el extremo de +x
  gauge: { y: 380, z0: 640, z1: 2780 },       // el visor de nivel
  probe: { x: 250, y: 1372 },                 // el control del espesor del hielo
  persona: { x: -3800, y: 2100, rumbo: -30 },
};
/* tubo cédula 40 y bridas deslizantes ASME B16.5 clase 150: radio exterior e interior del tubo, radio y espesor de la
   brida, radio del círculo de pernos y número de pernos */
export const DN = {
  15: { ro: 10.65, ri: 7.9, fl: 44.45, ft: 11.2, bc: 30.15, nb: 4 },
  25: { ro: 16.7, ri: 13.3, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  40: { ro: 24.15, ri: 20.45, fl: 63.5, ft: 17.5, bc: 49.2, nb: 4 },
  50: { ro: 30.15, ri: 26.25, fl: 76.2, ft: 19.1, bc: 60.35, nb: 4 },
  65: { ro: 36.5, ri: 31.35, fl: 89, ft: 22.4, bc: 69.85, nb: 4 },
  80: { ro: 44.45, ri: 38.95, fl: 95.25, ft: 23.9, bc: 76.2, nb: 4 },
  100: { ro: 57.15, ri: 51.05, fl: 114.3, ft: 23.9, bc: 95.25, nb: 8 },
};
export const rIce = BH.coil.ro + BH.coil.ice;
// la altura del paso i (0 arriba)
export const zPass = (i) => BH.coil.zb + (BH.coil.n - 1 - i) * BH.coil.pz;
// la y de cada circuito, de atrás (−y) hacia adelante
export const yCirc = (j) => (j - (BH.coil.nc - 1) / 2) * BH.coil.py;
// x de los extremos: xa, la curva de +x (y el tubo que sube al cabezal del vapor); xb, la de −x; xD, la bajante
export const xa = BH.coil.xR + BH.coil.R, xb = BH.coil.xL - BH.coil.R, xD = xa + BH.coil.dD;
/* las cuentas de la nota: el largo de tubo, el área de afuera, el largo bajo el agua, el hielo que guarda con 36 mm, el
   calor que deja pasar ese hielo entre 0 °C y la evaporación a −8 °C (k del hielo, 2,2 W/(m·K)) */
export function cuentas(kHielo = 2.2, rhoHielo = 917, hFus = 333.6e3) {
  const { n, nc, pz, R, ro, xL, xR } = BH.coil;
  const paso = xR - xL, curva = Math.PI * R;
  const zt = zPass(0), zb = zPass(n - 1);
  const subida = BH.hdr.zV - zt, bajante = BH.hdr.zL - zb;            // los tramos verticales hasta los cabezales
  const porCircuito = n * paso + (n - 1) * curva + subida + bajante + BH.coil.dD;
  const sobreAgua = (BH.hdr.zV - BH.zW) + (BH.hdr.zL - BH.zW);
  const largo = nc * porCircuito, mojado = nc * (porCircuito - sobreAgua);
  const area = 2 * Math.PI * (ro / 1000) * (largo / 1000);
  const volM = Math.PI * ((rIce / 1000) ** 2 - (ro / 1000) ** 2);    // m³ de hielo por metro de tubo
  const hielo = volM * rhoHielo * (mojado / 1000);                   // kg
  const qM = (2 * Math.PI * kHielo * 8) / Math.log(rIce / ro);        // W por metro, de 0 a −8 °C
  return { porCircuito, largo, mojado, area, hielo, kWh: (hielo * hFus) / 3.6e6, qM, Q: (qM * mojado) / 1000, canal: pz - 2 * rIce, entre: BH.coil.py - 2 * rIce, alto: zt - zb, paso: pz };
}
