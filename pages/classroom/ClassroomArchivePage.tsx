import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { classroomData } from '../../components/data/classroom';
import { CourseCard } from '../../components/classroom/CourseCard';
import { useI18n } from '../../context/i18n';

export const ClassroomArchivePage: React.FC = () => {
  const { t } = useI18n();

  const archivedCourses = classroomData.filter((c) => c.archived);

  return (
    <PageWrapper maxWidth="max-w-7xl">
      <Link
        to="/classroom"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('classroom.archive.back')}
      </Link>

      <div className="mt-6 max-w-3xl">
        <p className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
          {t('classroom.archive.eyebrow')}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
          {t('classroom.archive.title')}
        </h1>
        <p className="mt-4 text-brand-gray leading-relaxed">
          {t('classroom.archive.intro')}
        </p>
      </div>

      {archivedCourses.length > 0 ? (
        <section className="mt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {archivedCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      ) : (
        <p className="mt-10 text-brand-gray">
          {t('classroom.archive.empty')}
        </p>
      )}
    </PageWrapper>
  );
};
