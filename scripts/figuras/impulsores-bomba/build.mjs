/* ====================================================================
   Los cuatro impulsores de bomba en isométrico (skill anatomy), para el capítulo 11 del libro de operaciones
   unitarias (Bombas): cerrado, semiabierto, abierto y axial, cada uno con su trozo de eje, su cubo, su chaveta y la
   tuerca del impulsor.
   Concepto: el lector distingue los tres radiales por sus tapas. El cerrado lleva los álabes entre dos tapas, con el
   ojo y su anillo de desgaste en la delantera y los agujeros de balance en la trasera; aquí se le quita un sector de la
   tapa delantera para ver los álabes. El semiabierto es el mismo sin la tapa delantera: los álabes muestran su borde
   libre. El abierto pierde además buena parte de la trasera, recortada entre álabes. Los tres son el impulsor del caso
   (190 mm, seis álabes que salen a 27°) con la misma cámara. Al cubo se le quita el cuarto que mira al lector para ver
   el eje, la chaveta y la tuerca. El axial es el de una bomba de hélice: un cubo de la mitad del diámetro, cuatro
   álabes torcidos de perfil delgado que casi tocan la carcasa (0,6 mm), de la que se ve la mitad de atrás, y el cono
   de entrada sin su cuarto de adelante, para ver la tuerca.
   Uso: node build.mjs [--imp=cerrado|semiabierto|abierto|axial|all] [--audit] [--fast]
   Unidades: 1 = 1 mm. Medidas en geo.mjs.
   ==================================================================== */
import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL("../../../.claude/skills/anatomy", import.meta.url));
const k = await import(KIT + "/kit/iso-kit.mjs");
const G = await import(KIT + "/kit/lathe.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const X = await import(join(HERE, "xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));

export const IMPS = ["cerrado", "semiabierto", "abierto", "axial"];
const argImp = (process.argv.find((a) => a.startsWith("--imp=")) || "--imp=all").slice(6);
const WHICH = argImp === "all" ? IMPS : argImp.split(",");
for (const w of WHICH) if (!IMPS.includes(w)) throw new Error(`impulsor desconocido: ${w}`);
const AUDIT = process.argv.includes("--audit"), FAST = process.argv.includes("--fast");
const STEP = Number(process.env.IB_STEP || 0.25);
const OUT = join(HERE, "out");
mkdirSync(OUT, { recursive: true });

const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const D2R = Math.PI / 180, PI = Math.PI, TAU = 2 * Math.PI;
const { add3, sub3, mul3, dot3, cross3, unit3 } = G;
const F0 = { o: [0, 0, 0], a: ZD, u: XD, v: YD };
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const er = (t) => [Math.cos(t), Math.sin(t), 0], et = (t) => [-Math.sin(t), Math.cos(t), 0];
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
const BANDS = [0, 0.2, 0.42, 0.62];
const BAND = (s) => { let t = 0; while (t < BANDS.length && s >= BANDS[t]) t++; return t; };
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- las dos cámaras: la de los radiales y la del axial ---------- */
const WD = 600, HD = 500;               // el área del dibujo; libro.mjs le agrega los rótulos a los lados
function camRad() {
  const R = GEO.RAD, ext = [];
  for (let d = 0; d < 360; d += 10) for (const z of [-R.rs.t, R.fs.zTop]) ext.push([R.r2 * Math.cos(d * D2R), R.r2 * Math.sin(d * D2R), z]);
  ext.push([0, 0, R.shaft.top + 2], [R.shaft.r, 0, R.shaft.bottom], [-R.shaft.r, 0, R.shaft.bottom], [0, R.shaft.r, R.shaft.bottom]);
  return k.fitProjection(ext, WD, HD, { pad: 8, azimuth: R.AZ, elevation: R.EL });
}
function camAx() {
  const X_ = GEO.AX, C = X_.casing, ext = [], az = X_.AZ * D2R;
  for (let d = 90; d <= 270; d += 10) for (const z of [C.z0, C.z1]) ext.push([C.fl.r * Math.cos(az + d * D2R), C.fl.r * Math.sin(az + d * D2R), z]);
  for (let d = -90; d <= 90; d += 10) for (const z of [-30, 30]) ext.push([X_.R * Math.cos(az + d * D2R), X_.R * Math.sin(az + d * D2R), z]);
  ext.push([0, 0, X_.hub.z1 + X_.cone.h], [X_.shaft.r, 0, X_.shaft.bottom], [-X_.shaft.r, 0, X_.shaft.bottom]);
  return k.fitProjection(ext, WD, HD, { pad: 8, azimuth: X_.AZ, elevation: X_.EL });
}

/* ====================================================================
   el contexto de un impulsor: cámara, registro del audit y las piezas de dibujo (como en impulsores/build.mjs)
   ==================================================================== */
function contexto(P, U, pre) {
  const C = X.xCam(P), V3 = G.viewOf(P), L3 = C.L;
  const Vh = unit3([V3[0], V3[1], 0]);
  const AZr = Math.atan2(Vh[1], Vh[0]);
  const at = (p) => k.iso(p, P), pr = (p) => C.pr(p[0], p[1], p[2]);
  const S = (paths, style) => k.solidSvg(paths, style);
  const Ln = (d, style) => k.lineSvg(d, style);
  /* El dibujo va en milímetros; el audit, en unidades de 1/U mm. sc() pasa cada forma registrada a esas unidades y PA
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
  function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, seams = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null, pre: before = "" } = {}) {
    const shape = record(A.prism(F, poly, s0, s1, meta(name, { owner, cut, ground })));
    const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
    const centre = ref || add3(add3(add3(F.o, mul3(F.a, (s0 + s1) / 2)), mul3(F.u, cu)), mul3(F.v, cv));
    put(name, centre, before + X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, seams, cls, cap }) + extra, shapes || [shape]);
    return shape;
  }
  function turned(name, F, profile, style = {}, { extra = "", owner, cut, ground, cls = "", inner = "" } = {}) {
    const paths = G.solidOf(profile, F, P, { smooth: false });
    const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
    const shape = record(A.solid(F, profile, meta(name, { owner, cut, ground })));
    put(name, add3(F.o, mul3(F.a, mid)), wrap(S(paths, { tone: "mid", inner, ...style }) + extra, cls), [shape]);
    return shape;
  }
  const circ = (r, n) => Array.from({ length: n }, (_, i) => { const t = (2 * Math.PI * i) / n; return [r * Math.cos(t), r * Math.sin(t)]; });
  const nCirc = (r) => Math.max(16, Math.min(96, Math.round((r * G.scaleOf(P)) / 1.2)));
  // un disco o un anillo (para el audit) dibujado como prisma de sección circular
  function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", cut, ground, rIn = 0, pre: before = "" } = {}) {
    const lo = Math.min(s0, s1), hi = Math.max(s0, s1);
    const shape = record(rIn > 0 ? A.ring(F, lo, hi, rIn, r, meta(name, { owner, cut, ground })) : A.disc(F, lo, hi, r, meta(name, { owner, cut, ground })));
    put(name, add3(F.o, mul3(F.a, (lo + hi) / 2)), before + wrap(X.prismSvg(C, circ(r, nCirc(r)), lo, hi, { F, tone: "mid", ...style }), cls) + extra, [shape]);
    return shape;
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
        out.by[run.band].push(pts.map(pr));
      });
    }
  }
  function toned(build, cls = "") {
    const out = { by: [[], [], [], [], []] };
    build(out);
    return `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">` + out.by.slice(0, 4).map((ps, i) => (ps.length ? `<path class="iso-shade" data-shade="${i}" d="${unionPath(ps)}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${unionPath(out.by[4])}"/>` : "") + "</g>";
  }
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
  /* la unión de polígonos que se tocan por sus lados (un solo trazo por franja de tono) */
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
      if (q.length >= 3) out.push({ band: b, poly: q.map((v) => [v[0], v[1]]) });
    }
    return out;
  }
  function paintTris(tris, { slabs = 1, cls = "", lines = null, lineEps = 0 } = {}) {
    const list = tris.map((t) => ({ t, depth: t.p.reduce((q, p) => q + dot3(p, V3), 0) / t.p.length })).sort((a, b) => a.depth - b.depth);
    const out = [];
    const per = Math.ceil(list.length / slabs);
    const tops = Array.from({ length: slabs }, (_, s) => { const last = list[Math.min(list.length, (s + 1) * per) - 1]; return last ? last.depth : Infinity; });
    const lineSlab = Array.from({ length: slabs }, () => []);
    for (const sg of lines || []) { const d = dot3(G.lerp3(sg[0], sg[1], 0.5), V3) - lineEps; let s = tops.findIndex((t) => t >= d); if (s < 0) s = slabs - 1; lineSlab[s].push(sg); }
    for (let s = 0; s < slabs; s++) {
      const by = [[], [], [], [], []];
      for (const { t } of list.slice(s * per, (s + 1) * per)) for (const pc of triPieces(t)) by[pc.band].push(pc.poly);
      by.slice(0, 4).forEach((ps, i) => ps.length && out.push(`<path class="iso-shade" data-shade="${i}" d="${unionPath(ps)}"/>`));
      if (by[4].length) out.push(`<path class="iso-top" d="${unionPath(by[4])}"/>`);
      if (lineSlab[s].length) out.push(Ln(segPath(lineSlab[s]), { tone: "mid" }));
    }
    return { svg: `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">${out.join("")}</g>`, list };
  }
  function segPath(segs) {
    let d = "", last = null;
    for (const [a, b] of segs) {
      const sa = pr(a), sb = pr(b), ka = r10(sa[0]) + " " + r10(sa[1]), kb = r10(sb[0]) + " " + r10(sb[1]);
      if (ka === kb) continue;
      if (last === ka) d += "L" + kb; else if (last === kb) { d += "L" + ka; last = ka; continue; } else d += "M" + ka + "L" + kb;
      last = kb;
    }
    return d;
  }
  function sheetShapes(mid, half, nx, nc, name, owner, { x0 = 0, x1 = 1, c0 = -1, c1 = 1, up = ZD, clip = null, cut = null } = {}) {
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
      shapes.push(A.prism({ o, a: n, u, v }, poly, -h, h, { name, owner, ...(cut ? { cut } : {}) }));
    }
    return shapes;
  }
  const cutFace = (pts3, cls = "ib-cut") => { const d = pth1(pts3.map(pr)); return `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`; };
  return { P, C, V3, L3, Vh, AZr, U, PA, R_, at, pr, S, Ln, record, put, wrap, meta, fp, turned, disc, circ, nCirc, surface, toned, paintTris, segPath, sheetShapes, unionPath, cutFace, ANCLAS: {}, CANDS: {}, DEFS: [], pre };
}

/* ====================================================================
   piezas de revolución con un sector quitado: la tapa delantera, el cubo, el anillo de desgaste, el cono y la carcasa.
   prof: la sección (r, z) cerrada, con [r, z, 1] en los vértices suaves; kinds: por lado («s» superficie, «c» cara
   del corte, «n» costura con otra pieza o cara que no se ve); ranges: los ángulos en que un lado existe; ends: lo que
   hay en a0 y a1 («face», la cara del corte; «seam», la costura con la pieza vecina)
   ==================================================================== */
