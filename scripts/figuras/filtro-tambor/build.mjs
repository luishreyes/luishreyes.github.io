/* ====================================================================
   El filtro de tambor rotatorio al vacío en isométrico (skill anatomy).
   Concepto: el tambor gira con su parte baja sumergida en la artesa; el
   vacío interior arrastra el líquido a través de la tela y la torta crece
   mientras la franja está sumergida (t = f/n). Al salir, las regaderas la
   lavan, el aire la seca y la cuchilla la pela justo antes de que la
   franja vuelva a entrar. La torta cae por la canaleta a una banda.
   Corte: el tambor, la artesa y la banda se cortan por un plano normal al
   eje (y = 0), a 60 cm de la cabeza cercana, que se quita: se ven la
   sección del tambor (camisa, cubierta con sus sectores, los tubos de
   drenaje que van a la válvula y la araña), la sección de la torta con su
   espesor en cada punto de la vuelta y el nivel de la suspensión.
   Unidades: 1 = 1 cm; el tambor es de 1,8 m de diámetro, eje a lo largo de y.
   ==================================================================== */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
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

if (process.argv.includes("--js")) {
  const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
  writeFileSync(join(HERE, "out", "fig.js"), "/* filtro de tambor en isométrico: generado por build.mjs */\nvar FD_DATA = " + readFileSync(join(HERE, "drum_data.json"), "utf8") + ";\nvar FDrum = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FDrum;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), readFileSync(join(HERE, "fd.css"), "utf8"));
  const LV = readFileSync(join(HERE, "out", "fig.js"), "utf8") + readFileSync(join(HERE, "drive_test.js"), "utf8").replace("__FDCSS__", JSON.stringify(readFileSync(join(HERE, "fd.css"), "utf8") + readFileSync(join(HERE, "../filtro-prensa/fp.css"), "utf8")));
  writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Filtro de tambor", theme: "light", width: 980, body: `<div class="iso-stage">${readFileSync(join(HERE, "out", "fig.svg"), "utf8")}</div>`, script: LV }));
  console.log("out/fig.js, out/fig.css, preview.html"); process.exit(0);
}

const W = 680, H = 400, AZ = +(process.env.AZ || 70), EL = +(process.env.EL || 26);
const { R, ZD, L, RI, TW } = GEO.DG, RO = RI + TW, ZTOP = GEO.DG.ZTOP, BELT = GEO.DG.BELT;
const F_REF = 0.33;

const EXT = [[-215, -175, 0], [-215, 10, 0], [-215, -150, 135], [182, 4, 0], [182, -130, 0], [182, 0, 96], [0, 0, 272], [0, -130, 272], [-130, -170, 150]];
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const V = G.viewOf(P);
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = R_.solid;
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", ground } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground }, steps));
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style }) + extra, [shape]);
  return shape;
}
// prisma a lo largo de y con sección (x, z) cualquiera
function yp(name, poly, y0, y1, style = {}, { extra = "", live = null, skip = null, ground, cls = "" } = {}) {
  const F = G.frameOf([0, y0, 0], [0, 1, 0], [1, 0, 0], [0, 0, 1]);
  const shape = record(A.prism(F, poly, 0, y1 - y0, { name, ground }));
  const xs = poly.map((p) => p[0]), zs = poly.map((p) => p[1]);
  const ref = [(Math.min(...xs) + Math.max(...xs)) / 2, (y0 + y1) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
  const svg = live ? "" : X.prismSvg(C, poly, y0, y1, { axis: "y", tone: "mid", ...style, skip, cls }) + extra;
  put(name, ref, svg, [shape], live ? { live } : {});
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", rims, owner, ground } = {}) {
  const paths = G.solidOf(profile, F, P, rims ? { rims } : {});
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ground }));
  put(name, G.add3(F.o, G.mul3(F.a, mid)), S(paths, { tone: "mid", ...style }) + extra, [shape]);
  return shape;
}
const disc = (name, F, s0, s1, r, style = {}, options = {}) => turned(name, F, [[s0, r], [s1, r]], style, options);
const XA = (o) => G.frameOf(o, [1, 0, 0], [0, 1, 0], [0, 0, 1]);
const YA = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
const ZA = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
function tubeItems(name, route, r, { tone = "hi", maxLength = 26, gaps = [] } = {}) {
  R_.route(name, route, r, { owner: name, gaps, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: Math.max(0.8, Math.min(2.4, r * 0.5)), gaps }).forEach((part, index) =>
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: tubeSvg(part, { tone }), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] }));
}
function pipe(name, control, r, { bend = 3, tone = "hi", flanges = [true, true], flangeR = 1.6 } = {}) {
  const line = G.fillet(control, Math.max(r * bend, 3), 12, { P, tube: r });
  const total = G.pathLength(line), gaps = [];
  [[0, -1], [total, 1]].forEach(([along, sign], index) => {
    if (!flanges[index]) return;
    const thick = Math.max(0.9, r * 0.5), tangent = G.tangentAlong(line, along);
    const centre = G.add3(G.pointAlong(line, along), G.mul3(tangent, (-sign * thick) / 2));
    gaps.push(sign < 0 ? [0, thick] : [total - thick, total]);
    disc(`${name}.flange${index}`, G.frameAlong(centre, tangent), -thick / 2, thick / 2, r * flangeR, { tone }, { owner: name });
  });
  tubeItems(name, line, r, { tone, gaps });
  return line;
}
const arc = (r, a0, a1, n, cz = ZD) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return [r * Math.cos(a), cz + r * Math.sin(a)]; });
const D2R = Math.PI / 180;

