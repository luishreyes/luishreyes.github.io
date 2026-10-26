/* ====================================================================
   Mezclador estático en isométrico (skill anatomy), para el capítulo 14 del libro de operaciones unitarias (Mezclado
   y escalado de tanques agitados): el ácido clorhídrico al 32 % que se inyecta en la línea de agua de proceso del
   reactor de extracción de pectina, uno en mil, y los elementos que lo reparten antes de que llegue al reactor.
   Concepto: el agua entra por la brida de la izquierda; la lanza baja por la boquilla de arriba, dobla y descarga el
   ácido en el centro del tubo, hacia aguas abajo; siete elementos Kenics KMS (cintas torcidas 180° en 1,5 D, a la
   derecha y a la izquierda, cada una girada 90° respecto a la anterior) parten la corriente y la recombinan.
   Corte: se quita la mitad que mira al lector del tubo, de las bridas y de la boquilla con sus bridas (el plano y = 0).
   Los elementos, la lanza, el conector de compresión y la unión van enteros. Lo que se ve por la abertura del corte va
   recortado a ella y se registra recortado al prisma que la abertura proyecta a lo largo de la mirada (`CLIPWIN`).
   El chorro de ácido es esquemático: muestra que la primera cinta lo parte en dos y que se diluye, no un perfil medido.
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
const STEP = Number(process.env.MZ_STEP || 0.25);
const MZ = GEO.MZ, { D, ro, ri } = MZ, FL = MZ.fl, NZ = MZ.noz, NF = MZ.nfl, GK = MZ.gk, ST = MZ.stud, FT = MZ.fit, LA = MZ.lance;
const AZ = MZ.AZ, EL = MZ.EL, XL = MZ.XL, xp0 = MZ.set, xp1 = XL - MZ.set;
const xn = NZ.x, zN = NZ.zN, rin = NZ.ri, ron = NZ.ro;
const zBT = zN + GK.t + NF.t;                       // la cara de arriba de la brida ciega
const zFit = zBT + FT.bh + FT.nk + FT.nh;            // la cara de arriba de la tuerca del conector
const zT = zFit + LA.rise, xU = xn - LA.back;        // el tramo de arriba de la lanza y la unión
const XE = GEO.XE, LE = GEO.LE, WR = GEO.W, NEL = MZ.el.n;

const W = 900, H = 520;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const PI = Math.PI, TAU = 2 * Math.PI;
const ANCH = {};                                     // los puntos a los que apuntan los rótulos del libro (libro.mjs)

const EXT = [];
for (let i = 0; i <= 24; i++) { const a = PI / 2 + (PI * i) / 24; for (const x of [0, XL]) EXT.push([x, FL.r * Math.cos(a), FL.r * Math.sin(a)]); }
EXT.push([xn - NF.r, -NF.r, zBT], [xn + NF.r, 0, zBT], [xU - MZ.union.len, 0, zT + 12], [xU - MZ.union.len, 0, zT - 12], [xn + 12, 0, zT + 20]);
for (let i = 0; i <= NEL; i++) EXT.push([XE(i), ro, 0], [XE(i), 0, -ro]);
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = (sh) => { R_.solid(sh); return sh; };
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra, shapes || [shape]);
  return shape;
}
// un cilindro corto (perno, tapón): prisma de sección circular; se registra el cilindro verdadero
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null } = {}) {
  const m = n || Math.max(16, Math.min(64, Math.round((r * G.scaleOf(P)) / 1.2)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 14, gaps = [], clsOf = () => "", caps = true, breaks = [], ends = [true, true], spacing = null, extraLast = "" } = {}) {
  R_.route(name, route, r, { owner: name, gaps, ends, piece: "frame", move: [0, 0, 0], ride: "frame" });
  const parts = tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(1.5, Math.min(6, r * 0.5)), gaps, caps, breaks });
  parts.forEach((part, index) => {
    const svg = tubeSvg(part, { tone }) + (index === parts.length - 1 ? extraLast : "");
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: wrap(svg, clsOf(part)), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] });
  });
}
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const hexR = (af) => af / Math.sqrt(3);              // radio de las puntas de un hexágono de entrecaras af

/* ---------- superficies con tonos suaves (de la válvula de control y del tanque agitado) ---------- */
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
// las polilíneas de una lista de puntos con su bandera de visible, en tramos
function runsPath(pts, vis) {
  let d = "", cur = [];
  const flush = () => { if (cur.length > 1) d += path3(cur); cur = []; };
  pts.forEach((p, i) => { if (vis[i]) cur.push(p); else flush(); });
  flush();
  return d;
}
const circle3 = (c, a, r, n = 32) => { const F = G.frameAlong(c, a); return Array.from({ length: n }, (_, i) => G.pointOf(F, 0, r, (i / n) * TAU)); };

/* ====================================================================
   1 · marcos, el corte y la ventana
   ==================================================================== */
const FXo = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: XD, u: ZD, v: YD });   // a lo largo de x; sección (z, y), mitad y ≤ 0
const FZo = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });   // a lo largo de z; sección (x, y), mitad y ≤ 0
const FYZ = { o: [0, 0, 0], a: XD, u: YD, v: ZD };                              // a lo largo de x; sección (y, z)
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD };                              // el plano del corte: sección (x, z)
const half = (r0, r1, n = 40) => GEO.halfRing(r0, r1, n);
const FRONT = A.box([-4000, 0, -4000], [4000, 4000, 4000]);                    // lo que se quita: la mitad del lector
const ZNEG = A.box([-4000, -4000, -4000], [4000, 4000, 0]);
const RUNIN = A.disc(FXo(), xp0 - 30, xp1 + 30, ri);                           // el hueco del tubo
const RUNOUT = A.disc(FXo(), xp0, xp1, ro);                                     // el tubo macizo
const HOLE = A.disc(FZo(xn), 0, 60, rin + 1.25);                                // el agujero de la boquilla, con la pared del cuello por dentro
// la abertura del corte en el plano y = 0: el tubo y la ranura de la boquilla
const WIN_R = [[xp0, -ri], [xp1, -ri], [xp1, ri], [xp0, ri]];
const WIN_S = [[xn - rin, ri - 2], [xn + rin, ri - 2], [xn + rin, zN - NZ.top], [xn - rin, zN - NZ.top]];
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const WINP = [WIN_R, WIN_S].map((poly) => A.prism(FV, poly.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]), -4000, 4000));
const CLIPWIN = A.box([-4000, -4000, -4000], [4000, 4000, 4000], { cut: WINP });
// la boca de la brida de salida (plano x = XL): por ella se ven el extremo del tubo y su soldadura de adentro
const MOUTH = Array.from({ length: 25 }, (_, i) => { const a = PI / 2 + (PI * i) / 24; return [XL, FL.bore * Math.cos(a), FL.bore * Math.sin(a)]; });
const MOUTHP = A.prism(FV, MOUTH.map((p) => [G.dot3(p, CAM.R), G.dot3(p, CAM.D)]), -4000, 4000);
const CLIPOUT = A.box([-4000, -4000, -4000], [4000, 4000, 4000], { cut: [WINP[0], MOUTHP] });
const DEFS = [`<clipPath id="mzWin">${[WIN_R, WIN_S].map((poly) => `<path d="${pth1(poly.map(([x, z]) => pr([x, 0, z])))}"/>`).join("")}</clipPath>`,
  `<clipPath id="mzWinR"><path d="${pth1(WIN_R.map(([x, z]) => pr([x, 0, z])))}"/></clipPath>`,
  `<clipPath id="mzWinOut"><path d="${pth1(WIN_R.map(([x, z]) => pr([x, 0, z])))}"/><path d="${pth1(MOUTH.map(pr))}"/></clipPath>`];
