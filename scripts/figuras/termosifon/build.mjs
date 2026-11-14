/* ====================================================================
   El termosifón vertical y el fondo de la columna en isométrico (skill anatomy).
   Concepto: el líquido del fondo de la columna baja por la línea de entrada hasta el bonete de abajo del rehervidor,
   sube por los tubos, donde hierve con el vapor que condensa en la coraza, y vuelve como mezcla a la columna, arriba
   del nivel. Lo mueve la columna de líquido: el nivel del fondo queda a la altura del espejo de arriba, y la diferencia
   con la entrada de los tubos es la cabeza estática, que la figura marca.
   Corte: todo lo que está en el plano y = 0 (la columna, el rehervidor, las dos líneas y el cimiento) va abierto por ese
   plano, sin la mitad que mira al lector; lo de atrás (las patas, el lado del vapor, la vinaza) va entero.
   Uso: node build.mjs [--audit] [--fast]
   Unidades: 1 = 1 mm. Medidas en geo.mjs.
   ==================================================================== */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL("../../../.claude/skills/anatomy", import.meta.url));
const k = await import(KIT + "/kit/iso-kit.mjs");
const G = await import(KIT + "/kit/lathe.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const { tubePieces, tubeSvg } = await import(KIT + "/kit/tube.mjs");
const X = await import(join(HERE, "xprism.mjs"));
const { TS, cotas, tubos } = await import(join(HERE, "geo.mjs"));
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const STEP = Number(process.env.TS_STEP || 0.5);
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1], YB = [0, -1, 0];
const ANCH = {};
const Z = cotas();
const CO = TS.col, RH = TS.reh, EN = TS.entrada, RE = TS.retorno, PL = TS.platos, FA = TS.faldon;
const Rc = CO.R, Rco = CO.R + CO.t;                      // la columna, por dentro y por fuera
const Xr = RH.x, Rr = RH.R, Rro = RH.R + RH.t;           // el rehervidor
const Eo = EN.ro, Ei = EN.ro - EN.t, Ro_ = RE.ro, Ri_ = RE.ro - RE.t;
const TB = RH.tubos, tri = TB.di / 2, tro = TB.do / 2;
const ZB = Z.B, ZL = Z.L, ZE = Z.E, ZR = Z.R;
const ZT1 = ZB + RH.espejo, ZT2 = ZL - RH.espejo;        // las caras de adentro de los espejos: el lado del vapor
const radial = (phi) => [Math.cos(phi * D2R), Math.sin(phi * D2R), 0];
const tang = (phi) => [-Math.sin(phi * D2R), Math.cos(phi * D2R), 0];

/* ---------- la cámara ---------- */
const W_ = 1000, H_ = 1500;
const VP = TS.vapor, CD = TS.condensado, VI = TS.vinaza, PT = TS.patas;
const EXT = [
  [-Rco, 0, Z.arriba], [Rco, 0, Z.arriba], [0, -Rco, Z.arriba], [-Rco, 0, Z.arriba - 300],
  [-FA.cimiento.lado / 2, -FA.cimiento.lado / 2, 0], [-FA.cimiento.lado / 2, 0, 0], [FA.cimiento.lado / 2, 0, 0],
  [VI.x1 - 380, VI.y, VI.z], [VI.x1 - 380, VI.y, VI.z + 150],
  [Xr + 1500, -420, ZL + VP.sube + 420], [Xr + 1500, -420, 0],
  [Xr + PT.r + 300, -PT.r - 300, 0], [Xr - PT.r - 300, -PT.r - 300, 0],
  [TS.persona.x + 300, TS.persona.y + 300, 0], [TS.persona.x, TS.persona.y, 1800],
];
const P = k.fitProjection(EXT, W_, H_, { pad: 14, azimuth: TS.AZ, elevation: TS.EL });
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
const pthO = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("");
const BAND = (s) => { const Bd = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < Bd.length && s >= Bd[t]) t++; return t; };
const circ2 = (c2, q) => `M${r10(c2[0] - q)} ${r10(c2[1])}a${r10(q)} ${r10(q)} 0 1 0 ${r10(2 * q)} 0a${r10(q)} ${r10(q)} 0 1 0 ${r10(-2 * q)} 0Z`;
let seed = 23;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* El dibujo va en milímetros; el audit, en centímetros (como la línea de vapor y el ciclón). */
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
const put = (name, ref, svg, shapes = [], rest = {}) => { R_.put({ piece: "frame", ride: "frame", name, at: ref.map((v) => v * U), svg, shapes: shapes.map(cm), move: [0, 0, 0], ...rest }); };
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);

/* ---------- caras planas ---------- */
const keyOfN = (n) => { const b = BAND(G.dot3(n, L3)); return b >= 4 ? `<path class="iso-top" d="D"/>` : `<path class="iso-shade" data-shade="${b}" d="D"/>`; };
const faceSvg = (d, cls, tone = "mid", n = null) => `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/>${n ? keyOfN(n).replace("D", d) : `<path class="iso-shade" data-shade="0" d="${d}"/>`}<path class="iso-line iso-edge" data-tone="${tone}" d="${d}"/></g>`;

/* ---------- piezas sencillas ---------- */
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "ts-paint", r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, ref, rec = true, cut } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const sh = A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls) + extra, [sh]);
  return sh;
}
function fp(name, F, poly, s0, s1, { cls = "ts-paint", extra = "", cap = "auto", owner = name, ref = null, ground, rec = true, skip = null, seated, cut } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(ground ? { ground } : {}), ...(seated ? { seated } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", cls, cap, skip }) + extra, [sh]);
  return sh;
}
const ngon = (r, m, ph = 0) => Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m + ph; return [r * Math.cos(t), r * Math.sin(t)]; });
function disc(name, F, s0, s1, r, { cls = "ts-cs", extra = "", owner = name, n = 0, ground, rec = true, cap = "auto", ph = 0, ref, cut } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const sh = A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(ground ? { ground } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  put(name, ref || G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), X.prismSvg(C, ngon(r, m, ph), Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap }) + extra, [sh]);
  return sh;
}
function turned(name, F, meridian, { cls = "ts-cs", extra = "", owner = name, steps = 48, rec = true, ref, cut, rims, hole } = {}) {
  const paths = G.lathe(meridian, F, P, { steps, ...(rims ? { rims } : {}), ...(hole ? { hole } : {}) });
  const sh = A.lathe(F, meridian, { name, owner, ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  const s0 = Math.min(...meridian.map((q) => q[0])), s1 = Math.max(...meridian.map((q) => q[0]));
  put(name, ref || G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(S(paths, { tone: "mid" }), cls) + extra, [sh]);
  return sh;
}

/* ====================================================================
   el barrido (del ciclón y la línea de vapor): una sección (s, r) que gira alrededor de un eje, cara por cara, de
   atrás hacia adelante; cada arista se dibuja con la cara visible que va después
   ==================================================================== */
function sweepSvg({ F, profile, a0, a1, steps = 0, smooth = [], skip = [], capA = "end", capB = "end", cls = "ts-ss", cutCls = "ts-cut", tone = "mid", noEdge = [] }) {
  const m = profile.length;
  const n = steps || Math.max(2, Math.ceil(Math.abs(a1 - a0) / (5 * D2R)));
  const pt = (phi, s, r) => G.add3(G.add3(F.o, G.mul3(F.a, s)), G.add3(G.mul3(F.u, r * Math.cos(phi)), G.mul3(F.v, r * Math.sin(phi))));
  const phis = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n);
  const Pg = phis.map((phi) => profile.map(([s, r]) => pt(phi, s, r)));
  const sc = profile.reduce((q, p) => q + p[0], 0) / m, rc = profile.reduce((q, p) => q + p[1], 0) / m;
  const faces = [];
  const fid = (i, j) => i * m + j;
  let area2 = 0; for (let j = 0; j < m; j++) { const [s1, r1] = profile[j], [s2, r2] = profile[(j + 1) % m]; area2 += s1 * r2 - s2 * r1; }
  const wind = area2 > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    if (skip.includes(j)) { faces.push(null); continue; }
    const j2 = (j + 1) % m, q = [Pg[i][j], Pg[i + 1][j], Pg[i + 1][j2], Pg[i][j2]];
    const cen = q.reduce((a, b) => G.add3(a, b), [0, 0, 0]).map((v) => v / 4);
    const pm = (phis[i] + phis[i + 1]) / 2;
    const ds = profile[j2][0] - profile[j][0], dr = profile[j2][1] - profile[j][1];
    if (Math.hypot(ds, dr) < 1e-9 || (profile[j][1] < 1e-9 && profile[j2][1] < 1e-9)) { faces.push(null); continue; }
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
  const paint = [...order, ...caps].sort((p, q) => p.d - q.d);
  const rank = new Map(paint.map((f, r) => [f, r]));
  const edges = new Map(paint.map((f) => [f, []]));
  const later = (a, b) => (!vis(a) ? b : !vis(b) ? a : rank.get(a) > rank.get(b) ? a : b);
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    if (noEdge.includes(j)) continue;
    const fa = faces[fid(i, (j - 1 + m) % m)], fb = faces[fid(i, j)];
    const corner = !smooth.includes(j);
    const draw = vis(fa) !== vis(fb) || (corner && vis(fa) && vis(fb));
    if (draw) edges.get(later(fa, fb)).push([Pg[i][j], Pg[i + 1][j]]);
  }
  for (let i = 0; i <= n; i++) for (let j = 0; j < m; j++) {
    const j2 = (j + 1) % m, e = [Pg[i][j], Pg[i][j2]];
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
  const keyOf = (f) => { if (f.cap && f.mode === "cut") return `<path class="iso-shade" data-shade="0" d="D"/>`; return keyOfN(f.n); };
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

/* ---------- los cortes del audit: semiespacios y cuñas ---------- */
const BIG = 30000;
const halfSpaceAt = (n, o) => { n = G.unit3(n); const p = G.unit3(Math.abs(n[2]) < 0.9 ? G.cross3(ZD, n) : G.cross3(XD, n)); return A.orientedBox(G.add3(o, G.mul3(n, BIG)), [n, p, G.cross3(n, p)], [BIG, BIG, BIG], { name: "corte" }); };
const wedgeCutsF = (F, a0, a1) => { const p0 = a0 * D2R, p1 = a1 * D2R; return [halfSpaceAt(G.sub3(G.mul3(F.u, Math.sin(p0)), G.mul3(F.v, Math.cos(p0))), F.o), halfSpaceAt(G.add3(G.mul3(F.u, -Math.sin(p1)), G.mul3(F.v, Math.cos(p1))), F.o)]; };
const FRONT = halfSpaceAt(YD, [0, 0, 0]);                 // lo que mira al lector: y > 0
// los marcos: un eje vertical en (x, y); el plano del corte (y = 0) para las caras planas
const FV = (x, y = 0) => ({ o: [x, y, 0], a: ZD, u: XD, v: YD });
const FY = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
const FZ = { o: [0, 0, 0], a: ZD, u: XD, v: YD };
const SECT = [[180, 255], [255, 330], [330, 360]];

/* una pieza de revolución alrededor de un eje vertical, en su mitad de atrás (φ ∈ [180°, 360°]): prof en (r, z) */
function revV(name, xa, prof, { cls = "ts-ss", owner = name, sectors = SECT, skip = [], smooth = [], rec = true, ref = null, extras = null, cut = [], ya = 0, steps0 = 5, noEdge = [] } = {}) {
  const F = FV(xa, ya);
  const profile = prof.map(([r, z]) => [z, r]);
  const rmax = Math.max(...prof.map((q) => q[0])), zc = prof.reduce((q, p) => q + p[1], 0) / prof.length;
  const out = [];
  for (const [a0, a1] of sectors) {
    const steps = Math.max(3, Math.round((a1 - a0) / steps0));
    const svg = sweepSvg({ F, profile, a0: a0 * D2R, a1: a1 * D2R, cls, capA: "none", capB: "none", skip, smooth, steps, noEdge }) + (extras ? extras(a0, a1) : "");
    const full = a1 - a0 >= 360 - 1e-6;
    const sh = A.lathe(F, profile, { name: `${name}.${Math.round(a0)}`, owner, cut: [...(full ? [] : wedgeCutsF(F, a0, a1)), ...cut] });
    if (rec) record(sh);
    const am = ((a0 + a1) / 2) * D2R, rr = ref ?? rmax * 0.8;
    put(sectors.length > 1 ? `${name}.${Math.round(a0)}` : name, [xa + rr * Math.cos(am), ya + rr * Math.sin(am), zc], svg, [sh]);
    out.push(sh);
  }
  return out;
}
/* una cara del corte: polígono en (x, z) en el plano y = 0 (un prisma delgado detrás del plano) */
const capPolys = [];
function cap(name, polyXZ, { cls = "ts-cut", owner = name, rec = true, tone = "mid", extra = "", y0 = 0 } = {}) {
  const d = pth1(polyXZ.map(([x, z]) => pr([x, y0, z])));
  const sh = A.prism(FY, polyXZ, y0 - 0.3, y0, { name, owner });
  if (rec) record(sh);
  const cx = polyXZ.reduce((q, p) => q + p[0], 0) / polyXZ.length, cz = polyXZ.reduce((q, p) => q + p[1], 0) / polyXZ.length;
  put(name, [cx, y0, cz], faceSvg(d, cls, tone) + extra, [sh]);
  capPolys.push({ name, poly: polyXZ });
}
const mirrorAt = (xa, polyRZ, s) => polyRZ.map(([r, z]) => [xa + s * r, z]);
function capsLR(name, xa, prof, opts = {}) { cap(`${name}.der`, mirrorAt(xa, prof, 1), opts); cap(`${name}.izq`, mirrorAt(xa, prof, -1), opts); }
// una pieza vertical cortada: la mitad de atrás y sus dos caras del corte
function vert(name, xa, prof, { cls = "ts-ss", cutCls = "ts-cut", owner = name, sectors = SECT, skip = [], smooth = [], extras = null, cut = [], noCaps = false, noEdge = [] } = {}) {
  const shapes = revV(name, xa, prof, { cls, owner, sectors, skip, smooth, extras, cut, noEdge });
  if (!noCaps) capsLR(`${name}.corte`, xa, prof, { cls: cutCls, owner });
  return shapes;
}
const ringRZ = (r0, r1, z0, z1) => [[r0, z0], [r1, z0], [r1, z1], [r0, z1]];

/* un tramo horizontal a lo largo de x, en el plano del corte, a la altura zc: la mitad de atrás (φ desde +z hacia −y,
   φ ∈ [0°, 180°]) y las dos caras del corte, arriba y abajo */
const FHx = (zc) => ({ o: [0, 0, zc], a: XD, u: ZD, v: YB });
const SECTX = [[0, 25], [25, 100], [100, 180]];
function horiz(name, x0, x1, zc, ri, ro, { cls = "ts-ss", cutCls = "ts-cut", owner = name, skip = [1, 3], cut = [], noCaps = false, rec = true } = {}) {
  const F = FHx(zc), profile = [[x0, ri], [x1, ri], [x1, ro], [x0, ro]];
  for (const [a0, a1] of SECTX) {
    const svg = sweepSvg({ F, profile, a0: a0 * D2R, a1: a1 * D2R, cls, capA: "none", capB: "none", skip, steps: Math.max(3, Math.round((a1 - a0) / 5)) });
    const sh = A.lathe(F, profile, { name: `${name}.${a0}`, owner, cut: [...wedgeCutsF(F, a0, a1), ...cut] });
    if (rec) record(sh);
    const am = ((a0 + a1) / 2) * D2R;
    put(`${name}.${a0}`, [(x0 + x1) / 2, -ro * Math.sin(am) * 0.8, zc + ro * Math.cos(am) * 0.8], svg, [sh]);
  }
  if (!noCaps) {
    cap(`${name}.corte-arriba`, [[x0, zc + ri], [x1, zc + ri], [x1, zc + ro], [x0, zc + ro]], { cls: cutCls, owner });
    cap(`${name}.corte-abajo`, [[x0, zc - ro], [x1, zc - ro], [x1, zc - ri], [x0, zc - ri]], { cls: cutCls, owner });
  }
}
/* un codo en el plano del corte: el toro de la mitad de atrás, alrededor del eje (paralelo a y) que pasa por c = [x, z];
   φ en el plano xz, desde +x hacia +z */
const arcXZ = (c, r, a0, a1, n = 0) => { const m = n || Math.max(6, Math.round(Math.abs(a1 - a0) / 4)); return Array.from({ length: m + 1 }, (_, i) => { const a = (a0 + ((a1 - a0) * i) / m) * D2R; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)]; }); };
const annXZ = (c, r0, r1, a0, a1) => [...arcXZ(c, r1, a0, a1), ...arcXZ(c, r0, a0, a1).reverse()];
function elbow(name, c, Rb, ri, ro, a0, a1, { cls = "ts-ss", cutCls = "ts-cut", owner = name, rec = true } = {}) {
  const F = { o: [c[0], 0, c[1]], a: YB, u: XD, v: ZD };
  const N = 12, prof = [];
  for (let i = 0; i <= N; i++) { const t = (PI * i) / N; prof.push([ro * Math.sin(t), Rb + ro * Math.cos(t)]); }
  for (let i = N; i >= 0; i--) { const t = (PI * i) / N; prof.push([ri * Math.sin(t), Rb + ri * Math.cos(t)]); }
  const smooth = [...Array.from({ length: N - 1 }, (_, i) => i + 1), ...Array.from({ length: N - 1 }, (_, i) => N + 2 + i)];
  const skip = [N, 2 * N + 1];
  const n = Math.max(6, Math.round(Math.abs(a1 - a0) / 5));
  // las facetas del toro, en dos mitades (la de adentro y la de afuera de la curva), para que cada una se ordene sola
  const am = (a0 + a1) / 2;
  for (const [b0, b1, tag] of [[a0, am, "a"], [am, a1, "b"]]) {
    const svg = sweepSvg({ F, profile: prof, a0: b0 * D2R, a1: b1 * D2R, cls, capA: "none", capB: "none", skip, smooth, steps: Math.max(3, Math.round(n / 2)) });
    const sh = A.lathe(F, prof, { name: `${name}.${tag}`, owner, cut: wedgeCutsF(F, b0, b1) });
    if (rec) record(sh);
    const ac = ((b0 + b1) / 2) * D2R;
    put(`${name}.${tag}`, [c[0] + Rb * Math.cos(ac), -ro * 0.5, c[1] + Rb * Math.sin(ac)], svg, [sh]);
  }
  cap(`${name}.corte-afuera`, annXZ(c, Rb + ri, Rb + ro, a0, a1), { cls: cutCls, owner });
  cap(`${name}.corte-adentro`, annXZ(c, Rb - ro, Rb - ri, a0, a1), { cls: cutCls, owner });
}
/* un líquido o una mezcla en el plano del corte (un poco detrás de las caras del metal): no sostiene nada */
function liq(name, polyXZ, { cls = "ts-liq", extra = "", y0 = -0.4, line = "" } = {}) {
  const d = pth1(polyXZ.map(([x, z]) => pr([x, y0, z])));
  const sh = A.prism(FY, polyXZ, y0 - 0.3, y0, { name, owner: "liquido" });
  const cx = polyXZ.reduce((q, p) => q + p[0], 0) / polyXZ.length, cz = polyXZ.reduce((q, p) => q + p[1], 0) / polyXZ.length;
  put(name, [cx, y0, cz], `<path class="${cls}" d="${d}"/>` + (line ? `<path class="${line}" d="${d}"/>` : "") + extra, [sh]);
}
const rectXZ = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];

