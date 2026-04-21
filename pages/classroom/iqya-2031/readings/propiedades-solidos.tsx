import React, { useEffect, useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── Hook: KaTeX via CDN (se carga una vez y renderiza fórmulas $...$ y $$...$$) ─── */
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
    if (window.renderMathInElement) {
      renderAll();
      return;
    }

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

/* ─── TOC ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'densidad', label: 'Densidad de partícula' },
  { id: 'porosidad', label: 'Porosidad' },
  { id: 'tamano', label: 'Tamaño y distribución' },
  { id: 'forma', label: 'Forma de la partícula' },
  { id: 'flujo', label: 'Propiedades de flujo' },
  { id: 'otras', label: 'Otras propiedades' },
  { id: 'impacto', label: 'Impacto en operaciones' },
  { id: 'consejos', label: 'Consejos prácticos' },
  { id: 'bibliografia', label: 'Bibliografía' },
];

/* ─── Callouts reutilizables ─── */
const TipCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = '💡 Idea clave',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-brand-yellow text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const InfoCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = '📌 Nota',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-emerald-400 text-sm mb-2">{title}</p>
    <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
  </div>
);

const SectionTitle: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2 id={id} className="text-2xl font-bold text-brand-dark mt-14 mb-4 scroll-mt-32">
    {children}
  </h2>
);

const SubTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold text-brand-dark mt-8 mb-3">{children}</h3>
);

