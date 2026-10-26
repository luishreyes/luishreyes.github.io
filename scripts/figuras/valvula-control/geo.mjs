/* Medidas de la válvula de control de globo del capítulo 12 del libro de operaciones unitarias
   (Válvulas, tuberías y medición de flujo). Unidades: 1 = 1 mm.
   x a lo largo del flujo (la entrada en −x), y hacia el lector (el corte quita y > 0), z hacia arriba.
   El origen está en el eje de la tubería, en el eje del vástago.
   Válvula de 2″, clase 150 RF: cara a cara 254 mm (ISA 75.08.01); bridas ASME B16.5 (Ø 152,4 × 19,1, cara realzada
   Ø 92,1 × 1,6, cuatro espárragos de 5/8″ en un círculo de Ø 120,7); tubo de 2″ cédula 40 (Ø 60,3 × 3,91).
   Un solo asiento, guiada por arriba, obturador perfilado, puerto de Ø 46 y carrera de 19 mm (3/4″).
   Actuador de diafragma y resorte de aire para abrir (el aire entra debajo del diafragma y lo levanta; el resorte,
   arriba del plato, empuja el obturador contra el asiento: falla cerrada). */
export const VC = {
  AZ: 62, EL: 27,
  /* línea */
  pipe: { ro: 30.15, ri: 26.25, end: 262 },                 // tubo de 2″ cédula 40 y el extremo del tramo corto
  ff: 127,                                                    // cara de la brida de la válvula (cara a cara 254)
  fl: { r: 76.2, t: 17.5, rf: 46.05, rft: 1.6, bc: 60.35 },  // brida: radio, espesor del disco, cara realzada, círculo de pernos
  gasket: { ri: 30.2, ro: 52.4, t: 3.2 },                     // empaque de lámina entre las caras realzadas
  wn: { len: 62, rh: 39 },                                    // cuello de la brida de la tubería (largo hasta la soldadura, radio en la base)
  bolt: { r: 7.94, nut: 13.5, nh: 15.9, out: 4 },             // espárrago de 5/8″, tuerca (entre caras/2), alto de la tuerca, lo que sobresale
  /* cuerpo */
  body: { ax: 100, b: 84, axi: 86, bi: 68, rn: 41, rbore: 26.25 },  // globo exterior e interior (esferoides a lo largo de x), cuello y paso
  boss: { r: 58, top: 100, rb: 32 },                          // asiento del bonete: radio, cara superior, agujero
  deck: { z0: -16, z1: -2, rport: 31 },                       // el puente horizontal y su agujero roscado
  w1: { x: -40, dx: -0.30, t: 11 },                           // tabique de la entrada: arranca en el puente (x, z = z1) y sube hacia −x
  w3: { x: 40, dx: 0.62, t: 11 },                             // tabique de la salida: arranca en el puente (x, z = z0) y baja hacia +x
  seat: { rp: 23, rs: 31, rsh: 35, z0: -16, zsh: -2, top: 4, zb: 1, rb: 26.5 },  // anillo de asiento roscado
  /* obturador y vástago */
  travel: 19, open: 0.6,
  dz: 32,                                                     // lo que sube la arcada y todo lo de arriba, para que el bonete se vea
  plug: { rseat: 24.6, rhead: 27, nose: 24, tip: 9, head: 22, rpost: 12, post: 92, rstem: 6.35 },
  zseat: 2.6,                                                 // altura de la línea de asiento (cerrada)
  /* bonete */
  bon: { rf: 62, z0: 100, z1: 116, rneck: 30, top: 232, rsh: 34, zsh: 140, bolts: 8, bbc: 49 },
  guide: { ri: 12.2, ro: 18, z0: 100, z1: 122 },              // buje guía del poste del obturador
  box: { ri: 12.7, z0: 190, n: 5, h: 6.35, zjunk: 6 },        // caja de empaquetadura: radio, fondo, anillos
  fol: { ro: 12.6, h: 12.25, up: 6 },                         // seguidor (prensaestopas)
  pf: { x: 36, w: 12, t: 7, stud: 24, rs: 4.76 },             // brida del prensaestopas y sus espárragos de 3/8″
  /* arcada */
  yoke: { rin: 30, rout: 52, z0: 166, z1: 186, nut: 38, nz: 196, legx: [40, 52], legy: 15, top: 362, plate: 377, rplate: 74 },
  /* actuador */
  act: { z0: 377, hub: 46, hubh: 12, rf: 146, rin: 128, zf: 424, ft: 4, wall: 3, top: 514, rstem: 9.5, bc: 138, nb: 16 },
  dia: { rplate: 96, t: 3 },
  spring: { r: 56, wire: 5.6, turns: 5.5 },
};
/* el globo: radio del esferoide a lo largo de x */
export const rOuter = (x) => VC.body.b * Math.sqrt(Math.max(0, 1 - (x * x) / (VC.body.ax * VC.body.ax)));
export const rInner = (x) => VC.body.bi * Math.sqrt(Math.max(0, 1 - (x * x) / (VC.body.axi * VC.body.axi)));
export const xNeck = () => VC.body.ax * Math.sqrt(1 - (VC.body.rn / VC.body.b) ** 2);       // donde el cuello toca el globo
export const xBore = () => VC.body.axi * Math.sqrt(1 - (VC.body.rbore / VC.body.bi) ** 2);  // donde el paso entra al globo
export const lift = () => VC.travel * VC.open;
export const zPlug = () => VC.zseat + lift();               // la línea de asiento del obturador, a 60 % de carrera
/* el obturador y su vástago: meridiano [s, r] desde la punta de la nariz (s medido desde la línea de asiento) */
export function plugProfile() {
  const p = VC.plug, out = [];
  // la nariz perfilada: r(s) = tip + (rseat − tip)·√(1 − s/−nose), de la punta a la línea de asiento
  const N = 18;
  out.push([-p.nose, 0.01]);
  for (let i = 0; i <= N; i++) {
    const t = i / N, s = -p.nose + p.nose * t;
    out.push([s, p.tip + (p.rseat - p.tip) * Math.sqrt(t), 1]);
  }
  out[out.length - 1][2] = 0;
  out.push([2.4, p.rhead]);                       // el bisel de asiento a 45°
  out.push([p.head, p.rhead]);
  out.push([p.head + 2, p.rhead - 2]);
  out.push([p.head + 2, p.rpost]);
  out.push([p.head + 2 + p.post, p.rpost]);
  out.push([p.head + 2 + p.post + 2, p.rstem]);
  return out;
}
/* el tabique de la entrada: cara derecha (hacia la cámara de arriba) e izquierda, como rectas x(z) */
export const w1Right = (z) => VC.w1.x + VC.w1.dx * (z - VC.deck.z1);
export const w1Left = (z) => VC.w1.x - VC.w1.t + VC.w1.dx * (z - VC.deck.z0);
/* el tabique de la salida: cara de arriba (hacia la salida) y de abajo, como rectas x(z) */
export const w3Upper = (z) => VC.w3.x + VC.w3.t + VC.w3.dx * (VC.deck.z1 - z);
export const w3Lower = (z) => VC.w3.x + VC.w3.dx * (VC.deck.z0 - z);
/* donde una recta x(z) corta el esferoide interior en el plano y = 0, buscando entre z0 y z1 */
export function hitInner(xOf, z0, z1) {
  const f = (z) => (xOf(z) / VC.body.axi) ** 2 + (z / VC.body.bi) ** 2 - 1;
  let a = z0, b = z1;
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (Math.sign(f(m)) === Math.sign(f(a))) a = m; else b = m; }
  const z = (a + b) / 2;
  return [xOf(z), z];
}
/* media corona (v ≤ 0) entre r0 y r1 en el plano (u, v) de un marco; con r0 = 0, medio disco */
export function halfRing(r0, r1, n = 36, a0 = Math.PI, a1 = 2 * Math.PI) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
