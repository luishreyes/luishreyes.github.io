/* ====================================================================
   La prensa de tornillo (expulsor) en isométrico (skill anatomy), para el capítulo 18 del libro de operaciones unitarias
   (Filtración, «Apretar para sacar el líquido»): una prensa continua de unos 1000 kg/h de semilla oleaginosa
   acondicionada, sin el cuarto de la jaula que mira al lector y sin la mitad de adelante de la capota, de la bandeja, de
   la tolva y de la canaleta de la torta.
   Concepto: el alimentador vertical empuja las hojuelas calientes a la caja de la entrada. El tornillo las lleva por la
   jaula de barras; su paso se acorta y su núcleo crece hacia la salida, así que el espacio entre los filetes se achica y
   el material se aprieta: suelto a la entrada, cada vez más compacto. Entre cada dos gusanos, un collar y unas cuchillas
   fijas que bajan de la jaula para que el material no gire con el tornillo. El aceite sale por las rendijas entre las
   barras (la jaula es el medio filtrante), gotea a la bandeja y sale por abajo. A la salida, el cono deja una rendija
   anular por donde sale la torta en láminas; el husillo con su volante acerca o aleja el cono y así fija la presión.
   Corte: se quita el cuarto de la jaula, de los bastidores, de la caja de la entrada y del anillo de salida que queda
   arriba y hacia el lector (y > 0, z > ZE), y la mitad de adelante (y > 0) de la capota, la bandeja, la garganta, el
   alimentador, la tolva y la canaleta de la torta. El tornillo, el eje, los collares y el cono no se cortan.
   --detalle: dos barras de la jaula cortadas de través, treinta veces más grandes, con la rendija.
   Uso: node build.mjs [--audit] [--fast] [--detalle]
   Unidades: 1 = 1 mm. Medidas en geo.mjs.
   ==================================================================== */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL("../../../.claude/skills/anatomy", import.meta.url));
const k = await import(KIT + "/kit/iso-kit.mjs");
const G = await import(KIT + "/kit/lathe.mjs");
const { tubePieces, tubeSvg } = await import(KIT + "/kit/tube.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const X = await import(join(HERE, "xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const PT = GEO.PT;
const FAST = process.argv.includes("--fast");
const DET = process.argv.includes("--detalle");
const STEP = Number(process.env.PT_STEP || (DET ? 2 : 0.25));
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};
const ZE = PT.ZE, R = PT.R, RB = PT.R + PT.bar.h, RT = PT.tip, BZ = PT.base.h;
const XEND = PT.worms[PT.worms.length - 1][1], NUT = 46;

/* ---------- las barras de la jaula: en cada cuarto, una barra de cuchillas y once barras, por su ángulo de centro (arco
   medido en el radio del agujero) ---------- */
const BR = PT.bar;
const GAP = ((PI / 2) * R - (BR.kw + BR.nq * BR.w)) / (BR.nq + 1);
const BARS_Q = (() => { const out = [{ c: 0, w: BR.kw, knife: true }]; let s = BR.kw / 2 + GAP; for (let j = 0; j < BR.nq; j++) { out.push({ c: (s + BR.w / 2) / R, w: BR.w }); s += BR.w + GAP; } return out; })();
// la rendija del detalle: la del cuarto de abajo que mira al lector más cerca de −50° (se ve por fuera en la vista entera)
const SLOT = (() => { let best = null; for (let j = 1; j < BARS_Q.length - 1; j++) { const a = -PI / 2 + BARS_Q[j].c, b = -PI / 2 + BARS_Q[j + 1].c, m = (a + b) / 2; if (!best || Math.abs(m + 50 * D2R) < Math.abs(best.m + 50 * D2R)) best = { j, a, b, m }; } return best; })();

/* ---------- la cámara ---------- */
const W_ = DET ? 256 : 1000, H_ = DET ? 256 : 780;
const EXT = [
  [PT.base.x0, -PT.base.y, 0], [PT.base.x1, -PT.base.y, 0], [PT.base.x1, PT.base.y, 0], [PT.base.x0, PT.base.y, 0],
  [PT.belt.x0, 0, PT.motor.z + PT.motor.r + 100], [PT.feeder.x - 420, 0, ZE + PT.feeder.rim + 200], [PT.feeder.x + 420, -420, ZE + PT.feeder.rim],
  [PT.wheel.x + 40, 0, ZE + PT.wheel.r], [PT.wheel.x + 40, PT.wheel.r, ZE], [PT.tray.out.x, PT.tray.out.y1 + 60, PT.tray.out.z],
];
const PMAIN = k.fitProjection(EXT, 1000, 780, { pad: 16, azimuth: PT.AZ, elevation: PT.EL });
// el detalle: dos barras de la jaula, cortadas de través en x = XDET, en el cuarto de abajo que mira al lector
const XDET = 520, PHDET = SLOT.m, RDC = R + 17;
const CDET = [XDET - 4, RDC * Math.cos(PHDET), ZE + RDC * Math.sin(PHDET)];
const MDET = 16, RDET = 120;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: PT.AZ, elevation: PT.EL }; const c = k.iso(CDET, Q); Q.origin = [W_ / 2 - c[0], H_ / 2 - c[1]]; return Q; })() : PMAIN;
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const KS = G.scaleOf(P);
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
const BAND = (s) => { const Bd = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < Bd.length && s >= Bd[t]) t++; return t; };

/* El dibujo va en milímetros; el audit, en centímetros (como el clarificador y el congelador). */
const U = 0.1, CMC = new WeakMap();
function cm(sh) {
  if (!sh || typeof sh !== "object") return sh;
  if (Array.isArray(sh)) return sh.map(cm);
  if (CMC.has(sh)) return CMC.get(sh);
  const sc = (v) => v.map((q) => q * U), out = { ...sh };
  delete out._b; delete out._f;
  if (sh.F) out.F = { ...sh.F, o: sc(sh.F.o) };
  if (sh.kind === "body") out.poly = sh.poly.map(([a, b]) => [a * U, b * U]);
  if (sh.kind === "prism") { out.poly = sh.poly.map(([a, b]) => [a * U, b * U]); out.s0 = sh.s0 * U; out.s1 = sh.s1 * U; }
  if (sh.kind === "box") { out.o = sc(sh.o); out.half = sc(sh.half); }
  if (sh.kind === "ball") { out.o = sc(sh.o); out.r = sh.r * U; }
  if (sh.kind === "tube") { out.points = sh.points.map(sc); out.radii = sh.radii.map((r) => r * U); if (sh.tips) out.tips = sh.tips.map((t) => t && sc(t)); }
  if (sh.cut) out.cut = Array.isArray(sh.cut) ? sh.cut.map(cm) : cm(sh.cut);
  CMC.set(sh, out);
  return out;
}
const PA = { ...P, scale: P.scale / U };
const R_ = A.recorder(PA, { order: [], spring: {} });
// con --detalle solo entra lo que dibuja el detalle (LIVE se enciende al llegar a él)
let LIVE = !DET;
const record = (sh) => { if (LIVE) R_.solid(cm(sh)); return sh; };
const put = (name, ref, svg, shapes = [], rest = {}) => { if (LIVE) R_.put({ piece: "frame", ride: "frame", name, at: ref.map((v) => v * U), svg, shapes: shapes.map(cm), move: [0, 0, 0], ...rest }); };
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);

/* ---------- caras planas ---------- */
const faceSvg = (d, cls) => `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
const cutXZ = (poly, cls, y = 0) => faceSvg(pth1(poly.map(([x, z]) => pr([x, y, z]))), cls);
const cutXY = (poly, cls, z = ZE) => faceSvg(pth1(poly.map(([x, y]) => pr([x, y, z]))), cls);
function flatFace(pts, n, cls = "", edges = true) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return `<g class="iso-solid${cls ? " " + cls : ""}"><path class="iso-fill" d="${d}"/>` + (b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`) + (edges ? `<path class="iso-line iso-edge" data-tone="mid" d="${d}"/>` : "") + "</g>";
}
const rectXZ = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
const ell = (F, s, r, n = 48) => G.circleOf(F, s, r, P, n);

/* ---------- piezas ---------- */
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "pt-ss", cutCls = "pt-cut", r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, shapeCut, ref, pre = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}), ...(shapeCut ? { cut: shapeCut } : {}) }));
  let svg = pre + wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls);
  if (y1 >= -0.01 && y1 <= 0.01 && cutCls) svg += cutXZ(rectXZ(x0, z0, x1, z1), cutCls);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], svg + extra, [shape]);
  return shape;
}
function fp(name, F, poly, s0, s1, { cls = "pt-ss", extra = "", cap = "auto", owner = name, cut = null, ref = null, pre = "", ground } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) });
  const shape = record(sh);
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, pre + X.prismSvg(C, poly, s0, s1, { F, tone: "mid", cls, cap }) + extra, [shape]);
  return sh;
}
const FY = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
const FXs = { o: [0, 0, 0], a: XD, u: YD, v: ZD };
const FZs = { o: [0, 0, 0], a: ZD, u: XD, v: YD };
const FXe = { o: [0, 0, ZE], a: XD, u: YD, v: ZD };
function yCut(name, poly, y0, { cls = "pt-ss", cutCls = "pt-cut", extra = "", owner = name, ref = null, ground, y1 = 0 } = {}) {
  return fp(name, FY, poly, y0, y1, { cls, cap: "none", extra: cutXZ(poly, cutCls) + extra, owner, ref, ground });
}
function disc(name, F, s0, s1, r, { cls = "pt-ss", extra = "", owner = name, n = 0, cut = null, ground, capCls = null, noCap = false, pre = "" } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m + (n === 6 ? PI / 6 : 0); return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  let svg = pre + X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap: capCls || noCap ? "none" : "auto" });
  if (capCls) { const s = Math.max(s0, s1), d = ell(F, s, r, 64); svg += `<g class="iso-solid ${capCls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`; }
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg + extra, [shape]);
  return shape;
}
function turned(name, F, meridian, { cls = "pt-ss", extra = "", owner = name, steps = 48, inner = "", pre = "", shapeCut = null } = {}) {
  const paths = G.lathe(meridian, F, P, { ...(steps ? { steps } : {}) });
  const shape = record(A.lathe(F, meridian, { name, owner, ...(shapeCut ? { cut: shapeCut } : {}) }));
  const s0 = Math.min(...meridian.map((q) => q[0])), s1 = Math.max(...meridian.map((q) => q[0]));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), pre + wrap(S(paths, { tone: "mid", inner }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 300, gaps = [], cls = "", caps = true, ends = [true, true], touch, owner = name } = {}) {
  if (!LIVE) return;
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(4, Math.min(20, r * 0.5)), gaps, caps }).forEach((part, index) => {
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(tubeSvg(part, { tone }), cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
const FZ = (x, y, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });
const FYo = (x, z, y = 0) => ({ o: [x, y, z], a: YD, u: XD, v: ZD });
const FXo = (y, z, x = 0) => ({ o: [x, y, z], a: XD, u: YD, v: ZD });
const bore = (F, s, r, cls = "pt-bore") => `<path class="${cls}" d="${ell(F, s, r, 40)}"/>` + Ln(ell(F, s, r, 40), { tone: "mid" });
const ringOn = (F, s, r0, r1) => `<path class="pt-bore" d="${ell(F, s, r0, 40)}"/>` + Ln(ell(F, s, r0, 40) + ell(F, s, r1, 40), { tone: "mid" });
const boltCircle = (F, s, r, n, phase = 0, from = -Infinity, to = Infinity) => {
  const out = [];
  for (let j = 0; j < n; j++) { const t = phase + (TAU * j) / n; const tt = ((t % TAU) + TAU) % TAU; if (tt < from || tt > to) continue; out.push(at(G.add3(G.add3(F.o, G.mul3(F.a, s)), G.add3(G.mul3(F.u, r * Math.cos(t)), G.mul3(F.v, r * Math.sin(t)))))); }
  return out;
};

/* ---------- semilla ---------- */
let seed = 23;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ====================================================================
   el barrido: una sección (s, r) que gira alrededor de un eje (y avanza a lo largo de él si lleva paso: un filete).
   Se pinta cara por cara, de atrás hacia adelante, como xprism; cada arista se dibuja con la cara visible que va
   después: las del contorno (una cara se ve y la vecina no), las esquinas de la sección y los extremos.
   ==================================================================== */
function sweepSvg({ F, profile, a0, a1, steps = 0, pitch = 0, smooth = [], skip = [], capA = "end", capB = "end", cls = "pt-ss", cutCls = "pt-cut", capLast = false, tone = "mid" }) {
  const m = profile.length;
  const n = steps || Math.max(2, Math.ceil(Math.abs(a1 - a0) / (5 * D2R)));
  const pt = (phi, s, r) => G.add3(G.add3(F.o, G.mul3(F.a, s + (pitch * phi) / TAU)), G.add3(G.mul3(F.u, r * Math.cos(phi)), G.mul3(F.v, r * Math.sin(phi))));
  const phis = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n);
  const Pg = phis.map((phi) => profile.map(([s, r]) => pt(phi, s, r)));
  const sc = profile.reduce((q, p) => q + p[0], 0) / m, rc = profile.reduce((q, p) => q + p[1], 0) / m;
  const faces = [];
  const fid = (i, j) => i * m + j;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    if (skip.includes(j)) { faces.push(null); continue; }
    const j2 = (j + 1) % m, q = [Pg[i][j], Pg[i + 1][j], Pg[i + 1][j2], Pg[i][j2]];
    let nn = G.cross3(G.sub3(q[2], q[0]), G.sub3(q[3], q[1]));
    const cen = q.reduce((a, b) => G.add3(a, b), [0, 0, 0]).map((v) => v / 4);
    const pm = (phis[i] + phis[i + 1]) / 2, c0 = pt(pm, sc, rc);
    if (G.dot3(nn, G.sub3(cen, c0)) < 0) nn = G.mul3(nn, -1);
    nn = G.unit3(nn);
    faces.push({ i, j, q, n: nn, vis: G.dot3(nn, V3) > 1e-6, d: G.dot3(cen, V3) });
  }
  const capOf = (i, mode, sign) => {
    if (mode === "none") return null;
    const pts = Pg[i], cen = pts.reduce((a, b) => G.add3(a, b), [0, 0, 0]).map((v) => v / m);
    const t = G.sub3(pt(phis[i] + sign * 1e-3, sc, rc), pt(phis[i], sc, rc));
    const nn = G.unit3(t);
    return { cap: true, i, pts, n: nn, vis: G.dot3(nn, V3) > 1e-6, d: G.dot3(cen, V3), mode };
  };
  const cA = capOf(0, capA, -Math.sign(a1 - a0)), cB = capOf(n, capB, Math.sign(a1 - a0));
  const vis = (f) => !!(f && f.vis);
  const order = faces.filter(vis).sort((p, q) => p.d - q.d);
  const caps = [cA, cB].filter((c) => c && c.vis);
  const paint = capLast ? [...order, ...caps.sort((p, q) => p.d - q.d)] : [...order, ...caps].sort((p, q) => p.d - q.d);
  const rank = new Map(paint.map((f, r) => [f, r]));
  const edges = new Map(paint.map((f) => [f, []]));
  const later = (a, b) => (!vis(a) ? b : !vis(b) ? a : rank.get(a) > rank.get(b) ? a : b);
  const seg = (p, q) => [p, q];
  // las aristas a lo largo del barrido (en cada vértice j de la sección)
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const fa = faces[fid(i, (j - 1 + m) % m)], fb = faces[fid(i, j)];
    const corner = !smooth.includes(j);
    const draw = vis(fa) !== vis(fb) || (corner && vis(fa) && vis(fb));
    if (draw) edges.get(later(fa, fb)).push(seg(Pg[i][j], Pg[i + 1][j]));
  }
  // las de través (en cada estación i, lado j de la sección)
  for (let i = 0; i <= n; i++) for (let j = 0; j < m; j++) {
    const j2 = (j + 1) % m, e = seg(Pg[i][j], Pg[i][j2]);
    if (i === 0 || i === n) {
      const f = faces[fid(i === 0 ? 0 : n - 1, j)], c = i === 0 ? cA : cB;
      if (!c) continue;                                    // un tramo que sigue en otro: sin arista
      if (vis(c)) edges.get(c).push(e);
      else if (vis(f)) edges.get(f).push(e);
      continue;
    }
    const fa = faces[fid(i - 1, j)], fb = faces[fid(i, j)];
    if (vis(fa) !== vis(fb)) edges.get(later(fa, fb)).push(e);
  }
  const out = [];
  const keyOf = (f) => { if (f.cap && f.mode === "cut") return `<path class="iso-shade" data-shade="0" d="D"/>`; const b = BAND(G.dot3(f.n, L3)); return b >= 4 ? `<path class="iso-top" d="D"/>` : `<path class="iso-shade" data-shade="${b}" d="D"/>`; };
  let runKey = null, runCls = null, runD = [], runE = [];
  const flush = () => { if (runKey !== null) { out.push(`<g class="iso-solid ${runCls}" data-seamless="">` + runKey.replace("D", runD.join("")) + (runE.length ? `<path class="iso-line iso-edge" data-tone="${tone}" d="${runE.join("")}"/>` : "") + "</g>"); } runKey = null; runD = []; runE = []; };
  for (const f of paint) {
    const pts = f.cap ? f.pts : f.q;
    const key = keyOf(f), c2 = f.cap && f.mode === "cut" ? cutCls : cls;
    if (key !== runKey || c2 !== runCls) { flush(); runKey = key; runCls = c2; }
    runD.push(pth1(pts.map(pr)));
    for (const [p, q] of edges.get(f)) { const a = pr(p), b = pr(q); runE.push("M" + r10(a[0]) + " " + r10(a[1]) + "L" + r10(b[0]) + " " + r10(b[1])); }
  }
  flush();
  return out.join("");
}
// la forma de un barrido con paso (un filete), para el audit: un prisma por paso de ángulo
function sweepShapes({ F, profile, a0, a1, pitch = 0, name, owner, step = 6 * D2R }) {
  const n = Math.max(1, Math.ceil(Math.abs(a1 - a0) / step)), out = [];
  const rm = profile.reduce((q, p) => q + p[1], 0) / profile.length;
  for (let i = 0; i < n; i++) {
    const p0 = a0 + ((a1 - a0) * i) / n, p1 = a0 + ((a1 - a0) * (i + 1)) / n, pm = (p0 + p1) / 2;
    const er = G.add3(G.mul3(F.u, Math.cos(pm)), G.mul3(F.v, Math.sin(pm))), et = G.add3(G.mul3(F.u, -Math.sin(pm)), G.mul3(F.v, Math.cos(pm)));
    const o = G.add3(F.o, G.mul3(F.a, (pitch * pm) / TAU));
    const h = (rm * Math.abs(p1 - p0)) / 2;
    out.push(record(A.prism({ o, a: et, u: F.a, v: er }, profile, -h, h, { name: `${name}.${i}`, owner })));
  }
  return out;
}

