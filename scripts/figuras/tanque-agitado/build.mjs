/* ====================================================================
   Tanque agitado en isométrico (skill anatomy), para el capítulo 13 del libro de operaciones unitarias (Agitación):
   el reactor de extracción de pectina de la cáscara de cítricos.
   Concepto: el motor y el reductor, sobre la linterna, hacen girar el eje; la turbina de cuatro palas inclinadas
   empuja la suspensión de cáscara hacia el fondo, que la devuelve por la pared hacia arriba; los cuatro deflectores
   rompen el giro del líquido (sin ellos se formaría un vórtice) y la chaqueta calienta la pared.
   Corte: se quita lo que mira al lector por encima de la línea de tangencia del fondo (y > 0, z > zt). El fondo queda
   entero; la envolvente, la chaqueta, la tapa y la boquilla del agitador se ven cortadas por el plano y = 0. El
   eje, la turbina, los deflectores de atrás, el accionamiento y las boquillas de la mitad de atrás van enteros. Lo
   que queda bajo el nivel del líquido lleva el tinte del agua (ta-sub) y la superficie es una lámina translúcida.
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
const { tubePieces, tubeSvg } = await import(KIT + "/kit/tube.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const X = await import(join(HERE, "xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const FAST = process.argv.includes("--fast");
const STEP = Number(process.env.TA_STEP || 0.25);
const TQ = GEO.TQ, RO = GEO.RO;
const { R, tw, hd, zt, zt2, zL, zb } = TQ;
const AZ = TQ.AZ, EL = TQ.EL;

const W = 600, H = 860;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const pol = (r, deg, z = 0) => [r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z];

/* ---------- posiciones de las boquillas ---------- */
const FEED = pol(850, 210), TWL = pol(1050, 195), MH = pol(820, 280);
const JN = -20;                                         // ángulo de las boquillas de la chaqueta
const JK = TQ.jk, RJi = RO + JK.gap, RJ = RJi + JK.t;   // chaqueta: radio interior y exterior
const MOT = TQ.mot, GB = TQ.gb;
const TMINUS = [-Math.sin(AZ * D2R), Math.cos(AZ * D2R), 0];   // hacia la izquierda de la pantalla, en el piso
const ANCH_PRE = {};                                  // los puntos a los que apuntan los rótulos del libro (libro.mjs)

const EXT = [];
for (let d = 0; d < 360; d += 15) EXT.push(pol(RJ + 4, d, zt), pol(RJ + 4, d, zt2), pol(RO, d, zt - 300));
TQ.legs && [45, 135, 225, 315].forEach((d) => { const c = pol(TQ.legs.r, d); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => EXT.push([c[0] + a * 150, c[1] + b * 150, 0])); });
EXT.push([GB.x0, -GB.y, 6060], [GB.x1, GB.y, 6060], [MOT.x3 + 12, 0, MOT.z + 130], [MOT.x3 + 12, 0, MOT.z - 130], [400, 0, 6080]);
EXT.push(G.add3(pol(1520, JN), [0, 0, 3720 + 110]), G.add3(pol(1520, JN), [0, 0, 1530 - 110]));
EXT.push([-760, 420, 150 - 120], [-760, 420, 150 + 120], [FEED[0] - 560, FEED[1] + 320, 5300], [TWL[0], TWL[1], 5000], [MH[0] + 340, MH[1], 5080]);
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);

/* El dibujo va en milímetros; el audit, en centímetros (como el sistema flash): sus muestras de superficie van cada
   0,6 unidades y un tanque de 2,5 m en milímetros no cabe en memoria. cm() pasa cada forma registrada a centímetros
   (con sus cortes) y PA es la misma cámara con la escala por 10, así cada forma cae en el mismo lugar de la pantalla. */
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
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref.map((v) => v * U), svg, shapes: shapes.map(cm), move: [0, 0, 0], ...rest });
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", ground, owner, cls = "", inner = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground, owner }, steps));
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", inner, ...style }) + extra, cls), [shape]);
  return shape;
}
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra, shapes || [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", rims, owner, smooth, steps, bevel = 0, cls = "", cut = null, inner = "" } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, mid)), wrap(S(paths, { tone: "mid", inner, ...style }) + extra, cls), [shape]);
  return shape;
}
// un cilindro corto (perno, pasador, tapón, brida): prisma de sección circular, liviano; se registra el cilindro verdadero
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * G.scaleOf(P)) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 140, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, spacing = null } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner: name, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
// un racor o un codo: una esfera con el paso de cada tubo que la cruza o termina en ella
function ball(name, c, Rb, style = {}, { owner, cls = "", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(Rb + 0.6))), G.add3(c, G.mul3(b.dir, Rb + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, Rb, { name, owner, ...(cut.length ? { cut } : {}) }));
  put(name, c, wrap(S(G.sphereOf(c, Rb, P), { tone: "mid", ...style }), cls), [shape]);
  return shape;
}
const entry = (Rb, r) => Math.sqrt(Math.max(0, Rb * Rb - r * r)) - 0.02;
function mergeGaps(gs) { const s = gs.filter((g) => g[1] > g[0]).sort((a, b) => a[0] - b[0]), out = []; for (const g of s) { const l = out[out.length - 1]; if (l && g[0] <= l[1]) l[1] = Math.max(l[1], g[1]); else out.push([...g]); } return out; }
/* un tubo recto con bridas: cada esfera en un extremo (at: "start" o "end") recibe el tubo hasta su superficie */
function pipe(name, control, r, { tone = "mid", flanges = [false, false], flangeR = 1.75, flangeT = null, cls = "", maxLength = 140, balls = [], open = [false, false], dots = 8 } = {}) {
  const line = control.map((q) => [...q]);
  for (const b of balls) {
    const i = b.at === "start" ? 0 : line.length - 1, j = b.at === "start" ? 1 : line.length - 2, dir = G.unit3(G.sub3(line[j], b.c));
    line[i] = G.add3(b.c, G.mul3(dir, entry(b.R, r)));
  }
  const total = G.pathLength(line), gaps = [];
  [[0, -1], [total, 1]].forEach(([along, sign], index) => {
    if (!flanges[index]) return;
    const thick = flangeT ?? Math.max(1.0, r * 0.38), tangent = G.tangentAlong(line, along);
    const centre = G.add3(G.pointAlong(line, along), G.mul3(tangent, (-sign * thick) / 2));
    gaps.push(sign < 0 ? [0, thick] : [total - thick, total]);
    const FF = G.frameAlong(centre, tangent);
    disc(`${name}.flange${index}`, FF, -thick / 2, thick / 2, r * flangeR, { tone: "mid" }, { owner: name, cls, extra: Dots(G.dotsOf(FF, (thick / 2) * sign, r * (flangeR + 1) / 2, dots, P, { least: 0.05, fade: [0.04, 0.42] }), { size: 0.5 }) });
  });
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), cls, maxLength, ends: [!open[0], !open[1]] });
  return line;
}
// un cilindro (cuello, asiento) de radio a a lo largo de F.a, desde la superficie curva (start(ángulo) = s donde la
// generatriz toca la superficie) hasta la cara plana en s = h. Se registra como disco cortado por sus anfitriones.
function saddle(name, F, a, start, h, style = {}, { owner, cls = "", extra = "", hosts = [], ref = null } = {}) {
  const low = Math.min(...Array.from({ length: 72 }, (_, i) => start((i / 72) * TAU)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, ref ?? G.add3(F.o, G.mul3(F.a, (low + h) / 2)), wrap(body, cls), [record(A.disc(F, low - 0.05, h, a, { name, owner, cut: hosts }))]);
  return { F, face: G.add3(F.o, G.mul3(F.a, h)), low };
}
// dónde toca una generatriz vertical una superficie z = surf(r) (cuellos en la tapa y en el fondo)
const vStart = (F, a, surf) => (t) => { const p = G.pointOf(F, 0, a, t); return G.dot3(G.sub3([p[0], p[1], surf(Math.hypot(p[0], p[1]))], F.o), F.a); };
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });

