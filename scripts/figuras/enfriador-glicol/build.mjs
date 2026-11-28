/* ====================================================================
   Enfriador de glicol empacado en isométrico (skill anatomy), para el capítulo 26 del libro de operaciones unitarias
   (Refrigeración y congelación): el enfriador de la winterización, el de TK-201 en el ejemplo 26.2.
   Concepto: un ciclo de compresión de vapor con propano, entero en un gabinete al aire libre. El compresor hermético
   aspira el vapor del evaporador y lo descarga caliente al condensador de tubos aleteados del extremo, por donde el
   ventilador de arriba hace pasar el aire de afuera; el líquido baja al recibidor, pasa por el filtro secador y la
   mirilla y llega a la válvula de expansión termostática, que lo deja entrar al evaporador de placas soldadas según el
   sobrecalentamiento que mide su bulbo en la succión. En el evaporador hierve el propano y se enfría
   el glicol, que la bomba saca del tanque hacia la camisa de TK-201 y que vuelve por el evaporador al tanque. El
   tablero con el controlador de temperatura arranca y para el compresor, y los presostatos de alta y de baja lo paran
   si la presión se sale de su rango.
   Corte: se quitó el panel entero del costado largo que mira al lector (y > 0), de la base al techo. Adentro no hay
   tabique: el condensador y el compresor van a la derecha (+x), el refrigerante en el medio y el glicol a la izquierda
   (−x). Lo que queda atrás a la derecha lo tapa el serpentín y lo alto de la pared de atrás lo tapa el techo, así que
   el evaporador y los presostatos van bajos, y el recibidor y el tablero, adelante (geo.mjs).
   La figura es solo del libro: el equipo es más bajo que una persona, así que lleva la mano de referencia
   (../persona.mjs, manoEnBorde), apoyada en el canto de atrás del techo.
   Uso: node build.mjs [--audit] [--fast]   (EG_ITEM="pieza" lista lo que se cruza con una pieza en pantalla;
   EG_PAIRS="pieza" da los pares del orden de una pieza)
   Unidades: 1 = 1 mm. Medidas en geo.mjs.
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
const X = await import(join(HERE, "../extractor-arrastre/xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const { manoEnBorde, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const STEP = Number(process.env.EG_STEP || 0.25);
const EG = GEO.EG, DN = GEO.DN, CU = GEO.CU, CO = EG.coil;
const AZ = EG.AZ, EL = EG.EL;
const XB = EG.X, YB = EG.Y, T = EG.t;
const ZP = EG.zPan + T;                          // la cara de arriba de la base
const ZD = EG.zDeck, ZD1 = ZD + T;               // el techo
const yIn = -YB + T, xInL = -XB + T;             // las caras de adentro de la pared de atrás y del extremo de −x

const W = 900, H = 700;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const pol = (r, deg, z = 0, cx = 0, cy = 0) => [cx + r * Math.cos(deg * D2R), cy + r * Math.sin(deg * D2R), z];
const radial = (deg) => [Math.cos(deg * D2R), Math.sin(deg * D2R), 0];
const tangent = (deg) => [-Math.sin(deg * D2R), Math.cos(deg * D2R), 0];
const ANCH = {};                                 // los puntos de los rótulos del libro (libro.mjs)

const FAN = EG.fan, FM = EG.fmot, CP = EG.comp, RC = EG.rec, LQ = EG.liq, BP = EG.bphe, TK = EG.tank, PU = EG.pump;
const GL = EG.gly, PN = EG.panel, PS = EG.pres, SU = EG.suc, HD = EG.hdr;

/* ---------- la cámara ---------- */
const EXT = [];
for (const x of [-XB - 6, XB + 6]) for (const y of [-YB - 6, YB + 6]) EXT.push([x, y, 0], [x, y, ZD1]);
for (const x of [EG.pad.x0, EG.pad.x1]) for (const y of [EG.pad.y0, EG.pad.y1]) EXT.push([x, y, 0]);
EXT.push([FAN.x, FAN.y, 1340], [FAN.x + 120, FAN.y + 120, 1320], [820, -120, 560], [820, 160, 820]);
EXT.push([-800, 460, GL.zRet - 40], [-660, 460, GL.zSup + 40], [-230, -560, 1180]);
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso

/* El dibujo va en milímetros; el audit, en centímetros (como el extractor y el condensador evaporativo): cm() pasa cada
   forma registrada a centímetros (con sus cortes) y PA es la misma cámara con la escala por 10. */
const U = 0.1, CMC = new WeakMap();
function cm(sh) {
  if (!sh || typeof sh !== "object") return sh;
  if (Array.isArray(sh)) return sh.map(cm);
  if (CMC.has(sh)) return CMC.get(sh);
  const sc = (v) => v.map((q) => q * U), out = { ...sh };
  delete out._b; delete out._f;
  if (sh.F) out.F = { ...sh.F, o: sc(sh.F.o) };
  if (sh.kind === "body") out.poly = sh.poly.map(([a, b]) => [a * U, b * U]);
  if (sh.kind === "prism") { out.poly = sh.poly.map(([a, b]) => [a * U, b * U]); out.s0 = sh.s0 * U; out.s1 = sh.s1 * U; }
  if (sh.kind === "box") { out.o = sc(sh.o); out.half = sc(sh.half); }
  if (sh.kind === "ball") { out.o = sc(sh.o); out.r = sh.r * U; if (sh.flats) out.flats = sh.flats.map(([a, b, c, d]) => [a, b, c, d * U]); }
  if (sh.kind === "tube") { out.points = sh.points.map(sc); out.radii = sh.radii.map((r) => r * U); if (sh.tips) out.tips = sh.tips.map((t) => t && sc(t)); }
  if (sh.cut) out.cut = Array.isArray(sh.cut) ? sh.cut.map(cm) : cm(sh.cut);
  CMC.set(sh, out);
  return out;
}
const PA = { ...P, scale: P.scale / U };
const R_ = A.recorder(PA, { order: [], spring: {} });
const record = (sh) => { R_.solid(cm(sh)); return sh; };
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref.map((v) => v * U), svg, shapes: shapes.map(cm), move: [0, 0, 0], ...rest });
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", ground, owner, cls = "", inner = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground, owner }, steps));
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", inner, ...style }) + extra, cls), [shape]);
  return shape;
}
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, rec = true } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) });
  const shape = rec ? record(sh) : sh;
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra, [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", rims, owner, smooth, steps, bevel = 0, cls = "", cut = null, inner = "", hole = null } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(hole ? { hole } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const meta = { name, owner, ...(cut ? { cut } : {}) };
  const shape = record(hole ? A.body(F, profile.map(([s, r]) => [s, r]), meta) : A.solid(F, profile, meta));
  let body = S(paths, { tone: "mid", inner, ...style });
  if (hole) body = body.replace('<g class="iso-solid"', '<g class="iso-solid" fill-rule="evenodd"');
  put(name, G.add3(F.o, G.mul3(F.a, mid)), wrap(body + extra, cls), [shape]);
  return shape;
}
// un cilindro corto (perno, pasador, tapón, brida) o un tramo recto de tubo: prisma de sección circular
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null, cap = "auto" } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * G.scaleOf(P)) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cap, ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 140, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, spacing = null, owner = name, bundle } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, bundle, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
// un tubo con sus curvas (fillet), de un extremo a otro
function pipe(name, control, r, R, { cls = "", maxLength = 140, gaps = [], ends = [true, true], owner = name, caps = true, seg = 24 } = {}) {
  const line = G.fillet(control, R, seg, { P, tube: r });
  tubeItems(name, line, r, { cls, gaps, maxLength, ends, owner, caps });
  return line;
}
// la longitud de una ruta hasta cada punto de control (para poner cortes en el aislamiento)
const lengthTo = (line, test) => { let s = 0; for (let i = 1; i < line.length; i++) { if (test(line[i - 1])) return s; s += G.len3(G.sub3(line[i], line[i - 1])); } return s; };
const totalOf = (line) => { let s = 0; for (let i = 1; i < line.length; i++) s += G.len3(G.sub3(line[i], line[i - 1])); return s; };
// un cilindro (cuello, boquilla) de radio a a lo largo de F.a, desde la superficie curva (start(ángulo) = s donde la
// generatriz toca la superficie) hasta la cara plana en s = h. Se registra como disco cortado por sus anfitriones.
function saddle(name, F, a, start, h, style = {}, { owner, cls = "", extra = "", hosts = [], ref = null } = {}) {
  const low = Math.min(...Array.from({ length: 72 }, (_, i) => start((i / 72) * TAU)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, ref ?? G.add3(F.o, G.mul3(F.a, (low + h) / 2)), wrap(body, cls), [record(A.disc(F, low - 0.05, h, a, { name, owner, cut: hosts }))]);
  return { F, face: G.add3(F.o, G.mul3(F.a, h)), low };
}
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: XD, v: YD });
const FXL = (y, z) => ({ o: [0, y, z], a: XD, u: YD, v: ZD3 });     // a lo largo de x, por (y, z)
const FYL = (x, z) => ({ o: [x, 0, z], a: YD, u: XD, v: ZD3 });     // a lo largo de y, por (x, z)
const F0 = FZ();

