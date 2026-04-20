import React, { useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── TOC data ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'diferencias', label: 'Bitácoras vs Documento final' },
  { id: 'estructura', label: 'Estructura del documento' },
  { id: 'formato', label: 'Formato y estilo' },
  { id: 'hojas-especificacion', label: 'Hojas de especificación' },
  { id: 'evaluacion', label: 'Criterios de evaluación' },
  { id: 'errores', label: 'Errores comunes' },
  { id: 'sustentacion', label: 'Preparación para la sustentación' },
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

const HighlightCallout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="my-6 rounded-xl bg-brand-dark p-5 sm:p-6 not-prose">
    <div className="text-sm text-zinc-200 leading-relaxed font-medium">{children}</div>
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

const InformeFinal: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'informe-final');
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

          {/* ─── INTRODUCCIÓN ─── */}
          {isVisible('introduccion') && (<>
            <SectionTitle id="introduccion">Introducción</SectionTitle>
            <p>
              El documento final representa la culminación del trabajo semestral y constituye un reporte
              técnico integral del diseño de la planta de producción de alcohol. A diferencia de las
              bitácoras parciales, este documento debe presentar el proyecto como un todo coherente,
              integrando y actualizando los diseños desarrollados durante el semestre.
            </p>
            <p>
              En el contexto profesional, este tipo de documento equivale a un <strong>&quot;Design Report&quot;</strong> o{' '}
              <strong>&quot;Basis of Design Document&quot;</strong>, que sirve como referencia técnica principal para la
              construcción, operación y futuras modificaciones de una planta.
            </p>

            <HighlightCallout>
              <p className="text-base italic text-zinc-100">
                &quot;El documento final es su carta de presentación como ingenieros de proceso. Debe demostrar
                capacidad técnica, pensamiento crítico y profesionalismo en la documentación.&quot;
              </p>
            </HighlightCallout>
          </>)}

          {/* ─── DIFERENCIAS BITÁCORAS vs DOCUMENTO FINAL ─── */}
          {isVisible('diferencias') && (<>
            <SectionTitle id="diferencias">Diferencias entre bitácoras y documento final</SectionTitle>
            <p>
              Es fundamental comprender que el documento final <strong>no</strong> es simplemente la unión
              de las cuatro bitácoras. Debe ser un documento nuevo que presenta el diseño de manera
              integrada, incorporando las correcciones recibidas durante las retroalimentaciones.
            </p>

            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Aspecto</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Bitácoras</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Documento final</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray font-medium">Enfoque</td>
                    <td className="px-4 py-2.5 text-brand-gray">Diseño por secciones</td>
                    <td className="px-4 py-2.5 text-brand-gray">Integración del proceso completo</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray font-medium">Cálculos</td>
                    <td className="px-4 py-2.5 text-brand-gray">Desarrollo detallado paso a paso</td>
                    <td className="px-4 py-2.5 text-brand-gray">Resumen de resultados principales</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray font-medium">Diagramas</td>
                    <td className="px-4 py-2.5 text-brand-gray">PBD, PFD parciales</td>
                    <td className="px-4 py-2.5 text-brand-gray">PFD y P&amp;ID completos e integrados</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray font-medium">Anexos</td>
                    <td className="px-4 py-2.5 text-brand-gray">Cálculos completos de la sección</td>
                    <td className="px-4 py-2.5 text-brand-gray">Todos los cálculos del proyecto</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray font-medium">Extensión</td>
                    <td className="px-4 py-2.5 text-brand-gray">12 páginas máximo por entrega</td>
                    <td className="px-4 py-2.5 text-brand-gray">25 páginas máximo (sin anexos)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <WarningCallout>
              <p>
                El documento final NO es simplemente la unión de las cuatro bitácoras. Debe ser un documento
                nuevo que presenta el diseño de manera integrada, incorporando las correcciones recibidas
                durante las retroalimentaciones.
              </p>
            </WarningCallout>
          </>)}

          {/* ─── ESTRUCTURA DEL DOCUMENTO FINAL ─── */}
          {isVisible('estructura') && (<>
            <SectionTitle id="estructura">Estructura del documento final</SectionTitle>
            <p>
              El documento final debe contener las siguientes secciones, organizadas de forma lógica
              y coherente:
            </p>

            {/* Portada */}
            <SubTitle>Portada</SubTitle>
            <ul>
              <li>Título del proyecto</li>
              <li>Nombre de la empresa ficticia (opcional)</li>
              <li>Nombres completos y códigos de los integrantes</li>
              <li>Fecha de entrega</li>
              <li>Logos institucionales</li>
            </ul>

            {/* Resumen ejecutivo */}
            <SubTitle>Resumen ejecutivo (máximo 1 página)</SubTitle>
            <ul>
              <li>Descripción breve del proyecto</li>
              <li>Capacidad de producción y producto final</li>
              <li>Principales resultados de diseño</li>
              <li>Inversión estimada (CAPEX)</li>
              <li>Conclusiones y recomendaciones clave</li>
            </ul>

            <TipCallout>
              <p>
                El resumen ejecutivo es lo primero que leerá el evaluador. Debe ser autosuficiente:
                alguien que lea solo esta página debe entender el alcance y los resultados principales
                del proyecto.
              </p>
            </TipCallout>

            {/* Tabla de contenido */}
            <SubTitle>Tabla de contenido</SubTitle>
            <ul>
              <li>Generada automáticamente</li>
              <li>Incluir lista de figuras</li>
              <li>Incluir lista de tablas</li>
            </ul>

            {/* Secciones principales - colapsable */}
            <SubTitle>Secciones principales del cuerpo</SubTitle>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-intro')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">1. Introducción</span>
                <span className="text-brand-gray text-sm">{openSections['sec-intro'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-intro'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Contexto del proyecto</li>
                    <li>Objetivos del diseño</li>
                    <li>Alcance y limitaciones</li>
                    <li>Estructura del documento</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-bases')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">2. Bases de diseño</span>
                <span className="text-brand-gray text-sm">{openSections['sec-bases'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-bases'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Capacidad de producción</li>
                    <li>Especificaciones de materia prima (composición, disponibilidad, costo)</li>
                    <li>Especificaciones de producto (pureza, normas aplicables)</li>
                    <li>Condiciones de operación generales</li>
                    <li>Horas de operación anuales</li>
                    <li>Factores de seguridad aplicados</li>
                    <li>Normas y estándares utilizados</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-proceso')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">3. Descripción del proceso</span>
                <span className="text-brand-gray text-sm">{openSections['sec-proceso'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-proceso'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Descripción narrativa del proceso completo</li>
                    <li>Justificación de la ruta de proceso seleccionada</li>
                    <li>Condiciones de operación por sección</li>
                    <li>Variables críticas de control</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-diagramas')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">4. Diagramas de proceso</span>
                <span className="text-brand-gray text-sm">{openSections['sec-diagramas'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-diagramas'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Diagrama de bloques (PBD) final</li>
                    <li>Diagrama de flujo de proceso (PFD) completo con tablas de corrientes</li>
                    <li>Todos los diagramas deben seguir simbología ISA</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-balances')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">5. Balances de materia y energía</span>
                <span className="text-brand-gray text-sm">{openSections['sec-balances'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-balances'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Balance de masa global</li>
                    <li>Balance de masa por sección</li>
                    <li>Balance de energía global</li>
                    <li>Tabla resumen de corrientes principales</li>
                    <li>Diagrama Sankey (opcional)</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-equipos')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">6. Diseño de equipos</span>
                <span className="text-brand-gray text-sm">{openSections['sec-equipos'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-equipos'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <p className="font-medium text-brand-dark">6.1 Sistema de preparación de materia prima</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Especificaciones del molino (si aplica)</li>
                    <li>Equipos auxiliares</li>
                  </ul>
                  <p className="font-medium text-brand-dark mt-3">6.2 Sistema de transporte de fluidos</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Resumen de tuberías principales</li>
                    <li>Especificaciones de bombas</li>
                    <li>Tabla de líneas</li>
                  </ul>
                  <p className="font-medium text-brand-dark mt-3">6.3 Sistema de fermentación</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Dimensiones del fermentador</li>
                    <li>Sistema de agitación</li>
                    <li>Sistema de control de temperatura</li>
                  </ul>
                  <p className="font-medium text-brand-dark mt-3">6.4 Intercambiadores de calor</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Especificaciones de cada intercambiador</li>
                    <li>Red de integración energética</li>
                    <li>Servicios auxiliares</li>
                  </ul>
                  <p className="font-medium text-brand-dark mt-3">6.5 Sistema de separación sólido/líquido</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Especificaciones del filtro</li>
                    <li>Manejo de sólidos residuales</li>
                  </ul>
                  <p className="font-medium text-brand-dark mt-3">6.6 Sistema de destilación</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Especificaciones de la columna</li>
                    <li>Número de etapas y eficiencia</li>
                    <li>Condensador y rehervidor</li>
                    <li>Sistema de reflujo</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-lista')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">7. Lista de equipos</span>
                <span className="text-brand-gray text-sm">{openSections['sec-lista'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-lista'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Tabla maestra con todos los equipos</li>
                    <li>Incluir: tag, descripción, material, dimensiones principales, capacidad, potencia</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-servicios')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">8. Servicios auxiliares</span>
                <span className="text-brand-gray text-sm">{openSections['sec-servicios'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-servicios'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Requerimientos de vapor</li>
                    <li>Requerimientos de agua de enfriamiento</li>
                    <li>Requerimientos eléctricos</li>
                    <li>Tratamiento de efluentes</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-costos')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">9. Estimación de costos</span>
                <span className="text-brand-gray text-sm">{openSections['sec-costos'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-costos'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Metodología utilizada (factorial, correlaciones)</li>
                    <li>Costo de equipos principales</li>
                    <li>Factor de Lang o similar</li>
                    <li>CAPEX total estimado</li>
                    <li>Limitaciones de la estimación</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-aspen')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">10. Simulación en ASPEN</span>
                <span className="text-brand-gray text-sm">{openSections['sec-aspen'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-aspen'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Descripción del modelo</li>
                    <li>Paquete termodinámico seleccionado y justificación</li>
                    <li>Comparación de resultados: cálculos manuales vs. simulación</li>
                    <li>Capturas de pantalla relevantes</li>
                    <li>Análisis de sensibilidad (si aplica)</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-discusion')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">11. Análisis y discusión</span>
                <span className="text-brand-gray text-sm">{openSections['sec-discusion'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-discusion'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Evaluación del cumplimiento de especificaciones</li>
                    <li>Comparación con procesos industriales similares</li>
                    <li>Identificación de cuellos de botella</li>
                    <li>Oportunidades de mejora</li>
                    <li>Consideraciones de seguridad</li>
                    <li>Aspectos ambientales</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('sec-conclusiones')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">12. Conclusiones y recomendaciones</span>
                <span className="text-brand-gray text-sm">{openSections['sec-conclusiones'] ? '−' : '+'}</span>
              </button>
              {openSections['sec-conclusiones'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Resumen de logros del diseño</li>
                    <li>Decisiones críticas tomadas</li>
                    <li>Recomendaciones para etapas posteriores</li>
                    <li>Áreas que requieren mayor desarrollo</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Referencias y Anexos */}
            <SubTitle>Referencias</SubTitle>
            <ul>
              <li>Formato IEEE o APA consistente</li>
              <li>Mínimo 15 referencias técnicas</li>
              <li>Incluir libros, artículos, normas, catálogos</li>
            </ul>

            <SubTitle>Anexos</SubTitle>
            <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Anexo A</h4>
                <p className="text-sm text-brand-gray leading-relaxed">Memoria de cálculo detallada por sección</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Anexo B</h4>
                <p className="text-sm text-brand-gray leading-relaxed">Hojas de especificación de equipos</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Anexo C</h4>
                <p className="text-sm text-brand-gray leading-relaxed">Archivos de simulación (descripción)</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Anexo D</h4>
                <p className="text-sm text-brand-gray leading-relaxed">Catálogos y datasheets consultados</p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Anexo E</h4>
                <p className="text-sm text-brand-gray leading-relaxed">Declaración de uso de IA generativa</p>
              </div>
            </div>
          </>)}

          {/* ─── FORMATO Y ESTILO ─── */}
          {isVisible('formato') && (<>
            <SectionTitle id="formato">Formato y estilo</SectionTitle>

            <SubTitle>Formato del documento</SubTitle>
            <ul>
              <li>Tamaño carta (Letter)</li>
              <li>Márgenes de 2.5 cm en todos los lados</li>
              <li>Fuente Times New Roman 12</li>
              <li>Interlineado 1.5 líneas</li>
              <li>Páginas numeradas (inferior derecha)</li>
              <li>Encabezado con título del proyecto y número de página</li>
            </ul>

            <SubTitle>Extensión</SubTitle>
            <ul>
              <li>Máximo <strong>25 páginas</strong> para el cuerpo del documento (sin anexos)</li>
              <li>Los anexos no tienen límite de extensión pero deben ser pertinentes</li>
            </ul>

            <SubTitle>Ecuaciones</SubTitle>
            <ul>
              <li>Numeradas consecutivamente en todo el documento</li>
              <li>En el cuerpo principal incluir solo las ecuaciones fundamentales</li>
              <li>Desarrollo detallado en anexos</li>
            </ul>

            <SubTitle>Figuras y tablas</SubTitle>
            <ul>
              <li>Numeradas por sección (ej. Figura 6.1, Tabla 4.2)</li>
              <li>Título descriptivo</li>
              <li>Fuente si no es propia</li>
              <li>Calidad suficiente para lectura clara</li>
            </ul>

            <SubTitle>Diagramas de ingeniería</SubTitle>
            <ul>
              <li>Tamaño mínimo A3 o que permita lectura clara</li>
              <li>Pueden incluirse como páginas desplegables o en anexos</li>
              <li>Deben seguir estándares ISA</li>
              <li>Incluir leyenda de simbología</li>
            </ul>

            <SubTitle>Declaración de uso de IA generativa</SubTitle>
            <ul>
              <li>Incluir como último anexo</li>
              <li>Seguir los lineamientos de la Escala AIAS (Nivel 3)</li>
              <li>Especificar: herramientas utilizadas, propósito del uso, evaluación crítica de resultados</li>
            </ul>

            <InfoCallout title="📌 Sobre la declaración de IA">
              <p>
                El uso de herramientas de IA generativa está permitido bajo el Nivel 3 de la escala AIAS.
                Lo importante es la transparencia: documentar qué herramientas usaron, para qué las usaron
                y cómo evaluaron críticamente los resultados obtenidos.
              </p>
            </InfoCallout>
          </>)}

          {/* ─── HOJAS DE ESPECIFICACIÓN ─── */}
          {isVisible('hojas-especificacion') && (<>
            <SectionTitle id="hojas-especificacion">Hojas de especificación de equipos</SectionTitle>
            <p>
              Cada equipo principal debe tener una hoja de especificación que incluya la siguiente
              información:
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 not-prose">
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Información general</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1">
                  <li>Tag del equipo</li>
                  <li>Servicio/función</li>
                  <li>Cantidad</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Condiciones de operación</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1">
                  <li>Temperatura de diseño y operación</li>
                  <li>Presión de diseño y operación</li>
                  <li>Fluido manejado</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Características del equipo</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1">
                  <li>Tipo y modelo</li>
                  <li>Dimensiones principales</li>
                  <li>Material de construcción</li>
                  <li>Capacidad/potencia</li>
                  <li>Fabricante sugerido (si aplica)</li>
                </ul>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5 sm:col-span-2 lg:col-span-3">
                <h4 className="font-semibold text-brand-dark text-base mb-2">Notas adicionales</h4>
                <ul className="text-sm text-brand-gray leading-relaxed space-y-1">
                  <li>Consideraciones especiales</li>
                  <li>Referencias a cálculos</li>
                </ul>
              </div>
            </div>

            <TipCallout>
              <p>
                Las hojas de especificación son documentos estándar de la industria. Un buen ejercicio es
                buscar plantillas reales de &quot;equipment datasheet&quot; para usar como referencia de formato.
              </p>
            </TipCallout>
          </>)}

          {/* ─── CRITERIOS DE EVALUACIÓN ─── */}
          {isVisible('evaluacion') && (<>
            <SectionTitle id="evaluacion">Criterios de evaluación</SectionTitle>
            <p>
              El documento final será evaluado de acuerdo con los siguientes criterios y ponderaciones:
            </p>

            <div className="overflow-x-auto my-6 not-prose">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-zinc-50 text-left">
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Criterio</th>
                    <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200 text-right">Porcentaje</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Integración y coherencia del diseño</td>
                    <td className="px-4 py-2.5 text-brand-gray text-right font-medium">20%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Calidad técnica de los cálculos</td>
                    <td className="px-4 py-2.5 text-brand-gray text-right font-medium">20%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Diagramas de ingeniería (PFD, P&amp;ID)</td>
                    <td className="px-4 py-2.5 text-brand-gray text-right font-medium">15%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Simulación en ASPEN y validación</td>
                    <td className="px-4 py-2.5 text-brand-gray text-right font-medium">15%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Análisis crítico y discusión</td>
                    <td className="px-4 py-2.5 text-brand-gray text-right font-medium">10%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Estimación de costos</td>
                    <td className="px-4 py-2.5 text-brand-gray text-right font-medium">10%</td>
                  </tr>
                  <tr className="border-b border-zinc-100">
                    <td className="px-4 py-2.5 text-brand-gray">Presentación, formato y redacción</td>
                    <td className="px-4 py-2.5 text-brand-gray text-right font-medium">10%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <TipCallout title="💡 Sobre la distribución">
              <p>
                Noten que <strong>integración y coherencia</strong> y <strong>calidad técnica</strong> suman
                el 40% de la nota. El documento final se trata fundamentalmente de demostrar que el proceso
                funciona como un todo, no como partes aisladas.
              </p>
            </TipCallout>
          </>)}

          {/* ─── ERRORES COMUNES ─── */}
          {isVisible('errores') && (<>
            <SectionTitle id="errores">Errores comunes por evitar</SectionTitle>

            <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-red-600 text-base mb-2">Falta de integración</h4>
                <p className="text-sm text-brand-gray leading-relaxed mb-2">
                  <span className="text-red-500 font-medium">Error:</span> Copiar y pegar secciones de bitácoras sin actualizar.
                </p>
                <p className="text-sm text-brand-gray leading-relaxed">
                  <span className="text-emerald-600 font-medium">Solución:</span> Reescribir con visión integrada del proceso.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-red-600 text-base mb-2">Inconsistencias entre secciones</h4>
                <p className="text-sm text-brand-gray leading-relaxed mb-2">
                  <span className="text-red-500 font-medium">Error:</span> Flujos diferentes en PFD y balances.
                </p>
                <p className="text-sm text-brand-gray leading-relaxed">
                  <span className="text-emerald-600 font-medium">Solución:</span> Verificar coherencia de datos en todo el documento.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-red-600 text-base mb-2">Diagramas incompletos</h4>
                <p className="text-sm text-brand-gray leading-relaxed mb-2">
                  <span className="text-red-500 font-medium">Error:</span> PFD sin tabla de corrientes.
                </p>
                <p className="text-sm text-brand-gray leading-relaxed">
                  <span className="text-emerald-600 font-medium">Solución:</span> Incluir toda la información requerida por estándares.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-red-600 text-base mb-2">Ignorar retroalimentación</h4>
                <p className="text-sm text-brand-gray leading-relaxed mb-2">
                  <span className="text-red-500 font-medium">Error:</span> Mantener errores señalados en bitácoras.
                </p>
                <p className="text-sm text-brand-gray leading-relaxed">
                  <span className="text-emerald-600 font-medium">Solución:</span> Incorporar todas las correcciones recibidas.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-red-600 text-base mb-2">Simulación desconectada</h4>
                <p className="text-sm text-brand-gray leading-relaxed mb-2">
                  <span className="text-red-500 font-medium">Error:</span> Resultados de ASPEN sin análisis comparativo.
                </p>
                <p className="text-sm text-brand-gray leading-relaxed">
                  <span className="text-emerald-600 font-medium">Solución:</span> Discutir diferencias entre cálculos manuales y simulación.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 p-5">
                <h4 className="font-semibold text-red-600 text-base mb-2">Costos sin sustento</h4>
                <p className="text-sm text-brand-gray leading-relaxed mb-2">
                  <span className="text-red-500 font-medium">Error:</span> Números sin metodología clara.
                </p>
                <p className="text-sm text-brand-gray leading-relaxed">
                  <span className="text-emerald-600 font-medium">Solución:</span> Documentar fuentes y método de estimación.
                </p>
              </div>
            </div>

            <WarningCallout title="⚠️ El error más costoso">
              <p>
                El error más frecuente y costoso es <strong>no integrar</strong>. Si el documento final lee como
                cuatro bitácoras pegadas, la nota de &quot;Integración y coherencia del diseño&quot; (20%) se verá
                severamente afectada. Dediquen tiempo a reescribir cada sección pensando en el proceso completo.
              </p>
            </WarningCallout>
          </>)}

          {/* ─── PREPARACIÓN PARA LA SUSTENTACIÓN ─── */}
          {isVisible('sustentacion') && (<>
            <SectionTitle id="sustentacion">Preparación para la sustentación</SectionTitle>
            <p>
              El documento final se complementa con una presentación oral tipo póster. Algunas
              recomendaciones:
            </p>
            <ul>
              <li>Conocer <strong>todos</strong> los aspectos del proyecto, no solo la sección que cada quien desarrolló</li>
              <li>Preparar respuestas para preguntas típicas sobre decisiones de diseño</li>
              <li>Tener claridad sobre las limitaciones y supuestos del diseño</li>
              <li>Poder explicar diferencias entre cálculos manuales y simulación</li>
              <li>Dominar los órdenes de magnitud de las variables principales</li>
            </ul>

            <InfoCallout title="📌 Sobre la sustentación">
              <p>
                Durante la sustentación se evaluará que <strong>todos</strong> los miembros del equipo dominen
                el proyecto completo. No es suficiente conocer solo &quot;tu parte&quot;. Cada persona debe ser
                capaz de responder preguntas sobre cualquier sección del diseño.
              </p>
            </InfoCallout>
          </>)}

          {/* ─── PREGUNTAS FRECUENTES ─── */}
          {isVisible('preguntas') && (<>
            <SectionTitle id="preguntas">Preguntas frecuentes</SectionTitle>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('faq-calculos')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">¿Debo incluir todos los cálculos de las bitácoras?</span>
                <span className="text-brand-gray text-sm">{openSections['faq-calculos'] ? '−' : '+'}</span>
              </button>
              {openSections['faq-calculos'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <p>
                    En el cuerpo del documento solo los resultados principales. El desarrollo detallado va en
                    anexos, actualizado según las correcciones recibidas.
                  </p>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('faq-cambios')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">¿Puedo cambiar decisiones de diseño respecto a las bitácoras?</span>
                <span className="text-brand-gray text-sm">{openSections['faq-cambios'] ? '−' : '+'}</span>
              </button>
              {openSections['faq-cambios'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <p>
                    Sí, siempre que esté justificado. El documento final debe presentar la mejor versión del diseño.
                  </p>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('faq-pfd')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">¿Qué nivel de detalle debe tener el PFD?</span>
                <span className="text-brand-gray text-sm">{openSections['faq-pfd'] ? '−' : '+'}</span>
              </button>
              {openSections['faq-pfd'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <p>
                    Debe incluir todos los equipos principales con sus tags, las corrientes numeradas con sus
                    condiciones de operación (temperatura, presión, flujo), y una tabla de corrientes completa.
                    También deben mostrarse los servicios auxiliares (vapor, agua de enfriamiento) y los lazos
                    de control principales de manera simplificada.
                  </p>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('faq-aspen')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">¿Cómo presento los resultados de ASPEN?</span>
                <span className="text-brand-gray text-sm">{openSections['faq-aspen'] ? '−' : '+'}</span>
              </button>
              {openSections['faq-aspen'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <p>
                    Incluir capturas de pantalla del flowsheet, tablas de resultados principales y una
                    comparación cuantitativa con los cálculos manuales.
                  </p>
                </div>
              )}
            </div>

            <div className="my-4 not-prose">
              <button
                onClick={() => toggle('faq-economico')}
                className="w-full flex items-center justify-between py-3 px-4 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition-colors text-left"
              >
                <span className="font-semibold text-brand-dark">¿Es obligatorio el análisis económico?</span>
                <span className="text-brand-gray text-sm">{openSections['faq-economico'] ? '−' : '+'}</span>
              </button>
              {openSections['faq-economico'] && (
                <div className="mt-3 pl-4 border-l-2 border-zinc-200 space-y-3 text-sm leading-relaxed text-brand-gray">
                  <p>
                    Sí, aunque sea una estimación de orden de magnitud (±30-50%). Utilizar metodologías
                    reconocidas como factores de Lang o correlaciones de Turton.
                  </p>
                </div>
              )}
            </div>
          </>)}

        </div>
      </div>
    </ReadingLayout>
  );
};

export default InformeFinal;