/* ---------- superficies con tonos suaves (de la válvula de control) ---------- */
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
function surface(P3, N3, f0, f1, nf, nu, out, keep = null) {
  const cls = (f, u) => { const n = N3(f, u); return G.dot3(n, V3) <= 1e-4 || (keep && !keep(P3(f, u))) ? -1 : BAND(G.dot3(n, L3)); };
  const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
  if (nu === 1) {
    const bands = [];
    for (let i = 0; i < nf; i++) bands.push(cls((fOf(i) + fOf(i + 1)) / 2, 0.5));
    for (let i = 0; i < nf; ) {
      let j = i; while (j + 1 < nf && bands[j + 1] === bands[i]) j++;
      if (bands[i] >= 0) {
        const pts = []; for (let q = i; q <= j + 1; q++) pts.push(P3(fOf(q), 0)); for (let q = j + 1; q >= i; q--) pts.push(P3(fOf(q), 1));
        const d = pth1(pts.map(pr)); out.by[bands[i]].push(d); out.fill.push(d);
      }
      i = j + 1;
    }
    return;
  }
  for (let i = 0; i < nf; i++) {
    const fa = fOf(i), fb = fOf(i + 1), fm = (fa + fb) / 2;
    const runs = [];
    for (let j = 0; j < nu; j++) { const band = cls(fm, (j + 0.5) / nu); if (!runs.length || runs[runs.length - 1].band !== band) runs.push({ band, j0: j }); }
    const edge = (f) => {
      const M = nu * 4, smp = []; for (let q = 0; q < M; q++) smp.push(cls(f, (q + 0.5) / M));
      const tr = []; for (let q = 1; q < M; q++) if (smp[q] !== smp[q - 1]) tr.push({ a: smp[q - 1], b: smp[q], q });
      const cuts = [0];
      for (let r = 1; r < runs.length; r++) {
        const j = runs[r].j0, a = runs[r - 1].band, b = runs[r].band; let best = null;
        for (const t of tr) if (t.a === a && t.b === b && (!best || Math.abs(t.q / M - j / nu) < Math.abs(best.q / M - j / nu))) best = t;
        let c = j / nu;
        if (best && Math.abs(best.q / M - j / nu) < 3 / nu) { let lo = (best.q - 0.5) / M, hi = (best.q + 0.5) / M; for (let it = 0; it < 20; it++) { const m = (lo + hi) / 2; if (cls(f, m) === a) lo = m; else hi = m; } c = (lo + hi) / 2; }
        cuts.push(c);
      }
      cuts.push(1); for (let r = 1; r < cuts.length; r++) cuts[r] = Math.max(cuts[r], cuts[r - 1]); return cuts;
    };
    const e0 = edge(fa), e1 = edge(fb);
    const side = (f, ua, ub) => { const pts = [P3(f, ua)]; for (let j = Math.floor(ua * nu) + 1; j / nu < ub - 1e-9; j++) if (j / nu > ua + 1e-9) pts.push(P3(f, j / nu)); pts.push(P3(f, ub)); return pts; };
    runs.forEach((run, r) => {
      if (run.band < 0) return;
      const pts = [...side(fa, e0[r], e0[r + 1]), ...side(fb, e1[r], e1[r + 1]).reverse()];
      const d = pth1(pts.map(pr)); out.by[run.band].push(d); out.fill.push(d);
    });
  }
}
function toned(build, cls = "") {
  const out = { by: [[], [], [], [], []], fill: [] };
  build(out);
  return `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">` + out.by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "") + "</g>";
}
// el contorno visible de una superficie de revolución alrededor de F: para cada s, el ángulo donde n·V = 0
function silhouette(F, s0, s1, rr, dr, f0, f1, n = 80, keep = null) {
  const out = [], cur = [[], []];
  const flush = (j) => { if (cur[j].length > 1) out.push(path3(cur[j])); cur[j] = []; };
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n, r = rr(s);
    const aV = G.dot3(F.a, V3), uV = G.dot3(F.u, V3), vV = G.dot3(F.v, V3), flat = Math.hypot(uV, vV), phi = Math.atan2(vV, uV);
    const c = (dr(s) * aV) / flat;
    [0, 1].forEach((j) => {
      if (r < 1e-6 || Math.abs(c) >= 1) return flush(j);
      let g = j ? phi - Math.acos(c) : phi + Math.acos(c);
      while (g < f0) g += TAU; while (g > f1) g -= TAU;
      if (g < f0 || g > f1) return flush(j);
      const p = G.pointOf(F, s, r, g);
      if (keep && !keep(p)) return flush(j);
      cur[j].push(p);
    });
  }
  flush(0); flush(1);
  return out.join("");
}
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD };     // el plano del corte: sección (x, z), espesor a lo largo de y
const F0 = FZ();
const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
// una cabeza elíptica: a de a0 a a1 (0 en el ecuador); up = 1 arriba, −1 abajo; sg = 1 normal hacia afuera, −1 hacia adentro
const headP = (rr, hh, zc, up, a0, a1) => (f, u) => { const a = a0 + (a1 - a0) * u, r = rr * Math.cos(a); return [r * Math.cos(f), r * Math.sin(f), zc + up * hh * Math.sin(a)]; };
const headN = (rr, hh, up, sg, a0, a1) => (f, u) => { const a = a0 + (a1 - a0) * u; return G.mul3(G.unit3([Math.cos(a) * hh * Math.cos(f), Math.cos(a) * hh * Math.sin(f), up * Math.sin(a) * rr]), sg); };
const arcPts = (r, z, f0, f1, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t), z]; });
const fS = (AZ - 90) * D2R + TAU;                      // la silueta de la derecha de un cilindro vertical (−30°)

/* ====================================================================
   1 · las formas registradas de la envolvente, el fondo y la chaqueta
   ==================================================================== */
const FRONT = A.box([-9000, 0, zt], [9000, 9000, 9000]);
const NH = 24;
const ellPts = (rr, hh, zc, up, a0, a1, n = NH) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [zc + up * hh * Math.sin(a), rr * Math.cos(a)]; });
const NOZ = TQ.noz;
const aIn = Math.acos(NOZ.ro / R), aOut = Math.acos(NOZ.ro / RO);
const zInH = GEO.zInTop(NOZ.ro), zOutH = GEO.zOutTop(NOZ.ro);
// la envolvente y la tapa (con el agujero de la boquilla del agitador), [z, r]
const SHELL_POLY = [[zt, R], ...ellPts(R, hd, zt2, 1, 0, aIn), [zOutH, NOZ.ro], ...ellPts(RO, hd + tw, zt2, 1, aOut, 0), [zt, RO]];
// los agujeros de las boquillas de la tapa
const HOLES = [[FEED, 136.5], [TWL, 30.15], [MH, 254]].map(([c, r]) => A.disc(FZ(c[0], c[1], 0), 4400, 5100, r));
const CYL = A.body(F0, [[zt, R], [zt2, R], [zt2, RO], [zt, RO]], { name: "shell.cyl", owner: "shell" });
const FONDO = A.body(F0, [[zb, 0], ...ellPts(R, hd, zt, -1, Math.PI / 2, 0), [zt, R], [zt, RO], ...ellPts(RO, hd + tw, zt, -1, 0, Math.PI / 2), [zb - tw, 0]], { name: "fondo", owner: "fondo" });
const JACKET_POLY = [[JK.z0, RO], [JK.z0, RJ], [JK.z1, RJ], [JK.z1, RO], [JK.z1 - JK.cl, RO], [JK.z1 - JK.cl, RJi], [JK.z0 + JK.cl, RJi], [JK.z0 + JK.cl, RO]];
const JACKET = A.body(F0, JACKET_POLY, { name: "jacket", owner: "jacket", cut: [FRONT] });
const SHELL = A.body(F0, SHELL_POLY, { name: "shell", owner: "shell", cut: [FRONT, ...HOLES] });
const HEAD = A.body(F0, [[zt2, R], ...ellPts(R, hd, zt2, 1, 0, aIn), [zOutH, NOZ.ro], ...ellPts(RO, hd + tw, zt2, 1, aOut, 0), [zt2, RO]], { name: "shell.head", owner: "shell" });
// lo que queda debajo de la superficie de afuera de la tapa, del fondo y de la chaqueta: los cuellos y asientos se cortan
// con esto, así su forma registrada empieza justo en la superficie, como se dibuja
const UNDER_TOP = A.body(F0, [[zt2 - 5, 0], [zt2 - 5, RO], ...ellPts(RO, hd + tw, zt2, 1, 0, Math.PI / 2)], { name: "bajo.tapa" });
const UNDER_BOT = A.body(F0, [[zt + 5, 0], [zt + 5, RO], ...ellPts(RO, hd + tw, zt, -1, 0, Math.PI / 2)], { name: "bajo.fondo" });
const UNDER_JK = A.body(F0, [[JK.z0 - 60, 0], [JK.z0 - 60, RJ], [JK.z1 + 60, RJ], [JK.z1 + 60, 0]], { name: "bajo.chaqueta" });
// la ventana del corte: lo que se ve por el plano y = 0, proyectado a lo largo de la mirada
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const WIN = [[-R, zt], [R, zt], ...Array.from({ length: 49 }, (_, i) => { const x = R - (2 * R * i) / 48; return [x, GEO.zInTop(x)]; })];
const WINP = A.prism(FV, WIN.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]), -90000, 90000);
const CLIPWIN = A.box([-9000, -9000, -9000], [9000, 9000, 9000], { cut: [WINP] });
const XNEG = A.box([-9000, -9000, -9000], [0, 9000, 9000]);
const DEFS = [];
DEFS.push(`<clipPath id="taWin"><path d="${pth1(WIN.map(([x, z]) => pr([x, 0, z])))}"/></clipPath>`);
DEFS.push(`<clipPath id="taMouth"><path d="${pth1(arcPts(R, zt, 0, TAU, 120).slice(0, -1).map(pr))}"/></clipPath>`);
const cutStore = [];        // las caras del corte en y = 0: { owner, poly (x, z), cls }
const mirror = (poly) => poly.map(([x, z]) => [-x, z]).reverse();

