/* ====================================================================
   El tanque de laboratorio en isométrico (skill anatomy), la otra vista
   «Equipo» del Explorador de agitación, para los tanques de menos de
   0,8 m: un tanque cilíndrico de vidrio de fondo plano sobre la placa
   base de un agitador de varilla, con la columna, la nuez, el brazo, el
   motor con su panel y el mandril. El vidrio deja ver todo: lo de adentro
   (el eje y el impulsor, los bafles, el líquido, las partículas, los
   sólidos, el gas, el trazador y las sondas) lo pinta la página en un
   lienzo encima, con la simulación del explorador, y también el frente
   del vidrio, que va delante del líquido.
   Uso: node build-lab.mjs [--tall] [--audit] [--fast]
   --tall: el tanque alto, para H/T hasta 2.
   Unidades: 1 = T/100. z hacia arriba desde el fondo por dentro.
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
const FAST = process.argv.includes("--fast"), TALL = process.argv.includes("--tall"), TAG = TALL ? "lb" : "la";
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
mkdirSync(join(HERE, "out"), { recursive: true });
const writeJs = () => {
  writeFileSync(join(HERE, "out", "fig.js"), "/* reactor agitado en isométrico: generado por build.mjs */\nvar FAgit = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FAgit;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "ag.css"), "utf8"));
};

const AG = GEO.AG, GL = GEO.GL, AZ = AG.AZ, EL = AG.EL, Z1 = GL.Z1[TAG];
const { T, HV } = GEO.axesOf(AZ);
const R = GL.R, TW = GL.TW, BT = GL.BT, RO = R + TW, ZP = -BT - GL.plate, ZM0 = Z1 + GL.chuck, ZM1 = ZM0 + 8, ZH0 = ZM1, ZH1 = ZH0 + 40, MR = 12.5;
const W3 = (u, v, z) => [u * T[0] + v * HV[0], u * T[1] + v * HV[1], z];
const ROD = W3(GL.rod[0], GL.rod[1], 0), ZR1 = ZH1 + 10;
const W = 600, H = TALL ? 920 : 760;
// la placa base abarca el tanque y la columna; sus esquinas entran en el encuadre
const PX = [Math.min(-52.5, ROD[0] - 6) - 4, Math.max(52.5, ROD[0] + 6) + 4], PY = [Math.min(-52.5, ROD[1] - 6) - 4, Math.max(52.5, ROD[1] + 6) + 4];
const EXT = [[PX[0], PY[0], ZP - 1.4], [PX[1], PY[0], ZP - 1.4], [PX[1], PY[1], ZP - 1.4], [PX[0], PY[1], ZP - 1.4], [ROD[0], ROD[1], ZR1 + 2], W3(0, 0, ZH1 + 6), W3(-60, 0, Z1), W3(60, 0, Z1)];
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const f1 = (v) => (Math.round(v * 100) / 100).toString();
const pth = (pts, closed = true) => pts.map(([x, y], i) => (i ? "L" : "M") + f1(x) + " " + f1(y)).join("") + (closed ? "Z" : "");

const R_ = A.recorder(P, { order: [], spring: {} });
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
const half = (r0, r1, n = 36) => GEO.halfRing(r0, r1, n);
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
  if (red) { const a0 = (225 - 270 * (1 - red)) * D2R, a1 = -45 * D2R, rr = r - 1.25; arc = `<path class="ag-redarc" d="M${(rr * Math.cos(a0)).toFixed(2)} ${(rr * Math.sin(a0)).toFixed(2)}A${rr} ${rr} 0 0 1 ${(rr * Math.cos(a1)).toFixed(2)} ${(rr * Math.sin(a1)).toFixed(2)}"/>`; }
  return { M, html: `<g class="ag-dial" transform="${M}">${arc}<path class="ag-tick" d="${tk}"/><g data-live="${live}"><path class="ag-needle" d="M-0.9 0L${(r - 1.6).toFixed(2)} 0"/></g><circle class="ag-hub" r="0.55"/></g>` };
}
// el volante de una válvula de mano: bonete desde la superficie del cuerpo y rueda de alma llena con sus radios
function wheel(name, c, up, R) {
  const top = G.add3(c, G.mul3(up, R + 2.8));
  disc(`${name}.bonnet`, G.frameAlong(c, up), entry(R, 1.0), R + 2.8, 1.0, { tone: "mid" }, { owner: `${name}.body` });
  const HW = G.frameAlong(top, up);
  ring(`${name}.wheel`, HW, 0, 0.6, 0.8, 4.2, { tone: "hi" }, { owner: `${name}.bonnet` });
  return [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; return path3([G.pointOf(HW, 0.6, 1.0, a), G.pointOf(HW, 0.6, 3.45, a)]); }).join("") + G.arcOf(HW, 0.6, 3.55, P, { least: -1 });
}

