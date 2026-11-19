# Válvula de control de globo en isométrico (skill `anatomy`)

Figura del capítulo 13 del libro de operaciones unitarias: una válvula de control de globo bridada, de un solo asiento,
en una línea de agua, en corte por el plano del flujo. Se ven los tramos de tubo con sus bridas, el cuerpo con el paso
en S, el asiento y el obturador perfilado, el bonete y la empaquetadura, la arcada, el actuador de diafragma y resorte
(sin un cuarto de la caja, para ver el diafragma, el plato y el resorte) y el posicionador. Lleva una mano de referencia
(`manoEnBorde` de `../persona.mjs`). Va a escala real, en milímetros (`geo.mjs`).

Las medidas del caso y de qué norma o fuente sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos 14 minutos (11 del orden y 3 del audit); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
```

Las capturas necesitan `CHROME_PATH=/opt/pw-browsers/chromium` en las sesiones en la nube. Para depurar el orden sin
correr todo: `VC_PAIRS="pieza.a,pieza.b" node build.mjs` dice dónde va delante cada una, y `VC_ITEM="pieza" node
build.mjs` lista todo lo que se cruza con una pieza en pantalla.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/valvula_data.json` (cámara y puntos de los rótulos) y `preview.html`. `--carrera 0.6` pone el obturador a otra altura (de 0 a 1). |
| `geo.mjs` | Las medidas (`VC`), los esferoides del globo, el perfil del obturador y los tabiques. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` para revisarla. |

## Qué escribe

`node libro.mjs` escribe `figuras/valvulas-tuberias-y-medicion-de-flujo/_valvula-control.qmd` en el libro (la vista y
los rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Los
colores salen de la paleta del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia
un color, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
