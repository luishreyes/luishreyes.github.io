/* ====================================================================
   El congelador de lecho fluidizado de dos etapas (IQF) en isométrico (skill anatomy), para el capítulo 16 del libro
   de operaciones unitarias (Partículas en un fluido, «Congelar en un lecho fluidizado»): un equipo de unos 4000 kg/h
   de arvejas, sin la pared que mira al lector ni el techo.
   Concepto: el alimentador vibratorio deja caer las arvejas escaldadas en la banda 1. Ahí el aire, a −30 °C, sube a
   unos 3,5 m/s, 2,4 veces la mínima fluidización del ejemplo: el lecho borbotea y cada arveja se congela por fuera
   (la costra). Las arvejas pasan el vertedero, caen a la banda 2 y forman una capa quieta de 10 cm por la que el aire
   sube a 1,2 m/s, por debajo de la mínima fluidización, hasta que se congela el centro; de ahí caen al canal de la
   salida. Los ventiladores axiales de la cubierta empujan el aire hacia arriba a través de las bandas; arriba, el
   aire pasa el tabique y baja por las aletas del evaporador, donde deja su humedad como escarcha, y por el retorno de
   atrás vuelve, por debajo de la cubierta, a los ventiladores.
   Corte: se quitan la pared de y > 0 y el techo. Lo que llega al plano y = 0 (el piso, las paredes de los extremos,
   la cubierta, las bandas, los tambores, la rejilla y los lechos) se ve cortado ahí.
   --detalle=1 y --detalle=2: la primera y la segunda etapa ampliadas diez veces en un círculo, con las arvejas de
   6 mm una por una.
   Uso: node build.mjs [--audit] [--fast] [--detalle=1|2]
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
const CG = GEO.CG;
const FAST = process.argv.includes("--fast");
const DETN = Number((process.argv.find((a) => a.startsWith("--detalle=")) || "--detalle=0").split("=")[1]);
const DET = DETN > 0;
// la rejilla del orden: 0,25 unidades en la vista entera; en los detalles, 2 (la misma medida en milímetros, ocho veces)
const STEP = Number(process.env.CG_STEP || (DET ? 2 : 0.25));
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};                                     // los puntos a los que apuntan los rótulos del libro (libro.mjs)
const { t: TP, x0: X0, x1: X1, yb: YB, zf: ZF, ztop: ZT } = CG;
const RD = CG.rd, TB = CG.tb, WB = CG.wb;
const ZC1 = CG.b1.z - TB - RD, ZC2 = CG.b2.z - TB - RD;     // los ejes de los tambores

/* ---------- la cámara ---------- */
const W = DET ? 256 : 900, H = DET ? 256 : 640;
const EXT = [
  [X0 - TP, YB - TP, 0], [X1 + TP, YB - TP, 0], [X1 + TP, 0, 0], [X0 - TP, 0, 0],
  [X0 - TP, YB - TP, ZT], [X1 + TP, YB - TP, ZT], [X1 + TP, 0, ZT], [X0 - TP, 0, ZT],
  [-1440, -1150, 0], [-1440, -30, 0], [-1300, -30, 2280], [-1300, -1170, 2280], [-920, 260, 2300], [-680, 260, 2120],
  [CG.chute.b[0] + 10, -30, CG.chute.b[1] + 120], [CG.chute.b[0] + 10, -1200, CG.chute.b[1]],
];
const PMAIN = k.fitProjection(EXT, 900, 640, { pad: 14, azimuth: CG.AZ, elevation: CG.EL });
// los detalles: el centro (en el plano del corte, sobre el lecho) y el aumento
const CDETS = [null, [1250, 0, CG.b1.z + 24], [3560, 0, CG.b2.z + 34]];
const MDET = 10, RDET = 120;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: CG.AZ, elevation: CG.EL }; const c = k.iso(CDETS[DETN], Q); Q.origin = [W / 2 - c[0], H / 2 - c[1]]; return Q; })() : PMAIN;
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

/* El dibujo va en milímetros; el audit, en centímetros (como el filtro de arena y el tanque agitado): sus muestras de
   superficie van cada 0,6 unidades y un recinto de 5 m en milímetros no cabe en memoria. */
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
const record = (sh) => { R_.solid(cm(sh)); return sh; };
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref.map((v) => v * U), svg, shapes: shapes.map(cm), move: [0, 0, 0], ...rest });
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);
const DEFS = [];

