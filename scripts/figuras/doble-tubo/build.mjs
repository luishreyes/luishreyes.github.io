/* ====================================================================
   El intercambiador de doble tubo en isométrico (skill anatomy), para la
   pestaña «Por dentro» del Explorador de intercambiadores. Tres horquillas
   apiladas en su bastidor; cada rama va abierta por el plano vertical de
   su eje (x = 0) y se ven el tubo interior y el ánulo. Atrás, el cabezal de
   retorno de cada horquilla; adelante, la brida y el prensaestopas de cada
   rama, las curvas exteriores del tubo interior y las boquillas del ánulo
   con sus puentes. Lo vivo (los dos fluidos con su temperatura y sus
   puntos) lo pinta la página con el perfil del explorador.
   Uso: node build.mjs [--audit] [--fast] · --js
   Unidades: 1 = 1 cm. z hacia arriba; cada rama a lo largo de y.
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
mkdirSync(join(HERE, "out"), { recursive: true });
const writeJs = () => {
  writeFileSync(join(HERE, "out", "fig.js"), "/* intercambiador de doble tubo en isométrico: generado por build.mjs */\nvar FDouble = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FDouble;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), readFileSync(join(HERE, "dp.css"), "utf8"));
};
if (process.argv.includes("--js")) { writeJs(); console.log("out/fig.js, out/fig.css"); process.exit(0); }

const DP = GEO.DP, AZ = DP.AZ, EL = DP.EL, TW = DP.Ro - DP.Ri, L = DP.L, NL = DP.legs;
const { T, HV } = GEO.axesOf(AZ);
const W = 680, H = 440;
const zTop = GEO.legZ(NL - 1) + DP.Ro;
const yG = L + DP.gland.fl + DP.gland.body + 1.2; // donde sale el tubo interior del prensaestopas
const bendY = yG + DP.bend.dy, nozY = L - DP.noz.dy, RX = DP.Ro + 9;
const EXT = [[-RX, DP.housing.y0 - 2, 0], [RX, DP.housing.y0 - 2, 0], [-RX, bendY + 14, 0], [RX, bendY + 14, 0], [-RX, DP.housing.y0, zTop + 6], [RX, bendY + 10, zTop + 14], [-RX, bendY + 10, zTop + 14]];
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
const ZA = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
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
   0 · piezas de recipiente cortadas por el plano x = 0
   ==================================================================== */
const FRONT = A.box([0, -4000, -4000], [4000, 4000, 4000]); // la mitad que se quita (x > 0)
const YF = (zc, y = 0) => ({ o: [0, y, zc], a: YD, u: ZD3, v: XD }); // marco a lo largo de y; sección en (u = z, v = x), mitad de atrás v ≤ 0
const radY = (f) => [Math.sin(f), 0, Math.cos(f)]; // f ∈ [π, 2π]: la mitad de atrás (x ≤ 0); π abajo, 2π arriba
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + (Math.round(x * 10) / 10) + " " + (Math.round(y * 10) / 10)).join("") + "Z";
/* una superficie de revolución de la mitad de atrás, en franjas de f; en cada franja los tramos del mismo tono van
   juntos. El borde entre dos tonos se busca en los dos lados de la franja (bisección), así sigue la curva real y no
   hace escalones. */