/* ---------- los tubos de afuera (vapor, condensado, venteo, vinaza): tubos del kit con sus codos ---------- */
// la forma de un trozo, sin los puntos casi repetidos (un tramo de una fracción de milímetro, con su tapa plana torcida,
// sobresale del trozo tanto como su radio)
function tubeShape(part) {
  const pts = [], rr = [];
  part.points.forEach((q, i) => { if (!pts.length || G.len3(G.sub3(q, pts[pts.length - 1])) > 1 || i === part.points.length - 1) { if (pts.length > 1 && i === part.points.length - 1 && G.len3(G.sub3(q, pts[pts.length - 1])) <= 1) { pts.pop(); rr.pop(); } pts.push(q); rr.push(part.radii[i]); } });
  return A.tube(pts, rr);
}
function tubeItems(name, route, r, { cls = "ts-cs", owner = name, gaps = [], ends = [true, true], maxLength = 300, caps = true, breaks = [], spacing = 0 } = {}) {
  R_.route(name, route.map((p) => p.map((v) => v * U)), r * U, { owner: name, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing || Math.max(2, Math.min(40, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone: "mid" });
    if (process.env.TS_CHUNKS && name === process.env.TS_CHUNKS) { const t = tubeShape(part); console.log(name, index, t.points.length, JSON.stringify(t.points.slice(-3).map((q) => q.map((v) => +v.toFixed(1)))), JSON.stringify(t.points.slice(0, 2).map((q) => q.map((v) => +v.toFixed(1)))), t.radii.slice(-2)); }
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(tubeShape(part))] });
  });
}
function route(name, ctl, r, bend, opts = {}) {
  const line = G.fillet(ctl, bend, 12, { P, tube: r });
  // breakAt: una función de un punto; el tubo se parte donde cambia de signo (donde cruza una pared)
  const breaks = [...(opts.breaks || [])];
  for (const fn of opts.breakAt || []) { let walked = 0; for (let i = 1; i < line.length; i++) { const a = fn(line[i - 1]), b = fn(line[i]); const L = G.len3(G.sub3(line[i], line[i - 1])); if (Math.sign(a) !== Math.sign(b)) breaks.push(walked + (L * a) / (a - b)); walked += L; } }
  tubeItems(name, line, r, { ...opts, breaks });
  return line;
}

/* ====================================================================
   1 · el cimiento, el anillo base, los pernos de anclaje y el faldón, con la manga de la línea de entrada, la boca de
   acceso y los respiraderos
   ==================================================================== */
const ZF = FA.cimiento.alto;                                  // la cara de arriba del cimiento
const RS0 = Rco - FA.t, RS1 = Rco;                            // el faldón, por dentro y por fuera
const ZSK = Z.tanCol;                                         // el faldón llega a la tangente de la cabeza
const SLV = TS.manga;
// la cara de arriba del faldón sigue la cabeza: por dentro llega a la cara de afuera de la cabeza, por fuera a la tangente
const zSkIn = Z.tanCol - (CO.R / 2 + CO.t) * Math.sqrt(1 - (RS0 / Rco) ** 2);
// los huecos del faldón: la manga de la entrada (en el plano del corte), la de la vinaza y la boca de acceso
const vinXw = -Math.sqrt(RS1 * RS1 - VI.y * VI.y);
const VS1 = -625;                                              // la cara de adentro de la manga de la vinaza
const holeEntrada = A.disc({ o: [0, 0, ZE], a: XD, u: YD, v: ZD }, RS0 - 200, RS1 + 200, SLV.r + SLV.t, { name: "hueco" });
const holeVinaza = A.disc({ o: [0, VI.y, VI.z], a: XD, u: YD, v: ZD }, vinXw - 450, -300, VI.ro + 66, { name: "hueco" });
const AC = FA.acceso;
const FAC = { o: [0, 0, AC.z], a: radial(AC.phi), u: tang(AC.phi), v: ZD };
const holeAcceso = A.disc(FAC, RS0 - 80, RS1 + 80, AC.r + 8, { name: "hueco" });
{
  const own = "columna", L = FA.cimiento.lado / 2;
  // el cimiento, cortado por el plano y = 0
  const sh = record(A.box([-L, -L, 0], [L, 0, ZF], { name: "cimiento", owner: "cimiento", ground: true }));
  put("cimiento", [0, -L / 2, ZF / 2], wrap(S(k.slabOf({ x: -L, y: -L, w: 2 * L, d: L, r: 0 }, 0, ZF, P, 1, 0), { tone: "mid" }), "ts-conc"), [sh]);
  cap("cimiento.corte", rectXZ(-L, L, 0, ZF), { cls: "ts-conc-cut", owner: "cimiento" });
  ANCH.CIMIENTO = [L * 0.6, -L * 0.2, ZF];
  // el anillo base y su cara del corte
  const AN = FA.anillo;
  vert("anillo", 0, ringRZ(AN.r0, AN.r1, ZF, ZF + AN.t), { cls: "ts-paint", cutCls: "ts-paint-cut", owner: own });
  // los pernos de anclaje con su arandela y su tuerca (los de atrás)
  for (const phi of [202.5, 247.5, 292.5, 337.5]) {
    const x = FA.pernos.r * Math.cos(phi * D2R), y = FA.pernos.r * Math.sin(phi * D2R), z0 = ZF + AN.t;
    const F = FV(x, y);
    disc(`perno${phi}.arandela`, F, z0, z0 + 6, 32, { cls: "ts-bolt", owner: own });
    disc(`perno${phi}.tuerca`, F, z0 + 6, z0 + 36, 27, { cls: "ts-bolt", owner: own, n: 6, ph: (phi * D2R) % (PI / 3) });
    disc(`perno${phi}`, F, z0 + 36, z0 + 70, FA.pernos.d / 2, { cls: "ts-bolt", owner: own, n: 16 });
  }
  // el faldón: de la cara de arriba del anillo hasta la cabeza, con sus huecos
  const zs0 = ZF + AN.t;
  // en dos tramos (uno solo sería tan esbelto que el audit lo tomaría por una varilla)
  const ZSM = 1950;
  vert("faldon", 0, ringRZ(RS0, RS1, zs0, ZSM), { cls: "ts-paint", cutCls: "ts-paint-cut", owner: own, cut: [holeEntrada, holeVinaza, holeAcceso], noCaps: true, skip: [0, 2], noEdge: [2, 3] });
  vert("faldon.arriba", 0, [[RS0, ZSM], [RS1, ZSM], [RS1, ZSK], [RS0, zSkIn]], { cls: "ts-paint", cutCls: "ts-paint-cut", owner: own, cut: [holeEntrada, holeVinaza, holeAcceso], noCaps: true, skip: [0, 2], noEdge: [0, 1] });
  // las caras del corte del faldón: la de la izquierda entera; la de la derecha, partida por la manga de la entrada
  const zh0 = ZE - SLV.r - SLV.t, zh1 = ZE + SLV.r + SLV.t;
  cap("faldon.corte.izq", [[-RS1, zs0], [-RS0, zs0], [-RS0, zSkIn], [-RS1, ZSK]], { cls: "ts-paint-cut", owner: own });
  cap("faldon.corte.der-abajo", rectXZ(RS0, RS1, zs0, zh0), { cls: "ts-paint-cut", owner: own });
  cap("faldon.corte.der-arriba", [[RS0, zh1], [RS1, zh1], [RS1, ZSK], [RS0, zSkIn]], { cls: "ts-paint-cut", owner: own });
  // la soldadura del faldón con la cabeza: un cordón por dentro
  ANCH.FALDON = [-RS0 * Math.cos(30 * D2R), -RS0 * Math.sin(30 * D2R), 1900];
  // la manga de la línea de entrada (en el corte) y la de la vinaza (entera)
  horiz("manga.entrada", RS1 - 4, RS1 + 50, ZE, SLV.r, SLV.r + SLV.t, { cls: "ts-paint", cutCls: "ts-paint-cut", owner: own, skip: [3] });
  /* una manga que entra por la pared del faldón: arranca en la cara de adentro de la pared (un asiento sobre el cilindro)
     y llega hasta s1; F.a apunta hacia adentro y la pared queda en s = −√(RS0² − t²), t el desvío de cada generatriz a lo
     largo de F.u (horizontal). Se registra solo lo que queda dentro del faldón. hole: el radio de lo que se ve por ella;
     afuera: si por ella se ve afuera (la boca de acceso, los respiraderos) */
  const OUTSIDE = A.ring(FV(0), -10, 9000, RS0, 9000, { name: "afuera" });
  function sleeve(name, F, ro, ri, s1, { afuera = false, ref, tubo = false } = {}) {
    const start = (t) => -Math.sqrt(Math.max(0, RS0 * RS0 - (G.dot3(F.o, F.u) + ro * Math.cos(t)) ** 2 - 0));
    const svg = S(G.saddleOf(F, ro, start, s1, P), { tone: "mid" });
    const bore = []; for (let i = 0; i < 48; i++) { const t = (i / 48) * TAU; bore.push(pr(G.pointOf(F, s1 + 0.4, ri, t))); }
    const sh = record(A.ring(F, -RS1 - 20, s1, ri, ro, { name, owner: "columna", cut: [OUTSIDE] }));
    // con un tubo adentro, el orden se toma de lo que se dibuja: la cara de adentro (con la boca oscura, que tapa lo que
    // va dentro de la manga) y la mitad de la manga que mira al lector; la otra queda detrás del tubo
    const shapes = tubo ? [A.disc(F, s1 - 2, s1, ro, {}), A.ring(F, -RS1 - 20, s1, ri, ro, { cut: [OUTSIDE, halfSpaceAt([0, -1, 0], F.o)] })] : [sh];
    put(name, ref || G.pointOf(F, s1, 0, 0), wrap(svg, "ts-paint") + `<path class="${afuera ? "ts-afuera" : "ts-hueco"}" d="${pth1(bore)}"/>`, shapes);
  }
  // la manga de la vinaza: a lo largo de x (F.u = y, así el desvío es el de la y)
  sleeve("manga.vinaza", { o: [0, VI.y, VI.z], a: XD, u: YD, v: ZD }, VI.ro + 66, VI.ro + 58, VS1, { tubo: true });
  // la boca de acceso: hacia adentro, en φ = 240°; por ella se ve afuera
  sleeve("boca-acceso", { o: [0, 0, AC.z], a: G.mul3(radial(AC.phi), -1), u: tang(AC.phi), v: ZD }, AC.r + 8, AC.r, -RS0 + 110, { afuera: true });
  ANCH.ACCESO = G.add3([0, 0, AC.z], G.add3(G.mul3(radial(AC.phi), RS0 - 110), [0, 0, -AC.r - 8]));
  // los respiraderos del faldón, arriba: dos agujeros con su manga corta
  for (const phi of FA.respiraderos.phi) sleeve(`respiradero${phi}`, { o: [0, 0, FA.respiraderos.z], a: G.mul3(radial(phi), -1), u: tang(phi), v: ZD }, FA.respiraderos.r + 5, FA.respiraderos.r, -RS0 + 30, { afuera: true });
}