/* ---------- caras del corte y caras planas ---------- */
// una cara plana del corte (en y = 0): polígono (x, z), relleno plano con la clase del corte y su borde
const cutXZ = (poly, cls) => { const d = pth1(poly.map(([x, z]) => pr([x, 0, z]))); return `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`; };
// una cara plana cualquiera, con el tono que le da la luz
function flatFace(pts, n, cls = "", edges = true) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return `<g class="iso-solid${cls ? " " + cls : ""}"><path class="iso-fill" d="${d}"/>` + (b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`) + (edges ? `<path class="iso-line iso-edge" data-tone="mid" d="${d}"/>` : "") + "</g>";
}
const rectXZ = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];

/* ---------- piezas ---------- */
// una caja; si llega a y = 0, su cara de adelante es el corte (cutCls); top: la clase de la cara de arriba (la corona
// de una pared sin techo es corte también)
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "cg-ss", cutCls = "cg-cut", topCls = null, r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, shapeCut, ref } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}), ...(shapeCut ? { cut: shapeCut } : {}) }));
  let svg = wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls);
  if (y1 >= -0.01 && cutCls) svg += cutXZ(rectXZ(x0, z0, x1, z1), cutCls);
  if (topCls) svg += flatFace([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], ZD, topCls);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], svg + extra, [shape]);
  return shape;
}
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, { cls = "cg-ss", extra = "", cap = "auto", owner = name, cut = null, ref = null, shapes = null, pre = "" } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}) });
  const shape = shapes ? null : record(sh);
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, pre + X.prismSvg(C, poly, s0, s1, { F, tone: "mid", cls, cap }) + extra, shapes || [shape]);
  return sh;
}
// un prisma a lo largo de y, de y0 hasta el corte (y = 0): la tapa del corte con su clase
const FY = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
function yCut(name, poly, y0, { cls = "cg-ss", cutCls = "cg-cut", extra = "", owner = name, ref = null } = {}) {
  return fp(name, FY, poly, y0, 0, { cls, cap: "none", extra: cutXZ(poly, cutCls) + extra, owner, ref });
}
function disc(name, F, s0, s1, r, { cls = "cg-ss", extra = "", owner = name, n = 0, cut = null, ground, capCls = null, noCap = false } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  let svg = X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap: capCls || noCap ? "none" : "auto" });
  if (capCls) { const s = Math.max(s0, s1); svg += `<g class="iso-solid ${capCls}"><path class="iso-fill" d="${G.circleOf(F, s, r, P, 64)}"/><path class="iso-shade" data-shade="0" d="${G.circleOf(F, s, r, P, 64)}"/><path class="iso-line iso-edge" data-tone="mid" d="${G.circleOf(F, s, r, P, 64)}"/></g>`; }
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg + extra, [shape]);
  return shape;
}
function turned(name, F, meridian, { cls = "cg-ss", extra = "", owner = name, steps = 40, inner = "" } = {}) {
  const paths = G.lathe(meridian, F, P, { ...(steps ? { steps } : {}) });
  const shape = record(A.lathe(F, meridian, { name, owner }));
  const s0 = Math.min(...meridian.map((q) => q[0])), s1 = Math.max(...meridian.map((q) => q[0]));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(S(paths, { tone: "mid", inner }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 300, gaps = [], cls = "", caps = true, ends = [true, true], touch, owner = name } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(4, Math.min(20, r * 0.5)), gaps, caps }).forEach((part, index) => {
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(tubeSvg(part, { tone }), cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
const FZ = (x, y, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });
const FYo = (x, z, y = 0) => ({ o: [x, y, z], a: YD, u: XD, v: ZD });
const FXo = (y, z, x = 0) => ({ o: [x, y, z], a: XD, u: YD, v: ZD });

/* ---------- semilla ---------- */
let seed = 11;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ====================================================================
   1 · el bastidor, el piso y las paredes del recinto (paneles de poliuretano con piel de acero)
   ==================================================================== */
{
  const B = CG.base;
  B.ys.forEach((yc, j) => {
    const y0 = Math.max(yc - B.w / 2, YB - TP), y1 = Math.min(yc + B.w / 2, 0);
    box(`bastidor${j}`, [X0 - TP, y0, B.z0], [X1 + TP, y1, B.z1], { cls: "cg-ss", owner: "bastidor" });
    B.feet.forEach((xf, q) => {
      const F = FZ(xf, Math.min(yc, -B.rp - 5));
      const plate = record(A.disc(F, 0, 10, B.rp, { name: `pata${j}.${q}.placa`, owner: "bastidor", ground: true }));
      const rod = record(A.disc(F, 10, B.z0, B.rf, { name: `pata${j}.${q}`, owner: "bastidor" }));
      const c = F.o;
      put(`pata${j}.${q}`, [xf, yc, B.z0 / 2], wrap(S(k.cylinder(c[0], c[1], B.rp, 0, 10, P, 20), { tone: "mid" }) + S(k.cylinder(c[0], c[1], B.rf, 10, B.z0 - 10, P, 16), { tone: "mid" }), "cg-ss"), [plate, rod]);
    });
  });
  ANCH.BASTIDOR = [2600, -50, (B.z0 + B.z1) / 2];
}
// los paneles: la cara de adentro y la de afuera pintadas, el corte y la corona con el poliuretano
const panel = (name, a, b, opts = {}) => box(name, a, b, { cls: "cg-panel", cutCls: "cg-foam", r: 0.3, owner: "recinto", ...opts });
panel("piso", [X0 - TP, YB - TP, CG.base.z1], [X1 + TP, 0, ZF]);
{
  // las juntas de los paneles en la cara de adentro de la pared de atrás: cada 1200 mm
  const seams = [1100, 2300, 3500, 4700].map((x) => path3([[x, YB, ZF], [x, YB, ZT]])).join("");
  panel("pared.atras", [X0 - TP, YB - TP, ZF], [X1 + TP, YB, ZT], { topCls: "cg-foam", extra: Ln(seams, { tone: "lo" }) });
}
{
  const NL = CG.notchL, NR = CG.notchR;
  const seamL = Ln(path3([[X0, -975, ZF], [X0, -975, NL.z0]]) + path3([[X0, -975, NL.z1], [X0, -975, ZT]]), { tone: "lo" });
  panel("pared.izq.baja", [X0 - TP, YB, ZF], [X0, 0, NL.z0], { extra: Ln(path3([[X0, -975, ZF], [X0, -975, NL.z0]]), { tone: "lo" }) });
  panel("pared.izq.atras", [X0 - TP, YB, NL.z0], [X0, NL.y0, NL.z1]);
  panel("pared.izq.alta", [X0 - TP, YB, NL.z1], [X0, 0, ZT], { topCls: "cg-foam", extra: Ln(path3([[X0, -975, NL.z1], [X0, -975, ZT]]), { tone: "lo" }) });
  void seamL;
  panel("pared.der.baja", [X1, YB, ZF], [X1 + TP, 0, NR.z0], { extra: Ln(path3([[X1 + TP, -975, ZF], [X1 + TP, -975, NR.z0]]), { tone: "lo" }) });
  panel("pared.der.atras", [X1, YB, NR.z0], [X1 + TP, NR.y0, NR.z1]);
  panel("pared.der.alta", [X1, YB, NR.z1], [X1 + TP, 0, ZT], { topCls: "cg-foam", extra: Ln(path3([[X1 + TP, -975, NR.z1], [X1 + TP, -975, ZT]]), { tone: "lo" }) });
  ANCH.PANEL = [X0 - TP / 2, 0, 2700];
  ANCH.PISO = [3000, 0, (CG.base.z1 + ZF) / 2];
}
// el sumidero del piso, bajo la cubierta: el agua del deshielo sale por aquí
{
  const D = CG.drain, F = FZ(D.x, D.y, ZF);
  const grate = [-0.6, -0.3, 0, 0.3, 0.6].map((f) => { const w = Math.sqrt(1 - f * f) * (D.r - 14); return path3([[D.x - w, D.y + f * (D.r - 14), ZF + 6], [D.x + w, D.y + f * (D.r - 14), ZF + 6]]); }).join("");
  disc("sumidero", F, 0, 6, D.r, { cls: "cg-ss", extra: `<path class="cg-bore" d="${G.circleOf(FZ(D.x, D.y, ZF), 6, D.r - 14, P, 48)}"/>` + Ln(grate, { tone: "mid" }) + Ln(G.circleOf(FZ(D.x, D.y, ZF), 6, D.r - 14, P, 48), { tone: "mid" }) });
  ANCH.SUMIDERO = [D.x + D.r * 0.6, D.y, ZF + 6];
}

/* ====================================================================
   2 · la cubierta de los ventiladores, el tabique, el tabique entre los plenos y la placa que cierra el segundo
   ==================================================================== */
const DK = CG.deck, PT = CG.part, FN = CG.fan;
const fanHoles = FN.xs.map((xf) => A.disc(FZ(xf, FN.y), DK.z0 - 1, DK.z1 + 1, FN.rin, { name: "hueco" }));
{
  // la cubierta: una lámina con los cuatro huecos de los ventiladores (la cara de arriba con sus huecos y el canto de
  // adelante, que es el corte)
  const top = pth1([[X0, DK.y0, DK.z1], [X1, DK.y0, DK.z1], [X1, 0, DK.z1], [X0, 0, DK.z1]].map(pr));
  const holes = FN.xs.map((xf) => G.circleOf(FZ(xf, FN.y), DK.z1, FN.rin, P, 72)).join("");
  const svg = `<g class="iso-solid cg-ss"><path class="iso-fill" fill-rule="evenodd" d="${top}${holes}"/><path class="iso-top" fill-rule="evenodd" d="${top}${holes}"/><path class="iso-line iso-edge" data-tone="mid" d="${top}"/></g>` + cutXZ(rectXZ(X0, DK.z0, X1, DK.z1), "cg-cut");
  put("cubierta", [(X0 + X1) / 2, DK.y0 / 2, (DK.z0 + DK.z1) / 2], svg, [record(A.box([X0, DK.y0, DK.z0], [X1, 0, DK.z1], { name: "cubierta", owner: "cubierta", cut: fanHoles }))]);
}
ANCH.CUBIERTA = [3550, -60, DK.z1];
{
  // el tabique: láminas empernadas cada 1250 mm, con sus pernos
  const xs = [1250, 2500, 3750];
  let seams = xs.map((x) => path3([[x, PT.y1, DK.z1], [x, PT.y1, PT.z1]])).join("");
  const bolts = [];
  for (const x of xs) for (let z = DK.z1 + 75; z < PT.z1 - 40; z += 150) bolts.push(at([x - 22, PT.y1, z]), at([x + 22, PT.y1, z]));
  box("tabique", [X0, PT.y0, DK.z0], [X1, PT.y1, PT.z1], { extra: Ln(seams, { tone: "lo" }) + Dots(bolts, { size: 0.55, tone: "mid" }) });
  ANCH.TABIQUE = [3150, PT.y1, 2380];
}
box("divisor", [CG.div.x0, DK.y0, DK.z1], [CG.div.x1, 0, 1600]);
box("cierre", [CG.div.x1, DK.y0, CG.b2.z - 10], [CG.seal.x1, 0, CG.b2.z]);
ANCH.DIVISOR = [CG.div.x1, -40, 1200];

/* ====================================================================
   3 · los ventiladores axiales: campana de entrada, envolvente, brida sobre la cubierta, rodete y el motor colgado
   de dos platinas bajo la campana
   ==================================================================== */
FN.xs.forEach((xf, q) => {
  const own = `vent${q}`, F = FZ(xf, FN.y);
  turned(`vent${q}.campana`, F, [[FN.bell, FN.rbell - 10], [FN.bell, FN.rbell], [FN.z0, FN.rout + 2], [FN.z0, FN.rin]], { owner: own });
  // la envolvente, en dos mitades (la de atrás y la que mira al lector), porque el rodete va adentro
  {
    const phi = Math.atan2(V3[1], V3[0]), m = 20;
    const half = (a0) => { const o = [], i = []; for (let j = 0; j <= m; j++) { const a = a0 + (PI * j) / m; o.push([FN.rout * Math.cos(a), FN.rout * Math.sin(a)]); i.push([FN.rin * Math.cos(a), FN.rin * Math.sin(a)]); } return [...o, ...i.reverse()]; };
    fp(`vent${q}.envolvente.atras`, F, half(phi + PI / 2), FN.z0, DK.z0, { owner: own });
    fp(`vent${q}.envolvente`, F, half(phi - PI / 2), FN.z0, DK.z0, { owner: own });
  }
  // la brida sobre la cubierta: un anillo plano (la cara de arriba con su hueco y el canto de afuera) con sus pernos
  const top = DK.z1 + FN.flT, bore = G.circleOf(F, top, FN.rin, P, 72);
  {
    const ring = (r, m = 40) => Array.from({ length: m }, (_, i) => [r * Math.cos((TAU * i) / m), r * Math.sin((TAU * i) / m)]);
    const side = X.prismSvg(C, ring(FN.rfl), DK.z1, top, { F, tone: "mid", cls: "cg-ss", cap: "none" });
    const face = G.circleOf(F, top, FN.rfl, P, 72) + bore;
    const bolts = G.dotsOf(F, top, (FN.rin + FN.rfl) / 2, 16, P, { all: true });
    const svg = side + `<g class="iso-solid cg-ss"><path class="iso-fill" fill-rule="evenodd" d="${face}"/><path class="iso-top" fill-rule="evenodd" d="${face}"/><path class="iso-line iso-edge" data-tone="mid" d="${face}"/></g>` + Dots(bolts, { size: 0.5, tone: "mid" });
    put(`vent${q}.brida`, [xf, FN.y, DK.z1 + FN.flT / 2], svg, [record(A.ring(F, DK.z1, top, FN.rin, FN.rfl, { name: `vent${q}.brida`, owner: own }))]);
  }
  // el rodete: cubo y seis álabes inclinados, bajo la cubierta, recortados a la boca; detrás, el fondo oscuro
  {
    const id = `cgBoca${DETN}_${q}`;
    DEFS.push(`<clipPath id="${id}"><path d="${bore}"/></clipPath>`);
    let blades = "";
    const bl = [];
    for (let b = 0; b < FN.nb; b++) {
      const th = (TAU * b) / FN.nb + 0.3;
      const pts = [[FN.rh + 4, th - 0.32, FN.zh1 - 4], [FN.rh + 4, th + 0.32, FN.zh0 + 4], [FN.rin - 12, th + 0.2, FN.zh0 + 8], [FN.rin - 12, th - 0.2, FN.zh1 - 6]].map(([r, a, z]) => [xf + r * Math.cos(a), FN.y + r * Math.sin(a), z]);
      const n = G.cross3(G.sub3(pts[2], pts[0]), G.sub3(pts[1], pts[3]));
      bl.push({ d: G.dot3(G.lerp3(pts[0], pts[2], 0.5), V3), svg: flatFace(pts, G.dot3(n, V3) < 0 ? G.mul3(n, -1) : n, "cg-cast") });
    }
    bl.sort((a, b) => a.d - b.d).forEach((b) => (blades += b.svg));
    const hub = X.prismSvg(C, Array.from({ length: 40 }, (_, i) => [FN.rh * Math.cos((TAU * i) / 40), FN.rh * Math.sin((TAU * i) / 40)]), FN.zh0, FN.zh1, { F, tone: "mid", cls: "cg-cast" });
    const nose = `<path class="cg-dark" d="${G.circleOf(F, FN.zh1, 26, P, 24)}"/>`;
    const dark = `<path class="cg-bore" d="${bore}"/>`;
    put(`vent${q}.rodete`, [xf, FN.y, (FN.zh0 + FN.zh1) / 2], `<g clip-path="url(#${id})">${dark}${blades}${hub}${nose}</g>`, [record(A.disc(F, FN.zh0, FN.zh1, FN.rin - 12, { name: `vent${q}.rodete`, owner: own }))]);
  }
  disc(`vent${q}.eje`, F, FN.zm1, FN.zh0, FN.rs, { owner: own });
  // las dos platinas del puente, bajo la campana
  for (const [p, dy] of FN.bar.y.entries()) box(`vent${q}.platina${p}`, [xf - FN.bar.half, FN.y + dy - FN.bar.w / 2, FN.bar.z0], [xf + FN.bar.half, FN.y + dy + FN.bar.w / 2, FN.bar.z1], { owner: own });
  // el motor: carcasa con aletas, tapa de abajo y la caja de conexiones que mira al lector
  {
    const Fm = FZ(xf, FN.y, 0);
    const fins = G.ribsOf(Fm, FN.zm0 + 30, FN.zm1 - 22, FN.rm, 20, P, { fade: [0.05, 0.45], seams: true });
    turned(`vent${q}.motor`, Fm, [[FN.zm0, 0], [FN.zm0, FN.rm - 18], [FN.zm0 + 20, FN.rm - 4], [FN.zm0 + 30, FN.rm], [FN.zm1 - 22, FN.rm], [FN.zm1 - 10, FN.rm - 8], [FN.zm1, FN.rm - 8], [FN.zm1, 0]], { cls: "cg-motor", owner: own, extra: k.fadedSvg(fins, { tone: "lo" }) });
    const tbY = FN.y + FN.rm - 6;
    box(`vent${q}.bornera`, [xf - 55, tbY, FN.zm0 + 80], [xf + 55, tbY + 52, FN.zm0 + 170], { cls: "cg-motor", owner: own });
  }
  if (q === 2) { ANCH.MOTOR = [xf - 40, FN.y + FN.rm, FN.zm0 + 120]; ANCH.CAMPANA = [xf - FN.rbell * 0.75, FN.y + FN.rbell * 0.55, FN.bell + 20]; }
  if (q === 1) { ANCH.RODETE = [xf + 120, FN.y + 220, FN.zh1]; }
});

/* ====================================================================
   4 · las bandas: tambores con su eje y sus chumaceras en el tabique, la banda perforada (tramo de arriba, de
   retorno y las vueltas), la rejilla que la sostiene con su riel de adelante, el eje de levas que sacude la banda 1, el
   vertedero y los faldones de atrás
   ==================================================================== */
function belt(tag, b, zc) {
  const zt = b.z, own = `banda${tag}`;
  // los tambores (el extremo de adelante, en el corte) y sus ejes y chumaceras
  for (const [nm, xc] of [["cola", b.xt], ["cabeza", b.xh]]) {
    const Fd = FYo(xc, zc);
    disc(`${own}.eje.${nm}`, Fd, PT.y1 + 48, -WB, CG.rsh, { owner: own });
    // la chumacera de brida: placa cuadrada con cuatro pernos y el alojamiento
    const pl = [[xc - 75, zc - 75], [xc + 75, zc - 75], [xc + 75, zc + 75], [xc - 75, zc + 75]];
    const bolts = pl.map(([x, z]) => at([x + (x < xc ? 18 : -18), PT.y1 + 16, z + (z < zc ? 18 : -18)]));
    fp(`${own}.chumacera.${nm}`, FY, pl, PT.y1, PT.y1 + 16, { owner: own });
    disc(`${own}.alojamiento.${nm}`, Fd, PT.y1 + 16, PT.y1 + 48, 52, { owner: own, extra: Dots(bolts, { size: 0.55, tone: "mid" }) });
  }
  // la banda: tramos rectos y vueltas, cada uno un prisma a lo largo de y hasta el corte
  const xa = b.xt, xb = b.xh, rI = RD, rO = RD + TB;
  // el tramo de arriba va en el elemento del tambor de la cabeza (sin su cara del extremo, que es la misma banda que
  // sigue por la vuelta): la vuelta tapa ese extremo y el tramo tapa el tambor
  const run = rectXZ(xa, zt - TB, xb, zt);
  yCut(`${own}.abajo`, rectXZ(xa, zc - rO, xb, zc - rI), -WB, { owner: own });
  const arc = (xc, a0, a1, m = 24) => { const o = [], i = []; for (let j = 0; j <= m; j++) { const a = a0 + ((a1 - a0) * j) / m; o.push([xc + rO * Math.cos(a), zc + rO * Math.sin(a)]); i.push([xc + rI * Math.cos(a), zc + rI * Math.sin(a)]); } return [...o, ...i.reverse()]; };
  // cada vuelta en dos cuartos: el de arriba va delante del tambor y el de abajo, detrás; las caras del corte del
  // tambor, de su eje y de la vuelta van juntas en un elemento, delante de todo lo de atrás
  const vueltas = { cola: [arc(xa, PI / 2, PI, 12), arc(xa, PI, 1.5 * PI, 12)], cabeza: [arc(xb, 0, PI / 2, 12), arc(xb, -PI / 2, 0, 12)] };
  for (const [nm, xc] of [["cola", xa], ["cabeza", xb]]) {
    const [up, dn] = vueltas[nm];
    // el tambor y su vuelta en un solo elemento, en el orden en que se tapan: el cuarto de abajo de la vuelta (que el
    // tambor tapa), el tambor y el cuarto de arriba (que tapa al tambor)
    const Fd = FYo(xc, zc), m = 40, rr = RD - 1;
    const drum = X.prismSvg(C, Array.from({ length: m }, (_, i) => [rr * Math.cos((TAU * i) / m), rr * Math.sin((TAU * i) / m)]), -WB, -0.3, { F: Fd, tone: "mid", cls: "cg-ss", cap: "none" });
    const wrapSvg = (poly) => X.prismSvg(C, poly, -WB, -0.3, { F: FY, tone: "mid", cls: "cg-ss", cap: "none" });
    const shapes = [record(A.disc(Fd, -WB, -0.3, rr, { name: `${own}.tambor.${nm}`, owner: own })), record(A.prism(FY, up, -WB, -0.3, { name: `${own}.vuelta.${nm}`, owner: own })), record(A.prism(FY, dn, -WB, -0.3, { name: `${own}.vuelta.${nm}`, owner: own }))];
    let svg0 = wrapSvg(dn) + drum + wrapSvg(up);
    if (nm === "cabeza") {
      svg0 += X.prismSvg(C, run, -WB, 0, { F: FY, tone: "mid", cls: "cg-ss", cap: "none", skip: new Set([1]) }) + cutXZ(run, "cg-cut");
      shapes.push(record(A.prism(FY, run, -WB, 0, { name: `${own}.arriba`, owner: own })));
    }
    put(`${own}.tambor.${nm}`, [xc, -WB / 2, zc], svg0, shapes);
    const disk = (r, cls) => { const d = G.circleOf(Fd, 0, r, P, 64); return `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`; };
    const svg = cutXZ(up, "cg-cut") + cutXZ(dn, "cg-cut") + disk(RD - 1, "cg-cut") + disk(CG.rsh, "cg-cut1");
    put(`${own}.corte.${nm}`, [xc, 0, zc], svg, [record(A.prism(FY, up, -0.3, 0, { name: `${own}.corte.${nm}`, owner: own })), record(A.prism(FY, dn, -0.3, 0, { name: `${own}.corte.${nm}`, owner: own })), record(A.disc(Fd, -0.3, 0, RD - 1, { name: `${own}.corte.${nm}`, owner: own }))]);
  }
  // la rejilla: barras de 20 × 28 mm cada 200, de tabique al corte, sobre el riel de adelante
  const Bz1 = zt - TB, Bz0 = Bz1 - CG.bars.h;
  const xs = [];
  for (let x = xa + 180; x < xb - 120; x += CG.bars.pitch) xs.push(x);
  xs.forEach((x, i) => yCut(`${own}.barra${i}`, rectXZ(x - CG.bars.w / 2, Bz0, x + CG.bars.w / 2, Bz1), PT.y1, { owner: own }));
  const rl = CG.rail;
  // la banda 1 no lleva riel adelante: así se ve el eje de levas que la sacude
  if (tag === 2) box(`${own}.riel`, [xs[0] - 40, rl.y0, Bz0 - rl.h], [xs[xs.length - 1] + 40, rl.y1, Bz0], { owner: own });
  return { xs, Bz0, Bz1 };
}
const B1 = belt(1, CG.b1, ZC1), B2 = belt(2, CG.b2, ZC2);
ANCH.BANDA1 = [CG.b1.xt + 260, 0, CG.b1.z - 5];
ANCH.BANDA2 = [CG.b2.xh - 300, 0, CG.b2.z - 5];
ANCH.TAMBOR = [CG.b2.xh + 40, 0, ZC2 - 60];
ANCH.REJILLA = [B2.xs[3], 0, B2.Bz0 + 8];
ANCH.CHUMACERA = [CG.b2.xt + 40, PT.y1 + 48, ZC2 + 30];
{
  // el eje de levas que sacude la banda 1 (la agitación de la banda, que Berk da como opcional)
  const M = CG.cam, zc = B1.Bz1 - M.r - M.e, F = FYo(M.x, zc);
  const pl = [[M.x - 70, zc - 55], [M.x + 70, zc - 55], [M.x + 70, zc + 30], [M.x - 70, zc + 30]];
  fp("levas.chumacera", FY, pl, PT.y1, PT.y1 + 16, { owner: "levas" });
  disc("levas.alojamiento", F, PT.y1 + 16, PT.y1 + 44, 44, { owner: "levas" });
  // el eje, en tramos entre las levas (cada leva lo abraza)
  const stops = [PT.y1 + 44, ...M.ys.flatMap((yc) => [yc - M.w / 2, yc + M.w / 2]), M.y1];
  for (let i = 0; i < stops.length; i += 2) disc(`levas.eje${i / 2}`, F, stops[i], stops[i + 1], M.rs, { owner: "levas" });
  M.ys.forEach((yc, i) => disc(`levas.leva${i}`, { o: [M.x, 0, zc + M.e], a: YD, u: XD, v: ZD }, yc - M.w / 2, yc + M.w / 2, M.r, { owner: "levas", cls: "cg-cast" }));
  ANCH.LEVAS = [M.x - 12, M.ys[2] + M.w / 2, zc + M.e - 18];
}
{
  // el vertedero, con su ángulo empernado al tabique
  const Wr = CG.weir;
  yCut("vertedero", rectXZ(Wr.x0, CG.b1.z + Wr.gap, Wr.x1, CG.b1.z + Wr.gap + Wr.h), PT.y1);
  ANCH.VERTEDERO = [Wr.x1, -60, CG.b1.z + Wr.gap + Wr.h];
  // los faldones de atrás: tapan la rendija entre el borde de la banda y el tabique
  const FXs = { o: [0, 0, 0], a: XD, u: YD, v: ZD };
  fp("faldon1", FXs, [[PT.y1, CG.b1.z + 58], [PT.y1, CG.b1.z + 50], [-WB - 3, CG.b1.z + 3], [-WB + 5, CG.b1.z + 3]], CG.bed1.x0 - 30, Wr.x0, { owner: "faldon1" });
  fp("faldon2", FXs, [[PT.y1, CG.b2.z + 68], [PT.y1, CG.b2.z + 60], [-WB - 3, CG.b2.z + 3], [-WB + 5, CG.b2.z + 3]], CG.b2.xt + 80, CG.b2.xh - 40, { owner: "faldon2" });
}

/* ====================================================================
   5 · las arvejas: en el alimentador, la cortina que cae a la banda 1, el lecho fluidizado, lo que pasa el vertedero
   y cae a la banda 2, la capa quieta de 10 cm y lo que cae al canal de la salida. En la vista entera son una textura
   a su tamaño real (6 mm); en los detalles, una por una.
   ==================================================================== */
// mosaicos de arvejas en coordenadas de la cara (mm), que se repiten sin costura
function peaTile(id, T, dmin, tries) {
  const pts = [];
  for (let i = 0; i < tries; i++) {
    const u = rnd() * T, v = rnd() * T;
    let ok = true;
    for (const [a, b] of pts) { let du = Math.abs(a - u), dv = Math.abs(b - v); du = Math.min(du, T - du); dv = Math.min(dv, T - dv); if (du * du + dv * dv < dmin * dmin) { ok = false; break; } }
    if (ok) pts.push([u, v]);
  }
  let dp = "", dh = "";
  const circ = (u, v, r) => `M${r10(u - r)} ${r10(v)}a${r10(r)} ${r10(r)} 0 1 0 ${r10(2 * r)} 0a${r10(r)} ${r10(r)} 0 1 0 ${r10(-2 * r)} 0Z`;
  for (const [u, v] of pts) for (const du of [-T, 0, T]) for (const dv of [-T, 0, T]) {
    const uu = u + du, vv = v + dv;
    if (uu < -4 || uu > T + 4 || vv < -4 || vv > T + 4) continue;
    dp += circ(uu, vv, 2.9); dh += circ(uu - 0.9, vv + 0.9, 1.1);
  }
  DEFS.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${T}" height="${T}"><path class="cg-pe" d="${dp}"/><path class="cg-ph" d="${dh}"/></pattern>`);
}
function facePattern(id, base, to3) {
  const O = pr(to3(0, 0)), U1 = pr(to3(1, 0)), V1 = pr(to3(0, 1));
  DEFS.push(`<pattern id="${id}" href="#${base}" patternTransform="matrix(${[U1[0] - O[0], U1[1] - O[1], V1[0] - O[0], V1[1] - O[1], O[0], O[1]].map((v) => +v.toFixed(5)).join(" ")})"/>`);
  return id;
}
if (!DET) {
  peaTile("cgDenso", 60, 6.2, 900);
  peaTile("cgSuelto", 60, 7.6, 500);
}
const faceXZ = (z0) => (u, v) => [u, 0, v];
const faceXY = (z) => (u, v) => [u, v, z];
// una cara texturada: el fondo (los huecos entre arvejas) y el patrón encima
const texFace = (poly3, bgCls, pat) => { const d = pth1(poly3.map(pr)); return `<path class="${bgCls}" d="${d}"/>` + (pat ? `<path fill="url(#${pat})" d="${d}"/>` : ""); };
// la superficie del lecho fluidizado: ondula y tiene cráteres donde revientan las burbujas
const wave1 = (x) => 9 * Math.sin(x / 61 + 0.4) + 5 * Math.sin(x / 23 + 1.9) + 3 * Math.sin(x / 9.7);
const Z1top = (x) => CG.b1.z + CG.bed1.h - 8 + wave1(x);
const PEA = { r: 3 };

