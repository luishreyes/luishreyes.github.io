import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseBySlug } from '../../components/data/classroom';
import { NotFoundInClassroom } from './NotFoundInClassroom';

const shareKey = (slug: string, presentationId: string) =>
  `classroom:share:${slug}:${presentationId}`;

export const PresentationSharePage: React.FC = () => {
  const { courseSlug, presentationId } = useParams<{
    courseSlug: string;
    presentationId: string;
  }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;
  const presentation = course?.presentations.find((p) => p.id === presentationId);

  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!course || !presentation) return;
    try {
      setUnlocked(
        window.localStorage.getItem(shareKey(course.slug, presentation.id)) === 'true',
      );
    } catch {
      setUnlocked(false);
    }
  }, [course, presentation]);

  if (!course || !presentation) return <NotFoundInClassroom />;

  // Si la presentación no tiene shareCode definido, este flujo no aplica.
  if (!presentation.shareCode) {
    return (
      <div className="min-h-screen bg-zinc-50 pt-28 pb-16 px-4">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-zinc-200 p-6 text-center">
          <h1 className="text-lg font-semibold text-brand-dark">Enlace no disponible</h1>
          <p className="mt-2 text-sm text-brand-gray">
            Esta presentación no se encuentra habilitada para compartir por código.
          </p>
          <Link
            to="/classroom"
            className="mt-5 inline-flex items-center text-sm text-brand-dark hover:text-brand-yellow-dark transition-colors"
          >
            <span aria-hidden="true" className="mr-1">←</span> Volver a Classroom
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attempt = input.trim();
    if (attempt.toUpperCase() === presentation.shareCode!.toUpperCase()) {
      try {
        window.localStorage.setItem(shareKey(course.slug, presentation.id), 'true');
      } catch {}
      setUnlocked(true);
      setError(null);
    } else {
      setError('Código incorrecto. Intenta de nuevo.');
    }
  };

  if (unlocked === null) return null;

  if (unlocked) {
    const slideUrl = `/classroom/${course.slug}/slides/${presentation.file}`;
    return (
      <div className="fixed inset-0 bg-brand-dark">
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <a
            href={slideUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/90 backdrop-blur text-brand-dark text-xs font-medium hover:bg-brand-yellow transition-colors"
          >
            Abrir en pestaña nueva
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
        <iframe
          src={slideUrl}
          title={presentation.title}
          className="w-full h-full border-0"
          allow="fullscreen"
        />
      </div>
    );
  }

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
              backgroundImage: `linear-gradient(135deg, rgba(26,26,26,0.85), rgba(26,26,26,0.6)), url(${course.bannerUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 flex flex-col justify-center px-6">
              <p className="text-[11px] font-semibold tracking-widest text-brand-yellow uppercase">
                Acceso a presentación
              </p>
              <h1 className="text-base font-bold text-white mt-1 leading-snug line-clamp-2">
                {presentation.title}
              </h1>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-lg font-semibold text-brand-dark">Ingresa el código</h2>
            <p className="text-sm text-brand-gray mt-1 leading-relaxed">
              El profesor te entregó un código único para esta presentación. Este código
              solo te da acceso a esta sesión.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <label
                htmlFor="share-code"
                className="block text-xs font-medium text-brand-gray uppercase tracking-wide"
              >
                Código de la presentación
              </label>
              <input
                id="share-code"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-zinc-300 text-brand-dark font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow transition"
                aria-invalid={!!error}
                aria-describedby={error ? 'share-code-error' : undefined}
              />
              {error && (
                <p id="share-code-error" className="text-xs text-red-600">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-brand-yellow text-brand-dark font-semibold shadow-sm hover:bg-brand-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow"
              >
                Ver presentación
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-zinc-200 text-xs text-brand-gray">
              <p>
                ¿Sin código? Escríbele a{' '}
                <a
                  className="text-brand-dark font-medium hover:underline"
                  href="mailto:lh.reyes@uniandes.edu.co"
                >
                  lh.reyes@uniandes.edu.co
                </a>
                .
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
