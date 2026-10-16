/* ====================================================================
   El reactor agitado enchaquetado en isométrico (skill anatomy), para la
   pestaña «Tanque» del Explorador de agitación (vista «Equipo»). Es el
   reactor de extracción del proyecto: tanque de fondo plano con camisa de
   vapor en la pared y en el fondo, aislamiento con su forro, cabeza
   superior 2:1 con sus boquillas (agitador, entrada de gas, boca de
   hombre, mirilla con su lámpara, alimentación, termopozo y venteo), el
   accionamiento (sello mecánico, linterna con el acople, reductor de
   ángulo recto y motor), patas y la válvula de fondo. Va abierto por el
   plano vertical del eje que mira al lector: se ve la mitad de atrás del
   casco por dentro y, en el corte, el casco, la camisa, el aislamiento y
   su forro. Lo de adentro (el eje y el impulsor, los bafles, el líquido,
   las partículas, los sólidos, el gas y el trazador) lo pinta la página
   en un lienzo encima, con la simulación del explorador.
   Uso: node build.mjs [--tall] [--audit] [--fast] · --js
   --tall: el cuerpo recto alto, para H/T hasta 2.
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
const FAST = process.argv.includes("--fast"), TALL = process.argv.includes("--tall"), TAG = TALL ? "b" : "a";
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
mkdirSync(join(HERE, "out"), { recursive: true });
const writeJs = () => {
  writeFileSync(join(HERE, "out", "fig.js"), "/* reactor agitado en isométrico: generado por build.mjs */\nvar FAgit = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FAgit;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "ag.css"), "utf8"));
};
if (process.argv.includes("--js")) { writeJs(); console.log("out/fig.js, out/fig.css"); process.exit(0); }

const AG = GEO.AG, AZ = AG.AZ, EL = AG.EL, Z1 = AG.Z1[TAG];
const { T, HV } = GEO.axesOf(AZ);
const R = AG.R, TW = AG.TW, HD = AG.hd, RO = R + TW, HO = HD + TW;
const RJI = GEO.RJI(), RJO = GEO.RJO(), RIO = GEO.RIO(), ZB = GEO.ZB(), ZI = GEO.ZI(), ZT = Z1 - AG.jTop, ZC = Z1 + HO, FLOOR = AG.floor;
const W3 = (u, v, z) => [u * T[0] + v * HV[0], u * T[1] + v * HV[1], z];
const W = 640, H = TALL ? 940 : 760;
const EXT = [W3(-78, 0, FLOOR), W3(96, 0, FLOOR), W3(-78, -70, FLOOR), W3(96, -70, FLOOR), W3(0, 40, FLOOR), W3(-78, -70, ZC + 50), W3(96, -70, ZC + 50), W3(0, 0, ZC + 52), W3(-70, 10, ZC + 30)];
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
const FRONT = A.orientedBox([HV[0] * 400, HV[1] * 400, 100], [T, HV, ZD3], [400, 400, 400]);
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

/* ====================================================================
   1 · el recipiente en corte: casco, camisa de vapor, aislamiento y forro
   ==================================================================== */