function revPiece(cx, name, { prof, a0, a1, kinds, ranges = {}, ends = ["seam", "seam"], cls = "ib-ss", cutCls = "ib-cut", owner = "impulsor", ground = false, extra = "", shapes: more = [], ref = null }) {
  const { V3, pr, toned, surface, Ln, segPath, cutFace } = cx;
  const n = prof.length;
  let area = 0; for (let i = 0; i < n; i++) { const [r0, z0] = prof[i], [r1, z1] = prof[(i + 1) % n]; area += r0 * z1 - r1 * z0; }
  const sg = area > 0 ? 1 : -1;
  const enrm = prof.map((p, i) => { const q = prof[(i + 1) % n], dr = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dr, dz) || 1; return [(sg * dz) / L, (-sg * dr) / L]; });
  const P3 = (f, r, z) => [r * Math.cos(f), r * Math.sin(f), z];
  const N3 = (f, [nr, nz]) => [nr * Math.cos(f), nr * Math.sin(f), nz];
  const sameRange = (i, j) => JSON.stringify(ranges[i] || null) === JSON.stringify(ranges[j] || null);
  const kindAt = (i, f) => { const kd = kinds[i]; if (kd === "n") return "n"; const rg = ranges[i]; if (rg && (f < rg[0] - 1e-9 || f > rg[1] + 1e-9)) return "n"; return kd; };
  const smoothAt = (v) => { const a = (v - 1 + n) % n, b = v; return !!prof[v][2] && kinds[a] === kinds[b] && kinds[a] !== "n" && sameRange(a, b); };
  // las corridas de lados con superficie, unidos por vértices suaves
  let start = 0; while (start < n && smoothAt(start)) start++;
  if (start === n) start = 0;
  const runs = [];
  for (let q = 0; q < n; q++) {
    const e = (start + q) % n;
    if (kinds[e] === "n") continue;
    const last = runs[runs.length - 1];
    if (last && last.edges[last.edges.length - 1] === (e - 1 + n) % n && smoothAt(e)) last.edges.push(e);
    else runs.push({ edges: [e] });
  }
  const span = a1 - a0, NF = (s) => Math.max(3, Math.round((s / TAU) * 128));
  const parts = [];
  for (const run of runs) {
    const m = run.edges.length, verts = [...run.edges.map((e) => prof[e]), prof[(run.edges[m - 1] + 1) % n]];
    const VN = verts.map((_, j) => {
      if (j === 0) return enrm[run.edges[0]];
      if (j === m) return enrm[run.edges[m - 1]];
      const a = enrm[run.edges[j - 1]], b = enrm[run.edges[j]], s = Math.hypot(a[0] + b[0], a[1] + b[1]) || 1;
      return [(a[0] + b[0]) / s, (a[1] + b[1]) / s];
    });
    const at = (u) => { const x = Math.min(m - 1e-9, Math.max(0, u * m)), j = Math.floor(x), t = x - j; return { p: [lerp(verts[j][0], verts[j + 1][0], t), lerp(verts[j][1], verts[j + 1][1], t)], nn: (() => { const a = VN[j], b = VN[j + 1], v = [lerp(a[0], b[0], t), lerp(a[1], b[1], t)], s = Math.hypot(v[0], v[1]) || 1; return [v[0] / s, v[1] / s]; })() }; };
    const rg = ranges[run.edges[0]] || [a0, a1], f0 = Math.max(a0, rg[0]), f1 = Math.min(a1, rg[1]);
    if (f1 - f0 < 1e-6) continue;
    const isCut = kinds[run.edges[0]] === "c";
    const Pf = (f, u) => { const { p } = at(u); return P3(f, p[0], p[1]); }, Nf = (f, u) => N3(f, at(u).nn);
    const nf = NF(f1 - f0), nu = Math.max(2, m * (m > 1 ? 2 : 1));
    const svg = toned((o) => surface(Pf, Nf, f0, f1, nf, nu, o), isCut ? cutCls : cls);
    // la silueta: donde la superficie se voltea (n·V = 0), por triángulos en una rejilla (f, u)
    const sil = [], GF = nf * 2, GU = m * 6;
    const val = (i, j) => dot3(Nf(f0 + ((f1 - f0) * i) / GF, j / GU), V3);
    const vv = []; for (let i = 0; i <= GF; i++) { vv.push([]); for (let j = 0; j <= GU; j++) vv[i].push(val(i, j)); }
    const pAt = (i, j) => Pf(f0 + ((f1 - f0) * i) / GF, j / GU);
    const tri = (T) => { const pts = []; for (let q = 0; q < 3; q++) { const [ia, ja] = T[q], [ib, jb] = T[(q + 1) % 3], va = vv[ia][ja], vb = vv[ib][jb]; if ((va > 0) !== (vb > 0)) { const t = va / (va - vb); pts.push(Pf(f0 + ((f1 - f0) * lerp(ia, ib, t)) / GF, lerp(ja, jb, t) / GU)); } } if (pts.length === 2) sil.push(pts); };
    for (let i = 0; i < GF; i++) for (let j = 0; j < GU; j++) { tri([[i, j], [i + 1, j], [i + 1, j + 1]]); tri([[i, j], [i + 1, j + 1], [i, j + 1]]); }
    void pAt;
    let dsum = 0, dn = 0;
    for (let i = 0; i <= 6; i++) for (let j = 0; j <= 6; j++) { const f = f0 + ((f1 - f0) * i) / 6, u = j / 6; if (dot3(Nf(f, u), V3) > 0) { dsum += dot3(Pf(f, u), V3); dn++; } }
    parts.push({ depth: dn ? dsum / dn : -1e9, svg: svg + (sil.length ? Ln(segPath(sil), { tone: "mid" }) : "") });
  }
  parts.sort((a, b) => a.depth - b.depth);
  // los anillos de los vértices con arista: contorno si una de las dos caras se ve, arista suave si las dos
  const rings = { mid: [], faint: [] };
  const NS = Math.max(8, Math.round((span / TAU) * 360));
  for (let v = 0; v < n; v++) {
    if (smoothAt(v) || prof[v][0] < 0.5) continue;
    const ea = (v - 1 + n) % n, eb = v;
    const type = (f) => { const ka = kindAt(ea, f), kb = kindAt(eb, f); if (ka === "n" || kb === "n") return null; const fa = dot3(N3(f, enrm[ea]), V3) > 1e-4, fb = dot3(N3(f, enrm[eb]), V3) > 1e-4; return fa && fb ? "faint" : fa || fb ? "mid" : null; };
    for (let i = 0; i < NS; i++) {
      const fa = a0 + (span * i) / NS, fb = a0 + (span * (i + 1)) / NS, t = type((fa + fb) / 2);
      if (t) rings[t].push([P3(fa, prof[v][0], prof[v][1]), P3(fb, prof[v][0], prof[v][1])]);
    }
  }
  let ringSvg = (rings.faint.length ? Ln(segPath(rings.faint), { tone: "faint" }) : "") + (rings.mid.length ? Ln(segPath(rings.mid), { tone: "mid" }) : "");
  // las caras de los extremos
  let faces = "";
  [a0, a1].forEach((a, q) => {
    const kind = ends[q];
    const nrm = q === 0 ? [Math.sin(a), -Math.cos(a), 0] : [-Math.sin(a), Math.cos(a), 0];
    if (kind === "face" && dot3(nrm, V3) > 1e-4) faces += cutFace(prof.map(([r, z]) => P3(a, r, z)), cutCls);
    else if (kind === "face") {
      const segs = [];
      for (let i = 0; i < n; i++) { if (kindAt(i, a) === "n" || dot3(N3(a, enrm[i]), V3) <= 1e-4) continue; const p = prof[i], qq = prof[(i + 1) % n]; segs.push([P3(a, p[0], p[1]), P3(a, qq[0], qq[1])]); }
      if (segs.length) ringSvg += Ln(segPath(segs), { tone: "mid" });
    }
  });
  const svg = `<g>${parts.map((p) => p.svg).join("")}${ringSvg}${faces}${extra}</g>`;
  // para el audit: el sólido de revolución, sin los ángulos que no son de esta pieza
  const cuts = [];
  if (span < TAU - 1e-6) {
    const R = 5000, m = 48, poly = [[0, 0]];
    for (let i = 0; i <= m; i++) { const t = a1 + ((TAU - span) * i) / m; poly.push([R * Math.cos(t), R * Math.sin(t)]); }
    cuts.push(A.prism(F0, poly, -5000, 5000, { name: name + ".fuera" }));
  }
  const shape = cx.record(A.body(F0, prof.map(([r, z]) => [z, r]), cx.meta(name, { owner, ground, cut: cuts.length ? cuts : null })));
  const fm = (a0 + a1) / 2, cr = prof.reduce((q, p) => q + p[0], 0) / n, cz = prof.reduce((q, p) => q + p[1], 0) / n;
  cx.put(name, ref || P3(fm, cr, cz), svg, [shape, ...more]);
  return shape;
}
// la sección de un anillo, de (r0, z0) a (r1, z1), con los lados en orden: abajo, afuera, arriba, adentro
const ringProf = (r0, r1, z0, z1) => [[r0, z0], [r1, z0], [r1, z1], [r0, z1]];

/* ====================================================================
   los álabes de los radiales: cilíndricos (la misma curva a toda altura), de 4 mm, que salen a 27° y entran a 18°,
   con el borde de ataque inclinado de la tapa trasera a la delantera y afinado
   ==================================================================== */
