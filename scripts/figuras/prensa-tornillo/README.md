# La prensa de tornillo para aceite (expulsor) en isométrico (skill `anatomy`)

Figura del capítulo 18 del libro de operaciones unitarias (Filtración), para la sección «Apretar para sacar el
líquido» (`sec-fil-expresion`): una prensa continua de tamaño mediano, de unos 1000 kg/h de semilla oleaginosa
acondicionada (caliente y en hojuelas), dentro de los 40 a 8000 kg/h de Fellows. Se quita el cuarto de arriba de la
jaula que mira al lector, para ver el tornillo, y la mitad de adelante de la capota, la bandeja, la tolva y la canaleta
de la torta. Todo va a escala real, en milímetros (`geo.mjs`), con el eje del tornillo en y = 0, z = 950 mm; un círculo
amplía dieciséis veces dos barras de la jaula cortadas de través.

- **La base**: dos perfiles en C a lo largo, travesaños bajo cada equipo y patas niveladoras.
- **El accionamiento**: el motor va sobre el reductor y le da vueltas por correas, bajo una guarda, del lado de la
  entrada; el reductor es de engranajes helicoidales de ejes paralelos (entra arriba y sale a la altura del tornillo),
  con aletas, la junta de la carcasa, las tapas de los rodamientos y la mirilla del aceite. El último paso es de
  engranajes, no de correas, porque las correas patinan con el par de una prensa; los engranajes helicoidales toman
  parte del empuje del tornillo (Muhammad y otros, 1984, p. 245). Entre el reductor y la caja de la entrada, el soporte
  del cojinete de empuje, con su pie y el engrasador.
- **La alimentación**: las hojuelas calientes, del acondicionador, caen a una tolva cónica (la mitad de atrás, con su
  superficie); un alimentador de tornillo vertical, con su motorreductor sobre un puente, las empuja por un tubo a la
  garganta de la caja de la entrada. Las prensas grandes llevan un alimentador; las chicas, una tolva sola (Muhammad y
  otros, 1984, p. 244).
- **La caja de la entrada**: un cilindro de fundición con bridas, con la mitad de arriba cuadrada bajo la garganta, en
  tres cuartos (el de arriba que mira al lector se quita), con el gusano de alimentación adentro.
- **La jaula**: cuatro bastidores (anillos de fundición de 400 mm) y tres tramos de barras planas de 12 × 30 mm y 280 mm
  de largo, paralelas al eje; en cada cuarto, una barra de cuchillas de 20 mm y once barras, con rendijas de 0,7 mm por
  dentro. Las barras son rectangulares, así que la rendija se abre hacia afuera, hasta 4,6 mm (cálculo del libro). Tres
  tirantes con sus tuercas sujetan los bastidores (el cuarto va en el cuarto que se quita).
- **El tornillo** (no se corta): el eje con siete gusanos enchavetados y un collar entre cada dos. Del primero al último el
  paso baja de 180 a 90 mm y el radio del núcleo sube de 45 a 80 mm; la punta de los filetes queda a 2 mm del agujero.
  El gusano de alimentación da casi dos vueltas y media; los de compresión, menos de una (270° a 310°). En cada collar de
  la jaula bajan cuchillas fijas, desde las barras de cuchillas hasta 4 mm del collar; se ven cortadas las de 0° y 90°.
  Del tornillo se dibuja solo lo que se ve: el cuarto de arriba que mira al lector; lo demás va dentro del material.
- **El material**: en las dos caras del corte (y = 0 arriba y z = 950 adelante), entre los filetes. Sueltas a la
  entrada (hojuelas con huecos), cada vez más chatas y juntas, y en el último tramo una torta compacta, más oscura, con
  una película de aceite contra las barras. Las hojuelas van más grandes que las reales.
