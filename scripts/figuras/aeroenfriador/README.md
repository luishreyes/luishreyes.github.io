# Aeroenfriador de tiro forzado en isométrico (skill `anatomy`)

Figura de la pestaña «Por dentro» del Explorador de intercambiadores (POU 2026-20) cuando el equipo es un
aeroenfriador. Un haz de cuatro filas de tubos aleteados en arreglo triangular, entre dos cabezales de tapones (placa
de tubos, caja y placa de tapones, con un tapón frente a cada tubo), con sus soportes y sujetadores; debajo, la
cámara (plenum) con dos ventiladores axiales, sus anillos con brida y labio, el cubo, el eje y el motor sobre su placa
en el puente; todo sobre columnas con placas de anclaje, vigas y arriostramiento en cruz atrás. Al haz se le quita el
bastidor del lado del lector y a la cámara su panel de adelante, para ver las filas, las bocas y las aspas. El haz va
acortado (tubos de 3 m) y dibuja 16 tubos por fila.

Hay dos variantes: pasos pares (la salida del proceso abajo del cabezal de adelante) e impares (`--odd`: la salida
abajo del de atrás). La mueve el perfil del explorador (`profileAll`: el proceso por los tubos y el aire como
«coraza», en el contra-cruce equivalente):

- cada fila se pinta a lo largo con la temperatura del proceso en su paso (`passOf`, `pathPos`): entra por la fila
  de arriba en el cabezal de adelante y baja paso a paso, cambiando de sentido en cada cabezal; los trazos blancos
  tardan en recorrer un tubo lo que tarda el líquido, L/u (acotado entre 0,8 y 14 s);
- las aspas giran más rápido con más velocidad de frente del aire (más despacio que las reales);
- el aire entra frío por debajo de los anillos, sube por la cámara y sale por arriba del haz con la temperatura del
  balance en promedio, más caliente donde la fila de arriba está más caliente.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/aero-{par,impar}.svg` y `.json`, `out/fig.js`, `out/fig.css` y `preview.html`. |
| `geo.mjs` | Medidas (`AC`), filas y tubos, paso del proceso en cada fila. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FAir`: los tubos aleteados, las aspas y el aire. |
| `ac.css` | Chapa, cabezales y lo vivo. El tema blueprint va en el explorador. |
| `drive_test.js` | Perfil sintético para `preview.html` (`?np=1…4`, `&v=m/s`, `&t=s`, `&snap=1`). |

```sh
node build.mjs --audit && node build.mjs --odd --audit   # medio minuto cada una; deben terminar en «audit passed»
node ../intercambiador/splice.mjs                        # al explorador publicado (marcadores ACFIG_*)
```

Lo vivo se registra con la forma del volumen que ocupa: el haz como una caja, las aspas y el aire de la boca en dos
mitades partidas por el plano vertical del eje que mira al lector (la de atrás queda detrás del cubo y del eje), y el
anillo en dos mitades por el mismo plano (la lejana detrás de las aspas, la cercana delante).
