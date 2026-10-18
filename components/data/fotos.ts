import type { Localized } from '../../context/i18n';

/** Fotos del portafolio docente, en blanco y negro, en public/images/portafolio/.
 *  Cada una con su texto alternativo en los dos idiomas, para que todas las páginas
 *  la describan igual. Se copiaron reducidas (1600 px de lado largo) y sin metadatos. */
export interface Foto {
  src: string;
  alt: Localized;
}

const f = (ruta: string, en: string, es: string): Foto => ({ src: `/images/portafolio/${ruta}`, alt: { en, es } });

export const fotos = {
  // Reconocimiento
  academiaMedicina: f('premios/2023-academia-nacional-de-medicina.jpg', 'Four people with the National Academy of Medicine of Colombia diploma, 2023', 'Cuatro personas con el diploma de la Academia Nacional de Medicina de Colombia, 2023'),
  angelEscobar: f('premios/2023-alejandro-angel-escobar-mencion.jpg', 'The team with the 2023 honorable mention of Fundación Alejandro Ángel Escobar', 'El equipo con la mención de honor 2023 de la Fundación Alejandro Ángel Escobar'),
  academiaJoven: f('reconocimiento/academia-joven-ingreso.jpg', 'Joining the Academia Joven de Colombia', 'El ingreso a la Academia Joven de Colombia'),
  // Escuela: grados
  gradoCarlos: f('grados/2021-maestria-carlos-ramirez.jpg', 'Carlos Manuel Ramírez Acosta with his master’s diploma, 2021', 'Carlos Manuel Ramírez Acosta con su diploma de maestría, 2021'),
  gradoBrayan: f('grados/2025-doctorado-brayan-rodriguez.jpg', 'Brayan Rodríguez with his Doctor of Engineering diploma, between his two advisors, 2025', 'Brayan Rodríguez con su diploma de Doctor en Ingeniería, entre sus dos directores, 2025'),
  gradoJulian: f('grados/2025-doctorado-julian-becerra.jpg', 'Julián Fernando Becerra-Encinales at his doctoral graduation with his two advisors, 2025', 'Julián Fernando Becerra-Encinales en su grado de doctorado con sus dos directores, 2025'),
  gradoOlga: f('grados/2025-maestria-olga-lucia-acuna.jpg', 'Olga Lucía Acuña at her master’s graduation, 2025', 'Olga Lucía Acuña en su grado de maestría, 2025'),
  // Escuela: el grupo
  palmaJulian: f('escuela/2025-congreso-palma-con-julian-becerra.jpg', 'With Julián Becerra at the 53rd National Congress of Oil Palm Growers, 2025', 'Con Julián Becerra en el 53.º Congreso Nacional de Cultivadores de Palma de Aceite, 2025'),
  camilaJenga: f('escuela/camila-henao-jenga.jpg', 'María Camila Henao in the laboratory office', 'María Camila Henao en la oficina del laboratorio'),
  sables: f('escuela/carlos-sables-de-luz.jpg', 'Carlos and the professor with light sabers', 'Carlos y el profesor con sables de luz'),
  egresadosAiche: f('escuela/egresados-en-aiche.jpg', 'Graduates of the group at an AIChE poster session', 'Egresados del grupo en una sesión de pósteres de AIChE'),
  fabricato: f('escuela/fabricato-canamo-exhibicion.jpg', 'Hemp to fabric, step by step, at Fabricato', 'Del cáñamo a la tela, paso a paso, en Fabricato'),
  gimnasio: f('escuela/gimnasio-con-estudiantes.jpg', 'With two students at the gym', 'Con dos estudiantes en el gimnasio'),
  laboratorio: f('escuela/laboratorio-juan-david-cristian-erika.jpg', 'Erika Díaz, Cristian F. Rodríguez and Juan David Sánchez in the laboratory', 'Erika Díaz, Cristian F. Rodríguez y Juan David Sánchez en el laboratorio'),
  marthaAiche: f('escuela/martha-diaz-aiche.jpg', 'With doctoral student Martha Liliana Díaz at AIChE', 'Con la doctoranda Martha Liliana Díaz en AIChE'),
  medellin: f('escuela/medellin-charla-visita-fabricato.jpg', 'In Medellín, on the visit to Fabricato at the invitation of a graduate', 'En Medellín, en la visita a Fabricato por invitación de una egresada'),
  mentoria: f('escuela/mentoria-enrique-cristian-juan-carlos.jpg', 'A mentoring session with Enrique Lozano, Cristian F. Rodríguez and Juan Carlos Cruz', 'Una sesión de mentoría con Enrique Lozano, Cristian F. Rodríguez y Juan Carlos Cruz'),
  sesionOlga: f('escuela/sesion-olga-lucia-juan-carlos-investigacion.jpg', 'A research session with Olga Lucía Acuña and Juan Carlos Cruz, a microfluidic chip on the table', 'Una sesión de investigación con Olga Lucía Acuña y Juan Carlos Cruz, con un chip microfluídico sobre la mesa'),
  // Docencia
  cervezaGlucanos: f('docencia/cerveza-degradacion-glucanos.jpg', 'Teams at the boards working out the breakdown of beta-glucans, From yeast to beer', 'Equipos en los tableros con la degradación de los beta-glucanos, From yeast to beer'),
  cervezaProteinas: f('docencia/cerveza-degradacion-proteinas.jpg', 'Students writing the conditions for protein breakdown during mashing', 'Estudiantes escriben las condiciones de la degradación de proteínas en la maceración'),
  cursoGrupo: f('docencia/curso-grupo.jpg', 'A Unit Operations Project class, 2026', 'Un grupo de Proyecto de Operaciones Unitarias, 2026'),
  equiposTapabocas: f('docencia/equipos-tapabocas.jpg', 'Teams at work in Systemic Design of Bioproducts', 'Equipos trabajando en Diseño Sistémico de Bioproductos'),
  grabacionMooc: f('docencia/grabacion-mooc.jpg', 'Recording the introduction of the Coursera course on generative AI', 'La grabación de la introducción del curso de Coursera sobre IA generativa'),
  postersPou: f('docencia/posters-pou.jpg', 'Poster session of the Unit Operations Project', 'Sesión de pósteres de Proyecto de Operaciones Unitarias'),
  pouDiagrama: f('docencia/pou-actividad-diagrama-proceso.jpg', 'Students building a process diagram with sticky notes in the Unit Operations Project', 'Estudiantes arman un diagrama de proceso con notas adhesivas en Proyecto de Operaciones Unitarias'),
  pouNpsh: f('docencia/pou-portatiles-taller-npsh.jpg', 'Laptops on the system curve and available NPSH workshop', 'Portátiles en el taller de curva del sistema y NPSH disponible'),
  ptarSalitre: f('docencia/ptar-salitre-visita-estudiantes.jpg', 'With students of the chemical engineering student council at the Salitre wastewater plant', 'Con estudiantes del consejo estudiantil de ingeniería química en la PTAR Salitre'),
  reto2019: f('docencia/reto-2019-casa-luker-bavaria.jpg', 'The first Chemical Engineering Challenge, 2019, with its company challenges on the board', 'El primer Chemical Engineering Challenge, 2019, con los retos de las empresas en el tablero'),
  // Liderazgo y servicio
  chemECar: f('capitulo-aiche/chem-e-car.jpg', 'Students with their Chem-E-Car', 'Estudiantes con su Chem-E-Car'),
  fenomenosTransporte: f('capitulo-aiche/ganadores-fenomenos-de-transporte.jpg', 'Winners of the transport phenomena competition of the AIChE student chapter', 'Ganadores de la competencia de fenómenos de transporte del capítulo estudiantil de AIChE'),
  scoutingPlanta: f('divulgacion/scouting-planta.jpg', 'School students in the pilot plant during a scouting activity', 'Estudiantes de colegio en la planta piloto, en una actividad de captación'),
  scoutingSelfie: f('divulgacion/scouting-selfie.jpg', 'A selfie with school students in the laboratory', 'Una selfi con estudiantes de colegio en el laboratorio'),
  visionarios: f('divulgacion/2026-estreno-visionarios.jpg', 'At the premiere of his Visionarios episode, 2026', 'En el estreno de su episodio de Visionarios, 2026'),
  ecos: f('colaboracion/2025-ecos-innovacion-panel.jpg', 'The entrepreneurship panel he moderated at ECOS, 2025', 'El panel de emprendimiento que moderó en ECOS, 2025'),
  ecofarm: f('colaboracion/ecofarm-visita-consultoria.jpg', 'A plant visit during an industry consultancy', 'Visita a una planta durante una consultoría para la industria'),
  enel: f('colaboracion/visita-enel.jpg', 'Field visit with Enel at the El Paraíso hydroelectric plant', 'Visita de campo con Enel en la Central Hidroeléctrica El Paraíso'),
  // Congresos
  aiche2018: f('congresos/2018-aiche-annual-meeting.jpg', 'The group at the AIChE Annual Meeting, 2018', 'El grupo en el congreso anual de AIChE, 2018'),
  aiche2019: f('congresos/2019-aiche-annual-meeting.jpg', 'At the AIChE Annual Meeting, 2019', 'En el congreso anual de AIChE, 2019'),
  aiche2025: f('congresos/2025-aiche-boston.jpg', 'The group at AIChE, Boston 2025', 'El grupo en AIChE, Boston 2025'),
  acofi: f('congresos/2025-acofi.jpg', 'At the ACOFI engineering education meeting, 2025', 'En el encuentro de educación en ingeniería de ACOFI, 2025'),
  acofiGabriela: f('congresos/2025-acofi-presentacion-gabriela-martha.jpg', 'Gabriela Meléndez presents bacterial growth results at ACOFI, 2025', 'Gabriela Meléndez presenta resultados de crecimiento bacteriano en ACOFI, 2025'),
  acofiPonencia: f('congresos/2025-acofi-ponencia-educacion-aumentada-ia.jpg', 'His talk on AI-augmented engineering education at ACOFI, 2025', 'Su ponencia sobre educación en ingeniería aumentada por IA en ACOFI, 2025'),
  palmaCharla: f('congresos/2025-congreso-palma-charla-ia.jpg', 'His talk on artificial intelligence at the oil palm growers’ congress, 2025', 'Su charla sobre inteligencia artificial en el congreso de palmicultores, 2025'),
  acs2026: f('congresos/2026-acs-fall-chicago.jpg', 'With Gabriela Meléndez at ACS Fall 2026, Chicago', 'Con Gabriela Meléndez en ACS Fall 2026, Chicago'),
  // Trayectoria
  recienLlegado: f('trayectoria/recien-llegado.jpg', 'Newly arrived at Uniandes, with the first students of the group', 'Recién llegado a Uniandes, con los primeros estudiantes del grupo'),
};
