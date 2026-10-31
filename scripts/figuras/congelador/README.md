# El congelador de lecho fluidizado de dos etapas (IQF) en isométrico (skill `anatomy`)

Figura del capítulo 16 del libro de operaciones unitarias (Partículas en un fluido), para la subsección «Congelar en
un lecho fluidizado» de «Las partículas en una planta de alimentos», antes del ejemplo de las arvejas. Es un equipo de
unos 4000 kg/h de arvejas, sin el techo ni la pared que mira al lector. Todo va a escala real, en milímetros
(`geo.mjs`); las arvejas, que en la vista entera no pasan de un punto, se ven una por una en dos círculos que amplían
diez veces cada etapa.

- **El recinto**: paneles de poliuretano de 150 mm con piel de acero (piso, pared de atrás y paredes de los extremos),
  sobre tres canales de acero con patas niveladoras. Se ven cortados en el plano y = 0 y en la corona de las paredes:
  el poliuretano (amarillo) entre las dos pieles. En la pared de atrás, las juntas de los paneles cada 1200 mm.
- **El alimentador vibratorio**, afuera a la izquierda: una bandeja en U de 1140 mm de ancho con 24 mm de arvejas
  escaldadas, sobre cuatro ballestas inclinadas y dos travesaños, con un motovibrador a cada lado (el de atrás no se
  ve). Las ballestas se apoyan en dos vigas que van de dos patas afuera a dos ménsulas en la pared. La bandeja entra
  por una ranura de la pared izquierda y deja caer las arvejas en la banda 1.
- **La primera etapa**: banda perforada de 1140 mm entre tambores de Ø 220 a 1,62 m entre ejes, sobre una rejilla de
  barras de 20 × 28 mm cada 200 mm que salen del tabique (sin riel adelante, para que se vea el eje de levas). El lecho, de unos 4,5 cm quieto, va expandido a 7 cm y borbotea:
  la cara del corte tiene burbujas y sobre la superficie saltan arvejas hasta 7,5 cm. Bajo la banda, un **eje de
  levas** la sacude (tres levas de Ø 104, excéntricas 14 mm, con su chumacera en el tabique). Al final, un
  **vertedero** de 80 mm fija la altura del lecho; lo que lo pasa sigue sobre la banda y cae del tambor de la cabeza a
  la banda 2.
- **La segunda etapa**: otra banda igual, más baja (350 mm) y más larga (2,55 m entre ejes), con la capa quieta de
  10 cm del ejemplo, que empieza en rampa donde caen las arvejas; su rejilla sí lleva un riel adelante. Del tambor de la cabeza caen a un **canal** en U que
  sale por una ranura de la pared derecha.
- **El aire**: cuatro **ventiladores axiales** de Ø 800 en una cubierta bajo las bandas (dos por etapa), con campana de
  entrada, envolvente, brida empernada sobre la cubierta, rodete de seis álabes y el motor colgado de dos platinas, con
  su caja de conexiones. Un tabique entre los plenos separa el de la primera etapa del de la segunda, y uno largo, a lo
  ancho, separa el lecho del retorno. Las flechas: el aire sube a las campanas desde el retorno, por debajo de la
  cubierta; sube por las bandas y por los lechos; arriba pasa el tabique y baja al evaporador.
- **El evaporador**: un serpentín horizontal de 3,7 m × 0,74 m × 0,40 m, con el aire que baja por sus aletas (una cada
  12 mm, de canto en la vista) y la **escarcha** en su borde de arriba, por donde entra el aire húmedo. A la derecha,
  la tapa de las curvas de retorno, de la que salen la línea de líquido y la de succión (aislada) hacia la pared de
  atrás. Encima, el **rociador del deshielo**, de pared a pared, con nueve boquillas. En el piso, bajo la cubierta, el
  **sumidero** por donde sale el agua del deshielo.
- **Los detalles** (`node build.mjs --detalle=1` y `--detalle=2`): la cara del corte de cada lecho, diez veces más
  grande, con las arvejas de 6 mm una por una. En la primera, separadas (el lecho expandido), con burbujas que cortan
  la cara y arvejas en el aire; en la segunda, apretadas y quietas. Debajo, la banda en corte con sus agujeros, las
  barras de la rejilla y el aire que sube.

**Ningún nombre de fabricante.** Berk y Singh y Heldman muestran equipos comerciales; el dibujo sigue la disposición
que describen las fuentes, no una máquina en particular.

## Qué sale de dónde

