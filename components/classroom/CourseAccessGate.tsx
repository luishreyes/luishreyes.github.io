import React, { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Course } from '../data/classroom';

const storageKey = (slug: string) => `classroom:unlock:${slug}`;
const roleKey = (slug: string) => `classroom:role:${slug}`;

/**
 * Con qué código se abrió el curso:
 * - 'student' → código normal del curso (`accessCode`).
 * - 'staff'   → código del equipo docente (`staffAccessCode`).
 * Las sesiones abiertas antes de que existieran los roles no tienen la clave
 * guardada y se leen como 'student', que es el comportamiento conservador.
 */
export type CourseRole = 'student' | 'staff';

const readRole = (slug: string): CourseRole | null => {
  try {
    if (window.localStorage.getItem(storageKey(slug)) !== 'true') return null;
    return window.localStorage.getItem(roleKey(slug)) === 'staff' ? 'staff' : 'student';
  } catch {
    return null;
  }
};

// El estado de acceso se publica como store externo porque quien lo consulta
// suele estar POR ENCIMA del gate en el árbol: `PouMaterialPage` llama a los
// hooks y luego se envuelve en `CourseAccessGate`, así que en el primer render
// el curso todavía está bloqueado. Sin esta suscripción, esos componentes se
// quedaban con la lectura de entonces y solo se enteraban del desbloqueo al
// recargar la página. El evento `storage` mantiene además coherentes las
// demás pestañas abiertas.
const listeners = new Set<() => void>();

const notifyAccessChange = () => {
  listeners.forEach((l) => l());
};

const subscribeAccess = (cb: () => void): (() => void) => {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
};

const lockCourse = (slug: string) => {
  try {
    window.localStorage.removeItem(storageKey(slug));
    window.localStorage.removeItem(roleKey(slug));
  } catch {}
  notifyAccessChange();
};

export const useCourseUnlocked = (slug: string): [boolean, () => void] => {
  const unlocked = useSyncExternalStore(
    subscribeAccess,
    () => readRole(slug) !== null,
    () => false,
  );
  return [unlocked, () => lockCourse(slug)];
};

/**
 * Rol de la sesión actual en un curso, o `null` si el curso está bloqueado.
 * Se actualiza solo en cuanto se acierta el código, sin recargar la página.
 */
export const useCourseRole = (slug: string): CourseRole | null =>
  useSyncExternalStore(
    subscribeAccess,
    () => readRole(slug),
    () => null,
  );

interface CourseAccessGateProps {
  course: Course;
  children: React.ReactNode;
}

export const CourseAccessGate: React.FC<CourseAccessGateProps> = ({ course, children }) => {
  const [unlocked] = useCourseUnlocked(course.slug);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const attempt = input.trim().toUpperCase();
    // El código del equipo docente se comprueba primero: abre el curso con rol
    // 'staff' y, si el curso usa entrega gradual, sin esperar a la semana.
    const role: CourseRole | null =
      course.staffAccessCode && attempt === course.staffAccessCode.toUpperCase()
        ? 'staff'
        : attempt === course.accessCode.toUpperCase()
          ? 'student'
          : null;

    if (role) {
      try {
        window.localStorage.setItem(storageKey(course.slug), 'true');
        window.localStorage.setItem(roleKey(course.slug), role);
      } catch {}
      notifyAccessChange();
      setError(null);
    } else {
      setError('Código incorrecto. Intenta de nuevo.');
    }
  };

  // Acento de color (siempre, incluso archivados) + tipografía de curso
  // (Source Sans 3 + escalado) solo para cursos activos.
  const themeClass =
    [
      course.accent ? `accent-${course.accent}` : null,
      course.archived ? null : 'classroom-typeset',
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  if (unlocked) return themeClass ? <div className={themeClass}>{children}</div> : <>{children}</>;

  return (
    <div className={`min-h-screen bg-zinc-50 pt-24 pb-16 px-4 sm:px-6 lg:px-8${themeClass ? ` ${themeClass}` : ''}`}>
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
              Este espacio está reservado para estudiantes del curso. Ingrese el código
              que le entregó el profesor para continuar.
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
                ¿No tiene el código? Escriba a{' '}
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
