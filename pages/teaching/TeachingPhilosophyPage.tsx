





import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';
import { useI18n } from '../../context/i18n';

const frameworkItems = [
    {
        titleKey: "philosophy.fw1.title",
        icon: "https://png.pngtree.com/png-clipart/20230429/original/pngtree-scaffolding-line-icon-png-image_9119622.png",
        descriptionKey: "philosophy.fw1.desc"
    },
    {
        titleKey: "philosophy.fw2.title",
        icon: "https://www.svgrepo.com/show/335231/infinity.svg",
        descriptionKey: "philosophy.fw2.desc"
    },
    {
        titleKey: "philosophy.fw3.title",
        icon: "https://icons.veryicon.com/png/o/miscellaneous/xdh-font-graphics-library/direction-17.png",
        descriptionKey: "philosophy.fw3.desc"
    }
] as const;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};


export const TeachingPhilosophyPage = () => {
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
                src="/images/uniandes-bw.jpg"
                alt="Universidad de los Andes campus building"
                className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Image is already B&W, no saturation filter needed */}
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
                        {t('philosophy.title')}
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        {t('philosophy.sub')}
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
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5 },
                }}
                className="text-left space-y-12 text-lg text-brand-gray leading-relaxed"
            >
                <div>
                    <p className="mb-10">{t('philosophy.intro')}</p>
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-8">{t('philosophy.framework')}</h3>
                    <motion.div 
                        className="mt-8 flex flex-col gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {frameworkItems.map(item => (
                            <motion.div
                                key={item.titleKey}
                                variants={itemVariants}
                                className="flex flex-col md:flex-row items-start text-left p-8 bg-zinc-50 rounded-lg border border-zinc-200 transition-shadow hover:shadow-lg gap-6"
                            >
                                <div className="flex-shrink-0 bg-yellow-400/20 p-4 rounded-full">
                                    <img src={item.icon} alt={`${t(item.titleKey)} icon`} className="h-10 w-10 object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-brand-dark mb-2">{t(item.titleKey)}</h4>
                                    <p className="text-brand-gray text-base leading-relaxed">{t(item.descriptionKey)}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div>
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">{t('philosophy.equity')}</h3>
                    <p>{t('philosophy.equity.p')}</p>
                </div>

                <div className="mt-12 bg-white rounded-lg shadow-xl border border-yellow-400/40 p-8 md:p-12">
                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark mb-8 text-center">{t('philosophy.practices')}</h2>
                    <ol className="space-y-8 text-lg text-brand-gray leading-relaxed list-decimal list-outside ml-5">
                        <li><strong>{t('philosophy.practice1.bold')}</strong>{t('philosophy.practice1.text')}</li>
                        <li><strong>{t('philosophy.practice2.bold')}</strong>{t('philosophy.practice2.text')}</li>
                        <li><strong>{t('philosophy.practice3.bold')}</strong>{t('philosophy.practice3.text')}</li>
                        <li><strong>{t('philosophy.practice4.bold')}</strong>{t('philosophy.practice4.text')}</li>
                        <li><strong>{t('philosophy.practice5.bold')}</strong>{t('philosophy.practice5.text')}</li>
                    </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mt-16">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">{t('philosophy.stoic')}</h3>
                        <p>{t('philosophy.stoic.p')}</p>
                    </div>
                     <div>
                        <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">{t('philosophy.inPractice')}</h3>
                        <ul className="space-y-4 text-lg text-brand-gray leading-relaxed list-disc list-outside ml-5">
                            <li><strong>{t('philosophy.inPractice.assessment.bold')}</strong>{t('philosophy.inPractice.assessment.text')}</li>
                            <li><strong>{t('philosophy.inPractice.content.bold')}</strong>{t('philosophy.inPractice.content.text')}</li>
                            <li><strong>{t('philosophy.inPractice.feedback.bold')}</strong>{t('philosophy.inPractice.feedback.text')}</li>
                            <li><strong>{t('philosophy.inPractice.tracking.bold')}</strong>{t('philosophy.inPractice.tracking.text')}</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-zinc-100 border-l-4 border-yellow-400 rounded-r-lg">
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">{t('philosophy.transformation')}</h3>
                    <p>{t('philosophy.transformation.p1')}</p>
                    <p className="mt-4 font-semibold text-brand-dark">{t('philosophy.transformation.p2')}</p>
                </div>
              </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};