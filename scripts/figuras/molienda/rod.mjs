/* El molino de rodillos dobles (600 × 400 mm): dos rodillos de 60 cm con sus ejes en chumaceras sobre las vigas de un
   bastidor de cuatro patas, el rodillo de la derecha flotante sobre su placa deslizante con los resortes de alivio
   contra un tope, la carcasa con la tolva que baja hasta la boca entre los rodillos, la caja de producto abajo y, del
   lado de atrás, las poleas con sus correas a dos motores sobre sus bases, a la altura de los ejes. La tapa lateral de adelante de la carcasa va quitada: se ven
   las caras de los rodillos girando y, en ese plano, las partículas de la simulación del explorador cayendo a la boca,
   quebrándose entre los rodillos y saliendo por debajo. */
export function camera(GEO) {
  const J = GEO.RC;
  const ext = [[-150, -122, 0], [150, -122, 0], [-142, 50, 0], [142, 50, 0], [-68, 22, 176], [68, -24, 176], [-30.5, 22, 176], [30.5, -26, 176], [-100, 48, 20], [100, 48, 20], [-148, -122, 128], [148, -122, 128], [-104, -36, 128], [104, -52, 128]];
  return { AZ: J.AZ, EL: J.EL, W: 860, H: 560, EXT: ext };
}
export function build(K) {
  const { G, A, P, C, GEO, put, box, fp, disc, ring, Ln, Dots, path3, record, at } = K;
  const J = GEO.RC, R = GEO.RCR.R, XC = GEO.RCR.xc, ZC = J.zc, W2 = J.W2, ENDS = {};
  const FY = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };
  const YA = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
  const nv = (() => { const a = Math.hypot(C.V[0], C.V[2]); return [C.V[0] / a, C.V[2] / a]; })(), PHN = Math.atan2(nv[1], nv[0]);
  const clipHalf = (poly, c, sg) => {
    const f = (p) => sg * ((p[0] - c[0]) * nv[0] + (p[1] - c[1]) * nv[1]), out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out.filter((p, i, o) => i === 0 || Math.hypot(p[0] - o[i - 1][0], p[1] - o[i - 1][1]) > 1e-6);
  };
  const fpY = (name, poly, c, s0, s1, style, { owner, cls = "", extraF = "", extraB = "" } = {}) => {
    fp(name + ".b", FY, clipHalf(poly, c, -1), s0, s1, style, { owner, cls, extra: extraB });
    fp(name + ".f", FY, clipHalf(poly, c, 1), s0, s1, style, { owner: name + ".b", cls, extra: extraF });
  };
  const sector = (c, r0, r1, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([c[0] + r1 * Math.cos(t), c[1] + r1 * Math.sin(t)]); } for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; o.push([c[0] + r0 * Math.cos(t), c[1] + r0 * Math.sin(t)]); } return o; };
  const ringY = (name, c, s0, s1, r0, r1, style, { owner, cls = "", extraF = "", extraB = "" } = {}) => {
    fp(name + ".b", FY, sector(c, r0, r1, PHN + Math.PI / 2, PHN + 1.5 * Math.PI), s0, s1, style, { owner, cls, extra: extraB });
    fp(name + ".f", FY, sector(c, r0, r1, PHN - Math.PI / 2, PHN + Math.PI / 2), s0, s1, style, { owner: name + ".b", cls, extra: extraF });
  };
  const lowerBrg = (c, rb, hw, base, foot) => { const o = [[c[0] - foot, c[1] + base], [c[0] + foot, c[1] + base], [c[0] + foot, c[1] + base + 5], [c[0] + hw, c[1] + base + 5], [c[0] + hw, c[1]], [c[0] + rb, c[1]]]; for (let i = 1; i < 24; i++) { const t = -(Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } o.push([c[0] - rb, c[1]], [c[0] - hw, c[1]], [c[0] - hw, c[1] + base + 5], [c[0] - foot, c[1] + base + 5]); return o; };
  const capBrg = (c, rb, ro) => { const o = [[c[0] + rb, c[1]], [c[0] + ro, c[1]]]; for (let i = 1; i < 24; i++) { const t = (Math.PI * i) / 24; o.push([c[0] + ro * Math.cos(t), c[1] + ro * Math.sin(t)]); } o.push([c[0] - ro, c[1]], [c[0] - rb, c[1]]); for (let i = 23; i > 0; i--) { const t = (Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } return o; };
  const rowAlong = (pts, step) => { const o = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step)); for (let j = 0; j < n; j++) o.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n]); } return o; };
  const occl = [];                                               // lo de adelante que tapa las partículas, en pantalla
  const hull = (pts) => { const p = pts.map((q) => C.pr(...q)).sort((a, b) => a[0] - b[0] || a[1] - b[1]), cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = []; for (const q of p) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); } for (const q of p.slice().reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); } return lo.slice(0, -1).concat(up.slice(0, -1)); };
  const boxPts = ([x0, y0, z0], [x1, y1, z1]) => [[x0, y0, z0], [x1, y0, z0], [x0, y1, z0], [x1, y1, z0], [x0, y0, z1], [x1, y0, z1], [x0, y1, z1], [x1, y1, z1]];

  /* ---------- fundación, bastidor y caja de producto ---------- */
  box("plinth.l", [-100, -48, 0], [-60, 48, 20], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
  box("plinth.r", [60, -48, 0], [100, 48, 20], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
  const legs = [[-92, -38], [-92, 26], [84, -38], [84, 26]];
  legs.forEach(([x, y], i) => {
    box(`leg${i}`, [x, y, 22], [x + 8, y + 12, 70], { tone: "lo" }, { r: 0.4, owner: `leg${i}.base`, cls: "ml-steel" });
    box(`leg${i}.base`, [x - 3, y - 3, 20], [x + 11, y + 15, 22], { tone: "lo" }, { r: 0.2, owner: x < 0 ? "plinth.l" : "plinth.r", cls: "ml-steel",
      extra: Dots([[x - 1.5, y - 1.5], [x + 9.5, y + 13.5]].map(([a, b]) => at([a, b, 22])), { size: 0.5 }) });
    if (y > 0) occl.push(hull(boxPts([x - 3, y - 3, 20], [x + 11, y + 15, 70])));
  });
  [[26, 38, "n"], [-38, -26, "f"]].forEach(([y0, y1, nm]) => {
    box(`beam.${nm}`, [-92, y0, 70], [92, y1, 84], { tone: "mid" }, { r: 0.4, owner: nm === "n" ? "leg1" : "leg0", cls: "ml-steel",
      extra: nm === "n" ? Ln(path3([[-88, y1, 77], [88, y1, 77]]), { tone: "faint" }) + Dots([-88, 88].map((x) => at([x, y1, 77])), { size: 0.45 }) : "" });
  });
  occl.push(hull(boxPts([-92, 26, 70], [92, 38, 84])));
  [[-92, -84], [84, 92]].forEach(([x0, x1], i) => box(`cross${i}`, [x0, -26, 74], [x1, 26, 84], { tone: "mid" }, { r: 0.3, owner: i ? "beam.n" : "beam.f", cls: "ml-steel" }));
  // la caja de producto, abierta arriba
  box("bin.bot", [-42, -30, 0], [42, 30, 3], { tone: "lo" }, { r: 0.4, ground: true, cls: "ml-steel" });
  box("bin.w0", [-42, -30, 3], [42, -28, 52], { tone: "mid" }, { r: 0.2, owner: "bin.bot", cls: "ml-steel" });
  box("bin.w1", [-42, -28, 3], [-40, 28, 52], { tone: "mid" }, { r: 0.2, owner: "bin.bot", cls: "ml-steel" });
  box("bin.w2", [40, -28, 3], [42, 28, 52], { tone: "mid" }, { r: 0.2, owner: "bin.bot", cls: "ml-steel" });
  box("bin.w3", [-42, 28, 3], [42, 30, 52], { tone: "mid" }, { r: 0.2, owner: "bin.bot", cls: "ml-steel",
    extra: Dots(rowAlong([[-38, 49], [38, 49]], 12).map(([x, z]) => at([x, 30, z])), { size: 0.45 }) });
  occl.push(hull(boxPts([-42, 28, 0], [42, 30, 52])));
  ENDS.bin = [-42, 30, 26];

  /* ---------- los rodillos, sus ejes y chumaceras ---------- */
  const rolls = [[-XC, "l"], [XC, "r"]];
  const segs = 12;
  rolls.forEach(([x, nm]) => {
    const F = YA([x, 0, ZC]), c = [x, ZC];
    disc(`roll.${nm}`, F, -W2, W2, R, { tone: "mid" }, { owner: `shaft.${nm}`, cls: "ml-steel", extra: `<g data-live="rc.roll.${nm}"></g>` });
    disc(`hub.${nm}`, F, W2, W2 + 3, 14, { tone: "mid" }, { owner: `roll.${nm}`, cls: "ml-cast" });
    K.R_.items.find((it) => it.name === `hub.${nm}`).svg += `<g data-live="rc.hub.${nm}"></g>`;
    disc(`shaft.${nm}`, F, W2 + 3, 46, 6, { tone: "hi" }, { owner: `brg.${nm}.b` });
    occl.push(hull([...Array(16)].flatMap((_, i) => { const t = (i / 16) * Math.PI * 2; return [[x + 6 * Math.cos(t), W2 + 3, ZC + 6 * Math.sin(t)], [x + 6 * Math.cos(t), 46, ZC + 6 * Math.sin(t)]]; })));
    disc(`shaft.${nm}.far`, F, nm === "r" ? -74 : -58, -24, 6, { tone: "hi" }, { owner: `brg.${nm}.far.b` });
    const slide = nm === "r" ? 2 : 0, base = 84 + slide - ZC;
    if (slide) [[26, 38, "n"], [-38, -26, "f"]].forEach(([y0, y1, h]) => box(`slide.${h}`, [x - 22, y0, 84], [x + 22, y1, 86], { tone: "hi" }, { r: 0.2, owner: `beam.${h}`, cls: "ml-steel" }));
    [[27, 37, ""], [-37, -27, ".far"]].forEach(([y0, y1, h]) => {
      fpY(`brg.${nm}${h}`, lowerBrg(c, 6, 14, base, 20), c, y0, y1, { tone: "mid" }, { owner: slide ? `slide.${h ? "f" : "n"}` : `beam.${h ? "f" : "n"}`, cls: "ml-cast",
        extraF: Dots([[x + 17, y0 + 2.5], [x + 17, y1 - 2.5]].map(([a, b]) => at([a, b, ZC + base + 5])), { size: 0.55 }), extraB: Dots([[x - 17, y0 + 2.5], [x - 17, y1 - 2.5]].map(([a, b]) => at([a, b, ZC + base + 5])), { size: 0.55 }) });
      fpY(`brg.${nm}${h}.cap`, capBrg(c, 6, 14), c, y0 + 1, y1 - 1, { tone: "mid" }, { owner: `brg.${nm}${h}.b`, cls: "ml-cast" });
      if (!h) occl.push(hull(boxPts([x - 20, y0, ZC + base], [x + 20, y1, ZC + 14])));
    });
    // del lado de atrás, la polea de cada rodillo
    // las poleas van en planos distintos para no tocarse (los dos rodillos están a 61 cm y cada polea mide 60)
    const py = nm === "r" ? -16 : 0;
    ringY(`pul.${nm}`, c, -54 + py, -42 + py, 6, 30, { tone: "mid" }, { owner: `shaft.${nm}.far`, cls: "ml-cast",
      extraF: Ln([-51, -48, -45].map((y) => G.arcOf(F, y + py, 30.05, P, { least: 0.02 })).join(""), { tone: "lo" }) });
  });
  ENDS.rollL = [-XC - R * 0.7, W2, ZC + R * 0.7];
  ENDS.nip = [0, W2, ZC];
  // los resortes de alivio del rodillo flotante contra su tope
  [[26, 38, "n"], [-38, -26, "f"]].forEach(([y0, y1, h]) => {
    box(`stop.${h}`, [74, y0, 84], [80, y1, 106], { tone: "mid" }, { r: 0.3, owner: `beam.${h}`, cls: "ml-cast", extra: h === "n" ? Dots([[77, 88], [77, 102]].map(([x, z]) => at([x, y1, z])), { size: 0.55 }) : "" });
    const yc = (y0 + y1) / 2, F = G.frameOf([XC + 14, yc, 97], [1, 0, 0], [0, 0, 1], [0, 1, 0]), L = 74 - XC - 14;
    disc(`spr.rod.${h}`, F, 0, L, 1.6, { tone: "hi" }, { owner: `stop.${h}` });
    const coil = [[], []], nT = 7, cr = 4.4;
    for (let i = 0; i < nT * 20; i++) {
      const f0 = i / (nT * 20), f1 = (i + 1) / (nT * 20), p = (f) => { const a = f * nT * Math.PI * 2; return [XC + 14 + 0.6 + (L - 1.2) * f, yc + cr * Math.cos(a), 97 + cr * Math.sin(a)]; };
      const a = p(f0), b = p(f1), mid = (f0 + f1) / 2 * nT * Math.PI * 2, front = Math.cos(mid) * C.V[1] + Math.sin(mid) * C.V[2] > 0;
      coil[front ? 1 : 0].push(path3([a, b]));
    }
    K.R_.items.find((it) => it.name === `spr.rod.${h}`).svg = Ln(coil[0].join(""), { tone: "mid" }) + K.R_.items.find((it) => it.name === `spr.rod.${h}`).svg + Ln(coil[1].join(""), { tone: "mid" });
    K.R_.items.find((it) => it.name === `spr.rod.${h}`).shapes.push(record(A.ring(F, 0, L, cr - 0.6, cr + 0.6, { name: `spr.${h}`, owner: `stop.${h}` })));
    if (h === "n") occl.push(hull(boxPts([XC + 14, y0, 88], [80, y1, 106])));
  });
  ENDS.spring = [62, 38, 100];

  /* ---------- la carcasa con su tolva (sin la tapa de adelante) ---------- */
  fp("hs.back", FY, [[-68, 66], [68, 66], [68, 142], [-68, 142]], -24, -22, { tone: "mid" }, { owner: "cross0", cls: "ml-steel",
    extra: Dots(rowAlong([[-64, 70], [64, 70], [64, 138], [-64, 138], [-64, 70]], 16).map(([x, z]) => at([x, -22, z])), { size: 0.5 }) });
  [[-68, -66, "a"], [66, 68, "b"]].forEach(([x0, x1, nm]) => box(`hs.${nm}`, [x0, -22, 66], [x1, 22, 142], { tone: "mid" }, { r: 0.2, owner: "hs.back", cls: "ml-steel",
    extra: Dots(rowAlong([[(x0 + x1) / 2, 70], [(x0 + x1) / 2, 140]], 12).map(([x, z]) => at([x, 22, z])), { size: 0.5 }) }));
  [[-68, -30.5, "a"], [30.5, 68, "b"]].forEach(([x0, x1, nm]) => box(`hs.top.${nm}`, [x0, -24, 142], [x1, 22, 144], { tone: "mid" }, { r: 0.2, owner: `hs.${nm}`, cls: "ml-steel" }));
  [[-30.5, -28.5, "a"], [28.5, 30.5, "b"]].forEach(([x0, x1, nm]) => box(`hop.${nm}`, [x0, -22, 131.8], [x1, 22, 176], { tone: "mid" }, { r: 0.2, owner: `hs.top.${nm}`, cls: "ml-steel" }));
  fp("hop.back", FY, [[-30.5, 144], [30.5, 144], [30.5, 176], [-30.5, 176]], -26, -24, { tone: "mid" }, { owner: "hop.a", cls: "ml-steel" });
  box("hs.plate", [68, -12, 104], [68.5, 12, 124], { tone: "hi" }, { r: 0.2, owner: "hs.b",
    extra: (() => { const rows = [0, 1, 2].map((i) => [[68.5, -9, 120 - 5.5 * i], [68.5, 9 - (i === 2 ? 6 : 0), 120 - 5.5 * i]]); return Ln(rows.map((r) => path3(r)).join(""), { tone: "lo" }) + Dots(rows.flat().map(at), { size: 0.3 }); })() });
  ENDS.hopper = [-30.5, 22, 174];

  /* ---------- los motores y las correas, del lado de atrás ---------- */
  [[-1, "l"], [1, "r"]].forEach(([sg, nm]) => {
    const mx = sg * 126, MZ = 100, MC = [mx, MZ], py = nm === "r" ? -16 : 0;
    box(`mpad.${nm}`, [mx - 22, -106 + py, 0], [mx + 22, -36 + py, 80], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
    box(`mfeet.${nm}`, [mx - 16, -96 + py, 80], [mx + 16, -62 + py, MZ - 18], { tone: "lo" }, { r: 0.5, owner: `mpad.${nm}`, cls: "ml-cast" });
    const MA = YA([mx, 0, MZ]);
    const fins = (() => { const o = []; for (let i = 0; i < 26; i++) { const t = (i / 26) * Math.PI * 2, n = [Math.cos(t), 0, Math.sin(t)]; if (G.dot3(n, C.V) < 0.08) continue; o.push(path3([[mx + 18 * Math.cos(t), -60 + py, MZ + 18 * Math.sin(t)], [mx + 18 * Math.cos(t), -98 + py, MZ + 18 * Math.sin(t)]])); } return o.join(""); })();
    disc(`mot.${nm}`, MA, -98 + py, -60 + py, 18, { tone: "mid" }, { owner: `mfeet.${nm}`, cls: "ml-motor", extra: Ln(fins, { tone: "lo" }) });
    disc(`mot.${nm}.fan`, MA, -106 + py, -98 + py, 19, { tone: "mid" }, { owner: `mot.${nm}`, cls: "ml-motor", extra: Dots([...G.dotsOf(MA, -106 + py, 14, 12, P, { all: true }), ...G.dotsOf(MA, -106 + py, 7, 6, P, { all: true })], { size: 0.55 }) });
    box(`mot.${nm}.tbox`, [mx - 6, -86 + py, MZ + 18], [mx + 6, -72 + py, MZ + 27], { tone: "mid" }, { r: 0.6, owner: `mot.${nm}`, cls: "ml-motor" });
    disc(`mot.${nm}.shaft`, MA, -60 + py, -54 + py, 3, { tone: "hi" }, { owner: `mot.${nm}` });
    disc(`mot.${nm}.pul`, MA, -54 + py, -42 + py, 9, { tone: "mid" }, { owner: `mot.${nm}.shaft`, cls: "ml-cast", extra: Ln([-51 + py, -48 + py, -45 + py].map((y) => G.arcOf(MA, y, 9.05, P, { least: 0.02 })).join(""), { tone: "lo" }) });
    // las correas: tangentes exteriores entre la polea del rodillo y la del motor
    const S0 = [sg * XC, ZC], d = [MC[0] - S0[0], MC[1] - S0[1]], D = Math.hypot(d[0], d[1]), R1 = 30.95, R2 = 9.95, a = Math.atan2(d[1], d[0]), b = Math.acos((R1 - R2) / D);
    [1, -1].forEach((s2, k) => {
      const t = a + s2 * b, n = [Math.cos(t), Math.sin(t)], p1 = [S0[0] + n[0] * R1, S0[1] + n[1] * R1], p2 = [MC[0] + n[0] * R2, MC[1] + n[1] * R2], u = [p2[0] - p1[0], p2[1] - p1[1]], len = Math.hypot(u[0], u[1]);
      [-51, -48, -45].map((y) => y + py).forEach((y, j) => {
        const F = { o: [p1[0], y, p1[1]], a: [u[0] / len, 0, u[1] / len], u: [0, 1, 0], v: [n[0], 0, n[1]] };
        fp(`belt.${nm}${k}${j}`, F, [[-1.1, -0.9], [1.1, -0.9], [1.1, 0.9], [-1.1, 0.9]], 0, len, { tone: "lo" }, { owner: `pul.${nm}.${n[0] * nv[0] + n[1] * nv[1] > 0 ? "f" : "b"}`, cls: "ml-belt" });
      });
    });
  });
  ENDS.motor = [126, -106, 120];

  const data = { ends: ENDS, s: J.s, zc: ZC, W2, R, XC, segs, nv, occl };
  return { data, label: "Molino de rodillos dobles en isométrico, con la tapa lateral de adelante quitada: los dos rodillos en sus chumaceras sobre el bastidor, el rodillo flotante con sus resortes de alivio, la carcasa con la tolva, la caja de producto y las correas a los dos motores" };
}
