


import type { Recognition } from '../../types';
import type { Localized } from '../../context/i18n';

export const awardsData: Recognition[] = [
  {
    title: "Award for Innovation in Chemical Engineering Education",
    awarder: { en: "AIChE Education Division", es: "División de Educación del AIChE" },
    shortName: "AIChE",
    role: 'teaching',
    category: { en: "Innovation in Chemical Engineering Education", es: "Innovación en la educación en ingeniería química" },
    year: 2026,
    projectTitle: "Redesign of Project of Unit Operations (POU), Universidad de los Andes",
    authors: ["Luis H. Reyes"],
    summary: [
      {
        en: "The Education Division of the American Institute of Chemical Engineers named me the 2026 recipient of its Award for Innovation in Chemical Engineering Education. The award page lists it as «Integrating generative AI into chemical engineering education through project-based unit operations».",
        es: "La División de Educación del American Institute of Chemical Engineers me otorgó su Award for Innovation in Chemical Engineering Education de 2026. La página del premio lo registra como «Integrating generative AI into chemical engineering education through project-based unit operations» (la integración de la IA generativa en la educación en ingeniería química mediante operaciones unitarias basadas en proyectos)."
      },
      {
        en: "The recognized innovation is the redesign of Project of Unit Operations (POU) at Universidad de los Andes: a course where students carry a design problem through the whole semester, and where generative AI enters under explicit cognitive boundaries instead of as a shortcut. Refined over seven years and documented in peer-reviewed work, the model improved students' written communication and the rigor of their research with statistical significance, while technical performance held steady.",
        es: "La innovación reconocida es el rediseño del curso Proyecto de Operaciones Unitarias (POU) en la Universidad de los Andes: un curso en el que los estudiantes llevan un problema de diseño a lo largo de todo el semestre y usan la IA generativa con límites cognitivos explícitos. El modelo, que se afinó durante siete años y está documentado en publicaciones arbitradas, mejoró de manera estadísticamente significativa la comunicación escrita y el rigor investigativo de los estudiantes, y el desempeño técnico se mantuvo estable."
      },
      {
        en: "The distinction singles out one specific pedagogical innovation, created or implemented in a real course and judged by its documented impact on teaching effectiveness and student learning.",
        es: "La distinción reconoce una innovación pedagógica específica, creada o implementada en un curso real y juzgada por su impacto documentado en la efectividad de la enseñanza y en el aprendizaje de los estudiantes."
      },
      {
        en: "It will be presented at the Education Division dinner during the AIChE Annual Meeting in Minneapolis on November 10, 2026.",
        es: "Se entregará en la cena de la División de Educación durante el AIChE Annual Meeting en Minneapolis el 10 de noviembre de 2026."
      }
    ],
    url: "https://www.aiche.org/community/awards/award-innovation-chemical-engineering-education",
    imageUrl: "/images/aiche-logo.svg",
  },
  {
    title: "The Global Faculty AI Project",
    awarder: "OpenAI",
    role: 'teaching',
    category: { en: "Innovation in AI Education", es: "Innovación en educación con IA" },
    year: 2025,
    projectTitle: "Engineering a better way to teach with generative AI",
    authors: ["Luis H. Reyes"],
    summary: [
      {
        en: "In 2025 OpenAI selected me for the first call of its Global Faculty AI Project, to which more than 300 professors from around the world applied, with the same course, Project of Unit Operations.",
        es: "En 2025 OpenAI me seleccionó en la primera convocatoria de su Global Faculty AI Project, a la que se postularon más de 300 profesores de todo el mundo, con el mismo curso, Proyecto de Operaciones Unitarias."
      },
      {
        en: "The project co-designs AI tools with the students to give them personalized, real-time feedback in a core chemical engineering course.",
        es: "El proyecto codiseña herramientas de IA con los estudiantes para darles retroalimentación personalizada y en tiempo real en un curso fundamental de ingeniería química."
      }
    ],
    url: "https://academy.openai.com/public/videos/luis-h-reyes-project-of-unit-operations-2025-08-20",
    imageUrl: "https://img.icons8.com/?size=512&id=4KY3tfAid4dZ&format=png",
  },
  {
    title: { en: "Best research work", es: "Mejor trabajo de investigación" },
    awarder: { en: "National Academy of Medicine of Colombia", es: "Academia Nacional de Medicina de Colombia" },
    shortName: "Academia Nacional de Medicina",
    role: 'research',
    category: { en: "Scientific Research in Human Health", es: "Investigación científica en salud humana" },
    year: 2023,
    projectTitle: "CRISPR/nCas9-Based Genome Editing for GM2 Gangliosidoses and Mucopolysaccharidoses IVA Using Non-Viral Vectors",
    authors: [
        "Carlos Javier Alméciga Díaz",
        "Andrés Felipe Leal",
        "Diego Suárez",
        "Eliana Benincore",
        "Javier Cifuentes",
        "Carlos Emilio Torres",
        "Valentina Quezada",
        "Saul Camilo Gómez",
        "Juan C. Cruz",
        "Luis H. Reyes",
        "Angela Johana Espejo Mojica"
    ],
    summary: [
      {
        en: "This study aims to strengthen the national biotechnology industry and advance gene therapy in Colombia by using precise genome editing techniques to correct genetic defects in patients with rare diseases.",
        es: "El estudio busca fortalecer la industria biotecnológica nacional y la terapia génica en Colombia con técnicas precisas de edición genómica que corrijan defectos genéticos en pacientes con enfermedades raras."
      },
      {
        en: "The research evaluates the potential of CRISPR, a tool that can locate and repair specific sections of DNA, for treating these conditions. The work is a testament to Colombia's capacity for high-quality scientific innovation.",
        es: "La investigación evalúa el potencial de CRISPR, una herramienta capaz de localizar y reparar secciones específicas del ADN, para tratar estas afecciones."
      },
      {
        en: "The result of five years of collaborative work, this project provides new hope and solutions for populations suffering from difficult-to-treat diseases, demonstrating that impactful scientific advances can be made locally.",
        es: "Es el resultado de cinco años de trabajo en colaboración y muestra que en Colombia se pueden lograr avances científicos de impacto en enfermedades de difícil tratamiento."
      }
    ],
    url: "https://anmdecolombia.org.co/resultados-premios-anm-a-la-investigacion-cientifica-en-salud-humana-2023/",
    imageUrl: "https://static.thenounproject.com/png/1862029-200.png",
  },
  {
    title: { en: "Honorable mention in sciences", es: "Mención de honor en ciencias" },
    awarder: "Fundación Alejandro Ángel Escobar",
    shortName: "Alejandro Ángel Escobar",
    role: 'research',
    category: { en: "Exact, Physical, and Natural Sciences", es: "Ciencias exactas, físicas y naturales" },
    year: 2023,
    projectTitle: "CRISPR/nCas9-Based Genome Editing for GM2 Gangliosidoses and Mucopolysaccharidoses IVA Using Non-Viral Vectors",
    authors: ["Carlos Javier Alméciga Díaz", "Angela Johana Espejo Mojica", "Andrés Felipe Leal Bohórquez", "Luis H. Reyes", "Juan Carlos Cruz Jiménez"],
    summary: [
      {
        en: "This project addresses severe, rare genetic disorders like Tay-Sachs disease and Mucopolysaccharidosis IVA (MPS IVA), which currently have no effective treatments. These diseases are caused by single gene mutations, making gene therapy a promising avenue for a cure.",
        es: "Este proyecto aborda trastornos genéticos raros y severos, como la enfermedad de Tay-Sachs y la mucopolisacaridosis IVA (MPS IVA), que actualmente no cuentan con tratamientos efectivos. Las causan mutaciones en un solo gen, y por eso la terapia génica es una vía prometedora hacia una cura."
      },
      {
        en: "The research developed and tested a novel, safer gene-editing strategy using CRISPR/nCas9. This system was delivered into patient cells and mouse models using innovative, non-viral vectors made from iron-oxide nanoparticles (IONPs), overcoming key safety and cost challenges associated with traditional viral vectors.",
        es: "La investigación desarrolló y probó una estrategia de edición genética novedosa y más segura basada en CRISPR/nCas9. Este sistema se introdujo en células de pacientes y en modelos murinos con vectores no virales de nanopartículas de óxido de hierro, que evitan los problemas de seguridad y de costo de los vectores virales tradicionales."
      },
      {
        en: "The therapy proved highly successful. In vitro, it corrected the genetic defect in patient cells, restoring enzyme function and reducing cellular stress. In vivo, treating newborn mice with MPS IVA led to significant therapeutic effects, increasing enzyme activity in key tissues (including bone) and reducing disease markers without observable toxicity.",
        es: "In vitro corrigió el defecto genético en células de pacientes, restauró la función enzimática y redujo el estrés celular. In vivo, en ratones recién nacidos con MPS IVA, el tratamiento aumentó la actividad enzimática en tejidos clave, incluido el hueso, y redujo los marcadores de la enfermedad sin toxicidad observable."
      },
      {
        en: "The work received an Honorable Mention for its 'pertinence and clinical relevance,' as it provides new knowledge and demonstrates for the first time the potential of CRISPR/nCas9 as a therapeutic approach for these devastating diseases, laying the foundation for future advances in gene therapy.",
        es: "El trabajo recibió una mención honorífica por su «pertinencia y relevancia clínica», porque aporta conocimiento nuevo y muestra por primera vez el potencial de CRISPR/nCas9 como terapia para estas enfermedades."
      }
    ],
    url: "https://www.faae.org.co/premios-nacionales/ciencias-2023-crispr-ncas9-based-genome-editing-for-gm2-gangliosidoses-and-mucopolysaccharidoses-iva-using-non-viral-vectors/",
    imageUrl: "https://www.abmgood.com/assets/images/category/cate-icon/crispr-knock-in-repair-template.png",
  },
  {
    title: "Editor's Choice Article",
    awarder: "Pharmaceutics (MDPI)",
    role: 'research',
    category: { en: "Academic/Scientific Recognition", es: "Reconocimiento académico/científico" },
    year: 2021,
    projectTitle: "Delivery Systems for Nucleic Acids and Proteins: Barriers, Cell Capture Pathways and Nanocarriers",
    authors: [
        "Julian D. Torres-Vanegas",
        "Juan C. Cruz",
        "Luis H. Reyes"
    ],
    summary: [
      {
        en: "In 2021 the journal Pharmaceutics chose as an Editor's Choice article the review on delivery systems for nucleic acids and proteins that I wrote with Julian Daniel Torres Vanegas, then my doctoral student, and Juan Carlos Cruz, among some 3,600 articles published in 2020 and 2021.",
        es: "En 2021 la revista Pharmaceutics eligió como Editor's Choice la revisión sobre sistemas de entrega de ácidos nucleicos y proteínas que escribí con Julian Daniel Torres Vanegas, entonces mi doctorando, y Juan Carlos Cruz, entre unos 3.600 artículos publicados en 2020 y 2021."
      }
    ],
    url: "https://doi.org/10.3390/pharmaceutics13030428",
    imageUrl: "https://uxwing.com/wp-content/themes/uxwing/download/seo-marketing/articles-icon.png",
  },
  {
    title: { en: "Es Tiempo de Volver Program", es: "Programa Es Tiempo de Volver" },
    awarder: {
      en: "Administrative Department of Science, Technology and Innovation (Colciencias), now Minciencias",
      es: "Departamento Administrativo de Ciencia, Tecnología e Innovación (Colciencias), hoy Minciencias"
    },
    shortName: "Colciencias",
    category: { en: "Postdoctoral return fellowship", es: "Estancia posdoctoral de retorno" },
    year: 2014,
    projectTitle: "Postdoctoral stay at the Institute for the Study of Inborn Errors of Metabolism, Pontificia Universidad Javeriana (2015-2017)",
    authors: ["Luis H. Reyes"],
    summary: [
      {
        en: "At the end of 2014 Colciencias selected me for its Es Tiempo de Volver program, which brought me back to Colombia in 2015 to do research and strengthen my teaching.",
        es: "A finales de 2014 Colciencias me seleccionó para su programa Es Tiempo de Volver, con el que regresé a Colombia en 2015 para hacer investigación y fortalecer mi docencia."
      },
      {
        en: "I did the postdoctoral stay at the Institute for the Study of Inborn Errors of Metabolism of the Pontificia Universidad Javeriana in Bogotá, under Dr. Luis Alejandro Barrera, where I helped strengthen the group's molecular biology area. The stay moved my research away from biofuels and microbial evolution and toward rare diseases and human health.",
        es: "Hice la estancia posdoctoral en el Instituto de Errores Innatos del Metabolismo de la Pontificia Universidad Javeriana, en Bogotá, con el doctor Luis Alejandro Barrera, y allí ayudé a fortalecer el área de biología molecular del grupo. Con esa estancia mi investigación dejó los biocombustibles y la evolución de microorganismos y se volcó hacia las enfermedades raras y la salud humana."
      }
    ],
    url: "https://minciencias.gov.co/convocatorias/2014/convocatoria-es-tiempo-volver-2014",
    imageUrl: "/images/icons/award.svg",
  },
  {
    title: "NREL Director's Fellowship",
    awarder: "National Renewable Energy Laboratory (NREL)",
    shortName: "NREL",
    category: { en: "Postdoctoral fellowship", es: "Beca posdoctoral" },
    year: 2013,
    projectTitle: "Postdoctoral research on the new generation of consolidated bioprocesses, Biosciences group, NREL (Golden, CO)",
    authors: ["Luis H. Reyes"],
    summary: [
      {
        en: "The National Renewable Energy Laboratory awards its Director's Fellowship to attract exceptionally qualified early-career scientists and engineers with outstanding credentials in renewable energy research. In 2013 it went to three Ph.D. graduates in the United States, for a postdoctoral appointment at NREL in Golden, Colorado, the largest research center in the country devoted to renewable energy.",
        es: "El National Renewable Energy Laboratory otorga su Director's Fellowship para atraer a científicos e ingenieros jóvenes con una trayectoria sobresaliente en investigación en energías renovables. En 2013 la recibieron tres doctores en Estados Unidos, para una estancia posdoctoral en el NREL, en Golden (Colorado), el mayor centro de investigación de ese país dedicado a las energías renovables."
      },
      {
        en: "I did the stay in 2014 in the Biosciences group, under Dr. Katherine J. Chou, on the new generation of consolidated bioprocesses: the ability of an engineered microorganism to convert biomass into hydrogen, and its improvement through adaptive laboratory evolution.",
        es: "Hice la estancia en 2014 en el grupo de Biociencias, con la doctora Katherine J. Chou, sobre la nueva generación de bioprocesos consolidados: la capacidad de un microorganismo modificado para convertir biomasa en hidrógeno y su mejora mediante evolución adaptativa en el laboratorio."
      }
    ],
    url: "https://www.nrel.gov/careers/directors-fellowship",
    imageUrl: "/images/icons/award.svg",
  },
  {
    title: { en: "Cum laude distinction", es: "Grado cum laude" },
    awarder: "Universidad Industrial de Santander",
    shortName: "UIS",
    category: { en: "Academic merit", es: "Mérito académico" },
    year: 2007,
    projectTitle: "B.S. in Chemical Engineering (2001-2007)",
    authors: ["Luis H. Reyes"],
    summary: [
      {
        en: "I received the cum laude distinction for academic merit at the end of my undergraduate studies in Chemical Engineering at the Universidad Industrial de Santander (UIS), in Bucaramanga, Colombia.",
        es: "Recibí la distinción cum laude por méritos académicos al terminar el pregrado en Ingeniería Química en la Universidad Industrial de Santander (UIS), en Bucaramanga, Colombia."
      },
      {
        en: "During those years I tutored first-semester engineering students in mathematics, physics, and chemistry, which sparked my interest in teaching, and I did my undergraduate thesis as a research intern in the Chemical Engineering Department at Texas A&M University (2006).",
        es: "En esos años di clases de matemáticas, física y química a estudiantes de primeros semestres de ingeniería, lo que despertó mi interés por la docencia, e hice mi trabajo de grado como pasante de investigación en el Departamento de Ingeniería Química de Texas A&M University (2006)."
      }
    ],
    url: "https://www.uis.edu.co/",
    imageUrl: "/images/icons/graduation-cap.svg",
  }
];

