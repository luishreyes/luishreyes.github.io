/* ====================================================================
   La sección de reacción de la planta de benceno en isométrico (skill anatomy), para el capítulo 2
   del libro de operaciones unitarias (Los diagramas de ingeniería).
   Concepto: el mismo proceso del PFD y del P&ID del capítulo, ahora como se construye. El rack de
   tuberías corre por el centro; al norte, la parte caliente (precalentador E-101, horno H-101 y reactor
   R-101); al sur, la fría (enfriador E-102, separador V-102 y compresores C-101 A/B). Las líneas de
   proceso van de un equipo al otro por el rack, y las que lo cruzan pasan por encima de las que corren
   a lo largo. Las medidas están en geo.mjs, que también usan las vistas de planta y de elevación.
   Unidades: 1 = 10 cm. x al este, y al sur (hacia el lector), z hacia arriba.
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
const { PB, headDepth, axesOf } = await import(join(HERE, "geo.mjs"));
const FAST = process.argv.includes("--fast");

const W = 1000, H = 760, AZ = PB.AZ, EL = PB.EL;
const RK = PB.RACK, RZ = RK.z + RK.t, LN = PB.LANE, CZ = PB.CROSS, rB = PB.r.big, rM = PB.r.mid, rS = PB.r.small;
const H1 = PB.H101, E1 = PB.E101, R1 = PB.R101, E2 = PB.E102, V2 = PB.V102, C1 = PB.C101;
const EXT = [[RK.x0, -40, 0], [RK.x1, 40, 0], [H1.x - 22, H1.y - 22, 0], [H1.x, H1.y, H1.stack + 2], [R1.x, R1.y, 172],
  [C1.x0 - 6, C1.ys[1] + 12, 0], [RK.x1, C1.ys[1] + 12, 0], [V2.x + 30, V2.y + 10, 0], [E2.x0 - 10, E2.y + 22, 0]];
const P = k.fitProjection(EXT, W, H, { pad: 18, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const { T: TA, HV } = axesOf(AZ);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = R_.solid;
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", owner, cls = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, owner }, steps));
  const body = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style }) + extra;
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
function fp(name, F, poly, s0, s1, style = {}, { extra = "", cls = "", owner, cap = "auto" } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, owner }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, cls, cap }) + extra, [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", owner, smooth, bevel = 0, cls = "", rims } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner }));
  const body = S(paths, { tone: "mid", ...style }) + extra;
  put(name, G.add3(F.o, G.mul3(F.a, mid)), cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
const disc = (name, F, s0, s1, r, style = {}, options = {}) => turned(name, F, [[s0, r], [s1, r]], style, options);
function ring(name, F, s0, s1, rIn, rOut, style = {}, { extra = "", owner } = {}) {
  const paths = G.ringBand(s0, s1, rIn, rOut, F, P, {});
  const shape = record(A.ring(F, s0, s1, rIn, rOut, { name, owner }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), S(paths, { tone: "mid", ...style }) + extra, [shape]);
  return shape;
}
const ZA = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const addv = (p, d, kk) => [p[0] + d[0] * kk, p[1] + d[1] * kk, p[2] + (d[2] || 0) * kk];
function tubeItems(name, route, r, { tone = "mid", maxLength = 14, gaps = [], caps = true, ends = [true, true], touch } = {}) {
  R_.route(name, route, r, { owner: name, gaps, ends, piece: "frame", move: [0, 0, 0], ride: "frame", ...(touch ? { touch } : {}) });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(0.6, Math.min(2.2, r * 0.5)), gaps, caps }).forEach((part, index) => {
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: tubeSvg(part, { tone }), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] });
  });
}
function ball(name, c, R, style = {}, { owner, bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(R + 0.6))), G.add3(c, G.mul3(b.dir, R + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, R, { name, owner, ...(cut.length ? { cut } : {}) }));
  put(name, c, S(G.sphereOf(c, R, P), { tone: "mid", ...style }), [shape]);
  return shape;
}
const entry = (R, r) => Math.sqrt(Math.max(0, R * R - r * r)) - 0.02;
function mergeGaps(gs) { const s = gs.filter((g) => g[1] > g[0]).sort((a, b) => a[0] - b[0]), out = []; for (const g of s) { const l = out[out.length - 1]; if (l && g[0] <= l[1]) l[1] = Math.max(l[1], g[1]); else out.push([...g]); } return out; }
/* un tubo con codos redondeados; flanges en los extremos; esferas (codos, tes y cuerpos de válvula) que el tubo cruza
   o en las que termina; collares que abren su hueco */