/* ====================================================================
   1 · la base: dos perfiles en C a lo largo y travesaños donde se apoya cada equipo, con patas niveladoras
   ==================================================================== */
const BS = PT.base;
{
  const cw = 75, t = 9;
  for (const [j, yc] of [[0, -BS.y], [1, BS.y]]) {
    // el perfil en C: alma vertical hacia afuera, alas hacia adentro
    const s = yc < 0 ? 1 : -1, yo = yc;
    const sec = [[yo, 0], [yo + s * cw, 0], [yo + s * cw, t], [yo + s * t, t], [yo + s * t, BZ - t], [yo + s * cw, BZ - t], [yo + s * cw, BZ], [yo, BZ]];
    fp(`base.largo${j}`, FXs, s > 0 ? sec : sec.slice().reverse(), BS.x0, BS.x1, { cls: "pt-paint", owner: "base", ground: true });
  }
  // los travesaños, entre los dos largueros: bajo el motor, el reductor, el soporte de empuje, las sillas, las patas
  // de la bandeja y el soporte del cono
  const cross = [-1360, -860, -620, 25, 300, 700, 1015, 1465];
  for (const [j, xc] of cross.entries()) box(`base.trav${j}`, [xc - 38, -BS.y + 75, 0], [xc + 38, BS.y - 75, BZ], { cls: "pt-paint", owner: "base", ground: true, r: 0.3 });
  // las patas niveladoras bajo los largueros
  for (const xc of [BS.x0 + 110, -700, 600, BS.x1 - 110]) for (const yc of [-BS.y - 40, BS.y + 40]) {
    box(`base.pata.${xc}.${yc}`, [xc - 70, yc - 40, 0], [xc + 70, yc + 40, 14], { cls: "pt-paint", owner: "base", ground: true, extra: Dots([at([xc - 45, yc, 14]), at([xc + 45, yc, 14])], { size: 0.5, tone: "mid" }) });
  }
  ANCH.BASE = [-1000, BS.y, BZ * 0.5];
}

/* ====================================================================
   2 · el reductor (de ejes paralelos: entra arriba, por las correas, y sale a la altura del tornillo), el motor sobre
   el reductor, la guarda de las correas y el soporte del cojinete de empuje
   ==================================================================== */
const GB = PT.gear, ZIN = GB.zin, MT = PT.motor, BT = PT.belt;
{
  // el reductor de engranajes helicoidales: carcasa de fundición con aletas, la línea de la junta, las tapas de los
  // rodamientos y la mirilla del aceite
  const x0 = GB.x0, x1 = GB.x1, y = GB.y;
  const anc = [[x0 - 10, -y - 20], [x1 + 10, -y - 20], [x0 - 10, y + 20], [x1 + 10, y + 20]];
  box("reductor.base", [x0 - 30, -y - 40, BZ], [x1 + 30, y + 40, BZ + 30], { cls: "pt-cast", owner: "reductor", extra: Dots(anc.map(([a, b]) => at([a, b, BZ + 30])), { size: 0.55, tone: "mid" }) });
  // la junta de la carcasa, a la altura del eje de salida: da la vuelta a las esquinas redondeadas
  const seam = k.sideSeam({ x: x0, y: -y, w: x1 - x0, d: 2 * y, r: 12 }, ZE, P, 3);
  const bolts = []; for (let x = x0 + 50; x < x1 - 20; x += 90) bolts.push(at([x, y, ZE + 22]));
  box("reductor", [x0, -y, BZ + 30], [x1, y, GB.z1], { cls: "pt-cast", owner: "reductor", r: 12, steps: 3, inner: seam, extra: Dots(bolts, { size: 0.5, tone: "mid" }) });
  // las aletas del costado que mira al lector
  for (let j = 0; j < 4; j++) { const xa = x0 + 70 + j * 110; box(`reductor.aleta${j}`, [xa, y, BZ + 60], [xa + 22, y + 14, ZE - 60], { cls: "pt-cast", owner: "reductor" }); }
  const Fg = FYo(x0 + 110, BZ + 170, 0);
  disc("reductor.mirilla", Fg, y, y + 12, 30, { cls: "pt-cast", owner: "reductor", extra: `<path class="pt-glass" d="${ell(Fg, y + 12, 19, 32)}"/>` + Ln(ell(Fg, y + 12, 19, 32), { tone: "mid" }) });
  disc("reductor.respiradero", FYo(x1 - 90, GB.z1 - 120, 0), y, y + 40, 16, { cls: "pt-cast", owner: "reductor", n: 6 });
  // las tapas de los rodamientos en la cara de la salida: la del eje intermedio y la de salida, con su retén
  const Fx = FXo(0, ZE, 0), Fi = FXo(0, ZE - 260, 0);
  disc("reductor.tapa.intermedio", Fi, x1, x1 + 16, 95, { cls: "pt-cast", owner: "reductor", extra: Dots(boltCircle(Fi, x1 + 16, 80, 8, PI / 8), { size: 0.45, tone: "mid" }) });
  disc("reductor.tapa.salida", Fx, x1, x1 + 16, 120, { cls: "pt-cast", owner: "reductor", extra: Dots(boltCircle(Fx, x1 + 16, 104, 8, PI / 8), { size: 0.45, tone: "mid" }) });
  disc("reductor.salida", Fx, x1 + 16, PT.thrust.x0, 58, { owner: "reductor" });
  ANCH.REDUCTOR = [x0 + 300, y, BZ + 420];
}
{
  // el motor sobre una placa en la tapa del reductor, con el ventilador hacia la salida y la polea en la guarda
  const rm = MT.r, zm = MT.z, Fm = FXo(0, zm, 0), zp = GB.z1;
  const pd = []; for (const xs of [MT.x0 + 40, MT.x1 - 160]) for (const ys of [-170, 170]) pd.push(at([xs, ys, zp + 20]));
  box("motor.placa", [GB.x0 + 10, -200, zp], [GB.x1 - 10, 200, zp + 20], { cls: "pt-paint", owner: "motor", extra: Dots(pd, { size: 0.5, tone: "mid" }) });
  // (las patas llegan al plano tangente de abajo del cuerpo: así nunca lo tapan)
  for (const [j, xs] of [MT.x0 + 30, MT.x1 - 230].entries()) box(`motor.pata${j}`, [xs, -150, zp + 20], [xs + 90, 150, zm - rm], { cls: "pt-paint", owner: "motor" });
  const fins = G.ribsOf(Fm, MT.x0 + 70, MT.x1 - 140, rm, 26, P, { fade: [0.05, 0.45], seams: true });
  turned("motor", Fm, [[MT.x0, 0], [MT.x0, rm - 40], [MT.x0 + 20, rm - 14], [MT.x0 + 50, rm - 14], [MT.x0 + 70, rm], [MT.x1 - 140, rm], [MT.x1 - 120, rm - 12], [MT.x1 - 80, rm - 12], [MT.x1 - 80, 0]], { cls: "pt-paint", owner: "motor", extra: k.fadedSvg(fins, { tone: "lo" }) });
  // la tapa del ventilador, con la rejilla en la cara del extremo
  const grille = []; for (let r = 22; r < rm - 30; r += 16) grille.push(ell(Fm, MT.x1, r, 40));
  turned("motor.tapa", Fm, [[MT.x1 - 80, 0], [MT.x1 - 80, rm - 18], [MT.x1 - 30, rm - 18], [MT.x1, rm - 48], [MT.x1, 0]], { cls: "pt-paint", owner: "motor", extra: Ln(grille.join(""), { tone: "lo" }) });
  box("motor.bornera", [MT.x0 + 200, -75, zm + rm], [MT.x0 + 330, 75, zm + rm + 85], { cls: "pt-paint", owner: "motor", r: 4, steps: 3 });
  disc("motor.eje", Fm, BT.x1, MT.x0, 30, { owner: "motor" });
  disc("reductor.entrada", FXo(0, ZIN, 0), BT.x1, GB.x0, 45, { owner: "reductor" });
  ANCH.MOTOR = [MT.x0 + 360, rm * 0.55, zm + rm * 0.83];
  // la guarda de las correas: chapa con la forma de las dos poleas, del lado de la entrada
  const sec = [], rA = BT.rIn, rB = BT.rM;
  for (let j = 0; j <= 16; j++) { const a = PI + (PI * j) / 16; sec.push([rA * Math.cos(a), ZIN + rA * Math.sin(a)]); }
  for (let j = 0; j <= 16; j++) { const a = (PI * j) / 16; sec.push([rB * Math.cos(a), zm + rB * Math.sin(a)]); }
  const sv = []; for (let z = ZIN + 40; z < zm - 40; z += 34) sv.push([BT.x0 + 30, rB * 0.55, z]);
  fp("correas.guarda", FXs, sec.reverse(), BT.x0, BT.x1, { cls: "pt-paint", owner: "transmision" });
  ANCH.CORREAS = [BT.x0 + 50, rA * 0.9, (ZIN + zm) / 2];
}
{
  // el soporte del cojinete de empuje, de fundición, con su pie, sus dos tapas y el engrasador
  const T = PT.thrust, F = FXo(0, ZE, 0);
  turned("empuje", F, [[T.x0, 0], [T.x0, T.r - 40], [T.x0 + 30, T.r - 40], [T.x0 + 30, T.r], [T.x1 - 50, T.r], [T.x1 - 50, T.r - 20], [T.x1 - 22, T.r - 20], [T.x1 - 22, T.r + 25], [T.x1, T.r + 25], [T.x1, 0]], { cls: "pt-cast", owner: "empuje", extra: Dots(boltCircle(F, T.x1, T.r + 8, 12, PI / 12), { size: 0.5, tone: "mid" }) });
  disc("empuje.engrasador", FZ(T.x0 + 120, 0, 0), ZE + T.r - 2, ZE + T.r + 30, 8, { owner: "empuje", n: 6, cls: "pt-cast" });
  box("empuje.pie", [T.x0 + 50, -140, BZ], [T.x1 - 60, 140, ZE - T.r], { cls: "pt-cast", owner: "empuje", r: 0.3 });
  ANCH.EMPUJE = [T.x0 + 170, T.r * 0.6, ZE + T.r * 0.8];
}

