# Lecturas del Classroom — Guía de creación

> **Leer este documento al crear o editar lecturas (readings) del Classroom.**

## Principios fundamentales

1. **No resumir, no recortar.** Toda la información del material fuente debe estar presente. Si un PDF tiene 27 páginas, la lectura debe contener toda esa información. Es preferible que sea largo y completo a corto y genérico.

2. **Complementar, no reemplazar.** Si hay oportunidad de enriquecer con videos de YouTube, referencias externas o contexto adicional investigado online, hacerlo. Pero siempre preservando el 100% del contenido original.

3. **Formato de guía interactiva, no blog post.** Las lecturas no son artículos de blog. Son guías de referencia que los estudiantes consultarán múltiples veces. Deben tener:
   - Tabla de contenidos sticky (sidebar en desktop, colapsable en mobile) con **click-to-filter** (clicking a TOC item hides all other sections; clicking again or "Ver todo" restores all)
   - Secciones con IDs for the TOC, each wrapped in `{isVisible('id') && (<>...</>)}`
   - Secciones colapsables para contenido extenso (casos prácticos, plantillas, ejemplos detallados)
   - Callouts destacados para ideas clave, advertencias y notas
   - Cards en grids para comparaciones, roles, características
   - Tablas bien formateadas para datos estructurados
   - Videos embebidos cuando sean relevantes

4. **Todo en español con tildes correctas.** á, é, í, ó, ú, ñ, ü. Nunca publicar sin acentos.

5. **Preguntar al usuario si no se encuentra información.** Si al investigar online no se encuentran videos o recursos complementarios adecuados, preguntar antes de inventar.

## Arquitectura de archivos

```
pages/classroom/{courseSlug}/readings/{slug}.tsx    ← Componente de la lectura
pages/classroom/readingsRegistry.ts                ← Registry de lazy imports
components/data/classroom/{course}.ts              ← Metadata (readings array)
```

## Patrón del componente

