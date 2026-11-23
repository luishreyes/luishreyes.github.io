# Condensador evaporativo en isométrico (skill `anatomy`)

Figura del capítulo 26 del libro de operaciones unitarias: el condensador evaporativo de amoníaco de una planta de
frío, de tiro inducido a contracorriente. Es una caja de lámina galvanizada sobre dos vigas y una losa de concreto, con
la chimenea del ventilador encima. Se le quitó el panel entero del costado largo que mira al lector, del fondo de la
bandeja al techo, así que se ven adentro, de abajo hacia arriba: la bandeja con el agua (cortada en el plano del panel,
translúcida) con la válvula de flotador de la reposición y el tubo de rebose; la entrada del aire, con las persianas de
los otros tres costados vistas por dentro; el haz de serpentines, muchos circuitos de tubo que bajan en zigzag entre el
cabezal de entrada del vapor, arriba, y el de salida del líquido, abajo, cada paso inclinado hacia donde corre, sobre dos
perfiles que lo cruzan por debajo; el distribuidor de agua con sus ramales y sus boquillas rociando, y los eliminadores
de gotas, un paquete de hojas en V con su perfil en la cara de adelante.

El extremo de +x queda entero: las persianas con la oscuridad de adentro detrás, la puerta de inspección, la placa de
datos y las conexiones. Arriba entra el vapor de amoníaco y abajo sale el líquido, con pendiente, cada línea con su
válvula de corte y terminada en un par de bridas. Al pie, la bomba de recirculación toma el agua de la bandeja por una
válvula y la sube por una tubería que entra por la pared al cabezal del distribuidor; de esa tubería sale la purga, con
su válvula, hacia un embudo sobre el desagüe, y al lado entra la línea del agua de reposición. Sobre el techo, la
chimenea con la malla (aro de pletina, alambres en círculos y radios), por la que se ven las seis aspas y el cubo del
ventilador axial, y por fuera el motor de eje vertical, con la correa en su guarda, que entra a la chimenea. Las flechas
blancas muestran el aire que entra por las persianas, sube por el haz y sale por la malla, y el agua que cae de las
boquillas. Va a escala real, en milímetros (`geo.mjs`), salvo las gotas y las flechas, que son un esquema.

Las medidas del caso y de qué fuente sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit        # algo más de un minuto (el orden, unos 45 s); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría (no deja el SVG en orden)
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
node libro.mjs --anclas       # imprime dónde cae cada ancla, para acomodar los rótulos
CE_ITEM="pieza" node build.mjs   # lista todo lo que se cruza con una pieza en pantalla (lento)
CE_PAIRS="pieza" node build.mjs  # los pares del orden de una pieza, con el área en que va delante cada una
CE_PER="x,y,rumbo" node build.mjs  # prueba otro lugar para la persona de referencia
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`), como el extractor. Lleva la persona de referencia de
1,75 m (`../persona.mjs`), siempre: el dibujo solo lo usa el libro (su lugar, en `CE.persona` de `geo.mjs`). Usa los
prismas de `../extractor-arrastre/xprism.mjs`.

Lo que atraviesa una pared no se dibuja adentro de ella: los tramos de los cabezales y del distribuidor llegan a la cara
de adentro y los de afuera arrancan en la cara de afuera. El haz es una sola pieza: sus 32 circuitos no se cruzan con
nada que vaya entre ellos, así que van juntos, de atrás hacia adelante, cada uno en un solo trazo por clase (los pasos
rectos y las curvas en U, sin tapas en las juntas), y se registra cada circuito como un tubo con su ruta. Para el orden
de pintura van partidas las piezas que abrazan a otras o que quedan a los dos lados de algo: cada ángulo de esquina en
sus dos alas, la chimenea en su mitad de atrás (la cara de adentro, que se ve por la boca) y la de adelante, la brida de
abajo de la chimenea en sus dos mitades, y el rebose y el flotador en lo que queda bajo el agua y lo que queda encima.
Las flechas del agua van en la misma pieza que el rocío de su boquilla. Los anillos de eje vertical (la brida de arriba
y el aro de la malla) se dibujan con `ring()`, con el hueco abierto, y se registran tal como son.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`CE`), los tubos y bridas (`DN`), la altura de cada paso del haz (`zs`, `ze`, `zPass`), la `y` de cada circuito y el área de afuera del haz (`areaHaz`). |
| `libro.mjs` | Escribe el `.qmd` del libro, con el SVG y los rótulos, y `out/libro-preview.html` y `out/libro-preview-620.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). |

## Qué escribe

`node libro.mjs` escribe `figuras/refrigeracion-y-congelacion/_condensador-evaporativo.qmd` en el libro (la vista y los
rótulos en español, con la persona y su rótulo), que el capítulo incluye con `{{< include … >}}` dentro de un bloque
`::: {#fig-…}`, con el pie debajo. Los colores salen de la paleta del libro (`estilo/paleta.json`, sección
`isometricas`) por `../paleta-libro.mjs`, con las clases `ce-*`: si cambia un color, `node ../paleta-libro.mjs` vuelve a
pintar la vista sin rehacer el dibujo.
