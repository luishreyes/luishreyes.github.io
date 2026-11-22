# Extractor de arrastre con vapor vivo en isométrico (skill `anatomy`)

Figura del capítulo 32 del libro de operaciones unitarias: uno de los extractores de lecho fijo de una batería de
arrastre con vapor vivo, en corte. Es un recipiente vertical de acero inoxidable, aislado con lana mineral y su
chaqueta de lámina, con fondo y tapa elípticos, sobre cuatro patas. El corte es una ventana: se quita la mitad que mira
al lector entre la línea de tangencia del fondo y el borde de arriba del aislamiento, así que el fondo queda entero,
como una taza, y arriba quedan enteros el cuello del cuerpo, las bridas y la tapa con sus doce abrazaderas en C.

Por la ventana se ven la pared, la lana y la chaqueta cortadas; la canasta de lámina con su fondo perforado (la
rejilla), apoyada con una junta sobre un anillo soldado a la pared, con las barras debajo; la carga de cáscara
desgarrada con el espacio para el hinchamiento encima; el pleno con el anillo distribuidor perforado, sus ménsulas y el
brazo que llega de la boquilla. La carga va escalonada: se quita también el cuarto de atrás a la derecha hasta la
rejilla, para que se vean la placa perforada y los tres termopozos que entran al lecho (el pie de la figura debe decir
que la carga se quitó en ese cuarto solo para mostrarlos). Afuera: la línea del vapor vivo con la válvula todo o nada
de actuador neumático, las cabezas de los termopares, en la tapa la válvula de seguridad, el manómetro con su sifón y el
cuello de cisne con su termómetro y la junta para soltar la tapa, y abajo la purga con su válvula, el filtro en Y, la
trampa de flotador y el embudo sobre el sumidero. Las flechas blancas muestran el vapor que sale del anillo y sube por
la carga. Va a escala real, en milímetros (`geo.mjs`), salvo los trozos de cáscara, más grandes que los reales.

Las medidas del caso y de qué fuente sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos 2 minutos (1½ del orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría (no deja el SVG en orden)
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
node libro.mjs --anclas       # imprime dónde cae cada ancla, para acomodar los rótulos
EX_ITEM="pieza" node build.mjs   # lista todo lo que se cruza con una pieza en pantalla (lento)
EX_PAIRS="pieza" node build.mjs  # los pares del orden de una pieza, con el área en que va delante cada una
EX_PER="x,y,rumbo" node build.mjs  # prueba otro lugar para la persona de referencia
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`). Lleva la persona de referencia de 1,75 m
(`../persona.mjs`), siempre: el dibujo solo lo usa el libro (su lugar, en `EX.persona` de `geo.mjs`). Lo que atraviesa
la pared y la lana (los cuellos, el brazo del distribuidor, los termopozos) no se dibuja ni se registra adentro de
ellas: los cuellos arrancan en la chaqueta y los termopozos en la cara de adentro de la canasta. Las piezas que abrazan
a otras van partidas para el orden de pintura: cada abrazadera en sus dos quijadas, el lomo y los dos tramos del
tornillo, y la pared de la canasta en la franja junto al corte de la derecha y el resto.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`EX`), los tubos y bridas (`DN`), las cabezas elípticas y su chaqueta, la rejilla de agujeros y las secciones de uso común. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` y `out/libro-preview-620.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). |

## Qué escribe

`node libro.mjs` escribe `figuras/arrastre-de-vapor/_extractor.qmd` en el libro (la vista y los rótulos en español,
con la persona y su rótulo), que el capítulo incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Los
colores salen de la paleta del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`, con las
clases `ex-*`: si cambia un color, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
