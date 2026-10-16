# Alambique de cobre en isométrico (skill `anatomy`)

Figuras de la pestaña «Alambique» del Explorador de destilación por lotes (POU 2026-20). Son dos, una por equipo:

- **el alambique simple** (`build.mjs`), cuando el modo es alambique simple. Es un alambique de cobre como el del
  laboratorio. El calderín va en su camisa de vapor sobre cuatro patas, con la línea de vapor (válvula de globo,
  manómetro y trampa), el visor de nivel, la mirilla, el termómetro del capitel, la boca de carga y el drenaje. Del
  capitel sale el cuello de cisne, que baja al serpentín sumergido en el tanque de agua (cortado por el plano que mira al
  lector para ver la espiral). El destilado pasa por el loro con su densímetro y cae por el embudo al colector, que
  tiene una llave para cada recipiente: cabezas, corazón y colas;
- **el alambique con columna** (`columna.mjs`), cuando el lote va por la columna con reflujo (R constante o x_D
  constante). El mismo calderín con su camisa, su mirilla y su visor, y el termómetro en el hombro; encima, el reductor
  y una columna de platos de tres secciones con sus bridas, abierta por el plano que mira al lector (la boca oscura de
  abajo es la entrada del vapor del calderín). Arriba va la cabeza de reflujo: una linterna de vidrio entre dos bridas
  con cuatro varillas, el embudo colgado de su gancho, la copa del destilado con su pico, que atraviesa la brida de
  abajo hacia la salida, el electroimán con su piloto en una ménsula y el termómetro de la cabeza. Encima, el
  condensador de carcasa con su purga, y el agua que entra abajo y sale arriba (en contracorriente), que baja por
  detrás entre la columna y la bajada del destilado. El destilado sigue al mismo loro, al distribuidor (con un codo
  fundido bajo el embudo y una silla sobre su poste) y a los recipientes de los cortes.

Lo mueve el modelo de Rayleigh del explorador: `SScene.now()` da el instante del lote y `drawFig` le pasa a
`FStill.update` la fracción W/W₀ que queda (nivel del visor y de la mirilla, con el hervor), T del
calderín (termómetro), x_D instantánea (color del destilado y lo que se hunde el densímetro), la llave
abierta con su chorro y lo que lleva cada recipiente con su composición. Al terminar el lote se cierra el
vapor: el manómetro cae y el hervor para. En pausa o con movimiento reducido cada instrumento salta a su
valor (`snap`). Al pasar el puntero se resalta el equipo (calderín, cuello, condensador o recibo).

| Archivo | Qué es |
|---|---|
| `build.mjs` | El alambique simple: geometría fija, orden de pintura (`A.settle`) y audit. Escribe `alambique_data.json`, `out/` y `preview.html`. El `out/fig.js` lleva también los datos de la columna (`ST_COL_DATA`, de `out-col/data.json`), así que la columna se arma primero. |
| `columna.mjs` | El alambique con columna: geometría, orden y audit. Escribe `out-col/fig.svg`, `out-col/data.json` y `preview-col.html`; `--js` solo rehace la vista previa. |
| `drive_col.js` | Lote con columna sintético que se repite, solo para `preview-col.html` (`?n=12` cambia los platos). |
| `geo.mjs` | Medidas compartidas (`SG`) y las curvas del calderín, el capitel y el serpentín. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las figuras de filtración, con `F`). |
| `live.js` | `FStill`: la figura en vivo dentro del explorador; `updateCol` mueve lo de la columna (platos, embudo, piloto, termómetro de la cabeza). |
| `drive_test.js` | Lote sintético que se repite, solo para `preview.html`. |
| `st.css` | Cobre, agua, vidrio, diales y lo vivo; temas papel y blueprint. |
| `splice.mjs` | Reinserta `out/` en el HTML publicado, entre los marcadores `STILL_*_START/END`, y copia `out-col/fig.svg` a `simulaciones/fig/alambique/columna.svg`. |

```sh
node columna.mjs --audit   # la columna: settle + audit (unos 15 s); debe terminar en «audit passed»
node build.mjs --audit     # settle + audit (alrededor de un minuto); debe terminar en «audit passed»
node build.mjs --js        # solo el código en vivo, el CSS y la vista previa (necesita un build previo)
node splice.mjs            # mete la figura nueva en public/.../Explorador_Destilacion_por_Lotes.html
```

**La columna en vivo.** La página pide `fig/alambique/columna.svg` la primera vez que el modo deja de ser alambique
simple (mientras llega se ve el lienzo). En cada cuadro, `SScene.drawFig` le pasa a `FStill.update` lo mismo que al
alambique simple y a `FStill.updateCol` el cálculo plato a plato del instante (`stepDown` con la x_D y la R del
instante): los N − 1 platos (hasta 12, repartidos si hay más), cada uno con el color de su líquido y las burbujas del
vapor que lo atraviesa; la R del instante, con la que el embudo pasa 1/(R + 1) de cada ciclo de 2,4 s inclinado sobre
la copa (el piloto del electroimán encendido) y el resto echando el reflujo derecho al plato de arriba (con reflujo
total no sale nunca); y la temperatura de rocío de x_D en el termómetro de la cabeza. Sin lote válido el calderín queda
lleno, nada corre y la columna muestra los platos que pide N.

Reglas que salieron de armar la columna:

- A 30° de elevación la brida de arriba de la linterna tapa unos 8 cm del eje por debajo de ella: lo que tiene que verse
  adentro (el embudo) va más abajo, o la linterna se alarga.
- Una pieza que termina en una brida partida en dos mitades no puede caer en la junta: se corre un poco hacia atrás para
  que su borde quede entero en una mitad (la copa del destilado y su pico van 0,7 cm detrás del plano).
- Un tubo visto de frente que se apoya en un poste no lleva abrazadera con hueco (el borde del hueco queda encima del
  poste): va sobre una silla partida en dos mitades por el plano del tubo.
