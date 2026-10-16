/* ====================================================================
   El aeroenfriador de tiro forzado en isométrico (skill anatomy), para la
   pestaña «Por dentro» del Explorador de intercambiadores. Un haz de
   cuatro filas de tubos aleteados entre dos cabezales de tapones, sobre
   la cámara (plenum) con dos ventiladores axiales; los motores van abajo,
   en su puente, y todo sobre una estructura de columnas y vigas. Se quita
   el bastidor del haz del lado del lector y la mitad de adelante de la
   cámara y de los anillos de los ventiladores. Lo vivo (los tubos con la
   temperatura de cada paso, las aspas que giran y el aire que sube) lo
   pinta la página con el perfil del explorador.
   Uso: node build.mjs [--odd] [--audit] [--fast] · --js
   --odd: número impar de pasos (la salida va en el cabezal de atrás).
   Unidades: 1 = 1 cm. z hacia arriba; los tubos a lo largo de y.
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
const FAST = process.argv.includes("--fast"), ODD = process.argv.includes("--odd"), TAG = ODD ? "impar" : "par";
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
mkdirSync(join(HERE, "out"), { recursive: true });
const writeJs = () => {
  writeFileSync(join(HERE, "out", "fig.js"), "/* aeroenfriador de tiro forzado en isométrico: generado por build.mjs */\nvar FAir = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FAir;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), readFileSync(join(HERE, "ac.css"), "utf8"));
};
if (process.argv.includes("--js")) { writeJs(); console.log("out/fig.js, out/fig.css"); process.exit(0); }

const AC = GEO.AC, AZ = AC.AZ, EL = AC.EL, L = AC.L, TW = 0.6;
const { T, HV } = GEO.axesOf(AZ);
const W = 680, H = 470;
const ZTOP = GEO.topZ(), XC = AC.col.x + AC.col.w / 2;
const EXT = [[-XC, -AC.hdr.dy - 2, 0], [XC, -AC.hdr.dy - 2, 0], [-XC, L + AC.hdr.dy + 2, 0], [XC, L + AC.hdr.dy + 2, 0], [-XC, -AC.hdr.dy, ZTOP + 44], [XC, L + AC.hdr.dy, ZTOP + 44], [-XC, L + AC.hdr.dy, ZTOP + 44], [XC, -AC.hdr.dy, ZTOP + 44]];
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
   1 · estructura: columnas, vigas de arriba, vigas bajas y puente de los motores
   ==================================================================== */
const CX = AC.col.x, CW = AC.col.w / 2, ZS = AC.zs, ZB = ZS - AC.beam, YC = [AC.col.y[0], AC.col.y[2]], BZ = AC.bridge.z;
YC.forEach((yc, j) => [-1, 1].forEach((sg, q) => {
  const x0 = sg * CX - CW, x1 = sg * CX + CW;
  box(`stand.base${j}${q}`, [x0 - 3, yc - CW - 3, 0], [x1 + 3, yc + CW + 3, 0.8], { tone: "lo" }, { r: 0.3, extra: Dots([[x0 - 1.6, yc - CW - 1.6], [x1 + 1.6, yc - CW - 1.6], [x0 - 1.6, yc + CW + 1.6], [x1 + 1.6, yc + CW + 1.6]].map(([x, y]) => at([x, y, 0.8])), { size: 0.4 }) });
  box(`stand.col${j}${q}`, [x0, yc - CW, 0.8], [x1, yc + CW, ZB], { tone: "lo" }, { r: 0.2 });
}));
// vigas largas sobre las columnas y vigas transversales entre ellas (en los extremos y en el medio)
[-1, 1].forEach((sg, q) => box(`stand.lb${q}`, [sg * CX - CW, YC[0] - CW, ZB], [sg * CX + CW, YC[1] + CW, ZS], { tone: "lo" }, { r: 0.2 }));
AC.col.y.forEach((yc, j) => box(`stand.tb${j}`, [-CX + CW, yc - CW, ZB], [CX - CW, yc + CW, ZS], { tone: "lo" }, { r: 0.2 }));
// abajo, vigas entre columnas y las dos vigas del puente de los motores
YC.forEach((yc, j) => box(`stand.lo${j}`, [-CX + CW, yc - CW, BZ[0]], [CX - CW, yc + CW, BZ[1]], { tone: "lo" }, { r: 0.2 }));
[-1, 1].forEach((sg, q) => box(`stand.br${q}`, [sg * AC.bridge.x - 3, YC[0] - CW, BZ[1]], [sg * AC.bridge.x + 3, YC[1] + CW, BZ[2]], { tone: "lo" }, { r: 0.2 }));

