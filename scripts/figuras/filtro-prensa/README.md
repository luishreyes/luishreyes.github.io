# Filtro prensa en isométrico (skill `anatomy`)

Figura de la pestaña «Por dentro» del Explorador de filtración (POU 2026-20), solo en modo prensa.
La prensa va en media sección: bomba neumática de doble diafragma, manómetro, cabezal fijo con el
canal de alimentación y el de filtrado, ocho placas de cámara, cabezal móvil, cilindro con su
pistón, tolva, banda transportadora, tanque de filtrado con mirilla y central hidráulica.

El movimiento sale del mismo ciclo del explorador (`FScene.stepPress` → `FPress.update`): la torta
crece con `u = V/A`, el manómetro marca la presión del modelo, la mirilla el filtrado acumulado, y en
la descarga el cilindro retira el cabezal móvil, las placas se corren una por una (resorte crítico,
el mismo que replica el audit) y cada torta cae a la banda.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.js`, `out/fig.css` y `preview.html`. |
| `xprism.mjs` | Prismas a lo largo de x con sección cóncava (las piezas en corte, la torta). Sin imports: también corre en la página. |
| `live.js` | `FPress`: la figura en vivo dentro del explorador. |
| `drive_test.js` | Ciclo sintético para `preview.html` (`?t=18.5` congela un instante). |
| `fp.css`, `fp-theme.css` | Colores de torta, suspensión y agua; tema papel y blueprint del explorador. |
| `splice.mjs` | Reinserta `out/` en el HTML publicado, entre los marcadores `FPRESS_*_START/END`. |
| `libro.mjs` | La vista quieta del libro (capítulo 17, Filtración): congela la figura a mitad de la filtración (`ESTADO`) y escribe `figuras/filtracion/_prensa.qmd` del libro con los nombres de las piezas, y `out/libro-preview.html` para revisarla. Corre después de `node build.mjs --audit`. |
| `isozoom.js` | Pellizco, arrastre, doble toque y botones + − «todo» para acercar la figura. Copia de referencia: el explorador lo lleva en su propio script (no está en `out/`), y sirve igual para la figura del tambor. |

```sh
node build.mjs --fast      # geometría y salidas, sin ordenar (segundos)
node build.mjs --audit     # settle + audit completo (unos 4 min); debe terminar en «audit passed»
node build.mjs --js        # solo el código en vivo y el CSS, con los datos de la última salida ordenada
node splice.mjs            # mete la figura nueva en public/.../Explorador_Filtracion.html
```

Las capturas necesitan `CHROME_PATH=/opt/pw-browsers/chromium` en las sesiones en la nube.
