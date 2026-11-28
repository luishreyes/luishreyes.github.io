/* ====================================================================
   Paquete del compresor de tornillo en isométrico (skill anatomy), para el capítulo 26 del libro de operaciones
   unitarias (Refrigeración y congelación): el compresor de amoníaco C-401 del nivel alto de la planta de frío.
   Concepto: el vapor de la succión baja por la válvula de cierre y retención y por el filtro a la carcasa del
   compresor, donde los dos rotores engranados, el macho de cuatro lóbulos y la hembra de seis canales, lo encierran
   en los canales y lo comprimen mientras corren hacia la descarga; con el gas sale el aceite que se inyectó para
   sellar, lubricar y llevarse el calor de la compresión. La descarga baja al separador de aceite, el recipiente
   horizontal de abajo, que suelta el gas limpio por arriba hacia el condensador y junta el aceite en el fondo; de ahí
   la bomba lo lleva por el enfriador de termosifón, donde el amoníaco líquido del condensador lo enfría hirviendo, y
   por el filtro, de vuelta al compresor.
   Corte: a la carcasa del compresor se le quitó la mitad de arriba entre la caja de la succión y la de la descarga,
   así que se ven los dos rotores; el acople va sin la tapa de la guarda que mira al lector. Con --detalle, el
   compresor abierto en un círculo, 3,4 veces más grande y visto desde 50° de elevación (ELDET), para que se vean los
   dos rotores engranados.
   Lleva la persona de referencia de 1,75 m (../persona.mjs), de pie frente al tablero.
   Uso: node build.mjs [--audit] [--fast] [--detalle]   (CT_ITEM="pieza" lista lo que se cruza con una pieza;
   CT_PER="x,y,rumbo" prueba otro lugar para la persona; CT_ELDET, otra elevación para el detalle)
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
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const DET = process.argv.includes("--detalle");
const STEP = Number(process.env.CT_STEP || (DET ? 0.5 : 0.25));
const CT = GEO.CT, DN = GEO.DN, RO = CT.rot, CS = CT.cas;
const AZ = CT.AZ, EL = CT.EL;
const ZA = CT.zA, YM = CT.yM, YF = CT.yF;
const ZD = CT.skid.h + CT.pad.h + CT.skid.deck;      // la cara de arriba de la bandeja de la base

const W0 = 680, H0 = 560;                                         // la vista entera (el detalle toma su escala)
const W = DET ? 300 : W0, H = DET ? 300 : H0;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)

/* ---------- la cámara ---------- */
const EXT = [];
for (const x of [CT.pad.x0, CT.pad.x1]) for (const y of [CT.pad.y0, CT.pad.y1]) EXT.push([x, y, 0]);
for (const x of [CT.skid.x0, CT.skid.x1]) for (const y of [-CT.skid.y, CT.skid.y]) EXT.push([x, y, CT.mount.z1]);
EXT.push([CT.suc.inlet - 100, 0, CT.suc.top + 60], [CT.suc.x, 0, CT.suc.valve + 300], [CT.dis.xOut, CT.dis.yEnd - 80, CT.dis.zRun + 100]);
EXT.push([CT.oc.x + 240, CT.oc.y, 1500], [CT.panel.x1, CT.panel.y0, CT.panel.z1], [CT.panel.x1, CT.panel.y1, CT.panel.z1]);
EXT.push([CT.persona.x, CT.persona.y, 0], [CT.persona.x, CT.persona.y, 1800], [CT.persona.x + 250, CT.persona.y, 0]);
const PMAIN = k.fitProjection(EXT, W0, H0, { pad: 12, azimuth: AZ, elevation: EL });
// el detalle: el compresor abierto, MDET veces más grande, dentro de un círculo de RDET
const CDET = [15, 0, ZA + 10], MDET = 3.4, RDET = 140;
// el detalle mira desde más arriba (ELDET), para ver los dos rotores engranados por la carcasa abierta
const ELDET = Number(process.env.CT_ELDET || 50);
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: AZ, elevation: ELDET }; const c = k.iso(CDET, Q); Q.origin = [W / 2 - c[0], H / 2 - c[1]]; return Q; })() : PMAIN;
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso
const KS = G.scaleOf(P);

/* El dibujo va en milímetros; el audit, en centímetros (como el condensador): cm() pasa cada forma registrada a
   centímetros (con sus cortes) y PA es la misma cámara con la escala por 10. */
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
// prisma en un marco cualquiera (sección en u, v; a lo largo de a). Con hold no lo pone: devuelve su dibujo y su forma,
// para pintarlo en la misma pieza que otro (una silla con la banda del recipiente sobre la que se apoya)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null, rec = true, after = "", hold = false } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) });
  const shape = rec ? record(sh) : sh;
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  const svg = X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + after + extra;
  if (hold) return { svg: wrap(svg, ""), shape, centre };
  put(name, centre, svg, shapes || [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", rims, owner, smooth, steps, bevel = 0, cls = "", cut = null, inner = "" } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, mid)), wrap(S(paths, { tone: "mid", inner, ...style }) + extra, cls), [shape]);
  return shape;
}
// un cilindro corto (perno, pasador, tapón, brida) o un tramo recto de tubo: prisma de sección circular
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null, cap = "auto" } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * KS) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cap, ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 140, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, spacing = null, owner = name } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
// un tubo con sus curvas (G.fillet) entre dos caras de brida
function pipe(name, control, r, { cls = "ct-pipe", rad = null, owner = name, ends = [true, true] } = {}) {
  const route = control.length > 2 ? G.fillet(control, rad ?? Math.max(2.2 * r, 40), 10, { P, tube: r }) : control;
  tubeItems(name, route, r, { cls, owner, ends });
  return route;
}
// un cilindro (cuello, asiento) de radio a a lo largo de F.a, desde la superficie curva (start(ángulo) = s donde la
// generatriz toca la superficie) hasta la cara plana en s = h. Se registra como disco cortado por sus anfitriones.
function saddle(name, F, a, start, h, style = {}, { owner, cls = "", extra = "", hosts = [], ref = null } = {}) {
  const low = Math.min(...Array.from({ length: 72 }, (_, i) => start((i / 72) * TAU)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, ref ?? G.add3(F.o, G.mul3(F.a, (low + h) / 2)), wrap(body, cls), [record(A.disc(F, low - 0.05, h, a, { name, owner, cut: hosts }))]);
  return { F, face: G.add3(F.o, G.mul3(F.a, h)), low };
}
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
// un sector de anillo en (u, v), de r0 a r1 y del ángulo a0 al a1: el arco de afuera y el de adentro de vuelta
function sector(r0, r1, a0, a1, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = a0 + ((a1 - a0) * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (let i = n; i >= 0; i--) { const t = a0 + ((a1 - a0) * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
}
const boltDots = (F, s, d, n = d.nb, phase = PI / 4) => Dots(G.dotsOf(F, s, d.bc, n, P, { all: true, phase }), { size: 0.45 });

/* ---------- superficies con tonos suaves (del condensador) ---------- */
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
// una cara plana: polígono 3D con su normal; tono por la luz
function flatFace(pts, n, cls = "", holes = []) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr)) + holes.map((h) => pth1(h.map(pr))).join("");
  const rule = holes.length ? ` fill-rule="evenodd"` : "";
  return `<g class="iso-solid${cls ? " " + cls : ""}">` + (b >= 4 ? `<path class="iso-top"${rule} d="${d}"/>` : `<path class="iso-shade" data-shade="${b}"${rule} d="${d}"/>`) + "</g>";
}
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: XD, v: YD });
const FXL = (y, z) => ({ o: [0, y, z], a: XD, u: YD, v: ZD3 });     // a lo largo de x, por (y, z)
const FYL = (x, z) => ({ o: [x, 0, z], a: YD, u: XD, v: ZD3 });     // a lo largo de y, por (x, z)
const FXM = (y, z) => ({ o: [0, y, z], a: [-1, 0, 0], u: [0, -1, 0], v: ZD3 });   // a lo largo de −x
const FYM = (x, z) => ({ o: [x, 0, z], a: [0, -1, 0], u: XD, v: ZD3 });           // a lo largo de −y
const arcPts = (r, f0, f1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t)]; });