function radModel() {
  const R = GEO.RAD, fs = R.fs, r2 = R.r2;
  const rH = R.le.rHub, rS = R.le.rShr;
  // la tapa delantera por dentro, z(r) para r ≥ rS: elipse de (rA, zA) a (r1, zEye) y recta hasta (r2, b2)
  const ea = fs.rA - R.r1, eb = fs.zEye - fs.zA;
  const zIn = (r) => {
    if (r >= fs.rA) return lerp(fs.zA, R.b2, (r - fs.rA) / (r2 - fs.rA));
    const s = Math.min(1, Math.max(0, (fs.rA - r) / ea)), t = Math.asin(s);
    return fs.zEye - eb * Math.cos(t);
  };
  const zOut = (r) => {
    if (r >= fs.rA) return lerp(fs.zA + fs.t, R.b2 + fs.t, (r - fs.rA) / (r2 - fs.rA));
    const a2 = ea - fs.t, b2_ = eb - fs.t, s = Math.min(1, Math.max(0, (fs.rA - r) / a2)), t = Math.asin(s);
    return fs.zEye - b2_ * Math.cos(t);
  };
  const zLE = zIn(rS);
  const zTop = (r) => (r >= rS ? zIn(r) : zLE);
  const rLE = (t) => lerp(rH, rS, t);
  // el ángulo del álabe: β de beta1 en el borde de ataque a beta2 en la salida, y la curva θ(r) = −∫ dr / (r tan β)
  const b1 = R.beta1 * D2R, b2 = R.beta2 * D2R, NI = 400, offT = [0];
  const beta = (r) => b1 + ((b2 - b1) * (r - rH)) / (r2 - rH);
  for (let i = 0; i < NI; i++) { const ra = rH + ((r2 - rH) * i) / NI, rb = rH + ((r2 - rH) * (i + 1)) / NI, rm = (ra + rb) / 2; offT.push(offT[i] - (rb - ra) / (rm * Math.tan(beta(rm)))); }
  const off = (r) => { const x = ((r - rH) / (r2 - rH)) * NI, i = Math.max(0, Math.min(NI - 1, Math.floor(x))), t = x - i; return lerp(offT[i], offT[i + 1], t); };
  // la sección del cuello y de la tapa delantera
  const profFS = (rFrom, rTo) => {
    // de la salida por dentro hasta el ojo, el cuello y por fuera de vuelta; recortado a r en [rFrom, rTo]
    const pts = [];
    const N = 22;
    const inner = [], outer = [];
    for (let i = 0; i <= 8; i++) { const r = lerp(r2, fs.rA, i / 8); inner.push([r, zIn(r), i > 0 && i < 8 ? 1 : 1]); }
    for (let i = 1; i <= N; i++) { const t = ((PI / 2) * i) / N; inner.push([fs.rA - ea * Math.sin(t), fs.zEye - eb * Math.cos(t), 1]); }
    inner.push([R.r1, fs.zTop]);
    outer.push([R.r1 + fs.t, fs.zTop]);
    const a2 = ea - fs.t, b2_ = eb - fs.t;
    outer.push([R.r1 + fs.t, fs.zEye, 1]);
    for (let i = N - 1; i >= 0; i--) { const t = ((PI / 2) * i) / N; outer.push([fs.rA - a2 * Math.sin(t), fs.zEye - b2_ * Math.cos(t), 1]); }
    for (let i = 1; i <= 8; i++) { const r = lerp(fs.rA, r2, i / 8); outer.push([r, zOut(r), i < 8 ? 1 : 0]); }
    pts.push(...inner, ...outer);
    pts[0][2] = 0; pts[inner.length - 1][2] = 0;
    return clipRZ(pts, rFrom, rTo);
  };
  return { R, r2, rH, rS, zIn, zOut, zTop, rLE, off, beta, profFS, zLE };
}
// recorta una sección cerrada (r, z) a rFrom ≤ r ≤ rTo (los lados nuevos van en r = rFrom o r = rTo)
function clipRZ(pts, rFrom, rTo) {
  const clip = (poly, c, keepAbove) => {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length], fa = a[0] - c, fb = b[0] - c;
      const ina = keepAbove ? fa >= -1e-9 : fa <= 1e-9, inb = keepAbove ? fb >= -1e-9 : fb <= 1e-9;
      if (ina) out.push(a);
      if (ina !== inb) { const t = fa / (fa - fb), q = [c, a[1] + (b[1] - a[1]) * t, 0], l = out[out.length - 1]; if (!l || Math.hypot(l[0] - q[0], l[1] - q[1]) > 1e-6) out.push(q); }
    }
    return out;
  };
  let p = pts;
  if (rFrom != null) p = clip(p, rFrom, true);
  if (rTo != null) p = clip(p, rTo, false);
  return p;
}

/* un álabe radial: la malla de sus caras (con normales) y sus aristas, con el lado de cada una. Se recorre con (m, t):
   m va del borde de ataque (0) a la salida (1) y t de la tapa trasera (0) a la delantera (1); el punto (m, t) está entre
   el punto de la tapa trasera y el de la delantera a la misma m, así la altura sigue la tapa sin quiebres */
function radVane(cx, M, kIdx) {
  const R = M.R, { r2, zTop, off } = M, rH = M.rH, rS = M.rS;
  const th0 = R.phase * D2R + (kIdx * TAU) / R.z;
  const th = (r) => th0 + off(r);
  const cam = (r) => [r * Math.cos(th(r)), r * Math.sin(th(r)), 0];
  const tan = (r) => { const e = 0.003, a = cam(r - e), b = cam(r + e); return unit3(sub3(b, a)); };
  const nh = (r) => { const t = tan(r); return [-t[1], t[0], 0]; };        // hacia +θ
  const taper = (d) => { const q = Math.min(1, Math.max(0, d / R.lLE)); return (R.e / 2) * (R.eLE / R.e + (1 - R.eLE / R.e) * (1 - (1 - q) * (1 - q))); };
  const qm = (m) => 0.55 * m + 0.45 * m * m;
  const rr = (m, t) => lerp(rH + (r2 - rH) * qm(m), rS + (r2 - rS) * qm(m), t);
  const zz = (m, t) => t * zTop(rS + (r2 - rS) * qm(m));
  const PP = (m, t, s) => { const r = rr(m, t), c = cam(r), h = taper(r - rr(0, t)), n = nh(r); return [c[0] + n[0] * s * h, c[1] + n[1] * s * h, zz(m, t)]; };
  const halfR = (r, t) => taper(r - lerp(rH, rS, t));
  const PR = (r, t, s) => { const c = cam(r), h = halfR(r, t), n = nh(r), z = r >= rS ? t * zTop(r) : t * zTop(rS); return [c[0] + n[0] * s * h, c[1] + n[1] * s * h, z]; };
  const NR = 48, NT = 12;
  const sideN = (m, t, s) => {
    const e = 0.0005, e2 = 0.0005;
    let nn = unit3(cross3(sub3(PP(m + e, t, s), PP(m - e, t, s)), sub3(PP(m, t + e2, s), PP(m, t - e2, s))));
    if (dot3(nn, mul3(nh(rr(m, t)), s)) < 0) nn = mul3(nn, -1);
    return nn;
  };
  const grid = (s) => { const g = []; for (let j = 0; j <= NT; j++) { g.push([]); const t = j / NT; for (let i = 0; i <= NR; i++) { const m = i / NR; g[j].push({ m, t, p: PP(m, t, s), n: sideN(m, t, s) }); } } return g; };
  const tris = [];
  const gs = {};
  for (const s of [1, -1]) {
    const g = grid(s); gs[s] = g;
    for (let j = 0; j < NT; j++) for (let i = 0; i < NR; i++) {
      const a = g[j][i], b = g[j][i + 1], c = g[j + 1][i + 1], d = g[j + 1][i];
      tris.push({ p: [a.p, b.p, c.p], n: [a.n, b.n, c.n], face: "s" + s }, { p: [a.p, c.p, d.p], n: [a.n, c.n, d.n], face: "s" + s });
    }
  }
  // la cara de arriba (t = 1): el borde que va contra la tapa delantera o, en los abiertos, contra la carcasa
  const topN = (m) => { const e = 0.0005, w = sub3(PP(m, 1, 1), PP(m, 1, -1)); let nn = unit3(cross3(sub3(PP(m + e, 1, 0), PP(m - e, 1, 0)), w)); if (nn[2] < 0) nn = mul3(nn, -1); return nn; };
  for (let i = 0; i < NR; i++) {
    const ma = i / NR, mb = (i + 1) / NR, na = topN(ma), nb = topN(mb);
    const A1 = PP(ma, 1, 1), A2 = PP(ma, 1, -1), B1 = PP(mb, 1, 1), B2 = PP(mb, 1, -1);
    tris.push({ p: [A1, B1, B2], n: [na, nb, nb], face: "top" }, { p: [A1, B2, A2], n: [na, nb, na], face: "top" });
  }
  // el borde de ataque (m = 0) y el de salida (m = 1)
  const leN = (t) => { const e = 0.0005, w = sub3(PP(0, t, 1), PP(0, t, -1)); let nn = unit3(cross3(sub3(PP(0, t + e, 0), PP(0, t - e, 0)), w)); if (dot3(nn, tan(rr(0, t))) > 0) nn = mul3(nn, -1); return nn; };
  const teN = () => { const c = cam(r2); return unit3([c[0], c[1], 0]); };
  for (let j = 0; j < NT; j++) {
    const ta = j / NT, tb = (j + 1) / NT;
    const a1 = PP(0, ta, 1), a2 = PP(0, ta, -1), b1 = PP(0, tb, 1), b2 = PP(0, tb, -1), na = leN(ta), nb = leN(tb);
    tris.push({ p: [a1, b1, b2], n: [na, nb, nb], face: "le" }, { p: [a1, b2, a2], n: [na, nb, na], face: "le" });
    const c1 = PP(1, ta, 1), c2 = PP(1, ta, -1), d1 = PP(1, tb, 1), d2 = PP(1, tb, -1), nt = teN();
    tris.push({ p: [c1, d1, d2], n: [nt, nt, nt], face: "te" }, { p: [c1, d2, c2], n: [nt, nt, nt], face: "te" });
  }
  // las aristas, cada una con las normales de sus dos caras (para decidir si es contorno, arista suave o no se ve)
  const V3 = cx.V3, vis = (nn) => dot3(nn, V3) > 1e-4;
  const segs = [];   // { a, b, tone }
  const tone = (na, nb) => { const fa = na && vis(na), fb = nb && vis(nb); return fa && fb ? "faint" : fa || fb ? "mid" : null; };
  const DOWN = [0, 0, -1];
  for (const s of [1, -1]) {
    const g = gs[s];
    // arriba y abajo; donde el lado se voltea dentro del tramo, el tramo se parte ahí, así el contorno llega justo al
    // pliegue
    const edge = (row, other) => {
      for (let i = 0; i < NR; i++) {
        const A0 = g[row][i], B0 = g[row][i + 1], va = dot3(A0.n, V3), vb = dot3(B0.n, V3), t = row / NT;
        const nO = (m) => (other === "top" ? topN(m) : DOWN);
        if ((va > 0) === (vb > 0)) { const mm = (A0.m + B0.m) / 2; segs.push({ a: A0.p, b: B0.p, tone: tone(sideN(mm, t, s), nO(mm)) }); continue; }
        const f = va / (va - vb), mC = lerp(A0.m, B0.m, f), C = PP(mC, t, s);
        segs.push({ a: A0.p, b: C, tone: tone(A0.n, nO(lerp(A0.m, mC, 0.5))) }, { a: C, b: B0.p, tone: tone(B0.n, nO(lerp(mC, B0.m, 0.5))) });
      }
    };
    edge(NT, "top"); edge(0, "base");
    for (let j = 0; j < NT; j++) {
      const tm = (j + 0.5) / NT;
      segs.push({ a: g[j][0].p, b: g[j + 1][0].p, tone: tone(sideN(0.002, tm, s), leN(tm)) });
      segs.push({ a: g[j][NR].p, b: g[j + 1][NR].p, tone: tone(sideN(0.998, tm, s), teN()) });
    }
    // la silueta de la cara (n·V = 0)
    const vv = g.map((row) => row.map((v) => dot3(v.n, V3)));
    const tri = (T) => { const pts = []; for (let q = 0; q < 3; q++) { const [ja, ia] = T[q], [jb, ib] = T[(q + 1) % 3], va = vv[ja][ia], vb = vv[jb][ib]; if ((va > 0) !== (vb > 0)) { const f = va / (va - vb), A0 = g[ja][ia], B0 = g[jb][ib]; pts.push(PP(lerp(A0.m, B0.m, f), lerp(A0.t, B0.t, f), s)); } } if (pts.length === 2) segs.push({ a: pts[0], b: pts[1], tone: "mid" }); };
    for (let j = 0; j < NT; j++) for (let i = 0; i < NR; i++) { tri([[j, i], [j, i + 1], [j + 1, i + 1]]); tri([[j, i], [j + 1, i + 1], [j + 1, i]]); }
  }
  // las esquinas de la cara de arriba y de las de los bordes
  const corner = (p, q, na, nb) => segs.push({ a: p, b: q, tone: tone(na, nb) });
  corner(PP(1, 1, 1), PP(1, 1, -1), topN(0.999), teN());
  corner(PP(0, 1, 1), PP(0, 1, -1), topN(0.001), leN(1));
  corner(PP(0, 0, 1), PP(0, 0, -1), leN(0), DOWN);
  corner(PP(1, 0, 1), PP(1, 0, -1), teN(), DOWN);
  // la altura del álabe en cada radio (para las formas del audit)
  const hAt = (r) => (r >= rS ? zTop(r) : (zTop(rS) * (r - rH)) / (rS - rH));
  return { tris, segs: segs.filter((sg) => sg.tone), th, cam, nh, half: halfR, hAt, PP: PR };
}
// recorta una lista de triángulos y de tramos por funciones f(p) ≥ 0
function clipBy(tris, segs, preds) {
  const clip3 = (poly, f) => {
    const out = [], m = poly.length;
    for (let i = 0; i < m; i++) {
      const a = poly[i], b = poly[(i + 1) % m], fa = f(a.p), fb = f(b.p), ina = fa >= 0, inb = fb >= 0;
      if (ina) out.push(a);
      if (ina !== inb) { const t = fa / (fa - fb); out.push({ p: G.lerp3(a.p, b.p, t), n: unit3(G.lerp3(a.n, b.n, t)) }); }
    }
    return out;
  };
  const outT = [];
  for (const t of tris) {
    let poly = t.p.map((p, i) => ({ p, n: t.n[i] }));
    for (const f of preds) { poly = clip3(poly, f); if (poly.length < 3) break; }
    if (poly.length < 3) continue;
    for (let i = 1; i + 1 < poly.length; i++) outT.push({ p: [poly[0].p, poly[i].p, poly[i + 1].p], n: [poly[0].n, poly[i].n, poly[i + 1].n], face: t.face });
  }
  const outS = [];
  for (const sg of segs) {
    let a = sg.a, b = sg.b, ok = true;
    for (const f of preds) {
      const fa = f(a), fb = f(b);
      if (fa < 0 && fb < 0) { ok = false; break; }
      if (fa < 0) a = G.lerp3(a, b, fa / (fa - fb));
      else if (fb < 0) b = G.lerp3(a, b, fa / (fa - fb));
    }
    if (ok && G.len3(sub3(a, b)) > 1e-6) outS.push({ ...sg, a, b });
  }
  return { tris: outT, segs: outS };
}
/* dibuja un trozo de álabe (los triángulos por capas de profundidad y las aristas encima) y registra sus formas: un
   prisma vertical por tramo de la curva, recortado a lo mismo */
