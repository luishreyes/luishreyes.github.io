/* ====================================================================
   El ciclón de alta eficiencia de Stairmand en isométrico (skill anatomy), para el capítulo 20 del libro de operaciones
   unitarias (Particles and drops in gases, «El ciclón por dentro»): uno de los cuatro ciclones que recogen el polvo del
   aire del secador por aspersión de la planta de café instantáneo, de D = 1,2 m, cortado por el plano del eje (y = 0)
   sin la mitad que mira al lector.
   Concepto: el aire con polvo entra por la entrada tangencial rectangular y baja en espiral pegado a la pared (el
   vórtice de afuera); las partículas gruesas van a la pared y bajan por ella en espiral hasta la boca del cono. El gas
   da la vuelta 2 D por debajo del tubo de salida y sube por el centro, girando más rápido (el vórtice de adentro), hasta
   el tubo de salida, con las partículas finas que no alcanzaron la pared. El polvo cae a la tolva y sale por la válvula
   rotativa, que lo deja salir sin dejar entrar aire.
   Corte: el plano y = 0; se quita la mitad que mira al lector (y > 0) del cilindro, el cono, el techo, el tubo de
   salida con su codo y su ducto, la boca del polvo, la tolva, la válvula rotativa y su rotor. La entrada, las patas,
   el motorreductor y el interruptor de nivel quedan detrás del plano, enteros.
   Uso: node build.mjs [--audit] [--fast] [--check]
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
const { CI, G0, rWall } = GEO;
const FAST = process.argv.includes("--fast");
const DET = process.argv.includes("--detalle");
const CHECK = process.argv.includes("--check");
const STEP = Number(process.env.CI_STEP || (DET ? 2 : 0.5));
const PI = Math.PI, TAU = 2 * Math.PI, D2R = PI / 180;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};
const { R, t: TW } = CI;
const RO = R + TW;
const { re: RE, rOut: RB, zCone: ZC, zTop: ZT, zIn: ZI, zVF: ZV, zEnd: ZE } = G0;
const ZO = CI.zo, B_ = G0.b;
const SLOPE = G0.slope, TC = TW * Math.sqrt(1 + SLOPE * SLOPE);   // el espesor horizontal del cono
const rOutCone = (z) => RB + TC + (z - ZO) * SLOPE;                // la cara de afuera del cono
const ZCO = ZO + (RO - RB - TC) / SLOPE;                            // donde la cara de afuera del cono llega al cilindro

/* ---------- la cámara ---------- */
const W_ = DET ? 300 : 1000, H_ = DET ? 300 : 1500;
const LG = CI.leg, VA = CI.valve, DV = CI.drive, VF = CI.vf;
const EXT = [
  [VF.x1 - 30, 0, VF.top + VF.bend + VF.rFl + 10], [VF.x1 - 30, 0, VF.top + VF.bend - VF.rFl], [0, 0, VF.top + VF.bend + RE + 40],
  [CI.duct.x1 + 520, -480, 7200], [CI.duct.x1 + 30, -RO - 80, ZT + 80], [CI.duct.x1 + 30, -354 + 80, ZI - 80],
  [LG.r * Math.cos(330 * D2R) + LG.ped / 2, LG.r * Math.sin(330 * D2R) + LG.ped / 2, 0], [LG.r * Math.cos(330 * D2R) + LG.ped / 2, LG.r * Math.sin(330 * D2R) - LG.ped / 2, 0],
  [LG.r * Math.cos(210 * D2R) - LG.ped / 2, LG.r * Math.sin(210 * D2R) + LG.ped / 2, 0], [LG.r * Math.cos(210 * D2R) - LG.ped / 2, LG.r * Math.sin(210 * D2R) - LG.ped / 2, 0],
  [0, DV.motor[1] - DV.fan - 10, VA.zc + DV.rMot + 80], [0, 0, 60], [-R - 60, 0, ZT], [R + 60, 0, ZT],
];
const PMAIN = k.fitProjection(EXT, 1000, 1500, { pad: 16, azimuth: CI.AZ, elevation: CI.EL });
// el detalle: la válvula rotativa, en el plano del corte, MDET veces más grande, dentro de un círculo de RDET
const CDET = [0, 0, VA.zc - 10], MDET = 2.7, RDET = 140;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: CI.AZ, elevation: CI.EL }; const c = k.iso(CDET, Q); Q.origin = [W_ / 2 - c[0], H_ / 2 - c[1]]; return Q; })() : PMAIN;
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
const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const BAND = (s) => { const Bd = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < Bd.length && s >= Bd[t]) t++; return t; };
const circ2 = (c2, q) => `M${r10(c2[0] - q)} ${r10(c2[1])}a${r10(q)} ${r10(q)} 0 1 0 ${r10(2 * q)} 0a${r10(q)} ${r10(q)} 0 1 0 ${r10(-2 * q)} 0Z`;

/* El dibujo va en milímetros; el audit, en centímetros (como la prensa de tornillo y la separadora). */
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
const faceSvg = (d, cls, tone = "mid") => `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="0" d="${d}"/><path class="iso-line iso-edge" data-tone="${tone}" d="${d}"/></g>`;
const FY = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
const FV = { o: [0, 0, 0], a: ZD, u: XD, v: YD };
const FZs = { o: [0, 0, 0], a: ZD, u: XD, v: YD };

/* ---------- piezas ---------- */
function box(name, [x0, y0, z0], [x1, y1, z1], { cls = "ci-ss", r = 0.4, steps = 2, extra = "", inner = "", owner = name, ground, ref, rec = true } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const sh = A.box([x0, y0, z0], [x1, y1, z1], { name, owner, ...(ground ? { ground } : {}) });
  if (rec) record(sh);
  put(name, ref || [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, 0), { tone: "mid", inner }), cls) + extra, [sh]);
  return sh;
}
function fp(name, F, poly, s0, s1, { cls = "ci-ss", extra = "", cap = "auto", owner = name, ref = null, ground, rec = true, skip = null, seated, cut } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(ground ? { ground } : {}), ...(seated ? { seated } : {}), ...(cut ? { cut } : {}) });
  if (rec) record(sh);
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", cls, cap, skip }) + extra, [sh]);
  return sh;
}
const ngon = (r, m, ph = 0) => Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m + ph; return [r * Math.cos(t), r * Math.sin(t)]; });
function disc(name, F, s0, s1, r, { cls = "ci-ss", extra = "", owner = name, n = 0, ground, rec = true, cap = "auto" } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * KS) / 1.1)));
  const sh = A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(ground ? { ground } : {}) });
  if (rec) record(sh);
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), X.prismSvg(C, ngon(r, m), Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cls, cap }) + extra, [sh]);
  return sh;
}
function turned(name, F, meridian, { cls = "ci-ss", extra = "", owner = name, steps = 48, rec = true } = {}) {
  const paths = G.lathe(meridian, F, P, { steps });
  const sh = A.lathe(F, meridian, { name, owner });
  if (rec) record(sh);
  const s0 = Math.min(...meridian.map((q) => q[0])), s1 = Math.max(...meridian.map((q) => q[0]));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(S(paths, { tone: "mid" }), cls) + extra, [sh]);
  return sh;
}

/* ---------- semilla ---------- */
let seed = 20;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ====================================================================
   el barrido (de la prensa de tornillo y la separadora): una sección (s, r) que gira alrededor de un eje. Se pinta cara
   por cara, de atrás hacia adelante; cada arista se dibuja con la cara visible que va después.
   ==================================================================== */
