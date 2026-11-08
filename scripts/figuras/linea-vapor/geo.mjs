/* Medidas de la línea de vapor del capítulo 21 del libro de operaciones unitarias (Heat in equipment, «La línea
   aislada en la planta»): un tramo de la línea que lleva los 1600 kg/h de vapor saturado a 5 bara de la caldera al
   extractor de la planta de aceite esencial, al exterior, sobre un soporte de tubería.
   Unidades: 1 = 1 mm. El eje del tubo va en y = 0, z = 0, a lo largo de x; el vapor corre hacia +x. z hacia arriba.
   Los ángulos alrededor del tubo (φ) se miden desde +y (el lado que mira al lector) hacia +z (arriba).

   De las fuentes (con su página; el README dice qué sale de dónde):
   - el tubo de 4 in cédula 40: 114,30 mm por fuera, 6,02 mm de pared, 102,26 mm por dentro (Perry, 2008, tabla
     10-22, p. 10-78; la tabla tbl-tub-cedula del capítulo 10 del libro);
   - el aislante de tubos va en medias cañas, cilindros partidos en dos (o en tres o cuatro), amarrado con alambre o
     con bandas antes de la chaqueta; la chaqueta, de aluminio, se asegura con bandas, y las válvulas y los accesorios
     llevan cubiertas preformadas (Perry, p. 11-76); el aislante de 2 in nominales sobre un tubo de 4 in mide 52 mm
     (Perry, tabla 11-21, p. 11-71); el acabado de un sistema caliente debe impedir que entre el agua (p. 11-71);
   - la chaqueta metálica en toda tubería al exterior; los traslapos longitudinales a las diez o a las dos (de una
     chaqueta de PVC); la chaqueta de aluminio de 0,41 mm como mínimo, con traslapos de 50 mm como mínimo dispuestos
     para que el agua escurra en el sentido de la pendiente, y bandas de acero inoxidable de 13 × 0,50 mm cada 300 mm;
     la chaqueta de las válvulas y los accesorios, como la del tubo (ASHRAE, 2014, p. 10.7); los aislantes, en dos
     medias cañas (p. 10.8);
   - los soportes de acero no deben estorbar la dilatación del tubo, y las guías dirigen su movimiento (Perry,
     pp. 10-122 y 10-123);
   - las bridas de 4 in clase 150: 230 mm de diámetro, 22,3 mm de espesor mínimo, cuello de 135 mm, 75 mm de largo
     por el cuello, cara realzada de 157,2 mm y 2 mm; ocho espárragos de 5/8 in en un círculo de 190,5 mm (ASME
     B16.5-2013, tablas 4, 7 y 8, pp. 64, 71 y 73);
   - la línea va con una pendiente hacia los puntos donde se recoge el condensado, y ahí van las trampas (Bylund,
     1995, p. 179).
   Lo demás es «medida del libro»: típico de una línea así, escogido para el dibujo. */
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
