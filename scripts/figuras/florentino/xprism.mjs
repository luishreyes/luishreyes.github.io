/* Prisma a lo largo de x (o de y, o de cualquier eje con un marco F) con una sección cualquiera, cóncava incluida.
   Se pinta cara por cara, de atrás hacia adelante, y cada cara lleva sus
   aristas: así una arista que queda detrás de otra cara del mismo sólido
   no se ve. La tapa que mira al lector va al final: tapa todo lo que el
   prisma tiene detrás de ella. Sin imports: el mismo texto corre en la
   página para reconstruir las tortas en cada cuadro. */
export function xCam(P) {
  const a = (P.azimuth * Math.PI) / 180, e = (P.elevation * Math.PI) / 180, k = P.scale * Math.sqrt(1.6);
  const sA = Math.sin(a), cA = Math.cos(a), sE = Math.sin(e), cE = Math.cos(e);
  const l = [-sA, cA, 1.2], ln = Math.hypot(l[0], l[1], l[2]);
  return {
    pr: (x, y, z) => [P.origin[0] + (x * sA - y * cA) * k, P.origin[1] + ((x * cA + y * sA) * sE - z * cE) * k],
    V: [cA * cE, sA * cE, sE],
    L: [l[0] / ln, l[1] / ln, l[2] / ln],
    depth: (x, y, z) => (x * cA + y * sA) * cE + z * sE,
  };
}
export function xPrismSvg(C, poly, x0, x1, opts = {}) { return prismSvg(C, poly, x0, x1, opts); }
// prisma a lo largo de x (sección en y, z) o de y (sección en x, z); skip: aristas de la sección cuyas caras no se pintan
export function prismSvg(C, poly, x0, x1, { tone = "mid", crease = "faint", cls = "", flat = false, axis = "x", skip = null, cap: capMode = "auto", F = null } = {}) {
  const f1 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
  const pth = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + f1(x) + " " + f1(y)).join("") + "Z";
  const seg = (a, b) => "M" + f1(a[0]) + " " + f1(a[1]) + "L" + f1(b[0]) + " " + f1(b[1]);
  const area = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p[0] * q[1] - q[0] * p[1]; } return s; };
  const orient = (pts) => (area(pts) < 0 ? pts.slice().reverse() : pts);
  const band = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
  const flip = area(poly) < 0, ring = flip ? poly.slice().reverse() : poly.slice();
  const n = ring.length, V = C.V, L = C.L, dot = (u, w) => u[0] * w[0] + u[1] * w[1] + u[2] * w[2];
  const ax = axis === "y";
  // con un marco F = { o, a, u, v } la sección va en (u, v) y el prisma corre a lo largo de a
  const w3 = F ? (s, p, q) => [F.o[0] + F.a[0] * s + F.u[0] * p + F.v[0] * q, F.o[1] + F.a[1] * s + F.u[1] * p + F.v[1] * q, F.o[2] + F.a[2] * s + F.u[2] * p + F.v[2] * q] : null;
  const at3 = F ? (s, p, q) => C.pr(...w3(s, p, q)) : (s, u, v) => (ax ? C.pr(u, s, v) : C.pr(s, u, v));
  const skipped = (j) => skip && skip.has(flip ? (n - 2 - j + n) % n : j);
  const P0 = ring.map(([y, z]) => at3(x0, y, z)), P1 = ring.map(([y, z]) => at3(x1, y, z));
  const faces = [];
  for (let j = 0; j < n; j++) {
    const [ya, za] = ring[j], [yb, zb] = ring[(j + 1) % n], len = Math.hypot(yb - ya, zb - za) || 1;
    const nrm = F ? [0, 1, 2].map((i) => (F.u[i] * (zb - za) - F.v[i] * (yb - ya)) / len) : ax ? [(zb - za) / len, 0, -(yb - ya) / len] : [0, (zb - za) / len, -(yb - ya) / len];
    const d = F ? C.depth(...w3((x0 + x1) / 2, (ya + yb) / 2, (za + zb) / 2)) : ax ? C.depth((ya + yb) / 2, (x0 + x1) / 2, (za + zb) / 2) : C.depth((x0 + x1) / 2, (ya + yb) / 2, (za + zb) / 2);
    faces.push({ kind: "side", j, nrm, vis: dot(nrm, V) > 1e-6 && !skipped(j), d });
  }
  const AX = F ? F.a : ax ? [0, 1, 0] : [1, 0, 0], vc = dot(AX, V);
  const capHi = { kind: "cap", hi: true, nrm: AX, vis: vc > 1e-6 }, capLo = { kind: "cap", hi: false, nrm: AX.map((c) => -c), vis: vc < -1e-6 };
  const sharp = (j) => { // arista longitudinal en el vértice j: entre la cara j-1 y la j
    const a = ring[(j - 1 + n) % n], b = ring[j], c = ring[(j + 1) % n];
    const u = [b[0] - a[0], b[1] - a[1]], w = [c[0] - b[0], c[1] - b[1]];
    return (u[0] * w[0] + u[1] * w[1]) / ((Math.hypot(u[0], u[1]) * Math.hypot(w[0], w[1])) || 1) < Math.cos(0.35);
  };
  const order = faces.filter((f) => f.vis).sort((p, q) => p.d - q.d);
  const cap = capHi.vis ? capHi : capLo.vis ? capLo : null;
  const rank = new Map(order.map((f, i) => [f.j, i]));
  const fill = [];
  const out = [];
  const paint = (pts, nrm) => { const b = band(dot(nrm, L)); return b >= 4 ? `<path class="iso-top" d="${pth(pts)}"/>` : `<path class="iso-shade" data-shade="${b}" d="${pth(pts)}"/>`; };
  // las caras seguidas del mismo tono van en un solo trazo, con sus aristas después: menos elementos, el mismo orden
  let runKey = null, runD = [], runC = [], runE = [];
  // los tramos sueltos "Mx yLx y" que siguen uno al otro se unen en una sola polilínea
  const chain = (list) => {
    let d = "", last = null;
    for (const sgm of list) {
      const m = sgm.match(/^M(\S+) (\S+)L(\S+) (\S+)$/);
      if (!m) { d += sgm; last = null; continue; }
      if (last && last[0] === m[1] && last[1] === m[2]) d += "L" + m[3] + " " + m[4];
      else if (last && last[0] === m[3] && last[1] === m[4]) d += "L" + m[1] + " " + m[2];
      else d += sgm;
      last = last && last[0] === m[3] && last[1] === m[4] ? [m[1], m[2]] : [m[3], m[4]];
    }
    return d;
  };
  const flush = () => {
    if (runKey !== null) {
      out.push(runKey.replace("D", runD.join("")));
      if (runC.length) out.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${chain(runC)}"/>`);
      if (runE.length) out.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${chain(runE)}"/>`);
    }
    runKey = null; runD = []; runC = []; runE = [];
  };
  const keyOf = (pts, nrm, fl) => { if (fl) return `<path class="iso-shade" data-shade="${fl}" d="D"/>`; const b = band(dot(nrm, L)); return b >= 4 ? `<path class="iso-top" d="D"/>` : `<path class="iso-shade" data-shade="${b}" d="D"/>`; };
  for (const f of capMode === "only" ? [] : order) {
    const j = f.j, k2 = (j + 1) % n, quad = orient([P0[j], P1[j], P1[k2], P0[k2]]);
    fill.push(pth(quad));
    const edges = [], creases = [];
    // aristas longitudinales en los dos extremos de la cara
    for (const [v, other] of [[j, (j - 1 + n) % n], [k2, k2]]) {
      const o = faces[other], mine = rank.get(j), theirs = o.vis ? rank.get(o.j) : -1;
      if (!o.vis) edges.push(seg(P0[v], P1[v]));
      else if (theirs < mine && sharp(v)) creases.push(seg(P0[v], P1[v]));
    }
    // aristas de las tapas
    if (!capLo.vis) edges.push(seg(P0[j], P0[k2]));
    if (!capHi.vis) edges.push(seg(P1[j], P1[k2]));
    const key = keyOf(quad, f.nrm, flat ? 2 : 0);
    if (key !== runKey) { flush(); runKey = key; }
    runD.push(pth(quad)); runC.push(...creases); runE.push(...edges);
  }
  flush();
  if (cap && capMode !== "none") {
    const pts = cap.hi ? P1 : P0, poly2 = orient(pts.slice());
    fill.push(pth(poly2));
    out.push(keyOf(poly2, cap.nrm, flat ? 3 : 0).replace("D", pth(poly2)));
    const edges = [], creases = [];
    for (let j = 0; j < n; j++) (faces[j].vis ? creases : edges).push(seg(pts[j], pts[(j + 1) % n]));
    if (creases.length) out.push(`<path class="iso-line iso-crease" data-tone="${crease}" d="${chain(creases)}"/>`);
    if (edges.length) out.push(`<path class="iso-line iso-edge" data-tone="${tone}" d="${chain(edges)}"/>`);
  }
  return `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">${out.join("")}</g>`;
}
/* secciones de uso común, en (y, z) */
export function halfOct(zc, r, steps = 8) { // media boca (y ≤ 0) de una perforación a lo largo de x, de arriba hacia abajo
  const pts = [];
  for (let i = 0; i <= steps; i++) { const t = Math.PI / 2 + (Math.PI * i) / steps; pts.push([r * Math.cos(t), zc + r * Math.sin(t)]); }
  return pts.map(([y, z]) => [Math.abs(y) < 1e-9 ? 0 : y, z]);
}
export function notched(yb, z0, z1, holes) { // rectángulo y∈[yb,0], z∈[z0,z1] con medias bocas en y = 0
  const pts = [[0, z0], [yb, z0], [yb, z1], [0, z1]];
  for (const h of [...holes].sort((a, b) => b.zc - a.zc)) pts.push(...halfOct(h.zc, h.r, h.steps || 8));
  return pts;
}
