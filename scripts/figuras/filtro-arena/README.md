# Filtro de arena a presión en isométrico (skill `anatomy`)

Figura del capítulo 16 del libro de operaciones unitarias (Partículas en un fluido): el filtro a presión de doble medio
que limpia el agua de servicios de la planta. Es un recipiente cerrado: el agua cruda entra por la corona, baja por el
agua libre, la antracita y la arena, pasa por las boquillas del falso fondo y sale del pleno. Todo va a escala real, en
milímetros (`geo.mjs`):

- **el recipiente**: acero al carbono, diámetro interior de 1500 mm, pared de 8 mm, fondo y tapa elípticos 2:1
  (profundidad D/4 = 375 mm) y 1700 mm de envolvente recta entre las dos líneas de tangencia (z = 1080 y 2780 mm sobre
  el piso). Por dentro, las costuras de soldadura; por fuera, la franja de la derecha de la envolvente;
- **el pleno y el falso fondo**: una placa de 30 mm soldada a la envolvente 400 mm sobre la tangencia del fondo, sobre
  un anillo de apoyo de 55 × 12 mm. Bajo la placa queda el pleno, que es el fondo entero más esos 400 mm;
- **las boquillas**: 88 en una rejilla cuadrada de 130 mm (unas 50 por m²), corrida media rejilla de los dos planos del
  corte para que ninguna quede partida. Cada una tiene la cabeza ranurada sobre la placa (Ø 54 × 40 mm, con su domo y
  catorce ranuras verticales, sobre un manguito de Ø 34), la tuerca bajo la placa y la cola de Ø 21 × 208 mm, con el
  agujerito del aire 34 mm bajo la tuerca: durante el lavado el aire forma un colchón bajo la placa y entra a la
  boquilla por ese agujero y el agua por la punta de la cola. Se dibujan las 44 colas de la mitad de atrás y las 22
  cabezas del cuarto sin medio;
- **el medio**: 0,30 m de arena (ES 0,5 mm) directamente sobre la placa, sin grava de soporte, 0,50 m de antracita
  (ES 1,0 mm) encima y 0,60 m de agua libre hasta el distribuidor. La interfaz es nítida pero ondula ±1,4 cm y en una
  franja de 2,5 cm hay granos de cada capa metidos en la otra. Los granos son una textura en el plano de cada cara:
  van cinco a diez veces más grandes que los reales para que se vean, con la arena más fina y clara que la antracita;
- **el distribuidor**: la boquilla DN 150 de la corona entra 110 mm en la tapa y descarga sobre una placa deflectora
  de Ø 460 × 10 mm colgada 125 mm más abajo de cuatro pletinas de 50 × 8 mm; reparte el agua hacia los lados para que no
  cave la antracita. Por la misma boquilla sale el agua del lavado;
- **en la tapa**: la tubería de entrada (brida, carrete de 330 mm, codo de radio corto y un tramo de 700 mm hacia la
  izquierda con su manómetro y la válvula de mariposa, abierta), el venteo DN 25 cerca de la corona con su válvula de alivio de aire y
  la boca de visita DN 400 con su tapa empernada y la manija;
- **en la franja de la derecha**: el registro de mano DN 200, con tapa ciega y manija, justo sobre la placa, y debajo,
  en el pleno, la entrada del aire DN 50 con su válvula de bola (cerrada);
- **abajo**: la salida del agua filtrada DN 100 hacia la izquierda, con su manómetro y la válvula de mariposa abierta;
  la entrada del agua de lavado DN 150 hacia la derecha, con la válvula cerrada (las dos bajan del fondo y doblan con un
  codo de radio corto); el drenaje DN 50 en el polo, con su
  válvula de bola cerrada; y cuatro patas de tubo de 4 in sobre asientos soldados al fondo, con sus placas y pernos de
  anclaje (a 600 mm del eje, giradas para que ningún codo caiga sobre una pata en pantalla). Por dentro del fondo se
  ven los agujeros de las tres boquillas;
- **las flechas del servicio**: en un plano justo detrás del corte, el agua baja por la boquilla de entrada, la placa
  deflectora la abre hacia los lados, baja hacia el medio y, en el pleno, va hacia la salida. Las válvulas van como en
  servicio: abiertas la entrada y la salida, cerradas el lavado, el aire y el drenaje.

## El corte escalonado del medio

El corte quita lo que mira al lector por encima de la línea de tangencia del fondo (y > 0, z > zt), como en el tanque
agitado: el fondo queda entero y la envolvente, la tapa, la placa, la boquilla de entrada y la placa deflectora se ven
cortadas por el plano y = 0. Las boquillas de la placa están enterradas en la arena, así que el medio va además
escalonado: se quita también el cuarto de atrás a la derecha (x > 0, y < 0) hasta la placa, para que se vean las
cabezas, y lo que queda del medio, el cuarto de atrás a la izquierda, muestra las capas en sus dos caras (la del corte,
y = 0, y la del escalón, x = 0) y el techo de la antracita. El pie de la figura debe decir que el medio se quitó en ese
cuarto solo para mostrar las boquillas.

