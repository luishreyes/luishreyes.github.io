import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, fill, localize, type UIKey } from '../../context/i18n';
import { teachingData, testimonials, COURSE, type Testimonial } from '../../components/data/teaching';
import { educationPapers } from '../../components/data/educationResearch';
import { flagshipAward, graduateByName } from '../../components/data/metrics';
import { pou202620Course } from '../../components/data/classroom/pou-2026-20';
import { SemesterSeriesChart } from '../../components/CoursesOverTimeChart';
import { Resaltar } from '../purpose/TeachingPurposePage';
import { fotos } from '../../components/data/fotos';

// Tres cursos para un mismo propósito: Operaciones Unitarias (IQUI-3010), Proyecto Integrado 2
// (IQUI-2032, después IQYA-2032) y Proyecto de Operaciones Unitarias (IQYA-2031). El gráfico y
// las cifras salen del registro de cursos, así que un semestre nuevo aparece en cuanto se anota.
const UNIT_OPS_CODES = ['IQUI-3010', 'IQUI-2032', 'IQYA-2032', 'IQYA-2031'];
const runs = teachingData.filter((c) => UNIT_OPS_CODES.includes(c.code)).sort((a, b) => a.term.localeCompare(b.term));

// El eje: todos los semestres entre el primero y el último dictados, con los huecos.
const TERMS = (() => {
  const out: string[] = [];
  const [a0, s0] = runs[0].term.split('-').map(Number);
  const [a1, s1] = runs[runs.length - 1].term.split('-').map(Number);
  for (let a = a0, s = s0; a < a1 || (a === a1 && s <= s1); s === 10 ? (s = 20) : ((s = 10), a++)) out.push(`${a}-${s}`);
  return out;
})();
const runAt = TERMS.map((term) => runs.find((r) => r.term === term));
const ix = (term: string) => TERMS.indexOf(term);

const award = flagshipAward('teaching');
const studyPaper = educationPapers.find((p) => p.year === 2025) ?? educationPapers[educationPapers.length - 1];
const unitOpsPapers = educationPapers.filter((p) => p.course === 'unitops');

// Cuatro simuladores del aula del curso, con su nombre en los dos idiomas.
const SIMULADORES: Record<string, UIKey> = {
  'explorador-bombas-centrifugas': 'tch.sim.explorador-bombas-centrifugas',
  'explorador-intercambiadores': 'tch.sim.explorador-intercambiadores',
  'explorador-mccabe-thiele': 'tch.sim.explorador-mccabe-thiele',
  'explorador-filtracion': 'tch.sim.explorador-filtracion',
};
const simuladores = (pou202620Course.simulations ?? []).filter((s) => s.id in SIMULADORES);
const nSimuladores = (pou202620Course.simulations ?? []).filter((s) => s.id !== 'manual-diagramas').length;

// Dos estudiantes que tomaron el curso y lo cuentan en su testimonio.
const VOCES = ['Olga Lucía Acuña', 'Juanita Sierra'];
const voces = VOCES.map((name) => testimonials.find((x) => x.name === name && x.category === 'Teaching & Mentorship')).filter(
  (x): x is Testimonial => Boolean(x),
);