function surface(P3, N3, nf, nu, out, keep = null) {
  const cls = (f, u) => { const n = N3(f, u); return G.dot3(n, C.V) <= 1e-4 || (keep && !keep(P3(f, u))) ? -1 : BAND(G.dot3(n, C.L)); };
  if (nu === 1) { // un cilindro: los bordes de tono son generatrices; las franjas contiguas del mismo tono van en un polígono
    const fOf = (i) => Math.PI + (Math.PI * i) / nf, bands = [];
    for (let i = 0; i < nf; i++) bands.push(cls((fOf(i) + fOf(i + 1)) / 2, 0.5));
    for (let i = 0; i < nf; ) {
      let j = i; while (j + 1 < nf && bands[j + 1] === bands[i]) j++;
      if (bands[i] >= 0) {
        const pts = []; for (let q = i; q <= j + 1; q++) pts.push(P3(fOf(q), 0)); for (let q = j + 1; q >= i; q--) pts.push(P3(fOf(q), 1));
        const d = pth1(pts.map((p) => C.pr(...p))); out.by[bands[i]].push(d); out.fill.push(d);
      }
      i = j + 1;
    }
    return;
  }
  for (let i = 0; i < nf; i++) {
    const f0 = Math.PI + (Math.PI * i) / nf, f1_ = Math.PI + (Math.PI * (i + 1)) / nf, fm = (f0 + f1_) / 2;
    const runs = [];
    for (let j = 0; j < nu; j++) { const band = cls(fm, (j + 0.5) / nu); if (!runs.length || runs[runs.length - 1].band !== band) runs.push({ band, j0: j }); }
    // los bordes en cada lado de la franja: se muestrea fino, se empareja cada cambio de tono con el del centro y se afina por bisección
    const edge = (f) => {
      const M = nu * 4, smp = []; for (let q = 0; q < M; q++) smp.push(cls(f, (q + 0.5) / M));
      const tr = []; for (let q = 1; q < M; q++) if (smp[q] !== smp[q - 1]) tr.push({ a: smp[q - 1], b: smp[q], q });
      const cuts = [0];
      for (let r = 1; r < runs.length; r++) {
        const j = runs[r].j0, A = runs[r - 1].band, B = runs[r].band; let best = null;
        for (const t of tr) if (t.a === A && t.b === B && (!best || Math.abs(t.q / M - j / nu) < Math.abs(best.q / M - j / nu))) best = t;
        let c = j / nu;
        if (best && Math.abs(best.q / M - j / nu) < 3 / nu) { let lo = (best.q - 0.5) / M, hi = (best.q + 0.5) / M; for (let it = 0; it < 20; it++) { const m = (lo + hi) / 2; if (cls(f, m) === A) lo = m; else hi = m; } c = (lo + hi) / 2; }
        cuts.push(c);
      }
      cuts.push(1); for (let r = 1; r < cuts.length; r++) cuts[r] = Math.max(cuts[r], cuts[r - 1]); return cuts;
    };
    const e0 = edge(f0), e1 = edge(f1_);
    const side = (f, ua, ub) => { const pts = [P3(f, ua)]; for (let j = Math.floor(ua * nu) + 1; j / nu < ub - 1e-9; j++) if (j / nu > ua + 1e-9) pts.push(P3(f, j / nu)); pts.push(P3(f, ub)); return pts; };
    runs.forEach((run, r) => {
      if (run.band < 0) return;
      const pts = [...side(f0, e0[r], e0[r + 1]), ...side(f1_, e1[r], e1[r + 1]).reverse()];
      const d = pth1(pts.map((p) => C.pr(...p))); out.by[run.band].push(d); out.fill.push(d);
    });
  }
}
function toned(build, fillD = null) {
  const out = { by: [[], [], [], [], []], fill: [] };
  build(out);
  return `<path class="iso-fill" d="${fillD ?? out.fill.join("")}"/>` + out.by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "");
}
/* un recipiente horizontal cortado: cilindro de y0 a y1 con fondo 2:1 opcional en cada extremo (d0 atrás, d1 adelante).
   Dibuja lo de afuera que se ve, el interior por la abertura del corte y la pared cortada en el plano x = 0. */
