/* Mete la figura en el Explorador de intercambiadores publicado: el código en vivo y los datos de las nueve figuras
   entre /*HXFIG_START*\/ y /*HXFIG_END*\/, el CSS entre /*HXFIG_CSS_START*\/ y /*HXFIG_CSS_END*\/, y copia los SVG a
   simulaciones/fig/intercambiador/, de donde la página los pide cuando hacen falta. Correr después de node build.mjs --all.
   Si están construidas, mete también la de placas (../placas, marcadores PLFIG_*), la de doble tubo (../doble-tubo,
   marcadores DPFIG_*) y las del aeroenfriador (../aeroenfriador, marcadores ACFIG_*). */
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
// el intercambiador de placas (scripts/figuras/placas): una sola figura
const PLD = join(HERE, "../placas/out");
if (existsSync(join(PLD, "placas.svg"))) {
  copyFileSync(join(PLD, "placas.svg"), join(FIG, "placas.svg"));
  put("/*PLFIG_START*/", "/*PLFIG_END*/", readFileSync(join(PLD, "fig.js"), "utf8").trim() + "\nvar PL_FIG = " + readFileSync(join(PLD, "placas.json"), "utf8").trim() + ";");
  put("/*PLFIG_CSS_START*/", "/*PLFIG_CSS_END*/", readFileSync(join(PLD, "fig.css"), "utf8").trim());
}
// el doble tubo (scripts/figuras/doble-tubo): una sola figura
const DPD = join(HERE, "../doble-tubo/out");
if (existsSync(join(DPD, "doble.svg"))) {
  copyFileSync(join(DPD, "doble.svg"), join(FIG, "doble.svg"));
  put("/*DPFIG_START*/", "/*DPFIG_END*/", readFileSync(join(DPD, "fig.js"), "utf8").trim() + "\nvar DP_FIG = " + readFileSync(join(DPD, "doble.json"), "utf8").trim() + ";");
  put("/*DPFIG_CSS_START*/", "/*DPFIG_CSS_END*/", readFileSync(join(DPD, "fig.css"), "utf8").trim());
}
// el aeroenfriador (scripts/figuras/aeroenfriador): una figura para pasos pares y otra para impares
const ACD = join(HERE, "../aeroenfriador/out"), acOk = ["par", "impar"].every((t) => existsSync(join(ACD, `aero-${t}.svg`)));
if (acOk) {
  const acs = {};
  for (const t of ["par", "impar"]) { copyFileSync(join(ACD, `aero-${t}.svg`), join(FIG, `aero-${t}.svg`)); acs[t] = JSON.parse(readFileSync(join(ACD, `aero-${t}.json`), "utf8")); }
  put("/*ACFIG_START*/", "/*ACFIG_END*/", readFileSync(join(ACD, "fig.js"), "utf8").trim() + "\nvar AC_FIGS = " + JSON.stringify(acs) + ";");
  put("/*ACFIG_CSS_START*/", "/*ACFIG_CSS_END*/", readFileSync(join(ACD, "fig.css"), "utf8").trim());
}
writeFileSync(PAGE, page);
console.log("Explorador_Intercambiadores.html", page.length, "· fig/intercambiador: tubos y coraza (9)" + (existsSync(join(PLD, "placas.svg")) ? ", placas" : "") + (existsSync(join(DPD, "doble.svg")) ? ", doble tubo" : "") + (acOk ? ", aeroenfriador (2)" : ""));
