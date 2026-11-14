/* ====================================================================
   El clarificador de placas en isométrico (skill anatomy), para el capítulo 17 del libro de operaciones unitarias
   (Sedimentación y decantación, ejemplo 17.4, «El clarificador del agua de servicios»): el tanque rectangular de
   1,3 × 5,13 m con 3,6 m de agua que limpia 25 m³/h de agua floculada antes del filtro de doble medio, sin el muro que
   mira al lector.
   Concepto: el agua floculada entra por el muro de la entrada a una cámara angosta y pasa por los 21 orificios del muro
   difusor, que la reparten en toda la sección. En el primer cuarto, sin placas, cae el flóculo pesado; el resto pasa
   bajo la pantalla, corre bajo el paquete de placas y sube entre ellas, a 60°: el flóculo cae los 50 mm que hay entre
   dos placas, se junta en la cara de arriba de la de abajo y resbala hacia abajo, a contracorriente del agua. El agua
   clara sale por arriba a los vertederos en V de la canaleta, que la lleva a la caja de salida y al filtro. Abajo, el
   barredor de cadenas y paletas arrastra el lodo por el piso hasta la tolva de la entrada, de donde sale por la purga.
   Corte: se quita el muro de y > 0. Lo que llega al plano y = 0 (la losa, los muros de los extremos, el muro difusor,
   la pantalla, las placas, los ejes, el lodo y el agua) se ve cortado ahí.
   --detalle: dos canales entre placas, doce veces más grandes, con el agua que sube y el flóculo que resbala.
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
const CL = GEO.CL;
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const DET = process.argv.includes("--detalle");
const STEP = Number(process.env.CL_STEP || (DET ? 2 : 0.25));
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};
const { L, W, ZW, ZT, t: TW } = CL;
const ZR = CL.raft.z0, RX0 = -TW - CL.raft.toe, RX1 = L + TW + CL.raft.toe, RY0 = -W - TW - CL.raft.toe;

/* ---------- las placas: la cara de arriba de la placa i va de B_i (abajo) a T_i (arriba, hacia la entrada) ---------- */
const PL = CL.pl, SA = Math.sin(PL.ang * D2R), CA = Math.cos(PL.ang * D2R);
const PITCH = (PL.gap + PL.th) / SA;                       // paso horizontal entre placas
const ZBU = PL.ztop - PL.L * SA;                           // la altura del borde de abajo de la cara de arriba
const NRM = [SA, CA];                                      // la normal de la cara de arriba (hacia +x y arriba)
const XB0 = CL.zona + PL.L * CA;                           // el borde de abajo de la primera placa
const plate = (i) => { const xb = XB0 + i * PITCH, B = [xb, ZBU], T = [xb - PL.L * CA, PL.ztop]; return [B, T, [T[0] - PL.th * NRM[0], T[1] - PL.th * NRM[1]], [B[0] - PL.th * NRM[0], B[1] - PL.th * NRM[1]]]; };
const plateX = (i, z) => XB0 + i * PITCH - (z - ZBU) / Math.tan(PL.ang * D2R);   // x de la cara de arriba a la altura z
const ZA = ZBU - PL.th * NRM[1];                          // el canto de abajo de las placas: la cara de los ángulos

/* ---------- la cámara ---------- */
const W_ = DET ? 256 : 900, H_ = DET ? 256 : 720;
const EXT = [
  [RX0, RY0, ZR], [RX1, RY0, ZR], [RX1, 0, ZR], [RX0, 0, ZR],
  [-TW, -W - TW, ZT], [L + TW, -W - TW, ZT], [L + TW, 0, ZT], [-TW, 0, ZT],
  [-1030, CL.inlet.y + 170, CL.inlet.z - 170], [-1030, CL.inlet.y - 170, CL.inlet.z + 170],
  [CL.purge.xe - 30, CL.purge.y + 160, -320 - 160], [CL.purge.xv, CL.purge.y, 720],
  [6640, -650 + 170, 2900 - 170], [6640, -650 - 170, 2900 + 170],
  [1330, -1520, 4500], [680, -1520, 4220],
];
const PMAIN = k.fitProjection(EXT, 900, 720, { pad: 14, azimuth: CL.AZ, elevation: CL.EL });
// el detalle: el centro (en el plano del corte, en medio del paquete) y el aumento
const CDET = [XB0 + 30 * PITCH - 420, 0, 2140];
const MDET = 14, RDET = 120;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: CL.AZ, elevation: CL.EL }; const c = k.iso(CDET, Q); Q.origin = [W_ / 2 - c[0], H_ / 2 - c[1]]; return Q; })() : PMAIN;
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

/* El dibujo va en milímetros; el audit, en centímetros (como el congelador y el filtro de arena). */
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

