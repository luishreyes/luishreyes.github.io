/* ====================================================================
   Filtro a presión de doble medio en isométrico (skill anatomy), para el capítulo 15 del libro de operaciones
   unitarias (Partículas en un fluido): el filtro que limpia el agua de servicios de la planta.
   Concepto: el agua cruda entra por la corona, choca con la placa deflectora del distribuidor (que la reparte para que
   no cave la antracita) y baja por 0,6 m de agua libre, 0,5 m de antracita y 0,3 m de arena; pasa por las ranuras de
   las boquillas de la placa (el falso fondo, sin grava) y sale del pleno por el fondo. Los dos manómetros, en la
   entrada y en la salida, leen la caída del lecho: cuando llega a unos 50 kPa se lava, con aire y agua que entran al
   pleno y suben por las boquillas; el agua del lavado sale por la misma boquilla de la corona.
   Corte: se quita lo que mira al lector por encima de la línea de tangencia del fondo (y > 0, z > zt). El fondo queda
   entero; la envolvente, la tapa, la placa, la boquilla de entrada y el distribuidor se ven cortados por el plano y = 0.
   El medio va escalonado: además de la mitad del lector se quita el cuarto de atrás a la derecha (x > 0, y < 0) hasta
   la placa, así se ven las cabezas de las boquillas, y el medio que queda muestra las capas en sus dos caras (y = 0 y
   x = 0). Todo lo de adentro está bajo el agua (el filtro va lleno) y lleva su tinte (fa-sub).
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
const STEP = Number(process.env.FA_STEP || 0.25);
const FA = GEO.FA, DN = GEO.DN, RO = GEO.RO;
const { R, tw, hd, zt, zt2 } = FA;
const ZB = GEO.ZB, ZP0 = GEO.ZP0, ZP = GEO.ZP, ZS = GEO.ZS, ZA = GEO.ZA, ZD = GEO.ZD, ZC = GEO.ZC, ZCO = GEO.ZCO;
const AZ = FA.AZ, EL = FA.EL;

const W = 600, H = 800;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const pol = (r, deg, z = 0) => [r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z];
const TMINUS = [-Math.sin(AZ * D2R), Math.cos(AZ * D2R), 0];   // hacia la izquierda de la pantalla, en el piso
const TPLUS = G.mul3(TMINUS, -1);                                // hacia la derecha
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)

/* ---------- la cámara ---------- */
const EXT = [];
for (let d = 0; d < 360; d += 15) EXT.push(pol(RO + 4, d, zt), pol(RO + 4, d, zt2), pol(RO * 0.7, d, zt - 300));
FA.legs.degs.forEach((d) => { const c = pol(FA.legs.r, d); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => EXT.push([c[0] + a * FA.legs.plate, c[1] + b * FA.legs.plate, 0])); });
{
  const zE = FA.inlet.z1 + 25.4 + FA.inlet.spool, vL = 25.4 * 3 + 56 + 110;
  EXT.push([0, 0, zE + 110], G.add3([0, 0, zE + 140], G.mul3(TMINUS, FA.inlet.run + vL)), G.add3([0, 0, zE - 140], G.mul3(TMINUS, FA.inlet.run + vL)), G.add3([0, 0, zE + 300], G.mul3(TMINUS, 330)), G.add3([0, 0, zE + 200], G.mul3(TMINUS, FA.inlet.run + 300)));
  const o = pol(FA.bot.r, FA.bot.out, FA.bot.run), b = pol(FA.bot.rb, FA.bot.bw, FA.bot.run);
  EXT.push(G.add3(o, G.mul3(TMINUS, 560 + 240)), G.add3(G.add3(o, G.mul3(TMINUS, 560 + 120)), [0, 0, -130]), G.add3(G.add3(o, G.mul3(TMINUS, 400)), [0, 0, 290]));
  EXT.push(G.add3(b, G.mul3(TPLUS, 520 + 250)), G.add3(G.add3(b, G.mul3(TPLUS, 520 + 120)), [0, 0, -150]), G.add3(G.add3(b, G.mul3(TPLUS, 520 + 120)), [0, 0, 240]));
}
EXT.push(pol(RO + 520, FA.side.deg, FA.side.air), pol(RO + 260, FA.side.deg, FA.side.hh + 200), pol(RO + 260, FA.side.deg, FA.side.hh - 200));
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso

/* El dibujo va en milímetros; el audit, en centímetros (como el tanque agitado): sus muestras de superficie van cada
   0,6 unidades y un recipiente de 1,5 m en milímetros no cabe en memoria. cm() pasa cada forma registrada a
   centímetros (con sus cortes) y PA es la misma cámara con la escala por 10. */
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
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null, rec = true } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) });
  const shape = rec ? record(sh) : sh;
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
function tubeItems(name, route, r, { tone = "mid", maxLength = 140, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, spacing = null, owner = name } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
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
/* un tubo recto: cada esfera en un extremo (at: "start" o "end") recibe el tubo hasta su superficie */
function pipe(name, control, r, { tone = "mid", cls = "", maxLength = 140, balls = [], open = [false, false], gaps = [], owner = name } = {}) {
  const line = control.map((q) => [...q]);
  for (const b of balls) {
    const i = b.at === "start" ? 0 : line.length - 1, j = b.at === "start" ? 1 : line.length - 2, dir = G.unit3(G.sub3(line[j], b.c));
    line[i] = G.add3(b.c, G.mul3(dir, entry(b.R, r)));
  }
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), cls, maxLength, ends: [!open[0], !open[1]], owner });
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
const hexR = (af) => af / Math.sqrt(3);

