import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  getCourseBySlug,
  type EdcoCourse,
  type Presentation,
} from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';

export const EdcoCourseDetailPage: React.FC = () => {
  const { courseSlug, edcoCourseId } = useParams<{
    courseSlug: string;
    edcoCourseId: string;
  }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course || course.kind !== 'professional') return <NotFoundInClassroom />;

  const edcoCourse = course.edcoCourses?.find((ec) => ec.id === edcoCourseId);
  if (!edcoCourse) return <NotFoundInClassroom />;

  const linkedPresentations = (edcoCourse.presentationIds ?? [])
    .map((id) => course.presentations.find((p) => p.id === id))
    .filter((p): p is Presentation => Boolean(p));

  const myHours = edcoCourse.sessions
    .filter((s) => s.isMine)
    .reduce((sum, s) => sum + s.hours, 0);

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 },
        }}
        className="bg-zinc-50 min-h-screen"
      >
        <Hero course={course} edcoCourse={edcoCourse} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <ActionRow
            courseSlug={course.slug}
            edcoCourse={edcoCourse}
            presentationCount={linkedPresentations.length}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <Card title="Equipo docente">
              <ul className="space-y-2">
                {edcoCourse.team.map((m) => (
                  <li key={m.name} className="flex items-baseline gap-3 text-sm">
                    <span className="font-medium text-brand-dark">{m.name}</span>
                    <span className="text-xs text-brand-gray uppercase tracking-wider">
                      {m.role}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-4 text-sm">
                <DLItem label="Periodo" value={edcoCourse.termLabel} />
                <DLItem label="Modalidad" value={edcoCourse.modality} />
                <DLItem label="Total" value={`${edcoCourse.totalHours} h`} />
                <DLItem
                  label="Mis sesiones"
                  value={`${myHours} h · ${edcoCourse.sessions.filter((s) => s.isMine).length} sesiones`}
                />
              </dl>
            </Card>

            <Card title="Módulos">
              <ul className="space-y-3 text-sm">
                {edcoCourse.modules.map((mod) => (
                  <li key={mod.code}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xs font-bold text-brand-yellow-dark">
                        {mod.code}
                      </span>
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
            </Card>
          </div>

          <div className="mt-8">
            <Card title="Cronograma">
              <div className="overflow-x-auto rounded-lg border border-zinc-200">
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
                        <td className="px-4 py-2.5 font-mono text-xs font-bold text-brand-yellow-dark">
                          {s.module}
                        </td>
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
            </Card>
          </div>

          {edcoCourse.notes && edcoCourse.notes.length > 0 && (
            <div className="mt-8">
              <Card title="Notas">
                <ul className="space-y-1.5 text-sm text-brand-gray">
                  {edcoCourse.notes.map((n, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-yellow-dark mt-0.5">•</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </div>

        <div className="pb-20" />
      </motion.div>
    </CourseAccessGate>
  );
};

const Hero: React.FC<{
  course: ReturnType<typeof getCourseBySlug>;
  edcoCourse: EdcoCourse;
}> = ({ course, edcoCourse }) => (
  <div
    className="relative pt-28 pb-20 overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.85), rgba(26,26,26,0.55)), url(${course?.bannerUrl ?? ''})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav className="text-xs text-zinc-300 flex flex-wrap items-center gap-1.5">
        <Link to="/classroom" className="hover:text-brand-yellow transition-colors">
          Classroom
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`/classroom/${course?.slug ?? ''}`}
          className="hover:text-brand-yellow transition-colors"
        >
          {course?.title}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-100">{edcoCourse.edition}</span>
      </nav>

      <motion.div
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.1 },
        }}
        className="mt-4 max-w-3xl"
      >
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-brand-yellow">
          {edcoCourse.edition}
        </p>
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
          {edcoCourse.title}
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-200 leading-relaxed">
          {edcoCourse.description}
        </p>
      </motion.div>
    </div>
  </div>
);

const ActionRow: React.FC<{
  courseSlug: string;
  edcoCourse: EdcoCourse;
  presentationCount: number;
}> = ({ courseSlug, edcoCourse, presentationCount }) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <Link
      to={`/classroom/${courseSlug}/cursos/${edcoCourse.id}/presentations`}
      className="group bg-white rounded-xl shadow-md border border-zinc-200 p-6 hover:shadow-lg transition-shadow flex items-start justify-between"
    >
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
          Material
        </p>
        <h3 className="mt-1 text-xl font-bold text-brand-dark">Presentaciones</h3>
        <p className="mt-2 text-sm text-brand-gray">
          {presentationCount === 0
            ? 'Aún no hay presentaciones publicadas'
            : `${presentationCount} ${presentationCount === 1 ? 'disponible' : 'disponibles'}`}
        </p>
      </div>
      <span className="text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </span>
    </Link>

    {edcoCourse.zoom ? (
      <a
        href={edcoCourse.zoom.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group bg-brand-dark rounded-xl shadow-md border border-brand-dark p-6 hover:shadow-lg transition-shadow flex items-start justify-between"
      >
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow">
            Sesiones en vivo
          </p>
          <h3 className="mt-1 text-xl font-bold text-zinc-100 flex items-center gap-2">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            Entrar a Zoom
          </h3>
          <p className="mt-2 text-sm text-zinc-300">
            {edcoCourse.zoom.meetingId && (
              <span className="font-mono">ID {edcoCourse.zoom.meetingId} · </span>
            )}
            {edcoCourse.zoom.note ?? 'Mismo enlace para todas las sesiones'}
          </p>
        </div>
        <span className="text-brand-yellow group-hover:text-zinc-100 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
      </a>
    ) : (
      edcoCourse.externalUrl && (
        <a
          href={edcoCourse.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group bg-white rounded-xl shadow-md border border-zinc-200 p-6 hover:shadow-lg transition-shadow flex items-start justify-between"
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              Enlace
            </p>
            <h3 className="mt-1 text-xl font-bold text-brand-dark">Página oficial EDCO</h3>
            <p className="mt-2 text-sm text-brand-gray">
              Información, inscripciones y certificado.
            </p>
          </div>
          <span className="text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </a>
      )
    )}

    {edcoCourse.zoom && edcoCourse.externalUrl && (
      <a
        href={edcoCourse.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-zinc-300 bg-white text-brand-dark text-sm font-medium hover:border-brand-yellow hover:text-brand-yellow-dark transition-colors"
      >
        Página oficial EDCO Uniandes
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    )}
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-6">
    <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
      {title}
    </h3>
    <div className="mt-4">{children}</div>
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
