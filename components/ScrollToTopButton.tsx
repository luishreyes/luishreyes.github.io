

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/** Aparece cuando el lector vuelve a subir, no mientras lee hacia abajo: así nunca
 *  tapa el texto que se está leyendo, sobre todo en el teléfono. */
export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ultimoY = useRef(0);

  const toggleVisibility = () => {
    const y = window.scrollY;
    const subiendo = y < ultimoY.current - 4;
    const bajando = y > ultimoY.current + 4;
    if (y < 600 || bajando) setIsVisible(false);
    else if (subiendo) setIsVisible(true);
    if (subiendo || bajando) ultimoY.current = y;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          // FIX: Spread motion props to avoid TypeScript type errors.
          {...{
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
            transition: { duration: 0.2, ease: 'easeOut' },
          }}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-tinta-900 text-papel-0 p-3 border border-tinta-600 hover:bg-tinta-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-tinta-900 transition-colors duration-200 z-40"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};