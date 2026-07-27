import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { classroomData } from '../../components/data/classroom';
import { CourseCard } from '../../components/classroom/CourseCard';
import { useI18n } from '../../context/i18n';

export const ClassroomIndexPage: React.FC = () => {
  const { t } = useI18n();

  // Los cursos marcados como ocultos no se listan en ninguna página pública.
  const visibleCourses = classroomData.filter((c) => !c.hidden);
  const activeCourses = visibleCourses.filter((c) => !c.archived);
  const academicCourses = activeCourses.filter((c) => c.kind !== 'professional');
  const professionalCourses = activeCourses.filter((c) => c.kind === 'professional');
  const hasArchived = visibleCourses.some((c) => c.archived);

  return (
    <PageWrapper maxWidth="max-w-7xl">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
          {t('classroom.eyebrow')}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
          {t('classroom.title')}
        </h1>
        <p className="mt-4 text-brand-gray leading-relaxed">
          {t('classroom.intro')}
        </p>
      </div>

      {academicCourses.length > 0 && (
        <section className="mt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {academicCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      )}

      {professionalCourses.length > 0 && (
        <section className="mt-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
              {t('classroom.profEd.eyebrow')}
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
              {t('classroom.profEd.title')}
            </h2>
            <p className="mt-3 text-brand-gray leading-relaxed">
              {t('classroom.profEd.intro')}
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professionalCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      )}

      {activeCourses.length === 0 && (
        <p className="mt-10 text-brand-gray">
          {t('classroom.empty')}
        </p>
      )}

      {hasArchived && (
        <div className="mt-16 pt-8 border-t border-zinc-200">
          <Link
            to="/classroom/archive"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8M10 12h4" />
            </svg>
            {t('classroom.archive.link')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </PageWrapper>
  );
};
