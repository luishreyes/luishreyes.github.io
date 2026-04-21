import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Reading } from '../../components/data/classroom';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';

export const ReadingsIndexPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course) return <NotFoundInClassroom />;

  const sorted = [...course.readings].sort((a, b) => b.date.localeCompare(a.date));
  const lecturas = sorted.filter((r) => r.category === 'lectura');
  const guias = sorted.filter((r) => r.category !== 'lectura');

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
            <span className="text-brand-dark">Material del curso</span>
          </nav>

          <header className="mt-5">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              {course.code} · Material del curso
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-brand-dark">
              Material del curso
            </h1>
            <p className="mt-3 text-brand-gray leading-relaxed max-w-2xl">
              Guías de proceso para el proyecto y lecturas que acompañan cada clase presencial.
            </p>
          </header>

          {sorted.length === 0 ? (
            <p className="mt-10 text-brand-gray">
              Aún no hay material publicado. Vuelve pronto.
            </p>
          ) : (
            <>
              <Section
                title="Lecturas de clase"
                description="Una por sesión. Prepáralas antes de la clase presencial; los quices salen de aquí."
                count={lecturas.length}
                courseSlug={course.slug}
                items={lecturas}
                emptyLabel="Aún no hay lecturas publicadas para este semestre."
              />
              <Section
                title="Guías del curso"
                description="Material transversal sobre metodología, entregables y herramientas del proyecto."
                count={guias.length}
                courseSlug={course.slug}
                items={guias}
                emptyLabel="Aún no hay guías publicadas."
              />
            </>
          )}
        </div>
      </motion.div>
    </CourseAccessGate>
  );
};

interface SectionProps {
  title: string;
  description: string;
  count: number;
  courseSlug: string;
  items: Reading[];
  emptyLabel: string;
}

const Section: React.FC<SectionProps> = ({ title, description, count, courseSlug, items, emptyLabel }) => (
  <section className="mt-12">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-zinc-200 pb-3">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-dark">{title}</h2>
        <p className="mt-1 text-sm text-brand-gray">{description}</p>
      </div>
      <span className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
        {count} {count === 1 ? 'entrada' : 'entradas'}
      </span>
    </div>

    {items.length === 0 ? (
      <p className="mt-6 text-sm text-brand-gray italic">{emptyLabel}</p>
    ) : (
      <ul className="mt-6 space-y-4">
        {items.map((r) => (
          <li key={r.slug}>
            <Link
              to={`/classroom/${courseSlug}/readings/${r.slug}`}
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
              <h3 className="mt-2 text-lg sm:text-xl font-bold text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
                {r.title}
              </h3>
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
  </section>
);

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
};
