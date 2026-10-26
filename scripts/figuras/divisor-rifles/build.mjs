/* ====================================================================
   Divisor de rifles (cuarteador de Jones) en isométrico (skill anatomy), para el capítulo 5 del libro
   de operaciones unitarias (Caracterización de sólidos particulados).
   Concepto: la muestra entra por la tolva de arriba y cae sobre una fila de canaletas iguales que
   desaguan, una sí y una no, hacia lados opuestos. Cada bandeja recibe la mitad de la muestra, y cada
   mitad es representativa porque todas las canaletas cortan la misma corriente a lo ancho.
   Unidades: 1 = 1 mm. x a lo largo de la fila de canaletas, y hacia el lector (el lado de la bandeja
   que se ve), z hacia arriba. Medidas en geo.mjs.
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
const { DR } = await import(join(HERE, "geo.mjs"));
const FAST = process.argv.includes("--fast");

const W = 1000, H = 760;
const { N, w, t, L, Y, zTop, zLow, lip, skirt, hop, endT, leg, pan, heap } = DR;
const EXT = [[-40, -Y - 20, 0], [L + 40, -Y - 20, 0], [-40, pan.y1 + 20, 0], [L + 40, pan.y1 + 20, 0], [-40, -pan.y1 - 20, 0], [L + 40, -pan.y1 - 20, 0],
  ...[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => [sx < 0 ? -endT - hop.rim : L + endT + hop.rim, sy * (Y + t + hop.rim), hop.z1 + 3])];
const P = k.fitProjection(EXT, W, H, { pad: 20, azimuth: DR.AZ, elevation: DR.EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = R_.solid;
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.3, steps = 2, bevel = 0, extra = "", owner } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, owner }, steps));
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style }) + extra, [shape]);
  return shape;
}
// prisma a lo largo de x con una sección cualquiera en (y, z)
const FX = { o: [0, 0, 0], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] };
function px(name, poly, x0, x1, style = {}, { extra = "", owner } = {}) {
  const shape = record(A.prism(FX, poly, x0, x1, { name, owner }));
  const cy = poly.reduce((q, p) => q + p[0], 0) / poly.length, cz = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  put(name, [(x0 + x1) / 2, cy, cz], X.prismSvg(C, poly, x0, x1, { F: FX, tone: "mid", ...style }) + extra, [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", owner, smooth } = {}) {
  const paths = G.solidOf(profile, F, P, smooth !== undefined ? { smooth } : {});
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner }));
  put(name, G.add3(F.o, G.mul3(F.a, mid)), S(paths, { tone: "mid", ...style }) + extra, [shape]);
  return shape;
}
const ZA = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const screws = (pts) => Dots(pts.map(at), { size: 0.45 });

/* ====================================================================
   1 · las canaletas: tabiques cada 25 mm y pisos inclinados a 45°, uno sí y uno no
   ==================================================================== */
// tabiques: los de los extremos son las paredes de la fila
for (let i = 0; i <= N; i++) {
  const x = i * w, half = i === 0 || i === N ? endT / 2 : t / 2;
  const x0 = i === 0 ? -endT : i === N ? L : x - half, x1 = i === 0 ? 0 : i === N ? L + endT : x + half;
  box(`rifle.tab${i}`, [x0, -Y, zLow - lip], [x1, Y, zTop], { tone: i === 0 || i === N ? "mid" : "lo" }, { r: 0.1, owner: "stand.pata0" });
}
// pisos: el de la canaleta i baja hacia +y si i es par y hacia −y si es impar; sale con un labio
const floorPoly = (s) => {
  const yA = -s * Y, yB = s * (Y + lip), zA = zTop, zB = zLow - lip, e = 2.2;
  return s > 0 ? [[yA, zA], [yB, zB], [yB, zB - e], [yA, zA - e]] : [[yB, zB], [yA, zA], [yA, zA - e], [yB, zB - e]];
};
for (let i = 0; i < N; i++) {
  const s = i % 2 === 0 ? 1 : -1;
  const x0 = i * w + (i === 0 ? 0 : t / 2), x1 = (i + 1) * w - (i === N - 1 ? 0 : t / 2);
  px(`rifle.piso${i}`, floorPoly(s), x0, x1, { tone: s > 0 ? "mid" : "lo" }, { owner: `rifle.tab${i}` });
}
// faldones: tapan la parte alta de los costados, para que nada salte de lado; las salidas quedan debajo
[-1, 1].forEach((s, j) => {
  const yi = s * Y, yo = s * (Y + t);
  box(`rifle.falda${j}`, [-endT, Math.min(yi, yo), skirt], [L + endT, Math.max(yi, yo), zTop], { tone: "mid" }, { r: 0.1 });
});

