# La línea de vapor aislada en isométrico (skill `anatomy`)

Figura del capítulo 21 del libro de operaciones unitarias: un tramo de una línea de vapor aislada, al exterior, sobre
un soporte de tubería. Se ven el tubo con su aislante en medias cañas y su chaqueta metálica con traslapos y bandas, la
zapata que se desliza entre guías sobre la viga, un corte en cuña escalonado que deja ver las capas, el vapor y la
película de condensado del fondo, la pierna de goteo de un punto bajo con el cuerpo de una trampa, la válvula de
compuerta y la unión de bridas con sus chaquetas desmontables, y el extremo cortado. Un círculo amplía la pared en el
corte, con el perfil de temperatura dibujado encima. Lleva la persona de referencia (`../persona.mjs`); el círculo no.
Va a escala real, en milímetros (`geo.mjs`), salvo lo que se exagera para que se vea.

Las medidas del caso, de qué fuente y página sale cada pieza y lo que va exagerado están en el repositorio del libro,
en `notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, unos 5 segundos; «audit passed»
node build.mjs --detalle --audit       # la pared ampliada, unos 3 segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/21/steam-line.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/21/steam-line.svg)
```

Para depurar sin correr todo: `LV_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién
va delante y dónde, y `LV_PROBE="x,y,pieza1,pieza2" node build.mjs` dice a qué profundidad toca cada una el rayo de ese
punto de la pantalla. La posición del círculo se cambia con `LV_DX` y `LV_DY` al correr `libro.mjs`.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`LV`), los radios (`G0`), el perfil de temperatura (`temperatura`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/calor-en-equipos/_linea-vapor.qmd` en el libro (la vista, el círculo y los rótulos en
español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina` escribe la
lámina de la edición en inglés, `en/figuras/21/steam-line.svg` (pocos rótulos en inglés, 428 pt de ancho, colores
resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node ../paleta-libro.mjs`
vuelve a pintar la vista sin rehacer el dibujo.