// puntos en 3D de una cortina de arvejas que cae (posición inicial, velocidad horizontal), para la vista entera
function curtain(name, x0, z0, vx, zEnd, ys, n, cls, ref) {
  const g = 9807;
  let d = "";
  const pts3 = [];
  for (let i = 0; i < n; i++) {
    const tEnd = Math.sqrt((2 * (z0 - zEnd)) / g), t = rnd() * tEnd;
    const x = x0 + vx * t + (rnd() - 0.5) * 18, z = z0 - 0.5 * g * t * t, y = ys[0] + rnd() * (ys[1] - ys[0]);
    pts3.push([x, y, z]);
  }
  pts3.sort((a, b) => G.dot3(a, V3) - G.dot3(b, V3));
  for (const p of pts3) { const [sx, sy] = pr(p); d += `M${r10(sx)} ${r10(sy)}h0`; }
  const xs = pts3.map((p) => p[0]), zs = pts3.map((p) => p[2]);
  const shape = A.box([Math.min(...xs) - 3, ys[0] - 3, Math.min(...zs) - 3], [Math.max(...xs) + 3, ys[1] + 3, Math.max(...zs) + 3], { name, owner: name });
  put(name, ref, `<path class="${cls}" style="stroke-width:${r10(Math.max(1.1, 2 * PEA.r * KS))}px" d="${d}"/>`, [shape]);
}

