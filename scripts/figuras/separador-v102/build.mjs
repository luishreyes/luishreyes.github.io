/* ====================================================================
   El separador de alta V-102 de la planta de benceno en isométrico
   (skill anatomy), para la edición impresa del libro (capítulo 2).
   Recipiente vertical de 1,2 m de diámetro interior y 3,4 m entre
   tangentes, cabezas elípticas 2:1, sobre un faldón. Va abierto por el
   plano vertical de su eje que mira al lector, con el faldón y su anillo
   de base: se ven la placa desviadora de la entrada, la malla sobre su
   anillo, el líquido al nivel normal (0,35 de la altura del cuerpo), el
   rompe-vórtice de la salida de líquido, el termopozo y las horquillas
   del interruptor de muy alto nivel.
   Afuera: la entrada de 8″, la salida de gas de 8″, la válvula de
   seguridad con su válvula de bloqueo, el transmisor de presión, el
   puente de nivel con el visor de vidrio y el transmisor de nivel, el
   interruptor de muy alto nivel, el termómetro, la salida de líquido
   de 3″ y el drenaje de 2″.
   Figura quieta: no tiene nada vivo. Unidades: 1 = 1 cm. z hacia arriba.
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

const SV = GEO.SV, AZ = SV.AZ, EL = SV.EL, W = 700, H = 1180;
const { T, HV } = GEO.axesOf(AZ);
const DR = SV.DR, D2R = Math.PI / 180;
const R = DR.R, TW = DR.TW, Z0 = DR.z0, Z1 = DR.z1, HD = DR.hd, RO = R + TW, HO = HD + TW;
const FD = SV.SK.found, ZB = FD + SV.SK.base; // la fundación y el anillo de base
const XD = [1, 0, 0], ZD3 = [0, 0, 1];
const addv = (p, d, kk) => [p[0] + d[0] * kk, p[1] + d[1] * kk, p[2] + (d[2] || 0) * kk];
const rad = (th) => [Math.cos(th) * T[0] + Math.sin(th) * HV[0], Math.cos(th) * T[1] + Math.sin(th) * HV[1], 0];
const radD = (deg) => rad(deg * D2R);
const UV = (u, v, z) => [u * T[0] + v * HV[0], u * T[1] + v * HV[1], z];
const topOut = (r) => Z1 + GEO.headDepth(r, RO, HO), botOut = (r) => Z0 - GEO.headDepth(r, RO, HO);
const topIn = (r) => Z1 + GEO.headDepth(r, R, HD), botIn = (r) => Z0 - GEO.headDepth(r, R, HD);

/* ---------- lo que tiene que caber ---------- */
const EXT = [];
for (let i = 0; i < 24; i++) { const a = (i / 24) * 2 * Math.PI; EXT.push([80 * Math.cos(a), 80 * Math.sin(a), 0]); }
EXT.push(addv([0, 0, SV.IN.z + 20], radD(SV.IN.th), RO + SV.IN.neck + SV.IN.spool + 4), addv([0, 0, SV.IN.z - 20], radD(SV.IN.th), RO + SV.IN.neck + SV.IN.spool + 4));
EXT.push(addv(UV(SV.GAS.u, SV.GAS.v, topOut(22) + SV.GAS.up + 22), radD(SV.GAS.th), SV.GAS.run + 8));
EXT.push(UV(SV.PSV.u - 40, SV.PSV.v, topOut(40) + 80), UV(SV.PSV.u, SV.PSV.v, topOut(40) + 92));
EXT.push(addv([0, 0, SV.BR.z1 + 40], radD(SV.BR.th), SV.BR.rad + 8), addv([0, 0, SV.BR.z0 - 20], radD(SV.BR.th), SV.BR.rad));
EXT.push(addv(addv([0, 0, 300], radD(SV.BR.th), SV.BR.rad), T, SV.LG.off + 6));
EXT.push(addv(UV(0, SV.OUT.v, 46), radD(SV.OUT.th), SV.OUT.run + 6));
const P = k.fitProjection(EXT, W, H, { pad: 16, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const f1 = (v) => (Math.round(v * 100) / 100).toString();
const pth = (pts, closed = true) => pts.map(([x, y], i) => (i ? "L" : "M") + f1(x) + " " + f1(y)).join("") + (closed ? "Z" : "");

/* ---------- los ayudantes (los mismos del sistema flash) ---------- */
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
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}) }));
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
const ZA = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const CUT = (o) => G.frameOf(o, [0, 0, 1], T, HV); // u a lo largo del plano de corte, v hacia el lector
function tubeItems(name, route, r, { tone = "mid", maxLength = 14, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true] } = {}) {
  R_.route(name, route, r, { owner: name, gaps, ends, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(0.6, Math.min(2.2, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: cls ? `<g class="${cls}">${svg}</g>` : svg, move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] });
  });
}
function ball(name, c, Rb, style = {}, { owner, cls = "", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(Rb + 0.6))), G.add3(c, G.mul3(b.dir, Rb + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, Rb, { name, owner, ...(cut.length ? { cut } : {}) }));
  const body = S(G.sphereOf(c, Rb, P), { tone: "mid", ...style });
  put(name, c, cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
const entry = (Rb, r) => Math.sqrt(Math.max(0, Rb * Rb - r * r)) - 0.02;
function pipe(name, control, r, { bend = 3, tone = "mid", flanges = [false, false], flangeR = 1.7, flangeT = 0, cls = "", maxLength = 14, balls = [], collars = [], open = [false, false], breaks = [], bolts = 6 } = {}) {
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
    const thick = flangeT || Math.max(1.0, r * 0.38), tangent = G.tangentAlong(line, along);
    const centre = G.add3(G.pointAlong(line, along), G.mul3(tangent, (-sign * thick) / 2));
    gaps.push(sign < 0 ? [0, thick] : [total - thick, total]);
    disc(`${name}.flange${index}`, G.frameAlong(centre, tangent), -thick / 2, thick / 2, r * flangeR, { tone: "mid" }, { owner: name, cls, extra: Dots(G.dotsOf(G.frameAlong(centre, tangent), thick / 2 * sign, r * (flangeR + 1) / 2, bolts, P, { all: false, least: 0.05 }), { size: 0.4 }) });
  });
  const nearest = (c) => { let best = 0, bd = 1e9; for (let q = 0; q <= total; q += 0.05) { const d = G.len3(G.sub3(G.pointAlong(line, q), c)); if (d < bd) { bd = d; best = q; } } return best; };
  for (const b of balls) {
    let dir = null;
    if (b.at !== "start" && b.at !== "end") { const q = nearest(b.c), dd = entry(b.R, r); gaps.push([Math.max(0, q - dd), Math.min(total, q + dd)]); dir = G.tangentAlong(line, q); }
    const mine = dir ? [{ owner: name, dir, r }] : [];
    if (!b.shared) ball(b.name, b.c, b.R, b.style || {}, { bores: [...mine, ...(b.bores || [])], cls: b.cls || "" });
  }
  for (const c of collars) { const q = nearest(c.c); gaps.push([q - c.half, q + c.half]); }
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), cls, maxLength, breaks, ends: [!open[0], !open[1]] });
  return line;
}
function mergeGaps(gs) { const s = gs.filter((g) => g[1] > g[0]).sort((a, b) => a[0] - b[0]), out = []; for (const g of s) { const l = out[out.length - 1]; if (l && g[0] <= l[1]) l[1] = Math.max(l[1], g[1]); else out.push([...g]); } return out; }
const half = (r0, r1, n = 36) => GEO.halfRing(r0, r1, n);
function pad(name, hosts, point, outward, a, h, style = {}, { owner, cls = "", extra = "", from = null } = {}) {
  const hs = [hosts].flat(), inside = (p) => hs.some((shape) => A.sdf(shape, p) < 0);
  const axis = G.unit3(outward), F = G.frameAlong(point, axis);
  const start = (angle) => { let lo = from ?? -2.5 * a, hi = h; if (!inside(G.pointOf(F, lo, a, angle))) return 0; for (let k2 = 0; k2 < 40; k2++) { const mid = (lo + hi) / 2; if (inside(G.pointOf(F, mid, a, angle))) lo = mid; else hi = mid; } return hi; };
  const low = Math.min(...Array.from({ length: 48 }, (_, i) => start((i / 48) * Math.PI * 2)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, G.add3(point, G.mul3(axis, h / 2)), cls ? `<g class="${cls}">${body}</g>` : body, [record(A.disc(F, low - 0.05, h, a, { name, owner, seated: true, cut: hs }))]);
  return { F, face: G.add3(point, G.mul3(axis, h)) };
}
function planeM(c, e1, e2) {
  const o = at(c), a = at(G.add3(c, e1)), b = at(G.add3(c, e2));
  return `matrix(${(a[0] - o[0]).toFixed(4)} ${(a[1] - o[1]).toFixed(4)} ${(b[0] - o[0]).toFixed(4)} ${(b[1] - o[1]).toFixed(4)} ${o[0].toFixed(3)} ${o[1].toFixed(3)})`;
}
function faceBasis(n) { const e1 = G.unit3(G.cross3(ZD3, n)); return { e1, e2: G.unit3(G.cross3(n, e1)) }; }
// un termómetro de esfera: caja, bisel, escala y aguja (quieta, en el valor de operación)
function dial(name, c, n, r, { ticks = 9, owner, value = 0.45 } = {}) {
  const F = G.frameAlong(c, n);
  disc(`${name}.case`, F, -1.6, 0, r, { tone: "mid" }, { owner });
  ring(`${name}.bezel`, F, 0, 0.35, r - 0.55, r, { tone: "hi" }, { owner: `${name}.case` });
  const { e1, e2 } = faceBasis(n), face = G.add3(c, G.mul3(n, 0.36)), M = planeM(face, e1, e2);
  let tk = "";
  for (let i = 0; i < ticks; i++) { const t = (225 - (270 * i) / (ticks - 1)) * D2R, r0 = r - 1.45, r1 = r - (i % 2 ? 1.05 : 0.8); tk += `M${(r0 * Math.cos(t)).toFixed(2)} ${(r0 * Math.sin(t)).toFixed(2)}L${(r1 * Math.cos(t)).toFixed(2)} ${(r1 * Math.sin(t)).toFixed(2)}`; }
  const ang = (225 - 270 * value) * D2R, nx = (r - 1.6) * Math.cos(ang), ny = (r - 1.6) * Math.sin(ang);
  return `<g class="sv-dial" transform="${M}"><path class="sv-tick" d="${tk}"/><path class="sv-needle" d="M${(-0.9 * Math.cos(ang)).toFixed(2)} ${(-0.9 * Math.sin(ang)).toFixed(2)}L${nx.toFixed(2)} ${ny.toFixed(2)}"/><circle class="sv-hub" r="0.55"/></g>`;
}
// el volante de una válvula de mano: bonete desde la superficie del cuerpo y rueda de alma llena con sus radios
function wheel(name, c, up, Rb, { wr = 4.2, br = 1.0, len = 2.8 } = {}) {
  const top = G.add3(c, G.mul3(up, Rb + len));
  disc(`${name}.bonnet`, G.frameAlong(c, up), entry(Rb, br), Rb + len, br, { tone: "mid" }, { owner: `${name}.body` });
  const HW = G.frameAlong(top, up);
  ring(`${name}.wheel`, HW, 0, 0.6, wr * 0.19, wr, { tone: "hi" }, { owner: `${name}.bonnet` });
  return [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; return path3([G.pointOf(HW, 0.6, wr * 0.24, a), G.pointOf(HW, 0.6, wr * 0.82, a)]); }).join("") + G.arcOf(HW, 0.6, wr * 0.85, P, { least: -1 });
}
const ANCLAS = {};
const after = new Map(); // dibujos que van justo después de un ítem (se resuelven al final, por nombre)
const later = (name, html) => after.set(name, (after.get(name) || "") + html);