/* ====================================================================
   2 · el fondo de la columna: la cabeza elíptica 2:1 con su boquilla de abajo, el cuerpo hasta el corte de arriba, con
   la boquilla del retorno en el plano del corte; la cara del corte de arriba
   ==================================================================== */
// las dos elipses de la cabeza: la de adentro (R, R/2) y la de afuera
const hIn = Rc / 2, hOut = hIn + CO.t;
const zHeadIn = (r) => Z.tanCol - hIn * Math.sqrt(Math.max(0, 1 - (r / Rc) ** 2));
const zHeadOut = (r) => Z.tanCol - hOut * Math.sqrt(Math.max(0, 1 - (r / Rco) ** 2));
const BF = TS.boquillaFondo;
const CABEZA = [], CORAZA = [];
const ZN0 = Z.fondoCol - BF.cuello;                           // la cara de arriba de la brida de la boquilla del fondo
{
  const own = "columna";
  // la cabeza: de la boca (r = Ei) hasta la tangente, por dentro y por fuera
  const N = 14, inner = [], outer = [];
  for (let i = 0; i <= N; i++) { const t = (i / N) * (PI / 2); const r = Ei + (Rc - Ei) * Math.sin(t); inner.push([r, zHeadIn(r), i > 0 && i < N ? 1 : 0]); }
  for (let i = N; i >= 0; i--) { const t = (i / N) * (PI / 2); const r = Eo + (Rco - Eo) * Math.sin(t); outer.push([r, zHeadOut(r)]); }
  const prof = [...inner.map(([r, z]) => [r, z]), ...outer];
  const smooth = []; for (let i = 1; i < N; i++) smooth.push(i); for (let i = 1; i < N; i++) smooth.push(N + 1 + i);
  // la boca de la vinaza en la cabeza, por dentro: el agujero que se ve bajo el líquido
  const vpts = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * TAU; const x = TS.vinaza.x + (TS.vinaza.ro - 7) * Math.cos(t), y = TS.vinaza.y + (TS.vinaza.ro - 7) * Math.sin(t); vpts.push(pr([x, y, zHeadIn(Math.hypot(x, y)) + 0.6])); }
  const aV = (Math.atan2(TS.vinaza.y, TS.vinaza.x) / D2R + 360) % 360;
  CABEZA.push(...vert("cabeza", 0, prof, { owner: own, smooth, skip: [N, 2 * N + 1], extras: (a0, a1) => (aV >= a0 && aV < a1 ? `<path class="ts-boca-tubo" d="${pth1(vpts)}"/>` : "") }));
  // el cuello de la boquilla del fondo, su brida y la junta
  vert("boca-fondo.cuello", 0, [[Ei, ZN0], [Eo, ZN0], [Eo, zHeadOut(Eo)], [Ei, zHeadIn(Ei)]], { owner: own, skip: [0, 2] });
  vert("boca-fondo.brida", 0, ringRZ(Ei, EN.bridaR, ZN0 - EN.bridaT, ZN0), { owner: own });
  ANCH.CABEZA = [Rc * 0.55 * Math.cos(250 * D2R), Rc * 0.55 * Math.sin(250 * D2R), zHeadIn(Rc * 0.55)];
  ANCH.BOCA_FONDO = [EN.bridaR, 0, ZN0 - EN.bridaT / 2];
}
// el cuerpo, en bandas: abajo del retorno, la banda del retorno (con el hueco de la boquilla, por escalones) y arriba
const RN = { x0: Math.sqrt(Rc * Rc - Ro_ * Ro_) - 10, x1: Rco + RE.cuello };     // el cuello de la boquilla del retorno
const holeRetorno = A.disc({ o: [0, 0, ZR], a: XD, u: YD, v: ZD }, 0, RN.x1, Ro_, { name: "hueco" });
{
  const own = "columna";
  const prof = (z0, z1) => ringRZ(Rc, Rco, z0, z1);
  const seam = (z) => (a0, a1) => Ln(G.arcOf(FV(0), z, Rc - 0.3, P, { inward: true, from: Math.max(a0, 180) * D2R, to: Math.min(a1, 330) * D2R, least: -1 }), { tone: "lo" });
  revV("cuerpo.abajo", 0, prof(Z.tanCol, ZR - Ro_), { owner: own, skip: [0, 2], noEdge: [0, 1, 2, 3], extras: (a0, a1) => (a0 < 330 ? seam(Z.tanCol + 4)(a0, a1) : "") });
  revV("cuerpo.arriba", 0, prof(ZR + Ro_, Z.arriba), { owner: own, skip: [0, 2], noEdge: [0, 1] });
  // la banda del retorno: en cada escalón, la parte de afuera (φ de 330° a 360°) llega hasta el borde del hueco
  const NB = 14;
  for (let b = 0; b < NB; b++) {
    const z0 = ZR - Ro_ + (2 * Ro_ * b) / NB, z1 = ZR - Ro_ + (2 * Ro_ * (b + 1)) / NB;
    const dz = Math.min(Math.abs(z0 - ZR), Math.abs(z1 - ZR)), w = Math.sqrt(Math.max(0, Ro_ * Ro_ - dz * dz)) - 4;
    const ph = 360 - Math.asin(Math.min(1, w / Rco)) / D2R;
    const secs = ph > 340 ? [[180, 255], [255, 330], [330, ph]] : [[180, 255], [255, ph]];
    revV(`cuerpo.retorno${b}`, 0, prof(z0, z1), { owner: own, sectors: secs, cut: [holeRetorno], skip: [0, 2], noEdge: [0, 1, 2, 3] });
  }
  // las caras del corte del cuerpo: la izquierda entera; la derecha, partida por la boca del retorno
  cap("cuerpo.corte.izq", rectXZ(-Rco, -Rc, Z.tanCol, Z.arriba), { owner: own });
  cap("cuerpo.corte.der-abajo", rectXZ(Rc, Rco, Z.tanCol, ZR - Ro_), { owner: own });
  cap("cuerpo.corte.der-arriba", rectXZ(Rc, Rco, ZR + Ro_, Z.arriba), { owner: own });
  // la cara del corte de arriba: media corona en z = arriba
  {
    const ringPts = (r, rev) => { const pts = []; for (let i = 0; i <= 60; i++) { const f = (180 + (rev ? 60 - i : i) * 3) * D2R; pts.push(pr([r * Math.cos(f), r * Math.sin(f), Z.arriba])); } return pts; };
    const d = pth1([...ringPts(Rco, false), ...ringPts(Rc, true)]);
    const sh = record(A.prism(FZ, [[-Rco, 0], [Rco, 0], [Rco, -Rco], [-Rco, -Rco]], Z.arriba, Z.arriba + 0.3, { name: "cuerpo.corte-arriba", owner: own, cut: [A.disc(FZ, Z.arriba - 1, Z.arriba + 2, Rc, {})] }));
    put("cuerpo.corte-arriba", [0, -Rc, Z.arriba], faceSvg(d, "ts-cut"), [sh]);
  }
  ANCH.CUERPO = [Rco * Math.cos(345 * D2R), Rco * Math.sin(345 * D2R), Z.plato1 - 250];
  ANCH.CORTE_ARRIBA = [-Rc - 5, -60, Z.arriba];
}
// la boquilla del retorno: el cuello (que sigue la pared por dentro), la brida y la junta
{
  const own = "columna";
  // el cuello, por dentro: arranca en la pared de adentro de la columna (x = √(Rc² − y²)) y llega a la brida
  const F = FHx(ZR);
  const n = 36;
  const sx = (phi, r) => { const y = -r * Math.sin(phi); return Math.sqrt(Math.max(0, Rc * Rc - y * y)); };
  let svg = "";
  const facets = (r, sign, cls) => {
    let out = "", runK = null, runD = [];
    const flush = () => { if (runK) out += `<g class="iso-solid ${cls}" data-seamless="">${runK.replace("D", runD.join(""))}</g>`; runK = null; runD = []; };
    for (let i = 0; i < n; i++) {
      const p0 = (i / n) * PI, p1 = ((i + 1) / n) * PI, pm = (p0 + p1) / 2;
      const nrm = G.mul3(G.radialOf(F, pm), sign);
      if (G.dot3(nrm, V3) <= 1e-6) { flush(); continue; }
      const key = keyOfN(nrm);
      if (key !== runK) { flush(); runK = key; }
      runD.push(pth1([G.pointOf(F, sx(p0, r), r, p0), G.pointOf(F, RN.x1, r, p0), G.pointOf(F, RN.x1, r, p1), G.pointOf(F, sx(p1, r), r, p1)].map(pr)));
    }
    flush();
    return out;
  };
  // la cara de afuera (solo la parte de arriba y atrás se ve) y la de adentro
  svg += facets(Ro_, 1, "ts-ss") + facets(Ri_, -1, "ts-ss");
  // la arista donde el cuello sale de la pared, por dentro
  const edge = []; for (let i = 0; i <= n; i++) { const p = (i / n) * PI; edge.push(pr(G.pointOf(F, sx(p, Ri_), Ri_, p))); }
  svg += `<path class="iso-line iso-edge" data-tone="mid" d="${pthO(edge)}"/>`;
  const sh = record(A.disc(F, RN.x0, RN.x1, Ro_, { name: "boca-retorno.cuello", owner: own, cut: [FRONT, A.disc(FV(0), Z.tanCol, Z.arriba, Rc - 1, {}), A.disc(F, RN.x0 - 5, RN.x1 + 5, Ri_, {})] }));
  put("boca-retorno.cuello", [RN.x1 - 40, -Ro_ * 0.7, ZR], svg, [sh]);
  cap("boca-retorno.cuello.corte-arriba", [[Rc, ZR + Ri_], [RN.x1, ZR + Ri_], [RN.x1, ZR + Ro_], [Rc, ZR + Ro_]], { owner: own });
  cap("boca-retorno.cuello.corte-abajo", [[Rc, ZR - Ro_], [RN.x1, ZR - Ro_], [RN.x1, ZR - Ri_], [Rc, ZR - Ri_]], { owner: own });
  ANCH.BOCA_RETORNO = [RN.x1 - 60, -Ro_ * 0.95, ZR + Ro_ * 0.3];
}

/* ====================================================================
   3 · los platos: dos platos perforados con su anillo de apoyo, su vertedero y su bajante (el de abajo con su sello), y el
   bajante del plato de arriba, que el corte deja ver
   ==================================================================== */
