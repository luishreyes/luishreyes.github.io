import React, { useRef, useState, useEffect } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';

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
      <h3 className="text-xl font-bold text-brand-dark mb-2 text-center">Score Evolution: The Reform Journey</h3>
      <p className="text-xs text-brand-gray text-center mb-8 uppercase tracking-widest">Institutional 100–200 Scale</p>
      
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Phase backgrounds - following site's subtle palette */}
        <rect x={margin.left} y={margin.top} width={xScale(6.5) - margin.left} height={innerHeight} fill="#f4f4f5" />
        <rect x={xScale(6.5)} y={margin.top} width={xScale(11.5) - xScale(6.5)} height={innerHeight} fill="#fff7ed" />
        <rect x={xScale(11.5)} y={margin.top} width={width - margin.right - xScale(11.5)} height={innerHeight} fill="#fefce8" />

        {/* Phase Labels */}
        <text x={margin.left + (xScale(6.5) - margin.left)/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-zinc-400 uppercase tracking-widest">Traditional</text>
        <text x={xScale(6.5) + (xScale(11.5) - xScale(6.5))/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-orange-400 uppercase tracking-widest">Reform Era</text>
        <text x={xScale(11.5) + (width - margin.right - xScale(11.5))/2} y={margin.top - 20} textAnchor="middle" className="text-[10px] font-bold fill-yellow-600 uppercase tracking-widest">Synthesis</text>

        {/* Horizontal Grid */}
        {[130, 140, 150, 160, 170].map(val => (
          <g key={val}>
            <line x1={margin.left} y1={yScale(val)} x2={width - margin.right} y2={yScale(val)} stroke="#e4e4e7" strokeWidth="1" />
            <text x={margin.left - 10} y={yScale(val) + 4} textAnchor="end" className="text-[10px] fill-zinc-500 font-medium">{val}</text>
          </g>
        ))}

        {/* Ref Benchmark */}
        <line x1={margin.left} y1={yScale(157.6)} x2={width - margin.right} y2={yScale(157.6)} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
        <text x={width - margin.right + 5} y={yScale(157.6) + 3} className="text-[8px] fill-slate-500 font-bold uppercase">Ref Benchmark (157.6)</text>

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
  return (
    <PageWrapper noPadding>
      <div className="pt-16">
        <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Unit Operations Innovation</h1>
                <p className="mt-4 text-brand-gray leading-relaxed font-medium">
                    A Seven-Year Journey: From Theory and Problem-Sets to Project-Based Synthesis.
                </p>
            </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
          <section>
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-6">Context</h2>
            <p className="text-lg text-brand-gray leading-relaxed">
              Unit Operations is the foundational course in chemical engineering curricula worldwide. In 2021, following a mandate from the <span className="font-semibold text-brand-dark">School of Engineering</span> for greater experiential learning, the <span className="font-semibold text-brand-dark">Department of Chemical and Food Engineering</span> undertook a comprehensive curriculum reform. This documentation chronicles the transformation of Unit Operations under that reform, the challenges encountered, and the pedagogical synthesis that eventually emerged.
            </p>
          </section>

          <section className="space-y-12">
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark uppercase tracking-widest flex items-center gap-4">
               The Evolution
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
                  <h3 className="text-xl font-bold text-brand-dark">Phase 1: Traditional Approach (2017–2021)</h3>
                  <span className="text-xs font-bold uppercase bg-zinc-100 px-2 py-1 rounded">Stable</span>
                </div>
                <p className="text-brand-gray leading-relaxed">
                  The original course followed the standard model: comprehensive lectures covering theoretical foundations, worked examples, and traditional homework assignments. Evaluations were stable, averaging 153.9. While effective, the format offered limited opportunity for students to integrate concepts through authentic engineering problems.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md border border-zinc-100 border-l-4 border-l-red-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-brand-dark">Phase 2: Curriculum Reform and PO-PBL (2021–2023)</h3>
                  <span className="text-xs font-bold uppercase bg-red-50 text-red-600 px-2 py-1 rounded">Declined</span>
                </div>
                <p className="text-brand-gray leading-relaxed mb-4">
                  The course became <span className="font-medium text-brand-dark">Integrated Project 2</span> under a pure Project-Oriented Problem-Based Learning format. Theory was minimized as students learned through semester-long design projects.
                </p>
                <p className="text-brand-gray leading-relaxed">
                  The magnitude of change was severe. Student response was challenging; evaluations dropped sharply to a <span className="text-red-600 font-bold">low of 135 in 2022-20</span>. Students expressed frustration with the cognitive load of learning new concepts while simultaneously applying them without structured theoretical guidance.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-lg shadow-md border border-zinc-100 border-l-4 border-l-yellow-400"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-brand-dark">Phase 3: Finding the Balance (2024–Present)</h3>
                  <span className="text-xs font-bold uppercase bg-yellow-50 text-yellow-600 px-2 py-1 rounded">Recovered</span>
                </div>
                <p className="text-brand-gray leading-relaxed">
                  The transition to Unit Operations Project in 2024 marked a new synthesis. I integrated <span className="font-semibold text-brand-dark">Generative AI</span> tools and added theoretical content back. The final breakthrough came in 2025-20 with a deliberate <span className="font-bold text-brand-dark">50-50 structure</span>: half dedicated to theory and problem-solving, and half to a semester-long <span className="font-medium text-brand-dark italic">in silico</span> design project using <span className="font-semibold text-brand-dark">ASPEN simulation</span>. Evaluations recovered to <span className="font-bold text-brand-dark">156</span>, matching institutional benchmarks.
                </p>
              </motion.div>
            </div>
          </section>

          <section className="bg-zinc-50 -mx-4 px-4 py-16 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12 rounded-xl">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-10 text-center uppercase tracking-widest">Impact on Student Experience</h2>
              <ScoreChart />
              <p className="mt-8 text-xs text-center text-brand-gray italic">
                Note: Pandora's Laboratory maintained a consistent 157.6 average as a reference benchmark across the same period.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold tracking-tight text-brand-dark mb-8">Lessons Learned</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {[
                { title: "Theoretical Foundations", desc: "Even in project-based contexts, students value theoretical frameworks. Explicit instruction provides the scaffolding needed to tackle complex problems confidently." },
                { title: "Iterative Refinement", desc: "Pedagogical innovation requires sustaining and documenting each phase. The evaluation recovery from 135 to 156 occurred over six semesters of sustainment." },
                { title: "In Silico Bridging", desc: "ASPEN simulation addresses physical laboratory constraints, allowing students to see immediate consequences of engineering decisions in larger scopes." },
                { title: "AI-Assisted Rigor", desc: "GenAI tools support learning when properly scaffolded. Structured AI integration (AIAS framework) improved literature review quality while maintaining rigor." }
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
              Scholarly Foundation
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
              "The result speaks for itself. The course now combines the rigor students expect with the authentic design experience that motivated the original transformation."
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
};