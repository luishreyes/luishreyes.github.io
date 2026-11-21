/* ====================================================================
   El tubo de retención de E-201 con su válvula de desvío, en isométrico (skill anatomy), para el capítulo 25 del libro
   de operaciones unitarias.
   Concepto: el jugo sale del calentamiento de E-201 a 95 °C y recorre 23,5 m de tubo sanitario de 2½ in en un
   serpentín de cuatro tramos y tres curvas de 180° que sube 2,1 cm por metro; cada tramo va fijo a su altura por
   abrazaderas sobre varillas de largo distinto, y la diferencia de largo es la pendiente. A la salida del tubo, el
   sensor del registrador-controlador (TT-204) y el termómetro de referencia (TI-204) en el mismo punto, y el
   presostato PSL-207; el tubo vuelve a E-201. Después del enfriamiento, la válvula de desvío de dos vástagos (la de
   desvío y la de detección de fugas), con su segundo sensor TT-205: cada vástago, un actuador neumático con resorte que
   la deja en desvío si falta el aire. Adelante, al llenado; el desviado y lo que se fugue bajan a TK-201 (la línea de
   detección, con su mirilla).
   Con --detalle, el círculo de la válvula de desvío cortada por el plano vertical de sus dos ejes, en desvío: los
   asientos, los tapones arriba, el jugo que baja por el asiento de abajo hacia la línea de desvío, la cámara de la
   detección de fugas vacía y abierta a su línea, los vástagos, los resortes y los pistones arriba, y el detector de
   posición en la cabeza de control.
   Uso: node build.mjs [--audit] [--fast] [--detalle]
   Unidades: 1 = 1 mm (el audit, en centímetros). Medidas en geo.mjs.
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
const { TR, LS, YR, ZS, ejeEn, tramos, zTramo } = GEO;
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const DET = process.argv.includes("--detalle");
const STEP = Number(process.env.TR_STEP || (DET ? 1.2 : 0.6));
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};
const RO = TR.DO / 2, RI = TR.DI / 2;
const FE = TR.ferr, FV = TR.fdv, E1 = TR.e201;
const xL = FV.xD + FV.sep;                     // el eje de la válvula de detección de fugas
const bL = FV.bD + (FV.puerto.arriba - FV.puerto.medio);   // su base: su puerto del medio a la altura del de arriba de la otra
const PORT = FV.rb + FV.puerto.largo;          // del eje a la cara de la férula de un puerto

/* ---------- la cámara ---------- */
const W_ = DET ? 360 : 1100, H_ = DET ? 360 : 760;
const EXT = [
  [E1.xF - E1.t - E1.pack - 90, E1.y0, 0], [E1.xF - E1.t - E1.pack - 160, E1.y1, E1.z1 + 60], [E1.xF, E1.y1, 0], [E1.xF, E1.y0, E1.z1 + 60],
  [LS + TR.Rc + 60, 40, 0], [LS + TR.Rc + 60, YR(3) - 200, 0], [LS + TR.Rc + 60, YR(3) - 60, ZS(TR.L) + 60], [0, YR(3) - 200, ZS(TR.L) + 300],
  [FV.xD - 120, FV.y + 60, 0], [xL + 650, FV.y + 60, 0], [xL, FV.y, bL + FV.ctrl.s1 + 60],
  [TR.persona.x - 300, TR.persona.y + 300, 0], [TR.persona.x + 300, TR.persona.y - 300, 0], [TR.persona.x, TR.persona.y, 1800],
];
const PMAIN = k.fitProjection(EXT, 1100, 760, { pad: 18, azimuth: TR.AZ, elevation: TR.EL });
const CDET = TR.det.c, MDET = TR.det.M, RDET = TR.det.R;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: TR.AZ, elevation: TR.EL }; const c = k.iso(CDET, Q); Q.origin = [W_ / 2 - c[0], H_ / 2 - c[1]]; return Q; })() : PMAIN;
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
const add = G.add3, mul = G.mul3, sub = G.sub3;

/* El dibujo va en milímetros; el audit, en centímetros (como la línea de vapor). */
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
  if (sh.kind === "ball") { out.o = sc(sh.o); out.r = sh.r * U; if (sh.flats) out.flats = sh.flats.map(([a, b, c, d]) => [a, b, c, d * U]); }
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
const faceSvg = (d, cls, tone = "mid", n = null, edge = true) => `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/>${n ? keyOfN(n).replace("D", d) : `<path class="iso-shade" data-shade="0" d="${d}"/>`}${edge ? `<path class="iso-line iso-edge" data-tone="${tone}" d="${d}"/>` : ""}</g>`;

