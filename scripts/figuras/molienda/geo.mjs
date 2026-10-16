/* Medidas de las cuatro figuras de molienda que comparten los builds y la página. Sin imports: el mismo texto corre en
   las dos. Unidades: 1 = 1 cm, z hacia arriba. Cada equipo trae su cámara y la relación entre su plano de corte y la
   escena de partículas del explorador (MillAnim), que corre en un lienzo virtual de DEMW × DEMH píxeles: la figura
   pone esas partículas en el plano de corte de la máquina real. */
export const DEMW = 900, DEMH = 490;
export function axesOf(az) {
  const a = (az * Math.PI) / 180, sA = Math.sin(a), cA = Math.cos(a);
  return { T: [sA, -cA, 0], HV: [cA, sA, 0] };
}
/* molino de bolas: el eje a lo largo de y (alimentación en +y, a la izquierda; descarga en −y), el frente hacia +x */
export const BM = {
  AZ: 46, EL: 30,
  ZA: 270,                                   // altura del eje
  R: 145, RS: 150, RO: 156,                  // radio del revestimiento por dentro, cara de adentro del casco y de afuera
  L: 450,                                    // largo del casco (y de −225 a 225)
  fl: 176,                                   // bridas del casco
  head: 50, rt: 56,                          // largo de la cabeza cónica y radio del muñón
  tr: [275, 345],                            // muñones, de la cabeza a la punta (|y|)
  brg: [298, 338],                           // chumaceras (|y|)
  cut: { y0: -118, y1: 122 },               // entre estos dos planos se quita la mitad del tambor que mira al lector
  gear: { y: -168, w: 28, r0: 156, r1: 196, rp: 194, teeth: 96 },  // corona
  pin: { th: -24, rp: 34, w: 30 },           // piñón (ángulo de su centro) y su radio primitivo
  lifters: 14,
};
/* del lienzo de partículas (px) al corte del molino de bolas: el tambor del lienzo es el círculo de radio 0,42·min(W, H)
   centrado en (W/2, H/2 + 6), visto desde la descarga: u del lienzo va hacia +x y v (hacia arriba) hacia +z */
export const BMDEM = (() => { const R = 0.42 * Math.min(DEMW, DEMH); return { cx: DEMW / 2, cy: DEMH / 2 + 6, R, s: BM.R / R }; })();
/* trituradora de mandíbulas de un solo toggle (600 × 900 mm): la cámara del lienzo (MillAnim) en el plano del corte.
   El lienzo pone la mandíbula fija de (cx − 95, 0,2 H) a (cx − 14, 0,86 H) y la móvil de (cx + 95 + 0,3 A sen ωt, 0,2 H) a
   (cx + A (1 + sen ωt)/2, 0,86 H), con A = 12 px y ω = 5,5 rad/s. Con s = 0,316 cm/px la boca de arriba mide 60 cm. */
export const JC = {
  AZ: 70, EL: 28,
  s: 0.316, zb: 70,                          // cm por px del lienzo y altura del fondo de la cámara
  W2: 42, PL: 45, PT: 8,                     // media anchura de las mandíbulas, cara de adentro de las placas y su espesor
  S: [48, 204], rs: 12, rj: 15, rh: 26,      // eje excéntrico: centro, radio del eje, del muñón excéntrico y del alojamiento
  die: 7,                                    // espesor de las placas de mandíbula
  Tf: [88, 66],                              // asiento del toggle en el bastidor
};
export function jcMap(px, py) { return [(px - DEMW / 2) * JC.s, JC.zb + (0.86 * DEMH - py) * JC.s]; }
/* la mandíbula móvil en la fase e = sen ωt: los dos extremos de su cara */
export function jcFace(e) { const A = 12; return [jcMap(DEMW / 2 + 95 + A * 0.3 * e, 0.2 * DEMH), jcMap(DEMW / 2 + A * (1 + e) / 2, 0.86 * DEMH)]; }
/* el movimiento rígido de la biela que lleva la cara de reposo (e = 0) a la de la fase e: giro alrededor de la punta de
   arriba y traslado; devuelve una función que mueve un punto (x, z) */
