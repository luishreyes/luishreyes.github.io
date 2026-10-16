/* ====================================================================
   La instalación de bombeo en isométrico (skill anatomy), para la pestaña
   «Instalación» del Explorador de bombas centrífugas. Una bomba 2×3-8 de
   succión axial sobre su base, con la caja de rodamientos, el acople con
   su guarda y el motor; la succión viene del tanque y la descarga sube
   con su retención y su válvula de regulación. A la carcasa se le quita
   la mitad de arriba de la tapa de succión para ver el impulsor. Lo vivo
   (el impulsor que gira con su diámetro, el líquido, las burbujas de
   cavitación, las agujas de los manómetros, el nivel del tanque y el
   vástago de la válvula) lo pinta la página con el modelo del explorador.
   Uso: node build.mjs [--lift] [--audit] [--fast] · --js
   --lift: succión con elevación (el tanque abajo, en un foso).
   Unidades: 1 = 1 cm. z hacia arriba; el eje de la bomba a lo largo de x.
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
const FAST = process.argv.includes("--fast"), LIFT = process.argv.includes("--lift"), TAG = LIFT ? "elevacion" : "inundada";
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
mkdirSync(join(HERE, "out"), { recursive: true });
const writeJs = () => {
  writeFileSync(join(HERE, "out", "fig.js"), "/* instalación de bombeo en isométrico: generado por build.mjs */\nvar FPump = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FPump;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "pb.css"), "utf8"));
};
if (process.argv.includes("--js")) { writeJs(); console.log("out/fig.js, out/fig.css"); process.exit(0); }

// con succión con elevación la bomba sube sobre un pedestal de LZ y el tanque queda abajo
const LZ = LIFT ? 80 : 0;
const PB = GEO.PB, AZ = PB.AZ, EL = PB.EL, TW = 1.2, ZA = PB.zA + LZ, XP = PB.xP;
const { T, HV } = GEO.axesOf(AZ);
const W = 680, H = 500;
const EXT = [[-150, -92, 0], [142, -92, 0], [-150, 36, 0], [142, 36, 0], [-150, -92, LIFT ? 214 : 178], [142, 36, LIFT ? 214 : 178], [142, -92, LIFT ? 214 : 178], [-150, 36, 96 + LZ]];
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
  disc(`${name}.bonnet`, ZA_(c), entry(R, 2.3), R + 5, 2.3, { tone: "mid" }, { owner: `${name}.body` });
  disc(`${name}.bflange`, ZA_(c), R + 5, R + 6.2, 4.6, { tone: "mid" }, { owner: `${name}.bonnet`, extra: Dots(G.dotsOf(ZA_(c), R + 6.2, 3.7, 6, P), { size: 0.4 }) });
  const side = G.unit3(G.cross3(UP, along)); // los postes de la arcada, a los lados del vástago
  const yk = 12, y0 = bt, y1 = bt + yk;
  [-1, 1].forEach((sg, i) => {
    const pc = addv(c, side, sg * 3.1);
    const a = [pc[0] - 0.6, pc[1] - 0.6, y0], b = [pc[0] + 0.6, pc[1] + 0.6, y1];
    box(`${name}.yoke${i}`, a, b, { tone: "mid" }, { r: 0.15, owner: `${name}.bflange` });
  });
  const tp = [c[0], c[1], y1];
  disc(`${name}.ytop`, ZA_(tp), 0, 1.3, 4.4, { tone: "mid" }, { owner: `${name}.yoke0` });
  disc(`${name}.stem`, ZA_(c), bt - c[2], y1 - c[2], 0.55, { tone: "hi" }, { owner: `${name}.bflange` });
  const A0 = y1 + 1.3;
  turned(`${name}.diaL`, ZA_([c[0], c[1], A0]), [[0, 2.6], [4.2, 12.6]], { tone: "mid" }, { owner: `${name}.ytop` });
  disc(`${name}.diaF`, ZA_([c[0], c[1], A0]), 4.2, 5.4, 13.4, { tone: "mid" }, { owner: `${name}.diaL`, extra: Dots(G.dotsOf(ZA_([c[0], c[1], A0]), 5.4, 12.7, 16, P), { size: 0.42 }) });
  turned(`${name}.diaU`, ZA_([c[0], c[1], A0]), [[5.4, 12.6], [10.4, 3.4]], { tone: "mid" }, { owner: `${name}.diaF` });
  disc(`${name}.vent`, ZA_([c[0], c[1], A0]), 10.4, 11.8, 1.6, { tone: "mid" }, { owner: `${name}.diaU` });
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


