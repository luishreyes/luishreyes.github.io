/* ====================================================================
   Los siete impulsores en isométrico (skill anatomy), para el capítulo 14 del libro de operaciones unitarias
   (Agitación): la hélice marina, la turbina de cuatro palas inclinadas, el hidrofoil, la turbina Rushton, la paleta,
   el ancla y la cinta helicoidal doble, cada uno con su trozo de eje, su cubo, su chaveta, sus prisioneros y sus pernos.
   Concepto: el lector reconoce cada impulsor por cómo está hecho: las palas torcidas y fundidas de la hélice, las palas
   planas empernadas a 45°, las palas anchas y torcidas del hidrofoil, el disco con seis palas de la Rushton, las dos
   palas planas de la paleta y, en su tanque, el ancla y la cinta que pasan a 30 mm de la pared.
   Las cinco turbinas van con el mismo diámetro (D = 450 mm) y la misma cámara, así se comparan; el ancla y la cinta, en
   su tamaño de pared, dentro de la mitad de atrás de un tanque de 1,2 m.
   Uso: node build.mjs [--imp=helice|pbt|hidrofoil|rushton|paleta|ancla|cinta|all] [--audit] [--fast]
   Unidades: 1 = 1 mm. Medidas en geo.mjs.
   ==================================================================== */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL("../../../.claude/skills/anatomy", import.meta.url));
const k = await import(KIT + "/kit/iso-kit.mjs");
const G = await import(KIT + "/kit/lathe.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const X = await import(join(HERE, "xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));

export const IMPS = ["helice", "pbt", "hidrofoil", "rushton", "paleta", "ancla", "cinta"];
const argImp = (process.argv.find((a) => a.startsWith("--imp=")) || "--imp=all").slice(6);
const WHICH = argImp === "all" ? IMPS : argImp.split(",");
for (const w of WHICH) if (!IMPS.includes(w)) throw new Error(`impulsor desconocido: ${w}`);
const AUDIT = process.argv.includes("--audit"), FAST = process.argv.includes("--fast");
const STEP = Number(process.env.IM_STEP || 0.25);
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });

const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const { add3, sub3, mul3, dot3, cross3, unit3 } = G;
const FZ = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });
const F0 = FZ();
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const er = (t) => [Math.cos(t), Math.sin(t), 0], et = (t) => [-Math.sin(t), Math.cos(t), 0];
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
const BANDS = [0, 0.2, 0.42, 0.62];
const BAND = (s) => { let t = 0; while (t < BANDS.length && s >= BANDS[t]) t++; return t; };

/* ---------- las dos cámaras: la de las turbinas y la de las de pared ---------- */
const WD = 600, HD = 500;               // el área del dibujo; libro.mjs le agrega los rótulos a los lados
function camTurb() {
  const { AZ, EL } = GEO.COMUN, ext = [];
  for (let d = 0; d < 360; d += 10) for (const z of [-75, 75]) ext.push([232 * Math.cos(d * D2R), 232 * Math.sin(d * D2R), z]);
  ext.push([0, 0, GEO.COMUN.sh.top + 4], [30, 0, GEO.COMUN.sh.top], [-30, 0, GEO.COMUN.sh.top], [0, 0, -118]);
  return k.fitProjection(ext, WD, HD, { pad: 8, azimuth: AZ, elevation: EL });
}
function camPared(AZ, EL) {
  const T = GEO.TANQUE, ext = [];
  for (let d = 0; d < 360; d += 10) for (const z of [0, T.top]) ext.push([(T.Rt + T.w) * Math.cos(d * D2R), (T.Rt + T.w) * Math.sin(d * D2R), z]);
  for (let d = 0; d < 360; d += 10) ext.push([(T.Rt + T.w) * 0.7 * Math.cos(d * D2R), (T.Rt + T.w) * 0.7 * Math.sin(d * D2R), -(T.hd + T.w) * 0.72]);
  ext.push([0, 0, -T.hd - T.w], [0, 0, GEO.ANCLA.sh.top + 4], [45, 0, GEO.ANCLA.sh.top]);
  return k.fitProjection(ext, WD, HD, { pad: 8, azimuth: AZ, elevation: EL });
}

/* ====================================================================
   el contexto de un impulsor: cámara, registro del audit y las piezas de dibujo
   ==================================================================== */