- **La salida**: el anillo de salida, con el asiento cónico, cortado como la jaula; el cono, que deja una rendija anular
  de 12 mm (el espesor de la torta), con el hueco donde entra la tuerca del eje; la torta que sale pegada al cono y se
  parte en láminas, que caen por la canaleta. El cono va en la punta de un husillo roscado de 80 mm que pasa por una
  tuerca de bronce en el soporte, con su contratuerca y un volante de 350 mm; una escala en el soporte y una aguja en el
  cubo del cono dicen dónde está el cono.
- **El aceite**: gotitas en la boca de las rendijas del cuarto de abajo, gotas que caen de las barras de abajo a la
  bandeja (bajo la capota), el aceite en la bandeja con las ondas de las gotas, y el tubo que lo saca hacia el lector.
- **Las flechas**: las hojuelas entran a la tolva (café), el aceite sale por el tubo (ocre) y la torta cae por la
  canaleta (café).
- **La persona de referencia** (`../persona.mjs`): un maniquí de 1,75 m de pie en el piso, pasado el extremo de la base
  y un poco detrás del volante, mirándolo, con una sombra corta (`PT.persona` en `geo.mjs`, medida del libro). Los
  rótulos de la salida van debajo de ella, y el círculo más abajo. El detalle no la lleva.
- **El detalle** (`node build.mjs --detalle`): dos barras del cuarto de abajo, cortadas de través en x = 520 (el tramo
  del medio), dieciséis veces más grandes. Adentro, la torta: partículas aplastadas contra las barras, con aceite en los
  poros; las que no caben en la rendija se quedan atravesadas en su boca. El aceite llena las rendijas, sale por la boca
  de la rendija del centro, corre por la cara de afuera de la barra de abajo y gotea de su esquina.

**Ningún nombre de fabricante.** Las fuentes muestran prensas comerciales; el dibujo sigue la disposición que
describen, no una máquina en particular.

## El corte

Se quita el cuarto de arriba que mira al lector (y > 0, z > 950) de la jaula, los bastidores, la caja de la entrada, el
anillo de salida, el material y la torta que sale; así se ve el tornillo y, en el cuarto de abajo, las barras por fuera
con el aceite que sale entre ellas. De la capota, la bandeja, la garganta, el tubo del alimentador, la tolva y la
canaleta se quita la mitad de adelante (y > 0). El tornillo, el eje, los collares y el cono no se cortan (la convención
de los ejes en un corte). El cuarto de abajo de atrás no se dibuja en las piezas de en medio: lo encierran el material,
el tornillo y las barras de adelante.

## Qué sale de dónde

Las páginas son las impresas (las fichas de `fuentes/` del libro dicen cómo pasar de la página del PDF a la impresa).