const PAN = CG.pan;
if (!DET) {
  /* la capa del alimentador */
  {
    const zt = PAN.z0 + PAN.t + PAN.layer, xa = PAN.x0 + 60, xb = PAN.x1, ya = PAN.y0 + 6, yb = PAN.y1 - 6;
    const pat = facePattern("cgPanT", "cgDenso", faceXY(zt));
    const top = (x0, x1) => texFace([[x0, ya, zt], [x1, ya, zt], [x1, yb, zt], [x0, yb, zt]], "cg-bed-t", pat);
    const front = texFace([[xb, ya, PAN.z0 + PAN.t], [xb, yb, PAN.z0 + PAN.t], [xb, yb, zt], [xb, ya, zt]], "cg-bed-f", facePattern("cgPanX", "cgDenso", (u, v) => [xb, u, v]));
    put("arvejas.alimentador", [(xa + X0) / 2, (ya + yb) / 2, zt - 10], top(xa, X0), [A.box([xa, ya, PAN.z0 + PAN.t], [X0, yb, zt], { name: "arvejas.alimentador" })]);
    put("arvejas.alimentador.adentro", [(X0 + xb) / 2, (ya + yb) / 2, zt - 10], top(X0, xb) + front, [A.box([X0, ya, PAN.z0 + PAN.t], [xb, yb, zt], { name: "arvejas.alimentador.adentro" })]);
    ANCH.ENTRADA = [-700, -560, zt];
  }
  curtain("cortina.entrada", PAN.x1 + 4, PAN.z0 + PAN.t + 12, 380, CG.b1.z + CG.bed1.h + 16, [PAN.y0 + 10, PAN.y1 - 10], 260, "cg-pe-c", [PAN.x1 + 40, -600, 2000]);

  /* el lecho fluidizado de la primera etapa: la cara del corte con burbujas y la superficie que borbotea */
  {
    const xa = CG.bed1.x0, xb = CG.bed1.x1, zb = CG.b1.z;
    const N = 80, xsS = Array.from({ length: N + 1 }, (_, i) => xa + ((xb - xa) * i) / N);
    const frontPoly = [[xa, 0, zb], [xb, 0, zb], ...xsS.slice().reverse().map((x) => [x, 0, Z1top(x)])];
    let svg = texFace(frontPoly, "cg-bed-f", facePattern("cgB1F", "cgSuelto", faceXZ()));
    // las burbujas de la cara del corte: huecos claros, más grandes arriba
    const bub = [[560, 22, 15, 9], [700, 40, 26, 17], [880, 18, 16, 10], [1010, 36, 30, 19], [1190, 28, 19, 12], [1330, 43, 28, 18], [1470, 20, 14, 9], [1590, 38, 24, 16], [1760, 30, 20, 13]];
    for (const [xc, zr, rx, rz] of bub) {
      const pts = Array.from({ length: 28 }, (_, i) => { const a = (TAU * i) / 28; return [xc + rx * Math.cos(a), 0, zb + zr + rz * Math.sin(a) * (Math.sin(a) < 0 ? 0.8 : 1)]; });
      svg += `<path class="cg-burb" d="${pth1(pts.map(pr))}"/>`;
    }
    // la superficie: arvejas sueltas sobre un fondo claro (el lecho expandido visto desde arriba)
    const topPoly = [...xsS.map((x) => [x, 0, Z1top(x)]), [xb, -WB, CG.b1.z + CG.bed1.h - 8], [xa, -WB, CG.b1.z + CG.bed1.h - 8]];
    svg += texFace(topPoly, "cg-bed-t", facePattern("cgB1T", "cgSuelto", faceXY(CG.b1.z + CG.bed1.h - 8)));
    svg += Ln(k.pathOf(xsS.map((x) => at([x, 0, Z1top(x)]))), { tone: "lo" });
    put("lecho1", [(xa + xb) / 2, -WB / 2, zb + 30], svg, [A.box([xa, -WB, zb], [xb, 0, CG.b1.z + CG.bed1.h + 10], { name: "lecho1" })]);
    // las arvejas que saltan sobre el lecho
    let d = "";
    const pts3 = [], xs1 = PAN.x1 + 200;   // pasada la cortina de la entrada
    for (let i = 0; i < 340; i++) {
      const x = xs1 + rnd() * (xb - xs1 - 20), y = -WB + 20 + rnd() * (WB - 25), h = rnd() ** 2.2 * CG.bed1.jump;
      pts3.push([x, y, Z1top(x) + 3 + h]);
    }
    pts3.sort((a, b) => G.dot3(a, V3) - G.dot3(b, V3));
    for (const p of pts3) { const [sx, sy] = pr(p); d += `M${r10(sx)} ${r10(sy)}h0`; }
    put("lecho1.saltan", [(xa + xb) / 2, -WB / 2, CG.b1.z + CG.bed1.h + 30], `<path class="cg-pe-c" style="stroke-width:${r10(Math.max(1.1, 2 * PEA.r * KS))}px" d="${d}"/>`, [A.box([xs1, -WB, CG.b1.z + CG.bed1.h - 20], [xb, 0, CG.b1.z + CG.bed1.h + CG.bed1.jump + 12], { name: "lecho1.saltan" })]);
    ANCH.LECHO1 = [1100, 0, zb + 30];
    ANCH.BURBUJA = [1010, 0, zb + 36];
  }
  /* lo que pasa el vertedero: una capa delgada sobre la banda hasta el tambor, y la cortina que cae a la banda 2 */
  {
    const xa = CG.weir.x1, xb = CG.b1.xh + 30, zb = CG.b1.z, zt = zb + 12;
    const front = texFace([[xa, 0, zb], [xb, 0, zb], [xb, 0, zt], [xa, 0, zt]], "cg-bed-f", facePattern("cgVF", "cgDenso", faceXZ()));
    const top = texFace([[xa, 0, zt], [xb, 0, zt], [xb, -WB, zt], [xa, -WB, zt]], "cg-bed-t", facePattern("cgVT", "cgDenso", faceXY(zt)));
    put("rebose", [(xa + xb) / 2, -WB / 2, zb + 6], front + top, [A.box([xa, -WB, zb], [xb, 0, zt], { name: "rebose" })]);
  }
  curtain("cortina.vertedero", CG.b1.xh + RD + TB + 4, CG.b1.z - 30, 260, CG.b2.z + CG.bed2.h + 6, [-WB + 10, -10], 240, "cg-pe-c", [CG.b1.xh + 160, -WB / 2, 1700]);

  /* la capa quieta de la segunda etapa: 10 cm, con su rampa donde caen las arvejas */
  {
    const xa = CG.b2.xt - 30, xr = CG.bed2.x0, xb = CG.bed2.x1, zb = CG.b2.z, zt = zb + CG.bed2.h;
    const ramp = Array.from({ length: 13 }, (_, i) => { const t = i / 12, x = xa + (xr - xa) * t; return [x, zb + (zt - zb) * (0.5 - 0.5 * Math.cos(PI * t))]; });
    const sect = [[xa, zb], [xb + 40, zb], [xb + 40, zb + 40], [xb, zt], ...ramp.slice().reverse().slice(0, -1)];
    const frontPoly = sect.map(([x, z]) => [x, 0, z]);
    let svg = texFace(frontPoly, "cg-bed-f", facePattern("cgB2F", "cgDenso", faceXZ()));
    const topPoly = [[xr, 0, zt], [xb, 0, zt], [xb, -WB, zt], [xr, -WB, zt]];
    svg += texFace(topPoly, "cg-bed-t", facePattern("cgB2T", "cgDenso", faceXY(zt)));
    // la rampa vista desde arriba (franjas a la altura de cada paso)
    for (let i = 0; i < 12; i++) {
      const [xA, zA] = ramp[i], [xB, zB] = ramp[i + 1];
      svg += texFace([[xA, 0, zA], [xB, 0, zB], [xB, -WB, zB], [xA, -WB, zA]], "cg-bed-t", null);
    }
    svg += `<path fill="url(#cgB2T)" d="${pth1([[xa, 0, zb + 2], [xr, 0, zt], [xr, -WB, zt], [xa, -WB, zb + 2]].map(pr))}"/>`;
    svg += Ln(path3([[xr, 0, zt], [xb, 0, zt], [xb + 40, 0, zb + 40]]) + k.pathOf(ramp.map(([x, z]) => at([x, 0, z]))), { tone: "lo" });
    put("lecho2", [(xa + xb) / 2, -WB / 2, zb + 50], svg, [A.box([xa, -WB, zb], [xb + 40, 0, zt], { name: "lecho2" })]);
    ANCH.LECHO2 = [3050, 0, zb + 50];
  }
  curtain("cortina.salida", CG.b2.xh + RD + TB + 4, CG.b2.z - 40, 200, 1300, [-WB + 10, -40], 200, "cg-pe-c", [CG.b2.xh + 170, -WB / 2, 1350]);
}

