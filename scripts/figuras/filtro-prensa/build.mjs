/* ====================================================================
   El filtro prensa de placas en isométrico (skill anatomy).
   Concepto: la prensa misma es la explicación. La bomba de diafragma
   empuja la suspensión por el canal central de las placas; el filtrado
   atraviesa la torta y la tela, baja por la cara de cada placa y sale por
   el canal inferior hacia el tanque de filtrado; la torta crece desde las
   dos telas de cada cámara. En la descarga el cilindro retira el cabezal
   móvil, las placas se corren una por una y cada torta cae a la tolva.
   Corte: el cabezal fijo, las placas, el cabezal móvil y la tolva se
   dibujan en media sección por el eje (y = 0), sin la barra lateral
   delantera. Bomba, tubos, cilindro y cabezal trasero van enteros.
   Unidades: 1 = 1 cm, x a lo largo de la prensa, z hacia arriba.
   Placas: 77 cm de lado, cámaras de 32 mm y paso de 6,7 cm (cámara +
   35 mm de alma). Se dibujan 8 placas de las N del caso.
   ==================================================================== */
import { writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL("../../../.claude/skills/anatomy", import.meta.url));
const k = await import(KIT + "/kit/iso-kit.mjs");
const G = await import(KIT + "/kit/lathe.mjs");
const { tubePieces, tubeSvg } = await import(KIT + "/kit/tube.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const { kitScript } = await import(KIT + "/scripts/inline-kit.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const X = await import(join(HERE, "xprism.mjs"));

// --js: solo vuelve a escribir out/fig.js (el código en vivo) y out/fig.css con los datos de la última salida ordenada
if (process.argv.includes("--js")) {
  const xs = readFileSync(join(HERE, "xprism.mjs"), "utf8").replace(/^export /gm, "");
  writeFileSync(join(HERE, "out", "fig.js"), "/* filtro prensa en isométrico: generado por build.mjs */\n" + xs + "\nvar FP_DATA = " + readFileSync(join(HERE, "press_data.json"), "utf8") + ";\n" + readFileSync(join(HERE, "live.js"), "utf8"));
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "fp.css"), "utf8") + "\n" + readFileSync(join(HERE, "fp-theme.css"), "utf8"));
  console.log("out/fig.js, out/fig.css"); process.exit(0);
}
const W = 680, H = 400, AZ = +(process.env.AZ || 70), EL = +(process.env.EL || 26);
const FAST = process.argv.includes("--fast");

/* ---------- medidas ---------- */
const NPL = 8, PT = 6.7, DEPTH = 3.2, POCK = DEPTH / 2, WEB = PT - DEPTH;
const HALF = 38.5, RIM = 5, RIMB = 7;
const ZB = 50, ZT = 127, ZC = (ZB + ZT) / 2, RC = 4, ZF = ZB + 3.3, RF = 1.7;
const YR = -HALF + RIM, ZR0 = ZB + RIMB, ZR1 = ZT - RIM;   // la cámara: y ∈ [YR, 0], z ∈ [ZR0, ZR1]
const X0 = 15, XH = X0 - POCK;                              // cara del cabezal fijo y fondo de su bolsillo
const XPF = X0 + NPL * PT, FOLW = 10, XFP = XPF + POCK, XFB = XPF + FOLW;
const HEAD = { y0: -44, z0: 44, z1: 133 };
const BAR = { y0: -50, y1: -44, z0: 116, z1: 122 };
const XRH = 131, RHW = 9;
const TRAVEL = 45, GAP = 5;
const EYE = { zc: ZC, r: RC }, DRAIN = { zc: ZF, r: RF, steps: 6 };
const plateX0 = (i) => X0 + i * PT, webX = (i) => plateX0(i) + PT / 2;
// paredes de cada cámara j (0…NPL): izquierda y derecha
const wallL = (j) => (j === 0 ? XH : webX(j - 1) + WEB / 2);
const wallR = (j) => (j === NPL ? XFP : webX(j) - WEB / 2);
const rideL = (j) => (j === 0 ? "frame" : "pl" + (j - 1));
const rideR = (j) => (j === NPL ? "follower" : "pl" + j);

const EXT = [[-109, -61, 0], [-109, -27, 104], [-68, 27, 0], [196, -36, 0], [196, 0, 102], [196, 0, 60], [140, 0, 0], [140, 0, 139], [0, -50, 139], [-20, -50, 139]];
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const V = G.viewOf(P);
const KS = G.scaleOf(P);
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);

/* ---------- desarme: el cabezal móvil y luego las placas, de la última a la primera ---------- */
const PIECES = { frame: [0, 0, 0], follower: [TRAVEL, 0, 0] };
for (let i = 0; i < NPL; i++) PIECES["pl" + i] = [GAP * (i + 1), 0, 0];
const STAGGER = ["follower", ...Array.from({ length: NPL }, (_, i) => "pl" + (NPL - 1 - i))];
const SPRING = { stagger: 0.32, stiffness: 46, damping: 13.6, substeps: 4 };

