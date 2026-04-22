# Presentaciones HTML — Guía de creación

> **Leer esta sección al crear o editar presentaciones de clase.**

## Principios fundamentales (mismos que lecturas)

1. **No resumir, no recortar.** Cada página del PDF fuente debe tener su slide correspondiente. Si una página tiene mucho contenido, dividirla en 2+ slides. NUNCA omitir información.
2. **Complementar, no reemplazar.** Agregar imágenes, diagramas o contexto que enriquezca. Preservar el 100% del contenido original.
3. **Todo en español con tildes correctas.** á, é, í, ó, ú, ñ, ü.
4. **Extraer TODAS las imágenes del PDF fuente.** Ver sección "Imágenes" abajo para el procedimiento correcto.
5. **Usar KaTeX para fórmulas matemáticas.** Nunca dejar fórmulas como texto plano. Ver sección "Fórmulas matemáticas" abajo.
6. **Videos de YouTube siempre a la derecha** en un layout `two-col`, nunca debajo del contenido.
7. **Íconos SVG Lucide, NO emojis.** Ver sección "Íconos SVG" abajo.
8. **Enlaces clickeables en nombres de plataformas/herramientas.** Ver sección "Enlaces a plataformas".
9. **HTML no es PowerPoint — aprovechar la interactividad.** Ver sección "Patrones interactivos".

## Arquitectura de archivos

```
public/classroom/{courseSlug}/slides/{nombre}.html    ← Presentación autocontenida
public/classroom/{courseSlug}/slides/img/             ← Imágenes de la presentación
public/classroom/_template-slides.html               ← Plantilla base
components/data/classroom/{course}.ts                 ← Metadata (presentations array)
```

## Tipo `Presentation` en el data model

```ts
interface Presentation {
  id: string;            // Identificador único (ej: 'clase-03-diagramas')
  title: string;         // Título visible
  sessionNumber?: number; // Número de sesión (opcional, para ordenar)
  date?: string;         // Fecha ISO (opcional)
  description?: string;  // Descripción breve
  file: string;          // Solo el nombre del archivo HTML (ej: 'clase-03-diagramas.html')
                         // NO incluir la ruta completa — PresentationsIndexPage agrega el prefijo
}
```

**⚠️ IMPORTANTE:** El campo `file` debe ser SOLO el nombre del archivo (ej: `'clase-03-diagramas.html'`), NO la ruta completa. La página `PresentationsIndexPage.tsx` construye la URL como `/classroom/{courseSlug}/slides/{file}`.

## Estructura del HTML

Las presentaciones son archivos HTML autocontenidos (sin dependencias externas). Copiar TODO el CSS y JS de `_template-slides.html`.

### Tipos de slides

```html
<!-- Slide oscuro (portadas, separadores, cierre) -->
<section class="slide title-slide" data-slide>
  <div class="content">
    <p class="eyebrow">IQYA-2031 · 2026-10</p>
    <h1>Título grande</h1>
    <p>Subtítulo o descripción.</p>
    <div class="pill-row">
      <span class="pill">Tema 1</span>
      <span class="pill">Tema 2</span>
    </div>
  </div>
</section>

<!-- Slide claro (contenido) -->
<section class="slide" data-slide>
  <div class="content">
    <p class="eyebrow">Sección</p>
    <h2>Título del slide</h2>
    <p>Contenido de texto.</p>
  </div>
</section>
```

- El **primer slide** lleva `class="slide title-slide active"` (active para que sea visible al cargar)
- Todos los slides necesitan el atributo `data-slide`
- El JS cuenta los slides automáticamente — solo agregar sections es suficiente

### Componentes disponibles dentro de slides

**Cards en grid:**
```html
<div class="grid cols-3">
  <div class="card">
    <h3>Título</h3>
    <p>Descripción del card.</p>
  </div>
</div>
```
Clases disponibles: `cols-2`, `cols-3`, `cols-4` (responsive, colapsan a 1 columna en móvil)

**Dos columnas (texto + imagen):**
```html
<div class="two-col">
  <div>
    <p>Texto a la izquierda</p>
    <ul>
      <li>Punto 1</li>
      <li>Punto 2</li>
    </ul>
  </div>
  <img class="diagram" src="img/nombre.png" alt="Descripción" />
</div>
```

**Imagen centrada:**
```html
<img class="diagram" src="img/nombre.png" alt="Descripción" />
<p class="small-text">Pie de imagen</p>
```

**Tip/consejo:**
```html
<div class="tip">Texto del consejo o recomendación.</div>
```

**Advertencia:**
```html
<div class="warning">Texto de la advertencia.</div>
```

**Ejemplo grande (código o fórmula):**
```html
<div class="big-example">
  <code>2"-FG-3001-CS</code>
  <p class="legend">2 pulgadas · FG: Fluido General · 3001: línea · CS: Carbon Steel</p>
</div>
```

**Pills (etiquetas):**
```html
<div class="pill-row">
  <span class="pill">Etiqueta 1</span>
  <span class="pill">Etiqueta 2</span>
</div>
```

### Decoraciones automáticas

El template incluye decoraciones CSS automáticas:
- **L amarilla** en esquina superior derecha de slides claros
- **L amarilla sutil** (40% opacidad) en esquina inferior izquierda de slides oscuros
- **Número de slide grande** ("01", "02"...) en fondo inferior izquierdo a 4% opacidad