const cutStore = [];      // las caras del corte: [{ owner, poly (x, z), cls }]
// el contorno de arriba del tubo por fuera (n·V = 0) y lo que queda más allá (ángulo > aL + 0,1): el tubo lo tapa
const aL = PI - Math.atan2(V3[1], V3[2]);
const PAST = (() => { const al = aL + 0.1, nP = [0, -Math.sin(al), Math.cos(al)], dP = [0, Math.cos(al), Math.sin(al)]; return A.orientedBox(G.mul3(nP, 2000), [nP, dP, XD], [2000, 4000, 4000]); })();
const keepTop = (p) => p[2] >= 0 && Math.atan2(p[2], p[1]) <= aL + 0.1;
// la franja de arriba por fuera llega hasta el corte, pero se registra desde 1 mm atrás: la cara del corte la tapa
const FRONT1 = A.box([-4000, -1, -4000], [4000, 4000, 4000]);
const mirrorZ = (poly) => poly.map(([x, z]) => [x, -z]).reverse();
const mirrorX = (poly, xc) => poly.map(([x, z]) => [2 * xc - x, z]).reverse();

/* ====================================================================
   2 · el tubo de 2½ in: por dentro (lo que se ve por el corte), la franja de arriba por fuera y el extremo de salida
   ==================================================================== */
{
  const svg = toned((o) => surface((f, u) => [xp0 + (xp1 - xp0) * u, ri * Math.cos(f), ri * Math.sin(f)], (f) => [0, -Math.cos(f), -Math.sin(f)], PI / 2, 1.5 * PI, 90, 1, o), "mz-sub");
  put("pipe.in", [(xp0 + xp1) / 2, -ri * 0.8, 0], `<g clip-path="url(#mzWin)">${svg}</g>`,
    [record(A.body(FXo(), [[xp0, ri], [xp1, ri], [xp1, ri + 1.2], [xp0, ri + 1.2]], { name: "pipe.in", owner: "pipe", ground: true, cut: [FRONT, CLIPWIN, HOLE] }))]);
}
{
  const keep = (p) => (p[0] - xn) ** 2 + p[1] ** 2 > ron * ron;
  const svg = toned((o) => surface((f, u) => [FL.y + (XL - 2 * FL.y) * u, ro * Math.cos(f), ro * Math.sin(f)], (f) => [0, Math.cos(f), Math.sin(f)], PI / 2, PI, 40, 1, o, keep), "mz-ss");
  const yL = ro * Math.cos(aL), zL = ro * Math.sin(aL);
  const lim = Ln(path3([[xp0 + FL.y, yL, zL], [xp1 - FL.y, yL, zL]]), { tone: "mid" });
  put("pipe.out", [(xp0 + xp1) / 2, -ro * 0.4, ro * 0.9], svg + lim,
    [record(A.body(FXo(), [[FL.y, ro - 1.2], [XL - FL.y, ro - 1.2], [XL - FL.y, ro], [FL.y, ro]], { name: "pipe.out", owner: "pipe", ground: true, cut: [FRONT1, ...WINP, ZNEG, HOLE, PAST] }))]);
}
{
  // el extremo del tubo dentro de la brida de salida (cara hacia +x, se ve por el agujero de la brida)
  const pts = [];
  for (let i = 0; i <= 24; i++) { const a = PI / 2 + (PI * i) / 24; pts.push([xp1, ro * Math.cos(a), ro * Math.sin(a)]); }
  for (let i = 24; i >= 0; i--) { const a = PI / 2 + (PI * i) / 24; pts.push([xp1, ri * Math.cos(a), ri * Math.sin(a)]); }
  put("pipe.end", [xp1, -ro * 0.6, 0], `<g clip-path="url(#mzWinOut)">${flatFace(pts, XD, "mz-ss")}${Ln(path3(pts.slice(0, 25)) + path3(pts.slice(25)), { tone: "mid" })}</g>`,
    [record(A.ring(FXo(), xp1 - 0.4, xp1, ri, ro, { name: "pipe.end", owner: "pipe", ground: true, cut: [FRONT, CLIPOUT] }))]);
}
// las caras del corte del tubo y de la boquilla: arriba, con la ranura de la boquilla, y abajo
{
  const zt = zN - NZ.top;
  cutStore.push({ owner: "pipe.top", poly: [[xp0, ri], [xn - rin, ri], [xn - rin, zt], [xn - ron, zt], [xn - ron, ro], [xp0, ro]], cls: "mz-cut" });
  cutStore.push({ owner: "pipe.top", poly: [[xn + rin, ri], [xp1, ri], [xp1, ro], [xn + ron, ro], [xn + ron, zt], [xn + rin, zt]], cls: "mz-cut" });
  cutStore.push({ owner: "pipe.bot", poly: [[xp0, -ro], [xp1, -ro], [xp1, -ri], [xp0, -ri]], cls: "mz-cut" });
}

