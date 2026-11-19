# Sección de reacción de la planta de benceno en isométrico (skill `anatomy`)

Figuras del capítulo 2 del libro de operaciones unitarias: la sección de reacción de la planta de hidrodesalquilación
de tolueno a benceno de Turton, como se construye. Se ven el horno con su chimenea, el precalentador, el reactor sobre
su faldón con la plataforma de la cabeza y la escalera de jaula, el rack de tuberías con sus pórticos, el enfriador, el
separador de alta presión con su válvula de seguridad y su válvula de nivel, los compresores de reciclo con sus motores
y las líneas de proceso que van de un equipo a otro por el rack. El isométrico es verdadero (acimut de 135°, elevación
de 35,26°): los tres ejes se acortan igual.

Del mismo modelo salen cuatro vistas, para que el lector compare cómo se dibuja una misma planta:

| Parcial del libro | Vista |
|---|---|
| `_planta-iso.qmd` | El isométrico del skill, con el nombre de cada equipo. |
| `_planta-planta.qmd` | La vista en planta (*plot plan*): pórticos, rack, coordenadas de cada equipo, cotas y norte. |
| `_planta-elevacion.qmd` | La elevación mirando al norte, con las elevaciones principales. |
| `_iso-tuberia.qmd` | El isométrico de tubería de una línea de proceso, no a escala, con cotas en mm. |

La disposición, las distancias y las medidas de cada equipo, con su fuente, están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit               # settle + audit (unos 10 s); debe terminar en «audit passed»
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html
node libro.mjs                       # escribe las vistas en ../../../../libro-operaciones-unitarias/libro
node libro.mjs --salida RUTA/libro   # si el libro está en otra parte
```

`node build.mjs` sin `--audit` solo ordena y escribe; `--fast` se salta también el orden, para mirar la geometría.

| Archivo | Qué es |
|---|---|
| `geo.mjs` | Medidas (`PB`): ubicación de cada equipo, el rack y sus carriles. Las comparten las cuatro vistas. |
| `build.mjs` | Geometría, tuberías (`ROUTES`), orden de pintura (`A.settle`) y audit. Escribe `out/`, `preview.html` y `planta_data.json`. |
| `xprism.mjs` | Prismas de sección cóncava (el mismo de las otras figuras). |
| `libro.mjs` | Las cuatro vistas, escritas en `figuras/los-diagramas-de-ingenieria/` del libro. |

## Qué escribe

`node libro.mjs` escribe las cuatro vistas en `figuras/los-diagramas-de-ingenieria/` del libro. Las de planta, de
elevación y de tubería son dibujos de línea con las clases `svg.dg` del libro (`estilo/libro.scss`), y el isométrico
usa `estilo/anatomia.css`. Si se mueve un equipo en `geo.mjs`, las cuatro vistas se mueven con él; los rótulos del
isométrico y de las vistas están puestos a mano en `libro.mjs` y hay que revisarlos. Los colores del isométrico salen
de la paleta del libro (`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`, que le pone las clases
`mat-*` por el nombre de la pieza: si cambia un color, `node ../paleta-libro.mjs` vuelve a pintar las vistas sin
rehacer el dibujo.

El isométrico lleva la persona de referencia de 1,75 m (`../persona.mjs`; su lugar, en `PB.persona` de `geo.mjs`),
que `build.mjs` pone siempre y `libro.mjs` rotula; las otras tres vistas no la llevan. La persona y su rótulo llevan la
clase `solo-es`, y la vista trae la regla `#impresion .solo-es{display:none}`: la lámina de la edición en inglés, que
se toma de la página del libro web dentro de `#impresion`, sale sin ella.
