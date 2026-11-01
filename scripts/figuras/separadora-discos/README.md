# La separadora centrífuga de discos autodeslodante en isométrico (skill `anatomy`)

Figura del capítulo 19 del libro de operaciones unitarias (Separación centrífuga), para la sección «La separadora por
dentro»: una separadora de discos autodeslodante de tamaño mediano, de 450 mm de tazón a 5400 r/min, de tazón semiabierto
(con bombas centrípetas a la salida), puesta como purificadora: le saca el agua y el sólido a un aceite. La misma
máquina, con otro disco de gravedad, descrema la leche. Se corta por el plano del eje (y = 0) y se quita la mitad que
mira al lector del bastidor, la capota, el tazón con todo lo que va adentro, la caja de salidas y sus tubos. Todo va a
escala real, en milímetros (`geo.mjs`), salvo la pila de discos (ver «La pila»); un círculo amplía nueve veces el canal
entre dos discos.

- **El bastidor**: un cilindro de fundición sobre tres cojines de caucho, con el piso, la cubierta que separa la cámara
  del engranaje de la del tazón y la brida de arriba, donde se apoya la capota de chapa con su cuello.
- **El accionamiento**: el motor horizontal, colgado de una placa en la pared del bastidor por una linterna; el eje
  horizontal con el tambor del freno y su zapata, y la rueda de bronce que engrana con el tornillo sin fin del eje del
  tazón; el eje vertical en un rodamiento abajo y otro en el cuello, sobre la cubierta (sin los resortes de ese
  rodamiento, que nombra el Perry en la p. 18-118: no se leían en el corte); las cajas de los rodamientos del eje
  horizontal por dentro de la pared.
- **El tazón**: el cuerpo, con la columna central donde corre el fondo móvil, las lumbreras de descarga en la pared (el
  corte pasa por dos) y el canal del agua de maniobra que sube por el fondo; el fondo móvil (el pistón), apretado contra
  el anillo de sello de la capota del tazón por el agua de maniobra de abajo; la capota del tazón y el anillo de cierre
  roscado que la une al cuerpo; el disco de gravedad y el anillo chico que forma la cámara del pesado.
- **Adentro**: el distribuidor (su piso, el cubo con los puertos por donde sale la mezcla, la falda cónica bajo la pila
  y el cuello); la pila de discos a 50° de la horizontal, con los agujeros de distribución a 120 mm del eje; el disco de
  arriba, sin agujeros, con su cuello, el rebose del liviano y el techo de la cámara del liviano.
- **Lo fijo de arriba**: el tubo de alimentación por el eje, con su brida; las dos bombas centrípetas (discos de rodete),
  cada una con su canal y su paso: la del liviano en su cámara, dentro del cuello del disco de arriba, y la del pesado
  arriba, sobre el disco de gravedad; la caja de salidas con los dos tubos: el liviano sale por la izquierda y el pesado
  por la derecha.
- **El sólido y el agua de maniobra**: el ducto tangente del bastidor a un ciclón de sedimento sobre tres patas; la
  tubería del agua de maniobra con su válvula de solenoide, el pasamuros y la boquilla bajo el tazón.
- **Los líquidos en el corte**: el liviano (aceite o crema) hacia el eje y el pesado (agua o leche descremada) hacia
  afuera, con la zona neutra a la altura de los agujeros; la mezcla en el tubo, el distribuidor y la columna de agujeros
  del lado derecho, con pintas de agua; el sólido contra la pared en la cámara del diámetro mayor; el agua de maniobra
  bajo el fondo móvil; los anillos de líquido en las dos cámaras de las bombas, donde mete el borde cada disco de rodete.
- **Las flechas**: la mezcla baja por el tubo, sale por el puerto del distribuidor y sube por la columna de agujeros; el
  liviano va hacia el eje por un canal, sube junto al distribuidor y sale por su paso y su tubo; el pesado va hacia
  afuera por un canal, sube entre el disco de arriba y la capota del tazón y sale por su paso y su tubo; el sólido sale
  por abajo del ciclón.
