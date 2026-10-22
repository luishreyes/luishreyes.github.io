# Animaciones con Manim — Guía

> **Leer antes de hacer una animación para una presentación del aula.**

[Manim Community](https://github.com/ManimCommunity/manim) (v0.22.0, MIT) es la librería de Python con que se hacen los videos de matemáticas al estilo de 3Blue1Brown: gráficas que se mueven, ecuaciones que se transforman, construcciones que se arman paso a paso. Aquí sirve para las diapositivas que hoy explican con una figura quieta algo que en clase se cuenta en movimiento: un punto de operación que se desplaza, una escalera de McCabe-Thiele que se construye, un balance que se despeja.

**Cuándo sí y cuándo no:**
- **Manim:** una explicación guiada, con orden y ritmo, que el profesor va pasando con la flecha. El resultado es un video.
- **Simuladores** ([SIMULADORES.md](SIMULADORES.md)) o un lienzo interactivo dentro del deck: cuando el estudiante debe mover los datos y explorar.
- **Figuras isométricas** (skill `anatomy`): cuando lo que se explica es un equipo por dentro.

## Dónde vive

```
scripts/animaciones/
  pyproject.toml, uv.lock   ← Manim fijado en 0.22.0 (entorno con uv)
  instalar.sh               ← instala todo (nube o Mac)
  estilo.py                 ← identidad del curso: colores, letra, fórmulas, ejes
  publicar.py               ← renderiza y publica en la presentación
  fuentes/                  ← Barlow y Barlow Condensed (TTF, OFL), las del curso
  escenas/{slug}/*.py       ← una escena por archivo, versionada
  .venv/, media/            ← entorno y renders de trabajo (ignorados en git)
public/classroom/animaciones.js   ← reproduce los videos dentro del deck
```

Los videos publicados quedan junto a su presentación: `public/classroom/{slug}/slides/{Deck}/assets/video/`.

## Instalar

```bash
bash scripts/animaciones/instalar.sh
```

- **En la nube** instala con apt LaTeX (`texlive-latex-extra`, `texlive-science`, `cm-super`), `dvisvgm` y Pango, y después el entorno de uv. Tarda unos tres minutos la primera vez en cada sesión, porque el contenedor es nuevo.
- **En el Mac** usa Homebrew (`cairo`, `pango`, `pkg-config`, `uv`) y BasicTeX con los paquetes de LaTeX que pide Manim; `tlmgr` pide la clave de administrador.
- Comprobar: `cd scripts/animaciones && uv run manim --version`.

## Escribir una escena

Cada escena va en `scripts/animaciones/escenas/{slug}/{tema}.py` y empieza con `from estilo import *` (que trae Manim completo). Referencia: `escenas/iqya-2031-2026-20/punto_operacion.py`.

```python
from estilo import *

class PuntoOperacion(Scene):
    def construct(self):
        self.next_section("curvas")       # paso 1
        ...
        self.wait(0.6)                    # cada paso termina quieto
        self.next_section("operacion")    # paso 2
        ...
```

**Reglas:**
- **El modelo manda.** Las curvas, los puntos y los números salen de las ecuaciones, con los datos del curso; nada se dibuja a ojo. Los `ValueTracker` mueven el modelo y las figuras lo siguen (`always_redraw` o `add_updater`).
- **Un paso por sección.** `self.next_section("nombre")` marca cada paso; en la diapositiva el video se detiene al final de cada uno y sigue con la flecha. Cada sección termina con `self.wait(0.6)`: la pausa cae dentro de esa espera, así el cuadro detenido es el paso completo.
- **Colores con nombre, nunca un hex suelto:** `TINTA`, `TINTA_2`, `TINTA_3`, `REJILLA`, `ACERO`, `ACERO_OSC`, `TEAL` y `AMBAR` (advertencia o pérdida, nunca decorativo ni como color de texto). Cambian solos con el fondo.
- **Texto:** `texto()` (Barlow), `rotulo()` (título del paso, Barlow Condensed) y `formula()` / `MathTex` (LaTeX). Español con tildes. Los rótulos no se pasan a mayúsculas: las unidades cambian de sentido (m³/h no es M³/H).
- **Números con coma decimal:** `num(38.66)` da `'38,7'`. En LaTeX la coma se escribe tal cual (`12,5`): la plantilla carga `icomma`, que no le deja espacio.
- **Ejes:** `ejes(x_range, y_range, x_titulo=..., y_titulo=...)` pone números y títulos en Barlow y con coma.
- **Tamaño de la letra:** el texto más pequeño debe quedar en 24 px o más una vez puesto el video en su caja de la diapositiva (lienzo de 1920). Con `TAM_NOTA` (26) en un video de 1920 px, eso se cumple mientras el video ocupe al menos 1100 px de ancho; en una columna de un split, usar `--formato 4:3` o `1:1` y subir los tamaños.
- **Nada de caricaturas ni imágenes de los PDF** (principio #9). Si hace falta una foto real, va en la diapositiva, no en el video.
- **Una sola idea por video**, de 20 a 60 segundos. Lo que no cabe va en otra diapositiva.

## Revisar

```bash
cd scripts/animaciones
uv run python publicar.py escenas/{slug}/{tema}.py Clase --borrador
```

El borrador sale en 480p a 15 cuadros (un minuto o dos) en `media/videos/...`, sin tocar la presentación. Revisar cuadros sueltos con `ffmpeg -ss 12 -i video.mp4 -frames:v 1 cuadro.png` y abrirlos: que nada se salga del cuadro, que las etiquetas no pisen las curvas y que los números coincidan con el modelo. Repetir hasta que el último cuadro se lea solo, porque es también el póster y lo que sale en el PDF.

## Publicar

```bash
uv run python publicar.py escenas/iqya-2031-2026-20/punto_operacion.py PuntoOperacion \
    --curso iqya-2031-2026-20 --deck Bombas_Centrifugas \
    --titulo "punto de operación de una bomba, con válvula y con variador"
```

| Opción | Qué hace |
|---|---|
| `--deck` / `--carpeta` | Dónde se publica: `--deck Bombas_Centrifugas` es la presentación; `--carpeta lecturas/Lectura_01` sirve para una lectura o cualquier carpeta del curso. |
| `--tema` | `industry` (POU 2026-20, por defecto) o `uniandes` (POU 2027-10: azul noche, oliva y el amarillo solo como relleno). |
| `--fondo` | `blanco` (diapositiva `.s`, por defecto), `papel` (`.s--tint`) u `oscuro` (`.s--dark`); con `uniandes`, también `nieve`, el blanco de los recuadros de las secciones pares de las lecturas. El video lleva el fondo de donde va. |
| `--formato` | `16:9` (1920 × 1080, por defecto), `4:3` (1440 × 1080) o `1:1` (1080 × 1080). |
| `--nombre` | Nombre de los archivos; por defecto, la clase en kebab-case (`punto-operacion`). |
| `--titulo` | Lo que lee un lector de pantalla y el `alt` del póster. |

Deja en `assets/video/` del deck el `.mp4` (H.264 a 30 cuadros, sin audio, con el índice al comienzo para que arranque sin bajar entero) y el `.webp` con el último cuadro, e imprime el HTML de la diapositiva con las pausas ya calculadas. Tarda unos tres minutos para 30 segundos de video. El video sale tal como lo codifica Manim, sin recodificar: el de ejemplo (30 segundos) pesa 1,9 MB. Si uno pasa de 5 MB, revisar la escena (rellenos que cambian en cada cuadro, demasiados objetos moviéndose).

## En una lectura

Una lectura no tiene la flecha del deck: el video va como figura, con controles, y el póster (el último cuadro) es la figura completa para quien no lo reproduce y para la impresión. `publicar.py --carpeta lecturas/...` imprime el HTML: `<video>` dentro de `figure.fig` con `poster`, `controls`, `muted`, `playsinline`, `preload="none"` y `data-auto`.

**Arranca solo al llegar a él** con `public/classroom/animaciones-lectura.js`, que va una vez por lectura antes de `</body>` (`<script src="/classroom/animaciones-lectura.js"></script>`). Empieza a cargar unos 600 px antes de entrar en pantalla, arranca cuando se ve al menos el 60 % del video, se detiene si sale de la vista y al volver sigue donde iba. Corre una vez: al terminar queda en el último cuadro y los controles lo repiten. Si el lector lo detiene, ya no vuelve a arrancar solo. Con movimiento reducido o ahorro de datos no arranca: queda el póster. El pie de figura lo dice («La animación arranca sola cuando usted llega aquí; con los controles la puede detener o repetir»). La lectura necesita una regla para que el video ocupe el ancho (`figure.fig video { width: 100%; height: auto; display: block; }`). **Deje libre la franja de abajo del cuadro** (unos 0,9 unidades de Manim): ahí se dibujan los controles del navegador y tapan lo que haya. Primer ejemplo: la Figura 1 de la Lectura 1 de POU 2027-10 (`escenas/iqya-2031-2027-10/planta_operaciones.py`).

## En la diapositiva

Una vez por presentación, después de `deck-stage.js`:

```html
<script src="assets/deck-stage.js"></script>
<script src="/classroom/animaciones.js"></script>
```

Y el HTML que imprime `publicar.py`, dentro de la diapositiva:

```html
<div class="anim-caja">
  <video class="anim" src="assets/video/punto-operacion.mp4" poster="assets/video/punto-operacion.webp"
         width="1920" height="1080" data-pausas="5.05,8.05,9.85,17.35" muted playsinline preload="auto"
         role="button" tabindex="0" aria-label="Animación: ... Flecha derecha para avanzar"></video>
  <img class="anim-impresion" src="assets/video/punto-operacion.webp" alt="..." width="1920" height="1080">
</div>
```

**Cómo se comporta** (`public/classroom/animaciones.js`):
- Arranca solo al llegar a la diapositiva y se detiene al final de cada paso.
- **Flecha derecha, barra o Av Pág:** el paso siguiente; a mitad de un paso, lo completa. Cuando el video terminó, la flecha pasa de diapositiva como siempre. Los presentadores inalámbricos funcionan igual, porque mandan esas teclas.
- **Clic o Enter sobre el video:** lo mismo, y al final lo repite desde el comienzo.
- **Al volver** desde la diapositiva siguiente, el video aparece completo en su último cuadro.
- **Movimiento reducido:** no arranca solo; muestra el último cuadro y se reproduce con un clic.
- **Impresión y PDF documento:** sale el póster (`img.anim-impresion`). `build-deck-doc.mjs` lo fuerza en el PDF documento (`CURSO=iqya-2031-2027-10 node scripts/build-deck-doc.mjs Presentacion_del_Curso` para un curso distinto de 2026-20).
- **Ejemplo en un deck de 2027-10:** la diapositiva «Por qué el limoneno sale con el vapor por debajo de 100 °C» de la Presentación del curso (`escenas/iqya-2031-2027-10/arrastre_vapor.py`).

**Diseño:** el video a la derecha en un split (como los de YouTube, principio #5) o a todo el ancho bajo el título. Sin borde ni sombra propios: el fondo del video es el de la diapositiva, así que la animación se ve dibujada sobre ella. Después de publicar, regenerar el PDF documento del deck.

## Otra identidad de curso

`estilo.py` tiene dos identidades: Industry, de POU 2026-20 (acero y ámbar), y Uniandes, de POU 2027-10 (azul noche, oliva y amarillo), las dos con Barlow, porque la FF Dax de Uniandes no se puede autoalojar. Se escogen con `--tema`. Para otro curso: agregar su letra en `fuentes/` (TTF con licencia libre y su archivo de licencia; las de `@fontsource` vienen en woff2 y Pango no las lee) y sus colores, escogidos por una variable de entorno como el fondo. Los nombres (`TINTA`, `ACERO`...) se conservan para que las escenas no cambien.

## Problemas comunes

- **`ModuleNotFoundError: estilo`:** la escena se corrió con `manim` directo. Usar `publicar.py`, que pone `scripts/animaciones` en el `PYTHONPATH`.
- **`LaTeX error` o `dvisvgm` no encontrado:** falta la instalación de LaTeX; correr `instalar.sh`.
- **Una letra sale en otra fuente:** el nombre no coincide con uno de `fuentes/`. `uv run python -c "from estilo import *; import manimpango; print(manimpango.list_fonts())"` lista las disponibles.
- **Un cambio no aparece:** Manim guarda en caché cada animación; borrar `media/` o agregar `--disable_caching` al comando de `renderizar` en `publicar.py`.
