import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, Simulation } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { useCourseRelease } from '../../components/classroom/courseRelease';
import { usePublishControls } from '../../components/classroom/PouPublishControls';
import { itemKey } from '../../components/classroom/publishState';
import '../../components/classroom/pou-theme.css';

// Simuladores de POU en una sola página, con la identidad «Industry». Siguen la
// misma regla que «Material del curso»: el estudiante ve solo los que el equipo
// docente ya publicó (o los de semanas abiertas, en entrega gradual), y los
// demás se listan sellados con su semana, sin adelantar de qué se trata. Con el
// código del equipo docente se ven todos y cada uno lleva su botón
// Publicada/Oculta, el mismo del Material (llave `sim:{id}`).

const toViewer = (courseSlug: string, file: string): string =>
  `/classroom/${courseSlug}/ver/simulaciones/${file}`;

const Marks: React.FC = () => (
  <>
    <i className="corner tl" aria-hidden="true" />
    <i className="corner tr" aria-hidden="true" />
    <i className="corner bl" aria-hidden="true" />
    <i className="corner br" aria-hidden="true" />
  </>
);

const fmtRange = (startISO?: string, endISO?: string): string => {
  if (!startISO || !endISO) return '';
  const s = new Date(startISO + 'T12:00:00');
  const e = new Date(endISO + 'T12:00:00');
  if (isNaN(s.getTime())) return '';
  const mes = (d: Date) => d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
  if (startISO === endISO) return `${s.getDate()} ${mes(s)}`;
  if (s.getMonth() === e.getMonth()) return `${s.getDate()} a ${e.getDate()} ${mes(e)}`;
  return `${s.getDate()} ${mes(s)} a ${e.getDate()} ${mes(e)}`;
};

const pad = (n: number) => String(n).padStart(2, '0');

export const PouSimulationsPage: React.FC<{ course: Course }> = ({ course }) => (
  <CourseAccessGate course={course}>
    <PouSimulations course={course} />
  </CourseAccessGate>
);

