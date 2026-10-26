/* ====================================================================
   Válvula de control de globo en isométrico (skill anatomy), para el capítulo 12 del libro de operaciones unitarias
   (Válvulas, tuberías y medición de flujo).
   Concepto: el agua entra por la izquierda, baja por la galería de abajo, sube por el puerto del asiento y sale por
   la galería de arriba: el paso en S. El obturador perfilado, colgado del vástago, decide cuánto puerto queda abierto.
   Arriba, el actuador de diafragma y resorte: el aire entra debajo del diafragma y lo levanta (aire para abrir); si
   falta el aire, el resorte empuja el obturador contra el asiento (falla cerrada). El posicionador, en la arcada,
   lee la carrera con su palanca y manda el aire al actuador.
   Corte: se quita la mitad del cuerpo, del bonete y de la línea que mira al lector (el plano del flujo, y = 0). El
   obturador, el vástago, la arcada y el posicionador van enteros. A la caja del actuador se le quita un cuarto
   (x > 0, y > 0) para ver el diafragma, el plato y el resorte.
   Uso: node build.mjs [--audit] [--fast] [--carrera 0.6]
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
const argNum = (flag, d) => { const i = process.argv.indexOf(flag); return i > 0 ? Number(process.argv[i + 1]) : d; };
const VC = GEO.VC;
VC.open = Math.max(0, Math.min(1, argNum("--carrera", VC.open)));
const LIFT = GEO.lift(), ZP = GEO.zPlug(), DZ = VC.dz;   // DZ: lo que sube todo lo de arriba del bonete

const W = 760, H = 900;
const EXT = [[-VC.pipe.end, -VC.fl.r, -VC.fl.r], [VC.pipe.end, -VC.fl.r, -VC.fl.r], [-VC.pipe.end, 0, VC.fl.r], [VC.pipe.end, 0, VC.fl.r],
  [-VC.act.rf, -VC.act.rf, VC.act.zf], [VC.act.rf, -VC.act.rf, VC.act.zf], [-VC.act.rf, VC.act.rf, VC.act.zf], [0, 0, VC.act.top + 24], [0, -90, VC.act.top], [-64, -64, VC.act.top], [64, -64, VC.act.top], [-90, 0, VC.act.top], [-150, 40, 200 + DZ]];
const P = k.fitProjection(EXT, W, H, { pad: 16, azimuth: VC.AZ, elevation: VC.EL });
const C = X.xCam(P);
const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const f1 = (v) => (Math.round(v * 100) / 100).toString();
const pth = (pts, closed = true) => pts.map(([x, y], i) => (i ? "L" : "M") + f1(x) + " " + f1(y)).join("") + (closed ? "Z" : "");
const XD = [1, 0, 0], YD = [0, 1, 0], ZD = [0, 0, 1];
const V3 = G.viewOf(P), L3 = G.lightOf(P);

const R_ = A.recorder(P, { order: [], spring: {} });
const record = R_.solid;
const put = (name, ref, svg, shapes = [], rest = {}) => R_.put({ piece: "frame", ride: "frame", name, at: ref, svg, shapes, move: [0, 0, 0], ...rest });
const wrap = (body, cls) => (cls ? `<g class="${cls}">${body}</g>` : body);
function box(name, [x0, y0, z0], [x1, y1, z1], style = {}, { r = 0.4, steps = 2, bevel = 0, extra = "", ground, owner, cls = "" } = {}) {
  const plan = { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r };
  const shape = record(A.slab(plan, z0, z1 - z0, { name, ground, owner }, steps));
  put(name, [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2], wrap(S(k.slabOf(plan, z0, z1 - z0, P, steps, bevel), { tone: "mid", ...style }) + extra, cls), [shape]);
  return shape;
}
// prisma en un marco cualquiera (sección en u, v; a lo largo de a)
function fp(name, F, poly, s0, s1, style = {}, { extra = "", skip = null, cls = "", cut = null, ref = null, cap = "auto", owner, ground, shapes = null } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name, owner, ...(cut ? { cut } : {}), ...(ground ? { ground } : {}) }));
  const cu = poly.reduce((q, p) => q + p[0], 0) / poly.length, cv = poly.reduce((q, p) => q + p[1], 0) / poly.length;
  const centre = ref || G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
  put(name, centre, X.prismSvg(C, poly, s0, s1, { F, tone: "mid", ...style, skip, cls, cap }) + extra, shapes || [shape]);
  return shape;
}
function turned(name, F, profile, style = {}, { extra = "", rims, owner, smooth, steps = 48, bevel = 0, cls = "", hole = null, cut = null, fill, ground } = {}) {
  const opts = { bevel, ...(rims ? { rims } : {}), ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}), ...(hole ? { hole } : {}), ...(fill ? { fill } : {}) };
  const paths = G.solidOf(profile, F, P, opts);
  const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
  const shape = record(A.solid(F, profile, { name, owner, ground, radius: smooth && smooth.radius ? smooth.radius : null, ...(cut ? { cut } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, mid)), wrap(S(paths, { tone: "mid", ...style }) + extra, cls), [shape]);
  return shape;
}
// un cilindro corto (perno, pasador, tapón): prisma de sección circular, liviano; se registra el cilindro verdadero
function disc(name, F, s0, s1, r, style = {}, { extra = "", owner, cls = "", ground, n = 0 } = {}) {
  const m = n || Math.max(12, Math.min(40, Math.round((r * G.scaleOf(P)) / 1.6)));
  const poly = Array.from({ length: m }, (_, i) => { const t = (2 * Math.PI * i) / m; return [r * Math.cos(t), r * Math.sin(t)]; });
  const shape = record(A.disc(F, Math.min(s0, s1), Math.max(s0, s1), r, { name, owner, ...(ground ? { ground } : {}) }));
  put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), wrap(X.prismSvg(C, poly, Math.min(s0, s1), Math.max(s0, s1), { F, tone: "mid", ...style }), cls) + extra, [shape]);
  return shape;
}
function tubeItems(name, route, r, { tone = "mid", maxLength = 14, gaps = [], cls = "", caps = true, breaks = [], ends = [true, true], touch, limp = false, spacing = null } = {}) {
  R_.route(name, route, r, { owner: name, gaps, ends, touch, limp, piece: "frame", move: [0, 0, 0], ride: "frame" });
  tubePieces(route, r, P, { maxLength, spacing: spacing ?? Math.max(0.6, Math.min(2.2, r * 0.5)), gaps, caps, breaks }).forEach((part, index) => {
    const svg = tubeSvg(part, { tone });
    R_.put({ piece: "frame", ride: "frame", at: part.mid, svg: wrap(svg, cls), move: [0, 0, 0], name: `${name}:${index}`, route: name, chunk: index, shapes: [A.tube(part.points, part.radii)] });
  });
}

/* ---------- marcos, cortes y superficies de revolución con tonos suaves ---------- */
const FRONT = A.box([-4000, 0, -4000], [4000, 4000, 4000]);         // lo que se quita del cuerpo, del bonete y de la línea
const QUARTER = A.box([0, 0, -4000], [4000, 4000, 4000]);           // el cuarto que se quita del actuador
const BACKQ = [A.box([-4000, -4000, -4000], [0, 4000, 4000]), A.box([-4000, -4000, -4000], [4000, 0, 4000])];  // el resto
const BIG = A.box([-4000, -4000, -4000], [4000, 4000, 4000]);
const FXo = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: XD, u: ZD, v: YD });       // a lo largo de x; sección (z, y), mitad y ≤ 0
const FZo = (x = 0, y = 0, z = 0) => ({ o: [x, y, z], a: ZD, u: XD, v: YD });       // a lo largo de z; sección (x, y), mitad y ≤ 0
const FY0 = { o: [0, 0, 0], a: YD, u: XD, v: ZD };                                 // el plano del corte: sección (x, z)
const half = (r0, r1, n = 40) => GEO.halfRing(r0, r1, n);
const BAND = (s) => { const B = [0, 0.2, 0.42, 0.62]; let t = 0; while (t < B.length && s >= B[t]) t++; return t; };
const pr = (p) => C.pr(p[0], p[1], p[2]);
const r10 = (v) => { const t = (Math.round(v * 10) / 10).toFixed(1).replace(/\.0$/, ""); return t === "-0" ? "0" : t; };
const pth1 = (pts) => pts.map(([x, y], i) => (i ? "L" : "M") + r10(x) + " " + r10(y)).join("") + "Z";
/* Una superficie paramétrica P3(f, u), con su normal N3(f, u), en franjas de f (de f0 a f1) y de u (de 0 a 1). En
   cada franja los tramos del mismo tono van juntos y el borde entre dos tonos se busca por bisección en los dos lados
   de la franja, así sigue la curva real y no hace escalones. keep(p) deja fuera lo que no es de esta pieza. */
function surface(P3, N3, f0, f1, nf, nu, out, keep = null) {
  const cls = (f, u) => { const n = N3(f, u); return G.dot3(n, V3) <= 1e-4 || (keep && !keep(P3(f, u))) ? -1 : BAND(G.dot3(n, L3)); };
  const fOf = (i) => f0 + ((f1 - f0) * i) / nf;
  if (nu === 1) {
    const bands = [];
    for (let i = 0; i < nf; i++) bands.push(cls((fOf(i) + fOf(i + 1)) / 2, 0.5));
    for (let i = 0; i < nf; ) {
      let j = i; while (j + 1 < nf && bands[j + 1] === bands[i]) j++;
      if (bands[i] >= 0) {
        const pts = []; for (let q = i; q <= j + 1; q++) pts.push(P3(fOf(q), 0)); for (let q = j + 1; q >= i; q--) pts.push(P3(fOf(q), 1));
        const d = pth1(pts.map(pr)); out.by[bands[i]].push(d); out.fill.push(d);
      }
      i = j + 1;
    }
    return;
  }
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
      const d = pth1(pts.map(pr)); out.by[run.band].push(d); out.fill.push(d);
    });
  }
}
function toned(build, cls = "") {
  // sin relleno de papel: las franjas de tono se tocan y el trazo del mismo color (data-seamless) tapa las costuras
  const out = { by: [[], [], [], [], []], fill: [] };
  build(out);
  return `<g class="iso-solid${cls ? " " + cls : ""}" data-seamless="">` + out.by.slice(0, 4).map((d, i) => (d.length ? `<path class="iso-shade" data-shade="${i}" d="${d.join("")}"/>` : "")).join("") + (out.by[4].length ? `<path class="iso-top" d="${out.by[4].join("")}"/>` : "") + "</g>";
}
// una superficie de revolución alrededor del marco F: s de s0 a s1 con radio rr(s) y pendiente dr/ds; ángulo de f0 a f1
const revP = (F, s0, s1, rr) => (f, u) => { const s = s0 + (s1 - s0) * u; return G.pointOf(F, s, rr(s), f); };
const revN = (F, s0, s1, rr, dr, sg = 1) => (f, u) => { const s = s0 + (s1 - s0) * u; return G.mul3(G.unit3(G.sub3(G.radialOf(F, f), G.mul3(F.a, dr(s)))), sg); };
// el contorno visible (silueta) de una superficie de revolución: para cada s, el ángulo donde n·V = 0
function silhouette(F, s0, s1, rr, dr, f0, f1, n = 80, keep = null) {
  const out = [], cur = [[], []];
  const flush = (j) => { if (cur[j].length > 1) out.push(path3(cur[j])); cur[j] = []; };
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n, r = rr(s);
    const aV = G.dot3(F.a, V3), uV = G.dot3(F.u, V3), vV = G.dot3(F.v, V3), flat = Math.hypot(uV, vV), phi = Math.atan2(vV, uV);
    const c = (dr(s) * aV) / flat;
    [0, 1].forEach((j) => {
      if (r < 1e-6 || Math.abs(c) >= 1) return flush(j);
      let g = j ? phi - Math.acos(c) : phi + Math.acos(c);
      while (g < f0) g += 2 * Math.PI; while (g > f1) g -= 2 * Math.PI;
      if (g < f0 || g > f1) return flush(j);
      const p = G.pointOf(F, s, r, g);
      if (keep && !keep(p)) return flush(j);
      cur[j].push(p);
    });
  }
  flush(0); flush(1);
  return out.join("");
}
// una cara plana: polígono 3D con su normal; tono por la luz
function flatFace(pts, n) {
  const b = BAND(G.dot3(G.unit3(n), L3)), d = pth1(pts.map(pr));
  return { d, paint: b >= 4 ? `<path class="iso-top" d="${d}"/>` : `<path class="iso-shade" data-shade="${b}" d="${d}"/>` };
}
/* ====================================================================
   1 · la línea: tramo de tubo, brida de cuello soldable, empaque y espárragos, a cada lado
   ==================================================================== */
