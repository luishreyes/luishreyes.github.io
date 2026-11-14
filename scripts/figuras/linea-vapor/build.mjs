/* ====================================================================
   La línea de vapor aislada en isométrico (skill anatomy), para el capítulo 21 del libro de operaciones unitarias
   (Heat in equipment, «La línea aislada en la planta»): un tramo de la línea que lleva el vapor saturado a 5 bara de
   la caldera al extractor de la planta de aceite esencial, al exterior, sobre un soporte de tubería.
   Concepto: el tubo de acero al carbono de 4 in cédula 40 va forrado con dos medias cañas de lana mineral de 50 mm y
   una chaqueta de aluminio, con sus traslapos y sus bandas; se apoya en una zapata soldada que deja pasar el aislante
   por encima de la viga; la válvula y la unión de bridas llevan chaquetas desmontables; en un punto bajo, la pierna de
   goteo recoge el condensado y lo entrega a la trampa. Un corte en cuña muestra las capas y el vapor por dentro.
   Cortes: la cuña φ ∈ [315°, 450°] del tubo (del lado del lector y arriba), escalonada: la chaqueta se quita primero,
   luego la lana, luego el acero; la chaqueta desmontable de la unión de bridas va cortada con la misma cuña; el extremo
   de la derecha va cortado por un plano x = constante. La viga va cortada en su extremo delantero.
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
const A = await import(KIT + "/kit/audit.mjs");
const X = await import(join(HERE, "xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const { LV, G0, temperatura } = GEO;
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const DET = process.argv.includes("--detalle");
const STEP = Number(process.env.LV_STEP || (DET ? 2 : 0.5));
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};
const { RO, RI, RW, RJ } = G0;

/* ---------- la cámara ---------- */
const W_ = DET ? 320 : 1100, H_ = DET ? 320 : 760;
const VA = LV.valve, FL = LV.flange, DR = LV.drip, BM = LV.beam, SH = LV.shoe, CU = LV.cut;
const ZT = -(RO + SH.h);            // la cara de arriba de la viga (la cara de abajo de la placa de la zapata)
const EXT = [
  [LV.x0, -RJ, RJ], [LV.x0, RJ, -RJ], [LV.x0, -RJ, -RJ],
  [LV.x1 + 20, RJ, -RJ], [LV.x1 + 20, -RJ, RJ],
  [LV.xs - 80, BM.y1, ZT - BM.d], [LV.xs + 80, BM.y0, ZT], [LV.xs - 80, BM.y0, ZT - BM.d],
  [LV.xv - 130, 0, 740], [LV.xv + 130, 0, 740], [LV.xv, 130, 640], [LV.xv, -130, 640],
  [LV.xd + 300, 60, DR.zt - 280], [LV.xd, 0, DR.zb - DR.cap - 20],
];
const PMAIN = k.fitProjection(EXT, 1100, 760, { pad: 20, azimuth: LV.AZ, elevation: LV.EL });
// el detalle: el corte de la pared (la cara del corte en y = 0), MDET veces más grande, dentro de un círculo de RDET
const CDET = [-700, 0, 112], MDET = 5, RDET = 150;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: LV.AZ, elevation: LV.EL }; const c = k.iso(CDET, Q); Q.origin = [W_ / 2 - c[0], H_ / 2 - c[1]]; return Q; })() : PMAIN;
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
const e3 = (phi) => [0, Math.cos(phi * D2R), Math.sin(phi * D2R)];        // radial alrededor del tubo
const t3 = (phi) => [0, -Math.sin(phi * D2R), Math.cos(phi * D2R)];       // tangente (hacia φ creciente)
const onPipe = (x, r, phi) => [x, r * Math.cos(phi * D2R), r * Math.sin(phi * D2R)];

/* El dibujo va en milímetros; el audit, en centímetros (como el ciclón y la separadora). */
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

