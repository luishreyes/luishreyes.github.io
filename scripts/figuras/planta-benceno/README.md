# Sección de reacción de la planta de benceno en isométrico (skill `anatomy`)

Figuras del capítulo 2 del libro de operaciones unitarias, Los diagramas de ingeniería. La planta es la de
hidrodesalquilación de tolueno a benceno del capítulo 1 de Turton, con el balance del libro; aquí va solo la
sección de reacción: el horno H-101 con su chimenea, el precalentador E-101, el reactor R-101 sobre su faldón
con la plataforma de la cabeza y la escalera de jaula, el rack de tuberías con seis pórticos, el enfriador
E-102, el separador de alta V-102 con su válvula de seguridad a la tea y su válvula de nivel, y los
compresores de reciclo C-101 A/B con sus motores.

La disposición es la disposición en línea con el rack al centro (Turton, sec. 1.5): lo caliente al norte y lo
frío al sur, con las distancias mínimas de su tabla 1.11. El separador sale del dimensionamiento del libro
(1,2 m × 3,4 m); el resto de las medidas son de diseño preliminar.

El isométrico es verdadero (acimut de 135°, elevación de 35,26°): los tres ejes se acortan igual. Del mismo
modelo salen cuatro vistas, para que el lector compare cómo se dibuja una misma planta:

| Parcial del libro | Vista |
|---|---|
| `_planta-iso.qmd` | El isométrico del skill, con el nombre de cada equipo. |
| `_planta-planta.qmd` | La vista en planta (*plot plan*): pórticos A a F, rack, coordenadas de cada equipo, cotas y norte. |
| `_planta-elevacion.qmd` | La elevación mirando al norte, con las elevaciones principales. |
| `_iso-tuberia.qmd` | El isométrico de tubería de la línea 9 (de R-101 a la coraza de E-102), no a escala, con cotas en mm. |

| Archivo | Qué es |
|---|---|
| `geo.mjs` | Medidas (`PB`): ubicación de cada equipo, el rack y sus carriles. Las comparten las cuatro vistas. |
| `build.mjs` | Geometría, tuberías (`ROUTES`), orden de pintura (`A.settle`) y audit. Escribe `out/`, `preview.html` y `planta_data.json`. |
| `xprism.mjs` | Prismas de sección cóncava (el mismo de las otras figuras). |
| `libro.mjs` | Las cuatro vistas, escritas en `figuras/los-diagramas-de-ingenieria/` del libro. |

```sh
node build.mjs --audit               # settle + audit (unos 10 s); debe terminar en «audit passed»
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html
node libro.mjs                       # escribe las vistas en ../../../../libro-operaciones-unitarias/libro
node libro.mjs --salida RUTA/libro   # si el libro está en otra parte
```

`node build.mjs` sin `--audit` solo ordena y escribe; `--fast` se salta también el orden, para mirar la geometría.

Las vistas de planta, de elevación y de tubería son dibujos de línea con las clases `svg.dg` del libro
(`estilo/libro.scss`), y el isométrico usa `estilo/anatomia.css`. Si se mueve un equipo en `geo.mjs`, las
cuatro vistas se mueven con él; los rótulos del isométrico y de las vistas están puestos a mano en
`libro.mjs` y hay que revisarlos.
