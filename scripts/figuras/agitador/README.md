# Tanque agitado en isométrico (skill `anatomy`)

Figuras de la vista «Equipo» de la pestaña 1 del Explorador de agitación (POU 2026-20). Son dos equipos, y la página
escoge según el tamaño del caso:

- **el reactor enchaquetado** (T ≥ 0,8 m), como el de extracción del proyecto: fondo plano con camisa de vapor en la
  pared y en el fondo, aislamiento con su forro, cabeza 2:1 con la boquilla del agitador, la boca de hombre con su
  tapa ciega y su manija, la mirilla y su lámpara, el termopozo, la entrada de gas con su válvula y la alimentación;
  arriba, el sello mecánico con su toma de lavado, la linterna con el acople, el reductor de ángulo recto y el motor;
  abajo, las patas, la válvula de fondo con su volante y la salida; de lado, la línea de vapor con su válvula de globo
  y su manómetro, y la del condensado con su trampa. Va abierto por el plano vertical del eje que mira al lector: se
  ve la mitad de atrás del casco por dentro, y en el corte el casco, el vacío de la camisa, la camisa, el aislamiento
  rayado y el forro. De los cuatro bafles quedan los dos de atrás;
- **el tanque de vidrio del laboratorio** (T < 0,8 m), de fondo plano como los de los ensayos de mezclado, sobre la
  placa base de un agitador de varilla con la columna, la nuez, el brazo, el motor con su pantalla y el mandril. El
  vidrio deja ver todo, con los cuatro bafles.

Cada equipo tiene dos alturas: la normal (H/T hasta 1,3) y la alta (`--tall`, H/T hasta 2). En la página son
`agitador-a`, `agitador-b`, `agitador-la` y `agitador-lb`, en `simulaciones/fig/agitador/`; se pide solo la que hace
falta.

El dibujo no tiene números propios: el diámetro interno vale 100 y todo lo de adentro sale de la escena de la pestaña 1
(`TankScene`), escalado con k = 100/T. `FAgit` (en `live.js`) pinta en un lienzo encima del SVG, en sus mismas
coordenadas (sigue al acercamiento), el eje y el impulsor que gira (los seis tipos, con `impPolys`), los bafles, el
líquido con su superficie y su vórtice, las partículas con su estela y el color de su rapidez, los sólidos (quietos o
en suspensión), las burbujas del distribuidor y del vórtice, el anillo distribuidor con su tubo, y en el plano del
eje el trazador, el mapa de velocidad y las líneas de corriente, reflejados a ambos lados, con las sondas P1, P2 y P3.
En el reactor solo se pinta lo que queda detrás del corte (más la mitad de adelante del eje y del impulsor, que no se
cortan); en el vidrio, todo, y al final el frente del vidrio. Una partícula que queda detrás de un bafle visto desde
el lector se pinta antes que él. El manómetro del vapor marca la presión de saturación del agua a T_w (Antoine).

| Archivo | Qué es |
|---|---|
| `build.mjs` | El reactor: geometría, sombreado del casco por dentro, corte en dos mitades por capa, orden de pintura (`A.settle`) y audit. Escribe `out/agitador-{a,b}.svg` y `.json`, `out/fig.js` y `out/fig.css`. |
| `build-lab.mjs` | El tanque de vidrio y su soporte. Escribe `out/agitador-{la,lb}.svg` y `.json`. |
| `geo.mjs` | Medidas del reactor (`AG`) y del vidrio (`GL`), y los polígonos del corte (`cutSide`). Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FAgit`: lo vivo en el lienzo, con el modo de corte y el de vidrio. |
| `ag.css` | Corte, rayado, vidrio, pintura y diales. El tema blueprint va en el explorador. |
| `splice.mjs` | Mete el código y los datos en el HTML publicado (marcadores `AGFIG_*`) y copia los SVG a `simulaciones/fig/agitador/`. |

```sh
node build.mjs --audit && node build.mjs --tall --audit           # un minuto y medio cada una; deben terminar en «audit passed»
node build-lab.mjs --audit && node build-lab.mjs --tall --audit   # segundos
node build.mjs --js                                               # solo el código en vivo y el CSS
node splice.mjs
```

En la forma del audit la cabeza del reactor va gruesa por dentro (los asientos de las boquillas grandes, en la
pendiente de la cabeza, no asoman al interior) y el casco va en dos cuerpos (uno solo, en la variante alta, sería tan
esbelto que el audit lo tomaría por una varilla). El dibujo usa la cabeza real.