/* ====================================================================
   6 · el canal de la salida, que pasa por la ranura de la pared derecha
   ==================================================================== */
{
  const Ch = CG.chute, a3 = [Ch.a[0], 0, Ch.a[1]], b3 = [Ch.b[0], 0, Ch.b[1]];
  const ax = G.unit3(G.sub3(b3, a3)), L = G.len3(G.sub3(b3, a3)), nv = G.unit3(G.cross3(ax, [0, -1, 0]));
  const nvz = nv[2] > 0 ? nv : G.mul3(nv, -1);
  const F = { o: a3, a: ax, u: YD, v: nvz };
  // el canal en U, en tres piezas como la bandeja del alimentador
  fp("canal", F, [[Ch.y0, 0], [Ch.y1, 0], [Ch.y1, Ch.t], [Ch.y0, Ch.t]], 0, L, { owner: "canal" });
  fp("canal.atras", F, [[Ch.y0, Ch.t], [Ch.y0 + Ch.t, Ch.t], [Ch.y0 + Ch.t, Ch.wall], [Ch.y0, Ch.wall]], 0, L, { owner: "canal" });
  fp("canal.frente", F, [[Ch.y1 - Ch.t, Ch.t], [Ch.y1, Ch.t], [Ch.y1, Ch.wall], [Ch.y1 - Ch.t, Ch.wall]], 0, L, { owner: "canal" });
  ANCH.CANAL = G.add3(G.add3(a3, G.mul3(ax, L * 0.82)), [0, Ch.y1, Ch.wall * 0.6]);
  if (!DET) {
    // las arvejas congeladas en el canal
    const s0 = 80, s1 = L - 10, h = 22, ya = Ch.y0 + Ch.t, yb = Ch.y1 - Ch.t;
    const p3 = (s, y, v) => G.add3(G.add3(G.add3(a3, G.mul3(ax, s)), [0, y, 0]), G.mul3(nvz, v));
    const top = [p3(s0, ya, Ch.t + h), p3(s1, ya, Ch.t + h), p3(s1, yb, Ch.t + h), p3(s0, yb, Ch.t + h)];
    const O = p3(0, 0, Ch.t + h);
    const pat = facePattern("cgCanT", "cgDenso", (u, v) => G.add3(G.add3(O, G.mul3(ax, u)), [0, v, 0]));
    put("arvejas.canal", p3((s0 + s1) / 2, (ya + yb) / 2, Ch.t + h / 2), texFace(top, "cg-bed-t", pat), [A.prism(F, [[ya, Ch.t], [yb, Ch.t], [yb, Ch.t + h], [ya, Ch.t + h]], s0, s1, { name: "arvejas.canal" })]);
    ANCH.SALIDA = p3(L - 60, (ya + yb) / 2, Ch.t + h);
  }
}

