import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import '../../components/classroom/narrativas-theme.css';

/* ============================================================
   NarrativasReadingsPage — «Material del curso» organizado por
   SEMANA en acordeones colapsables (identidad carbón · hueso ·
   citrón). Cada semana reúne todo su material —lectura,
   presentación, simulación y handout— y las guías transversales
   viven en un bloque «Del curso» siempre visible. Los materiales
   abren en la misma pestaña (el botón atrás del navegador y la
   barra «Volver al material» de cada documento regresan aquí).
   ============================================================ */

interface Props {
  course: Course;
}

type Kind = 'lectura' | 'practica' | 'presentacion' | 'simulacion' | 'guia';

interface Item {
  key: string;
  kind: Kind;
  kindLabel: string;
  cta: string;
  title: string;
  desc?: string;
  date?: string;
  week?: number;
  href?: string;
  to?: string;
}

const KIND_ORDER: Record<Kind, number> = { lectura: 0, practica: 1, presentacion: 2, simulacion: 3, guia: 4 };

const formatDate = (iso?: string): string => {
  if (!iso) return '';
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatDateShort = (iso: string): string => {
  const d = new Date(iso + 'T12:00:00');
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
};

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true" style={{ width: '0.9em', height: '0.9em' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="nv-week-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
  </svg>
);

const collectItems = (course: Course): Item[] => {
  const slug = course.slug;
  const items: Item[] = [];

  (course.readings ?? []).forEach((r) => {
    const cat = r.category ?? 'guia';
    const kind: Kind = cat === 'lectura' ? 'lectura' : cat === 'practica' ? 'practica' : 'guia';
    const kindLabel = kind === 'lectura' ? 'Lectura' : kind === 'practica' ? 'Práctica' : 'Guía';
    const cta = kind === 'lectura' ? 'Abrir lectura' : kind === 'practica' ? 'Abrir handout' : 'Abrir guía';
    items.push({
      key: `r-${r.slug}`,
      kind, kindLabel, cta,
      title: r.title, desc: r.summary, date: r.date, week: r.week,
      href: r.href,
      to: r.href ? undefined : `/classroom/${slug}/readings/${r.slug}`,
    });
  });

  (course.presentations ?? []).forEach((p) => {
    items.push({
      key: `p-${p.id}`,
      kind: 'presentacion', kindLabel: 'Presentación', cta: 'Abrir deck',
      title: p.title, desc: p.description, date: p.date, week: p.week ?? p.sessionNumber,
      href: `/classroom/${slug}/slides/${p.file}`,
    });
  });

  (course.simulations ?? []).forEach((s) => {
    items.push({
      key: `s-${s.id}`,
      kind: 'simulacion', kindLabel: 'Simulación', cta: 'Abrir simulación',
      title: s.title, desc: s.description, week: s.week ?? s.sessionNumber,
      href: `/classroom/${slug}/simulaciones/${s.file}`,
    });
  });

  return items;
};

const MaterialCard: React.FC<{ item: Item }> = ({ item }) => {
  const inner = (
    <div className="nv-rc-body">
      <div>
        <p className="nv-label nv-label--accent">{item.kindLabel}</p>
        <div className="nv-rc-meta">
          {item.date && <time dateTime={item.date}>{formatDate(item.date)}</time>}
          {item.date && <span aria-hidden="true">·</span>}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--nv-accent)' }}>
            {item.cta} <ExternalIcon />
          </span>
        </div>
        <h3 className="nv-rc-title">{item.title}</h3>
        {item.desc && <p className="nv-rc-summary">{item.desc}</p>}
      </div>
    </div>
  );
  return (
    <li>
      {item.href ? (
        <a href={item.href} className="nv-rc">{inner}</a>
      ) : (
        <Link to={item.to as string} className="nv-rc">{inner}</Link>
      )}
    </li>
  );
};

const ACCORDION_CSS = `
.nv-week{border:1px solid var(--nv-line, rgba(232,230,225,.14));border-radius:6px;margin-top:14px;overflow:hidden;background:var(--nv-surface, #141412)}
.nv-week>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:20px;padding:20px 24px;outline:none}
.nv-week>summary::-webkit-details-marker{display:none}
.nv-week>summary:focus-visible{box-shadow:inset 0 0 0 2px var(--nv-accent, #C9C41C)}
.nv-week-n{font-family:var(--nv-display, 'Big Shoulders Display'), system-ui, sans-serif;font-weight:700;font-size:34px;line-height:1;color:var(--nv-accent, #C9C41C);min-width:92px;letter-spacing:-.01em}
.nv-week-n small{display:block;font-family:var(--nv-text, 'Archivo'), system-ui, sans-serif;font-weight:600;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--nv-text-faint, #86847C);margin-top:4px}
.nv-week-t{flex:1;min-width:0}
.nv-week-t b{display:block;font-size:20px;font-weight:600;color:var(--nv-text, #E8E6E1);line-height:1.2}
.nv-week-t span{display:block;font-size:13.5px;color:var(--nv-text-faint, #86847C);margin-top:3px}
.nv-week-c{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--nv-text-faint, #86847C);white-space:nowrap}
.nv-week-x{width:20px;height:20px;color:var(--nv-text-faint, #86847C);transition:transform .2s ease;flex-shrink:0}
.nv-week[open]>summary .nv-week-x{transform:rotate(180deg)}
.nv-week-body{padding:2px 24px 22px}
.nv-week--empty>summary{cursor:default}
.nv-week--empty .nv-week-n,.nv-week--empty .nv-week-t b{opacity:.5}
.nv-week-empty-note{margin:6px 0 4px;color:var(--nv-text-faint, #86847C);font-style:italic;font-size:14px}
@media (max-width:560px){
  .nv-week>summary{gap:14px;padding:16px 16px}
  .nv-week-n{font-size:26px;min-width:64px}
  .nv-week-t b{font-size:17px}
  .nv-week-body{padding:2px 16px 18px}
}
`;