/* ====================================================================
   3 · la caja de la entrada: un cilindro de fundición con bridas y, bajo la garganta, la mitad de arriba cuadrada, con la
   boca del alimentador. Se quita el cuarto de arriba que mira al lector (y la mitad de adelante de la garganta). El
   alimentador vertical y la tolva van cortados en y = 0.
   ==================================================================== */
const FD = PT.feed, FR = PT.feeder, XF = FR.x, NK = FD.neck;
const BIG = 5000;
const cutBox = (x0, x1, [ya, yb], [za, zb]) => A.box([x0 - 5, ya, za], [x1 + 5, yb, zb], { name: "corte" });
// los sectores de revolución: «atras» (90° a 270°, y < 0), «abajo» (270° a 360°, y > 0 y z < ZE), «cuarto» (0° a 90°)
const SECT = {
  atras: [PI / 2, 1.5 * PI, (x0, x1) => [cutBox(x0, x1, [0, BIG], [-BIG, BIG])]],
  abajo: [1.5 * PI, 2 * PI, (x0, x1) => [cutBox(x0, x1, [-BIG, 0], [-BIG, BIG]), cutBox(x0, x1, [-BIG, BIG], [ZE, BIG])]],
  cuarto: [0, PI / 2, (x0, x1) => [cutBox(x0, x1, [-BIG, 0], [-BIG, BIG]), cutBox(x0, x1, [-BIG, BIG], [-BIG, ZE])]],
  fondo: [PI, 1.5 * PI, (x0, x1) => [cutBox(x0, x1, [0, BIG], [-BIG, BIG]), cutBox(x0, x1, [-BIG, BIG], [ZE, BIG])]],
  // el cuarto de arriba de atrás: lo único que se ve de la mitad de atrás de un anillo que no está en un extremo (el
  // cuarto de abajo de atrás queda encerrado por el material, el tornillo y las barras de adelante)
  arriba: [PI / 2, PI, (x0, x1) => [cutBox(x0, x1, [0, BIG], [-BIG, BIG]), cutBox(x0, x1, [-BIG, BIG], [-BIG, ZE])]],
  // para un eje vertical (u = x, v = y): la mitad que mira al lector
  frente: [0, PI, () => [cutBox(-BIG, BIG, [-BIG, 0], [-BIG, BIG])]],
};
// un anillo (o una pieza de revolución con una sección cualquiera) en sectores: cada sector es su propio elemento
function revSectors(name, profile, which, { cls = "pt-cast", cutCls = "pt-cut-c", owner = name, extra = {}, skip = [], open = [] } = {}) {
  const x0 = Math.min(...profile.map((q) => q[0])), x1 = Math.max(...profile.map((q) => q[0]));
  const rmax = Math.max(...profile.map((q) => q[1]));
  for (const w of which) {
    const [a0, a1, cuts] = SECT[w];
    // los extremos del sector que caen en un plano de corte llevan su cara cortada; los demás siguen en otro sector
    const capA = open.includes(`${w}:a`) ? "none" : w === "abajo" || w === "cuarto" ? "none" : "cut";
    const capB = open.includes(`${w}:b`) ? "none" : w === "atras" || w === "fondo" || w === "arriba" ? "none" : "cut";
    const svg = sweepSvg({ F: FXe, profile, a0, a1, cls, cutCls, capA, capB, capLast: true, skip, steps: Math.max(4, Math.round((a1 - a0) / (7.5 * D2R))) });
    const am = (a0 + a1) / 2;
    const sh = record(A.lathe(FXe, profile, { name: `${name}.${w}`, owner, cut: cuts(x0, x1) }));
    put(`${name}.${w}`, [(x0 + x1) / 2, rmax * 0.7 * Math.cos(am), ZE + rmax * 0.7 * Math.sin(am)], svg + (extra[w] || ""), [sh]);
  }
}
const ring = (x0, x1, ri, ro) => [[x0, ri], [x1, ri], [x1, ro], [x0, ro]];
// una pieza de revolución del tornillo de la que solo se ve el cuarto de arriba que mira al lector (lo demás va dentro
// del material): la sección empieza en el eje, con el lado del eje primero
function quarterRev(name, profile, { cls = "pt-ss", owner = name, F = FXe, which = "cuarto" } = {}) {
  const [a0, a1, cuts] = SECT[which];
  const x0 = Math.min(...profile.map((q) => q[0])), x1 = Math.max(...profile.map((q) => q[0])), rmax = Math.max(...profile.map((q) => q[1]));
  const svg = sweepSvg({ F, profile, a0, a1, cls, capA: "none", capB: "none", skip: [0], steps: 18 });
  const mer = [[x0, 0], [x0, profile[3][1]], [x1, profile[2][1]], [x1, 0]];
  const sh = record(A.lathe(F, mer, { name, owner, cut: cuts(x0, x1) }));
  const am = (a0 + a1) / 2;
  put(name, G.add3(G.add3(F.o, G.mul3(F.a, (x0 + x1) / 2)), G.add3(G.mul3(F.u, rmax * 0.7 * Math.cos(am)), G.mul3(F.v, rmax * 0.7 * Math.sin(am)))), svg, [sh]);
}
{
  const ri = R, ro = FD.ro, xa = FD.x0 + FD.flT, xb = FD.x1 - FD.flT;
  // las bridas y los dos tramos sin garganta, en tres cuartos; bajo la garganta, la mitad de abajo
  revSectors("entrada.brida0", ring(FD.x0, xa, ri, FD.flR), ["arriba", "abajo"], { owner: "entrada" });
  revSectors("entrada.caja0", ring(xa, NK.x0, ri, ro), ["arriba", "abajo"], { owner: "entrada" });
  revSectors("entrada.caja1", ring(NK.x0, NK.x1, ri, ro), ["abajo"], { owner: "entrada" });
  revSectors("entrada.caja2", ring(NK.x1, xb, ri, ro), ["arriba", "abajo"], { owner: "entrada" });
  revSectors("entrada.brida1", ring(xb, FD.x1, ri, FD.flR), ["arriba", "abajo"], { owner: "entrada" });
  // la mitad de arriba cuadrada bajo la garganta: a los lados de la boca, la sección en L sin el cuarto del agujero; en la
  // boca, solo la pared de atrás
  const L = [[0, ZE + ri], [0, ZE + ro], [-ro, ZE + ro], [-ro, ZE]];
  for (let j = 0; j <= 12; j++) { const a = PI - (PI / 2) * (j / 12); L.push([ri * Math.cos(a), ZE + ri * Math.sin(a)]); }
  const segs = [[NK.x0, XF - FR.ri, L], [XF - FR.ri, XF + FR.ri, [[-FR.ri, ZE], [-FR.ri, ZE + ro], [-ro, ZE + ro], [-ro, ZE]]], [XF + FR.ri, NK.x1, L]];
  segs.forEach(([a, b, sec], j) => {
    const cut = sec === L ? cutXZ(rectXZ(a, ZE + ri, b, ZE + ro), "pt-cut-c") : "";
    fp(`entrada.alta${j}`, FXs, sec, a, b, { cls: "pt-cast", owner: "entrada", extra: cut });
  });
  // la brida de la garganta, con la media boca redonda del alimentador
  const z0 = ZE + ro, z1 = z0 + NK.t, hole = [];
  for (let j = 0; j <= 24; j++) { const a = PI + (PI * j) / 24; hole.push([XF + FR.ri * Math.cos(a), FR.ri * Math.sin(a)]); }
  const plan = [[NK.x0, 0], [NK.x0, -NK.y], [NK.x1, -NK.y], [NK.x1, 0], ...hole.reverse()];
  const bb = Dots([[NK.x0 + 22, -NK.y + 22], [NK.x1 - 22, -NK.y + 22]].map(([x, y]) => at([x, y, z1])), { size: 0.5, tone: "mid" });
  fp("entrada.garganta", FZs, plan, z0, z1, { cls: "pt-cast", owner: "entrada", extra: cutXZ(rectXZ(NK.x0, z0, XF - FR.ri, z1), "pt-cut-c") + cutXZ(rectXZ(XF + FR.ri, z0, NK.x1, z1), "pt-cut-c") + bb });
  ANCH.CAJA = [FD.x0 + 140, ro * Math.cos(-40 * D2R), ZE + ro * Math.sin(-40 * D2R)];
}
{
  // el tubo del alimentador, la tolva cónica y su borde: la mitad de atrás
  const Fv = { o: [XF, 0, 0], a: ZD, u: XD, v: YD };
  const shell = (name, prof, z0, z1) => {
    const svg = sweepSvg({ F: Fv, profile: prof, a0: PI, a1: TAU, smooth: [], cls: "pt-ss", cutCls: "pt-cut", capA: "cut", capB: "cut", capLast: true });
    put(name, [XF, -200, (z0 + z1) / 2], svg, [record(A.lathe(Fv, prof.concat(), { name, owner: "tolva", cut: cutBox(XF - BIG, XF + BIG, [0, BIG], [-BIG, BIG]) }))]);
  };
  const zt0 = ZE + FR.z0, zt1 = ZE + FR.z1, zc1 = ZE + FR.cone.z1, zr = ZE + FR.rim;
  shell("alimentador.brida0", [[zt0, FR.ri], [zt0 + 20, FR.ri], [zt0 + 20, FR.ro + 40], [zt0, FR.ro + 40]], zt0, zt0 + 20);
  shell("alimentador.tubo", [[zt0 + 20, FR.ri], [zt1 - 20, FR.ri], [zt1 - 20, FR.ro], [zt0 + 20, FR.ro]], zt0, zt1);
  shell("alimentador.brida1", [[zt1 - 20, FR.ri], [zt1, FR.ri], [zt1, FR.ro + 40], [zt1 - 20, FR.ro + 40]], zt1 - 20, zt1);
  const t = 4, cr1 = FR.cone.r1;
  shell("tolva.cono", [[zt1, FR.ri], [zc1, cr1 - t], [zc1, cr1], [zt1, FR.ri + t + 40]], zt1, zc1);
  shell("tolva.borde", [[zc1, cr1 - t], [zr, cr1 - t], [zr, cr1 + 30], [zr - 20, cr1 + 30], [zr - 20, cr1], [zc1, cr1]], zc1, zr);
  ANCH.TOLVA = [XF - cr1 * 0.75, -cr1 * 0.66, (zc1 + zr) / 2 - 40];
  ANCH.ALIMENTADOR_TUBO = [XF - FR.ro, -10, (zt0 + zt1) / 2];
}

/* ====================================================================
   4 · la jaula: cuatro bastidores (anillos de fundición), tres tramos de barras planas de 12 × 30 mm con una barra de
   cuchillas de 20 mm en cada cuarto (a 0°, 90°, 180° y 270°), y tres tirantes. Se ven el cuarto de abajo que mira al
   lector (por fuera, con el aceite que sale entre las barras) y, arriba, las de atrás que asoman sobre el corte.
   ==================================================================== */