/* ====================================================================
   3 · las bridas de 2½ in: cara realzada, disco con los agujeros de atrás, cubo y las soldaduras de filete
   ==================================================================== */
const backHoles = [[-1, 1], [-1, -1]].map(([sy, sz]) => [sy * FL.bc / Math.SQRT2, sz * FL.bc / Math.SQRT2]);   // (y, z)
const holeFill = (x, y, z, r) => `<path class="mz-bore" d="${pth1(Array.from({ length: 36 }, (_, i) => pr([x, y + r * Math.cos((i / 36) * TAU), z + r * Math.sin((i / 36) * TAU)])))}"/>`;
function halfX(name, s0, s1, r0, r1, style = {}, { owner, cut = null, cls = "mz-ss", extra = "", n = 40 } = {}) {
  return fp(name, FXo(), half(r0, r1, n), Math.min(s0, s1), Math.max(s0, s1), style, { owner, cut, cls, extra });
}
const revP = (F, s0, s1, rr) => (f, u) => { const s = s0 + (s1 - s0) * u; return G.pointOf(F, s, rr(s), f); };
const revN = (F, s0, s1, rr, dr, sg = 1) => (f, u) => { const s = s0 + (s1 - s0) * u; return G.mul3(G.unit3(G.sub3(G.radialOf(F, f), G.mul3(F.a, dr(s)))), sg); };
[-1, 1].forEach((sg) => {
  const own = sg < 0 ? "fl.in" : "fl.out";
  const X_ = (v) => (sg < 0 ? v : XL - v);           // distancia desde la cara realzada hacia adentro del tubo
  const rfx = [X_(0), X_(FL.rfh)], plx = [X_(FL.rfh), X_(FL.t)], hbx = [X_(FL.t), X_(FL.y)];
  const xFace = sg < 0 ? X_(FL.t) : X_(FL.rfh);     // la cara del disco que mira al lector (+x)
  const serr = sg > 0 ? Ln([39.6, 42.6, 45.6, 48.6].map((r) => path3(Array.from({ length: 41 }, (_, i) => { const a = PI / 2 + (PI * i) / 40; return [XL + 0.05, r * Math.cos(a), r * Math.sin(a)]; }))).join(""), { tone: "faint" }) : "";
  halfX(`${own}.rf`, rfx[0], rfx[1], FL.bore, FL.rf, { tone: "mid" }, { owner: own, extra: serr });
  const holesCut = backHoles.map(([y, z]) => A.disc(FXo(0, y, z), Math.min(...plx) - 1, Math.max(...plx) + 1, FL.hole));
  halfX(`${own}.disc`, plx[0], plx[1], FL.bore, FL.r, { tone: "mid" }, { owner: own, cut: holesCut, extra: backHoles.map(([y, z]) => holeFill(xFace + 0.05, y, z, FL.hole)).join(""), n: 56 });
  halfX(`${own}.hub`, hbx[0], hbx[1], FL.bore, FL.hub, { tone: "mid" }, { owner: own });
  const sec = [[0, FL.bore], [0, FL.rf], [FL.rfh, FL.rf], [FL.rfh, FL.r], [FL.t, FL.r], [FL.t, FL.hub], [FL.y, FL.hub], [FL.y, FL.bore]].map(([s, r]) => [X_(s), r]);
  cutStore.push({ owner: own, poly: sec, cls: "mz-cut" }, { owner: own, poly: mirrorZ(sec), cls: "mz-cut" });
  // las soldaduras: la de adentro (entre el extremo del tubo y el agujero de la brida) y la del cubo, por fuera
  const wIn = [[MZ.set, ri + 1], [MZ.set, FL.bore], [MZ.set - MZ.wIn, FL.bore]].map(([s, r]) => [X_(s), r]);
  const wHub = [[FL.y, ro], [FL.y, ro + MZ.wHub], [FL.y + MZ.wHub, ro]].map(([s, r]) => [X_(s), r]);
  for (const [tag, tri] of [["weld.in", wIn], ["weld.hub", wHub]]) {
    cutStore.push({ owner: own, poly: tri, cls: "mz-cut-w" }, { owner: own, poly: mirrorZ(tri), cls: "mz-cut-w" });
    // la cara a la vista del cordón: el cono entre los dos catetos (va de la punta de un cateto a la del otro)
    const [p0, p1] = tag === "weld.in" ? [tri[0], tri[2]] : [tri[1], tri[2]];
    const F = { o: [0, 0, 0], a: XD, u: ZD, v: YD };
    const s0 = Math.min(p0[0], p1[0]), s1 = Math.max(p0[0], p1[0]), ra = p0[0] < p1[0] ? p0[1] : p1[1], rb = p0[0] < p1[0] ? p1[1] : p0[1];
    const rr = (s) => ra + (rb - ra) * ((s - s0) / (s1 - s0)), dr = () => (rb - ra) / (s1 - s0);
    const inward = tag === "weld.in" ? -1 : 1;
    const svg = toned((o) => surface(revP(F, s0, s1, rr), revN(F, s0, s1, rr, dr, inward), PI, TAU, 48, 1, o, tag === "weld.hub" ? keepTop : null), "mz-weld");
    const merid = tri.map(([s, r]) => [s, r]);
    const inside = tag === "weld.in", clipId = sg < 0 ? "mzWinR" : "mzWinOut", clipSh = sg < 0 ? A.box([-4000, -4000, -4000], [4000, 4000, 4000], { cut: [WINP[0]] }) : CLIPOUT;
    put(`${own}.${tag}`, [(s0 + s1) / 2, -ra * 0.7, ra * 0.5], inside ? `<g clip-path="url(#${clipId})">${svg}</g>` : svg,
      [record(A.body(F, merid, { name: `${own}.${tag}`, owner: own, cut: inside ? [FRONT, clipSh] : [FRONT, PAST, ZNEG] }))]);
  }
});

/* ====================================================================
   4 · los elementos Kenics KMS: siete cintas torcidas 180°, cada una en NS rebanadas que se ordenan por x
   ==================================================================== */
