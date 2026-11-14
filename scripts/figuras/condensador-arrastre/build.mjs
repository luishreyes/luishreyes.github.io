/* ====================================================================
   El tren de condensación de un arrastre de vapor en isométrico (skill anatomy): el condensador vertical, el
   subenfriador de doble tubo y el florentino, unidos por sus líneas, con la persona de referencia de 1,75 m.
   - El condensador es un tubos y coraza vertical de un paso, con cabezales de bonete y placas de tubos fijas que se
     extienden como bridas. Va cortado por el plano vertical de su eje: se quita la mitad que mira al lector y se ven
     el haz de tubos, los deflectores segmentados (con sus ventanas a la izquierda y a la derecha), las dos placas de
     tubos (la de arriba con las bocas de los tubos), la cámara de arriba con la boquilla del vapor y la placa de
     choque, y la de abajo con el condensado, su nivel y el venteo sobre él. El vapor entra arriba y baja por los
     tubos; el agua de enfriamiento entra a la coraza abajo y sale arriba. Se apoya en dos orejas sobre una estructura.
   - El subenfriador son horquillas de doble tubo apiladas: adelante las bridas, los prensaestopas, las curvas del tubo
     interior y los puentes del ánulo; atrás los cabezales de retorno. Las ramas van partidas: en la rotura se ve la
     sección (el tubo exterior, el ánulo y el tubo interior). El condensado entra por la rama de arriba y baja; el agua
     entra por la de abajo y sube.
   - El florentino es el de ../florentino, dibujado por ../florentino/dibujo.mjs en la misma escena, con su eje en el
     origen. Su entrada recibe la línea que sube del subenfriador.
   Uso: node build.mjs [--audit] [--fast]
   Escribe out/fig.svg, out/fig.css, out/fig_data.json (cámara y puntos de los rótulos) y preview.html.
   Unidades: 1 = 1 mm (el audit, en centímetros). Medidas en geo.mjs.
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
const X = await import(join(HERE, "../florentino/xprism.mjs"));
const { dibujarFlorentino, puntosCamara, entradaCondensado, CSS_FL } = await import(join(HERE, "../florentino/dibujo.mjs"));
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const FAST = process.argv.includes("--fast");
const STEP = Number(process.env.CA_STEP || 0.5);
const CA = GEO.CA, DN = GEO.DN, E = CA.e, D = CA.d;
const AZ = CA.AZ, EL = CA.EL;

const XD = [1, 0, 0], YD = [0, 1, 0], ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const pol = (r, deg, z = 0) => [r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z];
const TMINUS = [-Math.sin(AZ * D2R), Math.cos(AZ * D2R), 0];   // hacia la izquierda de la pantalla, en el piso
const TPLUS = G.mul3(TMINUS, -1);
const radial = (deg) => [Math.cos(deg * D2R), Math.sin(deg * D2R), 0];
const tangent = (deg) => [-Math.sin(deg * D2R), Math.cos(deg * D2R), 0];
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)

/* ---------- las alturas del condensador ---------- */
const xE = E.x, yE = E.y, R = E.R, RO = E.R + E.tw, RF = E.RF, TS = E.ts;
const zTSb = E.zb, zS0 = E.zb + TS, zS1 = E.zb + E.L - TS, zTSt = zS1, zTop = E.zb + E.L;    // placas y coraza
const BN = E.bonnet, HD = E.head * 2 * R, HDO = HD + E.tw;
const zBF = zTSb - BN.flange, zBC = zBF - BN.cylB;               // cámara de abajo: brida y unión con el fondo
const zTF = zTop + BN.flange, zTC = zTF + BN.cylT;               // cámara de arriba: brida y unión con el fondo
const NV = DN[E.noz.vap], NC = DN[E.noz.cond], NW = DN[E.noz.cw], NVT = DN[E.noz.vent];
const headZ = (r, Rr, H) => H * Math.sqrt(Math.max(0, 1 - (r / Rr) ** 2));               // altura de un fondo 2:1 a radio r
const zVapNeck0 = zTC + headZ(NV.ro, RO, HDO), zVapNeck1 = zTC + HDO + E.neck.vap, zVapFl = zVapNeck1 + NV.ft;
const zCondNeck0 = zBC - headZ(NC.ro, RO, HDO), zCondNeck1 = zBC - HDO - E.neck.cond, zCondFl = zCondNeck1 - NC.ft;
const zLiq = zBF - E.level;
const BAF = Array.from({ length: E.baffle.n }, (_, i) => ({ z: zS0 + (zS1 - zS0 - (E.baffle.n - 1) * E.baffle.sp) / 2 + i * E.baffle.sp, win: i % 2 ? -1 : 1 }));
const UW = R - E.baffle.cut * 2 * R, RBF = R - E.baffle.gap / 2;
/* ---------- el subenfriador ---------- */
const legZ = (i) => D.z0 - i * D.dz;
const D65 = DN[65], D40 = DN[40], D32 = DN[32];
const xF = D.xF, xFL = xF - D65.ft;                              // cara de la brida de adelante y dónde termina el tubo
const xGl0 = xF + D65.ft, xGl1 = xGl0 + D.gland.body, xG = xGl1 + D.gland.nut;   // prensaestopas: cuerpo, tuerca, cara
const xBrk1 = xF - D.front, xBrk0 = xBrk1 - D.gap, xB = xBrk0 - D.back;   // la rotura y la cara del cabezal de retorno
const xH0 = xB - D.housing.len;
const yD = D.y;
const IN = entradaCondensado();
/* la línea que sube al florentino: del subenfriador al pie del tubo, de ahí a la entrada */
const xR = IN.cara[0] + IN.dir[0] * ((yD - IN.cara[1]) / IN.dir[1]);

const W = 1000, H = 1200;
const EXT = puntosCamara(G);
for (let d = 0; d < 360; d += 30) EXT.push(G.add3([xE, yE, 0], pol(RF + 60, d, zTSb - 300)), G.add3([xE, yE, 0], pol(RF, d, zTop)));
EXT.push([xE - 1100, yE, zVapFl + 420], [xE - 1100, yE, zVapFl + 220], [xE, yE, zVapFl + 360]);
{ const nE0 = [Math.cos(AZ * D2R), Math.sin(AZ * D2R), 0]; for (const [u, n] of [[-E.stand.du - 100, E.stand.n - 100], [E.stand.du + 100, E.stand.n - 100], [E.stand.du + 100, 100], [-E.stand.du - 100, 100]]) EXT.push([xE + u * TPLUS[0] + n * nE0[0], yE + u * TPLUS[1] + n * nE0[1], 0]); }
for (const i of [0, D.legs - 1]) EXT.push([xH0 - 20, yD - 80, legZ(i) + 120], [xH0 - 20, yD + 80, legZ(i) - 120], [xG + 200, yD + 80, legZ(i)]);
EXT.push([xH0, yD - 300, 0], [xH0, yD + 150, 0], [xG + 200, yD + 150, 0], [xH0, yD - 420, legZ(0)]);
EXT.push([CA.persona.x - 300, CA.persona.y - 300, 0], [CA.persona.x + 300, CA.persona.y + 300, 0], [CA.persona.x, CA.persona.y, 1800]);
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso

/* El dibujo va en milímetros; el audit, en centímetros (como el florentino). */
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