/* ====================================================================
   2 · la envolvente por dentro, la tapa por fuera, la franja de la derecha y el fondo
   ==================================================================== */
{
  const sub = toned((o) => surface(cylP(R, zt, zL), cylN(-1), PI, TAU, 120, 1, o), "ta-sub");
  const dry = toned((o) => {
    surface(cylP(R, zL, zt2), cylN(-1), PI, TAU, 120, 1, o);
    surface(headP(R, hd, zt2, 1, 0, aIn), headN(R, hd, 1, -1, 0, aIn), PI, TAU, 72, 14, o);
  }, "ta-ss");
  const vs = 1.5 * PI + 0.42;
  const seams = Ln(path3(arcPts(R - 0.5, zt + 1500, PI, TAU)) + path3(arcPts(R - 0.5, zt2, PI, TAU)) + path3([[R * Math.cos(vs), R * Math.sin(vs), zt], [R * Math.cos(vs), R * Math.sin(vs), zt2]]), { tone: "faint" });
  const weld = Ln(path3(arcPts(R - 0.5, zt, PI, TAU)), { tone: "lo" });
  put("shell.in", [0, -R * 0.7, (zt + zt2) / 2], `<g clip-path="url(#taWin)">${sub}${dry}${seams}${weld}</g>`, [record({ ...SHELL, name: "shell.in", cut: [FRONT, ...HOLES, CLIPWIN] })]);
}
{
  const rr = (z) => RO * Math.sqrt(Math.max(0, 1 - ((z - zt2) / (hd + tw)) ** 2)), dr = (z) => (-(RO * RO) * (z - zt2)) / ((hd + tw) ** 2 * Math.max(1e-6, rr(z)));
  const svg = toned((o) => surface(headP(RO, hd + tw, zt2, 1, 0, aOut), headN(RO, hd + tw, 1, 1, 0, aOut), PI, TAU, 90, 16, o), "ta-ss") +
    Ln(silhouette(F0, zt2, zOutH, rr, dr, PI, TAU, 120), { tone: "mid" });
  put("shell.dome", [0, -RO * 0.6, zt2 + 400], svg, [record({ ...HEAD, name: "shell.dome", cut: [FRONT, ...HOLES, WINP] })]);
}
{
  // la franja de la derecha de la envolvente por fuera (la chaqueta la tapa en el medio)
  const svg = toned((o) => surface(cylP(RO, zt, zt2), cylN(1), 1.5 * PI, TAU, 40, 1, o), "ta-ss") +
    Ln(path3([[RO * Math.cos(fS), RO * Math.sin(fS), zt], [RO * Math.cos(fS), RO * Math.sin(fS), zt2]]), { tone: "mid" }) +
    Ln(path3(arcPts(RO + 0.3, zt2, fS, TAU, 16)), { tone: "faint" });
  put("shell.out", [RO * 0.9, -RO * 0.3, (zt + zt2) / 2], svg, [record({ ...CYL, name: "shell.out", cut: [FRONT, WINP, XNEG] })]);
}
{
  // el fondo, entero: por dentro (visto por la boca), por fuera, la cara cortada del borde de adelante y la silueta
  const inner = toned((o) => surface(headP(R, hd, zt, -1, 0, PI / 2), headN(R, hd, -1, -1, 0, PI / 2), 0, TAU, 120, 16, o), "ta-sub");
  const outer = toned((o) => surface(headP(RO, hd + tw, zt, -1, 0, PI / 2), headN(RO, hd + tw, -1, 1, 0, PI / 2), 0, TAU, 120, 16, o), "ta-ss");
  const rim = [...arcPts(RO, zt, 0, PI, 72), ...arcPts(R, zt, PI, 0, 72)];
  const rimSvg = `<g class="iso-solid ta-cut"><path class="iso-fill" d="${pth1(rim.map(pr))}"/><path class="iso-shade" data-shade="3" d="${pth1(rim.map(pr))}"/></g>` + Ln(path3(arcPts(RO, zt, 0, PI)) + path3(arcPts(R, zt, 0, PI)), { tone: "mid" });
  const rr = (z) => RO * Math.sqrt(Math.max(0, 1 - ((zt - z) / (hd + tw)) ** 2)), dr = (z) => ((RO * RO) * (zt - z)) / ((hd + tw) ** 2 * Math.max(1e-6, rr(z)));
  const sil = Ln(silhouette(F0, zb - tw + 0.5, zt, rr, dr, 0, TAU, 140), { tone: "mid" });
  const seam = Ln(path3(arcPts(RO + 0.3, zt, fS, TAU, 16)), { tone: "faint" });
  put("fondo", [0, 0, zt - 300], `<g clip-path="url(#taMouth)">${inner}</g>${outer}${seam}${rimSvg}${sil}`, [record({ ...FONDO })]);
}

/* ====================================================================
   3 · la chaqueta: la franja de la derecha, el anillo de arriba y lo que se ve por la rendija de la izquierda
   ==================================================================== */
{
  const vh = G.unit3([V3[0], V3[1], 0]);
  const keep = (p) => p[0] * vh[0] + p[1] * vh[1] >= 0 || Math.abs(p[0] * vh[1] - p[1] * vh[0]) >= RO + 0.5;
  const svg = toned((o) => {
    surface(cylP(RJi, JK.z0 + JK.cl, JK.z1 - JK.cl), cylN(-1), PI, PI + 0.09, 3, 1, o);
  }, "ta-ss") + toned((o) => {
    surface(cylP(RJ, JK.z0, JK.z1), cylN(1), 1.5 * PI, TAU, 40, 1, o);
    surface((f, u) => [(RO + (RJ - RO) * u) * Math.cos(f), (RO + (RJ - RO) * u) * Math.sin(f), JK.z1], () => ZD, fS - 0.45, TAU, 40, 1, o, keep);
  }, "ta-ss") +
    Ln(path3([[RJ * Math.cos(fS), RJ * Math.sin(fS), JK.z0], [RJ * Math.cos(fS), RJ * Math.sin(fS), JK.z1]]) + path3(arcPts(RJ, JK.z0, fS, TAU, 16)), { tone: "mid" }) +
    Ln(path3(arcPts(RJ, JK.z1, fS - Math.acos(RO / RJ), TAU, 24)) + path3(arcPts(RO + 0.2, JK.z1, fS, TAU, 16)), { tone: "mid" });
  // lo que la envolvente tapa de la chaqueta detrás de la franja de la derecha (de −31° a −121°), salvo el anillo de arriba
  // lo que la envolvente tapa: detrás del plano del eje y, en pantalla, dentro de su silueta por la derecha
  const th = [Math.sin(AZ * D2R), -Math.cos(AZ * D2R), 0], Lb = 4000;
  const BEHIND = [A.orientedBox(G.add3(G.mul3(vh, -Lb), G.add3(G.mul3(th, (RO - 0.5) / 2), [0, 0, (JK.z0 + JK.z1) / 2])), [vh, th, ZD], [Lb, (RO - 0.5) / 2, (JK.z1 - JK.z0) / 2 + 100])];
  put("jacket.out", [RJ * 0.9, -RJ * 0.3, (JK.z0 + JK.z1) / 2], svg, [record({ ...JACKET, name: "jacket.out", cut: [FRONT, WINP, ...BEHIND] })]);
  // las boquillas de la chaqueta: entrada del vapor arriba y salida del condensado abajo
  [["jk.in", 3720], ["jk.out", 1530]].forEach(([nm, z]) => {
    const ax = pol(1, JN), tg = [-Math.sin(JN * D2R), Math.cos(JN * D2R), 0];
    const F = { o: [0, 0, z], a: ax, u: tg, v: ZD };
    saddle(`${nm}.neck`, F, 44.5, (t) => G.saddleStart(RJ, 44.5, t), RJ + 110, { tone: "mid" }, { owner: nm, cls: "ta-ss", hosts: [UNDER_JK] });
    const FF = { o: [0, 0, z], a: ax, u: tg, v: ZD };
    disc(`${nm}.flange`, FF, RJ + 110, RJ + 130, 100, { tone: "mid" }, { owner: nm, cls: "ta-ss", extra: Dots(G.dotsOf(FF, RJ + 130, 78, 8, P, { all: true }), { size: 0.55 }) + `<path class="ta-bore" d="${pth1(Array.from({ length: 32 }, (_, i) => pr(G.pointOf(FF, RJ + 130.2, 40, (i / 32) * TAU))))}"/>` });
  });
}