function contexto(P, U, pre) {
  const C = X.xCam(P), V3 = G.viewOf(P), L3 = C.L;
  const at = (p) => k.iso(p, P), pr = (p) => C.pr(p[0], p[1], p[2]);
  const S = (paths, style) => k.solidSvg(paths, style);
  const Ln = (d, style) => k.lineSvg(d, style);
  const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
  /* El dibujo va en milímetros; el audit, en unidades de 1/U mm (U = 0,25 en las turbinas, 0,1 en las de pared): sus
     muestras de superficie van cada 0,6 unidades. sc() pasa cada forma registrada a esas unidades (con sus cortes) y PA
     es la misma cámara con la escala por 1/U, así cada forma cae en el mismo lugar de la pantalla. */
  const CMC = new WeakMap();
  function sc(sh) {
    if (!sh || typeof sh !== "object") return sh;
    if (Array.isArray(sh)) return sh.map(sc);
    if (CMC.has(sh)) return CMC.get(sh);
    const s3 = (v) => v.map((q) => q * U), out = { ...sh };
    delete out._b; delete out._f;
    if (sh.F) out.F = { ...sh.F, o: s3(sh.F.o) };
    if (sh.kind === "body") out.poly = sh.poly.map(([a, b]) => [a * U, b * U]);
    if (sh.kind === "prism") { out.poly = sh.poly.map(([a, b]) => [a * U, b * U]); out.s0 = sh.s0 * U; out.s1 = sh.s1 * U; }
    if (sh.kind === "box") { out.o = s3(sh.o); out.half = s3(sh.half); }
    if (sh.kind === "ball") { out.o = s3(sh.o); out.r = sh.r * U; }
    if (sh.kind === "tube") { out.points = sh.points.map(s3); out.radii = sh.radii.map((r) => r * U); if (sh.tips) out.tips = sh.tips.map((t) => t && s3(t)); }
    if (sh.cut) out.cut = Array.isArray(sh.cut) ? sh.cut.map(sc) : sc(sh.cut);
    CMC.set(sh, out);
    return out;
  }
  const PA = { ...P, scale: P.scale / U };
  const R_ = A.recorder(PA, { order: [], spring: {} });
  const record = (sh) => { R_.solid(sc(sh)); return sh; };
  const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref.map((v) => v * U), svg, shapes: shapes.map(sc), move: [0, 0, 0], ...rest });
  const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);
  const meta = (name, { owner, cut, ground, seated } = {}) => ({ name, owner: owner || name, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}), ...(seated ? { seated } : {}) });
  // prisma en un marco cualquiera (sección en u, v; a lo largo de a)
  function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, seams = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null } = {}) {
    const shape = record(A.prism(F, poly, s0, s1, meta(name, { owner, cut, ground })));
    const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
    const centre = ref || add3(add3(add3(F.o, mul3(F.a, (s0 + s1) / 2)), mul3(F.u, cu)), mul3(F.v, cv));
    put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, seams, cls, cap }) + extra, shapes || [shape]);
    return shape;
  }
  function turned(name, F, profile, style = {}, { extra = "", owner, cut, ground, cls = "", inner = "" } = {}) {
    const paths = G.solidOf(profile, F, P, { smooth: false });
    const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
    const shape = record(A.solid(F, profile, meta(name, { owner, cut, ground })));
    put(name, add3(F.o, mul3(F.a, mid)), wrap(S(paths, { tone: "mid", inner, ...style }) + extra, cls), [shape]);
    return shape;
  }
  function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", cut, ground } = {}) {
    const m = Math.max(16, Math.min(72, Math.round((r * G.scaleOf(P)) / 1.2)));
    const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
    const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, meta(name, { owner, cut, ground })));
    put(name, add3(F.o, mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", ...style }), cls) + extra, [shape]);
    return shape;
  }
  /* un prisionero de cabeza hueca en una superficie: el agujero (oscuro) y la llave hexagonal, en el plano tangente */
  function setScrew(c, n, up, r = GEO.COMUN.set.r, hx = GEO.COMUN.set.hex) {
    const u = unit3(cross3(up, n)), v = unit3(cross3(n, u)), lift = add3(c, mul3(n, 0.25));
    const ring = Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * TAU; return pr(add3(lift, add3(mul3(u, r * Math.cos(t)), mul3(v, r * Math.sin(t))))); });
    const hex = HEX(hx).map(([a, b]) => pr(add3(lift, add3(mul3(u, a), mul3(v, b)))));
    return `<path class="im-bore" d="${pth1(ring)}"/><path class="im-sock" d="${pth1(hex)}"/>`;
  }
  /* ---------- superficies con tonos suaves (como en el tanque agitado) ---------- */
  function surface(P3, N3, f0, f1, nf, nu, out, keep = null) {
    const cls = (f, u) => { const n = N3(f, u); return dot3(n, V3) <= 1e-4 || (keep && !keep(P3(f, u))) ? -1 : BAND(dot3(n, L3)); };
    const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
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
        const d = pth1(pts.map(pr)); out.by[run.band].push(d);
      });
    }
  }
  function toned(build, cls = "") {
    const out = { by: [[], [], [], [], []] };
    build(out);
    return `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">` + out.by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "") + "</g>";
  }
  /* ---------- hojas en triángulos: cada triángulo se recorta a lo visible y a las franjas de tono (los bordes de
     las franjas son rectos dentro de cada triángulo, así no hay escalones), y se pinta de atrás hacia adelante por
     capas de profundidad. tris: [{ p: [3 puntos], n: [3 normales] }] ---------- */
  function clipPoly(poly, idx, c, above) {
    const out = [], n = poly.length;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n], fa = a[idx] - c, fb = b[idx] - c;
      const ina = above ? fa >= 0 : fa < 0, inb = above ? fb >= 0 : fb < 0;
      if (ina) out.push(a);
      if (ina !== inb) { const t = fa / (fa - fb); out.push(a.map((v, q) => v + (b[q] - v) * t)); }
    }
    return out;
  }
  /* la unión de polígonos que se tocan por sus lados: se orientan todos igual, se cancelan los lados que aparecen en
     los dos sentidos y lo que queda se encadena en lazos (un solo trazo por franja de tono, mucho más liviano) */
  function unionPath(polys) {
    const key = (p) => r10(p[0]) + " " + r10(p[1]);
    const edges = new Map();
    for (let poly of polys) {
      let a2 = 0; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a2 += p[0] * q[1] - q[0] * p[1]; }
      if (Math.abs(a2) < 1e-6) continue;
      if (a2 < 0) poly = poly.slice().reverse();
      const ks = poly.map(key).filter((kk, i, arr) => kk !== arr[(i + 1) % arr.length]);
      for (let i = 0; i < ks.length; i++) {
        const a = ks[i], b = ks[(i + 1) % ks.length], rev = b + "|" + a, fw = a + "|" + b;
        if (edges.get(rev) > 0) edges.set(rev, edges.get(rev) - 1); else edges.set(fw, (edges.get(fw) || 0) + 1);
      }
    }
    const out = new Map();
    for (const [e, n] of edges) for (let i = 0; i < n; i++) { const [a, b] = e.split("|"); if (!out.has(a)) out.set(a, []); out.get(a).push(b); }
    let d = "";
    for (const start of out.keys()) {
      while (out.get(start).length) {
        let cur = start, loop = [start];
        for (let guard = 0; guard < 100000; guard++) { const nx = out.get(cur); if (!nx || !nx.length) break; cur = nx.pop(); if (cur === start) break; loop.push(cur); }
        if (loop.length >= 3) d += "M" + loop.join("L") + "Z";
      }
    }
    return d;
  }
  function triPieces(t) {
    const verts = t.p.map((p, i) => { const s = pr(p); return [s[0], s[1], dot3(t.n[i], V3), dot3(t.n[i], L3)]; });
    const vis = clipPoly(verts, 2, 1e-4, true);
    if (vis.length < 3) return [];
    const out = [];
    for (let b = 0; b <= 4; b++) {
      let q = vis;
      if (b > 0) q = clipPoly(q, 3, BANDS[b - 1], true);
      if (b < 4 && q.length >= 3) q = clipPoly(q, 3, BANDS[b], false);
      if (q.length >= 3) out.push({ band: b, d: pth1(q.map((v) => [v[0], v[1]])), poly: q.map((v) => [v[0], v[1]]) });
    }
    return out;
  }
  function paintTris(tris, { slabs = 1, cls = "" } = {}) {
    const list = tris.map((t) => ({ t, depth: t.p.reduce((q, p) => q + dot3(p, V3), 0) / t.p.length })).sort((a, b) => a.depth - b.depth);
    const out = [];
    const per = Math.ceil(list.length / slabs);
    for (let s = 0; s < slabs; s++) {
      const by = [[], [], [], [], []];
      for (const { t } of list.slice(s * per, (s + 1) * per)) for (const pc of triPieces(t)) by[pc.band].push(pc.poly);
      by.slice(0, 4).forEach((ps, i) => ps.length && out.push(`<path class="iso-shade" data-shade="${i}" d="${unionPath(ps)}"/>`));
      if (by[4].length) out.push(`<path class="iso-top" d="${unionPath(by[4])}"/>`);
    }
    return { svg: `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">${out.join("")}</g>`, list };
  }
  // los tramos de contorno donde la hoja da la vuelta (n·V = 0), en coordenadas de pantalla y con su profundidad
  function contourOf(tris) {
    const segs = [];
    for (const t of tris) {
      const v = t.n.map((n) => dot3(n, V3)), pts = [];
      for (let i = 0; i < 3; i++) {
        const j = (i + 1) % 3;
        if ((v[i] > 0) !== (v[j] > 0)) { const f = v[i] / (v[i] - v[j]); pts.push(G.lerp3(t.p[i], t.p[j], f)); }
      }
      if (pts.length === 2) segs.push(pts);
    }
    return segs;
  }
  // un tramo de línea (3D) se esconde si un triángulo visible de la misma pieza lo tapa por delante
  function hiddenBy(list, a, b, eps = 1.2) {
    const m = G.lerp3(a, b, 0.5), sm = pr(m), dm = dot3(m, V3);
    for (const { t } of list) {
      if (!t.n.some((n) => dot3(n, V3) > 0)) continue;
      const S0 = t.p.map(pr), D0 = t.p.map((p) => dot3(p, V3));
      for (let q = 1; q + 1 < t.p.length; q++) {
        const s = [S0[0], S0[q], S0[q + 1]], d = [D0[0], D0[q], D0[q + 1]];
        const den = (s[1][1] - s[2][1]) * (s[0][0] - s[2][0]) + (s[2][0] - s[1][0]) * (s[0][1] - s[2][1]);
        if (Math.abs(den) < 1e-9) continue;
        const l0 = ((s[1][1] - s[2][1]) * (sm[0] - s[2][0]) + (s[2][0] - s[1][0]) * (sm[1] - s[2][1])) / den;
        const l1 = ((s[2][1] - s[0][1]) * (sm[0] - s[2][0]) + (s[0][0] - s[2][0]) * (sm[1] - s[2][1])) / den, l2 = 1 - l0 - l1;
        if (l0 < 0.01 || l1 < 0.01 || l2 < 0.01) continue;
        if (l0 * d[0] + l1 * d[1] + l2 * d[2] > dm + eps) return true;
      }
    }
    return false;
  }
  // una lista de tramos (pares de puntos 3D) en un solo trazo, uniendo los que siguen uno al otro
  function segPath(segs) {
    let d = "", last = null;
    for (const [a, b] of segs) {
      const sa = pr(a), sb = pr(b), ka = r10(sa[0]) + " " + r10(sa[1]), kb = r10(sb[0]) + " " + r10(sb[1]);
      if (last === ka) d += "L" + kb; else if (last === kb) { d += "L" + ka; last = ka; continue; } else d += "M" + ka + "L" + kb;
      last = kb;
    }
    return d;
  }
  /* las formas que registra una hoja curva para el audit: una rejilla de prismas planos de su espesor */
  function sheetShapes(mid, half, nx, nc, name, owner, { x0 = 0, x1 = 1, c0 = -1, c1 = 1, up = ZD, clip = null } = {}) {
    const shapes = [];
    for (let i = 0; i < nx; i++) for (let j = 0; j < nc; j++) {
      const xa = x0 + ((x1 - x0) * i) / nx, xb = x0 + ((x1 - x0) * (i + 1)) / nx, ca = c0 + ((c1 - c0) * j) / nc, cb = c0 + ((c1 - c0) * (j + 1)) / nc;
      const q0 = [mid(xa, ca), mid(xb, ca), mid(xb, cb), mid(xa, cb)];
      const q = clip ? clip(q0.map((p) => ({ p, n: ZD }))).map((w) => w.p) : q0;
      if (q.length < 3) continue;
      const o = mul3(q.reduce((acc, p) => add3(acc, p), [0, 0, 0]), 1 / q.length);
      let n = unit3(cross3(sub3(q0[2], q0[0]), sub3(q0[3], q0[1])));
      if (dot3(n, up) < 0) n = mul3(n, -1);
      let u = sub3(q0[1], q0[0]); u = unit3(sub3(u, mul3(n, dot3(u, n)))); const v = cross3(n, u);
      const poly = q.map((p) => { const w = sub3(p, o); return [dot3(w, u), dot3(w, v)]; });
      if (Math.abs(poly.reduce((acc, p, k2) => { const r2 = poly[(k2 + 1) % poly.length]; return acc + p[0] * r2[1] - r2[0] * p[1]; }, 0)) < 0.5) continue;
      const h = Math.max(0.5, (half((xa + xb) / 2, (ca + cb) / 2) + (half(xa, ca) + half(xb, cb)) / 2) / 2);
      shapes.push(A.prism({ o, a: n, u, v }, poly, -h, h, { name, owner }));
    }
    return shapes;
  }
  return { P, C, V3, L3, U, PA, R_, at, pr, S, Ln, path3, record, put, wrap, fp, turned, disc, setScrew, surface, toned, paintTris, contourOf, hiddenBy, segPath, sheetShapes, ANCLAS: {}, DEFS: [], pre };
}

/* ====================================================================
   piezas comunes de las turbinas: el eje con su chaveta, la arandela y el perno del extremo
   ==================================================================== */
function ejeConChaveta(cx, z0, keyAng) {
  const { fp, turned } = cx, SH = GEO.COMUN.sh, KY = GEO.COMUN.key;
  const shaft = turned("eje", F0, [[z0, SH.r], [SH.top - 2.5, SH.r], [SH.top, SH.r - 2.5]], {}, { cls: "im-sh", ground: true });
  const t = keyAng * D2R, F = { o: [0, 0, 0], a: er(t), u: et(t), v: ZD };
  const hw = KY.w / 2, top = z0 + KY.len, rr = hw;
  const poly = [[-hw, z0], [hw, z0]];
  for (let i = 0; i <= 8; i++) { const a = (PI * i) / 8; poly.push([hw * Math.cos(a), top - rr + rr * Math.sin(a)]); }
  fp("chaveta", F, poly, KY.r0, SH.r + KY.out, {}, { cls: "im-hw", cut: [A.disc(F0, z0 - 1, top + 1, SH.r)] });
  cx.ANCLAS.EJE = G.pointOf(F0, z0 + (SH.top - z0) * 0.62, SH.r, (GEO.COMUN.AZ - 70) * D2R);
  cx.ANCLAS.CHAVETA = G.pointOf(F0, z0 + KY.len * 0.5, SH.r + KY.out, t);
  return shaft;
}
function arandelaYPerno(cx, z0, W, Cp) {
  const { disc, fp } = cx;
  disc("arandela", F0, z0 - W.h, z0, W.r, {}, { cls: "im-hw" });
  fp("perno.extremo", F0, HEX(Cp.r, 0.2), z0 - W.h - Cp.h, z0 - W.h, {}, { cls: "im-hw" });
  return z0 - W.h - Cp.h;
}

/* ====================================================================
   palas torcidas (hélice e hidrofoil): secciones sobre cilindros, como un tornillo, con curvatura y espesor de lente
   ==================================================================== */
