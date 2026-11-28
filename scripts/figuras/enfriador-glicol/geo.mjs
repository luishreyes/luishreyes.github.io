/* Medidas del enfriador de glicol empacado de la winterización (capítulo 26 del libro de operaciones unitarias, el de
   TK-201 en el ejemplo 26.2). Unidades: 1 = 1 mm. z hacia arriba, desde el piso; el largo del gabinete va a lo largo de x,
   el fondo a lo largo de y, y el centro de la planta en x = y = 0. El lector mira desde +x, +y: ve el costado largo de +y,
   que se quitó (el panel entero, de la base al techo), y el extremo de +x, que es el condensador.
   Adentro no hay tabique: a la derecha (+x) van el serpentín aleteado en el extremo, el ventilador encima y el
   compresor; en el medio, el recibidor, la línea de líquido con el filtro secador y la mirilla, el evaporador de placas
   con la válvula de expansión y su bulbo y los presostatos, y a la izquierda (−x), el tanque, la bomba y el tablero, en
   el extremo. La pared de atrás solo se ve a la izquierda de x ≈ 90 mm (lo demás lo tapa el serpentín) y bajo unos
   700 mm (lo de arriba lo tapa el techo), y lo bajo del centro de atrás lo tapa el compresor: por eso el evaporador y
   los presostatos van bajos y el recibidor y el tablero, adelante.
   Los números del caso salen del capítulo (ejemplo 26.2 y caso.json, bloque tk201). Las medidas del equipo no las da
   ninguna fuente: son una elección plausible para un enfriador de 1,3 kW, y van anotadas como supuestas en
   notas/figuras-isometricas.md del libro, con la fuente de lo que sí sale de una. Las bridas siguen ASME B16.5, clase
   150, como en las demás figuras. */
