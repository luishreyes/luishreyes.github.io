
import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

interface CitationCounterProps {
  countValue: number | null;
  isLoading: boolean;
}

export const CitationCounter = ({ countValue, isLoading }: CitationCounterProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest as number));

  const hasValue = countValue !== null;

  useEffect(() => {
    if (hasValue) {
      const animation = animate(count, countValue, {
        duration: 1.5,
        ease: "easeOut",
      });
      return () => animation.stop();
    }
  }, [countValue, hasValue, count]);

  // If we have a value, display it, even if global loading is still in progress.
  if (hasValue) {
    return <motion.span className="font-bold text-brand-dark">{rounded}</motion.span>;
  }

  // If we don't have a value yet and we are still in the global loading phase, show a skeleton.
  if (isLoading) {
    return <div className="h-5 w-16 bg-zinc-200 rounded animate-pulse"></div>;
  }

  // If we don't have a value and we are NOT loading anymore, it's not available.
  return <span className="text-brand-gray">N/A</span>;
};
