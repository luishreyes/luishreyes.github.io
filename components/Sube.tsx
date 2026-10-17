import React from 'react';
import { motion } from 'framer-motion';

export const SALE: [number, number, number, number] = [0.22, 0.8, 0.3, 1];

/** Entrada de un bloque: sube 22 px con opacidad, una sola vez, al asomar en pantalla.
 *  La misma del landing de POU 2027-10. Framer respeta prefers-reduced-motion
 *  con MotionConfig; el contenido nunca queda oculto si no hay script. */
export const Sube: React.FC<{ children: React.ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }> = ({
  children,
  delay = 0,
  className,
  as = 'div',
}) => {
  const Tag = as === 'li' ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.62, ease: SALE, delay }}
    >
      {children}
    </Tag>
  );
};