// shadePhi: si se da, el tono de cada cara sale de su normal en ese ángulo (las bandas siguen la sección, como en un
// tubo, sin escalones donde una banda cruza la malla); la visibilidad sigue saliendo de la normal de verdad
function sweepSvg({ F, profile, a0, a1, steps = 0, smooth = [], skip = [], capA = "end", capB = "end", cls = "ci-ss", cutCls = "ci-cut", tone = "mid", shadePhi = null }) {
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
  const keyOf = (f) => { if (f.cap && f.mode === "cut") return `<path class="iso-shade" data-shade="0" d="D"/>`; const b = BAND(G.dot3(f.ns || f.n, L3)); return b >= 4 ? `<path class="iso-top" d="D"/>` : `<path class="iso-shade" data-shade="${b}" d="D"/>`; };
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
   las piezas de revolución del eje del ciclón: la mitad de atrás (180° a 360°) en sectores, sin tapas, y las caras del
   corte en el plano y = 0 aparte
   ==================================================================== */
const BIG = 20000;
const halfSpace = (n) => A.orientedBox(G.mul3(n, BIG), [n, G.cross3(ZD, n), ZD], [BIG, BIG, BIG], { name: "corte" });
const wedgeCuts = (a0, a1) => { const p0 = a0 * D2R, p1 = a1 * D2R; return [halfSpace([Math.sin(p0), -Math.cos(p0), 0]), halfSpace([-Math.sin(p1), Math.cos(p1), 0])]; };
// el semiespacio n·(x − o) > 0, para quitarlo de una forma (con una base ortonormal cualquiera)
const halfSpaceAt = (n, o) => { n = G.unit3(n); const p = G.unit3(Math.abs(n[2]) < 0.9 ? G.cross3(ZD, n) : G.cross3(XD, n)); return A.orientedBox(G.add3(o, G.mul3(n, BIG)), [n, p, G.cross3(n, p)], [BIG, BIG, BIG], { name: "corte" }); };
// la cuña de ángulos [a0, a1] alrededor del eje de un marco F (ángulo medido de F.u hacia F.v)
const wedgeCutsF = (F, a0, a1) => { const p0 = a0 * D2R, p1 = a1 * D2R; return [halfSpaceAt(G.sub3(G.mul3(F.u, Math.sin(p0)), G.mul3(F.v, Math.cos(p0))), F.o), halfSpaceAt(G.add3(G.mul3(F.u, -Math.sin(p1)), G.mul3(F.v, Math.cos(p1))), F.o)]; };
const SECT = [[180, 255], [255, 330], [330, 360]];
const SECT2 = [[180, 300], [300, 360]];
// prof: polígono cerrado en (r, z); se gira alrededor del eje vertical (o del eje de F)
function revBack(name, prof, { cls = "ci-ss", owner = name, sectors = SECT, skip = [], smooth = [], rec = true, ref = null, tone = "mid", extras = null, F = FV, caps = null } = {}) {
  const profile = prof.map(([r, z]) => [z, r]);
  const rmax = Math.max(...prof.map((q) => q[0])), zc = prof.reduce((q, p) => q + p[1], 0) / prof.length;
  const out = [];
  for (const [a0, a1] of sectors) {
    const steps = Math.max(3, Math.round((a1 - a0) / 6));
    const cp = caps ? caps(a0, a1) : ["none", "none"];
    const svg = sweepSvg({ F, profile, a0: a0 * D2R, a1: a1 * D2R, cls, capA: cp[0], capB: cp[1], skip, smooth, steps, tone }) + (extras ? extras(a0, a1) : "");
    const sh = A.lathe(F, profile, { name: `${name}.${Math.round(a0)}`, owner, cut: F === FV ? wedgeCuts(a0, a1) : wedgeCutsF(F, a0, a1) });
    if (rec) record(sh);
    const am = ((a0 + a1) / 2) * D2R, rr = ref ? ref : rmax * 0.8;
    const c3 = G.add3(G.add3(F.o, G.mul3(F.a, zc)), G.add3(G.mul3(F.u, rr * Math.cos(am)), G.mul3(F.v, rr * Math.sin(am))));
    put(`${name}.${Math.round(a0)}`, c3, svg, [sh]);
    out.push(sh);
  }
  return out;
}
// los puntos de un círculo de pernos que caen en un sector
const boltsIn = (r, z, step, phase = 0, size = 0.55) => (a0, a1) => { const pts = []; for (let a = 180 + phase; a < 360; a += step) if (a >= a0 && a < a1) pts.push(at([r * Math.cos(a * D2R), r * Math.sin(a * D2R), z])); return pts.length ? Dots(pts, { size, tone: "mid" }) : ""; };
// una cara del corte: polígono en (x, z) en y = 0
const capPolys = [];
function cap(name, polyXZ, { cls = "ci-cut", owner = name, rec = true, tone = "mid", extra = "", kind = "metal" } = {}) {
  const d = pth1(polyXZ.map(([x, z]) => pr([x, 0, z])));
  const sh = A.prism(FY, polyXZ, -0.3, 0, { name, owner });
  if (rec) record(sh);
  const cx = polyXZ.reduce((q, p) => q + p[0], 0) / polyXZ.length, cz = polyXZ.reduce((q, p) => q + p[1], 0) / polyXZ.length;
  put(name, [cx, 0, cz], faceSvg(d, cls, tone) + extra, [sh]);
  capPolys.push({ name, poly: polyXZ, kind });
}
const mirror = (polyRZ, s) => polyRZ.map(([r, z]) => [s * r, z]);
function capsLR(name, right, left = right, opts = {}) {
  if (right) cap(`${name}.der`, mirror(right, 1), opts);
  if (left) cap(`${name}.izq`, mirror(left, -1), opts);
}
// una cara de polvo en el plano del corte (no sostiene nada)
function powder(name, polyXZ, { cls = "ci-polvo-c", extra = "", line = "ci-polvo-line", front = 0, grains = 0 } = {}) {
  const d = pth1(polyXZ.map(([x, z]) => pr([x, 0, z])));
  const sh = A.prism(FY, polyXZ, front - 0.3, front, { name, owner: "polvo" });
  const cx = polyXZ.reduce((q, p) => q + p[0], 0) / polyXZ.length, cz = polyXZ.reduce((q, p) => q + p[1], 0) / polyXZ.length;
  let gr = "";
  if (grains) {
    const xs = polyXZ.map((q) => q[0]), zs = polyXZ.map((q) => q[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), z0 = Math.min(...zs), z1 = Math.max(...zs);
    for (let tries = 0, c = 0; tries < grains * 40 && c < grains; tries++) {
      const x = x0 + rnd() * (x1 - x0), z = z0 + rnd() * (z1 - z0), q = 9;
      if (!inPoly(polyXZ, x, z) || !inPoly(polyXZ, x + q, z) || !inPoly(polyXZ, x - q, z) || !inPoly(polyXZ, x, z + q) || !inPoly(polyXZ, x, z - q)) continue;
      gr += circ2(pr([x, 0, z]), 0.55 + rnd() * 0.5); c++;
    }
  }
  put(name, [cx, 0, cz], `<path class="${cls}" d="${d}"/>` + (gr ? `<path class="ci-grano" d="${gr}"/>` : "") + extra + (line ? `<path class="${line}" d="${d}"/>` : ""), [sh]);
  capPolys.push({ name, poly: polyXZ, kind: "polvo" });
}
const arcPts = (cx, cz, r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + ((a1 - a0) * i) / n) * D2R; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });

/* ====================================================================
   1 · la envolvente: el cilindro de 1,5 D y el cono de 2,5 D, de acero inoxidable de 6 mm, con la boca de la entrada
   tangencial en la pared de atrás (de θ = 270°, donde la pared del ducto es tangente, a θ = 323°, donde la otra pared
   del ducto llega al cilindro)
   ==================================================================== */
const TH_J = 360 - Math.asin((R - B_) / R) / D2R;          // 323,13°
const SHELL_LOW = [[RB, ZO], [R, ZC], [R, ZI], [RO, ZI], [RO, ZCO], [RB + TC, ZO]];
const SHELL_UP = [[R, ZI], [RO, ZI], [RO, ZT], [R, ZT]];
const SHELL_CUT = [[R, ZT], [RO, ZT], [RO, ZCO], [RB + TC, ZO], [RB, ZO], [R, ZC]];
{
  const own = "ciclon";
  // las costuras de soldadura: una circunferencial en el cilindro y otra en el cono, y una a lo largo de cada uno, por
  // dentro (donde se ve la cara de adentro) y por fuera (de 330° a 360°)
  const ring = (z, r, a0, a1) => { const pts = []; for (let a = a0; a <= a1 + 1e-6; a += (a1 - a0) / Math.max(2, Math.round((a1 - a0) / 3))) pts.push(at([r * Math.cos(a * D2R), r * Math.sin(a * D2R), z])); return pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join(""); };
  const seams = (zg, thV, zV0, zV1) => (a0, a1) => {
    const out = a1 <= 330 + 1e-6, rIn = rWall(zg), rS = out ? rIn : rIn + TW;
    let d = ring(zg, a1 <= 330 + 1e-6 ? rIn : rS, a0, a1);
    if (thV >= a0 && thV < a1) { const n = 12, pts = []; for (let j = 0; j <= n; j++) { const z = zV0 + ((zV1 - zV0) * j) / n; pts.push(at([rWall(z) * Math.cos(thV * D2R), rWall(z) * Math.sin(thV * D2R), z])); } d += pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join(""); }
    return Ln(d, { tone: "faint" });
  };
  revBack("cono", [[RB, ZO], [R, ZC], [RO, ZC], [RO, ZCO], [RB + TC, ZO]], { owner: own, sectors: SECT, extras: seams(4200, 228, ZO, ZC) });
  revBack("cilindro", [[R, ZC], [RO, ZC], [RO, ZI], [R, ZI]], { owner: own, sectors: SECT, extras: seams(6300, 242, ZC, ZI) });
  revBack("cilindro.arriba", SHELL_UP, { owner: own, sectors: [[180, 230], [230, 270], [TH_J, 330], [330, 360]] });
  capsLR("envolvente", SHELL_CUT, SHELL_CUT, { owner: own });
  ANCH.CILINDRO = [-(R - 4), -0, (ZC + ZI) / 2];
  ANCH.CONO = [-(rWall(4000) - 2), 0, 4000];
  ANCH.CILINDRO_FUERA = [RO * Math.cos(350 * D2R), RO * Math.sin(350 * D2R), 6200];
}

/* ====================================================================
   2 · el techo y la entrada tangencial: el ducto rectangular de 0,5 D × 0,2 D que llega de la derecha, con su pared de
   afuera tangente al cilindro, su piso, su tapa (la misma placa del techo) y la brida del ducto del secador
   ==================================================================== */
