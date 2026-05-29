import type { Localized } from './context/i18n';

export type ProductType =
  | 'Research Paper'
  | 'Review Article'
  | 'Editorial'
  | 'Outreach Article'
  | 'Book'
  | 'Book Chapter'
  | 'Patent'
  | 'Preprint'
  | 'Conference'
  | 'Other';

export type ResearchArea =
  | 'Bioprocess Engineering'
  | 'Molecular & Synthetic Biology'
  | 'Smart Biomaterials & Nanobiotechnology'
  | 'Computational Biology & AI-Driven Design'
  | 'Reverse Engineering of Microorganisms'
  | 'Sustainability & Circular Economy'
  | 'Multisensory Experience Design'
  | 'Scholarship of Teaching & Learning';

export interface LaymanSummaryPoint {
  question: string;
  answer: string;
}

export interface Product {
  title: string;
  type: ProductType;
  authors: string[];
  publicationVenue: string;
  publicationDate: string;
  doi: string;
  corpusId?: string;
  url?: string;
  laymanSummary: LaymanSummaryPoint[];
  keywords: string[];
  imageUrl: string;
  status?: string;
  researchAreas?: ResearchArea[];
}

export interface StudentLaymanSummaryPoint {
  question: Localized;
  answer: Localized;
}

export interface GraduatedStudent {
  name: string;
  degree: 'Ph.D.' | 'M.S.' | 'Doctor';
  program?: Localized;
  graduationYear: number;
  startedYear: number;
  currentPosition?: Localized;
  linkedinUrl?: string;
  thesisTitle: string;
  laymanSummary: StudentLaymanSummaryPoint[];
  imageUrl: string;
}

export interface CurrentStudent {
    name: string;
    degree: 'Ph.D.' | 'M.S.';
    info: Localized;
}

export interface Education {
  degree: Localized;
  field: Localized;
  institution: string;
  location: string;
  year: string; // Changed to string to accommodate ranges
}

export interface Specialization {
  title: string;
  institution: string;
  date: string;
  description: string;
  skills: string[];
}

export interface Credential {
  title: string;
  issuer: string;
  date: string;
}

export interface WorkExperience {
  role: Localized;
  company: string;
  period: string;
  location: string;
}

export interface Committee {
  title: Localized;
  role?: Localized;
  startYear: number;
  endYear?: number | 'Present';
  description: Localized[]; // Each string is a paragraph
  level?: 'National' | 'University' | 'Faculty' | 'Department';
}

export interface Grant {
  title: string;
  startYear: number;
  endYear?: number;
  organization: string;
  role: Localized;
  status: string;
}

export interface Recognition {
  title: string;
  awarder: string;
  category: Localized;
  year: number;
  projectTitle: string;
  authors: string[];
  summary: Localized[];
  url: string;
  imageUrl: string;
}
