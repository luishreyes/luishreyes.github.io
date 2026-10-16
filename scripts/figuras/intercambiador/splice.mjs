/* Mete la figura en el Explorador de intercambiadores publicado: el código en vivo y los datos de las nueve figuras
   entre /*HXFIG_START*\/ y /*HXFIG_END*\/, el CSS entre /*HXFIG_CSS_START*\/ y /*HXFIG_CSS_END*\/, y copia los SVG a
   simulaciones/fig/intercambiador/, de donde la página los pide cuando hacen falta. Correr después de node build.mjs --all. */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const SIM = join(HERE, "../../../public/classroom/iqya-2031-2026-20/simulaciones");
const PAGE = join(SIM, "Explorador_Intercambiadores.html"), FIG = join(SIM, "fig/intercambiador");
mkdirSync(FIG, { recursive: true });
const figs = {};
for (const h of ["BEM", "BEU", "AES"]) for (const n of [1, 2, 3]) {
  const tag = `${h}-${n}`, svg = join(HERE, "out", `tc-${tag}.svg`), json = join(HERE, "out", `tc-${tag}.json`);
  if (!existsSync(svg) || !existsSync(json)) throw new Error(`falta out/tc-${tag}: corra node build.mjs --all`);
  copyFileSync(svg, join(FIG, `tc-${tag}.svg`));
  figs[tag] = JSON.parse(readFileSync(json, "utf8"));
}
const js = readFileSync(join(HERE, "out", "fig.js"), "utf8").trim() + "\nvar HX_FIGS = " + JSON.stringify(figs) + ";";
const css = readFileSync(join(HERE, "out", "fig.css"), "utf8").trim();
let page = readFileSync(PAGE, "utf8");
const put = (a, b, body) => {
  const i = page.indexOf(a), j = page.indexOf(b);
  if (i < 0 || j < i) throw new Error(`no están los marcadores ${a} … ${b}`);
  page = page.slice(0, i + a.length) + "\n" + body + "\n" + page.slice(j);
};
put("/*HXFIG_START*/", "/*HXFIG_END*/", js);
put("/*HXFIG_CSS_START*/", "/*HXFIG_CSS_END*/", css);
writeFileSync(PAGE, page);
console.log("Explorador_Intercambiadores.html", page.length, "· fig/intercambiador: 9 SVG");
