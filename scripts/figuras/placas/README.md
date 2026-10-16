# Intercambiador de placas con empaques en isométrico (skill `anatomy`)

Figura de la pestaña «Por dentro» del Explorador de intercambiadores (POU 2026-20) cuando el equipo es de placas.
El bastidor completo: la placa fija con sus cuatro boquillas bridadas y su placa de datos, la barra portadora arriba
y la barra guía abajo, la columna de apoyo con su base, la placa de presión colgada de su rodillo y los tornillos
tensores con arandelas y tuercas. El paquete va abierto por el plano vertical de su eje (se quita la mitad x > 0,
con los tornillos de ese lado): se ven las placas en corte, colgadas de la barra y apoyadas en la guía, y el
empaque arriba y abajo de cada canal.

Lo vivo sale del perfil del explorador (`profileAll`, una contracorriente con el UA·F de las placas de McCabe):

- cada canal del corte se pinta con la temperatura de su fluido a lo largo de la placa; el caliente entra arriba y
  baja, el frío entra abajo y sube, y se alternan canal por canal;
- puntos que corren por los canales tardando lo que tarda el líquido en recorrer la placa (L/u, acotado); con vapor,
  gotas de condensado en los canales del caliente;
- las etiquetas de las cuatro boquillas las pone la página.

Es un equipo tipo: dibuja 15 placas con la separación exagerada (5 cm en el dibujo contra 2 a 5 mm reales).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/placas.svg`, `out/placas.json`, `out/fig.js`, `out/fig.css` y `preview.html`. |
| `geo.mjs` | Medidas (`PX`), placas y canales. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FPlate`: los canales y los puntos. |
| `pl.css` | Placas en corte, empaques, bastidor y lo vivo. El tema blueprint va en el explorador. |
| `drive_test.js` | Perfil sintético para `preview.html` (`?steam=1`, `&t=s`, `&snap=1`). |

```sh
node build.mjs --audit                   # medio minuto; debe terminar en «audit passed»
node ../intercambiador/splice.mjs        # mete todas las figuras de intercambiadores en el explorador
```
