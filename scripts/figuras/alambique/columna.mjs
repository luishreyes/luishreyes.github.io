/* ====================================================================
   El alambique de cobre con columna (skill anatomy), para la pestaña
   «Alambique» del Explorador de destilación por lotes cuando el lote va
   por la columna con reflujo (R constante o x_D constante).
   Concepto: el mismo calderín con su camisa de vapor; encima, una columna
   de platos cortada por el plano que mira al lector. El vapor sube por los
   platos y se condensa arriba; el condensado cae a la cabeza de vidrio,
   donde un embudo oscilante lo reparte: durante R/(R + 1) del ciclo vuelve
   a la columna (el reflujo L) y el resto sale como destilado D, que baja
   al loro con su densímetro y de ahí al recipiente del corte que toca.
   Lo que se mueve sale del modelo: los platos (cuántos y la composición
   del líquido de cada uno, del cálculo plato a plato del explorador), el
   embudo con la razón de reflujo del instante, los termómetros del
   calderín y de la cabeza, el nivel del calderín, el densímetro y los
   recipientes, como en el alambique simple.
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

// la vista previa: la figura con el mismo código en vivo de la página y un lote de prueba (drive_col.js)
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
const previewCol = () => k.pageHtml({ title: "Alambique con columna", theme: "light", width: 820, body: `<style>${readFileSync(join(HERE, "st.css"), "utf8")}</style><div class="iso-stage" id="stFig">${readFileSync(join(HERE, "out-col", "fig.svg"), "utf8")}</div>`, script: "var ST_COL_DATA = " + readFileSync(join(HERE, "out-col", "data.json"), "utf8") + ";\nvar FStill = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FStill;\n})();\n" + readFileSync(join(HERE, "drive_col.js"), "utf8") });
if (process.argv.includes("--js")) { writeFileSync(join(HERE, "preview-col.html"), previewCol()); console.log("preview-col.html"); process.exit(0); }
const W = 600, H = 760, AZ = +(process.env.AZ || 45), EL = +(process.env.EL || 30);
const D = GEO.SG; // medidas compartidas con la página
const { T, HV } = GEO.axesOf(AZ);
const Wp = (t, h, z) => [t * T[0] + h * HV[0], t * T[1] + h * HV[1], z];

const EXT = [Wp(-104, -30, 0), Wp(-110, 20, 0), Wp(-110, 18, 58), Wp(-60, 44, 0), Wp(-62, 6, 268), Wp(-80, 6, 220), Wp(-44, 6, 220), Wp(-104, -16, 0), Wp(-100, -14, 214), Wp(-18, 6, 190), Wp(76, -4, 0), Wp(76, 18, 0), Wp(-6, -14, 0)];
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
function fp(name, F, poly, s0, s1, style = {}, { extra = "", live = null, skip = null, cls = "", cut = null, ref = null, cap = "auto", owner } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, ...(owner ? { owner } : {}), ...(cut ? { cut } : {}) }));
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

// la mirilla: al frente, a la altura por la que pasa el nivel durante el lote
const MIR = { s: 31, ang: PA(45), r: 5 };
const mN = surfN(PF, pslope(MIR.s), MIR.ang), mP = G.pointOf(PF, MIR.s, pr(MIR.s), MIR.ang);
const mPad = pad("pot.porthole.boss", POT, mP, mN, MIR.r + 1.4, 1.6, {}, { owner: "pot", cls: "cu" });
const mF = G.frameAlong(mPad.face, mN);
// el anillo y el vidrio van en una sola pieza: el vidrio, al ras del anillo, se pinta encima de su hueco
const mGlass = `<g class="st-glass">${S(G.disc(0.3, 0.9, MIR.r - 0.2, mF, P), { tone: "hi" })}</g>`;
ring("pot.porthole.glass", mF, 0, 0.9, MIR.r - 0.2, MIR.r + 1.6, { tone: "mid" }, { owner: "pot.porthole.boss", extra: Dots(G.dotsOf(mF, 0.9, MIR.r + 0.8, 8, P, { all: true }), { size: 0.4 }) + mGlass });
const mBasis = faceBasis(mN), mFace = G.add3(mPad.face, G.mul3(mN, 0.92)), MIRM = planeM(mFace, mBasis.e1, mBasis.e2);

// termómetro de esfera en el hombro del calderín: la temperatura del líquido que hierve
const TH = { s: 38, ang: PA(72) };
const tN = surfN(PF, pslope(TH.s), TH.ang), tP = G.pointOf(PF, TH.s, pr(TH.s), TH.ang);
const tPad = pad("thermo.well", POT, tP, tN, 1.3, 3.2, {}, { owner: "pot", cls: "cu" });
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
const coPad = pad("trap.nozzle", JACK, G.pointOf(PF, -1, jr(-1), CO.ang), radC, 1.4, 3, {}, { owner: "jacket" });
const coOut = G.pointOf(PF, -1, 35, CO.ang);
pipe("trap.line", [coPad.face, [coOut[0], coOut[1], coPad.face[2]], [coOut[0], coOut[1], 25]], 0.9, { bend: 3 });
turned("trap", ZA([coOut[0], coOut[1], 18]), [[0, 1.6], [1, 3.2], [6, 3.2], [7, 1.6]], { tone: "mid" }, { rims: "all" });
pipe("trap.down", [[coOut[0], coOut[1], 18], [coOut[0], coOut[1], 4.6]], 0.9, {});
turned("stand.tdrain", ZA([coOut[0], coOut[1], 0]), [[0, 3.2], [1.4, 3.2], [4.6, 1.4]], { tone: "lo" });

/* ====================================================================
   2 · la columna de platos, en corte: brida de la base, reductor, las
   tres secciones de la carcasa con sus bridas y la brida de arriba
   ==================================================================== */
