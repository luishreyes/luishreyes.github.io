import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, Reading, Presentation, Simulation } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import '../../components/classroom/pou-theme.css';

// Material del curso de POU con la identidad «Industry»: cada semana es una
// hoja numerada con sus marcas de registro. Todo arranca colapsado y se abre
// una hoja a la vez, lo transversal va aparte, y lecturas, guías y
// simulaciones abren en el visor de la misma página.

const CRONOGRAMA_SLUG = 'cronograma-interactivo';

const toViewer = (courseSlug: string, absPath: string): string => {
  const prefix = `/classroom/${courseSlug}/`;
  const tail = absPath.startsWith(prefix) ? absPath.slice(prefix.length) : absPath.replace(/^\//, '');
  return `/classroom/${courseSlug}/ver/${tail}`;
};

const Marks: React.FC = () => (
  <>
    <i className="corner tl" aria-hidden="true" />
    <i className="corner tr" aria-hidden="true" />
    <i className="corner bl" aria-hidden="true" />
    <i className="corner br" aria-hidden="true" />
  </>
);

const fmtRange = (startISO: string, endISO: string): string => {
  const s = new Date(startISO + 'T12:00:00');
  const e = new Date(endISO + 'T12:00:00');
  if (isNaN(s.getTime())) return '';
  const mes = (d: Date) => d.toLocaleDateString('es-CO', { month: 'short' }).replace('.', '');
  if (startISO === endISO) return `${s.getDate()} ${mes(s)}`;
  if (s.getMonth() === e.getMonth()) return `${s.getDate()} a ${e.getDate()} ${mes(e)}`;
  return `${s.getDate()} ${mes(s)} a ${e.getDate()} ${mes(e)}`;
};

export const PouMaterialPage: React.FC<{ course: Course }> = ({ course }) => {
  const byOrder = (a: Reading, b: Reading) =>
    (a.order ?? Infinity) - (b.order ?? Infinity) || b.date.localeCompare(a.date);

  const lecturas = course.readings.filter((r) => r.category === 'lectura').sort(byOrder);
  const guias = course.readings
    .filter((r) => r.category !== 'lectura' && r.slug !== CRONOGRAMA_SLUG)
    .sort(byOrder);
  const presentaciones = [...(course.presentations ?? [])].sort(
    (a, b) => (a.sessionNumber ?? 0) - (b.sessionNumber ?? 0),
  );
  const simulaciones = course.simulations ?? [];
  const cronograma = course.cronograma ?? [];

  // Metadatos por semana, tomados del cronograma del curso.
  const meta = new Map<number, { topics: string[]; dates: string[]; quiz: string[]; taller: string[] }>();
  for (const e of cronograma) {
    const m = meta.get(e.week) ?? { topics: [], dates: [], quiz: [], taller: [] };
    if (e.topic && !m.topics.includes(e.topic)) m.topics.push(e.topic);
    m.dates.push(e.date);
    if (e.quiz) m.quiz.push(e.quiz);
    if (e.taller) m.taller.push(e.taller);
    meta.set(e.week, m);
  }

  const transversal = guias.filter((g) => g.week === undefined);
  const semanas = Array.from(meta.keys())
    .filter((w) =>
      lecturas.some((r) => r.week === w) ||
      guias.some((r) => r.week === w) ||
      presentaciones.some((p) => p.week === w) ||
      simulaciones.some((s) => s.week === w),
    )
    .sort((a, b) => a - b);

  // Semana en curso según la fecha real del dispositivo.
  const now = new Date();
  const hoy = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const todas = Array.from(meta.keys()).sort((a, b) => a - b);
  let actual = semanas[0] ?? todas[0] ?? 1;
  for (const w of todas) {
    const inicio = meta.get(w)!.dates.slice().sort()[0];
    if (inicio <= hoy) actual = w;
  }
  // La semana en curso se señala, pero ninguna hoja se abre sola: el profesor
  // pidió que el material arranque siempre colapsado.
  const enCurso = semanas.find((w) => w >= actual) ?? semanas[semanas.length - 1];

  // Acordeón: una sola hoja abierta a la vez. El estado vive aquí y el clic
  // sobre el resumen se intercepta, porque dejar que `details` alterne solo
  // desincroniza el DOM del estado de React.
  const [abierta, setAbierta] = React.useState<string | null>(null);
  const alternar = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setAbierta((prev) => (prev === id ? null : id));
  };

  const total = lecturas.length + guias.length + presentaciones.length + simulaciones.length;

  return (
    <CourseAccessGate course={course}>
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
              <span>Material</span>
            </p>
            <h1 style={{ fontSize: 'clamp(44px, 6vw, 84px)' }}>Material del curso</h1>
            <p className="pou-lede">
              Organizado por semana. Se abre una hoja a la vez. Lo que acompaña todo el
              semestre está en «Del curso».
            </p>
          </div>
        </header>

        <div className="pou-wrap" style={{ paddingBottom: '96px' }}>
          {total === 0 ? (
            <p className="s-rem">Aún no hay material publicado.</p>
          ) : (
            <>
              {/* Material transversal */}
              {transversal.length > 0 && (
                <details className="pou-sheet" open={abierta === 'transversal'}>
                  <Marks />
                  <summary onClick={alternar('transversal')}>
                    <span className="wk" aria-hidden="true">00</span>
                    <span className="hd">
                      <span className="k">Del curso</span>
                      <h3>Siempre disponible</h3>
                    </span>
                    <span className="cnt">{transversal.length} documentos</span>
                  </summary>
                  <div className="body">
                    {transversal.map((r, i) => (
                      <ItemLectura key={r.slug} r={r} slug={course.slug} rotulo={`Guía ${String(r.order ?? i + 1).padStart(2, '0')}`} />
                    ))}
                  </div>
                </details>
              )}

              {/* Una hoja por semana */}
              {semanas.map((w) => {
                const m = meta.get(w)!;
                const wl = lecturas.filter((r) => r.week === w);
                const wg = guias.filter((r) => r.week === w);
                const wp = presentaciones.filter((p) => p.week === w);
                const ws = simulaciones.filter((s) => s.week === w);
                const n = wl.length + wg.length + wp.length + ws.length;
                const fechas = m.dates.slice().sort();

                return (
                  <details className="pou-sheet" key={w} open={abierta === `s${w}`}>
                    <Marks />
                    <summary onClick={alternar(`s${w}`)}>
                      <span className="wk" aria-hidden="true">{String(w).padStart(2, '0')}</span>
                      <span className="hd">
                        <span className="k">
                          Semana {w} · {fmtRange(fechas[0], fechas[fechas.length - 1])}
                          {w === enCurso && ' · En curso'}
                          {m.quiz.length > 0 && ` · ${m.quiz.join(', ')}`}
                          {m.taller.length > 0 && ` · ${m.taller.length === 1 ? 'Taller' : 'Talleres'}`}
                        </span>
                        <h3>{m.topics.join(' · ') || `Semana ${w}`}</h3>
                      </span>
                      <span className="cnt">{n} {n === 1 ? 'entrada' : 'entradas'}</span>
                    </summary>
                    <div className="body">
                      {wl.map((r) => (
                        <ItemLectura key={r.slug} r={r} slug={course.slug} rotulo={`Lectura ${String(r.order ?? '').padStart(2, '0')}`.trim()} />
                      ))}
                      {wg.map((r) => (
                        <ItemLectura key={r.slug} r={r} slug={course.slug} rotulo="Guía" />
                      ))}
                      {wp.map((p) => (
                        <a
                          key={p.id}
                          className="pou-item"
                          href={`/classroom/${course.slug}/slides/${p.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="n">Presentación</span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span className="t">{p.title}</span>
                            {p.description && <span className="d">{p.description}</span>}
                          </span>
                          <span className="ext">Pestaña nueva ↗</span>
                        </a>
                      ))}
                      {ws.map((s) => (
                        <Link
                          key={s.id}
                          className="pou-item"
                          to={toViewer(course.slug, `/classroom/${course.slug}/simulaciones/${s.file}`)}
                        >
                          <span className="n">Simulación</span>
                          <span style={{ flex: 1, minWidth: 0 }}>
                            <span className="t">{s.title}</span>
                            <span className="d">{s.description}</span>
                          </span>
                          <span className="ext">Abrir →</span>
                        </Link>
                      ))}
                    </div>
                  </details>
                );
              })}
            </>
          )}
        </div>
      </motion.div>
    </CourseAccessGate>
  );
};

// Lecturas y guías: si son documentos HTML del curso van al visor de la misma
// página; las lecturas internas conservan su ruta de siempre.
const ItemLectura: React.FC<{ r: Reading; slug: string; rotulo: string }> = ({ r, slug, rotulo }) => {
  const destino = r.href ? toViewer(slug, r.href) : `/classroom/${slug}/readings/${r.slug}`;
  return (
    <Link className="pou-item" to={destino}>
      <span className="n">{rotulo}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="t">{r.title}</span>
        <span className="d">{r.summary}</span>
      </span>
      {r.readingMinutes && <span className="ext">{r.readingMinutes} min</span>}
    </Link>
  );
};