const RN = 9.4, RB = 4.8;                                   // la boquilla del agitador en la corona y el paso de la de fondo
const STM = { th: 352, z: ZT - 15, r: 3.0 }, CND = { th: 296, r: 42, rr: 2.2 };      // entrada de vapor y salida de condensado
const BORE = A.tube([[0, 0, 0.6], [0, 0, ZI - 0.6]], RB);
const ell = (zc, rr, hh, a) => [zc + hh * Math.sin(a), rr * Math.cos(a)];
// el casco va en dos cuerpos (la virola de abajo con el fondo y la de arriba con la cabeza): uno solo, en la variante
// alta, sería tan esbelto que el audit lo tomaría por una varilla
const ZS = Math.round(Z1 * 0.5);
const SHELL_LO = record(A.body(DF, [[-AG.BT, 0], [-AG.BT, RO], [ZS, RO], [ZS, R], [0, R], [0, 0]], { name: "shell.lo", cut: [FRONT, BORE] }));
const shellM = [[ZS, R], [ZS, RO]];
for (let i = 0; i <= 16; i++) shellM.push(ell(Z1, RO, HO, (Math.PI / 2) * (i / 16)));
// en la forma del audit la cabeza va gruesa por dentro (10 en la corona): los asientos de las boquillas grandes, en la
// pendiente de la cabeza, no asoman al interior. El dibujo usa la cabeza real.
for (let i = 16; i >= 0; i--) shellM.push(ell(Z1, R, HD - 10, (Math.PI / 2) * (i / 16)));
const SHELL = record(A.body(DF, shellM, { name: "shell", cut: [FRONT] }));
const JACKET = record(A.body(DF, [[ZB, 0], [ZB, RJO], [ZT, RJO], [ZT, RO], [ZT - 0.9, RO], [ZT - 0.9, RJI], [-(AG.BT + AG.JG), RJI], [-(AG.BT + AG.JG), 0]], { name: "jacket", cut: [FRONT, BORE] }));
const INSUL = record(A.body(DF, [[ZI, 0], [ZI, RIO], [ZT + 0.6, RIO], [ZT + 0.6, RO], [ZT, RO], [ZT, RJO], [ZB, RJO], [ZB, 0]], { name: "insul", cut: [FRONT, BORE] }));
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
const cavity = toned((o) => { o.by[4].push(pth1(halfDisc(R, 0).map((p) => C.pr(...p)))); o.fill.push(pth1(halfDisc(R, 0).map((p) => C.pr(...p)))); cylinder(R, -1, 0, Z1, 240, o); surface(headP(R, HD, Z1), headN(R, HD, -1), 48, 10, o); });
const dome = toned((o) => surface(headP(RO, HO, Z1), headN(RO, HO, 1), 72, 16, o));
// el hueco que se ve por el corte: el contorno interior en el plano
const secIn = [[-R, 0], [-R, Z1]];
for (let i = 0; i <= 40; i++) { const u = -R + (2 * R * i) / 40; secIn.push([u, Z1 + GEO.headDepth(Math.abs(u), R, HD)]); }
secIn.push([R, 0]);
const secInS = secIn.map(([u, z]) => C.pr(...W3(u, 0, z)));
// la cúpula de atrás por fuera: entre la silueta y el borde del corte
const silh = [];
for (let i = 0; i <= 48; i++) { const th = Math.PI + (Math.PI * i) / 48, a = Math.atan(-(HO / RO) * Math.sin(th) * Math.cos(EL * D2R) / Math.sin(EL * D2R)); silh.push(addv([0, 0, Z1 + HO * Math.sin(a)], rad(th), RO * Math.cos(a))); }
const crest = []; for (let i = 0; i <= 40; i++) { const u = RO - (2 * RO * i) / 40; crest.push(W3(u, 0, Z1 + GEO.headDepth(Math.abs(u), RO, HO))); }
const domeReg = [...silh, ...crest].map((p) => C.pr(...p));
// costuras de soldadura por dentro: la del fondo, la de la cabeza, la de entre virolas y una longitudinal atrás
const seamArc = (z, rr = R - 0.02) => { const pts = []; for (let i = 0; i <= 40; i++) pts.push(addv([0, 0, z], rad(Math.PI + (Math.PI * i) / 40), rr)); return path3(pts); };
const ZSEAM = Math.round(Z1 * 0.5);
const seams = seamArc(0.05) + seamArc(Z1) + seamArc(ZSEAM) + path3([polar(255, R - 0.02, 0.05), polar(255, R - 0.02, ZSEAM)]) + path3([polar(292, R - 0.02, ZSEAM), polar(292, R - 0.02, Z1)]);
// la tapa del forro, arriba del aislamiento (la media corona de atrás; el casco y la cúpula tapan lo que no se ve)
const capTop = [...halfDisc(RIO, ZT + 0.6), ...halfDisc(RO, ZT + 0.6).reverse()].map((p) => C.pr(...p));
const shellSvg = `<path class="ag-clad-top" d="${pth1(capTop)}"/>`
  + `<clipPath id="agCav${TAG}"><path d="${pth(secInS)}"/></clipPath><clipPath id="agDome${TAG}"><path d="${pth(domeReg)}"/></clipPath>`
  + `<g class="iso-solid ag-cav" clip-path="url(#agCav${TAG})">${cavity}${Ln(seams, { tone: "faint" })}</g>`
  + `<g class="iso-solid ag-dome" clip-path="url(#agDome${TAG})">${dome}</g>${Ln(path3(silh), { tone: "mid" })}`;
