import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, fill, localize, type UIKey } from '../../context/i18n';
import { teachingData, testimonials, type Testimonial } from '../../components/data/teaching';
import { educationPapers } from '../../components/data/educationResearch';
import { flagshipAward, graduateByName } from '../../components/data/metrics';
import { pou202620Course } from '../../components/data/classroom/pou-2026-20';
import { fotos } from '../../components/data/fotos';

// The Unit Operations course keeps its identity across renamings and code
// changes: Unit Operations (IQUI-3010) became Integrated Project 2 under the
// 2021 curriculum reform, then Unit Operations Project. Everything on this
// page — the chart and the figures quoted in the prose — is derived from the
// teaching record, so a new term shows up here as soon as it is logged there.
const UNIT_OPS_CODES = ['IQUI-3010', 'IQUI-2032', 'IQYA-2032', 'IQYA-2031'];
// Pandora's Laboratory ran unchanged over the same period and serves as the
// reference benchmark.
const BENCHMARK_CODE = 'CBP-C1320';

interface ScorePoint {
  term: string;
  score: number;
  code: string;
  title: { en: string; es: string } | string;
}

const evaluationScores: ScorePoint[] = teachingData
  .filter((c) => UNIT_OPS_CODES.includes(c.code) && c.evaluation !== null)
  .sort((a, b) => a.term.localeCompare(b.term))
  .map((c) => ({ term: c.term.slice(2), score: c.evaluation as number, code: c.code, title: c.title }));

const benchmarkRuns = teachingData.filter((c) => c.code === BENCHMARK_CODE && c.evaluation !== null);
const benchmark = benchmarkRuns.reduce((sum, c) => sum + (c.evaluation as number), 0) / benchmarkRuns.length;

const termIndex = (term: string) => evaluationScores.findIndex((d) => d.term === term);
const REFORM_START = termIndex('21-20');    // course becomes Integrated Project 2
const SYNTHESIS_START = termIndex('24-10'); // course becomes Unit Operations Project

// Figures quoted in the narrative, derived so the prose cannot drift from the chart.
const traditionalRuns = evaluationScores.slice(0, REFORM_START);
const traditionalAvg = traditionalRuns.reduce((sum, d) => sum + d.score, 0) / traditionalRuns.length;

const lowestIndex = evaluationScores.reduce((lo, d, i) => (d.score < evaluationScores[lo].score ? i : lo), 0);
const lowest = evaluationScores[lowestIndex];

const peakIndex = evaluationScores.reduce(
  (hi, d, i) => (i > lowestIndex && d.score > evaluationScores[hi].score ? i : hi),
  lowestIndex,
);
const peak = evaluationScores[peakIndex];
const recoverySemesters = peakIndex - lowestIndex + 1;

const latest = evaluationScores[evaluationScores.length - 1];

const fullTerm = (term: string) => `20${term}`;
const award = flagshipAward('teaching');
const decimal = (value: number, lang: string) =>
  lang === 'es' ? value.toFixed(1).replace('.', ',') : value.toFixed(1);

const latestStudy = educationPapers[educationPapers.length - 1];

// Cuatro simuladores del aula del curso, con su nombre en los dos idiomas.
const SIMULADORES: Record<string, UIKey> = {
  'explorador-bombas-centrifugas': 'unitops.today.pumps',
  'explorador-intercambiadores': 'unitops.today.exchangers',
  'explorador-mccabe-thiele': 'unitops.today.mccabe',
  'explorador-filtracion': 'unitops.today.filtration',
};
const simuladores = (pou202620Course.simulations ?? []).filter((s) => s.id in SIMULADORES);

// Dos estudiantes que tomaron el curso y lo cuentan en su testimonio.
const VOCES = ['Olga Lucía Acuña', 'Juanita Sierra'];
const voces = VOCES.map((name) => testimonials.find((x) => x.name === name && x.category === 'Teaching & Mentorship')).filter(
  (x): x is Testimonial => Boolean(x),
);

