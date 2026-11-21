/* ====================================================================
   Una etapa del TASTE (evaporador de película descendente de los cítricos) en isométrico (skill anatomy), con la
   persona de referencia de 1,75 m.
   - La calandria es un haz vertical de tubos largos con espejos fijos que se extienden como bridas. Va cortada por el
     plano vertical de su eje que mira de frente al lector: se quita la mitad de adelante y se ven la fila de tubos del
     plano del corte, abierta (el jugo baja por la pared en película), la fila de atrás entera, las placas soporte, el
     espejo de arriba con las bocas de los tubos y las dos cámaras. Arriba, la cámara de reparto: el jugo caliente llega
     por un tubo reducido con un Venturi (también cortado), se expande en el cono y entra a los tubos como niebla. Abajo,
     la cámara con su cono lleva el jugo y su vapor a la línea de la mezcla. Por la coraza, el vapor de calentamiento
     entra arriba; arriba sale también el venteo de los incondensables y abajo, a ras del espejo, el condensado. Se
     apoya en dos orejas sobre una estructura de dos columnas, con una guía arriba.
   - La línea de la mezcla baja, da la vuelta en un codo de radio largo y entra tangencial al separador ciclónico,
     entero, que suelta el vapor por arriba hacia el efecto siguiente y el jugo por el cono de abajo a la bomba
     centrífuga, que lo manda a la etapa siguiente.
   - Con --detalle, el círculo que amplía la boca del tubo del centro en el espejo de arriba, abierto por su eje: la
     niebla que baja del cono, el jugo que se junta sobre el espejo y entra por el borde, la película que se forma en la
     pared y el vapor del jugo que baja por el centro; abajo, el vapor de calentamiento en la coraza.
   Uso: node build.mjs [--audit] [--fast] [--detalle]
   Escribe out/fig.svg, out/fig.css, out/fig_data.json (cámara y puntos de los rótulos) y preview.html; con --detalle,
   out/detalle.svg, out/detalle_data.json y out/preview-detalle.html.
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
const X = await import(join(HERE, "xprism.mjs"));
const { personaDePie, CSS_PERSONA } = await import(join(HERE, "../persona.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const FAST = process.argv.includes("--fast"), DET = process.argv.includes("--detalle");
const STEP = Number(process.env.EV_STEP || 0.5);
const EV = GEO.EV, DN = GEO.DN, CL = EV.cal, SP = EV.sep, Z = GEO.cotas(), TB = GEO.tubos();
const AZ = EV.AZ, EL = EV.EL;

const ZD3 = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const TMINUS = [-Math.sin(AZ * D2R), Math.cos(AZ * D2R), 0];   // hacia la izquierda de la pantalla, en el piso
const TPLUS = G.mul3(TMINUS, -1);
const ANCH = {};                                                  // los puntos de los rótulos del libro (libro.mjs)
const add = G.add3, mul = G.mul3;

/* ---------- el marco de la calandria: u a lo largo del corte, n hacia el lector ---------- */
const uE = TPLUS, nE = [Math.cos(AZ * D2R), Math.sin(AZ * D2R), 0];
const eW = (u, n, z) => [u * uE[0] + n * nE[0], u * uE[1] + n * nE[1], z];
const dE = (deg) => add(mul(uE, Math.cos(deg * D2R)), mul(nE, Math.sin(deg * D2R)));      // hacia afuera, a deg de u
const tE = (deg) => add(mul(uE, -Math.sin(deg * D2R)), mul(nE, Math.cos(deg * D2R)));
const ePol = (r, deg, z) => eW(r * Math.cos(deg * D2R), r * Math.sin(deg * D2R), z);
const R = CL.R, RO = CL.R + CL.tw, RF = CL.RF;
const D3 = DN[300], D1 = DN[100], D4 = DN[40], D5 = DN[50], D25 = DN[250], D2 = DN[25];
const TR = CL.tube;
/* ---------- el separador: la entrada de la mezcla es tangencial, así que su eje queda detrás de la línea ---------- */
const RSo = SP.R + SP.tw, eSep = RSo - D3.ro - 30;              // la pared de afuera de la línea, 30 mm dentro de la del separador
const uS = SP.u, nS = -eSep;
const sepXY = eW(uS, nS, 0);
/* ---------- la bomba: delante del separador, con su eje a lo largo del corte ---------- */
const BM = EV.bomba;
const nB = nS + BM.n;                                             // el eje de la bomba, delante del separador
const pF = (s, z = BM.z) => eW(uS + s, nB, z);                    // a lo largo del eje de la bomba (s desde el eje del separador)

const W = 1000, H = 1500;
const EXT = [];
for (let d = 0; d < 360; d += 30) EXT.push(ePol(RF + 40, d, Z.tsB), ePol(RF + 40, d, Z.top), ePol(RO, d, Z.conoB0), ePol(RO, d, Z.conoT0));
EXT.push(eW(-1100, 0, Z.jugo + 120), eW(-700, -500, Z.s1 - 250), eW(0, 0, Z.jugo + 200));
EXT.push(eW(uS - RSo, nS, Z.sepTop + 500), eW(uS + RSo, nS, 0), eW(uS + 1100, nS, Z.sepTop + 500), eW(uS, nS - RSo, 0), eW(uS, nS + RSo, Z.sepTop));
EXT.push(eW(uS + 1400, nB, 1500), eW(uS + 1500, nB + 300, 0), eW(uS + 1500, nB - 300, 0));
{ const ST = CL.estructura; for (const [u, n] of [[-ST.du - 200, ST.n - 200], [ST.du + 200, ST.n - 200]]) EXT.push(eW(u, n, 0), eW(u, n, ST.alto)); }
EXT.push(eW(EV.persona.u - 300, EV.persona.n + 300, 0), eW(EV.persona.u + 300, EV.persona.n - 300, 0), eW(EV.persona.u, EV.persona.n, 1800));
EXT.push(eW(500, 300, Z.s0 + 200), eW(450, -300, Z.s0 - 600));
const PMAIN = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
/* el detalle: la boca del tubo del centro (en el plano del corte), MDET veces más grande, dentro de un círculo de radio
   RDET (en las unidades de la vista); CDET es el punto que se amplía, en el eje del tubo */
const DT = CL.detalle;
const CDET = eW(0, 0, Z.top - 4), MDET = DT.M, RDET = DT.R;
const WD = 2 * RDET + 8;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: AZ, elevation: EL }; const c = k.iso(CDET, Q); Q.origin = [WD / 2 - c[0], WD / 2 - c[1]]; return Q; })() : PMAIN;
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);
const HV = G.unit3([V3[0], V3[1], 0]);                          // hacia el lector, en el piso

/* El dibujo va en milímetros; el audit, en centímetros. */
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
// un cilindro corto (perno, brida, cuello): prisma de sección circular; se registra el cilindro verdadero
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
// un cilindro (cuello) de radio a a lo largo de F.a, desde la superficie curva (start(ángulo) = s donde la generatriz
// toca la superficie) hasta la cara plana en s = h. Se registra como disco cortado por sus anfitriones.
function saddle(name, F, a, start, h, style = {}, { owner, cls = "", extra = "", hosts = [], ref = null } = {}) {
  const low = Math.min(...Array.from({ length: 72 }, (_, i) => start((i / 72) * TAU)));
  const body = S(G.saddleOf(F, a, start, h, P), { tone: "mid", ...style }) + extra;
  put(name, ref ?? G.add3(F.o, G.mul3(F.a, (low + h) / 2)), wrap(body, cls), [record(A.disc(F, low, h, a, { name, owner, cut: hosts }))]);
  return { F, face: G.add3(F.o, G.mul3(F.a, h)), low };
}
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const hexR = (af) => af / Math.sqrt(3);
const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];

