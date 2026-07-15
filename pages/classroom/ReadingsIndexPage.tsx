import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Reading } from '../../components/data/classroom';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';
import { NarrativasReadingsPage } from './NarrativasReadingsPage';

export const ReadingsIndexPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course) return <NotFoundInClassroom />;

  // Identidad gráfica propia del curso Narrativas Visuales (IQYA-3751).
  if (course.slug === 'iqya-3751-2026-20') {
    return <NarrativasReadingsPage course={course} />;
  }

  const byOrderThenDate = (a: Reading, b: Reading) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    return b.date.localeCompare(a.date);
  };
  const lecturas = course.readings.filter((r) => r.category === 'lectura').sort(byOrderThenDate);
  const guias = course.readings.filter((r) => r.category !== 'lectura').sort(byOrderThenDate);

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

          {course.readings.length === 0 ? (
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
                numberPrefix="Lectura"
                emptyLabel="Aún no hay lecturas publicadas para este semestre."
              />
              <Section
                title="Guías del curso"
                description="Material transversal sobre metodología, entregables y herramientas del proyecto."
                count={guias.length}
                courseSlug={course.slug}
                items={guias}
                numberPrefix="Guía"
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
  numberPrefix?: string;
}

const Section: React.FC<SectionProps> = ({ title, description, count, courseSlug, items, emptyLabel, numberPrefix }) => (
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
      <ul className="mt-6 space-y-3">
        {items.map((r, i) => {
          const numberLabel = numberPrefix
            ? `${numberPrefix} ${String(r.order ?? i + 1).padStart(2, '0')}`
            : null;
          return (
            <ReadingCard
              key={r.slug}
              r={r}
              courseSlug={courseSlug}
              numberLabel={numberLabel}
            />
          );
        })}
      </ul>
    )}
  </section>
);

interface ReadingCardProps {
  r: Reading;
  courseSlug: string;
  numberLabel: string | null;
}

const ReadingCard: React.FC<ReadingCardProps> = ({ r, courseSlug, numberLabel }) => {
  const num = r.order ? String(r.order).padStart(2, '0') : null;
  const hasBanner = !!r.bannerImg;

  const wrapClass = [
    'block bg-white rounded-xl border border-zinc-200 shadow-sm',
    'hover:shadow-md hover:border-brand-yellow transition-all group overflow-hidden',
    hasBanner ? 'flex flex-col sm:flex-row' : 'p-6',
  ].join(' ');

  const photoPanel = hasBanner ? (
    <div
      className="relative flex-shrink-0 h-40 sm:h-auto sm:w-52 overflow-hidden"
      aria-hidden="true"
    >
      <img
        src={r.bannerImg}
        alt=""
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ filter: 'grayscale(100%)' }}
        loading="lazy"
      />
      {/* number watermark */}
      {num && (
        <span
          className="absolute inset-0 flex items-end justify-start font-black text-white select-none pointer-events-none leading-none"
          style={{ fontSize: '7rem', opacity: 0.55, paddingLeft: '0.15em', paddingBottom: '0.02em' }}
          aria-hidden="true"
        >
          {num}
        </span>
      )}
      {/* subtle gradient to blend watermark number with content side */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
    </div>
  ) : null;

  const textContent = (
    <div className={hasBanner ? 'flex-1 p-5 flex flex-col justify-between min-w-0' : ''}>
      <div>
        {numberLabel && (
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
            {numberLabel}
          </p>
        )}
        <div className={`${numberLabel ? 'mt-1.5 ' : ''}flex flex-wrap items-center gap-2 text-xs text-brand-gray`}>
          <time dateTime={r.date}>{formatDate(r.date)}</time>
          {r.readingMinutes && (
            <>
              <span aria-hidden="true">·</span>
              <span>{r.readingMinutes} min</span>
            </>
          )}
          {r.href && (
            <>
              <span aria-hidden="true">·</span>
              <span>Documento ↗</span>
            </>
          )}
        </div>
        <h3 className="mt-2 text-lg sm:text-xl font-bold text-brand-dark group-hover:text-brand-yellow-dark transition-colors line-clamp-2">
          {r.title}
        </h3>
        <p className="mt-2 text-sm text-brand-gray leading-relaxed line-clamp-3">
          {r.summary}
        </p>
      </div>
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
    </div>
  );

  const inner = (
    <>
      {photoPanel}
      {textContent}
    </>
  );

  return (
    <li>
      {r.href ? (
        <a href={r.href} target="_blank" rel="noopener noreferrer" className={wrapClass}>
          {inner}
        </a>
      ) : (
        <Link to={`/classroom/${courseSlug}/readings/${r.slug}`} className={wrapClass}>
          {inner}
        </Link>
      )}
    </li>
  );
};

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
};
