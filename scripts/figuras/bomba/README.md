# Instalación de bombeo en isométrico (skill `anatomy`)

Figura de la pestaña «Instalación» del Explorador de bombas centrífugas (POU 2026-20). Es la instalación completa,
como un equipo de planta:

- **el tanque de succión**, vertical, con fondos 2:1, patas, venteo, manómetro (P₁) y nivel de vidrio;
- **la línea de succión** de 4″, con su válvula de compuerta, el soporte, la toma del manómetro de succión, el tramo
  recto y la reducción excéntrica de 4″ × 3″, plana arriba;
- **la bomba**, una 2×3-8 de succión axial: voluta en espiral con su lengüeta y la garganta que sube a la descarga,
  impulsor abierto de seis álabes, tapa de la carcasa, cámara del sello con su prensa, caja de rodamientos con su
  mirilla de aceite y su respiradero, pata de la carcasa y pata de la caja. A la carcasa se le quita la mitad de
  arriba de la tapa de succión (y de la boquilla de succión) para ver el impulsor;
- **el acople de espaciador** con su guarda (sin la mitad del lado del lector) y **el motor** con sus aletas, su caja de
  bornes y su placa de datos, sobre su pedestal en la base de acero con su bandeja de goteo, sobre un pedestal de
  concreto;
- **la descarga**: ampliación de 2″ a 3″, manómetro, válvula de retención, válvula de globo y la línea al destino.

Hay dos variantes: **succión inundada** (el tanque arriba del eje) y **succión con elevación** (`--lift`: la bomba sube
80 cm sobre un pedestal y el tanque queda abajo, con el tubo de succión entrando por arriba). La página escoge según
el signo de zₛ. La mueve el modelo del explorador:

- el impulsor gira 150 veces más despacio que el real (como en la pestaña «Por dentro»), con el diámetro del caso
  relativo al máximo de la carcasa;
- el líquido entra por la boquilla de succión, pasa al ojo, sale por los canales entre álabes, da la vuelta por la
  voluta y sube por la garganta, con el color de la presión estática de cada zona (`innerPressures` del explorador);
- burbujas en los bordes de ataque cuando el NPSH disponible no alcanza 1,3 × NPSH3, y muchas más bajo el NPSH3;
- los manómetros de succión, descarga y del tanque, el nivel del tanque en su vidrio (sin escala: la etiqueta da zₛ),
  el vástago de la válvula de regulación (sale más cuanto más abierta está) y los pernos del acople, que giran.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/bomba-{inundada,elevacion}.svg` y `.json`, `out/fig.js`, `out/fig.css` y `preview.html`. |
| `geo.mjs` | Medidas (`PB`), la espiral de la voluta (`rOut`), la lengüeta, las paredes y los canales en dos tramos (adelante y atrás del impulsor), y el álabe (`vaneOff`). Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FPump`: el impulsor, el líquido, las burbujas, los manómetros, el nivel, el vástago y el acople. |
| `pb.css` | Fundición, concreto, motor, vidrio y lo vivo. El tema blueprint va en el explorador. |
| `drive_test.js` | Punto de operación sintético para `preview.html` (`?cav=0…2`, `&q=`, `&lev=`, `&open=`, `&t=s`, `&snap=1`). |
| `splice.mjs` | Mete el código y los datos en el HTML publicado (marcadores `PBFIG_*`) y copia los SVG a `simulaciones/fig/bomba/`. |

```sh
node build.mjs --audit && node build.mjs --lift --audit   # medio minuto cada una; deben terminar en «audit passed»
node splice.mjs
```

Lo vivo se registra con la forma del volumen que ocupa. La pared de arriba de la voluta, el canal y la boquilla de
succión se parten por el plano que mira al lector (el tramo cercano va delante del líquido y del impulsor, el lejano
detrás), para que el orden de pintura no haga ciclos.