/* ====================================================================
   4 · las caras del corte de la envolvente, la tapa, la chaqueta y la boquilla del agitador
   ==================================================================== */
{
  const right = [[R, zt], [RO, zt], ...Array.from({ length: 41 }, (_, i) => { const x = RO - ((RO - NOZ.ro) * i) / 40; return [x, GEO.zOutTop(x)]; }), [NOZ.ro, zInH], ...Array.from({ length: 41 }, (_, i) => { const x = NOZ.ro + ((R - NOZ.ro) * i) / 40; return [x, GEO.zInTop(x)]; })];
  cutStore.push({ owner: "shell", poly: right, cls: "ta-cut" }, { owner: "shell", poly: mirror(right), cls: "ta-cut" });
  const jr = JACKET_POLY.map(([z, r]) => [r, z]);
  cutStore.push({ owner: "jacket", poly: jr, cls: "ta-cut" }, { owner: "jacket", poly: mirror(jr), cls: "ta-cut" });
}

/* ====================================================================
   5 · los deflectores: el de atrás entero (partido en el nivel) y los dos del plano del corte, cortados
   ==================================================================== */
const BF = TQ.baf, BO = R - BF.gap, BI = BO - BF.w, BT = BF.t / 2;
{
  const plate = [[-BT, -BO], [BT, -BO], [BT, -BI], [-BT, -BI]];
  fp("baf.back.sub", F0, plate, BF.z0, zL, { tone: "mid" }, { owner: "baf.back", cls: "ta-sub" });
  fp("baf.back.dry", F0, plate, zL, BF.z1, { tone: "mid" }, { owner: "baf.back", cls: "ta-ss" });
  BF.clips.forEach((zc, i) => fp(`baf.back.clip${i}`, F0, [[-BT, -R], [BT, -R], [BT, -BO], [-BT, -BO]], zc - BF.clip / 2, zc + BF.clip / 2, { tone: "mid" }, { owner: "baf.back", cls: "ta-sub" }));
  // los del plano del corte: media placa (y de −t/2 a 0) con su cara cortada al frente
  [1, -1].forEach((sg) => {
    const nm = sg > 0 ? "baf.der" : "baf.izq";
    const poly = sg > 0 ? [[BI, BF.z0], [BO, BF.z0], [BO, BF.z1], [BI, BF.z1]] : [[-BO, BF.z0], [-BI, BF.z0], [-BI, BF.z1], [-BO, BF.z1]];
    fp(nm, FY0, poly, -BT, 0, { tone: "mid" }, { owner: nm, cls: "ta-cut" });
    BF.clips.forEach((zc, i) => {
      const cp = sg > 0 ? [[BO, zc - BF.clip / 2], [R, zc - BF.clip / 2], [R, zc + BF.clip / 2], [BO, zc + BF.clip / 2]] : [[-R, zc - BF.clip / 2], [-BO, zc - BF.clip / 2], [-BO, zc + BF.clip / 2], [-R, zc + BF.clip / 2]];
      fp(`${nm}.clip${i}`, FY0, cp, -BT, 0, { tone: "mid" }, { owner: nm, cls: "ta-cut" });
    });
  });
}

/* ====================================================================
   6 · la turbina de cuatro palas inclinadas y el eje
   ==================================================================== */
const IM = TQ.imp, ZI = zb + IM.C, SH = TQ.sh;
{
  const ph = IM.phase * D2R;
  const FH = { o: [0, 0, 0], a: ZD, u: [Math.cos(ph), Math.sin(ph), 0], v: [-Math.sin(ph), Math.cos(ph), 0] };
  fp("imp.hub", FH, GEO.roundSquare(IM.hub, IM.hubR), ZI - IM.hubH, ZI + IM.hubH, { tone: "mid" }, { owner: "imp", cls: "ta-sub" });
  disc("imp.collar", F0, ZI + IM.hubH, ZI + IM.hubH + 22, 60, { tone: "mid" }, { owner: "imp", cls: "ta-sub" });
  disc("imp.washer", F0, ZI - IM.hubH - 12, ZI - IM.hubH, 52, { tone: "mid" }, { owner: "imp", cls: "ta-sub" });
  fp("imp.bolt", F0, HEX(26), ZI - IM.hubH - 32, ZI - IM.hubH - 12, { tone: "mid" }, { owner: "imp", cls: "ta-sub" });
  // las palas: placa de W × t inclinada 45° (el borde de ataque arriba, bombea hacia abajo), de la cara del cubo a D/2
  const c45 = Math.SQRT1_2, hw = IM.W / 2, ht = IM.t / 2;
  const sec = [[hw * c45 - ht * c45, hw * c45 + ht * c45], [-hw * c45 - ht * c45, -hw * c45 + ht * c45], [-hw * c45 + ht * c45, -hw * c45 - ht * c45], [hw * c45 + ht * c45, hw * c45 - ht * c45]];
  for (let q = 0; q < 4; q++) {
    const t = ph + (q * Math.PI) / 2, rad = [Math.cos(t), Math.sin(t), 0], tan = [-Math.sin(t), Math.cos(t), 0];
    fp(`imp.blade${q}`, { o: [0, 0, ZI], a: rad, u: tan, v: ZD }, sec, IM.hub, IM.D / 2, { tone: "mid" }, { owner: "imp", cls: "ta-sub" });
  }
}
disc("shaft.sub", F0, ZI + IM.hubH + 22, zL, SH.r, { tone: "mid" }, { owner: "shaft", cls: "ta-sub" });
disc("shaft.dry", F0, zL, TQ.mf.z0, SH.r, { tone: "mid" }, { owner: "shaft", cls: "ta-ss" });

