# Identidad gráfica — Narrativas Visuales de Datos con IA Generativa (IQYA-3751)

> **Leer antes de tocar cualquier superficie del curso `iqya-3751-2026-20`.**
> Este curso NO usa el landing claro compartido ni el syllabus Deloitte de los demás
> cursos: tiene identidad propia. Todo lo que se construya para él debe respetar este documento.

## Filosofía

Identidad **cinematográfica, no corporativa/académica**. Tres familias, tres roles:

- **Carbón** (`#0A0A0A` base) — el escenario. Domina ~70% de cualquier superficie.
- **Hueso** (`#E8E6E1`) — el texto y el aire. ~20%.
- **Citrón** (`#C9C41C`) — el **único** foco. ~10%: titulares, la marca, un enlace, el dato que importa.

La paleta **es la pedagogía**: todo es contexto (gris) hasta que una cosa se vuelve el foco
(citrón), exactamente la disciplina de *Storytelling with Data* que enseña el curso. Nunca
citrón como relleno grande; nunca citrón junto a otro color saturado.

Señal de apoyo única: **clay** `#C8623A`, **solo** para negativos/ética (ejes truncados,
riesgos). **No hay azul, verde, violeta ni ningún otro acento.** Ver «Regla: nada de azul».

Tipografía: **Big Shoulders Display** (condensada, cinematográfica) en titulares;
**Archivo** en cuerpo y etiquetas. Etiquetas en MAYÚSCULA con tracking ancho (`0.28em`).
La jerarquía viene del **tamaño y el peso**, no del color.

Motivo de marca: el **visor** (cuatro esquinas citrón, «rectángulo amarillo cortado»). Es un
dispositivo de marca, no un ícono; se dibuja en CSS/JSX, nunca como imagen.

## Dónde vive cada cosa

| Superficie | Archivo | Notas |
|---|---|---|
| **Landing** del curso | `pages/classroom/NarrativasLandingPage.tsx` | Ramificado por slug en `CourseLandingPage.tsx` (mismo patrón que `EduProLandingPage`). |
| **Material del curso** | `pages/classroom/NarrativasReadingsPage.tsx` | Ramificado por slug en `ReadingsIndexPage.tsx`. |
| **Tema (tokens + componentes)** | `components/classroom/narrativas-theme.css` | Todo bajo `.nv-course` para no filtrar el tema oscuro al resto del portafolio. |
| **Programa (syllabus)** | `public/classroom/iqya-3751-2026-20/programa.html` | HTML autocontenido, dirigido por variables CSS. |
| **Fuentes (React)** | `index.tsx` | `@fontsource-variable/big-shoulders-display` + `@fontsource-variable/archivo`, autoalojadas. |
| **Acento del gate/índice** | `.accent-citron` en `index.css` + `accent: 'citron'` en los datos | Alinea el gate de acceso y la tarjeta del índice con el landing. |

## Paleta (tokens)

**React (`narrativas-theme.css`, prefijo `--nv-`):**

| Rol | Token | Valor |
|---|---|---|
| Fondo (escenario) | `--nv-bg` | `#0A0A0A` |
| Superficie / superficie 2 | `--nv-surface` / `--nv-surface-2` | `#141412` / `#1A1A17` |
| Texto / apagado / tenue | `--nv-text` / `--nv-text-muted` / `--nv-text-faint` | `#E8E6E1` / `#B8B6AE` / `#86847C` |
| Acento (el foco) | `--nv-accent` (`--nv-accent-hover`) | `#C9C41C` (`#DCD733`) |
| Negativo (ética) | `--nv-signal-negative` | `#C8623A` |
| Borde / borde foco | `--nv-border` / `--nv-border-focus` | `rgba(232,230,225,.16)` / `rgba(201,196,28,.55)` |

**Programa (`programa.html`):** reutiliza los nombres heredados (`--verde`, `--gris-*`,
`--papel`, `--blanco`, `--ambar`) **re-mapeados** a la paleta oscura. `--verde` = citrón,
`--gris-1..5` = escala hueso→carbón, `--papel/--blanco` = superficies carbón, `--ambar` = clay.
En **pantalla** es oscuro; para **PDF/impresión** el bloque `@media print` los re-mapea a la
paleta clara (ver «PDF imprimible»).

## Regla: todo material guía tiene versión online + versión imprimible (PDF)

**Toda guía del curso** (el programa y cualquier material guía futuro) se publica en dos
versiones que salen del **mismo HTML**:

1. **Online** — el HTML oscuro (carbón · hueso · citrón) que se abre desde Material del curso.
2. **Imprimible** — un **PDF** en el formato «documento claro» del design system (plantilla
   Guía), enlazado con un botón «Descargar (PDF)» dentro de la versión online.

El mecanismo es el del programa: un solo archivo cuyo `@media print` re-mapea los tokens a la
paleta clara, y un script que lo pagina a carta y exporta el PDF estático junto al HTML.
**Nunca** dos copias del contenido; **siempre** regenerar el PDF al editar la guía.

### El caso implementado: el programa

El programa vive en **un solo archivo** (`programa.html`): en pantalla es oscuro y, al emular
`print`, el mismo archivo se convierte en el **«documento claro»** del design system (plantilla
Guía). No hay dos copias del contenido — hay un web oscuro y un PDF claro que salen del mismo HTML.

**Formato del PDF** (según la plantilla Guía del design system — tinta carbón sobre papel,
citrón como resaltado):
- **Portada** con las esquinas del visor en carbón, badge citrón, título Big Shoulders con una
  palabra sobre resaltado citrón (`<span class="hl">`), subtítulo, metadatos e **índice** numerado.
- **Capítulos numerados** (contador CSS `01…14`) con una regla citrón corta bajo el título.
- **Callouts** estilo CLAVE / ÉTICA (regla lateral + etiqueta tracked, sin ícono).
- **Tablas** claras, caja enmarcada (visor) en carbón, barras de nota en citrón.
- **Cabecera/pie** repetidos por página (los agrega el generador de PDF), tamaño **carta**.

**Cómo se genera:** `node scripts/build-programa-pdf.mjs` (requiere `npm i -D playwright`).
Abre `programa.html`, emula `print`, y lo pagina a carta con cabecera/pie → escribe
`public/classroom/iqya-3751-2026-20/programa.pdf`. **Regenerar cada vez que cambie el contenido
del programa**, porque el PDF es un artefacto estático (el web y el PDF comparten el HTML, pero
el PDF hay que volver a exportarlo).

**Descarga:** botón `.dl-btn` (solo pantalla) en el encabezado del web que apunta a
`programa.pdf` con `download`. El índice `.doc-index` es al revés: solo impresión.

## Tipografía

- Titulares: **Big Shoulders Display** (`--nv-font-display` / `--display`). Pesos 300–500,
  MAYÚSCULA en héroes y títulos de sección, tracking ~0.
- Texto/etiquetas: **Archivo** (`--nv-font-text` / `--tipo`).
- **Todas autoalojadas, sin CDN** (convención del repo). React vía `@fontsource-variable`
  (`index.tsx`); el `programa.html` vía `@font-face` con rutas relativas a `public/fonts/`
  (`big-shoulders-display-*.woff2`, `archivo-*.woff2`). ⚠️ Nunca usar Google Fonts CDN: además
  de romper la convención, el PDF se genera en un entorno sin acceso al CDN y saldría con
  fuentes del sistema equivocadas (ya pasó una vez).

## Reglas de layout (obligatorias)

### Regla móvil: **evitar dos columnas**
En móvil las cajas en doble columna quedan muy angostas y se ven espichadas. **Una sola columna.**
- React: los `.nv-grid-2/3/5` colapsan a 1 columna en `≤760px`.
- Programa: `.twocol`, `.qcards`, `.doc-meta` colapsan a 1 columna en `≤600px`.
- Al agregar cualquier grid nuevo, darle su colapso a 1 columna en móvil.

### Regla tablas: **siempre scrolleables de lado**
Una tabla nunca se espicha en móvil: se desliza horizontalmente.
- React: envolver en `.nv-table-wrap` (`overflow-x:auto`, `min-width:0`) con `min-width` en la tabla.
- Programa: envolver cada `<table>` en `<div class="tbl-wrap">` (`overflow-x:auto`) y darle
  `min-width` a la tabla (`table.tbl` 560px, `table.rubrica` 520px).

### Regla: **todo gráfico lleva ejes, escala y etiquetas**
Es un curso de visualización de datos: un gráfico sin eje Y (con su escala), sin eje X y sin
títulos de eje es inaceptable. Se dibujan en **SVG** con eje Y (línea + ticks + valores),
gridlines tenues, eje X con categorías y títulos de eje en mayúscula tracked. El generador está
en `scratchpad`/`svggen.py` (patrón de referencia); los `var(--x, fallback)` hacen los SVG
portables entre lectura, deck y web. **Ejemplo pedagógico clave:** el demo del eje truncado
muestra el eje Y (empieza en 96 %) al lado de la versión honesta (0 %) — el eje visible ES lo que
revela el truco.

