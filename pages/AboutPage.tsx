


import React, { useRef, useEffect } from 'react';
// FIX: Removed 'Variants' from framer-motion import to resolve module export error.
import { motion, useScroll, useTransform } from 'framer-motion';
import { educationData, specializationsData, credentialsData } from '../components/data/education';
import { workExperienceData } from '../components/data/experience';

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
      type: "spring" as const,
      bounce: 0.4,
      duration: 0.8
    }
  }
};

const timelineItemVariants = {
  offscreen: {
    x: -30,
    opacity: 0
  },
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

// FIX: Made children optional to fix TypeScript error.
const IconWrapper = ({ children }: { children?: React.ReactNode }) => (
    <div className="flex items-center justify-center h-16 w-16 bg-yellow-400/20 rounded-full mb-6">
        {children}
    </div>
);

// Icons as components
const ResearchersIcon = () => (
    <img src="https://cdn-icons-png.flaticon.com/512/7388/7388554.png" alt="Researchers and Academics Icon" className="h-8 w-8" />
);

const StudentsIcon = () => (
    <img src="https://cdn-icons-png.flaticon.com/512/948/948256.png" alt="Engineering Students Icon" className="h-8 w-8" />
);

const IndustryIcon = () => (
    <img src="https://cdn-icons-png.flaticon.com/512/2891/2891415.png" alt="Companies Icon" className="h-8 w-8" />
);

const CertificateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const heroVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.15 
      } 
    },
};

const heroChildVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
      transition: { duration: 0.6, ease: 'easeOut' as const } 
    },
};