- **El detalle** (`node build.mjs --detalle`): el canal entre el sexto y el séptimo disco del lado izquierdo, en la zona
  neutra, nueve veces más grande. Hacia el eje (a la derecha) aceite con gotas de agua; hacia afuera, agua con gotas de
  aceite. El agua y el sólido van hacia afuera por la cara de abajo del disco de arriba, donde forman una película que
  resbala; el aceite va hacia el eje por la cara de arriba del disco de abajo (Perry, p. 18-121; Coulson y Richardson,
  p. 646). Las gotas van mucho más grandes que las reales.

**Ningún nombre de fabricante.** Las fuentes muestran máquinas comerciales; el dibujo sigue la disposición que
describen, no una máquina en particular.

## La pila

Una pila real de este tazón tiene unos 70 discos de 0,5 mm con canales de 0,6 mm: 120 mm de alto (`cuentas()` en
`geo.mjs`). Se dibujan 12 discos de 2 mm en la misma altura, con el canal unas siete veces más ancho (4,4 mm). La falda
del distribuidor hace de primer disco. El corte pasa por una columna de agujeros a la derecha (por ahí sube la mezcla) y
entre dos columnas a la izquierda (ahí se ve la zona neutra dentro de cada canal). Los separadores (caulks, tiras
radiales soldadas a cada disco que fijan el canal; Bylund, p. 97) no se dibujan: uno que cayera en el plano del corte
llenaría su canal de punta a punta, y los de atrás quedan tapados por el líquido, que va casi opaco. Se probó verlos a
través de un líquido más claro, en el detalle, y no se leían: corren a lo largo del canal, paralelos a los discos.

## Qué sale de dónde

Las páginas son las impresas (las fichas de `fuentes/` del libro dicen cómo pasar de la página del PDF a la impresa).

| Dato | Fuente |
|---|---|
| Vertical; la alimentación entra cerca del eje y la acelera un juego de álabes; de 50 a 150 discos cónicos separados 0,4 a 3 mm, a 40 a 55° de la horizontal; el sólido se asienta en la cara de abajo de cada disco y resbala hacia el borde mayor y la pared; el líquido clarificado sube; los agujeros alineados de los discos forman los conductos; un rodete fijo (bomba centrípeta) convierte la energía del líquido en presión y evita la espuma | Perry (2008), p. 18-121 |
| Las autodeslodantes: tubo de alimentación fijo y distribuidor; el tazón de doble cono junta el sólido junto al diámetro mayor y lo descarga a plena velocidad, por ciclos de tiempo; tazones de 7 a 24 in, de 12 000 a 4000 r/min (tabla 18-12); la máquina con el motor, el engranaje, la carcasa y la salida del sólido a un ciclón (fig. 18-153) | Perry (2008), pp. 18-121 y 18-122 |
| Las descremadoras sobre cojines elásticos; un resorte en el rodamiento cercano al rotor para pasar la velocidad crítica | Perry (2008), p. 18-118 |
| El agua y la suciedad van por la cara de abajo de los discos hacia afuera y el aceite por la de arriba hacia adentro; entrada por el distribuidor y los agujeros; el pesado sale por fuera y el liviano por el centro (fig. 11.8 y 11.9) | Coulson y Richardson (Chhabra y Shankar, 2019), pp. 645–647 |
| El ejemplo de r = 0,2 m a 5400 r/min | Bylund (1995), p. 96 |
| Los separadores (caulks), tiras radiales soldadas a los discos que fijan el ancho del canal; los agujeros de distribución alineados, a cierta distancia del borde de la pila | Bylund (1995), pp. 97–98 |
| El tazón de cuerpo y capota unidos por un anillo de cierre roscado; la pila apretada entre la capota y el distribuidor; en el semiabierto, el tubo de entrada fijo por arriba, el distribuidor con nervios, la cámara de la bomba centrípeta del liviano y, encima, la del pesado, que pasa entre el disco de arriba y la capota; el espacio de sedimento de 10 a 20 L; descargas cada 30 a 60 min en la leche | Bylund (1995), p. 99 |
| Los discos de rodete, fijos, meten el borde en la columna de líquido que gira | Bylund (1995), pp. 99–100 |
| El motor, el freno, el engranaje, el sistema del agua de maniobra y el ciclón de sedimento (fig. 6.2.26) | Bylund (1995), p. 100 |
| El fondo móvil apretado contra un anillo de sello de la capota por el agua de abajo, que se vacía para descargar en décimas de segundo; el bastidor recibe la energía del sólido, que sale por gravedad; el eje vertical con un rodamiento arriba y otro abajo, unido al motor por un engranaje de tornillo sin fin con eje horizontal y un acople | Bylund (1995), pp. 102–103 |
| Las dos mitades del tazón apretadas por fuerza hidráulica; el sólido se junta en el diámetro mayor y la mitad de abajo baja un poco para dejarlo salir | Berk (2013), pp. 253–254 |
| Tazones de 0,2 a 1,2 m, de 2000 a 7000 r/min, discos a 0,5 a 1,27 mm; las autodeslodantes, con 2 a 10 % de sólidos | Fellows (2000), pp. 144–145 |
| La zona neutra: r_i² = (r_A² − (ρ_B/ρ_A) r_B²)/(1 − ρ_B/ρ_A) | McCabe y otros (2007), pp. 42–43 |
| Las flechas del flujo | Esquemáticas |