function vanePiece(cx, name, V, M, preds, { owner = "impulsor", shapesOnly = false } = {}) {
  const { tris, segs } = clipBy(V.tris, V.segs, preds);
  const shapes = [];
  const NS = 30;
  for (let i = 0; i < NS; i++) {
    const ra = lerp(M.rH, M.r2, i / NS), rb = lerp(M.rH, M.r2, (i + 1) / NS);
    const ha = Math.min(V.half(ra, 0), V.half(ra, 1)), hb = Math.min(V.half(rb, 0), V.half(rb, 1));
    const ca = V.cam(ra), cb = V.cam(rb), na = V.nh(ra), nb = V.nh(rb);
    let poly = [add3(ca, mul3(na, -ha)), add3(cb, mul3(nb, -hb)), add3(cb, mul3(nb, hb)), add3(ca, mul3(na, ha))].map((p) => ({ p, n: ZD }));
    const clip3 = (pl, f) => { const out = []; for (let q = 0; q < pl.length; q++) { const a = pl[q], b = pl[(q + 1) % pl.length], fa = f(a.p), fb = f(b.p); if (fa >= 0) out.push(a); if ((fa >= 0) !== (fb >= 0)) out.push({ p: G.lerp3(a.p, b.p, fa / (fa - fb)), n: ZD }); } return out; };
    for (const f of preds) { poly = clip3(poly, f); if (poly.length < 3) break; }
    if (poly.length < 3) continue;
    const h = Math.max(0.6, Math.min(V.hAt(ra), V.hAt(rb)));
    const pl = poly.map((w) => [w.p[0], w.p[1]]);
    let a2 = 0; for (let q = 0; q < pl.length; q++) { const p = pl[q], r = pl[(q + 1) % pl.length]; a2 += p[0] * r[1] - r[0] * p[1]; }
    if (Math.abs(a2) < 0.2) continue;
    shapes.push(A.prism(F0, pl, 0, h, { name, owner }));
  }
  if (shapesOnly || !tris.length) return { shapes, empty: !tris.length };
  shapes.forEach((sh) => cx.record(sh));
  // las caras van por grupos: primero el lado que menos se ve, después el otro, y encima los bordes y el canto de
  // arriba (un álabe es delgado: por profundidad de triángulo, el lado de atrás se colaba por el de adelante)
  const by = {}; for (const t of tris) (by[t.face] ||= []).push(t);
  const facing = (g) => g.reduce((q, t) => q + t.n.reduce((a, nn) => a + dot3(nn, cx.V3), 0), 0) / (3 * g.length);
  const sides = ["s1", "s-1"].filter((f) => by[f]).sort((a, b) => facing(by[a]) - facing(by[b]));
  const svg = [...sides, "te", "le", "top"].filter((f) => by[f]).map((f) => cx.paintTris(by[f], { slabs: f.startsWith("s") ? 3 : 1, cls: "ib-ss" }).svg).join("");
  const mids = segs.filter((s) => s.tone === "mid").map((s) => [s.a, s.b]), fts = segs.filter((s) => s.tone === "faint").map((s) => [s.a, s.b]);
  const lines = (fts.length ? cx.Ln(cx.segPath(fts), { tone: "faint" }) : "") + (mids.length ? cx.Ln(cx.segPath(mids), { tone: "mid" }) : "");
  const ref = mul3(tris.reduce((q, t) => add3(q, t.p[0]), [0, 0, 0]), 1 / tris.length);
  cx.put(name, ref, `<g>${svg}${lines}</g>`, shapes);
  return { shapes, empty: false };
}

/* ====================================================================
   las piezas comunes de los radiales: el eje con su chaveta, el cubo sin su cuarto de adelante, la arandela, la
   tuerca y la punta roscada
   ==================================================================== */
function ejeYCubo(cx, M, { backBoss = false } = {}) {
  const R = M.R, H = R.hub, SH = R.shaft, KY = R.key, AZ = cx.AZr, NOTCH = R.notch * D2R;
  // el eje de abajo (el que se ve bajo el impulsor) y el de arriba, dentro del cubo, con su punta roscada
  // (abajo solo se ve en el abierto: en los otros dos lo tapa la tapa trasera)
  if (backBoss) cx.turned("eje", F0, [[SH.bottom, SH.r - 1.5], [SH.bottom + 1.5, SH.r], [H.back, SH.r]], {}, { cls: "ib-sh", ground: true, owner: "eje" });
  cx.turned("eje.arriba", F0, [[0, SH.r], [H.zt, SH.r]], {}, { cls: "ib-sh", owner: "eje", ground: !backBoss });
  const zNut = H.zt + R.washer.h + R.nut.h;
  cx.turned("rosca", F0, [[zNut, SH.thread], [SH.top - 1.5, SH.thread], [SH.top, SH.thread - 1.5]], {}, { cls: "ib-sh", owner: "eje" });
  // el cubo: de la tapa trasera sube con un empalme a r = rn y termina en un chaflán bajo la arandela
  const NF = 8, prof = [[H.rb, 0], [H.rf, 0]];
  for (let i = 1; i <= NF; i++) { const t = ((PI / 2) * i) / NF; prof.push([H.rf - (H.rf - H.rn) * Math.sin(t), (H.rf - H.rn) * (1 - Math.cos(t)), i < NF ? 1 : 1]); }
  prof.push([H.rn, H.zt - 2], [H.rn - 2, H.zt], [H.rb, H.zt]);
  const kinds = prof.map((_, i) => (i === 0 || i === prof.length - 1 ? "n" : "s"));
  revPiece(cx, "cubo.fondo", { prof, kinds, a0: AZ + PI / 2, a1: AZ + 1.5 * PI });
  revPiece(cx, "cubo.izq", { prof, kinds, a0: AZ + NOTCH, a1: AZ + PI / 2, ends: ["face", "seam"] });
  revPiece(cx, "cubo.der", { prof, kinds, a0: AZ - PI / 2, a1: AZ - NOTCH, ends: ["seam", "face"] });
  if (backBoss) {
    revPiece(cx, "cubo.atras", { prof: [[H.rb, H.back], [H.rBack - 2, H.back], [H.rBack, H.back + 2], [H.rBack, -R.rs.t], [H.rb, -R.rs.t]], kinds: ["s", "s", "s", "n", "n"], a0: AZ - PI / 2, a1: AZ + 1.5 * PI });
  }
  // la chaveta, entera, en el chavetero del eje (el del cubo quedó en el cuarto quitado)
  const tk = AZ - 0.26, Fk = { o: [0, 0, 0], a: er(tk), u: et(tk), v: ZD }, hw = KY.w / 2, kpoly = [[-hw, 0], [hw, 0]];
  for (let i = 0; i <= 18; i++) { const a = (PI * i) / 18; kpoly.push([hw * Math.cos(a), KY.z1 - hw + hw * Math.sin(a)]); }
  cx.fp("chaveta", Fk, kpoly, KY.rIn, KY.rOut, {}, { cls: "ib-hw", owner: "chaveta", cut: [A.disc(F0, -1, KY.z1 + 1, SH.r)] });
  // la arandela y la tuerca del impulsor
  cx.disc("arandela", F0, H.zt, H.zt + R.washer.h, R.washer.r, {}, { cls: "ib-hw", owner: "tuerca", rIn: SH.thread });
  const z0 = H.zt + R.washer.h, nutR = R.nut.af / Math.sqrt(3);
  cx.fp("tuerca", F0, HEX(nutR, AZ + 0.15), z0, z0 + R.nut.h, {}, { cls: "ib-hw", owner: "tuerca", cut: [A.disc(F0, z0 - 1, z0 + R.nut.h + 1, SH.thread)] });
  // la cara de la tuerca que mira al lector por la izquierda, la cara del corte del cubo y el eje (abajo en el abierto,
  // en el cuarto quitado del cubo en los otros)
  const faces = Array.from({ length: 6 }, (_, q) => AZ + 0.15 + PI / 6 + (q * PI) / 3);
  const fN = faces.sort((a, b) => Math.cos(b - (AZ + 0.55)) - Math.cos(a - (AZ + 0.55)))[0];
  Object.assign(cx.ANCLAS, {
    TUERCA: add3(mul3(er(fN), (R.nut.af / 2) * 0.98), [0, 0, z0 + R.nut.h * 0.5]),
    CHAVETA: add3(mul3(er(tk), KY.rOut), [0, 0, KY.z1 * 0.45]),
    CUBO: add3(mul3(er(AZ + NOTCH), (H.rb + H.rn) / 2 + 1), [0, 0, H.zt * 0.5]),
    EJE: backBoss ? add3(mul3(er(AZ + 0.35), SH.r), [0, 0, SH.bottom + 14]) : add3(mul3(er(AZ - 0.55), SH.thread), [0, 0, SH.top - 3.5]),
  });
}
// la tapa trasera entera (cerrado y semiabierto), con el piso del cuarto quitado del cubo y, si van, los agujeros de balance
function tapaTrasera(cx, M, { holes = false } = {}) {
  const R = M.R, H = R.hub, AZ = cx.AZr, NOTCH = R.notch * D2R;
  let extra = notchFloor(cx, M);
  if (holes) extra += agujeros(cx, M);
  cx.disc("tapa.trasera", F0, -R.rs.t, 0, R.r2, {}, { cls: "ib-ss", owner: "impulsor", rIn: H.rb, extra });
  void AZ; void NOTCH;
}
// el piso del cuarto quitado del cubo: la cara del corte en z = 0
function notchFloor(cx, M) {
  const R = M.R, H = R.hub, AZ = cx.AZr, NOTCH = R.notch * D2R, pts = [];
  const N = 16;
  for (let i = 0; i <= N; i++) { const t = AZ - NOTCH + (2 * NOTCH * i) / N; pts.push([H.rf * Math.cos(t), H.rf * Math.sin(t), 0]); }
  for (let i = N; i >= 0; i--) { const t = AZ - NOTCH + (2 * NOTCH * i) / N; pts.push([H.rb * Math.cos(t), H.rb * Math.sin(t), 0]); }
  return cx.cutFace(pts);
}
// los agujeros de balance: uno por canal, en la tapa trasera, a la mitad entre dos álabes
function agujeros(cx, M) {
  const R = M.R, rr = R.holes.r, rd = R.holes.d / 2;
  let s = "";
  for (let q = 0; q < R.z; q++) {
    const t = R.phase * D2R + M.off(rr) + ((q + 0.5) * TAU) / R.z, c = [rr * Math.cos(t), rr * Math.sin(t), 0];
    const ring = Array.from({ length: 24 }, (_, i) => { const a = (i / 24) * TAU; return cx.pr(add3(c, [rd * Math.cos(a), rd * Math.sin(a), 0])); });
    s += `<path class="ib-bore" d="${pth1(ring)}"/>`;
    if (q === 0) cx._hole0 = t;
  }
  return s;
}
/* los álabes de un radial, partidos para el orden de pintura: el plano del eje que mira al lector los parte en las
   mitades de adelante y de atrás, y r = 41,5 separa lo que queda dentro del ojo; en el cerrado, además, los planos del
   sector quitado y r = 62 */
