# Los siete impulsores en isométrico (skill `anatomy`)

Figura del capítulo 14 del libro de operaciones unitarias (Agitación), sección «Los impulsores»: los siete impulsores
del capítulo dibujados como objetos sólidos, cada uno con su trozo de eje, su cubo, su chaveta, sus prisioneros y sus
pernos, para que el lector vea cómo es cada uno. Todo va a escala real, en milímetros (`geo.mjs`).

- **Las cinco turbinas** (hélice, palas inclinadas, hidrofoil, Rushton y paleta) van con el mismo diámetro, D = 450 mm,
  y la misma cámara, así se comparan: al pasar de una a otra en el libro, el eje queda en el mismo sitio. 450 mm (18 in)
  es lo más grande que se hace una hélice (McCabe, p. 261).
- **El ancla y la cinta** van en su tamaño de pared, el 95 % del diámetro de un tanque de T = 1200 mm con fondo
  elíptico 2:1 como el del caso, del que se ve la mitad de atrás (el tanque fantasma): la envolvente y el fondo por
  dentro, la franja de la envolvente que se ve por fuera a la derecha, el borde de arriba y la cara del corte. Van a
  otra escala que las turbinas.

Las proporciones que dan las fuentes del capítulo van con su página; las demás son **medida del libro**: típicas de un
impulsor así, escogidas para la figura. De `fuentes/` no se copió nada: se leyeron las páginas y se tomaron los números.

## Cada impulsor

- **Hélice marina** (`helice`): tres palas con paso igual al diámetro, el «paso cuadrado» (McCabe, p. 261, y tabla 9.2,
  p. 278, la de paso 1,0), fundidas en una pieza con su cubo (Paul, p. 354, por eso no se hace grande). Cada sección
  de la pala va sobre un cilindro, como un tornillo: el ángulo es atan(p / 2πr), de 58° junto al cubo a 17,7° en la
  punta. Medida del libro: el contorno de la pala (cuerda máxima de 0,70 R hacia la mitad, punta redonda), el sesgo
  hacia atrás de 0,30 R en la punta, el espesor de 12 mm en la raíz a 3 mm en la punta, una curvatura de 2,5 % de la
  cuerda, el cubo de 90 mm y 116 mm de largo, la arandela y la tuerca del extremo. Las tres palas se ven distintas: una
  casi de frente, otra de lado y la tercera con la raíz de canto.
- **Turbina de cuatro palas inclinadas** (`pbt`), la del caso del capítulo: cuatro palas planas a 45° de ancho
  W = D/5 (McCabe, tabla 9.2, p. 278), empernadas a orejas soldadas al cubo (Paul, p. 354: «bolted and tack-welded»),
  con el borde de ataque arriba para que bombee hacia abajo. Medida del libro: el cubo cuadrado de 92 mm y 124 mm de
  alto, las orejas de 10 × 64 mm hasta r = 128 mm, las palas de 8 mm desde r = 70 mm, dos pernos M10 por pala con su
  tuerca y la punta de la rosca, los dos prisioneros, la arandela y el perno del extremo del eje. En el dibujo del
  tanque agitado la misma turbina va soldada a un cubo cuadrado; aquí se ve cómo se arma una de palas cambiables.
- **Hidrofoil** (`hidrofoil`): tres palas anchas en el cubo y angostas en la punta (McCabe, p. 264), torcidas y con
  curvatura, con menos inclinación en la punta que en el cubo, lo que da un paso casi constante (Paul, p. 357). Es
  genérico: no copia ninguna marca. Medida del libro: 42° junto al cubo y 20° en la punta (paso constante desde 0,4 R),
  cuerdas de 112 mm en la raíz y 58 mm en la punta, cortada en r = R, curvatura de hasta 5 % de la cuerda, espesor de 10 a 4 mm,
  cubo de 80 mm y 104 mm de alto, soldado.
- **Turbina Rushton** (`rushton`): un disco con seis palas planas verticales de largo L = D/4 y alto W = D/5 (McCabe,
  tabla 9.2, p. 278, y p. 262; Paul, p. 356); el disco de 0,75 D (Paul da 0,66 y 0,75 D, p. 356), así media pala queda
  sobre el disco. Medida del libro: el disco de 8 mm, el cubo de 90 mm sobre el disco, la ranura de cada pala sobre el
  borde del disco y los dos soportes soldados al disco, uno arriba y otro abajo, con dos pernos M8 cada uno; la
  arandela y el perno del extremo bajo el disco.
