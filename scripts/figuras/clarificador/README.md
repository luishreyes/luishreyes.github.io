# El clarificador de placas en isométrico (skill `anatomy`)

Figura del capítulo 17 del libro de operaciones unitarias (Sedimentación y decantación), para después del ejemplo 17.4,
«El clarificador del agua de servicios»: el tanque rectangular que limpia 25 m³/h de agua floculada antes del filtro de
doble medio, sin el muro que mira al lector. Todo va a escala real, en milímetros (`geo.mjs`), con el piso de adentro en
z = 0; un círculo amplía catorce veces dos canales entre placas.

- **El tanque**: concreto, 1,3 m de ancho por 5,13 m de largo por dentro, 3,6 m de agua y 0,6 m de borde libre; muros
  de 250 mm sobre una losa de 600 mm. En la cara de adentro del muro de atrás, sobre el agua, y en la de afuera del muro
  de la salida, los conos de los tensores del encofrado.
- **La entrada**: el agua floculada llega por un tubo DN 200 desde el floculador y entra por el muro de la entrada a una
  cámara de 300 mm. El **muro difusor**, de concreto de 150 mm y a lo ancho de todo el tanque, la reparte en toda la
  sección por 21 orificios de 75 mm (tres columnas por siete filas, a 0,43 m entre centros).
- **El primer cuarto, sin placas** (1,28 m): ahí cae el flóculo pesado, van las ruedas del extremo del barredor y su
  cadena de transmisión, y bajo él la **tolva de lodos**, a lo ancho, con una cara vertical bajo el muro difusor y la otra
  a 60°. Una **pantalla** de acero inoxidable, de 2,9 a 3,8 m, separa la zona de entrada del agua clara: el agua tiene
  que pasar bajo el paquete.
- **El paquete de placas**: 52 placas de acero inoxidable de 1,5 m × 1,5 mm, a 60° y con 50 mm libres entre caras,
  inclinadas hacia la entrada; la primera arranca bajo la pantalla y la última termina contra el muro de la salida. El
  canto de arriba queda a 2,9 m (0,7 m bajo la superficie) y el de abajo a 1,6 m. Abajo se apoyan en dos ángulos de
  75 × 75 × 6 mm junto a los muros; arriba las separa un peine a cada lado.
- **La canaleta del agua clara**: en el centro, a lo largo de la zona de placas, de 250 mm de ancho; a cada lado, una
  placa de vertederos en V de 90° y 50 mm de hondo cada 150 mm (24 por lado), empernada sobre la pared de la canaleta.
  Cuelga de tres ménsulas (brazo, tornapunta y placa de anclaje) en el muro de atrás, pasa por el muro de la salida y
  descarga a la **caja de salida**, de acero, afuera de ese muro, sobre dos tornapuntas; de la caja sale el tubo DN 200
  al filtro.
- **El barredor de cadenas y paletas**: cuatro ejes con sus chumaceras de brida en el muro de atrás, cada uno con dos
  ruedas dentadas de nueve dientes para cadena de 152,4 mm de paso; dos cadenas, una junto a cada muro; seis paletas de
  76 × 152 mm, de 1,2 m de largo, con zapatas de desgaste que corren sobre dos rieles del piso. Por el piso las paletas
  van hacia la entrada y empujan el lodo a la tolva; vuelven por arriba, bajo el paquete. El **motorreductor** va en la
  corona del muro de atrás y mueve el eje de arriba de la entrada con una cadena de transmisión.
- **La purga**: un tubo DN 150 sale del fondo de la tolva por la losa a una **válvula de cuchilla** con actuador
  neumático (cuerpo de orejas, caja de la cuchilla, columnas, vástago y cilindro con sus dos tomas de aire), sobre un
  soporte, y sigue al espesador.
- **El agua, el flóculo y el lodo**: el agua va translúcida en la cara del corte (y = 0) y en la superficie, en pedazos
  donde la atraviesan la canaleta, la pantalla, el muro difusor y la cadena de transmisión. Los flóculos van en la cara
  del corte, muchos en la zona de entrada, menos bajo el paquete y casi ninguno en el agua clara; en la vista entera van
  dibujados mucho más grandes que los reales. El lodo llena la tolva hasta 150 mm bajo el piso, forma una capa delgada en
  el piso y se amontona delante de las dos paletas que van por el piso.
