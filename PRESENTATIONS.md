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

**Extracción sin filtro de tamaño:**
```python
import fitz, os

doc = fitz.open('archivo.pdf')
out_dir = 'public/classroom/{courseSlug}/slides/img'

for i, page in enumerate(doc):
    for j, img_info in enumerate(page.get_images(full=True)):
        xref = img_info[0]
        pix = fitz.Pixmap(doc, xref)
        if pix.n > 4: pix = fitz.Pixmap(fitz.csRGB, pix)
        w, h = pix.width, pix.height
        if w < 50 or h < 50: continue  # Solo descartar íconos diminutos
        fname = f'pres{num:02d}-p{i+1:02d}-{j+1}.png'
        pix.save(os.path.join(out_dir, fname))
doc.close()
```

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

### Fórmulas matemáticas con KaTeX

**Agregar KaTeX CDN al `<head>`:**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}]});"></script>
```

**Uso:**
- Inline: `$\rho_t = m / V$`
- Display (centrada): `$$W = W_i \times 10 \times \left(\frac{1}{\sqrt{P_{80}}} - \frac{1}{\sqrt{F_{80}}}\right)$$`
- Subíndices: `$\rho_b$`, `$d_{50}$`, `$K_{St}$`
- Fracciones: `$\frac{a}{b}$`
- Griegos: `$\varepsilon$`, `$\theta$`, `$\phi$`, `$\alpha$`

**NUNCA** dejar fórmulas como texto plano (ej: "ρt = m/V"). Siempre usar notación KaTeX.

### Videos de YouTube

**Videos siempre a la DERECHA en layout `two-col`, nunca debajo del contenido.**

**Video vertical (YouTube Shorts):**
```html
<div class="two-col">
  <div>
    <!-- contenido de texto -->
  </div>
  <div style="display:flex;align-items:center;justify-content:center;">
    <div style="width:min(300px,100%);aspect-ratio:9/16;border-radius:0.75rem;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
      <iframe style="width:100%;height:100%;border:none;" src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
    </div>
  </div>
</div>
```

**Video horizontal (normal):**
```html
<div class="two-col">
  <div>
    <!-- contenido de texto -->
  </div>
  <div style="display:flex;align-items:center;justify-content:center;">
    <div style="width:min(500px,100%);aspect-ratio:16/9;border-radius:0.75rem;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
      <iframe style="width:100%;height:100%;border:none;" src="https://www.youtube.com/embed/VIDEO_ID" allowfullscreen></iframe>
    </div>
  </div>
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
- **Incluir barras decorativas del tema original** → Aparecen como imágenes borrosas/ghost (284x85 px). Nunca referenciarlas.
- **Imagen cruzada entre slides** → La imagen A aparece donde debería ir la B. Verificar visualmente cada asignación.
- **Slide dividido sin imagen** → Cuando un slide se divide en 2, el segundo queda sin la imagen. Repetir la imagen en ambos.

### Errores de layout
- **Video YouTube abajo del contenido** → Siempre ponerlo a la DERECHA en `two-col`.
- **Slide con `two-col` pero solo una columna** → Si se elimina una imagen, quitar también el wrapper `two-col`.
- **Fórmulas como texto plano** → `ρ = m/V` en vez de `$\rho = \frac{m}{V}$`. Siempre usar KaTeX.

### Errores estructurales
- **`file` con ruta completa** → URL se duplica. Solo poner el nombre: `'clase-03-diagramas.html'`
- **Omitir contenido del PDF** → Si hay mucho texto, dividir en más slides, NUNCA eliminar.
- **Olvidar `data-slide`** → El slide no será navegable.
- **Olvidar `active` en el primer slide** → Pantalla en blanco al cargar.
- **Imágenes con ruta absoluta** → Usar `img/nombre.png` relativo al HTML.