function palaTorcida(spec) {
  const rOf = (x) => spec.r0 + x * (spec.r1 - spec.r0);
  const mid = (x, c) => {
    const r = rOf(x), th = spec.theta(r), ch = spec.chord(x), s = spec.sc(x) + (c * ch) / 2;
    const psi = spec.phi + (s * Math.cos(th)) / r, z = spec.z0 + s * Math.sin(th);
    const ep = et(psi), n0 = [-Math.sin(th) * ep[0], -Math.sin(th) * ep[1], Math.cos(th)];
    const h = spec.camber(x) * ch * (1 - c * c);
    return add3([r * Math.cos(psi), r * Math.sin(psi), z], mul3(n0, h));
  };
  const half = (x, c) => (spec.thick(x) / 2) * Math.sqrt(Math.max(0, 1 - c * c));
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const nMid = (x, c) => {
    const e = 1e-4, xa = cl(x - e, 0, 1), xb = cl(x + e, 0, 1), ca = cl(c - e, -1, 1), cb = cl(c + e, -1, 1);
    let n = unit3(cross3(sub3(mid(xb, c), mid(xa, c)), sub3(mid(x, cb), mid(x, ca))));
    return n[2] < 0 ? mul3(n, -1) : n;
  };
  const surf = (sg) => (x, c) => add3(mid(x, c), mul3(nMid(x, c), sg * half(x, c)));
  const top = surf(1), bot = surf(-1);
  const nrm = (f, sg) => (x, c) => {
    const e = 2e-4, xa = cl(x - e, 0, 1), xb = cl(x + e, 0, 1), ca = cl(c - e, -1, 1), cb = cl(c + e, -1, 1);
    let n = cross3(sub3(f(xb, c), f(xa, c)), sub3(f(x, cb), f(x, ca)));
    if (G.len3(n) < 1e-12) return mul3(nMid(x, c), sg);
    n = unit3(n);
    return dot3(n, nMid(x, c)) * sg < 0 ? mul3(n, -1) : n;
  };
  return { rOf, mid, half, top, bot, nTop: nrm(top, 1), nBot: nrm(bot, -1), nMid };
}
// la hoja de una pala torcida en triángulos: las dos caras y la tapa de la punta (si la punta tiene cuerda)
function trisDePala(B, nx, nc, tipCap) {
  const tris = [], cOf = (j) => Math.sin(-PI / 2 + (PI * j) / nc);
  for (const [f, nf] of [[B.top, B.nTop], [B.bot, B.nBot]]) {
    const grid = [];
    for (let i = 0; i <= nx; i++) { grid.push([]); for (let j = 0; j <= nc; j++) { const x = i / nx, c = cOf(j); grid[i].push({ p: f(x, c), n: nf(x, c) }); } }
    for (let i = 0; i < nx; i++) for (let j = 0; j < nc; j++) {
      const a = grid[i][j], b = grid[i + 1][j], c = grid[i + 1][j + 1], d = grid[i][j + 1];
      tris.push({ p: [a.p, b.p, c.p], n: [a.n, b.n, c.n] }, { p: [a.p, c.p, d.p], n: [a.n, c.n, d.n] });
    }
  }
  if (tipCap) {
    const loop = [];
    for (let j = 0; j <= nc; j++) loop.push(B.top(1, cOf(j)));
    for (let j = nc - 1; j >= 1; j--) loop.push(B.bot(1, cOf(j)));
    const ctr = mul3(loop.reduce((q, p) => add3(q, p), [0, 0, 0]), 1 / loop.length);
    const nOf = (p) => unit3([p[0], p[1], 0]);
    for (let i = 0; i < loop.length; i++) { const a = loop[i], b = loop[(i + 1) % loop.length]; tris.push({ p: [ctr, a, b], n: [nOf(ctr), nOf(a), nOf(b)], cap: true }); }
  }
  return tris;
}
/* Una pala torcida se dibuja en dos piezas, partida por el plano vertical del eje que mira al lector: lo de atrás va
   detrás del cubo y lo de adelante delante, así el orden de pintura no se traba donde la raíz da la vuelta al cubo.
   Cada pieza pinta sus triángulos por capas de profundidad; el contorno es el de la superficie media: los bordes de
   ataque y de salida, la punta, la raíz contra el cubo y la línea donde la pala da la vuelta (n·V = 0). */
function clip3(poly, f, keepPos) {
  // poly: [{ p, n }]; se queda con f(p) >= 0 (o < 0)
  const out = [], m = poly.length;
  for (let i = 0; i < m; i++) {
    const a = poly[i], b = poly[(i + 1) % m], fa = f(a.p), fb = f(b.p);
    const ina = keepPos ? fa >= 0 : fa < 0, inb = keepPos ? fb >= 0 : fb < 0;
    if (ina) out.push(a);
    if (ina !== inb) { const t = fa / (fa - fb); out.push({ p: G.lerp3(a.p, b.p, t), n: unit3(G.lerp3(a.n, b.n, t)) }); }
  }
  return out;
}
// los tramos sueltos se encadenan en polilíneas y se quitan las que miden menos de minPx en pantalla (migas de un
// contorno que asoma por un pelo)
function sinMigas(cx, segs, minPx) {
  const key = (p) => p.map((v) => Math.round(v * 100)).join(",");
  const ends = new Map();
  segs.forEach((sg, i) => [0, 1].forEach((e) => { const kk = key(sg[e]); if (!ends.has(kk)) ends.set(kk, []); ends.get(kk).push(i); }));
  const seen = new Set(), out = [];
  for (let i = 0; i < segs.length; i++) {
    if (seen.has(i)) continue;
    const comp = [], stack = [i]; seen.add(i);
    while (stack.length) { const j = stack.pop(); comp.push(j); for (const e of [0, 1]) for (const n of ends.get(key(segs[j][e]))) if (!seen.has(n)) { seen.add(n); stack.push(n); } }
    const len = comp.reduce((q, j) => { const a = cx.pr(segs[j][0]), b = cx.pr(segs[j][1]); return q + Math.hypot(b[0] - a[0], b[1] - a[1]); }, 0);
    if (len >= minPx) comp.forEach((j) => out.push(segs[j]));
  }
  return out;
}
function dibujaPala(cx, name, B, { nx = 18, nc = 14, tipCap = false, cls = "im-ss", owner } = {}) {
  const tris = trisDePala(B, nx, nc, tipCap);
  const Vh = unit3([cx.V3[0], cx.V3[1], 0]), side = (p) => dot3(p, Vh);
  const cOf = (j) => Math.sin(-PI / 2 + (PI * j) / nc);
  const tmax = Math.max(B.half(0, 0), B.half(0.5, 0)) + 0.6;
  // las líneas, sobre la superficie media (la raíz y la punta, sobre las dos caras)
  const NX = 60, NC = 40, segs = [];
  for (let i = 0; i < NX; i++) { const xa = i / NX, xb = (i + 1) / NX; segs.push([B.mid(xa, 1), B.mid(xb, 1)], [B.mid(xa, -1), B.mid(xb, -1)]); }
  for (let j = 0; j < NC; j++) {
    const ca = Math.sin(-PI / 2 + (PI * j) / NC), cb = Math.sin(-PI / 2 + (PI * (j + 1)) / NC);
    segs.push([B.top(0, ca), B.top(0, cb)], [B.bot(0, ca), B.bot(0, cb)]);
    if (tipCap) segs.push([B.top(1, ca), B.top(1, cb)], [B.bot(1, ca), B.bot(1, cb)]);
  }
  // el pliegue: n·V = 0 en la superficie media, por cuadros (cada cuadro en dos triángulos)
  const vm = [], pm = [];
  for (let i = 0; i <= NX; i++) { vm.push([]); pm.push([]); for (let j = 0; j <= NC; j++) { const x = i / NX, c = Math.sin(-PI / 2 + (PI * j) / NC); pm[i].push(B.mid(x, c)); vm[i].push(dot3(B.nMid(x, c), cx.V3)); } }
  const cross0 = (tri) => {
    const pts = [];
    for (let q = 0; q < 3; q++) { const [ia, ja] = tri[q], [ib, jb] = tri[(q + 1) % 3], va = vm[ia][ja], vb = vm[ib][jb]; if ((va > 0) !== (vb > 0)) pts.push(G.lerp3(pm[ia][ja], pm[ib][jb], va / (va - vb))); }
    if (pts.length === 2) segs.push(pts);
  };
  for (let i = 0; i < NX; i++) for (let j = 0; j < NC; j++) { cross0([[i, j], [i + 1, j], [i + 1, j + 1]]); cross0([[i, j], [i + 1, j + 1], [i, j + 1]]); }
  [1, 0].forEach((pos) => {
    const keep = (p) => (pos ? side(p) >= 0 : side(p) < 0);
    const part = [];
    for (const t of tris) { const poly = clip3(t.p.map((p, i) => ({ p, n: t.n[i] })), side, pos === 1); if (poly.length >= 3) part.push({ p: poly.map((v) => v.p), n: poly.map((v) => v.n), cap: t.cap }); }
    if (!part.length) return;
    const faces = part.filter((t) => !t.cap), caps = part.filter((t) => t.cap);
    const { svg, list } = cx.paintTris(faces, { slabs: 6, cls });
    const capSvg = caps.length ? cx.paintTris(caps, { cls }).svg : "";
    const all = [...list, ...(caps.length ? caps.map((t) => ({ t })) : [])];
    const mine = sinMigas(cx, segs.filter(([a, b]) => keep(G.lerp3(a, b, 0.5)) && !cx.hiddenBy(all, a, b, tmax)), 12);
    const lines = cx.Ln(cx.segPath(mine), { tone: "mid" });
    // las formas: la rejilla de prismas planos, recortada al mismo lado del plano
    const shapes = cx.sheetShapes(B.mid, B.half, 10, 8, `${name}.${pos ? "frente" : "fondo"}`, owner || name, { clip: (poly) => clip3(poly, side, pos === 1) });
    shapes.forEach((sh) => cx.record(sh));
    const ref = mul3(faces.reduce((q, t) => add3(q, t.p[0]), [0, 0, 0]), 1 / faces.length);
    cx.put(`${name}.${pos ? "frente" : "fondo"}`, ref, `<g>${svg}${capSvg}${lines}</g>`, shapes);
  });
}

/* ====================================================================
   1 · la hélice marina de tres palas, paso igual al diámetro
   ==================================================================== */
