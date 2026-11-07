# La línea de vapor aislada en isométrico (skill `anatomy`)

Figura del capítulo 21 del libro de operaciones unitarias (Heat in equipment), para la sección «La línea aislada en la
planta»: un tramo de la línea que lleva los 1600 kg/h de vapor saturado a 5 bara de la caldera al extractor de la
planta de aceite esencial, al exterior, sobre un soporte de tubería. El tubo es de acero al carbono de 4 in cédula 40,
forrado con 50 mm de lana mineral y una chaqueta de aluminio. Todo va a escala real, en milímetros (`geo.mjs`), salvo lo
que dice «Lo que va exagerado»; un círculo amplía la pared cinco veces, con el perfil de temperatura.

- **El soporte**: un tramo de la viga del soporte de tubería (una W de 200 × 150, cortada adelante, con su sección en
  I), dos guías de ángulo atornilladas al ala y la zapata: una T soldada al fondo del tubo, de 125 mm de alto y 250 mm
  de largo, que baja por el aislante y se desliza sobre la viga entre las guías. El aislante y la chaqueta pasan por
  encima de la zapata.
- **La chaqueta de aluminio**, en hojas: en cada traslapo circunferencial, de 50 mm, la hoja de aguas arriba va por
  fuera (el vapor corre hacia +x y la línea baja en ese sentido); el traslapo a lo largo va a las dos, con el borde de
  la hoja de afuera hacia abajo. Bandas de acero inoxidable de 13 mm cada 300 mm, una sobre cada traslapo, cada una con
  su sello; ninguna sobre la zapata ni sobre la T de la pierna de goteo.
- **El corte escalonado**: la cuña φ ∈ [315°, 450°] (del lado del lector y arriba) se quita de la chaqueta en 1 m, de la
  lana 150 mm más adelante y del acero otros 150 mm más adelante. Se ven el escalón de cada capa, la cara de afuera de
  la lana con la junta de las dos medias cañas (partidas en φ = 50° y 230°) y el alambre que las amarra, la cara de
  afuera del tubo, las caras del corte en los planos φ = 90° y 315°, el tubo por dentro, dos flechas del vapor y una
  película de condensado en el fondo, con su flecha.
- **La pierna de goteo**, en un punto bajo, antes de la válvula: una T hacia abajo del mismo diámetro, forrada como el
  tubo hasta 520 mm bajo el eje, con dos bandas; debajo, el bolsillo desnudo con su casquete y un tapón, y a un lado,
  120 mm sobre el fondo, el niple de 3/4 in sobre su asiento, el cuerpo de una trampa de disco (el cuerpo forjado, las
  dos bocas en línea y la tapa hexagonal) y la salida que baja al retorno. La trampa es del capítulo 28: aquí va solo
  su cuerpo.
- **La válvula de compuerta de 4 in con su chaqueta desmontable**: un cojín de tela que abraza el cuerpo y las dos
  uniones de bridas y monta 50 mm sobre la chaqueta del tubo a cada lado, con dos correas con hebilla, una cincha en el
  cuello de la derecha y una bota cerrada con un cordón alrededor del bonete. Asoman el cuello del bonete, la brida de
  la prensaestopas con sus dos espárragos, el arco de dos brazos con su puente y su buje, el vástago (roscado arriba) y
  el volante de cuatro rayos. La válvula por dentro no se dibuja: la tapa la chaqueta.
- **La unión de bridas con su chaqueta desmontable, en corte**: la misma cuña quita la parte de adelante de la chaqueta
  (tela con relleno aislante) y deja ver las dos bridas de cuello soldable de 4 in clase 150 con su cara realzada, la
  empaquetadura, los ocho espárragos de 5/8 in con sus tuercas, el tubo desnudo entre cada cuello y el remate del
  aislante, la tapa del remate de la izquierda y la chaqueta del tubo bajo los cuellos de la chaqueta desmontable.