function cutVessel(name, zc, { y0, y1, R: Ri, TW: tw = TW, d0 = false, d1 = false, hd = Ri / 2, cls = "", owner } = {}) {
  const Ro = Ri + tw, ho = hd + tw, inner = [], NA = 12;
  // el contorno de afuera (de y0 a y1) a radio rr con fondos de profundidad hh
  const contour = (rr, hh) => {
    const out = [];
    if (d0) for (let i = 0; i <= NA; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * (i / NA); out.push([y0 + hh * Math.sin(a), rr * Math.cos(a)]); } else out.push([y0, rr]);
    if (d1) for (let i = 0; i <= NA; i++) { const a = (Math.PI / 2) * (i / NA); out.push([y1 + hh * Math.sin(a), rr * Math.cos(a)]); } else out.push([y1, rr]);
    return out;
  };
  const outer = contour(Ro, ho);
  if (d1) for (let i = NA; i >= 0; i--) { const a = (Math.PI / 2) * (i / NA); inner.push([y1 + hd * Math.sin(a), Ri * Math.cos(a)]); } else inner.push([y1, Ri]);
  if (d0) for (let i = 0; i <= NA; i++) { const a = -(Math.PI / 2) * (i / NA); inner.push([y0 + hd * Math.sin(a), Ri * Math.cos(a)]); } else inner.push([y0, Ri]);
  const clean = (m) => m.map(([s, r]) => [s, Math.abs(r) < 1e-9 ? 0 : r]);
  const merid = clean([...outer, ...inner]), skinMerid = clean([...contour(Ri + 0.3, hd + 0.3), ...inner]);
  const F = { o: [0, 0, zc], a: YD, u: ZD3, v: XD };
  /* Tres piezas para que el orden de pintura no haga ciclos: la pared del fondo (su cara interior se ve por la
     abertura y queda detrás de todo lo de adentro), la franja de arriba (por fuera se ve y tapa lo de adentro que
     queda bajo ella) y, si hay fondo adelante, la cúpula que mira al lector. zT: desde ahí la cara interior ya no se ve. */
  const zT = zc + Ri * 0.8, yD = d1 ? y1 : Infinity;
  const below = A.box([-4000, -4000, zT], [4000, 4000, 4000]), above = A.box([-4000, -4000, -4000], [4000, 4000, zT]);
  const ahead = A.box([-4000, yD, -4000], [4000, 4000, 4000]), behind = A.box([-4000, -4000, -4000], [4000, yD, 4000]);
  // lo que se dibuja de la pared de atrás es su cara interior: se registra solo esa piel (0,3 cm). La pared entera, sin
  // registrar, es el anfitrión de los asientos de las boquillas.
  const cavShape = record(A.body(F, skinMerid, { name, owner, cut: d1 ? [FRONT, below, ahead] : [FRONT, below] }));
  // anfitrión macizo (sin registrar) para asentar boquillas: con la pared delgada la bisección del asiento no encuentra
  // el borde en una superficie curva; con el macizo, sí
  const full = A.body(F, clean([...outer, [outer[outer.length - 1][0], 0], [outer[0][0], 0]]), { name: name + ".full", owner: name, cut: [FRONT], piece: "frame", ride: "frame", move: [0, 0, 0] });
  // superficies: cilindro (u a lo largo de y) y fondos (u del ecuador al polo)
  const cyl = (rr, sg) => [(f, u) => [rr * Math.sin(f), y0 + (y1 - y0) * u, zc + rr * Math.cos(f)], (f) => G.mul3(radY(f), sg)];
  const dish = (rr, hh, yc, s, sg) => [(f, u) => { const a = (Math.PI / 2) * u; return [rr * Math.cos(a) * Math.sin(f), yc + s * hh * Math.sin(a), zc + rr * Math.cos(a) * Math.cos(f)]; },
    (f, u) => { const a = (Math.PI / 2) * u, r3 = radY(f); return G.mul3(G.unit3([(r3[0] * Math.cos(a)) / rr, (s * Math.sin(a)) / hh, (r3[2] * Math.cos(a)) / rr]), sg); }];
  const hiZ = (p) => p[2] >= zT, loZ = (p) => p[2] < zT;
  const topSvg = toned((o) => { surface(...cyl(Ro, 1), 72, 1, o, hiZ); if (d0) surface(...dish(Ro, ho, y0, -1, 1), 40, 10, o, hiZ); if (d1) surface(...dish(Ro, ho, y1, 1, 1), 40, 10, o, hiZ); });
  const domeSvg = d1 ? toned((o) => surface(...dish(Ro, ho, y1, 1, 1), 40, 10, o, loZ)) : "";
  // la abertura: el contorno interior en el plano x = 0 (recorta el interior y le sirve de fondo)
  const sec = [...inner.slice().reverse().map(([s, r]) => [0, s, zc + r]), ...inner.map(([s, r]) => [0, s, zc - r])];
  const cavSvg = toned((o) => { surface(...cyl(Ri, -1), 120, 1, o); if (d0) surface(...dish(Ri, hd, y0, -1, -1), 40, 10, o); }, pth(sec.map((p) => C.pr(...p))));
  const id = "hxClip_" + name.replace(/\W/g, "_");
  put(name, [-Ri * 0.7, (y0 + y1) / 2, zc - Ri * 0.3], `<clipPath id="${id}"><path d="${pth(sec.map((p) => C.pr(...p)))}"/></clipPath><g class="iso-solid hx-cav" clip-path="url(#${id})">${cavSvg}</g>`, [cavShape], owner ? { owner } : {});
  put(`${name}.top`, [-Ri * 0.3, (y0 + y1) / 2, zc + Ri * 0.95], `<g class="iso-solid${cls ? " " + cls : ""}">${topSvg}</g>`, [record(A.body(F, merid, { name: `${name}.top`, owner: name, cut: [FRONT, above] }))]);
  if (d1) put(`${name}.dome`, [-Ri * 0.4, y1 + hd * 0.6, zc], `<g class="iso-solid${cls ? " " + cls : ""}">${domeSvg}</g>`, [record(A.body(F, merid, { name: `${name}.dome`, owner: name, cut: [FRONT, below, behind] }))]);
  const shape = { ...cavShape, full };
  // la pared cortada, al frente: el meridiano arriba y abajo, en el plano x = 0
  const CF = { o: [0, 0, zc], a: [-1, 0, 0], u: YD, v: ZD3 };
  fp(`${name}.cut0`, CF, merid.map(([s, r]) => [s, r]), 0, 0.4, { tone: "mid" }, { cap: "only", cls: "hx-cutface", owner: name });
  fp(`${name}.cut1`, CF, merid.map(([s, r]) => [s, -r]), 0, 0.4, { tone: "mid" }, { cap: "only", cls: "hx-cutface", owner: name });
  return shape;
}
// placa o brida cortada: media corona a lo largo de y, con pernos en la cara que mira al lector (+y)
function halfPlate(name, zc, y0, y1, r0, r1, { bolts = 0, boltR = null, owner, cls = "", extra = "", ground } = {}) {
  const F = YF(zc, 0);
  // pernos solo en la mitad que queda (x ≤ 0), en la cara que mira al lector
  const br = boltR ?? (r0 + r1) / 2, pts = [];
  for (let i = 0; i < bolts; i++) { const f = (Math.PI * 2 * (i + 0.5)) / bolts, x = br * Math.sin(f); if (x < -0.6) pts.push(at([x, y1, zc + br * Math.cos(f)])); }
  const dots = bolts ? Dots(pts, { size: 0.45 }) : "";
  return fp(name, F, half(r0, r1, 28), y0, y1, { tone: "mid" }, { owner, cls, extra: dots + extra, ground });
}

