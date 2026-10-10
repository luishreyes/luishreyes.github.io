export interface EdcoCourse {
  year: number;
  title: string;
  titleEn?: string;
  type: 'Open Course' | 'Corporate Course' | 'Summer School';
  client?: string;
  attendees: number;
  role: 'Coordinator' | 'Instructor';
  url?: string;
  /** MOOCs only: share of enrolled learners who completed the course (0-1). */
  completionRate?: number;
}

export const edcoCoursesData: EdcoCourse[] = [
  // 2026
  {
    year: 2026,
    title: 'IA Aplicada a la Productividad',
    titleEn: 'AI Applied to Productivity',
    type: 'Corporate Course',
    client: 'Corporación Colombia Crea Talento (CoCrea)',
    attendees: 40,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Herramientas de la IA',
    titleEn: 'AI Tools',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos - Promoción 2',
    titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models - 2nd Cohort',
    type: 'Open Course',
    client: 'EDCO',
    attendees: 29,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos',
    titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models',
    type: 'Open Course',
    client: 'EDCO',
    attendees: 39,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Fundamentals of Using Generative AI',
    titleEn: 'Fundamentals of Using Generative AI',
    type: 'Open Course',
    client: 'Coursera (MOOC)',
    attendees: 227,
    completionRate: 0.21,
    role: 'Instructor',
    url: 'https://www.coursera.org/learn/fundamentals-of-using-generative-ai'
  },
  {
    year: 2026,
    title: 'IA Generativa para el Análisis de Datos Estructurados',
    titleEn: 'Generative AI for Structured Data Analysis',
    type: 'Open Course',
    client: 'Coursera (MOOC)',
    attendees: 0,
    role: 'Instructor'
  },

  {
    year: 2026,
    title: 'Fundamentos de Ingeniería de Prompts',
    titleEn: 'Prompt Engineering Fundamentals',
    type: 'Corporate Course',
    client: 'Banco de la Producción S. A. (Produbanco), Ecuador',
    attendees: 20,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Modelos de la IA',
    titleEn: 'AI Models',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos - Promoción 3',
    titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models - 3rd Cohort',
    type: 'Open Course',
    client: 'EDCO',
    attendees: 36,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Transformando la Productividad Corporativa con IA: Aprovechando el Potencial de los Modelos Generativos en el Entorno Empresarial',
    titleEn: 'Transforming Corporate Productivity with AI: Harnessing the Potential of Generative Models in the Business Environment',
    type: 'Corporate Course',
    client: 'Compañía de Seguros Bolívar S. A. (ARL Seguros Bolívar)',
    attendees: 30,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Dominando la Inteligencia Artificial: Google Workspace, Gemini y Herramientas Generativas',
    titleEn: 'Mastering Artificial Intelligence: Google Workspace, Gemini and Generative Tools',
    type: 'Corporate Course',
    client: 'Banco Davivienda S. A.',
    attendees: 15,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'IA Generativa Aplicada',
    titleEn: 'Applied Generative AI',
    type: 'Corporate Course',
    client: 'Empresa Colombiana de Productos Veterinarios (Vecol)',
    attendees: 40,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Curso Liderazgo en IA',
    titleEn: 'AI Leadership Course',
    type: 'Corporate Course',
    client: 'Universidad de los Andes',
    attendees: 70,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Inteligencia Artificial Aplicada al Negocio Oil & Gas',
    titleEn: 'Artificial Intelligence Applied to the Oil & Gas Business',
    type: 'Corporate Course',
    client: 'Ecopetrol S.A.',
    attendees: 25,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Inteligencia Artificial Aplicada al Negocio Oil & Gas',
    titleEn: 'Artificial Intelligence Applied to the Oil & Gas Business',
    type: 'Corporate Course',
    client: 'Ecopetrol S.A.',
    attendees: 25,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 35,
    role: 'Instructor'
  },

  // 2025
  { 
    year: 2025, 
    title: 'Conferencia IA Generativa y su Impacto en la Seguridad y Salud Laboral', 
    titleEn: 'Conference on Generative AI and its Impact on Occupational Health and Safety', 
    type: 'Corporate Course', 
    client: 'Compañía de Seguros Bolívar S. A. (ARL Seguros Bolívar)', 
    attendees: 93, 
    role: 'Instructor' 
  },
  { 
    year: 2025, 
    title: 'Transformando la Productividad Corporativa con IA: Aprovechando el Potencial de los Modelos Generativos en el Entorno Empresarial (Grupo 2)', 
    titleEn: 'Transforming Corporate Productivity with AI: Harnessing the Potential of Generative Models in the Business Environment (Group 2)', 
    type: 'Corporate Course', 
    client: 'Compañía de Seguros Bolívar S. A. (ARL Seguros Bolívar)', 
    attendees: 26, 
    role: 'Instructor' 
  },
  { 
    year: 2025, 
    title: 'Transformando la Productividad Corporativa con IA: Aprovechando el Potencial de los Modelos Generativos en el Entorno Empresarial (Grupo 1)', 
    titleEn: 'Transforming Corporate Productivity with AI: Harnessing the Potential of Generative Models in the Business Environment (Group 1)', 
    type: 'Corporate Course', 
    client: 'Compañía de Seguros Bolívar S. A. (ARL Seguros Bolívar)', 
    attendees: 15, 
    role: 'Instructor' 
  },
  { 
    year: 2025, 
    title: 'Taller Masa Madre: Sabor y Ciencia', 
    titleEn: 'Sourdough Workshop: Flavor and Science', 
    type: 'Open Course', 
    client: 'EDCO', 
    attendees: 26, 
    role: 'Instructor' 
  },
  {
    year: 2025,
    title: 'Fundamentos del Uso de IA Generativa',
    titleEn: 'Fundamentals of Generative AI Usage',
    type: 'Open Course',
    client: 'Coursera (MOOC)',
    attendees: 16584,
    completionRate: 0.52,
    role: 'Instructor',
    url: 'https://www.coursera.org/learn/fundamentos-del-uso-de-ia-generativa'
  },
  { year: 2025, title: 'Prompt Engineering', titleEn: 'Prompt Engineering', type: 'Corporate Course', client: 'Bancolombia S. A. (Analítica de Datos)', attendees: 33, role: 'Instructor' },
  { year: 2025, title: 'Transformando la Productividad Corporativa con IA: Aprovechando el Potencial de los Modelos Generativos en el Entorno Empresarial', titleEn: 'Transforming Corporate Productivity with AI: Harnessing the Potential of Generative Models in the Business Environment', type: 'Corporate Course', client: 'Corporación Centro de Investigación en Palma de Aceite (Cenipalma)', attendees: 35, role: 'Instructor' },
  { year: 2025, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Open Course', client: 'EDCO', attendees: 37, role: 'Instructor' },
  { year: 2025, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Open Course', client: 'EDCO', attendees: 34, role: 'Instructor' },
  { year: 2025, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Open Course', client: 'EDCO', attendees: 36, role: 'Instructor' },
  { year: 2025, title: 'Biotecnología Marina: De la Bioprospección al Escalado', titleEn: 'Marine Biotechnology: From Bioprospecting to Scale-up', type: 'Summer School', client: 'CABBIO', attendees: 19, role: 'Instructor' },
  { year: 2025, title: 'IA Generativa en Acción: Del Concepto a la Práctica', titleEn: 'Generative AI in Action: From Concept to Practice', type: 'Open Course', client: 'EDCO', attendees: 26, role: 'Instructor' },
  { year: 2025, title: 'Prompt Engineering', titleEn: 'Prompt Engineering', type: 'Corporate Course', client: 'Banco Bilbao Vizcaya Argentaria Colombia S. A. (BBVA Colombia), Banca Wealth', attendees: 19, role: 'Instructor' },
  { year: 2025, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Corporate Course', client: 'Fundación Santa Fe de Bogotá', attendees: 32, role: 'Instructor' },
  { year: 2025, title: 'Inteligencia Artificial Generativa para Químicos', titleEn: 'Generative Artificial Intelligence for Chemists', type: 'Corporate Course', client: 'Abbott Laboratories de Colombia S. A. (Abbott)', attendees: 74, role: 'Instructor' },
  { year: 2025, title: 'Prompt Engineering', titleEn: 'Prompt Engineering', type: 'Corporate Course', client: 'Bancolombia (Gerencia de Aprendizaje)', attendees: 35, role: 'Instructor' },
  { year: 2025, title: 'Liderazgo para la Alta Gerencia en la Transformación Digital', titleEn: 'Leadership for Senior Management in Digital Transformation', type: 'Corporate Course', client: 'Bancolombia S. A. (Vicepresidencia de Riesgos)', attendees: 20, role: 'Instructor' },
  
  // 2024 and older
  { year: 2024, title: 'Claves para Triunfar con tu Cervecería Artesanal: Operaciones, Finanzas y Marca', titleEn: 'Keys to Succeed with Your Craft Brewery: Operations, Finance, and Branding', type: 'Open Course', client: 'EDCO', attendees: 23, role: 'Coordinator' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos - Promoción 3', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models - 3rd Cohort', type: 'Open Course', client: 'EDCO', attendees: 45, role: 'Instructor' },
  { year: 2024, title: 'IA y Transformación Digital', titleEn: 'AI and Digital Transformation', type: 'Corporate Course', client: 'Sutherland Global Services (Sutherland)', attendees: 36, role: 'Instructor' },
  { year: 2024, title: 'Prompt Engineering (ChatGPT)', titleEn: 'Prompt Engineering (ChatGPT)', type: 'Corporate Course', client: 'Bancolombia S. A.', attendees: 50, role: 'Instructor' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Corporate Course', client: 'Corporación Empresarial Eljuri (Grupo Eljuri), Ecuador', attendees: 38, role: 'Instructor' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Corporate Course', client: 'Armada de la República de Colombia (Armada Nacional)', attendees: 25, role: 'Instructor' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos - Promoción 2', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models - 2nd Cohort', type: 'Open Course', client: 'EDCO', attendees: 42, role: 'Instructor' },
  { year: 2023, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Open Course', client: 'EDCO', attendees: 33, role: 'Instructor' },
  { year: 2022, title: 'Boot Camp Semillas del Futuro Ingeniería: Innovación, Liderazgo y Tecnología', titleEn: 'Future Seeds Boot Camp - Engineering: Innovation, Leadership, and Technology', type: 'Corporate Course', client: 'Huawei Technologies y Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC), programa Semillas del Futuro', attendees: 19, role: 'Instructor' },
  { year: 2022, title: 'Perfección Cervecera y Emprendimiento', titleEn: 'Brewing Perfection and Entrepreneurship', type: 'Open Course', client: 'EDCO', attendees: 17, role: 'Coordinator' },
  { year: 2021, title: 'Programa Investigación para el Desarrollo Regional', titleEn: 'Research Program for Regional Development', type: 'Corporate Course', client: 'Fundación CEIBA', attendees: 86, role: 'Instructor' },
  { year: 2021, title: 'Perfección Cervecera y Emprendimiento', titleEn: 'Brewing Perfection and Entrepreneurship', type: 'Open Course', client: 'EDCO', attendees: 25, role: 'Coordinator' },
];
