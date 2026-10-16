/* La trituradora de mandíbulas de un solo toggle (600 × 900 mm): bastidor de placas laterales con la pared de adelante y
   el bloque del toggle, las dos placas de mandíbula corrugadas, la biela colgada del eje excéntrico, el toggle entre su
   asiento en la biela y el del bastidor, la varilla de tensión con su resorte, la chumacera y el volante con canales de
   correa del lado de atrás, las correas al motor sobre su base deslizante y la banda de descarga entre los dos
   pedestales. El corte va por la cara de adentro de la placa lateral de adelante: se quitan esa placa, su chumacera, su
   volante y la punta del eje, y queda a la vista la cámara de trituración, donde la página pinta las rocas de la
   simulación del explorador; la biela, el muñón excéntrico, el toggle, la varilla, el resorte y los rayos del volante
   se mueven con ella. */
export function camera(GEO) {
  const J = GEO.JC;
  const ext = [[-104, -172, 0], [246, -172, 0], [-104, 120, 0], [246, 120, 0], [-84, -62, 204], [-82, 45, 204], [110, -98, 266], [48, -98, 266], [-14, -98, 210], [136, 45, 112], [236, -160, 97]];
  return { AZ: J.AZ, EL: J.EL, W: 860, H: 560, EXT: ext };
}
export function build(K) {
  const { G, A, P, C, GEO, put, box, fp, turned, disc, ring, S: Sv, Ln, Dots, path3, pth, record, at, D2R } = K;
  const J = GEO.JC, W2 = J.W2, PL = J.PL, PT = J.PT, SC = J.S, ENDS = {};
  const FY = { o: [0, 0, 0], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] };            // prismas a lo largo de y, sección en (x, z)
  const YA = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
  const add = (p, d, k) => [p[0] + d[0] * k, p[1] + d[1] * k], sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  const unit = (d) => { const l = Math.hypot(d[0], d[1]); return [d[0] / l, d[1] / l]; };
  const circ = (c, r, a0 = 0, a1 = 2 * Math.PI, n = 28) => { const o = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); } return o; };
  // un prisma partido por el plano del eje que mira al lector, para lo que abraza un eje a lo largo de y
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

  /* ---------- las caras de la cámara, del lienzo de partículas ---------- */
  const [Ft, Fb] = GEO.jcFace(0), Xt = GEO.jcMap(450 - 95, 98), Xb = GEO.jcMap(450 - 14, 0.86 * 490);
  const dM = unit(sub(Fb, Ft)), nM = [-dM[1], dM[0]];          // la cara móvil y su normal hacia la biela (+x)
  const dF = unit(sub(Xb, Xt)), nF = [dF[1], -dF[0]];          // la fija y su normal hacia el bastidor (−x)
  // una placa de mandíbula corrugada: puntas sobre la cara del lienzo, valles 2,2 cm atrás, espesor J.die
  const die = (A0, B0, n) => {
    const L = Math.hypot(B0[0] - A0[0], B0[1] - A0[1]), N = 2 * Math.round(L / 14), d = unit(sub(B0, A0)), o = [];
    for (let i = 0; i <= N; i++) o.push(add(add(A0, d, (L * i) / N), n, i % 2 ? 2.2 : 0));
    o.push(add(B0, n, J.die), add(A0, n, J.die));
    return o;
  };
  const dieF = die(Xt, Xb, nF), dieM = die(Ft, Fb, nM);
  const bT = add(Ft, nM, J.die), bB = add(Fb, nM, J.die);       // la espalda de la placa móvil

  /* ---------- pedestales, banda de descarga y base del motor ---------- */
  box("pier.f", [-104, -72, 0], [-12, 66, 40], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
  box("pier.r", [62, -72, 0], [150, 66, 40], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
  box("mpier", [166, -172, 0], [246, -62, 28], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
  // la banda: dos canales a lo largo de y con sus patas, rodillos cada 32 cm y la banda encima
  [[-10, -6], [56, 60]].forEach(([x0, x1], i) => {
    box(`cv.rail${i}`, [x0, -132, 22], [x1, 120, 34], { tone: "lo" }, { r: 0.3, owner: `cv.leg${i}a`, cls: "ml-steel" });
    [-118, -2, 104].forEach((y, j) => box(`cv.leg${i}${"abc"[j]}`, [x0, y, 0], [x1, y + 4, 22], { tone: "lo" }, { r: 0.2, ground: true, cls: "ml-steel" }));
  });
  for (let y = -124, j = 0; y < 116; y += 32, j++) disc(`cv.roll${j}`, G.frameOf([-6, y, 32], [1, 0, 0], [0, 0, 1], [0, 1, 0]), 0, 62, 2, { tone: "mid" }, { owner: "cv.rail0" });
  box("cv.belt", [-5, -132, 34.05], [55, 120, 35.6], { tone: "mid" }, { r: 0.2, owner: "cv.roll0", cls: "ml-belt" });
  ENDS.belt = [25, 110, 36];

  /* ---------- el bastidor: la placa de atrás, la pared de adelante y el bloque del toggle ---------- */
  const plate = [[-84, 40], [136, 40], [136, 124], [104, 150], [80, 186], [16, 186], [6, 204], [-84, 204]];
  const liner = [[-46.5, 198], [8, 198], [15, 185], [42, 185], [18, 60], [-0.4, 60], [-2.9, 70], [-28.5, 172.2]];
  fp("plate", FY, plate, -PL - PT, -PL, { tone: "mid" }, { owner: "pier.f", cls: "ml-cast",
    extra: Dots([[96, 146], [110, 134], [72, 182]].map(([x, z]) => at([x, -PL, z])), { size: 0.6 }) });
  box("plate.flange", [-84, -PL - PT - 9, 40], [136, -PL - PT, 44], { tone: "lo" }, { r: 0.3, owner: "plate", cls: "ml-cast",
    extra: Dots([-70, -30, 10, 80, 120].map((x) => at([x, -PL - PT - 4.5, 44])), { size: 0.7 }) });
  fp("liner", FY, liner, -PL, -W2 - 0.3, { tone: "mid" }, { owner: "plate", cls: "ml-steel",
    extra: Dots([[-40, 192], [2, 192], [34, 178], [14, 66], [2, 66], [-12, 130], [28, 130]].map(([x, z]) => at([x, -W2 - 0.3, z])), { size: 0.55 }) });
  // la placa de desgaste de la tolva sigue la pared del lienzo desde la punta de la mandíbula fija hasta arriba, apoyada
  // en la punta de la mandíbula: así la tapa entera y la pared queda detrás
  const dL = unit(sub(GEO.jcMap(450 - 95 - 50, 98 - 70), Xt)), tL = (204 - Xt[1]) / dL[1], bF = add(Xt, nF, J.die), tLb = (204 - bF[1]) / dL[1];
  const lip = [Xt, add(Xt, dL, tL), add(bF, dL, tLb), bF];
  const wall = [bF, add(Xb, nF, J.die), [add(Xb, nF, J.die)[0], 40], [-82, 40], [-82, 204], add(bF, dL, tLb)];
  // los pernos que sujetaban la placa de adelante: una fila por el borde de la cara del corte
  const rowAlong = (pts, step) => { const o = []; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step)); for (let j = 0; j < n; j++) o.push([a[0] + ((b[0] - a[0]) * j) / n, a[1] + ((b[1] - a[1]) * j) / n]); } return o; };
  fp("wall", FY, wall, -PL, W2, { tone: "mid" }, { owner: "pier.f", cls: "ml-cast",
    extra: Dots(rowAlong([[-76, 46], [-76, 198], [-56, 198]], 16).concat(rowAlong([[-60, 46], [-18, 46]], 14)).map(([x, z]) => at([x, W2, z])), { size: 0.6 }) });
  fp("die.f", FY, dieF, -W2, W2, { tone: "mid" }, { owner: "wall", cls: "ml-steel" });
  fp("lip", FY, lip, -W2, W2, { tone: "mid" }, { owner: "die.f", cls: "ml-steel", extra: Dots([0.3, 0.7].map((f) => { const q = add(add(Xt, dL, tL * f), nF, 3.5); return at([q[0], W2, q[1]]); }), { size: 0.6 }) });
  const tblk = [[94, 40], [136, 40], [136, 112], [100, 112], [94, 104]];
  const Lp = [28, 54.6], Hh = [115, 49], dr = unit(sub(Hh, Lp)), rodAt = (x) => Lp[1] + ((x - Lp[0]) * dr[1]) / dr[0];
  fp("tblock", FY, tblk, -PL, PL, { tone: "mid" }, { owner: "pier.r", cls: "ml-cast",
    extra: Dots(rowAlong([[100, 46], [130, 46], [130, 106], [104, 106]], 12).map(([x, z]) => at([x, PL, z])), { size: 0.6 }) });
  // el asiento del toggle en el bastidor: un bloque con la ranura abierta hacia la biela, y las lainas de ajuste detrás
  fp("tseat", FY, [[90.05, 57], [92.5, 57], [92.5, 76], [90.05, 76]], -40, 40, { tone: "hi" }, { owner: "shims", cls: "ml-steel" });
  fp("shims", FY, [[92.5, 57], [94, 57], [94, 76], [92.5, 76]], -40, 40, { tone: "lo" }, { owner: "tblock", cls: "ml-steel",
    extra: Ln([93, 93.5].map((x) => path3([[x, 40, 57], [x, 40, 76]])).join(""), { tone: "faint" }) });
  box("tblock.plate", [136, -16, 72], [136.5, 16, 96], { tone: "hi" }, { r: 0.2, owner: "tblock",
    extra: (() => { const rows = [0, 1, 2].map((i) => [[136.5, -12, 91 - 6 * i], [136.5, 12 - (i === 2 ? 8 : 0), 91 - 6 * i]]); return Ln(rows.map((r) => path3(r)).join(""), { tone: "lo" }) + Dots(rows.flat().map(at), { size: 0.3 }); })() });
  ENDS.setting = [-84, PL, 62];
  ENDS.gape = [-54, PL, 204];

  /* ---------- la biela con su placa de mandíbula, el muñón y el toggle (vivos) ---------- */
  const Tp = [35, 75.5], Tf = [86.5, 66.5], L0 = Math.hypot(Tf[0] - Tp[0], Tf[1] - Tp[1]);
  const pit = [...circ(SC, J.rh, (-30 * Math.PI) / 180, (250 * Math.PI) / 180, 20).slice(-1), bT, bB, [7.5, 62], [12, 56.5], [26, 58], [32, 64], [31.45, 70], [31.45, 81], [42, 98], [52, 136], [63, 168], ...circ(SC, J.rh, (-30 * Math.PI) / 180, (250 * Math.PI) / 180, 20).slice(0, -1)];
  const lug = [[14, 56.714], [26, 58], [28, 58], [28, 51], [24, 49], [17, 49], [14, 52]];
  const tog = (a, b, h = 3.5) => { const d = unit(sub(b, a)), n = [-d[1], d[0]], o = []; for (let i = 0; i <= 8; i++) { const t = Math.PI / 2 + (Math.PI * i) / 8; o.push(add(a, [d[0] * Math.cos(t) - n[0] * Math.sin(t), d[1] * Math.cos(t) - n[1] * Math.sin(t)], h)); } for (let i = 0; i <= 8; i++) { const t = -Math.PI / 2 + (Math.PI * i) / 8; o.push(add(b, [d[0] * Math.cos(t) - n[0] * Math.sin(t), d[1] * Math.cos(t) - n[1] * Math.sin(t)], h)); } return o; };
  const live = (name, poly, s0, s1, owner, cls) => { const sh = fp(name, FY, poly, s0, s1, { tone: "mid" }, { owner, cls }); K.R_.items.find((it) => it.name === name).live = true; return sh; };
  live("pitman", pit, -W2, W2, "tseat", "ml-cast");
  live("die.m", dieM, -W2, W2, "pitman", "ml-steel");
  live("lug", lug, -6, 6, "pitman", "ml-cast");
  live("toggle", tog(Tp, Tf), -40, 40, "tseat", "ml-steel");
  // el eje: concéntrico afuera de la biela, excéntrico adentro; en la cara del corte se ven el muñón y el eje
  const SA = YA([SC[0], 0, SC[1]]);
  disc("shaft.a", SA, -104, -92, J.rs, { tone: "hi" }, { owner: "fw.hub.b" });
  disc("shaft", SA, -86, -W2, J.rs, { tone: "hi" }, { owner: "brg.b" });
  disc("shaft.stub", SA, W2, PL, J.rs, { tone: "hi" }, { owner: "pitman" });
  K.R_.items.find((it) => it.name === "shaft.stub").svg += `<g data-live="jc.key"></g>`;
  // la varilla de tensión y su resorte, detrás del bloque del toggle (vivos)
  const rodEnd = add(Lp, dr, 146), RF = G.frameAlong([Lp[0], 0, Lp[1]], [dr[0], 0, dr[1]]), sBlk = (136 - Lp[0]) / dr[0];
  // en dos piezas: la de adelante, que el bloque tapa, y la de atrás con el resorte, que queda delante de la cara de atrás
  // la varilla atraviesa el bloque: se dibuja lo que se ve, de la oreja a la cara de adelante del bloque y de la cara de
  // atrás a la tuerca; lo de adentro no se ve ni se registra
  const pIn = add(Lp, dr, (94 - Lp[0]) / dr[0]), pMid = add(Lp, dr, sBlk);
  put("rod.a", [(Lp[0] + pIn[0]) / 2, 0, (Lp[1] + pIn[1]) / 2], "", [record(A.tube([[Lp[0], 0, Lp[1]], [pIn[0], 0, pIn[1]]], 2, { name: "rod.a", owner: "lug" }))], { live: true });
  const rodShapes = [A.tube([[pMid[0], 0, pMid[1]], [rodEnd[0], 0, rodEnd[1]]], 2, { name: "rod.b", owner: "tblock" }), A.ring(RF, sBlk + 0.2, sBlk + 22, 4.2, 5.8, { name: "rod.spring", owner: "tblock" }),
    A.disc(RF, sBlk + 22, sBlk + 23.5, 5.5, { name: "rod.washer", owner: "rod.b" }), A.disc(RF, sBlk + 23.5, sBlk + 28, 4, { name: "rod.nut", owner: "rod.b" })].map(record);
  put("rod.b", [(pMid[0] + rodEnd[0]) / 2, 0, (pMid[1] + rodEnd[1]) / 2], "", rodShapes, { live: true });

  /* ---------- la chumacera de atrás, el volante con canales y las correas al motor ---------- */
  const lowerBrg = (c, rb, hw, base, foot) => { const o = [[c[0] - foot, c[1] + base], [c[0] + foot, c[1] + base], [c[0] + foot, c[1] + base + 5], [c[0] + hw, c[1] + base + 5], [c[0] + hw, c[1]], [c[0] + rb, c[1]]]; for (let i = 1; i < 24; i++) { const t = -(Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } o.push([c[0] - rb, c[1]], [c[0] - hw, c[1]], [c[0] - hw, c[1] + base + 5], [c[0] - foot, c[1] + base + 5]); return o; };
  const capBrg = (c, rb, ro) => { const o = [[c[0] + rb, c[1]], [c[0] + ro, c[1]]]; for (let i = 1; i < 24; i++) { const t = (Math.PI * i) / 24; o.push([c[0] + ro * Math.cos(t), c[1] + ro * Math.sin(t)]); } o.push([c[0] - ro, c[1]], [c[0] - rb, c[1]]); for (let i = 23; i > 0; i--) { const t = (Math.PI * i) / 24; o.push([c[0] + rb * Math.cos(t), c[1] + rb * Math.sin(t)]); } return o; };
  fpY("brg", lowerBrg(SC, J.rs, 22, 186 - SC[1], 26), SC, -64, -47, { tone: "mid" }, { owner: "plate", cls: "ml-cast",
    extraF: Dots([[SC[0] + 22, -60], [SC[0] + 22, -51]].map(([x, y]) => at([x, y, 191])), { size: 0.6 }), extraB: Dots([[SC[0] - 22, -60], [SC[0] - 22, -51]].map(([x, y]) => at([x, y, 191])), { size: 0.6 }) });
  fpY("brg.cap", capBrg(SC, J.rs, 22), SC, -62, -49, { tone: "mid" }, { owner: "brg.b", cls: "ml-cast" });
  disc("brg.grease", K.ZA_([SC[0], -55.5, SC[1] + 22]), -0.6, 3, 1.4, { tone: "hi" }, { owner: "brg.cap.f" });
  const FW = { y0: -98, y1: -80, r0: 52, r1: 62, hub: 18 };
  const grooves = [-95, -92, -89, -86, -83].map((y) => G.arcOf(SA, y, FW.r1 + 0.05, P, { least: 0.02 })).join("");
  ringY("fw.rim", SC, FW.y0, FW.y1, FW.r0, FW.r1, { tone: "mid" }, { owner: "fw.hub", cls: "ml-cast", extraF: Ln(grooves, { tone: "lo" }) });
  ringY("fw.hub", SC, FW.y0 + 6, FW.y1 - 6, J.rs, FW.hub, { tone: "mid" }, { owner: "shaft", cls: "ml-cast" });
  // los rayos van en dos grupos, los de atrás del plano del eje y los de adelante; la página los reparte al girar
  [["b", PHN + Math.PI / 2, PHN + 1.5 * Math.PI], ["f", PHN - Math.PI / 2, PHN + Math.PI / 2]].forEach(([h, a0, a1]) =>
    put(`fw.spk.${h}`, [SC[0], (FW.y0 + FW.y1) / 2, SC[1]], "", [record(A.prism(FY, sector(SC, FW.hub, FW.r0, a0, a1), FW.y0 + 6, FW.y1 - 6, { name: `fw.spk.${h}`, owner: `fw.hub.${h}` }))], { live: true }));
  const MC = [206, 64];
  // el motor sobre su base deslizante, con la polea alineada con los canales del volante
  [[176, 184], [228, 236]].forEach(([x0, x1], i) => box(`mrail${i}`, [x0, -160, 28], [x1, -70, 32], { tone: "lo" }, { r: 0.3, owner: "mpier", cls: "ml-steel",
    extra: Dots([-150, -80].map((y) => at([(x0 + x1) / 2, y, 32])), { size: 0.6 }) }));
  box("mfeet", [182, -146, 32], [230, -106, MC[1] - 22], { tone: "lo" }, { r: 0.6, owner: "mrail0", cls: "ml-cast" });
  const MA = YA([MC[0], 0, MC[1]]);
  const fins = (() => { const o = []; for (let i = 0; i < 30; i++) { const t = (i / 30) * Math.PI * 2, n = [Math.cos(t), 0, Math.sin(t)]; if (G.dot3(n, C.V) < 0.08) continue; o.push(path3([[MC[0] + 22 * Math.cos(t), -102, MC[1] + 22 * Math.sin(t)], [MC[0] + 22 * Math.cos(t), -148, MC[1] + 22 * Math.sin(t)]])); } return o.join(""); })();
  disc("mot", MA, -148, -102, 22, { tone: "mid" }, { owner: "mfeet", cls: "ml-motor", extra: Ln(fins, { tone: "lo" }) });
  disc("mot.fan", MA, -160, -148, 23, { tone: "mid" }, { owner: "mot", cls: "ml-motor", extra: Dots([...G.dotsOf(MA, -160, 17, 14, P, { all: true }), ...G.dotsOf(MA, -160, 9, 8, P, { all: true })], { size: 0.6 }) });
  box("mot.tbox", [MC[0] - 7, -136, MC[1] + 22], [MC[0] + 7, -118, MC[1] + 33], { tone: "mid" }, { r: 0.8, owner: "mot", cls: "ml-motor" });
  disc("mot.shaft", MA, -102, -96, 4, { tone: "hi" }, { owner: "mot" });
  const pgro = [-94, -90, -86].map((y) => G.arcOf(MA, y, 12.05, P, { least: 0.02 })).join("");
  disc("mot.pul", MA, -96, -82, 12, { tone: "mid" }, { owner: "mot.shaft", cls: "ml-cast", extra: Ln(pgro, { tone: "lo" }) });
  // tres correas en V: los dos tramos rectos entre el volante y la polea (tangentes exteriores)
  {
    const d = sub(MC, SC), D = Math.hypot(d[0], d[1]), R1 = FW.r1 + 0.95, R2 = 12.95, a = Math.atan2(d[1], d[0]), b = Math.acos((R1 - R2) / D);
    [1, -1].forEach((sg, k) => {
      const t = a + sg * b, n = [Math.cos(t), Math.sin(t)], p1 = add(SC, n, R1), p2 = add(MC, n, R2), u = unit(sub(p2, p1)), len = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      [-92, -88, -84].forEach((y, j) => {
        const F = { o: [p1[0], y, p1[1]], a: [u[0], 0, u[1]], u: [0, 1, 0], v: [n[0], 0, n[1]] };
        fp(`belt${k}${j}`, F, [[-1.3, -0.9], [1.3, -0.9], [1.3, 0.9], [-1.3, 0.9]], 0, len, { tone: "lo" }, { owner: k ? "mot.pul" : "fw.rim.b", cls: "ml-belt" });
      });
    });
  }
  ENDS.motor = [MC[0], -160, MC[1] + 20];
  ENDS.fly = [SC[0] + FW.r1 + 2, FW.y1, SC[1] + 8];
  ENDS.pitman = [SC[0], W2, SC[1] + J.rh];
  ENDS.toggle = [(Tp[0] + Tf[0]) / 2, 40, (Tp[1] + Tf[1]) / 2 + 3];

  const data = {
    ends: ENDS, s: J.s, zb: J.zb, W2, PL, S: SC, rs: J.rs, rj: J.rj, rh: J.rh,
    pit, dieM, lug, Tp, Tf, L0, Lp, dr, rodLen: 146, rodR: 2, sBlk, FW, ecc: 0.3 * 12 * J.s,
    dieF, wall, lip, nv,
  };
  return { data, label: "Trituradora de mandíbulas de un solo toggle en isométrico, con la placa lateral de adelante quitada: la cámara entre la mandíbula fija y la móvil, la biela colgada del eje excéntrico, el toggle, la varilla de tensión con su resorte, la chumacera y el volante con canales, las correas al motor y la banda de descarga" };
}
