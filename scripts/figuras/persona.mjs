/* ====================================================================
   La figura humana de referencia de las isométricas del libro de operaciones unitarias (skill anatomy): un maniquí
   neutro, sin cara, sin pelo y sin ropa, que da la escala de un equipo. Una sola figura para todo el libro, en tres
   poses:

   - personaDePie(): una persona de 1,75 m de pie, con los brazos a los lados (uno puede ir un poco adelante), donde
     trabajaría junto al equipo: sobre el piso o la plataforma, con una sombra corta bajo los pies;
   - manoEnBorde(): la mano sola (de la muñeca a la punta del dedo medio 190 mm, 85 mm de ancho de palma) que llega
     desde atrás del equipo y apoya las yemas en su borde, como quien lo sostiene o lo toca: los nudillos sobre el canto,
     cada dedo doblado lo justo para tocar la superficie, el pulgar abierto y apoyado, y el antebrazo doblado hacia el
     fondo, oculto detrás del dorso, con la cara del corte mirando hacia atrás. Es la que va junto a un equipo chico
     (pedido del profesor, 8 nov 2026: que el corte no se vea y que la mano ocupe poco);
   - mano(): la primera pose, la mano apoyada sobre el plano de la muñeca con un trozo de antebrazo cortado limpio.
     Si el antebrazo mira al lector se ve la cara del corte, que pesa más que el equipo: no se usa para la escala.

   La regla del libro (pedido del profesor, 8 nov 2026): una persona de 1,75 m donde trabajaría; si el equipo es más
   chico que una persona, la mano; en los círculos de detalle, nada. Los simuladores no la llevan.

   Las medidas son de un adulto de 1,75 m (proporciones de antropometría corriente: la cabeza de 23 cm, el hombro a
   1,41 m, la cadera a 0,90 m, la rodilla a 0,50 m, la punta de los dedos a 0,66 m con el brazo colgado). Todo va en
   milímetros en el sistema del cuerpo y se pasa a las unidades de la figura con `mm` (unidades de la figura por mm:
   1 si la figura dibuja en milímetros, 0,1 si dibuja en centímetros).

   Cómo está hecha: cada segmento (cabeza, cuello, tronco, brazos, antebrazos, palma, cada dedo, muslos, piernas, pies)
   es una superficie cerrada que recorre una serie de secciones (superelipses, para que el tronco y los pies sean más
   anchos que hondos), sombreada como las piezas del kit: la sombra más honda, tres sombras y la tapa según la luz de la
   normal, en capas de fronteras lisas, y la silueta como arista. Para el audit cada segmento
   se registra como cuerpos de revolución (los redondos) o prismas (los achatados) entre sus secciones. El orden entre
   segmentos se resuelve con el mismo trazado de rayos del kit (A.overlapsOf y A.orderKeys) y todo sale como una sola
   pieza (`svg` y `shapes`), que la figura pone con su `put` y ordena con el resto.

   Uso, en el build.mjs de una figura:

     import { personaDePie, manoEnBorde } from "../persona.mjs";
     const per = personaDePie({ P, pie: [x, y, zPiso], rumbo: 0, mm: 1 });   // rumbo: hacia dónde mira (grados desde +x hacia +y)
     per.shapes.forEach(record);                                              // las formas ya van en unidades de la figura
     put("persona", per.ref, per.svg, per.shapes);
     // la mano: borde, el punto del canto bajo el nudillo del medio; hacia, hacia adentro del equipo
     const m = manoEnBorde({ P, borde: [x, y, zCara], hacia: [dx, dy, 0], lado: "der", mm: 1 });
     m.shapes.forEach(record); put("mano", m.ref, m.svg, m.shapes);

   La mano en el borde se pone atrás del equipo (lejos del lector), unos 30° a 50° hacia un lado, donde no tape nada
   rotulado. Como el antebrazo sale de la cámara, se arma con la P definitiva; para ajustar la cámara a la mano se arma
   una vez con una P provisional (la misma elevación y el mismo azimut) y se suman sus `pts` a los puntos de la cámara.
   Todas devuelven también `anclas` (CABEZA, PECHO, MANO, …) para los rótulos. La clase del material es `ps-persona`
   (la paleta del libro la pinta con el material «persona» de estilo/paleta.json), la del corte del antebrazo
   `ps-persona-corte` y la de la sombra `ps-sombra`; `CSS_PERSONA` trae los tonos para la vista de la figura.

   Prueba aparte: node persona.mjs --audit (una escena mínima con la persona de pie, la mano apoyada junto a un disco de
   190 mm y la mano en el borde de otro; debe terminar en «audit passed», en un par de minutos; PERSONA_CASOS=borde
   corre solo uno; escribe la vista en el directorio temporal, o en PERSONA_OUT).

   Dónde va hoy: la línea de vapor del capítulo 21 (linea-vapor/, la persona) y los impulsores de bomba del capítulo 11
   (impulsores-bomba/, la mano en el borde). Los simuladores no la llevan.
   ==================================================================== */
import { fileURLToPath } from "node:url";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL("../../.claude/skills/anatomy", import.meta.url));
const k = await import(KIT + "/kit/iso-kit.mjs");
const G = await import(KIT + "/kit/lathe.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const { add3, sub3, mul3, dot3, cross3, unit3, len3 } = G;
const D2R = Math.PI / 180, TAU = 2 * Math.PI;
const BANDS = [0, 0.2, 0.42, 0.62];
const BAND = (s) => { let t = 0; while (t < BANDS.length && s >= BANDS[t]) t++; return t; };
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth = (pts, close = true) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + (close ? "Z" : "");
const lerp = (a, b, t) => a + (b - a) * t;
// los tramos sueltos de la silueta, unidos en polilíneas por sus extremos
function cadenas(segs) {
  const key = (p) => `${Math.round(p[0] * 20)},${Math.round(p[1] * 20)}`;
  const por = new Map(), usado = new Array(segs.length).fill(false);
  segs.forEach(([a, b], i) => { for (const p of [a, b]) { const kk = key(p); if (!por.has(kk)) por.set(kk, []); por.get(kk).push(i); } });
  const out = [];
  for (let i = 0; i < segs.length; i++) {
    if (usado[i]) continue;
    usado[i] = true;
    const c = [segs[i][0], segs[i][1]];
    for (const fin of [1, 0]) {
      for (;;) {
        const p = fin ? c[c.length - 1] : c[0];
        const j = (por.get(key(p)) || []).find((q) => !usado[q]);
        if (j === undefined) break;
        usado[j] = true;
        const [a, b] = segs[j], nxt = key(a) === key(p) ? b : a;
        if (fin) c.push(nxt); else c.unshift(nxt);
      }
    }
    out.push(c);
  }
  return out;
}
function simplificaAbierta(pts, tol) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  let im = 0, dmx = -1;
  for (let i = 1; i < pts.length - 1; i++) { const d = L < 1e-9 ? Math.hypot(pts[i][0] - a[0], pts[i][1] - a[1]) : Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if (d > dmx) { dmx = d; im = i; } }
  if (dmx <= tol) return [a, b];
  const l = simplificaAbierta(pts.slice(0, im + 1), tol), r = simplificaAbierta(pts.slice(im), tol);
  return [...l.slice(0, -1), ...r];
}
// Ramer-Douglas-Peucker sobre un polígono cerrado en pantalla: quita los puntos que se apartan menos de tol px
function simplifica(pl, tol) {
  const q = pl.filter((p, i) => i === 0 || Math.hypot(p[0] - pl[i - 1][0], p[1] - pl[i - 1][1]) > 1e-3);
  if (q.length < 5) return q;
  let far = 0, dm = -1; for (let i = 1; i < q.length; i++) { const d = Math.hypot(q[i][0] - q[0][0], q[i][1] - q[0][1]); if (d > dm) { dm = d; far = i; } }
  const rdp = (pts) => {
    if (pts.length < 3) return pts;
    const [a, b] = [pts[0], pts[pts.length - 1]], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1e-9;
    let im = 0, dmx = -1;
    for (let i = 1; i < pts.length - 1; i++) { const d = Math.abs((b[0] - a[0]) * (a[1] - pts[i][1]) - (a[0] - pts[i][0]) * (b[1] - a[1])) / L; if (d > dmx) { dmx = d; im = i; } }
    if (dmx <= tol) return [a, b];
    const l = rdp(pts.slice(0, im + 1)), r = rdp(pts.slice(im));
    return [...l.slice(0, -1), ...r];
  };
  const A1 = rdp(q.slice(0, far + 1)), A2 = rdp([...q.slice(far), q[0]]);
  return [...A1.slice(0, -1), ...A2.slice(0, -1)];
}

