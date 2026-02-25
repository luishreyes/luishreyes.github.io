



import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';

export const ServicePurposePage: React.FC = () => {
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
                src="https://ingenieria.uniandes.edu.co/sites/default/files/actualidad_0.jpg" 
                alt="Collaborative meeting space at the School of Engineering, Uniandes, representing service and community engagement"
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
                        Cultivating Our Ecosystem
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        My service purpose is to strengthen the academic and scientific communities that foster growth and create pathways for future generations.
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
                <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">My Service Purpose</h2>
                <div className="space-y-6 text-lg text-brand-gray leading-relaxed">
                    <p>
                        I serve because I believe institutions and communities are ecosystems that require active cultivation. My purpose is to strengthen the structures that enabled my growth while creating pathways for future generations to surpass what we’ve achieved.
                    </p>
                    <p>
                        Service became meaningful when I realized that Uniandes, which I genuinely believe is the best university in Colombia, gave me opportunities I needed to reciprocate. This isn’t obligation born from debt but recognition that healthy ecosystems require active participants, not passive beneficiaries. Every committee I join, every manuscript I review, every high school student I inspire through outreach represents an investment in a system larger than myself. This isn’t about recognition; it’s about ensuring the ecosystem thrives.
                    </p>
                    <p>
                        When I co-founded the Augmented Intelligence Initiative, it wasn’t to follow AI trends but because I recognized how generative AI could transform engineering education if we evolved our methods thoughtfully. This exemplifies my service approach: identifying where emerging capabilities meet institutional needs, then building bridges between them. Service means seeing connections others might miss and creating structures that benefit the entire community.
                    </p>
                    <p>
                        Leading the GDPP, serving on editorial boards, visiting schools: these aren’t checkboxes on an academic service report. They’re opportunities to be a connector node in different networks. When I review a manuscript, I’m helping another researcher strengthen their work. When I visit a high school, I’m opening possibilities students hadn’t imagined. When I serve on committees, I’m ensuring our institution evolves to serve new generations effectively.
                    </p>
                    <p>
                        What drives me is both simple and complex. Simple: I can contribute. I have ideas, creativity, honesty, and genuine interest in student wellbeing. Complex: I understand that service creates ripple effects beyond immediate impact. Working sustains my family, yes, but it also keeps me intellectually active and conscious of my role in larger systems. A student I mentor today becomes a node in tomorrow’s network. A program I’m working to establish could serve hundreds of students I’ll never meet. An editorial decision shapes knowledge that influences researchers worldwide.
                    </p>
                    <p>
                        Following stoic principles, when I can’t control outcomes, I focus on what I can influence. Service multiplies that influence exponentially. Individual achievement has limits; ecosystem cultivation has none. The best research paper I could write impacts dozens. The programs I’m working to create could impact thousands. The best student I mentor becomes a multiplier themselves.
                    </p>
                    <p>
                        The ecosystem metaphor isn’t just poetic; it’s practical. Ecosystems require diversity, adaptation, and interconnection. My service ensures our academic ecosystem maintains all three: diverse perspectives through inclusive programs, adaptation through initiatives like AI integration, and interconnection through the networks I help weave between academia, industry, and society. This is how institutions evolve, how communities strengthen, how future generations find paths we couldn’t have imagined.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};