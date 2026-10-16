/* ====================================================================
   El intercambiador de placas con empaques en isométrico (skill anatomy),
   para la pestaña «Por dentro» del Explorador de intercambiadores.
   El bastidor: placa fija con las cuatro boquillas, barra portadora
   arriba y barra guía abajo, columna de apoyo, placa de presión y los
   tornillos tensores. El paquete va abierto por el plano vertical de su
   eje (x = 0): se ven las placas en corte, el empaque arriba y abajo de
   cada canal y, en vivo, los canales alternos del caliente y del frío
   con su temperatura (la página los pinta con el perfil del explorador).
   Uso: node build.mjs [--audit] [--fast] · --js
   Unidades: 1 = 1 cm. z hacia arriba; el paquete a lo largo de y.
   ==================================================================== */
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const KIT = process.env.ANATOMY_KIT || fileURLToPath(new URL("../../../.claude/skills/anatomy", import.meta.url));
const k = await import(KIT + "/kit/iso-kit.mjs");
const G = await import(KIT + "/kit/lathe.mjs");
const A = await import(KIT + "/kit/audit.mjs");
const X = await import(join(HERE, "xprism.mjs"));
const GEO = await import(join(HERE, "geo.mjs"));
const FAST = process.argv.includes("--fast");
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
mkdirSync(join(HERE, "out"), { recursive: true });
const writeJs = () => {
  writeFileSync(join(HERE, "out", "fig.js"), "/* intercambiador de placas en isométrico: generado por build.mjs */\nvar FPlate = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + "\nreturn FPlate;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), readFileSync(join(HERE, "pl.css"), "utf8"));
};
if (process.argv.includes("--js")) { writeJs(); console.log("out/fig.js, out/fig.css"); process.exit(0); }

const PX = GEO.PX, AZ = PX.AZ, EL = PX.EL;
const PL = GEO.plates(), CH = GEO.channels();
const FR = PX.frame, PR = { ...PX.press, y1: PL[0].y0, y0: PL[0].y0 - PX.press.th }, CO = PX.col, BAR = PX.bar, BO = PX.bolts, NZ = PX.noz, PO = PX.port;
const Z0 = PX.z0, Z1 = PX.z0 + PX.H, HW = PX.W / 2;
const W = 680, H = 540;
const EXT = [[-44, CO.y0 - 6, 0], [44, CO.y0 - 6, 0], [-44, FR.y1 + NZ.len + 3, 0], [44, FR.y1 + NZ.len + 3, 0], [-44, CO.y0, 200], [44, FR.y1, 200], [-44, FR.y1 + NZ.len, 200], [44, CO.y0, 200]];
const P = k.fitProjection(EXT, W, H, { pad: 14, azimuth: AZ, elevation: EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = R_.solid;
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", ground, owner, cls = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground, owner }, steps));
  const body = S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style }) + extra;
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra, [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", owner, bevel = 0, cls = "", cut = null } = {}) {
  const paths = G.solidOf(profile, F, P, { bevel });
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ...(cut ? { cut } : {}) }));
  const body = S(paths, { tone: "mid", ...style }) + extra;
  put(name, G.add3(F.o, G.mul3(F.a, mid)), cls ? `<g class="${cls}">${body}</g>` : body, [shape]);
  return shape;
}
const disc = (name, F, s0, s1, r, style = {}, options = {}) => turned(name, F, [[s0, r], [s1, r]], style, options);
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const YA = (o) => G.frameOf(o, [0, 1, 0], [1, 0, 0], [0, 0, 1]); // a lo largo de y
// marco a lo largo de y con sección en (u = x, v = z)
const YF = { o: [0, 0, 0], a: YD, u: XD, v: ZD };
const rect = (x0, x1, z0, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];

/* ====================================================================
   1 · el paquete de placas, cortado por x = 0
   ==================================================================== */