const R = A.recorder(P, { order: STAGGER, spring: SPRING });
const record = R.solid;
function put(piece, name, ref, svg, shapes = [], { bias = 0, ride, ...rest } = {}) {
  return R.put({ piece, ride: ride ?? piece, name, at: ref, bias, svg, shapes, move: PIECES[ride ?? piece], ...rest });
}
function box(piece, name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", inner = "", bias = 0, ride, ground } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground }, steps));
  put(piece, name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, ride });
  return shape;
}
// prisma a lo largo de x con sección (y, z) cualquiera
function xp(piece, name, poly, x0, x1, style = {}, { extra = "", bias = 0, ride, cls = "" } = {}) {
  const F = G.frameOf([x0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
  const shape = record(A.prism(F, poly, 0, x1 - x0, { name }));
  const ys = poly.map((p) => p[0]), zs = poly.map((p) => p[1]);
  const ref = [(x0 + x1) / 2, (Math.min(...ys) + Math.max(...ys)) / 2, (Math.min(...zs) + Math.max(...zs)) / 2];
  put(piece, name, ref, X.xPrismSvg(C, poly, x0, x1, { tone: "mid", ...style, cls }) + extra, [shape], { bias, ride });
  return shape;
}
const rect = (y0, z0, y1, z1) => [[y0, z0], [y1, z0], [y1, z1], [y0, z1]];
const halfDisc = (zc, r, steps = 16) => X.halfOct(zc, r, steps);
// rayado de corte a 45° sobre las caras cortadas (y = 0) de las piezas de acero
function hatch(x0, x1, bands, gap = 2.6) {
  const out = [];
  for (const [z0, z1] of bands) for (let c = x0 - (z1 - z0) + gap / 2; c < x1; c += gap) {
    // recta x - z' = c con z' = z - z0, recortada al rectángulo
    const a = [Math.max(x0, c), 0, z0 + Math.max(x0, c) - c], b = [Math.min(x1, c + (z1 - z0)), 0, z0 + Math.min(x1, c + (z1 - z0)) - c];
    if (b[0] - a[0] > 0.4) out.push(path3([a, b]));
  }
  return Ln(out.join(""), { tone: "faint" });
}
function turned(piece, name, F, profile, style = {}, { extra = "", inner = "", bias = 0, smooth, steps, rims, bevel = 0, owner, ride, ground } = {}) {
  const opts = { bevel, ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(rims ? { rims } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ground }));
  put(piece, name, G.add3(F.o, G.mul3(F.a, mid)), S(paths, { tone: "mid", ...style, inner }) + extra, [shape], { bias, ride });
  return shape;
}
const disc = (piece, name, F, s0, s1, r, style = {}, options = {}) => turned(piece, name, F, [[s0, r], [s1, r]], style, options);
const XA = (o) => G.frameOf(o, [1, 0, 0], [0, 1, 0], [0, 0, 1]);
const YA = (o) => G.frameOf(o, [0, 1, 0], [0, 0, 1], [1, 0, 0]);
const ZA = (o) => G.frameOf(o, [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const bolts = (F, s, r, n, { phase = 0, size = 0.42, tone = "mid" } = {}) => Dots(G.dotsOf(F, s, r, n, P, { phase }), { size, tone });

function tubeItems(piece, name, route, r, { tone = "hi", bias = 0, maxLength = 26, spacing, gaps = [], ends = [true, true], rims, ride } = {}) {
  R.route(name, route, r, { owner: name, gaps, ends, rims, piece, move: PIECES[ride ?? piece], ride: ride ?? piece });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(0.8, Math.min(2.4, r * 0.5)), gaps }).forEach((part, index) =>
    R.put({ piece, ride: ride ?? piece, at: part.mid, bias, svg: tubeSvg(part, { tone }), move: PIECES[ride ?? piece], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] }));
}
function pipe(piece, name, control, r, { bend = 2.6, tone = "hi", flanges = [true, true], flangeR = 1.6, ...rest } = {}) {
  const line = G.fillet(control, Math.max(r * bend, 3), 12, { P, tube: r });
  const total = G.pathLength(line);
  const gaps = [];
  [[0, -1], [total, 1]].forEach(([along, sign], index) => {
    if (!flanges[index]) return;
    const thick = Math.max(0.9, r * 0.5);
    const tangent = G.tangentAlong(line, along);
    const centre = G.add3(G.pointAlong(line, along), G.mul3(tangent, (-sign * thick) / 2));
    gaps.push(sign < 0 ? [0, thick] : [total - thick, total]);
    const F = G.frameAlong(centre, tangent);
    disc(piece, `${name}.flange${index}`, F, -thick / 2, thick / 2, r * flangeR, { tone }, { owner: name, extra: r > 2 ? bolts(F, G.dot3(F.a, V) > 0 ? thick / 2 : -thick / 2, r * flangeR * 0.74, 6) : "" });
  });
  tubeItems(piece, name, line, r, { tone, gaps, rims: flanges.map((f) => (f ? r * flangeR : r)), ...rest });
  return line;
}

/* ====================================================================
   1 · bastidor
   ==================================================================== */