const CL = { r: 11, w: 0.6, zb: Z0 + 56, zt: 186, fl: 14.4, t0: 102, t1: 170 };
const CF = CUT([PC[0], PC[1], 0]), RO_ = CL.r + CL.w;
ring("col.base", PF, 46, 48, pr(44) - 1.2, 17.5, { tone: "mid" }, { cls: "cu", extra: Dots(G.dotsOf(PF, 48, 16.4, 10, P, { all: true }), { size: 0.45 }) });
turned("col.reducer", PF, [[48, 15.2], [CL.zb - Z0, RO_]], { tone: "mid" }, { cls: "cu", hole: [CL.zb - Z0, CL.r] });
// la carcasa: la mitad de atrás, y sus bridas de unión (cada par de bridas va como una sola pieza)
fp("col.wall", CF, half(CL.r, RO_, 40), CL.zb, CL.zt, { tone: "mid" }, { cls: "cu" });
const FLZ = [[CL.zb, CL.zb + 1.4], [125, 128], [155, 158]];
FLZ.forEach(([z0, z1], i) => {
  const bolts = [...Array(9)].map((_, k) => { const a = Math.PI + (Math.PI * (k + 0.5)) / 9; return G.add3(CF.o, G.add3(G.mul3(CF.u, 12.9 * Math.cos(a)), G.add3(G.mul3(CF.v, 12.9 * Math.sin(a)), [0, 0, z1 + 0.02]))); });
  fp(`col.fl${i}`, CF, half(RO_, CL.fl, 36), z0, z1, { tone: "mid" }, { cls: "cu", extra: Dots(bolts.map(at), { size: 0.4 }) });
});

/* ====================================================================
   3 · la cabeza: brida de arriba, linterna de vidrio con el embudo
   oscilante, el electroimán, la salida del destilado y el termómetro
   de la cabeza; encima, el condensador con su agua y su purga
   ==================================================================== */
