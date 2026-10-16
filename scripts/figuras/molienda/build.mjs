/* ====================================================================
   Los equipos de molienda en isométrico (skill anatomy), para la pestaña
   «Equipo en operación» del Explorador de molienda y tamizado: molino de
   bolas, trituradora de mandíbulas, molino de rodillos y molino de
   martillos. Cada uno es una máquina real abierta por un plano que deja
   ver su cámara de molienda; en ese plano la página pinta las partículas
   de la simulación del explorador (MillAnim) y mueve el mecanismo con
   ella: la excéntrica y la mandíbula, los rodillos, el rotor con sus
   martillos o el tambor con sus levantadores.
   Uso: node build.mjs --eq=bolas|mand|rod|mart [--audit] [--fast] · --js
   Unidades: 1 = 1 cm. z hacia arriba.
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
const { makeKit } = await import(join(HERE, "helpers.mjs"));
const FAST = process.argv.includes("--fast");
const EQ = (process.argv.find((a) => a.startsWith("--eq=")) || "--eq=bolas").slice(5);
// la tamizadora tiene una figura por número de tamices de la pila (de 3 a 9)
const NT = +((process.argv.find((a) => a.startsWith("--n=")) || "--n=9").slice(4));
const OUTN = EQ === "tamiz" ? `tamiz-${NT}` : `molino-${EQ}`;
const strip = (n) => readFileSync(join(HERE, n), "utf8").replace(/^export /gm, "");
mkdirSync(join(HERE, "out"), { recursive: true });
const writeJs = () => {
  writeFileSync(join(HERE, "out", "fig.js"), "/* equipos de molienda en isométrico: generado por build.mjs */\nvar FMill = (function () {\n" + strip("xprism.mjs") + strip("geo.mjs") + readFileSync(join(HERE, "live.js"), "utf8") + readFileSync(join(HERE, "tamiz-live.js"), "utf8") + "\nwindow.FSieve = FSieve;\nreturn FMill;\n})();\n");
  writeFileSync(join(HERE, "out", "fig.css"), k.ISO_CSS + "\n" + readFileSync(join(HERE, "ml.css"), "utf8"));
};
if (process.argv.includes("--js")) { writeJs(); console.log("out/fig.js, out/fig.css"); process.exit(0); }

const MOD = await import(join(HERE, EQ + ".mjs"));
const cam = MOD.camera(GEO, NT);
const { T, HV } = GEO.axesOf(cam.AZ);
const P = k.fitProjection(cam.EXT, cam.W, cam.H, { pad: 14, azimuth: cam.AZ, elevation: cam.EL });
const C = X.xCam(P);
const R_ = A.recorder(P, { order: [], spring: {} });
const K = makeKit({ k, G, A, X, P, C, R_, T, HV, tubePieces, tubeSvg });
const res = MOD.build({ ...K, k, G, A, X, P, C, R_, T, HV, GEO, cam });

/* ---------- orden y salida ---------- */
if (!FAST) A.settle(R_, P);
R_.items.sort((a, b) => a.key - b.key);
const after = (name, html) => { const it = R_.items.find((q) => q.name === name); if (!it) throw new Error("no está " + name); it.svg += html; };
const wrap = (name, cls) => { const it = R_.items.find((q) => q.name === name); if (!it) throw new Error("no está " + name); it.svg = `<g class="${cls}">${it.svg}</g>`; };
if (res.after) res.after(after, wrap);
// lo vivo lo pinta la página: en el SVG queda su lugar en el orden de pintura; el audit revisa el dibujo de reposo
const groups = R_.items.map((item) => `<g class="it" data-name="${item.name}"${res.group ? res.group(item.name) : ""}>${item.live ? `<g data-live="${item.name}"></g>` + (item.liveKeep || "") : item.svg}</g>`);
const svg = k.figureSvg({ width: cam.W, height: cam.H, label: res.label, body: [`<g class="ml-items">${groups.join("")}</g>`] }).replace("<svg ", `<svg id="mlSvg-${OUTN}" `);
const DATA = { eq: EQ, P, W: cam.W, H: cam.H, AZ: cam.AZ, EL: cam.EL, T, HV, sc: G.scaleOf(P), ...res.data };
writeFileSync(join(HERE, "out", `${OUTN}.svg`), svg);
writeFileSync(join(HERE, "out", `${OUTN}.json`), JSON.stringify(DATA));
writeJs();
writeFileSync(join(HERE, "preview.html"), k.pageHtml({ title: "Molienda · " + EQ, theme: "light", width: 1000, body: `<style>${readFileSync(join(HERE, "ml.css"), "utf8")}</style><div class="iso-stage" id="mlFig">${svg}</div>`, script: "" }));
console.log(OUTN, "items", R_.items.length, "scale", G.scaleOf(P).toFixed(3), "svg", svg.length);
if (!FAST) A.auditOrExit(R_, P, {});
