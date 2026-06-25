# Presentaciones HTML — Guía de creación

> **Leer esta sección al crear o editar presentaciones de clase.**

## Sistema vigente: deck-stage (IQYA-2031 y cursos nuevos)

Las presentaciones del curso IQYA-2031 (y cualquier curso nuevo) usan el sistema **deck-stage**. El sistema antiguo `_template-slides.html` está **deprecado** y solo aplica a presentaciones previas de otros cursos.

---

## Arquitectura de archivos

Cada presentación vive en su **propia subcarpeta**, no suelto en `slides/`:

```
public/classroom/{courseSlug}/slides/
  {Nombre_Presentacion}/
    Presentacion_{Nombre}.html      ← HTML autocontenido
    assets/
      deck-stage.js                 ← Motor de navegación (76 KB, NO tocar)
      deloitte.css                  ← Tokens de diseño compartidos
      img/                          ← Imágenes convertidas a WebP + GIFs
```

**Al crear una presentación nueva:**
1. Crear la carpeta `{Nombre_Presentacion}/assets/img/`
2. Copiar `deck-stage.js` y `deloitte.css` de una presentación existente
3. Agregar la metadata en el array `presentations` del curso en `{course}.ts`

---

## Tipo `Presentation` en el data model

```ts
{
  id: 'reduccion-de-tamano',           // kebab-case, único
  title: 'Reducción de tamaño',        // con tildes
  description: 'Breve descripción...',
  sessionNumber: 6,                    // para ordenar
  file: 'Reduccion_de_Tamano/Presentacion_Reduccion_de_Tamano.html',
  // ↑ ruta relativa DENTRO de slides/ — NO incluir el prefijo de la URL
}
```

---

## Estructura del HTML

El elemento raíz es `<deck-stage width="1920" height="1080">`. Cada slide es una `<section>`. El JS y los assets van al final del `<body>`.

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nombre — IQYA-2031</title>
  <link rel="stylesheet" href="assets/deloitte.css">
  <!-- KaTeX (solo si hay fórmulas) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous"
    onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]})"></script>
  <style> /* ... todo el CSS custom ... */ </style>
</head>
<body>

<deck-stage width="1920" height="1080">

  <!-- 01 · Portada -->
  <section class="s cover" data-screen-label="Portada" data-nofoot>...</section>

  <!-- 02 · Agenda -->
  <section class="s s--tint" data-screen-label="Agenda">...</section>

  <!-- Divisor -->
  <section class="s s--dark divider" data-screen-label="Divisor Tema 1" data-nofoot>...</section>

  <!-- Slides de contenido -->
  <section class="s" data-screen-label="Descripcion corta">...</section>

  <!-- Cierre -->
  <section class="s close-slide" data-screen-label="Cierre" data-nofoot>...</section>

</deck-stage>

<script src="assets/deck-stage.js"></script>
<script>
  /* Footer e inicialización del lightbox → ver sección correspondiente */
</script>
</body>
</html>
```

### Tipos de section

| Clase(s) | Descripción |
|---|---|
| `s` | Slide blanco estándar |
| `s s--tint` | Slide papel gris (fondo `var(--papel)`) |
| `s s--dark` | Slide negro con texto blanco |
| `s cover` | Portada con layout fijo (fondo negro, imagen derecha) |
| `s s--dark divider` | Divisor de parte — título grande en fondo negro |
| `s close-slide` | Cierre — centrado, fondo negro |

### Atributos de section

| Atributo | Descripción |
|---|---|
| `data-screen-label="..."` | Etiqueta en el carrusel de miniaturas (palabras clave cortas, sin acentos) |
| `data-nofoot` | Suprime el footer inyectado por JS (portadas, divisores, cierre) |

---

## CSS: clases principales

```css
/* ── Encabezados ─────────────────────── */
.kicker   /* etiqueta verde uppercase sobre h2 */
h2        /* título principal del slide, 44px */
.s-head   /* h2 más grande, 48px */
.lead-top /* párrafo intro, 22px gris-2 */

/* ── Layout ──────────────────────────── */
.split                   /* grid 2 columnas iguales */
.split.split--wideL      /* 55% izquierda, 45% derecha */
.split.split--wideR      /* 45% izquierda, 55% derecha */
.split.split--narrow     /* 38% izquierda, 62% derecha */
.copy                    /* columna de texto (flex column, centrada) */