put("shell", [0, -R * 0.6, Z1 / 2], shellSvg, [SHELL_LO, SHELL, JACKET, INSUL]);
// el corte: casco, el vacío de la camisa, la camisa, el aislamiento con su rayado y el forro, en dos mitades
const CF = { o: [0, 0, 0], a: G.mul3(HV, -1), u: T, v: ZD3 };
[-1, 1].forEach((sd) => {
  const nm = sd < 0 ? "l" : "r", cut = (layer) => GEO.cutSide(layer, sd, Z1, RN, RB);
  fp(`cut.shell.${nm}`, CF, cut("shell"), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "ag-cut", owner: "shell" });
  fp(`cut.jacket.${nm}`, CF, cut("jacket"), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "ag-cut", owner: "shell", extra: `<path class="ag-void" d="${pth(cut("void").map(([u, z]) => C.pr(...W3(u, 0.02, z))))}"/>` });
  fp(`cut.insul.${nm}`, CF, cut("ins"), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "ag-cut-ins", owner: "shell", extra: `<g class="ag-hatch">${Ln(hatch(cut("ins"), 1.7), { tone: "lo" })}</g>` });
  fp(`cut.clad.${nm}`, CF, cut("clad"), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "ag-cut-clad", owner: "shell" });
});
// el paso de la boquilla de fondo: por el hueco se ve la mitad de atrás del agujero
fp("cut.bore", CF, [[-RB, ZI], [RB, ZI], [RB, 0], [-RB, 0]], 0, 0.5, { tone: "mid" }, { cap: "only", cls: "ag-bore", owner: "shell" });

/* ---------- patas: tubos soldados bajo el fondo, con su placa de asiento y la placa base con anclajes ---------- */
const ENDS = {}, WHL = {}, STD = {};
AG.legs.forEach((deg, i) => {
  const rl = RIO - 6.5, c = polar(deg, rl, 0);
  disc(`leg${i}.pad`, ZA_([c[0], c[1], ZI]), -1.0, 0, 5.4, { tone: "lo" }, { owner: "shell" });
  disc(`leg${i}`, ZA_([c[0], c[1], FLOOR + 1.4]), 0, ZI - 1.0 - FLOOR - 1.4, 3.6, { tone: "lo" }, { owner: `leg${i}.plate` });
  box(`leg${i}.plate`, [c[0] - 6, c[1] - 6, FLOOR], [c[0] + 6, c[1] + 6, FLOOR + 1.4], { tone: "lo" }, { r: 0.5, ground: true });
  [[-4.2, -4.2], [4.2, 4.2], [-4.2, 4.2], [4.2, -4.2]].forEach(([dx, dy], j) => disc(`leg${i}.nut${j}`, ZA_([c[0] + dx, c[1] + dy, FLOOR + 1.4]), 0, 0.9, 0.75, { tone: "mid" }, { owner: `leg${i}.plate` }));
  ENDS[`leg${i}`] = [c[0], c[1], FLOOR + 10];
});
/* ====================================================================
   2 · la cabeza: boquillas (todas en la mitad de atrás, salvo la del agitador en la corona)
   ==================================================================== */