- **El extremo de la derecha**, cortado por un plano: el anillo de acero, las dos medias cañas de lana con sus juntas,
  la chaqueta y, por el agujero, el tubo por dentro.
- **El detalle** (`node build.mjs --detalle`): la cara del corte vertical (φ = 90°) cinco veces más grande, con el
  vapor, la pared de acero, la lana, la chaqueta y el aire de arriba, y el perfil de temperatura dibujado sobre ella: el
  radio hacia arriba y la temperatura a lo largo del tubo, con un eje arriba y sus marcas en 20, 41 y 152 °C. 152 °C en
  el vapor y en el acero, la caída logarítmica por la lana hasta 41 °C en la chaqueta, en aire quieto, y el aire que
  baja a 20 °C.

**Ningún nombre de fabricante.**

## Qué sale de dónde

Las páginas son las impresas (las fichas de `fuentes/` del libro dicen cómo pasar de la página del PDF a la impresa).

| Dato | Fuente |
|---|---|
| El tubo de 4 in cédula 40: 114,30 mm por fuera, 6,02 mm de pared, 102,26 mm por dentro | Perry (2008), tabla 10-22, p. 10-78; es la tabla `tbl-tub-cedula` del capítulo 10 del libro |
| El aislante de un tubo va en medias cañas (o en tercios o cuartos); el que lleva una chaqueta aparte se amarra con alambre o con bandas antes de ponerla; las válvulas y los accesorios llevan cubiertas preformadas; el acabado de un tubo puede ser de aluminio, y se asegura con cinta, adhesivo, bandas o tornillos | Perry (2008), p. 11-76 |
| La primera capa de aislante va en dos medias cañas | ASHRAE (2014), p. 10.8 |
| El aislante de 2 in nominales sobre un tubo de 4 in mide unos 52 mm (el caso usa 50); el acabado de un sistema por encima de 27 °C debe impedir que entre el agua y dejar salir la humedad; un acabado metálico pierde menos calor y, sin pintar, sube la temperatura de la superficie | Perry (2008), tabla 11-21 y texto, p. 11-71 |
| Bajo un aislante mojado se corroe el tubo; una chaqueta de aluminio no protege del fuego | Perry (2008), p. 11-72 |
| Toda tubería al exterior lleva chaqueta metálica; la de aluminio, de 0,41 mm como mínimo, con traslapos de 50 mm como mínimo dispuestos para que el agua escurra en el sentido de la pendiente; bandas de acero inoxidable de 13 × 0,50 mm cada 300 mm; la chaqueta de las válvulas y los accesorios, como la del tubo; los traslapos a lo largo de una chaqueta de PVC, a las diez o a las dos | ASHRAE (2014), p. 10.7 |
| Lo que se revisa en un aislamiento: la humedad en la parte de abajo de los tubos horizontales y en los soportes, las bandas flojas, el sello de las cubiertas de bridas y válvulas, la cámara térmica | ASHRAE (2014), p. 10.10 |
| Los soportes no deben estorbar la dilatación del tubo, son de acero y no deben dejar que la línea se combe donde tiene que drenar; las guías dirigen el movimiento | Perry (2008), pp. 10-122 y 10-123 |
| Las bridas de 4 in clase 150: 230 mm de diámetro, 22,3 mm de espesor mínimo, cuello de 135 mm y 75 mm de largo por el cuello, cara realzada de 157,2 mm y 2 mm; ocho espárragos de 5/8 in en un círculo de 190,5 mm | ASME B16.5-2013, tablas 4, 7 y 8, pp. 64, 71 y 73 |
| La línea de vapor va con una pendiente hacia los puntos donde se recoge el condensado, y ahí van las trampas | Bylund (1995), p. 179 |
| El vapor: 1600 kg/h saturado a 5 bara, 151,83 °C; con 50 mm de lana (k = 0,0499 W/(m·K) a su temperatura media, 96,6 °C) y chaqueta de aluminio (ε = 0,055), en aire quieto a 20 °C y 73,7 kPa: 151,80 °C por fuera del acero, 41,33 °C en la chaqueta y 55,1 W/m (`cuentas()` da lo mismo con el perfil logarítmico) | El modelo del capítulo (`herramientas/calor.py`; `notas/calor-en-equipos/modelo.md`, §3), con el vapor del capítulo 12. El esquema daba 39 °C y 51 W/m con una k de 0,045; el capítulo usa la de la API |
| Las flechas del vapor y del condensado | Esquemáticas |

