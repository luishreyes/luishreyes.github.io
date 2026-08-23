import type { Localized } from '../../context/i18n';

/**
 * Peer review activity, as recorded publicly on ORCID.
 *
 * The count comes from ORCID, which is public and can be checked. Journals
 * refereed through publisher systems without ORCID credit are listed too, but
 * without a number: those dashboards show one row per review round, so the same
 * manuscript appears two or three times and counting rows would overstate the
 * work. The journal is a fact; the row count is not a review count.
 *
 * Manuscripts under review are confidential. Nothing here identifies a paper,
 * an author, or an outcome — only the journal and how many reviews it received.
 */

export const ORCID_ID = '0000-0001-7251-5298';
export const ORCID_URL = `https://orcid.org/${ORCID_ID}`;

export type ReviewArea =
  | 'education'
  | 'biotech'
  | 'food'
  | 'materials'
  | 'chemeng'
  | 'chemistry';

export interface ReviewedJournal {
  journal: string;
  /** Reviews credited on ORCID. Absent when the journal was refereed through a
   *  publisher system that did not deposit the credit. */
  reviews?: number;
  area: ReviewArea;
}

export const reviewAreaLabels: Record<ReviewArea, Localized> = {
  education: { en: 'Engineering and higher education', es: 'Ingeniería y educación superior' },
  materials: { en: 'Materials and nanotechnology', es: 'Materiales y nanotecnología' },
  biotech: { en: 'Biotechnology and microbiology', es: 'Biotecnología y microbiología' },
  chemistry: { en: 'Chemistry, pharmacy and multidisciplinary', es: 'Química, farmacia y multidisciplinares' },
  food: { en: 'Food science', es: 'Ciencia de alimentos' },
  chemeng: { en: 'Chemical and process engineering', es: 'Ingeniería química y de procesos' },
};

export const reviewedJournals: ReviewedJournal[] = [
  { journal: 'Education for Chemical Engineers', reviews: 16, area: 'education' },
  { journal: 'Heliyon', reviews: 8, area: 'chemistry' },
  { journal: 'Food Bioscience', reviews: 7, area: 'food' },
  { journal: 'International Journal of Biological Macromolecules', reviews: 6, area: 'materials' },
  { journal: 'Molecules', reviews: 6, area: 'chemistry' },
  { journal: 'International Journal of Educational Technology in Higher Education', reviews: 4, area: 'education' },
  { journal: 'Biocatalysis and Agricultural Biotechnology', reviews: 3, area: 'biotech' },
  { journal: 'Biotechnology Reports', reviews: 3, area: 'biotech' },
  { journal: 'Materials Today Nano', reviews: 3, area: 'materials' },
  { journal: 'Next Nanotechnology', reviews: 3, area: 'materials' },
  { journal: 'Applied Food Research', reviews: 2, area: 'food' },
  { journal: 'Applied Microbiology and Biotechnology', reviews: 2, area: 'biotech' },
  { journal: 'Biotechnology Advances', reviews: 2, area: 'biotech' },
  { journal: 'Chemical Engineering Research & Design', reviews: 2, area: 'chemeng' },
  { journal: 'Food Hydrocolloids for Health', reviews: 2, area: 'food' },
  { journal: 'Foods', reviews: 2, area: 'food' },
  { journal: 'Hybrid Advances', reviews: 2, area: 'materials' },
  { journal: 'Innovative Food Science & Emerging Technologies', reviews: 2, area: 'food' },
  { journal: 'Journal of Biotechnology', reviews: 2, area: 'biotech' },
  { journal: 'Journal of Pharmaceutical Analysis', reviews: 2, area: 'chemistry' },
  { journal: 'Microorganisms', reviews: 2, area: 'biotech' },
  { journal: 'ACS Sustainable Chemistry & Engineering', reviews: 1, area: 'chemeng' },
  { journal: 'Applied Microbiology', reviews: 1, area: 'biotech' },
  { journal: 'Applied Sciences', reviews: 1, area: 'chemeng' },
  { journal: 'Biomolecules', reviews: 1, area: 'biotech' },
  { journal: 'Brazilian Journal of Chemical Engineering', reviews: 1, area: 'chemeng' },
  { journal: 'Catalysts', reviews: 1, area: 'materials' },
  { journal: 'Education Sciences', reviews: 1, area: 'education' },
  { journal: 'Inorganics', reviews: 1, area: 'materials' },
  { journal: 'International Journal of Molecular Sciences', reviews: 1, area: 'chemistry' },
  { journal: 'Journal of Fungi', reviews: 1, area: 'biotech' },
  { journal: 'Journal of Water Process Engineering', reviews: 1, area: 'chemeng' },
  { journal: 'Learning and Instruction', reviews: 1, area: 'education' },
  { journal: 'Materials Chemistry and Physics', reviews: 1, area: 'materials' },
  { journal: 'Materials Letters', reviews: 1, area: 'materials' },
  { journal: 'Materials Today Communications', reviews: 1, area: 'materials' },
  { journal: 'New Biotechnology', reviews: 1, area: 'biotech' },
  { journal: 'Polymers', reviews: 1, area: 'materials' },
  { journal: 'Processes', reviews: 1, area: 'chemeng' },
  { journal: 'Social Sciences & Humanities Open', reviews: 1, area: 'education' },
  { journal: 'Vaccines', reviews: 1, area: 'biotech' },
  { journal: 'Archives of Microbiology', area: 'biotech' },
  { journal: 'Discover Biotechnology', area: 'biotech' },
  { journal: 'Discover Polymers', area: 'materials' },
  { journal: 'Journal of Biological Engineering', area: 'biotech' },
  { journal: 'Journal of Food Process Engineering', area: 'food' },
  { journal: 'Journal of Food Processing and Preservation', area: 'food' },
  { journal: 'Journal of Nanoparticle Research', area: 'materials' },
  { journal: 'Microbial Biotechnology', area: 'biotech' },
  { journal: 'Microbial Cell Factories', area: 'biotech' },
  { journal: 'Polymers for Advanced Technologies', area: 'materials' },
  { journal: 'Scientific Reports', area: 'chemistry' },
  { journal: 'Veterinary Research', area: 'biotech' },
  { journal: 'World Journal of Microbiology and Biotechnology', area: 'biotech' },
];

/** Reviews per area, largest first. */
export const reviewsByArea = (Object.keys(reviewAreaLabels) as ReviewArea[])
  .map((area) => ({
    area,
    reviews: reviewedJournals
      .filter((entry) => entry.area === area)
      .reduce((total, entry) => total + (entry.reviews ?? 0), 0),
    journals: reviewedJournals.filter((entry) => entry.area === area).length,
  }))
  .sort((a, b) => b.reviews - a.reviews);

/** Reviews credited on ORCID. Journals refereed without ORCID credit are in the
 *  list above but contribute no number, since their review count is not public. */
export const totalReviews = reviewedJournals.reduce((total, entry) => total + (entry.reviews ?? 0), 0);
export const totalJournalsReviewed = reviewedJournals.length;
