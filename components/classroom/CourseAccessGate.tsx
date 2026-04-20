import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Course } from '../data/classroom';

const storageKey = (slug: string) => `classroom:unlock:${slug}`;

export const useCourseUnlocked = (slug: string): [boolean, () => void] => {
  const [unlocked, setUnlocked] = useState<boolean>(false);

  useEffect(() => {
    try {
      setUnlocked(window.localStorage.getItem(storageKey(slug)) === 'true');
    } catch {
      setUnlocked(false);
    }
  }, [slug]);

  const lock = () => {
    try {
      window.localStorage.removeItem(storageKey(slug));
    } catch {}
    setUnlocked(false);
  };

  return [unlocked, lock];
};

interface CourseAccessGateProps {
  course: Course;
  children: React.ReactNode;
}

export const CourseAccessGate: React.FC<CourseAccessGateProps> = ({ course, children }) => {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setUnlocked(window.localStorage.getItem(storageKey(course.slug)) === 'true');
    } catch {
      setUnlocked(false);
    }
  }, [course.slug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attempt = input.trim();
    if (attempt.toUpperCase() === course.accessCode.toUpperCase()) {
      try {
        window.localStorage.setItem(storageKey(course.slug), 'true');
      } catch {}
      setUnlocked(true);
      setError(null);
    } else {
      setError('Código incorrecto. Intenta de nuevo.');
    }
  };

  if (unlocked === null) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <motion.div
          {...{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
          }}
          className="bg-white rounded-2xl shadow-lg border border-zinc-200 overflow-hidden"
        >
          <div
            className="h-32 bg-brand-dark relative"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.85), rgba(26,26,26,0.65)), url(${course.bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <p className="text-xs font-semibold tracking-widest text-brand-yellow uppercase">
                Classroom · {course.code}
              </p>
              <h1 className="text-xl font-bold text-white mt-1 leading-snug">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-brand-dark">Acceso restringido</h2>
            <p className="text-sm text-brand-gray mt-1 leading-relaxed">
              Este espacio está reservado para estudiantes del curso. Ingresa el código
              que te entregó el profesor para continuar.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <label htmlFor="course-code" className="block text-xs font-medium text-brand-gray uppercase tracking-wide">
                Código del curso
              </label>
              <input
                id="course-code"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-zinc-300 text-brand-dark font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition"
                placeholder="Ej. POU202610"
                aria-invalid={!!error}
                aria-describedby={error ? 'course-code-error' : undefined}
              />
              {error && (
                <p id="course-code-error" className="text-xs text-red-600">{error}</p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-brand-yellow text-brand-dark font-semibold shadow-sm hover:bg-brand-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow"
              >
                Entrar al curso
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-zinc-200 text-xs text-brand-gray">
              <p>
                ¿No tienes el código? Escríbele a{' '}
                <a className="text-brand-dark font-medium hover:underline" href="mailto:lh.reyes@uniandes.edu.co">
                  lh.reyes@uniandes.edu.co
                </a>
                .
              </p>
              <Link to="/classroom" className="inline-flex items-center mt-3 text-brand-dark hover:text-brand-yellow-dark transition-colors">
                <span aria-hidden="true" className="mr-1">←</span> Volver a Classroom
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
