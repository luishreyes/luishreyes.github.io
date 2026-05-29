import type { Localized } from '../../context/i18n';

export interface DevelopmentActivity {
  period: string;
  title: Localized;
  institution?: Localized;
  description: Localized;
  details?: Localized[];
}

export const professionalDevelopmentData: DevelopmentActivity[] = [
    {
        period: '2024',
        title: { en: 'Innovative Teaching with ChatGPT', es: 'Enseñanza Innovadora con ChatGPT' },
        institution: { en: 'Vanderbilt University (via Coursera)', es: 'Vanderbilt University (vía Coursera)' },
        description: {
            en: "This course provided practical techniques for educators to leverage Generative AI to augment teaching practices and create personalized learning experiences.",
            es: "Este curso ofreció técnicas prácticas para que los educadores aprovechen la IA generativa con el fin de potenciar sus prácticas de enseñanza y crear experiencias de aprendizaje personalizadas."
        }
    },
    {
        period: '2023',
        title: { en: 'Assessment in Higher Education: Professional Development for Teachers', es: 'Evaluación en la Educación Superior: Desarrollo Profesional para Docentes' },
        institution: { en: 'Erasmus University Rotterdam (via Coursera)', es: 'Erasmus University Rotterdam (vía Coursera)' },
        description: {
            en: "This course was oriented to guide teachers through preparing, creating, and evaluating assessments in their courses to ensure they are effective and aligned with learning objectives.",
            es: "Este curso se orientó a guiar a los docentes en la preparación, creación y evaluación de las evaluaciones de sus cursos para asegurar que sean efectivas y estén alineadas con los objetivos de aprendizaje."
        }
    },
    {
        period: '2023',
        title: { en: 'Course Redesign: Integrated Project 2', es: 'Rediseño de Curso: Proyecto Integrador 2' },
        institution: { en: 'Universidad de los Andes (with Conecta-TE)', es: 'Universidad de los Andes (con Conecta-TE)' },
        description: {
            en: "Collaborated with Conecta-TE to redesign and implement 'Integrated Project 2,' focusing on the best strategies for Project-Oriented Problem-Based Learning (PO-PBL). This partnership led to the development of a gamified course structure and the refinement of key learning objectives.",
            es: "Colaboré con Conecta-TE para rediseñar e implementar «Proyecto Integrador 2», enfocándome en las mejores estrategias de Aprendizaje Basado en Problemas Orientado a Proyectos (PO-PBL). Esta alianza condujo al desarrollo de una estructura de curso gamificada y al refinamiento de objetivos de aprendizaje clave."
        }
    },
    {
        period: '2021',
        title: { en: 'NEET / J-WEL Educational Envisioning and Planning Workshop', es: 'Taller de Visión y Planeación Educativa NEET / J-WEL' },
        institution: 'MIT J-WEL',
        description: {
            en: "This workshop drew lessons from MIT's innovative NEET Program on how to reimagine undergraduate engineering education, focusing on designing interdisciplinary programs and teaching 21st-century skills.",
            es: "Este taller extrajo lecciones del innovador Programa NEET del MIT sobre cómo reimaginar la educación en ingeniería de pregrado, con énfasis en el diseño de programas interdisciplinarios y en la enseñanza de habilidades del siglo XXI."
        }
    },
    {
        period: '2020',
        title: { en: 'Building Innovative Teams', es: 'Construyendo Equipos Innovadores' },
        institution: 'Stanford University',
        description: {
            en: "A virtual course focused on developing teachers' activities to help students learn how to build innovative teams, especially in project-oriented classes. Different aspects learned in this course are being applied to the evaluation of teamwork in project-type courses.",
            es: "Un curso virtual enfocado en desarrollar actividades docentes para ayudar a los estudiantes a aprender a construir equipos innovadores, especialmente en clases orientadas a proyectos. Distintos aspectos aprendidos en este curso se están aplicando a la evaluación del trabajo en equipo en cursos de tipo proyecto."
        }
    },
    {
        period: '2019-2020',
        title: { en: 'Scholarship of Teaching and Learning (SOTL) Initiative', es: 'Iniciativa Scholarship of Teaching and Learning (SOTL)' },
        institution: 'Universidad de los Andes',
        description: {
            en: "As part of a community with postdoctoral researchers from the Center for Teaching and Learning, I engaged in classroom-based research. Alongside Professor Diego Pradilla, we investigated the benefits of involving industry in academic activities.",
            es: "Como parte de una comunidad con investigadores postdoctorales del Centro de Enseñanza y Aprendizaje, participé en investigación en el aula. Junto al profesor Diego Pradilla, investigamos los beneficios de involucrar a la industria en las actividades académicas."
        }
    },
    {
        period: '2019',
        title: { en: 'Project Learning Workshop', es: 'Taller de Aprendizaje por Proyectos' },
        institution: { en: 'Presented by University of Strathclyde', es: 'Impartido por la University of Strathclyde' },
        description: {
            en: "As an initiative of the Department of Chemical and Food Engineering, I took this workshop given by Professor Esther Ventura-Medina from the University of Strathclyde (United Kingdom).",
            es: "Como iniciativa del Departamento de Ingeniería Química y de Alimentos, tomé este taller dictado por la profesora Esther Ventura-Medina de la University of Strathclyde (Reino Unido)."
        }
    },
    {
        period: '2019',
        title: { en: 'KAOSPilot: The Art and Craft of Facilitating Learning Spaces', es: 'KAOSPilot: El Arte y Oficio de Facilitar Espacios de Aprendizaje' },
        institution: 'KAOSPilot',
        description: {
            en: "This course focused on experiential learning and the design of project-type courses, providing tools to create dynamic and engaging learning environments.",
            es: "Este curso se centró en el aprendizaje experiencial y el diseño de cursos de tipo proyecto, brindando herramientas para crear entornos de aprendizaje dinámicos y atractivos."
        }
    },
    {
        period: '2019',
        title: { en: 'Teaching Portfolio Training Module', es: 'Módulo de Formación en Portafolio Docente' },
        institution: 'Universidad de los Andes',
        description: {
            en: "In order to present my teaching activity efficiently, I took the university's training module on creating a teaching portfolio, given by Gary Cifuentes.",
            es: "Con el fin de presentar mi actividad docente de manera eficiente, tomé el módulo de formación de la universidad sobre la creación de un portafolio docente, dictado por Gary Cifuentes."
        }
    },
    {
        period: '2019',
        title: { en: 'Teacher Training Module: Integrated Course Design', es: 'Módulo de Formación Docente: Diseño Integrado de Cursos' },
        institution: 'Universidad de los Andes',
        description: {
            en: "This module, given by the Dean of the School of Education, focused on teaching philosophy and the necessity of designing courses that emphasize the skills and aptitudes to be instilled in students.",
            es: "Este módulo, dictado por el decano de la Facultad de Educación, se enfocó en la filosofía de enseñanza y en la necesidad de diseñar cursos que enfaticen las habilidades y aptitudes que se busca inculcar en los estudiantes."
        }
    },
    {
        period: '2017-2018',
        title: { en: 'Course Redesign with Conecta-TE', es: 'Rediseño de Curso con Conecta-TE' },
        institution: 'Universidad de los Andes',
        description: {
            en: "I worked with Conecta-TE for almost two years on the redesign of my Unit Operations course. This redesign was done in conjunction with Professor Nicolás Ríos, and we made significant progress in implementing project-based learning and flipped classroom methodologies.",
            es: "Trabajé con Conecta-TE durante casi dos años en el rediseño de mi curso de Operaciones Unitarias. Este rediseño se realizó en conjunto con el profesor Nicolás Ríos, y logramos avances significativos en la implementación de metodologías de aprendizaje basado en proyectos y aula invertida."
        }
    }
];