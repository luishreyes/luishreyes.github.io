/* Medidas del ciclón del capítulo 20 del libro de operaciones unitarias: un ciclón de flujo invertido de alta
   eficiencia (Stairmand).
   Unidades: 1 = 1 mm. El eje del ciclón va en x = 0, y = 0; z hacia arriba, desde el piso. El corte: el plano y = 0;
   se quita la mitad que mira al lector (y > 0). x crece hacia la derecha del dibujo.
   Las medidas del caso y la fuente de cada una están en notas/figuras-isometricas.md del libro; lo que no sale de una fuente es «medida
   del libro», escogido para el dibujo. */
const D = 1200;
export const CI = {
  AZ: 60, EL: 22,
  D, R: D / 2,
  t: 6,                          // la envolvente de acero inoxidable, 6 mm
  /* Stairmand de alta eficiencia (fracciones de D) */
  st: { a: 0.5, b: 0.2, De: 0.5, S: 0.5, h: 1.5, H: 4.0, B: 0.375, hopper: 1.0 },
  zo: 2700,                      // la salida del polvo (la boca del cono)
  /* el techo, la entrada y la salida del gas */
  roof: 8,                       // la placa del techo, 8 mm
  duct: { x1: 1500, fl: 16, rim: 60 },              // el ducto de entrada llega de la derecha; brida de 16 mm, 60 mm de ala
  vf: { fl: [7680, 7720], rFl: 400, top: 7900, bend: 600, x1: -1400, flT: 20 },   // tubo de salida, brida, codo y ducto al filtro
  /* la boca del polvo, la tolva y la válvula rotativa */
  neck: { z0: 2620, fl: [2580, 2620], rFl: 330 },
  hop: { z0: 1900, z1: 2500, rOut: 150, zc: 1121, noz: 1045, fl: [1025, 1045], rFl: 250, ang: 60 },
  valve: { zc: 770, bore: 195, half: 235, ch: 30, slot: 150, fl: 20, flX: 250, len: 170, end: 25, hub: 70, tip: 188, vane: 12, n: 8 },
  spool: { z0: 395, fl: [375, 395] },
  drive: { brg: [-195, -260], rBrg: 90, shaft: 35, lant: [-260, -360], box: [-360, -560], boxH: 130, motor: [-560, -860], rMot: 110, fan: 60 },
  /* las patas: dos atrás, a 210° y 330°; las de adelante se van con el corte */
  leg: { r: 1000, angs: [210, 330], w: 150, z0: 300, top: 5710, cap: 20, base: 320, ped: 450 },
  lug: { z0: 5730, z1: 5750, rOut: 1090, half: 110, gus: 70, gT: 12, top: 6060, pad: 14 },
  strut: { zs: [1500, 3600], w: 100 },
  level: { th: 345, z: 2250 },   // el interruptor de nivel alto de la tolva: un diámetro de la salida por debajo de ella
  /* el gas y el polvo */
  turns: 5,                      // vueltas del vórtice de afuera (Darby, p. 373)
  rCore: 0.6,                    // el radio del vórtice de adentro, en radios del tubo de salida (Perry, p. 17-29: 0,4 a 0,8)
  heap: 1480,                    // el nivel del polvo en la tolva (el pie del montón, contra la pared)
  /* la persona de referencia (../persona.mjs, 1,75 m): de pie en el piso de los pedestales (z = 0), adelante y a la
     derecha de la válvula rotativa, donde se trabaja, mirando hacia ella. Solo en la vista entera; el detalle no la
     lleva. Medida del libro. */
  persona: { x: 1000, y: 2500, piso: 0, rumbo: 240 },
};

/* las medidas que salen de D */
export const G0 = (() => {
  const { R, st, zo } = CI;
  const zCone = zo + 2.5 * D, zTop = zo + st.H * D;
  return {
    R, re: (st.De * D) / 2, rOut: (st.B * D) / 2,
    zCone, zTop, zIn: zTop - st.a * D, zVF: zTop - st.S * D,
    b: st.b * D, a: st.a * D,
    zEnd: zTop - st.S * D - 2.0 * D,         // el extremo del vórtice (Perry, tabla 17-4)
    slope: (R - (st.B * D) / 2) / (2.5 * D), // dr/dz del cono
  };
})();
// el radio de adentro de la pared a la altura z (cilindro y cono)
export const rWall = (z) => (z >= G0.zCone ? CI.R : G0.rOut + (z - CI.zo) * G0.slope);

/* Las cuentas del dibujo: las fracciones de D en milímetros, el área de entrada y la velocidad a la entrada para un
   caudal dado (el caso lo pone el capítulo). */
export function cuentas(Q = null) {
  const a = G0.a / 1000, b = G0.b / 1000, Ain = a * b;
  const De = (2 * G0.re) / 1000, Aout = (Math.PI * De * De) / 4;
  const out = { D: D / 1000, a, b, De, S: CI.st.S * D / 1000, h: 1.5 * D / 1000, cono: 2.5 * D / 1000, H: 4 * D / 1000, B: CI.st.B * D / 1000, Ain, Aout, razon: Aout / Ain, finVortice: G0.zEnd, cono450: rWall(G0.zEnd) };
  if (Q) { out.vin = Q / Ain; out.vcuerpo = (4 * Q) / (Math.PI * (D / 1000) ** 2); }
  return out;
}
