/* ====================================================================
   El alambique de cobre en isométrico (skill anatomy), para la pestaña
   «Alambique» del Explorador de destilación por lotes.
   Concepto: el calderín se carga una vez y se calienta con vapor por su
   camisa. El vapor sale en equilibrio con el líquido (una sola etapa, la
   de Rayleigh), sube por el capitel y el cuello de cisne, baja por el
   brazo y se condensa en el serpentín sumergido en el tanque de agua. El
   destilado entra al loro, donde flota el densímetro, y del loro cae al
   recipiente del corte que toca: cabezas, corazón o colas.
   Lo que se mueve sale del modelo: el nivel del visor y de la mirilla es
   la carga W que queda, el termómetro marca T, el densímetro sigue a x_D
   instantánea, en el colector se abre la llave del corte que toca y su
   chorro cae al recipiente, y cada recipiente se llena con su destilado y
   su composición.
   Corte: el tanque del serpentín, el loro y los recipientes se cortan por
   el plano vertical que mira al lector; el calderín va entero, con su
   visor de nivel y su mirilla.
   Unidades: 1 = 1 cm. z hacia arriba.
   ==================================================================== */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
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

// los datos de la variante con columna (columna.mjs), si ya se armó
function colData() { try { return readFileSync(join(HERE, "out-col", "data.json"), "utf8"); } catch (e) { return "null"; } }
if (process.argv.includes("--js")) {
  const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
  writeFileSync(join(HERE, "out", "fig.js"), "/* alambique en isométrico: generado por build.mjs */\nvar ST_DATA = " + readFileSync(join(HERE, "alambique_data.json"), "utf8") + ";\nvar ST_COL_DATA = " + colData() + ";\nvar FStill = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FStill;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "st.css"), "utf8"));
  writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Alambique", theme: "light", width: 900, body: `<style>${readFileSync(join(HERE, "st.css"), "utf8")}</style><div class="iso-stage" id="stFig">${readFileSync(join(HERE, "out", "fig.svg"), "utf8")}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + readFileSync(join(HERE, "drive_test.js"), "utf8") }));
  console.log("out/fig.js, out/fig.css, preview.html"); process.exit(0);
}
const W = 640, H = 600, AZ = +(process.env.AZ || 45), EL = +(process.env.EL || 30);
const D = GEO.SG; // medidas compartidas con la página
const { T, HV } = GEO.axesOf(AZ);
const Wp = (t, h, z) => [t * T[0] + h * HV[0], t * T[1] + h * HV[1], z];

const EXT = [Wp(-104, -30, 0), Wp(-110, 20, 0), Wp(-110, 18, 58), Wp(-60, 44, 0), Wp(-62, 6, 142), Wp(-96, 6, 100), Wp(20, -46, 116), Wp(70, -46, 116), Wp(106, -16, 0), Wp(106, -3, 54), Wp(30, 58, 0), Wp(10, 58, 0)];
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = R_.solid;
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", ground } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground }, steps));
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style }) + extra, [shape]);
  return shape;
}
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", live = null, skip = null, cls = "", cut = null, ref = null, cap = "auto" } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, ...(cut ? { cut } : {}) }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  const svg = live ? "" : X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra;
  put(name, centre, svg, [shape], live ? { live } : {});
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", rims, owner, smooth, steps, bevel = 0, cls = "", hole = null, cut = null, fill } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(hole ? { hole } : {}), ...(fill ? { fill } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, radius: smooth && smooth.radius ? smooth.radius : null, ...(cut ? { cut } : {}) }));
  const body = S(paths, { tone: "mid", ...style }) + extra;
  put(name, G.add3(F.o, G.mul3(F.a, mid)), cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
const disc = (name, F, s0, s1, r, style = {}, options = {}) => turned(name, F, [[s0, r], [s1, r]], style, options);
function ring(name, F, s0, s1, rIn, rOut, style = {}, { extra = "", owner, cls = "", hole = false } = {}) {
  const paths = G.ringBand(s0, s1, rIn, rOut, F, P, hole ? { hole: [s1, rIn] } : {});
  const shape = record(A.ring(F, s0, s1, rIn, rOut, { name, owner }));
  const body = S(paths, { tone: "mid", ...style }) + extra;
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
const ZA = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const CUT = (o) => G.frameOf(o, [0, 0, 1], T, HV); // u a lo largo del plano de corte, v hacia el lector
function tubeItems(name, route, r, { tone = "hi", maxLength = 14, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true] } = {}) {
  R_.route(name, route, r, { owner: name, gaps, ends, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(0.6, Math.min(2.2, (typeof r === "function" ? r(0.5) : r) * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: cls ? `<g class="${cls}">${svg}</g>` : svg, move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] });
  });
}
// un racor, un codo o el cuerpo de una válvula: una esfera con el paso de cada tubo que la cruza o termina en ella
const BALLS = new Map();
function ball(name, c, R, style = {}, { owner, cls = "", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(R + 0.6))), G.add3(c, G.mul3(b.dir, R + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, R, { name, owner, ...(cut.length ? { cut } : {}) }));
  const body = S(G.sphereOf(c, R, P), { tone: "mid", ...style });
  put(name, c, cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  BALLS.set(name, { c, R });
  return shape;
}
// dónde entra a una esfera de radio R un tubo de radio r: a sqrt(R² − r²) del centro, el borde del tubo queda en la esfera
const entry = (R, r) => Math.sqrt(Math.max(0, R * R - r * r)) - 0.02;
/* un tubo: se redondean los codos. Cada esfera de la lista abre un hueco en el dibujo donde el tubo la cruza; una
   esfera en un extremo (at: "start" o "end") recibe el tubo hasta su superficie. Cada collar (c, half) abre su hueco. */
