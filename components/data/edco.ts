export interface EdcoCourse {
  year: number;
  title: string;
  titleEn?: string;
  type: 'Open Course' | 'Corporate Course' | 'Summer School';
  client?: string;
  attendees: number;
  role: 'Coordinator' | 'Instructor';
  url?: string;
}

export const edcoCoursesData: EdcoCourse[] = [
  // 2026
  {
    year: 2026,
    title: 'Generalidades de la IA',
    titleEn: 'AI Fundamentals',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 36,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Herramientas en IA',
    titleEn: 'AI Tools',
    type: 'Corporate Course',
    client: 'Contraloría General de la República de Colombia',
    attendees: 34,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos',
    titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models',
    type: 'Open Course',
    client: 'EDCO',
    attendees: 40,
    role: 'Instructor'
  },
  {
    year: 2026,
    title: 'Fundamentals of Using Generative AI',
    titleEn: 'Fundamentals of Using Generative AI',
    type: 'Open Course',
    client: 'Coursera (MOOC)',
    attendees: 87,
    role: 'Instructor',
    url: 'https://www.coursera.org/learn/fundamentals-of-using-generative-ai'
  },

  // 2025
  { 
    year: 2025, 
    title: 'Conferencia IA Generativa y su Impacto en la Seguridad y Salud Laboral', 
    titleEn: 'Conference on Generative AI and its Impact on Occupational Health and Safety', 
    type: 'Corporate Course', 
    client: 'ARL Seguros Bolívar', 
    attendees: 93, 
    role: 'Instructor' 
  },
  { 
    year: 2025, 
    title: 'Curso: Transformando la Productividad Corporativa con IA (Grupo 2)', 
    titleEn: 'Course: Transforming Corporate Productivity with AI (Group 2)', 
    type: 'Corporate Course', 
    client: 'Seguros Bolívar', 
    attendees: 26, 
    role: 'Instructor' 
  },
  { 
    year: 2025, 
    title: 'Curso: Transformando la Productividad Corporativa con IA (Grupo 1)', 
    titleEn: 'Course: Transforming Corporate Productivity with AI (Group 1)', 
    type: 'Corporate Course', 
    client: 'Seguros Bolívar', 
    attendees: 31, 
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
    attendees: 5876,
    role: 'Instructor',
    url: 'https://www.coursera.org/learn/fundamentos-ia-generativa-uniandes'
  },
  { year: 2025, title: 'Prompt Engineering', titleEn: 'Prompt Engineering', type: 'Corporate Course', client: 'Bancolombia', attendees: 36, role: 'Instructor' },
  { year: 2025, title: 'Transformando la Productividad Corporativa con IA: Aprovechando el Potencial de los Modelos Generativos en el Entorno Empresarial', titleEn: 'Transforming Corporate Productivity with AI: Harnessing the Potential of Generative Models in the Business Environment', type: 'Corporate Course', client: 'Cenipalma', attendees: 35, role: 'Instructor' },
  { year: 2025, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Open Course', client: 'EDCO', attendees: 41, role: 'Instructor' },
  { year: 2025, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Open Course', client: 'EDCO', attendees: 35, role: 'Instructor' },
  { year: 2025, title: 'Biotecnología Marina: De la Bioprospección al Escalado', titleEn: 'Marine Biotechnology: From Bioprospecting to Scale-up', type: 'Summer School', client: 'CABBIO', attendees: 19, role: 'Instructor' },
  { year: 2025, title: 'IA Generativa en Acción: Del Concepto a la Práctica', titleEn: 'Generative AI in Action: From Concept to Practice', type: 'Open Course', client: 'EDCO', attendees: 26, role: 'Instructor' },
  { year: 2025, title: 'Taller Prompts', titleEn: 'Prompt Workshop', type: 'Corporate Course', client: 'BBVA', attendees: 35, role: 'Instructor' },
  { year: 2025, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Corporate Course', client: 'Fundación Santa Fe', attendees: 35, role: 'Instructor' },
  { year: 2025, title: 'IA Generativa para Químicos Farmacéuticos', titleEn: 'Generative AI for Pharmaceutical Chemists', type: 'Corporate Course', client: 'Laboratorio Abbot', attendees: 70, role: 'Instructor' },
  { year: 2025, title: 'Prompt Engineering', titleEn: 'Prompt Engineering', type: 'Corporate Course', client: 'Bancolombia (Gerencia de Aprendizaje)', attendees: 35, role: 'Instructor' },
  
  // 2024 and older
  { year: 2024, title: 'Claves para Triunfar con tu Cervecería Artesanal: Operaciones, Finanzas y Marca', titleEn: 'Keys to Succeed with Your Craft Brewery: Operations, Finance, and Branding', type: 'Open Course', client: 'EDCO', attendees: 23, role: 'Coordinator' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos - Promoción 3', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models - 3rd Cohort', type: 'Open Course', client: 'EDCO', attendees: 45, role: 'Instructor' },
  { year: 2024, title: 'IA y Transformación Digital', titleEn: 'AI and Digital Transformation', type: 'Corporate Course', client: 'Sutherland', attendees: 36, role: 'Instructor' },
  { year: 2024, title: 'Prompt Engineering (ChatGPT)', titleEn: 'Prompt Engineering (ChatGPT)', type: 'Corporate Course', client: 'Bancolombia', attendees: 50, role: 'Instructor' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Corporate Course', client: 'Corporación Empresarial Eljuri Ecuador', attendees: 38, role: 'Instructor' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Corporate Course', client: 'Armada Nacional', attendees: 25, role: 'Instructor' },
  { year: 2024, title: 'Liderazgo para la Alta Gerencia en la Transformación Digital', titleEn: 'Leadership for Senior Management in Digital Transformation', type: 'Corporate Course', client: 'Bancolombia (VP Riesgos)', attendees: 14, role: 'Instructor' },
  { year: 2024, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos - Promoción 2', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models - 2nd Cohort', type: 'Open Course', client: 'EDCO', attendees: 42, role: 'Instructor' },
  { year: 2023, title: 'Dominando la Inteligencia Artificial: Más Allá de ChatGPT y los Modelos Generativos', titleEn: 'Mastering Artificial Intelligence: Beyond ChatGPT and Generative Models', type: 'Open Course', client: 'EDCO', attendees: 33, role: 'Instructor' },
  { year: 2022, title: 'Boot Camp Semillas del Futuro Ingeniería: Innovación, Liderazgo y Tecnología', titleEn: 'Future Seeds Boot Camp - Engineering: Innovation, Leadership, and Technology', type: 'Corporate Course', client: 'Semillas del Futuro', attendees: 19, role: 'Instructor' },
  { year: 2022, title: 'Perfección Cervecera y Emprendimiento', titleEn: 'Brewing Perfection and Entrepreneurship', type: 'Open Course', client: 'EDCO', attendees: 17, role: 'Coordinator' },
  { year: 2021, title: 'Programa Investigación para el Desarrollo Regional', titleEn: 'Research Program for Regional Development', type: 'Corporate Course', attendees: 86, role: 'Instructor' },
  { year: 2021, title: 'Perfección Cervecera y Emprendimiento', titleEn: 'Brewing Perfection and Entrepreneurship', type: 'Open Course', client: 'EDCO', attendees: 25, role: 'Coordinator' },
];