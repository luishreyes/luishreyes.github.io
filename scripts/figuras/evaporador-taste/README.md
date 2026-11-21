# Una etapa del TASTE en isométrico (skill `anatomy`)

Figura del capítulo 24 del libro de operaciones unitarias: una etapa de un evaporador TASTE de película descendente
(la calandria, el separador ciclónico y la bomba del jugo), con la persona de referencia de 1,75 m (`../persona.mjs`) y
un círculo que amplía la boca de un tubo.

- **La calandria**: un haz vertical de tubos largos, con espejos fijos que se extienden como bridas, cortado por el
  plano vertical de su eje que mira de frente al lector. La fila de tubos del plano del corte va abierta, con el jugo
  que baja en película por la pared; detrás, la fila siguiente, entera; tres placas soporte segmentadas cruzan el haz.
  El espejo de arriba lleva las bocas de los tubos de la mitad de atrás y las de la fila del corte, abiertas.
- **La cámara de reparto**, arriba, cortada: la brida, el cilindro, el cono y el cuello, y encima el tubo reducido con
  el Venturi (difusor, garganta y convergente, también cortado), con sus tuercas. Adentro, la niebla del jugo (un
  abanico translúcido con gotas) y las flechas que bajan del Venturi a las bocas. La línea del jugo llega de la
  izquierda y baja al Venturi.
- **La coraza**, cortada, con tres boquillas: el vapor de calentamiento arriba a la izquierda (con su placa de choque frente
  al hueco de tres posiciones sin tubo, que la vista no alcanza a mostrar), el venteo de los incondensables y los
  aromas arriba a la derecha, bajo el espejo, con su válvula de bola, y el condensado abajo a la derecha, cerca del
  espejo, cuya línea sale derecho hasta pasar la columna y ahí baja. Las líneas que siguen fuera de la figura terminan
  en un par de bridas.
- **La cámara de abajo**, cortada: la brida, el cilindro y el cono hasta el cuello de la mezcla, con las gotas que caen
  de los tubos y las flechas hacia el cuello.
- **Los apoyos**: dos orejas sobre las ménsulas de dos columnas detrás de la calandria, con sus cartelas, y arriba una
  viga entre las columnas con dos tirantes a una media banda que guía la coraza (cortada con ella).
- **La línea de la mezcla y el separador**: del cuello de abajo baja un carrete, da la vuelta en un codo de radio largo
  y entra tangencial al separador ciclónico, entero: el cono de abajo, el cilindro y el fondo 2:1, la salida del vapor
  arriba (cuello, bridas y la línea al efecto siguiente) y la del jugo abajo; tres patas de tubo sobre orejas.
- **La bomba**: centrífuga de succión axial, delante del separador, con su eje a lo largo del corte (caracol, soporte
  de los rodamientos, guarda del acople, motor con aletas y caja de conexiones, sobre su base). La succión baja del
  separador, viene hacia el lector y entra por la izquierda; la descarga sube y sigue a la etapa siguiente.
- **El círculo del detalle** (`--detalle`): la boca del tubo del centro, en el espejo de arriba, abierta por el plano
  del corte: el espejo cortado con las muescas del tubo y de sus dos vecinos de la fila del corte, las bocas de los
  vecinos de atrás con el jugo que entra por el borde, la niebla que baja, la película que se forma en la pared y
  engruesa hacia abajo (más gruesa que la real, con sus ondas), el vapor del jugo por el centro y, bajo el espejo, el
  vapor de calentamiento entre los tubos. `libro.mjs` lo pone a la izquierda de la calandria, unido por una línea al
  círculo chico que marca la boca.
- **La persona**, de pie en el piso entre la estructura y el separador.

Va a escala real, en milímetros (`geo.mjs`), salvo lo que se dibuja más grande para que se vea (las gotas, la película
del detalle y las flechas). Las medidas del caso, de qué fuente sale cada pieza y lo que va supuesto están en el
repositorio del libro, en `notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit             # unos 40 segundos (5 del orden); debe terminar en «audit passed»
node build.mjs --detalle --audit   # el círculo del detalle, unos 6 segundos; también «audit passed»
node build.mjs --fast              # sin orden ni audit: para mirar la geometría
node libro.mjs                     # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/24/taste-stage.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/24/taste-stage.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs out/preview-detalle.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`). `EV_ITEM="pieza" node build.mjs` lista todo lo que se
cruza con una pieza en pantalla; `node libro.mjs --anclas` escribe `out/anclas.html`, que muestra dónde cae cada punto
de los rótulos. La posición del círculo del detalle se cambia con `EV_DX` y `EV_DY` al correr `libro.mjs`.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`EV`: la calandria, el separador, la línea de la mezcla, la bomba y la persona), los tubos y bridas (`DN`), las alturas, que salen de la entrada del separador hacia arriba (`cotas()`), y el triángulo de los tubos (`tubos()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS`) y los de la lámina en inglés (`ROTULOS_EN`), los del detalle con el ancla en `d:`, el nombre del círculo (`PIES`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`. |

## Qué escribe

`node libro.mjs` escribe `figuras/evaporacion/_taste.qmd` en el libro (la vista, el círculo del detalle y los rótulos en
español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina` escribe la
lámina de la edición en inglés, `en/figuras/24/taste-stage.svg` (menos rótulos en inglés, 428 pt de ancho, colores
resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs` (las clases `ev-*`; el jugo va en los tonos del
aceite): si cambia un color, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
