/* Medidas del homogeneizador de alta presión del capítulo 15 del libro de operaciones unitarias (Mezclado y escalado
   de tanques agitados, sección «Homogeneizar»): el cabezal de una máquina de leche de 10 000 L/h, el caudal del
   ejemplo de la leche homogeneizada del capítulo, a 20 MPa en la primera etapa y 2 MPa en la segunda.
   Unidades: 1 = 1 mm. x a lo largo de los pistones (el cárter queda a −x), y hacia el lector (el corte quita y > 0),
   z hacia arriba. El eje del cilindro 1 está en el plano del corte (y = 0); los cilindros 2 y 3 quedan detrás, a −p y
   −2p. El piso (donde se apoyan el cárter y los pies del bloque) está en z = 0.

   De las fuentes (con su página; el README dice qué sale de dónde):
   - tres pistones desfasados 120° (Lewis y Heppell, 2000, p. 61), en un bloque macizo de acero inoxidable, con doble
     sello en cada pistón (Bylund, 1995, p. 117);
   - una válvula de succión y una de descarga por cilindro, que solo dejan pasar el líquido en un sentido (Lewis y
     Heppell, p. 61);
   - la válvula de homogeneizar: asiento, forzador y anillo de impacto, con la cara de adentro del anillo perpendicular
     a la salida de la rendija (Bylund, p. 118; Fellows, 2000, p. 112; Berk, 2013, p. 212); la rendija de unos 0,1 mm
     (Bylund, p. 118; Fellows da hasta 0,3 mm, p. 112);
   - dos etapas en serie, la primera de eje vertical y la segunda horizontal, cada una con su actuador hidráulico
     (Bylund, p. 118, figs. 6.3.5 y 6.3.6; Fellows, fig. 4.5, p. 112).
   Lo demás es «medida del libro»: típico de una máquina así, escogido para el dibujo. */
export const HM = {
  AZ: 64, EL: 26,
  p: 130,                                   // paso entre cilindros (y)
  /* los pistones: Ø 50, carrera de 70; con 420 r/min y 96 % de rendimiento volumétrico dan los 10 m³/h del ejemplo */
  rp: 25, S: 70, rpm: 420, Lp: 250, theta: [90, 210, 330],
  xcl0: -165, coupL: 40, rcoup: 34,         // el acople del pistón con el vástago de la cruceta, en el punto muerto de atrás
  rrod: 18,                                 // el vástago de la cruceta
  /* el cárter (solo su cara de adelante) y los pies del bloque */
  crank: { x0: -262, x1: -210, y0: -300, y1: 50, z0: 0, z1: 360, rboss: 42, boss: 14, wiper: 3, rw: 23 },
  ped: { feet: [[20, 100], [200, 300]], y0: -300, z1: 80 },   // los dos pies del bloque
  /* el bloque de la bomba */
  blk: { x0: 0, x1: 330, y0: -320, z0: 80, z1: 380 },
  zc: 215, rb: 28,                          // el eje de los cilindros y su diámetro (Ø 56: el pistón no toca)
  cart: { rcb: 45, x1: 70, rin: 26, ro: 62, xf: -18, seals: [[12, 26], [44, 58]], rs: 33 },
  xv: 240,                                  // el eje de las válvulas de cada cilindro
  zs: 125, rsm: 22,                         // el colector de succión, a lo largo de y
  zdm: 305, rdm: 20,                        // el colector de descarga
  rinb: 18, routb: 12,                      // la entrada (de la derecha al colector de succión) y la salida al cabezal
  ym0: -300, ym1: 40,                       // de dónde a dónde van los colectores (taponados en los extremos)
  col: [[125, 160, 18], [160, 255, 30], [255, 340, 34], [340, 380, 40]],   // [z0, z1, r] de la columna de válvulas
  sseat: { z0: 160, z1: 176, ri: 16, ro: 30 },
  dseat: { z0: 255, z1: 271, ri: 16, ro: 34 },
  pop: { r: 25, t: 8, hub: 9, hh: 5, wing: 4, wr: 15.6, hubw: 4 },
  lift: 3,                                  // la válvula de descarga, abierta (el pistón 1 va empujando)
  spring: { r: 21, w: 2, turns: 6 },
  plug: { z0: 340, r: 40, af: 56, hh: 18 },
  /* la entrada de la leche: tubo sanitario de 2 in (Ø 50,8 × 1,65) con sus bridas */
  inl: { x1: 455, ro: 25.4, ri: 23.75, rf: 58, tf: 18, te: 16 },
  /* el cabezal de homogeneización, atornillado a la cara derecha del bloque */
  head: { x0: 330, x1: 590, yh: 65, z0: 270, z1: 420 },
  x1s: 410,                                 // el eje de la primera etapa (vertical)
  zin: 305, rhb: 10,                        // el conducto que llega a la primera etapa
  /* la primera etapa: asiento, anillo de impacto, cámara y guía del forzador */
  s1: { z0: 315, z1: 345, ri: 10, ro: 34, ring: [345, 360, 25, 34], ch: [360, 385, 40], guide: [385, 420] },
  /* la segunda etapa (horizontal, a la altura de la cámara de la primera) */
  z2: 372.5,
  s2: { x0: 480, x1: 510, ri: 10, ro: 34, ring: [510, 525, 25, 34], ch: [525, 550, 40], guide: [550, 590] },
  xo: 537.5, rob: 15,                       // la salida, hacia arriba desde la cámara de la segunda etapa
  rforcer: 22.5,                            // el forzador (Ø 45: con 0,1 mm de rendija, unos 200 m/s a 20 MPa)
  /* la rendija va exagerada: 0,1 mm en la primera etapa y unos 0,3 mm en la segunda, dibujadas de 3 y 4 mm */
  gap: [3, 4], gapReal: [0.1, 0.3],
  /* los actuadores hidráulicos: émbolo de Ø 72 (unos 4 MPa de aceite para unos 16 kN sobre el forzador) */
  act: { rflange: 52, tflange: 12, ro: 48, rbore: 36, base: 25, wall: 48, cap: 15, piston: 16, rport: 6, hexAF: 19, hexH: 10, nip: 4 },
  oil: { r: 4, rise: 31, run: 70, union: { af: 16, len: 24 } },
  /* la salida de la leche homogeneizada: tubo sanitario de 1½ in (Ø 38,1 × 1,65) */
  out: { ro: 19.05, ri: 17.4, rf: 50, tf: 16, z1: 515, te: 16 },
};