const NS = 8, NSUB = 3, NU = 20, TH = MZ.el.t / 2;
const e2 = (th) => [0, -Math.sin(th), Math.cos(th)];   // el espesor de la cinta, en la sección
const d2 = (th) => [0, Math.cos(th), Math.sin(th)];    // a lo ancho de la cinta
const Pm = (i, x, w) => { const th = GEO.thetaAt(i, x); return [x, w * Math.cos(th), w * Math.sin(th)]; };
const Nm = (i, x, w) => { const th = GEO.thetaAt(i, x); return G.unit3([-w * GEO.dTheta(i), -Math.sin(th), Math.cos(th)]); };
const Pf = (i, x, w, side) => G.add3(Pm(i, x, w), G.mul3(e2(GEO.thetaAt(i, x)), side * TH));
const vis = (n) => G.dot3(n, V3) > 1e-4;
/* Los tonos de un trozo de superficie paramétrica, recortados por triángulos: en cada triángulo n·V y n·L se toman
   lineales, así los bordes de tono y el doblez (n·V = 0) son curvas continuas de una celda a la siguiente y de una
   rebanada a la siguiente, sin escalones. Las celdas de un solo tono, seguidas a lo ancho, van en un cuadrilátero. */
const TB = [0, 0.2, 0.42, 0.62];
const bandOfL = (l) => { let t = 0; while (t < 4 && l >= TB[t]) t++; return t; };
function clipPoly(poly, f, k) {   // la parte del polígono donde f(v) ≥ k, interpolando punto, v y l
  const out = [];
  for (let q = 0; q < poly.length; q++) {
    const a = poly[q], b = poly[(q + 1) % poly.length], fa = f(a) - k, fb = f(b) - k;
    if (fa >= 0) out.push(a);
    if ((fa >= 0) !== (fb >= 0)) { const t = fa / (fa - fb); out.push({ p: G.lerp3(a.p, b.p, t), v: a.v + (b.v - a.v) * t, l: a.l + (b.l - a.l) * t }); }
  }
  return out;
}
function patchTones(P3, N3, a0, a1, na, b0, b1, nb, out) {
  const g = [];
  for (let q = 0; q <= na; q++) { const row = []; for (let r = 0; r <= nb; r++) { const a = a0 + ((a1 - a0) * q) / na, b = b0 + ((b1 - b0) * r) / nb, n = N3(a, b); row.push({ p: P3(a, b), v: G.dot3(n, V3), l: G.dot3(n, L3) }); } g.push(row); }
  const push = (band, poly) => { if (poly.length > 2) { const d = pth1(poly.map((c) => pr(c.p))); out.by[band].push(d); out.fill.push(d); } };
  for (let q = 0; q < na; q++) {
    let run = null;
    const flush = () => { if (run) push(run.band, [g[q][run.r0], g[q][run.r1], g[q + 1][run.r1], g[q + 1][run.r0]]); run = null; };
    for (let r = 0; r < nb; r++) {
      const cs = [g[q][r], g[q][r + 1], g[q + 1][r + 1], g[q + 1][r]];
      const b0_ = bandOfL(cs[0].l), uni = cs.every((c) => c.v > 0 && bandOfL(c.l) === b0_);
      if (uni) { if (run && run.band === b0_ && run.r1 === r) run.r1 = r + 1; else { flush(); run = { band: b0_, r0: r, r1: r + 1 }; } continue; }
      flush();
      for (const tri of [[cs[0], cs[1], cs[2]], [cs[0], cs[2], cs[3]]]) {
        const seen = clipPoly(tri, (c) => c.v, 1e-6);
        if (seen.length < 3) continue;
        for (let band = 0; band <= 4; band++) {
          let poly = seen;
          if (band > 0) poly = clipPoly(poly, (c) => c.l, TB[band - 1]);
          if (band < 4 && poly.length > 2) poly = clipPoly(poly, (c) => -c.l, -TB[band]);
          push(band, poly);
        }
      }
    }
    flush();
  }
}
// dónde cambia de signo una función entre a y b (bisección)
const root = (fn, a, b) => { let fa = fn(a); for (let it = 0; it < 40; it++) { const m = (a + b) / 2, fm = fn(m); if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m; } return (a + b) / 2; };
// los tramos de una curva donde vale vis(x) > 0, con los extremos exactos
function visRuns(x0, x1, n, vis, at) {
  const xs = Array.from({ length: n + 1 }, (_, q) => x0 + ((x1 - x0) * q) / n);
  let d = "", cur = [];
  const flush = () => { if (cur.length > 1) d += path3(cur); cur = []; };
  for (let q = 0; q <= n; q++) {
    const ok = vis(xs[q]) > 0;
    if (q > 0 && ok !== vis(xs[q - 1]) > 0) { const xr = root(vis, xs[q - 1], xs[q]); cur.push(at(xr)); if (!ok) flush(); }
    if (ok) cur.push(at(xs[q]));
  }
  flush();
  return d;
}
const DBG = process.env.MZ_DEBUG ? (c, d) => `<path d="${d}" style="fill:none;stroke:${c};stroke-width:1.2"/>` : null;
for (let i = 0; i < NEL; i++) {
  const tp = GEO.dTheta(i), wFold = (x) => { const th = GEO.thetaAt(i, x); return (Math.cos(th) * V3[2] - Math.sin(th) * V3[1]) / (tp * V3[0]); };
  for (let j = 0; j < NS; j++) {
    const xa = XE(i) + (j * LE) / NS, xb = xa + LE / NS, xm = (xa + xb) / 2;
    // cada rebanada va en dos mitades, una a cada lado del eje (w > 0 y w < 0): donde la cinta se ve de canto, una
    // mitad tapa a la otra y el orden de pintura las separa
    for (const sg of [1, -1]) {
      const out = { by: [[], [], [], [], []], fill: [] };
      // la cinta se dibuja en su superficie media, sin espesor: las dos caras se reparten la superficie por el doblez
      // (n·V = 0), sin encimarse, y el canto es una sola línea. El espesor (2,4 mm, dibujo) sí va en la forma registrada.
      for (const side of [1, -1]) patchTones((x, w) => Pm(i, x, w), (x, w) => G.mul3(Nm(i, x, w), side), xa, xb, NSUB, 0, sg * WR, NU / 2, out);
      const faces = `<g class="iso-solid mz-el" data-seamless="">` + out.by.slice(0, 4).map((d, q) => (d.length ? `<path class="iso-shade" data-shade="${q}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "") + "</g>";
      let tail = "";
      const L = { rim: "", foldF: "", lead: "", tail: "" };
      // el borde de salida del elemento y el canto: contorno siempre (lo que los tape va delante en el orden de pintura)
      if (j === NS - 1) L.tail += path3([Pm(i, xb, 0), Pm(i, xb, sg * WR)]);
      L.rim += path3(Array.from({ length: 13 }, (_, q) => Pm(i, xa + ((xb - xa) * q) / 12, sg * WR)));
      // el doblez: donde la cinta se ve de canto (n·V = 0), si cae en esta mitad. Llega al canto tangente a él (el
      // contorno de una superficie toca así el de su borde), así que en el canto se desvanece en vez de correr pegado
      // a las aristas
      {
        const fv = (x) => { const w = wFold(x) * sg; return Math.min(w, WR - w); }, xs = Array.from({ length: 13 }, (_, q) => xa + ((xb - xa) * q) / 12);
        let cur = [], ends = [];
        const flush = () => {
          if (cur.length > 1) {
            const sc = cur.map((x) => at(Pm(i, x, Math.max(-WR, Math.min(WR, wFold(x))))));
            const atRim = (x) => Math.abs(Math.abs(wFold(x)) - WR) < 0.05;
            L.foldF += k.fadeLineSvg(sc, { fade: [atRim(cur[0]) ? 5 : 0, atRim(cur[cur.length - 1]) ? 5 : 0], tone: "mid" });
          }
          cur = [];
        };
        for (let q = 0; q < xs.length; q++) {
          const ok = fv(xs[q]) > 0;
          if (q > 0 && ok !== fv(xs[q - 1]) > 0) { const xr = root(fv, xs[q - 1], xs[q]); cur.push(xr); if (!ok) flush(); }
          if (ok) cur.push(xs[q]);
        }
        flush();
      }
      // el borde de entrada del elemento: su cara mira a −x (no se ve), así que sus aristas son contorno
      if (j === 0) L.lead += path3([Pm(i, xa, 0), Pm(i, xa, sg * WR)]);
      const lines = DBG ? DBG("#d00", L.rim) + DBG("#00d", L.lead) + DBG("#a0a", L.tail) + L.foldF : Ln(L.rim + L.lead + L.tail, { tone: "mid" }) + L.foldF;
      // la forma registrada: el casco de la sección de esta mitad al principio, en la mitad y al final de la rebanada
      const pts = [];
      for (const x of [xa, xm, xb]) { const th = GEO.thetaAt(i, x); for (const w of [0, WR]) for (const s2 of [-1, 1]) { const p = G.add3(G.mul3(d2(th), sg * w), G.mul3(e2(th), s2 * (TH + 0.05))); pts.push([p[1], p[2]]); } }
      const nm = `el${i}.s${j}${sg > 0 ? "a" : "b"}`;
      const lobe = record(A.prism(FYZ, G.hullOf(pts), xa, xb, { name: nm, owner: `el${i}` }));
      put(nm, [xm, sg * WR * 0.5 * Math.cos(GEO.thetaAt(i, xm)), sg * WR * 0.5 * Math.sin(GEO.thetaAt(i, xm))], faces + tail + lines, [lobe]);
    }
  }
}

/* ====================================================================
   5 · la boquilla de 1 in: cuello (cortado), brida deslizante, empaque, brida ciega, espárragos de atrás
   ==================================================================== */
const zH = zN - NF.y;                                  // el fondo del cubo de la brida de la boquilla
const zNeckTop = zN - NZ.top;
{
  // el cuello por fuera: la mitad de atrás, de la silla sobre el tubo al cubo de la brida
  const zs = (f) => Math.sqrt(Math.max(0, ro * ro - (ron * Math.sin(f)) ** 2));
  const outer = toned((o) => surface((f, u) => { const z0 = zs(f); return [xn + ron * Math.cos(f), ron * Math.sin(f), z0 + (zH - z0) * u]; }, (f) => [Math.cos(f), Math.sin(f), 0], PI, TAU, 48, 1, o), "mz-ss");
  const fL = TAU - Math.atan2(V3[0], V3[1]);          // el contorno de la derecha: n·V = 0
  const sil = Ln(path3([[xn + ron * Math.cos(fL), ron * Math.sin(fL), zs(fL)], [xn + ron * Math.cos(fL), ron * Math.sin(fL), zH]]), { tone: "mid" });
  const fs = Array.from({ length: 25 }, (_, q) => fL + ((TAU - fL) * q) / 24);
  const saddleLine = Ln(path3(fs.map((f) => [xn + ron * Math.cos(f), ron * Math.sin(f), zs(f)])), { tone: "mid" });
  put("noz.out", [xn + ron * 0.8, -ron * 0.5, (ro + zH) / 2], outer + sil + saddleLine,
    [record(A.ring(FZo(xn), 0, zH, ron - 1.2, ron, { name: "noz.out", owner: "pipe", cut: [FRONT, RUNOUT] }))]);
  // el cuello por dentro, del hueco del tubo al extremo del cuello dentro de la brida: se ve por la ranura del corte
  const zi = (f) => Math.sqrt(Math.max(0, ri * ri - (rin * Math.sin(f)) ** 2));
  const inner = toned((o) => surface((f, u) => { const z0 = zi(f); return [xn + rin * Math.cos(f), rin * Math.sin(f), z0 + (zNeckTop - z0) * u]; }, (f) => [-Math.cos(f), -Math.sin(f), 0], PI, TAU, 48, 1, o), "mz-sub");
  put("noz.in", [xn, -rin * 0.7, (ri + zNeckTop) / 2], `<g clip-path="url(#mzWin)">${inner}</g>`,
    [record(A.ring(FZo(xn), 0, zNeckTop, rin, rin + 1.2, { name: "noz.in", owner: "pipe", cut: [FRONT, CLIPWIN, RUNIN] }))]);
}
function halfZ(name, s0, s1, r0, r1, style = {}, { owner, cut = null, cls = "mz-ss", extra = "", n = 40 } = {}) {
  return fp(name, FZo(xn), half(r0, r1, n), Math.min(s0, s1), Math.max(s0, s1), style, { owner, cut, cls, extra });
}
const studXY = [[1, -1], [-1, -1]].map(([sx, sy]) => [sx * NF.bc / Math.SQRT2, sy * NF.bc / Math.SQRT2]);   // (dx, y) de los dos de atrás
// los agujeros se registran del radio del espárrago (el agujero real es de Ø 15,9): así cada trozo de espárrago toca su brida
const studHoles = (z0, z1) => studXY.map(([dx, y]) => A.disc(FZo(xn + dx, y), z0 - 1, z1 + 1, ST.r + 0.05));
{
  // la brida de la boquilla (deslizante): cubo, disco y cara realzada
  halfZ("nfl.hub", zH, zN - NF.t, NF.bore, NF.hub, { tone: "mid" }, { owner: "nfl" });
  halfZ("nfl.disc", zN - NF.t, zN - NF.rfh, NF.bore, NF.r, { tone: "mid" }, { owner: "nfl", cut: studHoles(zN - NF.t, zN - NF.rfh) });
  halfZ("nfl.rf", zN - NF.rfh, zN, NF.bore, NF.rf, { tone: "mid" }, { owner: "nfl" });
  const sec = [[NF.bore, zH], [NF.hub, zH], [NF.hub, zN - NF.t], [NF.r, zN - NF.t], [NF.r, zN - NF.rfh], [NF.rf, zN - NF.rfh], [NF.rf, zN], [NF.bore, zN]];
  cutStore.push({ owner: "nfl", poly: sec.map(([r, z]) => [xn + r, z]), cls: "mz-cut" }, { owner: "nfl", poly: sec.map(([r, z]) => [xn - r, z]).reverse(), cls: "mz-cut" });
  // la soldadura de filete del cuello al cubo: de ella solo se ve la sección; su forma une el cuello con la brida
  const wt = [[ron, zH - 4], [ron, zH], [ron + 4, zH]];
  cutStore.push({ owner: "nfl", poly: wt.map(([r, z]) => [xn + r, z]), cls: "mz-cut-w" }, { owner: "nfl", poly: wt.map(([r, z]) => [xn - r, z]).reverse(), cls: "mz-cut-w" });
  record(A.body(FZo(xn), wt.map(([r, z]) => [z, r]), { name: "nfl.weld", owner: "nfl", cut: [FRONT] }));
  // el empaque
  halfZ("gasket", zN, zN + GK.t, GK.ri, GK.ro, { tone: "lo" }, { owner: "gasket", cls: "mz-gasket" });
  const gs = [[GK.ri, zN], [GK.ro, zN], [GK.ro, zN + GK.t], [GK.ri, zN + GK.t]];
  cutStore.push({ owner: "gasket", poly: gs.map(([r, z]) => [xn + r, z]), cls: "mz-cut-gk" }, { owner: "gasket", poly: gs.map(([r, z]) => [xn - r, z]).reverse(), cls: "mz-cut-gk" });
  // la brida ciega con la conexión de la lanza
  const z1 = zN + GK.t, z2 = z1 + NF.rfh;
  halfZ("blind.rf", z1, z2, MZ.blind.port, NF.rf, { tone: "mid" }, { owner: "blind" });
  halfZ("blind.disc", z2, zBT, MZ.blind.port, NF.r, { tone: "mid" }, { owner: "blind", cut: studHoles(z2, zBT) });
  const bs = [[MZ.blind.port, z1], [NF.rf, z1], [NF.rf, z2], [NF.r, z2], [NF.r, zBT], [MZ.blind.port, zBT]];
  cutStore.push({ owner: "blind", poly: bs.map(([r, z]) => [xn + r, z]), cls: "mz-cut" }, { owner: "blind", poly: bs.map(([r, z]) => [xn - r, z]).reverse(), cls: "mz-cut" });
  // los dos espárragos de atrás: tuerca arriba y abajo, la punta de cada lado y el tramo entre las bridas
  studXY.forEach(([dx, y], q) => {
    const own = `stud${q}`, F = FZo(xn + dx, y), nr = hexR(ST.nut), zb = zN - NF.t;
    fp(`${own}.nut.top`, F, HEX(nr, 0), zBT, zBT + ST.nh, { tone: "mid" }, { owner: own, cls: "mz-trim" });
    disc(`${own}.tip.top`, F, zBT + ST.nh, zBT + ST.nh + ST.out, ST.r, { tone: "mid" }, { owner: own, cls: "mz-trim" });
    disc(`${own}.mid`, F, zN - NF.rfh, z2, ST.r, { tone: "mid" }, { owner: own, cls: "mz-trim" });
    fp(`${own}.nut.bot`, F, HEX(nr, 0), zb - ST.nh, zb, { tone: "mid" }, { owner: own, cls: "mz-trim" });
    disc(`${own}.tip.bot`, F, zb - ST.nh - ST.out, zb - ST.nh, ST.r, { tone: "mid" }, { owner: own, cls: "mz-trim" });
  });
}

/* ====================================================================
   6 · la lanza: el conector de compresión sobre la brida ciega, la unión del ácido y el tubo, que baja, dobla y
   descarga en el centro, hacia aguas abajo
   ==================================================================== */
{
  const F = FZo(xn);
  fp("fit.body", F, HEX(hexR(FT.body), 0), zBT, zBT + FT.bh, { tone: "mid" }, { owner: "lance", cls: "mz-trim" });
  disc("fit.neck", F, zBT + FT.bh, zBT + FT.bh + FT.nk, FT.neck, { tone: "mid" }, { owner: "lance", cls: "mz-trim" });
  fp("fit.nut", F, HEX(hexR(FT.nut), 0), zBT + FT.bh + FT.nk, zFit, { tone: "mid" }, { owner: "lance", cls: "mz-trim" });
  // la unión: tuerca, cuerpo y tuerca, a lo largo de x, al final del tramo de arriba
  const UN = MZ.union, FU = { o: [0, 0, zT], a: XD, u: YD, v: ZD }, ur = hexR(UN.af);
  fp("union.nut0", FU, HEX(ur, 0), xU - UN.len / 3, xU, { tone: "mid" }, { owner: "union", cls: "mz-trim" });
  fp("union.body", FU, HEX(ur * 1.08, PI / 6), xU - (2 * UN.len) / 3, xU - UN.len / 3, { tone: "mid" }, { owner: "union", cls: "mz-trim" });
  fp("union.nut1", FU, HEX(ur, 0), xU - UN.len, xU - (2 * UN.len) / 3, { tone: "mid" }, { owner: "union", cls: "mz-trim" });
  // el tubo de la lanza
  const ctl = [[xU, 0, zT], [xn, 0, zT], [xn, 0, 0], [GEO.XTIP, 0, 0]];
  const route = G.fillet(ctl, LA.bend, 10, { P, tube: LA.r });
  const arcAt = (pt) => { let s = 0, best = Infinity, sb = 0; for (let q = 1; q < route.length; q++) { const a = route[q - 1], b = route[q], L = G.len3(G.sub3(b, a)); const ab = G.sub3(b, a), t = Math.max(0, Math.min(1, G.dot3(G.sub3(pt, a), ab) / (L * L || 1))); const d = G.len3(G.sub3(G.add3(a, G.mul3(ab, t)), pt)); if (d < best) { best = d; sb = s + t * L; } s += L; } return sb; };
  const gaps = [[arcAt([xn, 0, zFit]), arcAt([xn, 0, zBT])]];
  // la boca de la lanza: el agujero del tubo en la punta
  const bore = `<path class="mz-bore-dark" d="${pth1(circle3([GEO.XTIP + 0.05, 0, 0], XD, LA.bore, 28).map(pr))}"/>`;
  tubeItems("lance", route, LA.r, { gaps, ends: [true, false], clsOf: (part) => (part.mid[2] > zBT ? "mz-lance" : "mz-lance-sub"), extraLast: bore });
  ANCH.LANZA = [GEO.XTIP - 22, LA.r * 0.55, LA.r * 0.8];
  ANCH.ACIDO = [xU - UN.len / 2, -ur * 0.2, zT + ur * 0.95];
  ANCH.CONECTOR = [xn + 3, FT.nut / 2, zBT + FT.bh + FT.nk + FT.nh * 0.55];
}

/* ====================================================================
   7 · la flecha del agua, en un plano justo detrás del corte, y el chorro de ácido (esquemático)
   ==================================================================== */
{
  const YF = -3, ZF = -17, a3 = [MZ.set + 8, YF, ZF], b3 = [GEO.XTIP + 6, YF, ZF];
  const a = at(a3), b = at(b3), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const h = 8, w = 3.8, base = [b[0] - ux * h, b[1] - uy * h];
  const line = `M${r10(a[0])} ${r10(a[1])}L${r10(base[0])} ${r10(base[1])}`;
  const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  put("flow", [(a3[0] + b3[0]) / 2, YF, ZF], `<path class="mz-flujo" d="${line}"/><path class="mz-flecha" d="${head}"/>`, [A.tube([a3, b3], 1.2), A.ball(b3, w / G.scaleOf(P))]);
  ANCH.AGUA = [(a3[0] + b3[0]) / 2 - 30, YF, ZF];
}

/* El chorro de ácido, esquemático: sale de la boca de la lanza por el eje, la arista de entrada del primer elemento lo
   parte en dos y cada mitad sigue la cara de la cinta mientras se ensancha y se aclara hasta perderse en el agua. No
   es un perfil medido: dice que la cinta reparte el ácido y que se diluye. Cada trozo cae dentro de una rebanada de
   la cinta, así el orden de pintura lo pone delante o detrás de la cinta sin cruces. */
{
  const mix = (a, b, m) => "#" + a.map((v, q) => Math.round(v + (b[q] - v) * m).toString(16).padStart(2, "0")).join("");
  const ACID = { body: [224, 162, 58], shine: [242, 207, 142], shade: [192, 127, 30], edge: [154, 100, 24] };
  const WATER = { body: [226, 233, 238], shine: [240, 244, 247], shade: [208, 218, 225], edge: [204, 214, 221] };
  // el color va en degradados a lo largo del eje, en pantalla, compartidos por todos los trozos: no cambia a saltos
  const grads = (id, xa, xb, m0, m1) => {
    const a = at([xa, 0, 0]), b = at([xb, 0, 0]);
    for (const [key, tag] of [["body", "B"], ["shine", "T"], ["shade", "S"], ["edge", "E"]])
      DEFS.push(`<linearGradient id="${id}${tag}" gradientUnits="userSpaceOnUse" x1="${r10(a[0])}" y1="${r10(a[1])}" x2="${r10(b[0])}" y2="${r10(b[1])}">` +
        [0, 0.5, 1].map((o) => `<stop offset="${o}" stop-color="${mix(ACID[key], WATER[key], m0 + (m1 - m0) * o)}"/>`).join("") + "</linearGradient>");
    return `--anatomy-shade-2:url(#${id}B);--anatomy-top:url(#${id}T);--anatomy-shade-0:url(#${id}S);--anatomy-mid:url(#${id}E)`;
  };
  const chunks = (name, route, radius, breaks, style) => {
    tubePieces(route, radius, P, { maxLength: 200, spacing: 1.5, breaks, caps: true }).forEach((part, index) => {
      put(`${name}:${index}`, part.mid, `<g class="mz-acid" style="${style}">${tubeSvg(part, { tone: "mid" })}</g>`, [A.tube(part.points, part.radii)]);
    });
  };
  const arcOfX = (route, x) => { let s = 0; for (let q = 1; q < route.length; q++) { const a = route[q - 1], b = route[q], L = G.len3(G.sub3(b, a)); if (x <= b[0]) return s + L * Math.max(0, (x - a[0]) / (b[0] - a[0])); s += L; } return s; };
  // el chorro, de la boca de la lanza a la arista de entrada
  const j0 = GEO.XTIP + 0.3, j1 = XE(0) - 1.6, NJ = 24;
  const jet = Array.from({ length: NJ + 1 }, (_, q) => [j0 + ((j1 - j0) * q) / NJ, 0, 0]);
  chunks("acid.jet", jet, (t) => LA.bore * 0.97 + (7.4 - LA.bore * 0.97) * t, [10, 20].map((x) => arcOfX(jet, j0 + x)), grads("mzJ", j0, j1, 0, 0.12));
  // las dos mitades, una a cada lado de la cinta, por el primer elemento: cada una se ensancha y luego se adelgaza
  // hasta perderse, mientras su color pasa al del agua
  const s0 = XE(0) + 1.4, s1 = XE(0) + 0.62 * LE, NSx = 80;
  const rS = (t) => Math.max(0.35, 6.4 * Math.pow(Math.sin(PI * (0.18 + 0.82 * t)), 0.8)), dS = (t) => rS(t) + 2.6;
  const style = grads("mzS", s0, s1, 0.14, 0.92);
  for (const sg of [1, -1]) {
    const route = Array.from({ length: NSx + 1 }, (_, q) => { const t = q / NSx, x = s0 + (s1 - s0) * t; return G.add3([x, 0, 0], G.mul3(e2(GEO.thetaAt(0, x)), sg * dS(t))); });
    const breaks = []; for (let q = 1; q < NS; q++) { const xb = XE(0) + (q * LE) / NS; if (xb > s0 && xb < s1) breaks.push(arcOfX(route, xb)); }
    chunks(`acid.${sg > 0 ? "a" : "b"}`, route, (t) => rS(t), breaks, style);
  }
  ANCH.CHORRO = [(j0 + j1) / 2 + 4, 0, 5.2];
}

/* ---------- las caras del corte, un elemento por pieza ---------- */
{
  const groups = new Map();
  for (const c of cutStore) { if (!groups.has(c.owner)) groups.set(c.owner, []); groups.get(c.owner).push(c); }
  for (const [owner, list] of groups) {
    const byCls = new Map();
    for (const c of list) { if (!byCls.has(c.cls)) byCls.set(c.cls, []); byCls.get(c.cls).push(c); }
    let svg = "";
    for (const [cls, l2] of byCls) {
      const d = l2.map((c) => pth1(c.poly.map(([x, z]) => pr([x, 0, z])))).join("");
      svg += `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
    }
    const shapes = list.map((c) => record(A.prism(FY0, c.poly, -0.3, 0, { name: `${owner}.corte`, owner: owner.startsWith("pipe") ? "pipe" : owner, ground: owner.startsWith("pipe") })));
    const cx = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.corte`, [cx[0] / n, 0, cx[1] / n], svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.MZ_ITEM) {
  for (const nm of process.env.MZ_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], P, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
const t0 = Date.now();
if (!FAST) A.settle(R_, P, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");
R_.items.sort((a, b) => a.key - b.key);
const CSS = `.mz-cut{--anatomy-paper:#c9ced3;--anatomy-face:#c9ced3;--anatomy-top:#c9ced3;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#c9ced3;--anatomy-shade-2:#c9ced3;--anatomy-shade-3:#c9ced3}
.mz-cut-w{--anatomy-paper:#b4bac0;--anatomy-shade-3:#b4bac0;--anatomy-top:#b4bac0}
.mz-cut-gk{--anatomy-paper:#8c9198;--anatomy-shade-3:#8c9198;--anatomy-top:#8c9198}
.mz-ss{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#ccd1d6;--anatomy-shade-1:#d5d9dd;--anatomy-shade-2:#dde1e4;--anatomy-shade-3:#e5e8ea}
.mz-weld{--anatomy-paper:#dfe2e5;--anatomy-face:#dfe2e5;--anatomy-top:#e9ebed;--anatomy-shade-0:#bcc2c8;--anatomy-shade-1:#c6cbd0;--anatomy-shade-2:#cfd3d7;--anatomy-shade-3:#d7dbde}
.mz-trim{--anatomy-paper:#f4f5f6;--anatomy-face:#f4f5f6;--anatomy-top:#fbfbfc;--anatomy-shade-0:#d6d9dc;--anatomy-shade-1:#dfe2e4;--anatomy-shade-2:#e7e9eb;--anatomy-shade-3:#eef0f1}
.mz-sub{--anatomy-paper:#dbe5ec;--anatomy-face:#dfe8ee;--anatomy-top:#e1eaf0;--anatomy-shade-0:#bccbd5;--anatomy-shade-1:#c5d3dc;--anatomy-shade-2:#cdd9e1;--anatomy-shade-3:#d5e0e7}
.mz-el{--anatomy-paper:#f3f7fa;--anatomy-face:#f3f7fa;--anatomy-top:#fbfdfe;--anatomy-shade-0:#c3d0d9;--anatomy-shade-1:#d0dbe2;--anatomy-shade-2:#dde5eb;--anatomy-shade-3:#e9eff3}
.mz-gasket{--anatomy-paper:#9aa0a6;--anatomy-face:#9aa0a6;--anatomy-top:#a6abb0;--anatomy-shade-0:#7f858b;--anatomy-shade-1:#878d93;--anatomy-shade-2:#90969c;--anatomy-shade-3:#979da3}
.mz-lance .tb-body{fill:#e8eaec}.mz-lance .tb-shine{fill:#f7f8f9}.mz-lance .tb-shade{fill:#cdd2d6}
.mz-lance-sub .tb-body{fill:#d3dee6}.mz-lance-sub .tb-shine{fill:#e6eef3}.mz-lance-sub .tb-shade{fill:#b6c6d1}
.mz-bore{fill:#a9b1b9;stroke:none}
.mz-bore-dark{fill:#6f7a84;stroke:none}
.mz-flujo{fill:none;stroke:#2f5f86;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.mz-flecha{fill:#2f5f86;stroke:none;opacity:.85}`;
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
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
const svg = k.figureSvg({ width: W, height: H, label: "Mezclador estático en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="mz-items">${groups.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Mezclador estático", theme: "light", width: 1100, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
{
  const elPt = (i, f, wf) => { const x = XE(i) + LE * f, w = GEO.W * wf, n = Nm(i, x, w); const side = G.dot3(n, V3) > 0 ? 1 : -1; return Pf(i, x, w, side); };
  Object.assign(ANCH, {
    BRIDA: [FL.t * 0.5, 0, FL.r - 12], BRIDA_OUT: [XL - FL.t * 0.5, 0, -(FL.r - 12)],
    TUBO: [560, 0, -(ri + ro) / 2], BOQUILLA: [xn + (rin + ron) / 2, 0, (ro + zH) / 2 + 6],
    BRIDA_CIEGA: [xn + NF.r - 9, 0, (zN + GK.t + NF.rfh + zBT) / 2], EMPAQUE: [xn - GK.ro + 2, 0, zN + GK.t / 2],
    EL_DER: elPt(2, 0.3, 0.75), EL_IZQ: elPt(3, 0.3, 0.75), JUNTA: [XE(5), 0, 0], CARA: [XL, -30, 30],
  });
}
writeFileSync(join(OUT, "mezclador_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
// la lanza va dentro del tubo: su doblez cae, en pantalla, sobre la silueta del hueco del tubo (pipe.in, que el audit
// toma por una barra porque es largo); no es una línea que se cruce con otra
if (!FAST) A.auditOrExit(R_, P, { crowd: [["lance", "pipe.in"]] });
