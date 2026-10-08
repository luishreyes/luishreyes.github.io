import React from 'react';
import { useParams } from 'react-router-dom';
import { getCourseBySlug } from '../../components/data/classroom';
import { NotFoundInClassroom } from './NotFoundInClassroom';
import { SpdpEticaPage } from './SpdpEticaPage';

// La herramienta «Clasifique su reto» existe solo para el SPDP 2026-20.
export const EticaPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;
  if (course && course.slug === 'iqya-3050-2026-20') return <SpdpEticaPage course={course} />;
  return <NotFoundInClassroom />;
};
