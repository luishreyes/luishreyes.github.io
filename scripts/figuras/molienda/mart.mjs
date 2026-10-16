/* El molino de martillos de rotor en voladizo (carcasa de 80 cm): la carcasa cilíndrica con la criba perforada abajo,
   la boca de alimentación arriba a la izquierda con su chute y su tolva, la carcasa sobre dos cunas, la tolva de descarga
   debajo de la criba, el eje en dos chumaceras sobre su pedestal del lado de atrás, la polea con sus correas al motor. El
   rotor (cubo, discos, pasadores y cuatro filas de martillos rígidos) gira con la simulación del explorador; la tapa de
   adelante va quitada y en su plano la página pinta las partículas que entran, se rompen contra los martillos y salen por
   la criba. */
export function camera(GEO) {
  const J = GEO.HM;
  const ext = [[-70, -140, 0], [160, -140, 0], [-70, 50, 0], [160, 50, 0], [-52, 30, 218], [-14, -34, 218], [58, 30, 100], [-58, 30, 100], [140, -136, 66]];
  return { AZ: J.AZ, EL: J.EL, W: 860, H: 560, EXT: ext };
}
export function build(K) {
  const { G, A, P, C, GEO, put, box, fp, disc, Ln, Dots, path3, record, at, D2R } = K;
  const J = GEO.HM, RC = GEO.HMR.Rc, RO = RC + 4, ZC = J.zc, W2 = J.W2, ENDS = {}, CC = [0, ZC];
  const FY = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };
  const YA = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
  const nv = (() => { const a = Math.hypot(C.V[0], C.V[2]); return [C.V[0] / a, C.V[2] / a]; })(), PHN = Math.atan2(nv[1], nv[0]);
  const sector = (c, r0, r1, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([c[0] + r1 * Math.cos(t), c[1] + r1 * Math.sin(t)]); } for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; o.push([c[0] + r0 * Math.cos(t), c[1] + r0 * Math.sin(t)]); } return o; };
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
    const b = clipHalf(poly, c, -1), f = clipHalf(poly, c, 1);
    if (b.length > 2) fp(name + ".b", FY, b, s0, s1, style, { owner, cls, extra: extraB });
    if (f.length > 2) fp(name + ".f", FY, f, s0, s1, style, { owner: b.length > 2 ? name + ".b" : owner, cls, extra: extraF });
  };
  const lowerBrg = (c, rb, hw, base, foot) => { const o = [[c[0] - foot, c[1] + base], [c[0] + foot, c[1] + base], [c[0] + foot, c[1] + base + 5], [c[0] + hw, c[1] + base + 5], [c[0] + hw, c[1]], [c[0] + rb, c[1]]]; for (let i = 1; i < 24; i++) { const t = -(Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } o.push([c[0] - rb, c[1]], [c[0] - hw, c[1]], [c[0] - hw, c[1] + base + 5], [c[0] - foot, c[1] + base + 5]); return o; };
  const capBrg = (c, rb, ro) => { const o = [[c[0] + rb, c[1]], [c[0] + ro, c[1]]]; for (let i = 1; i < 24; i++) { const t = (Math.PI * i) / 24; o.push([c[0] + ro * Math.cos(t), c[1] + ro * Math.sin(t)]); } o.push([c[0] - ro, c[1]], [c[0] - rb, c[1]]); for (let i = 23; i > 0; i--) { const t = (Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } return o; };
  const pt = (t, r, y) => [r * Math.cos(t), y, ZC + r * Math.sin(t)];

  /* ---------- fundación, cunas y tolva de descarga ---------- */
  box("pad", [-70, -140, 0], [160, 50, 20], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
  [[-1, "l"], [1, "r"]].forEach(([sg, nm]) => {
    // la cuna abraza el casco por debajo, de donde termina la criba (−32°) hasta lo más ancho de la carcasa
    const a0 = sg > 0 ? -32 * D2R : (180 + 32) * D2R, a1 = sg > 0 ? 0 : Math.PI, arc = [];
    for (let i = 0; i <= 16; i++) { const t = a0 + ((a1 - a0) * i) / 16; arc.push([RO * Math.cos(t), ZC + RO * Math.sin(t)]); }
    const x0 = arc[0][0];
    const poly = sg < 0 ? [[-60, 20], [x0, 20], ...arc, [-60, ZC]] : [[x0, 20], [60, 20], [60, ZC], ...arc.slice().reverse()];
    fp(`cradle.${nm}`, FY, poly, -W2 - 2, W2 + 2, { tone: "mid" }, { owner: "pad", cls: "ml-cast",
      extra: Dots([[sg * 54, 26], [sg * 54, ZC - 6], [sg * (x0 * sg + 4), 26]].map(([x, z]) => at([x, W2 + 2, z])), { size: 0.6 }) });
  });
  fp("funnel", FY, [[-24, 67.5], [-9, 30], [9, 30], [24, 67.5], [22, 67.5], [7.8, 32], [-7.8, 32], [-22, 67.5]], -W2, W2, { tone: "mid" }, { owner: "spout", cls: "ml-steel" });
  fp("funnel.back", FY, [[-24, 67.5], [-9, 30], [9, 30], [24, 67.5]], -W2 - 2, -W2, { tone: "mid" }, { owner: "funnel", cls: "ml-steel" });
  box("spout", [-9, -16, 20], [9, 14, 30], { tone: "mid" }, { r: 0.3, owner: "pad", cls: "ml-steel" });
  box("cradle.plate", [60, -10, 64], [60.5, 12, 84], { tone: "hi" }, { r: 0.2, owner: "cradle.r",
    extra: (() => { const rows = [0, 1, 2].map((i) => [[60.5, -7, 80 - 5.5 * i], [60.5, 9 - (i === 2 ? 6 : 0), 80 - 5.5 * i]]); return Ln(rows.map((r) => path3(r)).join(""), { tone: "lo" }) + Dots(rows.flat().map(at), { size: 0.3 }); })() });

  /* ---------- la carcasa: casco, criba, tapa de atrás, boca y chute ---------- */
  const INL = [100 * D2R, 124 * D2R], SCR = [-148 * D2R, -32 * D2R];
  const nearBolts = (a0, a1) => { const o = []; for (let t = a0 + 0.08; t < a1 - 0.04; t += 0.2) o.push(at(pt(t, RC + 2, W2 + 0.05))); return Dots(o, { size: 0.5 }); };
  const shell = (name, a0, a1, cls) => fpY(name, sector(CC, RC, RO, a0, a1, Math.max(6, Math.round((a1 - a0) / 0.08))), CC, -W2 - 2, W2 + 2, { tone: "mid" }, { owner: "plate.back", cls, extraF: nearBolts(Math.max(a0, PHN - Math.PI / 2), Math.min(a1, PHN + Math.PI / 2)) });
  shell("shell.a", SCR[1], INL[0], "ml-cast");
  shell("shell.b", INL[1], SCR[0] + 2 * Math.PI, "ml-cast");
  // la criba: un casco perforado; los agujeros por dentro (lo que se ve de la mitad de atrás) y por fuera
  const holesIn = [], holesOut = [];
  for (let t = SCR[0] + 0.05; t < SCR[1] - 0.03; t += 0.085) for (let y = -W2 + 2; y < W2; y += 4.4) {
    const n = [Math.cos(t), 0, Math.sin(t)], d = G.dot3(n, C.V);
    if (d < -0.05) holesIn.push(at(pt(t, RC - 0.05, y))); else if (d > 0.05) holesOut.push(at(pt(t, RO + 0.05, y)));
  }
  fpY("screen", sector(CC, RC, RO, SCR[0], SCR[1], 30), CC, -W2 - 2, W2 + 2, { tone: "mid" }, { owner: "cradle.l", cls: "ml-screen",
    extraB: `<g class="ml-holes">${Dots(holesIn, { size: 0.42 })}</g>`, extraF: `<g class="ml-holes">${Dots(holesOut, { size: 0.42 })}</g>` });
  const backPlate = []; for (let i = 0; i < 48; i++) { const t = (i / 48) * Math.PI * 2; backPlate.push([(RO + 3) * Math.cos(t), ZC + (RO + 3) * Math.sin(t)]); }
  fp("plate.back", FY, backPlate, -W2 - 6, -W2 - 2, { tone: "mid" }, { owner: "cradle.l", cls: "ml-cast",
    extra: Dots([...Array(14)].map((_, i) => { const t = (i / 14) * Math.PI * 2 + 0.1; return at(pt(t, RC - 4, -W2 - 2)); }), { size: 0.55 }) });
  // el chute de alimentación: dos placas desde los bordes de la boca, una pared de atrás y la tolva arriba
  const dch = [Math.cos(112 * D2R), Math.sin(112 * D2R)], Lc = 40;
  const Pa = [RO * Math.cos(INL[0]), ZC + RO * Math.sin(INL[0])], Pb = [RO * Math.cos(INL[1]), ZC + RO * Math.sin(INL[1])];
  const nrm = [dch[1], -dch[0]];                                   // hacia la derecha del chute
  const plateAlong = (p0, side) => [p0, [p0[0] + dch[0] * Lc, p0[1] + dch[1] * Lc], [p0[0] + dch[0] * Lc + nrm[0] * 2 * side, p0[1] + dch[1] * Lc + nrm[1] * 2 * side], [p0[0] + nrm[0] * 2 * side, p0[1] + nrm[1] * 2 * side]];
  fp("chute.r", FY, plateAlong(Pa, 1), -W2 - 2, W2 + 2, { tone: "mid" }, { owner: "shell.a.b", cls: "ml-steel" });
  fp("chute.l", FY, plateAlong(Pb, -1), -W2 - 2, W2 + 2, { tone: "mid" }, { owner: "shell.b.b", cls: "ml-steel" });
  const top = [Pa[0] + dch[0] * Lc, Pa[1] + dch[1] * Lc], topL = [Pb[0] + dch[0] * Lc, Pb[1] + dch[1] * Lc];
  // la pared de atrás del chute arranca en el borde de la tapa de atrás, que tapa lo demás
  const outTo = (p, r) => { let t = 0; while (Math.hypot(p[0] + dch[0] * t, p[1] - ZC + dch[1] * t) < r) t += 0.05; return [p[0] + dch[0] * t, p[1] + dch[1] * t]; };
  const Pa2 = outTo(Pa, RO + 3.02), Pb2 = outTo(Pb, RO + 3.02), ta = Math.atan2(Pa2[1] - ZC, Pa2[0]), tb = Math.atan2(Pb2[1] - ZC, Pb2[0]), seam = [];
  for (let i = 1; i < 8; i++) { const t = tb + ((ta - tb) * i) / 8; seam.push([(RO + 3.02) * Math.cos(t), ZC + (RO + 3.02) * Math.sin(t)]); }
  fp("chute.back", FY, [Pa2, top, topL, Pb2, ...seam], -W2 - 6, -W2 - 2, { tone: "mid" }, { owner: "chute.r", cls: "ml-steel" });
  const zH = Math.max(top[1], topL[1]);
  box("hopper", [Math.min(top[0], topL[0]) - 14, -W2 - 6, zH], [Math.max(top[0], topL[0]) + 14, W2 + 2, zH + 22], { tone: "mid" }, { r: 0.6, bevel: 0.4, owner: "chute.r", cls: "ml-steel" });
  ENDS.feed = [(top[0] + topL[0]) / 2, W2 + 2, zH + 22];
  ENDS.screen = [9, 14, 22];

  /* ---------- el rotor (vivo) y su eje en voladizo ---------- */
  const R0 = GEO.HMR.rr, R1 = R0 + GEO.HMR.L, RD = 12, RP = 9.5;
  const discs = [[-28, -25], [-9.5, -6.5], [6.5, 9.5], [25, 28]], rows = [[-21, -13.5], [-3.75, 3.75], [13.5, 21]];
  put("hm.rotor", [0, 0, ZC], "", [record(A.solid(YA([0, 0, ZC]), [[-28, R1], [28, R1]], { name: "hm.rotor", owner: "shaft.in" }))], { live: true });
  disc("shaft", YA([0, 0, ZC]), -102, -W2 - 6, 5.5, { tone: "hi" }, { owner: "brg.a.b" });
  disc("shaft.in", YA([0, 0, ZC]), -W2 - 2, -28, 5.5, { tone: "hi" }, { owner: "plate.back" });
  K.R_.items.find((it) => it.name === "shaft").svg += `<g data-live="hm.key"></g>`;
  box("ped", [-16, -86, 20], [16, -36, 96], { tone: "mid" }, { r: 0.8, owner: "pad", cls: "ml-cast",
    extra: Dots([[-12, 26], [12, 26], [12, 90], [-12, 90]].map(([x, z]) => at([x, -36, z])), { size: 0.6 }) });
  [[-48, -38, "a"], [-80, -70, "b"]].forEach(([y0, y1, nm]) => {
    fpY(`brg.${nm}`, lowerBrg(CC, 5.5, 13, 96 - ZC, 16), CC, y0, y1, { tone: "mid" }, { owner: "ped", cls: "ml-cast",
      extraF: Dots([[13.5, y0 + 2.5], [13.5, y1 - 2.5]].map(([x, y]) => at([x, y, 101])), { size: 0.5 }), extraB: Dots([[-13.5, y0 + 2.5], [-13.5, y1 - 2.5]].map(([x, y]) => at([x, y, 101])), { size: 0.5 }) });
    fpY(`brg.${nm}.cap`, capBrg(CC, 5.5, 13), CC, y0 + 1, y1 - 1, { tone: "mid" }, { owner: `brg.${nm}.b`, cls: "ml-cast" });
  });
  const YAs = YA([0, 0, ZC]);
  fp("sheave.b", FY, sector(CC, 5.5, 20, PHN + Math.PI / 2, PHN + 1.5 * Math.PI), -98, -86, { tone: "mid" }, { owner: "shaft", cls: "ml-cast" });
  fp("sheave.f", FY, sector(CC, 5.5, 20, PHN - Math.PI / 2, PHN + Math.PI / 2), -98, -86, { tone: "mid" }, { owner: "sheave.b", cls: "ml-cast",
    extra: Ln([-95, -92, -89].map((y) => G.arcOf(YAs, y, 20.05, P, { least: 0.02 })).join(""), { tone: "lo" }) });
  ENDS.rotor = [-RO - 3, W2 + 2, ZC + 14];

  /* ---------- el motor y las correas ---------- */
  const MC = [118, 44], MA = YA([MC[0], 0, MC[1]]);
  box("mfeet", [MC[0] - 16, -134, 20], [MC[0] + 16, -108, MC[1] - 20], { tone: "lo" }, { r: 0.5, owner: "pad", cls: "ml-cast" });
  const fins = (() => { const o = []; for (let i = 0; i < 26; i++) { const t = (i / 26) * Math.PI * 2, n = [Math.cos(t), 0, Math.sin(t)]; if (G.dot3(n, C.V) < 0.08) continue; o.push(path3([[MC[0] + 20 * Math.cos(t), -106, MC[1] + 20 * Math.sin(t)], [MC[0] + 20 * Math.cos(t), -136, MC[1] + 20 * Math.sin(t)]])); } return o.join(""); })();
  disc("mot", MA, -136, -106, 20, { tone: "mid" }, { owner: "mfeet", cls: "ml-motor", extra: Ln(fins, { tone: "lo" }) });
  disc("mot.fan", MA, -144, -136, 21, { tone: "mid" }, { owner: "mot", cls: "ml-motor", extra: Dots([...G.dotsOf(MA, -144, 15, 12, P, { all: true }), ...G.dotsOf(MA, -144, 8, 6, P, { all: true })], { size: 0.55 }) });
  box("mot.tbox", [MC[0] - 6, -128, MC[1] + 20], [MC[0] + 6, -114, MC[1] + 29], { tone: "mid" }, { r: 0.6, owner: "mot", cls: "ml-motor" });
  disc("mot.shaft", MA, -106, -98, 3, { tone: "hi" }, { owner: "mot" });
  disc("mot.pul", MA, -98, -86, 8, { tone: "mid" }, { owner: "mot.shaft", cls: "ml-cast", extra: Ln([-95, -92, -89].map((y) => G.arcOf(MA, y, 8.05, P, { least: 0.02 })).join(""), { tone: "lo" }) });
  {
    const d = [MC[0] - CC[0], MC[1] - CC[1]], D = Math.hypot(d[0], d[1]), R1b = 20.95, R2 = 8.95, a = Math.atan2(d[1], d[0]), b = Math.acos((R1b - R2) / D);
    [1, -1].forEach((s2, k) => {
      const t = a + s2 * b, n = [Math.cos(t), Math.sin(t)], p1 = [CC[0] + n[0] * R1b, CC[1] + n[1] * R1b], p2 = [MC[0] + n[0] * R2, MC[1] + n[1] * R2], u = [p2[0] - p1[0], p2[1] - p1[1]], len = Math.hypot(u[0], u[1]);
      [-95, -92, -89].forEach((y, j) => {
        const F = { o: [p1[0], y, p1[1]], a: [u[0] / len, 0, u[1] / len], u: [0, 1, 0], v: [n[0], 0, n[1]] };
        fp(`belt${k}${j}`, F, [[-1.1, -0.9], [1.1, -0.9], [1.1, 0.9], [-1.1, 0.9]], 0, len, { tone: "lo" }, { owner: k ? "mot.pul" : "sheave.b", cls: "ml-belt" });
      });
    });
  }
  ENDS.motor = [MC[0], -144, MC[1] + 20];

  // la boca que se ve por el lado abierto: el círculo de la carcasa y el chute, en el plano de adelante
  const open = (() => {
    const o = [], a = Math.atan2(Pa[1] - ZC, Pa[0]), b = Math.atan2(Pb[1] - ZC, Pb[0]);
    for (let i = 0; i <= 60; i++) { const t = b + ((a + 2 * Math.PI - b) * i) / 60; o.push([RC * Math.cos(t), ZC + RC * Math.sin(t)]); }
    o.push([Pa[0], Pa[1]], top, topL, [Pb[0], Pb[1]]);
    return o.map(([x, z]) => C.pr(x, W2 + 2, z));
  })();
  const data = { ends: ENDS, s: J.s, zc: ZC, W2: W2 + 2, rd: RD, rp: RP, r0: R0, r1: R1, hw: 2.6, discs, rows, open, nv };
  return { data, label: "Molino de martillos de rotor en voladizo en isométrico, con la tapa de adelante quitada: la carcasa con la criba perforada, la boca de alimentación con su chute y su tolva, el rotor con cuatro filas de martillos, las cunas, la tolva de descarga, las chumaceras sobre su pedestal y las correas al motor" };
}
