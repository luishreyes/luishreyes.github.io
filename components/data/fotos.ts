import type { Localized } from '../../context/i18n';

/** Fotos del portafolio docente, en blanco y negro, en public/images/portafolio/.
 *  Cada una con su texto alternativo en los dos idiomas, para que todas las páginas
 *  la describan igual. Se copiaron reducidas (1600 px de lado largo) y sin metadatos. */
export interface Foto {
  src: string;
  alt: Localized;
  /** Punto que debe quedar a la vista en cualquier recorte (object-position): casi
   *  siempre la altura de las caras. Lo aplica <FocoFotos /> en todo el sitio. */
  foco: string;
}

const f = (ruta: string, en: string, es: string, foco = '50% 50%'): Foto => ({ src: `/images/portafolio/${ruta}`, alt: { en, es }, foco });

export const fotos = {
  // Reconocimiento
  academiaMedicina: f('premios/2023-academia-nacional-de-medicina.jpg', 'Four people with the National Academy of Medicine of Colombia diploma, 2023', 'Cuatro personas con el diploma de la Academia Nacional de Medicina de Colombia, 2023', '50% 40%'),
  angelEscobar: f('premios/2023-alejandro-angel-escobar-mencion.jpg', 'The team with the 2023 honorable mention of Fundación Alejandro Ángel Escobar', 'El equipo con la mención de honor 2023 de la Fundación Alejandro Ángel Escobar', '50% 35%'),
  academiaJoven: f('reconocimiento/academia-joven-ingreso.jpg', 'Joining the Academia Joven de Colombia', 'El ingreso a la Academia Joven de Colombia', '40% 30%'),
  // Escuela: grados
  gradoCarlos: f('grados/2021-maestria-carlos-ramirez.jpg', 'Carlos Manuel Ramírez Acosta with his master’s diploma, 2021', 'Carlos Manuel Ramírez Acosta con su diploma de maestría, 2021', '50% 30%'),
  gradoBrayan: f('grados/2025-doctorado-brayan-rodriguez.jpg', 'Brayan Rodríguez with his Doctor of Engineering diploma, between his two advisors, 2025', 'Brayan Rodríguez con su diploma de Doctor en Ingeniería, entre sus dos directores, 2025', '50% 25%'),
  gradoJulian: f('grados/2025-doctorado-julian-becerra.jpg', 'Julián Fernando Becerra-Encinales at his doctoral graduation with his two advisors, 2025', 'Julián Fernando Becerra-Encinales en su grado de doctorado con sus dos directores, 2025', '50% 25%'),
  gradoOlga: f('grados/2025-maestria-olga-lucia-acuna.jpg', 'Olga Lucía Acuña at her master’s graduation, 2025', 'Olga Lucía Acuña en su grado de maestría, 2025', '50% 30%'),
  // Escuela: el grupo
  palmaJulian: f('escuela/2025-congreso-palma-con-julian-becerra.jpg', 'With Julián Becerra at the 53rd National Congress of Oil Palm Growers, 2025', 'Con Julián Becerra en el 53.º Congreso Nacional de Cultivadores de Palma de Aceite, 2025', '50% 35%'),
  camilaJenga: f('escuela/camila-henao-jenga.jpg', 'María Camila Henao in the laboratory office', 'María Camila Henao en la oficina del laboratorio', '50% 35%'),
  sables: f('escuela/carlos-sables-de-luz.jpg', 'Carlos and the professor with light sabers', 'Carlos y el profesor con sables de luz', '50% 40%'),
  egresadosAiche: f('escuela/egresados-en-aiche.jpg', 'Graduates of the group at an AIChE poster session', 'Egresados del grupo en una sesión de pósteres de AIChE', '50% 30%'),
  fabricato: f('escuela/fabricato-canamo-exhibicion.jpg', 'Hemp to fabric, step by step, at Fabricato', 'Del cáñamo a la tela, paso a paso, en Fabricato', '45% 45%'),
  gimnasio: f('escuela/gimnasio-con-estudiantes.jpg', 'With two students at the gym', 'Con dos estudiantes en el gimnasio', '40% 40%'),
  laboratorio: f('escuela/laboratorio-juan-david-cristian-erika.jpg', 'Erika Díaz, Cristian F. Rodríguez and Juan David Sánchez in the laboratory', 'Erika Díaz, Cristian F. Rodríguez y Juan David Sánchez en el laboratorio', '40% 35%'),
  marthaAiche: f('escuela/martha-diaz-aiche.jpg', 'With doctoral student Martha Liliana Díaz at AIChE', 'Con la doctoranda Martha Liliana Díaz en AIChE', '60% 45%'),
  medellin: f('escuela/medellin-charla-visita-fabricato.jpg', 'In Medellín, on the visit to Fabricato at the invitation of a graduate', 'En Medellín, en la visita a Fabricato por invitación de una egresada', '50% 60%'),
  mentoria: f('escuela/mentoria-enrique-cristian-juan-carlos.jpg', 'A mentoring session with Enrique Lozano, Cristian F. Rodríguez and Juan Carlos Cruz', 'Una sesión de mentoría con Enrique Lozano, Cristian F. Rodríguez y Juan Carlos Cruz', '50% 40%'),
  sesionOlga: f('escuela/sesion-olga-lucia-juan-carlos-investigacion.jpg', 'A research session with Olga Lucía Acuña and Juan Carlos Cruz, a microfluidic chip on the table', 'Una sesión de investigación con Olga Lucía Acuña y Juan Carlos Cruz, con un chip microfluídico sobre la mesa', '50% 45%'),
  // Docencia
  cervezaGlucanos: f('docencia/cerveza-degradacion-glucanos.jpg', 'Teams at the boards working out the breakdown of beta-glucans, From yeast to beer', 'Equipos en los tableros con la degradación de los beta-glucanos, From yeast to beer', '50% 55%'),
  cervezaProteinas: f('docencia/cerveza-degradacion-proteinas.jpg', 'Students writing the conditions for protein breakdown during mashing', 'Estudiantes escriben las condiciones de la degradación de proteínas en la maceración', '45% 40%'),
  wil: f('docencia/alison-reedy-maria-lucia-guerrero-wil.jpg', 'Alison Reedy and María Lucía Guerrero while we worked on the paper on work-integrated learning', 'Alison Reedy y María Lucía Guerrero, cuando trabajábamos en el artículo sobre aprendizaje integrado al trabajo', '45% 28%'),
  cervezaBavaria: f('docencia/cerveza-invitado-bavaria.jpg', 'A guest from Bavaria speaks to the class in From yeast to beer', 'Un invitado de Bavaria habla en clase, en From yeast to beer', '60% 45%'),
  cervezaCierre: f('docencia/cerveza-cierre-bar-corona.jpg', 'The closing of From yeast to beer at the Corona bar, with students of the course', 'El cierre de From yeast to beer en el bar Corona, con estudiantes del curso', '50% 30%'),
  cursoGrupo: f('docencia/curso-grupo.jpg', 'A Unit Operations Project class, 2026', 'Un grupo de Proyecto de Operaciones Unitarias, 2026', '50% 55%'),
  equiposTapabocas: f('docencia/equipos-tapabocas.jpg', 'Teams at work in Systemic Design of Bioproducts', 'Equipos trabajando en Diseño Sistémico de Bioproductos', '50% 70%'),
  grabacionMooc: f('docencia/grabacion-mooc.jpg', 'Recording the introduction of the Coursera course on generative AI', 'La grabación de la introducción del curso de Coursera sobre IA generativa', '55% 12%'),
  postersPou: f('docencia/posters-pou.jpg', 'Poster session of the Unit Operations Project', 'Sesión de pósteres de Proyecto de Operaciones Unitarias', '50% 40%'),
  pouDiagrama: f('docencia/pou-actividad-diagrama-proceso.jpg', 'Students building a process diagram with sticky notes in the Unit Operations Project', 'Estudiantes arman un diagrama de proceso con notas adhesivas en Proyecto de Operaciones Unitarias', '35% 35%'),
  pouNpsh: f('docencia/pou-portatiles-taller-npsh.jpg', 'Laptops on the system curve and available NPSH workshop', 'Portátiles en el taller de curva del sistema y NPSH disponible', '60% 60%'),
  pouRetro: f('docencia/pou-retroalimentacion.jpg', 'A feedback session with a team in the Unit Operations Project', 'Una sesión de retroalimentación con un equipo de Proyecto de Operaciones Unitarias', '25% 45%'),
  ptarSalitre: f('docencia/ptar-salitre-visita-estudiantes.jpg', 'With students of the chemical engineering student council at the Salitre wastewater plant', 'Con estudiantes del consejo estudiantil de ingeniería química en la PTAR Salitre', '50% 30%'),
  reto2019: f('docencia/reto-2019-casa-luker-bavaria.jpg', 'The first Chemical Engineering Challenge, 2019, with its company challenges on the board', 'El primer Chemical Engineering Challenge, 2019, con los retos de las empresas en el tablero', '50% 70%'),
  // Liderazgo y servicio
  chemECar: f('capitulo-aiche/chem-e-car.jpg', 'Students with their Chem-E-Car', 'Estudiantes con su Chem-E-Car', '50% 30%'),
  fenomenosTransporte: f('capitulo-aiche/ganadores-fenomenos-de-transporte.jpg', 'Winners of the transport phenomena competition of the AIChE student chapter', 'Ganadores de la competencia de fenómenos de transporte del capítulo estudiantil de AIChE', '50% 25%'),
  scoutingPlanta: f('divulgacion/scouting-planta.jpg', 'School students in the pilot plant during a scouting activity', 'Estudiantes de colegio en la planta piloto, en una actividad de captación', '50% 40%'),
  scoutingSelfie: f('divulgacion/scouting-selfie.jpg', 'A selfie with school students in the laboratory', 'Una selfi con estudiantes de colegio en el laboratorio', '55% 50%'),
  scoutingFeria: f('divulgacion/scouting-bogota-bio.jpg', 'At the Department of Chemical and Food Engineering stand, scouting at a Bogotá Bio event at the Bogotá Chamber of Commerce', 'En el puesto del Departamento de Ingeniería Química y de Alimentos, en una actividad de captación durante un evento de Bogotá Bio en la Cámara de Comercio de Bogotá', '50% 12%'),
  visionarios: f('divulgacion/2026-estreno-visionarios.jpg', 'At the premiere of his Visionarios episode, 2026', 'En el estreno de su episodio de Visionarios, 2026', '50% 30%'),
  ecos: f('colaboracion/2025-ecos-innovacion-panel.jpg', 'The entrepreneurship panel he moderated at ECOS, 2025', 'El panel de emprendimiento que moderó en ECOS, 2025', '55% 45%'),
  ecofarm: f('colaboracion/ecofarm-visita-consultoria.jpg', 'A plant visit during an industry consultancy', 'Visita a una planta durante una consultoría para la industria', '45% 45%'),
  enel: f('colaboracion/visita-enel.jpg', 'Field visit with Enel at the El Paraíso hydroelectric plant', 'Visita de campo con Enel en la Central Hidroeléctrica El Paraíso', '50% 25%'),
  // Congresos
  aiche2018: f('congresos/2018-aiche-annual-meeting.jpg', 'The group at the AIChE Annual Meeting, 2018', 'El grupo en el congreso anual de AIChE, 2018', '50% 45%'),
  aiche2019: f('congresos/2019-aiche-annual-meeting.jpg', 'At the AIChE Annual Meeting, 2019', 'En el congreso anual de AIChE, 2019', '45% 45%'),
  aiche2025: f('congresos/2025-aiche-boston.jpg', 'The group at AIChE, Boston 2025', 'El grupo en AIChE, Boston 2025', '45% 40%'),
  boom: f('congresos/boom-estudiantes.jpg', 'Students of the group at the Bogotá Microbial Meeting (BOOM)', 'Estudiantes del grupo en el Bogotá Microbial Meeting (BOOM)', '50% 35%'),
  acofi: f('congresos/2025-acofi.jpg', 'At the ACOFI engineering education meeting, 2025: Gabriela Meléndez Plata, Martha Lizeth Castellanos Ordóñez, Luis H. Reyes, Juan Carlos Cruz and Natalia Paola Esmeral Lascano', 'En el encuentro de educación en ingeniería de ACOFI, 2025: Gabriela Meléndez Plata, Martha Lizeth Castellanos Ordóñez, Luis H. Reyes, Juan Carlos Cruz y Natalia Paola Esmeral Lascano', '50% 30%'),
  acofiGabriela: f('congresos/2025-acofi-presentacion-gabriela-martha.jpg', 'Gabriela Meléndez presents bacterial growth results at ACOFI, 2025', 'Gabriela Meléndez presenta resultados de crecimiento bacteriano en ACOFI, 2025', '20% 50%'),
  acofiPonencia: f('congresos/2025-acofi-ponencia-educacion-aumentada-ia.jpg', 'His talk on AI-augmented engineering education at ACOFI, 2025', 'Su ponencia sobre educación en ingeniería aumentada por IA en ACOFI, 2025', '40% 45%'),
  palmaCharla: f('congresos/2025-congreso-palma-charla-ia.jpg', 'His talk on artificial intelligence at the oil palm growers’ congress, 2025', 'Su charla sobre inteligencia artificial en el congreso de palmicultores, 2025', '30% 50%'),
  santoTomas: f('congresos/charla-santo-tomas-ingenieria-biologica.jpg', 'His invited talk on biological engineering at Universidad Santo Tomás', 'Su charla por invitación sobre ingeniería biológica en la Universidad Santo Tomás', '48% 62%'),
  acs2026: f('congresos/2026-acs-fall-chicago.jpg', 'With Gabriela Meléndez at ACS Fall 2026, Chicago', 'Con Gabriela Meléndez en ACS Fall 2026, Chicago', '65% 45%'),
  // Trayectoria
  kaospilot: f('trayectoria/2019-kaospilot.jpg', 'The group of the KAOSPilot course The Art and Craft of Facilitating Learning Spaces, 2019', 'El grupo del curso de KAOSPilot El Arte y Oficio de Facilitar Espacios de Aprendizaje, 2019', '50% 40%'),
  disenoCursos: f('trayectoria/2019-modulo-diseno-integrado-de-cursos.jpg', 'The group that completed the Teacher Training Module: Integrated Course Design, taught by Eduardo Escallón Largacha, Dean of the School of Education, 2019', 'El grupo que terminó el Módulo de Formación Docente: Diseño Integrado de Cursos, dictado por Eduardo Escallón Largacha, decano de la Facultad de Educación, 2019', '50% 35%'),
  recienLlegado: f('trayectoria/recien-llegado.jpg', 'Newly arrived at Uniandes, with the first students of the group', 'Recién llegado a Uniandes, con los primeros estudiantes del grupo', '50% 30%'),
  // Aperturas de capítulo: fotos del profesor, una por capítulo (índice de la portada y encabezado de cada uno)
  portadaContexto: f('portadas/contexto.jpg', 'A stone wall with tall buildings behind it; a person walks along the top', 'Un muro de piedra con edificios altos detrás; una persona camina sobre él', '0% 50%'),
  portadaTrayectoria: f('portadas/trayectoria.jpg', 'A concrete spiral staircase; a student walks down beside it', 'Una escalera en espiral de concreto; una estudiante baja a su lado', '62% 50%'),
  portadaDocencia: f('portadas/docencia.jpg', 'An empty classroom with desks and tall windows', 'Un salón vacío, con pupitres y ventanales', '60% 50%'),
  portadaFormacion: f('portadas/formacion.jpg', 'A building atrium seen from below, with its floors and skylight', 'El atrio de un edificio visto desde abajo, con sus pisos y el tragaluz', '50% 50%'),
  portadaEscuela: f('portadas/escuela.jpg', 'Stairs and walkways of a building, with students going up and down', 'Escaleras y pasillos de un edificio, con estudiantes que suben y bajan', '55% 50%'),
  portadaInvestigacion: f('portadas/investigacion.jpg', 'Two studio lights against a black background', 'Dos lámparas de estudio sobre un fondo negro', '50% 45%'),
  portadaServicio: f('portadas/servicio.jpg', 'Students in a courtyard under a tree', 'Estudiantes en un patio, bajo un árbol', '30% 50%'),
  portadaReconocimiento: f('portadas/reconocimiento.jpg', 'A dark corridor opening onto a terrace where people sit', 'Un pasillo oscuro que da a una terraza donde hay gente sentada', '50% 50%'),
  portadaLoQueSigue: f('portadas/lo-que-sigue.jpg', 'A person crosses a brick floor, seen from above', 'Una persona cruza un piso de ladrillo, vista desde arriba', '60% 50%'),
};

/** Todas las fotos, para recorrerlas. */
export const todasLasFotos: Foto[] = Object.values(fotos);
