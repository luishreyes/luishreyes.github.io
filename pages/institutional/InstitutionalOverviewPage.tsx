

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';
import { useI18n } from '../../context/i18n';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion, useScroll, useTransform } from 'framer-motion';

// serviceItems defined inside component to use translations

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
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
            // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
            ease: "easeOut" as const,
        },
    },
};

export const InstitutionalOverviewPage: React.FC = () => {
  const { t } = useI18n();
  const headerRef = useRef<HTMLDivElement>(null);

  const serviceItems = [
    {
      title: t('service.leadership.title'),
      description: t('service.leadership.desc'),
      icon: (
          <img src="https://cdn-icons-png.flaticon.com/512/9942/9942521.png" alt="Service & Leadership Icon" className="h-8 w-8" />
      ),
      link: '/service/committees'
    },
    {
      title: t('service.ai.title'),
      description: t('service.ai.desc'),
      icon: (
          <img src="https://icons.veryicon.com/png/o/education-technology/alibaba-cloud-iot-business-department/ai-27.png" alt="Augmented Intelligence Icon" className="h-8 w-8" />
      ),
      link: '/service/augmented-intelligence'
    },
    {
      title: t('service.editorial.title'),
      description: t('service.editorial.desc'),
      icon: (
          <img src="https://cdn-icons-png.flaticon.com/512/4598/4598321.png" alt="Editorial Contributions Icon" className="h-8 w-8" />
      ),
      link: '/service/editorial'
    },
    {
      title: t('service.outreach.title'),
      description: t('service.outreach.desc'),
      icon: (
          <img src="https://cdn-icons-png.flaticon.com/512/2112/2112735.png" alt="Outreach Icon" className="h-8 w-8" />
      ),
      link: '/service/outreach'
    }
  ];
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start end", "end start"]
  });
  const frameRotate = useTransform(scrollYProgress, [0, 1], [1, -2]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-1, 1]);

  return (
    <PageWrapper noPadding>
      {/* Header Section */}
      <div ref={headerRef} className="relative bg-zinc-800 overflow-hidden p-6 sm:p-8">
        {/* Dephased frame */}
        <motion.div
          className="absolute inset-2 sm:inset-4 rounded-2xl border-2 border-yellow-400 pointer-events-none"
          style={{ rotate: frameRotate }}
        />

        {/* Main content with image background */}
        <motion.div
          className="relative rounded-2xl shadow-xl z-10 overflow-hidden"
          style={{ rotate: imageRotate }}
        >
          <img 
              src="https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_4560-2.jpg" 
              alt="Uniandes campus building, symbolizing the institution's commitment to service and community engagement."
              className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"></div>
          <div className="absolute inset-0 bg-zinc-900/60 mix-blend-multiply" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-48 pb-24">
              <motion.div
                  {...{
                    initial: { opacity: 0, x: -20 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.6, ease: 'easeOut' },
                  }}
                  className="text-left max-w-3xl"
              >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                      {t('service.overview.title')}
                  </h1>
                  <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                      {t('service.overview.sub')}
                  </p>
              </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Content Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
            <motion.div
              {...{
                initial: { opacity: 0, y: 20 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.5 },
              }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <p className="text-brand-gray text-lg leading-relaxed">
                {t('service.overview.text')}
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
              // FIX: Spread motion props to avoid TypeScript type errors.
              {...{
                variants: containerVariants,
                initial: "hidden",
                whileInView: "visible",
                viewport: { once: true, amount: 0.1 },
              }}
            >
              {serviceItems.map(item => (
                  <motion.div
                      key={item.title}
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{variants: itemVariants}}
                      className="h-full"
                  >
                      <Link
                          to={item.link}
                          className="bg-white p-8 rounded-lg shadow-lg border border-zinc-100 text-center flex flex-col items-center h-full w-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400"
                          aria-label={`Learn more about ${item.title}`}
                      >
                          <div className="bg-yellow-400/20 p-4 rounded-full mb-4">
                              {item.icon}
                          </div>
                          <h3 className="text-xl font-semibold text-brand-dark mb-2">{item.title}</h3>
                          <p className="text-brand-gray text-sm flex-grow">{item.description}</p>
                      </Link>
                  </motion.div>
              ))}
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};