/* ====================================================================
   1 · la artesa: parte izquierda y fondo (fijos), pared del fondo, cunas
   ==================================================================== */
const Y0 = -126, YE = -128;
// pared izquierda y fondo hasta 300°: el resto (pared derecha) sube con el nivel y se dibuja en vivo
const VAT_L = [[-RI, ZTOP], [-RI, ZD], ...arc(RI, 180 * D2R, 300 * D2R, 30).slice(1), ...arc(RO, 300 * D2R, 180 * D2R, 30), [-RO, ZD], [-RO, ZTOP]];
yp("vat.left", VAT_L, Y0, 0, { tone: "mid" });
box("vat.lip", [-RO - 3.5, Y0, ZTOP], [-RI, 0, ZTOP + 1.4], { tone: "mid" }, { r: 0.2 });
// pared del fondo en dos mitades, con la boca del muñón
yp("vat.end", [...arc(RO, 180 * D2R, 360 * D2R, 36), [RO, ZTOP], [-RO, ZTOP]], YE, Y0, { tone: "mid" }, { extra: Dots([-90, -60, -30, 30, 60, 90].map((x) => at([x, Y0, ZTOP - 4])), { size: 0.45 }) });
// cunas y patas
for (const [yy, nm] of [[-112, "s0"], [-16, "s1"]]) {
  const top = arc(RO, -35 * D2R, -145 * D2R, 24);
  const plateFx = nm === "s1" ? (() => { const x0 = -30, x1 = 30, z0 = 18, z1 = 34, yf = yy + 3; const rules = [23, 26.5, 30].map((z) => path3([[x0 + 0.25, yf, z], [x1 - 0.25, yf, z]])).join(""); return Ln(path3([[x0, yf, z0], [x1, yf, z0], [x1, yf, z1], [x0, yf, z1]], true), { tone: "mid" }) + Ln(rules, { tone: "faint" }) + k.faceTextSvg(k.sideMatrix([x0 + 1.4, yf], z1 - 1.2, P, "left"), "FILTRO ROTATORIO", { size: 2.2, tone: "mid" }) + Dots([[x0 + 1, z0 + 1], [x1 - 1, z0 + 1], [x0 + 1, z1 - 1], [x1 - 1, z1 - 1]].map(([x, z]) => at([x, yf, z])), { size: 0.4 }); })() : "";
  const boltsFx = Dots([-70, -40, 40, 70].map((x) => at([x, yy + 3, 6])), { size: 0.5 });
  yp(`stand.cradle.${nm}`, [[-86, 2], [86, 2], [86, top[0][1]], ...top, [-86, top[top.length - 1][1]]], yy - 3, yy + 3, { tone: "lo" }, { extra: plateFx + boltsFx });
  for (const x of [-92, 76]) box(`stand.foot.${nm}${x}`, [x, yy - 6, 0], [x + 16, yy + 6, 2], { tone: "lo" }, { r: 0.6, extra: Dots([at([x + 2.5, yy - 3.5, 2]), at([x + 13.5, yy + 3.5, 2])], { size: 0.5 }) });
}