/* ---------- superficies con tonos suaves (de la válvula de control y del tanque agitado) ---------- */
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
// una cara plana: polígono 3D con su normal; tono por la luz
function flatFace(pts, n, cls = "") {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return `<g class="iso-solid${cls ? " " + cls : ""}">` + (b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`) + "</g>";
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
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: XD, v: YD });
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD3 };     // el plano del corte: sección (x, z), espesor a lo largo de y
const FX0 = { o: [0, 0, 0], a: XD, u: YD, v: ZD3 };     // el plano x = 0: sección (y, z), espesor a lo largo de x
const F0 = FZ();
const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
// una cabeza elíptica: a de a0 a a1 (0 en el ecuador); up = 1 arriba, −1 abajo; sg = 1 normal hacia afuera, −1 hacia adentro
const headP = (rr, hh, zc, up, a0, a1) => (f, u) => { const a = a0 + (a1 - a0) * u, r = rr * Math.cos(a); return [r * Math.cos(f), r * Math.sin(f), zc + up * hh * Math.sin(a)]; };
const headN = (rr, hh, up, sg, a0, a1) => (f, u) => { const a = a0 + (a1 - a0) * u; return G.mul3(G.unit3([Math.cos(a) * hh * Math.cos(f), Math.cos(a) * hh * Math.sin(f), up * Math.sin(a) * rr]), sg); };
const arcPts = (r, z, f0, f1, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t), z]; });
const fS = (AZ - 90) * D2R + TAU;                      // la silueta de la derecha de un cilindro vertical
const mirror = (poly) => poly.map(([x, z]) => [-x, z]).reverse();
const cutStore = [];        // las caras del corte en y = 0: { owner, poly (x, z), cls }
const DEFS = [];
const circ = (F, s, r, n = 40) => Array.from({ length: n }, (_, i) => G.pointOf(F, s, r, (i / n) * TAU));

/* ====================================================================
   1 · las formas registradas de la envolvente, el fondo y el corte
   ==================================================================== */
const FRONT = A.box([-9000, 0, zt], [9000, 9000, 9000]);
const NH = 24;
const ellPts = (rr, hh, zc, up, a0, a1, n = NH) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [zc + up * hh * Math.sin(a), rr * Math.cos(a)]; });
const NI = DN[150];                                      // la boquilla de entrada, en la corona
const aIn = Math.acos(NI.ro / R), aOut = Math.acos(NI.ro / RO);
const zInH = GEO.zInTop(NI.ro), zOutH = GEO.zOutTop(NI.ro);
const VENT = pol(FA.vent.r, FA.vent.deg), MHC = pol(FA.mh.r, FA.mh.deg);
const SIDE = FA.side.deg;
const radial = (deg) => [Math.cos(deg * D2R), Math.sin(deg * D2R), 0];
const tangent = (deg) => [-Math.sin(deg * D2R), Math.cos(deg * D2R), 0];
// los agujeros de las boquillas en la envolvente y en la tapa
const HOLES = [
  A.disc(FZ(VENT[0], VENT[1], 0), 2800, 3400, DN[25].ro), A.disc(FZ(MHC[0], MHC[1], 0), 2700, 3400, DN[400].ro),
  A.disc({ o: [0, 0, FA.side.air], a: radial(SIDE), u: tangent(SIDE), v: ZD3 }, 0, 1200, DN[50].ro - 8),
  A.disc({ o: [0, 0, FA.side.hh], a: radial(SIDE), u: tangent(SIDE), v: ZD3 }, 0, 1200, DN[200].ro - 8),
];
const BOT = [[pol(FA.bot.r, FA.bot.out), DN[100].ro], [pol(FA.bot.rb, FA.bot.bw), DN[150].ro], [[0, 0, 0], DN[50].ro]];
const BHOLES = BOT.map(([c, r]) => A.disc(FZ(c[0], c[1], 0), 0, zt, r));
const SHELL_POLY = [[zt, R], ...ellPts(R, hd, zt2, 1, 0, aIn), [zOutH, NI.ro], ...ellPts(RO, hd + tw, zt2, 1, aOut, 0), [zt, RO]];
const CYL = A.body(F0, [[zt, R], [zt2, R], [zt2, RO], [zt, RO]], { name: "shell.cyl", owner: "shell" });
const FONDO = A.body(F0, [[ZB, 0], ...ellPts(R, hd, zt, -1, PI / 2, 0), [zt, R], [zt, RO], ...ellPts(RO, hd + tw, zt, -1, 0, PI / 2), [ZB - tw, 0]], { name: "fondo", owner: "fondo", cut: BHOLES });
const SHELL = A.body(F0, SHELL_POLY, { name: "shell", owner: "shell", cut: [FRONT, ...HOLES] });
const HEAD = A.body(F0, [[zt2, R], ...ellPts(R, hd, zt2, 1, 0, aIn), [zOutH, NI.ro], ...ellPts(RO, hd + tw, zt2, 1, aOut, 0), [zt2, RO]], { name: "shell.head", owner: "shell" });
// lo que queda debajo de la superficie de afuera de la tapa, del fondo y de la envolvente: los cuellos y asientos se
// cortan con esto, así su forma registrada empieza justo en la superficie, como se dibuja
const UNDER_TOP = A.body(F0, [[zt2 - 5, 0], [zt2 - 5, RO], ...ellPts(RO, hd + tw, zt2, 1, 0, PI / 2)], { name: "bajo.tapa" });
const UNDER_BOT = A.body(F0, [[zt + 5, 0], [zt + 5, RO], ...ellPts(RO, hd + tw, zt, -1, 0, PI / 2)], { name: "bajo.fondo" });
const UNDER_CYL = A.body(F0, [[zt - 60, 0], [zt - 60, RO], [zt2 + 60, RO], [zt2 + 60, 0]], { name: "bajo.envolvente" });
// la ventana del corte: lo que se ve por el plano y = 0, proyectado a lo largo de la mirada
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const WIN = [[-R, zt], [R, zt], ...Array.from({ length: 49 }, (_, i) => { const x = R - (2 * R * i) / 48; return [x, GEO.zInTop(x)]; })];
const WINP = A.prism(FV, WIN.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]), -90000, 90000);
const CLIPWIN = A.box([-9000, -9000, -9000], [9000, 9000, 9000], { cut: [WINP] });
const XNEG = A.box([-9000, -9000, -9000], [0, 9000, 9000]);
DEFS.push(`<clipPath id="faWin"><path d="${pth1(WIN.map(([x, z]) => pr([x, 0, z])))}"/></clipPath>`);
DEFS.push(`<clipPath id="faMouth"><path d="${pth1(arcPts(R, zt, 0, TAU, 120).slice(0, -1).map(pr))}"/></clipPath>`);

/* ====================================================================
   2 · la envolvente por dentro, la tapa por fuera, la franja de la derecha y el fondo
   ==================================================================== */
{
  const svg = toned((o) => {
    surface(cylP(R, zt, zt2), cylN(-1), PI, TAU, 120, 1, o);
    surface(headP(R, hd, zt2, 1, 0, aIn), headN(R, hd, 1, -1, 0, aIn), PI, TAU, 72, 14, o);
  }, "fa-sub");
  // las costuras de la envolvente: dos circunferenciales (en las tangencias) y una longitudinal; la de la placa la tapa
  const vs = 1.5 * PI + 0.42;
  const seams = Ln(path3(arcPts(R - 0.5, zt2, PI, TAU)) + path3([[R * Math.cos(vs), R * Math.sin(vs), zt], [R * Math.cos(vs), R * Math.sin(vs), zt2]]), { tone: "faint" });
  const weld = Ln(path3(arcPts(R - 0.5, zt, PI, TAU)), { tone: "lo" });
  put("shell.in", [0, -R * 0.7, (zt + zt2) / 2], `<g clip-path="url(#faWin)">${svg}${seams}${weld}</g>`, [record({ ...SHELL, name: "shell.in", cut: [FRONT, ...HOLES, CLIPWIN] })]);
}
{
  const rr = (z) => RO * Math.sqrt(Math.max(0, 1 - ((z - zt2) / (hd + tw)) ** 2)), dr = (z) => (-(RO * RO) * (z - zt2)) / ((hd + tw) ** 2 * Math.max(1e-6, rr(z)));
  const svg = toned((o) => surface(headP(RO, hd + tw, zt2, 1, 0, aOut), headN(RO, hd + tw, 1, 1, 0, aOut), PI, TAU, 90, 16, o), "fa-ss") +
    Ln(silhouette(F0, zt2, zOutH, rr, dr, PI, TAU, 120), { tone: "mid" });
  // la cara del corte de la pared la dibuja shell.corte: la forma registrada de la tapa por fuera empieza 12 mm atrás
  const SLAB = A.box([-9000, -12, zt2 - 10], [9000, 0.5, 9000]);
  put("shell.dome", [0, -RO * 0.6, zt2 + 250], svg, [record({ ...HEAD, name: "shell.dome", cut: [FRONT, ...HOLES, WINP, SLAB] })]);
}
{
  // la franja de la derecha de la envolvente por fuera
  const svg = toned((o) => surface(cylP(RO, zt, zt2), cylN(1), 1.5 * PI, TAU, 40, 1, o), "fa-ss") +
    Ln(path3([[RO * Math.cos(fS), RO * Math.sin(fS), zt], [RO * Math.cos(fS), RO * Math.sin(fS), zt2]]), { tone: "mid" }) +
    Ln(path3(arcPts(RO + 0.3, zt2, fS, TAU, 16)), { tone: "faint" });
  // se registra solo la franja que se dibuja: de −35° (un poco más allá de la silueta) al corte
  const f0 = fS - TAU - 5 * D2R, nb = [Math.sin(f0), -Math.cos(f0), 0], tb = [Math.cos(f0), Math.sin(f0), 0];
  const BEHIND = A.orientedBox(G.mul3(nb, 2000), [nb, tb, ZD3], [2000, 4000, 9000]);
  put("shell.out", [RO * 0.9, -RO * 0.3, (zt + zt2) / 2], svg, [record({ ...CYL, name: "shell.out", cut: [FRONT, XNEG, BEHIND, ...HOLES] })]);
}
{
  // el fondo, entero: por dentro (visto por la boca), por fuera, la cara cortada del borde de adelante y la silueta.
  // Por dentro se ven los agujeros de la salida, del lavado y del drenaje.
  const inner = toned((o) => surface(headP(R, hd, zt, -1, 0, PI / 2), headN(R, hd, -1, -1, 0, PI / 2), 0, TAU, 84, 12, o), "fa-sub");
  const bores = BOT.map(([c, r]) => `<path class="fa-bore" d="${pth1(Array.from({ length: 40 }, (_, i) => { const t = (i / 40) * TAU, x = c[0] + r * Math.cos(t), y = c[1] + r * Math.sin(t); return pr([x, y, GEO.zInBot(Math.hypot(x, y)) + 0.5]); }))}"/>`).join("");
  const outer = toned((o) => surface(headP(RO, hd + tw, zt, -1, 0, PI / 2), headN(RO, hd + tw, -1, 1, 0, PI / 2), 0, TAU, 84, 12, o), "fa-ss");
  const rim = [...arcPts(RO, zt, 0, PI, 72), ...arcPts(R, zt, PI, 0, 72)];
  const rimSvg = `<g class="iso-solid fa-cut"><path class="iso-fill" d="${pth1(rim.map(pr))}"/><path class="iso-shade" data-shade="3" d="${pth1(rim.map(pr))}"/></g>` + Ln(path3(arcPts(RO, zt, 0, PI)) + path3(arcPts(R, zt, 0, PI)), { tone: "mid" });
  const rr = (z) => RO * Math.sqrt(Math.max(0, 1 - ((zt - z) / (hd + tw)) ** 2)), dr = (z) => ((RO * RO) * (zt - z)) / ((hd + tw) ** 2 * Math.max(1e-6, rr(z)));
  const sil = Ln(silhouette(F0, ZB - tw + 0.5, zt, rr, dr, 0, TAU, 140), { tone: "mid" });
  const seam = Ln(path3(arcPts(RO + 0.3, zt, fS, TAU, 16)), { tone: "faint" });
  put("fondo", [0, 0, zt - 250], `<g clip-path="url(#faMouth)">${inner}${bores}</g>${outer}${seam}${rimSvg}${sil}`, [record({ ...FONDO })]);
}

/* ====================================================================
   3 · las caras del corte de la envolvente, la tapa y la placa
   ==================================================================== */
{
  const right = [[R, zt], [RO, zt], ...Array.from({ length: 41 }, (_, i) => { const x = RO - ((RO - NI.ro) * i) / 40; return [x, GEO.zOutTop(x)]; }), [NI.ro, zInH], ...Array.from({ length: 41 }, (_, i) => { const x = NI.ro + ((R - NI.ro) * i) / 40; return [x, GEO.zInTop(x)]; })];
  cutStore.push({ owner: "shell", poly: right, cls: "fa-cut" }, { owner: "shell", poly: mirror(right), cls: "fa-cut" });
}


/* ====================================================================
   4 · la placa de boquillas (el falso fondo): cara de arriba, anillo de apoyo y la cara del corte
   ==================================================================== */
const PL = FA.plate, RING = PL.ring;
{
  const top = GEO.halfRing(0, R, 96).map(([x, y]) => [x, y, ZP]);
  const svg = flatFace(top, ZD3, "fa-sub") + Ln(path3(arcPts(R - 0.5, ZP, PI, TAU, 96)), { tone: "lo" });
  put("plate", [0, -R * 0.5, ZP], svg, [record(A.prism(F0, GEO.halfRing(0, R, 48), ZP0, ZP, { name: "plate", owner: "plate" }))]);
  cutStore.push({ owner: "plate", poly: [[-R, ZP0], [R, ZP0], [R, ZP], [-R, ZP]], cls: "fa-cut" });
  // el anillo de apoyo bajo la placa, soldado a la envolvente: por la ventana se ve su cara de adentro y la de abajo
  const ri = R - RING.w, z0 = ZP0 - RING.t;
  const ring = toned((o) => surface(cylP(ri, z0, ZP0), cylN(-1), PI, TAU, 96, 1, o), "fa-sub") + Ln(path3(arcPts(ri, z0, PI, TAU, 96)), { tone: "mid" });
  put("plate.ring", [0, -ri, z0], `<g clip-path="url(#faWin)">${ring}</g>`, [record(A.prism(F0, GEO.halfRing(ri, R, 48), z0, ZP0, { name: "plate.ring", owner: "plate", cut: [CLIPWIN] }))]);
  cutStore.push({ owner: "plate", poly: [[ri, z0], [R, z0], [R, ZP0], [ri, ZP0]], cls: "fa-cut" }, { owner: "plate", poly: [[-R, z0], [-ri, z0], [-ri, ZP0], [-R, ZP0]], cls: "fa-cut" });
}

/* ====================================================================
   5 · las boquillas: la cola bajo la placa (todas las de la mitad de atrás) y la cabeza ranurada sobre ella (las del
   cuarto sin medio, x > 0); las del cuarto con medio quedan enterradas en la arena
   ==================================================================== */
const NZ = FA.noz, NOZ = GEO.nozzles();
// un agujerito en la cara de un cilindro vertical, del lado que mira al lector
const holeAt = (c, r, z, rh = 2.6) => {
  const p = [c[0] + HV[0] * (r + 0.2), c[1] + HV[1] * (r + 0.2), z], t = [-HV[1], HV[0], 0];
  return `<path class="fa-hole" d="${pth1(Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * TAU; return pr(G.add3(G.add3(p, G.mul3(t, rh * Math.cos(a))), [0, 0, rh * Math.sin(a)])); }))}"/>`;
};
const circPoly = (r, n) => Array.from({ length: n }, (_, i) => { const t = (i / n) * TAU; return [r * Math.cos(t), r * Math.sin(t)]; });
NOZ.forEach(([x, y], q) => {
  const F = FZ(x, y, 0), zn = ZP0 - NZ.nh, zb = ZP0 - NZ.L;
  const tube = tubePieces([[x, y, zn], [x, y, zb]], NZ.tail, P, { maxLength: 2000, spacing: 400, caps: [false, true] }).map((part) => tubeSvg(part, { tone: "mid" })).join("");
  const svgT = tube + X.prismSvg(C, HEX(NZ.nut + 2, 0), zn, ZP0, { F, tone: "mid" }) + holeAt([x, y], NZ.tail, zn - NZ.hole);
  const shT = [record(A.disc(F, zb, zn, NZ.tail, { name: `noz${q}.tail`, owner: `noz${q}` })), record(A.prism(F, HEX(NZ.nut + 2, 0), zn, ZP0, { name: `noz${q}.nut`, owner: `noz${q}` }))];
  put(`noz${q}.tail`, [x, y, (zb + ZP0) / 2], wrap(svgT, "fa-noz"), shT);
  if (x > 0) {
    const z1 = ZP + NZ.sh, z2 = z1 + NZ.body;
    const dome = Array.from({ length: 5 }, (_, i) => { const a = (PI / 2) * (i / 4); return [z2 + NZ.dome * Math.sin(a), Math.max(0.01, NZ.head * Math.cos(a)), i > 0 && i < 4 ? 1 : 0]; });
    const prof = [[ZP, NZ.sleeve], [z1, NZ.sleeve], [z1, NZ.head], ...dome];
    const slots = Ln(G.ribsOf(F, z1 + 6, z2 - 5, NZ.head, 14, P, { least: 0.12, seams: true }), { tone: "lo" });
    turned(`noz${q}.head`, F, prof, { tone: "mid" }, { owner: `noz${q}`, cls: "fa-noz", inner: slots, steps: 18, smooth: { rows: 2, depth: 3, fineness: 0.6, error: 0.9 } });
  }
});

/* ====================================================================
   6 · el medio: el cuarto de atrás a la izquierda (x < 0, y < 0), con la arena abajo y la antracita arriba. Se ven la
   cara del corte (y = 0), la del escalón (x = 0) y el techo de la antracita. Los granos van en patrones dibujados en
   el plano de cada cara (cinco a diez veces más grandes que los reales, para que se vean) y la interfaz es una línea
   un poco ondulada con algunos granos de cada capa metidos en la otra.
   ==================================================================== */
let seed = 7;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const wig = (t) => 7 * Math.sin(t / 47 + 1.3) + 4.5 * Math.sin(t / 19 + 0.4) + 2.5 * Math.sin(t / 7.3 + 2.1);
const ZI = (t) => ZS + wig(t);
const f2 = (v) => (Math.round(v * 10) / 10).toString();
// un grano: polígono de m lados alrededor de (u, v), radio r, en coordenadas de la cara
const grain = (u, v, r, m) => { const a0 = rnd() * TAU, pts = []; for (let j = 0; j < m; j++) { const a = a0 + (j / m) * TAU + (rnd() - 0.5) * 0.9, q = r * (0.65 + rnd() * 0.5); pts.push([u + q * Math.cos(a), v + q * Math.sin(a)]); } return pts; };
const gpath = (pts) => pts.map(([u, v], i) => (i ? "L" : "M") + f2(u) + " " + f2(v)).join("") + "Z";
// un mosaico que se repite sin costura: cada grano que cruza un borde se dibuja también del otro lado
function tile(id, T, groups) {
  let body = "";
  for (const { cls, n, r0, r1, m } of groups) {
    let d = "";
    for (let i = 0; i < n; i++) {
      const u = rnd() * T, v = rnd() * T, r = r0 + rnd() * (r1 - r0), pts = grain(u, v, r, m);
      for (const du of [-T, 0, T]) for (const dv of [-T, 0, T]) {
        if ((du && (u + du < -r1 || u + du > T + r1)) || (dv && (v + dv < -r1 || v + dv > T + r1))) continue;
        d += gpath(pts.map(([a, b]) => [a + du, b + dv]));
      }
    }
    body += `<path class="${cls}" d="${d}"/>`;
  }
  DEFS.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${T}" height="${T}">${body}</pattern>`);
}
tile("faAntA", 96, [{ cls: "fa-gl", n: 62, r0: 3.4, r1: 6.4, m: 5 }]);
tile("faAntB", 131, [{ cls: "fa-gd", n: 70, r0: 1.6, r1: 3.2, m: 4 }, { cls: "fa-gh", n: 36, r0: 1.8, r1: 3.4, m: 4 }]);
tile("faSanA", 61, [{ cls: "fa-sl", n: 120, r0: 1.1, r1: 2.1, m: 4 }]);
tile("faSanB", 83, [{ cls: "fa-sd", n: 110, r0: 1.1, r1: 2.0, m: 4 }, { cls: "fa-sk", n: 10, r0: 1.8, r1: 2.5, m: 5 }]);
// el patrón en el plano de una cara: la cara (u, v) → pantalla es afín
function facePattern(id, base, to3) {
  const O = pr(to3(0, 0)), U1 = pr(to3(1, 0)), V1 = pr(to3(0, 1));
  DEFS.push(`<pattern id="${id}" href="#${base}" patternTransform="matrix(${[U1[0] - O[0], U1[1] - O[1], V1[0] - O[0], V1[1] - O[1], O[0], O[1]].map((v) => +v.toFixed(5)).join(" ")})"/>`);
  return id;
}
const MED = { y0: (u, v) => [u, 0, v], x0: (u, v) => [0, u, v], top: (u, v) => [u, v, ZA] };
for (const [face, to3] of Object.entries(MED)) {
  facePattern(`faAntA-${face}`, "faAntA", to3); facePattern(`faAntB-${face}`, "faAntB", to3);
  if (face !== "top") { facePattern(`faSanA-${face}`, "faSanA", to3); facePattern(`faSanB-${face}`, "faSanB", to3); }
}
{
  const NI_ = 60, iface = Array.from({ length: NI_ + 1 }, (_, i) => -R + (R * i) / NI_);   // t de −R a 0
  const sandPoly = [[-R, ZP], [0, ZP], ...iface.slice().reverse().map((t) => [t, ZI(t)])];
  const anthPoly = [[-R, ZA], [0, ZA], ...iface.slice().reverse().map((t) => [t, ZI(t)])];
  const topPoly = GEO.quarter(R, 48);
  const fillWith = (poly, to3, cls, pats) => { const d = pth1(poly.map(([u, v]) => pr(to3(u, v)))); return `<path class="${cls}" d="${d}"/>` + pats.map((p) => `<path fill="url(#${p})" d="${d}"/>`).join(""); };
  // los granos sueltos de la interfaz: antracita metida en la arena y arena en la antracita, en una franja de unos 2,5 cm
  const mixed = (to3) => {
    let dA = "", dS = "";
    for (let i = 0; i < 46; i++) {
      const t = -R + 8 + rnd() * (R - 16), down = rnd() ** 1.4 * FA.mix;
      const g = grain(t, ZI(t) - down - 2, 2.8 + rnd() * 2.2, 5);
      dA += pth1(g.map(([u, v]) => pr(to3(u, v))));
    }
    for (let i = 0; i < 90; i++) {
      const t = -R + 6 + rnd() * (R - 12), up = rnd() ** 1.4 * FA.mix;
      const g = grain(t, ZI(t) + up + 1.5, 1.8 + rnd() * 1.2, 4);
      dS += pth1(g.map(([u, v]) => pr(to3(u, v))));
    }
    return `<path class="fa-mixa" d="${dA}"/><path class="fa-mixs" d="${dS}"/>`;
  };
  let svg = "";
  for (const face of ["x0", "y0"]) {
    const to3 = MED[face];
    svg += fillWith(sandPoly, to3, `fa-san-${face}`, [`faSanA-${face}`, `faSanB-${face}`]) + fillWith(anthPoly, to3, `fa-ant-${face}`, [`faAntA-${face}`, `faAntB-${face}`]) + mixed(to3);
  }
  svg += fillWith(topPoly, MED.top, "fa-ant-top", ["faAntA-top", "faAntB-top"]);
  // las aristas: las del techo y la esquina, la de abajo del escalón sobre la placa y las que tocan la envolvente
  svg += Ln(path3([[-R, 0, ZA], [0, 0, ZA], [0, -R, ZA]]) + path3([[0, 0, ZP], [0, 0, ZA]]) + path3([[0, 0, ZP], [0, -R, ZP]]), { tone: "mid" }) +
    Ln(path3([[0, -R, ZP], [0, -R, ZA]]) + path3(arcPts(R - 0.5, ZA, PI, 1.5 * PI, 48)), { tone: "lo" });
  put("medio", [-R * 0.35, -R * 0.35, (ZP + ZA) / 2], `<g class="fa-medio">${svg}</g>`, [record(A.prism(F0, GEO.quarter(R, 24), ZP, ZA, { name: "medio", owner: "medio" }))]);
}

