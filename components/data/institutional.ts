import type { Committee } from '../../types';
import type { Localized } from '../../context/i18n';

export interface EditorialRole {
  journal: string;
  role: Localized;
  startDate: string;
  endDate: string;
  description: Localized;
  responsibilities: Localized[];
  imageUrl: string;
  journalUrl: string;
}

export const editorialData: EditorialRole[] = [
  {
    journal: 'Education for Chemical Engineers',
    role: { en: 'Editorial Board Member', es: 'Miembro del Comité Editorial' },
    startDate: 'Sep 2022',
    endDate: 'Present',
    description: {
      en: 'Education for Chemical Engineers is a peer-reviewed academic journal published quarterly by Elsevier on behalf of the Institution of Chemical Engineers. The journal focuses on all aspects of chemical engineering education, including educational research papers, teaching and learning notes, and resource reviews.',
      es: 'Education for Chemical Engineers es una revista académica arbitrada publicada trimestralmente por Elsevier en nombre de la Institution of Chemical Engineers. La revista se centra en todos los aspectos de la educación en ingeniería química, incluyendo artículos de investigación educativa, notas de enseñanza y aprendizaje, y reseñas de recursos.',
    },
    responsibilities: [
      {
        en: 'Subject Editor in Biotechnology & Bioprocessing: Oversee the review and evaluation of manuscripts related to biotechnology, bioprocessing, and bio-related topics within the context of chemical engineering education.',
        es: 'Editor temático en Biotecnología y Bioprocesos: superviso la revisión y evaluación de manuscritos relacionados con la biotecnología, los bioprocesos y temas afines dentro del contexto de la educación en ingeniería química.',
      },
      {
        en: 'Special Issue Development: Actively propose and coordinate special issues on emerging topics in chemical engineering education, fostering discussions on innovative teaching methodologies and curriculum development.',
        es: 'Desarrollo de números especiales: propongo y coordino activamente números especiales sobre temas emergentes en la educación en ingeniería química, fomentando discusiones sobre metodologías de enseñanza innovadoras y el desarrollo curricular.',
      },
      {
        en: 'Academic & Industry Impact: Contribute to the strategic direction of the journal, ensuring the publication of high-quality research that bridges the gap between academic advancements and industrial applications in chemical engineering education.',
        es: 'Impacto académico e industrial: contribuyo a la dirección estratégica de la revista, asegurando la publicación de investigación de alta calidad que conecta los avances académicos con las aplicaciones industriales en la educación en ingeniería química.',
      },
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Elsevier.svg',
    journalUrl: 'https://www.sciencedirect.com/journal/education-for-chemical-engineers'
  },
  {
    journal: 'Scientific Reports',
    role: { en: 'Editorial Board Member', es: 'Miembro del Comité Editorial' },
    startDate: 'Mar 2023',
    endDate: 'Present',
    description: {
      en: 'Scientific Reports is an open-access, peer-reviewed journal published by Nature Publishing Group, covering all areas of the natural and clinical sciences.',
      es: 'Scientific Reports es una revista arbitrada de acceso abierto publicada por Nature Publishing Group, que abarca todas las áreas de las ciencias naturales y clínicas.',
    },
    responsibilities: [
      {
        en: 'Manuscript Evaluation: As an editor in the Biotechnology section, I oversee the peer-review process, ensuring the publication of high-quality research articles that advance the field.',
        es: 'Evaluación de manuscritos: como editor en la sección de Biotecnología, superviso el proceso de revisión por pares, asegurando la publicación de artículos de investigación de alta calidad que hacen avanzar el campo.',
      },
      {
        en: 'Special Issue Coordination: Actively propose and manage special issues on emerging topics within biotechnology, fostering discussions and highlighting innovative research.',
        es: 'Coordinación de números especiales: propongo y gestiono activamente números especiales sobre temas emergentes en biotecnología, fomentando discusiones y destacando investigación innovadora.',
      },
      {
        en: 'Quality Assurance: Collaborate with authors and reviewers to maintain the journal’s standards, ensuring that published articles are both rigorous and impactful.',
        es: 'Aseguramiento de la calidad: colaboro con autores y revisores para mantener los estándares de la revista, asegurando que los artículos publicados sean rigurosos e impactantes.',
      },
    ],
    imageUrl: 'https://media.springernature.com/full/springer-cms/rest/v1/content/12211902/data/v4',
    journalUrl: 'https://www.nature.com/srep/'
  },
  {
    journal: 'Discover Biotechnology',
    role: { en: 'Editorial Board Member', es: 'Miembro del Comité Editorial' },
    startDate: 'Sep 2024',
    endDate: 'Present',
    description: {
      en: 'Discover Biotechnology is a fully open-access, peer-reviewed journal launched in September 2023 as part of the Discover series by Springer Nature. The journal aims to support multidisciplinary research and policy developments across various fields of biotechnology, serving as a platform for researchers, policymakers, and the general public to access recent advances in biotechnology and its applications in research, development, and society.',
      es: 'Discover Biotechnology es una revista arbitrada de acceso totalmente abierto lanzada en septiembre de 2023 como parte de la serie Discover de Springer Nature. La revista busca apoyar la investigación multidisciplinaria y los desarrollos de política en diversos campos de la biotecnología, sirviendo como plataforma para que investigadores, responsables de políticas y el público general accedan a los avances recientes en biotecnología y sus aplicaciones en la investigación, el desarrollo y la sociedad.',
    },
    responsibilities: [
      {
        en: 'Manuscript Evaluation: As an editor in the Biotechnology section, I oversee the peer-review process, ensuring the publication of high-quality research articles that advance the field.',
        es: 'Evaluación de manuscritos: como editor en la sección de Biotecnología, superviso el proceso de revisión por pares, asegurando la publicación de artículos de investigación de alta calidad que hacen avanzar el campo.',
      },
      {
        en: 'Special Issue Coordination: Actively propose and manage special issues on emerging topics within biotechnology, fostering discussions and highlighting innovative research.',
        es: 'Coordinación de números especiales: propongo y gestiono activamente números especiales sobre temas emergentes en biotecnología, fomentando discusiones y destacando investigación innovadora.',
      },
      {
        en: 'Quality Assurance: Collaborate with authors and reviewers to maintain the journal’s standards, ensuring that published articles are both rigorous and impactful.',
        es: 'Aseguramiento de la calidad: colaboro con autores y revisores para mantener los estándares de la revista, asegurando que los artículos publicados sean rigurosos e impactantes.',
      },
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Springer_Nature.png',
    journalUrl: 'https://www.springer.com/journal/44164'
  }
];

export const leadershipRolesData: Committee[] = [
    {
        title: {
          en: 'XXXI Inter-American & XXXIII Colombian Congress of Chemical Engineering',
          es: 'XXXI Congreso Interamericano y XXXIII Congreso Colombiano de Ingeniería Química',
        },
        role: {
          en: 'Thematic Area Leader: Food Engineering',
          es: 'Líder de Área Temática: Ingeniería de Alimentos',
        },
        startYear: 2025,
        endYear: 2025,
        description: [
            {
              en: "As Thematic Area Leader for Food Engineering at the joint XXXI Inter-American and XXXIII Colombian Congress of Chemical Engineering held in Cartagena de Indias, I was entrusted with shaping the scientific program for this key area.",
              es: "Como Líder del Área Temática de Ingeniería de Alimentos en el XXXI Congreso Interamericano y XXXIII Congreso Colombiano de Ingeniería Química, celebrado en Cartagena de Indias, se me confió la tarea de dar forma al programa científico de esta área clave.",
            },
            {
              en: "This leadership role involved curating technical sessions, guiding discussions on the latest advancements, and fostering collaboration among professionals and academics from across the Americas.",
              es: "Este rol de liderazgo implicó seleccionar las sesiones técnicas, orientar las discusiones sobre los avances más recientes y fomentar la colaboración entre profesionales y académicos de toda América.",
            }
        ]
    },
    {
        title: {
          en: 'GDPP (Product and Process Design Group) Director',
          es: 'Director del GDPP (Grupo de Diseño de Productos y Procesos)',
        },
        role: { en: 'Director', es: 'Director' },
        startYear: 2025,
        endYear: 'Present',
        description: [
            {
              en: "In 2025, I retook the directorship of the GDPP and led a strategic transformation to evolve the group into a more agile, collaborative, and market-oriented model. The goal was to maximize our impact by aligning with Colombia's national priorities in sustainability, energy transition, and agro-industry, effectively bridging the gap between academia and industry.",
              es: "En 2025 retomé la dirección del GDPP y lideré una transformación estratégica para evolucionar el grupo hacia un modelo más ágil, colaborativo y orientado al mercado. El objetivo era maximizar nuestro impacto alineándonos con las prioridades nacionales de Colombia en sostenibilidad, transición energética y agroindustria, conectando eficazmente la academia con la industria.",
            },
            {
              en: "The core of this transformation was the restructuring of our research capabilities into five specialized, interconnected clusters: Industrial Sustainability, Bio-innovation & Advanced Materials, Digital Process Engineering, Product & Experience Innovation, and Agri-Food Systems Engineering. This new structure is designed to foster synergy and respond effectively to complex industrial and national challenges.",
              es: "El núcleo de esta transformación fue la reestructuración de nuestras capacidades de investigación en cinco clústeres especializados e interconectados: Sostenibilidad Industrial, Bioinnovación y Materiales Avanzados, Ingeniería Digital de Procesos, Innovación de Producto y Experiencia, e Ingeniería de Sistemas Agroalimentarios. Esta nueva estructura está diseñada para fomentar la sinergia y responder eficazmente a desafíos industriales y nacionales complejos.",
            },
            {
              en: "This new vision reframes our mission to develop and transfer tangible scientific and technological solutions. Our approach is grounded in two methodological pillars: integrated product and process design and multiscale design, ensuring we deliver rational, robust, and complete solutions.",
              es: "Esta nueva visión replantea nuestra misión de desarrollar y transferir soluciones científicas y tecnológicas tangibles. Nuestro enfoque se fundamenta en dos pilares metodológicos: el diseño integrado de productos y procesos y el diseño multiescala, asegurando que entreguemos soluciones racionales, robustas y completas.",
            }
        ]
    },
    {
        title: {
          en: 'Faculty Representative, School of Engineering',
          es: 'Representante Profesoral, Facultad de Ingeniería',
        },
        role: { en: 'Faculty Representative', es: 'Representante Profesoral' },
        startYear: 2022,
        endYear: 2024,
        description: [
            {
              en: "As the elected faculty representative, my primary responsibility was to attend and actively participate in the discussions of the Faculty Council.",
              es: "Como representante profesoral electo, mi responsabilidad principal era asistir y participar activamente en las discusiones del Consejo de Facultad.",
            },
            {
              en: "I served as a key liaison, fostering communication between the faculty members and the Council, ensuring their perspectives were heard and considered.",
              es: "Actué como un enlace clave, fomentando la comunicación entre los profesores y el Consejo, asegurando que sus perspectivas fueran escuchadas y consideradas.",
            },
            {
              en: "In this role, I had both a voice and a vote in the Council's decisions, contributing to the strategic direction and governance of the School of Engineering.",
              es: "En este rol tuve voz y voto en las decisiones del Consejo, contribuyendo a la dirección estratégica y la gobernanza de la Facultad de Ingeniería.",
            }
        ]
    },
    {
        title: {
          en: 'GDPP (Product and Process Design Group) Director',
          es: 'Director del GDPP (Grupo de Diseño de Productos y Procesos)',
        },
        role: { en: 'Director', es: 'Director' },
        startYear: 2020,
        endYear: 2023,
        description: [
            {
              en: "GDPP (Grupo de Diseño de Productos y Procesos) is the Department of Chemical and Food Engineering's A1-ranked research group, accredited by the Colombian Ministry of Science. I was appointed as its director for the 2020-2023 term.",
              es: "El GDPP (Grupo de Diseño de Productos y Procesos) es el grupo de investigación categoría A1 del Departamento de Ingeniería Química y de Alimentos, acreditado por el Ministerio de Ciencia de Colombia. Fui designado como su director para el periodo 2020-2023.",
            },
            {
              en: "My responsibilities included ensuring compliance with the group's strategic objectives, preparing annual performance reports, and promoting interdisciplinary research by managing project proposals for internal and external funding calls.",
              es: "Mis responsabilidades incluían velar por el cumplimiento de los objetivos estratégicos del grupo, elaborar informes anuales de gestión y promover la investigación interdisciplinaria gestionando propuestas de proyectos para convocatorias de financiación internas y externas.",
            },
            {
              en: "Additionally, I managed the group's budget, proposed strategic alliances with other research entities and private organizations, ensured timely reporting to funding agencies, and maintained up-to-date records of the group's researchers and activities across various databases.",
              es: "Adicionalmente, administré el presupuesto del grupo, propuse alianzas estratégicas con otras entidades de investigación y organizaciones privadas, garanticé la entrega oportuna de informes a las agencias de financiación y mantuve actualizados los registros de los investigadores y las actividades del grupo en diversas bases de datos.",
            }
        ]
    },
];

export const committeesData: Committee[] = [
    {
        title: 'Academia Joven de Colombia',
        role: { en: 'Member', es: 'Miembro' },
        startYear: 2024,
        endYear: 'Present',
        level: 'National',
        description: [
            {
              en: "The Young Academy of Colombia is a Special Commission of the Colombian Academy of Exact, Physical, and Natural Sciences, established by a resolution of its Board of Directors.",
              es: "La Academia Joven de Colombia es una Comisión Especial de la Academia Colombiana de Ciencias Exactas, Físicas y Naturales, establecida mediante una resolución de su Junta Directiva.",
            },
            {
              en: "It is composed of young academics, artists, and scientists with meritorious achievements in their professional performance. The Academy serves as a convergence space where intellectual, cultural, and social differences can be creatively integrated.",
              es: "Está compuesta por jóvenes académicos, artistas y científicos con logros meritorios en su desempeño profesional. La Academia funciona como un espacio de convergencia donde las diferencias intelectuales, culturales y sociales pueden integrarse de forma creativa.",
            }
        ]
    },
    {
        title: {
          en: 'Generative AI (GenAI) Usage Guidelines Committee',
          es: 'Comité de Lineamientos para el Uso de la IA Generativa (GenAI)',
        },
        role: { en: 'Committee Member', es: 'Miembro del Comité' },
        startYear: 2024,
        endYear: 2024,
        level: 'University',
        description: [
            {
              en: "In October 2024, Universidad de los Andes launched its 'Guidelines for the use of generative artificial intelligence (GenAI),' a pioneering document in Colombia that provides a comprehensive set of orientations for students, professors, and administrative staff on the use of this transformative technology.",
              es: "En octubre de 2024, la Universidad de los Andes lanzó sus «Lineamientos para el uso de la inteligencia artificial generativa (GenAI)», un documento pionero en Colombia que ofrece un conjunto integral de orientaciones para estudiantes, profesores y personal administrativo sobre el uso de esta tecnología transformadora.",
            },
            {
              en: "The creation of these guidelines was a collaborative and multidisciplinary process involving multiple university entities. As part of the team representing the School of Engineering, alongside Dean Rubby Casallas and Professor Juan Carlos Cruz, I co-authored the entire section of the guidelines dedicated to the use of GenAI in research.",
              es: "La creación de estos lineamientos fue un proceso colaborativo y multidisciplinario en el que participaron múltiples dependencias de la universidad. Como parte del equipo que representó a la Facultad de Ingeniería, junto a la decana Rubby Casallas y el profesor Juan Carlos Cruz, fui coautor de toda la sección de los lineamientos dedicada al uso de la GenAI en la investigación.",
            },
            {
              en: "The final document provides concrete recommendations categorized by user type and activity, setting a new standard for GenAI policy in Colombian higher education. It is designed as a dynamic framework, subject to updates as the technology evolves, to guide the university community on the responsible and ethical use of GenAI tools.",
              es: "El documento final ofrece recomendaciones concretas categorizadas por tipo de usuario y actividad, estableciendo un nuevo estándar para la política sobre GenAI en la educación superior colombiana. Está concebido como un marco dinámico, sujeto a actualizaciones a medida que la tecnología evoluciona, para orientar a la comunidad universitaria sobre el uso responsable y ético de las herramientas de GenAI.",
            }
        ]
    },
    {
        title: {
          en: 'Research and Doctorate Committee, Faculty of Engineering',
          es: 'Comité de Investigación y Doctorado, Facultad de Ingeniería',
        },
        role: { en: 'Committee Member', es: 'Miembro del Comité' },
        startYear: 2022,
        endYear: 2025,
        level: 'Faculty',
        description: [
            {
              en: "The Research and Doctorate Committee is an advisory body to the Faculty Council, supporting strategic decisions to promote and strengthen research within the Faculty of Engineering. It plays a central role in the university's research ecosystem.",
              es: "El Comité de Investigación y Doctorado es un órgano asesor del Consejo de Facultad que apoya las decisiones estratégicas para promover y fortalecer la investigación dentro de la Facultad de Ingeniería. Desempeña un papel central en el ecosistema de investigación de la universidad.",
            },
            {
              en: "Our responsibilities include designing strategies to increase research activity, ensuring its quality and impact, suggesting methods for measuring research output, and advising the Dean on resource allocation. We also contribute to the efficient management of research infrastructure and propose strategies for disseminating research findings.",
              es: "Nuestras responsabilidades incluyen diseñar estrategias para incrementar la actividad investigativa, asegurar su calidad e impacto, sugerir métodos para medir la producción investigativa y asesorar al decano en la asignación de recursos. También contribuimos a la gestión eficiente de la infraestructura de investigación y proponemos estrategias para difundir los hallazgos de investigación.",
            },
            {
              en: "As a professor member, I maintain ongoing communication with my department's director and faculty, bringing their perspectives and feedback to the committee's discussions to ensure departmental alignment with the Faculty's research goals.",
              es: "Como profesor miembro, mantengo una comunicación constante con el director y los profesores de mi departamento, llevando sus perspectivas y comentarios a las discusiones del comité para asegurar la alineación del departamento con los objetivos de investigación de la Facultad.",
            }
        ]
    },
    {
        title: {
          en: 'Research Ethics Committee, Faculty of Engineering',
          es: 'Comité de Ética en Investigación, Facultad de Ingeniería',
        },
        role: { en: 'Committee Member', es: 'Miembro del Comité' },
        startYear: 2021,
        endYear: 'Present',
        level: 'Faculty',
        description: [
            {
              en: "As a member of the Research Ethics Committee for the Faculty of Engineering, I am one of three appointed professors responsible for upholding the ethical standards of research involving living beings. The committee operates as a satellite body of the central University Ethics Committee, adhering to both Colombian national regulations (Resolution 008430 of 1993) and international research ethics standards.",
              es: "Como miembro del Comité de Ética en Investigación de la Facultad de Ingeniería, soy uno de los tres profesores designados responsables de velar por los estándares éticos de la investigación que involucra seres vivos. El comité funciona como un órgano satélite del Comité de Ética central de la Universidad, acogiéndose tanto a la normativa nacional colombiana (Resolución 008430 de 1993) como a los estándares internacionales de ética en investigación.",
            },
            {
              en: "Our primary role is to review and provide ethical approval for all research projects conducted by undergraduate, master's, and doctoral students within the Faculty of Engineering. We evaluate project proposals to ensure they address all ethical considerations before any data collection begins, as the committee does not grant retroactive approvals.",
              es: "Nuestra función principal es revisar y otorgar la aprobación ética a todos los proyectos de investigación realizados por estudiantes de pregrado, maestría y doctorado dentro de la Facultad de Ingeniería. Evaluamos las propuestas de proyecto para asegurar que aborden todas las consideraciones éticas antes de que comience cualquier recolección de datos, ya que el comité no concede aprobaciones retroactivas.",
            },
            {
              en: "This service is crucial for maintaining the integrity of our research and ensuring that all investigations, even those classified as 'no risk,' are conducted responsibly and with the highest ethical diligence.",
              es: "Este servicio es crucial para mantener la integridad de nuestra investigación y asegurar que todas las indagaciones, incluso las clasificadas como «sin riesgo», se realicen de manera responsable y con la mayor diligencia ética.",
            }
        ]
    },
    {
        title: {
          en: 'Project-Type Courses Committee',
          es: 'Comité de Cursos Tipo Proyecto',
        },
        role: {
          en: 'Leader for the Department of Chemical and Food Engineering courses',
          es: 'Líder de los cursos del Departamento de Ingeniería Química y de Alimentos',
        },
        startYear: 2019,
        endYear: 2020,
        level: 'Faculty',
        description: [
            {
              en: "Appointed by the Dean of Engineering, this committee was composed of professors from various departments, the Teaching Support Unit, the Academic Vice-Dean, and the Academic Coordinator, who served as Secretary. The committee's objective was to define the characteristics of different project types that could be developed within the School's educational spaces as part of a new curricular reform framework.",
              es: "Designado por el decano de Ingeniería, este comité estaba compuesto por profesores de distintos departamentos, la Unidad de Apoyo a la Docencia, el vicedecano académico y el coordinador académico, quien actuaba como secretario. El objetivo del comité era definir las características de los distintos tipos de proyecto que podían desarrollarse dentro de los espacios educativos de la Facultad como parte de un nuevo marco de reforma curricular.",
            },
            {
              en: "Our primary task involved collaborative discussions on topics related to the competencies, resources, organization, and evaluation of these project-based courses. The team's insights were gathered in documents such as matrices, tables, and shared files, which were analyzed to produce a consolidated report. This final deliverable, titled 'Projects in the Engineering Curriculum Reform,' was first drafted by the Academic Vice-Dean in July 2020.",
              es: "Nuestra tarea principal consistió en discusiones colaborativas sobre temas relacionados con las competencias, los recursos, la organización y la evaluación de estos cursos basados en proyectos. Las contribuciones del equipo se recopilaron en documentos como matrices, tablas y archivos compartidos, que se analizaron para producir un informe consolidado. Este entregable final, titulado «Los proyectos en la reforma curricular de Ingeniería», fue redactado inicialmente por el vicedecano académico en julio de 2020.",
            },
            {
              en: "Our analysis revealed that while project-based learning was not new to the Faculty, it lacked a standardized format. Explicitly defining the characteristics of various project types helped faculty members identify how their courses fit within these new typologies. This framework also serves as a guide for designing and resourcing the 'project-type courses,' which are a cornerstone of the engineering programs' curricular reform.",
              es: "Nuestro análisis reveló que, si bien el aprendizaje basado en proyectos no era nuevo en la Facultad, carecía de un formato estandarizado. Definir explícitamente las características de los distintos tipos de proyecto ayudó a los profesores a identificar cómo encajaban sus cursos dentro de estas nuevas tipologías. Este marco también sirve como guía para diseñar y dotar de recursos los «cursos tipo proyecto», que son una piedra angular de la reforma curricular de los programas de ingeniería.",
            }
        ]
    },
    {
        title: { en: 'Curriculum Reform Committee', es: 'Comité de Reforma Curricular' },
        role: { en: 'Committee Member', es: 'Miembro del Comité' },
        startYear: 2019,
        endYear: 2021,
        level: 'Department',
        description: [
            {
              en: "From 2019 to 2021, I actively participated in the curriculum reform for the Chemical Engineering program and its integration with the new Food Engineering program. My role focused on designing and framing several project-oriented courses within a new pedagogical model that articulates projects, workshops, and lectures.",
              es: "Entre 2019 y 2021 participé activamente en la reforma curricular del programa de Ingeniería Química y su integración con el nuevo programa de Ingeniería de Alimentos. Mi rol se centró en diseñar y enmarcar varios cursos orientados a proyectos dentro de un nuevo modelo pedagógico que articula proyectos, talleres y clases magistrales.",
            },
            {
              en: "A key contribution was incorporating the concept of Integrated Product and Process Design (DIPP) by creating a cohesive structure that linked these new project courses with four other core courses in the program, ensuring a more holistic and applied learning experience for students.",
              es: "Una contribución clave fue incorporar el concepto de Diseño Integrado de Producto y Proceso (DIPP) creando una estructura cohesiva que vinculó estos nuevos cursos de proyecto con otros cuatro cursos fundamentales del programa, asegurando una experiencia de aprendizaje más holística y aplicada para los estudiantes.",
            }
        ]
    },
    {
        title: { en: 'AIChE Student Chapter Advisor', es: 'Asesor del Capítulo Estudiantil AIChE' },
        role: { en: 'Faculty Advisor', es: 'Asesor Profesoral' },
        startYear: 2017,
        endYear: 2021,
        level: 'Department',
        description: [
            {
              en: "As the faculty advisor for the American Institute of Chemical Engineers (AIChE) Student Chapter, my primary role was to provide guidance and support, with a strong emphasis on fostering academic excellence and research initiatives.",
              es: "Como asesor profesoral del Capítulo Estudiantil del American Institute of Chemical Engineers (AIChE), mi rol principal era brindar orientación y apoyo, con un fuerte énfasis en fomentar la excelencia académica y las iniciativas de investigación.",
            },
            {
              en: "To support student-led projects for competitions like Chem-E-Car, I established the AIChE Research Seedbed. This initiative provided students with the necessary resources, lab space, and a formal structure to conduct research, leading to top rankings in regional competitions for their car design, research paper, and poster.",
              es: "Para apoyar los proyectos liderados por estudiantes en competencias como Chem-E-Car, establecí el Semillero de Investigación AIChE. Esta iniciativa proporcionó a los estudiantes los recursos necesarios, el espacio de laboratorio y una estructura formal para realizar investigación, lo que los llevó a obtener los primeros lugares en competencias regionales por el diseño de su carro, su artículo de investigación y su póster.",
            },
            {
              en: "In collaboration with departmental colleagues, I also encouraged and supported the students in creating the first-ever Transport Phenomena Olympics in 2019. The event, modeled after the long-running Thermodynamics Olympics, was designed to strengthen fundamental knowledge in a competitive and engaging format. While plans to expand it to other universities were paused due to the COVID-19 pandemic, it marked a significant student-led academic achievement.",
              es: "En colaboración con colegas del departamento, también motivé y apoyé a los estudiantes en la creación de las primeras Olimpiadas de Fenómenos de Transporte en 2019. El evento, inspirado en las consolidadas Olimpiadas de Termodinámica, fue diseñado para fortalecer el conocimiento fundamental en un formato competitivo y atractivo. Aunque los planes de extenderlo a otras universidades se pausaron debido a la pandemia de COVID-19, marcó un logro académico significativo liderado por estudiantes.",
            }
        ]
    }
];