const SIGHT = {}, ENDS = {}, TANKD = {};
// el volante de una válvula de compuerta: bonete desde el cuerpo, vástago y rueda con sus radios
function handWheel(name, c, up, R, W) {
  const top = G.add3(c, G.mul3(up, R + 6));
  disc(`${name}.bonnet`, G.frameAlong(c, up), entry(R, 2.6), R + 4.4, 2.6, { tone: "mid" }, { owner: `${name}.body` });
  disc(`${name}.yoke`, G.frameAlong(c, up), R + 4.4, R + 6, 1.4, { tone: "mid" }, { owner: `${name}.bonnet` });
  const HW = G.frameAlong(top, up);
  ring(`${name}.wheel`, HW, 0, 0.8, 1.4, W, { tone: "hi" }, { owner: `${name}.yoke` });
  return [0, 1, 2, 3, 4].map((i) => { const a = (i * 2 * Math.PI) / 5 + 0.4; return path3([G.pointOf(HW, 0.8, 1.6, a), G.pointOf(HW, 0.8, W - 0.6, a)]); }).join("") + G.arcOf(HW, 0.8, W - 0.6, P, { least: -1 });
}


/* ====================================================================
   1 · base: pedestal de concreto y base de acero con sus pernos de anclaje
   ==================================================================== */
const ZB0 = 10 + LZ, ZB1 = 18 + LZ; // pedestal de 0 a 10 (más LZ), base de ZB0 a ZB1
box("stand.plinth", [-150, -34, 0], [62, 34, ZB0], { tone: "lo" }, { r: 0.8, bevel: 0.6, cls: "pb-conc" });
{
  const bolts = [[-140, -24], [-140, 24], [-55, -24], [-55, 24], [44, -24], [44, 24]].map(([x, y]) => at([x, y, ZB1]));
  const grout = [[-100, 0], [-20, 0]].map(([x, y]) => at([x, y, ZB1]));
  box("stand.base", [-144, -28, ZB0], [54, 28, ZB1], { tone: "lo" }, { r: 0.4, extra: Dots(bolts, { size: 0.6 }) + Dots(grout, { size: 1.1 }) });
  // el borde de la bandeja de goteo
  [[-144, -28, -144, 28], [54, -28, 54, 28]].forEach(([x0, y0, x1, y1], i) => box(`stand.rim${i}`, [Math.min(x0, x1) + (i ? -1.2 : 0), y0, ZB1], [Math.max(x0, x1) + (i ? 0 : 1.2), y1, ZB1 + 1.6], { tone: "lo" }, { r: 0.2 }));
  [[-28, "lo"], [26.8, "hi"]].forEach(([y, nm], i) => box(`stand.rim${i + 2}`, [-142.8, y, ZB1], [52.8, y + 1.2, ZB1 + 1.6], { tone: "lo" }, { r: 0.2 }));
}

/* ====================================================================
   2 · la carcasa: voluta en espiral con su lengüeta y su garganta; la tapa de succión, solo la mitad de abajo
   ==================================================================== */
