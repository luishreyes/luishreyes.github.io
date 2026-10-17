import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useI18n } from '../context/i18n';
import { SALE } from './Sube';

interface AperturaProps {
  /** Número de la sección en el portafolio («02»). */
  numero: string;
  /** Palabra de apertura, en minúscula; el punto amarillo lo pone el componente. */
  palabra: string;
  entrada?: string;
  foto: { src: string; alt: string; posicion?: string };
  accion?: { to: string; label: string };
}

/** Apertura de sección, como las del dossier: la foto en blanco y negro a sangre y,
 *  en el panel de tinta, el número enorme tono sobre tono, el rótulo «sección» y la
 *  palabra de apertura con su punto amarillo. */
export const Apertura: React.FC<AperturaProps> = ({ numero, palabra, entrada, foto, accion }) => {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // La foto se acerca despacio mientras la página sube.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const escala = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <section ref={ref} className="a-oscuro pt-16">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:min-h-[calc(100svh-4rem)]">
        <div className="relative overflow-hidden h-[44svh] min-h-[260px] lg:h-auto">
          <motion.img
            src={foto.src}
            alt={foto.alt}
            className="a-foto a-bn"
            style={{ objectPosition: foto.posicion ?? 'center', ...(reduce ? {} : { scale: escala }) }}
          />
        </div>
        <div className="a-c a-c-der flex flex-col justify-between gap-10 py-12 lg:py-16">
          <motion.p
            className="a-numero"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1, ease: SALE }}
          >
            {numero}
          </motion.p>
          <div>
            <div className="border-t border-tinta-600 pt-4">
              <span className="a-ceja">{numero} · {t('common.section')}</span>
            </div>
            <motion.h1
              className="a-marca mt-6"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: SALE }}
            >
              {palabra}<span className="a-punto">.</span>
            </motion.h1>
            {entrada && (
              <motion.p
                className="a-entrada mt-6 max-w-[34ch]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: SALE, delay: 0.12 }}
              >
                {entrada}
              </motion.p>
            )}
            {accion && (
              <motion.div
                className="mt-9"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: SALE, delay: 0.22 }}
              >
                <Link to={accion.to} className="a-boton">
                  {accion.label} <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/** Cabecera de un bloque de lectura: el rótulo de sección y el título con punto sobre su filete. */
export const Cabecera: React.FC<{ ceja: string; titulo: string; className?: string }> = ({ ceja, titulo, className = '' }) => (
  <header className={className}>
    <span className="a-ceja">{ceja}</span>
    <h2 className="a-titulo con-filete mt-3">{titulo}.</h2>
  </header>
);