const SECTIONS = PT.frames.slice(0, -1).map((f, j) => [f[1], PT.frames[j + 1][0]]);
const COLL = PT.collars;
// la sección de una barra (en u = tangente, v = radio), entera o la mitad
const barPoly = (w, half = 0) => (half < 0 ? [[-w / 2, R], [0, R], [0, RB], [-w / 2, RB]] : half > 0 ? [[0, R], [w / 2, R], [w / 2, RB], [0, RB]] : [[-w / 2, R], [w / 2, R], [w / 2, RB], [-w / 2, RB]]);
const barFrame = (phi, x0) => ({ o: [x0, 0, ZE], a: XD, u: [0, -Math.sin(phi), Math.cos(phi)], v: [0, Math.cos(phi), Math.sin(phi)] });
const OILBAR = [];       // las rendijas donde se ve salir el aceite (para las gotas)
{
  SECTIONS.forEach(([x0, x1], si) => {
    // el cuarto de abajo que mira al lector: de −90° (abajo) a 0° (adelante); la barra de cuchillas de 0° va partida
    // por el plano z = ZE (queda la mitad de abajo) y su cara cortada se ve en ese plano
    const lst = [];
    for (const b of BARS_Q) lst.push({ phi: -PI / 2 + b.c, w: b.w, knife: b.knife });
    lst.push({ phi: 0, w: BR.kw, knife: true, half: -1 });
    // las de atrás, de 90° (partida por y = 0: queda la mitad de atrás) a unos 160°
    const back = [{ phi: PI / 2, w: BR.kw, knife: true, half: 1 }, ...BARS_Q.slice(1).filter((b) => b.c < 1.25).map((b) => ({ phi: PI / 2 + b.c, w: b.w }))];
    const draw = (list, nm) => {
      const shapes = [];
      const svgs = list.map((b) => {
        const F = barFrame(b.phi, 0), poly = barPoly(b.w, b.half || 0);
        shapes.push(record(A.prism(F, poly, x0, x1, { name: `${nm}.${shapes.length}`, owner: "jaula" })));
        const mid = G.add3(F.o, G.add3(G.mul3(F.a, (x0 + x1) / 2), G.mul3(F.v, (R + RB) / 2)));
        return { d: G.dot3(mid, V3), svg: X.prismSvg(C, poly, x0, x1, { F, tone: "mid", cls: "pt-bar", cap: "auto" }) };
      }).sort((p, q) => p.d - q.d);
      return { shapes, svg: svgs.map((q) => q.svg).join("") };
    };
    const fb = draw(lst, `barras${si}.adelante`);
    // el aceite que sale por las rendijas de afuera: gotitas en la boca de cada rendija, más hacia abajo
    let oil = "";
    const slots = [];
    for (let j = 0; j < lst.length - 1; j++) {
      const a = lst[j], b = lst[j + 1];
      if (b.phi <= a.phi || a.half || b.half) continue;
      slots.push((a.phi + b.phi) / 2);
    }
    slots.sort((p, q) => p - q);
    for (const ph of slots) {
      if (ph > -8 * D2R) continue;
      const er = [0, Math.cos(ph), Math.sin(ph)], low = (-ph - 8 * D2R) / (82 * D2R);
      const nb = 2 + Math.round(5 * low);
      for (let q = 0; q < nb; q++) {
        const x = x0 + 18 + rnd() * (x1 - x0 - 36), rr = RB + 1.2;
        const p0 = [x, rr * er[1], ZE + rr * er[2]];
        const c = at(p0), w = (2.2 + 2.6 * rnd() * low) * KS;
        oil += `<ellipse class="pt-oil-drop" cx="${r10(c[0])}" cy="${r10(c[1])}" rx="${r10(Math.max(0.9, w * 0.55))}" ry="${r10(Math.max(1.1, w * 0.8))}"/>`;
      }
      if (ph < -60 * D2R) OILBAR.push({ si, ph });
    }
    put(`barras${si}.adelante`, [(x0 + x1) / 2, (R + RB) * 0.5, ZE - (R + RB) * 0.5], fb.svg + oil, fb.shapes);
    const bb = draw(back, `barras${si}.atras`);
    put(`barras${si}.atras`, [(x0 + x1) / 2, -(R + RB) * 0.3, ZE + (R + RB) * 0.9], bb.svg, bb.shapes);
    // las caras cortadas de las barras de cuchillas, con los dientes que bajan al collar de cada gusano
    const teeth = COLL.slice(1).filter(([a, b]) => a >= x0 && b <= x1);
    const knifePoly = (pl) => {
      const pts = [[x0, RB], [x1, RB], [x1, R]];
      for (const [a, b, rc] of teeth.slice().reverse()) pts.push([b - 6, R], [b - 6, rc + 4], [a + 6, rc + 4], [a + 6, R]);
      pts.push([x0, R]);
      return pts;
    };
    const kp = knifePoly();
    // arriba (y = 0): la mitad de atrás de la barra de 90°
    fp(`cuchillas${si}.arriba`, FY, kp.map(([x, rr]) => [x, ZE + rr]), -BR.kw / 2, 0, { cls: "pt-bar", cap: "none", owner: "jaula", extra: cutXZ(kp.map(([x, rr]) => [x, ZE + rr]), "pt-cut") });
    // adelante (z = ZE): la mitad de abajo de la barra de 0°
    const Fh = { o: [0, 0, ZE], a: ZD, u: XD, v: YD };
    fp(`cuchillas${si}.adelante`, Fh, kp, -BR.kw / 2, 0, { cls: "pt-bar", cap: "none", owner: "jaula", extra: cutXY(kp, "pt-cut") });
    if (si === 1) { const [a, b, rc] = teeth[0]; ANCH.CUCHILLA = [(a + b) / 2, 0, ZE + (rc + R) / 2 + 6]; }
  });
  ANCH.BARRAS = [SECTIONS[0][0] + 120, RB * Math.cos(-14 * D2R), ZE + RB * Math.sin(-14 * D2R)];
  ANCH.ACEITE_RENDIJA = [SECTIONS[0][0] + 140, (RB + 2) * Math.cos(-62 * D2R), ZE + (RB + 2) * Math.sin(-62 * D2R)];
}
{
  // los bastidores: anillos de fundición en tres cuartos, con su cara cortada en y = 0 y en z = ZE
  PT.frames.forEach(([x0, x1], j) => revSectors(`bastidor${j}`, ring(x0, x1, R, PT.frameR), [j === PT.frames.length - 1 ? "atras" : "arriba", "abajo"], { owner: "jaula" }));
  ANCH.BASTIDOR = [PT.frames[1][0] + 25, PT.frameR * Math.cos(-62 * D2R), ZE + PT.frameR * Math.sin(-62 * D2R)];
  // los tirantes, de bastidor a bastidor, con sus tuercas por fuera de los extremos
  const T = PT.tie;
  for (const a of T.angs) {
    const ph = a * D2R, y = T.r * Math.cos(ph), z = ZE + T.r * Math.sin(ph), F = FXo(y, z, 0);
    const xs = PT.frames.map((f) => f), xe0 = xs[0][0] - 26, xe1 = xs[3][1] + 26;
    // el tirante en tramos entre bastidores
    // el de abajo atrás (225°) solo se ve junto al último bastidor: lo demás queda tras la jaula
    const hidden = a > 180 && a < 270;
    for (let q = hidden ? 2 : 0; q < 3; q++) disc(`tirante${a}.${q}`, F, xs[q][1], xs[q + 1][0], T.rr, { owner: "jaula", cls: "pt-ss", n: 16 });
    disc(`tirante${a}.tuerca1`, F, xs[3][1], xs[3][1] + 22, T.nut, { owner: "jaula", cls: "pt-cast", n: 6, extra: `<path class="pt-bore" d="${ell(F, xs[3][1] + 22, T.rr, 16)}"/>` });
    disc(`tirante${a}.punta1`, F, xs[3][1] + 22, xe1, T.rr, { owner: "jaula", cls: "pt-ss", n: 16 });
    if (!hidden) disc(`tirante${a}.tuerca0`, F, xs[0][0] - 22, xs[0][0], T.nut, { owner: "jaula", cls: "pt-cast", n: 6 });
    void xe0;
  }
  ANCH.TIRANTE = (() => { const ph = 315 * D2R; return [520, T.r * Math.cos(ph), ZE + T.r * Math.sin(ph) + T.rr]; })();
}
{
  // los soportes de la jaula: una silla bajo el primer bastidor y otra bajo el último, sobre los travesaños de la base
  for (const [j, [x0, x1]] of [[0, PT.frames[0]], [1, PT.frames[3]]]) {
    const xa = x0 + 6, xb = x1 - 6, w = 130, zc = ZE;
    const sec = [[-w, BZ], [w, BZ], [w, zc - Math.sqrt(PT.frameR ** 2 - w * w)]];
    for (let q = 0; q <= 16; q++) { const yy = w - (2 * w * q) / 16; sec.push([yy, zc - Math.sqrt(PT.frameR ** 2 - yy * yy)]); }
    sec.push([-w, zc - Math.sqrt(PT.frameR ** 2 - w * w)]);
    fp(`silla${j}`, FXs, sec, xa, xb, { cls: "pt-paint", owner: "base" });
  }
}

/* ====================================================================
   5 · el tornillo: el eje con los gusanos (núcleo que crece, paso que se acorta) y los collares entre ellos. No se
   corta: se ve entero el cuarto de arriba que mira al lector; lo demás queda dentro del material.
   ==================================================================== */
const WS = PT.worms, FL = PT.flight;
// el filete de cada gusano: su ángulo de arranque sigue el del anterior
const FLIGHTS = [];
{
  let phi = 0.35 * PI;
  WS.forEach(([x0, x1, p, rr], i) => {
    const xa = x0 + FL.tRoot / 2 + 3, xb = x1 - FL.tRoot / 2 - 3;
    const span = (TAU * (xb - xa)) / p;
    FLIGHTS.push({ i, x0, x1, p, rr, xa, xb, a0: phi, a1: phi + span });
    const next = WS[i + 1];
    if (next) { const xa2 = next[0] + FL.tRoot / 2 + 3; phi = phi + span + (TAU * (xa2 - xb)) / ((p + next[2]) / 2); }
  });
}
const xFlight = (f, phi) => f.xa + (f.p * (phi - f.a0)) / TAU;
{
  // los núcleos (cubos) de los gusanos y los collares, como piezas de revolución sobre el eje
  const F = FXe;
  WS.forEach(([x0, x1, p, rr], i) => quarterRev(`gusano${i}.nucleo`, [[x0, 0], [x1, 0], [x1, rr], [x0, rr]], { cls: "pt-ss", owner: "tornillo" }));
  COLL.forEach(([x0, x1, rc], j) => quarterRev(`collar${j}`, [[x0, 0], [x1, 0], [x1, rc], [x0, rc]], { cls: "pt-cast", owner: "tornillo" }));
  // la punta del eje con su tuerca, en el hueco del cono
  quarterRev("eje.tuerca", [[WS[WS.length - 1][1], 0], [WS[WS.length - 1][1] + 22, 0], [WS[WS.length - 1][1] + 22, NUT], [WS[WS.length - 1][1], NUT]], { cls: "pt-cast", owner: "tornillo" });
  // el eje entre el soporte de empuje y la caja de la entrada
  disc("eje.entrada", F, PT.thrust.x1, FD.x0 + 10, PT.shaft + 18, { owner: "tornillo" });
  ANCH.NUCLEO = [WS[5][0] + 30, WS[5][3] * Math.cos(30 * D2R), ZE + WS[5][3] * Math.sin(30 * D2R)];
  ANCH.COLLAR = [(COLL[3][0] + COLL[3][1]) / 2, COLL[3][2] * Math.cos(20 * D2R), ZE + COLL[3][2] * Math.sin(20 * D2R)];
}
{
  // los filetes: de cada vuelta se dibuja el cuarto que se ve (0° a 90°), en tramos que parten donde el núcleo deja de
  // tapar el filete
  const prof = (rr) => [[-FL.tRoot / 2, rr], [FL.tRoot / 2, rr], [FL.tTip / 2, RT], [-FL.tTip / 2, RT]];
  for (const f of FLIGHTS) {
    const F = { o: [f.xa - (f.p * f.a0) / TAU, 0, ZE], a: XD, u: YD, v: ZD };
    const kmin = Math.floor(f.a0 / TAU) - 1, kmax = Math.ceil(f.a1 / TAU) + 1;
    for (let kk = kmin; kk <= kmax; kk++) {
      const lo = Math.max(f.a0, kk * TAU), hi = Math.min(f.a1, kk * TAU + PI / 2);
      if (hi - lo < 1e-3) continue;
      const nm = `filete${f.i}.${kk}`;
      const svg = sweepSvg({ F, profile: prof(f.rr), a0: lo, a1: hi, pitch: f.p, skip: [0], smooth: [], cls: "pt-ss", capA: "end", capB: "end" });
      const sh = sweepShapes({ F, profile: prof(f.rr), a0: lo, a1: hi, pitch: f.p, name: nm, owner: "tornillo" });
      const pm = (lo + hi) / 2;
      put(nm, [xFlight(f, pm), ((f.rr + RT) / 2) * Math.cos(pm), ZE + ((f.rr + RT) / 2) * Math.sin(pm)], svg, sh);
    }
  }
  const f = FLIGHTS[2], pm = Math.ceil(f.a0 / TAU) * TAU + 0.35;
  ANCH.FILETE = [xFlight(f, pm) + FL.tTip / 2, RT * Math.cos(pm), ZE + RT * Math.sin(pm)];
  const f0 = FLIGHTS[0], p0 = Math.ceil(f0.a0 / TAU) * TAU + TAU + 0.6;
  ANCH.GUSANO_ENTRADA = [xFlight(f0, p0) + FL.tTip / 2, RT * Math.cos(p0), ZE + RT * Math.sin(p0)];
}

/* ====================================================================
   6 · el material: las hojuelas en las dos caras del corte, entre los filetes (y = 0 arriba, z = ZE adelante). Sueltas a
   la entrada (hojuelas con huecos), cada vez más apretadas (más chatas, sin huecos, más oscuras) y, en el último
   tramo, una torta compacta con aceite contra las barras. Las hojuelas van más grandes que las reales.
   ==================================================================== */
