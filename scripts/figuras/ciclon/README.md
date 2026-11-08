# El ciclón de alta eficiencia de Stairmand en isométrico (skill `anatomy`)

Figura del capítulo 20 del libro de operaciones unitarias (Particles and drops in gases), para la sección «El ciclón por
dentro»: un ciclón de flujo invertido de alta eficiencia de Stairmand, uno de los cuatro que recogen el polvo del aire
del secador por aspersión de la planta de café instantáneo, de D = 1,2 m. Se corta por el plano del eje (y = 0) y se
quita la mitad que mira al lector del cilindro, el cono, el techo, el tubo de salida con su codo y su ducto, la boca del
polvo, la tolva, la válvula rotativa y su rotor. Todo va a escala real, en milímetros (`geo.mjs`), salvo las partículas
y la holgura de las paletas (ver «Lo que va exagerado»); un círculo amplía la válvula rotativa 2,7 veces.

- **El ciclón**, de acero inoxidable de 6 mm, con las proporciones del Stairmand de alta eficiencia: el cilindro de
  1,5 D (1,8 m), el cono de 2,5 D (3,0 m), 4 D en total, y la salida del polvo de 0,375 D (450 mm). Una costura
  circunferencial y una a lo largo en el cilindro y en el cono; dos orejas de izar sobre el techo.
- **La entrada tangencial**: un ducto rectangular de 0,5 D de alto por 0,2 D de ancho (600 × 240 mm) que llega de la
  derecha, con su pared de afuera tangente al cilindro (en θ = 270°) y el techo a ras con el del ciclón; la boca en la
  pared de atrás va de θ = 270° a 323°, donde la otra pared del ducto llega al cilindro. Por la boca se ve el adentro del
  ducto, más oscuro. Brida de marco con sus pernos y una placa de datos sin texto.
- **El tubo de salida (buscador de vórtice)**: de 0,5 D (600 mm), baja 0,5 D desde el techo, hasta el borde de abajo de
  la entrada; sale por el techo a un par de bridas (se desmonta), sube a un codo de cuatro gajos y sigue horizontal hacia
  el filtro de mangas, con su brida.
- **La boca del polvo y la tolva**: la boca del cono con su brida, sobre la boquilla de la tolva colectora, de diámetro D
  (la de Towler), con techo plano, cilindro de 600 mm y cono a 60° hasta una boca de 300 mm; el interruptor de nivel alto
  (boquilla, cuerpo, cabeza, prensaestopas y sonda) a un diámetro de la salida (450 mm) por debajo de ella.
- **La válvula rotativa**: la carcasa de fundición (las dos piezas a los lados del rotor, cortadas, y la tapa de atrás),
  el rotor de ocho paletas, la caja del rodamiento, la linterna, el reductor con su brida y el motor con aletas,
  ventilador y caja de bornes; abajo, el bajante con su brida, hacia el aglomerador.
- **Los apoyos**: dos patas atrás (a 210° y 330°), de tubo cuadrado de 150 mm, sobre pedestales de concreto, con placa
  base, tapa y la oreja del ciclón (placa con dos pernos, dos cartelas y respaldo curvo); dos puntales entre ellas. Las
  dos de adelante se van con el corte.
- **El gas**: la flecha de la entrada; el vórtice exterior en cinco vueltas, dibujado en la mitad de atrás de cada una,
  pegado a la pared y bajando; la vuelta de abajo, que se mete hacia el eje 2 D por debajo del tubo de salida; el vórtice
  interior, una hélice que sube por el centro hasta el tubo (partida donde pasa de adelante a atrás del eje), y la
  salida por el codo y el ducto.
- **El polvo**: unas partículas gruesas que entran con el aire y van a la pared; la hebra de gruesas que baja en espiral
  por la pared de atrás, cada vez más gruesa, hasta la boca del cono, con una flecha en el cono; las finas, en el
  vórtice interior y en el ducto de salida; el polvo que cae a la tolva, el montón (en el corte y su cara de arriba),
  la columna que baja por la boca de la tolva a la válvula, las celdas del rotor que bajan llenas (una se está llenando
  arriba) y el polvo que sale por abajo, con su flecha.
- **El detalle** (`node build.mjs --detalle`): la válvula rotativa en el plano del corte, 2,7 veces más grande: el
  polvo de la tolva en la garganta, el rotor con la flecha de su giro, las celdas que bajan llenas a la derecha y las que
  suben vacías a la izquierda (se ve la tapa de atrás), las paletas casi contra la carcasa y el polvo que sale.
