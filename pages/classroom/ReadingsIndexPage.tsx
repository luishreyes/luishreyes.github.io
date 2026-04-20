import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';

export const ReadingsIndexPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course) return <NotFoundInClassroom />;

  const sorted = [...course.readings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        }}
        className="pt-28 pb-16 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <nav className="text-xs text-brand-gray flex flex-wrap items-center gap-1.5">
            <Link to="/classroom" className="hover:text-brand-dark transition-colors">Classroom</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/classroom/${course.slug}`} className="hover:text-brand-dark transition-colors">{course.code}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-brand-dark">Lecturas</span>
          </nav>

          <header className="mt-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              {course.code} · Lecturas
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-brand-dark">
              Material de lectura
            </h1>
            <p className="mt-3 text-brand-gray leading-relaxed max-w-2xl">
              Entradas cortas para preparar cada sesión y profundizar después de clase.
            </p>
          </header>

          {sorted.length === 0 ? (
            <p className="mt-10 text-brand-gray">
              Aún no hay lecturas publicadas. Vuelve pronto.
            </p>
          ) : (
            <ul className="mt-10 space-y-4">
              {sorted.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/classroom/${course.slug}/readings/${r.slug}`}
                    className="block bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md hover:border-brand-yellow transition-all group"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-brand-gray">
                      <time dateTime={r.date}>{formatDate(r.date)}</time>
                      {r.readingMinutes && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{r.readingMinutes} min</span>
                        </>
                      )}
                    </div>
                    <h2 className="mt-2 text-lg sm:text-xl font-bold text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
                      {r.title}
                    </h2>
                    <p className="mt-2 text-sm text-brand-gray leading-relaxed">
                      {r.summary}
                    </p>
                    {r.tags && r.tags.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {r.tags.map((t) => (
                          <li
                            key={t}
                            className="px-2 py-0.5 rounded-full bg-zinc-100 text-brand-gray text-[11px] font-medium"
                          >
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </CourseAccessGate>
  );
};

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
};