/* ---------- superficies con tonos suaves ---------- */
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
/* una superficie de dos curvaturas (los fondos 2:1), en franjas de f, con el borde entre dos tonos por bisección */
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
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD3, u: [1, 0, 0], v: [0, 1, 0] });
const DEFS = [];
const circ = (F, s, r, n = 40) => Array.from({ length: n }, (_, i) => G.pointOf(F, s, r, (i / n) * TAU));
// la mitad de atrás de un anillo (v ≤ 0) en un marco cuyo u va a lo largo del corte
const halfRing = (r0, r1, n = 36) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  if (r0 > 1e-6) for (let i = n; i >= 0; i--) { const t = Math.PI + (Math.PI * i) / n; out.push([r0 * Math.cos(t), r0 * Math.sin(t)]); }
  else out.push([0, 0]);
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
};
// la mitad de atrás de un disco de radio r1 con las muescas de los agujeros de la fila del corte (semicírculos de radio
// rh en u = c, con v ≤ 0)
const halfPlate = (r1, centres, rh, n = 72) => {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = Math.PI + (Math.PI * i) / n; out.push([r1 * Math.cos(t), r1 * Math.sin(t)]); }
  for (const c of [...centres].sort((a, b) => b - a)) for (let i = 0; i <= 12; i++) { const t = (Math.PI * i) / 12; out.push([c + rh * Math.cos(t), -rh * Math.sin(t)]); }
  return out.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
};

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
// una flecha: la polilínea suave de los puntos de control (a, z), llevados al mundo con toW, con su punta
function arrowSvg(ctl, toW, cls, { h = 6.5, w = 3.2 } = {}) {
  const pts = smooth(ctl).map(([a, z]) => toW(a, z));
  const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[n - 4], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const base = [b[0] - ux * h, b[1] - uy * h];
  const keep = sc.filter((p) => (p[0] - b[0]) * ux + (p[1] - b[1]) * uy < -h + 0.5);
  const line = keep.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "L" + r10(base[0]) + " " + r10(base[1]);
  const headD = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  return { pts, svg: `<path class="${cls}" d="${line}"/><path class="${cls}-p" d="${headD}"/>`, w };
}
function arrows(list, toW, rf, opts = {}) {
  for (const [nm, cls, ctl] of list) {
    const { pts, svg, w } = arrowSvg(ctl, toW, cls, opts);
    put(nm, pts[Math.floor(pts.length / 2)], svg, [A.tube(pts, rf), A.ball(pts[pts.length - 1], Math.max(rf, w / G.scaleOf(P)))]);
  }
}
let seed = 23;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* ---------- el corte de la calandria ---------- */
const FE = { o: [0, 0, 0], a: ZD3, u: uE, v: nE };                // el eje; halfRing (v ≤ 0) da la mitad de atrás
const FYE = { o: [0, 0, 0], a: nE, u: uE, v: ZD3 };               // el plano del corte: sección (u, z), espesor a lo largo de n
const FRONT_E = A.orientedBox(eW(0, 3000, 9000), [nE, uE, ZD3], [3000, 9000, 12000]);
const cutE = [];                                                  // caras del corte: { owner, poly (u, z), cls }
const cP = (r, z0, z1, uc = 0) => (f, u) => eW(uc + r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u);
const cN = (sg) => (f) => mul(dE(f / D2R), sg);
const eArc = (r, z, f0, f1, n = 72, uc = 0) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return eW(uc + r * Math.cos(t), r * Math.sin(t), z); });
const eBore = (rc, deg, z, rh, cls) => `<path class="${cls}" d="${pth1(Array.from({ length: 36 }, (_, i) => { const t = (i / 36) * TAU, f = deg * D2R + (rh * Math.cos(t)) / rc; return pr(eW(rc * Math.cos(f), rc * Math.sin(f), z + rh * Math.sin(t))); }))}"/>`;
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
// la ventana del corte (un polígono en (u, z) del plano del corte): lo que se ve por ella, proyectado a lo largo de la mirada
function ventana(id, poly) {
  const win = poly.map(([u, z]) => eW(u, 0, z));
  DEFS.push(`<clipPath id="${id}"><path d="${pth1(win.map(pr))}"/></clipPath>`);
  const prism = A.prism(FV, win.map((p) => [G.dot3(p, CAM.R), G.dot3(p, CAM.D)]), -900000, 900000);
  return A.box([-900000, -900000, -900000], [900000, 900000, 900000], { cut: [prism] });
}
const tubeF = (t) => ({ o: eW(t.u, t.n, 0), a: ZD3, u: uE, v: nE });
const nozHole = (deg, z, r) => A.disc({ o: [0, 0, z], a: dE(deg), u: tE(deg), v: ZD3 }, 0, 1200, r - 1);
const SHELL_SOLID = A.body(FE, [[Z.s0, 0], [Z.s0, RO], [Z.s1, RO], [Z.s1, 0]], { name: "cal.coraza.maciza" });

/* una envolvente de revolución cortada, entre (zA, rA) y (zB, rB) por dentro (una recta: cilindro o cono) y de
   espesor tw (horizontal): la cara de adentro de la mitad de atrás, recortada a la ventana del corte, y las caras del
   corte */
function envolvente(name, zA, rA, zB, rB, { tw = CL.tw, owner = "cal", holes = [], bores = "", cls = "ev-in", uc = 0, roA = null, roB = null } = {}) {
  const id = "evWin" + name.replace(/\W/g, "");
  const oA = roA ?? rA + tw, oB = roB ?? rB + tw;
  const clip = ventana(id, [[uc - rA, zA], [uc + rA, zA], [uc + rB, zB], [uc - rB, zB]]);
  const dr = (rB - rA) / (zB - zA);
  const Pin = (f, u) => { const r = rA + (rB - rA) * u; return eW(uc + r * Math.cos(f), r * Math.sin(f), zA + (zB - zA) * u); };
  const Nin = (f) => G.unit3(add(mul(dE(f / D2R), -1), [0, 0, dr]));
  const inner = toned((o) => surface(Pin, Nin, PI, TAU, 140, 1, o), cls);
  const F = uc ? { ...FE, o: eW(uc, 0, 0) } : FE;
  put(`${name}.in`, eW(uc, -Math.max(rA, rB) * 0.75, (zA + zB) / 2), `<g clip-path="url(#${id})">${inner}${bores}</g>`,
    [record(A.body(F, [[zA, rA], [zB, rB], [zB, oB], [zA, oA]], { name: `${name}.in`, owner, cut: [FRONT_E, ...holes, clip] }))]);
  cutE.push({ owner, poly: [[uc + rA, zA], [uc + oA, zA], [uc + oB, zB], [uc + rB, zB]], cls: "ev-cut" }, { owner, poly: [[uc - oA, zA], [uc - rA, zA], [uc - rB, zB], [uc - oB, zB]], cls: "ev-cut" });
}
// una brida o un espejo cortado: la mitad de atrás de un anillo (o un disco con muescas) y su cara del corte
function bridaCorte(name, zA, zB, r0, r1, { owner = "cal", cls = "ev-ss", extra = "", poly = null } = {}) {
  fp(name, FE, poly || halfRing(r0, r1, 64), zA, zB, {}, { owner, cls, extra });
  if (r0 > 0) cutE.push({ owner, poly: rect(r0, zA, r1, zB), cls: "ev-cut" }, { owner, poly: rect(-r1, zA, -r0, zB), cls: "ev-cut" });
}

/* ---------- boquillas y líneas ---------- */
function nozzle(name, host, deg, z, d, neck, { owner } = {}) {
  const F = { o: [0, 0, z], a: dE(deg), u: tE(deg), v: ZD3 }, s1 = RO + neck;
  saddle(`${name}.neck`, F, d.ro, (t) => G.saddleStart(RO, d.ro, t), s1, {}, { owner: owner ?? name, cls: "ev-ss", hosts: [host] });
  disc(`${name}.fl`, F, s1, s1 + d.ft, d.fl, {}, { owner: owner ?? name, cls: "ev-ss" });
  return { F, s: s1 + d.ft };
}
// válvula de bola bridada con palanca: F.a es el sentido del flujo y la cara de entrada está en s0
function ballValve(name, F, s0, d, { open = false, stem = null, Lv = 150, flip = false, lever = 160 } = {}) {
  const ft = d.ft, r0 = d.fl * 0.56, r1 = d.fl * 0.84, s1 = s0 + Lv;
  disc(`${name}.fl0`, F, s0, s0 + ft, d.fl, {}, { owner: name, cls: "ev-cast" });
  const vm = (s0 + s1) / 2, half = Lv / 2 - ft;
  const bulge = (s) => r0 + (r1 - r0) * Math.cos(((s - vm) / half) * (PI / 2));
  const prof = Array.from({ length: 13 }, (_, i) => { const s = s0 + ft + ((Lv - 2 * ft) * i) / 12; return [s, bulge(s), i > 0 && i < 12 ? 1 : 0]; });
  turned(`${name}.body`, F, prof, {}, { owner: name, cls: "ev-cast" });
  disc(`${name}.fl1`, F, s1 - ft, s1, d.fl, {}, { owner: name, cls: "ev-cast" });
  const st = stem || G.unit3(G.cross3(F.a, Math.abs(F.a[2]) > 0.9 ? HV : ZD3));
  const c = add(F.o, mul(F.a, vm)), FS = { o: c, a: st, u: G.unit3(G.cross3(st, F.a)), v: F.a };
  const rn = Math.max(9, d.ro * 0.75);
  disc(`${name}.neck`, FS, Math.sqrt(r1 * r1 - rn * rn) - 2, r1 + 26, rn, {}, { owner: name, cls: "ev-cast" });
  disc(`${name}.stem`, FS, r1 + 26, r1 + 36, 6, {}, { owner: name, cls: "ev-trim", n: 16 });
  const lv0 = open ? F.a : G.unit3(G.cross3(st, F.a)), lv = flip ? mul(lv0, -1) : lv0;
  const FLv = { o: add(c, mul(st, r1 + 36)), a: lv, u: st, v: G.unit3(G.cross3(lv, st)) };
  fp(`${name}.lever`, FLv, [[0, -9], [5, -9], [5, 9], [0, 9]], -14, lever, {}, { owner: name, cls: "ev-lever" });
  return { end: add(F.o, mul(F.a, s1)), body: c, r1, s1 };
}
// el final de una línea que sigue fuera de la figura: el par de bridas (la de la línea que llega y la de la que sigue)
function flangePair(name, F, s, d, { owner = name } = {}) {
  disc(`${name}.fa`, F, s, s + d.ft, d.fl, {}, { owner, cls: "ev-pipe" });
  disc(`${name}.fb`, F, s + d.ft, s + 2 * d.ft, d.fl, {}, { owner, cls: "ev-cast", extra: G.dot3(F.a, V3) > 0.1 ? Dots(G.dotsOf(F, s + 2 * d.ft, d.bc, d.nb, P, { all: true, phase: PI / d.nb }), { size: 0.5 }) : "" });
  return add(F.o, mul(F.a, s + 2 * d.ft));
}
// una línea que termina en un par de bridas: la ruta (con sus codos) y las bridas al final, en la dirección del último tramo
function lineaHasta(name, pts, d, rCodo, { owner = name } = {}) {
  const route = pts.length > 2 ? G.fillet(pts, rCodo, 16, { P, tube: d.ro }) : pts;
  tubeItems(`${name}.pipe`, route, d.ro, { cls: "ev-pipe" });
  const end = route[route.length - 1], dir = G.unit3(G.sub3(end, route[route.length - 2]));
  flangePair(`${name}.end`, G.frameAlong(end, dir), 0, d);
  return route;
}