- **La persona de referencia** (`../persona.mjs`): un maniquí de 1,75 m de pie en el piso de los pedestales (z = 0),
  adelante y a la izquierda de la válvula rotativa, de espaldas al lector y mirando hacia ella, con una sombra corta
  (`CI.persona` en `geo.mjs`, medida del libro). El dibujo no tiene piso: la persona apoya donde apoyan los pedestales.
  Se ve pequeña junto al ciclón, que es lo que muestra. El detalle no la lleva.

**Ningún nombre de fabricante.**

## Qué sale de dónde

Las páginas son las impresas (las fichas de `fuentes/` del libro dicen cómo pasar de la página del PDF a la impresa).

| Dato | Fuente |
|---|---|
| Las proporciones del Stairmand de alta eficiencia: entrada de 0,5 D × 0,2 D, tubo de salida de 0,5 D que entra 0,5 D, cilindro de 1,5 D, cono de 2,5 D, salida del polvo de 0,375 D y tolva colectora de diámetro D | Towler y Sinnott (2022), fig. 18.32a, p. 768; Rhodes y Seville (2024), fig. 8.5, p. 274 |
| El gas entra tangencial, baja en espiral hasta el cono y sube en una espiral más chica por el tubo del centro; los sólidos van a la pared y resbalan hacia abajo | Towler y Sinnott (2022), p. 767; Rhodes y Seville (2024), pp. 267–268 |
| El doble vórtice; el interior gira mucho más rápido que el exterior y su radio es de 0,4 a 0,8 del tubo de salida (aquí, 0,6); su extremo se mueve, y si toca el cono levanta el polvo que baja por él y lo desgasta | Perry (2008), pp. 17-29 y 17-30 |
| El vórtice se alarga 2,0 D por debajo del tubo de salida cuando el área de salida es mayor que la de entrada (aquí, 1,96 veces); se mide sobre un cilindro 10 cm más ancho que el tubo de salida, y el cono no debe tocarlo (a esa altura, el cono tiene 450 mm de radio y el cilindro, 350) | Perry (2008), tabla 17-4, p. 17-33 |
| El gas da unas 5 vueltas (de 0,3 a 10) | Darby (2017), p. 373 |
| La abrasión es mayor en el cilindro justo después de la entrada y en el cono cerca de la descarga; el polvo acumulado debe quedar al menos un diámetro por debajo de la salida (de ahí la altura del interruptor de nivel) | Rhodes y Seville (2024), p. 277; Perry (2008), p. 17-31 |
| El aire que entra por la descarga del polvo es la mayor causa de que un ciclón no separe; la válvula rotativa es una de las descargas que lo evitan | Perry (2008), p. 17-34 |
| La entrada, entre 15 y 20 m/s; con la entrada de 0,144 m² del dibujo, 15 m/s son 2,16 m³/s por ciclón (`cuentas()`) | Perry (2008), p. 17-33; Towler y Sinnott (2022), p. 770 |
| Las flechas del flujo | Esquemáticas |

Perry 8.ª: pp. 17-29 a 17-34; Towler y Sinnott, 3.ª ed., sec. 18.5.3; Rhodes y Seville, 3.ª ed., cap. 8; Darby, 3.ª
ed., cap. 13. Todas están en `referencias.bib` del libro (`perry2008`, `towler2022`, `rhodes2024`, `darby2017`).

**Medida del libro** (típica de un ciclón así, escogida para el dibujo; de `fuentes/` no se copió nada: se leyeron las
páginas y se tomaron los números):

- **la chapa**: 6 mm en la envolvente, la tolva y los ductos; el techo de 8 mm;
- **la salida del gas**: las bridas del tubo de salida, a 180 mm sobre el techo, el codo de radio D/2 en cuatro gajos y
  el ducto horizontal de 1,4 m;
- **la entrada**: el ducto de 1,5 m con su brida de marco de 60 mm de ala;
- **la tolva**: el cilindro de 600 mm, el cono a 60° y la boca de 300 mm; las bridas de la boca del polvo;
- **la válvula rotativa**: el rotor de 376 mm con ocho paletas de 12 mm y el cubo de 140 mm, la carcasa de 470 mm con
  bridas de 500 mm, el largo de 340 mm, la tapa, el rodamiento, la linterna, el reductor y el motor;
