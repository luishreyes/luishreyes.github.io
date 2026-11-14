# La separadora centrífuga de discos autodeslodante en isométrico (skill `anatomy`)

Figura del capítulo 19 del libro de operaciones unitarias: una separadora de discos autodeslodante de tazón semiabierto,
puesta como purificadora, cortada por el plano del eje sin la mitad que mira al lector. Se ven el bastidor sobre
cojines con su capota, el motor, el freno y el engranaje de tornillo sin fin, el tazón de doble cono con el fondo móvil
y el agua de maniobra, el distribuidor, la pila de discos con sus agujeros, el disco de gravedad, el tubo de
alimentación, las dos bombas centrípetas y la caja de salidas, el ducto al ciclón de sedimento, los líquidos y el
sólido en el corte y las flechas de cada fase. Un círculo amplía el canal entre dos discos en la zona neutra. Lleva la
persona de referencia (`../persona.mjs`); el círculo no. Va a escala real, en milímetros (`geo.mjs`), salvo la pila,
que lleva menos discos y canales más anchos que una real, y las gotas del círculo. Sin nombres de fabricante.

Las medidas del caso, de qué fuente y página sale cada pieza y cómo se dibuja la pila están en el repositorio del
libro, en `notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, un minuto; «audit passed»
node build.mjs --detalle --audit       # el canal entre dos discos, unos segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node build.mjs --check                 # ninguna cara del corte se monta sobre otra
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/19/disc-separator.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/19/disc-separator.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Para depurar sin correr todo: `SD_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién
va delante y dónde. La posición del círculo se cambia con `SD_DX` y `SD_DY` al correr `libro.mjs`.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`SD`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/separacion-centrifuga/_separadora.qmd` en el libro (la vista, el círculo y los
rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina`
escribe la lámina de la edición en inglés, `en/figuras/19/disc-separator.svg` (pocos rótulos en inglés, 428 pt de
ancho, colores resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta
del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
