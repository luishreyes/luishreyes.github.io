


import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
interface PageWrapperProps {
  title?: string;
  // FIX: Made children optional to resolve multiple TypeScript errors where it was incorrectly flagged as missing.
  children?: React.ReactNode;
  maxWidth?: 'max-w-4xl' | 'max-w-5xl' | 'max-w-7xl';
  imageShouldRotate?: boolean;
  noPadding?: boolean;
  bannerUrl?: string;
  bannerAlt?: string;
  scrollToTop?: boolean;
}

export const PageWrapper = ({ title, children, maxWidth = 'max-w-7xl', imageShouldRotate = false, noPadding = false, bannerUrl, bannerAlt = "Decorative banner image", scrollToTop = true }: PageWrapperProps) => {

  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [scrollToTop]);
  
  return (
    <motion.div
      // FIX: Spread motion props to avoid TypeScript type errors.
      {...{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.5 },
      }}
    >
      {title && bannerUrl && (
        <div className="relative bg-zinc-100 pt-28 pb-12 sm:pt-32 sm:pb-16 overflow-hidden">
            <img 
                src={bannerUrl}
                alt={bannerAlt}
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={imageShouldRotate ? { transform: 'rotate(90deg) scale(3.5)' } : {}}
            />
            <div className="absolute inset-0 bg-zinc-900/40 mix-blend-multiply" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h1 
                    // FIX: Spread motion props to avoid TypeScript type errors.
                    {...{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5, delay: 0.2 },
                    }}
                    className="text-4xl sm:text-5xl font-bold tracking-tight text-white text-left [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  {title}
                </motion.h1>
            </div>
        </div>
      )}
      {noPadding ? (
        children
      ) : (
        <div className={`${maxWidth} mx-auto ${title ? 'py-16' : 'pt-32 pb-16'} px-4 sm:px-6 lg:px-8`}>
          {children}
        </div>
      )}
    </motion.div>
  );
};