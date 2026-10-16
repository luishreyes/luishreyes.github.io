/* Reinserta la figura (out/fig.svg, out/fig.js, out/fig.css) en el Explorador de destilación por lotes
   ya publicado, reemplazando los tres bloques marcados, y copia la variante con columna (out-col/fig.svg)
   a simulaciones/fig/alambique/columna.svg, que la página pide solo cuando hace falta.
   Uso: node splice.mjs [ruta del HTML] */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const page = process.argv[2] || join(HERE, "../../../public/classroom/iqya-2031-2026-20/simulaciones/Explorador_Destilacion_por_Lotes.html");
const out = (n) => readFileSync(join(HERE, "out", n), "utf8");
let html = readFileSync(page, "utf8");
const swap = (start, end, body) => {
  const a = html.indexOf(start), b = html.indexOf(end, a);
  if (a < 0 || b < 0) throw new Error("no encuentro el bloque " + start);
  html = html.slice(0, a) + start + body + html.slice(b);
};
swap("/*STILL_CSS_START*/", "/*STILL_CSS_END*/", out("fig.css"));
swap("<!--STILL_SVG_START-->", "<!--STILL_SVG_END-->", out("fig.svg"));
swap("/*STILL_JS_START*/", "/*STILL_JS_END*/", out("fig.js"));
writeFileSync(page, html);
const figDir = join(dirname(page), "fig", "alambique");
mkdirSync(figDir, { recursive: true });
copyFileSync(join(HERE, "out-col", "fig.svg"), join(figDir, "columna.svg"));
console.log("columna en", join(figDir, "columna.svg"));
console.log("figura reinsertada en", page, html.length, "bytes");