function pipe(name, control, r, { bend = 3, tone = "hi", flanges = [false, false], flangeR = 1.6, cls = "", maxLength = 14, balls = [], collars = [], open = [false, false], breaks = [] } = {}) {
  const ctl = control.map((q) => [...q]);
  for (const b of balls) {
    if (b.at !== "start" && b.at !== "end") continue;
    const i = b.at === "start" ? 0 : ctl.length - 1, j = b.at === "start" ? 1 : ctl.length - 2, dir = G.unit3(G.sub3(ctl[j], b.c));
    ctl[i] = G.add3(b.c, G.mul3(dir, entry(b.R, r)));
    b.dir = dir;
  }
  const line = G.fillet(ctl, Math.max(r * bend, 3), 12, { P, tube: r });
  const total = G.pathLength(line), gaps = [];
  [[0, -1], [total, 1]].forEach(([along, sign], index) => {
    if (!flanges[index]) return;
    const thick = Math.max(0.9, r * 0.5), tangent = G.tangentAlong(line, along);
    const centre = G.add3(G.pointAlong(line, along), G.mul3(tangent, (-sign * thick) / 2));
    gaps.push(sign < 0 ? [0, thick] : [total - thick, total]);
    disc(`${name}.flange${index}`, G.frameAlong(centre, tangent), -thick / 2, thick / 2, r * flangeR, { tone }, { owner: name, cls });
  });
  const nearest = (c) => { let best = 0, bd = 1e9; for (let q = 0; q <= total; q += 0.05) { const d = G.len3(G.sub3(G.pointAlong(line, q), c)); if (d < bd) { bd = d; best = q; } } return best; };
  for (const b of balls) {
    let dir = b.dir;
    if (b.at !== "start" && b.at !== "end") { const q = nearest(b.c), dd = entry(b.R, r); gaps.push([Math.max(0, q - dd), Math.min(total, q + dd)]); dir = G.tangentAlong(line, q); }
    const mine = b.at === "start" || b.at === "end" ? [] : [{ owner: name, dir, r }];
    if (!b.shared) ball(b.name, b.c, b.R, b.style || {}, { bores: [...mine, ...(b.bores || [])], cls: b.cls || "" });
  }
  for (const k2 of collars) { const q = nearest(k2.c); gaps.push([q - k2.half, q + k2.half]); }
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), cls, maxLength, breaks, ends: [!open[0], !open[1]] });
  return line;
}
function mergeGaps(gs) { const s = gs.filter((g) => g[1] > g[0]).sort((a, b) => a[0] - b[0]), out = []; for (const g of s) { const l = out[out.length - 1]; if (l && g[0] <= l[1]) l[1] = Math.max(l[1], g[1]); else out.push([...g]); } return out; }
const half = (r0, r1, n = 36) => GEO.halfRing(r0, r1, n);
function sector(r0, r1, a0, a1, n = 12) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = (a0 + ((a1 - a0) * i) / n) * (Math.PI / 180); out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = (a0 + ((a1 - a0) * i) / n) * (Math.PI / 180); out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
function crossings(line, f) { const out = [], tot = G.pathLength(line); let prev = null; for (let q = 0; q <= tot; q += 0.1) { const v = f(G.pointAlong(line, q)); if (prev !== null && Math.sign(v) !== Math.sign(prev.v) && Math.abs(v - prev.v) > 1e-9) out.push(prev.q + (0.1 * Math.abs(prev.v)) / Math.abs(v - prev.v)); prev = { q, v }; } return out; }
// un asiento: el cilindro que sale de una superficie curva hasta una cara plana, cortado justo en la superficie
function pad(name, hosts, point, outward, a, h, style = {}, { owner, cls = "", extra = "" } = {}) {
  const hs = [hosts].flat(), inside = (p) => hs.some((shape) => A.sdf(shape, p) < 0);
  const axis = G.unit3(outward), F = G.frameAlong(point, axis);
  const start = (angle) => { let lo = -2.5 * a, hi = h; if (!inside(G.pointOf(F, lo, a, angle))) return 0; for (let k2 = 0; k2 < 40; k2++) { const mid = (lo + hi) / 2; if (inside(G.pointOf(F, mid, a, angle))) lo = mid; else hi = mid; } return hi; };
  const low = Math.min(...Array.from({ length: 48 }, (_, i) => start((i / 48) * Math.PI * 2)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, G.add3(point, G.mul3(axis, h / 2)), cls ? `<g class="${cls}">${body}</g>` : body, [record(A.disc(F, low - 0.05, h, a, { name, owner, seated: true, cut: hs }))]);
  return { F, face: G.add3(point, G.mul3(axis, h)) };
}

/* ---------- ayudas: vectores, planos de esfera y piezas pequeñas ---------- */
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1], addv = (p, d, kk) => [p[0] + d[0] * kk, p[1] + d[1] * kk, p[2] + (d[2] || 0) * kk];
const D2R = Math.PI / 180;
function planeM(c, e1, e2) {
  const o = at(c), a = at(G.add3(c, e1)), b = at(G.add3(c, e2));
  return `matrix(${(a[0] - o[0]).toFixed(4)} ${(a[1] - o[1]).toFixed(4)} ${(b[0] - o[0]).toFixed(4)} ${(b[1] - o[1]).toFixed(4)} ${o[0].toFixed(3)} ${o[1].toFixed(3)})`;
}
function faceBasis(n) { const e1 = G.unit3(G.cross3(ZD3, n)); return { e1, e2: G.unit3(G.cross3(n, e1)) }; }
const surfN = (F, slope, ang) => G.unit3(G.add3(G.radialOf(F, ang), G.mul3(F.a, -slope)));
function dial(name, c, n, r, { live, ticks = 9, owner, cls = "" } = {}) {
  const F = G.frameAlong(c, n);
  disc(`${name}.case`, F, -1.6, 0, r, { tone: "mid" }, { owner, cls });
  ring(`${name}.bezel`, F, 0, 0.35, r - 0.55, r, { tone: "hi" }, { owner: `${name}.case`, cls });
  const { e1, e2 } = faceBasis(n), face = G.add3(c, G.mul3(n, 0.36)), M = planeM(face, e1, e2);
  let tk = "";
  for (let i = 0; i < ticks; i++) { const t = (225 - (270 * i) / (ticks - 1)) * D2R, r0 = r - 1.45, r1 = r - (i % 2 ? 1.05 : 0.8); tk += `M${(r0 * Math.cos(t)).toFixed(2)} ${(r0 * Math.sin(t)).toFixed(2)}L${(r1 * Math.cos(t)).toFixed(2)} ${(r1 * Math.sin(t)).toFixed(2)}`; }
  return { M, html: `<g class="st-dial" transform="${M}"><path class="st-tick" d="${tk}"/><g data-live="${live}"><path class="st-needle" d="M-0.9 0L${(r - 1.6).toFixed(2)} 0"/></g><circle class="st-hub" r="0.55"/></g>` };
}
// bonete y volante de una válvula de globo: el bonete arranca en la superficie del cuerpo; el volante es de alma llena
function wheel(name, c, up, R) {
  const top = G.add3(c, G.mul3(up, R + 2.6));
  disc(`${name}.bonnet`, G.frameAlong(c, up), entry(R, 1.0), R + 2.6, 1.0, { tone: "mid" }, { owner: `${name}.body` });
  const HW = G.frameAlong(top, up);
  ring(`${name}.wheel`, HW, 0, 0.6, 0.8, 3.9, { tone: "hi" }, { owner: `${name}.bonnet` });
  return [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; return path3([G.pointOf(HW, 0.6, 1.0, a), G.pointOf(HW, 0.6, 3.15, a)]); }).join("") + G.arcOf(HW, 0.6, 3.25, P, { least: -1 });
}

