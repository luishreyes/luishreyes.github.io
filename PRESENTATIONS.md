# Presentaciones HTML — Guía de creación

> **Leer esta sección al crear o editar presentaciones de clase.**

## Principios fundamentales (mismos que lecturas)

1. **No resumir, no recortar.** Cada página del PDF fuente debe tener su slide correspondiente. Si una página tiene mucho contenido, dividirla en 2+ slides. NUNCA omitir información.
2. **Complementar, no reemplazar.** Agregar imágenes, diagramas o contexto que enriquezca. Preservar el 100% del contenido original.
3. **Todo en español con tildes correctas.** á, é, í, ó, ú, ñ, ü.
4. **Extraer imágenes del PDF fuente** cuando sean diagramas o figuras técnicas relevantes. Usar PyMuPDF (`fitz`) para extraer, descartar imágenes decorativas/fondos (>1MB suelen ser fondos).

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

### Imágenes

- Guardar en `public/classroom/{courseSlug}/slides/img/`
- Referenciar con ruta relativa: `src="img/nombre.png"`
- Extraer del PDF fuente con PyMuPDF:
  ```python
  import fitz
  doc = fitz.open('archivo.pdf')
  for i, page in enumerate(doc):
      for j, img_info in enumerate(page.get_images(full=True)):
          xref = img_info[0]
          pix = fitz.Pixmap(doc, xref)
          if pix.n > 4: pix = fitz.Pixmap(fitz.csRGB, pix)
          if pix.width < 100 or pix.height < 100: continue  # Skip tiny icons
          pix.save(f'img/slide-p{i+1:02d}-{j+1}.png')
  ```
- Descartar imágenes >1MB (suelen ser fondos decorativos, no diagramas)
- Usar clase `diagram` en `<img>` para max-width, border-radius y shadow automáticos

## Checklist al crear una presentación

1. [ ] Leer TODO el PDF fuente completo
2. [ ] Extraer imágenes relevantes del PDF (descartar fondos)
3. [ ] Copiar `_template-slides.html` como base
4. [ ] Crear todos los slides — **cada página del PDF debe tener al menos un slide**
5. [ ] Si una página tiene mucho contenido, dividir en 2+ slides (usar "Título (1/2)" y "(2/2)")
6. [ ] Verificar que TODOS los acentos estén correctos
7. [ ] Verificar visualmente navegando todos los slides
8. [ ] Agregar metadata en el array `presentations` del curso en `pou.ts`
9. [ ] Campo `file` = solo nombre del archivo, NO ruta completa
10. [ ] Commit y push

## Errores comunes a evitar

- **`file` con ruta completa** → URL se duplica (`/classroom/slug/slides//classroom/slug/slides/...`). Solo poner el nombre: `'clase-03-diagramas.html'`
- **Omitir contenido del PDF** → El principio #1 es no recortar. Si hay mucho texto, dividir en más slides.
- **Olvidar `data-slide`** → El slide no será navegable
- **Olvidar `active` en el primer slide** → Pantalla en blanco al cargar
- **Imágenes con ruta absoluta** → Usar `img/nombre.png` relativo al HTML