/* ---------- válvulas y volantes ---------- */
// un volante: el aro, tres rayos y el cubo, de eje a lo largo de axis, centrado en c
function handwheel(name, c, axis, R, { owner = name, cls = "ct-wheel", rays = 3, t = 12 } = {}) {
  const F = G.frameAlong(c, axis);
  const rw = Math.max(6, R * 0.09);
  // el aro en dos mitades, partido en sus siluetas (donde la normal es perpendicular a la vista): la de atrás va antes
  // de los rayos de atrás y la de adelante después de los de adelante, que llegan a ella por dentro
  const fv = Math.atan2(G.dot3(V3, F.v), G.dot3(V3, F.u)), nA = 36;
  for (const [half, f0] of [["B", fv + PI / 2], ["F", fv - PI / 2]]) {
    fp(`${name}.rim${half}`, F, sector(R - rw * 2, R, f0, f0 + PI, nA), -t / 2, t / 2, { tone: "mid" }, { owner, cls, skip: new Set([nA, 2 * nA + 1]) });
  }
  disc(`${name}.hub`, F, -t / 2 - 4, t / 2 + 6, Math.max(12, R * 0.18), { tone: "mid" }, { owner, cls });
  for (let q = 0; q < rays; q++) {
    const a = (TAU * q) / rays + 0.3, dir = G.add3(G.mul3(F.u, Math.cos(a)), G.mul3(F.v, Math.sin(a))), side = G.unit3(G.cross3(axis, dir));
    const Fs = { o: c, a: dir, u: side, v: axis };
    fp(`${name}.ray${q}`, Fs, rect(-rw * 0.55, rw * 0.55, -t * 0.3, t * 0.3), Math.max(12, R * 0.18), R - rw * 2, { tone: "mid" }, { owner, cls });
  }
}
// un manómetro: la caja (un disco a lo largo de axis), la esfera blanca con su borde, las marcas, la aguja y el cubo
function gauge(name, c, axis, R, { owner = name, t = 20, needle = 0.5 } = {}) {
  const F = G.frameAlong(c, axis), s1 = t;
  // u y v de la esfera: v hacia arriba en lo posible
  const up = Math.abs(G.dot3(axis, ZD3)) > 0.9 ? XD : ZD3, uu = G.unit3(G.cross3(up, axis)), vv = G.unit3(G.cross3(axis, uu));
  const on = (r, a, ds = 0.3) => G.add3(G.add3(c, G.mul3(axis, s1 + ds)), G.add3(G.mul3(uu, r * Math.cos(a)), G.mul3(vv, r * Math.sin(a))));
  const ring = Array.from({ length: 48 }, (_, i) => on(R - 5, (TAU * i) / 48));
  const a0 = -PI / 4 - PI / 2 + PI, a1 = a0 - 1.5 * PI;           // de abajo a la izquierda a abajo a la derecha, por arriba
  let ticks = "";
  for (let q = 0; q <= 10; q++) { const a = a0 + ((a1 - a0) * q) / 10; ticks += path3([on(R - 5, a, 0.4), on(q % 5 === 0 ? R - 15 : R - 11, a, 0.4)]); }
  const an = a0 + (a1 - a0) * needle;
  const face = `<path class="ct-dial" d="${pth1(ring.map(pr))}"/>` + Ln(path3(ring, true), { tone: "mid" }) + Ln(ticks, { tone: "lo" }) +
    Ln(path3([on(0, 0, 0.5), on(R - 18, an, 0.5)]), { tone: "hi", free: true }) + Dots([at(on(0, 0, 0.6))], { size: 1.1, tone: "hi" });
  disc(name, F, 0, s1, R, { tone: "mid" }, { owner, cls: "ct-cast", extra: face });
}
// válvula de globo bridada: F.a es el sentido del flujo y la cara de entrada está en s0; el bonete y el volante a lo
// largo de stem
function globeValve(name, F, s0, d, { stem = ZD3, owner = name, wheel = 1, len = null } = {}) {
  const Lv = len ?? Math.round(d.fl * 2.9), ft = d.ft, s1 = s0 + Lv, vm = (s0 + s1) / 2;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, { tone: "mid" }, { owner, cls: "ct-cast", extra: boltDots(F, s0, d) });
  const r0 = d.ro * 1.25, r1 = d.fl * 0.95, half = Lv / 2 - ft;
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2)), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner, cls: "ct-cast" });
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, { tone: "mid" }, { owner, cls: "ct-cast", extra: boltDots(F, s1, d) });
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = G.frameAlong(c, stem);
  const rb = d.fl * 0.62, sb0 = Math.sqrt(r1 * r1 - rb * rb) - 3;
  const rBody = (s) => r0 + (r1 - r0) * Math.max(0, Math.cos(((s - vm) / half) * (PI / 2)));
  const FB = { o: c, a: stem, u: G.unit3(G.cross3(stem, F.a)), v: F.a };
  saddle(`${name}.bonnet`, FB, rb, (t) => Math.sqrt(Math.max(0, rBody(vm + rb * Math.sin(t)) ** 2 - (rb * Math.cos(t)) ** 2)) - 0.5, r1 + 18, { tone: "mid" }, { owner, cls: "ct-cast", hosts: [A.solid(F, prof.map(([s, r]) => [s, r]))] });
  disc(`${name}.bfl`, FS, r1 + 18, r1 + 34, rb + 12, { tone: "mid" }, { owner, cls: "ct-cast", extra: Dots(G.dotsOf(FS, r1 + 34, rb + 5, 6, P, { all: true }), { size: 0.45 }) });
  disc(`${name}.yoke`, FS, r1 + 34, r1 + 34 + d.fl * 0.7, rb * 0.45, { tone: "mid" }, { owner, cls: "ct-cast" });
  const sTop = r1 + 34 + d.fl * 0.7;
  disc(`${name}.stem`, FS, sTop, sTop + 26, Math.max(7, d.ro * 0.22), { tone: "mid" }, { owner, cls: "ct-ss" });
  const wc = G.add3(c, G.mul3(stem, sTop + 14)), WR = d.fl * 1.05 * wheel;
  handwheel(`${name}.hw`, wc, stem, WR, { owner, t: Math.max(10, WR * 0.12) });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, s1, top: G.add3(c, G.mul3(stem, sTop + 30)), wheel: wc, WR };
}
// válvula de bola bridada con palanca (las del aceite)
function ballValve(name, F, s0, d, { stem = ZD3, owner = name, lever = 140 } = {}) {
  const Lv = 165, ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, { tone: "mid" }, { owner, cls: "ct-cast", extra: boltDots(F, s0, d) });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2)), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner, cls: "ct-cast" });
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, { tone: "mid" }, { owner, cls: "ct-cast", extra: boltDots(F, s1, d) });
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = { o: c, a: stem, u: G.unit3(G.cross3(stem, F.a)), v: F.a };
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - 14 * 14) - 2, r1 + 26, 14, { tone: "mid" }, { owner, cls: "ct-cast" });
  disc(`${name}.stem`, FS, r1 + 26, r1 + 36, 6, { tone: "mid" }, { owner, cls: "ct-ss" });
  const lv = F.a, FL2 = { o: G.add3(c, G.mul3(stem, r1 + 36)), a: lv, u: stem, v: G.unit3(G.cross3(lv, stem)) };
  fp(`${name}.lever`, FL2, [[0, -9], [6, -9], [6, 9], [0, 9]], -14, lever, { tone: "mid" }, { owner, cls: "ct-lever" });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), s1, top: G.add3(c, G.mul3(stem, r1 + 30)) };
}
// un par de bridas donde sigue la línea, con un tramo corto y su brida ciega de prueba
function lineEnd(name, F, s, d, owner) {
  disc(`${name}.e0`, F, s, s + d.ft, d.fl, { tone: "mid" }, { owner: owner + "2", cls: "ct-cast" });
  disc(`${name}.e1`, F, s + d.ft, s + 2 * d.ft, d.fl, { tone: "mid" }, { owner: owner + "2", cls: "ct-cast", extra: boltDots(F, s + 2 * d.ft, d) });
  disc(`${name}.stub`, F, s + 2 * d.ft, s + 2 * d.ft + 70, d.ro, { tone: "mid" }, { owner: owner + "2", cls: "ct-pipe" });
  return G.add3(F.o, G.mul3(F.a, s + 2 * d.ft + 70));
}
// una flecha de flujo (del condensador): blanca con borde
function arrowOf(ctl, { w = 4.2, h = 8, r = 10, cls = "ct-flujo" } = {}) {
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
  return { mid: pts[Math.floor(pts.length / 2)], svg: `<path class="${cls}-o" d="${line}"/><path class="${cls}" d="${line}"/><path class="${cls}-p" d="${head}"/>`, shapes: [A.tube(pts, r), A.ball(pts[pts.length - 1], w / KS)] };
}
function arrow(name, ctl, opts = {}) { const f = arrowOf(ctl, opts); put(name, f.mid, f.svg, f.shapes); }

/* ====================================================================
   0 · los rotores: el macho y la hembra, cada uno su superficie helicoidal de lóbulos (o canales) partida en
   cuadriláteros, pintados de atrás hacia adelante con los tonos de la luz; los bordes de cada cuadrilátero que dan a
   uno que no se ve (o al extremo del rotor) son la silueta, y los quiebres entre lóbulo y círculo de paso, pliegues
   ==================================================================== */
function rotoresSvg({ perLobe, land, ns }) {
  const L = RO.x1 - RO.x0, quads = [];
  const grid = (yc, rfun, n, half, sign, wrap) => {
    const phis = [], sharp = new Set();
    for (let kq = 0; kq < n; kq++) {
      const c = (360 * kq) / n;
      sharp.add(phis.length);
      for (let q = 0; q < perLobe; q++) phis.push(c - half + (2 * half * q) / perLobe);
      sharp.add(phis.length);
      const l0 = c + half, l1 = c + 360 / n - half;
      for (let q = 0; q < land; q++) phis.push(l0 + ((l1 - l0) * q) / land);
    }
    const pts = [];
    for (let j = 0; j <= ns; j++) {
      const s = RO.x0 + (L * j) / ns, psi = sign * wrap * (j / ns), row = [];
      for (const phi of phis) { const r = rfun(phi), a = (phi + psi) * D2R; row.push([s, yc + r * Math.cos(a), ZA + r * Math.sin(a)]); }
      pts.push(row);
    }
    return { pts, n: phis.length, sharp };
  };
  const rotors = [
    grid(YM, GEO.rMacho, RO.nm, GEO.semiLobulo(RO.rm), 1, RO.wrapM),
    grid(YF, (p) => GEO.rHembra(p), RO.nf, GEO.semiLobulo(RO.rf), -1, (RO.wrapM * RO.nm) / RO.nf),
  ];
  rotors.forEach((g, gi) => {
    const vis = [];
    for (let j = 0; j < ns; j++) {
      vis.push([]);
      for (let i = 0; i < g.n; i++) {
        const i1 = (i + 1) % g.n, p00 = g.pts[j][i], p10 = g.pts[j][i1], p01 = g.pts[j + 1][i], p11 = g.pts[j + 1][i1];
        const nrm = G.cross3(G.sub3(G.lerp3(p10, p11, 0.5), G.lerp3(p00, p01, 0.5)), G.sub3(G.lerp3(p01, p11, 0.5), G.lerp3(p00, p10, 0.5)));
        const nn = G.unit3(nrm), v = G.dot3(nn, V3) > 1e-4;
        vis[j].push(v);
        if (v) quads.push({ g: gi, i, j, pts: [p00, p10, p11, p01], band: BAND(G.dot3(nn, L3)), d: C.depth(...G.mul3(G.add3(G.add3(p00, p11), G.add3(p10, p01)), 0.25)) });
      }
    }
    g.vis = vis;
  });
  quads.sort((a, b) => a.d - b.d);
  const rank = new Map(quads.map((q, idx) => [`${q.g}.${q.i}.${q.j}`, idx]));
  const seg = (a, b) => { const p = pr(a), q = pr(b); return "M" + r10(p[0]) + " " + r10(p[1]) + "L" + r10(q[0]) + " " + r10(q[1]); };
  const out = [];
  let key = null, fills = [], edges = [], creases = [];
  const flush = () => {
    if (key !== null) {
      out.push(key === 4 ? `<path class="iso-top" d="${fills.join("")}"/>` : `<path class="iso-shade" data-shade="${key}" d="${fills.join("")}"/>`);
      if (creases.length) out.push(`<path class="iso-line iso-crease" data-tone="lo" d="${creases.join("")}"/>`);
      if (edges.length) out.push(`<path class="iso-line iso-edge" data-tone="mid" d="${edges.join("")}"/>`);
    }
    fills = []; edges = []; creases = [];
  };
  for (const q of quads) {
    const g = rotors[q.g], { i, j } = q, n = g.n, [p00, p10, p11, p01] = q.pts;
    if (q.band !== key) { flush(); key = q.band; }
    fills.push(pth1(q.pts.map(pr)));
    const me = rank.get(`${q.g}.${i}.${j}`);
    // los lados a lo largo del rotor: el de i (con el cuadrilátero i − 1) y el de i + 1 (con el i + 1)
    for (const [side, other, a, b] of [[i, (i - 1 + n) % n, p00, p01], [(i + 1) % n, (i + 1) % n, p10, p11]]) {
      if (!g.vis[j][other]) edges.push(seg(a, b));
      else if (g.sharp.has(side) && rank.get(`${q.g}.${other}.${j}`) < me) creases.push(seg(a, b));
    }
    // los lados de través: el de j (con el j − 1) y el de j + 1
    if (j === 0 || !g.vis[j - 1][i]) edges.push(seg(p00, p10));
    if (j === ns - 1 || !g.vis[j + 1][i]) edges.push(seg(p01, p11));
  }
  flush();
  return `<g class="iso-solid ct-rotor" data-seamless="">${out.join("")}</g>`;
}

/* ====================================================================
   1 · la losa, la base de canales con su bandeja y el separador de aceite con sus sillas, sus boquillas, el registro
   de los coalescedores y el visor de nivel
   ==================================================================== */