// cabezal fijo en media sección: la boca de alimentación al centro y la de filtrado abajo
xp("frame", "head.body", X.notched(HEAD.y0, HEAD.z0, HEAD.z1, [EYE, DRAIN]), 0, XH, { tone: "mid" }, { extra: hatch(0, XH, [[HEAD.z0, ZF - RF], [ZF + RF, ZC - RC], [ZC + RC, HEAD.z1]]) });
box("frame", "head.rim.back", [XH, -HALF, ZR0], [X0, YR, ZR1], {}, { r: 0.2 });
xp("frame", "head.rim.bottom", X.notched(-HALF, ZB, ZR0, [DRAIN]), XH, X0);
box("frame", "head.rim.top", [XH, -HALF, ZR1], [X0, 0, ZT], {}, { r: 0.2 });
box("frame", "head.leg", [1, -42, 2], [9, -32, HEAD.z0], {}, { r: 0.6 });
box("frame", "head.leg.gusset", [2, -32, 32], [8, -28, HEAD.z0], { tone: "lo" }, { r: 0.3 });
box("frame", "stand.head.foot", [-4, -46, 0], [14, -28, 2], { tone: "lo" }, { r: 1, extra: Dots([at([-2, -44, 2]), at([12, -44, 2]), at([-2, -30, 2]), at([12, -30, 2])], { size: 0.5 }) });
box("frame", "head.lift", [4, -25, HEAD.z1], [10, -19, HEAD.z1 + 5], {}, { r: 0.4, extra: Dots([at([7, -19, HEAD.z1 + 3])], { size: 0.7, tone: "lo" }) });
box("frame", "head.bracket", [1, BAR.y0, BAR.z0 - 4], [12, HEAD.y0, BAR.z0], { tone: "lo" }, { r: 0.3 });
// barra lateral trasera, de cabezal a cabezal, con sus tuercas
box("frame", "bar.back", [-1, BAR.y0, BAR.z0], [XRH + RHW + 1, BAR.y1, BAR.z1], {}, { r: 0.8, bevel: 0.4 });
disc("frame", "bar.nut.0", XA([-3, (BAR.y0 + BAR.y1) / 2, (BAR.z0 + BAR.z1) / 2]), 0, 2, 4.2, {}, { steps: 6 });
disc("frame", "bar.nut.1", XA([XRH + RHW + 1, (BAR.y0 + BAR.y1) / 2, (BAR.z0 + BAR.z1) / 2]), 0, 2, 4.2, {}, { steps: 6 });
// cabezal trasero entero (soporte del cilindro), con dos patas
// cabezal trasero en media sección, con la boca del vástago
const ROD_R = 3.4, BORE = ROD_R + 0.6;
xp("frame", "rear.head", X.notched(-44, HEAD.z0, HEAD.z1, [{ zc: ZC, r: BORE }]), XRH, XRH + RHW, { tone: "mid" }, { extra: hatch(XRH, XRH + RHW, [[HEAD.z0, ZC - BORE], [ZC + BORE, HEAD.z1]]) });
box("frame", "rear.lift", [XRH + 1.5, -25, HEAD.z1], [XRH + RHW - 1.5, -19, HEAD.z1 + 5], {}, { r: 0.4, extra: Dots([at([XRH + RHW / 2, -19, HEAD.z1 + 3])], { size: 0.7, tone: "lo" }) });
box("frame", "rear.rib", [XRH + RHW, -31.2, HEAD.z0 + 2], [XRH + RHW + 3.2, -28.8, HEAD.z1 - 2], { tone: "mid" }, { r: 0.3 });
{
  const NP = { x: XRH + RHW, y0: -27, y1: -15, z0: 50, z1: 70 };
  const rules = [56, 59, 62].map((z) => path3([[NP.x + 0.35, NP.y0 + 0.25, z], [NP.x + 0.35, NP.y1 - 0.25, z]])).join("");
  const text = k.faceTextSvg(k.sideMatrix([NP.x + 0.35, NP.y1 - 1.4], NP.z1 - 3.2, P, "right"), "PRENSA", { size: 1.8, tone: "mid" });
  box("frame", "rear.plate", [NP.x, NP.y0, NP.z0], [NP.x + 0.35, NP.y1, NP.z1], { tone: "mid" }, { r: 0.4, extra: Ln(rules, { tone: "faint" }) + text + Dots([[NP.y0 + 0.9, NP.z0 + 0.9], [NP.y1 - 0.9, NP.z0 + 0.9], [NP.y0 + 0.9, NP.z1 - 0.9], [NP.y1 - 0.9, NP.z1 - 0.9]].map(([y, z]) => at([NP.x + 0.35, y, z])), { size: 0.38 }) });
}
box("frame", "rear.bracket", [XRH + 1, BAR.y0, BAR.z0 - 4], [XRH + RHW - 1, -44, BAR.z0], { tone: "lo" }, { r: 0.3 });
box("frame", "rear.leg", [XRH + 0.5, -42, 2], [XRH + RHW - 0.5, -32, HEAD.z0], {}, { r: 0.6 });
box("frame", "stand.rear.foot", [XRH - 5, -46, 0], [XRH + RHW + 5, -28, 2], { tone: "lo" }, { r: 1, extra: Dots([at([XRH - 3, -44, 2]), at([XRH + RHW + 3, -44, 2]), at([XRH - 3, -30, 2]), at([XRH + RHW + 3, -30, 2])], { size: 0.5 }) });

/* ====================================================================
   2 · placas (media sección)
   ==================================================================== */