const YIN = -(R - B_);              // −360: la cara de adentro (del lado del gas) de la pared interior del ducto
const DU = CI.duct;
{
  const own = "ciclon";
  const T = CI.roof, ZR = ZT + T;
  const xA = Math.sqrt(RO * RO - (YIN + TW) ** 2);     // donde la cara de afuera de la pared interior toca el cilindro
  // el techo: media corona sobre el cilindro y la tapa del ducto, de una pieza
  const plan = [[RO, 0]];
  const thA = 360 - Math.asin(-(YIN + TW) / RO) / D2R;
  for (let a = 356; a > thA; a -= 4) plan.push([RO * Math.cos(a * D2R), RO * Math.sin(a * D2R)]);
  plan.push([xA, YIN + TW], [DU.x1, YIN + TW], [DU.x1, -RO], [0, -RO]);
  for (let a = 266; a > 180; a -= 4) plan.push([RO * Math.cos(a * D2R), RO * Math.sin(a * D2R)]);
  plan.push([-RO, 0], [-(RE + TW), 0]);
  for (let a = 184; a < 360; a += 4) plan.push([(RE + TW) * Math.cos(a * D2R), (RE + TW) * Math.sin(a * D2R)]);
  plan.push([RE + TW, 0]);
  const skip = new Set(); plan.forEach((p, i) => { const q = plan[(i + 1) % plan.length]; if (Math.abs(p[1]) < 1e-6 && Math.abs(q[1]) < 1e-6) skip.add(i); });
  fp("techo", FZs, plan, ZT, ZR, { owner: own, skip, ref: [0, -450, ZR] });
  cap("techo.der", [[RE + TW, ZT], [RO, ZT], [RO, ZR], [RE + TW, ZR]], { owner: own });
  cap("techo.izq", [[-RO, ZT], [-(RE + TW), ZT], [-(RE + TW), ZR], [-RO, ZR]], { owner: own });
  // las orejas de izar, sobre el techo
  for (const a of [200, 330]) {
    const ph = a * D2R, er = [Math.cos(ph), Math.sin(ph), 0], et = [-Math.sin(ph), Math.cos(ph), 0], rc = 500;
    const Fo = { o: [rc * er[0], rc * er[1], 0], a: et, u: er, v: ZD };
    const hole = (() => { const c = G.add3(Fo.o, [0, 0, ZR + 70]); return Fo; })();
    void hole;
    const lugPoly = [[-55, ZR], [55, ZR], [55, ZR + 60], [30, ZR + 105], [-30, ZR + 105], [-55, ZR + 60]];
    const hc = G.add3(G.add3(Fo.o, G.mul3(et, 8)), [0, 0, ZR + 70]);
    const hd = [];
    for (let i = 0; i < 20; i++) { const tq = (TAU * i) / 20; hd.push(pr(G.add3(hc, G.add3(G.mul3(er, 16 * Math.cos(tq)), [0, 0, 16 * Math.sin(tq)])))); }
    fp(`techo.oreja${a}`, Fo, lugPoly, -8, 8, { owner: own, extra: `<path class="ci-bore" d="${pth1(hd)}"/>` });
  }
  // la pared de afuera del ducto (tangente al cilindro en θ = 270°), la de adentro, el piso
  box("entrada.pared-afuera", [0, -RO, ZI], [DU.x1, -R, ZT], { owner: own, r: 0, steps: 1, cls: "ci-in" });
  const xIn0 = Math.sqrt(R * R - YIN * YIN);
  fp("entrada.pared-adentro", FZs, [[xIn0, YIN], [DU.x1, YIN], [DU.x1, YIN + TW], [xA, YIN + TW]], ZI, ZT, { owner: own });
  const floor = [[0, -RO], [DU.x1, -RO], [DU.x1, YIN + TW], [xA, YIN + TW]];
  for (let a = thA - 3; a > 270; a -= 3) floor.push([RO * Math.cos(a * D2R), RO * Math.sin(a * D2R)]);
  fp("entrada.piso", FZs, floor, ZI - 8, ZI, { owner: own, cls: "ci-in" });
  // la brida del ducto: un marco de cuatro barras
  const xf0 = DU.x1, xf1 = DU.x1 + DU.fl, m = DU.rim, yA = -RO - m, yB = YIN + TW + m, zA = ZI - 8 - m, zB = ZR + m;
  const bolts = (pts) => Dots(pts.map((p) => at([xf1, p[0], p[1]])), { size: 0.55, tone: "mid" });
  const yb = [yA + m / 2, YIN + TW + m / 2], zb = [zA + m / 2, zB - m / 2];
  const ys = [], zs = [];
  for (let j = 0; j <= 4; j++) ys.push(yA + m / 2 + ((yB - yA - m) * j) / 4);
  for (let j = 1; j < 6; j++) zs.push(zA + m / 2 + ((zB - zA - m) * j) / 6);
  box("entrada.brida.arriba", [xf0, yA, ZR], [xf1, yB, zB], { owner: own, r: 0, steps: 1, extra: bolts(ys.map((y) => [y, zb[1]])) });
  box("entrada.brida.abajo", [xf0, yA, zA], [xf1, yB, ZI - 8], { owner: own, r: 0, steps: 1, extra: bolts(ys.map((y) => [y, zb[0]])) });
  box("entrada.brida.atras", [xf0, yA, ZI - 8], [xf1, -RO, ZR], { owner: own, r: 0, steps: 1, extra: bolts(zs.map((z) => [yb[0], z])) });
  box("entrada.brida.frente", [xf0, YIN + TW, ZI - 8], [xf1, yB, ZR], { owner: own, r: 0, steps: 1, extra: bolts(zs.map((z) => [yb[1], z])) });
  // la placa de datos, en la cara de la pared de adentro del ducto (sin texto: tres renglones)
  const pl = { x0: 780, x1: 1040, z0: 7080, z1: 7300 }, yP = YIN + TW + 3;
  const rows = [];
  for (const zz of [7240, 7190, 7140]) { const a2 = at([pl.x0 + 30, yP, zz]), b2 = at([pl.x1 - 30, yP, zz]); rows.push(`M${r10(a2[0])} ${r10(a2[1])}L${r10(b2[0])} ${r10(b2[1])}`); }
  const riv = [[pl.x0 + 14, pl.z0 + 14], [pl.x1 - 14, pl.z0 + 14], [pl.x0 + 14, pl.z1 - 14], [pl.x1 - 14, pl.z1 - 14]].map(([x, z]) => at([x, yP, z]));
  box("entrada.placa", [pl.x0, YIN + TW, pl.z0], [pl.x1, yP, pl.z1], { owner: own, r: 0, steps: 1, cls: "ci-plate", extra: Ln(rows.join(""), { tone: "lo", free: true }) + Dots(riv, { size: 0.45, tone: "mid" }) });
  ANCH.ENTRADA = [1250, YIN + TW, 7400];
  ANCH.BRIDA_ENTRADA = [xf1, yB - m / 2, ZI + 100];
  ANCH.TECHO = [-450 * Math.cos(20 * D2R), -450 * Math.sin(20 * D2R) - 60, ZR];
  ANCH.BOCA_ENTRADA = [RO * Math.cos(300 * D2R) - 10, RO * Math.sin(300 * D2R) + 10, ZI + 60];
}