const rootAt = (x) => { for (const [a, b, rc] of COLL) if (x >= a && x <= b) return rc; for (const [a, b, , rr] of WS) if (x >= a && x <= b) return rr; return 0; };
const SEAT = PT.seat, CN = PT.cone, SLOPE = (SEAT.r1 - SEAT.r0) / (SEAT.x1 - SEAT.x0);
const rSeat = (x) => SEAT.r0 + SLOPE * (x - SEAT.x0);
const OFF = CN.gap / Math.cos(Math.atan(SLOPE));
const rCone = (x) => rSeat(x) - OFF;
// la silueta del material en una cara: theta = π/2 (arriba, y = 0) o 0 (adelante, z = ZE); en (x, ρ)
function combPoly(theta) {
  const top = [], bot = [];
  const x0 = FD.x0 + 18;
  // por arriba: el agujero de la jaula, con las cuchillas que bajan en cada collar del tramo de barras
  top.push([x0, R]);
  for (const [a, b, rc] of COLL.slice(1)) top.push([a + 6, R], [a + 6, rc + 4], [b - 6, rc + 4], [b - 6, R]);
  top.push([SEAT.x0, R], [SEAT.x1, rSeat(SEAT.x1)], [SEAT.x1, rCone(SEAT.x1)], [CN.x0, rCone(CN.x0)], [CN.x0, NUT], [XEND, NUT]);
  // por abajo, de la salida a la entrada: los núcleos, los collares y los dientes de cada filete que cruza la cara
  const cross = [];
  for (const f of FLIGHTS) for (let kk = Math.floor(f.a0 / TAU) - 1; kk <= Math.ceil(f.a1 / TAU) + 1; kk++) { const ph = kk * TAU + theta; if (ph >= f.a0 && ph <= f.a1) cross.push({ x: xFlight(f, ph), rr: f.rr }); }
  cross.sort((p, q) => q.x - p.x);
  const steps = [...WS.flatMap(([a, b]) => [a, b]), ...COLL.flatMap(([a, b]) => [a, b])].filter((x) => x > x0 && x < XEND).sort((p, q) => q - p);
  bot.push([XEND, rootAt(XEND - 0.5)]);
  const marks = [...steps.map((s) => ({ s, kind: "step" })), ...cross.map((c) => ({ s: c.x, kind: "flight", c }))].sort((p, q) => q.s - p.s);
  for (const m of marks) {
    if (m.kind === "step") { const xs = m.s; bot.push([xs, rootAt(xs + 0.5)], [xs, rootAt(xs - 0.5)]); }
    else { const { x: xc, rr } = m.c; bot.push([xc + FL.tRoot / 2, rr], [xc + FL.tTip / 2, RT], [xc - FL.tTip / 2, RT], [xc - FL.tRoot / 2, rr]); }
  }
  bot.push([x0, rootAt(x0 + 0.5)]);
  return [...top, ...bot];
}
// recorte de un polígono por una franja de x (Sutherland–Hodgman)
function clipX(poly, xa, xb) {
  const clip = (pts, inside, cross) => { const out = []; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length], ip = inside(p), iq = inside(q); if (ip) out.push(p); if (ip !== iq) out.push(cross(p, q)); } return out; };
  const at_ = (xv) => (p, q) => [xv, p[1] + ((q[1] - p[1]) * (xv - p[0])) / (q[0] - p[0])];
  return clip(clip(poly, (p) => p[0] >= xa, at_(xa)), (p) => p[0] <= xb, at_(xb));
}
const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const ZONES = [[FD.x0 + 18, 20, 0], [20, 231, 0.2], [231, 427, 0.4], [427, 608, 0.6], [608, 774, 0.75], [774, 925, 0.88], [925, SEAT.x1 + 1, 1]];
const BASEC = (c) => (c < 0.3 ? "pt-void" : c < 0.55 ? "pt-mat2" : c < 0.85 ? "pt-mat1" : "pt-mat0");
// las hojuelas de una cara: (x, ρ) → punto del mundo
function flakesIn(poly, xa, xb, c, toW, { scale = 1, dens = 1 } = {}) {
  const list = [];
  const len = (14 - 5 * c) * scale, thick = Math.max(2.2, (6 - 4.2 * c)) * scale;
  const cover = (0.5 + 0.45 * Math.min(1, c / 0.4)) * dens;
  const ymin = Math.min(...poly.map((p) => p[1])), ymax = Math.max(...poly.map((p) => p[1]));
  const area = (xb - xa) * (ymax - ymin) * 0.75;
  const want = Math.round((area * cover) / (len * thick * 0.8));
  for (let t = 0; t < want * 25 && list.length < want; t++) {
    const x = xa + rnd() * (xb - xa), y = ymin + rnd() * (ymax - ymin);
    const ang = (rnd() - 0.5) * (c < 0.3 ? 2.4 : 0.6), L = len * (0.7 + 0.5 * rnd()), T = thick * (0.7 + 0.5 * rnd());
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const ends = [[L / 2, 0], [-L / 2, 0], [0, T / 2], [0, -T / 2]].map(([u, v]) => [x + u * ca - v * sa, y + u * sa + v * ca]);
    if (!ends.every(([a, b]) => inPoly(poly, a, b) && a > xa - 2 && a < xb + 2)) continue;
    if (list.some((q) => Math.hypot(q.x - x, (q.y - y) * 1.6) < (q.L + L) * 0.42)) continue;
    list.push({ x, y, L, T, ang });
  }
  return list.map(({ x, y, L, T, ang }) => {
    const ca = Math.cos(ang), sa = Math.sin(ang), pts = [];
    for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU, u = (L / 2) * Math.cos(a), v = (T / 2) * Math.sin(a) * (0.85 + 0.3 * ((i * 7) % 3) / 2); pts.push(toW([x + u * ca - v * sa, y + u * sa + v * ca])); }
    return pth1(pts.map(pr));
  }).join("");
}
function materialFace(name, theta) {
  const poly = combPoly(theta);
  const toW = theta > 0.1 ? ([x, rr]) => [x, 0, ZE + rr] : ([x, rr]) => [x, rr, ZE];
  const facePath = (pp) => pth1(pp.map((q) => pr(toW(q))));
  let svg = "";
  for (const [xa, xb, c] of ZONES) {
    const part = clipX(poly, xa, xb);
    if (part.length < 3) continue;
    svg += `<path class="${BASEC(c)}" d="${facePath(part)}"/>`;
    if (c < 0.55) svg += `<path class="pt-hoj" d="${flakesIn(part, xa, xb, c, toW)}"/>`;
    else svg += `<path class="pt-lam" d="${flakesIn(part, xa, xb, c, toW, { scale: 1.3, dens: 0.28 - 0.18 * c })}"/>`;
    // el aceite que sale contra las barras, en los tramos donde ya se aprieta
    if (c >= 0.4) {
      const kn = COLL.slice(1).map(([a, b]) => [a + 6, b - 6]);
      let xs = [Math.max(xa, SEAT.x0 > xb ? xa : xa)];
      const runs = []; let cur = xa;
      for (const [a, b] of kn) if (b > xa && a < xb) { if (a > cur) runs.push([cur, a]); cur = b; }
      if (cur < Math.min(xb, SEAT.x0)) runs.push([cur, Math.min(xb, SEAT.x0)]);
      void xs;
      for (const [a, b] of runs) if (b - a > 4) svg += `<path class="pt-oil" d="${facePath([[a, R - 2.6], [b, R - 2.6], [b, R], [a, R]])}"/>`;
    }
  }
  svg += `<path class="iso-line iso-edge pt-mat-edge" data-tone="mid" d="${facePath(poly)}"/>`;
  const Fs = theta > 0.1 ? FY : { o: [0, 0, ZE], a: ZD, u: XD, v: YD };
  const polyW = theta > 0.1 ? poly.map(([x, rr]) => [x, ZE + rr]) : poly;
  const sh = record(A.prism(Fs, polyW, -0.3, 0, { name, owner: "material" }));
  put(name, theta > 0.1 ? [300, 0, ZE + 80] : [300, 80, ZE], svg, [sh]);
  return poly;
}
const POLY_V = materialFace("material.arriba", PI / 2);
const POLY_H = materialFace("material.adelante", 0);
ANCH.SUELTO = [-330, 0, ZE + 82];
ANCH.APRETADO = [860, 0, ZE + 92];
ANCH.ACEITE_FILM = [500, R - 1.3, ZE];
ANCH.TORTA_ANILLO = [SEAT.x0 + 30, 0, ZE + (rSeat(SEAT.x0 + 30) + rCone(SEAT.x0 + 30)) / 2];

/* ====================================================================
   7 · el alimentador vertical: un tornillo que empuja las hojuelas a la caja de la entrada, con su motorreductor sobre
   un puente en la tolva; las hojuelas en la cara del corte (y = 0) y su superficie en la tolva
   ==================================================================== */
{
  const Fv = { o: [XF, 0, 0], a: ZD, u: XD, v: YD };
  const z0 = ZE + FR.fz0, z1 = ZE + FR.fz1, zh1 = ZE + FR.z1, zl = ZE + FR.level, zr = ZE + FR.rim;
  // el núcleo y el eje dentro de las hojuelas: solo la mitad que mira al lector; arriba del nivel, el eje entero
  quarterRev("alimentador.nucleo", [[z0 - 6, 0], [zh1, 0], [zh1, FR.hub], [z0 - 6, FR.hub]], { F: Fv, which: "frente", owner: "alimentador" });
  quarterRev("alimentador.eje0", [[zh1, 0], [zl, 0], [zl, 25], [zh1, 25]], { F: Fv, which: "frente", owner: "alimentador" });
  disc("alimentador.eje", Fv, zl, zr, 25, { owner: "alimentador" });
  // el filete: la mitad que mira al lector (0 a 180°), partida donde el núcleo deja de taparlo (150°)
  const p = FR.pitch, a1 = (TAU * (z1 - z0)) / p, prof = [[-FL.tRoot / 2 + 4, FR.hub], [FL.tRoot / 2 - 4, FR.hub], [FL.tTip / 2 - 3, FR.tip], [-FL.tTip / 2 + 3, FR.tip]];
  const F = { o: [XF, 0, z0], a: ZD, u: XD, v: YD };
  const FLV = { a0: 0, a1, p };
  for (let kk = 0; kk <= Math.ceil(a1 / TAU); kk++) for (const [lo0, hi0] of [[0, (150 * PI) / 180], [(150 * PI) / 180, PI]]) {
    const lo = Math.max(0, kk * TAU + lo0), hi = Math.min(a1, kk * TAU + hi0);
    if (hi - lo < 1e-3) continue;
    const nm = `alimentador.filete.${kk}.${lo0 > 0 ? 1 : 0}`;
    const svg = sweepSvg({ F, profile: prof, a0: lo, a1: hi, pitch: p, skip: [0], cls: "pt-ss", capA: "end", capB: "end" });
    const sh = sweepShapes({ F, profile: prof, a0: lo, a1: hi, pitch: p, name: nm, owner: "alimentador" });
    const pm = (lo + hi) / 2;
    put(nm, [XF + 70 * Math.cos(pm), 70 * Math.sin(pm), z0 + (p * pm) / TAU], svg, sh);
  }
  ANCH.ALIMENTADOR = [XF + FR.tip * Math.cos(0.5), FR.tip * Math.sin(0.5), z0 + (p * (TAU + 0.5)) / TAU];
  // las hojuelas en la cara del corte: el tubo, la garganta y el cono, hasta el nivel, sin el núcleo ni los filetes
  const zIn = ZE + FR.z1, rIn = (z) => (z <= zIn ? FR.ri : FR.ri + ((FR.cone.r1 - 4 - FR.ri) * (z - zIn)) / (FR.cone.z1 - FR.z1));
  const side = (s) => {
    // s = +1 (derecha, θ = 0) o −1 (izquierda, θ = π): de abajo (la boca de la caja) al nivel, con los dientes del filete
    const th = s > 0 ? 0 : PI, cr = [];
    for (let kk = -1; kk <= Math.ceil(a1 / TAU) + 1; kk++) { const ph = kk * TAU + th; if (ph >= 0 && ph <= a1) cr.push(z0 + (p * ph) / TAU); }
    cr.sort((a, b) => a - b);
    const zb = ZE + R;
    const inner = [[FR.hub, zl], [FR.hub, z0 - 6], [0, z0 - 6], [0, zb]];
    const pts = [[0, zb], [rIn(zb), zb], [FR.ri, zIn], [rIn(zl), zl], [25, zl], [25, zh1], [FR.hub, zh1]];
    for (const zc of cr.slice().reverse()) pts.push([FR.hub, zc + FL.tRoot / 2 - 4], [FR.tip, zc + FL.tTip / 2 - 3], [FR.tip, zc - FL.tTip / 2 + 3], [FR.hub, zc - FL.tRoot / 2 + 4]);
    pts.push([FR.hub, z0 - 6], [0, z0 - 6]);
    void inner;
    return pts.map(([u, z]) => [XF + s * u, z]);
  };
  let svg = "";
  const shapes = [];
  for (const s of [-1, 1]) {
    const poly = side(s);
    const toW = ([x, z]) => [x, 0, z];
    svg += `<path class="pt-void" d="${pth1(poly.map((q) => pr(toW(q))))}"/>`;
    // flakesIn trabaja en (x, ρ); aquí ρ es z
    svg += `<path class="pt-hoj" d="${flakesIn(poly, Math.min(...poly.map((q) => q[0])), Math.max(...poly.map((q) => q[0])), 0, toW, { scale: 1.25, dens: 0.85 })}"/>`;
    svg += `<path class="iso-line iso-edge pt-mat-edge" data-tone="mid" d="${pth1(poly.map((q) => pr(toW(q))))}"/>`;
    shapes.push(record(A.prism(FY, poly, -0.3, 0, { name: `hojuelas.tolva${s > 0 ? 1 : 0}`, owner: "material" })));
  }
  put("hojuelas.tolva", [XF, 0, (ZE + zl) / 2], svg, shapes);
  // la superficie de las hojuelas en la tolva (la mitad de atrás), con hojuelas sueltas encima
  const rl = rIn(zl), surf = [];
  for (let j = 0; j <= 40; j++) { const a = PI + (PI * j) / 40; surf.push([XF + rl * Math.cos(a), rl * Math.sin(a)]); }
  for (let j = 16; j >= 0; j--) { const a = PI + (PI * j) / 16; surf.push([XF + 25 * Math.cos(a), 25 * Math.sin(a)]); }
  let ss = `<g class="iso-solid pt-heap"><path class="iso-fill" d="${pth1(surf.map(([x, y]) => pr([x, y, zl])))}"/><path class="iso-top" d="${pth1(surf.map(([x, y]) => pr([x, y, zl])))}"/></g>`;
  ss += `<path class="pt-hoj-s" d="${flakesIn(surf, XF - rl, XF + rl, 0.1, ([x, y]) => [x, y, zl], { scale: 1.3, dens: 0.45 })}"/>`;
  ss += Ln(pth1(surf.map(([x, y]) => pr([x, y, zl]))), { tone: "mid" });
  put("hojuelas.superficie", [XF, -rl / 2, zl], ss, [record(A.prism(FZs, surf, zl - 0.3, zl, { name: "hojuelas.superficie", owner: "material" }))]);
  ANCH.HOJUELAS = [XF - rl * 0.55, -rl * 0.45, zl];
  // el puente sobre el borde de la tolva y el motorreductor del alimentador
  const bz = zr, xb0 = XF - FR.cone.r1 - 28, xb1 = XF + FR.cone.r1 + 28;
  box("alimentador.puente", [xb0, -55, bz], [xb1, 55, bz + 50], { cls: "pt-paint", owner: "alimentador", extra: Dots([at([xb0 + 14, 30, bz + 50]), at([xb1 - 14, 30, bz + 50])], { size: 0.5, tone: "mid" }) });
  box("alimentador.caja", [XF - 90, -85, bz + 50], [XF + 90, 85, bz + 230], { cls: "pt-cast", owner: "alimentador", r: 6, steps: 3 });
  const Fm = FXo(0, bz + 150, 0), mr = 72;
  const fins = G.ribsOf(Fm, XF + 130, XF + 360, mr, 18, P, { fade: [0.05, 0.45], seams: true });
  turned("alimentador.motor", Fm, [[XF + 90, 0], [XF + 90, mr - 8], [XF + 110, mr], [XF + 380, mr], [XF + 395, mr - 16], [XF + 430, mr - 16], [XF + 430, 0]], { cls: "pt-paint", owner: "alimentador", extra: k.fadedSvg(fins, { tone: "lo" }) });
  ANCH.ALIM_MOTOR = [XF + 260, mr * 0.6, bz + 150 + mr * 0.75];
}