/* ====================================================================
   7 · el alimentador vibratorio: bandeja en U sobre cuatro ballestas, los dos motovibradores, las vigas de la base
   sobre dos patas afuera y dos ménsulas en la pared
   ==================================================================== */
{
  const FD = CG.feeder;
  // la bandeja en U, en tres piezas (el fondo, el lado de atrás y el de adelante), para que las arvejas queden entre
  // ellas en el orden de pintura
  // y cada una partida en la cara de adentro de la pared: lo de afuera queda detrás de la pared y lo de adentro, delante
  for (const [tag, xa, xb] of [["", PAN.x0, X0], [".adentro", X0, PAN.x1]]) {
    box(`bandeja${tag}`, [xa, PAN.y0, PAN.z0], [xb, PAN.y1, PAN.z0 + PAN.t], { owner: "alimentador" });
    box(`bandeja.atras${tag}`, [xa, PAN.y0, PAN.z0 + PAN.t], [xb, PAN.y0 + PAN.t, PAN.z0 + PAN.wall], { owner: "alimentador" });
    box(`bandeja.frente${tag}`, [xa, PAN.y1 - PAN.t, PAN.z0 + PAN.t], [xb, PAN.y1, PAN.z0 + PAN.wall], { owner: "alimentador" });
  }
  box("bandeja.fondo", [PAN.x0 - 6, PAN.y0, PAN.z0], [PAN.x0, PAN.y1, PAN.z0 + PAN.wall], { owner: "alimentador" });
  ANCH.BANDEJA = [PAN.x0 + 300, PAN.y1, PAN.z0 + PAN.wall - 20];
  FD.beams.forEach(([xa, xb], i) => box(`travesano${i}`, [xa, PAN.y0, PAN.z0 - 40], [xb, PAN.y1, PAN.z0], { owner: "alimentador" }));
  // las ballestas: placas inclinadas de la viga de la base al travesaño
  FD.beams.forEach(([xa, xb], i) => FD.by.forEach(([ya, yb], j) => {
    const xc = (xa + xb) / 2;
    fp(`ballesta${i}.${j}`, { o: [0, 0, 0], a: YD, u: XD, v: ZD }, [[xc - 55, FD.bz[1]], [xc - 45, FD.bz[1]], [xc + 5, PAN.z0 - 40], [xc - 5, PAN.z0 - 40]], ya + 8, yb - 8, { owner: "alimentador", cls: "cg-spring" });
  }));
  ANCH.BALLESTA = [(FD.beams[1][0] + FD.beams[1][1]) / 2 - 25, FD.by[1][1] - 8, (FD.bz[1] + PAN.z0 - 40) / 2];
  FD.by.forEach(([ya, yb], j) => {
    box(`viga${j}`, [FD.bx[0], ya, FD.bz[0]], [FD.bx[1], yb, FD.bz[1]], { owner: "alimentador" });
    box(`mensula${j}`, [FD.cx, ya, FD.cz[0]], [X0 - TP, yb, FD.cz[1]], { owner: "alimentador" });
    box(`pata.al${j}`, [FD.bx[0], ya, 10], [FD.bx[0] + FD.leg, yb, FD.bz[0]], { owner: "alimentador" });
    box(`pata.al${j}.placa`, [FD.bx[0] - 20, ya - 20, 0], [FD.bx[0] + FD.leg + 20, yb + 20, 10], { owner: "alimentador", ground: true });
  });
  // los dos motovibradores, uno en cada lado de la bandeja, sobre una placa soldada; el de atrás no se ve
  [[PAN.y1, 1], [PAN.y0, -1]].forEach(([yw, sg], i) => {
    const zc = PAN.z0 + PAN.wall / 2 + 6, xm = FD.motorX, yp = yw + sg * 16;
    box(`vibrador${i}.placa`, [xm - 120, Math.min(yw, yp), zc - 70], [xm + 120, Math.max(yw, yp), zc + 70], { owner: "alimentador" });
    const F = { o: [xm, 0, zc], a: [0, sg, 0], u: XD, v: ZD }, s0 = sg * yp;
    const fins = G.ribsOf(F, s0 + 40, s0 + 210, FD.motorR, 22, P, { fade: [0.05, 0.45], seams: true });
    disc(`vibrador${i}.pie`, F, s0, s0 + 40, FD.motorR - 10, { owner: "alimentador", cls: "cg-motor" });
    disc(`vibrador${i}`, F, s0 + 40, s0 + 210, FD.motorR, { owner: "alimentador", cls: "cg-motor", extra: k.fadedSvg(fins, { tone: "lo" }) });
    disc(`vibrador${i}.tapa`, F, s0 + 210, s0 + 260, FD.motorR - 6, { owner: "alimentador", cls: "cg-motor" });
    if (i === 0) ANCH.VIBRADOR = [xm, yp + 230, zc + FD.motorR - 10];
  });
}

/* ====================================================================
   8 · el evaporador: dos laterales, las placas de los extremos, el paquete de aletas con la escarcha arriba, las
   curvas de retorno a la derecha y los cabezales del refrigerante que salen por la pared de atrás; encima, el
   rociador del deshielo
   ==================================================================== */
const CO = CG.coil;
{
  box("serpentin.lado0", [CO.x0, PT.y0 - CO.plate, CO.z0], [CO.x1, PT.y0, CO.z1], { owner: "serpentin" });
  box("serpentin.lado1", [CO.x0, YB, CO.z0], [CO.x1, YB + CO.plate, CO.z1], { owner: "serpentin" });
  box("serpentin.extremo0", [CO.x0, YB + CO.plate, CO.z0], [CO.x0 + CO.plate, PT.y0 - CO.plate, CO.z1], { owner: "serpentin" });
  // la placa de la derecha, con las bocas de los tubos
  {
    let holes = "";
    for (const y of CO.rows) for (const z of CO.ranks) holes += G.circleOf(FXo(y, z, CO.x1), 0, CO.rt + 3, P, 18);
    box("serpentin.extremo1", [CO.x1 - CO.plate, YB + CO.plate, CO.z0], [CO.x1, PT.y0 - CO.plate, CO.z1], { owner: "serpentin", extra: Ln(holes, { tone: "lo" }) });
  }
  // las aletas, de canto (una cada 12 mm), con la escarcha en el borde de arriba, por donde entra el aire
  {
    const ya = YB + CO.plate, yb = PT.y0 - CO.plate, xa = CO.x0 + CO.plate, xb = CO.x1 - CO.plate, z = CO.z1;
    let fins = "", frost = "";
    for (let x = xa + CO.fin / 2; x < xb; x += CO.fin) fins += path3([[x, ya, z], [x, yb, z]]);
    // la escarcha: grumos en el borde de las aletas, más gruesos donde el aire entra primero
    for (let i = 0; i < (DET ? 0 : 1100); i++) {
      const x = xa + 10 + rnd() * (xb - xa - 20), y = ya + 10 + rnd() * (yb - ya - 20), l = 6 + rnd() * 30;
      const c0 = pr([x, y, z]), c1 = pr([x, y + l, z]);
      frost += `M${r10(c0[0])} ${r10(c0[1])}L${r10(c1[0])} ${r10(c1[1])}`;
    }
    const top = pth1([[xa, ya, z], [xb, ya, z], [xb, yb, z], [xa, yb, z]].map(pr));
    const svg = `<path class="cg-gap" d="${top}"/>` + Ln(fins, { tone: "lo", className: "cg-fin" }) + `<path class="cg-frost" style="stroke-width:${r10(Math.max(1.2, 9 * KS))}px" d="${frost}"/>` + `<path class="iso-line iso-edge" data-tone="mid" fill="none" d="${top}"/>`;
    put("serpentin.aletas", [(xa + xb) / 2, (ya + yb) / 2, (CO.z0 + CO.z1) / 2], svg, [record(A.box([xa, ya, CO.z0], [xb, yb, CO.z1], { name: "serpentin.aletas", owner: "serpentin" }))]);
    ANCH.ESCARCHA = [2300, -1420, z];
    ANCH.SERPENTIN = [3300, -1700, z];
  }
  // la tapa de las curvas de retorno, a la derecha (las curvas van adentro)
  const HO = CG.hood;
  {
    const ya = YB + CO.plate, yb = PT.y0 - CO.plate;
    const seam = Ln(path3([[CO.x1 + HO.w, ya + 60, CO.z1], [CO.x1 + HO.w, yb - 60, CO.z1]]), { tone: "faint" });
    const screws = [];
    for (let y = ya + 40; y < yb - 20; y += 120) screws.push(at([CO.x1 + HO.w, y, CO.z1 - 25]), at([CO.x1 + HO.w, y, CO.z0 + 25]));
    box("serpentin.tapa", [CO.x1, ya, CO.z0], [CO.x1 + HO.w, yb, CO.z1], { owner: "serpentin.tapa", extra: Dots(screws, { size: 0.5, tone: "mid" }) });
    void seam;
  }
  ANCH.TAPA = [CO.x1 + HO.w, -1700, (CO.z0 + CO.z1) / 2];
  // las líneas del refrigerante: salen por arriba de la tapa y van a la pared de atrás (la de succión, aislada)
  const line = (nm, y0, zr, r, cls, rOut) => {
    const x = CO.x1 + HO.xl;
    const route = G.fillet([[x, y0, CO.z1], [x, y0, zr], [x, YB + 14, zr]], Math.max(3 * rOut, 60), 10);
    tubeItems(nm, route, rOut, { cls, owner: nm });
    disc(`${nm}.pasamuro`, FYo(x, zr), YB, YB + 14, rOut + 12, { owner: "recinto", cls: "cg-ss" });
    return x;
  };
  const HD = CG.hdr;
  const xl = line("liquido", HD.liq.y, HD.liq.z, HD.liq.r, "cg-tube", HD.liq.r);
  line("succion", HD.suc.y, HD.suc.z, HD.suc.r, "cg-ins", HD.suc.r + HD.suc.ins);
  ANCH.LIQUIDO = [xl + HD.liq.r, HD.liq.y, (CO.z1 + HD.liq.z) / 2];
  ANCH.SUCCION = [xl + HD.suc.r + HD.suc.ins, HD.suc.y, (CO.z1 + HD.suc.z) / 2 + 60];
}
{
  // el rociador del deshielo: un tubo recto sobre el serpentín, de pared a pared, con sus boquillas hacia abajo
  const D = CG.defrost;
  disc("rociador.pasamuro0", FXo(D.y, D.z, X0), 0, 14, D.r + 14, { owner: "recinto" });
  disc("rociador.pasamuro1", FXo(D.y, D.z, X1 - 14), 0, 14, D.r + 14, { owner: "recinto" });
  tubeItems("rociador", [[X0 + 14, D.y, D.z], [X1 - 14, D.y, D.z]], D.r, { cls: "cg-tube", owner: "rociador", maxLength: 1000 });
  for (let i = 0; i < D.noz; i++) {
    const x = 420 + (i * (CO.x1 - 640)) / (D.noz - 1);
    disc(`rociador.boquilla${i}`, FZ(x, D.y), D.z - D.r - 34, D.z - D.r + 6, 13, { owner: "rociador", n: 12 });
  }
  ANCH.ROCIADOR = [2700, D.y, D.z + D.r];
}

