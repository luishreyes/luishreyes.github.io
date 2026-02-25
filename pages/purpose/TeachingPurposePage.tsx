




import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';

export const TeachingPurposePage: React.FC = () => {
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
                        A Place to Learn and Grow
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        My teaching purpose is to guide students in mastering fundamental principles while we co-adapt our methods, discovering together how to solve real-world problems creatively.
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
                <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">My Teaching Purpose</h2>
                <div className="space-y-6 text-lg text-brand-gray leading-relaxed">
                    <p>
                        Every morning, I’m driven to teach by a fundamental belief: when students truly understand core principles rather than just memorize them, they can solve any problem they encounter. My purpose is to rigorously teach these foundations while continuously evolving alongside my students, discovering together what we’re each capable of achieving.
                    </p>
                    <p>
                        I discovered my calling in 11th grade chemistry when Professor Martha Rondón trusted me to teach my peers. Years later, Professor Álvaro Ramírez crystallized the philosophy that guides me still: “There’s no problem staying with the fundamentals because once you understand them, the rest of the profession falls into place naturally.” This became my north star: teaching students to understand principles deeply enough to build their own solutions, rather than memorizing formulas for specific contexts.
                    </p>
                    <p>
                        I visualize teaching through a vectorial metaphor. Students arrive as vectors with magnitude (their energy and potential), direction (their interests and goals), and sense (positive or negative orientation toward learning), shaped by their generation’s tools and experiences. As educators, we too are vectors. The resulting education is a vectorial sum: when our vectors point in similar directions with the same positive sense toward academic excellence, our contributions add constructively. When we oppose their sense, we create destructive interference. When we insist on orthogonal directions, we pull students sideways without advancing their forward momentum.
                    </p>
                    <p>
                        This is why I fundamentally reject the tired complaint that “students today aren’t like they used to be.” Of course they aren’t. Students have always evolved with their times, their tools, their contexts. This isn’t a decline; it’s evolution. The real problem emerges when educators refuse to adapt their own vectors, insisting on teaching as if students still arrive with slide rules instead of smartphones, with library cards instead of infinite digital access. When we complain about student evolution while refusing our own, we’re the ones creating misalignment. We’re the ones reducing our potential impact through stubborn orthogonality.
                    </p>
                    <p>
                        When we adapt our vector to align with theirs while maintaining positive sense toward rigorous learning, we maximize the resultant vector’s magnitude. We create powerful educational momentum rather than wasted orthogonal forces. Their evolution isn’t a problem to solve; it’s an opportunity for mutual growth.
                    </p>
                    <p>
                        What drives me is witnessing transformation through transparency. Students see me adjust my teaching when their questions reveal better approaches. They watch me acknowledge when their solutions surpass mine. This visible co-adaptation shows them that expertise means continuous learning, not fixed knowledge. A student who once memorized Q=UA∆T now grasps heat transfer deeply enough to solve problems I never taught. Years later, they thank me for teaching them how to think in fundamentals while adapting to new challenges.
                    </p>
                    <p>
                        My commitment extends beyond individual classrooms. I strengthen our institution through often unrecognized work because I focus on what I can control: the environment I create, the trust I extend, the continuous refinement of my practice. This same principle shapes how I approach each student’s unique starting point. I cannot control how they arrive, but I can control how we adapt together to achieve rigorous learning outcomes.
                    </p>
                    <p>
                        The classroom becomes a space where both students and educator evolve, where fundamental principles meet contemporary applications, where academic rigor coexists with methodological flexibility. This is co-adaptive constructivism in action: maintaining high standards while multiplying the paths to reach them.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};