const SK = CT.skid, SP = CT.sep, MT = CT.mount;
const zS0 = CT.pad.h, zS1 = CT.pad.h + SK.h;
const FSEP = FXL(0, SP.z);
const sepProf = (() => {
  const out = [], n = 12;
  for (let i = 0; i <= n; i++) { const a = PI / 2 - (PI / 2) * (i / n); out.push([SP.x0 - SP.hd * Math.sin(a), SP.R * Math.cos(a), i > 0 && i < n ? 1 : 0]); }
  for (let i = 0; i <= n; i++) { const a = (PI / 2) * (i / n); out.push([SP.x1 + SP.hd * Math.sin(a), SP.R * Math.cos(a), i > 0 && i < n ? 1 : 0]); }
  return out.map(([s, r, sm]) => (sm ? [s, Math.max(0, r), 1] : [s, Math.max(0, Math.abs(r) < 1e-6 ? 0 : r)]));
})();
const sepHost = A.solid(FSEP, sepProf.map(([s, r]) => [s, r]));
const onShell = (ang) => [SP.R * Math.cos(ang * D2R), SP.R * Math.sin(ang * D2R)];   // (y, z − zSep) a ese ángulo desde +y
if (!DET) {
  box("stand.pad", [CT.pad.x0, CT.pad.y0, 0], [CT.pad.x1, CT.pad.y1, CT.pad.h], { tone: "mid" }, { r: 6, steps: 2, bevel: 0.6, cls: "ct-conc", ground: true });
  // los canales a lo largo: el alma afuera y las alas hacia adentro
  [-1, 1].forEach((sg, i) => {
    const y0 = sg * SK.y, yi = sg * (SK.y - SK.b), w = sg * (SK.y - SK.tw);
    const sec = [[y0, zS0], [yi, zS0], [yi, zS0 + SK.tf], [w, zS0 + SK.tf], [w, zS1 - SK.tf], [yi, zS1 - SK.tf], [yi, zS1], [y0, zS1]];
    fp(`stand.ch${i}`, FXL(0, 0), sg > 0 ? sec : sec.slice().reverse(), SK.x0, SK.x1, { tone: "mid" }, { cls: "ct-paint", ground: true });
  });
  // los canales de los extremos, entre los de a lo largo
  [SK.x0, SK.x1 - SK.b].forEach((x0, i) => box(`stand.end${i}`, [x0, -SK.y + SK.b, zS0], [x0 + SK.b, SK.y - SK.b, zS1], { tone: "mid" }, { cls: "ct-paint", ground: true }));
  // la bandeja de lámina sobre la base, con sus costuras
  const seams = Ln([-700, 0, 700].map((x) => path3([[x, -SK.y, ZD + 0.3], [x, SK.y, ZD + 0.3]])).join(""), { tone: "faint" });
  box("stand.deck", [SK.x0, -SK.y, zS1], [SK.x1, SK.y, ZD], { tone: "mid" }, { r: 2, cls: "ct-paint", ground: true, extra: seams });
  ANCH.BASE = [-1100, SK.y, zS0 + 100];
}
// las secciones de las sillas: las del separador, una lámina curva bajo el casco, y las del bastidor, sobre el casco,
// con el borde de abajo en arco contra él y la cara de arriba plana
function sepSadSec() {
  const yw = 210, zEdge = SP.z - Math.sqrt(SP.R * SP.R - yw * yw);
  const sec = [[-yw, ZD + 14], [yw, ZD + 14], [yw, zEdge]];
  for (let q = 1; q < 24; q++) { const y = yw - (2 * yw * q) / 24; sec.push([y, SP.z - Math.sqrt(SP.R * SP.R - y * y)]); }
  sec.push([-yw, zEdge]);
  return sec;
}
function mountSadSec() {
  const yw = MT.y + 35, sec = [[-yw, MT.z0], [yw, MT.z0]];
  for (let q = 0; q <= 24; q++) { const y = yw - (2 * yw * q) / 24; sec.push([y, SP.z + Math.sqrt(SP.R * SP.R - y * y)]); }
  return sec;
}
const FX0 = { o: [0, 0, 0], a: XD, u: YD, v: ZD3 };
const OC_X = CT.oc.x, OC_Y = CT.oc.y, OC_R = CT.oc.R;                               // el enfriador de aceite, que tapa la cabeza de +x
const HH_R = 120, HH_S0 = SP.x1 + SP.hd * Math.sqrt(1 - (HH_R / SP.R) ** 2);   // el cuello del registro y dónde arranca en la cabeza
{
  // el recipiente: casco y cabezas, con las costuras de las cabezas
  if (!DET) {
    // las sillas del separador (con su placa de asiento) y las del bastidor: cada una se pinta en la misma pieza que
    // la banda del recipiente que tiene encima o debajo, la de abajo antes de la banda y la de arriba después
    const held = [];
    SP.sad.forEach((xs, i) => {
      const yw = 210;
      box(`sep.sadbase${i}`, [xs - 90, -yw - 20, ZD], [xs + 90, yw + 20, ZD + 14], { tone: "mid" }, { owner: "sep", cls: "ct-paint", extra: Dots([[xs - 70, -yw], [xs + 70, -yw], [xs - 70, yw], [xs + 70, yw]].map(([x, y]) => at([x, y, ZD + 14.3])), { size: 0.5 }) });
      held.push({ s0: xs - SP.tw / 2, under: true, ...fp(`sep.sad${i}`, FX0, sepSadSec(), xs - SP.tw / 2, xs + SP.tw / 2, { tone: "mid" }, { owner: "sep", cls: "ct-paint", hold: true }) });
    });
    MT.sad.forEach((xs, i) => held.push({ s0: xs - 8, under: false, ...fp(`mount.sad${i}`, FX0, mountSadSec(), xs - 8, xs + 8, { tone: "mid" }, { owner: "mount", cls: "ct-paint", hold: true }) }));
    // el recipiente va en bandas, partido en las sillas; cada banda lleva su tramo de la silueta (sidesOf), que es una
    // sola curva a lo largo de todo el recipiente
    const cuts = [SP.x0, SP.x1];
    for (const h of held) cuts.push(h.s0, h.s0 + (h.under ? SP.tw : 16));
    const SB = G.bandsOf(sepProf, cuts, FSEP, P, { rows: 8 });
    SB.bands.forEach((b, i) => {
      const weld = [SP.x0, SP.x1].some((x) => Math.abs(b.s1 - x) < 1e-6) ? b.seam : "";
      const sh = record(A.solid(FSEP, b.profile, { name: `sep.b${i}`, owner: "sep", radius: SB.radius }));
      // la silueta de la cabeza de +x baja hacia el registro por detrás del enfriador de aceite: termina donde el
      // enfriador ya la tapa (su silueta de la derecha, en pantalla), para que lo que se ve acabe en su contorno
      let sEnd = b.s1;
      if (b.s1 > SP.x1 + 1) {
        const xHide = at([OC_X, OC_Y, 0])[0] + OC_R * KS - 1.5, endX = (q) => Math.max(...SB.sidesOf(b.s0, q).points.map((l) => at(l[l.length - 1])[0]));
        let lo = b.s0 + 1, hi = HH_S0;
        if (endX(hi) > xHide) { for (let it = 0; it < 30; it++) { const mid = (lo + hi) / 2; if (endX(mid) > xHide) hi = mid; else lo = mid; } sEnd = lo; } else sEnd = HH_S0;
      }
      const sd = SB.sidesOf(b.s0, sEnd);
      const tubes = sd.points.map((list) => record(A.tube(list, 0.4 / KS, { owner: "sep" })));
      const body = wrap(S(b.paths, { tone: "mid", inner: weld }), "ct-vessel") + Ln(sd.d, { tone: "mid" });
      const h = held.find((q) => Math.abs(q.s0 - b.s0) < 1e-6);
      const svg = h ? (h.under ? h.svg + body : body + h.svg) : body;
      put(`sep.b${i}`, G.add3(FSEP.o, G.mul3(XD, (b.s0 + b.s1) / 2)), svg, [sh, ...tubes, ...(h ? [h.shape] : [])]);
    });
  }
  ANCH.SEPARADOR = G.pointOf(FSEP, SP.x0 - 60, SP.R * Math.sqrt(1 - (60 / SP.hd) ** 2) + 1, -0.15);   // en la cabeza de −x
}
if (!DET) {
  // la placa de datos del separador, en el casco, del lado del lector: una lámina delgada curva
  {
    const a0 = 8, a1 = 32, x0 = -950, x1 = -830, n = 8, pts = [];
    for (let q = 0; q <= n; q++) { const [y, z] = onShell(a0 + ((a1 - a0) * q) / n); pts.push([y + 2 * Math.cos((a0 + ((a1 - a0) * q) / n) * D2R), z]); }
    const sec = [...arcPts(SP.R + 0.2, a0 * D2R, a1 * D2R, n), ...arcPts(SP.R + 2.6, a1 * D2R, a0 * D2R, n)];
    let rules = "";
    for (const f of [0.3, 0.5, 0.7]) { const a = (a0 + (a1 - a0) * f) * D2R; rules += path3([[x0 + 22, (SP.R + 2.9) * Math.cos(a), SP.z + (SP.R + 2.9) * Math.sin(a)], [x1 - 22, (SP.R + 2.9) * Math.cos(a), SP.z + (SP.R + 2.9) * Math.sin(a)]]); }
    fp("sep.plate", FXL(0, SP.z), sec, x0, x1, { tone: "mid" }, { owner: "sep", cls: "ct-ss", extra: Ln(rules, { tone: "lo", free: true }) });
  }
  // el registro de los coalescedores en la cabeza de +x: el cuello y la tapa empernada
  const rh = HH_R, sStart = HH_S0;
  saddle("sep.hh", FSEP, rh, () => sStart - 1, SP.x1 + SP.hd + 45, { tone: "mid" }, { owner: "sep", cls: "ct-vessel", hosts: [sepHost] });
  disc("sep.hhfl", FSEP, SP.x1 + SP.hd + 45, SP.x1 + SP.hd + 75, rh + 32, { tone: "mid" }, { owner: "sep", cls: "ct-vessel", extra: Dots(G.dotsOf(FSEP, SP.x1 + SP.hd + 75, rh + 18, 12, P, { all: true }), { size: 0.5 }) });
  disc("sep.hhcap", FSEP, SP.x1 + SP.hd + 75, SP.x1 + SP.hd + 100, rh + 32, { tone: "mid" }, { owner: "sep", cls: "ct-vessel", extra: Dots(G.dotsOf(FSEP, SP.x1 + SP.hd + 100, rh + 18, 12, P, { all: true }), { size: 0.5 }) });
  ANCH.REGISTRO = G.pointOf(FSEP, SP.x1 + SP.hd + 100, rh * 0.5, 1.2);
}

/* ====================================================================
   2 · el bastidor de arriba: los postes de las esquinas, las vigas, los travesaños y las placas de asiento
   ==================================================================== */
{
  // las sillas sobre el casco (en la vista entera van con las bandas del recipiente; en el detalle, solas)
  if (DET) MT.sad.forEach((xs, i) => { if (xs > -400) fp(`mount.sad${i}`, FX0, mountSadSec(), xs - 8, xs + 8, { tone: "mid" }, { owner: "mount", cls: "ct-paint" }); });
  // los dos canales: el alma afuera y las alas hacia adentro
  [-1, 1].forEach((sg, i) => {
    const y0 = sg * MT.y, yi = sg * (MT.y - MT.b), w = sg * (MT.y - MT.tw), z0 = MT.z0, z1 = MT.z1;
    const sec = [[y0, z0], [yi, z0], [yi, z0 + MT.tf], [w, z0 + MT.tf], [w, z1 - MT.tf], [yi, z1 - MT.tf], [yi, z1], [y0, z1]];
    // en el detalle no está la base: los canales son el piso
    fp(`mount.ch${sg > 0 ? "F" : "B"}`, FXL(0, 0), sg > 0 ? sec : sec.slice().reverse(), DET ? -400 : MT.x0, MT.x1, { tone: "mid" }, { owner: "mount", cls: "ct-paint", ground: DET });
  });
}
ANCH.BASTIDOR = [-1150, MT.y, (MT.z0 + MT.z1) / 2];

/* ====================================================================
   3 · el motor de 45 kW sobre su placa, con su caja de conexiones y su placa de datos
   ==================================================================== */
const MO = CT.motor, FMO = FXL(YM, ZA);
if (!DET) {
  box("motor.sole", [MO.feet[0] - 90, -MT.y - 30, MT.z1], [MO.feet[1] + 90, YM + 240, CT.zSole], { tone: "mid" }, { owner: "motor", cls: "ct-paint", r: 2 });
  // las patas: la cara de arriba sigue la carcasa
  MO.feet.forEach((xf, i) => [-1, 1].forEach((sy) => {
    const y0 = 146, y1 = 200, sec = [[sy * y0, CT.zSole], [sy * y1, CT.zSole]];
    for (let q = 0; q <= 8; q++) { const y = y1 - ((y1 - y0) * q) / 8; sec.push([sy * y, ZA - Math.sqrt(MO.R * MO.R - y * y)]); }
    fp(`motor.foot${i}${sy > 0 ? "F" : "B"}`, FXL(YM, 0), sy > 0 ? sec : sec.slice().reverse(), xf - 45, xf + 45, { tone: "mid" }, { owner: "motor", cls: "ct-motor", extra: Dots([at([xf, YM + sy * 180, CT.zSole + 22])], { size: 0.6 }) });
  }));
  // las aletas: generatrices de la carcasa del lado que se ve
  let fins = "";
  for (let q = 0; q < 40; q++) { const t = (q / 40) * TAU, n3 = [0, Math.cos(t), Math.sin(t)]; if (G.dot3(n3, V3) < 0.1 || Math.sin(t) < -0.5) continue; fins += path3([[MO.x0, YM + (MO.R + 0.4) * Math.cos(t), ZA + (MO.R + 0.4) * Math.sin(t)], [MO.x1, YM + (MO.R + 0.4) * Math.cos(t), ZA + (MO.R + 0.4) * Math.sin(t)]]); }
  turned("motor.cowl", FMO, [[MO.cowl, 150], [MO.cowl + 12, 196], [MO.x0, 196]], { tone: "mid" }, { owner: "motor", cls: "ct-motor" });
  disc("motor.body", FMO, MO.x0, MO.x1, MO.R, { tone: "mid" }, { owner: "motor", cls: "ct-motor", extra: Ln(fins, { tone: "faint" }) });
  disc("motor.de", FMO, MO.x1, MO.de, 172, { tone: "mid" }, { owner: "motor", cls: "ct-motor", extra: Dots(G.dotsOf(FMO, MO.de, 150, 8, P, { all: false }), { size: 0.45 }) });
  disc("motor.shaft", FMO, MO.de, CT.cpl.h1[0], 30, { tone: "mid" }, { owner: "motor", cls: "ct-ss" });
  // la caja de conexiones, arriba, con su tapa y su prensaestopas
  const xb = -760;
  box("motor.tbox", [xb - 130, YM - 115, ZA + MO.R - 6], [xb + 130, YM + 115, ZA + MO.R + 110], { tone: "mid" }, { owner: "motor", cls: "ct-motor", r: 6, extra: Dots([[xb - 115, YM - 100], [xb + 115, YM - 100], [xb - 115, YM + 100], [xb + 115, YM + 100]].map(([x, y]) => at([x, y, ZA + MO.R + 110.3])), { size: 0.5 }) });
  disc("motor.gland", FYL(xb, ZA + MO.R + 55), YM + 115, YM + 150, 22, { tone: "mid" }, { owner: "motor", cls: "ct-cast" });
  // la placa de datos, del lado del lector
  {
    const a0 = 6, a1 = 40, x0 = -1000, x1 = -800, n = 8;
    const sec = [...arcPts(MO.R + 0.6, a0 * D2R, a1 * D2R, n), ...arcPts(MO.R + 3, a1 * D2R, a0 * D2R, n)];
    let rules = "";
    for (const f of [0.28, 0.5, 0.72]) { const a = (a0 + (a1 - a0) * f) * D2R; rules += path3([[x0 + 24, YM + (MO.R + 3.3) * Math.cos(a), ZA + (MO.R + 3.3) * Math.sin(a)], [x1 - 24, YM + (MO.R + 3.3) * Math.cos(a), ZA + (MO.R + 3.3) * Math.sin(a)]]); }
    fp("motor.plate", FMO, sec, x0, x1, { tone: "mid" }, { owner: "motor", cls: "ct-ss", extra: Ln(rules, { tone: "lo", free: true }) });
  }
  ANCH.MOTOR = G.pointOf(FMO, -1050, MO.R, 0.5);
}

