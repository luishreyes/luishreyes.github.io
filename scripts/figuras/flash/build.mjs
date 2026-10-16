/* ====================================================================
   El sistema flash en isométrico (skill anatomy), para la pestaña
   «Tambor» del Explorador de equilibrio y flash.
   Concepto (diapositivas de la sesión de flash y Lectura 11): la bomba
   sube la presión de la alimentación para que no hierva en el
   intercambiador; el vapor de servicio la calienta hasta T_F; la válvula
   de expansión la estrangula hasta la presión del tambor y una parte se
   vaporiza al instante (se ve por la mirilla de flujo). En el tambor la
   mezcla choca con el deflector: el líquido cae y el vapor sube por el
   espacio de desenganche arrastrando gotas finas, que la malla atrapa.
   El vapor sale por arriba y el líquido por abajo, con control de nivel.
   Lo que se mueve sale del modelo del explorador: Ψ, V, L, T, P, T_F, P₁
   y las composiciones; la velocidad del vapor en el tambor (gas ideal) y
   el tiempo de residencia del líquido se calculan con las medidas del
   tambor dibujado.
   Corte: el tambor va abierto por el plano vertical de su eje que mira al
   lector; el resto va entero.
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
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
const bundle = (data) => "/* sistema flash en isométrico: generado por build.mjs */\nvar FL_DATA = " + data + ";\nvar FFlash = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FFlash;\n})();\n";
const preview = (svg) => k.pageHtml({ title: "Sistema flash", theme: "light", width: 900, body: `<style>${readFileSync(join(HERE, "fl.css"), "utf8")}</style><div class="iso-stage" id="flFig">${svg}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + readFileSync(join(HERE, "drive_test.js"), "utf8") });
if (process.argv.includes("--js")) {
  writeFileSync(join(HERE, "out", "fig.js"), bundle(readFileSync(join(HERE, "flash_data.json"), "utf8")));
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "fl.css"), "utf8"));
  writeFileSync(join(HERE, "preview.html"), preview(readFileSync(join(HERE, "out", "fig.svg"), "utf8")));
  console.log("out/fig.js, out/fig.css, preview.html"); process.exit(0);
}
const FX = GEO.FX, W = 620, H = 660, AZ = FX.AZ, EL = FX.EL;
const { T, HV } = GEO.axesOf(AZ);
const DR = FX.DR, IN = FX.IN, DEM = FX.DEM, OUT = FX.OUT, VAP = FX.VAP, LG = FX.LG, TR = FX.TR, PU = FX.PU, EX = FX.EX, VA = FX.VA;

const EXT = [[TR.x - 18, PU.suc + 4, 0], [TR.x + 18, PU.suc + 4, 0], [TR.x, PU.suc + 2, 40], [TR.x - 56, 62, 216], [TR.x - 18, 160, 0], [TR.x + 18, 40, 0],
  [0, 0, VAP.z + 6], [VAP.x, VAP.pcv, VAP.z + 44], [VAP.x, VAP.y1 - 2, VAP.z + 10], [-24, 6, 286], [OUT.x1 + 3, OUT.y, 0], [OUT.lcv, OUT.y, OUT.z + 42],
  [0, LG.y - 10, LG.z1 + 6], [40, -40, 0], [-40, 40, 0], [44, 10, 0], [TR.x - 20, 20, 0]];
const P = k.fitProjection(EXT, W, H, { pad: 12, azimuth: AZ, elevation: EL });
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
function pipe(name, control, r, { bend = 3, tone = "mid", flanges = [false, false], flangeR = 1.7, cls = "", maxLength = 14, balls = [], collars = [], open = [false, false], breaks = [] } = {}) {
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
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), cls, maxLength, breaks, ends: [!open[0], !open[1]] });
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
  if (red) { const a0 = (225 - 270 * (1 - red)) * D2R, a1 = -45 * D2R, rr = r - 1.25; arc = `<path class="fl-redarc" d="M${(rr * Math.cos(a0)).toFixed(2)} ${(rr * Math.sin(a0)).toFixed(2)}A${rr} ${rr} 0 0 1 ${(rr * Math.cos(a1)).toFixed(2)} ${(rr * Math.sin(a1)).toFixed(2)}"/>`; }
  return { M, html: `<g class="fl-dial" transform="${M}">${arc}<path class="fl-tick" d="${tk}"/><g data-live="${live}"><path class="fl-needle" d="M-0.9 0L${(r - 1.6).toFixed(2)} 0"/></g><circle class="fl-hub" r="0.55"/></g>` };
}
// el volante de una válvula de mano: bonete desde la superficie del cuerpo y rueda de alma llena con sus radios
function wheel(name, c, up, R) {
  const top = G.add3(c, G.mul3(up, R + 2.8));
  disc(`${name}.bonnet`, G.frameAlong(c, up), entry(R, 1.0), R + 2.8, 1.0, { tone: "mid" }, { owner: `${name}.body` });
  const HW = G.frameAlong(top, up);
  ring(`${name}.wheel`, HW, 0, 0.6, 0.8, 4.2, { tone: "hi" }, { owner: `${name}.bonnet` });
  return [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; return path3([G.pointOf(HW, 0.6, 1.0, a), G.pointOf(HW, 0.6, 3.45, a)]); }).join("") + G.arcOf(HW, 0.6, 3.55, P, { least: -1 });
}
/* una válvula de control: cuerpo, bridas, bonete, arcada con escala de carrera y actuador de diafragma.
   Devuelve el lugar del indicador de carrera, que mueve la página. */
function controlValve(name, c, along, { R = 5.2, r = 3, stroke = 1.8 } = {}) {
  ball(`${name}.body`, c, R, { tone: "mid" }, { bores: [{ owner: name + ".line", dir: along, r }] });
  const UP = ZD3, bt = c[2] + R + 6.2;
  disc(`${name}.bonnet`, ZA(c), entry(R, 2.3), R + 5, 2.3, { tone: "mid" }, { owner: `${name}.body` });
  disc(`${name}.bflange`, ZA(c), R + 5, R + 6.2, 4.6, { tone: "mid" }, { owner: `${name}.bonnet`, extra: Dots(G.dotsOf(ZA(c), R + 6.2, 3.7, 6, P), { size: 0.4 }) });
  const side = G.unit3(G.cross3(UP, along)); // los postes de la arcada, a los lados del vástago
  const yk = 12, y0 = bt, y1 = bt + yk;
  [-1, 1].forEach((sg, i) => {
    const pc = addv(c, side, sg * 3.1);
    const a = [pc[0] - 0.6, pc[1] - 0.6, y0], b = [pc[0] + 0.6, pc[1] + 0.6, y1];
    box(`${name}.yoke${i}`, a, b, { tone: "mid" }, { r: 0.15, owner: `${name}.bflange` });
  });
  const tp = [c[0], c[1], y1];
  disc(`${name}.ytop`, ZA(tp), 0, 1.3, 4.4, { tone: "mid" }, { owner: `${name}.yoke0` });
  disc(`${name}.stem`, ZA(c), bt - c[2], y1 - c[2], 0.55, { tone: "hi" }, { owner: `${name}.bflange` });
  const A0 = y1 + 1.3;
  turned(`${name}.diaL`, ZA([c[0], c[1], A0]), [[0, 2.6], [4.2, 12.6]], { tone: "mid" }, { owner: `${name}.ytop` });
  disc(`${name}.diaF`, ZA([c[0], c[1], A0]), 4.2, 5.4, 13.4, { tone: "mid" }, { owner: `${name}.diaL`, extra: Dots(G.dotsOf(ZA([c[0], c[1], A0]), 5.4, 12.7, 16, P), { size: 0.42 }) });
  turned(`${name}.diaU`, ZA([c[0], c[1], A0]), [[5.4, 12.6], [10.4, 3.4]], { tone: "mid" }, { owner: `${name}.diaF` });
  disc(`${name}.vent`, ZA([c[0], c[1], A0]), 10.4, 11.8, 1.6, { tone: "mid" }, { owner: `${name}.diaU` });
  // escala de carrera en el poste del lado del lector
  const sg = Math.sign(G.dot3(side, HV)), nrm = G.mul3(side, sg), post = addv(c, nrm, 3.1), face = addv(post, nrm, 0.6), tan = G.unit3(G.cross3(ZD3, nrm));
  const sc = [0, 1, 2, 3, 4].map((i) => { const z = y0 + 3 + (i * (yk - 6)) / 4; return path3([addv([face[0], face[1], z], tan, -0.6), addv([face[0], face[1], z], tan, 0.6)]); }).join("");
  return { ticks: sc, stem: [c[0], c[1]], nrm, z0: y0 + 3, z1: y0 + yk - 3, top: A0 + 11.8 };
}

/* ====================================================================
   1 · el tambor (en corte): cuerpo, cabezas, patas y boquillas
   ==================================================================== */
const R = DR.R, TW = DR.TW, Z0 = DR.z0, Z1 = DR.z1, HD = DR.hd, RO = R + TW, HO = HD + TW;
const DF = ZA([0, 0, 0]);
const ell = (zc, rr, hh, a) => [zc + hh * Math.sin(a), rr * Math.cos(a)];
const merid = [];
for (let i = 0; i <= 12; i++) merid.push(ell(Z0, RO, HO, -Math.PI / 2 + (Math.PI / 2) * (i / 12)));
for (let i = 0; i <= 12; i++) merid.push(ell(Z1, RO, HO, (Math.PI / 2) * (i / 12)));
for (let i = 12; i >= 0; i--) merid.push(ell(Z1, R, HD, (Math.PI / 2) * (i / 12)));
for (let i = 0; i <= 12; i++) merid.push(ell(Z0, R, HD, -(Math.PI / 2) * (i / 12)));
const FRONT = A.orientedBox([HV[0] * 400, HV[1] * 400, 150], [T, HV, ZD3], [400, 400, 400]);
const SHELL = record(A.body(DF, merid, { name: "drum.shell", cut: [FRONT] }));
const topOut = (r) => Z1 + GEO.headDepth(r, RO, HO), botOut = (r) => Z0 - GEO.headDepth(r, RO, HO);
const topIn = (r) => Z1 + GEO.headDepth(r, R, HD), botIn = (r) => Z0 - GEO.headDepth(r, R, HD);
// las caras de un cuerpo de revolución (el interior del corte o la cúpula exterior), sombreadas como las del kit:
// la superficie se recorre en franjas de θ y, en cada franja, los tramos seguidos del mismo tono van en un solo polígono
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const rad = (th) => [Math.cos(th) * T[0] + Math.sin(th) * HV[0], Math.cos(th) * T[1] + Math.sin(th) * HV[1], 0];
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + (Math.round(x * 10) / 10) + " " + (Math.round(y * 10) / 10)).join("") + "Z";
// el cilindro: el tono depende solo de θ, así que las franjas seguidas del mismo tono van en un solo cuadrilátero
function cylinder(rr, sg, nt, out) {
  let run = null;
  const flush = (t1) => { if (run && run.band >= 0) { const P3 = (t, z) => addv([0, 0, z], rad(t), rr), d = pth1([P3(run.t0, Z0), P3(t1, Z0), P3(t1, Z1), P3(run.t0, Z1)].map((p) => C.pr(...p))); out.by[run.band].push(d); out.fill.push(d); } run = null; };
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
// u ∈ [0, 1]: en el cilindro, de z0 a z1; en una cabeza, del ecuador al polo
const cylP = (rr) => (t, u) => addv([0, 0, Z0 + (Z1 - Z0) * u], rad(t), rr);
const headP = (rr, hh, zc, up) => (t, u) => { const a = (Math.PI / 2) * u; return addv([0, 0, zc + up * hh * Math.sin(a)], rad(t), rr * Math.cos(a)); };
const headN = (rr, hh, up, sg) => (t, u) => { const a = (Math.PI / 2) * u, r3 = rad(t); return G.mul3(G.unit3([r3[0] * Math.cos(a) / rr, r3[1] * Math.cos(a) / rr, (up * Math.sin(a)) / hh]), sg); };
const cavity = toned((o) => { cylinder(R, -1, 240, o); surface(headP(R, HD, Z0, -1), headN(R, HD, -1, -1), 64, 16, o); surface(headP(R, HD, Z1, 1), headN(R, HD, 1, -1), 40, 8, o); });
const dome = toned((o) => surface(headP(RO, HO, Z1, 1), headN(RO, HO, 1, 1), 72, 16, o));
// el hueco que se ve por el corte: el contorno interior en el plano
const secIn = [...GEO.drumSide(-1, true), ...GEO.drumSide(1, true).reverse()].map(([u, z]) => C.pr(T[0] * u, T[1] * u, z));
// la cúpula de atrás vista por fuera: entre la silueta y el borde del corte
const silh = [];
for (let i = 0; i <= 48; i++) { const th = Math.PI + (Math.PI * i) / 48, a = Math.atan(-(HO / RO) * Math.sin(th) * Math.cos(EL * D2R) / Math.sin(EL * D2R)); silh.push(addv([0, 0, Z1 + HO * Math.sin(a)], rad(th), RO * Math.cos(a))); }
const crest = []; for (let i = 0; i <= 36; i++) { const u = RO - (2 * RO * i) / 36; crest.push([T[0] * u, T[1] * u, topOut(Math.abs(u))]); }
const domeReg = [...silh, ...crest].map((p) => C.pr(...p));
// costuras de soldadura por dentro: las circunferenciales y la longitudinal de atrás
const seamArc = (z) => { const pts = []; for (let i = 0; i <= 36; i++) pts.push(addv([0, 0, z], rad(Math.PI + (Math.PI * i) / 36), R - 0.02)); return path3(pts); };
const ZM = (Z0 + Z1) / 2 + 6;
const seams = seamArc(Z0) + seamArc(Z1) + seamArc(ZM) + path3([addv([0, 0, Z0], rad(1.5 * Math.PI), R - 0.02), addv([0, 0, ZM], rad(1.5 * Math.PI), R - 0.02)]) + path3([addv([0, 0, ZM], rad(1.62 * Math.PI), R - 0.02), addv([0, 0, Z1], rad(1.62 * Math.PI), R - 0.02)]);
const shellSvg = `<clipPath id="flCavClip"><path d="${pth(secIn)}"/></clipPath><clipPath id="flDomeClip"><path d="${pth(domeReg)}"/></clipPath>`
  + `<g class="iso-solid fl-cav" clip-path="url(#flCavClip)">${cavity}${Ln(seams, { tone: "faint" })}</g>`
  + `<g class="iso-solid" clip-path="url(#flDomeClip)">${dome}</g>${Ln(path3(silh), { tone: "mid" })}`;
put("drum.shell", [0, -R * 0.6, (Z0 + Z1) / 2], shellSvg, [SHELL]);
// la pared cortada, al frente: una «C» por costado en el plano de corte
const CF = { o: [0, 0, 0], a: G.mul3(HV, -1), u: T, v: ZD3 };
fp("drum.cut.l", CF, GEO.wallCut(-1), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "fl-cutface", owner: "drum.shell" });
fp("drum.cut.r", CF, GEO.wallCut(1), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "fl-cutface", owner: "drum.shell" });

// patas: tres tubos tangentes al cuerpo, con placa base y anclajes
[215, 270, 325].forEach((deg, i) => {
  const d = rad(deg * D2R), c = addv([0, 0, 0], d, RO + DR.legR);
  disc(`stand.dleg${i}`, ZA([c[0], c[1], 1.2]), 0, DR.legTop - 1.2, DR.legR, { tone: "lo" }, { owner: "drum.shell" });
  disc(`stand.dcap${i}`, ZA([c[0], c[1], DR.legTop]), 0, 0.8, DR.legR + 0.3, { tone: "lo" }, { owner: `stand.dleg${i}` });
  box(`stand.dplate${i}`, [c[0] - 5.5, c[1] - 5.5, 0], [c[0] + 5.5, c[1] + 5.5, 1.2], { tone: "lo" }, { r: 0.5, extra: Dots([at([c[0] - 4, c[1] - 4, 1.2]), at([c[0] + 4, c[1] + 4, 1.2]), at([c[0] - 4, c[1] + 4, 1.2]), at([c[0] + 4, c[1] - 4, 1.2])], { size: 0.45 }) });
});

/* ---------- 1.1 · por dentro: entrada con deflector, malla, rompe-vórtice y termopozo ---------- */
// la entrada: atraviesa la pared por −x y descarga contra la placa deflectora
const inPad = pad("drum.in.pad", SHELL, [-R, 0, IN.z], XD, IN.r + 0.7, 1.4, {}, { owner: "drum.shell", from: -0.5 });
const PL = IN.plate;
pipe("drum.in.pipe", [inPad.face, [PL.x - 7, 0, IN.z]], IN.r, { open: [false, true] });
box("drum.plate", [PL.x - PL.t, -PL.y, PL.z0], [PL.x, PL.y, PL.z1], { tone: "mid" }, { r: 0.1 });
const wallX = (y) => -Math.sqrt(R * R - y * y);
[[-(PL.y - 0.5), PL.z1 - 2.2], [PL.y - 0.5, PL.z1 - 2.2], [-(PL.y - 0.5), PL.z0 + 0.2], [PL.y - 0.5, PL.z0 + 0.2]].forEach(([y, z], i) => box(`drum.strap${i}`, [wallX(Math.abs(y)) + 0.05, y - 0.3, z], [PL.x - PL.t, y + 0.3, z + 2], { tone: "mid" }, { r: 0.05, owner: "drum.plate" }));
// la malla: un colchón de alambre tejido sobre su anillo soldado a la pared
fp("drum.dem.ring", CUT([0, 0, 0]), half(R - DEM.ring, R), DEM.z0 - 2, DEM.z0, { tone: "mid" });
const demPoly = half(0, R - 0.2, 40);
const MESH = (() => { // textura del corte: tejido en diagonal, de borde a borde de la cara
  const u0 = -(R - 0.2), u1 = R - 0.2, z0 = DEM.z0, z1 = DEM.z1, out = [], step = 2.2;
  for (let c = u0 - (z1 - z0); c < u1; c += step) {
    for (const s of [1, -1]) {
      let a = [c, z0], b = [c + (z1 - z0), z1];
      if (s < 0) { a = [c + (z1 - z0), z0]; b = [c, z1]; }
      const clip = (p, q) => { const t0 = [p, q]; return t0; };
      // recorta el segmento a u ∈ [u0, u1]
      const lerp = (p, q, u) => [u, p[1] + ((q[1] - p[1]) * (u - p[0])) / (q[0] - p[0])];
      let A0 = a, B0 = b;
      if (A0[0] > B0[0]) [A0, B0] = [B0, A0];
      if (B0[0] < u0 || A0[0] > u1) continue;
      if (A0[0] < u0) A0 = lerp(A0, B0, u0);
      if (B0[0] > u1) B0 = lerp(A0, B0, u1);
      clip();
      out.push(path3([[T[0] * A0[0], T[1] * A0[0], A0[1]], [T[0] * B0[0], T[1] * B0[0], B0[1]]]));
    }
  }
  return out.join("");
})();
const bars = [-0.62, 0, 0.62].map((f) => { const u = f * (R - 0.2), v = -Math.sqrt((R - 0.2) ** 2 - u * u); return path3([addv(addv([0, 0, DEM.z1], T, u), HV, v + 0.05), addv([0, 0, DEM.z1], T, u)]); }).join("");
fp("drum.dem", CUT([0, 0, 0]), demPoly, DEM.z0, DEM.z1, { tone: "mid" }, { cls: "fl-mesh", extra: `<g class="fl-meshtex">${Ln(MESH, { tone: "lo" })}</g>${Ln(bars, { tone: "mid" })}` });
// rompe-vórtice: dos placas en cruz sobre un asiento encima de la boquilla de salida
const vbP = [OUT.x, OUT.y, botIn(Math.hypot(OUT.x, OUT.y))];
const vb = pad("drum.vb.base", SHELL, vbP, ZD3, 4.2, 2.0, {}, { owner: "drum.shell", from: -0.5 });
const vz = vb.face[2];
box("drum.vb.x", [OUT.x - 6, OUT.y - 0.3, vz], [OUT.x + 6, OUT.y + 0.3, vz + 6], { tone: "mid" }, { r: 0.05, owner: "drum.vb.base" });
box("drum.vb.y0", [OUT.x - 0.3, OUT.y - 5, vz], [OUT.x + 0.3, OUT.y - 0.3, vz + 6], { tone: "mid" }, { r: 0.05, owner: "drum.vb.x" });
box("drum.vb.y1", [OUT.x - 0.3, OUT.y + 0.3, vz], [OUT.x + 0.3, OUT.y + 5, vz + 6], { tone: "mid" }, { r: 0.05, owner: "drum.vb.x" });
// termómetro del tambor: termopozo por el costado izquierdo, en el líquido
const TWA = 190 * D2R, twD = rad(TWA), TWZ = 78;
const twIn = pad("drum.tw.in", SHELL, addv([0, 0, TWZ], twD, R), G.mul3(twD, -1), 1.3, 1.0, {}, { owner: "drum.shell", from: -0.5 });
disc("drum.tw.rod", G.frameAlong(twIn.face, G.mul3(twD, -1)), 0, 9, 0.7, { tone: "hi" }, { owner: "drum.tw.in" });
const twOut = pad("drum.tw.out", SHELL, addv([0, 0, TWZ], twD, RO), twD, 1.5, 2.6, {}, { owner: "drum.shell" });
const twN = G.unit3([twD[0] + HV[0] * 1.2, twD[1] + HV[1] * 1.2, 0.12]);
disc("drum.tw.stem", G.frameAlong(twOut.face, twN), -0.3, 3.6, 0.6, { tone: "mid" }, { owner: "drum.tw.out" });
const TDD = dial("tdrum", addv(twOut.face, twN, 3.6 + 1.6), twN, 4.4, { live: "tdrum", owner: "drum.tw.stem" });

/* ---------- 1.2 · boquillas de afuera: vapor, válvula de seguridad, manómetro, nivel y líquido ---------- */
const onTop = (x, y) => [x, y, topOut(Math.hypot(x, y))];
// salida de vapor por arriba, con brida, a la válvula de control de presión
const vPad = pad("vap.pad", SHELL, onTop(VAP.x, VAP.y), ZD3, VAP.r + 0.8, 2.4, {}, { owner: "drum.shell" });
const PCV = [VAP.x, VAP.pcv, VAP.z];
const pcv = controlValve("pcv", PCV, YD, { R: 7, r: VAP.r });
pipe("pcv.line", [vPad.face, [VAP.x, VAP.y, VAP.z], [VAP.x, VAP.y1, VAP.z]], VAP.r, { bend: 2.6, flanges: [true, true], open: [false, true], balls: [{ name: "pcv.body", c: PCV, R: 7, shared: true }], collars: [{ c: addv(PCV, YD, 7.8), half: 0.7 }, { c: addv(PCV, YD, -7.8), half: 0.7 }] });
[7.8, -7.8].forEach((dy, i) => disc(`pcv.fl${i}`, G.frameAlong(addv(PCV, YD, dy), YD), -0.7, 0.7, VAP.r * 1.75, { tone: "mid" }, { owner: "pcv.line", extra: Dots(G.dotsOf(G.frameAlong(addv(PCV, YD, dy), YD), 0.7 * Math.sign(-dy), VAP.r * 1.35, 6, P), { size: 0.4 }) }));
// válvula de seguridad: entrada vertical, cuerpo, bonete, capuchón y palanca; descarga de lado
const SV = [-15, 2];
const svPad = pad("psv.pad", SHELL, onTop(...SV), ZD3, 2.6, 2.2, {}, { owner: "drum.shell" });
const svB = [SV[0], SV[1], svPad.face[2] + 7.5];
disc("psv.neck", ZA(svPad.face), 0, 7.5 - entry(4, 1.8), 1.8, { tone: "mid" }, { owner: "psv.pad" });
ball("psv.body", svB, 4, { tone: "mid" });
turned("psv.bonnet", ZA(svB), [[entry(4, 2.4), 2.4], [9, 2.0], [10.5, 2.6]], { tone: "mid" }, { owner: "psv.body" });
disc("psv.cap", ZA(svB), 10.5, 13, 1.7, { tone: "mid" }, { owner: "psv.bonnet" });
const svE = addv(svB, YD, 7.5);
// la descarga va de lado, en piezas torneadas: tramo, codo y chimenea de venteo
disc("psv.out", G.frameAlong(svB, YD), entry(4, 1.8), 7.5 - entry(2.8, 1.8), 1.8, { tone: "hi" }, { owner: "psv.body" });
ball("psv.elbow", svE, 2.8, { tone: "mid" }, { owner: "psv.out" });
disc("psv.vent", ZA(svE), entry(2.8, 1.8), 15, 1.8, { tone: "hi" }, { owner: "psv.elbow" });
// manómetro del tambor, sobre la cabeza
const PIp = [8, -21];
const piPad = pad("pi.pad", SHELL, onTop(...PIp), ZD3, 1.4, 2.0, {}, { owner: "drum.shell" });
disc("pi.stem", ZA(piPad.face), 0, 9, 0.6, { tone: "mid" }, { owner: "pi.pad" });
const PID = dial("pdrum", addv(piPad.face, ZD3, 9 + 4.6 + 0.12), facing([0, 0, 0], 0), 4.6, { live: "pdrum", owner: "pi.stem", red: 0.2 });
// visor de nivel: dos tomas por −y, válvulas en esfera y el tubo de vidrio entre ellas
const LGy = LG.y, lgZ = [LG.z0, LG.z1];
lgZ.forEach((z, i) => {
  const lp = pad(`lg.pad${i}`, SHELL, [0, -RO, z], [0, -1, 0], 1.5, 2.0, {}, { owner: "drum.shell" });
  pipe(`lg.tap${i}`, [lp.face, [0, LGy, z]], 1.0, { balls: [{ name: `lg.valve${i}`, c: [0, LGy, z], R: 3.3, at: "end" }] });
});
const LG0 = LG.z0 + entry(3.3, 1.1), LG1 = LG.z1 - entry(3.3, 1.1);
disc("lg.glass", ZA([0, LGy, LG0]), 0, LG1 - LG0, 1.1, { tone: "hi" }, { cls: "fl-glass" });
disc("lg.drain", ZA([0, LGy, LG.z0]), -7.5, -entry(3.3, 0.5), 0.5, { tone: "mid" }, { owner: "lg.valve0" });
// salida de líquido por el fondo, a la válvula de control de nivel
const oPad = pad("liq.pad", SHELL, [OUT.x, OUT.y, botOut(Math.hypot(OUT.x, OUT.y))], [0, 0, -1], OUT.r + 0.7, 2.0, {}, { owner: "drum.shell" });
const LCV = [OUT.lcv, OUT.y, OUT.z];
const lcv = controlValve("lcv", LCV, XD, { R: 4.8, r: OUT.r });
pipe("lcv.line", [oPad.face, [OUT.x, OUT.y, OUT.z], [OUT.x1, OUT.y, OUT.z]], OUT.r, { bend: 2.6, flanges: [true, true], open: [false, true], balls: [{ name: "lcv.body", c: LCV, R: 4.8, shared: true }], collars: [{ c: addv(LCV, XD, 5.8), half: 0.7 }, { c: addv(LCV, XD, -5.8), half: 0.7 }] });
[5.8, -5.8].forEach((dx, i) => disc(`lcv.fl${i}`, G.frameAlong(addv(LCV, XD, dx), XD), -0.7, 0.7, OUT.r * 1.8, { tone: "mid" }, { owner: "lcv.line" }));

/* ====================================================================
   2 · la bomba centrífuga y su motor, sobre la bancada
   ==================================================================== */
const PX = TR.x, PZ = PU.z, Py = PU.y, Pw = PU.w;
box("stand.base", [PX - 17, PU.motor[1] - 6, 0], [PX + 17, Py + 12, 6], { tone: "lo" }, { r: 0.8, bevel: 0.6, extra: Dots([[PX - 14, PU.motor[1] - 3], [PX + 14, PU.motor[1] - 3], [PX - 14, Py + 9], [PX + 14, Py + 9]].map(([x, y]) => at([x, y, 6])), { size: 0.55 }) });
// la carcasa (voluta), su boca de succión y la de descarga
const VF = G.frameAlong([PX, Py - Pw / 2, PZ], YD);
const VOL = turned("pump.casing", VF, [[0, 9], [1.6, 13.2], [3, PU.R], [7, PU.R], [8.4, 13.2], [Pw, 9]], { tone: "mid" }, { rims: "all", extra: Dots(G.dotsOf(VF, Pw, 7.2, 8, P), { size: 0.4 }) });
const sucF = G.frameAlong([PX, Py + Pw / 2, PZ], YD);
turned("pump.suction", sucF, [[0, 4.6], [6, 3.8]], { tone: "mid" }, { owner: "pump.casing" });
disc("pump.sucfl", sucF, 6, 7.3, 6.8, { tone: "mid" }, { owner: "pump.suction", extra: Dots(G.dotsOf(sucF, 7.3, 5.4, 6, P), { size: 0.42 }) });
const dPad = pad("pump.dneck", VOL, [PX, Py, PZ + PU.R], ZD3, 3.6, 5.5, {}, { owner: "pump.casing" });
disc("pump.dfl", ZA(dPad.face), 0, 1.3, 6.4, { tone: "mid" }, { owner: "pump.dneck", extra: Dots(G.dotsOf(ZA(dPad.face), 1.3, 5.1, 6, P), { size: 0.42 }) });
box("pump.foot", [PX - 4, Py - 4, 6], [PX + 4, Py + 4, PZ - PU.R + 0.05], { tone: "mid" }, { r: 0.2, owner: "pump.casing" });
// soporte de cojinetes, acople con su guarda y motor de aletas
const BF = G.frameAlong([PX, Py - Pw / 2, PZ], [0, -1, 0]);
turned("pump.frame", BF, [[0, 7.2], [2, 6], [14, 5.6], [16, 6.6]], { tone: "mid" }, { owner: "pump.casing" });
box("pump.ffoot", [PX - 4, Py - Pw / 2 - 14, 6], [PX + 4, Py - Pw / 2 - 6, PZ - 5.6 + 0.05], { tone: "mid" }, { r: 0.2, owner: "pump.frame" });
const cpY = Py - Pw / 2 - 16;
box("pump.guard", [PX - 6.5, PU.motor[0], 6], [PX + 6.5, cpY, PZ + 8], { tone: "mid" }, { r: 0.6, bevel: 0.4, owner: "stand.base", extra: Ln([0.25, 0.5, 0.75].map((f) => { const y = PU.motor[0] + (cpY - PU.motor[0]) * f; return path3([[PX + 6.5, y, 6], [PX + 6.5, y, PZ + 8]]); }).join(""), { tone: "faint" }) });
const MF = G.frameAlong([PX, PU.motor[0], PZ], [0, -1, 0]), ML = PU.motor[0] - PU.motor[1];
turned("motor.bell", MF, [[0, 6.4], [1.6, 9.6], [3, 10.6]], { tone: "mid" }, { owner: "pump.guard" });
turned("motor.frame", MF, [[3, 10.6], [ML - 8, 10.6]], { tone: "mid" }, { owner: "motor.bell", extra: Ln(G.ribsOf(MF, 4.4, ML - 9.4, 10.62, 22, P, { least: 0.1, seams: true }), { tone: "faint" }) });
turned("motor.fan", MF, [[ML - 8, 10.2], [ML - 1.4, 10.2], [ML, 7]], { tone: "mid" }, { owner: "motor.frame", extra: Dots(G.dotsOf(MF, ML - 4.6, 10.22, 18, P, { least: 0.2 }), { size: 0.38 }) });
box("motor.tbox", [PX - 4.6, PU.motor[0] - 20, PZ + 10.4], [PX + 4.6, PU.motor[0] - 10, PZ + 17.5], { tone: "mid" }, { r: 0.5, bevel: 0.3, owner: "motor.frame" });
[PU.motor[0] - 9, PU.motor[1] + 6].forEach((y, i) => box(`motor.foot${i}`, [PX - 9, y - 3, 6], [PX + 9, y + 3, PZ - 10.6 + 0.05], { tone: "mid" }, { r: 0.3, owner: "motor.frame" }));
// succión: brida de llegada, válvula de compuerta con volante y el tramo a la bomba
const sv = [PX, Py + 26, PZ];
pipe("pump.sucline", [[PX, PU.suc, PZ], [PX, Py + Pw / 2 + 7.3, PZ]], 3.6, { flanges: [true, false], open: [true, false], balls: [{ name: "pump.sv.body", c: sv, R: 4.6 }] });
const SVK = wheel("pump.sv", sv, ZD3, 4.6);

/* ====================================================================
   3 · el intercambiador de tubos y coraza (vapor por la coraza), en alto sobre su estructura
   ==================================================================== */
const EF = G.frameAlong([PX, EX.y0, EX.z], YD), EL_ = EX.y1 - EX.y0;
const EXS = turned("hx.shell", EF, [[0, EX.R], [EL_, EX.R]], { tone: "mid" }, { extra: Ln(G.arcOf(EF, EL_ / 2, EX.R, P), { tone: "faint" }) });
ring("hx.ffl0", EF, EL_, EL_ + 1.4, EX.R - 0.6, EX.R + 3.8, { tone: "mid" }, { owner: "hx.shell" });
ring("hx.ffl1", EF, EL_ + 1.4, EL_ + 2.8, EX.R - 0.6, EX.R + 3.8, { tone: "mid" }, { owner: "hx.ffl0", extra: Dots(G.dotsOf(EF, EL_ + 2.8, EX.R + 2.2, 14, P), { size: 0.42 }) });
const chan = (s0, L, d) => { const pts = [[s0, EX.R], [s0 + L, EX.R]]; for (let i = 1; i <= 10; i++) { const a = (Math.PI / 2) * (i / 10); pts.push([s0 + L + d * Math.sin(a), Math.max(2.2, EX.R * Math.cos(a)), 1]); } pts[pts.length - 1][2] = 0; return pts; };
const FCH = turned("hx.chan", EF, chan(EL_ + 2.8, 15, 6.5), { tone: "mid" }, { owner: "hx.ffl1" });
const inY = EX.y1 + 2.8 + 8.5;
const inPadEx = pad("hx.in", FCH, [PX, inY, EX.z + EX.R], ZD3, 3.6, 2.4, {}, { owner: "hx.chan" });
disc("hx.infl", ZA(inPadEx.face), 0, 1.2, 6.2, { tone: "mid" }, { owner: "hx.in" });
const RF = G.frameAlong([PX, EX.y0, EX.z], [0, -1, 0]);
ring("hx.rfl0", RF, 0, 1.4, EX.R - 0.6, EX.R + 3.8, { tone: "mid" }, { owner: "hx.shell" });
ring("hx.rfl1", RF, 1.4, 2.8, EX.R - 0.6, EX.R + 3.8, { tone: "mid" }, { owner: "hx.rfl0", extra: Dots(G.dotsOf(RF, 2.8, EX.R + 2.2, 14, P), { size: 0.42 }) });
const RCH = turned("hx.rear", RF, chan(2.8, 8, 6.5), { tone: "mid" }, { owner: "hx.rfl1" });
const outPadEx = pad("hx.out", RCH, [PX, EX.y0 - 2.8 - 14.5 + 0.2, EX.z], [0, -1, 0], 3.6, 2.4, {}, { owner: "hx.rear" });
disc("hx.outfl", G.frameAlong(outPadEx.face, [0, -1, 0]), 0, 1.2, 6.2, { tone: "mid" }, { owner: "hx.out" });
// la estructura: dos pórticos (patas, viga y silleta cóncava que abraza la coraza) y largueros entre ellos
const BEAM = EX.beam, SAD = EX.z - EX.R;
EX.bents.forEach((y, i) => {
  [-1, 1].forEach((sg, j) => {
    const x = PX + sg * 13;
    box(`stand.hleg${i}${j}`, [x - 1.6, y - 1.6, 0.9], [x + 1.6, y + 1.6, BEAM], { tone: "lo" }, { r: 0.1 });
    box(`stand.hplate${i}${j}`, [x - 3.6, y - 3.6, 0], [x + 3.6, y + 3.6, 0.9], { tone: "lo" }, { r: 0.3, extra: Dots([at([x - 2.6, y - 2.6, 0.9]), at([x + 2.6, y + 2.6, 0.9])], { size: 0.4 }) });
  });
  box(`stand.hbeam${i}`, [PX - 16, y - 2.6, BEAM], [PX + 16, y + 2.6, BEAM + 4.4], { tone: "lo" }, { r: 0.2 });
  const top = EX.z - Math.sqrt(EX.R ** 2 - 121), sec = [[-11, BEAM + 4.4], [11, BEAM + 4.4], [11, top]];
  for (let jj = 1; jj < 16; jj++) { const xx = 11 - (22 * jj) / 16; sec.push([xx, EX.z - Math.sqrt(EX.R ** 2 - xx * xx)]); }
  sec.push([-11, top]);
  fp(`stand.saddle${i}`, { o: [PX, y, 0], a: YD, u: XD, v: ZD3 }, sec, -2.4, 2.4, { tone: "lo" }, { owner: "hx.shell" });
});
[-1, 1].forEach((sg, j) => box(`stand.htie${j}`, [PX + sg * 13 - 1.4, EX.bents[0] + 1.6, 58], [PX + sg * 13 + 1.4, EX.bents[1] - 1.6, 61], { tone: "lo" }, { r: 0.1 }));
// vapor de servicio: baja por la válvula de globo y su manómetro hasta la boquilla de arriba de la coraza
const stY = EX.y0 + 22;
const stPad = pad("steam.nozzle", EXS, [PX, stY, EX.z + EX.R], ZD3, 3.4, 3.0, {}, { owner: "hx.shell" });
const stV = [PX, stY, EX.z + 40], stT = [PX, stY, EX.z + 28], stN = facing(XD, 0);
pipe("steam", [[PX - 52, stY, EX.z + 60], [PX, stY, EX.z + 60], addv(stPad.face, ZD3, 0)], 2.6, { bend: 3, flanges: [true, true], open: [true, false], balls: [{ name: "steam.valve.body", c: stV, R: 4.2 }, { name: "steam.tee", c: stT, R: 3.7, bores: [{ owner: "steam.gstem", dir: stN, r: 0.55 }] }] });
const STK = wheel("steam.valve", stV, YD, 4.2);
disc("steam.gstem", G.frameAlong(stT, stN), entry(3.7, 0.55), 6.5, 0.55, { tone: "mid" }, { owner: "steam.tee" });
const STD = dial("psteam", addv(stT, stN, 6.5 + 1.6), stN, 3.6, { live: "psteam", ticks: 7, owner: "steam.gstem" });
// condensado: de la boquilla de abajo, a la trampa y al sumidero
const CY = EX.y1 - 7;
const coPad = pad("cond.nozzle", EXS, [PX, CY, EX.z - EX.R], [0, 0, -1], 2.2, 2.6, {}, { owner: "hx.shell" });
pipe("cond", [coPad.face, [PX, CY, 104]], 1.2, {});
turned("cond.trap", ZA([PX, CY, 96]), [[0, 1.6], [1, 3.4], [7, 3.4], [8, 1.6]], { tone: "mid" }, { rims: "all" });
pipe("cond.down", [[PX, CY, 96], [PX, CY, 4.6]], 1.2, {});
turned("stand.cdrain", ZA([PX, CY, 0]), [[0, 3.4], [1.4, 3.4], [4.6, 1.4]], { tone: "lo" });
// descarga de la bomba: sube hasta la altura del intercambiador y entra por la boquilla del cabezal
const p1T = [PX, Py, 96], p1N = facing(XD, 0);
const fEl = [PX, inY, EX.z + 34];
pipe("feed", [addv(dPad.face, ZD3, 1.3), [PX, Py, EX.z + 34], fEl], 3, { bend: 3, balls: [{ name: "p1.tee", c: p1T, R: 4.6, bores: [{ owner: "p1.stem", dir: p1N, r: 0.6 }] }, { name: "feed.elbow", c: fEl, R: 4.4, at: "end" }] });
pipe("feed.drop", [fEl, addv(inPadEx.face, ZD3, 1.2)], 3, { flanges: [false, true], flangeR: 2.07, balls: [{ name: "feed.elbow", c: fEl, R: 4.4, shared: true, at: "start" }] });
disc("p1.stem", G.frameAlong(p1T, p1N), entry(4.6, 0.6), 7, 0.6, { tone: "mid" }, { owner: "p1.tee" });
const P1D = dial("p1", addv(p1T, p1N, 7 + 1.6), p1N, 4.4, { live: "p1", owner: "p1.stem", red: 0.2 });

/* ====================================================================
   4 · de la salida del intercambiador a la válvula de expansión y al tambor
   ==================================================================== */
const ROUT = addv(outPadEx.face, [0, -1, 0], 1.2);
const tfT = [PX, ROUT[1] - 6.2, EX.z], tfN = G.unit3([1, -0.25, 0.05]);
const VAV = [VA.x, 0, IN.z], SGL = [VA.sight, 0, IN.z];
const fv = controlValve("fcv", VAV, XD, { R: 5.4, r: 3.2 });
const nk = pad("drum.in.neck0", SHELL, [-RO, 0, IN.z], [-1, 0, 0], IN.r + 0.6, 1.4, {}, { owner: "drum.shell" });
pipe("drum.in.neck", [nk.face, [IN.x1, 0, IN.z]], IN.r, { flanges: [false, true], flangeR: 1.75 });
pipe("fcv.line", [ROUT, [PX, 0, IN.z], [IN.x1, 0, IN.z]], 3.2, { bend: 3, flanges: [false, true], flangeR: 2.3, balls: [{ name: "fcv.body", c: VAV, R: 5.4, shared: true }, { name: "tf.tee", c: tfT, R: 5.0, bores: [{ owner: "tf.stem", dir: tfN, r: 0.6 }] }], collars: [{ c: addv(VAV, XD, 6.4), half: 0.7 }, { c: addv(VAV, XD, -6.4), half: 0.7 }, { c: SGL, half: 6.4 }] });
[6.4, -6.4].forEach((dx, i) => disc(`fcv.fl${i}`, G.frameAlong(addv(VAV, XD, dx), XD), -0.7, 0.7, 5.8, { tone: "mid" }, { owner: "fcv.line" }));
disc("tf.stem", G.frameAlong(tfT, tfN), entry(5.0, 0.6), 7.6, 0.6, { tone: "mid" }, { owner: "tf.tee" });
const TFD = dial("tf", addv(tfT, tfN, 7.6 + 1.6), tfN, 4.2, { live: "tf", owner: "tf.stem" });
// mirilla de flujo: cuerpo entre bridas y una ventana redonda del lado del lector
const SGF = G.frameAlong(SGL, XD);
const SGB = turned("sight.body", SGF, [[-6.4, 5.6], [-5, 5.6], [-5, 4.6], [5, 4.6], [5, 5.6], [6.4, 5.6]], { tone: "mid" }, { owner: "fcv.line", extra: Dots([...G.dotsOf(SGF, 6.4, 4.9, 6, P), ...G.dotsOf(SGF, -6.4, 4.9, 6, P)], { size: 0.4 }) });
const sgN = [0, 1, 0];
const sgPad = pad("sight.boss", SGB, [SGL[0], 4.6, SGL[2]], sgN, 3.8, 0.9, {}, { owner: "sight.body" });
const sgF = G.frameAlong(sgPad.face, sgN), SGR = 3.0;
const sgGlass = `<g class="fl-glass">${S(G.disc(0.2, 0.7, SGR - 0.1, sgF, P), { tone: "hi" })}</g>`;
ring("sight.glass", sgF, 0, 0.7, SGR - 0.1, SGR + 1.1, { tone: "mid" }, { owner: "sight.boss", extra: Dots(G.dotsOf(sgF, 0.7, SGR + 0.55, 6, P, { all: true }), { size: 0.36 }) + sgGlass });
const SGM = planeM(G.add3(sgPad.face, G.mul3(sgN, 0.72)), [1, 0, 0], [0, 0, -1]);

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const idx = (name) => R_.items.findIndex((it) => it.name === name);
const lastOf = (prefix) => { let best = -1; R_.items.forEach((it, i) => { if (it.name === prefix || it.name.startsWith(prefix + ":") || it.name.startsWith(prefix + ".")) best = Math.max(best, i); }); return best; };
const after = new Map();
const slotAt = (i, html) => { if (i < 0) throw new Error("no slot"); after.set(i, (after.get(i) || "") + html); };
const slot = (name, html) => slotAt(idx(name), html);
// lo vivo del tambor: el líquido, la niebla y las gotas debajo de la malla, y el vapor encima
slotAt(Math.max(idx("drum.shell"), lastOf("drum.vb"), idx("drum.tw.in"), idx("drum.tw.rod")), `<g data-live="liq"></g>`);
slotAt(Math.max(idx("drum.shell"), lastOf("drum.vb"), lastOf("drum.tw"), idx("drum.plate"), lastOf("drum.strap0"), lastOf("drum.strap1"), lastOf("drum.strap2"), lastOf("drum.strap3"), lastOf("drum.in.pipe"), idx("drum.dem.ring")), `<g data-live="mist"></g>`);
slotAt(Math.max(idx("drum.dem"), idx("drum.shell")), `<g data-live="gas"></g>`);
slot("lg.glass", `<g data-live="lcol"></g>`);
slot("sight.glass", `<clipPath id="flSgClip"><circle r="${(SGR - 0.25).toFixed(2)}"/></clipPath><g transform="${SGM}"><g clip-path="url(#flSgClip)"><g data-live="sight"></g></g><circle class="fl-glint" r="${(SGR - 0.25).toFixed(2)}"/></g>`);
slot("tdrum.bezel", TDD.html); slot("pdrum.bezel", PID.html); slot("p1.bezel", P1D.html); slot("tf.bezel", TFD.html); slot("psteam.bezel", STD.html);
slot("pump.sv.wheel", Ln(SVK, { tone: "hi" }));
slot("steam.valve.wheel", Ln(STK, { tone: "hi" }));
[["pcv", pcv], ["lcv", lcv], ["fcv", fv]].forEach(([n, v]) => slotAt(Math.max(idx(`${n}.yoke0`), idx(`${n}.yoke1`), idx(`${n}.stem`)), Ln(v.ticks, { tone: "mid" }) + `<g data-live="${n}"></g>`));
const pickOf = (nm) => /^(pump|motor|stand\.base|p1|feed)/.test(nm) ? "pump" : /^(hx|steam|cond|stand\.(saddle|h|cdrain)|psteam)/.test(nm) ? "hx" : /^(fcv|sight|tf)/.test(nm) ? "valve" : /^drum\.dem/.test(nm) ? "demist" : "drum";
const groups = R_.items.map((item, index) => `<g class="it" data-name="${item.name}" data-pick="${pickOf(item.name)}">${item.svg}${after.get(index) ?? ""}</g>`);
const svg = k.figureSvg({ width: W, height: H, label: "Sistema de destilación flash: bomba centrífuga, intercambiador de tubos y coraza con vapor, válvula de expansión con mirilla de flujo y tambor flash en corte con deflector de entrada, malla eliminadora de niebla, rompe-vórtice, visor de nivel y válvulas de control de presión y de nivel", body: [`<g class="fl-items">${groups.join("")}</g>`] });
const live3 = (v) => ({ stem: v.stem, nrm: v.nrm, z0: v.z0, z1: v.z1 });
const DATA = { P, W, H, AZ, EL, T, HV, SGR, DIAM: (2 * R) / 100, HOLD: GEO.holdup(DR.lev), LG: { y: LGy, z0: LG0, z1: LG1 }, PCV: live3(pcv), LCV: live3(lcv), FCV: live3(fv) };
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "flash_data.json"), JSON.stringify(DATA));
writeFileSync(join(HERE, "out", "fig.svg"), svg.replace("<svg ", '<svg id="flSvg" '));
writeFileSync(join(HERE, "out", "fig.js"), bundle(JSON.stringify(DATA)));
writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "fl.css"), "utf8"));
writeFileSync(join(HERE, "preview.html"), preview(svg.replace("<svg ", '<svg id="flSvg" ')));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
if (!FAST) A.auditOrExit(R_, P, {});
