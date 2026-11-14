# Separador de alta presión de la planta de benceno en isométrico (skill `anatomy`)

Figura del capítulo 2 de la edición impresa en inglés del libro de operaciones unitarias: el separador de alta presión
de la planta de benceno, el mismo recipiente que aparece entero en el isométrico de la planta (`../planta-benceno/`),
abierto por el plano vertical de su eje que mira al lector, sobre su faldón. Por dentro se ven la placa desviadora de la
entrada, la malla eliminadora de niebla sobre su anillo, el líquido al nivel normal, el rompe-vórtice, el termopozo y
el interruptor de muy alto nivel; por fuera, las boquillas de entrada, de gas, de líquido y de drenaje, la válvula de
seguridad con su válvula de bloqueo, el transmisor de presión y el puente de nivel con el visor y el transmisor. Las
boquillas de afuera van todas en la mitad de atrás. Es una figura quieta: no tiene nada vivo ni página propia. Parte
del tambor del sistema flash (`../flash/`). Va en centímetros (`geo.mjs`).

Las medidas del caso y los instrumentos de cada boquilla están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos dos minutos y medio (el orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit, en un segundo: para mirar la geometría
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --en ../../../../libro-operaciones-unitarias/en/figuras/02/v102.svg
node ../../../../libro-operaciones-unitarias/en/herramientas/svg-a-pdf.mjs ../../../../libro-operaciones-unitarias/en/figuras/02/v102.svg
```

El audit tiene dos excusas revisadas a 4×, en `build.mjs` (`crowd` y `allow`).

| Archivo | Qué es |
|---|---|
| `geo.mjs` | Las medidas (`SV`), el contorno del recipiente en el plano del corte y la media corona. |
| `build.mjs` | Geometría, interior sombreado del corte, líquido, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/separador_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | El SVG de la edición impresa: 318 pt de ancho, colores resueltos en un `<style>` propio (sin variables CSS ni la hoja del kit), rótulos en inglés con línea y punto, Archivo de 7,5 pt. |

## Qué escribe

`libro.mjs` escribe un solo SVG autónomo para la edición impresa en inglés. Abre el dibujo en Chromium (Playwright)
para resolver los estilos del kit y medir los rótulos con la Archivo del libro (`en/estilo/fuentes`, o la carpeta de
`--fuentes`), pone cada rótulo a la altura de su punto y tan cerca del dibujo como lo permitan las piezas, y busca la
escala más grande con la que todo cabe en 318 pt de ancho y 415 pt de alto. Los rótulos y sus puntos (`ANCLAS`) están
en `build.mjs` y `libro.mjs`: si se mueve una pieza, hay que revisarlos en el PDF. Los colores resueltos son los de la
paleta del libro (`estilo/paleta.json`, sección `isometricas`), que `libro.mjs` toma de `../paleta-libro.mjs` y escribe
en hex: si cambia un color de `paleta.json`, se vuelve a correr `libro.mjs` y después `svg-a-pdf.mjs`.