const DF = ZA_([0, 0, 0]);
const rad = (th) => [Math.cos(th) * T[0] + Math.sin(th) * HV[0], Math.cos(th) * T[1] + Math.sin(th) * HV[1], 0];
const polar = (deg, r, z) => addv([0, 0, z], rad(deg * D2R), r);
// un segmento contra un polígono (par-impar): los tramos de adentro
function clipSeg(a, b, poly) {
  const ts = [0, 1];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length], d1 = [b[0] - a[0], b[1] - a[1]], d2 = [q[0] - p[0], q[1] - p[1]], den = d1[0] * d2[1] - d1[1] * d2[0];
    if (Math.abs(den) < 1e-12) continue;
    const t = ((p[0] - a[0]) * d2[1] - (p[1] - a[1]) * d2[0]) / den, s = ((p[0] - a[0]) * d1[1] - (p[1] - a[1]) * d1[0]) / den;
    if (t > 0 && t < 1 && s >= 0 && s < 1) ts.push(t);
  }
  ts.sort((x, y) => x - y);
  const inside = (m) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const pi = poly[i], pj = poly[j]; if ((pi[1] > m[1]) !== (pj[1] > m[1]) && m[0] < ((pj[0] - pi[0]) * (m[1] - pi[1])) / (pj[1] - pi[1]) + pi[0]) c = !c; } return c; };
  const out = [];
  for (let i = 0; i < ts.length - 1; i++) { const t0 = ts[i], t1 = ts[i + 1]; if (t1 - t0 < 1e-6) continue; const tm = (t0 + t1) / 2, m = [a[0] + (b[0] - a[0]) * tm, a[1] + (b[1] - a[1]) * tm]; if (inside(m)) out.push([[a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1]]); }
  return out;
}
// rayado de una sección en el plano de corte (u, z): líneas a ±45° cada `step`, recortadas al polígono
function hatch(poly, step, both = true) {
  const us = poly.map((p) => p[0]), zs = poly.map((p) => p[1]), u0 = Math.min(...us), u1 = Math.max(...us), z0 = Math.min(...zs), z1 = Math.max(...zs), hgt = z1 - z0, out = [];
  for (const sg of both ? [1, -1] : [1]) for (let c = u0 - hgt; c < u1 + hgt; c += step) {
    const a = sg > 0 ? [c, z0] : [c + hgt, z0], b = sg > 0 ? [c + hgt, z1] : [c, z1];
    for (const [p, q] of clipSeg(a, b, poly)) if (Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.25) out.push(path3([W3(p[0], 0, p[1]), W3(q[0], 0, q[1])]));
  }
  return out.join("");
}