/* ---------- caras planas ---------- */
const cutXZ = (poly, cls) => { const d = pth1(poly.map(([x, z]) => pr([x, 0, z]))); return `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`; };
function flatFace(pts, n, cls = "", edges = true) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return `<g class="iso-solid${cls ? " " + cls : ""}"><path class="iso-fill" d="${d}"/>` + (b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`) + (edges ? `<path class="iso-line iso-edge" data-tone="mid" d="${d}"/>` : "") + "</g>";
}
const rectXZ = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
const ell = (F, s, r, n = 48) => G.circleOf(F, s, r, P, n);

/* ---------- piezas ---------- */
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "cp-ss", cutCls = "cp-cut", r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, shapeCut, ref, pre = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}), ...(shapeCut ? { cut: shapeCut } : {}) }));
  let svg = pre + wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls);
  if (y1 >= -0.01 && cutCls) svg += cutXZ(rectXZ(x0, z0, x1, z1), cutCls);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], svg + extra, [shape]);
  return shape;
}
function fp(name, F, poly, s0, s1, { cls = "cp-ss", extra = "", cap = "auto", owner = name, cut = null, ref = null, pre = "", ground } = {}) {
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
function yCut(name, poly, y0, { cls = "cp-ss", cutCls = "cp-cut", extra = "", owner = name, ref = null, ground, y1 = 0 } = {}) {
  return fp(name, FY, poly, y0, y1, { cls, cap: "none", extra: cutXZ(poly, cutCls) + extra, owner, ref, ground });
}
function disc(name, F, s0, s1, r, { cls = "cp-ss", extra = "", owner = name, n = 0, cut = null, ground, capCls = null, noCap = false, pre = "" } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m + (n === 6 ? PI / 6 : 0); return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  let svg = pre + X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap: capCls || noCap ? "none" : "auto" });
  if (capCls) { const s = Math.max(s0, s1), d = ell(F, s, r, 64); svg += `<g class="iso-solid ${capCls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`; }
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), svg + extra, [shape]);
  return shape;
}
function turned(name, F, meridian, { cls = "cp-ss", extra = "", owner = name, steps = 40, inner = "" } = {}) {
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
const bore = (F, s, r, cls = "cp-bore") => `<path class="${cls}" d="${ell(F, s, r, 40)}"/>` + Ln(ell(F, s, r, 40), { tone: "mid" });
const ringOn = (F, s, r0, r1) => `<path class="cp-bore" d="${ell(F, s, r0, 40)}"/>` + Ln(ell(F, s, r0, 40) + ell(F, s, r1, 40), { tone: "mid" });

/* ---------- semilla ---------- */
let seed = 17;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ====================================================================
   1 · la losa de fondo (con la tolva de lodos a lo ancho, bajo la zona de entrada) y los muros de concreto
   ==================================================================== */
const HP = CL.hop, PU = CL.purge;
const ZPU = HP.zb + PU.ro;                                  // el eje de la purga: su cara de abajo en el fondo de la tolva
{
  // la losa detrás del muro de atrás, entera, y la de adelante, con la tolva
  fp("losa.atras", FY, rectXZ(RX0, ZR, RX1, 0), RY0, -W, { cls: "cp-conc", owner: "losa", ground: true });
  // la de adelante en tres pedazos alrededor de la tolva, para que el lodo de la tolva quede entre ellos en el orden
  const Fp = FXo(PU.y, ZPU, 0);
  const left = rectXZ(RX0, ZR, HP.x0, 0), mid = rectXZ(HP.x0, ZR, HP.xb, HP.zb), slope = [[HP.xb, ZR], [HP.x1, ZR], [HP.x1, 0], [HP.xb, HP.zb]], right = rectXZ(HP.x1, ZR, RX1, 0);
  fp("losa.entrada", FY, left, -W, 0, { cls: "cp-conc", cap: "none", extra: cutXZ(left, "cp-cut-c") + ringOn(Fp, HP.x0, PU.ri, PU.ro), owner: "losa", ground: true });
  fp("losa.tolva", FY, mid, -W, 0, { cls: "cp-conc", cap: "none", extra: cutXZ(mid, "cp-cut-c"), owner: "losa", ground: true });
  fp("losa.talud", FY, slope, -W, 0, { cls: "cp-conc", cap: "none", extra: cutXZ(slope, "cp-cut-c"), owner: "losa", ground: true });
  fp("losa", FY, right, -W, 0, { cls: "cp-conc", cap: "none", extra: cutXZ(right, "cp-cut-c"), owner: "losa", ground: true });
  ANCH.LOSA = [2800, 0, -300];
  ANCH.TOLVA = [HP.x0 + 60, 0, HP.zb + 120];
}
{
  // el muro de atrás: la cara de adentro con los conos de los tensores del encofrado cada 600 mm
  const ties = [];
  for (let x = 300; x < L; x += 600) ties.push(at([x, -W, 3900]));
  box("muro.atras", [-TW, -W - TW, 0], [L + TW, -W, ZT], { cls: "cp-conc", cutCls: null, r: 0.3, owner: "muros", extra: Dots(ties, { size: 0.45, tone: "lo" }) });
  // el muro de la entrada, con la boca del tubo de entrada en la cara de adentro
  const Fi = FXo(CL.inlet.y, CL.inlet.z, 0);
  box("muro.entrada", [-TW, -W, 0], [0, 0, ZT], { cls: "cp-conc", cutCls: "cp-cut-c", r: 0.3, owner: "muros", extra: ringOn(Fi, 0, CL.inlet.ri, CL.inlet.ro) });
  const tiesS = [];
  for (let y = -1000; y < 0; y += 600) for (let z = 300; z < ZT; z += 600) if (!(y > CL.box.y0 - 60 && y < CL.box.y1 + 60 && z > CL.box.z0 - 520 && z < CL.box.z1 + 60)) tiesS.push(at([L + TW, y, z]));
  box("muro.salida", [L, -W, 0], [L + TW, 0, ZT], { cls: "cp-conc", cutCls: "cp-cut-c", r: 0.3, owner: "muros", extra: Dots(tiesS, { size: 0.45, tone: "lo" }) });
  ANCH.MURO = [L + TW, -300, 1800];
  ANCH.ENTRADA_BOCA = [0, CL.inlet.y + CL.inlet.ro * 0.8, CL.inlet.z];
}

/* ====================================================================
   2 · el muro difusor: concreto de 150 mm a lo ancho, con 21 orificios de 75 mm; la pantalla sobre la primera placa
   ==================================================================== */
const DF = CL.dif;
{
  let holes = "";
  const Fd = (y, z) => FXo(y, z, 0);
  for (const y of DF.ys) for (const z of DF.zs) holes += bore(Fd(y, z), DF.x1, DF.r);
  box("difusor", [DF.x0, -W, 0], [DF.x1, 0, DF.z1], { cls: "cp-conc", cutCls: "cp-cut-c", r: 0.3, owner: "difusor", extra: holes });
  ANCH.DIFUSOR = [DF.x1, DF.ys[2], DF.zs[4]];
  ANCH.ORIFICIO = [DF.x1, DF.ys[2] + DF.r, DF.zs[5]];
}
{
  const PN = CL.pant;
  box("pantalla", [PN.x0, -W, PL.ztop], [PN.x1, 0, PN.z1], { owner: "pantalla" });
  // el ángulo con que se ancla al muro de atrás
  const bolts = [];
  for (let z = PL.ztop + 140; z < PN.z1 - 40; z += 220) bolts.push(at([PN.x1 + 30, -W + 6, z]));
  fp("pantalla.angulo", FZs, [[PN.x1, -W], [PN.x1 + 60, -W], [PN.x1 + 60, -W + 6], [PN.x1 + 6, -W + 6], [PN.x1 + 6, -W + 60], [PN.x1, -W + 60]], PL.ztop + CL.peine.h, PN.z1, { owner: "pantalla", extra: Dots(bolts, { size: 0.45, tone: "mid" }) });
  ANCH.PANTALLA = [PN.x1, -200, 3350];
}

/* ====================================================================
   3 · el paquete de placas: 52 placas de acero inoxidable de 1,5 m a 60°, separadas 50 mm, cortadas en y = 0; los
   tirantes con sus tuercas y los dos ángulos donde se apoyan
   ==================================================================== */
for (let i = 0; i < PL.n; i++) yCut(`placa${i}`, plate(i), PL.y0, { owner: "placas" });
ANCH.PLACA = (() => { const z = 2420; return [plateX(40, z) + 3, 0, z]; })();
ANCH.PAQUETE = [plateX(20, PL.ztop - 2) - 2, -700, PL.ztop];
{
  // los peines de arriba: una barra junto a cada muro sobre los cantos de arriba, con una ranura por placa
  const PE = CL.peine, px0 = CL.pant.x1, px1 = plateX(PL.n - 1, PL.ztop) + 15;
  const slots = (y) => Array.from({ length: PL.n }, (_, i) => path3([[plateX(i, PL.ztop) - 0.7, y, PL.ztop + PE.h], [plateX(i, PL.ztop) - 0.7, y, PL.ztop]])).join("");
  box("peine.atras", [px0, -W, PL.ztop], [px1, -W + PE.w, PL.ztop + PE.h], { owner: "placas", cutCls: null, extra: Ln(slots(-W + PE.w), { tone: "lo" }) });
  box("peine.adelante", [px0, -PE.w, PL.ztop], [px1, 0, PL.ztop + PE.h], { owner: "placas", extra: Ln(slots(0), { tone: "lo" }) });
  ANCH.PEINE = [plateX(46, PL.ztop) + 25, 0, PL.ztop + PE.h * 0.6];
  // los ángulos de 75 × 75 × 6 donde se apoyan los cantos de abajo
  const AG = CL.ang, x0 = XB0 - 50, x1 = XB0 + (PL.n - 1) * PITCH + 50;
  const back = [[-W, ZA - AG.w], [-W + AG.t, ZA - AG.w], [-W + AG.t, ZA - AG.t], [-W + AG.w, ZA - AG.t], [-W + AG.w, ZA], [-W, ZA]];
  const front = [[-AG.w, ZA - AG.t], [-AG.t, ZA - AG.t], [-AG.t, ZA - AG.w], [0, ZA - AG.w], [0, ZA], [-AG.w, ZA]];
  const bolts = [];
  for (let x = x0 + 150; x < x1 - 100; x += 500) bolts.push(at([x, -W + AG.t, ZA - AG.w / 2]));
  fp("angulo.atras", FXs, back, x0, x1, { owner: "placas", extra: Dots(bolts, { size: 0.45, tone: "mid" }) });
  fp("angulo.adelante", FXs, front, x0, x1, { owner: "placas", extra: cutXZ(rectXZ(x0, ZA - AG.w, x1, ZA), "cp-cut") });
  ANCH.ANGULO = [x1 - 300, 0, ZA - AG.w / 2];
}

/* ====================================================================
   4 · la canaleta del agua clara, con los vertederos en V a los dos lados, sus ménsulas en el muro de atrás, y la caja
   de salida afuera del muro de la salida, con el tubo al filtro
   ==================================================================== */
const LA = CL.lau, LY0 = LA.yc - LA.w / 2, LY1 = LA.yc + LA.w / 2, ZTR = 3560;
const NOTCHES = (() => { const n = Math.floor((L - LA.x0) / LA.pitch), off = (L - LA.x0 - n * LA.pitch) / 2; return Array.from({ length: n }, (_, j) => LA.x0 + off + LA.pitch * (j + 0.5)); })();
{
  const U_ = [[LY0, ZTR], [LY0, LA.z0], [LY1, LA.z0], [LY1, ZTR], [LY1 - LA.t, ZTR], [LY1 - LA.t, LA.z0 + LA.t], [LY0 + LA.t, LA.z0 + LA.t], [LY0 + LA.t, ZTR]];
  // el agua de la canaleta, vista desde arriba, va en el mismo elemento (adentro de la U)
  fp("canaleta", FXs, U_, LA.x0, L, { owner: "canaleta" });
  box("canaleta.tapa", [LA.x0 - LA.t, LY0, LA.z0], [LA.x0, LY1, ZTR], { owner: "canaleta" });
  // los vertederos: una placa de 6 mm a cada lado, con muescas en V de 90° y 50 mm cada 150, sobre la pared de la U
  const WP = LA.wp, zt = WP.z1, zn = zt - LA.notch;
  const prof = [[LA.x0, ZTR - 120], [L, ZTR - 120], [L, zt]];
  for (let j = NOTCHES.length - 1; j >= 0; j--) { const xc = NOTCHES[j]; prof.push([xc + LA.notch, zt], [xc, zn], [xc - LA.notch, zt]); }
  prof.push([LA.x0, zt]);
  const bolts = (y) => { const b = []; for (let x = LA.x0 + 150; x < L - 50; x += 300) b.push(at([x, y, ZTR - 60])); return b; };
  fp("vertedero.atras", FY, prof, LY0 - WP.t, LY0, { owner: "canaleta" });
  fp("vertedero", FY, prof, LY1, LY1 + WP.t, { owner: "canaleta", extra: Dots(bolts(LY1 + WP.t), { size: 0.45, tone: "mid" }) });
  ANCH.CANALETA = [2600, LY1 + WP.t, ZTR - 100];
  ANCH.VERTEDERO = [NOTCHES[14], LY1 + WP.t, zn + 6];
  // la nariz de la canaleta que sale por el muro a la caja
  fp("canaleta.nariz", FXs, U_, L + TW, L + TW + 100, { owner: "canaleta" });
}
{
  // las ménsulas: brazo bajo la canaleta, tornapunta y placa de anclaje en el muro de atrás
  for (const [j, xb] of CL.brk.xs.entries()) {
    const o = `mensula${j}`, h = CL.brk.w / 2;
    const anc = [[xb - 40, -W + 12, 2990], [xb + 40, -W + 12, 2990], [xb - 40, -W + 12, 3260], [xb + 40, -W + 12, 3260]].map(at);
    box(`${o}.placa`, [xb - 60, -W, 2950], [xb + 60, -W + 12, LA.z0], { owner: o, extra: Dots(anc, { size: 0.5, tone: "mid" }) });
    box(`${o}.brazo`, [xb - h, -W + 12, LA.z0 - 50], [xb + h, LY1 + 25, LA.z0], { owner: o });
    box(`${o}.grapa`, [xb - h, LY1, LA.z0], [xb + h, LY1 + 20, LA.z0 + 60], { owner: o });
    fp(`${o}.tornapunta`, FXs, [[-W + 12, 2975], [-W + 12, 3035], [-990, LA.z0 - 50], [-1050, LA.z0 - 50]], xb - 20, xb + 20, { owner: o });
  }
  ANCH.MENSULA = [CL.brk.xs[0] + 25, -900, LA.z0 - 30];
}
const BX = CL.box;
{
  const x0 = L + TW, x1 = BX.x1, t = BX.t;
  box("caja.fondo", [x0, BX.y0, BX.z0], [x1, BX.y1, BX.z0 + t], { owner: "caja" });
  box("caja.atras", [x0, BX.y0, BX.z0 + t], [x1, BX.y0 + t, BX.z1], { owner: "caja" });
  const ab = []; for (let z = BX.z0 + 120; z < BX.z1; z += 260) ab.push(at([x0 + 22, BX.y1, z]));
  // el agua de la caja, vista desde arriba, va con la pared del fondo (se ve por la boca de arriba)
  const wp = [[x0, BX.y0 + t, BX.zwater], [x1 - t, BX.y0 + t, BX.zwater], [x1 - t, BX.y1 - t, BX.zwater], [x0, BX.y1 - t, BX.zwater]];
  box("caja.lado", [x1 - t, BX.y0 + t, BX.z0 + t], [x1, BX.y1 - t, BX.z1], { owner: "caja" });
  put("caja.agua", [(x0 + x1) / 2, (BX.y0 + BX.y1) / 2, BX.zwater], `<path class="cp-agua-sup" d="${pth1(wp.map(pr))}"/>`, [A.box([x0, BX.y0 + t, BX.zwater - 0.3], [x1 - t, BX.y1 - t, BX.zwater], { name: "caja.agua", owner: "agua" })]);
  box("caja.frente", [x0, BX.y1 - t, BX.z0 + t], [x1, BX.y1, BX.z1], { owner: "caja", extra: Dots(ab, { size: 0.5, tone: "mid" }) });
  // dos tornapuntas bajo la caja
  for (const [j, yc] of [BX.y0 + 60, BX.y1 - 60].entries()) {
    fp(`caja.tornapunta${j}`, FY, [[x0 + 12, BX.z0 - 420], [x0 + 12, BX.z0 - 360], [x0 + 340, BX.z0], [x0 + 280, BX.z0]], yc - 10, yc + 10, { owner: "caja" });
    box(`caja.anclaje${j}`, [x0, yc - 40, BX.z0 - 470], [x0 + 12, yc + 40, BX.z0 - 330], { owner: "caja" });
  }
  // el tubo al filtro de doble medio, DN 200
  const yc = -650, zc = BX.z0 + 120 + 10;
  const F = FXo(yc, zc, 0);
  disc("salida.brida0", F, x1, x1 + 24, 170, { owner: "salida", cls: "cp-ss" });
  tubeItems("salida.tubo", [[x1 + 24, yc, zc], [6600, yc, zc]], 109.5, { cls: "cp-pipe", maxLength: 300 });
  disc("salida.brida1", F, 6600, 6624, 170, { owner: "salida", cls: "cp-ss", extra: ringOn(F, 6624, 101.5, 109.5) });
  ANCH.CAJA = [x1, BX.y1 - 150, BX.z1 - 160];
  ANCH.SALIDA = [6620, yc, zc + 150];
}

/* ====================================================================
   5 · la entrada (DN 200 del floculador) y la purga de lodos (DN 150, con la válvula de cuchilla y su actuador
   neumático y el soporte), por fuera
   ==================================================================== */
{
  const I = CL.inlet, F = FXo(I.y, I.z, 0);
  disc("entrada.brida.muro", F, -TW - I.flT, -TW, I.flR, { owner: "entrada" });
  tubeItems("entrada.tubo", [[-TW - I.flT, I.y, I.z], [-1000, I.y, I.z]], I.ro, { cls: "cp-pipe" });
  disc("entrada.brida", F, -1000 - I.flT, -1000, I.flR, { owner: "entrada", extra: "" });
  ANCH.ENTRADA = [-760, I.y, I.z + I.ro];
}
{
  const F = FXo(PU.y, ZPU, 0), xv = PU.xv, o = "purga";
  disc("purga.brida.losa", F, RX0 - PU.flT, RX0, PU.flR, { owner: o });
  tubeItems("purga.tubo0", [[RX0 - PU.flT, PU.y, ZPU], [xv + 35 + PU.flT, PU.y, ZPU]], PU.ro, { cls: "cp-pipe" });
  disc("purga.brida1", F, xv + 35, xv + 35 + PU.flT, PU.flR, { owner: o });
  // la válvula de cuchilla: cuerpo de orejas, caja de la cuchilla, columnas, vástago y el cilindro neumático
  {
    // el cuerpo de orejas y la caja de la cuchilla en una sola pieza: abajo redondo, arriba recto
    const sec = [];
    for (let j = 0; j <= 24; j++) { const a = PI + (PI * j) / 24; sec.push([PU.y + 160 * Math.cos(a), ZPU + 160 * Math.sin(a)]); }
    sec.push([PU.y + 160, ZPU + 60], [PU.y + 125, ZPU + 140], [PU.y + 125, ZPU + 430], [PU.y - 125, ZPU + 430], [PU.y - 125, ZPU + 140], [PU.y - 160, ZPU + 60]);
    fp("valvula.cuerpo", FXs, sec.reverse(), xv - 35, xv + 35, { owner: "valvula", cls: "cp-cast" });
  }
  box("valvula.tapa", [xv - 40, PU.y - 140, ZPU + 430], [xv + 40, PU.y + 140, ZPU + 446], { owner: "valvula", cls: "cp-cast" });
  const zt = ZPU + 446, zc0 = zt + 260;
  for (const [j, dy] of [-110, 110].entries()) disc(`valvula.columna${j}`, FZ(xv, PU.y + dy), zt, zc0, 13, { owner: "valvula", n: 12 });
  disc("valvula.vastago", FZ(xv, PU.y), zt, zc0, 16, { owner: "valvula", n: 12 });
  box("valvula.placa", [xv - 50, PU.y - 140, zc0], [xv + 50, PU.y + 140, zc0 + 14], { owner: "valvula", cls: "cp-cast" });
  const Fc = FZ(xv, PU.y);
  turned("valvula.cilindro", Fc, [[zc0 + 14, 0], [zc0 + 14, 92], [zc0 + 34, 92], [zc0 + 34, 82], [zc0 + 300, 82], [zc0 + 300, 92], [zc0 + 320, 92], [zc0 + 320, 0]], { cls: "cp-paint", owner: "valvula" });
  // las dos tomas de aire del cilindro, hacia el lector
  for (const [j, z] of [zc0 + 60, zc0 + 274].entries()) disc(`valvula.toma${j}`, FYo(xv, z, 0), PU.y + 81, PU.y + 104, 11, { owner: "valvula", n: 12, cls: "cp-cast" });
  disc("purga.brida2", F, xv - 35 - PU.flT, xv - 35, PU.flR, { owner: o });
  tubeItems("purga.tubo1", [[xv - 35 - PU.flT, PU.y, ZPU], [PU.xe, PU.y, ZPU]], PU.ro, { cls: "cp-pipe" });
  disc("purga.brida3", F, PU.xe - PU.flT, PU.xe, PU.flR, { owner: o, extra: ringOn(F, PU.xe - PU.flT, PU.ri, PU.ro) });
  // el soporte de la válvula: placa en el piso y poste bajo el cuerpo
  const anc = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => at([xv + a * 60, PU.y + b * 60, ZR + 12]));
  box("valvula.soporte.base", [xv - 85, PU.y - 85, ZR], [xv + 85, PU.y + 85, ZR + 12], { owner: "valvula.soporte", ground: true, cls: "cp-paint", extra: Dots(anc, { size: 0.5, tone: "mid" }) });
  box("valvula.soporte.poste", [xv - 22, PU.y - 22, ZR + 12], [xv + 22, PU.y + 22, ZPU - 160], { owner: "valvula.soporte", cls: "cp-paint" });
  ANCH.VALVULA = [xv + 26, PU.y + 125, ZPU + 300];
  ANCH.ACTUADOR = [xv, PU.y + 82, zc0 + 200];
  ANCH.PURGA = [PU.xe + 100, PU.y, ZPU + PU.ro];
}
// la persona de referencia: 1,75 m, de pie en el piso junto a la purga (no va en el detalle)
if (!DET) {
  const PS = CL.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, PS.piso], rumbo: PS.rumbo, mm: 1, adelante: "der" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.CABEZA;
}

