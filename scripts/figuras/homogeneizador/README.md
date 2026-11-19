# El homogeneizador de alta presión en isométrico (skill `anatomy`)

Figura del capítulo 15 del libro de operaciones unitarias: el cabezal de un homogeneizador de alta presión de tres
pistones, en corte. Se ven la cara del cárter con los tres pistones y sus acoples en distintos puntos de la carrera, el
bloque de la bomba cortado por un cilindro (el cartucho de sellos y la columna de válvulas de succión y de descarga, con
sus resortes y su tapón) y el cabezal de dos etapas, cada una con asiento, forzador, anillo de impacto y actuador
hidráulico con el aceite en corte, con el camino del líquido. Un círculo amplía la primera etapa. Lleva una mano de
referencia (`manoEnBorde` de `../persona.mjs`); el círculo no. Va a escala real, en milímetros (`geo.mjs`), salvo la
rendija, que va exagerada.

Las medidas del caso y de qué fuente y página sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # la vista entera, unos 19 minutos (7 del orden y 12 del audit); «audit passed»
node build.mjs --detalle --audit       # el detalle de la primera etapa, unos 15 minutos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en tres segundos: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/15/homogenizer.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/15/homogenizer.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las dos primeras pueden correr a la vez (cada una escribe sus propios archivos). La rejilla del orden es de 0,25
unidades en la vista entera y de 0,8 en el detalle; `HM_STEP=0.5` la hace más gruesa para ensayar. Para depurar sin
correr todo: `HM_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla y quién va delante.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/homogeneizador_data.json` (cámara y puntos de los rótulos), `out/fig.css` y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`HM`), los huecos del bloque y del cabezal, la carrera de cada pistón y el caudal que dan. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS`: ancla, vista, texto, posición y lado), los de la lámina en inglés (`ROTULOS_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html`; con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/mezclado/_homogeneizador.qmd` en el libro (la vista, el círculo y los rótulos en
español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina` escribe la
lámina de la edición en inglés, `en/figuras/15/homogenizer.svg` (pocos rótulos en inglés, 428 pt de ancho, colores
resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node ../paleta-libro.mjs`
vuelve a pintar la vista sin rehacer el dibujo.