| Dato | Fuente |
|---|---|
| Un barril horizontal robusto con un tornillo helicoidal de acero inoxidable; el paso de los filetes se acorta hacia la salida para subir la presión; la última parte del barril va perforada; la presión se regula con el diámetro de la salida; el calor de la fricción baja la viscosidad del aceite (algunas prensas llevan calentadores en el barril); de 40 a 8000 kg/h; la torta sale con 5 a 18 % de aceite | Fellows (2000), p. 152 |
| Calentar las semillas o la harina mejora la extracción: baja la viscosidad del aceite, lo suelta de las células y quita humedad | Fellows (2000), p. 150 |
| El acondicionamiento de las semillas molidas antes de la prensa: plastificar la masa, desnaturalizar las proteínas, juntar las gotas, bajar la viscosidad, quitar humedad | Berk (2013), p. 236 |
| Subir la presión poco a poco; un tornillo con el paso que se acorta | Berk (2013), p. 237 |
| Un tornillo que reemplaza las paletas y una compuerta ajustable a la salida, hidráulica, de resorte o puesta con un tornillo; la compresión sale de achicar el área de paso y de abrir o cerrar la compuerta; las prensas de semillas aguantan más de 50 000 kPa | Berk (2013), p. 238 |
| El tornillo gira dentro de un cilindro perforado o ranurado; su diámetro crece y su paso se acorta hacia la salida; las de alta presión son las de aceites, de capacidad relativamente pequeña | Perry (2008), p. 18-149 (fig. 18-195, p. 18-148) |
| La tolva arriba, en la entrada, con un alimentador en las prensas grandes; el cono en el eje, a la salida, que mantiene la contrapresión y fija el espesor de la torta; el paso menor que el diámetro y el eje a menos de 100 r/min; las rendijas de menos de 1 mm, que drenan el aceite y son un filtro grueso para los sólidos | Muhammad y otros (1984), p. 244 |
| Los gusanos en tramos, con el mismo agujero, enchavetados en un eje central; el paso que baja y el núcleo que crece; la jaula en dos mitades unidas con abrazaderas; las barras de 12 mm de ancho, 20 a 25 mm de alto y 280 mm de largo, separadas con láminas de acero de unos 0,7 mm, que forman un prisma hueco; la reducción con engranajes helicoidales | Muhammad y otros (1984), p. 245 |
| Las rendijas más abiertas a la entrada (0,8 mm) que a la salida (0,31 mm); los cantos de las barras redondeados | Muhammad y otros (1984), pp. 245–246 |
| Cada gusano de compresión con un filete de menos de 350° | Muhammad y otros (1984), p. 246 |
| Un collar entre cada dos gusanos; en las prensas grandes, cuchillas fijas que bajan de la jaula al espacio del collar para que el material no gire con el tornillo | Muhammad y otros (1984), p. 247 |
| El tornillo en un barril (jaula) con ranuras en la periferia por donde sale el aceite; la compresión, por el eje más grueso o el filete más corto; la torta va a una compuerta de salida; el cocinador antes de la prensa; la torta no baja de 3 a 5 % de aceite | Berk (1992), FAO, sección 3-1 |
| Las flechas del flujo | Esquemáticas |

Muhammad, D., Omar, A. W., Force, S. L. y Khan, S. A. (1984), «Oilseed processing technology in Pakistan. Part II:
Lahore oil expeller, mechanical aspects and improvements», *Pakistan Journal of Scientific and Industrial Research*
27 (4), 244–248 (de acceso abierto en pjsir.org). Berk, Z. (1992), *Technology of production of edible flours and
protein products from soybeans*, FAO Agricultural Services Bulletin 97, Roma (en línea en fao.org/4/t0532e). Ninguna de
las dos está aún en `referencias.bib` del libro.

**Medida del libro** (típica de una prensa así, escogida para el dibujo; de `fuentes/` no se copió nada: se leyeron
las páginas y se tomaron los números):

- **el tamaño**: unos 1000 kg/h de semilla, con el tornillo de 200 mm y el agujero de 204 mm; a 30 r/min, con hojuelas
  de 550 kg/m³ y un llenado de 0,3, el volumen de una vuelta del gusano de alimentación da unos 1200 kg/h (`cuentas()`
  en `geo.mjs`; un orden de magnitud, no un dato);
- **la jaula**: las barras de 30 mm de alto (las de 20 a 25 de Muhammad son de una prensa de 4 in); por cuarto, una barra
  de cuchillas de 20 mm y once barras de 12 mm, que dejan 0,69 mm por dentro (la media de Muhammad) y 4,6 mm por fuera;
  los bastidores de 50 mm de ancho y 400 mm de diámetro; los tirantes de 28 mm;
- **el tornillo**: siete gusanos, con pasos de 180, 165, 150, 135, 120, 105 y 90 mm y radios del núcleo de 45, 50, 56, 62,
  68, 74 y 80 mm; los filetes de 24 mm en la raíz y 14 mm en la punta; los collares de 40 mm; las cuchillas de 28 mm de
  ancho. El volumen de una vuelta baja 4,4 veces de la entrada a la salida (cálculo del libro);
- **la salida**: el asiento a 29°, la rendija anular de 12 mm, el husillo de 80 mm, la tuerca de bronce, el volante de
  350 mm y la escala de 10 mm por raya;
