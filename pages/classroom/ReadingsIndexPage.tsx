import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Reading, Presentation, Simulation, CronogramaEntry } from '../../components/data/classroom';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';
import { NarrativasReadingsPage } from './NarrativasReadingsPage';

// Slug del cronograma: vive como tarjeta propia en la landing, no dentro de Guías.
const CRONOGRAMA_SLUG = 'cronograma-interactivo';

// Construye la ruta del visor en la misma página a partir de una ruta absoluta
// del curso (p. ej. el href de una lectura o la ruta de una simulación). La
// cola después de «/classroom/{slug}/» viaja como splat de la ruta /ver/*.
const toViewer = (courseSlug: string, absPath: string): string => {
  const prefix = `/classroom/${courseSlug}/`;
  const tail = absPath.startsWith(prefix) ? absPath.slice(prefix.length) : absPath.replace(/^\//, '');
  return `/classroom/${courseSlug}/ver/${tail}`;
};

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

  // Si el curso tiene cronograma, el material se organiza por semana; si no,
  // se conserva el agrupamiento por tipo.
  const hasWeeks = !!(course.cronograma && course.cronograma.length > 0);

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
              {hasWeeks
                ? 'Organizado por semana. Abra la semana que necesite; se despliega sola la de hoy. Lo transversal al proyecto está en «Del curso».'
                : 'Todo en un solo lugar. Abra la sección que necesite: lecturas de clase, presentaciones, guías del proyecto y simulaciones interactivas.'}
            </p>
          </header>

          {total === 0 ? (
            <p className="mt-10 text-brand-gray">
              Aún no hay material publicado. Vuelva pronto.
            </p>
          ) : hasWeeks ? (
            <WeeklyView
              courseSlug={course.slug}
              cronograma={course.cronograma!}
              lecturas={lecturas}
              guias={guias}
              presentaciones={presentaciones}
              simulaciones={simulaciones}
            />
          ) : (
            <TypeView
              courseSlug={course.slug}
              lecturas={lecturas}
              guias={guias}
              presentaciones={presentaciones}
              simulaciones={simulaciones}
            />
          )}
        </div>
      </motion.div>
    </CourseAccessGate>
  );
};

// ── Vista por semanas (cuando el curso tiene cronograma) ───────────
interface ViewProps {
  courseSlug: string;
  lecturas: Reading[];
  guias: Reading[];
  presentaciones: Presentation[];
  simulaciones: Simulation[];
}