- **Las flechas**: el agua (azul) entra, pasa los orificios, baja bajo la pantalla, corre bajo el paquete, sube por tres
  canales y sale arriba hacia la canaleta y por el tubo al filtro; el lodo (café) resbala por las placas, el barredor lo
  arrastra por el piso a la tolva y sale por la purga.
- **El detalle** (`node build.mjs --detalle`): dos canales en el plano del corte, catorce veces más grandes, con las
  placas de 1,5 mm, el agua que sube por el centro de cada canal, flóculos de 2 a 4 mm (dentro de los 1 a 4 mm de los de
  alumbre de Kawamura) que caen a la placa de abajo, y la película de lodo pegada a la cara de arriba de cada placa, más gruesa
  hacia abajo, que resbala.

**Ningún nombre de fabricante.** Kawamura y MWH nombran módulos comerciales; el dibujo sigue la disposición que
describen, no un equipo en particular.

## El corte

Se quita el muro de y > 0. Lo que llega al plano y = 0 (la losa, los muros de los extremos, el muro difusor, la
pantalla, las placas, el ángulo y el peine de adelante, los ejes del barredor, el lodo y el agua) se ve cortado ahí; las
ruedas, las cadenas y las paletas quedan detrás, enteras.

## Qué sale de dónde

Las páginas son las impresas (las fichas de `fuentes/` del libro dicen cómo pasar de la página del PDF a la impresa).

| Dato | Fuente |
|---|---|
| 25 m³/h, 5 m/h sobre el área que cubren las placas (5 m²), el primer cuarto libre (6,67 m² de tanque), 1,3 m de ancho, 5,13 m de largo, 3,6 m de agua; placas de 1,5 m a 60° separadas 50 mm | El caso del capítulo (`herramientas/decantadores.py`, función `clarificador`; ejemplo 17.4 y `tbl-sed-caso`) |
| El primer cuarto del tanque sin módulos: para instalar y mantener el barredor, para que caiga el flóculo pesado y como zona de calma a la entrada; los módulos pueden colgar de las canaletas; canaletas a 3–4 m entre centros que recogen el agua del área cubierta; acero inoxidable 304 delgado | Kawamura (2000), p. 156; MWH (2012), p. 682 |
| Placas a 60° como mínimo para que el lodo de alumbre resbale; el agua sube por las placas a 60° y el flóculo resbala al fondo para la remoción mecánica | Kawamura (2000), pp. 154 y 157; MWH (2012), p. 687 |
| A contracorriente: el agua sube y el lodo baja; es el arreglo más común | MWH (2012), pp. 682–687 y tabla 10-6, p. 681 |
| Placas a 45–60° (lo común, 55–60°), separadas 50–75 mm; el sólido resbala a la zona de abajo y el líquido claro sube bajo el techo de cada canal | Perry (2008), p. 18-74 |
| La disposición: muro difusor a la entrada, canaletas con placas de vertedero sobre las placas, barredor de cadenas y paletas debajo | MWH (2012), fig. 10-16, p. 681 (adaptada de Kawamura) |
| Muro difusor en toda la sección, con el mayor número de orificios iguales, de 75 a 200 mm, a 0,25–0,5 m entre centros, con 0,3 a 0,9 mm de pérdida (menos de 10 mm) | Kawamura (2000), pp. 149 y 152; MWH (2012), p. 669 (100 a 200 mm) |
| Vertederos en V empernados a las canaletas; orificios sumergidos como alternativa; ante un filtro de alta tasa, como el de doble medio, la ruptura del flóculo en el vertedero importa poco | Kawamura (2000), p. 152; MWH (2012), p. 672 |
| Carga de los vertederos de un tanque con módulos: 3,7 a 7,5 m³/(m·h); profundidad de 3,6 a 4,5 m; velocidad en los módulos de hasta 0,15 m/min | Kawamura (2000), pp. 171–172 |
| Con módulos de alta tasa, remoción continua del lodo, con barredor de cadenas y paletas (o carros sumergidos); el barredor pide al menos 3,7 m de agua | Kawamura (2000), pp. 156, 158 y 169; MWH (2012), p. 682 |
| Las tolvas poco inclinadas con una válvula que se abre dos o tres veces al día no funcionan; fondo plano, o casi, hacia la tolva | Kawamura (2000), p. 157; MWH (2012), p. 673 |
| El barredor arrastra el lodo a una tolva en un extremo con paletas fijas a cadenas sin fin; paletas de plástico | Perry (2008), p. 18-74; MWH (2012), p. 673 |
| Velocidad del barredor: 0,3 m/min por el piso y de 1,5 a 3 en el retorno; pendiente del piso de 1:600 con barredor | Kawamura (2000), pp. 170–171; MWH (2012), tabla 10-4, p. 669 |
| Tubos de drenaje y de lodo de 150 mm como mínimo | MWH (2012), p. 674 |
| 0,6 m de borde libre | Kawamura (2000), p. 161 |
| No más de 0,25 m/s del floculador al sedimentador | Kawamura (2000), pp. 120–121 (en el capítulo, `sec-sed-floculacion`) |
| Flóculos de alumbre de 1 a 4 mm | Kawamura (2000), tabla 3.2.5-1, p. 143 (en el capítulo) |
| Las flechas del flujo | Esquemáticas |