/* ====================================================================
   9 · el aire: sube por los ventiladores, por las bandas y por los lechos; arriba pasa el tabique y baja al
   evaporador; abajo vuelve del retorno de atrás por debajo de la cubierta
   ==================================================================== */
function flow(name, ctl, { r = 5, head = 13, w = 6.5, cls = "cg-flujo" } = {}) {
  // Catmull-Rom por los puntos de control, en 3D
  const pts = [];
  for (let i = 0; i < ctl.length - 1; i++) {
    const p0 = ctl[Math.max(0, i - 1)], p1 = ctl[i], p2 = ctl[i + 1], p3 = ctl[Math.min(ctl.length - 1, i + 2)];
    for (let j = 0; j < 14; j++) { const t = j / 14, t2 = t * t, t3 = t2 * t; pts.push([0, 1, 2].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3))); }
  }
  pts.push(ctl[ctl.length - 1]);
  const sc = pts.map(at), n = sc.length, b = sc[n - 1];
  let j = n - 2; while (j > 0 && Math.hypot(sc[j][0] - b[0], sc[j][1] - b[1]) < head) j--;
  const a = sc[j], L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  const base = [b[0] - ux * head, b[1] - uy * head];
  const keep = sc.slice(0, j + 1);
  const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  const hd = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  put(name, pts[Math.floor(n / 2)], `<path class="${cls}" d="${line}"/><path class="cg-flecha" d="${hd}"/>`, [A.tube(pts, r), A.ball(pts[n - 1], (w * 0.8) / KS)]);
}
if (!DET) {
  // abajo: viene del retorno de atrás por debajo de la cubierta, a ras del piso, y sube a la campana de cada ventilador
  FN.xs.forEach((xf, q) => {
    flow(`aire.campana${q}`, [[xf + 300, -1050, ZF + 60], [xf + 300, -420, ZF + 70], [xf + 300, -270, ZF + 170], [xf + 300, -260, FN.bell - 30]]);
    const zTop = q < 2 ? ZC1 - RD - TB - 70 : ZC2 - RD - TB - 60;
    flow(`aire.sube${q}`, [[xf + 250, FN.y + 330, DK.z1 + 40], [xf + 250, FN.y + 330, (DK.z1 + zTop) / 2], [xf + 250, FN.y + 330, zTop]]);
  });
  // arriba: sale de los lechos, pasa el tabique y baja a las aletas
  [[860, CG.b1.z + CG.bed1.h + CG.bed1.jump + 40], [2700, CG.b2.z + CG.bed2.h + 60], [3700, CG.b2.z + CG.bed2.h + 60]].forEach(([x, z0], i) =>
    flow(`aire.arriba${i}`, [[x, -320, z0], [x, -320, z0 + 220], [x, -420, 2720], [x, -900, 2930], [x, -1340, 2840], [x, -1360, CO.z1 + 30]], { r: 6, head: 14, w: 7 }));
  ANCH.AIRE = [3700, -320, CG.b2.z + CG.bed2.h + 200];
  ANCH.AIREARRIBA = [2700, -700, 2880];
}

/* ====================================================================
   10 · los detalles: las arvejas de 6 mm una por una, en el plano del corte y en la superficie del lecho
   ==================================================================== */
