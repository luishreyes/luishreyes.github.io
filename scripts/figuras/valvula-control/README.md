# Válvula de control de globo en isométrico (skill `anatomy`)

Figura del capítulo 13 del libro de operaciones unitarias (Tanques, válvulas, tuberías y medición): una válvula de
control de globo de 2″, clase 150 RF, de un solo asiento, guiada por arriba y con obturador perfilado, en una línea de
agua. Todo va a escala real, en milímetros (`geo.mjs`):

- **la línea**, a cada lado: tramo corto de tubo de 2″ cédula 40 con su cordón de soldadura, brida de cuello soldable,
  empaque de lámina y dos espárragos de 5/8″ con sus tuercas (los dos de adelante se van con el corte);
- **el cuerpo**: bridas ASME B16.5 con cara realzada (cara a cara de 254 mm, ISA 75.08.01), cuellos, el globo y el
  asiento del bonete. Por dentro, el paso en S: la galería de abajo, el tabique de la entrada, el puente con el anillo
  de asiento roscado (puerto de Ø 46, rosca de 14 hilos por pulgada) y el tabique de la salida;
- **el obturador perfilado** con su poste y el vástago, a 60 % de la carrera de 19 mm;
- **el bonete**: brida con sus espárragos, buje guía del poste, caja de empaquetadura con el anillo de fondo y cinco
  anillos, el seguidor y la brida del prensaestopas con dos espárragos de 3/8″ y sus tuercas;
- **la arcada**: anillo y contratuerca sobre el bonete, dos columnas y la placa del actuador; el conector de los dos
  vástagos con sus contratuercas, la aguja del indicador de carrera y su escala en la columna derecha;
- **el actuador de diafragma y resorte**, de aire para abrir y falla cerrada: tapa de abajo con su cubo y la toma del
  aire, diafragma con su convolución apretado entre las bridas, plato, resorte, tapa de arriba con el respiradero y los
  pernos de las bridas;
- **el posicionador** en la columna izquierda, con su tapa, placa, dos manómetros, el soporte, la palanca de
  realimentación con su ranura en el pasador del conector y el tubo de cobre de 1/4″ que lleva el aire a la tapa de abajo.

El corte quita la mitad que mira al lector del cuerpo, del bonete, de las bridas y de los tubos (el plano del flujo,
y = 0). El obturador, los vástagos, el seguidor, la arcada y el posicionador van enteros: cada pieza entera que cruza
el plano se dibuja una vez en `<defs>` y se usa dos veces, la parte de atrás antes de las caras del corte y la de
adelante después, cada una recortada a la proyección de su mitad (`splitTurned`). A la caja del actuador se le quita
un cuarto (x > 0, y > 0) para ver el diafragma, el plato y el resorte. Las superficies curvas cortadas se tonan con
`surface` (bordes de tono por bisección, sin escalones); las piezas de revolución cortadas, con `revPart`: un
elemento por tramo de su sección y por sector de ángulo, con los sectores partidos también en AZ ± 90°, y cada uno
registra solo la cáscara que mira al lector, en bandas, para que el orden de pintura no haga ciclos. Lo que se ve por
la abertura del corte va recortado a ella y se registra recortado al prisma que la abertura proyecta a lo largo de la
mirada (`CLIPV`), así el audit mide lo mismo que se dibuja.

**Peso.** El SVG va en línea en la página del libro: los trazos se reescriben con coordenadas relativas en décimas
(`compact`), las caras del mismo tono van juntas y los torneados enteros van una sola vez en `<defs>`. `out/fig.svg`
pesa unos 430 KB y el `.qmd` con los rótulos, unos 435 KB.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/valvula_data.json` (cámara y puntos de los rótulos) y `preview.html`. `--carrera 0.6` pone el obturador a otra altura (de 0 a 1). |
| `geo.mjs` | Las medidas (`VC`), los esferoides del globo, el perfil del obturador y los tabiques. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `libro.mjs` | Escribe `figuras/valvulas-tuberias-y-medicion-de-flujo/_valvula-control.qmd` en el repositorio del libro, con el SVG y los rótulos, y `out/libro-preview.html` para revisarla. |

```sh
node build.mjs --audit        # unos 14 minutos (11 del orden y 3 del audit); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
```

Para depurar el orden sin correr todo: `VC_PAIRS="pieza.a,pieza.b" node build.mjs` dice dónde va delante cada una, y
`VC_ITEM="pieza" node build.mjs` lista todo lo que se cruza con una pieza en pantalla.

En el capítulo se incluye con `{{< include figuras/valvulas-tuberias-y-medicion-de-flujo/_valvula-control.qmd >}}`
dentro de un bloque `::: {#fig-valvula-control}`; el CSS de las piezas es el de siempre (`estilo/anatomia.css`) y los
colores propios de la figura (corte, fundición, caucho, cobre) van en un `<style>` dentro del SVG.