export function jcMove(e) {
  const [a0, b0] = jcFace(0), [a1, b1] = jcFace(e);
  const t0 = Math.atan2(b0[1] - a0[1], b0[0] - a0[0]), t1 = Math.atan2(b1[1] - a1[1], b1[0] - a1[0]), d = t1 - t0, c = Math.cos(d), s = Math.sin(d);
  return (p) => { const x = p[0] - a0[0], z = p[1] - a0[1]; return [a1[0] + x * c - z * s, a1[1] + x * s + z * c]; };
}
/* molino de rodillos dobles (600 × 400 mm): los dos rodillos del lienzo, de radio min(0,2 W, 0,34 H) en (cx ∓ (R + 3,5), 0,56 H),
   giran a ±3,2 rad/s; con s = 0,18 cm/px cada rodillo mide 60 cm de diámetro y la luz entre ellos 1,3 cm */
export const RC = { AZ: 68, EL: 28, s: 0.18, zc: 100, W2: 20 };
export function rcMap(px, py) { const R = Math.min(0.2 * DEMW, 0.34 * DEMH); return [(px - DEMW / 2) * RC.s, RC.zc + (0.56 * DEMH - py) * RC.s]; }
export const RCR = (() => { const R = Math.min(0.2 * DEMW, 0.34 * DEMH); return { R: R * RC.s, xc: (R + 3.5) * RC.s }; })();
/* molino de martillos: la carcasa del lienzo, de radio 0,42 min(W, H) en (cx, H/2 + 4), con un rotor de radio 0,18 Rc y cuatro
   martillos de largo 0,62 Rc que giran a 11 rad/s; con s = 0,194 cm/px la carcasa mide 80 cm por dentro */
export const HM = { AZ: 66, EL: 28, s: 0.194, zc: 112, W2: 28 };
export function hmMap(px, py) { return [(px - DEMW / 2) * HM.s, HM.zc + (DEMH / 2 + 4 - py) * HM.s]; }
export const HMR = (() => { const Rc = 0.42 * Math.min(DEMW, DEMH); return { Rc: Rc * HM.s, rr: 0.18 * Rc * HM.s, L: 0.62 * Rc * HM.s }; })();
/* molino de discos de atrición de un solo rotor (discos de 60 cm, McCabe: de 250 a 1400 mm): el disco del lienzo, de radio
   0,43·min(W, H) en (W/2, H/2) y visto de frente, es la cara del rotor. El eje va a lo largo de y y la puerta, con el disco
   fijo, mira a +y; la cara del rotor está en y = yr y las partículas van en la luz entre los dos discos. */
export const DS = { AZ: 62, EL: 28, zc: 105, R: 30, yr: -4, gap: 0.5, r0: 12, rw: 31 };
export const DSDEM = (() => { const R = 0.43 * Math.min(DEMW, DEMH); return { cx: DEMW / 2, cy: DEMH / 2, R, s: DS.R / R }; })();
export function dsMap(px, py) { return [(px - DSDEM.cx) * DSDEM.s, DS.zc + (DSDEM.cy - py) * DSDEM.s]; }
/* tamizadora de golpeteo para tamices de 8″ (200 mm) de media altura, como las de laboratorio (hasta 13 tamices de 25 mm de
   marco): 278 ± 10 oscilaciones por minuto en una órbita horizontal de 28,6 × 11,1 mm y 150 ± 10 golpes por minuto del
   martillo de 2,44 kg sobre el corcho de la tapa. La pila va sobre el plato portatamices: el fondo, los n tamices del
   análisis (el más fino abajo) y la tapa, apretados por la barra de sujeción con sus dos perillas en las varillas.
   El frente de la máquina mira a +y y su costado derecho a +x; el eje de la pila está en x = y = 0. */
export const TZ = { AZ: 45, EL: 30, r: 10.15, ri: 9.95, h: 2.54, z0: 29.7, osc: 278, taps: 150, ox: 1.43, oy: 0.56, lift: 1.4, rodX: 17, rodTop: 76, ext: 4.6 };
// las alturas de la pila de n tamices: el fondo de cada tamiz (de abajo hacia arriba), la tapa, el corcho y el martillo
export function tzStack(n) {
  const zb = []; for (let k = 0; k < n; k++) zb.push(TZ.z0 + TZ.h * (k + 1));
  const top = TZ.z0 + TZ.h * (n + 1);
  return { zb, top, mesh: zb.map((z) => z + 0.28), pan: TZ.z0 + 0.2, cork: top + 2.2, arm: top + 14.2 };
}