const PI = VC.pipe, FL = VC.fl, GK = VC.gasket, WN = VC.wn, BT = VC.bolt, FF = VC.ff;
const RB = VC.body.rbore;
const HEX = (rr) => Array.from({ length: 6 }, (_, i) => { const t = (Math.PI / 3) * i + Math.PI / 6; return [rr * Math.cos(t), rr * Math.sin(t)]; });
const boltPts = [[-1, 1], [-1, -1]].map(([sy, sz]) => [sy * FL.bc / Math.SQRT2, sz * FL.bc / Math.SQRT2]); // (y, z) de los dos espárragos de atrás
const holes = (x0, x1) => boltPts.map(([y, z]) => A.disc(FXo(0, y, z), x0 - 1, x1 + 1, BT.r + 1.6));
const cutStore = [];      // las caras del corte: [{ owner, poly (x, z), cls }]
const cutRect = (owner, x0, x1, z0, z1, cls = "vc-cut") => cutStore.push({ owner, poly: [[x0, z0], [x1, z0], [x1, z1], [x0, z1]], cls });
const cutRing = (owner, s0, s1, r0, r1, axis = "x", cls = "vc-cut") => {
  if (axis === "x") { cutRect(owner, Math.min(s0, s1), Math.max(s0, s1), r0, r1, cls); cutRect(owner, Math.min(s0, s1), Math.max(s0, s1), -r1, -r0, cls); }
  else { cutRect(owner, r0, r1, Math.min(s0, s1), Math.max(s0, s1), cls); cutRect(owner, -r1, -r0, Math.min(s0, s1), Math.max(s0, s1), cls); }
};
// medio anillo a lo largo de x (de s0 a s1, radios r0 a r1), con su cara de corte
function halfX(name, s0, s1, r0, r1, style = {}, { owner, cut = null, cls = "", cap = "auto", ground, cutCls = "vc-cut", extra = "" } = {}) {
  const sh = fp(name, FXo(), half(r0, r1, 20), Math.min(s0, s1), Math.max(s0, s1), style, { owner, cut, cls, cap, ground, extra });
  cutRing(owner || name, s0, s1, r0, r1, "x", cutCls);
  return sh;
}
function halfZ(name, s0, s1, r0, r1, style = {}, { owner, cut = null, cls = "", cap = "auto", ground, cutCls = "vc-cut", extra = "", noCut = false } = {}) {
  const sh = fp(name, FZo(), half(r0, r1, 20), Math.min(s0, s1), Math.max(s0, s1), style, { owner, cut, cls, cap, ground, extra });
  if (!noCut) cutRing(owner || name, s0, s1, r0, r1, "z", cutCls);
  return sh;
}
const SIDES = [-1, 1];
SIDES.forEach((sg) => {
  const tag = sg < 0 ? "in" : "out", own = `line.${tag}`;
  const xg0 = FF, xg1 = FF + GK.t, xr1 = xg1 + FL.rft, xd1 = xr1 + FL.t, xh1 = xg1 + WN.len, xe = PI.end;
  const X_ = (v) => sg * v;
  // el empaque
  halfX(`${own}.gasket`, X_(xg0), X_(xg1), GK.ri, GK.ro, { tone: "lo" }, { owner: own, cls: "vc-gasket", cutCls: "vc-cut-gk" });
  // la brida de cuello soldable: cara realzada, disco y cuello cónico
  halfX(`${own}.wn.rf`, X_(xg1), X_(xr1), PI.ri, FL.rf, { tone: "mid" }, { owner: own });
  const dsh = fp(`${own}.wn.disc`, FXo(), half(PI.ri, FL.r, 28), Math.min(X_(xr1), X_(xd1)), Math.max(X_(xr1), X_(xd1)), { tone: "mid" }, { owner: own, cut: holes(Math.min(X_(xr1), X_(xd1)), Math.max(X_(xr1), X_(xd1))) });
  cutRing(own, X_(xr1), X_(xd1), PI.ri, FL.r);
  // el cuello cónico: superficie de revolución de rh a ro, con su paso
  {
    const F = { o: [0, 0, 0], a: [sg, 0, 0], u: ZD, v: [0, sg, 0] };
    const s0 = xd1, s1 = xh1, rr = (s) => WN.rh + (PI.ro - WN.rh) * ((s - s0) / (s1 - s0)), dr = () => (PI.ro - WN.rh) / (s1 - s0);
    // la mitad de atrás (y ≤ 0): con v = (0, sg, 0), f de π a 2π si sg = 1 y de 0 a π si sg = −1
    const fa = sg > 0 ? Math.PI : 0, fb = fa + Math.PI;
    const svg = toned((o) => surface(revP(F, s0, s1, rr), revN(F, s0, s1, rr, dr), fa, fb, 36, 1, o)) +
      Ln(silhouette(F, s0, s1, rr, dr, fa, fb, 30), { tone: "mid" }) + Ln(G.arcOf(F, s1, PI.ro, P, { from: fa, to: fb, least: 0.02, slope: dr(0) }), { tone: "mid" });
    // el paso del cuello por dentro (se pinta primero) y el cono por fuera, en un solo elemento
    const svgI = toned((o) => surface(revP(F, s0, s1, () => PI.ri), revN(F, s0, s1, () => PI.ri, () => 0, -1), fa, fb, 36, 1, o));
    put(`${own}.wn.hub`, [X_((s0 + s1) / 2), -20, 20], svgI + svg, [record(A.body(F, [[s0, PI.ri], [s0, WN.rh], [s1, PI.ro], [s1, PI.ri]], { name: `${own}.wn.hub`, owner: own, cut: [FRONT] }))]);
    cutStore.push({ owner: own, poly: [[X_(s0), PI.ri], [X_(s0), WN.rh], [X_(s1), PI.ro], [X_(s1), PI.ri]], cls: "vc-cut" });
    cutStore.push({ owner: own, poly: [[X_(s0), -PI.ri], [X_(s0), -WN.rh], [X_(s1), -PI.ro], [X_(s1), -PI.ri]], cls: "vc-cut" });
  }
  // el cordón de soldadura y el tramo de tubo
  // el cordón de soldadura con el tramo de tubo que cubre (un anillo, no un collar alrededor del tubo) y el resto del tubo
  halfX(`${own}.weld`, X_(xh1), X_(xh1 + 4), PI.ri, PI.ro + 1.4, { tone: "lo" }, { owner: own });
  halfX(`${own}.pipe`, X_(xh1 + 4), X_(xe), PI.ri, PI.ro, { tone: "mid" }, { owner: own, ground: true });
  // los dos espárragos de atrás, con sus tuercas a los dos lados
  boltPts.forEach(([y, z], j) => {
    const bn = `${own}.bolt${j}`, xv = FF - FL.rft - FL.t;        // cara de atrás de la brida de la válvula
    const nutA = [X_(xv - BT.nh), X_(xv)], nutB = [X_(xd1), X_(xd1 + BT.nh)];
    [nutA, nutB].forEach(([a, b], q) => fp(`${bn}.nut${q}`, FXo(0, y, z), HEX(BT.nut / Math.cos(Math.PI / 6)), Math.min(a, b), Math.max(a, b), { tone: "mid" }, { owner: bn }));
    // el espárrago se ve en tres trozos: la punta de cada lado y el tramo entre las dos bridas
    const FB = { o: [0, y, z], a: XD, u: ZD, v: YD };
    [[xv - BT.nh - BT.out, xv - BT.nh, "a"], [FF - FL.rft, xr1, "b"], [xd1 + BT.nh, xd1 + BT.nh + BT.out, "c"]].forEach(([a, b, t]) => disc(`${bn}.stud.${t}`, FB, Math.min(X_(a), X_(b)), Math.max(X_(a), X_(b)), BT.r, { tone: "mid" }, { owner: bn }));
  });
});

/* ====================================================================
   2 · el cuerpo: bridas, cuellos, el globo con su paso en S y el asiento del bonete
   ==================================================================== */