/* ====================================================================
   7 · la boquilla del agitador (cortada), la brida de montaje, el sello, la linterna, el acople
   ==================================================================== */
{
  const half = (r0, r1) => GEO.halfRing(r0, r1, 40);
  // el cuello, partido donde sale de la tapa: el anillo de abajo queda dentro del agujero (la tapa lo tapa por fuera)
  // de ese anillo solo se ve, por el corte, la cara de adentro: no se pinta la de afuera y se registra la cara que se ve
  const arcR = (r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [r * Math.cos(t), r * Math.sin(t)]; });
  const seen = A.prism(F0, [...arcR(NOZ.ri + 0.6, PI, 325 * D2R, 30), ...arcR(NOZ.ri, 325 * D2R, PI, 30)], zInH, zOutH, { name: "noz.neck.lo", owner: "noz" });
  fp("noz.neck.lo", F0, half(NOZ.ri, NOZ.ro), zInH, zOutH, { tone: "mid" }, { owner: "noz", cls: "ta-ss", skip: new Set(Array.from({ length: 40 }, (_, i) => i)), shapes: [seen] });
  fp("noz.neck", F0, half(NOZ.ri, NOZ.ro), zOutH, NOZ.z1, { tone: "mid" }, { owner: "noz", cls: "ta-ss" });
  fp("noz.flange", F0, half(NOZ.ri, NOZ.fl), NOZ.z1, NOZ.z1 + NOZ.ft, { tone: "mid" }, { owner: "noz", cls: "ta-ss" });
  const L = [[NOZ.ri, zInH], [NOZ.ro, zInH], [NOZ.ro, NOZ.z1], [NOZ.fl, NOZ.z1], [NOZ.fl, NOZ.z1 + NOZ.ft], [NOZ.ri, NOZ.z1 + NOZ.ft]];
  cutStore.push({ owner: "noz", poly: L, cls: "ta-cut" }, { owner: "noz", poly: mirror(L), cls: "ta-cut" });
}
const MF = TQ.mf, SE = TQ.seal, LA = TQ.lan, CP = TQ.cpl;
disc("mf.plate", F0, MF.z0, MF.z1, MF.r, { tone: "mid" }, { owner: "mf", cls: "ta-ss" });
for (let i = 0; i < MF.nb; i++) {
  const t = ((i + 0.5) * TAU) / MF.nb, c = [MF.bc * Math.cos(t), MF.bc * Math.sin(t)];
  fp(`mf.nut${i}`, FZ(c[0], c[1], 0), HEX(15, t), MF.z1, MF.z1 + 18, { tone: "mid" }, { owner: "mf", cls: "ta-ss" });
}
disc("seal.body", F0, MF.z1, SE.z1, SE.r, { tone: "mid" }, { owner: "seal", cls: "ta-trim" });
disc("seal.gland", F0, SE.z1, SE.gz, SE.gr, { tone: "mid" }, { owner: "seal", cls: "ta-trim" });
disc("seal.sleeve", F0, SE.gz, SE.sz, SE.sr, { tone: "mid" }, { owner: "seal", cls: "ta-trim", extra: Dots([0.3, -0.4].map((d) => at(G.pointOf(F0, (SE.gz + SE.sz) / 2, SE.sr + 0.5, AZ * D2R + d))), { size: 0.7 }) });
for (let i = 0; i < 4; i++) {
  const t = ((i + 0.5) * TAU) / 4, c = [112 * Math.cos(t), 112 * Math.sin(t)];
  fp(`seal.nut${i}`, FZ(c[0], c[1], 0), HEX(10, t), SE.gz, SE.gz + 11, { tone: "mid" }, { owner: "seal", cls: "ta-ss" });
}
[AZ - 38, AZ + 38].forEach((deg, j) => {
  const ax = pol(1, deg), F = { o: [0, 0, MF.z1 + 62], a: ax, u: [-ax[1], ax[0], 0], v: ZD };
  disc(`seal.port${j}`, F, Math.sqrt(SE.r * SE.r - 144), SE.r + 16, 12, { tone: "mid" }, { owner: "seal", cls: "ta-trim" });
  fp(`seal.plug${j}`, F, HEX(11), SE.r + 16, SE.r + 26, { tone: "mid" }, { owner: "seal", cls: "ta-ss" });
});
disc("shaft.lan", F0, SE.sz, CP.z0, SH.r, { tone: "mid" }, { owner: "shaft", cls: "ta-trim" });
// la linterna: anillo de abajo, cuatro columnas y la placa de arriba
{
  const ringShape = record(A.ring(F0, LA.z0, LA.z1, LA.rin, LA.rout, { name: "lan.ring", owner: "lan" }));
  put("lan.ring", [0, 0, LA.z0], wrap(S(G.ringBand(LA.z0, LA.z1, LA.rin, LA.rout, F0, P), { tone: "mid" }), "ta-drive"), [ringShape]);
  for (let q = 0; q < 4; q++) {
    const t = (45 + 90 * q) * D2R, rad = [Math.cos(t), Math.sin(t), 0], tan = [-Math.sin(t), Math.cos(t), 0];
    fp(`lan.post${q}`, { o: [0, 0, 0], a: ZD, u: rad, v: tan }, [[LA.rin + 2, -34], [LA.rout - 2, -34], [LA.rout - 2, 34], [LA.rin + 2, 34]], LA.z1, LA.post, { tone: "mid" }, { owner: "lan", cls: "ta-drive" });
  }
  disc("lan.top", F0, LA.post, LA.top, LA.rtop, { tone: "mid" }, { owner: "lan", cls: "ta-drive", extra: Dots(G.dotsOf(F0, LA.top, LA.rtop - 18, 12, P, { all: true }), { size: 0.55 }) });
}
// el acople rígido de bridas
disc("cpl.hub0", F0, CP.z0, CP.z1, CP.hub, { tone: "mid" }, { owner: "cpl", cls: "ta-trim" });
disc("cpl.fl0", F0, CP.z1, CP.z2, CP.fl, { tone: "mid" }, { owner: "cpl", cls: "ta-trim" });
disc("cpl.fl1", F0, CP.z2, CP.z3, CP.fl, { tone: "mid" }, { owner: "cpl", cls: "ta-trim", extra: Dots(G.dotsOf(F0, CP.z3, 90, 6, P, { all: true }), { size: 0.7 }) });
disc("cpl.hub1", F0, CP.z3, CP.z4, CP.hub, { tone: "mid" }, { owner: "cpl", cls: "ta-trim" });
disc("shaft.out", F0, CP.z4, LA.post, SH.r, { tone: "mid" }, { owner: "gb", cls: "ta-trim" });

/* ====================================================================
   8 · el reductor de ejes en ángulo y el motor
   ==================================================================== */
disc("gb.flange", F0, GB.flz, GB.z0, GB.fl, { tone: "mid" }, { owner: "gb", cls: "ta-drive" });
{
  const plan = { x: GB.x0, y: -GB.y, w: GB.x1 - GB.x0, d: 2 * GB.y, r: GB.r };
  const seam = k.sideSeam(plan, GB.z1 - 42, P, 6);
  box("gb.body", [GB.x0, -GB.y, GB.z0], [GB.x1, GB.y, GB.z1], { tone: "mid" }, { r: GB.r, steps: 6, bevel: 1.2, owner: "gb", cls: "ta-drive", inner: Ln(seam, { tone: "lo" }) });
  // placa de datos en la cara de adelante (+y)
  const y = GB.y, x0 = -95, x1 = 5, z0 = 5760, z1 = 5850;
  const rules = [0.3, 0.5, 0.7].map((f, i) => Ln(path3([[x0 + 12, y + 2.5, z1 - (z1 - z0) * f], [x0 + (i === 2 ? 50 : 76), y + 2.5, z1 - (z1 - z0) * f]]), { tone: "lo", free: true })).join("");
  fp("gb.plate", { o: [0, 0, 0], a: YD, u: XD, v: ZD }, [[x0, z0], [x1, z0], [x1, z1], [x0, z1]], y, y + 2.5, { tone: "hi" }, { owner: "gb", cls: "ta-ss", extra: rules + Dots([[x0 + 6, z0 + 6], [x1 - 6, z0 + 6], [x0 + 6, z1 - 6], [x1 - 6, z1 - 6]].map(([x, z]) => at([x, y + 2.5, z])), { size: 0.5 }) });
  // tapón de llenado con respiradero y tapón de nivel
  turned("gb.breather", FZ(-90, -40, GB.z1), [[0, 22], [14, 22], [14, 16], [30, 16], [36, 9]], { tone: "mid" }, { owner: "gb", cls: "ta-ss" });
  fp("gb.level", { o: [120, GB.y, 5720], a: YD, u: XD, v: ZD }, HEX(14), 0, 10, { tone: "mid" }, { owner: "gb", cls: "ta-ss" });
}
{
  const FM = { o: [0, 0, MOT.z], a: XD, u: YD, v: ZD };
  disc("mot.boss", FM, GB.x1, MOT.x0, 120, { tone: "mid" }, { owner: "gb", cls: "ta-drive" });
  disc("mot.flange", FM, MOT.x0, MOT.x1, 140, { tone: "mid" }, { owner: "mot", cls: "ta-drive", extra: Dots(G.dotsOf(FM, MOT.x1, 128, 8, P, { least: 0.05, fade: [0.04, 0.42] }), { size: 0.55 }) });
  const fins = Ln(G.ribsOf(FM, MOT.x1 + 10, MOT.x2 - 10, MOT.r, 36, P, { least: 0.08, seams: true }), { tone: "lo" });
  turned("mot.frame", FM, [[MOT.x1, MOT.r], [MOT.x2, MOT.r]], { tone: "mid" }, { owner: "mot", cls: "ta-drive", inner: fins });
  const cowl = [[MOT.x2, MOT.rc]]; for (let i = 0; i <= 8; i++) { const a = (Math.PI / 2) * (i / 8); cowl.push([MOT.x3 - 20 + 20 * Math.sin(a), MOT.rc - 20 + 20 * Math.cos(a), i > 0 && i < 8 ? 1 : 0]); }
  cowl[cowl.length - 1] = [MOT.x3, MOT.rc - 20];
  const grille = [36, 60, 84].map((rr, i) => Dots(G.dotsOf(FM, MOT.x3 + 0.2, rr, 10 + 6 * i, P, { all: true }), { size: 0.5 })).join("");
  turned("mot.cowl", FM, cowl, { tone: "mid" }, { owner: "mot", cls: "ta-drive", extra: grille });
  // la caja de bornes sobre su asiento y el prensaestopas del cable
  const FT = { o: [385, 0, MOT.z], a: ZD, u: YD, v: XD };
  const tb = saddle("mot.tbpad", FT, 52, (t) => G.saddleStart(MOT.r, 52, t), MOT.r + 14, { tone: "mid" }, { owner: "mot", cls: "ta-drive", hosts: [A.disc(FM, MOT.x1, MOT.x2, MOT.r)] });
  box("mot.tbox", [325, -62, tb.face[2]], [445, 62, tb.face[2] + 78], { tone: "mid" }, { r: 8, steps: 3, bevel: 0.8, owner: "mot", cls: "ta-drive", inner: Ln(k.sideSeam({ x: 325, y: -62, w: 120, d: 124, r: 8 }, tb.face[2] + 62, P, 3), { tone: "lo" }) });
  const FG = { o: [385, 62, tb.face[2] + 36], a: YD, u: XD, v: ZD };
  disc("mot.gland", FG, 0, 18, 13, { tone: "mid" }, { owner: "mot", cls: "ta-ss" });
  fp("mot.gnut", FG, HEX(14), 18, 28, { tone: "mid" }, { owner: "mot", cls: "ta-ss" });
}

