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

  const presentations = (edcoCourse.presentationIds ?? [])
    .map((id) => course.presentations.find((p) => p.id === id))
    .filter((p): p is Presentation => Boolean(p))
    .sort((a, b) => (a.sessionNumber ?? 0) - (b.sessionNumber ?? 0));

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

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 space-y-12">
        <Section title="Presentaciones">
          {presentations.length === 0 ? (
            <Placeholder message="Aún no hay presentaciones publicadas para este curso." />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {presentations.map((p) => (
                <li key={p.id}>
                  <PresentationCard courseSlug={course.slug} presentation={p} />
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Talleres">
          <Placeholder message="Próximamente." />
        </Section>

        <Section title="Material de apoyo">
          <Placeholder message="Próximamente." />
        </Section>
      </div>
    </motion.div>
    </CourseAccessGate>
  );
};

const Hero: React.FC<{
  course: ReturnType<typeof getCourseBySlug>;
  edcoCourse: EdcoCourse;
}> = ({ course, edcoCourse }) => (
  <div
    className="relative pt-24 pb-12 sm:pt-28 sm:pb-14 overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.9), rgba(26,26,26,0.7)), url(${course?.bannerUrl ?? ''})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <span className="text-zinc-100">{edcoCourse.title}</span>
      </nav>

      <motion.div
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay: 0.1 },
        }}
        className="mt-4 max-w-3xl"
      >
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
          {edcoCourse.title}
        </h1>
        <p className="mt-3 text-sm text-zinc-200 leading-relaxed">
          {edcoCourse.description}
        </p>
      </motion.div>
    </div>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section>
    <h2 className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark mb-4">
      {title}
    </h2>
    {children}
  </section>
);

const Placeholder: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-sm text-brand-gray">{message}</p>
);

const PresentationCard: React.FC<{ courseSlug: string; presentation: Presentation }> = ({
  courseSlug,
  presentation: p,
}) => (
  <article className="h-full bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-lg hover:border-brand-yellow transition-all">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        {p.sessionNumber !== undefined && (
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
            Sesión {p.sessionNumber}
          </p>
        )}
        <h3 className="mt-1 text-base font-bold text-brand-dark leading-tight">
          {p.title}
        </h3>
        {p.date && (
          <p className="mt-1 text-xs text-brand-gray">{p.date}</p>
        )}
        {p.description && (
          <p className="mt-3 text-sm text-brand-gray leading-relaxed line-clamp-4">
            {p.description}
          </p>
        )}
      </div>
      <a
        href={`/classroom/${courseSlug}/slides/${p.file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-100 text-brand-dark hover:bg-brand-yellow transition-colors"
        aria-label={`Abrir ${p.title}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    </div>
  </article>
);