if (!DET) {
/* ====================================================================
   1 · la calandria, cortada por el plano vertical de su eje que mira de frente al lector
   ==================================================================== */
const corte = TB.corte.map((t) => t.u);
const SUP = Array.from({ length: CL.soportes.n }, (_, i) => ({ z: Z.s0 + ((Z.s1 - Z.s0) * (i + 1)) / (CL.soportes.n + 1), win: i % 2 ? -1 : 1 }));

/* 1a · la cámara de abajo: el cuello de la mezcla con su brida, el cono, el cilindro y su brida */
{
  envolvente("cal.cuelloB", Z.bocaFl1, D3.ri, Z.conoB0, D3.ri, { roA: D3.ro, roB: D3.ro });
  bridaCorte("cal.bocaB.fl", Z.bocaFl0, Z.bocaFl1, D3.ri, D3.fl);
  envolvente("cal.conoB", Z.conoB0, D3.ri, Z.conoB1, R, { roA: D3.ro, roB: RO });
  envolvente("cal.camB", Z.conoB1, R, Z.camB1, R);
  bridaCorte("cal.camB.fl", Z.camB1, Z.tsB, R, RF);
  ANCH.CAMARA_B = eW(-R * 0.6, -30, (Z.conoB1 + Z.camB1) / 2);
  ANCH.CONO_B = eW(-(D3.ri + R) / 2 - 4, 0, (Z.conoB0 + Z.conoB1) / 2);
}

/* 1b · los espejos (el de arriba con las bocas de los tubos de atrás y las de la fila del corte, abiertas), la coraza
   con sus boquillas y los pernos de las dos uniones de bridas */
{
  const notch = TR.ro + 0.4;
  const espejo = (name, zA, zB, conBocas) => {
    let extra = "";
    if (conBocas) {
      const mouths = TB.atras.map((t) => pth1(circ(tubeF(t), zB + 0.3, TR.ro, 24).map(pr))).join("");
      const bores = TB.atras.map((t) => pth1(circ(tubeF(t), zB + 0.4, TR.ri, 24).map(pr))).join("");
      // las bocas de la fila del corte: la mitad de atrás de cada agujero
      const halves = TB.corte.map((t) => pth1([...eArc(TR.ri, zB + 0.4, PI, TAU, 18, t.u)].map(pr))).join("");
      extra = `<path class="ev-tubo-boca" d="${mouths}"/><path class="ev-bore-dk" d="${bores}${halves}"/>`;
    }
    fp(name, FE, halfPlate(RF, corte, notch), zA, zB, {}, { owner: "cal", cls: "ev-ss", extra });
    // la cara del corte, entre los agujeros
    const xs = [-RF, ...corte.flatMap((c) => [c - notch, c + notch]), RF];
    for (let i = 0; i < xs.length; i += 2) cutE.push({ owner: "cal", poly: rect(xs[i], zA, xs[i + 1], zB), cls: "ev-cut" });
  };
  espejo("cal.espejoB", Z.tsB, Z.s0, false);
  espejo("cal.espejoT", Z.s1, Z.top, true);
  ANCH.ESPEJO_T = eW(-TR.p * 1.5, -TR.p * 0.9, Z.top);
  ANCH.ESPEJO_B = eW(-RF * 0.9, 0, (Z.tsB + Z.s0) / 2);
  const VP = CL.vapor, VT = CL.venteo, CO = CL.condensado;
  const zVap = Z.s1 - VP.dz, zVent = Z.s1 - VT.dz, zCond = Z.s0 + CO.dz;
  const holes = [nozHole(VP.deg, zVap, D25.ro), nozHole(VT.deg, zVent, D2.ro), nozHole(CO.deg, zCond, D4.ro)];
  const bores = eBore(R - 0.4, VP.deg, zVap, D25.ri, "ev-bore-dk") + eBore(R - 0.4, VT.deg, zVent, D2.ri, "ev-bore-dk") + eBore(R - 0.4, CO.deg, zCond, D4.ri, "ev-bore-dk");
  envolvente("cal.coraza", Z.s0, R, Z.s1, R, { holes, bores });
  ANCH.CORAZA = eW(-RO, 0, Z.s0 + 2200);
  ANCH.CALANDRIA = eW(-RO, 0, Z.s0 + 4800);
  const Bt = CL.bolts;
  for (let q = 0; q < Bt.n / 2; q++) {
    const deg = 180 + 180 / Bt.n + (360 / Bt.n) * q, c = ePol(Bt.bc, deg, 0), F = FZ(c[0], c[1], 0), rot = deg * D2R - AZ * D2R;
    fp(`cal.tuercaB${q}`, F, HEX(hexR(Bt.af), rot), Z.s0, Z.s0 + Bt.h, {}, { owner: "cal", cls: "ev-trim" });
    fp(`cal.tuercaBb${q}`, F, HEX(hexR(Bt.af), rot), Z.camB1 - Bt.h, Z.camB1, {}, { owner: "cal", cls: "ev-trim" });
    fp(`cal.tuercaT${q}`, F, HEX(hexR(Bt.af), rot), Z.camT0, Z.camT0 + Bt.h, {}, { owner: "cal", cls: "ev-trim" });
    fp(`cal.tuercaTb${q}`, F, HEX(hexR(Bt.af), rot), Z.s1 - Bt.h, Z.s1, {}, { owner: "cal", cls: "ev-trim" });
  }
}

/* 1c · las placas soporte y los tubos: la fila del corte, abierta, con la película del jugo en la pared, y la fila de
   atrás entera, en tramos entre las placas */
{
  const st = CL.soportes.t / 2, RBF = R - CL.soportes.gap / 2, UW = R - CL.soportes.cut * 2 * R;
  SUP.forEach((b, i) => {
    // medio disco sin la ventana: a la derecha (win = +1, u > UW) o a la izquierda (win = −1)
    const ta = b.win > 0 ? PI : PI + Math.acos(UW / RBF), tb = b.win > 0 ? TAU - Math.acos(UW / RBF) : TAU;
    const poly = [];
    for (let q = 0; q <= 40; q++) { const t = ta + ((tb - ta) * q) / 40; poly.push([RBF * Math.cos(t), RBF * Math.sin(t)]); }
    poly.push(b.win > 0 ? [UW, 0] : [-UW, 0]);
    const clean = poly.map(([u, v]) => [Math.abs(u) < 1e-9 ? 0 : u, Math.abs(v) < 1e-9 ? 0 : v]);
    fp(`cal.soporte${i}`, FE, clean, b.z - st, b.z + st, {}, { owner: "cal", cls: "ev-ss" });
    const [ua, ub] = b.win > 0 ? [-RBF, UW] : [-UW, RBF];
    cutE.push({ owner: `cal.soporte${i}`, poly: rect(ua, b.z - st, ub, b.z + st), cls: "ev-cut" });
  });
  ANCH.SOPORTE = eW(-RBF * 0.6, 0, SUP[0].z);
  const cuts = [Z.s0, ...SUP.flatMap((b) => [b.z - st, b.z + st]), Z.s1];
  const sec16 = Array.from({ length: 20 }, (_, i) => { const a = (TAU * i) / 20; return [TR.ro * Math.cos(a), TR.ro * Math.sin(a)]; });
  const fila1 = TB.atras.filter((t) => t.fila === -1);
  for (let s = 0; s < cuts.length; s += 2) {
    const z0 = cuts[s], z1 = cuts[s + 1];
    // la fila de atrás
    const svg = fila1.map((t) => X.prismSvg(C, sec16, z0, z1, { F: tubeF(t), tone: "mid" })).join("");
    const shapes = fila1.map((t) => A.disc(tubeF(t), z0, z1, TR.ro, { name: `cal.tubos${s / 2}`, owner: "cal.haz" }));
    shapes.forEach(record);
    put(`cal.tubos${s / 2}`, eW(0, -55, (z0 + z1) / 2), wrap(svg, "ev-tubo"), shapes);
    // la fila del corte: la cara de adentro de la mitad de atrás de cada tubo, con la película encima, recortada a su
    // ventana, y las caras del corte de la pared
    const id = `evTub${s / 2}`;
    const win = TB.corte.map((t) => pth1([[t.u - TR.ri, z0], [t.u + TR.ri, z0], [t.u + TR.ri, z1], [t.u - TR.ri, z1]].map(([u, z]) => pr(eW(u, 0, z))))).join("");
    DEFS.push(`<clipPath id="${id}"><path d="${win}"/></clipPath>`);
    let body = "";
    const shapes2 = [];
    for (const t of TB.corte) {
      body += toned((o) => surface(cP(TR.ri, z0, z1, t.u), cN(-1), PI, TAU, 24, 1, o), "ev-in");
      body += `<path class="ev-pelicula" d="${pth1([...eArc(TR.ri, z0, PI, TAU, 18, t.u), ...eArc(TR.ri, z1, TAU, PI, 18, t.u)].map(pr))}"/>`;
      shapes2.push(record(A.prism({ ...FE, o: eW(t.u, 0, 0) }, halfRing(TR.ri, TR.ro, 16), z0, z1, { name: `cal.corte${s / 2}`, owner: "cal.haz" })));
      cutE.push({ owner: "cal.haz", poly: rect(t.u + TR.ri, z0, t.u + TR.ro, z1), cls: "ev-cut" }, { owner: "cal.haz", poly: rect(t.u - TR.ro, z0, t.u - TR.ri, z1), cls: "ev-cut" });
    }
    put(`cal.corte${s / 2}`, eW(0, -12, (z0 + z1) / 2), `<g clip-path="url(#${id})">${body}</g>`, shapes2);
  }
  ANCH.TUBOS = eW(TR.p, -6, (SUP[1].z + SUP[2].z) / 2);
  ANCH.TUBOS_ATRAS = eW(TR.p * 2.5, -55 + TR.ro * 0.4, (SUP[0].z + SUP[1].z) / 2);
}

/* 1d · la cámara de reparto: la brida, el cilindro, el cono, el cuello y el tubo reducido con el Venturi, cortados */
{
  bridaCorte("cal.camT.fl", Z.top, Z.camT0, R, RF);
  envolvente("cal.camT", Z.camT0, R, Z.conoT0, R);
  envolvente("cal.conoT", Z.conoT0, R, Z.conoT1, D1.ri, { roB: D1.ro });
  envolvente("cal.cuelloT", Z.conoT1, D1.ri, Z.cuelloT1, D1.ri, { roA: D1.ro, roB: D1.ro });
  bridaCorte("cal.bocaT.fl", Z.cuelloT1, Z.bocaT1, D1.ri, D1.fl);
  ANCH.CONO_T = eW(-(R + D1.ri) / 2 - 6, 0, (Z.conoT0 + Z.conoT1) / 2);
  ANCH.CAMARA_T = eW(R * 0.5, -60, (Z.camT0 + Z.conoT0) / 2);
  // el Venturi: su brida DN 100, el difusor, la garganta, el convergente y su brida DN 40
  const VT = CL.venturi;
  bridaCorte("cal.vent.flB", Z.ventB, Z.ventD1, D1.ri, D1.fl, { owner: "vent", cls: "ev-cast" });
  envolvente("cal.vent.dif", Z.ventD1, D1.ri, Z.ventG0, VT.rg, { owner: "vent", tw: VT.t, roA: D1.ro });
  envolvente("cal.vent.gar", Z.ventG0, VT.rg, Z.ventG1, VT.rg, { owner: "vent", tw: VT.t });
  envolvente("cal.vent.conv", Z.ventG1, VT.rg, Z.ventC1, D4.ri, { owner: "vent", tw: VT.t, roB: D4.ro });
  bridaCorte("cal.vent.flT", Z.ventC1, Z.ventT, D4.ri, D4.fl, { owner: "vent", cls: "ev-cast" });
  ANCH.VENTURI = eW(-(VT.rg + VT.t) - 4, 0, (Z.ventG0 + Z.ventG1) / 2);
  // la línea del jugo: la brida de la línea, sube, da la vuelta hacia la izquierda y termina en su par de bridas
  disc("lj.fl", FE, Z.ventT, Z.ventT + D4.ft, D4.fl, {}, { owner: "lj", cls: "ev-cast" });
  const route = lineaHasta("lj", [eW(0, 0, Z.ventT + D4.ft), eW(0, 0, Z.jugo), eW(-760, 0, Z.jugo)], D4, 72);
  ANCH.JUGO = add(G.pointAlong(route, G.pathLength(route) * 0.75), [0, 0, D4.ro]);
  // las tuercas de la unión del Venturi con el cuello (la mitad de atrás: cuatro de ocho)
  for (let q = 0; q < 4; q++) {
    const deg = 180 + 22.5 + 45 * q, c = ePol(D1.bc, deg, 0), F = FZ(c[0], c[1], 0), rot = deg * D2R - AZ * D2R;
    fp(`cal.tuercaV${q}`, F, HEX(hexR(24), rot), Z.ventD1, Z.ventD1 + 14, {}, { owner: "vent", cls: "ev-trim" });
    fp(`cal.tuercaVb${q}`, F, HEX(hexR(24), rot), Z.cuelloT1 - 14, Z.cuelloT1, {}, { owner: "vent", cls: "ev-trim" });
  }
}

/* 1e · el jugo: la niebla en la cámara de reparto (un abanico translúcido justo detrás del corte, con gotas), lo que
   cae de los tubos en la cámara de abajo y las flechas */
{
  const zA = Z.conoT1, zB = Z.top + 6;
  const fan = [[-D1.ri * 0.7, zA], [D1.ri * 0.7, zA], [R * 0.86, Z.conoT0 - 40], [R - 4, zB + 40], [R - 4, zB], [-(R - 4), zB], [-(R - 4), zB + 40], [-R * 0.86, Z.conoT0 - 40]];
  // la niebla no pasa de la pared del cono: se recorta a la cara de adentro
  const inCone = (u, z) => { const r = z >= Z.conoT0 ? R + ((D1.ri - R) * (z - Z.conoT0)) / (Z.conoT1 - Z.conoT0) : R; return Math.max(-r + 3, Math.min(r - 3, u)); };
  const fanW = fan.map(([u, z]) => [inCone(u, z), z]);
  let dG = "";
  const shapes = [A.prism(FYE, fanW, -1.6, -1.2, { name: "cal.niebla", owner: "jugo.T" })];
  for (let i = 0, put_ = 0; i < 600 && put_ < 70; i++) {
    const z = zB + 12 + (zA - zB - 20) * rnd(), rmax = (z >= Z.conoT0 ? R + ((D1.ri - R) * (z - Z.conoT0)) / (Z.conoT1 - Z.conoT0) : R) - 8;
    const spread = D1.ri * 0.5 + ((rmax - D1.ri * 0.5) * (zA - z)) / (zA - zB);
    const u = (rnd() * 2 - 1) * Math.min(spread, rmax);
    const c = at(eW(u, -1.4, z)), rr = (0.5 + rnd() * 0.5) * 3 * G.scaleOf(P);
    dG += pth1(Array.from({ length: 8 }, (_, j) => { const a = (TAU * j) / 8; return [c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]; }));
    put_++;
  }
  put("cal.niebla", eW(0, -1.4, (zA + zB) / 2), `<g class="ev-jugo"><path class="ev-niebla" d="${pth1(fanW.map(([u, z]) => pr(eW(u, -1.4, z))))}"/><path class="ev-gota" d="${dG}"/></g>`, shapes);
  ANCH.NIEBLA = eW(R * 0.35, -1.4, (Z.camT0 + Z.conoT0) / 2 + 60);
  // en la cámara de abajo: hilos y gotas que caen de las bocas de los tubos de la fila del corte
  let dB = "";
  const shB = [];
  for (const t of TB.corte) for (let q = 0; q < 3; q++) {
    const z = Z.tsB - 40 - q * 95 - (Math.abs(t.u) * 0.4), rr = 5;
    if (z < Z.conoB1 + 20) continue;
    const c = eW(t.u + (q - 1) * 7, -1.4, z);
    dB += pth1(Array.from({ length: 12 }, (_, j) => { const a = (TAU * j) / 12; return pr(add(c, add(mul(uE, rr * Math.cos(a) * 0.8), [0, 0, rr * Math.sin(a) * (Math.sin(a) > 0 ? 1.4 : 0.9)]))); }));
    shB.push(A.ball(c, rr, { name: "cal.gotasB", owner: "jugo.B" }));
  }
  put("cal.gotasB", eW(0, -1.4, Z.tsB - 120), `<path class="ev-gota" d="${dB}"/>`, shB);
  // las flechas del jugo y su vapor: del Venturi se abre en el cono hacia las bocas; abajo, de los tubos al cuello
  arrows([
    ["cal.flujo.t0", "ev-jugo-flujo", [[0, Z.conoT1 + 30], [0, Z.top + 70]]],
    ["cal.flujo.t1", "ev-jugo-flujo", [[22, Z.conoT1 - 10], [80, Z.conoT0 - 60], [R * 0.72, Z.top + 60]]],
    ["cal.flujo.t2", "ev-jugo-flujo", [[-22, Z.conoT1 - 10], [-80, Z.conoT0 - 60], [-R * 0.72, Z.top + 60]]],
    ["cal.flujo.b0", "ev-jugo-flujo", [[R * 0.62, Z.tsB - 30], [R * 0.45, Z.conoB1 - 20], [D3.ri * 0.45, Z.bocaFl1 + 20]]],
    ["cal.flujo.b1", "ev-jugo-flujo", [[-R * 0.62, Z.tsB - 30], [-R * 0.45, Z.conoB1 - 20], [-D3.ri * 0.45, Z.bocaFl1 + 20]]],
  ], (u, z) => eW(u, -2.4, z), 4);
  // una flecha dentro del tubo del centro, arriba y abajo
  arrows([
    ["cal.flujo.tubo0", "ev-jugo-flujo", [[0, Z.s1 - 300], [0, Z.s1 - 1100]]],
    ["cal.flujo.tubo1", "ev-jugo-flujo", [[0, Z.s0 + 1100], [0, Z.s0 + 300]]],
  ], (u, z) => eW(u, -3, z), 3, { h: 5, w: 2.4 });
}

/* 1f · las boquillas de la coraza: el vapor de calentamiento entra arriba a la izquierda; arriba a la derecha el
   venteo de los incondensables, con su válvula; abajo, a ras del espejo, el condensado */
{
  const VP = CL.vapor, VT = CL.venteo, CO = CL.condensado;
  const zVap = Z.s1 - VP.dz, zVent = Z.s1 - VT.dz, zCond = Z.s0 + CO.dz;
  const a = nozzle("cal.vapor", SHELL_SOLID, VP.deg, zVap, D25, VP.cuello);
  disc("cal.vapor.fl2", a.F, a.s, a.s + D25.ft, D25.fl, {}, { owner: "cal.vapor", cls: "ev-cast" });
  const s0 = a.s + D25.ft, s1 = s0 + 330;
  tubeItems("cal.vapor.pipe", [G.pointOf(a.F, s0, 0, 0), G.pointOf(a.F, s1, 0, 0)], D25.ro, { cls: "ev-pipe" });
  flangePair("cal.vapor.end", a.F, s1, D25);
  ANCH.VAPOR = add(G.pointOf(a.F, (s0 + s1) / 2, 0, 0), [0, 0, D25.ro]);
  // la placa de choque: un trozo de cilindro frente a la boca, sobre el hueco que dejan las tres posiciones sin tubo
  {
    const CH = VP.choque, n = 24, f0 = (VP.deg - CH.media) * D2R, f1 = (VP.deg + CH.media) * D2R, poly = [];
    for (let i = 0; i <= n; i++) { const t = f0 + ((f1 - f0) * i) / n; poly.push([CH.r * Math.cos(t), CH.r * Math.sin(t)]); }
    for (let i = n; i >= 0; i--) { const t = f0 + ((f1 - f0) * i) / n; poly.push([(CH.r + CH.t) * Math.cos(t), (CH.r + CH.t) * Math.sin(t)]); }
    fp("cal.choque", FE, poly, zVap - CH.alto / 2, zVap + CH.alto / 2, {}, { owner: "cal.choque", cls: "ev-in" });
    // dos barras la cuelgan de la pared
    [-1, 1].forEach((sg, i) => {
      const deg = VP.deg + sg * (CH.media - 6), F = { o: [0, 0, zVap + sg * (CH.alto / 2 - 30)], a: dE(deg), u: tE(deg), v: ZD3 };
      disc(`cal.choque.barra${i}`, F, CH.r + CH.t, R + 1, 6, {}, { owner: "cal.choque", cls: "ev-in", n: 12 });
    });
  }
  const v = nozzle("cal.venteo", SHELL_SOLID, VT.deg, zVent, D2, VT.cuello);
  const vv = ballValve("cal.venteo.valv", v.F, v.s, D2, { open: true, stem: ZD3, Lv: 110, lever: 110 });
  const u0 = vv.s1, u1 = u0 + 160;
  tubeItems("cal.venteo.pipe", [G.pointOf(v.F, u0, 0, 0), G.pointOf(v.F, u1, 0, 0)], D2.ro, { cls: "ev-pipe" });
  flangePair("cal.venteo.end", v.F, u1, D2);
  ANCH.VENTEO = add(vv.body, [0, 0, vv.r1 * 0.8]);
  const c = nozzle("cal.cond", SHELL_SOLID, CO.deg, zCond, D4, CO.cuello);
  disc("cal.cond.fl2", c.F, c.s, c.s + D4.ft, D4.fl, {}, { owner: "cal.cond", cls: "ev-cast" });
  // la línea sale derecho hasta pasar la columna de la estructura y ahí baja
  const sOut = (CL.estructura.du + CL.estructura.col / 2 + 200) / Math.cos(CO.deg * D2R);
  const p0 = G.pointOf(c.F, c.s + D4.ft, 0, 0), p1 = G.pointOf(c.F, sOut, 0, 0);
  lineaHasta("cal.cond", [p0, p1, [p1[0], p1[1], zCond - 520]], D4, 72);
  ANCH.CONDENSADO = add(G.pointOf(c.F, c.s + D4.ft + 60, 0, 0), [0, 0, -D4.ro]);
}

/* 1g · las orejas y la estructura: dos columnas detrás, con una ménsula bajo cada oreja y, arriba, una viga con la guía
   de la coraza (media banda, cortada con la calandria) */
{
  const LG = CL.orejas, ST = CL.estructura, zl0 = LG.z, zl1 = zl0 + LG.h, c = ST.col / 2, b = ST.viga;
  LG.degs.forEach((deg, i) => {
    const ax = dE(deg), tg = tE(deg), Fl = { o: [0, 0, 0], a: ax, u: tg, v: ZD3 };
    const rEnd = ST.du / Math.abs(Math.cos(deg * D2R)) + 60;
    fp(`cal.oreja${i}.base`, Fl, rect(-LG.w / 2, zl0, LG.w / 2, zl0 + LG.t), RO, rEnd, {}, { owner: `cal.oreja${i}`, cls: "ev-ss" });
    [-1, 1].forEach((sg, j) => {
      const uu = sg * (LG.w / 2 - LG.t / 2 - 8), rIn = Math.sqrt(RO * RO - (Math.abs(uu) + LG.t / 2) ** 2) - 0.5;
      const Fg = { o: [0, 0, 0], a: tg, u: ax, v: ZD3 };
      fp(`cal.oreja${i}.g${j}`, Fg, [[rIn, zl0 + LG.t], [rEnd - 4, zl0 + LG.t], [rEnd - 4, zl0 + LG.t + 50], [rIn, zl1]], uu - LG.t / 2, uu + LG.t / 2, {}, { owner: `cal.oreja${i}`, cls: "ev-ss" });
    });
  });
  ANCH.OREJA = ePol(ST.du / Math.abs(Math.cos(LG.degs[1] * D2R)) + 20, LG.degs[1], zl0 + 60);
  const FcolAt = (u, n) => ({ o: eW(u, n, 0), a: ZD3, u: uE, v: nE });
  [-1, 1].forEach((sg, i) => {
    const u = sg * ST.du, n = ST.n;
    fp(`est.base${i}`, FcolAt(u, n), rect(-c - 60, -c - 60, c + 60, c + 60), 0, 20, {}, { owner: `est${i}`, cls: "ev-paint", ground: true });
    fp(`est.col${i}`, FcolAt(u, n), rect(-c, -c, c, c), 20, ST.alto, {}, { owner: `est${i}`, cls: "ev-paint" });
    // la ménsula: de la columna hacia adelante, bajo la oreja, con su cartela
    const nArm = -RO * Math.abs(Math.sin(LG.degs[i] * D2R)) + 70;
    fp(`est.brazo${i}`, { o: eW(u, 0, 0), a: nE, u: uE, v: ZD3 }, rect(-c * 0.6, zl0 - b, c * 0.6, zl0), n + c, nArm, {}, { owner: `est${i}`, cls: "ev-paint" });
    fp(`est.cartela${i}`, { o: eW(u, 0, 0), a: uE, u: nE, v: ZD3 }, [[n + c, zl0 - b - 600], [n + c, zl0 - b], [n + c + 520, zl0 - b]], -12, 12, {}, { owner: `est${i}`, cls: "ev-paint" });
  });
  const GU = CL.guia;
  fp("est.viga", { o: eW(0, ST.n, 0), a: uE, u: nE, v: ZD3 }, rect(-c, GU.z - b / 2, c, GU.z + b / 2), -ST.du + c, ST.du - c, {}, { owner: "est0", cls: "ev-paint" });
  ANCH.ESTRUCTURA = eW(ST.du + c, ST.n, 6200);
  // la guía: media banda alrededor de la coraza, con dos tirantes hasta la viga
  bridaCorte("cal.guia", GU.z - GU.alto / 2, GU.z + GU.alto / 2, RO, RO + GU.t, { owner: "cal.guia", cls: "ev-paint" });
  [-1, 1].forEach((sg, i) => {
    const u = sg * 130, nIn = -Math.sqrt((RO + GU.t) ** 2 - (Math.abs(u) - 20) ** 2) - 0.5;
    fp(`est.tirante${i}`, { o: eW(u, 0, 0), a: nE, u: uE, v: ZD3 }, rect(-20, GU.z - 40, 20, GU.z + 40), ST.n + c, nIn, {}, { owner: "cal.guia", cls: "ev-paint" });
  });
  ANCH.GUIA = eW(RO + GU.t, 0, GU.z);
}

/* ====================================================================
   2 · la línea de la mezcla y el separador ciclónico (entero)
   ==================================================================== */
const FS = { o: sepXY, a: ZD3, u: uE, v: nE };
{
  // el cuerpo: el cono de abajo, el cilindro y el fondo 2:1 de arriba hasta el cuello del vapor
  const HDs = SP.cabeza * 2 * RSo, prof = [[Z.sepCono0, D5.ro], [Z.sepCono1, RSo, 0], [Z.sepCil1, RSo, 0]];
  const rTop = D3.ro;
  const sTop = Z.sepCil1 + HDs * Math.sqrt(1 - (rTop / RSo) ** 2);
  for (let i = 1; i <= 16; i++) { const s = Z.sepCil1 + ((sTop - Z.sepCil1) * i) / 16; prof.push([s, RSo * Math.sqrt(Math.max(0, 1 - ((s - Z.sepCil1) / HDs) ** 2)), i < 16 ? 1 : 0]); }
  // el cono con el cilindro y, aparte, el fondo de arriba
  turned("sep.cuerpo", FS, prof.slice(0, 3), {}, { owner: "sep", cls: "ev-ss" });
  turned("sep.cabeza", FS, prof.slice(2).map((q, i) => (i === 0 ? [q[0], q[1], 1] : q)), {}, { owner: "sep", cls: "ev-ss", smooth: true });
  const SEP_SOLID = A.solid(FS, prof, { name: "sep.macizo" });
  ANCH.SEPARADOR = eW(uS + RSo, nS, (Z.sepCono1 + Z.sepCil1) / 2 + 150);
  ANCH.SEP_CONO = eW(uS + D5.fl, nS, Z.sepSalida + D5.ft / 2);
  // la salida del jugo: el cuello DN 50 y su brida
  disc("sep.salida.cuello", FS, Z.sepSalida + D5.ft, Z.sepCono0 + 4, D5.ro, {}, { owner: "sep", cls: "ev-ss" });
  disc("sep.salida.fl", FS, Z.sepSalida, Z.sepSalida + D5.ft, D5.fl, {}, { owner: "sep", cls: "ev-ss" });
  // la salida del vapor: el cuello DN 300, su brida, la de la línea y la línea al efecto siguiente
  const zV1 = sTop + SP.cuelloVapor;
  disc("sep.vapor.cuello", FS, sTop - 6, zV1, D3.ro, {}, { owner: "sep", cls: "ev-ss" });
  disc("sep.vapor.fl", FS, zV1, zV1 + D3.ft, D3.fl, {}, { owner: "sep", cls: "ev-ss" });
  disc("lv.fl", FS, zV1 + D3.ft, zV1 + 2 * D3.ft, D3.fl, {}, { owner: "lv", cls: "ev-cast" });
  const z0 = zV1 + 2 * D3.ft;
  const rv = lineaHasta("lv", [add(sepXY, [0, 0, z0]), add(sepXY, [0, 0, z0 + 900]), add(eW(uS + 1050, nS, 0), [0, 0, z0 + 900])], D3, 457);
  ANCH.VAPOR_SIG = add(G.pointAlong(rv, G.pathLength(rv) * 0.82), [0, 0, D3.ro]);
  // la entrada tangencial: el cuello sale de la pared hacia la calandria, con su eje a eSep del eje del separador
  const Fin = { o: eW(uS, 0, Z.duct), a: mul(uE, -1), u: nE, v: ZD3 };
  const sIn = Math.sqrt(RSo * RSo - eSep * eSep) + 140;
  saddle("sep.entrada.cuello", Fin, D3.ro, (t) => Math.sqrt(Math.max(0, RSo * RSo - (eSep + D3.ro * Math.cos(t)) ** 2)), sIn, {}, { owner: "sep", cls: "ev-ss", hosts: [SEP_SOLID] });
  disc("sep.entrada.fl", Fin, sIn, sIn + D3.ft, D3.fl, {}, { owner: "sep", cls: "ev-ss" });
  disc("lm.fl1", Fin, sIn + D3.ft, sIn + 2 * D3.ft, D3.fl, {}, { owner: "lm", cls: "ev-cast" });
  ANCH.ENTRADA_T = add(G.pointOf(Fin, sIn - 70, 0, 0), [0, 0, -D3.ro]);
  // la línea de la mezcla: la brida de abajo de la calandria (entera), baja, codo de radio largo y derecho al separador
  disc("lm.fl0", FE, Z.lineaFl, Z.bocaFl0, D3.fl, {}, { owner: "lm", cls: "ev-cast" });
  const uEnd = uS - (sIn + 2 * D3.ft);
  const route = G.fillet([eW(0, 0, Z.lineaFl), eW(0, 0, Z.duct), eW(uEnd, 0, Z.duct)], EV.mezcla.codo, 20, { P, tube: D3.ro });
  tubeItems("lm.pipe", route, D3.ro, { cls: "ev-pipe", maxLength: 180 });
  ANCH.MEZCLA = eW(uEnd * 0.62, 0, Z.duct + D3.ro);
  // las patas: tres orejas en el cilindro y una pata de tubo bajo cada una, sobre su placa base
  const PT = SP.patas, zl = Z.sepCono1 + 120;
  for (let i = 0; i < PT.n; i++) {
    const deg = PT.fase + (360 / PT.n) * i, ax = dE(deg), tg = tE(deg), Fl = { o: sepXY, a: ax, u: tg, v: ZD3 };
    const rLeg = RSo + 70;
    fp(`sep.oreja${i}`, Fl, rect(-PT.pad.w / 2, zl, PT.pad.w / 2, zl + PT.pad.t), RSo - 0.5, rLeg + 70, {}, { owner: "sep", cls: "ev-ss" });
    fp(`sep.oreja${i}.g`, { o: sepXY, a: tg, u: ax, v: ZD3 }, [[RSo - 0.5, zl + PT.pad.t], [rLeg + 66, zl + PT.pad.t], [rLeg + 66, zl + PT.pad.t + 40], [RSo - 0.5, zl + PT.pad.h]], -PT.pad.t / 2, PT.pad.t / 2, {}, { owner: "sep", cls: "ev-ss" });
    const Fleg = { o: add(sepXY, mul(ax, rLeg)), a: ZD3, u: ax, v: tg };
    disc(`sep.pata${i}`, Fleg, 16, zl, PT.r, {}, { owner: `sep.pata${i}`, cls: "ev-ss" });
    fp(`sep.pata${i}.base`, Fleg, rect(-90, -90, 90, 90), 0, 16, {}, { owner: `sep.pata${i}`, cls: "ev-ss", ground: true });
  }
  ANCH.SEP_PATA = add(add(sepXY, mul(dE(PT.fase + 120), RSo + 70 + PT.r)), [0, 0, 600]);
}

/* ====================================================================
   3 · la bomba centrífuga del jugo y sus líneas: la succión baja del separador, viene hacia el lector y entra por la
   izquierda; la descarga sube y sigue a la etapa siguiente
   ==================================================================== */
{
  const F = { o: eW(0, nB, BM.z), a: uE, u: nE, v: ZD3 };          // el eje de la bomba, a lo largo de u
  F.o = eW(uS, nB, BM.z);
  const F0 = { ...F, o: eW(uS, nB, 0) };                           // el mismo eje, con el origen en el piso (para las piezas que se paran en él)
  const C_ = BM.casco, sS = BM.succion, nc = sS + 110 + C_.ancho / 2;   // la cara de la brida de succión y el centro del caracol
  const s1 = nc + C_.ancho / 2, s2 = s1 + BM.soporte, s3 = s2 + 100, s4 = s3 + BM.motor.largo;
  // la base, el pie del caracol y el soporte de los rodamientos
  fp("bomba.base", F0, rect(-230, 0, 230, BM.base.alto), sS - 60, s4 + 120, {}, { owner: "bomba", cls: "ev-paint", ground: true });
  fp("bomba.pie", F0, rect(-70, BM.base.alto, 70, BM.z - C_.r + 6), nc - 40, nc + 40, {}, { owner: "bomba", cls: "ev-cast" });
  // el caracol (un disco grueso), la succión con su brida y la descarga arriba, hacia un lado del eje
  disc("bomba.casco", F, nc - C_.ancho / 2, nc + C_.ancho / 2, C_.r, {}, { owner: "bomba", cls: "ev-cast" });
  disc("bomba.succion", F, sS + D5.ft, nc - C_.ancho / 2 + 2, D5.ro + 6, {}, { owner: "bomba", cls: "ev-cast" });
  disc("bomba.succion.fl", F, sS, sS + D5.ft, D5.fl, {}, { owner: "bomba", cls: "ev-cast" });
  const off = -C_.r * 0.55;                                         // la descarga, tangente al caracol, del lado de atrás
  const Fd = { o: add(pF(nc, 0), mul(nE, off)), a: ZD3, u: uE, v: nE };
  const zD0 = BM.z + Math.sqrt(C_.r * C_.r - off * off) - 6, zD1 = BM.z + C_.r + 70;
  disc("bomba.descarga", Fd, zD0, zD1, D4.ro + 5, {}, { owner: "bomba", cls: "ev-cast" });
  disc("bomba.descarga.fl", Fd, zD1, zD1 + D4.ft, D4.fl, {}, { owner: "bomba", cls: "ev-cast" });
  disc("bomba.soporte", F, s1 - 2, s2, 62, {}, { owner: "bomba", cls: "ev-cast" });
  fp("bomba.soporte.pie", F0, rect(-80, BM.base.alto, 80, BM.z - 56), s1 + 40, s2 - 30, {}, { owner: "bomba", cls: "ev-cast" });
  // el acople con su guarda y el motor con sus aletas, su caja de conexiones y la tapa del ventilador
  fp("bomba.guarda", F0, rect(-75, BM.base.alto, 75, BM.z + 75), s2, s3, {}, { owner: "bomba", cls: "ev-yel" });
  const RM = BM.motor.r;
  disc("motor.cuerpo", F, s3, s4, RM, {}, { owner: "motor", cls: "ev-motor", extra: Ln(G.ribsOf(F, s3 + 30, s4 - 20, RM + 0.3, 24, P, { least: 0.1, seams: true }), { tone: "faint" }) });
  disc("motor.tapa", F, s4, s4 + 70, RM - 8, {}, { owner: "motor", cls: "ev-motor" });
  fp("motor.pie", F0, rect(-RM * 0.85, BM.base.alto, RM * 0.85, BM.z - RM * 0.6), s3 + 40, s4 - 40, {}, { owner: "motor", cls: "ev-motor" });
  fp("motor.caja", F0, rect(-45, BM.z + RM - 4, 45, BM.z + RM + 60), s3 + 90, s3 + 200, {}, { owner: "motor", cls: "ev-motor" });
  ANCH.BOMBA = G.pointOf(F, nc, C_.r, PI / 2);
  ANCH.MOTOR = G.pointOf(F, (s3 + s4) / 2, RM, PI / 2);
  // la succión: del separador baja, viene hacia el lector, da la vuelta y entra a la brida de la bomba
  disc("ls.fl", FS, Z.sepSalida - D5.ft, Z.sepSalida, D5.fl, {}, { owner: "ls", cls: "ev-cast" });
  const rs = G.fillet([add(sepXY, [0, 0, Z.sepSalida - D5.ft]), add(sepXY, [0, 0, BM.z]), pF(0), pF(sS - D5.ft)], 150, 20, { P, tube: D5.ro });
  tubeItems("ls.pipe", rs, D5.ro, { cls: "ev-pipe" });
  disc("ls.fl2", F, sS - D5.ft, sS, D5.fl, {}, { owner: "ls", cls: "ev-cast" });
  ANCH.SUCCION = add(sepXY, [0, 0, (Z.sepSalida + BM.z) / 2 + 60]);
  // la descarga: sube, da la vuelta hacia la derecha y sigue a la etapa siguiente
  disc("ld.fl", Fd, zD1 + D4.ft, zD1 + 2 * D4.ft, D4.fl, {}, { owner: "ld", cls: "ev-cast" });
  const pd0 = add(Fd.o, [0, 0, zD1 + 2 * D4.ft]);
  const rd = lineaHasta("ld", [pd0, add(pd0, [0, 0, 1350 - pd0[2]]), add(pd0, add(mul(uE, s4 + 300 - nc), [0, 0, 1350 - pd0[2]]))], D4, 72, { owner: "ld" });
  ANCH.DESCARGA = add(G.pointAlong(rd, G.pathLength(rd) * 0.8), [0, 0, D4.ro]);
}

/* ====================================================================
   4 · la persona de referencia: 1,75 m, de pie en el piso, al pie del separador
   ==================================================================== */
{
  const PS = EV.persona, pie = eW(PS.u, PS.n, 0);
  const rumbo = Math.atan2(nE[1] * Math.cos(PS.rumbo * D2R) + uE[1] * Math.sin(PS.rumbo * D2R), nE[0] * Math.cos(PS.rumbo * D2R) + uE[0] * Math.sin(PS.rumbo * D2R)) / D2R;
  const per = personaDePie({ P, pie, rumbo, mm: 1, adelante: "izq" });
  per.shapes.forEach(record);
  put("persona", per.ref, per.svg, per.shapes);
  ANCH.PERSONA = per.anclas?.PECHO ?? add(pie, [0, 0, 1300]);
}

/* ---------- las caras del corte de la calandria, un elemento por pieza ---------- */
{
  const groups = new Map();
  for (const c of cutE) { const key = c.owner + "|" + c.cls; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls] = key.split("|");
    // las caras de las piezas largas van en tramos, para que cada una ordene con lo que tiene al lado
    const tramos = [];
    for (const c of list) {
      const zs = c.poly.map((p) => p[1]), z0 = Math.min(...zs), z1 = Math.max(...zs);
      if (z1 - z0 < 1600) { tramos.push([c]); continue; }
      const n = Math.ceil((z1 - z0) / 1500);
      for (let i = 0; i < n; i++) {
        const za = z0 + ((z1 - z0) * i) / n, zb = z0 + ((z1 - z0) * (i + 1)) / n;
        tramos.push([{ ...c, poly: c.poly.map(([u, z]) => [u, Math.min(zb, Math.max(za, z))]) }]);
      }
    }
    // los tramos que están a la misma altura se juntan
    const bins = new Map();
    for (const t of tramos) { const zc = (Math.min(...t[0].poly.map((p) => p[1])) + Math.max(...t[0].poly.map((p) => p[1]))) / 2, b = Math.floor(zc / 1500); if (!bins.has(b)) bins.set(b, []); bins.get(b).push(t[0]); }
    let j = 0;
    for (const lst of bins.values()) {
      const d = lst.map((c) => pth1(c.poly.map(([u, z]) => pr(eW(u, 0, z))))).join("");
      const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
      const shapes = lst.map((c) => record(A.prism(FYE, c.poly, -0.3, 0, { name: `${owner}.corte${j}`, owner })));
      const cx = lst.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = lst.reduce((q, c) => q + c.poly.length, 0);
      put(`${owner}.corte${j}`, eW(cx[0] / n, 0, cx[1] / n), svg, shapes);
      j++;
    }
  }
}
}

