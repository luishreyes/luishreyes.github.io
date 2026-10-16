/* Mete los equipos de molienda en el Explorador de molienda y tamizado publicado: el código en vivo y los datos de las
   cuatro figuras entre /*MLFIG_START*\/ y /*MLFIG_END*\/, el CSS entre /*MLFIG_CSS_START*\/ y /*MLFIG_CSS_END*\/, y copia
   los SVG a simulaciones/fig/molienda/, de donde la página pide el del equipo que se ve.
   Correr después de node build.mjs --eq=bolas, --eq=mand, --eq=rod y --eq=mart. */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const SIM = join(HERE, "../../../public/classroom/iqya-2031-2026-20/simulaciones");
const PAGE = join(SIM, "Explorador_Molienda.html"), FIG = join(SIM, "fig/molienda");
mkdirSync(FIG, { recursive: true });
const figs = {};
for (const eq of ["bolas", "mand", "rod", "mart"]) {
  const svg = join(HERE, "out", `molino-${eq}.svg`), json = join(HERE, "out", `molino-${eq}.json`);
  if (!existsSync(svg) || !existsSync(json)) throw new Error(`falta out/molino-${eq}: corra node build.mjs --eq=${eq}`);
  copyFileSync(svg, join(FIG, `molino-${eq}.svg`));
  figs[eq] = JSON.parse(readFileSync(json, "utf8"));
}
let page = readFileSync(PAGE, "utf8");
const put = (a, b, body) => {
  const i = page.indexOf(a), j = page.indexOf(b);
  if (i < 0 || j < i) throw new Error(`no están los marcadores ${a} … ${b}`);
  page = page.slice(0, i + a.length) + "\n" + body + "\n" + page.slice(j);
};
// cuatro decimales bastan para los datos (la escala de la proyección incluida)
const round = (k, v) => (typeof v === "number" ? Math.round(v * 1e4) / 1e4 : v);
put("/*MLFIG_START*/", "/*MLFIG_END*/", readFileSync(join(HERE, "out", "fig.js"), "utf8").trim() + "\nvar ML_FIGS = " + JSON.stringify(figs, round) + ";");
put("/*MLFIG_CSS_START*/", "/*MLFIG_CSS_END*/", readFileSync(join(HERE, "out", "fig.css"), "utf8").trim());
writeFileSync(PAGE, page);
console.log("Explorador_Molienda.html", page.length, "· fig/molienda: bolas, mandíbulas, rodillos y martillos");
