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

/**
 * Standing editorial board seats only: Education for Chemical Engineers,
 * Scientific Reports and Discover Biotechnology. Edited books and guest
 * editorships are one-time appointments and live in `editorships.ts`.
 */
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
        en: 'Manuscript Evaluation: Oversee the review and evaluation of manuscripts related to biotechnology, bioprocessing, and bio-related topics within the context of chemical engineering education.',
        es: 'Evaluación de manuscritos: superviso la revisión y evaluación de manuscritos relacionados con la biotecnología, los bioprocesos y temas afines dentro del contexto de la educación en ingeniería química.',
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
      en: 'Scientific Reports is an open-access, peer-reviewed journal published by Nature Portfolio, covering all areas of the natural and clinical sciences.',
      es: 'Scientific Reports es una revista arbitrada de acceso abierto publicada por Nature Portfolio, que abarca todas las áreas de las ciencias naturales y clínicas.',
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
          en: 'Future Faculty Mentoring Program, AIChE Education Division',
          es: 'Future Faculty Mentoring Program, División de Educación del AIChE',
        },
        role: { en: 'Mentor (2026-2027 cohort)', es: 'Mentor (cohorte 2026-2027)' },
        startYear: 2026,
        endYear: 2027,
        description: [
            {
              en: "The Future Faculty Mentoring Program of the Education Division of the American Institute of Chemical Engineers (AIChE) pairs senior faculty members of the Division with senior graduate students and postdoctoral scholars who are preparing for their first faculty position. Each mentor commits for one year to a mentoring project with monthly contact.",
              es: "El Future Faculty Mentoring Program de la División de Educación del American Institute of Chemical Engineers (AIChE) une a profesores sénior de la División con doctorandos y posdoctorados que se preparan para su primera plaza de profesor. Cada mentor se compromete por un año con un proyecto de mentoría y contacto mensual.",
            },
            {
              en: "I am the only mentor from a university outside the United States among the 34 in the 2026-2027 cohort. The program is formally launched at the AIChE Annual Meeting in Minneapolis on November 8, 2026.",
              es: "Soy el único mentor de una universidad de fuera de Estados Unidos entre los 34 de la cohorte 2026-2027. El programa arranca formalmente en el AIChE Annual Meeting de Minneapolis el 8 de noviembre de 2026.",
            }
        ]
    },
    {
        title: {
          en: 'Artificial Intelligence Global Education Network (AIGEN)',
          es: 'Artificial Intelligence Global Education Network (AIGEN)',
        },
        role: { en: 'Research Committee Leader', es: 'Líder del Comité de Investigación' },
        startYear: 2025,
        endYear: 'Present',
        description: [
            {
              en: "More than 90 universities applied to join AIGEN, the network of the Instituto Tecnológico y de Estudios Superiores de Monterrey (Tecnológico de Monterrey), and 55 were accepted, most of them from Latin America and nine from Colombia. The network works through four committees, and I lead its Research Committee.",
              es: "Más de 90 universidades se postularon a AIGEN, la red del Instituto Tecnológico y de Estudios Superiores de Monterrey (Tecnológico de Monterrey), y 55 fueron aceptadas, la mayoría de América Latina y nueve de Colombia. La red funciona con cuatro comités, y lidero su Comité de Investigación.",
            },
            {
              en: "In 2025 the network ran the TECgpt Open Edition pilot with 12 universities and the DEC AI Survey for LATAM with 21 universities.",
              es: "En 2025 la red hizo el piloto TECgpt Open Edition con 12 universidades y la encuesta DEC AI Survey for LATAM con 21 universidades.",
            }
        ]
    },
    {
        title: {
          en: 'XXXI Inter-American & XXXIII Colombian Congress of Chemical Engineering',
          es: 'XXXI Congreso Interamericano y XXXIII Congreso Colombiano de Ingeniería Química',
        },
        role: {
          en: 'Leader of the food engineering thematic area',
          es: 'Líder del área temática de Ingeniería de Alimentos',
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
              en: "In 2025 I took up the directorship of the GDPP again.",
              es: "En 2025 volví a dirigir el GDPP."
            }
        ]
    },
    {
        title: {
          en: 'Professors’ representative to the Council of the School of Engineering',
          es: 'Representante de los profesores ante el Consejo de la Facultad de Ingeniería',
        },
        role: { en: 'Elected by the professors', es: 'Elegido por los profesores' },
        startYear: 2022,
        endYear: 2024,
        description: [
            {
              en: "The professors of the School elect their representative to its Council, which has a voice and a vote in the Council's decisions. My role was to carry the professors' voice to the Council.",
              es: "Los profesores de la Facultad eligen a su representante ante el Consejo, con voz y voto en sus decisiones. Mi papel fue llevar la voz de los profesores al Consejo.",
            },
            {
              en: "In practice that meant listening: in several meetings I took the professors' questions to the Council and to the University's leadership, and brought the answers back to them.",
              es: "En la práctica, eso fue escuchar: en varias reuniones llevé las dudas de los profesores al Consejo y a las directivas de la Universidad, y les traje de vuelta las respuestas.",
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
              en: "I also proposed alliances with other research groups and with companies, and kept the group's records of researchers and activities up to date in the national and institutional databases.",
              es: "También propuse alianzas con otros grupos de investigación y con empresas, y mantuve al día los registros de los investigadores y las actividades del grupo en las bases de datos nacionales e institucionales.",
            }
        ]
    },
];