function alabes(cx, M, { closed = false, owner = "impulsor" } = {}) {
  const R = M.R, AZ = cx.AZr, W = R.cut.half * D2R, rc = R.cut.r, rEye = closed ? R.r1 + R.fs.t + 0.01 : 41.5;
  const near = (p) => dot3(p, cx.Vh), far = (p) => -dot3(p, cx.Vh);
  const rad = (p) => Math.hypot(p[0], p[1]);
  const inEye = (p) => rEye - rad(p), outEye = (p) => rad(p) - rEye;
  const nL = [-Math.sin(AZ + W), Math.cos(AZ + W), 0], nR = [-Math.sin(AZ - W), Math.cos(AZ - W), 0];
  const inL = (p) => -dot3(p, nL), outL = (p) => dot3(p, nL), inR = (p) => dot3(p, nR), outR = (p) => -dot3(p, nR);
  const vanes = [];
  for (let q = 0; q < R.z; q++) {
    const V = radVane(cx, M, q);
    vanes.push(V);
    const pieces = closed ? [
      ["ojo.frente", [inEye, near]], ["ojo.fondo", [inEye, far]],
      ["sector", [(p) => rad(p) - rc, inL, inR, near]],
      ["sector.dentro", [outEye, (p) => rc - rad(p), inL, inR, near]],
      ["izq", [outEye, outL, near]], ["der", [outEye, outR, near]], ["fondo", [outEye, far]],
    ] : [
      ["frente", [near]], ["fondo", [far]],
    ];
    for (const [nm, preds] of pieces) vanePiece(cx, `alabe${q}.${nm}`, V, M, preds, { owner });
  }
  return vanes;
}

/* ====================================================================
   1 · el cerrado: los álabes entre la tapa trasera y la delantera, con el ojo, el anillo de desgaste y los agujeros de
   balance; se le quita a la tapa delantera un sector de ±55° frente al lector, de r = 62 hacia afuera
   ==================================================================== */
function cerrado(cx) {
  const M = radModel(), R = M.R, AZ = cx.AZr, W = R.cut.half * D2R, rc = R.cut.r;
  tapaTrasera(cx, M, { holes: true });
  ejeYCubo(cx, M);
  const V = alabes(cx, M, { closed: true });
  // la tapa delantera en cuatro piezas: el anillo del ojo adelante (hasta r = 62), las dos de afuera a los lados del
  // sector y la mitad de atrás entera
  const full = M.profFS(null, null), ringP = M.profFS(null, rc), outerP = M.profFS(rc, null);
  const kindsOf = (prof, seamR) => prof.map((p, i) => { const q = prof[(i + 1) % prof.length]; return Math.abs(p[0] - seamR) < 1e-6 && Math.abs(q[0] - seamR) < 1e-6 ? "x" : "s"; });
  const kFull = full.map(() => "s");
  // la mitad de atrás, partida en el cuello (r = 44): el cuello va delante del anillo de desgaste y el anillo delante del resto
  const rNeck = R.r1 + R.fs.t + 0.01, neckP = M.profFS(null, rNeck), restP = M.profFS(rNeck, null);
  revPiece(cx, "tapa.delantera.cuello", { prof: neckP, kinds: kindsOf(neckP, rNeck).map((kd) => (kd === "x" ? "n" : kd)), a0: AZ + PI / 2, a1: AZ + 1.5 * PI });
  revPiece(cx, "tapa.delantera.fondo", { prof: restP, kinds: kindsOf(restP, rNeck).map((kd) => (kd === "x" ? "n" : kd)), a0: AZ + PI / 2, a1: AZ + 1.5 * PI });
  void full; void kFull;
  const kRing = kindsOf(ringP, rc).map((kd) => (kd === "x" ? "c" : kd));
  const ranges = {}; kRing.forEach((kd, i) => { if (kd === "c") ranges[i] = [AZ - W, AZ + W]; });
  revPiece(cx, "tapa.delantera.ojo", { prof: ringP, kinds: kRing, ranges, a0: AZ - PI / 2, a1: AZ + PI / 2 });
  const kOut = kindsOf(outerP, rc).map((kd) => (kd === "x" ? "n" : kd));
  revPiece(cx, "tapa.delantera.izq", { prof: outerP, kinds: kOut, a0: AZ + W, a1: AZ + PI / 2, ends: ["face", "seam"] });
  revPiece(cx, "tapa.delantera.der", { prof: outerP, kinds: kOut, a0: AZ - PI / 2, a1: AZ - W, ends: ["seam", "face"] });
  // el anillo de desgaste sobre el cuello del ojo
  const RG = R.ring, rp = [[RG.r0, RG.z0], [RG.r1 - 0.6, RG.z0], [RG.r1, RG.z0 + 0.6], [RG.r1, RG.z1 - 0.8], [RG.r1 - 0.8, RG.z1], [RG.r0, RG.z1]];
  const rk = ["s", "s", "s", "s", "s", "s"];
  revPiece(cx, "anillo.frente", { prof: rp, kinds: rk, a0: AZ - PI / 2, a1: AZ + PI / 2, cls: "ib-ring", owner: "anillo" });
  revPiece(cx, "anillo.fondo", { prof: rp, kinds: rk, a0: AZ + PI / 2, a1: AZ + 1.5 * PI, cls: "ib-ring", owner: "anillo" });
  const fs = R.fs;
  Object.assign(cx.ANCLAS, {
    OJO: add3(mul3(er(AZ + PI * 0.92), R.r1), [0, 0, 36]),
    ANILLO: add3(mul3(er(AZ - 0.55), RG.r1), [0, 0, (RG.z0 + RG.z1) / 2]),
    TAPA_DEL: add3(mul3(er(AZ - W - 0.3), 80), [0, 0, M.zOut(80)]),
    ALABE: (() => { const r = 80, t = V[sectorVane(cx, M, V)].th(r); return add3(mul3(er(t), r), [0, 0, M.zIn(r) * 0.55]); })(),
    TAPA_TRAS: add3(mul3(er(AZ - 0.35), R.r2), [0, 0, -R.rs.t / 2]),
    AGUJERO: add3(mul3(er(cx._hole0), R.holes.r), [0, 0, 0]),
  });
  // el agujero que se ve, el de más a la derecha (su rótulo va a la derecha)
  { const pts = []; for (let q = 0; q < R.z; q++) { const t = R.phase * D2R + M.off(R.holes.r) + ((q + 0.5) * TAU) / R.z; pts.push(add3(mul3(er(t), R.holes.r), [0, 0, 0.3])); }
    cx.CANDS.AGUJERO = { pts: pts.sort((a, b) => cx.pr(b)[0] - cx.pr(a)[0]), own: ["tapa.trasera"] }; }
  void fs;
}
// el álabe que cae más al centro del sector quitado, para su rótulo
function sectorVane(cx, M, V) {
  let best = 0, bd = 1e9;
  V.forEach((v, q) => { const t = v.th(80), d = Math.abs(Math.atan2(Math.sin(t - cx.AZr), Math.cos(t - cx.AZr)) - 0.25); if (d < bd) { bd = d; best = q; } });
  return best;
}

// los candidatos del borde libre (a la derecha) y del borde de ataque (a la izquierda), en todos los álabes
function candidatosAlabes(cx, M, V) {
  const R = M.R, own = (q) => [`alabe${q}.`];
  const bordes = [], entradas = [];
  V.forEach((v, q) => {
    for (const r of [72, 66, 80, 60]) bordes.push({ p: v.PP(r, 1, 0), q });
    for (const t of [0.55, 0.4, 0.7]) entradas.push({ p: v.PP(M.rLE(t), t, 0), q });
  });
  bordes.sort((a, b) => cx.pr(b.p)[0] - cx.pr(a.p)[0]);
  entradas.sort((a, b) => cx.pr(a.p)[0] - cx.pr(b.p)[0]);
  // cada candidato admite que lo tape su propio álabe (el ancla va en la línea media)
  cx.CANDS.BORDE = { pts: bordes.map((b) => b.p), own: bordes.length ? own(bordes[0].q) : [] };
  cx.CANDS.ENTRADA = { pts: entradas.map((b) => b.p), own: entradas.length ? own(entradas[0].q) : [] };
  // la versión con el dueño de cada uno
  cx.CANDS.BORDE.ownOf = bordes.map((b) => own(b.q)); cx.CANDS.ENTRADA.ownOf = entradas.map((b) => own(b.q));
  void R;
}