if (DET) {
  const st = DETN === 1 ? { x0: CG.bed1.x0, x1: CG.bed1.x1, zb: CG.b1.z, top: (x) => Z1top(x), loose: true } : { x0: CG.bed2.x0, x1: CG.bed2.x1, zb: CG.b2.z, top: () => CG.b2.z + CG.bed2.h, loose: false };
  const cx = CDETS[DETN][0], half = 120 / (KS) + 20;
  const xa = cx - half, xb = cx + half, R = PEA.r;
  // las burbujas de la primera etapa: elipsoides vacíos que cortan la cara del corte
  const bubbles = st.loose ? [[cx - 52, -14, st.zb + 22, 18, 22, 12], [cx + 30, -10, st.zb + 38, 30, 26, 19], [cx + 92, -20, st.zb + 14, 12, 14, 8], [cx - 100, -30, st.zb + 46, 24, 30, 16], [cx - 6, -12, st.zb + 12, 9, 10, 6]] : [];
  const inBub = (p) => bubbles.some(([bx, by, bz, rx, ry, rz]) => ((p[0] - bx) / rx) ** 2 + ((p[1] - by) / ry) ** 2 + ((p[2] - bz) / rz) ** 2 < 1);
  let dmin = st.loose ? 7.4 : 6.15;
  const cellsLoose = () => { dmin = 12; };
  const cells = new Map(), key = (p) => `${Math.floor(p[0] / 8)},${Math.floor(p[1] / 8)},${Math.floor(p[2] / 8)}`;
  const near = (p) => { const [i, j, l] = key(p).split(",").map(Number); for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) for (let c = -1; c <= 1; c++) for (const q of cells.get(`${i + a},${j + b},${l + c}`) || []) if ((q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2 + (q[2] - p[2]) ** 2 < dmin * dmin) return true; return false; };
  const add = (p) => { const kk = key(p); if (!cells.has(kk)) cells.set(kk, []); cells.get(kk).push(p); };
  const peas = [];
  const tryPea = (p) => { if (near(p) || inBub(p)) return; add(p); peas.push(p); };
  // la capa de adelante (en el corte), la de atrás y la superficie
  for (let i = 0; i < 26000; i++) { const x = xa + rnd() * (xb - xa), z = st.zb + R + 0.3 + rnd() * (st.top(x) - st.zb - 2 * R); tryPea([x, -R - rnd() * 7, z]); }
  const nFront = peas.length;
  if (st.loose) { cellsLoose(); }
  for (let i = 0; i < 26000; i++) { const x = xa + rnd() * (xb - xa), y = -R - rnd() * 260; tryPea([x, y, st.top(x) - R - rnd() * (st.loose ? 14 : 4)]); }
  // las que saltan sobre la primera etapa
  const jump = [];
  if (st.loose) for (let i = 0; i < 900; i++) { const x = xa + rnd() * (xb - xa), y = -R - rnd() * 240, p = [x, y, st.top(x) + R + 2 + rnd() ** 1.5 * CG.bed1.jump]; const n0 = peas.length; tryPea(p); if (peas.length > n0) jump.push(p); }
  const rr = R * KS;
  // el fondo del lecho (la sombra entre las arvejas), en la cara del corte y en la superficie
  const N = 40, xsS = Array.from({ length: N + 1 }, (_, i) => xa + ((xb - xa) * i) / N);
  const front = [[xa, 0, st.zb], [xb, 0, st.zb], ...xsS.slice().reverse().map((x) => [x, 0, st.top(x) - R])];
  const topP = [...xsS.map((x) => [x, -2, st.top(x) - R]), [xb, -WB, st.top(xb) - R], [xa, -WB, st.top(xa) - R]];
  let svg = `<path class="cg-bed-t" d="${pth1(topP.map(pr))}"/><path class="cg-bed-f" d="${pth1(front.map(pr))}"/>`;
  for (const [bx, , bz, rx, , rz] of bubbles) { const pts = Array.from({ length: 36 }, (_, i) => { const a = (TAU * i) / 36; return [bx + rx * 0.92 * Math.cos(a), 0, bz + rz * 0.92 * Math.sin(a)]; }); svg += `<path class="cg-burb" d="${pth1(pts.map(pr))}"/>`; }
  // las del corte, a la luz de la cara; las de la superficie y las que saltan, más claras (les llega la luz de arriba)
  DEFS.push(`<g id="cgP${DETN}"><circle class="cg-pea" r="${r10(rr)}"/><circle class="cg-pea-h" cx="${r10(-rr * 0.33)}" cy="${r10(-rr * 0.36)}" r="${r10(rr * 0.34)}"/></g>`);
  DEFS.push(`<g id="cgQ${DETN}"><circle class="cg-pea-t" r="${r10(rr)}"/><circle class="cg-pea-h" cx="${r10(-rr * 0.33)}" cy="${r10(-rr * 0.36)}" r="${r10(rr * 0.34)}"/></g>`);
  const front_ = new Set(peas.slice(0, nFront));
  for (const p of peas.slice().sort((a, b) => G.dot3(a, V3) - G.dot3(b, V3))) { const [sx, sy] = pr(p); svg += `<use href="#cg${front_.has(p) ? "P" : "Q"}${DETN}" x="${r10(sx)}" y="${r10(sy)}"/>`; }
  put(`arvejas.d${DETN}`, [cx, -60, st.zb + 40], svg, [A.box([xa, -WB, st.zb], [xb, 0, st.top(cx) + (st.loose ? CG.bed1.jump + 10 : 4)], { name: `arvejas.d${DETN}` })]);
  // el aire en el detalle: entra por la banda desde abajo y sale por arriba del lecho
  const bz = st.zb - TB - CG.bars.h;
  const BX = DETN === 1 ? B1 : B2;
  const xsA = [cx - 75, cx - 20, cx + 45, cx + 100].filter((x) => BX.xs.every((xb_) => Math.abs(x - xb_) > 22));
  ANCH.D_AIRE = [xsA[0], -4, bz - 30];
  xsA.forEach((x, i) => flow(`aire.d${i}`, [[x, -4, bz - 40], [x, -4, bz - 18], [x, -4, st.zb - TB - 4]], { r: 0.8, head: 9, w: 4.2, cls: "cg-flujo cg-fino" }));
  const up = st.loose ? 64 : 34;
  [cx - 60, cx + 15, cx + 85].forEach((x, i) => flow(`aire.s${i}`, [[x, -25, st.top(x) + (st.loose ? 40 : 10)], [x, -25, st.top(x) + (st.loose ? 40 : 10) + up / 2], [x, -25, st.top(x) + (st.loose ? 40 : 10) + up]], { r: 0.8, head: 9, w: 4.2, cls: "cg-flujo cg-fino" }));
  // la banda perforada en el corte: los agujeros en la cara de adelante
  {
    let holes = "";
    for (let x = Math.ceil(xa / 8) * 8; x < xb; x += 8) holes += pth1([[x, 0, st.zb - TB + 2.5], [x + 3.4, 0, st.zb - TB + 2.5], [x + 3.4, 0, st.zb - 2.5], [x, 0, st.zb - 2.5]].map(pr));
    put(`banda.agujeros${DETN}`, [cx, 0, st.zb - TB / 2], `<path class="cg-bore" d="${holes}"/>`, [A.box([xa, -1, st.zb - TB], [xb, 0, st.zb], { name: `banda.agujeros${DETN}` })]);
  }
  ANCH.D_ARVEJA = (() => { const p = peas.filter((q) => q[1] > -R - 1 && Math.abs(q[0] - cx - 30) < 30 && q[2] < st.zb + 40).sort((a, b) => Math.abs(a[0] - cx - 30) - Math.abs(b[0] - cx - 30))[0] || [cx, -R, st.zb + 30]; return [p[0], 0, p[2]]; })();
  ANCH.D_BANDA = [cx - 60, 0, st.zb - TB / 2];
  ANCH.D_BARRA = [BX.xs.reduce((q, x) => (Math.abs(x - cx) < Math.abs(q - cx) ? x : q), BX.xs[0]), 0, st.zb - TB - CG.bars.h / 2];
  if (st.loose) ANCH.D_BURBUJA = [bubbles[1][0], 0, bubbles[1][2]];
  ANCH.D_CAPA = [cx + 70, 0, st.zb + 50];
  // una arveja en el aire, de las de adelante y bien arriba del lecho
  if (st.loose) { const inC = (p) => { const q = pr(p); return Math.hypot(q[0] - W / 2, q[1] - H / 2) < RDET - 14; };
    const j = jump.filter((p) => p[2] > st.top(p[0]) + 22 && p[1] > -40 && inC(p)).sort((a, b) => G.dot3(b, V3) - G.dot3(a, V3))[0]; if (j) ANCH.D_SALTA = j; }
}

/* ---------- orden y salida ---------- */
if (process.env.CG_ITEM) {
  for (const nm of process.env.CG_ITEM.split(",")) {
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
  // las que caen en el cuadro del detalle (por las esquinas de sus formas), las demás se quitan antes de ordenar
  const inView = (it) => it.shapes.some((sh) => {
    const bd = A.boundsOf(sh); if (!bd) return true;
    const [lo, hi] = Array.isArray(bd) ? bd : [bd.min, bd.max];
    const cs = []; for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) cs.push(k.iso([x / U, y / U, z / U], P));
    const x0 = Math.min(...cs.map((c) => c[0])), x1 = Math.max(...cs.map((c) => c[0])), y0 = Math.min(...cs.map((c) => c[1])), y1 = Math.max(...cs.map((c) => c[1]));
    return x1 > 0 && x0 < W && y1 > 0 && y0 < H;
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
const CSS = `.cg-cut{${flat("#c9ced3")}}.cg-cut1{${flat("#d6dade")}}.cg-foam{${flat("#e4d88d")}}
.cg-ss{${shades("#eef0f2", "#f7f8f9", ["#c9ced3", "#d6dade", "#e1e4e7", "#eceef0"])}}
.cg-panel{${shades("#e4e8ea", "#edf0f1", ["#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4"])}}
.cg-motor{${shades("#e4e8ea", "#edf0f1", ["#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4"])}}
.cg-cast{${shades("#dfe2e5", "#e9ebed", ["#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0"])}}
.cg-spring{${shades("#dfe2e5", "#e9ebed", ["#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0"])}}
.cg-tube .tb-body{fill:#e1e4e7}.cg-tube .tb-shine{fill:#f7f8f9}.cg-tube .tb-shade{fill:#c9ced3}
.cg-ins .tb-body{fill:#505960}.cg-ins .tb-shine{fill:#6b747c}.cg-ins .tb-shade{fill:#3e464d}
.cg-ins{${shades("#5d666e", "#6b747c", ["#3e464d", "#475057", "#505960", "#576067"])}}
.cg-bore{fill:#525c64;stroke:none}.cg-dark{fill:#525c64;stroke:none}.cg-gap{fill:#8a96a3;stroke:none}
.cg-fin{stroke:#d6dade}.cg-frost{fill:none;stroke:#f1f6fa;stroke-linecap:round}
.cg-bed-f{fill:#a89464;stroke:none}.cg-bed-t{fill:#c6b68f;stroke:none}
.cg-pe{fill:#d9cfb8;stroke:none}.cg-ph{fill:#e3dbc8;stroke:none}.cg-pe-c{fill:none;stroke:#b8a67a;stroke-linecap:round}
.cg-pea{fill:#d9cfb8;stroke:#7a5634;stroke-width:.5px}.cg-pea-t{fill:#e3dbc8;stroke:#7a5634;stroke-width:.5px}.cg-pea-h{fill:#ffffff;stroke:none}
.cg-burb{fill:#ffffff;stroke:#b8a67a;stroke-width:.5px}
.cg-flujo{fill:none;stroke:#2e5e9e;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.cg-flecha{fill:#2e5e9e;stroke:none;opacity:.85}.cg-fino{stroke-width:1.1px}
.cg-det-fondo{fill:#ffffff;stroke:none}.cg-det-marco{fill:none;stroke:#525c64;stroke-width:1px}`;
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
  ? k.figureSvg({ width: W, height: H, label: DETN === 1 ? "La primera etapa ampliada" : "La segunda etapa ampliada", body: [`<style>${CSS}</style><defs>${DEFS.join("")}<clipPath id="cgDet${DETN}"><circle cx="${W / 2}" cy="${H / 2}" r="${RDET}"/></clipPath></defs><g class="cg-items" clip-path="url(#cgDet${DETN})"><circle class="cg-det-fondo" cx="${W / 2}" cy="${H / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="cg-det-marco" cx="${W / 2}" cy="${H / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W, height: H, label: "Congelador de lecho fluidizado de dos etapas en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="cg-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
const base = DET ? `detalle${DETN}` : "fig";
writeFileSync(join(OUTD, `${base}.svg`), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, `preview-detalle${DETN}.html`) : join(HERE, "preview.html"), k.pageHtml({ title: "Congelador", theme: "light", width: DET ? 400 : 1100, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, `${base}_data.json`), JSON.stringify({ P, W, H, ANCLAS: ANCH, CDETS, MDET, RDET }));
// La placa de atrás del serpentín es delgada pero el audit la toma como una varilla de 400 mm de diámetro (su alto):
// el arranque de la línea de succión, sobre la tapa de las curvas, cae en esa varilla en pantalla aunque está a 60 cm de
// la placa. Revisado en la vista.
if (!FAST) A.auditOrExit(R_, PA, { crowd: [["succion", "serpentin.lado1"]] });
