/* Reinserta la figura (out/fig.svg, out/fig.js, out/fig.css) en el Explorador de equilibrio y flash
   ya publicado, reemplazando los tres bloques marcados. Uso: node splice.mjs [ruta del HTML] */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const HERE = dirname(fileURLToPath(import.meta.url));
const page = process.argv[2] || join(HERE, "../../../public/classroom/iqya-2031-2026-20/simulaciones/Explorador_Equilibrio_Flash.html");
const out = (n) => readFileSync(join(HERE, "out", n), "utf8");
let html = readFileSync(page, "utf8");
const swap = (start, end, body) => {
  const a = html.indexOf(start), b = html.indexOf(end, a);
  if (a < 0 || b < 0) throw new Error("no encuentro el bloque " + start);
  html = html.slice(0, a) + start + body + html.slice(b);
};
swap("/*FLASH_CSS_START*/", "/*FLASH_CSS_END*/", out("fig.css"));
swap("<!--FLASH_SVG_START-->", "<!--FLASH_SVG_END-->", out("fig.svg"));
swap("/*FLASH_JS_START*/", "/*FLASH_JS_END*/", out("fig.js"));
writeFileSync(page, html);
console.log("figura reinsertada en", page, html.length, "bytes");
