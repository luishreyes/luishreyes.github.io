import React, { Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { getReadingComponent } from './readingsRegistry';
import { NotFoundInClassroom } from './NotFoundInClassroom';

export const ReadingPage: React.FC = () => {
  const { courseSlug, slug } = useParams<{ courseSlug: string; slug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course || !slug) return <NotFoundInClassroom />;

  const Reading = getReadingComponent(courseSlug!, slug);

  if (!Reading) {
    return (
      <CourseAccessGate course={course}>
        <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
            {course.code}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-brand-dark">Lectura no encontrada</h1>
          <p className="mt-3 text-brand-gray">
            Es posible que esta lectura aún no esté publicada o que el enlace esté desactualizado.
          </p>
          <Link
            to={`/classroom/${course.slug}/readings`}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-yellow text-brand-dark font-semibold rounded-md hover:bg-brand-yellow-dark transition-colors"
          >
            ← Ver lecturas disponibles
          </Link>
        </div>
      </CourseAccessGate>
    );
  }

  return (
    <CourseAccessGate course={course}>
      <Suspense
        fallback={
          <div className="pt-28 pb-16 px-4 text-center text-brand-gray">Cargando lectura…</div>
        }
      >
        <Reading />
      </Suspense>
    </CourseAccessGate>
  );
};
