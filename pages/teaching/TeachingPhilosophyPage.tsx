





import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';
import { useI18n } from '../../context/i18n';

const frameworkItems = [
    {
        title: "The Constructivist Foundation",
        icon: "https://png.pngtree.com/png-clipart/20230429/original/pngtree-scaffolding-line-icon-png-image_9119622.png",
        description: "Students build knowledge rather than receive it. This much is settled. Starting from fundamental principles, they construct their own frameworks for understanding. When a student derives a heat transfer equation instead of memorizing it, when they figure out why a process works rather than accept that it does, the understanding becomes structurally theirs. It survives the exam and shows up again in professional practice years later, which is the only test of teaching that finally matters."
    },
    {
        title: "The Co-adaptive Element",
        icon: "https://www.svgrepo.com/show/335231/infinity.svg",
        description: "The departure from classical constructivism is small in formulation and large in consequence. Educators have to learn and adapt too. Students arrive shaped by the tools, contexts, and habits of knowing that their generation produced. Teaching frozen in a previous decade creates predictable misalignment with the students actually in the room. We adapt alongside them, holding rigor steady while letting methods change. This is not pedagogical relativism. It is pedagogical realism."
    },
    {
        title: "Core Principle: Vectorial Alignment",
        icon: "https://icons.veryicon.com/png/o/miscellaneous/xdh-font-graphics-library/direction-17.png",
        description: "I picture education as vector addition. Each student arrives with their own direction and magnitude, a trajectory shaped by background, goals, and context. Conventional teaching tries to overwrite that vector with the instructor's own. My approach is to add mine to theirs: knowledge, guidance, and method combine with the momentum the student already carries, and the result is a new direction neither of us could have produced alone. The goal is the optimization of the combined vector, not the replacement of theirs by mine. Alignment outperforms redirection in almost every case I have seen."
    }
];

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
                    <p className="mb-10">
                        My approach, which I call Co-adaptive Constructivism, builds on a constructivist tradition that is no longer in dispute, and adds the recognition that effective teaching demands mutual adaptation. Students adapting to fixed academic structures is not enough. The structures, and those of us who keep them, have to adapt as well.
                    </p>
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-8">Core Framework: Co-adaptive Constructivism</h3>
                    <motion.div 
                        className="mt-8 flex flex-col gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {frameworkItems.map(item => (
                            <motion.div 
                                key={item.title} 
                                variants={itemVariants}
                                className="flex flex-col md:flex-row items-start text-left p-8 bg-zinc-50 rounded-lg border border-zinc-200 transition-shadow hover:shadow-lg gap-6"
                            >
                                <div className="flex-shrink-0 bg-yellow-400/20 p-4 rounded-full">
                                    <img src={item.icon} alt={`${item.title} icon`} className="h-10 w-10 object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-brand-dark mb-2">{item.title}</h4>
                                    <p className="text-brand-gray text-base leading-relaxed">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div>
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">Addressing Equity Through Co-adaptation</h3>
                    <p>
                        The framework names something most pedagogical models avoid: students do not arrive at the same starting point. Resources, preparation, and prior obstacles differ. Co-adaptation is how the framework responds to that fact without lowering the bar. A student with fewer resources gets more scaffolding. A student who learns differently gets a different route into the same idea. The destination stays rigorous. The paths multiply.
                    </p>
                </div>

                <div className="mt-12 bg-white rounded-lg shadow-xl border border-yellow-400/40 p-8 md:p-12">
                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark mb-8 text-center">Five Practices</h2>
                    <ol className="space-y-8 text-lg text-brand-gray leading-relaxed list-decimal list-outside ml-5">
                        <li>
                            <strong>Principles Before Recipes.</strong> I spend serious time on the foundations: conservation laws, thermodynamics, transport phenomena. Once a student holds these properly, they can derive what they need, recognize patterns across contexts, and build their own solutions. Conceptual pedagogy has been making this argument for decades. I am simply trying to honor it.
                        </li>
                        <li>
                            <strong>Bidirectional Learning.</strong> In keeping with dialogic principles, I name out loud that I am learning alongside my students. Their questions surface angles I had not considered. Their approaches challenge assumptions I had stopped examining. This is not staged humility. Knowledge construction is dialogic by nature, and pretending otherwise teaches students the wrong thing about expertise.
                        </li>
                        <li>
                            <strong>Networks as Architecture.</strong> Problems in professional practice rarely yield to the lone expert. They yield to networks. I connect students with peers, alumni, industry contacts, and active researchers, because building and activating a knowledge network is itself a skill. Social constructivism has the theory. The profession has the evidence.
                        </li>
                        <li>
                            <strong>Adaptive Pressure Through Collaboration.</strong> I run team-based work with rotating membership. The result is productive friction. Students learn to flex their collaboration style, their communication mode, their default approach to a problem. Professional environments demand exactly this kind of adaptability, and the classroom is the safest place to develop it.
                        </li>
                        <li>
                            <strong>Transparent Evolution.</strong> I make the co-adaptation visible. Students see me change a method based on their feedback, try a new approach when an old one fails, concede that a student&rsquo;s solution beats the one I had prepared. The point is to demystify expertise. Professors are works in progress, and watching that progress in real time teaches students more about professional life than any monologue on lifelong learning could.
                        </li>
                    </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mt-16">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">The Stoic Foundation</h3>
                        <p>
                            Underneath the framework is a discipline of attention. I cannot control the conditions a student brings on day one: preparation, circumstance, motivation, the rest. I can control the environment I build, the trust I extend, and the steadiness of my own adaptation. This is not passive acceptance of inequity. It is the strategic concentration of effort on what will actually move.
                        </p>
                    </div>
                     <div>
                        <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">Philosophy in Practice</h3>
                        <ul className="space-y-4 text-lg text-brand-gray leading-relaxed list-disc list-outside ml-5">
                            <li><strong>Assessment.</strong> Multiple formats that recognize different strengths without softening the standard.</li>
                            <li><strong>Content delivery.</strong> Core principles taught through contexts that the current cohort can recognize.</li>
                            <li><strong>Feedback.</strong> Continuous dialogue about what is working, what is not, and why.</li>
                            <li><strong>Evolution tracking.</strong> Documentation of adaptations that succeeded and adaptations that failed, so the lessons accumulate instead of evaporating each semester.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 p-8 bg-zinc-100 border-l-4 border-yellow-400 rounded-r-lg">
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">The Transformation</h3>
                    <p>
                        The classroom turns into a co-adaptive system in which everyone present, students and educator alike, leaves changed. Students walk out with engineering knowledge and with the meta-skill of adaptive learning, which has the longer half-life. Educators walk out with a continually refreshed sense of how knowledge construction is happening across generations that are not their own. The classroom becomes a living laboratory of mutual transformation, and that is the rehearsal a graduate needs for a world that will demand deep expertise and continuous adaptation in the same breath.
                    </p>
                    <p className="mt-4 font-semibold text-brand-dark">
                        Co-adaptive constructivism does not ask anyone to choose between rigor and relevance. It produces both through dynamic alignment. The standard stays high. The paths to reach it multiply and keep evolving. The framework is not a compromise. It is what optimization for real impact actually looks like.
                    </p>
                </div>
              </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};