/* ====================================================================
   7 · la boquilla de entrada (cortada) y el distribuidor: la boquilla entra 110 mm en la tapa y descarga sobre una placa
   deflectora colgada de cuatro pletinas (las dos de atrás quedan; las otras dos se fueron con el corte)
   ==================================================================== */
const DS = FA.dist, zN0 = ZC - DS.in, zF0 = FA.inlet.z1 - NI.ft, zF1 = FA.inlet.z1;
{
  // la boquilla va en tres piezas sin costuras dibujadas: el hueco (la cara de adentro, de la punta de abajo a la brida,
  // una sola superficie) y la cara de afuera que se ve, la franja de la derecha (de la silueta, a −30°, al corte), dentro
  // del recipiente y encima de la tapa; entre las dos la tapa la tapa. Cada pieza registra la capa que dibuja.
  const arcR = (r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [r * Math.cos(t), r * Math.sin(t)]; });
  const band = (r0, r1, a0, a1) => [...arcR(r1, a0, a1, 24), ...arcR(r0, a1, a0, 24)];
  const fN = fS - TAU;                                         // la silueta de la derecha, −30°
  {
    const svg = toned((o) => surface(cylP(NI.ri, zN0, zF0), cylN(-1), PI, TAU, 48, 1, o), "fa-sub") +
      Ln(path3(arcPts(NI.ri, zN0, PI, TAU + fN, 40)), { tone: "mid" });
    put("in.bore", [0, -NI.ri, (zN0 + zF0) / 2], svg, [record(A.prism(F0, band(NI.ri, NI.ri + 0.8, PI, TAU), zN0, zF0, { name: "in.bore", owner: "inlet" }))]);
  }
  const outer = (name, z0, z1, cls) => {
    const svg = toned((o) => surface(cylP(NI.ro, z0, z1), cylN(1), TAU + fN, TAU, 8, 1, o), cls) +
      Ln(path3([[NI.ro * Math.cos(fN), NI.ro * Math.sin(fN), z0], [NI.ro * Math.cos(fN), NI.ro * Math.sin(fN), z1]]), { tone: "mid" }) +
      (name === "in.neck.lo" ? Ln(path3(arcPts(NI.ro, z0, TAU + fN, TAU, 8)), { tone: "mid" }) : "");
    put(name, [NI.ro * 0.95, -NI.ro * 0.25, (z0 + z1) / 2], svg, [record(A.prism(F0, band(NI.ro - 0.8, NI.ro, TAU + fN - 0.1, TAU), z0, z1, { name, owner: "inlet" }))]);
  };
  outer("in.neck.lo", zN0, zInH - 12, "fa-sub");   // los últimos 12 mm bajo la tapa los tapa la pared de la tapa
  outer("in.neck", zOutH, zF0, "fa-ss");
  // la pared entera de la boquilla, solo para los apoyos: de ella cuelgan las pletinas del distribuidor
  record(A.prism(F0, GEO.halfRing(NI.ri, NI.ro, 40), zN0, zOutH, { name: "in.neck.pared", owner: "inlet" }));
  fp("in.flange", F0, GEO.halfRing(NI.ri, NI.fl, 48), zF0, zF1, { tone: "mid" }, { owner: "inlet", cls: "fa-ss" });
  const L = [[NI.ri, zN0], [NI.ro, zN0], [NI.ro, zF0], [NI.fl, zF0], [NI.fl, zF1], [NI.ri, zF1]];
  cutStore.push({ owner: "inlet", poly: L, cls: "fa-cut" }, { owner: "inlet", poly: mirror(L), cls: "fa-cut" });
  const zb0 = ZD, zb1 = ZD + DS.t;
  fp("dist.plate", F0, GEO.halfRing(0, DS.r, 48), zb0, zb1, { tone: "mid" }, { owner: "dist", cls: "fa-sub" });
  cutStore.push({ owner: "dist", poly: [[-DS.r, zb0], [DS.r, zb0], [DS.r, zb1], [-DS.r, zb1]], cls: "fa-cut" });
  [225, 315].forEach((deg, i) => {
    const rad = radial(deg), tan = tangent(deg), [bw, bt] = DS.bar;
    fp(`dist.bar${i}`, { o: [0, 0, 0], a: ZD3, u: rad, v: tan }, [[NI.ro, -bt / 2], [NI.ro + bw, -bt / 2], [NI.ro + bw, bt / 2], [NI.ro, bt / 2]], zb1, zN0 + 40, { tone: "mid" }, { owner: "dist", cls: "fa-sub" });
  });
}

