# Los cuatro impulsores de bomba en isométrico (skill `anatomy`)

Figura del capítulo 11 del libro de operaciones unitarias: los tres tipos de impulsor radial (cerrado, semiabierto y
abierto) y el de una bomba axial, dibujados como objetos sólidos, cada uno con su trozo de eje, su cubo, su chaveta y la
tuerca del impulsor. Los tres radiales comparten álabes, diámetro y cámara, así que al pasar de uno a otro solo cambian
las tapas; al cerrado se le quita un sector de la tapa delantera para ver los álabes, y al cubo, el cuarto de adelante
para ver el eje y la chaveta. El axial va dentro de la mitad de atrás de su carcasa, a otra escala. Junto a cada uno va
una mano de referencia (`manoEnBorde` de `../persona.mjs`). Todo va a escala real, en milímetros (`geo.mjs`), con el
ojo arriba y el eje abajo.

Las medidas del caso y de qué fuente y página sale cada proporción están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                  # los cuatro, unos 4 minutos; cada uno debe terminar en «audit passed»
node build.mjs --imp=cerrado --audit    # uno solo (cerrado, semiabierto, abierto, axial; o varios con comas)
node build.mjs --fast                   # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                          # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/11/pump-impellers.svg (por defecto)
```

El orden del cerrado toma unos dos minutos; el del axial, uno; el de los otros dos, de unos segundos a medio minuto.
`IB_STEP=0.5` hace la rejilla del orden más gruesa (cuatro veces más rápido, para ensayar). Para depurar sin correr
todo: `IB_ITEM="pieza" node build.mjs --imp=…` lista todo lo que se cruza con una pieza en pantalla y quién va delante;
`IB_PIX="x,y"` dice qué formas corta el rayo de ese punto de la pantalla; `IB_ANCLAS=1` dice qué tapa cada ancla de los
rótulos; `IB_DROP=1` explica las reglas de orden que se soltaron.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit de los cuatro. Escribe `out/{impulsor}.svg`, `out/{impulsor}.json` (cámara y puntos de los rótulos), `out/fig.css` y `preview.html` (los cuatro sin rótulos). |
| `geo.mjs` | Las medidas de cada impulsor. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los de `impulsores/`). |
| `rotulos.mjs` | Los nombres de los impulsores y de sus piezas: `ROTULOS` (español, `[ancla, lado, texto]`), `ROTULOS_EN` (inglés, por ancla), `IMPULSORES` (los nombres de los botones en los dos idiomas) y `DESCRIPCION` (lo que lee un lector de pantalla en cada vista). |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html`; con `--lamina`, la lámina de la edición en inglés. |

## Qué escribe

`node libro.mjs` escribe `figuras/bombas/_impulsores.qmd` en el libro: las cuatro vistas con sus rótulos, todas con la
misma caja, y cuatro botones que muestran una a la vez (radios con CSS, sin JavaScript, bajo `.ibo-sel`). El capítulo
la incluye con `{{< include … >}}` dentro de un bloque `::: {#fig-…}`. Con `--lamina` escribe la lámina de la edición en
inglés, `en/figuras/11/pump-impellers.svg`: los cuatro en una rejilla de 2 × 2, con su nombre debajo y sin rótulos,
428 pt de ancho; `node herramientas/svg-a-pdf.mjs` la pasa a PDF desde `en/`. Los colores salen de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node ../paleta-libro.mjs`
vuelve a pintar las vistas sin rehacer el dibujo.
