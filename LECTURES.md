# Material del curso — Guía de creación de lecturas y guías

> **Leer este documento al crear o editar readings del Classroom (lecturas de clase o guías de proceso).**

## Terminología

En la UI pública aparecen como **"Material del curso"**, separado en dos secciones:

| Categoría | `category` | Para qué | Ejemplos |
|---|---|---|---|
| **Guías del curso** | `'guia'` | Metodología y proceso para entregables (transversales al semestre) | Trabajo en equipo, bitácoras, informe final, propuesta de valor, flujogramas, búsqueda bibliográfica |
| **Lecturas de clase** | `'lectura'` | Contenido que acompaña cada sesión presencial — de aquí salen los quices | Operaciones unitarias, propiedades de sólidos, reducción de tamaño, transporte de líquidos |

**El campo `category` es requerido** en readings nuevos. Si se omite se asume `'guia'`, pero es mejor explícito.

En el código los datos siguen llamándose `readings` y las URLs siguen siendo `/classroom/{slug}/readings/{slug}` por compatibilidad.

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
   - **Elementos interactivos** donde aporten: pestañas para comparar ejemplos, stepper para procesos paso a paso, reveal colapsable para propuestas finales o casos de estudio, exploradores visuales con hover/click para diagramas de referencia

4. **Todo en español con tildes correctas.** á, é, í, ó, ú, ñ, ü. Nunca publicar sin acentos.

5. **Preguntar al usuario si no se encuentra información.** Si al investigar online no se encuentran videos o recursos complementarios adecuados, preguntar antes de inventar.

6. **Limpiar referencias al podcast.** Si el material fuente viene del podcast "Gradiente de Ideas", **remover** todas las menciones al podcast, los enlaces de Spotify y las referencias por nombre a los entrevistados. Cada lectura debe ser independiente y no depender del podcast para tener sentido.

## Arquitectura de archivos

```
pages/classroom/{courseSlug}/readings/{slug}.tsx    ← Componente de la lectura
pages/classroom/readingsRegistry.ts                 ← Registry de lazy imports (key agrupada por courseSlug)
components/data/classroom/{course}.ts               ← Metadata (readings array con category)
public/classroom/{courseSlug}/readings/             ← Imágenes/figuras de lecturas (si las hay)
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

### Figure con caption (para imágenes del material fuente)

```tsx
<figure className="my-8 not-prose">
  <div className="flex justify-center rounded-xl bg-zinc-50 border border-zinc-200 p-6">
    <img
      src="/classroom/{courseSlug}/readings/nombre.jpeg"
      alt="Descripción accesible de la figura"
      className="max-h-[60vh] w-auto rounded-md shadow-md"
    />
  </div>
  <figcaption className="text-center text-sm text-brand-gray mt-3 italic">
    Figura N. Descripción de la figura.
  </figcaption>
</figure>
```

Imágenes a servir desde `public/classroom/{courseSlug}/readings/{nombre}`. Path absoluto en `src`. Para retratos históricos o fotos documentales, considerar `style={{ filter: 'grayscale(0.25)' }}` para darle tono documental.

### Pestañas (tabs) — para comparar opciones/ejemplos

```tsx
const [active, setActive] = useState<1 | 2>(1);

<div role="tablist" className="flex gap-2 border-b border-zinc-200 my-6 not-prose">
  <button role="tab" aria-selected={active === 1} onClick={() => setActive(1)}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
      active === 1 ? 'text-brand-dark border-brand-yellow' : 'text-brand-gray border-transparent hover:text-brand-dark'
    }`}>
    Opción 1
  </button>
  <button role="tab" aria-selected={active === 2} onClick={() => setActive(2)} /* ... */>
    Opción 2
  </button>
</div>

{active === 1 && (<div>Contenido 1</div>)}
{active === 2 && (<div>Contenido 2</div>)}
```

### Stepper (pasos con pestañas numeradas)