const headZ = (r) => Z1 + GEO.headDepth(r, RO, HO);
// una boquilla vertical sobre la cabeza: asiento, cuello y brida con sus pernos; devuelve la cara de arriba
function headNozzle(name, deg, r, { a, neck, h, fr, ft = 1.4, bolts = 8 } = {}) {
  const c = polar(deg, r, 0), top = headZ(Math.max(0, r - a)) + 0.4;
  const seat = pad(`${name}.pad`, SHELL, [c[0], c[1], headZ(r)], ZD3, a, top - headZ(r), {}, { owner: "shell", from: -(top - headZ(r + a)) - 1 });
  const z0 = seat.face[2];
  disc(`${name}.neck`, ZA_([c[0], c[1], z0]), 0, h, neck, { tone: "mid" }, { owner: `${name}.pad` });
  disc(`${name}.flange`, ZA_([c[0], c[1], z0 + h]), 0, ft, fr, { tone: "mid" }, { owner: `${name}.neck`, extra: Dots(G.dotsOf(ZA_([c[0], c[1], z0 + h]), ft, (fr + neck) / 2 + 0.3, bolts, P), { size: 0.42 }) });
  return [c[0], c[1], z0 + h + ft];
}
// la del agitador, en la corona: el accionamiento va encima
const DN = headNozzle("noz.drive", 0, 0, { a: RN, neck: 8.6, h: 5, fr: 13.6, ft: 2.2, bolts: 12 });
// la boca de hombre con su tapa ciega, sus pernos y la manija
{
  const fz = headNozzle("noz.man", 215, 30, { a: 11, neck: 10.2, h: 3.5, fr: 13.4, ft: 1.6, bolts: 16 }), c = [fz[0], fz[1], fz[2]];
  disc("man.cover", ZA_(c), 0, 1.4, 13.4, { tone: "mid" }, { owner: "noz.man.flange", extra: Dots(G.dotsOf(ZA_(c), 1.4, 12.0, 16, P), { size: 0.5 }) });
  const e1 = G.unit3(rad(215 * D2R + Math.PI / 2)), hc = [c[0], c[1], c[2] + 1.4];
  [-1, 1].forEach((sg, i) => { const q = addv(hc, e1, sg * 4); disc(`man.post${i}`, ZA_(q), 0, 1.2, 1.0, { tone: "mid" }, { owner: "man.cover" }); });
  const h0 = addv([hc[0], hc[1], hc[2] + 1.2], e1, -4), h1 = addv([hc[0], hc[1], hc[2] + 1.2], e1, 4);
  pipe("man.handle", [h0, [h0[0], h0[1], h0[2] + 4.5], [h1[0], h1[1], h1[2] + 4.5], h1], 0.5, { bend: 4.4 });
  ENDS.man = [c[0], c[1], c[2] + 2];
}
// la mirilla con su vidrio y su anillo, y la lámpara al lado
function sightPort(name, deg, r, lamp) {
  const fz = headNozzle(name, deg, r, { a: 5.0, neck: 4.4, h: 3, fr: 6.6, ft: 1.2, bolts: 6 }), c = [fz[0], fz[1], fz[2]];
  disc(`${name}.glass`, ZA_(c), 0, 0.6, 4.3, { tone: "hi" }, { owner: `${name}.flange`, cls: "ag-glass" });
  ring(`${name}.clamp`, ZA_(c), 0.6, 1.6, 4.3, 6.6, { tone: "mid" }, { owner: `${name}.glass`, extra: Dots(G.dotsOf(ZA_(c), 1.6, 5.45, 6, P, { all: true }), { size: 0.4 }) });
  if (lamp) {
    const z = c[2] + 1.6;
    turned(`${name}.lamp`, ZA_([c[0], c[1], z]), [[0, 4.3], [3.5, 4.3], [6.5, 2.8], [8, 1.2]], { tone: "mid" }, { owner: `${name}.clamp` });
    disc(`${name}.gland`, ZA_([c[0], c[1], z]), 8, 9.4, 0.9, { tone: "mid" }, { owner: `${name}.lamp` });
  }
  return c;
}
sightPort("sight", 280, 35, false);
sightPort("lamp", 255, 37, true);
// la entrada de gas: cuello, brida, el tubo que sube y se va hacia atrás con su válvula
{
  const fz = headNozzle("noz.gas", 305, 36, { a: 3.4, neck: 2.7, h: 4, fr: 4.8, ft: 1.2, bolts: 4 }), dir = G.unit3(rad(305 * D2R));
  const up = [fz[0], fz[1], fz[2] + 7], out = addv(up, dir, 14), vb = addv(up, dir, 7.5);
  pipe("gas.line", [fz, up, out], 1.6, { flanges: [false, true], flangeR: 2.6, open: [false, true], balls: [{ name: "gas.valve", c: vb, R: 2.9 }] });
  disc("gas.stem", ZA_(vb), entry(2.9, 0.6), 5.4, 0.6, { tone: "mid" }, { owner: "gas.valve" });
  box("gas.lever", [vb[0] - 0.4, vb[1] - 0.4, vb[2] + 5.4], [vb[0] + 3.6 * dir[0] + 0.4, vb[1] + 3.6 * dir[1] + 0.4, vb[2] + 6.2], { tone: "hi" }, { r: 0.15, owner: "gas.stem" });
  ENDS.gas = out;
}
// la alimentación: cuello, brida y el tubo que sube con su manómetro
{
  const fz = headNozzle("noz.feed", 320, 22, { a: 4.2, neck: 3.4, h: 4, fr: 6.0, ft: 1.4, bolts: 6 });
  const top = [fz[0], fz[1], fz[2] + 9], back = addv(top, rad(320 * D2R), 16);
  pipe("feed.line", [fz, top, back], 2.4, { flanges: [false, true], flangeR: 2.4, open: [false, true] });
  ENDS.feed = back;
}
// el termopozo con la cabeza del transmisor
{
  const fz = headNozzle("noz.tw", 330, 40, { a: 3.0, neck: 2.3, h: 3.5, fr: 4.2, ft: 1.2, bolts: 4 }), c = [fz[0], fz[1], fz[2]];
  disc("tw.stem", ZA_(c), 0, 4, 0.9, { tone: "mid" }, { owner: "noz.tw.flange" });
  turned("tw.head", ZA_([c[0], c[1], c[2] + 4]), [[0, 2.2], [3.2, 2.2], [3.8, 1.6]], { tone: "mid" }, { owner: "tw.stem" });
  ENDS.tw = [c[0], c[1], c[2] + 6];
}