// cada placa: media placa (x de −W/2 a 0) con su cara cortada en x = 0 y su lengüeta para colgar de la barra y apoyarse en la guía
PL.forEach((p) => {
  fp(`pl.${p.i}`, YF, rect(-HW, 0, Z0, Z1), p.y0, p.y1, { tone: "mid" }, { cls: "pl-plate" });
  box(`pl.${p.i}.hang`, [-3, p.y0, Z1], [0, p.y1, BAR.top[0]], { tone: "mid" }, { r: 0.1, owner: `pl.${p.i}` });
  box(`pl.${p.i}.foot`, [-3, p.y0, BAR.bot[1]], [0, p.y1, Z0], { tone: "mid" }, { r: 0.1, owner: `pl.${p.i}` });
});
// empaques arriba y abajo de cada canal, y el canal mismo (pieza viva: la página lo pinta)
CH.forEach((c) => {
  box(`gk.${c.i}.b`, [-HW + 0.2, c.y0, Z0], [0, c.y1, Z0 + PX.GK], { tone: "lo" }, { r: 0.1, cls: "pl-gasket" });
  box(`gk.${c.i}.t`, [-HW + 0.2, c.y0, Z1 - PX.GK], [0, c.y1, Z1], { tone: "lo" }, { r: 0.1, cls: "pl-gasket" });
  put(`ch.${c.i}`, [-1, (c.y0 + c.y1) / 2, (Z0 + Z1) / 2], "", [record(A.slab({ x: -HW + 0.5, y: c.y0 + 0.02, w: HW - 0.5, d: c.y1 - c.y0 - 0.04, r: 0 }, Z0 + PX.GK + 0.02, PX.H - 2 * PX.GK - 0.04, { name: `ch.${c.i}`, ground: true }, 1))], { live: true });
});

/* ====================================================================
   2 · bastidor: placa fija, placa de presión, barras, columna y tornillos
   ==================================================================== */