/* ====================================================================
   1 · las ramas: tubo exterior y tubo interior abiertos por x = 0
   ==================================================================== */
const Ri = DP.Ri, Ro = DP.Ro, ri = DP.ri, ro = DP.ro, GL = DP.gland, HS = DP.housing, NZ = DP.noz;
const LEGS = [];
for (let k2 = 0; k2 < NL; k2++) {
  const zc = GEO.legZ(k2), leg = { k: k2, zc };
  leg.out = cutVessel(`leg${k2}.out`, zc, { y0: 0, y1: L, R: Ri });
  // adelante: brida del tubo exterior, prensaestopas y su seguidor, por donde sale el tubo interior
  const FA = G.frameOf([0, 0, zc], YD, XD, ZD3);
  // el tubo interior, entero, del cabezal de retorno a la brida; la página lo pinta con la temperatura de su fluido
  disc(`leg${k2}.in`, FA, 0, L, ro, { tone: "hi" }, { cls: "dp-in", extra: `<g data-live="leg${k2}.in"></g>` });
  const dotsY = (y, r, n) => { const out = []; for (let i = 0; i < n; i++) { const f = (Math.PI * 2 * (i + 0.5)) / n; out.push(at([r * Math.sin(f), y, zc + r * Math.cos(f)])); } return Dots(out, { size: 0.42 }); };
  disc(`leg${k2}.fl`, FA, L, L + GL.fl, Ro + 3.0, { tone: "mid" }, { owner: `leg${k2}.out`, extra: dotsY(L + GL.fl, Ro + 2.0, 6) });
  disc(`leg${k2}.gl`, FA, L + GL.fl, L + GL.fl + GL.body, ro + 1.6, { tone: "mid" }, { owner: `leg${k2}.fl` });
  disc(`leg${k2}.gf`, FA, L + GL.fl + GL.body, yG, ro + 2.3, { tone: "mid" }, { owner: `leg${k2}.gl`, extra: dotsY(yG, ro + 1.6, 2) });
  LEGS.push(leg);
}
// atrás: el cabezal de retorno de cada horquilla (fundición con su brida), que une el ánulo y lleva adentro la curva del tubo interior
for (let h = 0; h < NL / 2; h++) {
  const za = GEO.legZ(2 * h), zb = GEO.legZ(2 * h + 1);
  const zm = (za + zb) / 2, F = YF(zm, 0), hu = (zb - za) / 2;
  // la brida del cabezal y su cuerpo: un óvalo (dos medias circunferencias unidas) que abraza las dos ramas
  const ob = (R, n = 20) => { const out = []; for (let i = 0; i <= n; i++) { const t = -Math.PI / 2 + (Math.PI * i) / n; out.push([hu + R * Math.cos(t), R * Math.sin(t)]); } for (let i = 0; i <= n; i++) { const t = Math.PI / 2 + (Math.PI * i) / n; out.push([-hu + R * Math.cos(t), R * Math.sin(t)]); } return out; };
  const bolts = []; [za, zb].forEach((zz, q) => { for (let i = 0; i <= 4; i++) { const t = (q ? 0 : Math.PI) + (-Math.PI / 2 + (Math.PI * i) / 4) * (q ? 1 : -1), rb = Ro + 2.0; bolts.push(at([rb * Math.sin(t) * (q ? 1 : -1) * -1, HS.y1, zz + rb * Math.cos(t)])); } });
  fp(`ret${h}.fl`, F, ob(Ro + 3.2), HS.y1 - 2.4, HS.y1, { tone: "mid" }, { cls: "dp-cast", extra: Dots(bolts, { size: 0.45 }) });
  const body = fp(`ret${h}`, F, ob(Ro + 1.6), HS.y0 + 4, HS.y1 - 2.4, { tone: "mid" }, { cls: "dp-cast", owner: `ret${h}.fl` });
  fp(`ret${h}.back`, F, ob(Ro + 0.6), HS.y0, HS.y0 + 4, { tone: "mid" }, { cls: "dp-cast", owner: `ret${h}` });
  // el tapón de drenaje abajo
  pad(`ret${h}.plug`, body, [0, (HS.y0 + HS.y1) / 2 + 1, za - Ro - 1.6], [0, 0, -1], 1.4, 1.5, {}, { owner: `ret${h}` });
}
/* ====================================================================
   2 · conexiones: curvas del tubo interior, boquillas y puentes del ánulo
   ==================================================================== */
