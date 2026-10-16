/* El molino de discos de atrición de un solo rotor (discos de 60 cm), como lo describe McCabe: un disco rotatorio frente a
   uno fijo, la alimentación entra por el ojo del disco fijo, pasa hacia afuera por la luz angosta entre los dos y descarga
   por la periferia a una carcasa estacionaria; el disco fijo va en una puerta montada en resortes, que ceden si entra algo
   que no se rompe, y con las tuercas de sus varillas se ajusta la luz. La mitad de abajo de la puerta y del disco fijo va
   quitada entre el cubo y el anillo de los pernos: por ahí se ve la cara del rotor, que gira con la simulación del explorador, y en la luz entre los
   discos la página pinta las partículas que avanzan en espiral desde el ojo hasta la periferia. Atrás, el eje en dos
   chumaceras sobre su pedestal, la polea y las correas al motor; abajo, la boca de descarga y el recipiente del producto. */
export function camera(GEO) {
  const J = GEO.DS, ZC = J.zc;
  const ext = [[-50, -150, 0], [112, -150, 0], [-50, 22, 0], [56, 22, 0], [112, -64, 0], [-25, 34.5, ZC + 91], [25, 7.5, ZC + 91], [-25, 7.5, ZC + 91], [0, -26, ZC + 44], [44, 4, ZC], [-44, 4, ZC], [0, 4, ZC - 44]];
  return { AZ: J.AZ, EL: J.EL, W: 860, H: 560, EXT: ext };
}
export function build(K) {
  const { G, A, P, C, GEO, put, box, fp, disc, turned, pipe, pad, ball, Ln, Dots, path3, record, at, D2R } = K;
  const J = GEO.DS, ZC = J.zc, R = J.R, R0 = J.r0, RW = J.rw, CC = [0, ZC], ENDS = {};
  const RD = 44, RI = 36, RO = 37.5;                     // puerta y brida, casco por dentro y por fuera
  const FY = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };
  const YA = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
  const XA = (o) => G.frameOf(o, [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const nv = (() => { const a = Math.hypot(C.V[0], C.V[2]); return [C.V[0] / a, C.V[2] / a]; })(), PHN = Math.atan2(nv[1], nv[0]);
  const arc = (r, a0, a1, n) => { const o = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([CC[0] + r * Math.cos(t), CC[1] + r * Math.sin(t)]); } return o; };
  const sector = (r0, r1, a0, a1, n = 24) => [...arc(r1, a0, a1, n), ...arc(r0, a0, a1, n).reverse()];
  const circle = (r, n = 48) => arc(r, 0, 2 * Math.PI * (1 - 1 / n), n - 1);
  const pt = (t, r, y) => [r * Math.cos(t), y, ZC + r * Math.sin(t)];
  const lowerBrg = (c, rb, hw, base, foot) => { const o = [[c[0] - foot, c[1] + base], [c[0] + foot, c[1] + base], [c[0] + foot, c[1] + base + 5], [c[0] + hw, c[1] + base + 5], [c[0] + hw, c[1]], [c[0] + rb, c[1]]]; for (let i = 1; i < 24; i++) { const t = -(Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } o.push([c[0] - rb, c[1]], [c[0] - hw, c[1]], [c[0] - hw, c[1] + base + 5], [c[0] - foot, c[1] + base + 5]); return o; };
  const capBrg = (c, rb, ro) => { const o = [[c[0] + rb, c[1]], [c[0] + ro, c[1]]]; for (let i = 1; i < 24; i++) { const t = (Math.PI * i) / 24; o.push([c[0] + ro * Math.cos(t), c[1] + ro * Math.sin(t)]); } o.push([c[0] - ro, c[1]], [c[0] - rb, c[1]]); for (let i = 23; i > 0; i--) { const t = (Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } return o; };
  const Q0 = Math.PI, Q1 = 2 * Math.PI;                 // la mitad de abajo que se quita, de la izquierda (180°) a la derecha (360°)
  const FR = PHN - Math.PI / 2, BK = PHN + Math.PI / 2;  // la mitad del casco que mira al lector va de FR a BK

  /* ---------- fundación, cunas, boca de descarga y recipiente ---------- */
  // la fundación en L: la del molino y, al lado de atrás, la del motor
  box("pad", [-50, -150, 0], [56, 22, 20], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc",
    extra: Dots([[-44, 16], [50, 16], [-44, -144]].map(([x, y]) => at([x, y, 20])), { size: 0.6 }) });
  box("pad.m", [56, -150, 0], [112, -64, 20], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc",
    extra: Dots([[106, -70], [106, -144]].map(([x, y]) => at([x, y, 20])), { size: 0.6 }) });
  [[-1, "l"], [1, "r"]].forEach(([sg, nm]) => {
    // la cuna abraza el casco por debajo, de −40° a −18° (y su espejo), y lleva también la tapa de atrás; abajo se abre en su
    // pie. Cada cuna queda entera en una mitad del casco (la de adelante va de −41° a 139°), así no lo cruza
    const a0 = sg > 0 ? -40 * D2R : (180 + 40) * D2R, a1 = sg > 0 ? -18 * D2R : (180 + 18) * D2R, hug = arc(RO, a0, a1, 12);
    const x0 = hug[0][0], x1 = hug[hug.length - 1][0], zt = hug[hug.length - 1][1], xf = sg * 44;
    const poly = sg < 0 ? [[xf, 20], [x0, 20], ...hug, [x1, zt - 4], [xf, 30]] : [[x0, 20], [xf, 20], [xf, 30], [x1, zt - 4], ...hug.slice().reverse()];
    fp(`cradle.${nm}`, FY, poly, -26, -3, { tone: "mid" }, { owner: "pad", cls: "ml-cast",
      extra: Dots([[sg * 40, 25], [sg * (Math.abs(x0) + 3), 25]].map(([x, z]) => at([x, -3, z])), { size: 0.6 }) });
  });
  const tA = -Math.PI / 2 + Math.asin(12 / RI), tB = -Math.PI / 2 - Math.asin(12 / RI);
  fp("spout", FY, [[-12, 52], [12, 52], ...arc(RI, tA, tB, 16)], -24, -3, { tone: "mid" }, { owner: "bin.lid", cls: "ml-steel" });
  box("bin", [-20, -28, 20], [20, 2, 50], { tone: "mid" }, { r: 0.8, owner: "pad", cls: "ml-steel" });
  // la placa del recipiente: tres renglones que terminan en sus puntos y cuatro tornillos
  box("bin.plate", [-13, 2, 29], [13, 2.4, 44], { tone: "hi" }, { r: 0.3, owner: "bin",
    extra: (() => { const rows = [0, 1, 2].map((i) => [[-10, 2.4, 40 - 4 * i], [i === 2 ? 2 : 10, 2.4, 40 - 4 * i]]); return Ln(rows.map((r) => path3(r)).join(""), { tone: "lo" }) + Dots(rows.flat().map(at), { size: 0.3 }) + Dots([[-11.8, 2.4, 42.8], [11.8, 2.4, 42.8], [-11.8, 2.4, 30.2], [11.8, 2.4, 30.2]].map(at), { size: 0.35 }); })() });
  box("bin.lid", [-21, -29, 50], [21, 3, 52], { tone: "mid" }, { r: 0.6, owner: "bin", cls: "ml-steel" });
  box("bin.handle", [20, -18, 38], [22, -8, 40], { tone: "hi" }, { r: 0.3, owner: "bin" });
  ENDS.out = [20, 2, 44];

  /* ---------- la carcasa: casco con la boca abajo, tapa de atrás, brida y prensaestopas ---------- */
  const shellPart = (name, a0, a1) => fp(name, FY, sector(RI, RO, a0, a1, Math.max(4, Math.round((a1 - a0) / 0.07))), -24, -3, { tone: "mid" }, { owner: "wall.back", cls: "ml-cast" });
  const shellF = shellPart("shell.f", FR, BK);                  // la mitad que mira al lector
  shellPart("shell.b1", BK, tB + 2 * Math.PI);                  // atrás, de arriba a la izquierda hasta la boca
  shellPart("shell.b2", tA, FR);                                // y de la boca hasta la mitad de adelante
  fp("wall.back", FY, circle(RO), -26, -24, { tone: "mid" }, { owner: "cradle.l", cls: "ml-cast" });
  turned("seal", YA([0, 0, ZC]), [[-31, 7], [-28, 7], [-28, 8.5], [-26, 8.5]], { tone: "mid" }, { owner: "wall.back", cls: "ml-cast",
    extra: Dots(G.dotsOf(YA([0, 0, ZC]), -28, 7.8, 6, P, { all: false, least: 0.05 }), { size: 0.35 }) });
  fp("flange.f", FY, sector(RI, RD, FR, BK, 40), -3, 0, { tone: "mid" }, { owner: "shell.f", cls: "ml-cast" });
  fp("flange.b", FY, sector(RI, RD, BK, FR + 2 * Math.PI, 40), -3, 0, { tone: "mid" }, { owner: "shell.b1", cls: "ml-cast" });
  pad("lug", [shellF], [0, -13.5, ZC + RO], [0, 0, 1], 2.6, 7, { tone: "mid" }, { owner: "shell.f", cls: "ml-cast",
    extra: Dots([at([0, -13.5 + 2.65, ZC + RO + 5])], { size: 0.7 }) });

  /* ---------- el rotor (su cara gira con la simulación) ---------- */
  disc("shaft.in", YA([0, 0, ZC]), -24, -17, 4.5, { tone: "hi" }, { owner: "wall.back" });
  turned("hub", YA([0, 0, ZC]), [[-17, 10], [-11, 10]], { tone: "mid" }, { owner: "shaft.in", cls: "ml-cast" });
  turned("runner", YA([0, 0, ZC]), [[-11, R + 0.5], [-7, R + 0.5], [-7, R], [J.yr, R]], { tone: "mid" }, { owner: "hub", cls: "ml-inside" });

  /* ---------- la puerta con el disco fijo, abiertas en la mitad de abajo ---------- */
  // la puerta entera menos la mitad de abajo, que se quita entre el cubo y el anillo de los pernos; se marcan las aristas
  // donde el corte toca ese anillo para no pintar sus caras
  const at2 = (r, a) => [CC[0] + r * Math.cos(a), CC[1] + r * Math.sin(a)];
  const doorA = [...arc(RD, 0, Q0, 90), at2(RW, Q0), at2(R0, Q0), ...arc(R0, Q0, Q1, 32).slice(1), [RW, ZC]];
  const iA = doorA.length;                                       // la arista (RW, 0°)→(RD, 0°) cierra el polígono
  const skipA = new Set([90, iA - 1]);                           // (RD, 180°)→(RW, 180°) y la de cierre: tocan el anillo
  const boltsAt = (inQ) => Dots([...Array(12)].map((_, i) => i * 30 * D2R + 15 * D2R).filter((t) => { const q = t >= Q0 - 1e-6; return inQ ? q : !q; }).map((t) => at(pt(t, 41, 4.02))), { size: 0.55 });
  fp("door.a", FY, doorA, 0, 4, { tone: "mid" }, { owner: "flange.f", cls: "ml-cast", skip: skipA, extra: boltsAt(false) });
  fp("door.b", FY, sector(RW, RD, Q0, Q1, 44), 0, 4, { tone: "mid" }, { owner: "door.a", cls: "ml-cast", skip: new Set([44, 89]), extra: boltsAt(true) });
  // el disco fijo, en la cara de atrás de la puerta, cortado igual
  const plateA = [...arc(R, 0, Q0, 80), at2(R0, Q0), ...arc(R0, Q0, Q1, 32).slice(1)];
  fp("plate", FY, plateA, -3.5, 0, { tone: "mid" }, { owner: "door.a", cls: "ml-steel" });
  turned("boss", YA([0, 0, ZC]), [[4, 11], [8, 11]], { tone: "mid" }, { owner: "door.a", cls: "ml-cast",
    extra: Dots(G.dotsOf(YA([0, 0, ZC]), 8, 9.6, 6, P, { all: false, least: 0.05 }), { size: 0.4 }) });
  box("door.plate", [-28, 4, ZC + 15], [-15, 4.4, ZC + 23], { tone: "hi" }, { r: 0.2, owner: "door.a",
    extra: (() => { const rows = [0, 1, 2].map((i) => [[-26.5, 4.4, ZC + 21 - 2.2 * i], [i === 2 ? -21 : -16.5, 4.4, ZC + 21 - 2.2 * i]]); return Ln(rows.map((r) => path3(r)).join(""), { tone: "lo" }) + Dots(rows.flat().map(at), { size: 0.25 }) + Dots([[-27.3, ZC + 22.3], [-15.7, ZC + 22.3], [-27.3, ZC + 15.7], [-15.7, ZC + 15.7]].map(([x, z]) => at([x, 4.4, z])), { size: 0.25 }); })() });
  ENDS.gap = [...pt(-28 * D2R, 25, J.yr)];

  /* ---------- las varillas con sus resortes: sostienen la puerta y ajustan la luz entre discos ---------- */
  [45, 135, 225, 315].forEach((deg) => {
    const t = deg * D2R, x = 40 * Math.cos(t), z = ZC + 40 * Math.sin(t), F = YA([x, 0, z]), host = deg > 180 ? "door.b" : "door.a", nm = `tie${deg}`;
    disc(`${nm}.washer`, F, 4, 4.6, 2.9, { tone: "hi" }, { owner: host });
    // la varilla se dibuja solo donde se ve: dentro del resorte y la punta que sale de la contratuerca
    disc(`${nm}.rod`, F, 4.6, 12.4, 1.1, { tone: "hi" }, { owner: `${nm}.washer` });
    disc(`${nm}.seat`, F, 12.4, 13, 2.9, { tone: "hi" }, { owner: `${nm}.rod` });
    const hex = [...Array(6)].map((_, i) => [2.15 * Math.cos(i * Math.PI / 3 + Math.PI / 6), 2.15 * Math.sin(i * Math.PI / 3 + Math.PI / 6)]);
    const HF = { o: [x, 0, z], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };
    fp(`${nm}.nut`, HF, hex, 13, 15, { tone: "mid" }, { owner: `${nm}.seat`, cls: "ml-steel" });
    fp(`${nm}.jam`, HF, hex, 15, 16.2, { tone: "mid" }, { owner: `${nm}.nut`, cls: "ml-steel" });
    disc(`${nm}.end`, F, 16.2, 18, 1.1, { tone: "hi" }, { owner: `${nm}.jam` });
    // la espira del resorte, en dos mitades alrededor de la varilla
    const coil = [[], []], nT = 5, cr = 2.25, y0 = 4.65, y1 = 12.35;
    for (let i = 0; i < nT * 20; i++) {
      const f0 = i / (nT * 20), f1 = (i + 1) / (nT * 20), p = (f) => { const a = f * nT * Math.PI * 2; return [x + cr * Math.cos(a), y0 + (y1 - y0) * f, z + cr * Math.sin(a)]; };
      const mid = ((f0 + f1) / 2) * nT * Math.PI * 2, front = Math.cos(mid) * C.V[0] + Math.sin(mid) * C.V[2] > 0;
      coil[front ? 1 : 0].push(path3([p(f0), p(f1)]));
    }
    const it = K.R_.items.find((q) => q.name === `${nm}.rod`);
    it.svg = `<g class="ml-coil">${Ln(coil[0].join(""), { tone: "mid" })}</g>` + it.svg + `<g class="ml-coil">${Ln(coil[1].join(""), { tone: "mid" })}</g>`;
    it.shapes.push(record(A.ring(F, y0, y1, cr - 0.3, cr + 0.3, { name: `${nm}.spring`, owner: `${nm}.washer` })));
  });
  ENDS.springs = [40 * Math.cos(Math.PI / 4), 18, ZC + 40 * Math.sin(Math.PI / 4)];

  /* ---------- la alimentación: tolva, compuerta y el tubo que entra por el ojo del disco fijo ---------- */
  // el codo es una pieza fundida: el tubo entra a ella por los dos lados (un codo doblado se plegaría en pantalla)
  // el hueco del tubo se mide a lo largo de su línea: cada tramo termina donde el borde de su boca queda 0,2 cm adentro de la
  // superficie de la pieza
  const EC = [0, 21, ZC], ER = 8.2, Er = 5.5, ECTL = [[0, 8, ZC], EC, [0, 21, ZC + 58]];
  const Eh = (() => {
    const line = G.fillet(ECTL, Math.max(Er * 0.2, 3), 12, { P, tube: Er }), tot = G.pathLength(line), lim = Math.sqrt((ER - 0.2) ** 2 - Er * Er);
    let qm = 0, dm = 1e9; for (let q = 0; q <= tot; q += 0.02) { const d = G.len3(G.sub3(G.pointAlong(line, q), EC)); if (d < dm) { dm = d; qm = q; } }
    let q1 = qm; while (q1 > 0 && G.len3(G.sub3(G.pointAlong(line, q1), EC)) < lim) q1 -= 0.02;
    return qm - q1 - 0.02;
  })();
  pipe("feed", ECTL, Er, { bend: 0.2, flanges: [true, true], cls: "ml-steel", collars: [{ c: EC, half: Eh }] });
  // la pieza del codo, con el paso de cada tramo solo hacia su lado (hacia la puerta y hacia arriba)
  const ecut = [[0, -1, 0], [0, 0, 1]].map((d) => A.tube([EC, G.add3(EC, G.mul3(d, ER + 0.6))], Er + 0.03, { owner: "feed" }));
  put("feed.elbow", EC, `<g class="ml-cast">${K.S(G.sphereOf(EC, ER, P), { tone: "mid" })}</g>`, [record(A.ball(EC, ER, { name: "feed.elbow", cut: ecut }))]);
  box("gate", [-10, 11, ZC + 58], [10, 31, ZC + 61], { tone: "mid" }, { r: 0.4, owner: "feed.flange1", cls: "ml-steel" });
  disc("gate.rod", XA([0, 21, ZC + 59.5]), 10, 21, 0.75, { tone: "hi" }, { owner: "gate" });
  ball("gate.knob", [22.2, 21, ZC + 59.5], 1.5, { tone: "hi" }, { owner: "gate.rod", bores: [{ owner: "gate.rod", dir: [1, 0, 0], r: 0.75 }] });
  fp("hopper", FY, [[-10, ZC + 61], [10, ZC + 61], [23, ZC + 88], [-23, ZC + 88]], 9, 33, { tone: "mid" }, { owner: "gate", cls: "ml-steel",
    extra: Dots([[-20, ZC + 85], [20, ZC + 85], [-11, ZC + 66], [11, ZC + 66]].map(([x2, z2]) => at([x2, 33.02, z2])), { size: 0.4 }) });
  box("hopper.rim", [-24.5, 7.5, ZC + 88], [24.5, 34.5, ZC + 90.5], { tone: "mid" }, { r: 0.4, owner: "hopper", cls: "ml-steel" });
  // lo que hay en la tolva lo pinta la página con el color del material (vivo, encima del borde)
  const heap = [[-22.5, 9, ZC + 90.55], [22.5, 9, ZC + 90.55], [22.5, 33, ZC + 90.55], [-22.5, 33, ZC + 90.55]];
  ENDS.feed = [-17, 33, ZC + 76];

  /* ---------- el eje, las chumaceras, la polea, el motor y las correas ---------- */
  box("ped", [-15, -86, 20], [15, -32, ZC - 18], { tone: "mid" }, { r: 0.8, owner: "pad", cls: "ml-cast",
    extra: Dots([[-11, 26], [11, 26], [11, ZC - 24], [-11, ZC - 24]].map(([x, z]) => at([x, -32, z])), { size: 0.6 }) });
  const clipHalf = (poly, c, sg) => {
    const f = (p) => sg * ((p[0] - c[0]) * nv[0] + (p[1] - c[1]) * nv[1]), out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t2 = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t2, a[1] + (b[1] - a[1]) * t2]); }
    }
    return out.filter((p, i, o) => i === 0 || Math.hypot(p[0] - o[i - 1][0], p[1] - o[i - 1][1]) > 1e-6);
  };
  const fpY = (name, poly, s0, s1, style, { owner, cls = "", extraF = "", extraB = "" } = {}) => {
    const b = clipHalf(poly, CC, -1), f = clipHalf(poly, CC, 1);
    if (b.length > 2) fp(name + ".b", FY, b, s0, s1, style, { owner, cls, extra: extraB });
    if (f.length > 2) fp(name + ".f", FY, f, s0, s1, style, { owner: b.length > 2 ? name + ".b" : owner, cls, extra: extraF });
  };
  [[-46, -36, "a"], [-82, -72, "b"]].forEach(([y0, y1, nm]) => {
    fpY(`brg.${nm}`, lowerBrg(CC, 4.5, 12, -18, 15), y0, y1, { tone: "mid" }, { owner: "ped", cls: "ml-cast",
      extraF: Dots([[12.5, y0 + 2.5], [12.5, y1 - 2.5]].map(([x, y]) => at([x, y, ZC - 13])), { size: 0.5 }), extraB: Dots([[-12.5, y0 + 2.5], [-12.5, y1 - 2.5]].map(([x, y]) => at([x, y, ZC - 13])), { size: 0.5 }) });
    fpY(`brg.${nm}.cap`, capBrg(CC, 4.5, 12), y0 + 1, y1 - 1, { tone: "mid" }, { owner: `brg.${nm}.b`, cls: "ml-cast" });
  });
  disc("shaft", YA([0, 0, ZC]), -101, -31, 4.5, { tone: "hi" }, { owner: "brg.a.b" });
  const YAs = YA([0, 0, ZC]);
  fp("sheave.b", FY, sector(4.5, 18, BK, FR + 2 * Math.PI), -98, -86, { tone: "mid" }, { owner: "shaft", cls: "ml-cast" });
  fp("sheave.f", FY, sector(4.5, 18, FR, BK), -98, -86, { tone: "mid" }, { owner: "sheave.b", cls: "ml-cast",
    extra: Ln([-95, -92, -89].map((y) => G.arcOf(YAs, y, 18.05, P, { least: 0.02 })).join(""), { tone: "lo" }) });
  const MC = [86, 46], MA = YA([MC[0], 0, MC[1]]);
  box("mfeet", [MC[0] - 16, -134, 20], [MC[0] + 16, -108, MC[1] - 20], { tone: "lo" }, { r: 0.5, owner: "pad.m", cls: "ml-cast" });
  const fins = (() => { const o = []; for (let i = 0; i < 26; i++) { const t = (i / 26) * Math.PI * 2, n = [Math.cos(t), 0, Math.sin(t)]; if (G.dot3(n, C.V) < 0.08) continue; o.push(path3([[MC[0] + 20 * Math.cos(t), -106, MC[1] + 20 * Math.sin(t)], [MC[0] + 20 * Math.cos(t), -136, MC[1] + 20 * Math.sin(t)]])); } return o.join(""); })();
  disc("mot", MA, -136, -106, 20, { tone: "mid" }, { owner: "mfeet", cls: "ml-motor", extra: Ln(fins, { tone: "lo" }) });
  disc("mot.fan", MA, -144, -136, 21, { tone: "mid" }, { owner: "mot", cls: "ml-motor", extra: Dots([...G.dotsOf(MA, -144, 15, 12, P, { all: true }), ...G.dotsOf(MA, -144, 8, 6, P, { all: true })], { size: 0.55 }) });
  box("mot.tbox", [MC[0] - 6, -128, MC[1] + 20], [MC[0] + 6, -114, MC[1] + 29], { tone: "mid" }, { r: 0.6, owner: "mot", cls: "ml-motor" });
  disc("mot.shaft", MA, -106, -98, 3, { tone: "hi" }, { owner: "mot" });
  disc("mot.pul", MA, -98, -86, 8, { tone: "mid" }, { owner: "mot.shaft", cls: "ml-cast", extra: Ln([-95, -92, -89].map((y) => G.arcOf(MA, y, 8.05, P, { least: 0.02 })).join(""), { tone: "lo" }) });
  {
    const d = [MC[0] - CC[0], MC[1] - CC[1]], D = Math.hypot(d[0], d[1]), R1b = 18.95, R2 = 8.95, a = Math.atan2(d[1], d[0]), b = Math.acos((R1b - R2) / D);
    [1, -1].forEach((s2, k2) => {
      const t = a + s2 * b, n = [Math.cos(t), Math.sin(t)], p1 = [CC[0] + n[0] * R1b, CC[1] + n[1] * R1b], p2 = [MC[0] + n[0] * R2, MC[1] + n[1] * R2], u = [p2[0] - p1[0], p2[1] - p1[1]], len = Math.hypot(u[0], u[1]);
      [-95, -92, -89].forEach((y, j) => {
        const F = { o: [p1[0], y, p1[1]], a: [u[0] / len, 0, u[1] / len], u: [0, 1, 0], v: [n[0], 0, n[1]] };
        fp(`belt${k2}${j}`, F, [[-1.1, -0.9], [1.1, -0.9], [1.1, 0.9], [-1.1, 0.9]], 0, len, { tone: "lo" }, { owner: k2 ? "mot.pul" : "sheave.b", cls: "ml-belt" });
      });
    });
  }
  ENDS.motor = [MC[0], -144, MC[1] + 20];

  const data = { ends: ENDS, zc: ZC, R, yr: J.yr, yg: J.yr + J.gap / 2, r0: R0, rw: RW, s: GEO.DSDEM.s, heap, sheave: { y: -85.95, r: 12 }, nv };
  return { data, label: "Molino de discos de atrición en isométrico, con la mitad de abajo de la puerta y del disco fijo quitada: la cara del rotor con sus ranuras, la luz entre los discos, la tolva y el tubo que entra por el ojo del disco fijo, las varillas con resortes de la puerta, la carcasa con su boca de descarga sobre el recipiente, las chumaceras, la polea y las correas al motor",
    after: (after) => { after("runner", `<g data-live="ds.face"></g>`); after("hopper.rim", `<g data-live="ds.heap"></g>`); after("sheave.f", `<g data-live="ds.sheave"></g>`); } };
}