// ── La serie de evaluaciones: el gráfico que prueba la página ───────────────
const ScoreChart: React.FC = () => {
  const { t, lang } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const medir = () => { if (ref.current) setWidth(ref.current.offsetWidth); };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const phone = width > 0 && width < 600;
  const height = phone ? 340 : 460;
  const margin = { top: 44, right: phone ? 8 : 16, bottom: 44, left: 44 };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = height - margin.top - margin.bottom;
  const minScore = 130;
  const maxScore = 170;
  const n = evaluationScores.length;
  const slot = innerWidth / n;

  const xScale = (i: number) => margin.left + (i + 0.5) * slot;
  const edge = (i: number) => margin.left + i * slot;
  const yScale = (s: number) => margin.top + innerHeight - ((s - minScore) / (maxScore - minScore)) * innerHeight;
  const points = evaluationScores.map((d, i) => `${xScale(i)},${yScale(d.score)}`).join(' ');

  // Un rótulo por año, en el primer período de cada año; en el teléfono, uno de cada dos años.
  const yearTicks = evaluationScores
    .map((d, i) => ({ i, year: fullTerm(d.term).slice(0, 4) }))
    .filter((d, k, arr) => k === 0 || d.year !== arr[k - 1].year)
    .filter((_, k) => !phone || k % 2 === 0);

  const bands = [
    { from: 0, to: REFORM_START, label: t('unitops.phase.traditional'), fill: '#EBEBEC' },
    { from: REFORM_START, to: SYNTHESIS_START, label: t('unitops.phase.reform'), fill: '#DCDCDE' },
    { from: SYNTHESIS_START, to: n, label: t('unitops.phase.synthesis'), fill: '#EBEBEC' },
  ];

  const shown = evaluationScores[active ?? n - 1];

  return (
    <div>
      <p className="text-[18px] text-tinta-900 min-h-[1.6em]" aria-live="polite">
        <span className="font-semibold tabular-nums">{fullTerm(shown.term)}</span>
        {' · '}{localize(shown.title, lang)} ({shown.code}){' · '}
        <span className="a-resaltado font-semibold tabular-nums">{shown.score}</span>
      </p>
      <div ref={ref} className="mt-6 w-full overflow-hidden" style={{ height }}>
        {width > 0 && (
          <svg
            width={width}
            height={height}
            role="img"
            aria-label={fill(t('unitops.chart.label'), { first: fullTerm(evaluationScores[0].term), last: fullTerm(latest.term) })}
            onMouseLeave={() => setActive(null)}
          >
            {bands.map((b) => (
              <g key={b.label}>
                <rect x={edge(b.from)} y={margin.top} width={edge(b.to) - edge(b.from)} height={innerHeight} fill={b.fill} />
                <text x={edge(b.from) + 8} y={margin.top - 14} fontSize="15" fill="#5E5E61">{b.label}</text>
              </g>
            ))}

            {[130, 140, 150, 160, 170].map((v) => (
              <g key={v}>
                <line x1={margin.left} y1={yScale(v)} x2={width - margin.right} y2={yScale(v)} stroke="#CDCDD0" />
                <text x={margin.left - 10} y={yScale(v) + 5} textAnchor="end" fontSize="15" fill="#76767A">{v}</text>
              </g>
            ))}

            <line x1={margin.left} y1={yScale(benchmark)} x2={width - margin.right} y2={yScale(benchmark)} stroke="#76767A" strokeWidth="2" strokeDasharray="6 5" />
            <text x={width - margin.right - 6} y={yScale(benchmark) - 8} textAnchor="end" fontSize="15" fill="#4A4A4C">
              {`${t('unitops.chart.benchmark')} ${decimal(benchmark, lang)}`}
            </text>

            <motion.polyline
              fill="none"
              stroke="#1D1D1B"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              points={points}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: 'easeInOut' }}
            />

            {evaluationScores.map((d, i) => {
              const key = i === lowestIndex || i === peakIndex;
              const on = active === i;
              return (
                <g
                  key={d.term}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(on ? null : i)}
                  style={{ cursor: 'pointer' }}
                >
                  <rect x={edge(i)} y={margin.top} width={slot} height={innerHeight} fill="transparent" />
                  <motion.circle
                    cx={xScale(i)}
                    cy={yScale(d.score)}
                    r={key || on ? 7 : 5}
                    fill={key || on ? '#FFE900' : '#F5F5F3'}
                    stroke="#1D1D1B"
                    strokeWidth="2.5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                  />
                  {key && (
                    <text
                      x={xScale(i)}
                      y={yScale(d.score) + 30}
                      textAnchor="middle"
                      fontSize="15"
                      fontWeight="600"
                      fill="#1D1D1B"
                    >
                      {d.score}
                    </text>
                  )}
                </g>
              );
            })}

            <line x1={margin.left} y1={margin.top + innerHeight} x2={width - margin.right} y2={margin.top + innerHeight} stroke="#76767A" />
            {yearTicks.map(({ i, year }) => (
              <text key={year} x={xScale(i)} y={margin.top + innerHeight + 26} textAnchor="middle" fontSize="15" fill="#76767A">
                {year}
              </text>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

export const UnitOperationsInnovationPage: React.FC = () => {
  const { t, lang } = useI18n();

  const fases = [
    {
      years: t('unitops.phase1.years'),
      name: t('unitops.phase1.name'),
      tag: t('unitops.phase1.tag'),
      texto: (
        <p className="detalle">
          {t('unitops.phase1.textPre')}<strong className="font-semibold text-tinta-900">{decimal(traditionalAvg, lang)}</strong>{t('unitops.phase1.textPost')}
        </p>
      ),
    },
    {
      years: t('unitops.phase2.years'),
      name: t('unitops.phase2.name'),
      tag: t('unitops.phase2.tag'),
      texto: (
        <>
          <p className="detalle">
            {t('unitops.phase2.text1').split('{ip2}')[0]}<strong className="font-semibold text-tinta-900">{t('unitops.phase2.ip2')}</strong>{t('unitops.phase2.text1').split('{ip2}')[1]}
          </p>
          <p className="detalle">
            {t('unitops.phase2.text2pre')}<span className="a-resaltado font-semibold">{`${t('unitops.phase2.lowOf')}${lowest.score} ${t('unitops.phase2.lowIn')} ${fullTerm(lowest.term)}`}</span>{t('unitops.phase2.text2post')}
          </p>
        </>
      ),
    },
    {
      years: t('unitops.phase3.years'),
      name: t('unitops.phase3.name'),
      tag: t('unitops.phase3.tag'),
      texto: (
        <p className="detalle">
          {t('unitops.phase3.text1')}<strong className="font-semibold text-tinta-900">{t('unitops.phase3.genai')}</strong>
          {fill(t('unitops.phase3.text2'), { peakTerm: fullTerm(peak.term) })}<strong className="font-semibold text-tinta-900">{t('unitops.phase3.fifty')}</strong>
          {t('unitops.phase3.text3')}<em>{t('unitops.phase3.insilico')}</em>{t('unitops.phase3.text4')}<strong className="font-semibold text-tinta-900">{t('unitops.phase3.aspen')}</strong>
          {t('unitops.phase3.text5')}<span className="a-resaltado font-semibold">{peak.score}{t('unitops.phase3.text5b')}{fullTerm(peak.term)}</span>
          {t('unitops.phase3.text5c')}<strong className="font-semibold text-tinta-900">{`${latest.score} (${fullTerm(latest.term)})`}</strong>
          {t('unitops.phase3.text6')}<strong className="font-semibold text-tinta-900">{decimal(traditionalAvg, lang)}</strong>{t('unitops.phase3.text7')}
        </p>
      ),
    },
  ];

  const lecciones = [
    { title: t('unitops.lesson1.title'), desc: t('unitops.lesson1.desc') },
    { title: t('unitops.lesson2.title'), desc: `${t('unitops.lesson2.descPre')}${lowest.score}${t('unitops.lesson2.descTo')}${peak.score}${t('unitops.lesson2.descOver')}${recoverySemesters}${t('unitops.lesson2.descPost')}` },
    { title: t('unitops.lesson3.title'), desc: t('unitops.lesson3.desc') },
    { title: t('unitops.lesson4.title'), desc: t('unitops.lesson4.desc') },
  ];

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('unitops.title')}
        entrada={<p>{t('unitops.sub')}</p>}
        accion={{ href: `https://doi.org/${latestStudy.doi}`, label: fill(t('unitops.cta'), { year: latestStudy.year }) }}
        foto={{ src: fotos.postersPou.src, alt: localize(fotos.postersPou.alt, lang) }}
      />

      {/* ── El reconocimiento ── */}
      {award && (
        <section className="a-oscuro a-campo">
          <div className="a-c grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center">
            <div>
              <Sube><h2 className="a-titulo">{fill(t('unitops.award.heading'), { year: award.year })}.</h2></Sube>
              <Sube delay={0.06}>
                <p className="a-entrada mt-8 max-w-[40ch]">
                  {fill(t('unitops.award.name'), { awarder: localize(award.awarder, lang) })}
                </p>
              </Sube>
              <Sube delay={0.1}>
                <p className="mt-8 a-texto text-papel-100">{t('unitops.award.citation')}</p>
                <p className="mt-4 a-texto text-papel-200">{t('unitops.award.note')}</p>
                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link to="/recognition" className="a-boton">
                    {t('unitops.award.cta')} <span aria-hidden="true">→</span>
                  </Link>
                  <a href={award.url} target="_blank" rel="noopener noreferrer" className="a-enlace">
                    {t('unitops.award.ctaAiche')} <span aria-hidden="true">↗</span>
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

      {/* ── La serie de evaluaciones, a todo el ancho ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube>
            <h2 className="a-h3">{fill(t('unitops.chart.heading'), { low: lowest.score, peak: peak.score })}.</h2>
            <p className="mt-4 a-texto">{t('unitops.chart.scale')} {t('unitops.chart.touch')}</p>
          </Sube>
          <Sube delay={0.06} className="mt-10">
            <ScoreChart />
            <p className="a-pie max-w-[64ch]">{`${t('unitops.chart.notePre')}${decimal(benchmark, lang)}${t('unitops.chart.notePost')}`}</p>
          </Sube>
        </div>
      </section>

      {/* ── Contexto y fases ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('unitops.context')}.</h2></Sube>
          <Sube delay={0.05}>
            <p className="mt-6 a-texto text-tinta-900">
              {t('unitops.context.text1')}<strong className="font-semibold">{t('unitops.context.school')}</strong>{t('unitops.context.text2')}<strong className="font-semibold">{t('unitops.context.dept')}</strong>{t('unitops.context.text3')}
            </p>
          </Sube>

          <Sube className="mt-20"><h2 className="a-h3 mb-8">{t('unitops.evolution')}.</h2></Sube>
          <ol className="a-registro">
            {fases.map((f, i) => (
              <Sube as="li" key={f.years} delay={0.05 * i}>
                <span className="cuando">{f.years}</span>
                <div>
                  <h3 className="que">{f.name}</h3>
                  <p className="donde">{f.tag}</p>
                  <div className="space-y-4 text-tinta-800">{f.texto}</div>
                </div>
              </Sube>
            ))}
          </ol>
        </div>
      </section>

      {/* ── El curso hoy: los simuladores de su aula ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('unitops.today.title')}.</h2></Sube>
          <Sube delay={0.05}>
            <p className="mt-6 a-texto">
              {fill(t('unitops.today.text'), { term: pou202620Course.term, n: pou202620Course.simulations?.length ?? 0 })}
            </p>
          </Sube>
          <div className="mt-12 grid gap-x-8 gap-y-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.6fr)] lg:items-start">
            <Sube>
              <figure>
                <div className="overflow-hidden aspect-[3/4]">
                  <img src={fotos.pouNpsh.src} alt={localize(fotos.pouNpsh.alt, lang)} loading="lazy" className="a-foto" />
                </div>
                <figcaption className="a-pie">{localize(fotos.pouNpsh.alt, lang)}</figcaption>
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
            <Link to="/classroom" className="a-enlace">{t('unitops.today.cta')} <span aria-hidden="true">→</span></Link>
          </Sube>
        </div>
      </section>

      {/* ── Lecciones ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('unitops.lessons')}.</h2></Sube>
          <div className="mt-10 grid gap-x-16 gap-y-12 md:grid-cols-2">
            {lecciones.map((l, i) => (
              <Sube key={l.title} delay={0.05 * i} className="border-t-2 border-tinta-900 pt-5">
                <h3 className="text-[18px] font-semibold text-tinta-900">{l.title}</h3>
                <p className="mt-2 text-tinta-800">{l.desc}</p>
              </Sube>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dos estudiantes del curso ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('unitops.voices.title')}.</h2></Sube>
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

      {/* ── Base académica ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-8">{t('unitops.scholarly')}.</h2></Sube>
          <ol className="a-registro">
            {educationPapers.map((paper, i) => (
              <Sube as="li" key={paper.doi} delay={0.05 * i}>
                <span className="cuando">{paper.year}</span>
                <div>
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="block text-[18px] leading-snug font-semibold text-tinta-900 hover:bg-resaltador-suave transition-colors">
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
              {t('unitops.sotlLink')}{' '}
              <Link to="/teaching/scholarship" className="a-enlace">{t('unitops.sotlLinkCta')} <span aria-hidden="true">→</span></Link>
            </p>
          </Sube>
        </div>
      </section>

      {/* ── Cierre ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube><p className="a-entrada max-w-[46ch] text-papel-0">{t('unitops.quote')}</p></Sube>
        </div>
      </section>
    </PageWrapper>
  );
};
