# Equipos de molienda en isométrico (skill `anatomy`)

Figuras de la pestaña «Equipo en operación» del Explorador de molienda y tamizado (POU 2026-20), vista «Máquina». Son los
cinco equipos del explorador, cada uno una máquina real abierta para ver por dentro:

- **molino de bolas** (`bolas.mjs`): tambor de 3 m con revestimiento y 14 levantadores, bridas, cabezas cónicas,
  muñones en chumaceras sobre pedestales de concreto, corona y piñón con sus chumaceras, acople, reductor y motor, tolva
  con su chute que entra por el muñón de alimentación y trommel de descarga con su tolva. Entre dos planos (y = −118 y
  122 cm) se quita la mitad del tambor que mira al lector: queda la artesa de atrás con sus levantadores y, al fondo,
  el corte del lado de la descarga con la sección entera de la carga;
- **trituradora de mandíbulas** de un solo toggle, 600 × 900 mm (`mand.mjs`): bastidor de placas con la pared de adelante
  y el bloque del toggle, mandíbulas corrugadas, placa de desgaste de la tolva, biela colgada del eje excéntrico, toggle
  entre sus asientos con las lainas de ajuste, varilla de tensión con su resorte, chumacera y volante con canales,
  correas al motor sobre su base deslizante y banda de descarga. Se quita la placa lateral de adelante (con su chumacera,
  su volante y la punta del eje);
- **molino de rodillos dobles**, 600 × 400 mm (`rod.mjs`): dos rodillos en chumaceras sobre un bastidor de cuatro patas,
  el de la derecha flotante sobre su placa deslizante con los resortes de alivio contra un tope, carcasa con la tolva
  hasta la boca, caja de producto y, atrás, poleas con correas a dos motores a la altura de los ejes. Se quita la tapa
  lateral de adelante de la carcasa;
- **molino de martillos** de rotor en voladizo, carcasa de 80 cm (`mart.mjs`): carcasa con la criba perforada abajo, boca
  con chute y tolva arriba a la izquierda, cunas, tolva de descarga, eje en dos chumaceras sobre su pedestal, polea y
  correas al motor. El rotor tiene cubo, cuatro discos con pasadores y cuatro filas de tres martillos rígidos. Se quita
  la tapa de adelante;
- **molino de discos** de atrición de un solo rotor, discos de 60 cm (`disc.mjs`), como lo describe McCabe: el rotor con su
  placa ranurada frente al disco fijo, que va en la puerta; la tolva con su compuerta y el tubo que entra por el ojo del
  disco fijo (con un codo fundido), cuatro varillas con resortes, arandelas, tuercas y contratuercas que sostienen la puerta
  y ajustan la luz, la carcasa con su brida, el prensaestopas y la boca de descarga sobre el recipiente del producto, las
  cunas, el eje en dos chumaceras sobre su pedestal, la polea y las correas al motor, sobre una fundación en L. Se quita la
  mitad de abajo de la puerta y del disco fijo, entre el cubo y el anillo de los pernos.

Y en la pestaña «Granulometría», la **tamizadora de golpeteo** (`tamiz.mjs`), vista «Máquina» de la tarjeta Tamizadora (el
esquema de siempre queda en «Esquema», y es la vista con que abre en pantallas angostas). Es una tamizadora de laboratorio
para tamices de 8″ (200 mm) de media altura, con los datos del fabricante del equipo de referencia: 278 ± 10 oscilaciones por
minuto en una órbita horizontal de 28,6 × 11,1 mm y 150 ± 10 golpes por minuto de un martillo de 2,44 kg sobre el corcho de
la tapa. La pila va sobre el plato portatamices (el fondo, los tamices del análisis con el más fino abajo y la tapa), con las
dos varillas roscadas y la barra de sujeción con sus perillas; atrás, la torre con la corredera, el pivote, el brazo y el
martillo; abajo, la caja con el temporizador de siete segmentos, el piloto, los botones, el interruptor, la placa, las
rejillas y el cable al enchufe del piso. Se quita la mitad de la pila que mira al lector. Hay una figura por número de
tamices (de 3 a 9, `tamiz-3.svg` … `tamiz-9.svg`), porque la pila real lleva solo los tamices del análisis, y la página pide
la que corresponde. La mueve la muestra de la tamizadora del explorador (`SieveAnim`, que corre en un lienzo virtual mientras
se ve la máquina): `FSieve` (`tamiz-live.js`) pinta la trama de cada malla con un paso que crece con su abertura, deja caer
cada partícula por la pila hasta el tamiz que la retiene (en la mitad de atrás) y, mientras dura el ensayo, mueve la pila en
su órbita, sube y deja caer el martillo (el brazo se redibuja como un prisma en su ángulo) y hace saltar los granos con cada
golpe; el temporizador cuenta los 10 minutos del ensayo. La trama y los granos van en escala logarítmica de tamaño. Las
etiquetas dan, para cada tamiz y el fondo, lo retenido en la muestra y en la tabla.