/* ====================================================================
   3 · el tubo de salida (el buscador de vórtice): de 0,5 D, entra 0,5 D en el cuerpo, hasta abajo de la entrada; sale
   por el techo a una brida, al codo y al ducto que va al filtro de mangas
   ==================================================================== */
{
  const own = "salida";
  const T = CI.roof, ZR = ZT + T;
  const [f0, f1] = VF.fl, fm = (f0 + f1) / 2;
  revBack("tubo-salida.adentro", [[RE, ZV], [RE + TW, ZV], [RE + TW, ZT], [RE, ZT]], { owner: own, sectors: SECT });
  revBack("tubo-salida.arriba", [[RE, ZR], [RE + TW, ZR], [RE + TW, f0], [RE, f0]], { owner: own, sectors: SECT });
  capsLR("tubo-salida", [[RE, ZV], [RE + TW, ZV], [RE + TW, f0], [RE, f0]], undefined, { owner: own });
  revBack("tubo-salida.brida", [[RE, f0], [VF.rFl, f0], [VF.rFl, fm], [RE, fm]], { owner: own, sectors: SECT });
  revBack("salida.brida", [[RE, fm], [VF.rFl, fm], [VF.rFl, f1], [RE, f1]], { owner: own, sectors: SECT, extras: boltsIn((RE + VF.rFl) / 2 + 12, f1, 15, 7.5) });
  capsLR("tubo-salida.brida", [[RE, f0], [VF.rFl, f0], [VF.rFl, fm], [RE, fm]], undefined, { owner: own });
  capsLR("salida.brida", [[RE, fm], [VF.rFl, fm], [VF.rFl, f1], [RE, f1]], undefined, { owner: own });
  revBack("salida.tubo", [[RE, f1], [RE + TW, f1], [RE + TW, VF.top], [RE, VF.top]], { owner: own, sectors: SECT });
  capsLR("salida.tubo", [[RE, f1], [RE + TW, f1], [RE + TW, VF.top], [RE, VF.top]], undefined, { owner: own });
  // el codo: un toro alrededor de un eje paralelo a y que pasa por (−bend, 0, top); la mitad de atrás (y ≤ 0)
  const Rb = VF.bend, Fe = { o: [-Rb, 0, VF.top], a: YD, u: XD, v: ZD };
  const halfAnn = [];
  const NS = 24;
  for (let i = 0; i <= NS; i++) { const ps = (PI * i) / NS; halfAnn.push([-(RE + TW) * Math.sin(ps), Rb + (RE + TW) * Math.cos(ps)]); }
  for (let i = NS; i >= 0; i--) { const ps = (PI * i) / NS; halfAnn.push([-RE * Math.sin(ps), Rb + RE * Math.cos(ps)]); }
  const cleaned = halfAnn.map(([s, r]) => [Math.abs(s) < 1e-9 ? 0 : s, r]);
  const skipE = []; cleaned.forEach((p, i) => { const q = cleaned[(i + 1) % cleaned.length]; if (p[0] === 0 && q[0] === 0) skipE.push(i); });
  // cuatro gajos (un codo de ducto de 600 mm se arma así), cada uno con el tono de su mitad y la soldadura de la junta
  const seam = (phi) => { const pts = []; for (let i = 0; i <= 16; i++) { const ps = (PI * i) / 16; pts.push(at([-Rb + (Rb + RE * Math.cos(ps)) * Math.cos(phi * D2R), -RE * Math.sin(ps), VF.top + (Rb + RE * Math.cos(ps)) * Math.sin(phi * D2R)])); } return Ln(pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join(""), { tone: "faint" }); };
  for (const [b0, b1] of [[0, 22.5], [22.5, 45], [45, 67.5], [67.5, 90]]) {
    const svg = sweepSvg({ F: Fe, profile: cleaned, a0: b0 * D2R, a1: b1 * D2R, capA: "none", capB: "none", skip: skipE, smooth: cleaned.map((_, i) => i).filter((i) => !skipE.includes(i) && !skipE.includes((i - 1 + cleaned.length) % cleaned.length)), steps: 6, shadePhi: ((b0 + b1) / 2) * D2R }) + (b0 > 0 ? seam(b0) : "");
    const sh = record(A.lathe(Fe, cleaned, { name: `codo.${b0}`, owner: own, cut: wedgeCutsF(Fe, b0, b1) }));
    const am = ((b0 + b1) / 2) * D2R;
    put(`codo.${b0}`, [-Rb + Rb * Math.cos(am), -RE * 0.7, VF.top + Rb * Math.sin(am)], svg, [sh]);
  }
  // las caras del corte del codo: dos bandas de anillo en el plano y = 0
  const band = (r0, r1) => [...arcPts(-Rb, VF.top, r1, 0, 90, 18), ...arcPts(-Rb, VF.top, r0, 90, 0, 18)];
  cap("codo.afuera", band(Rb + RE, Rb + RE + TW), { owner: own });
  cap("codo.adentro", band(Rb - RE - TW, Rb - RE), { owner: own });
  // el ducto al filtro: horizontal, hacia −x
  const zH = VF.top + Rb, Fh = { o: [0, 0, zH], a: XD, u: YD, v: ZD }, x0 = -Rb, x1 = VF.x1;
  const pipeSweep = (nm, prof, extra = "", ref) => {
    const svg = sweepSvg({ F: Fh, profile: prof, a0: PI / 2, a1: 1.5 * PI, capA: "none", capB: "none", steps: 18 }) + extra;
    const sh = record(A.lathe(Fh, prof, { name: nm, owner: own, cut: [A.box([-BIG, 0, -BIG], [BIG, BIG, BIG])] }));
    put(nm, ref, svg, [sh]);
  };
  pipeSweep("ducto-filtro", [[x0, RE], [x1, RE], [x1, RE + TW], [x0, RE + TW]], "", [(x0 + x1) / 2, -RE * 0.7, zH]);
  cap("ducto-filtro.arriba", [[x1, zH + RE], [x0, zH + RE], [x0, zH + RE + TW], [x1, zH + RE + TW]], { owner: own });
  cap("ducto-filtro.abajo", [[x1, zH - RE - TW], [x0, zH - RE - TW], [x0, zH - RE], [x1, zH - RE]], { owner: own });
  const dots = []; for (let a = 105; a < 260; a += 22.5) dots.push(at([x1, (RE + 55) * Math.cos(a * D2R), zH + (RE + 55) * Math.sin(a * D2R)]));
  pipeSweep("ducto-filtro.brida", [[x1, RE + TW], [x1 - VF.flT, RE + TW], [x1 - VF.flT, VF.rFl], [x1, VF.rFl]], Dots(dots, { size: 0.55, tone: "mid" }), [x1 - 10, -(RE + 40), zH]);
  cap("ducto-filtro.brida.arriba", [[x1 - VF.flT, zH + RE + TW], [x1, zH + RE + TW], [x1, zH + VF.rFl], [x1 - VF.flT, zH + VF.rFl]], { owner: own });
  cap("ducto-filtro.brida.abajo", [[x1 - VF.flT, zH - VF.rFl], [x1, zH - VF.rFl], [x1, zH - RE - TW], [x1 - VF.flT, zH - RE - TW]], { owner: own });
  ANCH.TUBO_SALIDA = [-(RE + TW), 0, (ZV + ZT) / 2];
  ANCH.TUBO_SALIDA_PUNTA = [RE + 3, 0, ZV + 3];
  ANCH.BRIDA_SALIDA = [VF.rFl * Math.cos(300 * D2R), VF.rFl * Math.sin(300 * D2R), fm];
  ANCH.CODO = [-Rb + (Rb + RE + TW) * Math.cos(45 * D2R), 0, VF.top + (Rb + RE + TW) * Math.sin(45 * D2R)];
}

/* ====================================================================
   4 · la boca del polvo (0,375 D), las bridas y la tolva colectora de diámetro D, con su cono a 60°, su boca y el
   interruptor de nivel alto
   ==================================================================== */
const HP = CI.hop, NK = CI.neck;
const HOP_ZK = HP.zc + (RO - (HP.rOut + TW / Math.sin(HP.ang * D2R))) * Math.tan(HP.ang * D2R);
const HOP = [[HP.rOut, HP.zc], [R, HP.z0], [R, HP.z1], [RO, HP.z1], [RO, HOP_ZK], [HP.rOut + TW / Math.sin(HP.ang * D2R), HP.zc]];
const hopWall = (z) => (z >= HP.z0 ? R : HP.rOut + (z - HP.zc) / Math.tan(HP.ang * D2R));
{
  const own = "tolva";
  const [g0, g1] = NK.fl, gm = (g0 + g1) / 2;
  revBack("boca", [[RB, gm], [RB + TW, gm], [RB + TW, ZO], [RB, ZO]], { owner: "ciclon", sectors: SECT });
  capsLR("boca", [[RB, gm], [RB + TW, gm], [RB + TW, ZO], [RB, ZO]], undefined, { owner: "ciclon" });
  revBack("boca.brida", [[RB + TW, gm], [NK.rFl, gm], [NK.rFl, g1], [RB + TW, g1]], { owner: "ciclon", sectors: SECT, extras: boltsIn(NK.rFl - 35, g1, 20, 10) });
  capsLR("boca.brida", [[RB + TW, gm], [NK.rFl, gm], [NK.rFl, g1], [RB + TW, g1]], undefined, { owner: "ciclon" });
  revBack("tolva.boquilla", [[RB, HP.z1 + 8], [RB + TW, HP.z1 + 8], [RB + TW, gm], [RB, gm]], { owner: own, sectors: SECT });
  capsLR("tolva.boquilla", [[RB, HP.z1 + 8], [RB + TW, HP.z1 + 8], [RB + TW, gm], [RB, gm]], undefined, { owner: own });
  revBack("tolva.boquilla.brida", [[RB + TW, g0], [NK.rFl, g0], [NK.rFl, gm], [RB + TW, gm]], { owner: own, sectors: SECT });
  capsLR("tolva.boquilla.brida", [[RB + TW, g0], [NK.rFl, g0], [NK.rFl, gm], [RB + TW, gm]], undefined, { owner: own });
  revBack("tolva.techo", [[RB, HP.z1], [RO, HP.z1], [RO, HP.z1 + 8], [RB, HP.z1 + 8]], { owner: own, sectors: SECT });
  capsLR("tolva.techo", [[RB, HP.z1], [RO, HP.z1], [RO, HP.z1 + 8], [RB, HP.z1 + 8]], undefined, { owner: own });
  revBack("tolva", HOP, { owner: own, sectors: SECT });
  capsLR("tolva", HOP, undefined, { owner: own });
  const NZ = [[HP.rOut, HP.noz], [HP.rOut + TW, HP.noz], [HP.rOut + TW, HP.zc], [HP.rOut, HP.zc]];
  revBack("tolva.salida", NZ, { owner: own, sectors: SECT });
  capsLR("tolva.salida", NZ, undefined, { owner: own });
  const NF = [[HP.rOut, HP.fl[0]], [HP.rFl, HP.fl[0]], [HP.rFl, HP.fl[1]], [HP.rOut, HP.fl[1]]];
  revBack("tolva.salida.brida", NF, { owner: own, sectors: SECT, extras: boltsIn(HP.rFl - 30, HP.fl[1], 30, 15) });
  capsLR("tolva.salida.brida", NF, undefined, { owner: own });
  // el interruptor de nivel alto: la boquilla, el cuerpo, la cabeza con su prensaestopas y la sonda adentro
  const LV = CI.level, ph = LV.th * D2R, er = [Math.cos(ph), Math.sin(ph), 0];
  const Fl = { o: [0, 0, LV.z], a: er, u: ZD, v: G.cross3(er, ZD) };
  disc("nivel.boquilla", Fl, R + 1, RO + 34, 32, { cls: "ci-ss", owner: own });
  disc("nivel.cuerpo", Fl, RO + 34, RO + 94, 40, { cls: "ci-paint", owner: own, n: 6 });
  disc("nivel.cabeza", Fl, RO + 94, RO + 164, 56, { cls: "ci-paint", owner: own });
  const top = G.add3(G.mul3(er, RO + 129), [0, 0, LV.z]);
  disc("nivel.prensa", { o: [top[0], top[1], 0], a: ZD, u: XD, v: YD }, LV.z + 55, LV.z + 85, 13, { cls: "ci-ss", owner: own, n: 6 });
  disc("nivel.sonda", Fl, 380, R + 1, 11, { cls: "ci-ss", owner: own });
  ANCH.NIVEL = G.add3(G.mul3(er, RO + 150), [0, 0, LV.z + 30]);
  ANCH.SONDA = G.add3(G.mul3(er, 420), [0, 0, LV.z + 6]);
  ANCH.TOLVA = [RO * Math.cos(352 * D2R), RO * Math.sin(352 * D2R), 2050];
  ANCH.TOLVA_DENTRO = [-(R - 6), 0, 2300];
  ANCH.BOCA = [-(RB + TW), 0, ZO - 40];
  ANCH.BRIDA_BOCA = [NK.rFl * Math.cos(330 * D2R), NK.rFl * Math.sin(330 * D2R), g1];
}

