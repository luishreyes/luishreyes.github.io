import React from 'react';

export interface TaughtCourse {
  term: string;
  year: number;
  code: string;
  title: string;
  students: number;
  type: 'Core' | 'Elective' | 'CBU' | 'EDCO' | 'Corporate' | 'Coursera';
  level: 'Undergraduate' | 'Graduate' | null;
  evaluation: number | null;
}

export const teachingData: TaughtCourse[] = [
  // 2025
  { term: '2025-20', year: 2025, code: 'CBP-C1320', title: 'Pandora\'s Laboratory', students: 37, type: 'CBU', level: 'Undergraduate', evaluation: 157 },
  { term: '2025-20', year: 2025, code: 'IQYA-2031', title: 'Unit Operations Project', students: 32, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2025-10', year: 2025, code: 'DPRO-4300', title: 'Systemic Bioproducts Design', students: 23, type: 'Core', level: 'Graduate', evaluation: 155 },
  { term: '2025-10', year: 2025, code: 'IQYA-4100', title: 'Industrial Biotechnology', students: 7, type: 'Elective', level: 'Graduate', evaluation: 158 },

  // 2024
  { term: '2024-20', year: 2024, code: 'CBP-C1320', title: 'Pandora\'s Laboratory', students: 37, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2024-20', year: 2024, code: 'IQYA-2031', title: 'Unit Operations Project', students: 16, type: 'Core', level: 'Undergraduate', evaluation: 149 },
  { term: '2024-20', year: 2024, code: 'IQYA-3012', title: 'Food Microbiology', students: 4, type: 'Core', level: 'Undergraduate', evaluation: 154 },
  { term: '2024-10', year: 2024, code: 'DPRO-4300', title: 'Systemic Bioproducts Design', students: 18, type: 'Core', level: 'Graduate', evaluation: 155 },
  { term: '2024-10', year: 2024, code: 'IQYA-2031', title: 'Unit Operations Project', students: 24, type: 'Core', level: 'Undergraduate', evaluation: 149 },
  { term: '2024-10', year: 2024, code: 'IQYA-3012', title: 'Food Microbiology', students: 21, type: 'Core', level: 'Undergraduate', evaluation: 155 },
  
  // 2023
  { term: '2023-20', year: 2023, code: 'CBP-C1320', title: 'Pandora\'s Laboratory', students: 36, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2023-20', year: 2023, code: 'IQYA-2032', title: 'Integrated Project 2', students: 18, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2023-20', year: 2023, code: 'IQYA-3602', title: 'ChemFood Challenge', students: 24, type: 'Elective', level: 'Undergraduate', evaluation: 160 },
  { term: '2023-20', year: 2023, code: 'IQYA-3901', title: 'IQUI Special Project', students: 2, type: 'Elective', level: 'Undergraduate', evaluation: 153 },
  { term: '2023-20', year: 2023, code: 'IQYA-4100', title: 'Industrial Biotechnology', students: 17, type: 'Elective', level: 'Graduate', evaluation: 141 },
  { term: '2023-10', year: 2023, code: 'IQYA-3601', title: 'Chemical Engineering Challenge', students: 27, type: 'Elective', level: 'Undergraduate', evaluation: 157 },
  { term: '2023-10', year: 2023, code: 'IQYA-2032', title: 'Integrated Project 2', students: 29, type: 'Core', level: 'Undergraduate', evaluation: 143 },
  { term: '2023-10', year: 2023, code: 'DPRO-4300', title: 'Systemic Bioproducts Design', students: 15, type: 'Core', level: 'Graduate', evaluation: 153 },

  // 2022
  { term: '2022-20', year: 2022, code: 'IQUI-4230', title: 'Industrial Biotechnology', students: 26, type: 'Elective', level: 'Graduate', evaluation: 152 },
  { term: '2022-20', year: 2022, code: 'IQUI-3094', title: 'Project Seminar', students: 38, type: 'Core', level: 'Undergraduate', evaluation: 157 },
  { term: '2022-20', year: 2022, code: 'IQUI-2032', title: 'Integrated Project 2', students: 36, type: 'Core', level: 'Undergraduate', evaluation: 135 },
  { term: '2022-20', year: 2022, code: 'CBP-C1320', title: 'Pandora\'s Laboratory', students: 27, type: 'CBU', level: 'Undergraduate', evaluation: 158 },
  { term: '2022-20', year: 2022, code: 'IALI-3094', title: 'Project Seminar', students: 2, type: 'Core', level: 'Undergraduate', evaluation: 151 },
  { term: '2022-10', year: 2022, code: 'IQUI-3094', title: 'Project Seminar', students: 50, type: 'Core', level: 'Undergraduate', evaluation: 155 },
  { term: '2022-10', year: 2022, code: 'IQUI-3090', title: 'Thesis Project Seminar', students: 8, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2022-10', year: 2022, code: 'IQUI-2032', title: 'Integrated Project 2', students: 79, type: 'Core', level: 'Undergraduate', evaluation: 143 },
  { term: '2022-10', year: 2022, code: 'IALI-3101', title: 'From Yeast to Beer', students: 59, type: 'Elective', level: 'Undergraduate', evaluation: 154 },
  { term: '2022-10', year: 2022, code: 'IALI-3094', title: 'Project Seminar', students: 5, type: 'Core', level: 'Undergraduate', evaluation: 141 },
  { term: '2022-10', year: 2022, code: 'DPRO-4300', title: 'Systemic Bioproducts Design', students: 30, type: 'Core', level: 'Graduate', evaluation: 140 },

  // 2021
  { term: '2021-20', year: 2021, code: 'IQUI-4230', title: 'Industrial Biotechnology', students: 13, type: 'Elective', level: 'Graduate', evaluation: 160 },
  { term: '2021-20', year: 2021, code: 'IQUI-2032', title: 'Integrated Project 2', students: 86, type: 'Core', level: 'Undergraduate', evaluation: 141 },
  { term: '2021-20', year: 2021, code: 'CBP-C1320', title: 'Pandora\'s Laboratory', students: 31, type: 'CBU', level: 'Undergraduate', evaluation: 157 },
  { term: '2021-10', year: 2021, code: 'IQUI-3350', title: 'Chemical Engineering Challenge', students: 14, type: 'Elective', level: 'Undergraduate', evaluation: 159 },
  { term: '2021-10', year: 2021, code: 'IQUI-3010', title: 'Unit Operations', students: 36, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2021-10', year: 2021, code: 'IALI-3101', title: 'From Yeast to Beer', students: 10, type: 'Elective', level: 'Undergraduate', evaluation: 159 },

  // 2020
  { term: '2020-20', year: 2020, code: 'IQUI-3010', title: 'Unit Operations', students: 49, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2020-20', year: 2020, code: 'IING-3000', title: 'Multidisciplinary Design Project in Engineering', students: 38, type: 'Elective', level: 'Undergraduate', evaluation: 152 },
  { term: '2020-20', year: 2020, code: 'IQUI-3520', title: 'Bioproducts Design Fundamentals', students: 27, type: 'Elective', level: 'Undergraduate', evaluation: 154 },
  { term: '2020-10', year: 2020, code: 'DPRO-4300', title: 'Systemic Bioproducts Design', students: 21, type: 'Core', level: 'Graduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-4230', title: 'Industrial Biotechnology', students: 16, type: 'Elective', level: 'Graduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-3350', title: 'Chemical Engineering Challenge', students: 17, type: 'Elective', level: 'Undergraduate', evaluation: null },
  { term: '2020-10', year: 2020, code: 'IQUI-3010', title: 'Unit Operations', students: 56, type: 'Core', level: 'Undergraduate', evaluation: null },
  
  // 2019
  { term: '2019-20', year: 2019, code: 'IQUI-3010', title: 'Unit Operations', students: 75, type: 'Core', level: 'Undergraduate', evaluation: 152 },
  { term: '2019-20', year: 2019, code: 'IQUI-3518', title: 'From Yeast to Beer', students: 25, type: 'Elective', level: 'Undergraduate', evaluation: 162 },
  { term: '2019-10', year: 2019, code: 'DPRO-4300', title: 'Systemic Bioproducts Design', students: 11, type: 'Core', level: 'Graduate', evaluation: 158 },
  { term: '2019-10', year: 2019, code: 'IQUI-3010', title: 'Unit Operations', students: 68, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2019-10', year: 2019, code: 'IQUI-3350', title: 'Chemical Engineering Challenge', students: 21, type: 'Elective', level: 'Undergraduate', evaluation: 163 },
  { term: '2019-10', year: 2019, code: 'IQUI-4230', title: 'Industrial Biotechnology', students: 26, type: 'Elective', level: 'Graduate', evaluation: 159 },
  
  // 2018
  { term: '2018-20', year: 2018, code: 'IQUI-3010', title: 'Unit Operations', students: 50, type: 'Core', level: 'Undergraduate', evaluation: 153 },
  { term: '2018-20', year: 2018, code: 'IQUI-3518', title: 'From Yeast to Beer', students: 30, type: 'Elective', level: 'Undergraduate', evaluation: 161 },
  { term: '2018-10', year: 2018, code: 'IQUI-2200', title: 'Experimental Design in Chemical Engineering', students: 58, type: 'Core', level: 'Undergraduate', evaluation: 156 },
  { term: '2018-10', year: 2018, code: 'IQUI-3010', title: 'Unit Operations', students: 68, type: 'Core', level: 'Undergraduate', evaluation: 154 },

  // 2017
  { term: '2017-20', year: 2017, code: 'IQUI-2200', title: 'Experimental Design in Chemical Engineering', students: 50, type: 'Core', level: 'Undergraduate', evaluation: 154 },
  { term: '2017-20', year: 2017, code: 'IQUI-3010', title: 'Unit Operations', students: 21, type: 'Core', level: 'Undergraduate', evaluation: 160 },
];

export interface TeachingPillar {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export const teachingPillars: TeachingPillar[] = [
  {
    title: 'Fundamentals as Foundation, Not Formulas as Solutions',
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1606/1606208.png", className: "h-8 w-8", alt: "Fundamentals Icon" }),
    description: "I invest intensive time ensuring students understand core principles: conservation laws, thermodynamic principles, transport phenomena. When students truly grasp these fundamentals, they don't need a formula sheet for every case. They can derive what they need, recognize patterns, and build solutions. As Professor Ramírez taught me, when you understand the fundamentals, everything else falls into place naturally.",
  },
  {
    title: 'Active Construction with Bidirectional Curiosity',
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1969/1969057.png", className: "h-8 w-8", alt: "Bidirectional Curiosity Icon" }),
    description: "I rigorously teach fundamentals, then guide students through increasingly complex problems where they build from these principles. But learning flows both ways. Their questions and approaches often reveal angles I hadn't considered. This mutual curiosity creates a learning laboratory where I explicitly acknowledge that I'm learning alongside them, removing artificial hierarchies that inhibit genuine inquiry.",
  },
  {
    title: 'Networks Over Isolated Knowledge',
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1239/1239608.png", className: "h-8 w-8", alt: "Networks Icon" }),
    description: "Real-world connections extend beyond case studies. I view my role as a node connector: linking students with peers, industry professionals, researchers, and alumni. I model this through diverse research collaborations, showing students that even experts rely on networks rather than isolated expertise. Knowing when and how to seek help matters as much as individual capability.",
  },
  {
    title: 'Social Learning as Evolutionary Pressure',
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/1956/1956643.png", className: "h-8 w-8", alt: "Social Learning Icon" }),
    description: "Team-based and experiential learning aren't just pedagogical tools; they're evolutionary pressures that develop adaptability. By constantly changing team compositions and challenge contexts, I create environments where students must continuously adapt their collaboration strategies. This mirrors the professional world where adaptability and teamwork matter more than specialized knowledge.",
  },
  {
    title: 'Confidence Through Mastery and Evolution',
    icon: React.createElement('img', { src: "https://cdn-icons-png.flaticon.com/512/11244/11244296.png", className: "h-8 w-8", alt: "Confidence and Mastery Icon" }),
    description: "When I tell students \"you are capable,\" it's based on genuine mastery of fundamentals combined with the confidence to ask for help when needed. I maintain high standards while adapting methods. If current students connect better through computational tools or industrial examples, I adjust the path, not the destination. The rigor remains; the delivery evolves.",
  }
];


export interface Testimonial {
  quote: string;
  name: string;
  info: string;
  imageUrl: string;
  context: string;
  category: 'Teaching & Mentorship' | 'Research Advising';
}

export const testimonials: Testimonial[] = [
  {
    quote: "Professor Luis H. Reyes was a fundamental figure throughout my academic career: first as my undergraduate professor, then as my thesis director, and later as my master's advisor. In every capacity, he demonstrated a profound commitment, consistent academic rigor, and a distinct human quality that set him apart. His clear guidance in research, combined with his ability to foster critical thinking and excellence, was key to my professional and scientific development. I am certain that his work is a significant contribution to the education of future generations of students and researchers.",
    name: "Angie Daniela Bolaños Barbosa",
    info: "University Tutor at Fundación Alquería Cavelier",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5804.jpeg",
    context: "Undergraduate, Thesis & M.S. Mentorship",
    category: 'Research Advising'
  },
  {
    quote: "During my doctorate, I had the opportunity to have Luis H. Reyes as my main supervisor. His guidance was characterized by an academic openness that allowed me to explore my own research interests, combined with constant guidance that fostered autonomy in my formative process. Furthermore, his supervisory style was considerate and respectful of my time, offering solid academic guidance while respecting my work rhythms. His approachability, genuineness, and willingness to provide support with resources and tools were fundamental to my growth as a researcher.",
    name: "Brayan Rodríguez",
    info: "Assistant Professor at Pontificia Universidad Javeriana",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Brayan%20Rodriguez.JPG",
    context: "Ph.D. Thesis Advisee, Engineering",
    category: 'Research Advising'
  },
  {
    quote: "As my doctoral thesis director, LuisH demonstrated a remarkable capacity for strategic and methodological guidance. His mentorship was distinguished by the combination of academic rigor, business practicality, and sensitivity to the particularities of each student, which helped to maximize my abilities. In my case, his guidance was decisive in structuring and strengthening my doctoral project, providing not only specialized knowledge but also confidence and motivation at every stage of the process.",
    name: "Julián F. Becerra-Encinales",
    info: "Director of Technological Extension at Cenipalma",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Fernando%20Becerra-Encinales.JPG",
    context: "Ph.D. Thesis Advisee, Technological Innovation Management",
    category: 'Research Advising'
  },
  {
    quote: "Professor Reyes's pedagogical approach, centered on project-based work and clear objectives, was decisive in my academic development. His guidance taught me to tackle complex problems with a systematic approach: breaking them down, formulating concrete hypotheses, designing rigorous tests, and executing experiments to validate them. He always encouraged me to understand phenomena in depth, avoiding 'black box' thinking and constantly asking 'why.' This practice strengthened my analytical skills and shaped how I approach research and innovation in the biomedical field today.",
    name: "Cristian F. Rodríguez",
    info: "Instructor Professor at Universidad de los Andes",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5728.jpg",
    context: "M.S. Thesis Advisee, Biomedical Engineering",
    category: 'Research Advising'
  },
  {
    quote: "Industrial Biotechnology is a course that reveals the diverse applications of Chemical Engineering when combined with biology, opening up a world of possibilities for a more sustainable future. In Professor Luis H.'s class, we not only learned about the various stages of bioproduct production but also developed critical thinking about the consequences, advantages, and disadvantages of designing these products and processes.",
    name: "Daniela Aristizabal",
    info: "Management Specialist at Bavaria",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5792%20(1).jpeg",
    context: "Course: Industrial Biotechnology",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "Industrial Biotechnology is an exciting course because it brings together and applies concepts from throughout the entire curriculum. The methodology effectively ties together key concepts, providing a comprehensive understanding of the subject. The final third of the class was the most interesting, as it showcased various real-world applications of biotechnology. This opened my perspective on how the semester's lessons translate into tangible developments and innovations.",
    name: "David Santamaría",
    info: "Cheese Expert at Novonesis",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5791.jpeg",
    context: "Course: Industrial Biotechnology",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "The Industrial Biotechnology course was highly engaging and well-structured. The topics were organized sequentially, and the classes were enriched with recent scientific articles, which made the content feel current and relevant. However, I found the most valuable components to be the emphasis on debate, critical thinking, and the challenge of defending a position with scientific evidence. In short, it was a truly formative experience in every sense of the word.",
    name: "Fabio Esteban Herrera",
    info: "Postdoctoral Researcher in Molecular Machine Learning, Leibniz Institute of Plant Biochemistry",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5797.jpeg",
    context: "Course: Industrial Biotechnology",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "The brewing course is an excellent opportunity to gain specific knowledge about the entire brewing process, from evaluating malt quality to packaging the final product. As a Chemical Engineering graduate now working as a Quality Assurance Specialist at Central Cervecera de Colombia, I can say that taking this course was one of the best decisions of my academic career. It provided me with a strong foundation to understand the operations and objectives of the beer industry in a clear and efficient way.",
    name: "Diego Alejandro Peñaloza Mayorga",
    info: "Quality Assurance Specialist, Central Cervecera de Colombia",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5790.jpeg",
    context: "Course: From Yeast to Beer",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "'From Yeast to Beer' is built on a simple, captivating idea: understanding the beer in your hand. It sparks an innate curiosity that turns every sip into a question of 'how?' and 'why?' For me, this was the first course that truly felt like applied Chemical Engineering. We were challenged to think and act as engineers facing a real problem where our decisions directly impacted a tangible product. It’s a powerful way to learn.",
    name: "Jason Bernal Sánchez",
    info: "Process Engineer, Sun Chemical",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5798.jpeg",
    context: "Course: From Yeast to Beer",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "'From Yeast to Beer,' or as I like to call it, the 'Pola class,' is a student's first true taste of the real world of a chemical engineer. It’s where you get to manage a process and design your own product from start to finish. Luis H. ensures we tackle topics of equal or greater relevance, such as analyzing the process's environmental impact, designing and marketing a brand, and managing the product financially. This holistic approach wouldn't be possible without the passion Luis H. inspires in his students.",
    name: "Camilo Zarate",
    info: "MBA, Georgetown University",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5784.jpeg",
    context: "Course: From Yeast to Beer",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "I had the opportunity to take several engineering courses with Luis Reyes and I could witness his work in each of these courses. He is a methodical professor, who strives to impart valuable content and integrate new technologies and current topics. He also seeks to offer practical and realistic tools that facilitate learning and skill development.\n\nIn the courses I took with him, he always managed to get us to analyze beyond the specific topics, encouraging the development of critical and structured thinking. He always encouraged us to implement what we learned in a practical way to solve real problems, going beyond theory and getting genuinely involved in our professional and personal growth.",
    name: "Camila Ocasión",
    info: "M.S. in Chemical Engineering, Director of Corporate Responsibility at Hevolución",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5777.JPG",
    context: "Course: Multiple Engineering Courses",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "As a thesis advisor, he never just gave direct answers; instead, he equipped me with the tools to find my own solutions, encouraging innovative thinking and a resilient attitude.",
    name: "Carlos Manuel Ramirez Acosta",
    info: "Research Professional at Vecol S.A.",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5801.jpeg",
    context: "M.S. Thesis Advisee",
    category: 'Research Advising'
  },
  {
    quote: "As a professor, his passion is undeniable. In one class, he used a simple discussion about pandas to teach us the fundamentals of experimental design, captivating the entire room. Years later, it's clear he wasn't just teaching us about pandas; he was teaching us to think critically, to approach questions with clear tools, and to be aware of the world around us. This anecdote shows the lasting impact of a great teacher.",
    name: "Carlos Manuel Ramirez Acosta",
    info: "Research Professional at Vecol S.A.",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5801.jpeg",
    context: "Course: Experimental Design",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "During my doctoral studies, I had the opportunity to be advised by Dr. Luis H. Reyes. I witnessed his attentiveness and assertiveness in guiding my thesis development. He always gave me complete autonomy to resolve situations that arose during experiments and writing.",
    name: "Julian Daniel Torres Vanegas",
    info: "Assistant Professor at Universidad EAN",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Daniel%20Torres%20Vanegas.JPG",
    context: "Ph.D. Thesis Advisee",
    category: 'Research Advising'
  },
  {
    quote: "As his teaching assistant, I also saw the great interest and effort he puts into designing creative learning experiences. These experiences motivated his students to take ownership of their learning process and engage with commitment, reflected in their excellent academic performance. I can state without a doubt that Professor Luis H. is one of the best teachers I have had, inspiring me to give my best in my current work as a professor.",
    name: "Julian Daniel Torres Vanegas",
    info: "Assistant Professor at Universidad EAN",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Daniel%20Torres%20Vanegas.JPG",
    context: "Teaching Assistant",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "I had the opportunity to work with Professor Luis H. Reyes in various academic settings: first as his student in the Unit Operations course and later as a graduate assistant. In each of these contexts, the professor distinguished himself by his creativity and the constant generation of valuable ideas, which enriched both learning and academic development.",
    name: "Olga Lucia Acuña",
    info: "M.S. in Chemical Engineering",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5782.JPG",
    context: "Course Student & Graduate Assistant",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "As my thesis advisor, one of the qualities I most highlight is the freedom he provides to explore different paths when difficulties arise. This openness fosters autonomy and critical thinking, while maintaining close and guiding support. Thanks to his guidance, I was able to strengthen my academic and professional capabilities and understand the importance of leadership that combines guidance with trust in the student.",
    name: "Olga Lucia Acuña",
    info: "M.S. in Chemical Engineering",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5782.JPG",
    context: "M.S. Thesis Advisee",
    category: 'Research Advising'
  },
  {
    quote: "What distinguishes Professor Reyes is not just his vast experience and ability to drive innovative research, but his exceptional human quality. He sees not just his students, but the people behind them. His warmth and support transcend academics, and that value is, for me, even more significant than any technical knowledge. He is always willing to listen, guide, and motivate, even in the most challenging moments. A large part of the professional I am today is due to his influence.",
    name: "Valentina Quezada",
    info: "Researcher at Universidad de los Andes",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5755.JPG",
    context: "Mentorship Experience",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "Under his mentorship, I participated in a pioneering project on transmembrane peptides and later, as my M.S. thesis co-advisor, he guided my work on an antifungal hydrogel, which led to a patent submission. This experience taught me the importance of developing accessible, scalable methodologies. He conveys the conviction that science must transcend the laboratory to generate a real impact on society.",
    name: "Valentina Quezada",
    info: "Researcher at Universidad de los Andes",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5755.JPG",
    context: "Undergraduate Researcher & M.S. Thesis Advisee",
    category: 'Research Advising'
  },
  {
    quote: "I had the opportunity to take the Unit Operations and Industrial Biotechnology courses with Professor Luis H. On both occasions, he proved to be an excellent teacher, combining a deep knowledge of the subject with a dynamic and innovative teaching methodology. From including current topics as case studies to examples from various disciplines that showed the interrelation of knowledge and the versatility of engineering to be applied in different fields, his way of teaching was always enriching. He even implemented novel methods for exams, such as the Jeopardy format, and always maintained an 'open door' policy to clarify students' specific doubts. All this made it so that, even seven years later, I can affirm that it was one of the lessons I internalized the most during my time at the university.",
    name: "Juanita Sierra",
    info: "Consultant in sustainable finance at Ambire Global",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5799.jpeg",
    context: "Course: Unit Operations & Industrial Biotechnology",
    category: 'Teaching & Mentorship'
  },
  {
    quote: "That versatility of Luis H. motivated me to seek him out as my thesis advisor. In this process, we designed an oxygen concentrator for its application in fish farming. During this time, it was evident not only his support in administrative matters, but also his ability to foster an environment of curiosity in which it was possible to question our methods and arrive at creative and 'out-of-the-box' solutions to overcome the challenges that arose along the way.\n\nToday, Luis H. continues to be for me a model of innovation, adaptability, and commitment to teaching.",
    name: "Juanita Sierra",
    info: "Consultant in sustainable finance at Ambire Global",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5799.jpeg",
    context: "Undergraduate Thesis Advisee",
    category: 'Research Advising'
  },
  {
    quote: "Working with Professor Luis between 2019 and 2021 was a key stage in my academic and professional development. During that time, I had the opportunity to have his support as my master's thesis advisor and, at the same time, as my supervisor in my roles as a research assistant and teaching assistant for the Unit Operations course. His passion for science and research left a significant mark on me, especially as I began my journey in the world of bioprocesses and biotechnology. Experiencing this stage during the pandemic made his guidance even more valuable; his constant support gave me peace of mind amid the uncertainty and allowed my research project to have a significant impact during a complicated time. Thanks to his guidance, I was able to focus my knowledge in an area I am passionate about, which undoubtedly defined the course of my career.",
    name: "Maria Camila Henao",
    info: "Scientist at VaxThera",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5759.JPG",
    context: "M.S. Thesis Advisee & Research/Teaching Assistant",
    category: 'Research Advising'
  },
  {
    quote: "My professional relationship with Professor Luis gave me much more than technical knowledge; he instilled in me important values for my personal growth. With him, I learned to see mistakes as opportunities for improvement and to work with a greater awareness of my weaknesses. He always knew how to correct with respect and teach with enthusiasm, which created a positive and challenging learning environment. Today, four years after graduating, I am grateful for everything he gave me, not only as a teacher but also as a mentor. A large part of the professional I am today is due to his guidance, and I hope one day we can reconnect on future projects.\n\nFinally, I'd like to point out that one rarely has the chance to learn so much from someone as cool as Luis: his approachability and sense of humor made even the most demanding days in the lab much more bearable.",
    name: "Maria Camila Henao",
    info: "Scientist at VaxThera",
    imageUrl: "https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5759.JPG",
    context: "General Mentorship",
    category: 'Teaching & Mentorship'
  }
];
