import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import type { Course } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { useCourseRelease } from '../../components/classroom/courseRelease';
import { TodayButton } from '../../components/classroom/TodayButton';
import { Pou27Barra, Pou27Mosaico } from '../../components/classroom/Pou27Cabecera';

// Landing de POU 2027-10. Mismo contenido y misma función que la del semestre
// anterior (ficha, accesos, reto, alcance, equipo, objetivos, evaluación,
// metodología, IA y reglas), con la identidad institucional y la dirección
// «colour chapters» de la skill de diseño. Cada bloque es un capítulo de color.

const A = '/classroom/iqya-2031-2027-10/assets'; // la lámina del reto

// Documento interno del curso: se abre en el visor de la misma página.
const isInternalDoc = (slug: string, href?: string): boolean =>
  !!href && href.startsWith(`/classroom/${slug}/`);
const toViewer = (slug: string, href: string): string =>
  `/classroom/${slug}/ver/${href.slice(`/classroom/${slug}/`.length)}`;

const SALE: [number, number, number, number] = [0.22, 0.8, 0.3, 1];

// Entrada por partes: cada hijo sube un poco, una sola vez, al entrar en vista.
const Sube: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    transition={{ duration: 0.62, ease: SALE, delay }}
  >
    {children}
  </motion.div>
);

// La cosa viva: dos líquidos inmiscibles hierven cuando la suma de sus
// presiones de vapor puras iguala la presión del sistema. Agua: Antoine en
// mmHg y °C. Limoneno: Antoine en kPa y °C, ajustado a su punto de
// ebullición normal (176 °C) y a su presión de vapor a 25 °C.
const pAgua = (t: number) => Math.pow(10, 8.07131 - 1730.63 / (233.426 + t)) * 0.133322;
const pLim = (t: number) => Math.pow(10, 6.21379 - 1615.9 / (t + 208));
const tEbullicion = (p: number) => {
  let a = 30;
  let b = 110;
  for (let i = 0; i < 60; i++) {
    const m = (a + b) / 2;
    if (pAgua(m) + pLim(m) > p) b = m;
    else a = m;
  }
  return (a + b) / 2;
};
const coma = (x: number, d: number) => x.toFixed(d).replace('.', ',');
const PLANTA = 0.013; // kg de aceite por kg de vapor en una planta real

const Equilibrio: React.FC = () => {
  const [p, setP] = useState(101.3);
  const t = tEbullicion(p);
  const rel = (pLim(t) * 136.24) / (pAgua(t) * 18.02);
  return (
    <div className="equilibrio">
      <h3>El equilibrio, en vivo</h3>
      <p className="texto" style={{ marginTop: '10px' }}>
        Mueva la presión del extractor. Vea a qué temperatura hierve la mezcla de agua y limoneno, y cuánto
        aceite arrastraría cada kilo de vapor si mandara el equilibrio.
      </p>
      <label className="eq-control" htmlFor="presion27">
        Presión del extractor <output htmlFor="presion27">{coma(p, 1)} kPa</output>
      </label>
      <input
        id="presion27"
        type="range"
        min={40}
        max={110}
        step={0.1}
        value={p}
        onChange={(e) => setP(parseFloat(e.target.value))}
      />
      <div className="cifras" aria-live="polite">
        <div>
          <b>{coma(t, 1)} °C</b>
          <span>Temperatura a la que hierve la mezcla</span>
        </div>
        <div>
          <b>{coma(rel, 2)} kg</b>
          <span>De aceite por kilo de vapor, en equilibrio</span>
        </div>
        <div>
          <b>{Math.round(rel / PLANTA)} veces</b>
          <span>Lo que da la planta: unos 13 gramos por kilo de vapor</span>
        </div>
      </div>
      <p className="eq-nota">
        En Bogotá la presión es de unos 75 kPa, y la mezcla hierve cerca de 90 °C. Los valores salen de las
        ecuaciones de Antoine del agua y del limoneno: son orientativos y no reemplazan el modelo termodinámico
        de ASPEN.
      </p>
    </div>
  );
};