const FX = { o: [XP, 0, ZA], a: XD, u: YD, v: ZD3 }, BW = PB.bw, WL = PB.wall;
const casHost = A.prism(FX, GEO.outerContour(), -BW - WL, BW + WL, { name: "cas.host", piece: "frame", ride: "frame", move: [0, 0, 0] });
fp("cas.back", FX, GEO.outerContour(), -BW - WL, -BW, { tone: "mid" }, { cls: "pb-cast" });
// la pared de arriba en dos tramos: el cercano (con la lengüeta y la garganta) va delante del canal y el lejano, detrás
fp("cas.up", FX, GEO.wallUpperPart(0, GEO.TS), -BW, BW, { tone: "mid" }, { cls: "pb-cast", owner: "cas.back" });
fp("cas.upf", FX, GEO.wallUpperPart(GEO.TS, Math.PI), -BW, BW, { tone: "mid" }, { cls: "pb-cast", owner: "cas.back" });
fp("cas.lo", FX, GEO.wallLower(), -BW, BW, { tone: "mid" }, { cls: "pb-cast", owner: "cas.back" });
fp("cas.thr", FX, GEO.wallThroat(), -BW, BW, { tone: "mid" }, { cls: "pb-cast", owner: "cas.back" });
// la tapa de la garganta, sobre la que va la boquilla de descarga
const [YT0, YT1] = GEO.yThroat();
fp("cas.cap", FX, [[YT0 - WL, PB.zT], [YT1 + WL, PB.zT], [YT1 + WL, PB.zT + 1.4], [YT0 - WL, PB.zT + 1.4]], -BW - WL, BW + WL, { tone: "mid" }, { cls: "pb-cast", owner: "cas.up" });
{
  // la tapa de succión: la mitad de abajo, con media boca del ojo y sus pernos
  const poly = [], n = 48, sr = PB.suc.r;
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n, r = GEO.rOut(t) + WL; poly.push([r * Math.cos(t), r * Math.sin(t)]); }
  for (let i = 0; i <= 24; i++) { const t = -(Math.PI * i) / 24; poly.push([sr * Math.cos(t), sr * Math.sin(t)]); }
  const bolts = []; for (let i = 1; i < 10; i++) { const t = Math.PI + (Math.PI * i) / 10, r = GEO.rOut(t) + WL - 0.7; bolts.push(at([XP + BW + WL, r * Math.cos(t), ZA + r * Math.sin(t)])); }
  fp("cas.front", FX, poly.map(([y, z]) => [y, Math.abs(z) < 1e-9 ? 0 : z]), BW, BW + WL, { tone: "mid" }, { cls: "pb-cast", owner: "cas.lo", extra: Dots(bolts, { size: 0.5 }) });
}
// la boquilla de succión (la mitad de abajo) y su brida
const SU = PB.suc, XS0 = XP + BW + WL, XS1 = XS0 + SU.len;
// la boquilla y su brida en dos tramos (el lejano detrás del líquido y el cercano delante)
const TN = (7 * Math.PI) / 4;
fp("suc.noz", FX, GEO.arcRing(SU.r, SU.ro, Math.PI, TN), BW + WL, BW + WL + SU.len - SU.ft, { tone: "mid" }, { cls: "pb-cast", owner: "cas.front" });
fp("suc.nozn", FX, GEO.arcRing(SU.r, SU.ro, TN, 2 * Math.PI, 12), BW + WL, BW + WL + SU.len - SU.ft, { tone: "mid" }, { cls: "pb-cast", owner: "cas.front" });
{
  const bolts = []; for (let i = 0; i < 4; i++) { const t = Math.PI + (Math.PI * (i + 0.5)) / 4, r = (SU.ro + SU.fr) / 2 + 0.6; bolts.push(at([XS1, r * Math.cos(t), ZA + r * Math.sin(t)])); }
  fp("suc.fl", FX, GEO.arcRing(SU.r, SU.fr, Math.PI, TN, 40), BW + WL + SU.len - SU.ft, BW + WL + SU.len, { tone: "mid" }, { cls: "pb-cast", owner: "suc.noz", extra: Dots(bolts, { size: 0.5 }) });
  fp("suc.fln", FX, GEO.arcRing(SU.r, SU.fr, TN, 2 * Math.PI, 14), BW + WL + SU.len - SU.ft, BW + WL + SU.len, { tone: "mid" }, { cls: "pb-cast", owner: "suc.nozn" });
}
// la pata de la carcasa: un bloque bajo el punto más bajo de la espiral, sobre su placa
let zLow = 0; for (let i = 0; i <= 200; i++) { const t = Math.PI + (Math.PI * i) / 200, r = GEO.rOut(t) + WL; zLow = Math.min(zLow, r * Math.sin(t)); }
box("cas.footpl", [XP - 7, -8, ZB1], [XP + 7, 8, ZB1 + 1.2], { tone: "mid" }, { r: 0.3, cls: "pb-cast", extra: Dots([[XP - 5.4, -6.4], [XP + 5.4, -6.4], [XP - 5.4, 6.4], [XP + 5.4, 6.4]].map(([x, y]) => at([x, y, ZB1 + 1.2])), { size: 0.5 }) });
box("cas.foot", [XP - BW - WL, -4.5, ZB1 + 1.2], [XP + BW + WL, 4.5, ZA + zLow + 0.12], { tone: "mid" }, { r: 0.2, cls: "pb-cast", owner: "cas.footpl" });
// la boquilla de descarga sobre la garganta, con su brida
const DI = PB.dis, YN = GEO.yNoz(), ZD0 = ZA + PB.zT + 1.4, ZD1 = ZD0 + DI.len;
const FDZ = ZA_([XP, YN, 0]);
disc("dis.noz", FDZ, ZD0, ZD1 - DI.ft, DI.ro, { tone: "mid" }, { cls: "pb-cast", owner: "cas.cap" });
disc("dis.fl", FDZ, ZD1 - DI.ft, ZD1, DI.fr, { tone: "mid" }, { cls: "pb-cast", owner: "dis.noz", extra: Dots(G.dotsOf(FDZ, ZD1, (DI.ro + DI.fr) / 2 + 0.5, 4, P), { size: 0.5 }) });