const PouSimulations: React.FC<{ course: Course }> = ({ course }) => {
  const release = useCourseRelease(course);
  const { isStaff, gated, manual, isItemOpen, currentWeek } = release;
  const pub = usePublishControls(release);

  // Semana → temas y fechas, del cronograma del curso.
  const meta = new Map<number, { topics: string[]; dates: string[] }>();
  for (const e of course.cronograma ?? []) {
    const m = meta.get(e.week) ?? { topics: [], dates: [] };
    if (e.topic && !m.topics.includes(e.topic)) m.topics.push(e.topic);
    m.dates.push(e.date);
    meta.set(e.week, m);
  }

  const sims = [...(course.simulations ?? [])].sort(
    (a, b) => (a.week ?? 0) - (b.week ?? 0) || (a.sessionNumber ?? 0) - (b.sessionNumber ?? 0),
  );
  const abiertos = sims.filter((s) => isItemOpen('sim', s.id, s.week));
  const sellados = sims.length - abiertos.length;

  return (
    <motion.div
      {...{
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
      }}
      className="pou-ds"
      style={{ minHeight: '100vh', paddingTop: '64px' }}
    >
      <header className="pou-hero" style={{ padding: '56px 0 40px' }}>
        <div className="pou-wrap">
          <p className="pou-eyebrow">
            <Link to="/classroom" style={{ color: 'inherit', textDecoration: 'none' }}>Aula</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/classroom/${course.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{course.code}</Link>
            <span aria-hidden="true">/</span>
            <span>Simuladores</span>
          </p>
          <h1 style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}>Simuladores</h1>
          <p className="pou-lede">
            Los exploradores interactivos del curso, en un solo lugar y en el orden del semestre. Cada uno
            acompaña una semana y aparece cuando se publica su material: mueva los controles, compare con sus
            cálculos y vuelva cuando lo necesite para el proyecto.
          </p>
          <p className="pou-meta">
            {gated
              ? `${abiertos.length} de ${sims.length} disponibles${sellados > 0 ? ' · los demás llegan con su semana' : ''}`
              : `${sims.length} simuladores`}
            {' · '}
            <Link to={`/classroom/${course.slug}/readings`} style={{ color: 'inherit' }}>
              Material por semana
            </Link>
          </p>
          {isStaff && (manual || course.gradualRelease) && (
            <p className="pou-staff-badge">Equipo docente · todos los simuladores a la vista</p>
          )}
          {pub.panel}
        </div>
      </header>

      <div className="pou-wrap" style={{ paddingBottom: '96px' }}>
        {sims.length === 0 ? (
          <p className="s-rem">Aún no hay simuladores.</p>
        ) : (
          <ul className="pou-sims">
            {sims.map((s) => {
              const m = s.week !== undefined ? meta.get(s.week) : undefined;
              const fechas = m ? m.dates.slice().sort() : [];
              const rango = fmtRange(fechas[0], fechas[fechas.length - 1]);
              const enCurso = s.week !== undefined && s.week === currentWeek;
              const k = [
                s.week !== undefined ? `Semana ${pad(s.week)}` : 'Del curso',
                rango,
                enCurso ? 'En curso' : '',
              ].filter(Boolean).join(' · ');
              return isItemOpen('sim', s.id, s.week) ? (
                <SimCard
                  key={s.id}
                  s={s}
                  slug={course.slug}
                  k={k}
                  toggle={pub.boton('sim', s.id, s.title)}
                  oculto={isStaff && manual && !(release.publishedItems?.has(itemKey('sim', s.id)) ?? false)}
                />
              ) : (
                <li key={s.id} className="pou-sim locked" aria-disabled="true">
                  <Marks />
                  <div className="shot sealed" aria-hidden="true">
                    <span className="wkn">{s.week !== undefined ? pad(s.week) : '00'}</span>
                  </div>
                  <div className="bd">
                    <span className="k">{k}</span>
                    <h3>Por publicar</h3>
                    <p>
                      {m && m.topics.length > 0 ? `${m.topics.join(' · ')}. ` : ''}
                      {manual
                        ? 'El equipo docente lo publica con el material de la semana.'
                        : 'Se abre con el material de su semana.'}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="plate" style={{ marginTop: '48px', padding: '22px 26px' }}>
          <Marks />
          <p className="pou-eyebrow" style={{ marginBottom: '10px' }}>Cómo sacarles provecho</p>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '15px', lineHeight: 1.55 }}>
            <li style={{ marginBottom: '6px' }}>Llévelos a los extremos: el régimen laminar, el caudal cero, el impulsor sin bafles. Ahí se entiende la regla.</li>
            <li style={{ marginBottom: '6px' }}>Contraste cada resultado con su cálculo a mano en la bitácora antes de usarlo en el informe.</li>
            <li>Cada simulador abre con el caso del proyecto o con el ejemplo de la lectura: empiece por ahí y cambie una variable a la vez.</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

const SimCard: React.FC<{ s: Simulation; slug: string; k: string; toggle: React.ReactNode; oculto: boolean }> = ({
  s,
  slug,
  k,
  toggle,
  oculto,
}) => (
  <li className={`pou-sim${oculto ? ' unpub' : ''}`}>
    <i className="corner tl" aria-hidden="true" />
    <i className="corner tr" aria-hidden="true" />
    <i className="corner bl" aria-hidden="true" />
    <i className="corner br" aria-hidden="true" />
    <Link to={toViewer(slug, s.file)}>
      <div className="shot">
        {s.bannerImg ? <img src={s.bannerImg} alt="" loading="lazy" /> : <span className="wkn">{pad(s.week ?? 0)}</span>}
      </div>
      <div className="bd">
        <span className="k">
          {k}
          {s.sessionNumber !== undefined && ` · Sesión ${s.sessionNumber}`}
        </span>
        <h3>{s.title}</h3>
        <p>{s.description}</p>
        {s.tags && s.tags.length > 0 && (
          <span className="tags">
            {s.tags.slice(0, 5).map((t) => (
              <span key={t} className="tag tag-neutral">{t}</span>
            ))}
          </span>
        )}
        <span className="go">Abrir simulador →</span>
      </div>
    </Link>
    {toggle && <span className="pubc">{toggle}</span>}
  </li>
);
