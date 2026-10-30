/* ====================================================================
   Tanque de llegada en isométrico (skill anatomy), para el capítulo 12 del libro de operaciones unitarias (Válvulas,
   tuberías y medición de flujo): el tanque elevado de agua de servicios del caso.
   Concepto: la descarga de la bomba llega por arriba a 13 m, pasa por la válvula de control y baja por el techo hasta
   1 m bajo el nivel normal; la planta toma el agua por el fondo, por gravedad, y por eso el tanque va en alto, sobre
   una estructura. El transmisor de nivel lee la columna de agua desde la toma de 9,2 m; el interruptor de muy alto
   nivel y el rebose cuidan que no se llene de más, y el respiradero deja entrar y salir el aire.
   Corte: se quita el cuarto de la envolvente, del techo y del agua que mira al lector (x > 0, y > 0, sobre el
   fondo). El fondo, la estructura, la escalera, la baranda y la tubería de afuera van enteros. Lo que queda bajo el
   nivel lleva el tinte del agua (tl-sub) y la superficie es una lámina translúcida.
   La estructura mide 9,7 m del piso al fondo: se dibuja con un corte, y lo de abajo (el piso, los pedestales, las
   placas base y el pie de la escalera y del rebose) va subido SHIFT (geo.mjs).
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
const STEP = Number(process.env.TL_STEP || 0.25);
const TL = GEO.TL, RO = GEO.RO, D2R = GEO.D2R, pol = GEO.pol;
const { R, zb, zs, zL } = TL;
const AZ = TL.AZ, EL = TL.EL;
const { zRoofU, zRoofT, RROOF, SHIFT, zDraw } = GEO;

const W = 640, H = 1040;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const PI = Math.PI, TAU = 2 * Math.PI;
const ANCH = {};                                     // los puntos a los que apuntan los rótulos del libro (libro.mjs)

/* ---------- posiciones ---------- */
const LEGS = [45, 135, 225, 315].map((d) => pol(TL.leg.r, d));
const GRADE = zDraw(TL.grade);                       // el piso, dibujado
const LT_ = TL.lad, LU = pol(1, LT_.th), LTN = [-Math.sin(LT_.th * D2R), Math.cos(LT_.th * D2R), 0];   // escalera: radial y tangente
const IN = TL.inlet, INP = pol(IN.r, IN.th);         // la boquilla de llegada en el techo
const OV = TL.over;

const EXT = [];
for (let d = 0; d < 360; d += 15) EXT.push(pol(TL.bot.r, d, zb), pol(RROOF, d, zs));
EXT.push([0, 0, zRoofT(0) + 450]);
EXT.push([IN.end - 30, INP[1], IN.z + 95], [IN.end - 30, INP[1], IN.z - 95], [TL.valve.x, INP[1], IN.z + 640]);
for (const s of [LT_.r, LT_.r + TL.cage.depth + 30]) for (const t of [-TL.cage.half - 20, TL.cage.half + 20]) for (const z of [GRADE, 13760]) EXT.push(G.add3(G.add3(G.mul3(LU, s), G.mul3(LTN, t)), [0, 0, z]));
LEGS.forEach((c) => [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => EXT.push([c[0] + a * 270, c[1] + b * 270, GRADE])));
EXT.push(pol(OV.rd + 260, OV.th, GRADE), pol(OV.rd + 60, OV.th, OV.z + 60));
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);

/* El dibujo va en milímetros; el audit, en centímetros (como el tanque agitado): sus muestras de superficie van cada
   0,6 unidades y un tanque de 3 m en milímetros no cabe en memoria. cm() pasa cada forma registrada a centímetros
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
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null, ground, cap = "auto" } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * G.scaleOf(P)) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cap, ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 300, gaps = [], cls = "", clsOf = null, caps = true, breaks = [], ends = [true, true], touch, spacing = null, owner = name } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, clsOf ? clsOf(part) : cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
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
function pipe(name, control, r, { tone = "mid", flanges = [false, false], flangeR = 1.75, flangeT = null, cls = "", maxLength = 300, balls = [], open = [false, false], dots = 8, gaps: extra = [] } = {}) {
  const line = control.map((q) => [...q]);
  for (const b of balls) {
    const i = b.at === "start" ? 0 : line.length - 1, j = b.at === "start" ? 1 : line.length - 2, dir = G.unit3(G.sub3(line[j], b.c));
    line[i] = G.add3(b.c, G.mul3(dir, entry(b.R, r)));
  }
  const total = G.pathLength(line), gaps = [...extra];
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
function saddle(name, F, a, start, h, style = {}, { owner, cls = "", extra = "", hosts = [], ref = null, ground } = {}) {
  const low = Math.min(...Array.from({ length: 72 }, (_, i) => start((i / 72) * TAU)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, ref ?? G.add3(F.o, G.mul3(F.a, (low + h) / 2)), wrap(body, cls), [record(A.disc(F, low - 0.05, h, a, { name, owner, cut: hosts, ...(ground ? { ground } : {}) }))]);
  return { F, face: G.add3(F.o, G.mul3(F.a, h)), low };
}
// dónde toca una generatriz vertical una superficie z = surf(r) (cuellos en el techo)
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
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD };     // el plano del corte θ = 0: sección (x, z), espesor a lo largo de y
const FX0 = { o: [0, 0, 0], a: XD, u: YD, v: ZD };     // el plano del corte θ = 90°: sección (y, z), espesor a lo largo de x
const F0 = FZ();
const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
const arcPts = (r, z, f0, f1, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t), z]; });
const fL = (AZ + 90) * D2R, fR = (AZ - 90) * D2R + TAU;   // las siluetas de un cilindro vertical: izquierda (152°) y derecha (332°)
const sa = Math.sin(Math.atan(TL.roof.slope)), ca = Math.cos(Math.atan(TL.roof.slope));

/* ====================================================================
   1 · las formas registradas: el corte, la envolvente, el techo, el fondo y la ventana
   ==================================================================== */
const BIGZ = 30000;
const CUTQ = A.box([0, 0, zb], [9000, 9000, BIGZ]);                 // el cuarto que se quita
const NOT_Q = [A.box([-9000, -9000, -9000], [0, 9000, BIGZ]), A.box([-9000, -9000, -9000], [9000, 0, BIGZ])];
// marcos radiales en la envolvente: a a lo largo del radio, u tangente, v vertical (el origen en el eje del tanque)
const FRAD = (deg, z) => ({ o: [0, 0, z], a: pol(1, deg), u: [-Math.sin(deg * D2R), Math.cos(deg * D2R), 0], v: ZD });
const F_MH = FRAD(TL.smh.th, TL.smh.z), F_LT = FRAD(TL.lt.th, TL.lt.z), F_OV = FRAD(TL.over.th, TL.over.z);
const RMHC = [TL.rmh.x, 0], HHC = pol(TL.hh.r, TL.hh.th), VTC = pol(TL.vent.r, TL.vent.th);
const HOLES_SHELL = [A.disc(F_MH, 0, 5000, TL.smh.ai), A.disc(F_LT, 0, 5000, 26.6), A.disc(F_OV, 0, 5000, 26.6)];
const HOLES_ROOF = [A.disc(FZ(RMHC[0], RMHC[1]), 0, BIGZ, TL.rmh.ai), A.disc(FZ(INP[0], INP[1]), 0, BIGZ, 38.95), A.disc(FZ(VTC[0], VTC[1]), 0, BIGZ, 26.6), A.disc(FZ(HHC[0], HHC[1]), 0, BIGZ, 12.1)];
// lo que queda debajo de la cara de arriba del techo: los cuellos se cortan con esto, así empiezan en el techo
const UNDER_ROOF = A.body(F0, [[zs - 60, 0], [zs - 60, RROOF], [zRoofT(RROOF), RROOF], [zRoofT(0), 0]], { name: "bajo.techo" });
// la mitad de atrás, detrás del plano del eje que mira al lector (lo que tapa la envolvente)
const BEHIND = A.orientedBox(G.mul3(HV, -20000), [HV, [HV[1], -HV[0], 0], ZD], [20000, 30000, 40000]);
const UNDER_ROOF_UP = A.body(F0, [[zs - 60, 0], [zs - 60, RROOF], [zRoofT(RROOF) + 1.2, RROOF], [zRoofT(0) + 1.2, 0]], { name: "bajo.techo+" });
const SHELL_POLY = [[zb, R], [zs, R], [zs, RO], [zb, RO]];
const ANG = TL.ang;
const ANG_POLY = [[zs - ANG.a, RO], [zs - ANG.a, RO + ANG.t], [zRoofU(RO + ANG.t) - ANG.t, RO + ANG.t], [zRoofU(RO + ANG.a) - ANG.t, RO + ANG.a], [zRoofU(RO + ANG.a), RO + ANG.a], [zs, RO]];
const ROOF_POLY = [[zRoofU(RROOF), RROOF], [zRoofT(RROOF), RROOF], [zRoofT(0), 0], [zRoofU(0), 0]];
// la ventana del corte: lo que se ve por el cuarto quitado, proyectado a lo largo de la mirada
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const WIN = [...arcPts(R, zb, 0, PI / 2, 48).map((p) => p), ...Array.from({ length: 25 }, (_, i) => { const r = R - (R * i) / 24; return [0, r, zRoofU(r)]; }), ...Array.from({ length: 25 }, (_, i) => { const r = (R * i) / 24; return [r, 0, zRoofU(r)]; })];
const WINP = A.prism(FV, WIN.map((p) => [G.dot3(p, CAM.R), G.dot3(p, CAM.D)]), -900000, 900000);
const CLIPWIN = A.box([-90000, -90000, -90000], [90000, 90000, 90000], { cut: [WINP] });
const DEFS = [];
DEFS.push(`<clipPath id="tlWin"><path d="${pth1(WIN.map(pr))}"/></clipPath>`);
const LIQ_HOLES = [];      // los pasos por la lámina del agua
const cutStore = [];        // las caras del corte: { owner, poly (u, z), cls, plane: "y" (θ = 0, u = x) o "x" (θ = 90°, u = y) }
const toPlane = (plane, u, z) => (plane === "y" ? [u, 0, z] : [0, u, z]);

/* ====================================================================
   2 · la estructura: viga anillo, columnas, puntales, diagonales; el corte; pedestales y placas base
   ==================================================================== */