/* ====================================================================
   9 · las boquillas de la tapa: alimentación (cáscara y agua), termopozo y boca de hombre
   ==================================================================== */
const hostsTop = [UNDER_TOP];
{
  // alimentación de la cáscara: cuello DN 250 cortado a la tapa, brida, carrete y brida de arriba; ramal del agua
  const F = FZ(FEED[0], FEED[1], GEO.zOutTop(850));
  const nk = saddle("feed.neck", F, 136.5, vStart(F, 136.5, GEO.zOutTop), 140, { tone: "mid" }, { owner: "feed", cls: "ta-ss", hosts: hostsTop });
  const z1 = nk.face[2], FF = FZ(FEED[0], FEED[1], 0);
  disc("feed.fl0", FF, z1, z1 + 25, 203, { tone: "mid" }, { owner: "feed", cls: "ta-ss", extra: Dots(G.dotsOf(FF, z1 + 25, 182, 12, P, { least: 0.05, fade: [0.04, 0.42] }), { size: 0.55 }) });
  disc("feed.fl1", FF, z1 + 25, z1 + 50, 203, { tone: "mid" }, { owner: "feed", cls: "ta-ss" });
  const SP = disc("feed.spool", FF, z1 + 50, z1 + 300, 136.5, { tone: "mid" }, { owner: "feed", cls: "ta-ss" });
  disc("feed.fl2", FF, z1 + 300, z1 + 325, 203, { tone: "mid" }, { owner: "feed", cls: "ta-ss", extra: `<path class="ta-bore" d="${pth1(Array.from({ length: 48 }, (_, i) => pr(G.pointOf(FF, z1 + 325.2, 128, (i / 48) * TAU))))}"/>` + Dots(G.dotsOf(FF, z1 + 325, 182, 12, P, { all: true }), { size: 0.55 }) });
  // el ramal del agua, hacia la izquierda de la pantalla
  const zw = z1 + 190, ax = TMINUS, FB = { o: [FEED[0], FEED[1], zw], a: ax, u: G.unit3(G.cross3(ZD, ax)), v: ZD };
  const br = saddle("water.neck", FB, 30.15, (t) => G.saddleStart(136.5, 30.15, t), 136.5 + 70, { tone: "mid" }, { owner: "water", cls: "ta-ss", hosts: [SP] });
  const FW = G.frameAlong(br.face, ax);
  disc("water.fl", FW, 0, 18, 76, { tone: "mid" }, { owner: "water", cls: "ta-ss", extra: Dots(G.dotsOf(FW, 18, 60, 4, P, { least: 0.05, fade: [0.04, 0.42] }), { size: 0.5 }) });
  pipe("water.pipe", [G.add3(br.face, G.mul3(ax, 18)), G.add3(br.face, G.mul3(ax, 330))], 30.15, { flanges: [true, true], flangeR: 2.52, flangeT: 18, open: [false, true], cls: "ta-ss", dots: 4 });
  ANCH_PRE.FEED = G.pointOf(FF, z1 + 200, 136.5, (AZ - 20) * D2R);
  ANCH_PRE.WATER = G.add3(br.face, G.mul3(ax, 200));
}
{
  // termopozo: cuello DN 50, brida, brida ciega con la vaina, cabezal de conexión; la vaina baja dentro del líquido
  const F = FZ(TWL[0], TWL[1], GEO.zOutTop(1050));
  const nk = saddle("tw.neck", F, 30.15, vStart(F, 30.15, GEO.zOutTop), 142, { tone: "mid" }, { owner: "tw", cls: "ta-ss", hosts: hostsTop });
  const z1 = nk.face[2], FF = FZ(TWL[0], TWL[1], 0);
  disc("tw.fl0", FF, z1, z1 + 18, 76, { tone: "mid" }, { owner: "tw", cls: "ta-ss" });
  disc("tw.fl1", FF, z1 + 18, z1 + 36, 76, { tone: "mid" }, { owner: "tw", cls: "ta-ss", extra: Dots(G.dotsOf(FF, z1 + 36, 60, 4, P, { all: true }), { size: 0.5 }) });
  disc("tw.ext", FF, z1 + 36, z1 + 76, 14, { tone: "mid" }, { owner: "tw", cls: "ta-trim" });
  turned("tw.head", FF, [[z1 + 76, 42], [z1 + 128, 42], [z1 + 134, 38, 1], [z1 + 138, 30]], { tone: "mid" }, { owner: "tw", cls: "ta-trim" });
  const gd = G.unit3([HV[0] - 0.4 * HV[1], HV[1] + 0.4 * HV[0], 0]), FG = { o: [TWL[0], TWL[1], z1 + 102], a: gd, u: G.unit3(G.cross3(ZD, gd)), v: ZD };
  disc("tw.gland", FG, Math.sqrt(42 * 42 - 100), 58, 10, { tone: "mid" }, { owner: "tw", cls: "ta-ss" });
  // la vaina por dentro, hasta 900 mm bajo el nivel, con la punta redonda
  const tip = 2800, rw = 17, prof = [];
  for (let i = 0; i <= 8; i++) { const a = (Math.PI / 2) * (i / 8); prof.push([tip + rw - rw * Math.cos(a), Math.max(0.01, rw * Math.sin(a)), i > 0 && i < 8 ? 1 : 0]); }
  turned("tw.sub", FF, [...prof, [zL, rw]], { tone: "mid" }, { owner: "tw", cls: "ta-sub" });
  disc("tw.dry", FF, zL, nk.face[2], rw, { tone: "mid" }, { owner: "tw", cls: "ta-ss" });
  ANCH_PRE.TW = [TWL[0] + rw * HV[0], TWL[1] + rw * HV[1], 3300];
}
{
  // boca de hombre DN 500: cuello, brida, tapa con sus tuercas y la manija
  const F = FZ(MH[0], MH[1], GEO.zOutTop(820));
  const nk = saddle("mh.neck", F, 254, vStart(F, 254, GEO.zOutTop), 175, { tone: "mid" }, { owner: "mh", cls: "ta-ss", hosts: hostsTop });
  const z1 = nk.face[2], FF = FZ(MH[0], MH[1], 0);
  disc("mh.fl", FF, z1, z1 + 30, 330, { tone: "mid" }, { owner: "mh", cls: "ta-ss" });
  disc("mh.cover", FF, z1 + 30, z1 + 66, 330, { tone: "mid" }, { owner: "mh", cls: "ta-ss", extra: Dots(G.dotsOf(FF, z1 + 66, 300, 20, P, { all: true }), { size: 0.75 }) });
  const zc = z1 + 66, hx = G.unit3([HV[1], -HV[0], 0]);
  const a0 = G.add3([MH[0], MH[1], zc], G.mul3(hx, -90)), a1 = G.add3([MH[0], MH[1], zc], G.mul3(hx, 90));
  const route = G.fillet([a0, G.add3(a0, [0, 0, 70]), G.add3(a1, [0, 0, 70]), a1], 26, 8, { P, tube: 11 });
  tubeItems("mh.handle", route, 11, { tone: "mid", cls: "ta-trim", maxLength: 90 });
  ANCH_PRE.MH = G.pointOf(FF, z1 - 45, 254, (AZ - 75) * D2R);
}