const BD = VC.body, XN = GEO.xNeck(), XB = GEO.xBore(), BS = VC.boss, DK = VC.deck;
const ellO = (th) => [BD.ax * Math.cos(th), BD.b * Math.sin(th)], ellI = (th) => [BD.axi * Math.cos(th), BD.bi * Math.sin(th)];
const arc = (fn, t0, t1, n = 24) => Array.from({ length: n + 1 }, (_, i) => fn(t0 + ((t1 - t0) * i) / n));
const thO = (x, z) => Math.atan2(z / BD.b, x / BD.ax), thI = (x, z) => Math.atan2(z / BD.bi, x / BD.axi);
const zBossO = BD.b * Math.sqrt(1 - (BS.r / BD.ax) ** 2), zBossI = BD.bi * Math.sqrt(1 - (BS.rb / BD.axi) ** 2);
const B1 = GEO.hitInner(GEO.w1Right, DK.z1, 68), B1l = GEO.hitInner(GEO.w1Left, DK.z0, 68);
const B3 = GEO.hitInner(GEO.w3Upper, DK.z1, -68), B3l = GEO.hitInner(GEO.w3Lower, DK.z0, -68);
const xr1 = FF - FL.rft, xd0 = FF - FL.rft - FL.t;
// la rosca entre el anillo de asiento y el puente: diente de 1 mm cada 1,8 mm (14 hilos por pulgada)
function thread(sg, down) {
  const pts = [[sg * DK.rport, DK.z1]];
  for (let z = DK.z1 - 1, i = 0; z > DK.z0 + 0.95; z -= 0.9, i++) pts.push([sg * (DK.rport - (i % 2 ? 0 : 1)), z]);
  pts.push([sg * DK.rport, DK.z0]);
  return down ? pts : pts.reverse();
}
// las bridas y los cuellos de la válvula
SIDES.forEach((sg) => {
  const own = "body", tag = sg < 0 ? "in" : "out", X_ = (v) => sg * v;
  halfX(`body.rf.${tag}`, X_(xr1), X_(FF), RB, FL.rf, { tone: "mid" }, { owner: own, cls: "vc-cast" });
  fp(`body.fl.${tag}`, FXo(), half(RB, FL.r, 28), Math.min(X_(xd0), X_(xr1)), Math.max(X_(xd0), X_(xr1)), { tone: "mid" }, { owner: own, cls: "vc-cast", cut: holes(Math.min(X_(xd0), X_(xr1)), Math.max(X_(xd0), X_(xr1))) });
  fp(`body.neck.${tag}`, FXo(), half(RB, BD.rn, 20), Math.min(X_(XN), X_(xd0)), Math.max(X_(XN), X_(xd0)), { tone: "mid" }, { owner: own, cls: "vc-cast", cap: "none" });
});
// el globo por fuera: la mitad de atrás del esferoide, sin lo que tapan los cuellos y el asiento del bonete
const FXG = { o: [0, 0, 0], a: XD, u: ZD, v: YD };
let GLOBE_SH = null, BOSS_SH = null;
const OUTERB = A.body(FXG, Array.from({ length: 49 }, (_, i) => { const x = -BD.ax + (2 * BD.ax * i) / 48; return [x, GEO.rOuter(x)]; }), { name: "body.exterior" });
const innerMerid = []; for (let i = 0; i <= 48; i++) { const x = -BD.axi + (2 * BD.axi * i) / 48; innerMerid.push([x, GEO.rInner(x)]); }
const INNER = A.body(FXG, innerMerid, { name: "body.cavidad" });
const inBoss = (p) => p[0] * p[0] + p[1] * p[1] < BS.r * BS.r && p[2] > 0;
{
  const rr = GEO.rOuter, dr = (s) => -(BD.b * BD.b * s) / (BD.ax * BD.ax * Math.max(1e-6, rr(s)));
  const keep = (p) => !inBoss(p);
  const svg = toned((o) => surface(revP(FXG, -XN, XN, rr), revN(FXG, -XN, XN, rr, dr), Math.PI, 2 * Math.PI, 44, 20, o, keep), "vc-cast") +
    Ln(silhouette(FXG, -XN, XN, rr, dr, Math.PI, 2 * Math.PI, 120, keep), { tone: "mid" });
  const merid = []; for (let i = 0; i <= 40; i++) { const x = -XN + (2 * XN * i) / 40; merid.push([x, rr(x)]); }
  // la pared entera del globo (de la cavidad a la piel), para que el corte la tape de frente
  // la cara de adentro con la misma poligonal que INNER, para que las piezas de adentro no se monten en la pared
  // la piel de afuera (lo que se dibuja): una cáscara delgada
  const shell = [...merid, ...merid.slice().reverse().map(([x, r]) => [x, r - 1.2])];
  GLOBE_SH = A.body(FXG, shell, { name: "body.globe", owner: "body", cut: [FRONT, A.disc(FZo(), 60.3, 200, BS.r)] });
  put("body.globe", [30, -40, 50], svg, [record(GLOBE_SH)]);
}
// el asiento del bonete por fuera: un cilindro de r = 58 que sale del globo hasta z = 100
{
  const F = FZo(), zb = (f) => { const x = BS.r * Math.cos(f), y = BS.r * Math.sin(f); return Math.sqrt(Math.max(0, BD.b * BD.b * (1 - (x * x) / (BD.ax * BD.ax)) - y * y)); };
  const P3 = (f, u) => { const z0 = zb(f); return [BS.r * Math.cos(f), BS.r * Math.sin(f), z0 + (BS.top - z0) * u]; };
  const N3 = (f) => [Math.cos(f), Math.sin(f), 0];
  const svg = toned((o) => surface(P3, N3, Math.PI, 2 * Math.PI, 90, 1, o), "vc-cast");
  // la costura con el globo: la curva de abajo, solo donde se ve
  const seam = []; for (let i = 0; i <= 90; i++) { const f = Math.PI + (Math.PI * i) / 90; if (G.dot3(N3(f), V3) > 0.02) seam.push(P3(f, 0)); }
  const sil = []; [0, 1].forEach((u) => {}); // la silueta del cilindro la dan sus generatrices extremas
  const fS = Math.atan2(V3[1], V3[0]) - Math.PI / 2 + 2 * Math.PI; // el borde visible de la mitad de atrás
  const edge = path3([P3(fS, 0), P3(fS, 1)]);
  put("body.boss", [BS.r * 0.7, -BS.r * 0.4, (zBossO + BS.top) / 2], svg + Ln((seam.length > 1 ? path3(seam) : "") + edge, { tone: "mid" }),
    [record((BOSS_SH = A.body(FZo(), [[60.3, BS.r - 1.2], [60.3, BS.r], [BS.top, BS.r], [BS.top, BS.r - 1.2]], { name: "body.boss", owner: "body", cut: [FRONT, OUTERB] })))]);
}
// la cara del corte del cuerpo: tres piezas (arriba a la izquierda, abajo y arriba a la derecha)
{
  const U = [[-FF, RB], [-FF, FL.rf], [-xr1, FL.rf], [-xr1, FL.r], [-xd0, FL.r], [-xd0, BD.rn], [-XN, BD.rn],
    ...arc(ellO, Math.PI - thO(XN, BD.rn), Math.PI - Math.acos(BS.r / BD.ax)).slice(1, -1),
    [-BS.r, zBossO], [-BS.r, BS.top], [-BS.rb, BS.top], [-BS.rb, zBossI],
    ...arc(ellI, thI(-BS.rb, zBossI), thI(B1[0], B1[1])).slice(1, -1),
    B1, [GEO.w1Right(DK.z1), DK.z1], ...thread(-1, true), [GEO.w1Left(DK.z0), DK.z0], B1l,
    ...arc(ellI, thI(B1l[0], B1l[1]), thI(-XB, RB)).slice(1, -1), [-XB, RB]];
  const Rr = [[FF, RB], [FF, FL.rf], [xr1, FL.rf], [xr1, FL.r], [xd0, FL.r], [xd0, BD.rn], [XN, BD.rn],
    ...arc(ellO, thO(XN, BD.rn), Math.acos(BS.r / BD.ax)).slice(1, -1),
    [BS.r, zBossO], [BS.r, BS.top], [BS.rb, BS.top], [BS.rb, zBossI],
    ...arc(ellI, thI(BS.rb, zBossI), thI(XB, RB)).slice(1, -1), [XB, RB]].reverse();
  const tB3 = thI(B3[0], B3[1]), tB3l = thI(B3l[0], B3l[1]) + 2 * Math.PI;
  const Lw = [[-FF, -RB], [-XB, -RB], ...arc(ellI, Math.PI + thI(XB, RB), tB3l, 60).slice(1, -1).map(([x, z]) => [x, z]),
    B3l, [GEO.w3Lower(DK.z0), DK.z0], ...thread(1, false), [GEO.w3Upper(DK.z1), DK.z1], B3,
    ...arc(ellI, tB3, -thI(XB, RB)).slice(1, -1), [XB, -RB], [FF, -RB], [FF, -FL.rf], [xr1, -FL.rf], [xr1, -FL.r], [xd0, -FL.r], [xd0, -BD.rn], [XN, -BD.rn],
    ...arc(ellO, -thO(XN, BD.rn), -Math.PI + thO(XN, BD.rn), 60).slice(1, -1),
    [-XN, -BD.rn], [-xd0, -BD.rn], [-xd0, -FL.r], [-xr1, -FL.r], [-xr1, -FL.rf], [-FF, -FL.rf]];
  [U, Rr, Lw].forEach((poly) => cutStore.push({ owner: "body", poly, cls: "vc-cut" }));
}

/* ---------- el globo por dentro: lo que se ve por el corte ---------- */
const OUTSIDE_IN = A.box([-4000, -4000, -4000], [4000, 4000, 4000], { cut: [INNER] });  // todo menos el interior del globo
const rhoI = (x, z) => Math.sqrt(Math.max(0, BD.bi * BD.bi * (1 - (x * x) / (BD.axi * BD.axi)) - z * z));
const VOID = [
  [[-FF, -RB], [FF, -RB], [FF, RB], [-FF, RB]],
  arc(ellI, 0, 2 * Math.PI, 96),
  [[-BS.rb, 0], [BS.rb, 0], [BS.rb, BS.top], [-BS.rb, BS.top]],
].map((poly) => pth1(poly.map(([x, z]) => pr([x, 0, z])))).map((d) => `<path d="${d}"/>`).join("");
const DEFS = [`<clipPath id="vcVoid">${VOID}</clipPath>`];
/* Lo que se ve por la abertura del corte va recortado a ella; su forma registrada también: la parte de la pieza que cae
   dentro del prisma que la abertura proyecta a lo largo de la mirada (así el audit mide lo mismo que se dibuja). */
const CAM = A.cameraBasis(P);
const FV = { o: [0, 0, 0], a: CAM.V, u: CAM.R, v: CAM.D };
const VOIDP = [[[-FF, -RB], [FF, -RB], [FF, RB], [-FF, RB]], arc(ellI, 0, 2 * Math.PI, 36).slice(0, -1), [[-BS.rb, 0], [BS.rb, 0], [BS.rb, BS.top], [-BS.rb, BS.top]]]
  .map((poly) => A.prism(FV, poly.map(([x, z]) => [G.dot3([x, 0, z], CAM.R), G.dot3([x, 0, z], CAM.D)]), -4000, 4000));
const CLIPV = A.box([-4000, -4000, -4000], [4000, 4000, 4000], { cut: VOIDP });
{
  const rr = GEO.rInner, dr = (s) => -(BD.bi * BD.bi * s) / (BD.axi * BD.axi * Math.max(1e-6, rr(s)));
  const keep = (p) => !(p[0] * p[0] + p[1] * p[1] < BS.rb * BS.rb && p[2] > 0);
  const svg = toned((o) => {
    surface(revP(FXG, -XB, XB, rr), revN(FXG, -XB, XB, rr, dr, -1), Math.PI, 2 * Math.PI, 36, 16, o, keep);
    // el paso entre el globo y el cuello, a cada lado
    [[-XN, -XB], [XB, XN]].forEach(([a, b]) => surface(revP(FXG, a, b, () => RB), revN(FXG, a, b, () => RB, () => 0, -1), Math.PI, 2 * Math.PI, 36, 1, o));
    // el agujero del bonete en el asiento, de la cavidad a la cara de arriba
    const zb = (f) => { const x = BS.rb * Math.cos(f), y = BS.rb * Math.sin(f); return Math.sqrt(Math.max(0, BD.bi * BD.bi * (1 - (x * x) / (BD.axi * BD.axi)) - y * y)); };
    surface((f, u) => { const z0 = zb(f); return [BS.rb * Math.cos(f), BS.rb * Math.sin(f), z0 + (BS.top - z0) * u]; }, (f) => [-Math.cos(f), -Math.sin(f), 0], Math.PI, 2 * Math.PI, 36, 1, o);
  }, "vc-cast");
  const shell = [...innerMerid.filter(([x]) => Math.abs(x) <= XB + 1e-6), ...innerMerid.filter(([x]) => Math.abs(x) <= XB + 1e-6).reverse().map(([s, r]) => [s, r + 1.2])];
  const shellI = [...innerMerid.filter(([x]) => Math.abs(x) <= XB + 1e-6), ...innerMerid.filter(([x]) => Math.abs(x) <= XB + 1e-6).reverse().map(([x, r]) => [x, r + 1.2])];
  put("body.inner", [0, -50, -10], `<g clip-path="url(#vcVoid)">${svg}</g>`, [
    record(A.body(FXG, shellI, { name: "body.inner", owner: "body", cut: [FRONT, A.disc(FZo(), 0, 200, BS.rb), CLIPV] })),
    record(A.ring(FXG, XB, XN, RB, RB + 1.2, { name: "body.inner", owner: "body", cut: [FRONT, CLIPV] })),
    record(A.ring(FXG, -XN, -XB, RB, RB + 1.2, { name: "body.inner", owner: "body", cut: [FRONT, CLIPV] })),
    record(A.ring(FZo(), 63.2, BS.top, BS.rb, BS.rb + 1.2, { name: "body.inner", owner: "body", cut: [FRONT, CLIPV] })),
  ]);
}
// el tabique en S: la cara del tabique de la entrada que mira a la cámara de arriba, la cara de arriba del puente y la
// cara del tabique de la salida que mira a la salida. Cada una termina atrás en la pared del globo.
function webFace(name, xOf, zA, zB, n, section, z0, z1) {
  const N = 30, front = [], back = [];
  for (let i = 0; i <= N; i++) { const z = zA + ((zB - zA) * i) / N, x = xOf(z); front.push([x, 0, z]); back.push([x, -rhoI(x, z), z]); }
  const face = flatFace([...front, ...back.reverse()], n);
  const crease = path3(back.slice().reverse());
  const svg = `<g class="iso-solid vc-cast"><path class="iso-fill" d="${face.d}"/>${face.paint}${Ln(crease, { tone: "lo" })}</g>`;
  put(name, [xOf((zA + zB) / 2), -25, (zA + zB) / 2], `<g clip-path="url(#vcVoid)">${svg}</g>`, [record(A.prism(FY0, section, -80, 0, { name, owner: "body", cut: [OUTSIDE_IN, CLIPV] }))]);
}
webFace("body.w1", GEO.w1Right, DK.z1, B1[1], [1, 0, -VC.w1.dx], [[GEO.w1Right(DK.z1), DK.z1], [GEO.w1Right(80), 80], [GEO.w1Left(80), 80], [GEO.w1Left(DK.z0), DK.z0]]);
webFace("body.w3", GEO.w3Upper, DK.z1, B3[1], [1, 0, VC.w3.dx], [[GEO.w3Lower(DK.z0), DK.z0], [GEO.w3Lower(-80), -80], [GEO.w3Upper(-80), -80], [GEO.w3Upper(DK.z1), DK.z1]]);
{
  /* La cara de arriba del puente, en tres pedazos alrededor del hombro del anillo de asiento (r = 35): a la izquierda,
     a la derecha y detrás. Así ninguno queda a la vez delante y detrás del anillo. Se registra una losa delgada. */
  const xa = GEO.w1Right(DK.z1), xb = GEO.w3Upper(DK.z1), RS = VC.seat.rsh, z = DK.z1;
  const back = (x) => -rhoI(x, z);
  const piece = (name, plan, lines) => {
    const face = flatFace(plan.map(([x, y]) => [x, y, z]), [0, 0, 1]);
    const svg = `<g class="iso-solid vc-cast"><path class="iso-fill" d="${face.d}"/>${face.paint}${lines}</g>`;
    const cx = plan.reduce((q, p) => q + p[0], 0) / plan.length, cy = plan.reduce((q, p) => q + p[1], 0) / plan.length;
    put(name, [cx, cy, z], `<g clip-path="url(#vcVoid)">${svg}</g>`, [record(A.prism(FZo(), plan, z - 0.8, z, { name, owner: "body", cut: [OUTSIDE_IN, CLIPV] }))]);
  };
  const strip = (x0, x1) => { const f = [], b2 = []; for (let i = 0; i <= 8; i++) { const x = x0 + ((x1 - x0) * i) / 8; f.push([x, 0]); b2.push([x, back(x)]); } return [...f, ...b2.reverse()]; };
  piece("body.deck.izq", strip(xa, -RS), Ln(path3([[xa, 0, z], [xa, back(xa), z]]), { tone: "lo" }) + Ln(path3(strip(xa, -RS).slice(9).map(([x, y]) => [x, y, z])), { tone: "lo" }));
  piece("body.deck.der", strip(RS, xb), Ln(path3([[xb, 0, z], [xb, back(xb), z]]), { tone: "mid" }) + Ln(path3(strip(RS, xb).slice(9).map(([x, y]) => [x, y, z])), { tone: "lo" }));
  const arcB = [], backB = [];
  for (let i = 0; i <= 24; i++) { const t = Math.PI + (Math.PI * i) / 24; arcB.push([RS * Math.cos(t), RS * Math.sin(t)]); }
  for (let i = 24; i >= 0; i--) { const x = -RS + (2 * RS * i) / 24; backB.push([x, back(x)]); }
  piece("body.deck.atras", [...arcB, ...backB], Ln(path3(backB.map(([x, y]) => [x, y, z])), { tone: "lo" }));
}