/* ====================================================================
   2 · el semiabierto: los mismos álabes sobre la tapa trasera, sin tapa delantera; su borde libre pasa junto a la carcasa
   ==================================================================== */
function semiabierto(cx) {
  const M = radModel(), R = M.R, AZ = cx.AZr;
  tapaTrasera(cx, M);
  ejeYCubo(cx, M);
  const V = alabes(cx, M);
  const qv = sectorVane(cx, M, V), r = 78, t = V[qv].th(r);
  Object.assign(cx.ANCLAS, {
    ALABE: add3(mul3(er(t), r), [0, 0, M.zIn(r) * 0.45]),
    TAPA_TRAS: add3(mul3(er(AZ - 0.35), R.r2), [0, 0, -R.rs.t / 2]),
  });
  candidatosAlabes(cx, M, V);
}

/* ====================================================================
   3 · el abierto: la tapa trasera recortada entre álabes (queda un nervio bajo cada álabe y un disco junto al cubo)
   ==================================================================== */
function abierto(cx) {
  const M = radModel(), R = M.R, O = R.open, AZ = cx.AZr;
  // el contorno de la tapa recortada en planta: cada álabe se apoya en un nervio que se angosta hasta r = rWeb, y entre
  // un nervio y el siguiente la tapa baja en arco hasta r = rMin
  const outline = [];
  const th = (q, r) => R.phase * D2R + M.off(r) + (q * TAU) / R.z;
  const w = (r) => lerp(O.wWeb, O.wTip, (r - O.rMin) / (O.rWeb - O.rMin));
  for (let q = 0; q < R.z; q++) {
    const pt = (r, s) => { const t = th(q, r), c = [r * Math.cos(t), r * Math.sin(t)], e = 0.02, t2 = th(q, r + e), c2 = [(r + e) * Math.cos(t2), (r + e) * Math.sin(t2)], tg = [c2[0] - c[0], c2[1] - c[1]], L = Math.hypot(tg[0], tg[1]); return [c[0] + (-tg[1] / L) * s * w(r), c[1] + (tg[0] / L) * s * w(r)]; };
    const N = 14;
    for (let i = 0; i <= N; i++) outline.push(pt(lerp(O.rMin, O.rWeb, i / N), -1));
    // la punta redonda del nervio: media vuelta alrededor del punto de la curva en r = rWeb, por afuera
    { const tip = th(q, O.rWeb), c = [O.rWeb * Math.cos(tip), O.rWeb * Math.sin(tip)], a = pt(O.rWeb, -1), al = Math.atan2(a[1] - c[1], a[0] - c[0]);
      for (let i = 1; i < 8; i++) { const t = al + (PI * i) / 8; outline.push([c[0] + w(O.rWeb) * Math.cos(t), c[1] + w(O.rWeb) * Math.sin(t)]); } }
    for (let i = N; i >= 0; i--) outline.push(pt(lerp(O.rMin, O.rWeb, i / N), 1));
    // el arco hasta el nervio siguiente, con una muesca hacia adentro
    const p0 = pt(O.rMin, 1), t0 = Math.atan2(p0[1], p0[0]);
    const nx = (() => { const t = th(q + 1, O.rMin), cc = [O.rMin * Math.cos(t), O.rMin * Math.sin(t)], e = 0.02, t2 = th(q + 1, O.rMin + e), c2 = [(O.rMin + e) * Math.cos(t2), (O.rMin + e) * Math.sin(t2)], tg = [c2[0] - cc[0], c2[1] - cc[1]], L = Math.hypot(tg[0], tg[1]); return [cc[0] - (-tg[1] / L) * w(O.rMin), cc[1] - (tg[0] / L) * w(O.rMin)]; })();
    let t1 = Math.atan2(nx[1], nx[0]); while (t1 < t0) t1 += TAU;
    const NA = 12;
    const ra = Math.hypot(p0[0], p0[1]), rb = Math.hypot(nx[0], nx[1]);
    for (let i = 1; i < NA; i++) { const f = i / NA, t = lerp(t0, t1, f), rr = lerp(ra, rb, f) - 3.5 * Math.sin(PI * f); outline.push([rr * Math.cos(t), rr * Math.sin(t)]); }
  }
  void AZ;
  const H = R.hub;
  cx.fp("tapa.trasera", F0, outline, -R.rs.t, 0, {}, { cls: "ib-ss", owner: "impulsor", cut: [A.disc(F0, -R.rs.t - 1, 1, H.rb)], extra: notchFloor(cx, M) });
  ejeYCubo(cx, M, { backBoss: true });
  const V = alabes(cx, M);
  const qv = sectorVane(cx, M, V);
  // el nervio que mejor se ve: el del álabe de la izquierda
  let qn = 0, best = -1e9;
  for (let q = 0; q < R.z; q++) { const t = th(q, 60), s = Math.cos(t - AZ) * 0.6 + Math.sin(t - AZ); if (s > best) { best = s; qn = q; } }
  Object.assign(cx.ANCLAS, { ALABE: add3(mul3(er(V[qv].th(84)), 84), [0, 0, M.zIn(84) * 0.5]) });
  candidatosAlabes(cx, M, V);
  // la tapa recortada: puntos de su cara de arriba junto a cada álabe, el de más a la izquierda primero
  { const pts = []; for (let q = 0; q < R.z; q++) for (const rr of [48, 52, 45]) for (const sg of [1, -1]) { const v = V[q], c = v.cam(rr), n = v.nh(rr); pts.push(add3(c, add3(mul3(n, sg * (R.e / 2 + 2.2)), [0, 0, 0.3]))); }
    cx.CANDS.NERVIO = { pts: pts.sort((a, b) => cx.pr(a)[0] - cx.pr(b)[0]), own: ["tapa.trasera"] }; }
  void qn; void H;
}

/* ====================================================================
   4 · el axial: cubo de ν = 0,5, cuatro álabes torcidos de perfil delgado, el cono de entrada sin su cuarto de
   adelante, la tuerca, el eje y la mitad de atrás de la carcasa, a 0,6 mm de las puntas
   ==================================================================== */
