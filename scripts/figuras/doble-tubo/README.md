# Intercambiador de doble tubo en isométrico (skill `anatomy`)

Figura de la pestaña «Por dentro» del Explorador de intercambiadores (POU 2026-20) cuando el equipo es de doble
tubo. Es un banco de tres horquillas apiladas en un parral de un poste, como en la figura de Kern: cada rama del
tubo exterior va abierta por el plano vertical de su eje y adentro se ve, entero, el tubo interior. Atrás, el
cabezal de retorno de cada horquilla (una fundición ovalada con su brida y su tapón de drenaje) une los dos ánulos
y lleva adentro la curva del tubo interior. Adelante, cada rama termina en la brida del tubo exterior y el
prensaestopas por donde sale el tubo interior; entre horquillas, el tubo interior pasa por una curva por fuera y
el ánulo por un par de boquillas bridadas. Los diámetros van agrandados y las ramas acortadas para que el corte se
lea (el ánulo, algo exagerado).

La mueve el mismo perfil del explorador (`profileAll`, contracorriente o paralelo, con el ánulo como «coraza»):

- el tubo interior de cada rama se pinta a lo largo con la temperatura de su fluido (un degradado en la posición
  del recorrido, `pathPos`), con su sombra y su brillo; los trazos blancos corren en su sentido y tardan en una rama
  lo que tarda el líquido, L/u (acotado entre 0,8 y 14 s);
- el ánulo es un velo con la temperatura de su fluido sobre la pared interior del tubo exterior, recortado a la
  abertura, con puntos que corren por la holgura en su sentido (al revés del tubo interior en contracorriente);
- con vapor en el ánulo, el condensado: gotas que bajan por el tubo interior, caen y corren por el fondo del tubo
  exterior;
- las etiquetas de entrada y salida (los dos extremos del tubo interior y las dos boquillas del ánulo, que se
  intercambian en paralelo) siguen a la figura cuando se acerca.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, interior sombreado del corte, orden de pintura (`A.settle`) y audit. Escribe `out/doble.svg` y `.json`, `out/fig.js`, `out/fig.css` y `preview.html`. |
| `geo.mjs` | Medidas (`DP`), altura de cada rama y posición a lo largo del recorrido. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FDouble`: el tubo interior, el ánulo y el condensado. |
| `dp.css` | Corte, cara cortada, fundición y lo vivo. El tema blueprint va en el explorador. |
| `drive_test.js` | Perfil sintético para `preview.html` (`?par=1`, `&steam=1`, `&t=s`, `&snap=1`). |

```sh
node build.mjs --audit             # medio minuto; debe terminar en «audit passed»
node ../intercambiador/splice.mjs  # al explorador publicado (marcadores DPFIG_*), con las de tubos y coraza y placas
```

El tubo interior de cada rama (`leg{k}.in`) se registra como el cilindro que es y lleva adentro su capa viva; el
velo del ánulo va dentro del interior del tubo exterior (`leg{k}.out`), así queda detrás del tubo interior.