const XDC = Rc - PL.bajante;                                  // la cuerda de los bajantes
const ZSP = Z.plato1 - 560;                                   // el fondo del sello
{
  const own = "columna";
  const Rd = Rc - 3;
  // la cubierta: media corona del lado y ≤ 0, de la cuerda hasta la pared; side = −1 (bajante a la izquierda) o +1
  const deckPoly = (side) => {
    const pts = [];
    const ac = Math.acos(XDC / Rd) / D2R;             // el ángulo de la cuerda, medido desde el lado del bajante
    if (side < 0) {
      // de la cuerda (x = −XDC) hacia +x: arco de φ = 180 + ac a 360
      pts.push([-XDC, 0]);
      pts.push([Rd, 0]);
      for (let a = 360; a >= 180 + ac - 1e-9; a -= 4) pts.push([Rd * Math.cos(a * D2R), Rd * Math.sin(a * D2R)]);
      pts.push([-XDC, -Math.sqrt(Rd * Rd - XDC * XDC)]);
    } else {
      pts.push([-Rd, 0]); pts.push([XDC, 0]); pts.push([XDC, -Math.sqrt(Rd * Rd - XDC * XDC)]);
      for (let a = 360 - ac; a >= 180 - 1e-9; a -= 4) pts.push([Rd * Math.cos(a * D2R), Rd * Math.sin(a * D2R)]);
    }
    return pts;
  };
  const yC = -Math.sqrt(Rc * Rc - XDC * XDC) - 1;
  const holes = (side, z) => {
    // los agujeros del área activa: una rejilla de puntos (la de verdad es más fina)
    const pts = [];
    for (let x = -Rd + 70; x <= Rd - 70; x += 55) for (let y = -38; y >= -Rd + 70; y -= 55) {
      const xx = x + ((Math.round(-y / 55) % 2) * 27);
      if (Math.hypot(xx, y) > Rd - 90) continue;
      if (side < 0 ? xx < -XDC + 90 || xx > XDC - 40 : xx > XDC - 90 || xx < -XDC + 40) continue;
      pts.push(at([xx, y, z + 0.5]));
    }
    return Dots(pts, { size: 0.42, tone: "lo" });
  };
  for (const [tray, zt, side] of [[1, Z.plato1, -1], [2, Z.plato2, 1]]) {
    const nm = `plato${tray}`;
    // el anillo de apoyo bajo la cubierta, soldado a la pared
    const aD = 180 + Math.acos((XDC + 5) / (Rc - PL.anillo)) / D2R;     // donde la cuerda del bajante corta el anillo
    const ringProf = ringRZ(Rc - PL.anillo, Rc, zt - PL.t - 10, zt - PL.t);
    if (side < 0) {
      revV(`${nm}.anillo`, 0, ringProf, { owner: own, sectors: [[aD, 255], [255, 330], [330, 360]] });
      cap(`${nm}.anillo.corte`, mirrorAt(0, ringProf, 1), { owner: own });
    } else {
      revV(`${nm}.anillo`, 0, ringProf, { owner: own, sectors: [[180, 255], [255, 540 - aD]] });
      cap(`${nm}.anillo.corte`, mirrorAt(0, ringProf, -1), { owner: own });
    }
    // la cubierta perforada
    fp(`${nm}.cubierta`, FZ, deckPoly(side), zt - PL.t, zt, { cls: "ts-ss", owner: own, extra: holes(side, zt) });
    // el vertedero de salida, sobre la cuerda del bajante
    const xw = side < 0 ? -XDC : XDC;
    box(`${nm}.vertedero`, [side < 0 ? xw : xw - 5, yC, zt], [side < 0 ? xw + 5 : xw, 0, zt + PL.vertedero], { cls: "ts-ss", owner: own, r: 0, steps: 1 });
    // el bajante: de la cubierta hacia abajo
    const zb = tray === 1 ? ZSP + 40 : Z.plato1 + PL.despeje;
    box(`${nm}.bajante`, [side < 0 ? xw - 5 : xw, yC, zb], [side < 0 ? xw : xw + 5, 0, zt - PL.t], { cls: "ts-ss", owner: own, r: 0, steps: 1 });
    ANCH[`PLATO${tray}`] = [side < 0 ? 300 : -300, -380, zt];
    ANCH[`BAJANTE${tray}`] = [side < 0 ? xw - 5 : xw + 5, -200, (zb + zt) / 2];
    ANCH[`VERTEDERO${tray}`] = [xw, -260, zt + PL.vertedero];
  }
  // el bajante del plato de arriba (fuera del dibujo), que llega hasta el plato 2
  box("plato3.bajante", [-XDC - 5, yC, Z.plato2 + PL.despeje], [-XDC, 0, Z.arriba], { cls: "ts-ss", owner: own, r: 0, steps: 1 });
  // el sello del bajante de abajo: una bandeja con su vertedero, del lado de la pared
  const SL = PL.sello, xs = -XDC + 100, Rp = Rc + 1;
  const ySl = -Math.sqrt(Rp * Rp - xs * xs);
  const pan = [[xs, 0], [xs, ySl]];
  const aS = Math.atan2(ySl, xs) / D2R + 360;
  for (let a = Math.floor(aS / 4) * 4; a >= 180 - 1e-9; a -= 4) pan.push([Rp * Math.cos(a * D2R), Rp * Math.sin(a * D2R)]);
  pan.push([-Rp, 0]);
  void SL;
  fp("sello.fondo", FZ, pan, ZSP - 6, ZSP, { cls: "ts-ss", owner: own });
  box("sello.vertedero", [xs, ySl, ZSP], [xs + 6, 0, ZSP + SL.vertedero + 40], { cls: "ts-ss", owner: own, r: 0, steps: 1 });
  ANCH.SELLO = [xs, -200, ZSP + SL.vertedero];
  TS._sello = { xs, ySl };
}
// los líquidos de los platos: la espuma sobre las cubiertas, el líquido claro de los bajantes y del sello, y la lámina
// que rebosa del sello hacia el sumidero
{
  const XS = TS._sello.xs;
  const froth = (nm, x0, x1, z0, z1) => liq(nm, rectXZ(x0, x1, z0, z1), { cls: "ts-espuma" });
  froth("plato1.espuma", -XDC + 5, Rc, Z.plato1, Z.plato1 + PL.espuma);
  froth("plato2.espuma", -Rc, XDC - 5, Z.plato2, Z.plato2 + PL.espuma);
  // los bajantes: líquido claro abajo y espuma arriba
  liq("bajante1.liquido", [[-Rc, ZSP], [XS, ZSP], [XS, ZSP + PL.sello.vertedero + 40], [-XDC, ZSP + PL.sello.vertedero + 40], [-XDC, Z.plato1 - 300], [-Rc, Z.plato1 - 300]]);
  froth("bajante1.espuma", -Rc, -XDC - 5, Z.plato1 - 300, Z.plato1 - 60);
  liq("bajante2.liquido", rectXZ(XDC + 5, Rc, Z.plato1, Z.plato2 - 330));
  froth("bajante2.espuma", XDC + 5, Rc, Z.plato2 - 330, Z.plato2 - 80);
  liq("bajante3.liquido", rectXZ(-Rc, -XDC - 5, Z.plato2, Z.plato2 + 280));
  froth("bajante3.espuma", -Rc, -XDC - 5, Z.plato2 + 280, Z.arriba);
  // la lámina que rebosa del sello: sobre el vertedero y hacia abajo, hasta la superficie
  const lam = [];
  const zTop = ZSP + PL.sello.vertedero + 40;
  for (let i = 0; i <= 10; i++) { const t = i / 10; lam.push([XS + 8 + 70 * Math.sqrt(t), zTop + 6 - (zTop - ZL) * t * t]); }
  const lamPoly = [...lam, ...lam.slice().reverse().map(([x, z]) => [x + 14, z + 4])];
  liq("sello.lamina", lamPoly);
}

/* ====================================================================
   4 · el sumidero: el rompe-vórtice sobre la boca del fondo y el líquido, su cara del corte y su superficie
   ==================================================================== */
{
  const own = "columna", RV = TS.rompeVortice;
  // dos placas en cruz, a ±45° del plano del corte, sobre la cabeza
  for (const [nm, dir] of [["rompe-vortice.1", [Math.SQRT1_2, Math.SQRT1_2, 0]], ["rompe-vortice.2", [Math.SQRT1_2, -Math.SQRT1_2, 0]]]) {
    const nrm = [-dir[1], dir[0], 0];
    const F = { o: [0, 0, 0], a: nrm, u: dir, v: ZD };
    const L = RV.largo / 2, sgn = dir[1] > 0 ? -1 : 1;           // la mitad que queda atrás
    const poly = [];
    const u0 = 0, u1 = sgn * L;
    const N = 6;
    for (let i = 0; i <= N; i++) { const u = u0 + ((u1 - u0) * i) / N; poly.push([u, zHeadIn(Math.abs(u)) + 1]); }
    poly.push([u1, zHeadIn(0) + RV.alto], [u0, zHeadIn(0) + RV.alto]);
    const ring = sgn > 0 ? poly : poly.slice().reverse();
    fp(nm, F, ring, -RV.t / 2, RV.t / 2, { cls: "ts-ss", owner: own });
  }
  ANCH.ROMPE_VORTICE = [RV.largo * 0.3, -RV.largo * 0.3, zHeadIn(0) + RV.alto];
  // el líquido del sumidero: la cara del corte (de la boca de la brida del fondo hasta el nivel) y la superficie
  const N = 14, poly = [];
  poly.push([-Rc, ZL]);
  for (let i = N; i >= 0; i--) { const t = (i / N) * (PI / 2); const r = Ei + (Rc - Ei) * Math.sin(t); poly.push([-r, zHeadIn(r)]); }
  poly.push([-Ei, ZN0]); poly.push([Ei, ZN0]);
  for (let i = 0; i <= N; i++) { const t = (i / N) * (PI / 2); const r = Ei + (Rc - Ei) * Math.sin(t); poly.push([r, zHeadIn(r)]); }
  poly.push([Rc, ZL]);
  liq("sumidero.liquido", poly);
  const sup = []; for (let i = 0; i <= 60; i++) { const f = (180 + i * 3) * D2R; sup.push([Rc * Math.cos(f), Rc * Math.sin(f)]); }
  {
    const d = pth1(sup.map(([x, y]) => pr([x, y, ZL])));
    // unas ondas donde cae el líquido del retorno y la lámina del sello
    let wv = "";
    for (const [cx, cy, rs] of [[470, -150, [60, 110, 170]], [TS._sello.xs + 70, -260, [50, 95]]]) for (const r of rs) {
      const pts = []; for (let i = 0; i <= 40; i++) { const t = (i / 40) * TAU; const x = cx + r * Math.cos(t), y = cy + r * 0.9 * Math.sin(t); if (Math.hypot(x, y) > Rc - 8 || y > -4) { pts.push(null); continue; } pts.push(pr([x, y, ZL + 0.5])); }
      let run = []; for (const p of [...pts, null]) { if (p) run.push(p); else { if (run.length > 1) wv += pthO(run); run = []; } }
    }
    const sh = A.prism(FZ, sup, ZL - 0.3, ZL, { name: "sumidero.superficie", owner: "liquido" });
    put("sumidero.superficie", [0, -Rc / 2, ZL], `<path class="ts-liq-sup" d="${d}"/><path class="ts-onda" d="${wv}"/>`, [sh]);
  }
  ANCH.NIVEL = [-Rc * 0.55, -Rc * 0.45, ZL];
  ANCH.SUMIDERO = [-Rc * 0.45, 0, ZL - 450];
}

/* ====================================================================
   5 · la línea de entrada: la brida del tubo, el tubo que baja dentro del faldón, el codo, el tramo con la placa de
   orificio entre dos bridas, el codo de subida y la brida de la boquilla de abajo del rehervidor; con el líquido
   ==================================================================== */
const XO = EN.orificio.x;
{
  const own = "entrada", J = RH.junta;
  const zp1 = ZN0 - EN.bridaT - J;                              // la cara de arriba de la brida del tubo, bajo la junta
  vert("entrada.junta-arriba", 0, ringRZ(Ei + 4, EN.bridaR - 40, zp1, zp1 + J), { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own });
  vert("entrada.brida-arriba", 0, ringRZ(Ei, EN.bridaR, zp1 - EN.bridaT, zp1), { owner: own });
  const zv1 = zp1 - EN.bridaT, zv0 = ZE + EN.codo;
  vert("entrada.baja", 0, ringRZ(Ei, Eo, zv0, zv1), { owner: own, skip: [0, 2] });
  elbow("entrada.codo1", [EN.codo, ZE + EN.codo], EN.codo, Ei, Eo, 180, 270, { owner: own });
  const xa = EN.codo, xb = Xr - EN.codo;
  const xo0 = XO - EN.orificio.t / 2, xo1 = XO + EN.orificio.t / 2;
  horiz("entrada.tramo1", xa, xo0 - J - EN.bridaT, ZE, Ei, Eo, { owner: own });
  horiz("entrada.tramo2", xo1 + J + EN.bridaT, xb, ZE, Ei, Eo, { owner: own });
  // las dos bridas del orificio con sus juntas y la placa con su oreja
  horiz("orificio.brida1", xo0 - J - EN.bridaT, xo0 - J, ZE, Ei, EN.bridaR, { owner: own, skip: [] });
  horiz("orificio.brida2", xo1 + J, xo1 + J + EN.bridaT, ZE, Ei, EN.bridaR, { owner: own, skip: [] });
  const rb = Ei * 0.62;
  horiz("orificio.junta1", xo0 - J, xo0, ZE, Ei + 4, EN.bridaR - 40, { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own, skip: [] });
  horiz("orificio.junta2", xo1, xo1 + J, ZE, Ei + 4, EN.bridaR - 40, { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own, skip: [] });
  horiz("orificio.placa", xo0, xo1, ZE, rb, EN.bridaR - 30, { cls: "ts-ss", owner: own, skip: [] });
  box("orificio.oreja", [xo0, -30, ZE + EN.bridaR - 40], [xo1, 0, ZE + EN.bridaR + EN.orificio.oreja], { cls: "ts-ss", owner: own, r: 0, steps: 1 });
  // los pernos de las bridas del orificio: sus cabezas en la cara de la segunda brida
  {
    const pts = []; for (let i = 0; i < 12; i++) { const a = (15 + 30 * i) * D2R; const y = -205 * Math.sin(a), z = ZE + 205 * Math.cos(a); if (y > -2) continue; pts.push(at([xo1 + J + EN.bridaT + 1, y, z])); }
    put("orificio.tuercas", [xo1 + J + EN.bridaT + 8, -120, ZE], Dots(pts, { size: 1.5, tone: "mid" }), [A.ring(FHx(ZE), xo1 + J + EN.bridaT, xo1 + J + EN.bridaT + 14, 185, 226, { cut: [FRONT] })]);
  }
  elbow("entrada.codo2", [xb, ZE + EN.codo], EN.codo, Ei, Eo, 270, 360, { owner: own });
  const zq0 = ZE + EN.codo;                                     // la brida del tubo, junta y la brida de la boquilla
  vert("entrada.brida-abajo", Xr, ringRZ(Ei, EN.bridaR, zq0, zq0 + EN.bridaT), { owner: own });
  vert("entrada.junta-abajo", Xr, ringRZ(Ei + 4, EN.bridaR - 40, zq0 + EN.bridaT, zq0 + EN.bridaT + J), { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own });
  // el líquido de la línea
  liq("entrada.liquido.baja", rectXZ(-Ei, Ei, zv0, ZN0));
  liq("entrada.liquido.codo1", annXZ([EN.codo, ZE + EN.codo], EN.codo - Ei, EN.codo + Ei, 180, 270));
  liq("entrada.liquido.tramo", rectXZ(xa, xb, ZE - Ei, ZE + Ei));
  liq("entrada.liquido.codo2", annXZ([xb, ZE + EN.codo], EN.codo - Ei, EN.codo + Ei, 270, 360));
  ANCH.ORIFICIO = [XO, -15, ZE + EN.bridaR + EN.orificio.oreja - 10];
  ANCH.ENTRADA = [(xa + XO) / 2 - 120, -Eo * 0.6, ZE + Eo * 0.8];
  ANCH.ENTRADA_BAJA = [Eo, -Eo * 0.5, (zv0 + zv1) / 2];
}

