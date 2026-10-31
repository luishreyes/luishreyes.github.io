# Los cuatro impulsores de bomba en isométrico (skill `anatomy`)

Figura del capítulo 11 del libro de operaciones unitarias (Bombas), donde el texto cuenta las piezas de la centrífuga:
los tres tipos de impulsor radial, cerrado, semiabierto y abierto, y el de una bomba axial, dibujados como objetos
sólidos, cada uno con su trozo de eje, su cubo, su chaveta y la tuerca del impulsor. Todo va a escala real, en
milímetros (`geo.mjs`), con el ojo (la entrada) arriba y el eje abajo.

- **Los tres radiales** tienen las medidas del impulsor del caso del capítulo, el de la 2×3‑8: 190 mm de diámetro (la carcasa admite
  203), seis álabes curvados hacia atrás que salen a 27°, ojo de 80 mm y 9,31 mm de ancho a la salida. Van con los
  mismos álabes, el mismo diámetro y la misma cámara: al pasar de uno a otro en el libro solo cambian las tapas. Se
  miran desde 45° para ver el ojo por dentro.
- **El axial** es el de una bomba de hélice pequeña, de 300 mm, dentro de la mitad de atrás de su carcasa, a otra
  escala. Se mira desde 30°.

Las proporciones que dan las fuentes del capítulo o el caso van con su página; las demás son **medida del libro**:
típicas de un impulsor así, escogidas para la figura. De `fuentes/` no se copió nada: se leyeron las páginas y se
tomaron los números.

## Cada impulsor

- **Cerrado** (`cerrado`): los álabes van entre la tapa trasera y la tapa delantera; el ojo está en la delantera, con
  un anillo de desgaste sobre su cuello, y la trasera lleva un agujero de balance por canal (Gülich, p. 40: el sello
  anular entre el impulsor y la carcasa, y los «axial thrust balance holes» de la tapa trasera; p. 41, «closed
  impellers»). A la tapa delantera se le quita un sector de ±55° frente al lector, de r = 62 mm hacia afuera, para ver
  los álabes; el ojo queda entero. Las caras del corte van con el tono plano del corte. El anillo de desgaste es de
  bronce (`ib-ring`, el cobre de la paleta). Medida del libro: la tapa delantera de 4 mm, casi plana de la salida a
  r = 60 mm (de 9,31 a 13 mm sobre la trasera) y con una curva elíptica que sube hasta el cuello del ojo (z = 30 a
  42 mm); el anillo de 3,5 × 10 mm; los agujeros de 7 mm en r = 35,5 mm.
- **Semiabierto** (`semiabierto`): los mismos álabes sobre la tapa trasera, sin tapa delantera (Gülich, p. 40: «in some
  applications the front shroud is omitted»). El borde libre de cada álabe sigue la curva que tendría la tapa: es el
  que pasa junto a la carcasa.
- **Abierto** (`abierto`): los mismos álabes casi sin tapas. Gülich llama abiertos a los que tienen «large cut-outs in
  the rear shroud» (p. 41) y en su Tabla 2.1 (p. 42) los dibuja casi solo con el cubo. Aquí queda un disco hasta
  r = 44 mm entre álabes, con un nervio corto bajo cada álabe hasta r = 57 mm (medida del libro); de ahí afuera los
  álabes van libres, y por debajo se ven el cubo de atrás y el eje.
