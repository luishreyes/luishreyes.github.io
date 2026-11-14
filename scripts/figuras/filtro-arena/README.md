# Filtro de arena a presión en isométrico (skill `anatomy`)

Figura del capítulo 16 del libro de operaciones unitarias: un filtro a presión de doble medio (antracita sobre arena),
lleno de agua, en corte por encima de la línea de tangencia del fondo. Se ven el recipiente con fondo y tapa elípticos,
la entrada por la corona con su distribuidor de placa deflectora, el agua libre, las dos capas del medio, el falso fondo
de boquillas sin grava y el pleno, las tuberías de entrada, salida, lavado, aire y drenaje con sus válvulas como en
servicio, los manómetros, la boca de visita, las patas y las flechas del agua. El medio va con un corte escalonado: se
quita también el cuarto de atrás a la derecha hasta la placa, para ver las cabezas de las boquillas, y lo que queda
muestra las capas en sus dos caras (el pie de la figura debe decir que el medio se quitó en ese cuarto solo para
mostrar las boquillas). Va a escala real, en milímetros (`geo.mjs`), salvo los granos del medio, más grandes que los
reales.

Las medidas del caso y de qué fuente sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos 2½ minutos (2 del orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
FA_ITEM="pieza" node build.mjs   # lista todo lo que se cruza con una pieza en pantalla
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/filtro_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`FA`), los tubos y bridas (`DN`), las cabezas elípticas, la rejilla de las boquillas y dos secciones de uso común. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). `--anclas` imprime dónde cae cada rótulo. |

## Qué escribe

`node libro.mjs` escribe `figuras/particulas-en-un-fluido/_filtro-arena.qmd` en el libro (la vista y los rótulos en
español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Los colores salen de la
paleta del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