/* ====================================================================
   2 · el tambor: camisa, cabeza lejana, muñón, chumacera y válvula
   ==================================================================== */
const DF = YA([0, -L, ZD]);
turned("drum", DF, [[0, R], [L, R]], { tone: "mid" }, {});
disc("drum.head", DF, -3, 0, R - 2, {}, { extra: "" });
// muñón: dentro de la artesa hasta la pared del fondo; afuera, prensaestopas, chumacera y válvula
disc("drum.trunnion", YA([0, Y0, ZD]), 0, -Y0 - L - 3, 8, { tone: "hi" });
disc("vat.gland", YA([0, YE - 4, ZD]), 0, 4, 13, {}, { owner: "vat.end" });
disc("drum.shaft.out", YA([0, -142, ZD]), 0, 142 + YE - 4, 8, { tone: "hi" });
disc("bearing", YA([0, -152, ZD]), 0, 10, 16, {}, {});
disc("drum.shaft.end", YA([0, -168, ZD]), 0, 16, 8, { tone: "hi" });
box("bearing.pedestal", [-18, -154, 0], [18, -140, ZD - 16], { tone: "mid" }, { r: 0.6, extra: Dots([at([-14, -140, 4]), at([14, -140, 4])], { size: 0.5 }) });
turned("valve", YA([0, -186, ZD]), [[0, 10], [2, 16], [16, 16], [18, 12]], {}, { rims: "all" });
// vacío: de la válvula al tanque de filtrado y a la bomba de vacío
const RX = -178, RY = -150;
turned("rcv.shell", ZA([RX, RY, 0]), [[2, 18], [120, 18]], { tone: "mid" }, {});
disc("rcv.nozzle.vac", ZA([RX - 7, RY, 119.6]), 0, 3.4, 3.2, {}, { owner: "rcv.shell" });
disc("rcv.nozzle.pump", YA([RX + 8, RY + Math.sqrt(18 * 18 - 64) - 0.3, 100]), 0, 3.5, 2.4, {}, { owner: "rcv.shell" });
for (let a = 0; a < 3; a++) { const t = (a * 2 * Math.PI) / 3 + 0.4; box(`stand.rcv.leg${a}`, [RX + Math.cos(t) * 15 - 1.2, RY + Math.sin(t) * 15 - 1.2, 0], [RX + Math.cos(t) * 15 + 1.2, RY + Math.sin(t) * 15 + 1.2, 2], { tone: "lo" }); }
disc("valve.port", ZA([0, -177, ZD + 15.7]), 0, 3, 3.2, {}, { owner: "valve" });
pipe("pipe.vacuum", [[0, -177, ZD + 18.7], [0, -177, ZD + 32], [RX - 7, -177, ZD + 32], [RX - 7, RY, ZD + 32], [RX - 7, RY, 123]], 2.4, { flanges: [false, false] });
const PUMP = { x: -160, y: -100 };
box("stand.vpump.base", [PUMP.x - 22, PUMP.y - 10, 0], [PUMP.x + 22, PUMP.y + 10, 2], { tone: "lo" }, { r: 0.6 });
turned("vpump.body", XA([PUMP.x - 18, PUMP.y, 14]), [[0, 10], [16, 10], [18, 6]], {}, {});
turned("vpump.motor", XA([PUMP.x + 2, PUMP.y, 14]), [[0, 8], [18, 8], [20, 5]], {}, {});
box("vpump.foot0", [PUMP.x - 14, PUMP.y - 5, 2], [PUMP.x - 4, PUMP.y + 5, 4.1], { tone: "lo" }, {});
box("vpump.foot1", [PUMP.x + 6, PUMP.y - 5, 2], [PUMP.x + 16, PUMP.y + 5, 6.1], { tone: "lo" }, {});
pipe("pipe.vpump", [[RX + 8, RY + 19.4, 100], [RX + 8, PUMP.y, 100], [RX + 8, PUMP.y, 24]], 1.6, { flanges: [false, false], bend: 5 });
// alimentación: bomba al piso y tubo a la pared izquierda de la artesa
const FP = { x: -170, y: -40 };
box("stand.fpump.base", [FP.x - 16, FP.y - 9, 0], [FP.x + 16, FP.y + 9, 2], { tone: "lo" }, { r: 0.6 });
turned("fpump.body", YA([FP.x, FP.y - 8, 14]), [[0, 10], [10, 10], [12, 6]], {}, {});
disc("fpump.port", ZA([FP.x, FP.y - 2, 23.7]), 0, 3, 2.8, {}, { owner: "fpump.body" });
pipe("pipe.feed", [[FP.x, FP.y - 2, 26.7], [FP.x, FP.y - 2, ZTOP - 16], [-RO, FP.y - 2, ZTOP - 16]], 2.2, { flanges: [false, true] });

