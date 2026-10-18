import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../../components/Apertura';
import { Sube, SALE } from '../../components/Sube';
import { motion } from 'framer-motion';
import {
  teachingData,
  courseCatalog,
  challengeEditions,
  biotechCohorts,
  globalEvaluation,
  evaluationLessons,
  type TaughtCourse,
  type CourseRecord,
  type CourseTheme,
} from '../../components/data/teaching';
import { metrics } from '../../components/data/metrics';
import { SemesterSeriesChart } from '../../components/CoursesOverTimeChart';
import { useI18n, localize, fill, num, cardinal, type UIKey, type Lang } from '../../context/i18n';
import { fotos, type Foto } from '../../components/data/fotos';

type FilterType = 'All' | 'Core' | 'Elective' | 'CBU' | 'Undergraduate' | 'Graduate';
const filterOptions: FilterType[] = ['All', 'Core', 'Elective', 'CBU', 'Undergraduate', 'Graduate'];
const filterLabelKey: Record<FilterType, UIKey> = {
  All: 'courses.filter.all',
  Core: 'courses.filter.core',
  Elective: 'courses.filter.elective',
  CBU: 'courses.filter.cbu',
  Undergraduate: 'courses.filter.undergraduate',
  Graduate: 'courses.filter.graduate',
};
const typeKey: Record<TaughtCourse['type'], UIKey> = {
  Core: 'teaching.type.core',
  Elective: 'teaching.type.elective',
  CBU: 'teaching.type.cbu',
  EDCO: 'teaching.type.edco',
  Corporate: 'teaching.type.corporate',
  Coursera: 'teaching.type.coursera',
};
const levelKey: Record<NonNullable<TaughtCourse['level']>, UIKey> = {
  Undergraduate: 'courses.filter.undergraduate',
  Graduate: 'courses.filter.graduate',
};

const ordenados = [...teachingData].sort((a, b) => b.term.localeCompare(a.term));
const { teaching } = metrics;

// Todos los semestres del registro, de 2017-20 al último: el eje de la tira de cada curso.
const SEMESTRES = (() => {
  const terms = teachingData.map((c) => c.term).sort();
  const [a0, s0] = terms[0].split('-').map(Number);
  const [a1, s1] = terms[terms.length - 1].split('-').map(Number);
  const out: string[] = [];
  for (let a = a0, s = s0; a < a1 || (a === a1 && s <= s1); s === 10 ? (s = 20) : ((s = 10), a++)) out.push(`${a}-${s}`);
  return out;
})();

const TEMAS: { tema: CourseTheme; titulo: UIKey; fondo: string }[] = [
  { tema: 'process', titulo: 'tch.theme.process', fondo: 'a-papel' },
  { tema: 'bio', titulo: 'tch.theme.bio', fondo: 'a-hundido' },
  { tema: 'general', titulo: 'tch.theme.general', fondo: 'a-papel' },
  { tema: 'ai', titulo: 'tch.theme.ai', fondo: 'a-hundido' },
];

/** Las secciones de un curso en el registro, por cualquiera de sus códigos. */
const seccionesDe = (c: CourseRecord) => teachingData.filter((s) => c.codes.includes(s.code));

const lista = (nombres: string[], y: string) =>
  nombres.length < 2 ? nombres.join('') : `${nombres.slice(0, -1).join(', ')} ${y} ${nombres[nombres.length - 1]}`;

/** Los semestres dictados de un curso, como una tira: un cuadro por semestre, el del año en que
 *  lo creé o lo rediseñé como rombo. La forma lleva la diferencia, no el color. */