/* Los tonos de la vista de la figura (la paleta del libro los cambia por los del material «persona»): un gris cálido
   claro, que no se confunde con ningún metal, el concreto ni los fluidos. */
export const TONOS_PERSONA = { cara: "#DCD3CB", tapa: "#E7E0DB", sombras: ["#B3A79C", "#BFB4AA", "#CCC1B8", "#D4CAC2"] };
const vars = (c, t, s) => `--anatomy-paper:${c};--anatomy-face:${c};--anatomy-top:${t};--anatomy-shade-0:${s[0]};--anatomy-shade-1:${s[1]};--anatomy-shade-2:${s[2]};--anatomy-shade-3:${s[3]}`;
export const CSS_PERSONA = `.ps-persona{${vars(TONOS_PERSONA.cara, TONOS_PERSONA.tapa, TONOS_PERSONA.sombras)}}\n` +
  `.ps-persona-corte{${vars(TONOS_PERSONA.sombras[0], TONOS_PERSONA.sombras[0], Array(4).fill(TONOS_PERSONA.sombras[0]))}}\n` +
  `.ps-sombra{fill:${TONOS_PERSONA.sombras[0]};fill-opacity:.35;stroke:none}`;

/* ---------- las medidas del cuerpo, en mm (un adulto de 1,75 m) ----------
   Sistema del cuerpo: f hacia adelante, l hacia su izquierda, z hacia arriba; el origen en el piso, entre los pies. */
export const CUERPO = {
  estatura: 1750,
  // el tronco y la pelvis: [z, media anchura, media profundidad, corrimiento hacia adelante]
  tronco: [
    [808, 0, 0, 0], [818, 70, 52, 0], [842, 136, 88, -2], [880, 166, 102, -8], [930, 172, 108, -12], [990, 165, 107, -10],
    [1060, 147, 100, -2], [1130, 137, 98, 4], [1200, 141, 102, 8], [1280, 154, 110, 12], [1350, 164, 115, 12],
    [1405, 168, 110, 6], [1440, 152, 97, 0], [1466, 118, 76, -6], [1484, 60, 46, -8], [1492, 0, 0, -8],
  ],
  cuello: [[1458, 0, 0, 2], [1464, 55, 57, 2], [1510, 51, 54, 7], [1568, 49, 52, 12], [1574, 0, 0, 12]],
  // la cabeza, de la barbilla (1518) a la coronilla (1750): 155 mm de ancho y 196 de fondo
  cabeza: [[1516, 0, 0, 34], [1522, 34, 40, 33], [1540, 55, 66, 28], [1570, 67, 84, 22], [1610, 74, 94, 15], [1655, 77, 98, 10],
    [1700, 74, 94, 7], [1728, 62, 78, 4], [1743, 42, 52, 3], [1750, 0, 0, 2]],
  hombro: { l: 178, z: 1408 }, codo: { l: 198, z: 1100, f: -8 }, muneca: { l: 202, z: 850, f: 34 },
  brazo: [47, 44, 38, 35], antebrazo: [37, 35, 29, 25],
  cadera: { l: 92, z: 905 }, rodilla: { l: 100, z: 495, f: 8 }, tobillo: { l: 104, z: 92, f: -6 },
  muslo: [[0, 80], [0.15, 79], [0.5, 66], [0.85, 54], [1, 50]],
  pierna: [[0, 50, 0], [0.12, 52, 4], [0.3, 56, 12], [0.55, 45, 8], [0.85, 34, 2], [1, 32, 0]],   // [t, radio, pantorrilla hacia atrás]
  // el pie, a lo largo del pie desde el tobillo: [s, media anchura, alto]
  pie: [[-66, 0, 0, 30], [-60, 26, 44], [-44, 36, 62], [-12, 40, 80], [40, 44, 66], [100, 49, 48], [150, 50, 37], [185, 46, 29], [204, 34, 22], [212, 0, 0, 12]],
  abrePies: 7,           // los pies abiertos 7° hacia afuera
  // la mano: palma de 85 mm, de la muñeca a la punta del dedo medio 190 mm
  palma: [[-10, 0, 0], [-4, 27, 19], [0, 29, 18], [30, 39, 16, 3], [60, 42, 14, 2], [85, 42, 13], [98, 40, 12], [106, 30, 8], [110, 0, 0]],   // [s, media anchura, medio grueso, corrimiento hacia el pulgar]
  dedos: [ // [s del nudillo, corrimiento hacia el pulgar, largo, radio en la base, radio en la punta, abertura en grados]
    [96, 25, 80, 9.5, 7.6, 5], [100, 8.5, 90, 10, 8, 0], [97, -8.5, 85, 9.5, 7.6, -4], [90, -24, 66, 8.5, 6.8, -10],
  ],
  pulgar: { s: 28, t: 26, n: -6, largos: [34, 28, 24], radios: [13, 10.6, 9.4, 8.2] },
};

/* ====================================================================
   las superficies: una serie de secciones (superelipses) a lo largo de una espina
   ==================================================================== */
function seccion(st, N) {
  const out = [];
  for (let j = 0; j < N; j++) {
    const t = (TAU * j) / N, c = Math.cos(t), s = Math.sin(t), q = 2 / st.e;
    const x = st.a * Math.sign(c) * Math.abs(c) ** q, y = st.b * Math.sign(s) * Math.abs(s) ** q;
    out.push(add3(st.c, add3(mul3(st.X, x), mul3(st.Y, y))));
  }
  return out;
}
const cr = (p0, p1, p2, p3, t) => { const t2 = t * t, t3 = t2 * t; return 0.5 * (2 * p1 + (p2 - p0) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (3 * p1 - p0 - 3 * p2 + p3) * t3); };
const vec = (st) => [...st.c, ...st.X, ...st.Y, st.a, st.b, st.e];
const deVec = (v) => {
  const X = unit3(v.slice(3, 6)), Y0 = v.slice(6, 9), Y = unit3(sub3(Y0, mul3(X, dot3(X, Y0))));
  return { c: v.slice(0, 3), X, Y, a: Math.max(0, v[9]), b: Math.max(0, v[10]), e: v[11] };
};