/* ====================================================================
   8 · válvulas y manómetros (piezas que se repiten)
   ==================================================================== */
// válvula de mariposa entre bridas, con palanca: la tubería llega a p por el eje dir; brida de la tubería, cuerpo, brida
// de la tubería que sigue, un tramo corto y su brida (el resto de la tubería de la planta no se dibuja)
function butterfly(name, p, dir, d, { open = true, stub = 110 } = {}) {
  const F = G.frameAlong(p, dir), bw = d.ro > 70 ? 56 : 52, rb = d.bc - 14;
  const face = Math.abs(G.dot3(dir, V3)) > 0.12;
  const bolts = (s) => (face ? Dots(G.dotsOf(F, s, d.bc, d.nb, P, { all: true }), { size: 0.5 }) : "");
  disc(`${name}.fl0`, F, 0, d.ft, d.fl, { tone: "mid" }, { owner: name, cls: "fa-pipe" });
  disc(`${name}.body`, F, d.ft, d.ft + bw, rb, { tone: "mid" }, { owner: name, cls: "fa-cast" });
  disc(`${name}.fl1`, F, d.ft + bw, 2 * d.ft + bw, d.fl, { tone: "mid" }, { owner: name, cls: "fa-pipe", extra: bolts(2 * d.ft + bw) });
  const s2 = 2 * d.ft + bw, s3 = s2 + stub;
  pipe(`${name}.stub`, [G.add3(p, G.mul3(dir, s2)), G.add3(p, G.mul3(dir, s3))], d.ro, { cls: "fa-pipe" });
  disc(`${name}.fl2`, F, s3, s3 + d.ft, d.fl, { tone: "mid" }, { owner: name, cls: "fa-pipe" });
  // el cuello del eje, arriba, y la palanca: a lo largo del tubo si está abierta, atravesada si está cerrada
  const mid = G.add3(p, G.mul3(dir, d.ft + bw / 2)), FN = { o: mid, a: ZD3, u: dir, v: G.unit3(G.cross3(ZD3, dir)) };
  const n0 = Math.sqrt(rb * rb - 18 * 18) - 1, n1 = rb + 70;
  disc(`${name}.neck`, FN, n0, n1, 18, { tone: "mid" }, { owner: name, cls: "fa-cast" });
  fp(`${name}.top`, FN, [[-32, -32], [32, -32], [32, 32], [-32, 32]], n1, n1 + 10, { tone: "mid" }, { owner: name, cls: "fa-cast" });
  const la = open ? dir : HV, top = G.add3(mid, [0, 0, n1 + 10]), Lv = d.ro > 70 ? 300 : 240;
  disc(`${name}.hub`, FN, n1 + 10, n1 + 26, 12, { tone: "mid" }, { owner: name, cls: "fa-trim" });
  fp(`${name}.lever`, { o: G.add3(top, [0, 0, 8]), a: la, u: G.unit3(G.cross3(ZD3, la)), v: ZD3 }, [[-13, 0], [13, 0], [13, 8], [-13, 8]], -24, Lv, { tone: "mid" }, { owner: name, cls: "fa-lever" });
  return { end: G.add3(p, G.mul3(dir, s3 + d.ft)), body: mid, rb };
}
// válvula de bola bridada con palanca: F.a es el sentido del flujo y la cara de entrada está en s0
function ballValve(name, F, s0, d, { open = false, stem = null } = {}) {
  const Lv = 178, ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, { tone: "mid" }, { owner: name, cls: "fa-cast" });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner: name, cls: "fa-cast" });
  const face = G.dot3(F.a, V3) > 0.12;
  const bore = face ? `<path class="fa-bore-dk" d="${pth1(circ(F, s1 + 0.3, d.ri, 40).map(pr))}"/>` : "";
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, { tone: "mid" }, { owner: name, cls: "fa-cast", extra: bore + (face ? Dots(G.dotsOf(F, s1, d.bc, d.nb, P, { all: true }), { size: 0.5 }) : "") });
  const st = stem || G.unit3(G.cross3(F.a, Math.abs(F.a[2]) > 0.9 ? HV : ZD3));
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - 16 * 16) - 2, r1 + 34, 16, { tone: "mid" }, { owner: name, cls: "fa-cast" });
  disc(`${name}.stem`, FS, r1 + 34, r1 + 46, 7, { tone: "mid" }, { owner: name, cls: "fa-trim" });
  const lv = open ? F.a : G.unit3(G.cross3(st, F.a)), FL = { o: G.add3(c, G.mul3(st, r1 + 46)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
  fp(`${name}.lever`, FL, [[0, -11], [6, -11], [6, 11], [0, 11]], -18, 200, { tone: "mid" }, { owner: name, cls: "fa-lever" });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, r1 };
}
// manómetro sobre un tubo horizontal (eje dir, centro c, radio rp): asiento, llave de aislamiento, niple y la caja con
// la carátula mirando al lector; la aguja marca bar en una escala de 0 a 6
function gauge(name, c, rp, dir, bar, owner) {
  const uq = G.unit3(G.cross3(ZD3, dir)), FB = { o: c, a: ZD3, u: uq, v: dir };
  saddle(`${name}.boss`, FB, 15, (t) => G.saddleStart(rp, 15, t), rp + 26, { tone: "mid" }, { owner, cls: "fa-pipe", hosts: [A.disc(G.frameAlong(c, dir), -400, 400, rp, { owner })] });
  const F = FZ(c[0], c[1], c[2]);
  fp(`${name}.cock`, F, HEX(14, 0), rp + 26, rp + 50, { tone: "mid" }, { owner, cls: "fa-trim" });
  const Rg = 50, zc = c[2] + rp + 50 + 46 + Rg;
  disc(`${name}.nipple`, F, rp + 50, zc - c[2] - Math.sqrt(Rg * Rg - 8 * 8), 8, { tone: "mid" }, { owner, cls: "fa-trim" });
  const ctr = [c[0], c[1], zc], ux = G.unit3(G.cross3(ZD3, HV)), FG = { o: ctr, a: HV, u: ux, v: ZD3 };
  // la caja y la carátula: la carátula es la tapa de adelante; encima van el bisel, las marcas, la aguja y el eje
  const ring = (r, s) => pth1(Array.from({ length: 48 }, (_, i) => pr(G.pointOf(FG, s, r, (i / 48) * TAU))));
  const s1 = 15, a0 = 225 * D2R, a1 = -45 * D2R, ang = (v) => a0 + (a1 - a0) * (v / 6);
  let ticks = "";
  for (let i = 0; i <= 24; i++) { const v = (6 * i) / 24, a = ang(v), r0 = i % 4 === 0 ? 33 : 37.5; ticks += path3([G.pointOf(FG, s1 + 0.2, r0, a), G.pointOf(FG, s1 + 0.2, 42, a)]); }
  const dial = `<path class="fa-dial" d="${ring(42, s1 + 0.1)}"/>` + Ln(ring(42, s1 + 0.2).replace(/Z$/, "") + "Z", { tone: "mid" }) + Ln(ticks, { tone: "lo" }) +
    Ln(path3([G.pointOf(FG, s1 + 0.3, 3, ang(bar) + PI), G.pointOf(FG, s1 + 0.3, 31, ang(bar))]), { tone: "hi", free: "end" }) + Dots([at(G.pointOf(FG, s1 + 0.4, 0, 0))], { size: 1.1 });
  disc(`${name}.case`, FG, -s1, s1, Rg, { tone: "mid" }, { owner, cls: "fa-gauge", extra: dial });
  return { centre: ctr, face: G.pointOf(FG, s1, 24, 120 * D2R) };
}