const HD = { z0: CL.zt, z1: CL.zt + 3, g0: CL.zt + 6, g1: CL.zt + 30, z2: CL.zt + 32, r: RO_, rg: 10.4, tg: 0.6 };
const ZF = (o) => ZA(o);
const FL0 = ring("head.flange0", ZF([PC[0], PC[1], 0]), HD.z0, HD.z1, CL.r, CL.fl, { tone: "mid" }, { cls: "cu", extra: Dots(G.dotsOf(ZF([PC[0], PC[1], 0]), HD.z1, 12.9, 12, P, { all: true }), { size: 0.4 }) });
// la brida de abajo de la linterna va en dos mitades: el pico de la copa la atraviesa por dentro
const front = (r0, r1, n = 40) => half(r0, r1, n).map(([u, v]) => [u, -v]).reverse();
const FL1 = [fp("head.flange1.b", CF, half(CL.r - 1, CL.fl, 40), HD.z1, HD.g0, { tone: "mid" }, { cls: "cu" }), fp("head.flange1.f", CF, front(CL.r - 1, CL.fl), HD.z1, HD.g0, { tone: "mid" }, { cls: "cu" })];
// el vidrio, partido por el plano del eje que mira al lector: la mitad de atrás, lo de adentro y la de adelante (translúcida)
fp("head.glass.b", CF, half(HD.rg, HD.rg + HD.tg, 40), HD.g0, HD.g1, { tone: "mid" }, { cls: "st-glass" });
fp("head.glass.f", CF, front(HD.rg, HD.rg + HD.tg), HD.g0, HD.g1, { tone: "mid" }, { cls: "st-glass st-glass-front" });
ring("head.flange2", ZF([PC[0], PC[1], 0]), HD.g1, HD.z2, CL.r - 2, CL.fl, { tone: "mid" }, { cls: "cu", extra: Dots(G.dotsOf(ZF([PC[0], PC[1], 0]), HD.z2, 12.9, 12, P, { all: true }), { size: 0.4 }) });
// cuatro varillas entre las bridas de la linterna
[45, 135, 225, 315].forEach((deg) => {
  const a = deg * D2R, p = G.add3([PC[0], PC[1], 0], G.add3(G.mul3(T, 13.2 * Math.cos(a)), G.mul3(HV, 13.2 * Math.sin(a))));
  disc(`head.rod${deg}`, ZA([p[0], p[1], 0]), HD.g0, HD.g1, 0.55, { tone: "hi" }, { owner: deg < 180 ? "head.flange1.f" : "head.flange1.b" });
});
// el electroimán del embudo, sobre una ménsula que sale de la brida de abajo de la linterna, a la izquierda
const MAG = addv([PC[0], PC[1], 0], T, -(CL.fl + 5));
fp("head.mag.bracket", { o: [PC[0], PC[1], 0], a: G.mul3(T, -1), u: HV, v: ZD3 }, [[-1.8, HD.z1], [1.8, HD.z1], [1.8, HD.g0], [-1.8, HD.g0]], CL.fl, CL.fl + 8.6, { tone: "lo" }, {});
const magF = ZA([MAG[0], MAG[1], 0]);
disc("head.mag", magF, HD.g0, HD.g0 + 7.5, 3.2, { tone: "mid" }, { owner: "head.mag.bracket", extra: Ln([2.2, 4.4, 6.6].map((s) => G.arcOf(magF, HD.g0 + s, 3.25, P, { least: 0.02 })).join(""), { tone: "lo" }) });
disc("head.mag.cap", magF, HD.g0 + 7.5, HD.g0 + 8.6, 2.2, { tone: "hi" }, { owner: "head.mag" });
/* la copa del destilado, a la derecha del eje: el embudo la alcanza cuando el electroimán lo jala. Su pico atraviesa
   la brida de abajo de la linterna y sale por la derecha hacia el loro */