function bladeAngles(r) {
  const X_ = GEO.AX, x = r / X_.R, kk = X_.psi / (2 * X_.etaH);
  const b1 = Math.atan(X_.phi / x), b2 = Math.atan(X_.phi / (x - kk / x));
  const t = (x - X_.nu) / (1 - X_.nu), dev = lerp(X_.dev[0], X_.dev[1], t) * D2R, inc = X_.inc * D2R;
  const b1B = b1 + inc, b2B = b2 + dev;
  return { b1, b2, b1B, b2B, theta: (b1B + b2B) / 2, camber: Math.tan((b2B - b1B) / 2) / 4 };
}
function palaAxial(spec) {
  const rOf = (x) => spec.r0 + x * (spec.r1 - spec.r0);
  const mid = (x, c) => {
    const r = rOf(x), th = spec.theta(r), ch = spec.chord(x), s = (c * ch) / 2;
    const psi = spec.phi + (s * Math.cos(th)) / r, z = s * Math.sin(th);
    const ep = et(psi), n0 = [-Math.sin(th) * ep[0], -Math.sin(th) * ep[1], Math.cos(th)];
    const h = spec.camber(r) * ch * (1 - c * c);
    return add3([r * Math.cos(psi), r * Math.sin(psi), z], mul3(n0, h));
  };
  // espesor de un perfil NACA de cuatro cifras: ξ desde el borde de ataque (c = +1)
  const half = (x, c) => { const xi = Math.min(1, Math.max(0, (1 - c) / 2)), tr = spec.tr(x), L = spec.chord(x); return 5 * tr * L * (0.2969 * Math.sqrt(xi) - 0.126 * xi - 0.3516 * xi * xi + 0.2843 * xi ** 3 - 0.1036 * xi ** 4); };
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
function clip3(poly, f, keepPos) {
  const out = [], m = poly.length;
  for (let i = 0; i < m; i++) {
    const a = poly[i], b = poly[(i + 1) % m], fa = f(a.p), fb = f(b.p);
    const ina = keepPos ? fa >= 0 : fa < 0, inb = keepPos ? fb >= 0 : fb < 0;
    if (ina) out.push(a);
    if (ina !== inb) { const t = fa / (fa - fb); out.push({ p: G.lerp3(a.p, b.p, t), n: unit3(G.lerp3(a.n, b.n, t)) }); }
  }
  return out;
}
function sinMigas(cx, segs, minPx) {
  const key = (p) => p.map((v) => Math.round(v * 100)).join(",");
  const ends = new Map();
  segs.forEach((sg, i) => [0, 1].forEach((e) => { const kk = key(sg[e]); if (!ends.has(kk)) ends.set(kk, []); ends.get(kk).push(i); }));
  const seen = new Set(), out = [];
  for (let i = 0; i < segs.length; i++) {
    if (seen.has(i)) continue;
    const comp = [], stack = [i]; seen.add(i);
    while (stack.length) { const j = stack.pop(); comp.push(j); for (const e of [0, 1]) for (const nn of ends.get(key(segs[j][e]))) if (!seen.has(nn)) { seen.add(nn); stack.push(nn); } }
    const len = comp.reduce((q, j) => { const a = cx.pr(segs[j][0]), b = cx.pr(segs[j][1]); return q + Math.hypot(b[0] - a[0], b[1] - a[1]); }, 0);
    if (len >= minPx) comp.forEach((j) => out.push(segs[j]));
  }
  return out;
}
// los tramos de una lista que no tapa ningún triángulo de la misma pieza (se prueban el medio y los extremos de cada uno)
function visibles(cx, segs, tris, eps) {
  const V = cx.V3, pre = [];
  for (const t of tris) {
    const a = t.n.reduce((q, n) => q + dot3(n, V), 0);
    if (a <= 0) continue;
    const s = t.p.map((p) => cx.pr(p)), d = t.p.map((p) => dot3(p, V));
    for (let i = 1; i + 1 < s.length; i++) pre.push({ s: [s[0], s[i], s[i + 1]], d: [d[0], d[i], d[i + 1]], box: [Math.min(s[0][0], s[i][0], s[i + 1][0]), Math.max(s[0][0], s[i][0], s[i + 1][0]), Math.min(s[0][1], s[i][1], s[i + 1][1]), Math.max(s[0][1], s[i][1], s[i + 1][1])] });
  }
  const hidden = (p) => {
    const q = cx.pr(p), dp = dot3(p, V);
    for (const t of pre) {
      if (q[0] < t.box[0] || q[0] > t.box[1] || q[1] < t.box[2] || q[1] > t.box[3]) continue;
      const [A, B, C] = t.s, den = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]);
      if (Math.abs(den) < 1e-9) continue;
      const w0 = ((B[1] - C[1]) * (q[0] - C[0]) + (C[0] - B[0]) * (q[1] - C[1])) / den, w1 = ((C[1] - A[1]) * (q[0] - C[0]) + (A[0] - C[0]) * (q[1] - C[1])) / den, w2 = 1 - w0 - w1;
      if (w0 < 0.02 || w1 < 0.02 || w2 < 0.02) continue;
      if (w0 * t.d[0] + w1 * t.d[1] + w2 * t.d[2] > dp + eps) return true;
    }
    return false;
  };
  return segs.filter(([a, b]) => !hidden(G.lerp3(a, b, 0.5)));
}
// una pala torcida en dos piezas, partida por el plano del eje que mira al lector (como en impulsores/build.mjs)
function dibujaPala(cx, name, B, { nx = 18, nc = 14, tipCap = false, cls = "ib-ss", owner, shapeCut = null } = {}) {
  const tris = trisDePala(B, nx, nc, tipCap);
  const side = (p) => dot3(p, cx.Vh);
  const tmax = Math.max(B.half(0, 0.4), B.half(0.5, 0.4)) + 0.6;
  /* las líneas, sobre las caras de verdad (no sobre la superficie media): los pliegues de la cara de arriba y de la de
     abajo (n·V = 0), los bordes de ataque y de salida, la raíz y la punta. Un borde es contorno si una de sus dos
     caras se ve y arista suave si se ven las dos; no va si no se ve ninguna */
  const NX = 60, NC = 48, segs = [], V3 = cx.V3, vis = (n) => dot3(n, V3) > 1e-4;
  const cOf = (j) => Math.sin(-PI / 2 + (PI * j) / NC);
  const typeOf = (na, nb) => (vis(na) && vis(nb) ? "faint" : vis(na) || vis(nb) ? "mid" : null);
  const radial = (p) => unit3([p[0], p[1], 0]);
  for (let i = 0; i < NX; i++) {
    const xa = i / NX, xb = (i + 1) / NX, xm = (xa + xb) / 2;
    for (const c of [1, -1]) { const cm = c * 0.995; segs.push({ s: [B.mid(xa, c), B.mid(xb, c)], t: typeOf(B.nTop(xm, cm), B.nBot(xm, cm)) }); }
  }
  for (let j = 0; j < NC; j++) {
    const ca = cOf(j), cb = cOf(j + 1), cm = (ca + cb) / 2;
    for (const [f, nf] of [[B.top, B.nTop], [B.bot, B.nBot]]) {
      segs.push({ s: [f(0, ca), f(0, cb)], t: vis(nf(0.01, cm)) ? "mid" : null });
      if (tipCap) segs.push({ s: [f(1, ca), f(1, cb)], t: typeOf(nf(0.99, cm), radial(f(1, cm))) });
    }
  }
  for (const [f, nf] of [[B.top, B.nTop], [B.bot, B.nBot]]) {
    const vm = [], pm = [];
    for (let i = 0; i <= NX; i++) { vm.push([]); pm.push([]); for (let j = 0; j <= NC; j++) { const x = i / NX, c = cOf(j); pm[i].push([x, c]); vm[i].push(dot3(nf(x, c), V3)); } }
    const cross0 = (tri) => {
      const pts = [];
      for (let q = 0; q < 3; q++) { const [ia, ja] = tri[q], [ib, jb] = tri[(q + 1) % 3], va = vm[ia][ja], vb = vm[ib][jb]; if ((va > 0) !== (vb > 0)) { const t = va / (va - vb), x = lerp(pm[ia][ja][0], pm[ib][jb][0], t), c = lerp(pm[ia][ja][1], pm[ib][jb][1], t); pts.push(f(x, c)); } }
      if (pts.length === 2) segs.push({ s: pts, t: "mid" });
    };
    for (let i = 0; i < NX; i++) for (let j = 0; j < NC; j++) { cross0([[i, j], [i + 1, j], [i + 1, j + 1]]); cross0([[i, j], [i + 1, j + 1], [i, j + 1]]); }
  }
  [1, 0].forEach((pos) => {
    const keep = (p) => (pos ? side(p) >= 0 : side(p) < 0);
    const part = [];
    for (const t of tris) { const poly = clip3(t.p.map((p, i) => ({ p, n: t.n[i] })), side, pos === 1); if (poly.length >= 3) part.push({ p: poly.map((v) => v.p), n: poly.map((v) => v.n), cap: t.cap }); }
    if (!part.length) return;
    const faces = part.filter((t) => !t.cap), caps = part.filter((t) => t.cap);
    const cut = { mid: [], faint: [] };
    for (const { s: [a, b], t } of segs) {
      if (!t) continue;
      const fa = side(a), fb = side(b);
      if ((fa >= 0) === (fb >= 0)) { if (keep(a)) cut[t].push([a, b]); continue; }
      const m = G.lerp3(a, b, fa / (fa - fb));
      cut[t].push(keep(a) ? [a, m] : [m, b]);
    }
    const capSvg = caps.length ? cx.paintTris(caps, { cls }).svg : "";
    const { svg } = cx.paintTris(faces, { slabs: 6, cls });
    // las líneas van encima de toda la pieza, menos los tramos que la misma pala tapa (rayo contra sus triángulos)
    // lo que queda a la vista se limpia otra vez de migas: tramos sueltos que asoman entre dos caras casi juntas
    const shownM = sinMigas(cx, visibles(cx, sinMigas(cx, cut.mid, 22), part, 0.4), 10), shownF = sinMigas(cx, visibles(cx, sinMigas(cx, cut.faint, 22), part, 0.4), 10);
    const lineSvg = (shownF.length ? cx.Ln(cx.segPath(shownF), { tone: "faint" }) : "") + (shownM.length ? cx.Ln(cx.segPath(shownM), { tone: "mid" }) : "");
    const shapes = cx.sheetShapes(B.mid, B.half, 10, 8, `${name}.${pos ? "frente" : "fondo"}`, owner || name, { clip: (poly) => clip3(poly, side, pos === 1), cut: shapeCut });
    shapes.forEach((sh) => cx.record(sh));
    const ref = mul3(faces.reduce((q, t) => add3(q, t.p[0]), [0, 0, 0]), 1 / faces.length);
    cx.put(`${name}.${pos ? "frente" : "fondo"}`, ref, `<g>${capSvg}${svg}${lineSvg}</g>`, shapes);
  });
}
function axial(cx) {
  const X_ = GEO.AX, AZ = cx.AZr, R = X_.R, rh = X_.nu * R, HB = X_.hub, CN = X_.cone, SH = X_.shaft, CS = X_.casing;
  // la carcasa: la mitad de atrás, con sus bridas; las dos caras del corte van aparte (delante de las puntas de atrás)
  const cp = [[CS.rIn, CS.z0], [CS.fl.r, CS.z0], [CS.fl.r, CS.z0 + CS.fl.t], [CS.rIn + CS.t, CS.z0 + CS.fl.t], [CS.rIn + CS.t, CS.z1 - CS.fl.t], [CS.fl.r, CS.z1 - CS.fl.t], [CS.fl.r, CS.z1], [CS.rIn, CS.z1]];
  const ck = cp.map(() => "s");
  const a0 = AZ + PI / 2, a1 = AZ + 1.5 * PI;
  // los agujeros de los pernos en la cara de arriba de la brida de arriba
  let holes = "";
  for (let q = 0; q < CS.bolts; q++) {
    const t = (q + 0.5) * (TAU / CS.bolts); let tt = t; while (tt < a0) tt += TAU; while (tt > a0 + TAU) tt -= TAU;
    if (tt > a1 - 0.06 || tt < a0 + 0.06) continue;
    const c = [CS.boltR * Math.cos(tt), CS.boltR * Math.sin(tt), CS.z1];
    const ring = Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * TAU; return cx.pr(add3(c, [CS.hole * Math.cos(a), CS.hole * Math.sin(a), 0])); });
    holes += `<path class="ib-bore" d="${pth1(ring)}"/>`;
  }
  revPiece(cx, "stand.carcasa", { prof: cp, kinds: ck, a0, a1, cls: "ib-cast", cutCls: "ib-cut", owner: "carcasa", ground: true, extra: holes });
  for (const [nm, a] of [["izq", a0], ["der", a1]]) {
    const pts = cp.map(([r, z]) => [r * Math.cos(a), r * Math.sin(a), z]);
    const shape = cx.record(A.prism({ o: [0, 0, 0], a: et(a), u: er(a), v: ZD }, cp.map(([r, z]) => [r, z]), -0.3, 0.3, { name: `stand.carcasa.corte.${nm}`, owner: "carcasa", ground: true }));
    cx.put(`stand.carcasa.corte.${nm}`, add3(mul3(er(a), (CS.rIn + CS.fl.r) / 2), [0, 0, 0]), cx.cutFace(pts, "ib-cut-c"), [shape]);
  }
  // el eje, el cubo y los álabes
  cx.turned("eje", F0, [[SH.bottom, SH.r - 2], [SH.bottom + 2, SH.r], [HB.z1, SH.r]], {}, { cls: "ib-sh", ground: true, owner: "eje" });
  const hp = [[SH.r, HB.z0], [rh - 3, HB.z0], [rh, HB.z0 + 3], [rh, HB.z1], [SH.r, HB.z1]];
  const hk = ["s", "s", "s", "s", "n"];
  revPiece(cx, "cubo.fondo", { prof: hp, kinds: hk, a0: AZ + PI / 2, a1: AZ + 1.5 * PI });
  revPiece(cx, "cubo.frente", { prof: hp, kinds: hk, a0: AZ - PI / 2, a1: AZ + PI / 2 });
  const La = X_.sigmaTip * (TAU * R) / X_.n, Li = X_.liLa * La;
  const angs = [];
  for (let q = 0; q < X_.n; q++) {
    const spec = {
      r0: rh + 0.3, r1: R, phi: X_.phase * D2R + (q * TAU) / X_.n,
      theta: (r) => bladeAngles(r).theta, camber: (r) => bladeAngles(r).camber,
      chord: (x) => lerp(Li, La, x), tr: (x) => lerp(X_.tHub, X_.tTip, x),
    };
    const B = palaAxial(spec);
    dibujaPala(cx, `alabe${q}`, B, { nx: 26, nc: 22, tipCap: true, owner: "impulsor", shapeCut: [A.disc(F0, HB.z0 - 20, HB.z1 + 20, rh)] });
    angs.push({ q, B, phi: spec.phi });
  }
  // el cono de entrada, sin el cuarto que mira al lector, con la tuerca y la punta del eje adentro
  const NC = 18, cprof = [];
  for (let i = 0; i <= NC; i++) { const t = ((PI / 2) * i) / NC; cprof.push([rh * Math.cos(t), HB.z1 + CN.h * Math.sin(t), i > 0 && i < NC ? 1 : 0]); }
  const ri = rh - CN.t, hi = CN.h - CN.t;
  for (let i = NC; i >= 0; i--) { const t = ((PI / 2) * i) / NC; cprof.push([ri * Math.cos(t), HB.z1 + hi * Math.sin(t), i > 0 && i < NC ? 1 : 0]); }
  // los dos lados sobre el eje (r = 0) y el del asiento sobre el cubo no son superficies
  const cpk = cprof.map((p, i) => { const q = cprof[(i + 1) % cprof.length]; return p[0] < 1e-6 && q[0] < 1e-6 ? "n" : "s"; });
  const NOTCH = CN.cut * D2R;
  revPiece(cx, "cono.fondo", { prof: cprof, kinds: cpk, a0: AZ + PI / 2, a1: AZ + 1.5 * PI });
  revPiece(cx, "cono.izq", { prof: cprof, kinds: cpk, a0: AZ + NOTCH, a1: AZ + PI / 2, ends: ["face", "seam"] });
  revPiece(cx, "cono.der", { prof: cprof, kinds: cpk, a0: AZ - PI / 2, a1: AZ - NOTCH, ends: ["seam", "face"] });
  cx.disc("arandela", F0, HB.z1, HB.z1 + X_.washer.h, X_.washer.r, {}, { cls: "ib-hw", owner: "tuerca", rIn: SH.thread });
  const z0 = HB.z1 + X_.washer.h, nutR = X_.nut.af / Math.sqrt(3);
  cx.turned("rosca", F0, [[z0 + X_.nut.h, SH.thread], [SH.top - 2, SH.thread], [SH.top, SH.thread - 2]], {}, { cls: "ib-sh", owner: "eje" });
  cx.fp("tuerca", F0, HEX(nutR, AZ + 0.2), z0, z0 + X_.nut.h, {}, { cls: "ib-hw", owner: "tuerca", cut: [A.disc(F0, z0 - 1, z0 + X_.nut.h + 1, SH.thread)] });
  // los rótulos: la punta que más se ve (la del perfil) es la de más a la derecha en pantalla; la holgura, en la de más
  // a la izquierda, contra la cara del corte de la carcasa
  const sx = (a) => cx.pr(a.B.mid(1, 0))[0];
  const right = angs.slice().sort((a, b) => sx(b) - sx(a))[0], leftB = angs.slice().sort((a, b) => sx(a) - sx(b))[0];
  const left = angs.slice().sort((a, b) => Math.sin(b.phi - AZ) - Math.sin(a.phi - AZ))[0];
  Object.assign(cx.ANCLAS, {
    CONO: add3(mul3(er(AZ + NOTCH + 0.25), rh * 0.62), [0, 0, HB.z1 + CN.h * 0.72]),
    TUERCA: add3(mul3(er(AZ + 0.2 + PI / 6 - PI / 3), (X_.nut.af / 2) * 0.98), [0, 0, z0 + X_.nut.h * 0.5]),
    ALABE: left.B.top(0.55, 0.1),
    PUNTA: right.B.mid(1, 0.1),
    HOLGURA: (() => { const p = leftB.B.mid(1, 0.2); return add3(p, mul3(unit3([p[0], p[1], 0]), 0.3)); })(),
    CARCASA: add3(mul3(er(AZ + PI * 1.18), CS.rIn + 0.5), [0, 0, 40]),
    EJE: add3(mul3(er(AZ + 0.3), SH.r), [0, 0, SH.bottom + 30]),
  });
  { const pts = []; for (const z of [28, 12, -4, -20, -36]) for (let k = -10; k <= 10; k++) pts.push(add3(mul3(er(AZ + k * 0.12), rh + 0.3), [0, 0, z]));
    const goal = cx.pr(add3(mul3(er(AZ - 0.6), rh), [0, 0, 8])), dd = (p) => { const q = cx.pr(p); return Math.hypot(q[0] - goal[0], q[1] - goal[1]); };
    cx.CANDS.CUBO = { pts: pts.sort((a, b) => dd(a) - dd(b)), own: ["cubo.frente"] }; }
  const bA = bladeAngles(rh), bT = bladeAngles(R);
  console.log(`axial: cuerdas ${Li.toFixed(0)} y ${La.toFixed(0)} mm, ángulo ${(bA.theta / D2R).toFixed(1)}° en el cubo y ${(bT.theta / D2R).toFixed(1)}° en la punta, curvatura ${(bA.camber * 100).toFixed(1)} y ${(bT.camber * 100).toFixed(1)} % de la cuerda`);
}