Perry 8.ª: pp. 18-118, 18-121 y 18-122 (fig. 18-153 y 18-154); Coulson y Richardson 2A, 6.ª: cap. 11; *Dairy
Processing Handbook* (Bylund, 1995), cap. 6.2; Berk, 2.ª ed., cap. 9; Fellows, 2.ª ed., cap. 6; McCabe, 7.ª ed. en
español, cap. 2. Todas están en `referencias.bib` del libro (`perry2008`, `chhabra2019`, `bylund1995`, `berk2013`,
`fellows2000`, `mccabe2007`).

**Medida del libro** (típica de una máquina así, escogida para el dibujo; de `fuentes/` no se copió nada: se leyeron
las páginas y se tomaron los números):

- **el tamaño**: el cuerpo del tazón de 452 mm (496 mm con el anillo de cierre; la cámara del sólido llega a 196 mm del
  eje) a 5400 r/min, entre las de 13 y 24 in de la tabla del Perry; con el ejemplo de Bylund, unas 6500 veces la gravedad
  a 0,2 m y 128 m/s en el borde del cuerpo, la velocidad periférica de las de discos de la tabla del Perry (`cuentas()`).
  Es más grande que la purificadora del caso del capítulo (la de discos más pequeña del Perry, de 104 mm a 10 000 r/min):
  la figura muestra una máquina mediana, como la descremadora del ejemplo de la leche;
- **la pila**: los discos de 72 a 165 mm de radio a 50°, los agujeros de 24 mm a 120 mm del eje, la falda de 8 mm, el
  disco de arriba de 4 mm;
- **las salidas**: el rebose del liviano a 45 mm y el borde del disco de gravedad a 63 mm, que con el aceite de cítricos
  (842 kg/m³) y el agua (998 kg/m³) a 20 °C dejan la zona neutra a 120 mm, en los agujeros (ec. 2.17 de McCabe;
  `cuentas()`). Ninguna fuente archivada dice cómo se escoge el disco de gravedad;
- **el tazón**: la columna, el fondo móvil, el anillo de sello, la cámara del agua de maniobra, las lumbreras, la capota
  y los anillos de cierre: la disposición y las medidas;
- **lo fijo de arriba**: el tubo de 32 mm, las bombas centrípetas de 116 y 156 mm, los pasos, la caja y los tubos de
  40 mm;
- **el accionamiento**: el motor (de unos 5,5 kW, con su linterna y su placa), el engranaje (rueda de 244 mm, tornillo
  de 64 mm, distancia entre ejes de 150 mm, relación de unos 1:3 de un motor de 1750 r/min), el freno y los
  rodamientos;
- **el bastidor, la capota, los cojines, el ciclón, el ducto y la tubería del agua de maniobra**: la disposición y las
  medidas;
- **los líquidos, el sólido y las gotas**: dónde va cada uno (de las fuentes) y su tamaño en el dibujo (las gotas del
  detalle van mucho más grandes que las reales, de 2 a 18 µm en el caso del capítulo).