/* ---------- el anillo de asiento, roscado en el puente (cortado) ---------- */
const SR = VC.seat;
{
  const F = FZo(), fa = Math.PI, fb = 2 * Math.PI;
  const svg = toned((o) => {
    surface(revP(F, SR.z0, SR.zb, () => SR.rp), revN(F, SR.z0, SR.zb, () => SR.rp, () => 0, -1), fa, fb, 36, 1, o);           // el puerto
    const bev = (s) => SR.rp + ((SR.rb - SR.rp) * (s - SR.zb)) / (SR.top - SR.zb), dB = () => (SR.rb - SR.rp) / (SR.top - SR.zb);
    surface(revP(F, SR.zb, SR.top, bev), revN(F, SR.zb, SR.top, bev, dB, -1), fa, fb, 36, 1, o);                                // la cara de asiento
    surface((f, u) => G.pointOf(F, SR.top, SR.rb + (SR.rsh - SR.rb) * u, f), () => [0, 0, 1], fa, fb, 36, 1, o);                    // el hombro
    surface(revP(F, SR.zsh, SR.top, () => SR.rsh), revN(F, SR.zsh, SR.top, () => SR.rsh, () => 0), fa, fb, 36, 1, o);               // por fuera
  }, "vc-trim");
  const rims = Ln(G.arcOf(F, SR.top, SR.rb, P, { from: fa, to: fb, least: -1, trim: 0 }) + G.arcOf(F, SR.zb, SR.rp, P, { from: fa, to: fb, least: -1, trim: 0 }), { tone: "lo" }) +
    Ln(G.arcOf(F, SR.top, SR.rsh, P, { from: fa, to: fb, least: -1, trim: 0 }), { tone: "mid" });
  const merid = [[SR.z0, SR.rp], [SR.zb, SR.rp], [SR.top, SR.rb], [SR.top, SR.rsh], [SR.zsh, SR.rsh], [SR.zsh, SR.rs], [SR.z0, SR.rs]];
  put("seat", [0, -20, 0], svg + rims, [record(A.body(F, merid, { name: "seat", owner: "seat", cut: [FRONT] }))]);
  const sec = (sg) => [[sg * SR.rp, SR.z0], [sg * SR.rp, SR.zb], [sg * SR.rb, SR.top], [sg * SR.rsh, SR.top], [sg * SR.rsh, SR.zsh], ...thread(sg, true).slice(0, -1).map(([x, z]) => [x, z]), [sg * SR.rs, SR.z0]];
  cutStore.push({ owner: "seat", poly: sec(1), cls: "vc-cut-tr" }, { owner: "seat", poly: sec(-1), cls: "vc-cut-tr" });
}

/* ---------- piezas de revolución cortadas: medio cuerpo (bonete) o tres cuartos (actuador) ---------- */
const FX0 = { o: [0, 0, 0], a: XD, u: YD, v: ZD };             // el otro plano del corte del actuador: sección (y, z)
const cutStoreX = [];
/* Un sólido de revolución alrededor de F (a = z) con su sección cerrada merid = [[s, r, liso?], …], de f0 a f1. Se
   dibujan sus superficies de atrás hacia adelante, cada una con sus aristas, y las caras del corte en los planos
   que lo limitan. Los vértices marcados lisos unen tramos con la normal interpolada, sin escalones. */
// el semiespacio de los puntos que quedan del lado horario (sg = −1) o antihorario (sg = 1) del rayo de ángulo f
const PIECES = {};
const sideOf = (f, sg) => { const n = sg < 0 ? [Math.sin(f), -Math.cos(f), 0] : [-Math.sin(f), Math.cos(f), 0]; return A.orientedBox(G.mul3(n, 2000), [n, [Math.cos(f), Math.sin(f), 0], [0, 0, 1]], [2000, 4000, 4000]); };
function revPart(name, F, merid, { f0 = Math.PI, f1 = 2 * Math.PI, cls = "vc-cast", cutCls = "vc-cut", owner = name, tone = "mid", extra = "", edgeTone = "mid", surfaces = true, skip = null, merge = false } = {}) {
  const merged = new Map();   // con merge, cada sector es un solo elemento con sus caras de atrás hacia adelante
  const pts = merid.map(([s, r, sm]) => ({ s, r, sm: !!sm }));
  const n = pts.length;
  let area = 0; for (let i = 0; i < n; i++) { const p = pts[i], q = pts[(i + 1) % n]; area += p.r * q.s - q.r * p.s; }
  const ccw = area > 0;
  const eN = (i) => { const p = pts[i], q = pts[(i + 1) % n], dr = q.r - p.r, ds = q.s - p.s, L = Math.hypot(dr, ds) || 1; return ccw ? [ds / L, -dr / L] : [-ds / L, dr / L]; };
  // los tramos: se corta en cada vértice no liso
  let start = pts.findIndex((p) => !p.sm); if (start < 0) start = 0;
  const runs = []; let cur = [start];
  for (let k2 = 1; k2 <= n; k2++) { const i = (start + k2) % n; cur.push(i); if (!pts[i].sm || k2 === n) { runs.push(cur); cur = [i]; } }
  const removed = f0 === Math.PI && f1 === 2 * Math.PI ? [FRONT] : [QUARTER];
  // el macizo no se dibuja: es el anfitrión de lo que se apoya en la pieza
  record(A.body(F, merid.map(([s, r]) => [s, r]), { name: name + ".macizo", owner, cut: removed }));
  // sectores de a lo sumo 90°, partidos también donde una pared vertical deja de verse por fuera y empieza a verse por
  // dentro (AZ ± 90°): así ninguna pieza queda a la vez delante y detrás de lo que hay adentro
  const sil = [(VC.AZ + 90) * Math.PI / 180, (VC.AZ + 270) * Math.PI / 180];
  const marks = [f0, f1]; for (let a = Math.ceil(f0 / (Math.PI / 2)) * (Math.PI / 2); a < f1 - 1e-6; a += Math.PI / 2) marks.push(a); for (const a of sil) if (a > f0 + 1e-6 && a < f1 - 1e-6) marks.push(a);
  const ms = [...new Set(marks.map((m) => +m.toFixed(9)))].sort((a, b) => a - b);
  const sectors = []; for (let i = 0; i < ms.length - 1; i++) if (ms[i + 1] - ms[i] > 1e-6) sectors.push([ms[i], ms[i + 1]]);
  let count = 0;
  for (const run of surfaces ? runs : []) {
    const segs = run.length - 1;
    if (run.every((i) => pts[i].r < 1e-6)) continue;
    if (skip && skip(pts[run[0]], pts[run[segs]])) continue;
    const vN = run.map((i, j) => { if (j === 0) return eN(run[0]); if (j === segs) return eN(run[segs - 1]); const a1 = eN(run[j - 1]), b1 = eN(run[j]); const m = [a1[0] + b1[0], a1[1] + b1[1]], L = Math.hypot(m[0], m[1]) || 1; return [m[0] / L, m[1] / L]; });
    const at = (u) => { const t = Math.min(segs - 1e-9, Math.max(0, u * segs)), j = Math.floor(t), w = t - j; const p = pts[run[j]], q = pts[run[j + 1]]; const nn = [vN[j][0] * (1 - w) + vN[j + 1][0] * w, vN[j][1] * (1 - w) + vN[j + 1][1] * w]; return { s: p.s + (q.s - p.s) * w, r: p.r + (q.r - p.r) * w, nr: nn[0], ns: nn[1] }; };
    const P3 = (f, u) => { const q = at(u); return G.pointOf(F, q.s, q.r, f); };
    const N3 = (f, u) => { const q = at(u); return G.add3(G.mul3(G.radialOf(F, f), q.nr), G.mul3(F.a, q.ns)); };
    // la cáscara delgada de este tramo, solo entre ua y ub (la parte que mira al lector), para el orden y el audit
    const shellOf = (ua, ub) => {
      const M = Math.max(2, Math.ceil(segs * 4 * (ub - ua))), sp = [];
      for (let i = 0; i <= M; i++) { const q = at(ua + ((ub - ua) * i) / M); sp.push([q.s, q.r, q.nr, q.ns]); }
      return [...sp.map(([s2, r]) => [s2, r]), ...sp.slice().reverse().map(([s2, r, nr, ns]) => [s2 - 0.8 * ns, Math.max(0, r - 0.8 * nr)])];
    };
    for (const [g0, g1] of sectors) {
      // la parte del sector que mira al lector: solo esa se registra, para que la cáscara no cuente vista por detrás
      // lo que mira al lector, en bandas a lo largo del perfil: cada banda con su propia cuña de ángulos visibles
      const NB = Math.min(8, Math.max(1, segs * 2)), bands = [];
      let fa = Infinity, fb = -Infinity;
      for (let q = 0; q < NB; q++) {
        let ba = Infinity, bb = -Infinity;
        for (let i = 0; i <= 36; i++) { const f = g0 + ((g1 - g0) * i) / 36; for (let j = 0; j <= 4; j++) if (G.dot3(N3(f, (q + j / 4) / NB), V3) > 0) { ba = Math.min(ba, f); bb = Math.max(bb, f); } }
        if (ba <= bb) { bands.push([q / NB, (q + 1) / NB, ba, bb]); fa = Math.min(fa, ba); fb = Math.max(fb, bb); }
      }
      if (!bands.length || fb - fa < (3 * Math.PI) / 180) continue;   // solo una silueta: la dibuja el sector vecino
      const pad = (2 * Math.PI) / 180;
      const shapesOf = (nm2) => bands.map(([u0, u1, ba, bb]) => {
        const cut = [...removed, sideOf(g0, -1), sideOf(g1, 1)];
        if (ba - pad > g0) cut.push(sideOf(ba - pad, -1));
        if (bb + pad < g1) cut.push(sideOf(bb + pad, 1));
        return record(A.body(F, shellOf(Math.max(0, u0 - 0.02), Math.min(1, u1 + 0.02)), { name: nm2, owner, cut }));
      });
      const nf = Math.max(4, Math.round((10 * (g1 - g0)) / (Math.PI / 2))), nu = segs === 1 ? 1 : Math.min(10, segs * 2);
      const fill = toned((o) => surface(P3, N3, g0, g1, nf, nu, o), cls);
      // aristas: las dos orillas del tramo donde se ve, y la silueta
      const lines = [];
      const rim = (u) => { let seg = []; for (let i = 0; i <= nf; i++) { const f = g0 + ((g1 - g0) * i) / nf; if (G.dot3(N3(f, u), V3) > 0.01) seg.push(P3(f, u)); else { if (seg.length > 1) lines.push(path3(seg)); seg = []; } } if (seg.length > 1) lines.push(path3(seg)); };
      if (at(0).r > 1e-6) rim(0);
      if (at(1).r > 1e-6) rim(1);
      const aV = G.dot3(F.a, V3), uV = G.dot3(F.u, V3), vV = G.dot3(F.v, V3), flat = Math.hypot(uV, vV), phi = Math.atan2(vV, uV);
      [0, 1].forEach((j) => {
        let seg = [];
        for (let i = 0; i <= 40; i++) {
          const q = at(i / 40); let ok = false;
          if (Math.abs(q.nr) > 1e-6 && q.r > 1e-6) {
            const c = (-q.ns * aV) / (q.nr * flat);
            if (Math.abs(c) < 1) { let g = phi + (j ? -1 : 1) * Math.acos(c); while (g < g0) g += 2 * Math.PI; while (g > g1) g -= 2 * Math.PI; if (g >= g0 && g <= g1) { seg.push(G.pointOf(F, q.s, q.r, g)); ok = true; } }
          }
          if (!ok) { if (seg.length > 1) lines.push(path3(seg)); seg = []; }
        }
        if (seg.length > 1) lines.push(path3(seg));
      });
      const pm = at(0.5), nm = merge ? `${name}.s${Math.round((g0 * 180) / Math.PI)}` : `${name}.${count++}`;
      PIECES[nm] = `tramo ${pts[run[0]].s.toFixed(1)},${pts[run[0]].r.toFixed(1)} → ${pts[run[segs]].s.toFixed(1)},${pts[run[segs]].r.toFixed(1)}  sector ${Math.round((g0 * 180) / Math.PI)}–${Math.round((g1 * 180) / Math.PI)}°`;
      const body = fill + (lines.length ? Ln(lines.join(""), { tone: edgeTone }) : ""), at3 = G.pointOf(F, pm.s, pm.r, (g0 + g1) / 2);
      if (merge) {
        let dsum = 0, dn = 0;
        for (let i = 0; i <= 8; i++) for (let j = 0; j <= 4; j++) { const f = g0 + ((g1 - g0) * i) / 8, u = j / 4; if (G.dot3(N3(f, u), V3) > 0) { dsum += G.dot3(P3(f, u), V3); dn++; } }
        if (!merged.has(nm)) merged.set(nm, { at: at3, parts: [], shapes: [] });
        const m = merged.get(nm); m.parts.push({ d: dn ? dsum / dn : 0, svg: body }); m.shapes.push(...shapesOf(nm));
      } else put(nm, at3, body, shapesOf(nm));
    }
  }
  for (const [nm, m] of merged) put(nm, m.at, m.parts.sort((p, q) => p.d - q.d).map((x) => x.svg).join(""), m.shapes);
  // las caras del corte: en y = 0 (x ≥ 0 si es un cuarto; las dos mitades si es medio) y en x = 0 (y ≥ 0)
  const sec = merid.map(([s2, r]) => [r, s2 + F.o[2]]);
  if (f0 === Math.PI && f1 === 2 * Math.PI) { cutStore.push({ owner, poly: sec.map(([r, z]) => [F.o[0] + r, z]), cls: cutCls }, { owner, poly: sec.map(([r, z]) => [F.o[0] - r, z]), cls: cutCls }); }
  else { cutStore.push({ owner, poly: sec.map(([r, z]) => [F.o[0] + r, z]), cls: cutCls }); cutStoreX.push({ owner, poly: sec.map(([r, z]) => [F.o[1] + r, z]), cls: cutCls }); }
  if (extra) put(`${name}.extra`, F.o, extra, []);
}