const CUPU = 3.7, CUPV = -0.7, CUPC = addv(addv([PC[0], PC[1], 0], T, CUPU), HV, CUPV), cupF = ZA([CUPC[0], CUPC[1], 0]);
const DZ = HD.g0 - 1.1;
disc("head.cup.base", cupF, HD.g0 - 1.8, HD.g0 + 0.4, 1.6, { tone: "mid" }, { cls: "cu" });
ring("head.cup", cupF, HD.g0 + 0.4, HD.g0 + 4.2, 1.3, 1.6, { tone: "mid" }, { owner: "head.cup.base", cls: "cu" });
tubeItems("head.spout", [addv([CUPC[0], CUPC[1], DZ], T, 1.6 - 0.02), addv(addv([PC[0], PC[1], DZ], HV, CUPV), T, Math.sqrt((CL.r - 1) ** 2 - CUPV * CUPV) + 0.02)], 0.5, { tone: "mid", cls: "cu", maxLength: 20 });
// el gancho del embudo: una varilla que sale del vidrio de atrás hasta el eje
disc("head.hook", G.frameAlong(addv([PC[0], PC[1], HD.g1 - 0.8], HV, -(HD.rg - 0.02)), HV), 0, HD.rg - 0.02, 0.3, { tone: "hi" }, { owner: "head.glass.b" });
// la salida del destilado, del lado derecho de esa brida; baja hasta el loro
const DOUT = addv([PC[0], PC[1], DZ], T, CL.fl);
const dBoss = pad("head.dout.boss", FL1, DOUT, T, 1.25, 1.6, {}, { owner: "head.flange1.f", cls: "cu" });
// el termómetro de la cabeza: la temperatura del vapor que sale por arriba
// a la derecha y un poco hacia el lector, para que no tape el embudo
const thHN = G.unit3(G.add3(G.mul3(T, 0.8), G.mul3(HV, 0.6)));
const thH0 = addv([PC[0], PC[1], (HD.g1 + HD.z2) / 2], thHN, CL.fl);
disc("head.thermo.stem", G.frameAlong(thH0, thHN), 0, 3.6, 0.5, { tone: "mid" }, { owner: "head.flange2" });
const THH = dial("thermoH", addv(thH0, thHN, 3.6 + 1.6), thHN, 4.2, { live: "tneedleH", owner: "head.thermo.stem" });
// el condensador: carcasa de cobre, domo y purga; el agua entra abajo y sale arriba por el lado izquierdo
const CN = { z0: HD.z2, z1: HD.z2 + 34, r: 9 };
const cnF = ZA([PC[0], PC[1], 0]);
ring("cond.flange", cnF, CN.z0, CN.z0 + 1.6, 3, CL.fl - 1.2, { tone: "mid" }, { cls: "cu" });
const COND = turned("cond", cnF, [[CN.z0 + 1.6, CN.r], [CN.z1, CN.r], [CN.z1 + 2.5, CN.r - 1.2], [CN.z1 + 4.5, 4.5], [CN.z1 + 5.4, 2.2]], { tone: "mid" }, { cls: "cu", extra: Ln([CN.z0 + 12, CN.z0 + 23].map((s) => G.arcOf(cnF, s, CN.r + 0.02, P, { least: 0.02 })).join(""), { tone: "faint" }) });
const VENT = [PC[0], PC[1], CN.z1 + 5.4];
disc("cond.vent.stem", ZA(VENT), 0, 3, 0.7, { tone: "mid" }, { owner: "cond" });
ball("cond.vent", [VENT[0], VENT[1], VENT[2] + 4.4], 1.6, { tone: "mid" }, { bores: [{ owner: "cond.vent.stem", dir: ZD3, r: 0.7 }] });
// el agua sube por detrás, entre la columna y la bajada del destilado: entra abajo y sale arriba, en contracorriente
const wx = (d, h) => G.add3([PC[0], PC[1], 0], G.add3(G.mul3(T, d), G.mul3(HV, h)));
const wInF = wx(29, -27), wOutF = wx(36, -20), wvC2 = [wInF[0], wInF[1], 30];
const radTo = (q) => G.unit3([q[0] - PC[0], q[1] - PC[1], 0]);
const wIn = pad("cond.win", COND, G.add3([PC[0], PC[1], CN.z0 + 6], G.mul3(radTo(wInF), CN.r)), radTo(wInF), 1.4, 2.4, {}, { owner: "cond", cls: "cu" });
const wOut = pad("cond.wout", COND, G.add3([PC[0], PC[1], CN.z1 - 6], G.mul3(radTo(wOutF), CN.r)), radTo(wOutF), 1.4, 2.4, {}, { owner: "cond", cls: "cu" });
pipe("cw.in", [[wInF[0], wInF[1], 1.6], [wInF[0], wInF[1], wIn.face[2]], wIn.face], 0.9, { bend: 4, balls: [{ name: "cw.valve.body", c: wvC2, R: 2 }] });
turned("stand.cwin.flange", ZA([wInF[0], wInF[1], 0]), [[0, 3], [1.6, 3]], { tone: "lo" });
const CWSPK = wheel("cw.valve", wvC2, G.unit3([HV[0], HV[1], 0]), 2);
pipe("cw.out", [wOut.face, [wOutF[0], wOutF[1], wOut.face[2]], [wOutF[0], wOutF[1], 4.6]], 0.9, { bend: 4 });
turned("stand.cwdrain", ZA([wOutF[0], wOutF[1], 0]), [[0, 3.2], [1.4, 3.2], [4.6, 1.4]], { tone: "lo" });