Los números se inyectan vía JS — no necesitas agregarlos manualmente.

### Navegación (ya incluida en el template)

- Teclado: ← → (o Espacio/PageDown/PageUp) para navegar, Home/End para inicio/fin, F para fullscreen
- Touch: swipe izquierda/derecha en móvil
- Botones: ‹ › ⛶ en esquina inferior derecha
- Barra de progreso amarilla en la parte superior
- Contador "X / N" en el HUD inferior

### Imágenes — PROCEDIMIENTO CORRECTO

**⚠️ CRÍTICO: NO filtrar imágenes por tamaño.** Las imágenes grandes (>1MB) del PDF son frecuentemente contenido técnico valioso (equipos, microscopías SEM, diagramas de proceso), NO fondos decorativos. El filtro por tamaño causó la pérdida de ~70% de las imágenes en presentaciones anteriores.

**Extracción recomendada (pymupdf, deduplicando por xref):**

El patrón que mejor funciona: recorrer las páginas, recordar en qué página aparece por primera vez cada `xref`, y extraer una sola vez por xref — las imágenes que se repiten en varias páginas (ilustraciones base del tema, cabezales, etc.) se comparten. El nombre del archivo toma la **primera página** donde apareció.

```python
import fitz
doc = fitz.open('temp/NN-Nombre.pdf')
out = 'public/classroom/{courseSlug}/slides/img'

xref_first_page = {}
for i, page in enumerate(doc):
    for img in page.get_images(full=True):
        xref = img[0]
        base = doc.extract_image(xref)
        w, h = base['width'], base['height']
        # Descartar barras decorativas (284x85) e íconos diminutos
        if w > 400 and h > 400 and xref not in xref_first_page:
            xref_first_page[xref] = i + 1

for xref, page_num in xref_first_page.items():
    base = doc.extract_image(xref)
    fn = f'pres{num:02d}-p{page_num:02d}-1.{base["ext"]}'  # ext suele ser "jpeg"
    with open(f'{out}/{fn}', 'wb') as f:
        f.write(base['image'])
```

**Por qué `>400 x >400` en vez de `>50 x >50`:** las barras decorativas típicas miden 284x85 y 620x85; los íconos 96x96. Con 400x400 se filtra todo eso sin perder ilustraciones técnicas. Ajustar caso por caso si la fuente tiene ilustraciones más pequeñas.

**Después de extraer, clasificar manualmente:**

| Tipo de imagen | Cómo identificarla | Qué hacer |
|---|---|---|
| **Barras decorativas del tema** | Tamaño exacto 284x85 px | NO referenciar en HTML |
| **Íconos tiny** | < 100x100 px (96x96, 75x75) | NO referenciar en HTML |
| **Ilustraciones técnicas** | Equipos, diagramas, microscopías, gráficas | USAR en el slide correspondiente |
| **Imágenes de página completa** | ~1194x1789 px | Son las ilustraciones principales — SIEMPRE usar |

**REGLA: Verificar visualmente CADA imagen extraída** antes de asignarla a un slide. Abrir con `Read` tool para confirmar qué muestra. Nunca asumir por el nombre del archivo.

**Referencia:**
- Guardar en `public/classroom/{courseSlug}/slides/img/`
- Referenciar con ruta relativa: `src="img/nombre.png"`
- Usar clase `diagram` en `<img>` para max-width, border-radius y shadow automáticos

**Slides divididos (split pairs):**
Cuando un slide se divide en dos (ej: "Tema 1/2" y "Tema 2/2"), la imagen debe aparecer en AMBOS slides si es relevante. El segundo slide de un par no debe quedarse sin la imagen que lo acompaña.

**GIFs animados:**
- Los GIFs funcionan con el mismo `<img class="diagram" src="img/nombre.gif">` — el browser los anima automáticamente siempre que tengan más de 1 frame.
- Si el usuario reporta "no se mueve", casi siempre es **caché del navegador**. Pedir recarga forzada (Cmd+Shift+R).
- Para verificar que un GIF es válido y animado: `python3 -c "from PIL import Image; img = Image.open('f.gif'); n=0; \ntry:\n  while True: img.seek(n); n+=1\nexcept EOFError: print(n,'frames')"`
- Tamaños típicos de GIFs útiles: 15-200 frames, 100KB - 4MB.

### Fórmulas matemáticas con KaTeX

**Agregar KaTeX CDN al `<head>`:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});"></script>
```

**CSS override necesario** — debe ir en el `<style>` después de la regla `.big-example code` (o `.formula` si el template usa esa clase):

```css
.big-example .katex,
.big-example .katex-display {
  color: var(--brand-dark);
  font-size: clamp(1.1rem, 2.3vw, 1.75rem);
  margin: 0.3rem 0;
}
.big-example .katex-display > .katex { display: inline-block; white-space: nowrap; }

/* Si hay cards sobre un slide.title-slide (fondo oscuro), evitar que el texto
   gris claro de .slide.title-slide p se filtre dentro de las .card blancas */