**Medida del libro** (típica de un tanque así, escogida para el dibujo; de `fuentes/` no se copió nada: se leyeron las
páginas y se tomaron los números):

- **el concreto**: muros de 250 mm, losa de 600 mm con 200 mm de pie, corona a 4,2 m;
- **la entrada**: tubo DN 200 a 2,6 m (0,21 m/s a 25 m³/h, bajo los 0,25 de Kawamura), cámara de 300 mm, muro difusor
  de 150 mm; los 21 orificios de 75 mm en tres columnas a 0,43 m y siete filas a 0,44 m, la de arriba a 0,56 m bajo la
  superficie. A 25 m³/h el agua pasa por ellos a 0,075 m/s y pierde 0,8 mm, con un coeficiente de 0,61 (cálculos del
  libro, dentro de los 0,3 a 0,9 mm de Kawamura);
- **la tolva**: 0,48 m de ancho arriba, 0,25 abajo y 0,4 m de hondo, con la cara de afuera a 60°;
- **la pantalla**: 10 mm, de 2,9 a 3,8 m;
- **las placas**: 1,5 mm de espesor; 52 placas, con 59,5 mm de paso en planta; el canto de arriba a 2,9 m y el de abajo a
  1,6 m; los ángulos de 75 × 75 × 6 mm y los peines de 40 × 25 mm;
- **la canaleta**: 250 mm de ancho, del fondo a 3,30 m a la pared a 3,56 m; los vertederos de 90° y 50 mm cada 150 mm, 24
  por lado. Con 7,46 m de vertedero a 25 m³/h la carga es de 3,4 m³/(m·h) y el agua pasa 26 mm sobre el fondo de cada V
  (Q = 1,38 H^2,5; cálculos del libro);
- **la caja de salida**: 0,60 × 0,70 m, de 2,78 a 3,80 m, en lámina de 6 mm;
- **el barredor**: ejes a (0,90; 0,41), (0,90; 0,93), (4,65; 0,93) y (4,65; 0,41) m, ejes de 60 mm, ruedas de nueve
  dientes con 223 mm de radio de paso, cadenas a 150 mm de cada muro, seis paletas repartidas a lo largo de los 9,9 m de
  cadena, rieles de 50 × 10 mm; las ruedas de la transmisión, de 120 y 150 mm, y el motorreductor de ejes en ángulo;
- **la purga**: la válvula de cuchilla con su actuador y su soporte, y la longitud de los tubos;
- **el lodo y el flóculo**: la capa del piso (8 mm), los montones delante de las paletas, el lodo de la tolva, la
  película de las placas (de 0,8 a 3,4 mm en el detalle) y el tamaño de los flóculos de la vista entera (de 10 a 20 mm,
  para que se vean).