/* ---------- superficies con tonos suaves (las del florentino) ---------- */
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
/* una superficie de dos curvaturas (los fondos 2:1), en franjas de f; en cada franja los tramos del mismo tono van
   juntos y el borde entre dos tonos se busca por bisección a cada lado de la franja (la del doble tubo, con el
   intervalo de f como parámetro) */
function surface2(P3, N3, f0, f1, nf, nu, out) {
  const cls = (f, u) => { const n = N3(f, u); return G.dot3(n, V3) <= 1e-4 ? -1 : BAND(G.dot3(n, L3)); };
  for (let i = 0; i < nf; i++) {
    const fa = f0 + ((f1 - f0) * i) / nf, fb = f0 + ((f1 - f0) * (i + 1)) / nf, fm = (fa + fb) / 2;
    const runs = [];
    for (let j = 0; j < nu; j++) { const band = cls(fm, (j + 0.5) / nu); if (!runs.length || runs[runs.length - 1].band !== band) runs.push({ band, j0: j }); }
    const edge = (f) => {
      const M = nu * 4, smp = []; for (let q = 0; q < M; q++) smp.push(cls(f, (q + 0.5) / M));
      const tr = []; for (let q = 1; q < M; q++) if (smp[q] !== smp[q - 1]) tr.push({ a: smp[q - 1], b: smp[q], q });
      const cuts = [0];
      for (let r = 1; r < runs.length; r++) {
        const j = runs[r].j0, Aa = runs[r - 1].band, Bb = runs[r].band; let best = null;
        for (const t of tr) if (t.a === Aa && t.b === Bb && (!best || Math.abs(t.q / M - j / nu) < Math.abs(best.q / M - j / nu))) best = t;
        let c = j / nu;
        if (best && Math.abs(best.q / M - j / nu) < 3 / nu) { let lo = (best.q - 0.5) / M, hi = (best.q + 0.5) / M; for (let it = 0; it < 20; it++) { const m = (lo + hi) / 2; if (cls(f, m) === Aa) lo = m; else hi = m; } c = (lo + hi) / 2; }
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
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: XD, v: YD });
const F0 = FZ();
const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
const cylN = (sg) => (f) => [sg * Math.cos(f), sg * Math.sin(f), 0];
const arcPts = (r, z, f0, f1, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t), z]; });
const fS = (AZ - 90) * D2R + TAU;                      // la silueta de la derecha de un cilindro vertical
const mirror = (poly) => poly.map(([x, z]) => [-x, z]).reverse();
const cutStore = [];        // las caras del corte del florentino (y = 0)
const DEFS = [];
const circ = (F, s, r, n = 40) => Array.from({ length: n }, (_, i) => G.pointOf(F, s, r, (i / n) * TAU));
const boreOn = (rc, deg, z, rh, cls) => `<path class="${cls}" d="${pth1(Array.from({ length: 36 }, (_, i) => { const t = (i / 36) * TAU, f = deg * D2R + (rh * Math.cos(t)) / rc; return pr([rc * Math.cos(f), rc * Math.sin(f), z + rh * Math.sin(t)]); }))}"/>`;
const halfRing = (r0, r1, n = 36) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
};
const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
const add = G.add3, mul = G.mul3;

/* ====================================================================
   0 · el florentino, tal como lo dibuja ../florentino/dibujo.mjs
   ==================================================================== */
dibujarFlorentino({ A, G, P, at, Ln, Dots, path3, V3, HV, pr, r10, pth1, put, record, box, fp, turned, disc, tubeItems, ball, entry, saddle,
  surface, toned, circ, boreOn, DEFS, ANCH, cutStore });

/* ====================================================================
   1 · el condensador, cortado por el plano vertical de su eje que mira de frente al lector: se quita la mitad de
   adelante. Coordenadas propias: u a lo largo del corte (hacia la derecha de la pantalla), n hacia el lector, z
   ==================================================================== */
const uE = TPLUS, nE = [Math.cos(AZ * D2R), Math.sin(AZ * D2R), 0];
const eW = (u, n, z) => [xE + u * uE[0] + n * nE[0], yE + u * uE[1] + n * nE[1], z];
const dE = (deg) => add(mul(uE, Math.cos(deg * D2R)), mul(nE, Math.sin(deg * D2R)));      // hacia afuera, a deg de u
const tE = (deg) => add(mul(uE, -Math.sin(deg * D2R)), mul(nE, Math.cos(deg * D2R)));
const ePol = (r, deg, z) => eW(r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z);
const FE = { o: [xE, yE, 0], a: ZD3, u: uE, v: nE };             // el eje; halfRing (v ≤ 0) da la mitad de atrás
const FYE = { o: [xE, yE, 0], a: nE, u: uE, v: ZD3 };            // el plano del corte: sección (u, z), espesor a lo largo de n
const FRONT_E = A.orientedBox(eW(0, 3000, 4000), [nE, uE, ZD3], [3000, 9000, 9000]);
const cutE = [];                                                  // caras del corte: { owner, poly (u, z), cls }
const cP = (r, z0, z1) => (f, u) => eW(r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u);
const cN = (sg) => (f) => mul(dE(f / D2R), sg);
const eArc = (r, z, f0, f1, n = 72) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return eW(r * Math.cos(t), r * Math.sin(t), z); });
const eBore = (rc, deg, z, rh, cls) => `<path class="${cls}" d="${pth1(Array.from({ length: 36 }, (_, i) => { const t = (i / 36) * TAU, f = deg * D2R + (rh * Math.cos(t)) / rc; return pr(eW(rc * Math.cos(f), rc * Math.sin(f), z + rh * Math.sin(t))); }))}"/>`;
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
// la ventana del corte entre zA y zB: lo que se ve por el plano del corte, proyectado a lo largo de la mirada
function ventana(id, zA, zB, r = R) {
  const win = [[-r, zA], [r, zA], [r, zB], [-r, zB]].map(([u, z]) => eW(u, 0, z));
  DEFS.push(`<clipPath id="${id}"><path d="${pth1(win.map(pr))}"/></clipPath>`);
  const prism = A.prism(FV, win.map((p) => [G.dot3(p, CAM.R), G.dot3(p, CAM.D)]), -90000, 90000);
  return A.box([-90000, -90000, -90000], [90000, 90000, 90000], { cut: [prism] });
}
// los anfitriones macizos de las boquillas (no se registran): la coraza y la cámara de abajo
const SHELL_SOLID = A.body(FE, [[zS0, 0], [zS0, RO], [zS1, RO], [zS1, 0]], { name: "e.shell.macizo" });
const BON_B_SOLID = A.body(FE, [[zBC, 0], [zBC, RO], [zBF, RO], [zBF, 0]], { name: "e.bonB.macizo" });
const cwIn = E.cw.in, cwOut = E.cw.out, zCwIn = zS0 + cwIn.dz, zCwOut = zS1 - cwOut.dz, zVent = zBF - E.vent.dz;
const nozHole = (deg, z, r) => A.disc({ o: [xE, yE, z], a: dE(deg), u: tE(deg), v: ZD3 }, 0, 1200, r - 1);

/* una pared cilíndrica cortada: la cara de adentro de la mitad de atrás (recortada a la ventana del corte) y las caras
   del corte */