- **Axial** (`axial`): un cubo de la mitad del diámetro, cuatro álabes torcidos de perfil delgado y la carcasa a
  0,6 mm de las puntas. Sale de Gülich para nq = 200, en el medio de las axiales (180 a 300, p. 379):
  - relación de cubo ν = dn/d2 ≈ 0,5 (Fig. 7.24 y 7.25, p. 384);
  - cuatro álabes (Tabla D7.3, p. 384: zLa = 4 entre nq 160 y 230);
  - solidez en la punta L/t = 0,7 (ec. 7.5.14, p. 396) y cuerda en el cubo de 0,8 la de la punta (Li/La = 0,7 a 0,9,
    p. 396): 165 y 132 mm;
  - holgura en la punta ΔD/d2 = 0,004 (p. 396): 1,2 mm en el diámetro, 0,6 mm por lado;
  - álabes de perfil delgado, fundidos con el cubo en las bombas pequeñas y medianas (p. 379);
  - ángulos de vórtice libre (cu·r constante, Tabla 7.3, p. 381) con φ = 0,22 y ψ = 0,25 (Fig. 7.25, p. 384) y
    ηh = 0,88 (el ejemplo de la p. 379), más 2° de incidencia y 5° a 2° de desviación (medida del libro): el álabe va
    a 38° del plano de giro junto al cubo y a 15° en la punta, con una curvatura de 5,5 % de la cuerda en el cubo y
    0,4 % en la punta.

  Medida del libro: el diámetro de 300 mm (0,15 m³/s y 6 m a 1450 r/min), el espesor con la forma de un perfil NACA
  de cuatro cifras, de 10 % de la cuerda en el cubo a 6 % en la punta (Gülich muestra perfiles de 9 y 15 %, p. 399),
  el cubo de 104 mm de largo, el cono de entrada de 82 mm, el eje de 50 mm con punta M36, y la carcasa de fundición de
  12 mm con sus bridas de 410 mm y doce agujeros. Al cono se le quita el cuarto que mira al lector para ver la arandela
  y la tuerca; de la carcasa se ve la mitad de atrás, partida por el plano del eje que mira al lector.

**Lo que comparten los tres radiales** (medida del libro, salvo lo que se dice): álabes de 4 mm (Gülich, p. 347:
e/d2 = 0,016 a 0,022, y de 3 a 5 mm si son fundidos), que se afinan a 1,4 mm en los primeros 7 mm del borde de
ataque; el borde de ataque inclinado, de r = 31 mm en la tapa trasera a r = 41 mm en la delantera; el ángulo del
álabe de 18° a la entrada (el de la figura de la instalación, `bomba/geo.mjs`) a 27° a la salida (el del caso), que da
unos 155° de envolvimiento; la tapa trasera de 5 mm; el eje de 24 mm con chaveta de 8 × 7 (la de un eje de 22 a
30 mm), punta roscada M16, arandela y tuerca M16 de 24 mm entre caras. Al cubo se le quita el cuarto que mira al
lector (±45°) para ver el eje y la chaveta, que no se cortan; en el cerrado casi no se ve, porque lo tapa el cuello
del ojo.

## Cómo está armado

- **Los álabes radiales** se recorren con (m, t): m va del borde de ataque a la salida y t de la tapa trasera a la
  delantera, y cada punto está entre el de la trasera y el de la delantera a la misma m, así la altura sigue la tapa
  sin quiebres. Se dibujan en triángulos (las dos caras, el canto de arriba y los dos bordes) con las normales por
  diferencias centradas, y se pintan por grupos: el lado que menos se ve, el otro, los bordes y el canto. Las aristas
  llevan el tono según sus dos caras: contorno si se ve una, arista suave si se ven las dos.
- **El orden de pintura** se resuelve partiendo las piezas por el plano del eje que mira al lector: en la mitad de
  adelante lo de afuera tapa lo de adentro y en la de atrás al revés, así ninguna pareja queda trabada. En el cerrado
  los álabes se parten además por los planos del sector quitado, por r = 62 mm (el borde del corte) y por r = 44 mm
  (el cuello del ojo), y la tapa delantera va en cinco piezas: el anillo del ojo adelante, las dos de afuera a los
  lados del sector, el cuello de atrás y el resto de atrás.
- **Las piezas de revolución con un sector quitado** (la tapa delantera, el cubo, el anillo de desgaste, el cono y la
  carcasa) salen de `revPiece`: una sección (r, z) cerrada, el ángulo que ocupa la pieza y, por lado, si es superficie,
  cara del corte o costura con otra pieza. Las superficies llevan tonos suaves, la silueta donde se voltean y las
  aristas de sus vértices; para el audit se registran como cuerpos de revolución sin los ángulos de las otras piezas.
- **Los álabes del axial** se dibujan como las palas torcidas de `impulsores/` (secciones sobre cilindros, en dos piezas
  partidas por el plano que mira al lector), con espesor de perfil NACA y la tapa de la punta, que muestra el perfil.
  Sus líneas van sobre las caras de verdad (los pliegues de la cara de arriba y de la de abajo, los bordes, la raíz y
  la punta) y se dibujan encima de la pieza, menos los tramos que la misma pala tapa (`visibles`).
- **Las anclas de los rótulos** que dependen de la vista (el agujero de balance, los bordes del álabe, la tapa
  recortada, el cubo del axial) se escogen entre candidatos: la primera que no tapa otra pieza.

