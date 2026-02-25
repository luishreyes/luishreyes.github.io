import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion } from 'framer-motion';

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

interface AugmentedIntelligencePageProps {
  setCurrentPage?: (page: string) => void;
}

export const AugmentedIntelligencePage: React.FC<AugmentedIntelligencePageProps> = ({ setCurrentPage }) => {
  return (
    <PageWrapper noPadding>
      <div className="pt-16">
        <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Augmented Intelligence Uniandes</h1>
                <p className="mt-4 text-brand-gray leading-relaxed">
                    A pioneering initiative to transform engineering education by strategically integrating Generative AI, co-founded and co-designed to amplify human intelligence.
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
                <h2 className="text-2xl font-semibold tracking-tight text-brand-dark mt-8">Transforming Engineering Education with AI</h2>
                <p className="mt-6 text-lg text-brand-gray leading-relaxed">
                    As a co-founder of the <strong>Augmented Intelligence Uniandes</strong> initiative, alongside Dean Rubby Casallas and Professor Juan Carlos Cruz, I have actively participated in the strategic integration of Generative Artificial Intelligence in the School of Engineering at Universidad de los Andes. This pioneering initiative, launched in June 2024, represents a paradigm shift in how we conceive teaching and learning in engineering.
                </p>
            </motion.div>
            
            <Section title="My Role and Contribution" bg="bg-transparent">
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
                        <h3 className="text-2xl font-semibold text-brand-dark mb-4">Leadership and Conceptual Design</h3>
                        <ul className="space-y-3 text-brand-gray">
                            <li><strong>Co-creator</strong> of the Augmented Intelligence strategy.</li>
                            <li><strong>Co-designer</strong> of the "augmented intelligence" conceptual framework.</li>
                            <li><strong>Coordinator</strong> of the IAU team of students and graduate assistants.</li>
                            <li><strong>Co-designer of workshops</strong> for training in generative AI.</li>
                        </ul>
                    </motion.div>
                    <motion.div {...{variants: cardVariants}}>
                        <h3 className="text-2xl font-semibold text-brand-dark mb-4">Management and Implementation</h3>
                        <ul className="space-y-3 text-brand-gray">
                            <li>Operational coordination of the multidisciplinary team.</li>
                            <li>Co-development of the three-phase training program.</li>
                            <li>Support in the management and monitoring of selected projects.</li>
                        </ul>
                    </motion.div>
                 </motion.div>
            </Section>

            <Section title="Impact and Results">
                <motion.div {...{variants: cardVariants}}>
                    <h3 className="text-2xl font-semibold text-brand-dark text-left mb-6">First IAGen Call 2025-1: A Resounding Success</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-400/40">
                            <p className="text-4xl font-bold text-yellow-400">30</p>
                            <p className="text-brand-gray">projects submitted</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-yellow-400/40">
                            <p className="text-4xl font-bold text-yellow-400">20</p>
                            <p className="text-brand-gray">projects selected</p>
                        </div>
                    </div>
                    <p className="text-center mt-6 text-brand-gray">The call achieved participation from <strong>all departments</strong> of the School.</p>
                </motion.div>
                
                <motion.div {...{variants: cardVariants}} className="mt-12">
                     <h3 className="text-2xl font-semibold text-brand-dark text-left mb-6">Innovation Categories Developed</h3>
                     <div className="grid sm:grid-cols-3 gap-6 text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-400/40">
                            <p className="font-bold text-brand-dark">Process Optimization</p>
                            <p className="text-sm text-brand-gray">(15 projects)</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-400/40">
                            <p className="font-bold text-brand-dark">Contribution to Learning</p>
                            <p className="text-sm text-brand-gray">(11 projects)</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-yellow-400/40">
                           <p className="font-bold text-brand-dark">Skills Enhancement</p>
                           <p className="text-sm text-brand-gray">(4 projects)</p>
                        </div>
                     </div>
                </motion.div>
            </Section>

            <Section title="Global Recognition" bg="bg-transparent">
                 <motion.div {...{variants: cardVariants}}>
                    <div className="bg-white p-8 rounded-lg shadow-lg border border-yellow-400/40 flex flex-col items-start gap-6">
                        <div className="flex items-center gap-4 w-full">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/OpenAI_Logo.svg/1200px-OpenAI_Logo.svg.png" alt="OpenAI Logo" className="h-12 w-auto object-contain flex-shrink-0" />
                            <div className="flex-grow">
                                <h3 className="text-xl font-semibold text-brand-dark">Selected for OpenAI's Global Faculty AI Project</h3>
                            </div>
                        </div>
                        <p className="text-brand-gray">
                            In 2025, my work on AI in engineering education was recognized through selection into OpenAI's inaugural Global Faculty AI Project. This distinction, awarded to only 50 academics worldwide, validates our approach at Uniandes and connects our local initiative to a global network of innovators, further amplifying our impact.
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

                        {setCurrentPage && (
                            <div className="mt-2 self-start">
                                <button
                                    onClick={() => setCurrentPage('recognition')}
                                    className="text-yellow-500 font-medium hover:underline hover:text-yellow-400 transition-colors"
                                >
                                    See the recognition details &rarr;
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </Section>

            <Section title="Pedagogical and Technological Innovation" bg="bg-transparent">
                 <motion.div {...{variants: cardVariants}}>
                    <h3 className="text-2xl font-semibold text-brand-dark mb-4">Conceptual Framework: Augmented Intelligence</h3>
                    <blockquote className="mt-4 p-6 bg-zinc-100 border-l-4 border-yellow-400 rounded-r-lg italic text-brand-dark text-lg">
                        "Augmented Intelligence does not seek to replace human intelligence, but to amplify it, enabling students, teachers, and researchers to address complex problems, generate innovative ideas, and develop creative solutions more effectively."
                    </blockquote>
                 </motion.div>
                 <motion.div {...{variants: cardVariants}} className="mt-12">
                     <h3 className="text-2xl font-semibold text-brand-dark mb-6">Guiding Principles Implemented</h3>
                     <ol className="space-y-3 text-brand-gray list-decimal list-inside">
                        <li><strong>Disciplinary Contextualization:</strong> Each solution is aligned with the specific needs of the course.</li>
                        <li><strong>Restricted to Course Material:</strong> Assistants operate within defined pedagogical limits.</li>
                        <li><strong>Pre-established Parameters:</strong> Full instructor control over the system's behavior.</li>
                        <li><strong>Ethics and Responsibility:</strong> Strict adherence to institutional AI guidelines.</li>
                     </ol>
                 </motion.div>
            </Section>

            <Section title="Implementation Process">
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
                        <p className="font-bold text-lg text-brand-dark">Stage 1: Expression of Interest <span className="text-sm font-normal text-brand-gray">(February 2025)</span></p>
                        <ul className="list-disc list-inside mt-2 text-brand-gray">
                            <li>Reception and categorization of 30 proposals.</li>
                            <li>Organization of focus meetings.</li>
                            <li>Technical feasibility assessment.</li>
                        </ul>
                    </motion.div>
                    <motion.div {...{variants: timelineItemVariants}} className="relative pl-8 pb-8">
                         <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                        <p className="font-bold text-lg text-brand-dark">Stage 2: Project Definition <span className="text-sm font-normal text-brand-gray">(March 2025)</span></p>
                        <ul className="list-disc list-inside mt-2 text-brand-gray">
                            <li>Individual meetings with each project.</li>
                            <li>Definition of scopes and resources.</li>
                            <li>Assignment of IAU team students.</li>
                        </ul>
                    </motion.div>
                     <motion.div {...{variants: timelineItemVariants}} className="relative pl-8">
                         <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                        <p className="font-bold text-lg text-brand-dark">Stage 3: Development and Implementation <span className="text-sm font-normal text-brand-gray">(April 2025 - Present)</span></p>
                         <ul className="list-disc list-inside mt-2 text-brand-gray">
                            <li>Weekly progress monitoring.</li>
                            <li>Resolution of technical challenges.</li>
                            <li>Documentation of best practices.</li>
                        </ul>
                    </motion.div>
                 </motion.div>
            </Section>

            {/* FIX: Completed the truncated Section component, added children to resolve the missing prop error, and added necessary closing tags. */}
            <Section title="Projection and Sustainability" bg="bg-zinc-50">
                 <motion.div 
                    {...{
                        initial: "offscreen",
                        whileInView: "onscreen",
                        viewport: { once: true, amount: 0.1 },
                        variants: cardVariants,
                    }}
                 >
                    <h3 className="text-2xl font-semibold text-brand-dark mb-4">Future Vision</h3>
                    <p className="text-brand-gray leading-relaxed">
                        The Augmented Intelligence Uniandes initiative is designed to be a sustainable and evolving program. Our vision is to establish a permanent center of excellence for AI in education, continuously exploring new pedagogical models and technologies. Future plans include expanding the program to other faculties, securing long-term strategic partnerships with industry leaders, and developing a repository of open-source educational AI tools to benefit the broader academic community.
                    </p>
                 </motion.div>
            </Section>
        </div>
      </div>
    </PageWrapper>
  );
};