function wall(name, zA, zB, { holes = [], bores = "", owner = "e" } = {}) {
  const id = "caWin" + name.replace(/\W/g, "");
  const clip = ventana(id, zA, zB);
  const inner = toned((o) => surface(cP(R, zA, zB), cN(-1), PI, TAU, 140, 1, o), "ca-in");
  const seams = Ln(path3(eArc(R - 0.5, zA + 4, PI, TAU, 120)), { tone: "faint" });
  put(`${name}.in`, eW(0, -R * 0.75, (zA + zB) / 2), `<g clip-path="url(#${id})">${inner}${seams}${bores}</g>`, [record(A.body(FE, [[zA, R], [zB, R], [zB, RO], [zA, RO]], { name: `${name}.in`, owner, cut: [FRONT_E, ...holes, clip] }))]);
  cutE.push({ owner, poly: rect(R, zA, RO, zB), cls: "ca-cut" }, { owner, poly: rect(-RO, zA, -R, zB), cls: "ca-cut" });
}
/* un fondo 2:1 cortado: la cara de adentro de la mitad de atrás y las caras del corte (el meridiano). dir: +1 arriba,
   −1 abajo; zc: la unión con el cilindro; rh: el radio de la boca de la boquilla */
function head(name, zc, dir, rh, { owner = "e" } = {}) {
  const a0 = Math.acos(rh / R);                                  // del ecuador (a = 0) a la boca (a = a0)
  const Pin = (f, u) => { const a = a0 * u; return eW(R * Math.cos(a) * Math.cos(f), R * Math.cos(a) * Math.sin(f), zc + dir * HD * Math.sin(a)); };
  const Nin = (f, u) => { const a = a0 * u, d = dE(f / D2R); return mul(G.unit3(add(mul(d, Math.cos(a) / R), [0, 0, (dir * Math.sin(a)) / HD])), -1); };
  const svg = toned((o) => surface2(Pin, Nin, PI, TAU, 72, 10, o), "ca-in");
  const NA = 16, mer = [], merO = [];
  for (let i = 0; i <= NA; i++) { const r = R - ((R - rh) * i) / NA; mer.push([zc + dir * headZ(r, R, HD), r]); }
  for (let i = NA; i >= 0; i--) { const r = RO - ((RO - rh) * i) / NA; merO.push([zc + dir * headZ(r, RO, HDO), r]); }
  const poly = [...mer, ...merO];
  put(`${name}.in`, eW(0, -R * 0.6, zc + dir * HD * 0.5), svg, [record(A.body(FE, poly, { name: `${name}.in`, owner, cut: [FRONT_E] }))]);
  const side = [...mer.map(([z, r]) => [r, z]), ...merO.slice().reverse().map(([z, r]) => [r, z])];
  cutE.push({ owner, poly: side, cls: "ca-cut" }, { owner, poly: side.map(([u, z]) => [-u, z]), cls: "ca-cut" });
}

/* 1a · la cámara de abajo: el fondo con la boquilla del condensado, el cilindro con el venteo, la brida */
{
  head("e.headB", zBC, -1, NC.ro);
  wall("e.bonB", zBC, zBF, { holes: [nozHole(E.vent.deg, zVent, NVT.ro)], bores: eBore(R - 0.4, E.vent.deg, zVent, NVT.ri, "ca-bore-dk") });
  fp("e.bonB.flange", FE, halfRing(R, RF, 64), zBF, zTSb, {}, { owner: "e", cls: "ca-ss" });
  cutE.push({ owner: "e", poly: rect(R, zBF, RF, zTSb), cls: "ca-cut" }, { owner: "e", poly: rect(-RF, zBF, -R, zTSb), cls: "ca-cut" });
  // la boquilla del condensado: el cuello y su brida, cortados; la brida de la línea, entera
  {
    const svg = toned((o) => surface(cP(NC.ri, zCondNeck1, zCondNeck0), cN(-1), PI, TAU, 24, 1, o), "ca-in");
    put("e.cond.neck", eW(0, -NC.ri * 0.7, (zCondNeck0 + zCondNeck1) / 2), svg, [record(A.prism(FE, halfRing(NC.ri, NC.ro, 32), zCondNeck1, zCondNeck0 + 2, { name: "e.cond.neck", owner: "e" }))]);
  }
  fp("e.cond.fl", FE, halfRing(NC.ri, NC.fl, 32), zCondFl, zCondNeck1, {}, { owner: "e", cls: "ca-ss" });
  cutE.push({ owner: "e", poly: rect(NC.ri, zCondNeck1, NC.ro, zCondNeck0 + 2), cls: "ca-cut" }, { owner: "e", poly: rect(-NC.ro, zCondNeck1, -NC.ri, zCondNeck0 + 2), cls: "ca-cut" });
  cutE.push({ owner: "e", poly: rect(NC.ri, zCondFl, NC.fl, zCondNeck1), cls: "ca-cut" }, { owner: "e", poly: rect(-NC.fl, zCondFl, -NC.ri, zCondNeck1), cls: "ca-cut" });
  disc("e.cond.fl2", FE, zCondFl - NC.ft, zCondFl, NC.fl, {}, { owner: "lc1", cls: "ca-cast" });
  ANCH.E_SALIDA = eW(NC.fl, 0, zCondFl - NC.ft / 2);
}

/* 1b · las placas de tubos, la coraza y los pernos de las dos uniones de bridas */
const TUBES = [];   // { u, n, row } de cada tubo (centro), en el triángulo, con las filas paralelas al corte
{
  const p = E.tube.p, dy = p * Math.sin(PI / 3), rmax = E.tube.Rb - E.tube.ro;
  for (let j = 0; j < 40; j++) {
    const nn = -(j + 0.5) * dy;
    if (-nn > rmax) break;
    for (let i = -12; i <= 12; i++) { const uu = (i + (j % 2) / 2) * p; if (uu * uu + nn * nn <= rmax * rmax) TUBES.push({ u: uu, n: nn, row: j }); }
  }
}
const tubeF = (t) => ({ o: eW(t.u, t.n, 0), a: ZD3, u: uE, v: nE });
{
  fp("e.tsB", FE, halfRing(0, RF, 96), zTSb, zS0, {}, { owner: "e", cls: "ca-ss" });
  cutE.push({ owner: "e", poly: rect(-RF, zTSb, RF, zS0), cls: "ca-cut" });
  const mouths = TUBES.map((t) => pth1(circ(tubeF(t), zTop + 0.3, E.tube.ro, 20).map(pr))).join("");
  const bores = TUBES.map((t) => pth1(circ(tubeF(t), zTop + 0.4, E.tube.ri, 20).map(pr))).join("");
  fp("e.tsT", FE, halfRing(0, RF, 96), zTSt, zTop, {}, { owner: "e", cls: "ca-ss", extra: `<path class="ca-tubo-boca" d="${mouths}"/><path class="ca-bore-dk" d="${bores}"/>` });
  cutE.push({ owner: "e", poly: rect(-RF, zTSt, RF, zTop), cls: "ca-cut" });
  ANCH.E_PLACA_T = eW(-60, -40, zTop);
  ANCH.E_PLACA_B = eW(-RF * 0.92, 0, (zTSb + zS0) / 2);
  const holes = [nozHole(cwIn.deg, zCwIn, NW.ro), nozHole(cwOut.deg, zCwOut, NW.ro)];
  const bores2 = eBore(R - 0.4, cwIn.deg, zCwIn, NW.ri, "ca-bore-dk") + eBore(R - 0.4, cwOut.deg, zCwOut, NW.ri, "ca-bore-dk");
  wall("e.shell", zS0, zS1, { holes, bores: bores2 });
  ANCH.E_CORAZA = eW(-RO, 0, zS0 + 520);
  const Bt = E.bonnet.bolts;
  for (let q = 0; q < Bt.n / 2; q++) {
    const deg = 180 + 180 / Bt.n + (360 / Bt.n) * q, c = ePol(Bt.bc, deg, 0), F = FZ(c[0], c[1], 0), rot = deg * D2R - AZ * D2R;
    fp(`e.nutB${q}`, F, HEX(hexR(Bt.af), rot), zS0, zS0 + Bt.h, {}, { owner: "e", cls: "ca-trim" });
    fp(`e.nutBb${q}`, F, HEX(hexR(Bt.af), rot), zBF - Bt.h, zBF, {}, { owner: "e", cls: "ca-trim" });
    fp(`e.nutT${q}`, F, HEX(hexR(Bt.af), rot), zTF, zTF + Bt.h, {}, { owner: "e", cls: "ca-trim" });
    fp(`e.nutTb${q}`, F, HEX(hexR(Bt.af), rot), zTSt - Bt.h, zTSt, {}, { owner: "e", cls: "ca-trim" });
  }
}

