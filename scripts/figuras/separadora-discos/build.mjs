/* ====================================================================
   La separadora centrífuga de discos autodeslodante en isométrico (skill anatomy), para el capítulo 19 del libro de
   operaciones unitarias (Separación centrífuga, «La separadora por dentro»): una máquina mediana de tazón semiabierto,
   de 450 mm de tazón a 5400 r/min, puesta como purificadora de aceite, cortada por el plano del eje (y = 0) sin la
   mitad que mira al lector.
   Concepto: la mezcla baja por el tubo fijo de alimentación, el distribuidor la lleva bajo la pila y sube por los
   agujeros alineados de los discos. Entre cada dos discos, la fase liviana (el aceite, o la crema) va hacia el eje
   por la cara de arriba del disco de abajo y la pesada (el agua, o la leche descremada) y el sólido van hacia afuera
   por la cara de abajo del disco de arriba. La zona neutra queda a la altura de los agujeros; la fija el disco de
   gravedad. Cada líquido sale por su bomba centrípeta (un disco de rodete fijo que mete el borde en el anillo de
   líquido que gira): el liviano por el centro, el pesado por fuera. El sólido se junta en la cámara del diámetro
   mayor; el fondo móvil, apretado arriba por el agua de maniobra, baja una fracción de segundo y el sólido sale por las
   lumbreras al colector del bastidor y al ciclón.
   Corte: el plano y = 0; se quita la mitad que mira al lector (y > 0) del bastidor, la capota, el tazón y todo lo que
   va adentro, la caja de salidas y sus tubos. El eje del tazón, el motor y la rueda no se cortan (los ejes no se
   cortan; el motor y la rueda quedan detrás del plano).
   --detalle: el canal entre dos discos, ampliado, con las gotas de cada fase.
   Uso: node build.mjs [--audit] [--fast] [--detalle] [--check]
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
const SD = GEO.SD;
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const DET = process.argv.includes("--detalle");
const CHECK = process.argv.includes("--check");
const STEP = Number(process.env.SD_STEP || (DET ? 2 : 0.5));
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};
const ZB = SD.ZB, Zp = (zp) => ZB + zp;

/* ---------- la geometría de la pila: líneas de los conos en (r, z') ---------- */
const DS = SD.disc, TANT = Math.tan(DS.ang * D2R), COSA = Math.cos(DS.ang * D2R);
const R1 = DS.R1, R2 = DS.R2, [H0, H1] = DS.hole;
const zu = (r) => SD.skirt.zEdge + (R2 - r) * TANT;                    // la cara de abajo de la falda
const TVS = SD.skirt.t / COSA, TVD = DS.t / COSA, TVT = SD.topDisc.t / COSA;
const zt = (r) => zu(r) + TVS;                                         // la cara de arriba de la falda
const dTop = (k_, r) => zt(r) + k_ * DS.pitch;                         // la cara de arriba del disco k (1..n)
const dBot = (k_, r) => dTop(k_, r) - TVD;
const NT = DS.n + 1;
const tBot = (r) => zt(r) + NT * DS.pitch - TVD;                       // el disco de arriba
const tTop = (r) => tBot(r) + TVT;
const HG = 22;                                                          // la holgura vertical entre el disco de arriba y la capota
const hIn = (r) => tTop(r) + HG, HTV = 28, hOut = (r) => hIn(r) + HTV;
const PIS = SD.piston, zPis = (r) => PIS.zRim + ((PIS.rim - r) * (PIS.zIn - PIS.zRim)) / (PIS.rim - PIS.rIn);
const TD = SD.topDisc, HD = SD.hood;
const hoodNeckZ = hIn(HD.neckIn), hoodOutR = HD.rCone;

/* ---------- la cámara ---------- */
const W_ = DET ? 256 : 1000, H_ = DET ? 256 : 860;
const EXT = [
  [-362, -362, 0], [362, -362, 0], [-362, 0, 0], [362, 0, 0], [0, -362, 0],
  [SD.motor.x1 - SD.motor.fan - 10, SD.drive.y, SD.drive.z + SD.motor.r + 40], [SD.motor.x1 - SD.motor.fan - 10, SD.drive.y, SD.drive.z - SD.motor.r],
  [SD.cyclone.x + SD.cyclone.r + 20, SD.cyclone.y, SD.cyclone.z1 + 70], [SD.cyclone.x + SD.cyclone.r + 20, SD.cyclone.y, 0],
  [0, 0, 1260], [-SD.housing.pipe - 14, 0, 1150], [SD.housing.pipe + 14, 0, 980],
];
const PMAIN = k.fitProjection(EXT, 1000, 860, { pad: 20, azimuth: SD.AZ, elevation: SD.EL });
// el detalle: el canal entre dos discos del lado izquierdo (sin agujeros), en la zona neutra
const DET_K = 6, DET_R = 120;
const CDET = [-DET_R, 0, Zp((dTop(DET_K, DET_R) + dBot(DET_K + 1, DET_R)) / 2)];
const MDET = 9, RDET = 120;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: SD.AZ, elevation: SD.EL }; const c = k.iso(CDET, Q); Q.origin = [W_ / 2 - c[0], H_ / 2 - c[1]]; return Q; })() : PMAIN;
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const KS = G.scaleOf(P);
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
const pthOpen = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("");
const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const BAND = (s) => { const Bd = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < Bd.length && s >= Bd[t]) t++; return t; };

/* El dibujo va en milímetros; el audit, en centímetros (como la prensa de tornillo). */
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
let LIVE = true;
const record = (sh) => { if (LIVE) R_.solid(cm(sh)); return sh; };
const put = (name, ref, svg, shapes = [], rest = {}) => { if (LIVE) R_.put({ piece: "frame", ride: "frame", name, at: ref.map((v) => v * U), svg, shapes: shapes.map(cm), move: [0, 0, 0], ...rest }); };
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);