/* ====================================================================
   9 · la tubería de entrada (entera): brida, carrete, codo, el tramo hacia la izquierda con su manómetro y la válvula
   ==================================================================== */
{
  const zP1 = zF1 + NI.ft;
  disc("in.pflange", F0, zF1, zP1, NI.fl, { tone: "mid" }, { owner: "inlet", cls: "fa-pipe", extra: Dots(G.dotsOf(F0, zP1, NI.bc, NI.nb, P, { all: true }), { size: 0.55 }) });
  // el carrete sube y dobla 90° (codo de radio corto, 1 × el diámetro nominal) hacia la izquierda de la pantalla
  const elbow = [0, 0, zP1 + FA.inlet.spool], end = G.add3(elbow, G.mul3(TMINUS, FA.inlet.run));
  tubeItems("in.pipe", G.fillet([[0, 0, zP1], elbow, end], 152, 10, { P, tube: NI.ro }), NI.ro, { cls: "fa-pipe" });
  const gIn = gauge("gauge.in", G.add3(elbow, G.mul3(TMINUS, 360)), NI.ro, TMINUS, 3.5, "in.pipe");
  const v = butterfly("in.valve", end, TMINUS, NI, { open: true });
  ANCH.MANOMETRO_IN = gIn.face;
  ANCH.ENTRADA = G.add3(v.body, [0, 0, -v.rb * 0.4]);
  ANCH.ENTRADA_TUBO = G.add3(elbow, G.add3(G.mul3(TMINUS, 560), [0, 0, -NI.ro * 0.5]));
}

