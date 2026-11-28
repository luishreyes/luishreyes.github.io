/* ====================================================================
   Banco de hielo en isométrico (skill anatomy), para el capítulo 26 del libro de operaciones unitarias
   (Refrigeración y congelación): el banco de hielo E-402 de la planta de frío de la juguera, el evaporador del nivel
   alto, de fusión externa, abierto a la atmósfera y agitado con aire.
   Concepto: el amoníaco líquido baja del separador de baja al cabezal de entrada, se reparte en los 20 circuitos del
   haz, entra por abajo a cada uno por su bajante y sube por los 18 pasos mientras hierve a −8 °C; la mezcla de líquido y
   vapor sale por arriba al cabezal de salida y vuelve al separador, que deja ir el vapor seco a la succión del tornillo.
   Sobre los tubos crece una capa de hielo de unos 36 mm. El agua que vuelve de los usuarios a 7,3 °C entra por el
   distribuidor del extremo de −x, corre a lo largo del tanque por los pasillos que quedan entre los circuitos, funde el
   hielo por fuera y sale a 1 °C por el extremo de +x. El aire del soplador sale por los tubos perforados del fondo y
   agita el agua; el control del espesor mide el hielo con un electrodo junto al circuito de adelante.
   Corte: se quitó la pared entera del costado largo que mira al lector (y > 0), del fondo del tanque al borde: se ven
   el haz con su hielo, sus soportes y sus cabezales, los tubos de aire con las burbujas, el distribuidor, la salida y el
   agua (cortada en el plano de la pared, translúcida). En el circuito de adelante se quitó el hielo en un tramo, junto a
   una pletina de soporte, para que se vean el tubo y el anillo de hielo. La tapa es de paneles aislados; faltan dos,
   y por ahí se ve la superficie del agua. Encima, el separador de baja sobre dos vigas, con sus líneas.
   La figura es solo del libro: lleva la persona de referencia de 1,75 m (../persona.mjs), de pie a la izquierda.
   Uso: node build.mjs [--audit] [--fast]   (BH_PER="x,y,rumbo" prueba otro lugar para la persona; BH_ITEM="pieza"
   lista lo que se cruza con una pieza en pantalla)
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
const X = await import(join(HERE, "../extractor-arrastre/xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const STEP = Number(process.env.BH_STEP || 0.25);
const BH = GEO.BH, DN = GEO.DN, CO = BH.coil, RI = GEO.rIce;
const AZ = BH.AZ, EL = BH.EL;
const { xi0, xi1, yi0, yi1, ZF, zW, zR } = BH;
const WL = BH.wall;
const xo0 = xi0 - WL, xo1 = xi1 + WL, yo0 = yi0 - WL, yo1 = yi1 + WL;   // las caras de afuera
const zC1 = zR + BH.cov;                                                // la cara de arriba de la tapa

const W = 900, H = 680;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)

/* ---------- lugares que se usan en varias partes ---------- */
const xa = GEO.xa, xb = GEO.xb, xD = GEO.xD;
const zt = GEO.zPass(0), zbP = GEO.zPass(CO.n - 1);
const HD = BH.hdr, NVH = DN[100], NLH = DN[65];
const DR = BH.drum, xd = xa, rD = DR.r + DR.ins, zDc = DR.zc;           // el separador, sobre el cabezal del vapor
const hD = DR.r / 2 + DR.ins;                                           // la profundidad de sus cabezas aisladas
const zBeam0 = zR, zBeam1 = zR + 150;                                    // las vigas del separador, sobre las paredes
const AIR = BH.air, NA = DN[50], NAL = DN[40];
const BL = BH.blower;
const yFL = BH.yi1;                                                     // el plano de la pared que se quitó

/* ---------- la cámara ---------- */
const EXT = [];
for (const x of [BH.pl.x0, BH.pl.x1]) for (const y of [BH.pl.y0, BH.pl.y1]) EXT.push([x, y, 0]);
for (const x of [xo0, xo1]) for (const y of [yo0, yo1]) EXT.push([x, y, zC1]);
for (const y of [-DR.L / 2 - hD, DR.L / 2 + hD]) EXT.push([xd, y, zDc + rD], [xd, y, zDc - rD]);
EXT.push([xd, 0, 4960 + 94 + 20], [4230, 2000, 3800], [xd, -DR.L / 2 + 250, zDc + rD + 360], [4250, 0, 4480], [4250, 1380, 3700], [4600, BH.out.y, BH.out.z + 120], [4600, BH.out.y, BH.out.z - 120]);
EXT.push([BL.x + 300, BL.y + 400, 0], [BL.x, AIR.y, 1150], [-4000, BH.dist.yDrop, 3360]);
EXT.push([BH.persona.x, BH.persona.y, 0], [BH.persona.x, BH.persona.y, 1800], [BH.persona.x - 250, BH.persona.y, 0]);
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso

/* El dibujo va en milímetros; el audit, en centímetros (como el extractor): cm() pasa cada forma registrada a
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
function turned(name, F, profile, style = {}, { extra = "", rims, owner, smooth, steps, bevel = 0, cls = "", cut = null, inner = "", hole = null } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(hole ? { hole } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  // un anillo (con hole) se registra tal como es, sin cerrarlo al eje, y su relleno deja ver por el hueco
  const meta = { name, owner, ...(cut ? { cut } : {}) };
  const shape = record(hole ? A.body(F, profile.map(([s, r]) => [s, r]), meta) : A.solid(F, profile, meta));
  let body = S(paths, { tone: "mid", inner, ...style });
  if (hole) body = body.replace('<g class="iso-solid"', '<g class="iso-solid" fill-rule="evenodd"');
  put(name, G.add3(F.o, G.mul3(F.a, mid)), wrap(body + extra, cls), [shape]);
  return shape;
}
// un cilindro corto (perno, pasador, tapón, brida) o un tramo recto de tubo: prisma de sección circular
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null, cap = "auto" } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * G.scaleOf(P)) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cap, ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 140, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, spacing = null, owner = name } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
// un racor o una te: una esfera con el paso de cada tubo que la cruza o termina en ella
function ball(name, c, Rb, style = {}, { owner, cls = "", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(Rb + 0.6))), G.add3(c, G.mul3(b.dir, Rb + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, Rb, { name, owner, ...(cut.length ? { cut } : {}) }));
  put(name, c, wrap(S(G.sphereOf(c, Rb, P), { tone: "mid", ...style }), cls), [shape]);
  return shape;
}
const entry = (Rb, r) => Math.sqrt(Math.max(0, Rb * Rb - r * r)) - 0.02;
function mergeGaps(gs) { const s = gs.filter((g) => g[1] > g[0]).sort((a, b) => a[0] - b[0]), out = []; for (const g of s) { const l = out[out.length - 1]; if (l && g[0] <= l[1]) l[1] = Math.max(l[1], g[1]); else out.push([...g]); } return out; }
/* un tubo: cada esfera en un extremo (at: "start" o "end") recibe el tubo hasta su superficie */
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
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];

