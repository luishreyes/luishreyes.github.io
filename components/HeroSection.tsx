import React from 'react';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <div className="h-[60vh] w-full flex flex-col items-center justify-center bg-slate-100 relative">
      <motion.div
        // FIX: Spreading motion props to avoid TypeScript type errors.
        {...{
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: 'easeOut' },
        }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-slate-900">
          Luis H. Reyes
        </h1>
        <p className="mt-4 text-xl md:text-2xl text-slate-600 tracking-wide">
          Metabolic Engineer & Computational Biologist
        </p>
      </motion.div>
    </div>
  );
};