/* ====================================================================
   3 · el impulsor (vivo), y detrás: tapa de la carcasa, cámara del sello, prensa, adaptador, caja de rodamientos
   ==================================================================== */
put("imp", [XP, 0, ZA + 3], "", [record(A.disc(FX, PB.disk[0], PB.vane[1] + 0.9, PB.r2 + 0.25, { name: "imp", ground: true }))], { live: true });
// el líquido que se ve por el corte: la voluta (mitad de arriba), la garganta y la boquilla de succión
put("flow.vol", [XP, 4, ZA + 12], "", [record(A.prism(FX, GEO.passPart(0, GEO.TS), -BW + 0.05, BW - 0.05, { name: "flow.vol", ground: true }))], { live: true });
put("flow.volf", [XP, -10, ZA + 8], "", [record(A.prism(FX, GEO.passPart(GEO.TS, Math.PI), -BW + 0.05, BW - 0.05, { name: "flow.volf", ground: true }))], { live: true });
put("flow.thr", [XP, GEO.yNoz(), ZA + PB.zT / 2], "", [record(A.prism(FX, GEO.passThroat().map(([y, z], i) => [y + (i === 0 || i === 3 ? 0.05 : -0.05), Math.min(PB.zT - 0.05, Math.max(0.05, z))]), -BW + 0.05, BW - 0.05, { name: "flow.thr", ground: true }))], { live: true });
put("flow.suc", [XP + BW + WL + PB.suc.len / 2, 0, ZA - 2], "", [record(A.prism(FX, half(0, PB.suc.r - 0.05, 32), BW + WL + 0.05, BW + WL + PB.suc.len - 0.05, { name: "flow.suc", ground: true }))], { live: true });
const FA = G.frameOf([0, 0, ZA], XD, YD, ZD3);
disc("cas.cover", FA, XP - BW - WL - 1.8, XP - BW - WL, 12.6, { tone: "mid" }, { cls: "pb-cast", owner: "cas.back" });
disc("seal.ch", FA, 17, XP - BW - WL - 1.8, 6.6, { tone: "mid" }, { cls: "pb-cast", owner: "cas.cover" });
disc("seal.gl", FA, 15, 17, 8.2, { tone: "mid" }, { owner: "seal.ch", extra: Dots(G.dotsOf(FA, 15, 7.0, 4, P, { all: false, least: 0.05 }), { size: 0.55 }) });
disc("shaft.a", FA, 12, 15, 2.4, { tone: "hi" }, { owner: "seal.gl" });
disc("brg.adapt", FA, 9, 12, 10.2, { tone: "mid" }, { cls: "pb-cast", owner: "shaft.a" });
const frame = disc("brg.frame", FA, -38, 9, 8.6, { tone: "mid" }, { cls: "pb-cast", owner: "brg.adapt" });
disc("brg.end", FA, -40.2, -38, 6.6, { tone: "mid" }, { cls: "pb-cast", owner: "brg.frame" });
disc("shaft.b", FA, -50, -40.2, 2.4, { tone: "hi" }, { owner: "brg.end" });
box("brg.foot", [-32, -7, ZB1], [-16, 7, ZA - 8.6 + 0.12], { tone: "mid" }, { r: 0.3, cls: "pb-cast", extra: Dots([[-30, -5.4], [-18, -5.4], [-30, 5.4], [-18, 5.4]].map(([x, y]) => at([x, y, ZB1])), { size: 0.5 }) });
// la mirilla del aceite (del lado del lector) y el respiradero arriba
{
  const sp = pad("brg.sight", frame, [-6, Math.sqrt(8.6 * 8.6 - 9), ZA - 3], [0, Math.sqrt(8.6 * 8.6 - 9) / 8.6, -3 / 8.6], 2.4, 1.2, { tone: "mid" }, { owner: "brg.frame" });
  SIGHT.at = sp.face; SIGHT.n = G.unit3([0, Math.sqrt(8.6 * 8.6 - 9), -3]);
  pad("brg.vent", frame, [-22, 0, ZA + 8.6], [0, 0, 1], 1.4, 3.2, { tone: "mid" }, { owner: "brg.frame" });
}

/* ====================================================================
   4 · el acople de espaciador con su guarda (sin la tapa del lado del lector) y el motor sobre su pedestal
   ==================================================================== */