/* ── Imágenes ────────────────────────── */
.img-panel               /* contenedor con border-radius, overflow:hidden, cursor zoom-in */
.img-panel img           /* width/height 100%, object-fit:cover */
.gif-box                 /* igual a img-panel pero object-fit:contain (para GIFs sin recorte) */
.figcap                  /* caption sobre imagen, fondo semi-transparente */

/* ── Cards ────────────────────────────── */
.cards                   /* grid 3 columnas por defecto */
.cards.two               /* 2 columnas */
.cards.four              /* 4 columnas */
.card                    /* card individual, borde radio 10px */
.card--verde             /* fondo verde-claro, borde verde */
.card--amber             /* fondo ámbar claro, borde ámbar */
.card--dark              /* fondo negro, texto blanco */
.card-h                  /* título del card */
.card-n                  /* número grande verde (KPI) */

/* ── Fórmulas ────────────────────────── */
.fml                     /* bloque de fórmula: fondo papel, borde verde izquierdo */
.fml-dark                /* igual pero para slides s--dark */
.var-list                /* ul de descripción de variables */

/* ── Callouts ────────────────────────── */
.callout.verde           /* verde-claro, texto verde-oscuro */
.callout.teal            /* teal-claro, texto teal */
.callout.amber           /* ámbar claro, texto ámbar oscuro */

/* ── Miscelánea ──────────────────────── */
.databar                 /* fila de chips de datos */
.chip                    /* chip pill (verde, teal, amber) */
.steps / .step           /* lista de pasos numerados */
.agenda / .ag-item       /* grid de agenda de la sesión */
```

---

## Portada (cover)

```html
<section class="s cover" data-screen-label="Portada" data-nofoot>
  <div class="cv-text">
    <p class="eyebrow">IQYA-2031 · Proyecto de Operaciones Unitarias</p>
    <div class="cover-bar"></div>
    <h1>Reducción de tamaño</h1>
    <p class="sub-cover">Subtítulo descriptivo de la sesión.</p>
  </div>
  <div class="cv-img">
    <img src="assets/img/Portada_Presentacion.webp" alt="Descripción accesible">
  </div>
</section>
```

## Divisor de parte

```html
<section class="s s--dark divider" data-screen-label="Divisor Nombre" data-nofoot>
  <div>
    <div class="part">Parte 1</div>
    <h2>Título de la parte</h2>
    <p class="sub">Subtítulo de una sola línea que contextualiza el bloque.</p>
    <div class="dctx"><b>4</b><span>mecanismos fundamentales de fractura</span></div>
  </div>
</section>
```

## Slide con imagen + texto (split)

```html
<section class="s" data-screen-label="Descripcion">
  <div class="split split--wideR">
    <div class="img-panel">
      <img src="assets/img/Imagen_Tema.webp" alt="Descripción accesible">
      <p class="figcap">Pie de imagen breve.</p>
    </div>
    <div class="copy">
      <div class="kicker">Sección</div>
      <h2>Título del slide</h2>
      <p>Párrafo de explicación.</p>
      <ul>
        <li>Punto importante</li>
      </ul>
    </div>
  </div>
</section>
```

## Slide con GIF animado

```html
<section class="s" data-screen-label="Equipo animado">
  <div class="split split--wideR">
    <div class="gif-box">
      <img src="assets/img/Equipo.gif" alt="Equipo en operación (animación)">
    </div>
    <div class="copy">
      <div class="kicker">Principio de operación</div>
      <h2>Nombre del equipo</h2>
      <p>Descripción del principio.</p>
    </div>
  </div>
</section>
```

## Videos de YouTube (vid-grid)

Dos videos side-by-side (16:9 horizontal + 9:16 short):

```html
<div class="vid-grid">
  <div class="vid-16">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID_1" title="Título 1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen></iframe>
  </div>
  <div class="vid-9">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID_2" title="Título 2"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen></iframe>
  </div>