const ENDS = {};
// el tubo interior: entra por la rama 0 y sale por la 5; entre horquillas, una curva de 180° adelante
for (let h = 0; h + 1 < NL / 2; h++) {
  const z1 = GEO.legZ(2 * h + 1), z2 = GEO.legZ(2 * h + 2);
  pipe(`bend${h}`, [[0, yG, z1], [0, bendY, z1], [0, bendY, z2], [0, yG, z2]], ro, { bend: (DP.dz / 2 - 0.4) / ro, tone: "mid" });
}
[["inIn", 0], ["inOut", NL - 1]].forEach(([nm, k2]) => {
  const z = GEO.legZ(k2);
  pipe(`end.${nm}`, [[0, yG, z], [0, yG + 26, z]], ro, { flanges: [false, true], open: [false, true] });
  ENDS[nm] = [0, yG + 26, z];
});
// boquillas del ánulo cerca del extremo de adelante, en la mitad que queda (x < 0)
const zOn = (r) => Math.sqrt(r * r - NZ.x * NZ.x);
const nozzle = (k2, up) => { const zc = GEO.legZ(k2); return pad(`leg${k2}.n${up ? "t" : "b"}`, LEGS[k2].out.full, [NZ.x, nozY, zc + (up ? 1 : -1) * zOn(Ro)], [0, 0, up ? 1 : -1], NZ.r + 0.7, 1.2, {}, { owner: `leg${k2}.out` }); };
function neck(name, face, up, len) {
  const F = G.frameOf(face, ZD3, XD, YD), s = up ? 1 : -1;
  disc(`${name}.neck`, F, up ? 0 : -len + 1.2, up ? len - 1.2 : 0, NZ.r, { tone: "mid" }, { owner: name });
  disc(`${name}.fl`, F, up ? len - 1.2 : -len, up ? len : -len + 1.2, NZ.r * 1.8, { tone: "mid" }, { owner: `${name}.neck` });
  return [face[0], face[1], face[2] + s * len];
}
for (let h = 0; h + 1 < NL / 2; h++) { // puente del ánulo: de la rama de arriba de una horquilla a la de abajo de la siguiente
  const lo = nozzle(2 * h + 1, true), hi = nozzle(2 * h + 2, false), zm = (lo.face[2] + hi.face[2]) / 2;
  neck(`jmp${h}.a`, lo.face, true, zm - lo.face[2]); neck(`jmp${h}.b`, hi.face, false, hi.face[2] - zm);
}
{ // entrada (arriba) y salida (abajo) del ánulo
  const t = nozzle(NL - 1, true), b = nozzle(0, false);
  ENDS.anTop = neck("end.anTop", t.face, true, 7); ENDS.anBot = neck("end.anBot", b.face, false, 7);
  // la salida de abajo descansa en un soporte de tubería (una pata con su placa) sobre el piso
  const fx = NZ.x, fy = nozY, fr = NZ.r * 1.8;
  box("stand.nozbase", [fx - 4, fy - 4, 0], [fx + 4, fy + 4, 0.6], { tone: "lo" }, { r: 0.2, extra: Dots([at([fx - 2.9, fy + 2.9, 0.6]), at([fx + 2.9, fy - 2.9, 0.6])], { size: 0.4 }) });
  box("stand.nozfoot", [fx - 1.5, fy - 1.5, 0.6], [fx + 1.5, fy + 1.5, ENDS.anBot[2] - 0.8], { tone: "lo" }, { r: 0.2 });
  box("stand.nozcap", [fx - fr + 0.4, fy - 2.2, ENDS.anBot[2] - 0.8], [fx + fr - 0.4, fy + 2.2, ENDS.anBot[2]], { tone: "lo" }, { r: 0.2 });
}
/* ====================================================================
   3 · bastidor: dos marcos con una cuna bajo cada rama
   ==================================================================== */
