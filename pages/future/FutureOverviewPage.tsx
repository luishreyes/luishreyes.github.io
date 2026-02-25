import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { motion } from 'framer-motion';

const futureItems = [
    {
        title: "Pioneering Research",
        description: "Focusing on the convergence of synthetic biology and AI to create intelligent, self-regulating microbial systems for sustainable bioproduction.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.25 22.5l-.648-1.947a4.5 4.5 0 00-3.09-3.09L9.75 18l1.947-.648a4.5 4.5 0 003.09-3.09l.648-1.947 1.947.648a4.5 4.5 0 003.09 3.09l.648 1.947-1.947.648a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
        )
    },
    {
        title: "Building Collaborations",
        description: "Actively seeking partnerships with academic and industrial leaders to build interdisciplinary teams and accelerate the translation of research into real-world impact.",
         icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.118 2.72c.341.054.682.107 1.022.162m-1.022-.162L3.823 17.14a3 3 0 00-2.24 2.72 3 3 0 002.72 3.228c.433.06.88.114 1.344.162m-1.344-.162a3 3 0 002.72-3.228 3 3 0 00-2.72-2.24m6.654 4.968a3 3 0 00-2.72 2.24 3 3 0 002.72 3.228 3 3 0 003.228-2.72 3 3 0 00-2.24-3.228m-3.228 2.24a3 3 0 00-3.228-2.24 3 3 0 00-2.72 3.228c.06.433.114.88.162 1.344m1.344-1.344a3 3 0 003.228 2.24 3 3 0 002.24-2.72 3 3 0 00-3.228-3.228M12 6.75a2.25 2.25 0 110 4.5 2.25 2.25 0 010-4.5z" />
            </svg>
        )
    },
     {
        title: "Mentoring Leaders",
        description: "Committing to the mentorship of a diverse group of students and postdocs, empowering them with the skills to become the next generation of scientific leaders.",
        icon: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
        )
    }
];


const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
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

export const FutureOverviewPage = () => {
  return (
    <PageWrapper noPadding>
        <div className="pt-16">
            <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Future Plans</h1>
                    <p className="mt-4 text-brand-gray leading-relaxed">
                        Looking ahead to the boundaries of biological engineering, focusing on pioneering research, fostering dynamic collaborations, and mentoring innovators.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    <p className="text-brand-gray text-lg leading-relaxed">
                        My work will continue to push the boundaries of biological engineering. My focus is centered on pioneering new research directions, fostering dynamic collaborations, and mentoring the next generation of scientific innovators to tackle the grand challenges in health and sustainability.
                    </p>
                </motion.div>
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    {...{
                    variants: containerVariants,
                    initial: "hidden",
                    animate: "visible",
                    }}
                >
                    {futureItems.map(item => (
                        <motion.div
                            key={item.title}
                            {...{variants: itemVariants}}
                            className="bg-white p-8 rounded-lg shadow-lg border border-zinc-100 text-center flex flex-col items-center transition-transform hover:-translate-y-1"
                        >
                            <div className="bg-yellow-400/20 p-4 rounded-full mb-4">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-brand-dark mb-2">{item.title}</h3>
                            <p className="text-brand-gray text-sm">{item.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    </PageWrapper>
  );
};