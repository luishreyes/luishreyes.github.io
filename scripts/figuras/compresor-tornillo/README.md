# Paquete del compresor de tornillo en isométrico (skill `anatomy`)

Figura del capítulo 26 del libro de operaciones unitarias: el paquete de un compresor de tornillo de amoníaco, como los
que se arman en fábrica para una planta de frío, sobre una base común de canales con su bandeja de lámina, encima de
una losa. Abajo, a lo largo de la base, el separador de aceite, un recipiente horizontal con cabezas elipsoidales sobre
dos sillas, con el visor de nivel al frente, la válvula de seguridad arriba, la placa de datos y, en la cabeza de +x, el
registro de los coalescedores con su tapa empernada. Encima del separador, sobre un bastidor de dos canales apoyado en
tres sillas, el tren motor: el motor eléctrico con su caja de conexiones y su placa, el acople de espaciador bajo su
guarda amarilla (sin la tapa que mira al lector) y el compresor de tornillo doble, con la caja del sello, la de la
succión, la carcasa de los rotores, la de la descarga, la tapa de los cojinetes y el cilindro de la válvula deslizante
con su indicador. A la carcasa se le quitó la mitad de arriba entre la caja de la succión y la de la descarga: se ven
los dos rotores helicoidales engranados, el macho de cuatro lóbulos y la hembra de seis canales, con la cara del corte
en el tono del corte.

La succión baja desde arriba por una línea con una flecha, pasa por la válvula de cierre y retención, de ángulo, con su
volante, y por el filtro de succión, con su tapa lateral, y entra a la carcasa por arriba. La descarga sale por debajo
del compresor y baja al separador; el gas sale por arriba del separador, sube, pasa por la retención y por la válvula
de cierre de globo, con su volante, y sigue hacia el condensador, con otra flecha. El aceite del fondo del separador lo
toma la bomba de aceite, con su motor, y lo sube al enfriador de aceite de termosifón, un casco vertical con sus
bonetes: el amoníaco líquido entra al bonete de abajo por una línea que baja por detrás del enfriador, y la mezcla sale
por arriba. Del enfriador, el aceite vuelve por el frente del separador, con una flecha, al filtro de aceite, con su
manómetro, y del filtro sube a la boquilla de inyección del compresor. En el extremo de +x, sobre un pedestal, el
tablero con cuatro manómetros, la pantalla del controlador, los botones y la parada de emergencia; frente a él, la
persona de 1,75 m. Toda la tubería es de acero, como pide el amoníaco. Va a escala real, en milímetros (`geo.mjs`),
salvo las flechas, que son un esquema.

El círculo de detalle (`--detalle`) muestra el compresor abierto, 3,4 veces más grande, con su propia cámara: el mismo
azimut y 50° de elevación en vez de 26°, para que se vean los dos rotores engranados por la carcasa abierta. Ahí, los
tubos que siguen fuera del círculo (el aceite que llega a la inyección y la descarga que baja) van como tramos rectos.

Las medidas del caso y de qué fuente sale cada pieza están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit             # unos 10 s (el orden, unos 5 s); debe terminar en «audit passed»
node build.mjs --detalle --audit   # un segundo; también «audit passed»
node build.mjs --fast              # sin orden ni audit: para mirar la geometría (no deja el SVG en orden)
node libro.mjs                     # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
node libro.mjs --anclas            # out/anclas.html: dónde cae cada ancla, para acomodar los rótulos
CT_ITEM="pieza" node build.mjs     # lista todo lo que se cruza con una pieza en pantalla, con el área de cada lado
CT_PER="x,y,rumbo" node build.mjs  # prueba otro lugar para la persona de referencia
CT_ELDET=45 node build.mjs --detalle   # prueba otra elevación para el detalle
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

El dibujo va en milímetros y el audit en centímetros (`cm()`), como el condensador evaporativo. Lleva la persona de
referencia de 1,75 m (`../persona.mjs`): el dibujo solo lo usa el libro (su lugar, en `CT.persona` de `geo.mjs`). Usa
los prismas de `../extractor-arrastre/xprism.mjs`.

Los rotores son una superficie helicoidal partida en cuadriláteros (`rotoresSvg`), pintados de atrás hacia adelante con
los tonos de la luz, con la silueta donde un cuadrilátero da a uno que no se ve y los pliegues entre lóbulo y círculo de
paso; el perfil de cada uno (`rMacho` y `rHembra` de `geo.mjs`) es un círculo de paso con lóbulos o canales de arco de
círculo. Para el orden de pintura van juntas en una pieza las que se abrazan: cada silla del separador o del bastidor
con la banda del recipiente que tiene encima o debajo (la de abajo antes de la banda, la de arriba después), y el piso
de la mitad del macho de la carcasa con los rotores. El separador va en bandas (`bandsOf`), partido en las sillas, y
cada banda lleva su tramo de la silueta (`sidesOf`); la de la cabeza de +x termina donde el enfriador ya la tapa. El aro
de cada volante va en dos mitades, partidas en sus siluetas, para que los rayos de atrás queden entre la mitad de atrás
y el cubo, y los de adelante entre el cubo y la mitad de adelante. Las flechas son como las del condensador
evaporativo: blancas con borde de tinta.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/fig_data.json` (cámara, puntos de los rótulos y el centro del detalle) y `preview.html`; con `--detalle`, `out/detalle.svg`, `out/detalle_data.json` y `out/preview-detalle.html`. |
| `geo.mjs` | Las medidas (`CT`), los tubos y bridas (`DN`), el perfil de los rotores (`rMacho`, `rHembra`, `semiLobulo`) y el desplazamiento por vuelta del macho (`desplazamiento`, una cuenta del dibujo). |
| `libro.mjs` | Escribe el `.qmd` del libro, con la vista entera, el círculo del detalle unido por una línea al círculo chico que marca de dónde sale, y los rótulos; y `out/libro-preview.html` y `out/libro-preview-620.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). |

## Qué escribe

`node libro.mjs` escribe `figuras/refrigeracion-y-congelacion/_compresor-tornillo.qmd` en el libro (la vista, el detalle
y los rótulos en español, con la persona y su rótulo), que el capítulo incluye con `{{< include … >}}` dentro de un
bloque `::: {#fig-…}`, con el pie debajo. Los colores salen de la paleta del libro (`estilo/paleta.json`, sección
`isometricas`) por `../paleta-libro.mjs`, con las clases `ct-*`: si cambia un color, `node ../paleta-libro.mjs` vuelve a
pintar la vista sin rehacer el dibujo.
