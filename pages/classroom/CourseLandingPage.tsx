import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { CourseHero } from '../../components/classroom/CourseHero';
import { Section } from '../../components/classroom/Section';
import { TodayButton } from '../../components/classroom/TodayButton';
import { NotFoundInClassroom } from './NotFoundInClassroom';

export const CourseLandingPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  if (!course) return <NotFoundInClassroom />;

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 },
        }}
        className="bg-zinc-50"
      >
        <CourseHero course={course} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="mb-4">
            <TodayButton course={course} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to={`/classroom/${course.slug}/readings`}
              className="group bg-white rounded-xl shadow-md border border-zinc-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">Material</p>
                  <h3 className="mt-1 text-xl font-bold text-brand-dark">Lecturas</h3>
                  <p className="mt-2 text-sm text-brand-gray">
                    {course.readings.length} {course.readings.length === 1 ? 'entrada' : 'entradas'} publicadas
                  </p>
                </div>
                <span className="text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>

            <Link
              to={`/classroom/${course.slug}/presentations`}
              className="group bg-white rounded-xl shadow-md border border-zinc-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">Para clase</p>
                  <h3 className="mt-1 text-xl font-bold text-brand-dark">Presentaciones</h3>
                  <p className="mt-2 text-sm text-brand-gray">
                    {course.presentations.length} {course.presentations.length === 1 ? 'disponible' : 'disponibles'}
                  </p>
                </div>
                <span className="text-brand-dark group-hover:text-brand-yellow-dark transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>

        {course.pillars && course.pillars.length > 0 && (
          <Section eyebrow="Pilares" title="Qué guía este curso">
            <div className="grid gap-5 sm:grid-cols-3">
              {course.pillars.map((p) => (
                <div key={p.title} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-brand-dark">{p.title}</h3>
                  <p className="mt-2 text-sm text-brand-gray leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section eyebrow="Objetivos" title="Lo que lograrás al finalizar">
          <ol className="grid gap-3 sm:grid-cols-2">
            {course.objectives.map((obj, i) => (
              <li key={i} className="bg-white rounded-lg border border-zinc-200 p-4 flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-yellow text-brand-dark text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <p className="text-sm text-brand-gray leading-relaxed">{obj}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section eyebrow="Equipo" title="Con quién vas a trabajar">
          <div className="grid gap-5 sm:grid-cols-3">
            {course.team.map((m) => (
              <div key={m.email} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">{m.role}</p>
                <h3 className="mt-1 text-lg font-bold text-brand-dark">{m.name}</h3>
                <a href={`mailto:${m.email}`} className="mt-2 block text-sm text-brand-dark hover:text-brand-yellow-dark transition-colors break-all">
                  {m.email}
                </a>
                {m.officeHours && (
                  <p className="mt-3 text-xs text-brand-gray">{m.officeHours}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Horarios" title="Cuándo y dónde nos vemos">
          <div className="grid gap-4 sm:grid-cols-3">
            {course.schedule.map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">{s.label}</p>
                <p className="mt-2 text-sm text-brand-dark leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Metodología" title="Cómo aprendemos" description={course.methodology.summary}>
          <div className="grid gap-5 lg:grid-cols-3">
            {course.methodology.phases.map((phase) => (
              <div key={phase.label} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">{phase.label}</p>
                <h3 className="mt-1 text-lg font-bold text-brand-dark">{phase.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-brand-gray">
                  {phase.items.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-yellow-dark mt-0.5">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {course.methodology.synergies && (
            <div className="mt-8 bg-white rounded-xl border border-zinc-200 p-6">
              <h3 className="text-lg font-semibold text-brand-dark">Sinergias PO-PBL + aula invertida</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-brand-gray">
                {course.methodology.synergies.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden="true" className="text-brand-yellow-dark mt-0.5">›</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section eyebrow="Proyecto semestral" title={course.project.title} description={course.project.overview}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">Materias primas</h3>
              <ul className="mt-3 divide-y divide-zinc-200">
                {course.project.rawMaterials.map((m) => (
                  <li key={m.name} className="py-2 flex flex-wrap gap-2 justify-between text-sm">
                    <span className="font-medium text-brand-dark">{m.name}</span>
                    <span className="text-brand-gray">{m.outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">Alcance del proyecto</h3>
              <ol className="mt-3 grid gap-2 text-sm text-brand-gray list-decimal list-inside marker:text-brand-yellow-dark marker:font-semibold">
                {course.project.scope.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-6 bg-brand-dark rounded-xl p-6 text-zinc-100">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow">Trabajo en equipo</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
              {course.project.teamwork.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true" className="text-brand-yellow mt-0.5">›</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <Section eyebrow="Contenido" title="Contenido programático" description="Más detalle del cronograma en Bloque Neón.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {course.modules.map((m) => (
              <article key={m.title} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-brand-dark">{m.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-brand-gray">
                  {m.topics.map((t, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-yellow-dark">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section eyebrow="Evaluación" title="Distribución de notas">
          <div className="overflow-x-auto bg-white rounded-xl border border-zinc-200 shadow-sm">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr className="text-left text-xs font-medium text-brand-gray uppercase tracking-wider">
                  <th className="px-6 py-3">Componente</th>
                  <th className="px-6 py-3 text-center">%</th>
                  <th className="px-6 py-3">Descripción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 text-sm">
                {course.evaluation.map((e) => (
                  <tr key={e.component} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-brand-dark">{e.component}</td>
                    <td className="px-6 py-3 text-center font-semibold text-brand-dark">{e.percentage}%</td>
                    <td className="px-6 py-3 text-brand-gray">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section eyebrow="Fechas clave" title="Entregas y retroalimentación">
          <div className="grid gap-6 lg:grid-cols-3">
            <DateList title="Bitácoras" items={course.deliveries.bitacoras} />
            <DateList title="Coevaluaciones" items={course.deliveries.coevaluations} />
            <DateList title="Retroalimentaciones" items={course.deliveries.feedback} />
          </div>
        </Section>

        <Section eyebrow="Coevaluación" title="Cómo se asigna la nota individual">
          <div className="grid gap-6 lg:grid-cols-2">
            <SimpleList title="Importancia" items={course.coevaluation.importance} />
            <SimpleList title="Aplicación" items={course.coevaluation.application} />
            <SimpleList title="Procedimiento" items={course.coevaluation.procedure} />
            <SimpleList title="Ejemplo" items={course.coevaluation.example} accent />
          </div>
        </Section>

        <Section eyebrow="Inteligencia artificial" title="Uso de IA generativa en el curso" description={course.aias.intro}>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {course.aias.levels.map((lv) => (
              <div
                key={lv.level}
                className={`rounded-xl border p-4 ${
                  lv.application.startsWith('No aplica')
                    ? 'bg-zinc-50 border-zinc-200 text-brand-gray'
                    : 'bg-white border-zinc-200'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-yellow-dark">
                  Nivel {lv.level}
                </p>
                <h3 className="mt-1 text-sm font-bold text-brand-dark">{lv.title}</h3>
                <p className="mt-2 text-xs text-brand-gray">{lv.description}</p>
                <p className="mt-3 text-xs italic text-brand-gray">{lv.application}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <SimpleList title="Objetivos" items={course.aias.goals} />
            <SimpleList title="Declaración obligatoria por entrega" items={course.aias.declaration} />
          </div>
        </Section>

        <Section eyebrow="ABET" title="Program Educational Objectives">
          <ul className="grid gap-3">
            {course.abet.peos.map((p, i) => (
              <li key={i} className="bg-white rounded-lg border border-zinc-200 p-4 text-sm text-brand-gray leading-relaxed">
                {p}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 text-lg font-semibold text-brand-dark">Student outcomes evaluados</h3>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {course.abet.outcomes.map((o) => (
              <article key={o.title} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                <h4 className="text-sm font-bold text-brand-dark">{o.title}</h4>
                <ul className="mt-3 space-y-1.5 text-sm text-brand-gray">
                  {o.indicators.map((ind, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-yellow-dark">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section eyebrow="Políticas" title="Reglas del curso">
          <div className="grid gap-4 sm:grid-cols-2">
            {course.policies.map((p) => (
              <div key={p.category} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
                  {p.category}
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-brand-gray">
                  {p.items.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-yellow-dark">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Comunidad" title="Mensaje a la comunidad">
          <div className="grid gap-4 sm:grid-cols-2">
            {course.community.map((p) => (
              <div key={p.category} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
                <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">
                  {p.category}
                </h3>
                <ul className="mt-3 space-y-1.5 text-sm text-brand-gray">
                  {p.items.map((it, i) => (
                    <li key={i} className="flex gap-2">
                      <span aria-hidden="true" className="text-brand-yellow-dark">•</span>
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <div className="pb-20" />
      </motion.div>
    </CourseAccessGate>
  );
};

const DateList: React.FC<{ title: string; items: { label: string; date: string }[] }> = ({ title, items }) => (
  <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
    <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">{title}</h3>
    <ul className="mt-3 divide-y divide-zinc-200">
      {items.map((it, i) => (
        <li key={i} className="py-2 flex items-center justify-between text-sm">
          <span className="font-medium text-brand-dark">{it.label}</span>
          <span className="text-brand-gray">{it.date}</span>
        </li>
      ))}
    </ul>
  </div>
);

const SimpleList: React.FC<{ title: string; items: string[]; accent?: boolean }> = ({ title, items, accent }) => (
  <div className={`rounded-xl border p-5 shadow-sm ${accent ? 'bg-brand-dark border-brand-dark text-zinc-100' : 'bg-white border-zinc-200'}`}>
    <h3 className={`text-sm font-semibold tracking-widest uppercase ${accent ? 'text-brand-yellow' : 'text-brand-yellow-dark'}`}>
      {title}
    </h3>
    <ul className={`mt-3 space-y-1.5 text-sm ${accent ? 'text-zinc-100' : 'text-brand-gray'}`}>
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" className={accent ? 'text-brand-yellow' : 'text-brand-yellow-dark'}>•</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  </div>
);