**La mueve la simulación del explorador.** `MillAnim` (elementos discretos) corre en un lienzo virtual de 900 × 490 px
mientras se ve la máquina (`DEMW`, `DEMH` en `geo.mjs`), y cada figura pone esa escena en su plano de corte con la
relación de `geo.mjs`: en el molino de bolas el tambor de radio 0,42·min(W, H) del lienzo es el revestimiento de
145 cm; en la trituradora, 0,316 cm por px (la boca de arriba mide 60 cm); en los rodillos, 0,18 cm/px (rodillos de
60 cm); en los martillos, 0,194 cm/px (carcasa de 80 cm); en los discos, 0,142 cm/px (el disco del lienzo, de radio 0,43·min(W, H), es
el rotor de 60 cm). Con eso:

- **bolas**: el tambor gira con el ángulo del lienzo (los pernos del casco, los dientes de la corona y del piñón con
  la relación de radios y los agujeros del trommel) y los levantadores corren por la artesa y aparecen en sección en el
  corte. La carga es la del lienzo, con bolas de 4 a 6 cm (en promedio las de 5 cm del cálculo de N_c; con J = 35 %, unas
  950 en la sección): se repite en capas a lo largo de todo el tambor, separadas 1,15 diámetros de bola, cada capa
  girada un poco alrededor del eje y cada partícula corrida hasta media bola, para que no queden en fila. En la artesa
  van solo las de la mitad de atrás, y en el corte de la descarga, la sección entera. De cada capa se dibujan solo las
  partículas que la capa siguiente no tapa (las del borde de la carga y las que vuelan), y debajo va la sombra del cuerpo
  de la carga, para que por los huecos se vea oscuro. Si el cuadro pasa de 14 ms, se dibujan menos capas;
- **mandíbulas**: la biela sigue a la cara móvil del lienzo (`jcMove`: giro alrededor de la punta de arriba y
  traslado) y sube y baja con el muñón excéntrico, que gira en su buje; el toggle va de su asiento en la biela al del
  bastidor; la varilla sigue a la oreja por el bloque y el resorte se comprime; giran los rayos del volante y la
  chaveta del eje; las rocas van en el plano del corte, detrás de las mandíbulas y de la biela;
- **rodillos**: giran en sentidos opuestos (las juntas de su superficie, los pernos de sus caras y de sus cubos) y las
  partículas van en el plano de las caras de adelante, detrás de las chumaceras, la viga y los propios rodillos;
- **martillos**: el rotor entero se arma en cada cuadro (discos, pasadores y martillos, de atrás hacia adelante) y las
  partículas van dentro de la boca de la carcasa y del chute;
- **discos**: la cara del rotor gira con sus 24 ranuras curvas y toma el color de la temperatura de salida, como en el
  lienzo; las partículas van en la luz entre los discos, gruesas cerca del ojo y finas en la periferia, y giran los
  agujeros del alma de la polea. Todo eso va en el SVG, en el lugar del rotor en el orden de pintura (`ds.face`), no en el
  lienzo: la puerta y el disco fijo lo tapan solos fuera de la mitad abierta. La tolva muestra el material con su color.

Los destellos de fractura del lienzo se pintan en el mismo plano. La vista «Corte» del explorador vuelve a la sección
en dos dimensiones del lienzo, con sus anotaciones (hombro, pie, sentido de giro).