/* ====================================================================
   el orden de pintura, el SVG, el audit
   ==================================================================== */
const CSS = `.ib-ss{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#c8cdd3;--anatomy-shade-1:#d3d8dc;--anatomy-shade-2:#dde1e4;--anatomy-shade-3:#e6e9eb}
.ib-sh{--anatomy-paper:#e2e6ea;--anatomy-face:#e2e6ea;--anatomy-top:#edf0f2;--anatomy-shade-0:#b9c1c8;--anatomy-shade-1:#c3cad0;--anatomy-shade-2:#ccd2d7;--anatomy-shade-3:#d5dadf}
.ib-hw{--anatomy-paper:#d9dde1;--anatomy-face:#d9dde1;--anatomy-top:#e6e9ec;--anatomy-shade-0:#aab2ba;--anatomy-shade-1:#b6bdc4;--anatomy-shade-2:#c1c7cd;--anatomy-shade-3:#ccd1d6}
.ib-ring{--anatomy-paper:#e6cdb4;--anatomy-face:#e6cdb4;--anatomy-top:#eedcca;--anatomy-shade-0:#c49e7c;--anatomy-shade-1:#ceac8d;--anatomy-shade-2:#d8ba9e;--anatomy-shade-3:#dfc4a9}
.ib-cast{--anatomy-paper:#dfe2e5;--anatomy-face:#dfe2e5;--anatomy-top:#e9ebed;--anatomy-shade-0:#c1c6cb;--anatomy-shade-1:#cacfd3;--anatomy-shade-2:#d3d7da;--anatomy-shade-3:#dadde0}
.ib-cut{--anatomy-paper:#c9ced3;--anatomy-face:#c9ced3;--anatomy-top:#c9ced3;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#c9ced3;--anatomy-shade-2:#c9ced3;--anatomy-shade-3:#c9ced3}
.ib-cut-c{--anatomy-paper:#c1c6cb;--anatomy-face:#c1c6cb;--anatomy-top:#c1c6cb;--anatomy-shade-0:#c1c6cb;--anatomy-shade-1:#c1c6cb;--anatomy-shade-2:#c1c6cb;--anatomy-shade-3:#c1c6cb}
.ib-bore{fill:#8f99a3;stroke:#6f7880;stroke-width:.4px}`;
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

const BUILD = { cerrado, semiabierto, abierto, axial };
const results = [];
for (const name of WHICH) {
  const t0 = Date.now();
  const ax = name === "axial";
  const P = ax ? camAx() : camRad();
  const cx = contexto(P, ax ? 0.2 : 0.4, name);
  BUILD[name](cx);
  const R_ = cx.R_, PA = cx.PA;
  if (process.env.IB_PIX) {
    const [px, py] = process.env.IB_PIX.split(",").map(Number), cam = A.cameraBasis(PA);
    const c = add3(mul3(cam.R, (px - cam.origin[0]) / cam.k), mul3(cam.D, (py - cam.origin[1]) / cam.k));
    for (const it of R_.items) for (const sh of it.shapes) {
      let hit = null;
      for (let t = 400; t > -400; t -= 0.05) { const q = add3(c, mul3(cam.V, t)); if (A.sdf(sh, q) < 0) { hit = { t, q: q.map((v) => +(v / cx.U).toFixed(0)) }; break; } }
      if (hit) console.log(it.name, sh.name, hit.t.toFixed(2), JSON.stringify(hit.q));
    }
    process.exit(0);
  }
  // las anclas con candidatos: la primera que se ve (o que solo tapa su propia pieza), en el orden de preferencia
  {
    const V = cx.V3;
    const firstHit = (p) => { const q0 = p.map((v) => v * cx.U); for (let t = 0.6; t < 400; t += 0.15) { const q = add3(q0, mul3(V, t)); for (const it of R_.items) if (it.shapes.some((sh) => A.sdf(sh, q) < -0.05)) return it.name; } return null; };
    for (const [nm, { pts, own, ownOf }] of Object.entries(cx.CANDS)) {
      const ok = pts.find((p, i) => { const h = firstHit(p); return !h || (ownOf ? ownOf[i] : own).some((o) => h.startsWith(o)); });
      if (!ok) console.warn(`¡Ojo! ninguna ancla de ${nm} se ve`);
      cx.ANCLAS[nm] = ok || pts[0];
    }
  }
  if (process.env.IB_ANCLAS) {
    // qué tapa cada ancla: el primer sólido que corta el rayo del ancla hacia el lector
    const V = cx.V3;
    for (const [nm, p] of Object.entries(cx.ANCLAS)) {
      const q0 = p.map((v) => v * cx.U); let hit = null;
      for (let t = 0.6; t < 400 && !hit; t += 0.15) { const q = add3(q0, mul3(V, t)); for (const it of R_.items) if (it.shapes.some((sh) => A.sdf(sh, q) < -0.05)) { hit = it.name; break; } }
      const sp = cx.pr(p);
      console.log(nm.padEnd(10), sp.map((v) => v.toFixed(0)).join(","), hit ? "tapada por " + hit : "a la vista");
    }
    process.exit(0);
  }
  if (process.env.IB_ITEM) {
    for (const nm of process.env.IB_ITEM.split(",")) {
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
  if (!FAST) {
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
      if (!process.env.IB_DROP) continue;
      const prev = new Map([[r.back, -1]]), queue = [r.back];
      while (queue.length) { const n = queue.shift(); if (n === r.front) break; for (const [m] of edges.get(n) || []) if (!prev.has(m)) { prev.set(m, n); queue.push(m); } }
      if (prev.has(r.front)) { const path = []; let n = r.front; while (n !== -1) { path.push(nm(n)); n = prev.get(n); } console.log("   lazo:", path.reverse().join(" > ")); }
    }
    for (const pair of overlaps.pairs) {
      const aF = pair.front[0].area >= overlaps.least, bF = pair.front[1].area >= overlaps.least;
      if (aF && bF) console.log("interlock:", nm(pair.a), "<>", nm(pair.b), pair.front[0].area.toFixed(1), pair.front[1].area.toFixed(1));
    }
  }
  R_.items.sort((a, b) => a.key - b.key);
  const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
  const svg = compact(k.figureSvg({ width: WD, height: HD, label: name, body: [`<style>${CSS}</style><defs>${cx.DEFS.join("")}</defs><g class="ib-items">${groups.join("")}</g>`] }));
  writeFileSync(join(OUT, `${name}.svg`), svg);
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify({ P, W: WD, H: HD, ANCLAS: cx.ANCLAS, axial: ax }));
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
  const body = IMPS.filter((n) => existsSync(join(OUT, `${n}.svg`))).map((n) => `<h2 style="font:600 14px system-ui;margin:24px 0 4px">${n}</h2><div class="iso-stage">${readFileSync(join(OUT, `${n}.svg`), "utf8")}</div>`).join("");
  writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Impulsores de bomba", theme: "light", width: 900, body, script: "" }));
}
if (AUDIT) {
  const bad = results.filter((r) => r.fails);
  console.log(bad.length ? `audit failed: ${bad.map((r) => r.name).join(", ")}` : `audit passed (${results.map((r) => r.name).join(", ")})`);
  if (bad.length) process.exitCode = 1;
}