/* ====================================================================
   10 · las patas, la salida de fondo con su válvula de bola y el tubo de descarga
   ==================================================================== */
const LG = TQ.legs, hostsBot = [UNDER_BOT];
[45, 135, 225, 315].forEach((deg, q) => {
  const c = pol(LG.r, deg), zc = GEO.zOutBot(LG.r);
  const F = { o: [c[0], c[1], zc], a: [0, 0, -1], u: XD, v: YD };
  const pd = saddle(`leg${q}.pad`, F, LG.a, vStart(F, LG.a, GEO.zOutBot), 80, { tone: "mid" }, { owner: `leg${q}`, cls: "ta-ss", hosts: hostsBot });
  disc(`leg${q}.post`, FZ(c[0], c[1], 0), LG.pt, pd.face[2], LG.rp, { tone: "mid" }, { owner: `leg${q}`, cls: "ta-ss" });
  box(`stand.leg${q}`, [c[0] - LG.plate, c[1] - LG.plate, 0], [c[0] + LG.plate, c[1] + LG.plate, LG.pt], { tone: "mid" }, { r: 6, steps: 3, bevel: 0.8, cls: "ta-ss" });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], j) => fp(`leg${q}.anchor${j}`, FZ(c[0] + a * 112, c[1] + b * 112, 0), HEX(18), LG.pt, LG.pt + 16, { tone: "mid" }, { owner: `leg${q}`, cls: "ta-ss" }));
});
{
  const OU = TQ.out, F = { o: [0, 0, zb - tw], a: [0, 0, -1], u: XD, v: YD };
  const pd = saddle("out.pad", F, 75, vStart(F, 75, GEO.zOutBot), 20, { tone: "mid" }, { owner: "out", cls: "ta-ss", hosts: hostsBot });
  disc("out.neck", F0, OU.z1, pd.face[2], OU.r, { tone: "mid" }, { owner: "out", cls: "ta-ss" });
  disc("out.fl", F0, OU.z1 - OU.ft, OU.z1, OU.fl, { tone: "mid" }, { owner: "out", cls: "ta-ss" });
  // la válvula de bola: bridas, cuerpo, cuello del vástago y la palanca (cerrada: atravesada al tubo)
  const v1 = OU.z1 - OU.ft, v0 = v1 - 229;
  disc("valve.fl0", F0, v1 - 22, v1, OU.fl, { tone: "mid" }, { owner: "valve", cls: "ta-cast" });
  disc("valve.fl1", F0, v0, v0 + 22, OU.fl, { tone: "mid" }, { owner: "valve", cls: "ta-cast" });
  const vm = (v0 + v1) / 2, bulge = (s) => 70 + 36 * Math.cos(((s - vm) / (v1 - 22 - vm)) * (Math.PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = v0 + 22 + ((v1 - 22 - (v0 + 22)) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned("valve.body", F0, prof, { tone: "mid" }, { owner: "valve", cls: "ta-cast" });
  const st = pol(1, AZ + 12), FS = { o: [0, 0, vm], a: st, u: G.unit3(G.cross3(ZD, st)), v: ZD };
  disc("valve.neck", FS, Math.sqrt(106 * 106 - 30 * 30) - 2, 150, 30, { tone: "mid" }, { owner: "valve", cls: "ta-cast" });
  disc("valve.stem", FS, 150, 172, 13, { tone: "mid" }, { owner: "valve", cls: "ta-trim" });
  const lv = G.unit3(G.cross3(ZD, st)), FL = { o: G.add3([0, 0, vm], G.mul3(st, 172)), a: lv, u: st, v: ZD };
  fp("valve.lever", FL, [[0, -20], [9, -20], [9, 20], [0, 20]], -24, 300, { tone: "mid" }, { owner: "valve", cls: "ta-lever" });
  // el tubo de descarga: baja a un codo y sale hacia la izquierda
  const elbow = [0, 0, 150];
  ball("out.elbow", elbow, 76, { tone: "mid" }, { owner: "out", cls: "ta-ss" });
  pipe("out.pipe", [[0, 0, v0], elbow], OU.r, { flanges: [true, false], flangeR: OU.fl / OU.r, flangeT: 22, cls: "ta-ss", balls: [{ c: elbow, R: 76, at: "end" }], dots: 8 });
  const dir = TMINUS, end = G.add3(elbow, G.mul3(dir, 640));
  pipe("out.run", [elbow, end], OU.r, { flanges: [false, true], flangeR: OU.fl / OU.r, flangeT: 22, cls: "ta-ss", balls: [{ c: elbow, R: 76, at: "start" }], open: [false, true], dots: 8 });
  ANCH_PRE.VALVE = G.pointOf(F0, vm + 10, bulge(vm + 10), (AZ - 70) * D2R);
}

/* ====================================================================
   11 · la superficie del líquido: lámina translúcida en la mitad de atrás
   ==================================================================== */
{
  const half = arcPts(R, zL, PI, TAU, 120).map(([x, y]) => [x, y]);
  const holes = [A.disc(F0, zL - 6, zL + 6, SH.r + 0.4), A.disc(FZ(TWL[0], TWL[1], 0), zL - 6, zL + 6, 17.4),
    A.box([-BT - 0.4, -BO - 0.4, zL - 6], [BT + 0.4, -BI + 0.4, zL + 6]), A.box([BI - 0.4, -BT - 0.4, zL - 6], [BO + 0.4, 0.4, zL + 6]), A.box([-BO - 0.4, -BT - 0.4, zL - 6], [-BI + 0.4, 0.4, zL + 6])];
  const d = pth1(half.map(([x, y]) => pr([x, y, zL])));
  // la lámina solo se ve por la abertura del corte: el dibujo va recortado a ella y la forma registrada también
  const svg = `<g clip-path="url(#taWin)"><path class="ta-liq" d="${d}"/>` + Ln(path3(arcPts(R - 0.5, zL, PI, TAU, 120)), { tone: "mid" }) + Ln(path3([[-R, 0, zL], [R, 0, zL]]), { tone: "lo" }) + "</g>";
  put("liq", [0, -R * 0.5, zL], svg, [record(A.prism(F0, half, zL - 1, zL, { name: "liq", owner: "liq", cut: [...holes, CLIPWIN] }))]);
}

/* ====================================================================
   12 · trozos de cáscara en la suspensión y las flechas del patrón de flujo axial (en un plano justo detrás del corte)
   ==================================================================== */
{
  let seed = 11;
  const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const placed = [];
  let tries = 0;
  while (placed.length < 26 && tries++ < 6000) {
    const r = 160 + rnd() * (R - 300), th = PI + 0.12 + rnd() * (PI - 0.24), z = zt + 140 + rnd() * (zL - 120 - zt - 140);
    const x = r * Math.cos(th), y = r * Math.sin(th);
    if (y > -110) continue;
    if (r < 540 && z < ZI + 330) continue;                                         // la turbina
    if (Math.abs(x) < 90 && y < -BI + 90) continue;                                  // el deflector de atrás
    if (Math.hypot(x - TWL[0], y - TWL[1]) < 110 && z > 2650) continue;              // la vaina del termopozo
    if (placed.some((q) => Math.hypot(q[0] - x, q[1] - y, (q[2] - z) * 0.8) < 300)) continue;
    placed.push([x, y, z]);
  }
  placed.forEach((c, i) => {
    const g = [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5], n = G.unit3(G.add3(V3, G.mul3(G.unit3(g), 1.1)));
    const u = G.unit3(G.cross3(n, Math.abs(n[2]) > 0.9 ? XD : ZD)), v = G.cross3(n, u);
    const m = 5 + Math.floor(rnd() * 2), rr = 30 + rnd() * 22, poly = [];
    for (let j = 0; j < m; j++) { const t = (j / m) * TAU + (rnd() - 0.5) * 0.7; const q = rr * (0.7 + rnd() * 0.4); poly.push([q * Math.cos(t), q * Math.sin(t)]); }
    // en suspensión: su forma cuenta para el orden de pintura, no para los apoyos
    const F = { o: c, a: n, u, v };
    put(`peel${i}`, c, X.prismSvg(C, poly, -3, 3, { F, tone: "mid", cls: "ta-peel" }), [A.prism(F, poly, -3, 3, { name: `peel${i}`, owner: `peel${i}` })]);
  });
}
const FLOW = [];             // las flechas del flujo, en (x, z) sobre el plano y = −60
{
  const YF = -60, rf = 8;
  const right = [
    [[470, 1255], [560, 1150], [720, 1105], [860, 1185]],
    [[790, 1420], [800, 2300], [795, 3280]],
    [[730, 3500], [540, 3440], [370, 3150], [300, 2500], [300, 1760]],
  ];
  const smooth = (ctl, n = 40) => {   // Catmull-Rom por los puntos de control
    const out = [];
    for (let i = 0; i < ctl.length - 1; i++) {
      const p0 = ctl[Math.max(0, i - 1)], p1 = ctl[i], p2 = ctl[i + 1], p3 = ctl[Math.min(ctl.length - 1, i + 2)];
      for (let j = 0; j < n; j++) {
        const t = j / n, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3)));
      }
    }
    out.push(ctl[ctl.length - 1]);
    return out;
  };
  [1, -1].forEach((sg) => right.forEach((ctl, j) => {
    const pts = smooth(ctl.map(([x, z]) => [sg * x, z])).map(([x, z]) => [x, YF, z]);
    const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[n - 4], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const h = 7.5, w = 3.6, base = [b[0] - ux * h, b[1] - uy * h];
    const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
    const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
    const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
    const nm = `flow.${sg > 0 ? "der" : "izq"}${j}`;
    FLOW.push(pts);
    put(nm, pts[Math.floor(pts.length / 2)], `<path class="ta-flujo" d="${line}"/><path class="ta-flecha" d="${head}"/>`, [A.tube(pts, rf), A.ball(pts[pts.length - 1], w / G.scaleOf(P))]);
  }));
}