for (let i = 0; i < NPL; i++) {
  const x0 = plateX0(i), x1 = x0 + PT, xm = webX(i), pc = "pl" + i;
  box(pc, `pl${i}.rim.back`, [x0, -HALF, ZR0], [x1, YR, ZR1], {}, { r: 0.2 });
  xp(pc, `pl${i}.rim.bottom`, X.notched(-HALF, ZB, ZR0, [DRAIN]), x0, x1);
  box(pc, `pl${i}.rim.top`, [x0, -HALF, ZR1], [x1, 0, ZT], {}, { r: 0.2 });
  const cloth = [xm - WEB / 2 + 0.3, xm + WEB / 2 - 0.3].map((x) => [[[x, 0, ZR0], [x, 0, ZC - RC]], [[x, 0, ZC + RC], [x, 0, ZR1]]]).flat().map((pts) => path3(pts)).join("");
  xp(pc, `pl${i}.web`, X.notched(YR, ZR0, ZR1, [EYE]), xm - WEB / 2, xm + WEB / 2, {}, { extra: Ln(cloth, { tone: "lo", dotted: true }) });
  box(pc, `pl${i}.lug`, [xm - 1.3, BAR.y0 + 0.4, BAR.z1], [xm + 1.3, -HALF, BAR.z1 + 3.4], {}, { r: 0.4 });
}
// cabezal móvil (media sección): bolsillo, cuerpo, colgador y la media maza del vástago
box("follower", "fol.rim.back", [XPF, -HALF, ZR0], [XFP, YR, ZR1], {}, { r: 0.2 });
box("follower", "fol.rim.bottom", [XPF, -HALF, ZB], [XFP, 0, ZR0], {}, { r: 0.2 });
box("follower", "fol.rim.top", [XPF, -HALF, ZR1], [XFP, 0, ZT], {}, { r: 0.2 });
box("follower", "fol.body", [XFP, -44, ZB - 4], [XFB, 0, ZT + 4], {}, { r: 0, bevel: 0, extra: Ln(path3([[XFB, 0, ZB - 4], [XFB, 0, ZT + 4]]), { tone: "faint" }) + hatch(XFP, XFB, [[ZB - 4, ZT + 4]]) });
box("follower", "fol.hanger", [XFP + 1, BAR.y0 - 0.5, BAR.z1], [XFB - 1, -44, BAR.z1 + 5], {}, { r: 0.6, extra: Dots([at([XFP + 2.5, -44, BAR.z1 + 3.5]), at([XFB - 2.5, -44, BAR.z1 + 3.5])], { size: 0.45 }) });
xp("follower", "fol.boss", halfDisc(ZC, 7), XFB, XFB + 4, {});

/* ---------- cilindro hidráulico (entero) y vástago ---------- */
// cilindro en media sección: brida, camisa, tapa, dos tirantes y el pistón que corre con el vástago
const CYL0 = XRH + RHW, CR = 10, CRI = 8.5, CL = 56;
const halfRing = (zc, r0, r1, steps = 16) => [...X.halfOct(zc, r1, steps), ...X.halfOct(zc, r0, steps).reverse()];
const halfBolts = (x, zc, r, n) => Dots(Array.from({ length: n }, (_, i) => Math.PI / 2 + (Math.PI * (i + 0.5)) / n).map((t) => at([x, r * Math.cos(t), zc + r * Math.sin(t)])), { size: 0.42 });
xp("frame", "cyl.flange", halfRing(ZC, BORE, 13), CYL0, CYL0 + 3, {}, { extra: halfBolts(CYL0 + 3, ZC, 11.6, 4) });
// la camisa en dos: el borde de arriba, junto al corte, tapa el canto del pistón; el resto queda detrás
const arcRing = (zc, r0, r1, a0, a1, steps) => { const pts = []; for (let i = 0; i <= steps; i++) { const t = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180; pts.push([r1 * Math.cos(t), zc + r1 * Math.sin(t)]); } for (let i = steps; i >= 0; i--) { const t = ((a0 + ((a1 - a0) * i) / steps) * Math.PI) / 180; pts.push([r0 * Math.cos(t), zc + r0 * Math.sin(t)]); } return pts.map(([y, z]) => [Math.abs(y) < 1e-9 ? 0 : y, z]); };
xp("frame", "cyl.barrel", arcRing(ZC, CRI, CR, 125, 270, 14), CYL0 + 3, CYL0 + CL - 3, { tone: "mid" });
xp("frame", "cyl.barrel.top", arcRing(ZC, CRI, CR, 90, 125, 4), CYL0 + 3, CYL0 + CL - 3, { tone: "mid" });
xp("frame", "cyl.cap", halfDisc(ZC, 13), CYL0 + CL - 3, CYL0 + CL, {}, { extra: halfBolts(CYL0 + CL, ZC, 11.6, 4) });
for (const zz of [8.5, -8.5]) disc("frame", `cyl.tierod${zz}`, XA([CYL0, -8.5, ZC + zz]), 3, CL - 3, 0.75, { tone: "lo" });
const PORTS = [CYL0 + 6, CYL0 + CL - 6], PD = [0, Math.cos((250 * Math.PI) / 180), Math.sin((250 * Math.PI) / 180)];
PORTS.forEach((x, i) => disc("frame", `cyl.port${i}`, G.frameAlong([x, 0, ZC], PD), CR - 0.15, CR + 3, 1.8, {}, { owner: "cyl.barrel" }));
const PORT_TIP = (x) => [x, PD[1] * (CR + 3), ZC + PD[2] * (CR + 3)];
// pistón y vástago: se mueven con el cabezal móvil
const PIS0 = CYL0 + 3.4, PISW = 4;
xp("follower", "cyl.piston", halfDisc(ZC, CRI - 0.05), PIS0, PIS0 + PISW, { tone: "hi" }, { extra: Ln(path3([[PIS0 + 1.3, 0, ZC + CRI - 0.05], [PIS0 + 1.3, 0, ZC - CRI + 0.05]]) + path3([[PIS0 + 2.7, 0, ZC + CRI - 0.05], [PIS0 + 2.7, 0, ZC - CRI + 0.05]]), { tone: "lo" }) });
disc("follower", "rod", XA([XFB + 4, 0, ZC]), 0, PIS0 - (XFB + 4), ROD_R, { tone: "hi" });
const GLAND = 2.4;
xp("frame", "rod.gland", halfRing(ZC, BORE, 6.8), XRH - GLAND, XRH, {}, { extra: halfBolts(XRH - GLAND, ZC, 5.6, 3) });

