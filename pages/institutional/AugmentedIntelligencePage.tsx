import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion } from 'framer-motion';
import { useI18n } from '../../context/i18n';

const cardVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
    transition: { type: "spring" as const, bounce: 0.4, duration: 0.8 }
  }
};

const timelineItemVariants = {
  offscreen: { x: -30, opacity: 0 },
  onscreen: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5, 
      // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
      ease: 'easeOut' as const
    }
  }
};

// FIX: Made children optional to fix TypeScript errors.
const Section = ({ title, children, bg = 'bg-zinc-50' }: { title: string; children?: React.ReactNode; bg?: string }) => (
  <motion.div 
    // FIX: Spread motion props to avoid TypeScript type errors.
    {...{
        initial: "offscreen",
        whileInView: "onscreen",
        viewport: { once: true, amount: 0.1 },
        variants: { onscreen: { transition: { staggerChildren: 0.2 } } },
    }}
    className={`py-16 ${bg} -mx-4 -mb-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mt-16`}
  >
    <div className="max-w-4xl mx-auto">
      <motion.h2 {...{variants: cardVariants}} className="text-3xl font-bold tracking-tight text-brand-dark text-left">{title}</motion.h2>
      <div className="mt-12">{children}</div>
    </div>
  </motion.div>
);

const IconListItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
    <motion.li {...{variants: cardVariants}} className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1 bg-yellow-400/20 p-2 rounded-full">
            {icon}
        </div>
        <div>{children}</div>
    </motion.li>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export const AugmentedIntelligencePage: React.FC = () => {
  const { t } = useI18n();
  return (
    <PageWrapper noPadding>
      <div className="pt-16">
        <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">{t('ai.title')}</h1>
                <p className="mt-4 text-brand-gray leading-relaxed">
                    {t('ai.sub')}
                </p>
            </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Executive Summary */}
            <motion.div 
                // FIX: Spread motion props to avoid TypeScript type errors.
                {...{
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.5, delay: 0.1 }
                }}
            >
                <h2 className="text-2xl font-semibold tracking-tight text-brand-dark mt-8">{t('ai.transforming')}</h2>
                <p className="mt-6 text-lg text-brand-gray leading-relaxed">
                    {t('ai.summary.pre')}<strong>Augmented Intelligence Uniandes</strong>{t('ai.summary.post')}
                </p>
            </motion.div>
            
            <Section title={t('ai.myRole')} bg="bg-transparent">
                 <motion.div 
                    // FIX: Spread motion props to avoid TypeScript type errors.
                    {...{
                        initial: "offscreen",
                        whileInView: "onscreen",
                        viewport: { once: true, amount: 0.2 },
                        variants: { onscreen: { transition: { staggerChildren: 0.1 } } },
                    }}
                    className="grid md:grid-cols-2 gap-12"
                 >
                    <motion.div {...{variants: cardVariants}}>
                        <h3 className="text-2xl font-semibold text-brand-dark mb-4">{t('ai.leadership')}</h3>
                        <ul className="space-y-3 text-brand-gray">
                            <li><strong>{t('ai.lead.1.strong')}</strong>{t('ai.lead.1.text')}</li>
                            <li><strong>{t('ai.lead.2.strong')}</strong>{t('ai.lead.2.text')}</li>
                            <li><strong>{t('ai.lead.3.strong')}</strong>{t('ai.lead.3.text')}</li>
                            <li><strong>{t('ai.lead.4.strong')}</strong>{t('ai.lead.4.text')}</li>
                        </ul>
                    </motion.div>
                    <motion.div {...{variants: cardVariants}}>
                        <h3 className="text-2xl font-semibold text-brand-dark mb-4">{t('ai.management')}</h3>
                        <ul className="space-y-3 text-brand-gray">
                            <li>{t('ai.mgmt.1')}</li>
                            <li>{t('ai.mgmt.2')}</li>
                            <li>{t('ai.mgmt.3')}</li>
                        </ul>
                    </motion.div>
                 </motion.div>
            </Section>

            <Section title={t('ai.impact')}>
                <motion.div {...{variants: cardVariants}}>
                    <h3 className="text-2xl font-semibold text-brand-dark text-left mb-6">{t('ai.call.title')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-400/40">
                            <p className="text-4xl font-bold text-yellow-400">30</p>
                            <p className="text-brand-gray">{t('ai.impact.projects')}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-400/40">
                            <p className="text-4xl font-bold text-yellow-400">20</p>
                            <p className="text-brand-gray">{t('ai.impact.selected')}</p>
                        </div>
                    </div>
                    <p className="text-center mt-6 text-brand-gray">{t('ai.impact.all')} <strong>{t('ai.impact.all2')}</strong></p>
                </motion.div>
                
                <motion.div {...{variants: cardVariants}} className="mt-12">
                     <h3 className="text-2xl font-semibold text-brand-dark text-left mb-6">{t('ai.categories')}</h3>
                     <div className="grid sm:grid-cols-3 gap-6 text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-400/40">
                            <p className="font-bold text-brand-dark">{t('ai.cat.optimization')}</p>
                            <p className="text-sm text-brand-gray">(15 {t('ai.cat.projects')})</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-400/40">
                            <p className="font-bold text-brand-dark">{t('ai.cat.learning')}</p>
                            <p className="text-sm text-brand-gray">(11 {t('ai.cat.projects')})</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-400/40">
                           <p className="font-bold text-brand-dark">{t('ai.cat.skills')}</p>
                           <p className="text-sm text-brand-gray">(4 {t('ai.cat.projects')})</p>
                        </div>
                     </div>
                </motion.div>
            </Section>

            <Section title={t('ai.global')} bg="bg-transparent">
                 <motion.div {...{variants: cardVariants}}>
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-yellow-400/40 flex flex-col items-start gap-6">
                        <div className="flex items-center gap-4 w-full">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1200px-OpenAI_Logo.svg.png" alt="OpenAI Logo" className="h-12 w-auto object-contain flex-shrink-0" />
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold text-brand-dark">{t('ai.openai')}</h3>
                            </div>
                        </div>
                        <p className="text-brand-gray">
                            {t('ai.openai.text')}
                        </p>

                        <div className="w-full aspect-video rounded-lg overflow-hidden mt-2 shadow-inner border border-zinc-200">
                            <iframe
                                src="https://player.vimeo.com/video/1111471808?title=0&byline=0&portrait=0"
                                className="w-full h-full"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                                title="Engineering a better way to teach with generative AI"
                            ></iframe>
                        </div>

                        <div className="mt-2 self-start">
                            <Link
                                to="/recognition"
                                className="text-yellow-500 font-medium hover:underline hover:text-yellow-400 transition-colors"
                            >
                                {t('ai.recognition.link')}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </Section>

            <Section title={t('ai.pedagogical')} bg="bg-transparent">
                 <motion.div {...{variants: cardVariants}}>
                    <h3 className="text-2xl font-semibold text-brand-dark mb-4">{t('ai.framework')}</h3>
                    <blockquote className="mt-4 p-6 bg-zinc-100 border-l-4 border-yellow-400 rounded-r-lg italic text-brand-dark text-lg">
                        {t('ai.framework.quote')}
                    </blockquote>
                 </motion.div>
                 <motion.div {...{variants: cardVariants}} className="mt-12">
                     <h3 className="text-2xl font-semibold text-brand-dark mb-6">{t('ai.principles')}</h3>
                     <ol className="space-y-3 text-brand-gray list-decimal list-inside">
                        <li><strong>{t('ai.prin.1.strong')}</strong>{t('ai.prin.1.text')}</li>
                        <li><strong>{t('ai.prin.2.strong')}</strong>{t('ai.prin.2.text')}</li>
                        <li><strong>{t('ai.prin.3.strong')}</strong>{t('ai.prin.3.text')}</li>
                        <li><strong>{t('ai.prin.4.strong')}</strong>{t('ai.prin.4.text')}</li>
                     </ol>
                 </motion.div>
            </Section>

            <Section title={t('ai.implementation')}>
                 <motion.div 
                    // FIX: Spread motion props to avoid TypeScript type errors.
                    {...{
                        initial: "offscreen",
                        whileInView: "onscreen",
                        viewport: { once: true, amount: 0.1 },
                        variants: { onscreen: { transition: { staggerChildren: 0.2 } } },
                    }}
                    className="relative border-l-2 border-zinc-200"
                 >
                    <motion.div {...{variants: timelineItemVariants}} className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                        <p className="font-bold text-lg text-brand-dark">{t('ai.stage1.title')} <span className="text-sm font-normal text-brand-gray">{t('ai.stage1.date')}</span></p>
                        <ul className="list-disc list-inside mt-2 text-brand-gray">
                            <li>{t('ai.stage1.1')}</li>
                            <li>{t('ai.stage1.2')}</li>
                            <li>{t('ai.stage1.3')}</li>
                        </ul>
                    </motion.div>
                    <motion.div {...{variants: timelineItemVariants}} className="relative pl-8 pb-8">
                         <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                        <p className="font-bold text-lg text-brand-dark">{t('ai.stage2.title')} <span className="text-sm font-normal text-brand-gray">{t('ai.stage2.date')}</span></p>
                        <ul className="list-disc list-inside mt-2 text-brand-gray">
                            <li>{t('ai.stage2.1')}</li>
                            <li>{t('ai.stage2.2')}</li>
                            <li>{t('ai.stage2.3')}</li>
                        </ul>
                    </motion.div>
                     <motion.div {...{variants: timelineItemVariants}} className="relative pl-8">
                         <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                        <p className="font-bold text-lg text-brand-dark">{t('ai.stage3.title')} <span className="text-sm font-normal text-brand-gray">{t('ai.stage3.date')}</span></p>
                         <ul className="list-disc list-inside mt-2 text-brand-gray">
                            <li>{t('ai.stage3.1')}</li>
                            <li>{t('ai.stage3.2')}</li>
                            <li>{t('ai.stage3.3')}</li>
                        </ul>
                    </motion.div>
                 </motion.div>
            </Section>

            {/* FIX: Completed the truncated Section component, added children to resolve the missing prop error, and added necessary closing tags. */}
            <Section title={t('ai.projection')} bg="bg-zinc-50">
                 <motion.div 
                    {...{
                        initial: "offscreen",
                        whileInView: "onscreen",
                        viewport: { once: true, amount: 0.1 },
                        variants: cardVariants,
                    }}
                 >
                    <h3 className="text-2xl font-semibold text-brand-dark mb-4">{t('ai.futureVision')}</h3>
                    <p className="text-brand-gray leading-relaxed">
                        {t('ai.futureVision.text')}
                    </p>
                 </motion.div>
            </Section>
        </div>
      </div>
    </PageWrapper>
  );
};