# El tubo de retención de E-201 con su válvula de desvío, en isométrico (skill `anatomy`)

Figura del capítulo 25 del libro de operaciones unitarias (*Thermal Processing*). A la izquierda, E-201 simplificado:
la placa fija con sus patas, tres boquillas con su unión de abrazadera, el paquete de placas, la placa de presión, las
barras y los tornillos tensores. De la boquilla de la salida del calentamiento sale el tubo de retención: tubo sanitario
de 2½ in en un serpentín de cuatro tramos rectos y tres curvas de 180° que sube 2,1 cm por metro, soldado y con una unión
de abrazadera solo en su entrada y en su salida. Lo sostiene un soporte de acero inoxidable de tres marcos (patas
niveladoras, postes, travesaño y largueros) con una varilla y una abrazadera de bisagra por tramo: las varillas son de
largo distinto porque cada tramo va a su altura, y eso deja ver la pendiente. A la salida, una cruz con el sensor del
registrador-controlador (TT-204, arriba) y el termómetro de referencia (TI-204, con su pantalla hacia el lector) en el
mismo punto; después, una te con el presostato PSL-207, y el tubo vuelve a E-201. Delante de E-201, en la salida del
enfriamiento, la válvula de desvío de dos vástagos (la de desvío y la de detección de fugas, iguales: cuerpo de tres
cámaras con dos asientos, bonete, linterna, actuador neumático y cabeza de control), con TT-205 en su entrada, la línea
adelante (al llenado) y las dos que bajan a TK-201, la de detección con su mirilla; una manguera de aire por actuador,
del domo de su cabeza a un colector en la placa fija. Lleva la persona de referencia (`../persona.mjs`); el círculo no.

El círculo (`--detalle`) muestra la válvula cortada por el plano vertical de sus dos ejes, en desvío, con su propia
cámara (azimut 75°, elevación 20°: casi de frente al corte; la vista entera va a 45° y 38°): el jugo frío que entra a la
cámara del medio, el tapón arriba contra el asiento de adelante, el jugo que baja por el asiento de desvío a su línea,
la cámara entre los dos vástagos vacía, la válvula de detección también en desvío con el escape de fugas abierto, y en
cada actuador el resorte (media vuelta de atrás y la sección del alambre), el pistón arriba y el detector de posición
en la cabeza de control.

Todo va a escala real, en milímetros (`geo.mjs`). Las medidas del caso, de qué fuente y página sale cada pieza y lo que
va supuesto están en el repositorio del libro, en `notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, unos 3 segundos; «audit passed»
node build.mjs --detalle --audit       # la válvula en corte, un segundo; también «audit passed»
node build.mjs --fast                  # sin orden ni audit: para mirar la geometría (el orden de pintura no vale)
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/25/holding-tube.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/25/holding-tube.svg)
```

Para depurar: `TR_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla y quién va delante. La
posición del círculo en la vista del libro se cambia con `TR_DX` y `TR_DY` al correr `libro.mjs`, y `node libro.mjs
--anclas` escribe `out/anclas.html`, con cada ancla marcada.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`TR`), el eje del serpentín (`ejeEn`, `tramos`, `zTramo`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`. |

## Qué escribe

`node libro.mjs` escribe `figuras/tratamiento-termico/_tubo-retencion.qmd` en el libro (la vista, el círculo y los
rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina`
escribe la lámina de la edición en inglés, `en/figuras/25/holding-tube.svg` (pocos rótulos en inglés, 428 pt de ancho,
colores resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta del
libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs` (clases `tr-*`): si cambia un color,
`node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