/* ====================================================================
   6 · el rehervidor: el bonete de abajo con su boquilla, los espejos, la coraza, los soportes, el bonete de arriba con
   su boquilla, los tubos (la fila del corte, con la mezcla, y la de atrás) y el condensado sobre el espejo de abajo
   ==================================================================== */
const tz = tubos();
const hrI = RH.cabeza, hrO = RH.cabeza + RH.t;
const zBotIn = (r) => Z.cilAbajo - hrI * Math.sqrt(Math.max(0, 1 - (r / Rr) ** 2));
const zBotOut = (r) => Z.cilAbajo - hrO * Math.sqrt(Math.max(0, 1 - (r / Rro) ** 2));
const zTopIn = (r) => Z.tanArriba + hrI * Math.sqrt(Math.max(0, 1 - (r / Rr) ** 2));
const zTopOut = (r) => Z.tanArriba + hrO * Math.sqrt(Math.max(0, 1 - (r / Rro) ** 2));
// la mezcla en los tubos: de abajo (líquido) hacia arriba (casi todo vapor), en bandas; el primer tramo, sin burbujas
const MEZ = [0.0, 0.17, 0.32, 0.47, 0.62, 0.78, 1.0];
{
  const own = "rehervidor", J = RH.junta;
  // la boquilla de abajo: brida, cuello, cabeza y cilindro del bonete, brida del bonete y junta
  vert("reh.boca-abajo.brida", Xr, ringRZ(Ei, EN.bridaR, Z.bocaE0, Z.bocaE1), { owner: own });
  vert("reh.boca-abajo.cuello", Xr, [[Ei, Z.bocaE1], [Eo, Z.bocaE1], [Eo, zBotOut(Eo)], [Ei, zBotIn(Ei)]], { owner: own, skip: [0, 2] });
  const N = 12, bonnet = (zIn, zOut, zc0, zc1, up) => {
    const inner = [], outer = [];
    for (let i = 0; i <= N; i++) { const t = (i / N) * (PI / 2); const r = (up ? Ro_ - RE.t : Ei) + (Rr - (up ? Ri_ : Ei)) * Math.sin(t); inner.push([r, zIn(r)]); }
    for (let i = N; i >= 0; i--) { const t = (i / N) * (PI / 2); const r = (up ? Ro_ : Eo) + (Rro - (up ? Ro_ : Eo)) * Math.sin(t); outer.push([r, zOut(r)]); }
    return [...inner, [Rr, zc1], [Rro, zc1], ...outer];
  };
  {
    const prof = bonnet(zBotIn, zBotOut, Z.cilAbajo, Z.bridaAbajo, false);
    const smooth = []; for (let i = 1; i <= N; i++) smooth.push(i); for (let i = N + 3; i <= 2 * N + 2; i++) smooth.push(i);
    vert("reh.bonete-abajo", Xr, prof, { owner: own, smooth, skip: [N + 1, 2 * N + 3] });
  }
  vert("reh.bonete-abajo.brida", Xr, ringRZ(Rr, RH.bridaR, Z.bridaAbajo, Z.bridaAbajo + RH.bridaT), { owner: own });
  vert("reh.junta-abajo", Xr, ringRZ(Rr + 4, RH.bridaR - 45, Z.bridaAbajo + RH.bridaT, ZB), { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own });
  // los espejos: el disco en su mitad de atrás y su cara del corte, con los agujeros de la fila del corte; dentro de cada
  // agujero, el tubo por dentro y lo que lleva
  const nutsOn = (z) => (a0, a1) => { const pts = []; for (let i = 0; i < RH.pernos; i++) { const a = (360 * (i + 0.5)) / RH.pernos; if (a < Math.max(180, a0) || a >= Math.min(360, a1)) continue; pts.push(at([Xr + 625 * Math.cos(a * D2R), 625 * Math.sin(a * D2R), z])); } return pts.length ? Dots(pts, { size: 1.0, tone: "mid" }) : ""; };
  for (const [nm, z0, z1, nz] of [["reh.espejo-abajo", ZB, ZT1, ZT1], ["reh.espejo-arriba", ZT2, ZL, null]]) {
    revV(nm, Xr, ringRZ(0, RH.bridaR, z0, z1), { owner: own, extras: nz ? nutsOn(nz + 1) : null });
    // la cara del corte, con los agujeros (r = tri) de la fila del corte
    const poly = [[Xr - RH.bridaR, z0]];
    const xs = tz.corte.map(([x]) => Xr + x).sort((a, b) => a - b);
    const segs = [];
    let xprev = Xr - RH.bridaR;
    for (const x of xs) { segs.push([xprev, x - tri]); xprev = x + tri; }
    segs.push([xprev, Xr + RH.bridaR]);
    segs.forEach(([a, b], i) => cap(`${nm}.corte${i}`, rectXZ(a, b, z0, z1), { owner: own }));
    void poly;
    // dentro de los agujeros: el tubo por dentro (la mitad de atrás, sin luz) y su contenido
    const zm = (z0 + z1) / 2;
    let fill = "";
    for (const x of xs) fill += pth1(rectXZ(x - tri, x + tri, z0, z1).map(([xx, zz]) => pr([xx, -0.5, zz])));
    const cls = z0 < ZL - 100 ? "ts-liq-agujero" : "ts-mez-agujero";
    put(`${nm}.agujeros`, [Xr, -tri, zm], `<path class="ts-agujero" d="${fill}"/><path class="${cls}" d="${fill}"/>`, [A.prism(FY, rectXZ(Xr - RH.bridaR, Xr + RH.bridaR, z0, z1), -tri, -0.4, {})]);
  }
  // la cara de arriba del espejo de arriba (dentro del bonete): las bocas de los tubos de la mitad de atrás
  {
    let holesD = "";
    const T = RH.tubos;
    for (let j = -1; j >= -40; j--) { const y = j * T.paso; for (let i = -40; i <= 40; i++) { const x = i * T.paso; if (Math.hypot(x, y) > T.R - tro) continue; const pts = []; for (let q = 0; q < 14; q++) { const t = (q / 14) * TAU; pts.push(pr([Xr + x + tri * Math.cos(t), y + tri * Math.sin(t), ZL + 0.3])); } holesD += pth1(pts); } }
    put("reh.espejo-arriba.bocas", [Xr, -Rr / 2, ZL + 0.3], `<path class="ts-boca-tubo" d="${holesD}"/>`, [A.prism(FZ, [[Xr - Rr + 20, -20], [Xr + Rr - 20, -20], [Xr + Rr - 60, -Rr + 60], [Xr - Rr + 60, -Rr + 60]], ZL, ZL + 0.3, {})]);
  }
  // la coraza: de espejo a espejo, en su mitad de atrás, con sus caras del corte
  CORAZA.push(...vert("reh.coraza", Xr, ringRZ(Rr, Rro, ZT1, ZT2), { owner: own, skip: [0, 2] }));
  // el bonete de arriba: junta, brida, cilindro y cabeza, cuello y brida de la boquilla
  vert("reh.junta-arriba", Xr, ringRZ(Rr + 4, RH.bridaR - 45, ZL, Z.bridaArriba), { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own });
  vert("reh.bonete-arriba.brida", Xr, ringRZ(Rr, RH.bridaR, Z.bridaArriba, Z.cilArriba), { owner: own, extras: (a0, a1) => nutsOn(Z.cilArriba + 1)(a0, a1) });
  {
    const inner = [], outer = [];
    for (let i = 0; i <= N; i++) { const t = (i / N) * (PI / 2); const r = Ri_ + (Rr - Ri_) * Math.sin(t); inner.push([r, zTopIn(r)]); }
    for (let i = N; i >= 0; i--) { const t = (i / N) * (PI / 2); const r = Ro_ + (Rro - Ro_) * Math.sin(t); outer.push([r, zTopOut(r)]); }
    // en (r, z): de la brida hacia arriba por dentro hasta la boca, y de vuelta por fuera
    const profU = [[Rr, Z.cilArriba], ...inner.slice().reverse(), ...outer.slice().reverse(), [Rro, Z.cilArriba]];
    const smooth = []; for (let i = 1; i <= N; i++) smooth.push(i); for (let i = N + 3; i <= 2 * N + 2; i++) smooth.push(i);
    vert("reh.bonete-arriba", Xr, profU, { owner: own, smooth, skip: [N + 1, 2 * N + 3] });
  }
  vert("reh.boca-arriba.cuello", Xr, [[Ri_, zTopIn(Ri_)], [Ro_, zTopOut(Ro_)], [Ro_, Z.bocaR0], [Ri_, Z.bocaR0]], { owner: own, skip: [0, 2] });
  vert("reh.boca-arriba.brida", Xr, ringRZ(Ri_, RE.bridaR, Z.bocaR0, Z.bocaR1), { owner: own, extras: (a0, a1) => { const pts = []; for (let i = 0; i < 24; i++) { const a = 7.5 + 15 * i; if (a < Math.max(180, a0) || a >= Math.min(360, a1)) continue; pts.push(at([Xr + 395 * Math.cos(a * D2R), 395 * Math.sin(a * D2R), Z.bocaR1 + 1])); } return pts.length ? Dots(pts, { size: 1.2, tone: "mid" }) : ""; } });
  // los tubos de la fila del corte: la mitad de atrás, sus dos caras del corte y la mezcla que sube
  const mezBands = (x) => {
    let out = "";
    for (let b = 0; b < MEZ.length - 1; b++) {
      const z0 = ZT1 + (ZT2 - ZT1) * MEZ[b], z1 = ZT1 + (ZT2 - ZT1) * MEZ[b + 1];
      out += `<path class="ts-mez-${b}" d="${pth1(rectXZ(x - tri, x + tri, z0, z1).map(([xx, zz]) => pr([xx, -0.4, zz])))}"/>`;
    }
    // las burbujas: más y más grandes hacia arriba, desde el segundo tramo
    let bub = "";
    for (let q = 0; q < 26; q++) {
      const t = MEZ[1] + (1 - MEZ[1]) * (q + rnd() * 0.8) / 26;
      const r = (2.5 + 7 * t) * (0.7 + 0.5 * rnd());
      if (t > 0.86) continue;
      const xx = x + (rnd() - 0.5) * (2 * tri - 2 * r - 2) * 0.9;
      bub += circ2(pr([xx, -0.5, ZT1 + (ZT2 - ZT1) * t]), Math.max(0.35, r * KS));
    }
    return out + `<path class="ts-burbuja" d="${bub}"/>`;
  };
  tz.corte.forEach(([x0], i) => {
    const x = Xr + x0, F = FV(x);
    const prof = [[ZT1, tri], [ZT2, tri], [ZT2, tro], [ZT1, tro]];
    let svg = "";
    for (const [a0, a1] of [[180, 330], [330, 360]]) svg += sweepSvg({ F, profile: prof, a0: a0 * D2R, a1: a1 * D2R, cls: "ts-ss", capA: "none", capB: "none", skip: [1, 3], steps: a0 === 180 ? 10 : 3 });
    svg += mezBands(x);
    const caps = [rectXZ(x + tri, x + tro, ZT1, ZT2), rectXZ(x - tro, x - tri, ZT1, ZT2)];
    for (const c of caps) svg += faceSvg(pth1(c.map(([xx, zz]) => pr([xx, 0, zz]))), "ts-cut");
    const sh = A.lathe(F, prof, { name: `tubo${i}`, owner: own, cut: [FRONT] });
    record(sh);
    put(`tubo${i}`, [x, -tro * 0.6, (ZT1 + ZT2) / 2], svg, [sh, ...caps.map((c) => A.prism(FY, c, -0.3, 0, {}))]);
  });
  // la fila de atrás: tubos enteros
  tz.atras.forEach(([x0, y0], i) => {
    const x = Xr + x0, F = FV(x, y0);
    const svg = sweepSvg({ F, profile: [[ZT1, tri], [ZT2, tri], [ZT2, tro], [ZT1, tro]], a0: 0, a1: TAU, cls: "ts-ss", capA: "none", capB: "none", skip: [0, 1, 3], steps: 24 });
    const sh = record(A.disc(F, ZT1, ZT2, tro, { name: `tubo-atras${i}`, owner: own }));
    put(`tubo-atras${i}`, [x, y0, (ZT1 + ZT2) / 2], svg, [sh]);
  });
  // el fondo del haz: lo que se ve entre los tubos de la fila de atrás
  {
    const yb = -RH.tubos.paso - tro - 3.5, xw = Math.sqrt(Rr * Rr - yb * yb) - 2;
    const poly = rectXZ(Xr - xw, Xr + xw, ZT1, ZT2);
    const d = pth1(poly.map(([x, z]) => pr([x, yb, z])));
    put("reh.haz-fondo", [Xr, yb, (ZT1 + ZT2) / 2], `<path class="ts-haz-fondo" d="${d}"/>`, [A.prism(FY, poly, yb - 0.3, yb, {})]);
  }
  // los soportes de los tubos: placas segmentadas; se ven entre los tubos de la fila del corte
  RH.soportes.forEach((f, i) => {
    const zs = ZT1 + (ZT2 - ZT1) * f, side = i % 2 ? 1 : -1, xc = Rr * (1 - 2 * RH.corteSoporte);
    const xa0 = side < 0 ? Xr - Rr + 1 : Xr - xc, xa1 = side < 0 ? Xr + xc : Xr + Rr - 1;
    const yb = -tro - 1;
    const poly = rectXZ(xa0, xa1, zs - 5, zs + 5);
    const sh = record(A.prism(FY, poly, yb - 8, yb, { name: `soporte${i}`, owner: own }));
    put(`soporte${i}`, [(xa0 + xa1) / 2, yb, zs], faceSvg(pth1(poly.map(([x, z]) => pr([x, yb, z]))), "ts-ss", "mid", YD), [sh]);
    ANCH[`SOPORTE${i}`] = [side < 0 ? xa0 + 90 : xa1 - 90, yb, zs + 5];
  });
  // el condensado sobre el espejo de abajo, entre los tubos
  liq("reh.condensado", rectXZ(Xr - Rr, Xr + Rr, ZT1, ZT1 + RH.condensado), { cls: "ts-cond" });
  // el líquido del bonete de abajo (y de su boquilla), y la mezcla del bonete de arriba
  {
    const ell = []; for (let i = 0; i <= 12; i++) { const t = (i / 12) * (PI / 2); const r = Ei + (Rr - Ei) * Math.sin(t); ell.push([r, zBotIn(r)]); }
    const full = [[-Rr, ZB], ...ell.slice().reverse().map(([r, z]) => [-r, z]), [-Ei, Z.bridaE0], [Ei, Z.bridaE0], ...ell, [Rr, ZB]];
    liq("reh.liquido-abajo", full.map(([r, z]) => [Xr + r, z]));
    const elt = []; for (let i = 0; i <= 12; i++) { const t = (i / 12) * (PI / 2); const r = Ri_ + (Rr - Ri_) * Math.sin(t); elt.push([r, zTopIn(r)]); }
    const top = [[-Rr, ZL], ...elt.slice().reverse().map(([r, z]) => [-r, z]), [-Ri_, Z.bridaR1], [Ri_, Z.bridaR1], ...elt, [Rr, ZL]];
    // gotas que salen de los tubos con el vapor
    let gotas = "";
    for (let q = 0; q < 60; q++) { const x = (rnd() - 0.5) * 2 * (Rr - 30), z = ZL + 30 + rnd() * (Z.tanArriba - ZL + 150); if (Math.abs(x) > Rr - 40 - (z > Z.tanArriba ? (z - Z.tanArriba) * 1.6 : 0)) continue; gotas += circ2(pr([Xr + x, -0.6, z]), (1.5 + rnd() * 3.5) * KS + 0.3); }
    liq("reh.mezcla-arriba", top.map(([r, z]) => [Xr + r, z]), { cls: "ts-mez-5", extra: `<path class="ts-gota" d="${gotas}"/>` });
  }
  ANCH.BONETE_ABAJO = [Xr + Rro * Math.cos(345 * D2R), Rro * Math.sin(345 * D2R), (Z.cilAbajo + Z.bridaAbajo) / 2];
  ANCH.BONETE_ARRIBA = [Xr + Rro * Math.cos(345 * D2R), Rro * Math.sin(345 * D2R), (Z.cilArriba + Z.tanArriba) / 2];
  ANCH.ESPEJO_ABAJO = [Xr + RH.bridaR * Math.cos(340 * D2R), RH.bridaR * Math.sin(340 * D2R), ZT1];
  ANCH.ESPEJO_ARRIBA = [Xr + RH.bridaR * Math.cos(340 * D2R), RH.bridaR * Math.sin(340 * D2R), ZL - 25];
  ANCH.CORAZA = [Xr + Rro * Math.cos(350 * D2R), Rro * Math.sin(350 * D2R), ZB + 1500];
  ANCH.TUBOS = [Xr + tz.corte[4][0], -2, ZT1 + (ZT2 - ZT1) * 0.55];
  ANCH.ENTRADA_TUBOS = [Xr - 250, 0, ZB];
  ANCH.SALIDA_TUBOS = [Xr - 250, 0, ZL];
  ANCH.CONDENSADO_CORAZA = [Xr + Rr - 60, 0, ZT1 + RH.condensado * 0.6];
  ANCH.MEZCLA = [Xr + 200, 0, Z.tanArriba];
  ANCH.BOCAS_TUBOS = [Xr - 200, -300, ZL];
}