```tsx
const [step, setStep] = useState(1);
const pasos = [/* {titulo, descripcion, preguntas} */];

<div role="tablist" className="flex gap-1 my-6 not-prose flex-wrap">
  {pasos.map((_, i) => (
    <button key={i} role="tab" aria-selected={step === i + 1} onClick={() => setStep(i + 1)}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
        step === i + 1 ? 'bg-brand-dark text-white' : 'bg-zinc-100 text-brand-gray hover:bg-zinc-200'
      }`}>
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
        step === i + 1 ? 'bg-brand-yellow text-brand-dark' : 'bg-white text-brand-dark'
      }`}>{i + 1}</span>
      {pasos[i].titulo}
    </button>
  ))}
</div>

<div className="rounded-xl border-l-4 border-brand-yellow bg-white shadow-sm p-6 not-prose">
  <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow-dark mb-2">Paso {step} de {pasos.length}</p>
  <h3 className="text-xl font-bold text-brand-dark mb-3">{pasos[step - 1].titulo}</h3>
  <p className="text-brand-gray">{pasos[step - 1].descripcion}</p>
</div>
```

### Reveal colapsable (para propuestas finales, casos de estudio, detalles opcionales)

```tsx
const [reveal, setReveal] = useState(false);

<div className="my-6 not-prose">
  <button
    onClick={() => setReveal(!reveal)}
    className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-brand-dark text-white hover:bg-zinc-800 transition-colors text-left"
  >
    <span className="font-semibold">{reveal ? 'Ocultar' : 'Ver'} propuesta final</span>
    <span className="text-brand-yellow">{reveal ? '−' : '+'}</span>
  </button>
  {reveal && (
    <blockquote className="mt-3 rounded-xl bg-yellow-50 border-l-4 border-brand-yellow-dark p-5 sm:p-6 text-brand-dark">
      Contenido revelado.
    </blockquote>
  )}
</div>
```

### Enlaces a plataformas (con ↗)

```tsx
<a
  href="https://bloqueneon.uniandes.edu.co"
  target="_blank"
  rel="noopener noreferrer"
  className="underline decoration-brand-yellow decoration-2 underline-offset-2 hover:text-brand-yellow-dark"
>
  BloqueNeón
</a>
```

## Fórmulas matemáticas con KaTeX (React/JSX)

**Cuando la lectura tiene fórmulas matemáticas**, añadir el hook `useKatex` que inyecta el CDN dinámicamente y renderiza `$...$` / `$$...$$` en el primer mount:

```tsx
const useKatex = () => {
  useEffect(() => {
    const renderAll = () => {
      // @ts-expect-error — KaTeX se carga dinámicamente vía CDN
      const rme = window.renderMathInElement;
      if (!rme) return;
      const target = document.querySelector('.reading-prose') ?? document.body;
      rme(target, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
        throwOnError: false,
      });
    };

    // @ts-expect-error
    if (window.renderMathInElement) { renderAll(); return; }

    if (!document.querySelector('link[data-katex]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css';
      link.setAttribute('data-katex', '1');
      document.head.appendChild(link);
    }
    const s1 = document.createElement('script');
    s1.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js';
    s1.setAttribute('data-katex', '1');
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js';
      s2.setAttribute('data-katex', '1');
      s2.onload = () => renderAll();
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }, []);
};

// Dentro del componente: useKatex();
```

### ⚠️ TRAMPA DE JSX con fórmulas que tienen llaves

JSX interpreta `{` como inicio de expresión JavaScript. Cualquier fórmula inline con llaves como `$m_{\text{pic}+p}$`, `$\rho_\text{sat}$`, `$x_{ij}$`, `$\frac{a}{b}$` **hace fallar el build de Vite** con `Syntax error "t"` si se escribe como texto JSX crudo.

**Regla**: toda fórmula inline que contenga `{` debe envolverse en `{String.raw\`$...$\`}`:

```tsx
// ❌ MAL — JSX intenta evaluar {\text{pic}+p} como JavaScript
<p>La masa es $m_{\text{pic}+p}$ gramos.</p>

// ✅ BIEN — String.raw preserva los backslashes y escapa las llaves del parser JSX
<p>La masa es {String.raw`$m_{\text{pic}+p}$`} gramos.</p>

// Display math también puede escribirse así o con notación `{'$$...$$'}`:
<p>{String.raw`$$E = W_i \left[\dfrac{10}{\sqrt{P_{80}}} - \dfrac{10}{\sqrt{F_{80}}}\right]$$`}</p>
```