// las caras de un cuerpo de revolución vistas por dentro (o la cúpula por fuera), sombreadas en franjas como las del kit
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + (Math.round(x * 10) / 10) + " " + (Math.round(y * 10) / 10)).join("") + "Z";
function cylinder(rr, sg, za, zb, nt, out) {
  let run = null;
  // cada tramo del mismo tono va en un solo polígono, con los arcos de arriba y de abajo completos
  const flush = (t1) => {
    if (run && run.band >= 0) {
      const P3 = (t, z) => addv([0, 0, z], rad(t), rr), m = Math.max(1, Math.ceil((t1 - run.t0) / (Math.PI / 60))), pts = [];
      for (let j = 0; j <= m; j++) pts.push(P3(run.t0 + ((t1 - run.t0) * j) / m, za));
      for (let j = m; j >= 0; j--) pts.push(P3(run.t0 + ((t1 - run.t0) * j) / m, zb));
      const d = pth1(pts.map((p) => C.pr(...p))); out.by[run.band].push(d); out.fill.push(d);
    }
    run = null;
  };
  for (let i = 0; i < nt; i++) {
    const t0 = Math.PI + (Math.PI * i) / nt, tm = t0 + Math.PI / nt / 2, n = G.mul3(rad(tm), sg), band = G.dot3(n, C.V) <= 1e-4 ? -1 : BAND(G.dot3(n, C.L));
    if (!run || run.band !== band) { flush(t0); run = { band, t0 }; }
  }
  flush(2 * Math.PI);
}
function surface(P3, N3, nt, na, out) {
  for (let i = 0; i < nt; i++) {
    const t0 = Math.PI + (Math.PI * i) / nt, t1 = Math.PI + (Math.PI * (i + 1)) / nt, tm = (t0 + t1) / 2;
    let run = null;
    const flush = (jEnd) => {
      if (!run || run.band < 0) { run = null; return; }
      const pts = [];
      for (let j = run.j0; j <= jEnd; j++) pts.push(P3(t0, j / na));
      for (let j = jEnd; j >= run.j0; j--) pts.push(P3(t1, j / na));
      const d = pth1(pts.map((p) => C.pr(...p)));
      out.by[run.band].push(d); out.fill.push(d); run = null;
    };
    for (let j = 0; j < na; j++) {
      const n = N3(tm, (j + 0.5) / na), band = G.dot3(n, C.V) <= 1e-4 ? -1 : BAND(G.dot3(n, C.L));
      if (!run || run.band !== band) { if (run) flush(j); run = { band, j0: j }; }
    }
    if (run) flush(na);
  }
}
function toned(build) {
  const out = { by: [[], [], [], [], []], fill: [] };
  build(out);
  return `<path class="iso-fill" d="${out.fill.join("")}"/>` + out.by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "");
}
const headP = (rr, hh, zc) => (t, u) => { const a = (Math.PI / 2) * u; return addv([0, 0, zc + hh * Math.sin(a)], rad(t), rr * Math.cos(a)); };
const headN = (rr, hh, sg) => (t, u) => { const a = (Math.PI / 2) * u, r3 = rad(t); return G.mul3(G.unit3([r3[0] * Math.cos(a) / rr, r3[1] * Math.cos(a) / rr, Math.sin(a) / hh]), sg); };
const halfDisc = (rr, z, n = 48) => { const pts = []; for (let i = 0; i <= n; i++) pts.push(addv([0, 0, z], rad(Math.PI + (Math.PI * i) / n), rr)); return pts; };

/* ====================================================================
   1 · el soporte: placa base con sus patas de goma, columna, nuez y brazo
   ==================================================================== */