/* ====================================================================
   10 · el venteo (DN 25, con su válvula de alivio de aire) y la boca de visita DN 400 de la tapa
   ==================================================================== */
const hostsTop = [UNDER_TOP];
{
  const d = DN[25], F = FZ(VENT[0], VENT[1], GEO.zOutTop(FA.vent.r));
  const nk = saddle("vent.neck", F, d.ro, vStart(F, d.ro, GEO.zOutTop), FA.vent.h, { tone: "mid" }, { owner: "vent", cls: "fa-ss", hosts: hostsTop });
  const z1 = nk.face[2], FF = FZ(VENT[0], VENT[1], 0);
  disc("vent.fl0", FF, z1, z1 + d.ft, d.fl, { tone: "mid" }, { owner: "vent", cls: "fa-ss" });
  disc("vent.fl1", FF, z1 + d.ft, z1 + 2 * d.ft, d.fl, { tone: "mid" }, { owner: "vent", cls: "fa-cast", extra: Dots(G.dotsOf(FF, z1 + 2 * d.ft, d.bc, d.nb, P, { all: true }), { size: 0.5 }) });
  const zb = z1 + 2 * d.ft;
  turned("vent.body", FF, [[zb, 34], [zb + 96, 34], [zb + 96, 39], [zb + 110, 39], [zb + 113, 36, 1], [zb + 115, 30]], { tone: "mid" }, { owner: "vent", cls: "fa-cast" });
  const zo = zb + 70, FO = { o: [VENT[0], VENT[1], zo], a: TMINUS, u: HV, v: ZD3 };
  const on = saddle("vent.out", FO, 9, (t) => G.saddleStart(34, 9, t), 34 + 26, { tone: "mid" }, { owner: "vent", cls: "fa-trim", hosts: [A.disc(FF, zb, zb + 96, 34)] });
  fp("vent.plug", FO, HEX(11, 0), 34 + 26, 34 + 38, { tone: "mid" }, { owner: "vent", cls: "fa-trim" });
  ANCH.VENTEO = [VENT[0] + 34 * HV[0], VENT[1] + 34 * HV[1], zb + 48];
}
{
  const d = DN[400], F = FZ(MHC[0], MHC[1], GEO.zOutTop(FA.mh.r));
  const zFace = FA.mh.top - 2 * d.ft;
  const nk = saddle("mh.neck", F, d.ro, vStart(F, d.ro, GEO.zOutTop), zFace - F.o[2], { tone: "mid" }, { owner: "mh", cls: "fa-ss", hosts: hostsTop });
  const FF = FZ(MHC[0], MHC[1], 0);
  disc("mh.fl", FF, zFace, zFace + d.ft, d.fl, { tone: "mid" }, { owner: "mh", cls: "fa-ss" });
  disc("mh.cover", FF, zFace + d.ft, zFace + 2 * d.ft, d.fl, { tone: "mid" }, { owner: "mh", cls: "fa-ss", extra: Dots(G.dotsOf(FF, zFace + 2 * d.ft, d.bc, d.nb, P, { all: true }), { size: 0.75 }) });
  const zc = zFace + 2 * d.ft, hx = G.unit3([HV[1], -HV[0], 0]);
  const a0 = G.add3([MHC[0], MHC[1], zc], G.mul3(hx, -85)), a1 = G.add3([MHC[0], MHC[1], zc], G.mul3(hx, 85));
  const route = G.fillet([a0, G.add3(a0, [0, 0, 62]), G.add3(a1, [0, 0, 62]), a1], 22, 8, { P, tube: 10 });
  tubeItems("mh.handle", route, 10, { tone: "mid", cls: "fa-trim", maxLength: 90 });
  ANCH.MANHOL = G.pointOf(FF, zFace + d.ft * 1.5, d.fl, (AZ - 40) * D2R);
}