/* ====================================================================
   1 · el calderín: patas, camisa de vapor, cuerpo, capitel y cuello
   ==================================================================== */
const PC = Wp(D.POT.t, D.POT.h, 0), Z0 = D.POT.z0;
const PF = ZA([PC[0], PC[1], Z0]);
const pr = GEO.potR, pslope = GEO.potSlope, PA = (deg) => deg * D2R;
for (let i = 0; i < 4; i++) {
  const x = PC[0] + Math.cos((i * Math.PI) / 2) * 31, y = PC[1] + Math.sin((i * Math.PI) / 2) * 31;
  box(`stand.leg${i}`, [x - 2, y - 2, 1], [x + 2, y + 2, Z0 + 20], { tone: "lo" }, { r: 0.3 });
  box(`stand.pad${i}`, [x - 4.5, y - 4.5, 0], [x + 4.5, y + 4.5, 1], { tone: "lo" }, { r: 0.6, extra: Dots([at([x - 3, y - 3, 1]), at([x + 3, y + 3, 1])], { size: 0.5 }) });
}
const jr = GEO.jackR, jsl = GEO.jackSlope;
const JACK = turned("jacket", PF, Array.from({ length: 13 }, (_, i) => { const s = -3 + (23 * i) / 12; return [s, jr(s), 1]; }), { tone: "mid" }, { smooth: { slope: jsl, radius: jr } });
ring("jacket.flange", PF, 20, 22, pr(20), 33, { tone: "mid" }, { extra: Dots(G.dotsOf(PF, 22, 31, 16, P, { all: true }), { size: 0.45 }) });
const SEAM = 33;
const POT = turned("pot", PF, Array.from({ length: 12 }, (_, i) => { const s = 22 + (22 * i) / 11; return [s, pr(s), 1]; }), { tone: "mid", inner: Ln(G.arcOf(PF, SEAM, pr(SEAM), P, { slope: pslope(SEAM) }), { tone: "faint" }) }, { smooth: { slope: pslope, radius: pr }, cls: "cu", extra: Dots(G.dotsOf(PF, SEAM, pr(SEAM), 28, P, { slope: pslope(SEAM), fade: [0.04, 0.42] }), { size: 0.4 }) });
ring("pot.flange", PF, 44, 46, pr(44) - 1.2, 17.5, { tone: "mid" }, { cls: "cu" });
ring("helmet.flange", PF, 46, 48, GEO.helmR(48) - 1.2, 17.5, { tone: "mid" }, { cls: "cu", extra: Dots(G.dotsOf(PF, 48, 16.6, 10, P, { all: true }), { size: 0.45 }) });
const HELM = turned("helmet", PF, Array.from({ length: 13 }, (_, i) => { const s = 48 + (22 * i) / 12; return [s, GEO.helmR(s), 1]; }), { tone: "mid" }, { smooth: { slope: GEO.helmSlope, radius: GEO.helmR }, cls: "cu" });
turned("neck", PF, [[70, GEO.helmR(70)], [84, 4.4]], { tone: "mid" }, { cls: "cu" });

// la mirilla: al frente, a la altura por la que pasa el nivel durante el lote
const MIR = { s: 31, ang: PA(45), r: 5 };
const mN = surfN(PF, pslope(MIR.s), MIR.ang), mP = G.pointOf(PF, MIR.s, pr(MIR.s), MIR.ang);
const mPad = pad("pot.porthole.boss", POT, mP, mN, MIR.r + 1.4, 1.6, {}, { owner: "pot", cls: "cu" });
const mF = G.frameAlong(mPad.face, mN);
// el anillo y el vidrio van en una sola pieza: el vidrio, al ras del anillo, se pinta encima de su hueco
const mGlass = `<g class="st-glass">${S(G.disc(0.3, 0.9, MIR.r - 0.2, mF, P), { tone: "hi" })}</g>`;
ring("pot.porthole.glass", mF, 0, 0.9, MIR.r - 0.2, MIR.r + 1.6, { tone: "mid" }, { owner: "pot.porthole.boss", extra: Dots(G.dotsOf(mF, 0.9, MIR.r + 0.8, 8, P, { all: true }), { size: 0.4 }) + mGlass });
const mBasis = faceBasis(mN), mFace = G.add3(mPad.face, G.mul3(mN, 0.92)), MIRM = planeM(mFace, mBasis.e1, mBasis.e2);