/* ---------- piezas ---------- */
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "tr-ss", r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, ref, rec = true, seated, cut } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const sh = A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}), ...(seated ? { seated } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls) + extra, [sh]);
  return sh;
}
function fp(name, F, poly, s0, s1, { cls = "tr-ss", extra = "", cap = "auto", owner = name, ref = null, ground, rec = true, skip = null, seated, cut } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(ground ? { ground } : {}), ...(seated ? { seated } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || add(add(add(F.o, mul(F.a, (s0 + s1) / 2)), mul(F.u, cu)), mul(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", cls, cap, skip }) + extra, [sh]);
  return sh;
}
const ngon = (r, m, ph = 0) => Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m + ph; return [r * Math.cos(t), r * Math.sin(t)]; });
function disc(name, F, s0, s1, r, { cls = "tr-ss", extra = "", owner = name, n = 0, ground, rec = true, cap = "auto", ph = 0, ref, seated, cut } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const sh = A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(ground ? { ground } : {}), ...(seated ? { seated } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  put(name, ref || add(F.o, mul(F.a, (s0 + s1) / 2)), X.prismSvg(C, ngon(r, m, ph), Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap }) + extra, [sh]);
  return sh;
}
function turned(name, F, meridian, { cls = "tr-ss", extra = "", owner = name, steps, rec = true, ref, cut, rims, hole, inner = "", seated } = {}) {
  const paths = G.lathe(meridian, F, P, { ...(steps ? { steps } : {}), ...(rims ? { rims } : {}), ...(hole ? { hole } : {}) });
  const sh = A.lathe(F, meridian, { name, owner, ...(cut ? { cut } : {}), ...(seated ? { seated } : {}) });
  if (rec) record(sh);
  const s0 = Math.min(...meridian.map((q) => q[0])), s1 = Math.max(...meridian.map((q) => q[0]));
  put(name, ref || add(F.o, mul(F.a, (s0 + s1) / 2)), wrap(S(paths, { tone: "mid", inner }), cls) + extra, [sh]);
  return sh;
}
// un anillo (abrazadera, férula, banda) alrededor de un eje: de s0 a s1, de rIn a rOut
const ring = (name, F, s0, s1, rIn, rOut, opts = {}) => turned(name, F, [[s0, rIn], [s1, rIn], [s1, rOut], [s0, rOut]], opts);
// un racor (te o cruz): una esfera con el paso de cada tubo que la cruza o termina en ella
function ball(name, c, Rb, { owner = name, cls = "tr-ss", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([add(c, mul(b.dir, -(Rb + 0.6))), add(c, mul(b.dir, Rb + 0.6))], b.r + 0.03, { owner: b.owner }));
  const sh = record(A.ball(c, Rb, { name, owner, ...(cut.length ? { cut } : {}) }));
  put(name, c, wrap(S(G.sphereOf(c, Rb, P), { tone: "mid" }), cls), [sh]);
  return sh;
}
// un cilindro de radio a a lo largo de F.a que nace en otro cilindro de radio R perpendicular (un niple, un tocho)
function saddle(name, F, a, R, s1, { owner = name, cls = "tr-ss", host, extra = "" } = {}) {
  const low = Math.sqrt(R * R - a * a);
  const svg = S(G.saddleOf(F, a, R, s1, P), { tone: "mid" });
  const sh = record(A.disc(F, low - 0.05, s1, a, { name, owner, seated: true, cut: host ? [host] : [] }));
  put(name, add(F.o, mul(F.a, (low + s1) / 2)), wrap(svg, cls) + extra, [sh]);
  return sh;
}
const frameAlong = (o, a) => { const aa = G.unit3(a); const u0 = Math.abs(aa[2]) > 0.9 ? XD : ZD; const u = G.unit3(sub(u0, mul(aa, G.dot3(u0, aa)))); return { o, a: aa, u, v: G.cross3(aa, u) }; };

/* un tubo o una manguera: sus trozos ordenados por profundidad, con los huecos donde lo abraza algo */
function tubeItems(name, route, r, { tone = "mid", maxLength = 260, gaps = [], cls = "tr-ss", caps = true, breaks = [], ends = [true, true], touch, owner = name, limp } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, limp, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(tubeSvg(part, { tone }), cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
// el largo de una polilínea hasta su punto i
const largoHasta = (pts, i) => { let L = 0; for (let j = 1; j <= i; j++) L += G.len3(sub(pts[j], pts[j - 1])); return L; };
const largo = (pts) => largoHasta(pts, pts.length - 1);
// el punto más cercano de una polilínea a p: su largo
function largoEn(pts, p) {
  let best = Infinity, L = 0, at0 = 0;
  for (let j = 1; j < pts.length; j++) {
    const a = pts[j - 1], b = pts[j], ab = sub(b, a), l = G.len3(ab), t = Math.max(0, Math.min(1, G.dot3(sub(p, a), ab) / (l * l || 1)));
    const d = G.len3(sub(add(a, mul(ab, t)), p));
    if (d < best) { best = d; at0 = L + t * l; }
    L += l;
  }
  return at0;
}

/* ====================================================================
   el barrido (de la línea de vapor): una sección (s, r) que gira alrededor de un eje. Se pinta cara por cara, de atrás
   hacia adelante; cada arista se dibuja con la cara visible que va después. Lo usa el corte del detalle.
   ==================================================================== */
function sweepSvg({ F, profile, a0, a1, steps = 0, smooth = [], skip = [], capA = "end", capB = "end", cls = "tr-ss", cutCls = "tr-cut", tone = "mid", noEdge = [] }) {
  const m = profile.length;
  const n = steps || Math.max(2, Math.ceil(Math.abs(a1 - a0) / (5 * D2R)));
  const pt = (phi, s, r) => add(add(F.o, mul(F.a, s)), add(mul(F.u, r * Math.cos(phi)), mul(F.v, r * Math.sin(phi))));
  const phis = Array.from({ length: n + 1 }, (_, i) => a0 + ((a1 - a0) * i) / n);
  const Pg = phis.map((phi) => profile.map(([s, r]) => pt(phi, s, r)));
  const sc = profile.reduce((q, p) => q + p[0], 0) / m, rc = profile.reduce((q, p) => q + p[1], 0) / m;
  const faces = [];
  const fid = (i, j) => i * m + j;
  let area2 = 0; for (let j = 0; j < m; j++) { const [s1, r1] = profile[j], [s2, r2] = profile[(j + 1) % m]; area2 += s1 * r2 - s2 * r1; }
  const wind = area2 > 0 ? 1 : -1;
  const hand = G.dot3(G.cross3(F.u, F.v), F.a) > 0 ? 1 : -1;
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    if (skip.includes(j)) { faces.push(null); continue; }
    const j2 = (j + 1) % m, q = [Pg[i][j], Pg[i + 1][j], Pg[i + 1][j2], Pg[i][j2]];
    const cen = q.reduce((a, b) => add(a, b), [0, 0, 0]).map((v) => v / 4);
    const pm = (phis[i] + phis[i + 1]) / 2;
    const ds = profile[j2][0] - profile[j][0], dr = profile[j2][1] - profile[j][1];
    if (Math.hypot(ds, dr) < 1e-9 || (profile[j][1] < 1e-9 && profile[j2][1] < 1e-9)) { faces.push(null); continue; }
    const ns = wind * dr, nr = -wind * ds;
    const er4 = add(mul(F.u, Math.cos(pm)), mul(F.v, Math.sin(pm)));
    let nn = add(mul(F.a, ns), mul(er4, nr));
    if (G.len3(nn) < 1e-9) { faces.push(null); continue; }
    nn = G.unit3(nn);
    faces.push({ i, j, q, n: nn, vis: G.dot3(nn, V3) > 1e-6, d: G.dot3(cen, V3) });
  }
  void hand;
  const capOf = (i, mode, sign) => {
    if (mode === "none") return null;
    const pts = Pg[i], cen = pts.reduce((a, b) => add(a, b), [0, 0, 0]).map((v) => v / m);
    const t = sub(pt(phis[i] + sign * 1e-3, sc, rc), pt(phis[i], sc, rc));
    const nn = G.unit3(t);
    return { cap: true, i, pts, n: nn, vis: G.dot3(nn, V3) > 1e-6, d: G.dot3(cen, V3), mode };
  };
  const cA = capOf(0, capA, -Math.sign(a1 - a0)), cB = capOf(n, capB, Math.sign(a1 - a0));
  const vis = (f) => !!(f && f.vis);
  const order = faces.filter(vis).sort((p, q) => p.d - q.d);
  const capsV = [cA, cB].filter((c) => c && c.vis);
  const paint = [...order, ...capsV].sort((p, q) => p.d - q.d);
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
      if (!c) { if (vis(f)) edges.get(f).push(e); continue; }
      if (vis(c)) edges.get(c).push(e);
      else if (vis(f)) edges.get(f).push(e);
      continue;
    }
    const fa = faces[fid(i - 1, j)], fb = faces[fid(i, j)];
    if (vis(fa) !== vis(fb)) edges.get(later(fa, fb)).push(e);
  }
  const out = [];
  const keyOf = (f) => (f.cap && f.mode === "cut" ? `<path class="iso-shade" data-shade="0" d="D"/>` : keyOfN(f.n));
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
const BIG = 20000;
const halfSpaceAt = (n, o) => { n = G.unit3(n); const p = G.unit3(Math.abs(n[2]) < 0.9 ? G.cross3(ZD, n) : G.cross3(XD, n)); return A.orientedBox(add(o, mul(n, BIG)), [n, p, G.cross3(n, p)], [BIG, BIG, BIG], { name: "corte" }); };
const wedgeCutsF = (F, a0, a1) => { const p0 = a0 * D2R, p1 = a1 * D2R; return [halfSpaceAt(sub(mul(F.u, Math.sin(p0)), mul(F.v, Math.cos(p0))), F.o), halfSpaceAt(add(mul(F.u, -Math.sin(p1)), mul(F.v, Math.cos(p1))), F.o)]; };
/* una pieza de revolución en sectores de ángulo [[a0, a1], …] (grados, de F.u hacia F.v); prof: polígono en (s, r).
   caps(a0, a1) dice qué va en los extremos del sector: «cut» (la cara del corte), «none» o «end». */
function revX(name, prof, { F, cls = "tr-ss", cutCls = "tr-cut", owner = name, sectors = [[0, 360]], skip = [], smooth = [], rec = true, ref = null, extras = null, caps = null, noEdge = [], shape = true, whole = false, steps: st = 0 } = {}) {
  const sc0 = prof.reduce((q, p) => q + p[0], 0) / prof.length, rmax = Math.max(...prof.map((q) => q[1]));
  const out = [];
  for (const [a0, a1] of sectors) {
    const steps = st || Math.max(3, Math.round((a1 - a0) / 5));
    const cp = caps ? caps(a0, a1) : ["none", "none"];
    const svg = sweepSvg({ F, profile: prof, a0: a0 * D2R, a1: a1 * D2R, cls, cutCls, capA: cp[0], capB: cp[1], skip, smooth, steps, noEdge }) + (extras ? extras(a0, a1) : "");
    const full = whole || a1 - a0 >= 360 - 1e-6;
    const nm = sectors.length > 1 ? `${name}.${Math.round(a0)}` : name;
    const sh = A.lathe(F, prof.map(([a, b]) => [a, b]), { name: nm, owner, ...(full ? {} : { cut: wedgeCutsF(F, a0, a1) }) });
    if (rec && shape) record(sh);
    const am = (full ? 30 : (a0 + a1) / 2) * D2R, rr = ref ?? rmax * 0.9;
    put(nm, G.pointOf(F, sc0, rr, am), svg, shape ? [sh] : []);
    out.push(sh);
  }
  return out;
}

/* ====================================================================
   1 · E-201, simplificado: la placa fija con sus patas y sus boquillas, el paquete de placas, la placa de presión, la
   barra portadora arriba, la guía abajo y los tornillos tensores
   ==================================================================== */
const XJ = E1.xF + E1.noz;                     // la junta de cada boquilla (la cara de su férula)
const XPIPE = XJ + FE.w;                       // donde empieza el tubo, después de la férula de la línea
const FX = (o) => ({ o, a: XD, u: YD, v: ZD });
// una unión de abrazadera: las dos férulas cara a cara en s (cada una de FE.w) y la abrazadera que las aprieta, en una
// sola pieza; con cut, la mitad de atrás y su cara del corte
const UNI = (s, r0 = RI) => { const h = RO + 1.6, c = FE.clamp.w / 2; return [[s - FE.w, r0], [s - FE.w, h], [s - c, h], [s - c, FE.clamp.r], [s + c, FE.clamp.r], [s + c, h], [s + FE.w, h], [s + FE.w, r0]]; };
// en la vista entera la unión se ve llena (sus caras las tapan los tubos) y se registra llena, como las bridas de las
// otras figuras; boca: el lado (+1 o −1) donde la línea sigue fuera de la figura, con el agujero dibujado en su cara
function union(name, F, s, { owner = name, cls = "tr-ss", cut = false, boca = 0 } = {}) {
  if (cut) return revX(name, UNI(s), { F, owner, sectors: [[180, 360]], caps: () => ["cut", "cut"], cls });
  let extra = "";
  if (boca && G.dot3(mul(F.a, boca), V3) > 0.05) {
    const sf = s + boca * FE.w, pts = Array.from({ length: 40 }, (_, i) => pr(G.pointOf(F, sf, RI, (TAU * i) / 40)));
    extra = `<path class="tr-bore" d="${pth1(pts)}"/>`;
  }
  return turned(name, F, UNI(s, 0), { owner, cls, extra });
}
if (!DET) {
  const own = "e201", xb = E1.xF - E1.t, yc = (E1.y0 + E1.y1) / 2;
  // la placa fija y sus patas
  box("e201.placa-fija", [xb, E1.y0, E1.z0], [E1.xF, E1.y1, E1.z1], { cls: "tr-paint", owner: own, r: 6, steps: 3 });
  for (const yy of [E1.y0 + 60, E1.y1 - 60]) box(`e201.pata${yy > 0 ? 2 : 1}`, [xb - 60, yy - 50, 0], [E1.xF + 10, yy + 50, E1.z0], { cls: "tr-paint", owner: own, ground: true, r: 2 });
  // el paquete de placas (sus bordes, uno cada 16 mm en la cara de adelante y en la de arriba) y la placa de presión
  const x0p = xb - E1.pack, py0 = E1.y0 + E1.padY, py1 = E1.y1 - E1.padY, pz0 = E1.z0 + E1.padZ, pz1 = E1.z1 - E1.padZ;
  let lines = "";
  for (let x = x0p + 16; x < xb - 4; x += 16) lines += pthO([at([x, py1, pz0]), at([x, py1, pz1]), at([x, py0, pz1])]);
  box("e201.placas", [x0p, py0, pz0], [xb, py1, pz1], { cls: "tr-plate", owner: own, r: 2, inner: Ln(lines, { tone: "faint" }) });
  const xpp = x0p - 70;
  box("e201.placa-presion", [xpp, E1.y0 + 20, pz0], [x0p, E1.y1 - 20, pz1], { cls: "tr-paint", owner: own, r: 5, steps: 3 });
  // la barra portadora y la guía: sobre las placas y bajo ellas, de la placa fija hacia atrás, cortadas
  const yb = yc, xbar = xpp - 160;
  box("e201.barra", [xbar, yb - 30, pz1 + 2], [xb, yb + 30, pz1 + 62], { cls: "tr-paint", owner: own, r: 2 });
  box("e201.guia", [xbar, yb - 22, pz0 - 46], [xb, yb + 22, pz0 - 2], { cls: "tr-paint", owner: own, r: 2 });
  // los tornillos tensores, a los dos lados del paquete, con sus tuercas en la placa fija y en la de presión
  for (const yy of [E1.y0 + 25, E1.y1 - 25]) for (const zz of [E1.z0 + 260, (E1.z0 + E1.z1) / 2, E1.z1 - 260]) {
    const F = FX([0, yy, zz]), nm = `e201.tornillo${yy > 0 ? "d" : "i"}${Math.round(zz)}`;
    disc(`${nm}.punta`, F, xpp - 40, xpp - 22, 12, { cls: "tr-ss", owner: own });
    disc(nm, F, x0p, xb, 12, { cls: "tr-ss", owner: own });
    disc(`${nm}.punta2`, F, E1.xF + 22, E1.xF + 34, 12, { cls: "tr-ss", owner: own });
    disc(`${nm}.tuerca`, F, E1.xF, E1.xF + 22, 21, { cls: "tr-ss", owner: own, n: 6, ph: PI / 6 });
    disc(`${nm}.tuerca2`, F, xpp - 22, xpp, 21, { cls: "tr-ss", owner: own, n: 6, ph: PI / 6 });
  }
  // las boquillas: el niple y la unión con la línea
  for (const [key, [yy, zz]] of Object.entries(TR.noz)) {
    const F = FX([0, yy, zz]);
    disc(`e201.boquilla${key}`, F, E1.xF, XJ - FE.w, RO, { owner: own, cls: "tr-ss" });
    union(`e201.union${key}`, F, XJ, { owner: own });
  }
  // el colector del aire de los actuadores, en la cara de la placa fija
  box("aire.colector", [E1.xF, 130, 1480], [E1.xF + 46, 260, 1620], { cls: "tr-cast", owner: own, r: 3 });
  ANCH.E201 = [xb - E1.pack / 2, py1, pz1 - 120];
  ANCH.E201_PLACA = [E1.xF, E1.y1 - 80, E1.z1 - 220];
  ANCH.BOQ_A = [XJ, 0, 1000 + FE.clamp.r];
  ANCH.BOQ_B = [XJ, -520, 1000 + FE.clamp.r];
  ANCH.BOQ_C = [XJ, 250, 600 + FE.clamp.r];
}

/* ====================================================================
   2 · la línea del jugo caliente: de la boquilla A (la salida del calentamiento) al tubo, el serpentín, la salida con
   sus instrumentos y la vuelta a la boquilla B (la entrada del regenerador, del lado pasteurizado)
   ==================================================================== */
// el serpentín, punto a punto (las curvas, en 28 pasos)
const SERP = [];
const MARK = {};                                     // puntos que hace falta ubicar en la ruta
{
  const T = tramos();
  for (const t of T) {
    if (t.tipo === "tramo") {
      const xs = TR.est.x.slice().sort((a, b) => (t.i % 2 === 0 ? a - b : b - a));
      SERP.push(ejeEn(t.s0));
      for (const xx of xs) { const q = t.i % 2 === 0 ? xx : LS - xx; const p = ejeEn(t.s0 + q); SERP.push(p); MARK[`c${t.i}.${xx}`] = p; }
      // un punto cada 900 mm, para que los trozos queden parejos
    } else {
      for (let j = 0; j <= 28; j++) SERP.push(ejeEn(t.s0 + ((t.s1 - t.s0) * j) / 28));
    }
  }
  SERP.push(ejeEn(TR.L));
}
const S_TUBO = SERP.filter((p, i) => i === 0 || G.len3(sub(p, SERP[i - 1])) > 1e-6);
const zSal = ZS(TR.L), xT = TR.sal.xT, xP = TR.sal.xP, xC = TR.sal.xC;
const zAt = (x) => zSal + TR.sube * -x;           // la salida sigue subiendo hasta el codo
const RE = 1.5 * TR.DO, RBALL = 44;                            // SUPUESTO: los codos sanitarios, con su eje a 1,5 diámetros
const yB = TR.noz.B[0];
let LINEA = null;
if (!DET) {
  const own = "linea";
  const entrada = [[XPIPE, 0, TR.noz.A[1]], [0, 0, TR.z0]];
  const salida0 = [[0, YR(3), zSal], [xC, YR(3), zAt(xC)], [xC, yB, zAt(xC)], [xC, yB, TR.noz.B[1]], [XPIPE, yB, TR.noz.B[1]]];
  const salida = G.fillet(salida0, RE, 12, { P, tube: RO });
  const ruta = [...entrada, ...S_TUBO.slice(1), ...salida.slice(1)];
  LINEA = ruta;
  const gaps = [];
  const pS0 = [0, 0, TR.z0], pSL = [0, YR(3), zSal];
  const L0 = largoEn(ruta, pS0), L1 = largoEn(ruta, pSL);
  // las uniones de la entrada y de la salida del tubo
  gaps.push([L0 - FE.w, L0 + FE.w], [L1 - FE.w, L1 + FE.w]);
  // las abrazaderas del soporte
  for (const [key, p] of Object.entries(MARK)) { const Lm = largoEn(ruta, p); gaps.push([Lm - TR.abraz.w / 2, Lm + TR.abraz.w / 2]); MARK[key] = { p, L: Lm }; }
  // la cruz de TT-204 y TI-204
  const pT = [xT, YR(3), zAt(xT)], LT = largoEn(ruta, pT), hb = Math.sqrt(RBALL * RBALL - RO * RO) - 0.5;
  const LP = largoEn(ruta, [xP, YR(3), zAt(xP)]);
  gaps.push([LT - hb, LT + hb], [LP - hb, LP + hb]);
  gaps.sort((a, b) => a[0] - b[0]);
  tubeItems("linea", ruta, RO, { owner: own, gaps, cls: "tr-ss", maxLength: 300 });
  // las uniones
  const dirIn = G.unit3([1, 0, TR.sube]);
  union("union-entrada", frameAlong(pS0, dirIn), 0, { owner: own });
  const dirOut = G.unit3([-1, 0, TR.sube]);
  union("union-salida", frameAlong(pSL, dirOut), 0, { owner: own });
  // la cruz de TT-204 (arriba) y TI-204 (de lado, hacia el lector), en el mismo punto
  ball("tt204.cruz", pT, RBALL, { owner: own, bores: [{ dir: dirOut, r: RO, owner: own }] });
  const zt = pT[2];
  {
    const Fu = { o: pT, a: ZD, u: XD, v: YD };
    disc("tt204.cuello", Fu, RBALL - 6, RBALL + 30, 19, { owner: own });
    ring("tt204.ferula", Fu, RBALL + 30, RBALL + 42, 10, 25, { owner: own });
    disc("tt204.vaina", Fu, RBALL + 42, RBALL + 88, 9, { owner: own });
    turned("tt204.cabeza", Fu, [[RBALL + 88, 0], [RBALL + 88, 36], [RBALL + 132, 36], [RBALL + 140, 30, 1], [RBALL + 144, 20, 1], [RBALL + 146, 0]], { owner: own, cls: "tr-cast" });
    const Fg = { o: add(pT, [0, 0, RBALL + 110]), a: XD, u: YD, v: ZD };
    disc("tt204.prensaestopa", Fg, 34, 50, 9, { owner: own, cls: "tr-cast", n: 6 });
    const Fy = { o: pT, a: YD, u: XD, v: ZD };
    disc("ti204.cuello", Fy, RBALL - 6, RBALL + 26, 19, { owner: own });
    ring("ti204.ferula", Fy, RBALL + 26, RBALL + 38, 10, 25, { owner: own });
    disc("ti204.vaina", Fy, RBALL + 38, RBALL + 70, 9, { owner: own });
    turned("ti204.cuerpo", Fy, [[RBALL + 70, 0], [RBALL + 70, 46], [RBALL + 104, 46], [RBALL + 108, 42, 1], [RBALL + 110, 0]], { owner: own, cls: "tr-cast" });
    // la pantalla del termómetro digital de referencia, en su cara de adelante
    const fc = RBALL + 110.2, scr = [[-26, -10], [26, -10], [26, 12], [-26, 12]].map(([u, v]) => pr(add(pT, [u, fc, v])));
    put("ti204.pantalla", add(pT, [0, fc + 0.5, 0]), `<path class="tr-disp" d="${pth1(scr)}"/>`, [A.prism({ o: add(pT, [0, fc, 0]), a: YD, u: XD, v: ZD }, [[-26, -10], [26, -10], [26, 12], [-26, 12]], 0, 0.4, { name: "ti204.pantalla", owner: own })]);
    void zt;
  }
  // PSL-207: una te con su rama arriba, el sello de diafragma y el presostato
  {
    const pP = [xP, YR(3), zAt(xP)], Fu = { o: pP, a: ZD, u: XD, v: YD };
    ball("psl207.te", pP, RBALL, { owner: own, bores: [{ dir: dirOut, r: RO, owner: own }] });
    disc("psl207.cuello", Fu, RBALL - 6, RBALL + 22, 19, { owner: own });
    ring("psl207.ferula", Fu, RBALL + 22, RBALL + 34, 10, 25, { owner: own });
    disc("psl207.sello", Fu, RBALL + 34, RBALL + 52, 32, { owner: own });
    box("psl207.caja", [xP - 34, YR(3) - 34, pP[2] + RBALL + 52], [xP + 34, YR(3) + 34, pP[2] + RBALL + 126], { owner: own, cls: "tr-cast", r: 6, steps: 3 });
    const Fg = { o: [xP, YR(3) + 34, pP[2] + RBALL + 100], a: YD, u: XD, v: ZD };
    disc("psl207.prensaestopa", Fg, 0, 14, 9, { owner: own, cls: "tr-cast", n: 6 });
    ANCH.PSL = [xP + 34, YR(3) + 34, pP[2] + RBALL + 110];
  }
  ANCH.TT204 = [xT + 36, YR(3), zt + RBALL + 120];
  ANCH.TI204 = [xT + 30, YR(3) + RBALL + 110, zt + 30];
  ANCH.ENTRADA = [-120, 0, TR.z0 + RO];
  ANCH.SALIDA = [0, YR(3), zSal + FE.clamp.r];
  ANCH.VUELTA = [xC, (YR(3) + yB) / 2 + 60, zAt(xC) - 120];
  ANCH.TUBO = [LS * 0.62, 0, zTramo(0, LS * 0.62) + RO];
  ANCH.CURVA = [LS + TR.Rc + RO, YR(0) - TR.Rc, ZS(LS + PI * TR.Rc / 2)];
  ANCH.TRAMO4 = [LS * 0.45, YR(3), zTramo(3, LS * 0.45) + RO];
  ANCH.TRAMO2 = [LS * 0.30, YR(1), zTramo(1, LS * 0.30) + RO];
}

/* ====================================================================
   3 · el soporte: por marco, dos patas niveladoras, dos postes de tubo cuadrado, el travesaño y, por tramo, la varilla,
   la oreja y la abrazadera de bisagra (con su tornillo arriba); largueros que unen los marcos
   ==================================================================== */
if (!DET) {
  const own = "soporte", ES = TR.est, h = ES.leg / 2, AB = TR.abraz, F0 = ES.foot;
  const ROA = RO + AB.t;
  const zTop = F0.h + F0.hs;
  ES.x.forEach((xs, iS) => {
    const z1 = zTramo(0, xs);
    const zcb = z1 - ROA - AB.oreja - ES.min;            // la cara de arriba del travesaño
    for (const [yy, lado] of [[ES.yF, "f"], [ES.yB, "b"]]) {
      const Fz = { o: [xs, yy, 0], a: ZD, u: XD, v: YD };
      disc(`soporte${iS}.pie-${lado}`, Fz, 0, F0.h, F0.r, { owner: own, cls: "tr-rubber", ground: true });
      disc(`soporte${iS}.rosca-${lado}`, Fz, F0.h, zTop, F0.stem, { owner: own });
      box(`soporte${iS}.poste-${lado}`, [xs - h, yy - h, zTop], [xs + h, yy + h, zcb - ES.leg], { owner: own, r: 2 });
    }
    box(`soporte${iS}.travesano`, [xs - h, ES.yB - h, zcb - ES.leg], [xs + h, ES.yF + h, zcb], { owner: own, r: 2 });
    for (let i = 0; i < 4; i++) {
      const p = MARK[`c${i}.${xs}`].p, zt = p[2], yy = p[1];
      const Fz = { o: [xs, yy, 0], a: ZD, u: XD, v: YD };
      disc(`soporte${iS}.varilla${i}`, Fz, zcb, zt - ROA - AB.oreja, ES.rod, { owner: own });
      box(`soporte${iS}.oreja${i}`, [xs - 9, yy - 11, zt - ROA - AB.oreja], [xs + 9, yy + 11, zt - ROA + 1.5], { owner: "linea", r: 1 });
      const dir = G.unit3([i % 2 === 0 ? 1 : -1, 0, TR.sube]);
      ring(`soporte${iS}.abrazadera${i}`, frameAlong(p, dir), -AB.w / 2, AB.w / 2, RO, ROA, { owner: "linea" });
      // las dos orejas del cierre y su tornillo, arriba
      box(`soporte${iS}.cierre${i}`, [xs - 9, yy - 8, zt + ROA - 1.5], [xs + 9, yy + 8, zt + ROA + 12], { owner: "linea", r: 1 });
      disc(`soporte${iS}.tornillo${i}`, { o: [xs, yy, zt + ROA + 6], a: YD, u: XD, v: ZD }, -14, 14, 3.5, { owner: "linea" });
      if (iS === 0) ANCH[`VARILLA${i}`] = [xs, yy, (zcb + zt - ROA - AB.oreja) / 2];
    }
    if (iS < ES.x.length - 1) {
      const xn = ES.x[iS + 1];
      for (const yy of [ES.yF, ES.yB]) box(`soporte${iS}.larguero-${yy > 0 ? "f" : "b"}`, [xs + h, yy - h, ES.zStr - h], [xn - h, yy + h, ES.zStr + h], { owner: own, r: 2 });
    }
    if (iS === 0) { ANCH.TRAVESANO = [xs, ES.yF - 120, zcb - ES.leg / 2]; ANCH.POSTE = [xs + h, ES.yF + h, 520]; ANCH.PIE = [xs + F0.r, ES.yF, F0.h]; }
  });
  ANCH.ABRAZADERA = add(MARK[`c0.${ES.x[1]}`].p, [0, ROA, 4]);
  ANCH.VARILLA = [ES.x[1], 0, zTramo(0, ES.x[1]) - 70];
}

/* ====================================================================
   4 · la válvula de desvío de dos vástagos: la de desvío (eje xD) y la de detección de fugas (eje xL), iguales; cada
   una con tres cámaras (abajo, el medio con la entrada, arriba con la salida adelante), dos asientos y un tapón entre
   ellos; el bonete, la linterna con el vástago, el actuador neumático (resorte abajo, aire arriba) y la cabeza de
   control. En la vista entera va entera; en el detalle, cortada por el plano y = FV.y (se quita la mitad del lector).
   ==================================================================== */
const FVz = (xa, b) => ({ o: [xa, FV.y, b], a: ZD, u: XD, v: YD });
const BACK = [[180, 360]];
const capsCut = () => ["cut", "cut"];
function cuerpo(nm, xa, b, { cut }) {
  const own = "fdv", F = FVz(xa, b), rb = FV.rb, rbi = FV.rbi, CA = FV.camara, AS = FV.asiento;
  const piece = (name, prof, opts = {}) => (cut ? revX(name, prof, { F, owner: own, sectors: BACK, caps: capsCut, ...opts }) : turned(name, F, prof, { owner: own, ...(opts.cls ? { cls: opts.cls } : {}) }));
  // por fuera: un solo cuerpo, del fondo al bonete, con las dos abrazaderas de los asientos
  const ext = [[-12, 0], [-12, rb], [AS.s[0][0] - 6, rb], [AS.s[0][0] - 6, rb + 7], [AS.s[0][1] + 6, rb + 7], [AS.s[0][1] + 6, rb],
    [AS.s[1][0] - 6, rb], [AS.s[1][0] - 6, rb + 7], [AS.s[1][1] + 6, rb + 7], [AS.s[1][1] + 6, rb], [FV.bonete[1], rb], [FV.bonete[1], 0]];
  if (!cut) {
    const sh = turned(`${nm}.cuerpo`, F, ext, { owner: own, inner: Ln(G.arcOf(F, FV.bonete[0], rb, P), { tone: "faint" }) });
    return { F, host: sh };
  }
  // el fondo con el puerto de abajo
  piece(`${nm}.fondo`, [[-12, RI], [0, RI], [0, rb], [-12, rb]]);
  {
    const shell = (name, s0, s1, port, lado) => {
      // lado: 180 (el puerto va hacia −x) o 0 (hacia +x); la cara del corte de ese lado se parte en el hueco
      const p0 = port - RI, p1 = port + RI;
      const pieces = port === null ? [[s0, s1, "cut", "cut"]] : lado === 180 ? [[s0, p0, "cut", "cut"], [p0, p1, "none", "cut"], [p1, s1, "cut", "cut"]] : [[s0, p0, "cut", "cut"], [p0, p1, "cut", "none"], [p1, s1, "cut", "cut"]];
      pieces.forEach(([a, c, k0, k1], j) => revX(`${name}.${j}`, [[a, rbi], [c, rbi], [c, rb], [a, rb]], { F, owner: own, sectors: BACK, caps: () => [k0, k1], cls: "tr-in" }));
      if (port !== null) {
        // el hueco del puerto en la pared de atrás: la curva donde el agujero corta el cilindro de adentro
        const sg = lado === 180 ? -1 : 1, pts = [];
        for (let i = 0; i <= 24; i++) { const t = (PI * i) / 24, yy = -RI * Math.sin(t), zz = port + RI * Math.cos(t); pts.push([xa + sg * Math.sqrt(rbi * rbi - yy * yy), FV.y + yy, b + zz]); }
        const d = pth1(pts.map(pr));
        const sh = A.prism({ o: [xa + sg * (rbi - 6), FV.y, b + port], a: XD, u: YD, v: ZD }, [[-RI, -RI], [0, -RI], [0, RI], [-RI, RI]], -0.2, 0.2, { name: `${name}.hueco`, owner: own });
        put(`${name}.hueco`, [xa + sg * rbi * 0.9, FV.y - RI * 0.6, b + port], `<path class="tr-bore" d="${d}"/>`, [sh], { bias: 0.02 });
      }
    };
    shell(`${nm}.camara-abajo`, CA.abajo[0], CA.abajo[1], null);
    shell(`${nm}.camara-medio`, CA.medio[0], CA.medio[1], FV.puerto.medio, 180);
    shell(`${nm}.camara-arriba`, CA.arriba[0], CA.arriba[1], FV.puerto.arriba, 0);
  }
  // los asientos (anillos entre las cámaras) y las abrazaderas que los aprietan
  AS.s.forEach(([s0, s1], i) => {
    piece(`${nm}.asiento${i + 1}`, [[s0, AS.r], [s1, AS.r], [s1, AS.ro], [s0, AS.ro]]);
    piece(`${nm}.abrazadera${i + 1}`, [[s0 - 6, rb], [s1 + 6, rb], [s1 + 6, rb + 7], [s0 - 6, rb + 7]]);
  });
  // el bonete
  piece(`${nm}.bonete`, [[FV.bonete[0], FV.vastago + 0.5], [FV.bonete[1], FV.vastago + 0.5], [FV.bonete[1], rb], [FV.bonete[0], rb]]);
  return { F, host: null };
}
function puertos(nm, xa, b, { cut, host }) {
  // los niples de los puertos: el del medio hacia −x, el de arriba hacia +x, el de abajo hacia −z, con sus férulas
  const own = "fdv", out = {};
  for (const [key, s, sg] of [["medio", FV.puerto.medio, -1], ["arriba", FV.puerto.arriba, 1]]) {
    const o = [xa, FV.y, b + s], F = { o, a: [sg, 0, 0], u: ZD, v: YD };
    if (!cut) saddle(`${nm}.puerto-${key}`, F, RO, FV.rb, PORT - FE.w, { owner: own, host });
    else revX(`${nm}.puerto-${key}`, [[FV.rbi, RI], [PORT - FE.w, RI], [PORT - FE.w, RO], [FV.rbi, RO]], { F, owner: own, sectors: BACK, caps: capsCut, cls: "tr-in", skip: [3] });
    out[key] = add(o, [sg * PORT, 0, 0]);
  }
  const Fd = { o: [xa, FV.y, b], a: [0, 0, -1], u: XD, v: YD };
  if (!cut) disc(`${nm}.puerto-abajo`, Fd, 12, 12 + FV.abajo.stub, RO, { owner: own });
  else revX(`${nm}.puerto-abajo`, [[12, RI], [12 + FV.abajo.stub, RI], [12 + FV.abajo.stub, RO], [12, RO]], { F: Fd, owner: own, sectors: BACK, caps: capsCut, cls: "tr-in" });
  out.abajo = [xa, FV.y, b - 12 - FV.abajo.stub - FE.w];
  return out;
}
function arriba(nm, xa, b, { cut }) {
  // la linterna con el vástago, el actuador y la cabeza de control
  const own = "fdv", F = FVz(xa, b), AC = FV.act, CT = FV.ctrl, LI = FV.linterna;
  const zPis = cut ? AC.pDesvio : AC.pDesvio;
  // la linterna: dos postes, a los lados del vástago tal como se ve
  const angV = Math.atan2(V3[1], V3[0]) / D2R;
  for (const [j, ang] of [[1, angV + 90], [2, angV - 90]]) {
    const a = ((ang % 360) + 360) % 360;
    if (cut && !(a > 180 && a < 360)) continue;
    const c = G.pointOf(F, 0, 40, a * D2R);
    disc(`${nm}.linterna${j}`, { o: c, a: ZD, u: XD, v: YD }, LI[0], LI[1], 7, { owner: own });
  }
  // el vástago: del tapón a la cabeza de control (entero también en el corte)
  disc(`${nm}.vastago`, F, cut ? FV.tapon.arriba : LI[0], cut ? CT.s0 + 50 : LI[1], FV.vastago, { owner: own, cls: "tr-stem" });
  const piece = (name, prof, opts = {}) => (cut ? revX(name, prof, { F, owner: own, sectors: BACK, caps: capsCut, ...opts }) : turned(name, F, prof, { owner: own, ...opts }));
  piece(`${nm}.act-abajo`, [[AC.s0, FV.vastago + 0.5], [AC.s0 + AC.tapa, FV.vastago + 0.5], [AC.s0 + AC.tapa, AC.r + 2], [AC.s0, AC.r + 2]]);
  piece(`${nm}.act-cilindro`, [[AC.s0 + AC.tapa, AC.ri], [AC.s1 - AC.tapa, AC.ri], [AC.s1 - AC.tapa, AC.r], [AC.s0 + AC.tapa, AC.r]], cut ? { cls: "tr-in" } : {});
  piece(`${nm}.act-arriba`, [[AC.s1 - AC.tapa, FV.vastago + 0.5], [AC.s1, FV.vastago + 0.5], [AC.s1, AC.r + 2], [AC.s1 - AC.tapa, AC.r + 2]]);
  // la cabeza de control: el cuerpo y su domo
  const dom = [];
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * (PI / 2); dom.push([CT.s1 + CT.domo * Math.sin(t), CT.r * Math.cos(t), 1]); }
  dom[dom.length - 1] = [CT.s1 + CT.domo, 0];
  if (!cut) {
    turned(`${nm}.cabeza`, F, [[CT.s0, 0], [CT.s0, CT.r], [CT.s1, CT.r], ...dom.slice(1)], { owner: own, cls: "tr-cast" });
    // la conexión del aire, arriba del domo
    disc(`${nm}.aire`, F, CT.s1 + CT.domo - 1.5, CT.s1 + CT.domo + 16, 7, { owner: own, cls: "tr-ss" });
  } else {
    revX(`${nm}.cabeza`, [[CT.s0, CT.r - 3], [CT.s1, CT.r - 3], [CT.s1, CT.r], [CT.s0, CT.r]], { F, owner: own, sectors: BACK, caps: capsCut, cls: "tr-in", cutCls: "tr-cut" });
    revX(`${nm}.cabeza-domo`, [[CT.s1, 0], [CT.s1, CT.r], ...dom.slice(1)].map(([s, r]) => [s, r]), { F, owner: own, sectors: BACK, caps: capsCut, cls: "tr-cast", smooth: [3, 4, 5, 6] });
    // la placa del detector de posición, en la pared de atrás, y el blanco en la punta del vástago
    const yb = FV.y - (CT.r - 3) + 0.5;
    box(`${nm}.detector`, [xa - 13, yb, b + CT.s0 + 40], [xa + 13, yb + 12, b + CT.s0 + 62], { owner: own, cls: "tr-cast", r: 1 });
  }
  if (cut) disc(`${nm}.blanco`, F, CT.s0 + 42, CT.s0 + 50, 15, { owner: own, cls: "tr-stem" });
  return zPis;
}
function interior(nm, xa, b) {
  // los tapones (arriba: desvío), con su sello, y el pistón con su anillo; el resorte bajo el pistón
  const own = "fdv", F = FVz(xa, b), TP = FV.tapon, AC = FV.act;
  const s0 = TP.arriba, s1 = TP.arriba + TP.h;
  revX(`${nm}.tapon`, [[s0, FV.vastago + 0.4], [s1, FV.vastago + 0.4], [s1, TP.r], [s0, TP.r]], { F, owner: own, sectors: BACK, caps: capsCut, cutCls: "tr-cut1" });
  revX(`${nm}.tapon.sello`, [[s0 + 3, TP.r], [s1 - 3, TP.r], [s1 - 3, TP.r + TP.sello], [s0 + 3, TP.r + TP.sello]], { F, owner: own, sectors: BACK, caps: capsCut, cls: "tr-rubber", cutCls: "tr-rubber-cut" });
  const p0 = AC.pDesvio, p1 = p0 + AC.piston;
  revX(`${nm}.piston`, [[p0, FV.vastago + 0.4], [p1, FV.vastago + 0.4], [p1, AC.ri - 2], [p0, AC.ri - 2]], { F, owner: own, sectors: BACK, caps: capsCut, cutCls: "tr-cut1" });
  revX(`${nm}.piston.anillo`, [[p0 + 4, AC.ri - 2], [p1 - 4, AC.ri - 2], [p1 - 4, AC.ri], [p0 + 4, AC.ri]], { F, owner: own, sectors: BACK, caps: capsCut, cls: "tr-rubber", cutCls: "tr-rubber-cut" });
  // el resorte: la mitad de atrás de cada vuelta, como un tubo, y la sección del alambre en el plano del corte
  const RS = AC.resorte, za = AC.s0 + AC.tapa + RS.rw, zb = p0 - RS.rw, nv = RS.vueltas;
  const hel = (t) => [xa + RS.rm * Math.cos(t), FV.y + RS.rm * Math.sin(t), b + za + ((zb - za) * t) / (TAU * nv)];
  for (let q = 0; q < nv; q++) {
    const t0 = TAU * q + PI, t1 = Math.min(TAU * q + TAU, TAU * nv);
    if (t1 <= t0 + 1e-6) continue;
    const pts = Array.from({ length: 21 }, (_, i) => hel(t0 + ((t1 - t0) * i) / 20));
    tubeItems(`${nm}.resorte${q}`, pts, RS.rw, { owner: own, cls: "tr-spring", maxLength: 60, caps: false, limp: true });
  }
  // las secciones del alambre: en t = kπ (en el plano y = FV.y)
  for (let q = 0; q <= 2 * nv + 1e-6; q++) {
    const t = q * PI;
    const c = hel(t), pts = [];
    for (let i = 0; i < 24; i++) { const a = (TAU * i) / 24; pts.push(add(c, [RS.rw * Math.cos(a), 0, RS.rw * Math.sin(a)])); }
    const sh = A.prism({ o: c, a: YD, u: XD, v: ZD }, ngon(RS.rw, 16), -0.2, 0.2, { name: `${nm}.alambre${q}`, owner: own });
    put(`${nm}.alambre${q}`, add(c, [0, 0.3, 0]), faceSvg(pth1(pts.map(pr)), "tr-cut1", "mid", null, true), [sh]);
  }
}