/* ====================================================================
   6 · el barredor de cadenas y paletas: cuatro ejes con sus chumaceras en el muro de atrás, ruedas dentadas de nueve
   dientes, dos cadenas y seis paletas con sus zapatas; el motorreductor en la corona del muro y la cadena de
   transmisión al eje de arriba de la entrada
   ==================================================================== */
const CO = CL.col, RS = CO.r, SP = CO.sp;
// el recorrido de la cadena (su línea de paso): s = 0 abajo de la rueda D, hacia la entrada por el piso
const SEGS = (() => {
  const [Ac, Bc, Cc, Dc] = SP, q = (PI / 2) * RS;
  return [
    { kind: "line", a: [Dc[0], Dc[1] - RS], b: [Ac[0], Ac[1] - RS], n: [0, -1] },
    { kind: "arc", c: Ac, a0: -PI / 2, a1: -PI, len: q },
    { kind: "line", a: [Ac[0] - RS, Ac[1]], b: [Bc[0] - RS, Bc[1]], n: [-1, 0] },
    { kind: "arc", c: Bc, a0: PI, a1: PI / 2, len: q },
    { kind: "line", a: [Bc[0], Bc[1] + RS], b: [Cc[0], Cc[1] + RS], n: [0, 1] },
    { kind: "arc", c: Cc, a0: PI / 2, a1: 0, len: q },
    { kind: "line", a: [Cc[0] + RS, Cc[1]], b: [Dc[0] + RS, Dc[1]], n: [1, 0] },
    { kind: "arc", c: Dc, a0: 0, a1: -PI / 2, len: q },
  ].map((sg) => (sg.kind === "line" ? { ...sg, len: Math.hypot(sg.b[0] - sg.a[0], sg.b[1] - sg.a[1]) } : sg));
})();
const LOOP = SEGS.reduce((q, s) => q + s.len, 0);
function loopAt(s) {
  s = ((s % LOOP) + LOOP) % LOOP;
  for (const sg of SEGS) {
    if (s <= sg.len) {
      if (sg.kind === "line") { const f = s / sg.len, t = [(sg.b[0] - sg.a[0]) / sg.len, (sg.b[1] - sg.a[1]) / sg.len]; return { p: [sg.a[0] + f * (sg.b[0] - sg.a[0]), sg.a[1] + f * (sg.b[1] - sg.a[1])], t, n: sg.n }; }
      const a = sg.a0 + (sg.a1 - sg.a0) * (s / sg.len), n = [Math.cos(a), Math.sin(a)];
      return { p: [sg.c[0] + RS * n[0], sg.c[1] + RS * n[1]], t: [n[1], -n[0]], n };
    }
    s -= sg.len;
  }
  return loopAt(0);
}
const CHH = 18, CHW = 16;                                   // la cadena: medio alto de la placa y medio ancho
// una rueda dentada de nueve dientes, en (x, z)
function sprocketPoly(c, phase = 0) {
  const N = 9, Pd = TAU / N, rr = RS - 22, rt = RS + 22, out = [];
  for (let j = 0; j < N; j++) {
    const a = phase + j * Pd;
    out.push([rr, a - 0.5 * Pd], [rr, a - 0.3 * Pd], [rt, a - 0.13 * Pd], [rt, a + 0.13 * Pd], [rr, a + 0.3 * Pd]);
  }
  return out.map(([r, a]) => [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]);
}
const band = (pts, h) => {
  // la banda de la cadena alrededor de una polilínea de su línea de paso (con sus normales)
  const o = pts.map(({ p, n }) => [p[0] + n[0] * h, p[1] + n[1] * h]), i = pts.map(({ p, n }) => [p[0] - n[0] * h, p[1] - n[1] * h]);
  return [...o, ...i.reverse()];
};
const chainPts = (s0, s1, m) => Array.from({ length: m + 1 }, (_, j) => loopAt(s0 + ((s1 - s0) * j) / m));
const segStart = (k2) => SEGS.slice(0, k2).reduce((q, s) => q + s.len, 0);
// los pasadores de la cadena: puntos cada 152,4 mm en la cara de adelante de la cadena
const pinsOn = (s0, s1, y) => { const pts = []; for (let s = Math.ceil(s0 / 152.4) * 152.4; s < s1; s += 152.4) { const q = loopAt(s); pts.push(at([q.p[0], y, q.p[1]])); } return pts; };
// cada rueda lleva en su elemento la cadena que la abraza y 260 mm de cadena recta a cada lado (en los ramales
// verticales, la mitad del ramal), así la cadena recta no se cruza con la rueda en pantalla
const VHALF = (SP[1][1] - SP[0][1]) / 2;
const CEXT = [[260, VHALF], [VHALF, 260], [260, VHALF], [VHALF, 260]];
{
  const shaftR = CO.shaft;
  SP.forEach((c, q) => {
    const own = "colector", nm = `eje${"ABCD"[q]}`;
    // la chumacera de brida en el muro de atrás
    const bolts = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => at([c[0] + a * 52, -W + 12, c[1] + b * 52]));
    box(`${nm}.placa`, [c[0] - 75, -W, c[1] - 75], [c[0] + 75, -W + 12, c[1] + 75], { owner: own, cls: "cp-cast", extra: Dots(bolts, { size: 0.5, tone: "mid" }) });
    disc(`${nm}.chumacera`, FYo(c[0], c[1]), -W + 12, -1255, 56, { owner: own, cls: "cp-cast" });
    // el eje en tramos entre la chumacera y las ruedas; el último, cortado en y = 0
    const hubs = q === 1 ? [[-1245, -1211], [-1166, -1134], [-166, -134]] : [[-1166, -1134], [-166, -134]];
    const stops = [-1255, ...hubs.flat(), 0];
    for (let j = 0; j < stops.length; j += 2) disc(`${nm}.t${j / 2}`, FYo(c[0], c[1]), stops[j], stops[j + 1], shaftR, { owner: own, capCls: stops[j + 1] === 0 ? "cp-cut1" : null });
    // las dos ruedas dentadas, cada una con el tramo de cadena que la abraza (un cuarto de vuelta) en el mismo elemento
    for (const [b, yc] of CO.cy.entries()) {
      const poly = sprocketPoly(c, q * 0.21);
      const sh = record(A.prism(FY, poly, yc - 10, yc + 10, { name: `${nm}.rueda${b}`, owner: own }));
      const hub = record(A.disc(FYo(c[0], c[1]), yc - 16, yc + 16, 62, { name: `${nm}.cubo${b}`, owner: own }));
      const k2 = [1, 3, 5, 7][q], s0 = segStart(k2) - CEXT[q][0], s1 = segStart(k2) + SEGS[k2].len + CEXT[q][1];
      const cpts = chainPts(s0, s1, 30), cpoly = band(cpts, CHH).map(([x, z]) => [x, z]);
      const ch = record(A.prism(FY, cpoly, yc - CHW, yc + CHW, { name: `${nm}.cadena${b}`, owner: own }));
      const hubSvg = X.prismSvg(C, Array.from({ length: 36 }, (_, i) => [62 * Math.cos((TAU * i) / 36), 62 * Math.sin((TAU * i) / 36)]), yc - 16, yc + 16, { F: FYo(c[0], c[1]), tone: "mid", cls: "cp-cast" });
      const svg = X.prismSvg(C, poly, yc - 10, yc + 10, { F: FY, tone: "mid", cls: "cp-cast" }) + hubSvg + X.prismSvg(C, cpoly, yc - CHW, yc + CHW, { F: FY, tone: "mid", cls: "cp-chain" }) + Dots(pinsOn(s0, s1, yc + CHW), { size: 0.5, tone: "mid" });
      put(`${nm}.rueda${b}`, [c[0], yc, c[1]], svg, [sh, hub, ch]);
    }
  });
  ANCH.RUEDA = [SP[3][0] + RS * 0.5, CO.cy[1] + 10, SP[3][1] - RS * 0.55];
  ANCH.CHUMACERA = [SP[2][0] - 40, -W + 12 + 30, SP[2][1] + 60];
  // los tramos rectos del piso y del retorno, en trozos para el orden (lo de junto a las ruedas va con cada rueda)
  for (const k2 of [0, 4]) {
    const s0 = segStart(k2) + 260, len = SEGS[k2].len - 520, parts = 4;
    for (let j = 0; j < parts; j++) {
      const a = s0 + (len * j) / parts, b = s0 + (len * (j + 1)) / parts, pts = chainPts(a, b, 1), poly = band(pts, CHH);
      for (const [c2, yc] of CO.cy.entries()) fp(`cadena${k2}.${j}.${c2}`, FY, poly, yc - CHW, yc + CHW, { cls: "cp-chain", owner: "colector", extra: Dots(pinsOn(a, b, yc + CHW), { size: 0.5, tone: "mid" }) });
    }
  }
  ANCH.CADENA = (() => { const q = loopAt(1950); return [q.p[0], CO.cy[1] + CHW, q.p[1] + CHH * 0.5]; })();
}
// las paletas: seis, repartidas a lo largo de la cadena; cada una con sus dos zapatas
const FLIGHTS = Array.from({ length: CO.n }, (_, j) => 950 + (j * LOOP) / CO.n);
const FL = CO.flight;
const flightPoly = (q, n0, n1, h) => { const { p, t, n } = q; return [[-h, n0], [h, n0], [h, n1], [-h, n1]].map(([a, b]) => [p[0] + t[0] * a + n[0] * b, p[1] + t[1] * a + n[1] * b]); };
FLIGHTS.forEach((s, j) => {
  const q = loopAt(s), own = "colector";
  const poly = flightPoly(q, CHH, CHH + FL.h, FL.t / 2);
  const shoes = CO.rail.ys.map((yc) => flightPoly(q, CHH + FL.h, CHH + FL.h + 10, 34));
  const shp = [record(A.prism(FY, poly, FL.y0, FL.y1, { name: `paleta${j}`, owner: own }))];
  let svg = "";
  // la zapata de atrás, la paleta y la de adelante, en ese orden (la paleta tapa la de atrás)
  const [ya, yb] = CO.rail.ys;
  shp.push(record(A.prism(FY, shoes[0], ya - 20, ya + 20, { name: `paleta${j}.zapata0`, owner: own })), record(A.prism(FY, shoes[1], yb - 20, yb + 20, { name: `paleta${j}.zapata1`, owner: own })));
  svg += X.prismSvg(C, shoes[0], ya - 20, ya + 20, { F: FY, tone: "mid", cls: "cp-rubber" });
  svg += X.prismSvg(C, poly, FL.y0, FL.y1, { F: FY, tone: "mid", cls: "cp-frp" });
  svg += X.prismSvg(C, shoes[1], yb - 20, yb + 20, { F: FY, tone: "mid", cls: "cp-rubber" });
  // los pernos que la unen a las orejas de la cadena
  const bolts = CO.cy.map((yc) => at([q.p[0] + q.n[0] * (CHH + 40), FL.y1, q.p[1] + q.n[1] * (CHH + 40)]));
  void bolts;
  put(`paleta${j}`, [q.p[0] + q.n[0] * (CHH + FL.h / 2), (FL.y0 + FL.y1) / 2, q.p[1] + q.n[1] * (CHH + FL.h / 2)], svg, shp);
});
ANCH.PALETA = (() => { const q = loopAt(FLIGHTS[1]); return [q.p[0] - FL.t / 2, FL.y1, q.p[1] - CHH - FL.h * 0.45]; })();
ANCH.ZAPATA = (() => { const q = loopAt(FLIGHTS[0]); return [q.p[0] + 40, CO.rail.ys[1] + 20, q.p[1] - CHH - FL.h - 5]; })();
{
  // el motorreductor en la corona del muro de atrás: placa, reductor de ejes en ángulo, motor con aletas y su caja de
  // conexiones; el eje de salida pasa sobre el borde del muro y lleva la rueda de la cadena de transmisión
  const DV = CL.drv, o = "motorreductor", zc = DV.zTop;
  const pb = []; for (const x of [720, 1260]) for (const y of [-1530, -1325]) pb.push(at([x, y, ZT + 16]));
  box(`${o}.placa`, [690, -1545, ZT], [1290, -1310, ZT + 16], { owner: o, cls: "cp-paint", extra: Dots(pb, { size: 0.5, tone: "mid" }) });
  box(`${o}.reductor`, [800, -1500, ZT + 16], [1000, -1335, zc + 130], { owner: o, cls: "cp-paint", r: 8, steps: 3 });
  disc(`${o}.reten`, FYo(DV.x, zc), -1335, -1318, 52, { owner: o, cls: "cp-paint" });
  disc(`${o}.eje`, FYo(DV.x, zc), -1318, DV.y - 8, 28, { owner: o });
  const Fm = FXo(-1418, zc, 0), rm = 98;
  const fins = G.ribsOf(Fm, 1060, 1250, rm, 18, P, { fade: [0.05, 0.45], seams: true });
  turned(`${o}.motor`, Fm, [[1000, 0], [1000, rm - 14], [1020, rm], [1060, rm], [1250, rm], [1262, rm - 8], [1300, rm - 8], [1312, rm - 28], [1312, 0]], { cls: "cp-paint", owner: o, extra: k.fadedSvg(fins, { tone: "lo" }) });
  box(`${o}.pata`, [1080, -1500, ZT + 16], [1230, -1336, zc - rm], { owner: o, cls: "cp-paint" });
  box(`${o}.bornera`, [1090, -1470, zc + rm - 4], [1190, -1366, zc + rm + 50], { owner: o, cls: "cp-paint" });
  // la rueda de arriba y la de abajo (en el eje de la rueda B) y los dos ramales de la cadena
  const top = sprocketPoly([DV.x, zc], 0.1).map(([x, z]) => [DV.x + (x - DV.x) * DV.rTop / RS, zc + (z - zc) * DV.rTop / RS]);
  // la transmisión en un solo elemento: el cubo y la rueda de abajo, la rueda de arriba y los dos ramales encima
  const Bc = SP[1], hs = 8, cs = 14;
  const bot = sprocketPoly(Bc, 0.3).map(([x, z]) => [Bc[0] + (x - Bc[0]) * DV.rBot / RS, Bc[1] + (z - Bc[1]) * DV.rBot / RS]);
  const hubB = Array.from({ length: 36 }, (_, i) => [55 * Math.cos((TAU * i) / 36), 55 * Math.sin((TAU * i) / 36)]);
  const sh = [record(A.prism(FY, bot, DV.y - hs, DV.y + hs, { name: "transmision.rueda.abajo", owner: "transmision" })), record(A.disc(FYo(Bc[0], Bc[1]), -1245, -1211, 55, { name: "transmision.cubo", owner: "transmision" })), record(A.prism(FY, top, DV.y - hs, DV.y + hs, { name: "transmision.rueda.arriba", owner: "transmision" }))];
  let svgT = X.prismSvg(C, hubB, -1245, DV.y - hs, { F: FYo(Bc[0], Bc[1]), tone: "mid", cls: "cp-cast" }) + X.prismSvg(C, bot, DV.y - hs, DV.y + hs, { F: FY, tone: "mid", cls: "cp-cast" }) + X.prismSvg(C, hubB, DV.y + hs, -1211, { F: FYo(Bc[0], Bc[1]), tone: "mid", cls: "cp-cast" });
  svgT += X.prismSvg(C, top, DV.y - hs, DV.y + hs, { F: FY, tone: "mid", cls: "cp-cast" });
  for (const sg of [-1, 1]) {
    const xa = DV.x + sg * (DV.rTop - 4), xb = DV.x + sg * (DV.rBot - 4), h = 7, poly = [[xa - h, zc], [xa + h, zc], [xb + h, Bc[1]], [xb - h, Bc[1]]];
    sh.push(record(A.prism(FY, poly, DV.y - cs, DV.y + cs, { name: "transmision.cadena", owner: "transmision" })));
    svgT += X.prismSvg(C, poly, DV.y - cs, DV.y + cs, { F: FY, tone: "mid", cls: "cp-chain" });
    const pins = [];
    for (let z = Bc[1] + DV.rBot + 40; z < zc - DV.rTop - 20; z += 76) { const f = (zc - z) / (zc - Bc[1]); pins.push(at([xa + (xb - xa) * f, DV.y + cs, z])); }
    svgT += Dots(pins, { size: 0.4, tone: "mid" });
  }
  put("transmision", [DV.x, DV.y, (zc + Bc[1]) / 2], svgT, sh);
  ANCH.MOTOR = [1180, -1418 + rm * 0.7, zc + rm * 0.7];
  ANCH.TRANSMISION = (() => { const z = 4010, f = (zc - z) / (zc - Bc[1]), xa = DV.x + DV.rTop - 4, xb = DV.x + DV.rBot - 4; return [xa + (xb - xa) * f + 7, DV.y + 14, z]; })();
}

