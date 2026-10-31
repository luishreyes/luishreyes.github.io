# El homogeneizador de alta presión en isométrico (skill `anatomy`)

Figura del capítulo 15 del libro de operaciones unitarias (Mezclado y escalado de tanques agitados), para «El
homogeneizador por dentro» de la sección «Homogeneizar»: el cabezal de una máquina de leche de 10 000 L/h (el caudal del
ejemplo de la leche homogeneizada del capítulo), a unos 20 MPa en la primera etapa y 2 MPa en la segunda, en corte.
Todo va a escala real, en milímetros (`geo.mjs`), salvo la rendija, que va exagerada (ver abajo).

- **El cárter**, solo su cara de adelante, con tres cajas de vástago y sus limpiadores de caucho.
- **Los tres pistones** de Ø 50 mm, cada uno con su vástago y su acople partido. Las manivelas van a 120° (90°, 210° y
  330° desde el punto muerto de atrás), así que los tres acoples quedan en puntos distintos de la carrera de 70 mm: el
  pistón 1 va empujando y los otros dos, chupando.
- **El bloque de la bomba**, macizo, de acero inoxidable, sobre dos pies. Se corta por el eje del cilindro 1: el pistón
  entra por el cartucho de sellos (brida, camisa y dos sellos con el espacio del agua de enfriamiento entre ellos) y
  llega casi a la columna de válvulas. En la columna, de abajo arriba: el colector de succión (a lo largo de los tres
  cilindros), la válvula de succión cerrada sobre su asiento, el resorte que la aprieta, la válvula de descarga abierta
  3 mm, su resorte, el colector de descarga y el tapón de la columna. Las dos válvulas son de disco con cuatro aletas
  que las guían en el asiento. Los tapones de los cilindros 2 y 3 asoman arriba del bloque. La leche entra por la
  derecha, abajo, por un tubo sanitario de 2 in con sus bridas.
- **El cabezal de homogeneización**, atornillado a la cara derecha del bloque, con las dos etapas: la primera de eje
  vertical (la leche sube por el asiento, pasa la rendija, choca con el anillo de impacto y sube entre el anillo y el
  forzador a la cámara) y la segunda de eje horizontal, igual. De la cámara de la segunda sale hacia arriba por un tubo
  sanitario de 1½ in.
- **Los actuadores hidráulicos**, uno por etapa: base con brida y dos pernos atrás, cilindro, émbolo cortado sobre la
  punta del forzador, el aceite en corte (amarillo translúcido) entre el émbolo y la tapa, el racor de la tapa y un tubo
  de 8 mm que termina en una unión.
- **El detalle** (`node build.mjs --detalle`): la primera etapa ampliada 3,2 veces en un círculo, con el camino de la
  leche por la rendija dibujado a los dos lados del eje. En el libro va a la derecha, abajo, unido por una línea al
  círculo chico que marca la primera etapa en la vista entera.

El corte quita la mitad que mira al lector (y > 0) del bloque, de sus pies, de los asientos, del tapón, del cartucho,
de los sellos, del cabezal, de los anillos, de los forzadores, de los émbolos, de los actuadores y de los tubos de la
leche. Los pistones, los acoples, los vástagos, las válvulas de disco, los resortes, el cárter, los racores y los tubos
del aceite van enteros. Los forzadores y los émbolos van cortados para que se vea la rendija.

**Ningún nombre de fabricante.** El dibujo sigue la disposición que describen las fuentes, no una máquina en
particular.

## Qué sale de dónde

| Dato | Fuente |
|---|---|
| Bomba de tres pistones (o cinco), unos 20 MPa, desfasados 120° para emparejar los pulsos | Lewis y Heppell (2000), pp. 60–61 |
| Una válvula de entrada y una de salida por cilindro, que solo dejan pasar en un sentido; las partículas se quedan entre la válvula y su asiento | Lewis y Heppell, p. 61 |
| La válvula de homogeneizar apretada contra su asiento con una fuerza que se ajusta; se levanta y abre la rendija | Lewis y Heppell, p. 61; Berk (2013), pp. 211–212 |
| Segunda válvula justo después, a unos 2 MPa | Lewis y Heppell, p. 62; Fellows (2000), p. 113 |
| Barreras estériles detrás de los cilindros en la máquina aséptica (no se dibujan: la figura es la máquina común) | Lewis y Heppell, p. 62 |
| Rendija de hasta 300 µm, 80 a 150 m/s, anillo de impacto en algunas válvulas; válvula de dos etapas con actuadores hidráulicos (fig. 4.5) | Fellows, p. 112 |
| Cabezal con una o dos válvulas en serie; la válvula de una etapa con vástago de presión, asiento y paso del fluido (fig. 7.17) | Berk, pp. 211–212 |
| Bloque de acero inoxidable macizo; doble sello en cada pistón, con agua entre los sellos para enfriarlos; dispositivo de homogeneización con ajuste hidráulico de la presión | Bylund (1995), *Dairy processing handbook*, p. 117 |
| Forzador, anillo de impacto, asiento y actuador hidráulico; la cara de adentro del anillo perpendicular a la salida de la rendija; primera etapa vertical y segunda horizontal (figs. 6.3.5 y 6.3.6); la rendija de unos 0,1 mm; la presión del aceite sobre el émbolo equilibra la de la leche sobre el forzador, con un sistema de aceite por etapa | Bylund, p. 118 |
| Anillo de impacto: el flujo cambia de dirección dos veces 90° | Perry (2008), p. 21‑68 |

