import React, { useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── TOC data ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'estructura', label: 'Estructura general' },
  { id: 'bitacora-1', label: 'Bitácora 1' },
  { id: 'bitacora-2', label: 'Bitácora 2' },
  { id: 'bitacora-3', label: 'Bitácora 3' },
  { id: 'bitacora-4', label: 'Bitácora 4' },
  { id: 'formato', label: 'Formato y estilo' },
  { id: 'fuentes', label: 'Manejo de fuentes' },
  { id: 'errores', label: 'Errores comunes' },
  { id: 'tips', label: 'Tips para el éxito' },
  { id: 'preguntas', label: 'Preguntas frecuentes' },
];

/* ─── Small reusable pieces ─── */

const TipCallout: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = '💡 Idea clave',
  children,
}) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <p className="font-semibold text-brand-yellow text-sm mb-2">{title}</p>
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

/* ─── Main Component ─── */

const BitacorasDeCalculo: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'bitacoras-de-calculo');
  if (!reading) return null;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [tocOpen, setTocOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleTocClick = (id: string) => {
    setActiveSection((prev) => (prev === id ? null : id));
    setTocOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isVisible = (id: string) => activeSection === null || activeSection === id;

  const Collapsible: React.FC<{ id: string; title: string; children: React.ReactNode }> = ({
    id,
    title,
    children,
  }) => (
    <div className="my-4 not-prose">
      <button
        onClick={() => toggle(id)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
      >
        <span className="font-semibold text-brand-dark">{title}</span>
        <span className="text-brand-gray text-sm">{openSections[id] ? '−' : '+'}</span>
      </button>
      {openSections[id] && (
        <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <ReadingLayout course={course} reading={reading} wide>
      {/* ─── Mobile TOC toggle ─── */}
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
        {/* ─── Sticky TOC sidebar (desktop) ─── */}
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

        {/* ─── Main content ─── */}
        <div className="reading-prose">

          {/* ════════════════════════════════════════════════════════════ */}
          {/* INTRODUCCIÓN                                               */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('introduccion') && (<>
            <SectionTitle id="introduccion">Introducción</SectionTitle>

            <p>
              Las bitácoras de cálculo son documentos técnicos fundamentales en la práctica de la ingeniería química.
              En el contexto profesional, estas bitácoras sirven como:
            </p>

            <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Registro permanente</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Documentación del proceso de diseño que queda como referencia a lo largo de la vida del proyecto.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Documentación legal</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Base para auditorías y certificaciones en entornos regulados.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Herramienta de comunicación</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Medio de comunicación efectiva entre equipos de ingeniería multidisciplinarios.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Mejora continua</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Base para la mejora continua de procesos y la optimización del diseño.
                </p>
              </div>
            </div>

            <TipCallout>
              <p>
                En este curso, desarrollarán <strong>4 bitácoras parciales</strong> que documentarán el diseño completo
                de su planta de destilación, culminando en un documento técnico integral.
              </p>
            </TipCallout>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ESTRUCTURA GENERAL                                         */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('estructura') && (<>
            <SectionTitle id="estructura">Estructura general de una bitácora</SectionTitle>

            <p>Cada bitácora debe contener las siguientes secciones:</p>

            {/* Portada */}
            <SubTitle>Portada</SubTitle>
            <ul>
              <li>Título del proyecto</li>
              <li>Número de bitácora (1-4)</li>
              <li>Nombres completos y código de los integrantes del equipo</li>
              <li>Fecha de entrega</li>
              <li>Logos institucionales</li>
            </ul>

            {/* Resumen ejecutivo */}
            <SubTitle>Resumen ejecutivo (1 página máximo)</SubTitle>
            <ul>
              <li>Objetivo de la bitácora</li>
              <li>Alcance del diseño presentado</li>
              <li>Resultados principales</li>
              <li>Conclusiones clave</li>
            </ul>

            {/* Introducción */}
            <SubTitle>Introducción</SubTitle>
            <ul>
              <li>Contexto del proyecto</li>
              <li>Objetivos específicos de esta etapa</li>
              <li>Conexión con entregas anteriores (si aplica)</li>
            </ul>

            {/* Bases de diseño */}
            <SubTitle>Bases de diseño</SubTitle>
            <ul>
              <li>Capacidad de producción</li>
              <li>Especificaciones de materias primas</li>
              <li>Especificaciones de productos</li>
              <li>Condiciones de operación</li>
              <li>Restricciones y consideraciones especiales</li>
            </ul>

            {/* Memoria de cálculo */}
            <SubTitle>Memoria de cálculo</SubTitle>
            <ul>
              <li>Ecuaciones principales utilizadas (numeradas)</li>
              <li>Variables de entrada con sus valores y fuentes</li>
              <li>Resultados finales de cada cálculo</li>
              <li>Justificación de supuestos y decisiones de diseño</li>
              <li>Análisis de sensibilidad cuando sea relevante</li>
            </ul>

            {/* Resultados y especificaciones */}
            <SubTitle>Resultados y especificaciones</SubTitle>
            <ul>
              <li>Tablas resumen de resultados</li>
              <li>Especificaciones finales de equipos</li>
              <li>Diagramas y esquemas relevantes</li>
            </ul>

            {/* Análisis y discusión */}
            <SubTitle>Análisis y discusión</SubTitle>
            <ul>
              <li>Interpretación de resultados</li>
              <li>Comparación con valores típicos industriales</li>
              <li>Identificación de cuellos de botella</li>
              <li>Oportunidades de mejora</li>
            </ul>

            {/* Conclusiones */}
            <SubTitle>Conclusiones</SubTitle>
            <ul>
              <li>Logro de objetivos</li>
              <li>Decisiones clave de diseño</li>
              <li>Recomendaciones para siguientes etapas</li>
            </ul>

            {/* Referencias */}
            <SubTitle>Referencias</SubTitle>
            <ul>
              <li>Formato IEEE o APA consistente</li>
              <li>Todas las fuentes citadas en el texto</li>
              <li>Incluir datasheets y catálogos consultados</li>
            </ul>

            {/* Anexos */}
            <SubTitle>Anexos</SubTitle>
            <ul>
              <li>Desarrollo completo de cálculos (paso a paso)</li>
              <li>Hojas de cálculo con fórmulas visibles</li>
              <li>Código de programación documentado</li>
              <li>Iteraciones y convergencia de métodos numéricos</li>
              <li>Hojas de datos y catálogos consultados</li>
            </ul>

            <WarningCallout>
              <p>
                Los anexos <strong>no serán revisados con el mismo detalle</strong> que el cuerpo principal del documento.
                No incluyan información relevante para la bitácora en esa sección. Todo lo importante debe estar en la memoria
                de cálculo y en los resultados.
              </p>
            </WarningCallout>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* BITÁCORA 1                                                 */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('bitacora-1') && (<>
            <SectionTitle id="bitacora-1">Bitácora 1: Diagramas y definición del proceso</SectionTitle>

            <SubTitle>Objetivos</SubTitle>
            <ul>
              <li>Definir el alcance completo del proyecto</li>
              <li>Establecer las bases de diseño</li>
              <li>Presentar los diagramas de proceso</li>
            </ul>

            <SubTitle>Contenido requerido</SubTitle>

            <Collapsible id="b1-materia" title="Selección y justificación de materia prima">
              <ul className="list-disc pl-5 space-y-1">
                <li>Análisis de disponibilidad en Colombia</li>
                <li>Composición química detallada</li>
                <li>Ventajas y desventajas</li>
              </ul>
            </Collapsible>

            <Collapsible id="b1-proceso" title="Definición del proceso">
              <ul className="list-disc pl-5 space-y-1">
                <li>Descripción general del proceso</li>
                <li>Justificación de la ruta seleccionada</li>
                <li>Capacidad de producción objetivo</li>
                <li>Balance de masa preliminar</li>
              </ul>
            </Collapsible>

            <Collapsible id="b1-diagramas" title="Diagramas de ingeniería">
              <ul className="list-disc pl-5 space-y-1">
                <li>Diagrama de bloques (PBD) completo</li>
                <li>Lista de equipos principales</li>
                <li>Nomenclatura y simbología utilizada</li>
              </ul>
            </Collapsible>

            <Collapsible id="b1-plan" title="Plan de trabajo">
              <ul className="list-disc pl-5 space-y-1">
                <li>Cronograma del proyecto</li>
                <li>Distribución de responsabilidades</li>
                <li>Identificación de información faltante</li>
              </ul>
            </Collapsible>

            <SubTitle>Criterios de evaluación</SubTitle>
            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Criterio</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Claridad en la definición del proyecto</td>
                    <td className="px-4 py-2.5 text-brand-gray">25%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Calidad técnica de los diagramas</td>
                    <td className="px-4 py-2.5 text-brand-gray">30%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Justificación de decisiones</td>
                    <td className="px-4 py-2.5 text-brand-gray">25%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Presentación y formato</td>
                    <td className="px-4 py-2.5 text-brand-gray">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* BITÁCORA 2                                                 */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('bitacora-2') && (<>
            <SectionTitle id="bitacora-2">Bitácora 2: Manejo de sólidos y transporte de fluidos</SectionTitle>

            <SubTitle>Objetivos</SubTitle>
            <ul>
              <li>Diseñar el sistema de preparación de materia prima</li>
              <li>Dimensionar el sistema de transporte de fluidos</li>
              <li>Seleccionar y especificar bombas</li>
            </ul>

            <SubTitle>Contenido requerido</SubTitle>

            <Collapsible id="b2-diagramas" title="Diagramas de ingeniería">
              <p>Diagrama de flujo (PFD) completo.</p>
            </Collapsible>

            <Collapsible id="b2-solidos" title="Manejo de sólidos (si aplica al proceso)">
              <ul className="list-disc pl-5 space-y-1">
                <li>Caracterización de la materia prima sólida</li>
                <li>Distribución de tamaños objetivo</li>
                <li>Selección del tipo de molino</li>
                <li>Cálculos de potencia (Leyes de Rittinger, Kick, Bond)</li>
                <li>Especificaciones del equipo</li>
              </ul>
            </Collapsible>

            <Collapsible id="b2-tuberias" title="Sistema de tuberías">
              <ul className="list-disc pl-5 space-y-1">
                <li>Velocidades de flujo recomendadas</li>
                <li>Material de construcción</li>
                <li>Pérdidas de presión:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Pérdidas por fricción (Darcy-Weisbach)</li>
                    <li>Pérdidas por accesorios</li>
                    <li>Perfil de presiones del sistema</li>
                  </ul>
                </li>
                <li>Factor de seguridad aplicado</li>
              </ul>
            </Collapsible>

            <Collapsible id="b2-bombas" title="Selección de bombas">
              <ul className="list-disc pl-5 space-y-1">
                <li>Cálculo del cabezal total</li>
                <li>Determinación del NPSH disponible y requerido</li>
                <li>Selección de bomba de catálogo real</li>
                <li>Punto de operación en la curva</li>
                <li>Análisis de eficiencia</li>
              </ul>
            </Collapsible>

            <SubTitle>Criterios de evaluación</SubTitle>
            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Criterio</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Exactitud de cálculos</td>
                    <td className="px-4 py-2.5 text-brand-gray">35%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Uso apropiado de correlaciones</td>
                    <td className="px-4 py-2.5 text-brand-gray">20%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Selección justificada de equipos</td>
                    <td className="px-4 py-2.5 text-brand-gray">25%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Calidad de diagramas técnicos</td>
                    <td className="px-4 py-2.5 text-brand-gray">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* BITÁCORA 3                                                 */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('bitacora-3') && (<>
            <SectionTitle id="bitacora-3">Bitácora 3: Agitación, mezclado e intercambiadores</SectionTitle>

            <SubTitle>Objetivos</SubTitle>
            <ul>
              <li>Diseñar el sistema de agitación para fermentadores</li>
              <li>Dimensionar la red de intercambiadores de calor</li>
              <li>Optimizar la integración energética</li>
            </ul>

            <SubTitle>Contenido requerido</SubTitle>

            <Collapsible id="b3-agitacion" title="Sistema de agitación">
              <ul className="list-disc pl-5 space-y-1">
                <li>Volumen y geometría del fermentador</li>
                <li>Selección del tipo de impulsor</li>
                <li>Cálculo del número de Reynolds</li>
                <li>Determinación del número de potencia</li>
                <li>Potencia requerida y motor</li>
                <li>Tiempo de mezclado</li>
                <li>Consideraciones para fermentación</li>
              </ul>
            </Collapsible>

            <Collapsible id="b3-intercambiadores" title="Intercambiadores de calor">
              <ul className="list-disc pl-5 space-y-1">
                <li>Balance de energía del proceso</li>
                <li>Identificación de corrientes calientes y frías</li>
                <li>Selección del tipo de intercambiador</li>
                <li>Cálculo por método LMTD</li>
                <li>Verificación por efectividad-NTU</li>
                <li>Especificaciones finales</li>
              </ul>
            </Collapsible>

            <Collapsible id="b3-integracion" title="Integración energética">
              <ul className="list-disc pl-5 space-y-1">
                <li>Oportunidades de recuperación de calor</li>
                <li>Servicios auxiliares requeridos</li>
              </ul>
            </Collapsible>

            <Collapsible id="b3-aspen" title="Avances en el desarrollo del modelo en ASPEN">
              <p>Avances basados en lo desarrollado en la clase complementaria.</p>
            </Collapsible>

            <SubTitle>Criterios de evaluación</SubTitle>
            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Criterio</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Diseño apropiado de sistema de agitación</td>
                    <td className="px-4 py-2.5 text-brand-gray">25%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Correcta aplicación de métodos térmicos</td>
                    <td className="px-4 py-2.5 text-brand-gray">25%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Integración energética</td>
                    <td className="px-4 py-2.5 text-brand-gray">20%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Avances de ASPEN</td>
                    <td className="px-4 py-2.5 text-brand-gray">10%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Documentación técnica</td>
                    <td className="px-4 py-2.5 text-brand-gray">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* BITÁCORA 4                                                 */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('bitacora-4') && (<>
            <SectionTitle id="bitacora-4">Bitácora 4: Procesos de separación</SectionTitle>

            <SubTitle>Objetivos</SubTitle>
            <ul>
              <li>Diseñar el sistema de filtración</li>
              <li>Diseñar la torre de destilación principal</li>
              <li>Integrar todos los sistemas del proceso</li>
            </ul>

            <SubTitle>Contenido requerido</SubTitle>

            <Collapsible id="b4-filtracion" title="Sistema de filtración">
              <ul className="list-disc pl-5 space-y-1">
                <li>Selección del tipo de filtro</li>
                <li>Cálculos de área de filtración</li>
                <li>Ciclo de operación</li>
                <li>Especificaciones del equipo</li>
              </ul>
            </Collapsible>

            <Collapsible id="b4-destilacion" title="Torre de destilación">
              <ul className="list-disc pl-5 space-y-1">
                <li>Datos de equilibrio líquido-vapor</li>
                <li>Condiciones de alimentación</li>
                <li>Especificaciones de productos</li>
                <li>Método McCabe-Thiele completo</li>
                <li>Número de etapas teóricas</li>
                <li>Eficiencia y etapas reales</li>
                <li>Diseño hidráulico de platos</li>
                <li>Dimensiones de la torre</li>
              </ul>
            </Collapsible>

            <Collapsible id="b4-integracion" title="Integración del proceso">
              <ul className="list-disc pl-5 space-y-1">
                <li>PFD final completo</li>
                <li>Balance de masa global</li>
                <li>Balance de energía global</li>
                <li>Lista maestra de equipos</li>
                <li>Estimación preliminar de costos (CAPEX)</li>
              </ul>
            </Collapsible>

            <Collapsible id="b4-aspen" title="Avances en el desarrollo del modelo en ASPEN">
              <p>Avances basados en lo desarrollado en la clase complementaria.</p>
            </Collapsible>

            <SubTitle>Criterios de evaluación</SubTitle>
            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Criterio</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Peso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Complejidad del diseño de destilación</td>
                    <td className="px-4 py-2.5 text-brand-gray">30%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Integración con etapas anteriores</td>
                    <td className="px-4 py-2.5 text-brand-gray">25%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Viabilidad técnica</td>
                    <td className="px-4 py-2.5 text-brand-gray">15%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Avances de ASPEN</td>
                    <td className="px-4 py-2.5 text-brand-gray">10%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Calidad del documento</td>
                    <td className="px-4 py-2.5 text-brand-gray">20%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <InfoCallout>
              <p>
                La evaluación de la bitácora 4 pone mayor énfasis en el diseño de la torre de destilación, que
                representa el componente más complejo del proyecto.
              </p>
            </InfoCallout>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* FORMATO Y ESTILO                                           */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('formato') && (<>
            <SectionTitle id="formato">Formato y estilo</SectionTitle>

            <SubTitle>Formato del documento</SubTitle>
            <ul>
              <li>Tamaño carta (Letter)</li>
              <li>Márgenes de 2.5 cm en todos los lados</li>
              <li>Times New Roman 12</li>
              <li>Interlineado: 1.5 líneas</li>
              <li>Páginas numeradas (inferior derecha)</li>
            </ul>

            <SubTitle>Ecuaciones</SubTitle>
            <ul>
              <li>Numeradas consecutivamente: (1), (2), (3)...</li>
              <li>Centradas en la página</li>
              <li>Definir TODAS las variables después de cada ecuación</li>
              <li>Incluir unidades en la definición</li>
              <li>Las ecuaciones deben ser citadas previamente en el documento</li>
            </ul>

            <Collapsible id="fmt-ejemplo-ec" title="Ejemplo de ecuación correctamente formateada">
              <div className="bg-zinc-50 rounded-lg p-4 mt-2">
                <p className="text-center font-mono text-brand-dark mb-3">
                  Re = ρvD / μ &nbsp;&nbsp;&nbsp; (1)
                </p>
                <p className="font-semibold text-brand-dark mb-2">Donde:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Re</strong> = Número de Reynolds (adimensional)</li>
                  <li><strong>ρ</strong> = Densidad del fluido (kg/m³)</li>
                  <li><strong>v</strong> = Velocidad del fluido (m/s)</li>
                  <li><strong>D</strong> = Diámetro de la tubería (m)</li>
                  <li><strong>μ</strong> = Viscosidad dinámica del fluido (Pa·s)</li>
                </ul>
              </div>
            </Collapsible>

            <SubTitle>Figuras y tablas</SubTitle>
            <ul>
              <li>Numeradas consecutivamente</li>
              <li>Título descriptivo</li>
              <li>Fuente si no es propia</li>
              <li>Referenciadas en el texto</li>
            </ul>

            <SubTitle>Unidades</SubTitle>
            <ul>
              <li>Sistema Internacional (SI) preferentemente</li>
              <li>Consistencia en todo el documento</li>
            </ul>

            <SubTitle>Números y cifras significativas</SubTitle>
            <ul>
              <li>3-4 cifras significativas para resultados finales, siempre dependiendo de las cifras de los datos originales</li>
              <li>Notación científica para números muy grandes o pequeños</li>
            </ul>

            <SubTitle>Declaración de uso de IA generativa</SubTitle>
            <p>
              Cada entrega debe incluir una sección al final donde se declare el uso de herramientas de IA generativa,
              según lo establecido en el programa del curso (Escala AIAS). La declaración debe especificar:
            </p>
            <ul>
              <li>Herramientas utilizadas (ej. ChatGPT, Claude, Copilot)</li>
              <li>Propósito del uso (ej. generación de ideas, revisión de redacción, verificación de cálculos)</li>
              <li>Cómo se evaluaron críticamente los resultados generados por la IA</li>
            </ul>

            <SubTitle>Extensión</SubTitle>
            <WarningCallout>
              <p>
                La máxima extensión permitida es de <strong>12 páginas</strong>, sin contar los anexos. Recuerden que los
                anexos no serán revisados con el mismo detalle, así que no incluyan información relevante para la
                bitácora en esa sección.
              </p>
            </WarningCallout>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* MANEJO DE FUENTES Y DATOS                                  */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('fuentes') && (<>
            <SectionTitle id="fuentes">Manejo de fuentes y datos</SectionTitle>

            <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Fuentes confiables</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1 list-disc pl-4">
                  <li>Libros de texto reconocidos</li>
                  <li>Perry's Handbook</li>
                  <li>Artículos revisados por pares</li>
                  <li>Catálogos de fabricantes</li>
                  <li>Normas técnicas (ASME, API, etc.)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Citación de fuentes</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1 list-disc pl-4">
                  <li>Citar TODAS las correlaciones utilizadas</li>
                  <li>Indicar origen de datos termodinámicos</li>
                  <li>Referenciar catálogos consultados</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Manejo de incertidumbre</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1 list-disc pl-4">
                  <li>Indicar cuando se hacen suposiciones</li>
                  <li>Justificar valores asumidos</li>
                  <li>Análisis de sensibilidad para parámetros críticos</li>
                </ul>
              </div>
            </div>

            <TipCallout title="💡 Sobre la documentación de fuentes">
              <p>
                La documentación adecuada de fuentes no solo es una buena práctica académica, sino también una
                responsabilidad profesional que permite la verificación y reproducibilidad de los cálculos de ingeniería.
              </p>
            </TipCallout>

            <InfoCallout>
              <p>
                Recuerda que la calidad de tus fuentes afecta directamente la confiabilidad de tu diseño. Siempre
                prioriza fuentes reconocidas en la industria y la academia, y documenta completamente el origen de todos
                los datos utilizados en tus cálculos.
              </p>
            </InfoCallout>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* ERRORES COMUNES                                            */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('errores') && (<>
            <SectionTitle id="errores">Errores comunes por evitar</SectionTitle>

            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Error</th>
                    <th className="px-4 py-2.5 font-semibold text-red-500 border-b border-zinc-200">Incorrecto</th>
                    <th className="px-4 py-2.5 font-semibold text-emerald-600 border-b border-zinc-200">Correcto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-dark font-medium">Cálculos sin contexto</td>
                    <td className="px-4 py-2.5 text-brand-gray">Presentar solo números</td>
                    <td className="px-4 py-2.5 text-brand-gray">Explicar el propósito de cada cálculo</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-dark font-medium">Unidades inconsistentes</td>
                    <td className="px-4 py-2.5 text-brand-gray">Mezclar sistemas de unidades</td>
                    <td className="px-4 py-2.5 text-brand-gray">Verificar dimensionalmente en cada paso</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-dark font-medium">Resultados no realistas</td>
                    <td className="px-4 py-2.5 text-brand-gray">Velocidades de 50 m/s en tuberías</td>
                    <td className="px-4 py-2.5 text-brand-gray">Comparar con valores industriales típicos</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-dark font-medium">Falta de iteración</td>
                    <td className="px-4 py-2.5 text-brand-gray">Asumir valores sin verificar</td>
                    <td className="px-4 py-2.5 text-brand-gray">Mostrar proceso iterativo cuando aplique</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-dark font-medium">Diagramas incompletos</td>
                    <td className="px-4 py-2.5 text-brand-gray">PFD sin información de flujos</td>
                    <td className="px-4 py-2.5 text-brand-gray">Incluir toda la información relevante</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-dark font-medium">Referencias inadecuadas</td>
                    <td className="px-4 py-2.5 text-brand-gray">"Dato de internet"</td>
                    <td className="px-4 py-2.5 text-brand-gray">Fuente específica con fecha de acceso</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <WarningCallout title="⚠️ ¡Atención!">
              <p>
                Los errores más graves en las bitácoras de cálculo suelen estar relacionados con
                <strong> inconsistencias en las unidades</strong> y <strong>resultados no realistas</strong> que no son
                identificados por el equipo. Siempre verifica la coherencia física de tus resultados.
              </p>
            </WarningCallout>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* TIPS PARA EL ÉXITO                                         */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('tips') && (<>
            <SectionTitle id="tips">Tips para el éxito</SectionTitle>

            <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Antes de empezar</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1 list-disc pl-4">
                  <li>Revisar ejemplos de bitácoras profesionales</li>
                  <li>Distribuir trabajo equitativamente</li>
                  <li>Establecer formato común desde el inicio</li>
                  <li>Crear plantilla para mantener consistencia</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Durante el desarrollo</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1 list-disc pl-4">
                  <li>Documentar MIENTRAS se calcula, no después</li>
                  <li>Guardar versiones intermedias</li>
                  <li>Revisar unidades constantemente</li>
                  <li>Comparar resultados con valores esperados</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Antes de entregar</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1 list-disc pl-4">
                  <li>Revisión cruzada entre miembros del equipo</li>
                  <li>Verificar que todas las figuras/tablas estén referenciadas</li>
                  <li>Correr spell-check y revisar gramática</li>
                  <li>Imprimir y revisar formato final</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Para la retroalimentación</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1 list-disc pl-4">
                  <li>Preparar lista de dudas específicas</li>
                  <li>Llevar cálculos organizados</li>
                  <li>Identificar áreas problemáticas</li>
                  <li>Tomar notas de las sugerencias</li>
                </ul>
              </div>
            </div>

            <TipCallout>
              <p>
                La clave para una bitácora de cálculo exitosa es la <strong>organización meticulosa</strong> y la
                <strong> documentación continua</strong> durante todo el proceso de diseño, no como una tarea posterior.
              </p>
            </TipCallout>
          </>)}

          {/* ════════════════════════════════════════════════════════════ */}
          {/* PREGUNTAS FRECUENTES                                       */}
          {/* ════════════════════════════════════════════════════════════ */}
          {isVisible('preguntas') && (<>
            <SectionTitle id="preguntas">Preguntas frecuentes</SectionTitle>

            <Collapsible id="faq-excel" title="¿Puedo incluir cálculos hechos en Excel?">
              <p>
                Sí, pero deben estar explicados en el texto principal. Incluir las hojas de cálculo como anexo.
              </p>
            </Collapsible>

            <Collapsible id="faq-detalle" title="¿Qué tan detallados deben ser los cálculos?">
              <p>
                Suficientemente detallados para que otro ingeniero pueda reproducirlos sin información adicional.
              </p>
            </Collapsible>

            <Collapsible id="faq-correlaciones" title="¿Puedo usar correlaciones diferentes a las vistas en clase?">
              <p>
                Sí, siempre que estén bien justificadas y sean de fuentes confiables.
              </p>
            </Collapsible>

            <Collapsible id="faq-no-convergio" title="¿Es necesario incluir cálculos que no convergieron?">
              <p>
                Sí, brevemente, explicando por qué no funcionaron y qué alternativa se usó.
              </p>
            </Collapsible>

            <Collapsible id="faq-confidencial" title="¿Cómo manejo datos confidenciales de empresas?">
              <p>
                Indicar que son "basados en datos industriales" y citar apropiadamente.
              </p>
            </Collapsible>

            <InfoCallout title="📌 Nota importante">
              <p>
                Recuerda que estas bitácoras son una preparación para tu futuro profesional. La habilidad de documentar
                adecuadamente cálculos de ingeniería es fundamental en la industria y será evaluada en tu desempeño
                laboral.
              </p>
            </InfoCallout>
          </>)}

        </div>
      </div>
    </ReadingLayout>
  );
};

export default BitacorasDeCalculo;
