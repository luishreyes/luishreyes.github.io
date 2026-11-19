# El congelador de lecho fluidizado de dos etapas (IQF) en isométrico (skill `anatomy`)

Figura del capítulo 16 del libro de operaciones unitarias: un congelador IQF de lecho fluidizado de dos etapas, sin el
techo ni la pared que mira al lector. Se ven el alimentador vibratorio, la primera banda perforada con el lecho que
borbotea, el eje de levas que la sacude y el vertedero, la segunda banda con la capa quieta y el canal de salida, los
ventiladores axiales de la cubierta, el tabique, el evaporador con la escarcha, sus líneas y el rociador del deshielo,
los paneles aislados en corte y las flechas del aire. Dos círculos amplían cada etapa con el producto grano por grano.
Lleva la persona de referencia (`../persona.mjs`); los círculos no. Va a escala real, en milímetros (`geo.mjs`).

Las medidas del caso y de qué fuente y página sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, unos 45 s (20 del orden); «audit passed»
node build.mjs --detalle=1 --audit     # la primera etapa ampliada, unos 30 s; también «audit passed»
node build.mjs --detalle=2 --audit     # la segunda
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/16/freezer.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/16/freezer.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las tres primeras pueden correr a la vez (cada una escribe sus propios archivos). El dibujo va en milímetros y el
audit en centímetros (`cm()`). Para depurar sin correr todo: `CG_ITEM="pieza" node build.mjs` lista lo que se cruza
con una pieza en pantalla, quién va delante y dónde.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle=1` o `--detalle=2`, `out/detalleN.svg`, `out/detalleN_data.json` y `out/preview-detalleN.html`. |
| `geo.mjs` | Las medidas (`CG`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre de cada círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/particulas-en-un-fluido/_congelador.qmd` en el libro (la vista, los dos círculos y
los rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con
`--lamina` escribe la lámina de la edición en inglés, `en/figuras/16/freezer.svg` (pocos rótulos en inglés, 428 pt de
ancho, colores resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta
del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
