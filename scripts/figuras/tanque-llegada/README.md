# Tanque de llegada en isométrico (skill `anatomy`)

Figura del capítulo 13 del libro de operaciones unitarias (Tanques, válvulas, tuberías y medición): el tanque de
llegada del caso, el tanque elevado de agua de servicios al que llega la descarga de la bomba y del que la planta toma
el agua por gravedad. Todo va a escala real, en milímetros, con las cotas medidas desde el eje de la bomba
(`geo.mjs`). Las medidas que da el libro (@tbl-val-tanque) son el diámetro, las cotas, la toma del transmisor, el
respiradero y la llegada; las demás son **medida del libro**: típicas de un tanque así, escogidas para la figura.

- **el tanque**: cilindro vertical de acero al carbono de 3,0 m de diámetro interior, envolvente de 6 mm en dos
  anillos de 1825 mm (fondo a 9,0 m, borde a 12,65 m), con sus costuras; fondo plano de 8 mm que sobresale 44 mm;
  ángulo de coronamiento L 65 × 65 × 6 por fuera; techo de cono autoportante de pendiente 1:6 (9,5°, la mínima de un
  cono autoportante), placa de 5 mm con alero, que sube hasta 12,91 m en el centro. Son las cotas de la tabla del
  libro: pared hasta 12,65 m y cono hasta 12,91 m, con 26,4 m³ hasta el techo. Agua hasta el nivel normal, 12,0 m;
- **la llegada**: el tramo alto de 2½ in a 13 m, con su brida al borde del dibujo; la válvula de control de globo de
  2 in (reductores de 2½ a 2 in, bridas, cuerpo, bonete, arcada de dos columnas, vástago y actuador de diafragma con
  sus dos casquetes y la brida empernada); el carrete recto de 630 mm, el codo de la bajada y la boquilla de 3 in del
  techo con su brida reductora; adentro, el tubo baja hasta 11,0 m, 1 m bajo el nivel normal. Lo que va dentro de
  la boquilla no se ve y no se dibuja: el tubo arranca de un collar soldado bajo el techo, que lo guía;
- **en el techo**: el respiradero de 2 in, un cuello de ganso de dos codos con la boca hacia abajo y la malla; la
  boca de inspección del techo, de 24 in (cuello, brida, tapa con sus pernos, manija y bisagra); el interruptor de
  muy alto nivel, de horquilla vibrante, en una boquilla de 2 in, con la horquilla adentro a 12,25 m, entre el nivel
  normal y el rebose; la baranda del borde junto a la escalera (tres postes y dos pasamanos en uniones de bola);
- **en la envolvente**: la boca de inspección de 24 in cerca del fondo (centro a 9,8 m), con placa de refuerzo
  curva, cuello, brida, tapa empernada con dos manijas y bisagra de tres nudillos; el transmisor de nivel LT‑101 en la
  toma de 9,2 m (boquilla de 2 in, válvula de bola de bloqueo con su palanca, brida ciega con la toma de ½ in, la
  pierna de impulso corta y el transmisor de presión diferencial con la caja de la electrónica; el lado de baja,
  abierto al aire por un tapón de venteo); el rebose: boquilla de 2 in con la plantilla de la boca a 12,35 m, así el
  borde libre hasta el borde de la envolvente (12,65 m) es de 0,30 m, el mínimo de la Resolución 0330 de 2017, art.
  79; bridas, codo y el tubo que baja por fuera junto a la columna de 135°, sujeto a ella con abrazaderas, hasta un
  dado de concreto con su espacio de aire;
- **la escalera con jaula**: largueros de platina de 60 × 12, peldaños de 20 mm cada 300 mm, ménsulas a la
  envolvente y a la viga anillo, y la jaula de aros de 720 mm por dentro (700 mm desde los peldaños) cada 750 mm desde
  2,2 m sobre el piso, con cinco barras verticales; el pie va sobre su propio dado;
- **abajo**: la salida a la planta, de 3 in, con un tubo corto de 100 mm adentro para no llevarse el sedimento, su
  válvula de compuerta con el volante, el codo y el tubo que sale por delante de la estructura; el drenaje de 2 in con
  su compuerta y un tubo corto abierto;
- **la estructura**: viga anillo bajo la envolvente; cuatro columnas de tubo de 6 in a 45°, 135°, 225° y 315°, con
  sus placas de cabeza; en cada cara, cartelas, dos diagonales de platina de 60 × 8 que se cruzan sin tocarse y un
  puntal de 3 in a 7,2 m sobre sus asientos; abajo, placas base con sus pernos sobre pedestales de concreto, en el
  piso a −0,7 m.

**El corte del tanque.** Se quita el cuarto de la envolvente, del ángulo, del techo y del agua que mira al lector
(x > 0, y > 0, por encima del fondo). El fondo queda entero; la estructura, la escalera, la baranda y la tubería de
afuera van enteras. La boca de inspección del techo cae en el plano del corte y va partida: se ve su cuello por dentro
y las caras cortadas del cuello, la brida y la tapa. Lo que se ve por la abertura (la envolvente por dentro, el fondo
y la lámina del agua) va recortado a ella y se registra recortado al prisma que la abertura proyecta a lo largo de la
mirada, como en el tanque agitado. Lo que queda bajo el nivel lleva el tinte del agua y la superficie es una lámina
translúcida.

**El corte de la estructura.** Del piso al fondo hay 9,7 m, y entero el dibujo quedaba alto y angosto: se esconde de
0,5 m a 6,8 m, y lo de abajo (pedestales, placas base, el pie de la escalera y el final del rebose) va subido
`SHIFT` = 5,95 m, con 350 mm de aire entre las dos partes. Las columnas, los largueros, las barras de la jaula y el
tubo del rebose terminan en el corte; arriba, las columnas cuentan como apoyo (`ground`) en el audit.

**El audit en centímetros.** Como en el tanque agitado, `cm()` pasa cada forma registrada a centímetros y el audit
recibe la misma cámara con la escala por 10 (`PA`).

**Peso.** El SVG va en línea en la página del libro: los trazos se reescriben con coordenadas relativas en décimas
(`compact`), las caras del mismo tono van juntas y los colores van en clases (`tl-*`, en un `<style>` dentro del SVG).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/tanque_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`TL`), el techo de cono, el corte de la estructura (`SHIFT`, `zDraw`) y media corona. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `libro.mjs` | Escribe `figuras/valvulas-tuberias-y-medicion-de-flujo/_tanque-llegada.qmd` en el repositorio del libro, con el SVG y los rótulos (todos en el arreglo `ROTULOS`, para traducirlos), y `out/libro-preview.html` para revisarla. |

```sh
node build.mjs --audit        # unos 3 minutos (2 min 40 s del orden y 15 s del audit); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
```

Para depurar el orden sin correr todo: `TL_ITEM="pieza" node build.mjs` lista todo lo que se cruza con una pieza en
pantalla y quién va delante, y `TL_PAIRS="a,b"` dice dónde va delante cada una. `TL_STEP=0.5` hace la rejilla del
orden más gruesa (más rápido, menos fino).

En el capítulo se incluye con `{{< include figuras/valvulas-tuberias-y-medicion-de-flujo/_tanque-llegada.qmd >}}`
dentro de un bloque `::: {#fig-val-tanque-llegada}`; el CSS de las piezas es el de siempre (`estilo/anatomia.css`).
