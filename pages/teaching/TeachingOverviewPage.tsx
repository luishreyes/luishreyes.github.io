import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { StatsSection } from '../../components/StatsSection';
import { Sube } from '../../components/Sube';
import { Apertura, Cabecera } from '../../components/Apertura';
import { useI18n, fill, localize, num, cardinal } from '../../context/i18n';
import { teachingData, testimonials, type TaughtCourse, type Testimonial } from '../../components/data/teaching';
import { edcoCoursesData } from '../../components/data/edco';
import { cycleTurns } from '../../components/data/educationResearch';
import { grantsData } from '../../components/data/grants';
import { professionalDevelopmentData } from '../../components/data/professionalDevelopment';
import { metrics, flagshipAward, graduateByName } from '../../components/data/metrics';
import { CoursesOverTimeChart } from '../../components/CoursesOverTimeChart';
import { fotos } from '../../components/data/fotos';

const { teaching } = metrics;
const teachingAward = flagshipAward('teaching');

/** El dossier marca con el resaltador la frase que manda: aquí, la primera del enfoque. */
const conResaltado = (texto: string) => {
  const corte = texto.indexOf('. ');
  if (corte < 0) return texto;
  return (
    <>
      <span className="a-resaltado">{texto.slice(0, corte + 1)}</span>
      {texto.slice(corte + 1)}
    </>
  );
};

/** Primera frase de un testimonio, con puntos suspensivos si sigue más texto. */
const primeraFrase = (texto: string) => {
  const m = texto.match(/^.+?(?<!\b[A-Z])[.!?](?=\s|$)/);
  const frase = m ? m[0] : texto;
  return frase.length < texto.trim().length ? `${frase} …` : frase;
};

// Cuatro voces de cursos distintos, en el orden en que se leen mejor.
const VOCES: { name: string; category: Testimonial['category'] }[] = [
  { name: 'Jason Bernal Sánchez', category: 'Teaching & Mentorship' },
  { name: 'Daniela Aristizabal', category: 'Teaching & Mentorship' },
  { name: 'Carlos Manuel Ramírez Acosta', category: 'Research Advising' },
  { name: 'Julian Daniel Torres Vanegas', category: 'Teaching & Mentorship' },
];
const voces = VOCES.map((v) => testimonials.find((x) => x.name === v.name && x.category === v.category)).filter(
  (x): x is Testimonial => Boolean(x),
);
const personas = new Set(testimonials.map((x) => x.name)).size;

// La serie de Operaciones Unitarias, para la fila que lleva a su caso.
const UNIT_OPS_CODES = ['IQUI-3010', 'IQUI-2032', 'IQYA-2032', 'IQYA-2031'];
const serie = teachingData
  .filter((c) => UNIT_OPS_CODES.includes(c.code) && c.evaluation !== null)
  .sort((a, b) => a.term.localeCompare(b.term));
const iMin = serie.reduce((lo, c, i) => ((c.evaluation as number) < (serie[lo].evaluation as number) ? i : lo), 0);
const minimo = serie[iMin].evaluation as number;
const recuperado = Math.max(...serie.slice(iMin).map((c) => c.evaluation as number));

const primerAnoEdco = Math.min(...edcoCoursesData.map((c) => c.year));
const primerAnoDesarrollo = Math.min(...professionalDevelopmentData.map((a) => Number(a.period.slice(0, 4))));

// Los cursos de educación continua entran al gráfico con su tipo.
const cursosEdco: TaughtCourse[] = edcoCoursesData.map((course) => ({
  term: `${course.year}-EDCO`,
  year: course.year,
  code: 'EDCO',
  title: course.title,
  students: course.attendees,
  type: course.type === 'Corporate Course' ? 'Corporate' : course.client === 'Coursera (MOOC)' ? 'Coursera' : 'EDCO',
  evaluation: null,
  level: null,
}));
const todosLosCursos = [...teachingData, ...cursosEdco];