| Dato | Fuente |
|---|---|
| Aire entre −25 y −35 °C, a 2 a 6 m/s, por una capa de 2 a 13 cm sobre una bandeja perforada o una banda; dos etapas, la primera una capa delgada que forma una capa de hielo en la superficie y la segunda una banda con capas de 10 a 15 cm; hasta 10 000 kg/h; para piezas pequeñas (arvejas, maíz, camarones, fresas, papas a la francesa) | Fellows (2000), p. 427 |
| El hielo se acumula en el serpentín y obliga a deshelarlo a menudo; el lecho fluidizado lo pide menos | Fellows (2000), pp. 426–427 |
| Congeladores de aire forzado: aire a −30 a −40 °C y 1,5 a 6 m/s; bandas que pasan el producto de una a otra (25 a 50 mm en la primera, 100 a 125 mm en la segunda) | Fellows (2000), p. 426 |
| Tiempo de congelación de arvejas sueltas en lecho fluidizado: 3 a 4 min (tabla 21.3) | Fellows (2000), p. 426 |
| Dos secciones: la primera fluidiza y forma la costra (evita que se peguen y reduce la pérdida de agua); la segunda termina de congelar sobre una banda, sin fluidizar. Las piezas de la fig. 20.9: entrada del producto, banda 1, vertedero, banda 2 y agitación de la banda (opcional). Chorros de aire pulsado (fig. 20.8) | Berk (2013), pp. 472–474 |
| El aire sube vertical por la banda de malla y levanta el producto | Singh y Heldman (2009), p. 508 |
| Ventiladores abajo y el serpentín al lado del lecho, en un recinto aislado (fig. 7.7) | Singh y Heldman (2009), p. 509 |
| El Perry (8.ª ed.) solo nombra el IQF entre los métodos de congelación, sin describir el equipo | Perry (2008), p. 12-104 |
| Arveja de 6 mm, unos 1120 kg/m³, porosidad de 0,40; aire a −30 °C en Bogotá, U_mf = 1,45 m/s y U_T = 14,5 m/s; la capa de 10 cm pesa 658 Pa sobre la banda | El ejemplo de las arvejas del capítulo (ejemplo 16.6) |

**Medida del libro** (típica de un equipo así, escogida para el dibujo; de `fuentes/` no se copió nada: se leyeron las
páginas y se tomaron los números):

- **el caudal**: 4000 kg/h, dentro de lo que da Fellows para estos equipos;
- **las bandas**: 1140 mm de ancho; la de la primera etapa de 1,62 m entre ejes, con 1,42 m de lecho (1,62 m²); la de
  la segunda de 2,55 m, con 2,45 m de capa (2,79 m²), 350 mm más abajo. Tambores de Ø 220, banda de 10 mm;
- **la primera etapa**: lecho de unos 45 mm quieto y 70 mm expandido, vertedero de 80 mm. Con el aire a **3,5 m/s**,
  2,4 veces la mínima fluidización del ejemplo, el lecho retiene unos 49 kg: unos 45 s por arveja;
- **la segunda etapa**: la capa de 10 cm del ejemplo, con el aire a **1,2 m/s**, 0,83 veces la mínima fluidización,
  para que no se levante. Retiene 188 kg: 2,8 min con 4000 kg/h. Con la primera etapa da unos 3,3 min, dentro de los 3
  a 4 min de la tabla 21.3 de Fellows (`cuentas()` en `geo.mjs`);
- **el aire**: 5,7 m³/s por la primera etapa y 3,4 por la segunda, unos 32 000 m³/h en cuatro ventiladores axiales de
  Ø 800 mm;
- **el recinto**: 5,0 × 1,95 m por dentro, 2,70 m del piso de adentro a la corona de las paredes, paneles de 150 mm
  (lo usual para −30 °C);
  la cubierta a 0,60 m del piso, el tabique a 1,20 m de la cara del corte;
- **el evaporador**: 3,7 × 0,74 × 0,40 m, aletas cada 12 mm (la separación ancha de los serpentines que hacen
  escarcha), con la tapa de las curvas de 200 mm a la derecha;
- **el alimentador**: bandeja de 1,72 m con paredes de 120 mm, ballestas de 150 mm a unos 20°;
- **el eje de levas**: la agitación de la banda que Berk da como opcional, dibujada como un eje con tres levas bajo el
  tramo de arriba (las fuentes no dicen cómo se sacude la banda).

## Cómo está armado

Casi todo son cajas y prismas a lo largo de y (de su cara de atrás hasta el plano del corte, y = 0), con la tapa del
corte pintada plana (`yCut`). Lo que se envuelve se parte para que el orden de pintura no tenga ciclos:

- **la bandeja del alimentador y el canal** van en tres piezas (fondo, lado de atrás y lado de adelante), con las
  arvejas entre ellas; la bandeja se parte además en la cara de adentro de la pared izquierda (lo de afuera queda
  detrás de la pared, lo de adentro delante del tabique);