/* ====================================================================
   2 · la tolva de alimentación, con su reborde y la placa
   ==================================================================== */
const YT = Y + t;
box("tolva.p0", [-endT, -YT, zTop], [L + endT, -Y, hop.z1], { tone: "mid" }, { r: 0.1 });
box("tolva.p1", [-endT, Y, zTop], [L + endT, YT, hop.z1], { tone: "mid" }, { r: 0.1 });
box("tolva.e0", [-endT, -Y, zTop], [0, Y, hop.z1], { tone: "mid" }, { r: 0.1 });
box("tolva.e1", [L, -Y, zTop], [L + endT, Y, hop.z1], { tone: "mid" }, { r: 0.1 });
const RB = hop.rim, RZ0 = hop.z1, RZ1 = hop.z1 + 2.5;
box("tolva.reborde0", [-endT - RB, -YT - RB, RZ0], [L + endT + RB, -YT, RZ1], { tone: "mid" }, { r: 0.4 });
box("tolva.reborde1", [-endT - RB, YT, RZ0], [L + endT + RB, YT + RB, RZ1], { tone: "mid" }, { r: 0.4 });
box("tolva.reborde2", [-endT - RB, -YT, RZ0], [-endT, YT, RZ1], { tone: "mid" }, { r: 0.4 });
box("tolva.reborde3", [L + endT, -YT, RZ0], [L + endT + RB, YT, RZ1], { tone: "mid" }, { r: 0.4 });
// placa de identificación en la cara que mira al lector, con tres renglones
{
  const x0 = L * 0.62, x1 = L * 0.62 + 70, z0 = zTop + 14, z1 = zTop + 40, y = YT;
  box("tolva.placa", [x0, y, z0], [x1, y + 1, z1], { tone: "hi" }, { r: 0.6, extra:
    [0.32, 0.52, 0.72].map((f, i) => Ln(path3([[x0 + 8, y + 1, z1 - (z1 - z0) * f], [x0 + (i === 2 ? 40 : 62), y + 1, z1 - (z1 - z0) * f]]), { tone: "lo", free: true })).join("") +
    screws([[x0 + 3, y + 1, z0 + 3], [x1 - 3, y + 1, z0 + 3], [x0 + 3, y + 1, z1 - 3], [x1 - 3, y + 1, z1 - 3]]) });
}

/* ====================================================================
   3 · los extremos: patas de tubo cuadrado, travesaños y asas
   ==================================================================== */
[0, 1].forEach((e) => {
  const xa = e === 0 ? -endT - leg : L + endT, xb = xa + leg;
  [-1, 1].forEach((s, j) => {
    const ya = s * (Y - 4) - leg / 2, yb = ya + leg;
    box(`stand.pata${e}${j}`, [xa, ya, 0], [xb, yb, zTop], { tone: "lo" }, { r: 0.3, extra: screws([[xa + leg / 2, s > 0 ? yb : ya, zLow + 20], [xa + leg / 2, s > 0 ? yb : ya, zTop - 20]].map(([a, b, c]) => [e === 0 ? xa : xb, b, c])) });
  });
  box(`stand.trav${e}`, [xa, -(Y - 4) + leg / 2, 8], [xb, (Y - 4) - leg / 2, 8 + leg], { tone: "lo" }, { r: 0.3 });
  // asa en U sobre la cara de afuera de la pared del extremo
  const xo = e === 0 ? -endT : L + endT, sg = e === 0 ? -1 : 1, za = zTop - 12, d = 18, xe = xo + sg * d, wall = e === 0 ? "rifle.tab0" : `rifle.tab${N}`;
  box(`asa${e}.a`, [Math.min(xo, xe), -26, za - 4], [Math.max(xo, xe), -18, za + 4], { tone: "mid" }, { r: 1, owner: wall });
  box(`asa${e}.b`, [Math.min(xo, xe), 18, za - 4], [Math.max(xo, xe), 26, za + 4], { tone: "mid" }, { r: 1, owner: wall });
  box(`asa${e}.c`, [Math.min(xe - sg * 6, xe), -18, za - 4], [Math.max(xe - sg * 6, xe), 18, za + 4], { tone: "mid" }, { r: 1, owner: `asa${e}.a` });
});