/* un anillo entero (eje F.a hacia arriba): el agujero por dentro, la cara de arriba, el costado y sus orillas */
function ringBody(F, s0, s1, rIn, rOut, cls, tone) {
  const T = 2 * Math.PI;
  const fill = toned((o) => {
    surface(revP(F, s0, s1, () => rIn), revN(F, s0, s1, () => rIn, () => 0, -1), 0, T, 40, 1, o);
    surface((f, u) => G.pointOf(F, s1, rIn + (rOut - rIn) * u, f), () => F.a, 0, T, 40, 1, o);
    surface(revP(F, s0, s1, () => rOut), revN(F, s0, s1, () => rOut, () => 0), 0, T, 56, 1, o);
  }, cls);
  const phi = Math.atan2(G.dot3(F.v, V3), G.dot3(F.u, V3)), side = (r, f) => path3([G.pointOf(F, s0, r, f), G.pointOf(F, s1, r, f)]);
  const lines = G.arcOf(F, s1, rOut, P, { least: -1 }) + G.arcOf(F, s1, rIn, P, { least: -1 }) + G.arcOf(F, s0, rOut, P) + side(rOut, phi + Math.PI / 2) + side(rOut, phi - Math.PI / 2);
  return fill + Ln(lines, { tone });
}

/* ---------- el obturador, su poste y el vástago: enteros, partidos por el plano del corte ---------- */
const BACKH = A.box([-4000, -4000, -4000], [4000, 0, 4000]);
/* Una pieza torneada entera que cruza un plano de corte se dibuja dos veces con el mismo torneado: la parte de atrás
   (antes de las caras del corte) y la de adelante (después), cada una recortada a la proyección de su parte. */
function splitTurned(name, F, profile, style = {}, { owner = name, ring = 0, frontArcs = [[0, Math.PI]], backArcs = [[Math.PI, 1.5 * Math.PI], [1.5 * Math.PI, 2 * Math.PI]], frontCut = [BACKH], backCut = [FRONT], cls = "", extra = "", extraFront = "", grow = 1.2 } = {}) {
  // el torneado va una sola vez en <defs>; las dos partes lo usan con su recorte
  const lid = `vcL_${name.replace(/\W/g, "_")}`;
  if (ring) DEFS.push(`<g id="${lid}">${ringBody(F, profile[0][0], profile[1][0], ring, profile[0][1], cls, style.tone || "mid")}</g>`);
  else DEFS.push(`<g id="${lid}">${wrap(S(G.solidOf(profile, F, P, { steps: 28 }), { tone: "hi", ...style }), cls)}</g>`);
  const body = `<use href="#${lid}"/>`;
  const prof = [[profile[0][0], 0], ...profile.map(([s, r]) => [s, r]), [profile[profile.length - 1][0], 0]];
  // la proyección de cada parte: una pieza maciza es convexa por mitades (un casco por arco); un anillo se arma con
  // gajos de 30°, sin el agujero
  const pieces = (arcs, pad) => {
    const out = [];
    for (const [a0, a1] of arcs) {
      if (ring) {
        const m = Math.max(1, Math.round((a1 - a0) / (Math.PI / 6)));
        for (let q = 0; q < m; q++) {
          const b0 = a0 + ((a1 - a0) * q) / m, b1 = a0 + ((a1 - a0) * (q + 1)) / m, pts = [];
          for (let j = 0; j <= 4; j++) { const t = b0 + ((b1 - b0) * j) / 4; for (const sv of [profile[0][0], profile[1][0]]) pts.push(pr(G.pointOf(F, sv, profile[0][1] + pad, t)), pr(G.pointOf(F, sv, ring - (pad > 0 ? 0 : 0), t))); }
          out.push(pth1(G.hullOf(pts)));
        }
      } else {
        const pts = [];
        for (const [sv, rv] of prof) { for (let j = 0; j <= 10; j++) { const t = a0 + ((a1 - a0) * j) / 10, e = pad * Math.sin((Math.PI * j) / 10); pts.push(pr(G.pointOf(F, sv, rv + e, t))); } pts.push(pr(G.pointOf(F, sv, 0, 0))); }
        out.push(pth1(G.hullOf(pts)));
      }
    }
    return out.map((d) => `<path d="${d}"/>`).join("");
  };
  const idB = `vcB_${name.replace(/\W/g, "_")}`, idF = `vcF_${name.replace(/\W/g, "_")}`;
  DEFS.push(`<clipPath id="${idB}">${pieces(backArcs, grow)}</clipPath>`, `<clipPath id="${idF}">${pieces(frontArcs, grow)}</clipPath>`);
  const mid = G.add3(F.o, G.mul3(F.a, (profile[0][0] + profile[profile.length - 1][0]) / 2));
  const shapeOf = (cut, nm) => ring ? A.ring(F, profile[0][0], profile[1][0], ring, profile[0][1], { name: nm, owner, cut }) : A.solid(F, profile, { name: nm, owner, cut });
  put(`${name}.atras`, mid, `<g clip-path="url(#${idB})">${body}${extra}</g>`, [record(shapeOf(backCut, `${name}.atras`))]);
  put(`${name}.frente`, mid, `<g clip-path="url(#${idF})">${body}${extraFront}</g>`, [record(shapeOf(frontCut, `${name}.frente`))]);
}
const PG = VC.plug, ZC0 = (238.6 + DZ) + LIFT;                 // el conector del vástago: de ZC0 a ZC0 + 40
const prof = GEO.plugProfile(), iHead = prof.findIndex(([s, r]) => s === PG.head + 2 && r === PG.rpost);
splitTurned("plug", FZo(0, 0, ZP), [...prof.slice(0, iHead), [PG.head + 2, PG.rhead - 2]], { tone: "hi" }, { owner: "plug", cls: "vc-trim" });
const SPOST = PG.head + 2, EPOST = SPOST + PG.post;
splitTurned("post", FZo(0, 0, ZP), [[SPOST, PG.rpost], [EPOST, PG.rpost], [EPOST + 2, PG.rstem]], { tone: "hi" }, { owner: "plug", cls: "vc-trim" });
// el vástago, en trozos entre lo que lo rodea: en el agujero del bonete, en la empaquetadura y arriba de la brida del prensaestopas
splitTurned("stem.a", FZo(), [[ZP + EPOST + 2, PG.rstem], [VC.box.z0, PG.rstem]], { tone: "hi" }, { owner: "plug", cls: "vc-trim" });
splitTurned("stem.b", FZo(), [[VC.box.z0, PG.rstem], [VC.bon.top, PG.rstem]], { tone: "hi" }, { owner: "plug", cls: "vc-trim" });
turned("stem.c", FZo(), [[VC.bon.top + VC.fol.up + VC.pf.t, PG.rstem], [ZC0 - 8, PG.rstem]], { tone: "hi" }, { owner: "plug", cls: "vc-trim" });

/* ====================================================================
   3 · el bonete: brida con sus espárragos, cuello, buje guía y caja de empaquetadura
   ==================================================================== */
const BN = VC.bon, GD = VC.guide, BX = VC.box, FO = VC.fol, PF = VC.pf;
const BNRF = 64, BNBC = 49, ZSH = VC.yoke.z0;
revPart("bonnet", FZo(), [[BN.z0, GD.ro], [BN.z0, BNRF], [BN.z1, BNRF], [BN.z1, BN.rsh], [ZSH, BN.rsh], [ZSH, BN.rneck], [VC.yoke.z1, BN.rneck], [VC.yoke.nz, BN.rneck], [BN.top, BN.rneck], [BN.top, BX.ri], [BX.z0, BX.ri], [BX.z0, 15], [GD.z1, 15], [GD.z1, GD.ro]], { owner: "bonnet",
  // lo que tapan el anillo de la arcada y su contratuerca, y las paredes de adentro que tapan el vástago y la empaquetadura
  skip: (a, b) => (Math.max(a.s, b.s) <= VC.yoke.nz + 1e-6 && Math.min(a.s, b.s) >= ZSH - 1e-6 && Math.max(a.r, b.r) <= BN.rsh + 1e-6) || (a.r === BX.ri && b.r === BX.ri) || (a.r === 15 && b.r === 15) });
