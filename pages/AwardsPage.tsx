


import React, { useRef } from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { awardsData } from '../components/data/awards';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion, useScroll, useTransform } from 'framer-motion';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
            ease: "easeOut" as const,
        },
    },
};


// FIX: Changed component to React.FC to resolve TypeScript error with the 'key' prop.
const RecognitionCard: React.FC<{ recognition: typeof awardsData[0] }> = ({ recognition }) => {
    const imageContainerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: imageContainerRef,
        offset: ['start end', 'end start']
    });

    const frameRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
    const imageRotate = useTransform(scrollYProgress, [0, 1], [2, -2]);
    const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1]);

    return (
        <motion.div 
            {...{variants: itemVariants}}
            className="bg-white rounded-xl shadow-lg border border-yellow-400/40 overflow-hidden"
        >
            <div className="md:flex md:items-center">
                <div className="w-full md:w-56 flex justify-center p-6 md:flex-shrink-0">
                    <div ref={imageContainerRef} className="relative w-40 h-40">
                        {/* Dephased frame */}
                        <motion.div
                            className="absolute top-2 right-[-6px] bottom-[-6px] left-2 rounded-2xl border-2 border-yellow-400"
                            style={{ rotate: frameRotate }}
                        />

                        {/* Main image */}
                        <motion.div
                            className="relative w-full h-full rounded-2xl shadow-xl z-10 overflow-hidden"
                            style={{ rotate: imageRotate, scale: imageScale }}
                        >
                            <img
                                className="w-full h-full object-contain object-center p-4"
                                src={recognition.imageUrl}
                                alt={`Icon for ${recognition.title}`}
                            />
                            <div className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"></div>
                        </motion.div>
                    </div>
                </div>
                <div className="p-8 pt-0 md:pt-8 md:pl-0 flex-grow flex flex-col justify-between">
                    <div>
                        <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-2">
                            <h2 className="text-2xl font-bold text-brand-dark leading-tight">{recognition.title}</h2>
                            <span className="text-sm font-semibold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0">{recognition.year}</span>
                        </div>
                        <p className="block text-sm font-semibold text-yellow-500 uppercase tracking-wide">{recognition.awarder} - {recognition.category}</p>
                        
                        <p className="mt-4 text-brand-dark italic font-medium">Work: "{recognition.projectTitle}"</p>
                        
                        <p className="mt-2 text-sm text-brand-gray">
                            Authors: {recognition.authors.map((author, i) => (
                                <React.Fragment key={i}>
                                    {author.includes('Reyes') ? <strong className="font-semibold text-brand-dark">{author}</strong> : author}
                                    {i < recognition.authors.length - 1 ? ', ' : ''}
                                </React.Fragment>
                            ))}
                        </p>

                        <div className="mt-4 space-y-3 text-brand-gray text-base">
                            {recognition.summary.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6">
                        <a 
                            href={recognition.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-yellow-400 text-brand-dark font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 text-sm"
                        >
                            Learn More
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const AwardsPage = () => {
    const headerRef = useRef<HTMLDivElement>(null);
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
                  src="https://pbs.twimg.com/media/DWKm7gvXcAIISbY?format=jpg&name=4096x4096" 
                  alt="A close-up of an elegant award, symbolizing recognition and achievement"
                  className="absolute inset-0 w-full h-full object-cover object-top"
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
                          Recognition & Honors
                      </h1>
                      <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                          Highlighting recognitions for significant contributions to science, education, and engineering from esteemed international and national bodies.
                      </p>
                  </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Content Section */}
          <div className="bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                <motion.div 
                    className="space-y-12"
                    // FIX: Spread motion props to avoid TypeScript type errors.
                    {...{
                        variants: containerVariants,
                        initial: "hidden",
                        animate: "visible",
                    }}
                >
                    {awardsData.map((award, index) => (
                        <RecognitionCard key={index} recognition={award} />
                    ))}
                </motion.div>
            </div>
          </div>
        </PageWrapper>
    );
};