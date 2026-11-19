# Tanque agitado en isométrico (skill `anatomy`)

Figura del capítulo 14 del libro de operaciones unitarias, que el 15 usa también: un tanque agitado vidriado con
chaqueta, en corte por encima de la línea de tangencia del fondo. Se ven el tanque con fondo y tapa elípticos, la
chaqueta, dos bafles de aleta colgados de la tapa, dos turbinas de palas inclinadas, el eje, el sello mecánico, la
linterna, el reductor y el motor, las boquillas, las patas y la salida de fondo con su válvula, y la suspensión con la
superficie del líquido y las flechas de los dos lazos del flujo. Lleva la persona de referencia (`../persona.mjs`). Va
a escala real, en milímetros (`geo.mjs`).

Las medidas del caso y de qué fuente y página sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                                           # unos 5 minutos (4 del orden); debe terminar en «audit passed»
node build.mjs --fast                                            # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                                                   # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
```

El dibujo va en milímetros y el audit en centímetros (`cm()`). Para depurar el orden sin correr todo:
`TA_ITEM="pieza" node build.mjs` lista todo lo que se cruza con una pieza en pantalla y quién va delante.
`TA_STEP=0.5` hace la rejilla del orden más gruesa (más rápido, menos fino).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/tanque_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`TQ`), las cabezas elípticas por dentro y por fuera y dos secciones de uso común. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` para revisarla. |

## Qué escribe

`node libro.mjs` escribe `figuras/agitacion/_tanque-agitado.qmd` en el libro (la vista y los rótulos en español), que
el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. En la edición en inglés, los rótulos
los traduce `en/herramientas/figuras-14.mjs` del libro. Los colores salen de la paleta del libro (`estilo/paleta.json`,
sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node ../paleta-libro.mjs` vuelve a pintar la
vista sin rehacer el dibujo.
