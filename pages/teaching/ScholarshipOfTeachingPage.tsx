


import React, { useMemo } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import type { Product } from '../../types';
import { motion } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext';

// FIX: Changed component to React.FC to resolve TypeScript error with the 'key' prop.
const PublicationCard: React.FC<{ product: Product }> = ({ product }) => (
  <motion.div 
    // FIX: Spread motion props to avoid TypeScript type errors.
    {...{
      variants: {
        hidden: { opacity: 0, y: 20 },
        // FIX: Added 'as const' to prevent TypeScript from widening the string literal type, which caused a type error.
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
      },
    }}
    className="bg-white p-6 rounded-lg shadow-md border border-yellow-400/40"
  >
    <h3 className="text-lg font-bold text-brand-dark">{product.title}</h3>
    <p className="mt-2 text-sm text-brand-gray">{product.authors.join(', ')}</p>
    <p className="mt-1 text-sm text-brand-gray"><em>{product.publicationVenue}</em> ({product.publicationDate})</p>
    <a 
        href={product.url || `http://dx.doi.org/${product.doi}`} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-yellow-500 font-medium hover:underline text-sm mt-4 inline-block"
    >
      Read More &rarr;
    </a>
  </motion.div>
);

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const ResponsibilityIcons = [
  <img src="https://cdn-icons-png.flaticon.com/512/8998/8998530.png" alt="Subject Editor Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/263/263075.png" alt="Special Issue Development Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/15766/15766048.png" alt="Academic & Industry Impact Icon" className="w-8 h-8" />,
];

const editorialRole = {
    journal: 'Education for Chemical Engineers (Elsevier)',
    role: 'Editorial Board Member',
    tenure: 'Sep 2022 - Present',
    description: 'Education for Chemical Engineers is a peer-reviewed academic journal published by Elsevier on behalf of the IChemE. The journal is a primary forum for discussing the ongoing development of chemical engineering education, publishing papers from around the world to create a global network of chemical engineering academics.',
    responsibilities: [
      'Subject Editor in Biotechnology & Bioprocessing: Oversee the review and evaluation of manuscripts related to biotechnology, bioprocessing, and bio-related topics within the context of chemical engineering education.',
      'Special Issue Development: Actively propose and coordinate special issues on emerging topics in chemical engineering education, fostering discussions on innovative teaching methodologies and curriculum development.',
      'Academic & Industry Impact: Contribute to the strategic direction of the journal, ensuring the publication of high-quality research that bridges the gap between academic advancements and industrial applications in chemical engineering education.',
    ],
    imageUrl: 'https://ars.els-cdn.com/content/image/X17497728.jpg',
    journalUrl: 'https://www.sciencedirect.com/journal/education-for-chemical-engineers'
};


export const ScholarshipOfTeachingPage: React.FC = () => {
  const { products } = useAppData();
    const sotlPublications = useMemo(() => 
        products
            .filter(p => p.researchAreas?.includes('Scholarship of Teaching & Learning'))
            .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()),
    [products]);

    return (
        <PageWrapper noPadding>
            <div className="pt-16">
                <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">Scholarship of Teaching & Learning (SOTL)</h1>
                        <p className="mt-4 text-brand-gray leading-relaxed">
                            Applying rigorous research skills to improve pedagogical practices in engineering, enhancing student learning and professional development.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <motion.div 
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        transition: { duration: 0.5, delay: 0.1 },
                      }}
                      className="mb-12"
                    >
                        <p className="text-lg text-brand-gray leading-relaxed">
                            My commitment to education extends beyond the classroom into the systematic study of teaching and learning itself. I am an active participant in the Scholarship of Teaching and Learning (SOTL) community, where I apply my research skills to improve pedagogical practices in engineering.
                        </p>
                        <p className="mt-4 text-lg text-brand-gray leading-relaxed">
                            This work involves designing, implementing, and rigorously assessing innovative teaching strategies to enhance student learning and professional development. My SOTL research often focuses on integrating real-world industry challenges into the curriculum, fostering essential skills like teamwork and creativity, and leveraging new technologies to create more engaging and effective learning environments. Below are some of the products of this research.
                        </p>
                    </motion.div>
                    
                     <motion.div 
                      // FIX: Spread motion props to avoid TypeScript type errors.
                      {...{
                        initial: { opacity: 0, y: 20 },
                        whileInView: { opacity: 1, y: 0 },
                        viewport: { once: true, amount: 0.1 },
                        transition: { duration: 0.5, delay: 0.2 },
                      }}
                      className="my-16"
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">Editorial Contributions</h2>
                        <div className="bg-white rounded-xl shadow-lg border border-yellow-400/40 overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3 flex items-center justify-center p-6 bg-zinc-50">
                                <img className="h-48 w-auto object-contain" src={editorialRole.imageUrl} alt={`Cover image for ${editorialRole.journal}`} />
                            </div>
                            <div className="p-8 flex flex-col justify-between md:w-2/3">
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-2">
                                        <h3 className="text-2xl font-bold text-brand-dark leading-tight">{editorialRole.journal}</h3>
                                    </div>
                                    <p className="block text-sm font-semibold text-yellow-500 uppercase tracking-wide">{editorialRole.role} ({editorialRole.tenure})</p>
                                    
                                    <p className="mt-4 text-brand-gray text-base">{editorialRole.description}</p>

                                    <ul className="mt-5 list-none space-y-4 text-brand-gray text-sm">
                                        {editorialRole.responsibilities.map((resp, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="flex-shrink-0 mt-1 mr-4">
                                                    {ResponsibilityIcons[i % ResponsibilityIcons.length]}
                                                </div>
                                                <span className="leading-relaxed text-sm">{resp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-6">
                                    <a 
                                        href={editorialRole.journalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-yellow-400 text-brand-dark font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 text-sm"
                                    >
                                        Visit Journal
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">Related Publications</h2>
                    <motion.div 
                        // FIX: Spread motion props to avoid TypeScript type errors.
                        {...{
                            variants: containerVariants,
                            initial: "hidden",
                            whileInView: "visible",
                            viewport: { once: true, amount: 0.1 }
                        }}
                        className="space-y-6"
                    >
                        {sotlPublications.map(pub => (
                            <PublicationCard key={pub.doi} product={pub} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </PageWrapper>
    );
};