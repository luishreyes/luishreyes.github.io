/* ====================================================================
   Extractor de vapor vivo en isométrico (skill anatomy), para el capítulo 32 del libro de operaciones unitarias
   (Arrastre de vapor): uno de los cuatro extractores de lecho fijo de la batería, V-201.
   Concepto: el vapor vivo llega de la caldera por la línea de la derecha, pasa la válvula todo o nada y entra al pleno,
   bajo la rejilla, por un anillo perforado con los agujeros arriba. Sube por la rejilla (el fondo perforado de la
   canasta) y por el lecho de cáscara desgarrada, la calienta, se carga de aceite y sale por el cuello de cisne de la
   tapa hacia el condensador. El agua que condensa baja al fondo y sale por la purga con su trampa. Sobre el lecho queda
   el espacio para el hinchamiento de la carga. La tapa se abre en cada lote: va con abrazaderas, y la canasta se saca
   entera. Arriba, el manómetro y la válvula de seguridad; en el lecho, tres termopares que siguen el frente del vapor.
   Corte: una ventana que quita lo que mira al lector (y > 0) entre la línea de tangencia del fondo y el borde de arriba
   del aislamiento (zt < z < zw). El fondo queda entero, como una taza; arriba quedan enteros el cuello del cuerpo, las
   bridas, la tapa y las abrazaderas. Por la ventana se ven la pared por dentro, el aislamiento y su chaqueta cortados,
   la canasta cortada con su carga, la rejilla, el anillo distribuidor y el pleno. La carga va escalonada: además de la
   mitad del lector se quita el cuarto de atrás a la derecha (x > 0, y < 0) hasta la rejilla, así se ven la rejilla
   perforada y los termopares; la carga que queda muestra sus dos caras (y = 0 y x = 0) y su techo.
   La figura es solo del libro: lleva la persona de referencia de 1,75 m (../persona.mjs), de pie a la izquierda, junto
   a la trampa de la purga y su embudo.
   Uso: node build.mjs [--audit] [--fast]   (EX_PER="x,y,rumbo" prueba otro lugar para la persona; EX_ITEM="pieza"
   lista lo que se cruza con una pieza en pantalla)
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
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const FAST = process.argv.includes("--fast");
const STEP = Number(process.env.EX_STEP || 0.25);
const EX = GEO.EX, DN = GEO.DN, RO = GEO.RO, RW = GEO.RW, RC = GEO.RC;
const { R, tw, hd, zt, zw } = EX;
const { HB, HW, HC } = GEO.HEADS;
const { ZB, ZP0, ZP, ZL, ZR, ZF0, ZF1, ZG1, ZT0, ZT1, ZLT, ZPOLO, ZCOR } = GEO;
const AZ = EX.AZ, EL = EX.EL;

const W = 640, H = 860;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const pol = (r, deg, z = 0) => [r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z];
const TMINUS = [-Math.sin(AZ * D2R), Math.cos(AZ * D2R), 0];   // hacia la izquierda de la pantalla, en el piso
const TPLUS = G.mul3(TMINUS, -1);                                // hacia la derecha
const radial = (deg) => [Math.cos(deg * D2R), Math.sin(deg * D2R), 0];
const tangent = (deg) => [-Math.sin(deg * D2R), Math.cos(deg * D2R), 0];
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)

/* ---------- lugares que se usan en varias partes ---------- */
const GS = EX.goose, NG = DN[100];
const zGN = ZCOR + GS.up;                        // cara de la brida de la boquilla del cuello de cisne
const gP1 = [0, 0, zGN + NG.ft];                 // arranque del tubo, sobre la brida del tubo
const gCorner = [0, 0, zGN + NG.ft + GS.rise];   // el codo
const gDir = G.unit3(G.add3(TPLUS, [0, 0, -GS.slope]));
const gEnd = G.add3(gCorner, G.mul3(gDir, GS.run));
const STD = EX.ring.deg, NS = DN[50];
const sOut = (s) => G.add3([0, 0, EX.ring.z], G.mul3(radial(STD), s));   // a lo largo de la línea del vapor
const TEZ = EX.te.dz.map((dz) => ZP + dz);

/* ---------- la cámara ---------- */
const EXT = [];
for (let d = 0; d < 360; d += 15) EXT.push(pol(RC, d, zt), pol(RC, d, zw), pol(EX.flange.ro + 40, d, ZF0 - 30), pol(EX.flange.ro + 40, d, ZT1 + 100), pol(RC * 0.7, d, zt - 380));
EX.legs.degs.forEach((d) => { const c = pol(EX.legs.r, d); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => EXT.push([c[0] + a * EX.legs.plate, c[1] + b * EX.legs.plate, 0])); });
EXT.push([0, 0, ZCOR + 20], G.add3(gCorner, [0, 0, 300]), G.add3(gEnd, [0, 0, 200]), G.add3(gEnd, [0, 0, -200]), G.add3(gEnd, G.mul3(gDir, 260)));
EXT.push(sOut(RC + EX.steam.run + 200), G.add3(sOut(RC + EX.steam.run), [0, 0, 260]), G.add3(sOut(RC + 300), [0, 0, 420]));
TEZ.forEach((z) => EXT.push(pol(RC + 300, EX.te.deg, z)));
EXT.push(G.add3([0, 0, EX.purge.zrun], G.mul3(TMINUS, EX.purge.run + 250)), G.add3([0, 0, 0], G.mul3(TMINUS, EX.purge.run + 200)));
EXT.push(pol(EX.psv.r, EX.psv.deg, ZCOR + 520), pol(EX.pi.r, EX.pi.deg, ZCOR + 520));
EXT.push([EX.persona.x, EX.persona.y, 0], [EX.persona.x, EX.persona.y, 1800]);
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso

/* El dibujo va en milímetros; el audit, en centímetros (como el filtro de arena): sus muestras de superficie van cada
   0,6 unidades y un recipiente de casi 2 m en milímetros no cabe en memoria. cm() pasa cada forma registrada a
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
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null, rec = true } = {}) {
  const sh = A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) });
  const shape = rec ? record(sh) : sh;
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra, shapes || [shape]);
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
// un cilindro corto (perno, pasador, tapón, brida): prisma de sección circular, liviano; se registra el cilindro verdadero
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * G.scaleOf(P)) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 140, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, spacing = null, owner = name } = {}) {
  R_.route(name, route.map((q) => q.map((v) => v * U)), r * U, { owner, gaps: gaps.map(([a, b]) => [a * U, b * U]), ends, touch, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(4, Math.min(20, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid.map((v) => v * U), svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [cm(A.tube(part.points, part.radii))] });
  });
}
// un racor o un codo: una esfera con el paso de cada tubo que la cruza o termina en ella
function ball(name, c, Rb, style = {}, { owner, cls = "", bores = [] } = {}) {
  const cut = bores.map((b) => A.tube([G.add3(c, G.mul3(b.dir, -(Rb + 0.6))), G.add3(c, G.mul3(b.dir, Rb + 0.6))], b.r + 0.03, { owner: b.owner }));
  const shape = record(A.ball(c, Rb, { name, owner, ...(cut.length ? { cut } : {}) }));
  put(name, c, wrap(S(G.sphereOf(c, Rb, P), { tone: "mid", ...style }), cls), [shape]);
  return shape;
}
const entry = (Rb, r) => Math.sqrt(Math.max(0, Rb * Rb - r * r)) - 0.02;
function mergeGaps(gs) { const s = gs.filter((g) => g[1] > g[0]).sort((a, b) => a[0] - b[0]), out = []; for (const g of s) { const l = out[out.length - 1]; if (l && g[0] <= l[1]) l[1] = Math.max(l[1], g[1]); else out.push([...g]); } return out; }
/* un tubo: cada esfera en un extremo (at: "start" o "end") recibe el tubo hasta su superficie */
function pipe(name, control, r, { tone = "mid", cls = "", maxLength = 140, balls = [], open = [false, false], gaps = [], owner = name } = {}) {
  const line = control.map((q) => [...q]);
  for (const b of balls) {
    const i = b.at === "start" ? 0 : line.length - 1, j = b.at === "start" ? 1 : line.length - 2, dir = G.unit3(G.sub3(line[j], b.c));
    line[i] = G.add3(b.c, G.mul3(dir, entry(b.R, r)));
  }
  tubeItems(name, line, r, { tone, gaps: mergeGaps(gaps), cls, maxLength, ends: [!open[0], !open[1]], owner });
  return line;
}
// un cilindro (cuello, asiento) de radio a a lo largo de F.a, desde la superficie curva (start(ángulo) = s donde la
// generatriz toca la superficie) hasta la cara plana en s = h. Se registra como disco cortado por sus anfitriones.
function saddle(name, F, a, start, h, style = {}, { owner, cls = "", extra = "", hosts = [], ref = null } = {}) {
  const low = Math.min(...Array.from({ length: 72 }, (_, i) => start((i / 72) * TAU)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, ref ?? G.add3(F.o, G.mul3(F.a, (low + h) / 2)), wrap(body, cls), [record(A.disc(F, low - 0.05, h, a, { name, owner, cut: hosts }))]);
  return { F, face: G.add3(F.o, G.mul3(F.a, h)), low };
}
// dónde toca una generatriz vertical una superficie z = surf(r) (cuellos en la tapa y en el fondo)
const vStart = (F, a, surf) => (t) => { const p = G.pointOf(F, 0, a, t); return G.dot3(G.sub3([p[0], p[1], surf(Math.hypot(p[0], p[1]))], F.o), F.a); };
// dónde sale de un anfitrión una generatriz de un cilindro de radio a a lo largo de F.a: la primera s fuera de él
const startOut = (F, a, inside, s0 = 0, s1 = 200) => (t) => { let lo = s0, hi = s1; if (!inside(G.pointOf(F, lo, a, t))) return lo; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (inside(G.pointOf(F, m, a, t))) lo = m; else hi = m; } return hi; };
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });

/* ---------- superficies con tonos suaves (del filtro de arena) ---------- */
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
function surface(P3, N3, f0, f1, nf, nu, out, keep = null) {
  const cls = (f, u) => { const n = N3(f, u); return G.dot3(n, V3) <= 1e-4 || (keep && !keep(P3(f, u))) ? -1 : BAND(G.dot3(n, L3)); };
  const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
  if (nu === 1) {
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
    return;
  }
  for (let i = 0; i < nf; i++) {
    const fa = fOf(i), fb = fOf(i + 1), fm = (fa + fb) / 2;
    const runs = [];
    for (let j = 0; j < nu; j++) { const band = cls(fm, (j + 0.5) / nu); if (!runs.length || runs[runs.length - 1].band !== band) runs.push({ band, j0: j }); }
    const edge = (f) => {
      const M = nu * 4, smp = []; for (let q = 0; q < M; q++) smp.push(cls(f, (q + 0.5) / M));
      const tr = []; for (let q = 1; q < M; q++) if (smp[q] !== smp[q - 1]) tr.push({ a: smp[q - 1], b: smp[q], q });
      const cuts = [0];
      for (let r = 1; r < runs.length; r++) {
        const j = runs[r].j0, a = runs[r - 1].band, b = runs[r].band; let best = null;
        for (const t of tr) if (t.a === a && t.b === b && (!best || Math.abs(t.q / M - j / nu) < Math.abs(best.q / M - j / nu))) best = t;
        let c = j / nu;
        if (best && Math.abs(best.q / M - j / nu) < 3 / nu) { let lo = (best.q - 0.5) / M, hi = (best.q + 0.5) / M; for (let it = 0; it < 20; it++) { const m = (lo + hi) / 2; if (cls(f, m) === a) lo = m; else hi = m; } c = (lo + hi) / 2; }
        cuts.push(c);
      }
      cuts.push(1); for (let r = 1; r < cuts.length; r++) cuts[r] = Math.max(cuts[r], cuts[r - 1]); return cuts;
    };
    const e0 = edge(fa), e1 = edge(fb);
    const side = (f, ua, ub) => { const pts = [P3(f, ua)]; for (let j = Math.floor(ua * nu) + 1; j / nu < ub - 1e-9; j++) if (j / nu > ua + 1e-9) pts.push(P3(f, j / nu)); pts.push(P3(f, ub)); return pts; };
    runs.forEach((run, r) => {
      if (run.band < 0) return;
      const pts = [...side(fa, e0[r], e0[r + 1]), ...side(fb, e1[r], e1[r + 1]).reverse()];
      const d = pth1(pts.map(pr)); out.by[run.band].push(d); out.fill.push(d);
    });
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
// el contorno visible de una superficie de revolución alrededor de F: para cada s, el ángulo donde n·V = 0
function silhouette(F, s0, s1, rr, dr, f0, f1, n = 80, keep = null) {
  const out = [], cur = [[], []];
  const flush = (j) => { if (cur[j].length > 1) out.push(path3(cur[j])); cur[j] = []; };
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n, r = rr(s);
    const aV = G.dot3(F.a, V3), uV = G.dot3(F.u, V3), vV = G.dot3(F.v, V3), flat = Math.hypot(uV, vV), phi = Math.atan2(vV, uV);
    const c = (dr(s) * aV) / flat;
    [0, 1].forEach((j) => {
      if (r < 1e-6 || Math.abs(c) >= 1) return flush(j);
      let g = j ? phi - Math.acos(c) : phi + Math.acos(c);
      while (g < f0) g += TAU; while (g > f1) g -= TAU;
      if (g < f0 || g > f1) return flush(j);
      const p = G.pointOf(F, s, r, g);
      if (keep && !keep(p)) return flush(j);
      cur[j].push(p);
    });
  }
  flush(0); flush(1);
  return out.join("");
}
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: XD, v: YD });
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD3 };     // el plano del corte: sección (x, z), espesor a lo largo de y
const F0 = FZ();
const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
// una cabeza elíptica: a de a0 a a1 (0 en el ecuador); up = 1 arriba, −1 abajo; sg = 1 normal hacia afuera, −1 hacia adentro
const headP = (rr, hh, zc, up, a0, a1) => (f, u) => { const a = a0 + (a1 - a0) * u, r = rr * Math.cos(a); return [r * Math.cos(f), r * Math.sin(f), zc + up * hh * Math.sin(a)]; };
const headN = (rr, hh, up, sg, a0, a1) => (f, u) => { const a = a0 + (a1 - a0) * u; return G.mul3(G.unit3([Math.cos(a) * hh * Math.cos(f), Math.cos(a) * hh * Math.sin(f), up * Math.sin(a) * rr]), sg); };
const arcPts = (r, z, f0, f1, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t), z]; });
const fS = (AZ - 90) * D2R + TAU;                      // la silueta de la derecha de un cilindro vertical (−30°)
const fSL = fS - PI;                                   // la de la izquierda (150°)
const cutStore = [];        // las caras del corte en y = 0: { owner, poly (x, z), cls }
const DEFS = [];
const circ = (F, s, r, n = 40) => Array.from({ length: n }, (_, i) => G.pointOf(F, s, r, (i / n) * TAU));
const ellPts = (rr, hh, zc, up, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [zc + up * hh * Math.sin(a), rr * Math.cos(a)]; });

/* ====================================================================
   1 · las formas registradas: el cuerpo, el aislamiento, el fondo, la ventana del corte
   ==================================================================== */
const FRONT = A.box([-9000, 0, zt], [9000, 9000, zw]);
const sideFrame = (deg, z) => ({ o: [0, 0, z], a: radial(deg), u: tangent(deg), v: ZD3 });
// las boquillas de la pared no se cortan en la forma registrada: lo que pasa por la pared y el aislamiento no se
// dibuja (los cuellos empiezan en la chaqueta, el brazo del distribuidor en la pared por dentro y los termopozos en la
// canasta)
const HOLES = [];
const SHELL = A.body(F0, [[zt, R], [ZF0, R], [ZF0, RO], [zt, RO]], { name: "shell", owner: "shell", cut: [FRONT, ...HOLES] });
const INS = A.body(F0, [[zt, RO], [zw, RO], [zw, RC], [zt, RC]], { name: "ins", owner: "ins", cut: [FRONT, ...HOLES] });
const FONDO = A.body(F0, [[ZB, 0], ...ellPts(R, hd, zt, -1, PI / 2, 0), [zt, R], [zt, RO], ...ellPts(RO, HB, zt, -1, 0, PI / 2), [zt - HB, 0]], { name: "fondo", owner: "fondo" });
const FONDO_INS = A.body(F0, [[zt - HB, 0], ...ellPts(RO, HB, zt, -1, PI / 2, 0), [zt, RO], [zt, RC], ...ellPts(RC, HC, zt, -1, 0, PI / 2), [zt - HC, 0]], { name: "fondo.ins", owner: "ins" });
// lo que queda adentro de la chaqueta: los cuellos y asientos se cortan con esto, así su forma registrada empieza justo
// en la superficie de la chaqueta, como se dibuja
record({ ...SHELL }); record({ ...INS });
const UNDER_CYL = A.body(F0, [[zt - 80, 0], [zt - 80, RC], [zw - 20, RC], [zw - 20, 0]], { name: "bajo.chaqueta" });
const UNDER_BOT = A.body(F0, [[zt + 5, 0], [zt + 5, RC], ...ellPts(RC, HC, zt, -1, 0, PI / 2)], { name: "bajo.fondo" });
const UNDER_TOP = A.body(F0, [[ZLT - 5, 0], [ZLT - 5, RC], ...ellPts(RC, HC, ZLT, 1, 0, PI / 2)], { name: "bajo.tapa" });
// la ventana del corte: lo que se ve por el plano y = 0, proyectado a lo largo de la mirada
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const WIN = [[-R, zt], [R, zt], [R, zw], [-R, zw]];
const WINP = A.prism(FV, WIN.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]), -90000, 90000);
const WIN_IN = [[-R + 3, zt + 3], [R - 3, zt + 3], [R - 3, zw - 3], [-R + 3, zw - 3]];   // un poco adentro: sin astillas en los bordes
const WINP_IN = A.prism(FV, WIN_IN.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]), -90000, 90000);
const CLIPWIN = A.box([-9000, -9000, -9000], [9000, 9000, 9000], { cut: [WINP_IN] });
const XNEG = A.box([-9000, -9000, -9000], [0, 9000, 9000]);
const XPOS = A.box([0, -9000, -9000], [9000, 9000, 9000]);
DEFS.push(`<clipPath id="exWin"><path d="${pth1(WIN.map(([x, z]) => pr([x, 0, z])))}"/></clipPath>`);
DEFS.push(`<clipPath id="exMouth"><path d="${pth1(arcPts(R, zt, 0, TAU, 120).slice(0, -1).map(pr))}"/></clipPath>`);
// la mitad de atrás de un cilindro vertical vista desde el lector: lo que queda detrás del plano del eje normal a HV
const BACKHALF = A.orientedBox(G.mul3(HV, -9000), [HV, G.unit3(G.cross3(ZD3, HV)), ZD3], [9000, 9000, 9000]);