const xs = Ro + 4.5, zTopF = GEO.legZ(NL - 1) - Ro + 3;
DP.sup.forEach((ys, j) => {
  // un parral de un solo poste atrás (x < 0), con un brazo en voladizo bajo cada rama: el lado del corte queda libre
  box(`stand.base${j}`, [-xs - 5, ys - 5, 0], [-xs + 5, ys + 5, 0.8], { tone: "lo" }, { r: 0.3, extra: Dots([at([-xs - 3.6, ys + 3.6, 0.8]), at([-xs + 3.6, ys - 3.6, 0.8]), at([-xs - 3.6, ys - 3.6, 0.8]), at([-xs + 3.6, ys + 3.6, 0.8])], { size: 0.4 }) });
  box(`stand.post${j}`, [-xs - 1.8, ys - 1.8, 0.8], [-xs + 1.8, ys + 1.8, zTopF], { tone: "lo" }, { r: 0.2 });
  box(`stand.cap${j}`, [-xs - 2.6, ys - 2.6, zTopF], [-xs + 2.6, ys + 2.6, zTopF + 1.2], { tone: "lo" }, { r: 0.2 });
  for (let k2 = 0; k2 < NL; k2++) { const zc = GEO.legZ(k2); box(`stand.arm${j}.${k2}`, [-xs + 1.8, ys - 2.4, zc - Ro - 2.2], [0.6, ys + 2.4, zc - Ro], { tone: "lo" }, { r: 0.15 }); }
});

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
R_.items.forEach((it) => { if (it.live) it.svg = `<g data-live="${it.name}"></g>`; });
// el fluido del ánulo va sobre la pared interior del tubo exterior, recortado a la abertura (detrás del tubo interior)
LEGS.forEach((lg) => { const it = R_.items.find((q) => q.name === `leg${lg.k}.out`); it.svg += `<g data-live="leg${lg.k}.an"></g>`; });
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
const label = "Intercambiador de doble tubo en isométrico: tres horquillas apiladas en su bastidor, con cada rama abierta por el plano de su eje para ver el tubo interior y el ánulo; atrás los cabezales de retorno, adelante los prensaestopas, las curvas del tubo interior y los puentes del ánulo";
const svg = k.figureSvg({ width: W, height: H, label, body: [`<g class="dp-items">${groups.join("")}</g>`] }).replace("<svg ", `<svg id="dpSvg" `);
const DATA = { P, W, H, L, Ri, Ro, ri, ro, sc: G.scaleOf(P), legs: LEGS.map((l) => l.zc), ends: ENDS };
writeFileSync(join(HERE, "out", "doble.svg"), svg);
writeFileSync(join(HERE, "out", "doble.json"), JSON.stringify(DATA));
writeJs();
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Doble tubo", theme: "light", width: 1000, body: `<style>${readFileSync(join(HERE, "dp.css"), "utf8")}</style><div class="iso-stage" id="dpFig">${svg}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + "\nvar DP_DATA = " + JSON.stringify(DATA) + ";\n" + readFileSync(join(HERE, "drive_test.js"), "utf8") }));
console.log("doble items", R_.items.length, "scale", G.scaleOf(P).toFixed(3), "svg", svg.length);
if (!FAST) A.auditOrExit(R_, P, {});