/* ---------- superficies con tonos suaves (del condensador evaporativo) ---------- */
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
function surface(P3, N3, f0, f1, nf, out) {
  const cls = (f) => { const n = N3(f); return G.dot3(n, V3) <= 1e-4 ? -1 : BAND(G.dot3(n, L3)); };
  const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
  const bands = [];
  for (let i = 0; i < nf; i++) bands.push(cls((fOf(i) + fOf(i + 1)) / 2));
  for (let i = 0; i < nf; ) {
    let j = i; while (j + 1 < nf && bands[j + 1] === bands[i]) j++;
    if (bands[i] >= 0) {
      const pts = []; for (let q = i; q <= j + 1; q++) pts.push(P3(fOf(q), 0)); for (let q = j + 1; q >= i; q--) pts.push(P3(fOf(q), 1));
      const d = pth1(pts.map(pr)); out.by[bands[i]].push(d); out.fill.push(d);
    }
    i = j + 1;
  }
}
function toned(build, cls = "") {
  const out = { by: [[], [], [], [], []], fill: [] };
  build(out);
  return `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">` + out.by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "") + "</g>";
}
function flatFace(pts, n, cls = "", holes = []) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr)) + holes.map((h) => pth1(h.map(pr))).join("");
  const rule = holes.length ? ` fill-rule="evenodd"` : "";
  return `<g class="iso-solid${cls ? " " + cls : ""}">` + (b >= 4 ? `<path class="iso-top"${rule} d="${d}"/>` : `<path class="iso-shade" data-shade="${b}"${rule} d="${d}"/>`) + "</g>";
}
const cylP = (r, z0, z1, cx = 0, cy = 0) => (f, u) => [cx + r * Math.cos(f), cy + r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
const arcPts = (r, z, f0, f1, n = 72, cx = 0, cy = 0) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [cx + r * Math.cos(t), cy + r * Math.sin(t), z]; });
const fS = (AZ - 90) * D2R + TAU;                      // la silueta de la derecha de un cilindro vertical
const fSL = fS - PI;                                   // la de la izquierda
// un anillo de eje vertical (brida, aro, banda) en (cx, cy): la banda de afuera que se ve, la de adentro (por el hueco,
// si se pide) y la cara de arriba
function ring(name, r0, r1, z0, z1, cls, { owner, extra = "", cx = 0, cy = 0, inside = true, top: withTop = true } = {}) {
  const inner = inside ? toned((o) => surface(cylP(r0, z0, z1, cx, cy), cylN(-1), fSL, fS, 96, o), cls) : "";
  const outer = toned((o) => surface(cylP(r1, z0, z1, cx, cy), cylN(1), fS - TAU, fSL, 96, o), cls);
  // la cara de arriba: entera si el hueco se ve; si el anillo abraza un sólido (inside = false), solo la mitad de adelante
  const top = !withTop ? "" : inside ? flatFace(arcPts(r1, z1, 0, TAU, 120, cx, cy).slice(0, -1), ZD3, cls, [arcPts(r0, z1, 0, TAU, 120, cx, cy).slice(0, -1).reverse()])
    : flatFace([...arcPts(r1, z1, fS - TAU, fSL, 60, cx, cy), ...arcPts(r0, z1, fSL, fS - TAU, 60, cx, cy)], ZD3, cls);
  const sil = [fS, fSL].map((f) => path3([[cx + r1 * Math.cos(f), cy + r1 * Math.sin(f), z0], [cx + r1 * Math.cos(f), cy + r1 * Math.sin(f), z1]])).join("");
  const rims = inside ? path3(arcPts(r1, z1, 0, TAU, 120, cx, cy)) + path3(arcPts(r0, z1, 0, TAU, 120, cx, cy)) : withTop ? path3(arcPts(r1, z1, fS - TAU, fSL, 60, cx, cy)) + path3(arcPts(r0, z1, fS - TAU, fSL, 60, cx, cy)) : path3(arcPts(r1, z1, fS - TAU, fSL, 60, cx, cy));
  const edges = Ln(rims + path3(arcPts(r1, z0, fS - TAU, fSL, 60, cx, cy)) + sil, { tone: "mid" });
  // si abraza un sólido, solo se dibuja (y se registra) la mitad de adelante
  const shape = record(inside ? A.body(FZ(cx, cy, 0), [[z0, r0], [z0, r1], [z1, r1], [z1, r0]], { name, owner }) : A.prism(FZ(cx, cy, 0), sector(r0, r1, fS - TAU, fSL, 48), z0, z1, { name, owner }));
  put(name, [cx + r1 * HV[0], cy + r1 * HV[1], (z0 + z1) / 2], inner + outer + top + edges + extra, [shape]);
}
function sector(r0, r1, a0, a1, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
// un círculo dibujado en una cara (el borde de un pasamuros), como línea cerrada
const circleOn = (c, n1, n2, r, tone = "lo") => Ln(path3(Array.from({ length: 48 }, (_, i) => { const t = (i / 48) * TAU; return G.add3(c, G.add3(G.mul3(n1, r * Math.cos(t)), G.mul3(n2, r * Math.sin(t)))); }), true), { tone });

/* ====================================================================
   1 · la losa, los perfiles, la base, las paredes (sin el costado de +y), el tabique, el marco del condensador, los
   ángulos de las esquinas y el techo con el hueco del ventilador
   ==================================================================== */
box("pad", [EG.pad.x0, EG.pad.y0, 0], [EG.pad.x1, EG.pad.y1, EG.pad.h], { tone: "mid" }, { r: 6, steps: 2, bevel: 0.6, cls: "eg-conc", ground: true });
EG.rail.y.forEach((yb, i) => {
  const { h, b, t, x0, x1 } = EG.rail, z0 = EG.pad.h, z1 = z0 + h, sg = yb > 0 ? -1 : 1;
  // perfil en C con el alma afuera y las alas hacia el centro
  const Cs = [[-b / 2, z0], [b / 2, z0], [b / 2, z0 + t], [-b / 2 + t, z0 + t], [-b / 2 + t, z1 - t], [b / 2, z1 - t], [b / 2, z1], [-b / 2, z1]];
  fp(`rail${i}`, { o: [0, yb, 0], a: XD, u: [0, sg, 0], v: ZD3 }, Cs, x0, x1, { tone: "mid" }, { cls: "eg-paint", ground: true });
  // los pernos de anclaje, en el ala de abajo
  [x0 + 60, x1 - 60].forEach((xa, q) => disc(`rail${i}.bolt${q}`, FZ(xa, yb, 0), z0 + t, z0 + t + 9, 9, { tone: "mid" }, { owner: `rail${i}`, cls: "eg-cast", n: 6 }));
});
box("pan", [-XB, -YB, EG.zPan], [XB, YB, ZP], { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
// la pestaña de adelante de la base (el borde que queda del panel que se quitó)
box("pan.lip", [-XB + 30, YB - T, ZP], [XB - 30, YB, ZP + 40], { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
const seamZ = (x, y, z0, z1) => Ln(path3([[x - 4, y, z0], [x - 4, y, z1]]) + path3([[x + 4, y, z0], [x + 4, y, z1]]), { tone: "faint" }) +
  Dots(Array.from({ length: Math.floor((z1 - z0) / 150) }, (_, i) => at([x, y, z0 + 75 + i * 150])), { size: 0.45, tone: "lo" });
// la pared de atrás, con una costura en cada compartimiento
box("back", [-XB + T, -YB, ZP], [XB - T, yIn, ZD], { tone: "mid" }, { owner: "casing", cls: "eg-gal", extra: seamZ(-330, yIn + 0.4, ZP, ZD) + seamZ(330, yIn + 0.4, ZP, ZD) });
// el extremo de −x, con las rejillas de ventilación del compartimiento del glicol (el propano pide un gabinete
// ventilado: ranuras abajo y arriba, vistas por dentro) y los pasamuros del glicol
{
  let slots = "";
  const xs = xInL + 0.4, slot = (yc, zc) => { const w = 34, h = 6, pts = []; for (let i = 0; i <= 12; i++) { const t = -PI / 2 + (PI * i) / 12; pts.push([xs, yc + w + h * Math.cos(t), zc + h * Math.sin(t)]); } for (let i = 0; i <= 12; i++) { const t = PI / 2 + (PI * i) / 12; pts.push([xs, yc - w + h * Math.cos(t), zc + h * Math.sin(t)]); } return pts; };
  for (const zc of [250, 280, 310, 960, 990, 1020]) for (const yc of [-230, -130, -30, 70, 170]) slots += `<path class="eg-slot" d="${pth1(slot(yc, zc).map(pr))}"/>` + Ln(path3(slot(yc, zc), true), { tone: "lo" });
  const pass = circleOn([xs, GL.ySup, GL.zSup], YD, ZD3, 22) + circleOn([xs, GL.yRet, GL.zRet], YD, ZD3, 22);
  box("left", [-XB, -YB, ZP], [xInL, YB, ZD], { tone: "mid" }, { owner: "casing", cls: "eg-gal", extra: slots + pass });
}
// el extremo de +x: el marco del condensador (abajo, arriba y a los lados del serpentín)
box("right.bot", [XB - T, -YB, ZP], [XB, YB, CO.z0 - 5], { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
box("right.top", [XB - T, -YB, CO.z1 + 5], [XB, YB, ZD], { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
box("right.l", [XB - T, -YB, CO.z0 - 5], [XB, CO.y0 - 3, CO.z1 + 5], { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
box("right.r", [XB - T, CO.y1 + 3, CO.z0 - 5], [XB, YB, CO.z1 + 5], { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
// la placa de datos y la advertencia del refrigerante inflamable, en la franja de abajo del extremo
{
  const xd = XB, y0 = -170, y1 = 20, z0 = ZP + 6, z1 = CO.z0 - 12;
  const rules = Ln([0.3, 0.5, 0.7].map((f) => path3([[xd + 3.3, y1 - 20, z0 + (z1 - z0) * f], [xd + 3.3, y0 + 20, z0 + (z1 - z0) * f]])).join(""), { tone: "lo", free: true });
  box("plate", [xd, y0, z0], [xd + 3, y1, z1], { tone: "mid" }, { owner: "casing", cls: "eg-ss", r: 2, extra: rules + Dots([[y0 + 8, z0 + 6], [y1 - 8, z0 + 6], [y1 - 8, z1 - 6], [y0 + 8, z1 - 6]].map(([y, z]) => at([xd + 3.3, y, z])), { size: 0.45 }) });
  // el triángulo amarillo con su borde y su signo de admiración
  const yc = 75, zc = (z0 + z1) / 2, s = 22, tri = [[xd + 0.5, yc - s, zc - s * 0.6], [xd + 0.5, yc + s, zc - s * 0.6], [xd + 0.5, yc, zc + s * 0.95]];
  const svg = `<path class="eg-warn" d="${pth1(tri.map(pr))}"/>` + Ln(path3(tri, true), { tone: "mid" }) + Ln(path3([[xd + 0.6, yc, zc + s * 0.5], [xd + 0.6, yc, zc - s * 0.1]]), { tone: "mid", free: true }) + Dots([at([xd + 0.6, yc, zc - s * 0.35])], { size: 0.7, tone: "mid" });
  put("warn", [xd + 0.5, yc, zc], svg, [A.box([xd, yc - s, zc - s * 0.6], [xd + 0.5, yc + s, zc + s])]);
  ANCH.PLACA = [xd + 3, (y0 + y1) / 2, z1 - 6];
  ANCH.ADVERTENCIA = [xd + 0.5, yc + s * 0.3, zc + s * 0.4];
}
// los ángulos de las esquinas (30 × 30 × 3), de la base al techo, y el del borde de adelante del techo
{
  const z0 = EG.zPan, z1 = ZD1, a = 30, e = 3;
  const corner = (name, x, y, sx, sy) => {
    const xs = [x, x + sx * e].sort((p, q) => p - q), ys = [y - sy * a, y + sy * e].sort((p, q) => p - q);
    fp(name + ".x", F0, rect(xs[0], xs[1], ys[0], ys[1]), z0, z1, { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
    const xs2 = [x - sx * a, x].sort((p, q) => p - q), ys2 = [y, y + sy * e].sort((p, q) => p - q);
    fp(name + ".y", F0, rect(xs2[0], xs2[1], ys2[0], ys2[1]), z0, z1, { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
  };
  corner("corner.fl", -XB, YB, -1, 1);
  corner("corner.fr", XB, YB, 1, 1);
  corner("corner.br", XB, -YB, 1, -1);
  corner("corner.bl", -XB, -YB, -1, -1);
  fp("frame.top", { o: [0, 0, 0], a: XD, u: YD, v: ZD3 }, [[YB - a, ZD - e], [YB, ZD - e], [YB, ZD - a], [YB + e, ZD - a], [YB + e, ZD], [YB - a, ZD]], -XB + a, XB - a, { tone: "mid" }, { owner: "casing", cls: "eg-gal" });
}
// el techo, con el hueco del ventilador
{
  const RH = FAN.r;                       // el hueco: el anillo cuelga del techo por su borde de arriba
  const outer = [[-XB, -YB, ZD1], [XB, -YB, ZD1], [XB, YB, ZD1], [-XB, YB, ZD1]];
  const hole = arcPts(RH, ZD1, 0, TAU, 96, FAN.x, FAN.y).slice(0, -1).reverse();
  const top = flatFace(outer, ZD3, "eg-gal", [hole]);
  const front = flatFace([[-XB, YB, ZD], [XB, YB, ZD], [XB, YB, ZD1], [-XB, YB, ZD1]], YD, "eg-gal");
  const right = flatFace([[XB, -YB, ZD], [XB, YB, ZD], [XB, YB, ZD1], [XB, -YB, ZD1]], XD, "eg-gal");
  const edges = Ln(path3(outer, true) + path3([[-XB, YB, ZD], [XB, YB, ZD], [XB, -YB, ZD]]) + path3([[XB, YB, ZD], [XB, YB, ZD1]]) + path3([[-XB, YB, ZD], [-XB, YB, ZD1]]), { tone: "mid" });
  const seams = Ln([-330, 60].map((x) => path3([[x, -YB, ZD1 + 0.3], [x, YB, ZD1 + 0.3]])).join(""), { tone: "faint" }) +
    Dots([-330, 60].flatMap((x) => [-240, -80, 80, 240].map((y) => at([x + 12, y, ZD1 + 0.3]))), { size: 0.45, tone: "lo" });
  const shape = record(A.prism(F0, rect(-XB, XB, -YB, YB), ZD, ZD1, { name: "deck", owner: "casing", cut: [A.disc(FZ(FAN.x, FAN.y, 0), ZD - 10, ZD1 + 10, RH)] }));
  put("deck", [0, 0, ZD], front + right + top + seams + edges, [shape]);
  ANCH.TECHO = [-420, -150, ZD1];
}

/* ====================================================================
   2 · el condensador: el paquete de aletas, la placa de adelante con los codos de retorno de las dos hileras, los
   cabezales de entrada y de salida
   ==================================================================== */
const zT = GEO.zTube;
{
  // las aletas: líneas verticales en la cara de afuera y a lo largo de x en la de arriba (dibujadas cada 12 mm; las
  // reales van cada 2,1 mm)
  let fins = "", tops = "";
  for (let y = CO.y0 + CO.fin; y < CO.y1 - 2; y += CO.fin) { fins += path3([[CO.x1 + 0.3, y, CO.z0], [CO.x1 + 0.3, y, CO.z1]]); tops += path3([[CO.x0, y, CO.z1 + 0.3], [CO.x1, y, CO.z1 + 0.3]]); }
  box("coil.fins", [CO.x0, CO.y0, CO.z0], [CO.x1, CO.y1, CO.z1], { tone: "mid" }, { owner: "coil", cls: "eg-fin", extra: Ln(fins, { tone: "faint" }) + Ln(tops, { tone: "faint" }) });
  ANCH.CONDENSADOR = [CO.x1, -120, 700];
  // las placas de los extremos del paquete (la de atrás casi no se ve)
  box("coil.tsB", [CO.x0 - 2, CO.y0 - CO.ts, CO.z0 - 5], [CO.x1 + 2, CO.y0, CO.z1 + 5], { tone: "mid" }, { owner: "coil", cls: "eg-gal" });
  box("coil.tsF", [CO.x0 - 2, CO.y1, CO.z0 - 5], [CO.x1 + 2, CO.y1 + CO.ts, CO.z1 + 5], { tone: "mid" }, { owner: "coil", cls: "eg-gal",
    extra: Dots([[CO.x0 + 4, CO.z0 + 4], [CO.x1 - 2, CO.z0 + 4], [CO.x0 + 4, CO.z1 - 2], [CO.x1 - 2, CO.z1 - 2]].map(([x, z]) => at([x, CO.y1 + CO.ts + 0.3, z])), { size: 0.45 }) });
  // los codos de retorno: en la placa de adelante, los tubos 2k y 2k − 1 de cada hilera (el 29 y el 0 van a los
  // cabezales); la hilera de atrás primero
  const y0 = CO.y1 + CO.ts, ys = y0 + CO.stub;
  let svg = "";
  const shapes = [];
  for (const x of CO.rows) {
    for (let kk = 1; kk <= 14; kk++) {
      const za = zT(2 * kk - 1), zb = zT(2 * kk), zc = (za + zb) / 2, Rb = (zb - za) / 2;
      const route = [[x, y0, za], [x, ys, za]];
      for (let i = 1; i < 12; i++) { const t = -PI / 2 + (PI * i) / 12; route.push([x, ys + Rb * Math.cos(t), zc + Rb * Math.sin(t)]); }
      route.push([x, ys, zb], [x, y0, zb]);
      shapes.push(A.tube(route, CO.ro, { name: "coil.bends", owner: "coil" }));
      const parts = tubePieces(route, CO.ro, P, { maxLength: 1e6, spacing: 6, caps: false });
      const cat = (key) => parts.map((q) => q[key]).join("");
      svg += `<g class="tb"><path class="tb-body" d="${cat("body")}"/><path class="tb-shine" d="${cat("shine")}"/><path class="tb-shade" d="${cat("shade")}"/><path class="iso-line tb-edge" data-tone="mid" d="${cat("edges")}"/></g>`;
    }
  }
  shapes.forEach(record);
  put("coil.bends", [CO.rows[1], ys + 6, (CO.z0 + CO.z1) / 2], `<g class="eg-cu">${svg}</g>`, shapes);
  ANCH.CODOS = [CO.rows[1], ys + CO.R + CO.ro, zT(15) + 4];
  // los cabezales: de entrada (arriba) y de salida (abajo), a lo largo de x, con los dos tubos de cada hilera
  [["hdr.in", HD.zIn, CO.n - 1], ["hdr.out", HD.zOut, 0]].forEach(([nm, z]) => {
    disc(nm, FXL(HD.y, z), HD.x0, HD.x1, HD.ro, { tone: "mid" }, { owner: "coil", cls: "eg-cu" });
    disc(nm + ".cap", FXL(HD.y, z), HD.x1, HD.x1 + 3, HD.ro + 1.2, { tone: "mid" }, { owner: "coil", cls: "eg-cu" });
    const host = A.disc(FXL(HD.y, z), HD.x0, HD.x1, HD.ro);
    CO.rows.forEach((x, q) => saddle(`${nm}.stub${q}`, { o: [x, HD.y, z], a: [0, -1, 0], u: ZD3, v: XD }, CO.ro, (t) => G.saddleStart(HD.ro, CO.ro, t), HD.y - y0, { tone: "mid" }, { owner: "coil", cls: "eg-cu", hosts: [host] }));
  });
  ANCH.CAB_ENTRADA = [HD.x1 - 10, HD.y + HD.ro * 0.6, HD.zIn + 3];
}

/* ====================================================================
   3 · el ventilador axial: la mitad de atrás del anillo, el motor colgado de sus tres brazos, el eje, el cubo y las
   cuatro aspas, la mitad de adelante del anillo, la brida sobre el techo y la malla
   ==================================================================== */
{
  const rI = FAN.r, rO = FAN.r + FAN.tw, cx = FAN.x, cy = FAN.y, z0 = FAN.z0, z1 = ZD;
  const inner = toned((o) => surface(cylP(rI, z0, z1, cx, cy), cylN(-1), fSL, fS, 96, o), "eg-gal");
  put("ring.back", [cx - rI * HV[0], cy - rI * HV[1], (z0 + z1) / 2], inner, [record(A.prism(FZ(cx, cy, 0), sector(rI, rO, fSL, fS, 48), z0, z1, { name: "ring.back", owner: "fan" }))]);
}
{
  const cx = FAN.x, cy = FAN.y, Fm = FZ(cx, cy, 0);
  // el motor: casco con sus dos tapas; los tres brazos de pletina que lo cuelgan del anillo
  disc("fmot.bot", Fm, FM.z0, FM.z0 + 10, FM.r - 6, { tone: "mid" }, { owner: "fan", cls: "eg-motor" });
  let fins = "";
  for (let q = 0; q < 24; q++) { const a = (q / 24) * TAU, n3 = [Math.cos(a), Math.sin(a), 0]; if (G.dot3(n3, V3) > 0.12) fins += path3([[cx + (FM.r + 0.4) * Math.cos(a), cy + (FM.r + 0.4) * Math.sin(a), FM.z0 + 10], [cx + (FM.r + 0.4) * Math.cos(a), cy + (FM.r + 0.4) * Math.sin(a), FM.z1 - 8]]); }
  disc("fmot.body", Fm, FM.z0 + 10, FM.z1 - 8, FM.r, { tone: "mid" }, { owner: "fan", cls: "eg-motor", extra: Ln(fins, { tone: "faint" }) });
  disc("fmot.top", Fm, FM.z1 - 8, FM.z1, FM.r - 6, { tone: "mid" }, { owner: "fan", cls: "eg-motor" });
  [90, 210, 330].forEach((deg, q) => fp(`fan.arm${q}`, { o: [cx, cy, 0], a: radial(deg), u: tangent(deg), v: ZD3 }, rect(-9, 9, FM.z1, FM.z1 + 4), 26, FAN.r, { tone: "mid" }, { owner: "fan", cls: "eg-paint" }));
  disc("fan.shaft", Fm, FM.z1, FAN.z, 7, { tone: "mid" }, { owner: "fan", cls: "eg-ss", n: 16 });
  disc("fan.hub", Fm, FAN.z, FAN.z + FAN.hubH, FAN.hub, { tone: "mid" }, { owner: "fan", cls: "eg-cast", extra: Dots(G.dotsOf(Fm, FAN.z + FAN.hubH, FAN.hub * 0.55, 4, P, { all: true }), { size: 0.45 }) });
  const zc = FAN.z + FAN.hubH / 2, pitch = FAN.pitch * D2R, ch = FAN.chord, tb = 4;
  const sec = [[-ch / 2, -2], [ch / 2, -tb / 2], [ch / 2, 0], [ch * 0.25, tb * 0.6], [-ch * 0.3, tb * 0.55], [-ch / 2, 0]];
  for (let q = 0; q < FAN.n; q++) {
    const deg = 20 + (360 * q) / FAN.n, a = radial(deg), tg = tangent(deg);
    const u = G.add3(G.mul3(tg, Math.cos(pitch)), G.mul3(ZD3, Math.sin(pitch))), v = G.unit3(G.cross3(a, u));
    fp(`fan.blade${q}`, { o: [cx, cy, zc], a, u, v }, sec, FAN.hub, FAN.tip, { tone: "mid" }, { owner: "fan", cls: "eg-blade" });
  }
  ANCH.VENTILADOR = G.add3(pol(FAN.tip * 0.7, 20 + 360 * 3 / FAN.n, zc, cx, cy), [0, 0, 3]);
  ANCH.MOTOR_VENT = G.add3([cx, cy, (FM.z0 + FM.z1) / 2], G.mul3(HV, FM.r));
}
{
  const rI = FAN.r, rO = FAN.r + FAN.tw, cx = FAN.x, cy = FAN.y, z0 = FAN.z0, z1 = ZD;
  // la mitad de adelante del anillo, bajo el techo (se ve por el costado abierto)
  const svg = toned((o) => surface(cylP(rO, z0, z1, cx, cy), cylN(1), fS - TAU, fSL, 120, o), "eg-gal") +
    Ln(path3(arcPts(rO, z0, fS - TAU, fSL, 64, cx, cy)) + path3([[cx + rO * Math.cos(fS), cy + rO * Math.sin(fS), z0], [cx + rO * Math.cos(fS), cy + rO * Math.sin(fS), z1]]) + path3([[cx + rO * Math.cos(fSL), cy + rO * Math.sin(fSL), z0], [cx + rO * Math.cos(fSL), cy + rO * Math.sin(fSL), z1]]), { tone: "mid" });
  put("ring.front", [cx + rO * HV[0], cy + rO * HV[1], (z0 + z1) / 2], svg, [record(A.prism(FZ(cx, cy, 0), sector(rI, rO, fS - TAU, fSL, 48), z0, z1, { name: "ring.front", owner: "fan" }))]);
  // la brida del anillo sobre el techo, con sus pernos, y la malla: un aro y alambres en círculos con ocho radios
  ring("ring.flange", rI, rI + 34, ZD1, ZD1 + 4, "eg-gal", { owner: "fan", cx, cy, extra: Dots(Array.from({ length: 12 }, (_, q) => at(pol(rI + 22, q * 30 + 15, ZD1 + 4.3, cx, cy))), { size: 0.45 }) });
  // los alambres van encima del aro, de borde a borde
  const zg = ZD1 + 4, rr0 = 52, zw = zg + 7.5;
  ring("guard.rim", rI + 6, rI + 16, zg, zg + 6, "eg-ss", { owner: "fan", cx, cy });
  let wires = "";
  for (const r of [rr0, 100, 145, 190]) wires += path3(arcPts(r, zw, 0, TAU, 96, cx, cy).slice(0, -1), true);
  for (let q = 0; q < 8; q++) { const d = 22.5 + q * 45; wires += path3([pol(rr0, d, zw, cx, cy), pol(rI + 16, d, zw, cx, cy)]); }
  put("guard", [cx, cy, zw], Ln(wires, { tone: "mid", className: "eg-malla" }), [A.disc(FZ(cx, cy, 0), zg + 6, zw + 1.5, rI + 13)]);
  ANCH.MALLA = pol(167, 200, zw, cx, cy);
}

/* ====================================================================
   4 · el compresor hermético de pistón, sobre su placa y sus cuatro gomas, con el calentador del cárter, la caja de
   bornes y sus tres tubos (succión atrás, descarga adelante, proceso al lado)
   ==================================================================== */
const Fc = FZ(CP.x, CP.y, 0);
const SH_LO = [[CP.z0, 54], [CP.z0 + 2, 66, 1], [CP.z0 + 8, 78, 1], [CP.z0 + 18, 87, 1], [CP.z0 + 32, CP.r], [CP.zSeam, CP.r]];
const SH_HI = [[CP.zSeam + 6, CP.r], [CP.z1 - 64, CP.r], [CP.z1 - 46, 89, 1], [CP.z1 - 30, 81, 1], [CP.z1 - 17, 68, 1], [CP.z1 - 7, 50, 1], [CP.z1 - 1, 25, 1], [CP.z1, 0]];
{
  box("comp.plate", [CP.x - 115, CP.y - 105, ZP], [CP.x + 115, CP.y + 105, CP.zPlate], { tone: "mid" }, { owner: "comp.base", cls: "eg-paint", r: 3 });
  const G4 = [[-93, -68], [93, -68], [-93, 68], [93, 68]];
  G4.forEach(([dx, dy], q) => disc(`comp.grom${q}`, FZ(CP.x + dx, CP.y + dy, 0), CP.zPlate, CP.zFoot, 13, { tone: "mid" }, { owner: "comp.base", cls: "eg-rub" }));
  box("comp.foot", [CP.x - 105, CP.y - 82, CP.zFoot], [CP.x + 105, CP.y + 82, CP.z0], { tone: "mid" }, { owner: "comp", cls: "eg-comp", r: 8 });
  G4.forEach(([dx, dy], q) => fp(`comp.nut${q}`, FZ(CP.x + dx, CP.y + dy, 0), HEX(7.5), CP.z0, CP.z0 + 6, { tone: "mid" }, { owner: "comp", cls: "eg-cast" }));
  turned("comp.lo", Fc, SH_LO, { tone: "mid" }, { owner: "comp", cls: "eg-comp" });
  disc("comp.seam", Fc, CP.zSeam, CP.zSeam + 6, CP.r + 4, { tone: "mid" }, { owner: "comp", cls: "eg-comp" });
  turned("comp.hi", Fc, SH_HI, { tone: "mid" }, { owner: "comp", cls: "eg-comp" });
  // el calentador del cárter: una banda alrededor de la parte de abajo del casco
  ring("comp.heater", CP.r, CP.r + 3, CP.z0 + 42, CP.z0 + 58, "eg-rub", { owner: "comp", cx: CP.x, cy: CP.y, inside: false });
  // la caja de bornes, hacia el lector, con su tapa y dos tornillos (cortada por el casco)
  const hb = 122, Fb = { o: [CP.x, CP.y, 0], a: radial(hb), u: tangent(hb), v: ZD3 };
  fp("comp.tbox", Fb, rect(-30, 30, CP.z0 + 66, CP.z0 + 112), CP.r - 6, CP.r + 34, { tone: "mid" }, { owner: "comp", cls: "eg-comp", cut: [A.solid(Fc, SH_LO.map(([s, r]) => [s, r]))],
    extra: Dots([[-20, CP.z0 + 104], [20, CP.z0 + 74]].map(([u, z]) => at(G.add3(G.add3([CP.x, CP.y, z], G.mul3(radial(hb), CP.r + 34.3)), G.mul3(tangent(hb), u)))), { size: 0.5 }) });
  ANCH.COMPRESOR = G.add3([CP.x, CP.y, CP.zSeam + 70], G.mul3(radial(70), CP.r));
  ANCH.CALENTADOR = G.add3([CP.x, CP.y, CP.z0 + 50], G.mul3(radial(40), CP.r + 3));
}
const shellHost = [A.solid(Fc, SH_LO.map(([s, r]) => [s, r])), A.solid(Fc, SH_HI.map(([s, r]) => [s, r]))];
// los tubos del casco: la descarga hacia adelante, la succión hacia atrás y el tubo de proceso, aplastado, al lado
const zDisC = CP.z1 + 20, ySuc = CP.y - CP.r - 18;
disc("comp.dis", Fc, CP.z1 - 0.3, zDisC, CU[10] + 1.2, { tone: "mid" }, { owner: "comp", cls: "eg-cu" });
saddle("comp.suc", { o: [CP.x, CP.y, CP.zSuc], a: [0, -1, 0], u: XD, v: ZD3 }, CU[12] + 1.2, (t) => G.saddleStart(CP.r, CU[12] + 1.2, t), CP.y - ySuc, { tone: "mid" }, { owner: "comp", cls: "eg-cu", hosts: shellHost });
{
  const hp = 15, Fp = { o: [CP.x, CP.y, CP.zSuc - 40], a: radial(hp), u: tangent(hp), v: ZD3 };
  saddle("comp.proc", Fp, CU[6], (t) => G.saddleStart(CP.r, CU[6], t), CP.r + 30, { tone: "mid" }, { owner: "comp", cls: "eg-cu", hosts: shellHost });
  fp("comp.pinch", Fp, rect(-5, 5, -1.4, 1.4), CP.r + 30, CP.r + 42, { tone: "mid" }, { owner: "comp", cls: "eg-cu" });
}

/* ====================================================================
   5 · el recibidor de líquido, adelante, sobre su placa; la descarga y la línea del condensador al recibidor
   ==================================================================== */
const Fr = FZ(RC.x, RC.y, 0);
// el casco con sus dos fondos semielípticos 2:1
const RPROF = (() => {
  const h = RC.r / 2, out = [[RC.z0, 0]];
  for (let i = 1; i < 8; i++) { const t = (i / 8) * (PI / 2); out.push([RC.z0 + h * (1 - Math.cos(t)), RC.r * Math.sin(t), 1]); }
  out.push([RC.z0 + h, RC.r], [RC.z1 - h, RC.r]);
  for (let i = 7; i >= 1; i--) { const t = (i / 8) * (PI / 2); out.push([RC.z1 - h * (1 - Math.cos(t)), RC.r * Math.sin(t), 1]); }
  out.push([RC.z1, 0]);
  return out;
})();
{
  box("rec.plate", [RC.x - 38, RC.y - 38, ZP], [RC.x + 38, RC.y + 38, ZP + 4], { tone: "mid" }, { owner: "rec.stand", cls: "eg-paint", r: 2,
    extra: Dots([[-30, -30], [30, -30], [30, 30], [-30, 30]].map(([dx, dy]) => at([RC.x + dx, RC.y + dy, ZP + 4.3])), { size: 0.45 }) });
  disc("rec.foot", Fr, ZP + 4, RC.z0 + 0.3, 24, { tone: "mid" }, { owner: "rec.stand", cls: "eg-paint" });
  turned("rec.shell", Fr, RPROF, { tone: "mid" }, { owner: "rec", cls: "eg-paint",
    extra: Ln(path3(arcPts(RC.r + 0.35, RC.z0 + RC.r / 2 + 2, fS - TAU, fSL, 48, RC.x, RC.y)) + path3(arcPts(RC.r + 0.35, RC.z1 - RC.r / 2 - 2, fS - TAU, fSL, 48, RC.x, RC.y)), { tone: "faint" }) });
  ANCH.RECIBIDOR = G.add3([RC.x, RC.y, 300], G.mul3(radial(150), RC.r));
}
const recHost = [A.solid(Fr, RPROF.map(([s, r]) => [s, r]))];
// la boquilla de entrada, de lado, hacia el condensador: a la altura del cabezal de salida y en su línea (a dy del eje
// del recibidor), así la línea del condensador llega recta, sin curvas que en la vista se doblen sobre sí mismas
const dyR = HD.y - RC.y, raR = CU[10] + 1.2, xRin = RC.x + Math.sqrt(RC.r ** 2 - dyR ** 2) + 12;
if (dyR + raR > RC.r - 3) throw new Error("la boquilla del recibidor se sale del casco");
saddle("rec.in", { o: [RC.x, HD.y, HD.zOut], a: XD, u: YD, v: ZD3 }, raR, (t) => Math.sqrt(RC.r ** 2 - (dyR + raR * Math.cos(t)) ** 2), xRin - RC.x, { tone: "mid" }, { owner: "rec", cls: "eg-cu", hosts: recHost });
// la válvula de salida (rotalock) encima: el cuello, el cuerpo hexagonal, la tapa y la salida hacia −x
const zRv = RC.z1 + 18, xRv = RC.x - RC.r - 8;
{
  disc("rec.neck", Fr, RC.z1 - 1.5, RC.z1 + 4, 13, { tone: "mid" }, { owner: "rec.valve", cls: "eg-brass" });
  fp("rec.vbody", Fr, HEX(18), RC.z1 + 4, RC.z1 + 32, { tone: "mid" }, { owner: "rec.valve", cls: "eg-brass" });
  disc("rec.vcap", Fr, RC.z1 + 32, RC.z1 + 50, 11, { tone: "mid" }, { owner: "rec.valve", cls: "eg-brass" });
  disc("rec.vout", FXL(RC.y, zRv), xRv, RC.x - 15.4, 6, { tone: "mid" }, { owner: "rec.valve", cls: "eg-brass" });
  ANCH.VALV_REC = [RC.x, RC.y + 15, RC.z1 + 40];
}
// la descarga: sale por arriba del compresor, sube, va hacia adelante bajo el techo y entra al cabezal de arriba
pipe("dis", [[CP.x, CP.y, zDisC], [CP.x, CP.y, HD.zIn], [CP.x, HD.y, HD.zIn], [HD.x0, HD.y, HD.zIn]], CU[10], 30, { cls: "eg-cu" });
ANCH.DESCARGA = [CP.x + CU[10], CP.y, 760];
// del cabezal de abajo al recibidor
pipe("cond.out", [[HD.x0, HD.y, HD.zOut], [xRin, HD.y, HD.zOut]], CU[10], 24, { cls: "eg-cu" });
ANCH.CAB_SALIDA = [470, HD.y, HD.zOut + CU[10]];
const DR = EG.drier, SG = EG.sight, rL = CU[6];

/* ====================================================================
   6 · el evaporador de placas soldadas, contra la pared de atrás del compartimiento del glicol, con sus soportes y
   sus cuatro conexiones; la válvula de expansión con su bulbo y su igualador
   ==================================================================== */
const xRef = BP.x + BP.w / 2 - BP.inset, xGly = BP.x - BP.w / 2 + BP.inset;       // las dos columnas de conexiones
const zBot = BP.z0 + BP.inset, zTop = BP.z1 - BP.inset;
const yPort = BP.y1 + BP.portL;
{
  const x0 = BP.x - BP.w / 2, x1 = BP.x + BP.w / 2;
  // los soportes: dos ángulos de la pared al paquete
  [BP.z0 + 70, BP.z1 - 90].forEach((z, q) => box(`bphe.brk${q}`, [x0 + 14, yIn, z], [x1 - 14, BP.y0, z + 16], { tone: "mid" }, { owner: "bphe.brk", cls: "eg-paint" }));
  // las placas: líneas en la cara de la derecha y en la de arriba (dibujadas de a dos), y las dos tapas
  let edges = "", tops = "";
  const n = BP.nPl / 2, ya = BP.y0 + 6, yb = BP.y1 - 6;
  for (let i = 1; i < n; i++) { const y = ya + ((yb - ya) * i) / n; edges += path3([[x1 + 0.3, y, BP.z0], [x1 + 0.3, y, BP.z1]]); tops += path3([[x0, y, BP.z1 + 0.3], [x1, y, BP.z1 + 0.3]]); }
  // las juntas soldadas con cobre de las placas se ven como líneas color cobre en el canto
  box("bphe", [x0, BP.y0, BP.z0], [x1, BP.y1, BP.z1], { tone: "mid" }, { owner: "bphe", cls: "eg-ss", r: 6, extra: Ln(edges + tops, { tone: "lo", className: "eg-placa" }) +
    Ln(path3([[x1 + 0.3, BP.y1 - 6, BP.z0], [x1 + 0.3, BP.y1 - 6, BP.z1]]) + path3([[x1 + 0.3, BP.y0 + 6, BP.z0], [x1 + 0.3, BP.y0 + 6, BP.z1]]), { tone: "lo" }) });
  // las conexiones: el propano a la derecha, el glicol a la izquierda
  [[xRef, zBot, BP.portR, "bphe.rin"], [xRef, zTop, BP.portR, "bphe.rout"], [xGly, zTop, BP.portG, "bphe.gin"], [xGly, zBot, BP.portG, "bphe.gout"]].forEach(([x, z, r, nm]) =>
    disc(nm, FYL(x, z), BP.y1, yPort, r, { tone: "mid" }, { owner: "bphe", cls: "eg-ss", extra: Ln(path3(arcPts(r + 0.3, 0, 0, TAU, 40).map(([u, v]) => [x + u, yPort - 6, z + v])), { tone: "faint" }) }));
  ANCH.EVAPORADOR = [x1, (BP.y0 + BP.y1) / 2, (BP.z0 + BP.z1) / 2 + 30];
}
// la válvula de expansión termostática, en la entrada del propano: el cuerpo, el cabezal de diafragma, el tornillo de
// ajuste abajo, las tuercas de entrada y de salida y la conexión del igualador
const TX = EG.txv, xTx = xRef, yTx = TX.y, zTx = TX.z;
{
  box("txv.body", [xTx - 20, yTx - 17, zTx - 20], [xTx + 20, yTx + 17, zTx + 20], { tone: "mid" }, { owner: "txv", cls: "eg-brass", r: 3 });
  const Fh = FZ(xTx, yTx, 0);
  disc("txv.neck", Fh, zTx + 20, zTx + 26, 9, { tone: "mid" }, { owner: "txv", cls: "eg-brass" });
  turned("txv.head", Fh, [[zTx + 26, 24], [zTx + 33, 24], [zTx + 34, 25], [zTx + 37, 25], [zTx + 38, 22, 1], [zTx + 43, 15, 1], [zTx + 46, 7, 1], [zTx + 47, 0]], { tone: "mid" }, { owner: "txv", cls: "eg-ss" });
  fp("txv.adj", Fh, HEX(10), zTx - 38, zTx - 20, { tone: "mid" }, { owner: "txv", cls: "eg-brass" });
  disc("txv.cap", Fh, zTx - 50, zTx - 38, 8, { tone: "mid" }, { owner: "txv", cls: "eg-brass" });
  fp("txv.in", FXL(yTx, zTx), HEX(9, 0), xTx + 20, xTx + 34, { tone: "mid" }, { owner: "txv", cls: "eg-brass" });
  fp("txv.out", FYL(xTx, zTx), HEX(10, 0), yPort, yTx - 17, { tone: "mid" }, { owner: "txv", cls: "eg-brass" });
  fp("txv.eq", FYL(xTx, zTx - 10), HEX(6, 0), yTx + 17, yTx + 27, { tone: "mid" }, { owner: "txv", cls: "eg-brass" });
  ANCH.TXV = [xTx - 20, yTx + 17, zTx + 8];
}
// la línea de líquido: de la válvula del recibidor va hacia −x, corre hacia atrás a lo largo de y con el filtro secador y
// la mirilla, y entra a la válvula de expansión por su lado de +x; toda a la altura de la válvula
if (Math.abs(zRv - zTx) > 0.01) throw new Error("la salida del recibidor y la válvula de expansión van a la misma altura");
pipe("liq.a", [[xRv, RC.y, zRv], [LQ.x, RC.y, zRv], [LQ.x, DR.y1, zRv]], rL, 28, { cls: "eg-cu" });
{
  const Fd = FYL(LQ.x, zRv), n = 4.6;
  turned("drier", Fd, [[DR.y0, n], [DR.y0 + 9, n], [DR.y0 + 13, 10, 1], [DR.y0 + 18, 19, 1], [DR.y0 + 24, DR.r], [DR.y1 - 24, DR.r], [DR.y1 - 18, 19, 1], [DR.y1 - 13, 10, 1], [DR.y1 - 9, n], [DR.y1, n]], { tone: "mid" }, { owner: "drier", cls: "eg-paint",
    extra: Ln(path3([[LQ.x, DR.y1 - 32, zRv + DR.r + 0.4], [LQ.x, DR.y0 + 38, zRv + DR.r + 0.4]]), { tone: "lo", free: true }) + Dots([at([LQ.x, DR.y0 + 32, zRv + DR.r + 0.4])], { size: 0.8, tone: "lo" }) });
  ANCH.FILTRO = [LQ.x + DR.r * 0.5, (DR.y0 + DR.y1) / 2, zRv + DR.r * 0.8];
}
pipe("liq.b", [[LQ.x, DR.y0, zRv], [LQ.x, SG.y + SG.h / 2, zRv]], rL, 14, { cls: "eg-cu" });
{
  // la mirilla: el cuerpo hexagonal a lo largo de y y la ventana hacia +x (hacia el lector): el bisel, el vidrio y el
  // indicador de humedad en el centro
  const Fs = FYL(LQ.x, zRv), ap = SG.r * Math.cos(PI / 6);
  fp("sight", Fs, HEX(SG.r, PI / 2), SG.y - SG.h / 2, SG.y + SG.h / 2, { tone: "mid" }, { owner: "sight", cls: "eg-brass" });
  const Fw = FXL(SG.y, zRv);
  disc("sight.bezel", Fw, LQ.x + ap, LQ.x + ap + 5, 10, { tone: "mid" }, { owner: "sight", cls: "eg-brass",
    extra: `<path class="eg-vidrio-v" d="${pth1(Array.from({ length: 32 }, (_, i) => { const t = (i / 32) * TAU; return pr([LQ.x + ap + 5.3, SG.y + 6.5 * Math.cos(t), zRv + 6.5 * Math.sin(t)]); }))}"/>` +
      Dots([at([LQ.x + ap + 5.4, SG.y, zRv])], { size: 1.1, tone: "mid", className: "eg-indicador" }) });
  ANCH.MIRILLA = [LQ.x + ap + 5, SG.y + 4, zRv + 6];
}
pipe("liq.c", [[LQ.x, SG.y - SG.h / 2, zRv], [LQ.x, yTx, zRv], [xTx + 34, yTx, zRv]], rL, 28, { cls: "eg-cu" });
ANCH.LIQUIDO = [LQ.x + rL, 120, zRv];

/* ====================================================================
   7 · la succión: del evaporador sube, corre bajo el techo hacia el compresor y baja a él; aislada, salvo en el tramo
   del bulbo y del igualador, junto al evaporador, en la toma del presostato de baja y en el tramo que entra al compresor
   ==================================================================== */
const rS = CU[12], rI = SU.ins;
const yBulb0 = yPort + 15, yBulb1 = yBulb0 + 56, rB = 9, xBulb = xRef + rS + rB, yEq = SU.yA - SU.R - 8;
const xLp = PS.x0 + 89;                         // la toma del presostato de baja, sobre el presostato (el de la derecha)
{
  const line = G.fillet([[xRef, yPort, zTop], [xRef, SU.yA, zTop], [xRef, SU.yA, SU.z], [CP.x, SU.yA, SU.z], [CP.x, SU.yA, CP.zSuc], [CP.x, ySuc, CP.zSuc]], SU.R, 9);
  // la succión va desnuda junto al evaporador, donde van el bulbo y el igualador, y el aislamiento arranca en la subida
  const tot = totalOf(line), s1 = lengthTo(line, (q) => q[2] >= zTop + SU.R - 0.5);
  const sLp = lengthTo(line, (q) => q[2] > SU.z - 0.5 && q[0] >= xLp) - (line.find((q) => q[2] > SU.z - 0.5 && q[0] >= xLp)[0] - xLp);
  const lp0 = sLp - 22, lp1 = sLp + 22, s2 = tot - 40;
  // el cobre y su aislamiento son un mismo tubo (bundle): el aislamiento empieza donde el cobre deja de verse
  tubeItems("suc", line, rS, { cls: "eg-cu", gaps: [[s1, lp0], [lp1, s2]], owner: "suc", bundle: "suc" });
  tubeItems("suc.ins", line, rI, { cls: "eg-ins", gaps: [[0, s1], [lp0, lp1], [s2, tot]], ends: [false, false], owner: "suc", bundle: "suc" });
  ANCH.SUCCION = line[Math.floor(line.length * 0.3)];
  // la toma del presostato de baja, hacia abajo
  disc("suc.lp", FZ(xLp, SU.yA, 0), SU.z - rS - 12, SU.z - rS + 1.5, 3.4, { tone: "mid" }, { owner: "suc", cls: "eg-brass" });
}
{
  // el bulbo, a las 3 en punto sobre el tramo horizontal, con sus dos abrazaderas
  const Fb = FYL(xBulb, zTop);
  turned("bulb", Fb, [[yBulb0, 0], [yBulb0 + 0.5, 5, 1], [yBulb0 + 2.5, 8, 1], [yBulb0 + 5, rB], [yBulb1 - 5, rB], [yBulb1 - 2.5, 8, 1], [yBulb1 - 0.5, 5, 1], [yBulb1, 0]], { tone: "mid" }, { owner: "suc", cls: "eg-cu",
    extra: [yBulb0 + 12, yBulb1 - 12].map((s) => Ln(G.arcOf(Fb, s, rB + 0.35, P), { tone: "mid" })).join("") });
  ANCH.BULBO = [xBulb + rB * 0.7, (yBulb0 + yBulb1) / 2, zTop + rB * 0.5];
}
// el capilar del cabezal al bulbo, y el igualador, de la válvula a la succión, después del bulbo
pipe("cap", [[xTx, yTx, zTx + 47], [xTx, yTx, zTx + 110], [xBulb, yPort + 2, zTx + 160], [xBulb, yPort + 2, zTop], [xBulb, yBulb0, zTop]], CU.cap, 10, { cls: "eg-cu" });
const rEq = CU[6] * 0.5 + 0.4, zEq = zTop - rS - 6;
saddle("suc.eqtee", { o: [xTx, yEq, zTop], a: [0, 0, -1], u: XD, v: YD }, rEq + 1.2, (t) => G.saddleStart(rS, rEq + 1.2, t), rS + 6, { tone: "mid" }, { owner: "suc", cls: "eg-cu", hosts: [A.disc(FYL(xTx, zTop), yPort, yEq + 20, rS)] });
pipe("eq", [[xTx, yTx + 27, zTx - 10], [xTx, yEq, zTx - 10], [xTx, yEq, zEq]], rEq, 10, { cls: "eg-cu" });
ANCH.IGUALADOR = [xTx, yEq, (zTx + zTop) / 2];
// la toma del presostato de alta, en la descarga, hacia −x
const zHp = PS.zHp;
disc("dis.hp", FXL(CP.y, zHp), CP.x - CU[10] - 12, CP.x - CU[10] + 1.5, 3.4, { tone: "mid" }, { owner: "dis", cls: "eg-brass" });

/* ====================================================================
   8 · los presostatos de baja y de alta, en la pared de atrás, bajo el evaporador de alto, con sus capilares
   ==================================================================== */
{
  const yp = yIn + 4;
  box("pres.plate", [PS.x0, yIn, PS.z0], [PS.x1, yp, PS.z1], { tone: "mid" }, { owner: "pres", cls: "eg-paint",
    extra: Dots([[PS.x0 + 6, PS.z0 + 6], [PS.x1 - 6, PS.z0 + 6], [PS.x1 - 6, PS.z1 - 6], [PS.x0 + 6, PS.z1 - 6]].map(([x, z]) => at([x, yp + 0.3, z])), { size: 0.45 }) });
  const sw = (nm, x0, x1, reset) => {
    const y0 = yp, y1 = y0 + 38, z0 = PS.z0 + 25, z1 = z0 + 75;
    // en la cara de adelante, la escala con sus marcas; arriba, el tornillo de ajuste
    const yf = y1 + 0.3, scale = path3([[x0 + 8, yf, z1 - 16], [x1 - 8, yf, z1 - 16], [x1 - 8, yf, z1 - 32], [x0 + 8, yf, z1 - 32]], true);
    const ticks = Array.from({ length: 7 }, (_, i) => path3([[x0 + 12 + ((x1 - x0 - 24) * i) / 6, yf, z1 - 32], [x0 + 12 + ((x1 - x0 - 24) * i) / 6, yf, z1 - 27]])).join("");
    box(nm, [x0, y0, z0], [x1, y1, z1], { tone: "mid" }, { owner: "pres", cls: "eg-panel", r: 3, extra: Ln(scale, { tone: "mid" }) + Ln(ticks, { tone: "lo" }) });
    disc(nm + ".adj", FZ((x0 + x1) / 2, (y0 + y1) / 2, 0), z1, z1 + 9, 5, { tone: "mid" }, { owner: "pres", cls: "eg-brass", n: 12 });
    if (reset) disc(nm + ".reset", FYL(x1 - 14, z0 + 20), y1, y1 + 6, 6, { tone: "mid" }, { owner: "pres", cls: "eg-red" });
    return { x0, x1, y0, y1, z0, z1 };
  };
  const hp = sw("pres.hp", PS.x0 + 10, PS.x0 + 56, true), lp = sw("pres.lp", PS.x0 + 64, PS.x0 + 110, false);
  ANCH.PRESOSTATOS = [(lp.x0 + lp.x1) / 2 - 6, lp.y1, lp.z1 - 10];
  // los capilares: el de baja viene adelante y sube a la succión; el de alta corre detrás, por detrás del serpentín, y
  // vuelve hacia el compresor para llegar a la descarga por su lado de −x (curvas de 20 mm, que en la vista no se doblan)
  const xHp = (hp.x0 + hp.x1) / 2, yHp2 = hp.y1 + 49, xHp2 = 250;
  pipe("cap.lp", [[xLp, lp.y1, lp.z0 + 15], [xLp, SU.yA, lp.z0 + 15], [xLp, SU.yA, SU.z - rS - 12]], CU.cap, 20, { cls: "eg-cu" });
  pipe("cap.hp", [[xHp, hp.y1, zHp], [xHp, yHp2, zHp], [xHp2, yHp2, zHp], [xHp2, CP.y, zHp], [CP.x - CU[10] - 12, CP.y, zHp]], CU.cap, 20, { cls: "eg-cu" });
}

/* ====================================================================
   9 · el tanque del glicol, con su tapa, el tapón de llenado, la sonda del controlador y el visor de nivel; la bomba
   ==================================================================== */
const Ft = FZ(TK.x, TK.y, 0);
{
  ring("tank.skirt", TK.r - 25, TK.r - 20, ZP, TK.z0, "eg-ss", { owner: "tank", cx: TK.x, cy: TK.y, inside: false, top: false });
  disc("tank", Ft, TK.z0, TK.z1, TK.r, { tone: "mid" }, { owner: "tank", cls: "eg-ss", n: 64,
    extra: Ln(path3(arcPts(TK.r + 0.4, (TK.z0 + TK.z1) / 2, fS - TAU, fSL, 64, TK.x, TK.y)), { tone: "faint" }) });
  disc("tank.lid", Ft, TK.z1, TK.z1 + 8, TK.r + 8, { tone: "mid" }, { owner: "tank", cls: "eg-ss", n: 64,
    extra: Dots(Array.from({ length: 12 }, (_, q) => at(pol(TK.r, q * 30 + 15, TK.z1 + 8.3, TK.x, TK.y))), { size: 0.45 }) });
  // el tapón de llenado, con sus estrías
  const Ff = FZ(TK.x - 70, TK.y - 60, 0);
  disc("tank.fill", Ff, TK.z1 + 8, TK.z1 + 30, 28, { tone: "mid" }, { owner: "tank", cls: "eg-paint", extra: Ln(G.ribsOf(Ff, TK.z1 + 8, TK.z1 + 30, 28.3, 20, P), { tone: "lo" }) });
  ANCH.TANQUE = G.add3([TK.x, TK.y, 420], G.mul3(radial(105), TK.r));
  ANCH.TAPON = [TK.x - 70, TK.y - 60 + 20, TK.z1 + 26];
}
// el visor de nivel: dos niples, dos codos y el tubo de vidrio con el glicol hasta el nivel
const thG = 52;
{
  const R0 = TK.r + 28, cx = TK.x + R0 * Math.cos(thG * D2R), cy = TK.y + R0 * Math.sin(thG * D2R), zl = 250, zh = 560, rb = 9;
  const host = [A.disc(Ft, TK.z0, TK.z1, TK.r)];
  [zl, zh].forEach((z, q) => {
    const Fn = { o: [TK.x, TK.y, z], a: radial(thG), u: tangent(thG), v: ZD3 };
    saddle(`lvl.nip${q}`, Fn, 5, (t) => G.saddleStart(TK.r, 5, t), R0 - Math.sqrt(rb * rb - 25) + 0.05, { tone: "mid" }, { owner: "lvl", cls: "eg-ss", hosts: host });
    disc(`lvl.ball${q}`, FZ(cx, cy, 0), z - rb, z + rb, rb, { tone: "mid" }, { owner: "lvl", cls: "eg-ss" });
  });
  const Fg = FZ(cx, cy, 0);
  disc("lvl.liq", Fg, zl + rb, TK.zLvl, 6, { tone: "mid" }, { owner: "lvl", cls: "eg-gly" });
  disc("lvl.empty", Fg, TK.zLvl, zh - rb, 6, { tone: "mid" }, { owner: "lvl", cls: "eg-glass" });
  ANCH.NIVEL = [cx + 6 * HV[0], cy + 6 * HV[1], (zl + zh) / 2 + 40];
}
// la sonda del controlador: el prensaestopas en la tapa y el cable al tablero
{
  const xs = TK.x + 70, ys = TK.y + 40;
  fp("probe.gland", FZ(xs, ys, 0), HEX(10), TK.z1 + 8, TK.z1 + 22, { tone: "mid" }, { owner: "probe", cls: "eg-brass" });
  // el prensaestopas del tablero, en su costado de atrás, y el cable: sube, pasa sobre el tanque y por encima del
  // retorno del glicol, y llega al costado del tablero
  const xg = (xInL + PN.x1) / 2, zg = 700;
  fp("panel.gland", FYL(xg, zg), HEX(8), PN.y0 - 12, PN.y0, { tone: "mid" }, { owner: "panel", cls: "eg-brass" });
  pipe("probe.cable", [[xs, ys, TK.z1 + 22], [xs, ys, zg], [xs, 60, zg], [xg, 60, zg], [xg, PN.y0 - 12, zg]], 3, 30, { cls: "eg-cable" });
  ANCH.SONDA = [xs, ys, TK.z1 + 18];
}
// las boquillas del tanque: la salida a la bomba (hacia el lector) y la entrada del glicol que vuelve del evaporador
// la entrada va a un lado del eje del tanque, en la línea que viene del evaporador (GL.yTank), para que su curva quede
// lejos del igualador en la vista
const raT = DN[20].ro + 2.5, dyT = GL.yTank - TK.y, yTo = TK.y + TK.r + 25, xTi = TK.x + Math.sqrt(TK.r ** 2 - dyT ** 2) + 15;
saddle("tank.out", { o: [TK.x, TK.y, PU.z], a: YD, u: XD, v: ZD3 }, 16.7, (t) => G.saddleStart(TK.r, 16.7, t), yTo - TK.y, { tone: "mid" }, { owner: "tank", cls: "eg-ss", hosts: [A.disc(Ft, TK.z0, TK.z1, TK.r)] });
saddle("tank.in", { o: [TK.x, GL.yTank, zBot], a: XD, u: YD, v: ZD3 }, raT, (t) => Math.sqrt(TK.r ** 2 - (dyT + raT * Math.cos(t)) ** 2), xTi - TK.x, { tone: "mid" }, { owner: "tank", cls: "eg-ss", hosts: [A.disc(Ft, TK.z0, TK.z1, TK.r)] });
// la bomba centrífuga, con el eje a lo largo de y: la unión de la succión, la voluta, el soporte, el motor y su tapa
const FPy = { o: [PU.x, 0, PU.z], a: YD, u: XD, v: ZD3 };
const yV0 = yTo + 28, yV1 = yV0 + 58, yDisP = (yV0 + yV1) / 2, zDisP = PU.z + PU.R + 30;
{
  disc("pump.union", FPy, yTo, yTo + 12, 28, { tone: "mid" }, { owner: "pump", cls: "eg-brass", n: 6 });
  disc("pump.neck", FPy, yTo + 12, yV0 + 2, 18, { tone: "mid" }, { owner: "pump", cls: "eg-pump" });
  const vol = [[yV0, 40], [yV0 + 3, 62, 1], [yV0 + 9, 74, 1], [yV0 + 17, PU.R], [yV1 - 17, PU.R], [yV1 - 9, 74, 1], [yV1 - 3, 62, 1], [yV1, 44]];
  turned("pump.volute", FPy, vol, { tone: "mid" }, { owner: "pump", cls: "eg-pump" });
  const host = A.solid(FPy, vol.map(([s, r]) => [s, r]));
  saddle("pump.dnz", { o: [PU.x, yDisP, PU.z], a: ZD3, u: YD, v: XD }, 16, (t) => G.saddleStart(PU.R, 16, t), PU.R + 20, { tone: "mid" }, { owner: "pump", cls: "eg-pump", hosts: [host] });
  disc("pump.dun", FZ(PU.x, yDisP, 0), PU.z + PU.R + 20, zDisP, 26, { tone: "mid" }, { owner: "pump", cls: "eg-brass", n: 6 });
  const ym = yV1 + 14;
  disc("pump.bracket", FPy, yV1, ym, 46, { tone: "mid" }, { owner: "pump", cls: "eg-pump" });
  let fins = "";
  for (let q = 0; q < 24; q++) { const ang = (q / 24) * TAU, n3 = [Math.cos(ang), 0, Math.sin(ang)]; if (G.dot3(n3, V3) > 0.15) fins += path3([[PU.x + (PU.mR + 0.4) * Math.cos(ang), ym + 18, PU.z + (PU.mR + 0.4) * Math.sin(ang)], [PU.x + (PU.mR + 0.4) * Math.cos(ang), ym + 120, PU.z + (PU.mR + 0.4) * Math.sin(ang)]]); }
  disc("pump.mfl", FPy, ym, ym + 8, PU.mR + 3, { tone: "mid" }, { owner: "pump", cls: "eg-motor" });
  disc("pump.motor", FPy, ym + 8, ym + 132, PU.mR, { tone: "mid" }, { owner: "pump", cls: "eg-motor", extra: Ln(fins, { tone: "faint" }) });
  disc("pump.cowl", FPy, ym + 132, YB - 8, PU.mR - 5, { tone: "mid" }, { owner: "pump", cls: "eg-motor", extra: Dots(G.dotsOf(FPy, YB - 8, (PU.mR - 5) * 0.5, 8, P, { all: true }), { size: 0.45 }) });
  fp("pump.tbox", { o: [PU.x, 0, PU.z], a: YD, u: XD, v: ZD3 }, rect(-30, 30, PU.mR - 3, PU.mR + 34), ym + 40, ym + 96, { tone: "mid" }, { owner: "pump", cls: "eg-motor" });
  box("pump.base", [PU.x - 72, yV0 - 10, ZP], [PU.x + 72, YB - 12, ZP + 10], { tone: "mid" }, { owner: "pump", cls: "eg-paint", r: 3 });
  box("pump.foot0", [PU.x - 28, yV0 + 14, ZP + 10], [PU.x + 28, yV1 - 14, PU.z - PU.R + 0.5], { tone: "mid" }, { owner: "pump", cls: "eg-pump", r: 2 });
  [ym + 30, ym + 100].forEach((y, q) => box(`pump.foot${q + 1}`, [PU.x - 50, y - 12, ZP + 10], [PU.x + 50, y + 12, PU.z - PU.mR + 3], { tone: "mid" }, { owner: "pump", cls: "eg-motor", r: 2 }));
  ANCH.BOMBA = G.add3([PU.x, yDisP, PU.z], G.mul3(radial(150), PU.R));
  ANCH.MOTOR_BOMBA = [PU.x + PU.mR * 0.7, ym + 70, PU.z + PU.mR * 0.7];
}

/* ====================================================================
   10 · las líneas del glicol: de la bomba sube y sale por el extremo hacia la camisa de TK-201; la que vuelve entra
   por el extremo al evaporador y del evaporador baja al tanque; afuera, cada una dobla hacia el lector, con su
   válvula de bola roscada y la unión donde sigue
   ==================================================================== */
const DG = DN[20];
pipe("gly.sup", [[PU.x, GL.ySup, zDisP], [PU.x, GL.ySup, GL.zSup], [xInL, GL.ySup, GL.zSup]], DG.ro, 40, { cls: "eg-pipe" });
pipe("gly.ret", [[xInL, GL.yRet, GL.zRet], [xGly, GL.yRet, GL.zRet], [xGly, yPort, GL.zRet]], DG.ro, 40, { cls: "eg-pipe" });
pipe("gly.tank", [[xGly, yPort, zBot], [xGly, GL.yTank, zBot], [xTi, GL.yTank, zBot]], DG.ro, 30, { cls: "eg-pipe" });
ANCH.GLY_IN = [-300, GL.yRet + DG.ro * 0.6, GL.zRet + 6];
// válvula de bola roscada de ¾ in (un equipo así lleva las conexiones roscadas, no bridadas): F.a es el sentido del
// flujo y la cara de entrada está en s0; dos hexágonos, el cuerpo abombado, el cuello, el vástago y la palanca
function ballValve(name, F, s0, { stem = null, owner = name, lever = 110 } = {}) {
  const hx = 20, Lh = 13, Lb = 48, s1 = s0 + 2 * Lh + Lb, r0 = 16, r1 = 24;
  fp(`${name}.h0`, F, HEX(hx, 0), s0, s0 + Lh, { tone: "mid" }, { owner, cls: "eg-cast" });
  const vm = (s0 + s1) / 2, half = Lb / 2;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + Lh + (Lb * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner, cls: "eg-cast" });
  fp(`${name}.h1`, F, HEX(hx, 0), s1 - Lh, s1, { tone: "mid" }, { owner, cls: "eg-cast" });
  const st = stem || ZD3;
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - 9 * 9) - 2, r1 + 14, 9, { tone: "mid" }, { owner, cls: "eg-cast" });
  fp(`${name}.nut`, FS, HEX(7, 0), r1 + 14, r1 + 20, { tone: "mid" }, { owner, cls: "eg-ss" });
  const lv = F.a, FL2 = { o: G.add3(c, G.mul3(st, r1 + 20)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
  fp(`${name}.lever`, FL2, [[0, -7], [4, -7], [4, 7], [0, 7]], -12, lever, { tone: "mid" }, { owner, cls: "eg-lever" });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, r1, s1, top: G.add3(c, G.mul3(st, r1 + 14)) };
}
// donde sigue la línea: un niple, una unión universal (tuerca, anillo y hexágono) y el niple con su copla, donde se
// enrosca la línea que va a la camisa de TK-201
function lineEnd(name, F, s, owner) {
  const ro = DN[20].ro;
  disc(`${name}.nip0`, F, s, s + 30, ro, { tone: "mid" }, { owner, cls: "eg-pipe" });
  fp(`${name}.nut`, F, HEX(23, 0), s + 30, s + 46, { tone: "mid" }, { owner, cls: "eg-cast" });
  disc(`${name}.ring`, F, s + 46, s + 52, 21, { tone: "mid" }, { owner: owner + "2", cls: "eg-cast" });
  fp(`${name}.tail`, F, HEX(19, 0), s + 52, s + 64, { tone: "mid" }, { owner: owner + "2", cls: "eg-cast" });
  disc(`${name}.nip1`, F, s + 64, s + 104, ro, { tone: "mid" }, { owner: owner + "2", cls: "eg-pipe" });
  fp(`${name}.cpl`, F, HEX(19, 0), s + 104, s + 120, { tone: "mid" }, { owner: owner + "2", cls: "eg-cast" });
  return G.add3(F.o, G.mul3(F.a, s + 120));
}
const outLine = (nm, y, z, xTurn, yValve) => {
  pipe(`${nm}.out`, [[-XB, y, z], [xTurn, y, z], [xTurn, yValve, z]], DG.ro, 40, { cls: "eg-pipe" });
  const F = { o: [xTurn, 0, z], a: YD, u: XD, v: ZD3 };
  const v = ballValve(`${nm}.valve`, F, yValve, { owner: `${nm}.valve` });
  const end = lineEnd(`${nm}.end`, F, v.s1, `${nm}.valve`);
  return { v, end };
};
{
  const sup = outLine("gsup", GL.ySup, GL.zSup, -640, 250);
  const ret = outLine("gret", GL.yRet, GL.zRet, -770, 250);
  ANCH.GLY_SUP = sup.end; ANCH.GLY_RET = ret.end;
  ANCH.VALV_GLY = sup.v.top;
}

/* ====================================================================
   11 · el tablero, en el extremo de −x, adelante, con la puerta hacia +x: la caja, la puerta con sus bisagras y su
   cerradura, el controlador de temperatura con su pantalla, el interruptor principal y los dos pilotos
   ==================================================================== */
{
  const xd = PN.x1, ym = (PN.y0 + PN.y1) / 2, zm = (PN.z0 + PN.z1) / 2;
  box("panel", [xInL, PN.y0, PN.z0], [xd - 4, PN.y1, PN.z1], { tone: "mid" }, { owner: "panel", cls: "eg-panel", r: 3 });
  box("panel.door", [xd - 4, PN.y0 + 4, PN.z0 + 4], [xd, PN.y1 - 4, PN.z1 - 4], { tone: "mid" }, { owner: "panel", cls: "eg-panel", r: 3,
    extra: Dots([at([xd + 0.3, PN.y1 - 16, zm])], { size: 1.2, tone: "mid" }) });
  [PN.z0 + 30, PN.z1 - 50].forEach((z, q) => disc(`panel.hinge${q}`, FZ(xd - 2, PN.y0 + 2, 0), z, z + 20, 4, { tone: "mid" }, { owner: "panel", cls: "eg-cast", n: 12 }));
  // el controlador: un marco con la pantalla oscura, dos dígitos y tres botones
  const cy0 = PN.y0 + 26, cy1 = PN.y0 + 102, cz0 = PN.z1 - 72, cz1 = PN.z1 - 34, xf = xd + 8.3, xg = xd + 8.4;
  const digit = (y) => path3([[xg, y, cz0 + 15], [xg, y + 6, cz0 + 15], [xg, y + 6, cz1 - 13], [xg, y, cz1 - 13], [xg, y, cz0 + 15]]);
  box("ctrl", [xd, cy0, cz0], [xd + 8, cy1, cz1], { tone: "mid" }, { owner: "panel", cls: "eg-ctrl", r: 2,
    extra: `<path class="eg-pantalla" d="${pth1([[xf, cy0 + 6, cz0 + 9], [xf, cy0 + 44, cz0 + 9], [xf, cy0 + 44, cz1 - 7], [xf, cy0 + 6, cz1 - 7]].map(pr))}"/>` +
      Ln(digit(cy0 + 12) + digit(cy0 + 24), { tone: "lo", className: "eg-digito" }) +
      Dots([0, 1, 2].map((i) => at([xf, cy0 + 54 + i * 8, (cz0 + cz1) / 2])), { size: 0.9, tone: "mid" }) });
  ANCH.CONTROLADOR = [xd + 8, cy0 + 30, cz1 - 6];
  // el interruptor principal y los pilotos
  const yS = PN.y1 - 46, zS = PN.z0 + 62;
  disc("panel.switch", FXL(yS, zS), xd, xd + 4, 22, { tone: "mid" }, { owner: "panel", cls: "eg-yel" });
  fp("panel.knob", { o: [0, yS, zS], a: XD, u: YD, v: ZD3 }, rect(-5, 5, -17, 17), xd + 4, xd + 14, { tone: "mid" }, { owner: "panel", cls: "eg-knob" });
  [PN.y0 + 40, PN.y0 + 70].forEach((y, q) => disc(`panel.lamp${q}`, FXL(y, zS), xd, xd + 9, 8, { tone: "mid" }, { owner: "panel", cls: q ? "eg-lamp2" : "eg-lamp" }));
  ANCH.TABLERO = [xd, ym + 20, PN.z0 + 26];
  ANCH.INTERRUPTOR = [xd + 4, yS + 14, zS + 12];
}

/* ====================================================================
   12 · las flechas: el aire que entra por el condensador y el que sale por la malla; blancas con borde
   ==================================================================== */
function arrowOf(ctl, { w = 4.4, h = 8, r = 10 } = {}) {
  const smooth = (c, n = 24) => {
    const out = [];
    for (let i = 0; i < c.length - 1; i++) {
      const p0 = c[Math.max(0, i - 1)], p1 = c[i], p2 = c[i + 1], p3 = c[Math.min(c.length - 1, i + 2)];
      for (let j = 0; j < n; j++) {
        const t = j / n, t2 = t * t, t3 = t2 * t;
        out.push([0, 1, 2].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3)));
      }
    }
    out.push(c[c.length - 1]);
    return out;
  };
  const pts = ctl.length > 2 ? smooth(ctl) : [ctl[0], G.lerp3(ctl[0], ctl[1], 0.5), ctl[1]];
  const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[Math.max(0, n - 4)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const base = [b[0] - ux * h, b[1] - uy * h];
  const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
  const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  return { mid: pts[Math.floor(pts.length / 2)], svg: `<path class="eg-flujo-o" d="${line}"/><path class="eg-flujo" d="${line}"/><path class="eg-flujo-p" d="${head}"/>`, shapes: [A.tube(pts, r), A.ball(pts[pts.length - 1], w / G.scaleOf(P))] };
}
function arrow(name, ctl, opts = {}) { const f = arrowOf(ctl, opts); put(name, f.mid, f.svg, f.shapes); }
arrow("air.in0", [[800, -150, 520], [575, -150, 520]]);
arrow("air.in1", [[800, 110, 800], [575, 110, 800]]);
arrow("air.out0", [[FAN.x - 70, -50, ZD1 + 30], [FAN.x - 110, -70, ZD1 + 150], [FAN.x - 150, -90, ZD1 + 250]]);
arrow("air.out1", [[FAN.x + 20, 10, ZD1 + 30], [FAN.x + 20, 10, ZD1 + 160], [FAN.x + 25, 10, ZD1 + 270]]);
arrow("air.out2", [[FAN.x + 90, 70, ZD1 + 30], [FAN.x + 130, 100, ZD1 + 150], [FAN.x + 170, 130, ZD1 + 240]]);
ANCH.AIRE_ENTRA = [700, 110, 800];
ANCH.AIRE_SALE = [FAN.x + 22, 10, ZD1 + 200];

/* ---------- la mano de referencia: apoyada en el canto de atrás del techo (../persona.mjs, manoEnBorde) ---------- */
{
  const MN = EG.mano;
  const m = manoEnBorde({ P, borde: [MN.x, -YB, ZD1], hacia: [0, 1, 0], lado: "der", mm: 1, adentro: MN.adentro, alto: MN.alto, inclina: MN.inclina, gira: MN.gira });
  m.shapes.forEach(record);
  put("mano", m.ref, m.svg, m.shapes);
  ANCH.MANO = m.anclas.MANO;
}

/* ---------- orden y salida ---------- */
if (process.env.EG_ITEM) {
  for (const nm of process.env.EG_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
const t0 = Date.now();
if (!FAST) A.settle(R_, PA, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");
if (!FAST && process.env.EG_PAIRS) {
  const names = process.env.EG_PAIRS.split(","), its = R_.settled.items;
  for (const pp of R_.settled.overlaps.pairs) {
    const a = its[pp.a].name, b = its[pp.b].name;
    if (names.includes(a) || names.includes(b)) console.log(a, "|", b, JSON.stringify(pp.front.map((f) => f && { area: f.area && +f.area.toFixed(2), at: f.at && f.at.map((v) => +v.toFixed(1)) })));
  }
}
R_.items.sort((a, b) => a.key - b.key);
const shades = (p, f, t, s0, s1, s2, s3) => `--anatomy-paper:${p};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s0};--anatomy-shade-1:${s1};--anatomy-shade-2:${s2};--anatomy-shade-3:${s3}`;
const ACERO = shades("#eef0f2", "#eef0f2", "#f7f8f9", "#c9ced3", "#d6dade", "#e1e4e7", "#eceef0");
const FUND = shades("#dfe2e5", "#dfe2e5", "#e9ebed", "#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0");
const PINT = shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4");
const COBRE = shades("#e6cdb4", "#e6cdb4", "#eedcca", "#c49e7c", "#ceac8d", "#d8ba9e", "#dfc4a9");
const CAUCHO = shades("#5d666e", "#5d666e", "#6b747c", "#3e464d", "#475057", "#505960", "#576067");
const VIDRIO = shades("#f1f6fa", "#f1f6fa", "#f7fbfd", "#dfe9f1", "#e6eef4", "#ecf2f7", "#f1f6fa");
const AGUA = shades("#e4eef7", "#e4eef7", "#eef4fa", "#bcd0e6", "#c9d9eb", "#d6e3f1", "#dde8f4");
const AMAR = shades("#f3e9a6", "#f3e9a6", "#f8f1c4", "#dccf7e", "#e4d88d", "#ebe09a", "#efe5a1");
const CSS = `.eg-gal{${ACERO}}.eg-ss{${ACERO}}.eg-fin{${ACERO}}.eg-blade{${ACERO}}.eg-pipe{${ACERO}}
.eg-cast{${FUND}}.eg-lever{${FUND}}
.eg-paint{${PINT}}.eg-motor{${PINT}}.eg-pump{${PINT}}.eg-panel{${PINT}}.eg-ctrl{${FUND}}
.eg-cu{${COBRE}}.eg-brass{${COBRE}}
.eg-comp{${CAUCHO}}.eg-ins{${CAUCHO}}.eg-rub{${CAUCHO}}.eg-cable{${CAUCHO}}.eg-knob{${CAUCHO}}
.eg-glass{${VIDRIO}}.eg-lamp{${VIDRIO}}.eg-gly{${AGUA}}
.eg-yel{${AMAR}}.eg-lamp2{${AMAR}}
.eg-red{${shades("#e8b4ae", "#e8b4ae", "#f0c9c4", "#c2766e", "#cc8a83", "#d69e97", "#dfb0aa")}}
.eg-conc{${shades("#e8e6e1", "#e8e6e1", "#efede9", "#d2cfc8", "#d9d6d0", "#dfddd7", "#e4e2dc")}}
.eg-slot{fill:#525c64;stroke:none}.eg-warn{fill:#f3e9a6;stroke:none}.eg-pantalla{fill:#525c64;stroke:none}
.eg-digito.iso-line{stroke:#fff500}.eg-vidrio-v{fill:#dfe9f1;stroke:none}.eg-indicador{fill:#6e6a00}
.eg-malla.iso-line{stroke:#525c64}.eg-placa.iso-line{stroke:#c49e7c}
.eg-flujo-o{fill:none;stroke:#525c64;stroke-width:3.4px;stroke-linecap:round;stroke-linejoin:round}
.eg-flujo{fill:none;stroke:#ffffff;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round}
.eg-flujo-p{fill:#ffffff;stroke:#525c64;stroke-width:1px;stroke-linejoin:round}
${CSS_PERSONA}`;
const groupsSvg = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
/* el SVG va en línea en la página del libro: los trazos M, L y Z se reescriben con coordenadas relativas en décimas */
function compact(svgText) {
  const num = (v) => { let t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); if (t === "-0") t = "0"; return t.replace(/^(-?)0\./, "$1."); };
  const cat = (list) => list.reduce((acc, t) => (!acc ? t : t.startsWith("-") || (t.startsWith(".") && /\.\d*$/.test(acc) && !/[a-z]$/i.test(acc)) ? acc + t : /[a-z]$/i.test(acc) ? acc + t : acc + " " + t), "");
  return svgText.replace(/ d="([MLZ0-9.\s,-]+)"/g, (whole, d) => {
    const tok = d.match(/[MLZ]|-?\d*\.?\d+(?:e-?\d+)?/g);
    if (!tok) return whole;
    const subs = []; let cur = null, cmd = "";
    for (let i = 0; i < tok.length; ) {
      const t = tok[i];
      if (t === "M") { cmd = "M"; i++; continue; }
      if (t === "L") { cmd = "L"; i++; continue; }
      if (t === "Z") { if (cur) cur.closed = true; cur = null; i++; continue; }
      const pnt = [Math.round(Number(t) * 10) / 10, Math.round(Number(tok[i + 1]) * 10) / 10]; i += 2;
      if (cmd === "M" || !cur) { cur = { pts: [pnt], closed: false }; subs.push(cur); cmd = "L"; } else cur.pts.push(pnt);
    }
    let out = "", cx = 0, cy = 0;
    subs.forEach((sp, k2) => {
      const [x0, y0] = sp.pts[0];
      out += k2 === 0 ? "M" + cat([num(x0), num(y0)]) : "m" + cat([num(x0 - cx), num(y0 - cy)]);
      cx = x0; cy = y0;
      if (sp.pts.length > 1) {
        const ds = [];
        for (let j = 1; j < sp.pts.length; j++) { ds.push(num(sp.pts[j][0] - cx), num(sp.pts[j][1] - cy)); cx = sp.pts[j][0]; cy = sp.pts[j][1]; }
        out += "l" + cat(ds);
      }
      if (sp.closed) { out += "z"; cx = x0; cy = y0; }
    });
    return ` d="${out}"`;
  });
}
const svg = k.figureSvg({ width: W, height: H, label: "Enfriador de glicol empacado sin el panel de adelante", body: [`<style>${CSS}</style><g class="eg-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Enfriador de glicol empacado", theme: "light", width: 1000, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUT, "fig_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