</div>
```

CSS necesario en `<style>`:
```css
.vid-grid { display: flex; gap: 32px; align-items: stretch; margin-top: 20px; }
.vid-16 { flex: 16; position: relative; border-radius: 12px; overflow: hidden; background: #000; }
.vid-9  { flex: 9;  position: relative; border-radius: 12px; overflow: hidden; background: #000; }
.vid-16 iframe, .vid-9 iframe {
  position: absolute; inset: 0; width: 100%; height: 100%; border: 0;
}
```

**Regla: los videos siempre a la DERECHA** en un split, nunca debajo del contenido.

Para **un solo video** en un split (el caso más común), usar `.vid-16` directamente dentro de la columna `.copy` derecha:

```html
<section class="s s--tint" data-screen-label="Nombre slide video">
  <div class="split split--wideR" style="align-items:center;">
    <div class="copy"><!-- contenido izquierda --></div>
    <div class="copy">
      <div class="vid-16">
        <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Título"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </div>
      <p class="vid-cap">Descripción breve. Si no abre, ver en
        <a class="platform-link" href="https://www.youtube.com/watch?v=VIDEO_ID" target="_blank" rel="noopener">YouTube</a>.
      </p>
    </div>
  </div>
</section>
```

CSS requerido:
```css
.vid-16 { aspect-ratio: 16/9; border-radius: 12px; overflow: hidden; background: #000; position: relative; }
.vid-16 iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vid-cap { font-size: 22px; color: var(--gris-3); margin: 10px 0 0; line-height: 1.4; }
.platform-link { color: inherit; text-decoration: none; border-bottom: 2px solid var(--verde); font-weight: 600; }
.platform-link::after { content: " ↗"; }
```

---

## Componente interactivo: `.lossmenu` (menú de pestañas A/B/C)

Para slides con varias opciones/categorías de imágenes que se quieren mostrar una a la vez en clase:

```html
<section class="s s--tint" data-screen-label="Nombre slide lossmenu">
  <div class="kicker">Subtítulo</div>
  <h2 class="s-head">Título del slide</h2>
  <div class="lossmenu" id="lm1">
    <div class="tabs">
      <button class="tab is-active" data-panel="a">A — Nombre A</button>
      <button class="tab" data-panel="b">B — Nombre B</button>
      <button class="tab" data-panel="c">C — Nombre C</button>
    </div>
    <div class="panel is-active" id="lm1-a">
      <div class="img-panel"><img src="assets/img/ImagenA.webp" alt="Descripción A"></div>
      <div class="copy"><h3>Título panel A</h3><p>Descripción A...</p></div>
    </div>
    <div class="panel" id="lm1-b"><!-- panel B --></div>
    <div class="panel" id="lm1-c"><!-- panel C --></div>
  </div>
</section>
```

CSS del componente:
```css
.lossmenu .tabs { display: inline-flex; gap: 6px; border: 2px solid var(--gris-4); border-radius: 999px; padding: 6px; background: #fff; margin-bottom: 32px; }
.lossmenu .tab { font-size: 24px; font-weight: 600; padding: 10px 28px; border-radius: 999px; border: none; background: transparent; cursor: pointer; color: var(--gris-2); transition: background .2s, color .2s; }
.lossmenu .tab.is-active { background: var(--verde); color: #fff; }
.lossmenu .panel { display: none; }
.lossmenu .panel.is-active { display: grid; grid-template-columns: 1.25fr 0.75fr; gap: 56px; animation: fadeInUp .35s ease both; }
```

JS (IIFE al final del `<body>`, antes del lightbox):
```js
(function () {
  document.querySelectorAll('.lossmenu').forEach(function (menu) {
    var tabs = Array.prototype.slice.call(menu.querySelectorAll('.tab'));
    var panels = Array.prototype.slice.call(menu.querySelectorAll('.panel'));
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        panels.forEach(function (p) { p.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var target = menu.querySelector('#' + menu.id + '-' + tab.dataset.panel);
        if (target) target.classList.add('is-active');
      });
    });
  });
})();
```

---

## Imágenes: reglas de oro

### 1. Las imágenes del usuario van primero

Cuando el usuario sube un ZIP de imágenes curadas, **esas son las definitivas**. NO usar imágenes extraídas del PDF si el usuario ya proporcionó las suyas.

### 2. Ver visualmente CADA imagen antes de asignarla

Los nombres del ZIP (ej. `08 mandibula.gif`) indican el tema, pero **siempre abrir con Read tool** para confirmar qué muestra antes de asignarla a un slide. Invertir la asignación (imagen A donde va la B) es un error costoso.

### 3. Conversión a WebP

- Imágenes estáticas (JPEG, PNG): convertir a WebP q88, máx. 1600px de ancho
- GIFs animados: **conservar como .gif**; no se convierten a WebP (se perdería la animación)
- Script de conversión:

```python
from PIL import Image
import os

MAXW = 1600
def to_webp(src, dst_name, dst_dir):
    im = Image.open(src)
    if im.mode in ("RGBA","P","LA"):
        im = im.convert("RGB")
    w, h = im.size
    if w > MAXW:
        im = im.resize((MAXW, round(h*MAXW/w)), Image.LANCZOS)
    out = os.path.join(dst_dir, dst_name)
    im.save(out, "WEBP", quality=88, method=6)
    print(f"{os.path.basename(src)} -> {dst_name}  {os.path.getsize(out)//1024} KB")
```

### 4. Nombres descriptivos

Nombrar con el tema del slide (PascalCase, sin acentos ni espacios):
- `Trituradora_Mandibulas.gif` (no `08 mandibula.gif`)
- `Coarse_Medium_Fine.webp` (no `06.webp`)
- `Portada_Reduccion.webp` (no `01.webp`)

### 5. Extraer imágenes del PDF (cuando no hay ZIP)

Usar pymupdf para renderizar cada página como PNG (zoom 2×) si el PDF tiene texto embebido, o para extraer imágenes vectoriales embebidas:

```python
import fitz
doc = fitz.open('ruta/al/archivo.pdf')
for i, page in enumerate(doc):
    mat = fitz.Matrix(2, 2)
    pix = page.get_pixmap(matrix=mat)
    pix.save(f'/tmp/p{i+1:02d}.png')
```

Luego ver cada PNG con `Read` tool y decidir qué contenido pertenece a cada slide.

---

## Fórmulas matemáticas con KaTeX

### CDN en `<head>`

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" crossorigin="anonymous"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}]})"></script>
```

### Uso

```html
<!-- Inline -->
<p>La densidad bulk es $\rho_b = m / V_{\text{bulk}}$.</p>

<!-- Display, dentro de .fml -->
<div class="fml">
  $$E = W_i \times 10\left(\frac{1}{\sqrt{P_{80}}} - \frac{1}{\sqrt{F_{80}}}\right)\ \frac{\text{kWh}}{\text{ton}}$$
</div>
```

### Tamaño de fuente KaTeX

Siempre incluir en el `<style>` estas tres reglas para que las fórmulas se vean bien en el canvas 1920×1080:

```css
.katex { font-size: 1.2em; }
.katex-display { margin: .2em 0; }
.fml .katex-display > .katex { font-size: 1.4em; }
.card .fml .katex-display > .katex { font-size: 1.2em; }
```

### Trampas comunes

- **`°` dentro de KaTeX**: el carácter crudo `°` no funciona. Usar `^\circ` (ej: `$30^\circ$`).
- **KaTeX dentro de SVG `<text>`**: el auto-render **no procesa** texto dentro de `<svg>`. Usar Unicode directo: `°`, `²`, `³`, `μ`, `Δ`.
- Fracciones: `\frac{a}{b}` · Raíces: `\sqrt{x}` · Griegos: `\rho`, `\mu`, `\sigma`, `\alpha` · Texto: `\text{kWh}`.

---

## Íconos SVG Lucide (no emojis)

**Regla absoluta: NO usar emojis como íconos.** Reemplazar por SVG Lucide inline.

```html
<!-- Patrón base -->
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <!-- path data -->
</svg>
```

Íconos frecuentes en callouts:

| Contexto | Path data |
|---|---|
| Info (círculo i) | `<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>` |
| Advertencia (triángulo) | `<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>` |
| Check (círculo ✓) | `<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>` |

Para otros: https://lucide.dev/icons

---

## Lightbox — `<dialog>` modal (funciona en fullscreen)

El lightbox **debe** ser un `<dialog>` abierto con `showModal()`, no un `<div>`. Los `<div>` con `position:fixed` quedan ocultos detrás del elemento `<deck-stage>` en fullscreen; los diálogos modales se renderizan en el *top layer*, por encima de todo.

```html
<!-- CSS (en <style>) -->
<style>
.img-panel img, .gif-box img { cursor: zoom-in; }
.zoom-badge {
  position: absolute; top: 14px; right: 14px; width: 38px; height: 38px;
  border-radius: 8px; background: rgba(17,17,17,.58); color: #fff;
  display: flex; align-items: center; justify-content: center; font-size: 20px;
  cursor: zoom-in; opacity: 0; transition: opacity .15s ease; z-index: 4;
}
.img-panel:hover .zoom-badge, .gif-box:hover .zoom-badge { opacity: 1; }
.lightbox {
  position: fixed; inset: 0; width: 100vw; height: 100vh;
  max-width: 100vw; max-height: 100vh; margin: 0; border: 0;
  background: rgba(0,0,0,.9);
  display: none; align-items: center; justify-content: center;
  z-index: 99999; cursor: zoom-out; padding: 3vmin; overflow: hidden;
}
.lightbox[open] { display: flex; }
.lightbox::backdrop { background: rgba(0,0,0,.9); }
.lightbox img { max-width: 94vw; max-height: 94vh; width: auto; height: auto;
  object-fit: contain; border-radius: 6px; box-shadow: 0 24px 90px rgba(0,0,0,.6); }
.lightbox .lb-close {
  position: fixed; top: 26px; right: 32px; width: 54px; height: 54px;
  border-radius: 50%; background: rgba(255,255,255,.18); color: #fff;
  border: none; font-size: 26px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
@media print { .zoom-badge, .lightbox { display: none !important; } }
</style>
```

```html
<!-- JS (al final del <body>, después de deck-stage.js) -->
<script>
(function () {
  var lb = document.createElement('dialog');
  lb.className = 'lightbox';
  lb.innerHTML = '<button class="lb-close" aria-label="Cerrar">✕</button><div class="lb-content" style="display:flex;align-items:center;justify-content:center;"></div>';
  document.body.appendChild(lb);
  var content = lb.querySelector('.lb-content');

  function close() { if (lb.open) lb.close(); }
  lb.addEventListener('close', function () { content.innerHTML = ''; });

  function open(img) {
    content.innerHTML = '';
    var im = document.createElement('img');
    im.src = img.currentSrc || img.src;
    content.appendChild(im);
    if (!lb.open) lb.showModal();
  }

  lb.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.open) { e.stopPropagation(); close(); }
  }, true);

  document.querySelectorAll('deck-stage .img-panel img, deck-stage .gif-box img').forEach(function (img) {
    var parent = img.parentElement;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    function trigger(e) { e.stopPropagation(); open(img); }
    img.addEventListener('click', trigger);
    var badge = document.createElement('span');
    badge.className = 'zoom-badge';
    badge.setAttribute('aria-hidden', 'true');
    badge.textContent = '⤢';
    badge.addEventListener('click', trigger);
    parent.appendChild(badge);
  });
})();
</script>
```

---

## Footer (inyectado por JS)

Al final del `<body>`, antes del lightbox:

```js
document.querySelectorAll('deck-stage section:not([data-nofoot])').forEach(function (s) {
  var f = document.createElement('div');
  f.className = 'slide-footer';
  f.innerHTML =
    '<span>IQYA-2031 · Proyecto de Operaciones Unitarias · 2026-20</span>' +
    '<span>Título de la presentación · Luis H. Reyes</span>';
  s.appendChild(f);
});
```

CSS del footer:
```css
.slide-footer {
  position: absolute; bottom: 22px; left: 80px; right: 80px;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; color: var(--gris-3); pointer-events: none;
}
```

---

## Carrusel en fullscreen

El `deck-stage.js` ya tiene el parche para ocultar el carrusel (rail) al entrar a pantalla completa. Al presionar F (o el botón de fullscreen), el elemento `<deck-stage>` recibe el atributo `data-fs` y el rail desaparece. Al salir de fullscreen, el rail vuelve. **No es necesario hacer nada adicional en el HTML**.

---

## Mobile responsive — reglas críticas

Las presentaciones se ven en celular y tablet en modo bloque (el `deck-stage` pasa a layout lineal en ≤768px). El bloque `@media (max-width:768px)` al final del `<style>` es obligatorio en TODA presentación.

### Jerarquía de `overflow` — la regla más importante

```
html, body { overflow-x: hidden; max-width: 100vw; }   ← contención a nivel viewport
.s          { overflow: visible; width: 100%; box-sizing: border-box; }   ← NUNCA hidden
.fml        { overflow-x: auto; display: block; max-width: calc(100vw - 40px); }
table       { display: block; overflow-x: auto; max-width: calc(100vw - 40px); }
```

**Regla absoluta:** `overflow-x:hidden` en `.s` suprime el scroll interno de cualquier hijo con `overflow-x:auto` — las fórmulas KaTeX y las tablas quedan clippeadas sin poder scrollar. **Nunca poner `overflow-x:hidden` en `.s`.**

### Cálculo de `max-width` para fórmulas anidadas

El `max-width` de `.fml` debe restar el padding de TODOS los contenedores padres:

| Contexto | `max-width` del `.fml` |
|---|---|
| Directo en `.s` | `calc(100vw - 40px)` — padding del slide (20px × 2) |
| Dentro de `.callout` | `calc(100vw - 76px)` — slide 40px + callout 36px (18px × 2) |
| Dentro de `.card` | `calc(100vw - 72px)` — slide 40px + card 32px (16px × 2) |

### Bloque mobile canónico completo

Copiar EXACTAMENTE este bloque en cada presentación nueva (actualizarlo si hay clases nuevas):

```css
@media (max-width:768px){
  html,body{height:auto;background:#f2f2f2;overflow-x:hidden;max-width:100vw;}
  .s{padding:28px 20px 36px !important;min-height:0 !important;overflow:visible !important;width:100% !important;box-sizing:border-box !important;}
  h1.s-title{font-size:24px !important;line-height:1.15 !important;}
  .s h2,h2.s-head{font-size:22px !important;line-height:1.2 !important;letter-spacing:normal !important;}
  .s-lead{font-size:16px !important;max-width:100% !important;}
  .s p{font-size:16px !important;}
  .s ul,.s ol{font-size:15px !important;}
  .s h3{font-size:20px !important;line-height:1.25 !important;}
  .lead-top{font-size:16px !important;}
  .foot-note{font-size:12px !important;}
  .kicker{font-size:13px !important;margin-bottom:10px !important;letter-spacing:.08em !important;}
  .s-foot{position:static !important;left:auto !important;right:auto !important;bottom:auto !important;margin-top:20px !important;font-size:11px !important;}
  .cover h1{font-size:24px !important;line-height:1.15 !important;}
  .cover .session{font-size:14px !important;}
  .cover-meta{flex-direction:column !important;gap:10px !important;}
  .cover .wm{display:none !important;}
  .cover .course{font-size:11px !important;letter-spacing:.05em !important;margin-bottom:12px !important;}
  .cover-org{font-size:16px !important;}
  .cover-org span{font-size:11px !important;}
  .cover-bar{display:none !important;}
  .cover-meta div{font-size:14px !important;}
  .cover-meta b{font-size:15px !important;}
  .divider .part{font-size:12px !important;margin-bottom:12px !important;}
  .divider h2{font-size:32px !important;}
  .divider .sub{font-size:13px !important;margin-top:16px !important;}
  .dctx b{font-size:26px !important;}
  .dctx span{font-size:12px !important;}
  .agenda-list{grid-template-columns:1fr !important;}
  .agenda-list .n{font-size:16px !important;min-width:28px !important;}
  .agenda-list .t b{font-size:15px !important;}
  .agenda-list .t span{font-size:12px !important;}
  .agenda-note p{font-size:15px !important;}
  .split,.split--wideR,.split--wideL,.split--narrow{grid-template-columns:1fr !important;gap:18px !important;}
  .cards,.cards.two,.cards.four{grid-template-columns:1fr !important;gap:12px !important;margin-top:16px !important;}
  .card{padding:18px 16px !important;}
  .card h3{font-size:20px !important;}
  .card p{font-size:15px !important;}
  .card .card-n{font-size:13px !important;}
  .card ul{font-size:13px !important;}
  .card-gif{height:140px !important;}
  .fml{font-size:14px !important;overflow-x:auto !important;padding:8px 4px !important;max-width:calc(100vw - 40px) !important;box-sizing:border-box !important;display:block !important;}
  .callout .fml{max-width:calc(100vw - 76px) !important;}
  .card .fml{max-width:calc(100vw - 72px) !important;}
  .img-panel{padding:12px !important;}
  .img-panel .figcap{font-size:12px !important;}
  .figbox .figcap{font-size:12px !important;}
  .callout,.callout.verde,.callout.amber{padding:16px 18px !important;}
  .callout p{font-size:15px !important;}
  .callout h4{font-size:15px !important;}
  .var-list{font-size:12px !important;}
  .databar .chip{font-size:12px !important;}
  table{font-size:12px !important;display:block !important;overflow-x:auto !important;-webkit-overflow-scrolling:touch !important;max-width:calc(100vw - 40px) !important;box-sizing:border-box !important;}
  th,td{padding:6px 8px !important;white-space:nowrap !important;}
  .collist{grid-template-columns:1fr !important;gap:14px !important;}
  .collist .it b{font-size:15px !important;}
  .collist .it span{font-size:13px !important;}
  .steps,.steps.four{grid-template-columns:1fr !important;gap:14px !important;}
  .step .st-n{width:40px !important;height:40px !important;min-width:40px !important;font-size:20px !important;}
  .step b{font-size:16px !important;}
  .step span{font-size:14px !important;}
  .fullbleed .fb-img{position:static !important;inset:auto !important;padding:12px !important;}
  .fullbleed .fb-img img{max-height:none !important;width:100% !important;height:auto !important;}
  .fullbleed .s-foot{color:rgba(255,255,255,.5) !important;}
  .lossmenu .tabs{width:100% !important;flex-direction:column !important;border-radius:14px !important;}
  .lossmenu .tab{font-size:14px !important;padding:10px 14px !important;justify-content:center !important;}
  .lossmenu .panel.is-active{grid-template-columns:1fr !important;gap:16px !important;}
  .lossmenu .panel .img-panel img{max-height:none !important;}
  .lossmenu .panel .pcopy h3{font-size:20px !important;}
  .lossmenu .panel .pcopy p{font-size:14px !important;}
  .lossmenu .panel .pcopy ul{font-size:13px !important;}
  .close .next{display:flex !important;align-items:center !important;gap:16px !important;margin-top:20px !important;font-size:15px !important;}
  .close .next .pill{font-size:11px !important;width:62px !important;min-width:62px !important;height:62px !important;padding:6px !important;text-align:center !important;white-space:normal !important;border-radius:50% !important;display:flex !important;align-items:center !important;justify-content:center !important;line-height:1.3 !important;flex-shrink:0 !important;}
}
```

### Presupuesto de altura por slide (desktop 1920×1080)

El canvas tiene 1080px. Con `padding: 90px 120px 96px` del `.s`, la altura útil disponible es **894px**. Si el contenido la supera, el slide hace scroll en vez de mostrar todo visible en clase.

Estimaciones orientativas:
- `.kicker` + `h2.s-head`: ~70px + ~75px = **145px**
- Fila de cards (`.cards`): ~380px para 3 cards de altura media
- Tabla de 7 filas (`.tbl-sm`): ~330px
- `.callout`: ~120px
- `.fml` con fórmula larga: ~80px
- Margen `split`: 14–20px

**Regla práctica:** si un slide tiene tabla + fórmula + callout + imagen, dividirlo en dos.

---

## Checklist para nueva presentación

1. [ ] Leer TODO el PDF fuente (renderizar páginas con pdftoppm si no tiene texto)
2. [ ] Si el usuario subió imágenes en ZIP, usar esas — NO las del PDF
3. [ ] Ver visualmente CADA imagen antes de asignarla a un slide (con `Read` tool)
4. [ ] Crear carpeta `{Nombre}/assets/img/` y copiar `deck-stage.js` + `deloitte.css`
5. [ ] Convertir imágenes estáticas a WebP q88 máx 1600px; GIFs conservar como `.gif`
6. [ ] Nombrar archivos de imagen de forma descriptiva (sin acentos, PascalCase)
7. [ ] Estructurar slides: portada → agenda → [divisor → contenido]+ → cierre
8. [ ] `data-nofoot` en portada, divisores y cierre
9. [ ] `data-screen-label` en todos los slides (sin acentos, palabras clave cortas)
10. [ ] Fórmulas: TODAS con KaTeX (`$...$` o `$$...$$`), nunca texto plano
11. [ ] `^\circ` para grados dentro de KaTeX (NO el carácter `°`)
12. [ ] Videos YouTube: formato `.vid-grid` con `.vid-16` y `.vid-9`; siempre a la DERECHA en splits
13. [ ] Íconos SVG Lucide inline — NO emojis
14. [ ] Lightbox implementado como `<dialog>` con `showModal()` (no `<div>`)
15. [ ] Footer inyectado por JS en todos los slides (excepto los con `data-nofoot`)
16. [ ] Verificar que `<deck-stage>` NO tiene atributo `no-rail` (el rail es útil fuera de fullscreen)
17. [ ] Validar HTML básico (0 tags sin cerrar, 0 acentos rotos)
18. [ ] Registrar en `presentations` del curso: `id`, `title`, `description`, `sessionNumber`, `file`
19. [ ] Campo `file` = ruta relativa dentro de `slides/` (ej: `Reduccion_de_Tamano/Presentacion_Reduccion_de_Tamano.html`)
20. [ ] Eliminar el ZIP de imágenes de la raíz del repo tras procesar (`git rm imagenes.zip`)
21. [ ] **Mobile**: bloque `@media (max-width:768px)` copiado del canónico — nunca `overflow-x:hidden` en `.s`
22. [ ] **Mobile**: slides con tabla o fórmula larga verificados — `.fml` y `table` tienen `max-width:calc(100vw - Xpx)` correcto según nivel de anidación
23. [ ] Commit descriptivo y `git push origin HEAD:main`

---

## Principios inquebrantables

1. **No resumir, no recortar.** Cada página del PDF debe tener su slide. Si hay mucho contenido, dividir en 2+ slides. NUNCA omitir.
2. **Las imágenes curadas del usuario tienen prioridad absoluta.** Si el usuario subió un ZIP, usar esas imágenes — no las del PDF.
3. **Ver CADA imagen antes de asignarla.** Los nombres de archivo no garantizan el contenido. Siempre `Read` → verificar → asignar.
4. **KaTeX para todas las fórmulas.** Cero texto plano tipo `ρ = m/V`.
5. **Lightbox como `<dialog>`.** Un `<div>` con `position:fixed` no funciona en fullscreen.
6. **GIFs animados conservan la animación.** No convertir a WebP.
7. **No emojis — SVG Lucide.**
8. **Pill "A trabajar"**: el CSS de `.close .next .pill` siempre debe incluir `white-space: nowrap; flex-shrink: 0;` para que el texto nunca se parta en dos líneas en el canvas 1920×1080.
9. **`overflow-x:hidden` NUNCA en `.s`**: suprime el scroll interno de `.fml` y `table` dentro del slide. La contención de viewport va en `html,body`, no en el slide.
10. **GIFs: verificar visualmente antes de asignar**: el nombre del archivo no garantiza el contenido. Siempre `Read` el GIF (la herramienta muestra el primer frame) y confirmar que el impulsor/equipo es el correcto antes de ponerlo en el card.

---

## Plantilla canónica

Copiar la presentación más reciente como punto de partida:
```
public/classroom/iqya-2031-2026-20/slides/Agitacion/Presentacion_Agitacion.html
```
Incluye: portada, agenda, lossmenu (5 tabs), divisores, splits, cards con GIF (`card-gif`), fullbleed, fórmulas KaTeX, callouts, collist, steps, tabla compacta (`tbl-sm`), lightbox `<dialog>`, footer JS, CSS completo con bloque mobile corregido.

Para presentaciones sin fórmulas ni card-gifs, la alternativa más limpia:
```
public/classroom/iqya-2031-2026-20/slides/Flujo_de_Fluidos/Presentacion_Flujo_de_Fluidos.html
```

---

## Sistema antiguo: `_template-slides.html` (deprecado)

El template anterior (`public/classroom/_template-slides.html`) se usó para las primeras presentaciones de 2026-10. Su sistema de clases es diferente: `slide`, `slide title-slide`, `two-col`, `grid cols-3`, `.controls` con botones de nav. **No usar para cursos nuevos**. Si necesita arreglar una presentación antigua que usa ese sistema, consultar el historial de git para ver la documentación anterior.
