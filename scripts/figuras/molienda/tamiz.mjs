/* La tamizadora de golpeteo del análisis granulométrico: la pila de tamices de 8″ de media altura (el fondo abajo, los n
   tamices del análisis con el más fino abajo y la tapa con su corcho) sobre el plato portatamices, que describe una órbita
   horizontal; dos varillas roscadas suben del plato y la barra de sujeción aprieta la tapa con sus dos perillas. Atrás, la
   torre del martillo: un brazo que pivota en una corredera y deja caer el martillo de 2,44 kg sobre el corcho. La caja de
   abajo lleva el motor (adentro), el temporizador, los botones, el interruptor y la placa, y el cable al enchufe del piso.
   Se quita la mitad de la pila que mira al lector (fondo, tamices y tapa): quedan las mallas, por las que se ve, y el
   material retenido en cada una, que la página pinta con la muestra del explorador. Hay una figura por número de tamices
   (de 3 a 9): node build.mjs --eq=tamiz --n=9. */
export function camera(GEO, n = 9) {
  const Z = GEO.TZ;
  const ext = [[-26, -30, 0], [26, -30, 0], [-26, 18, 0], [26, 18, 0], [-26, 18, 26], [26, -30, 26], [-26, -30, 26], [-8, -30, 81], [8, -17, 81], [8, -30, 81],
    [-17, 0, Z.rodTop + 1], [17, 0, Z.rodTop + 1], [47, -33, 0], [-24, 4, 70]];
  return { AZ: Z.AZ, EL: Z.EL, W: 640, H: 680, EXT: ext, n };
}
export function build(K) {
  const { G, A, P, C, GEO, cam, T, HV, put, box, fp, turned, disc, ring, Ln, Dots, path3, at, record, ZA_, CUT, pipe, planeM, addv } = K;
  const Z = GEO.TZ, n = cam.n, ST = GEO.tzStack(n), R = Z.r, RI = Z.ri, RS = 9.7, ENDS = {};
  const CF = CUT([0, 0, 0]);
  // media corona (v ≤ 0, la mitad de atrás) entre r0 y r1 en el plano (u, v) del corte; con r0 = 0, medio disco
  const half = (r0, r1, m = 40) => {
    const o = [];
    for (let i = 0; i <= m; i++) { const t = Math.PI + (Math.PI * i) / m; o.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
    if (r0 > 1e-6) for (let i = m; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / m; o.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
    return o.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
  };
  const front = (r0, r1, m = 40) => half(r0, r1, m).map(([u, v]) => [u, -v]).reverse();
  const XAX = (o) => G.frameOf(o, [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const YAX = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
  const knurl = (F, s0, s1, r, count = 22) => Ln(G.ribsOf(F, s0, s1, r + 0.02, count, P, { least: 0.1 }), { tone: "lo" });
  const STACK = new Set(), ARM = new Set(), HEAD = new Set();
  const stack = (name) => (STACK.add(name), name);

  /* ---------- la caja: cuatro patas de caucho, la fundición pintada y su tablero ---------- */
  [[-22.5, -26.5], [22.5, -26.5], [-22.5, 14.5], [22.5, 14.5]].forEach(([x, y], i) => disc(`tz.foot${i}`, ZA_([x, y, 0]), 0, 1.5, 2.2, { tone: "lo" }, { cls: "tz-rubber", ground: true }));
  // rejillas de ventilación en el costado derecho y tornillos de la tapa
  // las rejillas: ranuras cerradas, para que ninguna raya quede suelta
  let louv = "";
  for (let z = 7; z <= 16.6; z += 1.6) louv += path3([[26.03, -22, z], [26.03, 2, z], [26.03, 2, z + 0.45], [26.03, -22, z + 0.45]], true);
  const screws = [[-23.5, -27.5], [23.5, -27.5], [-23.5, 15.5], [23.5, 15.5]].map(([x, y]) => at([x, y, 26]));
  // el marco del tablero en la cara de adelante
  const panel = path3([[-21, 18.03, 4], [21, 18.03, 4], [21, 18.03, 23], [-21, 18.03, 23]], true);
  box("tz.cabinet", [-26, -30, 1.5], [26, 18, 26], { tone: "mid" }, { r: 2.2, bevel: 0.8, cls: "tz-paint", extra: `<path class="tz-slot" d="${louv}"/>` + Ln(panel, { tone: "lo" }) + Dots(screws, { size: 0.5 }) });
  // el tablero en la cara de adelante: la pantalla del temporizador, los botones de arranque y de parada y el interruptor
  box("tz.lcd", [-15, 18, 12], [-1, 18.7, 20], { tone: "lo" }, { r: 0.6, cls: "tz-bezel", owner: "tz.cabinet" });
  const LCD = { c: [-8, 18.72, 16] };
  const lcdM = planeM(LCD.c, [1, 0, 0], [0, 0, -1]);
  [[4, "tz-green"], [9.5, "tz-red"]].forEach(([x, cls], i) => {
    const F = YAX([x, 18, 14]);
    disc(`tz.btn${i}.bezel`, F, 0, 0.5, 2.0, { tone: "mid" }, { owner: "tz.cabinet", cls: "tz-bezel" });
    disc(`tz.btn${i}`, F, 0.5, 1.3, 1.25, { tone: "mid" }, { owner: `tz.btn${i}.bezel`, cls });
  });
  box("tz.switch", [14.5, 18, 11.5], [18.5, 18.8, 17.5], { tone: "lo" }, { r: 0.5, cls: "tz-bezel", owner: "tz.cabinet" });
  box("tz.switch.lever", [15.85, 18.8, 14.6], [17.15, 20.2, 15.8], { tone: "hi" }, { r: 0.3, owner: "tz.switch" });
  // la placa de datos, con sus renglones y cuatro tornillos
  const plate = [[-19.5, 5.5], [-12.5, 5.5], [-12.5, 10], [-19.5, 10]];
  let rules = "", rdots = []; for (const z of [8.8, 7.7, 6.6]) { rules += path3([[-18.6, 18.26, z], [-13.4, 18.26, z]]); rdots.push(at([-18.6, 18.26, z]), at([-13.4, 18.26, z])); }
  box("tz.plate.id", [-19.5, 18, 5.5], [-12.5, 18.25, 10], { tone: "hi" }, { r: 0.3, owner: "tz.cabinet", extra: Ln(rules, { tone: "lo" }) + Dots(rdots, { size: 0.3 }) + Dots(plate.map(([x, z]) => at([x + (x < -16 ? 0.6 : -0.6), 18.26, z + (z < 8 ? 0.6 : -0.6)])), { size: 0.4 }) });
  // el piloto de marcha, entre los botones
  const lampF = YAX([6.75, 18, 18.6]);
  disc("tz.lamp.bezel", lampF, 0, 0.4, 1.0, { tone: "mid" }, { owner: "tz.cabinet", cls: "tz-bezel" });
  disc("tz.lamp", lampF, 0.4, 0.8, 0.6, { tone: "mid" }, { owner: "tz.lamp.bezel" });

  /* ---------- el accionamiento: el poste excéntrico en su fuelle y el plato portatamices ---------- */
  // el fuelle de caucho: un cono con sus pliegues, del agujero de la caja al poste
  const bootF = ZA_([0, 0, 0]);
  turned("tz.boot", bootF, [[26, 8.6], [26.5, 8.2], [26.9, 6.4], [27.3, 5.4], [27.6, 4.6]], { tone: "lo" }, { cls: "tz-rubber", owner: "tz.cabinet", extra: Ln([26.5, 26.9, 27.3].map((z) => G.arcOf(bootF, z, z < 26.7 ? 8.22 : z < 27.1 ? 6.42 : 5.42, P, { least: 0.05 })).join(""), { tone: "lo" }) });
  disc(stack("tz.post"), bootF, 27.6, 28.5, 4.1, { tone: "mid" }, { owner: "tz.boot", cls: "tz-steel" });
  box(stack("tz.carrier"), [-19.6, -12.5, 28.5], [19.6, 12.5, Z.z0], { tone: "mid" }, { r: 4, bevel: 0.4, cls: "tz-steel", owner: "tz.post", extra: Dots([[-15, -9.5], [15, -9.5], [-15, 9.5], [15, 9.5]].map(([x, y]) => at([x, y, Z.z0])), { size: 0.45 }) });

  /* ---------- las varillas roscadas, la barra de sujeción y sus perillas ---------- */
  const zb0 = ST.top + 1.6, zb1 = ST.top + 2.8;
  [-1, 1].forEach((sg) => {
    const x = sg * Z.rodX, F = ZA_([x, 0, 0]);
    disc(stack(`tz.rodnut${sg}`), F, Z.z0, Z.z0 + 1.0, 1.55, { tone: "mid" }, { owner: "tz.carrier", cls: "tz-steel" });
    // la rosca: anillos finos a lo largo de lo que se ve de la varilla
    const thr = (s0, s1) => { let d = ""; for (let s = s0 + 0.5; s < s1 - 0.3; s += 0.7) d += G.arcOf(F, s, 0.82, P, { least: 0.05 }); return Ln(d, { tone: "faint" }); };
    turned(stack(`tz.rod${sg}a`), F, [[Z.z0 + 1.0, 0.8], [zb0, 0.8]], { tone: "hi" }, { owner: `tz.rodnut${sg}`, extra: thr(Z.z0 + 1.0, zb0) });
    disc(stack(`tz.washer${sg}`), F, zb1, zb1 + 0.3, 1.75, { tone: "mid" }, { owner: `tz.bar${sg}`, cls: "tz-steel" });
    turned(stack(`tz.knob${sg}`), F, [[zb1 + 0.3, 1.6], [zb1 + 0.6, 2.05], [zb1 + 1.9, 2.05], [zb1 + 2.2, 1.2]], { tone: "mid" }, { owner: `tz.washer${sg}`, cls: "tz-knob", extra: knurl(F, zb1 + 0.7, zb1 + 1.8, 2.05) });
    turned(stack(`tz.rod${sg}b`), F, [[zb1 + 2.2, 0.8], [Z.rodTop - 0.35, 0.8], [Z.rodTop, 0.5]], { tone: "hi" }, { owner: `tz.knob${sg}`, extra: thr(zb1 + 2.2, Z.rodTop) });
    // el brazo de la barra, de la corona del centro a la varilla
    box(stack(`tz.bar${sg}`), sg < 0 ? [-18.8, -1.5, zb0] : [5.3, -1.5, zb0], sg < 0 ? [-5.3, 1.5, zb1] : [18.8, 1.5, zb1], { tone: "mid" }, { r: 0.6, bevel: 0.25, cls: "tz-steel", owner: "tz.bar.ring.b" });
  });
  // la corona del centro de la barra rodea el martillo: se parte por el plano que mira al lector
  fp(stack("tz.bar.ring.b"), CF, half(4.0, 5.6, 36), zb0, zb1, { tone: "mid" }, { cls: "tz-steel", owner: "tz.cover.boss" });
  fp(stack("tz.bar.ring.f"), CF, front(4.0, 5.6, 36), zb0, zb1, { tone: "mid" }, { cls: "tz-steel", owner: "tz.bar.ring.b" });

  /* ---------- la pila, sin la mitad que mira al lector: el fondo, los tamices y la tapa ---------- */
  fp(stack("tz.pan.bottom"), CF, half(0, RI, 40), Z.z0, ST.pan, { tone: "mid" }, { cls: "tz-steel", owner: "tz.carrier" });
  fp(stack("tz.pan.wall"), CF, half(RI, R, 40), Z.z0, Z.z0 + Z.h - 0.35, { tone: "mid" }, { cls: "tz-steel", owner: "tz.pan.bottom" });
  fp(stack("tz.pan.bead"), CF, half(RI, R + 0.22, 40), Z.z0 + Z.h - 0.35, Z.z0 + Z.h, { tone: "mid" }, { cls: "tz-steel", owner: "tz.pan.wall" });
  ST.zb.forEach((zb, k) => {
    const s = `tz.s${k}`, below = k ? `tz.s${k - 1}.bead` : "tz.pan.bead";
    fp(stack(`${s}.skirt`), CF, half(RS, 9.88, 40), zb - 0.9, zb + 0.25, { tone: "mid" }, { cls: "tz-steel", owner: below });
    fp(stack(`${s}.band`), CF, half(RI, R, 40), zb, zb + Z.h - 0.35, { tone: "mid" }, { cls: "tz-steel", owner: `${s}.skirt` });
    fp(stack(`${s}.bead`), CF, half(RI, R + 0.22, 40), zb + Z.h - 0.35, zb + Z.h, { tone: "mid" }, { cls: "tz-steel", owner: `${s}.band` });
    // la malla: tela de alambre tensada sobre el escalón del marco; la trama la pinta la página según la abertura
    fp(stack(`${s}.mesh`), CF, half(0, RS - 0.02, 40), zb + 0.25, ST.mesh[k] + 0.05, { tone: "faint" }, { cls: "tz-mesh", owner: `${s}.skirt` });
  });
  fp(stack("tz.cover.skirt"), CF, half(RS, 9.88, 40), ST.top - 0.9, ST.top, { tone: "mid" }, { cls: "tz-steel", owner: n ? `tz.s${n - 1}.bead` : "tz.pan.bead" });
  fp(stack("tz.cover"), CF, half(0, R + 0.3, 40), ST.top, ST.top + 0.6, { tone: "mid" }, { cls: "tz-steel", owner: "tz.cover.skirt" });
  fp(stack("tz.cover.boss"), CF, half(0, 5.0, 36), ST.top + 0.6, ST.top + 1.6, { tone: "mid" }, { cls: "tz-steel", owner: "tz.cover" });
  fp(stack("tz.cork"), CF, half(0, 1.8, 24), ST.top + 1.6, ST.cork, { tone: "mid" }, { cls: "tz-cork", owner: "tz.cover.boss" });

  /* ---------- la torre del martillo: la corredera, el pivote, el brazo y el martillo ---------- */
  const zp = ST.arm;
  let slot = path3([[-1.6, -16.97, 36], [1.6, -16.97, 36], [1.6, -16.97, 76], [-1.6, -16.97, 76]], true);
  box("tz.tower", [-8, -30, 26], [8, -17, 78], { tone: "mid" }, { r: 2, bevel: 0.6, cls: "tz-paint", owner: "tz.cabinet", extra: `<path class="tz-slot" d="${slot}"/>` + Dots([[-6, 74], [6, 74], [-6, 30], [6, 30]].map(([x, z]) => at([x, -16.97, z])), { size: 0.45 }) });
  box("tz.tower.cap", [-8.6, -30.6, 78], [8.6, -16.4, 80], { tone: "mid" }, { r: 2.3, bevel: 0.5, cls: "tz-paint", owner: "tz.tower" });
  box("tz.slide", [-3.4, -17, zp - 3.2], [3.4, -14.6, zp + 3.2], { tone: "mid" }, { r: 0.5, bevel: 0.3, cls: "tz-steel", owner: "tz.tower" });
  const kF = XAX([3.4, -15.8, zp - 1.6]);
  disc("tz.slide.stem", kF, 0, 1.0, 0.5, { tone: "mid" }, { owner: "tz.slide" });
  turned("tz.slide.knob", kF, [[1.0, 1.0], [1.2, 1.5], [2.4, 1.5], [2.6, 1.0]], { tone: "mid" }, { cls: "tz-knob", owner: "tz.slide.stem", extra: knurl(kF, 1.3, 2.3, 1.5, 16) });
  // el pasador del pivote asoma por los dos lados de la corredera
  [-1, 1].forEach((sg) => disc(`tz.pin${sg}`, XAX([sg * 3.4, -15.6, zp + 1.2]), sg < 0 ? -0.5 : 0, sg < 0 ? 0 : 0.5, 0.55, { tone: "hi" }, { owner: "tz.slide" }));
  ARM.add("tz.arm");
  box("tz.arm", [-1.2, -14.6, zp - 1], [1.2, 2.7, zp + 1], { tone: "mid" }, { r: 0.4, bevel: 0.25, cls: "tz-steel", owner: "tz.slide" });
  HEAD.add("tz.head");
  const hF = ZA_([0, 0, 0]);
  turned("tz.head", hF, [[ST.cork + 0.02, 1.9], [ST.cork + 0.5, 2.4], [zp - 1.4, 2.4], [zp - 1, 2.0]], { tone: "mid" }, { cls: "tz-hammer", owner: "tz.arm", extra: Ln([ST.cork + 2.2, zp - 3].map((s) => G.arcOf(hF, s, 2.42, P, { least: 0.05 })).join(""), { tone: "lo" }) });

  /* ---------- el cable: del costado derecho al enchufe del piso ---------- */
  const relief = XAX([26, -24, 6]);
  turned("tz.relief", relief, [[0, 1.2], [1.2, 0.95], [2.6, 0.6]], { tone: "lo" }, { cls: "tz-rubber", owner: "tz.cabinet" });
  box("tz.outlet", [41, -35, 0], [47, -31, 3.2], { tone: "mid" }, { r: 0.5, bevel: 0.3, cls: "tz-paint", ground: true });
  box("tz.plug", [42.4, -31, 0.03], [45.6, -29, 1.9], { tone: "lo" }, { r: 0.4, bevel: 0.2, cls: "tz-bezel", owner: "tz.outlet", ground: true });
  pipe("tz.cord", [[28.6, -24, 6], [36, -24, 6], [39.5, -24, 0.45], [44, -24, 0.45], [44, -29, 0.45]], 0.42, { bend: 6, tone: "lo", cls: "tz-cordc" });

  /* ---------- lo que la página necesita ---------- */
  const tag = (z, u) => G.add3(G.mul3(T, u), [0, 0, z]);
  ENDS.levels = [[Z.z0 + 1.2, -R - 0.3]].concat(ST.zb.map((zb) => [zb + 1.3, -R - 0.3])).map(([z, u]) => tag(z, u));
  ENDS.hammer = [0, -8, zp + 1];
  ENDS.plate = [-19.6, 6, 28.8];
  ENDS.timer = [-15, 18.7, 19.5];
  const after = (put2) => {
    ST.zb.forEach((_, k) => put2(`tz.s${k}.mesh`, `<g data-live="tz.hatch${k}"></g><g data-live="tz.grains${k + 1}"></g><g data-live="tz.fall${k + 1}"></g>`));
    put2("tz.pan.bottom", `<g data-live="tz.grains0"></g><g data-live="tz.fall0"></g>`);
    put2("tz.lcd", `<g transform="${lcdM}"><rect class="tz-lcdwin" x="-6" y="-3" width="12" height="6" rx="0.5"/><g data-live="tz.time"></g></g>`);
    put2("tz.lamp", `<circle data-live="tz.run" class="tz-runled" cx="${at([6.75, 18.82, 18.6])[0].toFixed(2)}" cy="${at([6.75, 18.82, 18.6])[1].toFixed(2)}" r="${(0.5 * G.scaleOf(P)).toFixed(2)}"/>`);
  };
  const data = { n, ends: ENDS, st: ST, z0: Z.z0, r: R, ri: RI, rs: RS, mesh: ST.mesh, pan: ST.pan, cork: ST.cork, arm: zp, pivot: [0, -15.6, zp + 1.2], kk: G.scaleOf(P) };
  return {
    data,
    label: `Tamizadora de golpeteo con ${n} tamices de 8 pulgadas y el fondo: la pila abierta por la mitad que mira al lector, con la malla de cada tamiz y lo que retiene, la tapa con su corcho, la barra de sujeción con sus perillas en las varillas roscadas, el plato portatamices que describe la órbita, la torre con el brazo y el martillo, y la caja con el temporizador, los botones y el cable`,
    after: (aft) => after(aft),
    group: (name) => (STACK.has(name) ? ' data-ride="stack"' : ARM.has(name) ? ' data-ride="arm"' : HEAD.has(name) ? ' data-ride="head"' : ""),
  };
}
