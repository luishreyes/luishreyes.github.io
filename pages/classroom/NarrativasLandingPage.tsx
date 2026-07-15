import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { TodayButton } from '../../components/classroom/TodayButton';
import '../../components/classroom/narrativas-theme.css';

/* ============================================================
   NarrativasLandingPage — bespoke cinematic identity for
   IQYA-3751 «Narrativas Visuales de Datos con IA Generativa».
   Charcoal stage · bone text · citron focus. Renders the same
   Course data as the shared landing, in the course's own system.
   ============================================================ */

interface Props {
  course: Course;
}

/* ---- icons (inline SVG — no CDN, matches repo convention) ---- */
const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);
const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
  </svg>
);

/* ---- viewfinder wordmark (brand device, live type) ---- */
const Wordmark: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <div className="nv-frame nv-mark" style={{ ['--nv-frame-corner' as string]: '11px', ['--nv-frame-inset' as string]: '0px' }}>
      <span className="nv-frame-b" />
      <span style={{ fontFamily: 'var(--nv-font-display)', fontWeight: 500, fontSize: 22, color: 'var(--bone-000)', lineHeight: 1 }}>NV</span>
    </div>
    <span style={{ fontFamily: 'var(--nv-font-display)', fontWeight: 300, fontSize: 20, lineHeight: 0.92, textTransform: 'uppercase', color: 'var(--nv-text)' }}>
      Narrativas<br />Visuales
    </span>
  </div>
);

const Eyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="nv-eyebrow">{children}</span>
);

/* ---- Visor que sigue el scroll y «enfoca» el bloque que se lee ----
   Marco fijo de cuatro esquinas citrón que se desliza (lerp) hacia el
   bloque más cercano al punto de foco del viewport. Solo en el landing. */
const ScrollViewfinder: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respetamos reduce-motion suavizando: la mira sigue apareciendo y
    // «enfocando» (el usuario la pidió), pero sin la interpolación animada.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Enfocamos cada tarjeta/bloque (tamaño de caja), no secciones enteras:
    // así la mira «enfoca lo que se está leyendo».
    const targets = () => Array.from(document.querySelectorAll<HTMLElement>('.nv-course .nv-card, .nv-course .nv-spine'));
    const st = { x: 0, y: 0, w: 0, h: 0, init: false };
    let raf = 0;

    const pick = () => {
      const vh = window.innerHeight;
      const focus = vh * 0.42; // punto de foco, un poco por encima del centro
      let best: DOMRect | null = null;
      let bd = Infinity;
      for (const t of targets()) {
        const r = t.getBoundingClientRect();
        if (r.height === 0) continue;
        const c = r.top + r.height / 2;
        const d = Math.abs(c - focus);
        if (d < bd) { bd = d; best = r; }
      }
      return best;
    };

    const frame = (r: DOMRect) => {
      const vh = window.innerHeight;
      const pad = 14;
      let x = r.left - pad, w = r.width + 2 * pad;
      let y = r.top - pad, h = r.height + 2 * pad;
      const maxH = vh - 40;
      if (h > maxH) {
        const focus = vh * 0.42;
        const cy = Math.min(Math.max(focus, r.top + 60), r.bottom - 60);
        h = maxH; y = cy - maxH / 2;
      }
      y = Math.min(Math.max(y, 16), vh - 16 - h);
      return { x, y, w, h };
    };

    const loop = () => {
      const best = pick();
      if (best) {
        const t = frame(best);
        if (!st.init) { st.x = t.x; st.y = t.y; st.w = t.w; st.h = t.h; st.init = true; el.classList.add('is-visible'); }
        const k = reduce ? 1 : 0.16;
        st.x += (t.x - st.x) * k;
        st.y += (t.y - st.y) * k;
        st.w += (t.w - st.w) * k;
        st.h += (t.h - st.h) * k;
        el.style.transform = `translate(${st.x}px, ${st.y}px)`;
        el.style.width = `${st.w}px`;
        el.style.height = `${st.h}px`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="nv-viewfinder" aria-hidden="true">
      <span className="vf-tl" /><span className="vf-tr" /><span className="vf-bl" /><span className="vf-br" />
    </div>
  );
};

const Section: React.FC<{ eyebrow: string; title: string; description?: string; children: React.ReactNode }> = ({
  eyebrow,
  title,
  description,
  children,
}) => (
  <section className="nv-section">
    <div className="nv-wrap">
      <div className="nv-section-head">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {children}
    </div>
  </section>
);