/* ====================================================================
   2 · la pared por dentro (por la ventana), la franja de la derecha por fuera, el cuello del cuerpo y el fondo
   ==================================================================== */
{
  const svg = toned((o) => surface(cylP(R, zt, zw), cylN(-1), PI, TAU, 120, 1, o), "ex-in");
  // las costuras: la soldadura con el fondo, una circunferencial y una longitudinal
  const vs = 1.5 * PI + 0.35;
  const seams = Ln(path3(arcPts(R - 0.5, 2700, PI, TAU)) + path3([[R * Math.cos(vs), R * Math.sin(vs), zt], [R * Math.cos(vs), R * Math.sin(vs), zw]]), { tone: "faint" });
  const weld = Ln(path3(arcPts(R - 0.5, zt, PI, TAU)), { tone: "lo" });
  // para el orden se registra lo que se ve de ella: el pleno, bajo la rejilla, y la franja junto al corte de la
  // izquierda, que asoma por la rendija entre la canasta y la pared; el resto lo tapa la canasta
  const plen = A.body(F0, [[zt, R], [ZP0, R], [ZP0, RO], [zt, RO]], { name: "shell.in", owner: "shell", cut: [FRONT, CLIPWIN] });
  const strip = A.prism(F0, GEO.sector(R, RO, PI, PI + 20 * D2R, 12), zt, zw, { name: "shell.in", owner: "shell", cut: [CLIPWIN] });
  put("shell.in", [0, -R * 0.7, (zt + zw) / 2], `<g clip-path="url(#exWin)">${svg}${seams}${weld}</g>`, [record(plen), record(strip)]);
}
// las bandas de la chaqueta: cada 700 mm, y las juntas de la lámina cada 1000 mm
const BANDS = [1450, 2150, 2850, 3550];
const LAPS = [2000, 3000];
{
  const svg = toned((o) => surface(cylP(RC, zt, zw), cylN(1), fS, TAU, 40, 1, o), "ex-clad") +
    Ln(path3([[RC * Math.cos(fS), RC * Math.sin(fS), zt], [RC * Math.cos(fS), RC * Math.sin(fS), zw]]), { tone: "mid" }) +
    Ln(LAPS.map((z) => path3(arcPts(RC + 0.3, z, fS, TAU, 16))).join(""), { tone: "faint" });
  // las bandas, en relieve: una tira de 20 mm que se ve como dos líneas
  const bands = Ln(BANDS.map((z) => path3(arcPts(RC + 1.5, z - 10, fS, TAU, 16)) + path3(arcPts(RC + 1.5, z + 10, fS, TAU, 16))).join(""), { tone: "lo" });
  // el remate de arriba de la chaqueta, en el borde de la ventana: el anillo de lámina que cierra la lana
  const cap = flatFace([...arcPts(RC, zw, fS, TAU, 16), ...arcPts(RO, zw, TAU, fS, 16)], ZD3, "ex-clad") + Ln(path3(arcPts(RC, zw, fS, TAU, 16)), { tone: "mid" });
  // se registra solo la franja que se dibuja: de −35° (un poco más allá de la silueta) al corte
  const f0 = fS - TAU - 5 * D2R, nb = [Math.sin(f0), -Math.cos(f0), 0], tb = [Math.cos(f0), Math.sin(f0), 0];
  const BEHIND = A.orientedBox(G.mul3(nb, 2000), [nb, tb, ZD3], [2000, 4000, 9000]);
  put("ins.out", [RC * 0.9, -RC * 0.3, (zt + zw) / 2], svg + bands + cap, [record({ ...INS, name: "ins.out", cut: [FRONT, XNEG, BEHIND, ...HOLES] })]);
}
{
  // el cuello del cuerpo, sin aislamiento, entre el borde de la chaqueta y la brida: entero, la mitad que se ve
  const svg = toned((o) => surface(cylP(RO, zw, ZF0), cylN(1), fS, fS + PI, 120, 1, o), "ex-ss") +
    Ln(path3([[RO * Math.cos(fS), RO * Math.sin(fS), zw], [RO * Math.cos(fS), RO * Math.sin(fS), ZF0]]) + path3([[RO * Math.cos(fSL), RO * Math.sin(fSL), zw], [RO * Math.cos(fSL), RO * Math.sin(fSL), ZF0]]), { tone: "mid" }) +
    Ln(path3(arcPts(RO, zw, 0, fSL, 80)), { tone: "mid" });
  put("neck", [RO * HV[0], RO * HV[1], (zw + ZF0) / 2], svg, [record(A.body(F0, [[zw, R], [ZF0, R], [ZF0, RO], [zw, RO]], { name: "neck", owner: "shell", cut: [BACKHALF] }))]);
}
{
  // el fondo, entero: por dentro (visto por la boca), la chaqueta por fuera, el borde de adelante cortado (la pared, la
  // lana y la chaqueta) y la silueta. Por dentro se ve el agujero de la purga, en el polo.
  const inner = toned((o) => surface(headP(R, hd, zt, -1, 0, PI / 2), headN(R, hd, -1, -1, 0, PI / 2), 0, TAU, 84, 12, o), "ex-in");
  const rp = DN[25].ri;
  const bore = `<path class="ex-bore-dk" d="${pth1(Array.from({ length: 32 }, (_, i) => { const t = (i / 32) * TAU; return pr([rp * Math.cos(t), rp * Math.sin(t), ZB + 0.5]); }))}"/>`;
  const outer = toned((o) => surface(headP(RC, HC, zt, -1, 0, PI / 2), headN(RC, HC, -1, 1, 0, PI / 2), 0, TAU, 84, 12, o), "ex-clad");
  // las juntas de la chaqueta del fondo: pétalos, cada 30°, y el casquete del polo
  const gores = [];
  for (let d = 0; d < 360; d += 30) {
    const pts = []; for (let i = 0; i <= 20; i++) { const a = 0.32 + ((PI / 2 - 0.32) * i) / 20 * 0.78; const r = RC * Math.cos(a); pts.push([r * Math.cos(d * D2R), r * Math.sin(d * D2R), zt - HC * Math.sin(a)]); }
    // solo las que se ven: la cara mira al lector
    const mid = pts[10], n = headN(RC, HC, -1, 1, 0, PI / 2)(d * D2R, 0.5);
    if (G.dot3(n, V3) > 0.05) gores.push(path3(pts));
  }
  const rim = (r0, r1) => [...arcPts(r1, zt, 0, PI, 72), ...arcPts(r0, zt, PI, 0, 72)];
  const rimSvg = (r0, r1, cls) => `<g class="iso-solid ${cls}"><path class="iso-fill" d="${pth1(rim(r0, r1).map(pr))}"/><path class="iso-shade" data-shade="3" d="${pth1(rim(r0, r1).map(pr))}"/></g>`;
  const rims = rimSvg(R, RO, "ex-cut") + rimSvg(RO, RW, "ex-wool-cut") + rimSvg(RW, RC, "ex-cut") +
    Ln(path3(arcPts(RC, zt, 0, PI)) + path3(arcPts(R, zt, 0, PI)), { tone: "mid" }) + Ln(path3(arcPts(RO, zt, 0, PI)) + path3(arcPts(RW, zt, 0, PI)), { tone: "lo" });
  const rr = (z) => RC * Math.sqrt(Math.max(0, 1 - ((zt - z) / HC) ** 2)), dr = (z) => ((RC * RC) * (zt - z)) / (HC ** 2 * Math.max(1e-6, rr(z)));
  const sil = Ln(silhouette(F0, ZPOLO + 0.5, zt, rr, dr, 0, TAU, 140), { tone: "mid" });
  put("fondo", [0, 0, zt - 250], `<g clip-path="url(#exMouth)">${inner}${bore}</g>${outer}${Ln(gores.join(""), { tone: "faint" })}${rims}${sil}`, [record({ ...FONDO }), record({ ...FONDO_INS })]);
}

/* ====================================================================
   3 · las caras del corte de la pared y del aislamiento, en los dos bordes de la ventana
   ==================================================================== */
{
  const strip = (r0, r1) => [[r0, zt], [r1, zt], [r1, zw], [r0, zw]];
  cutStore.push({ owner: "shell", poly: strip(R, RO), cls: "ex-cut" }, { owner: "shell", poly: strip(-RO, -R), cls: "ex-cut" });
  cutStore.push({ owner: "ins", poly: strip(RO, RW), cls: "ex-wool-cut" }, { owner: "ins", poly: strip(-RW, -RO), cls: "ex-wool-cut" });
  cutStore.push({ owner: "ins", poly: strip(RW, RC), cls: "ex-cut" }, { owner: "ins", poly: strip(-RC, -RW), cls: "ex-cut" });
}

/* ====================================================================
   4 · arriba: la brida del cuerpo, la junta, la brida de la tapa, el faldón y la tapa con su aislamiento, enteros
   ==================================================================== */
const FL = EX.flange;
turned("flange.body", F0, [[ZF0, R], [ZF0, FL.ro], [ZF1, FL.ro], [ZF1, R]], { tone: "mid" }, { owner: "shell", cls: "ex-ss" });
turned("lid.gasket", F0, [[ZF1, EX.lidGasket.r0], [ZF1, EX.lidGasket.r1], [ZG1, EX.lidGasket.r1], [ZG1, EX.lidGasket.r0]], { tone: "mid" }, { owner: "lid", cls: "ex-gasket" });
turned("flange.lid", F0, [[ZT0, R], [ZT0, FL.ro], [ZT1, FL.ro], [ZT1, R]], { tone: "mid" }, { owner: "lid", cls: "ex-ss" });
{
  // el faldón de la tapa, de acero a la vista, entre la brida y el borde de la chaqueta
  const svg = toned((o) => surface(cylP(RO, ZT1, ZLT), cylN(1), fS, fS + PI, 120, 1, o), "ex-ss") +
    Ln(path3([[RO * Math.cos(fS), RO * Math.sin(fS), ZT1], [RO * Math.cos(fS), RO * Math.sin(fS), ZLT]]) + path3([[RO * Math.cos(fSL), RO * Math.sin(fSL), ZT1], [RO * Math.cos(fSL), RO * Math.sin(fSL), ZLT]]), { tone: "mid" });
  put("lid.skirt", [RO * HV[0], RO * HV[1], (ZT1 + ZLT) / 2], svg, [record(A.body(F0, [[ZT1, R], [ZLT, R], [ZLT, RO], [ZT1, RO]], { name: "lid.skirt", owner: "lid", cut: [BACKHALF] }))]);
}
// lo que atraviesa la chaqueta de la tapa: el cuello de cisne, el manómetro y la válvula de seguridad
const LIDN = [{ c: [0, 0], r: NG.ro }, { c: pol(EX.pi.r, EX.pi.deg), r: DN[15].ro }, { c: pol(EX.psv.r, EX.psv.deg), r: DN[40].ro }];
const LIDHOLES = [];   // como en la pared: lo que atraviesa la lana no se dibuja
{
  // la tapa: la chaqueta de su aislamiento, con el borde de abajo y las juntas de los pétalos
  const svg = toned((o) => surface(headP(RC, HC, ZLT, 1, 0, PI / 2), headN(RC, HC, 1, 1, 0, PI / 2), 0, TAU, 96, 16, o), "ex-clad");
  const rr = (z) => RC * Math.sqrt(Math.max(0, 1 - ((z - ZLT) / HC) ** 2)), dr = (z) => (-(RC * RC) * (z - ZLT)) / (HC ** 2 * Math.max(1e-6, rr(z)));
  const sil = Ln(silhouette(F0, ZLT, ZCOR - 0.5, rr, dr, 0, TAU, 140), { tone: "mid" });
  const edge = Ln(path3(arcPts(RC, ZLT, fS, fS + PI, 96)), { tone: "mid" });
  const gores = [];
  for (let d = 15; d < 360; d += 30) {
    const pts = []; for (let i = 0; i <= 20; i++) { const a = 0.05 + ((PI / 2 - 0.38) * i) / 20; const r = RC * Math.cos(a); pts.push([r * Math.cos(d * D2R), r * Math.sin(d * D2R), ZLT + HC * Math.sin(a)]); }
    const n = headN(RC, HC, 1, 1, 0, PI / 2)(d * D2R, 0.3);
    if (G.dot3(n, V3) > 0.08) gores.push(path3(pts));
  }
  // el casquete de la corona, donde terminan los pétalos
  const aC = PI / 2 - 0.33, rC = RC * Math.cos(aC), zC = ZLT + HC * Math.sin(aC);
  const crown = Ln(path3(arcPts(rC, zC, 0, TAU, 72)), { tone: "faint" });
  const LIDINS = A.body(F0, [[ZLT, RO], ...ellPts(RO, HB, ZLT, 1, 0, PI / 2), [ZLT + HC, 0], ...ellPts(RC, HC, ZLT, 1, PI / 2, 0)], { name: "lid.dome", owner: "lid", cut: LIDHOLES });
  put("lid.dome", [0, 0, ZLT + HC * 0.6], svg + Ln(gores.join(""), { tone: "faint" }) + crown + edge + sil, [record(LIDINS)]);
  // la tapa de acero, adentro de la lana (no se ve; se registra para los apoyos)
  record(A.body(F0, [[ZLT, R], ...ellPts(R, hd, ZLT, 1, 0, PI / 2), [ZLT + HB, 0], ...ellPts(RO, HB, ZLT, 1, PI / 2, 0)], { name: "lid.head", owner: "lid", cut: LIDHOLES }));
}
{
  // las doce abrazaderas en C: la quijada de abajo bajo la brida del cuerpo, el lomo por fuera de las dos bridas y la
  // quijada de arriba sobre la brida de la tapa, con su tornillo (abajo, la zapata que aprieta la brida; arriba, la
  // manija en T). Cada pieza va aparte, así cada una cae en su lugar del orden de pintura.
  const ro = FL.ro, cw = EX.clamps.w / 2, ri = ro - 35, rs = ro + 10, rb = ro + 36;
  const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  for (let i = 0; i < EX.clamps.n; i++) {
    const deg = EX.clamps.phase + (360 * i) / EX.clamps.n, F = { o: [0, 0, 0], a: tangent(deg), u: radial(deg), v: ZD3 };
    const own = `clamp${i}`, cs = pol(ro - 18, deg), FS = FZ(cs[0], cs[1], 0);
    fp(`clamp${i}.jaw0`, F, rect(ri, rs, ZF0 - 30, ZF0), -cw, cw, { tone: "mid" }, { owner: own, cls: "ex-cast" });
    fp(`clamp${i}.spine`, F, rect(rs, rb, ZF0 - 30, ZT1 + 44), -cw, cw, { tone: "mid" }, { owner: own, cls: "ex-cast" });
    fp(`clamp${i}.jaw1`, F, rect(ri, rs, ZT1 + 16, ZT1 + 44), -cw, cw, { tone: "mid" }, { owner: own, cls: "ex-cast" });
    disc(`clamp${i}.pad`, FS, ZT1, ZT1 + 6, 15, { tone: "mid" }, { owner: own, cls: "ex-ss" });
    disc(`clamp${i}.screw0`, FS, ZT1 + 6, ZT1 + 16, 8, { tone: "mid" }, { owner: own, cls: "ex-ss" });
    disc(`clamp${i}.screw1`, FS, ZT1 + 44, ZT1 + 104, 8, { tone: "mid" }, { owner: own, cls: "ex-ss" });
    fp(`clamp${i}.bar`, { o: [cs[0], cs[1], ZT1 + 104], a: G.unit3(tangent(deg)), u: radial(deg), v: ZD3 }, [[-6, 0], [6, 0], [6, 10], [-6, 10]], -48, 48, { tone: "mid" }, { owner: own, cls: "ex-ss" });
    if (i === 4) ANCH.TAPA = pol(rb, deg, (ZF0 + ZT1) / 2);
  }
}

