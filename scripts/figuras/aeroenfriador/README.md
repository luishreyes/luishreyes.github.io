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
| `libro.mjs`, `rotulos.mjs` | La vista del libro (capítulo 22, 22.10) con los nombres de las piezas, en español y en inglés; lo común está en `../intercambiador/libro-comun.mjs`. |

```sh
node build.mjs --audit && node build.mjs --odd --audit   # medio minuto cada una; deben terminar en «audit passed»
node ../intercambiador/splice.mjs                        # al explorador publicado (marcadores ACFIG_*)
```

Lo vivo se registra con la forma del volumen que ocupa: el haz como una caja, las aspas y el aire de la boca en dos
mitades partidas por el plano vertical del eje que mira al lector (la de atrás queda detrás del cubo y del eje), y el
anillo en dos mitades por el mismo plano (la lejana detrás de las aspas, la cercana delante).

**La vista del libro** (capítulo 22, «Doble tubo, aeroenfriadores y superficie raspada»): `node build.mjs --libro --audit`
agrega la persona de referencia de 1,75 m (`../persona.mjs`) de pie en el piso junto a la columna de atrás, por fuera de
la estructura (bajo la cámara no cabe: los anillos bajan a 1,26 m; `PERSONA` en `build.mjs`), y las anclas de los
rótulos, y escribe aparte `out/aero-par-libro.svg` y `.json`; sin `--libro` los SVG del explorador salen idénticos. `node
libro.mjs` la abre con el código vivo (un paso, el haz en un tono de lo caliente, las aspas quietas en los grises del
acero), quita el aire que sube, que solo se lee en movimiento, y pone flechas en su lugar (azules bajo los anillos,
naranjas sobre el haz), y escribe `figuras/intercambiadores-de-calor/_aeroenfriador.qmd` del libro.
`CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina` escribe la lámina inglesa, `en/figuras/22/air-cooler.svg`,
y `node herramientas/svg-a-pdf.mjs figuras/22/air-cooler.svg` desde `en/` la pasa a PDF.
