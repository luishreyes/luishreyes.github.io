
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

export interface GraduatedStudent {
  name: string;
  degree: 'Ph.D.' | 'M.S.' | 'Doctor';
  program?: string;
  graduationYear: number;
  startedYear: number;
  currentPosition?: string;
  thesisTitle: string;
  laymanSummary: LaymanSummaryPoint[];
  imageUrl: string;
}

export interface CurrentStudent {
    name: string;
    degree: 'Ph.D.' | 'M.S.';
    info: string;
}

export interface Education {
  degree: string;
  field: string;
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
  role: string;
  company: string;
  period: string;
  location: string;
}

export interface Committee {
  title: string;
  role?: string;
  startYear: number;
  endYear?: number | 'Present';
  description: string[]; // Each string is a paragraph
  level?: 'National' | 'University' | 'Faculty' | 'Department';
}

export interface Grant {
  title: string;
  startYear: number;
  endYear?: number;
  organization: string;
  role: string;
  status: string;
}

export interface Recognition {
  title: string;
  awarder: string;
  category: string;
  year: number;
  projectTitle: string;
  authors: string[];
  summary: string[];
  url: string;
  imageUrl: string;
}
