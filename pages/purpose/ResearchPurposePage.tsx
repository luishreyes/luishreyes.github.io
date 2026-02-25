




import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';

export const ResearchPurposePage: React.FC = () => {
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
                src="https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Generales%20campus_2015_2015%20(69).jpg" 
                alt="Panoramic view of the Uniandes campus, representing the environment for research and creation"
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
                        Engineering Biology, Connecting Minds
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        My research purpose is to engineer living systems at the convergence of biotechnology, nanotechnology, and artificial intelligence, creating solutions through collaborative networks that multiply our individual capabilities.
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
                <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">My Research Purpose</h2>
                <div className="space-y-6 text-lg text-brand-gray leading-relaxed">
                    <p>
                        I pursue research because I believe the convergence of engineering and biology can solve humanity’s most pressing challenges. My purpose is to apply engineering principles to design, build, and optimize biological systems that address critical needs across medicine, sustainability, and human experience. But more fundamentally, I research to be a connector node in networks of discovery, recognizing that complex solutions emerge through collaboration, not isolation.
                    </p>
                    <p>
                        My research journey crystallized through experiencing both industry and academia firsthand. After my internship at Ecopetrol, I did another at Texas A&amp;M University. Both presented important challenges, but the contrast revealed what truly drives me. The intellectual challenge academia offered was intriguing in a way that reshapes how you see the world: where questions generate more questions, where discovery never ends, where each answer opens ten new mysteries. This wasn’t about one path being superior; it was about recognizing which type of challenge makes me come alive. Professor Katy Kao, my PhD advisor, then taught me that beyond technical excellence, what truly matters is trusting people, delegating effectively, and recognizing that the person in front of you matters as a whole human being, not just as a student or researcher. Their success becomes your success.
                    </p>
                    <p>
                        I approach research through the same vectorial philosophy that guides my teaching. Every collaborator arrives as a vector with their own magnitude, direction, and sense. My role isn’t to redirect them toward my agenda but to find alignment where our vectors sum to maximum impact. When a molecular biology expert partners with specialists in lysosomal diseases and nanoparticle chemistry, gene therapies emerge that win awards and spawn startups. When food design expertise meets computing engineers and sonic seasoning researchers, we create strategies that nudge consumers toward sustainable choices. When microbiologists bring deep mechanistic understanding and bioprocess engineers bring optimization expertise, our vectors add constructively to transform waste into value. This interdisciplinary mindset drives everything I do: engineering microbes as microscopic factories, designing multisensory experiences that shape human behavior, using AI to accelerate biological design, and reverse engineering nature’s evolutionary solutions.
                    </p>
                    <p>
                        Real innovation happens at interfaces, in conversations, through networks. I believe that many people who know is better than any single expert. I don’t aspire to be the most renowned specialist; I aspire to be a connector node in a vast network of discovery. This isn’t just philosophy; it’s strategy.
                    </p>
                    <p>
                        What drives me is the transformative potential of our work: a gene therapy bringing hope to families facing rare diseases, a sustainable bioprocess eliminating industrial waste, or a multisensory design promoting healthier choices. Each publication represents more than a CV line; it’s knowledge socialized, a contribution to our collective understanding. I embrace being a “social animal” in research because I know that solutions to complex challenges emerge from networks, not isolation. I invest in training students who become nodes in their own networks, extending our impact far beyond any single laboratory.
                    </p>
                    <p>
                        The laboratory becomes a space where biological systems meet engineering principles, where evolution inspires design, where diverse expertise converges into innovation. Research isn’t about claiming territory; it’s about expanding frontiers through connection, adaptation, and purposeful alignment of our collective vectors toward solutions that matter.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};