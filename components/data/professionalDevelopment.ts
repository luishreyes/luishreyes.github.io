export interface DevelopmentActivity {
  period: string;
  title: string;
  institution?: string;
  description: string;
  details?: string[];
}

export const professionalDevelopmentData: DevelopmentActivity[] = [
    {
        period: '2024',
        title: 'Innovative Teaching with ChatGPT',
        institution: 'Vanderbilt University (via Coursera)',
        description: "This course provided practical techniques for educators to leverage Generative AI to augment teaching practices and create personalized learning experiences."
    },
    {
        period: '2023',
        title: 'Assessment in Higher Education: Professional Development for Teachers',
        institution: 'Erasmus University Rotterdam (via Coursera)',
        description: "This course was oriented to guide teachers through preparing, creating, and evaluating assessments in their courses to ensure they are effective and aligned with learning objectives."
    },
    {
        period: '2023',
        title: 'Course Redesign: Integrated Project 2',
        institution: 'Universidad de los Andes (with Conecta-TE)',
        description: "Collaborated with Conecta-TE to redesign and implement 'Integrated Project 2,' focusing on the best strategies for Project-Oriented Problem-Based Learning (PO-PBL). This partnership led to the development of a gamified course structure and the refinement of key learning objectives."
    },
    {
        period: '2021',
        title: 'NEET / J-WEL Educational Envisioning and Planning Workshop',
        institution: 'MIT J-WEL',
        description: "This workshop drew lessons from MIT's innovative NEET Program on how to reimagine undergraduate engineering education, focusing on designing interdisciplinary programs and teaching 21st-century skills."
    },
    {
        period: '2020',
        title: 'Building Innovative Teams',
        institution: 'Stanford University',
        description: "A virtual course focused on developing teachers' activities to help students learn how to build innovative teams, especially in project-oriented classes. Different aspects learned in this course are being applied to the evaluation of teamwork in project-type courses."
    },
    {
        period: '2019-2020',
        title: 'Scholarship of Teaching and Learning (SOTL) Initiative',
        institution: 'Universidad de los Andes',
        description: "As part of a community with postdoctoral researchers from the Center for Teaching and Learning, I engaged in classroom-based research. Alongside Professor Diego Pradilla, we investigated the benefits of involving industry in academic activities."
    },
    {
        period: '2019',
        title: 'Project Learning Workshop',
        institution: 'Presented by University of Strathclyde',
        description: "As an initiative of the Department of Chemical and Food Engineering, I took this workshop given by Professor Esther Ventura-Medina from the University of Strathclyde (United Kingdom)."
    },
    {
        period: '2019',
        title: 'KAOSPilot: The Art and Craft of Facilitating Learning Spaces',
        institution: 'KAOSPilot',
        description: "This course focused on experiential learning and the design of project-type courses, providing tools to create dynamic and engaging learning environments."
    },
    {
        period: '2019',
        title: 'Teaching Portfolio Training Module',
        institution: 'Universidad de los Andes',
        description: "In order to present my teaching activity efficiently, I took the university's training module on creating a teaching portfolio, given by Gary Cifuentes."
    },
    {
        period: '2019',
        title: 'Teacher Training Module: Integrated Course Design',
        institution: 'Universidad de los Andes',
        description: "This module, given by the Dean of the School of Education, focused on teaching philosophy and the necessity of designing courses that emphasize the skills and aptitudes to be instilled in students."
    },
    {
        period: '2017-2018',
        title: 'Course Redesign with Conecta-TE',
        institution: 'Universidad de los Andes',
        description: "I worked with Conecta-TE for almost two years on the redesign of my Unit Operations course. This redesign was done in conjunction with Professor Nicolás Ríos, and we made significant progress in implementing project-based learning and flipped classroom methodologies."
    }
];