function helice(cx) {
  const H = GEO.HELICE, R = GEO.R, AZ = GEO.COMUN.AZ;
  const hub = H.hub;
  cx.turned("cubo", F0, [[hub.z0, hub.r - hub.ch], [hub.z0 + hub.ch, hub.r], [hub.z1 - hub.ch, hub.r], [hub.z1, hub.r - hub.ch]], {}, { cls: "im-ss",
    extra: cx.setScrew(G.pointOf(F0, 46, hub.r, (AZ - 20) * D2R), er((AZ - 20) * D2R), ZD) });
  ejeConChaveta(cx, hub.z1, AZ + 34);
  cx.disc("arandela", F0, hub.z0 - H.washer.h, hub.z0, H.washer.r, {}, { cls: "im-hw" });
  cx.fp("tuerca", F0, HEX(H.nut.r, 0.25), hub.z0 - H.washer.h - H.nut.h, hub.z0 - H.washer.h, {}, { cls: "im-hw" });
  const cmax = H.cmax;
  const chord = (x) => cmax * Math.sqrt(Math.max(0, 1 - Math.pow(x, 2.4))) * (0.56 + 0.44 * Math.sin((Math.min(1, x / 0.52) * PI) / 2));
  const phase = (AZ - 30) * D2R;
  for (let q = 0; q < H.n; q++) {
    const spec = {
      r0: hub.r + 0.3, r1: R, phi: phase + (q * TAU) / H.n, z0: 0,
      theta: (r) => Math.atan(H.pitch / (TAU * r)), chord, sc: (x) => H.skew * (0.12 - x * x),
      camber: () => 0.025, thick: (x) => H.t0 + (H.t1 - H.t0) * x,
    };
    dibujaPala(cx, `pala${q}`, palaTorcida(spec), { nx: 24, nc: 18, owner: `pala${q}` });
    if (q === 0) cx._spec0 = spec;
  }
  // los rótulos: la pala que mira al lector, el cubo, el prisionero, la tuerca
  // los rótulos de la izquierda van a la pala de la izquierda (ψ = AZ + 90°) y al lado izquierdo del cubo
  const Bq = palaTorcida({ ...cx._spec0, phi: phase + TAU / 3 });
  Object.assign(cx.ANCLAS, {
    PALA: Bq.top(0.55, 0.25), CUBO: G.pointOf(F0, 30, hub.r, (AZ + 62) * D2R), PRISIONERO: G.pointOf(F0, 46, hub.r, (AZ - 20) * D2R),
    TUERCA: G.pointOf(F0, hub.z0 - H.washer.h - H.nut.h / 2, H.nut.r * 0.95, (AZ + 25) * D2R),
  });
}

/* ====================================================================
   2 · la turbina de cuatro palas inclinadas a 45°: cubo cuadrado, orejas soldadas y palas empernadas
   ==================================================================== */
function pbt(cx) {
  const T = GEO.PBT, R = GEO.R, AZ = GEO.COMUN.AZ, hub = T.hub, ph = T.phase * D2R;
  const FH = { o: [0, 0, 0], a: ZD, u: er(ph), v: et(ph) };
  const ang = T.ang * D2R, cA = Math.cos(ang), sA = Math.sin(ang);
  // los prisioneros, en las dos caras del cubo que miran al lector
  let ss = "";
  for (let q = 0; q < 4; q++) {
    const t = ph + (q * PI) / 2, n = er(t);
    if (dot3(n, cx.V3) > 0.25) ss += cx.setScrew(add3(mul3(n, hub.h), [0, 0, 44]), n, ZD);
  }
  cx.fp("cubo", FH, X_roundSquare(hub.h, hub.rc), hub.z0, hub.z1, {}, { cls: "im-ss", extra: ss });
  ejeConChaveta(cx, hub.z1, AZ + 40);
  arandelaYPerno(cx, hub.z0, T.washer, T.cap);
  const LG = T.lug, BT = T.bolt;
  for (let q = 0; q < T.n; q++) {
    const t = ph + (q * TAU) / T.n, rad = er(t), tan = et(t);
    const d = add3(mul3(tan, cA), mul3(ZD, sA)), n = add3(mul3(tan, -sA), mul3(ZD, cA));     // cuerda (borde de ataque arriba) y normal
    const F = { o: [0, 0, 0], a: n, u: rad, v: d };
    cx.fp(`oreja${q}`, F, [[hub.h, -LG.w / 2], [LG.r1, -LG.w / 2], [LG.r1, LG.w / 2], [hub.h, LG.w / 2]], -LG.t, 0, {}, { cls: "im-ss" });
    cx.fp(`pala${q}`, F, [[T.r0, -T.W / 2], [R, -T.W / 2], [R, T.W / 2], [T.r0, T.W / 2]], 0, T.t, {}, { cls: "im-ss" });
    T.bolts.forEach((rb, j) => {
      const Fb = { o: mul3(rad, rb), a: n, u: rad, v: d };
      cx.fp(`perno${q}.${j}`, Fb, HEX(BT.r, 0.3), T.t, T.t + BT.h, {}, { cls: "im-hw" });
      cx.fp(`tuerca${q}.${j}`, Fb, HEX(BT.r, 0.3), -LG.t - BT.nut, -LG.t, {}, { cls: "im-hw" });
      cx.disc(`rosca${q}.${j}`, Fb, -LG.t - BT.nut - BT.tail, -LG.t - BT.nut, BT.tr, {}, { cls: "im-hw" });
    });
    if (q === 0) cx._F0 = { F, rad, d, n, t };
  }
  // los rótulos: a la izquierda la pala de adelante a la izquierda (que muestra su cara de arriba con los pernos) y la
  // cara izquierda del cubo; a la derecha, la oreja de la pala de atrás a la derecha (que muestra su cara de abajo)
  const pick = (sgn, front) => [0, 1, 2, 3].map((q) => ph + (q * TAU) / T.n).sort((a, b) => (sgn * Math.sin((AZ * D2R) - b) + front * Math.cos((AZ * D2R) - b)) - (sgn * Math.sin((AZ * D2R) - a) + front * Math.cos((AZ * D2R) - a)))[0];
  const geo = (t) => ({ t, d: add3(mul3(et(t), cA), mul3(ZD, sA)), n: add3(mul3(et(t), -sA), mul3(ZD, cA)) });
  const L1 = geo(pick(-1, 0.8)), R1 = geo(pick(1, -0.8));
  const faceL = [0, 1, 2, 3].map((q) => ph + (q * PI) / 2).sort((a, b) => (-Math.sin(AZ * D2R - b) + 0.3 * Math.cos(AZ * D2R - b)) - (-Math.sin(AZ * D2R - a) + 0.3 * Math.cos(AZ * D2R - a)))[0];
  const faceS = [0, 1, 2, 3].map((q) => ph + (q * PI) / 2).filter((tt) => dot3(er(tt), cx.V3) > 0.25).sort((a, b) => Math.sin(AZ * D2R - b) - Math.sin(AZ * D2R - a))[0];
  Object.assign(cx.ANCLAS, {
    PALA: add3(add3(mul3(er(L1.t), 190), mul3(L1.d, 18)), mul3(L1.n, T.t)),
    PERNOS: add3(mul3(er(L1.t), T.bolts[0]), mul3(L1.n, T.t + BT.h)),
    OREJA: add3(add3(mul3(er(R1.t), 120), mul3(R1.d, 0)), mul3(R1.n, -LG.t)),
    CUBO: add3(add3(mul3(er(faceL), hub.h), mul3(et(faceL), 26)), [0, 0, -44]),
    PRISIONERO: add3(mul3(er(faceS), hub.h), [0, 0, 44]),
  });
}
function X_roundSquare(h, rc, n = 5) {
  const out = [];
  [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], q) => {
    const cx = sx * (h - rc), cy = sy * (h - rc), a0 = (q * Math.PI) / 2;
    for (let i = 0; i <= n; i++) { const t = a0 + ((Math.PI / 2) * i) / n; out.push([cx + rc * Math.cos(t), cy + rc * Math.sin(t)]); }
  });
  return out;
}

/* ====================================================================
   3 · el hidrofoil de tres palas: anchas en el cubo, angostas y menos inclinadas en la punta
   ==================================================================== */
function hidrofoil(cx) {
  const Hh = GEO.HIDRO, R = GEO.R, AZ = GEO.COMUN.AZ, hub = Hh.hub, ph = Hh.phase * D2R;
  cx.turned("cubo", F0, [[hub.z0, hub.r - hub.ch], [hub.z0 + hub.ch, hub.r], [hub.z1 - hub.ch, hub.r], [hub.z1, hub.r - hub.ch]], {}, { cls: "im-ss",
    extra: cx.setScrew(G.pointOf(F0, 40, hub.r, (AZ - 20) * D2R), er((AZ - 20) * D2R), ZD) });
  ejeConChaveta(cx, hub.z1, AZ + 34);
  arandelaYPerno(cx, hub.z0, Hh.washer, Hh.cap);
  const tT = Math.tan(Hh.tipAng * D2R), k0 = 22;
  const rEff = (r) => (r + Hh.flatR + Math.sqrt((r - Hh.flatR) ** 2 + k0 * k0)) / 2;
  const chord = (x) => Hh.c0 + (Hh.c1 - Hh.c0) * Math.pow(x, 0.85);
  let spec0 = null;
  for (let q = 0; q < Hh.n; q++) {
    const spec = {
      r0: hub.r + 0.3, r1: R, phi: ph + (q * TAU) / Hh.n, z0: 0,
      theta: (r) => Math.atan((tT * R) / rEff(r)), chord, sc: (x) => Hh.c0 / 2 - chord(x) / 2 - 6,
      camber: (x) => Hh.camber * Math.min(1, 0.4 + x), thick: (x) => Hh.t0 + (Hh.t1 - Hh.t0) * x,
    };
    dibujaPala(cx, `pala${q}`, palaTorcida(spec), { nx: 24, nc: 18, tipCap: true, owner: `pala${q}` });
    if (q === 0) spec0 = spec;
  }
  // la pala de la izquierda (ψ = fase + 120°) para la pala; la de adelante a la derecha (ψ = fase) para la punta
  const Bq = palaTorcida({ ...spec0, phi: ph + TAU / 3 }), Bp = palaTorcida({ ...spec0, phi: ph });
  Object.assign(cx.ANCLAS, {
    PALA: Bq.top(0.62, -0.55), PUNTA: Bp.top(0.96, 0.0), CUBO: G.pointOf(F0, 32, hub.r, (AZ + 62) * D2R),
    PRISIONERO: G.pointOf(F0, 40, hub.r, (AZ - 20) * D2R), PERNO: G.pointOf(F0, hub.z0 - Hh.washer.h - Hh.cap.h / 2, Hh.cap.r * 0.95, (AZ + 25) * D2R),
  });
}

