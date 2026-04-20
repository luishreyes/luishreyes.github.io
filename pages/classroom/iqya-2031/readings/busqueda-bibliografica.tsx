import React, { useState } from 'react';
import { ReadingLayout } from '../../../../components/classroom/ReadingLayout';
import { getCourseBySlug } from '../../../../components/data/classroom';

/* ─── TOC data ─── */
const tocItems = [
  { id: 'introduccion', label: 'Introducción' },
  { id: 'google-scholar', label: 'Google Scholar' },
  { id: 'web-of-science', label: 'Web of Science' },
  { id: 'scopus', label: 'Scopus' },
  { id: 'comparativa-clasicas', label: 'Comparativa' },
  { id: 'estrategias', label: 'Estrategias de búsqueda' },
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Google Gemini' },
  { id: 'claude', label: 'Claude' },
  { id: 'perplexity', label: 'Perplexity' },
  { id: 'scispace', label: 'SciSpace' },
  { id: 'consensus', label: 'Consensus' },
  { id: 'connected-papers', label: 'Connected Papers' },
  { id: 'comparativa-ia', label: 'Comparativa IA' },
  { id: 'flujo-trabajo', label: 'Flujo de trabajo' },
  { id: 'conclusiones', label: 'Conclusiones' },
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

const BusquedaBibliografica: React.FC = () => {
  const course = getCourseBySlug('iqya-2031');
  if (!course) return null;
  const reading = course.readings.find((r) => r.slug === 'busqueda-bibliografica');
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
              SECTION 1 — INTRODUCCIÓN
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="introduccion">1. Introducción a la búsqueda bibliográfica</SectionTitle>

          <p>
            Las plataformas de búsqueda académica son fundamentalmente diferentes de los motores de búsqueda generales como Google. Mientras que un buscador web indexa páginas de todo tipo — desde blogs personales hasta tiendas en línea —, las bases de datos académicas se enfocan exclusivamente en <strong>artículos de revistas científicas, tesis doctorales, actas de conferencias, patentes y libros técnicos</strong>. Esta especificidad las convierte en herramientas indispensables para cualquier investigación rigurosa.
          </p>

          <p>
            La búsqueda bibliográfica es el cimiento de toda investigación en ingeniería química. Es el proceso sistemático mediante el cual identificamos <strong>qué se sabe ya</strong> sobre un tema, cuáles son las <strong>metodologías validadas</strong> por la comunidad científica y dónde existen <strong>vacíos de conocimiento</strong> que justifican nuevas investigaciones. Sin una revisión bibliográfica sólida, corremos el riesgo de duplicar esfuerzos, ignorar avances importantes o partir de premisas incorrectas.
          </p>

          <p>
            Esta guía cubre tanto las <strong>plataformas académicas clásicas</strong> como las nuevas <strong>herramientas potenciadas por inteligencia artificial</strong> que están transformando la manera en que buscamos, analizamos y sintetizamos la literatura científica.
          </p>

          {/* Three pillars card grid */}
          <div className="grid sm:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Plataformas clásicas</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Google Scholar, Web of Science y Scopus — las tres grandes bases de datos para literatura científica indexada.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Estrategias de búsqueda</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Operadores booleanos, comillas, truncamientos y búsqueda por campos específicos para maximizar la precisión y relevancia.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Herramientas de IA</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                ChatGPT, Gemini, Claude, Perplexity, SciSpace, Consensus y Connected Papers — la nueva generación de asistentes de investigación.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 2 — GOOGLE SCHOLAR
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="google-scholar">2. Google Scholar</SectionTitle>

          <p>
            <strong>Google Scholar</strong> es un motor de búsqueda académico gratuito lanzado por Google en noviembre de 2004. Indexa el texto completo y los metadatos de literatura científica proveniente de una amplia variedad de fuentes: <strong>editoriales académicas, bibliotecas universitarias, repositorios institucionales, servidores de preprints y sitios web académicos</strong>. Su objetivo es organizar la información académica del mundo y hacerla universalmente accesible.
          </p>

          <SubTitle>Cómo funciona el ranking</SubTitle>

          <p>
            Google Scholar ordena los resultados de manera similar al buscador general de Google, pero incorpora señales específicas del ámbito académico. Los factores principales incluyen: el <strong>número de citas</strong> que ha recibido un artículo (posiblemente el factor más importante), la <strong>relevancia del texto completo</strong> respecto a la consulta, el <strong>prestigio de la fuente de publicación</strong>, y la <strong>fecha de publicación</strong>. Un artículo altamente citado y publicado en una revista reconocida aparecerá típicamente en las primeras posiciones.
          </p>

          <SubTitle>Actualizaciones 2025-2026</SubTitle>

          <ul>
            <li><strong>Scholar Metrics:</strong> Rankings mejorados de publicaciones académicas con métricas de impacto más granulares, incluyendo índice h5 e índice h5-mediana por áreas temáticas.</li>
            <li><strong>Scholar Updates (extensión de Chrome):</strong> Notificaciones personalizadas sobre nuevas publicaciones relevantes basadas en tu perfil de investigación y artículos previos.</li>
            <li><strong>Perfiles de autor mejorados:</strong> Páginas de autor con gráficas de citas por año, co-autores frecuentes y métricas de impacto actualizadas automáticamente.</li>
            <li><strong>Códigos QR:</strong> Generación de códigos QR para compartir perfiles de autor y artículos específicos de manera rápida.</li>
          </ul>

          <SubTitle>Acceso y costo</SubTitle>

          <p>
            Google Scholar es completamente <strong>gratuito</strong> y no requiere suscripción institucional. Sin embargo, muchos de los artículos que indexa están detrás de <strong>muros de pago</strong> (paywalls) de las editoriales. Scholar intenta encontrar versiones de acceso abierto (open access) de los artículos — busca en repositorios institucionales, páginas personales de autores y servidores de preprints. Cuando encuentra una versión libre, muestra un enlace directo al PDF.
          </p>

          <SubTitle>Uso en revisiones de literatura</SubTitle>

          <p>
            Google Scholar es excelente como <strong>punto de partida</strong> para una revisión bibliográfica. Sus funcionalidades más valiosas incluyen:
          </p>

          <ul>
            <li><strong>{'"'}Citado por X{'"'}:</strong> Permite ver todos los artículos que han citado una publicación específica. Esto es invaluable para rastrear cómo una idea o metodología ha evolucionado.</li>
            <li><strong>{'"'}Artículos relacionados{'"'}:</strong> Sugiere publicaciones temáticamente similares al artículo que estás consultando.</li>
            <li><strong>Alertas por correo:</strong> Puedes configurar alertas para recibir notificaciones cuando se publiquen nuevos artículos sobre tus términos de búsqueda.</li>
            <li><strong>Biblioteca personal:</strong> Guarda artículos en tu biblioteca para consultarlos después y exportar las citas.</li>
          </ul>

          <SubTitle>Limitaciones</SubTitle>

          <ul>
            <li>No soporta <strong>truncamiento</strong> con asterisco (a diferencia de WoS y Scopus).</li>
            <li>Los <strong>filtros de búsqueda</strong> son básicos: solo permite filtrar por fecha, idioma, tipo de búsqueda (en el título o en todo el texto) y excluir patentes/citas.</li>
            <li>Los <strong>metadatos</strong> pueden ser inconsistentes — a veces los títulos, autores o fechas tienen errores porque Scholar indexa automáticamente sin curación manual.</li>
            <li>No ofrece análisis bibliométrico avanzado (publicaciones por año, top autores, etc.).</li>
          </ul>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer">
              scholar.google.com
            </a>
          </p>

          <TipCallout>
            <p>
              Google Scholar es excelente como punto de partida para explorar un tema nuevo o para rastrear citas de un artículo específico. Úsalo para obtener una visión amplia antes de refinar tu búsqueda en bases de datos más especializadas como Web of Science o Scopus.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 3 — WEB OF SCIENCE
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="web-of-science">3. Web of Science (WoS)</SectionTitle>

          <p>
            <strong>Web of Science</strong> es una plataforma de indexación académica de pago desarrollada y mantenida por <strong>Clarivate Analytics</strong>. Es considerada el estándar de oro para la investigación científica de alto impacto gracias a su riguroso proceso de selección de revistas. Su historia se remonta a los años 1960, cuando el <strong>Institute for Scientific Information (ISI)</strong>, fundado por Eugene Garfield, creó el <em>Science Citation Index</em> — la primera base de datos que rastreaba sistemáticamente las citas entre publicaciones científicas.
          </p>

          <SubTitle>Cobertura</SubTitle>

          <p>
            Web of Science contiene millones de registros que se remontan hasta <strong>1900</strong>, organizados en varios índices principales:
          </p>

          <ul>
            <li><strong>Science Citation Index Expanded (SCIE):</strong> Ciencias naturales, ingeniería, medicina y tecnología.</li>
            <li><strong>Social Sciences Citation Index (SSCI):</strong> Ciencias sociales, economía, psicología y educación.</li>
            <li><strong>Arts &amp; Humanities Citation Index (AHCI):</strong> Artes, humanidades, filosofía y literatura.</li>
            <li><strong>Emerging Sources Citation Index (ESCI):</strong> Revistas emergentes que aún no cumplen todos los criterios para los índices principales.</li>
          </ul>

          <SubTitle>Actualizaciones 2025-2026</SubTitle>

          <ul>
            <li><strong>Research Assistant con IA conversacional:</strong> Un asistente de investigación integrado que permite hacer preguntas en lenguaje natural sobre la literatura indexada. La función <strong>Literature Review 2.0</strong> incorpora IA agéntica con memoria de sesión — recuerda el contexto de la conversación y puede refinar búsquedas iterativamente.</li>
            <li><strong>Policy Citation Index:</strong> Nuevo índice que rastrea cómo la investigación científica es citada en documentos de políticas públicas gubernamentales.</li>
            <li><strong>Preprint Citation Index:</strong> Indexación de preprints de servidores como arXiv, bioRxiv y medRxiv, con seguimiento de citas.</li>
            <li><strong>Grants Index:</strong> Base de datos de financiamiento que conecta publicaciones con las becas y subvenciones que las financiaron.</li>
            <li><strong>ProQuest Dissertations:</strong> Integración de tesis doctorales y de maestría de universidades de todo el mundo.</li>
            <li><strong>Retraction Watch:</strong> Integración directa con la base de datos de artículos retractados, alertando cuando un artículo citado ha sido retirado por la comunidad científica.</li>
            <li><strong>Visualización interactiva de co-autores:</strong> Mapas de redes de colaboración que muestran las conexiones entre investigadores.</li>
            <li><strong>Análisis de Objetivos de Desarrollo Sostenible (ODS):</strong> Clasificación automática de publicaciones según su contribución a los ODS de la ONU.</li>
            <li><strong>Códigos QR para perfiles:</strong> Generación de QR para compartir perfiles de investigador y colecciones de artículos.</li>
            <li><strong>Actualizaciones bisemanales:</strong> Nuevos registros y citas se actualizan cada dos semanas.</li>
          </ul>

          <SubTitle>Acceso</SubTitle>

          <p>
            Web of Science requiere una <strong>suscripción institucional</strong>. Los estudiantes de la Universidad de los Andes pueden acceder a través del portal de la biblioteca. Para acceder desde fuera del campus, es necesario usar la VPN institucional o el proxy de la biblioteca.
          </p>

          <SubTitle>Búsqueda avanzada</SubTitle>

          <p>
            WoS ofrece un sistema de búsqueda avanzada muy potente que permite combinar operadores booleanos con campos específicos:
          </p>

          <ul>
            <li><strong>TS=</strong> (Topic): Busca en título, resumen, palabras clave del autor y KeyWords Plus.</li>
            <li><strong>TI=</strong> (Title): Solo en el título.</li>
            <li><strong>AU=</strong> (Author): Por nombre de autor.</li>
            <li><strong>SO=</strong> (Source): Por nombre de la revista.</li>
            <li><strong>Comodines:</strong> Asterisco (*) para truncamiento, signo de interrogación (?) para un carácter, dollar ($) para cero o un carácter.</li>
            <li><strong>Operadores de proximidad:</strong> NEAR/n para encontrar términos cercanos entre sí.</li>
          </ul>

          <p>
            <strong>Enlace:</strong> Acceso a través del{' '}
            <a href="https://biblioteca.uniandes.edu.co" target="_blank" rel="noopener noreferrer">
              portal de la Biblioteca de la Universidad de los Andes
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 4 — SCOPUS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="scopus">4. Scopus</SectionTitle>

          <p>
            <strong>Scopus</strong> es una base de datos bibliográfica desarrollada por <strong>Elsevier</strong>, lanzada en 2004 como competidora directa de Web of Science. Desde su inicio, Scopus adoptó una estrategia de cobertura más amplia, indexando una mayor cantidad de revistas, conferencias y libros. Actualmente, Scopus contiene más de <strong>100 millones de documentos</strong> provenientes de más de <strong>25.000 revistas activas</strong> y <strong>240.000 libros</strong>.
          </p>

          <SubTitle>Scopus AI Discovery (antes Scopus AI)</SubTitle>

          <p>
            En una actualización importante, Scopus ha <strong>rebautizado su herramienta de IA como {'"'}AI Discovery{'"'}</strong>. Esta plataforma integrada permite interactuar con la base de datos usando lenguaje natural:
          </p>

          <ul>
            <li><strong>Consultas en lenguaje natural:</strong> Haz preguntas como {'"'}¿Cuáles son los avances recientes en membranas para desalinización?{'"'} y obtén respuestas estructuradas con referencias.</li>
            <li><strong>Topic Summaries:</strong> Resúmenes automáticos de temas basados en la literatura más citada y reciente.</li>
            <li><strong>Expanded Summaries:</strong> Análisis más profundos que sintetizan hallazgos de múltiples publicaciones.</li>
          </ul>

          <SubTitle>Nuevas funcionalidades 2025-2026</SubTitle>

          <ul>
            <li><strong>Deep Research:</strong> IA agéntica que desarrolla planes de investigación, conduce búsquedas extensivas en la base de datos, y refina su estrategia de manera autónoma. Genera reportes detallados con bibliografía verificada.</li>
            <li><strong>Emerging Themes:</strong> Función que escanea los documentos publicados en los últimos 2 años para identificar tendencias emergentes y temas en crecimiento dentro de un campo específico.</li>
            <li><strong>Capa de transparencia Copilot:</strong> Cada respuesta de la IA muestra exactamente qué documentos consultó y cómo llegó a sus conclusiones.</li>
            <li><strong>Historial de conversaciones:</strong> Las sesiones de IA se guardan para retomar investigaciones previas.</li>
            <li><strong>Optimización móvil:</strong> Interfaz completamente responsiva para usar desde dispositivos móviles.</li>
          </ul>

          <SubTitle>Acceso</SubTitle>

          <p>
            Al igual que Web of Science, Scopus requiere una <strong>suscripción institucional</strong>. Los estudiantes de Uniandes pueden acceder a través del portal de la biblioteca.
          </p>

          <SubTitle>Análisis bibliométrico</SubTitle>

          <p>
            Scopus es particularmente fuerte en análisis bibliométrico. Después de realizar una búsqueda, puedes analizar los resultados por:
          </p>

          <ul>
            <li><strong>Publicaciones por año:</strong> Tendencia temporal del campo de investigación.</li>
            <li><strong>Autores más productivos:</strong> Quiénes son los líderes del área.</li>
            <li><strong>Instituciones líderes:</strong> Dónde se concentra la investigación.</li>
            <li><strong>Índice h:</strong> Métrica de impacto de investigadores individuales.</li>
            <li><strong>Países y financiadores:</strong> Distribución geográfica y fuentes de financiamiento.</li>
          </ul>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://www.scopus.com" target="_blank" rel="noopener noreferrer">
              scopus.com
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 5 — COMPARATIVA CLÁSICAS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="comparativa-clasicas">5. Comparativa de plataformas clásicas</SectionTitle>

          <p>
            La siguiente tabla resume las diferencias clave entre las tres plataformas académicas clásicas, actualizada con las funcionalidades de 2026:
          </p>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Característica</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Google Scholar</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Web of Science</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Scopus</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Acceso</td>
                  <td className="px-4 py-2.5 text-brand-gray">Gratuito</td>
                  <td className="px-4 py-2.5 text-brand-gray">Suscripción institucional</td>
                  <td className="px-4 py-2.5 text-brand-gray">Suscripción institucional</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Cobertura</td>
                  <td className="px-4 py-2.5 text-brand-gray">Muy amplia, sin curación</td>
                  <td className="px-4 py-2.5 text-brand-gray">Selectiva, revistas de alto impacto</td>
                  <td className="px-4 py-2.5 text-brand-gray">Amplia, 100M+ documentos, 25.000+ revistas</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Calidad de metadatos</td>
                  <td className="px-4 py-2.5 text-brand-gray">Variable, indexación automática</td>
                  <td className="px-4 py-2.5 text-brand-gray">Alta, curación manual</td>
                  <td className="px-4 py-2.5 text-brand-gray">Alta, curación editorial</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Búsqueda avanzada</td>
                  <td className="px-4 py-2.5 text-brand-gray">Básica (sin truncamiento)</td>
                  <td className="px-4 py-2.5 text-brand-gray">Muy avanzada (booleanos, comodines, proximidad)</td>
                  <td className="px-4 py-2.5 text-brand-gray">Muy avanzada (booleanos, comodines, campos)</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Análisis de citas</td>
                  <td className="px-4 py-2.5 text-brand-gray">Básico ({'"'}Citado por{'"'})</td>
                  <td className="px-4 py-2.5 text-brand-gray">Avanzado (Citation Report, h-index)</td>
                  <td className="px-4 py-2.5 text-brand-gray">Avanzado (bibliometría, h-index, tendencias)</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Alertas</td>
                  <td className="px-4 py-2.5 text-brand-gray">Por correo electrónico</td>
                  <td className="px-4 py-2.5 text-brand-gray">Alertas de citas y búsquedas guardadas</td>
                  <td className="px-4 py-2.5 text-brand-gray">Alertas de citas, autores y búsquedas</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Exportación</td>
                  <td className="px-4 py-2.5 text-brand-gray">BibTeX, EndNote, RefMan</td>
                  <td className="px-4 py-2.5 text-brand-gray">Múltiples formatos, integración con gestores</td>
                  <td className="px-4 py-2.5 text-brand-gray">Múltiples formatos, RIS, BibTeX, CSV</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">IA integrada</td>
                  <td className="px-4 py-2.5 text-brand-gray">No</td>
                  <td className="px-4 py-2.5 text-brand-gray">Research Assistant con IA agéntica</td>
                  <td className="px-4 py-2.5 text-brand-gray">AI Discovery con Deep Research</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Fortaleza principal</td>
                  <td className="px-4 py-2.5 text-brand-gray">Amplitud, gratuidad, facilidad de uso</td>
                  <td className="px-4 py-2.5 text-brand-gray">Calidad, historial desde 1900, Journal Impact Factor</td>
                  <td className="px-4 py-2.5 text-brand-gray">Cobertura amplia + curada, AI Discovery, bibliometría</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Debilidad principal</td>
                  <td className="px-4 py-2.5 text-brand-gray">Metadatos inconsistentes, sin filtros avanzados</td>
                  <td className="px-4 py-2.5 text-brand-gray">Cobertura más limitada, costosa</td>
                  <td className="px-4 py-2.5 text-brand-gray">Costosa, algunas revistas no indexadas</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 6 — ESTRATEGIAS DE BÚSQUEDA
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="estrategias">6. Estrategias de búsqueda</SectionTitle>

          <p>
            Saber usar una plataforma de búsqueda es tan importante como elegir la correcta. Las estrategias de búsqueda avanzada te permiten encontrar exactamente lo que necesitas en menos tiempo, reduciendo el ruido y aumentando la relevancia de los resultados.
          </p>

          <SubTitle>Operadores booleanos</SubTitle>

          <ul>
            <li><strong>AND:</strong> Combina dos términos para que ambos aparezcan en los resultados. En Google Scholar, el AND está implícito entre palabras. Ejemplo: <code>membrane AND wastewater</code> devuelve artículos que contienen ambos términos.</li>
            <li><strong>OR:</strong> Busca artículos que contengan al menos uno de los términos. Ideal para sinónimos. Ejemplo: <code>wastewater OR {'"'}agua residual{'"'}</code>.</li>
            <li><strong>NOT (o signo menos -):</strong> Excluye artículos que contengan un término. Ejemplo: <code>bioplastic NOT packaging</code> o en Google Scholar: <code>bioplastic -packaging</code>.</li>
          </ul>

          <SubTitle>Técnicas avanzadas</SubTitle>

          <ul>
            <li><strong>Paréntesis para agrupación:</strong> Controlan el orden de evaluación de los operadores. Ejemplo: <code>(fungi OR fungal) AND membrane</code>.</li>
            <li><strong>Frase exacta con comillas:</strong> Busca la secuencia exacta de palabras. Ejemplo: <code>{'"'}reverse osmosis{'"'}</code>.</li>
            <li><strong>Truncamiento con asterisco (*):</strong> Busca todas las variaciones de una raíz. Ejemplo: <code>membran*</code> encuentra membrane, membranes, membranas. <em>Solo funciona en WoS y Scopus, no en Google Scholar.</em></li>
            <li><strong>Búsqueda por campos específicos:</strong> Permite limitar la búsqueda a partes específicas del registro:
              <ul>
                <li><code>TI=</code> — Título del artículo</li>
                <li><code>AU=</code> — Nombre del autor</li>
                <li><code>SO=</code> — Nombre de la revista (Source)</li>
                <li><code>TITLE-ABS-KEY()</code> — Título, resumen y palabras clave (Scopus)</li>
              </ul>
            </li>
          </ul>

          <SubTitle>Ejemplo detallado: tratamiento de aguas residuales con membranas y hongos</SubTitle>

          <p>
            Supongamos que estás investigando sobre el uso de hongos y membranas en el tratamiento de aguas residuales. Veamos la diferencia entre una búsqueda básica y una avanzada:
          </p>

          <div className="grid sm:grid-cols-2 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-red-200 bg-red-50/30 p-5">
              <h4 className="font-semibold text-red-600 text-base mb-2">Búsqueda deficiente</h4>
              <p className="text-sm text-brand-gray leading-relaxed font-mono">
                membrana hongo aguas residuales
              </p>
              <p className="text-sm text-brand-gray leading-relaxed mt-2">
                Mezcla idiomas, no usa operadores, no incluye sinónimos, no usa truncamiento. Resultados impredecibles y poco relevantes.
              </p>
            </div>
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-5">
              <h4 className="font-semibold text-emerald-600 text-base mb-2">Búsqueda avanzada</h4>
              <p className="text-sm text-brand-gray leading-relaxed font-mono break-all">
                TITLE-ABS-KEY((fungi OR fungal OR hongo*) AND (wastewater OR {'"'}agua residual{'"'}) AND membrane*)
              </p>
              <p className="text-sm text-brand-gray leading-relaxed mt-2">
                Incluye sinónimos (OR), truncamiento (*), frase exacta, y búsqueda en título, resumen y palabras clave.
              </p>
            </div>
          </div>

          <SubTitle>Recomendaciones prácticas</SubTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">1. Empieza amplio, luego refina</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Comienza con una búsqueda general para entender el volumen de literatura disponible. Luego añade filtros y operadores para acotar los resultados.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">2. Usa vocabulario controlado</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Consulta tesauros especializados (como MeSH para biomedicina) para identificar los términos estándar que usan los autores en tu campo.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">3. Guarda tus ecuaciones de búsqueda</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Documenta cada búsqueda que realices: la ecuación exacta, la plataforma, la fecha y el número de resultados. Esto es esencial para la reproducibilidad.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">4. Combina búsquedas</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                WoS y Scopus permiten combinar búsquedas previas usando sus identificadores (ej: #1 AND #2). Esto facilita construir ecuaciones complejas paso a paso.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">5. Aprovecha los filtros</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Después de obtener resultados, usa los filtros de la plataforma: año de publicación, tipo de documento, área temática, idioma, acceso abierto, entre otros.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 7 — CHATGPT
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="chatgpt">7. ChatGPT (OpenAI)</SectionTitle>

          <p>
            <strong>ChatGPT</strong> de OpenAI es el chatbot de inteligencia artificial más utilizado del mundo y ha evolucionado significativamente como herramienta para la investigación académica. A abril de 2026, ChatGPT cuenta con capacidades avanzadas de búsqueda, análisis de documentos y generación de reportes de investigación.
          </p>

          <SubTitle>Modelo actual: GPT-5.4</SubTitle>

          <p>
            El modelo insignia actual es <strong>GPT-5.4</strong>, lanzado el 5 de marzo de 2026. Ofrece una ventana de contexto de <strong>1 millón de tokens</strong> y capacidad nativa de uso de computadora (computer-use). <strong>GPT-5.3</strong> está disponible para todos los usuarios, incluyendo el plan gratuito. Los modelos anteriores (GPT-4o, GPT-4.1, GPT-5 Instant/Thinking) fueron <strong>retirados el 13 de febrero de 2026</strong>.
          </p>

          <SubTitle>Planes y precios (abril 2026)</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Plan</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Precio</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Características clave</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Free</td>
                  <td className="px-4 py-2.5 text-brand-gray">$0/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">GPT-5.3 con límites; incluye publicidad en EE.UU.</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Go</td>
                  <td className="px-4 py-2.5 text-brand-gray">$8/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Más volumen de mensajes; incluye publicidad</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Plus</td>
                  <td className="px-4 py-2.5 text-brand-gray">$20/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Suite completa, Deep Research (10 runs/mes), sin publicidad</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Pro ($100)</td>
                  <td className="px-4 py-2.5 text-brand-gray">$100/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Nuevo (abril 2026), nivel intermedio entre Plus y Pro $200</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Pro ($200)</td>
                  <td className="px-4 py-2.5 text-brand-gray">$200/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">GPT-5.4 Pro, 250 Deep Research/mes, doble contexto</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubTitle>Deep Research</SubTitle>

          <p>
            Deep Research es la funcionalidad más poderosa de ChatGPT para investigación académica. Cada consulta toma entre <strong>5 y 30 minutos</strong>, durante los cuales el sistema realiza búsquedas iterativas y autónomas en la web, lee y analiza múltiples fuentes, y genera un <strong>reporte estructurado con citas</strong>. Es especialmente útil para obtener una visión panorámica de un tema complejo.
          </p>

          <SubTitle>Study Mode</SubTitle>

          <p>
            ChatGPT incluye un <strong>Study Mode</strong> diseñado como experiencia de aprendizaje para estudiantes. En lugar de dar respuestas directas, formula preguntas, fomenta la participación activa y promueve la metacognición — ideal para preparar exámenes o profundizar en conceptos.
          </p>

          <WarningCallout>
            <p>
              ChatGPT puede inventar referencias que suenan plausibles pero no existen (alucinaciones). Siempre verifica las fuentes con Google Scholar, Scopus u otras bases de datos. Nunca cites una referencia proporcionada por ChatGPT sin confirmar que el artículo realmente existe.
            </p>
          </WarningCallout>

          <SubTitle>Cómo usar ChatGPT para revisiones de literatura</SubTitle>

          <ol>
            <li><strong>Exploración inicial de conceptos:</strong> Pide a ChatGPT que te explique un tema nuevo, identifique los subtemas principales y te sugiera autores clave.</li>
            <li><strong>Generación de palabras clave y sinónimos:</strong> Solicita listas de términos de búsqueda en inglés y español para usar en WoS o Scopus.</li>
            <li><strong>Estructuración del trabajo:</strong> Pide esquemas, índices tentativos y marcos conceptuales para organizar tu revisión.</li>
            <li><strong>Deep Research para temas específicos:</strong> Usa Deep Research para investigaciones profundas sobre subtemas concretos. Revisa siempre las fuentes citadas.</li>
            <li><strong>Redacción y parafraseo:</strong> Usa ChatGPT para mejorar la redacción de tus textos, pero siempre citando fuentes reales verificadas por ti.</li>
          </ol>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer">
              chatgpt.com
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 8 — GEMINI
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="gemini">8. Google Gemini</SectionTitle>

          <p>
            <strong>Google Gemini</strong> es la familia de modelos de inteligencia artificial de Google, integrada profundamente con el ecosistema de productos de la compañía (Google Scholar, Workspace, Drive, NotebookLM). A abril de 2026, Gemini se posiciona como una alternativa poderosa para la investigación académica, especialmente por su capacidad multimodal.
          </p>

          <SubTitle>Modelo actual: Gemini 3.1 Pro</SubTitle>

          <p>
            El modelo actual es <strong>Gemini 3.1 Pro</strong>, lanzado el 19 de febrero de 2026, que obtuvo un puntaje de <strong>77,1% en ARC-AGI-2</strong> — un benchmark de razonamiento avanzado. Incluye un <strong>modo Deep Think</strong> para razonamiento STEM complejo que dedica más tiempo de procesamiento a problemas difíciles. Para tareas rápidas o con restricciones de presupuesto, está disponible <strong>Gemini 3.1 Flash-Lite</strong>.
          </p>

          <p>
            Gemini es <strong>multimodal</strong>: puede procesar y generar texto, audio, imágenes, video y código de programación.
          </p>

          <SubTitle>Planes y precios (abril 2026)</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Plan</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Precio</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Modelo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Free</td>
                  <td className="px-4 py-2.5 text-brand-gray">$0</td>
                  <td className="px-4 py-2.5 text-brand-gray">1.500 solicitudes/día</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">AI Pro</td>
                  <td className="px-4 py-2.5 text-brand-gray">$19,99/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Gemini 3, 1.000 créditos IA</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">AI Ultra</td>
                  <td className="px-4 py-2.5 text-brand-gray">~$125/3 meses</td>
                  <td className="px-4 py-2.5 text-brand-gray">Gemini 3.1 Pro, Deep Think, 25.000 créditos</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubTitle>Deep Research</SubTitle>

          <p>
            Similar a ChatGPT, Gemini ofrece <strong>Deep Research</strong>: explora temas en profundidad, genera reportes organizados con enlaces a las fuentes, y permite exportar directamente a <strong>Google Docs</strong>. La integración con el ecosistema de Google es una ventaja significativa — puede acceder a documentos en Drive, usar información de Scholar, y colaborar en tiempo real a través de Workspace.
          </p>

          <SubTitle>Gems</SubTitle>

          <p>
            Los <strong>Gems</strong> son versiones personalizadas de Gemini especializadas para tareas específicas. Puedes crear un Gem configurado para buscar literatura en tu campo, con instrucciones sobre el tipo de fuentes que prefieres, el formato de las citas, y el nivel de detalle de los resúmenes.
          </p>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">
              gemini.google.com
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 9 — CLAUDE
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="claude">9. Claude (Anthropic)</SectionTitle>

          <p>
            <strong>Claude</strong> es la familia de modelos de inteligencia artificial desarrollada por <strong>Anthropic</strong>. A diferencia de ChatGPT y Gemini, Claude se distingue por su énfasis en la seguridad, la precisión y el razonamiento científico riguroso. Es una herramienta particularmente valiosa para el análisis profundo de documentos académicos.
          </p>

          <SubTitle>Modelos disponibles (abril 2026)</SubTitle>

          <ul>
            <li><strong>Claude Opus 4.7</strong> (lanzado el 16 de abril de 2026): El modelo más capaz de Anthropic, con capacidad de auto-verificación que le permite revisar y corregir sus propias respuestas.</li>
            <li><strong>Claude Sonnet 4.6:</strong> El mejor equilibrio entre capacidad y velocidad, con ventana de contexto de <strong>1 millón de tokens</strong>.</li>
            <li><strong>Claude Haiku 4.5:</strong> El modelo más rápido y económico, ideal para tareas rutinarias.</li>
          </ul>

          <SubTitle>Planes y precios (abril 2026)</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Plan</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Precio</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Características</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Free</td>
                  <td className="px-4 py-2.5 text-brand-gray">$0</td>
                  <td className="px-4 py-2.5 text-brand-gray">Acceso básico con límites</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Pro</td>
                  <td className="px-4 py-2.5 text-brand-gray">$20/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Límites más altos, acceso prioritario</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Max</td>
                  <td className="px-4 py-2.5 text-brand-gray">$100/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Uso muy alto, todas las funciones</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubTitle>Funcionalidades clave para investigación</SubTitle>

          <ul>
            <li><strong>Ventana de contexto de 1 millón de tokens:</strong> Permite subir y analizar múltiples papers completos simultáneamente. Puedes cargar 5-10 artículos de investigación y pedirle que compare metodologías, extraiga datos, o identifique contradicciones entre los estudios.</li>
            <li><strong>Modo de pensamiento extendido:</strong> Para razonamiento complejo de múltiples pasos, Claude puede {'"'}pensar en voz alta{'"'}, mostrando su proceso de razonamiento paso a paso antes de dar una respuesta final.</li>
            <li><strong>Razonamiento científico:</strong> Fuerte capacidad para interpretar datos experimentales, evaluar diseños experimentales y analizar resultados estadísticos.</li>
            <li><strong>Generación de gráficos y visualizaciones:</strong> Puede crear visualizaciones en línea para representar datos y conceptos.</li>
            <li><strong>Sin búsqueda web integrada:</strong> A diferencia de ChatGPT y Gemini, Claude no tiene búsqueda web nativa. Esto lo hace ideal para <em>análisis</em> de documentos que tú le proporcionas, pero no para <em>descubrimiento</em> de nueva literatura.</li>
          </ul>

          <TipCallout>
            <p>
              Claude es especialmente útil para analizar documentos largos gracias a su ventana de contexto de 1 millón de tokens. Puedes subir varios papers completos y pedirle que compare metodologías, extraiga datos o identifique contradicciones entre los estudios.
            </p>
          </TipCallout>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer">
              claude.ai
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 10 — PERPLEXITY
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="perplexity">10. Perplexity</SectionTitle>

          <p>
            <strong>Perplexity</strong> es un motor de búsqueda potenciado por inteligencia artificial que combina la capacidad de búsqueda web con la generación de respuestas en lenguaje natural. Su principal diferenciador es que <strong>cada afirmación incluye citas a las fuentes</strong>, lo que facilita la verificación de la información.
          </p>

          <p>
            Para investigación académica, Perplexity indexa más de <strong>200 millones de papers</strong> a través de Semantic Scholar y OpenAlex. Su función <strong>Deep Research</strong> utiliza <strong>Claude Opus 4.5/4.6</strong> como modelo base, visita más de <strong>100 páginas por consulta</strong>, toma entre 2 y 5 minutos, y alcanza un <strong>93,9% de factualidad en SimpleQA</strong> — una de las tasas más altas disponibles.
          </p>

          <SubTitle>Planes y precios (abril 2026)</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Plan</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Precio</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Características</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Free</td>
                  <td className="px-4 py-2.5 text-brand-gray">$0</td>
                  <td className="px-4 py-2.5 text-brand-gray">Búsquedas básicas, límites en features premium</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Education Pro</td>
                  <td className="px-4 py-2.5 text-brand-gray">$10/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Para estudiantes/educadores verificados</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Pro</td>
                  <td className="px-4 py-2.5 text-brand-gray">$20/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Búsquedas Pro ilimitadas, múltiples modelos IA</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Max</td>
                  <td className="px-4 py-2.5 text-brand-gray">$200/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Todo ilimitado</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubTitle>Funcionalidades académicas</SubTitle>

          <ul>
            <li><strong>Academic Focus mode:</strong> Prioriza fuentes revisadas por pares (peer-reviewed), filtrando blogs, noticias y contenido no académico.</li>
            <li><strong>Citas en línea:</strong> Cada afirmación incluye referencias numeradas con enlaces clicables a las fuentes originales.</li>
            <li><strong>Seguimiento de preguntas:</strong> Sugiere preguntas relacionadas para profundizar en el tema.</li>
          </ul>

          <InfoCallout>
            <p>
              Perplexity ofrece un plan Education Pro a $10/mes para estudiantes verificados, y algunas instituciones ofrecen el primer año gratis. Consulta si la Universidad de los Andes tiene convenio vigente.
            </p>
          </InfoCallout>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://www.perplexity.ai" target="_blank" rel="noopener noreferrer">
              perplexity.ai
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 11 — SCISPACE
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="scispace">11. SciSpace</SectionTitle>

          <p>
            <strong>SciSpace</strong> (anteriormente Typeset) es una plataforma de investigación con IA que aloja más de <strong>280 millones de artículos académicos</strong>. Su enfoque principal es facilitar la lectura, comprensión y análisis de papers científicos, haciendo que la revisión de literatura sea más eficiente. Su función <strong>Deep Review</strong> utiliza IA multi-agente y promete reducir el tiempo de revisión de literatura hasta en un <strong>70%</strong>.
          </p>

          <SubTitle>Funcionalidades principales</SubTitle>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 not-prose">
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Chat with PDF</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Haz preguntas sobre artículos específicos y obtén respuestas con citas exactas al texto del paper. Ideal para comprender metodologías complejas.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">AI Agent</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Flujos de trabajo automatizados: búsquedas, resúmenes listos para PRISMA, identificación de vacíos de investigación y análisis comparativo.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">AI Writer</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Genera borradores de esquemas y secciones de manuscritos basados en la literatura analizada.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Citation Generator</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Genera citas en APA, MLA y más de 9.000 estilos diferentes. Compatible con todos los formatos de revistas importantes.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">AI Detector</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Identifica contenido generado por inteligencia artificial. Útil para verificar la originalidad de textos académicos.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-200 p-5">
              <h4 className="font-semibold text-brand-dark text-base mb-2">Citation Booster</h4>
              <p className="text-sm text-brand-gray leading-relaxed">
                Convierte papers en video abstracts para aumentar la visibilidad y las citas de tus publicaciones.
              </p>
            </div>
          </div>

          <SubTitle>Precios</SubTitle>

          <p>
            SciSpace ofrece un plan <strong>gratuito con límites diarios</strong> y un plan <strong>Premium a $12/mes</strong> con acceso ilimitado a todas las funcionalidades.
          </p>

          <WarningCallout>
            <p>
              Como todas las herramientas de IA, SciSpace puede alucinar e interpretar en exceso los hallazgos. Siempre verifica las afirmaciones clave contra las fuentes originales. No confíes ciegamente en los resúmenes generados — léelos como un punto de partida, no como un sustituto de la lectura del paper.
            </p>
          </WarningCallout>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://scispace.com" target="_blank" rel="noopener noreferrer">
              scispace.com
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 12 — CONSENSUS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="consensus">12. Consensus</SectionTitle>

          <p>
            <strong>Consensus</strong> es un motor de búsqueda académico con IA que se distingue por usar <strong>exclusivamente literatura revisada por pares</strong>. No indexa blogs, noticias ni contenido web general — solo artículos de revistas científicas. Con más de <strong>200 millones de papers</strong> indexados, es una fuente confiable para obtener el consenso científico sobre preguntas específicas.
          </p>

          <SubTitle>Funcionalidades principales</SubTitle>

          <ul>
            <li><strong>Consensus Meter:</strong> Para preguntas de tipo sí/no, muestra un gráfico visual con el porcentaje de acuerdo y desacuerdo en la literatura científica. Por ejemplo: {'"'}¿Los bioplásticos a base de almidón son biodegradables en condiciones marinas?{'"'}</li>
            <li><strong>Deep Search (nuevo):</strong> Revisa más de <strong>1.000 papers</strong>, selecciona los ~50 más relevantes, y genera un reporte detallado con citas. Ideal para revisiones de literatura enfocadas.</li>
            <li><strong>Ask Paper:</strong> Chat individual con PDFs — haz preguntas sobre un artículo específico y obtén respuestas con citas exactas al texto.</li>
            <li><strong>Study Snapshot:</strong> Vista rápida de las características de un estudio: población, tamaño de muestra, métodos utilizados y hallazgos principales.</li>
          </ul>

          <SubTitle>Precios (abril 2026)</SubTitle>

          <ul>
            <li><strong>Free:</strong> 10 análisis/mes</li>
            <li><strong>Premium:</strong> $8,99/mes — análisis ilimitados</li>
            <li><strong>Pro:</strong> $15/mes — 15 Deep Searches por mes</li>
          </ul>

          <Collapsible id="consensus-ejemplo" title="Ejemplo de uso para Ingeniería Química">
            <p>
              Pregunta: <em>{'"'}¿Los bioplásticos a base de almidón son biodegradables en condiciones marinas?{'"'}</em>
            </p>
            <p>
              Consensus analizará la literatura peer-reviewed y mostrará:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>El porcentaje de estudios que confirman o niegan la biodegradabilidad marina.</li>
              <li>Resúmenes de los hallazgos principales de cada estudio relevante.</li>
              <li>Referencias completas para que puedas acceder a los artículos originales.</li>
            </ul>
            <p>
              Este tipo de consultas son perfectas para establecer el estado del arte en tu proyecto de investigación.
            </p>
          </Collapsible>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://consensus.app" target="_blank" rel="noopener noreferrer">
              consensus.app
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 13 — CONNECTED PAPERS
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="connected-papers">13. Connected Papers</SectionTitle>

          <p>
            <strong>Connected Papers</strong> es una herramienta visual para mapear redes de literatura científica. A partir de un artículo semilla (<em>seed paper</em>), genera un grafo interactivo que muestra los artículos más relacionados usando análisis de <strong>co-citación y acoplamiento bibliográfico</strong>. Cada grafo analiza aproximadamente <strong>50.000 papers</strong> para identificar las conexiones más relevantes.
          </p>

          <SubTitle>Cómo leer el grafo</SubTitle>

          <ul>
            <li><strong>Tamaño del nodo:</strong> Indica el número de citas — nodos más grandes representan artículos más citados.</li>
            <li><strong>Color del nodo:</strong> Indica el año de publicación — tonos más oscuros para publicaciones más recientes.</li>
            <li><strong>Proximidad entre nodos:</strong> Artículos cercanos en el grafo son temáticamente similares (layout de fuerzas dirigidas que agrupa papers similares).</li>
            <li><strong>Conexiones (aristas):</strong> Líneas que conectan artículos que comparten muchas citas en común.</li>
          </ul>

          <SubTitle>Funcionalidades</SubTitle>

          <ul>
            <li><strong>Prior Works:</strong> Artículos fundacionales anteriores al paper semilla — los {'"'}ancestros{'"'} intelectuales de tu investigación.</li>
            <li><strong>Derivative Works:</strong> Artículos posteriores que construyen sobre el paper semilla — las {'"'}ramificaciones{'"'} de la investigación.</li>
            <li><strong>Multi-origin graphs (nuevo):</strong> Permite usar múltiples papers como semilla para comparar y encontrar intersecciones entre diferentes líneas de investigación.</li>
            <li><strong>Exportación:</strong> Exporta listas de artículos a gestores de referencias como Zotero, Mendeley o EndNote.</li>
          </ul>

          <SubTitle>Base de datos y cobertura</SubTitle>

          <p>
            Connected Papers obtiene sus datos de <strong>Semantic Scholar, arXiv y PubMed</strong>. La cobertura es extensa en ciencias naturales, ingeniería, informática y biomedicina.
          </p>

          <SubTitle>Precios</SubTitle>

          <ul>
            <li><strong>Free:</strong> 5 grafos/mes</li>
            <li><strong>Academic:</strong> ~$3-6/mes — grafos ilimitados para investigadores</li>
            <li><strong>Business:</strong> ~$20/mes — funcionalidades empresariales</li>
          </ul>

          <p>
            <strong>Enlace:</strong>{' '}
            <a href="https://www.connectedpapers.com" target="_blank" rel="noopener noreferrer">
              connectedpapers.com
            </a>
          </p>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 14 — COMPARATIVA IA
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="comparativa-ia">14. Comparativa de herramientas de IA</SectionTitle>

          <p>
            La siguiente tabla compara las siete herramientas de IA cubiertas en esta guía, con información actualizada a abril de 2026:
          </p>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Plataforma</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Fortalezas</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Debilidades</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Ideal para</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">ChatGPT</td>
                  <td className="px-4 py-2.5 text-brand-gray">Deep Research potente, Study Mode, GPT-5.4 con 1M tokens, ecosistema extenso de plugins</td>
                  <td className="px-4 py-2.5 text-brand-gray">Alucinaciones frecuentes en referencias, plan gratuito con publicidad</td>
                  <td className="px-4 py-2.5 text-brand-gray">Exploración inicial, generación de ideas, estructuración de trabajos</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Google Gemini</td>
                  <td className="px-4 py-2.5 text-brand-gray">Integración con Google Scholar/Docs/Drive, multimodal, Deep Think para STEM</td>
                  <td className="px-4 py-2.5 text-brand-gray">Menos preciso que Claude en razonamiento, dependencia del ecosistema Google</td>
                  <td className="px-4 py-2.5 text-brand-gray">Usuarios del ecosistema Google, análisis multimodal, exportación a Docs</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Claude</td>
                  <td className="px-4 py-2.5 text-brand-gray">1M tokens de contexto, razonamiento científico superior, auto-verificación (Opus 4.7), pensamiento extendido</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sin búsqueda web integrada, requiere subir documentos manualmente</td>
                  <td className="px-4 py-2.5 text-brand-gray">Análisis profundo de papers, comparación de metodologías, interpretación de datos</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Perplexity</td>
                  <td className="px-4 py-2.5 text-brand-gray">93,9% factualidad, citas en línea, Academic Focus, 200M+ papers, Deep Research con Claude</td>
                  <td className="px-4 py-2.5 text-brand-gray">Análisis menos profundo que ChatGPT/Claude, plan Max costoso</td>
                  <td className="px-4 py-2.5 text-brand-gray">Verificación de datos, búsqueda con fuentes, respuestas rápidas con citas</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">SciSpace</td>
                  <td className="px-4 py-2.5 text-brand-gray">280M+ papers, Chat with PDF, AI Agent, generador de citas en 9.000+ estilos</td>
                  <td className="px-4 py-2.5 text-brand-gray">Puede sobre-interpretar hallazgos, cobertura desigual fuera de ciencias</td>
                  <td className="px-4 py-2.5 text-brand-gray">Lectura y comprensión de papers, generación de citas, revisiones PRISMA</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Consensus</td>
                  <td className="px-4 py-2.5 text-brand-gray">Solo peer-reviewed, Consensus Meter visual, Deep Search de 1.000+ papers</td>
                  <td className="px-4 py-2.5 text-brand-gray">Solo preguntas de investigación, sin análisis de documentos propios</td>
                  <td className="px-4 py-2.5 text-brand-gray">Estado del arte, preguntas sí/no sobre evidencia científica</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Connected Papers</td>
                  <td className="px-4 py-2.5 text-brand-gray">Visualización de redes, Prior/Derivative Works, multi-origin graphs</td>
                  <td className="px-4 py-2.5 text-brand-gray">Solo mapeo, sin análisis de contenido, limitado a Semantic Scholar/arXiv/PubMed</td>
                  <td className="px-4 py-2.5 text-brand-gray">Descubrir literatura relacionada, mapear campos de investigación, encontrar seminal papers</td>
                </tr>
              </tbody>
            </table>
          </div>

          <SubTitle>Referencia rápida</SubTitle>

          <div className="overflow-x-auto my-6 not-prose">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-50 text-left">
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Herramienta</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Mejor para</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Plan gratuito</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Desde</th>
                  <th className="px-4 py-2.5 font-semibold text-brand-dark border-b border-zinc-200">Fuentes peer-reviewed</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">ChatGPT</td>
                  <td className="px-4 py-2.5 text-brand-gray">Exploración, estructuración</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí (con publicidad)</td>
                  <td className="px-4 py-2.5 text-brand-gray">$8/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">No exclusivo</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Gemini</td>
                  <td className="px-4 py-2.5 text-brand-gray">Ecosistema Google, multimodal</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí</td>
                  <td className="px-4 py-2.5 text-brand-gray">$19,99/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">No exclusivo</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Claude</td>
                  <td className="px-4 py-2.5 text-brand-gray">Análisis de documentos</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí</td>
                  <td className="px-4 py-2.5 text-brand-gray">$20/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">No exclusivo</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Perplexity</td>
                  <td className="px-4 py-2.5 text-brand-gray">Búsqueda con citas</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí</td>
                  <td className="px-4 py-2.5 text-brand-gray">$10/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Academic Focus</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">SciSpace</td>
                  <td className="px-4 py-2.5 text-brand-gray">Lectura de papers, citas</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí (límites diarios)</td>
                  <td className="px-4 py-2.5 text-brand-gray">$12/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí (280M+)</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Consensus</td>
                  <td className="px-4 py-2.5 text-brand-gray">Consenso científico</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí (10 análisis/mes)</td>
                  <td className="px-4 py-2.5 text-brand-gray">$8,99/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí (exclusivo)</td>
                </tr>
                <tr className="border-b border-zinc-100">
                  <td className="px-4 py-2.5 font-medium text-brand-dark">Connected Papers</td>
                  <td className="px-4 py-2.5 text-brand-gray">Mapeo de literatura</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí (5 grafos/mes)</td>
                  <td className="px-4 py-2.5 text-brand-gray">~$3/mes</td>
                  <td className="px-4 py-2.5 text-brand-gray">Sí (Semantic Scholar)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 15 — FLUJO DE TRABAJO
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="flujo-trabajo">15. Flujo de trabajo recomendado</SectionTitle>

          <p>
            Combinar múltiples herramientas es la estrategia más efectiva para una revisión bibliográfica completa. El siguiente flujo de trabajo integra plataformas clásicas y herramientas de IA:
          </p>

          <ol>
            <li>
              <strong>Inicia con Google Scholar para una visión amplia:</strong> Busca tu tema con términos generales para entender el volumen de literatura, identificar los artículos más citados y descubrir autores clave. Usa la función {'"'}Citado por{'"'} para rastrear la evolución de ideas importantes.
            </li>
            <li>
              <strong>Refina en Web of Science o Scopus con operadores booleanos y sus capacidades de IA:</strong> Construye ecuaciones de búsqueda avanzadas con truncamiento, operadores de proximidad y filtros por campo. Aprovecha el Research Assistant de WoS o AI Discovery de Scopus para explorar la literatura de forma conversacional.
            </li>
            <li>
              <strong>Usa Connected Papers para mapear redes de investigación:</strong> Toma los artículos más relevantes de tu búsqueda y úsalos como semilla para descubrir papers relacionados que podrías haber pasado por alto. Explora tanto Prior Works como Derivative Works.
            </li>
            <li>
              <strong>Emplea SciSpace o Consensus para analizar contenido:</strong> Usa Chat with PDF de SciSpace para comprender papers complejos, o Consensus para verificar el estado del consenso científico sobre preguntas específicas.
            </li>
            <li>
              <strong>Usa ChatGPT Deep Research, Gemini Deep Research o Claude para investigaciones profundas:</strong> Para temas que requieren síntesis de múltiples fuentes, utiliza Deep Research de ChatGPT o Gemini. Para análisis detallado de documentos que ya tienes, sube los PDFs a Claude y solicita comparaciones, extracción de datos o identificación de contradicciones.
            </li>
            <li>
              <strong>Verifica datos específicos con Perplexity, revisando las fuentes citadas:</strong> Para cualquier dato, cifra o afirmación que necesites confirmar, usa Perplexity en modo Academic Focus. Siempre haz clic en las fuentes citadas para verificar que dicen lo que Perplexity afirma.
            </li>
          </ol>

          <TipCallout title="💡 Consejo para el proyecto POU">
            <p>
              Para el proyecto de Operaciones Unitarias, este flujo de trabajo te ayudará a encontrar datos de diseño, correlaciones empíricas y casos de estudio de procesos similares. Documenta cada búsqueda en tu bitácora de cálculo incluyendo la ecuación, la plataforma y la fecha.
            </p>
          </TipCallout>

          {/* ═══════════════════════════════════════════════════════════════
              SECTION 16 — CONCLUSIONES
          ═══════════════════════════════════════════════════════════════ */}
          <SectionTitle id="conclusiones">16. Conclusiones y recordatorios</SectionTitle>

          <p>
            Las herramientas de búsqueda bibliográfica están viviendo una transformación sin precedentes. Las plataformas clásicas — Google Scholar, Web of Science y Scopus — siguen siendo esenciales para acceder a la literatura indexada de alta calidad, pero ahora integran capacidades de inteligencia artificial que hacen las búsquedas más eficientes y los análisis más profundos.
          </p>

          <p>
            Por su parte, las herramientas de IA han evolucionado más allá de ser simples chatbots: hoy son <strong>agentes de investigación</strong> capaces de buscar, leer, analizar y sintetizar literatura científica de forma autónoma. Deep Research de ChatGPT, AI Discovery de Scopus, y el análisis documental de Claude representan un cambio fundamental en cómo hacemos investigación.
          </p>

          <WarningCallout title="⚠️ Recordatorios esenciales">
            <ul className="space-y-2">
              <li><strong>Siempre verifica las referencias generadas por IA.</strong> Las alucinaciones son un riesgo real — confirma que cada artículo citado existe realmente en Google Scholar, WoS o Scopus.</li>
              <li><strong>No todas las herramientas de IA tienen acceso a literatura reciente.</strong> Los modelos de lenguaje tienen fechas de corte de entrenamiento. Para lo más actual, usa las bases de datos directamente.</li>
              <li><strong>La IA complementa pero no reemplaza el análisis crítico.</strong> Tú eres responsable de evaluar la calidad de las fuentes, la validez de las metodologías y la relevancia de los hallazgos para tu investigación.</li>
              <li><strong>Combina múltiples herramientas para cobertura completa.</strong> Ninguna herramienta individual tiene toda la literatura. Usa al menos 2-3 plataformas diferentes.</li>
              <li><strong>Documenta tus búsquedas sistemáticamente.</strong> Registra las ecuaciones de búsqueda, las plataformas utilizadas, las fechas y el número de resultados. Esto es esencial para la reproducibilidad y la transparencia.</li>
              <li><strong>Declara el uso de herramientas de IA.</strong> Siguiendo la política AIAS del curso, siempre declara qué herramientas utilizaste y con qué propósito.</li>
            </ul>
          </WarningCallout>

          <p>
            La capacidad de realizar búsquedas bibliográficas efectivas es una habilidad que te acompañará durante toda tu carrera profesional — ya sea en investigación académica, en la industria o en consultoría. Las herramientas cambiarán y evolucionarán, pero los principios fundamentales permanecen: <strong>buscar con rigor, evaluar con criterio y documentar con transparencia</strong>. Dominar estas competencias hoy te dará una ventaja significativa como ingeniero químico.
          </p>

        </div>
      </div>
    </ReadingLayout>
  );
};

export default BusquedaBibliografica;
