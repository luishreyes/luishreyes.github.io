# PROGRAMA.md — El syllabus HTML del curso (`programa.html`)

> Guía para crear el **programa del curso** (syllabus): un documento HTML autocontenido
> que abre en pestaña nueva y se registra como **guía** en los datos del curso.
> Es el documento "oficial" del curso, distinto de las lecturas/guías de contenido.

## Qué es y dónde vive

- **Ubicación:** `public/classroom/{slug}/programa.html`
- **Se registra** como una `Reading` con `category: 'guia'`, `order: 1` y `href` en el array `readings` del curso (igual que cualquier guía HTML — abre en pestaña nueva, NO es una ruta React).
- **Es autocontenido:** todo el CSS va inline en un `<style>` dentro del `<head>`. No depende de `assets/deloitte.css` (a diferencia de las lecturas/guías). Esto lo hace fácil de copiar entre cursos.

**Plantilla canónica:** `public/classroom/iqya-2031-2026-20/programa.html` (POU, acento verde).
Segundo ejemplo con acento distinto: `public/classroom/iqya-3751-2026-20/programa.html` (Narrativas, acento violeta).

## Cómo crear uno nuevo

1. **Copiar** el `programa.html` de un curso existente como punto de partida.
2. **Cambiar el acento** en el bloque `:root` del `<style>` (ver abajo).
3. **Reemplazar el contenido** de cada sección (header, secciones `#s1…#sN`, footer).
4. **Actualizar el side-nav** para que coincida con las secciones reales (números `01…NN` + anclas `#sN`).
5. **Registrar** el archivo como guía en `components/data/classroom/{slug}.ts`:

```ts
readings: [
  {
    slug: 'programa-del-curso',
    order: 1,
    title: 'Programa del curso',
    summary: 'El programa completo de {CÓDIGO} para {term}: …',
    date: '{fecha de inicio ISO}',
    readingMinutes: 12,
    tags: ['programa', 'syllabus', 'logística'],
    category: 'guia',
    href: '/classroom/{slug}/programa.html',
    bannerImg: '/classroom/{slug}/guias-banners/programa.jpg', // foto B&W de la tarjeta
  },
  // … resto de guías y lecturas
],
```

## Acento de color (por curso)

El programa usa los tokens `--verde / --verde-osc / --verde-claro` de la paleta Deloitte como
acento principal. Para re-tematizar el curso, **sobreescribe esos tres tokens** en `:root` con el
acento del curso (los mismos hex que `.accent-*` en `index.css`). El resto de tokens (grises, papel,
teal para `callout--nota`, ámbar para `callout--etica`) no se tocan.

| `accent` | `--verde` | `--verde-osc` | `--verde-claro` |
|---|---|---|---|
| `green` (POU) | `#86BC24` | `#5E8A12` | `#EAF3DA` |
| `violet` (Narrativas) | `#7C5CFF` | `#5E45D9` | `#EDEAFE` |
| `blue` (Seminario/SPDP) | `#0E7CD8` | `#0A5EA6` | `#E2EFFB` |
| `terracota` (DPRO) | `#E06C2A` | `#B5531C` | `#FBEBDF` |
| `magenta` (Biotec) | `#C03B6E` | `#962C54` | `#F8E4EC` |

```css
:root {
  --verde:        #7C5CFF;   /* acento principal del curso */
  --verde-osc:    #5E45D9;   /* acento oscuro */
  --verde-claro:  #EDEAFE;   /* fondo claro (tip, objetivos, side-nav activo) */
  /* … resto de tokens igual … */
}
```

> El `--verde-claro` es un tinte muy claro del acento. Si no tienes uno a mano, baja la saturación
> y sube la luminosidad del acento principal hasta ~92% de luminosidad.

## Estructura del documento

```
<head>
  <style> … tokens (:root con override de acento) + todos los componentes … </style>
</head>
<body>
  <div class="outer-layout">           ← grid: 200px (side-nav) + contenido
    <nav class="side-nav">             ← sticky; .sn-item por sección, con .sn-num
    <article class="page">
      <header class="doc-head">        ← org · badge · h1 · subtitle · doc-meta (4 columnas)
      <div class="doc-body">
        <section id="s1">…<section id="sN">   ← cada una con .eyebrow + h2.sec + contenido
        <footer class="doc-foot">
  </div>
  <script> … scroll-spy del side-nav … </script>
```