/* Una pieza: llaves (secciones) → secciones densas (Catmull-Rom) → caras → SVG; y sus formas para el audit. */
function pieza(nombre, llaves, ctx, { cls = "ps-persona", corte = null, ground = false, funde = 0 } = {}) {
  const { P, V, L, KS } = ctx;
  // las secciones densas: cada tramo, en pasos de unos 3,5 px de pantalla
  const vs = llaves.map(vec), dense = [], llaveEn = [];
  for (let i = 0; i < vs.length - 1; i++) {
    llaveEn[i] = dense.length;
    const p0 = vs[Math.max(0, i - 1)], p1 = vs[i], p2 = vs[i + 1], p3 = vs[Math.min(vs.length - 1, i + 2)];
    const dl = Math.max(len3(sub3(llaves[i + 1].c, llaves[i].c)), Math.abs(llaves[i + 1].a - llaves[i].a), Math.abs(llaves[i + 1].b - llaves[i].b));
    const q = Math.max(1, Math.ceil((dl * KS) / 5));
    for (let s = 0; s < q; s++) dense.push(deVec(p1.map((_, m) => (s === 0 ? p1[m] : cr(p0[m], p1[m], p2[m], p3[m], s / q)))));
  }
  dense.push(deVec(vs[vs.length - 1]));
  const rmax = Math.max(...llaves.map((s) => Math.max(s.a, s.b)));
  const N = Math.max(8, Math.min(72, 2 * Math.round((TAU * rmax * KS) / 9)));
  const R = dense.map((st) => seccion(st, N));
  const M = R.length;
  // las caras
  const faces = [], EJE = sub3(dense[M - 1].c, dense[0].c);
  for (let i = 0; i < M - 1; i++) for (let j = 0; j < N; j++) {
    const j2 = (j + 1) % N, q = [R[i][j], R[i][j2], R[i + 1][j2], R[i + 1][j]];
    let n = [0, 0, 0];
    for (let m = 0; m < 4; m++) n = add3(n, cross3(q[m], q[(m + 1) % 4]));
    if (len3(n) < 1e-9) { faces.push(null); continue; }
    n = unit3(n);
    const cen = mul3(add3(add3(q[0], q[1]), add3(q[2], q[3])), 0.25);
    // hacia afuera: las secciones van en sentido antihorario alrededor de X × Y; si la espina va al revés, se voltea
    if (dot3(cross3(dense[i].X, dense[i].Y), EJE) < 0) n = mul3(n, -1);
    faces.push({ q, n, i, j, vis: dot3(n, V) > 1e-6, d: dot3(cen, V) });
  }
  const F = (i, j) => faces[i * N + ((j + N) % N)];
  const vis = (f) => !!(f && f.vis);
  // la cara del corte (antebrazo): el anillo del extremo, plano
  const tapas = [];
  if (corte) {
    const i = corte === "inicio" ? 0 : M - 1, o = corte === "inicio" ? 1 : M - 2;
    const n = unit3(sub3(dense[i].c, dense[o].c)), cen = dense[i].c;
    tapas.push({ tapa: true, pts: R[i], i, n, vis: dot3(n, V) > 1e-6, d: dot3(cen, V) });
  }
  /* La silueta: las aristas entre una cara que se ve y una que no (a lo largo y alrededor), y el borde de un extremo
     abierto (el corte del antebrazo). */
  const tapa = tapas.find((x) => x.vis);
  const sil = [];
  // funde: las primeras llaves van sin silueta (el arranque de un dedo dentro de la palma se funde con ella)
  const i0 = funde ? llaveEn[funde] ?? 0 : 0;
  for (let i = i0; i < M - 1; i++) for (let j = 0; j < N; j++) if (vis(F(i, j - 1)) !== vis(F(i, j))) sil.push([R[i][j], R[i + 1][j]]);
  for (let i = i0; i < M; i++) for (let j = 0; j < N; j++) {
    const e = [R[i][j], R[i][(j + 1) % N]];
    if (i === 0 || i === M - 1) {
      const pole = llaves[i === 0 ? 0 : llaves.length - 1].a < 1e-6;
      if (!pole && (vis(F(i === 0 ? 0 : M - 2, j)) || (tapa && tapa.i === i))) sil.push(e);
      continue;
    }
    if (vis(F(i - 1, j)) !== vis(F(i, j))) sil.push(e);
  }
  const at = (p) => k.iso(p, P);
  /* Los tonos, en capas: primero toda la parte que se ve en la sombra más honda y encima, una tras otra, las regiones
     donde la luz pasa cada umbral (0; 0,2; 0,42; 0,62: la tapa). La luz de cada vértice es la de su normal (el promedio
     de las caras que lo tocan); en cada franja entre dos anillos, la región va de un cruce del umbral al otro,
     interpolado entre vértices, así las fronteras entre tonos salen lisas, sin escalera. Las franjas seguidas se unen en
     un solo polígono por capa. Sirve porque cada pieza es convexa en sus secciones: lo que se ve de una franja es un
     solo tramo del anillo. */
  const VN = R.map((ring) => ring.map(() => [0, 0, 0]));
  for (let i = 0; i < M - 1; i++) for (let j = 0; j < N; j++) {
    const f = F(i, j); if (!f) continue;
    for (const [a2, b2] of [[i, j], [i, (j + 1) % N], [i + 1, (j + 1) % N], [i + 1, j]]) VN[a2][b2] = add3(VN[a2][b2], f.n);
  }
  const SV = VN.map((ring) => ring.map((nv) => dot3(unit3(nv), L)));
  const md = (j) => ((j % N) + N) % N;
  const ptAt = (i, x) => { const j0 = Math.floor(x), t = x - j0, a2 = R[i][md(j0)], b2 = R[i][md(j0 + 1)]; return t < 1e-9 ? a2 : G.lerp3(a2, b2, t); };
  const svAt = (i, j) => SV[i][md(j)];
  // los tramos de caras visibles de la franja i: [inicio, fin] en índices de vértice (sin envolver)
  const runsOf = (i) => {
    const on = Array.from({ length: N }, (_, j) => vis(F(i, j)));
    if (on.every(Boolean)) return [[0, N]];
    const out = [];
    for (let j = 0; j < N; j++) if (on[j] && !on[md(j - 1)]) { let e = j; while (on[md(e + 1)] && e + 1 < j + N) e++; out.push([j, e + 1]); }
    return out;
  };
  // dentro de [x0, x1] del anillo i, los tramos donde la luz pasa el umbral th
  const sobre = (i, x0, x1, th) => {
    const out = []; let start = svAt(i, x0) >= th ? x0 : null;
    for (let j = x0; j < x1; j++) {
      const sa = svAt(i, j), sb = svAt(i, j + 1);
      if ((sa >= th) !== (sb >= th)) { const x = j + (th - sa) / (sb - sa); if (sa < th) start = x; else { out.push([start, x]); start = null; } }
    }
    if (start !== null) out.push([start, x1]);
    let res = out.filter(([p0, p1]) => p1 - p0 > 1e-3);
    // el anillo entero a la vista: un tramo que llega al final y otro que sale del principio son uno solo
    if (x1 - x0 === N && res.length > 1 && res[0][0] <= x0 + 1e-9 && res[res.length - 1][1] >= x1 - 1e-9) { const a2 = res.pop(), b2 = res.shift(); res.push([a2[0], b2[1] + N]); }
    // dos tramos casi pegados son uno
    for (let q = res.length - 1; q > 0; q--) if (res[q][0] - res[q - 1][1] < 0.6) { res[q - 1] = [res[q - 1][0], res[q][1]]; res.splice(q, 1); }
    // un tramo de menos de un vértice pegado a la silueta es ruido de las normales del borde
    if (res.length > 1) res = res.filter(([p0, p1]) => !(p1 - p0 < 1.2 && (p0 <= x0 + 1e-9 || p1 >= x1 - 1e-9)));
    return res;
  };
  const UMB = [-9, ...BANDS];
  const capas = UMB.map(() => []);
  const sueltos = UMB.map(() => []);
  const near = (x, ref) => x + N * Math.round((ref - x) / N);
  UMB.forEach((th, cap) => {
    let activas = [];
    for (let i = 0; i < M - 1; i++) {
      const filas = [];
      for (const [x0, x1] of runsOf(i)) {
        if (cap === 0) { filas.push({ A: [x0, x1], B: [x0, x1] }); continue; }
        const As = sobre(i, x0, x1, th), Bs = sobre(i + 1, x0, x1, th);
        if (As.length === Bs.length) As.forEach((A2, q) => filas.push({ A: A2, B: Bs[q] }));
        else if (As.length + Bs.length === 1) {
          // la región nace o muere dentro de la franja: se cierra en el punto donde su luz cae al umbral
          const pico = (ii) => { let bx = x0, bv = -9; for (let j = x0; j <= x1; j++) if (svAt(ii, j) > bv) { bv = svAt(ii, j); bx = j; } return [bx, bv]; };
          const [I, m0] = As.length ? [As[0], (As[0][0] + As[0][1]) / 2] : [Bs[0], (Bs[0][0] + Bs[0][1]) / 2];
          const [, vA] = pico(i), [, vB] = pico(i + 1);
          const t = As.length ? (vA - th) / Math.max(1e-6, vA - vB) : 1 - (vB - th) / Math.max(1e-6, vB - vA);
          const punto = G.lerp3(ptAt(i, m0), ptAt(i + 1, m0), Math.max(0, Math.min(1, t)));
          filas.push(As.length ? { A: I, B: [m0, m0], Bp: punto } : { A: [m0, m0], B: I, Ap: punto });
        } else {
          // el umbral cambia de forma dentro de la franja: se pinta cara por cara (el triángulo recortado al umbral)
          for (let j = x0; j < x1; j++) for (const tri of [[[i, j], [i, j + 1], [i + 1, j + 1]], [[i, j], [i + 1, j + 1], [i + 1, j]]]) {
            let pl = tri.map(([a2, b2]) => [...R[a2][md(b2)], svAt(a2, b2)]), outp = [];
            for (let m = 0; m < 3; m++) { const u = pl[m], w = pl[(m + 1) % 3]; if (u[3] >= th) outp.push(u); if ((u[3] >= th) !== (w[3] >= th)) { const t = (th - u[3]) / (w[3] - u[3]); outp.push(u.map((c, q) => lerp(c, w[q], t))); } }
            if (outp.length >= 3) sueltos[cap].push(outp.map((v) => at(v)));
          }
        }
      }
      const siguen = [];
      for (const fila of filas) {
        const cadena = activas.find((c) => !c.usada && c.filas[c.filas.length - 1].i === i - 1 && (() => { const L2 = c.filas[c.filas.length - 1].B, ref = (L2[0] + L2[1]) / 2, a2 = near(fila.A[0], ref), sh = a2 - fila.A[0]; return a2 < L2[1] + 1e-6 && fila.A[1] + sh > L2[0] - 1e-6; })());
        if (cadena) {
          const L2 = cadena.filas[cadena.filas.length - 1].B, sh = near(fila.A[0], (L2[0] + L2[1]) / 2) - fila.A[0];
          cadena.usada = true;
          cadena.filas.push({ ...fila, i, A: [fila.A[0] + sh, fila.A[1] + sh], B: [fila.B[0] + sh, fila.B[1] + sh] });
          siguen.push(cadena);
        } else siguen.push({ filas: [{ i, ...fila }] });
      }
      for (const c of activas) if (!siguen.includes(c)) capas[cap].push(c);
      activas = siguen.map((c) => ({ filas: c.filas }));
    }
    capas[cap].push(...activas);
  });
  // cada cadena de franjas, un polígono: el borde izquierdo hacia abajo, el arco del último anillo, el borde derecho
  // hacia arriba y el arco del primero
  const arco = (i, x0, x1) => { const pts = [ptAt(i, x0)]; for (let j = Math.floor(x0) + 1; j < x1 - 1e-9; j++) pts.push(R[i][md(j)]); pts.push(ptAt(i, x1)); return pts; };
  const poligono = ({ filas }) => {
    const izq = [], der = [];
    for (const f of filas) { izq.push(f.Ap || ptAt(f.i, f.A[0]), f.Bp || ptAt(f.i + 1, f.B[0])); der.push(f.Ap || ptAt(f.i, f.A[1]), f.Bp || ptAt(f.i + 1, f.B[1])); }
    const ult = filas[filas.length - 1], pri = filas[0];
    const abajo = ult.Bp ? [] : arco(ult.i + 1, ult.B[0], ult.B[1]).slice(1, -1), arriba = pri.Ap ? [] : arco(pri.i, pri.A[0], pri.A[1]).reverse().slice(1, -1);
    return [...izq, ...abajo, ...der.reverse(), ...arriba].map(at);
  };
  const keyOf = (cap) => (cap >= 4 ? `<path class="iso-top" d="D"/>` : `<path class="iso-shade" data-shade="${cap}" d="D"/>`);
  let cuerpo = "";
  capas.forEach((lista, cap) => {
    const d = lista.map(poligono).map((pl) => pth(simplifica(pl, 0.25))).join("") + sueltos[cap].map((pl) => pth(pl)).join("");
    if (d) cuerpo += keyOf(cap).replace("D", d);
  });
  if (tapa) cuerpo += `</g><g class="iso-solid ps-persona-corte" data-seamless=""><path class="iso-shade" data-shade="0" d="${pth(tapa.pts.map(at))}"/>`;
  const edgeD = cadenas(sil.map(([p, q]) => [at(p), at(q)])).map((c) => pth(simplificaAbierta(c, 0.2), false)).join("");
  const out = [`<g class="iso-solid ${cls}" data-seamless="">${cuerpo}<path class="iso-line iso-edge" data-tone="mid" d="${edgeD}"/></g>`];
  // las formas del audit: entre cada par de llaves, un cuerpo de revolución si la sección es redonda o un prisma si no
  const shapes = [];
  for (let i = 0; i < llaves.length - 1; i++) {
    const s0 = llaves[i], s1 = llaves[i + 1];
    const a = Math.max(s0.a, s1.a), b = Math.max(s0.b, s1.b);
    const ax = sub3(s1.c, s0.c), Lg = len3(ax);
    if (a < 1e-6 || Lg < 1e-6) continue;
    const ua = unit3(ax), ref = s0.a > 1e-6 ? s0 : s1;
    const u = unit3(sub3(ref.X, mul3(ua, dot3(ref.X, ua)))), v = cross3(ua, u);
    const Fr = { o: s0.c, a: ua, u, v };
    const meta = { name: `${nombre}.${i}`, owner: ctx.owner, ...(ground ? { ground: true } : {}) };
    if (Math.abs(a - b) / a < 0.12) shapes.push(A.body(Fr, [[0, 0], [0, Math.max(s0.a, s0.b, 0.3 * a)], [Lg, Math.max(s1.a, s1.b, 0.3 * a)], [Lg, 0]], meta));
    else {
      const poly = [];
      for (let j = 0; j < 16; j++) { const t = (TAU * j) / 16, c = Math.cos(t), s = Math.sin(t), q = 2 / ref.e; poly.push([a * Math.sign(c) * Math.abs(c) ** q, b * Math.sign(s) * Math.abs(s) ** q]); }
      shapes.push(A.prism(Fr, poly, 0, Lg, meta));
    }
  }
  const centro = mul3(llaves.reduce((s, st) => add3(s, st.c), [0, 0, 0]), 1 / llaves.length);
  // unos puntos de la superficie, para que la figura ajuste su cámara a lo que ocupa la pieza
  const pts = [];
  for (let i = 0; i < M; i += Math.max(1, Math.floor(M / 8))) for (let j = 0; j < N; j += Math.max(1, Math.floor(N / 12))) pts.push(R[i][j]);
  for (let j = 0; j < N; j += Math.max(1, Math.floor(N / 12))) pts.push(R[M - 1][j]);
  return { name: nombre, svg: out.join(""), shapes, ref: centro, pts };
}

