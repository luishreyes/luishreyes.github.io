# Tren de condensación de un arrastre de vapor en isométrico (skill `anatomy`)

Figura del capítulo 23 del libro de operaciones unitarias: el condensador, el subenfriador y el florentino de un
arrastre de vapor, unidos por sus líneas, con la persona de referencia de 1,75 m (`../persona.mjs`).

- **El condensador**: un tubos y coraza vertical de un paso, con cabezales de bonete y placas de tubos fijas que se
  extienden como bridas, apoyado en dos orejas sobre una estructura de dos columnas con ménsulas. Va cortado por el
  plano vertical de su eje que mira de frente al lector: se ven el haz (las dos filas de adelante, en tramos entre
  deflectores), los cuatro deflectores segmentados con sus ventanas a un lado y al otro, las placas de tubos (la de
  arriba con las bocas de los tubos), la cámara de arriba con la boquilla del vapor y la placa de choque, y la de abajo
  con el condensado translúcido, su nivel, unas gotas que caen de los tubos y el venteo sobre el nivel, con su válvula.
  Las boquillas del agua de la coraza van abajo a la izquierda y arriba a la derecha. Flechas: el vapor que baja y se
  reparte, y el agua que sube en zigzag por las ventanas.
- **El subenfriador**: horquillas de doble tubo apiladas sobre dos postes con brazos; atrás los cabezales de retorno, y
  adelante las bridas, los prensaestopas, las curvas del tubo interior, los puentes del ánulo y las boquillas del agua.
  Las ramas van partidas: en la rotura se ve la sección (el tubo exterior, el ánulo con agua y el tubo interior con el
  condensado).
- **El florentino**: el de `../florentino`, dibujado por `../florentino/dibujo.mjs` en la misma escena (con su eje en
  el origen y la misma cámara), para que sea el mismo recipiente.
- **Las líneas**: la del vapor, que llega desde la izquierda y baja a la boquilla de arriba; la del condensado, que
  baja de la cámara de abajo a la rama de arriba del subenfriador; y la que sale de la rama de abajo, con una reducción,
  y sube a la entrada del florentino. Las líneas que siguen fuera de la figura terminan en un par de bridas.

Va a escala real, en milímetros (`geo.mjs`), salvo las ramas partidas y lo que se dibuja más grande para que se vea
(las gotas y las flechas). Las medidas del caso y de dónde sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos 20 segundos (8 del orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/23/condenser-train.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/23/condenser-train.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`, como el florentino). `CA_ITEM="pieza" node build.mjs`
lista todo lo que se cruza con una pieza en pantalla; `node libro.mjs --anclas` escribe `out/anclas.html`, que muestra
dónde cae cada punto de los rótulos.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas del condensador (`CA.e`), del subenfriador (`CA.d`), la posición de la línea que sube al florentino y de la persona, y los tubos y bridas (`DN`). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS`) y los de la lámina en inglés (`ROTULOS_EN`), y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`. |

Los prismas de sección cualquiera vienen de `../florentino/xprism.mjs`.

## Qué escribe

`node libro.mjs` escribe `figuras/condensacion-y-ebullicion/_condensador-arrastre.qmd` en el libro (la vista y los
rótulos en español), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina`
escribe la lámina de la edición en inglés, `en/figuras/23/condenser-train.svg` (pocos rótulos en inglés, 428 pt de
ancho, colores resueltos), que `node herramientas/svg-a-pdf.mjs` pasa a PDF desde `en/`. Los colores salen de la paleta
del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs` (las clases `ca-*`; el florentino
lleva las suyas, `fl-*`): si cambia un color, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