/* ====================================================================
   8 · la salida: el anillo con el asiento cónico (cortado como la jaula), el cono (entero), el husillo roscado, el
   soporte con la tuerca, la contratuerca, el volante y la escala con su aguja
   ==================================================================== */
{
  const Fx = FXe;
  // el anillo de salida
  const prof = [[SEAT.x0, SEAT.r0], [SEAT.x1, SEAT.r1], [SEAT.x1, SEAT.ro], [SEAT.x0, SEAT.ro]];
  const dots = (a, b) => Dots(boltCircle(Fx, SEAT.x1, (SEAT.r1 + SEAT.ro) / 2, 16, PI / 16, a, b), { size: 0.45, tone: "mid" });
  revSectors("anillo", prof, ["atras", "abajo"], { owner: "jaula", extra: { atras: dots(PI / 2, 1.5 * PI), abajo: dots(1.5 * PI, TAU) } });
  ANCH.ANILLO = [SEAT.x1, SEAT.ro * Math.cos(-50 * D2R), ZE + SEAT.ro * Math.sin(-50 * D2R)];
  // la torta en el anillo: en el cuarto que se quita no hay (se ve el cono); en las caras del corte va con el material
  // el cono, con el hueco donde entra la tuerca del eje
  const xL = CN.xLand, rL = rCone(xL);
  // dentro del anillo solo se ve el cuarto de arriba que mira al lector (lo demás va tras la torta); afuera, entero
  {
    const xc = SEAT.x1 + 11;      // hasta donde la torta que sale tapa el cono
    const prof2 = [[CN.x0, 55], [xc, 55], [xc, rCone(xc)], [CN.x0, rCone(CN.x0)]];
    const svg2 = sweepSvg({ F: Fx, profile: prof2, a0: 0, a1: PI / 2, cls: "pt-ss", capA: "none", capB: "none", skip: [0, 1], steps: 18 });
    const sh2 = record(A.lathe(Fx, [[CN.x0, 55], [CN.x0, rCone(CN.x0)], [xc, rCone(xc)], [xc, 55]], { name: "cono.punta", owner: "cono", cut: SECT.cuarto[2](CN.x0, xc) }));
    put("cono.punta", [(CN.x0 + xc) / 2, 70, ZE + 70], svg2, [sh2]);
  }
  turned("cono", Fx, [[SEAT.x1 + 11, 0], [SEAT.x1 + 11, rCone(SEAT.x1 + 11)], [xL, rL], [CN.xBack, rL], [CN.xBack, CN.rHub], [CN.xHub, CN.rHub], [CN.xHub, 0]], { cls: "pt-ss", owner: "cono", steps: 64 });
  // la torta que sale por la rendija anular, pegada al cono, antes de partirse en láminas (cortada como el anillo)
  {
    const al = Math.atan(SLOPE), th = CN.gap, x2 = SEAT.x1 + 11;
    const prof = [[SEAT.x1, rCone(SEAT.x1)], [x2, rCone(x2)], [x2 - th * Math.sin(al), rCone(x2) + th * Math.cos(al)], [SEAT.x1, rSeat(SEAT.x1)]];
    revSectors("torta.salida", prof, ["atras", "abajo"], { cls: "pt-torta", cutCls: "pt-torta-c", owner: "cono" });
  }
  ANCH.CONO = [(CN.x0 + xL) / 2 + 10, rCone((CN.x0 + xL) / 2 + 10) * Math.cos(35 * D2R), ZE + rCone((CN.x0 + xL) / 2 + 10) * Math.sin(35 * D2R)];
  // el husillo roscado, del cono a la tuerca del soporte, con los filetes de la rosca
  const B = PT.brk, rs = CN.spindle;
  let thr = "";
  for (let x = CN.xHub + 10; x < B.bx0 - 4; x += 9) thr += G.arcOf(Fx, x, rs, P, { from: 0, to: TAU });
  disc("husillo", Fx, CN.xHub, B.bx0, rs, { owner: "cono", extra: Ln(thr, { tone: "lo" }) });
  // el soporte del cono: placa sobre la base, con la tuerca de bronce (el saliente) y dos cartelas
  box("soporte", [B.x0, -B.y, BZ], [B.x1, B.y, ZE + 150], { cls: "pt-paint", owner: "soporte", r: 0.3, extra: Dots([[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => at([B.x1, b * (B.y - 30), ZE + a * 110])), { size: 0.5, tone: "mid" }) });
  for (const [j, yc] of [[0, -B.y + 6], [1, B.y - 18]]) fp(`soporte.cartela${j}`, FY, [[B.x1, BZ], [B.x1 + 120, BZ], [B.x1, BZ + 300]], yc, yc + 12, { cls: "pt-paint", owner: "soporte" });
  turned("soporte.tuerca0", Fx, [[B.bx0, 0], [B.bx0, B.boss - 12], [B.bx0 + 12, B.boss], [B.x0, B.boss], [B.x0, 0]], { cls: "pt-bronze", owner: "soporte" });
  turned("soporte.tuerca1", Fx, [[B.x1, 0], [B.x1, B.boss], [B.bx1 - 12, B.boss], [B.bx1, B.boss - 12], [B.bx1, 0]], { cls: "pt-bronze", owner: "soporte" });
  // la contratuerca, el eje del volante, el cubo, los rayos, la rueda y la manija
  disc("contratuerca", Fx, B.bx1, B.bx1 + 24, 62, { owner: "volante", cls: "pt-cast", n: 6 });
  disc("husillo.punta", Fx, B.bx1 + 24, PT.wheel.x - 20, rs, { owner: "volante" });
  const Wh = PT.wheel;
  turned("volante.cubo", Fx, [[Wh.x - 20, 0], [Wh.x - 20, 44], [Wh.x + 22, 44], [Wh.x + 22, 0]], { cls: "pt-cast", owner: "volante" });
  // la rueda, en cuatro arcos entre los rayos (así cada rayo queda delante de un arco y detrás del otro)
  const rimP = [];
  for (let j = 0; j < 10; j++) { const a = (TAU * j) / 10; rimP.push([Wh.x + Wh.rr * Math.cos(a), Wh.r + Wh.rr * Math.sin(a)]); }
  for (let q = 0; q < 4; q++) {
    const a0 = (45 + 90 * q) * D2R, a1 = a0 + PI / 2, nm = `volante.rueda${q}`;
    const svgR = sweepSvg({ F: Fx, profile: rimP, a0, a1, smooth: rimP.map((_, j) => j), cls: "pt-cast", capA: "none", capB: "none", steps: 12 });
    const ccut = [cutBox(Wh.x - 40, Wh.x + 40, [-BIG, BIG], [-BIG, BIG])];
    void ccut;
    const shR = [];
    for (let i = 0; i < 6; i++) { const b0 = a0 + ((a1 - a0) * i) / 6, b1 = a0 + ((a1 - a0) * (i + 1)) / 6, bm = (b0 + b1) / 2; const er = [0, Math.cos(bm), Math.sin(bm)], et = [0, -Math.sin(bm), Math.cos(bm)]; const h = (Wh.r * (b1 - b0)) / 2; shR.push(record(A.prism({ o: [Wh.x, Wh.r * er[1], ZE + Wh.r * er[2]], a: et, u: XD, v: er }, rimP.map(([x, r]) => [x - Wh.x, r - Wh.r]), -h, h, { name: `${nm}.${i}`, owner: "volante" }))); }
    const am = (a0 + a1) / 2;
    put(nm, [Wh.x, Wh.r * Math.cos(am), ZE + Wh.r * Math.sin(am)], svgR, shR);
  }
  for (const a of [45, 135, 225, 315]) {
    const ph = a * D2R, er = [0, Math.cos(ph), Math.sin(ph)], et = [0, -Math.sin(ph), Math.cos(ph)];
    fp(`volante.rayo${a}`, { o: [Wh.x, 0, ZE], a: er, u: XD, v: et }, [[-9, -11], [9, -11], [9, 11], [-9, 11]], 44, Wh.r - Wh.rr + 0.5, { cls: "pt-cast", owner: "volante" });
  }
  const hp = 40 * D2R, hy = Wh.r * Math.cos(hp), hz = ZE + Wh.r * Math.sin(hp);
  turned("volante.manija", FXo(hy, hz, 0), [[Wh.x + Wh.rr - 1, 0], [Wh.x + Wh.rr - 1, 11], [Wh.x + 70, 11], [Wh.x + 76, 16, 1], [Wh.x + 110, 17, 1], [Wh.x + 118, 10, 1], [Wh.x + 120, 0]], { cls: "pt-cast", owner: "volante" });
  ANCH.VOLANTE = [Wh.x + Wh.rr, Wh.r * Math.cos(-20 * D2R), ZE + Wh.r * Math.sin(-20 * D2R)];
  ANCH.HUSILLO = [1300, rs * 0.7, ZE + rs * 0.7];
  ANCH.SOPORTE = [B.x1, B.y - 40, ZE - 250];
  ANCH.CONTRATUERCA = [B.bx1 + 12, 62 * 0.87, ZE + 31];
  // la escala del cono (fija al soporte) y la aguja (fija al cubo del cono)
  const sx0 = 1135, sy0 = 100, sy1 = 108, sz0 = ZE + 52, sz1 = ZE + 80;
  let ticks = "";
  for (let x = sx0 + 15, j = 0; x < B.x0 - 10; x += 10, j++) ticks += path3([[x, sy1, sz1], [x, sy1, sz1 - (j % 5 === 0 ? 14 : 8)]]);
  box("escala", [sx0, sy0, sz0], [B.x0, sy1, sz1], { cls: "pt-ss", owner: "soporte", extra: Ln(ticks, { tone: "mid" }) });
  const ax = 1158;
  box("aguja.brazo", [ax - 8, -8, ZE + CN.rHub - 3], [ax + 8, 8, ZE + 102], { cls: "pt-ss", owner: "cono" });
  box("aguja", [ax - 8, 8, ZE + 94], [ax + 8, sy1 + 10, ZE + 102], { cls: "pt-ss", owner: "cono" });
  fp("aguja.punta", FXs, [[sy1 + 2, ZE + 94], [sy1 + 10, ZE + 94], [sy1 + 6, sz1 + 4]], ax - 3, ax + 3, { cls: "pt-ss", owner: "cono" });
  ANCH.ESCALA = [sx0 + 140, sy1, sz1 - 10];
}

/* ====================================================================
   9 · la bandeja del aceite (la mitad de atrás) con el aceite, el tubo de salida, y la capota (la mitad de atrás)
   ==================================================================== */
const TR = PT.tray, zB = (x) => TR.zB0 + ((TR.zB1 - TR.zB0) * (x - TR.x0)) / (TR.x1 - TR.x0);
{
  const t = 3;
  fp("bandeja.atras", FY, [[TR.x0, zB(TR.x0) - t], [TR.x1, zB(TR.x1) - t], [TR.x1, TR.zRim], [TR.x0, TR.zRim]], TR.y, TR.y + t, { cls: "pt-ss", owner: "bandeja" });
  {
    // el fondo, con su cara cortada aparte (va delante de las gotas, y el fondo, detrás)
    const fpoly = [[TR.x0, zB(TR.x0) - t], [TR.x1, zB(TR.x1) - t], [TR.x1, zB(TR.x1)], [TR.x0, zB(TR.x0)]];
    fp("bandeja.fondo", FY, fpoly, TR.y, -0.3, { cls: "pt-ss", cap: "none", owner: "bandeja" });
    put("bandeja.fondo.corte", [(TR.x0 + TR.x1) / 2, 0, zB((TR.x0 + TR.x1) / 2)], cutXZ(fpoly, "pt-cut"), [record(A.prism(FY, fpoly, -0.3, 0, { name: "bandeja.fondo.corte", owner: "bandeja" }))]);
  }
  yCut("bandeja.extremo0", rectXZ(TR.x0, zB(TR.x0), TR.x0 + t, TR.zRim), TR.y + t, { owner: "bandeja" });
  yCut("bandeja.extremo1", rectXZ(TR.x1 - t, zB(TR.x1), TR.x1, TR.zRim), TR.y + t, { owner: "bandeja" });
  // el borde doblado de atrás
  box("bandeja.borde", [TR.x0, TR.y - 25, TR.zRim - 3], [TR.x1, TR.y + t, TR.zRim], { owner: "bandeja", cutCls: null });
  // las patas, sobre los travesaños de la base
  for (const [j, xc] of [[0, 300], [1, 700]]) box(`bandeja.pata${j}`, [xc - 20, -230, BZ], [xc + 20, -190, zB(xc) - t], { cls: "pt-paint", owner: "bandeja" });
  ANCH.BANDEJA = [TR.x1 - 120, 0, zB(TR.x1 - 120) + 30];
  // el aceite: la cara del corte (y = 0) y la superficie
  const xo = TR.x0 + ((TR.zOil - TR.zB0) / (TR.zB1 - TR.zB0)) * (TR.x1 - TR.x0);
  const oilPoly = [[TR.x0 + t, zB(TR.x0 + t)], [xo, TR.zOil], [TR.x0 + t, TR.zOil]];
  const surf = [[TR.x0 + t, TR.y + t, TR.zOil], [xo, TR.y + t, TR.zOil], [xo, 0, TR.zOil], [TR.x0 + t, 0, TR.zOil]];
  // las ondas donde caen las gotas
  let rip = "";
  const DRIPS = [];
  for (const { si } of OILBAR) void si;
  for (let j = 0; j < 11; j++) { const x = 80 + j * 84 + rnd() * 30; if (SECTIONS.every(([a, b]) => x < a + 14 || x > b - 14)) continue; DRIPS.push(x); }
  for (const x of DRIPS) if (x < xo - 20) rip += G.circleOf({ o: [x, -22, TR.zOil + 0.4], a: ZD, u: XD, v: YD }, 0, 9 + rnd() * 5, P, 24);
  put("aceite.sup", [(TR.x0 + xo) / 2, -60, TR.zOil - 10], `<path class="pt-oil-sup" d="${pth1(surf.map(pr))}"/><path class="pt-oil-rip" d="${rip}"/>`, [record(A.prism(FY, oilPoly, TR.y + t, -0.3, { name: "aceite", owner: "aceite" }))]);
  put("aceite.cara", [(TR.x0 + xo) / 2, 0, TR.zOil - 10], `<path class="pt-oil-cara" d="${pth1(oilPoly.map(([x, z]) => pr([x, 0, z])))}"/>`, [record(A.prism(FY, oilPoly, -0.3, 0, { name: "aceite.cara", owner: "aceite" }))]);
  ANCH.ACEITE = [TR.x0 + 140, -40, TR.zOil];
  // las gotas que caen de las barras de abajo a la bandeja
  const z1 = ZE - RB - 4;
  // una gota que cae (punta arriba) y la que cuelga de la barra de abajo
  const fall = (c, w, h) => `M${r10(c[0])} ${r10(c[1] - h)}C${r10(c[0] + w * 0.25)} ${r10(c[1] - h * 0.45)} ${r10(c[0] + w)} ${r10(c[1] - h * 0.1)} ${r10(c[0] + w)} ${r10(c[1] + h * 0.25)}C${r10(c[0] + w)} ${r10(c[1] + h * 0.8)} ${r10(c[0] - w)} ${r10(c[1] + h * 0.8)} ${r10(c[0] - w)} ${r10(c[1] + h * 0.25)}C${r10(c[0] - w)} ${r10(c[1] - h * 0.1)} ${r10(c[0] - w * 0.25)} ${r10(c[1] - h * 0.45)} ${r10(c[0])} ${r10(c[1] - h)}Z`;
  const hang = (c, w) => `M${r10(c[0] - w)} ${r10(c[1] - w * 0.3)}C${r10(c[0] - w)} ${r10(c[1] + w * 1.6)} ${r10(c[0] + w)} ${r10(c[1] + w * 1.6)} ${r10(c[0] + w)} ${r10(c[1] - w * 0.3)}Z`;
  // las gotas de cada tramo de barras van en su propio elemento (unas quedan detrás de un bastidor y otras delante)
  SECTIONS.forEach(([sa, sb], si) => {
    let gd = "";
    const xs = DRIPS.filter((x) => x > sa && x < sb), yd = -22;
    if (!xs.length) return;
    for (const x of xs) {
      const z0 = Math.max(TR.zOil, zB(x)) + 6, n = 2 + Math.floor(rnd() * 2);
      for (let q = 0; q < n; q++) { const z = z1 - (q + 0.3 + rnd() * 0.5) * ((z1 - z0) / n); gd += fall(at([x, yd, z]), Math.max(1.4, 4.2 * KS), Math.max(2.4, 7 * KS)); }
      gd += hang(at([x, yd, ZE - RB - 2]), Math.max(1.5, 4.5 * KS));
    }
    const dshapes = xs.map((x, j) => record(A.box([x - 7, -30, Math.max(TR.zOil, zB(x - 7), zB(x + 7))], [x + 7, -14, ZE - RB], { name: `aceite.gotas${si}.${j}`, owner: "aceite" })));
    put(`aceite.gotas${si}`, [(sa + sb) / 2, -22, (TR.zOil + z1) / 2], `<path class="pt-oil-drop" d="${gd}"/>`, dshapes);
  });
  ANCH.GOTAS = [DRIPS[1], -22, Math.max(zB(DRIPS[1]), TR.zOil) + 70];
  // el tubo de salida del aceite, del fondo de la bandeja hacia el lector
  const O = TR.out, zf = zB(O.x) - t;
  disc("bandeja.boquilla", FZ(O.x, O.y), zf - 40, zf, O.r + 8, { owner: "bandeja", cls: "pt-ss" });
  const route = G.fillet([[O.x, O.y, zf - 40], [O.x, O.y, O.z], [O.x, O.y1, O.z]], 70);
  tubeItems("aceite.tubo", route, O.r, { cls: "pt-pipe" });
  disc("aceite.brida", FYo(O.x, O.z, 0), O.y1, O.y1 + 18, O.r + 34, { owner: "bandeja", extra: ringOn(FYo(O.x, O.z), O.y1 + 18, O.r - 3, O.r), cls: "pt-ss" });
  ANCH.ACEITE_SALE = [O.x, O.y1 + 18, O.z + O.r + 20];
}
{
  // la capota: chapa sobre la jaula, la mitad de atrás, del primer bastidor al último; con sus dos tapas
  const H = PT.hood, t = 3, ar = H.r, cy = H.yb + ar, cz = H.ztop - ar;
  const outer = [[H.yb, H.zb]];
  for (let j = 0; j <= 18; j++) { const a = PI - (PI / 2) * (j / 18); outer.push([cy + ar * Math.cos(a), cz + ar * Math.sin(a)]); }
  outer.push([0, H.ztop]);
  const inner = [[0, H.ztop - t]];
  for (let j = 18; j >= 0; j--) { const a = PI - (PI / 2) * (j / 18); inner.push([cy + (ar - t) * Math.cos(a), cz + (ar - t) * Math.sin(a)]); }
  inner.push([H.yb + t, H.zb]);
  const sec = [...outer, ...inner];
  fp("capota", FXs, sec, H.x0, H.x1, { cls: "pt-ss", owner: "capota", extra: cutXZ(rectXZ(H.x0, H.ztop - t, H.x1, H.ztop), "pt-cut") });
  // las tapas: entre la capota y el bastidor (r = 200), la mitad de atrás
  const plate = [...inner.slice().reverse().map(([y, z]) => [y, z]), [0, H.zb]];
  const circ = [];
  for (let j = 0; j <= 30; j++) { const a = -PI / 2 - (PI * j) / 30; circ.push([PT.frameR * Math.cos(a), ZE + PT.frameR * Math.sin(a)]); }
  const endPoly = [[0, H.ztop - t], ...inner.slice(1), [H.yb + t, H.zb], [0, H.zb], ...circ.filter(([, z]) => z > H.zb), [0, ZE + PT.frameR]];
  void plate;
  for (const [j, xa] of [[0, H.x0], [1, H.x1 - t]]) {
    fp(`capota.tapa${j}`, FXs, endPoly, xa, xa + t, { cls: "pt-ss", owner: "capota" });
  }
  ANCH.CAPOTA = [820, cy + ar * Math.cos(0.75 * PI), cz + ar * Math.sin(0.75 * PI)];
}
{
  // la canaleta de la torta, colgada del anillo de salida: la mitad de atrás
  const CH = PT.chute, t = 3;
  box("canaleta.atras", [CH.x0, CH.y - t, CH.z0], [CH.x1, CH.y, ZE - SEAT.ro], { cls: "pt-ss", owner: "canaleta", cutCls: null });
  yCut("canaleta.lado0", rectXZ(CH.x0, CH.z0, CH.x0 + t, ZE - SEAT.ro), CH.y, { owner: "canaleta" });
  yCut("canaleta.lado1", rectXZ(CH.x1 - t, CH.z0, CH.x1, ZE - SEAT.ro + 30), CH.y, { owner: "canaleta" });
  ANCH.CANALETA = [CH.x1, -CH.y * 0, CH.z0 + 120];
  // las láminas de torta que caen del anillo
  let sh = "";
  const sheets = [];
  for (let j = 0; j < 7; j++) {
    const x = CH.x0 + 30 + rnd() * 150, y = -150 + rnd() * 130, z = ZE - SEAT.ro - 60 - j * 50 - rnd() * 20;
    const L = 40 + rnd() * 35, Wd = 22 + rnd() * 16, th = 7, a = rnd() * TAU, b = (rnd() - 0.5) * 1.6;
    const u = [Math.cos(a) * Math.cos(b), Math.sin(a) * Math.cos(b), Math.sin(b)], w0 = G.unit3(G.cross3(u, [0.2, -0.3, 1])), nn = G.cross3(u, w0);
    const poly = [[-L / 2, -Wd / 2], [L / 2 - 6, -Wd / 2 - 3], [L / 2, Wd / 2 - 4], [-L / 2 + 8, Wd / 2]];
    sheets.push({ d: G.dot3([x, y, z], V3), svg: X.prismSvg(C, poly, -th / 2, th / 2, { F: { o: [x, y, z], a: nn, u, v: w0 }, tone: "mid", cls: "pt-torta" }) });
  }
  sh = sheets.sort((p, q) => p.d - q.d).map((q) => q.svg).join("");
  put("torta.laminas", [CH.x0 + 100, -80, ZE - 300], sh, [record(A.box([CH.x0 + 3, -175, CH.z0 - 40], [CH.x0 + 220, 30, ZE - SEAT.ro], { name: "torta.laminas", owner: "canaleta" }))]);
  ANCH.TORTA = [CH.x0 + 90, -40, ZE - SEAT.ro - 140];
}

/* ====================================================================
   10 · las flechas: las hojuelas entran a la tolva, el aceite sale por el tubo y la torta cae por la canaleta
   ==================================================================== */
function flow(name, ctl, { r = 5, head = 13, w = 6.5, cls = "pt-flujo", hcls = "pt-flecha", into = null } = {}) {
  const pts = [];
  for (let i = 0; i < ctl.length - 1; i++) {
    const p0 = ctl[Math.max(0, i - 1)], p1 = ctl[i], p2 = ctl[i + 1], p3 = ctl[Math.min(ctl.length - 1, i + 2)];
    for (let j = 0; j < 14; j++) { const t = j / 14, t2 = t * t, t3 = t2 * t; pts.push([0, 1, 2].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3))); }
  }
  pts.push(ctl[ctl.length - 1]);
  const sc = pts.map(at), n = sc.length, b = sc[n - 1];
  let j = n - 2; while (j > 0 && Math.hypot(sc[j][0] - b[0], sc[j][1] - b[1]) < head) j--;
  const a = sc[j], Lh = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / Lh, uy = (b[1] - a[1]) / Lh;
  const base = [b[0] - ux * head, b[1] - uy * head];
  const keep = sc.slice(0, j + 1);
  const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  const hd = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  const svg = `<path class="${cls}" d="${line}"/><path class="${hcls}" d="${hd}"/>`;
  if (into) { into.push(svg); return; }
  put(name, pts[Math.floor(n / 2)], svg, [A.tube(pts, r), A.ball(pts[n - 1], Math.min(r * 3, (w * 0.8) / KS))]);
}
if (!DET) {
  flow("flujo.hojuelas", [[XF - 230, -170, ZE + FR.rim + 260], [XF - 225, -170, ZE + FR.rim + 140], [XF - 215, -170, ZE + FR.level + 40]], { r: 6 });
  flow("flujo.aceite", [[TR.out.x, TR.out.y1 + 40, TR.out.z], [TR.out.x, TR.out.y1 + 160, TR.out.z], [TR.out.x, TR.out.y1 + 280, TR.out.z]], { cls: "pt-flujo-a", hcls: "pt-flecha-a" });
  flow("flujo.torta", [[1180, -60, PT.chute.z0 - 20], [1180, -60, PT.chute.z0 - 110], [1180, -60, PT.chute.z0 - 200]]);
  ANCH.FLUJO_TORTA = [1180, -60, PT.chute.z0 - 150];
}

