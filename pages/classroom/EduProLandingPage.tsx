import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, EdcoCourse, Presentation } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';

interface EduProLandingPageProps {
  course: Course;
}

export const EduProLandingPage: React.FC<EduProLandingPageProps> = ({ course }) => {
  const edcoCourses = course.edcoCourses ?? [];

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 },
        }}
        className="bg-zinc-50"
      >
        <Hero course={course} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 space-y-10">
          {edcoCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-zinc-200 p-8 text-center text-brand-gray">
              Aún no hay cursos publicados en este espacio.
            </div>
          ) : (
            edcoCourses.map((ec) => (
              <EdcoCourseCard
                key={ec.id}
                courseSlug={course.slug}
                edcoCourse={ec}
                presentations={course.presentations}
              />
            ))
          )}
        </div>

        <div className="pb-20" />
      </motion.div>
    </CourseAccessGate>
  );
};

const Hero: React.FC<{ course: Course }> = ({ course }) => (
  <div
    className="relative pt-28 pb-20 overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.85), rgba(26,26,26,0.55)), url(${course.bannerUrl})`,
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
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
          {course.title}
        </h1>
        {course.tagline && (
          <p className="mt-3 text-lg text-zinc-100 font-medium">{course.tagline}</p>
        )}
        <p className="mt-4 text-sm sm:text-base text-zinc-200 leading-relaxed">
          {course.description}
        </p>
      </motion.div>
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: EdcoCourse['status'] }> = ({ status }) => {
  const map: Record<EdcoCourse['status'], { label: string; className: string }> = {
    upcoming: { label: 'Próximamente', className: 'bg-brand-yellow text-brand-dark' },
    active: { label: 'En curso', className: 'bg-emerald-100 text-emerald-800 border border-emerald-200' },
    past: { label: 'Finalizado', className: 'bg-zinc-200 text-brand-gray' },
  };
  const { label, className } = map[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${className}`}>
      {label}
    </span>
  );
};

interface EdcoCourseCardProps {
  courseSlug: string;
  edcoCourse: EdcoCourse;
  presentations: Presentation[];
}

const EdcoCourseCard: React.FC<EdcoCourseCardProps> = ({ courseSlug, edcoCourse, presentations }) => {
  const linkedPresentations = (edcoCourse.presentationIds ?? [])
    .map((id) => presentations.find((p) => p.id === id))
    .filter((p): p is Presentation => Boolean(p));

  const myHours = edcoCourse.sessions
    .filter((s) => s.isMine)
    .reduce((sum, s) => sum + s.hours, 0);

  return (
    <article className="bg-white rounded-2xl shadow-md border border-zinc-200 overflow-hidden">
      <header className="px-6 sm:px-8 py-6 border-b border-zinc-200 bg-gradient-to-br from-white to-zinc-50">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              {edcoCourse.edition}
            </p>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold text-brand-dark leading-tight">
              {edcoCourse.title}
            </h2>
          </div>
          <StatusBadge status={edcoCourse.status} />
        </div>

        <p className="mt-3 text-sm text-brand-gray leading-relaxed">
          {edcoCourse.description}
        </p>

        <dl className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <DLItem label="Periodo" value={edcoCourse.termLabel} />
          <DLItem label="Modalidad" value={edcoCourse.modality} />
          <DLItem label="Total" value={`${edcoCourse.totalHours} h`} />
          <DLItem
            label="Mis sesiones"
            value={`${myHours} h · ${edcoCourse.sessions.filter((s) => s.isMine).length} sesiones`}
          />
        </dl>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {edcoCourse.zoom && (
            <a
              href={edcoCourse.zoom.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand-dark text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Entrar a Zoom
              {edcoCourse.zoom.meetingId && (
                <span className="ml-1 font-mono text-xs text-zinc-300">{edcoCourse.zoom.meetingId}</span>
              )}
            </a>
          )}
          {edcoCourse.externalUrl && (
            <a
              href={edcoCourse.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-zinc-300 bg-white text-brand-dark text-sm font-medium hover:border-brand-yellow hover:text-brand-yellow-dark transition-colors"
            >
              Página oficial EDCO
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
        </div>

        {edcoCourse.zoom?.note && (
          <p className="mt-3 text-xs text-brand-gray italic">{edcoCourse.zoom.note}</p>
        )}
      </header>

      <div className="px-6 sm:px-8 py-6 grid gap-8 lg:grid-cols-2">
        <Block title="Equipo docente">
          <ul className="space-y-2">
            {edcoCourse.team.map((m) => (
              <li key={m.name} className="flex items-baseline gap-3 text-sm">
                <span className="font-medium text-brand-dark">{m.name}</span>
                <span className="text-xs text-brand-gray uppercase tracking-wider">{m.role}</span>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Módulos">
          <ul className="space-y-3 text-sm">
            {edcoCourse.modules.map((mod) => (
              <li key={mod.code}>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-bold text-brand-yellow-dark">{mod.code}</span>
                  <span className="font-semibold text-brand-dark">{mod.title}</span>
                  <span className="ml-auto text-xs text-brand-gray">{mod.hours} h</span>
                </div>
                {mod.instructor && (
                  <p className="mt-0.5 ml-8 text-xs text-brand-gray">Profesor: {mod.instructor}</p>
                )}
                {mod.topics && mod.topics.length > 0 && (
                  <ul className="mt-1.5 ml-8 space-y-1 text-xs text-brand-gray">
                    {mod.topics.map((t, i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden="true" className="text-brand-yellow-dark">›</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <div className="px-6 sm:px-8 py-6 border-t border-zinc-200">
        <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
          Cronograma
        </h3>
        <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50">
              <tr className="text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                <th className="px-4 py-2.5">#</th>
                <th className="px-4 py-2.5">Fecha</th>
                <th className="px-4 py-2.5">Día</th>
                <th className="px-4 py-2.5">Mód.</th>
                <th className="px-4 py-2.5">Tema</th>
                <th className="px-4 py-2.5">Profesor</th>
                <th className="px-4 py-2.5 text-right">h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {edcoCourse.sessions.map((s, i) => (
                <tr
                  key={`${s.date}-${i}`}
                  className={`${s.isMine ? 'bg-brand-yellow/10' : 'hover:bg-zinc-50'} transition-colors`}
                >
                  <td className="px-4 py-2.5 text-brand-gray font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-2.5 text-brand-dark whitespace-nowrap">{s.date}</td>
                  <td className="px-4 py-2.5 text-brand-gray">{s.day}</td>
                  <td className="px-4 py-2.5 font-mono text-xs font-bold text-brand-yellow-dark">{s.module}</td>
                  <td className="px-4 py-2.5 text-brand-dark">
                    {s.topic}
                    {s.isMine && (
                      <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-brand-yellow text-brand-dark">
                        Mía
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-brand-gray">{s.instructor}</td>
                  <td className="px-4 py-2.5 text-right text-brand-gray">{s.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {linkedPresentations.length > 0 && (
        <div className="px-6 sm:px-8 py-6 border-t border-zinc-200">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
            Presentaciones
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {linkedPresentations.map((p) => (
              <li
                key={p.id}
                className="bg-zinc-50 rounded-lg border border-zinc-200 p-4 flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark">{p.title}</p>
                  {p.description && (
                    <p className="mt-1 text-xs text-brand-gray line-clamp-2">{p.description}</p>
                  )}
                  {p.shareCode && (
                    <p className="mt-2 text-[11px] text-brand-gray font-mono">
                      Share:{' '}
                      <code className="px-1.5 py-0.5 bg-white rounded border border-zinc-200">
                        /classroom/{courseSlug}/share/{p.id}
                      </code>{' '}
                      · código <code className="px-1.5 py-0.5 bg-white rounded border border-zinc-200">{p.shareCode}</code>
                    </p>
                  )}
                </div>
                <a
                  href={`/classroom/${courseSlug}/slides/${p.file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-white border border-zinc-200 text-brand-dark hover:bg-brand-yellow hover:border-brand-yellow transition-colors"
                  aria-label={`Abrir presentación ${p.title}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {edcoCourse.notes && edcoCourse.notes.length > 0 && (
        <div className="px-6 sm:px-8 py-6 border-t border-zinc-200 bg-zinc-50">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
            Notas
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm text-brand-gray">
            {edcoCourse.notes.map((n, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="text-brand-yellow-dark mt-0.5">•</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

const Block: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
      {title}
    </h3>
    <div className="mt-3">{children}</div>
  </div>
);

const DLItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="text-[11px] font-semibold uppercase tracking-wider text-brand-yellow-dark">
      {label}
    </dt>
    <dd className="mt-0.5 text-brand-dark">{value}</dd>
  </div>
);
