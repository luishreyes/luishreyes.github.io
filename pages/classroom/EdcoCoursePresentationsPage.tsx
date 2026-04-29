import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getCourseBySlug,
  type Presentation,
} from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';

export const EdcoCoursePresentationsPage: React.FC = () => {
  const { courseSlug, edcoCourseId } = useParams<{
    courseSlug: string;
    edcoCourseId: string;
  }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course || course.kind !== 'professional') return <NotFoundInClassroom />;

  const edcoCourse = course.edcoCourses?.find((ec) => ec.id === edcoCourseId);
  if (!edcoCourse) return <NotFoundInClassroom />;

  const presentations = (edcoCourse.presentationIds ?? [])
    .map((id) => course.presentations.find((p) => p.id === id))
    .filter((p): p is Presentation => Boolean(p))
    .sort((a, b) => (a.sessionNumber ?? 0) - (b.sessionNumber ?? 0));

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        }}
        className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-zinc-50"
      >
        <div className="max-w-5xl mx-auto">
          <nav className="text-xs text-brand-gray flex flex-wrap items-center gap-1.5">
            <Link to="/classroom" className="hover:text-brand-dark transition-colors">
              Classroom
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to={`/classroom/${course.slug}`}
              className="hover:text-brand-dark transition-colors"
            >
              {course.title}
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to={`/classroom/${course.slug}/cursos/${edcoCourse.id}`}
              className="hover:text-brand-dark transition-colors"
            >
              {edcoCourse.edition}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-dark">Presentaciones</span>
          </nav>

          <header className="mt-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              {edcoCourse.edition} · Presentaciones
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-brand-dark">
              {edcoCourse.title}
            </h1>
            <p className="mt-3 text-brand-gray leading-relaxed max-w-2xl">
              Slides de las sesiones que dicto en este curso. Abren en pestaña nueva.
              Cuando comparto una presentación con un estudiante usa un código único
              independiente del acceso al curso.
            </p>
          </header>

          {presentations.length === 0 ? (
            <p className="mt-10 text-brand-gray">
              Aún no hay presentaciones publicadas para este curso. Vuelve pronto.
            </p>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {presentations.map((p) => (
                <li key={p.id}>
                  <article className="h-full bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-lg hover:border-brand-yellow transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {p.sessionNumber !== undefined && (
                          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
                            Sesión {p.sessionNumber}
                          </p>
                        )}
                        <h2 className="mt-1 text-lg font-bold text-brand-dark">
                          {p.title}
                        </h2>
                        {p.date && (
                          <p className="mt-1 text-xs text-brand-gray">{p.date}</p>
                        )}
                        {p.description && (
                          <p className="mt-3 text-sm text-brand-gray leading-relaxed">
                            {p.description}
                          </p>
                        )}
                      </div>
                      <a
                        href={`/classroom/${course.slug}/slides/${p.file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-brand-dark hover:bg-brand-yellow transition-colors"
                        aria-label={`Abrir ${p.title}`}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>

                    {p.shareCode && (
                      <div className="mt-4 pt-4 border-t border-zinc-100 text-[11px] text-brand-gray">
                        <p className="font-semibold tracking-widest uppercase text-brand-yellow-dark">
                          Compartir con estudiantes
                        </p>
                        <p className="mt-1">
                          Enlace:{' '}
                          <code className="px-1.5 py-0.5 bg-zinc-50 rounded border border-zinc-200 break-all">
                            /classroom/{course.slug}/share/{p.id}
                          </code>
                        </p>
                        <p className="mt-1">
                          Código:{' '}
                          <code className="px-1.5 py-0.5 bg-zinc-50 rounded border border-zinc-200 font-mono">
                            {p.shareCode}
                          </code>
                        </p>
                      </div>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </CourseAccessGate>
  );
};
