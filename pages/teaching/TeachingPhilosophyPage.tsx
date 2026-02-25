





import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';

const frameworkItems = [
    {
        title: "The Constructivist Foundation",
        icon: "https://png.pngtree.com/png-clipart/20230429/original/pngtree-scaffolding-line-icon-png-image_9119622.png",
        description: "Like traditional constructivism, I recognize that students build rather than receive knowledge. Starting with fundamental principles, they construct their own frameworks for understanding. When they derive heat transfer equations rather than memorize them, when they discover why a process works rather than just learn that it does, they’re actively constructing knowledge that becomes truly theirs. This construction process creates understanding that survives beyond exams into professional practice."
    },
    {
        title: "The Co-adaptive Element",
        icon: "https://www.svgrepo.com/show/335231/infinity.svg",
        description: "Where my approach diverges is in recognizing that educators must also adapt and learn. Students arrive shaped by their generation’s tools, contexts, and ways of knowing. Static teaching in a dynamic world creates misalignment. We adapt together, maintaining rigor while evolving methods. This isn’t pedagogical relativism; it’s pedagogical realism."
    },
    {
        title: "Core Principle: Vectorial Alignment",
        icon: "https://icons.veryicon.com/png/o/miscellaneous/xdh-font-graphics-library/direction-17.png",
        description: "Think of education as vector addition. Students arrive with their own direction and magnitude, their own trajectory shaped by background, goals, and context. Traditional education often tries to redirect them entirely. Instead, I view my role as adding my vector to theirs: my knowledge, guidance, and methods combine with their existing momentum to create a new resultant direction. The goal is optimization of this combined vector, not replacement of theirs with mine. We achieve more through alignment and addition than through redirection."
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
                src="https://scontent-bog2-1.xx.fbcdn.net/v/t1.6435-9/126177274_10158054021613160_2071561028163868049_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=dj840BgOy88Q7kNvwEiT1uy&_nc_oc=AdnFc82mDCvfBO131TvBC4UAontS_bG0tuNzjVIsU-C_XK_iB36TUYEowg6TU8k_Y-E&_nc_zt=23&_nc_ht=scontent-bog2-1.xx&_nc_gid=V3Z7ZIpHD2vHjRFe8ifdyw&oh=00_AfYf6zTruxitjBwowMEhRIze8yY2sM174dYmVyrv5ZWdAw&oe=68F4BC6B" 
                alt="Students collaborating in a modern Uniandes classroom, representing a dynamic learning environment"
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
                        Teaching Philosophy
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        My approach of Co-adaptive Constructivism extends established pedagogical principles, recognizing that effective education requires mutual adaptation between educators and students—not just student adaptation to fixed academic structures.
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
                        This framework explicitly acknowledges that students arrive with different starting points, resources, and challenges. Co-adaptation means recognizing these differences without lowering expectations. For students with fewer resources, I adapt by providing more scaffolding. For those with different learning approaches, I adapt my explanation methods. The destination remains rigorous; the paths multiply.
                    </p>
                </div>

                <div className="mt-12 bg-white rounded-lg shadow-xl border border-yellow-400/40 p-8 md:p-12">
                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark mb-8 text-center">Five Pillars of Practice</h2>
                    <ol className="space-y-8 text-lg text-brand-gray leading-relaxed list-decimal list-outside ml-5">
                        <li>
                            <strong>Fundamentals as Foundation:</strong> I invest intensive time ensuring students understand core principles: conservation laws, thermodynamic principles, transport phenomena. When students grasp these fundamentals, they can derive what they need, recognize patterns, and build solutions. This aligns with conceptual pedagogy’s emphasis on deep understanding over surface learning.
                        </li>
                        <li>
                            <strong>Bidirectional Learning:</strong> Following dialogic principles, I explicitly acknowledge learning alongside my students. Their questions reveal new angles; their approaches challenge my assumptions. This isn’t false modesty but recognition that knowledge construction happens through dialogue. I model intellectual humility while maintaining academic rigor.
                        </li>
                        <li>
                            <strong>Networks as Knowledge Architecture:</strong> Real-world problem-solving happens through networks, not in isolation. I connect students with peers, industry professionals, researchers, and alumni. This reflects both social constructivist principles and professional reality: knowing how to build and activate knowledge networks matters as much as individual expertise.
                        </li>
                        <li>
                            <strong>Adaptive Pressure Through Collaboration:</strong> Team-based learning with rotating compositions creates productive adaptation pressure. Students develop flexibility in collaboration styles, communication methods, and problem-solving approaches. This mirrors professional environments where adaptability determines success.
                        </li>
                        <li>
                            <strong>Transparent Evolution:</strong> I make our co-adaptation visible. Students see me adjust methods based on their feedback, try new approaches when something isn’t working, acknowledge when their solutions surpass mine. This transparency demystifies expertise and models professional growth. They witness that even professors are works in progress, constantly refining their practice. When I discover a better explanation through their questions, I tell them. When their approach teaches me something new, I acknowledge it. This visibility transforms the classroom into a living demonstration of lifelong learning.
                        </li>
                    </ol>
                </div>

                <div className="grid md:grid-cols-2 gap-12 mt-16">
                    <div>
                        <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">The Stoic Foundation</h3>
                        <p>
                            Underlying this philosophy is focus on what we can control. I cannot control students’ starting conditions: their preparation, circumstances, or initial motivation. I can control the environment I create, the trust I extend, and my own continuous adaptation. This isn’t passive acceptance of inequity but strategic focus on actionable change.
                        </p>
                    </div>
                     <div>
                        <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">Philosophy in Practice</h3>
                        <ul className="space-y-4 text-lg text-brand-gray leading-relaxed list-disc list-outside ml-5">
                            <li><strong>Assessment:</strong> Multiple formats acknowledging different strengths while maintaining standards.</li>
                            <li><strong>Content Delivery:</strong> Core principles taught through varied contexts relevant to current students.</li>
                            <li><strong>Feedback:</strong> Continuous dialogue about what works, what doesn’t, and why.</li>
                            <li><strong>Evolution Tracking:</strong> Regular documentation of successful and failed adaptations, building institutional knowledge.</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-12 p-8 bg-zinc-100 border-l-4 border-yellow-400 rounded-r-lg">
                    <h3 className="text-3xl font-bold tracking-tight text-brand-dark mb-4">The Transformation</h3>
                    <p>
                        This philosophy transforms the classroom into a co-adaptive learning system where all participants emerge changed. Students gain not just engineering knowledge but the meta-skill of adaptive learning. Educators gain continuously refreshed understanding of how knowledge construction happens across generations. The classroom becomes a living laboratory of mutual transformation, preparing all participants for a world that demands both deep expertise and continuous adaptation.
                    </p>
                    <p className="mt-4 font-semibold text-brand-dark">
                        Rather than choosing between rigor and relevance, co-adaptive constructivism achieves both through dynamic alignment. We maintain high standards while recognizing that the paths to reach them must multiply and evolve. This isn’t compromise; it’s optimization for actual impact.
                    </p>
                </div>
              </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};