// los espárragos del bonete: tuercas M16 sobre la brida (las de la mitad de atrás)
for (let i = 0; i < BN.bolts; i++) {
  const t = (2 * Math.PI * (i + 0.5)) / BN.bolts, x = BNBC * Math.cos(t), y = BNBC * Math.sin(t);
  if (y > -10) continue;
  const bn = `bonnet.bolt${i}`;
  fp(`${bn}.nut`, FZo(x, y, 0), HEX(12 / Math.cos(Math.PI / 6)), BN.z1, BN.z1 + 13, { tone: "mid" }, { owner: bn });
  disc(`${bn}.stud`, FZo(x, y, 0), BN.z1 + 13, BN.z1 + 17, 8, { tone: "mid" }, { owner: bn });
}
revPart("guide", FZo(), [[GD.z0, GD.ri], [GD.z0, GD.ro], [GD.z1, GD.ro], [GD.z1, GD.ri]], { owner: "guide", cls: "vc-trim", cutCls: "vc-cut-tr", surfaces: false });
// la empaquetadura: anillo de fondo y cinco anillos, cortados
revPart("pack.junk", FZo(), [[BX.z0, PG.rstem + 0.25], [BX.z0, BX.ri], [BX.z0 + BX.zjunk, BX.ri], [BX.z0 + BX.zjunk, PG.rstem + 0.25]], { owner: "pack", cls: "vc-trim", cutCls: "vc-cut-tr", surfaces: false });
const ZPK = BX.z0 + BX.zjunk;
for (let i = 0; i < BX.n; i++) revPart(`pack.ring${i}`, FZo(), [[ZPK + i * BX.h, PG.rstem + 0.05], [ZPK + i * BX.h, BX.ri], [ZPK + (i + 1) * BX.h, BX.ri], [ZPK + (i + 1) * BX.h, PG.rstem + 0.05]], { owner: "pack", cls: "vc-pack", cutCls: "vc-cut-pk", edgeTone: "lo", surfaces: false });
const ZFO = ZPK + BX.n * BX.h, ZPF = BN.top + FO.up;
// el seguidor (entero, cruza el corte) y la brida del prensaestopas con sus dos espárragos y tuercas
// el seguidor: cortado dentro de la caja y entero arriba de ella
revPart("follower.in", FZo(), [[ZFO, PG.rstem + 0.4], [ZFO, FO.ro], [BN.top, FO.ro], [BN.top, PG.rstem + 0.4]], { owner: "follower", cutCls: "vc-cut-tr", surfaces: false });
splitTurned("follower", FZo(), [[BN.top, FO.ro], [ZPF, FO.ro]], { tone: "mid" }, { owner: "follower", ring: PG.rstem + 0.4, cls: "vc-trim" });
box("pf.plate", [-PF.x, -PF.w, ZPF], [PF.x, PF.w, ZPF + PF.t], { tone: "mid" }, { r: PF.w - 0.01, steps: 8, bevel: 0.6, owner: "pf", extra: Ln(k.ring(0, 0, PG.rstem + 1.4, ZPF + PF.t, P, 40), { tone: "lo" }) });
R_.solids[R_.solids.length - 1].cut = [A.disc(FZo(), ZPF - 1, ZPF + PF.t + 1, PG.rstem + 1.4), ...[-1, 1].map((sg) => A.disc(FZo(sg * PF.stud, 0, 0), ZPF - 1, ZPF + PF.t + 1, PF.rs + 0.6))];
[-1, 1].forEach((sg, j) => {
  const F = FZo(sg * PF.stud, 0, 0), bn = `pf.stud${j}`;
  disc(`${bn}`, F, BN.top, ZPF, PF.rs, { tone: "mid" }, { owner: bn });
  disc(`${bn}.end`, F, ZPF + PF.t + 8.4, ZPF + PF.t + 8.4 + 4, PF.rs, { tone: "mid" }, { owner: bn });
  fp(`${bn}.nut`, F, HEX(7.15 / Math.cos(Math.PI / 6)), ZPF + PF.t, ZPF + PF.t + 8.4, { tone: "mid" }, { owner: bn });
});

/* ====================================================================
   4 · la arcada: anillo y contratuerca sobre el bonete, dos columnas, placa de arriba; conector del vástago,
   indicador de carrera y su escala
   ==================================================================== */
const YK = VC.yoke;
splitTurned("yoke.boss", FZo(), [[YK.z0, YK.rout], [YK.z1, YK.rout]], { tone: "mid" }, { owner: "yoke", ring: YK.rin, cls: "vc-cast" });
splitTurned("yoke.nut", FZo(), [[YK.z1, YK.nut], [YK.nz, YK.nut]], { tone: "mid" }, { owner: "yoke.nut", ring: YK.rin, cls: "" });
[-1, 1].forEach((sg, j) => box(`yoke.leg${j}`, [sg < 0 ? -YK.legx[1] : YK.legx[0], -YK.legy, YK.z1], [sg < 0 ? -YK.legx[0] : YK.legx[1], YK.legy, YK.top], { tone: "mid" }, { r: 2, steps: 3, bevel: 0.8, owner: "yoke", cls: "vc-cast" }));
{
  const sh = disc("yoke.top", FZo(), YK.top, YK.plate, YK.rplate, { tone: "mid" }, { owner: "yoke", cls: "vc-cast" });
  sh.cut = [A.disc(FZo(), YK.top - 1, YK.plate + 1, VC.act.rstem + 0.6)];
}
// el conector: dos mitades (partidas en x = 0) con dos tornillos de cabeza hueca; contratuercas en cada vástago
const ZC1 = ZC0 + 40;
box("conn", [-16, -13, ZC0], [16, 13, ZC1], { tone: "mid" }, { r: 1.2, steps: 3, bevel: 0.6, owner: "conn", extra: Ln(path3([[0, 13, ZC0], [0, 13, ZC1]]), { tone: "lo" }) + Ln(k.sideSeam({ x: -16, y: -13, w: 32, d: 26, r: 1.2 }, ZC0 + 20, P, 3), { tone: "faint" }) });
R_.solids[R_.solids.length - 1].cut = [A.disc(FZo(), ZC0 - 1, ZC0 + 20, VC.plug.rstem), A.disc(FZo(), ZC1 - 20, ZC1 + 1, VC.act.rstem)];
[ZC0 + 9, ZC1 - 9].forEach((z, j) => {
  const F = { o: [16, 0, z], a: XD, u: YD, v: ZD };
  disc(`conn.screw${j}`, F, 0, 5, 5, { tone: "mid" }, { owner: "conn", extra: Ln(path3(HEX(2.2).map(([u, v]) => [21, u, z + v]), true), { tone: "lo" }) });
});
fp("conn.jam.plug", FZo(), HEX(9.5 / Math.cos(Math.PI / 6)), ZC0 - 8, ZC0, { tone: "mid" }, { owner: "plug" });
R_.solids[R_.solids.length - 1].cut = [A.disc(FZo(), ZC0 - 9, ZC0 + 1, PG.rstem)];
// el indicador: una lengüeta del conector y su aguja, frente a la escala de la columna derecha
const ZPT = ZC0 + 30;
box("ind.tab", [8, 13, ZPT - 1], [16, 17, ZPT + 1], { tone: "mid" }, { r: 0.2, owner: "conn" });
fp("ind.arm", { o: [0, 17, 0], a: YD, u: XD, v: ZD }, [[8, ZPT - 1], [YK.legx[0] - 2, ZPT - 1], [YK.legx[0] + 4, ZPT], [YK.legx[0] - 2, ZPT + 1], [8, ZPT + 1]], 0, 1.5, { tone: "hi", lit: true }, { owner: "conn" });
{
  const zs0 = (238.6 + DZ) + 30 - 6, zs1 = (238.6 + DZ) + 30 + VC.travel + 6, x0 = YK.legx[0] + 1, x1 = YK.legx[1] - 1, y1 = YK.legy + 1.6;
  let minor = "", major = "";
  for (let i = 0; i <= 8; i++) { const z = (238.6 + DZ) + 30 + (VC.travel * i) / 8; (i % 2 ? (m) => (minor += m) : (m) => (major += m))(path3([[x0, y1, z], [x0 + (i % 2 ? 2.4 : 4.4), y1, z]])); }
  box("ind.scale", [x0, YK.legy, zs0], [x1, y1, zs1], { tone: "hi" }, { r: 0.3, owner: "yoke", extra: Ln(minor, { tone: "lo" }) + Ln(major, { tone: "mid" }) + Dots([at([x1 - 2, y1, zs0 + 2]), at([x1 - 2, y1, zs1 - 2])], { size: 0.45 }) });
}

/* ====================================================================
   5 · el actuador de diafragma y resorte, sin el cuarto que mira al lector
   ==================================================================== */
const AC = VC.act, DI = VC.dia, SP = VC.spring;
const ZPL = 375 + DZ + LIFT;                                   // cara de abajo del plato del diafragma
const QF0 = Math.PI / 2, QF1 = 2 * Math.PI;
const quarterArc = (cx, cz, ax, az, a0, a1, n = 10) => Array.from({ length: n + 1 }, (_, i) => { const t = a0 + ((a1 - a0) * i) / n; return [cz + az * Math.sin(t), cx + ax * Math.cos(t), i > 0 && i < n ? 1 : 0]; });
// la tapa de abajo: cubo, fondo, esquina redondeada y brida
const lower = [[AC.z0, AC.rstem + 0.6], [AC.z0, AC.hub], [AC.z0 + AC.hubh, AC.hub], [AC.z0 + AC.hubh, 100],
  ...quarterArc(100, AC.z0 + AC.hubh + 28, 28, 28, -Math.PI / 2, 0).slice(1, -1).map(([z, r]) => [z, r, 1]), [AC.z0 + AC.hubh + 28, 128], [388 + DZ, 128], [388 + DZ, AC.rf], [392 + DZ, AC.rf], [392 + DZ, 125], [AC.z0 + AC.hubh + 28, 125],
  ...quarterArc(100, AC.z0 + AC.hubh + 28, 25, 25, 0, -Math.PI / 2).slice(1, -1).map(([z, r]) => [z, r, 1]), [AC.z0 + AC.hubh + 3, 100], [AC.z0 + AC.hubh + 3, 24], [AC.z0 + 23, 24], [AC.z0 + 23, AC.rstem + 0.6]];
revPart("act.lower", FZo(), lower, { f0: QF0, f1: QF1, owner: "act.lower", cls: "vc-paint", skip: (a, b) => (a.r === b.r && a.r < AC.rstem + 1) || (a.s === 392 + DZ && b.s === 392 + DZ) });
// la tapa de arriba: brida, pared, esquina y el tope con el respiradero
const upper = [[395 + DZ, 125], [395 + DZ, AC.rf], [399 + DZ, AC.rf], [399 + DZ, 128], [440 + DZ, 128], ...quarterArc(90, 440 + DZ, 38, 42, 0, Math.PI / 2).slice(1, -1).map(([z, r]) => [z, r, 1]), [482 + DZ, 90], [482 + DZ, 22], [492 + DZ, 22], [492 + DZ, 4], [479 + DZ, 4], [479 + DZ, 90],
  ...quarterArc(90, 440 + DZ, 35, 39, Math.PI / 2, 0).slice(1, -1).map(([z, r]) => [z, r, 1]), [440 + DZ, 125]];