/* ====================================================================
   7 · el lodo: en la tolva, en una capa delgada sobre el piso y amontonado delante de las paletas que lo arrastran
   ==================================================================== */
const HEAPS = FLIGHTS.map((s, j) => ({ j, q: loopAt(s) })).filter(({ q }) => q.n[1] < -0.9).map(({ j, q }) => {
  const xf = q.p[0] - FL.t / 2;            // la cara de la paleta que empuja (hacia la entrada)
  return { j, x1: xf, x0: xf - 300, prof: [[xf - 300, 0], [xf, 0], [xf, 72], [xf - 70, 60], [xf - 190, 22]] };
});
{
  // los rieles de desgaste del piso, donde corren las zapatas de las paletas
  for (const [j, yc] of CL.col.rail.ys.entries()) {
    const cuts = [960, ...HEAPS.flatMap((h) => [h.x0, h.x1]).sort((a, b) => a - b), 4720];
    for (let i = 0; i < cuts.length; i += 2) {
      const a = cuts[i], b = cuts[i + 1], bolts = [];
      for (let x = 1100; x < 4700; x += 600) if (x > a + 40 && x < b - 40) bolts.push(at([x, yc, CL.col.rail.t]));
      box(`riel${j}.${i / 2}`, [a, yc - CL.col.rail.w / 2, 0], [b, yc + CL.col.rail.w / 2, CL.col.rail.t], { owner: "colector", extra: Dots(bolts, { size: 0.45, tone: "mid" }) });
    }
  }
}
const ZLODO = 8, ZHOP = -150;
ANCH.RIEL = [2700, CL.col.rail.ys[1], CL.col.rail.t];
const XHOPS = HP.xb + (ZHOP - HP.zb) / Math.tan(60 * D2R);
{
  // la tolva, llena hasta ZHOP: su cara de arriba se ve y su corte va en y = 0
  const poly = [[HP.x0, HP.zb], [HP.xb, HP.zb], [XHOPS, ZHOP], [HP.x0, ZHOP]];
  yCut("lodo.tolva", poly, -W, { cls: "cp-lodo", cutCls: "cp-lodo-c", owner: "lodo" });
  for (const h of HEAPS) yCut(`lodo.monton${h.j}`, h.prof, -W, { cls: "cp-lodo", cutCls: "cp-lodo-c", owner: "colector" });
  // la capa del piso solo se ve en el corte: una franja delgada entre los montones
  const xs = [HP.x1, ...HEAPS.flatMap((h) => [h.x0, h.x1]), L].sort((a, b) => a - b), strips = [];
  for (let i = 0; i < xs.length; i += 2) if (xs[i + 1] > xs[i] + 1) strips.push(rectXZ(xs[i], 0, xs[i + 1], ZLODO));
  put("lodo.corte", [2800, 0, ZLODO / 2], strips.map((q) => cutXZ(q, "cp-lodo-c")).join(""), strips.map((q, i) => A.prism(FY, q, -0.3, 0, { name: `lodo.corte${i}`, owner: "lodo" })));
  ANCH.LODO_TOLVA = [HP.x0 + 120, -500, ZHOP];
  ANCH.MONTON = HEAPS.length ? [HEAPS[0].x1 - 90, 0, 50] : [3000, 0, 30];
}