/* ---------- las caras del corte, un elemento por pieza ---------- */
{
  const groups = new Map();
  for (const c of cutStore) { const key = c.owner + "|" + c.cls; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls] = key.split("|");
    const d = list.map((c) => pth1(c.poly.map(([x, z]) => pr([x, 0, z])))).join("");
    const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
    const shapes = list.map((c) => record(A.prism(FY0, c.poly, -0.3, 0, { name: `${owner}.corte`, owner })));
    const cx = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.corte`, [cx[0] / n, 0, cx[1] / n], svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.TA_ITEM) {
  for (const nm of process.env.TA_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
if (process.env.TA_PAIRS) {
  // depuración: dónde va delante cada lado de los pares pedidos (TA_PAIRS="a,b;c,d")
  for (const pair of process.env.TA_PAIRS.split(";")) {
    const [na, nb] = pair.split(",");
    const its = R_.items.filter((it) => it.name === na || it.name === nb);
    const o = A.overlapsOf(its, PA, { step: STEP });
    for (const pp of o.pairs) console.log(its[pp.a].name, "vs", its[pp.b].name, JSON.stringify(pp.front.map((f) => ({ area: f.area, depth: f.depth && +f.depth.toFixed(2), at: f.at && f.at.map((v) => +v.toFixed(1)) }))));
  }
  process.exit(0);
}
const t0 = Date.now();
if (!FAST) A.settle(R_, PA, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");
R_.items.sort((a, b) => a.key - b.key);
const CSS = `.ta-cut{--anatomy-paper:#c9ced3;--anatomy-face:#c9ced3;--anatomy-top:#c9ced3;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#c9ced3;--anatomy-shade-2:#c9ced3;--anatomy-shade-3:#c9ced3}
.ta-ss{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#ccd1d6;--anatomy-shade-1:#d5d9dd;--anatomy-shade-2:#dde1e4;--anatomy-shade-3:#e5e8ea}
.ta-trim{--anatomy-paper:#f4f5f6;--anatomy-face:#f4f5f6;--anatomy-top:#fbfbfc;--anatomy-shade-0:#d6d9dc;--anatomy-shade-1:#dfe2e4;--anatomy-shade-2:#e7e9eb;--anatomy-shade-3:#eef0f1}
.ta-sub{--anatomy-paper:#dbe5ec;--anatomy-face:#dfe8ee;--anatomy-top:#e1eaf0;--anatomy-shade-0:#bccbd5;--anatomy-shade-1:#c5d3dc;--anatomy-shade-2:#cdd9e1;--anatomy-shade-3:#d5e0e7}
.ta-drive{--anatomy-paper:#e2e6ea;--anatomy-face:#e2e6ea;--anatomy-top:#edf0f2;--anatomy-shade-0:#b9c1c8;--anatomy-shade-1:#c3cad0;--anatomy-shade-2:#ccd2d7;--anatomy-shade-3:#d5dadf}
.ta-cast{--anatomy-paper:#e3e6e9;--anatomy-face:#e3e6e9;--anatomy-top:#eceef0;--anatomy-shade-0:#c4c9ce;--anatomy-shade-1:#cdd1d5;--anatomy-shade-2:#d5d9dc;--anatomy-shade-3:#dde0e3}
.ta-lever{--anatomy-paper:#d9dde1;--anatomy-face:#d9dde1;--anatomy-top:#e6e9ec;--anatomy-shade-0:#aeb5bc;--anatomy-shade-1:#b8bfc5;--anatomy-shade-2:#c2c8ce;--anatomy-shade-3:#ccd1d6}
.ta-liq{fill:#c4d7e3;fill-opacity:.55;stroke:none}
.ta-bore{fill:#a9b1b9;stroke:none}
.ta-peel{--anatomy-paper:#e9dcbf;--anatomy-face:#ecdfc3;--anatomy-top:#f1e7d1;--anatomy-shade-0:#cdb98f;--anatomy-shade-1:#d6c49d;--anatomy-shade-2:#ddcda9;--anatomy-shade-3:#e4d6b5}
.ta-flujo{fill:none;stroke:#2f5f86;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.ta-flecha{fill:#2f5f86;stroke:none;opacity:.85}`;
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
const svg = k.figureSvg({ width: W, height: H, label: "Tanque agitado en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="ta-items">${groups.join("")}</g>`] });
const OUT = process.env.TA_OUT || join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(process.env.TA_OUT ? join(OUT, "preview.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Tanque agitado", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
{
  const az = AZ * D2R, face = (r, z, d = 0) => [r * Math.cos(az + d), r * Math.sin(az + d), z];
  const ph = TQ.imp.phase * D2R + Math.PI / 2;
  Object.assign(ANCH_PRE, {
    TANQUE: [-(R + tw / 2), 0, 4150], CHAQUETA: [-(RJi + JK.t / 2), 0, 3000], NIVEL: [-760, 0, zL],
    DEFLECTOR: [BT, -(BI + BO) / 2, 3880], EJE: face(SH.r, 4250, -0.6), IMPULSOR: [(IM.D / 2 - 30) * Math.cos(ph), (IM.D / 2 - 30) * Math.sin(ph), ZI + 20],
    SELLO: face(SE.r, 5230, 0.15), LINTERNA: [Math.cos(45 * D2R) * LA.rout, Math.sin(45 * D2R) * LA.rout, 5480], ACOPLE: face(CP.fl, 5480, 0.5),
    REDUCTOR: [60, GB.y, 5930], MOTOR: [470, 0, MOT.z + MOT.r * 0.0].map((v, i) => v + [0, MOT.r * Math.sin(az) * 0.9, MOT.r * 0.42][i]),
    CHAQ_IN: G.add3(pol(RJ + 130, JN), [0, 0, 3720 + 60]), CHAQ_OUT: G.add3(pol(RJ + 130, JN), [0, 0, 1530 - 60]),
    PATAS: [pol(TQ.legs.r, 135)[0] + TQ.legs.rp * HV[0], pol(TQ.legs.r, 135)[1] + TQ.legs.rp * HV[1], 300],
    FONDO: face(RO, zt - 330, 0.9),
  });
}
writeFileSync(join(OUT, "tanque_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH_PRE }));
if (!FAST) A.auditOrExit(R_, PA, {});
