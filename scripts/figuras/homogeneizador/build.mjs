/* ====================================================================
   El homogeneizador de alta presión en isométrico (skill anatomy), para el capítulo 15 del libro de operaciones
   unitarias (Mezclado y escalado de tanques agitados, «El homogeneizador por dentro»): el cabezal de una máquina de
   leche de 10 000 L/h, en corte.
   Concepto: tres pistones desfasados 120° salen del cárter; el 1 va dentro de su cilindro, en el plano del corte, y
   empuja la leche: la válvula de succión, abajo, está cerrada y la de descarga, arriba, abierta. La leche sale del
   bloque al cabezal de homogeneización, sube por el asiento de la primera etapa, pasa por la rendija entre el asiento
   y el forzador, choca con el anillo de impacto y sigue a la segunda etapa, horizontal, igual pero a menos presión;
   de ahí sale hacia arriba. Cada forzador lo aprieta un émbolo hidráulico: la presión del aceite fija la fuerza.
   Corte: se quita la mitad que mira al lector (y > 0) del bloque, de su soporte, de los asientos, de los tapones, de
   los cartuchos de sellos, del cabezal, de los actuadores y de los tubos de entrada y de salida. Los pistones, las
   válvulas, los resortes, los forzadores, los émbolos, el cárter y la base van enteros.
   Lo que se ve por las bocas del corte (las paredes de los conductos) se dibuja donde un rayo hacia el lector sale
   por el plano del corte sin cruzar metal (`visible`), y la cara del corte es el bloque menos sus conductos, con el
   contorno sacado por cuadrados marchantes (`contours`).
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
// la rejilla del orden: 0,25 unidades de la vista entera; en el detalle, la misma medida en milímetros (3,2 veces más)
const STEP = Number(process.env.HM_STEP || (process.argv.includes("--detalle") ? 0.8 : 0.25));
const HM = GEO.HM;
const PI = Math.PI, TAU = 2 * Math.PI;
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const ANCH = {};                                     // los puntos a los que apuntan los rótulos del libro (libro.mjs)

/* --detalle: la primera etapa ampliada (la misma geometría con otra escala, en un círculo), para el recuadro del libro */
const DET = process.argv.includes("--detalle");
const W = DET ? 256 : 900, H = DET ? 256 : 640;
const B = HM.blk, HD = HM.head, AC = HM.act, OUT = HM.out, INL = HM.inl, CK = HM.crank;
const x1s = HM.x1s, z2 = HM.z2, S1 = HM.s1, S2 = HM.s2, RF = HM.rforcer;
// los actuadores: dónde empieza cada tramo a lo largo de su eje (desde la cara del cabezal)
const A1 = { s0: HD.z1, s1: HD.z1 + AC.base, s2: HD.z1 + AC.base + AC.wall, s3: HD.z1 + AC.base + AC.wall + AC.cap };
const A2 = { s0: HD.x1, s1: HD.x1 + AC.base, s2: HD.x1 + AC.base + AC.wall, s3: HD.x1 + AC.base + AC.wall + AC.cap };
const forcerTop1 = A1.s1 + 10, forcerTop2 = A2.s1 + 10;          // el forzador asoma 10 mm dentro del cilindro del aceite
const EXT = [[CK.x0, CK.y0, 0], [CK.x0, CK.y1, 0], [CK.x1, CK.y1, 0], [HM.ped.feet[1][1], 0, 0], [CK.x0, CK.y0, CK.z1], [CK.x0, CK.y1, CK.z1],
  [A2.s3 + 40, 0, z2 + 110], [A2.s3 + 40, -60, z2 - 60], [x1s, -60, A1.s3 + 70], [x1s - 120, 0, A1.s3 + 60], [HM.xo, -60, OUT.z1 + OUT.te], [INL.x1 + INL.te, 0, HM.zs - INL.rf]];
const PMAIN = k.fitProjection(EXT, 900, 640, { pad: 14, azimuth: HM.AZ, elevation: HM.EL });
// el centro del detalle y su aumento: el círculo de radio RDET px del detalle es el de RDET/MDET px de la vista entera
const CDET = [x1s + 6, 0, 352], MDET = 3.2, RDET = 120;
const P = DET ? (() => { const Q = { origin: [0, 0], scale: PMAIN.scale * MDET, azimuth: HM.AZ, elevation: HM.EL }; const c = k.iso(CDET, Q); Q.origin = [W / 2 - c[0], H / 2 - c[1]]; return Q; })() : PMAIN;
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const Ln = (d, style) => k.lineSvg(d, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const V3 = G.viewOf(P), L3 = G.lightOf(P);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = (sh) => { R_.solid(sh); return sh; };
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null, cover = null } = {}) {
  const covers = cover ? [cover].flat() : [];
  const cuts = [...(cut ? [cut].flat() : []), ...covers.flatMap((c) => c.shapes)];
  const shape = record(A.prism(F, poly, s0, s1, { name, owner, ...(cuts.length ? { cut: cuts } : {}), ...(ground ? { ground } : {}) }));
  // la pieza entera, sin dibujar, para los apoyos (lo que el corte del contenedor le quita es solo lo que no se ve)
  if (covers.length) record(A.prism(F, poly, s0, s1, { name: `${name}.entero`, owner, ...(cut ? { cut } : {}) }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  const svg = X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra;
  put(name, centre, covers.reduce((acc, c) => `<g clip-path="url(#${c.id})">${acc}</g>`, svg), shapes || [shape]);
  return shape;
}
// un cilindro (pistón, perno, tapón): prisma de sección circular; se registra el cilindro verdadero
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", n = 0, cut = null, cap = "auto", ground } = {}) {
  const m = n || Math.max(16, Math.min(72, Math.round((r * G.scaleOf(P)) / 1.1)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", cap, ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 14, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, limp = false, spacing = null, extraLast = "" } = {}) {
  R_.route(name, route, r, { owner: name, gaps, ends, touch, limp, piece: "frame", move: [0, 0, 0], ride: "frame" });
  const parts = tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(0.6, Math.min(4, r * 0.5)), gaps, caps, breaks });
  parts.forEach((part, index) => {
    const svg = tubeSvg(part, { tone }) + (index === parts.length - 1 ? extraLast : "");
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] });
  });
}
const HEX = (rr, rot = Math.PI / 6) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + rot; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const hexR = (af) => af / Math.sqrt(3);