const Tira: React.FC<{ curso: CourseRecord }> = ({ curso }) => {
  const { t } = useI18n();
  const dictados = new Set(seccionesDe(curso).map((s) => s.term));
  const etiqueta = fill(t('tch.strip.label'), {
    first: SEMESTRES[0],
    last: SEMESTRES[SEMESTRES.length - 1],
    terms: [...dictados].sort().join(', '),
  });
  return (
    <div className="mt-4" role="img" aria-label={etiqueta}>
      <div className="flex gap-[3px]" aria-hidden="true">
        {SEMESTRES.map((s) => {
          const es = s === curso.since;
          return (
            <span
              key={s}
              title={s}
              className={`block w-[10px] h-[10px] ${es ? 'bg-tinta-900 rotate-45 scale-90' : dictados.has(s) ? 'bg-tinta-600' : 'bg-papel-300'}`}
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between a-meta" style={{ width: SEMESTRES.length * 13 - 3 }} aria-hidden="true">
        <span>{SEMESTRES[0].slice(0, 4)}</span>
        <span>{SEMESTRES[SEMESTRES.length - 1].slice(0, 4)}</span>
      </div>
    </div>
  );
};

/** Un curso: el semestre en que lo creé o lo rediseñé en su columna, el nombre, los códigos, con
 *  quién, cuántas secciones y estudiantes, su evaluación media, la tira y el texto. */
const Curso: React.FC<{ curso: CourseRecord; children?: React.ReactNode; delay?: number }> = ({ curso, children, delay = 0 }) => {
  const { t, lang } = useI18n();
  const secciones = seccionesDe(curso);
  const estudiantes = secciones.reduce((s, c) => s + c.students, 0);
  const evaluadas = secciones.map((s) => s.evaluation).filter((v): v is number => v !== null);
  const media = evaluadas.length ? Math.round(evaluadas.reduce((a, b) => a + b, 0) / evaluadas.length) : null;
  const accion = fill(t(curso.action === 'created' ? 'tch.course.created' : 'tch.course.redesigned'), { term: curso.since });
  const con = curso.partners?.length ? ` ${fill(t('tch.course.with'), { names: lista(curso.partners, t('tch.and')) })}` : '';
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
  return (
    <Sube as="li" delay={delay}>
      <span className="cuando">{curso.since}</span>
      <div>
        <p className="que">{localize(curso.title, lang)}</p>
        <p className="donde">{curso.codes.join(' · ')} · {accion}{con}</p>
        <p className="a-meta mt-1">
          {secciones.length === 1
            ? fill(t('tch.course.section1'), { students: miles(estudiantes) })
            : fill(t('tch.course.sections'), { n: secciones.length, students: miles(estudiantes) })}
          {media !== null && ` · ${fill(t('tch.course.mean'), { score: media })}`}
        </p>
        <Tira curso={curso} />
        {localize(curso.text, lang).split('\n\n').map((p, i) => (
          <p key={i} className="detalle">{p}</p>
        ))}
        {children}
      </div>
    </Sube>
  );
};

/** Las ediciones del Chemical Engineering Challenge: tabla en pantallas anchas, lista en el teléfono. */
const Ediciones: React.FC = () => {
  const { t, lang } = useI18n();
  return (
    <div className="mt-8 max-w-[64ch]">
      <p className="font-semibold text-tinta-900">{t('tch.co.editions')}</p>
      <table className="a-tabla mt-3 hidden md:table">
        <thead>
          <tr>
            <th scope="col" className="w-[6rem]">{t('tch.co.ed.term')}</th>
            <th scope="col" className="w-[11rem]">{t('tch.co.ed.with')}</th>
            <th scope="col">{t('tch.co.ed.challenges')}</th>
          </tr>
        </thead>
        <tbody>
          {challengeEditions.map((e) => (
            <tr key={e.term}>
              <td className="tabular-nums text-tinta-600">{e.term}</td>
              <td className="text-tinta-800">{localize(e.with, lang)}</td>
              <td className="text-tinta-900">{localize(e.challenges, lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="md:hidden mt-3 border-t-2 border-tinta-900">
        {challengeEditions.map((e) => (
          <li key={e.term} className="py-4 border-b-2 border-papel-300">
            <p className="a-meta">{e.term} · {localize(e.with, lang)}</p>
            <p className="mt-1 a-s text-tinta-900">{localize(e.challenges, lang)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** Biotecnología Industrial: la proporción de posgrado de cada grupo, con su evaluación, del grupo
 *  con más posgrado al que menos tuvo. La marca vertical es la mitad. */
const ComposicionBiotec: React.FC = () => {
  const { t, lang } = useI18n();
  const [activo, setActivo] = useState<string | null>(null);
  const filas = [...biotechCohorts]
    .map((c) => ({ ...c, share: c.graduate / (c.graduate + c.undergraduate) }))
    .sort((a, b) => b.share - a.share);
  const pct = (x: number) => `${Math.round(x * 100)} %`;
  return (
    <figure className="mt-8 max-w-[640px]">
      <div className="flex flex-wrap gap-x-6 gap-y-1 a-s text-tinta-800" aria-hidden="true">
        <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 bg-tinta-800" />{t('tch.co.biotec.graduate')}</span>
        <span className="flex items-center gap-2"><span className="inline-block w-4 h-4 bg-papel-400" />{t('tch.co.biotec.under')}</span>
        <span className="ml-auto">{t('tch.co.biotec.eval')}</span>
      </div>
      <ul className="mt-3 space-y-2">
        {filas.map((c) => {
          const on = activo === c.term;
          return (
            <li
              key={c.term}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)_2.5rem] items-center gap-3 cursor-default"
              onMouseEnter={() => setActivo(c.term)}
              onMouseLeave={() => setActivo(null)}
              aria-label={fill(t('tch.co.biotec.row'), { term: c.term, share: pct(c.share), score: c.evaluation })}
            >
              <span className="a-meta" aria-hidden="true">{c.term}</span>
              <span className="relative flex h-7" aria-hidden="true">
                <span className={`flex items-center pl-2 a-s ${on ? 'bg-resaltador text-tinta-900' : 'bg-tinta-800 text-papel-0'}`} style={{ width: `calc(${c.share * 100}% - 1px)` }}>
                  {pct(c.share)}
                </span>
                <span className="ml-[2px] flex-1 bg-papel-400" />
                <span className="absolute top-[-4px] bottom-[-4px] w-[2px] bg-tinta-900" style={{ left: 'calc(50% - 1px)' }} />
              </span>
              <span className="text-right font-semibold tabular-nums text-tinta-900" aria-hidden="true">{c.evaluation}</span>
            </li>
          );
        })}
      </ul>
      <figcaption className="a-pie">{t('tch.co.biotec.caption')}</figcaption>
      <span className="sr-only">{lang === 'es' ? 'La marca vertical es la mitad.' : 'The vertical mark is half.'}</span>
    </figure>
  );
};

const Figura: React.FC<{ foto: Foto; pie: string; lang: Lang; forma?: string }> = ({ foto, pie, lang, forma = 'aspect-[4/3]' }) => (
  <figure>
    <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className={`a-bn w-full object-cover ${forma}`} />
    <figcaption className="a-pie">{pie}</figcaption>
  </figure>
);

export const CoursesPage: React.FC = () => {
  const { t, lang } = useI18n();
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
  const puntaje = (v: number) => (Number.isInteger(v) ? String(v) : num(v, lang, 1));

  const filtrados = useMemo(() => {
    if (activeFilter === 'All') return ordenados;
    return ordenados.filter((c) =>
      activeFilter === 'Undergraduate' || activeFilter === 'Graduate' ? c.level === activeFilter : c.type === activeFilter,
    );
  }, [activeFilter]);
  const estudiantes = filtrados.reduce((s, c) => s + (c.students || 0), 0);

  const tipo = (c: TaughtCourse) =>
    [t(typeKey[c.type]), c.level ? t(levelKey[c.level]) : null].filter(Boolean).join(' · ');

  // Lo que va junto a cada curso: la tabla de ediciones y la composición de Biotecnología.
  const extra: Record<string, React.ReactNode> = {
    challenge: <Ediciones />,
    biotec: (
      <>
        <p className="detalle">{t('tch.co.biotec.p')}</p>
        <ComposicionBiotec />
      </>
    ),
  };

  // Fotos del margen de cada tema.
  const fotosTema: Partial<Record<CourseTheme, React.ReactNode>> = {
    process: <Figura foto={fotos.reto2019} pie={t('tch.co.photo.reto')} lang={lang} />,
    bio: (
      <div className="grid grid-cols-2 gap-4">
        <img src={fotos.cervezaProteinas.src} alt={localize(fotos.cervezaProteinas.alt, lang)} loading="lazy" className="a-bn w-full aspect-[3/4] object-cover" />
        <img src={fotos.cervezaGlucanos.src} alt={localize(fotos.cervezaGlucanos.alt, lang)} loading="lazy" className="a-bn w-full aspect-[3/4] object-cover" />
        <p className="col-span-2 a-pie !mt-0">{t('tch.co.photo.beer')}</p>
      </div>
    ),
    ai: <Figura foto={fotos.grabacionMooc} pie={t('tch.co.photo.mooc')} lang={lang} />,
  };

  // La serie global de evaluación, con sus tres etapas.
  const terms = globalEvaluation.map((g) => g.term);
  const ix = (term: string) => terms.indexOf(term);
  const bandas = [
    { from: 0, to: ix('2021-10'), label: t('tch.co.eval.stage1') },
    { from: ix('2021-20'), to: ix('2024-10'), label: t('tch.co.eval.stage2') },
    { from: ix('2024-20'), to: ix('2025-20'), label: t('tch.co.eval.stage3') },
  ];

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('tch.co.title')}
        entrada={
          <p>
            {fill(t('tch.co.lead'), {
              year: teaching.firstYear,
              sections: teaching.sections,
              students: miles(teaching.universityStudents),
              created: cardinal(teaching.createdCourses, lang),
              redesigned: cardinal(teaching.redesignedCourses, lang),
            })}
          </p>
        }
        accion={{ label: t('tch.co.cta'), onClick: () => document.getElementById('secciones')?.scrollIntoView({ behavior: 'smooth' }) }}
        foto={{ src: fotos.cursoGrupo.src, alt: localize(fotos.cursoGrupo.alt, lang), posicion: '60% 55%' }}
      />

      {/* ── Los quince cursos, por tema ── */}
      {TEMAS.map(({ tema, titulo, fondo }) => {
        const cursos = courseCatalog.filter((c) => c.theme === tema);
        return (
          <section key={tema} className={`${fondo} a-campo`}>
            <div className="a-c">
              <Sube><Cabecera titulo={t(titulo)} /></Sube>
              <div className={`mt-12 grid gap-x-16 gap-y-12 ${fotosTema[tema] ? 'lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]' : ''}`}>
                <div>
                  {tema === 'process' && (
                    <Sube className="mb-12">
                      <p className="a-texto text-tinta-900">{t('tch.co.process.intro')}</p>
                      <Link to="/teaching/unit-ops" className="a-enlace inline-block mt-4">{t('tch.co.process.cta')} <span aria-hidden="true">→</span></Link>
                      <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 a-s text-tinta-800">
                        <span className="flex items-center gap-2"><span className="block w-[10px] h-[10px] bg-tinta-600" aria-hidden="true" />{t('tch.strip.taught')}</span>
                        <span className="flex items-center gap-2"><span className="block w-[10px] h-[10px] bg-tinta-900 rotate-45 scale-90" aria-hidden="true" />{t('tch.strip.since')}</span>
                      </div>
                    </Sube>
                  )}
                  <ol className="a-registro">
                    {cursos.map((c, i) => (
                      <Curso key={c.id} curso={c} delay={0.03 * (i % 4)}>{extra[c.id]}</Curso>
                    ))}
                  </ol>
                </div>
                {fotosTema[tema] && <Sube delay={0.08} className="lg:sticky lg:top-28 lg:self-start">{fotosTema[tema]}</Sube>}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Cada sección ── */}
      <section id="secciones" className="a-papel a-campo scroll-mt-16">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.co.all.title')} /></Sube>
          <Sube delay={0.04}><p className="mt-8 a-texto">{fill(t('tch.co.all.text'), { year: teaching.firstYear })}</p></Sube>
          <div className="a-filtros mt-8" role="group" aria-label={t('courses.col.type')}>
            {filterOptions.map((f) => (
              <button key={f} type="button" onClick={() => setActiveFilter(f)} aria-pressed={activeFilter === f}>
                {t(filterLabelKey[f])}
              </button>
            ))}
          </div>
          <p className="a-meta mt-6 mb-6" aria-live="polite">
            {fill(t('tch.co.count'), { n: filtrados.length, students: miles(estudiantes) })}
          </p>

          {/* Escritorio y tableta: la tabla de verdad */}
          <table className="a-tabla hidden md:table">
            <thead>
              <tr>
                <th scope="col" className="w-[7rem]">{t('courses.col.term')}</th>
                <th scope="col">{t('courses.col.course')}</th>
                <th scope="col" className="w-[13rem]">{t('courses.col.type')}</th>
                <th scope="col" className="num w-[7rem]">{t('courses.col.students')}</th>
                <th scope="col" className="num w-[7rem]">{t('courses.col.evaluation')}</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c, i) => (
                <motion.tr
                  key={`${activeFilter}-${c.term}-${c.code}-${i}`}
                  className="transition-colors hover:bg-papel-100"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -5% 0px' }}
                  transition={{ duration: 0.45, ease: SALE }}
                >
                  <td className="tabular-nums text-tinta-600">{c.term}</td>
                  <td>
                    <span className="block text-[18px] leading-snug font-semibold text-tinta-900">{localize(c.title, lang)}</span>
                    <span className="block text-tinta-600">{c.code}</span>
                  </td>
                  <td className="text-tinta-800">{tipo(c)}</td>
                  <td className="num text-tinta-800">{c.students}</td>
                  <td className="num text-[18px] font-semibold text-tinta-900">
                    {c.evaluation !== null ? puntaje(c.evaluation) : <span aria-label={t('courses.row.noEval')} className="text-tinta-600">—</span>}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Teléfono: cada sección apilada, sin desplazamiento lateral */}
          <ul className="md:hidden border-t-2 border-tinta-900">
            {filtrados.map((c, i) => (
              <Sube as="li" key={`${activeFilter}-${c.term}-${c.code}-${i}`} className="py-5 border-b-2 border-papel-300">
                <p className="a-meta">{c.term} · {c.code}</p>
                <p className="mt-1 text-[18px] leading-snug font-semibold text-tinta-900">{localize(c.title, lang)}</p>
                <p className="a-s mt-1 text-tinta-800">
                  {tipo(c)} · {fill(t('courses.row.students'), { n: c.students })}
                </p>
                <p className="a-s text-tinta-800">
                  {c.evaluation !== null ? fill(t('courses.row.evaluation'), { score: puntaje(c.evaluation) }) : t('courses.row.noEval')}
                </p>
              </Sube>
            ))}
          </ul>

          <p className="mt-10 a-texto">{t('tch.co.evalNote')}</p>
        </div>
      </section>

      {/* ── La evaluación docente ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.co.eval.title')} /></Sube>
          <div className="mt-10 grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <Sube><p className="a-texto">{t('tch.co.eval.p1')}</p></Sube>
            <Sube delay={0.05}><p className="a-texto text-tinta-900">{t('tch.co.eval.p2')}</p></Sube>
          </div>
          <Sube delay={0.08} className="mt-14">
            <SemesterSeriesChart
              terms={terms}
              values={globalEvaluation.map((g) => g.score)}
              min={140}
              max={162}
              ticks={[145, 150, 155, 160]}
              bands={bandas}
              label={fill(t('tch.co.eval.chart'), { first: terms[0], last: terms[terms.length - 1] })}
              gapNote={() => t('tch.co.eval.none')}
              describe={(i) => (
                <>
                  <span className="font-semibold tabular-nums">{terms[i]}</span>
                  {' · '}
                  {globalEvaluation[i].score === null
                    ? t('tch.co.eval.none')
                    : <span className="font-semibold tabular-nums">{globalEvaluation[i].score}</span>}
                  <span className="block sm:inline a-s text-tinta-600 sm:ml-3">{t('tch.co.eval.touch')}</span>
                </>
              )}
            />
            <p className="a-pie">{t('tch.co.eval.caption')}</p>
          </Sube>

          <Sube className="mt-20"><h3 className="a-h3 mb-8">{t('tch.co.lessons')}.</h3></Sube>
          <ol className="a-registro">
            {evaluationLessons.map((l, i) => (
              <Sube as="li" key={`${localize(l.terms, lang)}-${i}`} delay={0.04 * i}>
                <span className="cuando">{localize(l.terms, lang)}</span>
                <div>
                  <p className="que">{localize(l.course, lang)}</p>
                  <p className="donde">{fill(t('tch.co.lesson.score'), { scores: l.scores })}</p>
                  <p className="detalle">{localize(l.happened, lang)}</p>
                  <p className="detalle text-tinta-900">{localize(l.did, lang)}</p>
                </div>
              </Sube>
            ))}
          </ol>
        </div>
      </section>
    </PageWrapper>
  );
};
