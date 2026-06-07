import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { classroomData, type Course } from '../../components/data/classroom';
import { CourseCard } from '../../components/classroom/CourseCard';
import { useI18n, type Lang } from '../../context/i18n';

/**
 * Deriva el semestre académico (`YYYY-NN`) a partir del campo `term` del curso.
 * Acepta variantes como `2026-10` o `2026-10 · Periodo 8B` quedándose con el
 * primer token `YYYY-NN`. En Uniandes `NN = 10` es el primer semestre (ene–jun)
 * y `NN = 20` el segundo (ago–nov). Devuelve una clave ordenable + una etiqueta
 * legible y bilingüe. Si el `term` no encaja, agrupa por el `term` crudo.
 */
function semesterGroup(term: string, lang: Lang): { key: string; label: string; sort: number } {
  const m = term.match(/(\d{4})-(\d{2})/);
  if (!m) {
    return { key: term, label: term, sort: -1 };
  }
  const [, year, period] = m;
  const name =
    period === '10'
      ? (lang === 'es' ? 'Primer semestre' : 'First semester')
      : period === '20'
        ? (lang === 'es' ? 'Segundo semestre' : 'Second semester')
        : (lang === 'es' ? `Periodo ${period}` : `Term ${period}`);
  return {
    key: `${year}-${period}`,
    label: `${name} ${year}`,
    // Orden descendente: año*100 + periodo → el más reciente primero.
    sort: Number(year) * 100 + Number(period),
  };
}

export const ClassroomArchivePage: React.FC = () => {
  const { t, lang } = useI18n();

  const archivedCourses = classroomData.filter((c) => c.archived);

  // Agrupa por semestre y ordena los grupos del más reciente al más antiguo.
  const groupsMap = new Map<string, { label: string; sort: number; courses: Course[] }>();
  for (const course of archivedCourses) {
    const g = semesterGroup(course.term, lang);
    const entry = groupsMap.get(g.key);
    if (entry) {
      entry.courses.push(course);
    } else {
      groupsMap.set(g.key, { label: g.label, sort: g.sort, courses: [course] });
    }
  }
  const groups = [...groupsMap.values()].sort((a, b) => b.sort - a.sort);

  return (
    <PageWrapper maxWidth="max-w-7xl">
      <Link
        to="/classroom"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t('classroom.archive.back')}
      </Link>

      <div className="mt-6 max-w-3xl">
        <p className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
          {t('classroom.archive.eyebrow')}
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark">
          {t('classroom.archive.title')}
        </h1>
        <p className="mt-4 text-brand-gray leading-relaxed">
          {t('classroom.archive.intro')}
        </p>
      </div>

      {groups.length > 0 ? (
        <div className="mt-10 space-y-12">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="flex items-center gap-3 text-lg font-semibold text-brand-dark">
                {group.label}
                <span className="flex-1 h-px bg-zinc-200" aria-hidden="true" />
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {group.courses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-brand-gray">
          {t('classroom.archive.empty')}
        </p>
      )}
    </PageWrapper>
  );
};
