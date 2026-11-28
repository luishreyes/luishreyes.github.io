# Simuladores del aula

Los simuladores, exploradores y manuales del aula (`public/classroom/*/simulaciones/`) se ven y se manejan igual,
sin importar el curso. No llevan la identidad gráfica de ningún curso ni la del portafolio: tienen una apariencia
neutra y común (pedido del profesor, 20 oct 2026). Cada uno sigue siendo un HTML autocontenido que abre en una
pestaña nueva, con su modelo, sus figuras y sus textos; lo que comparten vive en una sola hoja.

Los exploradores de Proyecto de Operaciones Unitarias tienen desde 2027-10 otra imagen, la del libro, y un armazón
común que arma la página: ver [Exploradores con la imagen del libro (2027-10)](#exploradores-con-la-imagen-del-libro-2027-10),
al final. Lo que sigue hasta allá vale para los simuladores de 2026-20 y de los demás cursos.

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
- El **Explorador de gráficos** de Proyecto de Operaciones Unitarias, el de **Narrativas Visuales** y el **Manual de
  diagramas** son catálogos y un manual, con su propia estructura: no cargan la hoja, pero usan los mismos tokens, las
  mismas letras, la misma paleta en sus gráficas (gris de contexto, azul de foco, ladrillo de negativo) y los mismos
  mínimos de tamaño.

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

## Exploradores con la imagen del libro (2027-10)

Decisión del profesor, 28 nov 2026: los exploradores de Proyecto de Operaciones Unitarias se ven como el libro de
operaciones unitarias y se arman todos con el mismo armazón. La imagen es definitiva: «no cambiaré nunca más el
diseño. Por eso estoy homogeneizando todo. Los libros, presentaciones y todo lo que está haciéndose para 2027-10 está
teniendo una imagen propia. Igual que ahora los exploradores.» Todos los exploradores de POU usan este armazón y esta
imagen, sin variantes, y el Explorador de gráficos también, porque es solo de POU.

Para ellos, esta sección reemplaza «La hoja común», «La apariencia» y «La estructura» de arriba (la apariencia neutra
de `simulador.css`, con Manrope, el acento azul acero y el lienzo papel o blueprint). Siguen vigentes, como están, el
arranque limpio, un solo sistema y las configuraciones aparte (CLAUDE.md, «Simuladores de POU 2026-20»), los colores
con un solo significado y los mínimos de contraste, de tamaño de los controles, de movimiento y de foco.

La referencia es el Explorador de filtración de 2027-10
(`public/classroom/iqya-2031-2027-10/simulaciones/Explorador_Filtracion.html`), el piloto que el profesor aprobó.

### La pantalla

En el computador, todo cabe en una pantalla sin desplazar la página, a 1440 × 900 y a 1366 × 768. Arriba va la barra
azul noche con el número del capítulo en su cuadro amarillo, el nombre del explorador, el caso cargado (con «con
cambios» y «Volver al caso» cuando el estudiante movió algo) y los botones «Configuraciones» y «¿Cómo se calcula?». A
la izquierda, el riel de escenas por partes, y una parte que todavía no está lleva su aviso («en la próxima entrega»).
En el centro, la escena: la ceja con su número y su parte, el título, la pregunta de diseño, tres números, una o dos
figuras movidas por el modelo y el veredicto en una línea, con el botón a la escena siguiente. A la derecha, la tarjeta
amarilla para predecir antes de mover y los controles de la escena (dos, tres o cuatro, cada uno con su «caso: …»), con
los demás en «Más ajustes».

«¿Cómo se calcula?» abre una capa con la imagen de una página del libro: los pasos de la escena, cada uno con su
ecuación, la misma ecuación con los números en pantalla, de dónde sale cada dato y el enlace a la sección del libro en
línea. A la izquierda de la capa quedan los datos de la escena: si el estudiante mueve uno, las cuentas cambian, y al
cerrar el explorador sigue donde estaba.

En el celular (y en cualquier pantalla de menos de 1100 px de ancho o 600 de alto) la página es una columna: la figura
primero, los números, el veredicto, la predicción y la segunda figura; las escenas van en una fila de botones bajo la
barra, y los controles en una hoja que sube desde abajo con el botón «Controles».

### El armazón y cada explorador

Lo común vive en dos archivos, que no se copian ni se editan para un explorador: si algo debe cambiar en todos, se
cambia ahí y se vuelven a probar todos los exploradores que los cargan.

| Archivo | Qué trae |
|---|---|
| `public/classroom/explorador-libro.js` | El armazón, en JavaScript sin dependencias: escribe la página entera, el riel y las teclas, la barra con el caso, los números, el veredicto, los controles, la predicción, las configuraciones, el estado «con cambios», la capa «¿Cómo se calcula?» con KaTeX, la hoja del celular y el ciclo de vida de las figuras (SVG propio, isométricas del skill `anatomy`, lienzos canvas y escenas 3D con three.js). |
| `public/classroom/explorador-libro.css` | La hoja: los colores del libro (azul noche, amarillo solo como campo y marca, oliva para los números de paso y los enlaces, rojo solo para lo que pasa de un límite), la letra (Dax, con Archivo autoalojada de respaldo, y Source Serif 4 en la capa), la pantalla, el celular y las clases de las figuras en SVG (`f-t`, `f-ts`, `f-v`, `f-vg`, `f-tag`, `f-azul`, `f-alerta`, `f-halo`, `f-eje`, `f-rej`, `f-pared`, `f-linea`). |

Cada explorador declara solo lo suyo: el modelo, los controles, las configuraciones y las escenas, con sus números, su
veredicto, su predicción, sus figuras y los pasos del cálculo.

### La página

```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<title>Explorador de bombas centrífugas · Proyecto de Operaciones Unitarias</title>
<link rel="preconnect" href="https://use.typekit.net" crossorigin>
<link rel="stylesheet" href="https://use.typekit.net/zyg3ceo.css">
<link rel="stylesheet" href="/classroom/vendor/katex/katex.min.css">
<link rel="stylesheet" href="/classroom/explorador-libro.css">
<!-- solo si alguna escena tiene una figura 3D -->
<script type="importmap">{"imports":{"three":"/classroom/vendor/three/three.module.min.js"}}</script>
<style>
/* solo lo propio: el CSS de las isométricas entre sus marcadores y lo que dibuje el explorador */
/*PBFIG_CSS_START*/ … /*PBFIG_CSS_END*/
</style>
</head>
<body>
<script src="/classroom/vendor/katex/katex.min.js"></script>

<script id="modelo">
window.Modelo = (function () { /* el caso y la función que calcula; no toca la página */ })();
</script>

<script>
/*PBFIG_START*/ … /*PBFIG_END*/
</script>

<script src="/classroom/explorador-libro.js"></script>
<script>
(function () { /* los controles, las configuraciones, las escenas y XL.explorador({ … }) */ })();
</script>
</body>
</html>
```

- La letra es la Dax, como en todo 2027-10, y es obligatoria en todo explorador: las dos líneas del kit de Adobe del
  curso (`use.typekit.net/zyg3ceo.css`, el mismo de `programa.html` y `reto-aceite-esencial.html`) van en el `<head>`.
  Es la única letra de afuera admitida; si el kit no carga, la hoja usa Archivo, autoalojada, y la página se ve bien
  igual.
- KaTeX (`/classroom/vendor/katex/`) se carga antes del armazón. three.js (`/classroom/vendor/three/`) no se carga en
  la página: el armazón lo pide cuando se abre la primera escena con una figura 3D. El mapa de importación de
  `three` se declara en el `<head>`; si falta, el armazón lo agrega.
- El `<body>` no lleva marcado propio, salvo las `<template>` de las isométricas que vienen en línea (ver «Las
  figuras»): el armazón escribe la página al principio del `<body>`.
- El `<style>` solo trae lo propio. No redefine los colores ni la letra del libro (`--amarillo`, `--navy`, `--oliva`,
  `--alerta`, `--azul`, `--sans`, `--serif`), ni carga `simulador.css` o `/classroom-fonts.css`.
- El modelo va en su propio `<script id="modelo">`, que deja el caso y la función de cálculo en `window.Modelo` y no
  toca la página: así las pruebas de los números lo cargan solo, con `vm`, sin navegador.
- El archivo conserva el nombre y la ruta del explorador que reemplaza: el Material, los simuladores públicos y los
  capítulos del libro enlazan a esa dirección. Cada escena tiene su ancla (`#id`), que el armazón escribe al
  navegar.

### La declaración

Un explorador mínimo, con una escena y una figura en SVG:

```js
(function () {
  'use strict';
  var M = window.Modelo, D = XL.dib, C = D.C, num = XL.num, un = XL.un, kn = XL.kn;
  var S = {};   // lo que la figura guarda entre montar y poner

  XL.explorador({
    id: 'bombas',                                    // para las preferencias de vista
    nombre: 'Explorador de bombas centrífugas',
    capitulo: '11',                                  // el cuadro amarillo de la barra
    curso: 'POU · 2027-10',
    modelo: { caso: M.CASO, calcular: M.calcular },
    libro: { capitulo: 'bombas.html', pie: 'El modelo es el del capítulo 11 del libro.' },
    controles: {
      Q: { etiqueta: 'Caudal', min: 5, max: 60, paso: 0.5, decimales: 1, unidad: 'm³/h' },
      imp: { etiqueta: 'Impulsor', tipo: 'opciones', opciones: [{ valor: 0.2, texto: '200 mm' }, { valor: 0.25, texto: '250 mm' }] }
    },
    configuraciones: [
      { id: 'caso', ceja: 'Ejemplo 11.2 del libro', titulo: 'El caso del libro', cambios: {},
        fija: 'La línea de agua de servicios a 30 m³/h.', resultado: function (r) { return un(r.H, 1, 'm') + ' de cabeza.'; } }
    ],
    partes: [{ titulo: 'La bomba', escenas: [{
      id: 'punto', titulo: 'El punto de operación', corto: 'Punto',
      pregunta: '¿Dónde se cruzan la curva de la bomba y la del sistema?',
      controles: ['Q'], mas: ['imp'], datos: ['Q'],
      kpis: function (r) { return [
        { etiqueta: 'Cabeza', valor: num(r.H, 1), unidad: 'm', nota: 'a ' + un(r.s.Q, 1, 'm³/h') },
        { etiqueta: 'Eficiencia', valor: num(100 * r.eta, 0), unidad: '%' },
        { etiqueta: 'Potencia', valor: num(r.P, 2), unidad: 'kW', alerta: r.P > r.motor } ]; },
      veredicto: function (r) { return { alerta: r.P > r.motor, html: 'La bomba entrega <b>' + un(r.H, 1, 'm') + '</b> a ese caudal.' }; },
      figuras: [{
        titulo: 'Las dos curvas', tipo: 'svg', vista: [400, 400],
        alt: 'La curva de la bomba y la curva del sistema contra el caudal, con el punto donde se cruzan.',
        montar: function (g) { S.p = D.el('circle', { r: 7, fill: C.amarillo, stroke: C.tinta }, g); },
        poner: function (r) { D.attrs(S.p, { cx: 40 + 5 * r.s.Q, cy: 360 - 6 * r.H }); }
      }],
      calculo: function (r) { return {
        intro: 'El punto de operación es donde la bomba da la cabeza que pide el sistema.',
        pasos: [{ titulo: 'La curva del sistema', texto: 'La cabeza que pide la línea crece con el cuadrado del caudal.',
          ec: 'H = \\Delta z + k\\,Q^2', num: 'H = 12 + ' + kn(r.k, 4) + ' \\times ' + kn(r.s.Q, 1) + '^2 = ' + kn(r.H, 1) + '\\ \\mathrm{m}',
          fuente: 'Las pérdidas de la línea salen del ejemplo 11.2.', libro: ['bombas.html#exm-bom-linea', 'Libro, ejemplo 11.2'] }],
        libro: [['bombas.html#sec-bom-punto', 'Sección 11.3, El punto de operación']] }; }
    }] }]
  });
})();
```

| Clave | Qué es |
|---|---|
| `id` | Nombre corto del explorador; solo lo usan las preferencias de vista (`XL.pref`). |
| `nombre`, `capitulo`, `curso` | El nombre en la barra, en la capa y en las configuraciones; el número del cuadro amarillo; el curso bajo el nombre (`POU · 2027-10`). |
| `modelo` | `{ caso, calcular(estado), ajustar(estado, clave) }`. `caso` es el estado del caso del curso y `calcular` devuelve el resultado `r` que reciben todas las funciones. `ajustar`, opcional, corre después de cada cambio y es lo único que puede tocar otra clave: lo físicamente necesario de la misma magnitud, como recortar una temperatura al rango del fluido nuevo. |
| `libro` | `{ capitulo, pie }` o `{ pie, enlaces: [[ruta, texto], …] }`: el pie del riel con el enlace al capítulo en `libro.luishreyes.com`. Las rutas del libro se escriben sin el dominio (`filtracion.html#exm-fil-winter`). |
| `controles` | Un objeto con un control por clave del estado (ver «Los controles»). |
| `configuraciones` | Las tarjetas de «Configuraciones»; la primera es el caso (ver abajo). |
| `partes` | `[{ titulo, escenas: [escena, …] }, …]`. Una parte que todavía no está lleva `pronto: 'en la próxima entrega'` y en `escenas` solo los títulos: sale en el riel sin enlace. Las escenas se numeran seguidas en todo el riel. |
| `textos` | Opcional: `{ capa, configuraciones, datos }` cambia los textos de entrada de la capa, de las configuraciones y de «Sus datos». |
| `alCambiar(r, estado)` | Opcional: corre después de cada cálculo. |

### Los controles

Cada control cambia solo su clave. Hay tres tipos:

| Clave | Deslizador (sin `tipo`) | `tipo: 'opciones'` | `tipo: 'contador'` |
|---|---|---|---|
| `etiqueta` | sí | sí | sí |
| `min`, `max` | sí (un número, o una función del estado) | | sí |
| `paso` | sí | | opcional (1) |
| `decimales`, `unidad` | sí | | opcional |
| `opciones` | | `['K 250', 'EKS']` o `[{ valor, texto }, …]`; el valor puede ser número, texto o booleano | |
| `menos`, `mas` | | | lo que dicen los botones a un lector de pantalla («Una placa menos») |
| `salida(v)` | | | el texto a la derecha de la etiqueta (el área de las placas, por ejemplo) |
| `formato(v)` | opcional | opcional | opcional: el texto del valor y de «caso: …» |
| `nota` | opcional: una nota corta bajo el control («ilustrativa», «la del florentino») | | |

El armazón pone a cada uno su botón «caso: …», que vuelve ese control al valor del caso. Una escena muestra
`controles` (entre dos y cuatro) y deja los demás en `mas`, dentro de «Más ajustes»; `datos` son los que aparecen en
«Sus datos» de la capa.

### Las configuraciones

`{ id, ceja, titulo, cambios, fija, resultado(r), alerta(r) }`. `cambios` son las claves que la tarjeta cambia sobre el
caso; `fija` dice en una frase qué fija; `resultado` da el número que sale, calculado con el mismo modelo; `alerta`,
opcional, pinta el resultado en rojo cuando pasa de un límite. Al cargar una, el estado vuelve al caso con esos cambios,
la barra muestra su título y «Volver al caso» lleva a la primera. Las configuraciones no van en los controles.

### Las escenas

| Clave | Qué es |
|---|---|
| `id` | El ancla de la escena (`#reposo`). |
| `titulo`, `corto` | El título (en el riel y en la escena) y el corto de la fila del celular. |
| `pregunta` | La pregunta de diseño que la escena responde, en una línea. |
| `controles`, `mas`, `datos` | Las claves de los controles a la vista, de «Más ajustes» y de «Sus datos» en la capa. |
| `info(r)` | Opcional: una nota bajo los controles con lo que llega de una escena anterior; un `<button type="button" data-ir="enfriado">` lleva a esa escena. |
| `kpis(r)` | Tres números: `[{ etiqueta, valor, unidad, nota, alerta }]`. `valor` va ya formateado (`XL.num`); `alerta` lo pinta en rojo. |
| `veredicto(r)` | `{ alerta, html }`: una línea que dice qué significa lo que se ve; la cifra que importa en `<b>`. |
| `prediccion` | La tarjeta para predecir (ver abajo). Opcional. |
| `figuras` | Una o dos figuras (ver «Las figuras»); la primera es la grande y en el celular va arriba. |
| `calculo(r)` | Los pasos de «¿Cómo se calcula?» (ver abajo). |

Las teclas numéricas abren las escenas (la 1, la primera). El botón del veredicto lleva a la escena siguiente y, en la última, a «¿Cómo se
calcula?».

### Las figuras

Cada figura declara su tipo y las funciones de su ciclo de vida. El armazón le crea el cuerpo (un `<svg>`, un
`<canvas>`, un `<div>`), la monta la primera vez que su escena se abre y la anima solo mientras está a la vista.

| Clave | Qué es |
|---|---|
| `titulo` | El rótulo de la cabecera de la figura. |
| `tipo` | `'svg'` (por defecto), `'iso'`, `'canvas'`, `'three'` o `'html'`. |
| `alt` | La descripción para un lector de pantalla: qué se ve y qué cambia. Obligatoria. |
| `ancha` | La figura grande de la escena (más ancha que la otra). `peso`, opcional, da otra proporción. |
| `vista` | `[ancho, alto]` en las unidades del dibujo: el `viewBox` del SVG, las unidades del lienzo o el tamaño de la isométrica. Da también la proporción en el celular. |
| `repetir(r)`, `repetirTexto` | Si la figura tiene una animación que se puede volver a ver, el botón de la cabecera («Repetir el reposo») la llama. Con movimiento reducido el botón no aparece. |
| `liberar` | `true` desmonta la figura cada vez que el estudiante sale de su escena (las 3D lo hacen siempre). |

El ciclo de vida, igual para todos los tipos:

| Función | Cuándo corre |
|---|---|
| `montar(cuerpo, X)` | Una vez, la primera vez que la escena se abre (las isométricas y las 3D, cuando terminan de cargar). Dibuja lo fijo y guarda los elementos que va a mover. |
| `poner(r, modo, X)` | Con cada resultado del modelo mientras la escena está en pantalla. `modo` es `'entrar'` (la escena se acaba de abrir: puede arrancar su animación de entrada), `'cambio'` (el estudiante movió algo: puede animar el paso) o `'fijo'` (solo hay que volver a dibujar, como al cambiar de tamaño). Las escenas que no están en pantalla no reciben `poner`; al abrirse, reciben `'entrar'` con el estado de ese momento. |
| `cuadro(dt, r, X)` | Cada cuadro de animación mientras la figura está activa, con `dt` en segundos (a lo sumo 0,05). |
| `pausar(X)`, `reanudar(X)` | Cuando la figura deja de estar activa y cuando vuelve: otra escena, la pestaña oculta, la capa «¿Cómo se calcula?» abierta, otra vista de la ranura o, en el celular, la figura fuera de la pantalla. Mientras está en pausa no recibe cuadros. |
| `redimensionar(ancho, alto, X)` | Canvas y 3D: cuando cambia el tamaño del recuadro (después viene un `poner` con `'fijo'`). |
| `desmontar(X)` | Al salir de la escena si la figura declara `liberar` (y las 3D siempre), y al cerrar la página. La figura suelta lo suyo; la próxima vez se monta otra vez. |

`X` es el contexto de la figura: `X.reducido()` (movimiento reducido: la figura no se mueve y va derecho al estado
final), `X.R()` y `X.estado()`, y lo propio de cada tipo. Todas las funciones corren con la figura como `this`, así
que pueden guardar ahí lo suyo, o en un objeto de la escena si las dos figuras comparten estado. El armazón monta todas
las figuras sincrónicas de la escena antes del primer `poner`, en orden, así que una figura puede mover elementos que
montó la otra (en el piloto, el avance del filtrado llena las placas de una figura y la barra de la carga de la otra).

Lo que una figura no hace: tener su propio `requestAnimationFrame`, escuchar `resize`, `visibilitychange` o
`IntersectionObserver`, copiar `IsoZoom`, guardar en `localStorage` o cargar three.js por su cuenta. Todo eso lo hace el
armazón.

#### `tipo: 'svg'`, un dibujo propio

El armazón crea el `<svg>` con su `viewBox` (`vista`, por defecto 400 × 400) y lo pasa a `montar`. Las letras se dibujan
con las clases de la hoja (`f-t` para los rótulos de eje, `f-ts` para las notas, `f-v` para las lecturas, `f-vg` para
la lectura grande, `f-tag` para los rótulos de instrumentos) y los colores con `XL.dib.C`, la paleta de las figuras del
libro. `XL.dib` trae lo que se repite: `el` (crea un elemento SVG), `texto`, `attrs`, `mezcla`, `entre`, `azar` (con
semilla), `suave`, `flecha`, `burbuja` (un instrumento ISA), `valvula` y `tangentes` (para una lupa). El dibujo cabe en
su vista y se ve a una escala entre 0,9 y 1,05 en el computador, así que las letras de la hoja quedan en 13 px o más en pantalla.

#### `tipo: 'iso'`, una isométrica del skill `anatomy`

La figura del explorador anterior entra sin rehacerla: su SVG, su CSS y su código en vivo son los mismos que escriben
los `splice.mjs` de `scripts/figuras/` (ver «Los marcadores de las figuras isométricas»). El armazón pone el SVG en la
ranura, le da el acercamiento (pellizco, arrastre, doble toque, ctrl + rueda y los botones + − «todo»), los rótulos y la
carga diferida; la figura solo crea su objeto en vivo y lo mueve.

```js
var bomba = null;
var INSTALACION = {
  titulo: 'La instalación', ancha: true, tipo: 'iso',
  alt: 'Instalación de bombeo en isométrico: el tanque de succión, la bomba con la tapa abierta, el motor y la descarga.',
  variante: function (r) { return r.s.zs >= 0 ? 'inundada' : 'elevacion'; },     // otra figura para otro estado
  svg: function (v) { return 'fig/bomba/bomba-' + v + '.svg'; },                   // el archivo que copia el splice
  vista: function (v) { return [PB_FIGS[v].W, PB_FIGS[v].H]; },                    // los datos que escribe el splice
  montar: function (slot, X) { bomba = new FPump(slot, PB_FIGS[X.variante]); },
  poner: function (r, modo, X) {
    this.o = estadoDeLaFigura(r);                // lo que el código en vivo necesita, salido del modelo
    this.o.dt = 0; this.o.snap = true; bomba.update(this.o);
    var pr = bomba.C.pr, e = PB_FIGS[X.variante].ends;
    X.rotulos([
      { p: pr(e.tank[0], e.tank[1], e.tank[2]), lado: 'i', lineas: ['tanque de succión', 'zₛ = ' + XL.un(r.s.zs, 1, 'm')] },
      { p: pr(e.pd[0], e.pd[1], e.pd[2]), lado: 'd', lineas: ['descarga', XL.un(r.kpd, 0, 'kPa')] }
    ].map(function (q) { return { x: q.p[0], y: q.p[1], lado: q.lado, lineas: q.lineas }; }));
  },
  cuadro: function (dt, r, X) { this.o.dt = X.reducido() ? 0 : dt; this.o.snap = X.reducido(); bomba.update(this.o); },
  desmontar: function () { bomba = null; }
};
```

- El SVG llega de un archivo (`svg`: la dirección, o una función de la variante) o de una `<template>` de la página
  (`plantilla`: su `id`, o una función de la variante; si devuelve vacío, esa variante se trae del archivo). Las
  figuras que el splice escribe en línea (`<!--FLASH_SVG_START-->`) van dentro de una `<template id="fig-flash">` en el
  `<body>`, con sus marcadores adentro.
- `vista` es el tamaño de la figura (`W`, `H` de sus datos); si falta, se toma del `viewBox` del SVG. `origen`, opcional,
  es el origen del `viewBox` cuando no es 0, 0 (como la actividad del ecofiltro).
- `variante(r)` se revisa con cada resultado: si cambia, el armazón desmonta la figura, trae la otra (cada archivo se
  pide una sola vez) y la vuelve a montar, con `X.variante` puesta.
- En `montar`, `slot` es el contenedor con el SVG adentro, y se le pasa al constructor del código en vivo, que lo busca
  con `host.querySelector('svg')`. El contenedor lleva la clase `iso` y `data-theme="light"`, así que el CSS de la
  figura (`.iso[data-theme="light"]`, `.iso-svg`…) aplica tal cual. Si el CSS de la figura pide otra clase en el
  contenedor (como `.hx-fig` en sus reglas del tema), se le da con `clase: 'hx-fig'`.
- `X.svg` es el SVG, `X.zoom` su acercamiento (`XL.IsoZoom`) y `X.rotulos(lista)` pone los rótulos: cada uno
  `{ x, y, lado, lineas }`, con `x`, `y` en unidades del `viewBox` de la figura completa (el punto proyectado con la
  cámara del código en vivo), `lado` `'i'` (el texto a la derecha del punto), `'d'` (a la izquierda) o `'b'` (debajo) y
  la última línea en negrita. Los rótulos siguen al acercamiento y al tamaño, y un rótulo que se saldría del recuadro
  pasa al otro lado de su punto. En la pantalla angosta van menos rótulos: los que leen el estado.
- El código en vivo recibe `dt = 0` y `snap` con movimiento reducido: la figura queda quieta en el estado del modelo.

#### `tipo: 'canvas'`, un lienzo

El armazón crea el `<canvas>`, lo mide con la densidad de la pantalla y lo vuelve a medir cuando cambia el recuadro.
Con `vista: [ancho, alto]` la figura dibuja en esas unidades, centradas y a escala, como en un `viewBox` (es lo que
conviene para una simulación que ya corre en un lienzo de tamaño fijo, como la de molienda de 900 × 490); sin `vista`,
dibuja en píxeles CSS del recuadro, y `proporcion: [4, 3]` da la forma en el celular. `X.ctx` es el contexto 2D, ya
escalado; `X.ancho` y `X.alto`, las unidades; `X.limpiar()` borra el lienzo entero, márgenes incluidos.

```js
var CORTE = {
  titulo: 'El molino en corte', ancha: true, tipo: 'canvas', vista: [900, 490],
  alt: 'El molino de bolas en corte, con la carga que sube con los levantadores y cae en cascada.',
  montar: function (cv, X) { this.sim = new MillAnim(); },                       // la simulación de siempre, sin su propio reloj
  poner: function (r, modo, X) { this.sim.configurar(r); this.dibujar(X); },
  cuadro: function (dt, r, X) { if (!X.reducido()) this.sim.paso(dt); this.dibujar(X); },
  dibujar: function (X) { X.limpiar(); this.sim.dibujar(X.ctx, X.ancho, X.alto); }
};
```

#### `tipo: 'three'`, una escena 3D

El armazón carga three.js y OrbitControls la primera vez (`XL.three()`), crea el `WebGLRenderer` sobre su canvas y llama
a `montar(canvas, X)` con `X.THREE` y `X.OrbitControls`. `montar` arma `X.escena` y `X.camara` (obligatorias) y, si
quiere, `X.controles`. Mientras la figura está activa, en cada cuadro corren `cuadro`, `X.controles.update()` y el
dibujo; en pausa no se dibuja nada. Al salir de la escena se libera todo: geometrías, materiales, texturas, controles y
el contexto WebGL; al volver, se monta otra vez. Con `bajoDemanda: true` solo se dibuja después de `poner`, de mover la
cámara o de `X.redibujar()`, para una escena que no se anima sola.

```js
var PLATO = {
  titulo: 'El plato en 3D', ancha: true, tipo: 'three', proporcion: [4, 3],
  alt: 'Tres platos perforados de una columna, con el líquido que cruza cada plato y baja por el bajante.',
  montar: function (cv, X) {
    var T = X.THREE;
    X.escena = new T.Scene();
    X.camara = new T.PerspectiveCamera(32, 4 / 3, 0.01, 40); X.camara.position.set(2, 1.6, 2.4);
    X.controles = new X.OrbitControls(X.camara, cv); X.controles.enableDamping = true;
    X.escena.add(new T.HemisphereLight(0xffffff, 0xb8c2cc, 1.25));
    this.raiz = new T.Group(); X.escena.add(this.raiz);
  },
  poner: function (r, modo, X) { /* rehacer la geometría con el plato del resultado; liberar la vieja */ },
  cuadro: function (dt, r, X) { /* mover el líquido; nada con X.reducido() */ }
};
```

#### `tipo: 'html'`, un bloque de HTML

Para una tabla, un catálogo de gráficas o una tarjeta: `montar(div, X)` recibe un `<div>` con desplazamiento propio.

#### Las vistas de una figura

Cuando una figura tiene dos maneras de verse (la máquina en isométrico y el corte en canvas del molino, por ejemplo),
se declara una ranura con `vistas`, y la cabecera lleva los botones para escoger. Cada vista es una figura completa,
con su `etiqueta`, su tipo y su ciclo de vida, y hereda de la ranura el `titulo` y el `alt` que no declare. Solo la
vista escogida está montada y activa; la otra queda en pausa (o se desmonta, si declara `liberar`).

```js
{ titulo: 'El molino', ancha: true, alt: 'El molino de bolas.', vistas: [
  { etiqueta: 'Máquina', tipo: 'iso', svg: 'fig/molienda/molino-bolas.svg', montar: …, poner: …, cuadro: … },
  { etiqueta: 'Corte', tipo: 'canvas', vista: [900, 490], montar: …, poner: …, cuadro: … }
] }
```

### La predicción

```js
prediccion: {
  base: { reposo: 8 }, llevar: { reposo: 16 },
  pregunta: function (rb) { return 'Con 8 h de reposo se purga el ' + XL.pct(rb.eta) + ' del agua libre. Si el reposo dura 16 h, ¿cuánto se purga?'; },
  opciones: ['El doble', 'Más, pero menos del doble', 'Lo mismo'],
  instruccion: 'Lleve las horas de reposo a 16 y mire el número del centro.',
  cumple: function (estado) { return Math.abs(estado.reposo - 16) < 0.001; },
  correcta: function (rn, rb) { var q = rn.eta / rb.eta; return q > 1.97 ? 0 : q < 1.03 ? 2 : 1; },
  explica: function (rn, rb) { return 'Con 16 h cada gota baja el doble…'; }
}
```

`rb` es el resultado con el estado del estudiante y los cambios de `base`; `rn`, con los de `llevar`. La respuesta
correcta sale del modelo (`correcta` devuelve el número de la opción), nunca se escribe a mano, y `explica` usa los
números de los dos resultados. El estudiante escoge una opción, la tarjeta le pide mover el control (o «Llevarlo ahí»
lo hace por él) y, cuando el estado cumple, se revela. No hay puntaje y no se guarda nada. Hasta cuatro opciones.

### «¿Cómo se calcula?»

```js
calculo: function (r) { return {
  intro: 'Lo que el cálculo de la escena responde, en dos frases.',
  pasos: [
    { titulo: 'La gota de corte',
      texto: 'Lo que dice el paso, en prosa, con la voz del libro y sin copiarlo.',
      ec: 'd_c = \\left(\\frac{18\\,\\mu\\,H}{g\\,\\Delta\\rho\\,t_r}\\right)^{1/2}',
      num: 'd_c = … = ' + XL.kn(r.dc * 1e6, 2) + '\\ \\mathrm{\\mu m}',
      res: 'Una frase con el resultado, si hace falta.',
      fuente: 'De dónde sale cada dato que no es del estudiante.',
      libro: ['sedimentacion-y-decantacion.html#eq-sed-arrastre', 'Libro, ecuación 17.14'] }
  ],
  libro: [['filtracion.html#exm-fil-winter', 'Ejemplo 18.5, la winterización del aceite']]
}; }
```

- `ec` es la ecuación en LaTeX; `num`, la misma con los números en pantalla, en renglones separados con `\\`. Los
  números van con `XL.kn` (coma decimal y espacio de miles para KaTeX) y `XL.kc` (notación científica). En el celular,
  el armazón parte las ecuaciones largas antes del último «=» y en cada `\qquad`.
- La capa muestra un paso y el botón «Siguiente paso»; al final, la lista «En el libro» con los enlaces de `libro`.
- Cada paso con una ecuación lleva su `libro`, el ancla de la ecuación, la sección o el ejemplo en el libro en línea,
  y su `fuente` cuando el dato no es del estudiante. La ecuación y los números deben ser los del libro; lo que el libro
  no trae se marca como del explorador.

### La redacción

- Español con tildes y trato de usted. Nada de rayas para incisos, ni «de X a Y», ni «no solo… sino».
- Los títulos (de la escena, de la figura, de la configuración, del paso) nombran el tema con un sustantivo o una frase
  nominal corta («El reposo», «La gota de corte», «Sin reposo»), nunca la conclusión. La pregunta de la escena es una
  pregunta de diseño, y la respuesta va en los números y en el veredicto.
- Ningún párrafo empieza con un rótulo en negrita; la negrita queda para la cifra que importa en el veredicto.
- El veredicto es una sola línea que dice qué significa lo que se ve, con el número; el texto de los pasos es prosa con
  la voz del profesor. No se copia texto del libro al sitio: se escribe de nuevo y se remite a su sección.
- Velocidad de giro en r/min, miles con espacio (14 264), coma decimal, «estado estacionario» y «cantidad de
  movimiento», como en el libro.
- Los colores tienen un solo significado: rojo solo para lo que pasa de un límite (`alerta` en un número, en un
  veredicto o en una configuración), amarillo solo como campo y marca, nunca como texto.

### Los marcadores de las figuras isométricas

Los `splice.mjs` de `scripts/figuras/*/` reemplazan lo que hay entre dos marcadores. Cada uno escribe por defecto en el
explorador de 2026-20, que sigue en curso:

| Script | Marcadores | Escribe en (por defecto) | Ruta como argumento | Archivos aparte |
|---|---|---|---|---|
| `filtro-prensa/splice.mjs` | `/*FPRESS_CSS_START*/`, `<!--FPRESS_SVG_START-->`, `/*FPRESS_JS_START*/` (y sus `_END`) | `iqya-2031-2026-20/simulaciones/Explorador_Filtracion.html` | sí | |
| `filtro-tambor/splice.mjs` | `FDRUM_CSS`, `FDRUM_SVG`, `FDRUM_JS` | el mismo | sí | |
| `flash/splice.mjs` | `FLASH_CSS`, `FLASH_SVG`, `FLASH_JS` | `iqya-2031-2026-20/simulaciones/Explorador_Equilibrio_Flash.html` | sí | |
| `alambique/splice.mjs` | `STILL_CSS`, `STILL_SVG`, `STILL_JS` | `iqya-2031-2026-20/simulaciones/Explorador_Destilacion_por_Lotes.html` | sí | `fig/alambique/columna.svg`, junto a la página que recibe |
| `ecofiltro/splice.mjs` | `ECO_CSS`, `ECO_SVG`, `ECO_JS` | `iqya-2031-2026-20/simulaciones/Explorador_Ecofiltro.html` | sí | |
| `bomba/splice.mjs` | `/*PBFIG_START*/`, `/*PBFIG_CSS_START*/` (y sus `_END`) | `iqya-2031-2026-20/simulaciones/Explorador_Bombas_Centrifugas.html` | no | `fig/bomba/bomba-inundada.svg` y `bomba-elevacion.svg` de 2026-20 |
| `intercambiador/splice.mjs` | `HXFIG`, `HXFIG_CSS`, `PLFIG`, `PLFIG_CSS`, `DPFIG`, `DPFIG_CSS`, `ACFIG`, `ACFIG_CSS` | `iqya-2031-2026-20/simulaciones/Explorador_Intercambiadores.html` | no | `fig/intercambiador/` de 2026-20 (`tc-*.svg`, `placas.svg`, `doble.svg`, `aero-par.svg`, `aero-impar.svg`) |
| `molienda/splice.mjs` | `MLFIG`, `MLFIG_CSS` | `iqya-2031-2026-20/simulaciones/Explorador_Molienda.html` | no | `fig/molienda/` de 2026-20 (`molino-*.svg` y un `tamiz-N.svg` por cada número de tamices) |

Los marcadores `_CSS` y `_JS` son comentarios de CSS y de JavaScript (`/*X_START*/ … /*X_END*/`); los `_SVG`, comentarios
de HTML (`<!--X_SVG_START--> … <!--X_SVG_END-->`). Los de bombas, intercambiadores y molienda no tienen `_SVG`: sus SVG
van en archivos aparte, en `simulaciones/fig/{equipo}/`, y la página los pide cuando hacen falta.

Al pasar un explorador al armazón:

- Cada marcador queda una sola vez en el archivo, con el nombre exacto. Ningún comentario, texto ni cadena del código lo
  repite: los scripts buscan la primera aparición y escriben ahí. El bloque de adentro se copia tal cual desde el
  explorador anterior, sin editarlo a mano: lo que cambie se pierde con el próximo splice.
- El bloque `_CSS` va en el `<style>` de la página; el bloque `_JS`, en su propio `<script>`, antes del armazón; el
  bloque `_SVG`, dentro de una `<template id="…">` del `<body>`, con `plantilla: 'id'` en la figura. Fuera de los
  marcadores van la figura del armazón (`montar`, `poner`, `cuadro`) y lo que traduce el resultado del modelo al estado
  que espera el código en vivo (`stateOf` en el explorador de bombas, por ejemplo).
- Las versiones de 2027-10 que ya existían (bombas, intercambiadores y molienda) tienen los bloques copiados entre los
  mismos marcadores. Las de bombas y molienda piden sus SVG a `fig/bomba/` y `fig/molienda/` de 2027-10 (copias de los
  de 2026-20, con `molino-cuch.svg`, que solo está en 2027-10); la de intercambiadores, a
  `/classroom/iqya-2031-2026-20/simulaciones/fig/intercambiador/`. Se conservan esas direcciones.
- Mientras 2026-20 siga en curso, no se cambia el destino por defecto de ningún `splice.mjs`. Para rehacer la figura de
  un explorador de 2027-10, se le pasa la ruta del HTML a los scripts que la aceptan
  (`node splice.mjs ../../../public/classroom/iqya-2031-2027-10/simulaciones/Explorador_….html`); a los tres de ruta
  fija se les agrega un argumento opcional igual, sin cambiar lo que hacen sin él, y los SVG se copian a la carpeta
  `fig/` que pide la página de 2027-10.
- `scripts/revisar-simuladores.mjs` quita los bloques `*_CSS_START … *_CSS_END` antes de revisar el `<style>` propio:
  el CSS generado no cuenta para los mínimos.

### El paso de un explorador anterior

1. Se separa el modelo en `<script id="modelo">`, sin una línea que toque la página, y se comprueba que da los mismos
   números que el explorador anterior con las mismas entradas (y los del libro, si el capítulo los trae).
2. Se reparten las pestañas en escenas, cada una con una pregunta de diseño, tres números, una o dos figuras y un
   veredicto. Lo que no cabe en una pantalla va a otra escena, a «Más ajustes» o a la capa; nada del contenido se pierde.
3. Las configuraciones pasan como tarjetas con su resultado; el caso del curso es la primera.
4. Cada figura pasa a una figura del armazón: se quitan su `requestAnimationFrame`, su `IsoZoom`, sus escuchas de
   `resize` y de visibilidad, su `store` de `localStorage` y sus controles de papel o blueprint; los bloques entre
   marcadores se copian tal cual.
5. Las ecuaciones de las pestañas de modelo pasan a los pasos de «¿Cómo se calcula?», con el enlace al libro.
6. Se quitan `simulador.css`, `/classroom-fonts.css` y Manrope; entran la hoja, el kit de Dax y el armazón.

### Las herramientas del armazón

| Nombre | Qué hace |
|---|---|
| `XL.num(x, d)`, `XL.un(x, d, u)`, `XL.pct(f, d)` | Números con coma decimal, espacio de miles desde 10 000 y signo menos tipográfico; con unidad; en porcentaje. |
| `XL.kn(x, d)`, `XL.kc(x, d)`, `XL.hc(x, d)` | El número para KaTeX; en notación científica para KaTeX; en notación científica para HTML. |
| `XL.K(tex)`, `XL.Ki(tex)`, `XL.enlace(ruta, texto)` | KaTeX en bloque y en línea; un enlace al libro en línea que abre en otra pestaña. |
| `XL.ico(id)`, `XL.simbolos({ id: '<path …/>' })` | Un ícono Lucide del sprite del armazón; agrega íconos al sprite. |
| `XL.dib` | Las piezas de dibujo en SVG y la paleta `XL.dib.C` (ver `tipo: 'svg'`). |
| `XL.IsoZoom`, `XL.three()` | El acercamiento de las isométricas; la promesa de three.js y OrbitControls. |
| `XL.pref(clave[, valor])` | Una preferencia de vista que se recuerda entre visitas (bajo `xl:{id}:`). Nunca un valor del modelo: el explorador arranca siempre en el caso. |
| `XL.reducido()` | Si el estudiante pidió movimiento reducido. |
| `window.Explorador` | Para las pruebas: `estado()`, `R()`, `escena()`, `escenas`, `ir(i)`, `cambiar(clave, valor)`, `ponerVarios({…})`, `abrirCapa()`, `cerrarCapa()`, `abrirCfg()`, `cerrarCfg()`, `cargarCfg(id)` y `figura(escena, n)`, que da `{ estado, activa, X }` de una figura. |

Los identificadores de la página también son fijos y sirven a las pruebas: `#titulo`, `#pregunta`, `#kpis`,
`#veredicto`, `#verTx`, `#btnSig`, `#pred` (opciones `[data-op]`, `[data-llevar]`, `[data-otra]`), `#ctl` (con
`[data-caso]`, `.xl-seg [data-v]`, `[data-d]`), `#casoNom`, `#casoMod`, `#casoReset`, `#btnCfg`, `#cfgs [data-cfg]`,
`#btnCalc`, `#capa`, `#capaDatos`, `#doc` (`[data-paso]`, `[data-todos]`, `#paso-N`), `#capaX`, `#btnHoja` y `#riel
[data-escena]`.

### La verificación

Antes de publicar un explorador pasado al armazón:

1. Una prueba en Node carga `<script id="modelo">` con `vm`, sin navegador, y compara cada número del modelo con el
   libro (el `caso.json` que escribe la herramienta del capítulo, o las cifras del texto con sus decimales) o
   con el explorador anterior con las mismas entradas. El piloto tiene 87 comprobaciones; cada explorador, las de su
   caso, sus configuraciones y sus predicciones.

   ```js
   import fs from 'node:fs'; import vm from 'node:vm';
   const html = fs.readFileSync(RUTA, 'utf8');
   const ctx = { window: {}, Math }; vm.createContext(ctx);
   vm.runInContext(html.match(/<script id="modelo">([\s\S]*?)<\/script>/)[1], ctx);
   const R = ctx.window.Modelo.calcular({ ...ctx.window.Modelo.CASO });
   ```

2. Una prueba con Playwright recorre cada escena con las teclas, contesta cada predicción con
   «Llevarlo ahí», carga cada configuración, vuelve al caso, mueve un dato en la capa y mira que cambien las cuentas,
   cierra con Esc y revisa los avisos en rojo, los errores de la consola y que `localStorage` quede vacío.
3. Se capturan cada escena y la capa a 1440 × 900, 1366 × 768 y 390 × 844 (en el celular, también con la hoja de
   controles abierta), con las animaciones terminadas, y se miran una por una: nada cortado, nada encima de otra cosa,
   las letras de 13 px o más, la página sin desplazarse en el computador.
4. Se corre la revisión común, `node scripts/revisar-simuladores.mjs Nombre`. Para los exploradores con el armazón revisa,
   además de los mínimos de siempre, que carguen la hoja, el armazón, KaTeX y el kit de Dax, que el modelo esté en
   `<script id="modelo">`, que el `<style>` no redefina los colores ni la letra del libro, que cada escena quepa sin
   desplazar la página a 1440 × 900 y a 1366 × 768, que la capa de cada escena tenga pasos y que no se guarde en
   `localStorage` nada que no sea una preferencia de vista.

En la nube, Playwright está en `/opt/node22/lib/node_modules/playwright/index.mjs` y Chromium se abre con
`chromium.launch({ args: ['--no-sandbox'] })` (para las figuras 3D, si WebGL no arranca, se agregan
`--enable-unsafe-swiftshader` y `--use-angle=swiftshader`). Sin servidor propio: la página se sirve desde `public/` con
`context.route('http://x.local/**', …)`, y el kit de Dax se responde con una hoja vacía
(`context.route('https://use.typekit.net/**', (r) => r.fulfill({ status: 200, contentType: 'text/css', body: '' }))`),
así que las capturas salen con Archivo, la letra de respaldo.