### Material del curso unifica todo
La página **Material del curso** es la única entrada al contenido: reúne **Lecturas de clase**,
**Presentaciones** (decks, abren en pestaña nueva) y **Guías**. No hay página independiente de
presentaciones ni tarjetas separadas en el landing (el acceso es el botón «Material del curso»
del hero).

### Presentaciones: deck 16:9 con pantalla completa
Los decks siguen `templates/presentacion` del design system, son autónomos (navegación por
teclado ← → , botones, contador, barra de progreso) y llevan **botón de pantalla completa** (⛶ /
tecla F). Las diapositivas interactivas (p. ej. cazar el engaño) togglean con JS vanilla.

### Regla: **nada de azul**
La paleta es carbón · hueso · citrón, con clay solo para negativos. **No introducir azul,
teal, verde ni violeta.** El callout de tipo «nota/info» del programa es **neutro** (hueso),
no azul. Si algo necesita distinguirse, usar peso/tamaño o el foco citrón, no un color nuevo.

## Componentes

Todos viven en `narrativas-theme.css` (React) y su equivalente en `programa.html`:

- **Card** (`.nv-card`): superficie carbón, borde hairline, radio 4px. Variante `--framed`
  (borde citrón) y `--interactive` (lift 2px + borde fuerte al hover).
- **Botón** (`.nv-btn--primary/--secondary`): MAYÚSCULA tracked, esquinas 2px. Primario = citrón
  sobre carbón (texto oscuro `--nv-on-accent`); nunca texto citrón sobre citrón.
- **Callout** (`.nv-callout--focus/--ethics`; en programa `--tip/--etica/--nota`): regla lateral
  en el color del tono. La ética usa clay y es **hilo conductor permanente** del curso.
- **Badge / label / eyebrow**: etiquetas MAYÚSCULA con tracking ancho.
- **Visor** (`.nv-frame` + `<span class="nv-frame-b">`): cuatro esquinas citrón. El dispositivo
  de marca. Se usa en el wordmark, en la tarjeta de Material y en el visor de scroll.
- **Stat**, **ProgressTrack** (arco de 16 semanas), tarjetas de material (`.nv-rc`).

## El visor: marco estático y estratégico

El visor (cuatro esquinas citrón) es un **acento estático**, usado con moderación para enmarcar
**solo las cajas que sostienen el foco**. No es un efecto de scroll (se probó un visor que
seguía el scroll «enfocando» cada bloque y **se descartó**: se veía inquieto/ruidoso).

**Regla:** una o dos cajas enmarcadas por superficie, como máximo. Enmarcar de más mata el efecto.

- React: clases `nv-card--framed nv-frame` + `<span class="nv-frame-b" />` en la tarjeta
  (utilidad en `narrativas-theme.css`). Hoy: la tarjeta **«Material del curso»** (acción
  principal) y la cifra **«100 % · portafolio»** de Evaluación.
- Programa: clase `framed` + `<span class="fb"></span>` dentro de la caja (utilidad en
  `programa.html`). Hoy: el callout **«Por qué importa»** (la tesis del curso).
- El wordmark del hero también usa el visor (es la marca). Eso no cuenta como «caja enmarcada».

## Cómo extender manteniendo la identidad

- **Nuevas lecturas/guías:** se agregan al array `readings` del curso como siempre
  (ver `LECTURAS-HTML.md`); la página de Material ya las renderiza en la identidad. Las lecturas
  HTML autocontenidas deben adoptar la misma paleta carbón/hueso/citrón (no el `deloitte.css` claro).
  **Todo material guía sale en las dos versiones** (online oscura + PDF documento claro con botón
  de descarga) — ver la regla de arriba; copiar el patrón de `programa.html` +
  `scripts/build-programa-pdf.mjs`.
- **Presentaciones:** al construirlas para este curso, usar la paleta y las fuentes de aquí.
- **Cualquier superficie nueva:** envolver en `.nv-course`, reutilizar los tokens `--nv-*`,
  aplicar las reglas móvil/tablas/nada-de-azul de arriba.

## Principios heredados que siguen aplicando

Del `CLAUDE.md`: nada de emojis como íconos (SVG), toda plataforma/herramienta es un enlace
clickeable, KaTeX para fórmulas, español con tildes correctas, imágenes B&W. Este documento
**añade** la capa de identidad; no reemplaza esos principios.