- **Paleta** (`paleta`): dos palas planas verticales de alto W = D/5, la «paleta plana, dos palas» de McCabe (tabla
  9.2, p. 278), cuyo número de potencia usa el capítulo. Geankoplis (p. 177) da palas de 1/6 a 1/10 del largo; se dejó
  la de McCabe. Medida del libro: las orejas de 12 mm soldadas al cubo, las palas de 10 mm empernadas a su costado con
  cuatro pernos M10, el cubo de 90 mm y 140 mm de alto.
- **Ancla** (`ancla`): D = 0,95 T, así la holgura con la pared es de 2,5 % de T, 30 mm; dos brazos verticales de ancho
  W = D/10 y alto H = D (Perry, p. 18‑28). Medida del libro: el fondo del ancla sigue el fondo elíptico con la misma
  holgura de 30 mm (Perry da la de la pared), la platina de 16 mm, el cubo abajo en el extremo del eje, los dos tirantes
  de arriba y su collar, el eje de 80 mm. El ancla va en el plano del corte, así la holgura se ve entre el brazo y la
  cara cortada de la pared.
- **Cinta helicoidal doble** (`cinta`): dos cintas, D = 0,95 T, ancho W = D/10, paso igual a D y alto H = D (Perry,
  p. 18‑29, la cinta típica de doble vuelta); cada cinta da una vuelta y van a 180°. Las cintas se curvan «al revés»,
  con el ancho en el radio (Perry, p. 18‑29). Paul (p. 385) cuenta también la cinta interior que bombea al revés; aquí
  va la de Perry, que es la que dibuja el capítulo. Medida del libro: el espesor de 16 mm, la cinta empieza 40 mm sobre
  la línea de tangencia, los brazos de 36 mm con la sección inclinada como la cinta en su borde de adentro, en tres
  niveles (abajo, en el medio y arriba, a lo largo de x), los tres collares y el eje de 80 mm. La holgura con la pared
  no se ve de lado (la cinta pasa detrás del corte), así que el rótulo de la pared la dice.

## Cómo está armado

- **Las palas torcidas** (hélice e hidrofoil) se dibujan en triángulos: cada triángulo se recorta a lo que se ve y a
  las franjas de tono (los bordes de las franjas quedan rectos dentro de cada triángulo, sin escalones), se pinta por
  capas de profundidad y las piezas del mismo tono se unen en un solo trazo (`unionPath`). El espesor es de lente, con
  los bordes redondos. Cada pala va en dos piezas, partida por el plano vertical del eje que mira al lector: lo de atrás
  queda detrás del cubo y lo de adelante delante, así el orden no se traba donde la raíz da la vuelta al cubo. El
  contorno es el de la superficie media: bordes de ataque y de salida, punta, raíz y el pliegue (n·V = 0), sin las
  migas que asoman por un pelo (`sinMigas`); cada tramo se pinta con la capa de su profundidad, así lo que la pala
  tapa de sí misma queda tapado y ninguna línea termina en el aire (`scripts/lines.mjs` del skill da 0). Para el
  audit, cada pieza registra una rejilla de prismas planos de su espesor (`sheetShapes`).
- **Las palas de la Rushton** van en tres piezas (encima del disco, debajo y la franja de afuera a la altura del disco),
  unidas sin línea con la opción `seams` de `xprism.mjs` (agregada para esta figura: las aristas de la sección donde el
  sólido sigue en otra pieza no se pintan).
- **Las cintas** van en tramos de 22,5°, partidos también en el plano de los brazos (ψ = 0 y π).
- **El tanque fantasma** va en piezas: la envolvente por dentro hasta la silueta, la franja de la derecha por fuera (va
  delante de las cintas que pasan detrás), el fondo, el borde y la cara del corte en tres (derecha, izquierda y fondo).
  La envolvente se registra como prismas de sección de corona, sin cortes.

**El audit en unidades más grandes.** El dibujo va en milímetros, pero el audit muestrea las superficies cada 0,6
unidades: `sc()` pasa cada forma registrada a unidades de 4 mm en las turbinas (U = 0,25) y de 1 cm en las de pared
(U = 0,1), y el audit recibe la misma cámara con la escala por 1/U (`PA`), como en el tanque agitado.

