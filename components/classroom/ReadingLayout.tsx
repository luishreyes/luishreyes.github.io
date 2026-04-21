import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, Reading } from '../data/classroom';

interface ReadingLayoutProps {
  course: Course;
  reading: Reading;
  children: React.ReactNode;
  /** When true the content area expands to max-w-6xl and the reading-prose wrapper is omitted so the caller controls layout. */
  wide?: boolean;
}

export const ReadingLayout: React.FC<ReadingLayoutProps> = ({ course, reading, children, wide = false }) => {
  return (
    <motion.article
      {...{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 },
      }}
      className="bg-white"
    >
      <header
        className="pt-28 pb-10 sm:pt-32 sm:pb-14 border-b border-zinc-200"
        style={{
          background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)',
        }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-brand-gray flex flex-wrap items-center gap-1.5">
            <Link to="/classroom" className="hover:text-brand-dark transition-colors">Classroom</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/classroom/${course.slug}`} className="hover:text-brand-dark transition-colors">{course.code}</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/classroom/${course.slug}/readings`} className="hover:text-brand-dark transition-colors">Material del curso</Link>
          </nav>

          <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark leading-tight">
            {reading.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-brand-gray">
            <time dateTime={reading.date}>{formatDate(reading.date)}</time>
            {reading.readingMinutes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{reading.readingMinutes} min de lectura</span>
              </>
            )}
            {reading.tags && reading.tags.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <ul className="flex flex-wrap gap-1.5">
                  {reading.tags.map((t) => (
                    <li
                      key={t}
                      className="px-2 py-0.5 rounded-full bg-zinc-100 text-brand-gray text-[11px] font-medium"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </header>

      <div className={`${wide ? 'max-w-6xl' : 'max-w-3xl'} mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
        {wide ? children : <div className="reading-prose">{children}</div>}

        <div className="mt-14 pt-8 border-t border-zinc-200">
          <Link
            to={`/classroom/${course.slug}/readings`}
            className="inline-flex items-center gap-2 text-sm text-brand-dark hover:text-brand-yellow-dark transition-colors"
          >
            <span aria-hidden="true">←</span> Volver al material del curso
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
};