/* ====================================================================
   4 · el acople de espaciador y su guarda (sin la tapa que mira al lector)
   ==================================================================== */
const CP = CT.cpl;
if (!DET) {
  disc("cpl.h1", FMO, CP.h1[0], CP.h1[1], 72, { tone: "mid" }, { owner: "cpl", cls: "ct-ss" });
  disc("cpl.d1", FMO, CP.h1[1], CP.h1[1] + 8, 80, { tone: "mid" }, { owner: "cpl", cls: "ct-ss", extra: Dots(G.dotsOf(FMO, CP.h1[1] + 8, 64, 6, P, { all: true }), { size: 0.5 }) });
  disc("cpl.sp", FMO, CP.sp[0] + 8, CP.sp[1] - 8, 42, { tone: "mid" }, { owner: "cpl", cls: "ct-ss" });
  disc("cpl.d2", FMO, CP.h2[0] - 8, CP.h2[0], 80, { tone: "mid" }, { owner: "cpl", cls: "ct-ss", extra: Dots(G.dotsOf(FMO, CP.h2[0], 64, 6, P, { all: true }), { size: 0.5 }) });
  disc("cpl.h2", FMO, CP.h2[0], CP.h2[1], 66, { tone: "mid" }, { owner: "cpl", cls: "ct-ss" });
  // la guarda: el fondo, el respaldo perforado y la tapa de arriba
  const [g0, g1] = CP.guard, yb = YM - 125, yf = YM + 135, zt = ZA + 120;
  const holes = []; for (let x = g0 + 18; x <= g1 - 14; x += 22) for (let z = MT.z1 + 30; z <= zt - 14; z += 22) holes.push(at([x, yb + 0.3 + 4, z]));
  box("guard.base", [g0, -MT.y - 10, MT.z1], [g1, MT.y + 10, MT.z1 + 5], { tone: "mid" }, { owner: "guard", cls: "ct-yel" });
  box("guard.back", [g0, yb, MT.z1 + 5], [g1, yb + 4, zt], { tone: "mid" }, { owner: "guard", cls: "ct-yel", extra: Dots(holes, { size: 0.42 }) });
  box("guard.top", [g0, yb, zt], [g1, yf, zt + 4], { tone: "mid" }, { owner: "guard", cls: "ct-yel" });
  ANCH.ACOPLE = G.pointOf(FMO, (CP.sp[0] + CP.sp[1]) / 2, 42, 0.6);
  ANCH.GUARDA = [(g0 + g1) / 2, yf - 30, zt + 4];
}

/* ====================================================================
   5 · el compresor: la caja del sello, la de la succión, la carcasa de los rotores (sin la mitad de arriba), los
   rotores, la caja de la descarga, la tapa de los cojinetes, el cilindro de la válvula deslizante con su indicador,
   las patas y sus pedestales, el cuello de la succión, el de la descarga y la boquilla del aceite
   ==================================================================== */
// la sección exterior de la carcasa (en y, z relativos a y = 0, z = zA): dos semicírculos unidos y el bolsillo de
// la válvula deslizante debajo
const casOuter = (() => {
  const Ro = CS.Ro, ys = CS.ySv, zb = CS.zBot;
  const out = [];
  out.push(...arcPts(Ro, -PI / 2, PI / 2, 14).map(([y, z]) => [YM + y, z]));            // el lado del macho (+y)
  out.push(...arcPts(Ro, PI / 2, 1.5 * PI, 14).map(([y, z]) => [YF + y, z]));           // el de la hembra (−y)
  // abajo: el bolsillo de la corredera, con las esquinas achaflanadas
  out.push([-ys, -Ro - 12], [-ys + 6, zb + 10], [-ys + 18, zb], [ys - 18, zb], [ys - 6, zb + 10], [ys, -Ro - 12]);
  return out.map(([y, z]) => [Math.abs(y) < 1e-9 ? 0 : y, Math.abs(z) < 1e-9 ? 0 : z]);
})();
// las dos mitades de abajo de la carcasa de los rotores: la del macho (y ≥ 0) y la de la hembra (y ≤ 0)
const yCusp = 0, zCusp = -Math.sqrt(CS.Ri * CS.Ri - YM * YM);
// el frente se parte en el piso (bajo ZWALL, detrás del macho) y la pared (encima, delante de él)
const ZWALL = -36;
function halfSec(sg, part = "all") {
  const Ro = CS.Ro, Ri = CS.Ri, ys = CS.ySv, zb = CS.zBot, yc = sg > 0 ? YM : YF;
  const ao = Math.asin(ZWALL / Ro), ai = Math.asin(ZWALL / Ri);
  if (part === "wall") {
    const pts = [];
    for (const [y, z] of arcPts(Ro, 0, ao, 8)) pts.push([yc + sg * y, z]);
    for (const [y, z] of arcPts(Ri, ai, 0, 8)) pts.push([yc + sg * y, z]);
    return pts.map(([y, z]) => [y, Math.abs(z) < 1e-9 ? 0 : Math.abs(z - ZWALL) < 1e-9 ? ZWALL : z]);
  }
  // de la cara del corte por fuera, abajo por el lado, el bolsillo, y = 0 hasta el pico y el agujero de vuelta
  const pts = part === "floor" ? [] : [[yc + sg * Ro, 0]];
  const outer = part === "floor" ? arcPts(Ro, ao, -PI / 2, 10) : arcPts(Ro, 0, -PI / 2, 12).slice(1);
  for (const [y, z] of outer) pts.push([yc + sg * y, z]);
  pts.push([sg * ys, -Ro - 12], [sg * (ys - 6), zb + 10], [sg * (ys - 18), zb], [0, zb], [0, zCusp]);
  const aC = Math.atan2(zCusp, -YM), aEnd = part === "floor" ? ai : 0;
  for (let q = 1; q <= 18; q++) { const a = aC + (aEnd - aC) * (q / 18); pts.push([yc + sg * Ri * Math.cos(a), Ri * Math.sin(a)]); }
  return pts.map(([y, z]) => [Math.abs(y) < 1e-9 ? 0 : y, Math.abs(z) < 1e-9 ? 0 : Math.abs(z - ZWALL) < 1e-9 ? ZWALL : z]);
}
{
  const FC = FXL(0, ZA);
  // la caja del sello, redonda, alrededor del eje del macho
  disc("comp.seal", FXL(YM, ZA), CS.seal[0], CS.seal[1], 78, { tone: "mid" }, { owner: "comp", cls: "ct-comp", extra: Dots(G.dotsOf(FXL(YM, ZA), CS.seal[0], 62, 8, P, { all: false }), { size: 0.45 }) });
  disc("comp.shaft", FXL(YM, ZA), CP.h2[1], CS.seal[0], 28, { tone: "mid" }, { owner: "comp", cls: "ct-ss" });
  // la caja de la succión, entera
  fp("comp.suc", FC, casOuter, CS.suc[0], CS.suc[1], { tone: "mid" }, { owner: "comp", cls: "ct-comp" });
  // la carcasa de los rotores, la mitad de abajo, en dos piezas; la cara del corte va aparte, en el tono del corte.
  // El piso de la del macho (lo que queda bajo ZWALL) abraza al rotor por debajo: va en la misma pieza que los rotores,
  // pintado antes que ellos (su cara del extremo, la única que podría tapar al rotor, queda bajo la caja de la descarga)
  let floorM = null;
  for (const [sg, part] of [[-1, "all"], [1, "floor"], [1, "wall"]]) {
    const sec = halfSec(sg, part), nm = sg < 0 ? "comp.halfF" : part === "wall" ? "comp.wallM" : "comp.floorM";
    // las caras que no se pintan: la del corte (z = 0) y la de y = 0 (la que da a la otra mitad)
    const skip = new Set();
    sec.forEach((p, j) => { const q = sec[(j + 1) % sec.length]; if ((Math.abs(p[1]) < 1e-6 && Math.abs(q[1]) < 1e-6) || (Math.abs(p[0]) < 1e-6 && Math.abs(q[0]) < 1e-6) || (Math.abs(p[1] - ZWALL) < 1e-6 && Math.abs(q[1] - ZWALL) < 1e-6)) skip.add(j); });
    const yo = sg > 0 ? YM + CS.Ro : YF - CS.Ro, yi = sg > 0 ? YM + CS.Ri : YF - CS.Ri;
    const cut = part === "floor" ? "" : flatFace([[RO.x0, yi, ZA], [RO.x1, yi, ZA], [RO.x1, yo, ZA], [RO.x0, yo, ZA]], ZD3, "ct-cut-c");
    const h = fp(nm, FC, sec, RO.x0, RO.x1, { tone: "mid" }, { owner: "comp", cls: "ct-comp", skip, after: cut, hold: part === "floor" });
    if (part === "floor") floorM = h;
  }
  // los rotores
  const det = DET ? { perLobe: 12, land: 3, ns: 36 } : { perLobe: 7, land: 2, ns: 16 };
  const Rmt = RO.rm + RO.rho, Rft = RO.rf;
  const shM = A.solid(FXL(YM, ZA), [[RO.x0 + 0.5, 0], [RO.x0 + 0.5, Rmt], [RO.x1 - 0.5, Rmt], [RO.x1 - 0.5, 0]], { name: "rotor.M", owner: "rotor", cut: [A.disc(FXL(YF, ZA), RO.x0 - 5, RO.x1 + 5, Rft)] });
  const shF = A.disc(FXL(YF, ZA), RO.x0 + 0.5, RO.x1 - 0.5, Rft, { name: "rotor.F", owner: "rotor" });
  record(shM); record(shF);
  put("rotores", [(RO.x0 + RO.x1) / 2, 0, ZA], floorM.svg + rotoresSvg(det), [floorM.shape, shM, shF]);
  ANCH.MACHO = [(RO.x0 + RO.x1) / 2 + 20, YM, ZA + Rmt];
  ANCH.HEMBRA = [RO.x0 + 30, YF - 20, ZA + Rft * 0.9];
  // la caja de la descarga y la tapa de los cojinetes, enteras
  fp("comp.dis", FC, casOuter, CS.dis[0], CS.dis[1], { tone: "mid" }, { owner: "comp", cls: "ct-comp" });
  const capSec = casOuter.map(([y, z]) => [y * 0.92, z * 0.92]);
  fp("comp.cap", FC, capSec, CS.cap[0], CS.cap[1], { tone: "mid" }, { owner: "comp", cls: "ct-comp", extra: Dots([[YM + 60, 50], [YM + 60, -50], [YF - 60, 50], [YM, 75], [YF, 75]].map(([y, z]) => at([CS.cap[1] + 0.3, y, ZA + z])), { size: 0.45 }) });
  // las bridas entre las cajas: un filete de pernos en el borde de la caja de la succión y de la descarga
  // el cilindro de la válvula deslizante y su indicador de posición, bajo los rotores
  const SV = CT.slide, Fsv = FXL(0, ZA + SV.z);
  disc("comp.slidecyl", Fsv, CS.cap[1], SV.x1, SV.R, { tone: "mid" }, { owner: "comp", cls: "ct-comp", extra: Dots(G.dotsOf(Fsv, SV.x1, SV.R - 10, 6, P, { all: true }), { size: 0.45 }) });
  disc("comp.slideind", Fsv, SV.x1, SV.x1 + SV.ind, 26, { tone: "mid" }, { owner: "comp", cls: "ct-cast" });
  disc("comp.slidegl", FYL(SV.x1 + SV.ind / 2, ZA + SV.z), 26 - 2, 26 + 26, 11, { tone: "mid" }, { owner: "comp", cls: "ct-cast" });
  ANCH.CORREDERA = G.pointOf(Fsv, (CS.cap[1] + SV.x1) / 2, SV.R, 0.9);
  // las patas: una bajo la caja de la succión y otra bajo la tapa, sobre sus travesaños
  const zFoot = MT.z1;
  box("comp.foot0", [-160, -MT.y - 30, zFoot], [-80, MT.y + 30, ZA + CS.zBot], { tone: "mid" }, { owner: "comp", cls: "ct-comp", r: 3 });
  box("comp.foot1", [248, -MT.y - 30, zFoot], [308, MT.y + 30, ZA + CT.slide.z - CT.slide.R], { tone: "mid" }, { owner: "comp", cls: "ct-comp", r: 3 });
  ANCH.COMPRESOR = [CS.dis[0] + 40, YM + CS.Ro, ZA - 20];
}