/* ====================================================================
   5 · adentro: el anillo de apoyo, la junta, la canasta (su fondo es la rejilla, con sus barras), la carga
   ==================================================================== */
const LE = EX.ledge, GK = EX.gasket, PL = EX.plate, BK = EX.basket;
{
  // el anillo de apoyo soldado a la pared: por la ventana se ven su cara de adentro y, en el corte, su sección
  const z0 = ZP0 - GK.t - LE.t, z1 = ZP0 - GK.t;
  const ring = toned((o) => surface(cylP(LE.r0, z0, z1), cylN(-1), PI, TAU, 96, 1, o), "ex-in") + Ln(path3(arcPts(LE.r0, z0, PI, TAU, 96)), { tone: "mid" });
  put("ledge", [0, -LE.r0, z0], `<g clip-path="url(#exWin)">${ring}</g>`, [record(A.prism(F0, GEO.halfRing(LE.r0, R, 48), z0, z1, { name: "ledge", owner: "ledge", cut: [CLIPWIN] }))]);
  cutStore.push({ owner: "ledge", poly: [[LE.r0, z0], [R, z0], [R, z1], [LE.r0, z1]], cls: "ex-cut" }, { owner: "ledge", poly: [[-R, z0], [-LE.r0, z0], [-LE.r0, z1], [-R, z1]], cls: "ex-cut" });
  // la junta de cuerda sobre el anillo, bajo el borde de la rejilla
  record(A.prism(F0, GEO.halfRing(GK.r0, GK.r1, 48), z1, ZP0, { name: "gasket", owner: "ledge" }));
  cutStore.push({ owner: "gasket", poly: [[GK.r0, z1], [GK.r1, z1], [GK.r1, ZP0], [GK.r0, ZP0]], cls: "ex-gasket-cut" }, { owner: "gasket", poly: [[-GK.r1, z1], [-GK.r0, z1], [-GK.r0, ZP0], [-GK.r1, ZP0]], cls: "ex-gasket-cut" });
}
const PLATE_SH = record(A.prism(F0, GEO.halfRing(0, PL.r, 48), ZP0, ZP, { name: "plate", owner: "basket" }));
{
  // la rejilla: en el cuarto sin carga (x > 0, y < 0) se ve su cara de arriba con los agujeros; en el corte, su sección
  const top = GEO.sector(0, BK.ri, -PI / 2, 0, 32).map(([x, y]) => [x, y, ZP]);
  const holes = GEO.plateHoles().map(([x, y]) => pth1(Array.from({ length: 10 }, (_, i) => { const t = (i / 10) * TAU; return pr([x + (PL.hole / 2) * Math.cos(t), y + (PL.hole / 2) * Math.sin(t), ZP + 0.3]); }))).join("");
  const svg = flatFace(top, ZD3, "ex-ss") + `<path class="ex-hole" d="${holes}"/>`;
  put("plate.top", [BK.ri * 0.45, -BK.ri * 0.45, ZP], svg, [A.prism(F0, GEO.sector(0, BK.ri, -PI / 2, 0, 16), ZP0, ZP)]);
  cutStore.push({ owner: "basket", poly: [[-PL.r, ZP0], [PL.r, ZP0], [PL.r, ZP], [-PL.r, ZP]], cls: "ex-cut" });
  // las barras bajo la rejilla, de frente a fondo: en el corte, su sección; detrás, la cara que mira a la derecha
  PL.bars.forEach((x, i) => {
    const L = Math.sqrt(PL.barR * PL.barR - x * x), Fb = { o: [x, 0, 0], a: YD, u: XD, v: ZD3 };
    const poly = [[-PL.barT / 2, ZP0 - PL.barH], [PL.barT / 2, ZP0 - PL.barH], [PL.barT / 2, ZP0], [-PL.barT / 2, ZP0]];
    fp(`bar${i}`, Fb, poly, -L, -0.3, { tone: "mid" }, { owner: "basket", cls: "ex-ss", cap: "none" });
    cutStore.push({ owner: "basket", poly: poly.map(([u, z]) => [x + u, z]), cls: "ex-cut" });
  });
}
{
  // la pared de la canasta: por la ventana se ve su cara de adentro (la mitad de atrás) con los agujeros de los
  // termopares, y su sección en el corte, con el anillo de refuerzo del borde
  // en dos piezas: la franja junto al corte de la derecha (de −14° a 0°) queda delante de la punta de afuera de los
  // termopozos, y el resto, detrás de ellos
  const fA = TAU - 14 * D2R;
  const svg = toned((o) => surface(cylP(BK.ri, ZP, ZR), cylN(-1), PI, fA, 112, 1, o), "ex-in");
  const svgA = toned((o) => surface(cylP(BK.ri, ZP, ZR), cylN(-1), fA, TAU, 8, 1, o), "ex-in");
  const seam = Ln(path3(arcPts(BK.ri - 0.5, ZP + 1, -PI / 2, 0, 32)), { tone: "lo" });
  const rimIn = BK.ri - BK.rim[0];
  const rim = toned((o) => surface(cylP(rimIn, ZR - BK.rim[1], ZR), cylN(-1), PI, TAU, 96, 1, o), "ex-in");
  const WELLS = TEZ.map((z) => A.disc(sideFrame(EX.te.deg, z), BK.ri - 50, BK.ro + 50, EX.te.r - 3));
  put("basket.wall", [0, -BK.ri * 0.8, (ZP + ZR) / 2], `<g clip-path="url(#exWin)">${svg}${seam}${rim}</g>`, [record(A.prism(F0, GEO.sector(BK.ri, BK.ro, PI, fA, 48), ZP, ZR, { name: "basket.wall", owner: "basket", cut: [CLIPWIN] }))]);
  put("basket.wallA", [BK.ri * 0.99, -BK.ri * 0.1, (ZP + ZR) / 2], `<g clip-path="url(#exWin)">${svgA}</g>`, [record(A.prism(F0, GEO.sector(BK.ri, BK.ro, fA, TAU, 8), ZP, ZR, { name: "basket.wallA", owner: "basket", cut: [CLIPWIN, ...WELLS] }))]);
  record(A.prism(F0, GEO.halfRing(rimIn, BK.ri, 48), ZR - BK.rim[1], ZR, { name: "basket.rim", owner: "basket" }));
  // la pared entera, para los apoyos: la punta de afuera de los termopozos queda detrás del corte de la derecha
  record(A.prism(F0, GEO.halfRing(BK.ri, BK.ro, 48), ZP, ZR, { name: "basket.shell", owner: "basket", cut: WELLS }));
  const wall = (s) => [[s * BK.ri, ZP], [s * BK.ro, ZP], [s * BK.ro, ZR], [s * rimIn, ZR], [s * rimIn, ZR - BK.rim[1]], [s * BK.ri, ZR - BK.rim[1]]];
  cutStore.push({ owner: "basket", poly: wall(1), cls: "ex-cut" }, { owner: "basket", poly: wall(-1).reverse(), cls: "ex-cut" });
}

/* ====================================================================
   6 · la carga: la cáscara desgarrada en el cuarto de atrás a la izquierda (x < 0, y < 0), de la rejilla al techo del
   lecho. Se ven la cara del corte (y = 0), la del escalón (x = 0) y el techo. Los trozos van en patrones dibujados en
   el plano de cada cara, unas cinco veces más grandes que los reales para que se vean: el flavedo naranja, algunas
   caras blancas del albedo y los huecos oscuros entre ellos (la porosidad es de la mitad).
   ==================================================================== */