**Medida del libro** (típica de una máquina así, escogida para el dibujo; de `fuentes/` no se copió nada: se leyeron
las páginas y se tomaron los números):

- **los pistones**: Ø 50 mm, carrera de 70 mm, 420 r/min. Con 96 % de rendimiento volumétrico dan 9,97 m³/h, los
  10 000 L/h del ejemplo (`caudal()` en `geo.mjs`). Paso entre cilindros de 130 mm; cilindro de Ø 56 (el pistón no lo
  toca: lo guían los sellos);
- **el bloque**: 330 × 320 × 300 mm sobre dos pies de 80 mm; colector de succión de Ø 44, de descarga de Ø 40; columna
  de válvulas de Ø 36, 60, 68 y 80 de abajo arriba (cada tramo más ancho que el de abajo, para armarla desde arriba);
- **las válvulas de la bomba**: de disco, Ø 50 × 8 mm, sobre asientos de Ø 32 por dentro, con cuatro aletas de 4 mm;
  resortes de alambre de 4 mm y Ø 42 de diámetro medio; la de descarga, abierta 3 mm;
- **el cartucho de sellos**: brida de Ø 124, camisa de Ø 90 por 70 mm, sellos de Ø 50 × 66 de 14 mm;
- **la válvula de homogeneizar**: forzador de Ø 45 sobre un asiento de Ø 20 por dentro y Ø 68 por fuera. Con la rendija
  de 0,1 mm de Bylund, el anillo que deja el forzador (π × 45 mm × 0,1 mm = 14 mm²) lleva los 10 m³/h a unos 200 m/s,
  lo mismo que da Bernoulli con 20 MPa (√(2Δp/ρ) = 197 m/s). En la segunda etapa, con 2 MPa, la misma cuenta da unos
  60 m/s y una rendija de unos 0,3 mm. El anillo de impacto: Ø 50 × 68 × 15 mm, a 2,5 mm del forzador;
- **la rendija exagerada**: 3 mm en la primera etapa (0,1 mm de verdad: 30 veces más ancha) y 4 mm en la segunda (unos
  0,3 mm). No se dibuja la inclinación de 5° del asiento que menciona Bylund (p. 118): a esta escala no se vería;
- **los actuadores**: émbolo de Ø 72 mm; con la fuerza de la leche sobre el forzador (unos 16 kN a 20 MPa, contando que
  la presión cae a lo largo de la rendija) el aceite va a unos 4 MPa;
- **el cabezal**: 260 × 130 × 150 mm; conductos de Ø 20; cámaras de Ø 80;
- **los tubos de la leche**: sanitarios de 2 in (Ø 50,8 × 1,65) a la entrada y de 1½ in (Ø 38,1 × 1,65) a la salida,
  con bridas de 16 a 18 mm.

## Cómo está armado

**Las carcasas (el bloque y el cabezal)** se describen como una caja menos sus huecos: cilindros con su eje, su radio y
su largo (`blockVoids` y `headVoids` en `geo.mjs`). Con eso se sacan tres cosas:

- la cara del corte, por cuadrados marchantes sobre la distancia con signo de la caja menos los huecos en el plano
  y = 0 (`contours`), en lazos cerrados que se rellenan con la regla par-impar;
- las paredes de los huecos que se ven por el corte (`voidWalls`): la mitad de atrás de los huecos con el eje en el
  plano y lo que alcanza a verse de los colectores, que lo cruzan, más las tapas que miran al lector. Un punto de la
  pared se dibuja si el rayo hacia el lector llega al plano del corte sin cruzar metal (`visible`); los bordes salen por
  bisección, sin escalones. Las paredes mojadas van con los tonos del agua (la leche);