/* ====================================================================
   11 · la franja de la derecha: la entrada del aire al pleno (DN 50, válvula de bola cerrada) y el registro de mano
   DN 200 sobre la placa
   ==================================================================== */
{
  const ax = radial(SIDE), tg = tangent(SIDE), d = DN[50], s1 = RO + 110;
  const Fa = { o: [0, 0, FA.side.air], a: ax, u: tg, v: ZD3 };
  saddle("air.neck", Fa, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, { tone: "mid" }, { owner: "air", cls: "fa-ss", hosts: [UNDER_CYL] });
  disc("air.fl", Fa, s1, s1 + d.ft, d.fl, { tone: "mid" }, { owner: "air", cls: "fa-ss" });
  const v = ballValve("air.valve", Fa, s1 + d.ft, d, { open: false, stem: ZD3 });
  ANCH.AIRE = G.add3(v.body, G.mul3(ZD3, -v.r1 * 0.7));
  const dh = DN[200], s2 = RO + 120, Fh = { o: [0, 0, FA.side.hh], a: ax, u: tg, v: ZD3 };
  saddle("hh.neck", Fh, dh.ro, (t) => G.saddleStart(RO, dh.ro, t), s2, { tone: "mid" }, { owner: "hh", cls: "fa-ss", hosts: [UNDER_CYL] });
  disc("hh.fl", Fh, s2, s2 + dh.ft, dh.fl, { tone: "mid" }, { owner: "hh", cls: "fa-ss" });
  disc("hh.cover", Fh, s2 + dh.ft, s2 + 2 * dh.ft, dh.fl, { tone: "mid" }, { owner: "hh", cls: "fa-ss", extra: Dots(G.dotsOf(Fh, s2 + 2 * dh.ft, dh.bc, dh.nb, P, { all: true }), { size: 0.6 }) });
  const c0 = G.pointOf(Fh, s2 + 2 * dh.ft, 0, 0);
  const route = G.fillet([G.add3(c0, [0, 0, -62]), G.add3(G.add3(c0, [0, 0, -62]), G.mul3(ax, 48)), G.add3(G.add3(c0, [0, 0, 62]), G.mul3(ax, 48)), G.add3(c0, [0, 0, 62])], 20, 8, { P, tube: 9 });
  tubeItems("hh.handle", route, 9, { tone: "mid", cls: "fa-trim", maxLength: 90 });
}

/* ====================================================================
   12 · abajo: las patas, el drenaje del polo, la salida del agua filtrada (DN 100, con su manómetro) y la entrada del
   agua de lavado (DN 150)
   ==================================================================== */
const LG = FA.legs, hostsBot = [UNDER_BOT];
LG.degs.forEach((deg, q) => {
  const c = pol(LG.r, deg), zc = GEO.zOutBot(LG.r);
  const F = { o: [c[0], c[1], zc], a: [0, 0, -1], u: XD, v: YD };
  const pd = saddle(`leg${q}.pad`, F, LG.a, vStart(F, LG.a, GEO.zOutBot), 60, { tone: "mid" }, { owner: `leg${q}`, cls: "fa-ss", hosts: hostsBot });
  disc(`leg${q}.post`, FZ(c[0], c[1], 0), LG.pt, pd.face[2], LG.rp, { tone: "mid" }, { owner: `leg${q}`, cls: "fa-ss" });
  box(`stand.leg${q}`, [c[0] - LG.plate, c[1] - LG.plate, 0], [c[0] + LG.plate, c[1] + LG.plate, LG.pt], { tone: "mid" }, { r: 6, steps: 3, bevel: 0.8, cls: "fa-ss" });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], j) => fp(`leg${q}.anchor${j}`, FZ(c[0] + a * 84, c[1] + b * 84, 0), HEX(14), LG.pt, LG.pt + 13, { tone: "mid" }, { owner: `leg${q}`, cls: "fa-ss" }));
  if (deg === 75) ANCH.PATAS = [c[0] + LG.rp * HV[0], c[1] + LG.rp * HV[1], 330];
});
{
  // el drenaje, en el polo: cuello, brida y válvula de bola (cerrada)
  const d = DN[50], F = { o: [0, 0, ZB - tw], a: [0, 0, -1], u: XD, v: YD };
  const pd = saddle("drain.neck", F, d.ro, vStart(F, d.ro, GEO.zOutBot), 70, { tone: "mid" }, { owner: "drain", cls: "fa-ss", hosts: hostsBot });
  const zf = pd.face[2];
  disc("drain.fl", F0, zf - d.ft, zf, d.fl, { tone: "mid" }, { owner: "drain", cls: "fa-ss" });
  const v = ballValve("drain.valve", { o: [0, 0, zf - d.ft], a: [0, 0, -1], u: XD, v: YD }, 0, d, { open: false, stem: G.unit3(pol(1, AZ + 15)) });
  ANCH.DRENAJE = G.add3(v.body, G.mul3(HV, v.r1 * 0.8));
}
function bottomLine(name, deg, r, d, dir, { run, gaugeAt = 0, bar = 0, open = true }) {
  const c = pol(r, deg), z0 = GEO.zOutBot(r);
  const F = { o: [c[0], c[1], z0], a: [0, 0, -1], u: XD, v: YD };
  const nk = saddle(`${name}.neck`, F, d.ro, vStart(F, d.ro, GEO.zOutBot), 85, { tone: "mid" }, { owner: name, cls: "fa-ss", hosts: hostsBot });
  const zf = nk.face[2], FF = FZ(c[0], c[1], 0);
  disc(`${name}.fl0`, FF, zf - d.ft, zf, d.fl, { tone: "mid" }, { owner: name, cls: "fa-ss" });
  disc(`${name}.fl1`, FF, zf - 2 * d.ft, zf - d.ft, d.fl, { tone: "mid" }, { owner: name, cls: "fa-pipe" });
  // baja y dobla 90° (codo de radio corto, 1 × el diámetro nominal) hacia su lado
  const elbow = [c[0], c[1], FA.bot.run], end = G.add3(elbow, G.mul3(dir, run));
  tubeItems(`${name}.pipe`, G.fillet([[c[0], c[1], zf - 2 * d.ft], elbow, end], d.ro > 70 ? 152 : 102, 10, { P, tube: d.ro }), d.ro, { cls: "fa-pipe" });
  const g = gaugeAt ? gauge(`gauge.${name}`, G.add3(elbow, G.mul3(dir, gaugeAt)), d.ro, dir, bar, `${name}.pipe`) : null;
  const v = butterfly(`${name}.valve`, end, dir, d, { open });
  return { elbow, end, v, g };
}
{
  const o = bottomLine("out", FA.bot.out, FA.bot.r, DN[100], TMINUS, { run: 560, gaugeAt: 400, bar: 3.0, open: true });
  ANCH.SALIDA = G.add3(o.elbow, G.add3(G.mul3(TMINUS, 500), [0, 0, -DN[100].ro * 0.55]));
  ANCH.MANOMETRO_OUT = o.g.face;
  const b = bottomLine("bw", FA.bot.bw, FA.bot.rb, DN[150], TPLUS, { run: 520, open: false });
  ANCH.LAVADO = G.add3(b.elbow, G.add3(G.mul3(TPLUS, 380), [0, 0, -DN[150].ro * 0.55]));
}

