import React, { useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── TOC ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'caracteristicas', label: 'Características' },
  { id: 'tipos', label: 'Tipos de flujograma' },
  { id: 'simbolos', label: 'Símbolos estándar' },
  { id: 'proceso', label: 'Cómo hacer un flujograma' },
  { id: 'herramientas', label: 'Herramientas recomendadas' },
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

/* ─── SVG de cada símbolo (120×70) ─── */
const SymbolSVG: React.FC<{ type: string }> = ({ type }) => {
  const base = 'stroke-brand-dark fill-yellow-50';
  switch (type) {
    case 'flecha':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
              <polygon points="0 0, 10 4, 0 8" fill="#1A1A1A" />
            </marker>
          </defs>
          <line x1="10" y1="35" x2="105" y2="35" stroke="#1A1A1A" strokeWidth="2" markerEnd="url(#arrowhead)" />
        </svg>
      );
    case 'terminal':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <rect x="15" y="15" width="90" height="40" rx="20" ry="20" strokeWidth="2" className={base} />
          <text x="60" y="40" fontSize="12" textAnchor="middle" fill="#1A1A1A">Inicio / Fin</text>
        </svg>
      );
    case 'proceso':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <rect x="15" y="15" width="90" height="40" strokeWidth="2" className={base} />
          <text x="60" y="40" fontSize="12" textAnchor="middle" fill="#1A1A1A">Proceso</text>
        </svg>
      );
    case 'decision':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <polygon points="60,10 110,35 60,60 10,35" strokeWidth="2" className={base} />
          <text x="60" y="40" fontSize="11" textAnchor="middle" fill="#1A1A1A">¿Decisión?</text>
        </svg>
      );
    case 'entrada':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <polygon points="25,15 110,15 95,55 10,55" strokeWidth="2" className={base} />
          <text x="60" y="40" fontSize="12" textAnchor="middle" fill="#1A1A1A">Entrada</text>
        </svg>
      );
    case 'salida':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <path d="M 15 15 H 105 V 55 Q 105 47, 95 50 Q 85 53, 75 50 Q 65 47, 55 50 Q 45 53, 35 50 Q 25 47, 15 50 Z" strokeWidth="2" className={base} />
          <text x="60" y="37" fontSize="12" textAnchor="middle" fill="#1A1A1A">Salida</text>
        </svg>
      );
    case 'conectorPag':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <circle cx="60" cy="35" r="18" strokeWidth="2" className={base} />
          <text x="60" y="40" fontSize="14" textAnchor="middle" fill="#1A1A1A" fontWeight="bold">A</text>
        </svg>
      );
    case 'conectorFuera':
      return (
        <svg viewBox="0 0 120 70" className="w-full h-full">
          <polygon points="25,15 95,15 110,35 95,55 25,55" strokeWidth="2" className={base} />
          <text x="60" y="40" fontSize="11" textAnchor="middle" fill="#1A1A1A">Otra pág.</text>
        </svg>
      );
    default:
      return null;
  }
};

type Simbolo = {
  id: string;
  nombre: string;
  forma: string;
  type: string;
  descripcion: string;
};

