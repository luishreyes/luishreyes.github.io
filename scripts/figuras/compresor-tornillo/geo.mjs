/* Medidas del paquete del compresor de tornillo C-401 (capítulo 26 del libro de operaciones unitarias). Unidades:
   1 = 1 mm. z hacia arriba, desde el piso de la sala de máquinas; el largo del paquete va a lo largo de x (el motor en
   −x, el compresor y el separador de aceite hacia +x), el ancho a lo largo de y, y el centro de la base en x = y = 0.
   El lector mira desde +x, +y: ve el costado largo de +y, con el tren motor arriba y el separador abajo, y el extremo de
   +x, con el enfriador de aceite y el tablero.
   Las medidas del caso y la fuente de cada pieza están en notas/figuras-isometricas.md del libro. Lo que ninguna fuente
   da (la base, el bastidor, el separador, el enfriador, la bomba y el filtro del aceite, el tablero, las alturas) es
   dibujo: una elección del orden de los paquetes de esa potencia, no un dato. Las bridas siguen ASME B16.5, clase 150,
   como en las demás figuras. */
export const CT = {
  AZ: 58, EL: 26,
  pad: { x0: -1700, x1: 1820, y0: -820, y1: 820, h: 100 },          // la losa de la sala de máquinas
  /* la base: dos canales C 200 × 75 a lo largo y dos en los extremos, con la bandeja de lámina encima */
  skid: { x0: -1450, x1: 1450, y: 550, h: 200, b: 75, tw: 8, tf: 11, deck: 6 },
  /* el separador de aceite: casco de 20 in (508 mm) con cabezas elipsoidales 2:1, sobre dos sillas */
  sep: { z: 674, R: 254, x0: -1000, x1: 1050, hd: 127, sad: [-640, 640], tw: 14 },
  /* el bastidor del tren motor, sobre el separador: dos canales C 150 × 65 a lo largo, a 200 mm del eje, sobre tres
     sillas soldadas al casco; encima, las placas de asiento del motor y las patas del compresor */
  mount: { y: 200, h: 150, b: 65, tw: 7, tf: 10, x0: -1250, x1: 430, sad: [-970, -450, 300], z0: 980, sole: 25 },
  /* el tren motor: el eje del rotor macho, que es el del motor */
  zA: 1380, yM: 50, yF: -50,
  /* los rotores (perfil simétrico de arcos de círculo): el macho de cuatro lóbulos y la hembra de seis canales, con
     los círculos de paso de 40 y 60 mm (centros a 100 mm) y lóbulos de 22 mm de radio: el macho mide 124 mm por fuera y
     la hembra 120; los lóbulos van de x = −60 a x = 90 (150 mm, L/D = 1,2) y el macho da 300° de vuelta en ese largo */
  rot: { rm: 40, rf: 60, rho: 22, x0: -60, x1: 90, wrapM: 300, nm: 4, nf: 6 },
  /* la carcasa: la sección exterior (dos semicírculos de 92 mm unidos arriba y abajo y el bolsillo de la válvula de
     corredera debajo) y el agujero de los rotores (dos círculos de 63 mm) */
  cas: { Ro: 92, Ri: 63, zBot: -132, ySv: 46, seal: [-200, -170], suc: [-170, -60], dis: [90, 200], cap: [200, 240] },
  /* la válvula deslizante: su cilindro y el indicador de posición, en el extremo de la descarga, bajo los rotores */
  slide: { z: -78, R: 42, x0: 240, x1: 390, ind: 60 },
  /* el motor de 45 kW, dos polos (carcasa IEC 225M: el eje a 225 mm de las patas) */
  motor: { R: 208, x0: -1180, x1: -480, cowl: -1300, de: -470, feet: [-980, -670] },
  /* el acople de espaciador: los dos cubos y el espaciador con sus paquetes de láminas; la guarda */
  cpl: { h1: [-445, -395], sp: [-395, -305], h2: [-305, -255], guard: [-460, -240] },
  /* la succión: el cuello de la carcasa, el filtro y la válvula de cierre y retención, de abajo hacia arriba */
  suc: { x: -115, fl: 24, R: 100, inlet: -700 },
  /* la descarga: del compresor al separador, y del separador al condensador */
  dis: { x: 140, xOut: 850, zRun: 1480, yEnd: -900 },
  /* el enfriador de aceite de termosifón: un casco vertical de 6 in con sus bonetes */
  oc: { x: 1320, y: 300, R: 84, z0: 520, z1: 1080, fl: 140, ft: 24 },
  /* la bomba del aceite (con su motor) y el filtro del aceite, al frente */
  op: { x: 860, y: 400, z: 470 },
  of: { x: -330, y: 400, z0: 470, z1: 860, R: 84 },
  /* el visor de nivel del separador */
  lg: { x: -720, y: 300, z0: 500, z1: 820, oil: 610 },
  /* el tablero, en el extremo de +x, de cara al pasillo */
  panel: { x0: 1490, x1: 1690, y0: -520, y1: -40, z0: 1120, z1: 1840 },
  persona: { x: 2120, y: -250, rumbo: 180 },
};
// las alturas que salen de otras: la cara de arriba de los canales y de las placas, y la pila de la succión
CT.mount.z1 = CT.mount.z0 + CT.mount.h;
CT.zSole = CT.mount.z1 + CT.mount.sole;
{
  const zt = CT.zA + CT.cas.Ro, s = CT.suc;
  s.neck = zt + 43;                       // la cara de la brida de la carcasa
  s.body = [s.neck + 2 * s.fl, s.neck + 2 * s.fl + 212];
  s.valve = s.body[1] + s.fl + 23.9 + 92; // el centro del cuerpo de la válvula de ángulo
  s.top = s.valve + 360;                  // donde termina la línea de succión
}
/* tubo cédula 40 y bridas deslizantes ASME B16.5 clase 150: radio exterior e interior del tubo, radio y espesor de la
   brida, radio del círculo de pernos y número de pernos */