/* ====================================================================
   5 · la válvula rotativa: la carcasa (dos piezas a los lados del rotor, en el corte, y la tapa de atrás), el rotor de
   ocho paletas, la caja del rodamiento, la linterna, el reductor y el motor
   ==================================================================== */
const zcV = VA.zc;
const SV_OUT = (() => {
  const h = VA.half, c = VA.ch, f = VA.fl, fx = VA.flX, zt = zcV + h, zb = zcV - h;
  return [[-fx, zt + f], [fx, zt + f], [fx, zt], [h - c, zt], [h, zt - c], [h, zb + c], [h - c, zb], [fx, zb], [fx, zb - f], [-fx, zb - f], [-fx, zb], [-(h - c), zb], [-h, zb + c], [-h, zt - c], [-(h - c), zt], [-fx, zt]];
})();
const ROTOR_FRAME = { o: [0, 0, zcV], a: YD, u: XD, v: ZD };
const VANES = Array.from({ length: VA.n }, (_, i) => 22.5 + (360 / VA.n) * i);
const vanePoly = (al) => { const c = Math.cos(al * D2R), s = Math.sin(al * D2R), h = VA.vane / 2; return [[VA.hub - 2, -h], [VA.tip, -h], [VA.tip, h], [VA.hub - 2, h]].map(([r, w]) => [r * c - w * s, r * s + w * c]); };
{
  const own = "valvula";
  const h = VA.half, f = VA.fl, fx = VA.flX, zt = zcV + h, zb = zcV - h, sl = VA.slot, bo = VA.bore;
  const zs = Math.sqrt(bo * bo - sl * sl);
  // la pieza de la izquierda (en el corte), del ala de arriba al ala de abajo y por el borde del alojamiento
  const left = [[-sl, zt + f], [-fx, zt + f], [-fx, zt], [-(h - VA.ch), zt], [-h, zt - VA.ch], [-h, zb + VA.ch], [-(h - VA.ch), zb], [-fx, zb], [-fx, zb - f], [-sl, zb - f], [-sl, zcV - zs], ...arcPts(0, zcV, bo, 180 + Math.atan2(zs, sl) / D2R, 180 - Math.atan2(zs, sl) / D2R, 16).slice(1, -1), [-sl, zcV + zs]];
  const right = left.map(([x, z]) => [-x, z]).reverse();
  const FYb = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
  fp("valvula.cuerpo.izq", FYb, left, -VA.len, 0, { cls: "ci-cast", owner: own, cap: "none", ref: [-h + 30, -VA.len / 2, zcV] });
  fp("valvula.cuerpo.der", FYb, right, -VA.len, 0, { cls: "ci-cast", owner: own, cap: "none", ref: [h - 30, -VA.len / 2, zcV] });
  cap("valvula.corte.izq", left, { cls: "ci-cut-c", owner: own });
  cap("valvula.corte.der", right, { cls: "ci-cut-c", owner: own });
  // la tapa de atrás, con los pernos de la caja del rodamiento
  fp("valvula.tapa", FYb, SV_OUT, -VA.len - VA.end, -VA.len, { cls: "ci-cast", owner: own, ref: [0, -VA.len - VA.end / 2, zcV] });
  // el rotor: el cubo y ocho paletas (sin la cara del corte; esa va de una pieza, abajo)
  disc("rotor.cubo", ROTOR_FRAME, -VA.len, 0, VA.hub, { cls: "ci-ss", owner: own, cap: "none" });
  VANES.forEach((al, i) => fp(`rotor.paleta${i}`, ROTOR_FRAME, vanePoly(al), -VA.len, 0, { cls: "ci-ss", owner: own, cap: "none" }));
  // la cara del corte del rotor: el cubo con las paletas, de una pieza
  const star = [];
  VANES.forEach((al, i) => {
    const w = (VA.vane / 2) / VA.hub, aw = Math.asin((VA.vane / 2) / VA.tip) / D2R;
    const a0 = al * D2R;
    const next = VANES[(i + 1) % VA.n] * D2R + (i === VA.n - 1 ? TAU : 0);
    star.push([VA.hub * Math.cos(a0 - w), VA.hub * Math.sin(a0 - w)]);
    star.push([VA.tip * Math.cos(a0 - aw * D2R), VA.tip * Math.sin(a0 - aw * D2R)], [VA.tip * Math.cos(a0 + aw * D2R), VA.tip * Math.sin(a0 + aw * D2R)]);
    star.push([VA.hub * Math.cos(a0 + w), VA.hub * Math.sin(a0 + w)]);
    for (let j = 1; j < 6; j++) { const q = a0 + w + ((next - w - (a0 + w)) * j) / 6; star.push([VA.hub * Math.cos(q), VA.hub * Math.sin(q)]); }
  });
  const starXZ = star.map(([x, z]) => [x, zcV + z]);
  cap("rotor.corte", starXZ, { cls: "ci-cut", owner: own });
  // el giro del rotor: una flecha en el plano del corte, por encima del cubo, en el sentido de las agujas del reloj
  line("flujo.rotor", arcPts(0, zcV, 132, 158, 28, 24).map(([x, z]) => [x, 10, z]), { cls: "ci-giro", hcls: "ci-giro-p", r: 3, head: DET ? 18 : 7, w: DET ? 7 : 3.4 });
  // el eje (un punto en el centro del cubo)
  const ec = at([0, 0, zcV]);
  put("rotor.eje", [0, 2, zcV], `<path class="ci-bore" d="${circ2(ec, 32 * KS)}"/>`, [A.disc(ROTOR_FRAME, 0, 2, 32)]);
  // la caja del rodamiento, la linterna, el reductor y el motor, detrás
  const Fd = { o: [0, 0, zcV], a: YD, u: XD, v: ZD };
  disc("rodamiento", Fd, DV.brg[1], DV.brg[0], DV.rBrg, { cls: "ci-cast", owner: own, extra: Dots(ngon(DV.rBrg - 18, 6, PI / 6).map(([u, v]) => at([u, DV.brg[1], zcV + v])), { size: 0.5, tone: "mid" }) });
  box("linterna", [-75, DV.lant[1], zcV - 75], [75, DV.lant[0], zcV + 75], { cls: "ci-cast", owner: own, r: 6, steps: 2 });
  const bh = DV.boxH;
  box("reductor", [-bh, DV.box[1], zcV - bh], [bh, DV.box[0] - 16, zcV + bh], { cls: "ci-paint", owner: own, r: 14, steps: 3 });
  box("reductor.brida", [-bh - 12, DV.box[0] - 16, zcV - bh - 12], [bh + 12, DV.box[0], zcV + bh + 12], { cls: "ci-paint", owner: own, r: 4, steps: 2 });
  const Fm = { o: [0, 0, zcV], a: [0, -1, 0], u: XD, v: ZD };
  const m0 = -DV.motor[0], m1 = -DV.motor[1], rm = DV.rMot;
  const fins = G.ribsOf(Fm, m0 + 40, m1 - 30, rm, 28, P, { fade: [0.05, 0.45], seams: true });
  turned("motor", Fm, [[m0, 0], [m0, rm - 12], [m0 + 20, rm], [m1 - 30, rm], [m1 - 12, rm - 10], [m1, rm - 10], [m1, 0]], { cls: "ci-paint", owner: own, steps: 64, extra: k.fadedSvg(fins, { tone: "lo" }) });
  const grille = []; for (let r = 16; r < rm - 30; r += 13) grille.push(G.circleOf(Fm, m1 + DV.fan, r, P, 40));
  turned("motor.ventilador", Fm, [[m1, 0], [m1, rm - 6], [m1 + DV.fan - 14, rm - 16], [m1 + DV.fan, rm - 30], [m1 + DV.fan, 0]], { cls: "ci-paint", owner: own, steps: 64, extra: Ln(grille.join(""), { tone: "lo" }) });
  // la caja de bornes: un prisma cuya cara de abajo sigue el cuerpo del motor
  const FXs = { o: [0, 0, 0], a: YD, u: XD, v: ZD }, bw = 46, sec = [];
  for (let j = 0; j <= 12; j++) { const x = -bw + (2 * bw * j) / 12; sec.push([x, zcV + Math.sqrt(rm * rm - x * x) - 2]); }
  sec.push([bw, zcV + rm + 56], [-bw, zcV + rm + 56]);
  fp("motor.bornes", FXs, sec.reverse(), -m0 - 210, -m0 - 60, { cls: "ci-paint", owner: own });
  ANCH.VALVULA = [h * Math.cos(0), -VA.len * 0.4, zcV - 60];
  ANCH.ROTOR = [VA.tip * Math.cos(VANES[7] * D2R) * 0.7, 0, zcV + VA.tip * Math.sin(VANES[7] * D2R) * 0.7];
  ANCH.MOTOR = [rm * Math.cos(-0.5), -(m0 + m1) / 2, zcV + rm * Math.sin(-0.5) + 30];
  ANCH.REDUCTOR = [bh, (DV.box[0] + DV.box[1]) / 2, zcV + bh - 30];
  ANCH.VALVULA_CORTE = [-h + 20, 0, zcV + 40];
}
{
  // el tubo de abajo de la válvula, con su brida, hacia el aglomerador
  const own = "valvula";
  const SP = CI.spool, zb = zcV - VA.half - VA.fl;
  const PIPE = [[HP.rOut, SP.fl[1]], [HP.rOut + TW, SP.fl[1]], [HP.rOut + TW, zb], [HP.rOut, zb]];
  void SP;
  revBack("bajante", PIPE, { owner: own, sectors: SECT });
  capsLR("bajante", PIPE, undefined, { owner: own });
  const FL = [[HP.rOut, SP.fl[0]], [HP.rFl, SP.fl[0]], [HP.rFl, SP.fl[1]], [HP.rOut, SP.fl[1]]];
  revBack("bajante.brida", FL, { owner: own, sectors: SECT });
  capsLR("bajante.brida", FL, undefined, { owner: own });
  ANCH.BAJANTE = [HP.rOut + TW, 0, (SP.fl[1] + zb) / 2];
}