/* las líneas de la válvula: la entrada (de la boquilla C, con TT-205), la que va al llenado, la de desvío y la de
   detección de fugas (con su mirilla), que bajan a TK-201 */
const XIN = FV.xD - PORT - FE.w;                     // la cara de atrás de la férula de la línea de entrada
const zIn = FV.bD + FV.puerto.medio, zFw = bL + FV.puerto.arriba;
const XFW0 = xL + PORT + FE.w, XFW1 = XFW0 + FV.adelante;
const zBotD = FV.bD - 12 - FV.abajo.stub - FE.w, zBotL = bL - 12 - FV.abajo.stub - FE.w;   // las juntas de abajo
const XTT = FV.xD - PORT - FV.tt205;
function fdv({ cut }) {
  const own = "fdv";
  const cD = cuerpo("desvio", FV.xD, FV.bD, { cut });
  const cL = cuerpo("deteccion", xL, bL, { cut });
  puertos("desvio", FV.xD, FV.bD, { cut, host: cD.host });
  puertos("deteccion", xL, bL, { cut, host: cL.host });
  arriba("desvio", FV.xD, FV.bD, { cut });
  arriba("deteccion", xL, bL, { cut });
  if (cut) { interior("desvio", FV.xD, FV.bD); interior("deteccion", xL, bL); }
  else {
    // los tapones no se ven: van adentro
  }
  // las uniones: entrada, entre las dos válvulas, salida adelante, las de abajo y las del final de cada línea
  const zMid = FV.bD + FV.puerto.arriba;
  const FinB = { o: [0, FV.y, zIn], a: XD, u: ZD, v: YD }, FmB = { o: [0, FV.y, zMid], a: XD, u: ZD, v: YD }, FfwB = { o: [0, FV.y, zFw], a: XD, u: ZD, v: YD };
  const Fdd = { o: [FV.xD, FV.y, 0], a: ZD, u: XD, v: YD }, Fdl = { o: [xL, FV.y, 0], a: ZD, u: XD, v: YD };
  union("union-fdv-entrada", FinB, FV.xD - PORT, { owner: own, cut });
  union("union-fdv-medio", FmB, FV.xD + PORT, { owner: own, cut });
  union("union-fdv-adelante", FfwB, xL + PORT, { owner: own, cut });
  union("union-desvio", Fdd, zBotD, { owner: own, cut });
  union("union-deteccion", Fdl, zBotL, { owner: own, cut });
  if (!cut) {
    union("union-llenado", FfwB, XFW1 + FE.w, { owner: "llenado", boca: 1 });
    union("union-tk-desvio", Fdd, FV.lineas.piso - FE.w, { owner: "tk201", boca: -1 });
    union("union-tk-deteccion", Fdl, FV.lineas.piso - FE.w, { owner: "tk201", boca: -1 });
  }
  // los tubos
  const zDV = zBotD - FE.w, zDL = zBotL - FE.w, MI = FV.lineas.mirilla, piso = FV.lineas.piso;
  if (!cut) {
    tubeItems("entrada-fdv", [[XPIPE, FV.y, zIn], [XIN, FV.y, zIn]], RO, { gaps: [[XTT - XPIPE - 30.5, XTT - XPIPE + 30.5]] });
    tubeItems("adelante", [[XFW0, FV.y, zFw], [XFW1, FV.y, zFw]], RO);
    tubeItems("desvio-linea", [[FV.xD, FV.y, zDV], [FV.xD, FV.y, piso]], RO);
    tubeItems("deteccion-linea", [[xL, FV.y, zDL], [xL, FV.y, MI[1] + 18]], RO);
    tubeItems("deteccion-linea2", [[xL, FV.y, MI[0] - 18], [xL, FV.y, piso]], RO);
    // TT-205: la te y el sensor, arriba
    const pT = [XTT, FV.y, zIn];
    ball("tt205.te", pT, 44, { owner: "entrada-fdv", bores: [{ dir: XD, r: RO, owner: "entrada-fdv" }] });
    const Fu = { o: pT, a: ZD, u: XD, v: YD };
    disc("tt205.cuello", Fu, 38, 70, 19, { owner: "entrada-fdv" });
    ring("tt205.ferula", Fu, 70, 82, 10, 25, { owner: "entrada-fdv" });
    disc("tt205.vaina", Fu, 82, 124, 9, { owner: "entrada-fdv" });
    turned("tt205.cabeza", Fu, [[124, 0], [124, 34], [164, 34], [171, 28, 1], [175, 18, 1], [177, 0]], { owner: "entrada-fdv", cls: "tr-cast" });
    ANCH.TT205 = [XTT + 30, FV.y, zIn + 170];
  } else {
    const half = (name, F, s0, s1, opts = {}) => revX(name, [[s0, RI], [s1, RI], [s1, RO], [s0, RO]], { F, owner: own, sectors: BACK, caps: capsCut, cls: "tr-in", ...opts });
    half("entrada-fdv", FinB, CDET[0] - 420, XIN);
    half("adelante", FfwB, XFW0, CDET[0] + 520);
    half("desvio-linea", Fdd, piso, zDV);
    half("deteccion-linea", Fdl, MI[1] + 18, zDL);
  }
  // la mirilla de la línea de detección: dos bridas y el vidrio entre ellas, con cuatro tirantes
  const Fm = { o: [xL, FV.y, 0], a: ZD, u: XD, v: YD };
  if (!cut) {
    ring("mirilla.brida-abajo", Fm, MI[0] - 18, MI[0], 0, 46, { owner: "mirilla" });
    ring("mirilla.brida-arriba", Fm, MI[1], MI[1] + 18, 0, 46, { owner: "mirilla" });
    turned("mirilla.vidrio", Fm, [[MI[0], 30], [MI[1], 30], [MI[1], 36], [MI[0], 36]], { owner: "mirilla", cls: "tr-glass" });
    const ang = Math.atan2(V3[1], V3[0]);
    for (let j = 0; j < 4; j++) { const t = ang + PI / 4 + (j * PI) / 2, c = [xL + 41 * Math.cos(t), FV.y + 41 * Math.sin(t), 0]; disc(`mirilla.tirante${j}`, { o: c, a: ZD, u: XD, v: YD }, MI[0] - 18, MI[1] + 18, 3.5, { owner: "mirilla" }); }
    ANCH.MIRILLA = [xL + 36, FV.y + 8, (MI[0] + MI[1]) / 2];
  }
  // el aire de los actuadores: una manguera de cada cabeza de control al colector
  if (!cut) {
    const CT = FV.ctrl;
    const hA = [FV.xD, FV.y, FV.bD + CT.s1 + CT.domo + 16], hB = [xL, FV.y, bL + CT.s1 + CT.domo + 16];
    const r1 = G.fillet([hA, [FV.xD, FV.y, 1510], [E1.xF + 140, 165, 1510], [E1.xF + 46, 165, 1510]], 45, 8);
    const r2 = G.fillet([hB, [xL, FV.y, 1590], [E1.xF + 140, 225, 1590], [E1.xF + 46, 225, 1590]], 45, 8);
    tubeItems("aire.desvio", r1, 4, { owner: "aire", cls: "tr-hose", limp: true, maxLength: 120 });
    tubeItems("aire.deteccion", r2, 4, { owner: "aire", cls: "tr-hose", limp: true, maxLength: 120 });
    ANCH.AIRE = G.pointAlong(r2, largo(r2) * 0.55);
  }
  ANCH.FDV_DESVIO = [FV.xD - FV.rb, FV.y, FV.bD + 135];
  ANCH.FDV_DETECCION = [xL + FV.rb, FV.y, bL + 60];
  ANCH.ACTUADOR = [xL + FV.act.r, FV.y, bL + (FV.act.s0 + FV.act.s1) / 2];
  ANCH.CABEZA = [FV.xD + FV.ctrl.r * 0.7, FV.y + FV.ctrl.r * 0.7, FV.bD + FV.ctrl.s1 - 20];
  ANCH.ADELANTE = [XFW1 - 60, FV.y, zFw + RO];
  ANCH.DESVIO_LINEA = [FV.xD - RO, FV.y, 220];
  ANCH.DETECCION_LINEA = [xL + RO, FV.y, 150];
}
fdv({ cut: DET });

