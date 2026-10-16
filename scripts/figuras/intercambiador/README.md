# Intercambiador de tubos y coraza en isométrico (skill `anatomy`)

Figura de la pestaña «Por dentro» del Explorador de intercambiadores (POU 2026-20) cuando el equipo es de tubos y
coraza (1-n o corazas en serie). Hay nueve: una por cabezal TEMA (BEM, BEU, AES) y por número de corazas en serie
(1 a 3, apiladas en un bastidor, la A arriba). Cada coraza va abierta por el plano vertical de su eje: se ven el
haz de tubos, los bafles segmentados del 25 %, las placas de tubos, los cabezales con sus particiones y las
boquillas con sus bridas. El BEU lleva las curvas en U en el fondo de la coraza; el AES, el canal con tapa plana, la
tapa grande de la coraza y adentro el cabezal flotante (placa flotante, anillo dividido y su fondo).

La mueve el mismo perfil de Nagle del explorador (`profileAll`), con el que salen F y ε:

- los tubos se reparten en bandas horizontales, una por paso; cada tubo se pinta con la temperatura de su paso a lo
  largo de la coraza, y las particiones del canal y del cabezal de atrás se dibujan según el número de pasos;
- los trazos blancos de la columna de adelante recorren un paso en L/u (acotado entre 0,8 y 14 s);
- el lado coraza corre en zigzag por las ventanas de los bafles, con su temperatura; con vapor, caen gotas de
  condensado. En la coraza B (la segunda de una serie) la coraza va de atrás hacia adelante: sus ventanas están
  invertidas y su primer paso de tubos entra por el extremo donde sale la coraza (`flip` en `hxProfile`);
- las etiquetas de entrada, salida y entre corazas siguen a la figura cuando se acerca.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, interior sombreado del corte, orden de pintura (`A.settle`) y audit. Escribe `out/tc-{cabezal}-{n}.svg` y `.json`, `out/fig.js`, `out/fig.css` y `preview.html`. |
| `geo.mjs` | Medidas (`HX`), bafles, filas de tubos y carriles de las particiones. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FTube`: los tubos por tajada entre bafles, las particiones, las curvas en U y el lado coraza. |
| `hx.css` | Corte, cara cortada y lo vivo. El tema blueprint va en el explorador. |
| `drive_test.js` | Perfil sintético para `preview.html` (`?np=2…8`, `&steam=1`, `&t=s`, `&snap=1`). |
| `splice.mjs` | Mete el código y los datos en el HTML publicado (marcadores `HXFIG_*`) y copia los SVG a `simulaciones/fig/intercambiador/`, de donde la página los pide cuando hacen falta. |

```sh
node build.mjs --head BEM --ns 1 --audit   # una figura (medio minuto a un minuto); debe terminar en «audit passed»
node build.mjs --all --audit               # las nueve, en serie
node splice.mjs                            # al explorador publicado
```

Las piezas vivas (`u{l}.sl{k}` para cada tajada del haz entre bafles, `u{l}.ch` y `u{l}.rr` para las particiones)
se registran con la forma del volumen que ocupan, así `settle` las ordena con el resto; la página las llena.
