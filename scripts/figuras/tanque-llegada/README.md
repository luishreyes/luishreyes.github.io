# Tanque de llegada en isométrico (skill `anatomy`)

Figura del capítulo 13 del libro de operaciones unitarias: un tanque elevado de agua, de acero, con fondo plano y techo
de cono, sin el cuarto que mira al lector, sobre una estructura de columnas con diagonales que se dibuja con un corte.
Se ven la llegada por arriba con la válvula de control y el tubo que entrega bajo el nivel, el respiradero, las bocas de
inspección, el rebose, el transmisor y el interruptor de nivel, la escalera con jaula, la baranda, la salida con su
compuerta y el drenaje. Lleva la persona de referencia (`../persona.mjs`). Va a escala real, en milímetros
(`geo.mjs`).

Las medidas del caso y cuáles da el libro y cuáles son del dibujo están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos 3 minutos (2 min 40 s del orden y 15 s del audit); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
```

El dibujo va en milímetros y el audit en centímetros (`cm()`). Para depurar el orden sin correr todo:
`TL_ITEM="pieza" node build.mjs` lista todo lo que se cruza con una pieza en pantalla y quién va delante, y
`TL_PAIRS="a,b"` dice dónde va delante cada una. `TL_STEP=0.5` hace la rejilla del orden más gruesa (más rápido, menos
fino).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/tanque_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`TL`), el techo de cono, el corte de la estructura (`SHIFT`, `zDraw`) y media corona. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos (todos en el arreglo `ROTULOS`, para traducirlos), y `out/libro-preview.html` para revisarla. |

## Qué escribe

`node libro.mjs` escribe `figuras/valvulas-tuberias-y-medicion-de-flujo/_tanque-llegada.qmd` en el libro (la vista y
los rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Los
colores salen de la paleta del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia
un color, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