/* ---------- central hidráulica bajo el cilindro ---------- */
const PK = { x0: 152, x1: 186, y0: -34, y1: -8 };
box("frame", "stand.pack.skid", [PK.x0 - 2, PK.y0 - 2, 0], [PK.x1 + 2, PK.y1 + 2, 2], { tone: "lo" }, { r: 0.8 });
box("frame", "pack.tank", [PK.x0, PK.y0, 2], [PK.x1, PK.y1, 26], {}, { r: 1.2, bevel: 0.8, extra: Ln(path3([[PK.x0 + 4, PK.y1, 8], [PK.x0 + 4, PK.y1, 20]]), { tone: "lo" }) + Dots([at([PK.x0 + 4, PK.y1, 8]), at([PK.x0 + 4, PK.y1, 20])], { size: 0.5, tone: "mid" }) });
box("frame", "pack.block", [PK.x0 + 3, -26, 26], [PK.x0 + 15, -14, 31], {}, { r: 0.6, extra: Dots([at([PK.x0 + 4.5, -14, 29.5]), at([PK.x0 + 13.5, -14, 29.5])], { size: 0.42 }) });
const MZ = ZA([PK.x1 - 9, -21, 26]);
turned("frame", "pack.motor", MZ, [[0, 4.5], [2, 6.5], [15, 6.5], [17, 5.5], [19, 3]], {}, { rims: "all" });
const HOSE_TOP = [[PK.x0 + 6, -20, 31], [PK.x0 + 12, -20, 31]];
// mangueras del cilindro a la central
const hose = (name, x, top, zmid) => { const tip = PORT_TIP(x); tubeItems("frame", name, G.fillet([tip, G.add3(tip, G.mul3(PD, 3)), [x, -20, zmid], [top[0], -20, zmid - 6], top], 6, 14, { P, tube: 1 }), 1, { tone: "hi", maxLength: 20 }); };
hose("hose.a", PORTS[0], HOSE_TOP[0], 52);
hose("hose.b", PORTS[1], HOSE_TOP[1], 58);

/* ====================================================================
   3 · tolva bajo las placas (media sección)
   ==================================================================== */
const HX0 = 10, HX1 = 128, HT = 1.2, HZ0 = 12, HZ1 = 36;
// tolva sin fondo: deja caer la torta sobre la banda transportadora
const HWALL = [[-25.5, HZ0], [-27, HZ0], [-46.5, HZ1], [-45, HZ1]];
xp("frame", "hop.back", HWALL, HX0 + HT, HX1 - HT, { tone: "mid" });
for (const [x0, x1, nm] of [[HX0, HX0 + HT, "hop.end0"], [HX1 - HT, HX1, "hop.end1"]]) xp("frame", nm, [[0, HZ0], [-27, HZ0], [-46.5, HZ1], [0, HZ1]], x0, x1, { tone: "mid" }, { extra: Dots([at([x1, -40, 31]), at([x1, -30, 21]), at([x1, -6, 33]), at([x1, -6, 15])], { size: 0.4 }) });
box("frame", "hop.lip", [HX0 + HT, -47.5, HZ1], [HX1 - HT, -44.2, HZ1 + 1.2], { tone: "mid" }, { r: 0.2 });
// banda transportadora: canal trasero, dos tambores con la banda enrollada, tramo de ida y de retorno
const CV = { x0: 7, x1: 125, y0: -25.5, zc: 6.6, rd: 3.2, tb: 0.6 };
const BELT_TOP = CV.zc + CV.rd + CV.tb;
box("frame", "conv.channel", [CV.x0 - 5, -30, 3], [CV.x1 + 5, CV.y0, HZ0], { tone: "mid" }, { r: 0.3, extra: Dots([CV.x0, CV.x1].map((x) => at([x, CV.y0, CV.zc])), { size: 0.7, tone: "mid" }) });
for (const x of [CV.x0, CV.x1]) {
  const F = YA([x, CV.y0, CV.zc]);
  turned("frame", `conv.drum${x}`, F, [[0, CV.rd + CV.tb], [-CV.y0, CV.rd + CV.tb]], { tone: "mid" }, { extra: Ln(G.circleOf(F, -CV.y0, CV.rd * 0.55, P), { tone: "lo" }) + Dots([at([x, 0, CV.zc])], { size: 0.6, tone: "mid" }) });
}
const XT = Math.sqrt((CV.rd + CV.tb) ** 2 - CV.rd ** 2) + 0.05;
xp("frame", "conv.belt", rect(CV.y0, CV.zc + CV.rd, 0, BELT_TOP), CV.x0 + XT, CV.x1 - XT, { tone: "mid" }, { extra: `<path data-live="belt" class="iso-line" data-tone="lo" style="stroke-dasharray:2 5" d="${path3([[CV.x0 + XT, 0, BELT_TOP - CV.tb / 2], [CV.x1 - XT, 0, BELT_TOP - CV.tb / 2]])}"/>` });
xp("frame", "conv.return", rect(CV.y0, CV.zc - CV.rd - CV.tb, 0, CV.zc - CV.rd), CV.x0 + XT, CV.x1 - XT, { tone: "lo" });
for (const x of [CV.x0 + 17, CV.x1 - 16]) {
  box("frame", `stand.conv.leg${x}`, [x - 2, -30, 0], [x + 2, CV.y0, 3], { tone: "lo" }, { r: 0.3 });
}

/* ====================================================================
   4 · alimentación: tanque agitado, bomba de diafragma, manómetro
   ==================================================================== */