export const NarrativasReadingsPage: React.FC<Props> = ({ course }) => {
  const items = collectItems(course);
  const transversal = items
    .filter((it) => it.week == null)
    .sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]);

  const byWeek = new Map<number, Item[]>();
  items.filter((it) => it.week != null).forEach((it) => {
    const w = it.week as number;
    if (!byWeek.has(w)) byWeek.set(w, []);
    (byWeek.get(w) as Item[]).push(it);
  });
  byWeek.forEach((list) => list.sort((a, b) => KIND_ORDER[a.kind] - KIND_ORDER[b.kind]));

  const weeks = [...(course.cronograma ?? [])].sort((a, b) => a.week - b.week);

  // Semana a abrir por defecto: la más reciente (con material) cuya fecha ya pasó;
  // si el curso no ha empezado, la primera semana con material.
  const today = new Date();
  const withItems = weeks.filter((w) => byWeek.has(w.week));
  let openWeek = 0;
  withItems.forEach((w) => {
    const d = new Date(w.date + 'T23:59:59');
    if (d <= today) openWeek = w.week;
  });
  if (!openWeek && withItems.length) openWeek = withItems[0].week;

  const hasAnything = items.length > 0;

  return (
    <CourseAccessGate course={course}>
      <style>{ACCORDION_CSS}</style>
      <motion.div
        {...{ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }}
        className="nv-course"
        style={{ minHeight: '100vh', paddingTop: 112, paddingBottom: 80 }}
      >
        <div className="nv-wrap" style={{ maxWidth: 940 }}>
          <nav className="nv-label" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <Link to="/classroom" style={{ color: 'var(--nv-text-faint)' }}>Classroom</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/classroom/${course.slug}`} style={{ color: 'var(--nv-text-faint)' }}>{course.code}</Link>
            <span aria-hidden="true">/</span>
            <span style={{ color: 'var(--nv-accent)' }}>Material del curso</span>
          </nav>

          <header style={{ marginTop: 26 }}>
            <p className="nv-label nv-label--accent">{course.code} · Material del curso</p>
            <h1 style={{ marginTop: 12, fontSize: 'clamp(40px, 7vw, 68px)', textTransform: 'uppercase', lineHeight: 0.94 }}>
              Material del curso
            </h1>
            <p style={{ marginTop: 16, color: 'var(--nv-text-muted)', fontSize: 17, lineHeight: 1.55, maxWidth: '58ch' }}>
              Organizado por semana. Abre la semana que necesites y encontrarás todo su material junto:
              la lectura previa, la presentación de clase, los handouts y las simulaciones. Las guías
              transversales del curso están arriba, en «Del curso».
            </p>
          </header>

          {!hasAnything ? (
            <p style={{ marginTop: 40, color: 'var(--nv-text-muted)' }}>Aún no hay material publicado. Vuelve pronto.</p>
          ) : (
            <>
              {transversal.length > 0 && (
                <section style={{ marginTop: 44 }}>
                  <div className="nv-rc-head">
                    <div>
                      <h2 style={{ fontSize: 26, textTransform: 'uppercase' }}>Del curso</h2>
                      <p style={{ marginTop: 6, color: 'var(--nv-text-muted)', fontSize: 15 }}>
                        Documentos transversales al semestre: el programa y las rúbricas.
                      </p>
                    </div>
                    <span className="nv-label">{transversal.length} {transversal.length === 1 ? 'documento' : 'documentos'}</span>
                  </div>
                  <ul className="nv-rc-list">
                    {transversal.map((it) => <MaterialCard key={it.key} item={it} />)}
                  </ul>
                </section>
              )}

              <section style={{ marginTop: 52 }}>
                <div className="nv-rc-head">
                  <div>
                    <h2 style={{ fontSize: 26, textTransform: 'uppercase' }}>Por semana</h2>
                    <p style={{ marginTop: 6, color: 'var(--nv-text-muted)', fontSize: 15 }}>
                      Las 16 sesiones del semestre. Toca una semana para desplegar su material.
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 18 }}>
                  {weeks.map((w) => {
                    const list = byWeek.get(w.week) ?? [];
                    const empty = list.length === 0;
                    return (
                      <details
                        key={w.week}
                        className={`nv-week${empty ? ' nv-week--empty' : ''}`}
                        open={w.week === openWeek}
                      >
                        <summary>
                          <span className="nv-week-n">
                            {String(w.week).padStart(2, '0')}
                            <small>{formatDateShort(w.date)}</small>
                          </span>
                          <span className="nv-week-t">
                            <b>{w.topic}</b>
                            <span>Semana {w.week} · {w.day}{w.proyecto ? ` · entrega: ${w.proyecto}` : ''}</span>
                          </span>
                          <span className="nv-week-c">
                            {empty ? 'Por publicar' : `${list.length} ${list.length === 1 ? 'ítem' : 'ítems'}`}
                          </span>
                          <ChevronIcon />
                        </summary>
                        <div className="nv-week-body">
                          {empty ? (
                            <p className="nv-week-empty-note">Aún no hay material para esta semana.</p>
                          ) : (
                            <ul className="nv-rc-list">
                              {list.map((it) => <MaterialCard key={it.key} item={it} />)}
                            </ul>
                          )}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>
      </motion.div>
    </CourseAccessGate>
  );
};
