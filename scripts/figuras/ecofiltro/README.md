# El ecofiltro en isométrico (skill `anatomy`)

Figura de la pestaña «Por dentro» del Explorador del ecofiltro (POU 2026-20): el biopercolador E-101 de la Central
Hidroeléctrica El Paraíso con su tren de gas y su lazo de riego. La torre va abierta por el plano vertical de su eje
que mira al lector: se ven la entrada de gas que descarga hacia abajo, el fondo con el líquido de riego, las vigas y
la parrilla de soporte, los 6 m de empaque estructurado en doce capas (cada una girada 90° respecto a la de abajo), la
rejilla de sujeción, el cabezal de aspersores con sus ramales y el eliminador de niebla. Afuera van el demister D-101,
los ventiladores V-101 A (con la mitad de arriba de la tapa de adelante quitada, para ver el rotor) y B (de respaldo,
con su compuerta cerrada), los colectores de succión y de descarga, el D-102 sobre la salida, el sello hidráulico del
fondo, el TK-103 con la bomba sumergible PS-101, la compuerta, la retención y el rotámetro de la subida, la válvula de
control de la reposición, la purga y los analizadores de H₂S a la entrada y a la salida.

Lo mueve el modelo del explorador (`figState` en la página le pasa a `FEco.update` el caso de cada cuadro):

- el perfil de H₂S del lecho en 24 tramos: cada molécula que sube sobrevive un tramo con la probabilidad
  C_G(h + dh)/C_G(h); las que no, pasan a la película (se vuelven verdes y se apagan);
- el consumo de cada capa frente al de la operación de referencia, que tiñe de verde la cara del empaque;
- el riego: cuántas gotas caen, cuántos aspersores mojan (la fracción mojada) y la altura del flotador del rotámetro;
- la reposición, que abre la válvula de control; el pH de la purga, que da el color del fondo y la pantalla del
  TK-103; la frecuencia del variador, que hace girar el rotor del V-101 A en cámara lenta, y las lecturas de los
  analizadores.

El gas corre ocho veces más rápido que el real; el riego y el rotor, en cámara lenta. En pausa o con movimiento
reducido todo queda quieto en su valor.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, interior sombreado del corte, orden de pintura (`A.settle`) y audit. Escribe `eco_data.json`, `out/`, `preview.html` y `preview_static.html` (sin animación, para `lines.mjs`); ninguno se versiona. |
| `geo.mjs` | Medidas (`FX`), los contornos de la torre en el plano de corte y la voluta del ventilador. Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FEco`: lo vivo dentro del explorador (gas, gotas, conos, fondo, biopelícula, rotor, rotámetro, válvula y pantallas). |
| `drive_test.js` | Caso fijo para `preview.html` (`?f=45&wet=1&t=s`). |
| `ec.css` | Corte, concreto, empaque, malla, vidrio, ventana del ventilador, pantallas y lo vivo. El tema blueprint va en el explorador. |
| `splice.mjs` | Reinserta `out/` en el HTML publicado, entre los marcadores `ECO_*_START/END`. |

```sh
node build.mjs --audit     # settle + audit; debe terminar en «audit passed»
node build.mjs --fast      # sin ordenar ni auditar, para mirar la geometría
node build.mjs --js        # solo el código en vivo, el CSS y la vista previa (necesita un build previo)
node splice.mjs            # mete la figura nueva en public/.../Explorador_Ecofiltro.html
```
