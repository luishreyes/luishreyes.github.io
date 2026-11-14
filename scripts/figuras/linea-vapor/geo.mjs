/* Medidas de la línea de vapor del capítulo 21 del libro de operaciones unitarias: un tramo de una línea de vapor
   aislada, al exterior, sobre un soporte de tubería.
   Unidades: 1 = 1 mm. El eje del tubo va en y = 0, z = 0, a lo largo de x; el vapor corre hacia +x. z hacia arriba.
   Los ángulos alrededor del tubo (φ) se miden desde +y (el lado que mira al lector) hacia +z (arriba).
   Las medidas del caso y la fuente de cada una están en notas/figuras-isometricas.md del libro; lo que no sale de una fuente es «medida
   del libro», escogido para el dibujo. */
export const LV = {
  AZ: 60, EL: 24,
  /* el tubo: 4 in cédula 40 (Perry, tabla 10-22) */
  RO: 114.30 / 2, t: 6.02,
  /* el aislante: lana mineral de 50 mm (el caso del capítulo; Perry, tabla 11-21, da 52 mm para 2 in nominales) */
  wool: 50,
  /* la chaqueta de aluminio: 0,5 mm de verdad; se dibuja de 1 mm (va exagerada) */
  tj: 1.0,
  lapL: 30,                      // el traslapo longitudinal, a las dos: φ = 30° (60° desde arriba, del lado del lector)
  lapW: 50,                      // los traslapos de 50 mm (ASHRAE, p. 10.7)
  band: { w: 13, t: 0.8 },       // las bandas de 13 mm (ASHRAE, p. 10.7); el espesor va exagerado (0,5 mm de verdad)
  /* las medias cañas de lana: el plano en que se parten (φ = 50° y 230°) */
  seam: 50,
  /* el tramo dibujado */
  x0: -2300, x1: 1700,
  /* el soporte: la viga del soporte de tubería y la zapata soldada al tubo */
  xs: -2100,
  shoe: { h: 125, len: 250, web: 10, base: 150, tb: 12 },     // 125 mm bajo el tubo: el aislante de 50 mm pasa por encima
  beam: { d: 200, bf: 150, tf: 10, tw: 7, y0: -260, y1: 420 },
  guide: { leg: 50, t: 6, len: 120, gap: 4 },
  /* el corte del tubo: la cuña φ ∈ [315°, 450°] (de las cuatro y media a las doce, del lado del lector) */
  cut: { a0: 315, a1: 450, xa: -1500, step: 150, xb: -500 },
  /* la pierna de goteo, la trampa */
  xd: 0,
  drip: { zj: -520, zb: -760, cap: 40, zt: -640, nip: 26.7 / 2 },
  /* la válvula de compuerta con su chaqueta desmontable */
  xv: 550,
  valve: { term: 240, over: 50, rb: 175, boot: 90, bootTop: 330 },
  /* la unión de bridas con su chaqueta desmontable, en corte */
  xf: 1250,
  flange: { r: 115, tf: 22.3, rf: 157.2 / 2, rft: 2, hubX: 135 / 2, Y: 75, gasket: 3, bolts: 8, rbc: 190.5 / 2, stud: 15.9 / 2, nutF: 27, nutT: 16, term: 130, over: 50 },
  /* la persona de referencia (../persona.mjs, 1,75 m): de pie sobre el piso, a la izquierda del soporte y un poco hacia el
     lector, mirando hacia la línea. El dibujo no tiene piso: el eje del tubo va a 1,20 m de él (la viga del soporte, a
     1,02 m), y la persona lleva una sombra corta. Medida del libro. */
  persona: { x: -2570, y: 260, piso: -1200, rumbo: 0 },
  /* las temperaturas del caso (el modelo del capítulo, notas/calor-en-equipos/modelo.md, §3: 50 mm de lana con la k de
     la API a la temperatura media, chaqueta de aluminio con ε = 0,055, aire quieto a 20 °C y 73,7 kPa) */
  T: { vapor: 151.83, acero: 151.80, chaqueta: 41.33, aire: 20, k: 0.0499 },
};

export const G0 = (() => {
  const RO = LV.RO, RI = RO - LV.t, RW = RO + LV.wool, RJ = RW + LV.tj;
  return { RO, RI, RW, RJ };
})();

/* El perfil de temperatura a través de la pared, en estado estacionario: el vapor y el acero a la temperatura de
   saturación (la condensación por dentro y el acero casi no oponen resistencia: 0,03 K), la lana con el perfil
   logarítmico de un cilindro con la k de su temperatura media, la chaqueta a la temperatura de su superficie y el aire que baja a 20 °C en una capa delgada
   (esquemática: su espesor no sale de ningún cálculo del capítulo). */
export function temperatura(r) {
  const { RO, RW, RJ } = G0, T = LV.T;
  if (r <= RO - LV.t) return T.vapor;
  if (r <= RO) return T.vapor + ((T.acero - T.vapor) * (r - RO + LV.t)) / LV.t;
  if (r <= RW) return T.acero - ((T.acero - T.chaqueta) * Math.log(r / RO)) / Math.log(RW / RO);
  if (r <= RJ) return T.chaqueta;
  return T.aire + (T.chaqueta - T.aire) * Math.exp(-(r - RJ) / 9);
}

/* Las cuentas del dibujo: la pérdida por metro con la lana de 50 mm (la del caso: 55,1 W/m en el modelo) y las medidas
   que se citan. */
export function cuentas() {
  const { RO, RI, RW } = G0, T = LV.T;
  const q = (2 * Math.PI * T.k * (T.acero - T.chaqueta)) / Math.log(RW / RO);
  return { DO: 2 * RO, DI: 2 * RI, Daislado: 2 * RW, q_W_m: q, condensado_g_h_m: (q / 2108.0e3) * 3600 * 1000 };
}