/* ---------- caras planas ---------- */
const faceSvg = (d, cls, tone = "mid") => `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="${tone}" d="${d}"/></g>`;
const FY = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
const FV = { o: [0, 0, 0], a: ZD, u: XD, v: YD };
const FZs = { o: [0, 0, 0], a: ZD, u: XD, v: YD };
const ell = (F, s, r, n = 48) => G.circleOf(F, s, r, P, n);
function flatFace(pts, n, cls = "", edges = true) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return `<g class="iso-solid${cls ? " " + cls : ""}"><path class="iso-fill" d="${d}"/>` + (b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`) + (edges ? `<path class="iso-line iso-edge" data-tone="mid" d="${d}"/>` : "") + "</g>";
}

/* ---------- piezas ---------- */
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "sd-ss", r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, shapeCut, ref, pre = "", rec = true } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const sh = A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}), ...(shapeCut ? { cut: shapeCut } : {}) });
  if (rec) record(sh);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], pre + wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls) + extra, [sh]);
  return sh;
}
function fp(name, F, poly, s0, s1, { cls = "sd-ss", extra = "", cap = "auto", owner = name, cut = null, ref = null, pre = "", ground, rec = true, seated } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}), ...(seated ? { seated } : {}) });
  if (rec) record(sh);
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, pre + X.prismSvg(C, poly, s0, s1, { F, tone: "mid", cls, cap }) + extra, [sh]);
  return sh;
}
function disc(name, F, s0, s1, r, { cls = "sd-ss", extra = "", owner = name, n = 0, cut = null, ground, pre = "", rec = true } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m + (n === 6 ? PI / 6 : 0); return [r * Math.cos(t), r * Math.sin(t)]; });
  const sh = A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) });
  if (rec) record(sh);
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), pre + X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap: "auto" }) + extra, [sh]);
  return sh;
}
function turned(name, F, meridian, { cls = "sd-ss", extra = "", owner = name, steps = 48, inner = "", pre = "", shapeCut = null, rec = true, smooth } = {}) {
  const paths = G.lathe(meridian, F, P, { ...(steps ? { steps } : {}), ...(smooth !== undefined ? { smooth } : {}) });
  const sh = A.lathe(F, meridian, { name, owner, ...(shapeCut ? { cut: shapeCut } : {}) });
  if (rec) record(sh);
  const s0 = Math.min(...meridian.map((q) => q[0])), s1 = Math.max(...meridian.map((q) => q[0]));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), pre + wrap(S(paths, { tone: "mid", inner }), cls) + extra, [sh]);
  return sh;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 300, gaps = [], cls = "", caps = true, ends = [true, true], touch, owner = name } = {}) {
  if (!LIVE) return;
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(4, Math.min(20, r * 0.5)), gaps, caps }).forEach((part, index) => {
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(tubeSvg(part, { tone }), cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
const FXo = (y, z, x = 0) => ({ o: [x, y, z], a: XD, u: YD, v: ZD });
const FZ = (x, y, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });

/* ---------- semilla ---------- */
let seed = 29;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ====================================================================
   el barrido (de la prensa de tornillo): una sección (s, r) que gira alrededor de un eje. Se pinta cara por cara, de
   atrás hacia adelante; cada arista se dibuja con la cara visible que va después.
   ==================================================================== */
function sweepSvg({ F, profile, a0, a1, steps = 0, pitch = 0, smooth = [], skip = [], capA = "end", capB = "end", cls = "sd-ss", cutCls = "sd-cut", capLast = false, tone = "mid" }) {
  const m = profile.length;
  const n = steps || Math.max(2, Math.ceil(Math.abs(a1 - a0) / (5 * D2R)));
  const pt = (phi, s, r) => G.add3(G.add3(F.o, G.mul3(F.a, s + (pitch * phi) / TAU)), G.add3(G.mul3(F.u, r * Math.cos(phi)), G.mul3(F.v, r * Math.sin(phi))));
  const phis = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n);
  const Pg = phis.map((phi) => profile.map(([s, r]) => pt(phi, s, r)));
  const sc = profile.reduce((q, p) => q + p[0], 0) / m, rc = profile.reduce((q, p) => q + p[1], 0) / m;
  const faces = [];
  const fid = (i, j) => i * m + j;
  // la normal de cada lado de la sección sale de su sentido de giro (no del centroide: la sección puede ser cóncava)
  let area2 = 0; for (let j = 0; j < m; j++) { const [s1, r1] = profile[j], [s2, r2] = profile[(j + 1) % m]; area2 += s1 * r2 - s2 * r1; }
  const wind = area2 > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    if (skip.includes(j)) { faces.push(null); continue; }
    const j2 = (j + 1) % m, q = [Pg[i][j], Pg[i + 1][j], Pg[i + 1][j2], Pg[i][j2]];
    const cen = q.reduce((a, b) => G.add3(a, b), [0, 0, 0]).map((v) => v / 4);
    const pm = (phis[i] + phis[i + 1]) / 2;
    const ds = profile[j2][0] - profile[j][0], dr = profile[j2][1] - profile[j][1];
    if (Math.hypot(ds, dr) < 1e-9 || (profile[j][1] < 1e-9 && profile[j2][1] < 1e-9)) { faces.push(null); continue; }
    // hacia afuera de la sección (s, r): (dr, −ds) si gira contra el reloj
    const ns = wind * dr, nr = -wind * ds;
    const er4 = G.add3(G.mul3(F.u, Math.cos(pm)), G.mul3(F.v, Math.sin(pm)));
    let nn = G.add3(G.mul3(F.a, ns), G.mul3(er4, nr));
    if (G.len3(nn) < 1e-9) { faces.push(null); continue; }
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
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const fa = faces[fid(i, (j - 1 + m) % m)], fb = faces[fid(i, j)];
    const corner = !smooth.includes(j);
    const draw = vis(fa) !== vis(fb) || (corner && vis(fa) && vis(fb));
    if (draw) edges.get(later(fa, fb)).push(seg(Pg[i][j], Pg[i + 1][j]));
  }
  for (let i = 0; i <= n; i++) for (let j = 0; j < m; j++) {
    const j2 = (j + 1) % m, e = seg(Pg[i][j], Pg[i][j2]);
    if (i === 0 || i === n) {
      const f = faces[fid(i === 0 ? 0 : n - 1, j)], c = i === 0 ? cA : cB;
      if (!c) continue;
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

/* ====================================================================
   las piezas de revolución del eje vertical: la mitad de atrás (180° a 360°) en sectores, sin tapas, y las caras del
   corte en el plano y = 0 aparte. Así cada sector se ordena solo contra lo que tiene adelante y atrás, y las caras del
   corte quedan en el plano, como el líquido.
   ==================================================================== */
const BIG = 6000;
const halfSpace = (n) => A.orientedBox(G.mul3(n, BIG), [n, G.cross3(ZD, n), ZD], [BIG, BIG, BIG], { name: "corte" });
const wedgeCuts = (a0, a1) => { const p0 = a0 * D2R, p1 = a1 * D2R; return [halfSpace([Math.sin(p0), -Math.cos(p0), 0]), halfSpace([-Math.sin(p1), Math.cos(p1), 0])]; };
const SECT = [[180, 255], [255, 330], [330, 360]];
// prof: polígono cerrado en (r, z); se gira alrededor del eje vertical
function revBack(name, prof, { cls = "sd-ss", owner = name, sectors = SECT, skip = [], smooth = [], rec = true, ref = null, extraCut = [], tone = "mid", extras = null, shapeProfs = null } = {}) {
  const profile = prof.map(([r, z]) => [z, r]);
  const rmax = Math.max(...prof.map((q) => q[0])), zc = prof.reduce((q, p) => q + p[1], 0) / prof.length;
  const out = [];
  for (const [a0, a1] of sectors) {
    const steps = Math.max(3, Math.round((a1 - a0) / 6));
    const svg = sweepSvg({ F: FV, profile, a0: a0 * D2R, a1: a1 * D2R, cls, capA: "none", capB: "none", skip, smooth, steps, tone }) + (extras ? extras(a0, a1) : "");
    const shs = (shapeProfs || [prof]).map((pp, i) => A.lathe(FV, pp.map(([r, z]) => [z, r]), { name: `${name}.${a0}${i ? "." + i : ""}`, owner, cut: [...wedgeCuts(a0, a1), ...extraCut] }));
    if (rec) shs.forEach(record);
    const am = ((a0 + a1) / 2) * D2R, rr = ref ? ref : rmax * 0.8;
    put(`${name}.${a0}`, [rr * Math.cos(am), rr * Math.sin(am), zc], svg, shs);
    out.push(...shs);
  }
  return out;
}
// los puntos de un círculo de pernos que caen en un sector
const boltsIn = (r, z, step, phase = 0) => (a0, a1) => { const pts = []; for (let a = 180 + phase; a < 360; a += step) if (a >= a0 && a < a1) pts.push(at([r * Math.cos(a * D2R), r * Math.sin(a * D2R), z])); return pts.length ? Dots(pts, { size: 0.55, tone: "mid" }) : ""; };
// una cara del corte: polígono en (x, z) en y = 0
const capPolys = []; // para --check
function cap(name, polyXZ, { cls = "sd-cut", owner = name, rec = true, tone = "mid", extra = "", kind = "metal" } = {}) {
  const d = pth1(polyXZ.map(([x, z]) => pr([x, 0, z])));
  const sh = A.prism(FY, polyXZ, -0.3, 0, { name, owner });
  if (rec) record(sh);
  const cx = polyXZ.reduce((q, p) => q + p[0], 0) / polyXZ.length, cz = polyXZ.reduce((q, p) => q + p[1], 0) / polyXZ.length;
  put(name, [cx, 0, cz], faceSvg(d, cls, tone) + extra, [sh]);
  capPolys.push({ name, poly: polyXZ, kind });
}
// la misma sección a los dos lados: (r, z) → x = ±r
const mirror = (polyRZ, s) => polyRZ.map(([r, z]) => [s * r, z]);
function capsLR(name, right, left = right, opts = {}) {
  if (right) cap(`${name}.der`, mirror(right, 1), opts);
  if (left) cap(`${name}.izq`, mirror(left, -1), opts);
}
// una cara de líquido (o de sólido) en el plano del corte; no se registra como pieza (no sostiene nada)
function liquid(name, polyXZ, cls, { extra = "", line = "sd-liq-line", front = 0 } = {}) {
  const d = pth1(polyXZ.map(([x, z]) => pr([x, 0, z])));
  const sh = A.prism(FY, polyXZ, front - 0.3, front, { name, owner: "liquido" });
  const cx = polyXZ.reduce((q, p) => q + p[0], 0) / polyXZ.length, cz = polyXZ.reduce((q, p) => q + p[1], 0) / polyXZ.length;
  put(name, [cx, 0, cz], `<path class="${cls}" d="${d}"/>` + extra + (line ? `<path class="${line}" d="${d}"/>` : ""), [sh]);
  capPolys.push({ name, poly: polyXZ, kind: "liquido" });
}
const zp = (poly) => poly.map(([r, z]) => [r, Zp(z)]);   // (r, z') → (r, z)

/* ====================================================================
   1 · el bastidor: un cilindro de fundición con la brida de la base sobre cojines de caucho, el piso, la cubierta que
   separa la cámara del engranaje de la del tazón, y la brida de arriba donde se apoya la capota
   ==================================================================== */
const FR = SD.frame;
const FRAME_RZ = [[FR.rIn, FR.z0], [FR.base[1], FR.z0], [FR.base[1], FR.base[3]], [FR.rOut, FR.base[3]], [FR.rOut, FR.fl[2]], [FR.fl[1], FR.fl[2]], [FR.fl[1], FR.z1], [FR.rIn, FR.z1], [FR.rIn, FR.deck[1]], [FR.deckIn, FR.deck[1]], [FR.deckIn, FR.deck[0]], [FR.rIn, FR.deck[0]]];
const DR = SD.drive;
// los agujeros del eje horizontal en la pared del bastidor (para el audit)
const SHAFT_HOLE = A.disc(FXo(DR.y, DR.z, 0), -400, 400, DR.shaft + 1, { name: "agujero.eje" });
const WER = [Math.cos(SD.water.phi * D2R), Math.sin(SD.water.phi * D2R), 0];
const WATER_HOLE = A.disc({ o: [0, 0, SD.water.z], a: WER, u: ZD, v: G.cross3(WER, ZD) }, FR.rIn - 20, FR.rOut + 20, 16.5, { name: "agujero.agua" });
{
  const WALL = [[FR.rIn, FR.z0], [FR.base[1], FR.z0], [FR.base[1], FR.base[3]], [FR.rOut, FR.base[3]], [FR.rOut, FR.fl[2]], [FR.fl[1], FR.fl[2]], [FR.fl[1], FR.z1], [FR.rIn, FR.z1]];
  const DECK = [[FR.deckIn, FR.deck[0]], [FR.rIn, FR.deck[0]], [FR.rIn, FR.deck[1]], [FR.deckIn, FR.deck[1]]];
  revBack("bastidor", WALL, { cls: "sd-cast", owner: "bastidor", rec: false });
  revBack("bastidor.cubierta", DECK, { cls: "sd-cast", owner: "bastidor" });
  // para el audit: la pared con los agujeros del eje horizontal y del tubo del agua de maniobra
  for (const [a0, a1] of SECT) record(A.lathe(FV, WALL.map(([r, z]) => [z, r]), { name: `bastidor.forma.${a0}`, owner: "bastidor", cut: [...wedgeCuts(a0, a1), SHAFT_HOLE, WATER_HOLE] }));
  capsLR("bastidor", FRAME_RZ, FRAME_RZ, { cls: "sd-cut-c", owner: "bastidor" });
  // el piso: una sola cara de lado a lado
  revBack("bastidor.piso", [[0, FR.floor[0]], [FR.rIn, FR.floor[0]], [FR.rIn, FR.floor[1]], [0, FR.floor[1]]], { cls: "sd-cast", owner: "bastidor", skip: [3] });
  cap("bastidor.piso", [[-FR.rIn, FR.floor[0]], [FR.rIn, FR.floor[0]], [FR.rIn, FR.floor[1]], [-FR.rIn, FR.floor[1]]], { cls: "sd-cut-c", owner: "bastidor" });
  // los cojines de caucho bajo la brida de la base, con su plato
  const CU = SD.cushion;
  for (const a of CU.angs) {
    const ph = a * D2R, x = CU.at * Math.cos(ph), y = CU.at * Math.sin(ph);
    const onCut = Math.abs(Math.sin(ph)) < 1e-6;
    disc(`cojin${a}`, FZ(x, y), 0, CU.h - 14, CU.r, { cls: "sd-rubber", owner: "cojin", ground: true });
    disc(`cojin${a}.plato`, FZ(x, y), CU.h - 14, CU.h, CU.r + 6, { cls: "sd-ss", owner: "cojin" });
    void onCut;
  }
  ANCH.COJIN = [CU.at * Math.cos(CU.angs[2] * D2R), CU.at * Math.sin(CU.angs[2] * D2R), 14];
  ANCH.BASTIDOR = [FR.rOut * Math.cos(345 * D2R), FR.rOut * Math.sin(345 * D2R), 300];
}

/* ====================================================================
   2 · la capota del bastidor: un cono de chapa sobre la brida de arriba, con el cuello donde se apoya la caja de
   salidas
   ==================================================================== */
const FH = SD.fhood;
const FHM = (FH.cone1[1] - FH.cone0[1]) / (FH.cone0[0] - FH.cone1[0]);
const FHV = FH.t / Math.cos(Math.atan(FHM));
const fhOut = (r) => FH.cone0[1] + FHV + (FH.cone0[0] - r) * FHM, fhIn = (r) => FH.cone0[1] + (FH.cone0[0] - r) * FHM;
const [NK0, NK1, NKz0, NKz1] = FH.neck;
const FHOOD_RZ = [[FH.cone0[0], FR.z1], [FH.rBot, FR.z1], [FH.rBot, FH.cone0[1]], [FH.cone0[0] + FHV / FHM, FH.cone0[1]], [NK1, fhOut(NK1)], [NK1, NKz1], [NK0, NKz1], [NK0, fhIn(NK0)]];
const SECT_CONE = [[180, 250], [250, 310], [310, 330], [330, 360]];
{
  revBack("capota", FHOOD_RZ, { cls: "sd-ss", owner: "capota", sectors: SECT_CONE, extras: boltsIn(FH.rBot - 10, FH.cone0[1], 20, 10) });
  capsLR("capota", FHOOD_RZ, FHOOD_RZ, { owner: "capota" });
  ANCH.CAPOTA = [fhIn(230) > 0 ? 236 * Math.cos(335 * D2R) : 0, 236 * Math.sin(335 * D2R), fhOut(236) - 4];
}

/* ====================================================================
   3 · el accionamiento: el eje vertical con su tornillo sin fin, sus dos rodamientos (el del cuello, con resortes), la
   rueda de bronce en el eje horizontal, la placa del motor en la pared del bastidor, la linterna y el motor
   ==================================================================== */
const SP = SD.spindle, WM = DR.worm, WH = DR.wheel;
// un polígono (r, z) recortado a una franja de z (Sutherland–Hodgman)
function clipZ(poly, za, zb) {
  const clip = (pts, inside, cross) => { const out = []; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length], ip = inside(p), iq = inside(q); if (ip) out.push(p); if (ip !== iq) out.push(cross(p, q)); } return out; };
  const at_ = (zv) => (p, q) => [p[0] + ((q[0] - p[0]) * (zv - p[1])) / (q[1] - p[1]), zv];
  return clip(clip(poly, (p) => p[1] >= za, at_(za)), (p) => p[1] <= zb, at_(zb));
}
// media vuelta de una pieza de revolución alrededor del eje vertical, con su forma recortada a esa mitad (para los ejes,
// que no se cortan: la mitad de atrás se ordena con lo de atrás y la de adelante con lo de adelante)
function halfRev(name, prof, half, { cls = "sd-ss", owner = name, steps = 36, skip = [], smooth = [] } = {}) {
  if (half === "atras") {
    // la mitad de atrás en dos sectores, partida donde el cilindro deja de mirar al lector
    for (const [b0, b1] of [[180, 330], [330, 360]]) {
      const profile = prof.map(([r, z]) => [z, r]);
      const svg = sweepSvg({ F: FV, profile, a0: b0 * D2R, a1: b1 * D2R, cls, capA: "none", capB: "none", steps: Math.max(3, Math.round((b1 - b0) / 5)), skip, smooth });
      const sh = record(A.lathe(FV, profile, { name: `${name}.atras.${b0}`, owner, cut: wedgeCuts(b0, b1) }));
      const zc = prof.reduce((q, p) => q + p[1], 0) / prof.length, am = ((b0 + b1) / 2) * D2R;
      put(`${name}.atras.${b0}`, [10 * Math.cos(am), 10 * Math.sin(am), zc], svg, [sh]);
    }
    return;
  }
  const [a0, a1] = half === "atras" ? [PI, TAU] : [0, PI];
  const profile = prof.map(([r, z]) => [z, r]);
  const svg = sweepSvg({ F: FV, profile, a0, a1, cls, capA: "none", capB: "none", steps, skip, smooth });
  const sh = record(A.lathe(FV, profile, { name: `${name}.${half}`, owner, cut: [halfSpace(half === "atras" ? YD : [0, -1, 0])] }));
  const zc = prof.reduce((q, p) => q + p[1], 0) / prof.length;
  put(`${name}.${half}`, [0, half === "atras" ? -10 : 10, zc], svg, [sh]);
}
{
  // el eje del tazón, entero (los ejes no se cortan): abajo el muñón del rodamiento, el tornillo sin fin, el cuello y el
  // cono donde asienta el tazón, con la tuerca y la rosca de la punta
  const teeth = [];
  for (let z = WM.z0; z < WM.z1 - 1; z += 12.5) teeth.push([WM.core, z], [WM.r + 6, z + 4], [WM.r + 6, z + 8.5], [WM.core, z + 12.5]);
  const BC = SD.bowl.cone, zt0 = Zp(BC.z1);
  const mer = [[0, SP.bot], [SP.r0 - 3, SP.bot], [SP.r0, SP.bot + 4], [SP.r0, WM.z0 - 4], [WM.core, WM.z0 - 4], ...teeth, [WM.core, WM.z1 + 4], [SP.r, WM.z1 + 4], [SP.r, SP.neck[0] + 40], [SP.journal, SP.neck[0] + 40], [SP.journal, SP.neck[1] - 10], [SP.r, SP.neck[1] - 10], [BC.r0 - 1, Zp(BC.z0)], [BC.r1 - 1, zt0], [28, zt0], [28, zt0 + 20], [16, zt0 + 20], [16, zt0 + 34], [0, zt0 + 34]];
  const smooth = [];
  // la mitad de atrás, solo entre el rodamiento de abajo y el cubo del tazón: dentro de ellos la tapa la mitad de
  // adelante (queda una franja de un píxel, la que el cubo y la caja del rodamiento tapan por el corte)
  halfRev("eje", clipZ(mer, SP.lower[1], Zp(BC.z0) - 0.5), "atras", { owner: "accionamiento" });
  halfRev("eje", mer, "adelante", { owner: "accionamiento", skip: [mer.length - 1] });
  void smooth;
  ANCH.EJE = [SP.r * Math.cos(-30 * D2R), SP.r * Math.sin(-30 * D2R), (WM.z1 + SP.neck[0]) / 2 + 20];
  ANCH.SINFIN = [(WM.r + 6) * Math.cos(-10 * D2R), (WM.r + 6) * Math.sin(-10 * D2R), (WM.z0 + WM.z1) / 2 + 20];
  // el rodamiento de abajo, en su caja sobre el piso (de atrás, una sola pieza)
  const L1 = SP.lower[1];
  const ri = SP.r0 + 1;
  const LB = [[40, SP.lower[0]], [70, SP.lower[0]], [70, L1], [ri, L1], [ri, L1 - 10], [40, L1 - 10]];
  const LBR = [[ri, L1 - 34], [40, L1 - 34], [40, L1 - 10], [ri, L1 - 10]];
  revBack("rodamiento.abajo", [[40, SP.lower[0]], [70, SP.lower[0]], [70, L1], [ri, L1], [ri, L1 - 34], [40, L1 - 34]], { cls: "sd-cast", owner: "bastidor", sectors: [[180, 270], [270, 360]] });
  capsLR("rodamiento.abajo.caja", LB, LB, { cls: "sd-cut-c", owner: "bastidor" });
  capsLR("rodamiento.abajo.aro", LBR, LBR, { cls: "sd-cut1", owner: "bastidor" });
  // el rodamiento del cuello: el aro con el rodamiento y la caja sobre la cubierta del bastidor, con su tapa
  const NB = SP.neck, rj = SP.journal;
  const HOLD = [[rj, NB[0] + 46], [56, NB[0] + 46], [56, NB[1] - 16], [rj, NB[1] - 16]];
  const CASE = [[72, NB[0]], [90, NB[0]], [90, FR.deck[1]], [FR.deckIn + 30, FR.deck[1]], [FR.deckIn + 30, FR.deck[1] + 12], [90, FR.deck[1] + 12], [90, NB[1] - 10], [72, NB[1] - 10]];
  const LID = [[rj + 4, NB[1] - 10], [90, NB[1] - 10], [90, NB[1]], [rj + 4, NB[1]]];
  revBack("rodamiento.cuello.caja", CASE, { cls: "sd-cast", owner: "bastidor" });
  revBack("rodamiento.cuello.tapa", LID, { cls: "sd-cast", owner: "bastidor", sectors: [[180, 270], [270, 360]] });
  capsLR("rodamiento.cuello.caja", CASE, CASE, { cls: "sd-cut-c", owner: "bastidor" });
  capsLR("rodamiento.cuello.tapa", LID, LID, { cls: "sd-cut-c", owner: "bastidor" });
  capsLR("rodamiento.cuello", HOLD, HOLD, { cls: "sd-cut1", owner: "bastidor" });
  ANCH.RODAMIENTO_CUELLO = [90 * Math.cos(-25 * D2R), 90 * Math.sin(-25 * D2R), NB[1] - 30];
}
{
  // la rueda (de bronce) en el eje horizontal, de una pieza: cubo, alma y aro; los dientes son rayas sesgadas
  const Fw = FXo(DR.y, DR.z, 0);
  const wheel = [[-30, DR.shaft], [-30, WH.hub], [-WH.web / 2, WH.hub], [-WH.web / 2, WH.rimIn], [-WH.w / 2, WH.rimIn], [-WH.w / 2, WH.rOut - 4], [-WH.w / 2 + 3, WH.rOut - 1], [WH.w / 2 - 3, WH.rOut - 1], [WH.w / 2, WH.rOut - 4], [WH.w / 2, WH.rimIn], [WH.web / 2, WH.rimIn], [WH.web / 2, WH.hub], [30, WH.hub], [30, DR.shaft]];
  const teeth = G.ribsOf(Fw, -WH.w / 2 + 3, WH.w / 2 - 3, WH.rOut - 1, 34, P, { twist: 0.18, fade: [0.04, 0.4] });
  const svg = sweepSvg({ F: Fw, profile: wheel, a0: 0, a1: TAU, cls: "sd-bronze", capA: "none", capB: "none", steps: 60, skip: [wheel.length - 1] }) + k.fadedSvg(teeth, { tone: "mid" });
  put("rueda", [0, DR.y, DR.z], svg, [record(A.lathe(Fw, wheel, { name: "rueda", owner: "accionamiento" }))]);
  ANCH.RUEDA = [WH.w / 2, DR.y + (WH.rOut - 6) * Math.cos(0.9), DR.z + (WH.rOut - 6) * Math.sin(0.9)];
  // el eje horizontal, en tramos entre la pared, el tambor del freno, el cubo de la rueda y la otra pared
  const xIn = 226, BRK = [-180, -140];
  // las cajas de los rodamientos del eje horizontal, por dentro de la pared: planas hacia el eje, curvas contra la pared
  for (const s of [-1, 1]) {
    const plan = [[s * xIn, DR.y - 40], [s * xIn, DR.y + 40]];
    for (let j = 0; j <= 12; j++) { const y = DR.y + 40 - (80 * j) / 12; plan.push([s * Math.sqrt(FR.rIn ** 2 - y * y), y]); }
    fp(`eje.horizontal.caja${s > 0 ? 1 : 0}`, FZs, s > 0 ? plan : plan.slice().reverse(), DR.z - 40, DR.z + 40, { cls: "sd-cast", owner: "bastidor" });
  }
  disc("eje.horizontal.0", Fw, -xIn, BRK[0], DR.shaft, { cls: "sd-ss", owner: "accionamiento" });
  disc("eje.horizontal.1", Fw, BRK[1], -30, DR.shaft, { cls: "sd-ss", owner: "accionamiento" });
  disc("eje.horizontal.2", Fw, 30, xIn, DR.shaft, { cls: "sd-ss", owner: "accionamiento" });
  // el tambor del freno, con la zapata en su palanca
  disc("freno.tambor", Fw, BRK[0], BRK[1], 70, { cls: "sd-cast", owner: "accionamiento" });
  const zb = DR.z - 70 - 2;
  box("freno.zapata", [BRK[0] + 4, DR.y - 26, zb - 14], [BRK[1] - 4, DR.y + 26, zb], { cls: "sd-rubber", owner: "freno" });
  box("freno.palanca", [BRK[0] + 10, DR.y - 10, FR.floor[1]], [BRK[1] - 10, DR.y + 10, zb - 14], { cls: "sd-cast", owner: "freno" });
  ANCH.FRENO = [BRK[1], DR.y + 70 * Math.cos(1.25), DR.z + 70 * Math.sin(1.25)];
}
{
  // la placa del motor: un prisma que sigue la pared del bastidor por dentro y queda plano por fuera
  const M = SD.motor, xP = -345;
  const plan = [[xP, DR.y + 110], [xP, DR.y - 112]];
  for (let j = 0; j <= 16; j++) { const y = DR.y - 112 + (222 * j) / 16; plan.push([-Math.sqrt(FR.rOut ** 2 - y * y), y]); }
  fp("motor.placa", FZs, plan, DR.z - 115, DR.z + 115, { cls: "sd-cast", owner: "bastidor", cut: SHAFT_HOLE });
  // la linterna, la brida del motor, el cuerpo con aletas, la tapa del ventilador y la caja de bornes
  const Fm = FXo(DR.y, DR.z, 0);
  turned("motor.linterna", Fm, [[M.lantern[1] - 12, 0], [M.lantern[1] - 12, 112], [xP - 10, 112], [xP - 10, 126], [xP, 126], [xP, 0]], { cls: "sd-cast", owner: "accionamiento", steps: 64 });
  const fins = G.ribsOf(Fm, M.x1 + 30, M.x0 - 54, M.r, 30, P, { fade: [0.05, 0.45], seams: true });
  turned("motor", Fm, [[M.x1, 0], [M.x1, M.r - 22], [M.x1 + 30, M.r], [M.x0 - 54, M.r], [M.x0 - 38, M.r - 10], [M.x0 - 12, M.r - 10], [M.x0 - 12, M.flange], [M.x0, M.flange], [M.x0, 0]], { cls: "sd-paint", owner: "accionamiento", steps: 72, extra: k.fadedSvg(fins, { tone: "lo" }) });
  const grille = []; for (let r = 18; r < M.r - 40; r += 15) grille.push(ell(Fm, M.x1 - M.fan, r, 48));
  turned("motor.ventilador", Fm, [[M.x1 - M.fan, 0], [M.x1 - M.fan, M.r - 34], [M.x1 - 18, M.r - 8], [M.x1, M.r - 8], [M.x1, 0]], { cls: "sd-paint", owner: "accionamiento", steps: 64, extra: Ln(grille.join(""), { tone: "lo" }) });
  // la caja de bornes: un prisma cuya cara de abajo sigue el cuerpo del motor
  const FXs = { o: [0, 0, 0], a: XD, u: YD, v: ZD }, bw = 56, sec = [];
  for (let j = 0; j <= 12; j++) { const y = -bw + (2 * bw * j) / 12; sec.push([DR.y + y, DR.z + Math.sqrt(M.r * M.r - y * y)]); }
  sec.push([DR.y + bw, DR.z + M.r + 64], [DR.y - bw, DR.z + M.r + 64]);
  fp("motor.bornes", FXs, sec.reverse(), M.x1 + 40, M.x1 + 150, { cls: "sd-paint", owner: "accionamiento" });
  ANCH.MOTOR = [M.x1 - 30, DR.y + (M.r - 20) * Math.cos(-0.9), DR.z + (M.r - 20) * Math.sin(-0.9)];
}

/* ====================================================================
   4 · el tazón: el cuerpo con su columna central y las lumbreras, el fondo móvil sobre el agua de maniobra, el anillo
   de sello, la capota del tazón, el anillo de cierre, el distribuidor con su falda, la pila de discos, el disco de
   arriba con su cuello, el disco de gravedad y el anillo chico que forma la cámara del pesado
   ==================================================================== */
const BW = SD.bowl;
const usZ = (r) => (r <= 180 ? 0 : r <= 205 ? ((r - 180) * 6) / 25 : 6 + ((r - 205) * 34) / 21);   // la cara de abajo del cuerpo
const [PT0, PT1] = BW.port, FW0 = BW.feed.r - BW.feed.w / 2, FW1 = BW.feed.r + BW.feed.w / 2;
const BODY_OUT = [[BW.cone.r0, BW.cone.z0], [60, BW.cone.z0], [60, 0], [180, 0], [205, 6], [BW.rO, 40], [BW.rO, BW.wallTop], [BW.rW, BW.wallTop], [BW.rW, BW.chamber[0]], [BW.col.rOut, BW.chamber[0]], [BW.col.rOut, BW.col.top], [BW.col.rIn, BW.col.top], [BW.col.rIn, BW.cone.z1], [BW.cone.r1, BW.cone.z1]];
// el cuerpo en el corte: la columna con el fondo hasta el canal del agua, el fondo de afuera hasta las lumbreras, y el
// anillo de la pared sobre ellas
const BODY_IN = [[BW.cone.r0, BW.cone.z0], [60, BW.cone.z0], [60, 0], [FW0, usZ(FW0)], [FW0, BW.chamber[0]], [BW.col.rOut, BW.chamber[0]], [BW.col.rOut, BW.col.top], [BW.col.rIn, BW.col.top], [BW.col.rIn, BW.cone.z1], [BW.cone.r1, BW.cone.z1]];
const BODY_OUTER = [[FW1, usZ(FW1)], [180, 0], [205, 6], [BW.rO, 40], [BW.rO, PT0], [BW.rW, PT0], [BW.rW, BW.chamber[0]], [FW1, BW.chamber[0]]];
const BODY_WALL = [[BW.rW, PT1], [BW.rO, PT1], [BW.rO, BW.wallTop], [BW.rW, BW.wallTop]];
const PISTON = [[PIS.rIn, PIS.zBot], [PIS.rOut, PIS.zBot], [PIS.rOut, PIS.zRim], [PIS.rim, PIS.zRim], [PIS.rIn, PIS.zIn]];
const SEAL = [[SD.seal.r0, SD.seal.z0], [SD.seal.r1, SD.seal.z0], [SD.seal.r1, SD.seal.z1], [SD.seal.r0, SD.seal.z1]];
const [SH0, SH1] = HD.shoulder;
const HOOD = [[HD.skirtIn, SD.seal.z1], [PIS.rOut, SD.seal.z1], [PIS.rOut, SH0], [HD.rFl, SH0], [HD.rFl, SH1], [HD.rCone, SH1], [HD.rCone, hOut(HD.rCone)], [HD.neckOut, hOut(HD.neckOut)], [HD.neckOut, HD.top], [HD.neckIn, HD.top], [HD.neckIn, hIn(HD.neckIn)], [HD.skirtIn, hIn(HD.skirtIn)]];
const LK = SD.lock;
const LOCK = [[LK.r0, LK.z0], [LK.r1, LK.z0], [LK.r1, LK.z1], [LK.lip, LK.z1], [LK.lip, SH1], [LK.r0, SH1]];
const GV = SD.grav, CV = SD.cover;
const GRAV = [[GV.rA, GV.z0], [GV.r1 - 0.6, GV.z0], [GV.r1 - 0.6, GV.z1 - 0.6], [GV.rA, GV.z1 - 0.6]];
const COVER = [[GV.r1, HD.top], [HD.neckOut, HD.top], [HD.neckOut, CV.z1], [CV.roofIn, CV.z1], [CV.roofIn, CV.z1 - 8], [CV.r0, CV.z1 - 8], [CV.r0, GV.z1], [GV.r1, GV.z1]];
// el distribuidor: el piso con el cubo hasta los puertos (una sola cara de lado a lado), y arriba el cubo, la falda y el
// cuello; a la derecha la falda tiene el agujero de la columna de alimentación
const DI = SD.dist;
const DIST_FLOOR_XZ = [[-BW.col.rOut, DI.floor[0]], [BW.col.rOut, DI.floor[0]], [BW.col.rOut, DI.port[0]], [DI.bore, DI.port[0]], [DI.bore, DI.floor[1]], [-DI.bore, DI.floor[1]], [-DI.bore, DI.port[0]], [-BW.col.rOut, DI.port[0]]];
const DIST_UP_L = [[DI.bore, DI.port[1]], [BW.col.rOut, DI.port[1]], [BW.col.rOut, zu(BW.col.rOut)], [R2, zu(R2)], [R2, zt(R2)], [BW.col.rOut, zt(BW.col.rOut)], [DI.neck, zt(DI.neck)], [DI.neck, DI.top], [DI.bore, DI.top]];
const DIST_UP_R = [[DI.bore, DI.port[1]], [BW.col.rOut, DI.port[1]], [BW.col.rOut, zu(BW.col.rOut)], [H0, zu(H0)], [H0, zt(H0)], [BW.col.rOut, zt(BW.col.rOut)], [DI.neck, zt(DI.neck)], [DI.neck, DI.top], [DI.bore, DI.top]];
const SKIRT_R = [[H1, zu(H1)], [R2, zu(R2)], [R2, zt(R2)], [H1, zt(H1)]];
// los discos: a la izquierda enteros, a la derecha en dos tramos (el agujero de la columna)
const discPoly = (kk, a, b) => [[a, dBot(kk, a)], [b, dBot(kk, b)], [b, dTop(kk, b)], [a, dTop(kk, a)]];
const TOPD = [[R2, tBot(R2)], [R2, tTop(R2)], [TD.neckOut, tTop(TD.neckOut)], [TD.neckOut, TD.top], [TD.roofIn, TD.top], [TD.roofIn, TD.roof], [TD.neckIn, TD.roof], [TD.neckIn, TD.weir[1]], [SD.rB, TD.weir[1]], [SD.rB, TD.weir[0]], [TD.neckIn, TD.weir[0]], [TD.neckIn, tBot(TD.neckIn)]];
{
  const own = "tazon";
  // la parte de atrás del tazón (cuerpo, anillo de cierre y capota) es una sola piel por fuera: un barrido de su contorno,
  // con las formas de las tres piezas para el orden y el audit
  const ENV = [[BW.cone.r0, BW.cone.z0], [60, BW.cone.z0], [60, 0], [180, 0], [205, 6], [BW.rO, 40], [BW.rO, LK.z0], [LK.r1, LK.z0], [LK.r1, LK.z1], [HD.rCone, LK.z1], [HD.rCone, hOut(HD.rCone)], [HD.neckOut, hOut(HD.neckOut)], [HD.neckOut, HD.top], [HD.neckIn, HD.top]];
  revBack("tazon", zp(ENV), { cls: "sd-ss", owner: own, sectors: SECT_CONE, skip: [ENV.length - 2, ENV.length - 1], shapeProfs: [zp(BODY_OUT), zp(LOCK), zp(HOOD)] });
  for (const [nm, pl] of [["cuerpo", BODY_IN], ["cuerpo.fondo", BODY_OUTER], ["cuerpo.pared", BODY_WALL]]) capsLR(`tazon.${nm}`, zp(pl), zp(pl), { cls: "sd-cut", owner: own });
  capsLR("tazon.fondo-movil", zp(PISTON), zp(PISTON), { cls: "sd-cut1", owner: own });
  capsLR("tazon.sello", zp(SEAL), zp(SEAL), { cls: "sd-cut-r", owner: own });
  capsLR("tazon.capota", zp(HOOD), zp(HOOD), { cls: "sd-cut", owner: own });
  capsLR("tazon.anillo", zp(LOCK), zp(LOCK), { cls: "sd-cut1", owner: own });
  revBack("tazon.gravedad", zp(GRAV), { cls: "sd-ss", owner: own, sectors: [[180, 270], [270, 360]] });
  capsLR("tazon.gravedad", zp(GRAV), zp(GRAV), { cls: "sd-cut1", owner: own });
  revBack("tazon.anillo-chico.base", zp([[GV.r1, HD.top], [HD.neckOut, HD.top], [HD.neckOut, GV.z1], [GV.r1, GV.z1]]), { cls: "sd-ss", owner: own, sectors: SECT_CONE });
  revBack("tazon.anillo-chico", zp([[CV.r0, GV.z1], [HD.neckOut, GV.z1], [HD.neckOut, CV.z1 - 8], [CV.r0, CV.z1 - 8]]), { cls: "sd-ss", owner: own, sectors: SECT_CONE });
  revBack("tazon.anillo-chico.techo", zp([[CV.roofIn, CV.z1 - 8], [HD.neckOut, CV.z1 - 8], [HD.neckOut, CV.z1], [CV.roofIn, CV.z1]]), { cls: "sd-ss", owner: own, sectors: SECT_CONE });
  capsLR("tazon.anillo-chico", zp(COVER), zp(COVER), { cls: "sd-cut", owner: own });
  // el distribuidor
  cap("distribuidor.piso", DIST_FLOOR_XZ.map(([x, z]) => [x, Zp(z)]), { cls: "sd-cut1", owner: own });
  cap("distribuidor.der", mirror(zp(DIST_UP_R), 1), { cls: "sd-cut1", owner: own });
  cap("distribuidor.izq", mirror(zp(DIST_UP_L), -1), { cls: "sd-cut1", owner: own });
  cap("distribuidor.falda.der", mirror(zp(SKIRT_R), 1), { cls: "sd-cut1", owner: own, rec: false });
  record(A.lathe(FV, zp([[0, DI.floor[0]], [BW.col.rOut, DI.floor[0]], [BW.col.rOut, zu(BW.col.rOut)], [R2, zu(R2)], [R2, zt(R2)], [BW.col.rOut, zt(BW.col.rOut)], [DI.neck, zt(DI.neck)], [DI.neck, DI.top], [DI.bore, DI.top], [DI.bore, DI.floor[1]], [0, DI.floor[1]]]).map(([r, z]) => [z, r]), { name: "distribuidor.forma", owner: own, cut: [halfSpace(YD)] }));
  revBack("distribuidor.cuello", zp([[DI.bore, 212], [DI.neck, 212], [DI.neck, DI.top], [DI.bore, DI.top]]), { cls: "sd-ss", owner: own, sectors: [[180, 255], [255, 330], [330, 360]] });
  // la pila: los discos en el corte (lo de atrás queda tapado por el líquido)
  for (let kk = 1; kk <= DS.n; kk++) {
    cap(`disco${kk}.izq`, mirror(zp(discPoly(kk, R1, R2)), -1), { cls: "sd-cut", owner: own, rec: false, kind: "disco" });
    cap(`disco${kk}.der.a`, mirror(zp(discPoly(kk, R1, H0)), 1), { cls: "sd-cut", owner: own, rec: false, kind: "disco" });
    cap(`disco${kk}.der.b`, mirror(zp(discPoly(kk, H1, R2)), 1), { cls: "sd-cut", owner: own, rec: false, kind: "disco" });
  }
  // el disco de arriba, sin agujeros, con el cuello, el rebose del liviano y el techo de su cámara
  capsLR("disco-arriba", zp(TOPD), zp(TOPD), { cls: "sd-cut1", owner: own, rec: false });
  const SECT3 = [[180, 255], [255, 330], [330, 360]];
  revBack("disco-arriba.cuello", zp([[TD.neckIn, tBot(TD.neckIn)], [TD.neckOut, tTop(TD.neckOut)], [TD.neckOut, TD.top], [TD.neckIn, TD.top]]), { cls: "sd-ss", owner: own, rec: false, sectors: SECT3 });
  revBack("disco-arriba.techo", zp([[TD.roofIn, TD.roof], [TD.neckIn, TD.roof], [TD.neckIn, TD.top], [TD.roofIn, TD.top]]), { cls: "sd-ss", owner: own, rec: false, sectors: SECT3 });
  revBack("disco-arriba.rebose", zp([[SD.rB, TD.weir[0]], [TD.neckIn, TD.weir[0]], [TD.neckIn, TD.weir[1]], [SD.rB, TD.weir[1]]]), { cls: "sd-ss", owner: own, rec: false, sectors: SECT3 });
  ANCH.CUERPO = [BW.rO * Math.cos(345 * D2R), BW.rO * Math.sin(345 * D2R), Zp(90)];
  ANCH.ANILLO = [LK.r1 * Math.cos(340 * D2R), LK.r1 * Math.sin(340 * D2R), Zp(LK.z1 - 14)];
  ANCH.TAPA_TAZON = [HD.rCone * Math.cos(343 * D2R) - 40, HD.rCone * Math.sin(343 * D2R), Zp(hOut(HD.rCone - 40) - 6)];
  ANCH.LUMBRERA = [-(BW.rO - 4), 0, Zp((PT0 + PT1) / 2)];
  ANCH.FONDO_MOVIL = [-(PIS.rOut - 40), 0, Zp(PIS.zBot + 34)];
  ANCH.SELLO = [-(SD.seal.r0 + SD.seal.r1) / 2, 0, Zp(SD.seal.z1 - 2)];
  ANCH.DISTRIBUIDOR = [DI.neck - 6, 0, Zp(300)];
  ANCH.FALDA = [-(R2 - 24), 0, Zp((zu(R2 - 24) + zt(R2 - 24)) / 2)];
  ANCH.DISCOS = [-(R2 - 10), 0, Zp((dBot(3, R2 - 10) + dTop(3, R2 - 10)) / 2)];
  ANCH.DISCO_ARRIBA = [-(R2 - 40), 0, Zp((tBot(R2 - 40) + tTop(R2 - 40)) / 2)];
  ANCH.GRAVEDAD = [-(GV.rA + GV.r1) / 2 - 8, 0, Zp(GV.z1 - 3)];
  ANCH.ANILLO_CHICO = [(CV.r0 + HD.neckOut) / 2, 0, Zp(CV.z1 - 16)];
  ANCH.AGUJEROS = [(H0 + H1) / 2, 0, Zp(dTop(3, (H0 + H1) / 2) + 2)];
  ANCH.COLUMNA = [BW.col.rOut - 10, 0, Zp(120)];
  ANCH.REBOSE = [-(SD.rB + 3), 0, Zp(TD.weir[1] - 3)];
}

/* ====================================================================
   5 · lo fijo de arriba: el tubo de alimentación, las dos bombas centrípetas (discos de rodete) con sus pasos, y la
   caja de salidas con los dos tubos: el liviano a la izquierda, el pesado a la derecha
   ==================================================================== */
const TB = SD.tube, LS = SD.lStem, HS = SD.hStem, LP = SD.lPare, HP = SD.hPare, HO = SD.housing;
const FEED_TOP = 1242;
{
  const own = "fijo";
  // el tubo de alimentación y su brida de arriba
  const TUBE = [[TB.rIn, Zp(TB.bot)], [TB.rOut, Zp(TB.bot)], [TB.rOut, FEED_TOP - 12], [TB.rIn, FEED_TOP - 12]];
  capsLR("tubo", TUBE, TUBE, { cls: "sd-cut", owner: own });
  revBack("tubo", [[TB.rIn, Zp(TB.bot)], [TB.rOut, Zp(TB.bot)], [TB.rOut, FEED_TOP - 12], [TB.rIn, FEED_TOP - 12]], { cls: "sd-ss", owner: own, sectors: [[180, 300], [300, 360]] });
  const FLG = [[TB.rIn, FEED_TOP - 12], [52, FEED_TOP - 12], [52, FEED_TOP], [TB.rIn, FEED_TOP]];
  capsLR("tubo.brida", FLG, FLG, { cls: "sd-cut", owner: own });
  revBack("tubo.brida", FLG, { cls: "sd-ss", owner: own, sectors: [[180, 300], [300, 360]], extras: boltsIn(40, FEED_TOP, 45, 20) });
  // la bomba centrípeta del liviano: dos platos con el canal entre ellos, y la pared de su paso
  const LP_LOW = zp([[TB.rOut, LP.z0], [LP.rim, LP.z0], [LP.rim, LP.ch[0]], [TB.rOut, LP.ch[0]]]);
  const LP_UP = zp([[LS.rIn, LP.ch[1]], [LP.rim, LP.ch[1]], [LP.rim, LP.z1], [LS.rIn, LP.z1]]);
  capsLR("bomba-liviano.abajo", LP_LOW, LP_LOW, { cls: "sd-cut1", owner: own });
  capsLR("bomba-liviano.arriba", LP_UP, LP_UP, { cls: "sd-cut1", owner: own });
  revBack("bomba-liviano", zp([[TB.rOut, LP.z0], [LP.rim, LP.z0], [LP.rim, LP.z1], [LS.rIn, LP.z1], [LS.rIn, LP.ch[0]], [TB.rOut, LP.ch[0]]]), { cls: "sd-ss", owner: own, sectors: [[180, 255], [255, 330], [330, 360]] });
  const LSW_R = [[LS.rIn, Zp(LP.z1)], [LS.rOut, Zp(LP.z1)], [LS.rOut, HO.lOut[1]], [LS.rIn, HO.lOut[1]]];
  const LSW_L = [[LS.rIn, Zp(LP.z1)], [LS.rOut, Zp(LP.z1)], [LS.rOut, HO.lOut[0]], [LS.rIn, HO.lOut[0]]];
  capsLR("paso-liviano", LSW_R, LSW_L, { cls: "sd-cut", owner: own });
  revBack("paso-liviano", [[LS.rIn, Zp(LP.z1)], [LS.rOut, Zp(LP.z1)], [LS.rOut, HO.z0], [LS.rIn, HO.z0]], { cls: "sd-ss", owner: own, sectors: [[180, 300], [300, 360]] });
  // la del pesado
  const HP_LOW = zp([[LS.rOut, HP.z0], [HP.rim, HP.z0], [HP.rim, HP.ch[0]], [LS.rOut, HP.ch[0]]]);
  const HP_UP = zp([[HS.rIn, HP.ch[1]], [HP.rim, HP.ch[1]], [HP.rim, HP.z1], [HS.rIn, HP.z1]]);
  capsLR("bomba-pesado.abajo", HP_LOW, HP_LOW, { cls: "sd-cut1", owner: own });
  capsLR("bomba-pesado.arriba", HP_UP, HP_UP, { cls: "sd-cut1", owner: own });
  revBack("bomba-pesado", zp([[LS.rOut, HP.z0], [HP.rim, HP.z0], [HP.rim, HP.z1], [HS.rIn, HP.z1], [HS.rIn, HP.ch[0]], [LS.rOut, HP.ch[0]]]), { cls: "sd-ss", owner: own, sectors: [[180, 255], [255, 330], [330, 360]] });
  const HSW = [[HS.rIn, Zp(HP.z1)], [HS.rOut, Zp(HP.z1)], [HS.rOut, HO.z0], [HS.rIn, HO.z0]];
  capsLR("paso-pesado", HSW, HSW, { cls: "sd-cut", owner: own });
  revBack("paso-pesado", HSW, { cls: "sd-ss", owner: own, sectors: [[180, 300], [300, 360]] });
  // la caja de salidas: la brida sobre el cuello de la capota y el cuerpo con los pasos que voltean a los tubos
  const FL = HO.z0 + 12;
  const R1P = [[HS.rOut, HO.z0], [150, HO.z0], [150, FL], [HO.r, FL], [HO.r, HO.hOut[0]], [HS.rOut, HO.hOut[0]]];
  const R2P = [[LS.rOut, HO.hOut[1]], [HO.r, HO.hOut[1]], [HO.r, HO.z1], [TB.rOut, HO.z1], [TB.rOut, HO.lOut[1]], [LS.rOut, HO.lOut[1]]];
  const L1P = [[HS.rOut, HO.z0], [150, HO.z0], [150, FL], [HO.r, FL], [HO.r, HO.lOut[0]], [LS.rOut, HO.lOut[0]], [LS.rOut, HO.hOut[1]], [HS.rOut, HO.hOut[1]]];
  const L2P = [[TB.rOut, HO.lOut[1]], [HO.r, HO.lOut[1]], [HO.r, HO.z1], [TB.rOut, HO.z1]];
  cap("caja.der.abajo", mirror(R1P, 1), { cls: "sd-cut", owner: own });
  cap("caja.der.arriba", mirror(R2P, 1), { cls: "sd-cut", owner: own });
  cap("caja.izq.abajo", mirror(L1P, -1), { cls: "sd-cut", owner: own });
  cap("caja.izq.arriba", mirror(L2P, -1), { cls: "sd-cut", owner: own });
  revBack("caja", [[HS.rOut, HO.z0], [150, HO.z0], [150, FL], [HO.r, FL], [HO.r, HO.z1], [TB.rOut, HO.z1], [TB.rOut, HO.z0 + 30], [HS.rOut, HO.z0 + 30]], { cls: "sd-ss", owner: own, sectors: SECT_CONE });
  // los tubos de salida, cortados por el plano: la mitad de atrás y sus dos paredes en el corte, con su brida
  for (const [nm, s, [z0, z1]] of [["salida-liviano", -1, HO.lOut], ["salida-pesado", 1, HO.hOut]]) {
    const zc = (z0 + z1) / 2, ri = (z1 - z0) / 2, ro = ri + 6, x0 = HO.r, x1 = HO.pipe;
    const prof = [[x0, ri], [x1, ri], [x1, ro], [x0, ro]].map(([x, r]) => [s * x, r]);
    const Fp = { o: [0, 0, zc], a: XD, u: YD, v: ZD };
    const svg = sweepSvg({ F: Fp, profile: prof, a0: PI / 2, a1: 1.5 * PI, cls: "sd-ss", capA: "none", capB: "none", steps: 18 });
    const sh = record(A.lathe(Fp, prof, { name: nm, owner: own, cut: [A.box([-BIG, 0, -BIG], [BIG, BIG, BIG])] }));
    put(nm, [s * (x0 + x1) / 2, -ro * 0.7, zc], svg, [sh]);
    cap(`${nm}.arriba`, [[s * x0, z1], [s * x1, z1], [s * x1, z1 + 6], [s * x0, z1 + 6]], { cls: "sd-cut", owner: own });
    cap(`${nm}.abajo`, [[s * x0, z0 - 6], [s * x1, z0 - 6], [s * x1, z0], [s * x0, z0]], { cls: "sd-cut", owner: own });
    // la brida del extremo
    const fl = [[s * x1, ri], [s * (x1 + 12), ri], [s * (x1 + 12), ri + 34], [s * x1, ri + 34]];
    const svgF = sweepSvg({ F: Fp, profile: fl, a0: PI / 2, a1: 1.5 * PI, cls: "sd-ss", capA: "none", capB: "none", steps: 18 });
    const shF = record(A.lathe(Fp, fl, { name: `${nm}.brida`, owner: own, cut: [A.box([-BIG, 0, -BIG], [BIG, BIG, BIG])] }));
    const dots = []; for (let a = 110; a < 260; a += 45) dots.push(at([s * (x1 + 12), (ri + 24) * Math.cos(a * D2R), zc + (ri + 24) * Math.sin(a * D2R)]));
    put(`${nm}.brida`, [s * (x1 + 6), -(ri + 20), zc], svgF + Dots(dots, { size: 0.55, tone: "mid" }), [shF]);
    cap(`${nm}.brida.arriba`, [[s * x1, z1], [s * (x1 + 12), z1], [s * (x1 + 12), zc + ri + 34], [s * x1, zc + ri + 34]], { cls: "sd-cut", owner: own });
    cap(`${nm}.brida.abajo`, [[s * x1, zc - ri - 34], [s * (x1 + 12), zc - ri - 34], [s * (x1 + 12), z0], [s * x1, z0]], { cls: "sd-cut", owner: own });
  }
  ANCH.TUBO = [-TB.rOut, 0, FEED_TOP - 70];
  ANCH.BOMBA_LIVIANO = [-(LP.rim - 4), 0, Zp(LP.z1 - 2)];
  ANCH.BOMBA_PESADO = [(HP.rim - 4), 0, Zp(HP.z1 - 2)];
  ANCH.CAJA = [HO.r * Math.cos(340 * D2R), HO.r * Math.sin(340 * D2R), HO.z1 - 20];
  ANCH.SALIDA_LIVIANO = [-(HO.pipe - 40), 0, HO.lOut[1] + 6];
  ANCH.SALIDA_PESADO = [HO.pipe - 40, 0, HO.hOut[0] - 6];
}

/* ====================================================================
   6 · los líquidos en el corte (y = 0): cada uno es el hueco exacto entre las piezas cortadas. El liviano (aceite o
   crema) hacia el eje, el pesado (agua o leche descremada) hacia afuera, con la zona neutra en el radio de los
   agujeros; la mezcla en el tubo, el distribuidor y la columna de agujeros (a la derecha, donde el corte pasa por una);
   el sólido contra la pared; el agua de maniobra bajo el fondo móvil
   ==================================================================== */
const SED = { r: 182, top: 200 };
const SED_POLY = [[SED.r, zPis(SED.r)], [PIS.rim, PIS.zRim], [HD.skirtIn, SD.seal.z1], [HD.skirtIn, 228], [189, 224], [184, 214], [SED.r, SED.top]];
// el liviano: del rebose al canal entre el distribuidor y los bordes de adentro de los discos, y la parte de adentro de
// cada canal entre discos hasta rs
function lightPoly(rs) {
  const out = [[SD.rB, TD.weir[0]], [TD.neckIn, TD.weir[0]], [TD.neckIn, tBot(TD.neckIn)], [rs, tBot(rs)]];
  for (let kk = DS.n; kk >= 1; kk--) out.push([rs, dTop(kk, rs)], [R1, dTop(kk, R1)], [R1, dBot(kk, R1)], [rs, dBot(kk, rs)]);
  out.push([rs, zt(rs)], [R1, zt(R1)], [DI.neck, zt(DI.neck)], [DI.neck, DI.top], [SD.rB, DI.top]);
  return out;
}
// el pesado: de la parte de afuera de cada canal (desde rs) al espacio fuera de la pila, entre el disco de arriba y la
// capota, por el cuello hasta el disco de gravedad
function heavyPoly(rs) {
  const out = [[HD.neckIn, GV.z0], [GV.rA, GV.z0], [GV.rA, TD.top], [TD.neckOut, TD.top], [TD.neckOut, tTop(TD.neckOut)], [R2, tTop(R2)], [R2, tBot(R2)], [rs, tBot(rs)]];
  for (let kk = DS.n; kk >= 1; kk--) out.push([rs, dTop(kk, rs)], [R2, dTop(kk, R2)], [R2, dBot(kk, R2)], [rs, dBot(kk, rs)]);
  out.push([rs, zt(rs)], [R2, zt(R2)], [R2, zu(R2)], [R2, zPis(R2)], [SED.r, zPis(SED.r)], [SED.r, SED.top], [184, 214], [189, 224], [HD.skirtIn, 228], [HD.skirtIn, hIn(HD.skirtIn)], [HD.neckIn, hIn(HD.neckIn)]);
  return out;
}
// la mezcla bajo la falda (y, a la derecha, la columna de agujeros)
function mixPoly(col) {
  const out = [[DI.bore, DI.port[0]], [BW.col.rOut, DI.port[0]], [BW.col.rOut, zPis(BW.col.rOut)], [R2, zPis(R2)], [R2, zu(R2)]];
  if (col) out.push([H1, zu(H1)], [H1, tBot(H1)], [H0, tBot(H0)], [H0, zu(H0)]);
  out.push([BW.col.rOut, zu(BW.col.rOut)], [BW.col.rOut, DI.port[1]], [DI.bore, DI.port[1]]);
  return out;
}
const RI = 120;   // la zona neutra (cuentas() de geo.mjs: 120,3 mm)
{
  liquid("liviano.der", mirror(zp(lightPoly(H0)), 1), "sd-oil");
  liquid("liviano.izq", mirror(zp(lightPoly(RI)), -1), "sd-oil");
  liquid("pesado.der", mirror(zp(heavyPoly(H1)), 1), "sd-water");
  liquid("pesado.izq", mirror(zp(heavyPoly(RI)), -1), "sd-water");
  // la mezcla: con gotas de agua en el aceite (pintas)
  const specks = (polyXZ, n) => {
    let d = "";
    const xs = polyXZ.map((q) => q[0]), zs = polyXZ.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
    for (let t = 0, c = 0; t < n * 30 && c < n; t++) {
      const x = x0 + rnd() * (x1 - x0), z = z0 + rnd() * (z1 - z0);
      if (!inPoly(polyXZ, x, z) || !inPoly(polyXZ, x + 2.5, z) || !inPoly(polyXZ, x - 2.5, z) || !inPoly(polyXZ, x, z + 2.5) || !inPoly(polyXZ, x, z - 2.5)) continue;
      const c2 = pr([x, 0, z]), rr = Math.max(0.55, (0.9 + rnd() * 0.9) * KS);
      d += `M${r10(c2[0] - rr)} ${r10(c2[1])}a${r10(rr)} ${r10(rr)} 0 1 0 ${r10(2 * rr)} 0a${r10(rr)} ${r10(rr)} 0 1 0 ${r10(-2 * rr)} 0Z`;
      c++;
    }
    return d ? `<path class="sd-speck" d="${d}"/>` : "";
  };
  const MR = mirror(zp(mixPoly(true)), 1), ML = mirror(zp(mixPoly(false)), -1);
  liquid("mezcla.der", MR, "sd-mix", { extra: specks(MR, 40) });
  liquid("mezcla.izq", ML, "sd-mix", { extra: specks(ML, 26) });
  const CEN = [[-DI.bore, Zp(DI.floor[1])], [DI.bore, Zp(DI.floor[1])], [DI.bore, Zp(TB.bot)], [TB.rIn, Zp(TB.bot)], [TB.rIn, FEED_TOP], [-TB.rIn, FEED_TOP], [-TB.rIn, Zp(TB.bot)], [-DI.bore, Zp(TB.bot)]];
  liquid("mezcla.centro", CEN, "sd-mix", { extra: specks(CEN, 30) });
  // el sólido contra la pared, en la cámara del diámetro mayor
  for (const s of [1, -1]) {
    const pl = mirror(zp(SED_POLY), s);
    let gr = "";
    for (let j = 0; j < 26; j++) { const r = SED.r + 2 + rnd() * 12, z = 124 + rnd() * 96; if (!inPoly(SED_POLY, r, z)) continue; const c2 = pr([s * r, 0, Zp(z)]), rr = Math.max(0.5, (0.7 + rnd() * 0.8) * KS); gr += `M${r10(c2[0] - rr)} ${r10(c2[1])}a${r10(rr)} ${r10(rr)} 0 1 0 ${r10(2 * rr)} 0a${r10(rr)} ${r10(rr)} 0 1 0 ${r10(-2 * rr)} 0Z`; }
    liquid(`solido.${s > 0 ? "der" : "izq"}`, pl, "sd-sed", { extra: gr ? `<path class="sd-grain" d="${gr}"/>` : "", line: "sd-sed-line" });
  }
  // el agua de maniobra bajo el fondo móvil, con el canal que sube por el fondo del cuerpo
  const OPW = [[BW.col.rOut, BW.chamber[0]], [FW0, BW.chamber[0]], [FW0, usZ(FW0)], [FW1, usZ(FW1)], [FW1, BW.chamber[0]], [BW.rW, BW.chamber[0]], [BW.rW, BW.chamber[1]], [BW.col.rOut, BW.chamber[1]]];
  liquid("maniobra.der", mirror(zp(OPW), 1), "sd-opw");
  liquid("maniobra.izq", mirror(zp(OPW), -1), "sd-opw");
  // los anillos de líquido en las cámaras de las bombas centrípetas
  const RL = 50, RH = 70;
  const LRING = [[RL, TD.weir[1]], [TD.neckIn, TD.weir[1]], [TD.neckIn, TD.roof], [RL, TD.roof], [RL, LP.z1], [LP.rim, LP.z1], [LP.rim, LP.z0], [RL, LP.z0]];
  const HRING = [[RH, GV.z1], [CV.r0, GV.z1], [CV.r0, CV.z1 - 8], [RH, CV.z1 - 8], [RH, HP.z1], [HP.rim, HP.z1], [HP.rim, HP.z0], [RH, HP.z0]];
  for (const s of [1, -1]) {
    liquid(`anillo-liviano.${s}`, mirror(zp(LRING), s), "sd-oil");
    liquid(`anillo-pesado.${s}`, mirror(zp(HRING), s), "sd-water");
  }
  // los pasos de salida: el liviano por adentro, junto al tubo, y el pesado por fuera; cada uno voltea a su tubo
  const LCH = (s) => { const top = s > 0 ? HO.lOut[1] : HO.lOut[0]; const p = [[TB.rOut, Zp(LP.ch[0])], [LP.rim, Zp(LP.ch[0])], [LP.rim, Zp(LP.ch[1])], [LS.rIn, Zp(LP.ch[1])], [LS.rIn, top]]; if (s < 0) p.push([HO.pipe + 12, HO.lOut[0]], [HO.pipe + 12, HO.lOut[1]]); p.push([TB.rOut, HO.lOut[1]]); return p; };
  const HCH = (s) => { const p = [[LS.rOut, Zp(HP.ch[0])], [HP.rim, Zp(HP.ch[0])], [HP.rim, Zp(HP.ch[1])], [HS.rIn, Zp(HP.ch[1])], [HS.rIn, HO.z0], [HS.rOut, HO.z0], [HS.rOut, HO.hOut[0]]]; if (s > 0) p.push([HO.pipe + 12, HO.hOut[0]], [HO.pipe + 12, HO.hOut[1]]); else p.push([HS.rOut, HO.hOut[1]]); p.push([LS.rOut, HO.hOut[1]]); return p; };
  for (const s of [1, -1]) {
    liquid(`paso-liviano.${s}`, mirror(LCH(s), s), "sd-oil");
    liquid(`paso-pesado.${s}`, mirror(HCH(s), s), "sd-water");
  }
  ANCH.LIVIANO = [-(R1 + 14), 0, Zp((dTop(4, R1 + 14) + dBot(5, R1 + 14)) / 2)];
  ANCH.PESADO = [-(R2 + 8), 0, Zp(196)];
  ANCH.ZONA_NEUTRA = [-RI, 0, Zp((dTop(10, RI) + dBot(11, RI)) / 2)];
  ANCH.MEZCLA = [(H0 + H1) / 2, 0, Zp(tBot((H0 + H1) / 2) - 30)];
  ANCH.SOLIDO = [-(SED.r + 6), 0, Zp(170)];
  ANCH.MANIOBRA = [-(BW.rW - 40), 0, Zp((BW.chamber[0] + BW.chamber[1]) / 2)];
  ANCH.ANILLO_LIVIANO = [-(TD.neckIn - 6), 0, Zp(TD.roof - 4)];
  ANCH.ANILLO_PESADO = [CV.r0 - 6, 0, Zp(CV.z1 - 12)];
  ANCH.ALIMENTACION = [0, 14, FEED_TOP + 60];
}

/* ====================================================================
   7 · el agua de maniobra: la tubería que entra por la pared del bastidor con su válvula de solenoide y la boquilla
   que la echa hacia arriba, al canal del fondo del tazón
   ==================================================================== */
{
  const W = SD.water, er = WER, R0 = 440;
  const P0 = G.add3(G.mul3(er, R0), [0, 0, W.z]), P1 = G.add3(G.mul3(er, BW.feed.r), [0, 0, W.z]), P2 = G.add3(G.mul3(er, BW.feed.r), [0, 0, Zp(-16)]);
  const route = G.fillet([P0, P1, P2], 22);
  const sAt = (r) => R0 - r;   // la distancia a lo largo de la tubería desde la brida
  tubeItems("maniobra.tubo", route, 8, { cls: "sd-pipe", gaps: [[sAt(400), sAt(360)], [sAt(FR.rOut + 4), sAt(FR.rIn - 4)]], maxLength: 120 });
  // el pasamuros: un manguito en el agujero de la pared del bastidor
  // (por dentro y por fuera de la pared: lo de en medio queda en la pared)
  const Fpm = { o: [0, 0, W.z], a: er, u: ZD, v: G.cross3(er, ZD) };
  disc("maniobra.pasamuros.dentro", Fpm, FR.rIn - 4, FR.rIn + 1, 16, { cls: "sd-ss", owner: "maniobra.tubo" });
  disc("maniobra.pasamuros.fuera", Fpm, FR.rOut - 1, FR.rOut + 4, 16, { cls: "sd-ss", owner: "maniobra.tubo" });
  // la boquilla
  disc("maniobra.boquilla", FZ(P2[0], P2[1]), Zp(-16), Zp(-8), 10, { cls: "sd-ss", owner: "maniobra" });
  // la válvula de solenoide, afuera, y la brida del agua de servicio
  const Fv = { o: [0, 0, W.z], a: er, u: ZD, v: G.cross3(er, ZD) };
  disc("maniobra.valvula", Fv, 360, 400, 20, { cls: "sd-cast", owner: "maniobra.tubo" });
  const top = G.add3(G.mul3(er, 380), [0, 0, W.z]);
  disc("maniobra.solenoide", FZ(top[0], top[1]), W.z + 20, W.z + 62, 17, { cls: "sd-paint", owner: "maniobra.tubo" });
  disc("maniobra.brida", Fv, R0, R0 + 8, 24, { cls: "sd-ss", owner: "maniobra" });
  ANCH.SOLENOIDE = [top[0], top[1], W.z + 52];
}

/* ====================================================================
   8 · el sólido que sale: el ducto tangente del bastidor al ciclón, el ciclón con su cono, su respiradero y su salida,
   y sus patas
   ==================================================================== */
const CY = SD.cyclone;
{
  const own = "ciclon";
  const zc0 = CY.z0 - CY.cone;
  // el ducto: planta entre el arco del bastidor y el del ciclón, extruida en z a la altura de las lumbreras
  const yA = CY.y + CY.r, yB = CY.y + CY.r - 50, za = Zp(BW.port[0]) - 26, zb2 = Zp(BW.port[1]) + 26;
  const plan = [[Math.sqrt(FR.rOut ** 2 - yA * yA), yA], [CY.x, yA]];
  const thB = PI - Math.asin((yB - CY.y) / CY.r);
  for (let j = 1; j <= 12; j++) { const th = PI / 2 + ((thB - PI / 2) * j) / 12; plan.push([CY.x + CY.r * Math.cos(th), CY.y + CY.r * Math.sin(th)]); }
  plan.push([Math.sqrt(FR.rOut ** 2 - yB * yB), yB]);
  for (let j = 1; j < 10; j++) { const y = yB + ((yA - yB) * j) / 10; plan.push([Math.sqrt(FR.rOut ** 2 - y * y), y]); }
  fp("ducto", FZs, plan, za, zb2, { cls: "sd-ss", owner: own });
  // el ciclón
  const mer = [[CY.foot, 0], [CY.foot, CY.out], [zc0, CY.out], [CY.z0, CY.r], [CY.z1, CY.r], [CY.z1 + 10, CY.r - 20], [CY.z1 + 10, 0]];
  turned("ciclon", FZ(CY.x, CY.y), mer, { cls: "sd-ss", owner: own, steps: 64 });
  disc("ciclon.respiradero", FZ(CY.x, CY.y), CY.z1 + 10, CY.z1 + 60, 34, { cls: "sd-ss", owner: own });
  disc("ciclon.sombrero", FZ(CY.x, CY.y), CY.z1 + 60, CY.z1 + 66, 50, { cls: "sd-ss", owner: own });
  disc("ciclon.brida", FZ(CY.x, CY.y), CY.foot - 10, CY.foot, CY.out + 22, { cls: "sd-ss", owner: own });
  // las patas, de las orejas del cilindro al piso
  for (const a of [10, 130, 250]) {
    const ph = a * D2R, cx = CY.x + (CY.r + 14.6) * Math.cos(ph), cy = CY.y + (CY.r + 14.6) * Math.sin(ph);
    const er3 = [Math.cos(ph), Math.sin(ph), 0], et3 = [-Math.sin(ph), Math.cos(ph), 0], sq = (h) => [[-h, -h], [h, -h], [h, h], [-h, h]];
    fp(`ciclon.oreja${a}`, { o: [cx, cy, 0], a: ZD, u: er3, v: et3 }, sq(14), CY.z0 - 4, CY.z0 + 22, { cls: "sd-ss", owner: own });
    fp(`ciclon.pata${a}`, { o: [cx + 2 * er3[0], cy + 2 * er3[1], 0], a: ZD, u: er3, v: et3 }, sq(9), 0, CY.z0 - 4, { cls: "sd-paint", owner: own, ground: true });
  }
  ANCH.CICLON = [CY.x + CY.r * Math.cos(0.5), CY.y + CY.r * Math.sin(0.5), CY.z0 + 30];
  ANCH.DUCTO = [380, -80, zb2 - 10];
  ANCH.SALIDA_SOLIDO = [CY.x, CY.y, CY.foot - 40];
}

/* ====================================================================
   8b · la persona de referencia: 1,75 m, de pie en el piso detrás del bastidor, a la derecha (no va en el detalle)
   ==================================================================== */
if (!DET) {
  const PS = SD.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, PS.piso], rumbo: PS.rumbo, mm: 1 });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.CABEZA;
}
/* ====================================================================
   9 · las flechas: la mezcla baja por el tubo y sube por los agujeros; el liviano va hacia el eje y sale por la izquierda;
   el pesado va hacia afuera, pasa sobre el disco de gravedad y sale por la derecha; el sólido sale del ciclón
   ==================================================================== */
function flow(name, ctl, { r = 4, head = 11, w = 5.5, cls = "sd-flujo-m", hcls = "sd-flecha-m", y = 14 } = {}) {
  ctl = ctl.map((p) => (p.length === 2 ? [p[0], y, p[1]] : p));
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
  const line = keep.map(([x, yy], i) => (i ? "L" : "M") + r10(x) + " " + r10(yy)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  const hd = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  put(name, pts[Math.floor(n / 2)], `<path class="${cls}" d="${line}"/><path class="${hcls}" d="${hd}"/>`, [A.tube(pts, r), A.ball(pts[n - 1], Math.min(r * 3, (w * 0.8) / KS))]);
}
const zMid = (kk, r) => Zp((dTop(kk, r) + dBot(kk + 1, r)) / 2);
if (!DET) {
  const M = { cls: "sd-flujo-m", hcls: "sd-flecha-m" }, O = { cls: "sd-flujo-a", hcls: "sd-flecha-a" }, Wt = { cls: "sd-flujo-w", hcls: "sd-flecha-w" };
  // la mezcla: entra por arriba, baja por el tubo, sale por el puerto del distribuidor y sube por la columna de agujeros
  flow("flujo.entrada", [[0, FEED_TOP + 90], [0, FEED_TOP + 30], [0, FEED_TOP - 80]], M);
  flow("flujo.tubo", [[0, Zp(330)], [0, Zp(270)], [0, Zp(222)]], M);
  flow("flujo.mezcla", [[14, Zp(DI.port[0] + 6)], [52, Zp(198)], [96, Zp(178)], [(H0 + H1) / 2, Zp(205)], [(H0 + H1) / 2, Zp(262)]], M);
  // el liviano: por un canal hacia el eje, sube junto al distribuidor; arriba sale por su paso y por el tubo de la izquierda
  flow("flujo.liviano.canal", [[H0 - 2, zMid(8, H0 - 2)], [(H0 + R1) / 2, zMid(8, (H0 + R1) / 2)], [R1 - 4, zMid(8, R1) + 4], [60, zMid(8, R1) + 30], [58, Zp(372)]], O);
  flow("flujo.liviano.sale", [[-(TB.rOut + LS.rIn) / 2, Zp(LP.z1 + 30)], [-(TB.rOut + LS.rIn) / 2, HO.lOut[0] - 40], [-(TB.rOut + LS.rIn) / 2 - 8, (HO.lOut[0] + HO.lOut[1]) / 2], [-120, (HO.lOut[0] + HO.lOut[1]) / 2], [-HO.pipe + 10, (HO.lOut[0] + HO.lOut[1]) / 2]], O);
  // el pesado: por un canal hacia afuera, sube entre el disco de arriba y la capota, pasa sobre el disco de gravedad;
  // arriba sale por su paso y por el tubo de la derecha
  const hm = (r) => Zp((tTop(r) + hIn(r)) / 2);
  flow("flujo.pesado.canal", [[H1 + 2, zMid(5, H1 + 2)], [(H1 + R2) / 2, zMid(5, (H1 + R2) / 2)], [R2 + 10, zMid(5, R2) - 6], [HD.skirtIn - 8, Zp(236)], [HD.skirtIn - 10, hm(HD.skirtIn - 10)], [140, hm(140)], [(TD.neckOut + HD.neckIn) / 2 + 4, hm(98)], [(TD.neckOut + HD.neckIn) / 2, Zp(430)]], Wt);
  flow("flujo.pesado.sale", [[(LS.rOut + HS.rIn) / 2, Zp(HP.z1 + 20)], [(LS.rOut + HS.rIn) / 2, HO.hOut[0] - 30], [(LS.rOut + HS.rIn) / 2 + 8, (HO.hOut[0] + HO.hOut[1]) / 2], [120, (HO.hOut[0] + HO.hOut[1]) / 2], [HO.pipe - 10, (HO.hOut[0] + HO.hOut[1]) / 2]], Wt);
  // el sólido: sale por abajo del ciclón
  flow("flujo.solido", [[CY.x, CY.y, CY.foot - 30], [CY.x, CY.y, CY.foot - 70], [CY.x, CY.y, CY.foot - 112]], { cls: "sd-flujo-s", hcls: "sd-flecha-s" });
  ANCH.FLUJO_LIVIANO = [-HO.pipe + 40, 14, (HO.lOut[0] + HO.lOut[1]) / 2];
  ANCH.FLUJO_PESADO = [HO.pipe - 40, 14, (HO.hOut[0] + HO.hOut[1]) / 2];
}

/* ====================================================================
   10 · el detalle: el canal entre dos discos del lado izquierdo, en la zona neutra (r = 120 mm), nueve veces más
   grande. Hacia el eje (a la derecha del dibujo), aceite con gotas de agua; hacia afuera, agua con gotas de aceite.
   Las gotas de agua y el sólido van hacia afuera y se juntan contra la cara de abajo del disco de arriba, por donde
   resbalan hacia afuera; las de aceite van hacia el eje y se juntan sobre la cara de arriba del disco de abajo, por
   donde suben hacia el eje (Perry, p. 18-121; Coulson y Richardson, p. 646, fig. 11.9). Las gotas van mucho más
   grandes que las reales.
   ==================================================================== */
if (DET) {
  for (const key of Object.keys(ANCH)) delete ANCH[key];
  const kL = DET_K, kU = DET_K + 1;
  const zIn = (kk, r, f) => Zp(dTop(kk, r) + f * (dBot(kk + 1, r) - dTop(kk, r)));
  const W = (r, z) => [-r, 0, z], W2 = (r, z) => [-r, z];
  const circ = (p, rr) => { const c2 = pr(p), q = rr * KS; return `M${r10(c2[0] - q)} ${r10(c2[1])}a${r10(q)} ${r10(q)} 0 1 0 ${r10(2 * q)} 0a${r10(q)} ${r10(q)} 0 1 0 ${r10(-2 * q)} 0Z`; };
  // las películas: el agua bajo el disco de arriba (de r = 96 hacia afuera, cada vez más gruesa) y el aceite sobre el de
  // abajo (de r = 146 hacia el eje)
  const film = (kk, top, rA, rB, t0, t1) => {
    const pts = [], back = [];
    for (let j = 0; j <= 16; j++) {
      const r = rA + ((rB - rA) * j) / 16, t = t0 + ((t1 - t0) * j) / 16;
      const z0 = top ? Zp(dBot(kk, r)) : Zp(dTop(kk, r)), z1 = top ? z0 - t / COSA : z0 + t / COSA;
      pts.push([-r, z0]); back.push([-r, z1]);
    }
    return [...pts, ...back.reverse()];
  };
  const fW = film(kU, true, 96, 146, 0.05, 1.3), fO = film(kL, false, 146, 96, 0.05, 1.3);
  liquid("d.pelicula.agua", fW, "sd-film-w", { line: "sd-film-w-line", front: 4 });
  liquid("d.pelicula.aceite", fO, "sd-film-o", { line: "sd-film-o-line", front: 4 });
  // las gotas en el canal del centro y en los dos vecinos
  let dw = "", doil = "", ds = "";
  const drops = [];
  for (const kk of [kL - 1, kL, kU]) {
    for (let t = 0; t < 900 && drops.filter((d) => d.k === kk).length < (kk === kL ? 30 : 9); t++) {
      const r = 96 + rnd() * 50, f = 0.14 + rnd() * 0.72, water = r < RI;
      const size = 0.35 + rnd() * 0.45;
      // las de agua se juntan hacia el disco de arriba; las de aceite, hacia el de abajo
      const ff = water ? 0.25 + 0.6 * Math.sqrt(f) : 0.75 - 0.6 * Math.sqrt(f) + 0.1;
      if (drops.some((d) => d.k === kk && Math.hypot(d.r - r, (d.f - ff) * 6) < 2.4)) continue;
      drops.push({ k: kk, r, f: ff, size, water });
    }
  }
  for (const d of drops) { const p = W(d.r, zIn(d.k, d.r, d.f)); if (d.water) dw += circ(p, d.size); else doil += circ(p, d.size); }
  // el sólido: granos que resbalan con el agua bajo el disco de arriba y unos que todavía van en el canal
  for (const kk of [kL, kU - 1]) for (let j = 0; j < 7; j++) { const r = 112 + j * 5 + rnd() * 3; ds += circ(W(r, Zp(dBot(kk + 1, r)) - (0.5 + 0.3 * (j / 6)) / COSA - 0.25), 0.28 + rnd() * 0.12); }
  for (let j = 0; j < 5; j++) { const r = 100 + rnd() * 40; ds += circ(W(r, zIn(kL, r, 0.4 + rnd() * 0.3)), 0.22); }
  put("d.gotas", [-RI, 0, zIn(kL, RI, 0.5)], `<path class="sd-drop-w" d="${dw}"/><path class="sd-drop-o" d="${doil}"/><path class="sd-drop-s" d="${ds}"/>`, [A.prism(FY, [[-150, Zp(dTop(kL - 1, 150))], [-90, Zp(dTop(kL - 1, 90))], [-90, Zp(dBot(kU + 1, 90))], [-150, Zp(dBot(kU + 1, 150))]], 4.5, 5)]);
  // las flechas: el aceite sube por la cara de arriba del disco de abajo hacia el eje; el agua y el sólido bajan por la
  // cara de abajo del disco de arriba hacia afuera
  const fin = { r: 1.2, head: 9, w: 4.2, y: 7 };
  flow("d.flujo.aceite", [W2(133, zIn(kL, 133, 0.27)), W2(121, zIn(kL, 121, 0.27)), W2(108, zIn(kL, 108, 0.27))], { ...fin, cls: "sd-flujo-a sd-fino", hcls: "sd-flecha-a" });
  flow("d.flujo.agua", [W2(107, zIn(kL, 107, 0.74)), W2(119, zIn(kL, 119, 0.74)), W2(132, zIn(kL, 132, 0.74))], { ...fin, cls: "sd-flujo-w sd-fino", hcls: "sd-flecha-w" });
  ANCH.D_DISCO_ARRIBA = W(110, Zp((dBot(kU, 110) + dTop(kU, 110)) / 2));
  ANCH.D_DISCO_ABAJO = W(128, Zp((dBot(kL, 128) + dTop(kL, 128)) / 2));
  ANCH.D_AGUA = W(124, zIn(kL, 124, 0.74));
  ANCH.D_ACEITE = W(116, zIn(kL, 116, 0.27));
  ANCH.D_NEUTRA = W(RI, zIn(kL, RI, 0.5));
  const near = (d, r0) => Math.hypot(d.r - r0, (d.f - 0.5) * 7);
  const dS = drops.filter((d) => d.k === kL && d.water).sort((a, b) => near(a, 110) - near(b, 110))[0];
  ANCH.D_GOTA_AGUA = W(dS.r, zIn(dS.k, dS.r, dS.f));
  const dO = drops.filter((d) => d.k === kL && !d.water).sort((a, b) => near(a, 131) - near(b, 131))[0];
  ANCH.D_GOTA_ACEITE = W(dO.r, zIn(dO.k, dO.r, dO.f));
  ANCH.D_SOLIDO = W(126, Zp(dBot(kU, 126)) - 0.8);
}

/* ---------- --check: ninguna cara del corte se monta sobre otra ---------- */
if (CHECK) {
  const items = capPolys;
  const bb = items.map(({ poly }) => [Math.min(...poly.map((q) => q[0])), Math.max(...poly.map((q) => q[0])), Math.min(...poly.map((q) => q[1])), Math.max(...poly.map((q) => q[1]))]);
  const hits = new Map();
  for (let x = -400.137; x <= 400; x += 0.7) for (let z = 50.213; z <= 1320; z += 0.7) {
    const inside = [];
    items.forEach((it, i) => { const b = bb[i]; if (x < b[0] || x > b[1] || z < b[2] || z > b[3]) return; if (inPoly(it.poly, x, z)) inside.push(it.name); });
    if (inside.length > 1) { const key = inside.sort().join(" × "); hits.set(key, (hits.get(key) || 0) + 1); }
  }
  console.log(hits.size ? [...hits].map(([k2, n]) => `${n}\t${k2}`).join("\n") : "sin cruces");
  process.exit(0);
}

/* ---------- orden y salida ---------- */
if (process.env.SD_ITEM) {
  for (const nm of process.env.SD_ITEM.split(",")) {
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
  const keep = R_.items.filter((it) => /^(disco\d+\.izq|liviano\.izq|pesado\.izq|d\.)/.test(it.name) && inView(it));
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
const CAUCHO = ["#5D666E", "#6B747C", ["#3E464D", "#475057", "#505960", "#576067"]];
const COBRE = ["#E6CDB4", "#EEDCCA", ["#C49E7C", "#CEAC8D", "#D8BA9E", "#DFC4A9"]];
const CSS = `.sd-cut{${flat("#C9CED3")}}.sd-cut1{${flat("#D6DADE")}}.sd-cut-c{${flat("#C1C6CB")}}.sd-cut-r{${flat("#3E464D")}}
.sd-ss,.sd-pipe{${shades(...ACERO)}}.sd-cast{${shades(...FUND)}}.sd-paint{${shades(...PINT)}}.sd-rubber{${shades(...CAUCHO)}}.sd-bronze{${shades(...COBRE)}}
.sd-pipe .tb-body{fill:#E1E4E7}.sd-pipe .tb-shine{fill:#F7F8F9}.sd-pipe .tb-shade{fill:#C9CED3}
.sd-bore{fill:#525C64;stroke:none}
.sd-oil{fill:#E3CF7A;fill-opacity:.85;stroke:none}.sd-water{fill:#BCD0E6;fill-opacity:.85;stroke:none}.sd-opw{fill:#BCD0E6;fill-opacity:.85;stroke:none}
.sd-mix{fill:#F3E9BE;fill-opacity:.9;stroke:none}.sd-speck{fill:#8FB0CF;stroke:none}
.sd-sed{fill:#C6B68F;stroke:none}.sd-grain{fill:#7A5634;stroke:none}.sd-sed-line{fill:none;stroke:#7A5634;stroke-width:.5px}
.sd-liq-line{fill:none;stroke:none}
.sd-flujo-a{fill:none;stroke:#B08A1E;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}.sd-flecha-a{fill:#B08A1E;stroke:none}
.sd-flujo-w{fill:none;stroke:#2E5E9E;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}.sd-flecha-w{fill:#2E5E9E;stroke:none}
.sd-flujo-m{fill:none;stroke:#525C64;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}.sd-flecha-m{fill:#525C64;stroke:none}
.sd-flujo-s{fill:none;stroke:#7A5634;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}.sd-flecha-s{fill:#7A5634;stroke:none}
.sd-fino{stroke-width:1.1px}
.sd-film-w{fill:#8FB0CF;stroke:none}.sd-film-w-line{fill:none;stroke:#2E5E9E;stroke-width:.4px}.sd-film-o{fill:#E3CF7A;stroke:none}.sd-film-o-line{fill:none;stroke:#B08A1E;stroke-width:.4px}
.sd-drop-w{fill:#8FB0CF;stroke:#2E5E9E;stroke-width:.4px}.sd-drop-o{fill:#F3E9BE;stroke:#B08A1E;stroke-width:.4px}.sd-drop-s{fill:#7A5634;stroke:none}
.sd-det-fondo{fill:#FFFFFF;stroke:none}.sd-det-marco{fill:none;stroke:#525C64;stroke-width:1px}
${CSS_PERSONA}`;
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
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
  ? k.figureSvg({ width: W_, height: H_, label: "El canal entre dos discos, ampliado", body: [`<style>${CSS}</style><defs><clipPath id="sdDet"><circle cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/></clipPath></defs><g class="sd-items" clip-path="url(#sdDet)"><circle class="sd-det-fondo" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="sd-det-marco" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W_, height: H_, label: "Separadora de discos en corte", body: [`<style>${CSS}</style><g class="sd-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
const base = DET ? "detalle" : "fig";
writeFileSync(join(OUTD, `${base}.svg`), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Separadora de discos", theme: "light", width: DET ? 400 : 1200, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, `${base}_data.json`), JSON.stringify({ P, W: W_, H: H_, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, { crowd: [] });
