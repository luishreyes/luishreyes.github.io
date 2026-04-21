# Presentaciones HTML — Guía de creación

> **Leer esta sección al crear o editar presentaciones de clase.**

## Principios fundamentales (mismos que lecturas)

1. **No resumir, no recortar.** Cada página del PDF fuente debe tener su slide correspondiente. Si una página tiene mucho contenido, dividirla en 2+ slides. NUNCA omitir información.
2. **Complementar, no reemplazar.** Agregar imágenes, diagramas o contexto que enriquezca. Preservar el 100% del contenido original.
3. **Todo en español con tildes correctas.** á, é, í, ó, ú, ñ, ü.
4. **Extraer TODAS las imágenes del PDF fuente.** Ver sección "Imágenes" abajo para el procedimiento correcto.
5. **Usar KaTeX para fórmulas matemáticas.** Nunca dejar fórmulas como texto plano. Ver sección "Fórmulas matemáticas" abajo.
6. **Videos de YouTube siempre a la derecha** en un layout `two-col`, nunca debajo del contenido.

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
12. [ ] Verificar que TODOS los acentos estén correctos
13. [ ] Verificar visualmente CADA slide comparando contra el PDF original
14. [ ] Agregar metadata en el array `presentations` del curso en `pou.ts`
15. [ ] Campo `file` = solo nombre del archivo, NO ruta completa
16. [ ] Commit y push

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
