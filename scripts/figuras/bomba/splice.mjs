/* Mete la instalación en el Explorador de bombas centrífugas publicado: el código en vivo y los datos de las dos
   figuras entre /*PBFIG_START*\/ y /*PBFIG_END*\/, el CSS entre /*PBFIG_CSS_START*\/ y /*PBFIG_CSS_END*\/, y copia
   los SVG a simulaciones/fig/bomba/, de donde la página los pide cuando hacen falta.
   Correr después de node build.mjs y node build.mjs --lift.
   Uso: node splice.mjs [ruta del HTML] [carpeta de los SVG]. Sin argumentos escribe en el explorador de 2026-20;
   con la ruta de otro explorador (el de 2027-10, por ejemplo), en ese, y los SVG van a fig/bomba/ junto a él, salvo que se
   dé otra carpeta. */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const SIM = join(HERE, "../../../public/classroom/iqya-2031-2026-20/simulaciones");
const PAGE = process.argv[2] ? resolve(process.argv[2]) : join(SIM, "Explorador_Bombas_Centrifugas.html");
const FIG = process.argv[3] ? resolve(process.argv[3]) : join(dirname(PAGE), "fig/bomba");
mkdirSync(FIG, { recursive: true });
const figs = {};
for (const t of ["inundada", "elevacion"]) {
  const svg = join(HERE, "out", `bomba-${t}.svg`), json = join(HERE, "out", `bomba-${t}.json`);
  if (!existsSync(svg) || !existsSync(json)) throw new Error(`falta out/bomba-${t}: corra node build.mjs${t === "elevacion" ? " --lift" : ""}`);
  copyFileSync(svg, join(FIG, `bomba-${t}.svg`));
  figs[t] = JSON.parse(readFileSync(json, "utf8"));
}
let page = readFileSync(PAGE, "utf8");
const put = (a, b, body) => {
  const i = page.indexOf(a), j = page.indexOf(b);
  if (i < 0 || j < i) throw new Error(`no están los marcadores ${a} … ${b}`);
  page = page.slice(0, i + a.length) + "\n" + body + "\n" + page.slice(j);
};
put("/*PBFIG_START*/", "/*PBFIG_END*/", readFileSync(join(HERE, "out", "fig.js"), "utf8").trim() + "\nvar PB_FIGS = " + JSON.stringify(figs) + ";");
put("/*PBFIG_CSS_START*/", "/*PBFIG_CSS_END*/", readFileSync(join(HERE, "out", "fig.css"), "utf8").trim());
writeFileSync(PAGE, page);
console.log(PAGE, page.length, "· fig/bomba: inundada y elevación");
