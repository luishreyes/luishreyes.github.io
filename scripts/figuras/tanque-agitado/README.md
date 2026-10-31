# Tanque agitado en isométrico (skill `anatomy`)

Figura del capítulo 14 del libro de operaciones unitarias (Agitación): el reactor de extracción de pectina de la
cáscara de cítricos, un tanque agitado de acero inoxidable con chaqueta. Todo va a escala real, en milímetros
(`geo.mjs`):

- **el tanque**: T = 2500 mm de diámetro interior, pared de 10 mm, fondo y tapa elípticos 2:1 (profundidad T/4) y
  H = 3000 mm de líquido sobre el fondo (H/T = 1,2). Por dentro, las costuras de soldadura de la envolvente;
- **la camisa** (chaqueta) en la parte cilíndrica, con anillo de 60 mm y pared de 8 mm, sus anillos de cierre y dos boquillas
  DN 80 en la franja de la derecha: la entrada del vapor arriba y la salida del condensado abajo;
- **cuatro bafles** (deflectores) de T/10 = 250 mm (los números de potencia del capítulo, de la tabla 9.2 de McCabe, se
  midieron con deflectores del 10 % del diámetro), a 90° entre sí, con 30 mm de holgura a la pared y tres
  ménsulas cada uno;
- **la turbina de cuatro palas inclinadas a 45°**: D = 830 mm (D/T = 0,332), palas de W = D/5 con el borde de
  ataque arriba (bombea hacia abajo), soldadas a las caras de un cubo cuadrado, con su collar, la arandela y el
  tornillo del extremo del eje, a C = 625 mm del fondo (C/T = 0,25, en la línea de tangencia);
- **el eje** de 80 mm, desde el acople hasta el cubo;
- **arriba**: la boquilla del agitador DN 300 con su brida, la brida de montaje con sus tuercas, el sello mecánico de
  cartucho (cuerpo, prensa con sus tuercas, manguito con prisioneros y dos tomas del líquido de barrera), la
  linterna de cuatro columnas, el acople rígido de bridas, el reductor de ejes en ángulo (placa de datos,
  respiradero, tapón de nivel, costura de la tapa) y el motor horizontal con aletas, caja de bornes sobre su asiento,
  prensaestopas y la rejilla del ventilador;
- **en la tapa**: la boquilla de alimentación DN 250 con su carrete y el ramal DN 50 del agua, el termopozo (cuello,
  bridas, cabezal y la vaina que baja 900 mm bajo el nivel) y la boca de hombre DN 500 con su tapa empernada y la
  manija;
- **abajo**: cuatro patas sobre asientos soldados al fondo, con sus placas y pernos de anclaje, y la salida de fondo
  DN 100 con la válvula de bola (cerrada, la palanca atravesada al tubo), el codo y el tubo de descarga;
- **la suspensión**: la superficie plana del líquido (lámina translúcida en la mitad de atrás), el tinte del agua en
  todo lo que queda bajo el nivel, unos trozos de cáscara y las flechas del patrón de flujo axial en un plano justo
  detrás del corte: baja por el centro, se abre por el fondo, sube junto a la pared y vuelve bajo la superficie.

El corte quita lo que mira al lector por encima de la línea de tangencia del fondo (y > 0, z > zt): el fondo queda
entero y el resto se ve por el plano y = 0. La envolvente, la tapa, la chaqueta y la boquilla del agitador se ven
cortadas; los dos deflectores que caen en el plano del corte van cortados a lo largo (media placa). El eje, la
turbina, el deflector de atrás, el accionamiento y las boquillas de la mitad de atrás van enteros. Lo que se ve por la
abertura del corte (el interior de la envolvente y de la tapa) va recortado a ella y se registra recortado al prisma
que la abertura proyecta a lo largo de la mirada, así el audit mide lo mismo que se dibuja. Las piezas que atraviesan
el nivel (el eje, el deflector de atrás, la vaina) van partidas en él: la parte de abajo antes de la lámina del
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

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro (`estilo/paleta.json`, sección `isometricas`, en el repositorio del libro), la misma de todas sus figuras isométricas: `libro.mjs` la pasa por `../paleta-libro.mjs`, que le da a cada clase el tono de su material. `ta-ss` y `ta-trim` son acero; `ta-drive`, pintado; `ta-cast` y `ta-lever`, fundición; `ta-sub` y el agua (`ta-liq`), agua; la cáscara (`ta-peel`), cáscara; `ta-cut`, el corte del acero; `ta-bore`, hueco, y las flechas del flujo, el azul de la base. Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar las vistas del libro sin rehacer el dibujo.
