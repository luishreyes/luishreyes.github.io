# Tanque agitado en isométrico (skill `anatomy`)

Figura del capítulo 14 del libro de operaciones unitarias (Agitación), que el 15 usa también: el reactor de extracción
de pectina de la cáscara de cítricos, un tanque agitado vidriado con chaqueta (el ácido clorhídrico caliente pica el
inoxidable). Todo va a escala real, en milímetros (`geo.mjs`):

- **el tanque**: T = 2500 mm de diámetro interior, pared de 14 mm (12 de acero al carbono y 2 de vidrio), fondo y tapa elípticos 2:1 (profundidad T/4) y
  H = 3000 mm de líquido sobre el fondo (H/T = 1,2). Por dentro, las costuras de soldadura de la envolvente;
- **la camisa** (chaqueta) en la parte cilíndrica, desde la línea de tangencia del fondo, con anillo de 60 mm y pared de 8 mm, sus anillos de cierre y dos boquillas
  DN 80 en la franja de la derecha: la entrada del vapor arriba y la salida del condensado abajo;
- **dos bafles de aleta** vidriados, colgados de boquillas DN 150 de la tapa a 0° y 180°, en el plano del corte y cortados
  a lo largo: un tubo DN 100 cerrado con la punta redonda y, en su parte de abajo (de 1460 a 3400 mm), una aleta de
  140 × 20 mm hacia la pared, con el borde de abajo inclinado y las esquinas redondeadas; con el tubo llega a unos T/10.
  En el vidriado los bafles no van en la pared (Hemrajani y Tatterson, pp. 350 y 355), la aleta es la más común y con
  sólidos se piden al menos dos (Atiemo-Obeng y otros, p. 579). Cada boquilla lleva su brida y la tapa ciega de la que
  cuelga el tubo;
- **dos turbinas vidriadas y desmontables de cuatro palas inclinadas a 45°**: D = 830 mm (D/T = 0,332), palas de
  W = D/5 y 16 mm de bordes redondos con el borde de ataque arriba (bombean hacia abajo), en un cubo redondo; la de
  abajo a C = 625 mm del fondo (C/T = 0,25, en la línea de tangencia), con la punta redonda del eje debajo, y la de
  arriba 830 mm bajo la superficie, girada 45° respecto de la otra;
- **el eje** de 80 mm, desde el acople hasta el cubo;
- **arriba**: la boquilla del agitador DN 300 con su brida, la brida de montaje con sus tuercas, el sello mecánico de
  cartucho (cuerpo, prensa con sus tuercas, manguito con prisioneros y dos tomas del líquido de barrera), la
  linterna de cuatro columnas, el acople rígido de bridas, el reductor de ejes en ángulo (placa de datos,
  respiradero, tapón de nivel, costura de la tapa) y el motor horizontal con aletas, caja de bornes sobre su asiento,
  prensaestopas y la rejilla del ventilador;
- **en la tapa**: la boquilla de alimentación DN 250 con su carrete y el ramal DN 50 del agua, el termopozo (cuello,
  bridas, cabezal y la vaina que baja 900 mm bajo el nivel, a 258° para que no quede detrás de un bafle) y la boca de hombre DN 500 con su tapa empernada y la
  manija;
- **abajo**: cuatro patas sobre asientos soldados al fondo, con sus placas y pernos de anclaje, y la salida de fondo
  DN 100 con la válvula de bola (cerrada, la palanca atravesada al tubo), el codo y el tubo de descarga;
- **la suspensión**: la superficie plana del líquido (lámina translúcida en la mitad de atrás), el tinte del agua en
  todo lo que queda bajo el nivel, unos trozos de cáscara y las flechas del patrón de flujo en un plano justo detrás
  del corte: dos lazos, uno por turbina, como dan dos turbinas inclinadas en un tanque alto (Hemrajani y Tatterson,
  p. 367). Por dentro, sobre el nivel, la tapa, la envolvente y el eje llevan el tono del vidrio (`ta-glass`).
- **la persona de referencia** (`../persona.mjs`): un maniquí de 1,75 m de pie en el piso, a la derecha del tanque y
  un poco hacia el lector, fuera de las patas y bajo la salida de condensado, mirando hacia el tanque, con una sombra
  corta (`TQ.persona` en `geo.mjs`, medida del libro). Su rótulo en el libro es «Persona de 1,75 m», y en la edición en
  inglés lo traduce el diccionario de `en/herramientas/figuras-14.mjs`.

El corte quita lo que mira al lector por encima de la línea de tangencia del fondo (y > 0, z > zt): el fondo queda
entero y el resto se ve por el plano y = 0. La envolvente, la tapa, la chaqueta y la boquilla del agitador se ven
cortadas; los dos bafles y sus boquillas, en el plano del corte, van cortados a lo largo (media caña y media placa). El
eje, las turbinas, el accionamiento y las boquillas de la mitad de atrás van enteros. Lo que se ve por la
abertura del corte (el interior de la envolvente y de la tapa) va recortado a ella y se registra recortado al prisma
que la abertura proyecta a lo largo de la mirada, así el audit mide lo mismo que se dibuja. Las piezas que atraviesan
el nivel (el eje, los tubos de los bafles, la vaina) van partidas en él: la parte de abajo antes de la lámina del
líquido y la de arriba después.

**El audit en centímetros.** El dibujo va en milímetros, pero el audit muestrea las superficies cada 0,6 unidades y
un tanque de 2,5 m en milímetros no cabe en memoria. `cm()` pasa cada forma registrada a centímetros (con sus cortes) y
el audit recibe la misma cámara con la escala por 10 (`PA`), así cada forma cae en el mismo lugar de la pantalla.

**Peso.** El SVG va en línea en la página del libro: los trazos se reescriben con coordenadas relativas en décimas
(`compact`), las caras del mismo tono van juntas y los colores van en clases (`ta-*`, en un `<style>` dentro del SVG).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/tanque_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`TQ`), las cabezas elípticas por dentro y por fuera y dos secciones de uso común. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `libro.mjs` | Escribe `figuras/agitacion/_tanque-agitado.qmd` en el repositorio del libro, con el SVG y los rótulos, y `out/libro-preview.html` para revisarla. |

```sh
node build.mjs --audit                                           # unos 5 minutos (4 del orden); debe terminar en «audit passed»
node build.mjs --fast                                            # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                                                   # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
```

Para depurar el orden sin correr todo: `TA_ITEM="pieza" node build.mjs` lista todo lo que se cruza con una pieza en
pantalla y quién va delante. `TA_STEP=0.5` hace la rejilla del orden más gruesa (más rápido, menos fino).

En el capítulo se incluye con `{{< include figuras/agitacion/_tanque-agitado.qmd >}}` dentro de un bloque
`::: {#fig-tanque-agitado}`; el CSS de las piezas es el de siempre (`estilo/anatomia.css`).

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro (`estilo/paleta.json`, sección `isometricas`, en el repositorio del libro), la misma de todas sus figuras isométricas: `libro.mjs` la pasa por `../paleta-libro.mjs`, que le da a cada clase el tono de su material. `ta-ss` y `ta-trim` son acero; `ta-glass`, vidrio; `ta-drive`, pintado; `ta-cast` y `ta-lever`, fundición; `ta-sub` y el agua (`ta-liq`), agua; la cáscara (`ta-peel`), cáscara; `ta-cut`, el corte del acero; `ta-bore`, hueco; las flechas del flujo, el azul de la base, y `ps-persona`, el material «persona». Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar las vistas del libro sin rehacer el dibujo.