/* Un segmento redondo (brazo, dedo) a lo largo de una espina, con los extremos redondeados: puntos y radios. */
function tubo(nombre, puntos, radios, ctx, opts = {}) {
  const n = puntos.length, ref = opts.ref || [0, 0, 1];
  const dirAt = (i) => unit3(sub3(puntos[Math.min(n - 1, i + 1)], puntos[Math.max(0, i - 1)]));
  const marco = (i) => { const d = dirAt(i); let X = sub3(ref, mul3(d, dot3(ref, d))); if (len3(X) < 1e-6) X = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1]; X = unit3(sub3(X, mul3(d, dot3(X, d)))); return { X, Y: cross3(d, X) }; };
  const ell = opts.achata || 1;      // los dedos, un poco más anchos que gruesos
  const llaves = [];
  const tapa = (i, sign) => {        // la media esfera del extremo, de la base a la punta (el polo)
    const d = mul3(dirAt(i), sign), r = radios[i], { X, Y } = marco(i), pts = [];
    for (let m = 5; m >= 0; m--) { const ph = (m / 6) * (Math.PI / 2); pts.push({ c: add3(puntos[i], mul3(d, r * Math.cos(ph) * 0.92)), X, Y, a: r * Math.sin(ph) * ell, b: (r * Math.sin(ph)) / ell, e: 2 }); }
    return pts;
  };
  llaves.push(...tapa(0, -1).reverse());
  for (let i = 0; i < n; i++) { const { X, Y } = marco(i); llaves.push({ c: puntos[i], X, Y, a: radios[i] * ell, b: radios[i] / ell, e: 2 }); }
  llaves.push(...tapa(n - 1, 1));
  // funde se da en puntos de la espina; la tapa del arranque suma seis llaves
  return pieza(nombre, llaves, ctx, opts.funde ? { ...opts, funde: 6 + opts.funde } : opts);
}