```tsx
import React, { useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

// TOC data
const tocItems = [
  { id: 'seccion-1', label: 'Nombre sección' },
  // ...
];

// Reusable callout components (definir dentro del archivo)
// All callouts use dark background (brand-dark) with colored titles only
const TipCallout = ({ title = '💡 Idea clave', children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-brand-yellow text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const WarningCallout = ({ title = '⚠️ Importante', children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-red-400 text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const InfoCallout = ({ title = '📌 Nota', children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-emerald-400 text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const NombreLectura: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'mi-slug');
  if (!reading) return null;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [tocOpen, setTocOpen] = useState(false);

  // Section filtering: clicking a TOC item shows only that section
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleTocClick = (id: string) => {
    setActiveSection((prev) => (prev === id ? null : id));
    setTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isVisible = (id: string) => activeSection === null || activeSection === id;

  return (
    <ReadingLayout course={course} reading={reading} wide>
      {/* Mobile TOC toggle */}
      <div className="lg:hidden sticky top-20 z-30 mb-6 not-prose">
        <button
          onClick={() => setTocOpen(!tocOpen)}
          className="w-full flex items-center justify-between py-2.5 px-4 rounded-lg bg-zinc-50 border border-zinc-200 text-sm font-semibold text-brand-dark"
        >
          <span>{activeSection ? tocItems.find(t => t.id === activeSection)?.label ?? 'Contenido' : 'Contenido'}</span>
          <span className="text-brand-gray">{tocOpen ? '−' : '+'}</span>
        </button>
        {tocOpen && (
          <nav className="mt-1 rounded-lg bg-white border border-zinc-200 shadow-lg p-3 space-y-1">
            {activeSection && (
              <button
                onClick={() => { setActiveSection(null); setTocOpen(false); }}
                className="block w-full text-left py-1.5 px-2 text-sm font-semibold text-brand-yellow-dark hover:bg-zinc-50 rounded transition-colors"
              >
                ← Ver todo
              </button>
            )}
            {tocItems.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTocClick(t.id)}
                className={`block w-full text-left py-1 px-2 text-sm rounded transition-colors ${
                  activeSection === t.id
                    ? 'text-brand-dark font-semibold bg-yellow-50'
                    : 'text-brand-gray hover:text-brand-dark hover:bg-zinc-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* Sticky TOC sidebar (desktop) — click-to-filter, not scroll-to-anchor */}
        <nav className="hidden lg:block">
          <div className="sticky top-28 space-y-1 text-sm">
            {activeSection && (
              <button
                onClick={() => setActiveSection(null)}
                className="block w-full text-left py-1.5 mb-2 text-sm font-semibold text-brand-yellow-dark hover:text-brand-dark transition-colors"
              >
                ← Ver todo
              </button>
            )}
            {tocItems.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTocClick(t.id)}
                className={`block w-full text-left py-1 rounded px-2 transition-colors ${
                  activeSection === t.id
                    ? 'text-brand-dark font-semibold bg-yellow-50'
                    : 'text-brand-gray hover:text-brand-dark'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content — each section wrapped in isVisible() */}
        <div className="reading-prose">
          {isVisible('seccion-1') && (<>
            <SectionTitle id="seccion-1">Título de la sección</SectionTitle>
            {/* Section content */}
          </>)}

          {isVisible('seccion-2') && (<>
            <SectionTitle id="seccion-2">Otra sección</SectionTitle>
            {/* Section content */}
          </>)}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default NombreLectura;
```

## Componentes UI disponibles

### ReadingLayout
- Prop `wide` (boolean): expande a `max-w-6xl` y omite el wrapper `.reading-prose` para que el caller controle el layout.
- Siempre usar `wide` para lecturas tipo guía interactiva.
- El wrapper `.reading-prose` se aplica manualmente al `<div>` de contenido principal.

### Cards en grid
```tsx
<div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
  <div className="rounded-xl border border-zinc-200 p-5">
    <h4 className="font-semibold text-brand-dark text-base mb-2">Título</h4>
    <p className="text-sm text-brand-gray leading-relaxed">Descripción</p>
  </div>
</div>
```

### Sección colapsable
```tsx
<div className="my-4 not-prose">
  <button
    onClick={() => toggle('key')}
    className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
  >
    <span className="font-semibold text-brand-dark">Título</span>
    <span className="text-brand-gray text-sm">{openSections['key'] ? '−' : '+'}</span>
  </button>
  {openSections['key'] && (
    <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
      Contenido
    </div>
  )}
</div>
```

### Tabla
```tsx
<div className="overflow-x-auto my-6 not-prose">
  <table className="w-full text-sm border-collapse">
    <thead>
      <tr className="bg-zinc-50 text-left">
        <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Columna</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-zinc-100">
        <td className="px-4 py-2.5 text-brand-gray">Dato</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Video embebido
```tsx
<div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg not-prose">
  <iframe
    className="w-full h-full"
    src="https://www.youtube.com/embed/VIDEO_ID"
    title="Descripción"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
```

## Checklist al crear una lectura

1. [ ] Leer TODO el material fuente (PDF, guía, etc.) completo
2. [ ] Planificar las secciones y tabla de contenidos
3. [ ] Investigar videos de YouTube relevantes para enriquecer
4. [ ] Crear el componente `.tsx` con todo el contenido
5. [ ] Verificar que TODOS los acentos estén correctos
6. [ ] Agregar entrada en `readingsRegistry.ts` (lazy import)
7. [ ] Agregar metadata en el array `readings` del curso en `pou.ts`
8. [ ] Verificar compilación TypeScript: `npx tsc --noEmit`
9. [ ] Verificar visualmente en `http://localhost:3000/classroom/{courseSlug}/readings/{slug}`
10. [ ] Commit y push a la rama de trabajo

## Colores del proyecto (Tailwind)

- `brand-dark`: #1A1A1A (texto principal)
- `brand-yellow`: #FFBF00 (acentos)
- `brand-yellow-dark`: #E6AC00 (acentos hover)
- `brand-gray`: #555555 (texto secundario)

## Notas importantes

- La clase `not-prose` se usa en elementos dentro de `.reading-prose` que NO deben heredar los estilos de prosa (cards, callouts, tablas custom, etc.)
- Framer Motion está disponible pero preferir CSS transitions para elementos interactivos simples
- El proyecto usa React Router — usar `Link` de `react-router-dom` para navegación interna
- Los errores de TypeScript en `components/data/students/**/*.ts` son pre-existentes — ignorar
- Siempre hacer commit y push frecuentes para evitar perder trabajo