/* 1c · los deflectores y el haz de tubos (las dos filas que se ven por el corte, en tramos entre deflectores) */
{
  const bt = E.baffle.t / 2;
  BAF.forEach((b, i) => {
    // medio disco sin la ventana: a la derecha (win = +1, u > UW) o a la izquierda (win = −1)
    const ta = b.win > 0 ? PI : PI + Math.acos(UW / RBF), tb = b.win > 0 ? TAU - Math.acos(UW / RBF) : TAU;
    const poly = [];
    for (let q = 0; q <= 40; q++) { const t = ta + ((tb - ta) * q) / 40; poly.push([RBF * Math.cos(t), RBF * Math.sin(t)]); }
    poly.push(b.win > 0 ? [UW, 0] : [-UW, 0]);
    const clean = poly.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
    fp(`e.baffle${i}`, FE, clean, b.z - bt, b.z + bt, {}, { owner: "e", cls: "ca-ss" });
    const [ua, ub] = b.win > 0 ? [-RBF, UW] : [-UW, RBF];
    cutE.push({ owner: `e.baffle${i}`, poly: rect(ua, b.z - bt, ub, b.z + bt), cls: "ca-cut" });
  });
  ANCH.E_DEFLECTOR = eW(-RBF * 0.55, 0, BAF[1].z);
  ANCH.E_VENTANA = eW((UW + R) / 2, -10, BAF[0].z);
  const cuts = [zS0, ...BAF.flatMap((b) => [b.z - bt, b.z + bt]), zS1];
  const sec16 = Array.from({ length: 16 }, (_, i) => { const a = (TAU * i) / 16; return [E.tube.ro * Math.cos(a), E.tube.ro * Math.sin(a)]; });
  for (let s = 0; s < cuts.length; s += 2) {
    const z0 = cuts[s], z1 = cuts[s + 1];
    for (const row of [1, 0]) {
      const ts = TUBES.filter((t) => t.row === row);
      const svg = ts.map((t) => X.prismSvg(C, sec16, z0, z1, { F: tubeF(t), tone: "mid" })).join("");
      const shapes = ts.map((t) => A.disc(tubeF(t), z0, z1, E.tube.ro, { name: `e.tubos${s / 2}.${row}`, owner: "e.haz" }));
      shapes.forEach(record);
      put(`e.tubos${s / 2}.${row}`, eW(0, -10 - row * 20, (z0 + z1) / 2), wrap(svg, "ca-tubo"), shapes);
    }
  }
  ANCH.E_TUBOS = eW(3.5 * E.tube.p, -1, (BAF[2].z + BAF[3].z) / 2);
}

/* 1d · la cámara de arriba: la brida, el cilindro, el fondo con la boquilla del vapor y la placa de choque */
{
  fp("e.bonT.flange", FE, halfRing(R, RF, 64), zTop, zTF, {}, { owner: "e", cls: "ca-ss" });
  cutE.push({ owner: "e", poly: rect(R, zTop, RF, zTF), cls: "ca-cut" }, { owner: "e", poly: rect(-RF, zTop, -R, zTF), cls: "ca-cut" });
  wall("e.bonT", zTF, zTC);
  head("e.headT", zTC, 1, NV.ro);
  {
    const svg = toned((o) => surface(cP(NV.ri, zVapNeck0, zVapNeck1), cN(-1), PI, TAU, 48, 1, o), "ca-in");
    put("e.vap.neck", eW(0, -NV.ri * 0.7, (zVapNeck0 + zVapNeck1) / 2), svg, [record(A.prism(FE, halfRing(NV.ri, NV.ro, 40), zVapNeck0, zVapNeck1, { name: "e.vap.neck", owner: "e" }))]);
  }
  fp("e.vap.fl", FE, halfRing(NV.ri, NV.fl, 48), zVapNeck1, zVapFl, {}, { owner: "e", cls: "ca-ss" });
  cutE.push({ owner: "e", poly: rect(NV.ri, zVapNeck0, NV.ro, zVapNeck1), cls: "ca-cut" }, { owner: "e", poly: rect(-NV.ro, zVapNeck0, -NV.ri, zVapNeck1), cls: "ca-cut" });
  cutE.push({ owner: "e", poly: rect(NV.ri, zVapNeck1, NV.fl, zVapFl), cls: "ca-cut" }, { owner: "e", poly: rect(-NV.fl, zVapNeck1, -NV.ri, zVapFl), cls: "ca-cut" });
  ANCH.E_CAMARA_T = eW(-R * 0.55, -60, zTF + 70);
  // la placa de choque: un platillo bajo la boca, colgado de dos barras (la tercera se fue con el corte)
  const I = E.imp, zi1 = zTC + headZ(NV.ri, R, HD) - I.gap, zi0 = zi1 - I.t;
  fp("e.imp", FE, halfRing(0, I.r, 48), zi0, zi1, {}, { owner: "e.imp", cls: "ca-in" });
  cutE.push({ owner: "e.imp", poly: rect(-I.r, zi0, I.r, zi1), cls: "ca-cut" });
  [225, 315].forEach((deg, i) => {
    const c = ePol(I.r - 14, deg, 0), ztop = zTC + headZ(I.r - 14 + 5, R, HD) - 0.3;
    disc(`e.imp.bar${i}`, FZ(c[0], c[1], 0), zi1, ztop, 5, {}, { owner: "e.imp", cls: "ca-in", n: 12 });
  });
  ANCH.E_CHOQUE = eW(I.r * 0.55, 0, (zi0 + zi1) / 2);
  disc("e.vap.fl2", FE, zVapFl, zVapFl + NV.ft, NV.fl, {}, { owner: "lv", cls: "ca-cast", extra: Dots(G.dotsOf(FE, zVapFl + NV.ft, NV.bc, NV.nb, P, { all: true, phase: PI / 8 }), { size: 0.6 }) });
}