/* ====================================================================
   3 · el accionamiento: sello, linterna con el acople, reductor de ángulo recto y motor
   ==================================================================== */
const ZF = DN[2], AXF = ZA_([0, 0, ZF]);
disc("drv.base", AXF, 0, 1.6, 13.6, { tone: "mid" }, { owner: "noz.drive.flange", extra: Dots(G.dotsOf(AXF, 1.6, 11.6, 12, P), { size: 0.45 }) });
disc("seal.body", AXF, 1.6, 6.4, 5.6, { tone: "mid" }, { owner: "drv.base" });
disc("seal.gland", AXF, 6.4, 7.4, 7.2, { tone: "mid" }, { owner: "seal.body", extra: Dots(G.dotsOf(AXF, 7.4, 6.4, 4, P), { size: 0.45 }) });
{ // la toma de lavado del sello, hacia el lector
  const sd = G.unit3(rad(300 * D2R)), p0 = addv([0, 0, ZF + 4], sd, 5.6);
  disc("seal.flush", G.frameAlong(addv([0, 0, ZF + 4], sd, 5.5), sd), 0, 3.4, 0.8, { tone: "mid" }, { owner: "seal.body" });
}
disc("shaft.drv", AXF, 7.4, 9.6, 1.8, { tone: "hi" }, { owner: "seal.gland" });
disc("shaft.top", AXF, 15.4, 17.6, 1.8, { tone: "hi" }, { owner: "lan.top" });
// el acople: dos mazas con sus pernos
disc("cpl.lo", AXF, 9.6, 12.2, 4.4, { tone: "mid" }, { owner: "shaft.drv", extra: Dots(G.dotsOf(AXF, 12.2, 3.3, 6, P), { size: 0.4 }) });
disc("cpl.spider", AXF, 12.2, 12.8, 3.6, { tone: "lo" }, { owner: "cpl.lo" });
disc("cpl.hi", AXF, 12.8, 15.4, 4.4, { tone: "mid" }, { owner: "shaft.top", extra: Dots(G.dotsOf(AXF, 12.8, 3.3, 6, P, { all: false }), { size: 0.4 }) });
// la linterna: cuatro barras entre la base y la brida de arriba
[45, 135, 225, 315].forEach((deg, i) => { const q = polar(deg + 10, 10.6, ZF + 1.6); disc(`lan.bar${i}`, ZA_(q), 0, 16, 1.3, { tone: "mid" }, { owner: "drv.base" }); });
disc("lan.top", AXF, 17.6, 19.2, 12.6, { tone: "mid" }, { owner: "lan.bar0" });
// el reductor: caja de acero fundido con la salida abajo y la entrada de lado; tapa, respiradero y placa
const ZG = ZF + 19.2, GX = 10.5, GY0 = -13, GY1 = 10.5, GH = 15.5;
disc("gb.out", AXF, 19.2, 20.6, 9.2, { tone: "mid" }, { owner: "lan.top", extra: Dots(G.dotsOf(AXF, 20.6, 8.2, 8, P), { size: 0.4 }) });
box("gb.body", [-GX, GY0, ZG + 1.4], [GX, GY1, ZG + 1.4 + GH], { tone: "mid" }, { r: 2.2, bevel: 0.6, owner: "gb.out", cls: "ag-cast" });
box("gb.cover", [-GX + 1.6, GY0 + 1.6, ZG + 1.4 + GH], [GX - 1.6, GY1 - 1.6, ZG + 2.6 + GH], { tone: "mid" }, { r: 1.4, owner: "gb.body", cls: "ag-cast",
  extra: Dots([[-GX + 3, GY0 + 3], [GX - 3, GY0 + 3], [GX - 3, GY1 - 3], [-GX + 3, GY1 - 3]].map(([x, y]) => at([x, y, ZG + 2.6 + GH])), { size: 0.5 }) });