const WeeklyView: React.FC<ViewProps & { cronograma: CronogramaEntry[] }> = ({
  courseSlug, cronograma, lecturas, guias, presentaciones, simulaciones,
}) => {
  // Metadatos por semana (número → topics, fechas, quices/talleres).
  const weekMeta = new Map<number, { topics: string[]; dates: string[]; quiz: string[]; taller: string[] }>();
  for (const e of cronograma) {
    const m = weekMeta.get(e.week) ?? { topics: [], dates: [], quiz: [], taller: [] };
    if (e.topic && !m.topics.includes(e.topic)) m.topics.push(e.topic);
    m.dates.push(e.date);
    if (e.quiz) m.quiz.push(e.quiz);
    if (e.taller) m.taller.push(e.taller);
    weekMeta.set(e.week, m);
  }

  // Material transversal (sin semana): las guías del proyecto.
  const transversal = guias.filter((g) => g.week === undefined);

  // Solo se muestran las semanas con al menos un material descargable.
  const weeksWithMaterial = Array.from(weekMeta.keys())
    .filter((w) =>
      lecturas.some((r) => r.week === w) ||
      guias.some((r) => r.week === w) ||
      presentaciones.some((p) => p.week === w) ||
      simulaciones.some((s) => s.week === w),
    )
    .sort((a, b) => a - b);

  // Semana actual según la fecha real del dispositivo: la última cuya primera
  // fecha ya pasó. Se abre esa semana, o la siguiente con material.
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const allWeeksSorted = Array.from(weekMeta.keys()).sort((a, b) => a - b);
  let currentWeek = weeksWithMaterial[0] ?? allWeeksSorted[0] ?? 1;
  for (const w of allWeeksSorted) {
    const start = weekMeta.get(w)!.dates.slice().sort()[0];
    if (start <= todayISO) currentWeek = w;
  }
  const openWeek =
    weeksWithMaterial.find((w) => w >= currentWeek) ??
    weeksWithMaterial[weeksWithMaterial.length - 1];

  return (
    <div className="mt-10 space-y-4">
      {transversal.length > 0 && (
        <MaterialSection
          eyebrow="Del curso"
          title="Siempre disponible"
          description="Programa, reto, guías de método y entregables. No dependen de la semana."
          count={transversal.length}
          defaultOpen
        >
          <CardList>
            {transversal.map((r, i) => (
              <ReadingCard
                key={r.slug}
                r={r}
                courseSlug={courseSlug}
                numberLabel={`Guía ${String(r.order ?? i + 1).padStart(2, '0')}`}
              />
            ))}
          </CardList>
        </MaterialSection>
      )}

      {weeksWithMaterial.map((w) => {
        const meta = weekMeta.get(w)!;
        const wlecturas = lecturas.filter((r) => r.week === w);
        const wguias = guias.filter((r) => r.week === w);
        const wpres = presentaciones.filter((p) => p.week === w);
        const wsims = simulaciones.filter((s) => s.week === w);
        const count = wlecturas.length + wguias.length + wpres.length + wsims.length;
        const sortedDates = meta.dates.slice().sort();

        return (
          <WeekSection
            key={w}
            week={w}
            topic={meta.topics.join(' · ')}
            dateRange={formatRange(sortedDates[0], sortedDates[sortedDates.length - 1])}
            quiz={meta.quiz}
            taller={meta.taller}
            count={count}
            defaultOpen={w === openWeek}
          >
            <CardList>
              {wlecturas.map((r) => (
                <ReadingCard key={r.slug} r={r} courseSlug={courseSlug} numberLabel={`Lectura ${String(r.order ?? '').padStart(2, '0')}`.trim()} />
              ))}
              {wguias.map((r) => (
                <ReadingCard key={r.slug} r={r} courseSlug={courseSlug} numberLabel="Guía" />
              ))}
              {wpres.map((p) => (
                <SlideCard
                  key={p.id}
                  title={p.title}
                  eyebrow={p.sessionNumber !== undefined ? `Presentación · Sesión ${p.sessionNumber}` : 'Presentación'}
                  meta={p.date}
                  description={p.description}
                  href={`/classroom/${courseSlug}/slides/${p.file}`}
                />
              ))}
              {wsims.map((s) => (
                <SlideCard
                  key={s.id}
                  title={s.title}
                  eyebrow="Simulación"
                  description={s.description}
                  tags={s.tags}
                  to={toViewer(courseSlug, `/classroom/${courseSlug}/simulaciones/${s.file}`)}
                />
              ))}
            </CardList>
          </WeekSection>
        );
      })}
    </div>
  );
};

// ── Vista por tipo (cursos sin cronograma) ─────────────────────────
const TypeView: React.FC<ViewProps> = ({ courseSlug, lecturas, guias, presentaciones, simulaciones }) => (
  <div className="mt-10 space-y-4">
    <MaterialSection eyebrow="Antes de clase" title="Lecturas" description="Una por sesión. Los quices salen de aquí." count={lecturas.length} defaultOpen>
      <CardList>
        {lecturas.map((r, i) => (
          <ReadingCard key={r.slug} r={r} courseSlug={courseSlug} numberLabel={`Lectura ${String(r.order ?? i + 1).padStart(2, '0')}`} />
        ))}
      </CardList>
    </MaterialSection>

    <MaterialSection eyebrow="Para clase" title="Presentaciones" description="Diapositivas de cada sesión. Abren en pestaña nueva." count={presentaciones.length}>
      <CardList>
        {presentaciones.map((p) => (
          <SlideCard
            key={p.id}
            title={p.title}
            eyebrow={p.sessionNumber !== undefined ? `Sesión ${p.sessionNumber}` : undefined}
            meta={p.date}
            description={p.description}
            href={`/classroom/${courseSlug}/slides/${p.file}`}
          />
        ))}
      </CardList>
    </MaterialSection>

    <MaterialSection eyebrow="Transversal" title="Guías" description="Metodología, entregables y herramientas del proyecto." count={guias.length}>
      <CardList>
        {guias.map((r, i) => (
          <ReadingCard key={r.slug} r={r} courseSlug={courseSlug} numberLabel={`Guía ${String(r.order ?? i + 1).padStart(2, '0')}`} />
        ))}
      </CardList>
    </MaterialSection>

    {simulaciones.length > 0 && (
      <MaterialSection eyebrow="Interactivo" title="Simulaciones" description="Explora el diseño de las operaciones en tiempo real." count={simulaciones.length}>
        <CardList>
          {simulaciones.map((s) => (
            <SlideCard
              key={s.id}
              title={s.title}
              eyebrow={s.sessionNumber !== undefined ? `Sesión ${s.sessionNumber}` : undefined}
              description={s.description}
              tags={s.tags}
              to={toViewer(courseSlug, `/classroom/${courseSlug}/simulaciones/${s.file}`)}
            />
          ))}
        </CardList>
      </MaterialSection>
    )}
  </div>
);