/* ====================================================================
   4 · la turbina Rushton: disco, seis palas ranuradas sobre su borde y empernadas a dos soportes
   ==================================================================== */
function rushton(cx) {
  const T = GEO.RUSHTON, R = GEO.R, AZ = GEO.COMUN.AZ, ph = T.phase * D2R, dk = T.disc, hz = dk.t / 2;
  const rin = R - T.L, hw = T.W / 2, rd = dk.r;
  cx.disc("disco", F0, -hz, hz, rd, {}, { cls: "im-ss" });
  const hubTop = hz + T.hub.h;
  cx.turned("cubo", F0, [[hz, T.hub.r], [hubTop - 4, T.hub.r], [hubTop, T.hub.r - 4]], {}, { cls: "im-ss",
    extra: cx.setScrew(G.pointOf(F0, hz + 50, T.hub.r, (AZ - 25) * D2R), er((AZ - 25) * D2R), ZD) });
  ejeConChaveta(cx, hubTop, AZ + 34);
  arandelaYPerno(cx, -hz, T.washer, T.cap);
  const CL = T.clip, BT = T.bolt, ht = T.t / 2;
  // cada pala va en tres piezas: lo de encima del disco, lo de debajo y la franja de afuera a la altura del disco; se
  // unen sin línea (es una sola placa con su ranura), y así cada pieza queda toda delante o toda detrás del disco
  const up = [[rin, hz], [rd, hz], [R, hz], [R, hw], [rin, hw]];
  const lo = [[rin, -hw], [R, -hw], [R, -hz], [rd, -hz], [rin, -hz]];
  const mid = [[rd, -hz], [R, -hz], [R, hz], [rd, hz]];
  for (let q = 0; q < T.n; q++) {
    const t = ph + (q * TAU) / T.n, F = { o: [0, 0, 0], a: et(t), u: er(t), v: ZD };
    cx.fp(`pala${q}.arriba`, F, up, -ht, ht, {}, { cls: "im-ss", owner: `pala${q}`, seams: new Set([1]) });
    cx.fp(`pala${q}.abajo`, F, lo, -ht, ht, {}, { cls: "im-ss", owner: `pala${q}`, seams: new Set([2]) });
    cx.fp(`pala${q}.borde`, F, mid, -ht, ht, {}, { cls: "im-ss", owner: `pala${q}`, seams: new Set([0, 2]) });
    [1, -1].forEach((sg) => {
      const nm = sg > 0 ? "arriba" : "abajo", v0 = sg * hz, v1 = sg * (hz + CL.h);
      cx.fp(`soporte${q}.${nm}`, F, [[CL.r0, Math.min(v0, v1)], [CL.r1, Math.min(v0, v1)], [CL.r1, Math.max(v0, v1)], [CL.r0, Math.max(v0, v1)]], ht, ht + CL.t, {}, { cls: "im-ss" });
      T.bolts.forEach((rb, j) => {
        const Fb = { o: add3(mul3(er(t), rb), [0, 0, sg * (hz + CL.h / 2 + 1)]), a: et(t), u: er(t), v: ZD };
        cx.fp(`perno${q}.${nm}${j}`, Fb, HEX(BT.r, 0.4), ht + CL.t, ht + CL.t + BT.h, {}, { cls: "im-hw" });
        const nut = A.prism(Fb, HEX(BT.r, 0.4), -ht - BT.nut, -ht, { name: `tuerca${q}.${nm}${j}`, owner: `tuerca${q}.${nm}${j}` });
        const tail = A.disc(Fb, -ht - BT.nut - BT.tail, -ht - BT.nut, BT.tr, { name: `tuerca${q}.${nm}${j}`, owner: `tuerca${q}.${nm}${j}` });
        cx.record(nut); cx.record(tail);
        const m = Math.max(16, Math.round((BT.tr * G.scaleOf(cx.P)) / 1.2)), circ = Array.from({ length: m }, (_, i) => [BT.tr * Math.cos((i / m) * TAU), BT.tr * Math.sin((i / m) * TAU)]);
        const svg = `<g class="im-hw">${X.prismSvg(cx.C, HEX(BT.r, 0.4), -ht - BT.nut, -ht, { F: Fb, tone: "mid" })}${X.prismSvg(cx.C, circ, -ht - BT.nut - BT.tail, -ht - BT.nut, { F: Fb, tone: "mid" })}</g>`;
        cx.put(`tuerca${q}.${nm}${j}`, add3(Fb.o, mul3(Fb.a, -ht - BT.nut)), svg, [nut, tail]);
      });
    });
  }
  // a la izquierda, la pala que más se ve de ese lado; a la derecha, el soporte de la pala que tiene el soporte de cara
  const scr = (t) => Math.sin(AZ * D2R - t);
  const blades = [...Array(T.n).keys()].map((q) => ph + (q * TAU) / T.n);
  const tf = blades.slice().sort((a, b) => scr(a) - scr(b))[0];
  const ts = blades.filter((t) => dot3(et(t), cx.V3) > 0.3).sort((a, b) => Math.cos(AZ * D2R - b) - Math.cos(AZ * D2R - a))[0];
  Object.assign(cx.ANCLAS, {
    PALA: add3(add3(mul3(er(tf), R - 26), [0, 0, 30]), mul3(et(tf), dot3(et(tf), cx.V3) > 0 ? ht : -ht)),
    DISCO: G.pointOf(F0, hz, rd - 26, (AZ + 115) * D2R),
    SOPORTE: add3(add3(mul3(er(ts), (CL.r0 + CL.r1) / 2), [0, 0, hz + CL.h * 0.8]), mul3(et(ts), ht + CL.t)),
    PERNOS: add3(add3(mul3(er(ts), T.bolts[1]), [0, 0, hz + CL.h / 2 + 1]), mul3(et(ts), ht + CL.t + BT.h)),
    CUBO: G.pointOf(F0, hz + 40, T.hub.r, (AZ + 62) * D2R),
  });
}

/* ====================================================================
   5 · la paleta: dos palas planas verticales empernadas a orejas soldadas al cubo
   ==================================================================== */
function paleta(cx) {
  const T = GEO.PALETA, R = GEO.R, AZ = GEO.COMUN.AZ, hub = T.hub, ph = T.phase * D2R;
  cx.turned("cubo", F0, [[hub.z0, hub.r - hub.ch], [hub.z0 + hub.ch, hub.r], [hub.z1 - hub.ch, hub.r], [hub.z1, hub.r - hub.ch]], {}, { cls: "im-ss",
    extra: cx.setScrew(G.pointOf(F0, 52, hub.r, (AZ - 30) * D2R), er((AZ - 30) * D2R), ZD) });
  ejeConChaveta(cx, hub.z1, AZ + 34);
  arandelaYPerno(cx, hub.z0, T.washer, T.cap);
  const LG = T.lug, BT = T.bolt, hl = LG.t / 2, r0l = Math.sqrt(hub.r * hub.r - hl * hl);
  for (let q = 0; q < T.n; q++) {
    const t = ph + (q * TAU) / T.n, F = { o: [0, 0, 0], a: et(t), u: er(t), v: ZD };
    cx.fp(`oreja${q}`, F, [[r0l, -LG.h / 2], [LG.r1, -LG.h / 2], [LG.r1, LG.h / 2], [r0l, LG.h / 2]], -hl, hl, {}, { cls: "im-ss" });
    cx.fp(`pala${q}`, F, [[T.r0, -T.W / 2], [R, -T.W / 2], [R, T.W / 2], [T.r0, T.W / 2]], hl, hl + T.t, {}, { cls: "im-ss" });
    T.bolts.forEach(([rb, zb], j) => {
      const Fb = { o: add3(mul3(er(t), rb), [0, 0, zb]), a: et(t), u: er(t), v: ZD };
      cx.fp(`perno${q}.${j}`, Fb, HEX(BT.r, 0.3), hl + T.t, hl + T.t + BT.h, {}, { cls: "im-hw" });
      const nut = A.prism(Fb, HEX(BT.r, 0.3), -hl - BT.nut, -hl, { name: `tuerca${q}.${j}`, owner: `tuerca${q}.${j}` });
      const tail = A.disc(Fb, -hl - BT.nut - BT.tail, -hl - BT.nut, BT.tr, { name: `tuerca${q}.${j}`, owner: `tuerca${q}.${j}` });
      cx.record(nut); cx.record(tail);
      const m = Math.max(16, Math.round((BT.tr * G.scaleOf(cx.P)) / 1.2)), circ = Array.from({ length: m }, (_, i) => [BT.tr * Math.cos((i / m) * TAU), BT.tr * Math.sin((i / m) * TAU)]);
      cx.put(`tuerca${q}.${j}`, add3(Fb.o, mul3(Fb.a, -hl - BT.nut)), `<g class="im-hw">${X.prismSvg(cx.C, HEX(BT.r, 0.3), -hl - BT.nut, -hl, { F: Fb, tone: "mid" })}${X.prismSvg(cx.C, circ, -hl - BT.nut - BT.tail, -hl - BT.nut, { F: Fb, tone: "mid" })}</g>`, [nut, tail]);
    });
  }
  const order = [0, 1].map((q) => ({ q, t: ph + q * PI })).sort((a, b) => dot3(add3(er(b.t), mul3(et(b.t), 0.6)), cx.V3) - dot3(add3(er(a.t), mul3(et(a.t), 0.6)), cx.V3));
  const tf = order[0].t, tb = order[1].t, sgf = dot3(et(tf), cx.V3) > 0 ? 1 : -1, sgb = dot3(et(tb), cx.V3) > 0 ? 1 : -1;
  // la pala de la derecha muestra su cara de afuera con los pernos; la de la izquierda, su oreja
  const tR = [0, 1].map((q) => ph + q * PI).sort((a, b) => Math.sin(AZ * D2R - b) - Math.sin(AZ * D2R - a))[0], tL = tR + PI;
  const sR = dot3(et(tR), cx.V3) > 0 ? 1 : -1, sL = dot3(et(tL), cx.V3) > 0 ? 1 : -1;
  Object.assign(cx.ANCLAS, {
    PALA: add3(add3(mul3(er(tR), 196), [0, 0, 20]), mul3(et(tR), sR > 0 ? hl + T.t : -hl)),
    PERNOS: add3(add3(mul3(er(tR), T.bolts[3][0]), [0, 0, T.bolts[3][1]]), mul3(et(tR), sR > 0 ? hl + T.t + BT.h : -hl - BT.nut)),
    OREJA: add3(add3(mul3(er(tL), 128), [0, 0, 18]), mul3(et(tL), sL > 0 ? hl : -hl)),
    CUBO: G.pointOf(F0, 20, hub.r, (AZ + 62) * D2R), PRISIONERO: G.pointOf(F0, 52, hub.r, (AZ - 30) * D2R),
  });
}