/* ====================================================================
   6 · las patas: dos atrás (a 210° y 330°), las de adelante se van con el corte; cada una sobre su pedestal de
   concreto, con su placa base, su tapa, la oreja del ciclón (placa, dos cartelas y el respaldo curvo) y dos puntales
   entre ellas
   ==================================================================== */
{
  const own = "patas", LU = CI.lug;
  for (const a of LG.angs) {
    const ph = a * D2R, cx = LG.r * Math.cos(ph), cy = LG.r * Math.sin(ph), w = LG.w / 2;
    box(`pata${a}.pedestal`, [cx - LG.ped / 2, cy - LG.ped / 2, 0], [cx + LG.ped / 2, cy + LG.ped / 2, LG.z0], { cls: "ci-conc", owner: own, ground: true, r: 6, steps: 2 });
    const bp = LG.base / 2;
    box(`pata${a}.placa`, [cx - bp, cy - bp, LG.z0], [cx + bp, cy + bp, LG.z0 + 20], { cls: "ci-paint", owner: own, r: 2, steps: 1, extra: Dots([[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => at([cx + u * (bp - 26), cy + v * (bp - 26), LG.z0 + 20])), { size: 0.6, tone: "mid" }) });
    box(`pata${a}`, [cx - w, cy - w, LG.z0 + 20], [cx + w, cy + w, LG.top], { cls: "ci-paint", owner: own, r: 3, steps: 2 });
    box(`pata${a}.tapa`, [cx - 100, cy - 100, LG.top], [cx + 100, cy + 100, LG.top + LG.cap], { cls: "ci-paint", owner: own, r: 2, steps: 1 });
    // la oreja: la placa de apoyo, las dos cartelas y el respaldo curvo sobre el cilindro
    const er = [Math.cos(ph), Math.sin(ph), 0], et = [-Math.sin(ph), Math.cos(ph), 0];
    const Fr = { o: [0, 0, 0], a: ZD, u: er, v: et };
    const lb = [-1, 1].map((q) => at(G.add3(G.add3(G.mul3(er, LG.r + 45), G.mul3(et, q * 38)), [0, 0, LU.z1])));
    fp(`oreja${a}.placa`, Fr, [[RO + 10, -LU.half], [LU.rOut + 10, -LU.half], [LU.rOut + 10, LU.half], [RO + 10, LU.half]], LU.z0, LU.z1, { cls: "ci-ss", owner: own, extra: Dots(lb, { size: 0.6, tone: "mid" }) });
    for (const s of [-1, 1]) {
      const Fg = { o: [0, 0, 0], a: et, u: er, v: ZD };
      fp(`oreja${a}.cartela${s > 0 ? 1 : 0}`, Fg, [[RO + 10, LU.z1], [LU.rOut, LU.z1], [LU.rOut, LU.z1 + 70], [RO + 10, LU.top - 10]], s * LU.gus - LU.gT / 2, s * LU.gus + LU.gT / 2, { cls: "ci-ss", owner: own });
    }
    const padSect = a - LU.pad < 330 && a + LU.pad > 330 ? [[a - LU.pad, 330], [330, a + LU.pad]] : [[a - LU.pad, a + LU.pad]];
    revBack(`oreja${a}.respaldo`, [[RO, LU.z0], [RO + 10, LU.z0], [RO + 10, LU.top], [RO, LU.top]], { owner: own, sectors: padSect, caps: (a0, a1) => [a0 === a - LU.pad ? "end" : "none", a1 === a + LU.pad ? "end" : "none"] });
  }
  // los puntales entre las dos patas, a lo largo de x
  const yS = LG.r * Math.sin(330 * D2R), xS = LG.r * Math.cos(330 * D2R) - LG.w / 2, sw = CI.strut.w / 2;
  for (const zz of CI.strut.zs) box(`puntal${zz}`, [-xS, yS - sw, zz - sw], [xS, yS + sw, zz + sw], { cls: "ci-paint", owner: own, r: 2, steps: 1 });
  ANCH.PATA = [LG.r * Math.cos(330 * D2R) + LG.w / 2, LG.r * Math.sin(330 * D2R) + LG.w / 2, 2800];
  ANCH.OREJA = [CI.lug.rOut * Math.cos(330 * D2R), CI.lug.rOut * Math.sin(330 * D2R), CI.lug.z1 + 40];
  ANCH.PEDESTAL = [LG.r * Math.cos(330 * D2R) + LG.ped / 2, LG.r * Math.sin(330 * D2R) + LG.ped / 2, 200];
}

/* ====================================================================
   7 · el polvo: el montón de la tolva con la columna que baja a la válvula, las celdas del rotor que bajan llenas y
   el que cae por el bajante
   ==================================================================== */
{
  const sl = VA.slot, bo = VA.bore, zs = Math.sqrt(bo * bo - sl * sl);
  const zH = CI.heap, rH = hopWall(zH), zPk = zH + rH * Math.tan(30 * D2R);
  // el montón, de la pared de la tolva al pico, y la columna por la boca de la tolva y la garganta de la válvula
  const pile = [[-rH, zH], [0, zPk], [rH, zH]];
  for (let j = 1; j <= 8; j++) { const z = zH - ((zH - HP.zc) * j) / 8; pile.push([hopWall(z), z]); }
  pile.push(...arcPts(0, zcV, bo, Math.atan2(zs, sl) / D2R, 180 - Math.atan2(zs, sl) / D2R, 10));
  for (let j = 8; j >= 1; j--) { const z = zH - ((zH - HP.zc) * j) / 8; pile.push([-hopWall(z), z]); }
  powder("polvo.tolva", pile, { grains: 40 });
  // la cara de arriba del montón, en la mitad de atrás
  revBack("polvo.monton", [[0, HP.zc], [hopWall(HP.zc + 40), HP.zc + 40], [rH, zH], [0, zPk]], { cls: "ci-polvo", owner: "polvo", sectors: SECT, skip: [0, 1], rec: false });
  // las celdas del rotor: las de la derecha bajan llenas; la de arriba se está llenando; la de abajo se vacía
  const pocket = (a0, a1, rIn, rOut, clipTop = null) => {
    const pts = [];
    const ga = Math.asin((VA.vane / 2 + 3) / rOut) / D2R, gi = Math.asin((VA.vane / 2 + 3) / rIn) / D2R;
    for (let j = 0; j <= 8; j++) { const a = (a0 + ga + ((a1 - a0 - 2 * ga) * j) / 8) * D2R; pts.push([rOut * Math.cos(a), zcV + rOut * Math.sin(a)]); }
    for (let j = 8; j >= 0; j--) { const a = (a0 + gi + ((a1 - a0 - 2 * gi) * j) / 8) * D2R; pts.push([rIn * Math.cos(a), zcV + rIn * Math.sin(a)]); }
    return clipTop == null ? pts : clipZ2(pts, clipTop);
  };
  for (const [a0, a1, nm] of [[-67.5, -22.5, "c1"], [-22.5, 22.5, "c2"], [22.5, 67.5, "c3"]]) powder(`polvo.celda.${nm}`, pocket(a0, a1, VA.hub + 2, bo - 4), { grains: 4 });
  powder("polvo.celda.c4", pocket(67.5, 112.5, VA.hub + 2, bo - 4, zcV + 140), { grains: 2 });
  ANCH.POLVO = [-rH * 0.4, 0, zH + 20];
  ANCH.CELDA = [(bo - 30) * Math.cos(-0.4), 0, zcV + (bo - 30) * Math.sin(-0.4)];
  ANCH.CELDA_VACIA = [(bo - 50) * Math.cos(PI - 0.2), 0, zcV + (bo - 50) * Math.sin(PI - 0.2)];
}
// un polígono recortado bajo una altura (Sutherland–Hodgman)
function clipZ2(poly, zmax) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], ip = p[1] <= zmax, iq = q[1] <= zmax;
    if (ip) out.push(p);
    if (ip !== iq) out.push([p[0] + ((q[0] - p[0]) * (zmax - p[1])) / (q[1] - p[1]), zmax]);
  }
  return out;
}