/* ====================================================================
   9 · las flechas: el agua (azul) entra, pasa el muro difusor, corre bajo el paquete, sube entre las placas y sale
   por la canaleta; el lodo (café) resbala por las placas, el barredor lo lleva a la tolva y sale por la purga
   ==================================================================== */
const INPLANE = [];
function flow(name, ctl, { r = 5, head = 13, w = 6.5, cls = "cp-flujo", hcls = "cp-flecha", into = null } = {}) {
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
const YF = 0;
if (!DET) {
  const I = CL.inlet;
  flow("flujo.llega", [[-1420, I.y, I.z], [-1230, I.y, I.z], [-1060, I.y, I.z]]);
  flow("flujo.camara", [[40, YF, I.z + 20], [170, YF, I.z - 40], [235, YF, I.z - 260]], { into: INPLANE });
  for (const [j, z] of [DF.zs[5], DF.zs[3], DF.zs[1]].entries()) flow(`flujo.orificio${j}`, [[DF.x1 + 20, YF, z], [DF.x1 + 150, YF, z - 10], [DF.x1 + 270, YF, z - 40]], { into: INPLANE });
  flow("flujo.bajo", [[720, YF, 2050], [1000, YF, 1650], [1450, YF, 1430], [1900, YF, 1400]], { into: INPLANE });
  flow("flujo.paquete", [[2300, YF, 1420], [3000, YF, 1420], [3700, YF, 1420]], { into: INPLANE });
  // subiendo por tres canales, por el centro de cada uno
  for (const [j, i] of [12, 27, 42].entries()) {
    const zc0 = ZA + 260, zc1 = PL.ztop - 300, mid = (z) => plateX(i, z) + (PL.gap / 2 + 0.5) / SA;
    flow(`flujo.sube${j}`, [[mid(zc0), YF, zc0], [mid((zc0 + zc1) / 2), YF, (zc0 + zc1) / 2], [mid(zc1), YF, zc1]], { r: 3, head: 9, w: 4.5, into: INPLANE });
  }
  flow("flujo.arriba", [[3050, YF, PL.ztop + 80], [3110, YF, PL.ztop + 300], [3200, YF, ZW - 160]], { into: INPLANE });
  flow("flujo.sale", [[6700, -650, BX.z0 + 130], [6880, -650, BX.z0 + 130], [7060, -650, BX.z0 + 130]]);
  // el lodo
  const lodo = { cls: "cp-flujo-l", hcls: "cp-flecha-l", into: INPLANE };
  for (const [j, i] of [20, 35].entries()) {
    const off = (PL.th + 14) / SA, x0 = (z) => plateX(i, z) + off;
    flow(`lodo.resbala${j}`, [[x0(ZA + 700), YF, ZA + 700], [x0(ZA + 450), YF, ZA + 450], [x0(ZA + 220), YF, ZA + 220]], { ...lodo, r: 3, head: 9, w: 4.5 });
  }
  flow("lodo.piso", [[3300, YF, 140], [2800, YF, 140], [2300, YF, 140]], lodo);
  flow("lodo.tolva", [[1060, YF, 70], [960, YF, 20], [860, YF, -90]], { ...lodo, r: 3, head: 9, w: 4.5 });
  flow("lodo.purga", [[PU.xe - 80, PU.y, ZPU], [PU.xe - 260, PU.y, ZPU], [PU.xe - 440, PU.y, ZPU]], { ...lodo, into: null });
  ANCH.FLUJO_SUBE = [plateX(27, 2250) + (PL.gap / 2) / SA, YF, 2250];
}

/* ====================================================================
   8 · el agua: la cara del corte (y = 0) con los flóculos y las superficies, translúcidas; en pedazos donde la
   atraviesan la canaleta, la pantalla, el muro difusor y la cadena de transmisión
   ==================================================================== */
const facePath = (poly) => pth1(poly.map(([x, z]) => pr([x, 0, z])));
const thinY = (poly, name) => A.prism(FY, poly, -0.3, 0, { name, owner: "agua" });
// los flóculos: puntos en el plano del corte (mucho más grandes que los reales en la vista entera)
const FLOCS = [];
const flocFree = (x, z, r) => {
  if (z < ZLODO + r + 4 && x > HP.x1) return false;
  if (x < r + 4 || x > L - r - 4 || z > ZW - r - 30) return false;
  if (x > DF.x0 - r - 4 && x < DF.x1 + r + 4) return false;
  if (x > HP.x0 && x < HP.x1 && z < 0) { const xs = HP.xb + (z - HP.zb) / Math.tan(60 * D2R); if (x > xs - r - 4 || z < ZHOP + r + 4 || x < HP.x0 + r + 4) return false; }
  // las placas: la distancia a cada cara (en el paquete)
  if (z > ZA - r - 6 && z < PL.ztop + r + 6) for (let i = 0; i < PL.n; i++) { const xu = plateX(i, z); if (x > xu - PL.th / SA - r / SA - 3 && x < xu + r / SA + 3) return false; }
  if (z > ZA - CL.ang.w - r - 4 && z < ZA + r + 4 && x > XB0 - 60 && x < XB0 + PL.n * PITCH + 60) return false;
  for (const c of SP) if (Math.hypot(x - c[0], z - c[1]) < CO.shaft + r + 4) return false;
  if (x > CL.pant.x0 - r - 4 && x < CL.pant.x1 + r + 4 && z > PL.ztop - r - 4) return false;
  for (const h of HEAPS) if (x > h.x0 - r && x < h.x1 + r && z < 80 + r) return false;
  return !FLOCS.some(([a, b, q]) => Math.hypot(a - x, b - z) < q + r + 14);
};
const addFloc = (x, z, r) => { if (flocFree(x, z, r)) FLOCS.push([x, z, r]); };
if (!DET) {
  // la cámara de entrada y el primer cuarto: muchos flóculos, que caen
  const cap = (n, f) => { const m = FLOCS.length; for (let i = 0; i < n * 30 && FLOCS.length < m + n; i++) f(); };
  cap(70, () => addFloc(rnd() * DF.x0, 200 + rnd() * (ZW - 400), 6 + rnd() * 4));
  cap(260, () => { const x = DF.x1 + rnd() * (CL.pant.x0 - DF.x1), z = -140 + rnd() ** 1.6 * (ZW - 200); addFloc(x, z, 5 + rnd() * 5); });
  // bajo el paquete, entrando a las placas y cayendo de sus cantos de abajo
  cap(170, () => { const x = CL.pant.x1 + rnd() * (L - CL.pant.x1), z = 40 + rnd() ** 1.4 * (ZA - 120); addFloc(x, z, 5 + rnd() * 4); });
  // en los canales, pocos y cerca de la placa de abajo; en la placa, la película que resbala
  for (let i = 0; i < PL.n - 1; i++) for (let m = 0; m < 6; m++) {
    const z = ZA + 40 + rnd() ** 1.5 * (PL.ztop - ZA - 200), xu = plateX(i, z), r = 5 + rnd() * 3;
    if (rnd() < 0.4) addFloc(xu + (r + 2) / SA, z, r);
  }
}
{
  const PN = CL.pant, AG = CL.ang;
  const xA0 = XB0 - 50, xA1 = XB0 + (PL.n - 1) * PITCH + 50;
  // la capa de lodo del piso y los montones, en el corte, limitan el agua por abajo
  let bottom = [[HP.x1, ZLODO]];
  for (const h of HEAPS.slice().sort((a, b) => a.x0 - b.x0)) bottom.push([h.x0, ZLODO], ...h.prof.slice(2).reverse().filter((p) => p[1] > 0).reverse().map((p) => p).sort((a, b) => a[0] - b[0]), [h.x1, ZLODO]);
  bottom.push([L, ZLODO]);
  const main = [[HP.x0, ZHOP], [XHOPS, ZHOP], [HP.x1, 0], ...bottom, [L, ZW], [PN.x1, ZW], [PN.x1, PL.ztop], [PN.x0, PL.ztop], [PN.x0, ZW], [DF.x1, ZW]];
  const holes = [];
  for (let i = 0; i < PL.n; i++) holes.push(plate(i));
  holes.push(rectXZ(xA0, ZA - AG.w, xA1, ZA));
  for (const c of SP) holes.push(Array.from({ length: 24 }, (_, j) => [c[0] + CO.shaft * Math.cos((TAU * j) / 24), c[1] + CO.shaft * Math.sin((TAU * j) / 24)]));
  const inlet = rectXZ(0, 0, DF.x0, ZW);
  const dW = facePath(inlet) + facePath(main) + holes.map(facePath).join("");
  let dF = "", dH = "";
  const fl = (x, z, r) => {
    dF += pth1(Array.from({ length: 12 }, (_, i) => { const t = (i / 12) * TAU, rr = r * (0.9 + 0.12 * Math.sin(3 * t + x) + 0.06 * Math.sin(5 * t + z)); return pr([x + rr * Math.cos(t), 0, z + rr * Math.sin(t)]); }));
  };
  for (const [x, z, r] of FLOCS) fl(x, z, r);
  void dH;
  const lines = Ln(path3([[0, 0, ZW], [DF.x0, 0, ZW]]) + path3([[DF.x1, 0, ZW], [PN.x0, 0, ZW]]) + path3([[PN.x1, 0, ZW], [L, 0, ZW]]), { tone: "lo" });
  const shapes = [thinY(inlet, "agua0"), thinY(rectXZ(DF.x1, ZHOP, HP.x1, ZW), "agua1"), thinY(rectXZ(HP.x1, ZLODO, L, ZW), "agua2")];
  put("agua.corte", [L / 2, 0, ZW / 2], `<g class="cp-agua"><path class="cp-agua-cara" fill-rule="evenodd" d="${dW}"/><path class="cp-floc" d="${dF}"/>${lines}</g>${INPLANE.join("")}`, shapes);
  ANCH.FLOCULO = (() => { const f = FLOCS.filter(([x, z, r]) => x > 700 && x < 1150 && z > 2300 && z < 2700 && r > 11)[0] || [900, 2500]; return [f[0], 0, f[1]]; })();
  ANCH.AGUA_CLARA = [3900, 0, 3300];
  ANCH.ZONA = [800, 0, 3200];
}
{
  // las superficies (z = ZW), en pedazos: la cámara de entrada, el primer cuarto (partido por la cadena de
  // transmisión) y la zona de placas (partida por la canaleta)
  const DV = CL.drv, xw = (sg) => DV.x + sg * (DV.rTop - 4 + (DV.rBot - DV.rTop) * (DV.zTop - ZW) / (DV.zTop - SP[1][1])), cx = [xw(-1) - 12, xw(-1) + 12, xw(1) - 12, xw(1) + 12];
  const surf = (name, x0, y0, x1, y1) => {
    const pts = [[x0, y0, ZW], [x1, y0, ZW], [x1, y1, ZW], [x0, y1, ZW]];
    put(name, [(x0 + x1) / 2, (y0 + y1) / 2, ZW], `<path class="cp-agua-sup" d="${pth1(pts.map(pr))}"/>`, [A.box([x0, y0, ZW - 0.3], [x1, y1, ZW], { name, owner: "agua" })]);
  };
  surf("agua.sup.camara", 0, -W, DF.x0, 0);
  surf("agua.sup.zona.atras", DF.x1, -W, CL.pant.x0, DV.y - 16);
  surf("agua.sup.zona", DF.x1, DV.y + 16, CL.pant.x0, 0);
  surf("agua.sup.zona.c0", DF.x1, DV.y - 16, cx[0], DV.y + 16);
  surf("agua.sup.zona.c1", cx[1], DV.y - 16, cx[2], DV.y + 16);
  surf("agua.sup.zona.c2", cx[3], DV.y - 16, CL.pant.x0, DV.y + 16);
  surf("agua.sup.placas", CL.pant.x1, LY1 + LA.wp.t, L, 0);
  surf("agua.sup.placas.atras", CL.pant.x1, -W, L, LY0 - LA.wp.t);
  surf("agua.sup.placas.inicio", CL.pant.x1, LY0 - LA.wp.t, LA.x0 - LA.t, LY1 + LA.wp.t);
  ANCH.SUPERFICIE = [4600, -200, ZW];
}

/* ====================================================================
   10 · el detalle: dos canales doce veces más grandes, con el agua que sube, los flóculos que caen y el lodo que
   resbala por la cara de arriba de cada placa
   ==================================================================== */
if (DET) {
  const cx = CDET[0], cz = CDET[2], half = RDET / KS + 10;
  const near = []; for (let i = 0; i < PL.n; i++) if (Math.abs(plateX(i, cz) - cx) < half * 1.4) near.push(i);
  // la película de lodo sobre la cara de arriba de cada placa: más gruesa hacia abajo
  let film = "", dF = "";
  const FILM = (z) => 0.8 + 2.6 * Math.max(0, Math.min(1, (cz + half * 1.2 - z) / (half * 2.4))) ** 1.3;
  const fl = (x, z, r, seed2) => pth1(Array.from({ length: 16 }, (_, i) => { const t = (i / 16) * TAU, rr = r * (0.92 + 0.1 * Math.sin(2 * t + seed2) + 0.05 * Math.sin(5 * t + 2 * seed2)); return pr([x + rr * Math.cos(t), 0, z + rr * Math.sin(t)]); }));
  for (const i of near) {
    const ts = [], m = 30, z0 = cz - half * 1.2, z1 = cz + half * 1.2;
    for (let j = 0; j <= m; j++) { const z = z0 + ((z1 - z0) * j) / m, th = FILM(z); ts.push([z, th]); }
    const up = ts.map(([z, th]) => [plateX(i, z) + th / SA, z]), on = ts.map(([z]) => [plateX(i, z), z]).reverse();
    film += facePath([...up, ...on]);
  }
  // los flóculos en el agua: de 1 a 3 mm, con más hacia la placa de abajo de cada canal
  const pts = [];
  for (let t = 0; t < 6000 && pts.length < 46; t++) {
    const x = cx + (rnd() * 2 - 1) * half, z = cz + (rnd() * 2 - 1) * half, r = 0.9 + rnd() * 1.3;
    let ok = true;
    for (const i of near) { const xu = plateX(i, z); if (x > xu - PL.th / SA - r - 0.8 && x < xu + (3.2 + r) / SA) ok = false; }
    if (ok && !pts.some(([a, b, q]) => Math.hypot(a - x, b - z) < q + r + 4)) pts.push([x, z, r]);
  }
  for (const [x, z, r] of pts) dF += fl(x, z, r, x);
  // y los que ya llegaron a la placa, sobre la película
  for (const i of near) for (let j = 0; j < 7; j++) { const z = cz - half + rnd() * 2 * half, th = FILM(z), r = 0.8 + rnd() * 0.9; dF += fl(plateX(i, z) + (th + r * 0.7) / SA, z, r, z); }
  const water = rectXZ(cx - half * 1.3, cz - half * 1.3, cx + half * 1.3, cz + half * 1.3);
  const za = cz - half * 1.3, zb = cz + half * 1.3, part = (i) => [[plateX(i, za), za], [plateX(i, zb), zb], [plateX(i, zb) - PL.th / SA, zb], [plateX(i, za) - PL.th / SA, za]];
  const holes = near.map(part).map(facePath).join("");
  const putWater = () => put("agua.detalle", [cx, 0, cz], `<g class="cp-agua"><path class="cp-agua-det" fill-rule="evenodd" d="${facePath(water)}${holes}"/><path class="cp-lodo-pel" d="${film}"/><path class="cp-floc" d="${dF}"/></g>${INPLANE.join("")}`, [thinY(water, "agua.detalle")]);
  // las flechas: el agua sube por el centro de cada canal; el flóculo cae; el lodo resbala pegado a la placa
  const fin = { r: 0.4, head: 9, w: 4.2, cls: "cp-flujo cp-fino", into: INPLANE };
  const chans = near.slice(0, -1).filter((i) => Math.abs(plateX(i, cz) + PL.gap / 2 / SA - cx) < half * 0.9);
  chans.forEach((i, j) => {
    const mid = (z) => plateX(i, z) + (PL.gap / 2 + 0.5) / SA + 4;
    const za = cz - half * 0.55, zb = cz + half * 0.35;
    flow(`d.sube${j}`, [[mid(za), YF, za], [mid((za + zb) / 2), YF, (za + zb) / 2], [mid(zb), YF, zb]], fin);
    const off = (z) => plateX(i, z) + 5.5 / SA, zc = cz + half * 0.4, zd = cz - half * 0.5;
    flow(`d.resbala${j}`, [[off(zc), YF, zc], [off((zc + zd) / 2), YF, (zc + zd) / 2], [off(zd), YF, zd]], { ...fin, cls: "cp-flujo-l cp-fino", hcls: "cp-flecha-l" });
    const xf = plateX(i, cz) + 34 / SA, z0 = cz + 22;
    flow(`d.cae${j}`, [[xf, YF, z0], [xf, YF, z0 - 9], [xf, YF, z0 - 18]], { ...fin, head: 7, w: 3.4, cls: "cp-flujo-l cp-fino", hcls: "cp-flecha-l" });
    if (j === 0) {
      ANCH.D_SUBE = [mid((za + zb) / 2), YF, (za + zb) / 2];
      ANCH.D_RESBALA = [off(cz - half * 0.1) - 1.5 / SA, 0, cz - half * 0.1];
      ANCH.D_CAE = [xf, 0, z0 - 4];
    }
  });
  putWater();
  const i0 = chans[0] ?? near[0];
  ANCH.D_PLACA = [plateX(i0 + 1, cz + half * 0.55) - PL.th / SA / 2, 0, cz + half * 0.55];
  ANCH.D_LODO = [plateX(i0 + 1, cz - half * 0.65) + 1.2 / SA, 0, cz - half * 0.65];
}

/* ---------- orden y salida ---------- */
if (process.env.CL_ITEM) {
  for (const nm of process.env.CL_ITEM.split(",")) {
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
  }) && !/^agua\.(corte|sup)/.test(it.name);
  const keep = R_.items.filter(inView);
  R_.items.splice(0, R_.items.length, ...keep);
}
const t0 = Date.now();
if (!FAST) A.settle(R_, PA, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");
R_.items.sort((a, b) => a.key - b.key);

const shades = (f, t, s) => `--anatomy-paper:${f};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s[0]};--anatomy-shade-1:${s[1]};--anatomy-shade-2:${s[2]};--anatomy-shade-3:${s[3]}`;
const flat = (c) => shades(c, c, [c, c, c, c]);
const CSS = `.cp-cut{${flat("#c9ced3")}}.cp-cut1{${flat("#d6dade")}}.cp-cut-c{${flat("#d2cfc8")}}
.cp-conc{${shades("#e8e6e1", "#efede9", ["#d2cfc8", "#d9d6d0", "#dfddd7", "#e4e2dc"])}}
.cp-ss{${shades("#eef0f2", "#f7f8f9", ["#c9ced3", "#d6dade", "#e1e4e7", "#eceef0"])}}
.cp-paint{${shades("#e4e8ea", "#edf0f1", ["#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4"])}}
.cp-frp{${shades("#e4e8ea", "#edf0f1", ["#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4"])}}
.cp-cast{${shades("#dfe2e5", "#e9ebed", ["#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0"])}}
.cp-chain{${shades("#dfe2e5", "#e9ebed", ["#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0"])}}
.cp-rubber{${shades("#5d666e", "#6b747c", ["#3e464d", "#475057", "#505960", "#576067"])}}
.cp-lodo{${shades("#d9cfb8", "#e3dbc8", ["#a89464", "#b8a67a", "#c6b68f", "#cfc2a3"])}}.cp-lodo-c{${flat("#a89464")}}
.cp-pipe .tb-body{fill:#e1e4e7}.cp-pipe .tb-shine{fill:#f7f8f9}.cp-pipe .tb-shade{fill:#c9ced3}
.cp-bore{fill:#525c64;stroke:none}
.cp-agua-cara{fill:#bcd0e6;fill-opacity:.3;stroke:none}.cp-agua-sup{fill:#bcd0e6;fill-opacity:.32;stroke:none}
.cp-agua .iso-line[data-tone="lo"]{stroke:#8fb0cf}
.cp-agua-det{fill:#bcd0e6;fill-opacity:.8;stroke:none}.cp-lodo-pel{fill:#a89464;stroke:none}
.cp-floc{fill:#7a5634;stroke:none}
.cp-flujo{fill:none;stroke:#2e5e9e;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.cp-flecha{fill:#2e5e9e;stroke:none;opacity:.85}
.cp-flujo-l{fill:none;stroke:#7a5634;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
.cp-flecha-l{fill:#7a5634;stroke:none;opacity:.9}.cp-fino{stroke-width:1.1px}
.cp-det-fondo{fill:#ffffff;stroke:none}.cp-det-marco{fill:none;stroke:#525c64;stroke-width:1px}
${CSS_PERSONA}`;
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
  ? k.figureSvg({ width: W_, height: H_, label: "Dos canales entre placas, ampliados", body: [`<style>${CSS}</style><defs>${DEFS.join("")}<clipPath id="cpDet"><circle cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/></clipPath></defs><g class="cp-items" clip-path="url(#cpDet)"><circle class="cp-det-fondo" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="cp-det-marco" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W_, height: H_, label: "Clarificador de placas en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="cp-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
const base = DET ? "detalle" : "fig";
writeFileSync(join(OUTD, `${base}.svg`), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Clarificador de placas", theme: "light", width: DET ? 400 : 1100, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, `${base}_data.json`), JSON.stringify({ P, W: W_, H: H_, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, { crowd: [] });
