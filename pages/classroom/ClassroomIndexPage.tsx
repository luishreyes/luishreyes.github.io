import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { classroomData } from '../../components/data/classroom';
import { CourseCard } from '../../components/classroom/CourseCard';

export const ClassroomIndexPage: React.FC = () => {
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

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {classroomData.map((course) => (
          <CourseCard key={course.slug} course={course} />
        ))}
      </div>

      {classroomData.length === 0 && (
        <p className="mt-10 text-brand-gray">
          Aún no hay cursos publicados. Vuelve pronto.
        </p>
      )}
    </PageWrapper>
  );
};