/* ====================================================================
   4 · el loro, el embudo, el distribuidor y los recipientes (en corte),
   a la derecha del calderín, en fila a lo largo del plano de corte
   ==================================================================== */
const L = D.LORO, LC = addv([PC[0], PC[1], 0], T, 44), LF = CUT([LC[0], LC[1], 0]);
const POST = addv(LC, HV, -13);
disc("stand.loro.foot", ZA([POST[0], POST[1], 0]), 0, 0.8, 4, { tone: "lo" }, { extra: Dots(G.dotsOf(ZA([POST[0], POST[1], 0]), 0.8, 3, 3, P, { all: true }), { size: 0.4 }) });
disc("stand.loro.post", ZA([POST[0], POST[1], 0]), 0.8, L.z0 - 1.2, 1.2, { tone: "lo" });
fp("loro.bracket", { o: [LC[0], LC[1], 0], a: G.mul3(HV, -1), u: T, v: ZD3 }, [[-1.2, L.z0 - 2.4], [1.2, L.z0 - 2.4], [1.2, L.z0 - 1], [-1.2, L.z0 - 1]], 1, 13 - 1.2, { tone: "lo" }, {});
fp("loro.bottom", LF, half(0, L.r + L.TW), L.z0 - 1, L.z0, { tone: "mid" }, { cls: "cu" });
fp("loro.wall", LF, half(L.r, L.r + L.TW), L.z0, L.z1, { tone: "mid" }, { cls: "cu" });
// el destilado: de la cabeza a la derecha y en vertical hasta encima del loro
const DTOP = [LC[0], LC[1], DOUT[2]];
pipe("dist", [dBoss.face, DTOP, [LC[0], LC[1], L.z0 + 2]], 0.9, { bend: 4, cls: "cu", open: [false, true] });
// el pico: sale por el lado derecho del corte y cae al embudo
const FU = D.FUN, FC = addv(LC, T, FU.dx);
const bossP = addv([LC[0], LC[1], L.spill], T, L.r + L.TW);
const beakEnd = [FC[0] - T[0] * 1.2, FC[1] - T[1] * 1.2, L.spill - 2.2], beakDir = G.unit3(G.sub3(beakEnd, bossP));
disc("loro.boss", G.frameAlong(bossP, beakDir), 0, 1.0, 1.25, { tone: "mid" }, { owner: "loro.wall", cls: "cu" });
tubeItems("loro.beak", [addv(bossP, beakDir, 1.0), beakEnd], 0.8, { tone: "hi", cls: "cu", ends: [true, false], maxLength: 20 });
turned("funnel", ZA([FC[0], FC[1], FU.z0]), [[0, FU.r0], [FU.z1 - FU.z0, FU.r1]], { tone: "mid" }, { cls: "cu" });
const J = D.JAR, jarAt = (d) => addv(FC, T, d);
const MANEND = addv(FC, T, J.d[2] + 18.5), MSUP = addv(FC, T, J.d[2] + 14.6);
const tees = J.d.map((d, i) => { const c = jarAt(d); return { name: `tee${i}`, c: [c[0], c[1], D.MAN.z], R: 1.9, cls: "cu" }; });
// el codo fundido bajo el embudo: el tubo del distribuidor sale de él a lo largo del plano de corte
const ELB = [FC[0], FC[1], D.MAN.z];
ball("man.elbow", ELB, 1.55, { tone: "mid" }, { owner: "funnel", cls: "cu" });
pipe("manifold", [ELB, [MANEND[0], MANEND[1], D.MAN.z]], D.MAN.r, { bend: 3, cls: "cu", balls: [{ name: "man.elbow", c: ELB, R: 1.55, shared: true, at: "start" }, ...tees] });
disc("manifold.cap", G.frameAlong([MANEND[0], MANEND[1], D.MAN.z], T), 0, 0.9, D.MAN.r + 0.5, { tone: "mid" }, { cls: "cu" });
disc("stand.man.foot", ZA([MSUP[0], MSUP[1], 0]), 0, 0.8, 2.4, { tone: "lo" });
disc("stand.man.post", ZA([MSUP[0], MSUP[1], 0]), 0.8, D.MAN.z - D.MAN.r - 1.1, 0.7, { tone: "lo" });
// la silla del distribuidor sobre el poste, partida por el plano del tubo: la mitad de atrás y la de adelante
const SAD = (() => { const z0 = D.MAN.z - D.MAN.r - 1.1, z1 = D.MAN.z - 0.5, rc = D.MAN.r + 0.03, ta = Math.asin(-0.5 / rc);
  const arc = (t0, t1) => Array.from({ length: 7 }, (_, i) => { const t = t0 + ((t1 - t0) * i) / 6; return [+(rc * Math.cos(t)).toFixed(4), +(D.MAN.z + rc * Math.sin(t)).toFixed(4)]; });
  return { back: [[-1.6, z0], [0, z0], ...arc(-Math.PI / 2, -Math.PI - ta), [-1.6, z1]], front: [[0, z0], [1.6, z0], [1.6, z1], ...arc(ta, -Math.PI / 2)] }; })();