/* ====================================================================
   8 · las partículas (mucho más grandes que las reales): las gruesas en una hebra que baja en espiral por la pared de
   atrás hasta la boca del cono, unas pocas entrando con el aire; las finas en el vórtice de adentro, que suben al tubo
   de salida y se van con el gas; el polvo que cae de la boca a la tolva y el que sale por abajo de la válvula
   ==================================================================== */
const PT = { coarse: [17, 26], fine: [10, 14] };
const PSC = DET ? 1.5 / MDET : 1;      // en el detalle, las partículas no crecen con el dibujo
function particles(name, list, cls, ref) {
  // list: [[x, y, z, r]]; cada partícula es un círculo, y una esfera para el orden
  let d = "";
  const shapes = [];
  for (const [x, y, z, r] of list) { d += circ2(at([x, y, z]), r * KS * PSC); shapes.push(A.ball([x, y, z], r * PSC)); }
  if (!d) return;
  put(name, ref || list[Math.floor(list.length / 2)].slice(0, 3), `<path class="${cls}" d="${d}"/>`, shapes);
}
// la hebra de polvo: sobre la pared de atrás, en la mitad de atrás de cada vuelta; baja más rápido que el gas
const strandZ = (phi) => 7050 - phi * (4200 / (6 * 360));      // phi: grados recorridos desde la boca de la entrada
{
  for (let turn = 0; turn < 7; turn++) {
    const list = [];
    const phA = turn === 0 ? 20 : 360 * turn - 26, phB = 360 * turn + 112;
    const thick = 1 + turn * 0.22;                     // la hebra se engruesa hacia abajo
    for (let phi = phA; phi <= phB; phi += 5.5 / thick) {
      const th = ((300 - phi) % 360 + 360) % 360;
      for (let row = 0; row < 2; row++) {
        if (rnd() < (row ? 0.75 : 0.3)) continue;
        const zc = strandZ(phi) + (row - 0.5) * 40 * Math.min(1.5, thick) + (rnd() - 0.5) * 24;
        if (zc < ZO + 90) continue;
        const rr = PT.coarse[0] + rnd() * (PT.coarse[1] - PT.coarse[0]);
        const rw = rWall(zc) - rr - 5 - rnd() * 10;
        const thj = th + (rnd() - 0.5) * 2;
        list.push([rw * Math.cos(thj * D2R), rw * Math.sin(thj * D2R), zc, rr]);
      }
    }
    if (list.length) particles(`gruesas.${turn}`, list, "ci-grueso");
  }
  // unas gruesas que entran con el aire, de la boca hacia la pared
  const inl = [];
  for (let j = 0; j < 14; j++) { const th = 230 + rnd() * 70, r = 380 + rnd() * 170, z = ZI + 60 + rnd() * 480; inl.push([r * Math.cos(th * D2R), r * Math.sin(th * D2R), z, PT.coarse[0] + rnd() * 8]); }
  particles("gruesas.entrada", inl, "ci-grueso");
  // el polvo que cae de la boca del cono a la tolva
  const fall = [];
  for (let j = 0; j < 26; j++) { const z = 1720 + rnd() * (ZO - 1720 - 40), r = (rnd() * 0.8) * RB * Math.min(1, 0.5 + (z - 1700) / 1800), th = 180 + rnd() * 180; fall.push([r * Math.cos(th * D2R), r * Math.sin(th * D2R) * 0.6, z, PT.coarse[0] - 2 + rnd() * 6]); }
  particles("polvo.cae", fall, "ci-grueso");
  // el que sale por abajo de la válvula
  const out = [];
  for (let j = 0; j < 12; j++) { const z = 250 + rnd() * (zcV - VA.bore - 260), r = rnd() * 110, th = 180 + rnd() * 180; out.push([r * Math.cos(th * D2R), r * Math.sin(th * D2R) * 0.6, z, PT.coarse[0] - 2 + rnd() * 6]); }
  particles("polvo.sale", out, "ci-grueso");
  // las finas: en el vórtice de adentro (dentro del cilindro de su hélice) y en el ducto de salida
  const rc = CI.rCore * RE;
  const fines = [[], [], [], []];
  for (let j = 0; j < 90; j++) {
    const z = ZE + 150 + rnd() * (VF.top - ZE - 150), r = Math.sqrt(rnd()) * rc * 0.75 * Math.min(1, 0.3 + (z - ZE) / 900), th = rnd() * 360;
    const sz = PT.fine[0] + rnd() * (PT.fine[1] - PT.fine[0]);
    fines[Math.min(3, Math.floor(((z - ZE) / (VF.top - ZE)) * 4))].push([r * Math.cos(th * D2R), r * Math.sin(th * D2R) * 0.5, z, sz]);
  }
  fines.forEach((l, i) => particles(`finas.${i}`, l, "ci-fino"));
  // el ancla de las finas: la partícula más cercana a un punto del vórtice de adentro, en el cono
  const all = fines.flat(), tgt = [60, 0, 5050];
  ANCH.FINAS = all.reduce((b, p) => (Math.hypot(p[0] - tgt[0], p[1] - tgt[1], p[2] - tgt[2]) < Math.hypot(b[0] - tgt[0], b[1] - tgt[1], b[2] - tgt[2]) ? p : b)).slice(0, 3);
  const fo = [];
  for (let j = 0; j < 18; j++) { const x = VF.x1 + 120 + rnd() * (-VF.bend - VF.x1 - 160), z = VF.top + VF.bend + (rnd() - 0.5) * 380, y = -60 - rnd() * 120; fo.push([x, y, z, PT.fine[0] + rnd() * 3]); }
  particles("finas.salida", fo, "ci-fino");
  ANCH.GRUESAS = (() => { const phi = 360 + 60, th = 300 - phi + 360, z = strandZ(phi); const rw = rWall(z) - 30; return [rw * Math.cos(th * D2R), rw * Math.sin(th * D2R), z]; })();
}

/* ====================================================================
   9 · las flechas: el aire entra por la derecha; el vórtice de afuera baja en espiral pegado a la pared (cinco vueltas,
   en la mitad de atrás de cada una); da la vuelta 2 D por debajo del tubo de salida y sube por el centro (el vórtice de
   adentro), por el tubo, el codo y el ducto al filtro; el polvo baja por la pared del cono, cae a la tolva y sale por
   abajo de la válvula
   ==================================================================== */