**Las fórmulas sin llaves (`$\rho$`, `$\alpha > 1$`, `$z = 0$`) funcionan sin envolver** — no hace falta `String.raw` cuando no hay `{`.

**Validación rápida antes de commitear**:
```bash
# 1. Fórmulas inline con llaves sin envolver (falla el build de Vite/esbuild)
grep -nE '\$[^$]*\{[^$]*\$' pages/classroom/{slug}/readings/mi-lectura.tsx | grep -v 'String.raw\|"$$\|\x27$$'

# 2. CRÍTICO: patrones \text{X} bare en JSX text body — compilan OK pero
#    fallan en RUNTIME con "X is not defined" porque JSX trata {X} como variable.
#    Ejemplo real capturado: `$\varepsilon_\text{lecho}$` en JSX → "lecho is not defined"
python3 -c "
import re
with open('pages/classroom/{slug}/readings/mi-lectura.tsx') as f:
    for i, l in enumerate(f, 1):
        if '\\\\\\text{' in l: continue  # string literal con \\text — safe
        if 'String.raw' in l: continue    # envuelto — safe
        s = l.strip()
        if s.startswith('{\\'') or s.startswith('{\"'): continue  # JS expression string
        if '\\text{' in l: print(f'{i}: {l.rstrip()[:150]}')
"

# Si el segundo check encuentra algo, envolver con {String.raw\`...\`}
```

**Runtime verification con Puppeteer** (opcional, para casos complejos):
```bash
npx vite build && npx vite preview --port 4173 &
sleep 4
node -e "
const pup = require('puppeteer-core');
(async () => {
  const b = await pup.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const p = await b.newPage();
  p.on('pageerror', e => console.error('RUNTIME:', e.message));
  await p.evaluateOnNewDocument(() => localStorage.setItem('classroom:unlock:{slug}', 'true'));
  await p.goto('http://localhost:4173/classroom/{slug}/readings/mi-lectura', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  const len = await p.evaluate(() => document.querySelector('#root').innerHTML.length);
  console.log('DOM length:', len, '(should be > 50000 for a full reading)');
  await b.close();
})();
"
```

Un script para hacerlo automático está en `/tmp/scripts/wrap-katex.py` (se puede regenerar):