## Cómo está armado

Las piezas de revolución se dibujan con `sweepSvg` (el barrido de su sección alrededor del eje, de la prensa de
tornillo, con la normal de cada cara sacada del sentido de giro de la sección, porque hay secciones cóncavas): solo la
mitad de atrás, en sectores (180° a 250°, 250° a 310°, 310° a 330° y 330° a 360°, partidos donde la cara de afuera
empieza a mirar al lector), sin tapas. Las caras del corte van aparte, como polígonos en el plano y = 0; los líquidos,
el sólido y la mezcla son los huecos exactos entre ellas (`node build.mjs --check` dice si alguna cara se monta sobre
otra). Así cada sector se ordena solo contra lo que tiene adelante y atrás. Los líquidos del tazón van casi opacos, como
en un corte en 2D: la parte de atrás de la pila queda tapada y no se dibuja.

La piel de atrás del tazón (cuerpo, anillo de cierre y capota) es un solo barrido de su contorno, con las formas de las
tres piezas para el orden y el audit. El eje del tazón no se corta: la mitad de adelante va entera y la de atrás solo
entre el rodamiento de abajo y el cubo del tazón (dentro de ellos la tapa la de adelante; queda una franja de un píxel).
El eje horizontal va en tramos entre las cajas de sus rodamientos, el tambor del freno y el cubo de la rueda; la rueda es
un barrido de una pieza. La tubería del agua de maniobra pasa la pared por un pasamuros (sus dos mitades, por dentro y
por fuera de la pared); la válvula y el pasamuros son de la tubería, la brida y la boquilla, de afuera.

El dibujo va en milímetros y el audit en centímetros (`cm()`, como la prensa de tornillo). La rejilla del orden es de 0,5
unidades en la vista entera y de 2 en el detalle. El audit pasa sin excepciones.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`SD`) con su fuente y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe `figuras/separacion-centrifuga/_separadora.qmd` en el repositorio del libro (la vista, el detalle y los rótulos) y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

```sh
node build.mjs --audit                 # la vista entera, un minuto; «audit passed»
node build.mjs --detalle --audit       # el canal entre dos discos, unos segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node build.mjs --check                 # ninguna cara del corte se monta sobre otra
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/19/disc-separator.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/19/disc-separator.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Para depurar sin correr todo: `SD_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién
va delante y dónde. La posición del círculo se cambia con `SD_DX` y `SD_DY` al correr `libro.mjs`.

## En el libro

En el capítulo se incluye con `{{< include figuras/separacion-centrifuga/_separadora.qmd >}}` dentro de un bloque
`::: {#fig-…}`, como la prensa de tornillo. El CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los colores
propios de la figura van en un `<style>` dentro del SVG.

**La lámina impresa** (`--lamina`): la misma vista con el detalle, con pocos rótulos en inglés (Archivo de 7,5 pt),
428 pt de ancho y los colores resueltos. Después, `node herramientas/svg-a-pdf.mjs figuras/19/disc-separator.svg` desde
`en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `sd-ss` y `sd-pipe` (el
tazón, los discos, lo fijo de arriba, los tubos) son acero, y `sd-cut` y `sd-cut1`, su corte (el segundo, un paso más
claro, para las piezas que van dentro de otras); `sd-cast` (el bastidor, las cajas de los rodamientos, la linterna, el tambor del freno, la válvula) es
fundición, y `sd-cut-c`, su corte; `sd-paint` (el motor, la caja de bornes, el solenoide, las patas del ciclón),
pintado; `sd-bronze` (la rueda), cobre; `sd-rubber` (los cojines, la zapata del freno), caucho, y `sd-cut-r` (el anillo
de sello), su corte; el liviano (`sd-oil`) en los tonos del aceite y el pesado y el agua de maniobra (`sd-water`,
`sd-opw`) en los del agua, al 85 %; la mezcla (`sd-mix`) en la cara del aceite, con pintas del agua oscura; el sólido en los tonos del
sólido; las flechas: la mezcla en la tinta 2, el liviano en el aceite oscuro, el pesado en el azul y el sólido en el
sólido oscuro. Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el
dibujo.