/* ====================================================================
   7 · el retorno: la brida del tubo sobre la boquilla de arriba, el codo, el tramo y la brida de la boquilla de la
   columna; con la mezcla (el líquido abajo, el vapor arriba, gotas)
   ==================================================================== */
{
  const own = "retorno", J = RH.junta;
  vert("retorno.junta-arriba", Xr, ringRZ(Ri_ + 4, RE.bridaR - 50, Z.bocaR1, Z.bridaR0), { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own });
  vert("retorno.brida-arriba", Xr, ringRZ(Ri_, RE.bridaR, Z.bridaR0, Z.bridaR1), { owner: own });
  const ce = [Xr - RE.codo, Z.bridaR1];
  elbow("retorno.codo", ce, RE.codo, Ri_, Ro_, 0, 90, { owner: own });
  const xp1 = RN.x1 + J + RE.bridaT;                           // la cara de la brida del tubo contra la junta
  horiz("retorno.tramo", xp1, ce[0], ZR, Ri_, Ro_, { owner: own });
  horiz("retorno.brida-col", RN.x1 + J, xp1, ZR, Ri_, RE.bridaR, { owner: own, skip: [] });
  horiz("retorno.junta-col", RN.x1, RN.x1 + J, ZR, Ri_ + 4, RE.bridaR - 50, { cls: "ts-gasket", cutCls: "ts-gasket-cut", owner: own, skip: [] });
  horiz("boca-retorno.brida", RN.x1 - RE.bridaT, RN.x1, ZR, Ri_, RE.bridaR, { owner: "columna", skip: [] });
  {
    const pts = []; for (let i = 0; i < 24; i++) { const a = (7.5 + 15 * i) * D2R; const y = -395 * Math.sin(a), z = ZR + 395 * Math.cos(a); if (y > -2) continue; pts.push(at([xp1 + 1, y, z])); }
    put("retorno.tuercas", [xp1 + 8, -250, ZR], Dots(pts, { size: 1.3, tone: "mid" }), [A.ring(FHx(ZR), xp1, xp1 + 14, RE.bridaR - 80, RE.bridaR - 10, { cut: [FRONT] })]);
  }
  // la mezcla: en el codo, el líquido va por la pared de afuera; en el tramo, abajo; el resto, vapor con gotas
  const film = 0.26;
  liq("retorno.mezcla.codo", annXZ(ce, RE.codo - Ri_, RE.codo + Ri_, 0, 90), { cls: "ts-mez-5" });
  liq("retorno.liquido.codo", annXZ(ce, RE.codo + Ri_ * (1 - film * 0.7), RE.codo + Ri_ - 1, 4, 88), { cls: "ts-liq" });
  liq("retorno.mezcla.tramo", rectXZ(Rc - 30, ce[0], ZR - Ri_, ZR + Ri_), { cls: "ts-mez-5" });
  const wave = []; for (let i = 0; i <= 24; i++) { const x = Rc - 30 + ((ce[0] - Rc + 30) * i) / 24; wave.push([x, ZR - Ri_ + 2 * Ri_ * film * (0.8 + 0.2 * Math.sin(i * 1.3))]); }
  liq("retorno.liquido.tramo", [[Rc - 30, ZR - Ri_ + 1], [ce[0], ZR - Ri_ + 1], ...wave.slice().reverse()], { cls: "ts-liq" });
  let gotas = "";
  for (let q = 0; q < 70; q++) { const x = Rc + rnd() * (ce[0] - Rc), z = ZR - Ri_ + 2 * Ri_ * (0.3 + rnd() * 0.62); gotas += circ2(pr([x, -0.7, z]), (1.5 + rnd() * 3) * KS + 0.3); }
  for (let q = 0; q < 30; q++) { const a = rnd() * 90, r = RE.codo - Ri_ * 0.8 + rnd() * Ri_ * 1.3; gotas += circ2(pr([ce[0] + r * Math.cos(a * D2R), -0.7, ce[1] + r * Math.sin(a * D2R)]), (1.5 + rnd() * 3) * KS + 0.3); }
  put("retorno.gotas", [Xr - 400, -0.7, ZR], `<path class="ts-gota" d="${gotas}"/>`, [A.prism(FY, rectXZ(Rc, Xr, ZR - Ri_, Z.R + Ri_), -0.9, -0.6, {})]);
  // lo que sale del retorno dentro de la columna: el líquido cae al sumidero; el vapor sube
  const fall = [];
  for (let i = 0; i <= 12; i++) { const t = i / 12; fall.push([Rc - 10 - 260 * Math.sqrt(t) * 0.9, ZR - Ri_ + 30 - (ZR - Ri_ + 30 - ZL) * t * t]); }
  liq("retorno.cae", [...fall, ...fall.slice().reverse().map(([x, z]) => [x - 26 - 10 * ((z - ZL) / (ZR - ZL)), z + 10])], { cls: "ts-liq" });
  let caen = "";
  for (let q = 0; q < 40; q++) { const t = rnd(); const x = Rc - 40 - 330 * Math.sqrt(t) * (0.6 + rnd() * 0.6), z = ZR - Ri_ + 60 - (ZR - Ri_ + 60 - ZL) * t * t + (rnd() - 0.5) * 80; if (z < ZL + 15) continue; caen += circ2(pr([x, -0.7, z]), (2 + rnd() * 3.5) * KS + 0.35); }
  put("retorno.gotas-caen", [Rc - 200, -0.7, (ZR + ZL) / 2], `<path class="ts-gota" d="${caen}"/>`, [A.prism(FY, rectXZ(Rc - 420, Rc - 20, ZL, ZR), -0.9, -0.6, {})]);
  ANCH.RETORNO = [(xp1 + ce[0]) / 2, -Ro_ * 0.7, ZR + Ro_ * 0.75];
  ANCH.RETORNO_LIQ = [(xp1 + ce[0]) / 2 + 60, 0, ZR - Ri_ + 40];
  ANCH.RETORNO_CODO = [ce[0] + (RE.codo + Ro_) * Math.cos(45 * D2R), -Ro_ * 0.5, ce[1] + (RE.codo + Ro_) * Math.sin(45 * D2R)];
}

/* ====================================================================
   8 · el lado del vapor: la boquilla del vapor arriba de la coraza con su tubo, que llega de arriba; la boquilla del
   condensado abajo, el tubo que baja a la trampa de flotador y la salida; el venteo de los incondensables
   ==================================================================== */