// termómetro de esfera en el capitel: marca la temperatura del vapor, la del calderín en la etapa de equilibrio
const TH = { s: 62, ang: PA(45) };
const tN = surfN(PF, GEO.helmSlope(TH.s), TH.ang), tP = G.pointOf(PF, TH.s, GEO.helmR(TH.s), TH.ang);
const tPad = pad("thermo.well", HELM, tP, tN, 1.3, 3.2, {}, { owner: "helmet" });
const THD = dial("thermo", G.add3(tPad.face, G.mul3(tN, 1.6)), tN, 4.6, { live: "tneedle", owner: "thermo.well" });

// boca de carga en el hombro, a la izquierda, con su tapa ciega
const CH = { s: 40, ang: PA(100) };
const cN = surfN(PF, pslope(CH.s), CH.ang), cP = G.pointOf(PF, CH.s, pr(CH.s), CH.ang);
const cPad = pad("pot.charge", POT, cP, cN, 3.4, 3, {}, { owner: "pot", cls: "cu" });
const cF = G.frameAlong(cPad.face, cN);
disc("pot.charge.cap", cF, 0, 1.1, 4.3, { tone: "mid" }, { owner: "pot.charge", extra: Dots(G.dotsOf(cF, 1.1, 3.5, 6, P, { all: true }), { size: 0.4 }) });

// visor de nivel: toma arriba en el hombro y abajo en la línea de drenaje; el tubo de vidrio muestra el nivel del calderín
const GV = { ang: PA(20), r: 38, top: 40, R: 1.6, zb: Z0 - 9.5 };
const radG = G.radialOf(PF, GV.ang);
const gx = (rr, z) => { const p = G.pointOf(PF, 0, rr, GV.ang); return [p[0], p[1], z]; };
const gPad = pad("gauge.nozzle", POT, G.pointOf(PF, GV.top, pr(GV.top), GV.ang), radG, 1.5, 3, {}, { owner: "pot", cls: "cu" });
const gTop = gx(GV.r, Z0 + GV.top - 6.2), gBot = gx(GV.r, GV.zb);
pipe("gauge.top", [gPad.face, [gTop[0], gTop[1], gPad.face[2]], gTop], 0.9, { bend: 3, cls: "cu", balls: [{ name: "gauge.valve.top", c: gTop, R: GV.R, at: "end" }] });
const G0 = gBot[2] + entry(GV.R, 1.0), G1 = gTop[2] - entry(GV.R, 1.0);
disc("gauge.glass", ZA(gx(GV.r, G0)), 0, G1 - G0, 1.0, { tone: "hi" }, { cls: "st-glass" });
// drenaje: del fondo de la camisa a una te (de ahí sale la toma baja del visor), la válvula de bola y el desagüe del piso
const tee = [PC[0], PC[1], GV.zb], dv = [PC[0], PC[1], 15.6], hDir = G.radialOf(PF, PA(70));
const dPad = pad("pot.drain.nozzle", JACK, [PC[0], PC[1], Z0 - 3], [0, 0, -1], 1.7, 2.2, {}, { owner: "jacket" });
ball("drain.tee", tee, 1.8, { tone: "mid" }, { bores: [{ owner: "drain", dir: ZD3, r: 0.9 }] });
ball("drain.valve", dv, 2.2, { tone: "mid" }, { bores: [{ owner: "drain", dir: ZD3, r: 0.9 }] });
pipe("drain", [dPad.face, [PC[0], PC[1], 4.6]], 0.9, { cls: "cu", balls: [{ name: "drain.tee", c: tee, R: 1.8, shared: true }, { name: "drain.valve", c: dv, R: 2.2, shared: true }] });
pipe("gauge.bot", [tee, gBot], 0.9, { cls: "cu", balls: [{ name: "drain.tee", c: tee, R: 1.8, shared: true, at: "start" }, { name: "gauge.valve.bot", c: gBot, R: GV.R, at: "end" }] });
tubeItems("drain.handle", [addv(dv, hDir, entry(2.2, 0.45)), addv(dv, hDir, 9)], 0.45, { tone: "hi", maxLength: 20, ends: [true, false] });
turned("stand.drain", ZA([PC[0], PC[1], 0]), [[0, 3.6], [1.4, 3.6], [4.6, 1.4]], { tone: "lo" });

// vapor a la camisa: de la acometida del piso, por la válvula de globo, a una boquilla al costado; el manómetro, en una te
const ST = { s: 8, ang: PA(118) };
const radS = G.radialOf(PF, ST.ang);
const sPad = pad("steam.nozzle", JACK, G.pointOf(PF, ST.s, jr(ST.s), ST.ang), radS, 1.9, 3.2, {}, { owner: "jacket" });
const stFoot = G.pointOf(PF, 0, 41, ST.ang), stTee = G.pointOf(PF, ST.s, 35.4, ST.ang), vC = [stFoot[0], stFoot[1], 22];
ball("steam.tee", stTee, 1.9, { tone: "mid" }, { bores: [{ owner: "steam", dir: radS, r: 1.25 }] });
pipe("steam", [sPad.face, [stFoot[0], stFoot[1], sPad.face[2]], [stFoot[0], stFoot[1], 1.6]], 1.25, { bend: 3, balls: [{ name: "steam.tee", c: stTee, R: 1.9, shared: true }, { name: "steam.valve.body", c: vC, R: 2.4 }] });
const SPK = wheel("steam.valve", vC, G.unit3([radS[0], radS[1], 0]), 2.4);
turned("stand.steam.flange", ZA([stFoot[0], stFoot[1], 0]), [[0, 3.6], [1.6, 3.6]], { tone: "lo" }, { extra: Dots(G.dotsOf(ZA([stFoot[0], stFoot[1], 0]), 1.6, 2.7, 4, P, { all: true }), { size: 0.4 }) });
disc("steam.gauge.stem", ZA(stTee), entry(1.9, 0.5), 5.2, 0.5, { tone: "mid" }, { owner: "steam.tee" });
const sgN = G.unit3([HV[0], HV[1], 0.3]);
const SGD = dial("sgauge", G.add3(stTee, [0, 0, 8.6]), sgN, 3.6, { live: "sneedle", ticks: 7, owner: "steam.gauge.stem" });

