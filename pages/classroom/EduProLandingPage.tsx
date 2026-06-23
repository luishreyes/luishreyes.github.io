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
            Material
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-brand-dark">
            Repositorios de curso
          </h2>
          <p className="mt-2 text-sm text-brand-gray max-w-2xl">
            Presentaciones, talleres y material de apoyo de los cursos que dicto en EDCO.
          </p>
        </header>

        {edcoCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md border border-zinc-200 p-8 text-center text-brand-gray">
            Aún no hay material publicado en este espacio.
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
      </motion.div>
    </div>
  </div>
);

const EdcoCourseHubCard: React.FC<{ courseSlug: string; edcoCourse: EdcoCourse }> = ({
  courseSlug,
  edcoCourse,
}) => {
  const presentationCount = (edcoCourse.presentationIds ?? []).length;

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
        <h3 className="text-lg font-bold text-brand-dark leading-tight group-hover:text-brand-yellow-dark transition-colors">
          {edcoCourse.title}
        </h3>

        <p className="mt-3 text-sm text-brand-gray line-clamp-3 leading-relaxed">
          {edcoCourse.description}
        </p>

        <p className="mt-4 text-xs text-brand-gray">
          {presentationCount === 0
            ? 'Sin presentaciones aún'
            : `${presentationCount} ${presentationCount === 1 ? 'presentación' : 'presentaciones'}`}
        </p>

        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-end text-sm font-medium text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
          Ver material
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </motion.div>
  );
};