- **los apoyos**: las patas a 1 m del eje, las orejas, los puntales y los pedestales;
- **el polvo**: la altura del montón, la hebra (unos 700 mm por vuelta, más empinada que el gas, de 540) y cuántas
  partículas se dibujan.

## Lo que va exagerado

- **Las partículas**: las gruesas van de 34 a 52 mm de diámetro y las finas de 20 a 28 mm, unas mil veces más grandes
  que las de verdad (de 1 a 100 µm); en el detalle no crecen con el dibujo.
- **La holgura de las paletas**: 7 mm entre la punta de las paletas y la carcasa; en una válvula de verdad es de décimas
  de milímetro.

## Cómo está armado

Las piezas de revolución se dibujan con `sweepSvg` (el barrido de su sección alrededor del eje, de la separadora de
discos): solo la mitad de atrás, en sectores (180° a 255°, 255° a 330° y 330° a 360°, partidos donde la cara de afuera
empieza a mirar al lector), sin tapas; las caras del corte van aparte, como polígonos en el plano y = 0
(`node build.mjs --check` dice si alguna se monta sobre otra). La banda de arriba del cilindro no tiene el sector de la
boca de la entrada. El codo se sombrea por su sección (`shadePhi`): cada gajo toma el tono de la normal a la mitad de
su ángulo, y así las bandas de tono siguen la curva sin escalones. El ducto de entrada, el techo, la válvula y las
patas son cajas y prismas. Las flechas del gas son tubos delgados para el orden; la hélice del vórtice interior va en
medias vueltas, para que lo de adelante y lo de atrás del eje se ordenen aparte. Cada grupo de partículas lleva una
esfera por partícula.

El dibujo va en milímetros y el audit en centímetros (`cm()`). La rejilla del orden es de 0,5 unidades en la vista
entera y de 2 en el detalle. El audit pasa sin excepciones.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`CI`) con su fuente, las que salen de D (`G0`), el radio de la pared a cada altura (`rWall`) y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre del círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe `figuras/particulas-y-gotas-en-gases/_ciclon.qmd` en el repositorio del libro (la vista, el detalle y los rótulos) y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

```sh
node build.mjs --audit                 # la vista entera, unos 25 segundos (13 del orden); «audit passed»
node build.mjs --detalle --audit       # la válvula ampliada, unos 7 segundos; también «audit passed»
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node build.mjs --check                 # ninguna cara del corte se monta sobre otra
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/20/cyclone.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/20/cyclone.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las dos primeras pueden correr a la vez. Para depurar sin correr todo: `CI_ITEM="pieza" node build.mjs` lista lo que se
cruza con una pieza en pantalla, quién va delante y dónde. La posición del círculo se cambia con `CI_DX` y `CI_DY` al
correr `libro.mjs`.

## En el libro

En el capítulo se incluye con `{{< include figuras/particulas-y-gotas-en-gases/_ciclon.qmd >}}` dentro de un bloque
`::: {#fig-…}`, como la separadora. El CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los colores propios
de la figura van en un `<style>` dentro del SVG. Con la letra de 22 unidades, los rótulos quedan en 9,6 px en la columna
de 620 px.

**La lámina impresa** (`--lamina`): la misma vista con el detalle, con pocos rótulos en inglés (Archivo de 7,5 pt),
428 pt de ancho y los colores resueltos; la caja se ensancha a 1390 unidades (`anchoMin`) para que no pase de 452 pt de
alto. Después, `node herramientas/svg-a-pdf.mjs figuras/20/cyclone.svg` desde `en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `ci-ss` y `ci-plate` (el
ciclón, la tolva, los ductos, el rotor) son acero, y `ci-cut`, su corte; `ci-in` (el adentro del ducto de entrada, que
se ve por la boca) es el fondo seco del acero; `ci-cast` (la carcasa de la válvula, la tapa, el rodamiento, la
linterna) es fundición, y `ci-cut-c`, su corte; `ci-paint` (el motorreductor, las patas, los puntales, el interruptor de
nivel), pintado; `ci-conc` (los pedestales), concreto; `ps-persona`, el material «persona»; el polvo en los tonos del sólido (`ci-polvo`, `ci-polvo-c`), con
las gruesas en el sólido oscuro y las finas en su sombra más honda; el gas en el azul y el polvo que baja en el sólido
oscuro; el giro del rotor en la tinta 2. Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a
pintar la vista sin rehacer el dibujo.