// ── Sección colapsable por tipo ────────────────────────────────────
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

// ── Sección colapsable por semana ──────────────────────────────────
interface WeekSectionProps {
  week: number;
  topic: string;
  dateRange: string;
  quiz: string[];
  taller: string[];
  count: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const WeekSection: React.FC<WeekSectionProps> = ({
  week, topic, dateRange, quiz, taller, count, defaultOpen, children,
}) => (
  <details
    className="group bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden"
    {...(defaultOpen ? { open: true } : {})}
  >
    <summary className="flex items-center justify-between gap-4 cursor-pointer list-none select-none px-5 sm:px-6 py-4 hover:bg-zinc-50 transition-colors [&::-webkit-details-marker]:hidden">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
          Semana {week} · {dateRange}
        </p>
        <h2 className="mt-0.5 text-lg sm:text-xl font-bold text-brand-dark truncate">{topic || `Semana ${week}`}</h2>
        {(quiz.length > 0 || taller.length > 0) && (
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {quiz.map((q) => (
              <span key={q} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">📝 {q}</span>
            ))}
            {taller.map((t) => (
              <span key={t} className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">🔧 {t}</span>
            ))}
          </div>
        )}
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
    <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100">{children}</div>
  </details>
);

const CardList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul className="space-y-3">{children}</ul>
);

// ── Tarjeta de diapositiva (pestaña nueva) / simulación (mismo sitio) ─
interface SlideCardProps {
  title: string;
  eyebrow?: string;
  meta?: string;
  description?: string;
  tags?: string[];
  /** Presentaciones: abren en pestaña nueva. */
  href?: string;
  /** Simulaciones: abren en el visor de la misma página (ruta interna). */
  to?: string;
}

const SlideCard: React.FC<SlideCardProps> = ({ title, eyebrow, meta, description, tags, href, to }) => {
  const cardClass =
    'block bg-white rounded-xl border border-zinc-200 p-5 shadow-sm hover:shadow-md hover:border-brand-yellow transition-all group';
  const icon = href ? (
    // Flecha «abrir en pestaña nueva»
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  ) : (
    // Flecha «ir» dentro del sitio
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  );

  const inner = (
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
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
      </span>
    </div>
  );

  return (
    <li>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={cardClass}>
          {inner}
        </a>
      ) : (
        <Link to={to ?? '#'} className={cardClass}>
          {inner}
        </Link>
      )}
    </li>
  );
};

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
              <span>Documento</span>
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

  // Las lecturas y guías con `href` (HTML autocontenido) se abren en el visor
  // de la misma página, con barra para volver. Las lecturas internas TSX usan
  // su ruta React de siempre.
  return (
    <li>
      {r.href ? (
        <Link to={toViewer(courseSlug, r.href)} className={wrapClass}>
          {inner}
        </Link>
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

// Rango de fechas compacto para la cabecera de la semana (p. ej. «4 – 6 ago»).
const formatRange = (startISO: string, endISO: string): string => {
  const s = new Date(startISO + 'T12:00:00');
  const e = new Date(endISO + 'T12:00:00');
  if (isNaN(s.getTime())) return '';
  const month = (d: Date) => d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
  const sd = s.getDate();
  const ed = e.getDate();
  if (startISO === endISO) return `${sd} ${month(s)}`;
  if (s.getMonth() === e.getMonth()) return `${sd} – ${ed} ${month(e)}`;
  return `${sd} ${month(s)} – ${ed} ${month(e)}`;
};