/* ====================================================================
   3 · la banda transportadora (cortada en y = 0)
   ==================================================================== */
const CVX = [132, 172];
box("conv.belt", [CVX[0], -122, BELT - 0.7], [CVX[1], 0, BELT], { tone: "mid" }, { r: 0, extra: `<path data-live="belt" class="iso-line" data-tone="lo" style="stroke-dasharray:2 6" d="${path3([[CVX[1], 0, BELT - 0.35], [CVX[1], -122, BELT - 0.35]])}"/>` });
box("conv.return", [CVX[0], -122, BELT - 9.4], [CVX[1], 0, BELT - 8.7], { tone: "lo" }, { r: 0 });
disc("conv.drum", XA([CVX[0], -122 - 4.4, BELT - 4.7]), 0, CVX[1] - CVX[0], 4.7, {}, {});
for (const [x0, x1] of [[CVX[0] - 4, CVX[0]], [CVX[1], CVX[1] + 4]]) box(`conv.rail${x0}`, [x0, -130, BELT - 12], [x1, 0, BELT + 3], { tone: "mid" }, { r: 0.2 });
for (const yy of [-118, -14]) for (const x0 of [CVX[0] - 4, CVX[1]]) box(`stand.conv.leg${x0}${yy}`, [x0, yy - 2, 0], [x0 + 4, yy + 2, BELT - 12], { tone: "lo" }, { r: 0.3 });

/* ====================================================================
   4 · lo que depende del caso, grabado en el caso de referencia (f = 0,33)
   ==================================================================== */
