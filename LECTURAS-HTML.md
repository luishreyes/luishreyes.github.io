# Lecturas del Classroom — Plantilla HTML autocontenida (SISTEMA ACTUAL)

> **Leer SIEMPRE este documento antes de crear o editar una lectura del curso POU 2026-20 (`iqya-2031-2026-20`, accessCode `POU202620`) y cualquier curso nuevo.**
>
> Este es el sistema **vigente**. El antiguo sistema de componentes React (`LECTURES.md`) quedó **deprecado** para los cursos nuevos — ver la nota al final.

---

## Regla de oro

**Todas las lecturas de un curso deben verse y comportarse EXACTAMENTE igual.** Una lectura no es un experimento de diseño: es una pieza de una colección. Si abres dos lecturas distintas, deben ser indistinguibles en estructura, colores, tipografía, navegación y animaciones. La única diferencia es el contenido.

La **plantilla canónica** es:

```
public/classroom/iqya-2031-2026-20/lecturas/Lectura_06/Lectura_06_Agitacion.html
```

---

## ⛔ PASO 0 OBLIGATORIO Y BLOQUEANTE — copiar, nunca crear desde cero

> **Antes de escribir una sola línea de una lectura nueva, el primer comando SIEMPRE es copiar una lectura existente.** No se autora el shell desde cero. No se "recrea" la estructura de memoria. Se parte de un archivo real que ya está en producción.

```bash
cp -r public/classroom/{curso}/lecturas/Lectura_{NN-1} \
      public/classroom/{curso}/lecturas/Lectura_{NN}
# luego renombrar el .html y reemplazar SOLO el contenido
```

**Y no basta con mirar "la anterior" — hay que mirar LAS ANTERIORES (todas).** La colección es la fuente de verdad, no la última lectura sola:

1. **Lista todas las lecturas existentes** del curso antes de empezar:
   ```bash
   ls public/classroom/{curso}/lecturas/
   ```
2. **Copia la de número más alto** como base (es la más reciente y ya validada).
3. **Compara tu archivo nuevo contra el conjunto** para detectar cualquier desviación. Las clases, el `<head>`, el `<style>` y los scripts deben ser un subconjunto de lo que ya usan las demás. Si aparece una clase, una fuente o un bloque de estilo que **ninguna otra lectura tiene**, te desviaste — vuelve al Paso 0.

> **El error real que motivó esta regla:** una lectura se generó con un sistema de diseño propio (otra fuente, otro fondo, clases inventadas como `.gal-*`, `.feq-*`, `.chart-wrap`, `.challenges`). El `deloitte.css` era idéntico, pero todo el `<style>` interno y el markup eran otros, así que se veía **distinta a todas las demás**. Hubo que reescribirla entera. Copiar desde el Paso 0 lo habría evitado por completo.

Nunca se inventa una estructura nueva, ni se usan componentes React, ni Tailwind, ni `ReadingLayout`.

---

## Qué ES una lectura (y qué NO es)

| ✅ ES | ❌ NO ES |
|---|---|
| Un **archivo HTML autocontenido** en `public/classroom/{courseSlug}/lecturas/Lectura_NN/` | Un componente `.tsx` en `pages/classroom/.../readings/` |
| Abre en **pestaña nueva** (`href` + `target="_blank"`) | Una ruta React in-app (`/classroom/.../readings/slug`) |
| Usa `assets/deloitte.css` + CSS embebido propio de la lectura | Tailwind / clases `brand-*` / `reading-prose` |
| Navegación: **side-nav sticky con scroll-spy** (scroll-to-anchor) | TOC click-to-filter |
| KaTeX por CDN con delimitadores `\( \)` y `$$ $$` | `{String.raw\`...\`}` (eso es JSX) |
| Interactividad con **JavaScript vanilla** al final del `<body>` | Hooks de React / `useState` |
| Se registra en `{course}.ts` con el campo **`href`** | Se registra en `readingsRegistry.ts` |

> ⚠️ **El error más costoso**: construir la lectura como componente React. Si la lectura abre "en la misma página" en vez de en pestaña nueva, está mal. Debe ser un `.html`.