export const committeesData: Committee[] = [
    {
        title: {
          en: 'Senior Researcher (IS), National System of Science, Technology and Innovation',
          es: 'Investigador Sénior (IS), Sistema Nacional de Ciencia, Tecnología e Innovación',
        },
        role: { en: 'Minciencias Classification', es: 'Categoría Minciencias' },
        startYear: 2025,
        endYear: 'Present',
        level: 'National',
        description: [
            {
              en: "Senior Researcher is the highest category in the researcher classification of Colombia's Ministry of Science, Technology and Innovation (Minciencias). It is awarded through the National Call for the Recognition and Measurement of Research Groups and Researchers, and requires a sustained record of peer-reviewed production, doctoral supervision, and demonstrated scientific leadership.",
              es: "Investigador Sénior es la categoría más alta en la clasificación de investigadores del Ministerio de Ciencia, Tecnología e Innovación (Minciencias). Se otorga a través de la Convocatoria Nacional para el Reconocimiento y Medición de Grupos de Investigación e Investigadores, y exige una trayectoria sostenida de producción arbitrada, dirección de tesis doctorales y liderazgo científico demostrado.",
            }
        ]
    },
    {
        title: {
          en: 'Task Force on Teaching in the Age of AI',
          es: 'Task Force de Profesores en Docencia en Tiempos de IA',
        },
        role: { en: 'Member', es: 'Miembro' },
        startYear: 2026,
        endYear: 'Present',
        level: 'University',
        description: [
            {
              en: "A group of professors from different faculties raised, on their own initiative, what generative AI was doing to teaching. The Vice Presidency for Academic Affairs took up that concern and gave the group, eleven of us, an open mandate: it named the subject and left the approach, the method, and the reach of the proposals to us. Participation is voluntary. The group is temporary and dissolves once it delivers.",
              es: "Un grupo de profesores de distintas facultades planteó, por iniciativa propia, lo que la IA generativa le estaba haciendo a la docencia. La Vicerrectoría Académica acogió esa inquietud y le dio al grupo, once en total, un mandato abierto: definió el tema y dejó en nuestras manos el enfoque, la metodología y el alcance de las propuestas. La participación es voluntaria. El grupo es temporal y se disuelve una vez entregue.",
            },
            {
              en: "We read the peer-reviewed literature on what AI does to learning: cognitive offloading, skill atrophy, effort, comprehension. We gather the uses already happening in Uniandes classrooms, and we survey professors and students for a baseline of what is being used and for what. Those inputs feed guidelines, proposals on assessment and classroom practice, and a roadmap with actions and deadlines the University can adopt.",
              es: "Leemos la literatura arbitrada sobre lo que la IA le hace al aprendizaje: descarga cognitiva, atrofia de habilidades, esfuerzo, comprensión. Recogemos los usos que ya ocurren en las aulas de los Andes y encuestamos a profesores y estudiantes para levantar una línea base de qué se usa y con qué propósito. Esos insumos alimentan lineamientos, propuestas sobre evaluación y práctica de aula, y una hoja de ruta con acciones y plazos que la Universidad pueda adoptar.",
            }
        ]
    },
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
          en: 'Guidelines for the use of generative AI at the Universidad de los Andes',
          es: 'Lineamientos para el uso de inteligencia artificial generativa en la Universidad de los Andes',
        },
        role: { en: 'Contributions on behalf of the School of Engineering', es: 'Aportes en representación de la Facultad de Ingeniería' },
        startYear: 2024,
        endYear: 2024,
        level: 'University',
        description: [
            {
              en: "In October 2024 the Universidad de los Andes published its Guidelines for the use of generative artificial intelligence, with recommendations for students, professors, researchers and staff, organized by who uses the tools and for what. The University presents them as a framework that will be updated as the technology changes.",
              es: "En octubre de 2024 la Universidad de los Andes publicó sus Lineamientos para el uso de inteligencia artificial generativa, con recomendaciones para estudiantes, profesores, investigadores y personal administrativo, organizadas según quién usa las herramientas y para qué. La Universidad los presenta como un marco que se actualizará a medida que cambie la tecnología.",
            },
            {
              en: "On behalf of the School of Engineering, with Dean Rubby Casallas and Professor Juan Carlos Cruz, I took part in the whole discussion and wrote the first version of the section on the use of generative AI in research. The closing note of the document acknowledges the significant contributions of the three of us to its content.",
              es: "En representación de la Facultad de Ingeniería, con la decana Rubby Casallas y el profesor Juan Carlos Cruz, participé en toda la discusión y escribí la primera versión de la sección sobre el uso de la IA generativa en la investigación. La nota final del documento reconoce los aportes significativos de los tres a su contenido.",
            }
        ]
    },
    {
        title: {
          en: 'Research and Doctorate Committee, School of Engineering',
          es: 'Comité de Investigaciones y Doctorado, Facultad de Ingeniería',
        },
        role: { en: 'Representative of the Department of Chemical and Food Engineering', es: 'Representante del Departamento de Ingeniería Química y de Alimentos' },
        startYear: 2021,
        endYear: 2025,
        level: 'Faculty',
        description: [
            {
              en: "The Research and Doctorate Committee advises the Council of the School of Engineering on the decisions that promote and strengthen research in the School.",
              es: "El Comité de Investigaciones y Doctorado asesora al Consejo de la Facultad de Ingeniería en las decisiones que promueven y fortalecen la investigación en la Facultad.",
            },
            {
              en: "Our responsibilities include designing strategies to increase research activity, ensuring its quality and impact, suggesting methods for measuring research output, and advising the Dean on resource allocation. We also contribute to the efficient management of research infrastructure and propose strategies for disseminating research findings.",
              es: "Nuestras responsabilidades incluyen diseñar estrategias para incrementar la actividad investigativa, asegurar su calidad e impacto, sugerir métodos para medir la producción investigativa y asesorar al decano en la asignación de recursos. También contribuimos a la gestión eficiente de la infraestructura de investigación y proponemos estrategias para difundir los hallazgos de investigación.",
            },
            {
              en: "As the representative of my department, I kept in touch with its director and professors and took their views to the committee's discussions.",
              es: "Como representante de mi departamento, mantuve la comunicación con su director y sus profesores, y llevé sus opiniones a las discusiones del comité.",
            }
        ]
    },
    {
        title: {
          en: 'Research Ethics Committee, School of Engineering',
          es: 'Comité de Ética en Investigación, Facultad de Ingeniería',
        },
        role: { en: 'Committee Member', es: 'Miembro del Comité' },
        startYear: 2021,
        endYear: 'Present',
        level: 'Faculty',
        description: [
            {
              en: "As a member of the Research Ethics Committee of the School of Engineering, I am one of three appointed professors responsible for upholding the ethical standards of research involving living beings. The committee operates as a satellite body of the central University Ethics Committee, under Colombian regulations (Resolution 008430 of 1993) and international research ethics standards.",
              es: "Como miembro del Comité de Ética en Investigación de la Facultad de Ingeniería, soy uno de los tres profesores designados para velar por los estándares éticos de la investigación que involucra seres vivos. El comité funciona como un órgano satélite del Comité de Ética central de la Universidad, bajo la normativa colombiana (Resolución 008430 de 1993) y los estándares internacionales de ética en investigación.",
            },
            {
              en: "The committee reviews the research protocols of every department of the School, from undergraduate, master's and doctoral projects, classifies their level of risk and grants the ethical approval before any data collection begins; it does not grant approvals retroactively.",
              es: "El comité revisa los protocolos de investigación de todos los departamentos de la Facultad, de proyectos de pregrado, maestría y doctorado, clasifica su nivel de riesgo y otorga el aval ético antes de que empiece la toma de datos; no concede avales retroactivos.",
            },
            {
              en: "We review about ten cases a week, and sometimes many more. By my estimate, that is more than 1,800 cases since I joined in 2021, counting only the weeks of classes.",
              es: "Revisamos unos diez casos por semana, y a veces muchos más. Según mi estimado, son más de 1.800 casos desde que entré en 2021, contando solo las semanas de clase.",
            }
        ]
    },
    {
        title: {
          en: 'Nanotech LATAM Forum, first edition',
          es: 'Foro Nanotech LATAM, primera edición',
        },
        role: { en: 'Member of the organizing committee', es: 'Miembro del comité organizador' },
        startYear: 2023,
        endYear: 2023,
        level: 'Faculty',
        description: [
            {
              en: "I served on the organizing committee of the first edition of the Nanotech LATAM Forum, held by the School of Engineering in the first semester of 2023.",
              es: "Formé parte del comité organizador de la primera edición del Foro Nanotech LATAM, que la Facultad de Ingeniería realizó en el primer semestre de 2023.",
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

// ── Comité de Ética en Investigación: la carga ──────────────────────────────

/**
 * La carga del Comité de Ética en Investigación es un estimado, no un conteo: unos diez
 * casos por semana, solo en las semanas de clase de cada semestre completo desde 2021-10,
 * más las semanas que llevaba el semestre en curso al corte. Las intersemestrales y las
 * semanas con más casos no entran, así que la cifra se dice como «más de».
 */
export const ethicsCommitteeLoad = {
  casesPerWeek: 10,
  weeksPerSemester: 16,
  fullSemesters: ['2021-10', '2021-20', '2022-10', '2022-20', '2023-10', '2023-20', '2024-10', '2024-20', '2025-10', '2025-20', '2026-10'],
  currentSemester: '2026-20',
  weeksIntoCurrentSemester: 8,
  asOf: '2026-10-01',
};

export const ethicsWeeks =
  ethicsCommitteeLoad.fullSemesters.length * ethicsCommitteeLoad.weeksPerSemester + ethicsCommitteeLoad.weeksIntoCurrentSemester;
export const ethicsCasesEstimate = ethicsWeeks * ethicsCommitteeLoad.casesPerWeek;

// ── Evaluar a otros ─────────────────────────────────────────────────────────

/**
 * Convocatorias en las que evaluó propuestas. Se hicieron bajo acuerdo de confidencialidad:
 * aquí solo va lo que se puede contar (el año, el tipo de proceso, cuántas propuestas y si
 * hubo panel), nunca las propuestas, sus códigos ni sus autores.
 *  - `national`: procesos de Colciencias y Minciencias, incluidos los del Sistema General de
 *    Regalías, la preselección nacional para el ICGEB y la Comisión Nacional de Expertos.
 *  - `university`: convocatorias internas de otras universidades del país.
 */
export interface EvaluationCall {
  year: number;
  scope: 'national' | 'university';
  proposals: number;
  panel?: boolean;
  /** Lo que el proceso tuvo de particular y se puede decir. */
  note?: 'royalties' | 'icgeb' | 'experts';
}

export const evaluationCallsData: EvaluationCall[] = [
  { year: 2018, scope: 'national', proposals: 1, panel: true },
  { year: 2019, scope: 'national', proposals: 1, note: 'royalties' },
  { year: 2019, scope: 'university', proposals: 1 },
  { year: 2020, scope: 'university', proposals: 1 },
  { year: 2021, scope: 'national', proposals: 2, panel: true },
  { year: 2021, scope: 'national', proposals: 1, panel: true, note: 'royalties' },
  { year: 2021, scope: 'national', proposals: 1, note: 'royalties' },
  { year: 2021, scope: 'university', proposals: 1 },
  { year: 2022, scope: 'university', proposals: 1 },
  { year: 2024, scope: 'national', proposals: 1, panel: true, note: 'icgeb' },
  { year: 2024, scope: 'university', proposals: 1 },
  { year: 2024, scope: 'university', proposals: 1 },
  { year: 2025, scope: 'university', proposals: 1 },
  { year: 2026, scope: 'national', proposals: 8, note: 'experts' },
];

/** Las siete convocatorias universitarias fueron de seis universidades distintas, que no se nombran. */
export const evaluationUniversities = 6;

export interface EvaluationRecord {
  year: number;
  what: Localized;
  where: Localized;
}

/** Evaluación de profesores de otras universidades. No se nombra a ningún evaluado. */
export const facultyEvaluationsData: EvaluationRecord[] = [
  {
    year: 2021,
    what: { en: 'Evaluation committee of a competition to hire career professors', es: 'Comité evaluador de un concurso para contratar profesores de carrera' },
    where: { en: 'Universidad Industrial de Santander (UIS), School of Microbiology, biochemistry area', es: 'Universidad Industrial de Santander (UIS), Escuela de Microbiología, área de Bioquímica' },
  },
  {
    year: 2025,
    what: { en: 'External peer evaluator of a promotion to full professor', es: 'Par evaluador externo de un ascenso a profesor titular' },
    where: { en: 'Universidad de Antioquia, Department of Chemical Engineering', es: 'Universidad de Antioquia, Departamento de Ingeniería Química' },
  },
  {
    year: 2025,
    what: { en: 'External peer evaluator of a promotion to associate professor, with an oral defence', es: 'Par evaluador externo de un ascenso a profesor asociado, con sustentación oral' },
    where: { en: 'Universidad de Cartagena, School of Engineering', es: 'Universidad de Cartagena, Facultad de Ingeniería' },
  },
];

/** Jurados fuera de Uniandes. Los jurados de estudiantes de Uniandes van con su escuela. */
export const externalJuriesData: EvaluationRecord[] = [
  {
    year: 2018,
    what: { en: 'Evaluator of undergraduate theses, appropriate technologies area', es: 'Evaluador de trabajos de grado de pregrado, área de Tecnologías Apropiadas' },
    where: { en: 'Concurso Nacional Otto de Greiff, which awards the best undergraduate theses of eight universities', es: 'Concurso Nacional Otto de Greiff, que premia los mejores trabajos de grado de ocho universidades' },
  },
  {
    year: 2018,
    what: { en: 'Evaluator of a master’s thesis proposal', es: 'Evaluador de un anteproyecto de tesis de maestría' },
    where: { en: 'Universidad Icesi', es: 'Universidad Icesi' },
  },
  {
    year: 2024,
    what: { en: 'Examiner of a doctoral thesis, manuscript and defense', es: 'Jurado de una tesis doctoral, manuscrito y sustentación' },
    where: { en: 'Universidad de Antioquia', es: 'Universidad de Antioquia' },
  },
];
