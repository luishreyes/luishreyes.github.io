# Filtro de tambor rotatorio al vacío en isométrico (skill `anatomy`)

Figura de la pestaña «Por dentro» del Explorador de filtración (POU 2026-20) en modo tambor. El tambor de
1,8 m va cortado por un plano normal a su eje: se ven la sección (camisa, cubierta con sus sectores, los
tubos de drenaje y la araña), la torta con su espesor en cada punto de la vuelta y el nivel de la
suspensión en la artesa. Afuera: las dos regaderas de lavado, la cuchilla con su canaleta, la banda que
se lleva la torta, la válvula, el tanque de filtrado con la bomba de vacío y la bomba de alimentación.

Lo mueve el modelo del explorador: `FScene.thick(φ)` da el espesor de la torta en cada fracción de vuelta
(presión constante con t = φ/n), la fracción sumergida f fija el nivel y con él la entrada, la salida, las
regaderas y la cuchilla, y el ángulo del tambor gira la sección. Cada tubo de drenaje se pinta según la
zona de la válvula por la que pasa (filtrado, escurrido, lavado, aire de secado, soplado). Si la torta es
más delgada que lo que la cuchilla puede despegar, la cuchilla se marca y la torta da la vuelta.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría fija, orden de pintura (`A.settle`) y audit; graba las piezas que dependen del caso en el caso de referencia (f = 0,33) para ordenarlas y auditarlas. Escribe `out/` y `preview.html`. |
| `geo.mjs` | Lo que depende del caso (nivel, piscinas, torta, pared derecha de la artesa, cuchilla, canaleta, regaderas). Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava a lo largo de x o de y (el mismo de `filtro-prensa`). |
| `live.js` | `FDrum`: la figura en vivo dentro del explorador. |
| `drive_test.js` | Caso sintético para `preview.html` (`?f=0.33&t=3`, `&thin=1` para una torta que la cuchilla no pela). |
| `fd.css` | Colores del corte, de los tubos por zona y de la suspensión; temas papel y blueprint. |
| `splice.mjs` | Reinserta `out/` en el HTML publicado, entre los marcadores `FDRUM_*_START/END`. |

```sh
node build.mjs --audit     # settle + audit (medio minuto); debe terminar en «audit passed»
node build.mjs --js        # solo el código en vivo, el CSS y la vista previa
node splice.mjs            # mete la figura nueva en public/.../Explorador_Filtracion.html
```
