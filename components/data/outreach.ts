
import type { Localized } from '../../context/i18n';

export interface OutreachActivity {
  year: number;
  date: string;
  title: Localized;
  location: Localized;
  description: Localized;
  type: 'School Visit' | 'University Event' | 'Virtual Event' | 'Fair' | 'Media Feature';
  url?: string;
}

export const outreachData: OutreachActivity[] = [
  {
    year: 2026,
    date: 'September 24',
    title: {
      en: 'Expert source in Puntos: cooking oils',
      es: 'Fuente experta en Puntos: aceites de cocina',
    },
    location: 'Puntos, Universidad de los Andes',
    description: {
      en: "Consulted as an expert, with Juan Carlos Cruz, for «¿Cuál es el mejor aceite para cocinar?», an article by Mauricio Laguna Cardozo. My part was the food engineering behind solid fats: margarine solidifies through hydrogenation, which generates trans fatty acids, and the industry does it for reasons of storage and transport.",
      es: "Consultado como experto, con Juan Carlos Cruz, para «¿Cuál es el mejor aceite para cocinar?», un artículo de Mauricio Laguna Cardozo. Mi parte fue la ingeniería de alimentos detrás de las grasas sólidas: la margarina se solidifica por hidrogenación, lo que genera ácidos grasos trans, y la industria lo hace por razones de almacenamiento y transporte.",
    },
    type: 'Media Feature',
  },
  {
    year: 2026,
    date: 'September 18',
    title: {
      en: 'Profile in Puntos',
      es: 'Perfil en Puntos',
    },
    location: 'Puntos, Universidad de los Andes',
    description: {
      en: "«Luis H. Reyes: educación, IA y mucha química», a profile by Mauricio Laguna Cardozo on the AIChE Award for Innovation in Chemical Engineering Education, the seven years the redesign of Project of Unit Operations took, the blind evaluations by external reviewers used to check its effect, and the limits of project-based learning.",
      es: "«Luis H. Reyes: educación, IA y mucha química», un perfil de Mauricio Laguna Cardozo sobre el premio del AIChE a la innovación en la educación en ingeniería química, los siete años que tomó el rediseño de Proyecto de Operaciones Unitarias, las evaluaciones a ciegas con evaluadores externos con las que se verificó su efecto y los límites del aprendizaje basado en proyectos.",
    },
    type: 'Media Feature',
  },
  {
    year: 2026,
    date: 'September',
    title: {
      en: 'Visionarios — Universidad de los Andes documentary series',
      es: 'Visionarios — serie documental de la Universidad de los Andes',
    },
    location: {
      en: 'Universidad de los Andes · Full episode on YouTube and Puntos',
      es: 'Universidad de los Andes · Episodio completo en YouTube y Puntos',
    },
    description: {
      en: 'A documentary episode on my trajectory, one of four professors profiled in the new season of Visionarios. It goes back to the teacher in Ocaña who graded me by having me teach the class on alkanes — where both the science and the teaching started — through the decision to turn down industry for the classroom, the doctorate at Texas A&M and the work at NREL, the return to Colombia under the «Es tiempo de volver» call, and the use of CRISPR-Cas9 to design therapies for orphan diseases such as Morquio IV A. It also takes in the black-and-white photography, which follows the same multiscale logic as the science. The closing argument is the one I care about: research is a way of teaching, and the papers and the awards are beautiful by-products.',
      es: 'Un episodio documental sobre mi trayectoria, uno de los cuatro profesores perfilados en la nueva temporada de Visionarios. Vuelve a la profesora de Ocaña que me evaluaba poniéndome a dictar la clase de alcanos —donde arrancaron a la vez la ciencia y la docencia—, pasa por la decisión de dejar la industria por el aula, el doctorado en Texas A&M y el trabajo en el NREL, el regreso a Colombia con la convocatoria «Es tiempo de volver», y el uso de CRISPR-Cas9 para diseñar terapias contra enfermedades huérfanas como el síndrome de Morquio IV A. Recoge también la fotografía en blanco y negro, que sigue la misma lógica multiescala de la ciencia. El cierre es el argumento que me importa: la investigación es una forma de hacer docencia, y los papers y los premios son subproductos bonitos.',
    },
    type: 'Media Feature',
    url: 'https://youtu.be/fQQH2BbAbUM',
  },
  {
    year: 2025,
    date: 'October 30',
    title: {
      en: 'ECOS 2025: panel on technology-based entrepreneurship',
      es: 'ECOS 2025: panel sobre emprendimiento de base tecnológica',
    },
    location: 'Teatro Panorama, Bogotá',
    description: {
      en: "At ECOS, the conference of the Universidad de los Andes Innovation Ecosystem organized with the master's and doctoral programs in Technological Innovation Management, I moderated the panel «Innovación y emprendimiento: apostando por el emprendimiento de base tecnológica», with Carlos Augusto López (GLYA), Ciro Gélvez (WSEEDS), and Felipe Torres (Prami).",
      es: "En ECOS, la conferencia del Ecosistema de Innovación de la Universidad de los Andes organizada con los programas de Maestría y Doctorado en Gestión de la Innovación Tecnológica, moderé el panel «Innovación y emprendimiento: apostando por el emprendimiento de base tecnológica», con Carlos Augusto López (GLYA), Ciro Gélvez (WSEEDS) y Felipe Torres (Prami).",
    },
    type: 'University Event',
  },
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
    year: 2024,
    date: 'Vol. 45, No. 3',
    title: {
      en: 'Agricultural extension review in Palmas',
      es: 'Revisión sobre extensión agrícola en Palmas',
    },
    location: {
      en: 'Palmas, «Extensión» section · Corporación Centro de Investigación en Palma de Aceite (Cenipalma)',
      es: 'Palmas, sección «Extensión» · Corporación Centro de Investigación en Palma de Aceite (Cenipalma)',
    },
    description: {
      en: "The open-access Spanish version of the review led by Julián F. Becerra-Encinales, «Extensión agrícola para la adopción de prácticas tecnológicas en países en desarrollo: una revisión exploratoria de los obstáculos y sus dimensiones», published in the magazine that the palm oil sector reads, so that the finding reaches the extension workers themselves.",
      es: "La versión en español y en acceso abierto de la revisión que encabeza Julián F. Becerra-Encinales, «Extensión agrícola para la adopción de prácticas tecnológicas en países en desarrollo: una revisión exploratoria de los obstáculos y sus dimensiones», publicada en la revista que lee el sector palmero, para que el hallazgo llegue a los extensionistas mismos.",
    },
    type: 'Media Feature',
  },
  {
    year: 2023,
    date: 'October-November',
    title: {
      en: 'Column in P&M: insects and sustainable food',
      es: 'Columna en P&M: insectos y alimentación sostenible',
    },
    location: {
      en: 'P&M (Publicidad y Mercadeo), «P&M Science» column',
      es: 'P&M (Publicidad y Mercadeo), columna «P&M Science»',
    },
    description: {
      en: "«Hacia una alimentación sostenible a base de insectos en Colombia», a column co-written with Andrea Sánchez-Camargo.",
      es: "«Hacia una alimentación sostenible a base de insectos en Colombia», una columna escrita con Andrea Sánchez-Camargo.",
    },
    type: 'Media Feature',
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
    year: 2023,
    date: 'Issue 71',
    title: {
      en: 'Guest column in Exponotas',
      es: 'Columna invitada en Exponotas',
    },
    location: {
      en: 'Exponotas, «Columnista invitado» section',
      es: 'Exponotas, sección «Columnista invitado»',
    },
    description: {
      en: "«Academia y sostenibilidad, un “match” necesario», a position column co-written with Juan Carlos Cruz on project-based learning and sustainability.",
      es: "«Academia y sostenibilidad, un “match” necesario», una columna de posición escrita con Juan Carlos Cruz sobre el aprendizaje basado en proyectos y la sostenibilidad.",
    },
    type: 'Media Feature',
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
    year: 2022,
    date: 'April-May',
    title: {
      en: 'Column in P&M: sensory marketing',
      es: 'Columna en P&M: mercadeo sensorial',
    },
    location: {
      en: 'P&M (Publicidad y Mercadeo), «P&M Science» column',
      es: 'P&M (Publicidad y Mercadeo), columna «P&M Science»',
    },
    description: {
      en: "«Mercadeo sensorial para una vida más saludable», a column co-written with Felipe Reinoso-Carvalho that brings to a general audience our 2021 article in Foods with Brayan Rodríguez.",
      es: "«Mercadeo sensorial para una vida más saludable», una columna escrita con Felipe Reinoso-Carvalho que acerca al público general nuestro artículo de 2021 en Foods con Brayan Rodríguez.",
    },
    type: 'Media Feature',
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