/* El avance del pistón i a partir del punto muerto de atrás, con la manivela en theta (movimiento armónico simple:
   la biela no se dibuja). */
export const strokeAt = (i) => (HM.S / 2) * (1 - Math.cos((HM.theta[i] * Math.PI) / 180));
export const xCoup = (i) => HM.xcl0 + strokeAt(i);                         // la cara izquierda del acople
export const xTip = (i) => xCoup(i) + HM.coupL + HM.Lp;                     // la punta del pistón
export const yCyl = (i) => -i * HM.p;

/* El caudal que da la bomba con esas medidas (para el README) */
export function caudal(eta = 0.96) {
  const A = (Math.PI / 4) * (2 * HM.rp / 1000) ** 2, V = 3 * A * (HM.S / 1000);
  return V * HM.rpm * 60 * eta;                                             // m³/h
}

/* Los vacíos (huecos) del bloque y del cabezal: cilindros con su eje ('x', 'y' o 'z'), un punto del eje (c), de dónde
   a dónde van a lo largo del eje (s0, s1) y su radio. */
export function blockVoids() {
  const V = [];
  for (let i = 0; i < 3; i++) {
    const y = yCyl(i);
    V.push({ name: `cil${i}`, ax: "x", c: [0, y, HM.zc], s0: HM.cart.x1 - 3, s1: HM.xv, r: HM.rb });
    V.push({ name: `cart${i}`, ax: "x", c: [0, y, HM.zc], s0: HM.blk.x0 - 1, s1: HM.cart.x1, r: HM.cart.rcb, filled: true });
    // cada tramo de la columna se mete 3 mm en el de arriba, que es más ancho
    HM.col.forEach(([z0, z1, r], j) => V.push({ name: `col${i}.${j}`, ax: "z", c: [HM.xv, y, 0], s0: z0, s1: j === HM.col.length - 1 ? HM.blk.z1 + 1 : z1 + 3, r, filled: j === HM.col.length - 1 }));
  }
  V.push({ name: "csuc", ax: "y", c: [HM.xv, 0, HM.zs], s0: HM.ym0, s1: HM.ym1, r: HM.rsm });
  V.push({ name: "cdes", ax: "y", c: [HM.xv, 0, HM.zdm], s0: HM.ym0, s1: HM.ym1, r: HM.rdm });
  V.push({ name: "entrada", ax: "x", c: [0, 0, HM.zs], s0: HM.xv, s1: HM.blk.x1 + 1, r: HM.rinb });
  V.push({ name: "salida", ax: "x", c: [0, 0, HM.zdm], s0: HM.xv, s1: HM.blk.x1 + 1, r: HM.routb });
  return V;
}
export function headVoids() {
  const S1 = HM.s1, S2 = HM.s2, x1 = HM.x1s, z2 = HM.z2;
  return [
    { name: "h.entrada", ax: "x", c: [0, 0, HM.zin], s0: HM.head.x0 - 1, s1: x1, r: HM.rhb },
    { name: "h.sube", ax: "z", c: [x1, 0, 0], s0: HM.zin, s1: S1.z0 + 3, r: HM.rhb },
    { name: "h.cb1", ax: "z", c: [x1, 0, 0], s0: S1.z0, s1: S1.ring[1] + 3, r: S1.ro, filled: true },
    { name: "h.cam1", ax: "z", c: [x1, 0, 0], s0: S1.ch[0], s1: S1.ch[1], r: S1.ch[2] },
    { name: "h.guia1", ax: "z", c: [x1, 0, 0], s0: S1.guide[0] - 3, s1: HM.head.z1 + 1, r: HM.rforcer, filled: true },
    { name: "h.paso", ax: "x", c: [0, 0, z2], s0: x1, s1: S2.x0 + 3, r: HM.rhb },
    { name: "h.cb2", ax: "x", c: [0, 0, z2], s0: S2.x0, s1: S2.ring[1] + 3, r: S2.ro, filled: true },
    { name: "h.cam2", ax: "x", c: [0, 0, z2], s0: S2.ch[0], s1: S2.ch[1], r: S2.ch[2] },
    { name: "h.guia2", ax: "x", c: [0, 0, z2], s0: S2.guide[0] - 3, s1: HM.head.x1 + 1, r: HM.rforcer, filled: true },
    { name: "h.salida", ax: "z", c: [HM.xo, 0, 0], s0: z2, s1: HM.head.z1 + 1, r: HM.rob },
  ];
}

// media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco
export function halfRing(r0, r1, n = 36) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
