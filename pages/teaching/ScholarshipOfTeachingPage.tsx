


import React, { useMemo } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { Link } from 'react-router-dom';
import { useI18n, localize, fill, num, cardinal } from '../../context/i18n';
import { cycleTurns, pouLongitudinalStudy } from '../../components/data/educationResearch';
import { awardsData } from '../../components/data/awards';
import { grantsData } from '../../components/data/grants';
import type { Product } from '../../types';
import { motion } from 'framer-motion';
import { useAppData } from '../../context/AppDataContext';

// FIX: Changed component to React.FC to resolve TypeScript error with the 'key' prop.
const PublicationCard: React.FC<{ product: Product }> = ({ product }) => {
  const { t } = useI18n();
  return (
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
      {t('sotl.readMore')}
    </a>
  </motion.div>
  );
};

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



// Lucide icons, inline so they inherit size and colour from the surrounding text.
const IconMeasure = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
  </svg>
);
const IconPublish = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
  </svg>
);
const IconRedesign = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21.17 6.81a1 1 0 0 0-3.98-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.63l4.35-1.32a2 2 0 0 0 .83-.5z" /><path d="m15 5 4 4" />
  </svg>
);
const IconChevron = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const turnAward = (turn: (typeof cycleTurns)[number]) =>
  turn.recognizedBy ? awardsData.find((a) => a.awarder === turn.recognizedBy) : undefined;