---

## Estructura de archivos

```
public/classroom/iqya-2031-2026-20/lecturas/
  Lectura_07/
    Lectura_07_Mezclado.html      ← el documento (autocontenido)
    assets/
      deloitte.css                ← COPIA EXACTA del de Lectura_06 (tokens de color/tipo)
```

Las **imágenes** se sirven con ruta absoluta desde `/classroom/iqya-2031/readings/{nombre}` (carpeta compartida de assets de lecturas). Ej.: `/classroom/iqya-2031/readings/mezclado-ribbon-blender.gif`.

---

## Anatomía del documento (orden fijo)

1. **`<head>`**
   - `<meta charset>`, `<meta viewport>`, `<title>` con el patrón `Lectura NN · Título · Proyecto de Operaciones Unitarias`.
   - `<link rel="stylesheet" href="assets/deloitte.css">`.
   - `<link>` a KaTeX CSS por CDN.
   - `<style>` embebido **idéntico** al de la lectura anterior (NO modificar las reglas; solo se permite añadir reglas nuevas si un bloque de contenido lo necesita, manteniendo el estilo).

2. **`.progress`** — barra de progreso de lectura (fija arriba).

3. **`.outer-layout`** (grid de 2 columnas: side-nav + página)
   - **`nav.side-nav`** — lista `.sn-item` con `<span class="sn-num">NN</span>` + título, una por sección (`#s1`…`#sN`).
   - **`article.page`**
     - **`header.doc-head`**: `.org` (Universidad de los Andes / Ingeniería Química y de Alimentos), `.badge` (`Lectura NN · Proyecto de Operaciones Unitarias`), `<h1>`, `.subtitle`, `.doc-meta` (Curso / Autor / Fecha / Lectura ≈ N min).
     - **`.doc-body`**:
       - `section#s0` — intro: `<p class="lead">`, una `figure.fig` hero, y un `.callout.callout--tip` con **"Aplicación al proyecto del curso"**.
       - `section#s1`…`#sN` — cada una con `.eyebrow`, `<h2 class="sec"><span class="secnum">N.</span> Título</h2>`, y el contenido.
       - `footer.doc-foot`.

4. **Scripts** (al final del `<body>`, en este orden):
   - KaTeX `katex.min.js` + `auto-render.min.js` (con `onload="renderMathInElement(...)"`).
   - `<script>` con: barra de progreso, scroll-spy, `renderMath()` helper, y los IIFE de cada componente interactivo.

---

## Componentes disponibles (clases del CSS — usar SOLO estos)

| Componente | Clase / patrón | Cuándo |
|---|---|---|
| Párrafo guía | `<p class="lead">` | Primer párrafo de la intro |
| Eyebrow de sección | `<div class="eyebrow">Texto</div>` | Antes de cada `<h2 class="sec">` |
| Subtítulo | `<h3 class="sub">` | Subsecciones |
| Figura | `<figure class="fig"><div class="fig-frame"><img></div><figcaption><b>Figura N.</b> …</figcaption></figure>` | Imágenes del material fuente |
| Tabla | `<p class="tbl-cap"><b>Tabla N.</b> …</p>` + `<div class="tbl-wrap"><table class="ou">` | Datos estructurados |
| Callout idea/tip | `.callout.callout--tip` (ícono `i`) | Ideas clave, aplicación al proyecto |
| Callout nota | `.callout.callout--nota` (ícono `i`) | Notas, contexto |
| Callout advertencia | `.callout.callout--warn` (ícono `!`) | Errores, riesgos, "cuándo NO" |
| Visor interactivo | `.imp-gallery` + `.imp-bar` + `.imp-panel` (construido por JS) | Familias de equipos (5–8 variantes) |
| Calculadora | `.calc-wrap` + `.calc-grid` + sliders + tabla de resultados (JS) | Fórmula cerrada útil (escalado, potencia) |
| Selector de criterios | `.su-criteria` + `.su-btn` | Comparar criterios (escalado) |
| Video YouTube | `.yt-wrap > .yt-frame > .aspect > iframe` + `.yt-caption` | Fenómenos físicos reales |
| Enlace a plataforma | `<a class="pl" target="_blank" rel="noopener">` | Nombres de herramientas/plataformas |
| Bibliografía | `<ol class="refs">` | Sección final de fuentes |

