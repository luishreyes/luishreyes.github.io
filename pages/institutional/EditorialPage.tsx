

import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { editorialData } from '../../components/data/institutional';
import { reviewedJournals, reviewsByArea, reviewAreaLabels, totalReviews, totalJournalsReviewed, ORCID_URL } from '../../components/data/peerReview';
import { useI18n, localize } from '../../context/i18n';

const eceIcons = [
  <img src="https://cdn-icons-png.flaticon.com/512/8998/8998530.png" alt="Subject Editor in Biotechnology & Bioprocessing Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/263/263075.png" alt="Special Issue Development Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/15766/15766048.png" alt="Academic & Industry Impact Icon" className="w-8 h-8" />,
];

const discoverBiotechIcons = [
  <img src="https://cdn-icons-png.flaticon.com/512/13296/13296573.png" alt="Manuscript Evaluation Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/263/263075.png" alt="Special Issue Coordination Icon" className="w-8 h-8" />,
  <img src="https://cdn-icons-png.flaticon.com/512/1212/1212158.png" alt="Quality Assurance Icon" className="w-8 h-8" />,
];

export const EditorialPage: React.FC = () => {
  const { t, lang } = useI18n();
  return (
    <PageWrapper noPadding>
        <div className="pt-16">
            <div className="sticky top-16 bg-zinc-50/95 backdrop-blur-sm z-20 py-6 border-b border-zinc-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-brand-dark text-left">{t('editorial.title')}</h1>
                    <p className="mt-4 text-lg text-left text-brand-gray">
                        {t('editorial.sub')}
                    </p>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {editorialData.map((role, index) => {
                      const icons = role.journal.includes('Education for Chemical Engineers') 
                          ? eceIcons 
                          : discoverBiotechIcons;
                      return (
                        <div key={index} className="bg-white rounded-xl shadow-lg border border-yellow-400/40 overflow-hidden flex flex-col md:flex-row">
                            <div className="md:w-1/3 flex items-center justify-center p-6 bg-zinc-50">
                                <img className="h-48 w-auto object-contain" src={role.imageUrl} alt={`Logo for ${role.journal}`} />
                            </div>
                            <div className="p-8 flex flex-col justify-between md:w-2/3">
                                <div>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline gap-2 mb-2">
                                        <h3 className="text-2xl font-bold text-brand-dark leading-tight">{role.journal}</h3>
                                    </div>
                                    <p className="block text-sm font-semibold text-yellow-500 uppercase tracking-wide">{localize(role.role, lang)} ({role.startDate} - {role.endDate})</p>

                                    <p className="mt-4 text-brand-gray text-base">{localize(role.description, lang)}</p>

                                    <ul className="mt-5 list-none space-y-4 text-brand-gray">
                                        {role.responsibilities.map((resp, i) => (
                                            <li key={i} className="flex items-start">
                                                <div className="flex-shrink-0 mr-4 w-8 h-8 flex items-center justify-center">
                                                    {icons[i % icons.length]}
                                                </div>
                                                <span className="leading-relaxed text-sm">{localize(resp, lang)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="mt-6">
                                    <a 
                                        href={role.journalUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block bg-yellow-400 text-brand-dark font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors duration-300 text-sm"
                                    >
                                        {t('editorial.visitJournal')}
                                    </a>
                                </div>
                            </div>
                        </div>
                      )
                    })}
                </div>

                {/* Peer review: aggregate only, from the public ORCID record */}
                <section className="mt-20">
                    <h2 className="text-3xl font-bold tracking-tight text-brand-dark mb-3">{t('peerReview.title')}</h2>
                    <p className="text-brand-gray leading-relaxed max-w-3xl">{t('peerReview.lead')}</p>

                    <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4">
                        <p className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-brand-dark tabular-nums">{totalReviews}</span>
                            <span className="text-brand-gray">{t('peerReview.reviews')}</span>
                        </p>
                        <p className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-brand-dark tabular-nums">{totalJournalsReviewed}</span>
                            <span className="text-brand-gray">{t('peerReview.journals')}</span>
                        </p>
                        <a
                            href={ORCID_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-yellow-400 text-brand-dark font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-yellow-500 transition-colors text-sm"
                        >
                            {t('peerReview.orcid')} &#8599;
                        </a>
                    </div>

                    <h3 className="mt-12 mb-4 text-sm font-bold uppercase tracking-widest text-brand-dark">{t('peerReview.areasTitle')}</h3>
                    <ul className="space-y-3 max-w-3xl">
                        {reviewsByArea.map(({ area, reviews, journals }) => (
                            <li key={area}>
                                <div className="flex items-baseline justify-between gap-4 text-sm">
                                    <span className="text-brand-dark font-medium">{localize(reviewAreaLabels[area], lang)}</span>
                                    <span className="text-brand-gray whitespace-nowrap tabular-nums">
                                        {reviews} · {journals} {t('peerReview.journalsShort')}
                                    </span>
                                </div>
                                <div className="mt-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(reviews / totalReviews) * 100}%` }} />
                                </div>
                            </li>
                        ))}
                    </ul>

                    <h3 className="mt-12 mb-4 text-sm font-bold uppercase tracking-widest text-brand-dark">{t('peerReview.journalsTitle')}</h3>
                    <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm max-w-4xl">
                        {reviewedJournals.map(({ journal, reviews }) => (
                            <li key={journal} className="flex items-baseline justify-between gap-3 border-b border-zinc-100 py-1.5">
                                <span className="text-brand-gray">{journal}</span>
                                <span className="text-brand-dark font-semibold tabular-nums">{reviews ?? '·'}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-8 text-xs text-brand-gray italic max-w-3xl">{t('peerReview.note')}</p>
                </section>
            </div>
        </div>
    </PageWrapper>
  );
};