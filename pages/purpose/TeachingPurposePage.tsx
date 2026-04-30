




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
                        Fundamentals, Held with Rigor
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        Teaching the fundamentals deeply enough that students can build their own solutions, and evolving alongside each cohort to find out what they can actually do.
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
                        I teach because students who understand a principle can solve problems no one prepared them for. Memorization is a finite toolkit. Understanding generates new tools as the problems change. My purpose is to teach the fundamentals with the rigor they deserve, and to keep evolving alongside the students I teach, because finding out what each cohort can actually do is part of what teaching is for.
                    </p>
                    <p>
                        The vocation announced itself in eleventh-grade chemistry, when Professor Martha Rondón trusted me to teach my classmates. Years later, Professor Álvaro Ramírez gave me the sentence I still teach by: &ldquo;There is no problem staying with the fundamentals, because once you understand them, the rest of the profession falls into place naturally.&rdquo; That became the compass. Teach principles deeply enough that students can build their own solutions, instead of feeding them formulas tied to whatever context happens to be in vogue.
                    </p>
                    <p>
                        I organize my teaching around a vectorial metaphor. Students arrive as vectors with magnitude (their energy and potential), direction (their interests and goals), and sense (positive or negative orientation toward learning), each shaped by the tools and experiences of their generation. Educators are vectors too. The education that actually emerges is a vectorial sum. Aligned vectors with shared positive sense produce constructive interference and forward motion. Opposed senses cancel each other out. Orthogonal insistence, the most common failure mode, pulls students sideways without advancing them at all.
                    </p>
                    <p>
                        This is why I reject the well-worn complaint that &ldquo;students today are not like they used to be.&rdquo; Of course they are not. Students have always evolved with their times, their tools, their contexts. The shift is not decline. It is evolution. The real problem appears when educators refuse to evolve their own vectors, teaching as if students still arrived with slide rules in their pockets and library cards as their only research tool. When we complain about student evolution while refusing our own, the misalignment is ours, not theirs. The orthogonality we lament, we are creating.
                    </p>
                    <p>
                        The corrective is alignment, not lowered standards. We adjust our vector to meet theirs while keeping the sense pointed firmly at rigorous learning. Done well, the resultant vector grows in magnitude rather than canceling out. Their evolution stops being a problem to manage and starts being the condition that makes serious learning possible.
                    </p>
                    <p>
                        What I want my students to see is the adaptation itself. They watch me change a method when a question reveals a better one. They watch me concede that a student&rsquo;s solution beats mine. That visible co-adaptation is the whole curriculum on what expertise really is: a practice of continuous learning, not a stockpile of fixed knowledge. A student who once memorized Q=UA∆T now reasons about heat transfer well enough to solve problems I never set. Some come back years later to say so.
                    </p>
                    <p>
                        My work outside the classroom rests on the same logic. I invest in institutional repair, often invisibly, because I focus on what I can shape: the environment, the trust I extend to colleagues and students, the steady refinement of my own practice. The same applies to how I receive each student. I cannot control the vector they bring on day one. I can control how we align ours from there.
                    </p>
                    <p>
                        The classroom I want is a space where students and educator evolve in parallel, where fundamental principles meet contemporary applications, where rigor and methodological flexibility reinforce each other instead of fighting. This is co-adaptive constructivism in action: standards held high, paths to reach them multiplied.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};