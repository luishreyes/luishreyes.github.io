# Banco de hielo en isométrico (skill `anatomy`)

Figura del capítulo 26 del libro de operaciones unitarias: un banco de hielo de fusión externa, el evaporador inundado
de amoníaco que hace el agua helada de una planta de frío. Es un tanque rectangular abierto a la atmósfera, de lámina de
acero con poliuretano y forro, sobre un pedestal de concreto, con una tapa de paneles aislados. Se le quitó la pared
entera del costado largo que mira al lector, del fondo al borde, y por ahí se ve adentro: el haz de serpentines, muchos
circuitos verticales de tubo en zigzag con su capa de hielo, sobre perfiles en el fondo y una pletina por circuito; en el
circuito de adelante falta el hielo en un tramo, junto a una pletina, y se ven el tubo desnudo y el anillo de hielo
cortado. Encima del agua, junto al extremo de la derecha, el cabezal de salida de la mezcla de líquido y vapor y el de
entrada del líquido, con el tramo de cada circuito hasta su cabezal. En el fondo, la tubería de aire de PVC corre por el
pasillo de adelante, perforada, con sus ramales bajo el haz, y las burbujas suben por el pasillo; en el extremo de la
izquierda, el distribuidor del agua que vuelve de los usuarios. El agua va cortada en el plano de la pared que se quitó,
translúcida; donde faltan paneles de la tapa se ve su superficie, con los anillos de las burbujas que revientan.

El extremo de la derecha queda entero: la salida del agua helada, con su boca acampanada adentro y su válvula de
mariposa afuera, el visor de nivel, la placa de datos y la entrada del aire. Al pie, el soplador de canal lateral con su
filtro, sus silenciadores y su motor, y la descarga con la retención, que sube junto a la pared. Sobre el tanque, en dos
vigas, el separador de baja aislado: la mezcla que vuelve del cabezal de salida, la pierna de líquido que baja por su
válvula al cabezal de entrada, la succión al compresor con su válvula de corte, el líquido que llega del recibidor por la
válvula de nivel, la válvula de seguridad y el manómetro. En la tapa, la caja del control del espesor del hielo, con su
electrodo, que baja por el pasillo de adelante hasta el segundo paso. Las flechas blancas muestran el agua que entra por
el distribuidor, corre a lo largo del tanque y sale. Va a escala real, en milímetros (`geo.mjs`), salvo las burbujas y
las flechas, que son un esquema.

Las medidas del caso y de qué fuente sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos tres minutos (el orden, cerca de dos); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría (no deja el SVG en orden)
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
node libro.mjs --anclas       # imprime dónde cae cada ancla, para acomodar los rótulos
BH_ITEM="pieza" node build.mjs     # lista todo lo que se cruza con una pieza en pantalla (lento)
BH_PAIRS="pieza" node build.mjs    # los pares del orden de una pieza, con el área en que va delante cada una
BH_PER="x,y,rumbo" node build.mjs  # prueba otro lugar para la persona de referencia
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`), como el extractor y el condensador evaporativo. Lleva la
persona de referencia de 1,75 m (`../persona.mjs`), siempre: el dibujo solo lo usa el libro (su lugar, en `BH.persona`
de `geo.mjs`). Usa los prismas de `../extractor-arrastre/xprism.mjs`.

Lo que atraviesa una pared no se dibuja adentro de ella: la tubería de aire llega a la cara de adentro y la descarga del
soplador a la de afuera, y la salida del agua arranca en la cara de afuera. Cada circuito del haz es una sola pieza, de
atrás hacia adelante, en un solo trazo por clase (los pasos rectos y las curvas en U, sin tapas en las juntas). De los
circuitos de atrás solo se dibuja lo que puede verse (los dos pasos de arriba, el extremo de la derecha y, en el que va
detrás del tramo sin hielo, ese tramo), pero cada uno se registra entero, por su ruta, porque así es: lo demás lo tapa el
de adelante. El circuito de adelante va en tres piezas: el hielo a cada lado del tramo abierto y el tubo desnudo. La
tubería de aire es una ruta, partida en la superficie del agua (lo de arriba va delante de ella y lo de abajo, detrás de
la cara del agua), y descansa en el fondo del tanque (`touch: ["floor"]`). Las boquillas que nacen en una superficie
curva (los tramos de los circuitos en sus cabezales, las bocas del soplador en su carcasa, la entrada del líquido en la
cabeza elíptica del separador) son asientos (`saddle`) cortados por su anfitrión. Las líneas llegan a bridas o a codos
de bola de otro dueño, para que el audit las vea apoyadas.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`BH`), los tubos y bridas (`DN`), la altura de cada paso del haz (`zPass`), la `y` de cada circuito (`yCirc`) y las cuentas del haz (`cuentas()`: el largo de tubo, el área, el hielo que guarda y el calor que deja pasar). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` y `out/libro-preview-620.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). |

## Qué escribe

`node libro.mjs` escribe `figuras/refrigeracion-y-congelacion/_banco-hielo.qmd` en el libro (la vista y los rótulos en
español, con la persona y su rótulo), que el capítulo incluye con `{{< include … >}}` dentro de un bloque
`::: {#fig-…}`, con el pie debajo. Los colores salen de la paleta del libro (`estilo/paleta.json`, sección
`isometricas`) por `../paleta-libro.mjs`, con las clases `bh-*`: si cambia un color, `node ../paleta-libro.mjs` vuelve a
pintar la vista sin rehacer el dibujo.