function nozzle(name, phi, zc, a, len, flangeR, flangeT, { cls = "ts-cs", owner = name } = {}) {
  const F = { o: [Xr, 0, zc], a: radial(phi), u: tang(phi), v: ZD };
  const s1 = Rro + len - flangeT;
  const svg = S(G.saddleOf(F, a, Rro, s1, P), { tone: "mid" });
  const low = Math.sqrt(Rro * Rro - a * a);
  const sh = record(A.disc(F, low - 2, s1, a, { name: `${name}.cuello`, owner, seated: true, cut: [...CORAZA, A.disc(FV(Xr), ZT1 - 20, ZT2 + 20, Rro, { name: "coraza.adentro", piece: "frame", ride: "frame" })] }));
  put(`${name}.cuello`, G.add3([Xr, 0, zc], G.mul3(radial(phi), (low + s1) / 2)), wrap(svg, cls), [sh]);
  disc(`${name}.brida`, F, s1, s1 + flangeT, flangeR, { cls, owner, extra: Dots(Array.from({ length: 8 }, (_, i) => at(G.pointOf(F, s1 + flangeT + 0.5, flangeR * 0.78, (i + 0.5) * PI / 4))).filter((_, i) => G.dot3(G.radialOf(F, (i + 0.5) * PI / 4), V3) > -0.2), { size: 0.9, tone: "mid" }) });
  return { F, s: s1 + flangeT, end: G.add3([Xr, 0, zc], G.mul3(radial(phi), s1 + flangeT)) };
}
{
  // el vapor: boquilla, junta, brida del tubo y el tubo que sube a la línea de vapor
  const own = "vapor", zc = ZT2 - VP.z;
  const nz = nozzle("vapor.boca", VP.phi, zc, VP.ro, VP.largo * 0.45, VP.bridaR, VP.bridaT, { owner: own });
  const F = nz.F;
  disc("vapor.junta", F, nz.s, nz.s + 3, VP.bridaR - 30, { cls: "ts-gasket", owner: own });
  disc("vapor.brida", F, nz.s + 3, nz.s + 3 + VP.bridaT, VP.bridaR, { cls: "ts-cs", owner: own });
  const p0 = G.add3([Xr, 0, zc], G.mul3(radial(VP.phi), nz.s + 3 + VP.bridaT));
  const corner = G.add3([Xr, 0, zc], G.mul3(radial(VP.phi), nz.s + 3 + VP.bridaT + VP.largo));
  const top = [corner[0], corner[1], ZL + VP.sube];
  route("vapor.tubo", [p0, corner, top], VP.ro, 1.5 * 2 * VP.ro, { cls: "ts-cs", owner: own });
  const Ft = { o: top, a: ZD, u: XD, v: YD };
  disc("vapor.brida-arriba", Ft, 0, VP.bridaT, VP.bridaR, { cls: "ts-cs", owner: own });
  TS._vaporTop = [top[0], top[1], top[2] + VP.bridaT];
  ANCH.VAPOR_BOCA = G.add3([Xr, 0, zc], G.mul3(radial(VP.phi), Rro + 60));
  ANCH.VAPOR_LINEA = [top[0], top[1] + VP.ro, top[2] - 500];
}
{
  // el condensado: boquilla a ras del espejo de abajo, codo hacia abajo, la trampa de flotador y la salida
  const own = "condensado", zc = ZT1 + CD.ro + 6;
  const nz = nozzle("condensado.boca", CD.phi, zc, CD.ro, CD.largo * 0.4, CD.bridaR, CD.bridaT, { owner: own });
  const F = nz.F;
  disc("condensado.junta", F, nz.s, nz.s + 2, CD.bridaR - 15, { cls: "ts-gasket", owner: own });
  disc("condensado.brida", F, nz.s + 2, nz.s + 2 + CD.bridaT, CD.bridaR, { cls: "ts-cs", owner: own });
  const sA = nz.s + 2 + CD.bridaT;
  const p0 = G.add3([Xr, 0, zc], G.mul3(radial(CD.phi), sA));
  const corner = G.add3([Xr, 0, zc], G.mul3(radial(CD.phi), sA + CD.largo * 0.6));
  const TR = TS.trampa;
  const zTr = zc - CD.baja;                                      // el eje de la trampa (horizontal, a lo largo del radio)
  const pIn = [corner[0], corner[1], zTr + TR.r + 30];
  route("condensado.baja", [p0, corner, pIn], CD.ro, 3 * CD.ro, { cls: "ts-cs", owner: own });
  // la trampa: un cuerpo de fundición con la tapa apernada del lado de afuera; entra por arriba y sale por un lado, abajo
  const Ftr = { o: [corner[0], corner[1], zTr], a: radial(CD.phi), u: tang(CD.phi), v: ZD };
  const L2 = TR.largo / 2;
  const merid = [[-L2, 0], [-L2, TR.r * 0.6], [-L2 + 12, TR.r * 0.92, 1], [-L2 + 40, TR.r], [L2 - 30, TR.r], [L2 - 30, TR.tapaR], [L2, TR.tapaR], [L2, 0]];
  turned("trampa.cuerpo", Ftr, merid, { cls: "ts-cast", owner: own, steps: 56, extra: Dots(Array.from({ length: 10 }, (_, i) => at(G.pointOf(Ftr, L2 + 0.5, TR.tapaR - 14, (i + 0.5) * TAU / 10))).filter((_, i) => G.dot3(G.radialOf(Ftr, (i + 0.5) * TAU / 10), V3) > -0.3), { size: 0.9, tone: "mid" }) });
  disc("trampa.entrada", { o: [corner[0], corner[1], 0], a: ZD, u: XD, v: YD }, zTr + TR.r - 8, zTr + TR.r + 30, CD.ro + 12, { cls: "ts-cast", owner: own, n: 6 });
  // la salida: del costado de abajo de la trampa, hacia afuera y abajo, al retorno de condensado
  const Fo = Ftr, pOut0 = G.pointOf(Fo, L2 - 30 - 50, 0, 0);
  const pOut = [pOut0[0], pOut0[1], zTr - TR.r + 10];
  const pDown = [pOut[0], pOut[1], zTr - TR.r - 30];
  disc("trampa.salida", { o: [pOut[0], pOut[1], 0], a: ZD, u: XD, v: YD }, zTr - TR.r - 30, zTr - TR.r + 8, CD.ro + 10, { cls: "ts-cast", owner: own, n: 6 });
  const pOutC = G.add3(pDown, [0, 0, -260]), pFar = G.add3(pOutC, G.mul3(radial(CD.phi), CD.x1 - 300));
  route("condensado.sale", [pDown, pOutC, pFar], CD.ro * 0.8, 3 * CD.ro, { cls: "ts-cs", owner: own });
  disc("condensado.brida-sale", { o: pFar, a: radial(CD.phi), u: tang(CD.phi), v: ZD }, 0, CD.bridaT, CD.bridaR * 0.85, { cls: "ts-cs", owner: own });
  TS._condSale = { p: G.add3(pFar, G.mul3(radial(CD.phi), CD.bridaT)), dir: radial(CD.phi) };
  ANCH.CONDENSADO_BOCA = G.add3([Xr, 0, zc], G.mul3(radial(CD.phi), Rro + 40));
  ANCH.TRAMPA = G.pointOf(Ftr, 0, TR.r, PI / 2 + 0.3);
  ANCH.CONDENSADO_SALE = G.add3(pOutC, G.mul3(radial(CD.phi), (CD.x1 - 300) * 0.6));
}
{
  // el venteo de los incondensables: boquilla chica, una válvula de bola y el venteo termostático
  const own = "venteo", VT = TS.venteo, zc = ZT1 + VT.z;
  const nz = nozzle("venteo.boca", VT.phi, zc, VT.ro, VT.largo * 0.35, VT.ro * 2.2, 12, { owner: own });
  const F = nz.F;
  const cV = G.add3([Xr, 0, zc], G.mul3(radial(VT.phi), nz.s + 32));
  put("venteo.valvula", cV, wrap(S(G.sphereOf(cV, 30, P), { tone: "mid" }), "ts-cast"), [record(A.ball(cV, 30, { name: "venteo.valvula", owner: own }))]);
  disc("venteo.palanca-eje", { o: cV, a: ZD, u: XD, v: YD }, 28, 46, 7, { cls: "ts-cast", owner: own });
  fp("venteo.palanca", { o: [cV[0], cV[1], cV[2] + 46], a: ZD, u: tang(VT.phi), v: radial(VT.phi) }, [[-8, -10], [130, -10], [130, 10], [-8, 10]], 0, 8, { cls: "ts-paint", owner: own });
  const ent = Math.sqrt(30 * 30 - VT.ro * VT.ro) - 0.2;
  const p0 = G.add3(cV, G.mul3(radial(VT.phi), ent)), p1 = G.add3(cV, G.mul3(radial(VT.phi), 95)), p2 = [p1[0], p1[1], p1[2] + 150];
  route("venteo.tubo", [nz.end, G.add3(cV, G.mul3(radial(VT.phi), -ent))], VT.ro, 30, { cls: "ts-cs", owner: own });
  route("venteo.sube", [p0, p1, p2], VT.ro, 50, { cls: "ts-cs", owner: own });
  const Fv = { o: p2, a: ZD, u: XD, v: YD };
  turned("venteo.termostatico", Fv, [[0, 0], [0, 26], [10, 32, 1], [40, 32], [50, 26, 1], [56, 12], [56, 0]], { cls: "ts-cast", owner: own, steps: 32 });
  disc("venteo.boquilla", Fv, 56, 76, 9, { cls: "ts-cast", owner: own });
  ANCH.VENTEO = G.add3(p2, [0, 0, 70]);
  void F;
}

/* ====================================================================
   9 · la vinaza: una boquilla en la cabeza, fuera del eje, que baja dentro del faldón y sale por él hacia el
   intercambiador que calienta la cerveza
   ==================================================================== */
{
  const own = "vinaza";
  const F = { o: [VI.x, VI.y, Z.tanCol], a: [0, 0, -1], u: XD, v: YD };
  const start = (t) => { const x = VI.x + VI.ro * Math.cos(t), y = VI.y + VI.ro * Math.sin(t); return hOut * Math.sqrt(Math.max(0, 1 - (x * x + y * y) / (Rco * Rco))); };
  const s1 = Z.tanCol - 3060;
  const sNeck = start(0);
  put("vinaza.cuello", [VI.x, VI.y, (Z.tanCol - sNeck + 3060) / 2], wrap(S(G.saddleOf(F, VI.ro, start, s1, P), { tone: "mid" }), "ts-ss"), [record(A.disc(F, sNeck - 12, s1, VI.ro, { name: "vinaza.cuello", owner: own, seated: true, cut: [...CABEZA, A.lathe(FV(0), [[Z.tanCol + 5, 0], [Z.tanCol + 5, Rco], ...Array.from({ length: 23 }, (_, i) => { const t = ((i + 1) / 24) * (PI / 2); return [Z.tanCol - hOut * Math.sin(t), Rco * Math.cos(t)]; }), [Z.tanCol - hOut, 0]], { name: "cabeza.adentro", piece: "frame", ride: "frame" })] }))]);
  const Fz = FV(VI.x, VI.y);
  disc("vinaza.brida-boca", Fz, 3060 - VI.bridaT, 3060, VI.bridaR, { cls: "ts-ss", owner: own });
  disc("vinaza.junta", Fz, 3060 - VI.bridaT - 3, 3060 - VI.bridaT, VI.bridaR - 25, { cls: "ts-gasket", owner: own });
  disc("vinaza.brida", Fz, 3060 - 2 * VI.bridaT - 3, 3060 - VI.bridaT - 3, VI.bridaR, { cls: "ts-ss", owner: own });
  const p0 = [VI.x, VI.y, 3060 - 2 * VI.bridaT - 3], c1 = [VI.x, VI.y, VI.z], p1 = [VI.x1, VI.y, VI.z];
  // el codo, de radio 1,5 D, a mano: así el tubo llega recto a la manga, y el trozo se corta en su cara
  const RBv = 1.5 * VI.ro, arcV = Array.from({ length: 11 }, (_, i) => { const t = (i / 10) * (PI / 2); return [VI.x - RBv + RBv * Math.cos(t), VI.y, VI.z + RBv - RBv * Math.sin(t)]; });
  const lineV = [p0, ...arcV, p1];
  const brk = (fn) => { let walked = 0; for (let i = 1; i < lineV.length; i++) { const a = fn(lineV[i - 1]), b = fn(lineV[i]); const L = G.len3(G.sub3(lineV[i], lineV[i - 1])); if (Math.sign(a) !== Math.sign(b)) return walked + (L * a) / (a - b); walked += L; } return null; };
  tubeItems("vinaza.tubo", lineV, VI.ro, { cls: "ts-ss", owner: own, spacing: 3, breaks: [brk((p) => p[0] - VS1), brk((p) => Math.hypot(p[0], p[1]) - RS1 - 40)] });
  void c1;
  void 0;
  disc("vinaza.brida-sale", { o: p1, a: XD, u: YD, v: ZD }, -VI.bridaT, 0, VI.bridaR, { cls: "ts-ss", owner: own });
  TS._vinSale = [VI.x1 - 20, VI.y, VI.z];
  ANCH.VINAZA = [(VI.x1 + vinXw) / 2 - 150, VI.y, VI.z + VI.ro];
  ANCH.VINAZA_BOCA = [VI.x + VI.ro, VI.y, 2900];
}

/* ====================================================================
   10 · las patas del rehervidor: dos atrás, cada una con su pedestal, su placa base y la oreja de la coraza que se
   apoya en ella. Las dos de adelante se van con el corte
   ==================================================================== */
const ZLUG = ZB + 1500;
{
  const own = "patas", PS = PT.pedestal, h = PT.lado / 2;
  for (const phi of PT.phi) {
    const rd = radial(phi), tg = tang(phi), c = [Xr + PT.r * rd[0], PT.r * rd[1]];
    const sqB = (w, z0, z1) => [[c[0] - w, c[1] - w, z0], [c[0] + w, c[1] + w, z1]];
    box(`pata${phi}.pedestal`, ...sqB(PS.lado / 2, 0, PS.alto), { cls: "ts-conc", owner: own, ground: true, r: 0, steps: 1 });
    box(`pata${phi}.base`, ...sqB(140, PS.alto, PS.alto + 20), { cls: "ts-paint", owner: own, r: 0, steps: 1, extra: Dots([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => at([c[0] + a * 110, c[1] + b * 110, PS.alto + 21])), { size: 1.1, tone: "mid" }) });
    box(`pata${phi}`, ...sqB(h, PS.alto + 20, ZLUG - 20), { cls: "ts-paint", owner: own, r: 0, steps: 1 });
    box(`pata${phi}.tapa`, ...sqB(h + 15, ZLUG - 20, ZLUG), { cls: "ts-paint", owner: own, r: 0, steps: 1 });
    // la oreja: placa de arriba y dos cartelas soldadas a la coraza
    const s0 = Rro - 1, s1 = PT.r + h + 20;
    const Fo = { o: [Xr, 0, 0], a: ZD, u: rd, v: tg };
    fp(`oreja${phi}`, Fo, [[s0, -130], [s1, -130], [s1, 130], [s0, 130]], ZLUG, ZLUG + 22, { cls: "ts-ss", owner: "rehervidor" });
    for (const w of [-95, 95]) {
      const Fg = { o: [Xr + w * tg[0], w * tg[1], 0], a: tg, u: rd, v: ZD };
      fp(`oreja${phi}.cartela${w > 0 ? 2 : 1}`, Fg, [[s0, ZLUG - 260], [s0, ZLUG], [PT.r - h - 25, ZLUG], [PT.r - h - 25, ZLUG - 60]], -6, 6, { cls: "ts-ss", owner: "rehervidor" });
    }
  }
  const c2 = [Xr + PT.r * Math.cos(PT.phi[0] * D2R), PT.r * Math.sin(PT.phi[0] * D2R)];
  ANCH.PATA = [c2[0] + h, c2[1] + h, 1000];
  ANCH.OREJA = [Xr + (PT.r + h) * Math.cos(PT.phi[0] * D2R), (PT.r + h) * Math.sin(PT.phi[0] * D2R), ZLUG + 22];
}

/* ====================================================================
   11 · las flechas: la circulación (azul), el vapor y el condensado (naranja); la cota de la cabeza estática y los
   niveles
   ==================================================================== */
