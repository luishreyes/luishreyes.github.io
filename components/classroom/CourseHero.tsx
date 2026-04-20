import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course } from '../data/classroom';

interface CourseHeroProps {
  course: Course;
}

export const CourseHero: React.FC<CourseHeroProps> = ({ course }) => {
  return (
    <div
      className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.85), rgba(26,26,26,0.55)), url(${course.bannerUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/classroom" className="inline-flex items-center text-sm text-zinc-200 hover:text-brand-yellow transition-colors">
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
            {course.code} · Semestre {course.term}
          </p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
            {course.title}
          </h1>
          {course.tagline && (
            <p className="mt-3 text-lg text-zinc-100 font-medium">
              {course.tagline}
            </p>
          )}
          <p className="mt-4 text-sm sm:text-base text-zinc-200 leading-relaxed">
            {course.description}
          </p>

          <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-zinc-200">
              <dt className="text-brand-yellow font-semibold uppercase tracking-wider">Créditos</dt>
              <dd>{course.credits}</dd>
            </div>
            <div className="flex items-center gap-2 text-zinc-200">
              <dt className="text-brand-yellow font-semibold uppercase tracking-wider">Modalidad</dt>
              <dd>{course.modality}</dd>
            </div>
            <div className="flex items-center gap-2 text-zinc-200">
              <dt className="text-brand-yellow font-semibold uppercase tracking-wider">Duración</dt>
              <dd>{course.duration}</dd>
            </div>
          </dl>
        </motion.div>
      </div>
    </div>
  );
};
