# Alambique de cobre en isométrico (skill `anatomy`)

Figura de la pestaña «Alambique» del Explorador de destilación por lotes (POU 2026-20) cuando el modo es
alambique simple; con columna y reflujo el explorador vuelve a su esquema en canvas. Es un alambique de
cobre como el del laboratorio. El calderín va en su camisa de vapor sobre cuatro patas, con la línea de
vapor (válvula de globo, manómetro y trampa), el visor de nivel, la mirilla, el termómetro del capitel,
la boca de carga y el drenaje. Del capitel sale el cuello de cisne, que baja al serpentín sumergido en el
tanque de agua (cortado por el plano que mira al lector para ver la espiral). El destilado pasa por el
loro con su densímetro y cae por el embudo al colector, que tiene una llave para cada recipiente:
cabezas, corazón y colas.

Lo mueve el modelo de Rayleigh del explorador: `SScene.now()` da el instante del lote y `drawFig` le pasa a
`FStill.update` la fracción W/W₀ que queda (nivel del visor y de la mirilla, con el hervor), T del
calderín (termómetro), x_D instantánea (color del destilado y lo que se hunde el densímetro), la llave
abierta con su chorro y lo que lleva cada recipiente con su composición. Al terminar el lote se cierra el
vapor: el manómetro cae y el hervor para. En pausa o con movimiento reducido cada instrumento salta a su
valor (`snap`). Al pasar el puntero se resalta el equipo (calderín, cuello, condensador o recibo).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría fija, orden de pintura (`A.settle`) y audit. Escribe `alambique_data.json`, `out/` y `preview.html`. |
| `geo.mjs` | Medidas compartidas (`SG`) y las curvas del calderín, el capitel y el serpentín. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las figuras de filtración, con `F`). |
| `live.js` | `FStill`: la figura en vivo dentro del explorador. |
| `drive_test.js` | Lote sintético que se repite, solo para `preview.html`. |
| `st.css` | Cobre, agua, vidrio, diales y lo vivo; temas papel y blueprint. |
| `splice.mjs` | Reinserta `out/` en el HTML publicado, entre los marcadores `STILL_*_START/END`. |

```sh
node build.mjs --audit     # settle + audit (alrededor de un minuto); debe terminar en «audit passed»
node build.mjs --js        # solo el código en vivo, el CSS y la vista previa (necesita un build previo)
node splice.mjs            # mete la figura nueva en public/.../Explorador_Destilacion_por_Lotes.html
```