disc("cpl.h1", FA, -56, -50, 5.6, { tone: "mid" }, { owner: "shaft.b" });
disc("cpl.sp", FA, -66, -56, 3.6, { tone: "hi" }, { owner: "cpl.h1" });
disc("cpl.h2", FA, -72, -66, 5.6, { tone: "mid" }, { owner: "cpl.sp" });
disc("shaft.m", FA, -76, -72, 2.4, { tone: "hi" }, { owner: "cpl.h2" });
{
  const holes = []; for (let x = -73.5; x <= -48; x += 3) for (let z = ZB1 + 6; z <= ZA + 8; z += 3) holes.push(at([x, -10.4, z]));
  box("guard.back", [-75.6, -11, ZB1], [-46, -10.4, ZA + 10], { tone: "mid" }, { r: 0.1, cls: "pb-guard", extra: Dots(holes, { size: 0.42 }) });
  box("guard.top", [-75.6, -11, ZA + 10], [-46, -1, ZA + 10.6], { tone: "mid" }, { r: 0.1, cls: "pb-guard", owner: "guard.back" });
}
const MR = 13;
disc("mot.de", FA, -80, -76, 11.2, { tone: "mid" }, { cls: "pb-motor", owner: "shaft.m" });
// las aletas de enfriamiento del motor: generatrices de la carcasa del lado que se ve, de un escudo al otro
const finD = (() => { const V = C.V, out = []; for (let i = 0; i < 36; i++) { const t = (i * 2 * Math.PI) / 36, n = [0, Math.cos(t), Math.sin(t)]; if (G.dot3(n, V) < 0.12 || Math.sin(t) < -0.55) continue; out.push(path3([[-127.4, MR * Math.cos(t), ZA + MR * Math.sin(t)], [-80.6, MR * Math.cos(t), ZA + MR * Math.sin(t)]])); } return out.join(""); })();
const motor = disc("mot.body", FA, -128, -80, MR, { tone: "mid" }, { cls: "pb-motor", owner: "mot.de", extra: Ln(finD, { tone: "lo" }) });
turned("mot.fan", FA, [[-142, 9.5], [-140.6, 13.6], [-128.4, 13.6], [-128, 13.2]], { tone: "mid" }, { cls: "pb-motor", owner: "mot.body" });
box("mot.ped", [-126, -15, ZB1], [-84, 15, ZB1 + 6], { tone: "lo" }, { r: 0.3, extra: Dots([[-124, -13], [-86, -13], [-124, 13], [-86, 13]].map(([x, y]) => at([x, y, ZB1 + 6])), { size: 0.5 }) });
[-118, -92].forEach((xf, i) => pad(`mot.foot${i}`, motor, [xf, 0, ZA - MR], [0, 0, -1], 5.5, ZA - MR - ZB1 - 6, { tone: "mid" }, { owner: "mot.body", cls: "pb-motor" }));
box("mot.tbox", [-112, -6.5, ZA + MR - 0.15], [-98, 6.5, ZA + MR + 7.5], { tone: "mid" }, { r: 0.6, cls: "pb-motor", owner: "mot.body", extra: Dots([[-110.8, 5.3], [-99.2, 5.3]].map(([x, y]) => at([x, y, ZA + MR + 7.5])), { size: 0.45 }) });
{
  // la placa de datos del motor, del lado del lector, con sus renglones grabados
  const y0 = Math.sqrt(MR * MR - 12.25) + 0.08, rl = [0, 1, 2].map((i) => path3([[-102.2, y0 + 0.6, ZA + 1.8 - i * 1.6], [-93.8, y0 + 0.6, ZA + 1.8 - i * 1.6]])).join("");
  box("mot.plate", [-103, y0, ZA - 3.5], [-93, y0 + 0.6, ZA + 3.5], { tone: "hi" }, { r: 0.1, owner: "mot.body", extra: Ln(rl, { tone: "lo" }) + Dots([[-102.4, ZA + 2.9], [-93.6, ZA + 2.9], [-102.4, ZA - 2.9], [-93.6, ZA - 2.9]].map(([x, z]) => at([x, y0 + 0.6, z])), { size: 0.35 }) });
}

/* ====================================================================
   5 · la succión: tanque, válvula de bloqueo, tramo recto y reducción excéntrica (plana arriba) hasta la bomba
   ==================================================================== */
