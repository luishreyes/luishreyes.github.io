

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { StatsSection } from '../components/StatsSection';
import { grantsData } from '../components/data/grants';
import { studentsData, graduatedStudentsData } from '../components/data/students';
import { ProductsOverTimeChart } from '../components/ProductsOverTimeChart';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ResearchConnectionsGraph } from '../components/ResearchConnectionsGraph';
import { useAppData } from '../context/AppDataContext';

export const ResearchOverviewPage: React.FC = () => {
  const { citationData, products } = useAppData();
  const totalMentees = studentsData.phd.length + studentsData.ms.length + graduatedStudentsData.phd.length + graduatedStudentsData.ms.length;

  const stats = [
    { label: 'Products', value: products.length },
    { label: 'Total Citations', value: citationData.total },
    { label: 'h-index', value: citationData.hIndex },
    { label: 'i10-index', value: citationData.i10Index },
    { label: 'Funded Grants', value: grantsData.length },
    { label: 'Mentees', value: totalMentees },
  ];
  
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"]
  });
  const frameRotate = useTransform(scrollYProgress, [0, 1], [1, -2]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  return (
    <PageWrapper noPadding>
      {/* Header Section */}
      <div ref={headerRef} className="relative bg-zinc-800 overflow-hidden p-6 sm:p-8">
        {/* Dephased frame */}
        <motion.div
          className="absolute inset-2 sm:inset-4 rounded-2xl border-2 border-yellow-400 pointer-events-none"
          style={{ rotate: frameRotate }}
        />

        {/* Main content with image background */}
        <motion.div
          className="relative rounded-2xl shadow-xl z-10 overflow-hidden"
          style={{ rotate: imageRotate }}
        >
          <img 
              src="https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Generated%20Image%20September%2002,%202025%20-%201_07PM.jpeg" 
              alt="Abstract visualization of biological and AI concepts"
              className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"></div>
          <div className="absolute inset-0 bg-zinc-900/60 mix-blend-multiply" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-24">
              <motion.div
                  // FIX: Spread motion props to avoid TypeScript type errors.
                  {...{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.6, ease: 'easeOut' },
                  }}
                  className="text-left max-w-3xl"
              >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                      Research Overview
                  </h1>
                  <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                      Mapping a journey of discovery at the intersection of biotechnology, nanotechnology, and AI.
                  </p>
              </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <StatsSection stats={stats} isLoading={citationData.isLoading} />

            <motion.div 
              // FIX: Spread motion props to avoid TypeScript type errors.
              {...{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.5, delay: 0.2 },
              }}
              className="mt-16 max-w-4xl mx-auto text-center"
            >
              <h2 className="text-2xl font-semibold text-brand-dark">Research Vision</h2>
              <p className="mt-4 text-brand-gray leading-relaxed text-lg">
                My research group is dedicated to engineering biology for a better life and creating a sustainable future. We operate at the convergence of biotechnology, nanotechnology, and artificial intelligence, applying engineering principles to design, build, and optimize living systems. Our work addresses critical challenges across biomedical, food, and environmental engineering, transforming microorganisms into microscopic factories that produce high-value products for medicine, food, and sustainable industry.
              </p>
              <div className="mt-8">
                <Link
                  to="/research/program"
                  className="inline-block bg-yellow-400 text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300"
                >
                  Explore Our Research Program
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              // FIX: Spread motion props to avoid TypeScript type errors.
              {...{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.5, delay: 0.2 },
              }}
              className="mt-20"
            >
              <ProductsOverTimeChart products={products} />
            </motion.div>

            <motion.div
              // FIX: Spread motion props to avoid TypeScript type errors.
              {...{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.5, delay: 0.2 },
              }}
              className="mt-20 max-w-5xl mx-auto"
            >
              <div className="bg-zinc-50/50 p-4 sm:p-8 rounded-xl border border-zinc-200 shadow-inner">
                 <ResearchConnectionsGraph products={products} />
              </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};