import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { useCourseRelease } from '../../components/classroom/courseRelease';
import { TodayButton } from '../../components/classroom/TodayButton';
import '../../components/classroom/pou-theme.css';

// Landing propia de POU (IQYA-2031). Identidad «Industry»: plano de ingeniería,
// azul acero sobre fondo técnico, objetos enmarcados con marcas de registro y
// la ficha del curso dibujada como hoja de especificación.

const Marks: React.FC = () => (
  <>
    <i className="corner tl" aria-hidden="true" />
    <i className="corner tr" aria-hidden="true" />
    <i className="corner bl" aria-hidden="true" />
    <i className="corner br" aria-hidden="true" />
  </>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="pou-eyebrow">{children}</p>
);

// Documento interno del curso: se abre en el visor de la misma página.
const isInternalDoc = (slug: string, href?: string): boolean =>
  !!href && href.startsWith(`/classroom/${slug}/`);
const toViewer = (slug: string, href: string): string =>
  `/classroom/${slug}/ver/${href.slice(`/classroom/${slug}/`.length)}`;

export const PouLandingPage: React.FC<{ course: Course }> = ({ course }) => {
  // Los conteos del acceso a «Material» cuentan lo que la sesión puede abrir
  // hoy: con entrega gradual, anunciar 14 lecturas cuando solo hay 3
  // disponibles confunde más de lo que informa.
  const { isWeekOpen } = useCourseRelease(course);
  const disponible = course.readings.filter((r) => isWeekOpen(r.week));

  const cronograma = course.readings.find((r) => r.slug === 'cronograma-interactivo');
  const lecturas = disponible.filter((r) => r.category === 'lectura').length;
  const guias = disponible.filter(
    (r) => r.category !== 'lectura' && r.slug !== 'cronograma-interactivo',
  ).length;
  const pres = (course.presentations ?? []).filter((p) => isWeekOpen(p.week)).length;
  const sims = (course.simulations ?? []).filter((s) => isWeekOpen(s.week)).length;

  const ficha: { n: string; prop: string; val: string; rem: string }[] = [
    { n: '01', prop: 'Código', val: course.code, rem: 'Sección POU' },
    { n: '02', prop: 'Periodo', val: course.term, rem: course.duration },
    { n: '03', prop: 'Créditos', val: String(course.credits), rem: '9 horas de trabajo semanal' },
    { n: '04', prop: 'Modalidad', val: course.modality, rem: 'Martes y jueves, 11:00 a.m. a 12:20 m.' },
    { n: '05', prop: 'Equipos', val: '4 a 5', rem: 'Fijos durante todo el semestre' },
    { n: '06', prop: 'Operaciones', val: '8', rem: 'Encadenadas en una sola planta' },
  ];

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 },
        }}
        className="pou-ds"
        style={{ minHeight: '100vh', paddingTop: '64px' }}
      >
        {/* ── Titular ─────────────────────────────────────────────── */}
        <header className="pou-hero">
          <div className="pou-wrap">
            <Eyebrow>
              <Link to="/classroom" style={{ color: 'inherit', textDecoration: 'none' }}>
                Aula
              </Link>
              <span aria-hidden="true">/</span>
              <span>{course.code} · {course.term}</span>
            </Eyebrow>
            <h1>Diseñe la planta, no el ejercicio</h1>
            <p className="pou-lede">{course.tagline}</p>
            <p className="pou-meta">{course.title}</p>

            <div style={{ marginTop: '32px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link className="btn btn-primary" to={`/classroom/${course.slug}/readings`}>
                Material del curso
              </Link>
              {cronograma?.href && (
                isInternalDoc(course.slug, cronograma.href) ? (
                  <Link className="btn btn-secondary" to={toViewer(course.slug, cronograma.href)}>
                    Cronograma
                  </Link>
                ) : (
                  <a className="btn btn-secondary" href={cronograma.href} target="_blank" rel="noopener noreferrer">
                    Cronograma
                  </a>
                )
              )}
              <TodayButton course={course} />
            </div>
          </div>
        </header>

        {/* ── Ficha del curso, como hoja de especificación ─────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '64px' }} aria-label="Ficha del curso">
          <div className="plate">
            <Marks />
            <header className="title-block">
              <span className="tb-title">{course.code} · Ficha del curso</span>
              <span className="tb-cell">POU {course.term}</span>
              <span className="tb-cell">Rev A</span>
              <span className="tb-cell">Hoja 01 de 01</span>
            </header>
            <table className="spec">
              <colgroup>
                <col style={{ width: '72px' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '22%' }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Propiedad</th>
                  <th scope="col">Valor</th>
                  <th scope="col">Observación</th>
                </tr>
              </thead>
              <tbody>
                {ficha.map((f) => (
                  <tr key={f.n}>
                    <td className="s-num">{f.n}</td>
                    <td>{f.prop}</td>
                    <td className="s-val">{f.val}</td>
                    <td className="s-rem">{f.rem}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Accesos ─────────────────────────────────────────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '72px' }} aria-label="Accesos del curso">
          <Eyebrow>Dónde está todo</Eyebrow>
          <div className="pou-cells two" style={{ marginTop: '24px' }}>
            <Link className="pou-cell blueprint" to={`/classroom/${course.slug}/readings`}>
              <Marks />
              <span className="k">Material</span>
              <h3>Material del curso</h3>
              <p>
                {[
                  lecturas > 0 && `${lecturas} lecturas`,
                  pres > 0 && `${pres} presentaciones`,
                  guias > 0 && `${guias} guías`,
                  sims > 0 && `${sims} simulaciones`,
                ].filter(Boolean).join(' · ')}
              </p>
              <span className="go">Abrir por semana →</span>
            </Link>

            {cronograma?.href && (
              isInternalDoc(course.slug, cronograma.href) ? (
                <Link className="pou-cell blueprint" to={toViewer(course.slug, cronograma.href)}>
                  <Marks />
                  <span className="k">Calendario</span>
                  <h3>Cronograma</h3>
                  <p>Qué sigue esta semana y el recorrido completo del semestre, semana por semana.</p>
                  <span className="go">Abrir cronograma →</span>
                </Link>
              ) : (
                <a className="pou-cell blueprint" href={cronograma.href} target="_blank" rel="noopener noreferrer">
                  <Marks />
                  <span className="k">Calendario</span>
                  <h3>Cronograma</h3>
                  <p>Qué sigue esta semana y el recorrido completo del semestre, semana por semana.</p>
                  <span className="go">Abrir cronograma →</span>
                </a>
              )
            )}
          </div>
        </section>

        {/* ── El reto del semestre, en campo de acento ─────────────── */}
        {course.project && (
          <section className="pou-field" aria-label="Proyecto del semestre">
            <div className="pou-wrap">
              <p style={{ fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600, color: 'rgba(255,255,255,.62)', margin: 0 }}>
                Proyecto del semestre
              </p>
              <h2 style={{ marginTop: '10px' }}>{course.project.title}</h2>
              <p>{course.project.overview}</p>
              {course.challenges?.href && (
                <div style={{ marginTop: '26px' }}>
                  {isInternalDoc(course.slug, course.challenges.href) ? (
                    <Link className="btn btn-primary" to={toViewer(course.slug, course.challenges.href)}>
                      Abrir la guía del reto
                    </Link>
                  ) : (
                    <a className="btn btn-primary" href={course.challenges.href} target="_blank" rel="noopener noreferrer">
                      Abrir la guía del reto
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ── Alcance del proyecto ────────────────────────────────── */}
        {course.project && (
          <section className="pou-wrap" style={{ padding: '64px 32px' }} aria-label="Alcance del proyecto">
            <Eyebrow>El alcance, operación por operación</Eyebrow>
            <div style={{ marginTop: '20px' }}>
              <table className="pou-table">
                <tbody>
                  {course.project.scope.map((s, i) => (
                    <tr key={i}>
                      <td className="s-num" style={{ width: '72px', verticalAlign: 'top' }}>
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td>{s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ── Equipo docente ─────────────────────────────────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '64px' }} aria-label="Equipo docente">
          <Eyebrow>Con quién va a trabajar</Eyebrow>
          <table className="pou-table" style={{ marginTop: '18px' }}>
            <thead>
              <tr>
                <th scope="col">Rol</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Atención</th>
              </tr>
            </thead>
            <tbody>
              {course.team.map((m) => (
                <tr key={m.email}>
                  <td className="s-num">{m.role}</td>
                  <td style={{ fontFamily: 'var(--pou-heading)', fontWeight: 600, fontSize: '20px' }}>{m.name}</td>
                  <td><a href={`mailto:${m.email}`} style={{ color: 'var(--pou-accent-700)' }}>{m.email}</a></td>
                  <td className="s-rem">{m.officeHours ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="s-rem" style={{ marginTop: '14px', fontSize: '14px' }}>
            Escriba a los tres en el mismo mensaje, con el asunto <b>[{course.code}]</b> seguido del tema. Respuesta en 48 horas hábiles.
          </p>
        </section>

        {/* ── Objetivos ──────────────────────────────────────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '64px' }} aria-label="Objetivos del curso">
          <Eyebrow>Al finalizar el curso</Eyebrow>
          <table className="pou-table" style={{ marginTop: '18px' }}>
            <tbody>
              {course.objectives.map((o, i) => (
                <tr key={i}>
                  <td className="s-num" style={{ width: '72px', verticalAlign: 'top' }}>
                    {String(i + 1).padStart(2, '0')}
                  </td>
                  <td>{o}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── Evaluación ─────────────────────────────────────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '64px' }} aria-label="Evaluación">
          <Eyebrow>Cómo se construye la nota</Eyebrow>
          <div className="plate" style={{ marginTop: '24px' }}>
            <Marks />
            <header className="title-block">
              <span className="tb-title">{course.code} · Distribución de la evaluación</span>
              <span className="tb-cell">POU {course.term}</span>
              <span className="tb-cell">Rev A</span>
              <span className="tb-cell">Hoja 01 de 01</span>
            </header>
            <table className="spec">
              <colgroup>
                <col style={{ width: '72px' }} />
                <col style={{ width: '34%' }} />
                <col style={{ width: '14%' }} />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">No.</th>
                  <th scope="col">Componente</th>
                  <th scope="col">Peso</th>
                  <th scope="col">Modalidad</th>
                </tr>
              </thead>
              <tbody>
                {course.evaluation.map((e, i) => (
                  <tr key={e.component}>
                    <td className="s-num">{String(i + 1).padStart(2, '0')}</td>
                    <td>{e.component}</td>
                    <td className="s-val">{e.percentage} %</td>
                    <td className="s-rem">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Metodología ────────────────────────────────────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '64px' }} aria-label="Metodología">
          <Eyebrow>Cómo aprendemos</Eyebrow>
          <p className="pou-lede" style={{ marginTop: '14px', fontSize: '17px' }}>
            {course.methodology.summary}
          </p>
          <div className="pou-cells" style={{ marginTop: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {course.methodology.phases.map((p) => (
              <div key={p.label} className="pou-cell blueprint" style={{ cursor: 'default' }}>
                <Marks />
                <span className="k">{p.label}</span>
                <h3 style={{ fontSize: '24px' }}>{p.title}</h3>
                <ul style={{ margin: '12px 0 0', paddingLeft: '18px', fontSize: '15px', lineHeight: 1.5 }}>
                  {p.items.map((it, i) => <li key={i} style={{ marginBottom: '6px' }}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Uso de IA ──────────────────────────────────────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '64px' }} aria-label="Uso de inteligencia artificial">
          <Eyebrow>Inteligencia artificial · escala AIAS</Eyebrow>
          <p className="s-rem" style={{ marginTop: '12px', maxWidth: '76ch' }}>{course.aias.intro}</p>
          <table className="pou-table" style={{ marginTop: '18px' }}>
            <thead>
              <tr>
                <th scope="col">Nivel</th>
                <th scope="col">Qué permite</th>
                <th scope="col">Dónde aplica</th>
              </tr>
            </thead>
            <tbody>
              {course.aias.levels.map((lv) => {
                const off = lv.application.startsWith('No aplica');
                return (
                  <tr key={lv.level} style={off ? { opacity: 0.5 } : undefined}>
                    <td className="s-num">Nivel {lv.level}</td>
                    <td>
                      <span style={{ fontFamily: 'var(--pou-heading)', fontWeight: 600, fontSize: '20px' }}>{lv.title}</span>
                      <span className="d" style={{ display: 'block', fontSize: '14px', opacity: 0.8 }}>{lv.description}</span>
                    </td>
                    <td>
                      <span className={off ? 'tag tag-neutral' : 'tag'}>{lv.application}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* ── Políticas y comunidad ──────────────────────────────── */}
        <section className="pou-wrap" style={{ paddingBottom: '96px' }} aria-label="Políticas del curso">
          <Eyebrow>Reglas del curso</Eyebrow>
          <div className="pou-cells" style={{ marginTop: '24px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {[...course.policies, ...course.community].map((p) => (
              <div key={p.category} className="pou-cell blueprint" style={{ cursor: 'default' }}>
                <Marks />
                <span className="k">{p.category}</span>
                <ul style={{ margin: '12px 0 0', paddingLeft: '18px', fontSize: '15px', lineHeight: 1.5 }}>
                  {p.items.map((it, i) => <li key={i} style={{ marginBottom: '6px' }}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </CourseAccessGate>
  );
};