let seed = 11;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const f2 = (v) => (Math.round(v * 10) / 10).toString();
// un trozo: polígono de m lados alrededor de (u, v), radio r, en coordenadas de la cara; achatado en una dirección
const chip = (u, v, r, m, flat = 0.6) => { const a0 = rnd() * TAU, rot = rnd() * PI, pts = []; for (let j = 0; j < m; j++) { const a = a0 + (j / m) * TAU + (rnd() - 0.5) * 0.8, q = r * (0.7 + rnd() * 0.45); const x = q * Math.cos(a), y = q * Math.sin(a) * flat; pts.push([u + x * Math.cos(rot) - y * Math.sin(rot), v + x * Math.sin(rot) + y * Math.cos(rot)]); } return pts; };
const gpath = (pts) => pts.map(([u, v], i) => (i ? "L" : "M") + f2(u) + " " + f2(v)).join("") + "Z";
// un mosaico que se repite sin costura: cada trozo que cruza un borde se dibuja también del otro lado
function tile(id, T, groups) {
  let body = "";
  for (const { cls, n, r0, r1, m, flat } of groups) {
    let d = "";
    for (let i = 0; i < n; i++) {
      const u = rnd() * T, v = rnd() * T, r = r0 + rnd() * (r1 - r0), pts = chip(u, v, r, m, flat);
      for (const du of [-T, 0, T]) for (const dv of [-T, 0, T]) {
        if ((du && (u + du < -r1 || u + du > T + r1)) || (dv && (v + dv < -r1 || v + dv > T + r1))) continue;
        d += gpath(pts.map(([a, b]) => [a + du, b + dv]));
      }
    }
    body += `<path class="${cls}" d="${d}"/>`;
  }
  DEFS.push(`<pattern id="${id}" patternUnits="userSpaceOnUse" width="${T}" height="${T}">${body}</pattern>`);
}
tile("exPeelA", 300, [{ cls: "ex-pz-f", n: 30, r0: 16, r1: 27, m: 6, flat: 0.55 }, { cls: "ex-pz-l", n: 12, r0: 10, r1: 18, m: 5, flat: 0.6 }, { cls: "ex-pz-a", n: 9, r0: 9, r1: 16, m: 5, flat: 0.55 }]);
tile("exPeelB", 230, [{ cls: "ex-pz-d", n: 26, r0: 4, r1: 8, m: 4, flat: 0.7 }]);
// el patrón en el plano de una cara: la cara (u, v) → pantalla es afín
function facePattern(id, base, to3) {
  const O = pr(to3(0, 0)), U1 = pr(to3(1, 0)), V1 = pr(to3(0, 1));
  DEFS.push(`<pattern id="${id}" href="#${base}" patternTransform="matrix(${[U1[0] - O[0], U1[1] - O[1], V1[0] - O[0], V1[1] - O[1], O[0], O[1]].map((v) => +v.toFixed(5)).join(" ")})"/>`);
  return id;
}
const CARGA = { y0: (u, v) => [u, 0, v], x0: (u, v) => [0, u, v], top: (u, v) => [u, v, ZL] };
for (const [face, to3] of Object.entries(CARGA)) { facePattern(`exPeelA-${face}`, "exPeelA", to3); facePattern(`exPeelB-${face}`, "exPeelB", to3); }
{
  const ri = BK.ri, side = [[-ri, ZP], [0, ZP], [0, ZL], [-ri, ZL]];
  const topPoly = GEO.quarter(ri, 48);
  const fillWith = (poly, to3, cls, pats, over) => { const d = pth1(poly.map(([u, v]) => pr(to3(u, v)))); return `<path class="${cls}" d="${d}"/>` + pats.map((p) => `<path fill="url(#${p})" d="${d}"/>`).join("") + (over ? `<path class="${over}" d="${d}"/>` : ""); };
  let svg = "";
  svg += fillWith(side, CARGA.x0, "ex-pz-bg", ["exPeelA-x0", "exPeelB-x0"], "ex-pz-side");
  svg += fillWith(side, CARGA.y0, "ex-pz-bg", ["exPeelA-y0", "exPeelB-y0"], null);
  svg += fillWith(topPoly, CARGA.top, "ex-pz-bgt", ["exPeelA-top", "exPeelB-top"], "ex-pz-top");
  // unos trozos sueltos sobre el techo, que asoman del borde: el techo no es una mesa
  let loose = "";
  for (let i = 0; i < 26; i++) {
    const rr = ri * Math.sqrt(0.05 + rnd() * 0.9), aa = PI + rnd() * (PI / 2), u = rr * Math.cos(aa), v = rr * Math.sin(aa);
    loose += pth1(chip(u, v, 15 + rnd() * 10, 6, 0.5).map(([a, b]) => pr([a, b, ZL + 0.5])));
  }
  svg += `<path class="ex-pz-f ex-pz-loose" d="${loose}"/>`;
  svg += Ln(path3([[-ri, 0, ZL], [0, 0, ZL], [0, -ri, ZL]]) + path3([[0, 0, ZP], [0, 0, ZL]]) + path3([[0, 0, ZP], [0, -ri, ZP]]), { tone: "mid" }) +
    Ln(path3([[0, -ri, ZP], [0, -ri, ZL]]) + path3(arcPts(ri - 0.5, ZL, PI, 1.5 * PI, 48)), { tone: "lo" });
  put("carga", [-ri * 0.35, -ri * 0.35, (ZP + ZL) / 2], `<g class="ex-carga">${svg}</g>`, [record(A.prism(F0, GEO.quarter(ri, 24), ZP, ZL, { name: "carga", owner: "carga" }))]);
}

/* ====================================================================
   7 · el distribuidor: el anillo de 2 in con sus agujeros arriba (la mitad de atrás; la de adelante se fue con el
   corte, y en el plano del corte se ven sus dos secciones), la te, el brazo que llega de la boquilla y las ménsulas
   ==================================================================== */
const RG = EX.ring, rgO = NS.ro;
{
  const tee = pol(RG.r, STD, RG.z), Rt = rgO * 1.55;   // la te: una esfera donde las bocas de los tres tubos no se tocan
  const span = (a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => pol(RG.r, a0 + ((a1 - a0) * i) / n, RG.z));
  const dT = (2 * Math.asin(entry(Rt, rgO) / (2 * RG.r))) / D2R;   // el anillo entra a la te hasta su superficie
  const own = "ring";
  ball("ring.tee", tee, Rt, { tone: "mid" }, { owner: "ring.tee", cls: "ex-ss" });
  tubeItems("ring.a", span(180, 360 + STD - dT, 48), rgO, { cls: "ex-ss", ends: [false, true], owner: own, maxLength: 220, caps: [false, true] });
  tubeItems("ring.b", span(360 + STD + dT, 360, 12), rgO, { cls: "ex-ss", ends: [true, false], owner: own, maxLength: 220, caps: [true, false] });
  // los agujeros de 1/8 in arriba del anillo (dibujados más grandes), en la mitad que queda
  const hp = [];
  // (los de junto a la te no se dibujan: la te los tapa)
  for (let i = 0; i < RG.holes; i++) { const d = (360 * i) / RG.holes + 6; const dd = ((d % 360) + 360) % 360; if (dd > 183 && dd < 328) hp.push(at(pol(RG.r, dd, RG.z + rgO))); }
  put("ring.holes", pol(RG.r, 270, RG.z + rgO), Dots(hp, { size: 0.55, tone: "lo" }), [A.prism(F0, GEO.sector(RG.r - rgO, RG.r + rgO, 182 * D2R, 330 * D2R, 40), RG.z + rgO - 2, RG.z + rgO + 0.5)]);
  // el brazo que llega de la boquilla, por la pared, hasta la te
  pipe("ring.feed", [pol(R, STD, RG.z), tee], rgO, { cls: "ex-ss", balls: [{ at: "end", c: tee, R: Rt }], owner: own });
  // las ménsulas: pletinas radiales soldadas a la pared, con el anillo apoyado encima
  for (const [i, deg] of RG.brackets.entries()) {
    const [bh, bt] = RG.bar, zTop = RG.z - rgO;
    fp(`ring.bracket${i}`, { o: [0, 0, 0], a: tangent(deg), u: radial(deg), v: ZD3 }, [[RG.r - 40, zTop - bh], [R, zTop - bh], [R, zTop], [RG.r - 40, zTop]], -bt / 2, bt / 2, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  }
  // las dos secciones del anillo en el plano del corte
  for (const s of [-1, 1]) {
    const c = [s * RG.r, RG.z];
    const ringPoly = (r) => Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * TAU; return [c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]; });
    cutStore.push({ owner: own, poly: ringPoly(rgO), cls: "ex-cut", hole: ringPoly(NS.ri) });
  }
  ANCH.DISTRIBUIDOR = [RG.r + (NS.ri + rgO) / 2, 0, RG.z];   // en la sección del anillo, en el plano del corte
}

/* ====================================================================
   8 · piezas que se repiten: válvulas, manómetros y la cabeza de un termopar
   ==================================================================== */
// válvula de bola bridada: F.a es el sentido del flujo y la cara de entrada está en s0; con palanca o con actuador
function ballValve(name, F, s0, d, { open = false, stem = null, actuator = false, owner = name } = {}) {
  const Lv = d.ro > 25 ? 216 : 165, ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, { tone: "mid" }, { owner, cls: "ex-cast" });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, { tone: "mid" }, { owner, cls: "ex-cast" });
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, { tone: "mid" }, { owner, cls: "ex-cast" });
  const st = stem || ZD3;
  const c = G.add3(F.o, G.mul3(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - 16 * 16) - 2, r1 + 30, 16, { tone: "mid" }, { owner, cls: "ex-cast" });
  if (!actuator) {
    disc(`${name}.stem`, FS, r1 + 30, r1 + 42, 7, { tone: "mid" }, { owner, cls: "ex-ss" });
    const lv = open ? F.a : G.unit3(G.cross3(st, F.a)), FL2 = { o: G.add3(c, G.mul3(st, r1 + 42)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
    fp(`${name}.lever`, FL2, [[0, -10], [6, -10], [6, 10], [0, 10]], -16, 170, { tone: "mid" }, { owner, cls: "ex-lever" });
    return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, r1 };
  }
  // el actuador neumático de piñón y cremallera: la consola, el acople, la caja con sus dos tapas y el indicador
  const b0 = r1 + 30, b1 = b0 + 56;
  fp(`${name}.bracket`, FS, [[-34, -26], [34, -26], [34, 26], [-34, 26]], b0, b0 + 8, { tone: "mid" }, { owner, cls: "ex-ss" });
  disc(`${name}.coupling`, FS, b0 + 8, b1 - 8, 12, { tone: "mid" }, { owner, cls: "ex-ss" });
  fp(`${name}.bracket2`, FS, [[-34, -26], [34, -26], [34, 26], [-34, 26]], b1 - 8, b1, { tone: "mid" }, { owner, cls: "ex-ss" });
  // la caja, atravesada al tubo, con las tapas de los resortes en los dos extremos
  const ua = G.unit3(G.cross3(st, F.a)), FA2 = { o: G.add3(c, G.mul3(st, b1 + 48)), a: ua, u: F.a, v: st };
  const half2 = 118, bx = [[-46, -48], [46, -48], [46, 48], [-46, 48]];
  fp(`${name}.act`, FA2, bx, -half2, half2, { tone: "mid" }, { owner, cls: "ex-act" });
  fp(`${name}.capL`, FA2, [[-50, -52], [50, -52], [50, 52], [-50, 52]], -half2 - 22, -half2, { tone: "mid" }, { owner, cls: "ex-act" });
  fp(`${name}.capR`, FA2, [[-50, -52], [50, -52], [50, 52], [-50, 52]], half2, half2 + 22, { tone: "mid" }, { owner, cls: "ex-act" });
  // el indicador de posición encima (un domo amarillo con la flecha) y la electroválvula al costado
  const FI = { o: G.add3(c, G.mul3(st, b1 + 96)), a: st, u: ua, v: F.a };
  disc(`${name}.ind`, FI, 0, 16, 26, { tone: "mid" }, { owner, cls: "ex-ind" });
  const FSV = { o: G.add3(FA2.o, G.mul3(F.a, -46)), a: G.mul3(F.a, -1), u: ua, v: st };
  fp(`${name}.sol`, FSV, [[-20, -24], [20, -24], [20, 24], [-20, 24]], 0, 40, { tone: "mid" }, { owner, cls: "ex-act" });
  return { end: G.add3(F.o, G.mul3(F.a, s1)), body: c, r1, act: FA2.o, top: G.add3(FI.o, G.mul3(st, 16)) };
}
// la caja de un manómetro o de un termómetro de carátula: la carátula mira hacia el eje FG.a; marcas en una escala de
// 270° con la aguja en v (de 0 a vmax)
function dialCase(name, ctr, Rg, depth, v, vmax, owner, { major = 4, ticks = 24 } = {}) {
  const ux = G.unit3(G.cross3(ZD3, HV)), FG = { o: ctr, a: HV, u: ux, v: ZD3 };
  const ring = (r, s) => pth1(Array.from({ length: 48 }, (_, i) => pr(G.pointOf(FG, s, r, (i / 48) * TAU))));
  const s1 = depth / 2, a0 = 225 * D2R, a1 = -45 * D2R, ang = (q) => a0 + (a1 - a0) * (q / vmax), rd = Rg * 0.84;
  let tk = "";
  for (let i = 0; i <= ticks; i++) { const q = (vmax * i) / ticks, a = ang(q), r0 = i % major === 0 ? rd * 0.78 : rd * 0.89; tk += path3([G.pointOf(FG, s1 + 0.2, r0, a), G.pointOf(FG, s1 + 0.2, rd, a)]); }
  const dial = `<path class="ex-dial" d="${ring(rd, s1 + 0.1)}"/>` + Ln(ring(rd, s1 + 0.2), { tone: "mid" }) + Ln(tk, { tone: "lo" }) +
    Ln(path3([G.pointOf(FG, s1 + 0.3, rd * 0.08, ang(v) + PI), G.pointOf(FG, s1 + 0.3, rd * 0.74, ang(v))]), { tone: "hi", free: "end" }) + Dots([at(G.pointOf(FG, s1 + 0.4, 0, 0))], { size: 0.9 });
  disc(`${name}.case`, FG, -s1, s1, Rg, { tone: "mid" }, { owner, cls: "ex-gauge", extra: dial });
  return { FG, face: G.pointOf(FG, s1, Rg * 0.5, 120 * D2R), back: G.pointOf(FG, -s1, 0, 0) };
}