const ROUTES = {};
function pipe(name, control, r, { bend = 3, tone = "mid", flanges = [false, false], flangeR = 1.7, maxLength = 14, balls = [], collars = [], open = [false, false], touch } = {}) {
  const ctl = control.map((q) => [...q]);
  ROUTES[name] = { pts: control.map((q) => q.map((v) => Math.round(v * 100) / 100)), r };
  for (const b of balls) {
    if (b.at !== "start" && b.at !== "end") continue;
    const i = b.at === "start" ? 0 : ctl.length - 1, j = b.at === "start" ? 1 : ctl.length - 2, dir = G.unit3(G.sub3(ctl[j], b.c));
    ctl[i] = G.add3(b.c, G.mul3(dir, entry(b.R, r)));
  }
  const line = G.fillet(ctl, Math.max(r * bend, 3), 12, { P, tube: r });
  const total = G.pathLength(line), gaps = [];
  [[0, -1], [total, 1]].forEach(([along, sign], index) => {
    if (!flanges[index]) return;
    const thick = Math.max(0.8, r * 0.38), tangent = G.tangentAlong(line, along);
    const centre = G.add3(G.pointAlong(line, along), G.mul3(tangent, (-sign * thick) / 2));
    gaps.push(sign < 0 ? [0, thick] : [total - thick, total]);
    disc(`${name}.flange${index}`, G.frameAlong(centre, tangent), -thick / 2, thick / 2, r * flangeR, { tone: "mid" }, { owner: name, extra: Dots(G.dotsOf(G.frameAlong(centre, tangent), (thick / 2) * sign, (r * (flangeR + 1)) / 2, 6, P, { all: false, least: 0.05 }), { size: 0.3 }) });
  });
  const nearest = (c) => { let best = 0, bd = 1e9; for (let q = 0; q <= total; q += 0.05) { const d = G.len3(G.sub3(G.pointAlong(line, q), c)); if (d < bd) { bd = d; best = q; } } return best; };
  for (const b of balls) {
    let dir = null;
    if (b.at !== "start" && b.at !== "end") { const q = nearest(b.c), dd = entry(b.R, r); gaps.push([Math.max(0, q - dd), Math.min(total, q + dd)]); dir = G.tangentAlong(line, q); }
    const mine = dir ? [{ owner: name, dir, r }] : [];
    if (!b.shared) ball(b.name, b.c, b.R, b.style || {}, { bores: [...mine, ...(b.bores || [])] });
  }
  for (const c of collars) { const q = nearest(c.c); gaps.push([q - c.half, q + c.half]); }
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), maxLength, ends: [!open[0], !open[1]], touch });
  return line;
}
// asiento: el cilindro que sale de una superficie curva hasta una cara plana, cortado justo en la superficie
function pad(name, hosts, point, outward, a, h, style = {}, { owner, extra = "", from = null } = {}) {
  const hs = [hosts].flat(), inside = (p) => hs.some((shape) => A.sdf(shape, p) < 0);
  const axis = G.unit3(outward), F = G.frameAlong(point, axis);
  const start = (angle) => { let lo = from ?? -2.5 * a, hi = h; if (!inside(G.pointOf(F, lo, a, angle))) return 0; for (let k2 = 0; k2 < 40; k2++) { const mid = (lo + hi) / 2; if (inside(G.pointOf(F, mid, a, angle))) lo = mid; else hi = mid; } return hi; };
  const low = Math.min(...Array.from({ length: 48 }, (_, i) => start((i / 48) * Math.PI * 2)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, G.add3(point, G.mul3(axis, h / 2)), body, [record(A.disc(F, low - 0.05, h, a, { name, owner, seated: true, cut: hs }))]);
  return { F, face: G.add3(point, G.mul3(axis, h)) };
}
// una boquilla con su brida: asiento sobre el cuerpo, cuello y brida con pernos; devuelve la cara de la brida
function nozzle(name, host, point, outward, r, { neck = 3, owner } = {}) {
  const pd = pad(`${name}.pad`, host, point, outward, r + 0.5, 1.2, {}, { owner });
  const F = G.frameAlong(pd.face, G.unit3(outward));
  disc(`${name}.neck`, F, 0, neck, r, { tone: "mid" }, { owner: `${name}.pad` });
  disc(`${name}.fl`, F, neck, neck + 0.9, r * 1.75, { tone: "mid" }, { owner: `${name}.neck`, extra: Dots(G.dotsOf(F, neck + 0.9, r * 1.38, 6, P), { size: 0.3 }) });
  return G.add3(pd.face, G.mul3(G.unit3(outward), neck + 0.9));
}
// una válvula de control: cuerpo, bonete, arcada y actuador de diafragma
function controlValve(name, c, along, { R = 2.6, r = 1.1, line } = {}) {
  ball(`${name}.body`, c, R, { tone: "mid" }, { bores: [{ owner: line, dir: along, r }] });
  disc(`${name}.bonnet`, ZA(c), entry(R, 1.2), R + 2.4, 1.2, { tone: "mid" }, { owner: `${name}.body` });
  const side = G.unit3(G.cross3(ZD, along)), y0 = c[2] + R + 2.4, y1 = y0 + 5;
  [-1, 1].forEach((sg, i) => { const pc = addv(c, side, sg * 1.6); box(`${name}.yoke${i}`, [pc[0] - 0.3, pc[1] - 0.3, y0], [pc[0] + 0.3, pc[1] + 0.3, y1], { tone: "mid" }, { r: 0.08, owner: `${name}.bonnet` }); });
  disc(`${name}.ytop`, ZA([c[0], c[1], y1]), 0, 0.7, 2.2, { tone: "mid" }, { owner: `${name}.yoke0` });
  turned(`${name}.diaL`, ZA([c[0], c[1], y1 + 0.7]), [[0, 1.2], [2.0, 5.6]], { tone: "mid" }, { owner: `${name}.ytop` });
  disc(`${name}.diaF`, ZA([c[0], c[1], y1 + 0.7]), 2.0, 2.6, 6.0, { tone: "mid" }, { owner: `${name}.diaL`, extra: Dots(G.dotsOf(ZA([c[0], c[1], y1 + 0.7]), 2.6, 5.6, 12, P), { size: 0.28 }) });
  turned(`${name}.diaU`, ZA([c[0], c[1], y1 + 0.7]), [[2.6, 5.6], [4.8, 1.6]], { tone: "mid" }, { owner: `${name}.diaF` });
}
const seamZ = (F, s, R) => Ln(G.arcOf(F, s, R + 0.02, P), { tone: "faint" });

/* ====================================================================
   1 · el rack de tuberías: pórticos cada 6 m con vigas a 5,5 m
   ==================================================================== */
const RACK = "stand.rack";
RK.xs.forEach((x, i) => {
  [-RK.y, RK.y].forEach((y, j) => {
    box(`${RACK}.c${i}${j}`, [x - 1.5, y - 1.5, 0.8], [x + 1.5, y + 1.5, RK.z], { tone: "lo" }, { r: 0.1 });
    box(`${RACK}.p${i}${j}`, [x - 3, y - 3, 0], [x + 3, y + 3, 0.8], { tone: "lo" }, { r: 0.2, extra: Dots([[x - 2.2, y - 2.2], [x + 2.2, y + 2.2], [x - 2.2, y + 2.2], [x + 2.2, y - 2.2]].map(([a, b]) => at([a, b, 0.8])), { size: 0.3 }) });
  });
  box(`${RACK}.t${i}`, [x - 1.5, -RK.y - 3, RK.z], [x + 1.5, RK.y + 3, RZ], { tone: "lo" }, { r: 0.1 });
  if (i < RK.xs.length - 1) [-RK.y, RK.y].forEach((y, j) => box(`${RACK}.l${i}${j}`, [x + 1.5, y - 1.5, RK.z], [RK.xs[i + 1] - 1.5, y + 1.5, RZ], { tone: "lo" }, { r: 0.1 }));
});
const ONRACK = ["stand.rack.t*", "stand.rack.l*"];
const laneZ = (r) => RZ + r;

/* ====================================================================
   2 · el horno H-101: cilíndrico vertical sobre patas, con su chimenea
   ==================================================================== */
const HF = ZA([H1.x, H1.y, 0]);
[[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sy], i) => {
  const x = H1.x + sx * 12, y = H1.y + sy * 12;
  box(`stand.h101.leg${i}`, [x - 1.2, y - 1.2, 0.8], [x + 1.2, y + 1.2, H1.leg], { tone: "lo" }, { r: 0.1 });
  box(`stand.h101.plate${i}`, [x - 2.6, y - 2.6, 0], [x + 2.6, y + 2.6, 0.8], { tone: "lo" }, { r: 0.2 });
});
disc("h101.floor", HF, H1.leg, H1.z0, H1.R + 1.2, { tone: "mid" });
const HSH = turned("h101.shell", HF, [[H1.z0, H1.R], [H1.z1, H1.R]], { tone: "mid" }, { extra: [36, 56, 76].map((z) => seamZ(HF, z, H1.R)).join("") + Ln(G.ribsOf(HF, H1.z0, H1.z1, H1.R + 0.02, 16, P, { least: 0.15, seams: true }), { tone: "faint" }) });
turned("h101.roof", HF, [[H1.z1, H1.R], [H1.cone, H1.rs + 3]], { tone: "mid" }, { owner: "h101.shell" });
disc("h101.collar", HF, H1.cone, H1.cone + 2, H1.rs + 3, { tone: "mid" }, { owner: "h101.roof" });
disc("h101.stack", HF, H1.cone + 2, H1.stack, H1.rs, { tone: "mid" }, { owner: "h101.collar", extra: seamZ(HF, 130, H1.rs) });
ring("h101.stacktop", HF, H1.stack, H1.stack + 1.2, H1.rs - 0.6, H1.rs + 0.6, { tone: "mid" }, { owner: "h101.stack" });
[0, 2.094, 4.189].forEach((a, i) => { const x = H1.x + 8 * Math.cos(a), y = H1.y + 8 * Math.sin(a); disc(`h101.burner${i}`, ZA([x, y, 0]), 9, H1.leg, 2.2, { tone: "mid" }, { owner: "h101.floor" }); });
// mirillas del lado del lector
[[30, 2.2], [62, 2.6]].forEach(([z, a], i) => { const d = [Math.cos(a), Math.sin(a), 0]; pad(`h101.peep${i}`, HSH, addv([H1.x, H1.y, z], d, H1.R), d, 1.8, 1.0, {}, { owner: "h101.shell" }); });
const H_IN = nozzle("h101.in", HSH, [H1.x + H1.R, H1.y, 80], XD, rB, { owner: "h101.shell" });
const H_OUT = nozzle("h101.out", HSH, [H1.x + H1.R, H1.y, 28], XD, rB, { owner: "h101.shell" });

