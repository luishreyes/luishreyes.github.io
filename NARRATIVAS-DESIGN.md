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
Al **imprimir**, un `@media print { :root { … } }` los vuelve a mapear a una paleta clara
(papel blanco, texto oscuro): el tema oscuro es solo de pantalla.

## Tipografía

- Titulares: **Big Shoulders Display** (`--nv-font-display` / `--display`). Pesos 300–500,
  MAYÚSCULA en héroes y títulos de sección, tracking ~0.
- Texto/etiquetas: **Archivo** (`--nv-font-text` / `--tipo`).
- React autoaloja las fuentes (sin CDN). El `programa.html` las carga por **Google Fonts CDN**
  (igual que antes cargaba Source Sans). Si se requiere 100% offline, autoalojar también ahí.

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
- **Presentaciones:** al construirlas para este curso, usar la paleta y las fuentes de aquí.
- **Cualquier superficie nueva:** envolver en `.nv-course`, reutilizar los tokens `--nv-*`,
  aplicar las reglas móvil/tablas/nada-de-azul de arriba.

## Principios heredados que siguen aplicando

Del `CLAUDE.md`: nada de emojis como íconos (SVG), toda plataforma/herramienta es un enlace
clickeable, KaTeX para fórmulas, español con tildes correctas, imágenes B&W. Este documento
**añade** la capa de identidad; no reemplaza esos principios.
