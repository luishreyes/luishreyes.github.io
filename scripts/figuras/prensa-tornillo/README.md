# La prensa de tornillo para aceite (expulsor) en isométrico (skill `anatomy`)

Figura del capítulo 18 del libro de operaciones unitarias: una prensa continua de tornillo para sacar el aceite de una
semilla acondicionada, sin el cuarto de arriba de la jaula que mira al lector ni la mitad de adelante de la capota, la
bandeja, la tolva y la canaleta de la torta. Se ven el motor, el reductor y las correas, la tolva con su alimentador
vertical, la caja de la entrada, la jaula de barras con sus bastidores y tirantes, el tornillo con sus gusanos, collares
y cuchillas fijas, el material cada vez más apretado hasta la torta, el cono de salida con su husillo y su volante, y el
aceite que sale entre las barras y gotea a la bandeja. Un círculo amplía dos barras de la jaula cortadas de través, con
la rendija. Lleva la persona de referencia (`../persona.mjs`); el círculo no. Va a escala real, en milímetros
(`geo.mjs`).

Las medidas del caso y de qué fuente y página sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, menos de un minuto; «audit passed»
node build.mjs --detalle --audit       # las dos barras ampliadas, unos segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/18/screw-press.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/18/screw-press.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Para depurar sin correr todo: `PT_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién
va delante y dónde. La posición del círculo se cambia con `PT_DX` y `PT_DY` al correr `libro.mjs`.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`PT`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/filtracion/_prensa-tornillo.qmd` en el libro (la vista, el círculo y los rótulos en
español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina` escribe la
lámina de la edición en inglés, `en/figuras/18/screw-press.svg` (pocos rótulos en inglés, 428 pt de ancho, colores
resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node ../paleta-libro.mjs`
vuelve a pintar la vista sin rehacer el dibujo.
