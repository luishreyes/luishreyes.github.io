




import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';
import { useI18n } from '../../context/i18n';

export const TeachingPurposePage: React.FC = () => {
  const { t } = useI18n();
  return (
    <PageWrapper noPadding>
      {/* Header Section */}
      <div className="relative bg-zinc-800 overflow-hidden p-6 sm:p-8">
          {/* Dephased frame */}
          <motion.div
            className="absolute inset-2 sm:inset-4 rounded-2xl border-2 border-yellow-400 pointer-events-none"
          />

          {/* Main content with image background */}
          <motion.div
            className="relative rounded-2xl shadow-xl z-10 overflow-hidden"
          >
            <img 
                src="https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Campus_mision-historia-y-simbolos_0.webp" 
                alt="A modern classroom with flexible seating arrangements, representing active learning."
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
                        {t('purpose.teaching.title')}
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        {t('purpose.teaching.sub')}
                    </p>
                </motion.div>
            </div>
        </motion.div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
            <motion.div
                // FIX: Spread motion props to avoid TypeScript type errors.
                {...{
                  initial: { opacity: 0, y: 30 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, ease: 'easeOut' },
                }}
                className="text-left"
            >
                <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">{t('purpose.teaching.h2')}</h2>
                <div className="space-y-6 text-lg text-brand-gray leading-relaxed">
                    <p>{t('purpose.teaching.p1')}</p>
                    <p>{t('purpose.teaching.p2')}</p>
                    <p>{t('purpose.teaching.p3')}</p>
                    <p>{t('purpose.teaching.p4')}</p>
                    <p>{t('purpose.teaching.p5')}</p>
                    <p>{t('purpose.teaching.p6')}</p>
                    <p>{t('purpose.teaching.p7')}</p>
                    <p>{t('purpose.teaching.p8')}</p>
                </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};