/* ====================================================================
   4 · las dos bandejas, con su mitad de la muestra
   ==================================================================== */
[-1, 1].forEach((s, j) => {
  const ya = s > 0 ? pan.y0 : -pan.y1, yb = s > 0 ? pan.y1 : -pan.y0, x0 = pan.x0, x1 = pan.x1, h = pan.h, e = 1.5;
  const n = `bandeja${j}`;
  box(`stand.${n}.fondo`, [x0, ya, 0], [x1, yb, e], { tone: "lo" }, { r: 2 });
  box(`${n}.p0`, [x0, ya, e], [x0 + e, yb, h], { tone: "mid" }, { r: 0.2, owner: `stand.${n}.fondo` });
  box(`${n}.p1`, [x1 - e, ya, e], [x1, yb, h], { tone: "mid" }, { r: 0.2, owner: `stand.${n}.fondo` });
  box(`${n}.p2`, [x0 + e, ya, e], [x1 - e, ya + e, h], { tone: "mid" }, { r: 0.2, owner: `stand.${n}.fondo` });
  box(`${n}.p3`, [x0 + e, yb - e, e], [x1 - e, yb, h], { tone: "mid" }, { r: 0.2, owner: `stand.${n}.fondo` });
  // asa de la bandeja en la pared de afuera
  const yo = s > 0 ? yb : ya;
  box(`${n}.asa`, [L / 2 - 30, Math.min(yo, yo + s * 10), h - 14], [L / 2 + 30, Math.max(yo, yo + s * 10), h - 8], { tone: "mid" }, { r: 1.2, owner: `${n}.p${s > 0 ? 3 : 2}` });
  // la mitad de la muestra: un montón bajo en el centro de la bandeja
  const prof = [[0, heap.r], [heap.h * 0.12, heap.r * 0.86, 1], [heap.h * 0.55, heap.r * 0.42, 1], [heap.h * 0.9, heap.r * 0.1, 1], [heap.h, 0.6]];
  // granos sobre la cara del montón que mira al lector
  const granos = [];
  const rOf = (zz) => { for (let q = 1; q < prof.length; q++) if (zz <= prof[q][0]) { const f = (zz - prof[q - 1][0]) / (prof[q][0] - prof[q - 1][0]); return prof[q - 1][1] + f * (prof[q][1] - prof[q - 1][1]); } return 0; };
  let seed = 7 + j;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let q = 0; q < 180; q++) { const zz = heap.h * 0.85 * Math.sqrt(rnd()), th = (Math.PI / 4) + (rnd() - 0.5) * Math.PI * 0.95, rr = rOf(zz) - 0.3; granos.push([L / 2 + rr * Math.cos(th + Math.PI / 2), s * heap.y + rr * Math.sin(th + Math.PI / 2), e + zz]); }
  turned(`${n}.monton`, ZA([L / 2, s * heap.y, e]), prof, { tone: "lo" }, { owner: `stand.${n}.fondo`, extra: Dots(granos.map(at), { size: 0.6, tone: "mid" }) });
});

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
const svg = k.figureSvg({ width: W, height: H, label: "Divisor de rifles: la tolva de alimentación sobre una fila de doce canaletas que desaguan, una sí y una no, hacia dos bandejas, cada una con la mitad de la muestra", body: [`<g class="dr-items">${groups.join("")}</g>`] });
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "out", "fig.svg"), svg);
writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Divisor de rifles", theme: "light", width: 1000, body: `<div class="iso-stage">${svg}</div>`, script: "" }));
const ANCLAS = { TOLVA: [L * 0.25, -Y, hop.z1], CANALETA: [w * 2.5, Y + lip * 0.5, zLow - lip * 0.5], TABIQUE: [w * 5, Y, skirt - 10], BANDEJA: [L * 0.8, pan.y1, pan.h * 0.5], MONTON: [L / 2, heap.y, heap.h * 0.6], PLACA: [L * 0.62 + 35, YT + 1, zTop + 27], PATA: [-endT - leg / 2, Y - 4, zLow * 0.5], ASA: [-endT - leg - 18, 0, zTop - 10] };
writeFileSync(join(HERE, "divisor_data.json"), JSON.stringify({ P, W, H, ANCLAS, DR }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
if (!FAST) A.auditOrExit(R_, P, {});