const R4 = 5.72, R3 = 4.45, F4 = 11.45, F3 = 9.5, ZS = ZA - (R4 - R3); // la reducción excéntrica baja el eje de la línea
{
  // brida de 3″ contra la de la bomba y la reducción excéntrica de 4″ × 3″
  disc("suc.pfl", FA, XS1, XS1 + 2.4, F3, { tone: "mid" }, { owner: "suc.fl", extra: Dots(G.dotsOf(FA, XS1 + 2.4, (R3 + F3) / 2 + 0.6, 4, P, { all: false, least: 0.05 }), { size: 0.5 }) });
  const a0 = [XS1 + 2.4, 0, ZA], a1 = [XS1 + 14.3, 0, ZS], ax = G.unit3(G.sub3(a1, a0)), lr = G.len3(G.sub3(a1, a0));
  turned("suc.red", G.frameAlong(a0, ax), [[0, R3], [lr, R4]], { tone: "mid" }, { owner: "suc.pfl" });
  disc("suc.rfl", G.frameOf([0, 0, ZS], XD, YD, ZD3), XS1 + 14.3, XS1 + 16.7, F4, { tone: "mid" }, { owner: "suc.red", extra: Dots(G.dotsOf(G.frameOf([0, 0, ZS], XD, YD, ZD3), XS1 + 16.7, (R4 + F4) / 2 + 0.6, 8, P), { size: 0.5 }) });
}
const XR1 = XS1 + 16.7;
// el soporte de la línea de succión: un poste con su placa bajo el tubo, antes del codo
{
  const xs = 92, zt = ZS - R4;
  box("stand.ps", [xs - 4.5, -4.5, 0], [xs + 4.5, 4.5, 0.8], { tone: "lo" }, { r: 0.2, extra: Dots([at([xs - 3.2, -3.2, 0.8]), at([xs + 3.2, 3.2, 0.8])], { size: 0.4 }) });
  box("stand.pspost", [xs - 1.8, -1.8, 0.8], [xs + 1.8, 1.8, zt - 1.2], { tone: "lo" }, { r: 0.2 });
  box("stand.psshoe", [xs - 5, -4, zt - 1.2], [xs + 5, 4, zt], { tone: "lo" }, { r: 0.2 });
}
const TK = LIFT ? { x: 112, y: -62, R: 27, z0: 22, z1: 76, hd: 13.5 } : { x: 112, y: -62, R: 27, z0: 90, z1: 156, hd: 13.5 };
const TKF = ZA_([TK.x, TK.y, 0]);
const tankProf = (() => { const p = [], n = 14; for (let i = 0; i <= n; i++) { const a = -Math.PI / 2 + (Math.PI / 2) * (i / n); p.push([TK.z0 + TK.hd * Math.sin(a), TK.R * Math.cos(a)]); } for (let i = 0; i <= n; i++) { const a = (Math.PI / 2) * (i / n); p.push([TK.z1 + TK.hd * Math.sin(a), TK.R * Math.cos(a)]); } return p.map(([s, r]) => [s, Math.max(0, Math.abs(r) < 1e-6 ? 0 : r)]); })();
const tank = turned("tank", TKF, tankProf, { tone: "mid" }, { cls: "pb-tank", rims: "none" });
// patas con su placa
[0, 120, 240].forEach((d, i) => {
  const a = (d * Math.PI) / 180, lx = TK.x + (TK.R + 2.4) * Math.cos(a), ly = TK.y + (TK.R + 2.4) * Math.sin(a);
  box(`stand.tleg${i}b`, [lx - 4, ly - 4, 0], [lx + 4, ly + 4, 0.8], { tone: "lo" }, { r: 0.2, extra: Dots([at([lx - 2.8, ly - 2.8, 0.8]), at([lx + 2.8, ly + 2.8, 0.8])], { size: 0.4 }) });
  disc(`stand.tleg${i}`, ZA_([lx, ly, 0]), 0.8, TK.z0 + 8, 2.4, { tone: "lo" }, {});
});
// la boquilla de salida abajo, la línea de succión con su válvula de bloqueo y la toma del manómetro de succión
// con succión inundada la salida va abajo; con elevación el tubo entra por arriba y baja adentro hasta la válvula de pie
const outPad = LIFT ? pad("tank.out", tank, [TK.x, TK.y, TK.z1 + TK.hd], [0, 0, 1], R4 + 0.9, 4, { tone: "mid" }, { owner: "tank" }) : pad("tank.out", tank, [TK.x, TK.y, TK.z0 - TK.hd], [0, 0, -1], R4 + 0.9, 4, { tone: "mid" }, { owner: "tank" });
const SV = [TK.x, -26, ZS], SG = [XR1 + 8, 0, ZS];
pipe("suc", [outPad.face, [TK.x, TK.y, ZS], [TK.x, 0, ZS], [XR1, 0, ZS]], R4, { bend: 3, flanges: [true, true], flangeR: F4 / R4, touch: ["stand.psshoe", "stand.pspost"],
  balls: [{ name: "sv.body", c: SV, R: 9.2 }, { name: "sg.tee", c: SG, R: 7.0, bores: [{ owner: "sg.stem", dir: ZD3, r: 0.7 }] }] });