/**
 * Lo que les reconocieron a sus estudiantes. Va aparte de `awardsData` porque el
 * reconocimiento es de ellos: el profesor dirigió o codirigió el trabajo.
 */
export interface StudentRecognition {
  year: number;
  /** Cuando el año no es exacto (lo reunido hasta 2020). */
  yearLabel?: Localized;
  title: Localized;
  awarder: Localized;
  students: { name: string; imageUrl?: string }[];
  summary: Localized;
  url?: string;
}

export const studentRecognitionsData: StudentRecognition[] = [
  {
    year: 2023,
    title: { en: 'III Rebeca Uribe Bone National Award', es: 'III Premio Nacional Rebeca Uribe Bone' },
    awarder: {
      en: 'Consejo Profesional de Ingeniería Química de Colombia (CPIQ)',
      es: 'Consejo Profesional de Ingeniería Química de Colombia (CPIQ)',
    },
    students: [{ name: 'Mishel Porras Ariza' }],
    summary: {
      en: 'The award goes to the best chemical engineering degree project by a woman. In 2023 it went to Mishel Porras Ariza, of the Universidad de Pamplona, for her work on the purification of the Polygly peptide and its interfacial and emulsifying properties, which I co-directed with Diego Pradilla.',
      es: 'El premio reconoce el mejor trabajo de grado en ingeniería química hecho por una mujer. En 2023 lo recibió Mishel Porras Ariza, de la Universidad de Pamplona, por su trabajo sobre la purificación del péptido Polygly y sus propiedades interfaciales y emulsificantes, que codirigí con Diego Pradilla.',
    },
    url: 'https://cpiq.gov.co/2023/12/01/ganadores-iii-premio-nacional-rebeca-uribe-bone/',
  },
  {
    year: 2020,
    yearLabel: { en: 'Until 2020', es: 'Hasta 2020' },
    title: { en: 'Mention as best undergraduate projects', es: 'Mención como mejores proyectos de grado' },
    awarder: { en: 'Universidad de los Andes', es: 'Universidad de los Andes' },
    students: [{ name: 'Manuela Alvarado Obando' }, { name: 'Alexandra Cediel Ulloa' }],
    summary: {
      en: 'Two of the undergraduate projects I directed at Uniandes received a mention as best undergraduate projects.',
      es: 'Dos de los proyectos de grado que dirigí en Uniandes recibieron mención como mejores proyectos de grado.',
    },
  },
  {
    year: 2020,
    yearLabel: { en: 'Until 2020', es: 'Hasta 2020' },
    title: { en: 'Selected for the Otto de Greiff Award', es: 'Seleccionados para el Premio Otto de Greiff' },
    awarder: { en: 'Universidad de los Andes', es: 'Universidad de los Andes' },
    students: [
      { name: 'Carlos Manuel Ramírez Acosta', imageUrl: '/images/students/carlos-manuel-ramirez-acosta.jpg' },
      { name: 'Jorge Luis Patarroyo', imageUrl: '/images/students/jorge-luis-patarroyo.jpg' },
    ],
    summary: {
      en: 'The University selected two more of the undergraduate projects I directed for the Otto de Greiff Award, which recognizes the best undergraduate theses of eight Colombian universities.',
      es: 'La Universidad seleccionó otros dos de los proyectos de grado que dirigí para el Premio Otto de Greiff, que reconoce los mejores trabajos de grado de ocho universidades del país.',
    },
  },
];