// arriostramiento en cruz en el plano de atrás: dos platinas que se cruzan sin tocarse (una a cada lado del eje de las
// columnas) y llegan a la cara de cada columna
[[-CX - 1.9, 6, AC.zf - 12], [-CX + 0.7, AC.zf - 12, 6]].forEach(([xb, za, zb], i) => {
  const a0 = [xb, YC[0] + CW, za], a1 = [xb, YC[1] - CW, zb], dir = G.sub3(a1, a0), len = G.len3(dir), ax = G.unit3(dir), nv = G.unit3(G.cross3(XD, ax));
  // la platina llega a la columna por una esquina: su extremo es perpendicular a ella y no a la cara de la columna
  const s0 = (2.5 * Math.abs(ax[2])) / Math.abs(ax[1]) + 0.01;
  fp(`stand.xb${i}`, { o: a0, a: ax, u: XD, v: nv }, [[0, -2.5], [1.2, -2.5], [1.2, 2.5], [0, 2.5]], s0, len - s0, { tone: "lo" }, { owner: `stand.col${i}0`, extra: Dots([at(G.add3(a0, G.add3(G.mul3(ax, 3), [1.2, 0, 0]))), at(G.add3(a1, G.add3(G.mul3(ax, -3), [1.2, 0, 0])))], { size: 0.4 }) });
});

/* ====================================================================
   2 · la cámara (plenum): panel de atrás, extremos, tabique y piso con las bocas de los ventiladores
   ==================================================================== */
const ZF = AC.zf, PB = -CX + CW, PI0 = PB + 0.6, Y0 = YC[0] + CW, Y1 = YC[1] - CW, FR = AC.fan.R;
{
  const bolts = []; for (let y = Y0 + 8; y < Y1 - 4; y += 13) bolts.push(at([PI0, y, ZB - 1.6]));
  box("pl.back", [PB, Y0, ZF], [PI0, Y1, ZB], { tone: "mid" }, { r: 0.1, owner: "stand.lb0", cls: "ac-sheet", extra: Dots(bolts, { size: 0.4 }) });
  // el piso, con la boca de cada ventilador: en dos mitades (atrás y adelante del plano x = 0), cada una con media boca
  const FZ0 = { o: [0, 0, 0], a: ZD3, u: XD, v: YD }, PX1 = -PI0;
  [[-1, "pl.floor"], [1, "pl.floor1"]].forEach(([sg, nm]) => {
    const poly = [[sg * PX1, Y0], [0, Y0]];
    AC.fan.y.forEach((yf) => { const r = FR + 0.6; for (let i = 0; i <= 36; i++) { const t = -Math.PI / 2 - (Math.PI * i) / 36; poly.push([-sg * r * Math.cos(t), yf + r * Math.sin(t)]); } });
    poly.push([0, Y1], [sg * PX1, Y1]);
    fp(nm, FZ0, sg > 0 ? poly.slice().reverse() : poly, ZF, ZF + 0.6, { tone: "mid" }, { owner: "pl.back", cls: "ac-sheet" });
  });
  // la cámara queda abierta hacia el lector: se quitó su panel de adelante
  [[Y0, Y0 + 0.6, "pl.end0"], [Y1 - 0.6, Y1, "pl.end1"], [149.7, 150.3, "pl.mid"]].forEach(([a, b, nm]) => box(nm, [PI0, a, ZF + 0.6], [PX1, b, ZB], { tone: "mid" }, { r: 0.05, owner: "pl.back", cls: "ac-sheet" }));
  // refuerzos verticales del panel de atrás
  [48, 116, 184, 252].forEach((y, i) => box(`pl.rib${i}`, [PI0, y - 0.7, ZF + 0.6], [PI0 + 1.0, y + 0.7, ZB], { tone: "mid" }, { r: 0.05, owner: "pl.back", cls: "ac-sheet" }));
}

