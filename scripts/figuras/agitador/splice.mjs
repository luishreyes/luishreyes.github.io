/* Mete el reactor en el Explorador de agitación publicado: el código en vivo y los datos de las figuras entre
   /*AGFIG_START*\/ y /*AGFIG_END*\/, el CSS entre /*AGFIG_CSS_START*\/ y /*AGFIG_CSS_END*\/, y copia los SVG a
   simulaciones/fig/agitador/, de donde la página los pide cuando hacen falta.
   Correr después de node build.mjs y node build.mjs --tall (y después de reconstruir el explorador). */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const SIM = join(HERE, "../../../public/classroom/iqya-2031-2026-20/simulaciones");
const PAGE = join(SIM, "Explorador_Agitacion.html"), FIG = join(SIM, "fig/agitador");
mkdirSync(FIG, { recursive: true });
const figs = {};
for (const t of ["a", "b", "la", "lb"]) {
  const svg = join(HERE, "out", `agitador-${t}.svg`), json = join(HERE, "out", `agitador-${t}.json`);
  if (!existsSync(svg) || !existsSync(json)) throw new Error(`falta out/agitador-${t}: corra node ${t.length > 1 ? "build-lab.mjs" : "build.mjs"}${t.endsWith("b") ? " --tall" : ""}`);
  copyFileSync(svg, join(FIG, `agitador-${t}.svg`));
  figs[t] = JSON.parse(readFileSync(json, "utf8"));
}
let page = readFileSync(PAGE, "utf8");
const put = (a, b, body) => {
  const i = page.indexOf(a), j = page.indexOf(b);
  if (i < 0 || j < i) throw new Error(`no están los marcadores ${a} … ${b}`);
  page = page.slice(0, i + a.length) + "\n" + body + "\n" + page.slice(j);
};
put("/*AGFIG_START*/", "/*AGFIG_END*/", readFileSync(join(HERE, "out", "fig.js"), "utf8").trim() + "\nvar AG_FIGS = " + JSON.stringify(figs) + ";");
put("/*AGFIG_CSS_START*/", "/*AGFIG_CSS_END*/", readFileSync(join(HERE, "out", "fig.css"), "utf8").trim());
writeFileSync(PAGE, page);
console.log("Explorador_Agitacion.html", page.length, "· fig/agitador: a, b, la y lb");
