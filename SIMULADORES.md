# Simuladores del aula

Los simuladores, exploradores y manuales del aula (`public/classroom/*/simulaciones/`) se ven y se manejan igual,
sin importar el curso. No llevan la identidad gráfica de ningún curso ni la del portafolio: tienen una apariencia
neutra y común (pedido del profesor, 20 oct 2026). Cada uno sigue siendo un HTML autocontenido que abre en una
pestaña nueva, con su modelo, sus figuras y sus textos; lo que comparten vive en una sola hoja.

## La hoja común: `public/classroom/simulador.css`

Cada simulador la carga antes de su propio `<style>`:

```html
<link rel="stylesheet" href="/classroom-fonts.css">
<link rel="stylesheet" href="/classroom/vendor/katex/katex.min.css">
<script defer src="/classroom/vendor/katex/katex.min.js"></script>
<link rel="stylesheet" href="/classroom/simulador.css">
<style>
/* solo lo propio de este simulador */
</style>
```

- **Trae** los tokens (`:root`), la cabecera fija con sus indicadores, la barra lateral de controles, las pestañas,
  los paneles y tarjetas, los controles (`.seg`, `.opt`, `.mill`, `.sl`, `.toggle`, `.btnw`), el escenario con sus
  indicadores (`.stage`, `.hud`, `.chip`, `.play`), las gráficas (`svg.ch`, `.legend`, `.readout`), las ecuaciones
  (`.eqs`), las configuraciones (`.cfgnow`, `.cfgs`, `.cfg`), el panel móvil (`.mobile-ctl`) y las piezas que se
  repiten entre simuladores (`.stack`, `.pill`, `.sub`, `.crit`, `.terms`, `.stp`, `.fitrow`, `.cmp`…).
- **El `<style>` de cada simulador** solo trae lo suyo: su figura, sus tablas, sus ajustes de tamaño. No repite
  reglas de la hoja común ni redefine sus tokens. Si algo debe cambiar en todos, se cambia en la hoja.
- **Las figuras generadas** (los bloques entre marcadores `*_CSS_START` / `*_CSS_END` que escriben los `splice.mjs`
  de `scripts/figuras/`) se quedan en el `<style>` de cada simulador.
- El **Explorador de gráficos** y el **Manual de diagramas** son un catálogo y un manual, con su propia estructura:
  no cargan la hoja, pero usan los mismos tokens, las mismas letras y los mismos mínimos de tamaño.

## La apariencia

- **Color.** Tinta casi negra (`--text` #1c1b1a) sobre blanco, grises cálidos (`--n50` a `--n800`) y un azul acero,
  `--accent` #4A6F94, para lo que se toca, lo seleccionado y la curva principal de cada gráfica. Tres colores con un
  solo significado: `--ok` verde (dentro de lo esperado), `--warn` ámbar (advertencia) y `--redline` rojo (por fuera
  de un límite: fugas, criterios incumplidos, la zona prohibida de una curva). Un color de dominio, como el ocre del
  H₂S en el ecofiltro, se usa solo para eso.
- **Letra.** Manrope para leer y JetBrains Mono para cifras y rótulos, autoalojadas (`/classroom-fonts.css`). Nada
  de Typekit ni de Google Fonts.
- **Lienzo.** Papel o blueprint (`data-canvas`), el único valor que se guarda entre visitas.

## La estructura

Referencia: el Explorador de Bernoulli.

1. **Cabecera fija:** el rótulo del curso (`.kick`), el nombre (`h1`), una línea de contexto (`.ctx`) y el estado
   (`.status`: verde, ámbar o rojo, y lleva al diagnóstico). Debajo, hasta seis indicadores (`.kpis`).
2. **Barra lateral a la izquierda** (`.ctl`): abre con «Sistema en pantalla» (`.cfgnow`) cuando el simulador tiene
   configuraciones, y sigue con secciones numeradas (`01`, `02`…). En celular es un panel que sube desde abajo con el
   botón «Controles» (`.mobile-ctl`).
3. **Pestañas numeradas** (`.tabs`), que también se abren con las teclas 1, 2, 3…, y a la derecha papel o blueprint.
4. **Cada pestaña** abre con un título, un rótulo y un párrafo (`.ph`), y sigue con tarjetas (`.card`).
5. **El escenario** (`.stage`) lleva arriba a la izquierda los indicadores del instante (`.hud`) y arriba a la derecha
   los botones de la animación o de la corrida (`.play`: pausa, velocidades, reinicio); debajo, una frase que explica
   lo que se ve (`.caption`).
6. **Las configuraciones** del curso van en su pestaña, como tarjetas, nunca en la barra lateral (ver CLAUDE.md,
   «Un solo sistema y las configuraciones aparte»).

## Los mínimos

- **Contraste:** el acento, el rojo, el verde y el ámbar pasan 4,5:1 sobre blanco; el blanco sobre el acento, también.
- **Letra:** ningún rótulo de la hoja ni del `<style>` de un simulador baja de 10 px. (Las gráficas en SVG escalan con
  su `viewBox`; cuando se dibujan al ancho real de la tarjeta, su letra tampoco baja de 10.)
- **Tamaño de los controles:** al menos 26 px de alto con mouse y 44 px con
  el dedo (`pointer: coarse`, un piso con `!important` en la hoja común); el estado de la cabecera, 36 px.
- **Movimiento:** con `prefers-reduced-motion` no hay animaciones de interfaz, y las corridas arrancan en pausa.
- **Foco visible** en todo lo que se toca.

## Revisarlos

```
node scripts/revisar-simuladores.mjs            # todos
node scripts/revisar-simuladores.mjs Ecofiltro  # uno
```

Levanta un servidor sobre `public/`, abre cada simulador con mouse (1440 px) y con el dedo (390 px) y dice si hay
errores de JavaScript, si algo se sale a lo ancho, si algún control queda por debajo del mínimo, si un `<style>` trae
letra de menos de 10 px, redefine el acento o carga letras de afuera, y si un explorador no carga la hoja común. Se
corre antes de publicar cualquier cambio en un simulador.
