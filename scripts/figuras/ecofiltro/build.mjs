/* ====================================================================
   El ecofiltro en isométrico (skill anatomy), para la pestaña «Por
   dentro» del Explorador del ecofiltro.
   Concepto: el biopercolador E-101 de una central hidroeléctrica
   colombiana. El ventilador V-101 saca el gas del tanque de aquietamiento
   por el demister D-101 y lo empuja por debajo del lecho; el gas sube por
   6 m de empaque estructurado mojado y sale por arriba, por el demister
   D-102, hacia el tanque de adsorción. El riego cae de los aspersores,
   se junta en el fondo, baja por un sello hidráulico al TK-103 y la bomba
   sumergible PS-101 lo devuelve arriba. En la película de líquido el H₂S
   se disuelve y la biopelícula lo oxida.
   Lo que se mueve sale del modelo del explorador: el caudal y la
   frecuencia del ventilador, el perfil de H₂S a lo largo del lecho, el
   consumo local de la biopelícula, el riego, la fracción mojada, el pH
   y las lecturas de los analizadores.
   Corte: la torre va abierta por el plano vertical de su eje que mira al
   lector; el resto va entero, detrás de ese plano.
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
const bundle = (data) => "/* ecofiltro en isométrico: generado por build.mjs */\nvar EC_DATA = " + data + ";\nvar FEco = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FEco;\n})();\n";
const preview = (svg) => k.pageHtml({ title: "Ecofiltro", theme: "light", width: 980, body: `<style>${readFileSync(join(HERE, "ec.css"), "utf8")}</style><div class="iso-stage" id="ecFig">${svg}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + readFileSync(join(HERE, "drive_test.js"), "utf8") });
if (process.argv.includes("--js")) {
  writeFileSync(join(HERE, "out", "fig.js"), bundle(readFileSync(join(HERE, "eco_data.json"), "utf8")));
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "ec.css"), "utf8"));
  writeFileSync(join(HERE, "preview.html"), preview(readFileSync(join(HERE, "out", "fig.svg"), "utf8")));
  console.log("out/fig.js, out/fig.css, preview.html"); process.exit(0);
}
const FX = GEO.FX, W = 900, H = 820, AZ = FX.AZ, EL = FX.EL;
const { T, HV } = GEO.axesOf(AZ);
const TH = (t, h, z) => GEO.TH(t, h, z, AZ);
const COL = FX.COL, IN = FX.IN, BED = FX.BED, SP = FX.SPRAY, MI = FX.MIST, OUT = FX.OUT, D1 = FX.D1, D2 = FX.D2, FAN = FX.FAN, TK = FX.TK, RIS = FX.RIS, LIQ = FX.LIQ, HDR = FX.HDR, SUC = FX.SUC;

const EXT = [[-1010, -150, 120], [-930, -200, 0], [-930, -100, 0], [-880, -150, 340], [-700, 90, 0], [-430, 110, 0], [0, -170, 0], [TH(160, 0, 0)[0], TH(160, 0, 0)[1], 0], [TH(-160, 0, 0)[0], TH(-160, 0, 0)[1], 0],
  [0, -60, D2.z1 + D2.hd + 30], [500, -60, 1200], [500, -470, 0], [480, -494, 220], [136, -560, 0], [0, 0, 1090], [TH(160, 0, 1030)[0], TH(160, 0, 1030)[1], 1030]];
const P = k.fitProjection(EXT, W, H, { pad: 10, azimuth: AZ, elevation: EL });
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
    disc(`${name}.flange${index}`, G.frameAlong(centre, tangent), -thick / 2, thick / 2, r * flangeR, { tone: "mid" }, { owner: name, cls, extra: Dots(G.dotsOf(G.frameAlong(centre, tangent), thick / 2 * sign, r * (flangeR + 1) / 2, 8, P, { all: false, least: 0.05 }), { size: 0.4 }) });
  });
  const nearest = (c) => { let best = 0, bd = 1e9; for (let q = 0; q <= total; q += 0.25) { const d = G.len3(G.sub3(G.pointAlong(line, q), c)); if (d < bd) { bd = d; best = q; } } return best; };
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
const NT = G.mul3(T, -1), NHV = G.mul3(HV, -1);
const D2R = Math.PI / 180;
function planeM(c, e1, e2) {
  const o = at(c), a = at(G.add3(c, e1)), b = at(G.add3(c, e2));
  return `matrix(${(a[0] - o[0]).toFixed(4)} ${(a[1] - o[1]).toFixed(4)} ${(b[0] - o[0]).toFixed(4)} ${(b[1] - o[1]).toFixed(4)} ${o[0].toFixed(3)} ${o[1].toFixed(3)})`;
}
function faceBasis(n) { const e1 = G.unit3(G.cross3(ZD3, n)); return { e1, e2: G.unit3(G.cross3(n, e1)) }; }
// un manómetro de esfera: caja, bisel, escala y aguja (viva)
function dial(name, c, n, r, { live, ticks = 9, owner, red = 0 } = {}) {
  const F = G.frameAlong(c, n);
  disc(`${name}.case`, F, -2.4, 0, r, { tone: "mid" }, { owner });
  ring(`${name}.bezel`, F, 0, 0.5, r - 0.8, r, { tone: "hi" }, { owner: `${name}.case` });
  const { e1, e2 } = faceBasis(n), face = G.add3(c, G.mul3(n, 0.52)), M = planeM(face, e1, e2);
  let tk = "";
  for (let i = 0; i < ticks; i++) { const t = (225 - (270 * i) / (ticks - 1)) * D2R, r0 = r - 2.1, r1 = r - (i % 2 ? 1.5 : 1.15); tk += `M${(r0 * Math.cos(t)).toFixed(2)} ${(r0 * Math.sin(t)).toFixed(2)}L${(r1 * Math.cos(t)).toFixed(2)} ${(r1 * Math.sin(t)).toFixed(2)}`; }
  let arc = "";
  if (red) { const a0 = (225 - 270 * (1 - red)) * D2R, a1 = -45 * D2R, rr = r - 1.8; arc = `<path class="ec-redarc" d="M${(rr * Math.cos(a0)).toFixed(2)} ${(rr * Math.sin(a0)).toFixed(2)}A${rr} ${rr} 0 0 1 ${(rr * Math.cos(a1)).toFixed(2)} ${(rr * Math.sin(a1)).toFixed(2)}"/>`; }
  return { M, html: `<g class="ec-dial" transform="${M}">${arc}<path class="ec-tick" d="${tk}"/><g data-live="${live}"><path class="ec-needle" d="M-1.3 0L${(r - 2.3).toFixed(2)} 0"/></g><circle class="ec-hub" r="0.8"/></g>` };
}
// el volante de una válvula de mano: bonete desde la superficie del cuerpo y rueda con sus radios
function wheel(name, c, up, R, rw = 4.2) {
  const top = G.add3(c, G.mul3(up, R + 2.8));
  disc(`${name}.bonnet`, G.frameAlong(c, up), entry(R, 1.0), R + 2.8, 1.0, { tone: "mid" }, { owner: `${name}.body` });
  const HW = G.frameAlong(top, up);
  ring(`${name}.wheel`, HW, 0, 0.6, 0.8, rw, { tone: "hi" }, { owner: `${name}.bonnet` });
  return [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2 + 0.4; return path3([G.pointOf(HW, 0.6, 1.0, a), G.pointOf(HW, 0.6, rw - 0.75, a)]); }).join("") + G.arcOf(HW, 0.6, rw - 0.65, P, { least: -1 });
}
// una pantalla en una cara: el marco de la caja y la ventana; el texto lo escribe la página
function screenOn(c, n, w, h) {
  const { e1, e2 } = faceBasis(n);
  return { M: planeM(c, e1, e2), w, h };
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
   1 · la torre E-101 en corte: pedestal, cuerpo, fondo plano y cabeza superior
   ==================================================================== */
const R = COL.R, TW = COL.TW, Z0 = COL.z0, Z1 = COL.z1, HD = COL.hd, RO = R + TW, HO = HD + TW, ZB = COL.base;
const DF = ZA([0, 0, 0]);
const ell = (zc, rr, hh, a) => [zc + hh * Math.sin(a), rr * Math.cos(a)];
const merid = [[ZB, 0], [ZB, RO], [Z1, RO]];
for (let i = 1; i <= 14; i++) merid.push(ell(Z1, RO, HO, (Math.PI / 2) * (i / 14)));
for (let i = 14; i >= 0; i--) merid.push(ell(Z1, R, HD, (Math.PI / 2) * (i / 14)));
merid.push([Z0, R], [Z0, 0]);
const FRONT = A.orientedBox([HV[0] * 600, HV[1] * 600, 500], [T, HV, ZD3], [600, 600, 700]);
const SHELL = record(A.body(DF, merid, { name: "col.shell", cut: [FRONT] }));
const topOut = (r) => Z1 + GEO.headDepth(r, RO, HO), topIn = (r) => Z1 + GEO.headDepth(r, R, HD);
// las caras de un cuerpo de revolución (el interior del corte o la cúpula exterior), sombreadas como las del kit
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const rad = (th) => [Math.cos(th) * T[0] + Math.sin(th) * HV[0], Math.cos(th) * T[1] + Math.sin(th) * HV[1], 0];
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + (Math.round(x * 10) / 10) + " " + (Math.round(y * 10) / 10)).join("") + "Z";
function cylinder(rr, sg, nt, za, zb, out) {
  let run = null;
  const flush = (t1) => { if (run && run.band >= 0) { const P3 = (t, z) => addv([0, 0, z], rad(t), rr), d = pth1([P3(run.t0, za), P3(t1, za), P3(t1, zb), P3(run.t0, zb)].map((p) => C.pr(...p))); out.by[run.band].push(d); out.fill.push(d); } run = null; };
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
const floorPoly = () => { const pts = []; for (let i = 0; i <= 48; i++) pts.push(addv([0, 0, Z0], rad(Math.PI + (Math.PI * i) / 48), R)); return pth1(pts.map((p) => C.pr(...p))); };
const cavity = toned((o) => { cylinder(R, -1, 260, Z0, Z1, o); surface(headP(R, HD, Z1, 1), headN(R, HD, 1, -1), 48, 10, o); const f = floorPoly(); o.by[4].push(f); o.fill.push(f); });
const dome = toned((o) => surface(headP(RO, HO, Z1, 1), headN(RO, HO, 1, 1), 72, 16, o));
const secIn = GEO.cavity().map(([u, z]) => C.pr(T[0] * u, T[1] * u, z));
const silh = [];
for (let i = 0; i <= 48; i++) { const th = Math.PI + (Math.PI * i) / 48, a = Math.atan(-(HO / RO) * Math.sin(th) * Math.cos(EL * D2R) / Math.sin(EL * D2R)); silh.push(addv([0, 0, Z1 + HO * Math.sin(a)], rad(th), RO * Math.cos(a))); }
const crest = []; for (let i = 0; i <= 36; i++) { const u = RO - (2 * RO * i) / 36; crest.push([T[0] * u, T[1] * u, topOut(Math.abs(u))]); }
const domeReg = [...silh, ...crest].map((p) => C.pr(...p));
// juntas de laminado del cuerpo de fibra de vidrio, por dentro: anillos cada 2 m y la junta vertical de atrás
const seamArc = (z) => { const pts = []; for (let i = 0; i <= 48; i++) pts.push(addv([0, 0, z], rad(Math.PI + (Math.PI * i) / 48), R - 0.02)); return path3(pts); };
const seams = [Z0 + 0.4, 220, 420, 620, 820, Z1].map(seamArc).join("") + path3([addv([0, 0, Z0], rad(1.5 * Math.PI), R - 0.02), addv([0, 0, Z1], rad(1.5 * Math.PI), R - 0.02)]);
const shellSvg = `<clipPath id="ecCavClip"><path d="${pth(secIn)}"/></clipPath>`
  + `<g class="iso-solid ec-cav" clip-path="url(#ecCavClip)">${cavity}${Ln(seams, { tone: "faint" })}</g>`;
const domeSvg = `<clipPath id="ecDomeClip"><path d="${pth(domeReg)}"/></clipPath><g class="iso-solid" clip-path="url(#ecDomeClip)">${dome}</g>${Ln(path3(silh), { tone: "mid" })}`;
// el pedestal de concreto con sus pernos de anclaje (también abierto por el corte)
const PLR = R + COL.TW + 18;
const anchors = []; for (let i = 0; i < 12; i++) { const th = Math.PI + (Math.PI * (i + 0.5)) / 12; anchors.push(at(addv([0, 0, ZB], rad(th), R + COL.TW + 9))); }
fp("stand.plinth", CUT([0, 0, 0]), half(0, PLR, 64), 0, ZB, { tone: "lo" }, { cls: "ec-concrete", extra: Dots(anchors, { size: 0.9, tone: "mid" }) });
put("col.shell", [0, -R * 0.6, (Z0 + Z1) / 2], shellSvg, [SHELL]);
put("col.dome", [0, -R * 0.4, Z1 + HD * 0.7], domeSvg, [SHELL]);
// la pared y el fondo cortados, al frente: una «C» por costado en el plano de corte
const CF = { o: [0, 0, 0], a: G.mul3(HV, -1), u: T, v: ZD3 };
fp("col.cut.l", CF, GEO.wallCut(-1), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "ec-cutface", owner: "col.shell" });
fp("col.cut.r", CF, GEO.wallCut(1), 0, 0.5, { tone: "mid" }, { cap: "only", cls: "ec-cutface", owner: "col.shell" });

/* ====================================================================
   2 · por dentro: entrada de gas, rejilla, lecho, sujeción, aspersores y eliminador de niebla
   ==================================================================== */
// la entrada de gas por la izquierda: boquilla con asiento por fuera y un tramo hacia adentro que descarga hacia abajo
const inPad = pad("col.in.pad", SHELL, [-RO, 0, IN.z], [-1, 0, 0], IN.r + 1.2, 16, {}, { owner: "col.shell" });
const inIn = pad("col.in.stub", SHELL, [-R, 0, IN.z], XD, IN.r, 1.2, {}, { owner: "col.shell", from: -1 });
pipe("col.in.pipe", [inIn.face, [-R + 44, 0, IN.z], [-R + 44, 0, IN.z - 46]], IN.r, { bend: 2.4, open: [false, true] });
// vigas de soporte en I, perpendiculares al corte: el plano las corta y muestra su perfil; la parrilla va encima
const GR = FX.GRID;
const IB = [[-6, 0], [6, 0], [6, 2], [0.8, 2], [0.8, 15], [6, 15], [6, 17], [-6, 17], [-6, 15], [-0.8, 15], [-0.8, 2], [-6, 2]].map(([u, z]) => [u, GR.z0 + z]);
[-96, -32, 32, 96].forEach((uc, i) => { const back = -Math.sqrt(R * R - (Math.abs(uc) + 6) ** 2) + 0.03; fp(`grid.beam${i}`, { o: TH(uc, 0, 0), a: HV, u: T, v: ZD3 }, IB, back, 0, { tone: "lo" }, {}); });
const gratingTex = (() => { const out = []; const z = GR.z1; for (let u = -R + 8; u < R - 4; u += 8) { const vv = -Math.sqrt(R * R - u * u) + 0.6; out.push(path3([[T[0] * u, T[1] * u, z], addv([T[0] * u, T[1] * u, z], HV, vv)])); } return out.join(""); })();
fp("grid.plate", CUT([0, 0, 0]), half(0, R - 0.3, 64), GR.z1 - 3, GR.z1, { tone: "lo" }, { extra: Ln(gratingTex, { tone: "faint" }) });
// el lecho: capas de empaque estructurado, cada una girada 90° respecto a la de abajo
const LAYER_POLY = [];
for (let i = 0; i < BED.layers; i++) {
  const [za, zb] = GEO.layerZ(i), ru = R - 0.3, out = [];
  if (i % 2 === 0) { // láminas paralelas al corte: se ven las corrugaciones cruzadas
    for (let c = -ru - (zb - za); c < ru; c += 7) for (const sg of [1, -1]) {
      let a = [c, za], b = [c + (zb - za), zb]; if (sg < 0) { a = [c + (zb - za), za]; b = [c, zb]; }
      let A0 = a[0] < b[0] ? a : b, B0 = a[0] < b[0] ? b : a; const lp = (p, q, u) => [u, p[1] + ((q[1] - p[1]) * (u - p[0])) / (q[0] - p[0])];
      if (B0[0] < -ru || A0[0] > ru) continue; if (A0[0] < -ru) A0 = lp(A0, B0, -ru); if (B0[0] > ru) B0 = lp(A0, B0, ru);
      out.push(path3([[T[0] * A0[0], T[1] * A0[0], A0[1]], [T[0] * B0[0], T[1] * B0[0], B0[1]]]));
    }
  } else { // láminas perpendiculares: se ven de canto
    for (let u = -ru + 4.5; u < ru; u += 5) out.push(path3([[T[0] * u, T[1] * u, za], [T[0] * u, T[1] * u, zb]]));
  }
  let topTex = "";
  if (i === BED.layers - 1) { const o2 = []; for (let u = -ru + 5; u < ru; u += 5) { const vv = -Math.sqrt(ru * ru - u * u); o2.push(path3([[T[0] * u, T[1] * u, zb], addv([T[0] * u, T[1] * u, zb], HV, vv)])); } topTex = Ln(o2.join(""), { tone: "faint" }); }
  fp(`bed.L${i}`, CUT([0, 0, 0]), half(0, ru, 64), za, zb, { tone: "mid" }, { cls: "ec-pack", extra: `<g class="ec-packtex">${Ln(out.join(""), { tone: "lo" })}</g>${topTex}` });
  LAYER_POLY.push([[-ru, za], [ru, za], [ru, zb], [-ru, zb]].map(([u, z]) => C.pr(T[0] * u, T[1] * u, z)));
}
// rejilla de sujeción sobre el lecho
const HO_ = FX.HOLD, holdTex = (() => { const o = []; for (let u = -R + 12; u < R - 6; u += 12) { const vv = -Math.sqrt((R - 0.3) ** 2 - u * u); o.push(path3([[T[0] * u, T[1] * u, HO_.z1], addv([T[0] * u, T[1] * u, HO_.z1], HV, vv)])); } for (let v = -12; v > -R + 6; v -= 12) { const uu = Math.sqrt((R - 0.3) ** 2 - v * v); o.push(path3([addv([0, 0, HO_.z1], HV, v), addv(addv([0, 0, HO_.z1], HV, v), T, -uu)].reverse()), path3([addv([0, 0, HO_.z1], HV, v), addv(addv([0, 0, HO_.z1], HV, v), T, uu)])); } return o.join(""); })();
fp("hold.grid", CUT([0, 0, 0]), half(0, R - 0.3, 64), HO_.z0, HO_.z1, { tone: "lo" }, { extra: Ln(holdTex, { tone: "lo" }) });
// el riego entra por la derecha: boquilla, cabezal a lo largo del corte y ramales con sus aspersores hacia el lector
const spPt = (rr) => TH(Math.sqrt(rr * rr - SP.h * SP.h), SP.h, SP.z);
const LD = G.unit3([spPt(RO)[0], spPt(RO)[1], 0]);
const spPad = pad("spray.pad", SHELL, spPt(RO), LD, 5.2, 14, {}, { owner: "col.shell" });
const spIn = pad("spray.stub", SHELL, spPt(R), NT, SP.r + 2.6, 6, {}, { owner: "col.shell", from: -1 });
const hdrEnd = -Math.sqrt(R * R - SP.h * SP.h) + 6;
const spSup = pad("spray.sup", SHELL, TH(-Math.sqrt(R * R - SP.h * SP.h), SP.h, SP.z), T, SP.r + 2.6, 6, {}, { owner: "col.shell", from: -1 });
pipe("spray.hdr", [spIn.face, spSup.face], SP.r, { balls: Array.from({ length: SP.n }, (_, i) => ({ name: `spray.tee${i}`, c: TH(GEO.nozzleU(i), SP.h, SP.z), R: SP.r + 1.2 })) });
const NOZ = [];
for (let i = 0; i < SP.n; i++) {
  const u = GEO.nozzleU(i), vEnd = -Math.sqrt(Math.max(0, (R - 10) ** 2 - u * u));
  const tee = TH(u, SP.h, SP.z);
  const lat = [TH(u, SP.h + SP.r + 0.3, SP.z), TH(u, -14, SP.z)];
  pipe(`spray.lat${i}`, [tee, TH(u, -12, SP.z)], 2, { open: [false, true], balls: [{ name: `spray.tee${i}`, c: tee, R: SP.r + 1.2, shared: true, at: "start" }] });
  disc(`spray.end${i}`, G.frameAlong(TH(u, -12, SP.z), HV), -0.2, 1.2, 2.5, { tone: "mid" }, { owner: `spray.lat${i}` });
  [-12 - 40, -12 - 12].concat(vEnd < -60 ? [] : []).forEach((v, j) => {
    const nz = TH(u, v + 6, SP.z);
    turned(`spray.noz${i}${j}`, ZA(nz), [[-2 - 6, 1.6], [-2 - 3, 1.6], [-2 - 2, 2.4], [-2, 2.4]], { tone: "hi" }, { owner: `spray.lat${i}` });
    NOZ.push({ i, j, u, v: v + 6, z: SP.z - 8 });
  });
}
// el eliminador de niebla: anillo soldado a la pared y la almohadilla de alambre encima
fp("mist.ring", CUT([0, 0, 0]), half(R - MI.ring, R), MI.z0 - 3, MI.z0, { tone: "mid" });
const MESH = (() => { const u0 = -(R - 0.3), u1 = R - 0.3, z0 = MI.z0, z1 = MI.z1, out = [], step = 3.2; for (let c = u0 - (z1 - z0); c < u1; c += step) for (const s of [1, -1]) { let a = [c, z0], b = [c + (z1 - z0), z1]; if (s < 0) { a = [c + (z1 - z0), z0]; b = [c, z1]; } const lp = (p, q, u) => [u, p[1] + ((q[1] - p[1]) * (u - p[0])) / (q[0] - p[0])]; let A0 = a, B0 = b; if (A0[0] > B0[0]) [A0, B0] = [B0, A0]; if (B0[0] < u0 || A0[0] > u1) continue; if (A0[0] < u0) A0 = lp(A0, B0, u0); if (B0[0] > u1) B0 = lp(A0, B0, u1); out.push(path3([[T[0] * A0[0], T[1] * A0[0], A0[1]], [T[0] * B0[0], T[1] * B0[0], B0[1]]])); } return out.join(""); })();
fp("mist.pad", CUT([0, 0, 0]), half(0, R - 0.3, 64), MI.z0, MI.z1, { tone: "mid" }, { cls: "ec-mesh", extra: `<g class="ec-meshtex">${Ln(MESH, { tone: "lo" })}</g>` });


/* ====================================================================
   3 · el tren del gas: D-101, los ventiladores V-101 A y B y sus colectores
   ==================================================================== */
// D-101: recipiente vertical con cabezas 2:1 sobre tres patas
const vesselProfile = (z0, z1, Rv, hd) => {
  const pr = [];
  for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * (i / 10); pr.push([z0 + hd * Math.sin(a), Math.max(0.01, Rv * Math.cos(a)), i > 0 && i < 10 ? 1 : 0]); }
  pr.push([z1, Rv]);
  for (let i = 1; i <= 10; i++) { const a = (Math.PI / 2) * (i / 10); pr.push([z1 + hd * Math.sin(a), Math.max(0.01, Rv * Math.cos(a)), i < 10 ? 1 : 0]); }
  return pr;
};
const D1C = [D1.x, D1.y, 0];
const D1S = turned("d1.shell", ZA(D1C), vesselProfile(D1.z0, D1.z1, D1.R, D1.hd), { tone: "mid" }, { extra: Ln(G.arcOf(ZA(D1C), (D1.z0 + D1.z1) / 2 + 30, D1.R, P), { tone: "faint" }) });
[200, 320, 80].forEach((deg, i) => {
  const d = [Math.cos(deg * D2R), Math.sin(deg * D2R), 0], c = addv(D1C, d, D1.R + D1.legR);
  disc(`d1.leg${i}`, ZA([c[0], c[1], 1.2]), 0, D1.z0 + 20 - 1.2, D1.legR, { tone: "lo" }, { owner: "d1.shell" });
  box(`stand.d1plate${i}`, [c[0] - 6, c[1] - 6, 0], [c[0] + 6, c[1] + 6, 1.2], { tone: "lo" }, { r: 0.5, extra: Dots([at([c[0] - 4.5, c[1] - 4.5, 1.2]), at([c[0] + 4.5, c[1] + 4.5, 1.2])], { size: 0.5 }) });
});
// entrada por −x, desde el tanque de aquietamiento
const d1In = pad("d1.in", D1S, [D1.x - D1.R - 0.6, D1.y, 120], [-1, 0, 0], SUC.r + 1.2, 10, {}, { owner: "d1.shell" });
pipe("d1.inline", [d1In.face, [-1010, D1.y, 120]], SUC.r, { flanges: [true, false], open: [false, true] });
// purga del condensado por el fondo, a una olla de sello
const d1Dr = pad("d1.drain", D1S, [D1.x, D1.y, D1.z0 - D1.hd], [0, 0, -1], 2.6, 3, {}, { owner: "d1.shell" });
pipe("d1.drline", [d1Dr.face, [D1.x, D1.y, 30], [D1.x + 40, D1.y, 30], [D1.x + 40, D1.y, 22]], 1.6, { bend: 4 });
turned("stand.d1pot", ZA([D1.x + 40, D1.y, 0]), [[0, 7], [16, 7], [22, 5.5]], { tone: "mid" }, { rims: "all" });
// salida por arriba al colector de succión
const d1Out = pad("d1.out", D1S, [D1.x, D1.y, D1.z1 + D1.hd], ZD3, SUC.r + 1.2, 6, {}, { owner: "d1.shell" });
const FA = FAN.xA, FB = FAN.xB, FY = FAN.y, FZ = FAN.z, FW = FAN.w;
const BELL = 12, sucEnd = FY - FW / 2 - BELL, TEE = 1.85; // la T: la rama nace fuera del colector
pipe("suc.hdr", [d1Out.face, [D1.x, SUC.y, SUC.z], [FA, SUC.y, SUC.z], [FA, SUC.y, FZ], [FA, sucEnd, FZ]], SUC.r, { bend: 3, flanges: [true, true],
  balls: [{ name: "suc.teeB", c: [FB, SUC.y, SUC.z], R: TEE * SUC.r }] });
pipe("suc.B", [[FB, SUC.y, SUC.z], [FB, SUC.y, FZ], [FB, sucEnd, FZ]], SUC.r, { bend: 3, flanges: [false, true], balls: [{ name: "suc.teeB", c: [FB, SUC.y, SUC.z], R: TEE * SUC.r, shared: true, at: "start" }] });

// el ventilador radial: voluta en espiral, cuna, base con aisladores, campana de succión atrás y motor adelante
const SC = GEO.scroll(FAN.R0, FAN.R1, FAN.top);
const scrollBottom = (u) => { let best = null; for (let i = 0; i < SC.poly.length - 3; i++) { const a = SC.poly[i], b = SC.poly[i + 1]; if (a[1] > -10 || b[1] > -10) continue; if ((a[0] - u) * (b[0] - u) <= 0 && a[0] !== b[0]) { const v = a[1] + ((b[1] - a[1]) * (u - a[0])) / (b[0] - a[0]); if (best === null || v < best) best = v; } } return best; };
const FANS = {};
function fan(name, x0, active) {
  const cls = active ? "" : "ec-standby", F = { o: [x0, FY, FZ], a: YD, u: XD, v: ZD3 };
  const skidZ = 16, front = FY + FW / 2, back = FY - FW / 2;
  box(`stand.${name}pad`, [x0 - 84, FY - 60, 0], [x0 + 84, FY + 96, 6], { tone: "lo" }, { r: 1, cls: "ec-concrete" });
  [[-74, -50], [74, -50], [-74, 86], [74, 86]].forEach(([dx, dy], i) => disc(`${name}.iso${i}`, ZA([x0 + dx, FY + dy, 6]), 0, 4, 4.2, { tone: "lo" }, { owner: `stand.${name}pad` }));
  box(`${name}.skid`, [x0 - 80, FY - 56, 10], [x0 + 80, FY + 92, skidZ], { tone: "lo" }, { r: 0.6, bevel: 0.5, owner: `stand.${name}pad`, cls,
    extra: Dots([[-76, -52], [76, -52], [-76, 88], [76, 88]].map(([dx, dy]) => at([x0 + dx, FY + dy, skidZ])), { size: 0.55 }) });
  // cuna: abraza la parte de abajo de la voluta
  const cr = [], uL = -30, uR = 30;
  for (let u = uL; u <= uR + 1e-6; u += 3) cr.push([u, scrollBottom(u) - 0.02]);
  cr.push([uR, skidZ - FZ], [uL, skidZ - FZ]);
  fp(`${name}.cradle`, F, cr, -FW / 2 + 3, FW / 2 - 3, { tone: "lo" }, { owner: `${name}.skid`, cls });
  const shape = fp(`${name}.scroll`, F, SC.poly, -FW / 2, FW / 2, { tone: "mid" }, { cls, extra: "" });
  // brida rectangular de la descarga
  const [o0, o1] = SC.out, zt = FZ + SC.top;
  box(`${name}.dflange`, [x0 + o0 - 3, back - 3, zt], [x0 + o1 + 3, front + 3, zt + 2.6], { tone: "mid" }, { r: 0.3, owner: `${name}.scroll`, cls,
    extra: Dots([[o0 - 1.5, back - 1.5], [o1 + 1.5, back - 1.5], [o0 - 1.5, front + 1.5], [o1 + 1.5, front + 1.5], [(o0 + o1) / 2, front + 1.5], [(o0 + o1) / 2, back - 1.5]].map(([du, dy]) => at([x0 + du, dy, zt + 2.6])), { size: 0.45 }) });
  // campana de succión atrás
  const BF = G.frameAlong([x0, back, FZ], [0, -1, 0]);
  turned(`${name}.bell`, BF, [[0, 25], [2.5, 22], [7, 20.2], [BELL, 19.6]], { tone: "mid" }, { owner: `${name}.scroll`, cls, extra: Dots(G.dotsOf(BF, 0.4, 23.6, 12, P), { size: 0.4 }) });
  // eje, motor y pedestal adelante
  const MF = G.frameAlong([x0, front, FZ], YD);
  disc(`${name}.hub`, MF, 0, 3, 7.5, { tone: "mid" }, { owner: `${name}.scroll`, cls });
  disc(`${name}.shaft`, MF, 3, 10, 2.4, { tone: "hi" }, { owner: `${name}.hub`, cls });
  turned(`${name}.mbell`, MF, [[10, 11], [12, 15.5], [14, 16]], { tone: "mid" }, { owner: `${name}.shaft`, cls });
  turned(`${name}.mframe`, MF, [[14, 16], [52, 16]], { tone: "mid" }, { owner: `${name}.mbell`, cls, extra: Ln(G.ribsOf(MF, 16, 51, 16.02, 26, P, { least: 0.1, seams: true }), { tone: "faint" }) });
  turned(`${name}.mfan`, MF, [[52, 15.6], [60, 15.6], [62, 10]], { tone: "mid" }, { owner: `${name}.mframe`, cls, extra: Dots(G.dotsOf(MF, 57, 15.62, 20, P, { least: 0.2 }), { size: 0.4 }) });
  box(`${name}.tbox`, [x0 - 6, front + 22, FZ + 15.5], [x0 + 6, front + 36, FZ + 25], { tone: "mid" }, { r: 0.6, bevel: 0.3, owner: `${name}.mframe`, cls });
  box(`${name}.mped`, [x0 - 13, front + 16, skidZ], [x0 + 13, front + 50, FZ - 16 + 0.05], { tone: "lo" }, { r: 0.4, owner: `${name}.skid`, cls });
  FANS[name] = { x0, front, back, zt, xo: x0 + (o0 + o1) / 2, shape };
  return FANS[name];
}
const fB = fan("fanB", FB, false), fA = fan("fanA", FA, true);
// colectores de descarga: cada ventilador sube por su compuerta; el B cruza por encima del A y baja a la torre
const DR0 = (f) => [f.xo, FY, f.zt + 2.6], DMZ = 100, AT1X = -330;
pipe("dis.hdr", [DR0(fB), [fB.xo, FY, HDR.z], [HDR.xDrop, FY, HDR.z], [HDR.xDrop, FY, IN.z], addv(inPad.face, [-1, 0, 0], 0)], HDR.r, { bend: 3, flanges: [false, true],
  balls: [{ name: "dis.teeA", c: [fA.xo, FY, HDR.z], R: TEE * HDR.r }], collars: [{ c: [fB.xo, FY, fB.zt + DMZ], half: 2.2 }, { c: [AT1X, FY, HDR.z], half: 3.0 }] });
pipe("dis.A", [DR0(fA), [fA.xo, FY, HDR.z]], HDR.r, { collars: [{ c: [fA.xo, FY, fA.zt + DMZ], half: 2.2 }], balls: [{ name: "dis.teeA", c: [fA.xo, FY, HDR.z], R: TEE * HDR.r, shared: true, at: "end" }] });
// compuertas de mariposa: la del A abierta (palanca horizontal), la del B cerrada (palanca vertical)
[["A", fA, true], ["B", fB, false]].forEach(([n, f, open]) => {
  const c = [f.xo, FY, f.zt + DMZ];
  ring(`dmp${n}.body`, ZA(c), -2.2, 2.2, HDR.r - 0.4, HDR.r + 8.4, { tone: "mid" }, { owner: n === "A" ? "dis.A" : "dis.hdr", extra: Dots(G.dotsOf(ZA(c), 2.2, HDR.r + 5.4, 12, P), { size: 0.45 }) });
  const sp = [f.xo, FY + HDR.r + 8.4, c[2]];
  disc(`dmp${n}.spindle`, G.frameAlong(sp, YD), -0.4, 6, 1.1, { tone: "mid" }, { owner: `dmp${n}.body` });
  const lv = addv(sp, YD, 6);
  if (open) box(`dmp${n}.lever`, [lv[0] - 1, lv[1], lv[2] - 1], [lv[0] + 16, lv[1] + 1.6, lv[2] + 1], { tone: "hi" }, { r: 0.2, owner: `dmp${n}.spindle` });
  else box(`dmp${n}.lever`, [lv[0] - 1, lv[1], lv[2] - 1], [lv[0] + 1, lv[1] + 1.6, lv[2] + 16], { tone: "hi" }, { r: 0.2, owner: `dmp${n}.spindle` });
});
// la ventana del A: la mitad de arriba de la tapa de adelante quitada, para ver el rotor (lo mueve la página)
const WINR = FAN.R0 - 4.5, winPts = [];
for (let i = 0; i <= 32; i++) { const a = (Math.PI * i) / 32; winPts.push([WINR * Math.cos(a), -(WINR * Math.sin(a))]); }
winPts.push([-WINR, -2.5], [WINR, -2.5]);
const WINM = planeM([FA, fA.front + 0.06, FZ], XD, [0, 0, -1]);
let blades = "";
for (let i = 0; i < 10; i++) { const a = (i * 2 * Math.PI) / 10, pts = []; for (let j = 0; j <= 6; j++) { const f = j / 6, r = 11 + (FAN.rim - 11) * f, ang = a + 0.62 * f; pts.push([r * Math.cos(ang), r * Math.sin(ang)]); } blades += "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L"); }
const WIN = `<g transform="${WINM}"><clipPath id="ecWin"><path d="${pth(winPts.slice(0, 33), true)}"/></clipPath><path class="ec-fanin" d="${pth(winPts.slice(0, 33), true)}"/>`
  + `<g clip-path="url(#ecWin)"><g data-live="imp"><circle class="ec-shroud" r="${FAN.rim}"/><path class="ec-blade" d="${blades}"/><circle class="ec-hubd" r="9"/><circle class="ec-hubc" r="2.6"/></g></g>`
  + `<path class="ec-winrim" d="${pth(winPts.slice(0, 33), false)}"/><path class="ec-winrim" d="M${-WINR} 0L${WINR} 0"/></g>`;

/* ====================================================================
   4 · la salida: cuello sobre la cabeza, D-102 y el ducto al tanque de adsorción
   ==================================================================== */
const OX = OUT.x, OY = OUT.y;
const oPad = pad("out.pad", SHELL, [OX, OY, topOut(Math.hypot(OX, OY))], ZD3, OUT.r + 1.2, 8, {}, { owner: "col.shell" });
const D2C = [OX, OY, 0];
const D2S = turned("d2.shell", ZA(D2C), vesselProfile(D2.z0, D2.z1, D2.R, D2.hd), { tone: "mid" }, {});
const d2Bot = pad("d2.bot", D2S, [OX, OY, D2.z0 - D2.hd], [0, 0, -1], OUT.r + 1.2, 6, {}, { owner: "d2.shell" });
pipe("out.neck", [oPad.face, d2Bot.face], OUT.r, { flanges: [true, true] });
const d2Out = pad("d2.out", D2S, [OX + D2.R + 0.6, OY, D2.z1 - 26], XD, HDR.r + 1.2, 10, {}, { owner: "d2.shell" });
pipe("out.duct", [d2Out.face, [500, OY, D2.z1 - 26]], HDR.r, { flanges: [true, false], open: [false, true], collars: [{ c: [340, OY, D2.z1 - 26], half: 3.0 }] });
// ménsulas que sostienen el D-102 sobre la cabeza
[190, 255, 320].forEach((deg, i) => {
  const d = [Math.cos(deg * D2R), Math.sin(deg * D2R), 0], c = addv([OX, OY, 0], d, D2.R + 2.38);
  const zt = D2.z0 + 10, zb = topOut(Math.max(0, Math.hypot(c[0], c[1]) - 2.4)) - 0.05;
  disc(`d2.leg${i}`, ZA([c[0], c[1], zb]), 0, zt - zb, 2.4, { tone: "lo" }, { owner: "d2.shell" });
});

/* ====================================================================
   5 · el lazo de riego: fondo de la torre, sello hidráulico, TK-103, PS-101 y la subida a los aspersores
   ==================================================================== */
const LDX = [LIQ.dir[0], LIQ.dir[1], 0], along = (d, z) => [LDX[0] * d, LDX[1] * d, z];
const drPad = pad("drn.pad", SHELL, along(RO, LIQ.drop), LDX, LIQ.r + 1.2, 12, {}, { owner: "col.shell" });
const TKC = [TK.x, TK.y, 0], TKd = Math.hypot(TK.x, TK.y);
const TKS = turned("tk.shell", ZA(TKC), [[TK.z0, TK.R], [TK.z1, TK.R]], { tone: "mid" }, { extra: Ln(G.arcOf(ZA(TKC), 60, TK.R, P), { tone: "faint" }) });
turned("stand.tkbase", ZA(TKC), [[0, TK.R + 8], [TK.z0, TK.R + 8]], { tone: "lo" }, { cls: "ec-concrete" });
disc("tk.roof", ZA(TKC), TK.z1, TK.z1 + 2.4, TK.R + 1.5, { tone: "mid" }, { owner: "tk.shell", extra: Dots(G.dotsOf(ZA(TKC), TK.z1 + 2.4, TK.R - 0.2, 28, P, { all: true, least: 0 }), { size: 0.45 }) });
const ROOF = TK.z1 + 2.4;
const tkIn = pad("tk.in", TKS, along(TKd - TK.R - 0.6, 72), G.mul3(LDX, -1), LIQ.r + 1.2, 6, {}, { owner: "tk.shell" });
pipe("drn.line", [drPad.face, along(RO + 50, LIQ.drop), along(RO + 50, 30), along(RO + 130, 30), along(RO + 130, 72), tkIn.face], LIQ.r, { bend: 3, flanges: [true, true] });
// boca de inspección, venteo y la tapa de la bomba en el techo
const MH = addv(TKC, [0.7, 0.7, 0], 34);
disc("tk.manhole", ZA([MH[0], MH[1], ROOF]), 0, 3, 18, { tone: "mid" }, { owner: "tk.roof", extra: Dots(G.dotsOf(ZA([MH[0], MH[1], ROOF]), 3, 15.5, 12, P, { all: true, least: 0 }), { size: 0.45 }) });
const VT = addv(TKC, [-0.9, 0.4, 0], 40);
pipe("tk.vent", [[VT[0], VT[1], ROOF], [VT[0], VT[1], ROOF + 34], [VT[0] + 16, VT[1], ROOF + 34], [VT[0] + 16, VT[1], ROOF + 22]], 2.4, { bend: 3, open: [false, true] });
const PS = addv(TKC, G.mul3(LDX, -1), 36);
disc("ps.plate", ZA([PS[0], PS[1], ROOF]), 0, 2.4, 13, { tone: "mid" }, { owner: "tk.roof", extra: Dots(G.dotsOf(ZA([PS[0], PS[1], ROOF]), 2.4, 10.8, 8, P, { all: true, least: 0 }), { size: 0.45 }) });
box("ps.jbox", [PS[0] + 4, PS[1] - 14, ROOF + 2.4], [PS[0] + 14, PS[1] - 6, ROOF + 12], { tone: "mid" }, { r: 0.5, owner: "ps.plate" });
// la subida: compuerta, retención, rotámetro y la tubería que trepa por la torre hasta el cabezal
const RS = (z) => [PS[0], PS[1], z];
const rTop = addv(spPad.face, LDX, 0), rV = addv(spPt(RO), LDX, RIS.out);
const GV = RS(ROOF + 22), CV = RS(ROOF + 44), RM0 = ROOF + 62, RM1 = ROOF + 132;
pipe("ris", [RS(ROOF + 2.4), RS(RIS.up), [rV[0], rV[1], RIS.up], [rV[0], rV[1], SP.z], rTop], RIS.r, { bend: 4, flanges: [false, true], flangeR: 2.2,
  balls: [{ name: "ris.gv.body", c: GV, R: 5 }, { name: "ris.cv", c: CV, R: 5.4 }], collars: [{ c: RS((RM0 + RM1) / 2), half: (RM1 - RM0) / 2 + 2.4 }, ...[470, 690].map((z) => ({ c: [rV[0], rV[1], z], half: 2.2 }))] });
const GVK = wheel("ris.gv", GV, YD, 5, 5.2);
disc("ris.cv.cap", G.frameAlong(CV, XD), entry(5.4, 3.2), 7.6, 3.2, { tone: "mid" }, { owner: "ris.cv" });
// rotámetro: dos cabezales con bridas y el tubo de vidrio con su escala
const RMF = ZA(RS(0));
disc("rm.bot", RMF, RM0 - 2.4, RM0 + 4, 6.2, { tone: "mid" }, { owner: "ris", extra: Dots(G.dotsOf(RMF, RM0 + 4, 5.1, 6, P), { size: 0.4 }) });
disc("rm.top", RMF, RM1 - 4, RM1 + 2.4, 6.2, { tone: "mid" }, { owner: "ris", extra: Dots(G.dotsOf(RMF, RM1 + 2.4, 5.1, 6, P), { size: 0.4 }) });
disc("rm.glass", RMF, RM0 + 4, RM1 - 4, 4.2, { tone: "hi" }, { cls: "ec-glass", owner: "rm.bot" });
const RMN = G.unit3([HV[0], HV[1], 0]), RMt = G.unit3(G.cross3(ZD3, RMN));
const rmTicks = Array.from({ length: 9 }, (_, i) => { const z = RM0 + 8 + ((RM1 - RM0 - 16) * i) / 8, p0 = addv(addv(RS(z), RMN, 4.25), RMt, 1.6); return path3([p0, addv(p0, RMt, i % 4 === 0 ? 2.2 : 1.2)]); }).join("");
// abrazaderas: la tubería va sujeta a la torre
[470, 690].forEach((z, i) => {
  const cp = pad(`ris.cl${i}`, SHELL, along(RO, z), LDX, 2.6, 3, {}, { owner: "col.shell" });
  const rr = [rV[0], rV[1], z];
  disc(`ris.strut${i}`, G.frameAlong(cp.face, LDX), 0, Math.hypot(rr[0] - cp.face[0], rr[1] - cp.face[1]) - RIS.r - 1.6, 1.8, { tone: "lo" }, { owner: `ris.cl${i}` });
  ring(`ris.band${i}`, ZA(rr), -2.2, 2.2, RIS.r + 0.1, RIS.r + 1.6, { tone: "mid" }, { owner: "ris" });
});
// agua de reposición con su válvula de control de flujo, y la purga al sumidero del piso
const MUY = TK.y - 30, MUX = TK.x + 30;
const fcv = controlValve("fcv", [330, MUY, 170], XD, { R: 4.4, r: 2 });
pipe("fcv.line", [[480, MUY, 170], [MUX, MUY, 170], [MUX, MUY, ROOF]], 2, { bend: 4, flanges: [false, true], open: [true, false], balls: [{ name: "fcv.body", c: [330, MUY, 170], R: 4.4, shared: true }], collars: [{ c: [335.4, MUY, 170], half: 0.6 }, { c: [324.6, MUY, 170], half: 0.6 }] });
[5.4, -5.4].forEach((dx, i) => disc(`fcv.fl${i}`, G.frameAlong([330 + dx, MUY, 170], XD), -0.6, 0.6, 4.2, { tone: "mid" }, { owner: "fcv.line" }));
const pgP = pad("pg.pad", TKS, [TK.x + TK.R + 0.6, TK.y, 92], XD, 3.4, 6, {}, { owner: "tk.shell" });
pipe("pg.line", [pgP.face, [TK.x + 150, TK.y, 92], [TK.x + 150, TK.y, 16]], 2.4, { bend: 4, flanges: [true, false], open: [false, true] });
turned("stand.pgdrain", ZA([TK.x + 150, TK.y, 0]), [[0, 9], [4, 9], [9, 5]], { tone: "lo" }, { cls: "ec-concrete" });
// transmisor de pH en el techo del TK-103: soporte, sonda y caja con pantalla
const PHT = addv(TKC, [0.2, 1, 0], 44);
disc("tk.phstem", ZA([PHT[0], PHT[1], ROOF]), 0, 36, 1.8, { tone: "mid" }, { owner: "tk.roof" });
box("tk.phbox", [PHT[0] - 9, PHT[1] - 4, ROOF + 36], [PHT[0] + 9, PHT[1] + 4, ROOF + 50], { tone: "mid" }, { r: 0.6, bevel: 0.3, owner: "tk.phstem" });

/* ====================================================================
   6 · analizadores de H₂S: a la entrada de la torre y a la salida del D-102
   ==================================================================== */
function analyzer(name, c, r, line) {
  // collar sobre el ducto, vástago y la caja con su pantalla de cara al lector
  ring(`${name}.band`, G.frameAlong(c, XD), -3, 3, r - 0.4, r + 8, { tone: "mid" }, { owner: line, extra: Dots(G.dotsOf(G.frameAlong(c, XD), 3, r + 4.4, 10, P), { size: 0.45 }) });
  const top = [c[0], c[1], c[2] + r + 8];
  disc(`${name}.stem`, ZA(top), -0.05, 8, 2.2, { tone: "mid" }, { owner: `${name}.band` });
  box(`${name}.box`, [c[0] - 14, c[1] - 6, top[2] + 8], [c[0] + 14, c[1] + 6, top[2] + 30], { tone: "mid" }, { r: 0.8, bevel: 0.4, owner: `${name}.stem` });
  return { face: [c[0], c[1] + 6.05, top[2] + 19] };
}
const AT1 = analyzer("at1", [AT1X, FY, HDR.z], HDR.r, "dis.hdr");
const AT2 = analyzer("at2", [340, OY, D2.z1 - 26], HDR.r, "out.duct");
const scr = (a) => planeM(a.face, XD, [0, 0, -1]);

/* ---------- orden y salida (primera parte) ---------- */
if (!FAST) A.settle(R_, P);
if (!FAST) R_.items.sort((a, b) => a.key - b.key);
const idx = (name) => R_.items.findIndex((it) => it.name === name);
const lastOf = (prefix) => { let best = -1; R_.items.forEach((it, i) => { if (it.name === prefix || it.name.startsWith(prefix + ":") || it.name.startsWith(prefix + ".")) best = Math.max(best, i); }); return best; };
const after = new Map();
const slotAt = (i, html) => { if (i < 0) throw new Error("no slot"); after.set(i, (after.get(i) || "") + html); };
const slot = (name, html) => slotAt(idx(name), html);
for (let i = 0; i < BED.layers; i++) slot(`bed.L${i}`, `<path class="ec-bio" data-live="bio${i}" d="${pth(LAYER_POLY[i])}"/>`);
slotAt(Math.max(idx("col.shell"), lastOf("col.ph"), lastOf("grid.beam0")), `<g data-live="sump"></g>`);
slotAt(Math.max(idx("col.shell"), lastOf("grid.plate"), lastOf("col.in.pipe"), lastOf("grid.beam0"), lastOf("grid.beam1"), lastOf("grid.beam2"), lastOf("grid.beam3")), `<g data-live="gasLow"></g>`);
slotAt(Math.max(lastOf("bed.L" + (BED.layers - 1)), idx("hold.grid")), `<g data-live="bedFlow"></g>`);
slotAt(Math.max(idx("hold.grid"), lastOf("spray"), idx("mist.ring")), `<g data-live="spray"></g><g data-live="gasHigh"></g>`);
slot("fanA.scroll", WIN);
slot("rm.glass", Ln(rmTicks, { tone: "mid" }) + `<g data-live="float"></g>`);
slot("ris.gv.wheel", Ln(GVK, { tone: "hi" }));
slotAt(Math.max(idx("fcv.yoke0"), idx("fcv.yoke1"), idx("fcv.stem")), Ln(fcv.ticks, { tone: "mid" }) + `<g data-live="fcv"></g>`);
const scrHtml = (M, w, h, live, label) => `<g transform="${M}"><rect class="ec-scr" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="0.6"/><text class="ec-scrlbl" x="${-w / 2 + 1.4}" y="${-h / 2 + 3.2}" font-size="2.6">${label}</text><text class="ec-scrtxt" data-live="${live}" x="${w / 2 - 1.4}" y="${h / 2 - 1.6}" font-size="6" text-anchor="end">—</text></g>`;
slot("at1.box", scrHtml(scr(AT1), 22, 13, "at1", "H₂S ENTRADA · ppm"));
slot("at2.box", scrHtml(scr(AT2), 22, 13, "at2", "H₂S SALIDA · ppm"));
slot("tk.phbox", scrHtml(planeM([PHT[0], PHT[1] + 4.05, ROOF + 43], XD, [0, 0, -1]), 14, 10, "ph", "pH"));
const pickOf = (nm) => /^(fan|vfd|suc|dis|d1)/.test(nm) ? "gas" : /^(tk|ris|drn|mu|pg|ps)/.test(nm) ? "riego" : /^(bed|hold|grid)/.test(nm) ? "lecho" : /^(mist|d2|out)/.test(nm) ? "salida" : "torre";
const groups = R_.items.map((item, index) => `<g class="it" data-name="${item.name}" data-pick="${pickOf(item.name)}">${item.svg}${after.get(index) ?? ""}</g>`);
const svg = k.figureSvg({ width: W, height: H, label: "El ecofiltro en isométrico: la torre E-101 abierta por el plano de su eje, con la entrada de gas, la rejilla de soporte, el lecho de empaque estructurado en capas, la rejilla de sujeción, los aspersores y el eliminador de niebla; a la izquierda el demister D-101 y los ventiladores V-101 A y B; a la derecha el tanque TK-103 con la bomba sumergible PS-101; arriba el demister D-102", body: [`<g class="ec-items">${groups.join("")}</g>`] });
const DATA = { P, W, H, AZ, EL, T, HV, NOZ, LAYERS: LAYER_POLY.length, RM: { c: [PS[0], PS[1]], z0: RM0 + 6, z1: RM1 - 6, n: RMN }, FCV: { stem: fcv.stem, nrm: fcv.nrm, z0: fcv.z0, z1: fcv.z1 } };
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "eco_data.json"), JSON.stringify(DATA));
writeFileSync(join(HERE, "out", "fig.svg"), svg.replace("<svg ", '<svg id="ecSvg" '));
writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "ec.css"), "utf8"));
writeFileSync(join(HERE, "out", "fig.js"), bundle(JSON.stringify(DATA)));
writeFileSync(join(HERE, "preview.html"), preview(svg.replace("<svg ", '<svg id="ecSvg" ')));
writeFileSync(join(HERE, "preview_static.html"), k.pageHtml({ title: "Ecofiltro", theme: "light", width: 980, body: `<style>${readFileSync(join(HERE, "ec.css"), "utf8")}</style><div class="iso-stage" id="ecFig">${svg}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
/* la torre cuenta como «varilla» para el audit solo por ser alta (L > 4 R); los ramales de los aspersores terminan
   adentro de su corte, contra la pared de atrás, a propósito. Se miraron y se leen claros. */
if (!FAST) A.auditOrExit(R_, P, { crowd: [["spray.lat*", "col.shell"]] });
