/* ====================================================================
   Condensador evaporativo en isométrico (skill anatomy), para el capítulo 26 del libro de operaciones unitarias
   (Refrigeración y congelación): el condensador de amoníaco de la planta de frío, E-401.
   Concepto: el vapor caliente de amoníaco que llega del compresor entra por arriba al cabezal de entrada, se reparte
   en los circuitos del haz y baja por ellos en zigzag, cada paso inclinado hacia donde corre, mientras se condensa; el
   líquido sale por el cabezal de abajo hacia el recibidor. Por fuera de los tubos cae el agua que la bomba sube de la
   bandeja al distribuidor y que las boquillas rocían sobre el haz; el aire entra por las persianas de abajo, sube a
   contracorriente del agua por el haz, deja las gotas en los eliminadores y sale por la chimenea, movido por el
   ventilador axial de arriba (tiro inducido). Lo que evapora del agua se lleva el calor; la válvula de flotador repone
   el agua y la purga, en la descarga de la bomba, limita las sales.
   Corte: se quitó el panel entero del costado largo que mira al lector (y > 0), del fondo de la bandeja al techo: se
   ven el haz con sus dos cabezales y sus soportes, el distribuidor con sus boquillas, los eliminadores, la bandeja con
   el agua (cortada en el plano del panel) y su válvula de flotador y su rebose, y por dentro las persianas de los otros
   dos costados. El extremo de +x queda entero, con las persianas, las conexiones del amoníaco con sus válvulas de corte,
   la línea del agua de reposición y la bomba con su tubería al distribuidor y la purga. Arriba, el techo con la
   chimenea, la malla y el motor por fuera, con la correa en su guarda.
   La figura es solo del libro: lleva la persona de referencia de 1,75 m (../persona.mjs), de pie a la izquierda.
   Uso: node build.mjs [--audit] [--fast]   (CE_PER="x,y,rumbo" prueba otro lugar para la persona; CE_ITEM="pieza"
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
const STEP = Number(process.env.CE_STEP || 0.25);
const CE = GEO.CE, DN = GEO.DN, CO = CE.coil;
const AZ = CE.AZ, EL = CE.EL;
const XB = CE.X, YB = CE.Y, T = CE.t;
const { zFloor, zRim, zWater, zLouv, zDeck } = CE;
const ZF = zFloor + T, ZD1 = zDeck + T;           // la cara de arriba del fondo y del techo

const W = 640, H = 860;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const pol = (r, deg, z = 0) => [r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z];
const radial = (deg) => [Math.cos(deg * D2R), Math.sin(deg * D2R), 0];
const tangent = (deg) => [-Math.sin(deg * D2R), Math.cos(deg * D2R), 0];
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)

/* ---------- lugares que se usan en varias partes ---------- */
const NV = DN[65], NL = DN[40], NS = DN[65], NP = DN[80], NM = DN[25], NB = DN[15];
const xOut = XB;                                  // la cara de afuera del extremo de +x
const xIn = XB - T;                               // la de adentro
// el vapor: el tramo de afuera, su brida, la válvula, el tramo de la línea y las bridas donde sigue
const vap = { s0: xOut, sF: xOut + 80 };
const liq = { s0: xOut, sF: xOut + 80, slope: 1 / 50, run: 820 };
const sprayOut = { s0: xOut, sF: xOut + 60 };      // el tramo de afuera del agua que sube al distribuidor
const xRiser = XB + 260;                          // la tubería que sube junto al extremo
const PU = CE.pump;
const pSuc = { s0: xOut, sF: xOut + 100 };        // la succión de la bomba, de la bandeja
const xVol0 = pSuc.sF + NP.ft + 216 + NP.ft + 86; // la cara de la voluta donde entra la succión
const xVolC = xVol0 + PU.W / 2;                   // el eje de la descarga
const zDis = PU.z + PU.R + 75;                    // la cara de la brida de la descarga
const zTee = 900;                                 // la te de la purga
const ST = CE.stack, FA = CE.fan, MO = CE.motor;
const zS0 = ZD1, zS1 = ZD1 + ST.h;                // la chimenea
const mC = pol(MO.r, MO.deg);                     // el eje del motor
const yMk = CE.yMake, zMk = 720;                  // la reposición

/* ---------- la cámara ---------- */
const EXT = [];
for (const x of [-XB - 10, XB + 10]) for (const y of [-YB - 10, YB + 10]) EXT.push([x, y, 0], [x, y, ZD1]);
for (const x of [CE.pad.x0, CE.pad.x1]) for (const y of [CE.pad.y0, CE.pad.y1]) EXT.push([x, y, 0]);
for (let d = 0; d < 360; d += 15) EXT.push(pol(ST.r + ST.fl, d, zS1 + 10));
EXT.push([mC[0], mC[1], zS1 + 160], [0, 0, zS1 + 420]);
EXT.push([2720, 1000, 0], [2720, 150, 0], [2700, 1000, 700]);
EXT.push([2560, CE.yRef, CE.hdr.zTop + 120], [2560, CE.yRef, CE.hdr.zTop - 120], [xOut + 1000, CE.yRef, CE.hdr.zBot - 60]);
EXT.push([2320, yMk, zMk + 80], [2200, 50, 1250], [2200, -500, 1250]);
EXT.push([CE.persona.x, CE.persona.y, 0], [CE.persona.x, CE.persona.y, 1800], [CE.persona.x - 250, CE.persona.y, 0]);
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

/* ====================================================================
   1 · la losa, las vigas y la caja: el fondo de la bandeja, los costados (sin el de +y, que se quitó), las persianas,
   los ángulos de las esquinas y el techo con el hueco de la chimenea
   ==================================================================== */