export const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Hero Image Scroll Animation
  const { scrollY } = useScroll();
  const heroFrameRotate = useTransform(scrollY, [0, 300], [0, -3], { clamp: true });
  const heroImageRotate = useTransform(scrollY, [0, 300], [0, 2], { clamp: true });
  const heroImageScale = useTransform(scrollY, [0, 300], [1, 1.05], { clamp: true });

  // Professional Purpose Image Scroll Animation
  const purposeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: purposeScrollYProgress } = useScroll({
    target: purposeRef,
    offset: ["start end", "end start"]
  });
  const purposeFrameRotate = useTransform(purposeScrollYProgress, [0, 1], [-3, 3]);
  const purposeImageRotate = useTransform(purposeScrollYProgress, [0, 1], [2, -2]);
  const purposeImageScale = useTransform(purposeScrollYProgress, [0, 1], [1, 1.05]);

  return (
    <motion.div
      // FIX: Spread motion props to avoid TypeScript type errors.
      {...{
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.5 },
      }}
    >
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex items-center justify-center bg-zinc-50 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[80vh] max-w-6xl max-h-[700px] border-4 border-yellow-400 rounded-3xl"
            initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
            animate={{ opacity: 1, rotate: -6, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center pt-28 pb-16 md:pt-0 md:pb-0">
              {/* Text Content */}
              <motion.div
                {...{
                  variants: heroVariants,
                  initial: 'hidden',
                  animate: 'visible',
                }}
              >
                <motion.p
                  {...{ variants: heroChildVariants }}
                  className="font-mono text-base md:text-lg tracking-widest text-brand-gray"
                >
                  Hi, my name is
                </motion.p>
                <motion.h1
                  {...{ variants: heroChildVariants }}
                  className="mt-2 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-brand-dark"
                >
                  Luis H. Reyes.
                </motion.h1>
                <motion.h2
                  {...{ variants: heroChildVariants }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-brand-dark mt-4"
                >
                  I engineer biology for a better future.
                </motion.h2>
                <motion.p
                  {...{ variants: heroChildVariants }}
                  className="mt-8 max-w-3xl text-lg text-brand-gray leading-relaxed"
                >
                  I am an Associate Professor at Universidad de los Andes, leading research at the convergence of biotechnology, nanotechnology, and AI to transform complex challenges into sustainable, high-impact solutions.
                </motion.p>
                <motion.div
                  {...{ variants: heroChildVariants }}
                  className="mt-10"
                >
                  <button
                    onClick={() => {
                      const mainContent = document.getElementById('main-content');
                      if (mainContent) {
                        mainContent.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="bg-yellow-400 text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-50 focus:ring-yellow-400"
                  >
                    Explore My Work
                  </button>
                </motion.div>
              </motion.div>

              {/* Image Content */}
              <motion.div
                className="flex justify-center items-center"
                {...{
                    initial: { opacity: 0, x: 50 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 },
                }}
              >
                <div className="relative w-full max-w-sm mx-auto">
                  {/* Dephased frame */}
                  <motion.div
                    className="absolute top-4 right-[-12px] bottom-[-12px] left-4 rounded-2xl border-2 border-yellow-400"
                    style={{ rotate: heroFrameRotate }}
                  />

                  {/* Main image */}
                  <motion.div
                    className="relative rounded-2xl shadow-xl z-10 overflow-hidden h-96 md:h-[65vh] md:max-h-[600px]"
                    style={{ rotate: heroImageRotate, scale: heroImageScale }}
                  >
                    <img
                      src="https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/uandes_2.jpg"
                      alt="Luis H. Reyes"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"></div>
                  </motion.div>
                </div>
              </motion.div>
          </div>
      </div>

      {/* Main Content */}
      <div id="main-content" className="bg-white">
          <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
              
              {/* Professional Purpose Section */}
              <motion.div 
                // FIX: Spread motion props to avoid TypeScript type errors.
                {...{
                    initial: "offscreen",
                    whileInView: "onscreen",
                    viewport: { once: true, amount: 0.4 },
                    variants: { onscreen: { transition: { staggerChildren: 0.2 } } },
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center max-w-5xl mx-auto"
              >
                  <motion.div ref={purposeRef} {...{variants: cardVariants}} className="md:col-span-4 flex justify-center">
                      <div className="relative w-56 h-56 mx-auto">
                          {/* Dephased frame */}
                          <motion.div
                            className="absolute top-3 right-[-9px] bottom-[-9px] left-3 rounded-2xl border-2 border-yellow-400"
                            style={{ rotate: purposeFrameRotate }}
                          />

                          {/* Main image */}
                          <motion.div
                            className="relative w-full h-full rounded-2xl shadow-xl z-10 overflow-hidden"
                            style={{ rotate: purposeImageRotate, scale: purposeImageScale }}
                          >
                              <img
                                  src="https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/1756469286343.jpeg"
                                  alt="Luis H. Reyes"
                                  className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-white mix-blend-saturation pointer-events-none"></div>
                          </motion.div>
                      </div>
                  </motion.div>
                  <motion.div {...{variants: cardVariants}} className="md:col-span-8 text-center md:text-left">
                      <h2 className="text-3xl font-bold tracking-tight text-brand-dark">My Professional Purpose</h2>
                      <p className="mt-6 text-brand-gray leading-relaxed text-lg">
                          I am dedicated to driving innovation in biotechnology, nanotechnology, and generative AI. My professional purpose is to transform complex challenges into practical solutions that enhance quality of life and promote sustainable development.
                      </p>
                  </motion.div>
              </motion.div>

              {/* Mission & Approach Section */}
              <div className="mt-24">
                  <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-center">Mission & Approach</h2>
                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                      
                      <motion.div {...{initial:"offscreen", whileInView:"onscreen", viewport:{ once: true, amount: 0.5 }, variants:cardVariants}} className="flex flex-col items-center">
                          <IconWrapper><ResearchersIcon /></IconWrapper>
                          <h3 className="text-xl font-semibold text-brand-dark">For Researchers & Academics</h3>
                          <p className="mt-2 text-brand-gray">Leading and collaborating on applied, interdisciplinary research projects that address real-world problems.</p>
                      </motion.div>
                      
                      <motion.div {...{initial:"offscreen", whileInView:"onscreen", viewport:{ once: true, amount: 0.5 }, variants:cardVariants}} className="flex flex-col items-center">
                          <IconWrapper><StudentsIcon /></IconWrapper>
                          <h3 className="text-xl font-semibold text-brand-dark">For Engineering Students</h3>
                          <p className="mt-2 text-brand-gray">Providing mentorship and specialized training to deepen knowledge and foster the next generation of innovators.</p>
                      </motion.div>
                      
                      <motion.div {...{initial:"offscreen", whileInView:"onscreen", viewport:{ once: true, amount: 0.5 }, variants:cardVariants}} className="flex flex-col items-center">
                          <IconWrapper><IndustryIcon /></IconWrapper>
                          <h3 className="text-xl font-semibold text-brand-dark">For Companies & Startups</h3>
                          <p className="mt-2 text-brand-gray">Advising on the implementation of advanced technologies to improve processes, products, and solutions.</p>
                      </motion.div>
                  </div>
              </div>

              {/* Academic Background Section */}
              <div className="mt-24">
                  <motion.h2 
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{
                          initial: "offscreen",
                          whileInView: "onscreen",
                          viewport: { once: true, amount: 0.5 },
                          variants: cardVariants,
                      }}
                      className="text-3xl font-bold tracking-tight text-brand-dark text-center"
                  >
                      Academic Background
                  </motion.h2>
                  <div className="mt-12 max-w-3xl mx-auto">
                      <motion.div 
                          // FIX: Spread motion props to avoid TypeScript type errors.
                          {...{
                              initial: "offscreen",
                              whileInView: "onscreen",
                              viewport: { once: true, amount: 0.3 },
                              variants: { onscreen: { transition: { staggerChildren: 0.2 } } },
                          }}
                          className="relative border-l-2 border-zinc-200"
                      >
                          {educationData.map((edu, index) => (
                              <motion.div 
                                  key={index} 
                                  {...{variants: timelineItemVariants}}
                                  className="relative pl-8 pb-8 last:pb-0"
                              >
                                  <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                                  <p className="font-bold text-lg text-brand-dark">{edu.degree}, {edu.field}</p>
                                  <p className="text-brand-gray">{edu.institution} <span className="font-normal text-brand-gray">({edu.year})</span></p>
                                  <p className="text-sm text-zinc-500">{edu.location}</p>
                              </motion.div>
                          ))}
                      </motion.div>
                  </div>
              </div>
              
              {/* Work Experience Section */}
              <div className="mt-24">
                  <motion.h2 
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{
                          initial: "offscreen",
                          whileInView: "onscreen",
                          viewport: { once: true, amount: 0.5 },
                          variants: cardVariants,
                      }}
                      className="text-3xl font-bold tracking-tight text-brand-dark text-center"
                  >
                      Work Experience
                  </motion.h2>
                  <div className="mt-12 max-w-3xl mx-auto">
                      <motion.div 
                          // FIX: Spread motion props to avoid TypeScript type errors.
                          {...{
                              initial: "offscreen",
                              whileInView: "onscreen",
                              viewport: { once: true, amount: 0.3 },
                              variants: { onscreen: { transition: { staggerChildren: 0.2 } } },
                          }}
                          className="relative border-l-2 border-zinc-200"
                      >
                          {workExperienceData.map((exp, index) => (
                              <motion.div 
                                  key={index} 
                                  {...{variants: timelineItemVariants}}
                                  className="relative pl-8 pb-8 last:pb-0"
                              >
                                  <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                                  <p className="font-bold text-lg text-brand-dark">{exp.role}</p>
                                  <p className="text-brand-gray">{exp.company} <span className="font-normal text-brand-gray">({exp.period})</span></p>
                                  <p className="text-sm text-zinc-500">{exp.location}</p>
                              </motion.div>
                          ))}
                      </motion.div>
                  </div>
              </div>

              {/* Continuing Education & Specializations */}
              <div className="mt-24">
                  <motion.h2 
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{
                          initial: "offscreen",
                          whileInView: "onscreen",
                          viewport: { once: true, amount: 0.5 },
                          variants: cardVariants,
                      }}
                      className="text-3xl font-bold tracking-tight text-brand-dark text-center"
                  >
                      Continuing Education & Specializations
                  </motion.h2>
                  <div className="mt-12 max-w-3xl mx-auto">
                      <motion.div 
                          // FIX: Spread motion props to avoid TypeScript type errors.
                          {...{
                              initial: "offscreen",
                              whileInView: "onscreen",
                              viewport: { once: true, amount: 0.3 },
                              variants: { onscreen: { transition: { staggerChildren: 0.2 } } },
                          }}
                          className="relative border-l-2 border-zinc-200"
                      >
                          {specializationsData.map((spec, index) => (
                              <motion.div 
                                  key={index} 
                                  {...{variants: timelineItemVariants}}
                                  className="relative pl-8 pb-8 last:pb-0"
                              >
                                  <div className="absolute left-0 top-1.5 w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 border-4 border-white"></div>
                                  <p className="font-bold text-lg text-brand-dark">{spec.title}</p>
                                  <p className="text-brand-gray">{spec.institution} <span className="font-normal text-brand-gray">({spec.date})</span></p>
                              </motion.div>
                          ))}
                      </motion.div>
                  </div>
              </div>

              {/* Licenses & Certifications Section */}
              <div className="mt-24 bg-zinc-50 p-12 rounded-2xl">
                <motion.h2 
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{
                          initial: "offscreen",
                          whileInView: "onscreen",
                          viewport: { once: true, amount: 0.5 },
                          variants: cardVariants,
                      }}
                      className="text-3xl font-bold tracking-tight text-brand-dark text-center"
                  >
                      Licenses & Certifications
                  </motion.h2>
                  <div className="mt-12 overflow-hidden relative">
                     {/* Gradient Fades for seamless effect */}
                    <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-zinc-50 to-transparent z-10 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-zinc-50 to-transparent z-10 pointer-events-none" />

                      <motion.div
                          className="flex gap-6"
                          animate={{
                            // Card width (w-80 -> 320px) + gap (gap-6 -> 24px)
                            x: [0, -((320 + 24) * credentialsData.length)],
                          }}
                          transition={{
                            ease: 'linear',
                            duration: credentialsData.length * 2, // 2 seconds per card
                            repeat: Infinity,
                          }}
                      >
                          {[...credentialsData, ...credentialsData].map((cred, index) => (
                              <div
                                  key={index}
                                  className="bg-white p-4 rounded-lg shadow-md border border-yellow-400/40 flex-shrink-0 w-80 min-h-[110px] flex items-start space-x-4"
                              >
                                  <div className="flex-shrink-0 mt-1">
                                    <CertificateIcon />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-brand-dark">{cred.title}</p>
                                    <p className="text-sm text-brand-gray">{cred.issuer}</p>
                                    <p className="text-xs text-zinc-500">{cred.date}</p>
                                  </div>
                              </div>
                          ))}
                      </motion.div>
                  </div>
              </div>

              {/* CTA Section */}
              <motion.div 
                // FIX: Spread motion props to avoid TypeScript type errors.
                {...{
                    initial: "offscreen",
                    whileInView: "onscreen",
                    viewport: { once: true, amount: 0.5 },
                    variants: cardVariants,
                }}
                className="mt-24 text-center max-w-3xl mx-auto"
              >
                  <h2 className="text-3xl font-bold tracking-tight text-brand-dark">Let's Collaborate</h2>
                  <p className="mt-6 text-brand-gray leading-relaxed text-lg">
                      I am always looking to connect with professionals and organizations that share my passion for technological innovation. If you are looking for collaboration or expert advice in biotechnology, nanotechnology, or generative AI, feel free to reach out. I am here to help turn your ideas into tangible realities.
                  </p>
                  <div className="mt-8">
                       <a href="mailto:lh.reyes@uniandes.edu.co?subject=I%20saw%20your%20teaching%20portfolio.%20Let's%20talk." className="inline-block bg-yellow-400 text-brand-dark font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300">
                          Get in Touch
                       </a>
                  </div>
              </motion.div>

          </div>
      </div>
    </motion.div>
  );
};