/* ====================================================================
   1 · el recipiente en corte: cuerpo, cabezas, interior y pared cortada
   ==================================================================== */
const DF = ZA([0, 0, 0]);
const ell = (zc, rr, hh, a) => [zc + hh * Math.sin(a), rr * Math.cos(a)];
const merid = [];
for (let i = 0; i <= 16; i++) merid.push(ell(Z0, RO, HO, -Math.PI / 2 + (Math.PI / 2) * (i / 16)));
for (let i = 0; i <= 16; i++) merid.push(ell(Z1, RO, HO, (Math.PI / 2) * (i / 16)));
for (let i = 16; i >= 0; i--) merid.push(ell(Z1, R, HD, (Math.PI / 2) * (i / 16)));
for (let i = 0; i <= 16; i++) merid.push(ell(Z0, R, HD, -(Math.PI / 2) * (i / 16)));
const FRONT = A.orientedBox([HV[0] * 600, HV[1] * 600, 300], [T, HV, ZD3], [600, 600, 600]);
const SHELL = record(A.body(DF, merid, { name: "drum.shell", cut: [FRONT] }));
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + (Math.round(x * 10) / 10) + " " + (Math.round(y * 10) / 10)).join("") + "Z";
function cylinder(rr, sg, nt, za, zb, out) {
  let run = null;
  // cada tramo del mismo tono es un solo polígono, pero sus bordes de arriba y de abajo siguen el arco (no la cuerda)
  const flush = (t1) => {
    if (run && run.band >= 0) {
      const P3 = (t, z) => addv([0, 0, z], rad(t), rr), m = Math.max(1, Math.ceil((t1 - run.t0) / (Math.PI / 96))), ts = Array.from({ length: m + 1 }, (_, j) => run.t0 + ((t1 - run.t0) * j) / m);
      const d = pth1([...ts.map((t) => P3(t, za)), ...ts.reverse().map((t) => P3(t, zb))].map((p) => C.pr(...p)));
      out.by[run.band].push(d); out.fill.push(d);
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
const headP = (rr, hh, zc, up) => (t, u) => { const a = (Math.PI / 2) * u; return addv([0, 0, zc + up * hh * Math.sin(a)], rad(t), rr * Math.cos(a)); };
const headN = (rr, hh, up, sg) => (t, u) => { const a = (Math.PI / 2) * u, r3 = rad(t); return G.mul3(G.unit3([r3[0] * Math.cos(a) / rr, r3[1] * Math.cos(a) / rr, (up * Math.sin(a)) / hh]), sg); };
const cavity = toned((o) => { cylinder(R, -1, 240, Z0, Z1, o); surface(headP(R, HD, Z0, -1), headN(R, HD, -1, -1), 160, 40, o); surface(headP(R, HD, Z1, 1), headN(R, HD, 1, -1), 48, 10, o); });
const dome = toned((o) => surface(headP(RO, HO, Z1, 1), headN(RO, HO, 1, 1), 72, 16, o));
const secIn = [...GEO.drumSide(-1, true), ...GEO.drumSide(1, true).reverse()].map(([u, z]) => C.pr(T[0] * u, T[1] * u, z));
const silh = [];
for (let i = 0; i <= 48; i++) { const th = Math.PI + (Math.PI * i) / 48, a = Math.atan(-(HO / RO) * Math.sin(th) * Math.cos(EL * D2R) / Math.sin(EL * D2R)); silh.push(addv([0, 0, Z1 + HO * Math.sin(a)], rad(th), RO * Math.cos(a))); }
const crest = []; for (let i = 0; i <= 36; i++) { const u = RO - (2 * RO * i) / 36; crest.push([T[0] * u, T[1] * u, topOut(Math.abs(u))]); }
const domeReg = [...silh, ...crest].map((p) => C.pr(...p));
// costuras de soldadura por dentro: las de las cabezas, una circunferencial al medio y las longitudinales de atrás
const seamArc = (z) => { const pts = []; for (let i = 0; i <= 48; i++) pts.push(addv([0, 0, z], rad(Math.PI + (Math.PI * i) / 48), R - 0.02)); return path3(pts); };
const ZM = Z0 + 180;
const seams = seamArc(Z0) + seamArc(Z1) + seamArc(ZM) + path3([addv([0, 0, Z0], rad(1.42 * Math.PI), R - 0.02), addv([0, 0, ZM], rad(1.42 * Math.PI), R - 0.02)]) + path3([addv([0, 0, ZM], rad(1.62 * Math.PI), R - 0.02), addv([0, 0, Z1], rad(1.62 * Math.PI), R - 0.02)]);
const shellSvg = `<clipPath id="svCavClip"><path d="${pth(secIn)}"/></clipPath><clipPath id="svDomeClip"><path d="${pth(domeReg)}"/></clipPath>`
  + `<g class="iso-solid sv-cav" clip-path="url(#svCavClip)">${cavity}${Ln(seams, { tone: "faint" })}</g>`
  + `<g class="iso-solid" clip-path="url(#svDomeClip)">${dome}</g>${Ln(path3(silh), { tone: "mid" })}`;
put("drum.shell", [0, -R * 0.6, (Z0 + Z1) / 2], shellSvg, [SHELL]);
const CF = { o: [0, 0, 0], a: G.mul3(HV, -1), u: T, v: ZD3 };
// la pared cortada; las líneas de tangencia, en el corte
const tl = (side) => Ln(path3([[T[0] * side * R, T[1] * side * R, Z0], [T[0] * side * RO, T[1] * side * RO, Z0]]) + path3([[T[0] * side * R, T[1] * side * R, Z1], [T[0] * side * RO, T[1] * side * RO, Z1]]), { tone: "lo" });
fp("drum.cut.l", CF, GEO.wallCut(-1), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "sv-cutface", owner: "drum.shell", extra: tl(-1) });
fp("drum.cut.r", CF, GEO.wallCut(1), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "sv-cutface", owner: "drum.shell", extra: tl(1) });
Object.assign(ANCLAS, { SHELL: UV(R + 1, 0, Z0 + 150), HEAD_TOP: UV(RO * 0.82, 0, topOut(RO * 0.82)), HEAD_BOT: UV(-(R + 1), 0, botOut(R + 1) + 0.6) });

/* ---------- 1.1 · el faldón, su anillo de base, los pernos y la fundación ---------- */
disc("stand.found", ZA([0, 0, 0]), 0, FD, 78, { tone: "lo" }, { cls: "sv-concrete" });
const RI = SV.SK.ring[0], RE = SV.SK.ring[1];
fp("stand.base", CUT([0, 0, 0]), half(RI, RE, 48), FD, ZB, { tone: "mid" });
const sk = half(R, RO, 64), nS = 64;
fp("stand.skirt", CUT([0, 0, 0]), sk, ZB, Z0, { tone: "mid" }, { skip: new Set([nS, 2 * nS + 1]), owner: "drum.shell", cls: "sv-cav" });
fp("stand.skirt.cl", CF, [[-RO, ZB], [-R, ZB], [-R, Z0], [-RO, Z0]], 0, 0.5, { tone: "mid" }, { cap: "only", cls: "sv-cutface", owner: "stand.skirt" });
fp("stand.skirt.cr", CF, [[R, ZB], [RO, ZB], [RO, Z0], [R, Z0]], 0, 0.5, { tone: "mid" }, { cap: "only", cls: "sv-cutface", owner: "stand.skirt" });
// pernos de anclaje con tuerca y arandela, en la mitad que queda
[202.5, 247.5, 292.5, 337.5].forEach((deg, i) => {
  const c = addv([0, 0, ZB], radD(deg), (RO + RE) / 2);
  disc(`stand.washer${i}`, ZA(c), 0, 0.5, 3.0, { tone: "mid" }, { owner: "stand.base" });
  turned(`stand.nut${i}`, ZA(addv(c, ZD3, 0.5)), [[0, 2.4], [2.2, 2.4], [2.6, 1.9]], { tone: "mid" }, { owner: `stand.washer${i}` });
  disc(`stand.bolt${i}`, ZA(addv(c, ZD3, 3.1)), 0, 2.4, 1.2, { tone: "mid" }, { owner: `stand.nut${i}` });
});
ANCLAS.SKIRT = UV(-(R + 1), 0, (ZB + Z0) / 2 - 8);

/* ---------- 1.2 · adentro: entrada con placa desviadora, malla, rompe-vórtice, termopozo y horquilla ---------- */
const IN = SV.IN, dIn = radD(IN.th), eIn = G.unit3(G.cross3(ZD3, dIn));
const inPad = pad("int.in.pad", SHELL, addv([0, 0, IN.z], dIn, R), G.mul3(dIn, -1), IN.r + 1.0, 1.6, {}, { owner: "drum.shell", from: -0.5 });
pipe("int.in.pipe", [inPad.face, addv([0, 0, IN.z], dIn, R - 9)], IN.r, { open: [false, true] });
const PL = IN.plate, FPL = { o: [0, 0, IN.z], a: dIn, u: eIn, v: ZD3 };
fp("int.plate", FPL, [[-PL.half, -PL.half], [PL.half, -PL.half], [PL.half, PL.half], [-PL.half, PL.half]], PL.s - PL.t, PL.s, { tone: "mid" }, { owner: "drum.shell" });
[[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([su, sz], i) => {
  const uc = su * (PL.half - 2.5), z0 = sz * (PL.half - 0.4) - 0.4, wall = Math.sqrt(R * R - (Math.abs(uc) + 1.6) ** 2) + 0.25;
  fp(`int.strap${i}`, FPL, [[uc - 1.6, z0], [uc + 1.6, z0], [uc + 1.6, z0 + 0.8], [uc - 1.6, z0 + 0.8]], PL.s, wall, { tone: "mid" }, { owner: "drum.shell" });
});
ANCLAS.DIVERTER = addv(addv([0, 0, IN.z - 6], dIn, PL.s - PL.t), eIn, -PL.half * 0.55);
// la malla: un colchón de alambre tejido sobre su anillo, sujeto arriba por barras
const DEM = SV.DEM;
fp("int.dem.ring", CUT([0, 0, 0]), half(R - DEM.ring, R), DEM.z0 - 1.6, DEM.z0, { tone: "mid" }, { owner: "drum.shell" });
const demPoly = half(0, R - 0.2, 48);
const MESH = (() => {
  const u0 = -(R - 0.2), u1 = R - 0.2, z0 = DEM.z0, z1 = DEM.z1, out = [], step = 3.4;
  const lerp = (p, q, u) => [u, p[1] + ((q[1] - p[1]) * (u - p[0])) / (q[0] - p[0])];
  for (let c = u0 - (z1 - z0); c < u1; c += step) {
    for (const s of [1, -1]) {
      let a = [c, z0], b = [c + (z1 - z0), z1];
      if (s < 0) { a = [c + (z1 - z0), z0]; b = [c, z1]; }
      let A0 = a, B0 = b;
      if (A0[0] > B0[0]) [A0, B0] = [B0, A0];
      if (B0[0] < u0 || A0[0] > u1) continue;
      if (A0[0] < u0) A0 = lerp(A0, B0, u0);
      if (B0[0] > u1) B0 = lerp(A0, B0, u1);
      out.push(path3([[T[0] * A0[0], T[1] * A0[0], A0[1]], [T[0] * B0[0], T[1] * B0[0], B0[1]]]));
    }
  }
  return out.join("");
})();
const bars = [-0.66, -0.22, 0.22, 0.66].map((f) => { const u = f * (R - 0.2), v = -Math.sqrt((R - 0.2) ** 2 - u * u); return path3([addv(addv([0, 0, DEM.z1], T, u), HV, v + 0.05), addv([0, 0, DEM.z1], T, u)]); }).join("");
fp("int.dem", CUT([0, 0, 0]), demPoly, DEM.z0, DEM.z1, { tone: "mid" }, { cls: "sv-mesh", owner: "int.dem.ring", extra: `<g class="sv-meshtex">${Ln(MESH, { tone: "lo" })}</g>${Ln(bars, { tone: "mid" })}` });
ANCLAS.DEMISTER = UV(-R * 0.45, 0, (DEM.z0 + DEM.z1) / 2);
// rompe-vórtice: dos placas en cruz con su tapa, sobre un asiento encima de la boquilla de salida
const OUT = SV.OUT, oP = UV(0, OUT.v, 0);
const vb = pad("int.vb.base", SHELL, [oP[0], oP[1], botIn(Math.abs(OUT.v))], ZD3, 5.0, 1.6, {}, { owner: "drum.shell", from: -0.5 });
const vz = vb.face[2], VBH = 9, VBW = 11, FV = CUT([oP[0], oP[1], 0]);
fp("int.vb.u", FV, [[-VBW, -0.4], [VBW, -0.4], [VBW, 0.4], [-VBW, 0.4]], vz, vz + VBH, { tone: "mid" }, { owner: "int.vb.base" });
fp("int.vb.v0", FV, [[-0.4, -VBW], [0.4, -VBW], [0.4, -0.4], [-0.4, -0.4]], vz, vz + VBH, { tone: "mid" }, { owner: "int.vb.u" });
fp("int.vb.v1", FV, [[-0.4, 0.4], [0.4, 0.4], [0.4, VBW], [-0.4, VBW]], vz, vz + VBH, { tone: "mid" }, { owner: "int.vb.u" });
disc("int.vb.top", ZA([oP[0], oP[1], vz + VBH]), 0, 0.8, VBW + 1, { tone: "mid" }, { owner: "int.vb.u" });
ANCLAS.VORTEX = [oP[0] - T[0] * (VBW - 2), oP[1] - T[1] * (VBW - 2), vz + VBH * 0.45];
// termopozo de TI-113, en el líquido
const TI = SV.TI, dTI = radD(TI.th);
const twIn = pad("int.tw.pad", SHELL, addv([0, 0, TI.z], dTI, R), G.mul3(dTI, -1), 2.2, 1.2, {}, { owner: "drum.shell", from: -0.5 });
turned("int.tw.rod", G.frameAlong(twIn.face, G.mul3(dTI, -1)), [[0, 1.3], [24, 1.1], [25, 0.8, 1], [25.6, 0.1]], { tone: "mid" }, { owner: "int.tw.pad" });
// la horquilla vibrante de LSHH-115
const LS = SV.LSHH, dLS = radD(LS.th);
const lsIn = pad("int.ls.pad", SHELL, addv([0, 0, LS.z], dLS, R), G.mul3(dLS, -1), 3.2, 1.2, {}, { owner: "drum.shell", from: -0.5 });
const FLS = G.frameOf(lsIn.face, G.mul3(dLS, -1), G.unit3(G.cross3(ZD3, dLS)), ZD3);
disc("int.ls.hub", FLS, 0, 3, 1.8, { tone: "mid" }, { owner: "int.ls.pad" });
[-1, 1].forEach((sg, i) => fp(`int.ls.fork${i}`, FLS, [[-0.9, sg * 0.5], [0.9, sg * 0.5], [0.9, sg * 1.3], [-0.9, sg * 1.3]], 3, 12, { tone: "mid" }, { owner: "int.ls.hub" }));

/* ====================================================================
   2 · afuera: boquillas, instrumentos y válvulas
   ==================================================================== */
const onTop = (u, v) => UV(u, v, topOut(Math.hypot(u, v)));
// 2.1 · la entrada de 8″: cuello con brida, contrabrida y el carrete que viene de E-102
{
  const nk = pad("in.pad", SHELL, addv([0, 0, IN.z], dIn, RO), dIn, IN.r + 0.9, 1.6, {}, { owner: "drum.shell" });
  const end = addv([0, 0, IN.z], dIn, RO + IN.neck);
  pipe("in.neck", [nk.face, end], IN.r, { flanges: [false, true], flangeR: IN.fl / IN.r, flangeT: IN.ft, bolts: 12 });
  pipe("in.spool", [end, addv(end, dIn, IN.spool)], IN.r, { flanges: [true, false], flangeR: IN.fl / IN.r, flangeT: IN.ft, open: [false, true], bolts: 12 });
  ANCLAS.INLET = addv(addv([0, 0, IN.z + IN.r * 0.6], dIn, RO + IN.neck + IN.spool * 0.6), [0, 0, 0], 0);
}
// 2.2 · la salida de gas de 8″, por la cabeza superior, hacia los compresores
const GAS = SV.GAS;
{
  const g0 = onTop(GAS.u, GAS.v);
  const gp = pad("gas.pad", SHELL, g0, ZD3, GAS.r + 1.2, 2.4, {}, { owner: "drum.shell" });
  const n1 = addv(gp.face, ZD3, 16);
  pipe("gas.neck", [gp.face, n1], GAS.r, { flanges: [false, true], flangeR: GAS.fl / GAS.r, flangeT: GAS.ft, bolts: 12 });
  const elb = addv(n1, ZD3, GAS.up), dG = radD(GAS.th), end = addv(elb, dG, GAS.run);
  pipe("gas.line", [n1, elb, end], GAS.r, { bend: 1.6, flanges: [true, true], flangeR: GAS.fl / GAS.r, flangeT: GAS.ft, open: [false, true], bolts: 12 });
  ANCLAS.GAS = addv(addv(elb, dG, GAS.run * 0.62), ZD3, GAS.r * 0.7);
}
// 2.3 · la válvula de seguridad PSV-116 sobre su válvula de bloqueo (de compuerta, sellada abierta)
const PS = SV.PSV; // la PSV
{
  const p0 = onTop(PS.u, PS.v);
  const pp = pad("psv.pad", SHELL, p0, ZD3, 5.6, 2.2, {}, { owner: "drum.shell" });
  const r3 = 4.45, fl3 = 10.5, bv = addv(pp.face, ZD3, 21), body = addv(pp.face, ZD3, 44);
  const nf = addv(pp.face, ZD3, 9);
  pipe("psv.riser", [pp.face, body], r3, { balls: [{ name: "psv.bv.body", c: bv, R: 6.6 }, { name: "psv.body", c: body, R: 7.2, at: "end" }], collars: [{ c: nf, half: 2.4 }, { c: addv(bv, ZD3, -7.6), half: 1.0 }, { c: addv(bv, ZD3, 7.6), half: 1.0 }, { c: addv(body, ZD3, -8.6), half: 1.0 }] });
  [-1, 1].forEach((sg, i) => disc(`psv.nfl${i}`, ZA(nf), sg < 0 ? -2.4 : 0, sg < 0 ? 0 : 2.4, fl3, { tone: "mid" }, { owner: "psv.riser", extra: Dots(G.dotsOf(ZA(nf), sg * 2.4, fl3 * 0.78, 8, P), { size: 0.4 }) }));
  [-7.6, 7.6].forEach((dz, i) => disc(`psv.bvfl${i}`, ZA(addv(bv, ZD3, dz)), -1.0, 1.0, fl3 * 0.9, { tone: "mid" }, { owner: "psv.riser", extra: Dots(G.dotsOf(ZA(addv(bv, ZD3, dz)), dz > 0 ? 1.0 : -1.0, fl3 * 0.72, 8, P), { size: 0.4 }) }));
  disc("psv.infl", ZA(addv(body, ZD3, -8.6)), -1.0, 1.0, fl3 * 0.9, { tone: "mid" }, { owner: "psv.riser", extra: Dots(G.dotsOf(ZA(addv(body, ZD3, -8.6)), 1.0, fl3 * 0.72, 8, P), { size: 0.4 }) });
  const stemDir = G.unit3([-0.8 * T[0] - 0.6 * HV[0], -0.8 * T[1] - 0.6 * HV[1], 0]);
  later("psv.bv.wheel", Ln(wheel("psv.bv", bv, stemDir, 6.6, { wr: 6.2, br: 1.6, len: 7 }), { tone: "hi" }));
  // el cuerpo de la PSV: bonete, resorte en su campana, capuchón y palanca
  turned("psv.bonnet", ZA(body), [[entry(7.2, 4.4), 4.4], [6, 4.4], [7.4, 5.6], [8.6, 5.6], [9, 3.8], [22, 2.8], [23.4, 3.6]], { tone: "mid" }, { owner: "psv.body" });
  disc("psv.cap", ZA(body), 23.4, 29, 2.6, { tone: "mid" }, { owner: "psv.bonnet" });
  const lv = G.unit3([HV[0] * 0.5 + T[0] * 0.86, HV[1] * 0.5 + T[1] * 0.86, 0]);
  fp("psv.lever", G.frameOf(addv(body, ZD3, 26.2), lv, G.unit3(G.cross3(ZD3, lv)), ZD3), [[-0.5, -0.6], [0.5, -0.6], [0.5, 0.6], [-0.5, 0.6]], 2.55, 11, { tone: "mid" }, { owner: "psv.cap" });
  // la descarga a la tea, de lado
  const dOut = G.mul3(T, -1), ob = addv(body, dOut, 0);
  pipe("psv.tail", [ob, addv(ob, dOut, 32)], 5.7, { flanges: [false, true], flangeR: 13 / 5.7, flangeT: 2.6, open: [false, true], bolts: 8, balls: [{ name: "psv.body", c: body, R: 7.2, at: "start", shared: true }] });
  ANCLAS.PSV = addv(body, ZD3, 14);
  ANCLAS.BLOCK = addv(bv, stemDir, 6.6 + 7);
}
// 2.4 · el transmisor de presión PT-105, con su válvula de raíz
const PT = SV.PT;
{
  const q0 = onTop(PT.u, PT.v);
  const qp = pad("pt.pad", SHELL, q0, ZD3, 3.4, 2.0, {}, { owner: "drum.shell" });
  const v1 = addv(qp.face, ZD3, 9);
  const nf = addv(qp.face, ZD3, 4);
  pipe("pt.tube", [qp.face, addv(v1, ZD3, 9)], 1.3, { balls: [{ name: "pt.valve", c: v1, R: 3.0 }], collars: [{ c: nf, half: 1.6 }] });
  [-1, 1].forEach((sg, i) => disc(`pt.nfl${i}`, ZA(nf), sg < 0 ? -1.6 : 0, sg < 0 ? 0 : 1.6, 6.0, { tone: "mid" }, { owner: "pt.tube", extra: Dots(G.dotsOf(ZA(nf), sg * 1.6, 4.7, 4, P), { size: 0.36 }) }));
  const hd = G.unit3([T[0] * 0.35 + HV[0] * 0.94, T[1] * 0.35 + HV[1] * 0.94, 0]);
  fp("pt.handle", G.frameOf(addv(v1, hd, 0), hd, G.unit3(G.cross3(ZD3, hd)), ZD3), [[-0.35, -0.35], [0.35, -0.35], [0.35, 0.35], [-0.35, 0.35]], entry(3.0, 0.5), 7.5, { tone: "mid" }, { owner: "pt.valve" });
  const top = addv(v1, ZD3, 9);
  turned("pt.sensor", ZA(top), [[0, 2.6], [5, 2.6], [5.8, 2.0]], { tone: "mid" });
  const hc = addv(top, ZD3, 5.8 + 4.4 - 0.05), ha = G.unit3([T[0] * 0.5 + HV[0] * 0.87, T[1] * 0.5 + HV[1] * 0.87, 0]);
  turned("pt.housing", G.frameAlong(hc, ha), [[-5.8, 3.6], [-5.2, 4.4], [5.2, 4.4], [5.8, 3.6]], { tone: "mid" }, { owner: "pt.sensor" });
  ANCLAS.PT = addv(hc, ZD3, 4.4);
}
// 2.5 · el puente de nivel (standpipe) con LT-106 arriba y LG-114 al lado
const BR = SV.BR, dB = radD(BR.th), bc = addv([0, 0, 0], dB, BR.rad);
{
  const [za, zb] = BR.z;
  const lgZ = SV.LG.z;
  // el tubo del puente, con las T de las boquillas y de las tomas del visor
  pipe("br.pipe", [[bc[0], bc[1], BR.z0], [bc[0], bc[1], BR.z1]], BR.r, {
    flanges: [true, true], flangeR: 10.5 / BR.r, flangeT: 2.6, bolts: 8,
    balls: [{ name: "br.tee0", c: [bc[0], bc[1], za], R: 6.2 },
      { name: "br.tee1", c: [bc[0], bc[1], zb], R: 6.2 },
      { name: "br.tee2", c: [bc[0], bc[1], lgZ[0]], R: 5.4 },
      { name: "br.tee3", c: [bc[0], bc[1], lgZ[1]], R: 5.4 }],
  });
  // las boquillas del recipiente al puente, cada una con su válvula de compuerta
  [za, zb].forEach((z, i) => {
    const np = pad(`br.npad${i}`, SHELL, addv([0, 0, z], dB, RO), dB, BR.nz + 0.8, 1.6, {}, { owner: "drum.shell" });
    const vc = addv([0, 0, z], dB, RO + 15);
    pipe(`br.nz${i}`, [np.face, [bc[0], bc[1], z]], BR.nz, { bolts: 6, balls: [{ name: `br.v${i}.body`, c: vc, R: 4.6 }, { name: `br.tee${i}`, c: [bc[0], bc[1], z], R: 6.2, at: "end", shared: true }], collars: [{ c: addv(vc, dB, -5.6), half: 0.9 }, { c: addv(vc, dB, 5.6), half: 0.9 }] });
    [-5.6, 5.6].forEach((ds, j) => disc(`br.nfl${i}${j}`, G.frameAlong(addv(vc, dB, ds), dB), -0.9, 0.9, 7.6, { tone: "mid" }, { owner: `br.nz${i}`, extra: Dots(G.dotsOf(G.frameAlong(addv(vc, dB, ds), dB), ds > 0 ? 0.9 : -0.9, 6.2, 6, P), { size: 0.36 }) }));
    later(`br.v${i}.wheel`, Ln(wheel(`br.v${i}`, vc, ZD3, 4.6, { wr: 4.4, br: 1.0 }), { tone: "hi" }));
  });
  // abajo: brida ciega con la válvula de purga; arriba: LT-106 (radar de onda guiada)
  const bot = [bc[0], bc[1], BR.z0];
  disc("br.blind", ZA(bot), -2.2, 0, 10.5, { tone: "mid" }, { extra: Dots(G.dotsOf(ZA(bot), -2.2, 8.4, 8, P), { size: 0.38 }) });
  const dv = addv(bot, ZD3, -2.2 - 8);
  pipe("br.drain", [addv(bot, ZD3, -2.2), addv(dv, ZD3, -9)], 1.4, { balls: [{ name: "br.dv.body", c: dv, R: 3.2 }], flanges: [false, false], open: [false, true] });
  disc("br.dv.cap", ZA(addv(dv, ZD3, -9)), -1.6, 0, 2.0, { tone: "mid" }, { owner: "br.drain" });
  const top = [bc[0], bc[1], BR.z1];
  disc("lt.flange", ZA(top), 0, 2.6, 10.5, { tone: "mid" }, { extra: Dots(G.dotsOf(ZA(top), 2.6, 8.4, 8, P), { size: 0.38 }) });
  turned("lt.conn", ZA(top), [[2.6, 3.2], [7, 3.2], [7, 3.9], [9.2, 3.9]], { tone: "mid" }, { owner: "lt.flange" });
  turned("lt.housing", ZA(top), [[9.2, 4.6], [10, 5.6], [19.5, 5.6], [20.6, 4.8]], { tone: "mid" }, { owner: "lt.conn", rims: "all" });
  disc("lt.cover", ZA(top), 20.6, 23.4, 4.4, { tone: "mid" }, { owner: "lt.housing" });
  const gl = G.unit3([T[0] * 0.8 + HV[0] * 0.6, T[1] * 0.8 + HV[1] * 0.6, 0]);
  disc("lt.gland", G.frameAlong(addv(top, ZD3, 14.5), gl), entry(5.6, 1.4), 8.4, 1.4, { tone: "mid" }, { owner: "lt.housing" });
  ANCLAS.LT = addv(top, ZD3, 18);
  ANCLAS.BRIDLE = addv([bc[0], bc[1], 268], [0, 0, 0], 0);
  // el visor de vidrio LG-114, con sus válvulas de visor
  const lgc = addv(bc, T, SV.LG.off), VR = 3.2;
  lgZ.forEach((z, i) => pipe(`lg.tap${i}`, [[bc[0], bc[1], z], [lgc[0], lgc[1], z]], 1.4, { balls: [{ name: `br.tee${i + 2}`, c: [bc[0], bc[1], z], R: 5.4, at: "start", shared: true }, { name: `lg.v${i}`, c: [lgc[0], lgc[1], z], R: VR, at: "end" }] }));
  lgZ.forEach((z, i) => fp(`lg.handle${i}`, G.frameOf([lgc[0], lgc[1], z], T, G.mul3(HV, -1), ZD3), [[-0.4, -0.4], [0.4, -0.4], [0.4, 0.4], [-0.4, 0.4]], entry(VR, 0.6), VR + 4.5, { tone: "mid" }, { owner: `lg.v${i}` }));
  const g0 = lgZ[0] + VR + 2.2, g1 = lgZ[1] - VR - 2.2, FLG = G.frameOf([lgc[0], lgc[1], 0], ZD3, T, HV);
  const gw = 3.4, gd = 2.4;
  // la ventana: el líquido abajo, hasta el nivel normal, y el vapor arriba
  const face = (u, z) => [lgc[0] + T[0] * u + HV[0] * (gd + 0.05), lgc[1] + T[1] * u + HV[1] * (gd + 0.05), z];
  const w0 = g0 + 5, w1 = g1 - 5, wl = SV.NNL;
  const win = `<path class="sv-lgvap" d="${pth([face(-1.5, wl), face(1.5, wl), face(1.5, w1), face(-1.5, w1)].map(at))}"/>`
    + `<path class="sv-lgliq" d="${pth([face(-1.5, w0), face(1.5, w0), face(1.5, wl), face(-1.5, wl)].map(at))}"/>`
    + Ln(path3([face(-1.5, w0), face(1.5, w0), face(1.5, w1), face(-1.5, w1)], true), { tone: "mid" })
    + Dots([...Array(9)].flatMap((_, j) => { const z = w0 + 2 + ((w1 - w0 - 4) * j) / 8; return [at(face(-2.5, z)), at(face(2.5, z))]; }), { size: 0.3 });
  lgZ.forEach((z, i) => disc(`lg.nip${i}`, ZA([lgc[0], lgc[1], z]), i ? -(VR + 2.2) : entry(VR, 1.1), i ? -entry(VR, 1.1) : VR + 2.2, 1.1, { tone: "mid" }, { owner: `lg.v${i}` }));
  fp("lg.body", FLG, [[-gw, -gd], [gw, -gd], [gw, gd], [-gw, gd]], g0, g1, { tone: "mid" }, { owner: "lg.nip0", extra: win });
  ANCLAS.LG = face(gw * 0.6, (wl + w1) / 2 + 20);
}
// 2.6 · el interruptor de muy alto nivel LSHH-115 (horquilla vibrante)
{
  const np = pad("ls.pad", SHELL, addv([0, 0, LS.z], dLS, RO), dLS, 3.8, 1.6, {}, { owner: "drum.shell" });
  const e = addv([0, 0, LS.z], dLS, RO + 12);
  pipe("ls.neck", [np.face, e], 3.0, { flanges: [false, true], flangeR: 8.25 / 3.0, flangeT: 2.2, bolts: 6 });
  disc("ls.flange", G.frameAlong(e, dLS), 0, 2.2, 8.25, { tone: "mid" }, { extra: Dots(G.dotsOf(G.frameAlong(e, dLS), 2.2, 6.6, 6, P), { size: 0.36 }) });
  turned("ls.body", G.frameAlong(e, dLS), [[2.2, 2.2], [6, 2.2], [6, 3.0], [8, 3.0]], { tone: "mid" }, { owner: "ls.flange" });
  turned("ls.housing", G.frameAlong(e, dLS), [[8, 4.0], [8.8, 4.8], [15.5, 4.8], [16.4, 4.0]], { tone: "mid" }, { owner: "ls.body", rims: "all" });
  disc("ls.cover", G.frameAlong(e, dLS), 16.4, 18.6, 3.6, { tone: "mid" }, { owner: "ls.housing" });
  ANCLAS.LSHH = addv(addv([0, 0, LS.z], dLS, RO + 12 + 12), ZD3, 4.8);
}
// 2.7 · el termómetro TI-113 sobre su termopozo
{
  const np = pad("ti.pad", SHELL, addv([0, 0, TI.z], dTI, RO), dTI, 2.8, 1.6, {}, { owner: "drum.shell" });
  const e = addv([0, 0, TI.z], dTI, RO + 9);
  pipe("ti.neck", [np.face, e], 2.0, { flanges: [false, true], flangeR: 6.3 / 2.0, flangeT: 1.8, bolts: 4 });
  disc("ti.flange", G.frameAlong(e, dTI), 0, 1.8, 6.3, { tone: "mid" }, { extra: Dots(G.dotsOf(G.frameAlong(e, dTI), 1.8, 5.0, 4, P), { size: 0.36 }) });
  turned("ti.head", G.frameAlong(e, dTI), [[1.8, 1.6], [4.5, 1.6], [4.5, 2.2], [6, 2.2]], { tone: "mid" }, { owner: "ti.flange" });
  const tn = G.unit3([dTI[0] * 0.55 + HV[0] * 0.85, dTI[1] * 0.55 + HV[1] * 0.85, 0.1]);
  const sc = addv(e, dTI, 6);
  disc("ti.stem", G.frameAlong(sc, tn), -0.2, 3.4, 0.7, { tone: "mid" }, { owner: "ti.head" });
  const dc = addv(sc, tn, 3.4 + 1.6);
  later("ti.bezel", dial("ti", dc, tn, 5.2, { owner: "ti.stem", value: 0.42 }));
  ANCLAS.TI = addv([0, 0, TI.z], dTI, R - 15);
}
// 2.8 · la salida de líquido de 3″ por el fondo, hacia V-103, y el drenaje de 2″
{
  const o0 = [oP[0], oP[1], botOut(Math.abs(OUT.v))];
  const op = pad("liq.pad", SHELL, o0, [0, 0, -1], OUT.r + 1.0, 2.0, {}, { owner: "drum.shell" });
  const n1 = addv(op.face, ZD3, -12);
  pipe("liq.neck", [op.face, n1], OUT.r, { flanges: [false, true], flangeR: OUT.fl / OUT.r, flangeT: OUT.ft, bolts: 8 });
  const elb = [oP[0], oP[1], 46], dO = radD(OUT.th), end = addv(elb, dO, OUT.run);
  pipe("liq.line", [n1, elb, end], OUT.r, { bend: 2.4, flanges: [true, true], flangeR: OUT.fl / OUT.r, flangeT: OUT.ft, open: [false, true], bolts: 8 });
  ANCLAS.OUTLET = addv(addv(elb, dO, OUT.run * 0.78), ZD3, OUT.r * 0.7);
  const DN = SV.DRN, d0 = UV(DN.u, DN.v, 0);
  const dp = pad("drn.pad", SHELL, [d0[0], d0[1], botOut(Math.hypot(DN.u, DN.v))], [0, 0, -1], DN.r + 0.8, 2.0, {}, { owner: "drum.shell" });
  const dn1 = addv(dp.face, ZD3, -8), dvc = addv(dn1, ZD3, -10.4);
  pipe("drn.line", [dp.face, addv(dvc, ZD3, -10.4)], DN.r, { flanges: [false, true], flangeR: DN.fl / DN.r, flangeT: 2.0, bolts: 4, balls: [{ name: "drn.v.body", c: dvc, R: 5.0 }], collars: [{ c: dn1, half: 2.0 }] });
  [-1, 1].forEach((sg, i) => disc(`drn.nfl${i}`, ZA(dn1), sg < 0 ? -2.0 : 0, sg < 0 ? 0 : 2.0, DN.fl, { tone: "mid" }, { owner: "drn.line", extra: Dots(G.dotsOf(ZA(dn1), sg * 2.0, DN.fl * 0.78, 4, P), { size: 0.36 }) }));
  disc("drn.blind", ZA(addv(dvc, ZD3, -10.4)), -2.0, 0, DN.fl, { tone: "mid" }, { extra: Dots(G.dotsOf(ZA(addv(dvc, ZD3, -10.4)), -2.0, DN.fl * 0.78, 4, P), { size: 0.36 }) });
  const sd = G.unit3([T[0] * 0.75 + HV[0] * 0.66, T[1] * 0.75 + HV[1] * 0.66, 0]);
  later("drn.v.wheel", Ln(wheel("drn.v", dvc, sd, 5.0, { wr: 4.4, br: 1.0 }), { tone: "hi" }));
  ANCLAS.DRAIN = addv(dvc, ZD3, -14);
}

/* ====================================================================
   3 · el líquido: la cara en el plano del corte y la superficie en la mitad de atrás, al nivel normal
   ==================================================================== */
const ZL = SV.NNL;
const liquidSvg = (() => {
  const pts = [], n = 32;
  for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (i / n); pts.push([-R * Math.cos(a), Z0 - HD * Math.sin(a)]); }
  for (let i = n; i >= 0; i--) { const a = (Math.PI / 2) * (i / n); pts.push([R * Math.cos(a), Z0 - HD * Math.sin(a)]); }
  const face = [[-R, ZL], ...pts, [R, ZL]].map(([u, z]) => at([T[0] * u, T[1] * u, z]));
  const top = []; for (let i = 0; i <= 64; i++) { const th = Math.PI + (Math.PI * i) / 64; top.push(at(addv([0, 0, ZL], rad(th), R))); }
  // la marca de nivel: un triángulo invertido sobre la línea, cerca de la pared izquierda
  const mu = -R * 0.62, mk = [[mu - 3.2, ZL + 5.2], [mu + 3.2, ZL + 5.2], [mu, ZL + 0.4]].map(([u, z]) => at([T[0] * u, T[1] * u, z]));
  return `<path class="sv-liqtop" d="${pth(top)}"/><path class="sv-liqface" d="${pth(face)}"/>`
    + `<path class="sv-nnl" d="${pth([at([T[0] * -R, T[1] * -R, ZL]), at([T[0] * R, T[1] * R, ZL])], false)}"/>`
    + `<path class="sv-nnlmark" d="${pth(mk)}"/><path class="sv-nnl" d="${pth([at([T[0] * (mu - 4.4), T[1] * (mu - 4.4), ZL - 1.6]), at([T[0] * (mu + 4.4), T[1] * (mu + 4.4), ZL - 1.6])], false)}"/>`;
})();
ANCLAS.NNL = [T[0] * -R * 0.62, T[1] * -R * 0.62, ZL + 5.2];

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const idx = (name) => R_.items.findIndex((it) => it.name === name);
const slots = new Map();
const slotAt = (i, html) => { if (i < 0) throw new Error("no slot"); slots.set(i, (slots.get(i) || "") + html); };
for (const [name, html] of after) slotAt(idx(name), html);
// el líquido va después de todo lo que hay adentro y del cuerpo
let liqAt = idx("drum.shell");
R_.items.forEach((it, i) => { if (it.name.startsWith("int.")) liqAt = Math.max(liqAt, i); });
slotAt(liqAt, liquidSvg);
const CSS = `.sv-cav{--anatomy-paper:#d3d8dd;--anatomy-face:#d3d8dd;--anatomy-top:#dce0e4;--anatomy-shade-0:#b3bac1;--anatomy-shade-1:#bcc2c8;--anatomy-shade-2:#c5cad0;--anatomy-shade-3:#cdd2d7}
.sv-cutface{--anatomy-paper:#8e969e;--anatomy-top:#8e969e;--anatomy-face:#8e969e;--anatomy-shade-0:#8e969e;--anatomy-shade-1:#8e969e;--anatomy-shade-2:#8e969e;--anatomy-shade-3:#8e969e}
.sv-mesh{--anatomy-paper:#eef0ea;--anatomy-top:#f3f4ef;--anatomy-face:#eef0ea;--anatomy-shade-0:#d6d9d1;--anatomy-shade-1:#dcdfd7;--anatomy-shade-2:#e3e5de;--anatomy-shade-3:#e9ebe4}
.sv-concrete{--anatomy-paper:#e2e0da;--anatomy-top:#e6e4de;--anatomy-face:#e2e0da;--anatomy-shade-0:#c4c0b7;--anatomy-shade-1:#cbc7bf;--anatomy-shade-2:#d2cfc7;--anatomy-shade-3:#d9d6cf}
.sv-meshtex .iso-line{stroke-opacity:.75}
.sv-tick{fill:none;stroke:#8a8a8f;stroke-width:.32;stroke-linecap:round}
.sv-needle{fill:none;stroke:#26262a;stroke-width:.42;stroke-linecap:round}
.sv-hub{fill:#26262a}
.sv-liqface{fill:#7fb0d6;fill-opacity:.5;stroke:none}
.sv-liqtop{fill:#a3c7e3;fill-opacity:.6;stroke:none}
.sv-nnl{fill:none;stroke:#3f6e8f;stroke-width:.7px;stroke-linecap:round;vector-effect:non-scaling-stroke}
.sv-nnlmark{fill:#3f6e8f;stroke:none}
.sv-lgliq{fill:#9fbfd4;stroke:none}
.sv-lgvap{fill:#f3f7fa;stroke:none}`;
const groups = R_.items.map((item, index) => `<g class="it" data-name="${item.name}">${item.svg}${slots.get(index) ?? ""}</g>`);
const svg = k.figureSvg({ width: W, height: H, label: "V-102 high-pressure separator, cutaway", body: [`<style>${CSS}</style><g class="sv-items">${groups.join("")}</g>`] });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "out", "fig.svg"), svg);
writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "out", "separador_data.json"), JSON.stringify({ P, W, H, ANCLAS }));
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "V-102", theme: "light", width: 760, body: `<div class="iso-stage">${svg}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
// Dos excusas, revisadas a 4×: (1) el audit toma el cuerpo y el corte de la pared como varillas por su eje, y el codo
// de la salida de líquido cae bajo el polo de esa varilla imaginaria, 26 cm detrás de la pared; (2) el asiento de la
// salida de gas sobre la cabeza: una astilla de 2 px² en la base, donde la cúpula sube delante del asiento.
if (!FAST) A.auditOrExit(R_, P, { crowd: [["liq.line", "drum.*"]], allow: [["drum.shell", "gas.pad"]] });