/* ---------- superficies con tonos suaves (del filtro de arena y del extractor) ---------- */
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
function surface(P3, N3, f0, f1, nf, out) {
  const cls = (f) => { const n = N3(f); return G.dot3(n, V3) <= 1e-4 ? -1 : BAND(G.dot3(n, L3)); };
  const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
  const bands = [];
  for (let i = 0; i < nf; i++) bands.push(cls((fOf(i) + fOf(i + 1)) / 2));
  for (let i = 0; i < nf; ) {
    let j = i; while (j + 1 < nf && bands[j + 1] === bands[i]) j++;
    if (bands[i] >= 0) {
      const pts = []; for (let q = i; q <= j + 1; q++) pts.push(P3(fOf(q), 0)); for (let q = j + 1; q >= i; q--) pts.push(P3(fOf(q), 1));
      const d = pth1(pts.map(pr)); out.by[bands[i]].push(d); out.fill.push(d);
    }
    i = j + 1;
  }
}
function toned(build, cls = "") {
  const out = { by: [[], [], [], [], []], fill: [] };
  build(out);
  return `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">` + out.by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "") + "</g>";
}
// una cara plana: polígono 3D con su normal; tono por la luz
function flatFace(pts, n, cls = "", holes = []) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr)) + holes.map((h) => pth1(h.map(pr))).join("");
  const rule = holes.length ? ` fill-rule="evenodd"` : "";
  return `<g class="iso-solid${cls ? " " + cls : ""}">` + (b >= 4 ? `<path class="iso-top"${rule} d="${d}"/>` : `<path class="iso-shade" data-shade="${b}"${rule} d="${d}"/>`) + "</g>";
}
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: XD, v: YD });
const FXL = (y, z) => ({ o: [0, y, z], a: XD, u: YD, v: ZD3 });     // a lo largo de x, por (y, z)
const FYL = (x, z) => ({ o: [x, 0, z], a: YD, u: XD, v: ZD3 });     // a lo largo de y, por (x, z)
const F0 = FZ();
const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
const arcPts = (r, z, f0, f1, n = 72, cx = 0, cy = 0) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]; });
const fS = (AZ - 90) * D2R + TAU;                      // la silueta de la derecha de un cilindro vertical
const fSL = fS - PI;                                   // la de la izquierda
// un anillo de eje vertical (brida, aro): la banda de afuera que se ve, la de adentro (por el hueco) y la cara de arriba
function ring(name, r0, r1, z0, z1, cls, { owner, extra = "" } = {}) {
  const inner = toned((o) => surface(cylP(r0, z0, z1), cylN(-1), fSL, fS, 96, o), cls);
  const outer = toned((o) => surface(cylP(r1, z0, z1), cylN(1), fS - TAU, fSL, 96, o), cls);
  const top = flatFace(arcPts(r1, z1, 0, TAU, 120).slice(0, -1), ZD3, cls, [arcPts(r0, z1, 0, TAU, 120).slice(0, -1).reverse()]);
  const sil = [fS, fSL].map((f) => path3([[r1 * Math.cos(f), r1 * Math.sin(f), z0], [r1 * Math.cos(f), r1 * Math.sin(f), z1]])).join("");
  const edges = Ln(path3(arcPts(r1, z1, 0, TAU, 120)) + path3(arcPts(r0, z1, 0, TAU, 120)) + path3(arcPts(r1, z0, fS - TAU, fSL, 60)) + sil, { tone: "mid" });
  const shape = record(A.body(F0, [[z0, r0], [z0, r1], [z1, r1], [z1, r0]], { name, owner }));
  put(name, [r1 * HV[0], r1 * HV[1], (z0 + z1) / 2], inner + outer + top + edges + extra, [shape]);
}
const DEFS = [];
let seed = 7;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
// válvula de bola bridada: F.a es el sentido del flujo y la cara de entrada está en s0; con palanca
function ballValve(name, F, s0, d, { open = true, stem = null, owner = name, lever = 170 } = {}) {
  const Lv = d.ro > 25 ? 216 : 165, ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, { tone: "mid" }, { owner, cls: "bh-cast", extra: Dots(G.dotsOf(F, s0, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner, cls: "bh-cast" });
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, { tone: "mid" }, { owner, cls: "bh-cast", extra: Dots(G.dotsOf(F, s1, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  const st = stem || ZD3;
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - 16 * 16) - 2, r1 + 30, 16, { tone: "mid" }, { owner, cls: "bh-cast" });
  disc(`${name}.stem`, FS, r1 + 30, r1 + 42, 7, { tone: "mid" }, { owner, cls: "bh-ss" });
  const lv = open ? F.a : G.unit3(G.cross3(st, F.a)), FL2 = { o: G.add3(c, G.mul3(st, r1 + 42)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
  fp(`${name}.lever`, FL2, [[0, -10], [6, -10], [6, 10], [0, 10]], -16, lever, { tone: "mid" }, { owner, cls: "bh-lever" });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, r1, s1, top: G.add3(c, G.mul3(st, r1 + 30)) };
}
// un par de bridas donde sigue la línea, con un tramo corto y su brida
function lineEnd(name, F, s, d, owner) {
  disc(`${name}.e0`, F, s, s + d.ft, d.fl, { tone: "mid" }, { owner, cls: "bh-cast" });
  disc(`${name}.e1`, F, s + d.ft, s + 2 * d.ft, d.fl, { tone: "mid" }, { owner: owner + "2", cls: "bh-cast" });
  disc(`${name}.stub`, F, s + 2 * d.ft, s + 2 * d.ft + 90, d.ro, { tone: "mid" }, { owner: owner + "2", cls: "bh-pipe" });
  disc(`${name}.e2`, F, s + 2 * d.ft + 90, s + 3 * d.ft + 90, d.fl, { tone: "mid" }, { owner: owner + "2", cls: "bh-cast", extra: Dots(G.dotsOf(F, s + 3 * d.ft + 90, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  return G.add3(F.o, G.mul3(F.a, s + 3 * d.ft + 90));
}

// la superficie de un cilindro de eje cualquiera, para las franjas que se pintan encima (el vidrio del visor)
const seamV = (x, y, z0, z1, ax = "x") => Ln(path3(ax === "x" ? [[x - 4, y, z0], [x - 4, y, z1]] : [[x, y - 4, z0], [x, y - 4, z1]]) + path3(ax === "x" ? [[x + 4, y, z0], [x + 4, y, z1]] : [[x, y + 4, z0], [x, y + 4, z1]]), { tone: "faint" });
// una banda de capas en una cara (el corte de una pared o de un panel): polígono 3D con su normal, en el poliuretano
const capa = (pts, n) => flatFace(pts, n, "bh-pu") + Ln(path3(pts, true), { tone: "lo" });

/* ====================================================================
   1 · el pedestal, el fondo y las paredes del tanque (sin la de +y, que se quitó), el ángulo del borde de adelante y
   la tapa de paneles aislados, sin los dos de en medio
   ==================================================================== */
box("stand.pad", [BH.pl.x0, BH.pl.y0, 0], [BH.pl.x1, BH.pl.y1, BH.zPl], { tone: "mid" }, { r: 6, steps: 2, bevel: 0.6, cls: "bh-conc", ground: true });
{
  // el fondo: 112 mm de aislamiento bajo la lámina de 8 mm; se ve su canto en el lugar de la pared que se quitó
  const zP = ZF - BH.tw;
  const extra = capa([[xi0 + 2, yo1 + 0.4, BH.zPl + 2], [xi1 - 2, yo1 + 0.4, BH.zPl + 2], [xi1 - 2, yo1 + 0.4, zP], [xi0 + 2, yo1 + 0.4, zP]], YD);
  box("floor", [xi0, yi0, BH.zPl], [xi1, yo1, ZF], { tone: "mid" }, { owner: "tank", cls: "bh-steel", extra });
}
// las costuras soldadas de la lámina de adentro, en el costado de atrás
{
  const seams = [-1550, 0, 1550, xi1 - 0.5].map((x) => path3([[x, yi0 + 0.5, ZF], [x, yi0 + 0.5, zR]])).join("") + path3([[xi0, yi0 + 0.5, 1650], [xi1 - 0.5, yi0 + 0.5, 1650]]);
  box("wall.back", [xi0, yo0, BH.zPl], [xi1, yi0, zR], { tone: "mid" }, { owner: "tank", cls: "bh-steel", extra: Ln(seams, { tone: "faint" }) });
}
{
  // el extremo de −x: se ve la cara de adentro y, adelante, el canto con sus capas (forro, poliuretano, lámina)
  const ext = capa([[xo0 + 2, yo1 + 0.4, BH.zPl + 2], [xi0 - BH.tw, yo1 + 0.4, BH.zPl + 2], [xi0 - BH.tw, yo1 + 0.4, zR - 2], [xo0 + 2, yo1 + 0.4, zR - 2]], YD) +
    Ln(path3([[xi0 + 0.5, yi0, 1650], [xi0 + 0.5, yo1, 1650]]) + path3([[xi0 + 0.5, 0, ZF], [xi0 + 0.5, 0, zR]]), { tone: "faint" });
  box("wall.left", [xo0, yo0, BH.zPl], [xi0, yo1, zR], { tone: "mid" }, { owner: "tank", cls: "bh-steel", extra: ext });
}
{
  // el extremo de +x, entero: el forro con sus traslapos y, adelante, el canto con sus capas; la placa de datos
  const ext = capa([[xi1 + BH.tw, yo1 + 0.4, BH.zPl + 2], [xo1 - 2, yo1 + 0.4, BH.zPl + 2], [xo1 - 2, yo1 + 0.4, zR - 2], [xi1 + BH.tw, yo1 + 0.4, zR - 2]], YD) +
    [-900, 0, 900].map((y) => seamV(xo1 + 0.5, y, BH.zPl, zR, "y")).join("") + Ln(path3([[xo1 + 0.5, yo0, 1600], [xo1 + 0.5, yo1, 1600]]), { tone: "faint" });
  box("wall.right", [xi1, yo0, BH.zPl], [xo1, yo1, zR], { tone: "mid" }, { owner: "tank", cls: "bh-jk", extra: ext });
  const yp0 = -1360, yp1 = -1100, zp0 = 1840, zp1 = 1980;
  const rules = Ln([0.3, 0.5, 0.7].map((f) => path3([[xo1 + 3.3, yp1 - 30, zp0 + (zp1 - zp0) * f], [xo1 + 3.3, yp0 + 30, zp0 + (zp1 - zp0) * f]])).join(""), { tone: "lo", free: true });
  box("plate", [xo1, yp0, zp0], [xo1 + 3, yp1, zp1], { tone: "mid" }, { owner: "tank", cls: "bh-jk", r: 3, extra: rules + Dots([[yp0 + 12, zp0 + 12], [yp1 - 12, zp0 + 12], [yp1 - 12, zp1 - 12], [yp0 + 12, zp1 - 12]].map(([y, z]) => at([xo1 + 3.3, y, z])), { size: 0.5 }) });
  ANCH.TANQUE = [xo1, -300, 1250];
}
// el ángulo del borde de la pared que se quitó, de extremo a extremo, que carga la tapa
fp("rim.front", { o: [0, 0, 0], a: XD, u: YD, v: ZD3 }, [[yo1 - 50, zR - 5], [yo1 - 5, zR - 5], [yo1 - 5, zR - 50], [yo1, zR - 50], [yo1, zR], [yo1 - 50, zR]], xi0, xi1, { tone: "mid" }, { owner: "tank", cls: "bh-steel" });
// la tapa: paneles de 100 mm, de forro de lámina con poliuretano adentro; faltan los dos de en medio
{
  const J = BH.covX, panels = [[xo0, J[0]], [J[2], J[3]], [J[3], J[4]]];
  panels.forEach(([x0, x1], i) => {
    let extra = capa([[x0 + 2, yo1 + 0.4, zR + 1.5], [x1 - 2, yo1 + 0.4, zR + 1.5], [x1 - 2, yo1 + 0.4, zC1 - 1.5], [x0 + 2, yo1 + 0.4, zC1 - 1.5]], YD);
    if (i === 0) extra += capa([[x1 + 0.4, yo0 + 2, zR + 1.5], [x1 + 0.4, yo1 - 2, zR + 1.5], [x1 + 0.4, yo1 - 2, zC1 - 1.5], [x1 + 0.4, yo0 + 2, zC1 - 1.5]], XD);
    // las dos asas de cada panel
    const xm = (x0 + x1) / 2;
    const handles = [-900, 900].map((y) => path3([[xm - 90, y, zC1 + 0.3], [xm - 90, y, zC1 + 34], [xm + 90, y, zC1 + 34], [xm + 90, y, zC1 + 0.3]])).join("");
    box(`cover${i}`, [x0, yo0, zR], [x1, yo1, zC1], { tone: "mid" }, { owner: "cover", cls: "bh-panel", extra: extra + Ln(handles, { tone: "mid" }) + Dots([-900, 900].flatMap((y) => [at([xm - 90, y, zC1 + 0.3]), at([xm + 90, y, zC1 + 0.3])]), { size: 0.6 }) });
  });
  ANCH.TAPA = [(J[2] + J[3]) / 2 - 200, yo1, (zR + zC1) / 2];
}

/* ====================================================================
   2 · el haz: los perfiles del fondo y las pletinas que lo cargan, los 20 circuitos con su hielo, el tramo del
   circuito de adelante sin hielo con su pletina, y los dos cabezales sobre el agua con sus tramos de tubo
   ==================================================================== */
// los perfiles del fondo, a lo ancho, en las cuatro estaciones
BH.stations.forEach((xs, i) => box(`sup.ch${i}`, [xs - 25, yi0 + 100, ZF], [xs + 25, 1300, ZF + 80], { tone: "mid" }, { owner: "coil", cls: "bh-gal", r: 2 }));
const zLeg0 = ZF + 80, zLeg1 = zbP - RI;
const jF = CO.nc - 1, yF = GEO.yCirc(jF);
const [xw0, xw1] = BH.win, xsW = BH.stations.find((xs) => xs > xw0 && xs < xw1);
// las pletinas de cada circuito bajo el paso de abajo (las de adentro del hielo no se ven); una pieza por circuito
for (let j = 0; j < CO.nc; j++) {
  const y = GEO.yCirc(j);
  let svg = "";
  const shapes = [];
  for (const xs of BH.stations) {
    if (j === jF && xs === xsW) continue;
    const plan = { x: xs - 30, y: y - 4, w: 60, d: 8, r: 0.4 };
    svg += S(k.slabOf(plan, zLeg0, zLeg1 - zLeg0, P, 2, 0), { tone: "mid" });
    shapes.push(record(A.slab(plan, zLeg0, zLeg1 - zLeg0, { name: `legs${j}`, owner: "coil" }, 2)));
  }
  put(`legs${j}`, [0, y, (zLeg0 + zLeg1) / 2], `<g class="bh-gal">${svg}</g>`, shapes);
  if (j === jF) ANCH.SOPORTE = [BH.stations[1], y + 4, zLeg0 + 30];
}
// los tramos de un trazo donde f cruza unos valores, y los tramos con la misma clase en su punto medio
function cutAt(pts, f, values) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], fa = f(a), fb = f(b);
    const ts = values.map((c) => (c - fa) / (fb - fa)).filter((t) => t > 1e-9 && t < 1 - 1e-9).sort((p, q) => p - q);
    for (const t of ts) out.push(G.lerp3(a, b, t));
    out.push(b);
  }
  return out;
}
function groupBy(pts, cls) {
  const runs = [];
  let cur = null;
  for (let i = 1; i < pts.length; i++) {
    const c = cls(G.lerp3(pts[i - 1], pts[i], 0.5));
    if (!cur || cur.c !== c) { cur = { c, pts: [pts[i - 1]] }; runs.push(cur); }
    cur.pts.push(pts[i]);
  }
  return runs;
}
// el trazo de un circuito: del cabezal del vapor baja a la curva de +x del paso de arriba, recorre los 18 pasos en
// zigzag y, del paso de abajo, sigue a la bajante, que sube al cabezal del líquido
const zVb = HD.zV - Math.sqrt(NVH.ro ** 2 - CO.ro ** 2), zLb = HD.zL - Math.sqrt(NLH.ro ** 2 - CO.ro ** 2);
function route(y) {
  const pts = [[xa, y, zVb], [xa, y, zt]];
  for (let i = 0; i < CO.n; i++) {
    const last = i === CO.n - 1, xe = i % 2 === 0 ? xb : last ? xD : xa;
    pts.push([xe, y, GEO.zPass(i)]);
    if (!last) pts.push([xe, y, GEO.zPass(i + 1)]);
  }
  pts.push([xD, y, zLb]);
  return G.fillet(pts, CO.R, 8);
}
const zIce = zW - 5;                                           // el hielo llega hasta poco bajo la superficie
// las piezas de tubo de un conjunto de trazos, en un solo trazo por clase (como el haz del condensador)
function tubeGroup(runs, r, caps = true) {
  const parts = runs.flatMap((pts, ri) => {
    const cr = Array.isArray(caps) ? caps[ri] : [caps, caps];
    // los tramos largos (rectos) y los cortos (las curvas), cada uno con su paso de muestreo
    const segs = [];
    let cur = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const L = G.len3(G.sub3(pts[i], pts[i - 1]));
      if (L > 60) { if (cur.length > 1) segs.push({ arc: true, pts: cur }); segs.push({ arc: false, pts: [pts[i - 1], pts[i]] }); cur = [pts[i]]; }
      else cur.push(pts[i]);
    }
    if (cur.length > 1) segs.push({ arc: true, pts: cur });
    return segs.map((s, q) => tubePieces(s.pts, r, P, { maxLength: 1e6, spacing: s.arc ? 12 : 5000, caps: [cr[0] && q === 0, cr[1] && q === segs.length - 1] })).flat();
  });
  const cat = (key) => parts.map((q) => q[key]).join("");
  return `<g class="tb"><path class="tb-body" d="${cat("body")}"/><path class="tb-shine" d="${cat("shine")}"/><path class="tb-shade" d="${cat("shade")}"/><path class="iso-line tb-edge" data-tone="mid" d="${cat("edges")}"/></g>`;
}
{
  for (let j = 0; j < CO.nc; j++) {
    const y = GEO.yCirc(j), dense = route(y);
    const wet = groupBy(cutAt(dense, (p) => p[2], [zIce]), (m) => (m[2] < zIce ? "w" : "a")).filter((r) => r.c === "w").map((r) => r.pts);
    if (j !== jF) {
      /* de los circuitos de atrás solo se dibuja lo que puede verse: los dos pasos de arriba, el extremo de +x (las
         curvas, el tubo del vapor y la bajante, que asoman entre el circuito de adelante y la pared) y, en el que va
         detrás del tramo abierto, ese tramo; lo demás lo tapa el circuito de adelante */
      const w0 = wet[0], first = w0[0], last = w0[w0.length - 1];
      const keep = (m) => m[2] > GEO.zPass(2) + 20 || m[0] > CO.xR - 150 || (j === jF - 1 && m[0] > xw0 - 120 && m[0] < xw1 + 120);
      const runs = groupBy(cutAt(w0, (p) => p[0], [CO.xR - 150, xw0 - 120, xw1 + 120]), (m) => (keep(m) ? "k" : "d")).filter((r) => r.c === "k").map((r) => r.pts);
      const capsOf = (pts) => [pts[0] === first, pts[pts.length - 1] === last];
      // se registra el circuito entero, como es: lo que no se dibuja lo tapa el de adelante
      put(`ice${j}`, [0, y, (zt + zbP) / 2], `<g class="bh-ice">${tubeGroup(runs, RI, runs.map(capsOf))}</g>`, [record(A.tube(w0, RI, { name: `ice${j}`, owner: "coil" }))]);
      continue;
    }
    // el circuito de adelante: el hielo a cada lado del tramo abierto y, en él, el tubo desnudo
    const runs = groupBy(cutAt(wet[0], (p) => p[0], [xw0, xw1]), (m) => (m[0] > xw0 && m[0] < xw1 ? "win" : m[0] <= xw0 ? "L" : "R"));
    const L = runs.filter((r) => r.c === "L").map((r) => r.pts), R = runs.filter((r) => r.c === "R").map((r) => r.pts), Wn = runs.filter((r) => r.c === "win").map((r) => r.pts);
    // en la cara del hielo que mira al lector, el anillo cortado: hielo afuera, el tubo adentro
    let rings = "";
    for (let i = 0; i < CO.n; i++) {
      const zc = GEO.zPass(i), circ = (r) => Array.from({ length: 48 }, (_, q) => { const t = (q / 48) * TAU; return [xw0 + 0.3, y + r * Math.cos(t), zc + r * Math.sin(t)]; });
      rings += flatFace(circ(RI), XD, "bh-ice-cut", [circ(CO.ro).reverse()]) + Ln(path3(circ(RI), true) + path3(circ(CO.ro), true), { tone: "mid" });
    }
    put("ice.front.L", [(xb + xw0) / 2, y, (zt + zbP) / 2], `<g class="bh-ice">${tubeGroup(L, RI)}</g>` + rings, L.map((pts) => record(A.tube(pts, RI, { name: "ice.front.L", owner: "coil" }))));
    put("ice.front.R", [(xw1 + xD) / 2, y, (zt + zbP) / 2], `<g class="bh-ice">${tubeGroup(R, RI)}</g>`, R.map((pts) => record(A.tube(pts, RI, { name: "ice.front.R", owner: "coil" }))));
    put("win.tubes", [(xw0 + xw1) / 2, y, (zt + zbP) / 2], `<g class="bh-tube">${tubeGroup(Wn, CO.ro, false)}</g>`, Wn.map((pts) => record(A.tube(pts, CO.ro, { name: "win.tubes", owner: "coil" }))));
    // la pletina del tramo abierto: del perfil del fondo a 30 mm sobre el paso de arriba, con los pasos que la cruzan
    const cut = Wn.map((pts) => A.tube([[xsW - 40, y, pts[0][2]], [xsW + 40, y, pts[0][2]]], CO.ro + 0.05));
    const plan = { x: xsW - 30, y: y - 4, w: 60, d: 8, r: 0.4 };
    put("win.plate", [xsW, y, (zLeg0 + zt) / 2], `<g class="bh-gal">${S(k.slabOf(plan, zLeg0, zt + 30 - zLeg0, P, 2, 0), { tone: "mid" })}</g>`, [record(A.slab(plan, zLeg0, zt + 30 - zLeg0, { name: "win.plate", owner: "coil", cut }, 2))]);
    ANCH.HIELO = [xw0 + 0.3, y + RI * 0.7, GEO.zPass(5) + RI * 0.7];
    ANCH.TUBO = [(xw0 + xsW) / 2 - 40, y + CO.ro, GEO.zPass(8)];
    ANCH.PLETINA = [xsW, y + 4, GEO.zPass(12) + 55];
    ANCH.HAZ = [-1500, y + RI * 0.7, GEO.zPass(3)];
    ANCH.CURVA = [xb - RI * 0.8, y, (GEO.zPass(6) + GEO.zPass(7)) / 2];
    ANCH.BAJANTE = [xD, y + RI * 0.7, 1500];
  }
}
// los cabezales, sobre el agua: el del vapor (salida de la mezcla) y el del líquido (entrada), con sus tapas
const yH0 = GEO.yCirc(0) - HD.over, yH1 = GEO.yCirc(jF) + HD.over;
disc("hdr.vap", FYL(xa, HD.zV), yH0, yH1, NVH.ro, { tone: "mid" }, { owner: "hdr", cls: "bh-tube" });
disc("hdr.liq", FYL(xD, HD.zL), yH0, yH1, NLH.ro, { tone: "mid" }, { owner: "hdr", cls: "bh-tube" });
[["hdr.vap", xa, HD.zV, NVH], ["hdr.liq", xD, HD.zL, NLH]].forEach(([nm, x, z, d]) => {
  disc(nm + ".cap0", FYL(x, z), yH0 - 10, yH0, d.ro + 1.5, { tone: "mid" }, { owner: "hdr", cls: "bh-tube" });
  disc(nm + ".cap1", FYL(x, z), yH1, yH1 + 10, d.ro + 1.5, { tone: "mid" }, { owner: "hdr", cls: "bh-tube" });
});
ANCH.CAB_VAPOR = [xa, yH1 - 40, HD.zV + NVH.ro * 0.8];
ANCH.CAB_LIQUIDO = [xD, yH1 - 20, HD.zL - NLH.ro * 0.4];
// los tramos de cada circuito sobre el agua, hasta su cabezal
for (let j = 0; j < CO.nc; j++) {
  const y = GEO.yCirc(j);
  saddle(`stub.v${j}`, { o: [xa, y, HD.zV], a: [0, 0, -1], u: XD, v: YD }, CO.ro, (t) => G.saddleStart(NVH.ro, CO.ro, t), HD.zV - zIce, { tone: "mid" }, { owner: "hdr", cls: "bh-tube", hosts: [A.disc(FYL(xa, HD.zV), yH0, yH1, NVH.ro)] });
  saddle(`stub.l${j}`, { o: [xD, y, HD.zL], a: [0, 0, -1], u: XD, v: YD }, CO.ro, (t) => G.saddleStart(NLH.ro, CO.ro, t), HD.zL - zIce, { tone: "mid" }, { owner: "hdr", cls: "bh-tube", hosts: [A.disc(FYL(xD, HD.zL), yH0, yH1, NLH.ro)] });
}

/* ====================================================================
   3 · el aire: la tubería del soplador entra por el extremo de +x sobre el agua, baja junto a la pared y sigue por el
   fondo en el pasillo de adelante, perforada; los ramales cruzan bajo el haz. Afuera, el soplador con sus silenciadores
   ==================================================================== */
const zA = ZF + NA.ro;                                           // el eje de la tubería del fondo, apoyada en él
{
  // una sola tubería, partida en la superficie del agua (lo de arriba va delante de ella, lo de abajo detrás de la cara
  // del agua); descansa en el fondo del tanque
  const rt = G.fillet([[xi1, AIR.y, AIR.zIn], [AIR.xDown, AIR.y, AIR.zIn], [AIR.xDown, AIR.y, zA], [AIR.xEnd, AIR.y, zA]], 70, 8);
  let acc = 0, brk = 0;
  for (let i = 1; i < rt.length; i++) {
    const a = rt[i - 1], b = rt[i], L = G.len3(G.sub3(b, a));
    if (!brk && a[2] >= zW && b[2] < zW) brk = acc + (L * (a[2] - zW)) / (a[2] - b[2]);
    acc += L;
  }
  R_.route("air.main", rt.map((q) => q.map((v) => v * U)), NA.ro * U, { owner: "air", touch: ["floor"], piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(rt, NA.ro, P, { maxLength: 420, spacing: Math.max(4, Math.min(20, NA.ro * 0.5)), breaks: [brk] }).forEach((part, index) => {
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(tubeSvg(part, { tone: "mid" }), "bh-pvc"), move: [0, 0, 0], name: `air.main:${index}`, route: "air.main", chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
  disc("air.cap", FXL(AIR.y, zA), AIR.xEnd - 12, AIR.xEnd, NA.ro + 3, { tone: "mid" }, { owner: "air.cap", cls: "bh-pvc" });
  ANCH.AIRE = [-2200, AIR.y + NA.ro * 0.6, zA + NA.ro * 0.6];
  // los ramales, a lo ancho bajo el haz, con su tapa al fondo
  AIR.laterals.forEach((xl, i) => {
    const yEnd = yi0 + 70;
    saddle(`air.lat${i}`, { o: [xl, AIR.y, zA], a: [0, -1, 0], u: ZD3, v: XD }, NAL.ro, (t) => G.saddleStart(NA.ro, NAL.ro, t), AIR.y - yEnd, { tone: "mid" }, { owner: "air", cls: "bh-pvc", hosts: [A.disc(FXL(AIR.y, zA), AIR.xEnd, AIR.xDown, NA.ro)] });
    disc(`air.latcap${i}`, FYL(xl, zA), yEnd - 10, yEnd, NAL.ro + 2.5, { tone: "mid" }, { owner: "air", cls: "bh-pvc" });
  });
  ANCH.RAMAL = [AIR.laterals[1], 600, zA + NAL.ro];
}
{
  // el soplador de canal lateral: la carcasa redonda con sus aletas, el motor adelante y la base; arriba, la entrada
  // con su filtro y su silenciador, y la salida con el suyo
  const own = "blower", xB = BL.x, yB = AIR.y, zB = 330, Rb = 240;
  box("blower.base", [xB - 330, yB - 230, 0], [xB + 330, yB + 420, 40], { tone: "mid" }, { owner: own, cls: "bh-paint", r: 4 });
  const Fb = FYL(xB, zB);
  let fins = "";
  // las aletas de la cara, del pie de la brida del motor al borde de la carcasa
  for (let q = 0; q < 36; q++) { const t = (q / 36) * TAU; fins += path3([[xB + 140.4 * Math.cos(t), yB + 60.4, zB + 140.4 * Math.sin(t)], [xB + (Rb - 0.6) * Math.cos(t), yB + 60.4, zB + (Rb - 0.6) * Math.sin(t)]]); }
  fins += path3(Array.from({ length: 73 }, (_, q) => { const t = (q / 72) * TAU; return [xB + 140.4 * Math.cos(t), yB + 60.4, zB + 140.4 * Math.sin(t)]; }));
  const casing = disc("blower.casing", Fb, yB - 60, yB + 60, Rb, { tone: "mid" }, { owner: own, cls: "bh-blower", extra: Ln(fins, { tone: "faint" }) });
  box("blower.feet", [xB - 180, yB - 50, 40], [xB + 180, yB + 50, zB - Rb + 30], { tone: "mid" }, { owner: own, cls: "bh-blower", r: 2 });
  disc("blower.flange", Fb, yB + 60, yB + 80, 140, { tone: "mid" }, { owner: own, cls: "bh-motor" });
  let mf = "";
  for (let q = 0; q < 28; q++) { const t = (q / 28) * TAU, n3 = [Math.cos(t), 0, Math.sin(t)]; if (G.dot3(n3, V3) > 0.12) mf += path3([[xB + 120.4 * Math.cos(t), yB + 90, zB + 120.4 * Math.sin(t)], [xB + 120.4 * Math.cos(t), yB + 330, zB + 120.4 * Math.sin(t)]]); }
  disc("blower.motor", Fb, yB + 80, yB + 340, 120, { tone: "mid" }, { owner: own, cls: "bh-motor", extra: Ln(mf, { tone: "faint" }) });
  disc("blower.cowl", Fb, yB + 340, yB + 395, 112, { tone: "mid" }, { owner: own, cls: "bh-motor", extra: Dots(G.dotsOf(Fb, yB + 395, 62, 10, P, { all: true }), { size: 0.5 }) });
  box("blower.mfoot", [xB - 110, yB + 120, 40], [xB + 110, yB + 300, zB - 120 + 3], { tone: "mid" }, { owner: own, cls: "bh-motor", r: 2 });
  fp("blower.tbox", { o: [xB, 0, zB], a: YD, u: XD, v: ZD3 }, rect(-50, 50, 119, 185), yB + 160, yB + 260, { tone: "mid" }, { owner: own, cls: "bh-motor" });
  // las dos bocas en lo alto de la carcasa, con sus silenciadores
  const ports = [[xB + 120, "in"], [xB - 120, "out"]];
  for (const [xp, nm] of ports) {
    const Fp = FZ(xp, yB, 0), dx = xp - xB;
    saddle(`blower.${nm}.neck`, Fp, 34, (t) => zB + Math.sqrt(Math.max(0, Rb * Rb - (dx + 34 * Math.cos(t)) ** 2)), zB + Rb + 30, { tone: "mid" }, { owner: own, cls: "bh-blower", hosts: [casing] });
    disc(`blower.${nm}.sil`, Fp, zB + Rb + 30, zB + Rb + 290, 62, { tone: "mid" }, { owner: own, cls: "bh-blower", extra: Ln(path3(arcPts(62.4, zB + Rb + 160, fS - TAU, fSL, 40, xp, yB)), { tone: "faint" }) });
  }
  // la entrada: el filtro, una copa más ancha con su tapa y sus ranuras
  const zf0 = zB + Rb + 290;
  disc("blower.filter", FZ(xB + 120, yB, 0), zf0, zf0 + 110, 92, { tone: "mid" }, { owner: own, cls: "bh-motor", extra: Ln(Array.from({ length: 22 }, (_, q) => (q / 22) * TAU).filter((t) => Math.cos(t - Math.atan2(HV[1], HV[0])) > 0.2).map((t) => path3([[xB + 120 + 92.4 * Math.cos(t), yB + 92.4 * Math.sin(t), zf0 + 20], [xB + 120 + 92.4 * Math.cos(t), yB + 92.4 * Math.sin(t), zf0 + 90]])).join(""), { tone: "lo" }) });
  disc("blower.filtercap", FZ(xB + 120, yB, 0), zf0 + 110, zf0 + 124, 98, { tone: "mid" }, { owner: own, cls: "bh-motor" });
  ANCH.SOPLADOR = G.add3([xB, yB, zB], G.mul3(HV, Rb * 0.6));
  ANCH.FILTRO = [xB + 120 + 92 * HV[0], yB + 92 * HV[1], zf0 + 60];
  // la descarga: sube, va hacia la pared, sube por ella y entra sobre el agua; con su retención y su manómetro
  const xo = xB - 120, zs = zB + Rb + 290, NAo = NA;
  disc("blower.out.fl", FZ(xo, yB, 0), zs, zs + NAo.ft, NAo.fl, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  const xr = xo1 + 90;
  // la retención: un cuerpo bridado en el tramo que sube junto a la pared; la tubería llega a sus dos bridas
  const zc0 = 1500, Fc = FZ(xr, yB, 0);
  tubeItems("air.out", G.fillet([[xo, yB, zs + NAo.ft], [xo, yB, 1180], [xr, yB, 1180], [xr, yB, zc0]], 80, 8), NAo.ro, { cls: "bh-pipe", owner: "air.out", maxLength: 420 });
  tubeItems("air.out2", G.fillet([[xr, yB, zc0 + 150 + NAo.ft], [xr, yB, AIR.zIn], [xo1, yB, AIR.zIn]], 80, 8), NAo.ro, { cls: "bh-pipe", owner: "air.out", maxLength: 420 });
  disc("air.check.fl0", Fc, zc0, zc0 + NAo.ft, NAo.fl, { tone: "mid" }, { owner: "air.check", cls: "bh-cast", extra: Dots(G.dotsOf(Fc, zc0 + NAo.ft, NAo.bc, NAo.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  turned("air.check.body", Fc, [[zc0 + NAo.ft, 52], [zc0 + 40, 66, 1], [zc0 + 110, 66, 1], [zc0 + 150, 48]], { tone: "mid" }, { owner: "air.check", cls: "bh-cast" });
  disc("air.check.fl1", Fc, zc0 + 150, zc0 + 150 + NAo.ft, NAo.fl, { tone: "mid" }, { owner: "air.check", cls: "bh-cast" });
  ANCH.RETENCION = [xr + 66 * HV[0], yB + 66 * HV[1], zc0 + 80];
}

/* ====================================================================
   4 · el agua: el distribuidor del retorno en el extremo de −x, con su bajante desde la tapa y su línea; la salida
   del agua helada por el extremo de +x, con su válvula; el visor de nivel
   ==================================================================== */
const DI = BH.dist, NDI = DN[80], NDR = DN[65];
{
  disc("dist", FYL(DI.x, DI.z), yi0 + 120, yi1 - 150, NDI.ro, { tone: "mid" }, {
    owner: "dist", cls: "bh-pipe",
    extra: Dots(Array.from({ length: 16 }, (_, q) => yi0 + 220 + q * ((yi1 - yi0 - 470) / 15)).map((y) => at([DI.x + NDI.ro * 0.97, y, DI.z + NDI.ro * 0.25])), { size: 0.7, tone: "lo" }),
  });
  disc("dist.cap0", FYL(DI.x, DI.z), yi0 + 108, yi0 + 120, NDI.ro + 2, { tone: "mid" }, { owner: "dist", cls: "bh-pipe" });
  disc("dist.cap1", FYL(DI.x, DI.z), yi1 - 150, yi1 - 138, NDI.ro + 2, { tone: "mid" }, { owner: "dist", cls: "bh-pipe" });
  saddle("dist.drop", { o: [DI.x, DI.yDrop, DI.z], a: ZD3, u: XD, v: YD }, NDR.ro, (t) => G.saddleStart(NDI.ro, NDR.ro, t), zW - DI.z, { tone: "mid" }, { owner: "dist", cls: "bh-pipe", hosts: [A.disc(FYL(DI.x, DI.z), yi0 + 120, yi1 - 150, NDI.ro)] });
  disc("dist.dropair", FZ(DI.x, DI.yDrop, 0), zW, zR, NDR.ro, { tone: "mid" }, { owner: "dist", cls: "bh-pipe" });
  ANCH.DISTRIBUIDOR = [DI.x + NDI.ro * 0.7, 500, DI.z + NDI.ro * 0.7];
  // sobre la tapa: el tramo que sube, la curva y la línea del retorno, que termina en un par de bridas
  const zl = 3300;
  const rt = G.fillet([[DI.x, DI.yDrop, zC1], [DI.x, DI.yDrop, zl], [-3560, DI.yDrop, zl]], 110, 10);
  tubeItems("ret.line", rt, NDR.ro, { cls: "bh-pipe", owner: "ret.pipe", maxLength: 300 });
  ANCH.RETORNO_END = lineEnd("ret.end", { o: [0, DI.yDrop, zl], a: [-1, 0, 0], u: [0, -1, 0], v: ZD3 }, 3560, NDR, "ret");
  ANCH.RETORNO = [-3300, DI.yDrop, zl + NDR.ro];
}
const OU = BH.out, NO = DN[100];
{
  // adentro, la boca acampanada de la salida
  const F = FXL(OU.y, OU.z);
  turned("out.bell", F, [[xi1 - 90, 92], [xi1 - 82, 76, 1], [xi1 - 64, 66, 1], [xi1 - 36, 60, 1], [xi1, NO.ro]], { tone: "mid" }, { owner: "out", cls: "bh-pipe" });
  // afuera: el tramo, la brida, la válvula de mariposa entre bridas, la línea y su par de bridas
  disc("out.stub", F, xo1, xo1 + 70, NO.ro, { tone: "mid" }, { owner: "out", cls: "bh-pipe" });
  const s1 = xo1 + 70;
  disc("out.fl0", F, s1, s1 + NO.ft, NO.fl, { tone: "mid" }, { owner: "out", cls: "bh-cast", extra: Dots(G.dotsOf(F, s1 + NO.ft, NO.bc, NO.nb, P, { all: true, phase: PI / 8 }), { size: 0.45 }) });
  const sv = s1 + NO.ft, Lw = 52;
  disc("out.valve", F, sv, sv + Lw, NO.fl - 14, { tone: "mid" }, { owner: "out.valve", cls: "bh-cast" });
  const vc = [sv + Lw / 2, OU.y, OU.z];
  disc("out.valve.neck", FZ(vc[0], OU.y, 0), OU.z + NO.fl - 16, OU.z + NO.fl + 70, 18, { tone: "mid" }, { owner: "out.valve", cls: "bh-cast" });
  disc("out.valve.op", FZ(vc[0], OU.y, 0), OU.z + NO.fl + 70, OU.z + NO.fl + 92, 34, { tone: "mid" }, { owner: "out.valve", cls: "bh-cast" });
  fp("out.valve.lever", { o: [0, 0, 0], a: XD, u: YD, v: ZD3 }, rect(OU.y - 10, OU.y + 10, OU.z + NO.fl + 92, OU.z + NO.fl + 100), vc[0] - 20, vc[0] + 230, { tone: "mid" }, { owner: "out.valve", cls: "bh-lever" });
  disc("out.fl1", F, sv + Lw, sv + Lw + NO.ft, NO.fl, { tone: "mid" }, { owner: "out", cls: "bh-cast" });
  const sp = sv + Lw + NO.ft, sE = 4060;
  disc("out.pipe", F, sp, sE, NO.ro, { tone: "mid" }, { owner: "out", cls: "bh-pipe" });
  ANCH.SALIDA_END = lineEnd("out.end", F, sE, NO, "out");
  ANCH.SALIDA = G.pointOf(F, 3700, NO.ro, PI / 2);
  ANCH.VALV_SALIDA = [vc[0], OU.y, OU.z + NO.fl + 96];
}
{
  // el visor de nivel: una columna con su vidrio y dos tomas a la pared, una bajo el agua y otra sobre ella
  const GA = BH.gauge, xg = xo1 + 75, rg = 22, Fg = FZ(xg, GA.y, 0);
  const hv = Math.atan2(HV[1], HV[0]);
  const strip = (z0, z1) => { const a0 = hv - 0.42, a1 = hv + 0.42, pts = []; for (let q = 0; q <= 8; q++) { const t = a0 + ((a1 - a0) * q) / 8; pts.push([xg + (rg + 0.4) * Math.cos(t), GA.y + (rg + 0.4) * Math.sin(t), z0]); } for (let q = 8; q >= 0; q--) { const t = a0 + ((a1 - a0) * q) / 8; pts.push([xg + (rg + 0.4) * Math.cos(t), GA.y + (rg + 0.4) * Math.sin(t), z1]); } return pts; };
  const glass = `<path class="bh-visor-agua" d="${pth1(strip(GA.z0 + 60, zW).map(pr))}"/><path class="bh-visor-aire" d="${pth1(strip(zW, GA.z1 - 60).map(pr))}"/>` + Ln(path3(strip(GA.z0 + 60, GA.z1 - 60), true), { tone: "mid" });
  disc("gauge.col", Fg, GA.z0 - 40, GA.z1 + 40, rg, { tone: "mid" }, { owner: "gauge", cls: "bh-cast", extra: glass });
  disc("gauge.cap0", Fg, GA.z0 - 56, GA.z0 - 40, rg + 4, { tone: "mid" }, { owner: "gauge", cls: "bh-cast" });
  disc("gauge.cap1", Fg, GA.z1 + 40, GA.z1 + 56, rg + 4, { tone: "mid" }, { owner: "gauge", cls: "bh-cast" });
  for (const [z, nm] of [[GA.z0, "lo"], [GA.z1, "hi"]]) saddle(`gauge.${nm}`, { o: [xg, GA.y, z], a: [-1, 0, 0], u: YD, v: ZD3 }, DN[15].ro, (t) => G.saddleStart(rg, DN[15].ro, t), xg - xo1, { tone: "mid" }, { owner: "gauge", cls: "bh-cast", hosts: [A.disc(Fg, GA.z0 - 40, GA.z1 + 40, rg)] });
  ANCH.VISOR = [xg + rg * HV[0], GA.y + rg * HV[1], 1900];
}

/* ====================================================================
   5 · el agua del tanque, cortada en el plano de la pared que se quitó, translúcida, con los anillos de las burbujas
   que revientan en la superficie; las columnas de burbujas del pasillo de adelante
   ==================================================================== */
{
  const yw = yFL - 2;
  const sup = [[xi0, yi0, zW], [xi1, yi0, zW], [xi1, yw, zW], [xi0, yw, zW]];
  const face = [[xi0, yw, ZF], [xi1, yw, ZF], [xi1, yw, zW], [xi0, yw, zW]];
  // los anillos de las burbujas que revientan, en los pasillos entre circuitos, donde falta la tapa y adelante
  seed = 11;
  let rings = "";
  for (let q = 0; q < 70; q++) {
    const open = q < 52, x = open ? BH.covX[0] + 60 + rnd() * (BH.covX[2] - BH.covX[0] - 120) : xi0 + 200 + rnd() * (xi1 - xi0 - 400);
    const kk = Math.round(-10 + rnd() * 20), y = open ? kk * CO.py : yi1 - 70 - rnd() * 40, r = 14 + rnd() * 26;
    rings += path3(Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * TAU; return [x + r * Math.cos(t), y + r * 0.8 * Math.sin(t), zW + 0.5]; }), true);
  }
  const svg = `<g class="bh-agua"><path class="bh-agua-cara" d="${pth1(face.map(pr))}"/><path class="bh-agua-sup" d="${pth1(sup.map(pr))}"/>` +
    `<path class="bh-anillo" d="${rings}"/>` +
    Ln(path3([[xi0, yw, zW], [xi1, yw, zW]]) + path3([[xi0 + 0.5, yi0, zW], [xi0 + 0.5, yw, zW]]), { tone: "lo" }) + "</g>";
  put("water", [0, 0, (ZF + zW) / 2], svg, [A.box([xi0, yi0, ZF], [xi1, yw, zW])]);
  ANCH.AGUA = [-2600, yw, 900];
  ANCH.SUPERFICIE = [-1300, 260, zW];
}
{
  // las burbujas que suben por el pasillo de adelante desde los agujeros de la tubería del fondo (más grandes que las
  // reales: un esquema)
  seed = 23;
  const xs = Array.from({ length: 13 }, (_, i) => -2450 + 430 * i).filter((x) => AIR.laterals.every((xl) => Math.abs(x - xl) > 110) && Math.abs(x - BH.probe.x) > 110 && !(x > xw0 - 40 && x < xw1 + 40));
  xs.forEach((x0, i) => {
    let d = "";
    const z0 = zA + NA.ro, z1 = zW - 30;
    for (let m = 0; m < 17; m++) {
      const f = (m + rnd() * 0.6) / 17, z = z0 + 30 + f * (z1 - z0 - 30), r = 7 + 12 * f;
      const p = at([x0 + (rnd() - 0.5) * 70 * (0.3 + f), AIR.y + (rnd() - 0.5) * 50, z]);
      d += `<circle cx="${r10(p[0])}" cy="${r10(p[1])}" r="${r10(r * G.scaleOf(P))}"/>`;
    }
    const hole = Dots([at([x0, AIR.y, zA + NA.ro])], { size: 0.5, tone: "lo" });
    put(`bub${i}`, [x0, AIR.y, (z0 + z1) / 2], hole + `<g class="bh-burbuja">${d}</g>`, [A.disc(FZ(x0, AIR.y, 0), z0 + 2, z1, 46)]);
    if (i === 3) ANCH.BURBUJAS = [x0, AIR.y, 1700];
  });
}

/* ====================================================================
   6 · el control del espesor del hielo: un electrodo que baja por el pasillo de adelante hasta el segundo paso, con
   sus dos puntas frente al hielo, y la caja del control sobre la tapa
   ==================================================================== */
{
  const PB = BH.probe, own = "probe", zh = GEO.zPass(1), Fh = FYL(PB.x, zh);
  disc("probe.head", Fh, yF + RI + 40, PB.y + 22, 18, { tone: "mid" }, { owner: own, cls: "bh-pvc" });
  for (const dz of [-8, 8]) disc(`probe.pin${dz}`, FYL(PB.x, zh + dz), yF + RI + 14, yF + RI + 40, 2.6, { tone: "mid" }, { owner: own, cls: "bh-ss", n: 10 });
  disc("probe.rod", FZ(PB.x, PB.y, 0), zh + 18, zW, 8, { tone: "mid" }, { owner: own, cls: "bh-ss", n: 14 });
  disc("probe.rodair", FZ(PB.x, PB.y, 0), zW, zR, 8, { tone: "mid" }, { owner: own, cls: "bh-ss", n: 14 });
  disc("probe.gland", FZ(PB.x, PB.y, 0), zC1, zC1 + 24, 22, { tone: "mid" }, { owner: own, cls: "bh-cast", n: 18 });
  const rules = Ln([0.35, 0.55].map((f) => path3([[PB.x - 60, yo1 + 0.3 - 1, zC1 + 24 + 30 + 80 * f], [PB.x + 60, yo1 + 0.3 - 1, zC1 + 24 + 30 + 80 * f]])).join(""), { tone: "lo", free: true });
  box("probe.box", [PB.x - 90, PB.y - 120, zC1 + 24], [PB.x + 90, yo1 - 1.3, zC1 + 160], { tone: "mid" }, { owner: own, cls: "bh-paint", r: 6, steps: 2, bevel: 0.5, extra: rules });
  ANCH.ESPESOR = [PB.x, yo1 - 1, zC1 + 120];
  ANCH.ELECTRODO = [PB.x, yF + RI + 30, zh - 18];
}

/* ====================================================================
   7 · el separador de baja: las dos vigas sobre la tapa, las sillas, el recipiente aislado con sus bandas; la mezcla
   que vuelve del cabezal del vapor, la pierna de líquido al cabezal del líquido, la succión al tornillo, el líquido que
   llega del recibidor con su válvula de nivel, la válvula de seguridad y el manómetro
   ==================================================================== */
const L2 = DR.L / 2, NSU = DN[80], NRT = DN[80], NLL = DN[50], NFD = DN[25], INS = 50;
const FDr = { o: [xd, 0, zDc], a: YD, u: XD, v: ZD3 };
const drumHost = A.disc(FDr, -L2, L2, rD);
{
  [-1, 1].forEach((sg, i) => {
    const xb0 = xd + sg * DR.beamDx, { tf, tw } = { tf: 9, tw: 6 }, z0 = zBeam0, z1 = zBeam1;
    const I = [[-50, z0], [50, z0], [50, z0 + tf], [tw / 2, z0 + tf], [tw / 2, z1 - tf], [50, z1 - tf], [50, z1], [-50, z1], [-50, z1 - tf], [-tw / 2, z1 - tf], [-tw / 2, z0 + tf], [-50, z0 + tf]];
    fp(`beam${i}`, { o: [xb0, 0, 0], a: YD, u: XD, v: ZD3 }, I, yo0, yo1, { tone: "mid" }, { owner: "drum", cls: "bh-paint" });
  });
  ANCH.VIGA = [xd + DR.beamDx, yo1 - 200, zBeam1];
  // las sillas: base sobre las dos vigas y alma hasta el aislamiento
  const xs = DR.beamDx + 50;
  [-1, 1].forEach((sg, i) => {
    const ys = sg * DR.saddleY, arc = [];
    for (let q = 0; q <= 16; q++) { const x = 290 - (580 * q) / 16; arc.push([x, zDc - Math.sqrt(rD * rD - x * x)]); }
    const sec = [[-xs, zBeam1], [xs, zBeam1], [xs, zBeam1 + 14], [290, zBeam1 + 14], ...arc, [-290, zBeam1 + 14], [-xs, zBeam1 + 14]];
    fp(`saddle${i}`, { o: [xd, 0, 0], a: YD, u: XD, v: ZD3 }, sec, ys - 100, ys + 100, { tone: "mid" }, { owner: "drum", cls: "bh-paint" });
  });
  // el recipiente, con sus cabezas elípticas, todo aislado; bandas del forro
  const NH = 12, prof = [[-L2 - hD, 0]];
  for (let i = 1; i <= NH; i++) { const th = (i / NH) * (PI / 2); prof.push([-L2 - hD * Math.cos(th), rD * Math.sin(th), 1]); }
  for (let i = NH; i >= 1; i--) { const th = (i / NH) * (PI / 2); prof.push([L2 + hD * Math.cos(th), rD * Math.sin(th), 1]); }
  prof.push([L2 + hD, 0]);
  const bands = [-L2, -L2 / 2, 0, L2 / 2, L2].map((s) => G.arcOf(FDr, s, rD + 0.6, P)).join("");
  turned("drum", FDr, prof, { tone: "mid" }, { owner: "drum", cls: "bh-ins", extra: Ln(bands, { tone: "lo" }) });
  ANCH.SEPARADOR = G.add3([xd, -300, zDc], G.mul3(HV, rD));
}
{
  // la mezcla que vuelve: del cabezal del vapor sube a la tapa (desnuda) y de la tapa al separador (aislada)
  saddle("ret2.in", { o: [xa, 400, HD.zV], a: ZD3, u: XD, v: YD }, NRT.ro, (t) => G.saddleStart(NVH.ro, NRT.ro, t), zC1 - HD.zV, { tone: "mid" }, { owner: "hdr", cls: "bh-tube", hosts: [A.disc(FYL(xa, HD.zV), yH0, yH1, NVH.ro)] });
  saddle("ret2.out", { o: [xd, 400, zDc], a: [0, 0, -1], u: XD, v: YD }, NRT.ro + INS, (t) => G.saddleStart(rD, NRT.ro + INS, t), zDc - zC1, { tone: "mid" }, { owner: "drum", cls: "bh-ins", hosts: [drumHost] });
  ANCH.MEZCLA = [xd + (NRT.ro + INS) * HV[0], 400 + (NRT.ro + INS) * HV[1], (zC1 + zDc - rD) / 2];
  /* la pierna de líquido: baja del separador, aislada, a su válvula de corte; después de la válvula sigue desnuda, como
     los tramos sobre el agua, se corre en diagonal hasta encima del cabezal del líquido y baja a él */
  const yl = -400, zs0 = zDc - rD - 60;
  saddle("leg.top", { o: [xd, yl, zDc], a: [0, 0, -1], u: XD, v: YD }, NLL.ro + INS, (t) => G.saddleStart(rD, NLL.ro + INS, t), zDc - zs0, { tone: "mid" }, { owner: "drum", cls: "bh-ins", hosts: [drumHost] });
  const Fv = { o: [xd, yl, 0], a: [0, 0, -1], u: XD, v: YD };
  disc("leg.fl", Fv, -zs0, -zs0 + NLL.ft, NLL.fl, { tone: "mid" }, { owner: "leg", cls: "bh-cast" });
  const v = ballValve("leg.valve", Fv, -zs0 + NLL.ft, NLL, { owner: "leg", stem: [0, -1, 0], lever: 150 });
  disc("leg.fl2", Fv, v.s1, v.s1 + NLL.ft, NLL.fl, { tone: "mid" }, { owner: "leg", cls: "bh-cast" });
  const zb = -(v.s1 + NLL.ft), zTop = HD.zL + 160;
  saddle("leg.in", { o: [xD, yl, HD.zL], a: ZD3, u: XD, v: YD }, NLL.ro, (t) => G.saddleStart(NLH.ro, NLL.ro, t), zTop - HD.zL, { tone: "mid" }, { owner: "hdr", cls: "bh-tube", hosts: [A.disc(FYL(xD, HD.zL), yH0, yH1, NLH.ro)] });
  const zj = zb - 100;
  tubeItems("leg.pipe", G.fillet([[xd, yl, zb], [xd, yl, zj], [xD, yl, zj - 90], [xD, yl, zTop]], 70, 8), NLL.ro, { cls: "bh-tube", owner: "leg.pipe", maxLength: 110 });
  ANCH.PIERNA = [(xd + xD) / 2 + NLL.ro * HV[0], yl + NLL.ro * HV[1], zj - 45];
  ANCH.VALV_PIERNA = v.top;
}
{
  // la succión: sube del separador, aislada, y va hacia +x con su válvula de corte hasta el par de bridas
  const zs1 = zDc + rD + 260, zh = 4960, own = "suc", ri = NSU.ro + INS;
  saddle("suc.top", { o: [xd, 0, zDc], a: ZD3, u: XD, v: YD }, ri, (t) => G.saddleStart(rD, ri, t), zs1 - zDc, { tone: "mid" }, { owner: "drum", cls: "bh-ins", hosts: [drumHost] });
  const xv0 = 3520;
  const rt = G.fillet([[xd, 0, zs1], [xd, 0, zh], [xv0, 0, zh]], 220, 12);
  tubeItems("suc.ins", rt, ri, { cls: "bh-ins", owner: "drum", maxLength: 300, ends: [false, true] });
  const F = FXL(0, zh);
  disc("suc.fl", F, xv0, xv0 + NSU.ft, NSU.fl, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  const v = ballValve("suc.valve", F, xv0 + NSU.ft, NSU, { owner: own, lever: 190 });
  disc("suc.fl2", F, v.s1, v.s1 + NSU.ft, NSU.fl, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  disc("suc.pipe", F, v.s1 + NSU.ft, 4040, NSU.ro, { tone: "mid" }, { owner: own, cls: "bh-tube" });
  ANCH.SUCCION_END = lineEnd("suc.end", F, 4040, NSU, own);
  ANCH.VALV_SUCCION = v.top;
  ANCH.SUCCION = G.pointOf(F, 3300, ri, PI / 2);
}
{
  /* el líquido del recibidor: entra por arriba, entre la succión y el manómetro, sube a un codo y va hacia +x por la
     válvula de nivel (globo con su actuador) y la de corte */
  const own = "feed", d = NFD, yr = 350, zn = zDc + rD + 140, zf = zDc + rD + 320;
  saddle("feed.nozzle", { o: [xd, yr, zDc], a: ZD3, u: XD, v: YD }, d.ro + 4, (t) => G.saddleStart(rD, d.ro + 4, t), zn - zDc, { tone: "mid" }, { owner: "drum", cls: "bh-tube", hosts: [drumHost] });
  disc("feed.fl", FZ(xd, yr, 0), zn, zn + d.ft, d.fl, { tone: "mid" }, { owner: "drum", cls: "bh-cast" });
  const cE = [xd, yr, zf], RE = d.ro * 2.4, s0 = 3500, Lg = 184;
  ball("feed.elbow", cE, RE, { tone: "mid" }, { owner: "feed.elbow", cls: "bh-cast" });
  pipe("feed.p0", [[xd, yr, zn + d.ft], cE], d.ro, { cls: "bh-pipe", balls: [{ at: "end", c: cE, R: RE }], owner: "feed.pipe" });
  pipe("feed.p0b", [cE, [s0, yr, zf]], d.ro, { cls: "bh-pipe", balls: [{ at: "start", c: cE, R: RE }], owner: "feed.pipe" });
  const F = FXL(yr, zf);
  // la válvula de nivel: bridas, cuerpo, bonete, el yugo de dos columnas y el actuador de diafragma
  disc("feed.lv.fl0", F, s0, s0 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  turned("feed.lv.body", F, [[s0 + d.ft, 30], [s0 + 52, 46, 1], [s0 + Lg - 52, 46, 1], [s0 + Lg - d.ft, 30]], { tone: "mid" }, { owner: own, cls: "bh-cast" });
  disc("feed.lv.fl1", F, s0 + Lg - d.ft, s0 + Lg, d.fl, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  const xm = s0 + Lg / 2, Fu = FZ(xm, yr, 0);
  disc("feed.lv.bonnet", Fu, zf + 40, zf + 92, 26, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  disc("feed.lv.yoke0", FZ(xm - 20, yr, 0), zf + 92, zf + 196, 5, { tone: "mid" }, { owner: own, cls: "bh-ss", n: 10 });
  disc("feed.lv.yoke1", FZ(xm + 20, yr, 0), zf + 92, zf + 196, 5, { tone: "mid" }, { owner: own, cls: "bh-ss", n: 10 });
  turned("feed.lv.act", Fu, [[zf + 196, 20], [zf + 206, 92], [zf + 236, 96, 1], [zf + 262, 70, 1], [zf + 276, 18]], { tone: "mid" }, { owner: own, cls: "bh-paint" });
  const s1 = s0 + Lg;
  disc("feed.p1", F, s1, s1 + 70, d.ro, { tone: "mid" }, { owner: own, cls: "bh-pipe" });
  const v = ballValve("feed.valve", F, s1 + 70, d, { owner: own, lever: 120 });
  disc("feed.p2", F, v.s1, 4040, d.ro, { tone: "mid" }, { owner: own, cls: "bh-pipe" });
  ANCH.LIQUIDO_END = lineEnd("feed.end", F, 4040, d, own);
  ANCH.VALV_NIVEL = [xm, yr, zf + 262];
}
{
  // la válvula de seguridad, arriba hacia −y, con la descarga hacia −x, y el manómetro, hacia +y
  const ys = -L2 + 250, own = "psv";
  saddle("psv.neck", { o: [xd, ys, zDc], a: ZD3, u: XD, v: YD }, 20, (t) => G.saddleStart(rD, 20, t), rD + 70, { tone: "mid" }, { owner: "drum", cls: "bh-tube", hosts: [drumHost] });
  const Fp = FZ(xd, ys, 0), z0 = zDc + rD + 70;
  disc("psv.fl", Fp, z0, z0 + 14, 46, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  turned("psv.body", Fp, [[z0 + 14, 38], [z0 + 40, 48, 1], [z0 + 90, 40, 1], [z0 + 110, 30]], { tone: "mid" }, { owner: own, cls: "bh-cast" });
  turned("psv.bonnet", Fp, [[z0 + 110, 24], [z0 + 250, 18], [z0 + 268, 12]], { tone: "mid" }, { owner: own, cls: "bh-cast" });
  disc("psv.outlet", FXL(ys, z0 + 62), xd - 150, xd - 40, 22, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  disc("psv.outfl", FXL(ys, z0 + 62), xd - 162, xd - 150, 40, { tone: "mid" }, { owner: own, cls: "bh-cast" });
  ANCH.SEGURIDAD = [xd, ys, z0 + 200];
  const yg = L2 - 300;
  saddle("pg.stem", { o: [xd, yg, zDc], a: ZD3, u: XD, v: YD }, 8, (t) => G.saddleStart(rD, 8, t), rD + 110, { tone: "mid" }, { owner: "drum", cls: "bh-ss", hosts: [drumHost] });
  const Fd = G.frameAlong([xd, yg, zDc + rD + 160], HV);
  disc("pg.case", Fd, -16, 16, 52, { tone: "mid" }, { owner: "pg", cls: "bh-cast", extra: Dots(G.dotsOf(Fd, 16.4, 40, 12, P, { all: true }), { size: 0.45 }) });
  disc("pg.neck", FZ(xd, yg, 0), zDc + rD + 110, zDc + rD + 160 - 50, 9, { tone: "mid" }, { owner: "pg", cls: "bh-ss", n: 12 });
  ANCH.MANOMETRO = G.add3([xd, yg, zDc + rD + 160], G.mul3(HV, 16));
}

/* ====================================================================
   8 · las flechas: el agua que entra, corre a lo largo del tanque y sale; el vapor que va al tornillo y el líquido que
   llega del recibidor; blancas con borde
   ==================================================================== */
function arrowOf(ctl, { w = 4.4, h = 8, r = 10 } = {}) {
  const smooth = (c, n = 24) => {
    const out = [];
    for (let i = 0; i < c.length - 1; i++) {
      const p0 = c[Math.max(0, i - 1)], p1 = c[i], p2 = c[i + 1], p3 = c[Math.min(c.length - 1, i + 2)];
      for (let j = 0; j < n; j++) {
        const t = j / n, t2 = t * t, t3 = t2 * t;
        out.push([0, 1, 2].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3)));
      }
    }
    out.push(c[c.length - 1]);
    return out;
  };
  const pts = ctl.length > 2 ? smooth(ctl) : [ctl[0], G.lerp3(ctl[0], ctl[1], 0.5), ctl[1]];
  const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[Math.max(0, n - 4)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const base = [b[0] - ux * h, b[1] - uy * h];
  const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
  const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  return { mid: pts[Math.floor(pts.length / 2)], svg: `<path class="bh-flujo-o" d="${line}"/><path class="bh-flujo" d="${line}"/><path class="bh-flujo-p" d="${head}"/>`, shapes: [A.tube(pts, r), A.ball(pts[pts.length - 1], w / G.scaleOf(P))] };
}
function arrow(name, ctl, opts = {}) { const f = arrowOf(ctl, opts); put(name, f.mid, f.svg, f.shapes); }
{
  const ya = yo1 + 60;
  // a lo largo del tanque, delante del plano del corte
  arrow("flow.w0", [[-2500, ya, 1250], [-800, ya, 1230], [900, ya, 1250], [2450, ya, 1230]]);
  arrow("flow.w1", [[-2500, ya, 2050], [-800, ya, 2070], [900, ya, 2050], [2450, ya, 2070]]);
  arrow("flow.in", [[-3980, DI.yDrop, 3300], [-3770, DI.yDrop, 3300]]);
  arrow("flow.out", [[4300, OU.y, OU.z], [4560, OU.y, OU.z]]);
  ANCH.FLUJO = [0, ya, 2060];
}

/* ---------- la persona de referencia: 1,75 m, de pie a la izquierda del tanque (../persona.mjs) ---------- */
{
  const PS = process.env.BH_PER ? Object.fromEntries(["x", "y", "rumbo"].map((kk, i) => [kk, Number(process.env.BH_PER.split(",")[i])])) : BH.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, 0], rumbo: PS.rumbo, mm: 1, adelante: "izq" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.PECHO;
}
/* ---------- orden y salida ---------- */
if (process.env.BH_ITEM) {
  for (const nm of process.env.BH_ITEM.split(",")) {
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
if (!FAST && process.env.BH_PAIRS) {
  const names = process.env.BH_PAIRS.split(","), its = R_.settled.items;
  for (const pp of R_.settled.overlaps.pairs) {
    const a = its[pp.a].name, b = its[pp.b].name;
    if (names.includes(a) || names.includes(b)) console.log(a, "|", b, JSON.stringify(pp.front.map((f) => f && { area: f.area && +f.area.toFixed(2), at: f.at && f.at.map((v) => +v.toFixed(1)) })));
  }
}
R_.items.sort((a, b) => a.key - b.key);
const shades = (p, f, t, s0, s1, s2, s3) => `--anatomy-paper:${p};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s0};--anatomy-shade-1:${s1};--anatomy-shade-2:${s2};--anatomy-shade-3:${s3}`;
const ACERO = shades("#eef0f2", "#eef0f2", "#f7f8f9", "#c9ced3", "#d6dade", "#e1e4e7", "#eceef0");
const FUND = shades("#dfe2e5", "#dfe2e5", "#e9ebed", "#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0");
const PINT = shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4");
const CSS = `.bh-gal{${ACERO}}.bh-ss{${ACERO}}.bh-pipe{${ACERO}}.bh-jk{${ACERO}}.bh-panel{${ACERO}}.bh-ins{${ACERO}}
.bh-tube{${FUND}}.bh-cast{${FUND}}.bh-lever{${FUND}}
.bh-steel{${PINT}}.bh-paint{${PINT}}.bh-motor{${PINT}}.bh-blower{${PINT}}.bh-pvc{${PINT}}
.bh-ice{${shades("#f1f6fa", "#f1f6fa", "#f7fbfd", "#dfe9f1", "#e6eef4", "#ecf2f7", "#f1f6fa")}}
.bh-ice-cut{${shades("#dfe9f1", "#dfe9f1", "#dfe9f1", "#dfe9f1", "#dfe9f1", "#dfe9f1", "#dfe9f1")}}
.bh-conc{${shades("#e8e6e1", "#e8e6e1", "#efede9", "#d2cfc8", "#d9d6d0", "#dfddd7", "#e4e2dc")}}
.bh-pu{${shades("#f3e9a6", "#f3e9a6", "#f8f1c4", "#dccf7e", "#e4d88d", "#ebe09a", "#efe5a1")}}
.bh-agua-cara{fill:#bcd0e6;fill-opacity:.45}.bh-agua-sup{fill:#bcd0e6;fill-opacity:.32}
.bh-agua .iso-line[data-tone="lo"]{stroke:#8fb0cf}
.bh-anillo{fill:none;stroke:#8fb0cf;stroke-width:.5px}
.bh-burbuja{fill:#ffffff;stroke:#2e5e9e;stroke-width:.45px}
.bh-visor-agua{fill:#bcd0e6}.bh-visor-aire{fill:#aeb8c2}
.bh-flujo-o{fill:none;stroke:#525c64;stroke-width:3.4px;stroke-linecap:round;stroke-linejoin:round}
.bh-flujo{fill:none;stroke:#ffffff;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round}
.bh-flujo-p{fill:#ffffff;stroke:#525c64;stroke-width:1px;stroke-linejoin:round}
${CSS_PERSONA}`;
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
const svg = k.figureSvg({ width: W, height: H, label: "Banco de hielo en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="bh-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Banco de hielo", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUT, "fig_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
