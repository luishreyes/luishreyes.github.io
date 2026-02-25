


import React, { useEffect } from 'react';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface Stat {
  label: string;
  value: number | string;
}

interface StatsSectionProps {
  stats: Stat[];
  isLoading: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
      ease: 'easeOut' as const,
    },
  }),
};

// FIX: Changed component to React.FC to resolve TypeScript error with the 'key' prop.
const StatCard: React.FC<{ label: string; value: string | number; index: number }> = ({ label, value, index }) => {
    const isNumber = typeof value === 'number';
    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest as number));

    useEffect(() => {
        if (isNumber) {
            const animation = animate(count, value, {
                duration: 1.5,
                ease: "easeOut",
            });
            return () => animation.stop();
        }
    }, [value, isNumber, count]);

    return (
        <motion.div
          // FIX: Spread motion props to avoid TypeScript type errors.
          {...{
            custom: index,
            initial: "hidden",
            animate: "visible",
            variants: cardVariants,
          }}
          className="bg-white p-6 rounded-lg shadow-lg text-center border border-yellow-400/40"
        >
          <p className="text-4xl font-bold text-yellow-500 h-10 flex items-center justify-center">
            {isNumber ? <motion.span>{rounded}</motion.span> : value}
          </p>
          <p className="text-brand-gray mt-2">{label}</p>
        </motion.div>
    );
};

export const StatsSection = ({ stats }: StatsSectionProps) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* FIX: Replaced spread props with explicit props to resolve TypeScript error regarding the 'key' prop. */}
        {stats.map((stat, index) => <StatCard key={stat.label} label={stat.label} value={stat.value} index={index} />)}
    </div>
);