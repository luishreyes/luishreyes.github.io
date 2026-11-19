# Los siete impulsores en isométrico (skill `anatomy`)

Figura del capítulo 14 del libro de operaciones unitarias: siete impulsores de agitación dibujados como objetos
sólidos (la hélice marina, la turbina de palas inclinadas, el hidrofoil, la turbina Rushton, la paleta, el ancla y la
cinta helicoidal doble), cada uno con su trozo de eje, su cubo, su chaveta, sus prisioneros y sus pernos. Las cinco
turbinas van con el mismo diámetro y la misma cámara, para que se comparen; el ancla y la cinta, dentro de la mitad de
atrás de su tanque. Junto a cada uno va una mano de referencia (`manoEnBorde` de `../persona.mjs`). Todo va a escala
real, en milímetros (`geo.mjs`).

Las medidas del caso y de qué fuente y página sale cada proporción están en el repositorio del libro, en
`notas/figuras-isometricas.md`.

## Cómo se arma

```sh
node build.mjs --audit                 # los siete, unos 3 minutos; cada uno debe terminar en «audit passed»
node build.mjs --imp=rushton --audit   # uno solo (helice, pbt, hidrofoil, rushton, paleta, ancla, cinta; o varios con comas)
node build.mjs --fast                  # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                         # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/14/impellers.svg (por defecto)
```

El orden de las turbinas toma unos segundos cada una; el del ancla y el de la cinta, unos 40 s, por el tanque. Para
depurar el orden sin correr todo: `IM_ITEM="pieza" node build.mjs --imp=…` lista todo lo que se cruza con una pieza en
pantalla, quién va delante y dónde; `IM_DROP=1` dice qué reglas de orden se soltaron y el lazo que las obligó;
`IM_PIX="x,y"` dice qué formas corta el rayo de ese punto de la pantalla, y con `IM_SCAN="a,b"` e
`IM_PIX="x0,y0,x1,y1"` recorre una zona buscando dónde va `a` delante de `b`. `IM_STEP=0.5` hace la rejilla del orden
más gruesa (más rápido, menos fino).

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit de los siete. Escribe `out/{impulsor}.svg`, `out/{impulsor}.json` (cámara y puntos de los rótulos), `out/fig.css` y `preview.html` (los siete sin rótulos). |
| `geo.mjs` | Las medidas de cada impulsor y del tanque. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los de las otras figuras, con la opción `seams`). |
| `rotulos.mjs` | Los nombres de los impulsores y de sus piezas: `ROTULOS` (español, `[ancla, lado, texto]`), `ROTULOS_EN` (inglés, por ancla), `IMPULSORES` (los nombres de los botones en los dos idiomas) y `DESCRIPCION` (lo que lee un lector de pantalla en cada vista). |
| `libro.mjs` | Escribe el `.qmd` del libro y `out/libro-preview.html`; con `--lamina`, la lámina de la edición en inglés. |

## Qué escribe

`node libro.mjs` escribe `figuras/agitacion/_impulsores.qmd` en el libro: las siete vistas con sus rótulos y siete
botones que muestran una a la vez (radios con CSS, sin JavaScript). El capítulo la incluye con `{{< include … >}}`
dentro de un bloque `::: {#fig-…}`. Con `--lamina` escribe la lámina de la edición en inglés,
`en/figuras/14/impellers.svg`: los siete en una rejilla de 4 + 3, con su nombre debajo y sin rótulos, 428 pt de ancho;
`node herramientas/svg-a-pdf.mjs` la pasa a PDF desde `en/`. Los colores salen de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`) por `../paleta-libro.mjs`: si cambia un color, `node ../paleta-libro.mjs`
vuelve a pintar las vistas sin rehacer el dibujo.
