import React, { useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── TOC ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'ejemplos', label: 'Ejemplos' },
  { id: 'esquema', label: 'Esquema paso a paso' },
  { id: 'redaccion', label: 'Redacción de la propuesta final' },
  { id: 'entrega', label: 'Entrega' },
];

/* ─── Callouts ─── */
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

const WarningCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = '⚠️ Importante',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-red-400 text-sm mb-2">{title}</p>
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

/* ─── Datos estructurados de los 2 ejemplos ─── */
type CampoEjemplo = { label: string; descripcion: string; ejemplo: string | React.ReactNode };

const ejemplo1: { titulo: string; campos: CampoEjemplo[]; propuestaFinal: React.ReactNode } = {
  titulo: 'EcoFilter · Proyecto de desarrollo',
  campos: [
    {
      label: 'Nombre del proyecto',
      descripcion: 'Título corto y descriptivo del proyecto de grado.',
      ejemplo: <><strong>EcoFilter</strong></>,
    },
    {
      label: 'Es un',
      descripcion: 'Tipo de proyecto de grado (investigación, desarrollo de software, diseño de producto, estudio de caso, etc.).',
      ejemplo: 'Desarrollo de un sistema de filtración de agua sostenible.',
    },
    {
      label: 'Que busca beneficiar a',
      descripcion: 'Público objetivo del proyecto (comunidad, industria, grupo académico, sociedad en general, etc.).',
      ejemplo: 'Comunidades rurales sin acceso a agua potable.',
    },
    {
      label: 'Acción frente al problema identificado',
      descripcion: 'Qué pretende lograr el proyecto en relación con el problema (generar conocimiento, proponer soluciones, desarrollar tecnología, etc.).',
      ejemplo: 'Proporcionar un método asequible y sostenible para purificar el agua.',
    },
    {
      label: 'Problema de investigación',
      descripcion: 'Descripción concisa del problema o brecha de conocimiento que el proyecto aborda.',
      ejemplo: 'Falta de acceso a sistemas de purificación de agua eficientes y ecológicos en áreas rurales.',
    },
    {
      label: 'Esto es relevante porque',
      descripcion: 'Justificación de la importancia del proyecto y el valor de la investigación propuesta.',
      ejemplo: 'El acceso al agua potable es fundamental para la salud y el bienestar de estas comunidades, y la solución propuesta utiliza materiales sostenibles y fácilmente disponibles, reduciendo el impacto ambiental.',
    },
    {
      label: 'Y se distingue porque',
      descripcion: 'Beneficios y ventajas del enfoque o metodología respecto a otras investigaciones o soluciones existentes.',
      ejemplo: (
        <ul className="list-disc pl-5 space-y-1">
          <li>EcoFilter utiliza una tecnología innovadora basada en carbón activado producido de desechos agrícolas.</li>
          <li>Es un sistema fácil de implementar y mantener por las comunidades beneficiadas.</li>
          <li>El proyecto incluye un programa de capacitación y educación para los usuarios finales.</li>
        </ul>
      ),
    },
  ],
  propuestaFinal: (
    <p>
      <strong>EcoFilter</strong> es un desarrollo innovador de un sistema de filtración de agua sostenible,
      diseñado para beneficiar a comunidades rurales sin acceso a agua potable. Enfocado en proporcionar un
      método asequible y sostenible para purificar el agua, EcoFilter aborda la falta de acceso a sistemas
      de purificación de agua eficientes y ecológicos en áreas rurales. Este proyecto es relevante y esencial,
      ya que facilita el acceso vital al agua potable, promoviendo la salud y el bienestar de estas comunidades
      mientras utiliza materiales sostenibles y de fácil acceso, minimizando así el impacto ambiental. Lo que
      distingue a EcoFilter es su innovadora tecnología basada en carbón activado producido a partir de desechos
      agrícolas, su facilidad de implementación y mantenimiento en las comunidades beneficiadas, y la inclusión
      de un programa integral de capacitación y educación para los usuarios finales.
    </p>
  ),
};

