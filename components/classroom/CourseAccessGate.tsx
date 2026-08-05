import React, { useState, useSyncExternalStore } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Course } from '../data/classroom';
import { todayISO } from './today';

const storageKey = (slug: string) => `classroom:unlock:${slug}`;
const roleKey = (slug: string) => `classroom:role:${slug}`;

/**
 * Con qué código se abrió el curso:
 * - 'student' → código normal del curso (`accessCode`).
 * - 'staff'   → código del equipo docente (`staffAccessCode`).
 */
export type CourseRole = 'student' | 'staff';

/**
 * El acceso dura un día. En vez de un `'true'` perpetuo, se guarda la fecha en
 * que se abrió el curso y se compara con la de hoy: al cambiar el día el acceso
 * caduca solo y el código se vuelve a pedir. Así ni una sesión olvidada en un
 * computador compartido ni la vista del equipo docente quedan abiertas para
 * siempre. Las sesiones anteriores a este cambio guardaban `'true'`, que ya no
 * coincide con ninguna fecha: caducan en la primera visita.
 */
const readRole = (slug: string): CourseRole | null => {
  try {
    if (window.localStorage.getItem(storageKey(slug)) !== todayISO()) return null;
    return window.localStorage.getItem(roleKey(slug)) === 'staff' ? 'staff' : 'student';
  } catch {
    return null;
  }
};

const openCourse = (slug: string, role: CourseRole) => {
  try {
    window.localStorage.setItem(storageKey(slug), todayISO());
    window.localStorage.setItem(roleKey(slug), role);
  } catch {}
  notifyAccessChange();
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

  // Cada botón entra por su propia puerta: el código se valida contra el del rol
  // que se pidió, no contra los dos. Así el profesor puede entrar como
  // estudiante —escribiendo el código del curso— para ver el aula tal como la
  // ven ellos, en vez de que el sistema lo ascienda solo.
  const entrar = (role: CourseRole) => {
    const attempt = input.trim().toUpperCase();
    const esperado = role === 'staff' ? course.staffAccessCode : course.accessCode;

    if (esperado && attempt === esperado.toUpperCase()) {
      openCourse(course.slug, role);
      setError(null);
      return;
    }

    // Confundir las dos puertas es el error más probable del equipo docente, así
    // que se dice cuál era en vez de un «código incorrecto» a secas.
    const eraElOtro =
      role === 'student' &&
      !!course.staffAccessCode &&
      attempt === course.staffAccessCode.toUpperCase();

    setError(
      eraElOtro
        ? 'Ese es el código del equipo docente: use «Acceder como profesor». Para ver el aula como la ven los estudiantes, escriba el código del curso.'
        : role === 'staff'
          ? 'Ese no es el código del equipo docente.'
          : 'Código incorrecto. Intenta de nuevo.',
    );
  };

  // Con Enter se entra como estudiante, que es el caso de casi todo el mundo.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    entrar('student');
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
              {course.staffAccessCode
                ? 'Este espacio está reservado para el curso. Escriba su código y entre por la puerta que le corresponde.'
                : 'Este espacio está reservado para estudiantes del curso. Ingrese el código que le entregó el profesor para continuar.'}
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
              {course.staffAccessCode ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-md bg-brand-yellow text-brand-dark font-semibold shadow-sm hover:bg-brand-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow"
                  >
                    Acceder como estudiante
                  </button>
                  <button
                    type="button"
                    onClick={() => entrar('staff')}
                    className="w-full py-3 rounded-md border border-zinc-300 text-brand-dark font-semibold hover:border-brand-dark hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow"
                  >
                    Acceder como profesor
                  </button>
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-brand-yellow text-brand-dark font-semibold shadow-sm hover:bg-brand-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-yellow"
                >
                  Entrar al curso
                </button>
              )}
            </form>

            <p className="mt-3 text-xs text-brand-gray">
              El acceso dura hasta el final del día: mañana el curso vuelve a pedir el código.
            </p>

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
