import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course, Reading, Presentation, Simulation } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { useCourseRelease, fmtReleaseDate } from '../../components/classroom/courseRelease';
import {
  getPublishToken,
  itemKey,
  savePublishToken,
  type PublishKind,
} from '../../components/classroom/publishState';
import '../../components/classroom/pou-theme.css';

// Material del curso de POU con la identidad «Industry»: cada semana es una
// hoja numerada con sus marcas de registro. Todo arranca colapsado y se abre
// una hoja a la vez, lo transversal va aparte, y lecturas, guías y
// simulaciones abren en el visor de la misma página.
//
// Si el curso restringe la entrega (gradual o manual), el estudiante solo ve
// lo ya disponible: las semanas sin nada publicado se listan selladas para que
// el semestre se vea completo sin adelantar contenido. Con el código del
// equipo docente no hay sellos y, en los cursos de publicación manual
// (`manualRelease`), cada ACTIVIDAD lleva su botón Publicada/Oculta y la
// cabecera de la semana un botón que publica u oculta todo el paquete de una
// vez.

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
  const { isStaff, gated, manual, isWeekOpen, releaseDate, isItemOpen, publishedItems, setItemsPublished } =
    useCourseRelease(course);

  // Publicación manual (equipo docente): el token de GitHub se pega una sola
  // vez y queda en este navegador; con él cada botón escribe el cambio en el
  // repositorio para que lo vean todos los estudiantes.
  const [pubToken, setPubToken] = React.useState<string | null>(() => getPublishToken());
  const [tokenDraft, setTokenDraft] = React.useState('');
  const [pubError, setPubError] = React.useState<string | null>(null);
  // Qué se está guardando ahora mismo: la llave de una actividad o `semana:N`.
  const [guardando, setGuardando] = React.useState<string | null>(null);

  const guardarToken = (e: React.FormEvent) => {
    e.preventDefault();
    const t = tokenDraft.trim();
    if (!t) return;
    savePublishToken(t);
    setPubToken(t);
    setTokenDraft('');
    setPubError(null);
  };

  const olvidarToken = () => {
    savePublishToken(null);
    setPubToken(null);
  };

  const alternarActividades = async (
    changes: Array<{ key: string; on: boolean }>,
    message: string,
    marca: string,
  ) => {
    if (!pubToken) {
      setPubError('Antes de publicar, configure el token del equipo docente (arriba).');
      return;
    }
    if (changes.length === 0) return;
    setGuardando(marca);
    setPubError(null);
    try {
      await setItemsPublished(changes, pubToken, message);
    } catch (err) {
      setPubError(err instanceof Error ? err.message : 'No se pudo guardar el cambio.');
    } finally {
      setGuardando(null);
    }
  };

  // Botón Publicada/Oculta de una actividad. Vive junto al enlace de la
  // actividad (nunca adentro, para no anidar controles) y solo existe en la
  // vista del equipo docente de cursos con publicación manual.
  const botonActividad = (kind: PublishKind, id: string, titulo: string): React.ReactNode => {
    if (!isStaff || !manual) return null;
    const k = itemKey(kind, id);
    const on = publishedItems?.has(k) ?? false;
    return (
      <button
        type="button"
        className={`pou-pub-toggle sm${on ? ' on' : ''}`}
        disabled={guardando !== null}
        aria-pressed={on}
        title={
          on
            ? 'Los estudiantes ven esta actividad. Clic para ocultarla.'
            : 'Los estudiantes no ven esta actividad. Clic para publicarla.'
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void alternarActividades(
            [{ key: k, on: !on }],
            `${on ? 'oculta' : 'publica'} «${titulo}»`,
            k,
          );
        }}
      >
        {guardando === k ? 'Guardando…' : on ? 'Publicada' : 'Oculta'}
      </button>
    );
  };

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
              {gated &&
                (manual
                  ? ' El equipo docente publica cada semana cuando su material está listo.'
                  : ' Cada semana se abre unos días antes de su primera sesión.')}
            </p>
            {isStaff && (manual || course.gradualRelease) && (
              <p className="pou-staff-badge">
                Equipo docente · semestre completo a la vista
              </p>
            )}
            {isStaff && manual && (
              <div className="pou-pub-panel">
                {pubToken ? (
                  <p>
                    Publicación manual activa: cada actividad tiene su botón{' '}
                    <strong>Publicada / Oculta</strong>, y el botón de la cabecera publica u
                    oculta la semana completa de una vez. Los estudiantes ven el cambio en
                    cosa de un minuto.{' '}
                    <button type="button" onClick={olvidarToken}>
                      Cambiar token
                    </button>
                  </p>
                ) : (
                  <>
                    <p>
                      Para publicar u ocultar semanas desde aquí se necesita un{' '}
                      <a
                        href="https://github.com/settings/personal-access-tokens/new"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        fine-grained token de GitHub ↗
                      </a>{' '}
                      con acceso solo a <code>luishreyes.github.io</code> y permiso{' '}
                      «Contents · Read and write». Se pega una sola vez y queda guardado en
                      este navegador.
                    </p>
                    <form onSubmit={guardarToken}>
                      <input
                        type="password"
                        autoComplete="off"
                        spellCheck={false}
                        placeholder="github_pat_…"
                        value={tokenDraft}
                        onChange={(e) => setTokenDraft(e.target.value)}
                        aria-label="Token de publicación"
                      />
                      <button type="submit">Guardar</button>
                    </form>
                  </>
                )}
                {pubError && <p className="err">{pubError}</p>}
              </div>
            )}
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
                // Para estudiantes de un curso manual solo cuentan las
                // actividades publicadas; el equipo docente las ve todas
                // (isItemOpen responde `true` sin filtro para staff).
                const wl = lecturas.filter((r) => r.week === w && isItemOpen('reading', r.slug, r.week));
                const wg = guias.filter((r) => r.week === w && isItemOpen('reading', r.slug, r.week));
                const wp = presentaciones.filter((p) => p.week === w && isItemOpen('pres', p.id, p.week));
                const ws = simulaciones.filter((s) => s.week === w && isItemOpen('sim', s.id, s.week));
                const n = wl.length + wg.length + wp.length + ws.length;
                const fechas = m.dates.slice().sort();
                // Manual: la hoja se sella cuando no hay nada publicado en la
                // semana. Gradual: cuando la fecha aún no llega.
                const abierta_ = manual ? n > 0 : isWeekOpen(w);
                // Estado del paquete completo de la semana, para el botón de
                // la cabecera (equipo docente).
                const claves = isStaff && manual
                  ? [
                      ...wl.map((r) => itemKey('reading', r.slug)),
                      ...wg.map((r) => itemKey('reading', r.slug)),
                      ...wp.map((p) => itemKey('pres', p.id)),
                      ...ws.map((s) => itemKey('sim', s.id)),
                    ]
                  : [];
                const nPub = claves.filter((k) => publishedItems?.has(k)).length;
                const cabecera = (
                  <>
                    <span className="wk" aria-hidden="true">{String(w).padStart(2, '0')}</span>
                    <span className="hd">
                      <span className="k">
                        Semana {w} · {fmtRange(fechas[0], fechas[fechas.length - 1])}
                        {w === enCurso && abierta_ && ' · En curso'}
                        {m.quiz.length > 0 && ` · ${m.quiz.join(', ')}`}
                        {m.taller.length > 0 && ` · ${m.taller.length === 1 ? 'Taller' : 'Talleres'}`}
                      </span>
                      <h3>{m.topics.join(' · ') || `Semana ${w}`}</h3>
                    </span>
                    <span className="cnt">
                      {abierta_
                        ? `${n} ${n === 1 ? 'entrada' : 'entradas'}`
                        : (() => {
                            const f = releaseDate(w);
                            if (f) return `Se abre el ${fmtReleaseDate(f)}`;
                            return manual ? 'Aún no publicada' : 'Aún no disponible';
                          })()}
                    </span>
                    {isStaff && manual && (
                      <span className="pub">
                        <button
                          type="button"
                          className={`pou-pub-toggle${
                            nPub === claves.length ? ' on' : nPub > 0 ? ' mix' : ''
                          }`}
                          disabled={guardando !== null}
                          aria-pressed={nPub === claves.length}
                          title={
                            nPub === claves.length
                              ? 'Toda la semana está publicada. Clic para ocultarla completa.'
                              : nPub > 0
                                ? `${nPub} de ${claves.length} actividades publicadas. Clic para publicar el resto.`
                                : 'Nada de esta semana está publicado. Clic para publicarla completa.'
                          }
                          onClick={(e) => {
                            // El botón vive dentro del `summary`: sin esto, el
                            // clic también abriría o cerraría la hoja.
                            e.preventDefault();
                            e.stopPropagation();
                            const on = nPub < claves.length;
                            const cambios = claves
                              .filter((k) => (publishedItems?.has(k) ?? false) !== on)
                              .map((k) => ({ key: k, on }));
                            void alternarActividades(
                              cambios,
                              `semana ${w} ${on ? 'publicada' : 'oculta'} (${cambios.length} actividades)`,
                              `semana:${w}`,
                            );
                          }}
                        >
                          {guardando === `semana:${w}`
                            ? 'Guardando…'
                            : nPub === claves.length
                              ? 'Semana publicada'
                              : nPub > 0
                                ? `${nPub}/${claves.length} publicadas`
                                : 'Semana oculta'}
                        </button>
                      </span>
                    )}
                  </>
                );

                // Semana que todavía no llega: la hoja se lista sellada, sin
                // contenido y sin ser desplegable.
                if (!abierta_) {
                  return (
                    <div className="pou-sheet locked" key={w} aria-disabled="true">
                      <Marks />
                      <div className="summary-like">{cabecera}</div>
                    </div>
                  );
                }

                return (
                  <details className="pou-sheet" key={w} open={abierta === `s${w}`}>
                    <Marks />
                    <summary onClick={alternar(`s${w}`)}>{cabecera}</summary>
                    <div className="body">
                      {wl.map((r) => (
                        <Fila key={r.slug} toggle={botonActividad('reading', r.slug, r.title)}>
                          <ItemLectura r={r} slug={course.slug} rotulo={`Lectura ${String(r.order ?? '').padStart(2, '0')}`.trim()} />
                        </Fila>
                      ))}
                      {wg.map((r) => (
                        <Fila key={r.slug} toggle={botonActividad('reading', r.slug, r.title)}>
                          <ItemLectura
                            r={r}
                            slug={course.slug}
                            rotulo={r.category === 'taller' ? 'Taller' : 'Guía'}
                          />
                        </Fila>
                      ))}
                      {wp.map((p) => (
                        <Fila key={p.id} toggle={botonActividad('pres', p.id, p.title)}>
                          <a
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
                        </Fila>
                      ))}
                      {ws.map((s) => (
                        <Fila key={s.id} toggle={botonActividad('sim', s.id, s.title)}>
                          <Link
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
                        </Fila>
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

// Fila de actividad: cuando hay botón de publicación (equipo docente, curso
// manual) el enlace y el botón conviven lado a lado, sin anidar controles;
// sin botón, la fila es el enlace de siempre.
const Fila: React.FC<{ toggle: React.ReactNode; children: React.ReactNode }> = ({ toggle, children }) =>
  toggle ? (
    <div className="pou-item-row">
      {children}
      {toggle}
    </div>
  ) : (
    <>{children}</>
  );

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