disc("gb.breather", ZA_([4, 2, ZG + 2.6 + GH]), 0, 1.6, 1.0, { tone: "mid" }, { owner: "gb.cover" });
box("gb.plate", [GX, GY0 + 6, ZG + 5], [GX + 0.3, GY1 - 6, ZG + 11], { tone: "hi" }, { r: 0.1, owner: "gb.body",
  extra: (() => { const rows = [0, 1, 2].map((i) => [[GX + 0.3, GY0 + 7.2, ZG + 9.6 - 1.5 * i], [GX + 0.3, GY1 - 7.2 - (i === 2 ? 4 : 0), ZG + 9.6 - 1.5 * i]]);
    return Ln(rows.map((r) => path3(r)).join(""), { tone: "lo" }) + Dots(rows.flat().map(at), { size: 0.22 }); })() });
// el motor, horizontal hacia −y: brida, carcasa con aletas, tapa del ventilador con su rejilla y caja de bornes
const ZM = ZG + 1.4 + 8.6, MF = G.frameOf([0, GY0, ZM], [0, -1, 0], [1, 0, 0], [0, 0, 1]);
disc("mot.flange", MF, 0, 1.4, 10.0, { tone: "mid" }, { owner: "gb.body", extra: Dots(G.dotsOf(MF, 1.4, 9.0, 8, P), { size: 0.42 }) });
const finTex = (() => { // las aletas: generatrices del lado que se ve, de la brida a la tapa
  const out = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2, q0 = G.pointOf(MF, 1.4, 8.6, a), n = G.unit3(G.sub3(q0, G.pointOf(MF, 1.4, 0, a))); if (G.dot3(n, C.V) < 0.08) continue; out.push(path3([q0, G.pointOf(MF, 25.4, 8.6, a)])); }
  return out.join("");
})();
disc("mot.frame", MF, 1.4, 25.4, 8.6, { tone: "mid" }, { owner: "mot.flange", extra: Ln(finTex, { tone: "lo" }) });
disc("mot.fan", MF, 25.4, 31.4, 8.9, { tone: "mid" }, { owner: "mot.frame", extra: Dots([...G.dotsOf(MF, 31.4, 6.6, 14, P, { all: true }), ...G.dotsOf(MF, 31.4, 4.2, 9, P, { all: true }), ...G.dotsOf(MF, 31.4, 1.8, 5, P, { all: true })], { size: 0.5 }) });
box("mot.tbox", [-3.4, GY0 - 15, ZM + 8.3], [3.4, GY0 - 7, ZM + 13.3], { tone: "mid" }, { r: 0.6, owner: "mot.frame" });
disc("mot.gland", G.frameAlong([3.4, GY0 - 11, ZM + 10.8], [1, 0, 0]), 0, 1.8, 1.0, { tone: "mid" }, { owner: "mot.tbox" });
box("mot.plate", [8.4, GY0 - 18, ZM - 2], [8.75, GY0 - 10, ZM + 2.6], { tone: "hi" }, { r: 0.1, owner: "mot.frame" });
ENDS.motor = [0, GY0 - 31.4, ZM + 4];
ENDS.gear = [GX, 0, ZG + 9];

