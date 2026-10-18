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
      readings/       ← Componentes TSX de lecturas (sistema React DEPRECADO, solo curso 2026-10)
public/
  classroom/          ← Assets estáticos del Classroom
    _template-slides.html  ← Plantilla base de presentaciones
    {courseSlug}/
      banner.jpg      ← Banner del curso (B&W)
      lecturas/       ← Lecturas HTML autocontenidas (SISTEMA VIGENTE) — ver LECTURAS-HTML.md
        Lectura_NN/   ← {Lectura_NN_Tema.html, assets/deloitte.css}
      slides/         ← Presentaciones HTML autocontenidas
        img/          ← Imágenes de las presentaciones
routes.ts             ← Definición de rutas
App.tsx               ← Router principal
```

## Contenido: el portafolio docente y la web (decisiones del 17 oct 2026)

La web y el portafolio docente impreso (el dossier, en un repo privado) se alimentan de la misma información, pero sirven a públicos distintos: el documento a un comité, la web a estudiantes, colegas y empresas.
- **La web sigue los capítulos del documento:** Declaración (portada), Contexto, Trayectoria, Docencia, Formación a escala, Escuela, Investigación, Liderazgo y servicio, Reconocimiento y Lo que sigue. Las páginas de datos (productos, financiamiento, cursos, comités…) son interiores de cada capítulo.
- **El texto sale del último borrador de cada sección, adaptado a un lector público**, nunca copiado, y en los dos idiomas (la traducción al inglés la revisa el profesor). Los archivos del repo privado no se copian: los datos pasan uno por uno.
- **La web nunca dice ni insinúa para qué se escribió el documento.** Nada de comités, ascensos ni argumentos dirigidos a un evaluador.
- **Nada de dinero.** Sí entran, adaptados: la comparación con pares (sin nombres de colegas), los nombres de pregrado, las razones personales de la trayectoria y el doctorado en curso de Carlos Yesiel González Murcia (codirigido).

## Productos (publicaciones, patentes, libros, conferencias)

La página `/research/products`, las cifras de citas, índice h e i10 del resumen de investigación, el CV en PDF y la sección de Scholarship of Teaching leen **`public/data/products.json`**, un arreglo versionado en el repo. Ya no dependen de Supabase (`services/products.ts` hace un `fetch` del archivo al cargar la app).

- **Agregar o corregir un producto:** editar el JSON (en GitHub o aquí) y pushear a `main`; el deploy lo publica. Cada entrada tiene la forma de `Product` (`types.ts`) más `citations` (número o `null`). `type` debe ser un `ProductType`, `researchAreas` uno de los ocho `ResearchArea`, `publicationDate` en `AAAA-MM-DD` y `doi` único (la lista lo usa como `key`; para lo que no tiene DOI se usa un identificador propio, como ya hacen las patentes y los libros autopublicados).
- **Las citas son una foto fija:** se actualizan a mano en `citations`.
- `scripts/export-supabase.mjs` + el workflow manual `export-supabase.yml` hicieron la migración desde Supabase (oct 2026); solo se vuelven a correr para un rescate, y sobrescriben el archivo.
- ⚠️ Nada de dinero: ni montos, ni ingresos, ni financiación de estudiantes (decisión del profesor, 17 oct 2026).

### Imágenes (ya no salen de Supabase)

Desde oct 2026 el sitio no usa Supabase para nada. Las fotos de egresados viven en `public/images/students/{slug}.jpg` (el slug es el nombre de su ficha en `components/data/students/graduated/`), las de testimonios en `public/images/testimonials/` y las de páginas en `public/images/site/`, todas con ruta relativa (`/images/...`). Las de egresados y testimonios van recortadas al cuadrado desde arriba, al 88 % del lado menor, para dejar fuera la estrella de Gemini de la esquina. Los originales se copiaron con el workflow manual `fotos-supabase.yml` a la rama `fotos-supabase`.

## Classroom — Sistema de intranet académica

El Classroom es la sección de cursos. Cada curso tiene:
- **Landing** con programa completo (equipo, horarios, metodología, evaluación, etc.)
- **Material del curso** (antes "Lecturas") — dividido en dos categorías:
  - **Guías** (`category: 'guia'`) — metodología y proceso para entregables (trabajo en equipo, bitácoras, informe, propuesta de valor, flujogramas, etc.)
  - **Lecturas de clase** (`category: 'lectura'`) — contenido que acompaña cada sesión presencial; de aquí salen los quices
- **Presentaciones** HTML autocontenidas responsivas
- **Acceso por código** (localStorage, sin backend)

### Cursos registrados

Los datos de cada curso viven en `components/data/classroom/{slug}.ts` y se importan en `components/data/classroom.ts`:

| Slug | Curso | Notas |
|---|---|---|
| `iqya-2031` | Proyecto de Operaciones Unitarias (POU) | Curso pesado en lecturas técnicas y presentaciones (clases 02 a 18+) |
| `iqya-3050` | Seminario de IQ | Lecturas tipo guía y presentaciones de seminario |
| `dpro-4300` | Diseño Sistémico de Bioproductos | Curso más reciente, agregado a inicios del semestre |
| `iqya-3050` (`spdp.ts`) | SPDP 2026-10 (archivado) | Explorador de retos original (`spdp-retos.ts`, retos de 2026-10) |
| `iqya-3050-2026-20` (`seminario-2026-20.ts`) | SPDP 2026-20 | Explorador propio: `SpdpRetosPage.tsx` + `spdp-theme.css` (identidad del design system del SPDP: Anton/Barlow/Playfair, papel y naranja, todo bajo `.spdp-ds`). Datos en `spdp-retos-2026-20.ts`, **generado** desde la carpeta del curso (`sPDP/202620/presentaciones/datos/exportar-portafolio.py`): no editar a mano |

**⚠️ Terminología:** la UI pública dice "Material del curso", no "Lecturas". Los objetos de datos siguen llamándose `readings` / `Reading` en el código por compatibilidad. La URL sigue siendo `/classroom/{slug}/readings/...`.

### Tipo `Reading` — campo `category` obligatorio en readings nuevos

```ts
interface Reading {
  slug: string;
  title: string;
  summary: string;
  date: string;
  readingMinutes?: number;
  tags?: string[];
  category?: 'guia' | 'lectura'; // si se omite se asume 'guia'
  order?: number;                // posición dentro de su categoría
  href?: string;                 // si se define, abre el HTML autocontenido en pestaña nueva
  bannerImg?: string;            // foto B&W de la tarjeta del índice (ver abajo)
}
```

En `ReadingsIndexPage.tsx` las entradas se separan en dos secciones automáticamente según `category`. Cada tarjeta se muestra con **foto a la izquierda** (`bannerImg`) y el número de la entrada como marca de agua; si `bannerImg` se omite, la tarjeta cae al estilo plano sin foto.

**Banners de las tarjetas (`bannerImg`):** imágenes representativas del tema, en **blanco y negro** y **800px de ancho** (peso objetivo < 100 KB). Viven en `public/classroom/{slug}/lecturas-banners/lNN.jpg` (lecturas) y `public/classroom/{slug}/guias-banners/{nombre}.jpg` (guías). Mismo criterio que los banners de curso. Ver [LECTURAS-HTML.md](LECTURAS-HTML.md) sección "Banner de la tarjeta".

### Cómo crear contenido para un curso

Para crear o editar contenido del Classroom, lee la guía correspondiente:

| Tipo de contenido | Guía | Descripción |
|---|---|---|
| **Programa del curso** (syllabus `programa.html`) | [PROGRAMA.md](PROGRAMA.md) | HTML autocontenido (CSS inline, sin `deloitte.css`) que abre en pestaña nueva y se registra como guía con `href`. Side-nav + scroll-spy, secciones canónicas, acento por curso. Plantilla canónica: `iqya-2031-2026-20/programa.html`. |
| **Lecturas del curso actual** (POU 2026-20 y cursos nuevos) | [LECTURAS-HTML.md](LECTURAS-HTML.md) | **SISTEMA VIGENTE.** Documentos HTML autocontenidos que abren en pestaña nueva (`href`), con `assets/deloitte.css`, side-nav + scroll-spy, callouts, tablas, galerías y calculadoras en JS vanilla, KaTeX. Plantilla canónica: `Lectura_06_Agitacion.html`. |
| **Lecturas React** (POU 2026-10 — `iqya-2031`) | [LECTURES.md](LECTURES.md) | ⚠️ **DEPRECADO** para cursos nuevos. Componentes `.tsx` con TOC click-to-filter. Solo aplica a las lecturas ya publicadas del curso 2026-10. |
| **Presentaciones EDCO** (`edu-pro`) | [EDCO-SLIDES.md](EDCO-SLIDES.md) | **⚠️ OBLIGATORIO para `edu-pro`.** Sistema de diseño completo: motor `deck-stage`, tokens CSS, pesos Dax, HTML canónico de cada componente (agenda, timeline, steps, cards, split, callout, etc.), errores comunes. Leer antes de crear cualquier slide de "Dominando la IA". |
| **Presentaciones** (otros cursos) | [PRESENTATIONS.md](PRESENTATIONS.md) | Diapositivas HTML autocontenidas con íconos SVG Lucide, navegación, imágenes, interactividad |
| **"Qué hay para hoy"** | [HOY.md](HOY.md) | Popup con cronograma de próximos 7 días |
| **Identidad Narrativas Visuales** (`iqya-3751`) | [NARRATIVAS-DESIGN.md](NARRATIVAS-DESIGN.md) | **⚠️ OBLIGATORIO para `iqya-3751-2026-20`.** Identidad propia (carbón · hueso · citrón, Big Shoulders + Archivo, visor). Este curso NO usa el landing claro compartido ni el syllabus Deloitte: landing y Material tienen componente propio (ramificado por slug), y el `programa.html` va en clave oscura. Incluye reglas móvil (una columna, tablas scrolleables), la regla «nada de azul» y el visor de scroll. Leer antes de tocar cualquier superficie del curso. |

### Cómo crear un curso nuevo

1. **Crear el archivo de datos** en `components/data/classroom/{slug}.ts`:
   - Definir el objeto `Course` con toda la información: equipo, horarios, metodología, evaluación, módulos, políticas, cronograma, etc.
   - Importarlo en `components/data/classroom.ts` y agregarlo al array `classroomData`

2. **Crear el directorio de assets** en `public/classroom/{slug}/`:
   - `banner.jpg` — Imagen B&W del curso (1920px ancho, grayscale con `sips`)
   - `slides/` — Directorio para presentaciones
   - `slides/img/` — Imágenes de las presentaciones
   - `lecturas-banners/` y `guias-banners/` — Fotos B&W (800px, < 100 KB) de las tarjetas del índice (`bannerImg`)

3. **Crear el programa del curso** (syllabus) siguiendo [PROGRAMA.md](PROGRAMA.md):
   - HTML autocontenido en `public/classroom/{slug}/programa.html`, copiando el de un curso existente y cambiando el acento en `:root`
   - Registrarlo en el array `readings` con `category: 'guia'`, `order: 1` y `href: '/classroom/{slug}/programa.html'`

4. **Crear lecturas** siguiendo [LECTURAS-HTML.md](LECTURAS-HTML.md) (sistema vigente):
   - Documento HTML autocontenido en `public/classroom/{slug}/lecturas/Lectura_NN/`, partiendo de copiar la lectura anterior
   - Copiar `assets/deloitte.css` a la carpeta de la lectura
   - Agregar metadata al array `readings` del curso **con el campo `href`** (abre en pestaña nueva). NO se crea `.tsx` ni se toca `readingsRegistry.ts`
   - Procesar la foto del banner (B&W, 800px) en `lecturas-banners/lNN.jpg` y declararla con `bannerImg`

5. **Crear presentaciones** siguiendo [PRESENTATIONS.md](PRESENTATIONS.md):
   - Archivos HTML en `public/classroom/{slug}/slides/`
   - Agregar metadata al array `presentations` del curso
   - `file` = solo nombre del archivo, NO ruta completa

6. **Agregar cronograma** siguiendo [HOY.md](HOY.md):
   - Definir el array `cronograma` en los datos del curso
   - El componente `TodayButton` se activa automáticamente si hay cronograma

### Código de acceso

Cada curso tiene un `accessCode`. Case-insensitive.

**El acceso caduca cada día.** En `localStorage`, la key `classroom:unlock:{slug}` guarda la **fecha** en que se abrió el curso (`2026-08-05`), no un `'true'` perpetuo: si no coincide con la de hoy, el código se vuelve a pedir. Vale para todos los cursos del Classroom.

Opcionalmente un curso puede definir un **segundo código para el equipo docente** (`staffAccessCode`). Cuando existe, el gate muestra **dos botones** —«Acceder como estudiante» y «Acceder como profesor»— y cada uno valida **solo** el código de su rol: escribir el código del equipo y pulsar «estudiante» no asciende a nadie. Eso es deliberado, porque así el profesor entra con el código del curso para ver el aula tal como la ven los estudiantes. El rol queda en `classroom:role:{slug}` y se lee con el hook `useCourseRole(slug)` de `CourseAccessGate.tsx`.

### Publicación manual del material (`manualRelease`) — SISTEMA VIGENTE en POU 2026-20

Si un curso define `manualRelease: true`, **nada se abre solo por fecha**: el equipo docente (sesión `staff`) publica u oculta **cada actividad** (lectura/guía/taller, presentación, simulación) con un botón **Publicada/Oculta** en la página de Material; el botón de la cabecera de cada semana publica u oculta el paquete completo en un solo commit. Los estudiantes solo ven lo publicado (una semana sin nada publicado se lista sellada). El estado vive en `published/{slug}.json` en `main` como llaves `reading:{slug}` / `pres:{id}` / `sim:{id}`: la app lo lee de `raw.githubusercontent.com` (~1 min de propagación, con caché en `localStorage` y fallo cerrado) y el botón lo escribe vía la API de GitHub con un fine-grained token que cada docente pega una vez (`classroom:publishToken`). Esos commits NO disparan el deploy (`paths-ignore: published/**`). El material sin `week` sigue siempre visible. El gate por actividad es `isItemOpen` de `useCourseRelease` (`isWeekOpen` queda solo para el modo gradual). Ver [PUBLICACION.md](PUBLICACION.md) para la guía completa (token, semilla, módulos `publishState.ts` / `courseRelease.ts`). `manualRelease` tiene prioridad sobre `gradualRelease`.

### Simuladores de POU 2026-20 (`/classroom/iqya-2031-2026-20/simulations`)

`PouSimulationsPage` reúne los simuladores del curso como tarjetas con captura, en el orden del semestre, con la misma regla de publicación del Material: el estudiante ve los publicados (`sim:{id}`) y los demás como tarjetas selladas con su semana; el equipo docente los ve todos con su botón Publicada/Oculta (controles compartidos en `components/classroom/PouPublishControls.tsx`). Se llega desde el botón «Simuladores» de la portada y desde el Material. Cada simulador declara su captura con `bannerImg`: `public/classroom/iqya-2031-2026-20/simuladores-banners/{id}.jpg`, 800×500 a color (16:10, < 100 KB), recortada de la vista principal del simulador. Al rediseñar un simulador, vuelva a capturar su miniatura.

**Arranque limpio:** los simuladores no recuerdan sus valores entre visitas. Cada vez que se abren (o se recargan) arrancan en el caso del curso, la primera de sus configuraciones, para que nadie los encuentre en el punto en que otro los dejó. Lo único que se guarda en `localStorage` es el fondo papel/blueprint: el `store` de cada explorador solo deja pasar las claves de `STORE_KEEP` (`canvas`) y al cargar borra las que guardaban las versiones anteriores (`state`, `tab`, `view`, `fitTab`). Los simuladores nuevos siguen la misma regla. El Explorador de gráficos lleva en la dirección solo la pestaña y el gráfico que se mira; el Manual de diagramas sí recuerda su lista de chequeo y las secciones visitadas, que son progreso del estudiante y no valores de simulación.

**Un solo sistema y las configuraciones aparte:** cada simulador muestra un sistema, el del caso del curso, y el estudiante lo cambia pieza por pieza: cada control cambia solo lo suyo (el fluido cambia solo el fluido; un codo agrega un codo). Lo único que puede tocar otra clave es lo físicamente necesario de la misma magnitud, como recortar una temperatura al rango de datos del fluido nuevo. Los casos preestablecidos no van en la barra lateral: van en la pestaña **Configuraciones**, como tarjetas con lo que fija cada una y su resultado, y al cargarlas se conservan las opciones de vista y el fluido o la mezcla del estudiante, salvo que el caso se defina por ellos (un ejemplo resuelto, los datos de un taller), y entonces la tarjeta lo dice. La barra lateral abre con «Sistema en pantalla» (qué configuración está cargada y si tiene cambios). Referencia: el Explorador de Bernoulli. Si un simulador tiene equipos distintos (la prensa y el tambor del Explorador de filtración), la barra lateral muestra solo los controles del equipo escogido y cada equipo abre en un caso suyo que funcione (la prensa en el Taller 6, el tambor en el ejemplo 29.2 de McCabe); mientras la página siga abierta, cada equipo guarda sus cambios al pasar al otro.

### Entrega gradual del material (`gradualRelease`)

Si un curso define `gradualRelease: true`, quien entra con el **código de estudiante** solo ve el material de las semanas ya transcurridas y de la semana en curso; quien entra con el **`staffAccessCode`** ve el semestre completo desde el primer día.

| Campo del `Course` | Qué hace |
|---|---|
| `staffAccessCode` | Código alterno del equipo docente. Sin filtro por semana. |
| `gradualRelease` | Activa el filtro para los estudiantes. |
| `releaseLeadDays` | Días de anticipación con que abre cada semana (por defecto 2). |

**Cómo se decide qué está abierto** (`components/classroom/courseRelease.ts`, hook `useCourseRelease`):
- La semana `W` se abre `releaseLeadDays` días antes de su **primera sesión en el `cronograma`** — con el valor por defecto, el material de una semana que arranca el martes queda disponible desde el domingo anterior, que es cuando el aula invertida exige leer.
- El material **sin `week`** (las guías transversales: programa, cronograma, trabajo en equipo, bitácoras…) está **siempre** disponible.
- Una `week` que el cronograma no fecha se deja abierta: no hay con qué cerrarla.

**Dónde se aplica:** `PouMaterialPage` (las semanas futuras se listan como hojas selladas con la fecha de apertura, `.pou-sheet.locked`), `DocViewerPage` (entrar por URL a un documento de una semana futura muestra «Todavía no está disponible»), `PresentationsIndexPage`, `SimulationsIndexPage` (en POU 2026-20 ramifica a `PouSimulationsPage`) y los conteos de `PouLandingPage`.

**⚠️ Requisito de datos:** el filtro depende de que **todo** el material esté etiquetado con `week` y de que el curso tenga `cronograma`. Una lectura, presentación o simulación sin `week` se considera transversal y queda visible desde el día uno.

**⚠️ Es una capa de presentación, no seguridad.** Los HTML de `public/` son archivos estáticos servidos por GitHub Pages: quien conozca la URL exacta del archivo puede abrirlo sin pasar por la aplicación. El filtro evita el spoiler y el ruido, no impide el acceso decidido.

## Convenciones

### Colores (Tailwind)
- **Páginas del portafolio** (todo lo que no es `/classroom`): la paleta del portafolio docente impreso, en `papel-*`, `tinta-*` y `resaltador` (ver «Línea gráfica del portafolio»).
- **Classroom:** los tokens `brand-*` de siempre, que cada curso puede re-tematizar:
  - `brand-dark`: #1A1A1A (texto, fondos oscuros, callouts)
  - `brand-yellow`: #FFBF00 (acentos principales)
  - `brand-yellow-dark`: #E6AC00 (acentos hover)
  - `brand-gray`: #555555 (texto secundario)

### Línea gráfica del portafolio (la del dossier, pasada por el skill)
Desde oct 2026 las páginas del portafolio siguen la línea gráfica del portafolio docente impreso (el dossier), para que la web y el documento se lean como una sola pieza, y **pasan el inspector del skill `design-taste-frontend` con 0 FAIL** (pedido del profesor). Se rehízo a mano: nada se copió del repo privado.
- **Dónde vive:** `components/portafolio-theme.css`, todo bajo `.portafolio`, que `App.tsx` pone en las rutas fuera de `/classroom`. El aula conserva sus temas y los `brand-*`. El menú (`Navbar.tsx`) y el botón de subir son compartidos y ya hablan esta línea también dentro del aula.
- **Color:** papel gris frío (`papel-0` #F5F5F3 de fondo, `papel-100` #EBEBEC hundido, `papel-200` #DCDCDE portada), tinta grafito (`tinta-800` #3A3A3B para leer, `tinta-900` #1D1D1B para títulos y aperturas oscuras) y el amarillo Uniandes `resaltador` #FFE900 **solo como resaltador**: el punto de las palabras de apertura, el subrayado de marcador (`.a-resaltado`), el ítem activo del menú y lo que se toca en un gráfico. Nunca como fondo de un bloque ni como texto.
- **Letra:** Archivo autoalojada (`@fontsource-variable/archivo`), sin Typekit ni CDN. **Cinco tamaños** en todo el sitio: 15, 18, `--t-l`, `--t-titulo` y `--t-marca`.
- **Piezas** (`components/Apertura.tsx`, `Sube.tsx`, `StatsSection.tsx`): `Apertura` para las páginas de sección (foto en blanco y negro a sangre y la palabra en minúscula con punto amarillo), `EncabezadoPagina` para las interiores (título con punto sobre filete de 2 px, entrada y foto opcional; **nunca fijo**), `Cabecera` para el título de cada bloque, `Sube` para la entrada de cada bloque. Clases: `a-c` (el único borde izquierdo), `a-campo`, `a-papel`/`a-hundido`/`a-portada`/`a-oscuro`, `a-registro` (cronologías: año en su columna), `a-tabla`, `a-filtros`, `a-cifras`, `a-cita`, `a-boton`, `a-enlace`.
- **Lo que el skill no admite y por eso se quedó fuera del dossier:** rótulos en versalitas sobre los títulos, números de sección (01, 02…), mono en los metadatos, filetes de 1 px (los de 2 px sí pasan) y el degradado del marcador (se hace con un subrayado grueso). Tampoco tarjetas con borde, sombras en reposo, íconos encima de tarjetas, texto centrado ni texto amarillo.
- **Fotos:** el skill pide al menos cuatro fotos reales por página. Sirven las públicas del repo (`public/images/students`, `testimonials`, `books`, `site`, los banners del aula); nada enlazado desde otros servidores. Medir con `scripts/inspect.mjs` (en la nube, con Playwright: ver la sección del skill).

### Imágenes
- Banners siempre en **blanco y negro** (convertir con `sips -m` y perfil Gray Gamma 2.2)
- Redimensionar a 1920px de ancho para web
- Iconos de redes sociales en grayscale con hover a color

### Tipografía
- Las páginas del portafolio van en **Archivo Variable** (`@fontsource-variable/archivo`), como el dossier.
- Las fuentes **Manrope Variable** (sans) y **JetBrains Mono Variable** (mono) van **autoalojadas** vía `@fontsource-variable/manrope` y `@fontsource-variable/jetbrains-mono` (NPM). Importadas desde `index.tsx`. No usar Google Fonts CDN — el portafolio funciona offline y el load es más rápido.
- El CSS extra `public/classroom-fonts.css` declara las mismas familias para los archivos HTML autocontenidos del Classroom (presentaciones).

### Librerías autoalojadas para los HTML del Classroom
- `public/classroom/vendor/katex/`: KaTeX (fórmulas).
- `public/classroom/vendor/three/`: three.js r170 (`three.module.min.js` + `OrbitControls.js`, licencia MIT). Se usa con un import map (`"three": "/classroom/vendor/three/three.module.min.js"`) y `import()` dinámico, para que solo cargue cuando la sección 3D se abre. Primer uso: el Manual de diagramas de POU (sección Layout e isométricos). Reutilizarlo para los simuladores 3D siguientes en vez de traerlo de un CDN.

### Skill `anatomy` (figuras isométricas interactivas)
Instalado en `.claude/skills/anatomy/` desde [wheresryan22/anatomy](https://github.com/wheresryan22/anatomy) (MIT, oct 2026). Dibuja un equipo real como figura isométrica en SVG, con piezas sólidas, lectura en vivo y movimiento, y opcionalmente WebGL o 3D. Sirve para las figuras de los simuladores y de las lecturas: un equipo del curso (bomba, intercambiador, filtro prensa, plato de destilación) cuya mecánica explica el concepto.
- **El modelo manda:** la lectura y el movimiento salen del mismo modelo del simulador, con los números del curso.
- **Identidad del curso:** usar el tema claro (`--light`), que va con el papel de los simuladores. Todo texto visible (título, pista, lectura) va en español con tildes, aunque los ejemplos del skill estén en inglés.
- **Kit autoalojado:** la figura se arma con `scripts/inline-kit.mjs` dentro del HTML, sin CDN.
- **Verificación:** sus scripts de captura necesitan `CHROME_PATH=/opt/pw-browsers/chromium` en las sesiones en la nube.
- **Ejemplos:** sus páginas no se versionan; se generan con `node examples/<nombre>/build.mjs`.
- ⚠️ **No usar `scripts/publish.mjs`** (la galería comunitaria) con material del curso, salvo que el profesor lo pida.
- **Primeras figuras: el filtro prensa y el filtro de tambor** de la pestaña «Por dentro» del Explorador de filtración (una por equipo; la del tambor vive en `scripts/figuras/filtro-tambor/`, con marcadores `FDRUM_*`). Las dos se acercan con pellizco, arrastre y los botones + − («todo» vuelve a la vista completa): un isométrico tiene la cámara fija, así que no se puede rotar sin rehacer la figura. La de la prensa vive en `scripts/figuras/filtro-prensa/` (ver su README): `node build.mjs --audit` ordena la pintura y corre el audit completo (unos 4 min, debe terminar en «audit passed»), y `node splice.mjs` la reinserta en el HTML publicado entre los marcadores `FPRESS_*_START/END`. La figura no tiene números propios: `FScene` le pasa el ciclo del modelo en cada cuadro. `xprism.mjs` agrega al kit los prismas de sección cóncava que piden las piezas en corte.
- **El sistema flash** es la figura de la pestaña «Tambor» del Explorador de equilibrio y flash: bomba, intercambiador en alto, válvula de expansión con mirilla de flujo y tambor en corte (deflector, malla, rompe-vórtice, visor de nivel, válvulas de presión y de nivel). Vive en `scripts/figuras/flash/` (ver su README), con marcadores `FLASH_*`: `node build.mjs --audit` (medio minuto, debe terminar en «audit passed») y `node splice.mjs`. La mueve el modelo del explorador (`DScene.drawFig` → `FFlash.update`); la velocidad del vapor, el límite de la malla y el tiempo de residencia salen de `drumLoad` (`32_td`), con el tambor de 64 cm del dibujo.
- **El intercambiador de tubos y coraza** es la figura de la pestaña «Por dentro» del Explorador de intercambiadores cuando el equipo es de tubos y coraza (1-n o en serie; contracorriente y paralelo siguen en el lienzo). Son nueve, una por cabezal (BEM, BEU, AES) y por número de corazas apiladas (1 a 3), en `scripts/figuras/intercambiador/` (ver su README): `node build.mjs --all --audit` (cada una entre medio minuto y un minuto, todas deben terminar en «audit passed») y `node splice.mjs`, que copia los SVG a `simulaciones/fig/intercambiador/` (la página pide solo el que necesita) y mete el código entre los marcadores `HXFIG_*`. La mueve el perfil de Nagle del explorador (`profileAll`); en la coraza B el primer paso de tubos entra por el extremo donde sale la coraza (`flip` en `hxProfile`), porque las corazas van apiladas con los canales del mismo lado.
- **En el Explorador de intercambiadores las salidas son consecuencia del equipo:** con las entradas, los caudales y el área y el U instalados, `compute` itera ε-NTU (las propiedades dependen de las salidas) y el balance cierra siempre. La salida objetivo y el retorno máximo del frío van en el panel «06 Lo que pide el proceso» y no entran en la operación: `designFor` los usa aparte (`R.spec`) para el área que pediría el objetivo, el sobrediseño y si el objetivo es posible con esos caudales (Taller 5, parte A). Nunca volver a poner una salida como dato del cálculo.
- **El Explorador de intercambiadores tiene varios equipos** (panel «00 Equipo», como la prensa y el tambor de filtración): tubos y coraza, placas con empaques (modelo de McCabe, cap. 15: Nu = 0,37·Re^0,67·Pr^0,33, f = 2,5·Re^−0,3 y F según N_H; reproduce el ejemplo 15.5), doble tubo (horquillas en contracorriente o paralelo) y aeroenfriador (tiro forzado, aire en contra-cruce; caída del aire por Robinson y Briggs, Δp = Eu·N·G²/ρ). `EQ_ON` en el explorador dice qué equipos aparecen en el selector. Cada uno abre en su caso (`EQ_HOME`) y guarda sus cambios mientras la página esté abierta (`eqMem`). El modelo de los equipos nuevos vive en `computeEq` y `diagnoseEq`. La figura de placas está en `scripts/figuras/placas/` (ver su README): `node build.mjs --audit` y después `node ../intercambiador/splice.mjs`, que la copia como `fig/intercambiador/placas.svg` y mete su código entre los marcadores `PLFIG_*`. La del doble tubo (tres horquillas apiladas, cada rama abierta con el tubo interior entero adentro, cabezales de retorno atrás y prensaestopas adelante) está en `scripts/figuras/doble-tubo/` y se arma igual (`fig/intercambiador/doble.svg`, marcadores `DPFIG_*`); la mueve el perfil del explorador con el ánulo como «coraza», y sus trazos tardan en una rama lo que tarda cada fluido, L/u. La del aeroenfriador (haz de cuatro filas aleteadas entre cabezales de tapones, cámara abierta con dos ventiladores y sus motores, estructura arriostrada) está en `scripts/figuras/aeroenfriador/`: dos variantes, `--odd` para pasos impares (la salida va en el cabezal de atrás), que el splice copia como `aero-par.svg` y `aero-impar.svg` (marcadores `ACFIG_*`).
- **La instalación de bombeo** es la figura de la pestaña «Instalación» (la primera) del Explorador de bombas centrífugas: tanque de succión con su nivel de vidrio, línea de succión con válvula de compuerta, soporte y reducción excéntrica plana arriba, una 2×3-8 de succión axial con la mitad de arriba de la tapa de succión quitada (voluta con lengüeta y garganta, impulsor abierto), sello, caja de rodamientos, acople de espaciador con su guarda, motor sobre su pedestal y la descarga con ampliación, manómetro, retención y válvula de globo. Vive en `scripts/figuras/bomba/` (ver su README), con dos variantes: succión inundada y `--lift` (succión con elevación: la bomba sube sobre un pedestal y el tanque queda abajo; la página escoge según el signo de zₛ). `node build.mjs --audit && node build.mjs --lift --audit` y `node splice.mjs` (marcadores `PBFIG_*`, SVG en `simulaciones/fig/bomba/`). La mueve el modelo del explorador (`PumpFig.frame` → `FPump.update`): el impulsor gira 150 veces más despacio que el real con su diámetro, el líquido lleva el color de las presiones de `innerPressures`, las burbujas salen de NPSHa frente a 1,3 × NPSH3 y NPSH3, y los manómetros marcan las presiones manométricas de las bridas.
- **El alambique de cobre** (como el del laboratorio) es la figura de la pestaña «Alambique» del Explorador de destilación por lotes. Son dos: el alambique simple y, cuando el lote va por la columna (R constante o x_D constante), el mismo calderín con una columna de platos abierta, la cabeza de vidrio con el embudo que reparte el reflujo, el condensador y los mismos recibos. Viven en `scripts/figuras/alambique/` (ver su README), con marcadores `STILL_*`: `node columna.mjs --audit` (15 s) y `node build.mjs --audit` (un minuto; las dos deben terminar en «audit passed», y la columna va primero porque `fig.js` lleva sus datos) y `node splice.mjs`, que copia la columna a `simulaciones/fig/alambique/columna.svg` (la página la pide solo cuando hace falta). Las mueve el modelo del explorador (`SScene.drawFig` → `FStill.update`, y en la columna también `FStill.updateCol`): nivel del visor y de la mirilla, termómetros, densímetro del loro, la llave del corte que toca y lo que lleva cada recipiente; en la columna, el color del líquido de cada plato (el cálculo plato a plato del instante) y el embudo, que pasa 1/(R + 1) de cada ciclo sobre la copa del destilado.
- **Los equipos de molienda** son la vista «Máquina» de la pestaña 1 del Explorador de molienda y tamizado (botones Máquina y Corte; el corte es la sección en canvas de siempre, con sus anotaciones): el molino de bolas con la mitad del tambor que mira al lector quitada entre dos planos (artesa con los levantadores y, al fondo, la sección de la carga), la trituradora de mandíbulas de un solo toggle sin la placa lateral de adelante, el molino de rodillos dobles sin la tapa lateral de la carcasa el de martillos de rotor en voladizo sin la tapa de adelante y el molino de discos de atrición de un solo rotor con la mitad de abajo de la puerta y del disco fijo quitada. Viven en `scripts/figuras/molienda/` (ver su README): `node build.mjs --eq=bolas|mand|rod|mart|disc --audit` (bolas tarda minuto y medio; todas deben terminar en «audit passed») y `node splice.mjs` (marcadores `MLFIG_*`; los SVG van a `simulaciones/fig/molienda/`). Las mueve la misma simulación de partículas del explorador (`MillAnim`), que corre en un lienzo virtual de 900 × 490 px mientras se ve la máquina (`mill.virt`), y `FMill` pone sus partículas en el plano del corte de cada máquina con la escala de `geo.mjs`: el tambor y sus levantadores, la biela con el muñón excéntrico, el toggle y el resorte, los rodillos, el rotor con sus martillos o la cara ranurada del rotor de discos siguen a la simulación. En el molino de bolas la carga tiene bolas de tamaño real (4 a 6 cm, unas 950 en la sección con J = 35 %) y llena la artesa a lo largo de todo el tambor, en capas, además del corte de la descarga. En el molino de discos las partículas no van en el lienzo sino en el SVG, en el lugar del rotor en el orden de pintura (`ds.face`): la puerta y el disco fijo, que van delante, las tapan solas fuera de la mitad abierta. En la pestaña «Granulometría» va la **tamizadora de golpeteo** (vista «Máquina» de la tarjeta Tamizadora; «Esquema» es el lienzo de siempre): tamices de 8″ de media altura sobre el plato portatamices, la barra de sujeción, la torre con el martillo y la caja con el temporizador, con la pila abierta. Hay una figura por número de tamices (`node build.mjs --eq=tamiz --n=3` a `--n=9`, `tamiz-n.svg`); la mueve la muestra de `SieveAnim` (`FSieve` en `tamiz-live.js`): cada partícula cae hasta el tamiz que la retiene, la pila describe su órbita (278 por minuto) y el martillo golpea 150 veces por minuto.

### Skill `design-taste-frontend` (taste skill: dirección de arte de páginas)
Instalado en `.claude/skills/design-taste-frontend/` desde [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT, v2.0.0, commit `f624f37`, oct 2026), sin cambios. Se invoca con `/design-taste-frontend`. Le da dirección de arte a una página pública para que no se vea genérica: `scripts/draw.mjs` reparte direcciones sacadas de un estudio de 247 sitios, `scripts/lint.mjs` revisa el código y `scripts/inspect.mjs` mide la página en Chromium a 1440, 768 y 390 px y guarda capturas, que luego se critican y se corrigen (hasta tres rondas).
- **Dónde sí:** las páginas públicas del portafolio (inicio, investigación, docencia, estudiantes), las landings de los cursos y el rediseño de cualquier página que se vea de plantilla. **Dónde no:** simuladores, Material, visores y demás pantallas de aplicación (el propio skill las excluye), ni lecturas, programas y presentaciones, que siguen sus guías (`LECTURAS-HTML.md`, `PROGRAMA.md`, `PRESENTATIONS.md`, `EDCO-SLIDES.md`).
- **En el portafolio, el skill manda:** cada página debe pasar `inspect.mjs` con 0 FAIL, con la paleta y la letra de la «Línea gráfica del portafolio». Al repartir dirección se pasa `--keep palette,type`, para que el skill proponga solo la composición.
- **En el aula, la identidad de cada curso manda sobre el skill:** colores `brand-*`, íconos SVG Lucide (principio #6), KaTeX, español con tildes y las identidades propias del SPDP y de Narrativas Visuales. Cuando esa identidad exige algo que el skill prohíbe (el número de la tarjeta como marca de agua, una etiqueta en mono, el hover con sombra del principio #8), se conserva, se pasa `--allow <regla>` a `inspect.mjs` (o el comentario `taste-skill-ignore` en la línea para `lint.mjs`) y se dice en el reporte.
- **Nada de CDN:** su biblioteca carga fuentes de Google Fonts y Fontshare y fotos de Lorem Picsum. Aquí no: una fuente nueva se autoaloja con `@fontsource` y las fotos van a `public/images/...` con ruta relativa.
- **Imágenes de archivo:** `scripts/assets.mjs` busca fotos, mapas y grabados con licencia abierta (Openverse, Wikimedia Commons, Art Institute of Chicago, el Met; con `--video`, Internet Archive y NASA). Descargar siempre con `--get <ref> --to public/images/site/` (sin `--to` cae en `assets/` de la raíz, que no se publica) y poner el crédito en la página (`--credits` lo imprime).
- **Archivos de trabajo:** la dirección repartida y las capturas del inspector quedan en `.taste-skill/`, ignorado en git. El historial de direcciones va a `~/.taste-skill/history.json` (se mueve con `TASTE_SKILL_HISTORY`).
- ⚠️ **El inspector no corre en las sesiones en la nube:** ahí el proceso es root y Chromium exige `--no-sandbox`, que el skill no pasa. En el Mac funciona tal cual. En la nube se corren sus mismas mediciones (`lib/probe.mjs`, `frame` y `lib/rules.mjs` → `judge`) dentro de una página de Playwright (el Playwright global ya encuentra Chromium), con el mismo recorrido de capturas a 1440, 768 y 390 px. Los archivos abiertos (Openverse, Wikimedia, el Met) y Typekit están bloqueados en la red de la nube.
- No se instalaron los demás skills del repositorio (`redesign-existing-projects` y los de estilo): piden cambiar la fuente, usar Phosphor en vez de Lucide y rellenar con fotos de Picsum, cosas que chocan con estas reglas. Para rediseñar basta este, con su caso especial «Redesign or review of an existing page».

### Idioma
- **Portafolio principal y Classroom index:** Inglés
- **Contenido de cursos (lecturas, presentaciones, landing):** Español con tildes correctas (á, é, í, ó, ú, ñ, ü)
- **Nunca** publicar texto en español sin acentos
- **El español del sitio trata de usted, nunca de tú** (pedido del profesor, 18 oct 2026): «Escríbame», «consulte», «vea».

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
- ⚠️ **Las caricaturas/ilustraciones IA embebidas en los PDFs NO se usan** en las conversiones (ver Principio #9). Solo se usan las imágenes limpias que el usuario sube aparte y los videos que provee.

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

**⚠️ En React/JSX (lecturas):** Las fórmulas inline con llaves (`$x_{ij}$`, `$\text{sat}$`, etc.) **DEBEN** envolverse en `{String.raw\`$...$\`}` porque JSX interpreta `{` como inicio de expresión. Si no se envuelve, el build de Vite falla con `Syntax error "t"` al encontrar `\text`. Ver [LECTURES.md](LECTURES.md) sección KaTeX.

### #5: Videos YouTube a la derecha
Los videos embebidos van siempre a la **DERECHA** en layout `two-col`, nunca debajo del contenido.

### #6: Nada de emojis como íconos — usar SVG Lucide
Los emojis (💡 🔍 ⚗️ 📍 ✅ etc.) como íconos en presentaciones se renderizan inconsistente entre SO/navegador y se ven de juguete en un entorno académico. **Reemplazar todos por SVG Lucide inline** con `stroke="currentColor"` y `width/height="1em"` para que hereden tamaño y color. Ver [PRESENTATIONS.md](PRESENTATIONS.md) sección "Íconos SVG".

### #7: Siempre que se nombre una plataforma/herramienta, debe ser clickeable
Cuando una presentación o lectura menciona ChatGPT, Claude, Perplexity, BloqueNeón, Amazon, Alkosto, Figma, etc., el nombre debe ser un enlace con `target="_blank" rel="noopener"` y clase `.platform-link` (subrayado amarillo + sufijo `↗`). No dejar nombres sueltos como texto plano.

### #8bis: TOC click-to-filter implica contenido condicional
En lecturas con TOC click-to-filter, el **intro**, la **imagen hero** y los **callouts generales** deben ir dentro de `{activeSection === null && (<>...</>)}` para que aparezcan SOLO en el modo "Ver todo", no en cada sección filtrada. Si van fuera, se repiten en cada click del TOC y se ven como ruido visual. Ver [LECTURES.md](LECTURES.md) sección "contenido compartido".

### #8: HTML no es PowerPoint — aprovechar la interactividad
Las presentaciones HTML deben sentirse **dinámicas**. Patrones mínimos en cada slide deck:
- `stagger-in` con `fadeInUp` animado cuando un slide recibe `.active`
- Hover-lift (`translateY(-3px)` + shadow) en cards
- `:focus-visible` rings amarillos para accesibilidad teclado
- Progress bar pulse al navegar
- `@media (prefers-reduced-motion: reduce)` que deshabilite todo lo anterior
- Stepper o tabs para grids que serían muy largos (6+ cards)
- Row hover highlight en tablas
- `<details>/<summary>` para casos de estudio o contenido extenso
- Comillas tipográficas «...» en citas (no `"..."`)

### #9: Nada de caricaturas de los PDFs fuente
Los PDFs originales de clase suelen traer **ilustraciones tipo caricatura generadas por IA** (equipos dibujados a mano alzada, escenas de laboratorio, etc.). **NUNCA** recortarlas del PDF ni reutilizarlas en las presentaciones/lecturas que construimos. En su lugar:
- Usar las **imágenes limpias que el usuario provee aparte** (ZIP, `~/Desktop`, `~/Downloads`) — fotos reales, esquemas vectoriales, micrografías. Estas sí se usan **tal cual vienen**.
- Cuando el usuario da un **video** de un equipo, el **video es el recurso principal** de esa diapositiva (no una caricatura). Consolidar en una sola diapositiva con el video grande + pestañas/botones (Construcción / Cómo funciona / Ventajas) en vez de repartir caricaturas en varias diapositivas.
- Si no hay imagen limpia ni video para un tema, preferir un **esquema propio (SVG/HTML)** o una diapositiva tipográfica limpia; **jamás** rellenar con la caricatura del PDF.
- Reemplazar contenido obsoleto cuando el usuario lo pida (p. ej. «elimine la filtración centrífuga y ponga la decantadora centrífuga»).