function line(name, pts, { r = 5, head = 12, w = 5.5, cls = "ci-flujo", hcls = "ci-flecha", arrow = true } = {}) {
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
// una curva por puntos de control (Catmull-Rom)
function spline(ctl, per = 14) {
  const pts = [];
  for (let i = 0; i < ctl.length - 1; i++) {
    const p0 = ctl[Math.max(0, i - 1)], p1 = ctl[i], p2 = ctl[i + 1], p3 = ctl[Math.min(ctl.length - 1, i + 2)];
    for (let j = 0; j < per; j++) { const t = j / per, t2 = t * t, t3 = t2 * t; pts.push([0, 1, 2].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3))); }
  }
  pts.push(ctl[ctl.length - 1]);
  return pts;
}
const PITCH = (7200 - ZE) / CI.turns;
const vortexZ = (phi) => 7200 - (PITCH * phi) / 360;
{
  const GAS = { cls: "ci-flujo", hcls: "ci-flecha" }, DUST = { cls: "ci-flujo-s", hcls: "ci-flecha-s" };
  // el aire con polvo entra por la brida del ducto
  line("flujo.entrada", [[DU.x1 + 520, -480, 7200], [DU.x1 + 60, -480, 7200]], GAS);
  // el vórtice de afuera: la mitad de atrás de cada vuelta, del lado derecho al izquierdo, bajando
  const outer = (phiA, phiB, nm, opts = GAS) => {
    const pts = [];
    for (let j = 0; j <= 40; j++) {
      const phi = phiA + ((phiB - phiA) * j) / 40, th = (300 - phi) * D2R, z = vortexZ(phi), r = rWall(z) - 95;
      pts.push([r * Math.cos(th), r * Math.sin(th), z]);
    }
    line(nm, pts, opts);
    return pts;
  };
  outer(-22, 112, "vortice-afuera.0");
  for (let i = 1; i <= 4; i++) outer(360 * i - 50, 360 * i + 112, `vortice-afuera.${i}`);
  // la vuelta de abajo: del lado derecho hacia el eje, donde arranca el vórtice de adentro
  const rc = CI.rCore * RE;
  {
    const pts = [];
    for (let j = 0; j <= 40; j++) {
      const s = j / 40, phi = 1800 - 50 + 150 * s, th = (300 - phi) * D2R, z = vortexZ(1800 - 50) - 120 * s;
      const r = (rWall(z) - 95) * (1 - s) + (rc * 0.35) * s;
      pts.push([r * Math.cos(th), r * Math.sin(th), z]);
    }
    line("vortice-vuelta", pts, { ...GAS, arrow: false });
  }
  // el vórtice de adentro: una hélice que sube, partida donde pasa de adelante a atrás del eje (θ múltiplo de 180°)
  const zA = vortexZ(1800 - 50) - 120, phA = 300 - (1800 + 100), sweep = 360 * 4.25, zB = VF.top - 40;
  const cuts = [phA];
  for (let m = Math.floor(phA / 180) * 180; m > phA - sweep; m -= 180) if (m < phA - 30 && m > phA - sweep + 30) cuts.push(m);
  cuts.push(phA - sweep);
  for (let i = 0; i < cuts.length - 1; i++) {
    const pts = [], n = Math.max(8, Math.round((cuts[i] - cuts[i + 1]) / 7));
    for (let j = 0; j <= n; j++) {
      const ang = cuts[i] + ((cuts[i + 1] - cuts[i]) * j) / n, s = (phA - ang) / sweep, th = ang * D2R, z = zA + (zB - zA) * s;
      const r = rc * Math.min(1, 0.35 + s * 2.2);
      pts.push([r * Math.cos(th), r * Math.sin(th), z]);
    }
    const front = ((((cuts[i] + cuts[i + 1]) / 2) % 360) + 360) % 360 < 180;
    line(`vortice-adentro.${i}`, pts, { ...GAS, arrow: front || i === cuts.length - 2, head: 10, w: 4.6 });
  }
  // el gas sale: por el tubo, el codo y el ducto al filtro (en el plano del corte, un poco adelante)
  const Rb = VF.bend, zH = VF.top + Rb, yF = 16;
  const ctl = [[0, yF, VF.top - 60], [0, yF, VF.top + 60]];
  for (let a = 10; a <= 80; a += 10) ctl.push([-Rb + Rb * Math.cos(a * D2R), yF, VF.top + Rb * Math.sin(a * D2R)]);
  ctl.push([-Rb - 60, yF, zH], [VF.x1 + 100, yF, zH], [VF.x1 - 380, yF, zH]);
  line("flujo.salida", ctl, GAS);
  // el polvo: baja en espiral por la pared del cono (mitad de atrás), cae a la tolva y sale por abajo
  {
    const pts = [];
    const phi0 = 1440 + 350, phi1 = 1440 + 465;
    for (let j = 0; j <= 30; j++) { const phi = phi0 + ((phi1 - phi0) * j) / 30, th = (300 - phi) * D2R, z = strandZ(phi) - 40, r = rWall(z) - 70; pts.push([r * Math.cos(th), r * Math.sin(th), z]); }
    line("flujo.polvo.cono", pts, DUST);
  }
  line("flujo.polvo.cae", [[70, 20, ZO - 80], [70, 20, 1900]], DUST);
  line("flujo.polvo.sale", [[0, 10, 330], [0, 10, 40]], DUST);
  ANCH.V_AFUERA = (() => { const phi = 720 + 40, th = (300 - phi) * D2R, z = vortexZ(phi), r = rWall(z) - 95; return [r * Math.cos(th), r * Math.sin(th), z]; })();
  ANCH.V_ADENTRO = (() => { const s = 0.36, th = (phA - sweep * s) * D2R, z = zA + (zB - zA) * s; return [rc * Math.cos(th), rc * Math.sin(th), z]; })();
  ANCH.FIN_VORTICE = [0, 0, zA];
  ANCH.ENTRA_AIRE = [DU.x1 + 420, -480, 7200];
  ANCH.SALE_GAS = [VF.x1 - 300, yF, zH];
  ANCH.POLVO_SALE = [0, 10, 120];
  ANCH.POLVO_CONO = (() => { const phi = 1440 + 400, th = (300 - phi) * D2R, z = strandZ(phi) - 40, r = rWall(z) - 70; return [r * Math.cos(th), r * Math.sin(th), z]; })();
  ANCH.DESGASTE_CONO = [rWall(3100) * Math.cos(250 * D2R), rWall(3100) * Math.sin(250 * D2R), 3100];
  ANCH.DESGASTE_ENTRADA = [R * Math.cos(215 * D2R), R * Math.sin(215 * D2R), 7150];
}

/* ---------- --check: ninguna cara del corte se monta sobre otra ---------- */
if (CHECK) {
  const items = capPolys;
  const bb = items.map(({ poly }) => [Math.min(...poly.map((q) => q[0])), Math.max(...poly.map((q) => q[0])), Math.min(...poly.map((q) => q[1])), Math.max(...poly.map((q) => q[1]))]);
  const hits = new Map();
  for (let x = -1500.137; x <= 1600; x += 1.3) for (let z = 0.213; z <= 9000; z += 1.3) {
    const inside = [];
    items.forEach((it, i) => { const b = bb[i]; if (x < b[0] || x > b[1] || z < b[2] || z > b[3]) return; if (inPoly(it.poly, x, z)) inside.push(it.name); });
    if (inside.length > 1) { const key = inside.sort().join(" × "); hits.set(key, (hits.get(key) || 0) + 1); }
  }
  console.log(hits.size ? [...hits].map(([k2, n]) => `${n}\t${k2}`).join("\n") : "sin cruces");
  process.exit(0);
}

/* ---------- orden y salida ---------- */
if (process.env.CI_ITEM) {
  for (const nm of process.env.CI_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1) + (f.at ? " @" + f.at.map((v) => v.toFixed(1)).join(",") : "")).join(" / "));
    }
  }
  process.exit(0);
}
/* ---------- el detalle: solo lo que cae en el círculo, con sus anclas ---------- */
if (DET) {
  for (const key of Object.keys(ANCH)) delete ANCH[key];
  const zc = VA.zc, al = VANES[3] * D2R;
  ANCH.D_ROTOR = [-40, 0, zc - 36];
  ANCH.D_PALETA = [(VA.tip - 6) * Math.cos(al), 0, zc + (VA.tip - 6) * Math.sin(al)];
  ANCH.D_LLENA = [128, 0, zc - 12];
  ANCH.D_VACIA = [-132, 0, zc + 6];
  ANCH.D_ENTRA = [70, 0, zc + 238];
  ANCH.D_CARCASA = [-(VA.half - 14), 0, zc - 90];
  ANCH.D_SALE = [30, -20, zc - 290];
  ANCH.D_GIRO = [132 * Math.cos(60 * D2R), 10, zc + 132 * Math.sin(60 * D2R)];
  ANCH.D_TAPA = [-150, -VA.len, zc - 150];
  const cx = W_ / 2, cy = H_ / 2, rr = RDET + 4;
  const inView = (it) => it.shapes.some((sh) => {
    const bd = A.boundsOf(sh); if (!bd) return true;
    const [lo, hi] = Array.isArray(bd) ? bd : [bd.min, bd.max];
    const cs = []; for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) cs.push(k.iso([x / U, y / U, z / U], P));
    const x0 = Math.min(...cs.map((c) => c[0])), x1 = Math.max(...cs.map((c) => c[0])), y0 = Math.min(...cs.map((c) => c[1])), y1 = Math.max(...cs.map((c) => c[1]));
    return x1 > cx - rr && x0 < cx + rr && y1 > cy - rr && y0 < cy + rr;
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
const CONC = ["#E8E6E1", "#EFEDE9", ["#D2CFC8", "#D9D6D0", "#DFDDD7", "#E4E2DC"]];
const SOL = ["#D9CFB8", "#E3DBC8", ["#A89464", "#B8A67A", "#C6B68F", "#CFC2A3"]];
const CSS = `.ci-cut{${flat("#C9CED3")}}.ci-cut1{${flat("#D6DADE")}}.ci-cut-c{${flat("#C1C6CB")}}
.ci-ss,.ci-plate{${shades(...ACERO)}}.ci-in{${shades("#D3D9DF", "#E3E8EE", ["#AEB8C2", "#C9D1D9", "#C9D1D9", "#D3D9DF"])}}.ci-cast{${shades(...FUND)}}.ci-paint{${shades(...PINT)}}.ci-conc{${shades(...CONC)}}.ci-polvo{${shades(...SOL)}}
.ci-bore{fill:#525C64;stroke:none}
.ci-polvo-c{fill:#C6B68F;stroke:none}.ci-grano{fill:#7A5634;stroke:none}.ci-polvo-line{fill:none;stroke:#7A5634;stroke-width:.5px}
.ci-grueso{fill:#7A5634;stroke:none}.ci-fino{fill:#A89464;stroke:none}
.ci-flujo{fill:none;stroke:#2E5E9E;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}.ci-flecha{fill:#2E5E9E;stroke:none}
.ci-giro{fill:none;stroke:#525C64;stroke-width:1.2px;stroke-linecap:round}.ci-giro-p{fill:#525C64;stroke:none}
.ci-det-fondo{fill:#FFFFFF;stroke:none}.ci-det-marco{fill:none;stroke:#525C64;stroke-width:1px}
.ci-flujo-s{fill:none;stroke:#7A5634;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round}.ci-flecha-s{fill:#7A5634;stroke:none}`;
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
  ? k.figureSvg({ width: W_, height: H_, label: "La válvula rotativa, ampliada", body: [`<style>${CSS}</style><defs><clipPath id="ciDet"><circle cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/></clipPath></defs><g class="ci-items" clip-path="url(#ciDet)"><circle class="ci-det-fondo" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="ci-det-marco" cx="${W_ / 2}" cy="${H_ / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W_, height: H_, label: "Ciclón de Stairmand en corte", body: [`<style>${CSS}</style><g class="ci-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
const base = DET ? "detalle" : "fig";
writeFileSync(join(OUTD, `${base}.svg`), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Ciclón", theme: "light", width: DET ? 400 : 1000, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, `${base}_data.json`), JSON.stringify({ P, W: W_, H: H_, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, { crowd: [] });