const sadF = { o: [MSUP[0], MSUP[1], 0], a: T, u: HV, v: ZD3 };
fp("man.saddle.b", sadF, SAD.back, -0.9, 0.9, { tone: "lo" }, { owner: "manifold" });
fp("man.saddle.f", sadF, SAD.front, -0.9, 0.9, { tone: "lo" }, { owner: "manifold" });
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
const idx = (name) => R_.items.findIndex((it) => it.name === name);
const lastOf = (prefix) => { let best = -1; R_.items.forEach((it, i) => { if (it.name === prefix || it.name.startsWith(prefix + ":")) best = Math.max(best, i); }); return best; };
const after = new Map();
const slotAt = (i, html) => { if (i < 0) throw new Error("no slot"); after.set(i, (after.get(i) || "") + html); };
const slot = (name, html) => slotAt(idx(name), html);
slot("pot.porthole.glass", `<clipPath id="stcMirClip"><circle r="${(MIR.r - 0.35).toFixed(2)}"/></clipPath><g transform="${MIRM}"><g clip-path="url(#stcMirClip)"><g data-live="mirilla"></g></g><circle class="st-glint" r="${(MIR.r - 0.35).toFixed(2)}"/></g>`);
slot("thermo.bezel", THD.html);
slot("thermoH.bezel", THH.html);
slot("sgauge.bezel", SGD.html);
slot("steam.valve.wheel", Ln(SPK, { tone: "hi" }));
slot("cw.valve.wheel", Ln(CWSPK, { tone: "hi" }));
// el piloto del electroimán: se enciende mientras el embudo echa a la copa del destilado
const ledC = at(addv([MAG[0], MAG[1], HD.g0 + 8.6], HV, 1.1));
slot("head.mag.cap", `<circle data-live="magled" class="st-led" cx="${ledC[0].toFixed(2)}" cy="${ledC[1].toFixed(2)}" r="${(0.55 * G.scaleOf(P)).toFixed(2)}"/>`);
slot("gauge.glass", `<g data-live="gauge"></g>`);
// lo de adentro de la columna (los platos con su líquido) y de la linterna (el embudo, las gotas y el reflujo)
const holeD = path3(Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * Math.PI * 2; return G.add3([PC[0], PC[1], CL.zb + 0.02], G.add3(G.mul3(T, (CL.r - 0.05) * Math.cos(t)), G.mul3(HV, (CL.r - 0.05) * Math.sin(t)))); }), true);
slot("col.reducer", `<path class="st-hole" d="${holeD}"/>`);
slot("col.wall", `<g data-live="trays"></g>`);
slot("head.glass.b", `<g data-live="funnel"></g>`);
const loroLiq = X.prismSvg(C, half(0, L.r - 0.06, 24), L.z0, L.spill, { F: LF, tone: "faint", crease: "none", cls: "st-dist", flat: true });
const HY = { z: L.z0 + 3.2 };
const hyF = ZA([LC[0], LC[1], HY.z]);
const hyPaths = G.solidOf([[0, 0.5], [0.6, 0.9, 1], [1.4, 1.5, 1], [3.4, 1.5, 1], [4.4, 0.9, 1], [5, 0.42], [12.6, 0.42]], hyF, P, { smooth: true });
const hyTicks = [6.2, 7.4, 8.6, 9.8, 11, 12.2].map((z, i) => G.arcOf(hyF, z, 0.43, P, { from: Math.PI / 4 - (i % 2 ? 0.5 : 0.9), to: Math.PI / 4 + (i % 2 ? 0.5 : 0.9), trim: 0 })).join("");
slot("loro.wall", `<g class="st-loro-liq">${loroLiq}</g><g data-live="hydro"><g class="st-glass">${S(hyPaths, { tone: "hi" })}</g>${Ln(hyTicks, { tone: "mid" })}</g>`);
const beakTip = beakEnd, beakLand = [FC[0] - 0.4 * T[0], FC[1] - 0.4 * T[1], FU.z1 - 2.2];
slotAt(Math.max(idx("funnel"), lastOf("loro.beak")), `<path data-live="beak" class="st-stream" d="${path3([beakTip, beakLand])}"/>`);
JARS.forEach((j, i) => { slot(`jar${i}.wall`, `<g data-live="jar${i}"></g>`); slotAt(Math.max(lastOf(`drop${i}`), idx(`jar${i}.rim`)), `<g data-live="stream${i}"></g>`); slot(`cock${i}.stem`, `<g data-live="lever${i}"></g>`); });
const groups = R_.items.map((item, index) => {
  const body = item.live ? `<g data-live="${item.live}"></g>` : item.svg;
  const nm = item.name;
  const pick = /^col\./.test(nm) ? "column" : /^(cond|cw|stand\.cw)/.test(nm) ? "cond" : /^head\./.test(nm) ? "split" : /^(dist|loro|funnel|manifold|man\.|jar|drop|cock|stand\.plinth|stand\.man|stand\.loro)/.test(nm) ? "recv" : "still";
  return `<g class="it" data-name="${nm}" data-pick="${pick}">${body}${after.get(index) ?? ""}</g>`;
});
const svg = k.figureSvg({ width: W, height: H, label: "Alambique de cobre con columna: el calderín con su camisa de vapor, la columna de platos abierta por el plano que mira al lector, la cabeza de vidrio con el embudo oscilante que reparte el reflujo, el condensador, el loro con su densímetro y los recipientes de los cortes", body: [`<g class="st-items">${groups.join("")}</g>`] });
const gvXY = gx(GV.r, 0);
const DATA = { P, W, H, AZ, EL, T, HV, Z0, PC, LC, FC, JARS: JARS.map((j) => j.c), MIR: { r: MIR.r, e2z: mBasis.e2[2], cz: mFace[2] }, GV: { x: gvXY[0], y: gvXY[1], G0, G1 }, HY, MANZ: D.MAN.z, BEAK: { tip: beakTip, land: beakLand },
  COL: { r: CL.r, zb: CL.zb, zt: CL.zt, t0: CL.t0, t1: CL.t1 }, HEAD: { z1: HD.z1, g0: HD.g0, g1: HD.g1, z2: HD.z2, rg: HD.rg, dout: DOUT, cupU: CUPU, cupZ: HD.g0 + 4.2, cupR: 1.3, hookZ: HD.g1 - 0.8 }, MAG };
mkdirSync(join(HERE, "out-col"), { recursive: true });
writeFileSync(join(HERE, "out-col", "data.json"), JSON.stringify(DATA));
writeFileSync(join(HERE, "out-col", "fig.svg"), svg.replace("<svg ", '<svg id="stcSvg" '));
writeFileSync(join(HERE, "preview-col.html"), previewCol());
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
if (!FAST) A.auditOrExit(R_, P, {});