```python
import re
pattern = re.compile(r'(?<!\$)\$(?!\$)([^$\n]*?\{[^$\n]*?)\$(?!\$)')
# reemplaza con: f'{{String.raw`${content}$`}}'
# NOTA: no aplicar dentro de template literals `src={\`...${id}...\`}` — puede romper URLs
```

## Regla crítica: contenido compartido debe ir dentro de `activeSection === null`

**Error común**: poner el párrafo introductorio, la imagen hero o el callout de aplicación del curso **antes** del primer `{isVisible(...)}` block. Eso los hace aparecer SIEMPRE, incluso cuando el usuario filtra con el TOC a una sola sección — se repiten en cada click como ruido visual.

**Regla**: cualquier contenido que deba aparecer **solamente en el modo "Ver todo"** debe envolverse en `{activeSection === null && (...)}`:

```tsx
<div className="reading-prose">
  {/* Intro, hero image, callout de aplicación del proyecto → solo en Ver todo */}
  {activeSection === null && (
    <>
      <p className="text-lg leading-relaxed text-brand-gray">
        Esta lectura acompaña la sesión sobre ...
      </p>
      <Figure src="..." alt="..." caption="..." />
      <InfoCallout title="📌 Aplicación al proyecto del curso">
        ...
      </InfoCallout>
    </>
  )}

  {/* Secciones normales */}
  {isVisible('seccion-1') && (<>...</>)}
  {isVisible('seccion-2') && (<>...</>)}
</div>
```

Si el contenido debería repetirse cuando se filtra a una sección específica, entonces sí va fuera — pero esos casos son raros. En la práctica: intro + hero + callouts de "aplicación al proyecto" / "advertencia general" van dentro del bloque `activeSection === null`.

## Callouts — fix del color de `<strong>` / `<em>` / `<a>` dentro de `.not-prose`

Los callouts tienen fondo oscuro (`bg-brand-dark`) con texto claro (`text-zinc-300`). El problema: `.reading-prose strong { color: #1A1A1A }` en `index.css` cascadea dentro y hace el **negrita invisible** sobre el fondo oscuro.

**Fix ya aplicado en `index.css`** (NO remover):
```css
.reading-prose .not-prose strong,
.reading-prose .not-prose em,
.reading-prose .not-prose a,
.reading-prose .not-prose code,
.reading-prose .not-prose blockquote { color: inherit; }
```

Esto hace que `<strong>` dentro de un callout (`not-prose`) herede el color claro del contenedor en vez del negro forzado de prosa.

## Fetch de contenido desde Notion (si la fuente es una página pública)

Para migrar una lectura desde una página pública de Notion (`pou-uniandes.notion.site`):

1. Extraer el `pageId` del HTML:
   ```bash
   curl -sL "https://pou-uniandes.notion.site/Nombre-de-la-pagina-HASH" | grep -oE '"pageId":"[a-f0-9-]+"' | head -1
   ```

2. Descargar el contenido con la API pública `loadPageChunk` (no requiere auth para páginas publicadas):
   ```bash
   curl -sL -X POST "https://pou-uniandes.notion.site/api/v3/loadPageChunk" \
     -H "Content-Type: application/json" \
     -H "User-Agent: Mozilla/5.0" \
     -d '{"pageId":"PAGEID","limit":500,"cursor":{"stack":[]},"chunkNumber":0,"verticalColumns":false}' \
     > /tmp/notion_pageN.json
   ```

3. Si el cursor devuelve `stack` no vacío, pedir los siguientes chunks hasta agotar.

4. Parsear con Python: recorrer `recordMap.block`, seguir `content: [...]` recursivamente para preservar orden y jerarquía.

5. Para imágenes: construir URL con
   ```
   https://pou-uniandes.notion.site/image/{url-encode(attachment:FILE_ID:image.ext)}?table=block&id=BLOCK_ID&cache=v2
   ```
   donde `FILE_ID` viene de `v.file_ids[0]` y `BLOCK_ID` es el block id del `<img>`. Verificar que el response no sea JSON de error antes de guardar.

## Checklist al crear una lectura

1. [ ] Leer TODO el material fuente (PDF, página Notion, etc.) completo
2. [ ] Si viene del podcast: remover todas las menciones a "Gradiente de Ideas", Spotify y nombres de entrevistados
3. [ ] Decidir `category`: `'guia'` (proceso/metodología) o `'lectura'` (contenido de clase)
4. [ ] Planificar las secciones y tabla de contenidos (TOC click-to-filter)
5. [ ] Descargar las imágenes del material fuente a `public/classroom/{courseSlug}/readings/` con nombres semánticos
6. [ ] Investigar videos de YouTube relevantes para enriquecer
7. [ ] Crear el componente `.tsx` con todo el contenido — callouts, cards, tablas, figuras con figcaption
8. [ ] Si hay fórmulas: añadir hook `useKatex` y **envolver fórmulas con llaves en `{String.raw\`$...$\`}`**
9. [ ] Añadir elementos interactivos donde aporten: pestañas (ejemplos), stepper (procesos), reveal (casos), explorador visual (símbolos/diagramas)
10. [ ] Enlaces clickeables a plataformas nombradas (BloqueNeón, ChatGPT, etc.) con `target="_blank"`
11. [ ] Verificar que TODOS los acentos estén correctos
12. [ ] Agregar entrada en `readingsRegistry.ts` bajo el bloque del curso correspondiente
13. [ ] Agregar metadata en el array `readings` del curso en `{course}.ts` (incluyendo `category`)
14. [ ] Verificar sintaxis: `npx esbuild --loader:.tsx=tsx pages/classroom/{slug}/readings/{nombre}.tsx > /dev/null`
15. [ ] Para fórmulas KaTeX con llaves: confirmar que `grep -nE '\$[^$]*\{[^$]*\$' pages/...` no retorna patrones sin envolver
16. [ ] Commit y push — el deploy a GitHub Pages se dispara solo (~1-2 min)
17. [ ] Si Actions falla con `Syntax error`, revisar fórmulas KaTeX inline con llaves y envolver con `String.raw`

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