/* ====================================================================
   13 · las flechas del flujo en servicio, en un plano justo detrás del corte (y = −40): baja por la boquilla de
   entrada, la placa deflectora la abre hacia los lados, baja por el agua libre y, en el pleno, va hacia la salida
   ==================================================================== */
{
  const YF = -40, rf = 8;
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
  const FLOW = [
    ["flow.in", [[0, 3270], [0, 3070]]],
    ["flow.d0", [[110, ZD - 12], [250, ZD - 40], [360, ZD - 190], [400, ZA + 120]]],
    ["flow.d1", [[-110, ZD - 12], [-250, ZD - 40], [-360, ZD - 190], [-400, ZA + 120]]],
    ["flow.d2", [[250, ZD + 4], [470, ZD - 40], [600, ZD - 220], [620, ZA + 120]]],
    ["flow.d3", [[-250, ZD + 4], [-470, ZD - 40], [-600, ZD - 220], [-620, ZA + 120]]],
    ["flow.p0", [[-120, ZP0 - NZ.L - 25], [-170, 1150], [-235, 930], [-255, 835]]],
  ];
  for (const [nm, ctl] of FLOW) {
    const pts = smooth(ctl).map(([x, z]) => [x, YF, z]);
    const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[n - 4], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const h = 7.5, w = 3.6, base = [b[0] - ux * h, b[1] - uy * h];
    const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
    const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
    const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
    put(nm, pts[Math.floor(pts.length / 2)], `<path class="fa-flujo" d="${line}"/><path class="fa-flecha" d="${head}"/>`, [A.tube(pts, rf), A.ball(pts[pts.length - 1], w / G.scaleOf(P))]);
  }
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
if (process.env.FA_ITEM) {
  for (const nm of process.env.FA_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
const t0 = Date.now();
if (!FAST) A.settle(R_, PA, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");
R_.items.sort((a, b) => a.key - b.key);
const shades = (p, f, t, s0, s1, s2, s3) => `--anatomy-paper:${p};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s0};--anatomy-shade-1:${s1};--anatomy-shade-2:${s2};--anatomy-shade-3:${s3}`;
const CSS = `.fa-cut{${shades("#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3")}}
.fa-ss{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#ccd1d6", "#d5d9dd", "#dde1e4", "#e5e8ea")}}
.fa-pipe{${shades("#f1f3f4", "#f1f3f4", "#f9fafa", "#d2d6da", "#dadee1", "#e2e5e7", "#e9ebed")}}
.fa-trim{${shades("#f4f5f6", "#f4f5f6", "#fbfbfc", "#d6d9dc", "#dfe2e4", "#e7e9eb", "#eef0f1")}}
.fa-sub{${shades("#dbe5ec", "#dfe8ee", "#e1eaf0", "#bccbd5", "#c5d3dc", "#cdd9e1", "#d5e0e7")}}
.fa-noz{${shades("#e6edf2", "#e9eff3", "#eef3f6", "#c6d2da", "#cfd9e0", "#d8e1e7", "#e0e7ec")}}
.fa-cast{${shades("#e3e6e9", "#e3e6e9", "#eceef0", "#c4c9ce", "#cdd1d5", "#d5d9dc", "#dde0e3")}}
.fa-lever{${shades("#d9dde1", "#d9dde1", "#e6e9ec", "#aeb5bc", "#b8bfc5", "#c2c8ce", "#ccd1d6")}}
.fa-gauge{${shades("#d4d8dc", "#d4d8dc", "#dfe2e5", "#aab1b8", "#b4bbc1", "#bec4ca", "#c8cdd2")}}
.fa-dial{fill:#fbfbfa;stroke:none}
.fa-bore{fill:#9fadb8;stroke:none}.fa-bore-dk{fill:#6f7a84;stroke:none}.fa-hole{fill:#55616b;stroke:none}
.fa-ant-top{fill:#3d4045}.fa-ant-y0{fill:#33363a}.fa-ant-x0{fill:#292b2f}
.fa-san-y0{fill:#cdc09f}.fa-san-x0{fill:#bcae8d}
.fa-gl{fill:#fff;fill-opacity:.1}.fa-gh{fill:#fff;fill-opacity:.2}.fa-gd{fill:#000;fill-opacity:.32}
.fa-sl{fill:#fff;fill-opacity:.38}.fa-sd{fill:#5a4a2a;fill-opacity:.24}.fa-sk{fill:#3a3328;fill-opacity:.42}
.fa-mixa{fill:#34373b}.fa-mixs{fill:#c9bc9b}
.fa-medio .iso-line[data-tone="mid"]{stroke:#6c7178}.fa-medio .iso-line[data-tone="lo"]{stroke:#8f959b}
.fa-flujo{fill:none;stroke:#2f5f86;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.fa-flecha{fill:#2f5f86;stroke:none;opacity:.85}`;
const groupsSvg = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
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
const svg = k.figureSvg({ width: W, height: H, label: "Filtro a presión de doble medio en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="fa-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Filtro de arena", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
{
  const face = (r, z, d = 0) => [r * Math.cos(AZ * D2R + d), r * Math.sin(AZ * D2R + d), z];
  const hq = NOZ.filter(([x]) => x > 0).sort((a, b) => Math.hypot(a[0] - 330, a[1] + 200) - Math.hypot(b[0] - 330, b[1] + 200))[0];
  Object.assign(ANCH, {
    DISTRIBUIDOR: [-DS.r * 0.55, 0, ZD + DS.t / 2],
    ANTRACITA: [-R * 0.42, 0, (ZS + ZA) / 2 + 40], ARENA: [-R * 0.6, 0, (ZP + ZS) / 2],
    PLACA: [-R * 0.62, 0, (ZP0 + ZP) / 2], BOQUILLAS: [hq[0] + NZ.head * HV[0], hq[1] + NZ.head * HV[1], ZP + NZ.sh + NZ.body * 0.5],
    PLENO: pol(R - 1, 190, zt + 90), TAPA: face(RO, zt2 + 120, 0.2),
  });
}
writeFileSync(join(OUT, "filtro_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