**No introducir cajas, fondos oscuros, badges ni estilos que no estén en el CSS de la plantilla.** Si algo no existe en `Lectura_06`, no se usa.

---

## Reglas de contenido (no negociables)

1. **No resumir, no recortar.** Todo el material fuente debe estar. Si es mucho, se divide en más secciones — nunca se elimina.
2. **Español con tildes correctas** (á, é, í, ó, ú, ñ, ü). Nunca publicar sin acentos.
3. **Sin referencias al podcast.** Cada lectura es independiente: remover "Gradiente de Ideas", Spotify y nombres de entrevistados.
4. **KaTeX para toda fórmula.** Inline con `\( … \)`, display con `$$ … $$`. Nada de texto plano para fórmulas. (En HTML NO se usa `String.raw` — eso es solo para JSX.)
5. **Plataformas y herramientas siempre clickeables** con `class="pl"` y `target="_blank" rel="noopener"`.
6. **Inteligencia visual, sin redundancia.** Cada visual cuenta una historia distinta:
   - **NUNCA** un thumbnail de un video **y además** el mismo video. Si vas a mostrar el video, muestra el video; no su miniatura aparte.
   - **NUNCA** un SVG dibujado a mano al lado de la imagen real del mismo concepto.
   - En el visor de equipos: cada panel muestra **una sola** media — un GIF/imagen real **o** un video embebido, lo que mejor comunique ese equipo. No ambos.
7. **Videos para fenómenos físicos reales** (operación de un equipo, flujo, cavitación), a la derecha o en su propio bloque `.yt-wrap`, nunca como decoración redundante.
8. **Imágenes reales** (GIF del fabricante, foto, recorte de libro) — nunca SVG amateur de equipos industriales.

---

## Registro de la lectura (un solo lugar)

En `components/data/classroom/pou-2026-20.ts`, dentro del array `readings`, agregar la entrada con **`href`** (esto la hace abrir como documento HTML en pestaña nueva):

```ts
{
  slug: 'lectura-07-mezclado',          // slug largo: lectura-NN-tema
  order: 7,                              // número de la lectura
  title: 'Mezclado y escalado',
  summary: '…',                          // 1–2 frases describiendo el contenido
  date: '2026-06-06',
  readingMinutes: 28,
  tags: ['mezclado', 'escalado', '…'],
  category: 'lectura',                   // 'lectura' (clase) o 'guia' (proceso)
  href: '/classroom/iqya-2031-2026-20/lecturas/Lectura_07/Lectura_07_Mezclado.html',
  bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l07.jpg', // foto B&W de la tarjeta
}
```

> **NO** se toca `readingsRegistry.ts`. **NO** se crea ningún `.tsx`. El `href` es lo único que conecta la tarjeta del índice con el documento.

### Banner de la tarjeta (`bannerImg`)

El índice de Material del curso (`ReadingsIndexPage.tsx`) muestra cada entrada como una tarjeta horizontal con **foto a la izquierda** y el número de la lectura como marca de agua. La foto se declara con `bannerImg` y vive en:

- **Lecturas:** `public/classroom/{courseSlug}/lecturas-banners/lNN.jpg`
- **Guías:** `public/classroom/{courseSlug}/guias-banners/{nombre}.jpg`

Reglas para las imágenes (igual que los banners de curso):

- **Blanco y negro** y **800px de ancho** máx. — convertir con `sips`/Pillow a escala de grises, calidad JPEG ~75, peso objetivo < 100 KB.
- Una imagen representativa del tema (el equipo o fenómeno de la operación unitaria).
- `bannerImg` es **opcional**: si se omite, la tarjeta cae al estilo plano (sin foto). No dejar lecturas a medias — todas las del curso deberían tener su banner.

---

## Checklist al crear una lectura