/* ====================================================================
   3 · el reactor R-101: lecho fijo sobre faldón
   ==================================================================== */
const RF = ZA([R1.x, R1.y, 0]);
disc("stand.r101.base", RF, 0, 1, R1.R + 2, { tone: "lo" }, { extra: Dots([0, 1, 2, 3, 4, 5, 6, 7].map((i) => at([R1.x + (R1.R + 1) * Math.cos(i * 0.785), R1.y + (R1.R + 1) * Math.sin(i * 0.785), 1])), { size: 0.32 }) });
disc("r101.skirt", RF, 1, R1.z0, R1.R, { tone: "mid" }, { owner: "stand.r101.base" });
const head = [];
for (let i = 0; i <= 10; i++) { const a = (Math.PI / 2) * (i / 10); head.push([R1.z1 + R1.hd * Math.sin(a), Math.max(0.6, R1.R * Math.cos(a)), 1]); }
head[head.length - 1][2] = 0;
const RSH = turned("r101.shell", RF, [[R1.z0, R1.R], [R1.z1, R1.R], ...head], { tone: "mid" }, { owner: "r101.skirt", extra: [50, 76, 102, 128].map((z) => seamZ(RF, z, R1.R)).join("") });
const R_IN = nozzle("r101.in", RSH, [R1.x, R1.y, R1.z1 + R1.hd - 0.4], ZD, rB, { owner: "r101.shell" });
const R_OUT = nozzle("r101.out", RSH, [R1.x + R1.R, R1.y, 34], XD, rB, { owner: "r101.shell" });
// boca de hombre hacia el lector, con su tapa ciega
{
  const d = G.unit3([-0.87, 0.5, 0]), mh = pad("r101.mh.pad", RSH, addv([R1.x, R1.y, 128], d, R1.R), d, 3.4, 1.6, {}, { owner: "r101.shell" });
  const F = G.frameAlong(mh.face, d);
  disc("r101.mh.neck", F, 0, 2.4, 3.4, { tone: "mid" }, { owner: "r101.mh.pad" });
  disc("r101.mh.cover", F, 2.4, 3.4, 4.8, { tone: "hi" }, { owner: "r101.mh.neck", extra: Dots(G.dotsOf(F, 3.4, 4.1, 10, P), { size: 0.3 }) });
}
// plataforma de la cabeza: rejilla anular sobre ménsulas, con baranda de postes, pasamanos y travesaño
const ZP = R1.z1 + 2, RP = R1.R + 7;
ring("r101.plat", RF, ZP, ZP + 1, R1.R, RP, { tone: "hi" }, { owner: "r101.shell" });
[[1, 0], [0, 1], [0, -1]].forEach(([cx, cy], i) => {
  const x0 = R1.x + cx * R1.R, y0 = R1.y + cy * R1.R, x1 = R1.x + cx * (RP - 0.5), y1 = R1.y + cy * (RP - 0.5);
  box(`r101.bracket${i}`, [Math.min(x0, x1) - (cx ? 0 : 0.3), Math.min(y0, y1) - (cy ? 0 : 0.3), ZP - 5], [Math.max(x0, x1) + (cx ? 0 : 0.3), Math.max(y0, y1) + (cy ? 0 : 0.3), ZP], { tone: "lo" }, { r: 0.05, owner: "r101.shell" });
});
// media corona horizontal (atrás o adelante del eje, según el lector), para lo que rodea al casco
function halfBand(name, c, z0, z1, r0, r1, front, style, owner) {
  const v = front ? G.mul3(HV, -1) : HV, poly = [];
  for (let i = 0; i <= 24; i++) { const t = Math.PI + (Math.PI * i) / 24; poly.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (let i = 24; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / 24; poly.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return fp(name, { o: [c[0], c[1], 0], a: ZD, u: TA, v }, poly, z0, z1, style, { owner });
}
const RR = RP - 0.5;
[0, 45, 135, 180, 225, 270, 315].forEach((deg, i) => { const a = (deg * Math.PI) / 180; disc(`r101.post${i}`, ZA([R1.x + RR * Math.cos(a), R1.y + RR * Math.sin(a), ZP + 1]), 0, 9.5, 0.25, { tone: "mid" }, { owner: "r101.plat" }); });
[false, true].forEach((front) => {
  halfBand(`r101.rail${front ? "F" : "B"}`, [R1.x, R1.y], ZP + 10.5, ZP + 11, RR - 0.4, RR + 0.4, front, { tone: "mid" }, "r101.post0");
  halfBand(`r101.mid${front ? "F" : "B"}`, [R1.x, R1.y], ZP + 5.4, ZP + 5.8, RR + 0.25, RR + 0.65, front, { tone: "mid" }, "r101.post0");
});
// escalera con jaula por el sur (hacia el lector), de grado a la plataforma, sostenida del casco por ménsulas
const LY = R1.y + RP + 0.6, LT = ZP + 9, LXc = R1.x - 7;
[-1.8, 1.8].forEach((dx, i) => {
  box(`stand.r101.lfoot${i}`, [LXc + dx - 0.8, LY - 0.8, 0], [LXc + dx + 0.8, LY + 0.8, 0.6], { tone: "lo" }, { r: 0.1 });
  box(`r101.lrail${i}`, [LXc + dx - 0.2, LY - 0.2, 0.6], [LXc + dx + 0.2, LY + 0.2, LT], { tone: "mid" }, { r: 0.04, owner: `stand.r101.lfoot${i}` });
  [30, 70, 110].forEach((z, j) => {
    const ys = R1.y + Math.sqrt(R1.R ** 2 - (LXc - R1.x + dx) ** 2);
    box(`r101.lstand${i}${j}`, [LXc + dx - 0.2, ys, z], [LXc + dx + 0.2, LY - 0.2, z + 0.6], { tone: "lo" }, { r: 0.04, owner: `r101.lrail${i}` });
  });
});
{
  const rungs = [], hoops = [], bars = [];
  for (let z = 3; z < LT - 1; z += 3) rungs.push(path3([[LXc - 1.6, LY, z], [LXc + 1.6, LY, z]]));
  const HZ = []; for (let z = 26; z <= LT - 1; z += 9) HZ.push(z);
  const hp = (z, t) => [LXc - 1.8 * Math.cos(t), LY + 3.6 * Math.sin(t), z];
  HZ.forEach((z) => { const pts = []; for (let i = 0; i <= 16; i++) pts.push(hp(z, (Math.PI * i) / 16)); hoops.push(path3(pts)); });
  [0.25, 0.5, 0.75].forEach((f) => bars.push(path3([hp(HZ[0], Math.PI * f), hp(HZ[HZ.length - 1], Math.PI * f)])));
  put("r101.ladder", [LXc, LY + 1, LT / 2], Ln(rungs.join(""), { tone: "mid" }) + Ln(hoops.join("") + bars.join(""), { tone: "mid" }), [record(A.box([LXc - 1.9, LY + 0.25, 3], [LXc + 1.9, LY + 3.7, LT], { name: "r101.ladder", owner: "r101.lrail0" }))]);
}

/* ====================================================================
   4 · los intercambiadores: E-101 al norte y E-102 al sur, sobre silletas y pedestales
   ==================================================================== */
function exchanger(tag, E, { nozzles }) {
  const F = G.frameAlong([E.x0, E.y, E.z], XD), L = E.x1 - E.x0;
  const SH = turned(`${tag}.shell`, F, [[0, E.R], [L, E.R]], { tone: "mid" }, { extra: seamZ(F, L / 2, E.R) });
  const cap = (s0, dir, nm) => {
    const s1 = s0 + dir * E.ch;
    ring(`${tag}.${nm}fl`, F, Math.min(s0, s0 + dir * 1.2), Math.max(s0, s0 + dir * 1.2), E.R - 0.4, E.R + 1.6, { tone: "mid" }, { owner: `${tag}.shell`, extra: Dots(G.dotsOf(F, s0 + dir * 1.2, E.R + 0.9, 14, P), { size: 0.28 }) });
    const pts = [[s0 + dir * 1.2, E.R], [s1, E.R]];
    for (let i = 1; i <= 8; i++) { const a = (Math.PI / 2) * (i / 8); pts.push([s1 + dir * (E.R * 0.55) * Math.sin(a), Math.max(0.6, E.R * Math.cos(a)), 1]); }
    pts[pts.length - 1][2] = 0;
    if (dir < 0) pts.reverse();
    return turned(`${tag}.${nm}`, F, pts.map((p) => (p.length === 3 ? p : p)), { tone: "mid" }, { owner: `${tag}.${nm}fl` });
  };
  const CW = cap(0, -1, "chW"), CE = cap(L, 1, "chE");
  E.saddles.forEach((x, i) => {
    box(`stand.${tag}.pier${i}`, [x - 4, E.y - E.R - 1, 0], [x + 4, E.y + E.R + 1, 5], { tone: "lo" }, { r: 0.3 });
    box(`${tag}.saddle${i}`, [x - 1.6, E.y - E.R + 1, 5], [x + 1.6, E.y + E.R - 1, E.z - E.R], { tone: "lo" }, { r: 0.1, owner: `stand.${tag}.pier${i}` });
  });
  const hosts = { shell: SH, chW: CW, chE: CE };
  const faces = {};
  for (const [nm, n] of Object.entries(nozzles)) faces[nm] = nozzle(`${tag}.${nm}`, hosts[n.on], n.at, n.dir, n.r, { owner: `${tag}.${n.on}`, neck: n.neck ?? 2.4 });
  return faces;
}
const E1f = exchanger("e101", { ...E1, saddles: [E1.x0 + 8, E1.x1 - 8] }, { nozzles: {
  in: { on: "chW", at: [E1.x0 - 4.5, E1.y, E1.z + E1.R], dir: ZD, r: rB },
  out: { on: "chE", at: [E1.x1 + 4.5, E1.y, E1.z + E1.R], dir: ZD, r: rB },
  steam: { on: "shell", at: [E1.x1 - 4, E1.y, E1.z + E1.R], dir: ZD, r: rM, neck: 3.4 },
  cond: { on: "shell", at: [E1.x0 + 16, E1.y, E1.z - E1.R], dir: [0, 0, -1], r: rS, neck: 1.6 },
} });
const E2f = exchanger("e102", { ...E2, saddles: [E2.x0 + 16, E2.x1 - 16] }, { nozzles: {
  in: { on: "shell", at: [E2.x0 + 10, E2.y, E2.z + E2.R], dir: ZD, r: rB, neck: 3.6 },
  out: { on: "shell", at: [E2.x1 - 6, E2.y, E2.z - E2.R], dir: [0, 0, -1], r: rB, neck: 1.6 },
  cws: { on: "chE", at: [E2.x1 + 4.5, E2.y + E2.R, E2.z - 3.5], dir: YD, r: rB },
  cwr: { on: "chE", at: [E2.x1 + 4.5, E2.y + E2.R, E2.z + 3.5], dir: YD, r: rB },
} });

/* ====================================================================
   5 · el separador V-102 sobre patas, con su visor de nivel
   ==================================================================== */
const VF = ZA([V2.x, V2.y, 0]);
const vhead = (z, dir) => { const pts = []; for (let i = 0; i <= 10; i++) { const a = (Math.PI / 2) * (i / 10); pts.push([z + dir * V2.hd * Math.sin(a), Math.max(0.5, V2.R * Math.cos(a)), 1]); } pts[pts.length - 1][2] = 0; return pts; };
const vprof = [...vhead(V2.z0, -1).reverse(), [V2.z0, V2.R], [V2.z1, V2.R], ...vhead(V2.z1, 1)];
vprof[0][2] = 0;
const VSH = turned("v102.shell", VF, vprof.map((p) => (p.length === 2 ? p : p)), { tone: "mid" }, { extra: seamZ(VF, (V2.z0 + V2.z1) / 2, V2.R) });
[45, 135, 225, 315].forEach((deg, i) => {
  const a = (deg * Math.PI) / 180, c = [V2.x + (V2.R + 0.9) * Math.cos(a), V2.y + (V2.R + 0.9) * Math.sin(a)];
  disc(`stand.v102.leg${i}`, ZA([c[0], c[1], 0.8]), 0, V2.z0 + 8 - 0.8, 0.9, { tone: "lo" }, { owner: "v102.shell" });
  box(`stand.v102.plate${i}`, [c[0] - 2, c[1] - 2, 0], [c[0] + 2, c[1] + 2, 0.8], { tone: "lo" }, { r: 0.2 });
});
const V_IN = nozzle("v102.in", VSH, [V2.x - V2.R, V2.y, 40], [-1, 0, 0], rB, { owner: "v102.shell", neck: 4 });
const V_GAS = nozzle("v102.gas", VSH, [V2.x, V2.y, V2.z1 + V2.hd - 0.3], ZD, rB, { owner: "v102.shell", neck: 4 });
const V_LIQ = nozzle("v102.liq", VSH, [V2.x, V2.y, V2.z0 - V2.hd + 0.3], [0, 0, -1], rM, { owner: "v102.shell", neck: 2 });
// visor de nivel del lado del lector: dos tomas y el vidrio entre ellas
const LGd = G.unit3([-0.5, 0.86, 0]);
const lgTop = [], lgZ = [30, 48];
lgZ.forEach((z, i) => {
  const p0 = addv([V2.x, V2.y, z], LGd, V2.R);
  const pd = pad(`v102.lg.pad${i}`, VSH, p0, LGd, 0.9, 1.0, {}, { owner: "v102.shell" });
  const c = addv(pd.face, LGd, 3.2);
  pipe(`v102.lg.tap${i}`, [pd.face, c], 0.5, { balls: [{ name: `v102.lg.valve${i}`, c, R: 1.4, at: "end" }] });
  lgTop.push(c);
});
disc("v102.lg.glass", ZA([lgTop[0][0], lgTop[0][1], lgZ[0] + entry(1.4, 0.55)]), 0, lgZ[1] - lgZ[0] - 2 * entry(1.4, 0.55), 0.55, { tone: "hi" }, { owner: "v102.lg.valve0" });

/* ====================================================================
   6 · los compresores C-101 A/B con sus motores, sobre bloque de concreto
   ==================================================================== */
const CS = [], CD = [];
C1.ys.forEach((Y, u) => {
  const n = `c101${"ab"[u]}`;
  box(`stand.${n}.block`, [C1.m0 - 4, Y - 9, 0], [C1.x1 + 4, Y + 9, 4], { tone: "lo" }, { r: 0.4, bevel: 0.3 });
  box(`${n}.skid`, [C1.m0 - 2, Y - 7, 4], [C1.x1 + 2, Y + 7, 5.5], { tone: "lo" }, { r: 0.2, owner: `stand.${n}.block`, extra: Dots([[C1.m0, Y - 5.5], [C1.m0, Y + 5.5], [C1.x1, Y - 5.5], [C1.x1, Y + 5.5]].map(([a, b]) => at([a, b, 5.5])), { size: 0.3 }) });
  const MF = G.frameAlong([C1.m0, Y, C1.z], XD), ML = C1.m1 - C1.m0;
  box(`${n}.mfeet`, [C1.m0 + 2, Y - 4.6, 5.5], [C1.m1 - 2, Y + 4.6, C1.z - C1.mR], { tone: "mid" }, { r: 0.2, owner: `${n}.skid` });
  turned(`${n}.motor`, MF, [[0, C1.mR - 2], [0.6, C1.mR - 0.6], [3, C1.mR], [ML - 1.2, C1.mR], [ML, C1.mR - 1.2]], { tone: "mid" }, { owner: `${n}.mfeet`, extra: Ln(G.ribsOf(MF, 4, ML - 2.2, C1.mR + 0.02, 22, P, { least: 0.1, seams: true }), { tone: "faint" }) });
  box(`${n}.tbox`, [C1.m0 + 9, Y - 2.4, C1.z + C1.mR - 0.4], [C1.m0 + 14, Y + 2.4, C1.z + C1.mR + 3], { tone: "mid" }, { r: 0.3, owner: `${n}.motor` });
  box(`${n}.guard`, [C1.m1, Y - 3.4, 5.5], [C1.x0, Y + 3.4, C1.z + 3.6], { tone: "mid" }, { r: 0.5, bevel: 0.3, owner: `${n}.skid` });
  const CF = G.frameAlong([C1.x0, Y, C1.z], XD);
  box(`${n}.feet`, [C1.x0 + 3, Y - 4, 5.5], [C1.x1 - 3, Y + 4, C1.z - C1.R], { tone: "mid" }, { r: 0.2, owner: `${n}.skid` });
  const CAS = turned(`${n}.casing`, CF, [[0, C1.R - 1.5], [1.4, C1.R], [C1.x1 - C1.x0 - 1.4, C1.R], [C1.x1 - C1.x0, C1.R - 1.5]], { tone: "mid" }, { owner: `${n}.feet`, rims: "all", extra: seamZ(CF, (C1.x1 - C1.x0) / 2, C1.R) });
  CS.push(nozzle(`${n}.suc`, CAS, [C1.x0 + 3, Y, C1.z + C1.R], ZD, rB, { owner: `${n}.casing`, neck: 1.8 }));
  CD.push(nozzle(`${n}.dis`, CAS, [C1.x1 - 4, Y, C1.z + C1.R], ZD, rM, { owner: `${n}.casing`, neck: 1.8 }));
});

/* ====================================================================
   7 · las tuberías: por el rack, entre los equipos y a grado
   ==================================================================== */
const GROUND = (name, x, y, w = 6) => box(`stand.${name}`, [x - w / 2, y - w / 2, 0], [x + w / 2, y + w / 2, 1.2], { tone: "lo" }, { r: 0.3 });
// cabezales que corren a lo largo del rack: agua de enfriamiento y tea
pipe("cws.hdr", [[RK.x0, LN.cws, laneZ(2)], [RK.x1, LN.cws, laneZ(2)]], 2, { open: [true, true], touch: ONRACK });
const FLT = [V2.x - 12, LN.flare, laneZ(2.2)];
pipe("flare.hdr", [[RK.x0, LN.flare, laneZ(2.2)], [RK.x1, LN.flare, laneZ(2.2)]], 2.2, { open: [true, true], touch: ONRACK, balls: [{ name: "flare.tee", c: FLT, R: 3.0 }] });
// válvula de seguridad de V-102: boquilla de lado en el espacio de vapor, cuerpo, bonete y descarga a la tea
{
  const pd = pad("psv.pad", VSH, [V2.x, V2.y - V2.R, 54], [0, -1, 0], 1.4, 1.0, {}, { owner: "v102.shell" });
  const B = [V2.x, pd.face[1] - 3.2, 54];
  disc("psv.neck", G.frameAlong(pd.face, [0, -1, 0]), 0, 3.2 - entry(2.2, 0.9), 0.9, { tone: "mid" }, { owner: "psv.pad" });
  ball("psv.body", B, 2.2, { tone: "mid" });
  turned("psv.bonnet", ZA(B), [[entry(2.2, 1.2), 1.2], [5.5, 1.0], [6.4, 1.4]], { tone: "mid" }, { owner: "psv.body" });
  disc("psv.cap", ZA(B), 6.4, 7.8, 0.9, { tone: "mid" }, { owner: "psv.bonnet" });
  pipe("psv.dis", [B, [FLT[0], B[1], B[2]], [FLT[0], B[1], 72], [FLT[0], LN.flare, 72], FLT], 0.9, { bend: 8, balls: [{ name: "psv.body", c: B, R: 2.2, shared: true, at: "start" }, { name: "flare.tee", c: FLT, R: 3.0, shared: true, at: "end" }] });
}
// 6 · alimento: llega por el rack desde el oeste y baja al cabezal de E-101
const zF = laneZ(rB);
pipe("p06", [[RK.x0, LN.feed, zF], [E1f.in[0], LN.feed, zF], [E1f.in[0], E1.y, zF], E1f.in], rB, { open: [true, false], flanges: [false, true], touch: ONRACK });
// 7 · de E-101 al serpentín del horno
pipe("p07", [E1f.out, [E1f.out[0], E1.y, 80], [E1f.out[0], H1.y, 80], H_IN], rB, { flanges: [true, true] });
// 8 · del horno a la cabeza del reactor: corre al pie del reactor, sube por su costado y entra por arriba
pipe("p08", [H_OUT, [112, H1.y, 28], [112, H1.y, 176], [112, R1.y, 176], [R1.x, R1.y, 176], R_IN], rB, { bend: 6, flanges: [true, true] });
// 9 · del reactor a E-102: sube, cruza por encima del rack y baja
const x9 = E2f.in[0];
pipe("p09", [R_OUT, [x9, R1.y, R_OUT[2]], [x9, R1.y, CZ], [x9, E2.y, CZ], E2f.in], rB, { flanges: [true, true] });
// 10 · de E-102 al separador, cerca del piso
pipe("p10", [E2f.out, [E2f.out[0], E2.y, 4], [226, E2.y, 4], [226, V2.y, V_IN[2]], V_IN], rB, { bend: 7, flanges: [true, true] });
// 11 · succión de los compresores: de la cabeza de V-102 a un cabezal que baja a cada uno
const zS = 84, zD = 92, xS = CS[0][0], xD = CD[0][0];
pipe("p11", [V_GAS, [xS, V2.y, zS], [xS, C1.ys[1], zS], CS[1]], rB, { bend: 6, flanges: [true, true], balls: [{ name: "p11.tee", c: [xS, C1.ys[0], zS], R: 2.4 }, { name: "p12.tee", c: [xS, 76, zS], R: 2.4 }] });
pipe("p11a", [[xS, C1.ys[0], zS], CS[0]], rB, { flanges: [false, true], balls: [{ name: "p11.tee", c: [xS, C1.ys[0], zS], R: 2.4, shared: true, at: "start" }] });
// 12 · purga: de la te de la succión al rack, hacia el este
pipe("p12", [[xS, 76, zS], [268, 76, zS], [268, LN.purge, zS], [268, LN.purge, laneZ(rM)], [RK.x1, LN.purge, laneZ(rM)]], rM, { open: [false, true], balls: [{ name: "p12.tee", c: [xS, 76, zS], R: 2.4, shared: true, at: "start" }], touch: ONRACK });
// 5 · reciclo: descarga de los compresores, sube al cabezal y vuelve por el rack hacia el oeste
pipe("p05", [CD[1], [xD, C1.ys[1], zD], [xD, LN.recycle, zD], [xD, LN.recycle, laneZ(rM)], [RK.x0, LN.recycle, laneZ(rM)]], rM, { open: [false, true], flanges: [true, false], balls: [{ name: "p05.tee", c: [xD, C1.ys[0], zD], R: 2.0 }], touch: ONRACK });
pipe("p05a", [CD[0], [xD, C1.ys[0], zD]], rM, { flanges: [true, false], balls: [{ name: "p05.tee", c: [xD, C1.ys[0], zD], R: 2.0, shared: true, at: "end" }] });
// 13 · líquido de V-102 a V-103, con la válvula de control de nivel cerca del piso
const LVc = [276, V2.y, 8];
controlValve("lv", LVc, XD, { R: 2.4, r: rM, line: "p13" });
pipe("p13", [V_LIQ, [V2.x, V2.y, 8], [296, V2.y, 8]], rM, { flanges: [true, false], open: [false, true], balls: [{ name: "lv.body", c: LVc, R: 2.4, shared: true }] });
// vapor de servicio al precalentador, desde el rack
pipe("hps", [[RK.x0, LN.hps, laneZ(rM)], [E1f.steam[0], LN.hps, laneZ(rM)], [E1f.steam[0], E1.y, laneZ(rM)], E1f.steam], rM, { open: [true, false], flanges: [false, true], touch: ONRACK });
// condensado a un sumidero
GROUND("drain.e101", E1f.cond[0], E1.y);
pipe("cond", [E1f.cond, [E1f.cond[0], E1.y, 1.2]], rS, { flanges: [true, false] });
// agua de enfriamiento de E-102: entra y sale por el cabezal y baja a la fosa
box("stand.cwpit", [E2f.cws[0] - 5, E2.y + 10, 0], [E2f.cws[0] + 5, E2.y + 22, 1.2], { tone: "lo" }, { r: 0.4 });
pipe("cws", [E2f.cws, [E2f.cws[0], E2.y + 13, E2f.cws[2]], [E2f.cws[0], E2.y + 13, 1.2]], rB, { flanges: [true, false] });
pipe("cwr", [E2f.cwr, [E2f.cwr[0], E2.y + 19, E2f.cwr[2]], [E2f.cwr[0], E2.y + 19, 1.2]], rB, { flanges: [true, false] });

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const pickOf = (nm) => (nm.match(/^(?:stand\.)?(h101|r101|e101|e102|v102|c101a|c101b|rack|lv)/) || [, nm.match(/^p\d+|^hps|^cond|^cw/) ? "tubo" : "otro"])[1];
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}" data-pick="${pickOf(item.name)}">${item.svg}</g>`);
const svg = k.figureSvg({ width: W, height: H, label: "Sección de reacción de la planta de benceno en isométrico: rack de tuberías, horno, precalentador y reactor al norte; enfriador, separador y compresores al sur, con las líneas de proceso entre ellos", body: [`<g class="pb-items">${groups.join("")}</g>`] });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "out", "fig.svg"), svg);
writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Planta de benceno", theme: "light", width: 1000, body: `<div class="iso-stage">${svg}</div>`, script: "" }));
const ANCLAS = { H101: [H1.x, H1.y, 70], E101: [E1.x0 + 12, E1.y, E1.z + E1.R], R101: [R1.x, R1.y, 100], E102: [E2.x0 + 30, E2.y, E2.z + E2.R], V102: [V2.x, V2.y, V2.z1 - 4],
  C101A: [C1.m0 + 12, C1.ys[0], C1.z + C1.mR], C101B: [C1.m0 + 12, C1.ys[1], C1.z + C1.mR], RACK: [RK.xs[2], RK.y, RK.z], LV: [276, V2.y, 20], PSV: [V2.x, V2.y - V2.R - 4, 61],
  FLARE: [20, LN.flare, laneZ(2.2) + 2.2], CW: [E2f.cws[0], E2.y + 16, 3], PLAT: [R1.x + 12, R1.y + 12, ZP + 6] };
writeFileSync(join(HERE, "planta_data.json"), JSON.stringify({ P, W, H, ROUTES, ANCLAS, PB }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
// Lo excusado: tres líneas que salen o llegan a la boquilla de la cabeza de su propio equipo y pasan,
// en pantalla, sobre la silueta de ese equipo (la de gas de V-102, la de entrada al reactor y la de E-102).
if (!FAST) A.auditOrExit(R_, P, { crowd: [["p11", "v102.shell"], ["p08", "r101.shell"], ["p09", "e102.shell"]] });