/* ====================================================================
   6 · la succión: el cuello, el filtro con su tapa lateral y la válvula de cierre y retención, de ángulo, con su
   volante; la línea de succión que llega de arriba
   ==================================================================== */
const SU = CT.suc, NS = DN[80], ZT = ZA + CS.Ro;
{
  const Fv = FZ(SU.x, 0, 0);
  disc("suc.neck", Fv, ZT - 1, SU.neck, 52, { tone: "mid" }, { owner: "comp", cls: "ct-comp" });
  disc("suc.fl0", Fv, SU.neck, SU.neck + SU.fl, NS.fl, { tone: "mid" }, { owner: "comp", cls: "ct-comp", extra: boltDots(Fv, SU.neck + SU.fl, NS) });
  disc("suc.sfl0", Fv, SU.neck + SU.fl, SU.body[0], NS.fl, { tone: "mid" }, { owner: "strainer", cls: "ct-cast", extra: boltDots(Fv, SU.body[0], NS) });
  disc("suc.body", Fv, SU.body[0], SU.body[1], SU.R, { tone: "mid" }, { owner: "strainer", cls: "ct-cast" });
  // la tapa lateral del filtro, hacia el lector, por donde sale la canasta
  const zc = (SU.body[0] + SU.body[1]) / 2, Fs = { o: [SU.x, 0, zc], a: YD, u: ZD3, v: XD };
  saddle("suc.cover.neck", Fs, 62, (t) => G.saddleStart(SU.R, 62, t), SU.R + 40, { tone: "mid" }, { owner: "strainer", cls: "ct-cast", hosts: [A.disc(Fv, SU.body[0], SU.body[1], SU.R)] });
  disc("suc.cover", FYL(SU.x, zc), SU.R + 40, SU.R + 64, 92, { tone: "mid" }, { owner: "strainer", cls: "ct-cast", extra: Dots(G.dotsOf(FYL(SU.x, zc), SU.R + 64, 78, 8, P, { all: true }), { size: 0.5 }) });
  disc("suc.drain", FZ(SU.x - 40, 72, 0), SU.body[0] - 22, SU.body[0], 9, { tone: "mid" }, { owner: "strainer", cls: "ct-ss" });
  disc("suc.sfl1", Fv, SU.body[1], SU.body[1] + SU.fl, NS.fl, { tone: "mid" }, { owner: "strainer", cls: "ct-cast", extra: boltDots(Fv, SU.body[1] + SU.fl, NS) });
  ANCH.FILTRO_SUC = G.pointOf(Fv, (SU.body[0] + SU.body[1]) / 2 + 40, SU.R, (AZ - 75) * D2R);   // a la derecha, en pantalla
  ANCH.FILTRO_SUC_D = G.pointOf(Fv, SU.body[0] + 40, SU.R, (AZ - 75) * D2R);                      // el mismo, más abajo (el detalle)
  // la válvula de ángulo: la brida de salida abajo, el cuerpo, la boca de entrada hacia −x, el bonete y el volante
  const z0 = SU.body[1] + SU.fl, zv = SU.valve, rv = 112;
  disc("sv.fl0", Fv, z0, z0 + NS.ft, NS.fl, { tone: "mid" }, { owner: "sv", cls: "ct-cast", extra: boltDots(Fv, z0 + NS.ft, NS) });
  const vprof = Array.from({ length: 15 }, (_, i) => { const s = z0 + NS.ft + ((2 * (zv - z0 - NS.ft)) * i) / 14, f = Math.cos(((s - zv) / (zv - z0 - NS.ft)) * (PI / 2)); return [s, 58 + (rv - 58) * Math.max(0, f), i > 0 && i < 14 ? 1 : 0]; });
  turned("sv.body", Fv, vprof, { tone: "mid" }, { owner: "sv", cls: "ct-cast" });
  const zTop = vprof[vprof.length - 1][0];
    const rbAt = (dz) => 58 + (rv - 58) * Math.max(0, Math.cos((dz / (zv - z0 - NS.ft)) * (PI / 2)));
  saddle("sv.inlet", { o: [SU.x, 0, zv], a: [-1, 0, 0], u: YD, v: ZD3 }, 58, (t) => Math.sqrt(Math.max(0, rbAt(58 * Math.sin(t)) ** 2 - (58 * Math.cos(t)) ** 2)) - 1, 175, { tone: "mid" }, { owner: "sv", cls: "ct-cast", hosts: [A.solid(Fv, vprof.map(([s, r]) => [s, r]))] });
  disc("sv.fl1", { o: [SU.x, 0, zv], a: [-1, 0, 0], u: YD, v: ZD3 }, 175, 175 + NS.ft, NS.fl, { tone: "mid" }, { owner: "sv", cls: "ct-cast", extra: boltDots({ o: [SU.x, 0, zv], a: [-1, 0, 0], u: YD, v: ZD3 }, 175 + NS.ft, NS) });
  disc("sv.bonnet", Fv, zTop - 2, zTop + 60, 60, { tone: "mid" }, { owner: "sv", cls: "ct-cast" });
  disc("sv.bfl", Fv, zTop + 60, zTop + 76, 76, { tone: "mid" }, { owner: "sv", cls: "ct-cast", extra: Dots(G.dotsOf(Fv, zTop + 76, 66, 6, P, { all: true }), { size: 0.45 }) });
  disc("sv.yoke", Fv, zTop + 76, zTop + 150, 30, { tone: "mid" }, { owner: "sv", cls: "ct-cast" });
  disc("sv.stem", Fv, zTop + 150, zTop + 178, 9, { tone: "mid" }, { owner: "sv", cls: "ct-ss" });
  handwheel("sv.hw", [SU.x, 0, zTop + 166], ZD3, 120, { owner: "sv", t: 14 });
  ANCH.VALV_SUC = [SU.x + 120 * HV[0], 120 * HV[1], zTop + 166];
  ANCH.VALV_SUC_CUERPO = G.pointOf(Fv, zv, rv, 0.4);
  // la línea de la succión: de la boca de la válvula hacia −x y sube; termina en un par de bridas
  const xs = SU.x - 175 - NS.ft;
  if (!DET) {
    const route = pipe("suc.line", [[xs, 0, zv], [SU.inlet, 0, zv], [SU.inlet, 0, SU.top]], NS.ro, { rad: 140 });
    ANCH.SUCCION_END = lineEnd("suc.end", FZ(SU.inlet, 0, 0), SU.top, NS, "suc.line");
    ANCH.SUCCION = [SU.inlet, 0, SU.top - 200];
  }
}

/* ====================================================================
   7 · la descarga: el cuello de la caja de la descarga y el tubo al separador; la salida del separador, la línea que
   sube, la retención y la válvula de cierre, hacia el condensador
   ==================================================================== */
const DS = CT.dis, NDp = DN[80];
{
  const Fd = FZ(DS.x, 0, 0), zNeck = ZA + CS.zBot + 8;
  // el cuello baja de la caja de la descarga, por delante del bolsillo de la corredera
  disc("dis.neck", Fd, zNeck - 70, zNeck + 2, 45, { tone: "mid" }, { owner: "comp", cls: "ct-comp" });
  const zF = zNeck - 70;
  disc("dis.fl0", Fd, zF - NDp.ft, zF, NDp.fl, { tone: "mid" }, { owner: "comp", cls: "ct-comp" });
  disc("dis.fl1", Fd, zF - 2 * NDp.ft, zF - NDp.ft, NDp.fl, { tone: "mid" }, { owner: "dis.p0", cls: "ct-cast", extra: boltDots(Fd, zF - NDp.ft, NDp) });
  // en el detalle, el tubo que baja al separador sigue hasta salir del círculo
  if (DET) disc("dis.p0", Fd, zF - 2 * NDp.ft - 260, zF - 2 * NDp.ft, NDp.ro, { tone: "mid" }, { owner: "dis.p0", cls: "ct-pipe" });
  // el tubo baja al separador
  const zSepTop = SP.z + SP.R, zN = zSepTop + 40;
  if (!DET) {
    const Fn = { o: [DS.x, 0, SP.z], a: ZD3, u: YD, v: XD };
    saddle("sep.inlet", Fn, NDp.ro + 6, (t) => G.saddleStart(SP.R, NDp.ro + 6, t), SP.R + 40, { tone: "mid" }, { owner: "sep", cls: "ct-vessel", hosts: [sepHost] });
    disc("sep.inletfl", Fd, zN, zN + NDp.ft, NDp.fl, { tone: "mid" }, { owner: "sep", cls: "ct-vessel" });
    disc("dis.fl2", Fd, zN + NDp.ft, zN + 2 * NDp.ft, NDp.fl, { tone: "mid" }, { owner: "dis.p0", cls: "ct-cast", extra: boltDots(Fd, zN + 2 * NDp.ft, NDp) });
    disc("dis.p0", Fd, zN + 2 * NDp.ft, zF - 2 * NDp.ft, NDp.ro, { tone: "mid" }, { owner: "dis.p0", cls: "ct-pipe" });
    ANCH.DESCARGA_SEP = [DS.x, NDp.ro, (zN + zF) / 2];
  }
}
if (!DET) {
  // la salida del separador, arriba, cerca del extremo de +x
  const zSepTop = SP.z + SP.R, zN = zSepTop + 50, Fo = FZ(DS.xOut, 0, 0);
  saddle("sep.outlet", { o: [DS.xOut, 0, SP.z], a: ZD3, u: YD, v: XD }, NDp.ro + 6, (t) => G.saddleStart(SP.R, NDp.ro + 6, t), SP.R + 50, { tone: "mid" }, { owner: "sep", cls: "ct-vessel", hosts: [sepHost] });
  disc("sep.outletfl", Fo, zN, zN + NDp.ft, NDp.fl, { tone: "mid" }, { owner: "sep", cls: "ct-vessel" });
  disc("dout.fl0", Fo, zN + NDp.ft, zN + 2 * NDp.ft, NDp.fl, { tone: "mid" }, { owner: "dout", cls: "ct-cast", extra: boltDots(Fo, zN + 2 * NDp.ft, NDp) });
  // la línea sube y voltea hacia el fondo (−y), donde va la retención y luego la válvula de cierre
  const y1 = -330;
  pipe("dout.p0", [[DS.xOut, 0, zN + 2 * NDp.ft], [DS.xOut, 0, DS.zRun], [DS.xOut, y1 + 1, DS.zRun]], NDp.ro, { rad: 130 });
  const Fr = FYM(DS.xOut, DS.zRun);
  // la retención: un cuerpo bridado de tapa empernada
  disc("dout.cfl0", Fr, -y1, -y1 + NDp.ft, NDp.fl, { tone: "mid" }, { owner: "dout.chk", cls: "ct-cast", extra: boltDots(Fr, -y1, NDp) });
  const cL = 240, cm0 = -y1 + NDp.ft, cm1 = -y1 + cL - NDp.ft;
  turned("dout.chk", Fr, [[cm0, 62], [cm0 + 30, 82, 1], [(cm0 + cm1) / 2, 92, 1], [cm1 - 30, 82, 1], [cm1, 62]], { tone: "mid" }, { owner: "dout.chk", cls: "ct-cast" });
  const cc = [DS.xOut, y1 - cL / 2, DS.zRun];
  disc("dout.chkcap", FZ(cc[0], cc[1], 0), DS.zRun + 85, DS.zRun + 112, 66, { tone: "mid" }, { owner: "dout.chk", cls: "ct-cast", extra: Dots(G.dotsOf(FZ(cc[0], cc[1], 0), DS.zRun + 112, 54, 6, P, { all: true }), { size: 0.45 }) });
  disc("dout.cfl1", Fr, -y1 + cL - NDp.ft, -y1 + cL, NDp.fl, { tone: "mid" }, { owner: "dout.chk", cls: "ct-cast", extra: boltDots(Fr, -y1 + cL, NDp) });
  ANCH.RETENCION = [cc[0], cc[1], DS.zRun + 112];
  // la válvula de cierre de globo, con el volante arriba
  const s2 = -y1 + cL + 2;
  disc("dout.p1", Fr, -y1 + cL, s2, NDp.ro, { tone: "mid" }, { owner: "dout", cls: "ct-pipe" });
  const gv = globeValve("dout.gv", Fr, s2, NDp, { stem: ZD3, owner: "dout.gv", wheel: 1.15 });
  ANCH.VALV_DESC = gv.wheel.map((v, i) => v + [HV[0], HV[1], 0][i] * gv.WR);
  disc("dout.p2", Fr, gv.s1, -DS.yEnd, NDp.ro, { tone: "mid" }, { owner: "dout", cls: "ct-pipe" });
  ANCH.DESCARGA_END = lineEnd("dout.end", Fr, -DS.yEnd, NDp, "dout");
  ANCH.DESCARGA = [DS.xOut, -100, DS.zRun + NDp.ro];
}