.slide.title-slide .card { color: var(--brand-dark); }
.slide.title-slide .card p,
.slide.title-slide .card li { color: var(--brand-gray); }
.slide.title-slide .card h3 { color: var(--brand-dark); }
```

**Uso:**
- Inline: `$\rho_t = m / V$`
- Display (centrada): `$$W = W_i \times 10 \times \left(\frac{1}{\sqrt{P_{80}}} - \frac{1}{\sqrt{F_{80}}}\right)$$`
- Subíndices: `$\rho_b$`, `$d_{50}$`, `$K_{St}$`
- Fracciones: `$\frac{a}{b}$`
- Griegos: `$\varepsilon$`, `$\theta$`, `$\phi$`, `$\alpha$`
- Texto dentro de fórmula: `$\text{NPSH}_d$`, `$C_{\text{mín}}$`
- Exponenciales: `$e^{-\text{NTU}(1-C_r)}$` (preferir `e^{...}` a `\exp(...)`)

**Patrones de reemplazo al migrar `<code>` → KaTeX**

Dentro de `.big-example` el template original suele usar `<code>` con entidades HTML:

```html
<!-- Antes -->
<div class="big-example">
  <code>h<sub>L</sub> = f &times; (L/D) &times; (v&sup2;/2g)</code>
</div>

<!-- Después -->
<div class="big-example">
  <p>$$h_L = f \cdot \frac{L}{D} \cdot \frac{v^2}{2g}$$</p>
</div>
```

Dentro de `.formula` (variante usada en algunas presentaciones), mantener el wrapper:

```html
<!-- Antes -->
<div class="formula">ε = [1 − exp(−NTU(1 − C<sub>r</sub>))] / [1 − C<sub>r</sub> exp(−NTU(1 − C<sub>r</sub>))]</div>

<!-- Después -->
<div class="formula">$$\varepsilon = \frac{1 - e^{-\text{NTU}(1 - C_r)}}{1 - C_r \, e^{-\text{NTU}(1 - C_r)}}$$</div>
```

**Conversiones de entidades comunes:**

| HTML | KaTeX |
|---|---|
| `&times;` | `\times` o `\cdot` |
| `&sup2;` | `^2` |
| `&radic;(...)` | `\sqrt{...}` |
| `&pi;`, `&rho;`, `&mu;`, `&Delta;`, `&sigma;` | `\pi`, `\rho`, `\mu`, `\Delta`, `\sigma` |
| `&minus;` | `-` |
| `&middot;` | `\cdot` |
| `&asymp;` | `\approx` |
| `&prop;` | `\propto` |
| `x<sub>i</sub>` | `x_i` o `x_{\text{palabra}}` |
| `x<sup>2</sup>` | `x^2` o `x^{2.5}` |
| `&#7745;` (m con punto) | `\dot{m}` |

**NUNCA** dejar fórmulas como texto plano (ej: "ρt = m/V"). Siempre usar notación KaTeX. Después de la migración:

```bash
# No debe quedar ningún <code> con fórmula cruda:
grep -c "<code>" public/classroom/{slug}/slides/clase-XX.html  # debería ser 0
```

### Videos de YouTube

**Videos siempre a la DERECHA en layout `two-col`, nunca debajo del contenido.**

**Convertir URL a embed:** `https://www.youtube.com/watch?v=VIDEO_ID` → `https://www.youtube.com/embed/VIDEO_ID`.

**Patrón simple (horizontal 16:9) — recomendado:**
```html
<div class="two-col">
  <div>
    <!-- contenido de texto -->
  </div>
  <div style="aspect-ratio:16/9;width:100%;border-radius:0.5rem;overflow:hidden;">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="Título del video"
      style="width:100%;height:100%;border:0;"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen></iframe>
  </div>
</div>
```

**Video vertical (YouTube Shorts, 9:16):** mismo patrón pero envuelto en un contenedor con ancho máximo:
```html
<div style="display:flex;align-items:center;justify-content:center;">
  <div style="width:min(300px,100%);aspect-ratio:9/16;border-radius:0.5rem;overflow:hidden;">
    <iframe src="https://www.youtube.com/embed/VIDEO_ID" title="..."
      style="width:100%;height:100%;border:0;" allowfullscreen></iframe>
  </div>
</div>
```

**Usar iframe embebido en vez de miniaturas estáticas.** Los thumbnails PNG de YouTube (típicamente con sufijo `-3.png`) suelen ser ghosts borrosos en presentaciones previas — siempre reemplazar por el `<iframe>` real.

## Íconos SVG (Lucide inline)

**Regla absoluta: NO usar emojis como íconos** (💡 🔍 ⚗️ 📍 📄 ✅ 🧠 📤 🔀 🎯 📊 etc.). Se renderizan de forma inconsistente entre SO/navegador, se ven infantiles en un entorno académico y no pueden estilizarse con CSS. Reemplazar por **Lucide SVG inline**.

### Patrón base

```html
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"
     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true">
  <!-- path data del ícono -->
</svg>
```

- `width/height="1em"` → hereda tamaño del contenedor (se escala con `font-size`)
- `stroke="currentColor"` → hereda el color del contenedor (así cambia automáticamente con `color: var(--brand-yellow-dark)` en el padre)
- `aria-hidden="true"` → es decorativo, no es lectura de pantalla

### Paths Lucide frecuentes (v0.400+)