/* ---------- piezas ---------- */
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "lv-paint", r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, ref, rec = true } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const sh = A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}) });
  if (rec) record(sh);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls) + extra, [sh]);
  return sh;
}
function fp(name, F, poly, s0, s1, { cls = "lv-paint", extra = "", cap = "auto", owner = name, ref = null, ground, rec = true, skip = null, seated, cut } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(ground ? { ground } : {}), ...(seated ? { seated } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", cls, cap, skip }) + extra, [sh]);
  return sh;
}
const ngon = (r, m, ph = 0) => Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m + ph; return [r * Math.cos(t), r * Math.sin(t)]; });
function disc(name, F, s0, s1, r, { cls = "lv-cs", extra = "", owner = name, n = 0, ground, rec = true, cap = "auto", ph = 0, ref } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const sh = A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(ground ? { ground } : {}) });
  if (rec) record(sh);
  put(name, ref || G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), X.prismSvg(C, ngon(r, m, ph), Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap }) + extra, [sh]);
  return sh;
}
function turned(name, F, meridian, { cls = "lv-cs", extra = "", owner = name, steps = 48, rec = true, ref, cut, rims, hole } = {}) {
  const paths = G.lathe(meridian, F, P, { steps, ...(rims ? { rims } : {}), ...(hole ? { hole } : {}) });
  const sh = A.lathe(F, meridian, { name, owner, ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  const s0 = Math.min(...meridian.map((q) => q[0])), s1 = Math.max(...meridian.map((q) => q[0]));
  put(name, ref || G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(S(paths, { tone: "mid" }), cls) + extra, [sh]);
  return sh;
}

/* ====================================================================
   el barrido (del ciclón): una sección (s, r) que gira alrededor de un eje. Se pinta cara por cara, de atrás hacia
   adelante; cada arista se dibuja con la cara visible que va después.
   ==================================================================== */
function sweepSvg({ F, profile, a0, a1, steps = 0, smooth = [], skip = [], capA = "end", capB = "end", cls = "lv-cs", cutCls = "lv-cs-cut", tone = "mid", shadePhi = null, noEdge = [] }) {
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
    let ns2 = nn;
    if (shadePhi !== null) { const e2 = G.add3(G.mul3(F.u, Math.cos(shadePhi)), G.mul3(F.v, Math.sin(shadePhi))); ns2 = G.unit3(G.add3(G.mul3(F.a, ns), G.mul3(e2, nr))); }
    faces.push({ i, j, q, n: nn, ns: ns2, vis: G.dot3(nn, V3) > 1e-6, d: G.dot3(cen, V3) });
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
  const keyOf = (f) => { if (f.cap && f.mode === "cut") return `<path class="iso-shade" data-shade="0" d="D"/>`; return keyOfN(f.ns || f.n); };
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
const halfSpaceAt = (n, o) => { n = G.unit3(n); const p = G.unit3(Math.abs(n[2]) < 0.9 ? G.cross3(ZD, n) : G.cross3(XD, n)); return A.orientedBox(G.add3(o, G.mul3(n, BIG)), [n, p, G.cross3(n, p)], [BIG, BIG, BIG], { name: "corte" }); };
// la cuña de ángulos [a0, a1] alrededor del eje de un marco F (ángulo medido de F.u hacia F.v): lo que queda fuera
const wedgeCutsF = (F, a0, a1) => { const p0 = a0 * D2R, p1 = a1 * D2R; return [halfSpaceAt(G.sub3(G.mul3(F.u, Math.sin(p0)), G.mul3(F.v, Math.cos(p0))), F.o), halfSpaceAt(G.add3(G.mul3(F.u, -Math.sin(p1)), G.mul3(F.v, Math.cos(p1))), F.o)]; };
// el marco del tubo: s a lo largo de x, φ desde +y hacia +z
const FX = { o: [0, 0, 0], a: XD, u: YD, v: ZD };

/* una pieza de revolución alrededor del tubo, en sectores de ángulo [[a0, a1], …]; prof: polígono cerrado en (x, r) */
function revX(name, prof, { F = FX, cls = "lv-cs", owner = name, sectors = [[0, 360]], skip = [], smooth = [], rec = true, ref = null, extras = null, caps = null, noEdge = [], shape = true, whole = false } = {}) {
  const xc = prof.reduce((q, p) => q + p[0], 0) / prof.length, rmax = Math.max(...prof.map((q) => q[1]));
  const out = [];
  for (const [a0, a1] of sectors) {
    const steps = Math.max(3, Math.round((a1 - a0) / 5));
    const cp = caps ? caps(a0, a1) : ["none", "none"];
    const svg = sweepSvg({ F, profile: prof, a0: a0 * D2R, a1: a1 * D2R, cls, capA: cp[0], capB: cp[1], skip, smooth, steps, noEdge }) + (extras ? extras(a0, a1) : "");
    const full = whole || a1 - a0 >= 360 - 1e-6;
    const sh = A.lathe(F, prof.map(([a, b]) => [a, b]), { name: sectors.length > 1 ? `${name}.${Math.round(a0)}` : name, owner, ...(full ? {} : { cut: wedgeCutsF(F, a0, a1) }) });
    if (rec && shape) record(sh);
    const am = (full ? 30 : (a0 + a1) / 2) * D2R, rr = ref ?? rmax * 0.9;
    const c3 = G.pointOf(F, xc, rr, am);
    put(sectors.length > 1 ? `${name}.${Math.round(a0)}` : name, c3, svg, shape ? [sh] : []);
    out.push(sh);
  }
  return out;
}
// un anillo sobre una superficie (banda, correa, cincha): solo sus caras de afuera y sus bordes
const ringOn = (name, F, s0, s1, r, t, opts = {}) => revX(name, [[s0, r], [s1, r], [s1, r + t], [s0, r + t]], { F, skip: [0], sectors: [frontOf(F)], ...opts });
// la parte de un anillo que queda delante del cuerpo que abraza (la de atrás la tapa ese cuerpo)
function frontOf(F) { const ph = Math.atan2(G.dot3(F.v, V3), G.dot3(F.u, V3)) / D2R; return [ph - 90, ph + 90]; }
// una cara anular en un plano x = constante (la tapa del remate del aislante, el corte del extremo)
function capRing(name, x, r0, r1, { cls = "lv-cs-cut", owner = name, n = null } = {}) {
  const ring = (r, rev) => { const pts = []; for (let i = 0; i < 96; i++) { const f = ((rev ? 96 - i : i) / 96) * TAU; pts.push(pr([x, r * Math.cos(f), r * Math.sin(f)])); } return pth1(pts); };
  const d = ring(r1, false) + ring(r0, true);
  const sh = record(A.lathe(FX, [[x - 0.3, r0], [x, r0], [x, r1], [x - 0.3, r1]], { name, owner }));
  put(name, [x, 0, (r0 + r1) / 2], faceSvg(d, cls, "mid", n), [sh]);
}

/* las caras del corte: en un plano φ = constante (polígono en (x, r)) o en un plano x = constante (polígono en (y, z)) */
function capPhi(name, phi, sign, polyXR, { cls = "lv-cs-cut", owner = name, rec = true, extra = "", tone = "mid" } = {}) {
  const e = e3(phi), tt = G.mul3(t3(phi), sign);
  const F = { o: [0, 0, 0], a: tt, u: XD, v: e };
  const d = pth1(polyXR.map(([x, r]) => pr(G.add3(G.mul3(XD, x), G.mul3(e, r)))));
  const sh = A.prism(F, polyXR, -0.3, 0, { name, owner });
  if (rec) record(sh);
  const cx = polyXR.reduce((q, p) => q + p[0], 0) / polyXR.length, cr = polyXR.reduce((q, p) => q + p[1], 0) / polyXR.length;
  put(name, G.add3(G.mul3(XD, cx), G.mul3(e, cr)), faceSvg(d, cls, tone) + extra, [sh]);
}
function capX(name, x, polyYZ, { cls = "lv-cs-cut", owner = name, rec = true, extra = "", tone = "mid", n = null } = {}) {
  const F = { o: [x, 0, 0], a: XD, u: YD, v: ZD };
  const d = pth1(polyYZ.map(([y, z]) => pr([x, y, z])));
  const sh = A.prism(F, polyYZ, -0.3, 0, { name, owner });
  if (rec) record(sh);
  const cy = polyYZ.reduce((q, p) => q + p[0], 0) / polyYZ.length, cz = polyYZ.reduce((q, p) => q + p[1], 0) / polyYZ.length;
  put(name, [x, cy, cz], faceSvg(d, cls, tone, n) + extra, [sh]);
}
// un sector de anillo en (y, z): de φ0 a φ1, entre r0 y r1
const annSector = (r0, r1, f0, f1, n = 0) => {
  const m = n || Math.max(6, Math.round(Math.abs(f1 - f0) / 4));
  const pts = [];
  for (let i = 0; i <= m; i++) { const f = (f0 + ((f1 - f0) * i) / m) * D2R; pts.push([r1 * Math.cos(f), r1 * Math.sin(f)]); }
  for (let i = m; i >= 0; i--) { const f = (f0 + ((f1 - f0) * i) / m) * D2R; pts.push([r0 * Math.cos(f), r0 * Math.sin(f)]); }
  return pts;
};
const arcX = (x, r, f0, f1, n = 0) => { const m = n || Math.max(6, Math.round(Math.abs(f1 - f0) / 3)); const pts = []; for (let i = 0; i <= m; i++) pts.push(at(onPipe(x, r, f0 + ((f1 - f0) * i) / m))); return pthO(pts); };
const lineX = (x0, x1, r, phi) => pthO([at(onPipe(x0, r, phi)), at(onPipe(x1, r, phi))]);

/* ====================================================================
   un trozo de cilindro con un extremo que sigue otra superficie (la pierna de goteo bajo el tubo, que lo toca en la
   curva de intersección): s de sLo(θ) a sHi(θ), θ de th0 a th1 (grados, de F.u hacia F.v). Se pinta faceta por faceta;
   las aristas: los dos extremos donde se ven y las generatrices donde la superficie da la vuelta
   ==================================================================== */
function cylPieceSvg({ F, a, sLo, sHi, th0, th1, cls, tone = "mid", steps = 0 }) {
  const n = steps || Math.max(6, Math.round((th1 - th0) / 3));
  const th = Array.from({ length: n + 1 }, (_, j) => (th0 + ((th1 - th0) * j) / n) * D2R);
  const lo = th.map((t) => G.pointOf(F, sLo(t), a, t)), hi = th.map((t) => G.pointOf(F, sHi(t), a, t));
  const fs = [];
  for (let j = 0; j < n; j++) { const nrm = G.radialOf(F, (th[j] + th[j + 1]) / 2); fs.push({ vis: G.dot3(nrm, V3) > 1e-6, key: keyOfN(nrm) }); }
  let out = "", runK = null, runD = [];
  const flush = () => { if (runK) out += `<g class="iso-solid ${cls}" data-seamless="">${runK.replace("D", runD.join(""))}</g>`; runK = null; runD = []; };
  for (let j = 0; j < n; j++) {
    if (!fs[j].vis) { flush(); continue; }
    if (fs[j].key !== runK) { flush(); runK = fs[j].key; }
    runD.push(pth1([lo[j], lo[j + 1], hi[j + 1], hi[j]].map(pr)));
  }
  flush();
  let ed = "";
  let run = [];
  const endRun = () => { if (run.length) { ed += pthO(run.map((j) => pr(lo[j]))) + pthO(run.map((j) => pr(hi[j]))); } run = []; };
  for (let j = 0; j <= n; j++) {
    const visL = j > 0 && fs[j - 1].vis, visR = j < n && fs[j].vis;
    if (visL || visR) run.push(j); else endRun();
    if (j > 0 && j < n && visL !== visR) ed += pthO([pr(lo[j]), pr(hi[j])]);
    if (visR === false && visL) endRun();
  }
  endRun();
  return out + `<path class="iso-line iso-edge" data-tone="${tone}" d="${ed}"/>`;
}

/* ====================================================================
   1 · la viga del soporte de tubería (cortada adelante), las guías y la zapata soldada al tubo
   ==================================================================== */
{
  const own = "soporte", xs = LV.xs, hb = BM.bf / 2;
  box("viga.ala-arriba", [xs - hb, BM.y0, ZT - BM.tf], [xs + hb, BM.y1, ZT], { owner: own, ground: true, r: 0, steps: 1 });
  box("viga.alma", [xs - BM.tw / 2, BM.y0, ZT - BM.d + BM.tf], [xs + BM.tw / 2, BM.y1, ZT - BM.tf], { owner: own, ground: true, r: 0, steps: 1 });
  box("viga.ala-abajo", [xs - hb, BM.y0, ZT - BM.d], [xs + hb, BM.y1, ZT - BM.d + BM.tf], { owner: own, ground: true, r: 0, steps: 1 });
  // la cara del corte de la viga: la sección en I, en y = y1
  const I = [[-hb, ZT], [hb, ZT], [hb, ZT - BM.tf], [BM.tw / 2, ZT - BM.tf], [BM.tw / 2, ZT - BM.d + BM.tf], [hb, ZT - BM.d + BM.tf], [hb, ZT - BM.d], [-hb, ZT - BM.d], [-hb, ZT - BM.d + BM.tf], [-BM.tw / 2, ZT - BM.d + BM.tf], [-BM.tw / 2, ZT - BM.tf], [-hb, ZT - BM.tf]].map(([x, z]) => [xs + x, z]);
  {
    const F = { o: [0, BM.y1, 0], a: YD, u: XD, v: ZD };
    const d = pth1(I.map(([x, z]) => pr([x, BM.y1, z])));
    const sh = record(A.prism(F, I, 0, 0.3, { name: "viga.corte", owner: own, ground: true }));
    put("viga.corte", [xs, BM.y1, ZT - BM.d / 2], faceSvg(d, "lv-paint-cut"), [sh]);
  }
  // las guías: dos ángulos de 50 × 50 × 6 a los lados de la placa de la zapata, atornillados al ala de la viga
  const GU = LV.guide, yg = SH.base / 2 + GU.gap;
  for (const s of [1, -1]) {
    const yA = s > 0 ? yg : -yg - GU.leg, yB = s > 0 ? yg + GU.leg : -yg;
    const bolts = Dots([-1, 1].map((q) => at([xs + q * 35, s * (yg + GU.leg * 0.62), ZT + GU.t])), { size: 0.7, tone: "mid" });
    box(`guia${s > 0 ? "" : "-atras"}.ala`, [xs - GU.len / 2, yA, ZT], [xs + GU.len / 2, yB, ZT + GU.t], { owner: own, r: 0, steps: 1, extra: bolts });
    const yV0 = s > 0 ? yg : -yg - GU.t, yV1 = s > 0 ? yg + GU.t : -yg;
    box(`guia${s > 0 ? "" : "-atras"}.alma`, [xs - GU.len / 2, yV0, ZT + GU.t], [xs + GU.len / 2, yV1, ZT + GU.leg], { owner: own, r: 0, steps: 1 });
  }
  // la zapata: la placa que se desliza sobre la viga y el alma soldada al fondo del tubo
  box("zapata.placa", [xs - SH.len / 2, -SH.base / 2, ZT], [xs + SH.len / 2, SH.base / 2, ZT + SH.tb], { owner: "linea", r: 0, steps: 1 });
  box("zapata.alma", [xs - SH.len / 2, -SH.web / 2, ZT + SH.tb], [xs + SH.len / 2, SH.web / 2, -RO + 1], { owner: "linea", r: 0, steps: 1 });
  ANCH.VIGA = [xs + hb, BM.y1 - 60, ZT - BM.d / 2];
  ANCH.VIGA_CORTE = [xs, BM.y1, ZT - BM.d * 0.6];
  ANCH.GUIA = [xs + GU.len / 2 - 10, yg + GU.t, ZT + GU.leg - 10];
  ANCH.ZAPATA = [xs + SH.len / 2, SH.web / 2, ZT + SH.tb + 25];
  ANCH.ZAPATA_PLACA = [xs + SH.len / 2 - 20, SH.base / 2, ZT + SH.tb / 2];
}

/* ====================================================================
   2 · la chaqueta de aluminio en los tramos enteros, con sus traslapos y sus bandas
   ==================================================================== */
// los tramos de chaqueta enteros (los del corte y los de las chaquetas desmontables van aparte)
const XT_V0 = LV.xv - VA.term, XT_V1 = LV.xv + VA.term, XT_F0 = LV.xf - FL.term, XT_F1 = LV.xf + FL.term;
const XB_0 = LV.xv - VA.term - VA.over, XB_1 = LV.xv + VA.term + VA.over, XC_0 = LV.xf - FL.term - FL.over, XC_1 = LV.xf + FL.term + FL.over;
const JACKET_RUNS = [[LV.x0, CU.xa], [CU.xb, XB_0], [XB_1, XC_0], [XC_1, LV.x1]];
// los traslapos circunferenciales (la hoja de aguas arriba va por fuera) y las bandas cada 300 mm
const LAPS = [-1650, -750, 150, 1000, 1550];
const BANDS = [-2250, -1950, -1650, -1350, -1050, -750, -450, -150, 150, 400, 700, 1000, 1550];
const bandOk = (x) => !(x > LV.xs - SH.len / 2 - 20 && x < LV.xs + SH.len / 2 + 20) && !(x > LV.xd - RJ - 30 && x < LV.xd + RJ + 30);
const inRun = (x, pad = 0) => JACKET_RUNS.some(([a, b]) => x > a + pad && x < b - pad);
{
  const own = "linea";
  // la chaqueta: la superficie de afuera (las caras de adentro no se ven: la lana las tapa)
  JACKET_RUNS.forEach(([xa, xb], i) => {
    const prof = [[xa, RW], [xb, RW], [xb, RJ], [xa, RJ]];
    // los traslapos de este tramo y la línea del traslapo longitudinal, entre ellos
    const laps = LAPS.filter((x) => x > xa && x < xb);
    let lines = "";
    for (const xl of laps) lines += G.arcOf(FX, xl + LV.lapW / 2, RJ + 0.05, P);
    const cuts = [xa, ...laps.map((x) => x + LV.lapW / 2), xb];
    for (let q = 0; q < cuts.length - 1; q++) lines += lineX(cuts[q], cuts[q + 1], RJ + 0.05, LV.lapL);
    revX(`chaqueta.${i}`, prof, { cls: "lv-al", owner: own, sectors: [[-90, 180]], skip: [0, 1, 3], whole: true, extras: () => Ln(lines, { tone: "lo" }) });
  });
  // la chaqueta que queda dentro de la chaqueta desmontable de la unión de bridas: solo lo que se ve por la cuña
  revX("chaqueta.brida-izq", [[XC_0, RW], [XT_F0, RW], [XT_F0, RJ], [XC_0, RJ]], { cls: "lv-al", owner: own, sectors: [[CU.a0 - 360, 90]], skip: [0, 1, 3] });
  revX("chaqueta.brida-der", [[XT_F1, RW], [XC_1, RW], [XC_1, RJ], [XT_F1, RJ]], { cls: "lv-al", owner: own, sectors: [[CU.a0 - 360, 90]], skip: [0, 1, 3] });
  // las bandas de acero inoxidable, cada una con su sello
  for (const xb of BANDS) {
    if (!bandOk(xb) || !inRun(xb, 10)) continue;
    const w = LV.band.w / 2, Fb = FX;
    const seal = -18;
    ringOn(`banda${xb}`, Fb, xb - w, xb + w, RJ, LV.band.t, { cls: "lv-band", owner: own });
    const Fs = { o: [xb, 0, 0], a: e3(seal), u: XD, v: t3(seal) };
    fp(`banda${xb}.sello`, Fs, [[-10, -13], [10, -13], [10, 13], [-10, 13]], RJ + LV.band.t, RJ + LV.band.t + 5, { cls: "lv-band", owner: own });
  }
  ANCH.CHAQUETA = onPipe(-2100, RJ, 70);
  ANCH.BANDA = onPipe(-2250, RJ + 1, 75);
  ANCH.TRASLAPO_C = onPipe(-1650 + LV.lapW / 2, RJ, 80);
  ANCH.TRASLAPO_L = onPipe(-1850, RJ, LV.lapL);
  ANCH.SELLO = onPipe(-2250, RJ + 4, -18);
}

/* ====================================================================
   3 · el corte escalonado del tubo: la cuña φ ∈ [315°, 450°]; la chaqueta se quita desde xa, la lana desde xa + 150 y
   el acero desde xa + 300; por dentro, el vapor, y en el fondo, el condensado
   ==================================================================== */
const XW = CU.xa + CU.step, XS_ = CU.xa + 2 * CU.step;    // donde empieza el corte de la lana y el del acero
{
  const own = "linea", B0 = CU.a0, B1 = CU.a1;          // la cuña del corte
  const BACK = [[90, 180], [180, 270], [270, 315]];
  // la chaqueta que queda (la parte de atrás), de xa a xb: solo su cara de afuera
  revX("corte.chaqueta", [[CU.xa, RW], [CU.xb, RW], [CU.xb, RJ], [CU.xa, RJ]], { cls: "lv-al", owner: own, sectors: [[90, 180]], skip: [0, 1, 3] });
  // la lana que se ve entre el escalón de la chaqueta y el de la lana: su cara de afuera, en la cuña, con la junta de
  // las dos medias cañas (φ = 50°) y un alambre que las amarra
  const wireX = CU.xa + CU.step / 2;
  revX("corte.lana", [[CU.xa, RO], [XW, RO], [XW, RW], [CU.xa, RW]], { cls: "lv-wool", owner: own, sectors: [[B0, B1]], skip: [0, 1, 3],
    extras: () => Ln(lineX(CU.xa, XW, RW + 0.1, LV.seam), { tone: "mid" }) + Ln(arcX(wireX, RW + 0.4, B0 + 1, B1 - 1), { tone: "mid" }) });
  // el acero que se ve entre el escalón de la lana y el del acero: su cara de afuera, en la cuña
  revX("corte.tubo", [[XW, RI], [XS_, RI], [XS_, RO], [XW, RO]], { cls: "lv-cs", owner: own, sectors: [[B0, B1]], skip: [0, 1, 3] });
  // el tubo por dentro, a la izquierda del escalón del acero: se ve por la cuña
  revX("corte.tubo-adentro", [[XS_ - 70, RI], [XS_, RI], [XS_, RO], [XS_ - 70, RO]], { cls: "lv-in", owner: own, sectors: [[0, 360]], skip: [1, 2, 3], noEdge: [0] });
  // el acero que queda (la parte de atrás), de xs_ a xb: su cara de adentro
  revX("corte.tubo-atras", [[XS_, RI], [CU.xb, RI], [CU.xb, RO], [XS_, RO]], { cls: "lv-in", owner: own, sectors: BACK, skip: [1, 2, 3] });
  // las caras de los escalones (x = constante), en la cuña
  capX("corte.escalon-chaqueta", CU.xa, annSector(RW, RJ, B0, B1), { cls: "lv-al-cut", owner: own });
  capX("corte.escalon-lana", XW, annSector(RO, RW, B0, B1), { cls: "lv-wool-cut", owner: own,
    extra: Ln(pthO([at(onPipe(XW, RO, LV.seam)), at(onPipe(XW, RW, LV.seam))]), { tone: "mid" }) });
  capX("corte.escalon-tubo", XS_, annSector(RI, RO, B0, B1), { cls: "lv-cs-cut", owner: own });
  // las caras del corte en los planos φ = 90° (vertical, y = 0) y φ = 315°
  for (const [phi, sg] of [[90, 1], [315, 1]]) {
    const sgn = phi === 90 ? -1 : 1;
    capPhi(`corte.${phi}.chaqueta`, phi, sgn, [[CU.xa, RW], [CU.xb, RW], [CU.xb, RJ], [CU.xa, RJ]], { cls: "lv-al-cut", owner: own });
    capPhi(`corte.${phi}.lana`, phi, sgn, [[XW, RO], [CU.xb, RO], [CU.xb, RW], [XW, RW]], { cls: "lv-wool-cut", owner: own });
    capPhi(`corte.${phi}.tubo`, phi, sgn, [[XS_, RI], [CU.xb, RI], [CU.xb, RO], [XS_, RO]], { cls: "lv-cs-cut", owner: own });
    void sg;
  }
  // el condensado: una película en el fondo del tubo (va exagerada: 3 mm), que corre hacia la pierna de goteo
  revX("condensado", [[XS_ + 40, RI - 3], [CU.xb, RI - 3], [CU.xb, RI], [XS_ + 40, RI]], { cls: "lv-agua", owner: own, sectors: [[250, 290]], skip: [1, 2], rec: false });
  ANCH.CORTE_LANA = onPipe(XW, (RO + RW) / 2, 20);
  ANCH.LANA = [-800, 0, (RO + RW) / 2];
  ANCH.JUNTA_LANA = onPipe(XW, (RO + RW) / 2 + 8, LV.seam);
  ANCH.ALAMBRE = onPipe(wireX, RW + 0.4, 10);
  ANCH.TUBO = onPipe((XW + XS_) / 2, RO, 20);
  ANCH.TUBO_CORTE = [-700, 0, (RI + RO) / 2];
  ANCH.CHAQUETA_CORTE = [CU.xa, 0, RJ];
  ANCH.CONDENSADO = onPipe(-700, RI - 1.5, 270);
}

/* ====================================================================
   4 · el extremo de la derecha, cortado: el acero, las dos medias cañas de lana y la chaqueta; por el agujero, el tubo
   por dentro
   ==================================================================== */
{
  const own = "linea", x1 = LV.x1;
  // un solo trozo: el tubo por dentro (lo que se ve por el agujero) y las caras del corte encima
  const inside = sweepSvg({ F: FX, profile: [[x1 - 60, RI], [x1, RI], [x1, RO], [x1 - 60, RO]], a0: 0, a1: TAU, steps: 72, skip: [1, 2, 3], noEdge: [0], capA: "none", capB: "none", cls: "lv-in" });
  const ring = (r, rev) => { const pts = []; for (let i = 0; i < 120; i++) { const f = ((rev ? 120 - i : i) / 120) * TAU; pts.push(pr([x1, r * Math.cos(f), r * Math.sin(f)])); } return pth1(pts); };
  const half = (a0) => pth1(annSector(RO, RW, a0, a0 + 180, 60).map(([y, z]) => pr([x1, y, z])));
  const faces = faceSvg(ring(RO, false) + ring(RI, true), "lv-cs-cut") + faceSvg(half(LV.seam), "lv-wool-cut") + faceSvg(half(LV.seam + 180), "lv-wool-cut") + faceSvg(ring(RJ, false) + ring(RW, true), "lv-al-cut");
  const sh = record(A.lathe(FX, [[x1 - 0.3, 0], [x1, 0], [x1, RJ], [x1 - 0.3, RJ]], { name: "extremo", owner: own }));
  put("extremo", [x1, 0, 0], inside + faces, [sh]);
  ANCH.MEDIAS_CANAS = onPipe(x1, (RO + RW) / 2 + 6, LV.seam + 180);
  ANCH.EXTREMO_LANA = onPipe(x1, (RO + RW) / 2, 300);
  ANCH.EXTREMO_TUBO = onPipe(x1, (RI + RO) / 2, 120);
}

/* ====================================================================
   5 · la pierna de goteo: una T hacia abajo, del mismo diámetro, forrada como el tubo hasta arriba de la salida de la
   trampa; abajo, el bolsillo desnudo con su tapa; de lado, el niple y el cuerpo de la trampa
   ==================================================================== */
{
  const own = "linea", xd = LV.xd;
  const Fl = { o: [xd, 0, 0], a: [0, 0, -1], u: YD, v: XD };
  const mainCyl = A.disc(FX, xd - 400, xd + 400, RJ, { name: "corte-tubo" });
  const sLo = (t) => RJ * Math.abs(Math.sin(t)) + 0.01, sHi = () => -DR.zj;
  for (const [nm, a0, a1] of [["frente", -64, 72], ["lado", 72, 124]]) {
    const svg = cylPieceSvg({ F: Fl, a: RJ, sLo, sHi, th0: a0, th1: a1, cls: "lv-al" });
    const sh = record(A.disc(Fl, 0, -DR.zj, RJ, { name: `pierna.${nm}`, owner: own, cut: [mainCyl, ...wedgeCutsF(Fl, a0, a1)] }));
    const am = ((a0 + a1) / 2) * D2R;
    put(`pierna.${nm}`, G.pointOf(Fl, 300, RJ, am), svg, [sh]);
  }
  // las bandas de la pierna
  for (const zb of [-300, -495]) {
    const w = LV.band.w / 2;
    ringOn(`pierna.banda${-zb}`, Fl, -zb - w, -zb + w, RJ, LV.band.t, { cls: "lv-band", owner: own });
  }
  // el bolsillo desnudo, la tapa (un casquete) y el tapón del drenaje
  const zb0 = -DR.zj, zb1 = -DR.zb;
  const pocketSh = turned("pierna.bolsillo", Fl, [[zb0, RI], [zb0, RO], [zb1, RO], [zb1, RI]], { cls: "lv-cs", owner: own });
  const head = [[zb1, RO]];
  for (let i = 1; i <= 8; i++) { const a = (i / 8) * (PI / 2); head.push([zb1 + DR.cap * Math.sin(a), RO * Math.cos(a), 1]); }
  head[head.length - 1] = [zb1 + DR.cap, 0];
  turned("pierna.tapa", Fl, [[zb1, 0], ...head], { cls: "lv-cs", owner: own });
  disc("pierna.tapon", Fl, zb1 + DR.cap - 2, zb1 + DR.cap + 14, 11, { cls: "lv-cs", owner: own, n: 6 });
  // el niple de 3/4 in, hacia +x (aguas abajo), sobre un asiento que sigue el bolsillo
  const zt = DR.zt, an = DR.nip;
  const Fn = { o: [xd, 0, zt], a: XD, u: YD, v: ZD };
  const xc = 160, xN1 = xc - 48;
  {
    const low = Math.sqrt(RO * RO - an * an);
    const svg = S(G.saddleOf(Fn, an, RO, xN1, P), { tone: "mid" });
    const sh = record(A.disc(Fn, low - 0.05, xN1, an, { name: "trampa.niple", owner: own, seated: true, cut: [pocketSh] }));
    put("trampa.niple", [xd + (RO + xN1) / 2, 0, zt], wrap(svg, "lv-cs"), [sh]);
  }
  // el cuerpo de la trampa (de disco: el cuerpo forjado con sus dos bocas en línea y la tapa hexagonal arriba) y la
  // salida del condensado, que baja al retorno
  const Ft = Fn, Fc = { o: [xd + xc, 0, 0], a: ZD, u: XD, v: YD };
  turned("trampa.cuerpo", Fc, [[zt - 26, 0], [zt - 26, 29], [zt - 21, 34], [zt + 16, 34], [zt + 16, 0]], { cls: "lv-cast", owner: own });
  disc("trampa.boca-entra", Ft, xN1, xc - 30, 17, { cls: "lv-cast", owner: own, n: 6, ph: PI / 6 });
  disc("trampa.boca-sale", Ft, xc + 30, xc + 48, 17, { cls: "lv-cast", owner: own, n: 6, ph: PI / 6 });
  disc("trampa.tapa", Fc, zt + 16, zt + 40, 36, { cls: "lv-cast", owner: own, n: 6, ph: PI / 6 });
  disc("trampa.tapa.boton", Fc, zt + 40, zt + 47, 13, { cls: "lv-cast", owner: own });
  const xO = xc + 48;
  disc("trampa.salida", Ft, xO, xO + 28, an, { cls: "lv-cs", owner: own });
  const elb = [xd + xO + 28 + 16, 0, zt];
  put("trampa.codo", elb, wrap(S(G.sphereOf(elb, 18, P), { tone: "mid" }), "lv-cs"), [record(A.ball(elb, 18, { name: "trampa.codo", owner: own }))]);
  const Fd = { o: elb, a: [0, 0, -1], u: XD, v: YD };
  disc("trampa.bajante", Fd, 16, 160, an, { cls: "lv-cs", owner: own });
  ANCH.PIERNA = G.pointOf(Fl, 380, RJ, 50 * D2R);
  ANCH.BOLSILLO = G.pointOf(Fl, 700, RO, 40 * D2R);
  ANCH.NIPLE = [xd + 85, 0, zt + an];
  ANCH.TRAMPA = [xd + xc + 34 * Math.cos(-1.2), 34 * Math.sin(1.2), zt - 6];
  ANCH.CONDENSADO_SALE = [elb[0], 0, zt - 190];
}

/* ====================================================================
   6 · la válvula de compuerta con su chaqueta desmontable: la chaqueta (un cojín alrededor del cuerpo y las dos bridas,
   con dos correas, dos cinchas en los cuellos y la bota del bonete), y lo que asoma: el bonete, la prensaestopas, el
   arco, el vástago y el volante
   ==================================================================== */
{
  const own = "valvula", xv = LV.xv, rb = VA.rb, L = VA.term + VA.over;
  // la chaqueta: perfil en (x, r); los cuellos abrazan la chaqueta del tubo
  const ri = RJ;
  const prof = [[xv - L, ri], [xv - L + 10, ri + 5], [xv - L + 34, ri + 6], [xv - L + 44, ri + 30, 1], [xv - L + 64, rb - 12, 1], [xv - L + 90, rb], [xv + L - 90, rb], [xv + L - 64, rb - 12, 1], [xv + L - 44, ri + 30, 1], [xv + L - 34, ri + 6], [xv + L - 10, ri + 5], [xv + L, ri]];
  const mantaSh = turned("manta", FX, prof, { cls: "lv-blanket", owner: own, steps: 120, hole: [xv + L, ri], ref: [xv, 60, rb * 0.6], extra: Ln(arcX(xv - L + 90, rb + 0.2, -64, 118) + arcX(xv + L - 90, rb + 0.2, -64, 118), { tone: "lo" }) });
  // dos correas con su hebilla, por fuera de la bota
  for (const dx of [-170, 170]) {
    const xc = xv + dx, w = 12;
    ringOn(`manta.correa${dx > 0 ? 2 : 1}`, FX, xc - w, xc + w, rb, 3, { cls: "lv-strap", owner: own });
    const ph = -8, Fs = { o: [xc, 0, 0], a: e3(ph), u: XD, v: t3(ph) };
    fp(`manta.hebilla${dx > 0 ? 2 : 1}`, Fs, [[-16, -20], [16, -20], [16, 20], [-16, 20]], rb + 3, rb + 9, { cls: "lv-band", owner: own });
  }
  // las cinchas de los cuellos
  ringOn("manta.cincha", FX, xv + L - 22, xv + L - 6, ri + 5.6, 2.5, { cls: "lv-strap", owner: own });
  // la bota del bonete: un cilindro que sale de la chaqueta y se cierra alrededor del cuello del bonete
  const Fb = { o: [xv, 0, 0], a: ZD, u: YD, v: XD };
  {
    const a = VA.boot, top = VA.bootTop;
    const low = Math.sqrt(rb * rb - a * a);
    const svg = S(G.saddleOf(Fb, a, rb, top, P), { tone: "mid" });
    const sh = record(A.disc(Fb, low - 0.05, top, a, { name: "manta.bota", owner: own, seated: true, cut: [mantaSh] }));
    put("manta.bota", [xv, a * 0.6, (low + top) / 2], wrap(svg, "lv-blanket"), [sh]);
    turned("manta.bota.arriba", Fb, [[top, 0], [top, a], [top + 10, a - 4, 1], [top + 18, a - 18, 1], [top + 22, 46], [top + 22, 0]], { cls: "lv-blanket", owner: own });
    ringOn("manta.cordon", Fb, top + 3, top + 8, a - 3.5, 2.5, { cls: "lv-strap", owner: own });
  }
  // el bonete, la prensaestopas, el arco (dos brazos y el puente), el vástago y el volante
  const z0 = VA.bootTop + 22;
  disc("bonete.cuello", Fb, z0, z0 + 34, 42, { cls: "lv-cast", owner: own });
  const zg = z0 + 34;
  disc("bonete.brida", Fb, zg, zg + 14, 60, { cls: "lv-cast", owner: own, extra: Dots([-1, 1].map((q) => at([xv + q * 47, 0, zg + 14])), { size: 0.9, tone: "mid" }) });
  disc("prensa", Fb, zg + 14, zg + 30, 30, { cls: "lv-cast", owner: own });
  const za = zg + 14, zp = za + 170;
  for (const s of [-1, 1]) box(`arco.brazo${s > 0 ? 2 : 1}`, [xv + s * 52 - 11, -16, za], [xv + s * 52 + 11, 16, zp], { cls: "lv-cast", owner: own, r: 3, steps: 2 });
  box("arco.puente", [xv - 66, -22, zp], [xv + 66, 22, zp + 26], { cls: "lv-cast", owner: own, r: 5, steps: 2 });
  disc("arco.buje", Fb, zp + 26, zp + 48, 28, { cls: "lv-cast", owner: own });
  const zw = zp + 48;
  disc("vastago.abajo", Fb, zg + 30, zp, 13, { cls: "lv-stem", owner: own });
  // el volante: el aro (un toro), el cubo y cuatro rayos
  const rw = 118, tw = 9, zc = zw + 14;
  const ring = [];
  for (let i = 0; i < 24; i++) { const t = (i / 24) * TAU; ring.push([zc + tw * Math.sin(t), rw + tw * Math.cos(t), 1]); }
  { const fr = frontOf(Fb); revX("volante.aro", ring.map(([a, b]) => [a, b]), { F: Fb, cls: "lv-paint", owner: own, sectors: [[fr[0], fr[1]], [fr[1], fr[0] + 360]], smooth: ring.map((_, i) => i) }); }
  disc("volante.cubo", Fb, zw, zw + 30, 26, { cls: "lv-paint", owner: own });
  for (let i = 0; i < 4; i++) {
    const t = 45 + 90 * i, Fr = { o: [xv, 0, 0], a: [Math.cos(t * D2R), Math.sin(t * D2R), 0], u: [-Math.sin(t * D2R), Math.cos(t * D2R), 0], v: ZD };
    fp(`volante.rayo${i}`, Fr, [[-5, zc - 4], [5, zc - 4], [5, zc + 4], [-5, zc + 4]], 24, rw - tw + 1, { cls: "lv-paint", owner: own });
  }
  disc("vastago.arriba", Fb, zw + 30, zw + 120, 13, { cls: "lv-stem", owner: own, extra: Ln(Array.from({ length: 8 }, (_, i) => G.arcOf(Fb, zw + 38 + i * 10, 13, P)).join(""), { tone: "faint" }) });
  ANCH.MANTA = onPipe(xv + 60, rb, -35);
  ANCH.CORREA = onPipe(xv + 170, rb + 3, 35);
  ANCH.CINCHA = onPipe(xv + L - 14, ri + 8, 15);
  ANCH.BOTA = [xv + 40, VA.boot * 0.92, VA.bootTop - 40];
  ANCH.VOLANTE = [xv + rw * Math.cos(-20 * D2R) * 0, rw, zc];
  ANCH.ARCO = [xv + 63, 16, za + 90];
  ANCH.VASTAGO = [xv, 13, zw + 90];
  ANCH.BONETE = [xv, 42, z0 + 15];
}

/* ====================================================================
   7 · la unión de bridas con su chaqueta desmontable, cortada con la misma cuña: las dos bridas de cuello soldable de
   4 in clase 150, la empaquetadura, los ocho espárragos con sus tuercas, el tubo desnudo entre la brida y el remate del
   aislante, y la tapa del remate
   ==================================================================== */
{
  const own = "brida", xf = LV.xf;
  const g2 = FL.gasket / 2, rf1 = g2 + FL.rft, bk = rf1 + FL.tf, hubEnd = rf1 + FL.Y;
  const HALVES = [[-90, 90], [90, 270]];
  for (const s of [-1, 1]) {
    const m = (q) => xf + s * q, nm = `brida${s > 0 ? 2 : 1}`;
    const lo = (a, b) => Math.min(a, b), hi = (a, b) => Math.max(a, b);
    // el disco (la cara realzada y el cuerpo), en dos mitades, y el cuello aparte
    revX(nm, [[lo(m(bk), m(g2)), RI], [lo(m(bk), m(g2)), s < 0 ? FL.r : FL.rf], [s < 0 ? m(rf1) : m(rf1), s < 0 ? FL.r : FL.rf], [m(rf1), s < 0 ? FL.rf : FL.r], [hi(m(bk), m(g2)), s < 0 ? FL.rf : FL.r], [hi(m(bk), m(g2)), RI]],
      { cls: "lv-cs", owner: own, sectors: HALVES, skip: [5] });
    revX(`${nm}.cuello`, s < 0 ? [[m(hubEnd), RI], [m(hubEnd), RO], [m(bk), FL.hubX], [m(bk), RI]] : [[m(bk), RI], [m(bk), FL.hubX], [m(hubEnd), RO], [m(hubEnd), RI]], { cls: "lv-cs", owner: own, skip: s < 0 ? [2, 3] : [0, 2, 3] });
    // el tubo desnudo entre el cuello y el remate del aislante
    const xa = m(hubEnd), xb = m(FL.term);
    revX(`${nm}.tubo`, [[lo(xa, xb), RI], [lo(xa, xb), RO], [hi(xa, xb), RO], [hi(xa, xb), RI]], { cls: "lv-cs", owner: own, skip: [0, 2, 3] });
    // las tuercas
    for (let b = 0; b < FL.bolts; b++) {
      const ph = 22.5 + (360 / FL.bolts) * b, c = onPipe(0, FL.rbc, ph);
      const Fn = { o: [xf, c[1], c[2]], a: XD, u: YD, v: ZD };
      disc(`${nm}.tuerca${b}`, Fn, s * bk, s * (bk + FL.nutT), FL.nutF / Math.sqrt(3), { cls: "lv-bolt", owner: own, n: 6, ph: (ph + 30) * D2R });
    }
  }
  // la empaquetadura y los espárragos: cada uno en tres trozos (los dos que asoman por las tuercas y el que se ve entre
  // las bridas); lo que va dentro de las bridas no se dibuja
  turned("empaquetadura", FX, [[xf - g2, RI + 2], [xf - g2, FL.rf + 6], [xf + g2, FL.rf + 6], [xf + g2, RI + 2]], { cls: "lv-gasket", owner: own, steps: 120 });
  for (let b = 0; b < FL.bolts; b++) {
    const ph = 22.5 + (360 / FL.bolts) * b, c = onPipe(0, FL.rbc, ph);
    const Fn = { o: [xf, c[1], c[2]], a: XD, u: YD, v: ZD };
    const half = bk + FL.nutT + 5;
    disc(`esparrago${b}.izq`, Fn, -half, -bk - FL.nutT + 0.5, FL.stud, { cls: "lv-bolt", owner: own, n: 16 });
    disc(`esparrago${b}.centro`, Fn, -rf1 - 0.5, rf1 + 0.5, FL.stud, { cls: "lv-bolt", owner: own, n: 16 });
    disc(`esparrago${b}.der`, Fn, bk + FL.nutT - 0.5, half, FL.stud, { cls: "lv-bolt", owner: own, n: 16 });
  }
  // la tapa del remate del aislante, a la izquierda (la de la derecha mira hacia atrás)
  capRing("remate", xf - FL.term, RO, RJ, { cls: "lv-al", owner: own, n: [1, 0, 0] });
  // la chaqueta desmontable: un cojín de tela con relleno aislante, cortado con la cuña; dos correas
  const L = FL.term + FL.over, ri = RJ, ro = 160, rc = FL.r + 5;
  const prof = [[xf - L, ri], [xf - L + 10, ri + 5], [xf - L + 22, ri + 10], [xf - L + 36, ri + 34, 1], [xf - L + 56, ro, 1], [xf + L - 56, ro, 1], [xf + L - 36, ri + 34, 1], [xf + L - 22, ri + 10], [xf + L - 10, ri + 5], [xf + L, ri], [xf + FL.term, ri], [xf + FL.term - 20, rc], [xf - FL.term + 20, rc], [xf - FL.term, ri]];
  const B0 = CU.a0, BACKC = [[90, frontOf(FX)[1]], [frontOf(FX)[1], 180], [180, 270], [270, B0]];
  revX("cubierta", prof, { cls: "lv-blanket", owner: own, sectors: BACKC, smooth: [3, 4, 5, 6] });
  const pXR = prof.map(([x, r]) => [x, r]);
  capPhi("cubierta.corte90", 90, -1, pXR, { cls: "lv-fill-cut", owner: own });
  capPhi("cubierta.corte315", B0, 1, pXR, { cls: "lv-fill-cut", owner: own });
  for (const dx of [-70, 70]) {
    const xc = xf + dx, w = 11;
    ringOn(`cubierta.correa${dx > 0 ? 2 : 1}`, FX, xc - w, xc + w, ro, 3, { cls: "lv-strap", owner: own, sectors: [[90, frontOf(FX)[1]], [frontOf(FX)[0] + 360, B0]], whole: false });
  }
  ANCH.BRIDA = onPipe(xf + FL.tf, FL.r, 40);
  ANCH.TUERCA = onPipe(xf + 30, FL.rbc, 337.5);
  ANCH.EMPAQUETADURA = onPipe(xf, FL.rf + 4, 20);
  ANCH.CUBIERTA = onPipe(xf + 60, (rc + ro) / 2, CU.a0);
  ANCH.CUBIERTA_CORTE = [xf, 0, (ro + rc) / 2];
  ANCH.REMATE = onPipe(xf - FL.term, (RO + RJ) / 2, 40);
}

/* ====================================================================
   8 · el vapor y el condensado: flechas por dentro del tubo (en el corte), la que sale de la trampa y la línea del
   perfil de temperatura del detalle
   ==================================================================== */
function line(name, pts, { r = 5, head = 12, w = 5.5, cls = "lv-flujo", hcls = "lv-flecha", arrow = true } = {}) {
  const sc = pts.map(at), n = sc.length;
  let body;
  const shapes = [A.tube(pts, r)];
  if (arrow) {
    const b = sc[n - 1];
    let j = n - 2; while (j > 0 && Math.hypot(sc[j][0] - b[0], sc[j][1] - b[1]) < head) j--;
    const a = sc[j], Lh = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / Lh, uy = (b[1] - a[1]) / Lh;
    const base = [b[0] - ux * head, b[1] - uy * head];
    const keep = sc.slice(0, j + 1);
    body = keep.map(([x, yy], i) => (i ? "L" : "M") + r10(x) + " " + r10(yy)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
    body = `<path class="${cls}" d="${body}"/><path class="${hcls}" d="M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z"/>`;
    shapes.push(A.ball(pts[n - 1], Math.min(r * 3, (w * 0.8) / KS)));
  } else body = `<path class="${cls}" d="${sc.map(([x, yy], i) => (i ? "L" : "M") + r10(x) + " " + r10(yy)).join("")}"/>`;
  put(name, pts[Math.floor(n / 2)], body, shapes);
}
const seg = (a, b, n = 12) => Array.from({ length: n + 1 }, (_, i) => G.lerp3(a, b, i / n));
{
  const hd = DET ? 30 : 12, wd = DET ? 11 : 5;
  line("vapor.1", seg([XS_ + 60, -22, 18], [CU.xb - 110, -22, 18]), { head: hd, w: wd });
  line("vapor.2", seg([XS_ + 140, 10, -8], [CU.xb - 70, 10, -8]), { head: hd, w: wd });
  line("condensado.flecha", seg([XS_ + 300, 0, -RI + 9], [XS_ + 520, 0, -RI + 9]), { cls: "lv-cond", hcls: "lv-cond-p", head: hd * 0.8, w: wd * 0.8, r: 3 });
  const xd = LV.xd, yE = DR.zt;
  line("condensado.sale", seg([xd + 160 + 48 + 28 + 16, 0, yE - 175], [xd + 160 + 48 + 28 + 16, 0, yE - 270]), { cls: "lv-cond", hcls: "lv-cond-p" });
  ANCH.VAPOR = [XS_ + 300, -20, 14];
}
/* ====================================================================
   7 · la persona de referencia: 1,75 m, de pie en el piso junto al soporte (no va en el detalle)
   ==================================================================== */
if (!DET) {
  const PS = LV.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, PS.piso], rumbo: PS.rumbo, mm: 1, adelante: "izq" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.CABEZA;
}
// el perfil de temperatura (solo en el detalle): en el plano del corte y = 0 (un poco delante), la temperatura a lo
// largo de x y el radio hacia arriba; un eje arriba con las marcas de 20, 41 y 152 °C
const XT0 = CDET[0] - 66, SX = 118 / (LV.T.vapor - LV.T.aire), ZAX = 168, RAIR = RJ + 40;
const xOfT = (T) => XT0 + (T - LV.T.aire) * SX;
if (DET) {
  const y = 2, pts = [], T = LV.T;
  for (let r = 32; r <= RAIR; r += 0.5) pts.push([xOfT(temperatura(r)), y, r]);
  put("perfil", [CDET[0], y, CDET[2]], `<path class="lv-perfil" d="${pthO(pts.map(at))}"/>`, [A.tube(pts, 1)], { bias: 50 });
  const ax0 = [xOfT(T.aire) - 8, y, ZAX], ax1 = [xOfT(T.vapor) + 20, y, ZAX];
  const a0 = at(ax0), a1 = at(ax1), Lx = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]), ux = (a1[0] - a0[0]) / Lx, uy = (a1[1] - a0[1]) / Lx;
  const hb = [a1[0] - ux * 10, a1[1] - uy * 10];
  let ticks = "";
  for (const t of [T.aire, T.chaqueta, T.vapor]) ticks += pthO([at([xOfT(t), y, ZAX]), at([xOfT(t), y, ZAX - 5])]);
  // las guías: de cada marca, hacia abajo, hasta el punto del perfil
  const PTS = [[T.acero, RO], [T.chaqueta, RJ], [temperatura(RAIR), RAIR]];
  const gl = [[T.chaqueta, RJ], [T.acero, RO]].map(([t, r]) => [[xOfT(t), y, ZAX - 5], [xOfT(t), y, r + 2]]);
  const guides = gl.map((q) => pthO(q.map(at))).join("");
  const dots = PTS.map(([t, r]) => circ2(at([xOfT(t), y, r]), 3)).join("");
  put("perfil.eje", [CDET[0], y + 1, ZAX], `<path class="lv-guia" d="${guides}"/><path class="lv-eje" d="${pthO([a0, hb])}${ticks}"/><path class="lv-eje-p" d="M${r10(a1[0])} ${r10(a1[1])}L${r10(hb[0] - uy * 4)} ${r10(hb[1] + ux * 4)}L${r10(hb[0] + uy * 4)} ${r10(hb[1] - ux * 4)}Z"/><path class="lv-perfil-p" d="${dots}"/>`,
    [A.tube([ax0, ax1], 1), ...gl.map((q) => A.tube(q, 1))], { bias: 51 });
}

/* ---------- el detalle: solo lo que cae en el círculo, con sus anclas ---------- */
if (DET) {
  for (const key of Object.keys(ANCH)) delete ANCH[key];
  const T = LV.T, y = 2;
  ANCH.D_VAPOR = [CDET[0] - 10, -22, 18];
  ANCH.D_ACERO = [CDET[0] - 40, 0, (RI + RO) / 2];
  ANCH.D_LANA = [CDET[0] - 60, 0, 84];
  ANCH.D_CHAQUETA = [CDET[0] - 75, 0, RJ - 0.3];
  ANCH.D_AIRE = [CDET[0] - 30, -60, RJ + 40];
  ANCH.D_T152 = [xOfT(T.acero), y, RO];
  ANCH.D_T41 = [xOfT(T.chaqueta), y, RJ];
  ANCH.D_T20 = [xOfT(temperatura(RAIR)), y, RAIR];
  ANCH.D_PERFIL = [xOfT(temperatura(80)), y, 80];
  ANCH.D_EJE = [xOfT(T.aire) - 4, y, ZAX];
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
if (process.env.LV_ITEM) {
  for (const nm of process.env.LV_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1) + (f.at ? " @" + f.at.map((v) => v.toFixed(1)).join(",") : "")).join(" / "));
    }
  }
  process.exit(0);
}
if (process.env.LV_PROBE) {
  // LV_PROBE="sx,sy,itemA,itemB": la profundidad de cada pieza a lo largo del rayo de ese punto de la pantalla
  const [sx, sy, ...names] = process.env.LV_PROBE.split(",");
  const cam = A.cameraBasis(PA), kk = cam.k;
  for (const nm of names) {
    const it = R_.items.find((q) => q.name === nm);
    const base = G.add3(G.mul3(cam.R, (Number(sx) - cam.origin[0]) / kk), G.mul3(cam.D, (Number(sy) - cam.origin[1]) / kk));
    let hit = null;
    for (let t = 600; t > -600; t -= 0.05) { const q = G.add3(base, G.mul3(cam.V, t)); if (it.shapes.some((sh) => A.sdf(sh, q) < 0)) { hit = q; break; } }
    console.log(nm, hit ? hit.map((v) => (v / U).toFixed(1)).join(", ") + "  depth " + G.dot3(hit, cam.V).toFixed(2) : "no hit");
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
const AMAR = ["#F3E9A6", "#F8F1C4", ["#DCCF7E", "#E4D88D", "#EBE09A", "#EFE5A1"]];
const CAUC = ["#5D666E", "#6B747C", ["#3E464D", "#475057", "#505960", "#576067"]];
const AGUA = ["#E4EEF7", "#EEF4FA", ["#BCD0E6", "#C9D9EB", "#D6E3F1", "#DDE8F4"]];
const CSS = `.lv-cs-cut{${flat("#C1C6CB")}}.lv-al-cut{${flat("#C9CED3")}}.lv-wool-cut{${flat("#E4D88D")}}.lv-fill-cut{${flat("#E4D88D")}}.lv-paint-cut{${flat("#C7CDD1")}}
.lv-cs,.lv-cast{${shades(...FUND)}}.lv-in{${shades("#D3D9DF", "#E3E8EE", ["#AEB8C2", "#C9D1D9", "#C9D1D9", "#D3D9DF"])}}.lv-al,.lv-band,.lv-bolt,.lv-stem{${shades(...ACERO)}}.lv-paint,.lv-strap{${shades(...PINT)}}.lv-wool{${shades(...AMAR)}}.lv-blanket,.lv-gasket{${shades(...CAUC)}}.lv-agua{${shades(...AGUA)}}
.lv-flujo{fill:none;stroke:#2E5E9E;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}.lv-flecha{fill:#2E5E9E;stroke:none}
.lv-cond{fill:none;stroke:#2E5E9E;stroke-width:1.1px;stroke-linecap:round;stroke-linejoin:round}.lv-cond-p{fill:#2E5E9E;stroke:none}
.lv-perfil{fill:none;stroke:#C2410C;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round}.lv-perfil-p{fill:#C2410C;stroke:none}
.lv-eje{fill:none;stroke:#525C64;stroke-width:.9px;stroke-linecap:round}.lv-eje-p{fill:#525C64;stroke:none}.lv-guia{fill:none;stroke:#8A96A3;stroke-width:.6px}
.lv-det-fondo{fill:#FFFFFF;stroke:none}.lv-det-marco{fill:none;stroke:#525C64;stroke-width:1px}
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
  ? k.figureSvg({ width: W_, height: H_, label: "La pared de la línea, ampliada", body: [`<style>${CSS}</style><defs><clipPath id="lvDet"><circle cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/></clipPath></defs><g class="lv-items" clip-path="url(#lvDet)"><circle class="lv-det-fondo" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="lv-det-marco" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W_, height: H_, label: "Línea de vapor aislada", body: [`<style>${CSS}</style><g class="lv-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
const base = DET ? "detalle" : "fig";
writeFileSync(join(OUTD, `${base}.svg`), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Línea de vapor", theme: "light", width: DET ? 400 : 1100, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, `${base}_data.json`), JSON.stringify({ P, W: W_, H: H_, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, { crowd: [] });