const SVK = handWheel("sv", SV, ZD3, 9.2, 7.5);
disc("sg.stem", ZA_(SG), entry(7.0, 0.7), 12, 0.7, { tone: "mid" }, { owner: "sg.tee" });
const GN = G.unit3([HV[0], HV[1], 0.18]);
const SGD = dial("ps", G.add3([SG[0], SG[1], ZS + 12 + 5.2 - 0.05], G.mul3(GN, 0.8)), GN, 5.2, { live: "ps", owner: "sg.stem", red: 0 });

/* ====================================================================
   6 · la descarga: ampliación de 2″ a 3″, manómetro, válvula de retención, válvula de regulación y la línea al destino
   ==================================================================== */
const FDN = ZA_([XP, YN, 0]), ZE0 = ZD1, ZE1 = ZE0 + 2.0, ZE2 = ZE1 + 9.0, ZE3 = ZE2 + 2.4;
disc("dis.pfl", FDN, ZE0, ZE1, DI.fr, { tone: "mid" }, { owner: "dis.fl" });
turned("dis.exp", FDN, [[ZE1, DI.ro], [ZE2, R3]], { tone: "mid" }, { owner: "dis.pfl" });
disc("dis.efl", FDN, ZE2, ZE3, F3, { tone: "mid" }, { owner: "dis.exp", extra: Dots(G.dotsOf(FDN, ZE3, (R3 + F3) / 2 + 0.6, 4, P), { size: 0.5 }) });
const DG = [XP, YN, ZE3 + 9], CV = [XP, YN, ZE3 + 25], GV = [XP, YN, ZE3 + 49], ZTOPL = ZE3 + 74;
const GDIR = G.unit3([HV[0], HV[1], 0]);
pipe("dis", [[XP, YN, ZE3], [XP, YN, ZTOPL], [XP, -34, ZTOPL]], R3, { bend: 3, flanges: [true, true], flangeR: F3 / R3, open: [false, true],
  balls: [{ name: "dg.tee", c: DG, R: 6.0, bores: [{ owner: "dg.stem", dir: GDIR, r: 0.7 }] }, { name: "cv.body", c: CV, R: 8.0 }, { name: "gv.body", c: GV, R: 8.6 }] });
disc("dg.stem", G.frameAlong(DG, GDIR), entry(6.0, 0.7), 11, 0.7, { tone: "mid" }, { owner: "dg.tee" });
const DGD = dial("pd", G.add3(DG, G.mul3(GDIR, 11 + 1.6)), GDIR, 5.2, { live: "pd", owner: "dg.stem", red: 0 });
// la retención: la tapa de su clapeta, del lado del lector
disc("cv.cap", G.frameAlong(CV, GDIR), entry(8.0, 4.4), 9.4, 4.4, { tone: "mid" }, { owner: "cv.body", extra: Dots(G.dotsOf(G.frameAlong(CV, GDIR), 9.4, 3.4, 4, P), { size: 0.45 }) });
// la de regulación (globo): bonete y vástago (vivo) con su volante, hacia el lector
const GVF = G.frameAlong(GV, GDIR);
disc("gv.bonnet", GVF, entry(8.6, 3.0), 13, 3.0, { tone: "mid" }, { owner: "gv.body" });
disc("gv.gland", GVF, 13, 15, 2.0, { tone: "mid" }, { owner: "gv.bonnet" });
put("gv.stem", G.add3(GV, G.mul3(GDIR, 20)), "", [record(A.disc(GVF, 15.1, 25.5, 6.2, { name: "gv.stem", ground: true }))], { live: true });
ENDS.dest = [XP, -34, ZTOPL];
ENDS.tank = [TK.x, TK.y, TK.z1 + TK.hd];
ENDS.ps = G.add3([SG[0], SG[1], ZS + 12 + 5.2], G.mul3(GN, 1.2));
ENDS.pd = G.add3(DG, G.mul3(GDIR, 13.4));
ENDS.gv = G.add3(GV, G.mul3(GDIR, 26));
ENDS.pump = [XP - 6, 28, ZB0];
ENDS.motor = [-141, 0, ZA + 4];