function arrow(name, pts, { r = 3, head = 13, w = 5.5, cls = "ts-flujo", hcls = "ts-flecha", y = 4, bias = 0, two = false } = {}) {
  const P3 = pts.map(([x, z]) => [x, y, z]);
  const sc = P3.map(at), n = sc.length;
  // la forma: una cinta plana en su plano, tan ancha como la punta (así cubre lo que se dibuja)
  const hw = (w * 1.05) / KS, shapes = [];
  for (let i = 1; i < n; i++) {
    const [ax, az] = pts[i - 1], [bx, bz] = pts[i], L = Math.hypot(bx - ax, bz - az) || 1, nx = -(bz - az) / L, nz = (bx - ax) / L;
    shapes.push(A.prism(FY, [[ax + nx * hw, az + nz * hw], [bx + nx * hw, bz + nz * hw], [bx - nx * hw, bz - nz * hw], [ax - nx * hw, az - nz * hw]], y - 0.3, y, {}));
  }
  void r;
  const headAt = (pts2) => {
    const b = pts2[pts2.length - 1];
    let j = pts2.length - 2; while (j > 0 && Math.hypot(pts2[j][0] - b[0], pts2[j][1] - b[1]) < head) j--;
    const a = pts2[j], Lh = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / Lh, uy = (b[1] - a[1]) / Lh;
    const base = [b[0] - ux * head, b[1] - uy * head];
    return { j, base, tri: `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z` };
  };
  const hA = headAt(sc);
  let body = sc.slice(0, hA.j + 1);
  let tris = hA.tri;
  if (two) { const hB = headAt(sc.slice().reverse()); body = body.slice(n - 1 - hB.j); body[0] = hB.base; tris += hB.tri; }
  const d = body.map(([x, yy], i) => (i ? "L" : "M") + r10(x) + " " + r10(yy)).join("") + "L" + r10(hA.base[0]) + " " + r10(hA.base[1]);
  put(name, P3[Math.floor(n / 2)], `<path class="${cls}" d="${d}"/><path class="${hcls}" d="${tris}"/>`, shapes, { bias });
}
const arcPath = (c, r, a0, a1, n = 12) => arcXZ(c, r, a0, a1, n);
{
  // el sumidero baja a la boca del fondo
  arrow("flujo.sumidero", [[260, ZL - 280], [260, Z.tanCol - 120], [120, zHeadIn(120) + 210]]);
  // la línea de entrada: baja, da la vuelta y llega al rehervidor
  arrow("flujo.baja", [[0, ZN0 - 120], [0, ZE + EN.codo + 60]]);
  arrow("flujo.entrada", [...arcPath([EN.codo, ZE + EN.codo], EN.codo, 180, 270), [Xr - EN.codo, ZE], ...arcPath([Xr - EN.codo, ZE + EN.codo], EN.codo, 270, 360).slice(1), [Xr, Z.cabezaAbajo + 120]]);
  // por los tubos, hacia arriba
  for (const dx of [-330, 330]) arrow(`flujo.tubos${dx > 0 ? 2 : 1}`, [[Xr + dx, ZT1 + 260], [Xr + dx, ZT2 - 160]], { w: 7, head: 16, r: 4 });
  // el retorno: sube por el bonete, da la vuelta por el codo y entra a la columna
  const ce = [Xr - RE.codo, Z.bridaR1];
  arrow("flujo.retorno", [[Xr, Z.tanArriba - 60], [Xr, ce[1]], ...arcPath(ce, RE.codo, 0, 90).slice(1), [Rc - 80, ZR]], { w: 7, head: 16, r: 4 });
  // dentro de la columna: el vapor sube por los platos; el líquido del retorno cae al sumidero
  arrow("flujo.vapor-sube1", [[Rc - 260, ZR + 120], [Rc - 330, ZR + 380], [Rc - 360, Z.plato1 + 330]], { cls: "ts-flujo-v", hcls: "ts-flecha-v" });
  arrow("flujo.vapor-sube2", [[60, ZR + 380], [60, Z.plato2 + 380]], { cls: "ts-flujo-v", hcls: "ts-flecha-v" });
  arrow("flujo.cae", [[Rc - 140, ZR - Ri_ - 40], [Rc - 230, ZR - Ri_ - 360], [Rc - 270, ZL + 120]]);
  // el líquido por los platos y el sello
  arrow("flujo.plato1", [[Rc - 140, Z.plato1 + 190], [-XDC + 140, Z.plato1 + 190]], { w: 4.5, head: 10, r: 2.5 });
  arrow("flujo.plato2", [[-Rc + 140, Z.plato2 + 190], [XDC - 140, Z.plato2 + 190]], { w: 4.5, head: 10, r: 2.5 });
  arrow("flujo.bajante1", [[-Rc + 115, Z.plato1 - 120], [-Rc + 115, ZSP + 200]], { w: 4.5, head: 10, r: 2.5 });
  // la vinaza que sale, después de su brida
  const vs = TS._vinSale;
  arrow("flujo.vinaza", [[vs[0] - 40, vs[2]], [vs[0] - 330, vs[2]]], { y: vs[1] });
  // el vapor que llega de arriba y el condensado que sale de la trampa (naranja)
  const vt = TS._vaporTop;
  ANCH.FLUJO_TUBOS = [Xr + 330, 4, ZT1 + (ZT2 - ZT1) * 0.4];
}
// las flechas fuera del plano del corte (el vapor, el condensado): en su propia vertical o a lo largo de su línea
function arrow3(name, P3, { r = 3, head = 13, w = 5.5, cls = "ts-vapor", hcls = "ts-vapor-p" } = {}) {
  const sc = P3.map(at), n = sc.length;
  const b = sc[n - 1];
  let j = n - 2; while (j > 0 && Math.hypot(sc[j][0] - b[0], sc[j][1] - b[1]) < head) j--;
  const a = sc[j], Lh = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / Lh, uy = (b[1] - a[1]) / Lh;
  const base = [b[0] - ux * head, b[1] - uy * head];
  const d = sc.slice(0, j + 1).map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  put(name, P3[Math.floor(n / 2)], `<path class="${cls}" d="${d}"/><path class="${hcls}" d="M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z"/>`, [A.tube(P3, Math.max(r, (w * 1.05) / KS))]);
}
{
  const vt = TS._vaporTop;
  arrow3("flujo.vapor", [[vt[0], vt[1], vt[2] + 420], [vt[0], vt[1], vt[2] + 40]]);
  const cs = TS._condSale;
  arrow3("flujo.condensado", [G.add3(cs.p, G.mul3(cs.dir, 40)), G.add3(cs.p, G.mul3(cs.dir, 330))]);
}
// la cota de la cabeza estática: del nivel de la columna (a la altura del espejo de arriba) a la entrada de los tubos
const XCOTA = (Rco + Xr - RH.bridaR) / 2 + 60;
{
  const y = 6;
  const a = at([XCOTA, y, ZL]), b = at([XCOTA, y, ZB]);
  const hd = 11, w = 4.5;
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
  const tri = (p, s) => { const base = [p[0] + s * ux * hd, p[1] + s * uy * hd]; return `M${r10(p[0])} ${r10(p[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`; };
  const line = `M${r10(a[0] + ux * hd)} ${r10(a[1] + uy * hd)}L${r10(b[0] - ux * hd)} ${r10(b[1] - uy * hd)}`;
  // las guías: el nivel, de la pared de la columna al espejo de arriba; la entrada de los tubos, del espejo de abajo a la cota
  const g1 = pthO([at([Rco + 6, y, ZL]), at([Xr - RH.bridaR - 6, y, ZL])]);
  const g2 = pthO([at([XCOTA - 70, y, ZB]), at([Xr - RH.bridaR - 6, y, ZB])]);
  // el símbolo del nivel (un triángulo con la punta en la línea) junto a la columna
  const tv = at([Rco + 120, y, ZL]);
  const nivel = `M${r10(tv[0])} ${r10(tv[1])}L${r10(tv[0] - 6)} ${r10(tv[1] - 9)}L${r10(tv[0] + 6)} ${r10(tv[1] - 9)}Z`;
  const shapes = [A.tube([[XCOTA, y, ZB], [XCOTA, y, ZL]], 2), A.tube([[Rco + 6, y, ZL], [Xr - RH.bridaR - 6, y, ZL]], 1.5), A.tube([[XCOTA - 70, y, ZB], [Xr - RH.bridaR - 6, y, ZB]], 1.5)];
  put("cota", [XCOTA, y, (ZL + ZB) / 2], `<path class="ts-guia" d="${g1}${g2}"/><path class="ts-cota" d="${line}"/><path class="ts-cota-p" d="${tri(a, 1)}${tri(b, -1)}${nivel}"/>`, shapes, { bias: 30 });
  ANCH.COTA = [XCOTA, y, ZB + (ZL - ZB) * 0.55];
  ANCH.NIVEL_GUIA = [Rco + 260, y, ZL];
  ANCH.ENTRADA_GUIA = [XCOTA + 120, y, ZB];
}

/* ====================================================================
   12 · la persona de referencia: 1,75 m, de pie en el piso, junto a la trampa
   ==================================================================== */
{
  const PS = TS.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, 0], rumbo: PS.rumbo, mm: 1, adelante: "der" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.CABEZA;
}

/* ---------- orden y salida ---------- */
if (process.env.TS_SDF) {
  const [nm, ...xyz] = process.env.TS_SDF.split(","); const q = xyz.map(Number).map((v) => v * U);
  for (const it of R_.items.filter((i) => i.name === nm)) for (const sh of it.shapes) console.log(nm, sh.kind, "sdf", A.sdf(sh, q).toFixed(3), "cuts", (sh.cut || []).length, (sh.cut || []).map((c) => c.name + ":" + A.sdf(c, q).toFixed(2)).join(" "));
  process.exit(0);
}
if (process.env.TS_PROBE) {
  const [sx, sy, ...names] = process.env.TS_PROBE.split(",");
  const cam = A.cameraBasis(PA), kk = cam.k;
  for (const nm of names) {
    const it = R_.items.find((q) => q.name === nm);
    const base = G.add3(G.mul3(cam.R, (Number(sx) - cam.origin[0]) / kk), G.mul3(cam.D, (Number(sy) - cam.origin[1]) / kk));
    it.shapes.forEach((sh, si) => { let hit = null; for (let t = 1500; t > -1500; t -= 0.05) { const q = G.add3(base, G.mul3(cam.V, t)); if (A.sdf(sh, q) < 0) { hit = q; break; } } console.log(nm, si, sh.kind, hit ? hit.map((v) => (v / U).toFixed(0)).join(", ") + "  depth " + G.dot3(hit, cam.V).toFixed(2) : "no hit"); });
  }
  process.exit(0);
}
if (process.env.TS_ITEM) {
  for (const nm of process.env.TS_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1) + (f.at ? " @" + f.at.map((v) => v.toFixed(1)).join(",") : "")).join(" / "));
    }
  }
  process.exit(0);
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
const CONC = ["#E8E6E1", "#EFEDE9", ["#D2CFC8", "#D9D6D0", "#DFDDD7", "#E4E2DC"]];
const CAUC = ["#5D666E", "#6B747C", ["#3E464D", "#475057", "#505960", "#576067"]];
const CSS = `.ts-cut{${flat("#C9CED3")}}.ts-cs-cut{${flat("#C1C6CB")}}.ts-paint-cut{${flat("#C7CDD1")}}.ts-conc-cut{${flat("#D2CFC8")}}.ts-gasket-cut{${flat("#3E464D")}}
.ts-ss,.ts-bolt{${shades(...ACERO)}}.ts-cs,.ts-cast{${shades(...FUND)}}.ts-paint{${shades(...PINT)}}.ts-conc{${shades(...CONC)}}.ts-gasket{${shades(...CAUC)}}
.ts-liq{fill:#BCD0E6;fill-opacity:.45}.ts-liq-sup{fill:#BCD0E6;fill-opacity:.32}.ts-cond{fill:#BCD0E6;fill-opacity:.55}.ts-espuma{fill:#BCD0E6;fill-opacity:.24}
.ts-mez-0{fill:#BCD0E6;fill-opacity:.5}.ts-mez-1{fill:#BCD0E6;fill-opacity:.42}.ts-mez-2{fill:#BCD0E6;fill-opacity:.34}.ts-mez-3{fill:#BCD0E6;fill-opacity:.26}.ts-mez-4{fill:#BCD0E6;fill-opacity:.18}.ts-mez-5{fill:#BCD0E6;fill-opacity:.12}
.ts-burbuja{fill:#FFFFFF}.ts-gota{fill:#7FA3C9}.ts-onda{fill:none;stroke:#7FA3C9;stroke-width:.6px}
.ts-agujero{fill:#AEB8C2}.ts-liq-agujero{fill:#BCD0E6;fill-opacity:.45}.ts-mez-agujero{fill:#BCD0E6;fill-opacity:.15}.ts-boca-tubo{fill:#8A96A3}.ts-haz-fondo{fill:#AEB8C2}.ts-afuera{fill:#FFFFFF}
.ts-flujo,.ts-flujo-v{fill:none;stroke:#2E5E9E;stroke-width:1.8px;stroke-linecap:round;stroke-linejoin:round}.ts-flecha,.ts-flecha-v{fill:#2E5E9E;stroke:none}.ts-flujo-v{stroke-dasharray:0}
.ts-vapor{fill:none;stroke:#C2410C;stroke-width:1.8px;stroke-linecap:round;stroke-linejoin:round}.ts-vapor-p{fill:#C2410C;stroke:none}
.ts-cota{fill:none;stroke:#19222F;stroke-width:1.1px}.ts-cota-p{fill:#19222F;stroke:none}.ts-guia{fill:none;stroke:#525C64;stroke-width:.8px;stroke-dasharray:5 3}
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
const svg = k.figureSvg({ width: W_, height: H_, label: "Termosifón vertical y fondo de la columna", body: [`<style>${CSS}</style><g class="ts-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUTD, "fig.svg"), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Termosifón", theme: "light", width: W_, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, "fig_data.json"), JSON.stringify({ P, W: W_, H: H_, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, { crowd: [] });