const PROF = Array.from({ length: 121 }, (_, i) => { const phi = i / 120; return phi <= F_REF ? 6 * Math.sqrt(phi / F_REF) : (phi <= 0.94 ? 6 : 0); });
const PL = GEO.pools(PROF, F_REF);
yp("pool.left", PL.left, Y0, 0, {}, { live: "pool.left" });
const band = GEO.cakeBand(PROF, F_REF, 0.52, 0.94, 40);
yp("cake", band.poly, -L, 0, {}, { live: "cake" });
yp("pool.right", PL.right, Y0, 0, {}, { live: "pool.right" });
{
  const VR = GEO.vatRight(F_REF);
  yp("vat.lower", VR.back, Y0, 0, {}, { live: "vat.lower" });
  if (VR.front) yp("vat.front", VR.front, Y0, 0, {}, { live: "vat.right" });
  yp("vat.upper", VR.upper, Y0, 0, {}, { live: VR.front ? "vat.upper.ref" : "vat.right" });
}
const KN = GEO.knifeOf(F_REF);
yp("knife", KN.blade, -L, 0, {}, { live: "knife" });
yp("knife.holder", KN.holder, -L, 0, {}, { live: "knife.holder" });
KN.chute.slice(0, -1).forEach((p, i) => yp(`chute${i}`, GEO.plate(p, KN.chute[i + 1], 1, -1), -L - 2, 0, {}, { live: `chute${i}` }));

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const idx = (name) => R_.items.findIndex((it) => it.name === name);
const after = new Map();
const slot = (name, html) => { const i = idx(name); if (i < 0) throw new Error("no item " + name); after.set(i, (after.get(i) || "") + html); };
// la sección del tambor en el plano de corte: gira con el tambor (matriz del plano y = 0)
const EX = k.axisVector(P, [1, 0, 0]), EY = k.axisVector(P, [0, 1, 0]), EZ = k.axisVector(P, [0, 0, 1]), O = at([0, 0, ZD]);
const PLANE = `matrix(${EX[0].toFixed(4)} ${EX[1].toFixed(4)} ${EZ[0].toFixed(4)} ${EZ[1].toFixed(4)} ${O[0].toFixed(3)} ${O[1].toFixed(3)})`;
slot("drum", `<g data-live="drum.lines"></g>`);
// detrás del plano de corte: las regaderas; delante: la cara cortada de la torta y la sección del tambor
slot("cake", `<g data-live="wash"></g><g data-live="sprays"></g><g data-live="cake.cap"></g><g class="fd-sec" transform="${PLANE}"><g data-live="section"></g></g>`);
slot("knife", `<g data-live="peel"></g>`);
slot(R_.items[Math.max(idx("chute0"), idx("chute1"), idx("conv.belt"))].name, `<g data-live="chunks"></g>`);
slot("pool.right", `<g class="fd-sec" transform="${PLANE}"><g data-live="agitator"></g></g>`);
const groups = R_.items.map((item, index) => {
  const body = item.live ? `<g data-live="${item.live}"></g>` : item.svg;
  return `<g class="it" data-name="${item.name}">${body}${after.get(index) ?? ""}</g>`;
});
const svg = k.figureSvg({ width: W, height: H, label: "Filtro de tambor rotatorio al vacío en corte", body: [`<g class="fd-items">${groups.join("")}</g>`, `<g data-live="flows"></g>`] });
const DATA = { P, W, H, EX, EY, EZ, O, PLANE, Y0, L, CVX, BELT, F_REF };
mkdirSync(join(HERE, "out"), { recursive: true });
writeFileSync(join(HERE, "drum_data.json"), JSON.stringify(DATA));
writeFileSync(join(HERE, "out", "fig.svg"), svg.replace("<svg ", '<svg id="fdSvg" '));
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
const bundle = (data) => "/* filtro de tambor en isométrico: generado por build.mjs */\nvar FD_DATA = " + data + ";\nvar FDrum = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FDrum;\n})();\n";
writeFileSync(join(HERE, "out", "fig.js"), bundle(JSON.stringify(DATA)));
writeFileSync(join(HERE, "out", "fig.css"), readFileSync(join(HERE, "fd.css"), "utf8"));
const LIVE = readFileSync(join(HERE, "out", "fig.js"), "utf8") + readFileSync(join(HERE, "drive_test.js"), "utf8").replace("__FDCSS__", JSON.stringify(readFileSync(join(HERE, "fd.css"), "utf8") + readFileSync(join(HERE, "../filtro-prensa/fp.css"), "utf8")));
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Filtro de tambor", theme: "light", width: 980, body: `<div class="iso-stage">${svg}</div>`, script: LIVE }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
if (!FAST) A.auditOrExit(R_, P, {});
