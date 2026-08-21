import React, { useRef, useState, useEffect } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useI18n } from '../../context/i18n';
import { teachingData } from '../../components/data/teaching';
import { educationPapers } from '../../components/data/educationResearch';

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
}

const evaluationScores: ScorePoint[] = teachingData
  .filter((c) => UNIT_OPS_CODES.includes(c.code) && c.evaluation !== null)
  .sort((a, b) => a.term.localeCompare(b.term))
  .map((c) => ({ term: c.term.slice(2), score: c.evaluation as number }));

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
const decimal = (value: number, lang: string) =>
  lang === 'es' ? value.toFixed(1).replace('.', ',') : value.toFixed(1);


const ScoreChart = () => {
  const { t, lang } = useI18n();
  const chartRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const height = 350;
  const margin = { top: 60, right: 40, bottom: 60, left: 50 };

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) setWidth(chartRef.current.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (width === 0) return <div ref={chartRef} className="h-[350px] w-full animate-pulse bg-zinc-100 rounded-xl" />;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const minScore = 130;
  const maxScore = 170;

  const xScale = (index: number) => margin.left + (index / (evaluationScores.length - 1)) * innerWidth;
  const yScale = (score: number) => margin.top + innerHeight - ((score - minScore) / (maxScore - minScore)) * innerHeight;
  const points = evaluationScores.map((d, i) => `${xScale(i)},${yScale(d.score)}`).join(' ');

  // Phase bands break halfway between the last run of one era and the first of the next.
  const reformEdge = REFORM_START - 0.5;
  const synthesisEdge = SYNTHESIS_START - 0.5;

  return (
    <div ref={chartRef} className="bg-white p-6 rounded-lg shadow-lg border border-yellow-400/40 overflow-hidden relative">
      <h3 className="text-xl font-bold text-brand-dark mb-2 text-center">{t('unitops.chart.title')}</h3>
      <p className="text-xs text-brand-gray text-center mb-8 uppercase tracking-widest">{t('unitops.chart.scale')}</p>
      
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Phase backgrounds - following site's subtle palette */}
        <rect x={margin.left} y={margin.top} width={xScale(reformEdge) - margin.left} height={innerHeight} fill="#f4f4f5" />
        <rect x={xScale(reformEdge)} y={margin.top} width={xScale(synthesisEdge) - xScale(reformEdge)} height={innerHeight} fill="#fff7ed" />
        <rect x={xScale(synthesisEdge)} y={margin.top} width={width - margin.right - xScale(synthesisEdge)} height={innerHeight} fill="#fefce8" />

        {/* Phase Labels */}
        <text x={margin.left + (xScale(reformEdge) - margin.left)/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-zinc-400 uppercase tracking-widest">{t('unitops.phase.traditional')}</text>
        <text x={xScale(reformEdge) + (xScale(synthesisEdge) - xScale(reformEdge))/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-orange-400 uppercase tracking-widest">{t('unitops.phase.reform')}</text>
        <text x={xScale(synthesisEdge) + (width - margin.right - xScale(synthesisEdge))/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-yellow-600 uppercase tracking-widest">{t('unitops.phase.synthesis')}</text>

        {/* Horizontal Grid */}
        {[130, 140, 150, 160, 170].map(val => (
          <g key={val}>
            <line x1={margin.left} y1={yScale(val)} x2={width - margin.right} y2={yScale(val)} stroke="#e4e4e7" strokeWidth="1" />
            <text x={margin.left - 10} y={yScale(val) + 4} textAnchor="end" className="text-[10px] fill-zinc-500 font-medium">{val}</text>
          </g>
        ))}

        {/* Ref Benchmark */}
        <line x1={margin.left} y1={yScale(benchmark)} x2={width - margin.right} y2={yScale(benchmark)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x={width - margin.right} y={yScale(benchmark) - 6} textAnchor="end" className="text-[8px] fill-slate-500 font-bold uppercase">{`${t('unitops.chart.benchmark')} (${decimal(benchmark, lang)})`}</text>

        {/* Main path */}
        <motion.polyline
          fill="none"
          stroke="#FBBF24"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Points */}
        {evaluationScores.map((d, i) => (
          <g key={i}>
            <motion.circle
              cx={xScale(i)}
              cy={yScale(d.score)}
              r="4.5"
              fill="white"
              stroke="#FBBF24"
              strokeWidth="2.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + i * 0.05 }}
            />
            <text
              x={xScale(i)}
              y={height - margin.bottom + 25}
              textAnchor="middle"
              className="text-[9px] font-bold fill-zinc-500"
              transform={`rotate(45, ${xScale(i)}, ${height - margin.bottom + 25})`}
            >
              {d.term}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export const UnitOperationsInnovationPage: React.FC = () => {
  const { t, lang } = useI18n();
  return (
    <PageWrapper noPadding>
      <div className="pt-16">
        <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">{t('unitops.title')}</h1>
                <p className="mt-4 text-brand-gray leading-relaxed font-medium">
                    {t('unitops.sub')}
                </p>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-brand-dark rounded-xl p-8 sm:p-10 shadow-xl border border-yellow-400/30"
          >
            <div className="sm:flex sm:items-start sm:gap-8">
              <img
                src="/images/aiche-logo.svg"
                alt="AIChE"
                className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0 invert opacity-90"
              />
              <div className="mt-6 sm:mt-0 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">{t('unitops.award.eyebrow')}</p>
                <h2 className="mt-2 text-2xl font-bold text-white leading-tight">{t('unitops.award.title')}</h2>
                <p className="mt-4 text-zinc-300 italic leading-relaxed">{t('unitops.award.citation')}</p>
                <p className="mt-4 text-sm text-zinc-400 leading-relaxed">{t('unitops.award.note')}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/recognition"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-brand-dark bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
                  >
                    {t('unitops.award.cta')}
                  </Link>
                  <a
                    href="https://www.aiche.org/community/awards/award-innovation-chemical-engineering-education"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-yellow-400 border border-yellow-400/50 px-4 py-2 rounded hover:bg-yellow-400/10 transition-colors"
                  >
                    {t('unitops.award.ctaAiche')} &#8599;
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-6">{t('unitops.context')}</h2>
            <p className="text-lg text-brand-gray leading-relaxed">
              {t('unitops.context.text1')}<span className="font-semibold text-brand-dark">{t('unitops.context.school')}</span>{t('unitops.context.text2')}<span className="font-semibold text-brand-dark">{t('unitops.context.dept')}</span>{t('unitops.context.text3')}
            </p>
          </section>

          <section className="space-y-12">
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark uppercase tracking-widest flex items-center gap-4">
               {t('unitops.evolution')}
               <span className="flex-grow h-px bg-zinc-200"></span>
            </h2>
            
            <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md border border-zinc-100 border-l-4 border-l-zinc-800"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-brand-dark">{t('unitops.phase1.title')}</h3>
                  <span className="text-xs font-bold uppercase bg-zinc-100 px-2 py-1 rounded">{t('unitops.phase1.tag')}</span>
                </div>
                <p className="text-brand-gray leading-relaxed">
                  {`${t('unitops.phase1.textPre')}${decimal(traditionalAvg, lang)}${t('unitops.phase1.textPost')}`}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md border border-zinc-100 border-l-4 border-l-red-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-brand-dark">{t('unitops.phase2.title')}</h3>
                  <span className="text-xs font-bold uppercase bg-red-50 text-red-600 px-2 py-1 rounded">{t('unitops.phase2.tag')}</span>
                </div>
                <p className="text-brand-gray leading-relaxed mb-4">
                  {t('unitops.phase2.text1').split('{ip2}')[0]}<span className="font-medium text-brand-dark">{t('unitops.phase2.ip2')}</span>{t('unitops.phase2.text1').split('{ip2}')[1]}
                </p>
                <p className="text-brand-gray leading-relaxed">
                  {t('unitops.phase2.text2pre')}<span className="text-red-600 font-bold">{`${t('unitops.phase2.lowOf')}${lowest.score} ${t('unitops.phase2.lowIn')} ${fullTerm(lowest.term)}`}</span>{t('unitops.phase2.text2post')}
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md border border-zinc-100 border-l-4 border-l-yellow-400"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-brand-dark">{t('unitops.phase3.title')}</h3>
                  <span className="text-xs font-bold uppercase bg-yellow-50 text-yellow-600 px-2 py-1 rounded">{t('unitops.phase3.tag')}</span>
                </div>
                <p className="text-brand-gray leading-relaxed">
                  {t('unitops.phase3.text1')}<span className="font-semibold text-brand-dark">{t('unitops.phase3.genai')}</span>{t('unitops.phase3.text2')}<span className="font-bold text-brand-dark">{t('unitops.phase3.fifty')}</span>{t('unitops.phase3.text3')}<span className="font-medium text-brand-dark italic">{t('unitops.phase3.insilico')}</span>{t('unitops.phase3.text4')}<span className="font-semibold text-brand-dark">{t('unitops.phase3.aspen')}</span>{t('unitops.phase3.text5')}<span className="font-bold text-brand-dark">{peak.score}</span>{t('unitops.phase3.text5b')}<span className="font-bold text-brand-dark">{fullTerm(peak.term)}</span>{t('unitops.phase3.text5c')}<span className="font-bold text-brand-dark">{`${latest.score} (${fullTerm(latest.term)})`}</span>{t('unitops.phase3.text6')}<span className="font-bold text-brand-dark">{decimal(traditionalAvg, lang)}</span>{t('unitops.phase3.text7')}
                </p>
              </motion.div>
            </div>
          </section>

          <section className="bg-zinc-50 -mx-4 px-4 py-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 rounded-xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-10 text-center uppercase tracking-widest">{t('unitops.impact')}</h2>
              <ScoreChart />
              <p className="mt-8 text-xs text-center text-brand-gray italic">
                {`${t('unitops.chart.notePre')}${decimal(benchmark, lang)}${t('unitops.chart.notePost')}`}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-8">{t('unitops.lessons')}</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { title: t('unitops.lesson1.title'), desc: t('unitops.lesson1.desc') },
                { title: t('unitops.lesson2.title'), desc: `${t('unitops.lesson2.descPre')}${lowest.score}${t('unitops.lesson2.descTo')}${peak.score}${t('unitops.lesson2.descOver')}${recoverySemesters}${t('unitops.lesson2.descPost')}` },
                { title: t('unitops.lesson3.title'), desc: t('unitops.lesson3.desc') },
                { title: t('unitops.lesson4.title'), desc: t('unitops.lesson4.desc') }
              ].map((lesson, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-bold text-brand-dark flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-yellow-400/20 text-yellow-600 rounded text-xs font-mono">{idx + 1}</span>
                    {lesson.title}
                  </h4>
                  <p className="text-brand-gray text-sm leading-relaxed pl-8">{lesson.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-10">
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-8 uppercase tracking-widest flex items-center gap-4">
              {t('unitops.scholarly')}
              <span className="flex-grow h-px bg-zinc-200"></span>
            </h2>
            <div className="space-y-6">
              {educationPapers.map((paper, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-zinc-100 shadow-sm transition-all hover:border-yellow-400/40">
                  <h3 className="text-lg font-bold text-brand-dark mb-2 leading-tight">
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-colors">
                      {paper.title}
                    </a>
                  </h3>
                  <p className="text-xs text-brand-gray mb-1 uppercase tracking-wider font-semibold">{paper.authorsFull} ({paper.year})</p>
                  <p className="text-xs text-yellow-600 font-bold mb-4 uppercase tracking-tighter">{`${paper.journal}, ${paper.locator}`}</p>
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark bg-yellow-400 px-3 py-1.5 rounded hover:bg-yellow-500 transition-colors">
                    DOI: {paper.doi}
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-brand-gray leading-relaxed">
              {t('unitops.sotlLink')}{' '}
              <Link to="/teaching/scholarship" className="font-semibold text-brand-dark underline decoration-yellow-400 decoration-2 underline-offset-4 hover:text-yellow-600 transition-colors">
                {t('unitops.sotlLinkCta')}
              </Link>
            </p>
          </section>

          <section className="text-center py-12 border-t border-zinc-100">
            <p className="text-2xl font-bold tracking-tighter text-brand-dark max-w-3xl mx-auto leading-relaxed">
              {t('unitops.quote')}
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};