/* ====================================================================
   4 · abajo: la válvula de fondo y la salida; afuera: el vapor y el condensado de la camisa
   ==================================================================== */
{
  const z0 = ZI;
  disc("bot.neck", ZA_([0, 0, z0]), -6, 0, RB + 1.4, { tone: "mid" }, { owner: "shell" });
  disc("bot.flange", ZA_([0, 0, z0 - 6]), -1.6, 0, 8.2, { tone: "mid" }, { owner: "bot.neck", extra: Dots(G.dotsOf(ZA_([0, 0, z0 - 7.6]), 0, 6.6, 8, P, { all: false }), { size: 0.42 }) });
  const vc = [0, 0, z0 - 14], dir = G.unit3(rad(332 * D2R)), out1 = addv([vc[0], vc[1], vc[2]], dir, 22), out2 = addv([out1[0], out1[1], FLOOR + 12], dir, 16);
  ball("bot.valve", vc, 6.0, { tone: "mid" });
  pipe("bot.up", [[0, 0, z0 - 7.6], [0, 0, vc[2]]], 3.6, { balls: [{ name: "bot.valve", c: vc, R: 6.0, at: "end", shared: true }] });
  pipe("bot.out", [vc, out1, [out1[0], out1[1], FLOOR + 12], out2], 3.0, { flanges: [false, true], flangeR: 2.2, open: [false, true], balls: [{ name: "bot.valve", c: vc, R: 6.0, at: "start", shared: true }] });
  ENDS.valve = vc;
  const sd = G.unit3(rad(250 * D2R));
  WHL.bot = wheel("bot.hw", vc, sd, 6.0);
}
// el vapor: asiento en la camisa, cuello por el aislamiento, brida, codo hacia arriba, válvula de globo y manómetro
{
  const dr = rad(STM.th * D2R), base = polar(STM.th, RJO, STM.z);
  const seat = pad("stm.pad", INSUL, polar(STM.th, RIO, STM.z), dr, STM.r + 0.6, 1.4, {}, { owner: "shell", from: -1.5 });
  disc("stm.neck", G.frameAlong(seat.face, dr), 0, 3.5, STM.r, { tone: "mid" }, { owner: "stm.pad" });
  const f0 = addv(seat.face, dr, 3.5), p1 = addv(f0, dr, 8), p2 = [p1[0], p1[1], ZT + 26], gv = [p1[0], p1[1], ZT + 10];
  disc("stm.flange", G.frameAlong(f0, dr), 0, 1.4, STM.r + 2.6, { tone: "mid" }, { owner: "stm.neck", extra: Dots(G.dotsOf(G.frameAlong(f0, dr), 1.4, STM.r + 1.5, 6, P), { size: 0.42 }) });
  const tp0 = [p1[0], p1[1], ZT + 3.4], tn0 = G.unit3(G.cross3(ZD3, dr)), ts0 = G.dot3(tn0, HV) > 0 ? tn0 : G.mul3(tn0, -1);
  pipe("stm.line", [addv(f0, dr, 1.4), p1, p2], 2.4, { flanges: [false, true], flangeR: 2.3, open: [false, true], balls: [{ name: "stm.valve", c: gv, R: 4.0 }, { name: "stm.tee", c: tp0, R: 3.8, bores: [{ owner: "stm.gstem", dir: ts0, r: 0.7 }] }] });
  disc("stm.gstem", G.frameAlong(tp0, ts0), entry(3.8, 0.7), 3.8 + 3.0, 0.7, { tone: "mid" }, { owner: "stm.tee" });
  WHL.stm = wheel("stm.hw", gv, G.unit3(G.add3(dr, G.mul3(T, 0.0))), 4.0);
  // el manómetro del vapor, en una toma antes de la válvula
  const tp = [p1[0], p1[1], ZT + 3.4], tn = G.unit3(G.cross3(ZD3, dr)), tside = G.dot3(tn, HV) > 0 ? tn : G.mul3(tn, -1);
  STD.tee = { c: tp, side: tside };
  STD.d = dial("psteam", G.add3(addv(tp, tside, 3.8 + 3.0), G.add3([0, 0, 4.2 + 0.3], G.mul3(facing(tside, 0.1), 0.6))), facing(tside, 0.1), 4.2, { live: "psteam", owner: "stm.gstem", red: 0.18 });
  ENDS.steam = p2;
}
// el condensado: sale por abajo de la camisa del fondo, baja y sale de lado por la trampa
{
  const c = polar(CND.th, CND.r, ZB), dr = rad(CND.th * D2R);
  disc("cnd.neck", ZA_([c[0], c[1], ZI]), -5, 0, CND.rr, { tone: "mid" }, { owner: "shell" });
  const f0 = [c[0], c[1], ZI - 5];
  disc("cnd.flange", ZA_(f0), -1.2, 0, CND.rr + 2.2, { tone: "mid" }, { owner: "cnd.neck" });
  const p1 = [c[0], c[1], ZI - 22], p2 = addv(p1, dr, 34), tr = addv(p1, dr, 17);
  pipe("cnd.line", [[c[0], c[1], ZI - 6.2], p1, p2], 1.8, { flanges: [false, true], flangeR: 2.4, open: [false, true], balls: [{ name: "cnd.trap", c: tr, R: 4.2 }] });
  disc("cnd.cap", ZA_(tr), -(4.2 + 2.2), -entry(4.2, 2.6), 2.6, { tone: "mid" }, { owner: "cnd.trap" });
  ENDS.cond = tr;
}

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
R_.items.forEach((it) => { if (it.live) it.svg = `<g data-live="${it.name}"></g>`; });
const after = (name, html) => { const it = R_.items.find((q) => q.name === name); if (!it) throw new Error("no está " + name); it.svg += html; };
after("psteam.bezel", STD.d.html); after("bot.hw.wheel", Ln(WHL.bot, { tone: "hi" })); after("stm.hw.wheel", Ln(WHL.stm, { tone: "hi" }));
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
const label = "Reactor agitado enchaquetado en isométrico, abierto por el plano del eje: el casco por dentro, la camisa de vapor, el aislamiento, la cabeza superior con sus boquillas, el accionamiento y las patas";
const svg = k.figureSvg({ width: W, height: H, label, body: [`<g class="ag-items">${groups.join("")}</g>`] }).replace("<svg ", `<svg id="agSvg${TAG}" `);
const DATA = { P, W, H, sc: G.scaleOf(P), tag: TAG, Z1, AZ, EL, T, HV, RIO, ends: ENDS, shaftTop: ZC - RN * Math.tan(EL * D2R), shaftR: 1.8, gasTh: 305 * D2R, gasR: 36, gasZ: Z1 + GEO.headDepth(36, R, HD) };
writeFileSync(join(HERE, "out", `agitador-${TAG}.svg`), svg);
writeFileSync(join(HERE, "out", `agitador-${TAG}.json`), JSON.stringify(DATA));
writeJs();
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Reactor agitado", theme: "light", width: 900, body: `<style>${readFileSync(join(HERE, "ag.css"), "utf8")}</style><div class="iso-stage" id="agFig">${svg}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") }));
console.log("agitador", TAG, "items", R_.items.length, "scale", G.scaleOf(P).toFixed(3), "svg", svg.length);
if (!FAST) A.auditOrExit(R_, P, {});