0. [ ] **PASO 0 (bloqueante):** `ls` de todas las lecturas existentes del curso → `cp -r Lectura_{NN-1} Lectura_{NN}` y renombrar el `.html`. **Partir SIEMPRE de copiar; jamás autorar el shell desde cero.**
1. [ ] Leer TODO el material fuente completo.
2. [ ] Confirmar que el `<head>`, el `<style>` y los scripts quedan **idénticos** a la base copiada (solo se reemplaza contenido, no el shell).
3. [ ] Confirmar que `Lectura_NN/assets/deloitte.css` existe (copiarlo si no).
4. [ ] Reemplazar `<title>`, `.badge`, `<h1>`, `.subtitle`, `.doc-meta`.
5. [ ] Reescribir el `nav.side-nav` con las secciones reales (01…NN).
6. [ ] Escribir las secciones `#s0`…`#sN` con el contenido completo del material fuente.
7. [ ] Descargar las imágenes a `public/classroom/iqya-2031/readings/` con nombres semánticos (`{tema}-{detalle}.{ext}`).
8. [ ] Videos de YouTube embebidos donde aporten — **uno por concepto, sin thumbnails duplicados**.
9. [ ] Fórmulas en KaTeX (`\( \)` / `$$ $$`).
10. [ ] Adaptar/duplicar los IIFE de JS (galería, calculadora) con los datos de esta lectura.
11. [ ] Verificar TODOS los acentos.
12. [ ] Agregar la entrada en `pou-2026-20.ts` con `href` (sin tocar el registry ni crear `.tsx`).
12b. [ ] Procesar la foto del banner (B&W, 800px, < 100 KB) en `lecturas-banners/lNN.jpg` y declararla con `bannerImg`.
13. [ ] **Chequeo de divergencia (bloqueante):** confirmar que la lectura nueva NO introduce clases/estilos que ninguna otra lectura del curso tenga. Si aparece algo propio, se desvió del shell → volver al Paso 0. Ejemplo:
    ```bash
    # No debe haber NINGUNA coincidencia de patrones ajenos al shell canónico:
    grep -nE 'Source Sans|\.gal-|feq-|chart-wrap|calc-reactive|cr-grid|challenges|background:var\(--blanco\)' \
      public/classroom/{curso}/lecturas/Lectura_{NN}/*.html
    # Y las clases canónicas SÍ deben estar presentes:
    grep -c 'callout--tip\|imp-gallery\|calc-wrap\|table class="ou"\|figure class="fig"\|ol class="refs"' \
      public/classroom/{curso}/lecturas/Lectura_{NN}/*.html
    ```
14. [ ] `npx vite build` para confirmar que nada se rompe.
15. [ ] Abrir el `.html` y verificar: barra de progreso, side-nav con scroll-spy, KaTeX renderizado, galería y calculadora funcionando.
16. [ ] **Comparación visual lado a lado** contra al menos otras dos lecturas del curso: header, tarjeta blanca sobre fondo gris, side-nav, callouts, tablas y figuras deben ser indistinguibles.
17. [ ] Commit y push (deploy automático a GitHub Pages).

---

## Paleta y tipografía (vienen de `deloitte.css` — NO redefinir)

- `--verde: #86BC24` (acento principal) · `--verde-osc: #5E8A12` · `--verde-claro: #EAF3DA`
- `--teal: #0076A8` (notas) · `--gris-1…5` (textos y bordes) · `--papel: #F2F2F2`
- Tipografía: **Source Sans 3** (vía `deloitte.css`). Mono para valores: JetBrains Mono Variable.

---

## Nota sobre el sistema React deprecado (`LECTURES.md`)

El documento `LECTURES.md` describe el sistema **antiguo** de lecturas como componentes React (`.tsx` + `ReadingLayout` + `readingsRegistry.ts` + Tailwind), usado en el curso **`iqya-2031` (POU 2026-10, accessCode `POU202610`)**. Ese sistema **NO** se usa para los cursos nuevos. Si trabajas en una lectura del curso 2026-20 o posterior, ignora `LECTURES.md` y sigue **este** documento.

Coexisten porque el curso 2026-10 ya tiene sus lecturas React publicadas; no se migran retroactivamente.
