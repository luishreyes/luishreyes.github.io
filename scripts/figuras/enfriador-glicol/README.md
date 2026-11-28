# Enfriador de glicol empacado en isométrico (skill `anatomy`)

Figura del capítulo 26 del libro de operaciones unitarias: el enfriador de glicol empacado de la winterización, el que
enfría la camisa de TK-201. Es un ciclo de compresión de vapor con propano entero en un gabinete de lámina, de
condensador de aire, sobre dos perfiles en C y una losa de concreto, al aire libre. Se le quitó el panel entero del
costado largo que mira al lector, de la base al techo, así que se ve adentro: a la derecha, el compresor hermético sobre
sus gomas, con el calentador del cárter y la caja de bornes; adelante, en el medio, el recibidor vertical con su válvula
encima, y la línea de líquido de cobre, que corre hacia atrás con el filtro secador y la mirilla y entra a la válvula de
expansión termostática; contra la pared de atrás, el evaporador de placas soldadas, con el bulbo de la válvula sujeto a
la succión desnuda, el igualador después del bulbo y la succión aislada que sube y va al compresor, y a su derecha los
presostatos de alta y de baja con sus capilares; a la izquierda, el tanque del glicol con su tapa, el tapón de llenado,
la sonda del controlador y el visor de nivel, y adelante la bomba del glicol.

El extremo de +x es el condensador: un serpentín de dos hileras de tubo de cobre con aletas, con los codos de retorno en
la placa de adelante y los cabezales de entrada y de salida al lado; abajo, la placa de datos y la advertencia del
refrigerante inflamable. En el techo, sobre el condensador, el ventilador axial con su anillo, su malla y su motor
colgado de tres brazos. En el extremo de −x, por dentro, el tablero con el controlador, el interruptor y dos pilotos, y
las rejillas de ventilación; por ahí salen las dos líneas del glicol, cada una con su válvula de bola roscada y su unión.
Las flechas blancas muestran el aire de afuera que entra por el condensador y sale caliente por la malla. Va a escala
real, en milímetros (`geo.mjs`), salvo las flechas, que son un esquema.

Adentro no hay tabique: la pared de atrás solo se ve a la izquierda de x ≈ 90 mm (lo demás lo tapa el serpentín) y bajo
unos 700 mm (lo de arriba lo tapa el techo), y lo bajo del centro de atrás lo tapa el compresor. Por eso el evaporador y
los presostatos van bajos y el recibidor y el tablero, adelante (el comentario de `geo.mjs` lo explica).

Las medidas del caso y de qué fuente sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # unos 15 s (el orden, unos 12 s); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría (no deja el SVG en orden)
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
node libro.mjs --anclas       # imprime dónde cae cada ancla, para acomodar los rótulos
EG_ITEM="pieza" node build.mjs   # lista todo lo que se cruza con una pieza en pantalla (lento)
EG_PAIRS="pieza" node build.mjs  # los pares del orden de una pieza, con el área en que va delante cada una
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`), como el extractor y el condensador evaporativo. Es más
bajo que una persona, así que lleva la mano de referencia (`manoEnBorde()` de `../persona.mjs`), apoyada en el canto de
atrás del techo (su lugar, en `EG.mano` de `geo.mjs`). Usa los prismas de `../extractor-arrastre/xprism.mjs`.

Las curvas de los tubos van con 24 tramos (`pipe()`), y las que giran de −x a −y (o de +x a +y) en un plano horizontal
se evitan o se hacen grandes: en esta cámara se doblan sobre sí mismas en la vista. Por eso la línea del condensador
llega recta al recibidor, por una boquilla corrida del eje, y la del evaporador al tanque, igual. El cobre de la succión
y su aislamiento son un solo tubo (`bundle`). Lo que atraviesa una pared no se dibuja adentro de ella. La advertencia
del extremo va pintada con la franja de abajo del marco, en el mismo trazo.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`EG`), el tubo de cobre (`CU`) y el de acero (`DN`), la altura de cada tubo del condensador (`zTube`) y el área de afuera del serpentín (`areaCondensador`). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` y `out/libro-preview-620.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). |

## Qué escribe

`node libro.mjs` escribe `figuras/refrigeracion-y-congelacion/_enfriador-glicol.qmd` en el libro (la vista y los
rótulos en español, con la mano y su rótulo), que el capítulo incluye con `{{< include … >}}` dentro de un bloque
`::: {#fig-…}`, con el pie debajo. Los colores salen de la paleta del libro (`estilo/paleta.json`, sección
`isometricas`) por `../paleta-libro.mjs`, con las clases `eg-*`: si cambia un color, `node ../paleta-libro.mjs` vuelve a
pintar la vista sin rehacer el dibujo.
