import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCourseBySlug } from '../data/classroom';
import type { Course } from '../data/classroom';
import { NotFoundInClassroom } from '../../pages/classroom/NotFoundInClassroom';
import { CourseAccessGate } from './CourseAccessGate';
import { useCourseRelease, fmtReleaseDate } from './courseRelease';

// Visor en la misma página para los documentos HTML autocontenidos del curso
// (lecturas, guías y simulaciones). Antes cada uno abría en una pestaña nueva
// sin forma de regresar; aquí el documento se embebe con una barra superior
// que ofrece navegación clara: volver al material del curso o ir a su inicio.
// El botón «atrás» del navegador también regresa al material, porque el visor
// es una ruta más de la aplicación.
export const DocViewerPage: React.FC = () => {
  const params = useParams<{ courseSlug: string; '*': string }>();
  const courseSlug = params.courseSlug;
  const splat = params['*'] ?? '';
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course || !splat) return <NotFoundInClassroom />;

  return (
    <CourseAccessGate course={course}>
      <DocViewer course={course} splat={splat} />
    </CourseAccessGate>
  );
};

const DocViewer: React.FC<{ course: Course; splat: string }> = ({ course, splat }) => {
  const courseSlug = course.slug;
  const { isWeekOpen, releaseDate } = useCourseRelease(course);

  // El src se reconstruye solo a partir del slug del curso y la cola de la ruta,
  // ambos del mismo origen: nunca se embebe un destino externo.
  const src = `/classroom/${courseSlug}/${splat}`;
  const entrada = findEntry(course, src);
  const title = entrada?.title ?? 'Documento del curso';

  // Entrar por URL no adelanta el calendario: si el documento pertenece a una
  // semana que aún no se abre, el visor lo dice en vez de embeberlo.
  if (entrada && !isWeekOpen(entrada.week)) {
    const f = entrada.week !== undefined ? releaseDate(entrada.week) : null;
    return (
      <div className="fixed left-0 right-0 bottom-0 top-16 flex flex-col items-center justify-center bg-zinc-100 px-6 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-brand-gray">
          {course.code} · Semana {entrada.week}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-brand-dark">Todavía no está disponible</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-brand-gray">
          «{title}» acompaña una sesión que aún no llega.
          {f ? ` Se abre el ${fmtReleaseDate(f)}.` : ''}
        </p>
        <Link
          to={`/classroom/${courseSlug}/readings`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark hover:text-brand-yellow-dark transition-colors"
        >
          <span aria-hidden="true">←</span> Material del curso
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed left-0 right-0 bottom-0 top-16 flex flex-col bg-zinc-100">
      <div className="flex-shrink-0 h-12 flex items-center gap-3 px-3 sm:px-5 border-b border-zinc-200 bg-white">
        <Link
          to={`/classroom/${courseSlug}/readings`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark hover:text-brand-yellow-dark transition-colors"
        >
          <span aria-hidden="true">←</span> Material del curso
        </Link>
        <span className="w-px h-4 bg-zinc-300" aria-hidden="true" />
        <Link
          to={`/classroom/${courseSlug}`}
          className="text-sm text-brand-gray hover:text-brand-dark transition-colors"
        >
          Inicio del curso
        </Link>
        <span className="ml-auto hidden sm:block truncate max-w-[40%] text-xs text-brand-gray" title={title}>
          {title}
        </span>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-brand-gray hover:text-brand-dark transition-colors"
          title="Abrir en pantalla completa (pestaña nueva)"
        >
          Pantalla completa <span aria-hidden="true">↗</span>
        </a>
      </div>
      <iframe src={src} title={title} className="flex-1 w-full border-0 bg-white" />
    </div>
  );
};

// Localiza en el material del curso la entrada que corresponde al src, para
// saber cómo se llama y a qué semana pertenece. Si no hay coincidencia (un
// documento suelto en `public/`), el visor usa un rótulo genérico y no aplica
// el calendario: no hay semana con la cual compararlo.
const findEntry = (
  course: Course,
  src: string,
): { title: string; week?: number } | null => {
  const reading = course.readings?.find((r) => r.href === src);
  if (reading) return { title: reading.title, week: reading.week };
  const sim = course.simulations?.find(
    (s) => `/classroom/${course.slug}/simulaciones/${s.file}` === src,
  );
  if (sim) return { title: sim.title, week: sim.week };
  return null;
};
