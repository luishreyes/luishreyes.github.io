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
  { id: 'perspectiva', label: 'Perspectiva histórica' },
  { id: 'definicion', label: 'Definición' },
  { id: 'importancia', label: 'Importancia' },
  { id: 'clasificacion', label: 'Clasificación y principios' },
  { id: 'balances', label: 'Balances de materia y energía' },
  { id: 'ejemplos', label: 'Ejemplos industriales' },
  { id: 'cierre', label: 'Cierre' },
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

const QuoteCallout: React.FC<{ children: React.ReactNode; source?: string }> = ({
  children,
  source,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="text-sm text-zinc-200 leading-relaxed italic">{children}</p>
    {source && <p className="mt-3 text-xs text-zinc-400">— {source}</p>}
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

/* ─── Componente principal ─── */
const OperacionesUnitarias: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'operaciones-unitarias');
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
          {activeSection === null && (
            <p className="text-lg leading-relaxed text-brand-gray">
              Esta lectura acompaña la primera sesión del curso y presenta el concepto que
              articula toda la disciplina: las <strong>operaciones unitarias</strong>. Aquí
              conocerás cómo surgió la idea, qué significa formalmente, por qué es tan poderosa
              y cómo se organizan los cientos de operaciones que veremos durante el semestre.
            </p>
          )}

          {isVisible('perspectiva') && (
            <>
              <SectionTitle id="perspectiva">Una perspectiva histórica</SectionTitle>
              <p>
                Para apreciar la Ingeniería Química contemporánea, es fundamental examinar el
                origen de uno de sus conceptos más influyentes: las operaciones unitarias.
                Antes del siglo XX, la industria química consistía principalmente en prácticas
                empíricas y oficios independientes. La fabricación de jabón, la producción de
                ácido sulfúrico y la metalurgia se consideraban procesos aislados, cada uno
                con sus propias metodologías y conocimientos. En ese entonces, no se
                reconocían los principios comunes que conectaban estas diversas industrias.
              </p>

              <figure className="my-8 not-prose">
                <img
                  src="/classroom/iqya-2031/readings/arthur-d-little.jpeg"
                  alt="Dr. Arthur D. Little"
                  className="rounded-xl shadow-lg mx-auto"
                  style={{ maxWidth: '320px' }}
                />
                <figcaption className="text-center text-sm text-brand-gray mt-3">
                  Dr. Arthur D. Little (1863–1935), químico e ingeniero que formalizó el
                  concepto de operaciones unitarias.
                </figcaption>
              </figure>

              <p>
                El punto de inflexión ocurrió en <strong>1915</strong>. El Dr. Arthur D. Little,
                destacado ingeniero químico y consultor, junto con un comité del
                <em> American Institute of Chemical Engineers (AIChE)</em>, presentó una
                visión revolucionaria en un informe al presidente del Massachusetts Institute
                of Technology (MIT). Propuso que:
              </p>

              <QuoteCallout source="Arthur D. Little, 1915. Citado en McCabe, Smith y Harriott (2005)">
                "cualquier proceso químico, sin importar cuán variado sea en su naturaleza,
                puede ser descompuesto en una serie coordinada de lo que podrían llamarse
                <em> operaciones unitarias</em>, como pulverización, secado, cristalización,
                filtración, evaporación, destilación, etc."
              </QuoteCallout>

              <p>
                Esta idea transformadora sugería que, en lugar de estudiar innumerables
                procesos individuales, los ingenieros podían enfocarse en un
                <strong> conjunto limitado de etapas físicas fundamentales</strong>. Permitió
                organizar el conocimiento en ingeniería química de manera lógica y
                sistemática, mejorando la enseñanza, la investigación y, crucialmente, el
                diseño y la innovación industrial.
              </p>

              <TipCallout>
                La separación conceptual entre <strong>reacción química</strong> (lo que pasa a
                nivel molecular) y <strong>operaciones unitarias</strong> (los procesos físicos
                que permiten que la reacción ocurra en escala industrial) es la base que hace
                posible diseñar plantas completas con métodos reproducibles.
              </TipCallout>
            </>
          )}

          {isVisible('definicion') && (
            <>
              <SectionTitle id="definicion">Definición</SectionTitle>
              <p>
                Una <strong>operación unitaria</strong> se define como un paso básico dentro de
                un proceso químico donde los materiales experimentan un cambio principalmente
                físico, o una transformación fisicoquímica, que se analiza y trata como una
                unidad individual.
              </p>

              <SubTitle>¿Para qué se usan?</SubTitle>
              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Preparar reactivos
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Por ejemplo, la molienda de un sólido para aumentar su área superficial o
                    la disolución de un reactivo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Separar y purificar productos
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Aislar un producto deseado de subproductos o impurezas mediante
                    destilación, extracción o filtración.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Controlar la energía
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Calentar o enfriar corrientes de proceso, como ocurre en los
                    intercambiadores de calor.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    Mover materiales
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Transporte de fluidos por tuberías o de sólidos mediante sistemas de
                    transporte neumático, bandas, tornillos, etc.
                  </p>
                </div>
              </div>

              <SubTitle>Reacción química vs. operación unitaria</SubTitle>
              <p>
                Es importante distinguir las operaciones unitarias de las reacciones químicas.
                Mientras la <strong>reacción química</strong> constituye el núcleo de la
                transformación molecular, las <strong>operaciones unitarias</strong> son los
                procesos físicos que apoyan y posibilitan estas reacciones: acondicionan los
                reactivos, separan y purifican los productos, y gestionan la energía del
                sistema.
              </p>
              <p>
                Un proceso químico completo es una <strong>secuencia integrada</strong> de
                reacciones químicas y diversas operaciones unitarias. Como señala Geankoplis
                (2003), estas operaciones se fundamentan en los principios de transferencia de
                masa, calor y/o cantidad de movimiento.
              </p>

              <InfoCallout>
                Existen <strong>industrias completas que operan exclusivamente con operaciones
                unitarias</strong>, sin reacciones químicas presentes — piensa en una planta
                de tratamiento de agua, una refinería que solo separa fracciones, o una planta
                de alimentos que deshidrata y envasa.
              </InfoCallout>
            </>
          )}

          {isVisible('importancia') && (
            <>
              <SectionTitle id="importancia">Importancia</SectionTitle>
              <p>
                El estudio de las operaciones unitarias es fundamental en la formación del
                ingeniero químico por cuatro razones principales:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    1. Universalidad
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Los principios son aplicables en diversas industrias (petroquímica,
                    alimentaria, farmacéutica, biotecnológica, ambiental). Quien domina la
                    destilación puede diseñar una columna para separar etanol de agua, hexano
                    de xileno, o aromáticos de nafta.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    2. Simplificación de la complejidad
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Permiten descomponer procesos industriales complejos en unidades
                    manejables, facilitando el análisis y la optimización del sistema
                    completo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    3. Base para diseño y escalado
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Proporcionan el marco teórico y los modelos matemáticos para escalar desde
                    el laboratorio hasta la producción industrial, pasando por la planta
                    piloto.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">
                    4. Optimización y eficiencia
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    El análisis detallado de cada operación permite reducir consumo
                    energético, minimizar residuos, mejorar la calidad del producto y reducir
                    costos operativos — aspectos clave para sostenibilidad y rentabilidad.
                  </p>
                </div>
              </div>
            </>
          )}

          {isVisible('clasificacion') && (
            <>
              <SectionTitle id="clasificacion">Clasificación y principios</SectionTitle>
              <p>
                Las operaciones unitarias se agrupan según el fenómeno físico predominante.
                Las cuatro grandes familias son:
              </p>

              <SubTitle>1. Flujo de fluidos — transferencia de cantidad de movimiento</SubTitle>
              <p>
                Se ocupan del movimiento de líquidos y gases. Incluyen transporte en tuberías,
                bombeo, compresión, agitación, mezclado, sedimentación y filtración.
              </p>
              <p>
                <strong>Principio:</strong> mecánica de fluidos. La ecuación fundamental es el
                Balance de Energía Mecánica, conocida como <strong>ecuación de Bernoulli</strong>.
                Relaciona la presión $P$, velocidad $v$ y elevación $z$ de un fluido entre dos
                puntos (1 y 2), considerando el trabajo añadido por una bomba ($h_p$) y las
                pérdidas por fricción ($h_f$):
              </p>
              <p>
                {'$$\\frac{P_1}{\\rho g} + \\frac{v_1^{2}}{2 g} + z_1 + h_p = \\frac{P_2}{\\rho g} + \\frac{v_2^{2}}{2 g} + z_2 + h_f$$'}
              </p>
              <p>
                Donde $\rho$ representa la densidad del fluido y $g$ la aceleración de la
                gravedad.
              </p>
              <VideoEmbed id="DW4rItB20h4" title="Ejemplo: flujo de fluidos" />

              <SubTitle>2. Transferencia de calor</SubTitle>
              <p>
                Involucran el intercambio de energía térmica. Los ejemplos incluyen
                intercambiadores de calor, secado, evaporación y control de temperatura en
                reactores.
              </p>
              <p>
                <strong>Principio:</strong> termodinámica y mecanismos de transferencia de
                calor (conducción, convección, radiación). La
                <strong> Ley de Enfriamiento de Newton</strong> para convección describe la
                tasa de transferencia de calor $q$, donde $h$ es el coeficiente de
                transferencia, $A$ el área, $T_s$ la temperatura de la superficie y $T_f$ la
                del fluido:
              </p>
              <p>{'$$q = h \\, A \\, (T_s - T_f)$$'}</p>
              <VideoEmbed id="GDyQXSEAJNA" title="Ejemplo: transferencia de calor" />

              <SubTitle>3. Transferencia de masa</SubTitle>
              <p>
                Implican el movimiento de componentes químicos entre fases o dentro de una
                misma fase. Constituyen la base de la mayoría de los procesos de separación.
                Ejemplos: destilación, absorción, extracción, adsorción, secado y operaciones
                con membranas.
              </p>
              <p>
                <strong>Principio:</strong> equilibrio de fases y cinética de transferencia de
                masa. La <strong>Ley de Fick</strong> establece que el flujo molar $J_{'{A,z}'}$
                de un componente $A$ en dirección $z$ es proporcional al gradiente de su
                concentración $C_A$:
              </p>
              <p>{'$$J_{A,z} = - D_{AB} \\, \\frac{dC_A}{dz}$$'}</p>
              <p>
                Donde $D_{'{AB}'}$ es el coeficiente de difusividad de $A$ en $B$.
              </p>
              <VideoEmbed id="PYMWUz7TC3A" title="Ejemplo: transferencia de masa" />

              <SubTitle>4. Operaciones mecánicas</SubTitle>
              <p>
                Enfocadas en el manejo y procesamiento físico de sólidos: reducción de tamaño
                (trituración, molienda), tamizado, transporte de sólidos, mezclado de sólidos
                y pastas.
              </p>
              <p>
                <strong>Principio:</strong> mecánica de sólidos y propiedades de los
                materiales.
              </p>
              <VideoEmbed id="Twp0OY0nn5w" title="Ejemplo: operaciones mecánicas" />

              <InfoCallout>
                Muchas operaciones unitarias <strong>combinan varios fenómenos</strong>. Por
                ejemplo, el secado involucra simultáneamente transferencia de calor (para
                evaporar el agua) y transferencia de masa (para transportar el vapor al aire).
                La destilación combina equilibrio de fases con transferencia de masa y de
                calor.
              </InfoCallout>
            </>
          )}

          {isVisible('balances') && (
            <>
              <SectionTitle id="balances">Balances de materia y energía</SectionTitle>
              <p>
                Los <strong>balances de materia y energía</strong> son herramientas
                fundamentales y transversales para cuantificar flujos, composiciones y
                requerimientos energéticos en cualquier operación unitaria — sin importar a
                cuál de las cuatro familias pertenezca.
              </p>
              <p>El balance general de materia se expresa como:</p>
              <p>
                {'$$\\text{Entrada} - \\text{Salida} + \\text{Generación} - \\text{Consumo} = \\text{Acumulación}$$'}
              </p>
              <p>
                En estado estacionario y sin reacción química, se simplifica a:
                <strong> Entrada = Salida</strong>. Esta versión sencilla es la que usaremos
                la mayor parte del semestre cuando los procesos operan en continuo y los
                componentes no se generan ni consumen dentro del equipo.
              </p>
              <TipCallout title="💡 Checklist del balance">
                Antes de plantear cualquier balance pregúntate: ¿qué entra?, ¿qué sale?,
                ¿cambia algo con el tiempo (estado estacionario o transitorio)?, ¿hay
                reacción química (generación/consumo)? Si los cuatro términos están claros,
                el balance se resuelve solo.
              </TipCallout>
            </>
          )}

          {isVisible('ejemplos') && (
            <>
              <SectionTitle id="ejemplos">Ejemplos industriales</SectionTitle>
              <p>
                Para visualizar cómo se encadenan las operaciones, veamos dos procesos
                industriales simplificados. Fíjate cómo cada uno es una
                <strong> secuencia de operaciones unitarias interconectadas</strong>.
              </p>

              <SubTitle>Refinación de petróleo crudo para obtener gasolina</SubTitle>
              <p>
                <strong>Secuencia:</strong>
              </p>
              <ol>
                <li>
                  <strong>Bombeo</strong> — flujo de fluidos.
                </li>
                <li>
                  <strong>Precalentamiento</strong> en hornos e intercambiadores —
                  transferencia de calor.
                </li>
                <li>
                  <strong>Destilación fraccionada</strong> — transferencia de masa y calor.
                </li>
                <li>
                  <strong>Enfriamiento y tratamientos posteriores</strong> — transferencia de
                  calor y otras operaciones unitarias.
                </li>
              </ol>
              <VideoEmbed id="GYRwWyG3Qqw" title="Refinación de petróleo" start={8} />

              <SubTitle>Potabilización de agua superficial</SubTitle>
              <p>
                <strong>Secuencia:</strong>
              </p>
              <ol>
                <li>
                  <strong>Tamizado</strong> — operación mecánica.
                </li>
                <li>
                  <strong>Coagulación / floculación</strong> — mezclado y flujo de fluidos.
                </li>
                <li>
                  <strong>Sedimentación</strong> — flujo de fluidos / separación mecánica.
                </li>
                <li>
                  <strong>Filtración</strong> — flujo de fluidos / separación mecánica.
                </li>
                <li>
                  <strong>Adsorción con carbón activado</strong> (opcional) — transferencia de
                  masa.
                </li>
                <li>
                  <strong>Desinfección</strong> — transferencia de masa y reacción.
                </li>
              </ol>
              <VideoEmbed id="0_ZcCqqpS2o" title="Potabilización de agua" start={398} />
            </>
          )}

          {isVisible('cierre') && (
            <>
              <SectionTitle id="cierre">Cierre</SectionTitle>
              <p>
                El concepto de operaciones unitarias continúa siendo un pilar de la Ingeniería
                Química. Proporciona un <strong>lenguaje común</strong> y un
                <strong> marco analítico fundamental</strong> para el diseño, análisis,
                optimización y resolución de problemas en diversas industrias. Su comprensión
                profunda es una herramienta esencial para el ingeniero químico.
              </p>
              <p>
                En las próximas sesiones del curso exploraremos en detalle varias de estas
                operaciones — empezando por las propiedades de sólidos particulados, luego
                reducción de tamaño, flujo de fluidos, bombas, agitación, transferencia de
                calor y, finalmente, equilibrio de fases y destilación.
              </p>

              <h3 className="text-lg font-semibold text-brand-dark mt-10 mb-3">
                Referencias
              </h3>
              <ul className="text-sm text-brand-gray leading-relaxed">
                <li>
                  McCabe, W. L., Smith, J. C., &amp; Harriott, P. (2005).
                  <em> Unit Operations of Chemical Engineering</em> (7th ed.). McGraw-Hill.
                </li>
                <li>
                  Geankoplis, C. J. (2003). <em>Transport Processes and Separation Process
                    Principles</em> (4th ed.). Prentice Hall.
                </li>
                <li>
                  Little, A. D. (1915). Report to the President of MIT. American Institute of
                  Chemical Engineers.
                </li>
              </ul>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default OperacionesUnitarias;
