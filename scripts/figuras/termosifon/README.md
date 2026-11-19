# El termosifón vertical en isométrico (skill `anatomy`)

Figura del capítulo 23 del libro de operaciones unitarias: el fondo de una columna de platos y su rehervidor de
termosifón vertical, abiertos por el plano vertical que pasa por los dos ejes, sin la mitad que mira al lector. Lo que
está en ese plano va cortado (la columna, el rehervidor, la línea de entrada, el retorno y el cimiento de la columna) y
lo de atrás va entero (el lado del vapor, la salida del fondo, las patas). Lleva la persona de referencia
(`../persona.mjs`). Va a escala real, en milímetros (`geo.mjs`), salvo las burbujas y las gotas.

- **La columna**: el cuerpo, cortado arriba de los dos últimos platos perforados (con su anillo de apoyo, su vertedero,
  su bajante y la espuma), el bajante del plato de arriba, la bandeja de sello del bajante de abajo con la lámina que
  rebosa, la boquilla del retorno en el plano del corte, el líquido del fondo con su superficie y sus ondas, la cabeza
  elíptica 2:1, el rompe-vórtice sobre la boquilla de abajo y la boca de la salida del fondo.
- **El faldón**: en dos tramos, con la cara de arriba siguiendo la cabeza; el anillo base con los pernos de anclaje, el
  cimiento cortado, la manga de la línea de entrada, la de la salida del fondo, la boca de acceso y dos respiraderos.
- **La línea de entrada**: de la boquilla de abajo de la columna, baja dentro del faldón, sale por su manga, pasa por
  una placa de orificio entre bridas (con su oreja) y sube al bonete de abajo del rehervidor; va llena de líquido.
- **El rehervidor**: espejos fijos que se extienden como bridas, coraza de un paso, bonetes con cabeza elíptica 2:1 y
  boquillas axiales; los tubos en cuadro, con la fila del plano del corte abierta (la mezcla que sube en bandas, cada vez
  más clara, con burbujas desde el segundo tramo) y la de atrás entera, las bocas de los tubos en el espejo de arriba,
  dos placas soporte segmentadas y el condensado sobre el espejo de abajo. Arriba, la mezcla con gotas; el codo y el
  tramo del retorno con el líquido por la pared de afuera del codo y por el fondo del tramo.
- **El lado del vapor**: la boquilla del vapor arriba de la coraza con su tubo, que llega de arriba; la del condensado
  a ras del espejo de abajo, que baja a una trampa de flotador y sigue; el venteo de los incondensables justo arriba
  del condensado, con una válvula de bola y el venteo termostático.
- **Las patas**: dos atrás, sobre sus pedestales, con las orejas de la coraza; las de adelante se van con el corte.
- **Las flechas y la cota**: la circulación en azul (el fondo que baja, la línea, los tubos, el retorno, el vapor que
  sube por los platos y el líquido que cae), el vapor de calentamiento y el condensado en naranja, y la cota de la
  cabeza estática entre los dos equipos: del nivel del líquido de la columna (a la altura de la cara de arriba del
  espejo de arriba) a la entrada de los tubos, con sus guías y el símbolo del nivel.

Las medidas del caso, de qué fuente sale cada pieza y lo que va supuesto están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # unos 65 segundos (unos 45 del orden); «audit passed»
node build.mjs --fast                  # sin orden ni audit, en unos segundos: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/23/thermosiphon.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/23/thermosiphon.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`). Para depurar sin correr todo: `TS_ITEM="pieza" node
build.mjs` lista lo que se cruza con una pieza en pantalla, quién va delante y dónde; `TS_PROBE="x,y,pieza1,pieza2"`
dice dónde toca cada forma de esas piezas el rayo de ese punto de la pantalla, y `TS_SDF="pieza,x,y,z"` la distancia a
sus formas desde un punto (en mm). `TS_CHUNKS=ruta` lista los trozos de un tubo.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`TS`), las alturas, que salen de la línea de entrada y del largo de los tubos (`cotas()`), y los centros de los tubos de las dos filas que se dibujan (`tubos()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS`), los de la lámina en inglés (`ROTULOS_EN`) y lo que lee un lector de pantalla en cada idioma. El lado `cota` pone el texto de canto sobre la cota, sin línea. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

## Qué escribe

`node libro.mjs` escribe `figuras/condensacion-y-ebullicion/_termosifon.qmd` en el libro (la vista con los rótulos en
español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina` escribe la
lámina de la edición en inglés, `en/figuras/23/thermosiphon.svg` (menos rótulos en inglés, 428 pt de ancho, colores
resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs` (las clases `ts-*`): si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