/* 1e · el condensado en la cámara de abajo (translúcido: la cara del corte y su superficie) y las gotas que caen de
   las bocas de los tubos */
{
  const NA = 18, bowl = [];
  for (let i = 0; i <= NA; i++) { const r = NC.ri + ((R - NC.ri) * i) / NA; bowl.push([r, zBC - headZ(r, R, HD)]); }
  const faceR = [[NC.ri, zCondFl], ...bowl, [R, zLiq]];
  const face = [...faceR, ...faceR.slice().reverse().map(([u, z]) => [-u, z])];
  const facePath = pth1(face.map(([u, z]) => pr(eW(u, -0.4, z))));
  const thin = A.prism(FYE, face, -0.7, -0.4, { name: "e.agua.corte", owner: "liquido.e" });
  put("e.agua.corte", eW(0, 0, (zBC + zLiq) / 2), `<g class="ca-agua"><path class="ca-agua-cara" d="${facePath}"/>${Ln(path3([eW(-R, -0.4, zLiq), eW(R, -0.4, zLiq)]), { tone: "lo" })}</g>`, [thin]);
  const surf = halfRing(0, R - 0.5, 96).map(([u, v]) => eW(u, v - 0.4, zLiq));
  put("e.agua.sup", eW(0, -R * 0.5, zLiq), `<g class="ca-agua"><path class="ca-agua-sup" d="${pth1(surf.map(pr))}"/></g>`, [A.prism(FE, halfRing(0, R - 0.5, 48).map(([u, v]) => [u, v - 0.4]), zLiq - 0.3, zLiq, { name: "e.agua.sup", owner: "liquido.e" })]);
  ANCH.E_NIVEL = eW(-R * 0.5, -0.4, zLiq);
  let dG = "";
  const shapes = [];
  TUBES.filter((t) => t.row === 0).forEach((t, i) => {
    for (let q = 0; q < 2; q++) {
      const z = zTSb - 30 - ((i * 37 + q * 83) % (zTSb - zLiq - 60)), rr = 4;
      if (z < zLiq + 12) continue;
      const c = eW(t.u, t.n, z);
      dG += pth1(Array.from({ length: 12 }, (_, j) => { const a = (TAU * j) / 12; return pr(add(c, add(mul(uE, rr * Math.cos(a) * 0.8), [0, 0, rr * Math.sin(a) * (Math.sin(a) > 0 ? 1.3 : 0.9)]))); }));
      shapes.push(A.ball(c, rr, { name: "e.gotas", owner: "liquido.e" }));
    }
  });
  put("e.gotas", eW(0, -10, (zTSb + zLiq) / 2), `<path class="ca-gota-agua" d="${dG}"/>`, shapes);
}