Todo lo de adentro está bajo el agua (el filtro va lleno) y lleva el tinte del agua (`fa-sub`).

## Qué sale de dónde

| Dato | Fuente |
|---|---|
| Diámetro de 1,5 m; 0,30 m de arena de ES 0,5 mm; 0,50 m de antracita de ES 1,0 mm; 0,60 m de agua libre; lavar a unos 50 kPa | El caso (`figuras/particulas-en-un-fluido/caso.json` del libro) |
| Doble medio: antracita sobre arena | Crittenden et al. (2012), cap. 11 |
| Falso fondo de boquillas sin grava de soporte, que ahorra unos 0,5 m de altura | Crittenden et al. (2012), cap. 11, p. 794 |
| Boquillas para aire y agua en el lavado | Crittenden et al. (2012), cap. 11; Perry, 8.ª ed., p. 18-110 (las boquillas ranuradas dejan lavar con aire y agua) |
| El filtro a presión es un recipiente cerrado | Crittenden et al. (2012), cap. 11, p. 800 |
| Caída de presión de 50 a 70 kPa en los filtros a presión | Perry, 8.ª ed., p. 18-110 |
| Bridas y tubos (DN 25, 50, 100, 150, 200 y 400) | ASME B16.5 clase 150 y tubo cédula 40 |
| Pared de 8 mm, cabezas 2:1, 1700 mm de envolvente recta, placa de 30 mm a 400 mm de la tangencia, anillo de apoyo, rejilla de 130 mm, cabeza, manguito, tuerca y cola de las boquillas, agujero del aire, distribuidor (placa de Ø 460, pletinas, 110 mm de entrada), tamaños y posiciones de las boquillas del recipiente, carrete, codos de radio corto y tramos de tubería, válvulas de mariposa y de bola, manómetros (Ø 100, escala de 0 a 6 bar), patas, asientos y placas de anclaje, altura sobre el piso (polo del fondo a 697 mm, corona a 3163 mm) | Dibujo: plausible para un filtro a presión de 1,5 m; las fuentes no lo dan |
| Las agujas de los manómetros en 3,5 y 3,0 bar: 50 kPa de diferencia, el punto de lavado del caso | Dibujo (la presión de servicio no la da el caso) |
| El tamaño de los granos y la mezcla de 2,5 cm en la interfaz | Dibujo: textura, no a escala |
| Las flechas del flujo | Esquemáticas |

## El orden de pintura

El recipiente va en las piezas del tanque agitado: la envolvente y la tapa por dentro (recortadas a la ventana del
corte, `faWin`, y registradas recortadas al prisma que la ventana proyecta a lo largo de la mirada, `CLIPWIN`), la tapa
por fuera, la franja de la derecha por fuera, el fondo entero (por dentro, recortado a su boca, `faMouth`) y las caras
del corte. Las colas de las boquillas van antes que la placa (la placa las tapa desde arriba) y las cabezas después, así
que cabeza y cola son dos elementos. El medio es un solo elemento: sus tres caras visibles son de un sólido convexo y no
se tapan entre sí. Los granos son patrones (`faAntA`, `faAntB`, `faSanA`, `faSanB`) que cada cara usa con su propia
transformación afín (`patternTransform`), así cada patrón queda en el plano de su cara; los granos sueltos de la
interfaz van dibujados uno por uno.

El dibujo va en milímetros y el audit en centímetros (`cm()`, como el tanque agitado): sus muestras de superficie van
cada 0,6 unidades y un recipiente de 1,5 m en milímetros no cabe en memoria.

## Archivos y comandos

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/filtro_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`FA`), los tubos y bridas (`DN`), las cabezas elípticas, la rejilla de las boquillas y dos secciones de uso común. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | Escribe `figuras/particulas-en-un-fluido/_filtro-arena.qmd` en el repositorio del libro, con el SVG y los rótulos, y `out/libro-preview.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). `--anclas` imprime dónde cae cada rótulo. |

```sh
node build.mjs --audit        # unos 2½ minutos (2 del orden); debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
FA_ITEM="pieza" node build.mjs   # lista todo lo que se cruza con una pieza en pantalla
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

En el capítulo se incluye con `{{< include figuras/particulas-en-un-fluido/_filtro-arena.qmd >}}` dentro de un bloque
`::: {#fig-filtro-arena}`; el CSS de las piezas es el de siempre (`estilo/anatomia.css`).