- **la envolvente de cada ventilador** va en dos mitades, con el rodete entre ellas; el rodete se recorta a la boca de
  la brida y la cubierta se dibuja con los cuatro huecos (`fill-rule: evenodd`);
- **el tambor y su vuelta** van en un solo elemento, en el orden en que se tapan (el cuarto de abajo de la vuelta, el
  tambor, el cuarto de arriba); el tramo de arriba de la banda va en el elemento del tambor de la cabeza, sin su cara
  del extremo; las caras del corte del tambor, de su eje y de la vuelta van juntas en otro elemento, delante;
- **el eje de levas** va en tramos entre las levas.

**Las arvejas.** En la vista entera son una textura a su tamaño real: mosaicos de 60 mm con arvejas de 6 mm puestas al
azar sin tocarse (`peaTile`: uno denso para la capa quieta y uno suelto para el lecho fluidizado), cada uno en el plano
de su cara (`patternTransform`), más las cortinas que caen y las que saltan como puntos (trazos de largo cero con
punta redonda). En los detalles van una por una: esferas de 6 mm puestas al azar en la capa de adelante y en la
superficie, sin tocarse, y dibujadas de atrás hacia adelante (`<use>` de una arveja en `defs`); las de la superficie
van más claras, porque les llega la luz de arriba.

**El orden y el audit.** El dibujo va en milímetros y el audit en centímetros (`cm()`, como el filtro de arena). La
rejilla del orden es de 0,25 unidades en la vista entera y de 2 en los detalles (la misma medida en milímetros). El
audit pasa sin excepciones salvo una, revisada en la vista: la placa de atrás del serpentín es delgada pero el audit la
toma como una varilla de 400 mm (su alto), y el arranque de la línea de succión, sobre la tapa de las curvas, cae en
esa varilla en pantalla aunque está a 60 cm (`crowd` en `auditOrExit`).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`; con `--detalle=1` o `--detalle=2`, `out/detalleN.svg`, `out/detalleN_data.json` y `out/preview-detalleN.html`. |
| `geo.mjs` | Las medidas (`CG`) con su fuente, el aire y la arveja del ejemplo y las cuentas del dibujo (`cuentas()`). |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `rotulos.mjs` | Los rótulos en español (`ROTULOS` y `PIES`, el nombre de cada círculo), los de la lámina en inglés (`ROTULOS_EN`, `PIES_EN`) y lo que lee un lector de pantalla en cada idioma. |
| `libro.mjs` | Escribe `figuras/particulas-en-un-fluido/_congelador.qmd` en el repositorio del libro (la vista, los dos detalles y los rótulos) y `out/libro-preview.html` y `out/libro-preview-620.html` (a 620 px, el ancho de la columna); con `--lamina`, la lámina de la edición en inglés; con `--anclas`, `out/anclas.html`, que muestra dónde cae cada ancla. |

```sh
node build.mjs --audit                 # la vista entera, unos 45 s (20 del orden); «audit passed»
node build.mjs --detalle=1 --audit     # la primera etapa ampliada, unos 30 s; también «audit passed»
node build.mjs --detalle=2 --audit     # la segunda
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/16/freezer.svg (por defecto)
(cd ../../../../libro-operaciones-unitarias/en && node herramientas/svg-a-pdf.mjs figuras/16/freezer.svg)
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

Las tres pueden correr a la vez (cada una escribe sus propios archivos). Para depurar sin correr todo:
`CG_ITEM="pieza" node build.mjs` lista lo que se cruza con una pieza en pantalla, quién va delante y dónde.

## En el libro

En el capítulo se incluye con `{{< include figuras/particulas-en-un-fluido/_congelador.qmd >}}` dentro de un bloque
`::: {#fig-…}`, como el filtro de arena. El CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los colores
propios de la figura van en un `<style>` dentro del SVG. Con la letra de 22 unidades, los rótulos quedan en 9,1 px en
la columna de 620 px.

**La lámina impresa** (`--lamina`): la misma vista con los dos detalles, con pocos rótulos en inglés (Archivo de
7,5 pt), 428 pt de ancho y los colores resueltos. Después, `node herramientas/svg-a-pdf.mjs figuras/16/freezer.svg`
desde `en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `cg-ss`, `cg-tube`
(acero inoxidable) y `cg-panel`, `cg-motor` (pintado); `cg-cast` y `cg-spring` (los rodetes, las levas y las
ballestas), fundición; `cg-ins` (la línea de succión aislada), caucho; el corte de las piezas, el del acero, y el de los
paneles (`cg-foam`), el del amarillo, que se lee como el poliuretano; las arvejas, en los tonos del sólido (como en el
diagrama del ejemplo); la escarcha, en el del vidrio; las bocas y las ranuras, hueco; y las flechas, el azul de la base.
Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar la vista sin rehacer el dibujo.