const ResearchCycle: React.FC = () => {
  const { t, lang } = useI18n();
  const steps = [
    { icon: <IconMeasure />, title: t('sotl.cycle.s1'), desc: t('sotl.cycle.s1d') },
    { icon: <IconPublish />, title: t('sotl.cycle.s2'), desc: t('sotl.cycle.s2d') },
    { icon: <IconRedesign />, title: t('sotl.cycle.s3'), desc: t('sotl.cycle.s3d') },
  ];

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold tracking-tight text-brand-dark mb-3">{t('sotl.cycle.title')}</h2>
      <p className="text-brand-gray leading-relaxed mb-10 max-w-3xl">{t('sotl.cycle.sub')}</p>

      {/* The loop */}
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            <motion.div
              {...{
                initial: { opacity: 0, y: 12 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { duration: 0.4, delay: i * 0.12 },
              }}
              className="flex-1 bg-white rounded-lg border border-zinc-200 border-t-4 border-t-yellow-400 p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl text-yellow-500">{step.icon}</span>
                <h3 className="text-lg font-bold text-brand-dark">{step.title}</h3>
                <span className="ml-auto font-mono text-xs text-zinc-400">{i + 1}</span>
              </div>
              <p className="text-sm text-brand-gray leading-relaxed">{step.desc}</p>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center text-yellow-500 text-xl rotate-90 sm:rotate-0" aria-hidden="true">
                <IconChevron />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Return path: the loop closing back on itself */}
      <div className="relative mt-1" aria-hidden="true">
        <div className="h-10 border-b-2 border-l-2 border-r-2 border-dashed border-yellow-400 rounded-b-2xl" />
        <svg
          className="absolute -top-[7px] -left-[8px] w-4 h-4 text-yellow-500"
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </div>
      <p className="mt-3 text-center text-xs font-bold uppercase tracking-widest text-brand-gray">
        {t('sotl.cycle.return')}
      </p>

      {/* The three turns that have actually run */}
      <h3 className="mt-14 mb-6 text-sm font-bold uppercase tracking-widest text-brand-dark flex items-center gap-4">
        {t('sotl.cycle.turns')}
        <span className="flex-grow h-px bg-zinc-200" />
      </h3>
      <ol className="space-y-4">
        {cycleTurns.map((turn, i) => (
          <motion.li
            key={turn.years}
            {...{
              initial: { opacity: 0, x: -10 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.1 },
            }}
            className="bg-white rounded-lg border border-zinc-200 p-6 sm:flex sm:gap-6 transition-colors hover:border-yellow-400/60"
          >
            <div className="sm:w-32 flex-shrink-0 mb-3 sm:mb-0">
              <p className="font-mono text-xs uppercase tracking-widest text-yellow-600 font-bold">
                {t('sotl.cycle.turn')} {i + 1}
              </p>
              <p className="font-mono text-sm text-brand-dark font-bold mt-1">{turn.years}</p>
            </div>
            <div className="min-w-0">
              <p className="text-brand-gray leading-relaxed">{localize(turn.change, lang)}</p>
              <a
                href={`https://doi.org/${turn.paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-brand-dark underline decoration-yellow-400 decoration-2 underline-offset-4 hover:text-yellow-600 transition-colors"
              >
                {`${turn.paper.authors} (${turn.paper.year})`}
              </a>
              <p className="text-xs text-brand-gray mt-1">{`${turn.paper.journal} ${turn.paper.locator}`}</p>
              {turnAward(turn) && (
                <p className="mt-4 bg-brand-dark text-white text-sm rounded px-4 py-3 leading-relaxed">
                  {fill(t('sotl.turn.recognized'), { award: turnAward(turn)!.title, year: turnAward(turn)!.year })}
                </p>
              )}
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
};


// Grants tagged area: 'education' in the grant record. Tagging a new one there
// lists it here without touching this page.
const educationGrants = grantsData
  .filter((g) => g.area === 'education')
  .sort((a, b) => b.startYear - a.startYear);

const FundedEducationResearch: React.FC = () => {
  const { t, lang } = useI18n();
  if (educationGrants.length === 0) return null;

  return (
    <section className="my-16">
      <h2 className="text-3xl font-bold tracking-tight text-brand-dark mb-3">{t('sotl.funded.title')}</h2>
      <p className="text-brand-gray leading-relaxed mb-8 max-w-3xl">{t('sotl.funded.sub')}</p>

      <div className="grid gap-4 md:grid-cols-2">
        {educationGrants.map((grant, i) => (
          <motion.article
            key={grant.title}
            {...{
              initial: { opacity: 0, y: 12 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.4, delay: i * 0.1 },
            }}
            className="bg-white rounded-lg border border-zinc-200 border-l-4 border-l-yellow-400 p-6 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-bold text-brand-dark">
                {grant.startYear}{grant.endYear ? `-${grant.endYear}` : ''}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                grant.status === 'Concluded' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {grant.status === 'Concluded' ? t('grants.status.concluded') : t('grants.status.inProgress')}
              </span>
            </div>
            <h3 className="font-bold text-brand-dark leading-snug">{grant.title}</h3>
            <p className="mt-3 text-sm text-brand-gray mt-auto pt-3">
              {grant.organization}
              <span className="block text-xs uppercase tracking-wider font-semibold text-yellow-600 mt-1">
                {localize(grant.role, lang)}
              </span>
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

const study = pouLongitudinalStudy;

export const ScholarshipOfTeachingPage: React.FC = () => {
  const { products } = useAppData();
  const { t, lang } = useI18n();
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
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">{t('sotl.title')}</h1>
                        <p className="mt-4 text-brand-gray leading-relaxed">
                            {t('sotl.sub')}
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
                            {t('sotl.intro1')}
                        </p>
                        <p className="mt-4 text-lg text-brand-gray leading-relaxed">
                            {fill(t('sotl.intro2'), {
                                students: study.students,
                                cohorts: cardinal(study.cohorts, lang),
                                citation: `${study.paper.authors}, ${study.paper.year}`,
                                test: t('sotl.test.anova'),
                                f: num(study.writtenCommunication.f, lang, 2),
                                p: num(study.writtenCommunication.pBelow, lang, 3),
                                criteria: cardinal(study.blindEvaluation.criteria, lang),
                                pLow: num(study.blindEvaluation.pLow, lang, 3),
                                pHigh: num(study.blindEvaluation.pHigh, lang, 3),
                                motivationNow: study.sustainedMotivation.now,
                                motivationBefore: study.sustainedMotivation.before,
                            })}
                        </p>
                        <p className="mt-4 text-lg text-brand-gray leading-relaxed">
                            {t('sotl.intro3')}
                        </p>

                        <div className="mt-8 border-l-4 border-yellow-400 bg-zinc-50 p-6 rounded-r-lg">
                            <p className="text-brand-gray leading-relaxed">{t('sotl.case')}</p>
                            <Link
                                to="/teaching/unit-ops"
                                className="mt-3 inline-flex items-center text-sm font-bold uppercase tracking-wider text-brand-dark bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500 transition-colors"
                            >
                                {t('sotl.caseCta')}
                            </Link>
                        </div>
                    </motion.div>

                    <ResearchCycle />

                    <FundedEducationResearch />

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
                        <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">{t('sotl.editorial')}</h2>
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
                                        {t('sotl.visitJournal')}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark text-left mb-8">{t('sotl.publications')}</h2>
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