const ejemplo2: { titulo: string; campos: CampoEjemplo[]; propuestaFinal: React.ReactNode } = {
  titulo: 'ChemFoodLab · Proyecto de innovación',
  campos: [
    {
      label: 'Nombre de la innovación',
      descripcion: 'Título corto y llamativo que describa la innovación.',
      ejemplo: <><strong>ChemFoodLab</strong></>,
    },
    {
      label: 'Es un(a)',
      descripcion: 'Tipo de innovación (tecnología, proceso, modelo de negocio, producto, servicio, etc.).',
      ejemplo: 'Plataforma virtual de simulación y experimentación para ingeniería química y de alimentos.',
    },
    {
      label: 'Dirigido a',
      descripcion: 'Perfil del usuario final o stakeholder que se beneficiará de la innovación.',
      ejemplo: 'Estudiantes de ingeniería química y de alimentos.',
    },
    {
      label: 'Acción innovadora',
      descripcion: 'Qué hace la innovación de manera diferente para abordar un problema o necesidad específica.',
      ejemplo: 'Facilitar el aprendizaje práctico y experimental en un entorno virtual seguro y controlado.',
    },
    {
      label: 'Problema o necesidad',
      descripcion: 'Descripción clara y concisa del problema o necesidad que la innovación pretende solucionar.',
      ejemplo: 'La falta de acceso a laboratorios y equipos especializados limita las oportunidades de aprendizaje práctico y experimental para los estudiantes.',
    },
    {
      label: 'Innovación propuesta',
      descripcion: '¿Cómo la idea o solución es nueva, diferente y valiosa? ¿Cómo aborda el problema de una manera que no se ha hecho antes?',
      ejemplo: 'ChemFoodLab es una plataforma en línea que simula un laboratorio real, permitiendo a los estudiantes realizar experimentos y prácticas relacionados con ingeniería química y de alimentos de manera virtual. La plataforma ofrece una variedad de herramientas y recursos didácticos que complementan y enriquecen la formación académica de los estudiantes.',
    },
    {
      label: 'Valor añadido',
      descripcion: 'Beneficios claros y tangibles que los usuarios o stakeholders obtendrán al adoptar la innovación.',
      ejemplo: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Aprendizaje práctico sin necesidad de infraestructura física.</li>
          <li>Acceso a una amplia gama de experimentos y prácticas.</li>
          <li>Flexibilidad para aprender y practicar en cualquier momento y lugar.</li>
        </ul>
      ),
    },
    {
      label: 'Diferenciadores clave',
      descripcion: 'Elementos únicos de la innovación que la distinguen de otras soluciones existentes o enfoques tradicionales.',
      ejemplo: (
        <ul className="list-disc pl-5 space-y-1">
          <li>Interfaz amigable e interactiva que simula un entorno de laboratorio real.</li>
          <li>Módulos educativos actualizados y alineados con los currículos de ingeniería química y de alimentos.</li>
          <li>Comunidad virtual para la colaboración y el intercambio de conocimientos entre estudiantes y docentes.</li>
        </ul>
      ),
    },
  ],
  propuestaFinal: (
    <p>
      <strong>ChemFoodLab</strong> es una plataforma virtual de simulación y experimentación única diseñada
      para estudiantes de ingeniería química y de alimentos. Esta innovación aborda la necesidad crítica de
      acceso a experiencias prácticas y experimentales, proporcionando un entorno virtual seguro y controlado
      donde los estudiantes pueden aprender y practicar en cualquier momento y lugar. La plataforma simula con
      precisión un laboratorio real, permitiendo realizar una variedad de experimentos y prácticas esenciales
      para su formación académica. ChemFoodLab se distingue por su interfaz intuitiva, módulos educativos
      alineados con los currículos actuales y una comunidad virtual para la colaboración y el intercambio de
      conocimientos entre estudiantes y educadores, ofreciendo así un valor educativo inigualable y apoyando
      el desarrollo integral de los futuros ingenieros en estos campos.
    </p>
  ),
};

