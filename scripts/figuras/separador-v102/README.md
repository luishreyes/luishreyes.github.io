# Separador de alta V-102 en isométrico (skill `anatomy`)

Figura del capítulo 2 de la edición impresa en inglés del libro de operaciones unitarias (Los diagramas de
ingeniería): el separador de alta V-102 de la planta de benceno, el mismo recipiente que aparece entero en el
isométrico de la planta (`../planta-benceno/`), ahora abierto para ver qué tiene por dentro y qué lleva afuera. Es
una figura quieta: no tiene nada vivo ni página propia. Parte del tambor del sistema flash (`../flash/`), sin la
bomba, el intercambiador, la válvula de expansión ni la mirilla.

Las medidas son las del dimensionamiento del libro (`geo.mjs`, en centímetros):

- **el recipiente**: 1,2 m de diámetro interior y 3,4 m entre tangentes, pared de 20 mm y cabezas elípticas 2:1, sobre
  un faldón con su anillo de base, cuatro pernos de anclaje a la vista y la fundación;
- **el corte**: el plano vertical por el eje que mira al lector quita la mitad de adelante del cuerpo, de las dos
  cabezas, del faldón y del anillo de base. La pared y el faldón cortados van en gris oscuro;
- **adentro**: la entrada de 8″ que entra un poco y descarga contra la placa desviadora (con cuatro platinas a la
  pared), la malla eliminadora de niebla sobre su anillo con las barras que la sujetan, el líquido al nivel normal
  (0,35 de la altura del cuerpo sobre la tangencia de abajo) con su marca, el rompe-vórtice en cruz con su tapa sobre
  la salida de líquido, el termopozo de TI-113 en el líquido y la horquilla de LSHH-115 sobre el nivel;
- **afuera**: la boquilla de entrada con su carrete (de E-102), la salida de gas de 8″ con su codo (a C-101 A/B),
  PSV-116 sobre su válvula de bloqueo de compuerta (sellada abierta) con la descarga de lado, PT-105 con su válvula de
  raíz, el puente de nivel de 3″ con sus dos boquillas y válvulas, LT-106 (radar de onda guiada) arriba del puente,
  el visor de vidrio LG-114 al lado del puente con sus válvulas, LSHH-115, el termómetro de TI-113, la salida de
  líquido de 3″ por el fondo (a V-103) y el drenaje de 2″ con su válvula y brida ciega.

Las boquillas de afuera van todas en la mitad de atrás: lo que quedaba en la de adelante se fue con el corte. Por eso
la salida de gas, la PSV y el transmisor de presión quedan un poco corridos hacia atrás sobre la cabeza.

| Archivo | Qué es |
|---|---|
| `geo.mjs` | Las medidas (`SV`), el contorno del recipiente en el plano del corte y la media corona. |
| `build.mjs` | Geometría, interior sombreado del corte, líquido, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/separador_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | El SVG de la edición impresa: 318 pt de ancho, colores resueltos en un `<style>` propio (sin variables CSS ni la hoja del kit), rótulos en inglés con línea y punto, Archivo de 7,5 pt. |

```sh
node build.mjs --audit        # unos dos minutos y medio (el orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit, en un segundo: para mirar la geometría
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --en ../../../../libro-operaciones-unitarias/en/figuras/02/v102.svg
node ../../../../libro-operaciones-unitarias/en/herramientas/svg-a-pdf.mjs ../../../../libro-operaciones-unitarias/en/figuras/02/v102.svg
```

`libro.mjs` abre el dibujo en Chromium (Playwright) para resolver los estilos del kit y medir los rótulos con la
Archivo del libro (`en/estilo/fuentes`, o la carpeta de `--fuentes`). Pone cada rótulo a la altura de su punto y tan
cerca del dibujo como lo permitan las piezas a esa altura, y busca la escala más grande con la que todo cabe en
318 pt de ancho y 415 pt de alto. Los rótulos y sus puntos (`ANCLAS`) están en `build.mjs` y `libro.mjs`: si se
mueve una pieza, hay que revisarlos en el PDF.

**Las dos excusas del audit** (en `build.mjs`, revisadas a 4×): el audit toma el cuerpo y el corte de la pared como
varillas por su eje, y el codo de la salida de líquido cae bajo el polo de esa varilla imaginaria, 26 cm detrás de la
pared (`crowd`); y el asiento de la salida de gas sobre la cabeza deja una astilla de 2 px² en su base, donde la
cúpula sube delante de él (`allow`).