/* ====================================================================
   5 · en el detalle: el jugo en el camino del desvío (la entrada, la cámara del medio, el asiento de abajo abierto, la
   cámara de abajo y la línea de desvío) y las flechas; la cámara de arriba, la unión y la válvula de detección, vacías
   ==================================================================== */
function line(name, pts, { r = 2, head = 12, w = 5, cls = "tr-flujo", hcls = "tr-flecha" } = {}) {
  const sc = pts.map(at), n = sc.length;
  const b = sc[n - 1];
  let j = n - 2; while (j > 0 && Math.hypot(sc[j][0] - b[0], sc[j][1] - b[1]) < head) j--;
  const a = sc[j], Lh = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / Lh, uy = (b[1] - a[1]) / Lh;
  const base = [b[0] - ux * head, b[1] - uy * head];
  const keep = sc.slice(0, j + 1);
  const body = keep.map(([x, yy], i) => (i ? "L" : "M") + r10(x) + " " + r10(yy)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  const svg = `<path class="${cls}" d="${body}"/><path class="${hcls}" d="M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z"/>`;
  put(name, pts[Math.floor(n / 2)], svg, [A.tube(pts, r), A.ball(pts[n - 1], Math.min(r * 3, (w * 0.8) / KS))]);
}
const seg = (a, b, n = 12) => Array.from({ length: n + 1 }, (_, i) => G.lerp3(a, b, i / n));
if (DET) {
  const own = "jugo", y = FV.y + 0.6, xa = FV.xD, b = FV.bD, rbi = FV.rbi, AS = FV.asiento;
  // el corte del jugo, en el plano: un solo polígono en (x, z)
  const zLow = FV.lineas.piso, X0 = CDET[0] - 420, s0a = AS.s[0][0], s0b = AS.s[0][1], s1a = AS.s[1][0];
  const poly = [
    [X0, zIn - RI], [xa - rbi, zIn - RI], [xa - rbi, b + s0b], [xa - AS.r, b + s0b], [xa - AS.r, b + s0a], [xa - rbi, b + s0a],
    [xa - rbi, b], [xa - RI, b], [xa - RI, zLow], [xa + RI, zLow], [xa + RI, b], [xa + rbi, b], [xa + rbi, b + s0a],
    [xa + AS.r, b + s0a], [xa + AS.r, b + s0b], [xa + rbi, b + s0b], [xa + rbi, b + s1a], [xa - rbi, b + s1a], [xa - rbi, zIn + RI], [X0, zIn + RI],
  ];
  // los anillos de los asientos van por encima del jugo (el polígono pasa por debajo del de arriba y por el agujero del de abajo)
  const d = pth1(poly.map(([x, z]) => pr([x, y, z])));
  const sh = A.prism({ o: [0, y, 0], a: YD, u: XD, v: ZD }, poly.map(([x, z]) => [x, z]), -0.3, 0, { name: "jugo", owner: own });
  put("jugo", [xa - 40, y, b + 60], `<path class="tr-jugo" d="${d}"/>`, [sh], { bias: -0.5 });
  const yf = FV.y + 2;
  line("flujo.entra", seg([CDET[0] - 330, yf, zIn], [xa - 70, yf, zIn]), { head: 14, w: 6 });
  line("flujo.baja", seg([xa + 18, yf, b + 128], [xa + 18, yf, b + 40]), { head: 14, w: 6 });
  line("flujo.desvio", seg([xa, yf, b - 30], [xa, yf, b - 230]), { head: 14, w: 6 });
  ANCH.D_ENTRA = [CDET[0] - 300, FV.y, zIn + RO];
  ANCH.D_JUGO = [xa - 25, FV.y, b + 40];
  ANCH.D_DESVIO = [xa - RO, FV.y, b - 170];
  ANCH.D_ASIENTO_ABAJO = [xa + 41, FV.y, b + 95];
  ANCH.D_TAPON = [xa + 30, FV.y, b + FV.tapon.arriba + 10];
  ANCH.D_ASIENTO_ARRIBA = [xa - 41, FV.y, b + 175];
  ANCH.D_CAMARA_ARRIBA = [xa + 20, FV.y, b + 240];
  ANCH.D_VASTAGO = [xa + 8, FV.y, b + 330];
  ANCH.D_RESORTE = [xa - FV.act.resorte.rm, FV.y, b + 470];
  ANCH.D_PISTON = [xa + 40, FV.y, b + FV.act.pDesvio + 8];
  ANCH.D_AIRE = [xa - 30, FV.y, b + FV.act.s1 - 18];
  ANCH.D_DETECTOR = [xa, FV.y - FV.ctrl.r + 8, b + FV.ctrl.s0 + 51];
  ANCH.D_FUGA = [xL, FV.y, bL - 60];
  ANCH.D_DETECCION = [xL + 30, FV.y, bL + 135];
  ANCH.D_TAPON_L = [xL + 30, FV.y, bL + FV.tapon.arriba + 10];
  ANCH.D_ADELANTE = [xL + PORT + 60, FV.y, zFw + RO];
}

/* ====================================================================
   6 · la persona de referencia: 1,75 m, de pie en el piso delante del soporte (no va en el detalle)
   ==================================================================== */
if (!DET) {
  const PS = TR.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, 0], rumbo: PS.rumbo, mm: 1, adelante: "der" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.CABEZA;
}

