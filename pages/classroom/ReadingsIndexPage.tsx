import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Reading, Presentation, Simulation } from '../../components/data/classroom';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';
import { NarrativasReadingsPage } from './NarrativasReadingsPage';

// Slug del cronograma: vive como tarjeta propia en la landing, no dentro de Guías.
const CRONOGRAMA_SLUG = 'cronograma-interactivo';

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
  const lecturas = course.readings
    .filter((r) => r.category === 'lectura')
    .sort(byOrderThenDate);
  const guias = course.readings
    .filter((r) => r.category !== 'lectura' && r.slug !== CRONOGRAMA_SLUG)
    .sort(byOrderThenDate);
  const presentaciones = [...(course.presentations ?? [])].sort(
    (a, b) => (a.sessionNumber ?? 0) - (b.sessionNumber ?? 0),
  );
  const simulaciones = course.simulations ?? [];

  const total = lecturas.length + guias.length + presentaciones.length + simulaciones.length;

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
              Todo en un solo lugar. Abre la sección que necesites: lecturas de clase,
              presentaciones, guías del proyecto y simulaciones interactivas.
            </p>
          </header>

          {total === 0 ? (
            <p className="mt-10 text-brand-gray">
              Aún no hay material publicado. Vuelve pronto.
            </p>
          ) : (
            <div className="mt-10 space-y-4">
              <MaterialSection
                eyebrow="Antes de clase"
                title="Lecturas"
                description="Una por sesión. Los quices salen de aquí."
                count={lecturas.length}
                defaultOpen
              >
                <CardList>
                  {lecturas.map((r, i) => (
                    <ReadingCard
                      key={r.slug}
                      r={r}
                      courseSlug={course.slug}
                      numberLabel={`Lectura ${String(r.order ?? i + 1).padStart(2, '0')}`}
                    />
                  ))}
                </CardList>
              </MaterialSection>

              <MaterialSection
                eyebrow="Para clase"
                title="Presentaciones"
                description="Diapositivas de cada sesión. Abren en pestaña nueva."
                count={presentaciones.length}
              >
                <CardList>
                  {presentaciones.map((p) => (
                    <SlideCard
                      key={p.id}
                      title={p.title}
                      eyebrow={p.sessionNumber !== undefined ? `Sesión ${p.sessionNumber}` : undefined}
                      meta={p.date}
                      description={p.description}
                      href={`/classroom/${course.slug}/slides/${p.file}`}
                    />
                  ))}
                </CardList>
              </MaterialSection>

              <MaterialSection
                eyebrow="Transversal"
                title="Guías"
                description="Metodología, entregables y herramientas del proyecto."
                count={guias.length}
              >
                <CardList>
                  {guias.map((r, i) => (
                    <ReadingCard
                      key={r.slug}
                      r={r}
                      courseSlug={course.slug}
                      numberLabel={`Guía ${String(r.order ?? i + 1).padStart(2, '0')}`}
                    />
                  ))}
                </CardList>
              </MaterialSection>

              {simulaciones.length > 0 && (
                <MaterialSection
                  eyebrow="Interactivo"
                  title="Simulaciones"
                  description="Explora el diseño de las operaciones en tiempo real."
                  count={simulaciones.length}
                >
                  <CardList>
                    {simulaciones.map((s) => (
                      <SlideCard
                        key={s.id}
                        title={s.title}
                        eyebrow={s.sessionNumber !== undefined ? `Sesión ${s.sessionNumber}` : undefined}
                        description={s.description}
                        tags={s.tags}
                        href={`/classroom/${course.slug}/simulaciones/${s.file}`}
                      />
                    ))}
                  </CardList>
                </MaterialSection>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </CourseAccessGate>
  );
};

// ── Sección colapsable ─────────────────────────────────────────────
interface MaterialSectionProps {
  eyebrow: string;
  title: string;
  description: string;
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const MaterialSection: React.FC<MaterialSectionProps> = ({
  eyebrow, title, description, count, defaultOpen, children,
}) => (
  <details
    className="group bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden"
    {...(defaultOpen ? { open: true } : {})}
  >
    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none px-5 sm:px-6 py-4 hover:bg-zinc-50 transition-colors [&::-webkit-details-marker]:hidden">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">{eyebrow}</p>
        <h2 className="mt-0.5 text-lg sm:text-xl font-bold text-brand-dark">{title}</h2>
        <p className="mt-1 text-sm text-brand-gray">{description}</p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-xs font-semibold text-brand-gray tabular-nums">
          {count} {count === 1 ? 'entrada' : 'entradas'}
        </span>
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 text-brand-dark group-open:bg-brand-yellow transition-colors">
          <svg className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </summary>
    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100">
      {count === 0 ? (
        <p className="py-4 text-sm text-brand-gray italic">Aún no hay material en esta sección.</p>
      ) : (
        children
      )}
    </div>
  </details>
);

const CardList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="space-y-3">{children}</ul>
);

// ── Tarjeta de diapositiva / simulación (link externo) ─────────────
interface SlideCardProps {
  title: string;
  eyebrow?: string;
  meta?: string;
  description?: string;
  tags?: string[];
  href: string;
}

const SlideCard: React.FC<SlideCardProps> = ({ title, eyebrow, meta, description, tags, href }) => (
  <li>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md hover:border-brand-yellow transition-all group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {eyebrow && (
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">{eyebrow}</p>
          )}
          <h3 className="mt-1 text-lg font-bold text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
            {title}
          </h3>
          {meta && <p className="mt-1 text-xs text-brand-gray">{meta}</p>}
          {description && (
            <p className="mt-2 text-sm text-brand-gray leading-relaxed line-clamp-3">{description}</p>
          )}
          {tags && tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <li key={t} className="px-2 py-0.5 rounded-full bg-zinc-100 text-brand-gray text-[11px] font-medium">{t}</li>
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
);

// ── Tarjeta de lectura / guía ──────────────────────────────────────
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
    <div className="relative flex-shrink-0 h-40 sm:h-auto sm:w-52 overflow-hidden" aria-hidden="true">
      <img
        src={r.bannerImg}
        alt=""
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ filter: 'grayscale(100%)' }}
        loading="lazy"
      />
      {num && (
        <span
          className="absolute inset-0 flex items-end justify-start font-black text-white select-none pointer-events-none leading-none"
          style={{ fontSize: '7rem', opacity: 0.55, paddingLeft: '0.15em', paddingBottom: '0.02em' }}
          aria-hidden="true"
        >
          {num}
        </span>
      )}
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
            <li key={t} className="px-2 py-0.5 rounded-full bg-zinc-100 text-brand-gray text-[11px] font-medium">
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