- lo que se registra para el audit: la caja menos los huecos, en dos elementos (las paredes, recortadas a la ventana que
  la boca del corte proyecta a lo largo de la mirada, y la cara del corte con las caras de afuera, como láminas) y la
  carcasa entera, sin dibujar, para los apoyos y las holguras.

Cada tramo de un hueco se mete 3 mm en el siguiente cuando el siguiente es más ancho: si dos huecos solo se tocan, la
distancia con signo de su unión se queda corta en la costura y las holguras ven metal donde no lo hay.

**Las piezas de revolución cortadas** (`turnedCut`): cada tramo [s0, s1, r0, r1] es un medio anillo (la mitad de atrás)
y la cara del corte es la unión de los tramos, sacada también por cuadrados marchantes.

**Lo que tapan las caras del corte** (`coverOf`): una pieza que va dentro de otra (el pistón en su cartucho, el forzador
en la guía y en el anillo, el émbolo en su cilindro, las aletas de atrás en su asiento) tiene partes de su mitad de
atrás que quedan detrás del metal cortado del contenedor. Esas partes ni se dibujan (el dibujo se recorta a lo que no
tapan las caras del corte de sus contenedores) ni se registran (la forma se corta con los prismas que esas caras
proyectan a lo largo de la mirada); la pieza entera se registra aparte, sin dibujar, para los apoyos. Sin esto el orden
de pintura veía la pieza delante del contenedor (por la boca) y detrás (por el metal) a la vez.

**El pistón 1**, que cruza el plano del corte dentro del cartucho, va en dos elementos (`splitDisc`): la mitad de atrás
(con lo que tapan el cartucho, los sellos y el bloque quitado) y la de adelante, cada una recortada a la proyección de su
mitad. Los resortes van en trozos cortados donde la hélice pasa por su silueta y por el plano del corte.

**El detalle** es la misma geometría con otra cámara (el mismo acimut y la misma elevación, 3,2 veces más grande,
centrada en la primera etapa) y solo con las piezas que caen en su cuadro, recortadas a un círculo.

**Peso.** El SVG va en línea en la página del libro, con los trazos en coordenadas relativas en décimas (`compact`).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/homogeneizador_data.json` (cámara y puntos de los rótulos), `out/fig.css` y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`HM`), los huecos del bloque y del cabezal, la carrera de cada pistón y el caudal que dan. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS`: ancla, vista, texto, posición y lado), los de la lámina en inglés (`ROTULOS_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe `figuras/mezclado/_homogeneizador.qmd` en el repositorio del libro (la vista, el detalle y los rótulos) y `out/libro-preview.html`; con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

```sh
node build.mjs --audit                 # la vista entera, unos 19 minutos (7 del orden y 12 del audit); «audit passed»
node build.mjs --detalle --audit       # el detalle de la primera etapa, unos 15 minutos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en tres segundos: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/15/homogenizer.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/15/homogenizer.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las dos pueden correr a la vez (cada una escribe sus propios archivos). La rejilla del orden es de 0,25 unidades en la
vista entera y de 0,8 en el detalle (la misma medida en milímetros); `HM_STEP=0.5` la hace más gruesa para ensayar. Para depurar sin correr
todo: `HM_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla y quién va delante.

## En el libro

En el capítulo se incluye con `{{< include figuras/mezclado/_homogeneizador.qmd >}}` dentro de un bloque
`::: {#fig-…}`, como el mezclador estático. El CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los colores
propios de la figura van en un `<style>` dentro del SVG.

**La lámina impresa** (`--lamina`): la misma vista con el detalle, con pocos rótulos en inglés (Archivo de 7,5 pt),
428 pt de ancho y los colores resueltos. Después, `node herramientas/svg-a-pdf.mjs figuras/15/homogenizer.svg` desde
`en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `hm-ss`, `hm-trim` y
`hm-plunger` son acero; `hm-hard` (los anillos de impacto) y `hm-cast` (las cajas del cárter), fundición; `hm-paint` y
`hm-rod`, pintado; `hm-rubber`, caucho; `hm-sub` (las paredes mojadas por la leche), agua; `hm-oil` y `hm-oil-liq`
(el aceite en corte, con opacidad), aceite; el corte del bloque y del cabezal, el del acero; el de sus piezas, un paso
más claro; el de los anillos, el de la fundición; el de los pies, el del pintado; el de los sellos, el del caucho. Si
cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
