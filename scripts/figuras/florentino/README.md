# Florentino en isométrico (skill `anatomy`)

Figura del capítulo 17 del libro de operaciones unitarias: un florentino, el decantador que separa en aceite y agua el
condensado de un arrastre de vapor, en corte por encima del fondo. Es un cilindro cerrado sobre patas: la entrada baja
por un tubo de calma central hasta debajo de la interfase y sale bajo un deflector; el aceite, más liviano, queda
arriba y sale por su rebose; el agua sale por abajo y sube por una pierna exterior hasta su codo de rebose, que fija la
interfase, con un rompe-sifón en lo alto. Se ven también la tapa bridada, las mirillas, el drenaje y las gotas de aceite
que suben por el agua (más grandes que las reales). El agua y el aceite van translúcidos en sus caras. Va a escala
real, en milímetros (`geo.mjs`).

Las medidas del caso y de qué fuente sale la forma del recipiente están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
CHROME_PATH=/opt/pw-browsers/chromium node build.mjs --audit   # unos 2 minutos (1 del orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
FL_ITEM="pieza" node build.mjs   # lista todo lo que se cruza con una pieza en pantalla
FL_PER="x,y,rumbo" node build.mjs  # prueba otro lugar para la persona de referencia
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`). `build.mjs` agrega la persona de referencia de 1,75 m
(`../persona.mjs`; su lugar, en `FL.persona` de `geo.mjs`); `dibujo.mjs` no la lleva, así que el tren de condensación
sale igual.

| Archivo | Qué es |
|---|---|
| `build.mjs` | La cámara, los ayudantes del kit, el orden de pintura (`A.settle`) y el audit; el dibujo está en `dibujo.mjs`. Escribe `out/fig.svg`, `out/fig.css`, `out/florentino_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`FL`), los tubos y bridas (`DN`), las alturas y dos secciones de uso común. |
| `dibujo.mjs` | El dibujo del recipiente (`dibujarFlorentino`), aparte de `build.mjs` para que otra figura lo ponga en su escena tal cual: el tren de condensación de `../condensador-arrastre`. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). `--anclas` imprime dónde cae cada rótulo. |

## Qué escribe

`node libro.mjs` escribe `figuras/sedimentacion-y-decantacion/_florentino.qmd` en el libro (la vista y los rótulos en
español, con la persona y su rótulo), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`.
La edición impresa en inglés copia esa vista dentro de `#impresion`: la persona y su rótulo llevan la clase `solo-es`
y allí no se ven. El SVG conserva el recorte de antes (`viewBox`) y la persona se pinta en un relleno a su derecha, que
dentro de `#impresion` vale 0, así la lámina inglesa sale como antes. Los colores salen de la
paleta del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node
../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