Perry 8.ª: pp. 10-78, 10-122, 10-123, 11-71, 11-72 y 11-76; ASHRAE Handbook, Refrigeration (SI), 2014, cap. 10 (es de
las tuberías frías: lo que se toma de ahí vale para la chaqueta y las bandas de cualquier línea al exterior); ASME
B16.5-2013; Bylund, *Dairy Processing Handbook* (1995). Todas están en `referencias.bib` del libro (`perry2008`,
`ashrae2014refrig`, `asmeb16.5`, `bylund1995`).

**Medida del libro** (típica de una línea así, escogida para el dibujo; de `fuentes/` no se copió nada: se leyeron las
páginas y se tomaron los números):

- **la zapata**: la T de 125 mm de alto bajo el tubo (alma de 10 mm, placa de 150 × 250 × 12 mm, entre dos bandas); ninguna fuente de
  `fuentes/` describe la zapata de una línea caliente (la ASHRAE habla de soportes por fuera del aislamiento, que es lo
  de las líneas frías). La viga W de 200 × 150 y las guías de ángulo de 50 × 50 × 6;
- **la chaqueta**: las hojas de hasta unos 900 mm, el traslapo a lo largo a las dos (la ASHRAE lo da para el PVC; aquí, con el
  borde de afuera hacia abajo, para el aluminio) y el sello de cada banda;
- **las medias cañas**: el plano en que se parten (φ = 50° y 230°) y el alambre;
- **la pierna de goteo**: del mismo diámetro que el tubo, forrada hasta 520 mm bajo el eje, el bolsillo hasta 760 mm y
  la salida de la trampa 120 mm sobre el fondo; la trampa de disco con su niple de 3/4 in. La guía de vapor del DOE, que
  daría estas proporciones, no está en `fuentes/` (falta, según el esquema del capítulo, §9);
- **la válvula y su chaqueta**: la compuerta de vástago ascendente y sus proporciones (el bonete, el arco, el volante
  de 236 mm), la chaqueta de tela de 175 mm de radio con correas, cincha y bota; el remate del aislante a 240 mm del
  centro de la válvula;
- **la unión de bridas**: la empaquetadura de 3 mm, las tuercas de 27 mm entre caras y 16 mm de alto, el remate del
  aislante a 130 mm de la junta (deja sacar los espárragos), la chaqueta desmontable de 160 mm de radio;
- **el corte**: dónde va la cuña, sus escalones de 150 mm y dónde se toma el detalle (en x = −700 mm);
- **el aire**: el espesor de la capa donde la temperatura baja de 41 a 20 °C (esquemático, ver abajo).

**La pendiente** de la línea (Bylund, p. 179) no se dibuja: una de pocos milímetros por metro no se vería.

## Lo que va exagerado

- **La chaqueta**: 1 mm; la de verdad, de 0,4 a 0,6 mm (0,41 como mínimo, ASHRAE, p. 10.7).
- **Las bandas**: 0,8 mm de espesor (0,50 de verdad).
- **La película de condensado**: 3 mm; con 55,1 W/m, la línea condensa unos 94 g/h por metro (`cuentas()`), una película
  mucho más delgada.
- **La capa de aire** del perfil: la temperatura baja de 41 a 20 °C con una exponencial de 9 mm; su forma y su espesor
  no salen de ningún cálculo del capítulo. El perfil va dibujado 2 mm delante de la cara del corte.

## Cómo está armado