const RG = TL.ring, LG = TL.leg;
{
  const ringShape = record(A.ring(F0, RG.z0, RG.z1, RG.r0, RG.r1, { name: "ring", owner: "ring" }));
  put("ring", [0, 0, (RG.z0 + RG.z1) / 2], wrap(S(G.ringBand(RG.z0, RG.z1, RG.r0, RG.r1, F0, P), { tone: "mid" }), "tl-str"), [ringShape]);
}
const ZCAP = RG.z0 - LG.capT;
LEGS.forEach((c, q) => {
  const ang = (45 + 90 * q) * D2R, ux = [Math.cos(ang), Math.sin(ang), 0], uy = [-Math.sin(ang), Math.cos(ang), 0];
  // placa de cabeza bajo la viga anillo
  fp(`leg${q}.cap`, { o: [c[0], c[1], 0], a: ZD, u: ux, v: uy }, [[-LG.cap, -LG.cap], [LG.cap, -LG.cap], [LG.cap, LG.cap], [-LG.cap, LG.cap]], ZCAP, RG.z0, { tone: "mid" }, { owner: `leg${q}`, cls: "tl-str", ground: true });
  disc(`leg${q}.up`, FZ(c[0], c[1]), TL.brk.top, ZCAP, LG.ro, { tone: "mid" }, { owner: `leg${q}`, cls: "tl-str", ground: true });
});
// las caras de la estructura: puntal, cartelas y diagonales
const FACES = [];
for (let i = 0; i < 4; i++) {
  const A0 = LEGS[i], B0 = LEGS[(i + 1) % 4], d = G.unit3(G.sub3(B0, A0)), n = [d[1], -d[0], 0], L = Math.hypot(B0[0] - A0[0], B0[1] - A0[1]);
  FACES.push({ A0, B0, d, n, L, i });
  const BR = TL.brace, ST = TL.strut;
  // asientos del puntal en las dos columnas y el puntal de 3 in
  const padH = LG.ro + 18;
  [[A0, d, i, "a"], [B0, G.mul3(d, -1), (i + 1) % 4, "b"]].forEach(([c, dir, q, tag]) => {
    const F = { o: [c[0], c[1], ST.z], a: dir, u: [dir[1], -dir[0], 0], v: ZD };
    saddle(`strut${i}.pad${tag}`, F, ST.ro + 6, (t) => G.saddleStart(LG.ro, ST.ro + 6, t), padH, { tone: "mid" }, { owner: `leg${q}`, cls: "tl-str", hosts: [A.disc(FZ(c[0], c[1]), 0, BIGZ, LG.ro)] });
  });
  tubeItems(`strut${i}`, [G.add3([A0[0], A0[1], ST.z], G.mul3(d, padH)), G.add3([B0[0], B0[1], ST.z], G.mul3(d, -padH))], ST.ro, { tone: "mid", cls: "tl-str", maxLength: 700 });
  // cartelas: placas en el plano de la cara, soldadas a la columna
  const gus = (q, c, dir, tag, z0, z1) => {
    const F = { o: [c[0], c[1], 0], a: [dir[1], -dir[0], 0], u: dir, v: ZD };
    const hg = Math.sqrt(LG.ro * LG.ro - (BR.gus / 2) ** 2) - 0.05;
    fp(`gus${i}.${tag}`, F, [[hg, z0], [260, z0], [260, z1], [hg, z1]], -BR.gus / 2, BR.gus / 2, { tone: "mid" }, { owner: `leg${q}`, cls: "tl-str" });
  };
  gus(i, A0, d, "at", 8470, ZCAP); gus((i + 1) % 4, B0, G.mul3(d, -1), "bt", 8470, ZCAP);
  gus(i, A0, d, "ab", ST.z + 70, ST.z + 300); gus((i + 1) % 4, B0, G.mul3(d, -1), "bb", ST.z + 70, ST.z + 300);
  // las diagonales: platinas de 60 × 8, una por fuera de las cartelas y otra por dentro, y se cruzan sin tocarse
  const zT = 8600, zB = ST.z + 185, h0 = 185;
  [[h0, zT, L - h0, zB, [BR.gus / 2, BR.gus / 2 + BR.t]], [L - h0, zT, h0, zB, [-BR.gus / 2 - BR.t, -BR.gus / 2]]].forEach(([ha, za, hb, zbb, [n0, n1]], j) => {
    const pa = G.add3([A0[0], A0[1], za], G.mul3(d, ha)), pb = G.add3([A0[0], A0[1], zbb], G.mul3(d, hb));
    const e = G.unit3(G.sub3(pb, pa)), w = G.unit3(G.cross3(e, n)), len = G.len3(G.sub3(pb, pa));
    const F = { o: pa, a: e, u: n, v: w };
    const bolts = [[22, 0], [len - 22, 0], [62, 0], [len - 62, 0]].map(([s]) => at(G.add3(G.add3(pa, G.mul3(e, s)), G.mul3(n, n1 > 0 ? n1 : n0))));
    fp(`brace${i}.${j}`, F, [[n0, -BR.w / 2], [n1, -BR.w / 2], [n1, BR.w / 2], [n0, BR.w / 2]], -40, len + 40, { tone: "mid" }, { owner: `brace${i}`, cls: "tl-str", extra: j === 0 ? Dots(bolts, { size: 0.5 }) : "" });
  });
}
// lo de abajo del corte: pedestales de concreto, placas base, pernos de anclaje y los tramos de columna
const PI_ = TL.pier, BA = TL.base, ZP1 = GRADE + PI_.h;
LEGS.forEach((c, q) => {
  box(`stand.pier${q}`, [c[0] - PI_.a, c[1] - PI_.a, GRADE], [c[0] + PI_.a, c[1] + PI_.a, ZP1], { tone: "mid" }, { r: 6, steps: 3, bevel: 0.8, cls: "tl-conc" });
  box(`leg${q}.base`, [c[0] - BA.a, c[1] - BA.a, ZP1], [c[0] + BA.a, c[1] + BA.a, ZP1 + BA.t], { tone: "mid" }, { r: 4, steps: 3, bevel: 0.6, cls: "tl-str", owner: `leg${q}.lo` });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], j) => fp(`leg${q}.anchor${j}`, FZ(c[0] + a * 112, c[1] + b * 112), HEX(17), ZP1 + BA.t, ZP1 + BA.t + 16, { tone: "mid" }, { owner: `leg${q}.lo`, cls: "tl-str" }));
  // el tramo de abajo termina en el corte: se ve su sección (tubo de 7,1 mm de pared) y el hueco
  const zt = zDraw(TL.brk.bot), ri = LG.ro - 7.1;
  const ringD = pth1(arcPts(LG.ro, zt, 0, TAU, 48).slice(0, -1).map((p) => pr([p[0] + c[0], p[1] + c[1], p[2]])));
  const holeD = pth1(arcPts(ri, zt, 0, TAU, 48).slice(0, -1).map((p) => pr([p[0] + c[0], p[1] + c[1], p[2]])));
  const top = `<g class="iso-solid tl-cut"><path class="iso-fill" d="${ringD}"/><path class="iso-shade" data-shade="3" d="${ringD}"/></g><path class="tl-bore" d="${holeD}"/>` + Ln(path3(arcPts(LG.ro, zt, 0, TAU, 72).map((p) => [p[0] + c[0], p[1] + c[1], p[2]]), true) + path3(arcPts(ri, zt, 0, TAU, 72).map((p) => [p[0] + c[0], p[1] + c[1], p[2]]), true), { tone: "mid" });
  disc(`leg${q}.lo`, FZ(c[0], c[1]), ZP1 + BA.t, zt, LG.ro, { tone: "mid" }, { owner: `leg${q}.lo`, cls: "tl-str", cap: "none", extra: top });
});