### Secciones canónicas (orden sugerido)

Las **requeridas** son la columna vertebral de cualquier syllabus; las **opcionales** dependen del curso
(p. ej. un curso con proyecto-reto añade una sección de proyecto; un curso ABET añade resultados ABET).

| # | Sección | Estado | Componente típico |
|---|---|---|---|
| 1 | Horarios y equipo | requerida | `.twocol` con dos `.infobox` |
| 2 | Descripción del curso | requerida | `.lead` + párrafos + `callout--nota` |
| 3 | Objetivos | requerida | `ul.objectives` |
| 4 | Metodología | requerida | párrafos + `.qcards` + `callout--tip` |
| — | El reto / proyecto del semestre | opcional | `.steps` / `.stepc` (solo cursos con proyecto) |
| 5 | Resultados de aprendizaje (Bloom o ABET) | requerida | `table.tbl` o `.qcards` |
| 6 | Contenido programático (módulos) | requerida | `.qcards` (uno por módulo) |
| 7 | Programa por sesiones | recomendada | `table.tbl` (con `tr.receso` para semanas sin clase) |
| 8 | Evaluación / distribución de la nota | requerida | `.gradelist` + `table.rubrica` |
| 9 | Calendario y fechas clave | opcional | `table.rubrica` + `callout--nota` |
| 10 | Coevaluación y autoevaluación | opcional | párrafos + `callout--etica` |
| 11 | Escala AIAS de uso de IA | requerida | `table.tbl` + `callout--tip` + `callout--nota` |
| 12 | Ética / política del curso | requerida | `ul.body-list` + callouts |
| 13 | Prerrequisitos | opcional | párrafo |
| 14 | Bibliografía | opcional | `.refs` |
| 15 | Mensaje a la comunidad | requerida | párrafos (boilerplate Uniandes: MAAD, diversidad, ajustes) |

### Componentes disponibles (clases CSS)

- **Texto:** `.lead`, `.eyebrow` (+`::before` barra de acento), `h2.sec`, `h3.sub`.
- **Listas:** `ul.objectives` (check en círculo), `ul.body-list` (viñeta de acento).
- **Tarjetas:** `.qcards` → `.qcard` (con `.qn` etiqueta + `b` título + `span` texto).
- **Tablas:** `table.tbl` (genérica, con `.cod`, `.fecha`, `.nivel`, `.peso`, `.ent`, `tr.receso`) y `table.rubrica` (evaluación).
- **Barras de nota:** `.gradelist` → `.gradeitem` (`.glabel` + `.gbar > i[style=width]` + `.gpct`).
- **Cajas:** `.twocol` + `.infobox`; pasos `.steps` → `.stepc` (`.pnum` + `.ptext` + `.ptime`).
- **Callouts:** `.callout--tip` (acento), `.callout--nota` (teal/info), `.callout--etica` (ámbar/atención).
- **Enlaces de plataforma:** `a.pl` (subrayado de acento + sufijo ↗) — principio #7, toda herramienta nombrada es clickeable.
- **Bibliografía:** `.refs` (sangría francesa).

## Reglas

- **Idioma:** español con tildes correctas (á é í ó ú ñ ü). Comillas tipográficas «...».
- **Sin emojis como íconos** (principio #6). Los íconos de callout son caracteres simples (`i`, `!`, `★`) dentro de `.ic`, o SVG Lucide inline.
- **Toda plataforma/herramienta nombrada es un enlace** `a.pl` con `target="_blank" rel="noopener"` (principio #7).
- **No resumir, no recortar** (principio #1): si el syllabus fuente tiene mucho contenido, divídelo en más secciones, no lo elimines.
- **Side-nav y secciones deben coincidir:** cada `#sN` del cuerpo tiene su `.sn-item` con la misma ancla y número.
- El scroll-spy ignora `#s0`; si usas una sección de intro sin número, dale `id="s0"`.
