# Portafolio Docente — Luis H. Reyes

> **Leer este archivo al inicio de cada sesión de trabajo.**

## Proyecto

Portafolio docente personal hospedado en GitHub Pages.

- **Repo:** `luishreyes/luishreyes.github.io`
- **URL live:** https://luishreyes.github.io
- **Stack:** React 19 + TypeScript + Vite + React Router 7 + Tailwind CSS + Framer Motion
- **Deploy:** Automático al hacer push a `main` (workflow `.github/workflows/deploy.yml`)

## Estructura del proyecto

```
components/           ← Componentes React reutilizables
  classroom/          ← Componentes del Classroom (CourseAccessGate, CourseCard, CourseHero, etc.)
  data/               ← Datos (cursos, estudiantes, research, teaching, etc.)
    classroom/        ← Datos por curso (pou.ts, etc.)
pages/                ← Páginas por sección
  classroom/          ← Páginas del Classroom (index, landing, readings, presentations)
    {courseSlug}/      ← Contenido por curso
      readings/       ← Componentes TSX de lecturas
public/
  classroom/          ← Assets estáticos del Classroom
    _template-slides.html  ← Plantilla base de presentaciones
    {courseSlug}/
      banner.jpg      ← Banner del curso (B&W)
      slides/         ← Presentaciones HTML autocontenidas
        img/          ← Imágenes de las presentaciones
routes.ts             ← Definición de rutas
App.tsx               ← Router principal
```

## Classroom — Sistema de intranet académica

El Classroom es la sección de cursos. Cada curso tiene:
- **Landing** con programa completo (equipo, horarios, metodología, evaluación, etc.)
- **Lecturas** tipo guía interactiva con TOC filtrable
- **Presentaciones** HTML autocontenidas responsivas
- **Acceso por código** (localStorage, sin backend)

### Cómo crear contenido para un curso

Para crear o editar contenido del Classroom, lee la guía correspondiente:

| Tipo de contenido | Guía | Descripción |
|---|---|---|
| **Lecturas** (readings) | [LECTURES.md](LECTURES.md) | Guías interactivas con TOC, callouts, cards, tablas, videos |
| **Presentaciones** (slides) | [PRESENTATIONS.md](PRESENTATIONS.md) | Diapositivas HTML autocontenidas con navegación, imágenes, decoraciones |
| **"Qué hay para hoy"** | [HOY.md](HOY.md) | Popup con cronograma de próximos 7 días |

### Cómo crear un curso nuevo

1. **Crear el archivo de datos** en `components/data/classroom/{slug}.ts`:
   - Definir el objeto `Course` con toda la información: equipo, horarios, metodología, evaluación, módulos, políticas, cronograma, etc.
   - Importarlo en `components/data/classroom.ts` y agregarlo al array `classroomData`

2. **Crear el directorio de assets** en `public/classroom/{slug}/`:
   - `banner.jpg` — Imagen B&W del curso (1920px ancho, grayscale con `sips`)
   - `slides/` — Directorio para presentaciones
   - `slides/img/` — Imágenes de las presentaciones

3. **Crear lecturas** siguiendo [LECTURES.md](LECTURES.md):
   - Componentes TSX en `pages/classroom/{slug}/readings/`
   - Registrar en `pages/classroom/readingsRegistry.ts`
   - Agregar metadata al array `readings` del curso

4. **Crear presentaciones** siguiendo [PRESENTATIONS.md](PRESENTATIONS.md):
   - Archivos HTML en `public/classroom/{slug}/slides/`
   - Agregar metadata al array `presentations` del curso
   - `file` = solo nombre del archivo, NO ruta completa

5. **Agregar cronograma** siguiendo [HOY.md](HOY.md):
   - Definir el array `cronograma` en los datos del curso
   - El componente `TodayButton` se activa automáticamente si hay cronograma

### Código de acceso

Cada curso tiene un `accessCode`. Se guarda en `localStorage` con key `classroom:unlock:{slug}`. Case-insensitive.

## Convenciones

### Colores del portafolio (Tailwind)
- `brand-dark`: #1A1A1A (texto, fondos oscuros, callouts)
- `brand-yellow`: #FFBF00 (acentos principales)
- `brand-yellow-dark`: #E6AC00 (acentos hover)
- `brand-gray`: #555555 (texto secundario)

### Imágenes
- Banners siempre en **blanco y negro** (convertir con `sips -m` y perfil Gray Gamma 2.2)
- Redimensionar a 1920px de ancho para web
- Iconos de redes sociales en grayscale con hover a color

### Idioma
- **Portafolio principal y Classroom index:** Inglés
- **Contenido de cursos (lecturas, presentaciones, landing):** Español con tildes correctas (á, é, í, ó, ú, ñ, ü)
- **Nunca** publicar texto en español sin acentos

### Git
- Commits descriptivos con footer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
- Push frecuente para no perder trabajo
- Deploy automático al pushear a `main`
- Para features grandes, usar rama y mergear cuando esté listo
- Cuando se trabaja desde un worktree de `.claude/worktrees/*`, pushear con `git push origin HEAD:main` (fast-forward)

### Materiales fuente (carpeta `temp/`)
- Los PDFs originales de cada clase viven en `temp/NN-Nombre-del-tema.pdf` (ej. `temp/06-Reduccion-de-Tamano.pdf`)
- **NO está versionada en git** — es espacio de trabajo local
- Cuando el usuario dice "imagen recortada" o "la subí", buscar también en `~/Desktop/` y `~/Downloads/` — no solo en `temp/`
- GIFs animados, imágenes generadas con IA (Gemini) y fotos de laboratorio también suelen estar aquí
- Siempre copiar/mover a `public/classroom/{slug}/slides/img/` antes de referenciarlas

### Errores pre-existentes
- Los archivos en `components/data/students/**/*.ts` tienen errores de TypeScript por imports rotos — **ignorar**, no son del Classroom
- `App.tsx` tiene un error de tipo en `RoutesProps` — **ignorar**

## Principios inquebrantables

### #1: No resumir, no recortar
**NUNCA** omitir información del material fuente. Si un PDF tiene 28 páginas, el contenido generado debe contener toda esa información. Si es demasiado para una lectura o slide, dividir en más secciones/slides. Pero nunca eliminar contenido.

### #2: No filtrar imágenes por tamaño
**NUNCA** descartar imágenes del PDF por ser >800KB o >1MB. Las imágenes grandes son frecuentemente contenido técnico valioso (equipos industriales, microscopías SEM, diagramas de proceso). Solo descartar barras decorativas (284x85 px) e íconos diminutos (<50px). **Siempre verificar visualmente** cada imagen antes de usarla o descartarla.

### #3: Verificar visualmente cada imagen
Los nombres de archivo extraídos del PDF (`pXX-Y.png`) NO indican qué contiene la imagen. **SIEMPRE** abrir la imagen con `Read` tool antes de asignarla a un slide. Las imágenes cruzadas (poner la imagen A donde va la B) son errores frecuentes y costosos de corregir.

### #4: KaTeX para todas las fórmulas
**NUNCA** dejar fórmulas como texto plano. Siempre usar notación KaTeX: `$\rho = \frac{m}{V}$` para inline, `$$...$$` para display. Incluir KaTeX CDN en el `<head>` de cada presentación.

### #5: Videos YouTube a la derecha
Los videos embebidos van siempre a la **DERECHA** en layout `two-col`, nunca debajo del contenido.
