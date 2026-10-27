/* ====================================================================
   Florentino en isométrico (skill anatomy), para el capítulo 16 del libro de operaciones unitarias (Sedimentación y
   decantación): el decantador de la planta de aceite esencial de cáscara de cítricos, que separa el condensado del
   arrastre de vapor (agua con un 1,3 % de aceite, casi todo d-limoneno, más liviano que el agua) en aceite y agua.
   Concepto: el condensado entra por la tapa a un tubo de calma que baja hasta 500 mm del fondo y sale bajo un
   deflector, debajo de la interfase, sin revolver la capa de aceite. Las gotas de aceite suben por el agua hasta la
   interfase (z₃ = 890 mm) y el aceite sale por el rebose (z₁ = 990 mm). El agua sale por abajo, a 50 mm del fondo,
   y sube por fuera por la pierna hasta el codo de rebose (z₂ = 975 mm): esos 15 mm bajo el rebose del aceite fijan la
   interfase. En lo alto de la pierna, el rompe-sifón la une con el espacio de cabeza para que el recipiente no se
   vacíe por sifón. Dentro del tubo de calma solo hay agua y su nivel queda casi a la altura del codo de la pierna.
   Corte: se quita lo que mira al lector por encima del fondo (y > 0, z > ZF). El fondo plano queda entero; la
   envolvente, la brida, la tapa, el tubo de calma y el deflector se ven cortados por el plano y = 0, y el agua y el
   aceite se dibujan translúcidos en sus caras (la del corte, la interfase y la superficie del aceite).
   Uso: node build.mjs [--audit] [--fast]
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
const X = await import(join(HERE, "xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const FAST = process.argv.includes("--fast");
const STEP = Number(process.env.FL_STEP || 0.25);
const FL = GEO.FL, DN = GEO.DN, RO = GEO.RO, rect = GEO.rect;
const { R, tw, tb, RB } = FL;
const ZF = GEO.ZF, ZT = GEO.ZT, ZTC = GEO.ZTC, Z1 = GEO.Z1, Z2 = GEO.Z2, Z3 = GEO.Z3, ZW = GEO.ZW;
const AZ = FL.AZ, EL = FL.EL;
const RF = FL.flange.rf, ZFL = ZT - FL.flange.t;          // brida de la envolvente: radio y cara de abajo

const W = 600, H = 800;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const pol = (r, deg, z = 0) => [r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z];
const TMINUS = [-Math.sin(AZ * D2R), Math.cos(AZ * D2R), 0];   // hacia la izquierda de la pantalla, en el piso
const TPLUS = G.mul3(TMINUS, -1);                                // hacia la derecha
const radial = (deg) => [Math.cos(deg * D2R), Math.sin(deg * D2R), 0];
const tangent = (deg) => [-Math.sin(deg * D2R), Math.cos(deg * D2R), 0];
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)

/* ---------- puntos de la tubería que fijan la cámara ---------- */
const C80 = DN[80], C32 = DN[32];
const Z0 = ZF + FL.calm.z0;                                       // boca de abajo del tubo de calma
const zF0 = ZTC + FL.calm.up, zF1 = zF0 + C80.ft, zBF = zF1 + C80.ft;   // brida del tubo de calma y brida ciega
const LEG = FL.leg, LD = LEG.deg;
const zc = Z2 + C32.ri;                                           // centro del codo de rebose: su fondo por dentro a z₂
const zTee = ZF + LEG.zT;
const rDesc = LEG.rR + LEG.out;
const EXT = [];
for (let d = 0; d < 360; d += 15) EXT.push(pol(RB, d, ZF - tb), pol(RF, d, ZTC));
FL.legs.degs.forEach((d) => { const c = pol(FL.legs.r, d); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => EXT.push([c[0] + a * FL.legs.plate, c[1] + b * FL.legs.plate, 0])); });
{
  const el = [0, 0, zBF + FL.inlet.up];
  EXT.push(G.add3(el, [0, 0, 60]), G.add3(G.add3(el, G.mul3(TMINUS, FL.inlet.run + 40)), [0, 0, 70]), G.add3(G.add3(el, G.mul3(TMINUS, FL.inlet.run + 40)), [0, 0, -70]));
  EXT.push(pol(rDesc + 300, LD, zTee), pol(rDesc, LD, zTee - 230), pol(rDesc, LD, zc + 60), pol(LEG.rR, LD, ZF + LEG.vz + 40));
  EXT.push(pol(RO + 380, FL.oil.deg, Z1 + 80), pol(RO + 380, FL.oil.deg, Z1 - 40));
}
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso

/* El dibujo va en milímetros; el audit, en centímetros (como el tanque agitado y el filtro de arena). */
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
function turned(name, F, profile, style = {}, { extra = "", owner, smooth, steps, bevel = 0, cls = "", cut = null, inner = "" } = {}) {
  const opts = { bevel, ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, mid)), wrap(S(paths, { tone: "mid", inner, ...style }) + extra, cls), [shape]);
  return shape;
}
// un cilindro corto (perno, pasador, tapón, brida): prisma de sección circular; se registra el cilindro verdadero
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null, ground } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * G.scaleOf(P)) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 140, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, spacing = null, owner = name, limp } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, limp, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
// un racor (te o codo forjado): una esfera con el paso de cada tubo que la cruza o termina en ella
function ball(name, c, Rb, style = {}, { owner, cls = "", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(Rb + 0.6))), G.add3(c, G.mul3(b.dir, Rb + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, Rb, { name, owner, ...(cut.length ? { cut } : {}) }));
  put(name, c, wrap(S(G.sphereOf(c, Rb, P), { tone: "mid", ...style }), cls), [shape]);
  return shape;
}
const entry = (Rb, r) => Math.sqrt(Math.max(0, Rb * Rb - r * r)) - 0.02;
// un cilindro (cuello, asiento) de radio a a lo largo de F.a, desde la superficie curva (start(ángulo) = s donde la
// generatriz toca la superficie) hasta la cara plana en s = h. Se registra como disco cortado por sus anfitriones.
function saddle(name, F, a, start, h, style = {}, { owner, cls = "", extra = "", hosts = [], ref = null } = {}) {
  const low = Math.min(...Array.from({ length: 72 }, (_, i) => start((i / 72) * TAU)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, ref ?? G.add3(F.o, G.mul3(F.a, (low + h) / 2)), wrap(body, cls), [record(A.disc(F, low, h, a, { name, owner, cut: hosts }))]);
  return { F, face: G.add3(F.o, G.mul3(F.a, h)), low };
}
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const hexR = (af) => af / Math.sqrt(3);

/* ---------- superficies con tonos suaves (de la válvula de control, el tanque agitado y el filtro) ---------- */
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
function surface(P3, N3, f0, f1, nf, nu, out, keep = null) {
  const cls = (f, u) => { const n = N3(f, u); return G.dot3(n, V3) <= 1e-4 || (keep && !keep(P3(f, u))) ? -1 : BAND(G.dot3(n, L3)); };
  const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
  const bands = [];
  for (let i = 0; i < nf; i++) bands.push(cls((fOf(i) + fOf(i + 1)) / 2, 0.5));
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
// una cara plana: polígono 3D con su normal; tono por la luz
function flatFace(pts, n, cls = "") {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return `<g class="iso-solid${cls ? " " + cls : ""}">` + (b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`) + "</g>";
}
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: XD, v: YD });
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD3 };     // el plano del corte: sección (x, z), espesor a lo largo de y
const F0 = FZ();
const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
const arcPts = (r, z, f0, f1, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t), z]; });
const fS = (AZ - 90) * D2R + TAU;                      // la silueta de la derecha de un cilindro vertical
const mirror = (poly) => poly.map(([x, z]) => [-x, z]).reverse();
const cutStore = [];        // las caras del corte en y = 0: { owner, poly (x, z), cls }
const DEFS = [];
const circ = (F, s, r, n = 40) => Array.from({ length: n }, (_, i) => G.pointOf(F, s, r, (i / n) * TAU));
// un agujero redondo en la cara de adentro de un cilindro vertical de radio rc: centro en el ángulo deg, altura z
const boreOn = (rc, deg, z, rh, cls) => `<path class="${cls}" d="${pth1(Array.from({ length: 36 }, (_, i) => { const t = (i / 36) * TAU, f = deg * D2R + (rh * Math.cos(t)) / rc; return pr([rc * Math.cos(f), rc * Math.sin(f), z + rh * Math.sin(t)]); }))}"/>`;

/* ====================================================================
   1 · las formas registradas de la envolvente y la ventana del corte
   ==================================================================== */
const FRONT = A.box([-9000, 0, ZF], [9000, 9000, 9000]);
const OIL = FL.oil, SG = FL.sight, PG = FL.purge, ER = FL.earth;
const zOil = Z1 + DN[40].ri;                                      // la boquilla del rebose: el fondo del agujero a z₁
const zLeg = ZF + LEG.z, zVent = ZF + LEG.vz;
const zSa = ZF + SG.z0, zSb = ZF + SG.z1;
const hole = (deg, z, r) => A.disc({ o: [0, 0, z], a: radial(deg), u: tangent(deg), v: ZD3 }, 0, 1200, r - 1);
const HOLES = [hole(OIL.deg, zOil, DN[40].ro), hole(PG.deg, Z3, DN[15].ro), hole(LD, zLeg, C32.ro), hole(LD, zVent, DN[25].ro), hole(SG.deg, zSa, DN[15].ro), hole(SG.deg, zSb, DN[15].ro)];
const SHELL = A.body(F0, [[ZF, R], [ZT, R], [ZT, RO], [ZF, RO]], { name: "shell", owner: "shell", cut: [FRONT, ...HOLES] });
const UNDER_CYL = A.body(F0, [[ZF - 5, 0], [ZF - 5, RO], [ZT + 5, RO], [ZT + 5, 0]], { name: "bajo.envolvente" });
// la ventana del corte: lo que se ve por el plano y = 0, proyectado a lo largo de la mirada
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const WIN = rect(-R, ZF, R, ZT);
const WINP = A.prism(FV, WIN.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]), -90000, 90000);
const CLIPWIN = A.box([-9000, -9000, -9000], [9000, 9000, 9000], { cut: [WINP] });
const XNEG = A.box([-9000, -9000, -9000], [0, 9000, 9000]);
DEFS.push(`<clipPath id="flWin"><path d="${pth1(WIN.map(([x, z]) => pr([x, 0, z])))}"/></clipPath>`);

/* ====================================================================
   2 · el fondo plano (entero), la envolvente por dentro y la franja de la derecha por fuera
   ==================================================================== */
{
  // el fondo: un disco de 8 mm que sobresale 12 mm de la envolvente; arriba se ve el agujero del drenaje, en el centro
  const drain = `<path class="fl-bore" d="${pth1(circ(F0, ZF + 0.3, DN[25].ri, 40).map(pr))}"/>`;
  disc("fondo", F0, ZF - tb, ZF, RB, { tone: "mid" }, { owner: "fondo", cls: "fl-ss", n: 96, extra: drain });
}
{
  const svg = toned((o) => surface(cylP(R, ZF, ZT), cylN(-1), PI, TAU, 140, 1, o), "fl-in");
  // las costuras: la soldadura del fondo, la de la brida y una longitudinal; los agujeros del rebose del aceite y de la
  // purga, que se ven por dentro (el resto de las boquillas queda en la franja de afuera)
  const vs = 1.5 * PI - 0.35;
  const seams = Ln(path3(arcPts(R - 0.5, ZFL, PI, TAU, 120)) + path3([[R * Math.cos(vs), R * Math.sin(vs), ZF + 6], [R * Math.cos(vs), R * Math.sin(vs), ZFL]]), { tone: "faint" });
  const weld = Ln(path3(arcPts(R - 0.5, ZF + 6, PI, TAU, 120)), { tone: "lo" });
  const bores = boreOn(R - 0.4, OIL.deg, zOil, DN[40].ri, "fl-bore-dk") + boreOn(R - 0.4, PG.deg, Z3, DN[15].ri, "fl-bore-dk");
  put("shell.in", [0, -R * 0.75, (ZF + ZT) / 2], `<g clip-path="url(#flWin)">${svg}${seams}${weld}${bores}</g>`, [record({ ...SHELL, name: "shell.in", cut: [FRONT, ...HOLES, CLIPWIN] })]);
}
{
  // la franja de la derecha de la envolvente por fuera, de la silueta al corte
  const svg = toned((o) => surface(cylP(RO, ZF, ZFL), cylN(1), 1.5 * PI, TAU, 40, 1, o), "fl-ss") +
    Ln(path3([[RO * Math.cos(fS), RO * Math.sin(fS), ZF], [RO * Math.cos(fS), RO * Math.sin(fS), ZFL]]), { tone: "mid" }) +
    Ln(path3(arcPts(RO + 0.3, ZF + 6, fS, TAU, 16)), { tone: "faint" });
  const f0 = fS - TAU - 5 * D2R, nb = [Math.sin(f0), -Math.cos(f0), 0], tb2 = [Math.cos(f0), Math.sin(f0), 0];
  const BEHIND = A.orientedBox(G.mul3(nb, 2000), [nb, tb2, ZD3], [2000, 4000, 9000]);
  put("shell.out", [RO * 0.9, -RO * 0.3, (ZF + ZT) / 2], svg, [record(A.body(F0, [[ZF, R], [ZFL, R], [ZFL, RO], [ZF, RO]], { name: "shell.out", owner: "shell", cut: [FRONT, XNEG, BEHIND, ...HOLES] }))]);
}
cutStore.push({ owner: "shell", poly: rect(R, ZF, RO, ZFL), cls: "fl-cut" }, { owner: "shell", poly: rect(-RO, ZF, -R, ZFL), cls: "fl-cut" });

/* ====================================================================
   3 · la brida de la envolvente, la tapa plana con sus pernos
   ==================================================================== */
{
  fp("flange.ring", F0, GEO.halfRing(R, RF, 64), ZFL, ZT, { tone: "mid" }, { owner: "shell", cls: "fl-ss", cap: "none", extra: "" });
  cutStore.push({ owner: "flange", poly: rect(R, ZFL, RF, ZT), cls: "fl-cut" }, { owner: "flange", poly: rect(-RF, ZFL, -R, ZT), cls: "fl-cut" });
  // la tapa: media corona (el tubo de calma la atraviesa), con la empaquetadura entre la tapa y la brida
  fp("cover", F0, GEO.halfRing(C80.ro, RF, 96), ZT, ZTC, { tone: "mid" }, { owner: "cover", cls: "fl-ss", extra: Ln(path3(arcPts(RF + 0.3, ZT, fS, TAU, 20)), { tone: "lo" }) });
  cutStore.push({ owner: "cover", poly: rect(C80.ro, ZT, RF, ZTC), cls: "fl-cut" }, { owner: "cover", poly: rect(-RF, ZT, -C80.ro, ZTC), cls: "fl-cut" });
  // los pernos: tuerca y punta arriba de la tapa (los ocho de la mitad que queda) y, en la franja, las cabezas de abajo
  const B = FL.bolts;
  for (let q = 0; q < B.n / 2; q++) {
    const deg = 180 + 180 / B.n + (360 / B.n) * q, c = pol(B.bc, deg);
    fp(`bolt${q}.nut`, FZ(c[0], c[1], 0), HEX(hexR(B.af), deg * D2R), ZTC, ZTC + B.h, { tone: "mid" }, { owner: `bolt${q}`, cls: "fl-trim" });
    disc(`bolt${q}.tip`, FZ(c[0], c[1], 0), ZTC + B.h, ZTC + B.h + 5, 6, { tone: "mid" }, { owner: `bolt${q}`, cls: "fl-trim", n: 16 });
    if (deg > 315) fp(`bolt${q}.head`, FZ(c[0], c[1], 0), HEX(hexR(B.af), deg * D2R), ZFL - 8, ZFL, { tone: "mid" }, { owner: `bolt${q}`, cls: "fl-trim" });
  }
  ANCH.TAPA = pol(RF, -20, (ZT + ZTC) / 2);
}

/* ====================================================================
   4 · el tubo de calma (cortado), su brida, la brida ciega con la entrada DN 32 y el deflector
   ==================================================================== */
const DF = FL.defl, zd1 = Z0 - DF.gap, zd0 = zd1 - DF.t;
{
  const arcR = (r, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [r * Math.cos(t), r * Math.sin(t)]; });
  const band = (r0, r1, a0, a1) => [...arcR(r1, a0, a1, 24), ...arcR(r0, a1, a0, 24)];
  const fN = fS - TAU;
  {
    // la cara de adentro (la mitad de atrás), con los dos agujeros del venteo en el espacio de cabeza
    // en tramos: en el agua, en el aceite (bajo y sobre el nivel del agua del tubo), en el espacio de cabeza y de la
    // tapa a la brida; así cada tramo queda de un solo lado de la interfase y de la superficie del aceite
    const ZS = [[Z0, Z3], [Z3, ZW], [ZW, Z1], [Z1, ZT]];
    ZS.forEach(([za, zb], q) => {
      const svg = toned((o) => surface(cylP(C80.ri, za, zb), cylN(-1), PI, TAU, 48, 1, o), "fl-in") +
        (q === 0 ? Ln(path3(arcPts(C80.ri, Z0, PI, TAU + fN, 40)), { tone: "mid" }) : "") +
        (q === 3 ? boreOn(C80.ri - 0.3, 245, ZF + FL.calm.holes, 6, "fl-bore-dk") + boreOn(C80.ri - 0.3, 295, ZF + FL.calm.holes, 6, "fl-bore-dk") : "");
      put(`calm.bore${q}`, [0, -C80.ri, (za + zb) / 2], svg, [record(A.prism(F0, band(C80.ri, C80.ri + 0.8, PI, TAU + fN - 0.15), za, zb, { name: `calm.bore${q}`, owner: "calm" }))]);
    });
    const svg2 = toned((o) => surface(cylP(C80.ri, ZT, zF1), cylN(-1), PI, TAU, 48, 1, o), "fl-in");
    put("calm.bore.top", [0, -C80.ri, (ZT + zF1) / 2], svg2, [record(A.prism(F0, band(C80.ri, C80.ri + 0.8, PI, TAU + fN - 0.15), ZT, zF1, { name: "calm.bore.top", owner: "calm" }))]);
  }
  // la cara de afuera que se ve (la franja de la derecha), en tramos: en el agua, en el aceite, en el espacio de cabeza
  // y sobre la tapa; cada tramo se ordena solo frente a la interfase y a la superficie del aceite
  const outer = (name, z0, z1, cls, ring = false) => {
    const svg = toned((o) => surface(cylP(C80.ro, z0, z1), cylN(1), TAU + fN, TAU, 8, 1, o), cls) +
      Ln(path3([[C80.ro * Math.cos(fN), C80.ro * Math.sin(fN), z0], [C80.ro * Math.cos(fN), C80.ro * Math.sin(fN), z1]]), { tone: "mid" }) +
      (ring ? Ln(path3(arcPts(C80.ro, z0, TAU + fN, TAU, 8)), { tone: "mid" }) : "");
    put(name, [C80.ro * 0.95, -C80.ro * 0.25, (z0 + z1) / 2], svg, [record(A.prism(F0, band(C80.ro - 0.8, C80.ro, TAU + fN - 0.1, TAU), z0, z1, { name, owner: "calm" }))]);
  };
  outer("calm.o1", Z0, Z3, "fl-in", true);
  outer("calm.o2", Z3, Z1, "fl-in");
  outer("calm.o3", Z1, ZT - 4, "fl-in");
  outer("calm.neck", ZTC, zF0, "fl-ss");
  // la pared entera del tubo, solo para los apoyos: atraviesa la tapa y de ella cuelga el deflector
  record(A.prism(F0, GEO.halfRing(C80.ri, C80.ro, 40), Z0, zF0, { name: "calm.pared", owner: "calm" }));
  fp("calm.flange", F0, GEO.halfRing(C80.ri, C80.fl, 48), zF0, zF1, { tone: "mid" }, { owner: "calm", cls: "fl-ss" });
  const L = [[C80.ri, Z0], [C80.ro, Z0], [C80.ro, zF0], [C80.fl, zF0], [C80.fl, zF1], [C80.ri, zF1]];
  cutStore.push({ owner: "calm", poly: L, cls: "fl-cut" }, { owner: "calm", poly: mirror(L), cls: "fl-cut" });
  // la brida ciega con la entrada DN 32 soldada al centro
  disc("in.blind", F0, zF1, zBF, C80.fl, { tone: "mid" }, { owner: "inlet", cls: "fl-ss", extra: Dots(G.dotsOf(F0, zBF, C80.bc, C80.nb, P, { all: true, phase: PI / 4 }), { size: 0.6 }) });
  // el deflector: un platillo de Ø 200 × 6 a 60 mm bajo la boca, colgado de dos pletinas (la tercera se fue con el corte)
  fp("defl.plate", F0, GEO.halfRing(0, DF.r, 48), zd0, zd1, { tone: "mid" }, { owner: "defl", cls: "fl-in" });
  cutStore.push({ owner: "defl", poly: rect(-DF.r, zd0, DF.r, zd1), cls: "fl-cut" });
  [225, 315].forEach((deg, i) => {
    const [bw, bt] = DF.bar;
    fp(`defl.bar${i}`, { o: [0, 0, 0], a: ZD3, u: radial(deg), v: tangent(deg) }, [[C80.ro, -bt / 2], [C80.ro + bw, -bt / 2], [C80.ro + bw, bt / 2], [C80.ro, bt / 2]], zd1, Z0 + DF.over, { tone: "mid" }, { owner: "defl", cls: "fl-in" });
  });
  ANCH.CALMA = [-C80.ro - 2, 0, ZF + 800];
  ANCH.DEFLECTOR = [-DF.r * 0.6, 0, (zd0 + zd1) / 2];
}
{
  // la entrada del condensado: sube de la brida ciega, codo de radio largo y un tramo hacia la izquierda hasta la brida
  // de la línea que viene del condensador
  const el = [0, 0, zBF + FL.inlet.up], end = G.add3(el, G.mul3(TMINUS, FL.inlet.run));
  tubeItems("in.pipe", G.fillet([[0, 0, zBF], el, end], 64, 10, { P, tube: C32.ro }), C32.ro, { cls: "fl-pipe" });
  const F = G.frameAlong(end, TMINUS);
  disc("in.fl0", F, 0, C32.ft, C32.fl, { tone: "mid" }, { owner: "inlet", cls: "fl-pipe" });
  disc("in.fl1", F, C32.ft, 2 * C32.ft, C32.fl, { tone: "mid" }, { owner: "inlet", cls: "fl-cast" });
  ANCH.ENTRADA = G.add3(el, G.add3(G.mul3(TMINUS, FL.inlet.run * 0.62), [0, 0, -C32.ro * 0.5]));
}

/* ====================================================================
   5 · el venteo DN 25 de la tapa, con el codo hacia abajo y su malla
   ==================================================================== */
{
  const d = DN[25], V = FL.vent, c = pol(V.r, V.deg), F = FZ(c[0], c[1], 0);
  disc("vent.neck", F, ZTC, ZTC + V.h, d.ro, { tone: "mid" }, { owner: "vent", cls: "fl-ss" });
  const z1 = ZTC + V.h;
  disc("vent.fl0", F, z1, z1 + d.ft, d.fl, { tone: "mid" }, { owner: "vent", cls: "fl-ss" });
  disc("vent.fl1", F, z1 + d.ft, z1 + 2 * d.ft, d.fl, { tone: "mid" }, { owner: "vent", cls: "fl-pipe", extra: Dots(G.dotsOf(F, z1 + 2 * d.ft, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.5 }) });
  const p0 = [c[0], c[1], z1 + 2 * d.ft], p1 = G.add3(p0, [0, 0, V.up]), p2 = G.add3(p1, G.mul3(TPLUS, V.over)), p3 = G.add3(p2, [0, 0, -V.down]);
  tubeItems("vent.pipe", G.fillet([p0, p1, p2, p3], 40, 10, { P, tube: d.ro }), d.ro, { cls: "fl-pipe" });
  // la malla contra insectos y chispas: un casquillo en la punta
  disc("vent.screen", FZ(p3[0], p3[1], 0), p3[2] - 16, p3[2], d.ro + 4, { tone: "mid" }, { owner: "vent", cls: "fl-trim", extra: `<path class="fl-malla" d="${pth1(circ(FZ(p3[0], p3[1], 0), p3[2] - 16.2, d.ri + 2, 32).map(pr))}"/>` });
  ANCH.VENTEO = G.add3(G.add3(p3, [0, 0, -8]), G.mul3(TPLUS, d.ro + 4));
}

/* ====================================================================
   6 · las válvulas de bola bridadas (pieza que se repite)
   ==================================================================== */
// válvula de bola bridada con palanca: F.a es el sentido del flujo y la cara de entrada está en s0
function ballValve(name, F, s0, d, { open = false, stem = null, Lv = 150, flip = false, lever = 160 } = {}) {
  const ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, { tone: "mid" }, { owner: name, cls: "fl-cast" });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner: name, cls: "fl-cast" });
  const face = G.dot3(F.a, V3) > 0.12;
  const bore = face ? `<path class="fl-bore-dk" d="${pth1(circ(F, s1 + 0.3, d.ri, 40).map(pr))}"/>` : "";
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, { tone: "mid" }, { owner: name, cls: "fl-cast", extra: bore + (face ? Dots(G.dotsOf(F, s1, d.bc, d.nb, P, { all: true, phase: PI / 4 }), { size: 0.5 }) : "") });
  const st = stem || G.unit3(G.cross3(F.a, Math.abs(F.a[2]) > 0.9 ? HV : ZD3));
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  const rn = Math.max(9, d.ro * 0.75);
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - rn * rn) - 2, r1 + 26, rn, { tone: "mid" }, { owner: name, cls: "fl-cast" });
  disc(`${name}.stem`, FS, r1 + 26, r1 + 36, 6, { tone: "mid" }, { owner: name, cls: "fl-trim", n: 16 });
  const lv0 = open ? F.a : G.unit3(G.cross3(st, F.a)), lv = flip ? G.mul3(lv0, -1) : lv0;
  const FLv = { o: G.add3(c, G.mul3(st, r1 + 36)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
  fp(`${name}.lever`, FLv, [[0, -9], [5, -9], [5, 9], [0, 9]], -14, lever, { tone: "mid" }, { owner: name, cls: "fl-lever" });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, r1, s1 };
}

/* ====================================================================
   7 · a la izquierda: el rebose del aceite (DN 40, el fondo del agujero a z₁) con su válvula, y la purga de la
   interfase (DN 15)
   ==================================================================== */
{
  const d = DN[40], ax = radial(OIL.deg), Fo = { o: [0, 0, zOil], a: ax, u: tangent(OIL.deg), v: ZD3 }, s1 = RO + OIL.neck;
  saddle("oil.neck", Fo, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, { tone: "mid" }, { owner: "oil", cls: "fl-ss", hosts: [UNDER_CYL] });
  disc("oil.fl", Fo, s1, s1 + d.ft, d.fl, { tone: "mid" }, { owner: "oil", cls: "fl-ss" });
  const v = ballValve("oil.valve", Fo, s1 + d.ft, d, { open: true, stem: ZD3, Lv: 160 });
  const s2 = v.s1, s3 = s2 + 90;
  tubeItems("oil.stub", [G.pointOf(Fo, s2, 0, 0), G.pointOf(Fo, s3, 0, 0)], d.ro, { cls: "fl-pipe" });
  disc("oil.fl2", Fo, s3, s3 + d.ft, d.fl, { tone: "mid" }, { owner: "oil", cls: "fl-pipe" });
  disc("oil.fl3", Fo, s3 + d.ft, s3 + 2 * d.ft, d.fl, { tone: "mid" }, { owner: "oil", cls: "fl-cast" });
  ANCH.REBOSE = G.pointOf(Fo, s3 - 30, d.ro, PI / 2 + 0.3);
  ANCH.REBOSE_IN = [R * Math.cos(OIL.deg * D2R), R * Math.sin(OIL.deg * D2R), zOil];
}
{
  const d = DN[15], ax = radial(PG.deg), Fp = { o: [0, 0, Z3], a: ax, u: tangent(PG.deg), v: ZD3 }, s1 = RO + PG.neck;
  saddle("purge.neck", Fp, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, { tone: "mid" }, { owner: "purge", cls: "fl-ss", hosts: [UNDER_CYL] });
  disc("purge.fl", Fp, s1, s1 + d.ft, d.fl, { tone: "mid" }, { owner: "purge", cls: "fl-ss" });
  const v = ballValve("purge.valve", Fp, s1 + d.ft, d, { open: false, stem: G.mul3(tangent(PG.deg), -1), Lv: 110, flip: true, lever: 62 });
  ANCH.PURGA = G.add3(v.body, [0, 0, -v.r1 * 0.6]);
}

/* ====================================================================
   8 · a la derecha: la pierna del agua (cuello de cisne) con el tramo ajustable, el codo de rebose, el rompe-sifón y
   la salida del hidrolato con sus dos válvulas
   ==================================================================== */
const gland = { s: LEG.slide, r: C32.ro + 9, nut: C32.ro + 12 };
{
  const d = C32, ax = radial(LD), tg = tangent(LD), Fl = { o: [0, 0, zLeg], a: ax, u: tg, v: ZD3 }, s1 = RO + LEG.neck;
  saddle("leg.neck", Fl, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, { tone: "mid" }, { owner: "leg", cls: "fl-ss", hosts: [UNDER_CYL] });
  disc("leg.fl0", Fl, s1, s1 + d.ft, d.fl, { tone: "mid" }, { owner: "leg", cls: "fl-ss" });
  disc("leg.fl1", Fl, s1 + d.ft, s1 + 2 * d.ft, d.fl, { tone: "mid" }, { owner: "leg", cls: "fl-pipe" });
  const s2 = s1 + 2 * d.ft;
  // la U: sale, baja, da la vuelta y sube por fuera hasta el codo de rebose (una te: arriba sigue el rompe-sifón)
  const E = pol(LEG.rR, LD, zc), Rb = 30;
  // el tramo ajustable: un manguito con prensaestopas; el tubo de arriba se desliza adentro y así se sube o baja el codo.
  // El tubo de abajo termina en el manguito y el de arriba sale de la tuerca: son dos tubos
  const za = ZF + gland.s[0], zb = ZF + gland.s[1];
  const ctl = [pol(s2, LD, zLeg), pol(LEG.r1, LD, zLeg), pol(LEG.r1, LD, ZF + LEG.zU), pol(LEG.rR, LD, ZF + LEG.zU), pol(LEG.rR, LD, za)];
  tubeItems("leg.pipe", G.fillet(ctl, 48, 10, { P, tube: d.ro }), d.ro, { cls: "fl-pipe" });
  tubeItems("leg.riser", [pol(LEG.rR, LD, zb), G.add3(E, [0, 0, -entry(Rb, d.ro)])], d.ro, { cls: "fl-pipe" });
  const c = pol(LEG.rR, LD, 0), FG = FZ(c[0], c[1], 0), zn = zb - 22;
  disc("leg.sleeve", FG, za, zn, gland.r, { tone: "mid" }, { owner: "leg.gland", cls: "fl-cast" });
  fp("leg.nut", FG, HEX(gland.nut, LD * D2R), zn, zb, { tone: "mid" }, { owner: "leg.gland", cls: "fl-trim" });
  ANCH.AJUSTE = G.add3(c, [gland.nut * HV[0], gland.nut * HV[1], zn + 11]);
  ANCH.PIERNA = pol(LEG.r1 + 4, LD, ZF + LEG.zU + 180);
  ANCH.PIERNA = G.add3(pol(LEG.rR, LD, ZF + 520), G.mul3(HV, d.ro));
  // el codo de rebose: la te de arriba, con tres pasos (abajo, arriba y afuera)
  ball("leg.tee", E, Rb, { tone: "mid" }, { owner: "leg", cls: "fl-cast" });
  ANCH.CODO = pol((LEG.rR + rDesc) / 2 - 10, LD, zc + d.ro);
  // de la te sale el hidrolato hacia afuera y baja a la te de las dos salidas
  const T2 = pol(rDesc, LD, zTee);
  const crest = G.fillet([G.add3(E, G.mul3(ax, entry(Rb, d.ro))), pol(rDesc, LD, zc), G.add3(T2, [0, 0, entry(Rb, d.ro)])], 40, 10, { P, tube: d.ro });
  tubeItems("leg.crest", crest, d.ro, { cls: "fl-pipe" });
  ball("hid.tee", T2, Rb, { tone: "mid" }, { owner: "hid", cls: "fl-cast" });
  // al desagüe: hacia abajo, válvula cerrada; a la caldera (cohobación): hacia afuera, válvula abierta
  const Fd = { o: T2, a: [0, 0, -1], u: ax, v: tg };
  const sd = entry(Rb, d.ro) + 40;
  tubeItems("hid.down", [G.pointOf(Fd, entry(Rb, d.ro), 0, 0), G.pointOf(Fd, sd, 0, 0)], d.ro, { cls: "fl-pipe" });
  const vd = ballValve("hid.vd", Fd, sd, d, { open: false, stem: tg, Lv: 130, lever: 130 });
  const Fo = { o: T2, a: ax, u: tg, v: ZD3 }, so = entry(Rb, d.ro) + 45;
  tubeItems("hid.out", [G.pointOf(Fo, entry(Rb, d.ro), 0, 0), G.pointOf(Fo, so, 0, 0)], d.ro, { cls: "fl-pipe" });
  const vo = ballValve("hid.vo", Fo, so, d, { open: true, stem: ZD3, Lv: 130, lever: 130 });
  ANCH.CALDERA = G.add3(vo.body, [0, 0, -vo.r1 * 0.9]);
  ANCH.DESAGUE = G.add3(G.pointOf(Fd, vd.s1, 0, 0), G.mul3(TMINUS, d.ro));
  ANCH.HIDROLATO = G.add3(pol(rDesc, LD, (zc + zTee) / 2), G.mul3(HV, d.ro));
}
{
  // el rompe-sifón: de la te sube y entra al espacio de cabeza por una boquilla DN 25 de la envolvente
  const d = DN[25], ax = radial(LD), Fv = { o: [0, 0, zVent], a: ax, u: tangent(LD), v: ZD3 }, s1 = RO + 46;
  saddle("rs.neck", Fv, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, { tone: "mid" }, { owner: "rs", cls: "fl-ss", hosts: [UNDER_CYL] });
  const E = pol(LEG.rR, LD, zc);
  // una unión a media altura del tramo de arriba, para desmontarlo: dos tubos que llegan a la unión
  const um = (LEG.rR + s1) / 2, Fu = { o: [0, 0, zVent], a: ax, u: tangent(LD), v: ZD3 };
  tubeItems("rs.pipe", G.fillet([G.add3(E, [0, 0, entry(30, d.ro)]), pol(LEG.rR, LD, zVent), pol(um + 20, LD, zVent)], 40, 10, { P, tube: d.ro }), d.ro, { cls: "fl-pipe" });
  tubeItems("rs.pipe2", [pol(um - 20, LD, zVent), pol(s1, LD, zVent)], d.ro, { cls: "fl-pipe" });
  fp("rs.union", Fu, HEX(d.ro + 8, 0), um - 20, um + 20, { tone: "mid" }, { owner: "rs", cls: "fl-trim" });
  ANCH.ROMPESIFON = G.add3(pol(LEG.rR, LD, zVent - 34), G.mul3(HV, d.ro));
}

/* ====================================================================
   9 · la mirilla de tubo de vidrio (dos llaves en la envolvente: abajo en el agua, arriba en el aceite) y el borne de
   puesta a tierra
   ==================================================================== */
{
  const d = DN[15], ax = radial(SG.deg), tg = tangent(SG.deg), s1 = RO + SG.neck, rc = 14, Lc = 46, sc = s1 + Lc / 2;
  const g = pol(sc, SG.deg), FGl = FZ(g[0], g[1], 0), rg = 9;
  const cocks = [[zSa, 1], [zSb, -1]];
  let zg0 = 0, zg1 = 0;
  cocks.forEach(([z, up], i) => {
    const F = { o: [0, 0, z], a: ax, u: tg, v: ZD3 };
    saddle(`sight.neck${i}`, F, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, { tone: "mid" }, { owner: "sight", cls: "fl-ss", hosts: [UNDER_CYL] });
    disc(`sight.cock${i}`, F, s1, s1 + Lc, rc, { tone: "mid" }, { owner: "sight", cls: "fl-cast" });
    fp(`sight.cap${i}`, F, HEX(hexR(20), 0), s1 + Lc, s1 + Lc + 9, { tone: "mid" }, { owner: "sight", cls: "fl-trim" });
    // la manija de la llave, sobre el cuerpo
    // el paso hacia el vidrio y la tuerca de la empaquetadura
    const b0 = z + up * (Math.sqrt(rc * rc - 8 * 8) - 1), b1 = z + up * (rc + 8), n1 = b1 + up * 12;
    disc(`sight.boss${i}`, FGl, Math.min(b0, b1), Math.max(b0, b1), 8, { tone: "mid" }, { owner: "sight", cls: "fl-cast" });
    fp(`sight.gn${i}`, FGl, HEX(13, SG.deg * D2R), Math.min(b1, n1), Math.max(b1, n1), { tone: "mid" }, { owner: "sight", cls: "fl-trim" });
    if (up > 0) zg0 = n1; else zg1 = n1;
  });
  // el vidrio: el agua abajo, el aceite arriba, la interfase a la misma altura que en el recipiente
  disc("sight.glass.w", FGl, zg0, Z3, rg, { tone: "mid" }, { owner: "sight", cls: "fl-glw", n: 24 });
  disc("sight.glass.o", FGl, Z3, zg1, rg, { tone: "mid" }, { owner: "sight", cls: "fl-glo", n: 24 });
  ANCH.MIRILLA = G.add3(FGl.o, [rg * TPLUS[0], rg * TPLUS[1], (zg0 + Z3) / 2]);
}
{
  // el borne: una oreja soldada a la envolvente con su perno; el cable verde y amarillo baja a la varilla de tierra
  const ax = radial(ER.deg), tg = tangent(ER.deg), z = ZF + ER.z, Fe = { o: [0, 0, z], a: ax, u: tg, v: ZD3 };
  fp("earth.lug", Fe, rect(-4, -22, 4, 22), RO - 0.2, RO + 46, { tone: "mid" }, { owner: "earth", cls: "fl-ss" });
  const FB = { o: G.pointOf(Fe, RO + 30, 0, 0), a: tg, u: ax, v: ZD3 };
  disc("earth.washer", FB, 4, 6, 9, { tone: "mid" }, { owner: "earth.b", cls: "fl-trim", n: 20 });
  fp("earth.bolt", FB, HEX(hexR(13), 0), 6, 13, { tone: "mid" }, { owner: "earth.b", cls: "fl-trim" });
  const top = G.pointOf(Fe, RO + 30, 0, 0), zr = 160, rod = G.add3([top[0], top[1], 0], G.mul3(ax, 18));
  disc("stand.earth.rod", FZ(rod[0], rod[1], 0), 0, zr - 24, 8, { tone: "mid" }, { owner: "stand.earth", cls: "fl-cu", n: 16, ground: true });
  disc("stand.earth.clamp", FZ(rod[0], rod[1], 0), zr - 24, zr, 26, { tone: "mid" }, { owner: "stand.earth", cls: "fl-cu", n: 28, ground: true });
  disc("earth.barrel", FZ(top[0], top[1], 0), z - 22 - 16, z - 22, 7, { tone: "mid" }, { owner: "earth.b", cls: "fl-cu", n: 18 });
  tubeItems("earth.cable", [[top[0], top[1], z - 22 - 16], [top[0], top[1], zr]], 5, { cls: "fl-tierra", limp: true, maxLength: 120 });
  ANCH.TIERRA = G.add3(top, G.mul3(tg, 12));
}

/* ====================================================================
   10 · abajo: las patas y el drenaje del centro
   ==================================================================== */
const LG = FL.legs;
LG.degs.forEach((deg, q) => {
  const c = pol(LG.r, deg), d = DN[LG.dn], zp = ZF - tb - LG.padt;
  disc(`leg${q}.pad`, FZ(c[0], c[1], 0), zp, ZF - tb, LG.pad, { tone: "mid" }, { owner: `leg${q}`, cls: "fl-ss", n: 32 });
  disc(`leg${q}.post`, FZ(c[0], c[1], 0), LG.pt, zp, d.ro, { tone: "mid" }, { owner: `leg${q}`, cls: "fl-ss" });
  box(`stand.leg${q}`, [c[0] - LG.plate, c[1] - LG.plate, 0], [c[0] + LG.plate, c[1] + LG.plate, LG.pt], { tone: "mid" }, { r: 5, steps: 3, bevel: 0.8, cls: "fl-ss" });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], j) => fp(`leg${q}.anchor${j}`, FZ(c[0] + a * 58, c[1] + b * 58, 0), HEX(10), LG.pt, LG.pt + 10, { tone: "mid" }, { owner: `leg${q}`, cls: "fl-ss" }));
  if (deg === 90) ANCH.PATAS = [c[0] + d.ro * HV[0], c[1] + d.ro * HV[1], 200];
});
{
  const d = DN[25], zb = ZF - tb, zn = zb - 56;
  disc("drain.neck", F0, zn, zb, d.ro, { tone: "mid" }, { owner: "drain", cls: "fl-ss" });
  disc("drain.fl", F0, zn - d.ft, zn, d.fl, { tone: "mid" }, { owner: "drain", cls: "fl-ss" });
  const v = ballValve("drain.valve", { o: [0, 0, zn - d.ft], a: [0, 0, -1], u: XD, v: YD }, 0, d, { open: false, stem: G.unit3(pol(1, AZ - 60)), Lv: 140, lever: 130 });
  ANCH.DRENAJE = G.add3(v.body, G.mul3(TPLUS, v.r1 * 0.85));
}

/* ====================================================================
   11 · el agua y el aceite, translúcidos: las caras del corte (y = 0), la interfase y la superficie del aceite vistas
   desde arriba, y el agua del tubo de calma. Las gotas de aceite que suben van en la cara del corte del agua (mucho
   más grandes que las reales, que son de unos 150 µm), más densas cerca de la interfase: la banda de dispersión.
   ==================================================================== */
let seed = 11;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const facePath = (poly) => pth1(poly.map(([x, z]) => pr([x, 0, z])));
const thin = (poly, name) => A.prism(FY0, poly, -0.3, 0, { name, owner: "liquido" });
{
  const ro = C80.ro, ri = C80.ri, dr = DF.r;
  const WATER = [rect(-R, ZF, R, zd0), rect(-R, zd0, -dr, zd1), rect(dr, zd0, R, zd1), rect(-R, zd1, R, Z0), rect(-R, Z0, -ro, Z3), rect(-ri, Z0, ri, Z3), rect(ro, Z0, R, Z3), rect(-ri, Z3, ri, ZW)];
  // las gotas: elipses en el plano del corte (círculos de radio r), con un brillo
  let dG = "", dB = "";
  const drop = (x, z, r) => {
    dG += pth1(Array.from({ length: 14 }, (_, i) => { const t = (i / 14) * TAU; return pr([x + r * Math.cos(t), 0, z + r * Math.sin(t)]); }));
    const hx = x - r * 0.35, hz = z + r * 0.35, hr = r * 0.32;
    dB += pth1(Array.from({ length: 8 }, (_, i) => { const t = (i / 8) * TAU; return pr([hx + hr * Math.cos(t), 0, hz + hr * Math.sin(t)]); }));
  };
  const free = (x, z, r) => {
    if (Math.abs(x) > R - r - 4 || z < ZF + r + 4) return false;
    if (z > Z0 - r - 3 && Math.abs(x) > ri - r - 3 && Math.abs(x) < ro + r + 3) return false;      // la pared del tubo
    if (z > zd0 - r - 3 && z < zd1 + r + 3 && Math.abs(x) < dr + r + 3) return false;               // el deflector
    if (z > Z3 - r - 2.5 && Math.abs(x) >= ri - r - 3) return false;                               // la interfase
    if (z > ZW - r - 3) return false;
    return true;
  };
  const placed = [];
  const tryDrop = (x, z, r) => { if (!free(x, z, r) || placed.some(([a, b, q]) => Math.hypot(a - x, b - z) < q + r + 2.5)) return; placed.push([x, z, r]); drop(x, z, r); };
  // en el agua, afuera del tubo: más gotas y más grandes hacia la interfase, y una banda densa bajo ella
  for (let i = 0; i < 2600 && placed.length < 300; i++) {
    const h = rnd() ** 0.55, z = zd0 - 120 + (Z3 - (zd0 - 120)) * h, x = (rnd() * 2 - 1) * R;
    const r = 2.6 + 3.2 * h * rnd() + (h > 0.9 ? 1.2 : 0);
    if (Math.abs(x) < ro + 8 && z > Z0 && rnd() < 0.9) continue;
    tryDrop(x, z, r);
  }
  for (let i = 0; i < 900; i++) { const x = (rnd() * 2 - 1) * R, z = Z3 - 4 - rnd() ** 1.6 * 46, r = 3 + rnd() * 3.4; if (Math.abs(x) > ro + 6) tryDrop(x, z, r); }
  // dentro del tubo, el condensado que baja con sus gotas
  for (let i = 0; i < 300; i++) { const x = (rnd() * 2 - 1) * (ri - 6), z = Z0 + 10 + rnd() * (ZW - Z0 - 20), r = 2.4 + rnd() * 2.2; if (rnd() < 0.5) tryDrop(x, z, r); }
  const lines = Ln(path3([[-ri, 0, ZW], [ri, 0, ZW]]), { tone: "lo" });
  put("agua.corte", [0, 0, (ZF + Z3) / 2], `<g class="fl-agua"><path class="fl-agua-cara" d="${WATER.map(facePath).join("")}"/><path class="fl-gota" d="${dG}"/><path class="fl-brillo" d="${dB}"/>${lines}</g>`, WATER.map((p, i) => thin(p, `agua${i}`)));
  const OILF = [rect(-R, Z3, -ro, Z1), rect(ro, Z3, R, Z1)];
  const oilLines = Ln(path3([[-R, 0, Z3], [-ro, 0, Z3]]) + path3([[ro, 0, Z3], [R, 0, Z3]]), { tone: "hi" }) + Ln(path3([[-R, 0, Z1], [-ro, 0, Z1]]) + path3([[ro, 0, Z1], [R, 0, Z1]]), { tone: "mid" });
  put("aceite.corte", [0, 0, (Z3 + Z1) / 2], `<g class="fl-aceite"><path class="fl-aceite-cara" d="${OILF.map(facePath).join("")}"/>${oilLines}</g>`, OILF.map((p, i) => thin(p, `aceite${i}`)));
  // la interfase y la superficie del aceite, vistas desde arriba (medias coronas alrededor del tubo)
  const disk = (name, z, r0, r1, cls, ref) => {
    const poly = GEO.halfRing(r0, r1, 96), pts = poly.map(([x, y]) => [x, y, z]);
    const edge = Ln(path3(arcPts(r1 - 0.4, z, PI, TAU, 96)) + (r0 > 0 ? path3(arcPts(r0 + 0.4, z, PI, TAU, 24)) : ""), { tone: cls === "fl-aceite-sup" ? "mid" : "hi" });
    put(name, ref, `<g class="fl-liq"><path class="${cls}" d="${pth1(pts.map(pr))}"/>${edge}</g>`, [A.prism(F0, GEO.halfRing(r0, r1, 48), z - 0.3, z, { name, owner: "liquido" })]);
  };
  disk("interfase", Z3, ro, R, "fl-inter", [0, -R * 0.5, Z3]);
  disk("aceite.sup", Z1, ro, R, "fl-aceite-sup", [0, -R * 0.5, Z1]);
  disk("agua.tubo.sup", ZW, 0, ri, "fl-agua-sup", [0, -ri * 0.5, ZW]);
  ANCH.ACEITE = [-R * 0.8, 0, Z3 + 62];
  ANCH.INTERFASE = [-R * 0.45, 0, Z3];
  ANCH.HIDRO_IN = [-R * 0.66, 0, ZF + 300];
  ANCH.GOTAS = (() => { const g = placed.filter(([x, z, r]) => r > 4 && x < -R * 0.45 && x > -R * 0.8 && z > ZF + 560 && z < ZF + 680)[0] || [-170, ZF + 620]; return [g[0], 0, g[1]]; })();
}

/* ====================================================================
   12 · las flechas: el condensado baja por el tubo de calma, el deflector lo abre hacia los lados, el agua baja a la
   salida de la pierna y las gotas suben; en la capa de aceite, el aceite va hacia el rebose
   ==================================================================== */
{
  const YF = -24, rf = 6;
  const smooth = (ctl, n = 40) => {
    const out = [];
    for (let i = 0; i < ctl.length - 1; i++) {
      const p0 = ctl[Math.max(0, i - 1)], p1 = ctl[i], p2 = ctl[i + 1], p3 = ctl[Math.min(ctl.length - 1, i + 2)];
      for (let j = 0; j < n; j++) {
        const t = j / n, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map((q) => 0.5 * (2 * p1[q] + (-p0[q] + p2[q]) * t + (2 * p0[q] - 5 * p1[q] + 4 * p2[q] - p3[q]) * t2 + (-p0[q] + 3 * p1[q] - 3 * p2[q] + p3[q]) * t3)));
      }
    }
    out.push(ctl[ctl.length - 1]);
    return out;
  };
  const FLOW = [
    ["flow.in", "fl-flujo", [[0, ZW - 40], [0, Z0 + 60]]],
    ["flow.d0", "fl-flujo", [[52, Z0 - 22], [120, zd1 + 12], [190, zd1 - 30], [215, zd1 - 150]]],
    ["flow.d1", "fl-flujo", [[-52, Z0 - 22], [-120, zd1 + 12], [-190, zd1 - 30], [-215, zd1 - 150]]],
    ["flow.w", "fl-flujo", [[150, ZF + 260], [205, ZF + 150], [250, ZF + 78]]],
    ["flow.up", "fl-flujo-ac", [[-205, ZF + 470], [-200, ZF + 640], [-180, Z3 - 70]]],
    ["flow.oil", "fl-flujo-ac", [[-70, Z1 - 45], [-160, Z1 - 42], [-245, Z1 - 30]]],
  ];
  for (const [nm, cls, ctl] of FLOW) {
    const pts = smooth(ctl).map(([x, z]) => [x, YF, z]);
    const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[n - 4], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const h = 6.5, w = 3.2, base = [b[0] - ux * h, b[1] - uy * h];
    const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
    const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
    const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
    put(nm, pts[Math.floor(pts.length / 2)], `<path class="${cls}" d="${line}"/><path class="${cls}-p" d="${head}"/>`, [A.tube(pts, rf), A.ball(pts[pts.length - 1], w / G.scaleOf(P))]);
  }
}

/* ---------- las caras del corte, un elemento por pieza ---------- */
{
  const groups = new Map();
  for (const c of cutStore) { const key = c.owner + "|" + c.cls; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls] = key.split("|");
    const d = list.map((c) => pth1(c.poly.map(([x, z]) => pr([x, 0, z])))).join("");
    const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
    const shapes = list.map((c) => record(A.prism(FY0, c.poly, -0.3, 0, { name: `${owner}.corte`, owner: owner === "flange" ? "shell" : owner })));
    const cx = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.corte`, [cx[0] / n, 0, cx[1] / n], svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.FL_ITEM) {
  for (const nm of process.env.FL_ITEM.split(",")) {
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
R_.items.sort((a, b) => a.key - b.key);
const shades = (p, f, t, s0, s1, s2, s3) => `--anatomy-paper:${p};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s0};--anatomy-shade-1:${s1};--anatomy-shade-2:${s2};--anatomy-shade-3:${s3}`;
const CSS = `.fl-cut{${shades("#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3")}}
.fl-ss{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#ccd1d6", "#d5d9dd", "#dde1e4", "#e5e8ea")}}
.fl-in{${shades("#e9ecef", "#e9ecef", "#f1f3f5", "#c3c9cf", "#ccd1d6", "#d5d9de", "#dde1e5")}}
.fl-pipe{${shades("#f1f3f4", "#f1f3f4", "#f9fafa", "#d2d6da", "#dadee1", "#e2e5e7", "#e9ebed")}}
.fl-trim{${shades("#f4f5f6", "#f4f5f6", "#fbfbfc", "#d6d9dc", "#dfe2e4", "#e7e9eb", "#eef0f1")}}
.fl-cast{${shades("#e3e6e9", "#e3e6e9", "#eceef0", "#c4c9ce", "#cdd1d5", "#d5d9dc", "#dde0e3")}}
.fl-lever{${shades("#d9dde1", "#d9dde1", "#e6e9ec", "#aeb5bc", "#b8bfc5", "#c2c8ce", "#ccd1d6")}}
.fl-cu{${shades("#e6cdb4", "#e6cdb4", "#efdcc8", "#c49e7c", "#cda98a", "#d6b597", "#dec1a6")}}
.fl-tierra{${shades("#cfe0b4", "#cfe0b4", "#dcead0", "#9fbb7a", "#abc58a", "#b7ce99", "#c3d7a8")}}
.fl-glw{${shades("#d3e0e6", "#d3e0e6", "#e2ebef", "#aebfc8", "#b8c8d0", "#c3d1d8", "#cdd9df")}}
.fl-glo{${shades("#f3d58e", "#f3d58e", "#f8e3ad", "#d9b05a", "#e0bb6a", "#e7c67b", "#edd08b")}}
.fl-bore{fill:#9fadb8;stroke:none}.fl-bore-dk{fill:#5f6a74;stroke:none}.fl-malla{fill:#8b959e;stroke:none}
.fl-agua-cara{fill:#9cb7c3;fill-opacity:.34;stroke:none}
.fl-agua-sup{fill:#9cb7c3;fill-opacity:.3;stroke:none}
.fl-inter{fill:#9cb7c3;fill-opacity:.3;stroke:none}
.fl-aceite-cara{fill:#e9b44c;fill-opacity:.55;stroke:none}
.fl-aceite-sup{fill:#f1c766;fill-opacity:.45;stroke:none}
.fl-gota{fill:#dc9a2a;fill-opacity:.9;stroke:none}.fl-brillo{fill:#fff6dc;fill-opacity:.85;stroke:none}
.fl-aceite .iso-line[data-tone="hi"],.fl-liq .iso-line[data-tone="hi"]{stroke:#a3660f}
.fl-aceite .iso-line[data-tone="mid"],.fl-liq .iso-line[data-tone="mid"]{stroke:#c58f2c}
.fl-agua .iso-line[data-tone="lo"]{stroke:#7f98a4}
.fl-flujo{fill:none;stroke:#2f5f86;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.fl-flujo-p{fill:#2f5f86;stroke:none;opacity:.85}
.fl-flujo-ac{fill:none;stroke:#9a5a0a;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.9}
.fl-flujo-ac-p{fill:#9a5a0a;stroke:none;opacity:.9}`;
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
const svg = k.figureSvg({ width: W, height: H, label: "Florentino en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="fl-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Florentino", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUT, "florentino_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