/* ====================================================================
   el tanque fantasma de las dos de pared: la mitad de atrás (y < 0), con las caras del corte
   ==================================================================== */
function tanque(cx) {
  const T = GEO.TANQUE, Rt = T.Rt, Ro = Rt + T.w, hd = T.hd, top = T.top;
  const { surface, toned, Ln, path3, pr, put, record } = cx;
  const FRONT = A.box([-9000, 0, -9000], [9000, 9000, 9000]);
  const ell = (rr, hh, a0, a1, n = 30) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [-hh * Math.sin(a), rr * Math.cos(a)]; });
  const HEAD = A.body(F0, [[-hd, 0], ...ell(Rt, hd, PI / 2, 0).map(([z, r]) => [z, r]), [0, Rt], [0, Ro], ...ell(Ro, hd + T.w, 0, PI / 2)], { name: "stand.fondo", owner: "tanque" });
  const cylP = (r, z0, z1) => (f, u) => [r * Math.cos(f), r * Math.sin(f), z0 + (z1 - z0) * u];
  const headP = (rr, hh) => (f, u) => { const a = (PI / 2) * u, r = rr * Math.cos(a); return [r * Math.cos(f), r * Math.sin(f), -hh * Math.sin(a)]; };
  const headN = (rr, hh) => (f, u) => { const a = (PI / 2) * u; return mul3(unit3([Math.cos(a) * hh * Math.cos(f), Math.cos(a) * hh * Math.sin(f), -Math.sin(a) * rr]), -1); };
  const arc = (r, z, f0, f1, n = 80) => Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [r * Math.cos(t), r * Math.sin(t), z]; });
  // la envolvente por dentro, con la costura de la línea de tangencia, y el fondo por dentro. A la derecha, entre la
  // silueta del cilindro (ψs) y el corte, se ve la envolvente por fuera, y esa franja va delante de lo que hay adentro:
  // es otra pieza
  const ps = (cx.P.azimuth - 90) * D2R + TAU;
  // la envolvente se registra como prismas de sección de corona (sin cortes): de π a ψs y de ψs a 2π
  const sector = (f0, f1, n = 48) => [...Array.from({ length: n + 1 }, (_, i) => { const t = f0 + ((f1 - f0) * i) / n; return [Ro * Math.cos(t), Ro * Math.sin(t)]; }),
    ...Array.from({ length: n + 1 }, (_, i) => { const t = f1 - ((f1 - f0) * i) / n; return [Rt * Math.cos(t), Rt * Math.sin(t)]; })];
  const wall = toned((o) => surface(cylP(Rt, 0, top), (f) => [-Math.cos(f), -Math.sin(f), 0], PI, ps, 90, 1, o), "im-gh") +
    Ln(path3(arc(Rt - 0.5, 0, PI, ps)), { tone: "faint" });
  put("stand.casco", [0, -Rt * 0.8, top / 2], wall, [record(A.prism(F0, sector(PI, ps), 0, top, { name: "stand.casco", owner: "tanque" }))]);
  const outR = toned((o) => surface(cylP(Ro, 0, top), (f) => [Math.cos(f), Math.sin(f), 0], ps, TAU, 12, 1, o), "im-gh");
  const silR = Ln(path3([[Ro * Math.cos(ps), Ro * Math.sin(ps), 0], [Ro * Math.cos(ps), Ro * Math.sin(ps), top]]), { tone: "mid" });
  put("stand.casco.der", [Ro * Math.cos(ps / 2 + PI), 0, top / 2], outR + silR, [record(A.prism(F0, sector(ps, TAU, 12), 0, top, { name: "stand.casco.der", owner: "tanque" }))]);
  const head = toned((o) => surface(headP(Rt, hd), headN(Rt, hd), PI, TAU, 90, 14, o), "im-gh");
  const ps0 = (cx.P.azimuth - 90) * D2R + TAU;
  const headOut = toned((o) => surface(headP(Ro, hd + T.w), (f, u) => mul3(headN(Ro, hd + T.w)(f, u), -1), ps0, TAU, 12, 10, o), "im-gh");
  put("stand.fondo", [0, -Rt * 0.5, -hd * 0.6], head + headOut, [record({ ...HEAD, cut: [FRONT] })]);
  // el borde de arriba de la mitad de atrás: media corona
  const rim = [...arc(Ro, top, PI, TAU, 80), ...arc(Rt, top, TAU, PI, 80)];
  put("stand.borde", [0, -Rt, top], `<g class="iso-solid im-gh"><path class="iso-top" d="${pth1(rim.map(pr))}"/></g>` + Ln(path3(arc(Ro, top, PI, TAU)) + path3(arc(Rt, top, PI, TAU)), { tone: "mid" }),
    [record(A.prism(F0, sector(PI, TAU, 96), top - 0.3, top, { name: "stand.borde", owner: "tanque" }))]);
  // la cara del corte en y = 0, en tres piezas (la envolvente a la derecha, a la izquierda y el fondo), así cada una
  // queda delante o detrás de lo que tiene cerca; la línea de tangencia queda como la soldadura que es
  const inner = ell(Rt, hd, 0, PI / 2, 40).map(([z, r]) => [r, z]), outer = ell(Ro, hd + T.w, 0, PI / 2, 40).map(([z, r]) => [r, z]);
  const piezas = {
    der: [[Rt, 0], [Ro, 0], [Ro, top], [Rt, top]],
    izq: [[-Ro, 0], [-Rt, 0], [-Rt, top], [-Ro, top]],
    fondo: [...outer, ...outer.slice().reverse().map(([x, z]) => [-x, z]).slice(1), ...inner.map(([x, z]) => [-x, z]), ...inner.slice().reverse().slice(1)],
  };
  for (const [nm, U] of Object.entries(piezas)) {
    const dU = pth1(U.map(([x, z]) => pr([x, 0, z])));
    const c = U.reduce((q, p) => [q[0] + p[0] / U.length, q[1] + p[1] / U.length], [0, 0]);
    put(`stand.corte.${nm}`, [c[0], 0, c[1]], `<g class="iso-solid im-cut"><path class="iso-fill" d="${dU}"/><path class="iso-shade" data-shade="3" d="${dU}"/><path class="iso-line iso-edge" data-tone="mid" d="${dU}"/></g>`,
      [record(A.prism({ o: [0, 0, 0], a: YD, u: XD, v: ZD }, U, -0.3, 0, { name: `stand.corte.${nm}`, owner: "tanque" }))]);
  }
  return { FRONT };
}

/* ====================================================================
   6 · el ancla: dos brazos en U que siguen la pared y el fondo con 30 mm de holgura, cubo abajo y tirantes arriba
   ==================================================================== */
function ancla(cx) {
  const T = GEO.TANQUE, N = GEO.ANCLA, Rt = T.Rt, hd = T.hd, AZ = N.AZ;
  tanque(cx);
  const C = N.C, W = N.W, ht = N.t / 2, H = N.D, zBot = -hd + C, zTop = zBot + H;
  const FY = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
  // la curva del fondo corrida hacia adentro una distancia d (la normal de la elipse), en (x, z), del ecuador al polo
  const off = (d, n = 48) => Array.from({ length: n + 1 }, (_, i) => {
    const t = ((PI / 2) * i) / n, x = Rt * Math.cos(t), z = -hd * Math.sin(t), nn = unit3([hd * Math.cos(t), 0, -Rt * Math.sin(t)]);
    return [x - d * nn[0], z - d * nn[2]];
  });
  const xh = Math.sqrt(N.hub.r ** 2 - ht * ht);
  const cutAt = (pts) => { const out = []; for (let i = 0; i < pts.length; i++) { const [x, z] = pts[i]; if (x >= xh) out.push([x, z]); else { const [xa, za] = pts[i - 1]; const f = (xa - xh) / (xa - x); out.push([xh, za + (z - za) * f]); break; } } return out; };
  const oc = cutAt(off(C)), ic = cutAt(off(C + W));
  const half = [[Rt - C, zTop], ...oc, ...ic.slice().reverse(), [Rt - C - W, zTop]];
  const shapeL = (sg) => half.map(([x, z]) => [sg * x, z]);
  const hubShape = A.disc(F0, N.hub.z0, N.hub.z1, N.hub.r);
  cx.fp("brazo.der", FY, shapeL(1), -ht, ht, {}, { cls: "im-ss" });
  cx.fp("brazo.izq", FY, shapeL(-1).reverse(), -ht, ht, {}, { cls: "im-ss" });
  // los tirantes de arriba, del collar a cada brazo
  const xc = Math.sqrt(N.collar.r ** 2 - ht * ht);
  [1, -1].forEach((sg) => cx.fp(`tirante.${sg > 0 ? "der" : "izq"}`, FY, sg > 0 ? [[xc, zTop - N.stay.h], [Rt - C - W, zTop - N.stay.h], [Rt - C - W, zTop], [xc, zTop]] : [[-(Rt - C - W), zTop - N.stay.h], [-xc, zTop - N.stay.h], [-xc, zTop], [-(Rt - C - W), zTop]], -ht, ht, {}, { cls: "im-ss" }));
  const az = AZ * D2R;
  cx.turned("cubo", F0, [[N.hub.z0, N.hub.r - 3], [N.hub.z0 + 3, N.hub.r], [N.hub.z1 - 3, N.hub.r], [N.hub.z1, N.hub.r - 3]], {}, { cls: "im-ss", extra: cx.setScrew(G.pointOf(F0, N.hub.z1 - 26, N.hub.r, az - 0.5), er(az - 0.5), ZD, 8, 4) });
  cx.turned("collar", F0, [[N.collar.z0, N.collar.r - 3], [N.collar.z0 + 3, N.collar.r], [N.collar.z1 - 3, N.collar.r], [N.collar.z1, N.collar.r - 3]], {}, { cls: "im-ss", extra: cx.setScrew(G.pointOf(F0, N.collar.z1 - 22, N.collar.r, az - 0.5), er(az - 0.5), ZD, 8, 4) });
  cx.disc("eje.abajo", F0, N.hub.z1, N.collar.z0, N.sh.r, {}, { cls: "im-sh", ground: true });
  cx.turned("eje", F0, [[N.collar.z1, N.sh.r], [N.sh.top - 3, N.sh.r], [N.sh.top, N.sh.r - 3]], {}, { cls: "im-sh", ground: true });
  cx.fp("perno.extremo", F0, HEX(N.cap.r, 0.2), N.hub.z0 - N.cap.h, N.hub.z0, {}, { cls: "im-hw" });
  // la chaveta del collar, sobre el eje
  const tk = az + 0.62, Fk = { o: [0, 0, 0], a: er(tk), u: et(tk), v: ZD }, kw = 11, kt = N.collar.z1 + 40, kpoly = [[-kw, N.collar.z1], [kw, N.collar.z1]];
  for (let i = 0; i <= 8; i++) { const a = (PI * i) / 8; kpoly.push([kw * Math.cos(a), kt - kw + kw * Math.sin(a)]); }
  cx.fp("chaveta", Fk, kpoly, Math.sqrt(N.sh.r ** 2 - kw * kw), N.sh.r + 5, {}, { cls: "im-hw", cut: [A.disc(F0, N.collar.z1 - 1, kt + 1, N.sh.r)] });
  Object.assign(cx.ANCLAS, {
    EJE: G.pointOf(F0, 1180, N.sh.r, az - 1.2), CUBO: G.pointOf(F0, N.hub.z0 + 40, N.hub.r, az + 0.9),
    BRAZO: [-(Rt - C - W / 2), ht, 520], FONDO: (() => { const p = off(C + W / 2)[18]; return [p[0], ht, p[1]]; })(),
    TIRANTE: [-(Rt - C - W) * 0.5, ht, zTop - N.stay.h / 2], COLLAR: G.pointOf(F0, N.collar.z0 + 30, N.collar.r, az - 0.9),
    PARED: [Rt * Math.cos(-1.05), Rt * Math.sin(-1.05), 1000], HOLGURA: [Rt - C / 2, 0, 300],
  });
}

