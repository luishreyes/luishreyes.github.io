/* Geometría del tambor que depende del caso: el nivel de la suspensión (f), el perfil de la torta,
   la cuchilla, la canaleta, las regaderas y la pared derecha de la artesa. Sin imports: el mismo
   texto corre en build.mjs (para grabar las formas de referencia) y en la página.
   Coordenadas en cm; el tambor gira en el plano x-z con θ decreciendo (horario visto de frente). */
export const DG = { R: 90, ZD: 150, L: 120, RI: 104, TW: 1.6, ZTOP: 228, PHIK: 0.94, CHUTE: [152, 74], BELT: 62, WASHR: 10.5, HEADZ: 266 };
export function zonesOf(f) {
  const { R, ZD } = DG, TAU = 2 * Math.PI;
  const thIn = -Math.PI / 2 + Math.PI * f, thOut = -Math.PI / 2 - Math.PI * f;
  const level = ZD - R * Math.cos(Math.PI * f);
  const thK = thIn - DG.PHIK * TAU + TAU;
  const w1 = Math.min(f + 0.07, 0.78), w2 = Math.min(f + 0.15, 0.84);
  return { f, thIn, thOut, level, thK, wash: [thIn - w1 * TAU, thIn - w2 * TAU], wallTop: Math.min(DG.ZTOP, level + 6) };
}
const pol = (r, t) => [r * Math.cos(t), DG.ZD + r * Math.sin(t)];
// espesor dibujado (cm) en la fracción de vuelta φ ∈ [0, 1] desde la entrada a la suspensión
export function drawnAt(prof, phi) { const n = prof.length - 1, x = Math.max(0, Math.min(1, phi)) * n, i = Math.min(n - 1, Math.floor(x)), u = x - i; return prof[i] * (1 - u) + prof[i + 1] * u; }
// banda de torta entre φ0 y φ1; devuelve el polígono (x, z) y las aristas de la cara interior (contra la tela)
export function cakeBand(prof, f, phi0, phi1, steps = 72) {
  const Z = zonesOf(f), R = DG.R, out = [], inn = [];
  for (let i = 0; i <= steps; i++) {
    const phi = phi0 + ((phi1 - phi0) * i) / steps, th = Z.thIn - 2 * Math.PI * phi;
    out.push(pol(R + Math.max(0.05, drawnAt(prof, phi)), th)); inn.push(pol(R, th));
  }
  const poly = [...out, ...inn.reverse()], skip = new Set();
  for (let j = out.length; j < poly.length - 1; j++) skip.add(j);
  return { poly, skip };
}
// contorno exterior de tambor + torta entre dos ángulos (para morder la suspensión)
function rimBetween(prof, Z, th0, th1, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const th = th0 + ((th1 - th0) * i) / steps;
    let phi = (Z.thIn - th) / (2 * Math.PI); phi = ((phi % 1) + 1) % 1;
    const t = phi <= DG.PHIK ? drawnAt(prof, phi) : 0;
    pts.push(pol(DG.R + t, th));
  }
  return pts;
}
// la suspensión en la artesa, en dos piscinas: a la izquierda (detrás del tambor) y a la derecha (delante)
export function pools(prof, f) {
  const Z = zonesOf(f), { R, ZD, RI } = DG, lv = Z.level, dz = lv - ZD;
  const xw = lv >= ZD ? RI : Math.sqrt(Math.max(0, RI * RI - dz * dz));
  const vatArc = (a0, a1, steps) => { const p = []; for (let i = 0; i <= steps; i++) p.push(pol(RI, a0 + ((a1 - a0) * i) / steps)); return p; };
  const bottom = -Math.PI / 2;
  const rimL = rimBetween(prof, Z, bottom, Z.thOut, 40), rimR = rimBetween(prof, Z, Z.thIn, bottom, 40);
  const cutX = (pts) => { const last = pts[pts.length - 1]; return last; };
  const wallL = lv >= ZD ? [[-RI, lv], [-RI, ZD], ...vatArc(Math.PI, 1.5 * Math.PI, 24)] : vatArc(Math.PI + Math.asin(Math.max(-1, Math.min(1, -dz / RI))), 1.5 * Math.PI, 24);
  const left = [[-xw, lv], ...wallL.slice(lv >= ZD ? 1 : 1), [0, ZD - RI], ...rimL, [cutX(rimL)[0], lv]];
  const wallR = lv >= ZD ? [...vatArc(1.5 * Math.PI, 2 * Math.PI, 24), [RI, ZD], [RI, lv]] : vatArc(1.5 * Math.PI, 2 * Math.PI + Math.asin(Math.max(-1, Math.min(1, dz / RI))), 24);
  const right = [[0, ZD - RI], ...wallR.slice(1), [xw, lv], [rimR[0][0], lv], ...rimR];
  return { left: dedupe(left), right: dedupe(right) };
}
function dedupe(p) { const o = []; for (const q of p) { const l = o[o.length - 1]; if (!l || Math.hypot(q[0] - l[0], q[1] - l[1]) > 0.05) o.push(q); } const a = o[0], b = o[o.length - 1]; if (o.length > 2 && Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.05) o.pop(); return o; }
// la parte derecha de la artesa, desde 300° hasta el borde, que sube con el nivel. Va en tres: hasta 325° su
// cara de adentro mira al lector y queda detrás de la suspensión; de ahí al nivel ya se ve la de afuera, que
// queda delante; y la franja del borde, sobre la superficie
function arcPiece(a0, a1, z1) {
  const { ZD, RI, TW } = DG, inner = [], outer = [];
  if (a1 > a0 + 1e-4) for (let i = 0; i <= 12; i++) { const a = a0 + ((a1 - a0) * i) / 12; inner.push(pol(RI, a)); outer.push(pol(RI + TW, a)); }
  if (z1 != null && z1 > ZD) { const zb = inner.length ? ZD : Math.max(ZD, z1 - 1e9); if (!inner.length) { inner.push([RI, zb]); outer.push([RI + TW, zb]); } inner.push([RI, z1]); outer.push([RI + TW, z1]); }
  return inner.length > 1 ? dedupe([...inner, ...outer.reverse()]) : null;
}
export function vatRight(f) {
  const Z = zonesOf(f), { ZD, RI } = DG, top = Z.wallTop, lv = Z.level, TAU = 2 * Math.PI;
  const angAt = (z) => (z >= ZD ? TAU : TAU + Math.asin((z - ZD) / RI));
  const a0 = (5 * Math.PI) / 3, aS = (325 * Math.PI) / 180, aL = angAt(lv), aT = angAt(top);
  const back = arcPiece(a0, Math.min(aS, aL)), front = aL > aS ? arcPiece(aS, Math.min(aL, TAU), lv > ZD ? lv : null) : null;
  let upper;
  if (lv >= ZD) { const { TW } = DG; upper = [[RI, lv], [RI + TW, lv], [RI + TW, top], [RI, top]]; }
  else upper = arcPiece(aL, aT, top > ZD ? top : null);
  return { back, front, upper, top, poly: arcPiece(a0, aT, top > ZD ? top : null) };
}
// cuchilla: filo junto a la tela en θK, la cara de arriba recibe la torta que baja
export function knifeOf(f) {
  const Z = zonesOf(f), R = DG.R, th = Z.thK, n = [Math.cos(th), Math.sin(th)], t = [Math.sin(th), -Math.cos(th)];
  // la hoja sale hacia afuera y hacia abajo, para que la torta que pela resbale sola
  let b = [n[0] + t[0], Math.min(n[1] + t[1], -0.55)], bl = Math.hypot(b[0], b[1]); b = [b[0] / bl, b[1] / bl];
  const dn = b[0] * n[0] + b[1] * n[1]; if (dn < 0.25) { b = [b[0] + n[0] * (0.25 - dn) * 2, b[1] + n[1] * (0.25 - dn) * 2]; bl = Math.hypot(b[0], b[1]); b = [b[0] / bl, b[1] / bl]; }
  const m = [-b[1], b[0]]; // normal de la cara de arriba (hacia el lado de donde viene la torta)
  const up = m[0] * -t[0] + m[1] * -t[1] > 0 ? m : [b[1], -b[0]];
  const T = pol(R + 0.5, th), LEN = b[1] < -0.05 ? Math.max(8, Math.min(20, (T[1] - (Z.wallTop + 3)) / -b[1])) : 20, base = [T[0] + b[0] * LEN, T[1] + b[1] * LEN];
  const blade = [T, [base[0] + up[0] * 1.4, base[1] + up[1] * 1.4], [base[0] - up[0] * 0.6, base[1] - up[1] * 0.6], [T[0] - up[0] * 0.15, T[1] - up[1] * 0.15]];
  const h0 = [base[0] - up[0] * 0.6, base[1] - up[1] * 0.6], holder = [h0, [h0[0] + b[0] * 7, h0[1] + b[1] * 7], [h0[0] + b[0] * 7 - up[0] * 5, h0[1] + b[1] * 7 - up[1] * 5], [h0[0] - up[0] * 5, h0[1] - up[1] * 5]];
  // canaleta: del filo hasta el borde de la artesa y de ahí a la banda
  const V = vatRight(f), wall = [DG.RI + DG.TW + 1.5, V.top + 0.01], end = DG.CHUTE;
  const a = [base[0] + up[0] * 1.4, base[1] + up[1] * 1.4];
  const chute = a[0] < wall[0] - 2 ? [a, wall, end] : [a, end];
  return { T, b, up, blade, holder, chute, base, th };
}
export function plate(p, q, thick, side) { // placa de espesor thick a lo largo del segmento p→q, hacia el lado side (+1/-1)
  const d = [q[0] - p[0], q[1] - p[1]], l = Math.hypot(d[0], d[1]) || 1, m = [(-d[1] / l) * side * thick, (d[0] / l) * side * thick];
  return [p, q, [q[0] - m[0], q[1] - m[1]], [p[0] - m[0], p[1] - m[1]]];
}
export function circlePoly(cx, cz, r, n = 16) { return Array.from({ length: n }, (_, i) => [cx + r * Math.cos((i / n) * 2 * Math.PI), cz + r * Math.sin((i / n) * 2 * Math.PI)]); }
export function washOf(f) { const Z = zonesOf(f); return Z.wash.map((th) => pol(DG.R + DG.WASHR, th)); }