export const NarrativasLandingPage: React.FC<Props> = ({ course }) => {
  const programa = course.readings.find((r) => r.href);
  const lecturas = course.readings.filter((r) => r.category === 'lectura').length;
  const guias = course.readings.length - lecturas;
  const totalPct = course.evaluation.reduce((s, e) => s + e.percentage, 0);

  // Módulos → dos mitades (arco del curso)
  const half1 = course.modules.slice(0, 4);
  const half2 = course.modules.slice(4);

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } }}
        className="nv-course"
        style={{ minHeight: '100vh' }}
      >
        {/* ---------------- HERO ---------------- */}
        <header
          className="nv-frame"
          style={{
            position: 'relative',
            paddingTop: 128,
            paddingBottom: 72,
            ['--nv-frame-corner' as string]: '28px',
            ['--nv-frame-inset' as string]: '22px',
            backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.62), rgba(10,10,10,0.92)), url(${course.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <span className="nv-frame-b" />
          <div className="nv-wrap" style={{ position: 'relative', zIndex: 2 }}>
            <Link
              to="/classroom"
              className="nv-label"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span aria-hidden="true">←</span> Classroom
            </Link>

            <div style={{ marginTop: 30 }}>
              <Wordmark />
            </div>

            <p className="nv-label nv-label--accent" style={{ marginTop: 40 }}>
              {course.code} · Semestre {course.term} · Electivo · {course.credits} créditos
            </p>
            <h1
              className="nv-in"
              style={{
                fontFamily: 'var(--nv-font-display)',
                fontWeight: 300,
                fontSize: 'clamp(48px, 9vw, 112px)',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                margin: '16px 0 0',
                maxWidth: '15ch',
              }}
            >
              {course.title}
            </h1>
            {course.tagline && (
              <p style={{ marginTop: 22, fontSize: 20, lineHeight: 1.4, color: 'var(--nv-text-muted)', maxWidth: '52ch' }}>
                {course.tagline}
              </p>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 34 }}>
              {programa?.href && (
                <a className="nv-btn nv-btn--primary" href={programa.href} target="_blank" rel="noopener noreferrer">
                  Programa del curso <ExternalIcon />
                </a>
              )}
              <Link className="nv-btn nv-btn--secondary" to={`/classroom/${course.slug}/readings`}>
                Material del curso <ArrowRight />
              </Link>
            </div>

            <dl
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px 40px',
                marginTop: 40,
                paddingTop: 28,
                borderTop: '1px solid var(--nv-border)',
              }}
            >
              {course.schedule.map((s, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <dt className="nv-label">{s.label}</dt>
                  <dd style={{ margin: 0, fontSize: 15, color: 'var(--nv-text)' }}>{s.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </header>

        {/* Visor que enfoca el bloque que se lee al hacer scroll */}
        <ScrollViewfinder />

        {/* ---------------- SPINE QUOTE ---------------- */}
        <section className="nv-section" style={{ borderTop: 'none' }}>
          <div className="nv-wrap">
            <div style={{ marginBottom: 20 }}>
              <TodayButton course={course} />
            </div>
            <p className="nv-spine">
              La pregunta no es qué dicen los datos, sino <em>qué decisión</em> se va a tomar con ellos.
            </p>
            <p style={{ marginTop: 24, maxWidth: '58ch', fontSize: 17, lineHeight: 1.6, color: 'var(--nv-text-muted)' }}>
              {course.description}
            </p>
          </div>
        </section>

        {/* ---------------- ACCESS CARDS ---------------- */}
        <section className="nv-section">
          <div className="nv-wrap">
            <div className="nv-grid nv-grid-2">
              <Link
                to={`/classroom/${course.slug}/readings`}
                className="nv-card nv-card--interactive"
              >
                <p className="nv-label nv-label--accent">Material</p>
                <h3 style={{ marginTop: 8 }}>Material del curso</h3>
                <p style={{ marginTop: 8 }}>
                  {[guias > 0 ? `${guias} ${guias === 1 ? 'guía' : 'guías'}` : null, lecturas > 0 ? `${lecturas} ${lecturas === 1 ? 'lectura' : 'lecturas'}` : null]
                    .filter(Boolean)
                    .join(' · ') || 'Programa y guías del curso'}
                </p>
                <span style={{ display: 'inline-flex', marginTop: 18, color: 'var(--nv-accent)', width: 22, height: 22 }}>
                  <ArrowRight />
                </span>
              </Link>

              <Link to={`/classroom/${course.slug}/presentations`} className="nv-card nv-card--interactive">
                <p className="nv-label">Para clase</p>
                <h3 style={{ marginTop: 8 }}>Presentaciones</h3>
                <p style={{ marginTop: 8 }}>
                  {course.presentations.length > 0
                    ? `${course.presentations.length} ${course.presentations.length === 1 ? 'disponible' : 'disponibles'}`
                    : 'Próximamente'}
                </p>
                <span style={{ display: 'inline-flex', marginTop: 18, color: 'var(--nv-text-muted)', width: 22, height: 22 }}>
                  <ArrowRight />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- ARCO DEL CURSO ---------------- */}
        <Section
          eyebrow="El arco del curso"
          title="Dos libros, dos mitades"
          description="La columna narrativa recorre las 16 semanas. La primera mitad enseña a mostrar, no contar (Storytelling with Data); la segunda a planificar, crear y entregar una presentación estelar (Storytelling with You)."
        >
          <div className="nv-track" aria-hidden="true" style={{ marginBottom: 28 }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className={i < 8 ? 'on' : undefined} />
            ))}
          </div>
          <div className="nv-grid nv-grid-2">
            <div className="nv-card">
              <p className="nv-label nv-label--accent">Semanas 01 – 08 · Fundamentos</p>
              <h3 style={{ marginTop: 8 }}>Mostrar, no contar</h3>
              <p style={{ marginTop: 8 }}>Storytelling with Data (Knaflic, 2015). Contexto, elección del gráfico, decluttering, atención y diseño.</p>
            </div>
            <div className="nv-card">
              <p className="nv-label nv-label--accent">Semanas 09 – 16 · Presentación</p>
              <h3 style={{ marginTop: 8 }}>Narrativas contigo</h3>
              <p style={{ marginTop: 8 }}>Storytelling with You (Knaflic, 2022). Planificar, crear y entregar; el portafolio hacia la presentación estelar.</p>
            </div>
          </div>
        </Section>

        {/* ---------------- OBJETIVOS ---------------- */}
        <Section eyebrow="Objetivos" title="Lo que lograrás al finalizar">
          <div className="nv-grid nv-grid-2">
            {course.objectives.map((obj, i) => (
              <div key={i} className="nv-card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <span className="nv-num" style={{ flexShrink: 0, fontFamily: 'var(--nv-font-display)', fontWeight: 300, fontSize: 30, lineHeight: 1, color: 'var(--nv-accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{ fontSize: 15, lineHeight: 1.55 }}>{obj}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------- EQUIPO ---------------- */}
        <Section eyebrow="Equipo" title="Con quién vas a trabajar">
          <div className="nv-grid nv-grid-3">
            {course.team.map((m) => (
              <div key={m.email} className="nv-card">
                <p className="nv-label nv-label--accent">{m.role}</p>
                <h3 style={{ marginTop: 8, fontSize: 22 }}>{m.name}</h3>
                <a href={`mailto:${m.email}`} style={{ marginTop: 10, display: 'inline-block', fontSize: 14, wordBreak: 'break-all' }}>
                  {m.email}
                </a>
                {m.officeHours && <p style={{ marginTop: 10, fontSize: 13, color: 'var(--nv-text-faint)' }}>{m.officeHours}</p>}
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------- METODOLOGÍA ---------------- */}
        <Section eyebrow="Metodología" title="Cómo aprendemos" description={course.methodology.summary}>
          <div className="nv-grid nv-grid-3">
            {course.methodology.phases.map((phase) => (
              <div key={phase.title} className="nv-card">
                <p className="nv-label nv-label--accent">{phase.label}</p>
                <h3 style={{ marginTop: 8, fontSize: 21 }}>{phase.title}</h3>
                <ul className="nv-list" style={{ marginTop: 14 }}>
                  {phase.items.map((it, i) => (
                    <li key={i}><span>{it}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {course.methodology.synergies && (
            <div className="nv-card" style={{ marginTop: 20 }}>
              <p className="nv-label nv-label--accent">Sinergias</p>
              <ul className="nv-list" style={{ marginTop: 14 }}>
                {course.methodology.synergies.map((s, i) => (
                  <li key={i}><span>{s}</span></li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        {/* ---------------- MÓDULOS ---------------- */}
        <Section eyebrow="Contenido" title="Contenido por módulo" description="Cada módulo abre con una apertura narrativa corta (~30 min) que reencuadra el concepto del día desde la experiencia de usuario; no añade tiempo, lo enfoca.">
          {[{ label: 'Primera mitad · Mostrar, no contar', mods: half1 }, { label: 'Segunda mitad · Narrativas contigo', mods: half2 }].map((group) => (
            <div key={group.label} style={{ marginBottom: 28 }}>
              <p className="nv-label" style={{ marginBottom: 16 }}>{group.label}</p>
              <div className="nv-grid nv-grid-2">
                {group.mods.map((m) => {
                  const [opening, ...rest] = m.topics;
                  return (
                    <article key={m.title} className="nv-card">
                      <h3 style={{ fontSize: 19, lineHeight: 1.1 }}>{m.title}</h3>
                      <div className="nv-mod-open" style={{ marginTop: 14 }}>
                        <span className="nv-mod-open-text">{opening}</span>
                      </div>
                      <ul className="nv-list">
                        {rest.map((t, i) => (
                          <li key={i}><span>{t}</span></li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </Section>

        {/* ---------------- EVALUACIÓN ---------------- */}
        <Section eyebrow="Evaluación" title="Un portafolio, sin exámenes">
          <div className="nv-grid nv-eval-grid" style={{ alignItems: 'start' }}>
            <div className="nv-table-wrap">
              <table className="nv-table">
                <thead>
                  <tr>
                    <th>Componente</th>
                    <th style={{ textAlign: 'center' }}>%</th>
                    <th>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {course.evaluation.map((e) => (
                    <tr key={e.component}>
                      <td className="nv-td-name">{e.component}</td>
                      <td className="nv-td-pct nv-num">{e.percentage}</td>
                      <td>{e.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="nv-card" style={{ textAlign: 'center' }}>
              <p className="nv-label" style={{ justifyContent: 'center' }}>Portafolio acumulativo</p>
              <div className="nv-stat-value nv-stat-value--accent nv-num" style={{ marginTop: 14 }}>{totalPct}%</div>
              <p style={{ marginTop: 10, fontSize: 14 }}>Siete piezas más participación. La nota se construye pieza por pieza.</p>
            </div>
          </div>
        </Section>

        {/* ---------------- IA / AIAS ---------------- */}
        <Section eyebrow="Inteligencia artificial" title="Uso de IA generativa" description={course.aias.intro}>
          <div className="nv-grid nv-grid-5">
            {course.aias.levels.map((lv) => (
              <div key={lv.level} className="nv-card" style={{ padding: 18 }}>
                <p className="nv-label nv-label--accent" style={{ fontSize: 10.5 }}>Nivel {lv.level}</p>
                <h3 style={{ marginTop: 8, fontSize: 17 }}>{lv.title}</h3>
                <p style={{ marginTop: 8, fontSize: 13 }}>{lv.description}</p>
                <p style={{ marginTop: 10, fontSize: 12.5, fontStyle: 'italic', color: 'var(--nv-text-faint)' }}>{lv.application}</p>
              </div>
            ))}
          </div>
          <div className="nv-grid nv-grid-2" style={{ marginTop: 20 }}>
            <div className="nv-card">
              <p className="nv-label nv-label--accent">Objetivos</p>
              <ul className="nv-list" style={{ marginTop: 14 }}>
                {course.aias.goals.map((g, i) => <li key={i}><span>{g}</span></li>)}
              </ul>
            </div>
            <div className="nv-card">
              <p className="nv-label nv-label--accent">Declaración obligatoria por entrega</p>
              <ul className="nv-list" style={{ marginTop: 14 }}>
                {course.aias.declaration.map((d, i) => <li key={i}><span>{d}</span></li>)}
              </ul>
            </div>
          </div>

          <div className="nv-callout nv-callout--ethics" style={{ marginTop: 20 }}>
            <div className="nv-label nv-callout-label">Ética</div>
            <p>
              Un eje truncado o un color engañoso puede subestimar un riesgo. La ética en la comunicación de datos es el hilo
              conductor permanente del curso — de los ejes manipulados a los sesgos de la IA.
            </p>
          </div>
        </Section>

        {/* ---------------- POLÍTICAS ---------------- */}
        <Section eyebrow="Políticas" title="Reglas del curso">
          <div className="nv-grid nv-grid-2">
            {course.policies.map((p) => (
              <div key={p.category} className="nv-card">
                <p className="nv-label nv-label--accent">{p.category}</p>
                <ul className="nv-list" style={{ marginTop: 14 }}>
                  {p.items.map((it, i) => <li key={i}><span>{it}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------------- COMUNIDAD ---------------- */}
        <Section eyebrow="Comunidad" title="Mensaje a la comunidad">
          <div className="nv-grid nv-grid-2">
            {course.community.map((p) => (
              <div key={p.category} className="nv-card">
                <p className="nv-label nv-label--accent">{p.category}</p>
                <ul className="nv-list" style={{ marginTop: 14 }}>
                  {p.items.map((it, i) => <li key={i}><span>{it}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <div style={{ height: 80 }} />
      </motion.div>
    </CourseAccessGate>
  );
};