// el tanque: venteo y manómetro arriba, nivel de vidrio del lado del lector
{
  const top = TK.z1 + TK.hd, vp = pad("tank.vent", tank, [TK.x - 12, TK.y + 6, top], [0, 0, 1], 2.2, 3, { tone: "mid" }, { owner: "tank" });
  disc("tank.vpipe", ZA_(vp.face), 0, 8, 1.6, { tone: "mid" }, { owner: "tank.vent" });
  disc("tank.vcap", ZA_(vp.face), 8, 9.4, 3.0, { tone: "mid" }, { owner: "tank.vpipe" });
  const gp = pad("tank.gp", tank, [TK.x + 10, TK.y + 10, top], [0, 0, 1], 1.4, 2.4, { tone: "mid" }, { owner: "tank" });
  disc("tank.gstem", ZA_(gp.face), 0, 7, 0.7, { tone: "mid" }, { owner: "tank.gp" });
  TANKD.d = dial("p1", G.add3(gp.face, G.add3([0, 0, 7 + 4.6 - 0.05], G.mul3(GN, 0.8))), GN, 4.6, { live: "p1", owner: "tank.gstem" });
  // el nivel de vidrio
  const la = (35 * Math.PI) / 180, lx = TK.x + (TK.R + 6) * Math.cos(la), ly = TK.y + (TK.R + 6) * Math.sin(la);
  [TK.z0 + 6, TK.z1 - 6].forEach((z, i) => {
    const lp = pad(`lg.pad${i}`, tank, [TK.x + TK.R * Math.cos(la), TK.y + TK.R * Math.sin(la), z], [Math.cos(la), Math.sin(la), 0], 1.4, 1.6, {}, { owner: "tank" });
    pipe(`lg.tap${i}`, [lp.face, [lx, ly, z]], 0.9, { balls: [{ name: `lg.valve${i}`, c: [lx, ly, z], R: 2.8, at: "end" }] });
  });
  disc("lg.glass", ZA_([lx, ly, 0]), TK.z0 + 6 + entry(2.8, 1.1), TK.z1 - 6 - entry(2.8, 1.1), 1.1, { tone: "hi" }, { cls: "pb-glass", owner: "lg.valve0" });
  TANKD.lg = { x: lx, y: ly, z0: TK.z0 + 6 + 2.6, z1: TK.z1 - 6 - 2.6 };
}

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
R_.items.forEach((it) => { if (it.live) it.svg = `<g data-live="${it.name}"></g>`; });
const after = (name, html) => { const it = R_.items.find((q) => q.name === name); if (!it) throw new Error("no está " + name); it.svg += html; };
after("ps.bezel", SGD.html); after("pd.bezel", DGD.html); after("p1.bezel", TANKD.d.html);
after("sv.wheel", Ln(SVK, { tone: "hi" }));
after("lg.glass", `<g data-live="lcol"></g>`);
after("cpl.sp", `<g data-live="cpl"></g>`);
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
const label = "Instalación de bombeo en isométrico: una bomba centrífuga de succión axial sobre su base, con la caja de rodamientos, el acople con su guarda y el motor; a la carcasa le falta la mitad de arriba de la tapa de succión para ver el impulsor";
const svg = k.figureSvg({ width: W, height: H, label, body: [`<g class="pb-items">${groups.join("")}</g>`] }).replace("<svg ", `<svg id="pbSvg" `);
const DATA = { P, W, H, sc: G.scaleOf(P), lift: LIFT, zA: ZA, ends: ENDS, tank: TK, lg: TANKD.lg, gv: { c: GV, dir: GDIR } };
writeFileSync(join(HERE, "out", `bomba-${TAG}.svg`), svg);
writeFileSync(join(HERE, "out", `bomba-${TAG}.json`), JSON.stringify(DATA));
writeJs();
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Bomba", theme: "light", width: 1000, body: `<style>${readFileSync(join(HERE, "pb.css"), "utf8")}</style><div class="iso-stage" id="pbFig">${svg}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + "\nvar PB_DATA = " + JSON.stringify(DATA) + ";\n" + readFileSync(join(HERE, "drive_test.js"), "utf8") }));
console.log("bomba", TAG, "items", R_.items.length, "scale", G.scaleOf(P).toFixed(3), "svg", svg.length);
if (!FAST) A.auditOrExit(R_, P, {});