// tanque de suspensión con agitador
const TK = { x: -92, y: -44, r: 16, z0: 20, zc: 32, z1: 82 };
const TF = ZA([TK.x, TK.y, 0]);
turned("frame", "tank.shell", TF, [[TK.z0, 3], [TK.zc, TK.r], [TK.z1, TK.r], [TK.z1 + 1.2, TK.r + 1], [TK.z1 + 2.4, TK.r + 1]], { tone: "mid" }, { rims: "all", extra: "" });
for (let a = 0; a < 3; a++) {
  const t = Math.PI / 6 + (a * 2 * Math.PI) / 3, cx = TK.x + Math.cos(t) * (TK.r + 1.2), cy = TK.y + Math.sin(t) * (TK.r + 1.2);
  box("frame", `stand.tank.leg${a}`, [cx - 1.2, cy - 1.2, 0], [cx + 1.2, cy + 1.2, TK.zc + 6], { tone: "lo" }, { r: 0.3 });
}
box("frame", "tank.bridge", [TK.x - 12, TK.y - 3, TK.z1 + 2.4], [TK.x + 12, TK.y + 3, TK.z1 + 5], {}, { r: 0.4 });
turned("frame", "tank.drive", ZA([TK.x, TK.y, TK.z1 + 5]), [[0, 4.2], [6, 4.2], [7, 3.4], [16, 3.4], [17, 2]], {}, { rims: "all" });
turned("frame", "tank.outlet", ZA([TK.x, TK.y, TK.z0 - 4]), [[0, 4], [1, 4], [1.3, 2.6], [4.3, 2.6]], {}, { extra: "" });
// bomba neumática de doble diafragma
const PX = { l0: -64, l1: -56, c0: -56, c1: -46, r0: -46, r1: -38, z: 26, rr: 11, y: 0 };
box("frame", "stand.pump.base", [-68, -12, 0], [-32, 12, 2], { tone: "lo" }, { r: 0.8, extra: Dots([at([-66, -10, 2]), at([-34, -10, 2]), at([-66, 10, 2]), at([-34, 10, 2])], { size: 0.5 }) });
for (const x of [-63, -39]) box("frame", `pump.foot${x}`, [x - 2, -3, 2], [x + 2, 3, 4.8], { tone: "lo" }, { r: 0.3 });
const MAN_LO = XA([-67, 0, 8]), MAN_HI = XA([-67, 0, 44]);
turned("frame", "pump.man.lo", MAN_LO, [[0, 3.2], [31, 3.2], [31, 2.4], [33, 2.4]], { tone: "mid" });
turned("frame", "pump.man.hi", MAN_HI, [[0, 2.4], [2, 2.4], [2, 3.2], [32, 3.2]], { tone: "mid" });
disc("frame", "pump.inlet.flange", MAN_LO, -1.2, 0, 4.6, {}, { owner: "pump.man.lo", extra: bolts(MAN_LO, -1.2, 3.8, 6, { size: 0.36 }) });
disc("frame", "pump.outlet.flange", MAN_HI, 32, 33.2, 4.8, {}, { owner: "pump.man.hi", extra: bolts(MAN_HI, 33.2, 3.9, 6, { size: 0.36 }) });
const chamber = (name, s0, s1, outward) => {
  const F = XA([0, 0, PX.z]);
  const prof = outward < 0 ? [[s0, 6], [s0 + 1.2, 9.5], [s0 + 3, PX.rr], [s1, PX.rr]] : [[s0, PX.rr], [s1 - 3, PX.rr], [s1 - 1.2, 9.5], [s1, 6]];
  turned("frame", name, F, prof, { tone: "mid" }, { extra: outward > 0 ? bolts(F, s1 - 3, PX.rr - 1.1, 10) : "" });
};
chamber("pump.cham.l", PX.l0, PX.l1, -1);
chamber("pump.cham.r", PX.r0, PX.r1, 1);
box("frame", "pump.centre", [PX.c0, -6, PX.z - 9], [PX.c1, 6, PX.z + 9], {}, { r: 0.8, bevel: 0.5, extra: Dots([at([PX.c0 + 1.5, 6, PX.z - 7.5]), at([PX.c1 - 1.5, 6, PX.z - 7.5]), at([PX.c0 + 1.5, 6, PX.z + 7.5]), at([PX.c1 - 1.5, 6, PX.z + 7.5])], { size: 0.4 }) });
turned("frame", "pump.muffler", YA([-51, 6, PX.z - 3]), [[0, 1.4], [1, 2], [5, 2], [5.6, 1.2]], { tone: "lo" });
disc("frame", "pump.air.fit", YA([-51, 6, PX.z + 4]), 0, 2.2, 1, {});
for (const x of [-60, -42]) {
  disc("frame", `pump.neck.lo${x}`, ZA([x, 0, 8 + 3.1]), 0, PX.z - PX.rr + 0.05 - 11.1, 2.3, {});
  disc("frame", `pump.neck.hi${x}`, ZA([x, 0, PX.z + PX.rr - 0.05]), 0, 44 - 3.1 - (PX.z + PX.rr - 0.05), 2.3, {});
}
// línea de aire comprimido hasta la toma del piso
disc("frame", "stand.air.drop", ZA([-51, 24, 0]), 0, 4, 1.3, { tone: "lo" });
disc("frame", "air.valve", ZA([-51, 24, 4]), 0, 2.4, 1.9, {}, { owner: "stand.air.drop" });
tubeItems("frame", "hose.air", G.fillet([[-51, 8.2, PX.z + 4], [-51, 16, PX.z + 4], [-51, 24, PX.z - 4], [-51, 24, 6.4]], 6, 12, { P, tube: 0.7 }), 0.7, { tone: "hi", maxLength: 16 });
// succión: del fondo del tanque a la bomba
pipe("frame", "pipe.suction", [[TK.x, TK.y, TK.z0 - 4], [TK.x, TK.y, 8], [TK.x, -18, 8], [-80, 0, 8], [-68.2, 0, 8]], 2.4, { flanges: [true, true], flangeR: 1.6, bend: 6 });
// descarga: de la bomba a la boca del cabezal fijo
pipe("frame", "pipe.feed", [[-33.8, 0, 44], [-22, 0, 44], [-22, 0, ZC], [-10.6, 0, ZC]], 2.6, { flanges: [true, false], flangeR: 1.8, bend: 2.8 });
turned("frame", "gauge.teebody", XA([-10.6, 0, ZC]), [[0, 3.3], [5.2, 3.3]], {}, {});
pipe("frame", "pipe.feed2", [[-5.4, 0, ZC], [-2.2, 0, ZC]], 2.6, { flanges: [false, true], flangeR: 1.8 });
disc("frame", "head.nozzle", XA([-2.2, 0, ZC]), 0, 2.2, 6.4, {}, { extra: "" });
// manómetro sobre la línea, mirando al lector
const GX = -8, GZ = ZC + 13.2, GR = 6.2;
disc("frame", "gauge.tee", ZA([GX, 0, ZC + 3.0]), 0, 4.0, 1.4, {}, { owner: "gauge.teebody" });
disc("frame", "gauge.case", YA([GX, -2.4, GZ]), 0, 4, GR, {});
const GFACE = k.sideMatrix([GX, 2.4], GZ, P, "left");
const GMAX = 16, phiOf = (v) => ((225 - (270 * v) / GMAX) * Math.PI) / 180;
const tick = (v, r0, r1) => { const f = phiOf(v); return `M${(r0 * Math.cos(f)).toFixed(2)} ${(-r0 * Math.sin(f)).toFixed(2)}L${(r1 * Math.cos(f)).toFixed(2)} ${(-r1 * Math.sin(f)).toFixed(2)}`; };
const minor = Array.from({ length: GMAX + 1 }, (_, v) => (v % 4 ? tick(v, 4.7, 5.3) : "")).join("");
const major = Array.from({ length: GMAX + 1 }, (_, v) => (v % 4 ? "" : tick(v, 4.1, 5.3))).join("");
const arc = Array.from({ length: 49 }, (_, n) => { const f = phiOf((GMAX * n) / 48); return `${n ? "L" : "M"}${(5.55 * Math.cos(f)).toFixed(2)} ${(-5.55 * Math.sin(f)).toFixed(2)}`; }).join("");
const GFACE_SVG = `<g transform="${GFACE}"><path class="iso-line" data-tone="faint" d="${arc}"/><path class="iso-line" data-tone="lo" d="${minor}"/><path class="iso-line" data-tone="mid" d="${major}"/></g>`;
disc("frame", "gauge.bezel", YA([GX, 1.6, GZ]), 0, 0.8, GR + 0.5, {}, { extra: GFACE_SVG });
// filtrado: del canal inferior al tanque de filtrado
const RCV = { x: -8, y: -6, r: 9, z0: 3, z1: 32 };
const SIGHT = { z0: 8, z1: 27 };
turned("frame", "rcv.shell", ZA([RCV.x, RCV.y, 0]), [[RCV.z0, RCV.r], [RCV.z1, RCV.r], [RCV.z1 + 1, RCV.r + 0.8], [RCV.z1 + 2, RCV.r + 0.8]], { tone: "mid" }, { rims: "all" });
for (let a = 0; a < 3; a++) {
  const t = Math.PI / 2 + (a * 2 * Math.PI) / 3, cx = RCV.x + Math.cos(t) * (RCV.r - 1.5), cy = RCV.y + Math.sin(t) * (RCV.r - 1.5);
  box("frame", `stand.rcv.leg${a}`, [cx - 1, cy - 1, 0], [cx + 1, cy + 1, RCV.z0], { tone: "lo" }, { r: 0.3 });
}
{
  const dir = [Math.cos((AZ * Math.PI) / 180), Math.sin((AZ * Math.PI) / 180), 0];
  const gx = RCV.x + dir[0] * (RCV.r + 2.2), gy = RCV.y + dir[1] * (RCV.r + 2.2);
  for (const z of [7, 28]) disc("frame", `rcv.boss${z}`, G.frameAlong([RCV.x + dir[0] * (RCV.r - 0.1), RCV.y + dir[1] * (RCV.r - 0.1), z], dir), 0, 3.1, 1, {}, { owner: "rcv.shell" });
  disc("frame", "rcv.glass", ZA([gx, gy, 8]), 0, 19, 0.75, { tone: "lo" }, { owner: "rcv.shell" });
  SIGHT.x = gx; SIGHT.y = gy;
}
disc("frame", "drain.nozzle", XA([-1.6, 0, ZF]), 0, 1.6, 3, {});
pipe("frame", "pipe.filtrate", [[-1.6, 0, ZF], [-8, 0, ZF], [-8, 0, RCV.z1 + 2]], 1.3, { flanges: [false, false] });