const boltShapes = BO.z.map((z) => A.tube([[BO.x, BO.y0, z], [BO.x, BO.y1, z]], BO.r + 0.05, { name: `bore${z}` }));
const plateFace = (x, z0, z1) => [[-x, z0], [x, z0], [x, z1], [-x, z1]];
fp("frame", YF, plateFace(FR.x, FR.z0, FR.z1), FR.y0, FR.y1, { tone: "mid" }, { cut: boltShapes, cls: "pl-frame" });
fp("press", YF, plateFace(PR.x, BAR.bot[1], PR.z1), PR.y0, PR.y1, { tone: "mid" }, { cut: boltShapes, cls: "pl-frame" });
[-1, 1].forEach((sg, i) => box(`stand.foot${i}`, [sg < 0 ? -FR.x : FR.x - 12, FR.y0 - 2, 0], [sg < 0 ? -FR.x + 12 : FR.x, FR.y1 + 2, FR.z0], { tone: "lo" }, { r: 0.3, extra: Dots([at([sg * (FR.x - 6), FR.y1 + 1, FR.z0])], { size: 0.45 }) }));
box("stand.colfoot", [-CO.x - 6, CO.y0 - 4, 0], [CO.x + 6, CO.y1 + 4, 1.2], { tone: "lo" }, { r: 0.3, extra: Dots([at([-CO.x - 3, CO.y1 + 2, 1.2]), at([CO.x + 3, CO.y1 + 2, 1.2]), at([CO.x + 3, CO.y0 - 2, 1.2])], { size: 0.45 }) });
box("col", [-CO.x, CO.y0, 1.2], [CO.x, CO.y1, BAR.top[1]], { tone: "mid" }, { r: 0.3 });
box("bar.top", [-BAR.w / 2, CO.y1, BAR.top[0]], [BAR.w / 2, FR.y0, BAR.top[1]], { tone: "mid" }, { r: 0.2 });
box("bar.bot", [-BAR.w / 2, CO.y1, BAR.bot[0]], [BAR.w / 2, FR.y0, BAR.bot[1]], { tone: "mid" }, { r: 0.2 });
// la placa de presión cuelga de un rodillo sobre la barra portadora
box("press.hang", [-4, PR.y0 + 1, PR.z1], [4, PR.y1 - 1, BAR.top[0]], { tone: "mid" }, { r: 0.3, owner: "press" });
// tornillos tensores del lado que queda (x < 0), con arandela y tuerca en cada placa
// el tornillo se dibuja en sus tramos a la vista: entre las dos placas y las puntas que salen de las tuercas
BO.z.forEach((z, j) => {
  disc(`bolt${j}`, YA([BO.x, 0, z]), PR.y1, FR.y0, BO.r, { tone: "hi" }, {});
  disc(`bolt${j}.e0`, YA([BO.x, 0, z]), BO.y0, PR.y0 - 3.2, BO.r, { tone: "hi" }, { owner: `bolt${j}` });
  disc(`bolt${j}.e1`, YA([BO.x, 0, z]), FR.y1 + 3.2, BO.y1, BO.r, { tone: "hi" }, { owner: `bolt${j}` });
  [[PR.y0, -1], [FR.y1, 1]].forEach(([y, s], q) => {
    disc(`bolt${j}.w${q}`, YA([BO.x, 0, z]), s > 0 ? y : y - 0.6, s > 0 ? y + 0.6 : y, 3.4, { tone: "mid" }, { owner: `bolt${j}` });
    disc(`bolt${j}.n${q}`, YA([BO.x, 0, z]), s > 0 ? y + 0.6 : y - 3.2, s > 0 ? y + 3.2 : y - 0.6, 2.9, { tone: "mid" }, { owner: `bolt${j}`, extra: Dots([at([BO.x, s > 0 ? y + 3.2 : y - 3.2, z])], { size: 0.5 }) });
  });
});
// las cuatro boquillas en la cara de la placa fija: el caliente por −x (arriba entra), el frío por +x (abajo entra)
const NOZ = {};
[["hIn", -PO.x, PO.zt], ["hOut", -PO.x, PO.zb], ["cIn", PO.x, PO.zb], ["cOut", PO.x, PO.zt]].forEach(([nm, x, z]) => {
  const F = YA([x, 0, z]);
  disc(`noz.${nm}`, F, FR.y1, FR.y1 + NZ.len - 1.8, NZ.r, { tone: "mid" }, { owner: "frame" });
  disc(`noz.${nm}.fl`, F, FR.y1 + NZ.len - 1.8, FR.y1 + NZ.len, NZ.fr, { tone: "mid" }, { owner: `noz.${nm}`, extra: Dots(G.dotsOf(G.frameAlong([x, FR.y1 + NZ.len, z], YD), 0, NZ.fr - 2, 8, P, { least: 0.05 }), { size: 0.42 }) });
  NOZ[nm] = [x, FR.y1 + NZ.len, z];
});
// placa de datos en la cara de la placa fija
box("tag", [24, FR.y1, 112], [37, FR.y1 + 0.4, 124], { tone: "hi" }, { r: 0.1, owner: "frame",
  extra: Ln([0, 1, 2].map((i) => path3([[25.5, FR.y1 + 0.4, 121 - 3 * i], [35.5, FR.y1 + 0.4, 121 - 3 * i]])).join(""), { tone: "faint" }) + Dots([at([24.8, FR.y1 + 0.4, 123.2]), at([36.2, FR.y1 + 0.4, 112.8])], { size: 0.35 }) });

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
R_.items.forEach((it) => { if (it.live) it.svg = `<g data-live="${it.name}"></g>`; });
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
const label = "Intercambiador de placas con empaques en isométrico, con el paquete abierto por el plano de su eje: la placa fija con sus cuatro boquillas, la barra portadora y la barra guía, la columna de apoyo, la placa de presión, los tornillos tensores y las placas con los canales alternos del caliente y del frío";
const svg = k.figureSvg({ width: W, height: H, label, body: [`<g class="pl-items">${groups.join("")}</g>`] }).replace("<svg ", `<svg id="plSvg" `);
const DATA = { P, W, H, AZ, EL, Z0, Z1, GK: PX.GK, ch: CH, noz: NOZ };
writeFileSync(join(HERE, "out", "placas.svg"), svg);
writeFileSync(join(HERE, "out", "placas.json"), JSON.stringify(DATA));
writeJs();
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Intercambiador de placas", theme: "light", width: 1000, body: `<style>${readFileSync(join(HERE, "pl.css"), "utf8")}</style><div class="iso-stage" id="plFig">${svg}</div>`, script: readFileSync(join(HERE, "out", "fig.js"), "utf8") + "\nvar PL_DATA = " + JSON.stringify(DATA) + ";\n" + readFileSync(join(HERE, "drive_test.js"), "utf8") }));
console.log("placas items", R_.items.length, "scale", G.scaleOf(P).toFixed(3), "svg", svg.length);
if (!FAST) A.auditOrExit(R_, P, {});
