import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, EdcoCourse } from '../../components/data/classroom';
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
        className="bg-zinc-50 min-h-screen"
      >
        <Hero course={course} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
          <header className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
              Cursos
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-dark">
              Selecciona un curso
            </h2>
            <p className="mt-2 text-sm text-brand-gray max-w-2xl">
              Cada curso abre su propio espacio con el cronograma completo,
              módulos, equipo docente, enlace de Zoom y las presentaciones que
              he dictado.
            </p>
          </header>

          {edcoCourses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-zinc-200 p-8 text-center text-brand-gray">
              Aún no hay cursos publicados en este espacio.
            </div>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {edcoCourses.map((ec) => (
                <li key={ec.id}>
                  <EdcoCourseHubCard courseSlug={course.slug} edcoCourse={ec} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="pb-20" />
      </motion.div>
    </CourseAccessGate>
  );
};

const Hero: React.FC<{ course: Course }> = ({ course }) => (
  <div
    className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.9), rgba(26,26,26,0.7)), url(${course.bannerUrl})`,
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
        <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
          {course.title}
        </h1>
        {course.tagline && (
          <p className="mt-2 text-base sm:text-lg text-zinc-100 font-medium">{course.tagline}</p>
        )}
        <p className="mt-3 text-sm text-zinc-200 leading-relaxed">
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
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${className}`}
    >
      {label}
    </span>
  );
};

const EdcoCourseHubCard: React.FC<{ courseSlug: string; edcoCourse: EdcoCourse }> = ({
  courseSlug,
  edcoCourse,
}) => {
  const myHours = edcoCourse.sessions
    .filter((s) => s.isMine)
    .reduce((sum, s) => sum + s.hours, 0);
  const mySessions = edcoCourse.sessions.filter((s) => s.isMine).length;

  return (
    <motion.div
      {...{
        whileHover: { y: -4 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="h-full"
    >
      <Link
        to={`/classroom/${courseSlug}/cursos/${edcoCourse.id}`}
        className="block h-full bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-lg hover:border-brand-yellow transition-all p-6 group"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
            {edcoCourse.edition}
          </p>
          <StatusBadge status={edcoCourse.status} />
        </div>

        <h3 className="mt-2 text-lg font-bold text-brand-dark leading-tight group-hover:text-brand-yellow-dark transition-colors">
          {edcoCourse.title}
        </h3>

        <p className="mt-3 text-sm text-brand-gray line-clamp-3 leading-relaxed">
          {edcoCourse.description}
        </p>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <Stat label="Periodo" value={edcoCourse.termLabel} />
          <Stat label="Modalidad" value={edcoCourse.modality} />
          <Stat label="Total" value={`${edcoCourse.totalHours} h`} />
          <Stat label="Mis sesiones" value={`${myHours} h · ${mySessions}`} />
        </dl>

        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-end text-sm font-medium text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
          Entrar
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
};

const Stat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <dt className="text-[10px] font-semibold uppercase tracking-wider text-brand-yellow-dark">
      {label}
    </dt>
    <dd className="mt-0.5 text-brand-dark">{value}</dd>
  </div>
);