/* ---------- huecos para lo que se mueve en vivo ---------- */
// tortas grabadas a media carga para que el orden de pintura las conozca
const WMID = 0.8;
for (let j = 0; j <= NPL; j++) {
  const poly = X.notched(YR, ZR0, ZR1, [EYE]);
  for (const side of ["L", "R"]) {
    const x0 = side === "L" ? wallL(j) : wallR(j) - WMID, x1 = side === "L" ? wallL(j) + WMID : wallR(j);
    const F = G.frameOf([x0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]);
    const shape = record(A.prism(F, poly, 0, x1 - x0, { name: `cake${j}${side}` }));
    const rd = side === "L" ? rideL(j) : rideR(j);
    R.put({ piece: rd, ride: rd, name: `cake${j}${side}`, at: [(x0 + x1) / 2, YR / 2, (ZR0 + ZR1) / 2], svg: "", shapes: [shape], move: PIECES[rd], live: `cake${j}${side}` });
  }
}

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);
const idx = (name) => R.items.findIndex((it) => it.name === name);
const after = new Map();
const slot = (name, html) => { const i = idx(name); if (i < 0) throw new Error("no item " + name); after.set(i, (after.get(i) || "") + html); };
for (let j = 0; j <= NPL; j++) slot(`cake${j}L`, `<g data-live="slurry${j}"></g>`);
slot("head.body", `<g data-live="eye.head"></g>`);
slot("gauge.bezel", `<g transform="${GFACE}"><path data-live="setpoint" class="fp-setpoint" d="M4.2 0L5.6 0"/><path data-live="needle" class="iso-line" data-tone="lit" d="M0 0L4.7 0" style="stroke-width:1.1px"/></g>${Dots([at([GX, 2.45, GZ])], { size: 0.55, tone: "hi" })}`);
slot("rcv.glass", `<path data-live="sight" class="fp-level" d=""/>`);
slot(R.items[Math.max(idx("conv.belt"), idx("hop.back"), idx("hop.end0"))].name, `<g data-live="pile"></g>`);
for (let i = 0; i < NPL; i++) slot(`pl${i}.web`, `<g data-live="eye${i}"></g>`);
const groups = R.items.map((item, index) => {
  const m = item.move || [0, 0, 0];
  const body = item.live ? `<g data-live="${item.live}"></g>` : item.svg;
  return `<g class="it" data-piece="${item.ride}" data-name="${item.name}" data-k="${item.key.toFixed(3)}" data-m="${m.join(",")}">${body}${after.get(index) ?? ""}</g>`;
});
// flujos sobre el plano de corte: el filtrado baja por las caras de las placas y sale por el canal inferior
const walls = [];
for (let j = 0; j <= NPL; j++) for (const x of [wallL(j) - 0.3, wallR(j) + 0.3]) walls.push(path3([[x, 0, ZR1 - 1.2], [x, 0, ZF + RF]]));
const flows = `<g class="fp-flows"><path data-live="flow.walls" class="fp-flow" d="${walls.join("")}"/><path data-live="flow.drain" class="fp-flow" d="${path3([[XFP - 0.3, -0.9, ZF], [0, -0.9, ZF]])}"/><path data-live="flow.eye" class="fp-flow fp-feed" d="${path3([[0, -1.8, ZC], [XFP - 0.3, -1.8, ZC]])}"/></g>`;
const svg = k.figureSvg({ width: W, height: H, label: "Filtro prensa de placas en media sección", body: [`<g class="fp-items">${groups.join("")}</g>`, flows] });
writeFileSync(join(HERE, "press_svg.html"), svg);
const FPCSS = readFileSync(join(HERE, "fp.css"), "utf8");
const LIVE = readFileSync(join(HERE, "live.js"), "utf8") + readFileSync(join(HERE, "drive_test.js"), "utf8").replace("__FPCSS__", JSON.stringify(FPCSS));
const CROP = (() => { const pts = [[-21, 0, 140], [-21, 0, 40], [XFB + 12, 0, 40], [XFB + 12, -50, 140], [0, -50, 140], [XFB + 12, 0, 140], [0, -30, 30], [XFB + 12, -30, 30]].map(at); const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs) - 4, Math.min(...ys) - 4, Math.max(...xs) - Math.min(...xs) + 8, Math.max(...ys) - Math.min(...ys) + 8].map((v) => +v.toFixed(1)); })();
const DATA = { CROP, EX: k.axisVector(P, [1, 0, 0]), EZ: k.axisVector(P, [0, 0, 1]), HOP_FLOOR: BELT_TOP, BELT: [CV.x0, CV.x1], SIGHT: { ...SIGHT, top: at([SIGHT.x, SIGHT.y, SIGHT.z1]), bot: at([SIGHT.x, SIGHT.y, SIGHT.z0]) }, GMAX, P, V: R.V, W, H, NPL, PT, WEB, POCK, YR, ZR0, ZR1, ZC, RC, ZF, RF, XH, XFP, X0, GAP, TRAVEL, walls: Array.from({ length: NPL + 1 }, (_, j) => [wallL(j), wallR(j)]), rides: Array.from({ length: NPL + 1 }, (_, j) => [rideL(j), rideR(j)]), pieces: PIECES, stagger: STAGGER, spring: SPRING, webs: Array.from({ length: NPL }, (_, i) => webX(i)) };
const xsrc = readFileSync(join(HERE, "xprism.mjs"), "utf8").replace(/^export /gm, "");
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Filtro prensa", theme: "light", width: 980, body: `<div class="iso-stage">${svg}</div>`, script: xsrc + "\nconst D=" + JSON.stringify(DATA) + ";\n" + LIVE }));
writeFileSync(join(HERE, "press_data.json"), JSON.stringify(DATA));
// salidas para el explorador

console.log("items", R.items.length, "scale", KS.toFixed(3));
if (!FAST) A.auditOrExit(R, P, {});
{
  const { mkdirSync } = await import("node:fs");
  mkdirSync(join(HERE, "out"), { recursive: true });
  writeFileSync(join(HERE, "out", "fig.svg"), svg.replace("<svg ", '<svg id="fpSvg" '));
  writeFileSync(join(HERE, "out", "fig.js"), "/* filtro prensa en isométrico: generado por press/build.mjs */\n" + xsrc + "\nvar FP_DATA = " + JSON.stringify(DATA) + ";\n" + readFileSync(join(HERE, "live.js"), "utf8"));
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + FPCSS + "\n" + readFileSync(join(HERE, "fp-theme.css"), "utf8"));
}
