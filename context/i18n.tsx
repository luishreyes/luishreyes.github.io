import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Lang = 'en' | 'es';

// ── UI strings ──────────────────────────────────────────────
const ui = {

  // ── Navbar ──────────────────────────────────────────────
  'nav.principles':        { en: 'Guiding Principles',      es: 'Principios Rectores' },
  'nav.principles.teaching': { en: 'Teaching Purpose',      es: 'Propósito Docente' },
  'nav.principles.research': { en: 'Research Purpose',      es: 'Propósito Investigador' },
  'nav.principles.service':  { en: 'Service Purpose',       es: 'Propósito de Servicio' },
  'nav.principles.philosophy': { en: 'Teaching Philosophy', es: 'Filosofía de Enseñanza' },
  'nav.research':          { en: 'Research',                es: 'Investigación' },
  'nav.research.overview': { en: 'Overview',                es: 'Visión General' },
  'nav.research.program':  { en: 'Research Program',        es: 'Programa de Investigación' },
  'nav.research.products': { en: 'Products',                es: 'Productos' },
  'nav.research.grants':   { en: 'Grants',                  es: 'Financiamiento' },
  'nav.research.students': { en: 'Grad Students',           es: 'Estudiantes de Posgrado' },
  'nav.teaching':          { en: 'Teaching',                es: 'Docencia' },
  'nav.teaching.overview': { en: 'Overview',                es: 'Visión General' },
  'nav.teaching.courses':  { en: 'Courses Taught',          es: 'Cursos Impartidos' },
  'nav.teaching.unitops':  { en: 'Unit Ops Innovation',     es: 'Innovación en Ops. Unitarias' },
  'nav.teaching.continuing': { en: 'Continuing Education',  es: 'Educación Continua' },
  'nav.teaching.testimonials': { en: 'Testimonials',        es: 'Testimonios' },
  'nav.teaching.scholarship':  { en: 'Scholarship of Teaching', es: 'Beca de Enseñanza' },
  'nav.teaching.profdev':  { en: 'Professional Development', es: 'Desarrollo Profesional' },
  'nav.service':           { en: 'Service',                 es: 'Servicio' },
  'nav.service.overview':  { en: 'Overview',                es: 'Visión General' },
  'nav.service.ai':        { en: 'Augmented Intelligence',  es: 'Inteligencia Aumentada' },
  'nav.service.leadership': { en: 'Service & Leadership',   es: 'Servicio y Liderazgo' },
  'nav.service.editorial': { en: 'Editorial Boards',        es: 'Comités Editoriales' },
  'nav.service.outreach':  { en: 'Outreach & Scouting',     es: 'Divulgación y Scouting' },
  'nav.recognition':       { en: 'Recognition',             es: 'Reconocimientos' },
  'nav.classroom':         { en: 'Classroom',               es: 'Aula' },
  'nav.downloadCv':        { en: 'Download CV',             es: 'Descargar CV' },

  // ── AboutPage ──────────────────────────────────────────
  'about.hero.greeting':   { en: 'Hi, my name is',          es: 'Hola, mi nombre es' },
  'about.hero.tagline':    { en: 'I engineer biology for a better future.', es: 'Ingeniería biológica para un futuro mejor.' },
  'about.hero.bio':        { en: 'I am an Associate Professor at Universidad de los Andes, leading research at the convergence of biotechnology, nanotechnology, and AI to transform complex challenges into sustainable, high-impact solutions.', es: 'Soy Profesor Asociado en la Universidad de los Andes, liderando investigación en la convergencia de biotecnología, nanotecnología e IA para transformar desafíos complejos en soluciones sostenibles de alto impacto.' },
  'about.hero.cta':        { en: 'Explore My Work',          es: 'Explorar mi trabajo' },
  'about.purpose.title':   { en: 'My Professional Purpose',  es: 'Mi Propósito Profesional' },
  'about.purpose.text':    { en: 'I am dedicated to driving innovation in biotechnology, nanotechnology, and generative AI. My professional purpose is to transform complex challenges into practical solutions that enhance quality of life and promote sustainable development.', es: 'Me dedico a impulsar la innovación en biotecnología, nanotecnología e IA generativa. Mi propósito profesional es transformar desafíos complejos en soluciones prácticas que mejoren la calidad de vida y promuevan el desarrollo sostenible.' },
  'about.mission.title':   { en: 'Mission & Approach',       es: 'Misión y Enfoque' },
  'about.mission.researchers.title': { en: 'For Researchers & Academics', es: 'Para Investigadores y Académicos' },
  'about.mission.researchers.text':  { en: 'Leading and collaborating on applied, interdisciplinary research projects that address real-world problems.', es: 'Liderando y colaborando en proyectos de investigación aplicada e interdisciplinaria que abordan problemas del mundo real.' },
  'about.mission.students.title': { en: 'For Engineering Students', es: 'Para Estudiantes de Ingeniería' },
  'about.mission.students.text':  { en: 'Providing mentorship and specialized training to deepen knowledge and foster the next generation of innovators.', es: 'Brindando mentoría y formación especializada para profundizar el conocimiento y cultivar la próxima generación de innovadores.' },
  'about.mission.industry.title': { en: 'For Companies & Startups', es: 'Para Empresas y Startups' },
  'about.mission.industry.text':  { en: 'Advising on the implementation of advanced technologies to improve processes, products, and solutions.', es: 'Asesorando en la implementación de tecnologías avanzadas para mejorar procesos, productos y soluciones.' },
  'about.education.title': { en: 'Academic Background',      es: 'Formación Académica' },
  'about.experience.title': { en: 'Work Experience',         es: 'Experiencia Laboral' },
  'about.continuing.title': { en: 'Continuing Education & Specializations', es: 'Educación Continua y Especializaciones' },
  'about.licenses.title':  { en: 'Licenses & Certifications', es: 'Licencias y Certificaciones' },
  'about.collab.title':    { en: "Let's Collaborate",         es: 'Colaboremos' },
  'about.collab.text':     { en: 'I am always looking to connect with professionals and organizations that share my passion for technological innovation. If you are looking for collaboration or expert advice in biotechnology, nanotechnology, or generative AI, feel free to reach out. I am here to help turn your ideas into tangible realities.', es: 'Siempre estoy buscando conectar con profesionales y organizaciones que compartan mi pasión por la innovación tecnológica. Si buscas colaboración o asesoría experta en biotecnología, nanotecnología o IA generativa, no dudes en escribirme. Estoy aquí para ayudar a convertir tus ideas en realidades tangibles.' },
  'about.collab.cta':      { en: 'Get in Touch',              es: 'Escríbeme' },

  // ── Research Overview ──────────────────────────────────
  'research.overview.title':    { en: 'Research Overview',   es: 'Visión General de Investigación' },
  'research.overview.subtitle': { en: 'Mapping a journey of discovery at the intersection of biotechnology, nanotechnology, and AI.', es: 'Trazando un recorrido de descubrimiento en la intersección de biotecnología, nanotecnología e IA.' },
  'research.overview.vision.title': { en: 'Research Vision', es: 'Visión de Investigación' },
  'research.overview.vision.text':  { en: 'My research group is dedicated to engineering biology for a better life and creating a sustainable future. We operate at the convergence of biotechnology, nanotechnology, and artificial intelligence, applying engineering principles to design, build, and optimize living systems. Our work addresses critical challenges across biomedical, food, and environmental engineering, transforming microorganisms into microscopic factories that produce high-value products for medicine, food, and sustainable industry.', es: 'Mi grupo de investigación se dedica a la ingeniería biológica para una vida mejor y un futuro sostenible. Operamos en la convergencia de biotecnología, nanotecnología e inteligencia artificial, aplicando principios de ingeniería para diseñar, construir y optimizar sistemas vivos. Nuestro trabajo aborda desafíos críticos en ingeniería biomédica, alimentaria y ambiental, transformando microorganismos en fábricas microscópicas que producen productos de alto valor para la medicina, la alimentación y la industria sostenible.' },
  'research.overview.vision.cta': { en: 'Explore Our Research Program', es: 'Explorar nuestro programa de investigación' },

  // ── Stats labels ──────────────────────────────────────
  'stats.products':         { en: 'Products',               es: 'Productos' },
  'stats.citations':        { en: 'Total Citations',         es: 'Citas Totales' },
  'stats.hindex':           { en: 'h-index',                es: 'Índice h' },
  'stats.i10index':         { en: 'i10-index',              es: 'Índice i10' },
  'stats.grants':           { en: 'Funded Grants',           es: 'Proyectos Financiados' },
  'stats.mentees':          { en: 'Mentees',                 es: 'Estudiantes Mentorizados' },
  'stats.totalCourses':     { en: 'Total Courses Taught',   es: 'Cursos Impartidos en Total' },
  'stats.totalStudents':    { en: 'Total Students',          es: 'Estudiantes en Total' },
  'stats.avgEvaluation':    { en: 'Avg. Evaluation Score',  es: 'Promedio de Evaluación' },
  'stats.uniqueCourses':    { en: 'Unique Course Titles',    es: 'Títulos de Cursos Únicos' },
  'stats.uniCourses':       { en: 'University Courses',      es: 'Cursos Universitarios' },
  'stats.contEdCourses':    { en: 'Continuing Ed. Courses',  es: 'Cursos de Ed. Continua' },

  // ── Research Program ──────────────────────────────────
  'research.program.title':  { en: 'Research Program: Biological Engineering', es: 'Programa de Investigación: Ingeniería Biológica' },
  'research.program.sub':    { en: 'Our research group applies engineering principles to design, build, and optimize living systems, addressing critical challenges across biomedical, food, and environmental engineering.', es: 'Nuestro grupo de investigación aplica principios de ingeniería para diseñar, construir y optimizar sistemas vivos, abordando desafíos críticos en ingeniería biomédica, alimentaria y ambiental.' },
  'research.program.para1':  { en: 'My research group is dedicated to engineering biology for a better life and creating a sustainable future. We operate at the convergence of biotechnology, nanotechnology, and artificial intelligence, applying engineering principles to design, build, and optimize living systems. Our work addresses critical challenges across biomedical, food, and environmental engineering, transforming microorganisms into microscopic factories that produce high-value products for medicine, food, and sustainable industry.', es: 'Mi grupo de investigación se dedica a la ingeniería biológica para una vida mejor y un futuro sostenible. Operamos en la convergencia de biotecnología, nanotecnología e inteligencia artificial, aplicando principios de ingeniería para diseñar, construir y optimizar sistemas vivos. Nuestro trabajo aborda desafíos críticos en ingeniería biomédica, alimentaria y ambiental, transformando microorganismos en fábricas microscópicas que producen productos de alto valor para la medicina, la alimentación y la industria sostenible.' },
  'research.program.para2':  { en: 'This work is driven by a deeply interdisciplinary approach. We use synthetic biology to write new genetic programs for cells, and employ computational biology and AI to predict and accelerate our designs. Our expertise in bioprocess engineering allows us to scale these solutions from the lab to industrial production. In parallel, we engineer smart biomaterials and nanocarriers for targeted drug and gene therapies. By integrating these advanced tools with nature\'s own design process—adaptive laboratory evolution—we rapidly innovate robust solutions that advance a circular economy.', es: 'Este trabajo está impulsado por un enfoque profundamente interdisciplinario. Usamos biología sintética para escribir nuevos programas genéticos en células, y empleamos biología computacional e IA para predecir y acelerar nuestros diseños. Nuestra experiencia en ingeniería de bioprocesos nos permite escalar estas soluciones del laboratorio a la producción industrial. En paralelo, diseñamos biomateriales inteligentes y nanocarriers para terapias génicas y farmacológicas dirigidas. Al integrar estas herramientas avanzadas con el proceso de diseño propio de la naturaleza —la evolución adaptativa de laboratorio— innovamos rápidamente soluciones robustas que impulsan una economía circular.' },

  // ── Products ──────────────────────────────────────────
  'products.title':          { en: 'Products',               es: 'Productos' },
  'products.loading':        { en: 'Loading products...',    es: 'Cargando productos...' },
  'products.showing':        { en: 'Showing',                es: 'Mostrando' },
  'products.of':             { en: 'of',                     es: 'de' },
  'products.total':          { en: 'total products.',        es: 'productos en total.' },
  'products.sortBy':         { en: 'Sort by:',              es: 'Ordenar por:' },
  'products.sortDate':       { en: 'Date',                   es: 'Fecha' },
  'products.sortCitations':  { en: 'Citations',              es: 'Citas' },
  'products.search':         { en: 'Search...',              es: 'Buscar...' },
  'products.loading.title':  { en: 'Loading Products...',   es: 'Cargando productos...' },
  'products.loading.sub':    { en: 'Fetching the latest data from the database.', es: 'Obteniendo los datos más recientes de la base de datos.' },
  'products.empty.title':    { en: 'No Products Found',     es: 'No se encontraron productos' },
  'products.empty.sub':      { en: 'Try adjusting your search or filters.', es: 'Intenta ajustar tu búsqueda o los filtros.' },

  // ── Grants ──────────────────────────────────────────
  'grants.title':            { en: 'Funded Grants',          es: 'Proyectos Financiados' },
  'grants.sortBy':           { en: 'Sort by:',              es: 'Ordenar por:' },
  'grants.newest':           { en: 'Newest First',           es: 'Más recientes primero' },
  'grants.oldest':           { en: 'Oldest First',           es: 'Más antiguos primero' },

  // ── Students ──────────────────────────────────────────
  'students.title':          { en: 'Grad Students',          es: 'Estudiantes de Posgrado' },
  'students.filter.all':     { en: 'All Students',           es: 'Todos' },
  'students.filter.current': { en: 'Current Students',       es: 'Estudiantes actuales' },
  'students.filter.alumni':  { en: 'Alumni Students',        es: 'Egresados' },
  'students.current':        { en: 'Current Students',       es: 'Estudiantes Actuales' },
  'students.alumni':         { en: 'Alumni',                 es: 'Egresados' },
  'students.phd':            { en: 'Ph.D. Students',         es: 'Estudiantes de Doctorado' },
  'students.ms':             { en: "Master's Students",      es: 'Estudiantes de Maestría' },
  'students.phd.graduates':  { en: 'Ph.D. Graduates',       es: 'Graduados de Doctorado' },
  'students.ms.graduates':   { en: "Master's Graduates",    es: 'Graduados de Maestría' },
  'students.thesis.show':    { en: 'Show Thesis Summary',    es: 'Ver resumen de tesis' },
  'students.thesis.hide':    { en: 'Hide Thesis Summary',    es: 'Ocultar resumen de tesis' },
  'students.graduated':      { en: 'Graduated',              es: 'Graduado/a' },

  // ── Awards / Recognition ──────────────────────────────
  'awards.title':            { en: 'Recognition & Honors',   es: 'Reconocimientos y Distinciones' },
  'awards.subtitle':         { en: 'Highlighting recognitions for significant contributions to science, education, and engineering from esteemed international and national bodies.', es: 'Destacando reconocimientos por contribuciones significativas a la ciencia, la educación y la ingeniería de parte de organismos internacionales y nacionales de prestigio.' },
  'awards.work':             { en: 'Work:',                  es: 'Trabajo:' },
  'awards.authors':          { en: 'Authors:',               es: 'Autores:' },
  'awards.learnMore':        { en: 'Learn More',             es: 'Saber más' },

  // ── Teaching Overview ──────────────────────────────────
  'teaching.overview.title':    { en: 'Teaching Overview',  es: 'Visión General de Docencia' },
  'teaching.overview.subtitle': { en: 'Fostering the next generation of innovators through project-based learning and real-world challenges.', es: 'Formando a la próxima generación de innovadores mediante aprendizaje basado en proyectos y retos del mundo real.' },
  'teaching.overview.approach.title': { en: 'My Teaching Approach', es: 'Mi Enfoque Pedagógico' },
  'teaching.overview.approach.text':  { en: 'My teaching portfolio reflects a deep commitment to engineering education across all levels, from core undergraduate courses to specialized graduate seminars and professional development programs. My courses are designed to be dynamic, hands-on learning environments where students tackle real-world challenges. I emphasize a project-based approach that not only builds strong technical foundations but also cultivates essential professional skills like critical thinking, teamwork, and communication. Through my involvement in curriculum design, continuing education, and corporate training, I strive to create impactful learning experiences that bridge the gap between academic theory and industry practice, empowering the next generation of engineers to innovate and lead.', es: 'Mi portafolio docente refleja un profundo compromiso con la educación en ingeniería en todos los niveles, desde cursos básicos de pregrado hasta seminarios especializados de posgrado y programas de desarrollo profesional. Mis cursos están diseñados como entornos de aprendizaje dinámicos y prácticos donde los estudiantes abordan desafíos del mundo real. Hago énfasis en un enfoque basado en proyectos que no solo construye fundamentos técnicos sólidos, sino que también cultiva habilidades profesionales esenciales como el pensamiento crítico, el trabajo en equipo y la comunicación. A través de mi participación en el diseño curricular, la educación continua y la formación corporativa, me esfuerzo por crear experiencias de aprendizaje que cierren la brecha entre la teoría académica y la práctica industrial, empoderando a la próxima generación de ingenieros para innovar y liderar.' },

  // ── Courses ──────────────────────────────────────────
  'courses.title':           { en: 'Courses Taught',         es: 'Cursos Impartidos' },
  'courses.sub':             { en: 'Below is a comprehensive list of courses I have taught since 2017, detailing student engagement, course type, and my role in their design.', es: 'A continuación se presenta una lista completa de los cursos que he impartido desde 2017, con detalle de la participación estudiantil, el tipo de curso y mi rol en su diseño.' },
  'courses.col.term':        { en: 'Term',                   es: 'Período' },
  'courses.col.course':      { en: 'Course',                 es: 'Curso' },
  'courses.col.students':    { en: 'Students',               es: 'Estudiantes' },
  'courses.col.type':        { en: 'Type',                   es: 'Tipo' },
  'courses.col.evaluation':  { en: 'Student Evaluation',     es: 'Evaluación Estudiantil' },

  // ── Unit Ops Innovation ──────────────────────────────
  'unitops.title':           { en: 'Unit Operations Innovation', es: 'Innovación en Operaciones Unitarias' },
  'unitops.sub':             { en: 'A Seven-Year Journey: From Theory and Problem-Sets to Project-Based Synthesis.', es: 'Un recorrido de siete años: de la teoría y los ejercicios al aprendizaje basado en proyectos.' },
  'unitops.context':         { en: 'Context',                es: 'Contexto' },
  'unitops.evolution':       { en: 'The Evolution',          es: 'La Evolución' },
  'unitops.impact':          { en: 'Impact on Student Experience', es: 'Impacto en la Experiencia Estudiantil' },
  'unitops.lessons':         { en: 'Lessons Learned',        es: 'Lecciones Aprendidas' },
  'unitops.scholarly':       { en: 'Scholarly Foundation',   es: 'Base Académica' },
  'unitops.chart.title':     { en: 'Score Evolution: The Reform Journey', es: 'Evolución de Puntajes: El Camino de la Reforma' },
  'unitops.chart.scale':     { en: 'Institutional 100–200 Scale', es: 'Escala Institucional 100–200' },
  'unitops.phase.traditional': { en: 'Traditional',         es: 'Tradicional' },
  'unitops.phase.reform':    { en: 'Reform Era',             es: 'Era de Reforma' },
  'unitops.phase.synthesis': { en: 'Synthesis',              es: 'Síntesis' },
  'unitops.quote':           { en: '"The result speaks for itself. The course now combines the rigor students expect with the authentic design experience that motivated the original transformation."', es: '«El resultado habla por sí solo. El curso ahora combina el rigor que los estudiantes esperan con la experiencia auténtica de diseño que motivó la transformación original.»' },

  // ── Continuing Education ──────────────────────────────
  'contEd.title':            { en: 'Continuing Education',   es: 'Educación Continua' },
  'contEd.sub':              { en: 'Beyond traditional university courses, I am actively involved in designing and delivering continuing education programs and corporate training. These courses aim to bridge the gap between academia and industry, providing professionals with cutting-edge skills in areas like artificial intelligence, biotechnology, and innovation management.', es: 'Más allá de los cursos universitarios tradicionales, participo activamente en el diseño y la impartición de programas de educación continua y formación corporativa. Estos cursos buscan cerrar la brecha entre la academia y la industria, dotando a los profesionales de habilidades de vanguardia en áreas como inteligencia artificial, biotecnología y gestión de la innovación.' },
  'contEd.col.year':         { en: 'Year',                   es: 'Año' },
  'contEd.col.title':        { en: 'Course Title',           es: 'Título del Curso' },
  'contEd.col.type':         { en: 'Type / Client',          es: 'Tipo / Cliente' },
  'contEd.col.attendees':    { en: 'Attendees',              es: 'Participantes' },
  'contEd.col.role':         { en: 'Role',                   es: 'Rol' },

  // ── Testimonials ──────────────────────────────────────
  'testimonials.title':      { en: 'Student Testimonials',   es: 'Testimonios de Estudiantes' },
  'testimonials.sub':        { en: 'Hearing from students is the most meaningful measure of teaching success. Here is what some of my past and present students have to say about their learning experiences.', es: 'Escuchar a los estudiantes es la medida más significativa del éxito docente. Esto es lo que algunos de mis estudiantes, pasados y presentes, tienen que decir sobre sus experiencias de aprendizaje.' },
  'testimonials.filter.all': { en: 'All',                    es: 'Todos' },
  'testimonials.filter.teaching': { en: 'Teaching & Mentorship', es: 'Docencia y Mentoría' },
  'testimonials.filter.research': { en: 'Research Advising', es: 'Asesoría de Investigación' },

  // ── Scholarship of Teaching ──────────────────────────
  'sotl.title':              { en: 'Scholarship of Teaching & Learning (SOTL)', es: 'Beca de Enseñanza y Aprendizaje (SoTL)' },
  'sotl.sub':                { en: 'Applying rigorous research skills to improve pedagogical practices in engineering, enhancing student learning and professional development.', es: 'Aplicando habilidades de investigación rigurosa para mejorar las prácticas pedagógicas en ingeniería, mejorando el aprendizaje estudiantil y el desarrollo profesional.' },
  'sotl.editorial':          { en: 'Editorial Contributions', es: 'Contribuciones Editoriales' },
  'sotl.publications':       { en: 'Related Publications',   es: 'Publicaciones Relacionadas' },
  'sotl.visitJournal':       { en: 'Visit Journal',          es: 'Visitar Revista' },
  'sotl.readMore':           { en: 'Read More →',            es: 'Leer más →' },

  // ── Professional Development ──────────────────────────
  'profdev.title':           { en: 'Improving My Teaching Performance', es: 'Mejorando mi Desempeño Docente' },
  'profdev.sub':             { en: 'Since I arrived at the university, I have focused on improving and deepening my understanding of how to teach effectively and create lasting impact. For this reason, I have taken various workshops and courses to continually refine my pedagogical approach.', es: 'Desde que llegué a la universidad, me he enfocado en mejorar y profundizar mi comprensión sobre cómo enseñar de manera efectiva y generar un impacto duradero. Por esta razón, he tomado diversos talleres y cursos para refinar continuamente mi enfoque pedagógico.' },

  // ── Teaching Philosophy ──────────────────────────────
  'philosophy.title':        { en: 'Teaching Philosophy',    es: 'Filosofía de Enseñanza' },
  'philosophy.sub':          { en: 'Co-adaptive Constructivism builds on a constructivist tradition that is no longer in dispute, and adds the recognition that effective teaching demands mutual adaptation. Standards held high, paths to reach them multiplied.', es: 'El Constructivismo Co-adaptativo se apoya en una tradición constructivista que ya no está en disputa, y añade el reconocimiento de que la enseñanza efectiva exige adaptación mutua. Estándares altos, caminos para alcanzarlos multiplicados.' },
  'philosophy.framework':    { en: 'Core Framework: Co-adaptive Constructivism', es: 'Marco Central: Constructivismo Co-adaptativo' },
  'philosophy.equity':       { en: 'Addressing Equity Through Co-adaptation', es: 'Abordando la Equidad Mediante la Co-adaptación' },
  'philosophy.practices':    { en: 'Five Practices',         es: 'Cinco Prácticas' },
  'philosophy.stoic':        { en: 'The Stoic Foundation',   es: 'La Base Estoica' },
  'philosophy.inPractice':   { en: 'Philosophy in Practice', es: 'Filosofía en la Práctica' },
  'philosophy.transformation': { en: 'The Transformation',  es: 'La Transformación' },

  // ── Teaching Purpose ──────────────────────────────────
  'purpose.teaching.title':  { en: 'Fundamentals, Held with Rigor', es: 'Fundamentos, Sostenidos con Rigor' },
  'purpose.teaching.sub':    { en: 'Teaching the fundamentals deeply enough that students can build their own solutions, and evolving alongside each cohort to find out what they can actually do.', es: 'Enseñando los fundamentos con la profundidad suficiente para que los estudiantes construyan sus propias soluciones, y evolucionando junto a cada generación para descubrir lo que realmente pueden lograr.' },
  'purpose.teaching.h2':     { en: 'My Teaching Purpose',    es: 'Mi Propósito Docente' },

  // ── Research Purpose ──────────────────────────────────
  'purpose.research.title':  { en: 'Engineering Biology, Forming People', es: 'Ingeniería Biológica, Formación de Personas' },
  'purpose.research.sub':    { en: 'Research lives in the overlap of two commitments: engineering biological systems to solve real problems in medicine, sustainability, and human experience, and forming the people who will solve the next ones.', es: 'La investigación vive en la intersección de dos compromisos: la ingeniería de sistemas biológicos para resolver problemas reales en medicina, sostenibilidad y experiencia humana, y la formación de las personas que resolverán los próximos.' },
  'purpose.research.h2':     { en: 'My Research Purpose',    es: 'Mi Propósito Investigador' },

  // ── Service Purpose ──────────────────────────────────
  'purpose.service.title':   { en: 'Cultivating the Ecosystem', es: 'Cultivando el Ecosistema' },
  'purpose.service.sub':     { en: 'Cultivating the structures that made my growth possible, and building paths the next generation can use to go further than we did.', es: 'Cultivando las estructuras que hicieron posible mi crecimiento, y construyendo caminos que la próxima generación pueda usar para llegar más lejos de lo que llegamos nosotros.' },
  'purpose.service.h2':      { en: 'My Service Purpose',     es: 'Mi Propósito de Servicio' },

  // ── Service Overview ──────────────────────────────────
  'service.overview.title':  { en: 'Service Overview',       es: 'Visión General de Servicio' },
  'service.overview.sub':    { en: 'Strengthening our academic community and connecting our work with the wider public through leadership, educational innovation, and outreach.', es: 'Fortaleciendo nuestra comunidad académica y conectando nuestro trabajo con el público en general a través del liderazgo, la innovación educativa y la divulgación.' },
  'service.overview.text':   { en: 'Beyond research and teaching, I am deeply committed to service that strengthens our academic community and connects our work with the wider public. My service activities are focused on institutional governance and leadership, upholding the integrity of scientific publishing, driving educational innovation with new technologies, and inspiring future generations through outreach and scouting.', es: 'Más allá de la investigación y la docencia, estoy profundamente comprometido con el servicio que fortalece nuestra comunidad académica y conecta nuestro trabajo con el público en general. Mis actividades de servicio se centran en la gobernanza y el liderazgo institucional, la integridad de la publicación científica, la innovación educativa con nuevas tecnologías, y la inspiración de futuras generaciones a través de la divulgación y el scouting.' },

  // ── Service items ──────────────────────────────────────
  'service.leadership.title': { en: 'Service & Leadership',  es: 'Servicio y Liderazgo' },
  'service.leadership.desc':  { en: 'Shaping academic and scientific direction at national and institutional levels through leadership roles and service on key strategic committees.', es: 'Orientando la dirección académica y científica a nivel nacional e institucional a través de roles de liderazgo y participación en comités estratégicos clave.' },
  'service.ai.title':         { en: 'Augmented Intelligence Initiative', es: 'Iniciativa de Inteligencia Aumentada' },
  'service.ai.desc':          { en: "Co-founding and leading the 'Augmented Intelligence Uniandes' initiative to strategically integrate Generative AI into the engineering curriculum, revolutionizing our pedagogical models.", es: "Co-fundando y liderando la iniciativa 'Inteligencia Aumentada Uniandes' para integrar estratégicamente la IA Generativa en el currículo de ingeniería, revolucionando nuestros modelos pedagógicos." },
  'service.editorial.title':  { en: 'Editorial Contributions', es: 'Contribuciones Editoriales' },
  'service.editorial.desc':   { en: 'Contributing to the global scientific community by upholding the quality and integrity of research through service on the editorial boards of prestigious international journals.', es: 'Contribuyendo a la comunidad científica global manteniendo la calidad e integridad de la investigación a través del servicio en los comités editoriales de revistas internacionales de prestigio.' },
  'service.outreach.title':   { en: 'Outreach & Scouting',   es: 'Divulgación y Scouting' },
  'service.outreach.desc':    { en: 'Engaging with the broader community to promote STEM education, scout and recruit new talent, and inspire the next generation of scientists and engineers through talks, fairs, and hands-on workshops.', es: 'Interactuando con la comunidad en general para promover la educación STEM, identificar y reclutar nuevos talentos, e inspirar a la próxima generación de científicos e ingenieros a través de charlas, ferias y talleres prácticos.' },

  // ── Committees / Leadership ──────────────────────────
  'committees.title':        { en: 'Service & Leadership',   es: 'Servicio y Liderazgo' },
  'committees.sub':          { en: 'I am dedicated to contributing to the academic community and shaping the future of our institution through active service in various leadership roles and committees.', es: 'Estoy comprometido con contribuir a la comunidad académica y moldear el futuro de nuestra institución mediante un servicio activo en diferentes roles de liderazgo y comités.' },
  'committees.leadership':   { en: 'Administrative & Leadership Roles', es: 'Roles Administrativos y de Liderazgo' },
  'committees.committee':    { en: 'Committee Service',      es: 'Servicio en Comités' },
  'committees.national':     { en: 'National Level',         es: 'Nivel Nacional' },
  'committees.university':   { en: 'University Level',       es: 'Nivel Universitario' },
  'committees.faculty':      { en: 'Faculty Level',          es: 'Nivel de Facultad' },
  'committees.department':   { en: 'Department Level',       es: 'Nivel Departamental' },
  'committees.ai.title':     { en: 'Augmented Intelligence Uniandes Initiative', es: 'Iniciativa Inteligencia Aumentada Uniandes' },
  'committees.ai.role':      { en: 'Co-founder (Jun 2024 - Present)', es: 'Cofundador (Jun 2024 - Presente)' },
  'committees.ai.desc':      { en: 'A strategic initiative to transform engineering education with Generative AI. For more details on my role and its impact, visit the dedicated page.', es: 'Una iniciativa estratégica para transformar la educación en ingeniería con IA Generativa. Para más detalles sobre mi rol y su impacto, visita la página dedicada.' },
  'committees.learnMore':    { en: 'Learn More',             es: 'Saber más' },

  // ── Editorial ──────────────────────────────────────────
  'editorial.title':         { en: 'Editorial Contributions', es: 'Contribuciones Editoriales' },
  'editorial.sub':           { en: 'I contribute to the academic publishing community by serving on editorial boards, ensuring the quality and integrity of scientific research.', es: 'Contribuyo a la comunidad editorial académica participando en comités editoriales, garantizando la calidad e integridad de la investigación científica.' },
  'editorial.visitJournal':  { en: 'Visit Journal',          es: 'Visitar Revista' },

  // ── Outreach ──────────────────────────────────────────
  'outreach.title':          { en: 'Outreach & Scouting',    es: 'Divulgación y Scouting' },
  'outreach.sub':            { en: 'I am actively involved in science communication, outreach events, and scouting activities to promote STEM education, disseminate our work, and inspire the next generation of scientists and engineers. These activities are a core part of my commitment to bridging the gap between academia and the community.', es: 'Participo activamente en comunicación científica, eventos de divulgación y actividades de scouting para promover la educación STEM, difundir nuestro trabajo e inspirar a la próxima generación de científicos e ingenieros. Estas actividades son parte fundamental de mi compromiso de tender puentes entre la academia y la comunidad.' },

  // ── Augmented Intelligence ────────────────────────────
  'ai.title':                { en: 'Augmented Intelligence Uniandes', es: 'Inteligencia Aumentada Uniandes' },
  'ai.sub':                  { en: "A pioneering initiative to transform engineering education by strategically integrating Generative AI, co-founded and co-designed to amplify human intelligence.", es: 'Una iniciativa pionera para transformar la educación en ingeniería integrando estratégicamente la IA Generativa, cofundada y codiseñada para amplificar la inteligencia humana.' },
  'ai.transforming':         { en: 'Transforming Engineering Education with AI', es: 'Transformando la Educación en Ingeniería con IA' },
  'ai.myRole':               { en: 'My Role and Contribution', es: 'Mi Rol y Contribución' },
  'ai.leadership':           { en: 'Leadership and Conceptual Design', es: 'Liderazgo y Diseño Conceptual' },
  'ai.management':           { en: 'Management and Implementation', es: 'Gestión e Implementación' },
  'ai.impact':               { en: 'Impact and Results',      es: 'Impacto y Resultados' },
  'ai.impact.projects':      { en: 'projects submitted',      es: 'proyectos presentados' },
  'ai.impact.selected':      { en: 'projects selected',       es: 'proyectos seleccionados' },
  'ai.impact.all':           { en: 'The call achieved participation from', es: 'La convocatoria logró participación de' },
  'ai.impact.all2':          { en: 'all departments of the School.', es: 'todos los departamentos de la Facultad.' },
  'ai.categories':           { en: 'Innovation Categories Developed', es: 'Categorías de Innovación Desarrolladas' },
  'ai.global':               { en: 'Global Recognition',      es: 'Reconocimiento Global' },
  'ai.openai':               { en: "Selected for OpenAI's Global Faculty AI Project", es: 'Seleccionado para el Proyecto Global de IA para Docentes de OpenAI' },
  'ai.recognition.link':     { en: 'See the recognition details →', es: 'Ver los detalles del reconocimiento →' },
  'ai.pedagogical':          { en: 'Pedagogical and Technological Innovation', es: 'Innovación Pedagógica y Tecnológica' },
  'ai.framework':            { en: 'Conceptual Framework: Augmented Intelligence', es: 'Marco Conceptual: Inteligencia Aumentada' },
  'ai.principles':           { en: 'Guiding Principles Implemented', es: 'Principios Rectores Implementados' },
  'ai.implementation':       { en: 'Implementation Process',  es: 'Proceso de Implementación' },
  'ai.projection':           { en: 'Projection and Sustainability', es: 'Proyección y Sostenibilidad' },
  'ai.futureVision':         { en: 'Future Vision',           es: 'Visión de Futuro' },

  // ── Future ──────────────────────────────────────────────
  'future.overview.title':   { en: 'Future Plans',            es: 'Planes a Futuro' },
  'future.overview.sub':     { en: 'Looking ahead to the boundaries of biological engineering, focusing on pioneering research, fostering dynamic collaborations, and mentoring innovators.', es: 'Mirando hacia las fronteras de la ingeniería biológica, con foco en investigación pionera, colaboraciones dinámicas y mentoría de innovadores.' },
  'future.overview.text':    { en: 'My work will continue to push the boundaries of biological engineering. My focus is centered on pioneering new research directions, fostering dynamic collaborations, and mentoring the next generation of scientific innovators to tackle the grand challenges in health and sustainability.', es: 'Mi trabajo seguirá empujando las fronteras de la ingeniería biológica. Mi foco está en pioneer nuevas direcciones de investigación, fomentar colaboraciones dinámicas y mentorizar a la próxima generación de innovadores científicos para abordar los grandes desafíos en salud y sostenibilidad.' },
  'future.pioneering.title': { en: 'Pioneering Research',     es: 'Investigación Pionera' },
  'future.pioneering.desc':  { en: 'Focusing on the convergence of synthetic biology and AI to create intelligent, self-regulating microbial systems for sustainable bioproduction.', es: 'Con foco en la convergencia de biología sintética e IA para crear sistemas microbianos inteligentes y autorregulados para la bioproducción sostenible.' },
  'future.collab.title':     { en: 'Building Collaborations', es: 'Construyendo Colaboraciones' },
  'future.collab.desc':      { en: 'Actively seeking partnerships with academic and industrial leaders to build interdisciplinary teams and accelerate the translation of research into real-world impact.', es: 'Buscando activamente alianzas con líderes académicos e industriales para construir equipos interdisciplinarios y acelerar la traslación de la investigación en impacto real.' },
  'future.mentoring.title':  { en: 'Mentoring Leaders',       es: 'Formando Líderes' },
  'future.mentoring.desc':   { en: 'Committing to the mentorship of a diverse group of students and postdocs, empowering them with the skills to become the next generation of scientific leaders.', es: 'Comprometido con la mentoría de un grupo diverso de estudiantes y postdoctorandos, dotándoles de las habilidades para convertirse en la próxima generación de líderes científicos.' },
  'future.research.title':   { en: 'Future Research Directions', es: 'Direcciones Futuras de Investigación' },
  'future.collaboration.title': { en: 'Collaboration & Mentorship', es: 'Colaboración y Mentoría' },

} as const;

export type UIKey = keyof typeof ui;

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: UIKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'lhr-academic-lang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === 'en' || saved === 'es') return saved;
    // Default to Spanish if the browser is Spanish, else English
    return navigator.language.startsWith('es') ? 'es' : 'en';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const toggle = () => setLangState(l => (l === 'en' ? 'es' : 'en'));
  const t = (key: UIKey) => ui[key][lang];

  return (
    <I18nContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