const ENDS = {};
{
  // la placa base (un bloque de fundición pintado) con el tanque encima y la columna atrás a la izquierda
  const [x0, x1] = PX, [y0, y1] = PY;
  box("plate", [x0, y0, ZP], [x1, y1, -BT], { tone: "lo" }, { r: 3.2, bevel: 0.8, owner: "foot0", cls: "ag-dark" });
  [[x0 + 6, y0 + 6], [x1 - 6, y0 + 6], [x1 - 6, y1 - 6], [x0 + 6, y1 - 6]].forEach(([x, y], i) => disc(`foot${i}`, ZA_([x, y, ZP - 1.4]), 0, 1.4, 3.2, { tone: "lo" }, { ground: true }));
  // la placa de marca en la cara de adelante del bloque
  ENDS.plate = [x1, (y0 + y1) / 2, ZP + 2];
}
disc("rod.boss", ZA_([ROD[0], ROD[1], -BT]), 0, 3.2, 3.8, { tone: "mid" }, { owner: "plate" });
// la nuez: un bloque en la columna con el brazo hacia el eje del agitador y su tornillo de apriete
const ZARM = ZH0 + 31, AD = G.unit3([-ROD[0], -ROD[1], 0]), AV = G.unit3(G.cross3(ZD3, AD)), AVf = G.dot3(AV, HV) > 0 ? AV : G.mul3(AV, -1);
const BF = { o: [ROD[0], ROD[1], 0], a: ZD3, u: AD, v: AVf };
// la columna en dos tramos, abajo y arriba de la nuez que la abraza
disc("rod", ZA_([ROD[0], ROD[1], -BT]), 3.2, ZARM - 5 + BT, 1.8, { tone: "hi" }, { owner: "rod.boss" });
fp("boss", BF, [[-4, -4], [4, -4], [4, 4], [-4, 4]], ZARM - 5, ZARM + 5, { tone: "mid" }, { owner: "rod", cls: "ag-paint" });
disc("rod.top", ZA_([ROD[0], ROD[1], ZARM + 5]), 0, ZR1 - ZARM - 5, 1.8, { tone: "hi" }, { owner: "boss" });
disc("rod.cap", ZA_([ROD[0], ROD[1], ZR1]), 0, 0.8, 2.0, { tone: "mid" }, { owner: "rod.top" });
{
  const sc = addv([ROD[0], ROD[1], ZARM], AVf, 4);
  disc("boss.screw", G.frameAlong(sc, AVf), 0, 3.2, 0.9, { tone: "mid" }, { owner: "boss" });
  disc("boss.knob", G.frameAlong(sc, AVf), 3.2, 5.0, 2.6, { tone: "lo" }, { owner: "boss.screw", extra: Dots(G.dotsOf(G.frameAlong(sc, AVf), 5.0, 1.7, 8, P, { all: true }), { size: 0.38 }) });
}
const LARM = Math.hypot(ROD[0], ROD[1]) - 4 - (MR + 3);
disc("arm", G.frameAlong(addv([ROD[0], ROD[1], ZARM], AD, 4), AD), 0, LARM, 1.4, { tone: "hi" }, { owner: "boss" });

/* ====================================================================
   2 · el agitador: collar, motor con su panel, tapa con rejilla y mandril
   ==================================================================== */
const MF = ZA_([0, 0, 0]);
// prisma vertical con la cara de atrás hecha arco de la carcasa: asienta sobre ella sin hundirse
const onBody = (u0, out) => { const pts = []; for (let i = 0; i <= 12; i++) { const u = -u0 + (2 * u0 * i) / 12; pts.push([u, Math.sqrt(MR * MR - u * u)]); } return [...pts, [u0, MR + out], [-u0, MR + out]]; };
disc("mot.body", MF, ZH0, ZH1, MR, { tone: "mid" }, { owner: "mot.clamp", cls: "ag-paint" });
fp("mot.clamp", { o: [0, 0, 0], a: ZD3, u: AVf, v: G.mul3(AD, -1) }, onBody(3.2, 3), ZARM - 3, ZARM + 3, { tone: "lo" }, { owner: "arm", cls: "ag-dark" });
turned("mot.top", ZA_([0, 0, ZH1]), [[0, MR], [3, MR - 0.8], [5.2, MR - 3.4]], { tone: "mid" }, { owner: "mot.body", cls: "ag-paint", extra: Dots([...G.dotsOf(ZA_([0, 0, ZH1]), 5.2, 6.6, 12, P, { all: true }), ...G.dotsOf(ZA_([0, 0, ZH1]), 5.2, 4.0, 8, P, { all: true }), ...G.dotsOf(ZA_([0, 0, ZH1]), 5.2, 1.6, 4, P, { all: true })], { size: 0.45 }) });
{
  // el panel del lado del lector: pantalla con la velocidad y la perilla
  const PW = 6.2;
  fp("mot.panel", { o: [0, 0, 0], a: ZD3, u: T, v: HV }, onBody(PW, 1.6), ZH0 + 5, ZH0 + 21, { tone: "mid" }, { owner: "mot.body", cls: "ag-panel",
    extra: `<path class="ag-screen" d="${pth([[-4.6, ZH0 + 14], [4.6, ZH0 + 14], [4.6, ZH0 + 19.4], [-4.6, ZH0 + 19.4]].map(([u, z]) => C.pr(...W3(u, MR + 1.62, z))))}"/>` });
  const kc = W3(0, MR + 1.6, ZH0 + 9.4);
  disc("mot.knob", G.frameAlong(kc, HV), 0, 1.8, 3.0, { tone: "lo" }, { owner: "mot.panel", extra: Dots(G.dotsOf(G.frameAlong(kc, HV), 1.8, 2.1, 10, P, { all: true }), { size: 0.3 }) });
  ENDS.screen = { c: W3(0, MR + 1.65, ZH0 + 16.7), w: 9.2, h: 5.4 };
}
turned("chuck", ZA_([0, 0, ZM0]), [[0, 2.6], [3.6, 3.4], [8, 4.4]], { tone: "hi" }, { owner: "mot.body", extra: Dots(G.dotsOf(ZA_([0, 0, ZM0]), 5.2, 3.9, 3, P), { size: 0.45 }) });
ENDS.motor = [0, 0, ZH1];

