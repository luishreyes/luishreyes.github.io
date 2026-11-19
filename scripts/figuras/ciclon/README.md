# El ciclón en isométrico (skill `anatomy`)

Figura del capítulo 20 del libro de operaciones unitarias: un ciclón de flujo invertido de alta eficiencia (Stairmand),
cortado por el plano del eje sin la mitad que mira al lector. Se ven la entrada tangencial, el cilindro y el cono, el
tubo de salida con su codo y su ducto, la tolva colectora con su interruptor de nivel, la válvula rotativa con su
motorreductor, las patas de atrás, los dos vórtices del gas y el polvo que baja en espiral por la pared hasta la tolva.
Un círculo amplía la válvula rotativa. Lleva la persona de referencia (`../persona.mjs`); el círculo no. Va a escala
real, en milímetros (`geo.mjs`), salvo las partículas y la holgura de las paletas. Sin nombres de fabricante.

Las medidas del caso, de qué fuente y página sale cada pieza y lo que va exagerado están en el repositorio del libro,
en `notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, unos 25 segundos (13 del orden); «audit passed»
node build.mjs --detalle --audit       # la válvula ampliada, unos 7 segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node build.mjs --check                 # ninguna cara del corte se monta sobre otra
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/20/cyclone.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/20/cyclone.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las dos primeras pueden correr a la vez. El dibujo va en milímetros y el audit en centímetros (`cm()`). Para depurar
sin correr todo: `CI_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién va delante y
dónde. La posición del círculo se cambia con `CI_DX` y `CI_DY` al correr `libro.mjs`.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`CI`), las que salen de D (`G0`), el radio de la pared a cada altura (`rWall`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/particulas-y-gotas-en-gases/_ciclon.qmd` en el libro (la vista, el círculo y los
rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina`
escribe la lámina de la edición en inglés, `en/figuras/20/cyclone.svg` (pocos rótulos en inglés, 428 pt de ancho,
colores resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta del
libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