export const TeachingOverviewPage: React.FC = () => {
  const { t, lang } = useI18n();
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');

  const stats = [
    { label: t('teaching.stat.courses'), value: teaching.courses },
    { label: t('teaching.stat.uniStudents'), value: teaching.universityStudents, note: fill(t('teaching.stat.uniStudents.note'), { firstYear: teaching.firstYear }) },
    { label: t('teaching.stat.contEd'), value: teaching.continuingEdParticipants },
    { label: t('teaching.stat.mooc'), value: teaching.moocEnrolments, note: fill(t('teaching.stat.mooc.note'), { n: miles(teaching.moocCompletions) }) },
    ...(teaching.averageEvaluation !== null
      ? [{ label: t('teaching.stat.evaluation'), value: num(teaching.averageEvaluation, lang, 1), note: fill(t('teaching.stat.evaluation.note'), { n: teaching.evaluatedRuns }) }]
      : []),
    { label: t('teaching.stat.unique'), value: teaching.uniqueCourseTitles },
    ...(teachingAward
      ? [{ label: `${localize(teachingAward.title, lang)}, ${localize(teachingAward.awarder, lang)}`, value: String(teachingAward.year), note: t('teaching.stat.award.note') }]
      : []),
    { label: t('teaching.stat.eduGrants'), value: teaching.educationGrants },
  ];

  const mayuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const filas = [
    { to: '/teaching/courses', titulo: t('courses.title'), texto: fill(t('teaching.more.courses'), { runs: teaching.universityCourses, firstYear: teaching.firstYear }) },
    { to: '/teaching/unit-ops', titulo: t('unitops.nav'), texto: fill(t('teaching.more.unitops'), { low: minimo, peak: recuperado }) },
    { to: '/teaching/scholarship', titulo: t('sotl.title'), texto: mayuscula(fill(t('teaching.more.sotl'), { papers: cardinal(cycleTurns.length, lang), grants: cardinal(grantsData.filter((g) => g.area === 'education').length, lang) })) },
    { to: '/teaching/continuing-education', titulo: t('contEd.title'), texto: fill(t('teaching.more.contEd'), { n: edcoCoursesData.length, year: primerAnoEdco }) },
    { to: '/teaching/testimonials', titulo: t('testimonials.title'), texto: fill(t('teaching.more.testimonials'), { quotes: testimonials.length, people: personas }) },
    { to: '/teaching/professional-development', titulo: t('profdev.title'), texto: fill(t('teaching.more.profdev'), { n: professionalDevelopmentData.length, year: primerAnoDesarrollo }) },
  ];

  return (
    <PageWrapper noPadding>
      <Apertura
        palabra={t('nav.teaching').toLowerCase()}
        entrada={t('teaching.overview.subtitle')}
        foto={{ src: fotos.cursoGrupo.src, alt: localize(fotos.cursoGrupo.alt, lang), posicion: '60% 60%' }}
        accion={{ to: '/teaching/unit-ops', label: t('teaching.overview.cta') }}
      />

      {/* ── Enfoque y cifras ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('teaching.overview.approach.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-10 a-texto">{conResaltado(t('teaching.overview.approach.text'))}</p>
          </Sube>
          {/* Más aire entre filas de cifras: la nota de una cifra no debe leerse como rótulo de la de abajo. */}
          <Sube delay={0.1} className="mt-16 sm:mt-20 [&_.a-cifras]:!gap-y-[88px]">
            <StatsSection stats={stats} isLoading={false} />
          </Sube>
        </div>
      </section>

      {/* ── En clase: tres cursos en marcha ── */}
      <section className="a-portada a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('teaching.overview.class.title')} /></Sube>
          <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Sube as="div" className="md:row-span-2">
              <figure>
                <div className="overflow-hidden aspect-[4/3]">
                  <img src={fotos.cervezaGlucanos.src} alt={localize(fotos.cervezaGlucanos.alt, lang)} loading="lazy" className="a-foto" />
                </div>
                <figcaption className="a-pie">{localize(fotos.cervezaGlucanos.alt, lang)}</figcaption>
              </figure>
            </Sube>
            {[fotos.equiposTapabocas, fotos.reto2019].map((f, i) => (
              <Sube key={f.src} delay={0.08 * (i + 1)}>
                <figure>
                  <div className="overflow-hidden aspect-[16/10]">
                    <img src={f.src} alt={localize(f.alt, lang)} loading="lazy" className="a-foto" />
                  </div>
                  <figcaption className="a-pie">{localize(f.alt, lang)}</figcaption>
                </figure>
              </Sube>
            ))}
          </div>
        </div>
      </section>

      {/* ── Las voces: cuatro estudiantes con su foto ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('teaching.overview.voices.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-8 a-texto">{fill(t('teaching.overview.voices.text'), { people: personas })}</p>
          </Sube>
          <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {voces.map((v, i) => {
              const graduado = v.graduateName ? graduateByName(v.graduateName) : undefined;
              return (
                <Sube as="li" key={v.name} delay={0.06 * i}>
                  <img src={v.imageUrl} alt={v.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                  <p className="mt-4 text-[15px] sm:text-[18px] text-tinta-900">{primeraFrase(localize(v.quote, lang))}</p>
                  <p className="mt-3 font-semibold leading-tight text-tinta-900">{v.name}</p>
                  <p className="a-meta mt-1">{localize(v.context, lang)}</p>
                  <p className="a-meta">{localize(graduado?.currentPosition || v.info, lang)}</p>
                </Sube>
              );
            })}
          </ul>
          <Sube className="mt-12">
            <Link to="/teaching/testimonials" className="a-enlace">
              {t('teaching.overview.voices.cta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
      </section>

      {/* ── Cursos en el tiempo ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('teaching.overview.chart.title')} className="mb-10" /></Sube>
          <Sube delay={0.06}>
            <CoursesOverTimeChart courses={todosLosCursos} />
            <p className="a-pie">{t('teaching.overview.chart.caption')}</p>
          </Sube>
        </div>
      </section>

      {/* ── El resto de la docencia ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-titulo mb-10">{t('teaching.overview.more.title')}.</h2></Sube>
          <ul className="a-filas">
            {filas.map((f, i) => (
              <Sube as="li" key={f.to} delay={0.05 * i}>
                <Link to={f.to} className="a-fila">
                  <span className="q">{f.titulo}</span>
                  <span className="d">{f.texto}</span>
                  <span className="ir" aria-hidden="true">→</span>
                </Link>
              </Sube>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
