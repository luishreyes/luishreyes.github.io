import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { classroomData } from '../../components/data/classroom';
import { CourseCard } from '../../components/classroom/CourseCard';

export const ClassroomIndexPage: React.FC = () => {
  const academicCourses = classroomData.filter((c) => c.kind !== 'professional');
  const professionalCourses = classroomData.filter((c) => c.kind === 'professional');

  return (
    <PageWrapper maxWidth="max-w-7xl">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
          Classroom
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
          Classroom
        </h1>
        <p className="mt-4 text-brand-gray leading-relaxed">
          A dedicated space for each of my courses. Here you will find the syllabus,
          weekly readings, and class presentations — everything you need to prepare
          before, during, and after each session. Access is protected by a course code
          provided at the beginning of the semester.
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
              Professional Education
            </p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
              Continuing education at Uniandes
            </h2>
            <p className="mt-3 text-brand-gray leading-relaxed">
              Open courses I teach through the Dirección de Educación Continua (EDCO).
              This is a personal hub — full access is restricted, but individual sessions
              can be shared via dedicated links.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professionalCourses.map((course) => (
              <CourseCard key={course.slug} course={course} />
            ))}
          </div>
        </section>
      )}

      {classroomData.length === 0 && (
        <p className="mt-10 text-brand-gray">
          Aún no hay cursos publicados. Vuelve pronto.
        </p>
      )}
    </PageWrapper>
  );
};
