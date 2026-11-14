/* Medidas del tren de condensación de un arrastre de vapor: el condensador vertical, el subenfriador de doble tubo y
   el florentino (el de ../florentino, el mismo recipiente). Unidades: 1 = 1 mm, z hacia arriba desde el piso. El
   florentino queda con su eje en x = y = 0, como lo dibuja ../florentino/dibujo.mjs; el condensador y el subenfriador
   se ponen alrededor. La cámara es la del florentino (FL.AZ y FL.EL).
   Son parámetros del dibujo: los tamaños de los equipos van como entran, y lo que no es un tamaño de equipo (espesores,
   bridas, cámaras, soportes, posiciones) es una elección plausible. Tubos de acero inoxidable y bridas ASME B16.5,
   clase 150. */
import { FL } from "../florentino/geo.mjs";

/* tubo: radio exterior e interior; brida: radio, espesor, radio del círculo de pernos y número de pernos */
export const DN = {
  25: { ro: 16.7, ri: 13.9, fl: 54, ft: 14.2, bc: 39.7, nb: 4 },
  32: { ro: 21.1, ri: 18.3, fl: 58.75, ft: 15.7, bc: 44.45, nb: 4 },
  40: { ro: 24.15, ri: 20.45, fl: 63.5, ft: 17.5, bc: 49.2, nb: 4 },     // cédula 40: el tubo interior del subenfriador
  65: { ro: 36.5, ri: 31.35, fl: 88.9, ft: 22.4, bc: 69.85, nb: 4 },     // cédula 40: el tubo exterior
  150: { ro: 84.15, ri: 80.75, fl: 139.7, ft: 25.4, bc: 120.65, nb: 8 },
  200: { ro: 109.55, ri: 105.8, fl: 171.45, ft: 28.6, bc: 149.25, nb: 8 },
};

export const CA = {
  AZ: FL.AZ, EL: FL.EL,
  /* el condensador: vertical, de un paso; el vapor por los tubos, de arriba hacia abajo, y el agua por la coraza, de
     abajo hacia arriba. Corte: el plano vertical del eje que mira de frente al lector; se quita la mitad de adelante */
  e: {
    x: -875, y: 300,
    zb: 2600,                                   // cara de abajo de la placa de tubos de abajo
    R: 186.5, tw: 5,                            // coraza: radio interior y pared
    L: 1829,                                    // largo de los tubos, de cara de afuera a cara de afuera de las placas
    ts: 30, RF: 255,                            // placas de tubos (se extienden como bridas): espesor y radio
    tube: { ro: 9.525, ri: 7.875, p: 23.8125, Rb: 180.5 },   // tubos de ¾ in en triángulo; radio del haz
    baffle: { n: 4, t: 5, sp: 366, cut: 0.25, gap: 1.6 },   // deflectores: número, espesor, espaciado, corte, holgura
    bonnet: { flange: 30, cylB: 250, cylT: 200, bolts: { bc: 228, n: 16, af: 30, h: 16 } },
    head: 0.25,                                 // fondos 2:1: profundidad interior = D/4
    noz: { vap: 200, cond: 40, cw: 150, vent: 25 },
    neck: { vap: 120, cond: 100, cw: 150, vent: 120 },
    cw: { in: { deg: 208, dz: 170 }, out: { deg: 332, dz: 170 } },   // boquillas del agua: ángulo (desde la derecha del corte) y distancia a su placa
    vent: { deg: 320, dz: 95 },                 // el venteo, en la cámara de abajo, sobre el nivel del condensado
    level: 165,                                 // nivel del condensado en la cámara de abajo, bajo la brida de la cámara
    imp: { r: 135, t: 6, gap: 52 },             // placa de choque bajo la boquilla del vapor
    lug: { degs: [196, 344], w: 150, h: 180, t: 12 },        // orejas de apoyo
    stand: { du: 330, n: -520, nArm: -40, top: 3540, col: 100, beam: 100 },   // la estructura: columnas atrás y ménsulas
  },
  /* el subenfriador de doble tubo: horquillas apiladas a lo largo de x; adelante (x mayor) las bridas, los
     prensaestopas y las curvas del tubo interior; atrás los cabezales de retorno. Las ramas van partidas: se ven sus dos
     extremos y en la rotura, la sección (tubo exterior, ánulo, tubo interior) */
  d: {
    y: 567, xF: -1155,                          // eje de las ramas y cara de la brida de adelante
    legs: 10, z0: 1903, dz: 185,                // rama de arriba y separación (la de abajo, la 9)
    front: 500, gap: 110, back: 350,            // tramo de adelante, rotura y tramo de atrás que se dibujan
    gland: { body: 70, nut: 18 },
    housing: { len: 150, w: 56, pad: 70 },
    bendR: 92.5,
    noz: { dx: 160 },                           // los puentes del ánulo, detrás de la brida de adelante
    sw: 105,                                    // las boquillas del agua, detrás de la brida de adelante
    posts: [420, 180],                          // los postes: a esta distancia de la brida de adelante y del cabezal de retorno
  },
  riser: { x: -725 },                           // el tubo que sube del subenfriador al florentino
  persona: { x: 1020, y: -430, rumbo: 200 },
};