Las piezas de revolución alrededor del tubo se dibujan con el barrido del ciclón (`sweepSvg`): la sección (x, r) gira
alrededor del eje, cara por cara, y solo se pintan las caras que miran al lector. Lo que abraza a otra pieza (las
bandas, las correas, las cinchas, el cordón de la bota) se dibuja y se registra solo en la mitad de adelante
(`frontOf`): la de atrás la tapa la pieza que abraza, y con ella entera el orden se trabaría. Las caras del corte son
polígonos en su plano (`capPhi`, `capX`, `capRing`), registrados como prismas delgados. La pierna de goteo, del mismo
diámetro que el tubo, se dibuja en dos trozos que terminan en la curva de intersección (`cylPieceSvg`): el de adelante,
delante del tubo, y el del lado de +x, que se mete detrás; la bota y el niple de la trampa son asientos del kit
(`G.saddleOf`). Las bridas van en dos mitades (y > 0 y y < 0) con el cuello aparte, y cada espárrago en tres trozos
(los dos que asoman por las tuercas y el que se ve entre las bridas), para que el orden con la chaqueta cortada y con
las tuercas no se trabe. El extremo de la derecha es una sola pieza: el tubo por dentro y las caras del corte encima.

El dibujo va en milímetros y el audit en centímetros (`cm()`). La rejilla del orden es de 0,5 unidades en la vista
entera y de 2 en el detalle. El audit pasa sin excepciones.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`LV`) con su fuente, los radios (`G0`), el perfil de temperatura (`temperatura`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe `figuras/calor-en-equipos/_linea-vapor.qmd` en el repositorio del libro (la vista, el detalle y los rótulos) y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

```sh
node build.mjs --audit                 # la vista entera, unos 5 segundos; «audit passed»
node build.mjs --detalle --audit       # la pared ampliada, unos 3 segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/21/steam-line.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/21/steam-line.svg)
```

Para depurar sin correr todo: `LV_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién
va delante y dónde, y `LV_PROBE="x,y,pieza1,pieza2" node build.mjs` dice a qué profundidad toca cada una el rayo de ese
punto de la pantalla. La posición del círculo se cambia con `LV_DX` y `LV_DY` al correr `libro.mjs`.

## En el libro

En el capítulo se incluye con `{{< include figuras/calor-en-equipos/_linea-vapor.qmd >}}` dentro de un bloque
`::: {#fig-…}`, como el ciclón. El CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los colores propios de
la figura van en un `<style>` dentro del SVG. Los rótulos de arriba van en escalera (el de más a la derecha, más abajo)
para que ninguna línea cruce un texto; con la letra de 22 unidades quedan en 10,6 px en la columna de 620 px.

**La lámina impresa** (`--lamina`): la misma vista con el detalle, con pocos rótulos en inglés (Archivo de 7,5 pt),
428 pt de ancho y los colores resueltos. Después, `node herramientas/svg-a-pdf.mjs figuras/21/steam-line.svg` desde
`en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `lv-cs` y `lv-cast` (el
tubo, las bridas, la zapata, la trampa, el bonete y el arco) son fundición, y `lv-cs-cut`, su corte; `lv-in` (el tubo
por dentro) es el fondo seco del acero; `lv-al`, `lv-band`, `lv-bolt` y `lv-stem` (la chaqueta, las bandas, los
espárragos y el vástago) son acero, y `lv-al-cut`, su corte; `lv-wool` (la lana) es el amarillo de los aislantes, como el
poliuretano del congelador, y `lv-wool-cut` y `lv-fill-cut` (el relleno de las chaquetas desmontables), su corte;
`lv-blanket` y `lv-gasket` (la tela de las chaquetas desmontables y la empaquetadura), caucho; `lv-paint` y `lv-strap`
(la viga, las guías, el volante y las correas), pintado, y `lv-paint-cut`, la sección de la viga; `lv-agua` (el
condensado), agua; el vapor y el condensado en el azul; el perfil de temperatura en el naranja del calor, y su eje en
la tinta 2. Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el
dibujo.