/* ---------- el detalle: solo lo que cae en el círculo ---------- */
if (DET) {
  const cx = W_ / 2, cy = H_ / 2, rr = RDET + 4;
  const inView = (it) => it.shapes.some((sh) => {
    const bd = A.boundsOf(sh); if (!bd) return true;
    const [lo, hi] = Array.isArray(bd) ? bd : [bd.min, bd.max];
    const cs = []; for (const x of [lo[0], hi[0]]) for (const yy of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) cs.push(k.iso([x / U, yy / U, z / U], P));
    const x0 = Math.min(...cs.map((c) => c[0])), x1 = Math.max(...cs.map((c) => c[0])), y0 = Math.min(...cs.map((c) => c[1])), y1 = Math.max(...cs.map((c) => c[1]));
    return x1 > cx - rr && x0 < cx + rr && y1 > cy - rr && y0 < cy + rr;
  });
  const keep = R_.items.filter(inView);
  R_.items.splice(0, R_.items.length, ...keep);
}

/* ---------- orden y salida ---------- */
if (process.env.TR_ITEM) {
  for (const nm of process.env.TR_ITEM.split(",")) {
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
const CAUC = ["#5D666E", "#6B747C", ["#3E464D", "#475057", "#505960", "#576067"]];
const VIDR = ["#E8F1F6", "#F2F7FA", ["#C4D6E2", "#D0DFE9", "#DBE7EF", "#E3EDF3"]];
const CSS = `.tr-cut{${flat("#C1C6CB")}}.tr-cut1{${flat("#CACFD3")}}.tr-rubber-cut{${flat("#3E464D")}}
.tr-ss,.tr-stem,.tr-spring,.tr-plate{${shades(...ACERO)}}.tr-in{${shades("#D3D9DF", "#E3E8EE", ["#AEB8C2", "#C9D1D9", "#C9D1D9", "#D3D9DF"])}}.tr-cast{${shades(...FUND)}}
.tr-paint{${shades(...PINT)}}.tr-rubber,.tr-hose{${shades(...CAUC)}}.tr-glass{${shades(...VIDR)}}
.tr-bore{fill:#7D8790;stroke:none}.tr-disp{fill:#2B3036;stroke:#525C64;stroke-width:.6px}
.tr-jugo{fill:#E8C766;fill-opacity:.5;stroke:none}
.tr-flujo{fill:none;stroke:#2E5E9E;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round}.tr-flecha{fill:#2E5E9E;stroke:none}
.tr-det-fondo{fill:#FFFFFF;stroke:none}.tr-det-marco{fill:none;stroke:#525C64;stroke-width:1px}
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
  ? k.figureSvg({ width: W_, height: H_, label: "La válvula de desvío en corte", body: [`<style>${CSS}</style><defs><clipPath id="trDet"><circle cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/></clipPath></defs><g class="tr-items" clip-path="url(#trDet)"><circle class="tr-det-fondo" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="tr-det-marco" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W_, height: H_, label: "Tubo de retención de E-201", body: [`<style>${CSS}</style><g class="tr-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
const base = DET ? "detalle" : "fig";
writeFileSync(join(OUTD, `${base}.svg`), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Tubo de retención", theme: "light", width: DET ? 420 : 1100, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, `${base}_data.json`), JSON.stringify({ P, W: W_, H: H_, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, { crowd: [] });