/* 1f · las boquillas del agua (entra abajo a la izquierda, sale arriba a la derecha) y el venteo de la cámara de abajo */
function nozzle(name, host, deg, z, d, neck, { owner } = {}) {
  const F = { o: [xE, yE, z], a: dE(deg), u: tE(deg), v: ZD3 }, s1 = RO + neck;
  saddle(`${name}.neck`, F, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, {}, { owner: owner ?? name, cls: "ca-ss", hosts: [host] });
  disc(`${name}.fl`, F, s1, s1 + d.ft, d.fl, {}, { owner: owner ?? name, cls: "ca-ss" });
  return { F, s: s1 + d.ft };
}
// válvula de bola bridada con palanca (la del florentino): F.a es el sentido del flujo y la cara de entrada está en s0
function ballValve(name, F, s0, d, { open = false, stem = null, Lv = 150, flip = false, lever = 160 } = {}) {
  const ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, {}, { owner: name, cls: "ca-cast" });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, {}, { owner: name, cls: "ca-cast" });
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, {}, { owner: name, cls: "ca-cast" });
  const st = stem || G.unit3(G.cross3(F.a, Math.abs(F.a[2]) > 0.9 ? HV : ZD3));
  const c = add(F.o, mul(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  const rn = Math.max(9, d.ro * 0.75);
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - rn * rn) - 2, r1 + 26, rn, {}, { owner: name, cls: "ca-cast" });
  disc(`${name}.stem`, FS, r1 + 26, r1 + 36, 6, {}, { owner: name, cls: "ca-trim", n: 16 });
  const lv0 = open ? F.a : G.unit3(G.cross3(st, F.a)), lv = flip ? mul(lv0, -1) : lv0;
  const FLv = { o: add(c, mul(st, r1 + 36)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
  fp(`${name}.lever`, FLv, [[0, -9], [5, -9], [5, 9], [0, 9]], -14, lever, {}, { owner: name, cls: "ca-lever" });
  return { end: add(F.o, mul(F.a, s1)), body: c, r1, s1 };
}
// el final de una línea que sigue fuera de la figura: el par de bridas (la de la línea que llega y la de la que sigue)
function flangePair(name, F, s, d, { owner = name } = {}) {
  disc(`${name}.fa`, F, s, s + d.ft, d.fl, {}, { owner, cls: "ca-pipe" });
  disc(`${name}.fb`, F, s + d.ft, s + 2 * d.ft, d.fl, {}, { owner, cls: "ca-cast", extra: G.dot3(F.a, V3) > 0.1 ? Dots(G.dotsOf(F, s + 2 * d.ft, d.bc, d.nb, P, { all: true, phase: PI / d.nb }), { size: 0.5 }) : "" });
  return add(F.o, mul(F.a, s + 2 * d.ft));
}
{
  const a = nozzle("e.cwin", SHELL_SOLID, cwIn.deg, zCwIn, NW, E.neck.cw);
  disc("e.cwin.fl2", a.F, a.s, a.s + NW.ft, NW.fl, {}, { owner: "e.cwin", cls: "ca-cast" });
  const s0 = a.s + NW.ft, s1 = s0 + 260;
  tubeItems("e.cwin.pipe", [G.pointOf(a.F, s0, 0, 0), G.pointOf(a.F, s1, 0, 0)], NW.ro, { cls: "ca-pipe" });
  flangePair("e.cwin.end", a.F, s1, NW);
  ANCH.CW_IN = add(G.pointOf(a.F, (s0 + s1) / 2, 0, 0), [0, 0, -NW.ro]);
  const b = nozzle("e.cwout", SHELL_SOLID, cwOut.deg, zCwOut, NW, E.neck.cw);
  disc("e.cwout.fl2", b.F, b.s, b.s + NW.ft, NW.fl, {}, { owner: "e.cwout", cls: "ca-cast" });
  const t0 = b.s + NW.ft, t1 = t0 + 220;
  tubeItems("e.cwout.pipe", [G.pointOf(b.F, t0, 0, 0), G.pointOf(b.F, t1, 0, 0)], NW.ro, { cls: "ca-pipe" });
  flangePair("e.cwout.end", b.F, t1, NW);
  ANCH.CW_OUT = add(G.pointOf(b.F, (t0 + t1) / 2, 0, 0), [0, 0, NW.ro]);
  const v = nozzle("e.vent", BON_B_SOLID, E.vent.deg, zVent, NVT, E.neck.vent);
  const vv = ballValve("e.vent.valve", v.F, v.s, NVT, { open: true, stem: ZD3, Lv: 110, lever: 110 });
  const u0 = vv.s1, u1 = u0 + 140;
  tubeItems("e.vent.pipe", [G.pointOf(v.F, u0, 0, 0), G.pointOf(v.F, u1, 0, 0)], NVT.ro, { cls: "ca-pipe" });
  flangePair("e.vent.end", v.F, u1, NVT);
  ANCH.E_VENTEO = add(vv.body, [0, 0, -vv.r1 * 0.8]);
}

/* 1g · las orejas de apoyo y la estructura: dos columnas detrás, una viga entre ellas y dos ménsulas hacia adelante,
   bajo las orejas */
{
  const LG = E.lug, ST = E.stand, zl0 = ST.top, zl1 = zl0 + LG.h, c = ST.col / 2, b = ST.beam;
  LG.degs.forEach((deg, i) => {
    const ax = dE(deg), tg = tE(deg), Fl = { o: [xE, yE, 0], a: ax, u: tg, v: ZD3 };
    const rEnd = ST.du / Math.abs(Math.cos(deg * D2R)) + 40;
    const r0 = RO;
    fp(`e.lug${i}.base`, Fl, rect(-LG.w / 2, zl0, LG.w / 2, zl0 + LG.t), r0, rEnd, {}, { owner: `e.lug${i}`, cls: "ca-ss" });
    [-1, 1].forEach((sg, j) => {
      const uu = sg * (LG.w / 2 - LG.t / 2 - 8), rIn = Math.sqrt(RO * RO - (Math.abs(uu) + LG.t / 2) ** 2) - 0.5;
      const Fg = { o: [xE, yE, 0], a: tg, u: ax, v: ZD3 };
      fp(`e.lug${i}.g${j}`, Fg, [[rIn, zl0 + LG.t], [rEnd - 4, zl0 + LG.t], [rEnd - 4, zl0 + LG.t + 40], [rIn, zl1]], uu - LG.t / 2, uu + LG.t / 2, {}, { owner: `e.lug${i}`, cls: "ca-ss" });
    });
  });
  ANCH.E_OREJA = ePol(ST.du / Math.abs(Math.cos(LG.degs[1] * D2R)) + 10, LG.degs[1], zl0 + 50);
  const FcolAt = (u, n) => ({ o: eW(u, n, 0), a: ZD3, u: uE, v: nE });
  [-1, 1].forEach((sg, i) => {
    const u = sg * ST.du, n = ST.n;
    fp(`stand.e.base${i}`, FcolAt(u, n), rect(-c - 40, -c - 40, c + 40, c + 40), 0, 14, {}, { owner: `e.st${i}`, cls: "ca-paint" });
    fp(`e.col${i}`, FcolAt(u, n), rect(-c, -c, c, c), 14, zl0 - b, {}, { owner: `e.st${i}`, cls: "ca-paint" });
    // la ménsula: de la columna hacia adelante, bajo la oreja, con su cartela
    fp(`e.arm${i}`, { o: eW(u, 0, 0), a: nE, u: uE, v: ZD3 }, rect(-c, zl0 - b, c, zl0), n + c, ST.nArm, {}, { owner: `e.st${i}`, cls: "ca-paint" });
    fp(`e.knee${i}`, { o: eW(u, 0, 0), a: uE, u: nE, v: ZD3 }, [[n + c, zl0 - b - 520], [n + c, zl0 - b], [n + c + 420, zl0 - b]], -12, 12, {}, { owner: `e.st${i}`, cls: "ca-paint" });
  });
  fp("e.beamB", { o: eW(0, ST.n, 0), a: uE, u: nE, v: ZD3 }, rect(-c, zl0 - b, c, zl0), -ST.du - c, ST.du + c, {}, { owner: "e.st0", cls: "ca-paint" });
  ANCH.E_ESTRUCTURA = eW(ST.du + c, ST.n, 1100);
}

/* 1h · las flechas: el vapor baja por la boquilla, la placa de choque lo abre y entra a los tubos; el agua sube en
   zigzag por las ventanas de los deflectores */
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
function arrows(list, toW, rf) {
  for (const [nm, cls, ctl] of list) {
    const pts = smooth(ctl).map(([a, z]) => toW(a, z));
    const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[n - 4], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
    const h = 6.5, w = 3.2, base = [b[0] - ux * h, b[1] - uy * h];
    const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
    const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
    const headD = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
    put(nm, pts[Math.floor(pts.length / 2)], `<path class="${cls}" d="${line}"/><path class="${cls}-p" d="${headD}"/>`, [A.tube(pts, rf), A.ball(pts[pts.length - 1], Math.max(rf, w / G.scaleOf(P)))]);
  }
}
{
  const zi = zTC + headZ(NV.ri, R, HD) - E.imp.gap - E.imp.t;
  arrows([
    ["e.flujo.v0", "ca-vapor", [[0, zVapFl - 20], [0, zi + E.imp.t + 18]]],
    ["e.flujo.v1", "ca-vapor", [[40, zi + E.imp.t + 14], [110, zi + 24], [E.imp.r + 22, zi - 8], [E.imp.r + 10, zTop + 30]]],
    ["e.flujo.v2", "ca-vapor", [[-40, zi + E.imp.t + 14], [-110, zi + 24], [-E.imp.r - 22, zi - 8], [-E.imp.r - 10, zTop + 30]]],
  ], (u, z) => eW(u, -14, z), 6);
  const ctl = [[-R + 30, zS0 + 60]];
  BAF.forEach((b) => { ctl.push([b.win * (R - 70), b.z - 70]); ctl.push([b.win * (R - 60), b.z + 70]); });
  ctl.push([R - 30, zS1 - 60]);
  arrows([["e.flujo.cw", "ca-agua-flujo", ctl]], (u, z) => eW(u, -0.5, z), 0.3);
}

/* ====================================================================
   2 · el subenfriador de doble tubo
   ==================================================================== */
const FXa = (y, z) => ({ o: [0, y, z], a: XD, u: YD, v: ZD3 });   // a lo largo de x: sección en (y, z)
const STAD = (w, h, r) => {                                         // un estadio (rectángulo de puntas redondas) en (u, v), alto en v
  const pts = [], n = 10;
  for (let i = 0; i <= n; i++) { const t = -PI / 2 + (PI * i) / n; pts.push([w / 2 - r + r * Math.cos(t), h / 2 - r + r * Math.sin(t) + 0]); }
  pts.length = 0;
  const corners = [[w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, PI / 2], [-w / 2 + r, -h / 2 + r, PI], [w / 2 - r, -h / 2 + r, 1.5 * PI]];
  for (const [cx, cy, a0] of corners) for (let i = 0; i <= n; i++) { const t = a0 + ((PI / 2) * i) / n; pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]); }
  return pts;
};
{
  for (let i = 0; i < D.legs; i++) {
    const z = legZ(i), F = FXa(yD, z), own = `d.leg${i}`;
    // el tramo de adelante, la brida, la brida del prensaestopas, su cuerpo y su tuerca
    turned(`${own}.front`, F, [[xBrk1, D65.ro], [xFL, D65.ro]], {}, { owner: own, cls: "ca-ss" });
    disc(`${own}.fl`, F, xFL, xF, D65.fl, {}, { owner: own, cls: "ca-ss" });
    disc(`${own}.gfl`, F, xF, xGl0, D65.fl, {}, { owner: own, cls: "ca-cast", extra: Dots(G.dotsOf(F, xGl0, D65.bc, D65.nb, P, { all: true, phase: PI / 4 }), { size: 0.5 }) });
    disc(`${own}.gland`, F, xGl0, xGl1, D40.ro + 16, {}, { owner: own, cls: "ca-cast" });
    fp(`${own}.nut`, F, HEX(D40.ro + 20, 0), xGl1, xG, {}, { owner: own, cls: "ca-trim" });
    // el tramo de atrás, su brida y la cara de la rotura: el tubo exterior, el ánulo, el tubo interior y su bore
    turned(`${own}.back`, F, [[xB + D65.ft, D65.ro], [xBrk0, D65.ro]], {}, { owner: own, cls: "ca-ss" });
    disc(`${own}.bfl`, F, xB, xB + D65.ft, D65.fl, {}, { owner: own, cls: "ca-ss" });
    const ring = (r0, r1, n = 40) => { const out = []; for (let q = 0; q <= n; q++) { const t = (TAU * q) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); } for (let q = n; q >= 0; q--) { const t = (TAU * q) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); } return out; };
    const faceOf = (poly) => pth1(poly.map(([u, v]) => pr([xBrk0 + 0.3, yD + u, z + v])));
    const circle = (r, n = 40) => Array.from({ length: n }, (_, q) => { const t = (TAU * q) / n; return [r * Math.cos(t), r * Math.sin(t)]; });
    const fsvg = `<g class="ca-rotura"><path class="ca-cut-face" d="${faceOf(ring(D65.ri, D65.ro))}"/><path class="ca-agua-sec" d="${faceOf(ring(D40.ro, D65.ri))}"/>` +
      `<path class="ca-cut-face" d="${faceOf(ring(D40.ri, D40.ro))}"/><path class="ca-cond-sec" d="${faceOf(circle(D40.ri))}"/>` +
      Ln(pth1(circle(D65.ro).map(([u, v]) => pr([xBrk0 + 0.3, yD + u, z + v]))).replace(/Z$/, "") + "", { tone: "mid" }) + `</g>`;
    put(`${own}.rotura`, [xBrk0, yD, z], fsvg, [A.disc(F, xBrk0, xBrk0 + 0.3, D65.ro, { name: `${own}.rotura`, owner: own })]);
  }
  ANCH.D_ROTURA = [xBrk0 + 1, yD, legZ(4) - D40.ro - 2];
  ANCH.D_ANULO = [xBrk0 + 1, yD - (D65.ri + D40.ro) / 2 * 0.7, legZ(6) + (D65.ri + D40.ro) / 2 * 0.7];
  ANCH.D_INTERIOR = [xBrk0 + 1, yD, legZ(8)];
  ANCH.D_PRENSA = [xGl1 - 20, yD + D40.ro + 16, legZ(0)];
  ANCH.D_TUBO_EXT = [xBrk1 + 120, yD + D65.ro * 0.6, legZ(1) + D65.ro * 0.6];
  // los cabezales de retorno: una caja de fundición que une las dos ramas de cada horquilla, con su brida
  const HS = D.housing;
  for (let h = 0; h < D.legs / 2; h++) {
    const zt = legZ(2 * h), zb = legZ(2 * h + 1), zc = (zt + zb) / 2, hh = zt - zb + 2 * HS.pad;
    const F = FXa(yD, zc);
    fp(`d.hs${h}.fl`, F, STAD(2 * D65.fl - 30, hh + 26, 46), xB - 20, xB, {}, { owner: `d.hs${h}`, cls: "ca-cast" });
    fp(`d.hs${h}.body`, F, STAD(2 * HS.w, hh, HS.w), xH0, xB - 20, {}, { owner: `d.hs${h}`, cls: "ca-cast" });
    disc(`d.hs${h}.plug`, FXa(yD, zb - HS.pad + 22), xH0 - 14, xH0, 14, {}, { owner: `d.hs${h}`, cls: "ca-trim", n: 20 });
  }
  ANCH.D_RETORNO = [xH0 - 4, yD + 30, legZ(2) + 20];
  // las curvas del tubo interior adelante, entre horquillas, y los puentes del ánulo
  for (let h = 0; h < D.legs / 2 - 1; h++) {
    const z1 = legZ(2 * h + 1), z2 = legZ(2 * h + 2), Rb = D.bendR;
    const route = G.fillet([[xG, yD, z1], [xG + Rb + 30, yD, z1], [xG + Rb + 30, yD, z2], [xG, yD, z2]], Rb, 14, { P, tube: D40.ro });
    tubeItems(`d.u${h}`, route, D40.ro, { cls: "ca-pipe" });
    const xn = xF - D.noz.dx;
    const Fu = { o: [xn, yD, z2], a: ZD3, u: YD, v: XD }, Fd = { o: [xn, yD, z1], a: [0, 0, -1], u: YD, v: XD };
    const hostU = A.disc(FXa(yD, z2), xBrk1, xFL, D65.ro, { name: `d.leg${2 * h + 2}.macizo` }), hostD = A.disc(FXa(yD, z1), xBrk1, xFL, D65.ro, { name: `d.leg${2 * h + 1}.macizo` });
    const a = saddle(`d.j${h}.a`, Fu, D32.ro + 3, (t) => G.saddleStart(D65.ro, D32.ro + 3, t), D65.ro + 14, {}, { owner: `d.leg${2 * h + 2}`, cls: "ca-ss", hosts: [hostU] });
    const b = saddle(`d.j${h}.b`, Fd, D32.ro + 3, (t) => G.saddleStart(D65.ro, D32.ro + 3, t), D65.ro + 14, {}, { owner: `d.leg${2 * h + 1}`, cls: "ca-ss", hosts: [hostD] });
    tubeItems(`d.j${h}`, [a.face, b.face], D32.ro, { cls: "ca-pipe" });
  }
  ANCH.D_CURVA = [xG + D.bendR + 30 + D40.ro, yD, (legZ(3) + legZ(4)) / 2];
  ANCH.D_PUENTE = [xF - D.noz.dx + D32.ro, yD, (legZ(5) + legZ(6)) / 2];
  // el agua de servicios: entra por el ánulo de la rama de abajo y sale por el de la de arriba (boquillas adelante)
  [[D.legs - 1, "d.swin"], [0, "d.swout"]].forEach(([i, nm]) => {
    const z = legZ(i), xn = xF - D.sw, F = i ? { o: [xn, yD, z], a: [0, 1, 0], u: ZD3, v: XD } : { o: [xn, yD, z], a: ZD3, u: YD, v: XD };
    const host = A.disc(FXa(yD, z), xBrk1, xFL, D65.ro, { name: `d.leg${i}.macizo` });
    const s1 = D65.ro + (i ? 110 : 60);
    saddle(`${nm}.neck`, F, D40.ro, (t) => G.saddleStart(D65.ro, D40.ro, t), s1, {}, { owner: nm, cls: "ca-ss", hosts: [host] });
    disc(`${nm}.fl`, F, s1, s1 + D40.ft, D40.fl, {}, { owner: nm, cls: "ca-ss" });
    const s2 = s1 + D40.ft, s3 = s2 + (i ? 130 : 160);
    tubeItems(`${nm}.pipe`, [G.pointOf(F, s2, 0, 0), G.pointOf(F, s3, 0, 0)], D40.ro, { cls: "ca-pipe" });
    flangePair(`${nm}.end`, F, s3, D40);
    ANCH[nm === "d.swin" ? "SW_IN" : "SW_OUT"] = add(G.pointOf(F, (s2 + s3) / 2, 0, 0), nm === "d.swin" ? [0, 0, -D40.ro] : mul(TMINUS, D40.ro));
  });
  // los soportes: un poste detrás de las ramas, con un brazo bajo cada una
  [xF - D.posts[0], xB + D.posts[1]].forEach((x, q) => {
    const yp = yD - D65.ro - 70, c = 40;
    box(`stand.d.base${q}`, [x - c - 40, yp - c - 40, 0], [x + c + 40, yp + c + 40, 14], {}, { r: 4, steps: 3, bevel: 0.8, cls: "ca-paint" });
    box(`d.post${q}`, [x - c, yp - c, 14], [x + c, yp + c, legZ(0) + 40], {}, { r: 2, steps: 2, cls: "ca-paint", owner: `d.post${q}` });
    for (let i = 0; i < D.legs; i++) {
      const z = legZ(i) - D65.ro;
      box(`d.arm${q}.${i}`, [x - 25, yp + c, z - 16], [x + 25, yD + 40, z], {}, { r: 2, steps: 2, cls: "ca-paint", owner: `d.post${q}` });
    }
  });
  ANCH.D_SOPORTE = [xF - D.posts[0] - 40, yD - D65.ro - 70, 120];
}