/* ---------- superficies con tonos suaves (de la válvula de control y del mezclador) ---------- */
const BAND = (s) => { const Bd = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < Bd.length && s >= Bd[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
function surface(P3, N3, f0, f1, nf, nu, out, keep = null) {
  const cls = (f, u) => { const n = N3(f, u); return G.dot3(n, V3) <= 1e-4 || (keep && !keep(P3(f, u))) ? -1 : BAND(G.dot3(n, L3)); };
  const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
  for (let i = 0; i < nf; i++) {
    const fa = fOf(i), fb = fOf(i + 1), fm = (fa + fb) / 2;
    const runs = [];
    for (let j = 0; j < nu; j++) { const band = cls(fm, (j + 0.5) / nu); if (!runs.length || runs[runs.length - 1].band !== band) runs.push({ band, j0: j }); }
    if (runs.length === 1 && runs[0].band < 0) continue;
    const edge = (f) => {
      const M = nu * 4, smp = []; for (let q = 0; q < M; q++) smp.push(cls(f, (q + 0.5) / M));
      const tr = []; for (let q = 1; q < M; q++) if (smp[q] !== smp[q - 1]) tr.push({ a: smp[q - 1], b: smp[q], q });
      const cuts = [0];
      for (let r = 1; r < runs.length; r++) {
        const j = runs[r].j0, a = runs[r - 1].band; let best = null;
        for (const t of tr) if (t.a === a && t.b === runs[r].band && (!best || Math.abs(t.q / M - j / nu) < Math.abs(best.q / M - j / nu))) best = t;
        let c = j / nu;
        if (best && Math.abs(best.q / M - j / nu) < 3 / nu) { let lo = (best.q - 0.5) / M, hi = (best.q + 0.5) / M; for (let it = 0; it < 18; it++) { const m = (lo + hi) / 2; if (cls(f, m) === a) lo = m; else hi = m; } c = (lo + hi) / 2; }
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
// una cara plana: polígono 3D con su normal; tono por la luz
function flatFace(pts, n, cls = "", edges = true) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return `<g class="iso-solid${cls ? " " + cls : ""}"><path class="iso-fill" d="${d}"/>` + (b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>`) + (edges ? `<path class="iso-line iso-edge" data-tone="mid" d="${d}"/>` : "") + "</g>";
}
const circle3 = (c, a, r, n = 32) => { const F = G.frameAlong(c, a); return Array.from({ length: n }, (_, i) => G.pointOf(F, 0, r, (i / n) * TAU)); };

/* ====================================================================
   1 · marcos, el corte, los huecos y su visibilidad
   ==================================================================== */
const FXo = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: XD, u: ZD, v: YD });   // a lo largo de x; sección (z, y), mitad y ≤ 0
const FZo = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });   // a lo largo de z; sección (x, y), mitad y ≤ 0
const FYo = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: YD, u: XD, v: ZD });   // a lo largo de y; sección (x, z)
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD };                              // el plano del corte: sección (x, z)
const half = (r0, r1, n = 40) => GEO.halfRing(r0, r1, n);
const halfSkip = (r0, n = 40) => new Set(r0 > 1e-6 ? [n, 2 * n + 1] : [n, n + 1]);   // las caras del medio anillo en y = 0
const FRONT = A.box([-4000, 0, -4000], [4000, 4000, 4000]);                    // lo que se quita: la mitad del lector
const frameOfVoid = (v) => (v.ax === "x" ? FXo(0, v.c[1], v.c[2]) : v.ax === "z" ? FZo(v.c[0], v.c[1], 0) : FYo(v.c[0], 0, v.c[2]));
const voidShape = (v) => A.disc(frameOfVoid(v), v.s0, v.s1, v.r, { name: v.name });
// la distancia con signo a un hueco (negativa adentro)
function voidSdf(v, p) {
  let s, rad;
  if (v.ax === "x") { s = p[0]; rad = Math.hypot(p[1] - v.c[1], p[2] - v.c[2]); }
  else if (v.ax === "y") { s = p[1]; rad = Math.hypot(p[0] - v.c[0], p[2] - v.c[2]); }
  else { s = p[2]; rad = Math.hypot(p[0] - v.c[0], p[1] - v.c[1]); }
  const dr = rad - v.r, ds = Math.max(v.s0 - s, s - v.s1);
  return Math.hypot(Math.max(dr, 0), Math.max(ds, 0)) + Math.min(Math.max(dr, ds), 0);
}
// una carcasa: una caja (x0..x1, y0..0, z0..z1) menos sus huecos
function housingOf(box, voids) {
  const near = voids.filter((v) => (v.ax === "y" ? true : Math.abs(v.c[1]) < v.r + 90));    // los que se pueden ver
  const inBox = (p) => p[0] > box.x0 + 1e-6 && p[0] < box.x1 - 1e-6 && p[2] > box.z0 + 1e-6 && p[2] < box.z1 - 1e-6 && p[1] > box.y0 + 1e-6;
  const metal = (p) => inBox(p) && !near.some((v) => voidSdf(v, p) < 0);
  // un punto de la pared de un hueco se ve si el rayo hacia el lector llega al plano del corte sin cruzar metal
  const visible = (q, self) => {
    for (const v of near) if (v !== self && voidSdf(v, q) < -0.05) return false;   // no es pared: es otro hueco
    const t1 = -q[1] / V3[1];
    for (let t = 0.5; t < t1; t += 0.6) { const p = [q[0] + V3[0] * t, q[1] + V3[1] * t, q[2] + V3[2] * t]; if (metal(p)) return false; }
    return true;
  };
  return { box, voids, near, metal, visible };
}

/* Las paredes de los huecos que se ven por el corte: la mitad de atrás de los que tienen el eje en el plano y lo que se
   alcanza a ver de los que lo cruzan (los colectores), más las tapas de los extremos que miran al lector. */
function voidWalls(H_, cls) {
  const out = { by: [[], [], [], [], []] };
  for (const v of H_.near) {
    if (v.filled) continue;
    const F = frameOfVoid(v);
    const keep = (p) => H_.visible(p, v);
    let f0 = PI, f1 = TAU, s0 = v.s0, s1 = v.s1;
    if (v.ax === "y") { f0 = 0; f1 = TAU; s0 = Math.max(v.s0, -90); s1 = Math.min(v.s1, 0); }
    else if (Math.abs(v.c[1]) > 1e-6) continue;
    const L = s1 - s0, nf = Math.max(24, Math.round(((f1 - f0) * v.r) / 2.2)), nu = Math.max(8, Math.round(L / 6));
    surface((f, u) => G.pointOf(F, s0 + L * u, v.r, f), (f) => G.mul3(G.radialOf(F, f), -1), f0, f1, nf, nu, out, keep);
    // las tapas: discos en s0 (normal +a) y en s1 (normal −a)
    for (const [s, sg] of [[s0, 1], [s1, -1]]) {
      if (v.ax === "y" && s === s1) continue;
      const n = G.mul3(F.a, sg);
      if (G.dot3(n, V3) <= 1e-4) continue;
      surface((f, u) => G.pointOf(F, s, v.r * Math.max(0.0001, u), f), () => n, f0, f1, nf, 12, out, keep);
    }
  }
  return toned((o) => { o.by = out.by; }, cls);
}

/* Los cuadrados marchantes: el contorno de la región donde f(x, z) < 0, en lazos cerrados y simplificados */
function contours(f, x0, x1, z0, z1, h = 0.25, tol = 0.02) {
  const nx = Math.ceil((x1 - x0) / h) + 3, nz = Math.ceil((z1 - z0) / h) + 3;
  const Xg = (i) => x0 - h + i * h, Zg = (j) => z0 - h + j * h;
  const val = new Float64Array(nx * nz);
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) val[j * nx + i] = f(Xg(i), Zg(j));
  const V = (i, j) => val[j * nx + i];
  const pt = new Map();
  const edgePt = (key, ia, ja, ib, jb) => {
    if (!pt.has(key)) { const va = V(ia, ja), vb = V(ib, jb), t = va / (va - vb); pt.set(key, [Xg(ia) + (Xg(ib) - Xg(ia)) * t, Zg(ja) + (Zg(jb) - Zg(ja)) * t]); }
    return key;
  };
  const segs = [];
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const c = (V(i, j) < 0 ? 1 : 0) | (V(i + 1, j) < 0 ? 2 : 0) | (V(i + 1, j + 1) < 0 ? 4 : 0) | (V(i, j + 1) < 0 ? 8 : 0);
    if (c === 0 || c === 15) continue;
    const e = [() => edgePt(`h${i}_${j}`, i, j, i + 1, j), () => edgePt(`v${i + 1}_${j}`, i + 1, j, i + 1, j + 1), () => edgePt(`h${i}_${j + 1}`, i, j + 1, i + 1, j + 1), () => edgePt(`v${i}_${j}`, i, j, i, j + 1)];
    const centre = (V(i, j) + V(i + 1, j) + V(i + 1, j + 1) + V(i, j + 1)) / 4 < 0;
    const T = { 1: [[3, 0]], 2: [[0, 1]], 3: [[3, 1]], 4: [[1, 2]], 5: centre ? [[0, 1], [2, 3]] : [[3, 0], [1, 2]], 6: [[0, 2]], 7: [[3, 2]], 8: [[2, 3]], 9: [[0, 2]], 10: centre ? [[3, 0], [1, 2]] : [[0, 1], [2, 3]], 11: [[1, 2]], 12: [[1, 3]], 13: [[0, 1]], 14: [[3, 0]] }[c];
    for (const [a, b] of T) segs.push([e[a](), e[b]()]);
  }
  const by = new Map();
  segs.forEach((s, idx) => { for (const key of s) { if (!by.has(key)) by.set(key, []); by.get(key).push(idx); } });
  const used = new Uint8Array(segs.length), loops = [];
  for (let s0 = 0; s0 < segs.length; s0++) {
    if (used[s0]) continue;
    const loop = [segs[s0][0]]; let cur = segs[s0][1]; used[s0] = 1;
    for (let guard = 0; guard < segs.length && cur !== loop[0]; guard++) {
      loop.push(cur);
      const nxt = by.get(cur).find((q) => !used[q]);
      if (nxt === undefined) break;
      used[nxt] = 1; cur = segs[nxt][0] === cur ? segs[nxt][1] : segs[nxt][0];
    }
    if (loop.length > 3) loops.push(simplify(loop.map((key) => pt.get(key)), tol));
  }
  return loops;
}
function simplify(pts, tol) {   // Douglas–Peucker en un lazo cerrado
  const n = pts.length;
  let a = 0, b = 0, best = -1;
  for (let i = 0; i < n; i++) { const d = Math.hypot(pts[i][0] - pts[0][0], pts[i][1] - pts[0][1]); if (d > best) { best = d; b = i; } }
  const dp = (lst) => {
    if (lst.length < 3) return lst;
    const [p, q] = [lst[0], lst[lst.length - 1]], L = Math.hypot(q[0] - p[0], q[1] - p[1]) || 1e-9;
    let im = -1, dm = 0;
    for (let i = 1; i < lst.length - 1; i++) { const d = Math.abs((q[0] - p[0]) * (p[1] - lst[i][1]) - (p[0] - lst[i][0]) * (q[1] - p[1])) / L; if (d > dm) { dm = d; im = i; } }
    if (dm <= tol) return [p, q];
    const l = dp(lst.slice(0, im + 1)), r = dp(lst.slice(im));
    return [...l.slice(0, -1), ...r];
  };
  const one = dp(pts.slice(a, b + 1)), two = dp([...pts.slice(b), pts[0]]);
  return [...one.slice(0, -1), ...two.slice(0, -1)];
}
const sdRect = (x, z, ax0, ax1, az0, az1) => { const dx = Math.max(ax0 - x, x - ax1), dz = Math.max(az0 - z, z - az1); return Math.hypot(Math.max(dx, 0), Math.max(dz, 0)) + Math.min(Math.max(dx, dz), 0); };
// la sección de un hueco en el plano y = 0 (distancia con signo en x, z), o null si no lo cruza
function voidSection(v) {
  if (v.ax === "y") return v.s0 <= 0 && v.s1 >= 0 ? (x, z) => Math.hypot(x - v.c[0], z - v.c[2]) - v.r : null;
  const dy = Math.abs(v.c[1]); if (dy >= v.r) return null;
  const hr = Math.sqrt(v.r * v.r - dy * dy);
  return v.ax === "x" ? (x, z) => sdRect(x, z, v.s0, v.s1, v.c[2] - hr, v.c[2] + hr) : (x, z) => sdRect(x, z, v.c[0] - hr, v.c[0] + hr, v.s0, v.s1);
}
// la cara del corte de una carcasa: la caja menos sus huecos, en lazos (x, z)
function cutLoops(box, voids) {
  const secs = voids.map(voidSection).filter(Boolean);
  const f = (x, z) => { let m = Infinity; for (const s of secs) m = Math.min(m, s(x, z)); return Math.max(sdRect(x, z, box.x0, box.x1, box.z0, box.z1), -m); };
  return contours(f, box.x0, box.x1, box.z0, box.z1);
}
const loopsPath = (loops) => loops.map((l) => pth1(l.map(([x, z]) => pr([x, 0, z])))).join("");
function cutFaceSvg(loops, cls) {
  const d = loopsPath(loops);
  return `<g class="iso-solid ${cls}"><path class="iso-fill" fill-rule="evenodd" d="${d}"/><path class="iso-shade" data-shade="3" fill-rule="evenodd" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
}

/* Lo que tapan las caras del corte. Una pieza que va dentro de otra (el pistón en su cartucho, el forzador en su guía,
   la aleta de una válvula en su asiento) tiene partes de su mitad de atrás que el rayo hacia el lector encuentra detrás
   del metal cortado del contenedor. Esas partes no se dibujan (el dibujo se recorta a lo que no tapan las caras del
   corte de sus contenedores) ni se registran (la forma se corta con los prismas que esas caras proyectan a lo largo de
   la mirada, del plano hacia atrás); así el orden de pintura no ve la pieza delante y detrás del contenedor a la vez. */
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const toV = (loop) => loop.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]);
const area2 = (l) => { let a = 0; for (let i = 0; i < l.length; i++) { const p = l[i], q = l[(i + 1) % l.length]; a += p[0] * q[1] - q[0] * p[1]; } return a / 2; };
// las regiones de un conjunto de lazos disjuntos: cada lazo de profundidad par es un exterior y los de profundidad impar
// son huecos del exterior que los contiene
const insideLoop = ([x, z], l) => { let c = false; for (let i = 0, j = l.length - 1; i < l.length; j = i++) { const [xi, zi] = l[i], [xj, zj] = l[j]; if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c; } return c; };
function regionsOf(loops) {
  const depth = loops.map((l, i) => loops.filter((m, j) => j !== i && insideLoop(l[0], m)).length);
  const regions = loops.map((l, i) => (depth[i] % 2 === 0 ? { outer: l, holes: [] } : null));
  loops.forEach((l, i) => {
    if (!(depth[i] % 2)) return;
    const j = loops.findIndex((m, jj) => jj !== i && depth[jj] === depth[i] - 1 && insideLoop(l[0], m));
    regions[j].holes.push(l);
  });
  return regions.filter(Boolean);
}
const materialPrisms = (regions) => regions.map((r) => A.prism(FV, toV(r.outer), -4000, 4000, { cut: r.holes.map((h) => A.prism(FV, toV(h), -4000, 4000)) }));
const DEFS = []; let nClip = 0;
const PFX = DET ? "hd" : "hm";
const BACK = A.box([-4000, -4000, -4000], [4000, 0, 4000]);
function coverOf(regions) {
  const id = `${PFX}c${nClip++}`;
  const d = regions.flatMap((r) => [r.outer, ...r.holes]).map((l) => pth1(l.map(([x, z]) => pr([x, 0, z])))).join("");
  DEFS.push(`<clipPath id="${id}"><path clip-rule="evenodd" d="M-5000 -5000L5000 -5000L5000 5000L-5000 5000Z${d}"/></clipPath>`);
  const shapes = regions.map((r) => A.prism(FV, toV(r.outer), -4000, 4000, { cut: [FRONT, ...r.holes.map((h) => A.prism(FV, toV(h), -4000, 4000))] }));
  return { id, shapes };
}
/* Lo que tapa el escalón de un hueco: un anillo plano (de r0 a r1, en s a lo largo del eje del marco F) con metal del
   lado de las s mayores. Una pieza que asoma por debajo del escalón (el anillo de impacto bajo el piso de la cámara, el
   forzador bajo el escalón del cilindro del actuador, la camisa del cartucho contra el escalón del cilindro) tiene
   partes que el rayo hacia el lector encuentra detrás de ese metal: no se dibujan ni se registran. */
function annulusCover(F, s, r0, r1) {
  const ring = (r) => Array.from({ length: 72 }, (_, i) => { const p = G.pointOf(F, s, r, (TAU * i) / 72); return [G.dot3(p, CAM.R), G.dot3(p, CAM.D)]; });
  const id = `${PFX}c${nClip++}`;
  const path = (r) => pth1(Array.from({ length: 72 }, (_, i) => pr(G.pointOf(F, s, r, (TAU * i) / 72))));
  DEFS.push(`<clipPath id="${id}"><path clip-rule="evenodd" d="M-5000 -5000L5000 -5000L5000 5000L-5000 5000Z${path(r1)}${path(r0)}"/></clipPath>`);
  // del lado del metal, desde medio milímetro más allá del escalón: la cara que se apoya en él también se quita
  const lo = [-4000, -4000, -4000], hi = [4000, 4000, 4000], ax = G.dot3(F.a, XD) > 0.5 ? 0 : 2, so = s + F.o[ax] + 0.5;
  const beyond = A.box(ax === 0 ? [so, lo[1], lo[2]] : [lo[0], lo[1], so], hi);
  return { id, shapes: [A.prism(FV, ring(r1), -4000, 4000, { cut: [A.prism(FV, ring(r0), -4000, 4000), beyond, FRONT] })] };
}
// una pieza de revolución entera que cruza el plano del corte (el pistón 1): va en dos elementos, la mitad de atrás
// (recortada a lo que no tapan sus contenedores) y la de adelante, cada una recortada a la proyección de su mitad
function splitDisc(name, F, s0, s1, r, cover, { owner, cls = "", extra = "" } = {}) {
  const m = Math.max(16, Math.min(72, Math.round((r * G.scaleOf(P)) / 1.1)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (TAU * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const svg = wrap(X.prismSvg(C, poly, s0, s1, { F, tone: "mid" }), cls) + extra;
  const hull = (sg) => {
    const pts = []; for (const s of [s0, s1]) for (let i = 0; i <= 48; i++) pts.push(at(G.pointOf(F, s, r, (sg > 0 ? 0 : PI) + (PI * i) / 48)));
    const h = G.hullOf(pts), cx = h.reduce((q, p) => q + p[0], 0) / h.length, cy = h.reduce((q, p) => q + p[1], 0) / h.length;
    const id = `${PFX}c${nClip++}`;
    DEFS.push(`<clipPath id="${id}"><path d="${pth1(h.map(([x, y]) => { const d = Math.hypot(x - cx, y - cy) || 1; return [x + ((x - cx) / d) * 0.5, y + ((y - cy) / d) * 0.5]; }))}"/></clipPath>`);
    return id;
  };
  const hb = hull(-1), hf = hull(1), mid = G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2));
  const covers = [cover].flat();
  put(`${name}.atras`, G.add3(mid, [0, -r / 2, 0]), `<g clip-path="url(#${hb})">${covers.reduce((acc, c) => `<g clip-path="url(#${c.id})">${acc}</g>`, svg)}</g>`,
    [record(A.disc(F, s0, s1, r, { name: `${name}.atras`, owner, cut: [FRONT, ...covers.flatMap((c) => c.shapes)] }))]);
  put(`${name}.frente`, G.add3(mid, [0, r / 2, 0]), `<g clip-path="url(#${hf})">${svg}</g>`, [record(A.disc(F, s0, s1, r, { name: `${name}.frente`, owner, cut: [BACK] }))]);
  record(A.disc(F, s0, s1, r, { name: `${name}.entero`, owner }));
}

/* Una carcasa cortada, en dos elementos: las paredes de los huecos que se ven por el corte (registradas recortadas a
   la ventana que la boca del corte proyecta a lo largo de la mirada) y la cara del corte con las caras de afuera que se
   ven (arriba y la derecha), registradas como láminas. La carcasa entera se registra aparte, sin dibujar, para los
   apoyos y las holguras. */
function housing(name, box, voids, { cls = "hm-ss", cutCls = "hm-cut", subCls = "hm-sub", owner = name, ground = false, faces = ["top", "right"] } = {}) {
  const H_ = housingOf(box, voids);
  const walls = voidWalls(H_, subCls);
  const loops = cutLoops(box, voids);
  const regions = regionsOf(loops);
  const VS = voids.map(voidShape);
  // las láminas y las paredes solo ven los huecos cercanos al plano del corte (los de los cilindros 2 y 3 quedan atrás)
  const YD0 = Math.max(box.y0, -100);   // las paredes no se ven más allá de 90 mm detrás del corte
  const VN = voids.filter((v) => v.ax === "y" || Math.abs(v.c[1]) - v.r < -YD0).map(voidShape);
  // lo que no es ventana: afuera de la caja y detrás del metal cortado
  const OUTBOX = A.box([-4000, -4000, -4000], [4000, 4000, 4000], { cut: [A.prism(FV, toV([[box.x0, box.z0], [box.x1, box.z0], [box.x1, box.z1], [box.x0, box.z1]]), -4000, 4000)] });
  const solid = (nm, lo, hi, extra = []) => A.box(lo, hi, { name: nm, owner, cut: [FRONT, ...VN, ...extra] });
  put(`${name}.paredes`, [(box.x0 + box.x1) / 2, box.y0 / 2, (box.z0 + box.z1) / 2], walls,
    [record(solid(`${name}.paredes`, [box.x0, YD0, box.z0], [box.x1, 60, box.z1], [OUTBOX, ...materialPrisms(regions)]))]);
  let outer = "";
  const shapes = [record(solid(`${name}.corte`, [box.x0, -0.3, box.z0], [box.x1, 60, box.z1]))];
  if (faces.includes("top")) {
    outer += flatFace([[box.x0, box.y0, box.z1], [box.x1, box.y0, box.z1], [box.x1, 0, box.z1], [box.x0, 0, box.z1]], ZD, cls);
    shapes.push(record(A.box([box.x0, box.y0, box.z1 - 0.3], [box.x1, 60, box.z1], { name: `${name}.arriba`, owner, cut: [FRONT, ...VS] })));
  }
  if (faces.includes("right")) {
    outer += flatFace([[box.x1, box.y0, box.z0], [box.x1, 0, box.z0], [box.x1, 0, box.z1], [box.x1, box.y0, box.z1]], XD, cls);
    shapes.push(record(A.box([box.x1 - 0.3, box.y0, box.z0], [box.x1, 60, box.z1], { name: `${name}.derecha`, owner, cut: [FRONT, ...VS] })));
  }
  put(name, [(box.x0 + box.x1) / 2, box.y0 / 2, (box.z0 + box.z1) / 2], outer + cutFaceSvg(loops, cutCls), shapes);
  record(A.box([box.x0, box.y0, box.z0], [box.x1, 60, box.z1], { name: `${name}.macizo`, owner, ground, cut: [FRONT, ...VS] }));
  if (process.env.HM_LAZOS) console.log(name, "lazos", loops.map((l) => l.length).join(" "));
  return { H_, loops, regions };
}

/* Las piezas de revolución cortadas (asientos, anillos, tapones, cartuchos, actuadores): cada tramo [s0, s1, r0, r1]
   es un medio anillo (la mitad de atrás), y la cara del corte es la unión de los tramos, a los dos lados del eje. */
const cutStore = [];      // [{ owner, loops (x, z), cls }]
function turnedCut(name, F, rects, { cls = "hm-ss", cutCls = "hm-cut1", owner = name, style = {}, n = 40, caps = null, extras = {}, cover = null, covers = {}, whole = false } = {}) {
  // entera, sin dibujar, para los apoyos de lo que la toca adelante del corte (los resortes)
  if (whole) rects.forEach(([s0, s1, r0, r1], q) => record(r0 > 1e-6 ? A.ring(F, Math.min(s0, s1), Math.max(s0, s1), r0, r1, { name: `${name}.entero${q}`, owner }) : A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r1, { name: `${name}.entero${q}`, owner })));
  rects.forEach(([s0, s1, r0, r1], q) => {
    const cap = caps ? caps[q] : "auto";
    fp(`${name}.${q}`, F, half(r0, r1, n), Math.min(s0, s1), Math.max(s0, s1), { tone: "mid", ...style }, { owner, cls, skip: halfSkip(r0, n), cap, extra: extras[q] || "", cover: [cover, covers[q]].filter(Boolean).flat() });
  });
  // la cara del corte: la unión de los rectángulos en (s, r), con su espejo
  const f = (s, r) => { let m = Infinity; for (const [s0, s1, r0, r1] of rects) m = Math.min(m, r0 > 1e-6 ? sdRect(s, Math.abs(r), Math.min(s0, s1), Math.max(s0, s1), r0, r1) : sdRect(s, r, Math.min(s0, s1), Math.max(s0, s1), -r1, r1)); return m; };
  const sMin = Math.min(...rects.map((q) => Math.min(q[0], q[1]))), sMax = Math.max(...rects.map((q) => Math.max(q[0], q[1]))), rMax = Math.max(...rects.map((q) => q[3]));
  const loops = contours(f, sMin, sMax, -rMax, rMax, 0.2, 0.02);
  const toXZ = (s, r) => (G.dot3(F.a, XD) > 0.5 ? [s, F.o[2] + r] : [F.o[0] + r, s]);
  const xz = loops.map((l) => l.map(([s, r]) => toXZ(s, r)));
  cutStore.push({ owner, loops: xz, cls: cutCls });
  return xz;
}

/* ====================================================================
   2 · la base, el cárter y el soporte del bloque
   ==================================================================== */
function slab(name, [x0, y0, z0], [x1, y1, z1], { cls = "hm-paint", owner = name, ground = false, steps = 2, r = 1.5, extra = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, owner, ground }, steps));
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(k.solidSvg(k.slabOf(plan, z0, z1 - z0, P, steps, 0.6), { tone: "mid" }) + extra, cls), [shape]);
  return shape;
}
{
  // el cárter: una caja pintada con la tapa de inspección atornillada al frente; de su cara derecha salen los vástagos
  const seam = k.sideSeam({ x: CK.x0, y: CK.y0, w: CK.x1 - CK.x0, d: CK.y1 - CK.y0, r: 4 }, CK.z1 - 30, P, 3);
  slab("carter", [CK.x0, CK.y0, CK.z0], [CK.x1, CK.y1, CK.z1], { r: 4, steps: 3, ground: true, extra: Ln(seam, { tone: "lo" }) });
  ANCH.CARTER = [CK.x1 - 30, CK.y1, CK.z1 - 90];
}
{
  // el soporte del bloque, cortado
  const PD = HM.ped;
  PD.feet.forEach(([xa, xb], q) => {
    const box = { x0: xa, x1: xb, y0: PD.y0, z0: 0, z1: PD.z1 };
    const loops = contours((x, z) => sdRect(x, z, box.x0, box.x1, box.z0, box.z1), box.x0, box.x1, box.z0, box.z1, 0.5);
    const outer = flatFace([[box.x1, box.y0, 0], [box.x1, 0, 0], [box.x1, 0, box.z1], [box.x1, box.y0, box.z1]], XD, "hm-paint");
    put(`soporte${q}`, [(box.x0 + box.x1) / 2, box.y0 / 2, box.z1 / 2], outer + cutFaceSvg(loops, "hm-cut-p"),
      [record(A.box([box.x0, box.y0, 0], [box.x1, 60, box.z1], { name: `soporte${q}`, owner: "soporte", ground: true, cut: [FRONT] }))]);
  });
  ANCH.SOPORTE = [(PD.feet[0][0] + PD.feet[0][1]) / 2, 0, PD.z1 / 2];
}

/* ====================================================================
   3 · el bloque de la bomba y el cabezal de homogeneización
   ==================================================================== */
const BLOCK = housing("bloque", B, GEO.blockVoids());
const HEAD = housing("cabezal", { x0: HD.x0, x1: HD.x1, y0: -HD.yh, z0: HD.z0, z1: HD.z1 }, GEO.headVoids());
ANCH.BLOQUE = [150, 0, 100];
ANCH.CABEZAL = [575, 0, 285];
ANCH.CSUC = [HM.xv - HM.rsm * 0.7, -6, HM.zs - HM.rsm * 0.7];
ANCH.CDES = [HM.xv + HM.rdm * 0.75, -6, HM.zdm + HM.rdm * 0.65];

/* ====================================================================
   4 · los pistones, los acoples, los vástagos y los cartuchos de sellos
   ==================================================================== */
// el cartucho de sellos del cilindro 1, cortado: brida afuera, camisa adentro y los dos sellos con su espacio entre ellos
const CART = (() => {
  const C0 = HM.cart, F = FXo(0, 0, HM.zc), [sa, sb] = C0.seals;
  const loops = turnedCut("cartucho", F, [[C0.xf, 0, C0.rin, C0.ro], [0, sa[0], C0.rin, C0.rcb], [sa[0], sa[1], C0.rs, C0.rcb], [sa[1], sb[0], C0.rin, C0.rcb], [sb[0], sb[1], C0.rs, C0.rcb], [sb[1], C0.x1, C0.rin, C0.rcb]],
    { owner: "cart0", covers: { 5: annulusCover(F, C0.x1, HM.rb, C0.rcb) } });
  const seals = [];
  for (const [q, [a, b]] of C0.seals.entries()) seals.push(...turnedCut(`sello${q}`, F, [[a, b, HM.rp, C0.rs]], { cls: "hm-rubber", cutCls: "hm-cut-gk", owner: "cart0", cover: coverOf(regionsOf(loops)) }));
  ANCH.SELLOS = [(sa[0] + sa[1]) / 2, 0, HM.zc + (HM.rp + C0.rs) / 2];
  ANCH.CARTUCHO = [C0.xf / 2, 0, HM.zc + C0.ro - 6];
  return { loops, seals };
})();
for (let i = 0; i < 3; i++) {
  const y = GEO.yCyl(i), xc = GEO.xCoup(i), xt = GEO.xTip(i), F = FXo(0, y, HM.zc), own = `piston${i}`;
  const xw = CK.x1 + CK.boss + CK.wiper;
  // la caja del vástago en el cárter y su limpiador de caucho
  disc(`boss${i}`, F, CK.x1, CK.x1 + CK.boss, CK.rboss, { tone: "mid" }, { owner: "carter", cls: "hm-cast" });
  fp(`wiper${i}`, F, (() => { const n = 40, o = []; for (let q = 0; q < n; q++) { const t = (TAU * q) / n; o.push([CK.rw * Math.cos(t), CK.rw * Math.sin(t)]); } return o; })(), CK.x1 + CK.boss, xw, { tone: "mid" }, { owner: "carter", cls: "hm-rubber" });
  disc(`vastago${i}`, F, xw, xc, HM.rrod, { tone: "mid" }, { owner: own, cls: "hm-rod" });
  // el acople partido: dos mitades con la junta en medio
  const xm = xc + HM.coupL / 2;
  const seam = Ln(G.arcOf(F, xm, HM.rcoup, P, { least: 0.02 }), { tone: "mid" });
  disc(`acople${i}`, F, xc, xc + HM.coupL, HM.rcoup, { tone: "mid" }, { owner: own, cls: "hm-trim", extra: seam });
  // la mitad de atrás del pistón 1: la tapan las caras del corte del cartucho, de los sellos y del bloque, y el borde
  // del final de la camisa (el rayo que sale del pistón cerca de ese borde cruza la camisa antes de llegar al corte)
  if (i === 0) splitDisc("piston0", F, xc + HM.coupL, xt, HM.rp, [coverOf([...regionsOf(CART.loops), ...regionsOf(CART.seals), ...BLOCK.regions]), annulusCover(F, HM.cart.x1, HM.cart.rin, HM.cart.rcb)], { owner: own, cls: "hm-plunger" });
  else disc(`piston${i}`, F, xc + HM.coupL, xt, HM.rp, { tone: "mid" }, { owner: own, cls: "hm-plunger" });
  if (i === 0) { ANCH.PISTON = [xc + HM.coupL + 60, 0, HM.zc + HM.rp]; ANCH.ACOPLE = [xc + 20, HM.rcoup * 0.5, HM.zc + HM.rcoup * 0.8]; ANCH.PUNTA = [xt - 18, 0, HM.zc - HM.rp]; }
  if (i > 0) {
    // los cartuchos de los cilindros 2 y 3 no se ven (los tapa el bloque): solo se registran
    const C0 = HM.cart;
    record(A.ring(F, C0.xf, C0.x1, C0.rin, C0.rcb, { name: `cart${i}.oculto`, owner: `cart${i}` }));
    record(A.ring(F, C0.xf, 0, C0.rcb, C0.ro, { name: `cart${i}.brida`, owner: `cart${i}` }));
    record(A.ring(F, 12, 26, HM.rp, C0.rs, { name: `cart${i}.sello`, owner: `cart${i}` }));
  }
}

/* ====================================================================
   5 · las válvulas del cilindro 1: asientos cortados, válvulas de disco enteras con sus aletas, resortes y el tapón
   ==================================================================== */
const SS = HM.sseat, DS = HM.dseat, PO = HM.pop, SP = HM.spring, PL = HM.plug, xv = HM.xv;
const SEAT = { "valv.s": turnedCut("asiento.s", FZo(xv, 0), [[SS.z0, SS.z1, SS.ri, SS.ro]], { owner: "asiento.s", whole: true }),
  "valv.d": turnedCut("asiento.d", FZo(xv, 0), [[DS.z0, DS.z1, DS.ri, DS.ro]], { owner: "asiento.d", whole: true }) };
// una válvula de disco: el disco, el cubo de arriba (centra el resorte) y cuatro aletas que la guían en el asiento
function poppet(name, zb, wingBot) {
  const F = FZo(xv, 0), cover = coverOf(regionsOf(SEAT[name]));
  disc(`${name}.disco`, F, zb, zb + PO.t, PO.r, { tone: "mid" }, { owner: name, cls: "hm-trim" });
  disc(`${name}.cubo`, F, zb + PO.t, zb + PO.t + PO.hh, PO.hub, { tone: "mid" }, { owner: name, cls: "hm-trim" });
  disc(`${name}.eje`, F, wingBot, zb, PO.hubw, { tone: "mid" }, { owner: name, cls: "hm-trim" });
  record(A.disc(F, wingBot, zb, PO.hubw, { name: `${name}.eje.entero`, owner: name }));
  // las aletas, a 45° del corte: cada una de la superficie del eje al radio del asiento, menos una holgura
  [45, 135, 225, 315].forEach((deg, q) => {
    const a = (deg * PI) / 180, dir = [Math.cos(a), Math.sin(a), 0], nrm = [-Math.sin(a), Math.cos(a), 0];
    const Fw = { o: [xv, 0, 0], a: ZD, u: dir, v: nrm };
    const poly = [[PO.hubw - 0.6, -PO.wing / 2], [PO.wr, -PO.wing / 2], [PO.wr, PO.wing / 2], [PO.hubw - 0.6, PO.wing / 2]];
    fp(`${name}.aleta${q}`, Fw, poly, wingBot, zb, { tone: "mid" }, { owner: name, cls: "hm-trim", cover: deg > 180 ? cover : null });
  });
}
poppet("valv.s", SS.z1, SS.z0 + 2);
poppet("valv.d", DS.z1 + HM.lift, DS.z1 + HM.lift - 14);
ANCH.VSUC = [xv + PO.r * 0.6, PO.r * 0.6, SS.z1 + PO.t * 0.8];
ANCH.VDES = [xv + PO.r * 0.6, PO.r * 0.6, DS.z1 + HM.lift + PO.t * 0.8];
// los resortes: hélices de alambre con una espira muerta en cada punta
function spring(name, z0, z1, touch, phase = 0) {
  const w = SP.w, d = 2 * w, Nt = SP.turns, act = Nt - 2, za = z0 + w, zb = z1 - w, p = (zb - za - 2 * d) / act, pts = [];
  const zOf = (th) => { const t = th / TAU; if (t <= 1) return za + d * t; if (t >= Nt - 1) return zb - d * (Nt - t); return za + d + p * (t - 1); };
  const N = Math.round(Nt * 64);
  for (let i = 0; i <= N; i++) { const th = (TAU * Nt * i) / N, a = th + phase; pts.push([xv + SP.r * Math.cos(a), SP.r * Math.sin(a), zOf(th)]); }
  const z = pts.map((q) => q[2]);
  for (let pass = 0; pass < 4; pass++) for (let i = 1; i < z.length - 1; i++) z[i] = (z[i - 1] + 2 * z[i] + z[i + 1]) / 4;
  pts.forEach((q, i) => (q[2] = z[i]));
  // los trozos se cortan donde la hélice pasa por su silueta (delante o detrás del eje), para el orden de pintura
  const breaks = []; let acc = 0;
  const ang = Math.atan2(V3[1], V3[0]);
  for (let i = 1; i < pts.length; i++) {
    const seg = G.len3(G.sub3(pts[i], pts[i - 1])), a0 = Math.atan2(pts[i - 1][1], pts[i - 1][0] - xv), a1 = Math.atan2(pts[i][1], pts[i][0] - xv);
    for (const b of [ang + PI / 2, ang - PI / 2, 0, PI]) { const w0 = Math.sin(a0 - b), w1 = Math.sin(a1 - b); if (w0 < 0 && w1 >= 0 && Math.cos(a0 - b) > 0) breaks.push(acc + (seg * -w0) / (w1 - w0)); }
    acc += seg;
  }
  tubeItems(name, pts, w, { tone: "mid", maxLength: 26, spacing: 3, ends: [false, false], cls: "hm-spring", breaks, touch });
}
spring("resorte.s", SS.z1 + PO.t, DS.z0, ["valv.s*", "asiento.d*"], 0.4);
spring("resorte.d", DS.z1 + HM.lift + PO.t, PL.z0, ["valv.d*", "tapon*"], 1.3);
ANCH.RESORTE = [xv - SP.r, 0, (DS.z1 + HM.lift + PO.t + PL.z0) / 2 + 6];
// el tapón de la columna, cortado, con su cabeza hexagonal; los de los cilindros 2 y 3, enteros (solo su cara de arriba)
turnedCut("tapon", FZo(xv, 0), [[PL.z0, B.z1, 0, PL.r]], { owner: "tapon", caps: ["none"], whole: true });
{
  const hx = HEX(hexR(PL.af), 0), F = FZo(xv, 0);
  // la cabeza: la mitad de atrás de un hexágono, cortada
  const halfHex = (() => { const pts = [[-hexR(PL.af), 0], [-hexR(PL.af) / 2, -PL.af / 2], [hexR(PL.af) / 2, -PL.af / 2], [hexR(PL.af), 0]]; return pts; })();
  fp("tapon.hex", F, halfHex, B.z1, B.z1 + PL.hh, { tone: "mid" }, { owner: "tapon", cls: "hm-trim", skip: new Set([3]) });
  cutStore.push({ owner: "tapon", loops: [[[xv - hexR(PL.af), B.z1], [xv + hexR(PL.af), B.z1], [xv + hexR(PL.af), B.z1 + PL.hh], [xv - hexR(PL.af), B.z1 + PL.hh]]], cls: "hm-cut1" });
  for (let i = 1; i < 3; i++) {
    const Fi = FZo(xv, GEO.yCyl(i));
    disc(`tapon${i}.cara`, Fi, B.z1 - 0.4, B.z1, PL.r, { tone: "mid" }, { owner: `tapon${i}`, cls: "hm-trim", cap: "only" });
    fp(`tapon${i}.hex`, Fi, hx, B.z1, B.z1 + PL.hh, { tone: "mid" }, { owner: `tapon${i}`, cls: "hm-trim" });
    record(A.disc(Fi, PL.z0, B.z1 - 0.4, PL.r, { name: `tapon${i}.cuerpo`, owner: `tapon${i}` }));
  }
  ANCH.TAPON = [xv + hexR(PL.af) * 0.6, -PL.af * 0.3, B.z1 + PL.hh];
}

/* ====================================================================
   6 · las dos etapas de homogeneización: asiento, anillo de impacto, forzador y actuador hidráulico
   ==================================================================== */
const [g1, g2] = HM.gap;
// primera etapa (eje vertical)
turnedCut("asiento1", FZo(x1s, 0), [[S1.z0, S1.z1, S1.ri, S1.ro]], { owner: "asiento1" });
const RING1 = turnedCut("anillo1", FZo(x1s, 0), [[S1.ring[0], S1.ring[1], S1.ring[2], S1.ring[3]]], { cls: "hm-hard", cutCls: "hm-cut-c", owner: "anillo1", cover: annulusCover(FZo(x1s, 0), S1.ch[0], S1.ro, S1.ch[2]) });
// segunda etapa (eje horizontal)
turnedCut("asiento2", FXo(0, 0, z2), [[S2.x0, S2.x1, S2.ri, S2.ro]], { owner: "asiento2" });
const RING2 = turnedCut("anillo2", FXo(0, 0, z2), [[S2.ring[0], S2.ring[1], S2.ring[2], S2.ring[3]]], { cls: "hm-hard", cutCls: "hm-cut-c", owner: "anillo2", cover: annulusCover(FXo(0, 0, z2), S2.ch[0], S2.ro, S2.ch[2]) });
ANCH.ASIENTO = [x1s - (S1.ri + S1.ro) / 2, 0, (S1.z0 + S1.z1) / 2];
ANCH.FORZADOR = [x1s - RF * 0.4, RF * 0.9, S1.ring[1] + 12];
ANCH.ANILLO = [x1s + (S1.ring[2] + S1.ring[3]) / 2, 0, (S1.ring[0] + S1.ring[1]) / 2];
ANCH.RENDIJA = [x1s + RF - 1, 0, S1.z1 + g1 / 2];
ANCH.ETAPA2 = [S2.x1 + g2 / 2, 0, z2 + RF - 2];

// los actuadores hidráulicos: base con su brida, cilindro, tapa con la toma del aceite; émbolo entero adentro
function actuator(name, F, A_, ftop, along) {
  const rects = [[A_.s0, A_.s0 + AC.tflange, RF, AC.rflange], [A_.s0 + AC.tflange, A_.s1, RF, AC.ro], [A_.s1, A_.s2, AC.rbore, AC.ro], [A_.s2, A_.s3, AC.rport, AC.ro]];
  const body = turnedCut(`${name}.cuerpo`, F, rects, { owner: name, cls: "hm-ss", cutCls: "hm-cut" });
  // el émbolo, sobre la punta del forzador
  turnedCut(`${name}.embolo`, F, [[ftop, ftop + AC.piston, 0, AC.rbore]], { owner: `${name}.mov`, cls: "hm-trim", cover: coverOf(regionsOf(body)) });
  // el aceite moja el cilindro arriba del émbolo: la pared de atrás, teñida
  {
    const s0 = ftop + AC.piston, s1 = A_.s2;
    const ro = AC.rbore - 0.4;   // un pelo adentro de la pared, para que quede delante de ella en el orden
    const cv = coverOf(regionsOf(body));
    const svg = toned((o) => surface((f, u) => G.pointOf(F, s0 + (s1 - s0) * u, ro, f), (f) => G.mul3(G.radialOf(F, f), -1), PI, TAU, 60, 4, o), "hm-oil");
    put(`${name}.aceite`, G.pointOf(F, (s0 + s1) / 2, AC.rbore * 0.7, 1.5 * PI), `<g clip-path="url(#${cv.id})">${svg}</g>`,
      [record(A.ring(F, s0, s1, ro, AC.rbore, { name: `${name}.aceite`, owner: name, cut: [FRONT, ...cv.shapes] }))]);
  }
  // el aceite en corte, entre el émbolo y la tapa
  {
    const s0 = ftop + AC.piston, s1 = A_.s2, c = F.o;
    const poly = G.dot3(F.a, XD) > 0.5 ? [[s0, c[2] - AC.rbore], [s1, c[2] - AC.rbore], [s1, c[2] + AC.rbore], [s0, c[2] + AC.rbore]] : [[c[0] - AC.rbore, s0], [c[0] + AC.rbore, s0], [c[0] + AC.rbore, s1], [c[0] - AC.rbore, s1]];
    put(`${name}.aceite.corte`, [poly[0][0] / 2 + poly[2][0] / 2, 0, poly[0][1] / 2 + poly[2][1] / 2], `<path class="hm-oil-liq" d="${pth1(poly.map(([x, z]) => pr([x, 0, z])))}"/>`,
      [record(A.prism(FY0, poly, -0.3, 0, { name: `${name}.aceite.corte`, owner: name }))]);
  }
  // los dos pernos de atrás de la brida
  [225, 315].forEach((deg, q) => {
    const a = (deg * PI) / 180, c = G.pointOf(F, 0, (AC.ro + AC.rflange) / 2 + 0.5, a);
    const Fb = { o: c, a: F.a, u: F.u, v: F.v };
    fp(`${name}.perno${q}`, Fb, HEX(hexR(7)), A_.s0 + AC.tflange, A_.s0 + AC.tflange + 5, { tone: "mid" }, { owner: name, cls: "hm-trim" });
  });
  // la conexión del aceite en la tapa
  fp(`${name}.racor`, F, HEX(hexR(AC.hexAF), 0), A_.s3, A_.s3 + AC.hexH, { tone: "mid" }, { owner: name, cls: "hm-trim" });
  disc(`${name}.niple`, F, A_.s3 + AC.hexH, A_.s3 + AC.hexH + AC.nip, AC.rport, { tone: "mid" }, { owner: name, cls: "hm-trim" });
  return body;
}
const ACT1 = actuator("act1", FZo(x1s, 0), A1, forcerTop1);
const ACT2 = actuator("act2", FXo(0, 0, z2), A2, forcerTop2);
// los forzadores, cortados, tapados por la guía del cabezal, por el anillo de impacto y por la base del actuador
turnedCut("forzador1", FZo(x1s, 0), [[S1.z1 + g1, forcerTop1, 0, RF]], { owner: "forzador1", cls: "hm-trim", cover: [coverOf([...HEAD.regions, ...regionsOf(RING1), ...regionsOf(ACT1)]), annulusCover(FZo(x1s, 0), A1.s1, RF, AC.rbore)] });
turnedCut("forzador2", FXo(0, 0, z2), [[S2.x1 + g2, forcerTop2, 0, RF]], { owner: "forzador2", cls: "hm-trim", cover: [coverOf([...HEAD.regions, ...regionsOf(RING2), ...regionsOf(ACT2)]), annulusCover(FXo(0, 0, z2), A2.s1, RF, AC.rbore)] });
ANCH.ACT1 = [x1s + AC.ro - 4, 0, A1.s1 + AC.wall * 0.5];
ANCH.ACEITE = [x1s, -AC.rbore * 0.5, A1.s2 - 6];
ANCH.ACT2 = [A2.s1 + AC.wall * 0.5, 0, z2 - AC.ro + 4];

// los tubos del aceite: suben de cada racor, doblan y terminan en una unión
const OL = HM.oil;
function oilLine(name, from, pts, unionAxis) {
  const route = G.fillet([from, ...pts], 12, 8, { P, tube: OL.r });
  tubeItems(name, route, OL.r, { cls: "hm-pipe", ends: [true, true], maxLength: 20 });
  const end = pts[pts.length - 1], FU = { o: end, a: unionAxis, u: Math.abs(unionAxis[2]) > 0.5 ? XD : ZD, v: Math.abs(unionAxis[2]) > 0.5 ? YD : YD };
  const ur = hexR(OL.union.af), Lu = OL.union.len;
  fp(`${name}.u0`, FU, HEX(ur, 0), 0, Lu / 3, { tone: "mid" }, { owner: `${name}.union`, cls: "hm-trim" });
  fp(`${name}.u1`, FU, HEX(ur * 1.08, PI / 6), Lu / 3, (2 * Lu) / 3, { tone: "mid" }, { owner: `${name}.union`, cls: "hm-trim" });
  fp(`${name}.u2`, FU, HEX(ur, 0), (2 * Lu) / 3, Lu, { tone: "mid" }, { owner: `${name}.union`, cls: "hm-trim" });
}
{
  const z0 = A1.s3 + AC.hexH + AC.nip, zt = z0 + OL.rise;
  oilLine("aceite1", [x1s, 0, z0], [[x1s, 0, zt], [x1s - OL.run, 0, zt]], [-1, 0, 0]);
  ANCH.ACEITE1 = [x1s - OL.run - OL.union.len / 2, -hexR(OL.union.af) * 0.3, zt + hexR(OL.union.af) * 0.9];
  const x0 = A2.s3 + AC.hexH + AC.nip, xt = x0 + OL.rise;
  oilLine("aceite2", [x0, 0, z2], [[xt, 0, z2], [xt, 0, z2 + OL.run]], [0, 0, 1]);
}

/* ====================================================================
   7 · la entrada de la leche y la salida de la leche homogeneizada, cortadas
   ==================================================================== */
{
  const F = FXo(0, 0, HM.zs), xa = B.x1, xb = xa + INL.tf, xe = INL.x1;
  turnedCut("entrada.brida", F, [[xa, xb, INL.ri, INL.rf]], { owner: "entrada" });
  turnedCut("entrada.tubo", F, [[xb, xe, INL.ri, INL.ro]], { owner: "entrada" });
  turnedCut("entrada.brida2", F, [[xe, xe + INL.te, INL.ri, INL.rf]], { owner: "entrada" });
  ANCH.ENTRADA = [xe - 30, 0, HM.zs - INL.ro];
}
{
  const F = FZo(HM.xo, 0), za = HD.z1, zb = za + OUT.tf, ze = OUT.z1;
  turnedCut("salida.brida", F, [[za, zb, OUT.ri, OUT.rf]], { owner: "salida" });
  turnedCut("salida.tubo", F, [[zb, ze, OUT.ri, OUT.ro]], { owner: "salida" });
  turnedCut("salida.brida2", F, [[ze, ze + OUT.te, OUT.ri, OUT.rf]], { owner: "salida" });
  ANCH.SALIDA = [HM.xo + OUT.ro, 0, (zb + ze) / 2 + 10];
}

/* ====================================================================
   8 · las flechas de la leche, en un plano justo detrás del corte
   ==================================================================== */
function arrow(name, a3, b3) {
  const a = at(a3), b = at(b3), dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const h = 8, w = 3.6, base = [b[0] - ux * h, b[1] - uy * h];
  const line = `M${r10(a[0])} ${r10(a[1])}L${r10(base[0])} ${r10(base[1])}`;
  const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
  put(name, G.lerp3(a3, b3, 0.5), `<path class="hm-flujo" d="${line}"/><path class="hm-flecha" d="${head}"/>`, [A.tube([a3, b3], 1.2), A.ball(b3, w / G.scaleOf(P))]);
}
arrow("flujo.entrada", [INL.x1 - 6, -3, HM.zs], [B.x1 + 26, -3, HM.zs]);
arrow("flujo.cabezal", [xv + 40, -3, HM.zdm], [x1s - 18, -3, HM.zdm]);
arrow("flujo.salida", [HM.xo, -3, HD.z1 + 20], [HM.xo, -3, OUT.z1 - 8]);
ANCH.LECHE = [INL.x1 - 20, -3, HM.zs];

/* El camino de la leche en la primera etapa, solo en el detalle: sube por el asiento, sale de lado por la rendija,
   choca con el anillo de impacto y sube entre el anillo y el forzador a la cámara. En un plano justo detrás del corte. */
if (DET) {
  const yf = -2, zg = S1.z1 + g1 / 2, xr = (RF + S1.ring[2]) / 2;
  [1, -1].forEach((sg) => {
    const pts = [[x1s + sg * 5, yf, S1.z0 + 4], [x1s + sg * 5, yf, zg - 1.2], [x1s + sg * 6.2, yf, zg], [x1s + sg * (xr - 1.2), yf, zg], [x1s + sg * xr, yf, zg + 1.2], [x1s + sg * xr, yf, S1.ring[1] + 9]];
    const sc = pts.map(at), n = sc.length, b = sc[n - 1], a = sc[n - 2], L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L;
    const h = 9, w = 4, base = [b[0] - ux * h, b[1] - uy * h];
    const line = "M" + sc.slice(0, -1).map((q) => r10(q[0]) + " " + r10(q[1])).join("L") + `L${r10(base[0])} ${r10(base[1])}`;
    const head = `M${r10(b[0])} ${r10(b[1])}L${r10(base[0] - uy * w)} ${r10(base[1] + ux * w)}L${r10(base[0] + uy * w)} ${r10(base[1] - ux * w)}Z`;
    put(`flujo.rendija${sg > 0 ? "a" : "b"}`, [x1s + sg * 12, yf, zg], `<path class="hm-flujo hm-fino" d="${line}"/><path class="hm-flecha" d="${head}"/>`,
      [A.tube(pts.slice(0, -1).concat([[x1s + sg * xr, yf, S1.ring[1] + 9 - h / G.scaleOf(P)]]), 0.4), A.ball(pts[n - 1], w / G.scaleOf(P))]);
  });
}

/* ---------- las caras del corte de las piezas, un elemento por pieza ---------- */
{
  const groups = new Map();
  for (const c of cutStore) { if (!groups.has(c.owner)) groups.set(c.owner, []); groups.get(c.owner).push(c); }
  for (const [owner, list] of groups) {
    const byCls = new Map();
    for (const c of list) { if (!byCls.has(c.cls)) byCls.set(c.cls, []); byCls.get(c.cls).push(c); }
    let svg = "";
    for (const [cls, l2] of byCls) svg += cutFaceSvg(l2.flatMap((c) => c.loops), cls);
    const shapes = list.flatMap((c) => c.loops).map((l) => record(A.prism(FY0, l, -0.3, 0, { name: `${owner}.corte`, owner })));
    const all = list.flatMap((c) => c.loops.flat()), cx = all.reduce((q, p) => q + p[0], 0) / all.length, cz = all.reduce((q, p) => q + p[1], 0) / all.length;
    put(`${owner}.corte`, [cx, 0, cz], svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.HM_ITEM) {
  for (const nm of process.env.HM_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], P, { step: STEP });
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
if (DET) {
  // las que caen en el cuadro del detalle (por las esquinas de sus formas), las demás se quitan antes de ordenar
  const inView = (it) => it.shapes.some((sh) => {
    const bd = A.boundsOf(sh); if (!bd) return true;
    const [lo, hi] = Array.isArray(bd) ? bd : [bd.min, bd.max];
    const cs = []; for (const x of [lo[0], hi[0]]) for (const y of [lo[1], hi[1]]) for (const z of [lo[2], hi[2]]) cs.push(at([x, y, z]));
    const x0 = Math.min(...cs.map((c) => c[0])), x1 = Math.max(...cs.map((c) => c[0])), y0 = Math.min(...cs.map((c) => c[1])), y1 = Math.max(...cs.map((c) => c[1]));
    return x1 > 0 && x0 < W && y1 > 0 && y0 < H;
  });
  R_.items.splice(0, R_.items.length, ...R_.items.filter(inView));
}
const t0 = Date.now();
if (!FAST) A.settle(R_, P, { step: STEP });
if (!FAST) console.log("orden:", ((Date.now() - t0) / 1000).toFixed(1), "s");

R_.items.sort((a, b) => a.key - b.key);
const CSS = `.hm-cut{--anatomy-paper:#c9ced3;--anatomy-face:#c9ced3;--anatomy-top:#c9ced3;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#c9ced3;--anatomy-shade-2:#c9ced3;--anatomy-shade-3:#c9ced3}
.hm-cut1{--anatomy-paper:#d6dade;--anatomy-face:#d6dade;--anatomy-top:#d6dade;--anatomy-shade-0:#d6dade;--anatomy-shade-1:#d6dade;--anatomy-shade-2:#d6dade;--anatomy-shade-3:#d6dade}
.hm-cut-c{--anatomy-paper:#c1c6cb;--anatomy-face:#c1c6cb;--anatomy-top:#c1c6cb;--anatomy-shade-0:#c1c6cb;--anatomy-shade-1:#c1c6cb;--anatomy-shade-2:#c1c6cb;--anatomy-shade-3:#c1c6cb}
.hm-cut-p{--anatomy-paper:#c7cdd1;--anatomy-face:#c7cdd1;--anatomy-top:#c7cdd1;--anatomy-shade-0:#c7cdd1;--anatomy-shade-1:#c7cdd1;--anatomy-shade-2:#c7cdd1;--anatomy-shade-3:#c7cdd1}
.hm-cut-gk{--anatomy-paper:#3e464d;--anatomy-face:#3e464d;--anatomy-top:#3e464d;--anatomy-shade-0:#3e464d;--anatomy-shade-1:#3e464d;--anatomy-shade-2:#3e464d;--anatomy-shade-3:#3e464d}
.hm-ss{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#d6dade;--anatomy-shade-2:#e1e4e7;--anatomy-shade-3:#eceef0}
.hm-trim{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#d6dade;--anatomy-shade-2:#e1e4e7;--anatomy-shade-3:#eceef0}
.hm-plunger{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#c9ced3;--anatomy-shade-1:#d6dade;--anatomy-shade-2:#e1e4e7;--anatomy-shade-3:#eceef0}
.hm-rod{--anatomy-paper:#e4e8ea;--anatomy-face:#e4e8ea;--anatomy-top:#edf0f1;--anatomy-shade-0:#c7cdd1;--anatomy-shade-1:#d0d5d8;--anatomy-shade-2:#d8dcdf;--anatomy-shade-3:#dfe2e4}
.hm-hard{--anatomy-paper:#dfe2e5;--anatomy-face:#dfe2e5;--anatomy-top:#e9ebed;--anatomy-shade-0:#c1c6cb;--anatomy-shade-1:#cacfd3;--anatomy-shade-2:#d3d7da;--anatomy-shade-3:#dadde0}
.hm-cast{--anatomy-paper:#dfe2e5;--anatomy-face:#dfe2e5;--anatomy-top:#e9ebed;--anatomy-shade-0:#c1c6cb;--anatomy-shade-1:#cacfd3;--anatomy-shade-2:#d3d7da;--anatomy-shade-3:#dadde0}
.hm-paint{--anatomy-paper:#e4e8ea;--anatomy-face:#e4e8ea;--anatomy-top:#edf0f1;--anatomy-shade-0:#c7cdd1;--anatomy-shade-1:#d0d5d8;--anatomy-shade-2:#d8dcdf;--anatomy-shade-3:#dfe2e4}
.hm-rubber{--anatomy-paper:#5d666e;--anatomy-face:#5d666e;--anatomy-top:#6b747c;--anatomy-shade-0:#3e464d;--anatomy-shade-1:#475057;--anatomy-shade-2:#505960;--anatomy-shade-3:#576067}
.hm-sub{--anatomy-paper:#e4eef7;--anatomy-face:#e4eef7;--anatomy-top:#eef4fa;--anatomy-shade-0:#bcd0e6;--anatomy-shade-1:#c9d9eb;--anatomy-shade-2:#d6e3f1;--anatomy-shade-3:#dde8f4}
.hm-oil{--anatomy-paper:#f3e9be;--anatomy-face:#f3e9be;--anatomy-top:#f7f0d2;--anatomy-shade-0:#e3cf7a;--anatomy-shade-1:#e8d78e;--anatomy-shade-2:#eddfa3;--anatomy-shade-3:#f0e4b0}
.hm-spring .tb-body{fill:#e1e4e7}.hm-spring .tb-shine{fill:#f7f8f9}.hm-spring .tb-shade{fill:#c9ced3}
.hm-pipe .tb-body{fill:#e1e4e7}.hm-pipe .tb-shine{fill:#f7f8f9}.hm-pipe .tb-shade{fill:#c9ced3}
.hm-flujo{fill:none;stroke:#2e5e9e;stroke-width:1.5px;stroke-linecap:round;stroke-linejoin:round;opacity:.85}
.hm-flecha{fill:#2e5e9e;stroke:none;opacity:.85}
.hm-fino{stroke-width:1.1px}
.hm-oil-liq{fill:#e3cf7a;fill-opacity:.55;stroke:none}
.hm-det-fondo{fill:#ffffff;stroke:none}
.hm-det-marco{fill:none;stroke:#525c64;stroke-width:1px}`;
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
const svg = DET
  ? k.figureSvg({ width: W, height: H, label: "La primera etapa ampliada", body: [`<style>${CSS}</style><defs>${DEFS.join("")}<clipPath id="hmDet"><circle cx="${W / 2}" cy="${H / 2}" r="${RDET}"/></clipPath></defs><g class="hm-items" clip-path="url(#hmDet)"><circle class="hm-det-fondo" cx="${W / 2}" cy="${H / 2}" r="${RDET}"/>${groups.join("")}</g><circle class="hm-det-marco" cx="${W / 2}" cy="${H / 2}" r="${RDET}"/>`] })
  : k.figureSvg({ width: W, height: H, label: "Homogeneizador de alta presión en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="hm-items">${groups.join("")}</g>`] });
const OUTD = join(HERE, "out");
mkdirSync(OUTD, { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(OUTD, DET ? "detalle.svg" : "fig.svg"), svgOut);
writeFileSync(join(OUTD, "fig.css"), k.ISO_CSS);
writeFileSync(DET ? join(OUTD, "preview-detalle.html") : join(HERE, "preview.html"), k.pageHtml({ title: "Homogeneizador", theme: "light", width: DET ? 400 : 1100, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(4), "svg", Math.round(svgOut.length / 1024), "KB");
writeFileSync(join(OUTD, DET ? "detalle_data.json" : "homogeneizador_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH, CDET, MDET, RDET }));
if (!FAST) A.auditOrExit(R_, P, {});