Otras cuentas del dibujo (`cuentas()` en `geo.mjs`): bajo el paquete el agua se acerca a 0,20 m/min. En los 51 canales
que caben en el paquete el agua sube a 7,5 m/h, y la ecuación de las placas retiene lo que caiga a más de 0,48 m/h: el
ejemplo del capítulo, con la ecuación 10-38 de MWH, da 5,8 m/h y 0,36 m/h porque toma toda el área cubierta como área de
canales (66,7 canales), sin los dos triángulos que deja el paquete inclinado en sus extremos ni el espesor de las placas.

## Cómo está armado

Casi todo son cajas y prismas a lo largo de y (de la cara de atrás hasta el plano del corte, y = 0), con la tapa del
corte pintada plana. Lo que se envuelve o queda en una cavidad se parte para que el orden de pintura no tenga ciclos:

- **la losa** va en cinco pedazos: la de detrás del muro de atrás, la de la entrada (con la cara vertical de la tolva y la
  boca de la purga), la de bajo el fondo de la tolva, la del talud de 60° y la del resto del piso; así el lodo de la
  tolva queda delante de unos y detrás de otros;
- **cada rueda dentada** va en un elemento con la cadena que la abraza y 260 mm de cadena recta a cada lado (en los
  ramales verticales, la mitad del ramal): la rueda primero y la cadena encima, que es más ancha que los dientes; los
  tramos rectos del piso y del retorno van en cuatro trozos;
- **los ejes** van en tramos entre la chumacera y los cubos de las ruedas;
- **la transmisión** (las dos ruedas, el cubo y los dos ramales) va en un solo elemento;
- **los rieles** se cortan bajo los montones de lodo, que los tapan;
- **la superficie del agua** va en nueve pedazos, partida donde la atraviesan la canaleta, la pantalla, el muro difusor y
  la cadena de transmisión; la cara del corte del agua va con los huecos de las placas, del ángulo y de los ejes
  (`fill-rule: evenodd`), y las flechas que van en el plano del corte se dibujan en ese mismo elemento.

El dibujo va en milímetros y el audit en centímetros (`cm()`, como el congelador y el filtro de arena). La rejilla del
orden es de 0,25 unidades en la vista entera y de 2 en el detalle. El audit pasa sin excepciones.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`CL`) con su fuente, el caso (`CASO`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe `figuras/sedimentacion-y-decantacion/_clarificador-placas.qmd` en el repositorio del libro (la vista, el detalle y los rótulos) y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

```sh
node build.mjs --audit                 # la vista entera, menos de 2 minutos (uno del orden); «audit passed»
node build.mjs --detalle --audit       # los dos canales ampliados, unos 2 minutos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/17/plate-settler.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/17/plate-settler.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las dos primeras pueden correr a la vez (cada una escribe sus propios archivos). Para depurar sin correr todo:
`CL_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién va delante y dónde.

## En el libro

En el capítulo se incluye con `{{< include figuras/sedimentacion-y-decantacion/_clarificador-placas.qmd >}}` dentro de
un bloque `::: {#fig-…}`, como el florentino. El CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los colores
propios de la figura van en un `<style>` dentro del SVG. Con la letra de 22 unidades, los rótulos quedan en 9,8 px en la
columna de 620 px.

**La lámina impresa** (`--lamina`): la misma vista con el detalle, con pocos rótulos en inglés (Archivo de 7,5 pt),
428 pt de ancho y los colores resueltos. Después, `node herramientas/svg-a-pdf.mjs figuras/17/plate-settler.svg` desde
`en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `cp-conc` es concreto y
`cp-cut-c`, su corte; `cp-ss` y `cp-pipe` (las placas, la pantalla, la canaleta, la caja, los tubos), acero, y `cp-cut`,
`cp-cut1`, su corte; `cp-cast` y `cp-chain` (las ruedas, las cadenas, las chumaceras, la válvula), fundición;
`cp-paint` y `cp-frp` (el motorreductor, el actuador, las paletas), pintado; `cp-rubber` (las zapatas), caucho; el lodo
(`cp-lodo`, `cp-lodo-c`, `cp-lodo-pel`) y el flóculo (`cp-floc`), los tonos del sólido; las bocas, hueco; el agua, la
sombra honda del agua, más clara en la cara del corte (0,3) que en los demás cortes, porque se mira a través de un tanque
hondo, y casi opaca en el detalle (0,8), que se lee como un corte; las flechas, el azul de la base y el oscuro del sólido.
Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
