# Florentino en isométrico (skill `anatomy`)

Figura del capítulo 17 del libro de operaciones unitarias (Sedimentación y decantación): el florentino de la planta de
aceite esencial de cáscara de cítricos, que separa el condensado del arrastre de vapor (agua con un 1,3 % de aceite,
casi todo d-limoneno, más liviano que el agua) en aceite y agua. Es el diseño del capítulo con la regla de Towler y
Sinnott y la forma del vaso florentino de Başer y Buchbauer: un cilindro cerrado, la entrada por un tubo central que
baja hasta cerca de media altura, el aceite arriba y una pierna exterior que toma el agua del fondo y sube por fuera.
Todo va a escala real, en milímetros (`geo.mjs`), con las alturas medidas desde la cara de adentro del fondo:

- **el recipiente**: acero inoxidable, diámetro interior de 550 mm, pared de 3 mm, fondo plano de 8 mm (sobresale
  12 mm de la envolvente, con el agujero del drenaje en el centro) y 1140 mm del fondo a la tapa: la altura de diseño
  H = 2D = 1100 mm más 40 mm, así quedan unos 150 mm de espacio de cabeza sobre el rebose del aceite. Arriba, una brida
  soldada de 16 mm y la tapa plana de 12 mm, con la empaquetadura y 16 pernos (se ven las tuercas de la mitad de atrás
  y, en la franja de la derecha, dos cabezas bajo la brida). El fondo queda a 420 mm del piso, sobre tres patas;
- **las tres capas**: el agua (el hidrolato) del fondo a la interfase, a z₃ = 890 mm; la capa de aceite, de 100 mm,
  entre la interfase y el rebose del aceite, a z₁ = 990 mm; y el espacio de cabeza encima. El agua va un poco turbia y
  el aceite ámbar claro, los dos translúcidos: se dibujan en sus caras (la del corte, la interfase y la superficie del
  aceite, vistas desde arriba) y se ve a través de ellos lo que hay detrás;
- **la entrada**: el condensado llega por un tubo DN 32 desde el condensador (brida a la izquierda, codo y tramo
  vertical) y entra por una brida ciega al tubo de calma DN 80, que atraviesa la tapa y baja hasta 500 mm del fondo,
  bajo la interfase. Debajo de su boca, a 60 mm, un deflector de Ø 200 × 6 mm colgado de dos pletinas (la tercera se
  fue con el corte) abre el chorro hacia los lados sin revolver la capa de aceite. En lo alto del tubo, en el espacio
  de cabeza, dos agujeros de 12 mm igualan la presión;
- **dentro del tubo de calma** solo hay agua del condensado que baja, y su columna equilibra la de afuera (890 mm de
  agua y 100 de aceite): su nivel queda unos 15 mm bajo el rebose del aceite, a la altura del codo de la pierna;
- **las gotas**: en la cara del corte del agua, gotas de aceite que suben, más grandes y más juntas hacia la interfase
  (la banda de dispersión), y algunas que bajan con el condensado dentro del tubo. Van dibujadas de 5 a 13 mm, mucho
  más grandes que las reales (unos 150 µm), para que se vean;
- **el rebose del aceite**: una boquilla DN 40 a la izquierda con el fondo del agujero a z₁, que se ve por dentro en la
  pared de atrás justo sobre la superficie del aceite; afuera, su brida, una válvula de bola abierta y un carrete con
  la brida de la línea que va al recibo del aceite;
- **la purga de la interfase**: una boquilla DN 15 a la izquierda, a la altura de la interfase (se ve su agujero por
  dentro sobre la línea entre las capas), con su válvula de bola cerrada; por ahí se saca la capa sucia;
- **la pierna del agua (cuello de cisne)**: el agua sale por una boquilla DN 32 a 50 mm del fondo, en la franja de la
  derecha, con su par de bridas; baja, da la vuelta en U y sube por fuera hasta una te cuyo paso de afuera tiene el
  fondo por dentro a z₂ = 975 mm, 15 mm bajo el rebose del aceite: es lo que fija la interfase. Sobre el codo de la U,
  el tramo ajustable: un manguito con prensaestopas en el que se desliza el tubo de arriba, para subir o bajar la te y
  corregir la interfase. De la te, el hidrolato va hacia afuera y baja a una te con dos válvulas de bola: hacia afuera,
  abierta, a la caldera (la cohobación); hacia abajo, cerrada, al desagüe;
- **el rompe-sifón**: del paso de arriba de la te sube un tubo DN 25, con una unión para desmontarlo, que dobla y entra
  al espacio de cabeza por una boquilla de la envolvente. Así la te queda a la presión del recipiente y la pierna no
  puede vaciarlo por sifón;
- **la mirilla**: un tubo de vidrio de Ø 18 mm entre dos llaves en la franja de la derecha, una en el agua (a 780 mm)
  y otra en el aceite (a 960 mm). Adentro se ve el agua abajo y el aceite arriba, con la interfase a la misma altura
  que en el recipiente;
- **el venteo**: en la tapa, un cuello DN 25 con su par de bridas y un tubo que sube y dobla hacia abajo, con una malla
  en la punta. El limoneno es inflamable: en Bogotá, a 35 °C, el espacio de cabeza saturado tiene 0,66 % de limoneno
  contra un límite inferior de 0,7 %;
- **la puesta a tierra**: una oreja soldada a la envolvente cerca del fondo, con su perno y el terminal del cable verde
  y amarillo que baja a la varilla de cobre con su abrazadera (el limoneno acumula carga estática al fluir);
- **abajo**: el drenaje DN 25 del centro del fondo, con su válvula de bola cerrada, y tres patas de tubo de 2 in con su
  placa de asiento bajo el fondo y la placa de anclaje con sus cuatro pernos;
