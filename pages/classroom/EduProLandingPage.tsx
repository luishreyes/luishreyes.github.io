import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, EdcoCourse, Presentation } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';

interface EduProLandingPageProps {
  course: Course;
}

// Orden de despliegue de las temáticas — no depende del curso/cohorte de origen.
const THEME_ORDER = [
  'Fundamentos e historia de la IA',
  'Cómo aprenden las máquinas',
  'Modelos generativos de lenguaje (LLMs)',
  'Generación de imágenes por IA',
  'IA multimodal y narrativas visuales',
  'Análisis de datos con IA generativa',
];

// Etiqueta corta de audiencia por cohorte EDCO — para distinguir, dentro de una
// misma temática, versiones adaptadas a distintos públicos (p. ej. CGR vs. curso abierto).
const AUDIENCE_LABEL: Record<string, string> = {
  'curso-2-ia-mayo-2026': 'Curso abierto · Mayo 2026',
  'curso-3-generalidades-ia-g2': 'CGR · Generalidades de la IA',
  'curso-4-modelos-ia': 'CGR · Modelos de la IA',
};

export const EduProLandingPage: React.FC<EduProLandingPageProps> = ({ course }) => {
  const edcoCourses = course.edcoCourses ?? [];
  const presentations = course.presentations ?? [];

  const audienceByPresentationId = new Map<string, string>();
  edcoCourses.forEach((ec) => {
    (ec.presentationIds ?? []).forEach((id) => {
      audienceByPresentationId.set(id, AUDIENCE_LABEL[ec.id] ?? ec.title);
    });
  });

  const themedGroups = THEME_ORDER.map((theme) => ({
    theme,
    items: presentations.filter((p) => p.theme === theme),
  })).filter((g) => g.items.length > 0);

  const untitledGroup = presentations.filter((p) => !p.theme);

  return (
    <CourseAccessGate course={course}>
    <motion.div
      {...{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.4 },
      }}
      className="bg-zinc-50 min-h-screen"
    >
      <Hero course={course} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
            Material
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-dark">
            Presentaciones por temática
          </h2>
          <p className="mt-2 text-sm text-brand-gray max-w-2xl">
            Cada presentación es autocontenida y abre directo en pestaña nueva —
            listas para presentar sin depender de ningún curso. Cuando un tema
            tiene más de una versión, cada tarjeta indica para qué público fue
            adaptada.
          </p>
        </header>

        {presentations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-zinc-200 p-8 text-center text-brand-gray">
            Aún no hay material publicado en este espacio.
          </div>
        ) : (
          <div className="space-y-10">
            {themedGroups.map((group) => (
              <section key={group.theme}>
                <h3 className="text-lg font-bold text-brand-dark mb-3">{group.theme}</h3>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((p) => (
                    <li key={p.id}>
                      <PresentationCard
                        courseSlug={course.slug}
                        presentation={p}
                        audience={audienceByPresentationId.get(p.id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {untitledGroup.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-brand-dark mb-3">Otras presentaciones</h3>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {untitledGroup.map((p) => (
                    <li key={p.id}>
                      <PresentationCard
                        courseSlug={course.slug}
                        presentation={p}
                        audience={audienceByPresentationId.get(p.id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>

      {edcoCourses.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-4">
          <header className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              Cronograma en vivo
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-dark">
              Cursos con equipo, horario y Zoom
            </h2>
            <p className="mt-2 text-sm text-brand-gray max-w-2xl">
              Si necesitas el enlace de la sesión, el equipo docente o el
              cronograma completo de una cohorte específica, entra aquí.
            </p>
          </header>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {edcoCourses.map((ec) => (
              <li key={ec.id}>
                <EdcoCourseHubCard courseSlug={course.slug} edcoCourse={ec} />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="pb-20" />
    </motion.div>
    </CourseAccessGate>
  );
};

const Hero: React.FC<{ course: Course }> = ({ course }) => (
  <div
    className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.9), rgba(26,26,26,0.7)), url(${course.bannerUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/classroom"
        className="inline-flex items-center text-sm text-zinc-200 hover:text-brand-yellow transition-colors"
      >
        <span aria-hidden="true" className="mr-1">←</span> Classroom
      </Link>

      <motion.div
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.1 },
        }}
        className="mt-4 max-w-3xl"
      >
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-brand-yellow">
          {course.term}
        </p>
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
          {course.title}
        </h1>
        {course.tagline && (
          <p className="mt-2 text-base sm:text-lg text-zinc-100 font-medium">{course.tagline}</p>
        )}
      </motion.div>
    </div>
  </div>
);

const PresentationCard: React.FC<{
  courseSlug: string;
  presentation: Presentation;
  audience?: string;
}> = ({ courseSlug, presentation, audience }) => (
  <motion.div
    {...{
      whileHover: { y: -4 },
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    }}
    className="h-full"
  >
    <a
      href={`/classroom/${courseSlug}/slides/${presentation.file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg hover:border-brand-yellow transition-all p-6 group"
    >
      {audience && (
        <p className="text-[11px] font-semibold tracking-widest uppercase text-brand-yellow-dark">
          {audience}
        </p>
      )}
      <h4 className="mt-1 text-base font-bold text-brand-dark leading-tight group-hover:text-brand-yellow-dark transition-colors">
        {presentation.title}
      </h4>

      {presentation.description && (
        <p className="mt-3 text-sm text-brand-gray line-clamp-3 leading-relaxed">
          {presentation.description}
        </p>
      )}

      <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-end text-sm font-medium text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
        Abrir presentación
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </a>
  </motion.div>
);

const EdcoCourseHubCard: React.FC<{ courseSlug: string; edcoCourse: EdcoCourse }> = ({
  courseSlug,
  edcoCourse,
}) => {
  const presentationCount = (edcoCourse.presentationIds ?? []).length;

  return (
    <motion.div
      {...{
        whileHover: { y: -4 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="h-full"
    >
      <Link
        to={`/classroom/${courseSlug}/cursos/${edcoCourse.id}`}
        className="block h-full bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg hover:border-brand-yellow transition-all p-6 group"
      >
        <h3 className="text-lg font-bold text-brand-dark leading-tight group-hover:text-brand-yellow-dark transition-colors">
          {edcoCourse.title}
        </h3>

        <p className="mt-3 text-sm text-brand-gray line-clamp-3 leading-relaxed">
          {edcoCourse.description}
        </p>

        <p className="mt-4 text-xs text-brand-gray">
          {presentationCount === 0
            ? 'Sin presentaciones aún'
            : `${presentationCount} ${presentationCount === 1 ? 'presentación' : 'presentaciones'}`}
        </p>

        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-end text-sm font-medium text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
          Ver cronograma
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
};