export const EG = {
  AZ: 56, EL: 26,
  /* el caso (caso.json, tk201.ciclos.Propane): frío, potencia del compresor, calor al aire, temperaturas y caudal */
  caso: { Q: 1.314, P: 0.304, Qc: 1.62, Te: -5, Tc: 33, Taire: 25, Tgly: 0, m: 16.2, V1: 0.52, COP: 4.32 },
  pad: { x0: -720, x1: 720, y0: -470, y1: 470, h: 100 },          // la losa de concreto, al aire libre
  rail: { y: [-230, 230], h: 80, b: 40, t: 5, x0: -545, x1: 545 }, // dos perfiles en C bajo la base
  zPan: 180,                    // la cara de abajo de la base (bandeja de lámina); la de arriba, zPan + t
  X: 550, Y: 325, t: 4,         // medio gabinete por fuera (1,10 m × 0,65 m) y la lámina (dibujada de 4 mm)
  zDeck: 1080,                  // el techo (cara de abajo); el gabinete mide 0,90 m de la base al techo
  /* el condensador: un serpentín aleteado de dos hileras de tubo de cobre de 3/8 in, 30 tubos por hilera cada 25 mm,
     en el extremo de +x; cada hilera es un circuito que entra por el tubo de arriba y sale por el de abajo, los dos en
     la placa de adelante, donde se ven los codos de retorno */
  coil: { x0: 500, x1: 546, y0: -290, y1: 290, z0: 235, z1: 990, rows: [512, 534], zt0: 250, pitch: 25, n: 30, ro: 4.76, R: 12.5, ts: 3, stub: 6, fin: 12 },
  hdr: { y: 307, ro: 6.35, zIn: 975, zOut: 250, x0: 494, x1: 543 },  // los cabezales de entrada y de salida (1/2 in)
  /* el ventilador axial, de descarga hacia arriba: anillo (venturi) de 410 mm por dentro en el techo, cuatro aspas, el
     motor colgado de tres brazos y la malla encima */
  fan: { x: 310, y: 0, r: 205, tw: 3, z0: 1010, tip: 192, hub: 44, hubH: 26, n: 4, z: 1046, pitch: 24, chord: 120 },
  fmot: { r: 52, z0: 930, z1: 1018 },
  /* el compresor hermético de pistón: casco de 184 mm sobre cuatro gomas, con el calentador del cárter */
  comp: { x: 290, y: 170, r: 92, zPlate: 190, zFoot: 206, z0: 210, zSeam: 330, z1: 464, zSuc: 380, zDis: 400 },
  rec: { x: 120, y: 279, r: 38, z0: 200, z1: 410 },               // el recibidor de líquido, vertical, adelante (0,8 L)
  liq: { x: 30 },                                                 // la línea de líquido corre hacia atrás por x = 30 mm
  drier: { y0: -90, y1: 10, r: 24 },                              // el filtro secador, en el tramo a lo largo de y
  sight: { y: -130, r: 14, h: 40 },                               // la mirilla, después del filtro
  /* el evaporador de placas soldadas: 112 mm × 290 mm, el paquete de 56 mm contra la pared de atrás; las conexiones
     en la cara de adelante, el propano a la derecha (entra abajo y sale arriba) y el glicol a la izquierda (entra
     arriba y sale abajo), a contracorriente */
  bphe: { x: -74, y0: -301, y1: -245, z0: 400, z1: 690, w: 112, inset: 28, nPl: 18, portR: 8, portG: 14, portL: 30 },
  txv: { y: -185, z: 428 },                                       // la válvula de expansión, en la entrada del propano
  suc: { yA: -20, z: 900, R: 40, ins: 16 },                     // la succión: su recorrido y el aislamiento
  tank: { x: -360, y: -120, r: 165, z0: 200, z1: 600, zLvl: 500 }, // el tanque del glicol, 34 L
  pump: { x: -360, z: 290, R: 82, mR: 60 },                        // la bomba del glicol, el eje a lo largo de y
  gly: { ySup: 127, zSup: 880, yRet: 40, zRet: 662, yTank: -90 },  // las líneas del glicol: a la camisa y de vuelta
  panel: { x1: -447, y0: 140, y1: 310, z0: 560, z1: 760 },         // el tablero, en el extremo de −x, con la puerta hacia +x
  pres: { x0: -5, x1: 112, z0: 560, z1: 680, zHp: 655 },          // los presostatos, en la pared de atrás
  mano: { x: -230, adentro: -6, alto: 30, inclina: 8, gira: 20 },
};
/* tubo de cobre (diámetro de afuera), tubo de acero cédula 40 y bridas deslizantes ASME B16.5 clase 150 */
export const CU = { 6: 3.175, 10: 4.76, 12: 6.35, cap: 1.5 };
export const DN = {
  20: { ro: 13.35, ri: 10.45, fl: 49.3, ft: 12.7, bc: 34.95, nb: 4 },
  25: { ro: 16.7, ri: 13.3, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
};
// la z de un tubo del condensador
export const zTube = (i) => EG.coil.zt0 + i * EG.coil.pitch;
// el área de afuera del serpentín: el área de las aletas y de los tubos, con aletas de 0,12 mm cada 2,1 mm (12 por
// pulgada, supuesto) en un paquete de 46 mm de hondo
export function areaCondensador() {
  const { y0, y1, z0, z1, x0, x1, ro, n } = EG.coil, paso = 2.1;
  const ancho = (y1 - y0) / 1000, alto = (z1 - z0) / 1000, hondo = (x1 - x0) / 1000;
  const nAletas = Math.floor((y1 - y0) / paso), tubos = 2 * n;
  const aleta = 2 * (alto * hondo - tubos * Math.PI * (ro / 1000) ** 2) * nAletas;
  const tubo = tubos * 2 * Math.PI * (ro / 1000) * ancho * (1 - 0.12 / paso);
  return { frente: ancho * alto, aleta, tubo, total: aleta + tubo };
}
