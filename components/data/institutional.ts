import type { Committee } from '../../types';

export interface EditorialRole {
  journal: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  imageUrl: string;
  journalUrl: string;
}

export const editorialData: EditorialRole[] = [
  {
    journal: 'Education for Chemical Engineers',
    role: 'Editorial Board Member',
    startDate: 'Sep 2022',
    endDate: 'Present',
    description: 'Education for Chemical Engineers is a peer-reviewed academic journal published quarterly by Elsevier on behalf of the Institution of Chemical Engineers. The journal focuses on all aspects of chemical engineering education, including educational research papers, teaching and learning notes, and resource reviews.',
    responsibilities: [
      'Subject Editor in Biotechnology & Bioprocessing: Oversee the review and evaluation of manuscripts related to biotechnology, bioprocessing, and bio-related topics within the context of chemical engineering education.',
      'Special Issue Development: Actively propose and coordinate special issues on emerging topics in chemical engineering education, fostering discussions on innovative teaching methodologies and curriculum development.',
      'Academic & Industry Impact: Contribute to the strategic direction of the journal, ensuring the publication of high-quality research that bridges the gap between academic advancements and industrial applications in chemical engineering education.',
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Elsevier.svg',
    journalUrl: 'https://www.sciencedirect.com/journal/education-for-chemical-engineers'
  },
  {
    journal: 'Scientific Reports',
    role: 'Editorial Board Member',
    startDate: 'Mar 2023',
    endDate: 'Present',
    description: 'Scientific Reports is an open-access, peer-reviewed journal published by Nature Publishing Group, covering all areas of the natural and clinical sciences.',
    responsibilities: [
        'Manuscript Evaluation: As an editor in the Biotechnology section, I oversee the peer-review process, ensuring the publication of high-quality research articles that advance the field.',
        'Special Issue Coordination: Actively propose and manage special issues on emerging topics within biotechnology, fostering discussions and highlighting innovative research.',
        'Quality Assurance: Collaborate with authors and reviewers to maintain the journal’s standards, ensuring that published articles are both rigorous and impactful.',
    ],
    imageUrl: 'https://media.springernature.com/full/springer-cms/rest/v1/content/12211902/data/v4',
    journalUrl: 'https://www.nature.com/srep/'
  },
  {
    journal: 'Discover Biotechnology',
    role: 'Editorial Board Member',
    startDate: 'Sep 2024',
    endDate: 'Present',
    description: 'Discover Biotechnology is a fully open-access, peer-reviewed journal launched in September 2023 as part of the Discover series by Springer Nature. The journal aims to support multidisciplinary research and policy developments across various fields of biotechnology, serving as a platform for researchers, policymakers, and the general public to access recent advances in biotechnology and its applications in research, development, and society.',
    responsibilities: [
      'Manuscript Evaluation: As an editor in the Biotechnology section, I oversee the peer-review process, ensuring the publication of high-quality research articles that advance the field.',
      'Special Issue Coordination: Actively propose and manage special issues on emerging topics within biotechnology, fostering discussions and highlighting innovative research.',
      'Quality Assurance: Collaborate with authors and reviewers to maintain the journal’s standards, ensuring that published articles are both rigorous and impactful.',
    ],
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Springer_Nature.png',
    journalUrl: 'https://www.springer.com/journal/44164'
  }
];

export const leadershipRolesData: Committee[] = [
    {
        title: 'XXXI Inter-American & XXXIII Colombian Congress of Chemical Engineering',
        role: 'Thematic Area Leader: Food Engineering',
        startYear: 2025,
        endYear: 2025,
        description: [
            "As Thematic Area Leader for Food Engineering at the joint XXXI Inter-American and XXXIII Colombian Congress of Chemical Engineering held in Cartagena de Indias, I was entrusted with shaping the scientific program for this key area.",
            "This leadership role involved curating technical sessions, guiding discussions on the latest advancements, and fostering collaboration among professionals and academics from across the Americas."
        ]
    },
    {
        title: 'GDPP (Product and Process Design Group) Director',
        role: 'Director',
        startYear: 2025,
        endYear: 'Present',
        description: [
            "In 2025, I retook the directorship of the GDPP and led a strategic transformation to evolve the group into a more agile, collaborative, and market-oriented model. The goal was to maximize our impact by aligning with Colombia's national priorities in sustainability, energy transition, and agro-industry, effectively bridging the gap between academia and industry.",
            "The core of this transformation was the restructuring of our research capabilities into five specialized, interconnected clusters: Industrial Sustainability, Bio-innovation & Advanced Materials, Digital Process Engineering, Product & Experience Innovation, and Agri-Food Systems Engineering. This new structure is designed to foster synergy and respond effectively to complex industrial and national challenges.",
            "This new vision reframes our mission to develop and transfer tangible scientific and technological solutions. Our approach is grounded in two methodological pillars: integrated product and process design and multiscale design, ensuring we deliver rational, robust, and complete solutions."
        ]
    },
    {
        title: 'Faculty Representative, School of Engineering',
        role: 'Faculty Representative',
        startYear: 2022,
        endYear: 2024,
        description: [
            "As the elected faculty representative, my primary responsibility was to attend and actively participate in the discussions of the Faculty Council.",
            "I served as a key liaison, fostering communication between the faculty members and the Council, ensuring their perspectives were heard and considered.",
            "In this role, I had both a voice and a vote in the Council's decisions, contributing to the strategic direction and governance of the School of Engineering."
        ]
    },
    {
        title: 'GDPP (Product and Process Design Group) Director',
        role: 'Director',
        startYear: 2020,
        endYear: 2023,
        description: [
            "GDPP (Grupo de Diseño de Productos y Procesos) is the Department of Chemical and Food Engineering's A1-ranked research group, accredited by the Colombian Ministry of Science. I was appointed as its director for the 2020-2023 term.",
            "My responsibilities included ensuring compliance with the group's strategic objectives, preparing annual performance reports, and promoting interdisciplinary research by managing project proposals for internal and external funding calls.",
            "Additionally, I managed the group's budget, proposed strategic alliances with other research entities and private organizations, ensured timely reporting to funding agencies, and maintained up-to-date records of the group's researchers and activities across various databases."
        ]
    },
];

export const committeesData: Committee[] = [
    {
        title: 'Academia Joven de Colombia',
        role: 'Member',
        startYear: 2024,
        endYear: 'Present',
        level: 'National',
        description: [
            "The Young Academy of Colombia is a Special Commission of the Colombian Academy of Exact, Physical, and Natural Sciences, established by a resolution of its Board of Directors.",
            "It is composed of young academics, artists, and scientists with meritorious achievements in their professional performance. The Academy serves as a convergence space where intellectual, cultural, and social differences can be creatively integrated."
        ]
    },
    {
        title: 'Generative AI (GenAI) Usage Guidelines Committee',
        role: 'Committee Member',
        startYear: 2024,
        endYear: 2024,
        level: 'University',
        description: [
            "In October 2024, Universidad de los Andes launched its 'Guidelines for the use of generative artificial intelligence (GenAI),' a pioneering document in Colombia that provides a comprehensive set of orientations for students, professors, and administrative staff on the use of this transformative technology.",
            "The creation of these guidelines was a collaborative and multidisciplinary process involving multiple university entities. As part of the team representing the School of Engineering, alongside Dean Rubby Casallas and Professor Juan Carlos Cruz, I co-authored the entire section of the guidelines dedicated to the use of GenAI in research.",
            "The final document provides concrete recommendations categorized by user type and activity, setting a new standard for GenAI policy in Colombian higher education. It is designed as a dynamic framework, subject to updates as the technology evolves, to guide the university community on the responsible and ethical use of GenAI tools."
        ]
    },
    {
        title: 'Research and Doctorate Committee, Faculty of Engineering',
        role: 'Committee Member',
        startYear: 2022,
        endYear: 2025,
        level: 'Faculty',
        description: [
            "The Research and Doctorate Committee is an advisory body to the Faculty Council, supporting strategic decisions to promote and strengthen research within the Faculty of Engineering. It plays a central role in the university's research ecosystem.",
            "Our responsibilities include designing strategies to increase research activity, ensuring its quality and impact, suggesting methods for measuring research output, and advising the Dean on resource allocation. We also contribute to the efficient management of research infrastructure and propose strategies for disseminating research findings.",
            "As a professor member, I maintain ongoing communication with my department's director and faculty, bringing their perspectives and feedback to the committee's discussions to ensure departmental alignment with the Faculty's research goals."
        ]
    },
    {
        title: 'Research Ethics Committee, Faculty of Engineering',
        role: 'Committee Member',
        startYear: 2021,
        endYear: 'Present',
        level: 'Faculty',
        description: [
            "As a member of the Research Ethics Committee for the Faculty of Engineering, I am one of three appointed professors responsible for upholding the ethical standards of research involving living beings. The committee operates as a satellite body of the central University Ethics Committee, adhering to both Colombian national regulations (Resolution 008430 of 1993) and international research ethics standards.",
            "Our primary role is to review and provide ethical approval for all research projects conducted by undergraduate, master's, and doctoral students within the Faculty of Engineering. We evaluate project proposals to ensure they address all ethical considerations before any data collection begins, as the committee does not grant retroactive approvals.",
            "This service is crucial for maintaining the integrity of our research and ensuring that all investigations, even those classified as 'no risk,' are conducted responsibly and with the highest ethical diligence."
        ]
    },
    {
        title: 'Project-Type Courses Committee',
        role: 'Leader for the Department of Chemical and Food Engineering courses',
        startYear: 2019,
        endYear: 2020,
        level: 'Faculty',
        description: [
            "Appointed by the Dean of Engineering, this committee was composed of professors from various departments, the Teaching Support Unit, the Academic Vice-Dean, and the Academic Coordinator, who served as Secretary. The committee's objective was to define the characteristics of different project types that could be developed within the School's educational spaces as part of a new curricular reform framework.",
            "Our primary task involved collaborative discussions on topics related to the competencies, resources, organization, and evaluation of these project-based courses. The team's insights were gathered in documents such as matrices, tables, and shared files, which were analyzed to produce a consolidated report. This final deliverable, titled 'Projects in the Engineering Curriculum Reform,' was first drafted by the Academic Vice-Dean in July 2020.",
            "Our analysis revealed that while project-based learning was not new to the Faculty, it lacked a standardized format. Explicitly defining the characteristics of various project types helped faculty members identify how their courses fit within these new typologies. This framework also serves as a guide for designing and resourcing the 'project-type courses,' which are a cornerstone of the engineering programs' curricular reform."
        ]
    },
    {
        title: 'Curriculum Reform Committee',
        role: 'Committee Member',
        startYear: 2019,
        endYear: 2021,
        level: 'Department',
        description: [
            "From 2019 to 2021, I actively participated in the curriculum reform for the Chemical Engineering program and its integration with the new Food Engineering program. My role focused on designing and framing several project-oriented courses within a new pedagogical model that articulates projects, workshops, and lectures.",
            "A key contribution was incorporating the concept of Integrated Product and Process Design (DIPP) by creating a cohesive structure that linked these new project courses with four other core courses in the program, ensuring a more holistic and applied learning experience for students."
        ]
    },
    {
        title: 'AIChE Student Chapter Advisor',
        role: 'Faculty Advisor',
        startYear: 2017,
        endYear: 2021,
        level: 'Department',
        description: [
            "As the faculty advisor for the American Institute of Chemical Engineers (AIChE) Student Chapter, my primary role was to provide guidance and support, with a strong emphasis on fostering academic excellence and research initiatives.",
            "To support student-led projects for competitions like Chem-E-Car, I established the AIChE Research Seedbed. This initiative provided students with the necessary resources, lab space, and a formal structure to conduct research, leading to top rankings in regional competitions for their car design, research paper, and poster.",
            "In collaboration with departmental colleagues, I also encouraged and supported the students in creating the first-ever Transport Phenomena Olympics in 2019. The event, modeled after the long-running Thermodynamics Olympics, was designed to strengthen fundamental knowledge in a competitive and engaging format. While plans to expand it to other universities were paused due to the COVID-19 pandemic, it marked a significant student-led academic achievement."
        ]
    }
];