box("stand.pad", [CE.pad.x0, CE.pad.y0, 0], [CE.pad.x1, CE.pad.y1, CE.zPad], { tone: "mid" }, { r: 6, steps: 2, bevel: 0.6, cls: "ce-conc", ground: true });
CE.beam.y.forEach((yb, i) => {
  const { h, b, tf, tw } = CE.beam, z0 = CE.zPad, z1 = z0 + h;
  const I = [[-b / 2, z0], [b / 2, z0], [b / 2, z0 + tf], [tw / 2, z0 + tf], [tw / 2, z1 - tf], [b / 2, z1 - tf], [b / 2, z1], [-b / 2, z1], [-b / 2, z1 - tf], [-tw / 2, z1 - tf], [-tw / 2, z0 + tf], [-b / 2, z0 + tf]];
  fp(`stand.beam${i}`, { o: [0, yb, 0], a: XD, u: YD, v: ZD3 }, I, CE.beam.x0, CE.beam.x1, { tone: "mid" }, { cls: "ce-paint", ground: true });
});
box("floor", [-XB, -YB, zFloor], [XB, YB, ZF], { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
// las costuras de los paneles: pestañas dobladas, una línea doble con sus pernos
const seamX = (x, y, z0, z1) => Ln(path3([[x - 4, y, z0], [x - 4, y, z1]]) + path3([[x + 4, y, z0], [x + 4, y, z1]]), { tone: "faint" }) +
  Dots(Array.from({ length: Math.floor((z1 - z0) / 160) }, (_, i) => at([x, y, z0 + 80 + i * 160])), { size: 0.45, tone: "lo" });
const seamY = (x, y, z0, z1) => Ln(path3([[x, y - 4, z0], [x, y - 4, z1]]) + path3([[x, y + 4, z0], [x, y + 4, z1]]), { tone: "faint" }) +
  Dots(Array.from({ length: Math.floor((z1 - z0) / 160) }, (_, i) => at([x, y, z0 + 80 + i * 160])), { size: 0.45, tone: "lo" });
const yIn = -YB + T;
box("back.lower", [-XB + T, -YB, ZF], [XB - T, yIn, zRim], { tone: "mid" }, { owner: "casing", cls: "ce-gal", extra: seamX(-500, yIn + 0.5, ZF, zRim) + seamX(500, yIn + 0.5, ZF, zRim) });
box("back.upper", [-XB + T, -YB, zLouv], [XB - T, yIn, zDeck], { tone: "mid" }, { owner: "casing", cls: "ce-gal", extra: seamX(-500, yIn + 0.5, zLouv, zDeck) + seamX(500, yIn + 0.5, zLouv, zDeck) });
box("left.lower", [-XB, -YB, ZF], [-XB + T, YB, zRim], { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
box("left.upper", [-XB, -YB, zLouv], [-XB + T, YB, zDeck], { tone: "mid" }, { owner: "casing", cls: "ce-gal", extra: seamY(-XB + T + 0.5, 0, zLouv, zDeck) });
box("right.lower", [XB - T, -YB, ZF], [XB, YB, zRim], { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
box("right.upper", [XB - T, -YB, zLouv], [XB, YB, zDeck], { tone: "mid" }, { owner: "casing", cls: "ce-gal", extra: seamY(XB + 0.5, 60, zLouv, zDeck) });
ANCH.CAJA = [XB, -620, 2300];
// en el extremo de +x: la puerta de inspección (con sus bisagras y su manija) y la placa de datos
{
  const xd = xOut, y0 = -820, y1 = -500, z0 = 1820, z1 = 2480;
  box("door", [xd, y0, z0], [xd + 6, y1, z1], { tone: "mid" }, { owner: "casing", cls: "ce-gal", r: 6, steps: 2, bevel: 0.6 });
  [z0 + 90, z1 - 90].forEach((z, i) => disc(`door.hinge${i}`, FZ(xd + 12, y0 - 2, 0), z - 40, z + 40, 9, { tone: "mid" }, { owner: "casing", cls: "ce-cast", n: 14 }));
  const Fh = { o: [xd + 6, y1 - 50, (z0 + z1) / 2], a: XD, u: YD, v: ZD3 };
  fp("door.handle", Fh, rect(-12, 12, -60, 60), 0, 14, { tone: "mid" }, { owner: "casing", cls: "ce-cast" });
  const yp0 = 560, yp1 = 800, zp0 = 1640, zp1 = 1760;
  const rules = Ln([0.3, 0.5, 0.7].map((f) => path3([[xd + 3.3, yp1 - 30, zp0 + (zp1 - zp0) * f], [xd + 3.3, yp0 + 30, zp0 + (zp1 - zp0) * f]])).join(""), { tone: "lo", free: true });
  box("plate", [xd, yp0, zp0], [xd + 3, yp1, zp1], { tone: "mid" }, { owner: "casing", cls: "ce-ss", r: 3, extra: rules + Dots([[yp0 + 12, zp0 + 12], [yp1 - 12, zp0 + 12], [yp1 - 12, zp1 - 12], [yp0 + 12, zp1 - 12]].map(([y, z]) => at([xd + 3.3, y, z])), { size: 0.5 }) });
  ANCH.PUERTA = [xd + 6, (y0 + y1) / 2, (z0 + z1) / 2 + 150];
}
// la oscuridad de adentro, detrás de las persianas del extremo de +x
box("right.dark", [XB - T, -YB + 50, zRim], [XB - 2, YB - 50, zLouv], { tone: "mid" }, { owner: "casing", cls: "ce-dark" });
/* las persianas: hojas inclinadas, con el borde de afuera más abajo, en un marco; en el extremo de +x se ven por fuera
   y en el costado de atrás y en el extremo de −x, por dentro (detrás de ellas, el aire de afuera) */
const NLV = 11, LP = (zLouv - zRim) / NLV, LD = 46, LT = 3;
const louverSec = (zb) => [[0, zb + LP - 6], [LT, zb + LP - 6 + 1.5], [LD + LT, zb + LP - 6 - LD + 1.5], [LD, zb + LP - 6 - LD]];
for (let i = 0; i < NLV; i++) {
  const zb = zRim + i * LP;
  // extremo de +x: a lo largo de y; la sección en (x hacia afuera, z)
  fp(`louv.r${i}`, { o: [xOut, 0, 0], a: YD, u: XD, v: ZD3 }, louverSec(zb), -YB + 50, YB - 50, { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
  // costado de atrás: a lo largo de x; hacia afuera es −y
  fp(`louv.b${i}`, { o: [0, -YB, 0], a: XD, u: [0, -1, 0], v: ZD3 }, louverSec(zb), -XB + 50, XB - 50, { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
  // extremo de −x: a lo largo de y; hacia afuera es −x
  fp(`louv.l${i}`, { o: [-XB, 0, 0], a: YD, u: [-1, 0, 0], v: ZD3 }, louverSec(zb), -YB + 50, YB - 50, { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
}
// los parales del marco de las persianas, en los extremos de cada hoja
{
  const post = (name, F, s0, s1) => fp(name, F, rect(0, LD + LT, zRim, zLouv), s0, s1, { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
  post("louv.rpost0", { o: [xOut, 0, 0], a: YD, u: XD, v: ZD3 }, -YB + 44, -YB + 50);
  post("louv.rpost1", { o: [xOut, 0, 0], a: YD, u: XD, v: ZD3 }, YB - 50, YB - 44);
  post("louv.bpost0", { o: [0, -YB, 0], a: XD, u: [0, -1, 0], v: ZD3 }, -XB + 44, -XB + 50);
  post("louv.bpost1", { o: [0, -YB, 0], a: XD, u: [0, -1, 0], v: ZD3 }, XB - 50, XB - 44);
  post("louv.lpost0", { o: [-XB, 0, 0], a: YD, u: [-1, 0, 0], v: ZD3 }, -YB + 44, -YB + 50);
  post("louv.lpost1", { o: [-XB, 0, 0], a: YD, u: [-1, 0, 0], v: ZD3 }, YB - 50, YB - 44);
}
ANCH.PERSIANAS = [xOut + LD * 0.6, -700, zRim + LP * 1.5];
ANCH.PERSIANAS_IN = [-600, -YB - LD * 0.5, zRim + LP * 5.5];
// los ángulos de las esquinas (50 × 50 × 5), del fondo al techo, y el del borde de adelante del techo
{
  const z0 = zFloor, z1 = ZD1, a = 50, e = 5;
  const corner = (name, x, y, sx, sy) => {
    // dos alas, cada una su pieza: una sobre el extremo (x = ±X) y otra sobre el costado (y = ±Y)
    const xs = [x, x + sx * e].sort((p, q) => p - q), ys = [y - sy * a, y + sy * e].sort((p, q) => p - q);
    fp(name + ".x", F0, rect(xs[0], xs[1], ys[0], ys[1]), z0, z1, { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
    const xs2 = [x - sx * a, x].sort((p, q) => p - q), ys2 = [y, y + sy * e].sort((p, q) => p - q);
    fp(name + ".y", F0, rect(xs2[0], xs2[1], ys2[0], ys2[1]), z0, z1, { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
  };
  corner("corner.fl", -XB, YB, -1, 1);
  corner("corner.fr", XB, YB, 1, 1);
  corner("corner.br", XB, -YB, 1, -1);
  corner("corner.bl", -XB, -YB, -1, -1);
  // el ángulo del borde de adelante del techo, entre las dos esquinas
  fp("frame.top", { o: [0, 0, 0], a: XD, u: YD, v: ZD3 }, [[YB - 50, zDeck - 5], [YB, zDeck - 5], [YB, zDeck - 55], [YB + e, zDeck - 55], [YB + e, zDeck], [YB - 50, zDeck]], -XB + a, XB - a, { tone: "mid" }, { owner: "casing", cls: "ce-gal" });
}
// el techo, con el hueco de la chimenea
{
  const outer = [[-XB, -YB, ZD1], [XB, -YB, ZD1], [XB, YB, ZD1], [-XB, YB, ZD1]];
  const hole = arcPts(ST.r, ZD1, 0, TAU, 96).slice(0, -1).reverse();
  const top = flatFace(outer, ZD3, "ce-gal", [hole]);
  const front = flatFace([[-XB, YB, zDeck], [XB, YB, zDeck], [XB, YB, ZD1], [-XB, YB, ZD1]], YD, "ce-gal");
  const right = flatFace([[XB, -YB, zDeck], [XB, YB, zDeck], [XB, YB, ZD1], [XB, -YB, ZD1]], XD, "ce-gal");
  const edges = Ln(path3(outer, true) + path3([[-XB, YB, zDeck], [XB, YB, zDeck], [XB, -YB, zDeck]]) + path3([[XB, YB, zDeck], [XB, YB, ZD1]]), { tone: "mid" });
  const holeLn = Ln(path3(arcPts(ST.r, ZD1 + 0.3, 0, TAU, 96)), { tone: "lo" });
  // las costuras del techo, a lo largo de y
  const seams = Ln([-1000, 1000].map((x) => path3([[x, -YB, ZD1 + 0.3], [x, YB, ZD1 + 0.3]])).join(""), { tone: "faint" });
  const shape = record(A.prism(F0, rect(-XB, XB, -YB, YB), zDeck, ZD1, { name: "deck", owner: "casing", cut: [A.disc(F0, zDeck - 10, ZD1 + 10, ST.r)] }));
  put("deck", [0, 0, zDeck], front + right + top + seams + holeLn + edges, [shape]);
  ANCH.TECHO = [-1150, -500, ZD1];
}

/* ====================================================================
   2 · el agua de la bandeja: cortada en el plano del panel que se quitó, translúcida; el rebose y la válvula de
   flotador de la reposición (lo que queda bajo el agua va antes que ella)
   ==================================================================== */
const OV = { x: 850, y: 300, d: DN[50] };
disc("overflow.sub", FZ(OV.x, OV.y, 0), ZF, zWater, OV.d.ro, { tone: "mid" }, { owner: "overflow", cls: "ce-pipe" });
const FLT = { piv: [1180, yMk, 705], c: [930, yMk, zWater + 6], r: 70 };
{
  // la mitad de abajo del flotador, bajo el agua
  const F = FZ(FLT.c[0], FLT.c[1], FLT.c[2]);
  const zc = FLT.c[2], aw = Math.asin((zWater - zc) / FLT.r);     // el ángulo de la línea del agua
  const lo = []; for (let i = 0; i <= 8; i++) { const a = -PI / 2 + ((aw + PI / 2) * i) / 8; lo.push([FLT.r * Math.sin(a), FLT.r * Math.cos(a), i > 0 && i < 8 ? 1 : 0]); }
  lo[0] = [-FLT.r, 0];
  turned("float.sub", F, lo.map(([s, r, sm]) => (sm ? [s, r, 1] : [s, r])), { tone: "mid" }, { owner: "float", cls: "ce-float" });
}
{
  const sup = [[-XB + T, -YB + T, zWater], [XB - T, -YB + T, zWater], [XB - T, YB - 2, zWater], [-XB + T, YB - 2, zWater]];
  const face = [[-XB + T, YB - 2, ZF], [XB - T, YB - 2, ZF], [XB - T, YB - 2, zWater], [-XB + T, YB - 2, zWater]];
  const svg = `<g class="ce-agua"><path class="ce-agua-cara" d="${pth1(face.map(pr))}"/><path class="ce-agua-sup" d="${pth1(sup.map(pr))}"/>` +
    Ln(path3([[-XB + T, YB - 2, zWater], [XB - T, YB - 2, zWater]]) + path3([[XB - T, YB - 2, zWater], [XB - T, -YB + T, zWater]]), { tone: "lo" }) +
    "</g>";
  put("water", [0, 0, (ZF + zWater) / 2], svg, [A.box([-XB + T, -YB + T, ZF], [XB - T, YB - 2, zWater])]);
  ANCH.AGUA = [-650, YB - 2, (ZF + zWater) / 2 + 40];
}
disc("overflow.top", FZ(OV.x, OV.y, 0), zWater, zWater + 50, OV.d.ro, { tone: "mid" }, {
  owner: "overflow", cls: "ce-pipe",
  extra: `<path class="ce-bore" d="${pth1(arcPts(OV.d.ri, zWater + 50.3, 0, TAU, 24, OV.x, OV.y).slice(0, -1).map(pr))}"/>`,
});
ANCH.REBOSE = [OV.x, OV.y + OV.d.ro, zWater + 30];
{
  // la mitad de arriba del flotador, el brazo y la válvula con su tubo de la reposición
  const F = FZ(FLT.c[0], FLT.c[1], FLT.c[2]), zc = FLT.c[2], aw = Math.asin((zWater - zc) / FLT.r);
  const hi = []; for (let i = 0; i <= 8; i++) { const a = aw + ((PI / 2 - aw) * i) / 8; hi.push([FLT.r * Math.sin(a), FLT.r * Math.cos(a), i > 0 && i < 8 ? 1 : 0]); }
  hi[8] = [FLT.r, 0];
  turned("float.top", F, hi.map(([s, r, sm]) => (sm ? [s, r, 1] : [s, r])), { tone: "mid" }, { owner: "float", cls: "ce-float" });
  // el brazo: del pivote de la válvula a la corona del flotador
  const crown = [FLT.c[0], FLT.c[1], zc + FLT.r], dir = G.unit3(G.sub3(crown, FLT.piv)), Lr = G.len3(G.sub3(crown, FLT.piv));
  const Fa = G.frameAlong(FLT.piv, dir);
  disc("float.arm", Fa, 0, Lr - 1.5, 6, { tone: "mid" }, { owner: "float", cls: "ce-ss", n: 12 });
  // la válvula: un cuerpo con la boca hacia abajo
  const xv = FLT.piv[0];
  disc("float.valve", FXL(yMk, zMk), xv - 10, xv + 80, 26, { tone: "mid" }, { owner: "float", cls: "ce-cast" });
  disc("float.spout", FZ(xv + 30, yMk, 0), zMk - 60, zMk - 24, 12, { tone: "mid" }, { owner: "float", cls: "ce-cast" });
  disc("float.pivot", FYL(xv, FLT.piv[2]), yMk - 22, yMk + 22, 8, { tone: "mid" }, { owner: "float", cls: "ce-ss", n: 12 });
  disc("make.in", FXL(yMk, zMk), xv + 80, xIn, NM.ro, { tone: "mid" }, { owner: "float", cls: "ce-pipe" });
  ANCH.FLOTADOR = [FLT.c[0] - FLT.r * 0.2, FLT.c[1] + FLT.r * 0.6, zc + FLT.r * 0.7];
}

/* ====================================================================
   3 · el haz: 32 circuitos en zigzag, cada uno entre el cabezal de entrada (arriba) y el de salida (abajo); los dos
   ángulos que lo cargan; los cabezales y sus tramos hasta la pared
   ==================================================================== */
const HD = CE.hdr, NT = DN[80], NBH = DN[50];
// el cabezal de salida, detrás del haz
disc("hdr.bot", FYL(HD.x, HD.zBot), -HD.yEnd, HD.yEnd, NBH.ro, { tone: "mid" }, { owner: "coil", cls: "ce-tube" });
saddle("hdr.bot.stub", { o: [HD.x, CE.yRef, HD.zBot], a: XD, u: ZD3, v: YD }, NL.ro, (t) => G.saddleStart(NBH.ro, NL.ro, t), xIn - HD.x, { tone: "mid" }, { owner: "coil", cls: "ce-tube", hosts: [A.disc(FYL(HD.x, HD.zBot), -HD.yEnd, HD.yEnd, NBH.ro)] });
ANCH.CAB_SALIDA = [HD.x, HD.yEnd - 60, HD.zBot - NBH.ro * 0.6];
// los soportes del haz: un perfil en T a lo largo de y, bajo el último paso de cada circuito
CE.sup.x.forEach((xs, i) => {
  const zt = GEO.zPass(CO.n - 1, xs) - CO.ro;
  const Ts = [[xs - 25, zt], [xs + 25, zt], [xs + 25, zt - 6], [xs + 3, zt - 6], [xs + 3, zt - CE.sup.h], [xs - 3, zt - CE.sup.h], [xs - 3, zt - 6], [xs - 25, zt - 6]];
  fp(`coil.sup${i}`, { o: [0, 0, 0], a: YD, u: XD, v: ZD3 }, Ts, yIn, YB - 2, { tone: "mid" }, { owner: "coil", cls: "ce-gal" });
  if (i === 0) ANCH.SOPORTE = [xs, YB - 2, zt - 30];
});
// los circuitos: una ruta con sus curvas; los pasos rectos y las curvas se dibujan aparte, sin tapas en las juntas
{
  const xa = CO.xR + CO.R, xb = CO.xL - CO.R;
  const zT0 = HD.zTop - Math.sqrt(NT.ro ** 2 - CO.ro ** 2), zB0 = HD.zBot + Math.sqrt(NBH.ro ** 2 - CO.ro ** 2);
  const route = (y) => {
    const pts = [[xa, y, zT0], [xa, y, GEO.zs(0)]];
    for (let i = 0; i < CO.n; i++) {
      const xe = i % 2 === 0 ? xb : xa;
      pts.push([xe, y, GEO.ze(i)]);
      if (i < CO.n - 1) pts.push([xe, y, GEO.zs(i + 1)]);
    }
    pts.push([xa, y, zB0]);
    return G.fillet(pts, CO.R, 6);
  };
  let svg = "";
  const shapes = [];
  for (let j = 0; j < CO.nc; j++) {
    const y = GEO.yCirc(j), dense = route(y);
    shapes.push(A.tube(dense, CO.ro, { name: "coil", owner: "coil" }));
    // los tramos: largos (rectos) o cortos (de una curva)
    const runs = [];
    let cur = [dense[0]];
    for (let i = 1; i < dense.length; i++) {
      const L = G.len3(G.sub3(dense[i], dense[i - 1]));
      if (L > 60) { if (cur.length > 1) runs.push({ arc: true, pts: cur }); runs.push({ arc: false, pts: [dense[i - 1], dense[i]] }); cur = [dense[i]]; }
      else cur.push(dense[i]);
    }
    if (cur.length > 1) runs.push({ arc: true, pts: cur });
    // las piezas de un circuito no se cruzan entre sí: van juntas en un solo trazo por clase (cuerpo, brillo, sombra y
    // bordes), y los circuitos, de atrás hacia adelante
    const parts = runs.flatMap((run) => tubePieces(run.pts, CO.ro, P, { maxLength: 1e6, spacing: run.arc ? 14 : 5000, caps: false }));
    const cat = (key) => parts.map((q) => q[key]).join("");
    svg += `<g class="tb"><path class="tb-body" d="${cat("body")}"/><path class="tb-shine" d="${cat("shine")}"/><path class="tb-shade" d="${cat("shade")}"/><path class="iso-line tb-edge" data-tone="mid" d="${cat("edges")}"/></g>`;
  }
  shapes.forEach(record);
  put("coil", [0, 0, (GEO.zs(0) + GEO.ze(CO.n - 1)) / 2], `<g class="ce-tube">${svg}</g>`, shapes);
  const yF = GEO.yCirc(CO.nc - 1);
  ANCH.HAZ = [-700, yF + CO.ro * 0.4, GEO.zPass(2, -700)];
  ANCH.ZIGZAG = [CO.xL - CO.R - CO.ro * 0.6, yF, (GEO.ze(4) + GEO.zs(5)) / 2];
}
// el cabezal de entrada, delante del haz, y su tramo hasta la pared
disc("hdr.top", FYL(HD.x, HD.zTop), -HD.yEnd, HD.yEnd, NT.ro, { tone: "mid" }, { owner: "coil", cls: "ce-tube" });
saddle("hdr.top.stub", { o: [HD.x, CE.yRef, HD.zTop], a: XD, u: ZD3, v: YD }, NV.ro, (t) => G.saddleStart(NT.ro, NV.ro, t), xIn - HD.x, { tone: "mid" }, { owner: "coil", cls: "ce-tube", hosts: [A.disc(FYL(HD.x, HD.zTop), -HD.yEnd, HD.yEnd, NT.ro)] });
ANCH.CAB_ENTRADA = [HD.x, HD.yEnd - 40, HD.zTop + NT.ro * 0.7];

/* ====================================================================
   4 · el distribuidor de agua: el cabezal a lo largo de y, los cinco ramales con sus boquillas, y el rocío
   ==================================================================== */
const SP = CE.spray, NSB = DN[40];
disc("spray.main", FYL(SP.x, SP.z), SP.branches[0] - 60, SP.branches[SP.branches.length - 1] + 60, NS.ro, { tone: "mid" }, { owner: "spray", cls: "ce-pipe" });
saddle("spray.stub", { o: [SP.x, CE.ySpray, SP.z], a: XD, u: ZD3, v: YD }, NS.ro - 6, (t) => G.saddleStart(NS.ro, NS.ro - 6, t), xIn - SP.x, { tone: "mid" }, { owner: "spray", cls: "ce-pipe", hosts: [A.disc(FYL(SP.x, SP.z), -800, 800, NS.ro)] });
SP.branches.forEach((yb, i) => {
  disc(`spray.br${i}`, FXL(yb, SP.z), SP.xEnd, SP.x, NSB.ro, { tone: "mid" }, { owner: "spray", cls: "ce-pipe" });
  disc(`spray.cap${i}`, FXL(yb, SP.z), SP.xEnd - 12, SP.xEnd, NSB.ro + 3, { tone: "mid" }, { owner: "spray", cls: "ce-pipe" });
  SP.nozzles.forEach((xn, q) => {
    const zb = SP.z - NSB.ro + 3;
    disc(`spray.noz${i}.${q}`, FZ(xn, yb, 0), zb - 40, zb, 11, { tone: "mid" }, { owner: "spray", cls: "ce-noz", n: 10 });
    disc(`spray.tip${i}.${q}`, FZ(xn, yb, 0), zb - 52, zb - 40, 19, { tone: "mid" }, { owner: "spray", cls: "ce-noz", n: 12 });
  });
});
ANCH.DISTRIBUIDOR = [-900, SP.branches[4] + NSB.ro * 0.5, SP.z + NSB.ro * 0.4];
ANCH.BOQUILLA = [SP.nozzles[1], SP.branches[4] + 15, SP.z - NSB.ro - 40];
{
  // el rocío: gotas en un cono bajo cada boquilla (más claras abajo), hasta poco antes del haz
  const zTip = SP.z - NSB.ro + 3 - 52, zEnd = 2770, R1 = 120;
  SP.branches.forEach((yb, i) => SP.nozzles.forEach((xn, q) => {
    let d = "";
    for (let m = 0; m < 26; m++) {
      const s = 8 + rnd() * (zTip - zEnd - 10), rr = (14 + (R1 - 14) * (s / (zTip - zEnd))) * Math.sqrt(rnd()), aa = rnd() * TAU;
      const p = at([xn + rr * Math.cos(aa), yb + rr * Math.sin(aa), zTip - s]);
      d += `<circle cx="${r10(p[0])}" cy="${r10(p[1])}" r=".55"/>`;
    }
    const Fc = { o: [xn, yb, zTip], a: [0, 0, -1], u: XD, v: YD };
    const shapes = [A.solid(Fc, [[0, 0], [0, 14], [zTip - zEnd, R1], [zTip - zEnd, 0]])];
    let extra = "";
    if (i === SP.branches.length - 1 && q % 2 === 0) {
      // el agua que cae: una flecha blanca delante del rocío
      const f = arrowOf([[xn + 30, yb + 50, zTip - 8], [xn + 40, yb + 60, zEnd + 15]], { w: 3.6, h: 7, r: 8 });
      extra = f.svg; shapes.push(...f.shapes);
    }
    put(`spray.cone${i}.${q}`, [xn, yb, (zTip + zEnd) / 2], `<g class="ce-gota">${d}</g>` + extra, shapes);
  }));
}

/* ====================================================================
   5 · los eliminadores de gotas: hojas en V a lo largo de y, sobre ángulos en las paredes; en su cara de adelante se
   ven los perfiles
   ==================================================================== */
{
  const E = CE.elim, x0 = -XB + T, x1 = XB - T, y0 = yIn, y1 = E.yF;
  // los ángulos de apoyo: a lo largo del costado de atrás y de los dos extremos
  box("elim.supB", [x0, y0, E.z0 - 40], [x1, y0 + 40, E.z0], { tone: "mid" }, { owner: "elim", cls: "ce-gal" });
  box("elim.supL", [x0, y0 + 40, E.z0 - 40], [x0 + 40, YB - 2, E.z0], { tone: "mid" }, { owner: "elim", cls: "ce-gal" });
  box("elim.supR", [x1 - 40, y0 + 40, E.z0 - 40], [x1, YB - 2, E.z0], { tone: "mid" }, { owner: "elim", cls: "ce-gal" });
  const n = Math.floor((x1 - x0) / E.pitch);
  let chev = "", tops = "";
  for (let i = 1; i < n; i++) {
    const x = x0 + i * E.pitch, h = (E.z1 - E.z0) / 3;
    chev += path3([[x, y1, E.z1], [x + 12, y1, E.z1 - h], [x, y1, E.z1 - 2 * h], [x + 12, y1, E.z0]]);
    tops += path3([[x, y0, E.z1], [x, y1, E.z1]]);
  }
  const extra = Ln(chev, { tone: "lo" }) + Ln(tops, { tone: "faint" });
  box("elim", [x0, y0, E.z0], [x1, y1, E.z1], { tone: "mid" }, { owner: "elim", cls: "ce-pvc", extra });
  ANCH.ELIMINADORES = [-1050, y1, (E.z0 + E.z1) / 2];
}

/* ====================================================================
   6 · la chimenea, el ventilador axial, la malla y el motor con la correa en su guarda
   ==================================================================== */
{
  // la mitad de atrás de la chimenea: su cara de adentro, que se ve por la boca
  const rI = ST.r, rO = ST.r + ST.tw;
  const inner = toned((o) => surface(cylP(rI, zS0, zS1), cylN(-1), fSL, fS, 96, o), "ce-gal");
  const seam = Ln(path3([[rI * Math.cos(fSL + 1.6), rI * Math.sin(fSL + 1.6), zS0], [rI * Math.cos(fSL + 1.6), rI * Math.sin(fSL + 1.6), zS1]]), { tone: "faint" });
  put("stack.back", [-rI * HV[0], -rI * HV[1], (zS0 + zS1) / 2], inner + seam, [record(A.prism(F0, sector(rI, rO, fSL, fS, 48), zS0, zS1, { name: "stack.back", owner: "fan" }))]);
  fp("stack.flBb", F0, sector(rO, rI + 65, fSL, fS, 48), zS0, zS0 + 8, { tone: "mid" }, { owner: "fan", cls: "ce-gal" });
}
function sector(r0, r1, a0, a1, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
{
  // el puente, el cojinete y el eje del ventilador (adentro, casi tapados)
  const zb0 = zS0 + 210, zb1 = zb0 + 100;
  fp("fan.bridge", { o: [0, 0, 0], a: XD, u: YD, v: ZD3 }, rect(-40, 40, zb0, zb1), -ST.r + 1.2, ST.r - 1.2, { tone: "mid" }, { owner: "fan", cls: "ce-paint" });
  disc("fan.bearing", F0, zb1, zb1 + 70, 62, { tone: "mid" }, { owner: "fan", cls: "ce-cast" });
  disc("fan.shaft", F0, zb1 + 70, FA.z, 28, { tone: "mid" }, { owner: "fan", cls: "ce-ss" });
  // el cubo y las seis aspas, cada una una lámina con su ángulo
  disc("fan.hub", F0, FA.z, FA.z + FA.hubH, FA.hub, { tone: "mid" }, { owner: "fan", cls: "ce-cast", extra: Dots(G.dotsOf(F0, FA.z + FA.hubH, FA.hub * 0.6, 6, P, { all: true }), { size: 0.5 }) });
  const zc = FA.z + FA.hubH / 2, pitch = FA.pitch * D2R;
  const sec = [[-FA.chord / 2, -2], [FA.chord / 2, -FA.t / 2], [FA.chord / 2, 0], [FA.chord * 0.25, FA.t * 0.6], [-FA.chord * 0.3, FA.t * 0.55], [-FA.chord / 2, 0]];
  for (let q = 0; q < FA.n; q++) {
    const deg = 15 + (360 * q) / FA.n, a = radial(deg), tg = tangent(deg);
    const u = G.add3(G.mul3(tg, Math.cos(pitch)), G.mul3(ZD3, Math.sin(pitch))), v = G.unit3(G.cross3(a, u));
    fp(`fan.blade${q}`, { o: [0, 0, zc], a, u, v }, sec, FA.hub - 6, FA.tip, { tone: "mid" }, { owner: "fan", cls: "ce-blade" });
  }
  ANCH.VENTILADOR = G.add3(pol(FA.tip * 0.62, 15 + 360 * 2 / FA.n, zc), [0, 0, 4]);
}
{
  // la mitad de adelante de la chimenea, por fuera
  const rO = ST.r + ST.tw, rI = ST.r;
  const svg = toned((o) => surface(cylP(rO, zS0, zS1), cylN(1), fS - TAU, fSL, 120, o), "ce-gal") +
    Ln(path3([[rO * Math.cos(fS), rO * Math.sin(fS), zS0], [rO * Math.cos(fS), rO * Math.sin(fS), zS1]]) + path3([[rO * Math.cos(fSL), rO * Math.sin(fSL), zS0], [rO * Math.cos(fSL), rO * Math.sin(fSL), zS1]]), { tone: "mid" }) +
    Ln(path3(arcPts(rO + 0.3, (zS0 + zS1) / 2, fS - TAU, fSL, 64)), { tone: "faint" });
  put("stack.front", [rO * HV[0], rO * HV[1], (zS0 + zS1) / 2], svg, [record(A.prism(F0, sector(rI, rO, fS - TAU, fSL, 48), zS0, zS1, { name: "stack.front", owner: "fan" }))]);
  // las bridas de abajo (sobre el techo) y de arriba, con sus pernos
  fp("stack.flBf", F0, sector(rO, rI + 65, fS - TAU, fSL, 48), zS0, zS0 + 8, { tone: "mid" }, { owner: "fan", cls: "ce-gal", extra: Dots(Array.from({ length: 24 }, (_, q) => (q * 15 + 7.5) * D2R).filter((t) => t > fS - TAU + 0.05 && t < fSL - 0.05).map((t) => at([(rI + 40) * Math.cos(t), (rI + 40) * Math.sin(t), zS0 + 8.3])), { size: 0.45 }) });
  ring("stack.flT", rI, rI + ST.fl, zS1 - ST.ft, zS1, "ce-gal", { owner: "fan" });
  ANCH.CHIMENEA = [rO * Math.cos(fSL + 0.35), rO * Math.sin(fSL + 0.35), zS0 + ST.h * 0.45];
}
{
  // la malla: un aro de pletina sobre la brida, alambres en círculos y ocho radios; se ve el ventilador entre ellos
  const zg = zS1, rr0 = 150, rr1 = ST.r + 40;
  ring("guard.rim", ST.r + 10, rr1, zg, zg + 6, "ce-ss", { owner: "fan" });
  let wires = "";
  for (const r of [rr0, 280, 410, 540, 670]) wires += path3(arcPts(r, zg + 4, 0, TAU, 96));
  for (let q = 0; q < 8; q++) { const d = 22.5 + q * 45; wires += path3([pol(rr0, d, zg + 4), pol(ST.r + 10, d, zg + 4)]); }
  put("guard", [0, 0, zg + 4], Ln(wires, { tone: "mid", className: "ce-malla" }), [A.disc(F0, zg + 2, zg + 6, ST.r + 10)]);
  ANCH.MALLA = pol(540, 205, zg + 4);
}
{
  // el motor por fuera de la chimenea: la guarda de la correa entra a la chimenea; encima, la placa y el motor de eje
  // vertical, con su caja de conexiones mirando al lector; abajo, una ménsula a la pared
  const own = "fan", Fg = { o: [0, 0, MO.zBelt], a: radial(MO.deg), u: tangent(MO.deg), v: ZD3 };
  const sOut = MO.r + 120, gh = 55;
  fp("motor.guard", Fg, rect(-100, 100, -gh, gh), ST.r - 6, sOut, { tone: "mid" }, { owner: own, cls: "ce-yel" });
  fp("motor.plate", Fg, rect(-130, 130, gh, gh + 15), MO.r - 130, sOut, { tone: "mid" }, { owner: own, cls: "ce-paint" });
  fp("motor.gusset", { o: [0, 0, 0], a: tangent(MO.deg), u: radial(MO.deg), v: ZD3 }, [[ST.r + ST.tw - 0.5, MO.zBelt - gh], [sOut - 30, MO.zBelt - gh], [ST.r + ST.tw - 0.5, MO.zBelt - gh - 190]], -5, 5, { tone: "mid" }, { owner: own, cls: "ce-paint" });
  const z0 = MO.zBelt + gh + 15, z1 = z0 + MO.L, Fm = FZ(mC[0], mC[1], 0);
  // las aletas del motor: rayas verticales en la mitad que mira al lector
  let fins = "";
  for (let q = 0; q < 28; q++) { const a = (q / 28) * TAU, n3 = [Math.cos(a), Math.sin(a), 0]; if (G.dot3(n3, V3) > 0.12) fins += path3([[mC[0] + (MO.R + 0.4) * Math.cos(a), mC[1] + (MO.R + 0.4) * Math.sin(a), z0 + 22], [mC[0] + (MO.R + 0.4) * Math.cos(a), mC[1] + (MO.R + 0.4) * Math.sin(a), z1 - 20]]); }
  disc("motor.flange", Fm, z0, z0 + 22, MO.R + 18, { tone: "mid" }, { owner: own, cls: "ce-motor" });
  disc("motor.body", Fm, z0 + 22, z1 - 20, MO.R, { tone: "mid" }, { owner: own, cls: "ce-motor", extra: Ln(fins, { tone: "faint" }) });
  disc("motor.cowl", Fm, z1 - 20, z1 + 30, MO.R - 8, { tone: "mid" }, { owner: own, cls: "ce-motor", extra: Dots(G.dotsOf(Fm, z1 + 30, (MO.R - 8) * 0.55, 10, P, { all: true }), { size: 0.5 }) });
  // la caja de conexiones, en el costado que mira al lector
  const hv = Math.atan2(HV[1], HV[0]) / D2R, Fb = { o: [mC[0], mC[1], 0], a: radial(hv), u: tangent(hv), v: ZD3 };
  fp("motor.tbox", Fb, rect(-48, 48, z0 + 170, z0 + 270), MO.R - 6, MO.R + 52, { tone: "mid" }, { owner: own, cls: "ce-motor" });
  ANCH.MOTOR = G.add3([mC[0], mC[1], z0 + 300], G.mul3(HV, MO.R));
  ANCH.CORREA = G.add3(pol((ST.r + sOut) / 2, MO.deg, MO.zBelt), G.mul3(tangent(MO.deg), 100));
}

/* ====================================================================
   7 · las conexiones del amoníaco: el vapor que llega del compresor al cabezal de arriba y el líquido que sale del
   cabezal de abajo hacia el recibidor, con pendiente; una válvula de corte en cada una
   ==================================================================== */
// válvula de bola bridada: F.a es el sentido del flujo y la cara de entrada está en s0; con palanca
function ballValve(name, F, s0, d, { open = true, stem = null, owner = name, lever = 170 } = {}) {
  const Lv = d.ro > 25 ? 216 : 165, ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, { tone: "mid" }, { owner, cls: "ce-cast", extra: Dots(G.dotsOf(F, s0, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner, cls: "ce-cast" });
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, { tone: "mid" }, { owner, cls: "ce-cast", extra: Dots(G.dotsOf(F, s1, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  const st = stem || ZD3;
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - 16 * 16) - 2, r1 + 30, 16, { tone: "mid" }, { owner, cls: "ce-cast" });
  disc(`${name}.stem`, FS, r1 + 30, r1 + 42, 7, { tone: "mid" }, { owner, cls: "ce-ss" });
  const lv = open ? F.a : G.unit3(G.cross3(st, F.a)), FL2 = { o: G.add3(c, G.mul3(st, r1 + 42)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
  fp(`${name}.lever`, FL2, [[0, -10], [6, -10], [6, 10], [0, 10]], -16, lever, { tone: "mid" }, { owner, cls: "ce-lever" });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, r1, s1, top: G.add3(c, G.mul3(st, r1 + 30)) };
}
// un par de bridas donde sigue la línea, con un tramo corto y su brida
function lineEnd(name, F, s, d, owner) {
  disc(`${name}.e0`, F, s, s + d.ft, d.fl, { tone: "mid" }, { owner, cls: "ce-cast" });
  disc(`${name}.e1`, F, s + d.ft, s + 2 * d.ft, d.fl, { tone: "mid" }, { owner: owner + "2", cls: "ce-cast" });
  disc(`${name}.stub`, F, s + 2 * d.ft, s + 2 * d.ft + 90, d.ro, { tone: "mid" }, { owner: owner + "2", cls: "ce-line" });
  disc(`${name}.e2`, F, s + 2 * d.ft + 90, s + 3 * d.ft + 90, d.fl, { tone: "mid" }, { owner: owner + "2", cls: "ce-cast", extra: Dots(G.dotsOf(F, s + 3 * d.ft + 90, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  return G.add3(F.o, G.mul3(F.a, s + 3 * d.ft + 90));
}
{
  // el vapor: tramo de afuera, brida, válvula, la línea y su par de bridas
  const own = "vap", d = NV, F = FXL(CE.yRef, HD.zTop);
  disc("vap.stub", F, vap.s0, vap.sF, d.ro, { tone: "mid" }, { owner: own, cls: "ce-line" });
  disc("vap.fl", F, vap.sF, vap.sF + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ce-cast" });
  const v = ballValve("vap.valve", F, vap.sF + d.ft, d, { owner: own });
  disc("vap.fl2", F, v.s1, v.s1 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ce-cast" });
  const sE = 2300;
  disc("vap.pipe", F, v.s1 + d.ft, sE, d.ro, { tone: "mid" }, { owner: own, cls: "ce-line" });
  ANCH.VAPOR_END = lineEnd("vap.end", F, sE, d, own);
  ANCH.VAPOR = G.pointOf(F, (v.s1 + sE) / 2, d.ro, PI / 2);
  ANCH.VALV_VAPOR = v.top;
}
{
  // el líquido: tramo de afuera y brida horizontales; de ahí la válvula y la línea bajan 1 en 50 hacia el recibidor
  const own = "liq", d = NL, F = FXL(CE.yRef, HD.zBot);
  disc("liq.stub", F, liq.s0, liq.sF, d.ro, { tone: "mid" }, { owner: own, cls: "ce-line" });
  disc("liq.fl", F, liq.sF, liq.sF + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ce-cast" });
  const a = G.unit3([1, 0, -liq.slope]), o = [liq.sF + d.ft, CE.yRef, HD.zBot];
  const Fs = { o, a, u: YD, v: G.unit3(G.cross3(a, YD)) };
  const v = ballValve("liq.valve", Fs, 0, d, { owner: own, stem: G.unit3(G.cross3(YD, a)), lever: 150 });
  disc("liq.fl2", Fs, v.s1, v.s1 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ce-cast" });
  disc("liq.pipe", Fs, v.s1 + d.ft, liq.run, d.ro, { tone: "mid" }, { owner: own, cls: "ce-line" });
  ANCH.LIQUIDO_END = lineEnd("liq.end", Fs, liq.run, d, own);
  ANCH.LIQUIDO = G.pointOf(Fs, (v.s1 + liq.run) / 2, d.ro, -PI / 2);
  ANCH.VALV_LIQUIDO = v.top;
}

/* ====================================================================
   8 · el agua: la succión de la bandeja, la bomba de recirculación, la tubería que sube al distribuidor, la te de la
   purga con su válvula y su embudo, y la línea de la reposición
   ==================================================================== */
box("stand.pumppad", [1780, 150, 0], [2720, 1000, 100], { tone: "mid" }, { r: 5, steps: 2, bevel: 0.5, cls: "ce-conc", ground: true });
{
  const own = "pump", d = NP, F = FXL(CE.yPump, PU.z);
  disc("suc.stub", F, pSuc.s0, pSuc.sF, d.ro, { tone: "mid" }, { owner: "suc", cls: "ce-pipe" });
  disc("suc.fl", F, pSuc.sF, pSuc.sF + d.ft, d.fl, { tone: "mid" }, { owner: "suc", cls: "ce-cast" });
  const v = ballValve("suc.valve", F, pSuc.sF + d.ft, d, { owner: "suc", lever: 200 });
  // la bomba: la brida y la boca de la succión, la voluta, la linterna, el motor y su tapa del ventilador
  disc("pump.sfl", F, v.s1, v.s1 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ce-pump" });
  disc("pump.snz", F, v.s1 + d.ft, xVol0 + 4, d.ro + 6, { tone: "mid" }, { owner: own, cls: "ce-pump" });
  const vol = [[xVol0, 80], [xVol0 + 5, PU.R - 22], [xVol0 + 16, PU.R, 1], [xVol0 + PU.W - 16, PU.R, 1], [xVol0 + PU.W - 5, PU.R - 22], [xVol0 + PU.W, 96]];
  turned("pump.volute", F, vol, { tone: "mid" }, { owner: own, cls: "ce-pump" });
  const Fd = { o: [xVolC, CE.yPump, PU.z], a: ZD3, u: YD, v: XD };
  const host = A.solid(F, vol.map(([s, r]) => [s, r]));
  saddle("pump.dnz", Fd, NS.ro + 4, (t) => G.saddleStart(PU.R, NS.ro + 4, t), zDis - NS.ft - PU.z, { tone: "mid" }, { owner: own, cls: "ce-pump", hosts: [host] });
  disc("pump.dfl", FZ(xVolC, CE.yPump, 0), zDis - NS.ft, zDis, NS.fl, { tone: "mid" }, { owner: own, cls: "ce-pump", extra: Dots(G.dotsOf(FZ(xVolC, CE.yPump, 0), zDis, NS.bc, NS.nb, P, { all: true, phase: PI / 4 }), { size: 0.45 }) });
  const xa = xVol0 + PU.W;
  disc("pump.lantern", F, xa, xa + 60, 92, { tone: "mid" }, { owner: own, cls: "ce-pump" });
  let fins = "";
  for (let q = 0; q < 24; q++) { const ang = (q / 24) * TAU, n3 = [0, Math.cos(ang), Math.sin(ang)]; if (G.dot3(n3, V3) > 0.15) fins += path3([[xa + 60, CE.yPump + 110.4 * Math.cos(ang), PU.z + 110.4 * Math.sin(ang)], [xa + 420, CE.yPump + 110.4 * Math.cos(ang), PU.z + 110.4 * Math.sin(ang)]]); }
  disc("pump.motor", F, xa + 60, xa + 420, 110, { tone: "mid" }, { owner: own, cls: "ce-motor", extra: Ln(fins, { tone: "faint" }) });
  disc("pump.cowl", F, xa + 420, xa + 480, 102, { tone: "mid" }, { owner: own, cls: "ce-motor" });
  fp("pump.tbox", { o: [0, CE.yPump, PU.z], a: XD, u: YD, v: ZD3 }, rect(-45, 45, 109, 175), xa + 150, xa + 250, { tone: "mid" }, { owner: own, cls: "ce-motor" });
  // la base: una placa sobre la losa, el pie de la voluta y los dos del motor
  box("pump.base", [v.s1 - 20, CE.yPump - 170, 100], [xa + 500, CE.yPump + 170, 130], { tone: "mid" }, { owner: own, cls: "ce-paint", r: 3 });
  box("pump.foot0", [xVolC - 30, CE.yPump - 70, 130], [xVolC + 30, CE.yPump + 70, PU.z - PU.R], { tone: "mid" }, { owner: own, cls: "ce-pump", r: 2 });
  box("pump.foot1", [xa + 120, CE.yPump - 95, 130], [xa + 190, CE.yPump + 95, PU.z - 110 + 3], { tone: "mid" }, { owner: own, cls: "ce-motor", r: 2 });
  box("pump.foot2", [xa + 300, CE.yPump - 95, 130], [xa + 370, CE.yPump + 95, PU.z - 110 + 3], { tone: "mid" }, { owner: own, cls: "ce-motor", r: 2 });
  ANCH.BOMBA = G.add3([xVolC, CE.yPump, PU.z], G.mul3(HV, PU.R));
  ANCH.VALV_SUCCION = v.top;
}
{
  // la tubería al distribuidor: de la descarga a la te de la purga y de ahí sube junto al extremo y entra por la pared
  const own = "riser", d = NS, Rb = d.ro * 1.6, tee = [xVolC, CE.yPump, zTee];
  ball("riser.tee", tee, Rb, { tone: "mid" }, { owner: "riser.tee", cls: "ce-pipe" });
  pipe("riser.p0", [[xVolC, CE.yPump, zDis], tee], d.ro, { cls: "ce-pipe", balls: [{ at: "end", c: tee, R: Rb }], owner: own });
  disc("spray.out", FXL(CE.ySpray, SP.z), sprayOut.s0, sprayOut.sF, d.ro, { tone: "mid" }, { owner: "spray.out", cls: "ce-pipe" });
  disc("spray.outfl", FXL(CE.ySpray, SP.z), sprayOut.sF, sprayOut.sF + d.ft, d.fl, { tone: "mid" }, { owner: "spray.out", cls: "ce-cast" });
  disc("riser.fl", FXL(CE.ySpray, SP.z), sprayOut.sF + d.ft, sprayOut.sF + 2 * d.ft, d.fl, { tone: "mid" }, { owner: "spray.out", cls: "ce-cast" });
  const xe = sprayOut.sF + 2 * d.ft;
  const route = G.fillet([tee, [xVolC, CE.yPump, 1860], [xRiser, CE.yPump, 1860], [xRiser, CE.yPump, SP.z], [xe, CE.ySpray, SP.z]], 95, 10, { P, tube: d.ro });
  pipe("riser.p1", route, d.ro, { cls: "ce-pipe", balls: [{ at: "start", c: tee, R: Rb }], owner: own });
  ANCH.TUBERIA = [xRiser + d.ro * 0.7, CE.yPump, 2200];
  // la purga: de la te, una válvula, y baja a un embudo sobre el desagüe de la losa
  const b = NB, yv0 = CE.yPump + Rb + 70;
  pipe("bleed.p0", [tee, [xVolC, yv0, zTee]], b.ro, { cls: "ce-pipe", balls: [{ at: "start", c: tee, R: Rb }], owner: "bleed" });
  const Fv = { o: [xVolC, 0, zTee], a: YD, u: XD, v: ZD3 };
  const v = ballValve("bleed.valve", Fv, yv0, b, { owner: "bleed.valve", lever: 110 });
  const yv1 = v.s1, yd = yv1 + 110;
  const route2 = G.fillet([[xVolC, yv1, zTee], [xVolC, yd, zTee], [xVolC, yd, 262]], 40, 8, { P, tube: b.ro });
  tubeItems("bleed.out", route2, b.ro, { cls: "ce-pipe", owner: "bleed.line", ends: [true, false] });
  const Ft = FZ(xVolC, yd, 100);
  const opening = `<path class="ce-bore-dk" d="${pth1(arcPts(66, 232.3, 0, TAU, 40, xVolC, yd).slice(0, -1).map(pr))}"/>` + Ln(pth1(arcPts(66, 232.4, 0, TAU, 40, xVolC, yd).slice(0, -1).map(pr)), { tone: "lo" });
  turned("bleed.tundish", Ft, [[46, 24], [62, 24], [124, 74], [132, 76]], { tone: "mid" }, { owner: "bleed.tundish", cls: "ce-ss", extra: opening });
  disc("bleed.drain", Ft, 6, 46, 22, { tone: "mid" }, { owner: "bleed.tundish", cls: "ce-ss" });
  box("stand.drain", [xVolC - 120, yd - 120, 100], [xVolC + 120, yd + 120, 106], { tone: "mid" }, { r: 4, steps: 2, bevel: 0.4, cls: "ce-cast" });
  ANCH.PURGA = G.pointOf(Fv, (yv0 + yv1) / 2, b.fl, PI / 2);
  ANCH.PURGA_LINEA = [xVolC, yd, 500];
}
{
  // la reposición: entra por la pared de la bandeja, con su válvula
  const own = "make", d = NM, F = FXL(yMk, zMk);
  disc("make.stub", F, xOut, xOut + 60, d.ro, { tone: "mid" }, { owner: own, cls: "ce-pipe" });
  disc("make.fl", F, xOut + 60, xOut + 60 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ce-cast" });
  const v = ballValve("make.valve", F, xOut + 60 + d.ft, d, { owner: own, lever: 120 });
  disc("make.fl2", F, v.s1, v.s1 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ce-cast" });
  disc("make.pipe", F, v.s1 + d.ft, 1830, d.ro, { tone: "mid" }, { owner: own, cls: "ce-pipe" });
  ANCH.REPOSICION_END = lineEnd("make.end", F, 1830, d, own);
  ANCH.REPOSICION = G.pointOf(F, 1790, d.ro, PI / 2);
}

/* ====================================================================
   9 · las flechas: el aire (entra por las persianas, sube por el haz, sale por la chimenea) y el agua (cae de las
   boquillas); blancas con borde
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
  return { mid: pts[Math.floor(pts.length / 2)], svg: `<path class="ce-flujo-o" d="${line}"/><path class="ce-flujo" d="${line}"/><path class="ce-flujo-p" d="${head}"/>`, shapes: [A.tube(pts, r), A.ball(pts[pts.length - 1], w / G.scaleOf(P))] };
}
function arrow(name, ctl, opts = {}) { const f = arrowOf(ctl, opts); put(name, f.mid, f.svg, f.shapes); }
{
  const yA = YB - 7;
  // el aire que entra por las persianas del extremo de +x
  arrow("air.in0", [[2150, -480, 1150], [xOut + 70, -480, 1150]]);
  arrow("air.in1", [[2150, 40, 1060], [xOut + 70, 40, 1060]]);
  // el aire que sube por el haz, en el plano del panel que se quitó, y se recoge hacia la chimenea
  arrow("air.up0", [[-1440, yA, 1080], [-1150, yA, 1250], [-1050, yA, 1700], [-1000, yA, 2350], [-850, yA, 2990]]);
  arrow("air.up1", [[-420, yA, 1250], [-390, yA, 1650], [-420, yA, 2300], [-330, yA, 2990]]);
  arrow("air.up2", [[300, yA, 1250], [330, yA, 1650], [290, yA, 2300], [240, yA, 2990]]);
  arrow("air.up3", [[1440, yA, 1150], [1160, yA, 1320], [1030, yA, 1750], [960, yA, 2350], [780, yA, 2990]]);
  // el aire que sale por la malla
  arrow("air.out0", [[-260, -120, zS1 + 40], [-330, -140, zS1 + 220], [-420, -160, zS1 + 420]]);
  arrow("air.out1", [[60, -60, zS1 + 40], [60, -60, zS1 + 240], [70, -60, zS1 + 460]]);
  arrow("air.out2", [[340, -240, zS1 + 40], [410, -270, zS1 + 220], [500, -300, zS1 + 410]]);
  ANCH.AIRE_SUBE = [-1000, yA, 2300];
  ANCH.AIRE_SALE = [70, -60, zS1 + 300];
}

/* ---------- la persona de referencia: 1,75 m, de pie a la izquierda de la caja (../persona.mjs) ---------- */
{
  const PS = process.env.CE_PER ? Object.fromEntries(["x", "y", "rumbo"].map((kk, i) => [kk, Number(process.env.CE_PER.split(",")[i])])) : CE.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, 0], rumbo: PS.rumbo, mm: 1, adelante: "izq" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.PECHO;
}

/* ---------- orden y salida ---------- */
if (process.env.CE_ITEM) {
  for (const nm of process.env.CE_ITEM.split(",")) {
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
if (!FAST && process.env.CE_PAIRS) {
  const names = process.env.CE_PAIRS.split(","), its = R_.settled.items;
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
const CSS = `.ce-gal{${ACERO}}.ce-ss{${ACERO}}.ce-pipe{${ACERO}}.ce-blade{${ACERO}}
.ce-tube{${FUND}}.ce-cast{${FUND}}.ce-lever{${FUND}}.ce-line{${FUND}}.ce-float{${FUND}}
.ce-paint{${PINT}}.ce-motor{${PINT}}.ce-pump{${PINT}}.ce-pvc{${PINT}}.ce-noz{${PINT}}
.ce-conc{${shades("#e8e6e1", "#e8e6e1", "#efede9", "#d2cfc8", "#d9d6d0", "#dfddd7", "#e4e2dc")}}
.ce-yel{${shades("#f3e9a6", "#f3e9a6", "#f8f1c4", "#dccf7e", "#e4d88d", "#ebe09a", "#efe5a1")}}
.ce-dark{${shades("#8a96a3", "#8a96a3", "#8a96a3", "#8a96a3", "#8a96a3", "#8a96a3", "#8a96a3")}}
.ce-bore{fill:#aeb8c2;stroke:none}.ce-bore-dk{fill:#525c64;stroke:none}
.ce-agua-cara{fill:#bcd0e6;fill-opacity:.45}.ce-agua-sup{fill:#bcd0e6;fill-opacity:.32}
.ce-agua .iso-line[data-tone="lo"]{stroke:#8fb0cf}
.ce-gota{fill:#2e5e9e}
.ce-malla.iso-line{stroke:#525c64}
.ce-flujo-o{fill:none;stroke:#525c64;stroke-width:3.4px;stroke-linecap:round;stroke-linejoin:round}
.ce-flujo{fill:none;stroke:#ffffff;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round}
.ce-flujo-p{fill:#ffffff;stroke:#525c64;stroke-width:1px;stroke-linejoin:round}
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
const svg = k.figureSvg({ width: W, height: H, label: "Condensador evaporativo en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="ce-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Condensador evaporativo", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUT, "fig_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
