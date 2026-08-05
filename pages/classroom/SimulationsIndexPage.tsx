import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseBySlug } from '../../components/data/classroom';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { useCourseRelease } from '../../components/classroom/courseRelease';
import { NotFoundInClassroom } from './NotFoundInClassroom';

export const SimulationsIndexPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course) return <NotFoundInClassroom />;

  return (
    <CourseAccessGate course={course}>
      <SimulationsIndex course={course} />
    </CourseAccessGate>
  );
};

const SimulationsIndex: React.FC<{ course: Course }> = ({ course }) => {
  const { isWeekOpen } = useCourseRelease(course);

  // Con entrega gradual, solo las simulaciones de las semanas ya abiertas.
  const sims = (course.simulations ?? [])
    .filter((s) => isWeekOpen(s.week))
    .sort((a, b) => (a.sessionNumber ?? 0) - (b.sessionNumber ?? 0));

  return (
    <>
      <motion.div
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        }}
        className="pt-28 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <nav className="text-xs text-brand-gray flex flex-wrap items-center gap-1.5">
            <Link to="/classroom" className="hover:text-brand-dark transition-colors">Classroom</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/classroom/${course.slug}`} className="hover:text-brand-dark transition-colors">{course.code}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-dark">Simulaciones</span>
          </nav>

          <header className="mt-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              {course.code} · Simulaciones
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-brand-dark">
              Simulaciones interactivas
            </h1>
            <p className="mt-3 text-brand-gray leading-relaxed max-w-2xl">
              Herramientas para explorar el diseño de las operaciones del proyecto.
              Abren en una pestaña nueva; mueve los deslizadores y observa cómo
              responde el sistema en tiempo real. Funcionan en laptop, iPad e iPhone.
            </p>
          </header>

          {sims.length === 0 ? (
            <p className="mt-10 text-brand-gray">
              Aún no hay simulaciones publicadas. Vuelve pronto.
            </p>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {sims.map((sim) => (
                <li key={sim.id}>
                  <a
                    href={`/classroom/${course.slug}/simulaciones/${sim.file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-lg hover:border-brand-yellow transition-all group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {sim.sessionNumber !== undefined && (
                          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
                            Sesión {sim.sessionNumber}
                          </p>
                        )}
                        <h2 className="mt-1 text-lg font-bold text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
                          {sim.title}
                        </h2>
                        <p className="mt-3 text-sm text-brand-gray leading-relaxed line-clamp-4">
                          {sim.description}
                        </p>
                        {sim.tags && sim.tags.length > 0 && (
                          <ul className="mt-4 flex flex-wrap gap-1.5">
                            {sim.tags.map((t) => (
                              <li
                                key={t}
                                className="px-2 py-0.5 rounded-full bg-zinc-100 text-brand-gray text-[11px] font-medium"
                              >
                                {t}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <span className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-brand-dark group-hover:bg-brand-yellow group-hover:text-brand-dark transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-12 p-5 bg-zinc-100 rounded-xl border border-zinc-200">
            <h3 className="text-sm font-semibold text-brand-dark">Cómo usarlas en el proyecto</h3>
            <ul className="mt-2 text-sm text-brand-gray space-y-1 list-disc list-inside marker:text-brand-yellow-dark">
              <li>Explora los límites: sube el reflujo hasta reflujo total, bájalo hasta Rmín y observa cómo cambian las etapas.</li>
              <li>Contrasta los resultados con tus cálculos manuales de la bitácora antes de confiar en ellos.</li>
              <li>Usa el sistema etanol–agua para razonar sobre la recuperación del etanol de precipitación.</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </>
  );
};