const simbolos: Simbolo[] = [
  {
    id: 'flecha',
    nombre: 'Líneas de flujo',
    forma: 'Flechas',
    type: 'flecha',
    descripcion: 'Indican la dirección del flujo: marcan qué símbolo le sigue al otro. Pueden ser verticales, horizontales o diagonales.',
  },
  {
    id: 'terminal',
    nombre: 'Terminales',
    forma: 'Rectángulos de esquinas romas',
    type: 'terminal',
    descripcion: 'Marcan el inicio y el cierre del flujograma: el punto de comienzo y de fin del proceso.',
  },
  {
    id: 'proceso',
    nombre: 'Proceso',
    forma: 'Rectángulo ordinario',
    type: 'proceso',
    descripcion: 'Representa un conjunto específico de operaciones, o sea, el cambio de forma, valor o ubicación de los datos.',
  },
  {
    id: 'decision',
    nombre: 'Decisión',
    forma: 'Rombo',
    type: 'decision',
    descripcion: 'Introduce una toma de decisión, usualmente con dos respuestas posibles: sí (flujo en un sentido) y no (flujo en otro sentido).',
  },
  {
    id: 'entrada',
    nombre: 'Entrada',
    forma: 'Paralelogramo inclinado',
    type: 'entrada',
    descripcion: 'Representa la necesidad de ingresar algún tipo de información en el proceso.',
  },
  {
    id: 'salida',
    nombre: 'Salida',
    forma: 'Símbolo de hoja de papel',
    type: 'salida',
    descripcion: 'Representa la forma de extraer datos del proceso: imprimiéndolos en papel o exhibiéndolos en un monitor.',
  },
  {
    id: 'conectorPag',
    nombre: 'Conector de página',
    forma: 'Círculo',
    type: 'conectorPag',
    descripcion: 'Permite vincular el flujo de un punto a otro cuando hacerlo con una línea resultaría confuso. Suele tener dentro una letra para indicar con qué otro conector se enlaza.',
  },
  {
    id: 'conectorFuera',
    nombre: 'Conector fuera de página',
    forma: 'Pentágono',
    type: 'conectorFuera',
    descripcion: 'Permite vincular un punto con otro cuando el punto de destino se encuentra en una página distinta a la actual.',
  },
];

