import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { StatsSection } from '../../components/StatsSection';
import { Sube } from '../../components/Sube';
import { Apertura, Cabecera } from '../../components/Apertura';
import { useI18n, fill, localize, cardinal } from '../../context/i18n';
import { teachingData, testimonials, courseCatalog, type Testimonial } from '../../components/data/teaching';
import { educationPapers, sotlProducts } from '../../components/data/educationResearch';
import { trainingCourses } from '../../components/data/edco';
import { professionalDevelopmentData } from '../../components/data/professionalDevelopment';
import { metrics, flagshipAward, graduateByName } from '../../components/data/metrics';
import { pou202620Course } from '../../components/data/classroom/pou-2026-20';
import { useAppData } from '../../context/AppDataContext';
import { CoursesOverTimeChart } from '../../components/CoursesOverTimeChart';
import { fotos } from '../../components/data/fotos';

const { teaching } = metrics;
const teachingAward = flagshipAward('teaching');

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
  { name: 'Carlos Manuel Ramírez Acosta', category: 'Teaching & Mentorship' },
  { name: 'Julian Daniel Torres Vanegas', category: 'Teaching & Mentorship' },
];
const voces = VOCES.map((v) => testimonials.find((x) => x.name === v.name && x.category === v.category)).filter(
  (x): x is Testimonial => Boolean(x),
);
const personas = new Set(testimonials.map((x) => x.name)).size;

// El Laboratorio de Pandora: estudiantes y semestres, del registro de cursos.
const pandora = teachingData.filter((c) => c.code === 'CBP-C1320');
const pandoraEstudiantes = pandora.reduce((s, c) => s + c.students, 0);

// Los simuladores del aula de Proyecto de Operaciones Unitarias (el manual de diagramas va aparte).
const simuladores = (pou202620Course.simulations ?? []).filter((s) => s.id !== 'manual-diagramas').length;

const primerAnoFormacion = Math.min(...trainingCourses.map((c) => c.year));
const primerAnoDesarrollo = Math.min(...professionalDevelopmentData.map((a) => Number(a.period.slice(0, 4))));