| Contexto | Ícono | Path data |
|---|---|---|
| Idea / concepto | `lightbulb` | `<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>` |
| Búsqueda / empírico | `search` | `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>` |
| Laboratorio / método | `flask-conical` | `<path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/>` |
| Ubicación / contexto | `map-pin` | `<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>` |
| Documento | `file-text` | `<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>` |
| OK / check | `check-circle-2` | `<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>` |
| Advertencia | `alert-triangle` | `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>` |
| Error / no | `x-circle` | `<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>` |
| Cerebro / análisis | `brain` | `<path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 0 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 0 1 12 18Z"/>` |
| Upload | `upload` | `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>` |
| Shuffle / comparar | `shuffle` | `<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/><path d="m18 14 4 4-4 4"/>` |
| Target / objetivo | `target` | `<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>` |
| Personas / equipo | `users` | `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` |
| Calendario | `calendar` | `<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>` |
| Gráfica barras | `bar-chart-3` | `<path d="M3 3v18h18"/><path d="M8 17v-5"/><path d="M12 17v-9"/><path d="M16 17v-3"/>` |
| Gráfica línea | `line-chart` | `<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>` |
| Mail | `mail` | `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>` |
| Shield / protección | `shield-check` | `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>` |
| Nav anterior | `chevron-left` | `<path d="m15 18-6-6 6-6"/>` |
| Nav siguiente | `chevron-right` | `<path d="m9 18 6-6-6-6"/>` |
| Fullscreen | `maximize-2` | `<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/>` |
| Sparkles / IA | `sparkles` | `<path d="m12 3-1.9 5.8a2 2 0 0 1-1.287 1.288L3 12l5.813 1.9a2 2 0 0 1 1.288 1.288L12 21l1.9-5.813a2 2 0 0 1 1.287-1.288L21 12l-5.813-1.9a2 2 0 0 1-1.288-1.287Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>` |

Para otros íconos: https://lucide.dev/icons (copiar el SVG de la preview).

### CSS de soporte

```css
/* Íconos en headings/eyebrows heredan el acento amarillo */
h3 svg, .eyebrow svg {
  vertical-align: -0.15em;
  margin-right: 0.4em;
  color: var(--brand-yellow-dark);
}
/* Íconos en banners / cards — hereda color del texto */
.banner svg, .card svg { vertical-align: -0.15em; }
```

## Enlaces a plataformas (↗)

Cuando se nombre una plataforma (ChatGPT, Claude, Perplexity, SciSpace, Google Scholar, BloqueNeón, Amazon, Alkosto, Figma, Canva, Gamma, draw.io, Miro, etc.), **envolverla en un `<a>` clickeable** con `target="_blank" rel="noopener"` y la clase `.platform-link`.

### CSS (agregar al `<style>`)

```css
a.platform-link {
  color: var(--brand-dark);
  text-decoration: none;
  border-bottom: 2px solid var(--brand-yellow);
  padding-bottom: 0.05em;
  transition: color 180ms, border-color 180ms;
}
a.platform-link:hover {
  color: var(--brand-yellow-dark);
  border-bottom-color: var(--brand-yellow-dark);
}
a.platform-link::after {
  content: " ↗";
  font-size: 0.65em;
  opacity: 0.5;
  margin-left: 0.12em;
  vertical-align: 0.3em;
}

/* Para h2 que contiene uno o dos <a> (ej: "ChatGPT / Claude") */
h2 a, h2 a:hover { color: inherit; text-decoration: none; }
h2 a {
  border-bottom: 3px solid var(--brand-yellow);
  transition: border-color 180ms, color 180ms;
  padding-bottom: 0.05em;
}
h2 a:hover { color: var(--brand-yellow-dark); border-bottom-color: var(--brand-yellow-dark); }

/* Para títulos combinados tipo "SciSpace / Consensus": dividir en 2 <a> */
```

### URLs comunes (referencia rápida)

| Plataforma | URL |
|---|---|
| ChatGPT | https://chatgpt.com |
| Claude | https://claude.ai |
| Perplexity | https://www.perplexity.ai |
| SciSpace | https://typeset.io |
| Consensus | https://consensus.app |
| Google Scholar | https://scholar.google.com |
| Web of Science | https://www.webofscience.com |
| NotebookLM | https://notebooklm.google.com |
| BloqueNeón (Canvas Uniandes) | https://bloqueneon.uniandes.edu.co |
| Uniandes | https://uniandes.edu.co |
| Ingeniería Química Uniandes | https://ingenieriaquimica.uniandes.edu.co |
| draw.io | https://app.diagrams.net |
| Lucidchart | https://www.lucidchart.com |
| Miro | https://miro.com |
| Canva | https://www.canva.com |
| Figma | https://www.figma.com |
| Tableau | https://www.tableau.com |
| Power BI | https://powerbi.microsoft.com |
| Flourish | https://flourish.studio |
| Datawrapper | https://www.datawrapper.de |
| Gamma | https://gamma.app |
| BioRender | https://www.biorender.com |
| Amazon | https://www.amazon.com |
| MercadoLibre (CO) | https://www.mercadolibre.com.co |
| Alkosto | https://www.alkosto.com |
| Éxito | https://www.exito.com |
| Sigma-Aldrich | https://www.sigmaaldrich.com |
| ThermoFisher | https://www.thermofisher.com |
| Turnitin | https://www.turnitin.com |