/* ─── Componente principal ─── */
const Flujogramas: React.FC = () => {
  const course = getCourseBySlug('iqya-3050');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'flujogramas');
  if (!reading) return null;

  const [tocOpen, setTocOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSimbolo, setActiveSimbolo] = useState<string>(simbolos[0].id);
  const [activeStep, setActiveStep] = useState<number>(1);

  const handleTocClick = (id: string) => {
    setActiveSection((prev) => (prev === id ? null : id));
    setTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isVisible = (id: string) => activeSection === null || activeSection === id;

  const current = simbolos.find((s) => s.id === activeSimbolo) ?? simbolos[0];

  const pasos = [
    {
      titulo: 'Comprender el proceso',
      descripcion: 'El paso inicial es elegir y comprender el proceso que se quiere describir gráficamente. Conviene entender cuál es el propósito del flujograma y a qué público apunta.',
      preguntas: [
        '¿Cuál es el proceso que estoy representando?',
        '¿Quién va a usar este flujograma?',
        '¿Qué decisiones debe poder tomar esa persona después de leerlo?',
      ],
    },
    {
      titulo: 'Identificar los elementos',
      descripcion: 'Una vez comprendido el proceso, identifique sus pasos, los puntos de inicio y fin, las decisiones clave, y elija los símbolos adecuados para cada uno.',
      preguntas: [
        '¿Dónde empieza el proceso? ¿Dónde termina?',
        '¿Qué decisiones hay en el camino? ¿Cuáles son las opciones en cada una?',
        '¿Qué información entra y qué información sale?',
      ],
    },
    {
      titulo: 'Construcción',
      descripcion: 'Establezca paso a paso cada símbolo y cada línea conectora. Tenga en cuenta la superficie (hoja o pantalla) disponible — para procesos complejos, conviene planear el layout antes de empezar a dibujar.',
      preguntas: [
        '¿El flujo va vertical u horizontal?',
        '¿Cuáles son las ramas principales? ¿Caben en una sola página?',
        '¿Necesito conectores para saltar entre secciones?',
      ],
    },
    {
      titulo: 'Verificación',
      descripcion: 'Vuelva al inicio y recorra el flujo entero. Verifique que no existan callejones sin salida, ambigüedades ni errores procedimentales. Alguien que no conoce el proceso debe poder seguirlo sin ayuda.',
      preguntas: [
        '¿Todos los caminos llegan a un terminal de fin?',
        '¿Cada decisión tiene todas sus salidas cubiertas?',
        '¿Si le paso este diagrama a un compañero sin explicarle, lo entiende?',
      ],
    },
  ];

  return (
    <ReadingLayout course={course} reading={reading} wide>
      {/* Mobile TOC */}
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
          <p className="text-lg leading-relaxed text-brand-gray">
            Esta guía acompaña la entrega del <strong>flujograma</strong> del proyecto — el prototipo
            de papel que describe gráficamente el proceso experimental o metodológico que su equipo va
            a ejecutar. Además de ser un entregable, es la herramienta que les va a permitir detectar
            inconsistencias y callejones sin salida antes de invertir tiempo en laboratorio.
          </p>

          {isVisible('introduccion') && (
            <>
              <SectionTitle id="introduccion">¿Qué es un flujograma?</SectionTitle>
              <p>
                Un <strong>flujograma</strong> o <strong>diagrama de flujo</strong> es una herramienta
                gráfica que representa visualmente un proceso o algoritmo. Se usa ampliamente en
                informática, economía, ingeniería e incluso psicología, para organizar de manera simple
                las decisiones involucradas en un proceso.
              </p>
              <p>
                Los diagramas de flujo se construyen, por convención, mediante un conjunto de
                <strong> símbolos determinados</strong>, acompañados de texto y unidos por flechas.
                Al observar el diagrama se puede comprender el sentido específico en el cual «fluye»
                — qué cosas ocurren primero y qué cosas ocurren después, entendiendo que las últimas
                dependen siempre de las primeras.
              </p>
              <p className="text-sm italic text-brand-gray">
                El nombre <em>flujograma</em> es un neologismo creado a partir del término anglosajón
                <em> flow chart</em> o <em>flow diagram</em>, y es sinónimo de «diagrama de flujo».
              </p>
            </>
          )}

          {isVisible('caracteristicas') && (
            <>
              <SectionTitle id="caracteristicas">Características</SectionTitle>
              <p>Un diagrama de flujo se caracteriza por:</p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Sintético, secuencial, estructurado</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Gráfico compuesto por figuras geométricas y líneas, acompañadas de texto. Organiza
                    la información con un inicio y final claramente reconocibles.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Representa procesos complejos</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Su rol principal es representar de manera fácil y concreta procesos complejos,
                    describiendo la toma de decisiones y guiando visualmente a quienes lo llevan a cabo.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Más rápido de leer que un texto</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Permite captar la estructura general y las decisiones clave de un proceso en
                    segundos, donde un texto completo tomaría minutos.
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5">
                  <h4 className="font-semibold text-brand-dark text-base mb-2">Transversal a muchas disciplinas</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Se usa desde la informática y la organización industrial, hasta la psicología y el
                    diseño organizacional.
                  </p>
                </div>
              </div>
            </>
          )}

          {isVisible('tipos') && (
            <>
              <SectionTitle id="tipos">Tipos de flujograma</SectionTitle>

              <SubTitle>Flujograma lineal</SubTitle>
              <p>
                Aquellos cuyo proceso puede seguirse de manera simple y secuencial — los pasos o
                instancias se encuentran uno después del otro. Es el tipo más sencillo y rápido, pero
                abarca una cantidad de información moderada. Puede ser de tres tipos:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
                <div className="rounded-xl border border-zinc-200 p-5 text-center">
                  <div className="flex justify-center mb-2 text-brand-yellow-dark">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
                  </div>
                  <h4 className="font-semibold text-brand-dark text-base mb-1">Vertical</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">De arriba hacia abajo.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 text-center">
                  <div className="flex justify-center mb-2 text-brand-yellow-dark">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                  <h4 className="font-semibold text-brand-dark text-base mb-1">Horizontal</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">De izquierda a derecha.</p>
                </div>
                <div className="rounded-xl border border-zinc-200 p-5 text-center">
                  <div className="flex justify-center mb-2 text-brand-yellow-dark">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                  </div>
                  <h4 className="font-semibold text-brand-dark text-base mb-1">Panorámico</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">Combinación de los anteriores.</p>
                </div>
              </div>

              <SubTitle>Flujograma matricial</SubTitle>
              <p>
                Aquellos en los que se establecen visualmente puntos de conexión lógica entre los
                elementos de un proceso (características, funciones, actividades) empleando{' '}
                <strong>matrices</strong> en lugar de secuencias lineales. Son ideales cuando hay
                múltiples actores o roles involucrados, porque cada columna de la matriz corresponde
                a uno de ellos (por ejemplo: «Laboratorio → Coordinador → Proveedor → Financiera»).
              </p>

              <TipCallout>
                Para proyectos de investigación en el departamento, el <strong>flujograma vertical</strong>
                es el más común porque la secuencia experimental tiende a ser lineal. Si el proceso
                involucra varios laboratorios o roles, considere el <strong>matricial</strong>.
              </TipCallout>
            </>
          )}

          {isVisible('simbolos') && (
            <>
              <SectionTitle id="simbolos">Símbolos estándar</SectionTitle>
              <p>
                El flujograma usa un conjunto estandarizado de símbolos. Pase el cursor sobre cada uno
                para ver su descripción, o haga clic para fijarlo.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 not-prose">
                {simbolos.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSimbolo(s.id)}
                    onMouseEnter={() => setActiveSimbolo(s.id)}
                    className={`group rounded-xl border-2 p-3 transition-all text-left ${
                      activeSimbolo === s.id
                        ? 'border-brand-yellow bg-yellow-50 shadow-md'
                        : 'border-zinc-200 bg-white hover:border-brand-yellow hover:-translate-y-0.5'
                    }`}
                    aria-label={`Símbolo: ${s.nombre}`}
                  >
                    <div className="aspect-[12/7] mb-2">
                      <SymbolSVG type={s.type} />
                    </div>
                    <p className="text-xs font-semibold text-brand-dark truncate">{s.nombre}</p>
                    <p className="text-[10px] text-brand-gray truncate italic">{s.forma}</p>
                  </button>
                ))}
              </div>

              <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-24 h-14 bg-white rounded-md p-1">
                    <SymbolSVG type={current.type} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow mb-1">
                      {current.forma}
                    </p>
                    <h4 className="font-bold text-white text-lg mb-2">{current.nombre}</h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">{current.descripcion}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isVisible('proceso') && (
            <>
              <SectionTitle id="proceso">Cómo hacer un flujograma</SectionTitle>
              <p>
                Para construir un flujograma de manera simple y correcta, siga estos cuatro pasos.
                Use las pestañas para navegar entre ellos.
              </p>

              {/* Stepper */}
              <div role="tablist" aria-label="Pasos para hacer un flujograma" className="flex gap-1 my-6 not-prose flex-wrap">
                {pasos.map((_, idx) => (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={activeStep === idx + 1}
                    onClick={() => setActiveStep(idx + 1)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      activeStep === idx + 1
                        ? 'bg-brand-dark text-white'
                        : 'bg-zinc-100 text-brand-gray hover:bg-zinc-200'
                    }`}
                  >
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      activeStep === idx + 1 ? 'bg-brand-yellow text-brand-dark' : 'bg-white text-brand-dark'
                    }`}>
                      {idx + 1}
                    </span>
                    {pasos[idx].titulo}
                  </button>
                ))}
              </div>

              <div className="rounded-xl border-l-4 border-brand-yellow bg-white shadow-sm p-6 not-prose">
                <p className="text-xs font-bold uppercase tracking-widest text-brand-yellow-dark mb-2">
                  Paso {activeStep} de 4
                </p>
                <h3 className="text-xl font-bold text-brand-dark mb-3">
                  {pasos[activeStep - 1].titulo}
                </h3>
                <p className="text-brand-gray leading-relaxed mb-4">
                  {pasos[activeStep - 1].descripcion}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-brand-gray mb-2">
                  Preguntas guía
                </p>
                <ul className="space-y-1.5">
                  {pasos[activeStep - 1].preguntas.map((p, i) => (
                    <li key={i} className="text-sm text-brand-dark leading-relaxed flex items-start gap-2">
                      <span className="text-brand-yellow-dark font-bold flex-shrink-0">›</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <WarningCallout title="⚠️ Error común al construir">
                Dibujar el diagrama «en lineal» sin pensar en el layout de la hoja. En procesos
                complejos, planee primero las ramas en papel — a mano alzada — antes de empezar a
                dibujar en la herramienta digital. Si el diagrama termina siendo difícil de seguir a
                simple vista, algo quedó mal en esta etapa.
              </WarningCallout>
            </>
          )}

          {isVisible('herramientas') && (
            <>
              <SectionTitle id="herramientas">Herramientas recomendadas</SectionTitle>
              <p>
                Para construir su flujograma puede usar cualquiera de estas herramientas. Todas
                permiten exportar a PDF para la entrega.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
                <a
                  href="https://app.diagrams.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-zinc-200 p-5 hover:border-brand-yellow hover:shadow-md transition-all block"
                >
                  <h4 className="font-semibold text-brand-dark text-base mb-2 group-hover:text-brand-yellow-dark">
                    draw.io (diagrams.net) <span className="text-xs">↗</span>
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Gratuita, potente, con biblioteca completa de símbolos de flujograma. Guarda en
                    Drive, GitHub o local. La más recomendada.
                  </p>
                </a>
                <a
                  href="https://www.lucidchart.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-zinc-200 p-5 hover:border-brand-yellow hover:shadow-md transition-all block"
                >
                  <h4 className="font-semibold text-brand-dark text-base mb-2 group-hover:text-brand-yellow-dark">
                    Lucidchart <span className="text-xs">↗</span>
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Colaborativa, interfaz pulida. Versión gratuita limitada; plan estudiantil con
                    cuenta institucional.
                  </p>
                </a>
                <a
                  href="https://miro.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-zinc-200 p-5 hover:border-brand-yellow hover:shadow-md transition-all block"
                >
                  <h4 className="font-semibold text-brand-dark text-base mb-2 group-hover:text-brand-yellow-dark">
                    Miro <span className="text-xs">↗</span>
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Pizarra infinita, excelente para flujogramas colaborativos en tiempo real. Ideal
                    si el equipo trabaja en línea.
                  </p>
                </a>
                <a
                  href="https://www.canva.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-zinc-200 p-5 hover:border-brand-yellow hover:shadow-md transition-all block"
                >
                  <h4 className="font-semibold text-brand-dark text-base mb-2 group-hover:text-brand-yellow-dark">
                    Canva <span className="text-xs">↗</span>
                  </h4>
                  <p className="text-sm text-brand-gray leading-relaxed">
                    Buena opción si priorizan estética sobre precisión técnica. Biblioteca de
                    plantillas extensa.
                  </p>
                </a>
              </div>

              <InfoCallout>
                <strong>Sugerencia:</strong> para la primera versión use <strong>papel y lápiz</strong>
                — literalmente. Es la forma más rápida de iterar el layout antes de pasar a una
                herramienta digital.
              </InfoCallout>
            </>
          )}

          {isVisible('entrega') && (
            <>
              <SectionTitle id="entrega">Entrega</SectionTitle>
              <p>
                Para completar esta actividad, los estudiantes deben desarrollar el <strong>prototipo
                de papel de su proyecto</strong>, representado en un flujograma. La entrega debe
                mostrar de manera clara y evidente que se hizo un esfuerzo importante para desarrollar
                el diseño experimental en detalle.
              </p>

              <InfoCallout title="📥 Pasos de entrega">
                <ol className="list-decimal pl-5 space-y-1.5">
                  <li>Construyan el flujograma en la herramienta de su elección, siguiendo los cuatro pasos de esta guía.</li>
                  <li>Verifiquen que no hay callejones sin salida ni decisiones incompletas.</li>
                  <li>Exporten el flujograma a PDF.</li>
                  <li>Envíen el PDF al <strong>asesor principal</strong> para revisión.</li>
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

              <TipCallout title="💡 Criterio de calidad">
                Un buen flujograma es el que alguien <strong>que no trabajó en el proyecto</strong>
                puede entender sin necesidad de explicación adicional. Antes de entregar, pruébenlo
                con un compañero de otro equipo — si lo entiende, están listos.
              </TipCallout>
            </>
          )}
        </div>
      </div>
    </ReadingLayout>
  );
};

export default Flujogramas;