// condensado: de la boquilla baja de la camisa a la trampa de vapor y al desagüe
const CO = { ang: PA(160) };
const radC = G.radialOf(PF, CO.ang);
const coPad = pad("cond.nozzle", JACK, G.pointOf(PF, -1, jr(-1), CO.ang), radC, 1.4, 3, {}, { owner: "jacket" });
const coOut = G.pointOf(PF, -1, 35, CO.ang);
pipe("cond", [coPad.face, [coOut[0], coOut[1], coPad.face[2]], [coOut[0], coOut[1], 25]], 0.9, { bend: 3 });
turned("cond.trap", ZA([coOut[0], coOut[1], 18]), [[0, 1.6], [1, 3.2], [6, 3.2], [7, 1.6]], { tone: "mid" }, { rims: "all" });
pipe("cond.down", [[coOut[0], coOut[1], 18], [coOut[0], coOut[1], 4.6]], 0.9, {});
turned("stand.cdrain", ZA([coOut[0], coOut[1], 0]), [[0, 3.2], [1.4, 3.2], [4.6, 1.4]], { tone: "lo" });

/* ====================================================================
   2 · el tanque del serpentín (en corte), el serpentín y el agua
   ==================================================================== */
const TC = Wp(D.TUB.t, D.TUB.h, 0), TF = CUT([TC[0], TC[1], 0]);
const { R: TR, TW: TT, z0: TZ0, z1: TZ1 } = D.TUB;
for (let i = 0; i < 4; i++) {
  const x = TC[0] + Math.cos((i * Math.PI) / 2) * 19, y = TC[1] + Math.sin((i * Math.PI) / 2) * 19;
  box(`stand.tleg${i}`, [x - 1.6, y - 1.6, 1], [x + 1.6, y + 1.6, TZ0 - 1.2], { tone: "lo" }, { r: 0.3 });
  box(`stand.tpad${i}`, [x - 3.4, y - 3.4, 0], [x + 3.4, y + 3.4, 1], { tone: "lo" }, { r: 0.5, extra: Dots([at([x - 2.4, y - 2.4, 1]), at([x + 2.4, y + 2.4, 1])], { size: 0.45 }) });
}
fp("tub.bottom", TF, half(0, TR + TT), TZ0 - 1.2, TZ0, { tone: "mid" }, { cls: "cu" });
const L = D.LORO;
const CR = GEO.coilRoute(TC, T, HV), cr = CR.drop;
// la salida: sale por el borde derecho del corte, un codo, y en línea recta hasta encima del loro, que se llena por arriba
const out0 = addv(TC, T, 31); out0[2] = D.COIL.bot;
const elb2 = addv(out0, XD, L.dx); elb2[2] = D.COIL.bot;
const LC = addv(elb2, HV, 2.8); LC[2] = 0;
const CEL = { c: CR.elbow, R: 2.2 };
const kneeDir = G.unit3(G.sub3(CR.helix[1], CEL.c));
const COIL = G.fillet([G.add3(CEL.c, G.mul3(kneeDir, entry(CEL.R, D.COIL.r))), ...CR.helix.slice(1), [out0[0] - T[0] * entry(2.2, D.COIL.r), out0[1] - T[1] * entry(2.2, D.COIL.r), D.COIL.bot]], D.COIL.rc, 12, { P, tube: D.COIL.r });
const cTotal = G.pathLength(COIL);
const wallP = addv(TC, T, TR + TT + 1); wallP[2] = D.COIL.bot;
const wallAt = (() => { let best = 0, bd = 1e9; for (let q = cTotal * 0.8; q < cTotal; q += 0.05) { const d = G.len3(G.sub3(G.pointAlong(COIL, q), wallP)); if (d < bd) { bd = d; best = q; } } return best; })();
disc("coil.bulkhead", G.frameAlong(wallP, T), -1, 0.6, D.COIL.r + 1.4, { tone: "mid" }, { owner: "coil", cls: "cu" });
const flTop = 0.9;
const DROP = [cr[0], [CEL.c[0], CEL.c[1], CEL.c[2] + entry(CEL.R, D.COIL.r)]];
disc("coil.union", G.frameAlong(G.add3(cr[0], [0, 0, -flTop / 2]), [0, 0, -1]), -flTop / 2, flTop / 2, D.COIL.r * 2.1, { tone: "mid" }, { cls: "cu" });
const cutSide = (p) => (p[0] - TC[0]) * HV[0] + (p[1] - TC[1]) * HV[1];
const cBreaks = [...crossings(COIL, cutSide), ...crossings(COIL, (p) => p[2] - D.TUB.water)];
ball("coil.knee", CEL.c, CEL.R, { tone: "mid" }, { cls: "cu" });
tubeItems("coil.drop", DROP, D.COIL.r, { tone: "hi", cls: "cu", maxLength: 9, gaps: [[0, flTop]], breaks: crossings(DROP, (p) => p[2] - D.TUB.water) });
ball("coil.elbow", out0, 2.2, { tone: "mid" }, { cls: "cu" });
const inAt = (() => { let best = 0, bd = 1e9; for (let q = cTotal * 0.8; q < cTotal; q += 0.05) { const d = Math.abs(G.len3(G.sub3(G.pointAlong(COIL, q), [TC[0], TC[1], D.COIL.bot])) - (TR - 0.1)); if (d < bd) { bd = d; best = q; } } return best; })();
tubeItems("coil", COIL, D.COIL.r, { tone: "hi", cls: "cu", maxLength: 9, gaps: [[inAt, wallAt + 0.6]], breaks: cBreaks });
pipe("outlet", [out0, elb2], D.COIL.r, { cls: "cu", balls: [{ name: "coil.elbow", c: out0, R: 2.2, shared: true, at: "start" }, { name: "loro.elbow", c: elb2, R: 2.2, at: "end", cls: "cu" }] });
// agua de enfriamiento: entra abajo y rebosa arriba, las dos por el borde izquierdo del corte
const tAt = (r, deg, z) => { const a = deg * D2R; return [TC[0] + r * (Math.cos(a) * T[0] + Math.sin(a) * HV[0]), TC[1] + r * (Math.cos(a) * T[1] + Math.sin(a) * HV[1]), z]; };
const mT = G.mul3(T, -1);
const WIN = { z: 47 }, WOUT = { z: D.TUB.water - 2.5 };
disc("tub.win", G.frameAlong(tAt(TR + TT, 180, WIN.z), mT), 0, 2.6, 2.1, { tone: "mid" }, { owner: "tub.wall.l", cls: "cu" });
disc("tub.wout", G.frameAlong(tAt(TR + TT, 180, WOUT.z), mT), 0, 2.6, 2.1, { tone: "mid" }, { owner: "tub.wall.l", cls: "cu" });
const winOut = tAt(32, 180, WIN.z), woutOut = tAt(41, 180, WOUT.z), wvC = [winOut[0], winOut[1], 24];
pipe("water.in", [[winOut[0], winOut[1], 1.6], [winOut[0], winOut[1], WIN.z], tAt(TR + TT + 2.6, 180, WIN.z)], 1.1, { bend: 3, balls: [{ name: "water.valve.body", c: wvC, R: 2.1 }] });
turned("stand.win.flange", ZA([winOut[0], winOut[1], 0]), [[0, 3.2], [1.6, 3.2]], { tone: "lo" });
const WSPK = wheel("water.valve", wvC, HV, 2.1);
pipe("water.out", [tAt(TR + TT + 2.6, 180, WOUT.z), [woutOut[0], woutOut[1], WOUT.z], [woutOut[0], woutOut[1], 4.6]], 1.1, { bend: 3 });
turned("stand.wdrain", ZA([woutOut[0], woutOut[1], 0]), [[0, 3.4], [1.4, 3.4], [4.6, 1.4]], { tone: "lo" });
// la pared en tres sectores: las dos franjas del corte y el fondo
const hole = A.disc(G.frameAlong(wallP, T), -4, 4, D.COIL.r + 0.08, { owner: "coil" });
fp("tub.wall.l", TF, sector(TR, TR + TT, 180, 192, 4), TZ0, TZ1, { tone: "mid" }, { cls: "cu" });
fp("tub.wall.b", TF, sector(TR, TR + TT, 192, 348, 30), TZ0, TZ1, { tone: "mid" }, { cls: "cu" });
fp("tub.wall.r", TF, sector(TR, TR + TT, 348, 360, 4), TZ0, TZ1, { tone: "mid" }, { cls: "cu", cut: hole });
fp("tub.rim", TF, half(TR - 0.4, TR + TT + 1.4), TZ1, TZ1 + 1.4, { tone: "mid" }, { cls: "cu" });
const WATER = X.prismSvg(C, half(0, TR - 0.05), TZ0, D.TUB.water, { F: TF, tone: "mid", flat: true, crease: "none" });
// el brazo de lyne: del cuello al tope del serpentín, bajando; las dos bridas de la unión se tocan
const ARM = G.fillet([[PC[0], PC[1], Z0 + 84], [PC[0], PC[1], Z0 + 96], [cr[0][0], cr[0][1], Z0 + 91], [cr[0][0], cr[0][1], cr[0][2] + flTop]], 14, 14, { P, tube: 4 });
const aTotal = G.pathLength(ARM);
disc("arm.union", G.frameAlong(G.pointAlong(ARM, aTotal - 0.45), G.tangentAlong(ARM, aTotal - 0.45)), -0.45, 0.45, D.COIL.r * 2.1, { tone: "mid" }, { cls: "cu" });
tubeItems("arm", ARM, (t) => 4.4 - 2.6 * Math.min(1, t * 1.25), { tone: "hi", cls: "cu", maxLength: 12, gaps: [[aTotal - 0.9, aTotal]] });