/* ====================================================================
   7 · la cinta helicoidal doble: dos cintas de una vuelta, a 180°, sostenidas por brazos en tres niveles
   ==================================================================== */
function cinta(cx) {
  const T = GEO.TANQUE, N = GEO.CINTA, Rt = T.Rt, AZ = N.AZ, az = AZ * D2R;
  tanque(cx);
  const Ro = N.D / 2, Ri = Ro - N.W, p = N.D, kp = p / TAU, ht = N.t / 2, z0 = N.z0;
  const { pr, Ln, put, record, V3, L3 } = cx;
  const ea = Math.atan(N.arm.w / 2 / Ri);              // las cintas siguen un poco más allá de los brazos de los extremos
  const flights = [{ name: "cinta1", f0: -ea, f1: TAU + ea, base: 0 }, { name: "cinta2", f0: PI - ea, f1: 3 * PI + ea, base: PI }];
  // la cinta es una franja de helicoide (z = z0 + kp·(ψ − base)) de Ri a Ro, de espesor t a lo largo de su normal
  for (const F of flights) {
    const zc = (f) => z0 + kp * (f - F.base);
    const mid = (r, f) => [r * Math.cos(f), r * Math.sin(f), zc(f)];
    const nrm = (r, f) => unit3(add3(mul3(ZD, r), mul3(et(f), -kp)));
    const topP = (r, f) => add3(mid(r, f), mul3(nrm(r, f), ht)), botP = (r, f) => add3(mid(r, f), mul3(nrm(r, f), -ht));
    // tramos de 22,5°, partidos también en ψ = 0 y π (el plano de los brazos)
    const cuts = [F.f0];
    for (let m = Math.ceil(F.f0 / (PI / 8) + 1e-9); m * (PI / 8) < F.f1 - 1e-9; m++) cuts.push(m * (PI / 8));
    cuts.push(F.f1);
    for (let c = 0; c < cuts.length - 1; c++) {
      const fa = cuts[c], fb = cuts[c + 1], nf = Math.max(3, Math.ceil(((fb - fa) / (PI / 8)) * 10));
      const tris = [];
      const quad = (P3, N3, nu) => {
        for (let i = 0; i < nf; i++) for (let j = 0; j < nu; j++) {
          const f0 = fa + ((fb - fa) * i) / nf, f1 = fa + ((fb - fa) * (i + 1)) / nf, u0 = j / nu, u1 = (j + 1) / nu;
          const a = P3(f0, u0), b = P3(f1, u0), cc = P3(f1, u1), d = P3(f0, u1), na = N3(f0, u0), nb = N3(f1, u0), nc = N3(f1, u1), nd = N3(f0, u1);
          tris.push({ p: [a, b, cc], n: [na, nb, nc] }, { p: [a, cc, d], n: [na, nc, nd] });
        }
      };
      // las caras de los bordes primero, la de arriba al final (tapa todo lo que tiene detrás)
      quad((f, u) => add3(mid(Ro, f), mul3(nrm(Ro, f), -ht + 2 * ht * u)), (f) => er(f), 1);
      quad((f, u) => add3(mid(Ri, f), mul3(nrm(Ri, f), -ht + 2 * ht * u)), (f) => mul3(er(f), -1), 1);
      const edges = cx.paintTris(tris, { cls: "im-ss" }).svg;
      const topT = []; tris.length = 0;
      quad((f, u) => topP(Ri + (Ro - Ri) * u, f), (f, u) => nrm(Ri + (Ro - Ri) * u, f), 4);
      topT.push(...tris);
      const topSvg = cx.paintTris(topT, { cls: "im-ss" }).svg;
      // las líneas: los bordes de la cara de arriba (arista o pliegue según se vea la cara del borde) y el borde de abajo de
      // cada cara de borde que se ve; en los extremos de la cinta, su cara radial
      const segs = { edge: [], crease: [] };
      for (let i = 0; i < nf; i++) {
        const f0 = fa + ((fb - fa) * i) / nf, f1 = fa + ((fb - fa) * (i + 1)) / nf, fm = (f0 + f1) / 2;
        const outV = dot3(er(fm), V3) > 0, inV = dot3(er(fm), V3) < 0;
        (outV ? segs.crease : segs.edge).push([topP(Ro, f0), topP(Ro, f1)]);
        (inV ? segs.crease : segs.edge).push([topP(Ri, f0), topP(Ri, f1)]);
        if (outV) segs.edge.push([botP(Ro, f0), botP(Ro, f1)]);
        if (inV) segs.edge.push([botP(Ri, f0), botP(Ri, f1)]);
      }
      let ends = "";
      for (const [fe, sg] of [[F.f0, -1], [F.f1, 1]]) {
        if (Math.abs(fe - (sg < 0 ? fa : fb)) > 1e-9) continue;
        const nE = mul3(et(fe), sg), quadP = [topP(Ri, fe), topP(Ro, fe), botP(Ro, fe), botP(Ri, fe)];
        if (dot3(nE, V3) > 0) {
          const d = pth1(quadP.map(pr)), b = BAND(dot3(nE, L3));
          ends += `<g class="iso-solid im-ss"><path class="iso-fill" d="${d}"/>${b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`}</g>`;
          segs.edge.push([quadP[1], quadP[2]], [quadP[2], quadP[3]], [quadP[3], quadP[0]]);
          segs.crease.push([quadP[0], quadP[1]]);
        } else segs.edge.push([topP(Ri, fe), topP(Ro, fe)]);
      }
      const lines = Ln(cx.segPath(segs.crease), { tone: "faint" }) + Ln(cx.segPath(segs.edge), { tone: "mid" });
      // las formas para el audit: cuatro por dos prismas planos por tramo
      const shapes = [];
      const na = 4, nr = 2;
      for (let i = 0; i < na; i++) for (let j = 0; j < nr; j++) {
        const f0 = fa + ((fb - fa) * i) / na, f1 = fa + ((fb - fa) * (i + 1)) / na, r0 = Ri + ((Ro - Ri) * j) / nr, r1 = Ri + ((Ro - Ri) * (j + 1)) / nr;
        const q = [mid(r0, f0), mid(r1, f0), mid(r1, f1), mid(r0, f1)], o = mul3(add3(add3(q[0], q[1]), add3(q[2], q[3])), 0.25);
        let n = unit3(cross3(sub3(q[2], q[0]), sub3(q[3], q[1]))); if (n[2] < 0) n = mul3(n, -1);
        let u = sub3(q[1], q[0]); u = unit3(sub3(u, mul3(n, dot3(u, n)))); const v = cross3(n, u);
        shapes.push(A.prism({ o, a: n, u, v }, q.map((pp) => [dot3(sub3(pp, o), u), dot3(sub3(pp, o), v)]), -ht, ht, { name: `${F.name}.${c}`, owner: F.name }));
      }
      shapes.forEach(record);
      put(`${F.name}.${c}`, mid((Ri + Ro) / 2, (fa + fb) / 2), `<g>${edges}${ends}${topSvg}${lines}</g>`, shapes);
    }
  }
  // los collares y los brazos: en el fondo, en el medio y arriba, a lo largo de x (ψ = 0 y π)
  const CO = N.collar, hc = CO.h / 2, aw = N.arm.w / 2;
  const tanIn = kp / Ri, hv = ht * Math.sqrt(1 + tanIn * tanIn);      // altura de la sección de la cinta en su borde de adentro
  const levels = [0, 1, 2].map((m) => z0 + (m * p) / 2);
  levels.forEach((zl, m) => {
    cx.turned(`collar${m}`, F0, [[zl - hc, CO.r - 3], [zl - hc + 3, CO.r], [zl + hc - 3, CO.r], [zl + hc, CO.r - 3]], {}, { cls: "im-ss", extra: cx.setScrew(G.pointOf(F0, zl + hc - 18, CO.r, az - 0.55), er(az - 0.55), ZD, 7, 3.5) });
    const x0 = Math.sqrt(CO.r ** 2 - aw * aw), x1 = Math.sqrt(Ri * Ri - aw * aw);
    [1, -1].forEach((sg) => {
      // la sección del brazo, inclinada como la cinta en su borde de adentro (en y, z)
      const s = sg * tanIn, sec = [[-aw, -hv - aw * s], [aw, -hv + aw * s], [aw, hv + aw * s], [-aw, hv - aw * s]];
      const F = { o: [0, 0, zl], a: mul3(XD, sg), u: mul3(YD, sg), v: ZD };
      cx.fp(`brazo${m}.${sg > 0 ? "der" : "izq"}`, F, sec.map(([y, z]) => [y, z]), x0, x1, {}, { cls: "im-ss" });
    });
    if (m < 2) cx.disc(`eje${m}`, F0, zl + hc, levels[m + 1] - hc, N.sh.r, {}, { cls: "im-sh", ground: true });
  });
  cx.turned("eje", F0, [[levels[2] + hc, N.sh.r], [N.sh.top - 3, N.sh.r], [N.sh.top, N.sh.r - 3]], {}, { cls: "im-sh", ground: true });
  cx.fp("perno.extremo", F0, HEX(N.cap.r, 0.2), levels[0] - hc - N.cap.h, levels[0] - hc, {}, { cls: "im-hw" });
  const fFront = az, zA = z0 + kp * fFront, zB = z0 + kp * (fFront + PI);
  // las dos cintas, donde pasan por la izquierda del dibujo (ψ = AZ + 90°, a media altura la primera y arriba la segunda)
  const fl = az + PI / 2, onTop = (r, f, base) => add3([r * Math.cos(f), r * Math.sin(f), z0 + kp * (f - base)], mul3(ZD, ht));
  Object.assign(cx.ANCLAS, {
    EJE: G.pointOf(F0, 1340, N.sh.r, az - 1.2),
    CINTA1: onTop(Ro - 30, fl, 0), CINTA2: onTop(Ro - 30, fl + TAU, PI),
    BRAZO: [-(Ri + CO.r) / 2, 0, levels[2] + hv], COLLAR: G.pointOf(F0, levels[2] - 8, CO.r, az - 0.9),
    PARED: [Rt * Math.cos(-1.05), Rt * Math.sin(-1.05), 700],
  });
  void zA; void zB;
}

/* ====================================================================
   el orden de pintura, el SVG, el audit
   ==================================================================== */
const CSS = `.im-ss{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#c8cdd3;--anatomy-shade-1:#d3d8dc;--anatomy-shade-2:#dde1e4;--anatomy-shade-3:#e6e9eb}
.im-sh{--anatomy-paper:#e2e6ea;--anatomy-face:#e2e6ea;--anatomy-top:#edf0f2;--anatomy-shade-0:#b9c1c8;--anatomy-shade-1:#c3cad0;--anatomy-shade-2:#ccd2d7;--anatomy-shade-3:#d5dadf}
.im-hw{--anatomy-paper:#d9dde1;--anatomy-face:#d9dde1;--anatomy-top:#e6e9ec;--anatomy-shade-0:#aab2ba;--anatomy-shade-1:#b6bdc4;--anatomy-shade-2:#c1c7cd;--anatomy-shade-3:#ccd1d6}
.im-gh{--anatomy-paper:#f3f4f5;--anatomy-face:#f3f4f5;--anatomy-top:#f8f9f9;--anatomy-shade-0:#e1e4e7;--anatomy-shade-1:#e6e8eb;--anatomy-shade-2:#eaecee;--anatomy-shade-3:#eef0f1}
.im-cut{--anatomy-paper:#cfd4d9;--anatomy-face:#cfd4d9;--anatomy-top:#cfd4d9;--anatomy-shade-0:#cfd4d9;--anatomy-shade-1:#cfd4d9;--anatomy-shade-2:#cfd4d9;--anatomy-shade-3:#cfd4d9}
.im-bore{fill:#8f99a3;stroke:#6f7880;stroke-width:.4px}
.im-sock{fill:#5d666e;stroke:none}`;
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

const BUILD = { helice, pbt, hidrofoil, rushton, paleta, ancla, cinta };
const PTURB = camTurb();
const results = [];
for (const name of WHICH) {
  const t0 = Date.now();
  const pared = name === "ancla" || name === "cinta";
  const P = pared ? camPared(GEO[name === "ancla" ? "ANCLA" : "CINTA"].AZ, GEO[name === "ancla" ? "ANCLA" : "CINTA"].EL) : PTURB;
  const cx = contexto(P, pared ? 0.1 : 0.25, name);
  BUILD[name](cx);
  const R_ = cx.R_, PA = cx.PA;
  if (process.env.IM_PIX) {
    // depuración: qué forma de cada pieza corta el rayo de ese punto de la pantalla, y dónde
    if (process.env.IM_SCAN) {
      const [na, nb] = process.env.IM_SCAN.split(","), [x0, y0, x1, y1] = process.env.IM_PIX.split(",").map(Number), cam = A.cameraBasis(PA);
      const ia = R_.items.find((it) => it.name === na), ib = R_.items.find((it) => it.name === nb);
      const first = (it, c) => { for (let t = 200; t > -200; t -= 0.1) { const q = add3(c, mul3(cam.V, t)); if (it.shapes.some((sh) => A.sdf(sh, q) < 0)) return { t, q }; } return null; };
      for (let y = y0; y <= y1; y += 1) for (let x = x0; x <= x1; x += 1) {
        const c = add3(mul3(cam.R, (x - cam.origin[0]) / cam.k), mul3(cam.D, (y - cam.origin[1]) / cam.k));
        const a = first(ia, c), b = first(ib, c);
        if (a && b && a.t > b.t + 0.3) console.log(x, y, na, "delante", a.t.toFixed(1), b.t.toFixed(1), JSON.stringify(a.q.map((v) => Math.round(v / cx.U))), JSON.stringify(b.q.map((v) => Math.round(v / cx.U))));
      }
      process.exit(0);
    }
    const [px, py] = process.env.IM_PIX.split(",").map(Number), cam = A.cameraBasis(PA);
    const c = add3(mul3(cam.R, (px - cam.origin[0]) / cam.k), mul3(cam.D, (py - cam.origin[1]) / cam.k));
    for (const it of R_.items) for (const sh of it.shapes) {
      let hit = null;
      for (let t = 400; t > -400; t -= 0.05) { const q = add3(c, mul3(cam.V, t)); if (A.sdf(sh, q) < 0) { hit = { t, q: q.map((v) => +(v / cx.U).toFixed(0)) }; break; } }
      if (hit) console.log(it.name, sh.name, hit.t.toFixed(2), JSON.stringify(hit.q));
    }
    process.exit(0);
  }
  if (process.env.IM_ITEM) {
    for (const nm of process.env.IM_ITEM.split(",")) {
      const me = R_.items.find((it) => it.name === nm);
      for (const it of R_.items) {
        if (it === me) continue;
        const o = A.overlapsOf([me, it], PA, { step: STEP });
        for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", JSON.stringify(pp.front.map((f) => ({ area: +f.area.toFixed(1), depth: f.depth && +f.depth.toFixed(2), at: f.at && f.at.map((v) => +v.toFixed(1)) }))));
      }
    }
    process.exit(0);
  }
  const ts = Date.now();
  if (!FAST) A.settle(R_, PA, { step: STEP });
  const tOrder = (Date.now() - ts) / 1000;
  if (!FAST && process.env.IM_DROP) {
    const { overlaps, solved } = R_.settled, nm = (i) => R_.items[i].name;
    const edges = new Map();
    for (const pair of overlaps.pairs) {
      const aF = pair.front[0].area >= overlaps.least, bF = pair.front[1].area >= overlaps.least;
      if (aF === bF) continue;
      const [f, b] = aF ? [pair.a, pair.b] : [pair.b, pair.a];
      if (!edges.has(f)) edges.set(f, []);
      edges.get(f).push([b, pair.front[aF ? 0 : 1].area]);
    }
    for (const r of solved.dropped) {
      console.log("dropped:", nm(r.front), ">", nm(r.back), r.weight.toFixed(1));
      // un camino de back a front: back > … > front cierra el lazo
      const prev = new Map([[r.back, -1]]), queue = [r.back];
      while (queue.length) { const n = queue.shift(); if (n === r.front) break; for (const [m] of edges.get(n) || []) if (!prev.has(m)) { prev.set(m, n); queue.push(m); } }
      if (prev.has(r.front)) { const path = []; let n = r.front; while (n !== -1) { path.push(nm(n)); n = prev.get(n); } console.log("   lazo:", path.reverse().join(" > ")); }
    }
  }
  R_.items.sort((a, b) => a.key - b.key);
  const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
  const svg = compact(k.figureSvg({ width: WD, height: HD, label: name, body: [`<style>${CSS}</style><defs>${cx.DEFS.join("")}</defs><g class="im-items">${groups.join("")}</g>`] }));
  writeFileSync(join(OUT, `${name}.svg`), svg);
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify({ P, W: WD, H: HD, ANCLAS: cx.ANCLAS, pared }));
  let fails = 0, tAudit = 0;
  if (AUDIT && !FAST) {
    const ta = Date.now();
    const result = A.audit(R_, PA, {});
    console.log(A.report(result));
    fails = A.failures(result);
    tAudit = (Date.now() - ta) / 1000;
  }
  const secs = (Date.now() - t0) / 1000;
  console.log(`${name}: items ${R_.items.length} · ${Math.round(svg.length / 1024)} KB · orden ${tOrder.toFixed(1)} s${AUDIT ? ` · audit ${tAudit.toFixed(1)} s · ${fails ? `audit failed: ${fails}` : "audit passed"}` : ""} · ${secs.toFixed(1)} s`);
  results.push({ name, fails, secs });
}
writeFileSync(join(OUT, "fig.css"), k.ISO_CSS);
{
  // una página para mirar los dibujos sin los rótulos
  const { readFileSync, existsSync } = await import("node:fs");
  const body = IMPS.filter((n) => existsSync(join(OUT, `${n}.svg`))).map((n) => `<h2 style="font:600 14px system-ui;margin:24px 0 4px">${n}</h2><div class="iso-stage">${readFileSync(join(OUT, `${n}.svg`), "utf8")}</div>`).join("");
  writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Impulsores", theme: "light", width: 900, body, script: "" }));
}
if (AUDIT) {
  const bad = results.filter((r) => r.fails);
  console.log(bad.length ? `audit failed: ${bad.map((r) => r.name).join(", ")}` : `audit passed (${results.map((r) => r.name).join(", ")})`);
  if (bad.length) process.exitCode = 1;
}