revPart("act.upper", FZo(), upper, { f0: QF0, f1: QF1, owner: "act.upper", cls: "vc-paint", skip: (a, b) => a.r === 4 && b.r === 4 });
// el diafragma: plano bajo el plato, la convolución y la pestaña apretada entre las bridas
{
  const zd = ZPL - DI.t / 2, cl = [[10, zd], [96, zd]];
  const rc = (123.5 - 96) / 2, xc = 96 + rc;
  for (let i = 1; i < 18; i++) { const t = Math.PI + (Math.PI * i) / 18; cl.push([xc + rc * Math.cos(t), zd + rc * Math.sin(t)]); }
  cl.push([123.5, zd], [123.5, 392 + DZ]);   // sube por la pared hasta la brida de abajo; la pestaña apretada va aparte
  const off = (sg) => cl.map((p, i) => { const a = cl[Math.max(0, i - 1)], b = cl[Math.min(cl.length - 1, i + 1)], dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz) || 1; return [p[0] + (sg * dz * DI.t) / 2 / L, p[1] - (sg * dx * DI.t) / 2 / L]; });
  const top = off(-1), bot = off(1);
  const mer = [...top.map(([r, z], i) => [z, r, i > 1 && i < top.length - 3 ? 1 : 0]), ...bot.reverse().map(([r, z], i) => [z, r, i > 2 && i < bot.length - 2 ? 1 : 0])];
  revPart("act.dia", FZo(), mer, { f0: QF0, f1: QF1, owner: "act.dia", cls: "vc-rubber", cutCls: "vc-cut-rb", edgeTone: "lo", merge: true, skip: (a, b) => Math.abs(a.s - ZPL) < 0.6 && Math.abs(b.s - ZPL) < 0.6 && Math.max(a.r, b.r) < 97 });
  // la pestaña del diafragma, apretada entre las dos bridas (lo de arriba y lo de abajo lo tapan las bridas)
  revPart("act.dia.brida", FZo(), [[392 + DZ, 122], [392 + DZ, AC.rf], [395 + DZ, AC.rf], [395 + DZ, 122]], { f0: QF0, f1: QF1, owner: "act.dia", cls: "vc-rubber", cutCls: "vc-cut-rb", edgeTone: "lo", skip: (a, b) => a.s === b.s });
}
// el plato del diafragma, con su cubo
revPart("act.plate", FZo(), [[ZPL, 10], [ZPL, DI.rplate - 3], [ZPL + 3, DI.rplate], [ZPL + 6, DI.rplate], [ZPL + 6, 22], [ZPL + 15, 22], [ZPL + 15, 10]], { f0: QF0, f1: QF1, owner: "act.plate", cls: "vc-paint", skip: (a, b) => a.r === 10 && b.r === 10 });
// los pernos de las bridas: cabeza arriba, tuerca abajo (los del cuarto quitado no están)
for (let i = 0; i < AC.nb; i++) {
  const t = (2 * Math.PI * (i + 0.5)) / AC.nb; if (t < Math.PI / 2) continue;
  const x = AC.bc * Math.cos(t) - 1 * Math.cos(t), y = (AC.bc - 1) * Math.sin(t), bn = `act.bolt${i}`;
  fp(`${bn}.head`, FZo(x, y, 0), HEX(7.15 / Math.cos(Math.PI / 6)), 399 + DZ, 405.5 + DZ, { tone: "mid" }, { owner: bn });
  fp(`${bn}.nut`, FZo(x, y, 0), HEX(7.15 / Math.cos(Math.PI / 6)), 380 + DZ, 388 + DZ, { tone: "mid" }, { owner: bn });
  disc(`${bn}.end`, FZo(x, y, 0), 376.5 + DZ, 380 + DZ, 4.76, { tone: "mid" }, { owner: bn });
}
// el vástago del actuador (entero) y su tuerca sobre el plato
turned("astem", FZo(), [[ZC1 + 8, AC.rstem], [YK.top, AC.rstem]], { tone: "hi" }, { owner: "astem", cls: "vc-trim" });
// el vástago del actuador por dentro, en trozos: en el cubo de la tapa, en la cámara de abajo y en el diafragma y el plato
const QSPLIT = { tone: "hi" }, QOPT = { owner: "astem", cls: "vc-trim", frontArcs: [[0, Math.PI / 2]], backArcs: [[Math.PI / 2, Math.PI], [Math.PI, 1.5 * Math.PI], [1.5 * Math.PI, 2 * Math.PI]], frontCut: BACKQ, backCut: [QUARTER] };
splitTurned("astem.hub", FZo(), [[AC.z0, AC.rstem], [AC.z0 + 23, AC.rstem]], QSPLIT, QOPT);
splitTurned("astem.cam", FZo(), [[AC.z0 + 23, AC.rstem], [ZPL - VC.dia.t, AC.rstem]], QSPLIT, QOPT);
splitTurned("astem.pl", FZo(), [[ZPL - VC.dia.t, AC.rstem], [ZPL + 15, AC.rstem]], QSPLIT, QOPT);
// los dos vástagos enteros, sin dibujar: lo que los une por dentro de lo que los tapa (para el audit)
record(A.solid(FZo(), [[ZP + EPOST + 2, PG.rstem], [ZC0 + 20, PG.rstem]], { name: "plug.vastago", owner: "plug" }));
record(A.solid(FZo(), [[ZC1 - 20, AC.rstem], [ZPL + 15, AC.rstem]], { name: "astem.vastago", owner: "astem" }));
fp("astem.nut", FZo(), HEX(11 / Math.cos(Math.PI / 6)), ZPL + 15, ZPL + 24, { tone: "mid" }, { owner: "astem" });
R_.solids[R_.solids.length - 1].cut = [A.disc(FZo(), ZPL + 14, ZPL + 25, AC.rstem)];
fp("astem.jam", FZo(), HEX(11 / Math.cos(Math.PI / 6)), ZC1, ZC1 + 8, { tone: "mid" }, { owner: "astem" });
R_.solids[R_.solids.length - 1].cut = [A.disc(FZo(), ZC1 - 1, ZC1 + 9, AC.rstem)];
// el respiradero
turned("act.vent", FZo(), [[492 + DZ, 7], [497 + DZ, 7], [497 + DZ, 10], [502 + DZ, 10], [504 + DZ, 6]], { tone: "mid" }, { owner: "act.upper" });
// el resorte: hélice de alambre de 11,2 mm; una espira muerta en cada punta (sube un diámetro de alambre) y las activas
{
  const z0 = ZPL + 6 + SP.wire, z1 = 479 + DZ - SP.wire, d = 2 * SP.wire, Nt = SP.turns, act = Nt - 2, p = (z1 - z0 - 2 * d) / act, pts = [];
  const zOf = (th) => { const t = th / (2 * Math.PI); if (t <= 1) return z0 + d * t; if (t >= Nt - 1) return z1 - d * (Nt - t); return z0 + d + p * (t - 1); };
  const N = Math.round(Nt * 64);
  for (let i = 0; i <= N; i++) { const th = (2 * Math.PI * Nt * i) / N, a = th + 0.3; pts.push([SP.r * Math.cos(a), SP.r * Math.sin(a), zOf(th)]); }
  const z = pts.map((q) => q[2]);
  for (let pass = 0; pass < 4; pass++) for (let i = 1; i < z.length - 1; i++) z[i] = (z[i - 1] + 2 * z[i] + z[i + 1]) / 4;
  pts.forEach((q, i) => (q[2] = z[i]));
  // los trozos del resorte se cortan en los dos planos del corte, para que ninguno quede a los dos lados de una cara cortada
  const breaks = []; let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const seg = G.len3(G.sub3(pts[i], pts[i - 1])), a0 = Math.atan2(pts[i - 1][1], pts[i - 1][0]), a1 = Math.atan2(pts[i][1], pts[i][0]);
    for (const b of [0, Math.PI / 2]) { const w0 = Math.sin(a0 - b), w1 = Math.sin(a1 - b); if (w0 < 0 && w1 >= 0 && Math.cos(a0 - b) > 0) breaks.push(acc + (seg * -w0) / (w1 - w0)); }
    acc += seg;
  }
  tubeItems("spring", pts, SP.wire, { tone: "mid", maxLength: 32, spacing: 6, ends: [false, false], cls: "vc-spring", breaks, touch: ["act.plate*", "act.upper*"] });
  console.log("resorte: paso activo", p.toFixed(1), "mm");
}

/* ====================================================================
   6 · el posicionador en la columna izquierda, su palanca de realimentación y el tubo del aire al actuador
   ==================================================================== */
