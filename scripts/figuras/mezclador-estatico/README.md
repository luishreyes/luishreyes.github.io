# Mezclador estático en isométrico (skill `anatomy`)

Figura del capítulo 15 del libro de operaciones unitarias: un mezclador estático de elementos de cinta torcida (del
tipo Kenics KMS) en un tubo bridado, en corte por el plano del eje. Se ven la lanza que baja por una boquilla y
descarga un aditivo en el centro del tubo, antes del primer elemento, los elementos que parten y recombinan la
corriente, las bridas y el chorro, que la primera cinta parte en dos y que se diluye (esquemático). Lleva una mano de
referencia (`manoEnBorde` de `../persona.mjs`). Va a escala real, en milímetros (`geo.mjs`).

Las medidas del caso, de qué fuente y página sale cada pieza y por qué se dibuja este elemento están en el repositorio
del libro, en `notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos 50 s; debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
MZ_DEBUG=1 node build.mjs     # las líneas de la cinta en colores, para revisar
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/mezclador_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`MZ`), el ángulo de la cinta en cada x y la media corona. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). |

## Qué escribe

`node libro.mjs` escribe `figuras/mezclado/_mezclador-estatico.qmd` en el libro (la vista y los rótulos en español),
que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Los colores salen de la paleta del
libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