/* ====================================================================
   5 · el detalle (--detalle): la boca del tubo del centro en el espejo de arriba, abierta por su eje (el plano del
   corte): el espejo cortado con las bocas vecinas, la pared del tubo, la niebla que baja, el jugo que se junta sobre el
   espejo y entra por el borde, la película que se forma en la pared y baja, el vapor del jugo por el centro y, bajo el
   espejo, el vapor de calentamiento de la coraza. La película va más gruesa que la real para que se vea.
   ==================================================================== */
if (DET) {
  const ri = TR.ri, ro = TR.ro, zT = Z.top, zt0 = Z.s1, zc = CDET[2];
  const z0 = zc - 80, z1 = zc + 80;
  const df = 2;                                                   // la película que se dibuja (la real, de 0,7 a 0,8 mm)
  const FT = { o: eW(0, 0, 0), a: ZD3, u: uE, v: nE };
  // el espejo: la mitad de atrás de un bloque, con la muesca del tubo y los agujeros de los vecinos (que no se cortan)
  {
    // un trozo del espejo de 200 × 110 mm (la mitad de atrás), con las muescas del tubo y de sus dos vecinos de la fila
    // del corte
    const half = 100, back = 260, cs = [TR.p, 0, -TR.p], poly = [[-half, 0], [-half, -back], [half, -back], [half, 0]];
    for (const c of cs) for (let i = 0; i <= 24; i++) { const t = (PI * i) / 24; poly.push([c + ro * Math.cos(t), -ro * Math.sin(t)]); }
    const vecinos = TB.atras.filter((t) => Math.abs(t.u) < half + ro && t.n > -back - ro);
    const clip = `evDetEsp`;
    DEFS.push(`<clipPath id="${clip}"><path d="${pth1([[-half, 0], [half, 0], [half, -back], [-half, -back]].map(([u, n]) => pr(eW(u, n, zT + 0.5))))}"/></clipPath>`);
    // las bocas de los vecinos de atrás: el extremo del tubo, el hueco y el jugo que entra por el borde, en anillo
    const mouths = vecinos.map((t) => pth1(circ(tubeF(t), zT + 0.3, ro, 48).map(pr))).join("");
    const bores = vecinos.map((t) => pth1(circ(tubeF(t), zT + 0.4, ri, 48).map(pr))).join("");
    const rings = vecinos.map((t) => pth1(circ(tubeF(t), zT + 0.5, ri, 48).map(pr)) + pth1(circ(tubeF(t), zT + 0.5, ri - 2, 48).map(pr).reverse())).join("");
    fp("det.espejo", FT, poly, zt0, zT, {}, { owner: "det.espejo", cls: "ev-ss", ground: true, extra: `<g clip-path="url(#${clip})"><path class="ev-tubo-boca" d="${mouths}"/><path class="ev-bore" d="${bores}"/><path class="ev-pelicula-sec" d="${rings}"/></g>` });
    // la cara del corte del espejo, a los dos lados del tubo
    const faces = [rect(-half, zt0, -TR.p - ro, zT), rect(-TR.p + ro, zt0, -ro, zT), rect(ro, zt0, TR.p - ro, zT), rect(TR.p + ro, zt0, half, zT)];
    const d = faces.map((p) => pth1(p.map(([u, z]) => pr(eW(u, 0, z))))).join("");
    put("det.espejo.corte", eW(0, 0, zT - 20), `<g class="iso-solid ev-cut"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`,
      faces.map((p) => record(A.prism(FYE, p, -0.3, 0, { name: "det.espejo.corte", owner: "det.espejo" }))));
    ANCH.D_ESPEJO = eW(-(ro + TR.p - ro) / 2, 0, zT - 14);
    ANCH.D_BOCA = eW(TB.atras.find((t) => t.fila === -1 && t.u < 0 && t.u > -64)?.u ?? -31.75, -55 + ro, zT);
  }
  // la pared del tubo: la cara de adentro de la mitad de atrás y las dos caras del corte (desde la cara de arriba del
  // espejo, donde el tubo está expandido, hacia abajo)
  {
    const id = "evDetTubo";
    DEFS.push(`<clipPath id="${id}"><path d="${pth1([[-ri, z0 - 10], [ri, z0 - 10], [ri, zT], [-ri, zT]].map(([u, z]) => pr(eW(u, 0, z))))}"/></clipPath>`);
    put("det.pared", eW(0, -ri * 0.7, (z0 + zT) / 2), `<g clip-path="url(#${id})">${toned((o) => surface(cP(ri, z0 - 10, zT), cN(-1), PI, TAU, 96, 1, o), "ev-in")}</g>`,
      [record(A.body(FT, [[z0 - 10, ri], [zT, ri], [zT, ro], [z0 - 10, ro]], { name: "det.pared", owner: "det.tubo", cut: [FRONT_E] }))]);
    const faces = [rect(ri, z0 - 10, ro, zT), rect(-ro, z0 - 10, -ri, zT)];
    const d = faces.map((p) => pth1(p.map(([u, z]) => pr(eW(u, 0, z))))).join("");
    put("det.pared.corte", eW(0, 0, zt0), `<g class="iso-solid ev-cut1"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`,
      faces.map((p) => record(A.prism(FYE, p, -0.6, -0.3, { name: "det.pared.corte", owner: "det.tubo" }))));
    ANCH.D_PARED = eW(-(ri + ro) / 2, 0, zT - 44);
  }
  // el jugo: una capa sobre el espejo que entra por el borde de la boca, y la película que baja por la pared y engruesa
  {
    const dfAt = (z) => (z >= zT - 1 ? 0.6 : Math.min(df, 0.6 + (df - 0.6) * Math.min(1, (zT - z) / 25)));
    const NF = 48, zs = Array.from({ length: 25 }, (_, i) => zT - ((zT - (z0 - 10)) * i) / 24);
    // la superficie de la película sobre la mitad de atrás (translúcida)
    const surf = [];
    for (let i = 0; i < zs.length; i++) surf.push(...[[], []]);
    const outline = [...zs.map((z) => eW((ri - dfAt(z)) * Math.cos(PI), 0, z)), ...Array.from({ length: NF + 1 }, (_, i) => { const f = PI + (PI * i) / NF; const r = ri - dfAt(z0 - 10); return eW(r * Math.cos(f), r * Math.sin(f), z0 - 10); }), ...zs.slice().reverse().map((z) => eW(ri - dfAt(z), 0, z)), ...Array.from({ length: NF + 1 }, (_, i) => { const f = TAU - (PI * i) / NF; return eW(ri * 0.98 * Math.cos(f), ri * 0.98 * Math.sin(f), zT); })];
    // las caras de la película en el corte, a los dos lados (más gruesas abajo)
    const strip = (sg) => [...zs.map((z) => [sg * ri, z]), ...zs.slice().reverse().map((z) => [sg * (ri - dfAt(z)), z])];
    let waves = "";
    for (let q = 0; q < 4; q++) {
      const zw = zT - 16 - q * 13, amp = 0.7;
      waves += path3(Array.from({ length: 49 }, (_, i) => { const f = PI + (PI * i) / 48; const r = ri - dfAt(zw); return eW(r * Math.cos(f), r * Math.sin(f), zw + amp * Math.sin(3 * f + q)); }));
    }
    const shapes = [A.prism(FT, halfRing(ri - df, ri, 32), z0 - 10, zT, { name: "det.pelicula", owner: "det.tubo" })];
    // la flecha de la película, sobre ella: baja por la pared
    const fa = 1.5 * PI - 0.5, rr = ri - df - 0.4, flecha = arrowSvg([[0, zT - 14], [0, zT - 58]], (a, z) => eW(rr * Math.cos(fa), rr * Math.sin(fa), z), "ev-jugo-flujo").svg;
    put("det.pelicula", eW(0, -ri * 0.6, zT - 40), `<g class="ev-jugo"><path class="ev-pelicula" d="${pth1(outline.map(pr))}"/><path class="ev-pelicula-sec" d="${pth1(strip(1).map(([u, z]) => pr(eW(u, 0.05, z))))}${pth1(strip(-1).map(([u, z]) => pr(eW(u, 0.05, z))))}"/>${Ln(waves, { tone: "lo" })}${flecha}</g>`, shapes);
    ANCH.D_PELICULA = eW(-(ri - df / 2), 0.05, zT - 28);
  }
  // la niebla: gotas de varios tamaños que bajan del cono, más juntas sobre la boca, y unas que chocan con la pared
  {
    let dG = "", dB = "";
    const shapes = [];
    const placed = [];
    for (let i = 0; i < 4000 && placed.length < 190; i++) {
      const u = (rnd() * 2 - 1) * 110, n = -rnd() * 200, z = zT + 3 + rnd() * (z1 - zT + 20);
      if (Math.hypot(u, n) < 4) continue;
      const r = 0.35 + 1.4 * rnd() ** 2;
      const p = eW(u, n, z);
      if (placed.some((q) => G.len3(G.sub3(q[0], p)) < q[1] + r + 1.2)) continue;
      placed.push([p, r]);
    }
    // dentro del tubo, unas cuantas gotas que siguen bajando con el vapor
    for (let i = 0; i < 300 && placed.length < 210; i++) {
      const f = PI + PI * rnd(), rr = (ri - df - 3) * Math.sqrt(rnd()), z = zT - 6 - rnd() * 60, r = 0.3 + 0.6 * rnd();
      const p = eW(rr * Math.cos(f), rr * Math.sin(f), z);
      if (placed.some((q) => G.len3(G.sub3(q[0], p)) < q[1] + r + 1.2)) continue;
      placed.push([p, r]);
    }
    placed.sort((a, b) => G.dot3(a[0], V3) - G.dot3(b[0], V3));
    for (const [p, r] of placed) {
      const c = at(p), rs = r * G.scaleOf(P);
      dG += pth1(Array.from({ length: 14 }, (_, i) => { const t = (TAU * i) / 14; return [c[0] + rs * Math.cos(t), c[1] + rs * Math.sin(t)]; }));
      dB += pth1(Array.from({ length: 8 }, (_, i) => { const t = (TAU * i) / 8; return [c[0] - rs * 0.35 + rs * 0.3 * Math.cos(t), c[1] - rs * 0.35 + rs * 0.3 * Math.sin(t)]; }));
      shapes.push(A.ball(p, r, { name: "det.niebla", owner: "det.niebla" }));
    }
    put("det.niebla", eW(0, -50, zT + 40), `<g class="ev-jugo"><path class="ev-gota" d="${dG}"/><path class="ev-brillo" d="${dB}"/></g>`, shapes);
    // el ancla: una gota grande arriba a la izquierda, dentro del círculo
    const c0 = at(CDET), Rv = RDET * 0.78;
    const gr = placed.filter(([p, r]) => { const q = at(p); return q[0] < c0[0] - RDET * 0.2 && q[1] < c0[1] - RDET * 0.45 && Math.hypot(q[0] - c0[0], q[1] - c0[1]) < Rv && r > 0.8; }).sort((a, b) => b[1] - a[1])[0];
    ANCH.D_NIEBLA = gr ? gr[0] : eW(-40, -20, zT + 30);
  }
  // las flechas: la niebla baja hacia la boca y el vapor del jugo baja por el centro
  arrows([
    ["det.flujo.n0", "ev-jugo-flujo", [[-34, z1 + 4], [-12, zT + 22], [-4, zT - 26]]],
    ["det.flujo.n1", "ev-jugo-flujo", [[34, z1 + 4], [12, zT + 22], [4, zT - 26]]],
    ["det.flujo.v", "ev-jugo-flujo", [[0, zT - 30], [0, z0 + 6]]],
  ], (u, z) => eW(u, -2, z), 0.6);
  ANCH.D_VAPOR = eW(0.4, -2, zT - 34);
  // bajo el espejo, del lado de la coraza: el tubo de atrás vecino, entero, y el vapor de calentamiento (la flecha)
  {
    const sec = Array.from({ length: 40 }, (_, i) => { const a = (TAU * i) / 40; return [ro * Math.cos(a), ro * Math.sin(a)]; });
    for (const t of TB.atras.filter((q) => q.fila === -1 && Math.abs(q.u) < 40)) {
      const F = { o: eW(t.u, t.n, 0), a: ZD3, u: uE, v: nE };
      put(`det.vecino${t.u}`, eW(t.u, t.n, (z0 - 10 + zt0) / 2), wrap(X.prismSvg(C, sec, z0 - 10, zt0, { F, tone: "mid" }), "ev-tubo"), [record(A.disc(F, z0 - 10, zt0, ro, { name: `det.vecino${t.u}`, owner: `det.vecino${t.u}` }))]);
    }
    for (const sg of [-1, 1]) {
      const F = { o: eW(sg * TR.p, 0, 0), a: ZD3, u: uE, v: nE };
      const film = `<path class="ev-pelicula" d="${pth1([...eArc(ri - 0.6, zT, PI, TAU, 36, sg * TR.p), ...eArc(ri - df, z0 - 10, TAU, PI, 36, sg * TR.p)].map(pr))}"/>`;
      put(`det.corte${sg}`, eW(sg * TR.p, -ri * 0.6, (z0 - 10 + zT) / 2), toned((o) => surface(cP(ri, z0 - 10, zT, sg * TR.p), cN(-1), PI, TAU, 64, 1, o), "ev-in") + film,
        [record(A.body(F, [[z0 - 10, ri], [zT, ri], [zT, ro], [z0 - 10, ro]], { name: `det.corte${sg}`, owner: `det.corte${sg}`, cut: [FRONT_E] }))]);
      const faces = [rect(sg * TR.p + ri, z0 - 10, sg * TR.p + ro, zT), rect(sg * TR.p - ro, z0 - 10, sg * TR.p - ri, zT)];
      const d = faces.map((p) => pth1(p.map(([u, z]) => pr(eW(u, 0, z))))).join("");
      put(`det.corte${sg}.cara`, eW(sg * TR.p, 0, zt0 - 30), `<g class="iso-solid ev-cut1"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`,
        faces.map((p) => record(A.prism(FYE, p, -0.6, -0.3, { name: `det.corte${sg}.cara`, owner: `det.corte${sg}` }))));
    }
    arrows([["det.flujo.cal", "ev-vapor", [[-ro - 6.5, zt0 - 8], [-ro - 6.5, zt0 - 48]]]], (u, z) => eW(u, -1, z), 0.6);
    ANCH.D_CALEFACCION = eW(-ro - 6.5, -1, zt0 - 30);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.EV_ITEM) {
  for (const nm of process.env.EV_ITEM.split(",")) {
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
const CSS_EV = `.ev-cut{${shades("#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3", "#c9ced3")}}
.ev-cut1{${shades("#d6dade", "#d6dade", "#d6dade", "#d6dade", "#d6dade", "#d6dade", "#d6dade")}}
.ev-ss{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#ccd1d6", "#d5d9dd", "#dde1e4", "#e5e8ea")}}
.ev-in{${shades("#e9ecef", "#e9ecef", "#f1f3f5", "#c3c9cf", "#ccd1d6", "#d5d9de", "#dde1e5")}}
.ev-tubo{${shades("#eef0f2", "#eef0f2", "#f7f8f9", "#ccd1d6", "#d5d9dd", "#dde1e4", "#e5e8ea")}}
.ev-pipe{${shades("#f1f3f4", "#f1f3f4", "#f9fafa", "#d2d6da", "#dadee1", "#e2e5e7", "#e9ebed")}}
.ev-trim{${shades("#f4f5f6", "#f4f5f6", "#fbfbfc", "#d6d9dc", "#dfe2e4", "#e7e9eb", "#eef0f1")}}
.ev-cast{${shades("#e3e6e9", "#e3e6e9", "#eceef0", "#c4c9ce", "#cdd1d5", "#d5d9dc", "#dde0e3")}}
.ev-lever{${shades("#d9dde1", "#d9dde1", "#e6e9ec", "#aeb5bc", "#b8bfc5", "#c2c8ce", "#ccd1d6")}}
.ev-paint{${shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#b9c1c6", "#c4cbd0", "#ced4d8", "#d8dde0")}}
.ev-motor{${shades("#e4e8ea", "#e4e8ea", "#edf0f1", "#b9c1c6", "#c4cbd0", "#ced4d8", "#d8dde0")}}
.ev-yel{${shades("#f3e9a6", "#f3e9a6", "#f8f1c4", "#dccf7e", "#e4d88d", "#ebe09a", "#efe5a1")}}
.ev-bore{fill:#9fadb8;stroke:none}.ev-bore-dk{fill:#5f6a74;stroke:none}.ev-tubo-boca{fill:#d5d9dd;stroke:#8d969e;stroke-width:.3px}
.ev-pelicula{fill:#e3cf7a;fill-opacity:.5;stroke:none}.ev-pelicula-sec{fill:#e3cf7a;fill-opacity:.9;stroke:none}
.ev-niebla{fill:#e3cf7a;fill-opacity:.2;stroke:none}
.ev-gota{fill:#b08a1e;stroke:none}.ev-brillo{fill:#f7f0d2;stroke:none}
.ev-jugo .iso-line[data-tone="lo"]{stroke:#b08a1e}
.ev-vapor{fill:none;stroke:#c8452b;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.ev-vapor-p{fill:#c8452b;stroke:none;opacity:.85}
.ev-jugo-flujo{fill:none;stroke:#2f5f86;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.ev-jugo-flujo-p{fill:#2f5f86;stroke:none;opacity:.85}
.ev-det-fondo{fill:#f1f3f5;stroke:none}.ev-det-marco{fill:none;stroke:#525c64;stroke-width:1px}
.ev-det-marca{fill:none;stroke:#525c64;stroke-width:1px}.ev-det-linea{fill:none;stroke:#525c64;stroke-width:1px}`;
const CSS = CSS_EV + "\n" + CSS_PERSONA;
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
  ? k.figureSvg({ width: WD, height: WD, label: "La boca de un tubo, ampliada", body: [`<style>${CSS}</style><defs><clipPath id="evDet"><circle cx="${WD / 2}" cy="${WD / 2}" r="${RDET}"/></clipPath>${DEFS.join("")}</defs><g class="ev-items" clip-path="url(#evDet)"><circle class="ev-det-fondo" cx="${WD / 2}" cy="${WD / 2}" r="${RDET}"/>${groupsSvg.join("")}</g><circle class="ev-det-marco" cx="${WD / 2}" cy="${WD / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W, height: H, label: "Una etapa del TASTE", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="ev-items">${groupsSvg.join("")}</g>`] });
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUT, DET ? "detalle.svg" : "fig.svg"), svgOut);
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUT, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Una etapa del TASTE", theme: "light", width: DET ? 400 : 1000, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUT, DET ? "detalle_data.json" : "fig_data.json"), JSON.stringify({ P, W: DET ? WD : W, H: DET ? WD : H, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, PA, {});