/* ====================================================================
   3 · ventiladores: anillo (la mitad de atrás), aspas (vivas), cubo, eje y motor sobre su placa
   ==================================================================== */
const MOT = [];
// el ángulo (en el marco del ventilador: u a lo largo de y, v a lo largo de x) donde el plano del eje que mira al lector corta
const SPLIT = 360 - AZ;
function arcRing(r0, r1, t0, t1, n = 40) {
  const out = [], D2 = Math.PI / 180;
  for (let i = 0; i <= n; i++) { const t = (t0 + ((t1 - t0) * i) / n) * D2; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = (t0 + ((t1 - t0) * i) / n) * D2; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
AC.fan.y.forEach((yf, f) => {
  const FZ = { o: [0, yf, 0], a: ZD3, u: YD, v: XD }, R0 = AC.fan.ring[0], R1 = AC.fan.ring[1];
  /* El anillo en dos mitades partidas por el plano vertical del eje que mira al lector: la lejana va detrás de las
     aspas y la cercana delante. Las aspas y el aire de la boca se parten igual: la mitad de atrás va detrás del cubo y
     del eje, la de adelante, delante. */
  [["far", SPLIT - 180, SPLIT], ["near", SPLIT, SPLIT + 180]].forEach(([nm, t0, t1]) => {
    fp(`fan${f}.ring.${nm}`, FZ, arcRing(FR, FR + 0.6, t0, t1, 48), R0 + 1.4, R1 - 1.2, { tone: "mid" }, { owner: "pl.floor" });
    fp(`fan${f}.fl.${nm}`, FZ, arcRing(FR, FR + 3.4, t0, t1, 48), R1 - 1.2, R1, { tone: "mid" }, { owner: `fan${f}.ring.${nm}` });
    fp(`fan${f}.lip.${nm}`, FZ, arcRing(FR, FR + 3.4, t0, t1, 48), R0, R0 + 1.4, { tone: "mid" }, { owner: `fan${f}.ring.${nm}` });
  });
  const zb0 = AC.fan.z - 1.7, zb1 = AC.fan.z + 1.7;
  put(`fan${f}.bk`, [-22, yf, AC.fan.z], "", [record(A.prism(FZ, arcRing(AC.fan.hub + 0.6, AC.fan.tip + 0.4, SPLIT - 180, SPLIT), zb0, zb1, { name: `fan${f}.bk`, ground: true }))], { live: true });
  put(`fan${f}.fr`, [22, yf, AC.fan.z], "", [record(A.prism(FZ, arcRing(AC.fan.hub + 0.6, AC.fan.tip + 0.4, SPLIT, SPLIT + 180), zb0, zb1, { name: `fan${f}.fr`, ground: true }))], { live: true });
  const FA = ZA([0, yf, 0]), M = AC.motor;
  box(`fan${f}.plate`, [-AC.bridge.x - 3, yf - 14, BZ[2]], [AC.bridge.x + 3, yf + 14, M.z0], { tone: "lo" }, { r: 0.2, extra: Dots([[-AC.bridge.x, yf - 11], [AC.bridge.x, yf - 11], [-AC.bridge.x, yf + 11], [AC.bridge.x, yf + 11]].map(([x, y]) => at([x, y, M.z0])), { size: 0.45 }) });
  const mot = turned(`fan${f}.mot`, FA, [[M.z0, M.r - 1.4], [M.z0 + 1.2, M.r], [M.z1 - 3, M.r], [M.z1, M.r - 3]], { tone: "mid" }, { owner: `fan${f}.plate` });
  MOT.push(mot);
  pad(`fan${f}.tbox`, mot, [M.r * Math.cos(0.5), yf + M.r * Math.sin(0.5), (M.z0 + M.z1) / 2 + 2], [Math.cos(0.5), Math.sin(0.5), 0], 3.4, 3.2, {}, { owner: `fan${f}.mot` });
  disc(`fan${f}.brg`, FA, M.z1, M.z1 + 3, 4.2, { tone: "mid" }, { owner: `fan${f}.mot` });
  disc(`fan${f}.shaft`, FA, M.z1 + 3, 131, 2.0, { tone: "hi" }, { owner: `fan${f}.brg` });
  disc(`fan${f}.hub`, FA, 131, 140, AC.fan.hub, { tone: "mid" }, { owner: `fan${f}.shaft`, extra: Dots(G.dotsOf(FA, 140, 6.4, 6, P), { size: 0.42 }) });
  disc(`fan${f}.cap`, FA, 140, 141.6, 4.6, { tone: "hi" }, { owner: `fan${f}.hub` });
});

/* ====================================================================
   4 · el haz: bastidor de atrás, soportes y sujetadores, tubos aleteados (vivos) y cabezales de tapones
   ==================================================================== */
const ZT = ZTOP, HD = AC.hdr, ZT0 = ZS + AC.sup;
box("hz.frame", [-54, 0, ZS], [-50.6, L, ZT + AC.sup + 0.5], { tone: "mid" }, { r: 0.2, owner: "stand.tb0", extra: Dots(AC.col.y.map((y) => at([-50.6, y, ZT + AC.sup - 1.2])), { size: 0.42 }) });
AC.col.y.forEach((yc, j) => {
  box(`hz.sup${j}`, [-50.6, yc - 3, ZS], [51.6, yc + 3, ZT0], { tone: "mid" }, { r: 0.15, owner: "hz.frame" });
  box(`hz.kp${j}`, [-50.6, yc - 1.5, ZT], [51.6, yc + 1.5, ZT + AC.sup], { tone: "mid" }, { r: 0.15, owner: "hz.frame" });
});
put("hz.tubes", [0, L / 2, (ZT0 + ZT) / 2], "", [record(A.slab({ x: -48, y: 0.3, w: 99, d: L - 0.6, r: 0.2 }, ZT0, ZT - ZT0, { name: "hz.tubes", ground: true }, 2))], { live: true });
// cabezales: placa de tubos, caja y placa de tapones (un tapón frente a cada tubo)
const ENDS = {};
[["hdr.f", L, 1], ["hdr.b", 0, -1]].forEach(([nm, y0, sg]) => {
  const ya = y0, yb = y0 + sg * 2.4, yc = y0 + sg * (HD.dy - 2.4), yd = y0 + sg * HD.dy, lo = (a, b) => Math.min(a, b), hi = (a, b) => Math.max(a, b);
  const plugs = []; for (let r = 0; r < AC.NR; r++) for (let i = 0; i < AC.NT; i++) plugs.push(at([GEO.tubeX(r, i), yd, GEO.rowZ(r)]));
  box(`${nm}.ts`, [-HD.x - 1.2, lo(ya, yb), HD.z0 - 1.2], [HD.x + 1.2, hi(ya, yb), HD.z1 + 1.2], { tone: "mid" }, { r: 0.3, owner: "hz.frame", cls: "ac-hdr" });
  box(nm, [-HD.x, lo(yb, yc), HD.z0], [HD.x, hi(yb, yc), HD.z1], { tone: "mid" }, { r: 0.3, owner: `${nm}.ts`, cls: "ac-hdr" });
  box(`${nm}.ps`, [-HD.x - 1.2, lo(yc, yd), HD.z0 - 1.2], [HD.x + 1.2, hi(yc, yd), HD.z1 + 1.2], { tone: "mid" }, { r: 0.3, owner: nm, cls: "ac-hdr", extra: sg > 0 ? Dots(plugs, { size: 0.62 }) : "" });
  // orejas de izaje arriba
  [-32, 32].forEach((x, i) => box(`${nm}.lug${i}`, [x - 0.8, lo(yb, yc) + 2.4, HD.z1], [x + 0.8, hi(yb, yc) - 2.4, HD.z1 + 4], { tone: "mid" }, { r: 0.2, owner: nm, extra: Dots([at([x + 0.8, (yb + yc) / 2, HD.z1 + 2.6])], { size: 0.55 }) }));
});
// boquillas: el proceso entra arriba del cabezal de adelante; sale abajo del mismo (pasos pares) o del de atrás (impares)
function nozzle(name, yc, up) {
  const z0 = up ? HD.z1 : HD.z0, s = up ? 1 : -1, F = ZA([0, yc, 0]);
  disc(`${name}.neck`, F, up ? z0 : z0 - 10, up ? z0 + 10 : z0, 4.0, { tone: "mid" }, { owner: up ? "hdr.f" : (yc > 0 ? "hdr.f" : "hdr.b") });
  disc(`${name}.fl`, F, up ? z0 + 10 : z0 - 11.6, up ? z0 + 11.6 : z0 - 10, 7.2, { tone: "mid" }, { owner: `${name}.neck`, extra: up ? Dots(G.dotsOf(F, z0 + 11.6, 5.8, 8, P), { size: 0.42 }) : "" });
  return [0, yc, z0 + s * 11.6];
}
ENDS.pIn = nozzle("noz.in", L + HD.dy / 2, true);
ENDS.pOut = nozzle("noz.out", ODD ? -HD.dy / 2 : L + HD.dy / 2, false);
ENDS.aIn = [AC.fan.R * Math.cos(0.6), AC.fan.y[1] - AC.fan.R * Math.sin(0.6), AC.fan.ring[0] - 2];
ENDS.aOut = [-46, 26, ZT + 38];

/* ====================================================================
   5 · el aire: entra por debajo de cada anillo, llena la cámara y sale por arriba del haz
   ==================================================================== */
put("air.out", [0, L / 2, ZT + 22], "", [record(A.slab({ x: -48, y: 2, w: 99, d: L - 4, r: 0.2 }, ZT + AC.sup + 0.3, 40, { name: "air.out", ground: true }, 2))], { live: true });
AC.fan.y.forEach((yf, f) => {
  const y0 = f ? 150.4 : Y0 + 0.7, y1 = f ? Y1 - 0.7 : 149.6;
  put(`air.pl${f}`, [0, (y0 + y1) / 2, (ZF + ZB) / 2], "", [record(A.slab({ x: PI0 + 1.1, y: y0, w: 54 - PI0 - 1.1, d: y1 - y0, r: 0.1 }, ZF + 0.7, ZB - ZF - 0.9, { name: `air.pl${f}`, ground: true }, 2))], { live: true });
  const FZ = { o: [0, yf, 0], a: ZD3, u: YD, v: XD };
  put(`air.in${f}.bk`, [-14, yf, 114], "", [record(A.prism(FZ, arcRing(3, 40, SPLIT - 180, SPLIT), 106, 125, { name: `air.in${f}.bk`, ground: true }))], { live: true });
  put(`air.in${f}.fr`, [14, yf, 114], "", [record(A.prism(FZ, arcRing(3, 40, SPLIT, SPLIT + 180), 106, 125, { name: `air.in${f}.fr`, ground: true }))], { live: true });
});

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
R_.items.forEach((it) => { if (it.live) it.svg = `<g data-live="${it.name}"></g>`; });
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
const label = "Aeroenfriador de tiro forzado en isométrico: un haz de cuatro filas de tubos aleteados entre dos cabezales de tapones, sobre la cámara con dos ventiladores axiales y sus motores, en una estructura de columnas y vigas; sin el bastidor del haz del lado del lector ni la mitad de adelante de la cámara";
const svg = k.figureSvg({ width: W, height: H, label, body: [`<g class="ac-items">${groups.join("")}</g>`] }).replace("<svg ", `<svg id="acSvg" `);
const DATA = { P, W, H, L, sc: G.scaleOf(P), odd: ODD, ends: ENDS };
writeFileSync(join(HERE, "out", `aero-${TAG}.svg`), svg);
writeFileSync(join(HERE, "out", `aero-${TAG}.json`), JSON.stringify(DATA));
writeJs();
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Aeroenfriador", theme: "light", width: 1000, body: `<style>${readFileSync(join(HERE, "ac.css"), "utf8")}</style><div class="iso-stage" id="acFig">${svg}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + "\nvar AC_DATA = " + JSON.stringify(DATA) + ";\n" + readFileSync(join(HERE, "drive_test.js"), "utf8") }));
console.log("aero", TAG, "items", R_.items.length, "scale", G.scaleOf(P).toFixed(3), "svg", svg.length);
if (!FAST) A.auditOrExit(R_, P, {});