/* ====================================================================
   3 · el loro, el embudo, el distribuidor y los recipientes (en corte)
   ==================================================================== */
const LF = CUT([LC[0], LC[1], 0]);
// el loro va sobre una ménsula atornillada a un poste, detrás; el destilado entra por arriba y baja por dentro
const POST = addv(LC, YD, -13);
disc("stand.loro.foot", ZA([POST[0], POST[1], 0]), 0, 0.8, 4, { tone: "lo" }, { extra: Dots(G.dotsOf(ZA([POST[0], POST[1], 0]), 0.8, 3, 3, P, { all: true }), { size: 0.4 }) });
disc("stand.loro.post", ZA([POST[0], POST[1], 0]), 0.8, L.z0 - 1.2, 1.2, { tone: "lo" });
box("loro.bracket", [LC[0] - 1.2, POST[1] + 1.2, L.z0 - 2.4], [LC[0] + 1.2, LC[1] - 1, L.z0 - 1], { tone: "lo" }, { r: 0.1 });
fp("loro.bottom", LF, half(0, L.r + L.TW), L.z0 - 1, L.z0, { tone: "mid" }, { cls: "cu" });
fp("loro.wall", LF, half(L.r, L.r + L.TW), L.z0, L.z1, { tone: "mid" }, { cls: "cu" });
pipe("loro.in", [elb2, [elb2[0], elb2[1], L.z0 + 2]], 0.9, { cls: "cu", open: [false, true], balls: [{ name: "loro.elbow", c: elb2, R: 2.2, shared: true, at: "start" }] });
// el pico: sale por el borde izquierdo del corte y cae al embudo
const FU = D.FUN, FC = addv(LC, T, -FU.dx);
const bossP = addv([LC[0], LC[1], L.spill], T, -(L.r + L.TW));
const beakEnd = [FC[0] + T[0] * 1.2, FC[1] + T[1] * 1.2, L.spill - 2.2], beakDir = G.unit3(G.sub3(beakEnd, bossP));
disc("loro.boss", G.frameAlong(bossP, beakDir), 0, 1.0, 1.25, { tone: "mid" }, { owner: "loro.wall", cls: "cu" });
tubeItems("loro.beak", [addv(bossP, beakDir, 1.0), beakEnd], 0.8, { tone: "hi", cls: "cu", ends: [true, false], maxLength: 20 });
turned("funnel", ZA([FC[0], FC[1], FU.z0]), [[0, FU.r0], [FU.z1 - FU.z0, FU.r1]], { tone: "mid" }, { cls: "cu" });
const J = D.JAR, jarAt = (d) => addv(FC, YD, d);
const MANEND = addv(FC, YD, J.d[2] + 25), MSUP = addv(FC, YD, J.d[2] + 14.5);
const tees = J.d.map((d, i) => { const c = jarAt(d); return { name: `tee${i}`, c: [c[0], c[1], D.MAN.z], R: 1.9, cls: "cu" }; });
pipe("manifold", [[FC[0], FC[1], FU.z0], [FC[0], FC[1], D.MAN.z], [MANEND[0], MANEND[1], D.MAN.z]], D.MAN.r, { bend: 3, cls: "cu", balls: tees, collars: [{ c: [MSUP[0], MSUP[1], D.MAN.z], half: 0.62 }] });
disc("manifold.cap", G.frameAlong([MANEND[0], MANEND[1], D.MAN.z], YD), 0, 0.9, D.MAN.r + 0.5, { tone: "mid" }, { cls: "cu" });
disc("stand.man.foot", ZA([MSUP[0], MSUP[1], 0]), 0, 0.8, 2.4, { tone: "lo" });
disc("stand.man.post", ZA([MSUP[0], MSUP[1], 0]), 0.8, D.MAN.z - D.MAN.r - 0.9, 0.9, { tone: "lo" });
ring("man.clamp", G.frameAlong([MSUP[0], MSUP[1], D.MAN.z], YD), -0.6, 0.6, D.MAN.r + 0.02, D.MAN.r + 0.9, { tone: "mid" }, { owner: "manifold" });
const JARS = [];
J.d.forEach((d, i) => {
  const JC = jarAt(d), JF = CUT([JC[0], JC[1], 0]);
  disc(`stand.plinth${i}`, ZA([JC[0], JC[1], 0]), 0, J.z0, J.r + J.TW + 1.6, { tone: "lo" }, { cls: "st-tag" + i });
  fp(`jar${i}.bottom`, JF, half(0, J.r + J.TW), J.z0, J.z0 + 0.8, { tone: "mid" });
  fp(`jar${i}.wall`, JF, half(J.r, J.r + J.TW), J.z0 + 0.8, J.z1, { tone: "mid" });
  fp(`jar${i}.rim`, JF, half(J.r - 0.2, J.r + J.TW + 0.9), J.z1, J.z1 + 0.8, { tone: "mid" });
  const cc = [JC[0], JC[1], J.cock];
  pipe(`drop${i}`, [[JC[0], JC[1], D.MAN.z], [JC[0], JC[1], J.z1 + 2.6]], 0.75, { cls: "cu", open: [false, true], balls: [{ name: `tee${i}`, c: [JC[0], JC[1], D.MAN.z], R: 1.9, shared: true, at: "start" }, { name: `cock${i}`, c: cc, R: 1.5, bores: [{ owner: `cock${i}.stem`, dir: HV, r: 0.45 }] }] });
  disc(`cock${i}.stem`, G.frameAlong(cc, HV), entry(1.5, 0.45), 2.4, 0.45, { tone: "mid" }, { owner: `cock${i}` });
  JARS.push({ c: JC, F: JF });
});

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
{
  const midOf = (it) => { const pts = it.shapes[0].points; return pts[Math.floor(pts.length / 2)]; };
  const isBack = (it) => (/^coil(\.drop)?:/.test(it.name) && cutSide(midOf(it)) < 0 && midOf(it)[2] < D.TUB.water) || /^tub\.(wall|bottom)/.test(it.name);
  const isFront = (it) => /^coil(\.drop)?:/.test(it.name) && !isBack(it) && midOf(it)[2] < D.TUB.water + 2;
  let wAt = -1; R_.items.forEach((it, i) => { if (isBack(it)) wAt = i; });
  const moving = R_.items.filter((it, i) => i < wAt && isFront(it));
  if (moving.length) {
    const kw = R_.items[wAt].key, next = R_.items[wAt + 1] ? R_.items[wAt + 1].key : kw + 1;
    moving.forEach((it, j) => { it.key = kw + ((next - kw) * (j + 1)) / (moving.length + 2); });
    R_.items.sort((a, b) => a.key - b.key);
  }
}
const idx = (name) => R_.items.findIndex((it) => it.name === name);
const lastOf = (prefix) => { let best = -1; R_.items.forEach((it, i) => { if (it.name === prefix || it.name.startsWith(prefix + ":")) best = Math.max(best, i); }); return best; };
const after = new Map();
const slotAt = (i, html) => { if (i < 0) throw new Error("no slot"); after.set(i, (after.get(i) || "") + html); };
const slot = (name, html) => slotAt(idx(name), html);
// la mirilla: lo que se ve por el vidrio, en su plano, recortado al círculo
{
  const back = [], front = [];
  const midOf = (it) => { const pts = it.shapes[0].points; return pts[Math.floor(pts.length / 2)]; };
  R_.items.forEach((it, i) => { if (/^coil(\.drop)?:/.test(it.name)) { const m = midOf(it); (cutSide(m) < 0 && m[2] < D.TUB.water ? back : front).push(i); } if (/^tub\.(wall|bottom)/.test(it.name)) back.push(i); });
  const wAt = Math.max(...back), fMin = Math.min(...front.filter((i) => midOf(R_.items[i])[2] < D.TUB.water + 2));
  slotAt(wAt, `<g class="st-water">${WATER}</g>`);
}
slot("pot.porthole.glass", `<clipPath id="stMirClip"><circle r="${(MIR.r - 0.35).toFixed(2)}"/></clipPath><g transform="${MIRM}"><g clip-path="url(#stMirClip)"><g data-live="mirilla"></g></g><circle class="st-glint" r="${(MIR.r - 0.35).toFixed(2)}"/></g>`);
slot("thermo.bezel", THD.html);
slot("sgauge.bezel", SGD.html);
slot("steam.valve.wheel", Ln(SPK, { tone: "hi" }));
slot("water.valve.wheel", Ln(WSPK, { tone: "hi" }));
slot("gauge.glass", `<g data-live="gauge"></g>`);
const loroLiq = X.prismSvg(C, half(0, L.r - 0.06, 24), L.z0, L.spill, { F: LF, tone: "faint", crease: "none", cls: "st-dist", flat: true });
const HY = { z: L.z0 + 3.2 };
const hyF = ZA([LC[0], LC[1], HY.z]);
const hyPaths = G.solidOf([[0, 0.5], [0.6, 0.9, 1], [1.4, 1.5, 1], [3.4, 1.5, 1], [4.4, 0.9, 1], [5, 0.42], [12.6, 0.42]], hyF, P, { smooth: true });
const hyTicks = [6.2, 7.4, 8.6, 9.8, 11, 12.2].map((z, i) => G.arcOf(hyF, z, 0.43, P, { from: Math.PI / 4 - (i % 2 ? 0.5 : 0.9), to: Math.PI / 4 + (i % 2 ? 0.5 : 0.9), trim: 0 })).join("");
slot("loro.wall", `<g class="st-loro-liq">${loroLiq}</g><g data-live="hydro"><g class="st-glass">${S(hyPaths, { tone: "hi" })}</g>${Ln(hyTicks, { tone: "mid" })}</g>`);
const beakTip = beakEnd, beakLand = [FC[0] + 0.4, FC[1], FU.z1 - 2.2];
slotAt(Math.max(idx("funnel"), lastOf("loro.beak")), `<path data-live="beak" class="st-stream" d="${path3([beakTip, beakLand])}"/>`);
JARS.forEach((j, i) => { slot(`jar${i}.wall`, `<g data-live="jar${i}"></g>`); slotAt(Math.max(lastOf(`drop${i}`), idx(`jar${i}.rim`)), `<g data-live="stream${i}"></g>`); slot(`cock${i}.stem`, `<g data-live="lever${i}"></g>`); });
const groups = R_.items.map((item, index) => {
  const body = item.live ? `<g data-live="${item.live}"></g>` : item.svg;
  const nm = item.name, pick = /^(neck|arm)/.test(nm) ? "neck" : /^(tub|coil|water|stand\.t|stand\.w)/.test(nm) ? "cond" : /^(loro|funnel|manifold|man\.|jar|drop|cock|stand\.plinth|stand\.man|stand\.loro)/.test(nm) ? "recv" : "still";
  return `<g class="it" data-name="${nm}" data-pick="${pick}">${body}${after.get(index) ?? ""}</g>`;
});
const svg = k.figureSvg({ width: W, height: H, label: "Alambique de cobre: calderín con camisa de vapor, capitel, cuello de cisne, serpentín en su tanque, loro con densímetro y recipientes de los cortes", body: [`<g class="st-items">${groups.join("")}</g>`] });
const gvXY = gx(GV.r, 0);
const DATA = { P, W, H, AZ, EL, T, HV, Z0, PC, TC, LC, FC, JARS: JARS.map((j) => j.c), MIR: { r: MIR.r, e2z: mBasis.e2[2], cz: mFace[2] }, GV: { x: gvXY[0], y: gvXY[1], G0, G1 }, HY, MANZ: D.MAN.z, BEAK: { tip: beakTip, land: beakLand } };
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "alambique_data.json"), JSON.stringify(DATA));
writeFileSync(join(HERE, "out", "fig.svg"), svg.replace("<svg ", '<svg id="stSvg" '));
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
const bundle = (data) => "/* alambique en isométrico: generado por build.mjs */\nvar ST_DATA = " + data + ";\nvar ST_COL_DATA = " + colData() + ";\nvar FStill = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FStill;\n})();\n";
writeFileSync(join(HERE, "out", "fig.js"), bundle(JSON.stringify(DATA)));
writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "st.css"), "utf8"));
const preview = () => k.pageHtml({ title: "Alambique", theme: "light", width: 900, body: `<style>${readFileSync(join(HERE, "st.css"), "utf8")}</style><div class="iso-stage" id="stFig">${svg.replace("<svg ", '<svg id="stSvg" ')}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + readFileSync(join(HERE, "drive_test.js"), "utf8") });
writeFileSync(join(HERE, "preview.html"), preview());
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
if (!FAST) A.auditOrExit(R_, P, {});