export const UnitOperationsInnovationPage: React.FC = () => {
  const { t, lang } = useI18n();

  const bandas = [
    { from: 0, to: ix('2019-20'), label: t('tch.uo.band.ou1') },
    { from: ix('2020-10'), to: ix('2021-10'), label: t('tch.uo.band.ou2') },
    { from: ix('2021-20'), to: ix('2023-20'), label: t('tch.uo.band.pi2') },
    { from: ix('2024-10'), to: TERMS.length - 1, label: t('tch.uo.band.pou') },
  ];
  const hitos = [
    // Las filas evitan que la línea de un hito cruce el rótulo de otro.
    { at: ix('2019-10'), label: t('tch.uo.ev.p2019'), row: 0 },
    { at: ix('2020-20'), label: t('tch.uo.ev.p2021'), row: 1 },
    { at: ix('2023-20'), label: t('tch.uo.ev.aias'), row: 0 },
    { at: ix('2025-10'), label: t('tch.uo.ev.p2025'), row: 2 },
    { at: ix('2025-20'), label: t('tch.uo.ev.redesign'), row: 1 },
    ...(award ? [{ at: TERMS.length - 1, label: t('tch.uo.ev.award'), row: 0 }] : []),
  ].filter((h) => h.at >= 0);

  const cursos: { when: UIKey; title: string; code: string; parrafos: React.ReactNode[] }[] = [
    {
      when: 'tch.uo.ou.when', title: localize(COURSE.ou, lang), code: 'IQUI-3010',
      parrafos: [t('tch.uo.ou.p1'), t('tch.uo.ou.p2'), t('tch.uo.ou.p3'), t('tch.uo.ou.p4')],
    },
    {
      when: 'tch.uo.pi2.when', title: localize(COURSE.pi2, lang), code: 'IQUI-2032 · IQYA-2032',
      parrafos: [t('tch.uo.pi2.p1'), t('tch.uo.pi2.p2')],
    },
    {
      when: 'tch.uo.pou.when', title: localize(COURSE.pou, lang), code: 'IQYA-2031',
      parrafos: [
        t('tch.uo.pou.p1'),
        <Resaltar key="p2" texto={t('tch.uo.pou.p2')} frase={t('tch.uo.pou.mark')} />,
        t('tch.uo.pou.p3'),
      ],
    },
  ];

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('tch.uo.title')}
        entrada={<p>{t('tch.uo.lead')}</p>}
        accion={{ href: `https://doi.org/${studyPaper.doi}`, label: fill(t('tch.uo.cta'), { year: studyPaper.year }) }}
        foto={{ src: fotos.postersPou.src, alt: localize(fotos.postersPou.alt, lang) }}
      />

      {/* ── El reconocimiento ── */}
      {award && (
        <section className="a-oscuro a-campo">
          <div className="a-c grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <Sube><h2 className="a-titulo">{fill(t('tch.uo.award.heading'), { year: award.year })}.</h2></Sube>
              <Sube delay={0.06}>
                <p className="a-entrada mt-8 max-w-[40ch]">
                  {fill(t('tch.uo.award.name'), { awarder: localize(award.awarder, lang) })}
                </p>
              </Sube>
              <Sube delay={0.1}>
                <p className="mt-8 a-texto text-papel-100">{t('tch.uo.award.note')}</p>
                <p className="mt-4 a-texto text-papel-200">{t('tch.uo.award.citation')}</p>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link to="/recognition" className="a-boton">
                    {t('tch.uo.award.cta')} <span aria-hidden="true">→</span>
                  </Link>
                  <a href={award.url} target="_blank" rel="noopener noreferrer" className="a-enlace">
                    {t('tch.uo.award.aiche')} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </Sube>
            </div>
            <Sube delay={0.12} className="hidden lg:block">
              <img src="/images/aiche-logo.svg" alt="AIChE" className="w-full max-w-[320px] ml-auto invert opacity-90" />
            </Sube>
          </div>
        </section>
      )}

      {/* ── La evaluación de los tres cursos, a todo el ancho ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.uo.chart.title')} /></Sube>
          <Sube delay={0.04}><p className="mt-8 a-texto">{t('tch.uo.chart.text')}</p></Sube>
          <Sube delay={0.08} className="mt-10">
            <SemesterSeriesChart
              terms={TERMS}
              values={runAt.map((r) => r?.evaluation ?? null)}
              min={130}
              max={165}
              ticks={[135, 145, 155, 165]}
              bands={bandas}
              events={hitos}
              label={fill(t('tch.uo.chart.label'), { first: TERMS[0], last: TERMS[TERMS.length - 1] })}
              gapNote={(i) => (runAt[i] ? t('tch.uo.chart.none') : t('tch.uo.chart.notTaught'))}
              describe={(i) => {
                const r = runAt[i];
                return (
                  <>
                    <span className="font-semibold tabular-nums">{TERMS[i]}</span>
                    {' · '}
                    {r ? `${localize(r.title, lang)} (${r.code})` : t('tch.uo.chart.notTaught')}
                    {r && ' · '}
                    {r && (r.evaluation !== null ? <span className="font-semibold tabular-nums">{r.evaluation}</span> : t('tch.uo.chart.none'))}
                  </>
                );
              }}
            />
            <p className="a-pie max-w-[64ch]">{t('tch.uo.chart.caption')}</p>
          </Sube>
        </div>
      </section>

      {/* ── Los tres cursos ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.uo.three')} className="mb-12" /></Sube>
          <ol className="a-registro">
            {cursos.map((c, i) => (
              <Sube as="li" key={c.code} delay={0.05 * i}>
                <span className="cuando">{t(c.when)}</span>
                <div>
                  <h3 className="que">{c.title}</h3>
                  <p className="donde">{c.code}</p>
                  {c.parrafos.map((p, k) => (
                    <p key={k} className={`detalle ${k === 0 ? 'text-tinta-900' : ''}`}>{p}</p>
                  ))}
                </div>
              </Sube>
            ))}
          </ol>
        </div>
      </section>

      {/* ── El estudio de 2025 ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.uo.study.title')} /></Sube>
          <div className="mt-10 grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <Sube><p className="a-texto">{t('tch.uo.study.p1')}</p></Sube>
            <Sube delay={0.05}>
              <p className="a-texto">{t('tch.uo.study.p2')}</p>
              <Link to="/teaching/scholarship" className="a-enlace inline-block mt-4">{t('tch.uo.study.cta')} <span aria-hidden="true">→</span></Link>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── El curso hoy: los simuladores de su aula ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.uo.today.title')} /></Sube>
          <Sube delay={0.05}>
            <p className="mt-8 a-texto">
              {fill(t('tch.uo.today.text'), { term: pou202620Course.term, n: nSimuladores })}
            </p>
          </Sube>
          <div className="mt-12 grid gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)] lg:items-start">
            <Sube>
              <figure>
                <div className="overflow-hidden aspect-[3/4]">
                  <img src={fotos.pouNpsh.src} alt={localize(fotos.pouNpsh.alt, lang)} loading="lazy" className="a-foto a-bn" />
                </div>
                <figcaption className="a-pie">{t('tch.uo.today.photo')}</figcaption>
              </figure>
            </Sube>
            <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
              {simuladores.map((s, i) => (
                <Sube key={s.id} delay={0.06 * (i + 1)}>
                  <figure>
                    <div data-ui className="overflow-hidden bg-white aspect-[16/10]">
                      <img src={s.bannerImg} alt={t(SIMULADORES[s.id])} loading="lazy" className="block w-full h-full object-cover" />
                    </div>
                    <figcaption className="a-pie">{t(SIMULADORES[s.id])}</figcaption>
                  </figure>
                </Sube>
              ))}
            </div>
          </div>
          <Sube className="mt-10">
            <Link to="/teaching/strategies" className="a-enlace">{t('tch.uo.today.cta')} <span aria-hidden="true">→</span></Link>
          </Sube>
        </div>
      </section>

      {/* ── Dos estudiantes del curso ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.uo.voices')} /></Sube>
          <div className="mt-12 grid gap-16 lg:grid-cols-2">
            {voces.map((v, i) => {
              const graduado = v.graduateName ? graduateByName(v.graduateName) : undefined;
              return (
                <Sube key={v.name} delay={0.08 * i}>
                  <figure className="grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <img src={v.imageUrl} alt={fill(t('testimonials.photo'), { name: v.name })} loading="lazy" className="a-bn w-[180px] aspect-[4/5] object-cover object-top" />
                    <div>
                      <blockquote className="space-y-4 text-tinta-900">
                        {localize(v.quote, lang).split('\n\n').map((par, k, arr) => (
                          <p key={k}>{k === 0 ? '«' : ''}{par}{k === arr.length - 1 ? '»' : ''}</p>
                        ))}
                      </blockquote>
                      <figcaption className="mt-5">
                        <span className="block font-semibold text-tinta-900">{v.name}</span>
                        <span className="a-meta block">{localize(v.context, lang)}</span>
                        <span className="a-meta block">{localize(graduado?.currentPosition || v.info, lang)}</span>
                      </figcaption>
                    </div>
                  </figure>
                </Sube>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Los tres artículos ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('tch.uo.papers')} className="mb-12" /></Sube>
          <ol className="a-registro">
            {unitOpsPapers.map((paper, i) => (
              <Sube as="li" key={paper.doi} delay={0.05 * i}>
                <span className="cuando">{paper.year}</span>
                <div>
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="block text-[18px] leading-snug font-semibold text-tinta-900 underline decoration-1 underline-offset-[3px] hover:bg-resaltador-suave transition-colors">
                    {paper.title} <span aria-hidden="true">↗</span>
                  </a>
                  <p className="donde">{paper.authorsFull}</p>
                  <p className="donde mt-0"><em>{paper.journal}</em>, {paper.locator}. doi:{paper.doi}</p>
                </div>
              </Sube>
            ))}
          </ol>
          <Sube className="mt-10">
            <p className="a-texto">
              {t('tch.uo.papers.more')}{' '}
              <Link to="/teaching/scholarship" className="a-enlace">{t('tch.uo.papers.cta')} <span aria-hidden="true">→</span></Link>
            </p>
          </Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