/* ====================================================================
   3 · el tanque de vidrio: lo de atrás va en el dibujo (pared por dentro, fondo y borde); el frente lo pinta la página
   ==================================================================== */
const GM = [[-BT, 0], [-BT, RO], [Z1, RO], [Z1, R], [0, R], [0, 0]];
const GLASS = record(A.body(DF, GM, { name: "glass" }));
const cavity = toned((o) => { cylinder(R, -1, 0, Z1, 160, o); });
const bottom = halfDisc(R, 0).concat(halfDisc(R, 0).map((p) => [-p[0], -p[1], p[2]]));
const rimBack = [...halfDisc(RO, Z1), ...halfDisc(R, Z1).reverse()].map((p) => C.pr(...p));
const glassSvg = `<path class="ag-gbottom" d="${pth1(bottom.map((p) => C.pr(...p)))}"/>`
  + `<g class="iso-solid ag-gwall">${cavity}</g><path class="ag-grim" d="${pth1(rimBack)}"/>`;
put("glass", [0, -R * 0.6, Z1 / 2], glassSvg, [GLASS]);
ENDS.glass = W3(R + TW, 0, Z1 * 0.5);

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
const label = "Tanque de vidrio de laboratorio en isométrico sobre la placa base de un agitador de varilla, con la columna, la nuez, el brazo, el motor con su panel y el mandril";
const svg = k.figureSvg({ width: W, height: H, label, body: [`<g class="ag-items">${groups.join("")}</g>`] }).replace("<svg ", `<svg id="agSvg${TAG}" `);
const DATA = { P, W, H, sc: G.scaleOf(P), tag: TAG, glass: true, Z1, AZ, EL, T, HV, RIO: RO, R, TW, BT, ends: ENDS, shaftTop: ZM0 - 2.6 * Math.tan(EL * D2R), shaftR: 1.2 };
writeFileSync(join(HERE, "out", `agitador-${TAG}.svg`), svg);
writeFileSync(join(HERE, "out", `agitador-${TAG}.json`), JSON.stringify(DATA));
writeFileSync(join(HERE, "preview-lab.html"), k.pageHtml({ title: "Tanque de laboratorio", theme: "light", width: 900, body: `<style>${readFileSync(join(HERE, "ag.css"), "utf8")}</style><div class="iso-stage" id="agFig">${svg}</div>`, script: "" }));
console.log("agitador", TAG, "items", R_.items.length, "scale", G.scaleOf(P).toFixed(3), "svg", svg.length);
if (!FAST) A.auditOrExit(R_, P, {});