export const TeachingOverviewPage: React.FC = () => {
  const { t, lang } = useI18n();
  const { products } = useAppData();
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
  const { talks } = sotlProducts(products);

  const stats = [
    {
      label: fill(t('tch.ov.fig.students'), { year: teaching.firstYear }),
      value: teaching.universityStudents,
      note: fill(t('tch.ov.fig.students.note'), { n: teaching.sections }),
    },
    {
      label: t('tch.ov.fig.courses'),
      value: courseCatalog.length,
      note: fill(t('tch.ov.fig.courses.note'), { created: teaching.createdCourses, redesigned: teaching.redesignedCourses }),
    },
    {
      label: t('tch.ov.fig.papers'),
      value: educationPapers.length,
      note: talks.length ? fill(t('tch.ov.fig.papers.note'), { n: talks.length }) : undefined,
    },
    {
      label: t('tch.ov.fig.pandora'),
      value: pandoraEstudiantes,
      note: fill(t('tch.ov.fig.pandora.note'), { n: cardinal(pandora.length, lang) }),
    },
    {
      label: t('tch.ov.fig.sims'),
      value: simuladores,
      note: fill(t('tch.ov.fig.sims.note'), { term: pou202620Course.term }),
    },
    ...(teachingAward
      ? [{ label: t('tch.ov.fig.aiche'), value: t('tch.ov.fig.first'), note: t('tch.ov.fig.aiche.note') }]
      : []),
  ];

  const filas = [
    { to: '/teaching/purpose', titulo: t('tch.more.philosophy.t'), texto: t('tch.more.philosophy') },
    { to: '/teaching/courses', titulo: t('tch.more.courses.t'), texto: fill(t('tch.more.courses'), { n: courseCatalog.length, year: teaching.firstYear }) },
    { to: '/teaching/strategies', titulo: t('tch.more.strategies.t'), texto: t('tch.more.strategies') },
    { to: '/teaching/unit-ops', titulo: t('tch.more.unitops.t'), texto: fill(t('tch.more.unitops'), { year: teachingAward?.year ?? 2026 }) },
    {
      to: '/teaching/scholarship',
      titulo: t('tch.more.sotl.t'),
      texto: (() => {
        const papers = cardinal(educationPapers.length, lang);
        const texto = talks.length
          ? fill(t('tch.more.sotl'), { papers, talks: cardinal(talks.length, lang) })
          : fill(t('tch.more.sotl.short'), { papers });
        return texto.charAt(0).toUpperCase() + texto.slice(1);
      })(),
    },
    { to: '/teaching/testimonials', titulo: t('tch.more.testimonials.t'), texto: fill(t('tch.more.testimonials'), { quotes: testimonials.length, people: personas }) },
    { to: '/teaching/continuing-education', titulo: t('training.title'), texto: fill(t('tch.more.training'), { n: trainingCourses.length, year: primerAnoFormacion }) },
    { to: '/teaching/professional-development', titulo: t('profdev.title'), texto: fill(t('teaching.more.profdev'), { n: professionalDevelopmentData.length, year: primerAnoDesarrollo }) },
  ];

  const enClase = [
    { foto: fotos.equiposTapabocas, pie: t('tch.ov.class.dpro') },
    { foto: fotos.reto2019, pie: t('tch.ov.class.reto') },
  ];

  return (
    <PageWrapper noPadding>
      <Apertura
        palabra={t('nav.teaching').toLowerCase()}
        entrada={t('tch.ov.lead')}
        foto={{ src: fotos.cursoGrupo.src, alt: localize(fotos.cursoGrupo.alt, lang), posicion: '60% 60%' }}
        accion={{ to: '/teaching/purpose', label: t('tch.ov.cta') }}
      />

      {/* ── Lo que enseño, en cifras ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.ov.what.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-10 a-texto text-tinta-900">
              {fill(t('tch.ov.what.a'), { year: teaching.firstYear, sections: teaching.sections, students: miles(teaching.universityStudents) })}{' '}
              <span className="a-resaltado">
                {fill(t('tch.ov.what.b'), { created: cardinal(teaching.createdCourses, lang), redesigned: cardinal(teaching.redesignedCourses, lang) })}
              </span>{' '}
              {t('tch.ov.what.c')}
            </p>
          </Sube>
          {/* Más aire entre filas de cifras: la nota de una cifra no debe leerse como rótulo de la de abajo. */}
          <Sube delay={0.1} className="mt-16 sm:mt-20 [&_.a-cifras]:!gap-y-[88px]">
            <StatsSection stats={stats} isLoading={false} />
          </Sube>
        </div>
      </section>

      {/* ── En el aula ── */}
      <section className="a-portada a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.ov.class.title')} /></Sube>
          <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <Sube as="div" className="md:row-span-2">
              <figure>
                <div className="overflow-hidden aspect-[4/3]">
                  <img src={fotos.cervezaGlucanos.src} alt={localize(fotos.cervezaGlucanos.alt, lang)} loading="lazy" className="a-foto a-bn" />
                </div>
                <figcaption className="a-pie">{t('tch.ov.class.beer')}</figcaption>
              </figure>
            </Sube>
            {enClase.map(({ foto, pie }, i) => (
              <Sube key={foto.src} delay={0.08 * (i + 1)}>
                <figure>
                  <div className="overflow-hidden aspect-[16/10]">
                    <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className="a-foto a-bn" />
                  </div>
                  <figcaption className="a-pie">{pie}</figcaption>
                </figure>
              </Sube>
            ))}
          </div>
        </div>
      </section>

      {/* ── Las voces: cuatro egresados con su foto ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.ov.voices.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-8 a-texto">{t('tch.ov.voices.text')}</p>
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
              {t('tch.ov.voices.cta')} <span aria-hidden="true">→</span>
            </Link>
          </Sube>
        </div>
      </section>

      {/* ── Estudiantes por año ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.ov.chart.title')} className="mb-10" /></Sube>
          <Sube delay={0.06}>
            <CoursesOverTimeChart courses={teachingData} />
            <p className="a-pie">{t('tch.ov.chart.caption')}</p>
          </Sube>
        </div>
      </section>

      {/* ── Las páginas del capítulo ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-titulo mb-10">{t('tch.ov.more.title')}.</h2></Sube>
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
