



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
                        Cultivating the Ecosystem
                    </h1>
                    <p className="mt-6 text-xl text-zinc-200 leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                        Cultivating the structures that made my growth possible, and building paths the next generation can use to go further than we did.
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
                        Institutions and communities are ecosystems. They do not maintain themselves. My purpose in serving is to keep cultivating the structures that made my own growth possible, and to build paths the next generation can use to go further than we did.
                    </p>
                    <p>
                        Service stopped feeling abstract once I understood what Uniandes had actually given me. I think it is the best university in the country, and that judgment carries an obligation, though obligation is the wrong word. Healthy ecosystems do not run on passive gratitude. They run on participation. Every committee, every manuscript I review, every conversation with a high-school student deciding whether engineering is for them: each is an investment in a system that exceeds me. The point is not the recognition. The point is the ecosystem staying alive.
                    </p>
                    <p>
                        Co-founding the Augmented Intelligence Initiative was not a bet on a trend. Generative AI is going to remake engineering education whether we plan for it or not, and I would rather we evolve our methods on purpose than have them eroded by accident. That move captures how I read service in general. Notice where new capabilities meet a real institutional need, and build the bridge. Service is the discipline of seeing connections most people walk past and turning them into structures the rest of the community can use.
                    </p>
                    <p>
                        Leading the GDPP, sitting on editorial boards, visiting schools, none of these are checkboxes on a service report. They are different networks where I get to be a connector node. A manuscript review helps another researcher sharpen their argument. A school visit cracks open possibilities a student had not yet allowed themselves to imagine. Committee work, for all its slowness, is how an institution keeps adapting to the generations it has not yet met.
                    </p>
                    <p>
                        What sustains me here has two layers. The first is straightforward. I have something to give: ideas, creativity, honesty, and a real concern for whether students are doing okay. The second takes longer to articulate. Service produces effects that travel further than the act itself. The work supports my family, yes. It also keeps me intellectually awake and aware of my position inside larger systems. The student I mentor today becomes a node in tomorrow&rsquo;s network. The program I am building now could serve students I will never meet. An editorial decision shapes knowledge that travels to researchers I will never know.
                    </p>
                    <p>
                        Stoic practice taught me to put my attention on what I can actually move. Service is the form that practice takes inside an institution. Individual achievement has a ceiling. Ecosystem cultivation does not. The best paper I could write reaches dozens. The programs I am building could reach thousands. The strongest student I mentor becomes a multiplier in their own right, and the chain keeps extending.
                    </p>
                    <p>
                        The ecosystem metaphor is more than ornament. Real ecosystems persist on three properties: diversity, adaptation, and interconnection. Service is how I help our academic ecosystem hold all three, by widening who gets in, by pushing initiatives that meet actual change in the world, and by weaving the connections between academia, industry, and society that make any of it durable. This is how institutions evolve. This is how the next generation finds paths we never had the imagination to draw.
                    </p>
                </div>
            </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};