- **las flechas**: en un plano justo detrás del corte, el condensado baja por el tubo de calma, el deflector lo abre
  hacia los lados, el agua baja hacia la salida de la pierna y las gotas suben (en azul el agua, en ámbar el aceite);
  en la capa de aceite, el aceite va hacia el rebose.

## El corte

El corte quita lo que mira al lector por encima del fondo (y > 0, z > 420 mm), como en el tanque agitado y el filtro de
arena: el fondo plano queda entero y la envolvente, la brida, la tapa, el tubo de calma con su brida y el deflector se
ven cortados por el plano y = 0. La pierna, la mirilla, el rompe-sifón, el venteo y los tubos van por fuera y se ven
enteros. La brida ciega de la entrada va entera sobre la brida cortada del tubo de calma, como la de la entrada del
filtro de arena.

## Qué sale de dónde

| Dato | Fuente |
|---|---|
| Diámetro interior de 0,55 m, H = 2D = 1,10 m, la interfase a z₃ = 890 mm, el rebose del aceite a z₁ = 990 mm y el codo de la pierna a z₂ = 975 mm (15 mm bajo el rebose), con 1600 L/h de condensado y la gota de diseño de 150 µm | El caso del capítulo (`herramientas/decantadores.py` del libro) |
| Densidades del agua y del limoneno a 20 °C (998,1 y 844,8 kg/m³): el nivel dentro del tubo de calma, 15 mm bajo el rebose del aceite | El caso del capítulo |
| Cilindro cerrado, entrada por un tubo central que baja hasta cerca de media altura, aceite arriba, pierna exterior que toma el agua del fondo y sube por fuera | Başer y Buchbauer (2010), fig. 4.17, p. 106 |
| La pierna del agua y la altura de su codo por el balance hidrostático; la regla H = 2D para un decantador vertical | Towler y Sinnott (2022), §16.4.1, pp. 605–608 |
| El rompe-sifón en lo alto de la pierna | Perry, 7.ª ed. (1997), p. 15-26 |
| El tramo ajustable de la pierna | McCabe et al., 7.ª ed. en español, p. 40: «la parte superior del brazo con frecuencia es móvil» |
| 0,66 % de limoneno en el espacio de cabeza saturado a 35 °C en Bogotá, contra un límite inferior de 0,7 %; la carga estática del limoneno | El caso del capítulo (sección 6 y 9) |
| Tubos de acero inoxidable cédula 10S y bridas ASME B16.5 clase 150 (DN 15, 25, 32, 40, 50 y 80) | ASME B16.5 y ASME B36.19 |
| Pared de 3 mm, fondo plano de 8 mm, brida de la envolvente y tapa plana con 16 pernos, 1140 mm del fondo a la tapa, tubo de calma DN 80 que baja a 500 mm del fondo, deflector de Ø 200 a 60 mm con dos pletinas, agujeros del venteo del tubo, entrada DN 32, venteo DN 25 con su malla, boquilla del rebose DN 40, purga DN 15, pierna DN 32 con su U, el manguito con prensaestopas, las tes y las válvulas de bola, rompe-sifón DN 25 con su unión, mirilla de vidrio con sus llaves, oreja y cable de tierra con la varilla, drenaje DN 25, patas de 2 in con sus placas, altura sobre el piso (fondo a 420 mm) y posición de cada boquilla | Dibujo: plausible para un florentino de 0,55 m; las fuentes no lo dan |
| El tamaño de las gotas y la banda de dispersión | Dibujo: textura, no a escala |
| Las flechas del flujo | Esquemáticas |

## El orden de pintura

El recipiente va como el filtro de arena: la envolvente por dentro (recortada a la ventana del corte, `flWin`, y
registrada recortada al prisma que la ventana proyecta a lo largo de la mirada, `CLIPWIN`), la franja de la derecha
por fuera, el fondo entero y las caras del corte. El tubo de calma va en piezas: la cara de adentro, una sola, y la
franja de la derecha por fuera en cuatro tramos (en el agua, en el aceite, en el espacio de cabeza y sobre la tapa),
así cada tramo se ordena solo frente a la interfase y a la superficie del aceite, que lo atraviesan.

El agua y el aceite son elementos sin forma sólida en el audit (no sostienen nada ni se apoyan en nada), pero con su
forma delgada para el orden: la cara del corte de cada uno, en y = 0, deja huecos donde pasan las paredes del tubo de
calma y el deflector, y la interfase, la superficie del aceite y el agua del tubo son medias coronas delgadas en su z.
Pintadas de atrás hacia adelante con transparencia, el color de lo que se ve detrás sale como sale de verdad: por la
cara del aceite se ve la interfase y por ella el agua, y por la superficie del aceite se ve la pared de atrás. Las
gotas van en el elemento de la cara del corte del agua.

El dibujo va en milímetros y el audit en centímetros (`cm()`, como el tanque agitado y el filtro de arena).

## Archivos y comandos

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/florentino_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`FL`), los tubos y bridas (`DN`), las alturas del caso y dos secciones de uso común. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | Escribe `figuras/sedimentacion-y-decantacion/_florentino.qmd` en el repositorio del libro, con el SVG y los rótulos, y `out/libro-preview.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). `--anclas` imprime dónde cae cada rótulo. |

```sh
CHROME_PATH=/opt/pw-browsers/chromium node build.mjs --audit   # unos 2 minutos (1 del orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
FL_ITEM="pieza" node build.mjs   # lista todo lo que se cruza con una pieza en pantalla
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

En el capítulo se incluye con `{{< include figuras/sedimentacion-y-decantacion/_florentino.qmd >}}` dentro de un bloque
`::: {#fig-florentino}`; el CSS de las piezas es el de siempre (`estilo/anatomia.css`).