/* ====================================================================
   3 · las líneas: el vapor que llega del extractor, el condensado del condensador al subenfriador y del subenfriador
   al florentino
   ==================================================================== */
{
  // el vapor: sube de la brida de la boquilla, da la vuelta y va hacia el extractor (a la izquierda), con caída hacia
  // el condensador; termina en el par de bridas de la línea que viene del extractor
  const z0 = zVapFl + NV.ft, F = FE;
  const route = G.fillet([[xE, yE, z0], [xE, yE, z0 + 330], [xE - 820, yE, z0 + 380]], 300, 20, { P, tube: NV.ro });
  tubeItems("lv.pipe", route, NV.ro, { cls: "ca-pipe", maxLength: 160 });
  const end = route[route.length - 1], dir = G.unit3(G.sub3(end, route[route.length - 2]));
  const Fe = G.frameAlong(end, dir);
  flangePair("lv.end", Fe, 0, NV);
  ANCH.VAPOR = add(G.pointAlong(route, G.pathLength(route) * 0.8), [0, 0, NV.ro]);
  ANCH.CUELLO = add(route[Math.floor(route.length * 0.45)], [0, 0, NV.ro]);
}
{
  // el condensado: de la boquilla de abajo del condensador baja, viene hacia adelante y entra al prensaestopas de la
  // rama de arriba del subenfriador
  const z0 = zCondFl - NC.ft;
  const route = G.fillet([[xE, yE, z0], [xE, yE, legZ(0)], [xE, yD, legZ(0)], [xG, yD, legZ(0)]], 60, 12, { P, tube: D40.ro });
  tubeItems("lc1.pipe", route, D40.ro, { cls: "ca-pipe" });
  ANCH.COND1 = add(G.pointAlong(route, G.pathLength(route) * 0.55), [0, 0, D40.ro]);
}
{
  // del subenfriador al florentino: sale del prensaestopas de la rama de abajo, una reducción, sube junto al
  // subenfriador y entra a la brida de la entrada del florentino
  const z = legZ(D.legs - 1), xr0 = xG + 70, xr1 = xr0 + 60;
  tubeItems("lc2.a", [[xG, yD, z], [xr0, yD, z]], D40.ro, { cls: "ca-pipe" });
  turned("lc2.red", FXa(yD, z), [[xr0, D40.ro], [xr1, D32.ro]], {}, { owner: "lc2", cls: "ca-pipe" });
  const route = G.fillet([[xr1, yD, z], [xR, yD, z], [xR, yD, IN.cara[2]], IN.cara], 70, 12, { P, tube: D32.ro });
  tubeItems("lc2.pipe", route, D32.ro, { cls: "ca-pipe" });
  ANCH.COND2 = [xR + D32.ro * HV[0], yD + D32.ro * HV[1], 1100];
  ANCH.REDUCCION = [(xr0 + xr1) / 2, yD, z + D40.ro];
}