| Archivo | Qué es |
|---|---|
| `build.mjs` | `node build.mjs --eq=bolas\|mand\|rod\|mart\|disc [--audit] [--fast]`: geometría del equipo, orden de pintura (`A.settle`) y audit. Escribe `out/molino-{eq}.svg` y `.json`, `out/fig.js`, `out/fig.css` y `preview.html`. `--js` solo rehace `fig.js` y `fig.css`. |
| `bolas.mjs`, `mand.mjs`, `rod.mjs`, `mart.mjs`, `disc.mjs` | Cada equipo: su cámara (`camera`) y sus piezas (`build`), con los datos que necesita la página. |
| `helpers.mjs` | Cajas, prismas en cualquier marco, cuerpos torneados, coronas, tubos, esferas, asientos, diales. |
| `geo.mjs` | Medidas y la relación con el lienzo de partículas de cada equipo (`BM`, `JC`, `RC`, `HM`, `DS`, `jcMove`). Sin imports: corre en el build y en la página. |
| `xprism.mjs` | Prismas de sección cóncava en cualquier marco (los mismos de las otras figuras). |
| `live.js` | `FMill`: lo que gira y lo que se mueve, y las partículas en el plano de cada máquina. |
| `tamiz.mjs`, `tamiz-live.js` | La tamizadora (`--eq=tamiz --n=3…9`) y `FSieve`, que la mueve con la muestra del explorador. |
| `ml.css` | Fundición, acero, concreto, motor, corona, criba, correas, cortes y lo vivo. El tema blueprint va en el explorador. |
| `libro-molinos.mjs` | Para el libro de operaciones unitarias: abre el explorador de 2027-10, deja correr la simulación con cada equipo y saca la máquina quieta, con las partículas del lienzo como una capa WebP dentro del SVG y los nombres de las piezas en español (`_molino-{eq}.qmd`). `--cajas` dibuja las cajas de todas las piezas para escoger dónde van los rótulos. |
| `libro-tamiz.mjs` | Para el libro: la tamizadora quieta con la pila de un análisis y sus rótulos (`_tamizadora.qmd`). Las dos escriben el CSS de la molienda del libro (`estilo/anatomia-molienda.css`). |
| `splice.mjs` | Mete el código y los datos en el HTML publicado (marcadores `MLFIG_*`, con `ML_FIGS` y `ML_TAMIZ`) y copia los SVG a `simulaciones/fig/molienda/`. |

```sh
node build.mjs --eq=bolas --audit   # minuto y medio; debe terminar en «audit passed»
node build.mjs --eq=mand --audit    # unos 15 s
node build.mjs --eq=rod --audit
node build.mjs --eq=mart --audit
node build.mjs --eq=disc --audit    # minuto y cuarto
for n in 3 4 5 6 7 8 9; do node build.mjs --eq=tamiz --n=$n --audit; done   # unos 25 s cada una
node splice.mjs
```

Reglas que salieron de armarlas, para la próxima:

- Lo que abraza a otra pieza (coronas, chumaceras, cunas, poleas, cubos) se parte por el plano del eje que mira al
  lector, y una pieza que cruza otra (un eje por una placa, la varilla por el bloque del toggle) se dibuja solo donde
  se ve, sin hueco: así el audit no encuentra ciclos de profundidad.
- Un corte que tiene que mostrar una sección de la carga va por un plano que mire al lector y deje libre esa sección:
  en el molino de bolas una ventana en el casco mostraba una nube de bolas sin régimen legible.
- Las partículas del lienzo van en el plano del corte; lo que está delante de ese plano (chumaceras, vigas, la biela)
  se recorta del lienzo en vivo con sus siluetas. Si lo que tapa es mucho y variado (la puerta del molino de discos, su
  tubo, sus varillas), es más simple pintarlas en el SVG, en el lugar de la pieza de atrás en el orden de pintura.
- Una pieza que abraza a otra y cruza la línea donde se parte el casco (una cuna) queda en una sola mitad, o hay ciclo.
- Un codo de tubo visto de canto se pliega en pantalla: va como pieza fundida (una esfera) con el paso de cada tramo solo
  hacia su lado, y el hueco del tubo se mide sobre su línea para que la boca de cada tramo quede adentro de la esfera.
- Una carga de bolas reales (miles de partículas) no se puede simular en un objeto por partícula: las sub-iteraciones
  corren sobre arreglos numéricos, en funciones chicas (`demGrid`, `demPairs`, `demWalls`, `demInteg`), con una malla de
  vecinos de media vecindad, y lo que corre de vez en cuando (fractura, descarga, alimentación) va aparte, una vez por
  cuadro; todas las partículas nacen con los mismos campos (`mkPart`). El paso no pasa de 1,4 ms: con pasos más largos
  la pila de bolas se vuelve inestable y las lanza a decenas de miles de px/s.
- Una pieza que se mueve girando (el brazo del martillo) no se mueve bien con una transformación del SVG: un giro alrededor de
  un eje que no mira al lector deforma la pieza en pantalla. Se redibuja en su ángulo como un prisma en un marco girado.
- Cuando el número de piezas de una pila cambia con el caso, va una figura por cada número, con la misma cámara: así se
  cambia de una a otra sin que se mueva el dibujo.