/* ====================================================================
   3 · el fondo, la envolvente por dentro y por fuera, el ángulo de coronamiento y el techo
   ==================================================================== */
{
  // el fondo, entero: la cara de arriba seca por fuera, la de adentro (bajo el agua) vista por la ventana, el canto
  const BT = TL.bot;
  const topAll = pth1(arcPts(BT.r, zb, 0, TAU, 120).slice(0, -1).map(pr));
  const inner = pth1(arcPts(R, zb, 0, TAU, 120).slice(0, -1).map(pr));
  const rim = toned((o) => surface(cylP(BT.r, zb - BT.t, zb), cylN(1), 0, TAU, 120, 1, o), "tl-ss");
  const seams = Ln([-520, 520].map((x) => { const y = Math.sqrt(R * R - x * x); return path3([[x, -y, zb], [x, y, zb]]); }).join(""), { tone: "faint" });
  const svg = rim + `<g class="iso-solid tl-ss"><path class="iso-fill" d="${topAll}"/><path class="iso-top" d="${topAll}"/></g>` +
    `<g clip-path="url(#tlWin)"><g class="iso-solid tl-sub"><path class="iso-top" d="${inner}"/></g>${seams}</g>` +
    Ln(path3(arcPts(BT.r, zb, fR - TAU, fL, 96)) + path3(arcPts(BT.r, zb - BT.t, fR - TAU, fL, 96)), { tone: "mid" });
  put("fondo", [0, 0, zb - 4], svg, [record(A.disc(F0, zb - BT.t, zb, BT.r, { name: "fondo", owner: "fondo" }))]);
}
{
  // la envolvente por dentro, vista por la ventana: bajo el nivel con el tinte del agua; costuras
  const SH = A.body(F0, SHELL_POLY, { name: "shell", owner: "shell", cut: [CUTQ, ...HOLES_SHELL] });
  const sub = toned((o) => surface(cylP(R, zb, zL), cylN(-1), PI / 2, TAU, 140, 1, o), "tl-sub");
  const dry = toned((o) => surface(cylP(R, zL, zs), cylN(-1), PI / 2, TAU, 140, 1, o), "tl-ss");
  const seams = [path3(arcPts(R - 0.5, TL.girth, PI / 2, TAU, 120))];
  TL.vseams.forEach(([z0, z1, list]) => list.forEach((d) => { const t = d * D2R; if (G.dot3([-Math.cos(t), -Math.sin(t), 0], V3) > 0.05 && (d < 0 || d > 90)) seams.push(path3([[R * Math.cos(t), R * Math.sin(t), z0], [R * Math.cos(t), R * Math.sin(t), z1]])); }));
  const weld = Ln(path3(arcPts(R - 0.5, zb, PI / 2, TAU, 120)), { tone: "lo" });
  put("shell.in", [0, -R * 0.7, (zb + zs) / 2], `<g clip-path="url(#tlWin)">${sub}${dry}${Ln(seams.join(""), { tone: "faint" })}${weld}</g>`, [record({ ...SH, name: "shell.in", cut: [CUTQ, ...HOLES_SHELL, CLIPWIN] })]);
  // por fuera: la banda de la izquierda (de 90° a la silueta) y la de la derecha (de la silueta a 0°)
  [["L", PI / 2, PI, [CUTQ, WINP, A.box([0, -9000, -9000], [9000, 9000, BIGZ]), A.box([-9000, -9000, -9000], [9000, 0, BIGZ])]],
   ["R", 1.5 * PI, TAU, [CUTQ, WINP, A.box([-9000, -9000, -9000], [0, 9000, BIGZ]), A.box([-9000, 0, -9000], [9000, 9000, BIGZ])]]].forEach(([tag, f0, f1, cuts]) => {
    const svg = toned((o) => surface(cylP(RO, zb, zs - ANG.a), cylN(1), f0, f1, 60, 1, o), "tl-ss");
    const fs = tag === "L" ? fL : fR, lines = [];
    lines.push(path3([[RO * Math.cos(fs), RO * Math.sin(fs), zb], [RO * Math.cos(fs), RO * Math.sin(fs), zs - ANG.a]]));
    const a0 = tag === "L" ? PI / 2 : fR, a1 = tag === "L" ? fL : TAU;
    const seam = Ln(path3(arcPts(RO + 0.3, TL.girth, a0, a1, 40)) + TL.vseams.map(([z0, z1, list]) => list.map((d) => { const t = ((d + 360) % 360) * D2R; return t > a0 + 0.02 && t < a1 - 0.02 ? path3([[RO * Math.cos(t), RO * Math.sin(t), z0], [RO * Math.cos(t), RO * Math.sin(t), z1]]) : ""; }).join("")).join(""), { tone: "faint" });
    put(`shell.out${tag}`, G.add3(pol(RO * 0.9, (tag === "L" ? 120 : -15)), [0, 0, (zb + zs) / 2]), svg + seam + Ln(lines.join("") + path3(arcPts(RO, zb, a0, a1, 40)), { tone: "mid" }), [record({ ...SH, name: `shell.out${tag}`, cut: [...cuts, ...HOLES_SHELL] })]);
  });
}
{
  // el ángulo de coronamiento, por fuera (lo de arriba lo tapa el techo): una pieza a cada lado del corte, como la
  // envolvente, así cada una va delante de su banda
  const zh = zRoofU(RO + ANG.t) - ANG.t;
  [["L", PI / 2, PI, fL, [A.box([0, -9000, -9000], [9000, 9000, BIGZ]), A.box([-9000, -9000, -9000], [9000, 0, BIGZ])], 120],
   ["R", 1.5 * PI, TAU, fR, [A.box([-9000, -9000, -9000], [0, 9000, BIGZ]), A.box([-9000, 0, -9000], [9000, 9000, BIGZ])], -15]].forEach(([tag, f0, f1, fs, cuts, mid]) => {
    const AN = A.body(F0, ANG_POLY, { name: `ang${tag}`, owner: "shell", cut: [CUTQ, WINP, BEHIND, ...cuts] });
    const svg = toned((o) => {
      surface(cylP(RO + ANG.t, zs - ANG.a, zh), cylN(1), f0, f1, 60, 1, o);
      surface(cylP(RO + ANG.a, zRoofU(RO + ANG.a) - ANG.t, zRoofU(RO + ANG.a)), cylN(1), f0, f1, 60, 1, o);
    }, "tl-ss");
    const a0 = tag === "L" ? PI / 2 : fR, a1 = tag === "L" ? fL : TAU;
    const lines = path3(arcPts(RO + ANG.t, zs - ANG.a, a0, a1, 40)) + path3([[(RO + ANG.t) * Math.cos(fs), (RO + ANG.t) * Math.sin(fs), zs - ANG.a], [(RO + ANG.t) * Math.cos(fs), (RO + ANG.t) * Math.sin(fs), zh]]);
    put(`ang${tag}`, pol(RO + 30, mid, zs - 30), svg + Ln(lines, { tone: "mid" }), [record(AN)]);
  });
}
{
  // el techo de cono: la cara de arriba (tres cuartos), el canto del alero, las costuras de las placas
  const RF = A.body(F0, ROOF_POLY, { name: "roof", owner: "roof", cut: [CUTQ, ...HOLES_ROOF] });
  const coneP = (f, u) => { const r = RROOF * (1 - u); return [r * Math.cos(f), r * Math.sin(f), zRoofT(r)]; };
  const coneN = (f) => [sa * Math.cos(f), sa * Math.sin(f), ca];
  const svg = toned((o) => {
    surface(coneP, coneN, PI / 2, TAU, 140, 1, o);
    surface(cylP(RROOF, zRoofU(RROOF), zRoofT(RROOF)), cylN(1), PI / 2, TAU, 140, 1, o);
  }, "tl-ss");
  const seams = [120, 180, 240, 300].map((d) => path3([pol(340, d, zRoofT(340)), pol(RROOF - 0.3, d, zRoofT(RROOF - 0.3))])).join("") + path3(arcPts(340, zRoofT(340), PI / 2, TAU, 60).map((p) => p));
  const rimL = path3(arcPts(RROOF, zRoofT(RROOF), PI / 2, TAU, 140)) + path3(arcPts(RROOF, zRoofU(RROOF), fR - TAU, PI / 2, 60)) + path3(arcPts(RROOF, zRoofU(RROOF), PI / 2, fL, 30));
  put("roof", [0, -RROOF * 0.4, zRoofT(RROOF * 0.4)], svg + Ln(seams, { tone: "faint" }) + Ln(rimL, { tone: "mid" }), [record({ ...RF, cut: [CUTQ, ...HOLES_ROOF, WINP] })]);
}
/* las caras del corte de la envolvente, el ángulo y el techo, en los dos planos */
{
  const shellSec = [[R, zb], [RO, zb], [RO, zs], [R, zs]];
  const angSec = ANG_POLY.map(([z, r]) => [r, z]);
  const roofSec = [[0, zRoofU(0)], [RROOF, zRoofU(RROOF)], [RROOF, zRoofT(RROOF)], [0, zRoofT(0)]];
  const roofPart = (r0, r1) => [[r0, zRoofU(r0)], [r1, zRoofU(r1)], [r1, zRoofT(r1)], [r0, zRoofT(r0)]];
  for (const plane of ["y", "x"]) {
    cutStore.push({ owner: "shell", poly: shellSec, cls: "tl-cut", plane }, { owner: "shell", poly: angSec, cls: "tl-cut", plane });
    if (plane === "x") cutStore.push({ owner: "roof", poly: roofSec, cls: "tl-cut", plane });
    else cutStore.push({ owner: "roof", poly: roofPart(0, TL.rmh.x - TL.rmh.ai), cls: "tl-cut", plane }, { owner: "roof", poly: roofPart(TL.rmh.x + TL.rmh.ai, RROOF), cls: "tl-cut", plane });
  }
}

/* ====================================================================
   4 · la superficie del agua: lámina translúcida en los tres cuartos que quedan
   ==================================================================== */
function liquid() {
  const poly = [...arcPts(R, zL, PI / 2, TAU, 120).map(([x, y]) => [x, y]), [0, 0]];
  const d = pth1(poly.map(([x, y]) => pr([x, y, zL])));
  const svg = `<g clip-path="url(#tlWin)"><path class="tl-liq" d="${d}"/>` + Ln(path3(arcPts(R - 0.5, zL, PI / 2, TAU, 120)), { tone: "mid" }) + Ln(path3([[0, R, zL], [0, 0, zL], [R, 0, zL]]), { tone: "lo" }) + "</g>";
  put("liq", [0, -R * 0.5, zL], svg, [record(A.prism(F0, poly, zL - 1, zL, { name: "liq", owner: "liq", cut: [...LIQ_HOLES, CLIPWIN] }))]);
}

/* ====================================================================
   5 · la llegada: boquilla del techo, codo, carrete, válvula de control con su actuador y el tubo que baja adentro
   ==================================================================== */