/* ─── Componente principal ─── */
const PropuestaValor: React.FC = () => {
  const course = getCourseBySlug('iqya-3050');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'propuesta-valor');
  if (!reading) return null;

  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeExample, setActiveExample] = useState<1 | 2>(1);
  const [revealFinal, setRevealFinal] = useState(false);

  const handleTocClick = (id: string) => {
    setActiveSection((prev) => (prev === id ? null : id));
    setTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isVisible = (id: string) => activeSection === null || activeSection === id;

  const current = activeExample === 1 ? ejemplo1 : ejemplo2;

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
        {/* Desktop TOC */}
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

        {/* Contenido */}
        <div className="reading-prose">
          {activeSection === null && (
            <p className="text-lg leading-relaxed text-brand-gray">
              Esta guía acompaña la entrega de la <strong>propuesta de valor</strong> del seminario. La
              propuesta de valor es el documento inicial que articula <em>qué</em> están desarrollando,
              <em> para quién</em>, <em>por qué importa</em> y <em>qué la hace diferente</em>. Es el
              punto de partida del proyecto de desarrollo profesional y la base sobre la que se construyen
              todas las entregas siguientes.
            </p>
          )}

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">Introducción</SectionTitle>
              <p>
                A continuación se presentan dos esquemas de propuesta de valor. Ambos son válidos —
                cada uno se ajusta mejor a un tipo específico de reto. Lo más importante es
                <strong> escoger el esquema que más se acomode al reto seleccionado</strong> por su equipo
                y seguir cada uno de los pasos que se proponen para escribirla.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-yellow-dark mb-2">Ejemplo 1</p>
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Proyecto de desarrollo</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Ideal cuando su reto es crear una solución concreta para un problema identificado:
                    una tecnología, un producto, un servicio, un procedimiento.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-yellow-dark mb-2">Ejemplo 2</p>
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Proyecto de innovación</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Ideal cuando su reto es proponer algo nuevo que no existe todavía: una plataforma,
                    un modelo de negocio, una metodología que cambia la forma de hacer algo.
                  </p>
                </div>
              </div>

              <TipCallout>
                No intente forzar su proyecto a un esquema que no le calce. Escoja el que le permita
                articular su propuesta con <strong>mayor claridad</strong>. El esquema es una herramienta,
                no una camisa de fuerza.
              </TipCallout>
            </>
          )}

          {isVisible('ejemplos') && (
            <>
              <SectionTitle id="ejemplos">Ejemplos</SectionTitle>
              <p>
                Use las pestañas para alternar entre los dos esquemas. Cada fila muestra el campo a
                llenar, su descripción y un ejemplo concreto.
              </p>

              {/* Pestañas interactivas */}
              <div role="tablist" aria-label="Esquemas de propuesta de valor" className="flex gap-2 my-6 not-prose border-b border-zinc-200">
                <button
                  role="tab"
                  aria-selected={activeExample === 1}
                  onClick={() => setActiveExample(1)}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                    activeExample === 1
                      ? 'text-brand-dark border-brand-yellow'
                      : 'text-brand-gray border-transparent hover:text-brand-dark'
                  }`}
                >
                  Ejemplo 1 · {ejemplo1.titulo.split(' · ')[0]}
                </button>
                <button
                  role="tab"
                  aria-selected={activeExample === 2}
                  onClick={() => setActiveExample(2)}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                    activeExample === 2
                      ? 'text-brand-dark border-brand-yellow'
                      : 'text-brand-gray border-transparent hover:text-brand-dark'
                  }`}
                >
                  Ejemplo 2 · {ejemplo2.titulo.split(' · ')[0]}
                </button>
              </div>

              <p className="text-sm text-brand-gray italic">{current.titulo}</p>

              <div className="my-4 space-y-3 not-prose">
                {current.campos.map((campo, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-200 p-5 bg-white hover:border-brand-yellow transition-colors"
                  >
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-yellow text-brand-dark text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-semibold text-brand-dark text-base">{campo.label}</h4>
                    </div>
                    <p className="text-sm text-brand-gray leading-relaxed mb-2 italic">
                      {campo.descripcion}
                    </p>
                    <div className="mt-2 rounded-lg bg-yellow-50 border-l-4 border-brand-yellow-dark p-3 text-sm text-brand-dark">
                      <span className="block text-xs font-bold uppercase tracking-widest text-brand-yellow-dark mb-1">Ejemplo</span>
                      {typeof campo.ejemplo === 'string' ? <p>{campo.ejemplo}</p> : campo.ejemplo}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {isVisible('redaccion') && (
            <>
              <SectionTitle id="redaccion">Redacción de la propuesta final</SectionTitle>
              <p>
                Una vez completados los campos, integre las respuestas en un <strong>párrafo único, fluido
                y conectado</strong>. La propuesta final no es una lista de viñetas — es un texto
                narrativo que comunica el proyecto con claridad. Abajo puede ver cómo queda el ejemplo
                seleccionado.
              </p>

              <div className="my-6 not-prose">
                <button
                  onClick={() => setRevealFinal(!revealFinal)}
                  className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-brand-dark text-white hover:bg-zinc-800 transition-colors text-left"
                >
                  <span className="font-semibold">
                    {revealFinal ? 'Ocultar' : 'Ver'} propuesta final del {activeExample === 1 ? 'Ejemplo 1' : 'Ejemplo 2'}
                  </span>
                  <span className="text-brand-yellow">{revealFinal ? '−' : '+'}</span>
                </button>
                {revealFinal && (
                  <blockquote className="mt-3 rounded-xl bg-yellow-50 border-l-4 border-brand-yellow-dark p-5 sm:p-6 text-brand-dark">
                    {current.propuestaFinal}
                  </blockquote>
                )}
              </div>

              <TipCallout title="💡 Buena redacción = buena comunicación">
                La claridad, coherencia y solidez de la propuesta son fundamentales para comunicar
                efectivamente la importancia y el impacto potencial del proyecto. Léala en voz alta:
                si hay frases que se enredan, reescríbalas.
              </TipCallout>
            </>
          )}

          {isVisible('esquema') && (
            <>
              <SectionTitle id="esquema">Esquema paso a paso</SectionTitle>
              <p>
                Independientemente del esquema elegido, siga este proceso para escribir su propuesta:
              </p>

              <ol className="list-decimal pl-6 space-y-4 my-6">
                <li>
                  <strong>Escoja el esquema adecuado.</strong> Lea ambos ejemplos y escoja el que más se
                  acomode al reto de su equipo. Si dudan, consulten al asesor.
                </li>
                <li>
                  <strong>Llene cada campo en borrador.</strong> Redacte cada respuesta por separado.
                  No se preocupen por la conexión entre ellas — todavía no. Céntrense en responder
                  cada pregunta con precisión.
                </li>
                <li>
                  <strong>Valide con datos y referencias.</strong> La justificación («esto es relevante
                  porque…») y el problema deben estar apoyados en <em>evidencia</em>: cifras, reportes,
                  literatura. No alcanzan las intuiciones.
                </li>
                <li>
                  <strong>Integre en un párrafo.</strong> Conecte las respuestas en un texto narrativo
                  único, fluido y sin saltos bruscos. Esta es la propuesta de valor final.
                </li>
                <li>
                  <strong>Iteren con el asesor.</strong> Muestren la versión borrador. Reciban retroalimentación
                  y ajusten. La propuesta madura con iteraciones.
                </li>
                <li>
                  <strong>Firma y entrega.</strong> Cuando el asesor apruebe, firma digitalmente el
                  documento y cada integrante sube el PDF firmado a BloqueNeón.
                </li>
              </ol>

              <WarningCallout title="⚠️ Errores comunes">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Confundir <em>problema</em> con <em>síntoma</em>. El problema es la causa estructural; el síntoma es lo que se observa.</li>
                  <li>Escribir el diferenciador en términos vagos («es mejor», «es más eficiente») sin cuantificar ni comparar.</li>
                  <li>Describir la solución antes de haber descrito bien el problema.</li>
                  <li>Entregar la propuesta sin haber recibido retroalimentación del asesor.</li>
                </ul>
              </WarningCallout>
            </>
          )}

          {isVisible('entrega') && (
            <>
              <SectionTitle id="entrega">Entrega</SectionTitle>
              <p>
                Para completar la actividad, cada equipo debe desarrollar una propuesta de valor
                siguiendo uno de los esquemas presentados, adaptándolo al reto seleccionado para el
                proyecto de desarrollo profesional.
              </p>

              <p>
                Es importante que la entrega muestre <strong>de manera clara y evidente</strong> que
                se siguió el proceso propuesto: abordar cada uno de los puntos indicados y presentar
                una propuesta de valor final sólida y bien articulada.
              </p>

              <InfoCallout title="📥 Pasos de entrega">
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Completen el documento con los campos del esquema elegido y la propuesta final integrada.</li>
                  <li>Envíen el documento al <strong>asesor principal</strong> para revisión.</li>
                  <li>Una vez aprobado, el asesor <strong>firma digitalmente</strong> el PDF.</li>
                  <li>
                    Cada integrante sube el <strong>PDF firmado</strong> a{' '}
                    <a
                      href="https://bloqueneon.uniandes.edu.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-brand-yellow decoration-2 underline-offset-2 hover:text-brand-yellow-dark"
                    >
                      BloqueNeón
                    </a>{' '}
                    antes de la fecha límite establecida.
                  </li>
                </ol>
              </InfoCallout>

              <p>
                Recuerden: la <strong>claridad, coherencia y solidez</strong> de la propuesta son
                fundamentales para comunicar la importancia y el impacto potencial del proyecto. No se
                trata solo de cumplir con un entregable — es la primera oportunidad para vender la idea.
              </p>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default PropuestaValor;