/* ====================================================================
   11 · el detalle: dos barras de la jaula cortadas de través en x = XDET, dieciséis veces más grandes. Adentro, la torta:
   partículas aplastadas con aceite en los poros; las que no caben en la rendija se quedan contra ella. El aceite pasa
   por la rendija (0,7 mm por dentro, 4,6 mm por fuera, porque las barras son rectangulares), sale por la boca, corre por
   la cara de afuera de la barra de abajo y gotea.
   ==================================================================== */
if (DET) {
  LIVE = true;
  // en el detalle solo valen sus propias anclas
  for (const key of Object.keys(ANCH)) delete ANCH[key];
  const xs0 = XDET - 160, xs1 = XDET;
  const barAt = (j) => { const b = BARS_Q[j]; return { phi: -PI / 2 + b.c, w: b.w }; };
  const wpt = (F, s, u, v) => G.add3(G.add3(F.o, G.mul3(F.a, s)), G.add3(G.mul3(F.u, u), G.mul3(F.v, v)));
  const js = [SLOT.j - 1, SLOT.j, SLOT.j + 1, SLOT.j + 2].filter((j) => j >= 0 && j < BARS_Q.length);
  for (const j of js) {
    const { phi, w } = barAt(j), F = barFrame(phi, 0), poly = barPoly(w);
    const face = poly.map(([u, v]) => wpt(F, xs1, u, v));
    // en el detalle las barras son el suelo: las sostienen los bastidores, que quedan fuera del círculo
    fp(`d.barra${j}`, F, poly, xs0, xs1, { cls: "pt-bar", cap: "none", owner: "jaula", ground: true, extra: faceSvg(pth1(face.map(pr)), "pt-cut") });
  }
  // las dos barras de la rendija: a (abajo) y b (arriba)
  const A_ = barAt(SLOT.j), B_ = barAt(SLOT.j + 1), Fa = barFrame(A_.phi, 0), Fb = barFrame(B_.phi, 0);
  const aIn = wpt(Fa, xs1, A_.w / 2, R), aOut = wpt(Fa, xs1, A_.w / 2, RB), bIn = wpt(Fb, xs1, -B_.w / 2, R), bOut = wpt(Fb, xs1, -B_.w / 2, RB);
  // el aceite que llena la rendija: un prisma a lo largo de x, con su cara en el corte
  const toYZ = (p) => [p[1], p[2]];
  const slotYZ = [aIn, aOut, bOut, bIn].map(toYZ);
  const FXd = { o: [0, 0, 0], a: XD, u: YD, v: ZD };
  fp("d.aceite.rendija", FXd, slotYZ, xs0, xs1 - 0.05, { cls: "pt-oil-slot", cap: "none", owner: "aceite", extra: `<path class="pt-oil" d="${pth1([aIn, aOut, bOut, bIn].map(pr))}"/>` });
  // las otras rendijas también llevan aceite
  for (let q = 0; q < js.length - 1; q++) {
    if (js[q] === SLOT.j) continue;
    const P_ = barAt(js[q]), Q_ = barAt(js[q + 1]), Fp = barFrame(P_.phi, 0), Fq = barFrame(Q_.phi, 0);
    const sl = [wpt(Fp, xs1, P_.w / 2, R), wpt(Fp, xs1, P_.w / 2, RB), wpt(Fq, xs1, -Q_.w / 2, RB), wpt(Fq, xs1, -Q_.w / 2, R)];
    fp(`d.aceite.rendija${q}`, FXd, sl.map(toYZ), xs0, xs1 - 0.05, { cls: "pt-oil-slot", cap: "none", owner: "aceite", extra: `<path class="pt-oil" d="${pth1(sl.map(pr))}"/>` });
  }
  // la torta: su cara en el corte, entre las caras de adentro de las barras y un arco hacia el eje
  const phi0 = barAt(js[0]).phi - barAt(js[0]).w / 2 / R, phi1 = barAt(js[js.length - 1]).phi + barAt(js[js.length - 1]).w / 2 / R;
  const outer = [];
  for (const j of js) { const { phi, w } = barAt(j), F = barFrame(phi, 0); outer.push(wpt(F, xs1, -w / 2, R), wpt(F, xs1, w / 2, R)); }
  const rin = R - 46, inner = [];
  for (let q = 0; q <= 20; q++) { const a = phi1 - ((phi1 - phi0) * q) / 20; inner.push([xs1, rin * Math.cos(a), ZE + rin * Math.sin(a)]); }
  const cake = [...outer, ...inner];
  const cakeYZ = cake.map(toYZ);
  // las partículas, aplastadas contra las barras (largas a lo largo de la tangente), con aceite entre ellas
  const inPolyYZ = (y, z) => inPoly(cakeYZ, y, z);
  const parts = [];
  const mid = SLOT.m, et = (a) => [-Math.sin(a), Math.cos(a)], er = (a) => [Math.cos(a), Math.sin(a)];
  // las que se quedan en la boca de la rendija: más grandes que ella, atravesadas
  const mouth = [(aIn[1] + bIn[1]) / 2, (aIn[2] + bIn[2]) / 2 - ZE];
  for (const [dt, dr, L, T] of [[0, -0.9, 3.2, 1.0], [-2.6, -1.8, 2.6, 0.9], [2.4, -1.9, 2.8, 0.9]]) {
    const t = et(mid), r = er(mid);
    parts.push({ y: mouth[0] + t[0] * dt + r[0] * dr, z: mouth[1] + t[1] * dt + r[1] * dr, L, T, ang: Math.atan2(t[1], t[0]) + (dt ? 0.25 * Math.sign(dt) : 0.05), keep: true });
  }
  for (let q = 0; q < 9000 && parts.length < 520; q++) {
    const a = phi0 + rnd() * (phi1 - phi0), rr = rin + rnd() * (R - rin);
    const y = rr * Math.cos(a), z = rr * Math.sin(a), L = 1.6 + rnd() * 1.8, T = 0.55 + rnd() * 0.55;
    const ang = Math.atan2(et(a)[1], et(a)[0]) + (rnd() - 0.5) * 0.5;
    const ca = Math.cos(ang), sa = Math.sin(ang);
    const ends = [[L / 2, 0], [-L / 2, 0], [0, T / 2], [0, -T / 2]].map(([u, v]) => [y + u * ca - v * sa, z + ZE + u * sa + v * ca]);
    if (!ends.every(([p1, p2]) => inPolyYZ(p1, p2))) continue;
    if (parts.some((p) => Math.hypot((p.y - y) * Math.cos(ang) + (p.z - z) * Math.sin(ang), ((p.y - y) * -Math.sin(ang) + (p.z - z) * Math.cos(ang)) * 2.2) < (p.L + L) * 0.4)) continue;
    parts.push({ y, z, L, T, ang });
  }
  let dP = "";
  for (const p of parts) {
    const ca = Math.cos(p.ang), sa = Math.sin(p.ang), pts = [];
    for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU, u = (p.L / 2) * Math.cos(a), v = (p.T / 2) * Math.sin(a) * (0.9 + 0.2 * ((i * 5) % 3) / 2); pts.push([xs1, p.y + u * ca - v * sa, ZE + p.z + u * sa + v * ca]); }
    dP += pth1(pts.map(pr));
  }
  put("d.torta", [xs1, RDC * Math.cos(mid) * 0.9, ZE + RDC * Math.sin(mid) * 0.9], `<path class="pt-oil" d="${pth1(cake.map(pr))}"/><path class="pt-part" d="${dP}"/>` + Ln(pth1(cake.map(pr)), { tone: "mid" }), [record(A.prism(FXd, cakeYZ, xs1 - 0.3, xs1, { name: "d.torta", owner: "material" }))]);
  // el aceite que sale por la boca, corre por la cara de afuera de la barra de abajo y gotea de su esquina
  const ta = et(A_.phi), ra = er(A_.phi);
  const film = [aOut, wpt(Fa, xs1, -A_.w / 2, RB), wpt(Fa, xs1, -A_.w / 2, RB + 0.9), wpt(Fa, xs1, A_.w / 2 - 0.4, RB + 1.1)];
  const corner = wpt(Fa, xs1, -A_.w / 2, RB + 0.4), dropC = [xs1, corner[1] - 0.3, corner[2] - 3.4];
  const drop = [];
  for (let q = 0; q <= 18; q++) { const a = -PI / 2 + (TAU * q) / 18, rr = 1.9; drop.push([xs1, dropC[1] + rr * Math.cos(a) * 0.95, dropC[2] + rr * Math.sin(a)]); }
  const tear = [corner, ...drop.filter((p) => p[2] < dropC[2] + 0.2).sort((p, q) => Math.atan2(p[2] - dropC[2], p[1] - dropC[1]) - Math.atan2(q[2] - dropC[2], q[1] - dropC[1]))];
  void ta; void ra;
  const bead = [];
  for (let q = 0; q <= 12; q++) { const a = (PI * q) / 12; const c = [(aOut[1] + bOut[1]) / 2, (aOut[2] + bOut[2]) / 2], half = Math.hypot(bOut[1] - aOut[1], bOut[2] - aOut[2]) / 2; const rr = er(mid), tt = et(mid); bead.push([xs1, c[0] + tt[0] * half * Math.cos(a) + rr[0] * 1.3 * Math.sin(a), c[1] + tt[1] * half * Math.cos(a) + rr[1] * 1.3 * Math.sin(a)]); }
  put("d.aceite.gota", [xs1, dropC[1], dropC[2]], `<path class="pt-oil-drop" d="${pth1(film.map(pr))}${pth1(bead.map(pr))}${pth1(tear.map(pr))}"/>`, [record(A.box([xs1 - 0.3, Math.min(dropC[1], corner[1]) - 2.2, dropC[2] - 2.2], [xs1, Math.max(aOut[1], bOut[1]) + 1.5, Math.max(aOut[2], corner[2]) + 1.5], { name: "d.aceite.gota", owner: "aceite" }))]);
  // las flechas: el aceite atraviesa la rendija y baja por la barra
  const fin = { r: 0.15, head: 9, w: 4.2, cls: "pt-flujo-a pt-fino", hcls: "pt-flecha-a" };
  const sIn = [xs1 + 0.5, mouth[0] - er(mid)[0] * 3.5, ZE + mouth[1] - er(mid)[1] * 3.5];
  const sOut = [xs1 + 0.5, (aOut[1] + bOut[1]) / 2 + er(mid)[0] * 4.2, (aOut[2] + bOut[2]) / 2 + er(mid)[1] * 4.2];
  flow("d.flujo.rendija", [sIn, [xs1 + 0.5, (sIn[1] + sOut[1]) / 2, (sIn[2] + sOut[2]) / 2], sOut], fin);
  ANCH.D_RENDIJA = [xs1, (aIn[1] + aOut[1] + bIn[1] + bOut[1]) / 4, (aIn[2] + aOut[2] + bIn[2] + bOut[2]) / 4];
  ANCH.D_BARRA = wpt(Fb, xs1, 2, (R + RB) / 2 + 4);
  ANCH.D_RETENIDAS = [xs1, parts[0].y, ZE + parts[0].z];
  ANCH.D_TORTA = [xs1, (R - 4) * Math.cos(mid + 0.1), ZE + (R - 4) * Math.sin(mid + 0.1)];
  ANCH.D_GOTA = [xs1, dropC[1], dropC[2] - 1];
}