/* ─── Video embebido ─── */
const VideoEmbed: React.FC<{ id: string; title: string; start?: number }> = ({
  id,
  title,
  start,
}) => (
  <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg not-prose">
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${id}?rel=0${start ? `&start=${start}` : ''}`}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

/* ─── Figura con caption ─── */
const Figure: React.FC<{ src: string; alt: string; caption?: string; maxWidth?: string }> = ({
  src,
  alt,
  caption,
  maxWidth = '640px',
}) => (
  <figure className="my-8 not-prose">
    <img
      src={src}
      alt={alt}
      className="rounded-xl shadow-lg mx-auto"
      style={{ maxWidth }}
    />
    {caption && (
      <figcaption className="text-center text-sm text-brand-gray mt-3">{caption}</figcaption>
    )}
  </figure>
);

/* ─── Componente principal ─── */
const PropiedadesSolidos: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'propiedades-solidos');
  if (!reading) return null;

  useKatex();

  const [tocOpen, setTocOpen] = useState(false);
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
          <span>
            {activeSection
              ? tocItems.find((t) => t.id === activeSection)?.label ?? 'Contenido'
              : 'Contenido'}
          </span>
          <span className="text-brand-gray">{tocOpen ? '−' : '+'}</span>
        </button>
        {tocOpen && (
          <nav className="mt-1 rounded-lg bg-white border border-zinc-200 shadow-lg p-3 space-y-1">
            {activeSection && (
              <button
                onClick={() => {
                  setActiveSection(null);
                  setTocOpen(false);
                }}
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
        {/* Sticky TOC sidebar */}
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

        {/* Contenido principal */}
        <div className="reading-prose">
          <p className="text-lg leading-relaxed text-brand-gray">
            Esta lectura acompaña la sesión sobre <strong>propiedades de los sólidos
            particulados</strong>: densidad, porosidad, tamaño y su distribución, forma,
            propiedades de flujo y otras características que determinan el comportamiento
            de los polvos durante su almacenamiento, transporte, mezclado y procesamiento
            industrial — especialmente en la industria de alimentos.
          </p>

          <InfoCallout title="📌 Aplicación al Proyecto del Curso">
            Al seleccionar un proceso que involucre sólidos, deberán investigar y reportar
            las propiedades relevantes de estos materiales. Estos datos serán fundamentales
            para el diseño y selección de equipos como <strong>silos, alimentadores,
            mezcladores, molinos o sistemas de transporte</strong> en las etapas posteriores
            del proyecto.
          </InfoCallout>

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">Introducción</SectionTitle>
              <p>
                Comprender las características de los sólidos particulados es fundamental
                para diseñar y operar equipos en numerosas industrias, especialmente en el
                procesamiento de alimentos. Estas propiedades determinan el comportamiento
                de los sólidos durante su <strong>almacenamiento, transporte, mezclado y
                procesamiento</strong>.
              </p>
              <p>
                A diferencia de los fluidos — que quedan bien descritos por densidad y
                viscosidad — un sólido particulado requiere caracterizarse mediante un
                conjunto más amplio de propiedades: varios tipos de densidad, porosidad a
                distintas escalas, tamaño (nunca único, sino una distribución), forma,
                resistencia mecánica, humedad y capacidad de fluir bajo su propio peso. En
                esta lectura revisaremos cada una de ellas.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-01.png"
                alt="Sólidos particulados"
                caption="Los sólidos particulados son mezclas complejas de partículas, huecos y — en muchos casos — humedad: su caracterización combina varias propiedades independientes."
              />
            </>
          )}

          {isVisible('densidad') && (
            <>
              <SectionTitle id="densidad">Densidad de partícula</SectionTitle>
              <p>
                La densidad es una característica esencial, pero no es una sola magnitud:
                según qué volumen consideremos (con o sin poros, con o sin huecos
                interparticulares), se distinguen varios tipos. Confundirlos es una fuente
                clásica de error en el diseño de equipos.
              </p>

              <SubTitle>Tipos de densidad</SubTitle>
              <ul>
                <li>
                  <strong>Densidad verdadera ({String.raw`$\rho_\text{verdadera}$`}):</strong> la densidad
                  del material en sí, excluyendo todos los poros (tanto abiertos como
                  cerrados).
                </li>
                <li>
                  <strong>Densidad aparente o de partícula ({String.raw`$\rho_\text{aparente}$`}):</strong>
                  la densidad de una partícula, incluyendo su porosidad interna (poros
                  cerrados), pero excluyendo los vacíos interparticulares. Se calcula como
                  la masa de una partícula dividida por su volumen total (sólido + poros
                  cerrados).
                </li>
                <li>
                  <strong>Densidad masal o densidad aparente del lecho
                  ({String.raw`$\rho_\text{masal}$`}):</strong> la masa de una cantidad de polvo dividida
                  por el volumen total que ocupa (incluyendo los vacíos interparticulares).
                  Este parámetro es crucial para dimensionar recipientes de almacenamiento
                  (silos, tolvas) y empaques.
                  <ul>
                    <li>
                      Varía según el empaquetamiento de las partículas. Se distingue entre
                      <strong> densidad masal suelta</strong> (vertida) y
                      <strong> densidad masal compactada</strong> (después de la compactación
                      por golpeteo).
                    </li>
                  </ul>
                </li>
                <li>
                  <strong>Densidad efectiva de partícula:</strong> incluye tanto poros
                  abiertos como cerrados; relevante para interacciones con fluidos.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-02.png"
                alt="Comparación de los tipos de densidad"
                caption="Densidad verdadera, de partícula y masal: cada una corresponde a un volumen distinto — sólido puro, sólido + poros cerrados, y lecho completo con huecos interparticulares."
              />

              <SubTitle>Determinación experimental: picnometría</SubTitle>
              <p>
                La <strong>picnometría</strong> es una técnica precisa para determinar la
                densidad de partículas. Se basa en medir el volumen de un fluido (líquido o
                gas, como aire o helio) desplazado por el sólido en un recipiente de volumen
                conocido (picnómetro).
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-03.png"
                alt="Picnómetro de líquido"
                caption="Picnómetro de líquido: recipiente de volumen calibrado empleado para medir densidad de partícula por desplazamiento."
              />

              <p>
                <strong>Procedimiento general con picnómetro de líquido (ej. agua):</strong>
              </p>
              <ol>
                <li>Se pesa el picnómetro vacío y seco ({String.raw`$m_\text{pic}$`}).</li>
                <li>
                  Se añade una cantidad conocida de polvo al picnómetro y se pesa el
                  conjunto ({String.raw`$m_{\text{pic}+p}$`}). La masa del polvo es
                  {String.raw`$m_p = m_{\text{pic}+p} - m_\text{pic}$`}.
                </li>
                <li>
                  Se llena el picnómetro (con el polvo) con un líquido de densidad conocida
                  ({String.raw`$\rho_\text{liq}$`}), eliminando burbujas de aire para que el líquido ocupe
                  todos los vacíos accesibles. Se pesa el conjunto
                  ({String.raw`$m_{\text{pic}+p+\text{liq}}$`}).
                </li>
                <li>
                  Se llena el picnómetro <em>solo con líquido</em> hasta la marca de
                  calibración y se pesa ({String.raw`$m_{\text{pic}+\text{liq}}$`}). La masa del líquido es
                  {String.raw`$m_\text{liq} = m_{\text{pic}+\text{liq}} - m_\text{pic}$`}. El volumen del
                  picnómetro es {String.raw`$V_\text{pic} = m_\text{liq}/\rho_\text{liq}$`}.
                </li>
                <li>
                  La masa del líquido que ocupa los espacios restantes con el polvo es
                  {String.raw`$m'_\text{liq} = m_{\text{pic}+p+\text{liq}} - m_{\text{pic}+p}$`}.
                </li>
                <li>
                  El volumen ocupado por el líquido con el polvo es
                  {String.raw`$V'_\text{liq} = m'_\text{liq}/\rho_\text{liq}$`}.
                </li>
                <li>
                  El volumen de las partículas de polvo (excluyendo poros abiertos
                  accesibles al líquido) es {String.raw`$V_p = V_\text{pic} - V'_\text{liq}$`}.
                </li>
                <li>
                  La densidad de partícula es
                  {' '}
                  {'$$\\rho_\\text{aparente} = \\frac{m_p}{V_p} = \\frac{m_p}{V_\\text{pic} - V\'_\\text{liq}}$$'}
                </li>
              </ol>

              <VideoEmbed id="Gw3tvSC6gZ8" title="Demostración de picnómetro de líquido" start={6} />
            </>
          )}

          {isVisible('porosidad') && (
            <>
              <SectionTitle id="porosidad">Porosidad ($\varepsilon$)</SectionTitle>
              <p>
                La <strong>porosidad</strong> ($\varepsilon$) es la fracción del volumen
                total de un lecho de partículas (o de una partícula) que corresponde a
                espacio vacío. Al igual que la densidad, puede definirse a distintas escalas:
              </p>

              <SubTitle>Porosidad del lecho (interparticular)</SubTitle>
              <p>
                Corresponde al volumen de huecos <em>entre</em> partículas dentro del lecho:
              </p>
              <p>
                {'$$\\varepsilon_\\text{lecho} = 1 - \\frac{\\rho_\\text{masal}}{\\rho_\\text{aparente}}$$'}
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-04.jpeg"
                alt="Porosidad del lecho"
                caption="Porosidad interparticular: los huecos visibles entre partículas dentro del lecho — función directa del empaquetamiento."
              />

              <SubTitle>Porosidad de la partícula (intraparticular)</SubTitle>
              <p>
                Corresponde a los poros <em>internos</em> de cada partícula (si
                {String.raw`$\rho_\text{aparente}$`} considera solo poros cerrados y
                {String.raw`$\rho_\text{verdadera}$`} es la densidad verdadera):
              </p>
              <p>
                {'$$\\varepsilon_\\text{partícula} = 1 - \\frac{\\rho_\\text{aparente}}{\\rho_\\text{verdadera}}$$'}
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-05.png"
                alt="Porosidad intraparticular"
                caption="Porosidad intraparticular: poros cerrados o abiertos dentro del grano. Invisible desde el exterior, pero afecta densidad efectiva y cinética de secado o extracción."
              />
            </>
          )}

          {isVisible('tamano') && (
            <>
              <SectionTitle id="tamano">Tamaño y distribución de tamaño de partícula</SectionTitle>
              <p>
                El tamaño de las partículas y el rango de tamaños presentes impactan
                significativamente la <strong>fluidez, el mezclado, las tasas de disolución
                y la generación de polvo</strong>.
              </p>

              <SubTitle>Diámetros equivalentes</SubTitle>
              <p>
                Para partículas irregulares, se usa un <strong>"diámetro equivalente"</strong>.
                Este puede basarse en:
              </p>
              <ul>
                <li>
                  <strong>Diámetro equivalente por volumen ($d_v$):</strong> diámetro de
                  una esfera con el mismo volumen que la partícula.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-06.jpeg"
                alt="Diámetro equivalente por volumen"
                caption="Diámetro equivalente por volumen ($d_v$): diámetro de la esfera con el mismo volumen que la partícula real."
              />

              <ul>
                <li>
                  <strong>Diámetro equivalente por superficie ($d_s$):</strong> diámetro
                  de una esfera con la misma área superficial.
                </li>
                <li>
                  <strong>Diámetro de tamiz ($d_t$):</strong> determinado por la apertura
                  cuadrada más pequeña a través de la cual pasará la partícula. Es el
                  <em> más común en la industria</em> para caracterización general.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-07.png"
                alt="Diámetro de tamiz"
                caption="Diámetro de tamiz ($d_t$): dimensión funcional de la partícula respecto al tamaño de apertura de malla cuadrada."
              />

              <ul>
                <li>
                  <strong>Diámetro de Stokes ({String.raw`$d_{\text{Stokes}}$`}, o diámetro de caída
                  libre):</strong> diámetro de una esfera con la misma velocidad terminal
                  que la partícula en un fluido dado. Relevante para procesos de
                  <strong> sedimentación o transporte neumático</strong>.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-08.png"
                alt="Diámetro de Stokes"
                caption="Diámetro de Stokes: la esfera hipotética que sedimenta a la misma velocidad que la partícula real en un fluido dado."
              />

              <SubTitle>Distribución de tamaño de partícula (DTP)</SubTitle>
              <p>
                La mayoría de los polvos consisten en partículas de varios tamaños. La
                <strong> DTP</strong> se determina comúnmente mediante:
              </p>

              <p>
                <strong>Análisis por tamizado:</strong> se utiliza una pila de tamices con
                aperturas de malla decrecientes (ej. series estándar como
                <strong> Tyler o BS</strong>, donde un número de malla mayor implica una
                apertura más pequeña). Se pesa la cantidad de material retenido en cada
                tamiz. Los resultados se suelen graficar como porcentaje en peso acumulado
                que pasa (o es retenido) versus el tamaño de apertura del tamiz.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-09.png"
                alt="Análisis por tamizado"
                caption="Análisis por tamizado: pila de tamices con aperturas decrecientes. Es el método más común y económico para caracterizar DTP en la industria."
              />

              <p>
                <strong>Microscopía:</strong> permite la observación y medición directa
                de dimensiones individuales, útil también para la forma.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-10.gif"
                alt="Microscopía de partículas"
                caption="Microscopía: observación directa de morfología y dimensiones. Permite caracterizar simultáneamente tamaño y forma."
              />

              <p>
                <strong>Métodos de sedimentación:</strong> basados en la <strong>Ley de
                Stokes</strong>, relacionan la velocidad de sedimentación con el tamaño
                de partícula.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-11.png"
                alt="Método de sedimentación"
                caption="Sedimentación: el tamaño se deduce de la velocidad terminal de caída libre mediante la Ley de Stokes."
              />

              <p>
                <strong>Difracción láser:</strong> técnica moderna para análisis rápido y
                automatizado, cubriendo un amplio rango de tamaños (ej., 0.1–3000 μm). Mide
                el patrón de luz dispersada por las partículas.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-12.png"
                alt="Difracción láser"
                caption="Difracción láser: el patrón de dispersión de la luz incidente se inversiona para obtener la DTP completa en segundos."
              />

              <p>
                <strong>Contador Coulter:</strong> mide cambios en la resistencia eléctrica
                cuando las partículas suspendidas en un electrolito pasan a través de un
                pequeño orificio.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-13.jpeg"
                alt="Contador Coulter"
                caption="Contador Coulter: cada partícula que cruza el orificio genera un pulso de resistencia proporcional a su volumen."
              />
            </>
          )}

          {isVisible('forma') && (
            <>
              <SectionTitle id="forma">Forma de la partícula</SectionTitle>
              <p>
                Las partículas reales rara vez son esferas perfectas. La forma influye
                directamente en el <strong>empaquetamiento, el flujo y las fuerzas
                interparticulares</strong>.
              </p>

              <SubTitle>Formas comunes</SubTitle>
              <p>
                <strong>Acicular</strong> (forma de aguja), <strong>fibrosa</strong>,
                <strong> granular</strong> (granos irregulares), <strong>esférica</strong>,
                <strong> laminar</strong> (forma de hojuela), <strong>cúbica</strong>, etc.
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-14.png"
                alt="Formas comunes de partículas"
                caption="Morfologías típicas: acicular, fibrosa, granular, esférica, laminar y cúbica. La forma condiciona el flujo, el empaquetamiento y la interacción con fluidos."
              />

              <SubTitle>Esfericidad ($\Phi_S$)</SubTitle>
              <p>
                La <strong>esfericidad</strong> ($\Phi_S$) es una medida que indica qué tan
                cercana es la forma de una partícula a una esfera perfecta. Se define como
                el cociente entre el área superficial de una esfera con el mismo volumen que
                la partícula y el área superficial real de la partícula:
              </p>
              <p>
                {'$$\\Phi_S = \\frac{A_\\text{esfera con el mismo volumen}}{A_\\text{real de la partícula}}$$'}
              </p>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-15.jpeg"
                alt="Esfericidad"
                caption="Esfericidad $\\Phi_S$: razón entre área de la esfera equivalente en volumen y área real de la partícula."
              />

              <p>
                Para una esfera perfecta, <strong>$\Phi_S = 1$</strong>; para partículas
                irregulares, <strong>$\Phi_S &lt; 1$</strong>. Este parámetro es importante
                porque influye en los <strong>coeficientes de arrastre en fluidos</strong> y
                en la <strong>densidad de empaquetamiento</strong>.
              </p>
            </>
          )}

          {isVisible('flujo') && (
            <>
              <SectionTitle id="flujo">Propiedades de flujo de los polvos</SectionTitle>
              <p>
                La manera en que <strong>fluye un polvo</strong> es fundamental para su
                manejo y procesamiento. A continuación, los tres indicadores experimentales
                más usados y un apunte sobre ensayos avanzados.
              </p>

              <SubTitle>Ángulo de reposo ($\theta$)</SubTitle>
              <p>
                Es el ángulo formado entre la horizontal y la pendiente del cono que se crea
                cuando un polvo se vierte libremente sobre una superficie plana.
              </p>
              <ul>
                <li>
                  <strong>$\theta &lt; 30°$:</strong> indica un polvo de <em>flujo
                  libre</em>.
                </li>
                <li>
                  <strong>$\theta &gt; 45°$:</strong> indica un polvo <em>cohesivo</em>, de
                  flujo deficiente.
                </li>
                <li>
                  Este ángulo depende del <strong>tamaño de partícula, forma, contenido de
                  humedad</strong> y fuerzas interparticulares.
                </li>
              </ul>

              <Figure
                src="/classroom/iqya-2031/readings/propiedades-solidos-16.png"
                alt="Ángulo de reposo"
                caption="Ángulo de reposo $\\theta$: se mide sobre el cono formado al verter el polvo libremente sobre una superficie plana."
              />

              <SubTitle>Índice de Carr y razón de Hausner</SubTitle>
              <p>
                A partir de las densidades masales <em>suelta</em> ({String.raw`$\rho_\text{suelta}$`}) y
                <em> compactada</em> ({String.raw`$\rho_\text{compactada}$`}) se calculan dos indicadores
                ampliamente usados en la industria farmacéutica y de alimentos:
              </p>

              <p>
                <strong>Índice de compresibilidad (índice de Carr):</strong>
              </p>
              <p>
                {'$$IC = \\left( \\frac{\\rho_\\text{compactada} - \\rho_\\text{suelta}}{\\rho_\\text{compactada}} \\right) \\times 100\\%$$'}
              </p>

              <p>
                <strong>Razón de Hausner:</strong>
              </p>
              <p>
                {'$$RH = \\frac{\\rho_\\text{compactada}}{\\rho_\\text{suelta}}$$'}
              </p>

              <p>
                <strong>Interpretación (guía general):</strong> tabla basada en estándares
                USP y literatura de caracterización de polvos.
              </p>

              <div className="not-prose my-6 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-brand-dark">
                      <th className="border border-zinc-300 px-3 py-2 text-left font-semibold">
                        Índice de Carr (%)
                      </th>
                      <th className="border border-zinc-300 px-3 py-2 text-left font-semibold">
                        Razón de Hausner
                      </th>
                      <th className="border border-zinc-300 px-3 py-2 text-left font-semibold">
                        Carácter de flujo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-brand-gray">
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">≤ 10</td>
                      <td className="border border-zinc-300 px-3 py-2">1.00 – 1.11</td>
                      <td className="border border-zinc-300 px-3 py-2">Excelente</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="border border-zinc-300 px-3 py-2">11 – 15</td>
                      <td className="border border-zinc-300 px-3 py-2">1.12 – 1.18</td>
                      <td className="border border-zinc-300 px-3 py-2">Bueno</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">16 – 20</td>
                      <td className="border border-zinc-300 px-3 py-2">1.19 – 1.25</td>
                      <td className="border border-zinc-300 px-3 py-2">Aceptable</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="border border-zinc-300 px-3 py-2">21 – 25</td>
                      <td className="border border-zinc-300 px-3 py-2">1.26 – 1.34</td>
                      <td className="border border-zinc-300 px-3 py-2">Regular</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">26 – 31</td>
                      <td className="border border-zinc-300 px-3 py-2">1.35 – 1.45</td>
                      <td className="border border-zinc-300 px-3 py-2">Pobre</td>
                    </tr>
                    <tr className="bg-zinc-50">
                      <td className="border border-zinc-300 px-3 py-2">32 – 37</td>
                      <td className="border border-zinc-300 px-3 py-2">1.46 – 1.59</td>
                      <td className="border border-zinc-300 px-3 py-2">Muy pobre</td>
                    </tr>
                    <tr>
                      <td className="border border-zinc-300 px-3 py-2">&gt; 38</td>
                      <td className="border border-zinc-300 px-3 py-2">&gt; 1.60</td>
                      <td className="border border-zinc-300 px-3 py-2">Muy, muy pobre</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <SubTitle>Cohesión y adhesión</SubTitle>
              <p>
                Las fuerzas entre partículas (<strong>cohesión</strong>) y entre partículas y
                las paredes del contenedor (<strong>adhesión</strong>) afectan
                significativamente el flujo.
              </p>
              <ul>
                <li>
                  Los polvos cohesivos tienden a formar <strong>arcos</strong> (bloqueos en
                  forma de cúpula) y <strong>"chimeneas" o "tubos de rata"</strong>
                  {' '}(<em>ratholing</em>) en las tolvas, donde el material fluye únicamente
                  por un canal central.
                </li>
              </ul>

              <SubTitle>Función de flujo</SubTitle>
              <p>
                Se determina mediante ensayos de <strong>celda de cizallamiento</strong>
                {' '}(por ejemplo, celda de <strong>Jenike</strong>). Esta función caracteriza
                la resistencia del polvo y su capacidad para fluir bajo esfuerzo. Es un
                concepto avanzado, pero esencial para el diseño robusto de tolvas y silos,
                especialmente cuando se manejan polvos cohesivos.
              </p>

              <TipCallout>
                En la práctica industrial, el <strong>ángulo de reposo</strong> y la pareja
                <strong> Carr / Hausner</strong> son suficientes para un diagnóstico rápido
                del comportamiento de un polvo. Cuando el diseño es crítico (silos,
                alimentadores de alta precisión) o el polvo es claramente cohesivo, hay que
                avanzar a ensayos tipo Jenike.
              </TipCallout>
            </>
          )}

          {isVisible('otras') && (
            <>
              <SectionTitle id="otras">Otras propiedades importantes</SectionTitle>
              <ul>
                <li>
                  <strong>Contenido de humedad:</strong> afecta la fluidez al aumentar la
                  cohesión y la estabilidad durante el almacenamiento, pudiendo causar
                  apelmazamiento y crecimiento microbiano.
                </li>
                <li>
                  <strong>Área superficial específica:</strong> determina las tasas de
                  disolución, adsorción y cinética de reacción. Se mide mediante adsorción
                  de gases (ej., <strong>método BET</strong>).
                </li>
                <li>
                  <strong>Dureza y friabilidad:</strong> influyen en el comportamiento
                  durante la molienda y el manejo, afectando la generación de polvo y el
                  desgaste por fricción.
                </li>
                <li>
                  <strong>Higroscopicidad:</strong> tendencia a absorber humedad del aire.
                </li>
                <li>
                  <strong>Propiedades térmicas:</strong> calor específico y conductividad
                  térmica, cruciales para procesos de calentamiento o enfriamiento.
                </li>
              </ul>
            </>
          )}

          {isVisible('impacto') && (
            <>
              <SectionTitle id="impacto">Impacto en operaciones industriales</SectionTitle>
              <p>
                En la práctica industrial, las propiedades anteriores influyen directamente
                en la selección y diseño de casi todos los equipos de manejo de sólidos:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Almacenamiento
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Diseño de silos y tolvas (ángulos de cono, tamaño de salida, necesidad
                    de ayudas de flujo como vibradores o inyección de aire). Evitar
                    condiciones de "no flujo" como arcos y chimeneas es esencial. El diseño
                    de la tolva (flujo másico vs. flujo de embudo) depende críticamente de
                    las propiedades de flujo del polvo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Reducción de tamaño (molienda)
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    La energía requerida y la distribución final del tamaño de partícula
                    dependen de la <strong>dureza</strong> y <strong>friabilidad</strong> del
                    material de alimentación.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Calidad del producto
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Uniformidad de la dosificación (ej. mezclas instantáneas, premezclas de
                    vitaminas), textura (ej. suavidad del chocolate en polvo) y apariencia
                    del producto alimenticio final.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Disolución y dispersión
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Las partículas más finas con mayores áreas superficiales generalmente
                    se disuelven o dispersan más rápido.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Alimentación y transporte
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Selección y diseño de alimentadores (de tornillo, de banda) y sistemas
                    de transporte (neumático, mecánico).
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Mezclado
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Lograr la homogeneidad es un desafío si los componentes tienen
                    diferentes tamaños, formas o densidades, lo que lleva a la
                    <strong> segregación</strong> (desmezclado). El tipo de mezclador, el
                    tiempo de mezclado y a veces pasos de pre-procesamiento (como la
                    granulación) se eligen en función de estas propiedades.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 sm:col-span-2">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Control de polvo
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Los polvos finos y de baja densidad pueden generar una cantidad
                    significativa de polvo, lo que requiere medidas adecuadas de
                    ventilación y seguridad (<strong>riesgo de explosiones de polvo</strong>
                    {' '}para materiales orgánicos).
                  </p>
                </div>
              </div>
            </>
          )}

          {isVisible('consejos') && (
            <>
              <SectionTitle id="consejos">Consejos prácticos</SectionTitle>
              <ul>
                <li>
                  <strong>Caracterización detallada:</strong> no subestimar la importancia
                  de conocer bien las propiedades de los sólidos. Un pequeño cambio en la
                  humedad o el tamaño de partícula puede alterar drásticamente el
                  comportamiento.
                </li>
                <li>
                  <strong>Fuentes de información:</strong> consultar literatura técnica
                  (como el <em>Perry's Chemical Engineers' Handbook</em>), bases de datos
                  de propiedades de materiales y datos de proveedores de ingredientes.
                </li>
                <li>
                  <strong>Mediciones experimentales:</strong> si es posible, realizar
                  mediciones básicas (densidad aparente suelta y compactada, ángulo de
                  reposo, análisis por tamizado) para materiales específicos del proyecto.
                  Para problemas de flujo más críticos, considerar ensayos de cizallamiento.
                </li>
                <li>
                  <strong>Considerar la variabilidad:</strong> las propiedades de los
                  materiales naturales (como harinas o cacao) pueden variar entre lotes o
                  proveedores. El diseño debe considerar esta variabilidad.
                </li>
              </ul>
            </>
          )}

          {isVisible('bibliografia') && (
            <>
              <SectionTitle id="bibliografia">Bibliografía recomendada</SectionTitle>
              <p>Referencias para profundizar en propiedades de sólidos particulados:</p>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.), Capítulo 28:
                  Properties and Handling of Particulate Solids. McGraw-Hill.
                </li>
                <li>
                  Rhodes, M. (2008). <em>Introduction to Particle Technology</em> (2nd ed.),
                  Capítulo 1: Particle Size Analysis. John Wiley &amp; Sons.
                </li>
                <li>
                  United States Pharmacopeia (USP). <em>&lt;1174&gt; Powder Flow</em> —
                  índice de Carr, razón de Hausner y clasificación del carácter de flujo.
                </li>
                <li>
                  Perry, R. H., &amp; Green, D. W. (eds.). <em>Perry's Chemical Engineers'
                  Handbook</em> (8th ed.). McGraw-Hill — secciones sobre caracterización y
                  manejo de sólidos.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default PropiedadesSolidos;