/* ====================================================================
   9 · la tapa: el cuello de cisne de 4 in en el centro, con su termómetro y la junta que se suelta para abrir la tapa
   ==================================================================== */
{
  const own = "goose";
  const F = FZ(0, 0, ZCOR - 2);
  const nk = saddle("goose.neck", F, NG.ro, vStart(F, NG.ro, GEO.zClTop), zGN - NG.ft - F.o[2], { tone: "mid" }, { owner: own, cls: "ex-ss", hosts: [UNDER_TOP] });
  disc("goose.fl0", F0, zGN - NG.ft, zGN, NG.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  disc("goose.fl1", F0, zGN, zGN + NG.ft, NG.fl, { tone: "mid" }, { owner: own, cls: "ex-ss", extra: Dots(G.dotsOf(F0, zGN + NG.ft, NG.bc, NG.nb, P, { all: true }), { size: 0.55 }) });
  // el tubo: sube, dobla con un radio largo y baja con pendiente hacia el condensador; una junta de bridas cerca del
  // codo (se suelta para abrir la tapa) y el par de bridas del final, donde sigue la línea al condensador
  // dos tramos: del arranque a la junta (con el codo) y de la junta al final
  const jC = G.add3(gCorner, G.mul3(gDir, GS.joint));
  const route = G.fillet([gP1, gCorner, G.add3(jC, G.mul3(gDir, -NG.ft))], GS.bend, 12, { P, tube: NG.ro });
  tubeItems("goose.pipe", route, NG.ro, { cls: "ex-ss", maxLength: 160 });
  tubeItems("goose.run", [G.add3(jC, G.mul3(gDir, NG.ft)), gEnd], NG.ro, { cls: "ex-ss", maxLength: 160 });
  const FJ = G.frameAlong(jC, gDir);
  disc("goose.j0", FJ, -NG.ft, 0, NG.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  disc("goose.j1", FJ, 0, NG.ft, NG.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  // el final: la brida del cuello, la de la línea que sigue, un tramo corto y su brida
  const FE = G.frameAlong(gEnd, gDir);
  disc("goose.e0", FE, 0, NG.ft, NG.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  disc("goose.e1", FE, NG.ft, 2 * NG.ft, NG.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  pipe("goose.stub", [G.add3(FE.o, G.mul3(gDir, 2 * NG.ft)), G.add3(FE.o, G.mul3(gDir, 2 * NG.ft + 110))], NG.ro, { cls: "ex-ss" });
  disc("goose.e2", FE, 2 * NG.ft + 110, 3 * NG.ft + 110, NG.fl, { tone: "mid" }, { owner: "goose.line", cls: "ex-ss" });
  ANCH.CUELLO = G.add3(gCorner, G.add3(G.mul3(gDir, 700), [0, 0, NG.ro * 0.6]));
  ANCH.GOOSE_END = G.add3(FE.o, G.mul3(gDir, 3 * NG.ft + 110));
  // el termómetro de la salida, en el tramo que sube: asiento, termopozo y la carátula mirando al lector
  const zT = zGN + NG.ft + GS.ti, FB = { o: [0, 0, zT], a: HV, u: G.unit3(G.cross3(ZD3, HV)), v: ZD3 };
  const host = A.disc(F0, zGN, zGN + 600, NG.ro, { owner: "goose.pipe" });
  saddle("ti.boss", FB, 16, (t) => G.saddleStart(NG.ro, 16, t), NG.ro + 22, { tone: "mid" }, { owner: "goose.pipe", cls: "ex-ss", hosts: [host] });
  fp("ti.hex", FB, HEX(15, 0), NG.ro + 22, NG.ro + 36, { tone: "mid" }, { owner: "goose.pipe", cls: "ex-ss" });
  disc("ti.stem", FB, NG.ro + 36, NG.ro + 70, 7, { tone: "mid" }, { owner: "goose.pipe", cls: "ex-ss" });
  const dc = dialCase("ti", G.pointOf(FB, NG.ro + 70 + 16, 0, 0), 52, 32, 91.2, 150, "goose.pipe", { major: 5, ticks: 30 });
  ANCH.TERMOMETRO = dc.face;
}

/* ====================================================================
   10 · en la tapa: el manómetro con su sifón y la válvula de seguridad con su descarga
   ==================================================================== */
{
  // el manómetro: cuello de ½ in, llave de aguja, sifón en U y la caja con la carátula mirando al lector (0 a 1 bar; la
  // tapa trabaja a la presión del lugar, así que marca casi cero)
  const own = "pi", d = DN[15], c = pol(EX.pi.r, EX.pi.deg), F = FZ(c[0], c[1], GEO.zClTop(EX.pi.r) - 2);
  const nk = saddle("pi.neck", F, d.ro, vStart(F, d.ro, GEO.zClTop), 70, { tone: "mid" }, { owner: own, cls: "ex-ss", hosts: [UNDER_TOP] });
  const z1 = nk.face[2], FF = FZ(c[0], c[1], 0);
  fp("pi.valve", FF, HEX(17, 0), z1, z1 + 46, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  // la manija de la llave, hacia el lector
  const FH = { o: [c[0], c[1], z1 + 23], a: HV, u: G.unit3(G.cross3(ZD3, HV)), v: ZD3 };
  disc("pi.spindle", FH, 14, 40, 5, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  disc("pi.wheel", FH, 40, 47, 18, { tone: "mid" }, { owner: own, cls: "ex-lever" });
  // el sifón en U, en un plano que mira al lector: sube, baja y vuelve a subir
  const tp = G.unit3(G.cross3(ZD3, HV)), b = [c[0], c[1], z1 + 46];
  const sp = [b, G.add3(b, [0, 0, 70]), G.add3(G.add3(b, [0, 0, 70]), G.mul3(tp, 56)), G.add3(G.add3(b, [0, 0, -10]), G.mul3(tp, 56)), G.add3(G.add3(b, [0, 0, -10]), G.mul3(tp, 112)), G.add3(G.add3(b, [0, 0, 150]), G.mul3(tp, 112))];
  const route = G.fillet(sp, 26, 10, { P, tube: d.ro });
  tubeItems("pi.siphon", route, d.ro, { cls: "ex-ss", maxLength: 90, spacing: 6 });
  const top = sp[sp.length - 1], Rg = 50;
  fp("pi.cock", FZ(top[0], top[1], 0), HEX(13, 0), top[2], top[2] + 22, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  const ctr = [top[0], top[1], top[2] + 22 + 30 + Rg];
  disc("pi.nipple", FZ(top[0], top[1], 0), top[2] + 22, ctr[2] - Math.sqrt(Rg * Rg - 8 * 8), 8, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  const g = dialCase("pi", ctr, Rg, 30, 0.02, 1, own, { major: 5, ticks: 20 });
  ANCH.MANOMETRO = g.face;
}
{
  // la válvula de seguridad: cuello de 1½ in, bridas, el cuerpo con su bonete, la tapa con la palanca de prueba, y la
  // salida al costado con un tramo corto y su brida (la descarga sigue a un lugar seguro)
  const own = "psv", d = DN[40], c = pol(EX.psv.r, EX.psv.deg), F = FZ(c[0], c[1], GEO.zClTop(EX.psv.r) - 2);
  const nk = saddle("psv.neck", F, d.ro, vStart(F, d.ro, GEO.zClTop), 90, { tone: "mid" }, { owner: own, cls: "ex-ss", hosts: [UNDER_TOP] });
  const z1 = nk.face[2], FF = FZ(c[0], c[1], 0);
  disc("psv.fl0", FF, z1, z1 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  const zb = z1 + d.ft;
  const prof = [[zb, d.fl], [zb + d.ft, d.fl], [zb + d.ft, 44], [zb + d.ft + 18, 50, 1], [zb + d.ft + 70, 52, 1], [zb + d.ft + 110, 40, 1], [zb + d.ft + 128, 32], [zb + d.ft + 128, 34], [zb + d.ft + 140, 34], [zb + d.ft + 140, 27], [zb + d.ft + 230, 21], [zb + d.ft + 230, 25], [zb + d.ft + 270, 25], [zb + d.ft + 284, 18, 1], [zb + d.ft + 292, 0]];
  turned("psv.body", FF, prof, { tone: "mid" }, { owner: own, cls: "ex-cast", smooth: { rows: 2, depth: 3, fineness: 0.7, error: 0.9 } });
  // la palanca de prueba, al costado de la tapa
  const zl = zb + d.ft + 252, lv = G.unit3(G.add3(G.mul3(TMINUS, 1), G.mul3(HV, 0.3)));
  fp("psv.lever", { o: [c[0], c[1], zl], a: lv, u: ZD3, v: G.unit3(G.cross3(lv, ZD3)) }, [[-6, -5], [6, -5], [6, 5], [-6, 5]], 25, 140, { tone: "mid" }, { owner: own, cls: "ex-lever" });
  // la salida, hacia la izquierda de la pantalla
  const zo = zb + d.ft + 70, FO = { o: [c[0], c[1], zo], a: TMINUS, u: HV, v: ZD3 }, dd = DN[50];
  const host = A.solid(FF, prof.map(([s, r]) => [s, r]));
  const rP = (s) => { for (let i = 1; i < prof.length; i++) if (s <= prof[i][0]) { const [a, ra] = prof[i - 1], [b, rb] = prof[i]; return b > a ? ra + ((rb - ra) * (s - a)) / (b - a) : rb; } return 0; };
  const inP = (p) => { const q = G.sub3(p, FF.o), s = G.dot3(q, ZD3); return Math.hypot(q[0], q[1]) < rP(s) - 0.3; };
  const on = saddle("psv.out", FO, dd.ro, startOut(FO, dd.ro, inP, 30, 70), 52 + 46, { tone: "mid" }, { owner: own, cls: "ex-cast", hosts: [host] });
  disc("psv.ofl", FO, 52 + 46, 52 + 46 + dd.ft, dd.fl, { tone: "mid" }, { owner: own, cls: "ex-cast" });
  disc("psv.dfl", FO, 52 + 46 + dd.ft, 52 + 46 + 2 * dd.ft, dd.fl, { tone: "mid" }, { owner: "psv.line", cls: "ex-ss" });
  pipe("psv.stub", [G.pointOf(FO, 52 + 46 + 2 * dd.ft, 0, 0), G.pointOf(FO, 52 + 46 + 2 * dd.ft + 90, 0, 0)], dd.ro, { cls: "ex-ss" });
  disc("psv.dfl2", FO, 52 + 46 + 2 * dd.ft + 90, 52 + 46 + 3 * dd.ft + 90, dd.fl, { tone: "mid" }, { owner: "psv.line", cls: "ex-ss" });
  ANCH.PSV = G.pointOf(FF, zb + d.ft + 90, 51, Math.atan2(G.dot3(HV, YD), G.dot3(HV, XD)));
}

/* ====================================================================
   11 · la franja de la derecha: la entrada del vapor vivo (2 in) con la válvula todo o nada y los tres termopares
   ==================================================================== */
{
  const own = "steam", d = NS, F = sideFrame(STD, EX.ring.z), s1 = RC + 110;
  saddle("steam.neck", F, d.ro, (t) => G.saddleStart(RC, d.ro, t), s1, { tone: "mid" }, { owner: own, cls: "ex-ss", hosts: [UNDER_CYL] });
  disc("steam.fl", F, s1, s1 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  // la válvula todo o nada, con el actuador hacia arriba
  const v = ballValve("xv", F, s1 + d.ft, d, { actuator: true, stem: ZD3 });
  const sV = s1 + d.ft + 216;
  // el tramo de la línea y el par de bridas donde sigue la línea que viene de la caldera
  const sE = RC + EX.steam.run;
  pipe("steam.pipe", [G.pointOf(F, sV + d.ft, 0, 0), G.pointOf(F, sE, 0, 0)], d.ro, { cls: "ex-ss" });
  disc("steam.fl1", F, sV, sV + d.ft, d.fl, { tone: "mid" }, { owner: "steam.line", cls: "ex-ss" });
  disc("steam.e0", F, sE, sE + d.ft, d.fl, { tone: "mid" }, { owner: "steam.line", cls: "ex-ss" });
  disc("steam.e1", F, sE + d.ft, sE + 2 * d.ft, d.fl, { tone: "mid" }, { owner: "steam.line2", cls: "ex-ss" });
  pipe("steam.stub", [G.pointOf(F, sE + 2 * d.ft, 0, 0), G.pointOf(F, sE + 2 * d.ft + 100, 0, 0)], d.ro, { cls: "ex-ss" });
  disc("steam.e2", F, sE + 2 * d.ft + 100, sE + 3 * d.ft + 100, d.fl, { tone: "mid" }, { owner: "steam.line2", cls: "ex-ss" });
  ANCH.XV = v.act;
  ANCH.VAPOR = G.pointOf(F, sE - 200, d.ro, PI / 2);
  ANCH.VAPOR_END = G.pointOf(F, sE + 3 * d.ft + 100, 0, 0);
}
TEZ.forEach((z, i) => {
  // un termopar: cuello de 1 in, brida, el termopozo que entra 0,3 m en el lecho y la cabeza de conexiones
  const own = `te${i}`, d = DN[25], F = sideFrame(EX.te.deg, z), s1 = RC + 70;
  saddle(`te${i}.neck`, F, d.ro, (t) => G.saddleStart(RC, d.ro, t), s1, { tone: "mid" }, { owner: own, cls: "ex-ss", hosts: [UNDER_CYL] });
  disc(`te${i}.fl0`, F, s1, s1 + d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  disc(`te${i}.fl1`, F, s1 + d.ft, s1 + 2 * d.ft, d.fl, { tone: "mid" }, { owner: own, cls: "ex-ss", extra: Dots(G.dotsOf(F, s1 + 2 * d.ft, d.bc, d.nb, P, { all: true }), { size: 0.45 }) });
  const s2 = s1 + 2 * d.ft;
  disc(`te${i}.ext`, F, s2, s2 + 50, 9, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  // la cabeza: un cilindro de aluminio con su tapa, y el prensaestopas del cable
  const sh = s2 + 50;
  const FH = { o: G.pointOf(F, sh + 34, 0, 0), a: ZD3, u: radial(EX.te.deg), v: tangent(EX.te.deg) };
  disc(`te${i}.head`, FH, -36, 26, 34, { tone: "mid" }, { owner: own, cls: "ex-cast" });
  disc(`te${i}.lid`, FH, 26, 38, 30, { tone: "mid" }, { owner: own, cls: "ex-cast" });
  const FG2 = { o: FH.o, a: G.unit3(G.add3(HV, [0, 0, 0])), u: ZD3, v: G.unit3(G.cross3(HV, ZD3)) };
  disc(`te${i}.gland`, FG2, Math.sqrt(34 * 34 - 9 * 9) - 1, 34 + 16, 9, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  // el termopozo, adentro: de la pared al lecho
  disc(`te${i}.well`, F, EX.te.tip, BK.ri + 2, EX.te.r, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  if (i === 1) { ANCH.TERMOPARES = G.pointOf(FH, 0, 34, -PI / 2); ANCH.TE_IN = G.add3(G.mul3(radial(EX.te.deg), EX.te.tip + 120), [0, 0, z + EX.te.r]); }
});

/* ====================================================================
   12 · abajo: las patas, la purga del polo con su válvula, el filtro, la trampa y el embudo
   ==================================================================== */
const LG = EX.legs, hostsBot = [UNDER_BOT];
LG.degs.forEach((deg, q) => {
  const c = pol(LG.r, deg), zc = GEO.zClBot(LG.r);
  const F = { o: [c[0], c[1], zc], a: [0, 0, -1], u: XD, v: YD };
  const pd = saddle(`leg${q}.pad`, F, LG.a, vStart(F, LG.a, GEO.zClBot), 50, { tone: "mid" }, { owner: `leg${q}`, cls: "ex-ss", hosts: hostsBot });
  disc(`leg${q}.post`, FZ(c[0], c[1], 0), LG.pt, pd.face[2], LG.rp, { tone: "mid" }, { owner: `leg${q}`, cls: "ex-ss" });
  box(`stand.leg${q}`, [c[0] - LG.plate, c[1] - LG.plate, 0], [c[0] + LG.plate, c[1] + LG.plate, LG.pt], { tone: "mid" }, { r: 6, steps: 3, bevel: 0.8, cls: "ex-ss" });
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], j) => fp(`leg${q}.anchor${j}`, FZ(c[0] + a * 84, c[1] + b * 84, 0), HEX(14), LG.pt, LG.pt + 13, { tone: "mid" }, { owner: `leg${q}`, cls: "ex-ss" }));
});
{
  const own = "purge", d = DN[25], F = { o: [0, 0, ZPOLO + 2], a: [0, 0, -1], u: XD, v: YD };
  const zf = 400;
  const pd = saddle("purge.neck", F, d.ro, vStart(F, d.ro, GEO.zClBot), F.o[2] - zf, { tone: "mid" }, { owner: own, cls: "ex-ss", hosts: hostsBot });
  disc("purge.fl0", F0, zf - d.ft, zf, d.fl, { tone: "mid" }, { owner: own, cls: "ex-ss" });
  disc("purge.fl1", F0, zf - 2 * d.ft, zf - d.ft, d.fl, { tone: "mid" }, { owner: "purge", cls: "ex-ss" });
  // baja y dobla hacia la izquierda de la pantalla, entre dos patas
  const zr = EX.purge.zrun, el = [0, 0, zr], dir = TMINUS;
  const sVa = 110, sSt = 600, sTr = 880, sOut = EX.purge.run;
  const Fr = G.frameAlong(el, dir);
  const p0 = [0, 0, zf - 2 * d.ft], route1 = G.fillet([p0, el, G.add3(el, G.mul3(dir, sVa))], 50, 8, { P, tube: d.ro });
  tubeItems("purge.pipe", route1, d.ro, { cls: "ex-ss", owner: "purge.line" });
  const v = ballValve("purge.valve", Fr, sVa, d, { open: true, stem: ZD3, owner: "purge.valve" });
  const sV1 = sVa + 165;
  pipe("purge.p2", [G.pointOf(Fr, sV1, 0, 0), G.pointOf(Fr, sSt, 0, 0)], d.ro, { cls: "ex-ss", owner: "purge.line2" });
  // el filtro en Y: el cuerpo, la pata a 45° hacia abajo con su tapón
  const yL = 120;
  turned("purge.strainer", Fr, [[sSt, 26], [sSt + 14, 26], [sSt + 18, 30, 1], [sSt + yL / 2, 33, 1], [sSt + yL - 18, 30, 1], [sSt + yL - 14, 26], [sSt + yL, 26]], { tone: "mid" }, { owner: "purge.strainer", cls: "ex-cast" });
  const yd = G.unit3(G.add3(dir, [0, 0, -1])), Fy = { o: G.pointOf(Fr, sSt + yL / 2, 0, 0), a: yd, u: G.unit3(G.cross3(yd, HV)), v: HV };
  const hostY = A.disc(Fr, sSt, sSt + yL, 33);
  const inY = (p) => { const q = G.sub3(p, Fr.o), s = G.dot3(q, Fr.a); return s > sSt - 1 && s < sSt + yL + 1 && G.len3(G.sub3(q, G.mul3(Fr.a, s))) < 31; };
  saddle("purge.yleg", Fy, 20, startOut(Fy, 20, inY, 0, 60), 78, { tone: "mid" }, { owner: "purge.strainer", cls: "ex-cast", hosts: [hostY] });
  fp("purge.yplug", Fy, HEX(17, 0), 78, 94, { tone: "mid" }, { owner: "purge.strainer", cls: "ex-cast" });
  pipe("purge.p3", [G.pointOf(Fr, sSt + yL, 0, 0), G.pointOf(Fr, sTr, 0, 0)], d.ro, { cls: "ex-ss", owner: "purge.line3" });
  // la trampa de flotador: un cuerpo de fundición con su tapa empernada mirando al lector
  const tL = 170;
  turned("purge.trap", Fr, [[sTr, 24], [sTr + 16, 24], [sTr + 22, 52, 1], [sTr + tL / 2, 66, 1], [sTr + tL - 22, 52, 1], [sTr + tL - 16, 24], [sTr + tL, 24]], { tone: "mid" }, { owner: "purge.trap", cls: "ex-cast" });
  const Fc = { o: G.pointOf(Fr, sTr + tL / 2, 0, 0), a: HV, u: G.unit3(G.cross3(ZD3, HV)), v: ZD3 };
  const tProf = [[sTr, 24], [sTr + 16, 24], [sTr + 22, 52], [sTr + tL / 2, 66], [sTr + tL - 22, 52], [sTr + tL - 16, 24], [sTr + tL, 24]];
  const rT = (s) => { for (let i = 1; i < tProf.length; i++) if (s <= tProf[i][0]) { const [a, ra] = tProf[i - 1], [b, rb] = tProf[i]; return b > a ? ra + ((rb - ra) * (s - a)) / (b - a) : rb; } return 0; };
  const inT = (p) => { const q = G.sub3(p, Fr.o), s = G.dot3(q, Fr.a); return s > sTr && s < sTr + tL && G.len3(G.sub3(q, G.mul3(Fr.a, s))) < rT(s) - 0.5; };
  const hostT = A.solid(Fr, tProf);
  const bolts = (s) => Dots(G.dotsOf(Fc, s, 40, 6, P, { all: true }), { size: 0.5 });
  saddle("purge.cover", Fc, 46, startOut(Fc, 46, inT, 20, 70), 66 + 10, { tone: "mid" }, { owner: "purge.trap", cls: "ex-cast", extra: bolts(76), hosts: [hostT] });
  // sigue un poco, dobla hacia abajo y descarga al embudo, a la vista
  const sT1 = sTr + tL, pA = G.pointOf(Fr, sT1, 0, 0), pB = G.pointOf(Fr, sOut, 0, 0), pC = [pB[0], pB[1], 162];
  const route2 = G.fillet([pA, pB, pC], 50, 8, { P, tube: d.ro });
  tubeItems("purge.out", route2, d.ro, { cls: "ex-ss", owner: "purge.line4", ends: [true, false] });
  // el embudo sobre el sumidero del piso
  const Ft = FZ(pB[0], pB[1], 0);
  const opening = `<path class="ex-bore-dk" d="${pth1(circ(Ft, 132.3, 66, 40).map(pr))}"/>` + Ln(pth1(circ(Ft, 132.4, 66, 40).map(pr)), { tone: "lo" });
  turned("purge.tundish", Ft, [[46, 24], [62, 24], [124, 74], [132, 76]], { tone: "mid" }, { owner: "purge.tundish", cls: "ex-ss", extra: opening });
  disc("purge.drain", Ft, 6, 46, 22, { tone: "mid" }, { owner: "purge.tundish", cls: "ex-ss" });
  box("stand.drain", [pB[0] - 130, pB[1] - 130, 0], [pB[0] + 130, pB[1] + 130, 6], { tone: "mid" }, { r: 4, steps: 2, bevel: 0.4, cls: "ex-cast" });
  ANCH.TRAMPA = G.add3(Fc.o, G.mul3(HV, 76));
  ANCH.PURGA = G.pointOf(Fr, sSt + 60, d.ro, PI / 2);
  ANCH.VALVULA_PURGA = v.body;
}

/* ====================================================================
   13 · las flechas del vapor: blancas con borde, sobre la cara del corte (y = +12) en el lecho y justo detrás del
   corte (y = −40) en el pleno y en el espacio de arriba
   ==================================================================== */
{
  const smooth = (ctl, n = 30) => {   // Catmull-Rom por los puntos de control
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
    ["flow.p0", -40, [[-RG.r + 40, RG.z + 60], [-RG.r + 70, RG.z + 160], [-RG.r + 50, ZP0 - 90]]],
    ["flow.p1", -40, [[RG.r - 40, RG.z + 60], [RG.r - 70, RG.z + 160], [RG.r - 50, ZP0 - 90]]],
    ["flow.b0", 12, [[-700, ZP + 120], [-660, ZP + 600], [-720, ZP + 1100], [-680, ZP + 1700]]],
    ["flow.b1", 12, [[-380, ZP + 120], [-420, ZP + 650], [-360, ZP + 1200], [-400, ZP + 1700]]],
    ["flow.b2", 12, [[-110, ZP + 120], [-80, ZP + 600], [-130, ZP + 1100], [-100, ZP + 1700]]],
    ["flow.h0", -40, [[-560, ZL + 60], [-470, ZL + 260], [-300, ZL + 420]]],
    ["flow.h1", -40, [[-200, ZL + 60], [-140, ZL + 280], [-60, ZL + 440]]],
  ];
  for (const [nm, yf, ctl] of FLOW) {
    const pts = smooth(ctl).map(([x, z]) => [x, yf, z]);
    const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[n - 4], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const h = 8, w = 4.4, base = [b[0] - ux * h, b[1] - uy * h];
    const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
    const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
    const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
    put(nm, pts[Math.floor(pts.length / 2)], `<path class="ex-vapor-o" d="${line}"/><path class="ex-vapor" d="${line}"/><path class="ex-vapor-p" d="${head}"/>`, [A.tube(pts, 10), A.ball(pts[pts.length - 1], w / G.scaleOf(P))]);
  }
}

/* ---------- la persona de referencia: 1,75 m, de pie en el piso junto a la trampa de la purga (../persona.mjs) ---------- */
{
  const PS = process.env.EX_PER ? Object.fromEntries(["x", "y", "rumbo"].map((kk, i) => [kk, Number(process.env.EX_PER.split(",")[i])])) : EX.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, 0], rumbo: PS.rumbo, mm: 1, adelante: "izq" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas.PECHO;
}

/* ---------- las caras del corte, un elemento por pieza ---------- */
{
  const groups = new Map();
  for (const c of cutStore) { const key = c.owner + "|" + c.cls; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls] = key.split("|");
    const d = list.map((c) => pth1(c.poly.map(([x, z]) => pr([x, 0, z])))).join("");
    const holes = list.filter((c) => c.hole).map((c) => pth1(c.hole.map(([x, z]) => pr([x, 0.2, z])))).join("");
    const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>` +
      (holes ? `<path class="ex-bore" d="${holes}"/>` + Ln(holes, { tone: "mid" }) : "");
    const shapes = list.map((c) => record(A.prism(FY0, c.poly, -0.3, 0, { name: `${owner}.corte`, owner })));
    const cx = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.corte.${cls}`, [cx[0] / n, 0, cx[1] / n], svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.EX_ITEM) {
  for (const nm of process.env.EX_ITEM.split(",")) {
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
// EX_PAIRS="pieza,…": los pares del orden en que entra cada pieza, con el área en que va delante cada una
if (!FAST && process.env.EX_PAIRS) {
  const names = process.env.EX_PAIRS.split(","), its = R_.settled.items;
  for (const pp of R_.settled.overlaps.pairs) {
    const a = its[pp.a].name, b = its[pp.b].name;
    if (names.includes(a) || names.includes(b)) console.log(a, "|", b, JSON.stringify(pp.front.map((f) => f && { area: f.area && +f.area.toFixed(2), at: f.at && f.at.map((v) => +v.toFixed(1)) })));
  }
}
R_.items.sort((a, b) => a.key - b.key);
const shades = (p, f, t, s0, s1, s2, s3) => `--anatomy-paper:${p};--anatomy-face:${f};--anatomy-top:${t};--anatomy-shade-0:${s0};--anatomy-shade-1:${s1};--anatomy-shade-2:${s2};--anatomy-shade-3:${s3}`;
const CSS = `.ex-cut{${shades("#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3")}}
.ex-wool-cut{${shades("#e4d88d", "#e4d88d", "#e4d88d", "#e4d88d", "#e4d88d", "#e4d88d", "#e4d88d")}}
.ex-gasket-cut{${shades("#3e464d", "#3e464d", "#3e464d", "#3e464d", "#3e464d", "#3e464d", "#3e464d")}}
.ex-ss{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#c9ced3", "#d6dade", "#e1e4e7", "#eceef0")}}
.ex-clad{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#c9ced3", "#d6dade", "#e1e4e7", "#eceef0")}}
.ex-in{${shades("#e1e4e7", "#e1e4e7", "#eceef0", "#c9ced3", "#c9ced3", "#d6dade", "#e1e4e7")}}
.ex-cast{${shades("#dfe2e5", "#dfe2e5", "#e9ebed", "#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0")}}
.ex-lever{${shades("#dfe2e5", "#dfe2e5", "#e9ebed", "#c1c6cb", "#cacfd3", "#d3d7da", "#dadde0")}}
.ex-act{${shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4")}}
.ex-gauge{${shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#c7cdd1", "#d0d5d8", "#d8dcdf", "#dfe2e4")}}
.ex-ind{${shades("#f3e9a6", "#f3e9a6", "#f8f1c4", "#dccf7e", "#e4d88d", "#ebe09a", "#efe5a1")}}
.ex-gasket{${shades("#5d666e", "#5d666e", "#6b747c", "#3e464d", "#475057", "#505960", "#576067")}}
.ex-dial{fill:#eef0f2;stroke:none}
.ex-bore{fill:#aeb8c2;stroke:none}.ex-bore-dk{fill:#525c64;stroke:none}.ex-hole{fill:#525c64;stroke:none}
.ex-pz-bg{fill:#9a5b12}.ex-pz-bgt{fill:#e0922f}.ex-pz-f{fill:#e0922f}.ex-pz-l{fill:#e6a757}.ex-pz-a{fill:#f8e4ca}.ex-pz-d{fill:#9a5b12}
.ex-pz-top{fill:#ffffff;fill-opacity:.16}.ex-pz-side{fill:#19222f;fill-opacity:.14}
.ex-carga .iso-line[data-tone="mid"]{stroke:#9a5b12}.ex-carga .iso-line[data-tone="lo"]{stroke:#9a5b12}
.ex-vapor-o{fill:none;stroke:#525c64;stroke-width:3.4px;stroke-linecap:round;stroke-linejoin:round}
.ex-vapor{fill:none;stroke:#ffffff;stroke-width:1.6px;stroke-linecap:round;stroke-linejoin:round}
.ex-vapor-p{fill:#ffffff;stroke:#525c64;stroke-width:1px;stroke-linejoin:round}
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
const svg = k.figureSvg({ width: W, height: H, label: "Extractor de vapor vivo en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="ex-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Extractor de arrastre", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
Object.assign(ANCH, {
  AISLAMIENTO: [-(RO + RW) / 2, 0, 2600],
  ESPACIO: [-870, -140, ZL + 150],
  CANASTA: [-BK.ri * 0.55, 0, ZL - 420],
  PARED_CANASTA: [-(BK.ri + BK.ro) / 2, 0, 3000],
  REJILLA: [-BK.ri * 0.62, 0, (ZP0 + ZP) / 2],
  REJILLA_TOP: [BK.ri * 0.5, -BK.ri * 0.3, ZP],
  PLENO: [-R * 0.3, -R * 0.5, ZP0 - 200],
});
writeFileSync(join(OUT, "fig_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