Si no hay URL confiable para algo nombrado en un slide, dejarlo como texto plano en vez de inventarla.

## Patrones interactivos (dynamic HTML)

Las presentaciones HTML deben sentirse dinámicas. El set mínimo que lleva cada presentación:

### 1. Stagger reveal (fadeInUp escalonado)

Cuando un slide gana `.active`, sus grids/listas hijas aparecen de forma escalonada. Útil en `.grid cols-2/3/4`, `.tipo-block`, `.card`, `.timeline-line`, `.workflow`, etc.

```css
.slide.active .stagger-in > * { animation: fadeInUp 0.4s ease both; }
.slide.active .stagger-in > *:nth-child(1) { animation-delay: 0.05s; }
.slide.active .stagger-in > *:nth-child(2) { animation-delay: 0.15s; }
.slide.active .stagger-in > *:nth-child(3) { animation-delay: 0.25s; }
.slide.active .stagger-in > *:nth-child(4) { animation-delay: 0.35s; }
.slide.active .stagger-in > *:nth-child(5) { animation-delay: 0.45s; }
.slide.active .stagger-in > *:nth-child(6) { animation-delay: 0.55s; }
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

Añadir `class="stagger-in"` al contenedor que quieres animar.

### 2. Hover-lift en cards

```css
.card, .scenario-box, .agenda-card, .icon-card, .service-card, .time-block, .step-block,
.interactive-card, .reflection .item, .error-card {
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}
.card:hover, .scenario-box:hover /* etc. */ {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}
```

### 3. Focus rings accesibles

```css
a:focus-visible, button:focus-visible, summary:focus-visible,
.interactive-card:focus-visible, .stepper-nav button:focus-visible {
  outline: 3px solid var(--brand-yellow-dark);
  outline-offset: 2px;
  border-radius: 0.35rem;
}
```

### 4. Progress bar pulse al navegar

```css
.progress.pulsing { animation: progPulse 0.5s ease; }
@keyframes progPulse {
  0%   { box-shadow: 0 0 0 0 rgba(255,191,0,0.0); }
  50%  { box-shadow: 0 0 12px 3px rgba(255,191,0,0.8); }
  100% { box-shadow: 0 0 0 0 rgba(255,191,0,0.0); }
}
```

En el JS del navegador (ya existente en el template), dentro de `render()` añadir:
```js
if (progress) {
  progress.classList.remove('pulsing');
  void progress.offsetWidth; // force reflow
  progress.classList.add('pulsing');
}
```

### 5. Stepper (para convertir grids de 6+ cards en algo navegable)

Patrón que reemplaza un `<div class="grid cols-3">` con 6 cards (que se ve apretado y exige scroll) por un stepper con pestañas numeradas. Ver ejemplo funcional en `clase-04-ia-datos.html` slide 23.

```css
.stepper-nav { display: flex; gap: 0.5rem; flex-wrap: wrap; padding-bottom: 0.5rem; }
.stepper-nav button {
  flex: 1 1 auto; background: #fff; border: 1.5px solid rgba(0,0,0,0.08);
  padding: 0.7em 1em; border-radius: 0.6rem;
  display: flex; align-items: center; gap: 0.7em;
  cursor: pointer; font-family: inherit;
  transition: all 220ms ease;
}
.stepper-nav button .step-n {
  width: 1.9em; height: 1.9em; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--muted); color: var(--brand-dark); font-weight: 700;
}
.stepper-nav button.is-active {
  background: var(--brand-dark); color: #fff; border-color: var(--brand-dark);
  box-shadow: 0 6px 14px rgba(0,0,0,0.15);
}
.stepper-nav button.is-active .step-n {
  background: var(--brand-yellow); color: var(--brand-dark); transform: scale(1.1);
}
.stepper-panel {
  background: #fff; border: 1px solid rgba(0,0,0,0.08);
  border-left: 6px solid var(--brand-yellow);
  border-radius: 0.75rem;
  padding: clamp(1.25rem, 2.2vw, 2rem);
}
.stepper-content { display: none; animation: stepFade 0.3s ease; }
.stepper-content.is-active { display: block; }
@keyframes stepFade {
  from { opacity: 0; transform: translateX(10px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

HTML:
```html
<div class="stepper" data-stepper>
  <div class="stepper-nav" role="tablist">
    <button type="button" role="tab" class="is-active" data-step="1" aria-selected="true">
      <span class="step-n">1</span><span>Preparación</span>
    </button>
    <button type="button" role="tab" data-step="2" aria-selected="false">
      <span class="step-n">2</span><span>EDA</span>
    </button>
    <!-- ... -->
  </div>
  <div class="stepper-panel" role="tabpanel">
    <div class="stepper-content is-active" data-content="1">
      <p class="panel-eyebrow">Etapa 1 de 6</p>
      <h3>Preparación de datos</h3>
      <ul><li>...</li></ul>
    </div>
    <!-- ... -->
  </div>
</div>
```

JS (al final del bloque `(function(){...})()` existente):
```js
document.querySelectorAll('[data-stepper]').forEach(function (stepper) {
  var buttons = stepper.querySelectorAll('.stepper-nav button');
  var panels = stepper.querySelectorAll('.stepper-content');
  function setStep(n) {
    buttons.forEach(function (b) {
      var active = b.getAttribute('data-step') === String(n);
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(function (p) {
      p.classList.toggle('is-active', p.getAttribute('data-content') === String(n));
    });
  }
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { setStep(b.getAttribute('data-step')); });
  });
  // Teclas 1-N mientras el slide está activo
  document.addEventListener('keydown', function (e) {
    var slide = stepper.closest('.slide');
    if (!slide || !slide.classList.contains('active')) return;
    if (/^[1-9]$/.test(e.key)) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      e.preventDefault();
      setStep(e.key);
    }
  });
});
```

### 6. Interactive cards (click para revelar detalle)

```css
.interactive-card { cursor: pointer; transition: transform 220ms, box-shadow 220ms; }
.interactive-card:hover, .interactive-card:focus-within { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.1); }
.interactive-card .detail { opacity: 0.7; transition: opacity 220ms; }
.interactive-card:hover .detail,
.interactive-card:focus-within .detail,
.interactive-card.is-open .detail { opacity: 1; }
```

Con JS para toggle con teclado:
```js
document.querySelectorAll('.interactive-card[data-flip]').forEach(function (card) {
  function toggle() {
    var open = card.classList.toggle('is-open');
    card.setAttribute('aria-pressed', open ? 'true' : 'false');
  }
  card.addEventListener('click', toggle);
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});
```

### 7. Timeline horizontal (línea entre íconos) — FIX al posicionamiento

Patrón para mostrar N pasos en columna con una línea horizontal conectándolos. **Error crítico común**: poner la línea a `top: 50%` — la línea queda **cruzando los títulos/texto** porque el 50% del step no coincide con el centro de los íconos.

**Fix**: posicionar la línea en el centro vertical del **ícono** (no del step completo), usando la suma del padding-top y media altura del ícono. Si el step tiene zigzag (`.top` arriba / `.bottom` abajo), neutralizarlo.

```css
.timeline-line {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem; position: relative; margin-top: 1rem;
}
@media (max-width: 900px) { .timeline-line { grid-template-columns: repeat(2, 1fr); } }
.timeline-line::before {
  content: ''; position: absolute;
  /* Alineada con el centro vertical del círculo/ícono */
  top: calc(0.75rem + clamp(1rem, 1.5vw, 1.3rem));
  left: 8%; right: 8%;
  height: 2px; background: var(--brand-yellow-dark);
  opacity: 0.3; z-index: 0;
}
@media (max-width: 900px) { .timeline-line::before { display: none; } }
.timeline-line .step {
  text-align: center; padding: 0.75rem 0.5rem 0;
  position: relative; z-index: 1;
  /* si había zigzag, anularlo */
  align-self: stretch !important;
}
.timeline-line .step .circle {
  position: relative; z-index: 2;
  display: inline-flex; align-items: center; justify-content: center;
  width: 2em; height: 2em; background: var(--brand-yellow);
  color: var(--brand-dark); border-radius: 999px;
  font-weight: 700; font-size: clamp(0.9rem, 1.3vw, 1.2rem);
  margin: 0 auto 0.6em;
  box-shadow: 0 0 0 4px #fff; /* "corta" la línea al pasar por el círculo — estilo metro */
}
```

### 8. Reduced motion

Al final del `<style>`, agrupar TODAS las animaciones en un único media query:

```css
@media (prefers-reduced-motion: reduce) {
  .slide.active .stagger-in > *,
  .qr-img::after, .qr-scan-label,
  .progress.pulsing, .stepper-content.is-active {
    animation: none !important;
  }
  .interactive-card, .card, .step-block, .scenario-box, .icon-card,
  .service-card, .agenda-card, .time-block, .reflection .item {
    transition: none;
  }
  .card:hover, .scenario-box:hover /* etc */ {
    transform: none;
  }
}
```

### 9. Figure con caption (para figuras numeradas del PDF fuente)

```html
<figure class="fig">
  <div class="fig-wrap">
    <img src="img/nombre.jpeg" alt="Descripción accesible" />
  </div>
  <figcaption>Figura N. Descripción de la figura.</figcaption>
</figure>
```

```css
.fig { margin: 1.5rem 0; }
.fig-wrap {
  display: flex; justify-content: center;
  background: #fafafa; border: 1px solid rgba(0,0,0,0.08);
  border-radius: 0.5rem; padding: clamp(0.75rem, 1.5vw, 1.25rem);
}
.fig-wrap img { max-height: 55vh; width: auto; max-width: 100%; border-radius: 0.25rem; }
.fig figcaption {
  text-align: center; font-style: italic;
  font-size: clamp(0.75rem, 1.1vw, 1rem);
  color: var(--brand-gray); margin-top: 0.5rem;
}
```

## Arreglar presentaciones existentes — workflow probado

Muchas presentaciones del repo fueron generadas previamente con un pipeline que dejaba **imágenes "ghost"** (placeholders borrosos) y **fórmulas como texto plano** con `<code>` y entidades HTML. Este workflow recupera una presentación existente al mismo estándar que una nueva.

### Reconocer ghosts

Las imágenes ghost son blobs desenfocados de 300-500 KB sin contenido real — resto del pipeline anterior que tomaba screenshots miniatura desenfocados. Suelen tener:

- **Sufijo `-3.png`** en el nombre (`pres11-p08-3.png`, `pres09-p21-3.png`). El `-3` es la marca casi segura.
- Ocasionalmente `-2.png` o `-4.png` son ghost también — siempre verificar visualmente con `Read`.
- Las que **sí son reales** suelen tener `-2.png` (extracción previa buena).

```bash
# Listar todas las referencias a imágenes de la presentación
grep -oE "img/presXX[^\"]*" public/classroom/{slug}/slides/claseXX.html | sort -u

# Revisar cada archivo visualmente con Read en paralelo
```

Si al abrir con `Read` una imagen se ve como un blob de colores difuso sin trazos definidos, es ghost y debe reemplazarse.

### Workflow paso a paso (lo que funciona)

1. **Inventario inicial**
   ```bash
   wc -l public/classroom/{slug}/slides/claseXX.html
   grep -c "data-slide" …/claseXX.html     # nº de slides
   grep -c "<code>"    …/claseXX.html     # nº fórmulas a convertir
   grep -c "katex"     …/claseXX.html     # 0 = no tiene KaTeX cargado
   grep -oE "img/presXX[^\"]*" …/claseXX.html | sort -u   # refs de imagen
   ```

2. **Analizar PDF fuente** — listar imágenes únicas por primera página y mapear a slides (ver sección "Imágenes" arriba).

3. **Verificar visualmente** cada imagen **existente** y cada imagen **nueva extraída del PDF**. Marcar cuáles son ghosts y cuáles son reales.

4. **Extraer las que faltan** del PDF con el snippet `xref_first_page`.

5. **Agregar KaTeX CDN + CSS** al `<head>` y `<style>` (ver sección de KaTeX).

6. **Convertir fórmulas** `<code>` o `.formula` a `$$...$$` (tabla de entidades en sección KaTeX). Verificar con `grep -c "<code>"` que quede en 0.

7. **Reemplazar ghosts** con `Edit` + `replace_all:true` (un reemplazo por archivo ghost):
   ```
   img/presXX-pYY-3.png  →  img/presXX-pZZ-1.jpeg
   ```

8. **Integrar imágenes nuevas** en slides que antes no tenían — usar `two-col` con texto a la izquierda e imagen a la derecha.

9. **Borrar los ghost** obsoletos del repo: `rm public/classroom/{slug}/slides/img/presXX-*-3.png`.

10. **Validar HTML** con un parser básico:
    ```python
    from html.parser import HTMLParser
    VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
    class V(HTMLParser):
        def __init__(self): super().__init__(); self.stack=[]; self.errors=[]
        def handle_starttag(self,t,a):
            if t not in VOID: self.stack.append((t,self.getpos()))
        def handle_endtag(self,t):
            if t in VOID: return
            if not self.stack or self.stack[-1][0]!=t:
                self.errors.append(f'mismatch at {self.getpos()}')
            elif self.stack: self.stack.pop()
    p = V()
    with open('…/claseXX.html') as f: p.feed(f.read())
    print('Errors:', len(p.errors), 'Unclosed:', len(p.stack))
    ```

11. **Commit y `git push origin HEAD:main`** — el deploy se dispara solo.

### Separadores de sección (title-slides oscuros)

Cuando una presentación tiene "Operación en paralelo" vs "Operación en serie", cada tema mayor debe estar precedido por un `<section class="slide title-slide">` de separación. Si uno falta, agregarlo con el mismo patrón que los demás:

```html
<section class="slide title-slide" data-slide>
  <div class="content">
    <p class="eyebrow">Sección del tema</p>
    <h1>Título grande</h1>
    <p>Subtítulo breve.</p>
    <div class="pill-row"><span class="pill">Tag</span></div>
  </div>
</section>
```

### Imágenes duplicadas en un mismo slide

Error recurrente del pipeline anterior: `<img src="mismo.png">` dos veces en la misma slide (lado a lado dentro de un `two-col` sin contenido real en el otro). Detectarlo con:

```bash
grep -n "img src" …/claseXX.html | uniq -f1 -d  # muestra líneas contiguas con mismo src
```

Reemplazar por **una sola** imagen centrada:
```html
<div style="display:flex;justify-content:center;">
  <img class="diagram" src="img/…" alt="…" style="max-height:55vh;" />
</div>
```

## Checklist al crear una presentación

1. [ ] Leer TODO el PDF fuente completo
2. [ ] Extraer TODAS las imágenes del PDF SIN filtro de tamaño
3. [ ] Verificar visualmente CADA imagen extraída con `Read` tool para clasificarla
4. [ ] Descartar solo: barras 284x85, íconos <50px. TODO lo demás es contenido
5. [ ] Copiar `_template-slides.html` como base (incluye KaTeX CDN)
6. [ ] Agregar KaTeX CDN al `<head>` si no está en el template
7. [ ] Crear todos los slides — **cada página del PDF debe tener al menos un slide**
8. [ ] Si una página tiene mucho contenido, dividir en 2+ slides
9. [ ] En slides divididos, repetir la imagen relevante en ambas partes
10. [ ] Fórmulas: TODAS con KaTeX (`$...$` o `$$...$$`), nunca texto plano
11. [ ] Videos YouTube: siempre a la DERECHA en `two-col`
12. [ ] **NO usar emojis como íconos** — reemplazar TODOS por SVG Lucide inline (incluidos los glifos de nav `‹ › ⛶`)
13. [ ] **Enlaces clickeables** en cada nombre de plataforma/herramienta (ChatGPT, BloqueNeón, Figma, etc.)
14. [ ] Agregar CSS de patrones interactivos: stagger-in, hover-lift, focus-visible, progress pulse, `prefers-reduced-motion`
15. [ ] Para grids con 6+ cards repetitivos: convertir a stepper (ver sección "Patrones interactivos")
16. [ ] Para timelines horizontales con íconos: posicionar línea con `top: calc(padding + icon-half-height)`, NO `top: 50%`
17. [ ] Para figuras del PDF con numeración: usar `<figure>` + `<figcaption>` (patrón en sección "Patrones interactivos")
18. [ ] Verificar que TODOS los acentos estén correctos; comillas tipográficas «...» en citas
19. [ ] Verificar visualmente CADA slide comparando contra el PDF original
20. [ ] Validar HTML (parser void-aware) — 0 errors, 0 unclosed
21. [ ] Agregar metadata en el array `presentations` del curso en `{course}.ts`
22. [ ] Campo `file` = solo nombre del archivo, NO ruta completa
23. [ ] Commit y push — el deploy a GitHub Pages se dispara solo (~1-2 min)

## Refactor rápido de emojis → SVG (presentaciones existentes)

Para reemplazar todos los emojis de una presentación existente, los agentes paralelos han hecho esto exitosamente con instrucciones como:

> "Find every emoji used as an icon and swap for inline Lucide SVG. Use `width/height="1em"`, `stroke="currentColor"`. Pick the best semantic icon per context (💡 → lightbulb, 🔍 → search, ⚗️ → flask-conical, etc.). Also replace the nav glyphs ‹ › ⛶ in the `.controls` buttons."

Los emojis más frecuentes a buscar con `grep -oE '[💡🔍⚗️📍📄✅🧠📤🔀🎯📊📈🧮❌⚠️📧🗓📆🚢⚙🔬🏭💻📁📋✈🔄💾🔌📦⛑️📨🌟🎓👥🤝📚💼🎬🎨📹🎙️🏆✨❤️💰]' archivo.html | sort -u` y reemplazar 1 a 1.

## Errores comunes a evitar

### Errores de imágenes (los más frecuentes y costosos)
- **Filtrar imágenes por tamaño (>800KB o >1MB)** → Esto descarta ~70% de las imágenes técnicas. Las ilustraciones de equipos, microscopías SEM, diagramas de proceso son >1MB. NO filtrar por tamaño.
- **No verificar visualmente cada imagen** → Los nombres de archivo (`pXX-Y.png`) no indican qué contiene la imagen. SIEMPRE abrir y verificar antes de asignar a un slide.
- **Imágenes ghost del pipeline anterior** → Archivos con sufijo `-3.png` (a veces `-4.png`) son blobs borrosos sin contenido. Verificar visualmente con `Read` y reemplazar con extracción fresca del PDF (sufijo `-1.jpeg`).
- **Incluir barras decorativas del tema original** → Aparecen como imágenes borrosas/ghost (284x85 px). Nunca referenciarlas.
- **Imagen cruzada entre slides** → La imagen A aparece donde debería ir la B. Verificar visualmente cada asignación.
- **Imagen duplicada en un mismo slide** → El mismo `src` aparece dos veces side-by-side. Dejar solo una, centrada.
- **Slide dividido sin imagen** → Cuando un slide se divide en 2, el segundo queda sin la imagen. Repetir la imagen en ambos.
- **Miniatura estática de YouTube** → En presentaciones viejas aparece el thumbnail PNG como imagen. Reemplazar por `<iframe>` embebido (ver sección YouTube).
- **GIF "no se mueve"** → Casi siempre caché del navegador. Pedir Cmd+Shift+R antes de investigar. Validar el GIF con Pillow si persiste.

### Errores de layout
- **Video YouTube abajo del contenido** → Siempre ponerlo a la DERECHA en `two-col`.
- **Slide con `two-col` pero solo una columna** → Si se elimina una imagen, quitar también el wrapper `two-col`.
- **Fórmulas como texto plano** → `ρ = m/V` en vez de `$\rho = \frac{m}{V}$`. Siempre usar KaTeX.
- **Cards ilegibles en title-slide** → El selector `.slide.title-slide p { color: #d4d4d8 }` aclara el texto de las `<p>` también dentro de las `.card`. Agregar el override CSS mostrado en la sección KaTeX.

### Errores estructurales
- **`file` con ruta completa** → URL se duplica. Solo poner el nombre: `'clase-03-diagramas.html'`
- **Omitir contenido del PDF** → Si hay mucho texto, dividir en más slides, NUNCA eliminar.
- **Olvidar `data-slide`** → El slide no será navegable.
- **Olvidar `active` en el primer slide** → Pantalla en blanco al cargar.
- **Imágenes con ruta absoluta** → Usar `img/nombre.png` relativo al HTML.
