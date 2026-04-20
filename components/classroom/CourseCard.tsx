import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course } from '../data/classroom';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <motion.div
      {...{
        whileHover: { y: -4 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      className="group"
    >
      <Link
        to={`/classroom/${course.slug}`}
        className="block bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div
          className="h-40 relative"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.75), rgba(26,26,26,0.35)), url(${course.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <p className="text-[11px] font-semibold tracking-widest uppercase text-brand-yellow">
              {course.code} · {course.term}
            </p>
            <h3 className="mt-1 text-xl font-bold text-white leading-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
              {course.title}
            </h3>
          </div>
        </div>

        <div className="p-5">
          {course.tagline && (
            <p className="text-sm font-medium text-brand-dark">{course.tagline}</p>
          )}
          <p className="mt-2 text-sm text-brand-gray line-clamp-3">
            {course.description}
          </p>

          <div className="mt-4 flex items-center justify-between text-xs text-brand-gray">
            <div className="flex items-center gap-3">
              <span>{course.readings.length} lecturas</span>
              <span className="text-zinc-300">·</span>
              <span>{course.presentations.length} presentaciones</span>
            </div>
            <span className="inline-flex items-center gap-1 font-medium text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
              Ingresar
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