/* ====================================================================
   4 · la persona de referencia: 1,75 m, de pie en el piso junto al florentino
   ==================================================================== */
{
  const PS = CA.persona;
  const per = personaDePie({ P, pie: [PS.x, PS.y, 0], rumbo: PS.rumbo, mm: 1, adelante: "izq" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas?.PECHO ?? [PS.x, PS.y, 1300];
}

/* ---------- las caras del corte del condensador, un elemento por pieza ---------- */
{
  const groups = new Map();
  for (const c of cutE) { const key = c.owner + "|" + c.cls; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls] = key.split("|");
    const d = list.map((c) => pth1(c.poly.map(([u, z]) => pr(eW(u, 0, z))))).join("");
    const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
    const shapes = list.map((c) => record(A.prism(FYE, c.poly, -0.3, 0, { name: `${owner}.corte`, owner })));
    const cx = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.corte.e`, eW(cx[0] / n, 0, cx[1] / n), svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.CA_ITEM) {
  for (const nm of process.env.CA_ITEM.split(",")) {
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
const CSS_CA = `.ca-cut{${shades("#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3")}}
.ca-ss{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#ccd1d6", "#d5d9dd", "#dde1e4", "#e5e8ea")}}
.ca-in{${shades("#e9ecef", "#e9ecef", "#f1f3f5", "#c3c9cf", "#ccd1d6", "#d5d9de", "#dde1e5")}}
.ca-tubo{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#ccd1d6", "#d5d9dd", "#dde1e4", "#e5e8ea")}}
.ca-pipe{${shades("#f1f3f4", "#f1f3f4", "#f9fafa", "#d2d6da", "#dadee1", "#e2e5e7", "#e9ebed")}}
.ca-trim{${shades("#f4f5f6", "#f4f5f6", "#fbfbfc", "#d6d9dc", "#dfe2e4", "#e7e9eb", "#eef0f1")}}
.ca-cast{${shades("#e3e6e9", "#e3e6e9", "#eceef0", "#c4c9ce", "#cdd1d5", "#d5d9dc", "#dde0e3")}}
.ca-lever{${shades("#d9dde1", "#d9dde1", "#e6e9ec", "#aeb5bc", "#b8bfc5", "#c2c8ce", "#ccd1d6")}}
.ca-paint{${shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#b9c1c6", "#c4cbd0", "#ced4d8", "#d8dde0")}}
.ca-bore{fill:#9fadb8;stroke:none}.ca-bore-dk{fill:#5f6a74;stroke:none}.ca-tubo-boca{fill:#d5d9dd;stroke:#8d969e;stroke-width:.3px}
.ca-cut-face{fill:#c9ced3;stroke:none}.ca-agua-sec{fill:#9cb7c3;fill-opacity:.6;stroke:none}.ca-cond-sec{fill:#9cb7c3;fill-opacity:.85;stroke:none}
.ca-agua-cara{fill:#9cb7c3;fill-opacity:.34;stroke:none}.ca-agua-sup{fill:#9cb7c3;fill-opacity:.3;stroke:none}
.ca-gota-agua{fill:#7fa3b4;fill-opacity:.85;stroke:none}
.ca-agua .iso-line[data-tone="lo"]{stroke:#7f98a4}
.ca-vapor{fill:none;stroke:#c8452b;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.ca-vapor-p{fill:#c8452b;stroke:none;opacity:.85}
.ca-agua-flujo{fill:none;stroke:#2f5f86;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.ca-agua-flujo-p{fill:#2f5f86;stroke:none;opacity:.85}`;
const CSS = CSS_FL + "\n" + CSS_CA + "\n" + CSS_PERSONA;
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
const svg = k.figureSvg({ width: W, height: H, label: "Condensador, subenfriador y florentino", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="ca-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Condensador del arrastre", theme: "light", width: 1000, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUT, "fig_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH }));
if (!FAST) A.auditOrExit(R_, PA, {});