export const Pou2027LandingPage: React.FC<{ course: Course }> = ({ course }) => {
  // Los conteos cuentan lo que la sesión puede abrir hoy, como en el semestre
  // anterior: anunciar 14 lecturas cuando hay 3 disponibles confunde.
  const { isItemOpen } = useCourseRelease(course);
  const disponible = course.readings.filter((r) => isItemOpen('reading', r.slug, r.week));
  const cronograma = course.readings.find((r) => r.slug === 'cronograma-interactivo');
  const lecturas = disponible.filter((r) => r.category === 'lectura').length;
  const guias = disponible.filter((r) => r.category !== 'lectura' && r.slug !== 'cronograma-interactivo').length;
  const pres = (course.presentations ?? []).filter((p) => isItemOpen('pres', p.id, p.week)).length;
  const sims = (course.simulations ?? []).filter((s) => isItemOpen('sim', s.id, s.week)).length;

  // El alcance del proyecto se escribe «Etapa · Operación».
  const tren = useMemo(
    () =>
      (course.project?.scope ?? []).map((s) => {
        const [etapa, op] = s.split(' · ');
        return { etapa, op };
      }),
    [course.project],
  );

  const docLink = (href: string, children: React.ReactNode, className?: string) =>
    isInternalDoc(course.slug, href) ? (
      <Link className={className} to={toViewer(course.slug, href)}>
        {children}
      </Link>
    ) : (
      <a className={className} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );

  return (
    <CourseAccessGate course={course}>
      <MotionConfig reducedMotion="user">
        <div className="pou27" style={{ minHeight: '100vh', paddingTop: '64px' }}>
          {/* ── Barra y mosaico ─────────────────────────────────────── */}
          <header>
            <Pou27Barra course={course} enInicio />
            <Pou27Mosaico course={course} />

            <div className="titular c">
              <h1>
                <span className="linea">
                  <motion.span initial={{ y: '104%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
                    Una planta de
                  </motion.span>
                </span>{' '}
                <span className="linea">
                  <motion.span initial={{ y: '104%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.11 }}>
                    aceite esencial
                  </motion.span>
                </span>
              </h1>
              <Sube delay={0.35} className="standfirst">
                <p>
                  {course.title} · {course.code} · {course.term}. Dieciséis semanas para diseñar, dimensionar y
                  simular una planta que tiene que funcionar en el papel.
                </p>
              </Sube>
              <Sube delay={0.45} className="acciones">
                <Link className="boton" to={`/classroom/${course.slug}/readings`}>
                  Material del curso
                </Link>
                <span className="hoy">
                  <TodayButton course={course} />
                </span>
              </Sube>
            </div>
          </header>

          <main>
            {/* ── La planta manda el temario ──────────────────────────── */}
            <section className="campo amarillo" aria-label="Ficha del curso">
              <div className="c">
                <Sube><h2>La planta manda el temario</h2></Sube>
                <Sube delay={0.07}>
                  <p className="texto">
                    Aquí las operaciones unitarias no llegan en el orden del libro. Cada una entra la semana en que su
                    equipo la necesita para cerrar un balance de su propia planta.
                  </p>
                </Sube>
                <Sube delay={0.14} className="cifras">
                  <div><b>16</b><span>Semanas, de la cáscara al aceite rectificado</span></div>
                  <div><b>{course.credits}</b><span>Créditos, unas 9 horas de trabajo por semana</span></div>
                  <div><b>4 a 5</b><span>Personas por equipo, fijo todo el semestre</span></div>
                  {tren.length > 0 && <div><b>{tren.length}</b><span>Etapas de diseño, de la cáscara a la columna</span></div>}
                </Sube>
              </div>
            </section>

            {/* ── El tren de proceso ──────────────────────────────────── */}
            {tren.length > 0 && (
              <section className="campo navy" aria-label="Alcance del proyecto">
                <div className="c">
                  <Sube><h2>La planta, de arriba abajo</h2></Sube>
                  <Sube delay={0.07}>
                    <p className="texto">
                      Cada etapa es una operación del curso, y cada una entra la semana en que el equipo la necesita.
                      La última es la columna que hace el producto.
                    </p>
                  </Sube>
                  <ol className="tren">
                    {tren.map((e, i) => (
                      <motion.li
                        key={e.etapa}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                        transition={{ duration: 0.55, ease: SALE, delay: i * 0.05 }}
                      >
                        <span className="q">{e.etapa}</span>
                        {e.op && <span className="op">{e.op}</span>}
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {/* ── El reto ─────────────────────────────────────────────── */}
            {course.project && (
              <section className="campo nieve" aria-label="Proyecto del semestre">
                <div className="c dupla">
                  <div>
                    <Sube><h2>Un residuo de juguera</h2></Sube>
                    <Sube delay={0.07}><p className="texto">{course.project.overview}</p></Sube>
                    <Sube delay={0.14}>
                      <ul className="materias">
                        {course.project.rawMaterials.map((m) => (
                          <li key={m.name}>
                            <b>{m.name}</b>
                            <span>{m.outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </Sube>
                    {course.challenges?.href && (
                      <Sube delay={0.2}>{docLink(course.challenges.href, 'Abrir la guía del reto', 'boton')}</Sube>
                    )}
                  </div>
                  <Sube delay={0.1}>
                    <figure className="lamina">
                      <img
                        src={`${A}/lamina-blanco.jpg`}
                        alt="Lámina de Citrus madurensis con rama, hojas y frutos, de la Flora de Filipinas de Francisco Manuel Blanco."
                        width={1182}
                        height={1319}
                        loading="lazy"
                      />
                      <figcaption>Citrus madurensis, en la Flora de Filipinas de Francisco Manuel Blanco.</figcaption>
                    </figure>
                  </Sube>
                </div>
                <div className="c">
                  <Sube><Equilibrio /></Sube>
                </div>
              </section>
            )}

            {/* ── Dónde está todo ─────────────────────────────────────── */}
            <section className="campo papel" aria-label="Accesos del curso">
              <div className="c">
                <Sube><h2>Dónde está todo</h2></Sube>
                <Sube delay={0.07}>
                  <ul className="accesos">
                    <li>
                      <Link to={`/classroom/${course.slug}/readings`}>
                        <span className="q">Material del curso</span>
                        <span className="d">
                          {[
                            lecturas > 0 && `${lecturas} lecturas`,
                            pres > 0 && `${pres} presentaciones`,
                            guias > 0 && `${guias} guías`,
                            sims > 0 && `${sims} simulaciones`,
                          ]
                            .filter(Boolean)
                            .join(' · ') || 'El material se abre semana a semana'}
                        </span>
                        <span className="ir" aria-hidden="true">→</span>
                      </Link>
                    </li>
                    {(course.simulations?.length ?? 0) > 0 && (
                      <li>
                        <Link to={`/classroom/${course.slug}/simulations`}>
                          <span className="q">Simuladores</span>
                          <span className="d">
                            {sims > 0
                              ? `${sims} ${sims === 1 ? 'disponible' : 'disponibles'}, en el orden del semestre`
                              : 'Cada simulador llega con el material de su semana'}
                          </span>
                          <span className="ir" aria-hidden="true">→</span>
                        </Link>
                      </li>
                    )}
                    {cronograma?.href && (
                      <li>
                        {docLink(
                          cronograma.href,
                          <>
                            <span className="q">Cronograma</span>
                            <span className="d">Qué sigue esta semana y el recorrido completo del semestre</span>
                            <span className="ir" aria-hidden="true">→</span>
                          </>,
                        )}
                      </li>
                    )}
                  </ul>
                </Sube>
              </div>
            </section>

            {/* ── Objetivos ───────────────────────────────────────────── */}
            <section className="campo nieve" aria-label="Objetivos del curso">
              <div className="c">
                <Sube><h2>Al terminar el curso</h2></Sube>
                <ul className="objetivos">
                  {course.objectives.map((o, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                      transition={{ duration: 0.62, ease: SALE, delay: i * 0.06 }}
                    >
                      {o}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ── Evaluación ──────────────────────────────────────────── */}
            <section className="campo navy" aria-label="Evaluación">
              <div className="c">
                <Sube><h2>Cómo se construye la nota</h2></Sube>
                <Sube delay={0.07} className="cifras">
                  {course.evaluation.map((e) => (
                    <div key={e.component}>
                      <b>{e.percentage} %</b>
                      <span>{e.component}</span>
                    </div>
                  ))}
                </Sube>
              </div>
            </section>

            {/* ── Metodología ─────────────────────────────────────────── */}
            <section className="campo papel" aria-label="Metodología">
              <div className="c">
                <Sube><h2>Cómo aprendemos</h2></Sube>
                <Sube delay={0.07}><p className="texto">{course.methodology.summary}</p></Sube>
                <div className="fases">
                  {course.methodology.phases.map((f, i) => (
                    <Sube key={f.label} delay={i * 0.08} className="fase">
                      <h3>{f.title}</h3>
                      <span className="k">{f.label}</span>
                      <ul>
                        {f.items.map((it, j) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </Sube>
                  ))}
                </div>
              </div>
            </section>

            {/* ── Equipo docente ─────────────────────────────────────── */}
            <section className="campo nieve" aria-label="Equipo docente">
              <div className="c">
                <Sube><h2>Con quién va a trabajar</h2></Sube>
                <div className="gente">
                  {course.team.map((m, i) => (
                    <Sube key={m.email} delay={i * 0.07}>
                      <h3>{m.name}</h3>
                      <span className="rol">{m.role}</span>
                      <a href={`mailto:${m.email}`}>{m.email}</a>
                      {m.officeHours && <span className="hora">{m.officeHours}</span>}
                    </Sube>
                  ))}
                </div>
                <Sube delay={0.1} className="horario">
                  {course.schedule.map((s, i) => (
                    <p key={i}>
                      <b>{s.label}.</b> {s.detail}
                    </p>
                  ))}
                  <p className="texto" style={{ marginTop: '14px' }}>
                    Escriba a los tres en el mismo mensaje, con el asunto <b>[{course.code}]</b> seguido del tema.
                    Respuesta en 48 horas hábiles.
                  </p>
                </Sube>
              </div>
            </section>

            {/* ── Inteligencia artificial ─────────────────────────────── */}
            <section className="campo papel" aria-label="Uso de inteligencia artificial">
              <div className="c">
                <Sube><h2>Inteligencia artificial</h2></Sube>
                <Sube delay={0.07}><p className="texto">{course.aias.intro}</p></Sube>
                <Sube delay={0.14}>
                  <table className="tabla">
                    <thead>
                      <tr>
                        <th scope="col">Nivel</th>
                        <th scope="col">Qué permite</th>
                        <th scope="col">Dónde aplica</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.aias.levels.map((lv) => (
                        <tr key={lv.level} className={lv.application.startsWith('No aplica') ? 'apagado' : undefined}>
                          <td className="nivel">Nivel {lv.level}</td>
                          <td>
                            {lv.title}
                            <span className="d">{lv.description}</span>
                          </td>
                          <td>{lv.application}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Sube>
              </div>
            </section>

            {/* ── Reglas ──────────────────────────────────────────────── */}
            <section className="campo nieve" aria-label="Políticas del curso">
              <div className="c">
                <Sube><h2>Reglas del curso</h2></Sube>
                <div className="reglas">
                  {[...course.policies, ...course.community].map((p, i) => (
                    <Sube key={p.category} delay={(i % 3) * 0.06}>
                      <h3>{p.category}</h3>
                      <ul>
                        {p.items.map((it, j) => (
                          <li key={j}>{it}</li>
                        ))}
                      </ul>
                    </Sube>
                  ))}
                </div>
              </div>
            </section>
          </main>

          {/* ── Cierre ────────────────────────────────────────────────── */}
          <footer className="cierre navy">
            <div className="c">
              <p className="sigla">POU</p>
              <p>
                {course.title} · {course.code} · Universidad de los Andes · Departamento de Ingeniería Química y de
                Alimentos · Periodo {course.term}.
              </p>
              <p>
                Imágenes:{' '}
                <a href="https://commons.wikimedia.org/wiki/File:Citrus_-_Citronier._(5_types_of_bitter_orange,_sweet_lemon,_and_sweet_lime)_(NYPL_b14485031-1110822).tiff">«Citrus, Citronier»</a>{' '}
                y{' '}
                <a href="https://commons.wikimedia.org/wiki/File:Citrus_aurantium_-_Citronier_oranger._(Bitter_orange)_(NYPL_b14485031-1110829).tiff">«Citrus aurantium»</a>
                , New York Public Library, <a href="https://creativecommons.org/publicdomain/mark/1.0/">dominio público</a>;{' '}
                <a href="https://commons.wikimedia.org/wiki/File:An_apothecary_drawing_liquid_from_a_primitive_distillation_m_Wellcome_V0010767.jpg">«Un boticario y un alambique primitivo»</a>{' '}
                y{' '}
                <a href="https://commons.wikimedia.org/wiki/File:Yuzu_orange_plant_(Citrus_species);_branch_with_two_fruit._Wellcome_V0043738.jpg">«Rama de cítrico con dos frutos»</a>
                , Wellcome Collection, <a href="https://creativecommons.org/licenses/by/4.0">CC BY 4.0</a>;{' '}
                <a href="https://commons.wikimedia.org/wiki/File:Citrus_madurensis_Blanco1.185.jpg">«Citrus madurensis»</a>, Francisco Manuel
                Blanco, <a href="https://creativecommons.org/publicdomain/mark/1.0/">dominio público</a>. Todas vía Wikimedia Commons.
              </p>
            </div>
          </footer>
        </div>
      </MotionConfig>
    </CourseAccessGate>
  );
};