**El audit en unidades más grandes.** El dibujo va en milímetros; `sc()` pasa cada forma a unidades de 2,5 mm en los
radiales (U = 0,4) y de 5 mm en el axial (U = 0,2), y el audit recibe la misma cámara con la escala por 1/U.

**Peso.** Los cuatro SVG van en línea en la página del libro, con los trazos en coordenadas relativas en décimas
(`compact`) y los colores en clases (`ib-*`), que `libro.mjs` pone una sola vez en el `<style>` del selector.

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit de los cuatro. Escribe `out/{impulsor}.svg`, `out/{impulsor}.json` (cámara y puntos de los rótulos), `out/fig.css` y `preview.html` (los cuatro sin rótulos). |
| `geo.mjs` | Las medidas de cada impulsor, con la fuente de cada proporción. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los de `impulsores/`). |
| `rotulos.mjs` | Los nombres de los impulsores y de sus piezas: `ROTULOS` (español, `[ancla, lado, texto]`), `ROTULOS_EN` (inglés, por ancla), `IMPULSORES` (los nombres de los botones en los dos idiomas) y `DESCRIPCION` (lo que lee un lector de pantalla en cada vista). |
| `libro.mjs` | Escribe `figuras/bombas/_impulsores.qmd` en el repositorio del libro y `out/libro-preview.html`; con `--lamina`, la lámina de la edición en inglés. |

```sh
node build.mjs --audit                  # los cuatro, unos 4 minutos; cada uno debe terminar en «audit passed»
node build.mjs --imp=cerrado --audit    # uno solo (cerrado, semiabierto, abierto, axial; o varios con comas)
node build.mjs --fast                   # sin orden ni audit, en un segundo: para mirar la geometría
node libro.mjs                          # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
CHROME_PATH=/opt/pw-browsers/chromium node libro.mjs --lamina   # en/figuras/11/pump-impellers.svg (por defecto)
```

El orden del cerrado toma unos dos minutos; el del axial, uno; el de los otros dos, de unos segundos a medio minuto. `IB_STEP=0.5` hace la
rejilla del orden más gruesa (cuatro veces más rápido, para ensayar).

Para depurar sin correr todo: `IB_ITEM="pieza" node build.mjs --imp=…` lista todo lo que se cruza con una pieza en
pantalla y quién va delante; `IB_PIX="x,y"` dice qué formas corta el rayo de ese punto de la pantalla; `IB_ANCLAS=1`
dice qué tapa cada ancla de los rótulos; `IB_DROP=1` explica las reglas de orden que se soltaron.

## En el libro

En el capítulo se incluye con `{{< include figuras/bombas/_impulsores.qmd >}}` dentro de un bloque
`::: {#fig-…}`, como `figuras/agitacion/_impulsores.qmd` en el capítulo 14. El archivo trae las cuatro vistas, todas
con la misma caja (así el selector no mueve la página), y cuatro botones en el orden Cerrado, Semiabierto, Abierto y
Axial. Son radios con CSS, sin JavaScript (todo bajo `.ibo-sel`): cada botón es la etiqueta de su radio, el escogido
va con el amarillo como campo y las flechas del teclado pasan de uno a otro. El CSS de las piezas es el de siempre
(`estilo/anatomia.css`).

**La lámina impresa** (`--lamina`): los cuatro en una rejilla de 2 × 2, con su nombre en inglés debajo (Archivo de
7,5 pt) y sin rótulos, 428 pt de ancho. Los tres radiales van a una escala y el axial a otra, a la misma altura.
Después, `node herramientas/svg-a-pdf.mjs figuras/11/pump-impellers.svg` desde `en/` la pasa a PDF.

**Colores en el libro.** La vista del libro no lleva los tonos del dibujo sino los de la paleta del libro
(`estilo/paleta.json`, sección `isometricas`): `libro.mjs` la pasa por `../paleta-libro.mjs`. `ib-ss` (el impulsor)
es acero; `ib-sh` (el eje), pintado; `ib-hw` (tuerca, arandela, chaveta), fundición; `ib-ring` (el anillo de
desgaste), cobre; `ib-cast` (la carcasa del axial), fundición; `ib-cut` y `ib-cut-c`, el corte del acero y el de la
fundición; los agujeros, hueco. Si cambia un color de `paleta.json`, `node ../paleta-libro.mjs` vuelve a pintar la
vista sin rehacer el dibujo.
