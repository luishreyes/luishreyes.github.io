import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, Reading } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import '../../components/classroom/narrativas-theme.css';

/* ============================================================
   NarrativasReadingsPage — «Material del curso» en la identidad
   del curso (carbón · hueso · citrón). Misma información que la
   página compartida, en el sistema Narrativas Visuales.
   ============================================================ */

interface Props {
  course: Course;
}

const byOrderThenDate = (a: Reading, b: Reading) => {
  const ao = a.order ?? Number.POSITIVE_INFINITY;
  const bo = b.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  return b.date.localeCompare(a.date);
};

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
};

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" style={{ width: '0.9em', height: '0.9em' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const ReadingCard: React.FC<{ r: Reading; courseSlug: string; numberLabel: string | null }> = ({ r, courseSlug, numberLabel }) => {
  const num = r.order ? String(r.order).padStart(2, '0') : null;
  const hasBanner = !!r.bannerImg;

  const inner = (
    <>
      {hasBanner && (
        <div className="nv-rc-photo" aria-hidden="true">
          <img src={r.bannerImg} alt="" loading="lazy" style={{ filter: 'grayscale(100%)' }} />
          {num && <span className="nv-rc-watermark nv-num">{num}</span>}
        </div>
      )}
      <div className="nv-rc-body">
        <div>
          {numberLabel && <p className="nv-label nv-label--accent">{numberLabel}</p>}
          <div className="nv-rc-meta">
            <time dateTime={r.date}>{formatDate(r.date)}</time>
            {r.readingMinutes && (<><span aria-hidden="true">·</span><span>{r.readingMinutes} min</span></>)}
            {r.href && (<><span aria-hidden="true">·</span><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--nv-accent)' }}>Documento <ExternalIcon /></span></>)}
          </div>
          <h3 className="nv-rc-title">{r.title}</h3>
          <p className="nv-rc-summary">{r.summary}</p>
        </div>
        {r.tags && r.tags.length > 0 && (
          <ul className="nv-rc-tags">
            {r.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </div>
    </>
  );

  const cls = `nv-rc${hasBanner ? ' nv-rc--photo' : ''}`;
  return (
    <li>
      {r.href ? (
        <a href={r.href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>
      ) : (
        <Link to={`/classroom/${courseSlug}/readings/${r.slug}`} className={cls}>{inner}</Link>
      )}
    </li>
  );
};

const ReadingSection: React.FC<{
  title: string;
  description: string;
  items: Reading[];
  courseSlug: string;
  numberPrefix: string;
  emptyLabel: string;
}> = ({ title, description, items, courseSlug, numberPrefix, emptyLabel }) => (
  <section style={{ marginTop: 48 }}>
    <div className="nv-rc-head">
      <div>
        <h2 style={{ fontSize: 30, textTransform: 'uppercase' }}>{title}</h2>
        <p style={{ marginTop: 6, color: 'var(--nv-text-muted)', fontSize: 15 }}>{description}</p>
      </div>
      <span className="nv-label">{items.length} {items.length === 1 ? 'entrada' : 'entradas'}</span>
    </div>
    {items.length === 0 ? (
      <p style={{ marginTop: 22, color: 'var(--nv-text-faint)', fontStyle: 'italic', fontSize: 14 }}>{emptyLabel}</p>
    ) : (
      <ul className="nv-rc-list">
        {items.map((r, i) => (
          <ReadingCard
            key={r.slug}
            r={r}
            courseSlug={courseSlug}
            numberLabel={`${numberPrefix} ${String(r.order ?? i + 1).padStart(2, '0')}`}
          />
        ))}
      </ul>
    )}
  </section>
);

export const NarrativasReadingsPage: React.FC<Props> = ({ course }) => {
  const lecturas = course.readings.filter((r) => r.category === 'lectura').sort(byOrderThenDate);
  const guias = course.readings.filter((r) => r.category !== 'lectura').sort(byOrderThenDate);

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }}
        className="nv-course"
        style={{ minHeight: '100vh', paddingTop: 112, paddingBottom: 80 }}
      >
        <div className="nv-wrap" style={{ maxWidth: 940 }}>
          <nav className="nv-label" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <Link to="/classroom" style={{ color: 'var(--nv-text-faint)' }}>Classroom</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/classroom/${course.slug}`} style={{ color: 'var(--nv-text-faint)' }}>{course.code}</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--nv-accent)' }}>Material del curso</span>
          </nav>

          <header style={{ marginTop: 26 }}>
            <p className="nv-label nv-label--accent">{course.code} · Material del curso</p>
            <h1 style={{ marginTop: 12, fontSize: 'clamp(40px, 7vw, 68px)', textTransform: 'uppercase', lineHeight: 0.94 }}>
              Material del curso
            </h1>
            <p style={{ marginTop: 16, color: 'var(--nv-text-muted)', fontSize: 17, lineHeight: 1.55, maxWidth: '58ch' }}>
              Guías de proceso para el proyecto y lecturas que acompañan cada clase presencial.
            </p>
          </header>

          {course.readings.length === 0 ? (
            <p style={{ marginTop: 40, color: 'var(--nv-text-muted)' }}>Aún no hay material publicado. Vuelve pronto.</p>
          ) : (
            <>
              <ReadingSection
                title="Lecturas de clase"
                description="Una por sesión. Prepáralas antes de la clase presencial; los quices salen de aquí."
                items={lecturas}
                courseSlug={course.slug}
                numberPrefix="Lectura"
                emptyLabel="Aún no hay lecturas publicadas para este semestre."
              />
              <ReadingSection
                title="Guías del curso"
                description="Material transversal sobre metodología, entregables y herramientas del proyecto."
                items={guias}
                courseSlug={course.slug}
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
