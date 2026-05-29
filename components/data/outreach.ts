
import type { Localized } from '../../context/i18n';

export interface OutreachActivity {
  year: number;
  date: string;
  title: Localized;
  location: Localized;
  description: Localized;
  type: 'School Visit' | 'University Event' | 'Virtual Event' | 'Fair';
}

export const outreachData: OutreachActivity[] = [
  {
    year: 2024,
    date: 'October 1-2',
    title: 'Uniandes Fest - Labilab',
    location: 'Bogotá, Colombia',
    description: {
      en: 'Engaged with prospective students and families at the university-wide festival, showcasing hands-on experiments from the Labilab.',
      es: 'Interacción con aspirantes y familias en el festival institucional, presentando experimentos prácticos del Labilab.',
    },
    type: 'University Event',
  },
  {
    year: 2024,
    date: 'October 4',
    title: {
      en: 'The Impact of Chemical Engineers in Pharmaceuticals',
      es: 'El impacto de los ingenieros químicos en la industria farmacéutica',
    },
    location: 'Vermont School, Bogotá (10th Grade)',
    description: {
      en: 'Presented to 10th-grade students on the crucial role of chemical engineering in developing and manufacturing pharmaceuticals.',
      es: 'Presentación a estudiantes de décimo grado sobre el papel crucial de la ingeniería química en el desarrollo y la fabricación de productos farmacéuticos.',
    },
    type: 'School Visit',
  },
  {
    year: 2024,
    date: 'May 4',
    title: 'Family Fest - Labilab',
    location: 'Bogotá, Colombia',
    description: {
      en: 'Participated in the university\'s Family Fest, demonstrating exciting chemical and food engineering concepts to a general audience.',
      es: 'Participación en el Family Fest de la universidad, demostrando conceptos llamativos de ingeniería química y de alimentos a un público general.',
    },
    type: 'University Event',
  },
  {
    year: 2023,
    date: 'October 28',
    title: {
      en: 'Food Engineering: A Design Matinee',
      es: 'Ingeniería de Alimentos: una matiné de diseño',
    },
    location: 'Universidad de los Andes Laboratories, Bogotá',
    description: {
      en: 'Hosted a hands-on workshop for high school students to explore the creative and scientific aspects of food engineering through a design challenge.',
      es: 'Taller práctico para estudiantes de secundaria que exploraron los aspectos creativos y científicos de la ingeniería de alimentos a través de un reto de diseño.',
    },
    type: 'University Event',
  },
  {
    year: 2023,
    date: 'May 6',
    title: {
      en: 'Uniandes Picnic: Taste Food Engineering',
      es: 'Picnic Uniandes: saborea la ingeniería de alimentos',
    },
    location: 'Bogotá, Colombia',
    description: {
      en: 'An interactive session during the Uniandes Picnic event, introducing the science of food engineering in a fun and accessible way.',
      es: 'Sesión interactiva durante el evento Picnic Uniandes, que introdujo la ciencia de la ingeniería de alimentos de forma divertida y accesible.',
    },
    type: 'University Event',
  },
  {
    year: 2022,
    date: 'November 26',
    title: {
      en: 'Food Engineering: A Design Matinee',
      es: 'Ingeniería de Alimentos: una matiné de diseño',
    },
    location: 'Universidad de los Andes Laboratories, Bogotá',
    description: {
      en: 'Led a design-focused workshop in the university labs, guiding prospective students through the principles of food product development.',
      es: 'Taller centrado en el diseño realizado en los laboratorios de la universidad, guiando a los aspirantes a través de los principios del desarrollo de productos alimentarios.',
    },
    type: 'University Event',
  },
  {
    year: 2022,
    date: 'October 5',
    title: {
      en: 'University School Fair',
      es: 'Feria universitaria de colegios',
    },
    location: 'Bogotá, Colombia',
    description: {
      en: 'Represented the Chemical and Food Engineering department at a major school fair, speaking with students and parents about our programs.',
      es: 'Representación del Departamento de Ingeniería Química y de Alimentos en una importante feria de colegios, conversando con estudiantes y padres sobre nuestros programas.',
    },
    type: 'Fair',
  },
  {
    year: 2021,
    date: 'March 15',
    title: {
      en: 'Virtual Scouting Seminar',
      es: 'Seminario virtual de captación',
    },
    location: { en: 'Online', es: 'En línea' },
    description: {
      en: 'Conducted a virtual seminar to recruit prospective students, showcasing the research and academic opportunities in our department.',
      es: 'Seminario virtual para captar aspirantes, mostrando las oportunidades de investigación y académicas de nuestro departamento.',
    },
    type: 'Virtual Event',
  },
  {
    year: 2020,
    date: 'April 29',
    title: {
      en: 'Outreach Talk at New Cambridge School',
      es: 'Charla de divulgación en el New Cambridge School',
    },
    location: 'Bucaramanga, Colombia',
    description: {
      en: 'Visited New Cambridge School to inspire students about careers in engineering and science.',
      es: 'Visita al New Cambridge School para inspirar a los estudiantes sobre las carreras en ingeniería y ciencia.',
    },
    type: 'School Visit',
  },
  {
    year: 2020,
    date: 'April 22',
    title: {
      en: 'Virtual Scouting Seminars',
      es: 'Seminarios virtuales de captación',
    },
    location: { en: 'Online', es: 'En línea' },
    description: {
      en: 'Led a series of online seminars aimed at scouting and recruiting talented high school students during the transition to virtual events.',
      es: 'Serie de seminarios en línea orientados a captar y reclutar estudiantes de secundaria talentosos durante la transición a eventos virtuales.',
    },
    type: 'Virtual Event',
  },
];
