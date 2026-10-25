# Mezclador estático en isométrico (skill `anatomy`)

Figura del capítulo 14 del libro de operaciones unitarias (Mezclado y escalado de tanques agitados): el ácido
clorhídrico al 32 % que entra, uno en mil, a la línea de agua de proceso del reactor de extracción de pectina, y el
mezclador estático que lo reparte antes de que llegue al reactor. Todo va a escala real, en milímetros (`geo.mjs`):

- **el tubo**: 2½ in cédula 40 (Ø 73,0 × 5,16; D = 62,71 mm), la línea de 25 m³/h del caso, horizontal, con el agua
  entrando por la izquierda (flecha en el plano justo detrás del corte);
- **las bridas de los extremos**: deslizantes de 2½ in, clase 150, cara realzada (Ø 177,8 × 22,4, cara realzada
  Ø 104,8 × 1,6, cubo Ø 90,4, cuatro agujeros de Ø 19,1 en Ø 139,7), con el tubo 6,5 mm adentro de la cara, la
  soldadura de filete de adentro y la del cubo; en la de salida, las estrías de la cara realzada;
- **la boquilla de la lanza**, arriba: cuello de 1 in cédula 80 sobre el tubo, brida deslizante de 1 in clase 150 con
  su soldadura al cuello, empaque, brida ciega con la conexión de ¾ in NPT, los dos espárragos de atrás con sus
  tuercas, y encima el conector de compresión;
- **la lanza**: tubo de ½ in que baja por la boquilla, dobla 90° (radio de 1,5 diámetros) y descarga en el centro del
  tubo, coaxial y hacia aguas abajo, medio diámetro antes del primer elemento; arriba sale hacia la unión por donde
  llega el ácido;
- **los elementos**: siete Kenics KMS, cintas torcidas 180° en un largo de 1,5 D (94,1 mm), de giro derecho e
  izquierdo alternados, cada una con su borde de entrada a 90° del borde de salida de la anterior;
- **el chorro de ácido**, esquemático: sale de la lanza por el eje, el borde de entrada del primer elemento lo parte
  en dos y cada mitad sigue una cara de la cinta mientras se ensancha, se adelgaza y pasa al color del agua. Dice que
  la cinta reparte el ácido y que se diluye; no es un perfil medido.

## Por qué el KMS y no el KVM

El capítulo recomienda un KVM de vórtice (7,4 D, unos 0,47 m) para esta línea turbulenta. Paul (2004, cap. 7) no da
con qué dibujarlo fielmente: de él dice solo que es «una pestaña inclinada montada separada de la pared» y que las
pestañas van «a unos 2,5 diámetros» (p. 427); la fig. 7-6b (p. 415) es un esquema que no va a escala (el «5 D» y el
«D» acotados no coinciden) y las figs. 7-13 y 7-16 (pp. 425 y 428) son fotos. No hay tamaño de la pestaña, ni ángulo,
ni cómo se sostiene. El KMS sí está definido: Paul, cap. 3, fig. 3-18 (p. 119): elementos de L/D = 1,5, giro de 180°,
alternando el sentido, dos elementos por período; cap. 7, p. 426: «cinta torcida, con giros alternos a izquierda y
derecha; un elemento mide 1,5 o 1,0 diámetros». Siete elementos son los 9,3 D que pide el caso (nota del capítulo,
§ I) redondeados a elementos enteros. El pie de la figura debe decir que es el KMS, la otra opción del caso.

## Qué sale de dónde

| Dato | Fuente |
|---|---|
| Tubo de 2½ in cédula 40, 25 m³/h, ácido al 32 %, uno en mil | El caso (nota del capítulo 14, § I) |
| Elementos KMS: L/D = 1,5, 180°, giro alterno, 90° entre elementos | Paul, cap. 3, fig. 3-18, p. 119; cap. 7, p. 426 |
| Siete elementos | El caso: 9,3 D del KMS, redondeado |
| Inyección coaxial al centro, sin codos antes del mezclador | Paul, cap. 7, p. 462 |
| Bridas de 2½ in y 1 in, clase 150, deslizantes, cara realzada | ASME B16.5 |
| Espesor de la cinta (2,4 mm), holgura a la pared (0,1 mm), tubo de ½ in de la lanza, distancia de la punta al primer elemento (0,5 D), conector, unión, cuello de 1 in | Dibujo: Paul no los da |
| El chorro de ácido | Esquemático |

## El corte y el orden de pintura

El corte quita la mitad que mira al lector (y > 0) del tubo, de las dos bridas, del cuello, de la brida de la boquilla,
del empaque y de la brida ciega. La lanza, los elementos, el conector de compresión y la unión van enteros. El tubo va
en cuatro piezas para que el orden de pintura no haga ciclos con lo que hay adentro: el hueco por dentro (recortado a
la abertura del corte, `mzWin`, y registrado recortado al prisma que la abertura proyecta a lo largo de la mirada,
`CLIPWIN`), la franja de arriba por fuera (solo hasta su contorno, `PAST`), y las caras del corte de arriba y de abajo.
El extremo del tubo y la soldadura de adentro de la brida de salida se ven también por la boca de la brida (`MOUTH`).

Cada elemento va en ocho rebanadas a lo largo de x y cada rebanada en dos mitades, una a cada lado del eje: rebanadas
de x distintas siempre se ordenan por x, y las dos mitades se separan donde la cinta se ve de canto. La cinta se dibuja
en su superficie media: sus tonos se recortan por triángulos (`patchTones`), así los bordes de tono y el doblez
(n·V = 0) son curvas continuas sin escalones; el canto es una sola línea y el doblez se desvanece donde llega,
tangente, al canto. Cada mitad registra el casco de su sección con el espesor de la cinta. El chorro va en trozos que
caen dentro de las rebanadas, con el color en degradados compartidos a lo largo del eje.

El audit acepta un cruce a propósito: el doblez de la lanza cae, en pantalla, sobre el contorno de `pipe.in`, que el
audit toma por una barra porque es largo; la lanza va dentro del tubo y no es una línea que se cruce con otra.

## Archivos y comandos

| Archivo | Qué es |
|---|---|
| `build.mjs` | Geometría, orden de pintura (`A.settle`) y audit. Escribe `out/fig.svg`, `out/fig.css`, `out/mezclador_data.json` (cámara y puntos de los rótulos) y `preview.html`. |
| `geo.mjs` | Las medidas (`MZ`), el ángulo de la cinta en cada x y la media corona. |
| `xprism.mjs` | Prismas de sección cualquiera en cualquier marco (el mismo de las otras figuras). |
| `libro.mjs` | Escribe `figuras/mezclado/_mezclador-estatico.qmd` en el repositorio del libro, con el SVG y los rótulos, y `out/libro-preview.html` (con `estilo/anatomia.css` del libro y el ancho mínimo de 640 px del teléfono). |

```sh
node build.mjs --audit        # unos 50 s; debe terminar en «audit passed»
node build.mjs --fast         # sin orden ni audit: para mirar la geometría
node libro.mjs                # --salida ../../../../libro-operaciones-unitarias/libro (por defecto)
MZ_DEBUG=1 node build.mjs     # las líneas de la cinta en colores, para revisar
CHROME_PATH=/opt/pw-browsers/chromium node ../../../.claude/skills/anatomy/scripts/lines.mjs preview.html --select svg
```

En el capítulo se incluye con `{{< include figuras/mezclado/_mezclador-estatico.qmd >}}` dentro de un bloque
`::: {#fig-mezclador-estatico}`; el CSS de las piezas es el de siempre (`estilo/anatomia.css`). El `.qmd` pesa unos
325 KB.
