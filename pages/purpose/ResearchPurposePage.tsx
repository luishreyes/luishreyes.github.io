




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
                        Engineering Biology, Forming People
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        Research lives in the overlap of two commitments: engineering biological systems to solve real problems in medicine, sustainability, and human experience, and forming the people who will solve the next ones.
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
                        Research, for me, lives in the overlap of two commitments that most academics treat as separate. The first is scientific: engineering principles, applied to biological systems, can address real problems in medicine, sustainability, and human experience. The second is formative. Every project I lead is also a classroom without walls, a space where students develop resourcefulness, the reflex to improvise when things break, the ability to move across disciplines without losing technical seriousness, and the discipline of thinking critically about their own work. The publications and the discoveries matter, sometimes spectacularly so. The deepest outcome of any project I run, however, is the person who walks out of the laboratory transformed.
                    </p>
                    <p>
                        After my internship at Ecopetrol, I did another at Texas A&amp;M University. Both were demanding, but only one rearranged the way I saw problems. In academia, every answered question fractured into a dozen unanswered ones, and that fracture was the point rather than the problem. Professor Katy Kao, my PhD advisor, taught me what technical excellence alone cannot teach: that delegation is a form of trust, that the student in front of you is a whole human being before they are a researcher, and that their success becomes yours. That lesson runs my group today.
                    </p>
                    <p>
                        I approach research through the same vectorial philosophy that organizes my teaching. Every collaborator and every student arrives as a vector with magnitude, direction, and sense. My job is not to bend their vectors toward my agenda but to find the alignment where ours sum to maximum impact. Gene therapies for lysosomal diseases have won awards and spawned startups in our group, but only because molecular biology, clinical specialty, and nanoparticle chemistry agreed to share authorship of the question. Sustainable food choices rarely lose on nutrition. They lose on texture, on sound, on the unconscious cues that tell a consumer this product is somehow lesser, and working with food designers, computing engineers, and sonic seasoning researchers, we have learned to design those cues back in. When microbiologists bring deep mechanistic understanding and bioprocess engineers bring optimization expertise, our vectors add constructively to improve the air, the health, and the daily life of an entire municipality. This is the throughline across everything I do: engineering microbes as microscopic factories, designing multisensory experiences that shape behavior, using AI to compress the distance between hypothesis and biological design, and learning from how evolution already solved the problem.
                    </p>
                    <p>
                        The same alignment work happens with my students, on a longer clock and with different stakes. A master&rsquo;s student learning to design an experiment is also learning to defend an idea against criticism, to recover from failure without abandoning the question, to translate the work into language a non-specialist can follow. The doctoral candidate fighting a contaminated bioreactor late at night is learning resourcefulness and improvisation in ways no syllabus can deliver. Whatever the research advances in the field, it is also pretext. The formation is the point.
                    </p>
                    <p>
                        Real innovation happens at interfaces, in conversations, through networks. The most useful epistemic position is rarely the lone expert, however brilliant. It is the dense intersection of people who each know something the others do not. I do not aspire to be the most renowned specialist. I want to be a connector node in a wide network of discovery, and to train students who will become connector nodes in their own. Philosophy and strategy align here.
                    </p>
                    <p>
                        What drives me, in the end, is a quiet conviction: that one act, done well, serves both horizons at once. The science advances precisely because the person grows, not despite it. A community breathes cleaner air because a student learned to think rigorously under uncertainty. A graduate finds her voice because she had to defend a real result against real critique. The work and the formation are not parallel tracks but the same track, viewed from two angles.
                    </p>
                    <p>
                        Each publication is more than a CV line. It is knowledge made public, a contribution to our shared understanding of how the world works, and very often the artifact of a student finding their professional voice for the first time. I am a &ldquo;social animal&rdquo; in research by judgment, not by temperament. Complex problems give themselves up to networks, never to lone genius.
                    </p>
                    <p>
                        The laboratory I want is a space where biological systems meet engineering principles, where evolution inspires the next design, and where diverse expertise converges into something none of us could have produced alone. It is also where students learn the unglamorous skills no syllabus teaches: how to fail well, how to keep going, how to matter to the people they work with. Research is not territory. It is the deliberate alignment of our collective vectors toward problems worth solving, and toward the people who will solve the next ones.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};