const INX = INP[0], INY = INP[1], VX = TL.valve.x;
const FIN = { o: [0, INY, IN.z], a: XD, u: YD, v: ZD };      // el eje del tramo alto, a lo largo de x
const ZNF = 12850, FT3 = 24, RF3 = 95.25;                    // la boquilla de 3 in y su brida
{
  const zr = zRoofT(IN.r), F = FZ(INX, INY, 0), FF = FZ(INX, INY);
  saddle("in.neck", F, 44.45, vStart(F, 44.45, zRoofT), ZNF, { tone: "mid" }, { owner: "in.nz", cls: "tl-ss", hosts: [UNDER_ROOF, A.disc(FF, 0, BIGZ, 38.95)], ref: [INX, INY, (zr + ZNF) / 2] });
  disc("in.fl0", FF, ZNF, ZNF + FT3, RF3, { tone: "mid" }, { owner: "in.nz", cls: "tl-ss", cut: [A.disc(FF, 0, BIGZ, 38.95)] });
  disc("in.fl1", FF, ZNF + FT3, ZNF + 2 * FT3, RF3, { tone: "mid" }, { owner: "in.nz", cls: "tl-pipe", extra: Dots(G.dotsOf(FF, ZNF + 2 * FT3, 76.2, 4, P, { all: true, phase: Math.PI / 4 }), { size: 0.55 }) });
  // el codo de la bajada y el carrete recto hasta la válvula (sale de la brida reductora)
  const route = G.fillet([[INX, INY, ZNF + 2 * FT3], [INX, INY, IN.z], [VX + 235, INY, IN.z]], 95.25, 9, { P, tube: IN.ro });
  tubeItems("in.down", route, IN.ro, { tone: "mid", cls: "tl-pipe", maxLength: 260 });
  // el tubo que baja adentro hasta 1 m bajo el nivel normal; desde el nivel hacia abajo lleva el tinte del agua
  // (adentro de la boquilla no se ve: el tubo se dibuja desde un collar soldado bajo el techo, que lo guía)
  const zcol = zRoofU(IN.r + 62);
  disc("in.collar", FF, zcol - 12, zcol, 62, { tone: "mid" }, { owner: "in.nz", cls: "tl-ss" });
  const top = zcol - 12;
  tubeItems("in.dip", [[INX, INY, top], [INX, INY, IN.dip]], IN.ro, { tone: "mid", maxLength: 400, breaks: [top - zL], ends: [true, false], touch: ["roof", "liq", "in.neck", "in.fl0"], clsOf: (part) => (part.mid[2] < zL ? "tl-sub" : "tl-pipe") });
  LIQ_HOLES.push(A.disc(FF, zL - 10, zL + 10, IN.ro + 6));
  ANCH.ENTREGA = [INX + IN.ro * HV[0], INY + IN.ro * HV[1], IN.dip + 40];
  ANCH.LLEGADA = [IN.end + 260, INY + IN.ro * 0.4, IN.z + IN.ro * 0.8];
}
{
  // la válvula de control de globo de 2 in: reductores de 2½ a 2 in, bridas, el cuerpo, el bonete, la arcada y el actuador
  const own = "cv";
  [[1, "a"], [-1, "b"]].forEach(([sg, tag]) => {
    const x0 = VX + sg * 146, x1 = VX + sg * 235;
    turned(`cv.red.${tag}`, FIN, sg > 0 ? [[x0, 30.15], [x1, IN.ro]] : [[x1, IN.ro], [x0, 30.15]], { tone: "mid" }, { owner: own, cls: "tl-pipe" });
    disc(`cv.wn.${tag}`, FIN, VX + sg * 127, VX + sg * 146, 76.2, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
    disc(`cv.fl.${tag}`, FIN, VX + sg * 108, VX + sg * 127, 76.2, { tone: "mid" }, { owner: own, cls: "tl-cast", extra: Dots(G.dotsOf(FIN, VX + sg * 127, 60.3, 4, P, { least: 0.05, fade: [0.04, 0.42], phase: Math.PI / 4 }), { size: 0.5 }) });
    disc(`cv.neck.${tag}`, FIN, VX + sg * entry(80, 41), VX + sg * 108, 41, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  });
  const c = [VX, INY, IN.z];
  ball("cv.body", c, 80, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  const FV_ = FZ(VX, INY), zc = IN.z;
  disc("cv.boss", FV_, zc + entry(80, 50), zc + 112, 50, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  disc("cv.bon.fl", FV_, zc + 112, zc + 128, 62, { tone: "mid" }, { owner: own, cls: "tl-cast", extra: Dots(G.dotsOf(FV_, zc + 128, 50, 6, P, { all: true }), { size: 0.5 }) });
  disc("cv.bon", FV_, zc + 128, zc + 232, 30, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  disc("cv.yk.ring", FV_, zc + 232, zc + 252, 52, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  [-1, 1].forEach((sg, j) => box(`cv.yk.leg${j}`, [VX + (sg < 0 ? -52 : 40), INY - 15, zc + 252], [VX + (sg < 0 ? -40 : 52), INY + 15, zc + 420], { tone: "mid" }, { r: 2, steps: 3, bevel: 0.6, owner: own, cls: "tl-cast" }));
  disc("cv.stem", FV_, zc + 252, zc + 420, 6.35, { tone: "hi" }, { owner: own, cls: "tl-pipe" });
  disc("cv.yk.top", FV_, zc + 420, zc + 435, 74, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  // la caja del diafragma: dos casquetes analíticos y la brida con sus pernos
  const z0 = zc + 435, zf = z0 + 50, RA = 140;
  const lowR = (s) => RA * Math.sqrt(Math.max(0, 1 - ((zf - s) / 46) ** 2)), lowS = (s) => (RA * (zf - s)) / (46 * 46 * Math.max(1e-6, Math.sqrt(Math.max(1e-9, 1 - ((zf - s) / 46) ** 2))));
  const sLow = zf - 46 * Math.sqrt(1 - (46 / RA) ** 2);
  disc("cv.act.hub", FV_, z0, sLow, 46, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  const lowProf = Array.from({ length: 14 }, (_, i) => { const s = sLow + ((zf - 3 - sLow) * i) / 13; return [s, lowR(s), i > 0 && i < 13 ? 1 : 0]; });
  turned("cv.act.lo", FV_, lowProf, { tone: "mid" }, { owner: own, cls: "tl-ss", smooth: { slope: lowS } });
  disc("cv.act.fl", FV_, zf - 3, zf + 5, 148, { tone: "mid" }, { owner: own, cls: "tl-ss", extra: Dots(G.dotsOf(FV_, zf + 5, 143, 16, P, { least: 0.05, fade: [0.04, 0.42] }), { size: 0.55 }) });
  const zu = zf + 5, HU = 72, upR = (s) => RA * Math.sqrt(Math.max(0, 1 - ((s - zu) / HU) ** 2)), upS = (s) => (-RA * (s - zu)) / (HU * HU * Math.max(1e-6, Math.sqrt(Math.max(1e-9, 1 - ((s - zu) / HU) ** 2))));
  const sTop = zu + HU * Math.sqrt(1 - (44 / RA) ** 2);
  const upProf = Array.from({ length: 16 }, (_, i) => { const s = zu + ((sTop - zu) * i) / 15; return [s, upR(s), i > 0 && i < 15 ? 1 : 0]; });
  turned("cv.act.up", FV_, upProf, { tone: "mid" }, { owner: own, cls: "tl-ss", smooth: { slope: upS } });
  disc("cv.act.vent", FV_, sTop, sTop + 14, 12, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
  ANCH.VALVULA = G.pointOf(FV_, zf + 30, upR(zf + 30) * 0.98, (AZ - 75) * D2R);
  // el tramo alto que viene de la bomba, con su brida al borde del dibujo
  pipe("in.up", [[VX - 235, INY, IN.z], [IN.end, INY, IN.z]], IN.ro, { flanges: [false, true], flangeR: 88.9 / IN.ro, flangeT: 22, open: [false, true], cls: "tl-pipe", dots: 4 });
}

/* ====================================================================
   6 · en el techo: respiradero de cuello de ganso, boca de inspección (partida por el corte), interruptor de muy alto
       nivel y la baranda junto a la escalera
   ==================================================================== */
{
  // el respiradero de 2 in: cuello, bridas, el cuello de ganso con dos codos y la malla en la boca, que mira abajo
  const F = FZ(VTC[0], VTC[1], 0), FF = FZ(VTC[0], VTC[1]), zr = zRoofT(TL.vent.r), z1 = zr + 95;
  saddle("vent.neck", F, 30.15, vStart(F, 30.15, zRoofT), z1, { tone: "mid" }, { owner: "vent", cls: "tl-ss", hosts: [UNDER_ROOF, A.disc(FF, 0, BIGZ, 26.6)], ref: [VTC[0], VTC[1], (zr + z1) / 2] });
  disc("vent.fl0", FF, z1, z1 + 19, 76.2, { tone: "mid" }, { owner: "vent", cls: "tl-ss" });
  disc("vent.fl1", FF, z1 + 19, z1 + 38, 76.2, { tone: "mid" }, { owner: "vent", cls: "tl-pipe", extra: Dots(G.dotsOf(FF, z1 + 38, 60.3, 4, P, { all: true, phase: Math.PI / 4 }), { size: 0.5 }) });
  const dv = [-Math.sin(AZ * D2R), Math.cos(AZ * D2R), 0];   // hacia la izquierda de la pantalla
  const b = [VTC[0], VTC[1], z1 + 38], zt = z1 + 38 + 330, m = G.add3([VTC[0], VTC[1], 0], G.mul3(dv, 250)), zm = zt - 210;
  const route = G.fillet([b, [b[0], b[1], zt], [m[0], m[1], zt], [m[0], m[1], zm + 45]], 76, 9, { P, tube: 30.15 });
  tubeItems("vent.pipe", route, 30.15, { tone: "mid", cls: "tl-pipe", maxLength: 200 });
  // la malla: un manguito de 45 mm con la tela de alambre por fuera, abierto hacia abajo
  const FM = FZ(m[0], m[1]);
  const mesh = G.ribsOf(FM, zm, zm + 45, 35, 40, P, { least: 0.05, seams: true });
  const rings = [zm + 11, zm + 22, zm + 33].map((z) => G.arcOf(FM, z, 35, P)).join("");
  disc("vent.screen", FM, zm, zm + 45, 35, { tone: "mid" }, { owner: "vent", cls: "tl-pipe", extra: `<path class="tl-mesh" d="${mesh}${rings}"/>` });
  ANCH.RESPIRADERO = [m[0] + 35 * dv[0], m[1] + 35 * dv[1], zm + 20];
}
{
  // la boca de inspección del techo, de 24 in, partida por el plano del corte (queda la mitad de y < 0): el cuello
  // por dentro y por fuera, la brida, la tapa con sus pernos, la manija y la bisagra
  const MH = TL.rmh, cx = MH.x, F = FZ(cx, 0), own = "rmh";
  const zr = (f, a) => zRoofT(Math.hypot(cx + a * Math.cos(f), a * Math.sin(f)));
  const zru = (f, a) => zRoofU(Math.hypot(cx + a * Math.cos(f), a * Math.sin(f)));
  const outer = toned((o) => surface((f, u) => [cx + MH.a * Math.cos(f), MH.a * Math.sin(f), zr(f, MH.a) + (MH.top - zr(f, MH.a)) * u], (f) => [Math.cos(f), Math.sin(f), 0], PI, TAU, 40, 1, o), "tl-ss");
  const inner = toned((o) => surface((f, u) => [cx + MH.ai * Math.cos(f), MH.ai * Math.sin(f), zru(f, MH.ai) + (MH.top - zru(f, MH.ai)) * u], (f) => [-Math.cos(f), -Math.sin(f), 0], PI, TAU, 60, 1, o), "tl-ss");
  const hole = pth1([...Array.from({ length: 41 }, (_, i) => { const f = PI + (PI * i) / 40; return [cx + MH.ai * Math.cos(f), MH.ai * Math.sin(f), zr(f, MH.ai)]; })].map(pr));
  const fs = fR;
  const lines = Ln(path3([[cx + MH.a * Math.cos(fs), MH.a * Math.sin(fs), zr(fs, MH.a)], [cx + MH.a * Math.cos(fs), MH.a * Math.sin(fs), MH.top]]) +
    path3(Array.from({ length: 25 }, (_, i) => { const f = fs + ((TAU - fs) * i) / 24; return [cx + MH.a * Math.cos(f), MH.a * Math.sin(f), zr(f, MH.a)]; })) +
    path3(Array.from({ length: 41 }, (_, i) => { const f = PI + (PI * i) / 40; return [cx + MH.ai * Math.cos(f), MH.ai * Math.sin(f), zru(f, MH.ai)]; })), { tone: "mid" });
  put("rmh.neck", [cx, -MH.a * 0.6, (zr(1.5 * PI, MH.a) + MH.top) / 2], `<path class="tl-bore" d="${hole}"/>${inner}${outer}${lines}`,
    [record(A.disc(F, zs + 30, MH.top, MH.a, { name: "rmh.neck", owner: own, cut: [CUTQ, UNDER_ROOF_UP, A.disc(F, 0, BIGZ, MH.ai)] }))]);
  const half = (r0, r1) => GEO.halfRing(r0, r1, 40);
  fp("rmh.fl", F, half(MH.ai, 406), MH.top, MH.top + 30, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  const bolts = Array.from({ length: 10 }, (_, i) => { const t = PI + (PI * (i + 0.5)) / 10; return at([cx + 368 * Math.cos(t), 368 * Math.sin(t), MH.top + 55]); });
  fp("rmh.cover", F, half(0, 406), MH.top + 30, MH.top + 55, { tone: "mid" }, { owner: own, cls: "tl-ss", extra: Dots(bolts, { size: 0.75 }) });
  // la manija de la tapa
  const zc = MH.top + 55, h0 = [cx - 90, -170, zc], h1 = [cx + 90, -170, zc];
  tubeItems("rmh.handle", G.fillet([h0, [h0[0], h0[1], zc + 70], [h1[0], h1[1], zc + 70], h1], 30, 8, { P, tube: 10 }), 10, { tone: "mid", cls: "tl-pipe", maxLength: 120 });
  // la bisagra, del lado de −y: dos orejas en la brida, una en la tapa y el pasador
  const yh = -446, FH = { o: [0, yh, MH.top + 30], a: XD, u: YD, v: ZD };
  [[-70, -40, MH.top + 8, MH.top + 30, "f0"], [40, 70, MH.top + 8, MH.top + 30, "f1"], [-36, 36, MH.top + 30, MH.top + 52, "c"]].forEach(([x0, x1, z0, z1, tag]) =>
    fp(`rmh.lug.${tag}`, FZ(cx, 0), [[x0, -400], [x1, -400], [x1, yh + 4], [x0, yh + 4]], z0, z1, { tone: "mid" }, { owner: own, cls: "tl-ss" }));
  disc("rmh.pin", FH, cx - 78, cx + 78, 11, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
  // las caras del corte en y = 0: las paredes del cuello, la brida y la tapa
  const zl = zRoofT(cx - MH.a), zrr = zRoofT(cx + MH.a);
  cutStore.push({ owner: own, poly: [[cx - MH.a, zRoofU(cx - MH.a)], [cx - MH.ai, zRoofU(cx - MH.ai)], [cx - MH.ai, MH.top], [cx - MH.a, MH.top]], cls: "tl-cut", plane: "y" });
  cutStore.push({ owner: own, poly: [[cx + MH.ai, zRoofU(cx + MH.ai)], [cx + MH.a, zRoofU(cx + MH.a)], [cx + MH.a, MH.top], [cx + MH.ai, MH.top]], cls: "tl-cut", plane: "y" });
  cutStore.push({ owner: own, poly: [[cx - 406, MH.top], [cx - MH.ai, MH.top], [cx - MH.ai, MH.top + 30], [cx - 406, MH.top + 30]], cls: "tl-cut", plane: "y" });
  cutStore.push({ owner: own, poly: [[cx + MH.ai, MH.top], [cx + 406, MH.top], [cx + 406, MH.top + 30], [cx + MH.ai, MH.top + 30]], cls: "tl-cut", plane: "y" });
  cutStore.push({ owner: own, poly: [[cx - 406, MH.top + 30], [cx + 406, MH.top + 30], [cx + 406, MH.top + 55], [cx - 406, MH.top + 55]], cls: "tl-cut", plane: "y" });
  void zl; void zrr;
  ANCH.BOCA_TECHO = [cx + 406 * Math.cos(1.62 * PI), 406 * Math.sin(1.62 * PI), MH.top + 40];
}
{
  // el interruptor de muy alto nivel, de horquilla vibrante: boquilla de 2 in en el techo, la caja y, adentro, la
  // extensión y la horquilla a 12,25 m, entre el nivel normal y el rebose
  const F = FZ(HHC[0], HHC[1], 0), FF = FZ(HHC[0], HHC[1]), zr = zRoofT(TL.hh.r), z1 = zr + 110;
  saddle("hh.neck", F, 30.15, vStart(F, 30.15, zRoofT), z1, { tone: "mid" }, { owner: "hh", cls: "tl-ss", hosts: [UNDER_ROOF, A.disc(FF, 0, BIGZ, 26.6)], ref: [HHC[0], HHC[1], (zr + z1) / 2] });
  disc("hh.fl0", FF, z1, z1 + 19, 76.2, { tone: "mid" }, { owner: "hh", cls: "tl-ss" });
  disc("hh.fl1", FF, z1 + 19, z1 + 38, 76.2, { tone: "mid" }, { owner: "hh", cls: "tl-pipe", extra: Dots(G.dotsOf(FF, z1 + 38, 60.3, 4, P, { all: true, phase: Math.PI / 4 }), { size: 0.5 }) });
  disc("hh.neck2", FF, z1 + 38, z1 + 92, 24, { tone: "mid" }, { owner: "hh", cls: "tl-pipe" });
  const zh = z1 + 92, HR = 54, HHH = 104;
  disc("hh.head", FF, zh, zh + HHH - 16, HR, { tone: "mid" }, { owner: "hh", cls: "tl-yel" });
  disc("hh.cap", FF, zh + HHH - 16, zh + HHH, HR - 5, { tone: "mid" }, { owner: "hh", cls: "tl-yel" });
  const gd = G.unit3([HV[1], -HV[0], 0]);
  const FG = { o: [HHC[0], HHC[1], zh + 50], a: gd, u: G.unit3(G.cross3(ZD, gd)), v: ZD };
  disc("hh.gland", FG, Math.sqrt(HR * HR - 100), HR + 20, 10, { tone: "mid" }, { owner: "hh", cls: "tl-pipe" });
  fp("hh.gnut", FG, HEX(12), HR + 20, HR + 30, { tone: "mid" }, { owner: "hh", cls: "tl-pipe" });
  // adentro: la extensión y la horquilla
  const zf = TL.hh.z;
  disc("hh.ext", FF, zf + 70, zRoofT(TL.hh.r + 12), 12, { tone: "mid" }, { owner: "hh", cls: "tl-pipe" });
  disc("hh.fork.body", FF, zf + 50, zf + 70, 17, { tone: "mid" }, { owner: "hh", cls: "tl-pipe" });
  const tu = G.unit3([HV[1], -HV[0], 0]), tv = [-tu[1], tu[0], 0];
  [-1, 1].forEach((sg, j) => fp(`hh.tine${j}`, { o: [HHC[0], HHC[1], 0], a: ZD, u: tu, v: tv }, [[-14, sg * 6 - 3], [14, sg * 6 - 3], [14, sg * 6 + 3], [-14, sg * 6 + 3]], zf - 60, zf + 50, { tone: "mid" }, { owner: "hh", cls: "tl-pipe" }));
  ANCH.HH = [HHC[0] + HR * HV[0], HHC[1] + HR * HV[1], zh + 60];
  ANCH.HH_IN = [HHC[0], HHC[1], zf];
}
{
  // la baranda del techo junto a la escalera: tres postes con su remate y dos pasamanos, en uniones de bola
  const RL = TL.rail, angs = [RL.th0, (RL.th0 + RL.th1) / 2, RL.th1];
  const top = [], mid = [];
  angs.forEach((d, q) => {
    const c = pol(RL.r, d), zr = zRoofT(RL.r), F = FZ(c[0], c[1], 0), zt = zr + RL.h, zm = zr + RL.h / 2;
    const pad = saddle(`rail.pad${q}`, F, 34, vStart(F, 34, zRoofT), zr + 14, { tone: "mid" }, { owner: "rail", cls: "tl-yel", hosts: [UNDER_ROOF], ref: [c[0], c[1], zr + 7] });
    void pad;
    disc(`rail.post${q}.lo`, FZ(c[0], c[1]), zr + 14, zm - entry(30, RL.ro), RL.ro, { tone: "mid" }, { owner: "rail", cls: "tl-yel" });
    disc(`rail.post${q}.up`, FZ(c[0], c[1]), zm + entry(30, RL.ro), zt - entry(30, RL.ro), RL.ro, { tone: "mid" }, { owner: "rail", cls: "tl-yel" });
    ball(`rail.knot${q}.m`, [c[0], c[1], zm], 30, { tone: "mid" }, { owner: "rail", cls: "tl-yel" });
    ball(`rail.knot${q}.t`, [c[0], c[1], zt], 30, { tone: "mid" }, { owner: "rail", cls: "tl-yel" });
    top.push([c[0], c[1], zt]); mid.push([c[0], c[1], zm]);
  });
  [[top, "t"], [mid, "m"]].forEach(([list, tag]) => list.slice(0, -1).forEach((a, j) => {
    const b = list[j + 1], dir = G.unit3(G.sub3(b, a)), Ls = G.len3(G.sub3(b, a));
    disc(`rail.${tag}${j}`, G.frameAlong(a, dir), entry(30, RL.ro), Ls - entry(30, RL.ro), RL.ro, { tone: "mid" }, { owner: "rail", cls: "tl-yel" });
  }));
  ANCH.BARANDA = G.add3(top[1], [0, 0, -RL.h * 0.25]);
}

/* ====================================================================
   7 · la escalera con jaula: largueros, peldaños, ménsulas, aros partidos en dos y barras de la jaula
   ==================================================================== */
const FLD = { o: [0, 0, 0], a: ZD, u: LU, v: LTN };           // sección (radial, tangente), a lo largo de z
{
  const LD = TL.lad, CG = TL.cage, r0 = LD.r, r1 = LD.r + LD.rw, h = LD.half, tt = LD.rt, own = "lad";
  const zTopRail = 13700, zLow = GRADE + 100;
  // el pie de la escalera sobre su dado de concreto
  fp("stand.lpad", FLD, [[r0 - 140, -h - 160], [r1 + 140, -h - 160], [r1 + 140, h + 160], [r0 - 140, h + 160]], GRADE, zLow, { tone: "mid" }, { cls: "tl-conc", ground: true });
  [[1, "p"], [-1, "n"]].forEach(([sg, tag]) => {
    const poly = sg > 0 ? [[r0, h], [r1, h], [r1, h + tt], [r0, h + tt]] : [[r0, -h - tt], [r1, -h - tt], [r1, -h], [r0, -h]];
    fp(`lad.rail.${tag}.lo`, FLD, poly, zLow, zDraw(TL.brk.bot), { tone: "mid" }, { owner: own, cls: "tl-yel" });
    fp(`lad.rail.${tag}`, FLD, poly, TL.brk.top, zTopRail, { tone: "mid" }, { owner: own, cls: "tl-yel" });
  });
  // los peldaños, cada 300 mm desde 300 mm sobre el piso
  const rc = (r0 + r1) / 2;
  for (let zr = TL.grade + LD.pitch; zr < 12640; zr += LD.pitch) {
    if (zr > TL.brk.bot - 40 && zr < TL.brk.top + 40) continue;
    const z = zDraw(zr), F = { o: G.add3(G.mul3(LU, rc), [0, 0, z]), a: LTN, u: LU, v: ZD };
    disc(`lad.rung${Math.round(zr)}`, F, -h, h, 10, { tone: "mid" }, { owner: own, cls: "tl-yel", n: 6 });
  }
  // ménsulas: a la envolvente y a la viga anillo, por fuera de los largueros
  const brk = (z, rIn) => [[1, "p"], [-1, "n"]].forEach(([sg, tag]) => {
    const t0 = sg > 0 ? h + tt : -h - tt - 8, t1 = sg > 0 ? h + tt + 8 : -h - tt, tm = (t0 + t1) / 2;
    const s0 = Math.sqrt(rIn * rIn - tm * tm);
    fp(`lad.brk${z}.${tag}`, FLD, [[s0, t0], [r1, t0], [r1, t1], [s0, t1]], z - 30, z + 30, { tone: "mid" }, { owner: own, cls: "tl-yel" });
  });
  [9400, 10900, 12300].forEach((z) => brk(z, RO));
  brk(8870, RG.r1);
  // la jaula: aros de platina doblada (720 mm por dentro), cada uno en dos mitades, y cinco barras verticales
  const rho = CG.half + CG.t / 2, sc = rc + CG.depth - CG.half, ft = 3, zc0 = 7500, zc1 = 13600;
  const halfHoop = (sg) => {
    const out = [], inn = [];
    for (let i = 0; i <= 8; i++) { const a = (i / 8) * (Math.PI / 2); out.push([sc + (rho + ft) * Math.cos(a), sg * (rho + ft) * Math.sin(a)]); inn.push([sc + (rho - ft) * Math.cos(a), sg * (rho - ft) * Math.sin(a)]); }
    const poly = [...out, [rc - 3 - ft, sg * (rho + ft)], [rc - 3 - ft, sg * (h + tt)], [rc - 3 + ft, sg * (h + tt)], [rc - 3 + ft, sg * (rho - ft)], ...inn.reverse()];
    return sg > 0 ? poly.reverse() : poly;
  };
  const hoopZ = [];
  for (let z = zc0; z <= zc1 + 1; z += 750) hoopZ.push(z);
  hoopZ.forEach((z) => [[1, "p"], [-1, "n"]].forEach(([sg, tag]) => fp(`cage.hoop${z}.${tag}`, FLD, halfHoop(sg), z - CG.h / 2, z + CG.h / 2, { tone: "mid" }, { owner: own, cls: "tl-yel" })));
  // las barras de la jaula: por dentro de los aros, en el vértice, a ±55° y en las dos piernas
  const bars = [];
  [0, 55, -55].forEach((deg) => { const a = deg * D2R, cs = Math.cos(a), sn = Math.sin(a), rr = rho - ft; bars.push([[sc + (rr - 6) * cs - 20 * sn, (rr - 6) * sn + 20 * cs], [sc + rr * cs - 20 * sn, rr * sn + 20 * cs], [sc + rr * cs + 20 * sn, rr * sn - 20 * cs], [sc + (rr - 6) * cs + 20 * sn, (rr - 6) * sn - 20 * cs]]); });
  [1, -1].forEach((sg) => { const t0 = sg * (rho - ft - 6), t1 = sg * (rho - ft), s0 = sc - 200; bars.push(sg > 0 ? [[s0 - 20, t0], [s0 + 20, t0], [s0 + 20, t1], [s0 - 20, t1]] : [[s0 - 20, t1], [s0 + 20, t1], [s0 + 20, t0], [s0 - 20, t0]]); });
  bars.forEach((poly, j) => fp(`cage.bar${j}`, FLD, poly, TL.brk.top, zc1 + CG.h / 2, { tone: "mid" }, { owner: own, cls: "tl-yel" }));
  ANCH.ESCALERA = G.add3(G.add3(G.mul3(LU, sc + rho), [0, 0, 0]), [0, 0, 11400 - 120]);
}

/* ====================================================================
   8 · en la envolvente: boca de inspección con su placa de refuerzo, transmitor de nivel y rebose
   ==================================================================== */
{
  // la boca de inspección de 24 in: placa de refuerzo curva, cuello, brida, tapa con pernos, manijas y bisagra
  const M = TL.smh, F = F_MH, own = "smh", RP = RO + 6;
  const padP = (f, u) => { const rr = M.a + (M.pad - M.a) * u, t = rr * Math.cos(f), zz = M.z + rr * Math.sin(f), th = M.th * D2R + t / RP; return [RP * Math.cos(th), RP * Math.sin(th), zz]; };
  const padN = (f, u) => { const p = padP(f, u); return G.unit3([p[0], p[1], 0]); };
  const edge = Array.from({ length: 97 }, (_, i) => padP((i / 96) * TAU, 1));
  const pad = toned((o) => surface(padP, padN, 0, TAU, 72, 6, o), "tl-ss") + Ln(path3(edge, true), { tone: "mid" });
  put("smh.pad", G.add3(F.o, G.mul3(F.a, RP)), pad, [record(A.disc(F, 1300, RP + 1, M.pad, { name: "smh.pad", owner: own, cut: [A.disc(F0, 0, BIGZ, RO), A.ring(F0, 0, BIGZ, RP, 9000), A.disc(F, 0, 5000, M.a)] }))]);
  saddle("smh.neck", F, M.a, (t) => G.saddleStart(RP, M.a, t), M.out, { tone: "mid" }, { owner: own, cls: "tl-ss", hosts: [A.disc(F0, 0, BIGZ, RP), A.disc(F, 0, 5000, M.ai)] });
  disc("smh.fl", F, M.out, M.out + 30, 406, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  disc("smh.cover", F, M.out + 30, M.out + 55, 406, { tone: "mid" }, { owner: own, cls: "tl-ss", extra: Dots(G.dotsOf(F, M.out + 55, 370, 20, P, { all: true }), { size: 0.8 }) });
  // dos manijas en la tapa
  const s1 = M.out + 55;
  [[-160, "a"], [160, "b"]].forEach(([du, tag]) => {
    const q0 = G.pointOf(F, s1, 0, 0), b0 = G.add3(G.add3(q0, G.mul3(F.u, du)), [0, 0, -90]), b1 = G.add3(G.add3(q0, G.mul3(F.u, du)), [0, 0, 90]);
    tubeItems(`smh.handle.${tag}`, G.fillet([b0, G.add3(b0, G.mul3(F.a, 80)), G.add3(b1, G.mul3(F.a, 80)), b1], 34, 8, { P, tube: 10 }), 10, { tone: "mid", cls: "tl-pipe", maxLength: 120 });
  });
  // la bisagra, a la izquierda (+u): tres nudillos sobre un mismo eje vertical y sus orejas
  const kn = G.add3(F.o, G.add3(G.mul3(F.a, M.out + 30), G.mul3(F.u, 448)));
  [[0, 40, "f0", M.out + 4, M.out + 28], [40, 80, "c", M.out + 32, M.out + 53], [80, 120, "f1", M.out + 4, M.out + 28]].forEach(([z0, z1, tag, sA, sB]) => {
    disc(`smh.knuckle.${tag}`, FZ(kn[0], kn[1]), M.z + z0 - 60, M.z + z1 - 60, 19, { tone: "mid" }, { owner: own, cls: "tl-ss" });
    fp(`smh.lug.${tag}`, F, [[398, z0 - 60], [440, z0 - 60], [440, z1 - 60], [398, z1 - 60]], sA, sB, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  });
  ANCH.BOCA = G.pointOf(F, M.out + 40, 406, (AZ - TL.smh.th) * D2R + Math.PI / 2 + 0.6);
}
{
  // el transmisor de nivel LT‑101 en la toma de 9,2 m: boquilla de 2 in, válvula de bola de bloqueo, brida ciega con
  // la toma de ½ in, la pierna de impulso corta y el transmisor de presión diferencial (lado de baja abierto al aire)
  const F = F_LT, own = "lt";
  saddle("lt.neck", F, 30.15, (t) => G.saddleStart(RO, 30.15, t), 1600, { tone: "mid" }, { owner: own, cls: "tl-ss", hosts: [A.disc(F0, 0, BIGZ, RO), A.disc(F, 0, 5000, 26.6)] });
  disc("lt.fl0", F, 1600, 1619, 76.2, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  disc("lt.v.fl0", F, 1619, 1638, 76.2, { tone: "mid" }, { owner: own, cls: "tl-cast", extra: Dots(G.dotsOf(F, 1638, 60.3, 4, P, { least: 0.05, fade: [0.04, 0.42], phase: Math.PI / 4 }), { size: 0.5 }) });
  const vm = 1708, bulge = (s) => 44 + 20 * Math.cos(((s - vm) / 52) * (Math.PI / 2));
  disc("lt.v.n0", F, 1638, 1656, 38, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  const prof = Array.from({ length: 13 }, (_, i) => { const s = 1656 + (104 * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned("lt.v.body", F, prof, { tone: "mid" }, { owner: own, cls: "tl-cast", smooth: { slope: (s) => -20 * Math.sin(((s - vm) / 52) * (Math.PI / 2)) * (Math.PI / 104) } });
  disc("lt.v.n1", F, 1760, 1778, 38, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  disc("lt.v.fl1", F, 1778, 1797, 76.2, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  disc("lt.blind", F, 1797, 1816, 76.2, { tone: "mid" }, { owner: own, cls: "tl-ss", extra: Dots(G.dotsOf(F, 1816, 60.3, 4, P, { least: 0.05, fade: [0.04, 0.42], phase: Math.PI / 4 }), { size: 0.5 }) });
  // el vástago y la palanca de la válvula de bola (abierta: a lo largo del tubo)
  const top = G.add3(F.o, G.mul3(F.a, vm)), FS = FZ(top[0], top[1]);
  disc("lt.v.stem", FS, TL.lt.z + Math.sqrt(64 * 64 - 14 * 14) - 1, TL.lt.z + 84, 14, { tone: "mid" }, { owner: own, cls: "tl-cast" });
  fp("lt.v.lever", { o: [top[0], top[1], 0], a: ZD, u: F.a, v: F.u }, [[-20, -9], [150, -9], [150, 9], [-20, 9]], TL.lt.z + 84, TL.lt.z + 92, { tone: "mid" }, { owner: own, cls: "tl-lever" });
  // la pierna de impulso de ½ in y el transmisor
  tubeItems("lt.imp", [G.add3(F.o, G.mul3(F.a, 1816)), G.add3(F.o, G.mul3(F.a, 1930))], 10.67, { tone: "mid", cls: "tl-pipe", maxLength: 200 });
  const pf = (s0, s1, t0, t1, z0, z1) => [[t0, z0 - TL.lt.z], [t1, z0 - TL.lt.z], [t1, z1 - TL.lt.z], [t0, z1 - TL.lt.z]];
  fp("lt.flange", F, pf(0, 0, -52, 52, TL.lt.z - 44, TL.lt.z + 44), 1930, 1980, { tone: "mid" }, { owner: own, cls: "tl-trim" });
  // el lado de baja: un tapón de venteo en la cara de la brida
  const FLo = { o: G.add3(F.o, G.mul3(F.a, 1955)), a: F.u, u: F.a, v: ZD };
  disc("lt.lo.port", FLo, 52, 64, 9, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
  fp("lt.lo.vent", FLo, HEX(9), 64, 74, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
  const FSM = FZ(...G.add3(F.o, G.mul3(F.a, 1955)).slice(0, 2));
  disc("lt.sensor", FSM, TL.lt.z + 44, TL.lt.z + 96, 40, { tone: "mid" }, { owner: own, cls: "tl-trim" });
  const hc = G.add3([0, 0, TL.lt.z + 96 + 50], G.mul3(F.a, 1955)), FHs = { o: hc, a: F.u, u: F.a, v: ZD };
  disc("lt.housing", FHs, -66, 66, 50, { tone: "mid" }, { owner: own, cls: "tl-trim" });
  disc("lt.cap0", FHs, -80, -66, 53, { tone: "mid" }, { owner: own, cls: "tl-trim" });
  disc("lt.cap1", FHs, 66, 80, 53, { tone: "mid" }, { owner: own, cls: "tl-trim" });
  const FC = { o: G.add3(hc, G.mul3(F.a, 0)), a: [0, 0, -1], u: F.a, v: F.u };
  void FC;
  ANCH.LT = G.add3(hc, G.add3(G.mul3(F.a, 50 * Math.cos(0.5)), [0, 0, 50 * Math.sin(0.5)]));
}
{
  // el rebose, con la plantilla de la boca a 12,35 m: boquilla de 2 in, bridas, el tubo que sale, el codo y la bajada junto a la columna de 135°;
  // abajo termina abierto sobre un dado de concreto, con su espacio de aire
  const F = F_OV, own = "over", OVR = OV.ro;
  saddle("ov.neck", F, OVR, (t) => G.saddleStart(RO, OVR, t), 1600, { tone: "mid" }, { owner: own, cls: "tl-ss", hosts: [A.disc(F0, 0, BIGZ, RO), A.disc(F, 0, 5000, 26.6)] });
  disc("ov.fl0", F, 1600, 1619, 76.2, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  disc("ov.fl1", F, 1619, 1638, 76.2, { tone: "mid" }, { owner: "over", cls: "tl-pipe", extra: Dots(G.dotsOf(F, 1619, 60.3, 4, P, { least: 0.05, fade: [0.04, 0.42], phase: Math.PI / 4 }), { size: 0.5 }) });
  const p0 = G.add3(F.o, G.mul3(F.a, 1638)), pc = G.add3(F.o, G.mul3(F.a, OV.rd)), dropTop = [pc[0], pc[1], OV.z];
  const zClamps = [8300, 7350];
  const route = G.fillet([p0, dropTop, [pc[0], pc[1], TL.brk.top]], 76, 9, { P, tube: OVR });
  const total = G.pathLength(route);
  const gaps = zClamps.map((z) => { const s = total - (z - TL.brk.top); return [s - 26, s + 26]; });
  tubeItems("ov.pipe", route, OVR, { tone: "mid", cls: "tl-pipe", maxLength: 1000, gaps, ends: [true, false] });
  const legC = LEGS[1], toLeg = G.unit3(G.sub3([legC[0], legC[1], 0], [pc[0], pc[1], 0])), dist = Math.hypot(legC[0] - pc[0], legC[1] - pc[1]);
  const clamp = (name, z, owner) => {
    const FCm = FZ(pc[0], pc[1]);
    disc(`${name}.ring`, FCm, z - 25, z + 25, OVR + 9, { tone: "mid" }, { owner, cls: "tl-str", cut: [A.disc(FCm, 0, BIGZ, OVR + 0.5)] });
    const FB = { o: [pc[0], pc[1], z], a: toLeg, u: [toLeg[1], -toLeg[0], 0], v: ZD };
    fp(`${name}.bar`, FB, [[-4, -25], [4, -25], [4, 25], [-4, 25]], OVR + 9 - 1, dist - LG.ro + 0.5, { tone: "mid" }, { owner, cls: "tl-str" });
  };
  zClamps.forEach((z, j) => clamp(`ov.clamp${j}`, z, "ov.pipe"));
  // abajo del corte
  const zlo0 = zDraw(TL.brk.bot), zlo1 = zDraw(OV.end), zcl = zDraw(150);
  const lowRoute = [[pc[0], pc[1], zlo0], [pc[0], pc[1], zlo1]];
  const sC = zlo0 - zcl;
  pipe("ov.low", lowRoute, OVR, { flanges: [false, true], flangeR: 76.2 / OVR, flangeT: 19, open: [true, true], cls: "tl-pipe", dots: 4, gaps: [[sC - 26, sC + 26]] });
  clamp("ov.clamp.lo", zcl, "ov.low");
  box("stand.splash", [pc[0] - 250, pc[1] - 250, GRADE], [pc[0] + 250, pc[1] + 250, GRADE + 120], { tone: "mid" }, { r: 6, steps: 3, bevel: 0.8, cls: "tl-conc" });
  ANCH.REBOSE = G.add3(route[Math.floor(route.length / 2)], [0, 0, 0]);
}

/* ====================================================================
   8b · abajo: la salida a la planta (con su tubo corto adentro, su compuerta y el codo) y el drenaje
   ==================================================================== */
{
  const O = TL.out, OC = pol(O.r, O.th), F = FZ(OC[0], OC[1]), own = "out", r = O.ro;
  // adentro: el tubo corto de 100 mm que deja el sedimento en el fondo
  const bore = pth1(arcPts(r - 5.5, zb + 100, 0, TAU, 40).slice(0, -1).map((p) => pr([p[0] + OC[0], p[1] + OC[1], p[2]])));
  disc("out.stand", F, zb, zb + 100, r, { tone: "mid" }, { owner: own, cls: "tl-sub", cut: [A.disc(F, 0, BIGZ, r - 5.5)], extra: `<path class="tl-bore" d="${bore}"/>` });
  // afuera: cuello, brida, compuerta con su bonete y su volante, codo y el tubo hacia la planta
  const zv = 8620;                                     // cara de abajo del cuello
  disc("out.neck", F, zv, zb - TL.bot.t, r, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  disc("out.fl0", F, zv - 24, zv, 95.25, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  disc("out.v.fl0", F, zv - 48, zv - 24, 95.25, { tone: "mid" }, { owner: "gv", cls: "tl-cast", extra: Dots(G.dotsOf(F, zv - 24, 76.2, 4, P, { least: 0.05, fade: [0.04, 0.42], phase: Math.PI / 4 }), { size: 0.5 }) });
  disc("out.v.n0", F, zv - 104, zv - 48, 56, { tone: "mid" }, { owner: "gv", cls: "tl-cast" });
  turned("out.v.body", F, [[zv - 168, 62], [zv - 168, 74], [zv - 104, 74], [zv - 104, 62]], { tone: "mid" }, { owner: "gv", cls: "tl-cast" });
  disc("out.v.n1", F, zv - 227, zv - 168, 56, { tone: "mid" }, { owner: "gv", cls: "tl-cast" });
  disc("out.v.fl1", F, zv - 251, zv - 227, 95.25, { tone: "mid" }, { owner: "gv", cls: "tl-cast" });
  disc("out.fl1", F, zv - 275, zv - 251, 95.25, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
  const vm = zv - 136, g = G.unit3([Math.cos((AZ - 45) * D2R), Math.sin((AZ - 45) * D2R), 0]);
  const FGv = { o: [OC[0], OC[1], vm], a: g, u: G.unit3(G.cross3(ZD, g)), v: ZD };
  disc("out.v.bon", FGv, entry(74, 40) - 1, 190, 40, { tone: "mid" }, { owner: "gv", cls: "tl-cast" });
  disc("out.v.bfl", FGv, 190, 204, 58, { tone: "mid" }, { owner: "gv", cls: "tl-cast", extra: Dots(G.dotsOf(FGv, 204, 49, 6, P, { all: true }), { size: 0.45 }) });
  disc("out.v.stem", FGv, 204, 262, 10, { tone: "hi" }, { owner: "gv", cls: "tl-pipe" });
  const hw = record(A.ring(FGv, 262, 274, 70, 82, { name: "out.v.wheel", owner: "gv" }));
  put("out.v.wheel", G.add3(FGv.o, G.mul3(g, 268)), wrap(S(G.ringBand(262, 274, 70, 82, FGv, P), { tone: "mid" }), "tl-lever"), [hw]);
  disc("out.v.hub", FGv, 258, 278, 20, { tone: "mid" }, { owner: "gv", cls: "tl-lever" });
  [0, 1, 2].forEach((i) => { const a = (i * TAU) / 3 + 0.3, dir = G.add3(G.mul3(FGv.u, Math.cos(a)), G.mul3(FGv.v, Math.sin(a))); fp(`out.v.spoke${i}`, { o: G.add3(FGv.o, G.mul3(g, 268)), a: dir, u: g, v: G.cross3(dir, g) }, [[-4, -6], [4, -6], [4, 6], [-4, 6]], 19.95, Math.sqrt(70 * 70 - 36) - 0.05, { tone: "mid" }, { owner: "gv", cls: "tl-lever" }); });
  // el codo y el tubo hacia la planta, por delante de la cara de la estructura que mira a +y
  const elbow = [OC[0], OC[1], 8000];
  ball("out.elbow", elbow, 62, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
  pipe("out.drop", [[OC[0], OC[1], zv - 275], elbow], r, { cls: "tl-pipe", balls: [{ c: elbow, R: 62, at: "end" }] });
  pipe("out.run", [elbow, [OC[0], 1420, 8000]], r, { flanges: [false, true], flangeR: 95.25 / r, flangeT: 24, open: [false, true], cls: "tl-pipe", balls: [{ c: elbow, R: 62, at: "start" }], dots: 4 });
  ANCH.SALIDA = [OC[0] + r * 0.7, 1330, 8000 + r * 0.6];
}
{
  // el drenaje de 2 in: cuello, compuerta pequeña y un tubo corto abierto
  const D = TL.drain, c = pol(D.r, D.th), F = FZ(c[0], c[1]), own = "drain", r = D.ro, zv = 8650;
  disc("dr.neck", F, zv, zb - TL.bot.t, r, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  disc("dr.fl0", F, zv - 19, zv, 76.2, { tone: "mid" }, { owner: own, cls: "tl-ss" });
  disc("dr.v.fl0", F, zv - 38, zv - 19, 76.2, { tone: "mid" }, { owner: "dv", cls: "tl-cast" });
  disc("dr.v.n0", F, zv - 78, zv - 38, 40, { tone: "mid" }, { owner: "dv", cls: "tl-cast" });
  turned("dr.v.body", F, [[zv - 138, 44], [zv - 138, 54], [zv - 78, 54], [zv - 78, 44]], { tone: "mid" }, { owner: "dv", cls: "tl-cast" });
  disc("dr.v.n1", F, zv - 178, zv - 138, 40, { tone: "mid" }, { owner: "dv", cls: "tl-cast" });
  disc("dr.v.fl1", F, zv - 197, zv - 178, 76.2, { tone: "mid" }, { owner: "dv", cls: "tl-cast" });
  disc("dr.fl1", F, zv - 216, zv - 197, 76.2, { tone: "mid" }, { owner: own, cls: "tl-pipe" });
  const g = G.unit3([Math.cos((AZ - 45) * D2R), Math.sin((AZ - 45) * D2R), 0]), FGd = { o: [c[0], c[1], zv - 108], a: g, u: G.unit3(G.cross3(ZD, g)), v: ZD };
  disc("dr.v.bon", FGd, entry(54, 26) - 1, 120, 26, { tone: "mid" }, { owner: "dv", cls: "tl-cast" });
  disc("dr.v.stem", FGd, 120, 160, 7, { tone: "hi" }, { owner: "dv", cls: "tl-pipe" });
  const hw = record(A.ring(FGd, 160, 168, 46, 54, { name: "dr.v.wheel", owner: "dv" }));
  put("dr.v.wheel", G.add3(FGd.o, G.mul3(g, 164)), wrap(S(G.ringBand(160, 168, 46, 54, FGd, P), { tone: "mid" }), "tl-lever"), [hw]);
  disc("dr.v.hub", FGd, 156, 172, 14, { tone: "mid" }, { owner: "dv", cls: "tl-lever" });
  [0, 1, 2].forEach((i) => { const a = (i * TAU) / 3 + 0.3, dir = G.add3(G.mul3(FGd.u, Math.cos(a)), G.mul3(FGd.v, Math.sin(a))); fp(`dr.v.spoke${i}`, { o: G.add3(FGd.o, G.mul3(g, 164)), a: dir, u: g, v: G.cross3(dir, g) }, [[-3, -4], [3, -4], [3, 4], [-3, 4]], 13.95, Math.sqrt(46 * 46 - 16) - 0.05, { tone: "mid" }, { owner: "dv", cls: "tl-lever" }); });
  pipe("dr.pipe", [[c[0], c[1], zv - 216], [c[0], c[1], 8000]], r, { open: [false, true], cls: "tl-pipe" });
  ANCH.DRENAJE = G.add3(FGd.o, G.mul3(g, 164));
}

/* ====================================================================
   9 · las caras del corte, un elemento por pieza y por plano; el agua; orden y salida
   ==================================================================== */
liquid();
{
  const groups = new Map();
  for (const c of cutStore) { const key = c.owner + "|" + c.cls + "|" + c.plane; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls, plane] = key.split("|");
    const d = list.map((c) => pth1(c.poly.map(([u, z]) => pr(toPlane(plane, u, z))))).join("");
    const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
    const Fp = plane === "y" ? FY0 : FX0;
    const shapes = list.map((c) => record(A.prism(Fp, c.poly, -0.3, 0, { name: `${owner}.corte${plane}`, owner })));
    const cx = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.corte${plane}`, toPlane(plane, cx[0] / n, cx[1] / n), svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.TL_ITEM) {
  for (const nm of process.env.TL_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
if (process.env.TL_PAIRS) {
  for (const pair of process.env.TL_PAIRS.split(";")) {
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
const CSS = `.tl-cut{--anatomy-paper:#c9ced3;--anatomy-face:#c9ced3;--anatomy-top:#c9ced3;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#c9ced3;--anatomy-shade-2:#c9ced3;--anatomy-shade-3:#c9ced3}
.tl-ss{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#ccd1d6;--anatomy-shade-1:#d5d9dd;--anatomy-shade-2:#dde1e4;--anatomy-shade-3:#e5e8ea}
.tl-pipe{--anatomy-paper:#f4f5f6;--anatomy-face:#f4f5f6;--anatomy-top:#fbfbfc;--anatomy-shade-0:#d6d9dc;--anatomy-shade-1:#dfe2e4;--anatomy-shade-2:#e7e9eb;--anatomy-shade-3:#eef0f1}
.tl-sub{--anatomy-paper:#dbe5ec;--anatomy-face:#dfe8ee;--anatomy-top:#e1eaf0;--anatomy-shade-0:#bccbd5;--anatomy-shade-1:#c5d3dc;--anatomy-shade-2:#cdd9e1;--anatomy-shade-3:#d5e0e7}
.tl-str{--anatomy-paper:#e2e6ea;--anatomy-face:#e2e6ea;--anatomy-top:#edf0f2;--anatomy-shade-0:#b9c1c8;--anatomy-shade-1:#c3cad0;--anatomy-shade-2:#ccd2d7;--anatomy-shade-3:#d5dadf}
.tl-cast{--anatomy-paper:#e3e6e9;--anatomy-face:#e3e6e9;--anatomy-top:#eceef0;--anatomy-shade-0:#c4c9ce;--anatomy-shade-1:#cdd1d5;--anatomy-shade-2:#d5d9dc;--anatomy-shade-3:#dde0e3}
.tl-yel{--anatomy-paper:#efe4b8;--anatomy-face:#efe4b8;--anatomy-top:#f6efd2;--anatomy-shade-0:#d6c584;--anatomy-shade-1:#ddcd93;--anatomy-shade-2:#e4d6a3;--anatomy-shade-3:#eadeb0}
.tl-conc{--anatomy-paper:#e7e4de;--anatomy-face:#e7e4de;--anatomy-top:#efede9;--anatomy-shade-0:#c8c3ba;--anatomy-shade-1:#d0ccc4;--anatomy-shade-2:#d9d5ce;--anatomy-shade-3:#e0ddd7}
.tl-lever{--anatomy-paper:#d9dde1;--anatomy-face:#d9dde1;--anatomy-top:#e6e9ec;--anatomy-shade-0:#aeb5bc;--anatomy-shade-1:#b8bfc5;--anatomy-shade-2:#c2c8ce;--anatomy-shade-3:#ccd1d6}
.tl-liq{fill:#c4d7e3;fill-opacity:.55;stroke:none}
.tl-bore{fill:#a9b1b9;stroke:none}
.tl-mesh{fill:none;stroke:#8d969f;stroke-width:.45px}`;
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
    // los puntos que caen sobre la recta de sus vecinos (a menos de 0,04 unidades) no cambian el dibujo: se quitan
    for (const sp of subs) {
      if (sp.pts.length < 3) continue;
      const kept = [sp.pts[0]];
      for (let j = 1; j < sp.pts.length - 1; j++) {
        const a = kept[kept.length - 1], b = sp.pts[j], c = sp.pts[j + 1];
        const dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy);
        if (L < 1e-9) { if (b[0] === a[0] && b[1] === a[1]) continue; kept.push(b); continue; }
        const t = ((b[0] - a[0]) * dx + (b[1] - a[1]) * dy) / (L * L), off = Math.abs((b[0] - a[0]) * dy - (b[1] - a[1]) * dx) / L;
        if (off < 0.04 && t > 0 && t < 1) continue;
        kept.push(b);
      }
      kept.push(sp.pts[sp.pts.length - 1]);
      sp.pts = kept;
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
const svg = k.figureSvg({ width: W, height: H, label: "Tanque de llegada en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="tl-items">${groups.join("")}</g>`] });
const OUT = process.env.TL_OUT || join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(process.env.TL_OUT ? join(OUT, "preview.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Tanque de llegada", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
Object.assign(ANCH, {
  TECHO: pol(1200, 130, zRoofT(1200)),
  ESTRUCTURA: [LEGS[1][0] + TL.leg.ro * HV[0], LEGS[1][1] + TL.leg.ro * HV[1], 7750],
});
writeFileSync(join(OUT, "tanque_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