const ANCH = {};
const PX0 = -152, PX1 = -96, PY0 = -34, PY1 = 36, PZ0 = 208 + DZ, PZ1 = 314 + DZ;
box("pos.body", [PX0, PY0, PZ0], [PX1, PY1, PZ1], { tone: "mid" }, { r: 6, steps: 4, bevel: 1, owner: "pos", cls: "vc-paint", extra: Ln(k.sideSeam({ x: PX0, y: PY0, w: PX1 - PX0, d: PY1 - PY0, r: 6 }, PZ1 - 14, P, 4), { tone: "faint" }) });
box("pos.cover", [PX0 + 4, PY1, PZ0 + 6], [PX1 - 4, PY1 + 3, PZ1 - 20], { tone: "mid" }, { r: 0.8, steps: 3, bevel: 0.5, owner: "pos", cls: "vc-paint",
  extra: Dots([[PX0 + 8, PZ0 + 10], [PX1 - 8, PZ0 + 10], [PX0 + 8, PZ1 - 24], [PX1 - 8, PZ1 - 24]].map(([x, z]) => at([x, PY1 + 3, z])), { size: 0.5 }) });
{
  const y = PY1 + 3, x0 = PX0 + 12, x1 = PX1 - 12, z0 = 262 + DZ, z1 = 280 + DZ;
  const rules = [0.3, 0.5, 0.7].map((f, i) => Ln(path3([[x0 + 4, y + 0.6, z1 - (z1 - z0) * f], [x0 + (i === 2 ? 18 : 28), y + 0.6, z1 - (z1 - z0) * f]]), { tone: "lo", free: true })).join("");
  box("pos.plate", [x0, y, z0], [x1, y + 0.6, z1], { tone: "hi" }, { r: 0.6, owner: "pos.cover", extra: rules + Dots([[x0 + 2, z0 + 2], [x1 - 2, z0 + 2], [x0 + 2, z1 - 2], [x1 - 2, z1 - 2]].map(([x, z]) => at([x, y + 0.6, z])), { size: 0.4 }) });
}
// los manómetros de suministro y de salida, en la tapa
[[-136, 232 + DZ], [-112, 232 + DZ]].forEach(([x, z], j) => {
  const F = { o: [x, PY1 + 3, z], a: YD, u: XD, v: ZD };
  disc(`pos.gauge${j}`, F, 0, 6, 9, { tone: "mid" }, { owner: "pos.cover", extra: (() => {
    const yF = PY1 + 9.02, ring = Array.from({ length: 41 }, (_, i) => { const t = (2 * Math.PI * i) / 40; return [x + 7.4 * Math.cos(t), yF, z + 7.4 * Math.sin(t)]; });
    let ticks = ""; for (let q = 0; q <= 6; q++) { const t = (Math.PI * (225 - 45 * q)) / 180; ticks += path3([[x + 7.4 * Math.cos(t), yF, z + 7.4 * Math.sin(t)], [x + 5.8 * Math.cos(t), yF, z + 5.8 * Math.sin(t)]]); }
    const nt = (Math.PI * (j ? 70 : 110)) / 180;
    return Ln(path3(ring, true), { tone: "lo" }) + Ln(ticks, { tone: "lo" }) + Ln(path3([[x, yF, z], [x + 5.4 * Math.cos(nt), yF, z + 5.4 * Math.sin(nt)]]), { tone: "hi", free: "end" }) + Dots([at([x, yF, z])], { size: 0.7 });
  })() });
});
// el soporte entre el posicionador y la columna
box("pos.bracket", [PX1, -14, 250 + DZ], [-YK.legx[1], 14, 258 + DZ], { tone: "mid" }, { r: 0.4, owner: "pos", extra: Dots([at([PX1 + 6, 0, 258 + DZ]), at([-YK.legx[1] - 6, 0, 258 + DZ])], { size: 0.55 }) });
// el eje de realimentación, la palanca con su ranura y el pasador del conector
const PIV = [-123, 252 + DZ], PIN = [-8, ZC0 + 14];
const ang = Math.atan2(PIN[1] - PIV[1], PIN[0] - PIV[0]), dl = [Math.cos(ang), Math.sin(ang)], nl = [-dl[1], dl[0]];
disc("pos.shaft", { o: [PIV[0], 0, PIV[1]], a: YD, u: XD, v: ZD }, PY1 + 3, 44, 5, { tone: "mid" }, { owner: "pos.cover" });
{
  const Lv = Math.hypot(PIN[0] - PIV[0], PIN[1] - PIV[1]) + 12, w = 5.5, pts = [];
  for (let i = 0; i <= 12; i++) { const t = Math.PI / 2 + (Math.PI * i) / 12; pts.push([PIV[0] + w * (Math.cos(t) * dl[0] + Math.sin(t) * nl[0]), PIV[1] + w * (Math.cos(t) * dl[1] + Math.sin(t) * nl[1])]); }
  for (let i = 0; i <= 12; i++) { const t = -Math.PI / 2 + (Math.PI * i) / 12; pts.push([PIV[0] + Lv * dl[0] + w * (Math.cos(t) * dl[0] + Math.sin(t) * nl[0]), PIV[1] + Lv * dl[1] + w * (Math.cos(t) * dl[1] + Math.sin(t) * nl[1])]); }
  const yF = 47, sl = (s, q) => [PIV[0] + s * dl[0] + q * nl[0], PIV[1] + s * dl[1] + q * nl[1]];
  const s0 = Lv - 34, s1 = Lv - 4, slot = [];
  for (let i = 0; i <= 10; i++) { const t = Math.PI / 2 + (Math.PI * i) / 10; slot.push(sl(s0 + 3.3 * Math.cos(t), 3.3 * Math.sin(t))); }
  for (let i = 0; i <= 10; i++) { const t = -Math.PI / 2 + (Math.PI * i) / 10; slot.push(sl(s1 + 3.3 * Math.cos(t), 3.3 * Math.sin(t))); }
  fp("pos.lever", { o: [0, 44, 0], a: YD, u: XD, v: ZD }, pts.reverse(), 0, 3, { tone: "hi" }, { owner: "pos.lever", extra: Ln(path3(slot.map(([x, z]) => [x, yF + 0.02, z]), true), { tone: "lo" }) });
  R_.solids[R_.solids.length - 1].cut = [A.prism({ o: [0, 43, 0], a: YD, u: XD, v: ZD }, slot, 0, 5)];
  fp("pos.lever.nut", { o: [PIV[0], 0, PIV[1]], a: YD, u: XD, v: ZD }, HEX(4.5 / Math.cos(Math.PI / 6)), 47, 51, { tone: "mid" }, { owner: "pos.lever" });
}
disc("conn.pin", { o: [PIN[0], 0, PIN[1]], a: YD, u: XD, v: ZD }, 13, 44, 3, { tone: "mid" }, { owner: "conn" });
disc("conn.pin.end", { o: [PIN[0], 0, PIN[1]], a: YD, u: XD, v: ZD }, 47, 49, 4.6, { tone: "mid" }, { owner: "conn" });
// el tubo de cobre de 1/4″ del aire: de la salida del posicionador, por delante de la columna, a la toma de la tapa de abajo
{
  const fx = -110, fy = 30, pf = (125 * Math.PI) / 180, cx = 88 * Math.cos(pf), cy = 88 * Math.sin(pf);
  fp("pos.fitting", FZo(fx, fy, 0), HEX(6.5 / Math.cos(Math.PI / 6)), PZ1, PZ1 + 6, { tone: "mid" }, { owner: "pos" });
  disc("pos.fitting.nut", FZo(fx, fy, 0), PZ1 + 6, PZ1 + 10, 5.2, { tone: "mid" }, { owner: "pos" });
  disc("act.port", FZo(cx, cy, 0), AC.z0 + AC.hubh - 6, AC.z0 + AC.hubh, 7, { tone: "mid" }, { owner: "act.lower" });
  fp("act.port.nut", FZo(cx, cy, 0), HEX(6.5 / Math.cos(Math.PI / 6)), AC.z0 + AC.hubh - 12, AC.z0 + AC.hubh - 6, { tone: "mid" }, { owner: "act.lower" });
  // codos de compresión: el tubo va recto entre ellos y cada tramo termina en la superficie de su codo
  const zA = PZ1 + 10, zB = AC.z0 + AC.hubh - 12, zm = 334.5 + DZ, RE = 5.5, rt = 3.2, en = Math.sqrt(RE * RE - rt * rt);
  // sube del posicionador, sale hacia adelante (fuera de la sombra de la brida del actuador) y va a la toma
  const E0 = [fx, fy, zm], E1 = [fx, 64, zm], E2 = [cx, cy, zm];
  [E0, E1, E2].forEach((c, j) => { put(`air.elbow${j}`, c, wrap(S(G.sphereOf(c, RE, P), { tone: "mid" }), "vc-copper-fit"), [record(A.ball(c, RE, { name: `air.elbow${j}`, owner: "air" }))]); });
  const leg = (nm2, a, b) => { const dir = G.unit3(G.sub3(b, a)); tubeItems(nm2, [G.add3(a, G.mul3(dir, en)), G.sub3(b, G.mul3(dir, en))], rt, { tone: "mid", maxLength: 16, cls: "vc-copper" }); };
  tubeItems("air.a", [[fx, fy, zA], [fx, fy, zm - en]], rt, { tone: "mid", maxLength: 12, cls: "vc-copper" });
  leg("air.b", E0, E1);
  leg("air.c", E1, E2);
  tubeItems("air.d", [[cx, cy, zm + en], [cx, cy, zB]], rt, { tone: "mid", maxLength: 12, cls: "vc-copper" });
  ANCH.AIR = G.lerp3(E1, E2, 0.35);
}
/* ---------- las caras del corte, un elemento por pieza y material ---------- */
// recorta un polígono (x, z) al semiplano z ≤ c (sg = −1) o z ≥ c (sg = 1)
function clipZ(poly, c, sg) {
  const inside = (p) => sg * (p[1] - c) >= 0, out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    if (inside(a)) out.push(a);
    if (inside(a) !== inside(b)) { const t = (c - a[1]) / (b[1] - a[1]); out.push([a[0] + (b[0] - a[0]) * t, c]); }
  }
  return out.length >= 3 ? out : null;
}
function cutItems() {
  // el corte del bonete va en dos piezas, debajo y encima del anillo de la arcada, para que el orden no haga ciclos
  const zs = VC.yoke.z1, split = [];
  for (const c of cutStore) {
    if (c.owner !== "bonnet") { split.push(c); continue; }
    const lo = clipZ(c.poly, zs, -1), hi = clipZ(c.poly, zs, 1);
    if (lo) split.push({ ...c, poly: lo, owner: "bonnet", tag: "abajo" });
    if (hi) split.push({ ...c, poly: hi, owner: "bonnet", tag: "arriba" });
  }
  cutStore.length = 0; cutStore.push(...split);
  const groups = new Map();
  for (const c of cutStore) { const key = c.owner + "|" + c.cls + "|" + (c.tag || ""); if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls, tag] = key.split("|");
    const polys = list.map((c) => c.poly.map(([x, z]) => pr([x, 0, z])));
    const d = polys.map((p) => pth1(p)).join("");
    const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
    const shapes = list.map((c) => record(A.prism(FY0, c.poly, -0.3, 0, { name: `${owner}.corte`, owner })));
    const cx = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.corte${cls === "vc-cut" ? "" : "." + cls.replace("vc-cut-", "")}${tag ? "." + tag : ""}`, [cx[0] / n, 0, cx[1] / n], svg, shapes);
  }
}
cutItems();
{
  const groups = new Map();
  for (const c of cutStoreX) { const key = c.owner + "|" + c.cls; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); }
  for (const [key, list] of groups) {
    const [owner, cls] = key.split("|");
    const d = list.map((c) => pth1(c.poly.map(([y, z]) => pr([0, y, z])))).join("");
    const svg = `<g class="iso-solid ${cls}"><path class="iso-fill" d="${d}"/><path class="iso-shade" data-shade="3" d="${d}"/><path class="iso-line iso-edge" data-tone="mid" d="${d}"/></g>`;
    const shapes = list.map((c) => record(A.prism(FX0, c.poly, -0.3, 0, { name: `${owner}.cortex`, owner })));
    const cy = list.flatMap((c) => c.poly).reduce((q, p) => [q[0] + p[0], q[1] + p[1]], [0, 0]), n = list.reduce((q, c) => q + c.poly.length, 0);
    put(`${owner}.cortex${cls === "vc-cut" ? "" : "." + cls.replace("vc-cut-", "")}`, [0, cy[0] / n, cy[1] / n], svg, shapes);
  }
}

/* ---------- orden y salida ---------- */
if (process.env.VC_ITEM) {
  // depuración: todo lo que se cruza en pantalla con una pieza, y quién va delante
  for (const nm of process.env.VC_ITEM.split(",")) {
    const me = R_.items.find((it) => it.name === nm);
    for (const it of R_.items) {
      if (it === me) continue;
      const o = A.overlapsOf([me, it], P, {});
      for (const pp of o.pairs) console.log(nm, "|", it.name, "  ", pp.front.map((f) => f.area.toFixed(1)).join(" / "));
    }
  }
  process.exit(0);
}
if (process.env.VC_PAIRS) {
  // depuración: dónde está cada lado de los pares pedidos (VC_PAIRS="a,b;c,d")
  for (const pair of process.env.VC_PAIRS.split(";")) {
    const [na, nb] = pair.split(",");
    const its = R_.items.filter((it) => it.name === na || it.name === nb);
    const o = A.overlapsOf(its, P, {});
    for (const it of its) if (PIECES[it.name]) console.log("  ", it.name, PIECES[it.name]);
    for (const pp of o.pairs) console.log(its[pp.a].name, "vs", its[pp.b].name, JSON.stringify(pp.front.map((f) => ({ area: f.area, depth: f.depth && +f.depth.toFixed(2), at: f.at && f.at.map((v) => +v.toFixed(1)) }))));
  }
  process.exit(0);
}
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const CSS = `.vc-cut,.vc-cut-tr,.vc-cut-gk,.vc-cut-pk,.vc-cut-rb{--anatomy-paper:#c9ced3;--anatomy-shade-3:#c9ced3;--anatomy-top:#c9ced3}
.vc-cut-tr{--anatomy-paper:#d7dadd;--anatomy-shade-3:#d7dadd;--anatomy-top:#d7dadd}
.vc-trim{--anatomy-paper:#f4f5f6;--anatomy-face:#f4f5f6;--anatomy-top:#fbfbfc;--anatomy-shade-0:#d6d9dc;--anatomy-shade-1:#dfe2e4;--anatomy-shade-2:#e7e9eb;--anatomy-shade-3:#eef0f1}
.vc-paint{--anatomy-paper:#eef0f2;--anatomy-face:#eef0f2;--anatomy-top:#f7f8f9;--anatomy-shade-0:#ccd1d6;--anatomy-shade-1:#d5d9dd;--anatomy-shade-2:#dde1e4;--anatomy-shade-3:#e5e8ea}
.vc-pack{--anatomy-paper:#a5aab0;--anatomy-face:#a5aab0;--anatomy-top:#b3b7bc;--anatomy-shade-0:#878d93;--anatomy-shade-1:#8f959b;--anatomy-shade-2:#989ea4;--anatomy-shade-3:#a0a5ab}
.vc-rubber{--anatomy-paper:#8a8f95;--anatomy-face:#8a8f95;--anatomy-top:#979ca1;--anatomy-shade-0:#6c7177;--anatomy-shade-1:#74797f;--anatomy-shade-2:#7d8288;--anatomy-shade-3:#858a90}
.vc-copper-fit{--anatomy-paper:#e4cfbe;--anatomy-face:#e4cfbe;--anatomy-top:#f1e4d8;--anatomy-shade-0:#c9a991;--anatomy-shade-1:#d2b5a0;--anatomy-shade-2:#dbc1ae;--anatomy-shade-3:#e2cbba}
.vc-copper .tb-body{fill:#e7d3c3}.vc-copper .tb-shine{fill:#f4e7dc}.vc-copper .tb-shade{fill:#d2b6a1}
.vc-cut-gk{--anatomy-paper:#8c9198;--anatomy-shade-3:#8c9198;--anatomy-top:#8c9198}
.vc-cut-pk{--anatomy-paper:#7b8086;--anatomy-shade-3:#7b8086;--anatomy-top:#7b8086}
.vc-cut-rb{--anatomy-paper:#5f646a;--anatomy-shade-3:#5f646a;--anatomy-top:#5f646a}
.vc-cast{--anatomy-paper:#e3e6e9;--anatomy-face:#e3e6e9;--anatomy-top:#eceef0;--anatomy-shade-0:#c4c9ce;--anatomy-shade-1:#cdd1d5;--anatomy-shade-2:#d5d9dc;--anatomy-shade-3:#dde0e3}
.vc-gasket{--anatomy-paper:#9aa0a6;--anatomy-face:#9aa0a6;--anatomy-top:#a6abb0;--anatomy-shade-0:#7f858b;--anatomy-shade-1:#878d93;--anatomy-shade-2:#90969c;--anatomy-shade-3:#979da3}`;
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`);
/* el SVG publicado va en la página del libro: cada trazo de M, L y Z se reescribe con coordenadas relativas en décimas
   (redondeando primero cada punto absoluto, así no se acumula error) y sin ceros sobrantes */
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
const svg = k.figureSvg({ width: W, height: H, label: "Válvula de control de globo en corte", body: [`<style>${CSS}</style><defs>${DEFS.join("")}</defs><g class="vc-items">${groups.join("")}</g>`] });
mkdirSync(join(HERE, "out"), { recursive: true });
const svgOut = compact(svg);
writeFileSync(join(HERE, "out", "fig.svg"), svgOut);
writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS);
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Válvula de control", theme: "light", width: 900, body: `<div class="iso-stage">${svgOut}</div>`, script: "" }));
// los puntos a los que apuntan los rótulos del libro (libro.mjs)
const zdia = ZPL - VC.dia.t / 2 - (123.5 - 96) / 2;
Object.assign(ANCH, {
  BRIDA_IN: [-(FF - FL.rft - FL.t / 2), 0, FL.r - 6], BRIDA_OUT: [FF + GK.t + FL.rft + FL.t / 2, 0, FL.r - 6],
  CUERPO: [28, 0, -GEO.rOuter(28) + 7], ASIENTO: [SR.rsh - 2, 0, SR.top - 1], OBTURADOR: G.pointOf(FZo(0, 0, ZP), 12, VC.plug.rhead, 2.2),
  VASTAGO: G.pointOf(FZo(), 232 + DZ, VC.plug.rstem, 2.0), EMPAQUETADURA: [-(VC.plug.rstem + 3), 0, ZPK + 2.5 * BX.h], BONETE: [-(BNRF - 8), 0, (BN.z0 + BN.z1) / 2],
  ARCADA: [YK.legx[1] - 3, YK.legy, YK.z1 + 40], INDICADOR: [YK.legx[1] - 2, YK.legy + 1.6, (238.6 + DZ) + 30 + VC.travel * 0.85],
  ACTUADOR: G.pointOf(FZo(), 425 + DZ, 128, (150 * Math.PI) / 180), DIAFRAGMA: [109.75, 0, zdia - 1.2], RESORTE: G.pointOf(FZo(), (ZPL + 479 + DZ) / 2 + 4, VC.spring.r + VC.spring.wire, (35 * Math.PI) / 180),
  POSICIONADOR: [PX0 + 6, PY1 + 3, PZ1 - 26], CONECTOR: [16, 0, ZC0 + 30],
});
writeFileSync(join(HERE, "out", "valvula_data.json"), JSON.stringify({ P, W, H, ANCLAS: ANCH, open: VC.open }));
console.log("items", R_.items.length, "scale", G.scaleOf(P).toFixed(3));
if (!FAST) A.auditOrExit(R_, P, {});