/* ---------- orden y salida ---------- */
if (process.env.PT_ITEM) {
  for (const nm of process.env.PT_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1) + (f.at ? " @" + f.at.map((v) => v.toFixed(1)).join(",") : "")).join(" / "));
    }
  }
  process.exit(0);
}
if (DET) {
  const inView = (it) => it.shapes.some((sh) => {
    const bd = A.boundsOf(sh); if (!bd) return true;
    const [lo, hi] = Array.isArray(bd) ? bd : [bd.min, bd.max];
    const cs = []; for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) cs.push(k.iso([x / U, y / U, z / U], P));
    const x0 = Math.min(...cs.map((c) => c[0])), x1 = Math.max(...cs.map((c) => c[0])), y0 = Math.min(...cs.map((c) => c[1])), y1 = Math.max(...cs.map((c) => c[1]));
    return x1 > 0 && x0 < W_ && y1 > 0 && y0 < H_;
  });
  const keep = R_.items.filter(inView);
  R_.items.splice(0, R_.items.length, ...keep);
}
const t0 = Date.now();
if (!FAST) A.settle(R_, PA, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");
R_.items.sort((a, b) => a.key - b.key);

const shades = (f, t, s) => `--anatomy-paper:${f};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s[0]};--anatomy-shade-1:${s[1]};--anatomy-shade-2:${s[2]};--anatomy-shade-3:${s[3]}`;
const flat = (c) => shades(c, c, [c, c, c, c]);
const ACERO = ["#EEF0F2", "#F7F8F9", ["#C9CED3", "#D6DADE", "#E1E4E7", "#ECEEF0"]];
const FUND = ["#DFE2E5", "#E9EBED", ["#C1C6CB", "#CACFD3", "#D3D7DA", "#DADDE0"]];
const PINT = ["#E4E8EA", "#EDF0F1", ["#C7CDD1", "#D0D5D8", "#D8DCDF", "#DFE2E4"]];
const SOL = ["#D9CFB8", "#E3DBC8", ["#A89464", "#B8A67A", "#C6B68F", "#CFC2A3"]];
const CSS = `.pt-cut{${flat("#C9CED3")}}.pt-cut-c{${flat("#C1C6CB")}}
.pt-ss,.pt-bar{${shades(...ACERO)}}.pt-cast{${shades(...FUND)}}.pt-paint{${shades(...PINT)}}
.pt-bronze{${shades("#E6CDB4", "#EEDCCA", ["#C49E7C", "#CEAC8D", "#D8BA9E", "#DFC4A9"])}}
.pt-torta,.pt-heap{${shades(...SOL)}}.pt-torta-c{${flat("#A89464")}}
.pt-pipe .tb-body{fill:#E1E4E7}.pt-pipe .tb-shine{fill:#F7F8F9}.pt-pipe .tb-shade{fill:#C9CED3}
.pt-bore{fill:#525C64;stroke:none}.pt-glass{fill:#DFE9F1;stroke:none}
.pt-void{fill:#8A96A3;stroke:none}.pt-mat2{fill:#C6B68F;stroke:none}.pt-mat1{fill:#B8A67A;stroke:none}.pt-mat0{fill:#A89464;stroke:none}
.pt-hoj{fill:#D9CFB8;stroke:#7A5634;stroke-width:.35px}.pt-hoj-s{fill:#E3DBC8;stroke:#A89464;stroke-width:.35px}.pt-lam{fill:#C6B68F;stroke:none}
.pt-mat-edge{stroke:#7A5634}
.pt-oil-slot{${shades("#F3E9BE", "#F7F0D2", ["#E3CF7A", "#E8D78E", "#EDDFA3", "#F0E4B0"])}}.pt-part{fill:#D9CFB8;stroke:#7A5634;stroke-width:.5px}
.pt-oil{fill:#E3CF7A;stroke:none}.pt-oil-drop{fill:#E3CF7A;stroke:#B08A1E;stroke-width:.4px}
.pt-oil-cara{fill:#E3CF7A;fill-opacity:.7;stroke:none}.pt-oil-sup{fill:#E3CF7A;fill-opacity:.5;stroke:none}.pt-oil-rip{fill:none;stroke:#B08A1E;stroke-width:.4px}
.pt-flujo{fill:none;stroke:#7A5634;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
.pt-flecha{fill:#7A5634;stroke:none;opacity:.9}
.pt-flujo-a{fill:none;stroke:#B08A1E;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
.pt-flecha-a{fill:#B08A1E;stroke:none;opacity:.9}.pt-fino{stroke-width:1.1px}
.pt-det-fondo{fill:#FFFFFF;stroke:none}.pt-det-marco{fill:none;stroke:#525C64;stroke-width:1px}`;
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
/* el SVG va en línea en la página del libro: los trazos M, L y Z se reescriben con coordenadas relativas en décimas */
function compact(svgText) {
  const num = (v) => { let t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); if (t === "-0") t = "0"; return t.replace(/^(-?)0\./, "$1."); };
  const cat = (list) => list.reduce((acc, t) => (!acc ? t : t.startsWith("-") || (t.startsWith(".") && /\.\d*$/.test(acc) && !/[a-z]$/i.test(acc)) ? acc + t : /[a-z]$/i.test(acc) ? acc + t : acc + " " + t), "");
  return svgText.replace(/ d="([MLZ0-9.\s,-]+)"/g, (whole, d) => {
    const tok = d.match(/[MLZ]|-?\d*\.?\d+(?:e-?\d+)?/g);
    if (!tok) return whole;
    const subs = []; let cur = null, cmd = "";
    for (let i = 0; i < tok.length; ) {
      const t = tok[i];
      if (t === "M") { cmd = "M"; i++; continue; }
      if (t === "L") { cmd = "L"; i++; continue; }
      if (t === "Z") { if (cur) cur.closed = true; cur = null; i++; continue; }
      const pnt = [Math.round(Number(t) * 10) / 10, Math.round(Number(tok[i + 1]) * 10) / 10]; i += 2;
      if (cmd === "M" || !cur) { cur = { pts: [pnt], closed: false }; subs.push(cur); cmd = "L"; } else cur.pts.push(pnt);
    }
    let out = "", cx = 0, cy = 0;
    subs.forEach((sp, k2) => {
      const [x0, y0] = sp.pts[0];
      out += k2 === 0 ? "M" + cat([num(x0), num(y0)]) : "m" + cat([num(x0 - cx), num(y0 - cy)]);
      cx = x0; cy = y0;
      if (sp.pts.length > 1) {
        const ds = [];
        for (let j = 1; j < sp.pts.length; j++) { ds.push(num(sp.pts[j][0] - cx), num(sp.pts[j][1] - cy)); cx = sp.pts[j][0]; cy = sp.pts[j][1]; }
        out += "l" + cat(ds);
      }
      if (sp.closed) { out += "z"; cx = x0; cy = y0; }
    });
    return ` d="${out}"`;
  });
}
const svg = DET
  ? k.figureSvg({ width: W_, height: H_, label: "Dos barras de la jaula, ampliadas", body: [`<style>${CSS}</style><defs><clipPath id="ptDet"><circle cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/></clipPath></defs><g class="pt-items" clip-path="url(#ptDet)"><circle class="pt-det-fondo" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="pt-det-marco" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W_, height: H_, label: "Prensa de tornillo en corte", body: [`<style>${CSS}</style><g class="pt-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
const base = DET ? "detalle" : "fig";
writeFileSync(join(OUTD, `${base}.svg`), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Prensa de tornillo", theme: "light", width: DET ? 400 : 1200, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, `${base}_data.json`), JSON.stringify({ P, W: W_, H: H_, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, { crowd: [] });
