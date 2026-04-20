import React, { useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── TOC data ─── */
const tocItems = [
  { id: 'fundamentos', label: 'Fundamentos' },
  { id: 'aristoteles', label: 'Proyecto Aristóteles' },
  { id: 'bienestar', label: 'Bienestar' },
  { id: 'organizacion', label: 'Organización' },
  { id: 'normas', label: 'Normas' },
  { id: 'seguridad', label: 'Seguridad psicológica' },
  { id: 'conflictos', label: 'Resolución de conflictos' },
  { id: 'roles', label: 'Roles' },
  { id: 'evaluacion', label: 'Matriz de evaluación' },
  { id: 'entregables', label: 'Entregables' },
  { id: 'documentacion', label: 'Documentación' },
  { id: 'integracion', label: 'Integración profesional' },
  { id: 'reflexion', label: 'Reflexión final' },
  { id: 'plantillas', label: 'Plantillas' },
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

const TrabajoEnEquipo: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'trabajo-en-equipo');
  if (!reading) return null;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const toggle = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const [tocOpen, setTocOpen] = useState(false);

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
          <span>Contenido</span>
          <span className="text-brand-gray">{tocOpen ? '−' : '+'}</span>
        </button>
        {tocOpen && (
          <nav className="mt-1 rounded-lg bg-white border border-zinc-200 shadow-lg p-3 space-y-1">
            {tocItems.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                onClick={() => setTocOpen(false)}
                className="block py-1 px-2 text-sm text-brand-gray hover:text-brand-dark hover:bg-zinc-50 rounded transition-colors"
              >
                {t.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* ─── Sticky TOC sidebar (desktop) ─── */}
        <nav className="hidden lg:block">
          <div className="sticky top-28 space-y-1.5 text-sm text-brand-gray">
            {tocItems.map((t) => (
              <a
                key={t.id}
                href={`#${t.id}`}
                className="block py-1 hover:text-brand-dark transition-colors"
              >
                {t.label}
              </a>
            ))}
          </div>
        </nav>

        {/* ─── Main content ─── */}
        <div className="reading-prose">

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 1 — FUNDAMENTOS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="fundamentos">1. Fundamentos del trabajo en equipo: definición y diferenciación</SectionTitle>

          <p>
            En los proyectos de ingeniería, el trabajo en equipo no es opcional. Ninguna planta química se diseña, construye u opera por una sola persona. Sin embargo, reunir personas talentosas en un mismo grupo no garantiza resultados superiores. Existe una diferencia fundamental entre un <strong>grupo de trabajo</strong> y un <strong>equipo</strong>, y comprender esta distinción es el primer paso para construir una colaboración efectiva.
          </p>

          {/* Grupo vs Equipo — 2-column cards */}
          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Grupo de trabajo</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Menor interdependencia entre miembros</li>
                <li>Jerarquía organizacional predefinida</li>
                <li>Se reúne para compartir información</li>
                <li>Responsabilidad individual por resultados</li>
                <li>Éxito medido por desempeño individual</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5 border-emerald-200 bg-emerald-50/30">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Equipo</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Alta interdependencia entre miembros</li>
                <li>Planifica trabajo conjunto de manera colaborativa</li>
                <li>Resuelve problemas colaborativamente</li>
                <li>Toma decisiones de forma consensuada</li>
                <li>Responsabilidad compartida por resultados</li>
                <li>Éxito medido por resultados del equipo</li>
              </ul>
            </div>
          </div>

          <SubTitle>Cuatro tipos de interdependencia</SubTitle>

          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">De objetivos</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Todos los miembros comparten las mismas metas finales. El logro del objetivo depende del aporte coordinado de cada integrante.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">De recursos</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Cada miembro aporta conocimientos y habilidades específicas que complementan las del resto del equipo.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">De tareas</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                El trabajo de cada miembro afecta y depende del trabajo de los demás. Las contribuciones individuales están entrelazadas.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">De reconocimiento</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                El éxito o fracaso es atribuible al equipo en su conjunto, no a individuos aislados.
              </p>
            </div>
          </div>

          <TipCallout>
            <p>
              Esta interdependencia positiva es el fundamento sobre el cual se construyen los demás aspectos del trabajo en equipo efectivo. Sin ella, no importa cuán talentosos sean los miembros individuales, el resultado colectivo siempre estará por debajo del potencial del grupo.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2 — PROYECTO ARISTÓTELES
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="aristoteles">2. El Proyecto Aristóteles: la ciencia detrás de los equipos efectivos</SectionTitle>

          <p>
            En 2012, Google lanzó el <strong>Proyecto Aristóteles</strong>, un estudio que durante dos años analizó más de 180 equipos internos, realizó más de 200 entrevistas y evaluó más de 250 atributos. El objetivo era responder una pregunta aparentemente simple: <em>¿qué hace que un equipo sea efectivo?</em>
          </p>
          <p>
            La conclusión fue contraintuitiva: la composición del equipo — quiénes son sus miembros — importa mucho menos que <strong>cómo interactúan</strong>. Equipos con perfiles aparentemente perfectos fracasaban, mientras que otros aparentemente dispares producían resultados excepcionales. La clave estaba en las <strong>normas de equipo</strong> (<em>team norms</em>): tradiciones, estándares de comportamiento y reglas que gobiernan la convivencia.
          </p>

          <blockquote className="my-6 border-l-4 border-zinc-300 pl-4 italic text-brand-gray">
            &ldquo;No encontramos evidencia de que la composición del equipo (combinación de rasgos de personalidad, habilidades o antecedentes) impacte significativamente en la efectividad del equipo... Lo que más importa es cómo los miembros del equipo interactúan, estructuran su trabajo y ven sus contribuciones.&rdquo;
          </blockquote>

          <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg not-prose">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/v2PaZ8Nl2T4"
              title="Re:Work — The five keys to a successful Google team"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <p>
            El estudio identificó cuatro características que distinguen a los equipos de alto rendimiento:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">1. Confiabilidad</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Los miembros cumplen sus tareas a tiempo y satisfacen las expectativas establecidas. Representa el compromiso, primer paso para un equipo exitoso y base fundamental para la cooperación.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">2. Estructura y claridad</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Objetivos claramente definidos y roles bien delimitados. Los miembros comprenden las expectativas del proyecto y los procesos para satisfacerlas.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">3. Propósito</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                El trabajo tiene un significado personal para cada miembro. Puede variar: éxito del equipo, calificación, interés científico, autoexpresión.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">4. Seguridad psicológica</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Los miembros se sienten seguros tomando riesgos y mostrando vulnerabilidad sin temor a consecuencias negativas. Permite la comunicación abierta y la cooperación genuina.
              </p>
            </div>
          </div>

          <TipCallout>
            <p>
              La aplicación consciente de estos principios aumenta significativamente la probabilidad de conformar un equipo que no solo cumpla con los objetivos académicos, sino que también proporcione una experiencia formativa valiosa para la futura vida profesional.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 3 — BIENESTAR
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="bienestar">3. Bienestar del equipo: la base del rendimiento sostenible</SectionTitle>

          <p>
            El bienestar constituye un pilar fundamental para el rendimiento sostenible, especialmente en proyectos académicos de alta exigencia. La empatía no es solo cordialidad, sino un elemento estratégico para la cohesión y la productividad del equipo.
          </p>

          <SubTitle>Tres dimensiones del bienestar</SubTitle>

          <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Bienestar emocional</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Ambiente donde todos se sientan valorados y emocionalmente seguros. Incluye la validación de preocupaciones, la celebración de logros y el apoyo durante períodos de estrés.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Bienestar físico</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Atención a la fatiga por sobrecarga, condiciones de salud y necesidades específicas de cada miembro. Ajustes razonables en la distribución de tareas cuando sea necesario.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Bienestar social</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Calidad de las relaciones interpersonales dentro del equipo. Integración de todos los miembros, prevención del aislamiento y construcción de un sentido de pertenencia.
              </p>
            </div>
          </div>

          <Collapsible id="practicas-desafiantes" title="Prácticas para situaciones desafiantes">
            <ul className="space-y-2 list-disc list-inside">
              <li>Protocolo claro para comunicar ausencias por enfermedad o situaciones personales graves.</li>
              <li>Sistema de &ldquo;compañero de respaldo&rdquo; donde cada miembro tiene un par designado que puede asumir temporalmente sus responsabilidades en caso de emergencia.</li>
              <li>Mecanismos para redistribuir equitativamente la carga de trabajo cuando algún miembro atraviese dificultades temporales.</li>
              <li>Plataformas digitales para mantener informados a quienes no puedan asistir presencialmente.</li>
            </ul>
          </Collapsible>

          <Collapsible id="practicas-reconocimiento" title="Prácticas de reconocimiento y celebración">
            <ul className="space-y-2 list-disc list-inside">
              <li>Reservar espacio al inicio o final de cada reunión para reconocer logros individuales o colectivos.</li>
              <li>Sistema rotativo donde cada semana un miembro diferente reciba retroalimentación positiva específica sobre sus contribuciones.</li>
              <li>Celebrar hitos importantes del proyecto con actividades breves pero significativas.</li>
              <li>Documentar los éxitos del equipo para construir un sentido de logro compartido.</li>
            </ul>
          </Collapsible>

          <TipCallout>
            <p>
              El bienestar no debe considerarse un elemento secundario o un &ldquo;lujo&rdquo;, sino un componente esencial para la sostenibilidad del equipo. Los equipos que priorizan el bienestar demuestran mayor resiliencia, mejor comunicación y resultados académicos superiores a largo plazo.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 4 — ORGANIZACIÓN METODOLÓGICA
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="organizacion">4. Organización metodológica del trabajo en equipo</SectionTitle>

          <p>
            La organización metodológica constituye el esqueleto operativo que permite al equipo funcionar de manera eficiente y predecible. Sin estructura, la buena intención se diluye.
          </p>

          <SubTitle>Frecuencia y estructura de reuniones</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Tipo</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Duración</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Reunión semanal de seguimiento</td>
                  <td className="px-4 py-2.5 text-brand-gray">60–90 min</td>
                  <td className="px-4 py-2.5 text-brand-gray">Revisar avances, resolver bloqueantes, asignar nuevas tareas. Día y hora fijos.</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Sesiones técnicas específicas</td>
                  <td className="px-4 py-2.5 text-brand-gray">Variable</td>
                  <td className="px-4 py-2.5 text-brand-gray">Resolver problemas técnicos concretos. Participan los miembros directamente involucrados.</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Revisión pre-entrega</td>
                  <td className="px-4 py-2.5 text-brand-gray">120 min</td>
                  <td className="px-4 py-2.5 text-brand-gray">2–3 días antes de cada entrega. Verificar completitud, coherencia y calidad. Todo el equipo.</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Retrospectiva</td>
                  <td className="px-4 py-2.5 text-brand-gray">60 min</td>
                  <td className="px-4 py-2.5 text-brand-gray">Después de cada hito: analizar qué funcionó bien, qué puede mejorar, ajustar procesos.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubTitle>Herramientas y canales de comunicación</SubTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Mensajería instantánea</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Comunicaciones rápidas, coordinación logística y alertas. WhatsApp, Telegram, Teams.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Plataforma de gestión de proyectos</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Seguimiento de tareas, plazos y responsabilidades. Trello, Asana, Notion, Planner.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Repositorio de documentos</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Almacenar y versionar entregables, referencias y datos. Google Drive, OneDrive, GitHub.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Plataforma de videoconferencia</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Reuniones virtuales cuando no sea posible la presencialidad. Zoom, Teams, Google Meet.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Tablero de visualización</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Lluvia de ideas y organización visual de información. Miro, Mural, Lucidchart.
              </p>
            </div>
          </div>

          <TipCallout title="💡 Recomendación">
            <p>
              Se recomienda designar un responsable de seguimiento metodológico (rol de Scrum Master o Coordinador) que vele por el cumplimiento de los procesos acordados, especialmente durante las primeras semanas hasta que se conviertan en hábitos del equipo.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 5 — NORMAS Y COMPROMISOS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="normas">5. Definición de normas y compromisos de equipo</SectionTitle>

          <p>
            Las normas constituyen el contrato social que regula la interacción del equipo. Representan acuerdos explícitos sobre comportamientos esperados, estándares de calidad y procedimientos operativos. Su definición clara y consensuada es fundamental para prevenir conflictos y establecer expectativas compartidas.
          </p>

          <SubTitle>Categorías de normas</SubTitle>

          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Temporales</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Plazos, puntualidad, gestión del tiempo. Horarios de reuniones, margen de tiempo para entregas internas, protocolos para notificar retrasos.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Calidad</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Estándares mínimos para entregables aceptables. Formato de documentos, nivel de detalle en cálculos, criterios de validación experimental.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Comunicación</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Protocolos para intercambio de información. Tiempos de respuesta, canales para diferentes tipos de mensajes, estructura de actas.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Interpersonales</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Directrices para interacción respetuosa. Escucha activa, valoración de perspectivas, comunicación asertiva de desacuerdos.
              </p>
            </div>
          </div>

          <SubTitle>Características de normas efectivas</SubTitle>

          <div className="flex flex-wrap gap-2 my-4 not-prose">
            {['Específicas', 'Medibles', 'Consensuadas', 'Realistas', 'Relevantes'].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full bg-zinc-100 text-brand-dark text-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>

          <TipCallout>
            <p>
              Las normas deben documentarse formalmente en el Contrato de Equipo, revisarse periódicamente y actualizarse según la evolución de las necesidades del proyecto. Cada norma debe incluir indicadores observables que faciliten su evaluación posterior.
            </p>
          </TipCallout>

          <SubTitle>Ejemplos de normas con indicadores</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Norma</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Indicador observable</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Puntualidad en reuniones</td>
                  <td className="px-4 py-2.5 text-brand-gray">Asistencia dentro de los 5 minutos posteriores a la hora acordada en &ge;90% de las reuniones</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Comunicación de avances</td>
                  <td className="px-4 py-2.5 text-brand-gray">Actualización semanal del estado de tareas asignadas en la plataforma de gestión antes del viernes a las 18:00</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Calidad técnica</td>
                  <td className="px-4 py-2.5 text-brand-gray">Documentos con referencias bibliográficas apropiadas y cálculos verificables mediante procedimiento estandarizado</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Retroalimentación constructiva</td>
                  <td className="px-4 py-2.5 text-brand-gray">Comentarios que incluyen aspectos positivos y oportunidades de mejora específicas, nunca dirigidos a la persona sino al trabajo</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Seguridad en laboratorio</td>
                  <td className="px-4 py-2.5 text-brand-gray">100% de cumplimiento de protocolos de seguridad establecidos y reporte inmediato de cualquier incidente</td>
                </tr>
              </tbody>
            </table>
          </div>

          <WarningCallout>
            <p>
              La simple definición de normas no garantiza su cumplimiento. Es fundamental establecer mecanismos de seguimiento regular y procedimientos claros para abordar desviaciones.
            </p>
          </WarningCallout>

          {/* 5b — Normas efectivas para equipos de ingeniería */}
          <SubTitle>Normas efectivas para equipos de ingeniería</SubTitle>

          <p>
            Las normas más efectivas surgen de la reflexión colectiva sobre las necesidades específicas del proyecto y las fortalezas y áreas de mejora del equipo.
          </p>

          <div className="flex flex-wrap gap-2 my-4 not-prose">
            {['Verificables', 'Relevantes', 'Documentadas', 'Específicas', 'Consensuadas'].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>

          <Collapsible id="normas-por-categoria" title="Ejemplos de normas por categoría">
            <div className="space-y-5">
              <div>
                <p className="font-semibold text-brand-dark mb-2">Puntualidad y preparación</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Norma:</strong> Llegamos 5 minutos antes a todas las reuniones programadas. <br /><span className="text-xs text-zinc-500">Indicador: Registro de asistencia con hora de ingreso.</span></li>
                  <li><strong>Norma:</strong> Revisamos todos los materiales previos antes de cada reunión. <br /><span className="text-xs text-zinc-500">Indicador: Capacidad para participar activamente sin requerir contextualización.</span></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-brand-dark mb-2">Calidad y rigor técnico</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Norma:</strong> Todo entregable interno debe pasar checklist de calidad antes de compartirse. <br /><span className="text-xs text-zinc-500">Indicador: Documento de verificación con criterios específicos completado.</span></li>
                  <li><strong>Norma:</strong> Los cálculos incluyen unidades, referencias y análisis de sensibilidad. <br /><span className="text-xs text-zinc-500">Indicador: Revisión por pares confirma cumplimiento.</span></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-brand-dark mb-2">Comunicación</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Norma:</strong> Respondemos mensajes dentro de las 12 horas en días hábiles. <br /><span className="text-xs text-zinc-500">Indicador: Tiempo de respuesta en canales oficiales.</span></li>
                  <li><strong>Norma:</strong> Las críticas se dirigen al trabajo, nunca a la persona. <br /><span className="text-xs text-zinc-500">Indicador: Uso de formulaciones específicas para retroalimentación constructiva.</span></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-brand-dark mb-2">Gestión de tareas</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>Norma:</strong> Actualizamos el estado de nuestras tareas en la plataforma cada 48 horas. <br /><span className="text-xs text-zinc-500">Indicador: Registro de fecha de última actualización.</span></li>
                  <li><strong>Norma:</strong> Comunicamos inmediatamente si anticipamos un retraso en un entregable. <br /><span className="text-xs text-zinc-500">Indicador: Notificaciones proactivas al menos 24 horas antes del plazo.</span></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-brand-dark mb-2">Normas específicas para POU</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><strong>24h:</strong> Publicación de actas y actualización de repositorios dentro de las 24 horas posteriores a cada reunión o actividad.</li>
                  <li><strong>48h:</strong> Entrega de documentos internos para revisión al menos 48 horas antes de los plazos de entrega formal al profesor.</li>
                </ul>
              </div>
            </div>
          </Collapsible>

          <TipCallout title="💡 Revisión periódica">
            <p>
              Se recomienda revisar periódicamente la efectividad de las normas establecidas, aproximadamente cada 3–4 semanas, para determinar si requieren ajustes basados en la experiencia del equipo.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 6 — SEGURIDAD PSICOLÓGICA
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="seguridad">6. Seguridad psicológica: fundamento de equipos innovadores</SectionTitle>

          <p>
            La seguridad psicológica, identificada por el Proyecto Aristóteles como el factor más determinante para la efectividad de los equipos, se refiere a la creencia compartida de que el equipo es un espacio seguro para asumir riesgos interpersonales.
          </p>

          <SubTitle>Seis dimensiones de la seguridad psicológica</SubTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">1. Apertura a la experimentación</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Libertad para proponer ideas no convencionales y explorar soluciones innovadoras sin temor al ridículo o la crítica destructiva.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">2. Disposición a preguntar</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Confianza para expresar dudas, solicitar clarificaciones y reconocer límites en el conocimiento propio sin miedo a parecer incompetente.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">3. Comunicación de errores</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Capacidad para admitir errores, compartir fallas y analizar colectivamente las lecciones aprendidas sin temor a represalias.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">4. Aceptación de diferencias</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Valoración de perspectivas diversas y estilos de trabajo distintos como fuentes de fortaleza para el equipo.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">5. Retroalimentación constructiva</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Intercambio de opiniones honestas centradas en la mejora continua y expresadas con respeto.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">6. Apoyo mutuo</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Disposición para ofrecer ayuda, compartir recursos y colaborar para superar obstáculos.
              </p>
            </div>
          </div>

          <div className="my-8 aspect-video rounded-xl overflow-hidden shadow-lg not-prose">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/LhoLuui9gX8"
              title="Amy Edmondson — Building a psychologically safe workplace (TED)"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <SubTitle>Prácticas para fomentar la seguridad psicológica</SubTitle>

          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-3">A nivel de liderazgo</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-2 list-disc list-inside">
                <li><strong>Modelar la vulnerabilidad:</strong> El coordinador o líderes técnicos deben ser los primeros en reconocer sus dudas, errores o limitaciones.</li>
                <li><strong>Normalizar la incertidumbre:</strong> Enfatizar que las preguntas y la exploración son parte inherente del proceso científico e ingenieril.</li>
                <li><strong>Reconocer contribuciones:</strong> Visibilizar y valorar explícitamente los aportes de todos, especialmente los tradicionalmente menos escuchados.</li>
                <li><strong>Intervenir constructivamente:</strong> Reorientar con tacto las interacciones que puedan socavar la seguridad psicológica.</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-3">A nivel de equipo</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-2 list-disc list-inside">
                <li><strong>Establecer normas explícitas:</strong> Definir colectivamente cómo se abordarán los errores y cómo se expresará el desacuerdo.</li>
                <li><strong>Practicar la escucha activa:</strong> Demostrar atención plena, evitar interrupciones y validar las perspectivas.</li>
                <li><strong>Separar ideas de identidades:</strong> Evaluar propuestas por sus méritos, no por quién las presenta.</li>
                <li><strong>Implementar check-ins periódicos:</strong> Iniciar reuniones con rondas breves donde cada miembro comparte su estado actual.</li>
              </ul>
            </div>
          </div>

          <TipCallout>
            <p>
              La seguridad psicológica no implica ausencia de conflictos o conformidad obligada. Por el contrario, permite que los desacuerdos productivos emerjan y se aborden constructivamente.
            </p>
          </TipCallout>

          <SubTitle>Indicadores de seguridad psicológica</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Indicador positivo</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Señal de alerta</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray">Distribución equilibrada de participación en discusiones</td>
                  <td className="px-4 py-2.5 text-red-600">Monopolización de la palabra por algunos miembros</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray">Preguntas frecuentes y exploración de alternativas</td>
                  <td className="px-4 py-2.5 text-red-600">Aceptación acrítica de la primera solución propuesta</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray">Reconocimiento explícito de errores como oportunidades</td>
                  <td className="px-4 py-2.5 text-red-600">Ocultamiento de problemas hasta que escalan</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray">Solicitudes espontáneas de ayuda y retroalimentación</td>
                  <td className="px-4 py-2.5 text-red-600">Trabajo aislado sin integración hasta entregas finales</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray">Discusiones animadas con respeto a perspectivas diversas</td>
                  <td className="px-4 py-2.5 text-red-600">Conformidad superficial o conflictos personalizados</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 7 — RESOLUCIÓN DE CONFLICTOS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="conflictos">7. Mecanismos de resolución de conflictos</SectionTitle>

          <p>
            Los conflictos son inherentes a todo proceso de trabajo en equipo y, manejados adecuadamente, pueden convertirse en oportunidades para fortalecer al grupo.
          </p>

          <SubTitle>Tres tipos de conflictos</SubTitle>

          <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Conflictos de tarea</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Desacuerdos sobre cómo realizar el trabajo, interpretaciones técnicas divergentes o estándares de calidad diferentes. Ejemplos: discrepancias sobre metodologías experimentales, criterios de análisis de datos o enfoques de diseño.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Conflictos de proceso</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Desacuerdos sobre procedimientos, asignación de recursos o coordinación. Ejemplos: incumplimiento de plazos, ausencias en reuniones, distribución inequitativa de tareas.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Conflictos interpersonales</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Tensiones personales, estilos de comunicación incompatibles o cuestiones de valores. Ejemplos: faltas de respeto, microagresiones, acaparamiento de protagonismo, desvalorización de aportes.
              </p>
            </div>
          </div>

          <SubTitle>Protocolo escalonado de resolución</SubTitle>

          <div className="space-y-4 my-6 not-prose">
            <div className="flex gap-4 items-start rounded-xl border border-zinc-200 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-brand-dark text-sm">1</span>
              <div>
                <h4 className="font-semibold text-brand-dark text-base mb-1">Diálogo directo</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Los involucrados conversan directamente, sin intermediarios, enfocándose en comportamientos observables y su impacto, no en interpretaciones o juicios.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start rounded-xl border border-zinc-200 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-brand-dark text-sm">2</span>
              <div>
                <h4 className="font-semibold text-brand-dark text-base mb-1">Mediación interna</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Si el diálogo directo no resuelve, un compañero neutral (preferiblemente el Coordinador) facilita una conversación estructurada.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start rounded-xl border border-zinc-200 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-brand-dark text-sm">3</span>
              <div>
                <h4 className="font-semibold text-brand-dark text-base mb-1">Reunión de equipo</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Para conflictos que afectan al grupo completo, sesión específica donde se aborda el tema con todos los miembros.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start rounded-xl border border-zinc-200 p-5">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-brand-dark text-sm">4</span>
              <div>
                <h4 className="font-semibold text-brand-dark text-base mb-1">Intervención externa</h4>
                <p className="text-sm text-brand-gray leading-relaxed">
                  Cuando los mecanismos internos resultan insuficientes, se solicita apoyo del asistente o profesor, presentando evidencia del problema y de los intentos previos de resolución.
                </p>
              </div>
            </div>
          </div>

          <InfoCallout title="📝 Documentación de acuerdos">
            <p>
              Todos los acuerdos alcanzados durante el proceso de resolución deben documentarse por escrito, especificando acciones concretas, responsables y plazos.
            </p>
          </InfoCallout>

          <SubTitle>Técnicas de comunicación</SubTitle>

          <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Mensajes-Yo</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Expresar perspectivas en primera persona (&ldquo;Cuando ocurre X, yo siento Y porque Z&rdquo;) en lugar de acusaciones directas.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Escucha activa</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Prestar atención plena, parafrasear para verificar comprensión y demostrar que se valora genuinamente la perspectiva del otro.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Enfoque en intereses</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Identificar necesidades subyacentes de cada parte en lugar de aferrarse a posiciones específicas.
              </p>
            </div>
          </div>

          {/* 7b — Casos prácticos */}
          <SubTitle>Casos prácticos: escenarios comunes</SubTitle>

          <Collapsible id="escenario-1" title="Escenario 1: Incumplimiento de plazos y compromisos">
            <p className="font-medium text-brand-dark mb-2">Situación:</p>
            <p className="mb-3">Un miembro ha incumplido repetidamente con las fechas de entrega, afectando el avance general del proyecto.</p>
            <p className="font-medium text-brand-dark mb-2">Estrategia:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Identificar causas subyacentes mediante conversación privada y no acusatoria: &ldquo;He notado que los últimos entregables han llegado después de lo acordado. ¿Estás enfrentando alguna dificultad con la que podamos ayudar?&rdquo;</li>
              <li>Evaluar necesidad de redistribución temporal de tareas o ajuste de plazos intermedios.</li>
              <li>Implementar puntos de control más frecuentes para identificar tempranamente posibles retrasos.</li>
              <li>Si persiste sin justificación válida, aplicar mecanismo escalonado definido en el contrato de equipo.</li>
            </ol>
          </Collapsible>

          <Collapsible id="escenario-2" title="Escenario 2: Desacuerdos técnicos sobre metodologías o diseños">
            <p className="font-medium text-brand-dark mb-2">Situación:</p>
            <p className="mb-3">Dos integrantes mantienen posiciones opuestas sobre la metodología experimental, cada uno defendiendo su enfoque.</p>
            <p className="font-medium text-brand-dark mb-2">Estrategia:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Establecer sesión dedicada exclusivamente a este tema, con tiempo equitativo para presentación de argumentos técnicos.</li>
              <li>Solicitar que cada posición se sustente con referencias bibliográficas específicas.</li>
              <li>Identificar criterios objetivos para evaluación de alternativas (precisión, factibilidad, seguridad, costo, tiempo).</li>
              <li>Considerar la posibilidad de una aproximación híbrida o implementación de un piloto comparativo.</li>
              <li>En caso de persistir, someter a votación documentada del equipo completo.</li>
            </ol>
          </Collapsible>

          <Collapsible id="escenario-3" title="Escenario 3: Problemas de comunicación y malentendidos">
            <p className="font-medium text-brand-dark mb-2">Situación:</p>
            <p className="mb-3">Se han producido interpretaciones divergentes sobre acuerdos previos, generando confusión y trabajo duplicado.</p>
            <p className="font-medium text-brand-dark mb-2">Estrategia:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Revisar y mejorar el sistema de documentación de decisiones y acuerdos.</li>
              <li>Implementar confirmaciones explícitas: &ldquo;Para asegurar que estamos alineados, ¿podrías resumir cómo entiendes lo que acabamos de acordar?&rdquo;</li>
              <li>Establecer un glosario técnico compartido para términos con interpretaciones múltiples.</li>
              <li>Reforzar la práctica de preguntas aclaratorias sin juicio.</li>
            </ol>
          </Collapsible>

          <Collapsible id="conflictos-graves" title="Protocolo para conflictos interpersonales graves">
            <p className="mb-3">Cuando los conflictos involucran situaciones interpersonales profundas (faltas de respeto, exclusión sistemática, apropiación indebida de trabajo):</p>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Documentación objetiva:</strong> Registrar incidentes específicos con fecha, contexto y comportamientos observables, evitando interpretaciones.</li>
              <li><strong>Diálogo facilitado:</strong> Solicitar mediación del coordinador o miembro neutral respetado por ambas partes.</li>
              <li><strong>Acuerdos específicos:</strong> Establecer compromisos concretos de comportamiento futuro, documentados por escrito.</li>
              <li><strong>Seguimiento formal:</strong> Programar revisión del cumplimiento en 1–2 semanas con todo el equipo.</li>
              <li><strong>Escalamiento:</strong> Si persiste, solicitar intervención del monitor o profesor con evidencia del proceso seguido.</li>
            </ol>
          </Collapsible>

          <TipCallout>
            <p>
              La capacidad de un equipo para resolver conflictos internamente es un indicador de su madurez y constituye una habilidad profesional altamente valorada.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 8 — ROLES
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="roles">8. Roles específicos para el proyecto</SectionTitle>

          <SubTitle>Principios para la asignación de roles</SubTitle>

          <ul className="space-y-1.5 my-4">
            <li><strong>Alineación con competencias:</strong> Aprovechar fortalezas y experiencias previas de cada miembro.</li>
            <li><strong>Equilibrio de carga:</strong> Distribuir considerando complejidad y demanda temporal de cada rol.</li>
            <li><strong>Desarrollo profesional:</strong> Permitir que los estudiantes adquieran experiencia en áreas de interés.</li>
            <li><strong>Rotación estratégica:</strong> Planificar cambios en momentos clave para aprendizaje integral.</li>
            <li><strong>Responsabilidad compartida:</strong> Mantener colaboración y apoyo mutuo más allá de los roles específicos.</li>
          </ul>

          <TipCallout>
            <p>
              Los roles no constituyen compartimentos estancos. Todos los miembros mantienen responsabilidad sobre el proyecto en su conjunto y deben estar preparados para apoyar a sus compañeros cuando sea necesario.
            </p>
          </TipCallout>

          <SubTitle>Roles fundamentales</SubTitle>

          <div className="grid gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5 border-l-4 border-l-blue-400">
              <h4 className="font-semibold text-brand-dark text-base mb-3">Coordinación general</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Planificación y convocatoria de reuniones con agenda previa</li>
                <li>Seguimiento de tareas y plazos en la herramienta de gestión</li>
                <li>Facilitación de sesiones de trabajo y resolución de bloqueos</li>
                <li>Mantenimiento del clima de equipo y mediación en conflictos</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5 border-l-4 border-l-emerald-400">
              <h4 className="font-semibold text-brand-dark text-base mb-3">Líder(es) técnico(s) de proceso unitario</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Profundización en la teoría, diseño y operación del proceso asignado</li>
                <li>Orientación de decisiones técnicas y validación de metodologías</li>
                <li>Identificación de referencias bibliográficas relevantes</li>
                <li>Verificación de coherencia técnica entre componentes del proyecto</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5 border-l-4 border-l-purple-400">
              <h4 className="font-semibold text-brand-dark text-base mb-3">Gestor(a) de documentación y calidad</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Estructuración de plantillas y control de versiones</li>
                <li>Verificación de trazabilidad y completitud de referencias</li>
                <li>Consolidación de matrices de evaluación y actas</li>
                <li>Aseguramiento de coherencia estilística en entregables</li>
              </ul>
            </div>
          </div>

          <SubTitle>Roles complementarios</SubTitle>

          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Analista de datos / Modelamiento</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Estandariza datos, ejecuta modelos, reporta supuestos y análisis de sensibilidad. Asegura validez estadística de los resultados.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Gestor(a) de compras y logística</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Coordina requerimientos de insumos, equipos y tiempos de laboratorio. Mantiene inventario y gestiona permisos necesarios.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Vocería y relacionamiento</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Prepara presentaciones, gestiona comunicación con monitoría y profesorado. Asegura que los mensajes sean claros y consistentes.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Gestor(a) de riesgos</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Mantiene registro de riesgos (técnicos, de cronograma, HSE) con planes de mitigación y contingencia actualizados.
              </p>
            </div>
          </div>

          <TipCallout title="💡 Equipos pequeños">
            <p>
              Para equipos pequeños (4–5 integrantes), es recomendable combinar algunos roles complementarios con los fundamentales, asegurando que todas las áreas críticas queden cubiertas.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 9 — MATRIZ DE EVALUACIÓN
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="evaluacion">9. Matriz de evaluación: diseño y aplicación</SectionTitle>

          <p>
            La evaluación del desempeño en equipos académicos cumple un doble propósito: proporcionar retroalimentación constructiva para el mejoramiento continuo y asignar calificaciones que reflejen justamente la contribución de cada miembro.
          </p>

          <TipCallout title="💡 Principio fundamental">
            <p>
              La matriz de evaluación debe derivarse directamente de las normas acordadas por el equipo, garantizando coherencia entre las expectativas establecidas y los criterios utilizados para la valoración. Este alineamiento fortalece la percepción de justicia en el proceso evaluativo.
            </p>
          </TipCallout>

          <SubTitle>Escala Likert recomendada</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Valor</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Descripción</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-bold text-center">1</td>
                  <td className="px-4 py-2.5 text-brand-gray">Nunca cumple con el criterio</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-bold text-center">2</td>
                  <td className="px-4 py-2.5 text-brand-gray">Rara vez cumple con el criterio</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-bold text-center">3</td>
                  <td className="px-4 py-2.5 text-brand-gray">A veces cumple con el criterio</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-bold text-center">4</td>
                  <td className="px-4 py-2.5 text-brand-gray">Casi siempre cumple con el criterio</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-bold text-center">5</td>
                  <td className="px-4 py-2.5 text-brand-gray">Siempre cumple con el criterio</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p>
            La matriz debe utilizarse para <strong>autoevaluación</strong> (cada miembro evalúa su propio desempeño) y <strong>coevaluación</strong> (cada miembro evalúa a sus compañeros). La combinación de ambas perspectivas proporciona una visión completa y equilibrada del desempeño.
          </p>

          <SubTitle>Ejemplo de estructura para la matriz</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Criterio</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Indicador observable</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200 text-right">Peso (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Puntualidad y preparación</td>
                  <td className="px-4 py-2.5 text-brand-gray">Asiste y comparte lectura previa en &gt;80% de reuniones</td>
                  <td className="px-4 py-2.5 text-brand-gray text-right">10</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Cumplimiento de tareas</td>
                  <td className="px-4 py-2.5 text-brand-gray">Entrega a tiempo y con condición de satisfacción acordada</td>
                  <td className="px-4 py-2.5 text-brand-gray text-right">20</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Calidad técnica</td>
                  <td className="px-4 py-2.5 text-brand-gray">Propone y justifica decisiones con fundamentos teóricos</td>
                  <td className="px-4 py-2.5 text-brand-gray text-right">20</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Seguridad y HSE</td>
                  <td className="px-4 py-2.5 text-brand-gray">Reporta riesgos y cumple protocolos establecidos</td>
                  <td className="px-4 py-2.5 text-brand-gray text-right">15</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Colaboración y respeto</td>
                  <td className="px-4 py-2.5 text-brand-gray">Demuestra escucha activa y ofrece feedback constructivo</td>
                  <td className="px-4 py-2.5 text-brand-gray text-right">15</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Documentación</td>
                  <td className="px-4 py-2.5 text-brand-gray">Actualiza actas, matrices y repositorios oportunamente</td>
                  <td className="px-4 py-2.5 text-brand-gray text-right">10</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 text-brand-gray font-medium">Liderazgo / Apoyo al equipo</td>
                  <td className="px-4 py-2.5 text-brand-gray">Toma iniciativa y ayuda a destrabar bloqueos</td>
                  <td className="px-4 py-2.5 text-brand-gray text-right">10</td>
                </tr>
                <tr className="bg-zinc-50 font-semibold">
                  <td className="px-4 py-2.5 text-brand-dark" colSpan={2}>Totales</td>
                  <td className="px-4 py-2.5 text-brand-dark text-right">100</td>
                </tr>
              </tbody>
            </table>
          </div>

          <WarningCallout>
            <p>
              La matriz de evaluación debe aplicarse de forma honesta y objetiva, evitando tanto sobrevaloraciones complacientes como subvaloraciones injustas. Para ello, es fundamental basar las calificaciones en evidencias concretas y documentadas a lo largo del proceso.
            </p>
          </WarningCallout>

          <p>
            Se harán <strong>cinco ciclos de evaluación</strong> durante el semestre con fines formativos que permitan ajustes. En todos los casos, es valioso complementar las calificaciones numéricas con comentarios cualitativos que orienten específicamente las oportunidades de mejora.
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 10 — ENTREGABLES
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="entregables">10. Entregables del componente de trabajo en equipo</SectionTitle>

          <SubTitle>Contrato de equipo</SubTitle>

          <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-3">Contenido</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Normas acordadas por el equipo</li>
                <li>Roles definidos con responsables y suplentes</li>
                <li>Cronograma de reuniones regulares</li>
                <li>Mecanismos de resolución de conflictos</li>
                <li>Criterios de evaluación derivados de las normas</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-3">Formato</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Documento &ldquo;Contrato de Equipo — POI Uniandes&rdquo;</li>
                <li>Versión digital en PDF</li>
                <li>Firmado por todos los integrantes</li>
                <li>Actualizable mediante adendas documentadas</li>
              </ul>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-3">Entrega</h4>
              <ul className="text-sm text-brand-gray leading-relaxed space-y-1.5 list-disc list-inside">
                <li>Semana 2 del curso</li>
                <li>Carga en BloqueNeón</li>
                <li>Revisión por asistente/profesor</li>
              </ul>
            </div>
          </div>

          <SubTitle>Actas semanales</SubTitle>

          <p>
            Documentos de seguimiento continuo que capturan la evolución del trabajo colaborativo, las decisiones tomadas y los compromisos adquiridos. El registro se hará a través de documentos de Word subidos a BloqueNeón.
          </p>

          <SubTitle>Estructura del registro semanal</SubTitle>

          <div className="space-y-3 my-6 not-prose">
            {[
              { n: '1', title: 'Fecha, hora y participantes', desc: 'Documentación básica de la reunión.' },
              { n: '2', title: 'Objetivo de la reunión', desc: 'Propósito específico que orientó la sesión.' },
              { n: '3', title: 'Decisiones tomadas', desc: 'Acuerdos alcanzados con justificación resumida.' },
              { n: '4', title: 'Tareas y responsables', desc: 'Compromisos específicos con fecha límite y criterios de satisfacción.' },
              { n: '5', title: 'Riesgos identificados', desc: 'Nuevas amenazas o actualizaciones, con valoración y plan de mitigación.' },
              { n: '6', title: 'Reconocimientos', desc: 'Mención de contribuciones destacadas y aprendizajes significativos.' },
              { n: '7', title: 'Próxima reunión', desc: 'Fecha programada, enfoque previsto y entregables intermedios.' },
            ].map((item) => (
              <div key={item.n} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-brand-dark text-xs">{item.n}</span>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{item.title}</p>
                  <p className="text-sm text-brand-gray">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 11 — DOCUMENTACIÓN
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="documentacion">11. Buenas prácticas para la documentación</SectionTitle>

          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Rotación del registro</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Aunque el Gestor de Documentación supervisa, la responsabilidad de completar el registro puede rotar para desarrollar esta habilidad en todos los miembros.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Actualización inmediata</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                El registro debe completarse dentro de las 24 horas posteriores a la reunión, cuando los detalles están frescos.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Revisión colectiva</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Antes de finalizarse, el registro debe circular entre los asistentes para verificar precisión y completar detalles omitidos.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Accesibilidad</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Repositorio centralizado, con formato y nomenclatura estandarizados que faciliten la consulta posterior.
              </p>
            </div>
          </div>

          <TipCallout>
            <p>
              El registro semanal no es solo un requisito administrativo, sino una herramienta viva que apoya la continuidad del proyecto, la transparencia interna y la construcción de memoria colectiva.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 12 — INTEGRACIÓN PROFESIONAL
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="integracion">12. Integración final: del aula al entorno profesional</SectionTitle>

          <p>
            Las competencias de trabajo en equipo desarrolladas durante los proyectos de operaciones unitarias trascienden el ámbito académico y constituyen un activo profesional valioso. La industria química, alimentaria y biotecnológica opera fundamentalmente a través de equipos multidisciplinarios donde la colaboración efectiva es tan importante como el conocimiento técnico especializado.
          </p>
          <p>
            El Proyecto Aristóteles de Google demuestra que las organizaciones líderes en innovación tecnológica valoran y estudian sistemáticamente los factores que hacen efectivo el trabajo en equipo.
          </p>

          <blockquote className="my-6 border-l-4 border-zinc-300 pl-4 italic text-brand-gray">
            &ldquo;La capacidad de trabajar efectivamente en equipo no es un talento innato, sino una competencia desarrollable a través de la práctica reflexiva y la aplicación de principios fundamentados en evidencia. Los ingenieros que dominan esta competencia multiplican su impacto profesional.&rdquo;
          </blockquote>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 13 — REFLEXIÓN FINAL
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="reflexion">13. Reflexión final: más allá de las herramientas</SectionTitle>

          <div className="space-y-4 my-6 not-prose">
            {[
              {
                title: '1. Interdependencia positiva',
                desc: 'Reconocer que el éxito individual está indisolublemente ligado al éxito colectivo.',
              },
              {
                title: '2. Responsabilidad individual y grupal',
                desc: 'Asumir compromisos personales mientras se mantiene la corresponsabilidad por el resultado conjunto.',
              },
              {
                title: '3. Interacción promotora',
                desc: 'Crear un ambiente donde los miembros activamente facilitan el éxito de sus compañeros.',
              },
              {
                title: '4. Desarrollo de habilidades sociales',
                desc: 'Cultivar conscientemente competencias interpersonales como la comunicación asertiva, la empatía y la gestión constructiva del desacuerdo.',
              },
              {
                title: '5. Procesamiento grupal',
                desc: 'Reflexionar regularmente sobre el funcionamiento del equipo para preservar lo que funciona bien y mejorar lo perfectible.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start rounded-xl border border-zinc-200 p-5">
                <div>
                  <h4 className="font-semibold text-brand-dark text-base mb-1">{item.title}</h4>
                  <p className="text-sm text-brand-gray leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <HighlightCallout>
            <p>
              La verdadera medida del éxito en el componente de trabajo en equipo no es simplemente completar el proyecto académico, sino desarrollar competencias transferibles que potenciarán su efectividad como profesionales en un mundo donde la innovación y la resolución de problemas complejos son inherentemente colaborativas.
            </p>
          </HighlightCallout>

          <p>
            Los invitamos a considerar esta experiencia como un laboratorio de aprendizaje no solo sobre operaciones unitarias, sino también sobre las dinámicas humanas que determinan cómo las organizaciones transforman conocimiento especializado en soluciones efectivas.
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 14 — PLANTILLAS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="plantillas">14. Plantillas</SectionTitle>

          <Collapsible id="plantilla-registro" title="Plantilla: Registro semanal de trabajo en equipo">
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-zinc-200">
                  <tbody>
                    <tr className="border-b border-zinc-200">
                      <td className="px-3 py-2 font-semibold text-brand-dark bg-zinc-50 w-1/3">Equipo</td>
                      <td className="px-3 py-2 text-brand-gray">[Nombre del equipo]</td>
                    </tr>
                    <tr className="border-b border-zinc-200">
                      <td className="px-3 py-2 font-semibold text-brand-dark bg-zinc-50">Fecha y hora</td>
                      <td className="px-3 py-2 text-brand-gray">[DD/MM/AAAA — HH:MM]</td>
                    </tr>
                    <tr className="border-b border-zinc-200">
                      <td className="px-3 py-2 font-semibold text-brand-dark bg-zinc-50">Modalidad</td>
                      <td className="px-3 py-2 text-brand-gray">[Presencial / Virtual / Híbrida]</td>
                    </tr>
                    <tr className="border-b border-zinc-200">
                      <td className="px-3 py-2 font-semibold text-brand-dark bg-zinc-50">Asistentes</td>
                      <td className="px-3 py-2 text-brand-gray">[Nombres]</td>
                    </tr>
                    <tr className="border-b border-zinc-200">
                      <td className="px-3 py-2 font-semibold text-brand-dark bg-zinc-50">Ausencias justificadas</td>
                      <td className="px-3 py-2 text-brand-gray">[Nombres y motivo]</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-brand-dark">1. Objetivo de la reunión</p>
                <p className="text-zinc-400 italic">[Describir el propósito específico de la sesión]</p>

                <p className="font-semibold text-brand-dark">2. Temas tratados</p>
                <p className="text-zinc-400 italic">[Lista de temas abordados durante la reunión]</p>

                <p className="font-semibold text-brand-dark">3. Decisiones tomadas</p>
                <p className="text-zinc-400 italic">[Acuerdos alcanzados con justificación resumida]</p>

                <p className="font-semibold text-brand-dark">4. Compromisos establecidos</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-zinc-200">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Tarea</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Responsable</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Fecha límite</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Criterio de satisfacción</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-200">
                        <td className="px-3 py-2 text-zinc-400 italic">[Descripción]</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Nombre]</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Fecha]</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Criterio]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="font-semibold text-brand-dark">5. Riesgos identificados</p>
                <p className="text-zinc-400 italic">[Nuevas amenazas o actualizaciones con valoración y plan de mitigación]</p>

                <p className="font-semibold text-brand-dark">6. Seguimiento de compromisos anteriores</p>
                <p className="text-zinc-400 italic">[Estado de tareas asignadas en reuniones previas]</p>

                <p className="font-semibold text-brand-dark">7. Reconocimientos</p>
                <p className="text-zinc-400 italic">[Contribuciones destacadas y aprendizajes significativos]</p>

                <p className="font-semibold text-brand-dark">8. Próxima reunión</p>
                <p className="text-zinc-400 italic">[Fecha programada, enfoque previsto y entregables intermedios]</p>
              </div>

              <p className="mt-4 text-sm text-brand-gray">
                <strong>Registrado por:</strong> [Nombre del responsable de documentación]
              </p>
            </div>
          </Collapsible>

          <Collapsible id="plantilla-contrato" title="Plantilla: Contrato de equipo">
            <div className="space-y-6">
              {/* Section 1 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">1. Propósito, misión y valores del equipo</p>
                <div className="space-y-2">
                  <p><strong>Propósito del proyecto:</strong> <span className="text-zinc-400 italic">[Describir el objetivo general del proyecto de operaciones unitarias]</span></p>
                  <p><strong>Misión del equipo:</strong> <span className="text-zinc-400 italic">[Declaración breve sobre cómo el equipo abordará el proyecto]</span></p>
                  <p><strong>Valores del equipo (3–5):</strong></p>
                  <ol className="list-decimal list-inside text-zinc-400 italic">
                    <li>[Valor 1 y su significado para el equipo]</li>
                    <li>[Valor 2 y su significado para el equipo]</li>
                    <li>[Valor 3 y su significado para el equipo]</li>
                  </ol>
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">2. Roles del equipo</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-zinc-200">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Rol</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Responsable</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Suplente</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Responsabilidades clave</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Indicadores de cumplimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        'Coordinación general',
                        'Líder técnico de proceso',
                        'Gestor(a) de documentación y calidad',
                        'Analista de datos / Modelamiento',
                        'Gestor(a) de compras y logística',
                        'Gestor(a) de riesgos / Vocería',
                      ].map((rol) => (
                        <tr key={rol} className="border-b border-zinc-200">
                          <td className="px-3 py-2 text-brand-gray font-medium">{rol}</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Nombre]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Nombre]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Listar]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Listar]</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">3. Normas del equipo</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-zinc-200">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">#</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Norma acordada</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Indicador observable / Evidencia</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Consecuencia ante incumplimiento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 12 }, (_, i) => (
                        <tr key={i} className="border-b border-zinc-200">
                          <td className="px-3 py-2 text-brand-gray font-medium text-center">{i + 1}</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Norma]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Indicador]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Consecuencia]</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">4. Plan de reuniones y canales de comunicación</p>
                <div className="space-y-2 mb-3">
                  <p><strong>Periodicidad:</strong> <span className="text-zinc-400 italic">[Semanal / Bisemanal / Según necesidad]</span></p>
                  <p><strong>Modalidad preferida:</strong> <span className="text-zinc-400 italic">[Presencial / Virtual / Híbrida]</span></p>
                  <p><strong>Plazo para actas:</strong> <span className="text-zinc-400 italic">[Dentro de las 24 horas posteriores a la reunión]</span></p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-zinc-200">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Canal</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Uso acordado</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Tiempo de respuesta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { canal: 'WhatsApp / Telegram', uso: 'Coordinación rápida y alertas', tiempo: '[Ej: 4 horas]' },
                        { canal: 'Correo electrónico', uso: 'Comunicaciones formales', tiempo: '[Ej: 24 horas]' },
                        { canal: 'Plataforma de gestión', uso: 'Seguimiento de tareas', tiempo: '[Ej: 48 horas]' },
                        { canal: 'Repositorio compartido', uso: 'Documentos y entregables', tiempo: '[N/A]' },
                      ].map((row) => (
                        <tr key={row.canal} className="border-b border-zinc-200">
                          <td className="px-3 py-2 text-brand-gray font-medium">{row.canal}</td>
                          <td className="px-3 py-2 text-brand-gray">{row.uso}</td>
                          <td className="px-3 py-2 text-zinc-400 italic">{row.tiempo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 5 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">5. Mecanismos de resolución de conflictos</p>
                <div className="space-y-4">
                  {[
                    {
                      type: 'Conflictos de tarea',
                      steps: [
                        'Discusión técnica estructurada con evidencia',
                        'Consulta de referencias bibliográficas',
                        'Evaluación por criterios objetivos',
                        'Votación documentada del equipo',
                        'Consulta al asistente o profesor',
                      ],
                    },
                    {
                      type: 'Conflictos de proceso',
                      steps: [
                        'Revisión de normas y acuerdos del contrato',
                        'Diálogo directo entre involucrados',
                        'Mediación del coordinador',
                        'Reunión extraordinaria del equipo',
                        'Escalamiento al asistente o profesor',
                      ],
                    },
                    {
                      type: 'Conflictos interpersonales',
                      steps: [
                        'Conversación privada con mensajes-yo',
                        'Mediación de miembro neutral',
                        'Reunión de equipo con acuerdos escritos',
                        'Seguimiento formal en 1–2 semanas',
                        'Intervención del monitor o profesor con evidencia',
                      ],
                    },
                    {
                      type: 'Conflictos de seguridad',
                      steps: [
                        'Detención inmediata de la actividad riesgosa',
                        'Reporte al coordinador y líder técnico',
                        'Documentación del incidente',
                        'Revisión de protocolos con todo el equipo',
                        'Notificación al profesor si involucra riesgo HSE',
                      ],
                    },
                  ].map((conflict) => (
                    <div key={conflict.type}>
                      <p className="font-medium text-brand-dark mb-1">{conflict.type}:</p>
                      <ol className="list-decimal list-inside space-y-1">
                        {conflict.steps.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 6 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">6. Criterios y ponderaciones para co/autoevaluación</p>
                <p className="text-xs text-zinc-500 italic mb-2">Alineen cada criterio con una o más normas de la Sección 3</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-zinc-200">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Criterio</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Indicador observable</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Peso (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 7 }, (_, i) => (
                        <tr key={i} className="border-b border-zinc-200">
                          <td className="px-3 py-2 text-zinc-400 italic">[Criterio]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Indicador]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[%]</td>
                        </tr>
                      ))}
                      <tr className="bg-zinc-50 font-semibold">
                        <td className="px-3 py-2 text-brand-dark" colSpan={2}>Total</td>
                        <td className="px-3 py-2 text-brand-dark">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 7 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">7. Sanciones y medidas restaurativas</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-zinc-200">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Nivel</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Descripción</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Consecuencia</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Medida restaurativa</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-zinc-200">
                        <td className="px-3 py-2 text-brand-gray font-medium">Leve</td>
                        <td className="px-3 py-2 text-brand-gray">Incumplimientos menores aislados (un retraso puntual, una ausencia sin aviso previo)</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Ej: Conversación privada y registro en acta]</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Ej: Compromiso verbal documentado]</td>
                      </tr>
                      <tr className="border-b border-zinc-200">
                        <td className="px-3 py-2 text-brand-gray font-medium">Moderado</td>
                        <td className="px-3 py-2 text-brand-gray">Incumplimientos reiterados o que afectan el avance del equipo</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Ej: Reunión formal con acuerdo escrito y seguimiento]</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Ej: Plan de mejora con plazos específicos]</td>
                      </tr>
                      <tr className="border-b border-zinc-200">
                        <td className="px-3 py-2 text-brand-gray font-medium">Grave</td>
                        <td className="px-3 py-2 text-brand-gray">Faltas de respeto, apropiación de trabajo ajeno, incumplimiento de protocolos de seguridad</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Ej: Escalamiento al profesor con evidencia documentada]</td>
                        <td className="px-3 py-2 text-zinc-400 italic">[Ej: Mediación externa y restitución formal]</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 8 */}
              <div>
                <p className="font-semibold text-brand-dark mb-2">8. Firmas</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-zinc-200">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Nombre</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Firma</th>
                        <th className="px-3 py-2 text-left font-semibold text-brand-dark border-b border-zinc-200">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 5 }, (_, i) => (
                        <tr key={i} className="border-b border-zinc-200">
                          <td className="px-3 py-2 text-zinc-400 italic">[Nombre completo]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[Firma]</td>
                          <td className="px-3 py-2 text-zinc-400 italic">[DD/MM/AAAA]</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Collapsible>

        </div>
        {/* end reading-prose */}
      </div>
      {/* end grid */}
    </ReadingLayout>
  );
};

export default TrabajoEnEquipo;