export const DN = {
  15: { ro: 10.65, ri: 7.9, fl: 44.45, ft: 11.2, bc: 30.15, nb: 4 },
  25: { ro: 16.7, ri: 13.3, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  40: { ro: 24.15, ri: 20.45, fl: 63.5, ft: 17.5, bc: 49.2, nb: 4 },
  50: { ro: 30.15, ri: 26.25, fl: 76.2, ft: 19.1, bc: 60.35, nb: 4 },
  65: { ro: 36.5, ri: 31.35, fl: 89, ft: 22.4, bc: 69.85, nb: 4 },
  80: { ro: 44.45, ri: 38.95, fl: 95.25, ft: 23.9, bc: 76.2, nb: 4 },
  100: { ro: 57.15, ri: 51.1, fl: 114.3, ft: 23.9, bc: 95.25, nb: 8 },
  150: { ro: 84.15, ri: 77.95, fl: 139.7, ft: 25.4, bc: 120.65, nb: 8 },
};
/* el perfil de los rotores: el radio en cada ángulo de la sección (en grados, desde la dirección de un lóbulo del macho
   o del canal de la hembra). El macho es su círculo de paso con cuatro lóbulos de arco de círculo centrados en él; la
   hembra, su círculo de paso con seis canales del mismo radio. */
const D2R = Math.PI / 180;
export function rMacho(phi) {
  const { rm, rho, nm } = CT.rot;
  let r = rm;
  for (let k = 0; k < nm; k++) {
    const d = (phi - (360 * k) / nm) * D2R, cu = rm * Math.cos(d), disc = cu * cu - rm * rm + rho * rho;
    if (disc >= 0) r = Math.max(r, cu + Math.sqrt(disc));
  }
  return r;
}
export function rHembra(phi) {
  const { rf, rho, nf } = CT.rot;
  let r = rf;
  for (let k = 0; k < nf; k++) {
    const d = (phi - (360 * k) / nf) * D2R, cu = rf * Math.cos(d), disc = cu * cu - rf * rf + rho * rho;
    if (disc >= 0 && cu > 0) r = Math.min(r, cu - Math.sqrt(disc));
  }
  return r;
}
// el medio ángulo que ocupa un lóbulo del macho y un canal de la hembra en su círculo de paso (en grados)
export const semiLobulo = (rp) => Math.acos(1 - (CT.rot.rho * CT.rot.rho) / (2 * rp * rp)) / D2R;
// el desplazamiento por vuelta del macho (el área entre el agujero y cada rotor, por el largo, por cuatro lóbulos de
// la hembra que llena cada vuelta): una cuenta de dibujo, para la nota
export function desplazamiento() {
  const { rm, rf, x0, x1, nm } = CT.rot, Ri = CT.cas.Ri, n = 3600;
  let aM = 0, aF = 0;
  for (let i = 0; i < n; i++) {
    const p = (360 * i) / n, dp = (2 * Math.PI) / n;
    aM += 0.5 * (Ri * Ri - rMacho(p) ** 2) * dp;
    aF += 0.5 * (Ri * Ri - rHembra(p) ** 2) * dp;
  }
  // cada canal entre dos lóbulos del macho y cada canal de la hembra se llenan una vez por vuelta de su rotor; por vuelta
  // del macho pasan sus cuatro canales y cuatro de los seis de la hembra
  const L = x1 - x0, porMacho = (aM + aF * (nm / 6)) * L;
  return { aM, aF, L, porMacho, rm, rf };
}
