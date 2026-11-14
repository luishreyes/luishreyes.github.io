# El clarificador de placas en isométrico (skill `anatomy`)

Figura del capítulo 17 del libro de operaciones unitarias: un clarificador rectangular de concreto con placas
inclinadas a contracorriente, sin el muro que mira al lector. Se ven la entrada con el muro difusor, la zona de entrada
sin placas con su pantalla, el paquete de placas sobre sus ángulos, la canaleta con vertederos en V y la caja de salida,
el barredor de cadenas y paletas con su motorreductor, la tolva de lodos con la purga y su válvula de cuchilla, el agua,
el flóculo y el lodo en el corte y las flechas del agua y del lodo. Un círculo amplía dos canales entre placas, con el
agua que sube y el lodo que resbala. Lleva la persona de referencia (`../persona.mjs`); el círculo no. Va a escala
real, en milímetros (`geo.mjs`); los flóculos de la vista entera van más grandes que los reales. Sin nombres de
fabricante.

Las medidas del caso y de qué fuente y página sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, menos de 2 minutos (uno del orden); «audit passed»
node build.mjs --detalle --audit       # los dos canales ampliados, unos 2 minutos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/17/plate-settler.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/17/plate-settler.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las dos primeras pueden correr a la vez (cada una escribe sus propios archivos). El dibujo va en milímetros y el audit
en centímetros (`cm()`). Para depurar sin correr todo: `CL_ITEM="pieza" node build.mjs` lista lo que se cruza con una
pieza en pantalla, quién va delante y dónde.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`CL`), el caso (`CASO`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/sedimentacion-y-decantacion/_clarificador-placas.qmd` en el libro (la vista, el
círculo y los rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`.
Con `--lamina` escribe la lámina de la edición en inglés, `en/figuras/17/plate-settler.svg` (pocos rótulos en inglés,
428 pt de ancho, colores resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de
la paleta del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
