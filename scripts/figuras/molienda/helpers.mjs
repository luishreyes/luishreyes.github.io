/* Las herramientas de dibujo que comparten las cuatro figuras de molienda (las mismas de las otras figuras del curso):
   cajas, prismas en un marco cualquiera, cuerpos torneados, coronas, tubos con codos y bridas, esferas con pasos,
   asientos sobre superficies curvas, diales y volantes. makeKit las arma sobre la proyección y el registro del audit. */
export function makeKit({ k, G, A, X, P, C, R_, T, HV, tubePieces, tubeSvg }) {
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const f1 = (v) => (Math.round(v * 100) / 100).toString();
const pth = (pts, closed = true) => pts.map(([x, y], i) => (i ? "L" : "M") + f1(x) + " " + f1(y)).join("") + (closed ? "Z" : "");
const record = R_.solid;
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", ground, owner, cls = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground, owner }, steps));
  const body = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style }) + extra;
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra, [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", rims, owner, smooth, steps, bevel = 0, cls = "", hole = null, cut = null, fill, ground } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(hole ? { hole } : {}), ...(fill ? { fill } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ground, radius: smooth && smooth.radius ? smooth.radius : null, ...(cut ? { cut } : {}) }));
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
const ZA_ = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const CUT = (o) => G.frameOf(o, [0, 0, 1], T, HV); // u a lo largo del plano de corte, v hacia el lector
function tubeItems(name, route, r, { tone = "mid", maxLength = 14, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch } = {}) {
  R_.route(name, route, r, { owner: name, gaps, ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(0.6, Math.min(2.2, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: cls ? `<g class="${cls}">${svg}</g>` : svg, move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] });
  });
}
// un racor, un codo o el cuerpo de una válvula: una esfera con el paso de cada tubo que la cruza o termina en ella
function ball(name, c, R, style = {}, { owner, cls = "", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(R + 0.6))), G.add3(c, G.mul3(b.dir, R + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, R, { name, owner, ...(cut.length ? { cut } : {}) }));
  const body = S(G.sphereOf(c, R, P), { tone: "mid", ...style });
  put(name, c, cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
const entry = (R, r) => Math.sqrt(Math.max(0, R * R - r * r)) - 0.02;
/* un tubo con los codos redondeados. Cada esfera de la lista abre un hueco donde el tubo la cruza; una esfera en un
   extremo (at: "start" o "end") recibe el tubo hasta su superficie. Cada collar (c, half) abre su hueco. */
function pipe(name, control, r, { bend = 3, tone = "mid", flanges = [false, false], flangeR = 1.7, cls = "", maxLength = 14, balls = [], collars = [], open = [false, false], breaks = [], touch } = {}) {
  const ctl = control.map((q) => [...q]);
  for (const b of balls) {
    if (b.at !== "start" && b.at !== "end") continue;
    const i = b.at === "start" ? 0 : ctl.length - 1, j = b.at === "start" ? 1 : ctl.length - 2, dir = G.unit3(G.sub3(ctl[j], b.c));
    ctl[i] = G.add3(b.c, G.mul3(dir, entry(b.R, r)));
  }
  const line = G.fillet(ctl, Math.max(r * bend, 3), 12, { P, tube: r });
  const total = G.pathLength(line), gaps = [];
  [[0, -1], [total, 1]].forEach(([along, sign], index) => {
    if (!flanges[index]) return;
    const thick = Math.max(1.0, r * 0.38), tangent = G.tangentAlong(line, along);
    const centre = G.add3(G.pointAlong(line, along), G.mul3(tangent, (-sign * thick) / 2));
    gaps.push(sign < 0 ? [0, thick] : [total - thick, total]);
    disc(`${name}.flange${index}`, G.frameAlong(centre, tangent), -thick / 2, thick / 2, r * flangeR, { tone: "mid" }, { owner: name, cls, extra: Dots(G.dotsOf(G.frameAlong(centre, tangent), thick / 2 * sign, r * (flangeR + 1) / 2, 6, P, { all: false, least: 0.05 }), { size: 0.4 }) });
  });
  const nearest = (c) => { let best = 0, bd = 1e9; for (let q = 0; q <= total; q += 0.05) { const d = G.len3(G.sub3(G.pointAlong(line, q), c)); if (d < bd) { bd = d; best = q; } } return best; };
  for (const b of balls) {
    let dir = null;
    if (b.at !== "start" && b.at !== "end") { const q = nearest(b.c), dd = entry(b.R, r); gaps.push([Math.max(0, q - dd), Math.min(total, q + dd)]); dir = G.tangentAlong(line, q); }
    const mine = dir ? [{ owner: name, dir, r }] : [];
    if (!b.shared) ball(b.name, b.c, b.R, b.style || {}, { bores: [...mine, ...(b.bores || [])], cls: b.cls || "" });
  }
  for (const c of collars) { const q = nearest(c.c); gaps.push([q - c.half, q + c.half]); }
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), cls, maxLength, breaks, ends: [!open[0], !open[1]], touch });
  return line;
}
function mergeGaps(gs) { const s = gs.filter((g) => g[1] > g[0]).sort((a, b) => a[0] - b[0]), out = []; for (const g of s) { const l = out[out.length - 1]; if (l && g[0] <= l[1]) l[1] = Math.max(l[1], g[1]); else out.push([...g]); } return out; }
// un asiento: el cilindro que sale de una superficie curva hasta una cara plana, cortado justo en la superficie
function pad(name, hosts, point, outward, a, h, style = {}, { owner, cls = "", extra = "", from = null } = {}) {
  const hs = [hosts].flat(), inside = (p) => hs.some((shape) => A.sdf(shape, p) < 0);
  const axis = G.unit3(outward), F = G.frameAlong(point, axis);
  const start = (angle) => { let lo = from ?? -2.5 * a, hi = h; if (!inside(G.pointOf(F, lo, a, angle))) return 0; for (let k2 = 0; k2 < 40; k2++) { const mid = (lo + hi) / 2; if (inside(G.pointOf(F, mid, a, angle))) lo = mid; else hi = mid; } return hi; };
  const low = Math.min(...Array.from({ length: 48 }, (_, i) => start((i / 48) * Math.PI * 2)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, G.add3(point, G.mul3(axis, h / 2)), cls ? `<g class="${cls}">${body}</g>` : body, [record(A.disc(F, low - 0.05, h, a, { name, owner, seated: true, cut: hs }))]);
  return { F, face: G.add3(point, G.mul3(axis, h)) };
}
/* ---------- vectores, planos y piezas pequeñas ---------- */
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1], addv = (p, d, kk) => [p[0] + d[0] * kk, p[1] + d[1] * kk, p[2] + (d[2] || 0) * kk];
const D2R = Math.PI / 180;
function planeM(c, e1, e2) {
  const o = at(c), a = at(G.add3(c, e1)), b = at(G.add3(c, e2));
  return `matrix(${(a[0] - o[0]).toFixed(4)} ${(a[1] - o[1]).toFixed(4)} ${(b[0] - o[0]).toFixed(4)} ${(b[1] - o[1]).toFixed(4)} ${o[0].toFixed(3)} ${o[1].toFixed(3)})`;
}
function faceBasis(n) { const e1 = G.unit3(G.cross3(ZD3, n)); return { e1, e2: G.unit3(G.cross3(n, e1)) }; }
const facing = (d, up = 0.25) => G.unit3([HV[0] * 0.85 + d[0] * 0.5, HV[1] * 0.85 + d[1] * 0.5, up]);
// un manómetro o un termómetro de esfera: caja, bisel, escala y aguja (viva)
function dial(name, c, n, r, { live, ticks = 9, owner, red = 0 } = {}) {
  const F = G.frameAlong(c, n);
  // la caja va de −1,6 a 0 a lo largo de n; c es el centro de la cara
  disc(`${name}.case`, F, -1.6, 0, r, { tone: "mid" }, { owner });
  ring(`${name}.bezel`, F, 0, 0.35, r - 0.55, r, { tone: "hi" }, { owner: `${name}.case` });
  const { e1, e2 } = faceBasis(n), face = G.add3(c, G.mul3(n, 0.36)), M = planeM(face, e1, e2);
  let tk = "";
  for (let i = 0; i < ticks; i++) { const t = (225 - (270 * i) / (ticks - 1)) * D2R, r0 = r - 1.45, r1 = r - (i % 2 ? 1.05 : 0.8); tk += `M${(r0 * Math.cos(t)).toFixed(2)} ${(r0 * Math.sin(t)).toFixed(2)}L${(r1 * Math.cos(t)).toFixed(2)} ${(r1 * Math.sin(t)).toFixed(2)}`; }
  let arc = "";
  if (red) { const a0 = (225 - 270 * (1 - red)) * D2R, a1 = -45 * D2R, rr = r - 1.25; arc = `<path class="ml-redarc" d="M${(rr * Math.cos(a0)).toFixed(2)} ${(rr * Math.sin(a0)).toFixed(2)}A${rr} ${rr} 0 0 1 ${(rr * Math.cos(a1)).toFixed(2)} ${(rr * Math.sin(a1)).toFixed(2)}"/>`; }
  return { M, html: `<g class="ml-dial" transform="${M}">${arc}<path class="ml-tick" d="${tk}"/><g data-live="${live}"><path class="ml-needle" d="M-0.9 0L${(r - 1.6).toFixed(2)} 0"/></g><circle class="ml-hub" r="0.55"/></g>` };
}
// el volante de una válvula de mano: bonete desde la superficie del cuerpo y rueda de alma llena con sus radios
function wheel(name, c, up, R) {
  const top = G.add3(c, G.mul3(up, R + 2.8));
  disc(`${name}.bonnet`, G.frameAlong(c, up), entry(R, 1.0), R + 2.8, 1.0, { tone: "mid" }, { owner: `${name}.body` });
  const HW = G.frameAlong(top, up);
  ring(`${name}.wheel`, HW, 0, 0.6, 0.8, 4.2, { tone: "hi" }, { owner: `${name}.bonnet` });
  return [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; return path3([G.pointOf(HW, 0.6, 1.0, a), G.pointOf(HW, 0.6, 3.45, a)]); }).join("") + G.arcOf(HW, 0.6, 3.55, P, { least: -1 });
}

return { at, S, Ln, Dots, path3, f1, pth, record, put, box, fp, turned, disc, ring, ZA_, CUT, tubeItems, ball, entry, pipe, mergeGaps, pad, XD, YD, ZD3, addv, D2R, planeM, faceBasis, facing, dial, wheel };
}