- **la alimentación**: el tornillo vertical de 208 mm, de 150 mm de paso, en un tubo de 224 mm; la tolva de 760 mm de
  boca;
- **el accionamiento, la bandeja, la capota, la canaleta y la base**: la disposición y las medidas;
- **el aceite y las hojuelas**: el tamaño de las gotas y de las hojuelas (más grandes que las reales, para que se vean).

## Cómo está armado

Las piezas de revolución que se cortan (la caja de la entrada, los bastidores, el anillo de salida, la torta que sale)
se dibujan con `sweepSvg`, un barrido de su sección alrededor del eje, en sectores: el de atrás (90° a 270°), el de
arriba atrás (90° a 180°) y el de abajo adelante (270° a 360°), cada uno su propio elemento, con su cara cortada en el
plano del corte; así las que envuelven el tornillo quedan detrás de él por atrás y delante por adelante. Su forma, para
el audit, es la pieza entera menos cajas que quitan lo que no se dibuja (`cut`). Los filetes son el mismo barrido con
paso, del cuarto que se ve (0° a 90°) de cada vuelta, y su forma es un prisma por cada 6°. El núcleo, los collares y la
punta del cono, como los filetes, solo el cuarto que se ve. Las patas del motor y del soporte de empuje llegan al plano
tangente de abajo del cuerpo (así nunca lo tapan); la rueda del volante va en cuatro arcos, para que cada rayo quede
delante de uno y detrás de otro; las gotas de cada tramo de barras van en su propio elemento.

El dibujo va en milímetros y el audit en centímetros (`cm()`, como el clarificador). La rejilla del orden es de 0,25
unidades en la vista entera y de 2 en el detalle. El audit pasa sin excepciones; en el detalle las barras son el suelo,
porque los bastidores que las sostienen quedan fuera del círculo.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`PT`) con su fuente y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe `figuras/filtracion/_prensa-tornillo.qmd` en el repositorio del libro (la vista, el detalle y los rótulos) y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

```sh
node build.mjs --audit                 # la vista entera, menos de un minuto; «audit passed»
node build.mjs --detalle --audit       # las dos barras ampliadas, unos segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/18/screw-press.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/18/screw-press.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Para depurar sin correr todo: `PT_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién
va delante y dónde. La posición del círculo se cambia con `PT_DX` y `PT_DY` al correr `libro.mjs`.

## En el libro

En el capítulo se incluye con `{{< include figuras/filtracion/_prensa-tornillo.qmd >}}` dentro de un bloque
`::: {#fig-…}`, como la prensa de cámaras. El CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los colores
propios de la figura van en un `<style>` dentro del SVG. Con la letra de 22 unidades, los rótulos quedan en 10,3 px en la
columna de 620 px.

**La lámina impresa** (`--lamina`): la misma vista con el detalle, con pocos rótulos en inglés (Archivo de 7,5 pt),
428 pt de ancho y los colores resueltos. Después, `node herramientas/svg-a-pdf.mjs figuras/18/screw-press.svg` desde
`en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `pt-ss`, `pt-bar` y
`pt-pipe` (el tornillo, las barras, la capota, la bandeja, la tolva, los tubos) son acero, y `pt-cut`, su corte;
`pt-cast` (la caja de la entrada, los bastidores, el anillo, el reductor) es fundición, y `pt-cut-c`, su corte;
`pt-paint` (la base, el motor, la guarda de las correas, el soporte del cono), pintado;
`pt-bronze` (la tuerca del husillo), cobre; `ps-persona`, el material «persona»; `pt-torta` y `pt-heap`, sólido, y `pt-torta-c`, su corte; las hojuelas y la
torta en las caras del corte, los tonos del sólido, del más claro (sueltas, con los huecos en `hueco.medio`) al más
oscuro (la torta compacta); el aceite (`pt-oil*`), los tonos del aceite; las flechas, el oscuro del sólido y del aceite.
Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
