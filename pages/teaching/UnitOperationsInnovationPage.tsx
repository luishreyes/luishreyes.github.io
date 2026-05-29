import React, { useRef, useState, useEffect } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../context/i18n';

const evaluationScores = [
  { term: '17-20', score: 160 },
  { term: '18-10', score: 154 },
  { term: '18-20', score: 153 },
  { term: '19-10', score: 153 },
  { term: '19-20', score: 152 },
  { term: '20-20', score: 152 },
  { term: '21-10', score: 153 },
  { term: '21-20', score: 141 },
  { term: '22-10', score: 143 },
  { term: '22-20', score: 135 },
  { term: '23-10', score: 143 },
  { term: '23-20', score: 152 },
  { term: '24-10', score: 149 },
  { term: '24-20', score: 149 },
  { term: '25-20', score: 156 },
];

const scholarlyPapers = [
  {
    authors: 'Ballesteros, M.A., Daza, M.A., Valdés, J.P., Ratkovich, N., & Reyes, L.H.',
    year: '2019',
    title: 'Applying PBL methodologies to the chemical engineering courses: Unit operations and modeling and simulation, using a joint course project',
    journal: 'Education for Chemical Engineers, 27, 35-42',
    doi: '10.1016/j.ece.2019.03.003'
  },
  {
    authors: 'Ballesteros, M.Á., Sánchez, J.S., Ratkovich, N., Cruz, J.C., & Reyes, L.H.',
    year: '2021',
    title: 'Modernizing the chemical engineering curriculum via a student-centered framework that promotes technical, professional, and technology expertise skills: The case of unit operations',
    journal: 'Education for Chemical Engineers, 35, 8-21',
    doi: '10.1016/j.ece.2020.11.007'
  },
  {
    authors: 'Acuña, O.L., Santos Carvajal, D.M., Bolaños-Barbosa, A.D., Torres-Vanegas, J.D., Alvarez Solano, O.A., Cruz, J.C., & Reyes, L.H.',
    year: '2025',
    title: 'Fostering technical proficiency and professional skills: A multifaceted PO-PBL strategy for unit operations education',
    journal: 'Education for Chemical Engineers, 51, 64-78',
    doi: '10.1016/j.ece.2024.12.001'
  }
];

const ScoreChart = () => {
  const { t } = useI18n();
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

  return (
    <div ref={chartRef} className="bg-white p-6 rounded-lg shadow-lg border border-yellow-400/40 overflow-hidden relative">
      <h3 className="text-xl font-bold text-brand-dark mb-2 text-center">{t('unitops.chart.title')}</h3>
      <p className="text-xs text-brand-gray text-center mb-8 uppercase tracking-widest">{t('unitops.chart.scale')}</p>
      
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Phase backgrounds - following site's subtle palette */}
        <rect x={margin.left} y={margin.top} width={xScale(6.5) - margin.left} height={innerHeight} fill="#f4f4f5" />
        <rect x={xScale(6.5)} y={margin.top} width={xScale(11.5) - xScale(6.5)} height={innerHeight} fill="#fff7ed" />
        <rect x={xScale(11.5)} y={margin.top} width={width - margin.right - xScale(11.5)} height={innerHeight} fill="#fefce8" />

        {/* Phase Labels */}
        <text x={margin.left + (xScale(6.5) - margin.left)/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-zinc-400 uppercase tracking-widest">{t('unitops.phase.traditional')}</text>
        <text x={xScale(6.5) + (xScale(11.5) - xScale(6.5))/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-orange-400 uppercase tracking-widest">{t('unitops.phase.reform')}</text>
        <text x={xScale(11.5) + (width - margin.right - xScale(11.5))/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-yellow-600 uppercase tracking-widest">{t('unitops.phase.synthesis')}</text>

        {/* Horizontal Grid */}
        {[130, 140, 150, 160, 170].map(val => (
          <g key={val}>
            <line x1={margin.left} y1={yScale(val)} x2={width - margin.right} y2={yScale(val)} stroke="#e4e4e7" strokeWidth="1" />
            <text x={margin.left - 10} y={yScale(val) + 4} textAnchor="end" className="text-[10px] fill-zinc-500 font-medium">{val}</text>
          </g>
        ))}

        {/* Ref Benchmark */}
        <line x1={margin.left} y1={yScale(157.6)} x2={width - margin.right} y2={yScale(157.6)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x={width - margin.right + 5} y={yScale(157.6) + 3} className="text-[8px] fill-slate-500 font-bold uppercase">{t('unitops.chart.benchmark')}</text>

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
  const { t } = useI18n();
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
                  {t('unitops.phase1.text')}
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
                  {t('unitops.phase2.text2pre')}<span className="text-red-600 font-bold">{t('unitops.phase2.text2low')}</span>{t('unitops.phase2.text2post')}
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
                  {t('unitops.phase3.text1')}<span className="font-semibold text-brand-dark">{t('unitops.phase3.genai')}</span>{t('unitops.phase3.text2')}<span className="font-bold text-brand-dark">{t('unitops.phase3.fifty')}</span>{t('unitops.phase3.text3')}<span className="font-medium text-brand-dark italic">{t('unitops.phase3.insilico')}</span>{t('unitops.phase3.text4')}<span className="font-semibold text-brand-dark">{t('unitops.phase3.aspen')}</span>{t('unitops.phase3.text5')}<span className="font-bold text-brand-dark">156</span>{t('unitops.phase3.text6')}
                </p>
              </motion.div>
            </div>
          </section>

          <section className="bg-zinc-50 -mx-4 px-4 py-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 rounded-xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-10 text-center uppercase tracking-widest">{t('unitops.impact')}</h2>
              <ScoreChart />
              <p className="mt-8 text-xs text-center text-brand-gray italic">
                {t('unitops.chart.note')}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-8">{t('unitops.lessons')}</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { title: t('unitops.lesson1.title'), desc: t('unitops.lesson1.desc') },
                { title: t('unitops.lesson2.title'), desc: t('unitops.lesson2.desc') },
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
              {scholarlyPapers.map((paper, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg border border-zinc-100 shadow-sm transition-all hover:border-yellow-400/40">
                  <h3 className="text-lg font-bold text-brand-dark mb-2 leading-tight">
                    <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="hover:text-yellow-600 transition-colors">
                      {paper.title}
                    </a>
                  </h3>
                  <p className="text-xs text-brand-gray mb-1 uppercase tracking-wider font-semibold">{paper.authors} ({paper.year})</p>
                  <p className="text-xs text-yellow-600 font-bold mb-4 uppercase tracking-tighter">{paper.journal}</p>
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-bold text-brand-dark bg-yellow-400 px-3 py-1.5 rounded hover:bg-yellow-500 transition-colors">
                    DOI: {paper.doi}
                  </a>
                </div>
              ))}
            </div>
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