/* el contexto de dibujo: la cámara de la figura y las unidades */
function contexto(P, mm, owner) {
  return { P, V: G.viewOf(P), L: G.lightOf(P), KS: G.scaleOf(P), mm, owner };
}

/* El orden de los segmentos con el trazado de rayos del kit; sale una sola pieza. */
function unir(nombre, partes, ctx) {
  const items = partes.map((p) => ({ name: p.name, shapes: p.shapes, svg: p.svg, key: dot3(p.ref, ctx.V) + (p.bias || 0), move: [0, 0, 0] }));
  const ov = A.overlapsOf(items, ctx.P, { step: 0.75, tolerance: 0.3 * ctx.mm });
  const sol = A.orderKeys(items, ov);
  const orden = items.map((it, i) => [sol.keys[i], i]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map(([, i]) => items[i]);
  // lo que va siempre encima de otra pieza (el cuello sobre el tronco: sale de él)
  partes.forEach((p) => { for (const otro of p.encima || []) { const a = orden.findIndex((it) => it.name === p.name), b = orden.findIndex((it) => it.name === otro); if (a >= 0 && b > a) { const [it] = orden.splice(a, 1); orden.splice(b, 0, it); } } });
  const shapes = partes.flatMap((p) => p.shapes);
  const ref = mul3(partes.reduce((s, p) => add3(s, p.ref), [0, 0, 0]), 1 / partes.length);
  return { name: nombre, svg: orden.map((it) => it.svg).join(""), shapes, ref, ciclos: sol.cycles.length, pts: partes.flatMap((p) => p.pts || []) };
}

/* ====================================================================
   la mano: la palma, cuatro dedos, el pulgar y (si se pide) un trozo de antebrazo cortado
   muneca: el centro de la muñeca; dedos: hacia dónde apuntan los dedos; dorso: la normal del dorso de la mano;
   lado: "der" o "izq"; dobla: cuánto se doblan los dedos (1, apoyada; 1,4, colgando); antebrazo: largo en mm (0, sin
   antebrazo); alza: grados que sube el antebrazo sobre el plano de la mano; brazo: la dirección del antebrazo, de la
   muñeca hacia el codo (si se da, manda sobre alza); plano: {o, n}, una superficie sobre la que se apoyan las yemas:
   cada dedo y el pulgar se doblan lo justo para tocarla; abrePulgar: cuánto se separa el pulgar (0 a 1)
   ==================================================================== */
// el grosor a lo largo de un dedo (once puntos: el nudillo, su arranque y tres por falange), relativo a la recta de la
// base a la punta: abultado en el nudillo y en las dos articulaciones, un poco más delgado a mitad de cada falange
// (solo en la mano en el borde: la persona de pie y la mano apoyada quedan como estaban)
const PERFIL_DEDO = [1.13, 1.07, 0.99, 0.97, 1.03, 0.97, 0.96, 1.02, 0.98, 1.0, 1.0];
function partesMano(ctx, { muneca, dedos, dorso, lado = "der", dobla = 1, antebrazo = 0, alza = 8, brazo = null, abre = 1, plano = null, abrePulgar = null, nombre = "mano", ground = false }) {
  const mm = ctx.mm, C = CUERPO;
  const d = unit3(dedos), n0 = unit3(sub3(dorso, mul3(d, dot3(dorso, d)))), n = n0;
  const t = lado === "der" ? cross3(n, d) : cross3(d, n);      // hacia el pulgar
  const W = (s, tt, nn) => add3(muneca, mul3(add3(add3(mul3(d, s), mul3(t, tt)), mul3(n, nn)), mm));
  const partes = [];
  // la palma: secciones achatadas (superelipse de exponente 2,8)
  partes.push(pieza(`${nombre}.palma`, C.palma.map(([s, a, b, tc = 0]) => ({ c: W(s, tc, 0), X: t, Y: n, a: a * mm, b: b * mm, e: 2.8 })), ctx, { ground }));
  const rot = (v, ax, ang) => { const c = Math.cos(ang), s = Math.sin(ang); return add3(add3(mul3(v, c), mul3(cross3(ax, v), s)), mul3(ax, dot3(ax, v) * (1 - c))); };
  // lo que le falta a la pieza para tocar el plano (negativo: lo atraviesa)
  const holgura = (pts, radios) => Math.min(...pts.map((p, i) => dot3(sub3(p, plano.o), plano.n) - radios[i]));
  // el doblez que deja la pieza tocando el plano: entre 0 y 8 veces el doblez de la mano apoyada, por bisección
  const ajusta = (gen) => {
    const hueco = 0.4 * mm, g = (kf) => { const [p, r] = gen(kf); return holgura(p, r) - hueco; };
    if (g(0) <= 0) return 0;
    if (g(8) >= 0) return 8;
    let lo = 0, hi = 8;
    for (let it = 0; it < 32; it++) { const m = (lo + hi) / 2; if (g(m) > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  };
  // los dedos: tres falanges que se doblan hacia la palma, con el nudillo un poco por encima del plano de la palma
  const nud = plano ? 0 : -1;
  const dedo = (q, kf) => {
    const [s0, t0, Lf, rb, rt, ab] = C.dedos[q];
    let dir = rot(d, n, (lado === "der" ? 1 : -1) * ab * abre * D2R);
    const flex = [10, 14, 9].map((g) => g * kf * D2R), largos = [0.46, 0.3, 0.24].map((f) => f * Lf);
    const nudo = W(s0 - (plano ? 16 : 8), t0, nud);
    const pts = [nudo, add3(nudo, mul3(dir, 8 * mm))];
    let p = pts[1];
    largos.forEach((Lg, m) => {
      const eje = unit3(cross3(dir, n));                         // doblar hacia la palma (−n)
      dir = rot(dir, eje, -flex[m]);
      for (let s = 1; s <= 3; s++) pts.push(add3(p, mul3(dir, (Lg * mm * s) / 3)));
      p = pts[pts.length - 1];
    });
    const radios = pts.map((_, i) => lerp(rb, rt, i / (pts.length - 1)) * (plano ? PERFIL_DEDO[i] ?? 1 : 1) * mm);
    return [pts, radios];
  };
  C.dedos.forEach((_, q) => {
    const kf = plano ? ajusta((k2) => dedo(q, k2)) : dobla;
    const [pts, radios] = dedo(q, kf);
    partes.push(tubo(`${nombre}.dedo${q + 1}`, pts, radios, ctx, { ref: t, achata: 1.08, ground, ...(plano ? { funde: 1 } : {}) }));
  });
  // el pulgar: sale de la base de la palma, abierto hacia su lado y un poco hacia la palma
  const T = C.pulgar, ap = abrePulgar ?? (0.2 + 0.24 * abre) / 0.44;
  const pulgar = (kf) => {
    let dir = unit3(add3(add3(mul3(d, 0.84 - 0.3 * Math.max(0, ap - 1)), mul3(t, 0.44 * ap)), mul3(n, plano ? -0.12 : -0.34)));
    const pts = [W(T.s, T.t, plano ? T.n + 3 : T.n)];
    let p = pts[0];
    T.largos.forEach((Lg) => {
      for (let s = 1; s <= 3; s++) pts.push(add3(p, mul3(dir, (Lg * mm * s) / 3)));
      p = pts[pts.length - 1];
      if (plano) dir = rot(unit3(add3(dir, mul3(d, 0.12))), unit3(cross3(dir, n)), -12 * kf * D2R);
      else dir = unit3(add3(mul3(dir, 1), add3(mul3(d, 0.22), mul3(n, -0.1 * kf))));
    });
    // grueso en la base (la eminencia de la palma), con las articulaciones marcadas
    const radios = pts.map((_, i) => { const u = (i / (pts.length - 1)) * 3, m = Math.min(2, Math.floor(u)); return lerp(T.radios[m], T.radios[m + 1], u - m) * (plano ? [1.08, 1.02, 0.98, 1.04, 0.98, 0.97, 1.03, 0.99, 1, 1][i] ?? 1 : 1) * mm; });
    return [pts, radios];
  };
  {
    const kf = plano ? ajusta(pulgar) : dobla;
    const [pts, radios] = pulgar(kf);
    partes.push(tubo(`${nombre}.pulgar`, pts, radios, ctx, { ref: n, achata: 1.05, ground }));
  }
  // el antebrazo, cortado limpio
  if (antebrazo > 0) {
    const back = brazo ? unit3(brazo) : unit3(add3(mul3(d, -Math.cos(alza * D2R)), mul3(n, Math.sin(alza * D2R))));
    const up = unit3(cross3(t, back)), nn = dot3(up, n) < 0 ? mul3(up, -1) : up;
    const llaves = [];
    // doblado en la muñeca (brazo dado), un poco más delgado y con el arranque corto, para que no asome por el dorso ni a
    // los lados de la muñeca
    const cortes = brazo ? [[antebrazo, 29, 21], [antebrazo * 0.6, 27, 19], [antebrazo * 0.25, 25, 17], [0, 24, 15], [-4, 21, 12], [-7, 0, 0]] : [[antebrazo, 34, 24], [antebrazo * 0.6, 32, 22], [antebrazo * 0.25, 30, 20], [0, 28, 18], [-10, 25, 16], [-16, 0, 0]];
    for (const [s, a, b] of cortes) llaves.push({ c: add3(muneca, mul3(back, s * mm)), X: t, Y: nn, a: a * mm, b: b * mm, e: 2.3 });
    partes.push(pieza(`${nombre}.antebrazo`, llaves, ctx, { corte: "inicio", ground: true }));
  }
  /* en la mano en el borde cada dedo arranca dentro de la palma, sin silueta en ese tramo (funde), y se pinta encima de
     ella: el dorso pasa al dedo sin una tapa redonda dibujada, y el abultamiento del arranque hace de nudillo */
  if (plano) partes.slice(1, 5).forEach((p2) => (p2.encima = [partes[0].name]));
  return partes;
}

/* La mano apoyada (la primera pose): la palma hacia abajo sobre el plano de la muñeca, los dedos un poco doblados y un
   trozo de antebrazo cortado limpio. Ojo: si el antebrazo mira al lector, se ve la cara del corte; para dar la escala
   de un equipo chico va mejor manoEnBorde. */
export function mano({ P, muneca, dedos, dorso = [0, 0, 1], lado = "der", mm = 1, dobla = 1, antebrazo = 65, alza = 8, nombre = "mano", owner = "mano" }) {
  const ctx = contexto(P, mm, owner);
  const partes = partesMano(ctx, { muneca, dedos, dorso, lado, dobla, antebrazo, alza, nombre });
  const u = unir(nombre, partes, ctx);
  const d = unit3(dedos), nn = unit3(dorso);
  u.anclas = { MANO: add3(muneca, mul3(add3(mul3(d, 55), mul3(nn, 15)), mm)), MUNECA: muneca };
  return u;
}

/* ====================================================================
   la mano en el borde: la que da la escala de un equipo chico
   La mano llega desde atrás del equipo y apoya las yemas en su borde, como quien lo sostiene o lo toca: los nudillos
   justo sobre el borde, los dedos doblados hasta tocar la superficie (cada uno lo justo, así tocan todos aunque sean de
   largos distintos), el pulgar abierto y apoyado también, el dorso inclinado hacia afuera y abajo, y el antebrazo
   doblado en la muñeca hacia el fondo. La dirección del antebrazo sale de la cámara: es el reflejo de la palma en el
   plano de la pantalla, así en el dibujo queda justo detrás del dorso, oculto por la mano, y la cara del corte mira
   hacia el fondo (no se ve). Sirve para cualquier borde: una tapa, una brida, el canto de un disco.

   borde: el punto del canto bajo el nudillo del dedo medio; hacia: hacia adentro del equipo, perpendicular al canto (se
   proyecta sobre la superficie); gira: grados que se gira la mano sobre la superficie para que el pulgar quede hacia
   adentro y se apoye también (con 0 los dedos van perpendiculares al canto y el pulgar queda en el aire, junto al canto);
   sube: la normal de la superficie; alto: el centro del nudillo sobre la superficie, en mm (con más alto los dedos se
   doblan más); inclina: grados que baja el dorso desde los nudillos hacia la muñeca (por defecto, según la cámara: 40°
   menos que la elevación, y nunca menos de 0); antebrazo: el largo que se dibuja, en mm (no más que la palma, para que no asome).
   Devuelve también `pts` (puntos de su superficie, para la cámara) y `anclas` (MANO, el dorso; MUNECA; YEMA).
   ==================================================================== */
export function manoEnBorde({ P, borde, hacia, sube = [0, 0, 1], lado = "der", mm = 1, gira = 40, alto = 38, inclina = null, antebrazo = 50, abrePulgar = 1.2, nombre = "mano", owner = "mano" }) {
  const ctx = contexto(P, mm, owner), V = ctx.V;
  const up = unit3(sube), h0 = unit3(sub3(hacia, mul3(up, dot3(hacia, up))));
  // girada sobre la normal, con el pulgar hacia adentro del equipo
  const ga = (lado === "der" ? -gira : gira) * D2R, h = unit3(add3(mul3(h0, Math.cos(ga)), mul3(cross3(up, h0), Math.sin(ga))));
  const elev = Math.asin(Math.max(-1, Math.min(1, dot3(V, up)))) / D2R;
  const g = (inclina ?? Math.max(0, Math.min(25, elev - 40))) * D2R;
  // la palma sube de la muñeca a los nudillos; el dorso, perpendicular, hacia arriba y afuera
  const p = add3(mul3(h, Math.cos(g)), mul3(up, Math.sin(g))), n = add3(mul3(up, Math.cos(g)), mul3(h, -Math.sin(g)));
  const nudillo = add3(borde, mul3(up, alto * mm));
  const muneca = sub3(sub3(nudillo, mul3(p, 90 * mm)), mul3(n, 2 * mm));
  // el antebrazo: el reflejo de la palma en el plano de la pantalla (mismo trazo en el dibujo, hacia el fondo)
  let brazo = unit3(sub3(p, mul3(V, 2 * dot3(p, V))));
  if (dot3(p, V) <= 0.05) brazo = unit3(add3(mul3(V, -1), mul3(up, -0.3)));
  const partes = partesMano(ctx, { muneca, dedos: p, dorso: n, lado, antebrazo, brazo, plano: { o: borde, n: up }, abre: 0.6, abrePulgar, nombre });
  const u = unir(nombre, partes, ctx);
  u.anclas = { MANO: add3(muneca, mul3(add3(mul3(p, 50), mul3(n, 17)), mm)), MUNECA: muneca, YEMA: add3(borde, mul3(h, 55 * mm)) };
  return u;
}

/* ====================================================================
   la persona de pie
   pie: el punto del piso entre los pies; rumbo: hacia dónde mira, en grados desde +x hacia +y; adelante: "izq" o
   "der", el brazo que va un poco adelante (o null); sombra: la sombra corta en el piso
   ==================================================================== */
export function personaDePie({ P, pie, rumbo = 0, mm = 1, adelante = null, sombra = true, nombre = "persona", owner = "persona" }) {
  const ctx = contexto(P, mm, owner), C = CUERPO;
  const f = [Math.cos(rumbo * D2R), Math.sin(rumbo * D2R), 0], l = [-f[1], f[0], 0], z = [0, 0, 1];
  const B = (ff, ll, zz) => add3(pie, mul3(add3(add3(mul3(f, ff), mul3(l, ll)), mul3(z, zz)), mm));
  const partes = [];
  const col = (lista, X, Y, e, nom, opts) => pieza(nom, lista.map(([zz, a, b, fo]) => ({ c: B(fo, 0, zz), X, Y, a: a * mm, b: b * mm, e })), ctx, opts);
  partes.push(col(C.tronco, l, f, 2.5, `${nombre}.tronco`));
  partes.push({ ...col(C.cuello, l, f, 2.1, `${nombre}.cuello`), encima: [`${nombre}.tronco`] });
  partes.push(col(C.cabeza, l, f, 2.1, `${nombre}.cabeza`));
  for (const s of [1, -1]) {
    const lado = s > 0 ? "izq" : "der";
    // el brazo: hombro, codo, muñeca; el que va adelante, un poco doblado
    const fw = adelante === lado ? 1 : 0;
    const H = B(0, s * C.hombro.l, C.hombro.z), E = B(C.codo.f + fw * 40, s * C.codo.l, C.codo.z + fw * 6), Wr = B(C.muneca.f + fw * 110, s * C.muneca.l, C.muneca.z + fw * 40);
    const seg = (a, b, rs) => rs.map((_, i) => G.lerp3(a, b, i / (rs.length - 1)));
    partes.push(tubo(`${nombre}.brazo-${lado}`, seg(H, E, C.brazo), C.brazo.map((r) => r * mm), ctx, { ref: f }));
    partes.push(tubo(`${nombre}.antebrazo-${lado}`, seg(E, Wr, C.antebrazo), C.antebrazo.map((r) => r * mm), ctx, { ref: f }));
    const dm = unit3(add3(unit3(sub3(Wr, E)), mul3(z, -0.6)));
    partes.push(...partesMano(ctx, { muneca: Wr, dedos: dm, dorso: mul3(l, s), lado, dobla: 1.5, abre: 0.4, nombre: `${nombre}.mano-${lado}` }));
    // la pierna: cadera, rodilla, tobillo; el pie abierto hacia afuera
    const Hc = B(0, s * C.cadera.l, C.cadera.z), K = B(C.rodilla.f, s * C.rodilla.l, C.rodilla.z), Ak = B(C.tobillo.f, s * C.tobillo.l, C.tobillo.z);
    partes.push(tubo(`${nombre}.muslo-${lado}`, C.muslo.map(([t]) => G.lerp3(Hc, K, t)), C.muslo.map(([, r]) => r * mm), ctx, { ref: f }));
    partes.push(tubo(`${nombre}.pierna-${lado}`, C.pierna.map(([t, , b]) => add3(G.lerp3(K, Ak, t), mul3(f, -b * mm))), C.pierna.map(([, r]) => r * mm), ctx, { ref: f }));
    const fp = unit3(add3(mul3(f, Math.cos(C.abrePies * D2R)), mul3(l, s * Math.sin(C.abrePies * D2R)))), lp = cross3(z, fp);
    const base = B(C.tobillo.f, s * C.tobillo.l, 0);
    partes.push(pieza(`${nombre}.pie-${lado}`, C.pie.map(([sp, a, h, zc]) => ({ c: add3(base, mul3(add3(mul3(fp, sp), mul3(z, zc ?? h / 2)), mm)), X: lp, Y: z, a: a * mm, b: (h / 2) * mm, e: 3 })), ctx, { ground: true }));
  }
  // la sombra: una mancha baja en el piso, corrida un poco hacia donde cae la luz
  if (sombra) {
    const Lh = unit3([-ctx.L[0], -ctx.L[1], 0]), c0 = add3(B(-10, 0, 0), mul3(Lh, 60 * mm));
    const ax1 = Lh, ax2 = [-Lh[1], Lh[0], 0], pts = [];
    for (let j = 0; j < 48; j++) { const a = (TAU * j) / 48; pts.push(add3(c0, add3(mul3(ax1, Math.cos(a) * 240 * mm), mul3(ax2, Math.sin(a) * 160 * mm)))); }
    const Fs = { o: sub3(c0, [0, 0, 0.5 * mm]), a: z, u: ax1, v: ax2 };
    const poly = []; for (let j = 0; j < 24; j++) { const a = (TAU * j) / 24; poly.push([Math.cos(a) * 240 * mm, Math.sin(a) * 160 * mm]); }
    const sh = A.prism(Fs, poly, 0, 0.5 * mm, { name: `${nombre}.sombra`, owner, ground: true });
    partes.push({ name: `${nombre}.sombra`, svg: `<path class="ps-sombra" d="${pth(pts.map((p) => k.iso(p, P)))}"/>`, shapes: [sh], ref: c0, bias: -1e6 });
  }
  const u = unir(nombre, partes, ctx);
  u.anclas = {
    CABEZA: B(10, 0, 1690), PECHO: B(60, 0, 1300), CADERA: B(30, 0, 950), PIE: B(150, 0, 20),
    HOMBRO: B(0, C.hombro.l + 40, C.hombro.z), RODILLA: B(55, C.rodilla.l, C.rodilla.z),
  };
  return u;
}

/* ====================================================================
   la prueba: una escena mínima con la persona de pie sobre una losa y una mano al lado de un disco de 190 mm
   ==================================================================== */
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const AUD = process.argv.includes("--audit");
  const salida = join(process.env.PERSONA_OUT || tmpdir(), "persona-prueba.html");
  const vistas = [];
  let fallas = 0;
  const casos = (process.env.PERSONA_CASOS || "persona,mano,borde").split(",");
  for (const caso of casos) {
    const W = 600, H = 600;
    const ext = caso === "persona" ? [[-500, -500, 0], [500, 500, 0], [0, 0, 1750], [-500, 500, 0], [500, -500, 0]] : caso === "mano" ? [[-200, -200, -60], [200, 260, 60], [0, 0, 60]] : [[-170, -170, -40], [170, 170, 40]];
    const cam = { pad: 20, azimuth: caso === "borde" ? 40 : 50, elevation: caso === "persona" ? 24 : caso === "mano" ? 40 : 45 };
    let P = k.fitProjection(ext, W, H, cam);
    // la mano en el borde: la cámara se ajusta también a lo que ocupa la mano (sus pts), como en una figura
    const az = 40 * D2R, th = (Number(process.env.PERSONA_TH) || 50) * D2R;
    const dir = [-Math.cos(az) * Math.cos(th) + Math.sin(az) * Math.sin(th), -Math.sin(az) * Math.cos(th) - Math.cos(az) * Math.sin(th), 0];
    const hacia = mul3(dir, -1);
    const opMano = () => ({ P, borde: [95 * dir[0], 95 * dir[1], 0], hacia, lado: process.env.PERSONA_LADO || "der", ...(process.env.PERSONA_AP ? { abrePulgar: Number(process.env.PERSONA_AP) } : {}), ...(process.env.PERSONA_ALTO ? { alto: Number(process.env.PERSONA_ALTO) } : {}) });
    if (caso === "borde") P = k.fitProjection([...ext, ...manoEnBorde(opMano()).pts], W, H, cam);
    const R = A.recorder(P, { order: [], spring: {} });
    const put = (it) => { for (const sh of it.shapes) R.solid(sh); R.put({ piece: "frame", ride: "frame", name: it.name, at: it.ref, svg: it.svg, shapes: it.shapes, move: [0, 0, 0] }); };
    if (caso === "persona") {
      const per = personaDePie({ P, pie: [0, 0, 0], rumbo: 20, adelante: "izq" });
      put(per);
      console.log("persona:", per.shapes.length, "formas,", per.ciclos, "parejas sin orden claro");
    } else if (caso === "borde") {
      // el mismo disco de 190 mm y la mano derecha que llega desde atrás y apoya las yemas en su canto, atrás a la derecha
      const Fd = { o: [0, 0, -10], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] };
      const sh = A.disc(Fd, 0, 10, 95, { name: "disco", owner: "disco", ground: true });
      R.solid(sh);
      const pts = []; for (let j = 0; j < 64; j++) { const a = (TAU * j) / 64; pts.push([95 * Math.cos(a), 95 * Math.sin(a)]); }
      const svgD = k.solidSvg(k.extrude(pts, -10, 0, P), { tone: "mid" });
      R.put({ piece: "frame", ride: "frame", name: "disco", at: [0, 0, -5], svg: svgD, shapes: [sh], move: [0, 0, 0] });
      const m = manoEnBorde(opMano());
      put(m);
      console.log("mano en el borde:", m.shapes.length, "formas,", m.ciclos, "parejas sin orden claro");
    } else {
      // un disco de 190 mm (el impulsor del capítulo 11) y la mano derecha apoyada a su lado
      const Fd = { o: [0, 0, -10], a: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] };
      const sh = A.disc(Fd, 0, 10, 95, { name: "disco", owner: "disco", ground: true });
      R.solid(sh);
      const pts = []; for (let j = 0; j < 64; j++) { const a = (TAU * j) / 64; pts.push([95 * Math.cos(a), 95 * Math.sin(a)]); }
      const svgD = k.solidSvg(k.extrude(pts, -10, 10, P), { tone: "mid" });
      R.put({ piece: "frame", ride: "frame", name: "disco", at: [0, 0, -5], svg: svgD, shapes: [sh], move: [0, 0, 0] });
      const m = mano({ P, muneca: [150, 230, -10], dedos: [-0.15, -1, 0], dorso: [0, 0, 1], lado: "der" });
      put(m);
      console.log("mano:", m.shapes.length, "formas,", m.ciclos, "parejas sin orden claro");
    }
    A.settle(R, P, { step: 0.75 });
    R.items.sort((a, b) => a.key - b.key);
    const svg = k.figureSvg({ width: W, height: H, label: caso, body: [`<style>${CSS_PERSONA}</style>${R.items.map((it) => `<g class="it" data-name="${it.name}">${it.svg}</g>`).join("")}`] });
    vistas.push(`<div class="iso-stage">${svg}</div>`);
    if (AUD) { const res = A.audit(R, P, {}); console.log(A.report(res)); const n = A.failures(res); fallas += n; console.log(caso + ":", n ? `audit failed: ${n}` : "audit passed"); }
  }
  writeFileSync(salida, k.pageHtml({ title: "Persona", theme: "light", width: 1840, body: `<div style="display:flex">${vistas.join("")}</div>`, script: "" }));
  console.log(salida);
  if (AUD) { console.log(fallas ? `audit failed: ${fallas}` : "audit passed"); if (fallas) process.exitCode = 1; }
}
