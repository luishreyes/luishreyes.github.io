/* El molino de bolas: tambor de 3 m con revestimiento y levantadores, bridas, cabezas cónicas, muñones en sus chumaceras
   sobre pedestales de concreto, la corona y el piñón con sus chumaceras, el acople, el reductor y el motor sobre su
   base; la tolva con su chute que entra por el muñón de alimentación, y el trommel de descarga con su tolva. Entre dos
   planos se quita la mitad del tambor que mira al lector: quedan la artesa de atrás con su carga y, al fondo, el corte
   del lado de la descarga; los levantadores y la carga los pinta la página con la simulación del explorador. */
export function camera(GEO) {
  const B = GEO.BM, { T, HV } = GEO.axesOf(B.AZ), xp = 230 * Math.cos((B.pin.th * Math.PI) / 180) + 70;
  const ext = [[-110, -600, 0], [xp, -600, 0], [-110, 490, 0], [xp, 490, 0], [-110, -600, B.ZA + 160], [xp, 490, B.ZA + 240], [-110, 490, B.ZA + 240], [0, 0, B.ZA + B.fl + 24], [0, 0, 0]];
  return { AZ: B.AZ, EL: B.EL, W: 860, H: 500, EXT: ext };
}
export function build(K) {
  const { G, A, P, C, T, HV, GEO, put, box, fp, turned, disc, ring, pipe, ball, entry, pad, S, Ln, Dots, path3, pth, record, addv, ZA_, at, D2R } = K;
  const B = GEO.BM, ZA = B.ZA, R = B.R, RS = B.RS, RO = B.RO, L2 = B.L / 2, W = B.cut;
  const YA = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
  const AX = YA([0, 0, ZA]);
  const BF = (y = 0, x = 0, z = ZA) => ({ o: [x, y, z], a: [0, 1, 0], u: [1, 0, 0], v: [0, 0, 1] });   // prismas a lo largo de y, sección en (x, z)
  const pt = (th, r, y) => [r * Math.cos(th), y, ZA + r * Math.sin(th)];
    const ENDS = {};
  /* lo que abraza un eje a lo largo de y se parte por el plano del eje que mira al lector: la mitad de atrás va detrás
     del eje y la de adelante, delante (en (x, z), n es la dirección hacia el lector) */
  const nv = (() => { const a = Math.hypot(C.V[0], C.V[2]); return [C.V[0] / a, C.V[2] / a]; })(), PHN = Math.atan2(nv[1], nv[0]);
  const clipHalf = (poly, sg) => {
    const f = (p) => sg * (p[0] * nv[0] + p[1] * nv[1]), out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], fa = f(a), fb = f(b);
      if (fa >= 0) out.push(a);
      if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out.filter((p, i, o) => i === 0 || Math.hypot(p[0] - o[i - 1][0], p[1] - o[i - 1][1]) > 1e-6);
  };
  const sector = (r0, r1, a0, a1, n = 24) => { const o = []; for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; o.push([r1 * Math.cos(t), r1 * Math.sin(t)]); } for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; o.push([r0 * Math.cos(t), r0 * Math.sin(t)]); } return o; };
  // una corona alrededor del eje en dos mitades: «.b» atrás y «.f» adelante
  const ringY = (name, ox, oz, s0, s1, r0, r1, style, { owner, cls = "", extraF = "", extraB = "" } = {}) => {
    fp(name + ".b", BF(0, ox, oz), sector(r0, r1, PHN + Math.PI / 2, PHN + 1.5 * Math.PI), s0, s1, style, { owner, cls, extra: extraB });
    fp(name + ".f", BF(0, ox, oz), sector(r0, r1, PHN - Math.PI / 2, PHN + Math.PI / 2), s0, s1, style, { owner: name + ".b", cls, extra: extraF });
  };
  // un prisma a lo largo de y partido por el mismo plano
  const fpY = (name, ox, oz, poly, s0, s1, style, { owner, cls = "", extraF = "", extraB = "" } = {}) => {
    fp(name + ".b", BF(0, ox, oz), clipHalf(poly, -1), s0, s1, style, { owner, cls, extra: extraB });
    fp(name + ".f", BF(0, ox, oz), clipHalf(poly, 1), s0, s1, style, { owner: name + ".b", cls, extra: extraF });
  };

  /* ---------- el tambor, abierto entre dos planos ---------- */
  /* Entre y0 y y1 se quita la mitad del tambor que mira al lector, con su casco, su revestimiento y su carga: queda la
     mitad de atrás como una artesa con la carga adentro, y en y0 el corte del lado de la descarga, donde se ve la
     sección entera de la carga (el hombro, la cascada y el pie). Los dos bordes de la artesa y el corte de y0 son caras
     de corte; la pieza del lado de la alimentación tapa su propio corte porque mira para el otro lado. */
  const Y0 = W.y0, Y1 = W.y1, TA = PHN + Math.PI / 2, TB = PHN - Math.PI / 2;     // los bordes de la artesa (arriba y abajo)
  const half = [[0, 0]]; for (let i = 0; i <= 24; i++) { const t = TB + (Math.PI * i) / 24; half.push([400 * Math.cos(t), 400 * Math.sin(t)]); }
  const CUTV = A.prism(BF(0), half, Y0, Y1, { name: "cut" });
  const SHELL = record(A.body(AX, [[-L2, R], [-L2, RO], [L2, RO], [L2, R]], { name: "shell", cut: [CUTV] }));
  // lo que se ve por dentro: el borde de arriba de la artesa de y1 a y0, el arco de adelante en y0, el borde de abajo de
  // y0 a y1 y el filo de la pieza de la alimentación en y1
  const visLoop = (n = 32) => {
    const o = [];
    for (let i = 0; i <= n; i++) o.push(pt(TA, R, Y1 - ((Y1 - Y0) * i) / n));
    for (let i = 1; i <= n; i++) o.push(pt(TA - (Math.PI * i) / n, R, Y0));
    for (let i = 1; i <= n; i++) o.push(pt(TB, R, Y0 + ((Y1 - Y0) * i) / n));
    for (let i = 0; i <= n; i++) o.push(pt(TB + (Math.PI * i) / n, RO, Y1));
    return o.map((p) => C.pr(...p));
  };
  const VIS = visLoop(), ELL0 = []; for (let i = 0; i < 72; i++) ELL0.push(C.pr(...pt((i / 72) * Math.PI * 2, R, Y0)));
  // el revestimiento de atrás (la mitad que da la espalda al lector), de la cabeza de la descarga a y1: franjas de tono
  const BAND = (s) => { const b = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < b.length && s >= b[t]) t++; return t; };
  const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + (Math.round(x * 10) / 10) + " " + (Math.round(y * 10) / 10)).join("") + "Z";
  const inner = (() => {
    const by = [[], [], [], [], []], fill = [], nt = 160, a0 = TA, a1 = TA + Math.PI;
    let run = null;
    const flush = (t1) => {
      if (run && run.band >= 0) {
        const m = Math.max(1, Math.ceil((t1 - run.t0) / (Math.PI / 60))), pts = [];
        for (let j = 0; j <= m; j++) pts.push(pt(run.t0 + ((t1 - run.t0) * j) / m, R, -L2));
        for (let j = m; j >= 0; j--) pts.push(pt(run.t0 + ((t1 - run.t0) * j) / m, R, Y1));
        const d = pth1(pts.map((p) => C.pr(...p))); by[run.band].push(d); fill.push(d);
      }
      run = null;
    };
    for (let i = 0; i < nt; i++) {
      const t0 = a0 + ((a1 - a0) * i) / nt, tm = t0 + (a1 - a0) / nt / 2, n = [-Math.cos(tm), 0, -Math.sin(tm)], band = G.dot3(n, C.V) <= 1e-4 ? -1 : BAND(G.dot3(n, C.L));
      if (!run || run.band !== band) { flush(t0); run = { band, t0 }; }
    }
    flush(a1);
    return `<path class="iso-fill" d="${fill.join("")}"/>` + by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (by[4].length ? `<path class="iso-top" d="${by[4].join("")}"/>` : "");
  })();
  // las juntas de las placas del revestimiento: medios anillos cada 45 cm
  const joints = [];
  for (let y = -L2 + 45; y < Y1; y += 45) { const o = []; for (let i = 0; i <= 40; i++) o.push(pt(TA + (Math.PI * i) / 40, R - 0.05, y)); joints.push(path3(o)); }
  // las caras de corte: los dos bordes de la artesa (casco y revestimiento) y la media corona de y0
  const edge = (t, r0, r1) => pth([pt(t, r0, Y0), pt(t, r1, Y0), pt(t, r1, Y1), pt(t, r0, Y1)].map((p) => C.pr(...p)));
  const halfRing = (r0, r1, n = 40) => { const o = []; for (let i = 0; i <= n; i++) o.push(pt(TB + (Math.PI * i) / n, r1, Y0)); for (let i = n; i >= 0; i--) o.push(pt(TB + (Math.PI * i) / n, r0, Y0)); return pth(o.map((p) => C.pr(...p))); };
  const cutSvg = [TA, TB].map((t) => `<path class="ml-cutface" d="${edge(t, RS, RO)}"/><path class="ml-liner" d="${edge(t, R, RS)}"/>`).join("")
    + `<path class="ml-cutface" d="${halfRing(RS, RO)}"/><path class="ml-liner" d="${halfRing(R, RS)}"/>`;
  const shellSvg = S(G.solidOf([[-L2, RO], [Y0, RO]], AX, P, {}), { tone: "mid" })
    + `<clipPath id="mlVis"><path d="${pth(VIS)}"/></clipPath>`
    + `<g clip-path="url(#mlVis)"><path class="ml-dark" d="${pth(VIS)}"/><g class="iso-solid ml-inside">${inner}${Ln(joints.join(""), { tone: "faint" })}</g></g>`
    + cutSvg + S(G.solidOf([[Y1, RO], [L2, RO]], AX, P, {}), { tone: "mid" }) + `<g data-live="bm.bolts"></g>`;
  put("shell", [0, -40, ZA], shellSvg, [SHELL]);
  ENDS.charge = pt(PHN + 1.25 * Math.PI, R * 0.62, (Y0 + Y1) / 2);
  ENDS.sec = pt(-Math.PI / 2, RO + 2, (Y0 + Y1) / 2);

  /* ---------- bridas, cabezas y muñones ---------- */
  [[L2 - 6, L2, "f"], [-L2, -L2 + 6, "d"]].forEach(([s0, s1, nm]) => ringY(`flange.${nm}`, 0, ZA, s0, s1, RO, B.fl, { tone: "mid" }, { owner: "shell", extraF: Dots(G.dotsOf(AX, s1, (RO + B.fl) / 2, 40, P), { size: 0.55 }) }));
  turned("head.f", AX, [[L2, B.fl - 2], [L2 + B.head, B.rt + 8]], { tone: "mid" }, { owner: "flange.f.b", extra: Dots(G.dotsOf(AX, L2 + 8, B.fl - 16, 28, P), { size: 0.5 }) });
  turned("head.d", AX, [[-L2 - B.head, B.rt + 8], [-L2, B.fl - 2]], { tone: "mid" }, { owner: "flange.d.b" });
  ringY("trun.f", 0, ZA, B.tr[0], B.tr[1], 44, B.rt, { tone: "hi" }, { owner: "head.f" });
  ringY("trun.d", 0, ZA, -B.tr[1], -B.tr[0], 44, B.rt, { tone: "hi" }, { owner: "head.d" });

  /* ---------- chumaceras de los muñones sobre sus pedestales ---------- */
  const lowerBrg = (rb, hw, base, foot) => { const o = [[-foot, base], [foot, base], [foot, base + 12], [hw, base + 12], [hw, 0], [rb, 0]]; for (let i = 1; i < 24; i++) { const t = -(Math.PI * i) / 24; o.push([rb * Math.cos(t), rb * Math.sin(t)]); } o.push([-rb, 0], [-hw, 0], [-hw, base + 12], [-foot, base + 12]); return o; };
  const capBrg = (rb, ro) => { const o = [[rb, 0], [ro, 0]]; for (let i = 1; i < 24; i++) { const t = (Math.PI * i) / 24; o.push([ro * Math.cos(t), ro * Math.sin(t)]); } o.push([-ro, 0], [-rb, 0]); for (let i = 23; i > 0; i--) { const t = (Math.PI * i) / 24; o.push([rb * Math.cos(t), rb * Math.sin(t)]); } return o; };
  [[B.brg[0], B.brg[1], "f"], [-B.brg[1], -B.brg[0], "d"]].forEach(([y0, y1, nm]) => {
    const base = -120;
    box(`pier.${nm}`, [-112, y0 - 14, 0], [112, y1 + 14, ZA + base], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
    fpY(`brg.${nm}`, 0, ZA, lowerBrg(B.rt, 90, base, 106), y0, y1, { tone: "mid" }, { owner: `pier.${nm}`, cls: "ml-cast",
      extraF: Dots([[99, y0 + 8], [99, y1 - 8]].map(([x, y]) => at([x, y, ZA + base + 12])), { size: 0.7 }), extraB: Dots([[-99, y0 + 8], [-99, y1 - 8]].map(([x, y]) => at([x, y, ZA + base + 12])), { size: 0.7 }) });
    fpY(`brg.${nm}.cap`, 0, ZA, capBrg(B.rt, 82), y0 + 3, y1 - 3, { tone: "mid" }, { owner: `brg.${nm}.b`, cls: "ml-cast" });
  });
  ENDS.brg = [0, B.brg[1], ZA + 82];

  /* ---------- alimentación: tolva en su estructura y el chute que entra por el muñón ---------- */
  const HZ = ZA + 178;
  box("hop", [-50, 394, HZ], [50, 490, HZ + 60], { tone: "mid" }, { r: 1.2, bevel: 0.6, owner: "hop.leg0", cls: "ml-steel" });
  // la estructura de la tolva: cuatro columnas de 10 × 10 con su placa base y dos travesaños
  [[-50, 394], [40, 394], [40, 480], [-50, 480]].forEach(([x, y], i) => {
    box(`hop.base${i}`, [x - 4, y - 4, 0], [x + 14, y + 14, 2], { tone: "lo" }, { r: 0.4, ground: true });
    box(`hop.leg${i}`, [x, y, 2], [x + 10, y + 10, HZ], { tone: "lo" }, { r: 0.4, owner: `hop.base${i}`, cls: "ml-steel" });
  });
  box("hop.tie0", [-49, 404, HZ - 120], [-43, 480, HZ - 112], { tone: "lo" }, { r: 0.3, owner: "hop.leg0", cls: "ml-steel" });
  box("hop.tie1", [43, 404, HZ - 120], [49, 480, HZ - 112], { tone: "lo" }, { r: 0.3, owner: "hop.leg1", cls: "ml-steel" });
  {
    // el chute baja inclinado de la tolva hasta la boca del muñón y sigue como un pico horizontal por dentro del muñón
    const top = [0, 438, HZ], bot = [0, 378, ZA + 14], d = G.unit3(G.sub3(bot, top)), u = [1, 0, 0], v = G.unit3(G.cross3(d, u)), len = G.len3(G.sub3(bot, top));
    fp("chute", { o: top, a: d, u, v }, [[-17, -17], [17, -17], [17, 17], [-17, 17]], 0, len, { tone: "mid" }, { owner: "hop", cls: "ml-steel" });
    fp("spout", BF(0), [[-14, -14], [14, -14], [14, 14], [-14, 14]], 318, 386, { tone: "mid" }, { owner: "chute", cls: "ml-steel" });
  }
  ENDS.feed = [0, 442, HZ + 60];

  /* ---------- descarga: el trommel en el muñón y su tolva ---------- */
  ring("trommel", AX, -B.tr[1] - 78, -B.tr[1], 40, 52, { tone: "mid" }, { owner: "trun.d.b", cls: "ml-screen" });
  ring("trommel.lip", AX, -B.tr[1] - 82, -B.tr[1] - 78, 40, 57, { tone: "mid" }, { owner: "trommel" });
  K.R_.items.find((it) => it.name === "trommel").svg += `<g data-live="bm.holes"></g>`;
  {
    const y0 = -B.tr[1] - 96, y1 = -B.brg[1] - 16, ztop = ZA - 64, zb = 92;
    const trough = [[-80, ztop], [80, ztop], [28, zb], [-28, zb]];
    fp("dis.hop", BF(0, 0, 0), trough, y0, y1, { tone: "mid" }, { owner: "dis.leg0", cls: "ml-steel" });
    [[-86, y0], [80, y0], [80, y1 - 6], [-86, y1 - 6]].forEach(([x, y], i) => box(`dis.leg${i}`, [x, y, 0], [x + 6, y + 6, ztop], { tone: "lo" }, { r: 0.3, ground: true }));
    fp("dis.spout", BF(0, 0, 0), [[-20, zb], [20, zb], [20, zb - 40], [-20, zb - 40]], (y0 + y1) / 2 - 20, (y0 + y1) / 2 + 20, { tone: "mid" }, { owner: "dis.hop", cls: "ml-steel" });
  }
  ENDS.trommel = pt(0.3, 57, -B.tr[1] - 60);

  /* ---------- la corona, el piñón y el tren de accionamiento ---------- */
  const g = B.gear, gy0 = g.y - g.w / 2, gy1 = g.y + g.w / 2;
  ringY("gear", 0, ZA, gy0, gy1, RO, g.r1, { tone: "mid" }, { owner: "shell", cls: "ml-gear", extraF: `<g data-live="bm.teeth"></g>` + Dots(G.dotsOf(AX, gy1, RO + 12, 36, P), { size: 0.5 }) });
  const pa = B.pin.th * D2R, CD = g.r1 + B.pin.rp, PC = [CD * Math.cos(pa), g.y, ZA + CD * Math.sin(pa)], PA = YA(PC);
  disc("pinion", PA, -g.w / 2, g.w / 2, B.pin.rp, { tone: "mid" }, { owner: "pin.shaft.a", cls: "ml-gear", extra: `<g data-live="bm.pteeth"></g>` });
  const ZB = PC[2] - 52;                                  // la base del tren
  box("drv.base", [PC[0] - 62, -606, 0], [PC[0] + 62, -112, ZB], { tone: "lo" }, { r: 1, ground: true, cls: "ml-conc" });
  // las dos chumaceras del piñón, a cada lado
  const pinBrg = (y0, y1, nm) => {
    fpY(`pin.brg.${nm}`, PC[0], PC[2], lowerBrg(9, 24, -52, 30), y0, y1, { tone: "mid" }, { owner: "drv.base", cls: "ml-cast" });
    fpY(`pin.brg.${nm}.cap`, PC[0], PC[2], capBrg(9, 24), y0 + 2, y1 - 2, { tone: "mid" }, { owner: `pin.brg.${nm}.b`, cls: "ml-cast" });
  };
  pinBrg(-146, -124, "a"); pinBrg(-214, -192, "b");
  disc("pin.shaft.a", PA, g.w / 2, -124 - g.y + 6, 9, { tone: "hi" }, { owner: "pin.brg.a.b" });
  disc("pin.shaft.b", PA, -350 - g.y, -g.w / 2, 9, { tone: "hi" }, { owner: "pin.brg.b.b" });
  // el acople, el reductor y el motor, en línea con el piñón
  disc("cpl.a", PA, -362 - g.y, -350 - g.y, 21, { tone: "mid" }, { owner: "pin.shaft.b", extra: Dots(G.dotsOf(PA, -350 - g.y, 15, 8, P), { size: 0.45 }) });
  disc("cpl.s", PA, -366 - g.y, -362 - g.y, 17, { tone: "lo" }, { owner: "cpl.a" });
  disc("cpl.b", PA, -378 - g.y, -366 - g.y, 21, { tone: "mid" }, { owner: "gb.shaft" });
  disc("gb.shaft", PA, -390 - g.y, -378 - g.y, 9, { tone: "hi" }, { owner: "gb" });
  box("gb", [PC[0] - 44, -462, ZB], [PC[0] + 44, -390, PC[2] + 46], { tone: "mid" }, { r: 4, bevel: 1, owner: "drv.base", cls: "ml-cast" });
  box("gb.cover", [PC[0] - 38, -456, PC[2] + 46], [PC[0] + 38, -396, PC[2] + 52], { tone: "mid" }, { r: 3, owner: "gb", cls: "ml-cast",
    extra: Dots([[-32, -450], [32, -450], [32, -402], [-32, -402]].map(([dx, y]) => at([PC[0] + dx, y, PC[2] + 52])), { size: 0.6 }) });
  disc("gb.breather", ZA_([PC[0] + 18, -414, PC[2] + 52]), 0, 5, 3, { tone: "mid" }, { owner: "gb.cover" });
  box("gb.plate", [PC[0] + 44, -446, PC[2] - 6], [PC[0] + 44.5, -406, PC[2] + 20], { tone: "hi" }, { r: 0.2, owner: "gb",
    extra: (() => { const rows = [0, 1, 2].map((i) => [[PC[0] + 44.5, -442, PC[2] + 15 - 6 * i], [PC[0] + 44.5, -410 - (i === 2 ? 12 : 0), PC[2] + 15 - 6 * i]]); return Ln(rows.map((r) => path3(r)).join(""), { tone: "lo" }) + Dots(rows.flat().map(at), { size: 0.3 }); })() });
  disc("gb.in", PA, -474 - g.y, -462 - g.y, 7, { tone: "hi" }, { owner: "gb" });
  disc("mcpl.a", PA, -482 - g.y, -474 - g.y, 16, { tone: "mid" }, { owner: "gb.in" });
  disc("mcpl.b", PA, -492 - g.y, -484 - g.y, 16, { tone: "mid" }, { owner: "mot.shaft" });
  disc("mot.shaft", PA, -500 - g.y, -492 - g.y, 6, { tone: "hi" }, { owner: "mot" });
  const fins = (() => { const o = []; for (let i = 0; i < 36; i++) { const t = (i / 36) * Math.PI * 2, n = [Math.cos(t), 0, Math.sin(t)]; if (G.dot3(n, C.V) < 0.08) continue; o.push(path3([[PC[0] + 36 * Math.cos(t), -500, PC[2] + 36 * Math.sin(t)], [PC[0] + 36 * Math.cos(t), -586, PC[2] + 36 * Math.sin(t)]])); } return o.join(""); })();
  disc("mot", PA, -586 - g.y, -500 - g.y, 36, { tone: "mid" }, { owner: "mot.feet", cls: "ml-motor", extra: Ln(fins, { tone: "lo" }) });
  disc("mot.fan", PA, -604 - g.y, -586 - g.y, 37, { tone: "mid" }, { owner: "mot", cls: "ml-motor", extra: Dots([...G.dotsOf(PA, -604 - g.y, 28, 18, P, { all: true }), ...G.dotsOf(PA, -604 - g.y, 18, 12, P, { all: true }), ...G.dotsOf(PA, -604 - g.y, 8, 6, P, { all: true })], { size: 0.6 }) });
  box("mot.feet", [PC[0] - 24, -580, ZB], [PC[0] + 24, -506, PC[2] - 36], { tone: "lo" }, { r: 0.8, owner: "drv.base", cls: "ml-cast" });
  box("mot.tbox", [PC[0] - 9, -560, PC[2] + 36], [PC[0] + 9, -536, PC[2] + 50], { tone: "mid" }, { r: 1, owner: "mot", cls: "ml-motor" });
  ENDS.motor = [PC[0], -600, PC[2] + 40];
  ENDS.gear = pt(1.45, g.r1 + 2, g.y);
  ENDS.pinion = [PC[0] + 34, g.y, PC[2]];

  const data = { ends: ENDS, ZA, R, RS, RO, L2, cut: { y0: Y0, y1: Y1, ta: TA, tb: TB }, nv, vis: VIS, ell0: ELL0, gear: { y0: gy0, y1: gy1, r1: g.r1, n: g.teeth }, pin: { c: PC, rp: B.pin.rp, y0: gy0, y1: gy1 }, trommel: { y0: -B.tr[1] - 78, y1: -B.tr[1], r: 52 }, lifters: B.lifters };
  return { data, label: "Molino de bolas en isométrico: tambor con revestimiento y levantadores, abierto entre dos planos para ver la carga; cabezas, muñones en sus chumaceras sobre pedestales de concreto, corona y piñón, acople, reductor y motor, tolva de alimentación y trommel de descarga" };
}