**Peso.** Los siete SVG van en línea en la página del libro: los trazos se reescriben con coordenadas relativas en
décimas (`compact`), las piezas de un mismo tono van en un trazo y los colores van en clases (`im-*`), que `libro.mjs`
pone una sola vez en el `<style>` del selector.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit de los siete. Escribe `out/{impulsor}.svg`, `out/{impulsor}.json` (cámara y puntos de los rótulos), `out/fig.css` y `preview.html` (los siete sin rótulos). |
| `geo.mjs` | Las medidas de cada impulsor y del tanque, con la fuente de cada proporción. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los de las otras figuras, con la opción `seams`). |
| `rotulos.mjs` | Los nombres de los impulsores y de sus piezas: `ROTULOS` (español, `[ancla, lado, texto]`), `ROTULOS_EN` (inglés, por ancla), `IMPULSORES` (los nombres de los botones en los dos idiomas) y `DESCRIPCION` (lo que lee un lector de pantalla en cada vista). |
| `libro.mjs` | Escribe `figuras/agitacion/_impulsores.qmd` en el repositorio del libro y `out/libro-preview.html`; con `--lamina`, la lámina de la edición en inglés. |

```sh
node build.mjs --audit                 # los siete, unos 3 minutos; cada uno debe terminar en «audit passed»
node build.mjs --imp=rushton --audit   # uno solo (helice, pbt, hidrofoil, rushton, paleta, ancla, cinta; o varios con comas)
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/14/impellers.svg (por defecto)
```

El orden de las turbinas toma unos segundos cada una; el del ancla y el de la cinta, unos 40 s, por el tanque.

Para depurar el orden sin correr todo: `IM_ITEM="pieza" node build.mjs --imp=…` lista todo lo que se cruza con una
pieza en pantalla, quién va delante y dónde; `IM_DROP=1` dice qué reglas de orden se soltaron y el lazo que las
obligó; `IM_PIX="x,y"` dice qué formas corta el rayo de ese punto de la pantalla, y con `IM_SCAN="a,b"` e
`IM_PIX="x0,y0,x1,y1"` recorre una zona buscando dónde va `a` delante de `b`. `IM_STEP=0.5` hace la rejilla del orden
más gruesa (más rápido, menos fino).

## En el libro

En el capítulo se incluye con `{{< include figuras/agitacion/_impulsores.qmd >}}` dentro de un bloque
`::: {#fig-agi-impulsores}`. El archivo trae las siete vistas, todas con la misma caja (así el selector no mueve la
página), y siete botones en el orden Hélice, Palas inclinadas, Hidrofoil, Rushton, Paleta, Ancla y Cinta helicoidal.
Son radios con CSS, sin JavaScript: cada botón es la etiqueta de su radio, el que está escogido va con el amarillo como
campo (como las pestañas de las familias del capítulo) y las flechas del teclado pasan de uno a otro. El CSS de las
piezas es el de siempre (`estilo/anatomia.css`); el del selector va en el mismo archivo, todo bajo `.imp-sel`. En el
teléfono los botones bajan en tres filas y el dibujo se desliza de lado, como las otras figuras de `anatomy`.

**La lámina impresa** (`--lamina`): los siete en una rejilla de 4 + 3, con su nombre en inglés debajo (Archivo de
7,5 pt) y sin rótulos, 428 pt de ancho. Las cinco turbinas van a una escala y el ancla y la cinta a otra. Chromium
(Playwright) resuelve los estilos del kit en clases propias, como en el separador V‑102; los trazos quedan de 0,32 pt
por cada px del kit. Después, `node herramientas/svg-a-pdf.mjs figuras/14/impellers.svg` desde `en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro (`estilo/paleta.json`, sección `isometricas`, en el repositorio del libro), la misma de todas sus figuras isométricas: `libro.mjs` la pasa por `../paleta-libro.mjs`, que le da a cada clase el tono de su material. `im-ss` es acero; `im-sh` (el eje), pintado; `im-hw` (pernos, arandelas, chavetas), fundición; la mitad de atrás del tanque del ancla y de la cinta (`im-gh`), acero a media opacidad, para que quede atrás; los taladros y las bocas de los prisioneros, hueco. La lámina en inglés (`--lamina`) también resuelve los colores de la paleta cuando se vuelva a sacar. Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar las vistas del libro sin rehacer el dibujo.