/* ====================================================================
   8 · el aceite: la salida del separador a la bomba, la bomba con su motor, la línea al enfriador de termosifón, el
   enfriador con las líneas del amoníaco, la línea al filtro, el filtro y la línea de vuelta al compresor
   ==================================================================== */
const OP = CT.op, OC = CT.oc, OF = CT.of, NO = DN[25], NA = DN[40];
// la boca de un cuello de eje horizontal, a una altura cualquiera, sobre el casco del separador (eje a lo largo de x)
const onSep = (dz, a) => (t) => Math.sqrt(Math.max(0, SP.R * SP.R - (dz + a * Math.cos(t)) ** 2));
// el cuello de la boquilla de inyección de aceite en la carcasa, del lado del macho, bajo la cara del corte
const INJ = { x: 20, z: ZA - 45, y1: 165 };
{
  const dz = INJ.z - ZA, a = NO.ro + 6;
  saddle("comp.inj", { o: [INJ.x, YM, INJ.z], a: YD, u: ZD3, v: XD }, a, (t) => Math.sqrt(Math.max(0, CS.Ro * CS.Ro - (dz + a * Math.cos(t)) ** 2)), INJ.y1 - YM, { tone: "mid" }, { owner: "comp", cls: "ct-comp", hosts: [A.prism(FXL(0, ZA), halfSec(1), RO.x0, RO.x1)] });
  disc("comp.injfl", FYL(INJ.x, INJ.z), INJ.y1, INJ.y1 + NO.ft, NO.fl, { tone: "mid" }, { owner: "comp", cls: "ct-comp", extra: boltDots(FYL(INJ.x, INJ.z), INJ.y1 + NO.ft, NO) });
  ANCH.INYECCION = [INJ.x, INJ.y1 + NO.ft, INJ.z + NO.fl];
  // en el detalle, la brida de la línea del aceite y su tubo, que sigue hasta salir del círculo
  if (DET) {
    disc("oil.j.fl1", FYL(INJ.x, INJ.z), INJ.y1 + NO.ft, INJ.y1 + 2 * NO.ft, NO.fl, { tone: "mid" }, { owner: "oil.j.fl", cls: "ct-cast" });
    disc("oil.j", FYL(INJ.x, INJ.z), INJ.y1 + 2 * NO.ft, INJ.y1 + 2 * NO.ft + 300, NO.ro, { tone: "mid" }, { owner: "oil.j.fl", cls: "ct-pipe" });
  }
}
if (!DET) {
  // la boquilla del aceite en el casco, hacia el lector, y el tramo a la bomba
  const zo = OP.z, dz = zo - SP.z, yS = Math.sqrt(SP.R * SP.R - dz * dz), a = NO.ro + 4;
  const yN = Math.sqrt(SP.R * SP.R - Math.min((dz + NO.fl) ** 2, (dz - NO.fl) ** 2)) + 14;
  saddle("sep.oilout", { o: [OP.x, 0, zo], a: YD, u: ZD3, v: XD }, a, onSep(dz, a), yN, { tone: "mid" }, { owner: "sep", cls: "ct-vessel", hosts: [sepHost] });
  const Fo = FYL(OP.x, zo), y0 = yN;
  disc("sep.oilfl", Fo, y0, y0 + NO.ft, NO.fl, { tone: "mid" }, { owner: "sep", cls: "ct-vessel" });
  disc("oil.s.fl0", Fo, y0 + NO.ft, y0 + 2 * NO.ft, NO.fl, { tone: "mid" }, { owner: "oil.s", cls: "ct-cast", extra: boltDots(Fo, y0 + 2 * NO.ft, NO) });
  // la bomba: el cuerpo con su tapa (hacia +x), la linterna, el motor hacia −x, la base y sus patas
  const Fp = FXL(OP.y, zo), rb = 62, yb = OP.y - rb, ySuc = yb - 34, xh0 = OP.x - 60, xh1 = OP.x + 60;
  disc("oil.s.pipe", Fo, y0 + 2 * NO.ft, ySuc - 2 * NO.ft, NO.ro, { tone: "mid" }, { owner: "oil.s", cls: "ct-pipe" });
  disc("oil.s.fl1", Fo, ySuc - 2 * NO.ft, ySuc - NO.ft, NO.fl, { tone: "mid" }, { owner: "oil.s", cls: "ct-cast", extra: boltDots(Fo, ySuc - 2 * NO.ft, NO) });
  disc("pump.sfl", Fo, ySuc - NO.ft, ySuc, NO.fl, { tone: "mid" }, { owner: "pump", cls: "ct-pump" });
  saddle("pump.snz", { o: [OP.x, OP.y, zo], a: [0, -1, 0], u: ZD3, v: XD }, NO.ro + 6, (t) => G.saddleStart(rb, NO.ro + 6, t) - 0.3, OP.y - ySuc, { tone: "mid" }, { owner: "pump", cls: "ct-pump", hosts: [A.disc(Fp, xh0, xh1, rb)] });
  disc("pump.body", Fp, xh0, xh1, rb, { tone: "mid" }, { owner: "pump", cls: "ct-pump" });
  disc("pump.cover", Fp, xh1, xh1 + 14, rb + 4, { tone: "mid" }, { owner: "pump", cls: "ct-pump", extra: Dots(G.dotsOf(Fp, xh1 + 14, rb - 6, 8, P, { all: true }), { size: 0.45 }) });
  disc("pump.lantern", Fp, xh0 - 50, xh0, 50, { tone: "mid" }, { owner: "pump", cls: "ct-pump" });
  let fins = "";
  for (let q = 0; q < 24; q++) { const t = (q / 24) * TAU, n3 = [0, Math.cos(t), Math.sin(t)]; if (G.dot3(n3, V3) < 0.12) continue; fins += path3([[xh0 - 340, OP.y + 85.4 * Math.cos(t), zo + 85.4 * Math.sin(t)], [xh0 - 50, OP.y + 85.4 * Math.cos(t), zo + 85.4 * Math.sin(t)]]); }
  disc("pump.motor", Fp, xh0 - 340, xh0 - 50, 85, { tone: "mid" }, { owner: "pump", cls: "ct-motor", extra: Ln(fins, { tone: "faint" }) });
  disc("pump.cowl", Fp, xh0 - 380, xh0 - 340, 80, { tone: "mid" }, { owner: "pump", cls: "ct-motor" });
  box("pump.tbox", [xh0 - 230, OP.y - 40, zo + 80], [xh0 - 150, OP.y + 40, zo + 132], { tone: "mid" }, { owner: "pump", cls: "ct-motor", r: 3 });
  box("pump.base", [xh0 - 400, OP.y - 100, ZD], [xh1 + 30, OP.y + 100, ZD + 12], { tone: "mid" }, { owner: "pump", cls: "ct-paint", r: 2, extra: Dots([[xh0 - 385, OP.y - 85], [xh1 + 15, OP.y - 85], [xh0 - 385, OP.y + 85], [xh1 + 15, OP.y + 85]].map(([x, y]) => at([x, y, ZD + 12.3])), { size: 0.5 }) });
  box("pump.foot0", [OP.x - 40, OP.y - 50, ZD + 12], [OP.x + 40, OP.y + 50, zo - rb + 6], { tone: "mid" }, { owner: "pump", cls: "ct-pump", r: 2 });
  [xh0 - 290, xh0 - 130].forEach((xf, i) => box(`pump.mfoot${i}`, [xf - 30, OP.y - 70, ZD + 12], [xf + 30, OP.y + 70, zo - 60], { tone: "mid" }, { owner: "pump", cls: "ct-motor", r: 2 }));
  ANCH.BOMBA = [xh0 - 200, OP.y + 85 * HV[1], zo + 85 * 0.2];
  // la descarga de la bomba, arriba, y la línea al enfriador
  const Fz = FZ(OP.x, OP.y, 0), zp = zo + rb;
  saddle("pump.dnz", { o: [OP.x, OP.y, zo], a: ZD3, u: YD, v: XD }, NO.ro + 6, (t) => G.saddleStart(rb, NO.ro + 6, t) - 0.3, rb + 30, { tone: "mid" }, { owner: "pump", cls: "ct-pump", hosts: [A.disc(Fp, xh0, xh1, rb)] });
  disc("pump.dfl", Fz, zp + 30, zp + 30 + NO.ft, NO.fl, { tone: "mid" }, { owner: "pump", cls: "ct-pump" });
  disc("oil.d.fl0", Fz, zp + 30 + NO.ft, zp + 30 + 2 * NO.ft, NO.fl, { tone: "mid" }, { owner: "oil.d.fl", cls: "ct-cast", extra: boltDots(Fz, zp + 30 + 2 * NO.ft, NO) });
  // el enfriador de aceite de termosifón: el casco, las bridas, los bonetes y el pedestal
  const Fc = FZ(OC.x, OC.y, 0), DC = DN[150];
  const zb0 = OC.z0 - 2 * OC.ft, zbb = zb0 - 72, zt1 = OC.z1 + 2 * OC.ft, ztb = zt1 + 72;
  disc("stand.oc", Fc, ZD, zbb, 70, { tone: "mid" }, { cls: "ct-paint" });
  turned("oc.bot", Fc, [[zbb, 70], [zbb + 30, 110, 1], [zb0, 118]], { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
  disc("oc.flb0", Fc, zb0, zb0 + OC.ft, OC.fl, { tone: "mid" }, { owner: "oc", cls: "ct-cast", extra: boltDots(Fc, zb0 + OC.ft, DC, 8, PI / 8) });
  disc("oc.flb1", Fc, zb0 + OC.ft, OC.z0, OC.fl, { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
  disc("oc.shell", Fc, OC.z0, OC.z1, OC.R, { tone: "mid" }, { owner: "oc", cls: "ct-cast", extra: Ln(G.arcOf(Fc, (OC.z0 + OC.z1) / 2, OC.R + 0.3, P), { tone: "faint" }) });
  disc("oc.flt0", Fc, OC.z1, OC.z1 + OC.ft, OC.fl, { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
  disc("oc.flt1", Fc, OC.z1 + OC.ft, zt1, OC.fl, { tone: "mid" }, { owner: "oc", cls: "ct-cast", extra: boltDots(Fc, zt1, DC, 8, PI / 8) });
  turned("oc.top", Fc, [[zt1, 118], [ztb - 30, 110, 1], [ztb, 70]], { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
  // la placa de datos del enfriador
  ANCH.ENFRIADOR = G.pointOf(Fc, (OC.z0 + OC.z1) / 2 + 80, OC.R, Math.atan2(HV[1], HV[0]));
  // las boquillas del aceite, hacia −x: la entrada arriba (de la bomba) y la salida abajo (al filtro)
  const nzX = OC.x - OC.R - 86, zIn = OC.z1 - 60, zOut = OC.z0 + 120;
  for (const [nm, zn] of [["in", zIn], ["out", zOut]]) {
    const Fn = { o: [OC.x, OC.y, zn], a: [-1, 0, 0], u: YD, v: ZD3 };
    saddle(`oc.n${nm}`, Fn, NO.ro + 4, (t) => Math.sqrt(Math.max(0, OC.R * OC.R - ((NO.ro + 4) * Math.cos(t)) ** 2)), OC.x - nzX - NO.ft, { tone: "mid" }, { owner: "oc", cls: "ct-cast", hosts: [A.disc(Fc, OC.z0, OC.z1, OC.R)] });
    disc(`oc.n${nm}fl`, Fn, OC.x - nzX - NO.ft, OC.x - nzX, NO.fl, { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
    disc(`oil.${nm}.fl`, Fn, OC.x - nzX, OC.x - nzX + NO.ft, NO.fl, { tone: "mid" }, { owner: nm === "in" ? "oil.d.fl" : "oil.out.fl", cls: "ct-cast", extra: boltDots(Fn, OC.x - nzX + NO.ft, NO) });
  }
  const xE = nzX - NO.ft;                                     // la cara de la brida de la línea
  pipe("oil.d", [[OP.x, OP.y, zp + 30 + 2 * NO.ft], [OP.x, OP.y, zIn], [1040, OP.y, zIn], [1040, OC.y, zIn], [xE, OC.y, zIn]], NO.ro, { rad: 40 });
  ANCH.ACEITE_ENFRIADOR = [950, OP.y, zIn + NO.ro];
  // el amoníaco del termosifón: el líquido entra al bonete de abajo y la mezcla sale por arriba
  {
    // la boquilla del líquido sale del bonete de abajo hacia atrás (−y) y la línea sube detrás del enfriador
    const zl = zbb + 36, Fl = { o: [OC.x, OC.y, zl], a: [0, -1, 0], u: XD, v: ZD3 }, xl = 150;
    saddle("oc.nl", Fl, NA.ro + 4, () => 100, xl, { tone: "mid" }, { owner: "oc", cls: "ct-cast", hosts: [A.solid(Fc, [[zbb, 70], [zbb + 30, 110], [zb0, 118]])] });
    disc("oc.nlfl", Fl, xl, xl + NA.ft, NA.fl, { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
    disc("ts.l.fl0", Fl, xl + NA.ft, xl + 2 * NA.ft, NA.fl, { tone: "mid" }, { owner: "ts.l.fl", cls: "ct-cast", extra: boltDots(Fl, xl + 2 * NA.ft, NA) });
    const yr = OC.y - xl - 2 * NA.ft, yv = OC.y - 260, zTop = 1560;
    pipe("ts.l", [[OC.x, yr, zl], [OC.x, yv, zl], [OC.x, yv, zTop]], NA.ro, { rad: 60 });
    ANCH.TS_LIQUIDO_END = lineEnd("ts.l.end", FZ(OC.x, yv, 0), zTop, NA, "ts.l");
    ANCH.TS_LIQUIDO = [OC.x + NA.ro * HV[0], yv + NA.ro * HV[1], 800];
    const Ft = FZ(OC.x, OC.y, 0);
    disc("oc.nt", Ft, ztb - 2, ztb + 50, NA.ro + 4, { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
    disc("oc.ntfl", Ft, ztb + 50, ztb + 50 + NA.ft, NA.fl, { tone: "mid" }, { owner: "oc", cls: "ct-cast" });
    disc("ts.r.fl0", Ft, ztb + 50 + NA.ft, ztb + 50 + 2 * NA.ft, NA.fl, { tone: "mid" }, { owner: "ts.r", cls: "ct-cast", extra: boltDots(Ft, ztb + 50 + 2 * NA.ft, NA) });
    disc("ts.r", Ft, ztb + 50 + 2 * NA.ft, zTop + 80, NA.ro, { tone: "mid" }, { owner: "ts.r", cls: "ct-pipe" });
    ANCH.TS_RETORNO_END = lineEnd("ts.r.end", Ft, zTop + 80, NA, "ts.r");
    ANCH.TS_RETORNO = [OC.x, OC.y, 1450];
  }
  // el filtro del aceite: el vaso sobre su pedestal, la cabeza con la entrada (+x) y la salida (−x) y su manómetro
  const Ff = FZ(OF.x, OF.y, 0), zh0 = OF.z1, zh1 = OF.z1 + 80, zhc = (zh0 + zh1) / 2;
  disc("stand.of", Ff, ZD, OF.z0, 56, { tone: "mid" }, { cls: "ct-paint" });
  turned("of.bowl", Ff, [[OF.z0, 50], [OF.z0 + 40, OF.R, 1], [OF.z1, OF.R]], { tone: "mid" }, { owner: "of", cls: "ct-cast", extra: Ln(G.arcOf(Ff, OF.z1 - 60, OF.R + 0.3, P), { tone: "faint" }) });
  box("of.head", [OF.x - 80, OF.y - 62, zh0], [OF.x + 80, OF.y + 62, zh1], { tone: "mid" }, { owner: "of", cls: "ct-cast", r: 8, extra: Dots([[-62, -46], [62, -46], [-62, 46], [62, 46]].map(([dx, dy]) => at([OF.x + dx, OF.y + dy, zh1 + 0.3])), { size: 0.5 }) });
  const Fi = { o: [0, OF.y, zhc], a: XD, u: YD, v: ZD3 }, Fx = { o: [0, OF.y, zhc], a: [-1, 0, 0], u: [0, -1, 0], v: ZD3 };
  disc("of.inz", Fi, OF.x + 80, OF.x + 104, NO.ro + 6, { tone: "mid" }, { owner: "of", cls: "ct-cast" });
  disc("of.infl", Fi, OF.x + 104, OF.x + 104 + NO.ft, NO.fl, { tone: "mid" }, { owner: "of", cls: "ct-cast" });
  disc("oil.f.fl1", Fi, OF.x + 104 + NO.ft, OF.x + 104 + 2 * NO.ft, NO.fl, { tone: "mid" }, { owner: "oil.out.fl", cls: "ct-cast", extra: boltDots(Fi, OF.x + 104 + 2 * NO.ft, NO) });
  disc("of.outz", Fx, -(OF.x - 80), -(OF.x - 104), NO.ro + 6, { tone: "mid" }, { owner: "of", cls: "ct-cast" });
  disc("of.outfl", Fx, -(OF.x - 104), -(OF.x - 104) + NO.ft, NO.fl, { tone: "mid" }, { owner: "of", cls: "ct-cast" });
  disc("oil.j.fl0", Fx, -(OF.x - 104) + NO.ft, -(OF.x - 104) + 2 * NO.ft, NO.fl, { tone: "mid" }, { owner: "oil.j.fl", cls: "ct-cast", extra: boltDots(Fx, -(OF.x - 104) + 2 * NO.ft, NO) });
  // el manómetro diferencial del filtro, arriba de la cabeza
  disc("of.gstem", FZ(OF.x, OF.y + 20, 0), zh1, zh1 + 40, 7, { tone: "mid" }, { owner: "of", cls: "ct-ss" });
  gauge("of.gauge", [OF.x, OF.y + 20, zh1 + 40 + 44], YD, 44, { owner: "of", t: 30, needle: 0.35 });
  ANCH.FILTRO_ACEITE = G.pointOf(Ff, (OF.z0 + OF.z1) / 2, OF.R, Math.atan2(HV[1], HV[0]) - 0.2);
  // del enfriador al filtro (abajo, por delante del separador) y del filtro al compresor
  const xFi = OF.x + 104 + 2 * NO.ft, xFo = OF.x - 104 - 2 * NO.ft;
  pipe("oil.out", [[xE, OC.y, zOut], [xFi + 160, OC.y, zOut], [xFi + 160, OC.y, zhc], [xFi + 70, OF.y, zhc], [xFi, OF.y, zhc]], NO.ro, { rad: 40 });
  pipe("oil.j", [[xFo, OF.y, zhc], [-520, OF.y, zhc], [-520, OF.y, INJ.z], [INJ.x, OF.y, INJ.z], [INJ.x, INJ.y1 + 2 * NO.ft, INJ.z]], NO.ro, { rad: 40 });
  disc("oil.j.fl1", FYL(INJ.x, INJ.z), INJ.y1 + NO.ft, INJ.y1 + 2 * NO.ft, NO.fl, { tone: "mid" }, { owner: "oil.j.fl", cls: "ct-cast" });
  ANCH.ACEITE_COMPRESOR = [-200, OF.y, INJ.z + NO.ro];
  ANCH.ACEITE_FILTRO = [500, OC.y, zOut + NO.ro];
}

/* ====================================================================
   9 · el visor de nivel del separador (dos llaves y el vidrio con el aceite) y la válvula de seguridad
   ==================================================================== */
const LG = CT.lg;
if (!DET) {
  const yG = LG.y;
  for (const [i, zc] of [[0, LG.z0], [1, LG.z1]]) {
    const dz = zc - SP.z, a = 13, ys = Math.sqrt(SP.R * SP.R - dz * dz);
    saddle(`lg.stub${i}`, { o: [LG.x, 0, zc], a: YD, u: ZD3, v: XD }, a, onSep(dz, a), yG - 22, { tone: "mid" }, { owner: "lg", cls: "ct-ss", hosts: [sepHost] });
    disc(`lg.cock${i}`, FYL(LG.x, zc), yG - 22, yG + 22, 24, { tone: "mid" }, { owner: "lg", cls: "ct-cast" });
    disc(`lg.cockst${i}`, FXL(yG, zc), LG.x + 22, LG.x + 52, 6, { tone: "mid" }, { owner: "lg", cls: "ct-ss" });
  }
  // el cuerpo del visor entre las dos llaves, con el vidrio al frente y el aceite hasta su nivel
  const z0 = LG.z0 + 24, z1 = LG.z1 - 24, w = 22;
  const glass = `<path class="ct-vidrio" d="${pth1([[LG.x - 9, yG + 16.4, z0 + 14], [LG.x + 9, yG + 16.4, z0 + 14], [LG.x + 9, yG + 16.4, z1 - 14], [LG.x - 9, yG + 16.4, z1 - 14]].map(pr))}"/>` +
    `<path class="ct-aceite" d="${pth1([[LG.x - 9, yG + 16.5, z0 + 14], [LG.x + 9, yG + 16.5, z0 + 14], [LG.x + 9, yG + 16.5, LG.oil], [LG.x - 9, yG + 16.5, LG.oil]].map(pr))}"/>` +
    Ln(path3([[LG.x - 9, yG + 16.6, LG.oil], [LG.x + 9, yG + 16.6, LG.oil]]) + path3([[LG.x - 9, yG + 16.4, z0 + 14], [LG.x + 9, yG + 16.4, z0 + 14], [LG.x + 9, yG + 16.4, z1 - 14], [LG.x - 9, yG + 16.4, z1 - 14]], true), { tone: "lo" }) +
    Dots([[-15, z0 + 8], [15, z0 + 8], [-15, z1 - 8], [15, z1 - 8], [-15, (z0 + z1) / 2], [15, (z0 + z1) / 2]].map(([dx, z]) => at([LG.x + dx, yG + 16.4, z])), { size: 0.45 });
  box("lg.body", [LG.x - w, yG - 16, z0], [LG.x + w, yG + 16, z1], { tone: "mid" }, { owner: "lg", cls: "ct-cast", r: 3, extra: glass });
  ANCH.VISOR = [LG.x, yG + 16.4, (LG.oil + z1) / 2];
  // la válvula de seguridad, arriba del separador, con su salida hacia el fondo
  const xv = 520, Fv = FZ(xv, 0, 0), ztop = SP.z + SP.R;
  saddle("psv.neck", { o: [xv, 0, SP.z], a: ZD3, u: YD, v: XD }, NO.ro + 4, (t) => G.saddleStart(SP.R, NO.ro + 4, t), SP.R + 40, { tone: "mid" }, { owner: "sep", cls: "ct-vessel", hosts: [sepHost] });
  disc("psv.fl0", Fv, ztop + 40, ztop + 40 + NO.ft, NO.fl, { tone: "mid" }, { owner: "sep", cls: "ct-vessel" });
  disc("psv.fl1", Fv, ztop + 40 + NO.ft, ztop + 40 + 2 * NO.ft, NO.fl, { tone: "mid" }, { owner: "psv", cls: "ct-psv", extra: boltDots(Fv, ztop + 40 + 2 * NO.ft, NO) });
  const zb = ztop + 40 + 2 * NO.ft;
  turned("psv.body", Fv, [[zb, 34], [zb + 30, 46, 1], [zb + 80, 46, 1], [zb + 110, 30]], { tone: "mid" }, { owner: "psv", cls: "ct-psv" });
  turned("psv.bonnet", Fv, [[zb + 110, 30], [zb + 260, 22], [zb + 300, 18]], { tone: "mid" }, { owner: "psv", cls: "ct-psv" });
  disc("psv.cap", Fv, zb + 300, zb + 340, 20, { tone: "mid" }, { owner: "psv", cls: "ct-psv" });
  const Fo = { o: [xv, 0, zb + 55], a: [0, -1, 0], u: XD, v: ZD3 };
  saddle("psv.out", Fo, 26, () => 40, 110, { tone: "mid" }, { owner: "psv", cls: "ct-psv", hosts: [A.solid(Fv, [[zb, 34], [zb + 30, 46], [zb + 80, 46], [zb + 110, 30]])] });
  disc("psv.outfl", Fo, 110, 110 + NA.ft, NA.fl, { tone: "mid" }, { owner: "psv", cls: "ct-psv", extra: boltDots(Fo, 110 + NA.ft, NA) });
  ANCH.ALIVIO = [xv, 46 * HV[1], zb + 200];
}

/* ====================================================================
   10 · el tablero, en el extremo de +x, de cara al pasillo, con sus manómetros, la pantalla y los botones
   ==================================================================== */
const PN = CT.panel;
if (!DET) {
  const yc = (PN.y0 + PN.y1) / 2;
  box("stand.pnpost", [PN.x0 + 60, yc - 45, CT.pad.h + 10], [PN.x0 + 150, yc + 45, PN.z0], { tone: "mid" }, { cls: "ct-paint", r: 2 });
  box("stand.pnfoot", [PN.x0 + 20, yc - 110, CT.pad.h], [PN.x0 + 190, yc + 110, CT.pad.h + 10], { tone: "mid" }, { cls: "ct-paint", r: 2, extra: Dots([[PN.x0 + 35, yc - 95], [PN.x0 + 175, yc - 95], [PN.x0 + 35, yc + 95], [PN.x0 + 175, yc + 95]].map(([x, y]) => at([x, y, CT.pad.h + 10.3])), { size: 0.5 }) });
  // la caja con su puerta: la costura de la puerta, las bisagras, la pantalla y los botones
  const xf = PN.x1 + 0.3;
  const door = Ln(path3([[xf, PN.y0 + 24, PN.z0 + 24], [xf, PN.y1 - 24, PN.z0 + 24], [xf, PN.y1 - 24, PN.z1 - 24], [xf, PN.y0 + 24, PN.z1 - 24]], true), { tone: "lo" });
  const scr = [[xf + 0.1, PN.y0 + 70, 1450], [xf + 0.1, PN.y1 - 70, 1450], [xf + 0.1, PN.y1 - 70, 1600], [xf + 0.1, PN.y0 + 70, 1600]];
  let rows = ""; for (const z of [1480, 1505, 1530, 1555, 1575]) rows += path3([[xf + 0.2, PN.y0 + 100, z], [xf + 0.2, PN.y0 + 100 + (z % 50 === 5 ? 180 : 250), z]]);
  const screen = `<path class="ct-screen" d="${pth1(scr.map(pr))}"/>` + Ln(rows, { tone: "faint", free: true, className: "ct-pantalla" });
  box("panel", [PN.x0, PN.y0, PN.z0], [PN.x1, PN.y1, PN.z1], { tone: "mid" }, { owner: "panel", cls: "ct-panel", r: 6, steps: 2, bevel: 0.5, extra: door + screen });
  disc("panel.handle", FXL(PN.y0 + 50, 1350), PN.x1, PN.x1 + 26, 10, { tone: "mid" }, { owner: "panel", cls: "ct-ss" });
  [PN.z0 + 70, PN.z1 - 70].forEach((z, i) => disc(`panel.hinge${i}`, FZ(PN.x1 + 6, PN.y1 - 12, 0), z - 30, z + 30, 7, { tone: "mid" }, { owner: "panel", cls: "ct-ss", n: 12 }));
  // los manómetros: succión, descarga, aceite y filtro
  const ys = [PN.y0 + 85, PN.y0 + 190, PN.y0 + 295, PN.y0 + 400];
  ys.forEach((y, i) => gauge(`panel.g${i}`, [PN.x1, y, 1720], XD, 46, { owner: "panel", t: 20, needle: [0.55, 0.7, 0.62, 0.3][i] }));
  // los botones: arranque, parada y la parada de emergencia
  [[PN.y0 + 120, "ct-boton"], [PN.y0 + 200, "ct-boton"], [PN.y0 + 320, "ct-paro"]].forEach(([y, cl], i) => disc(`panel.btn${i}`, FXL(y, 1320), PN.x1, PN.x1 + 22, i === 2 ? 26 : 18, { tone: "mid" }, { owner: "panel", cls: cl }));
  ANCH.TABLERO = [PN.x1, PN.y0 + 30, PN.z1 - 40];
  ANCH.MANOMETROS = [PN.x1 + 20, ys[3], 1720 + 46];
}

/* ====================================================================
   11 · las flechas del amoníaco: la succión que baja y la descarga que sale al condensador
   ==================================================================== */
if (!DET) {
  arrow("flow.suc", [[SU.inlet + 140, 0, SU.top - 40], [SU.inlet + 140, 0, SU.top - 300]]);
  arrow("flow.dis", [[DS.xOut + 150, -560, DS.zRun], [DS.xOut + 150, -880, DS.zRun]]);
  arrow("flow.oil", [[700, OC.y + 40, OC.z0 + 120 + 70], [300, OC.y + 40, OC.z0 + 120 + 70]], { cls: "ct-flujo" });
}

/* ---------- la persona de referencia: 1,75 m, de pie frente al tablero (../persona.mjs) ---------- */
if (!DET) {
  const PS = process.env.CT_PER ? Object.fromEntries(["x", "y", "rumbo"].map((kk, i) => [kk, Number(process.env.CT_PER.split(",")[i])])) : CT.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, 0], rumbo: PS.rumbo, mm: 1, adelante: "izq" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.PECHO;
}
console.log("parcial: items", R_.items.length);
/* ---------- orden y salida ---------- */
if (process.env.CT_ITEM) {
  for (const nm of process.env.CT_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], PA, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
if (DET) {
  const cx = W / 2, cy = H / 2, rr = RDET + 4;
  const inView = (it) => it.shapes.some((sh) => {
    const bd = A.boundsOf(sh); if (!bd) return true;
    const [lo, hi] = Array.isArray(bd) ? bd : [bd.min, bd.max];
    const cs = []; for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) cs.push(k.iso([x / U, y / U, z / U], P));
    const x0 = Math.min(...cs.map((c) => c[0])), x1 = Math.max(...cs.map((c) => c[0])), y0 = Math.min(...cs.map((c) => c[1])), y1 = Math.max(...cs.map((c) => c[1]));
    const qx = Math.max(x0, Math.min(cx, x1)), qy = Math.max(y0, Math.min(cy, y1));   // el punto de la caja más cerca del centro
    return Math.hypot(qx - cx, qy - cy) < rr;
  });
  const keep = R_.items.filter(inView);
  R_.items.splice(0, R_.items.length, ...keep);
}
const t0 = Date.now();
if (!FAST) A.settle(R_, PA, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");
R_.items.sort((a, b) => a.key - b.key);
const shades = (p, f, t, s0, s1, s2, s3) => `--anatomy-paper:${p};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s0};--anatomy-shade-1:${s1};--anatomy-shade-2:${s2};--anatomy-shade-3:${s3}`;
const ACERO = shades("#eef0f2", "#eef0f2", "#f7f8f9", "#c9ced3", "#d6dade", "#e1e4e7", "#eceef0");
const FUND = shades("#dfe2e5", "#dfe2e5", "#e9ebed", "#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0");
const PINT = shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4");
const flat = (c) => shades(c, c, c, c, c, c, c);
// el acero al carbono de la tubería del amoníaco y del aceite, las válvulas y la carcasa del compresor van en el tono
// de la fundición (como las líneas del amoníaco del condensador evaporativo); los rotores, los vástagos, los ejes y el
// acople, en el acero; el separador, la base, los motores, la bomba y el tablero, pintados
const CSS = `.ct-ss{${ACERO}}.ct-rotor{${ACERO}}.ct-wheel{${ACERO}}
.ct-pipe{${FUND}}.ct-cast{${FUND}}.ct-lever{${FUND}}.ct-comp{${FUND}}.ct-psv{${FUND}}.ct-boton{${FUND}}.ct-vessel{${PINT}}
.ct-paint{${PINT}}.ct-motor{${PINT}}.ct-pump{${PINT}}.ct-panel{${PINT}}.ct-paro{${flat("#B3261E")}}
.ct-pantalla.iso-line{stroke:#AEB8C2}
.ct-conc{${shades("#e8e6e1", "#e8e6e1", "#efede9", "#d2cfc8", "#d9d6d0", "#dfddd7", "#e4e2dc")}}
.ct-yel{${shades("#f3e9a6", "#f3e9a6", "#f8f1c4", "#dccf7e", "#e4d88d", "#ebe09a", "#efe5a1")}}
.ct-cut-c{${flat("#c1c6cb")}}
.ct-det-fondo{fill:#FFFFFF;stroke:none}.ct-det-marco{fill:none;stroke:#525C64;stroke-width:1px}
.ct-bore{fill:#525c64;stroke:none}.ct-dial{fill:#ffffff;stroke:none}.ct-screen{fill:#2b3238;stroke:none}
.ct-aceite{fill:#d9a441;fill-opacity:.85}.ct-vidrio{fill:#e7edf2;fill-opacity:.7}
.ct-flujo-o{fill:none;stroke:#525c64;stroke-width:3.4px;stroke-linecap:round;stroke-linejoin:round}
.ct-flujo{fill:none;stroke:#ffffff;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round}
.ct-flujo-p{fill:#ffffff;stroke:#525c64;stroke-width:1px;stroke-linejoin:round}
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
const svg = DET
  ? k.figureSvg({ width: W, height: H, label: "Los rotores del compresor, ampliados", body: [`<style>${CSS}</style><defs><clipPath id="ctDet"><circle cx="${W / 2}" cy="${H / 2}" r="${RDET}"/></clipPath></defs><g class="ct-items" clip-path="url(#ctDet)"><circle class="ct-det-fondo" cx="${W / 2}" cy="${H / 2}" r="${RDET}"/>${groupsSvg.join("")}</g><circle class="ct-det-marco" cx="${W / 2}" cy="${H / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W, height: H, label: "Paquete del compresor de tornillo", body: [`<style>${CSS}</style><g class="ct-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
const base = DET ? "detalle" : "fig";
writeFileSync(join(OUT, `${base}.svg`), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUT, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Compresor de tornillo", theme: "light", width: DET ? 420 : 1000, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", KS.toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUT, `${base}_data.json`), JSON.stringify({ P, W, H, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, {});
