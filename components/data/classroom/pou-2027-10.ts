import type { Course, Presentation, Reading } from '../classroom';
import { pou202620Course } from './pou-2026-20';

// ── POU · semestre 2027-10 ──────────────────────────────────────
// Proyecto del semestre: planta de aceite esencial de cáscara de cítricos.
// Reemplaza al proyecto de pectina de 2026-20, donde la destilación solo
// recuperaba el solvente. Aquí la destilación hace el producto dos veces:
// el arrastre de vapor lo extrae y la rectificación al vacío lo especifica.
//
// SOLO EQUIPO DOCENTE. La tarjeta aparece en el índice del aula, pero la reja
// (`staffOnlyAccess`) tiene una sola puerta, la de profesor. Es una vista
// previa mientras se arma el semestre.
//
// PENDIENTE antes de abrirlo a estudiantes:
//   · `presentations` y casi todo `readings` todavía son los de pectina,
//     heredados de 2026-20. Ya son propios de 2027-10: el reto, los módulos
//     y el material de las semanas 1 a 3, más la Lectura 12 (filtración y
//     winterización), que reemplaza a la Lectura 09 de pectina.
//   · El equipo docente ya está (21 nov 2026): Andrés F. Infante sigue de
//     asistente y Eduardo Perea Castillo es el monitor. Las fechas
//     ya siguen el calendario académico de 2027-10 (clases del 25 de enero al
//     22 de mayo, receso del 22 al 27 de marzo): el `cronograma` lo escribe
//     scripts/pou-2027-10-cronograma.mjs, que también llena la tabla de sesiones
//     del programa y el cronograma interactivo.
//   · Evaluación rediseñada (21 nov 2026): quices con LockDown Browser, tres
//     exámenes en papel (individuales y después en pareja), tres laboratorios
//     y cinco talleres dentro de la sesión. Lo que da Fenómenos de Transporte
//     Macroscópicos (Bernoulli, LMTD, NTU, McCabe-Thiele) no se enseña de nuevo.
//   · Falta el banner propio del semestre: mientras tanto usa el de 2026-20.
// Material ya reescrito para aceite esencial: vive en /classroom/iqya-2031-2027-10/.
// Cada semana que se migra suma aquí sus ids y slugs.
const PRESENTACIONES_PROPIAS = new Set([
  'presentacion-del-curso', 'trabajo-en-equipo',
  'diagramas-ingenieria', 'pid-instrumentacion',
  'propiedades-solidos-particulados', 'reduccion-de-tamano',
  'arrastre-de-vapor', 'bombas', 'valvulas-control-vacio',
  'agitacion-y-mezclado', 'condensacion-y-decantacion', 'refrigeracion',
]);
const LECTURAS_PROPIAS = new Set([
  'lectura-01-operaciones-unitarias',
  'lectura-02-diagramas-ingenieria', 'taller-01-analisis-de-pfd',
  'lectura-03-reduccion-tamano', 'taller-02-analisis-granulometrico',
  // Material permanente
  'programa-del-curso', 'cronograma-interactivo', 'bitacoras-de-calculo', 'informe-final',
  'trabajo-en-equipo', 'contrato-de-equipo', 'busqueda-bibliografica',
]);

// Resúmenes de lecturas y talleres que cambiaron de caso para aceite esencial.
const RESUMENES: Record<string, string> = {
  'programa-del-curso':
    'El programa completo de IQYA-2031 para 2027-10: horarios y equipo, descripción y metodología (PO-PBL y aula invertida), el reto de la planta de aceite esencial, resultados ABET, los ocho módulos, el programa clase por clase, la distribución de la nota, cómo funcionan quices, exámenes, talleres y laboratorios, las fechas clave, la escala AIAS de uso de IA y las políticas del curso.',
  'cronograma-interactivo':
    'El calendario de 2027-10, semana por semana. Arriba, qué sigue: el próximo quiz, taller, laboratorio, examen y entrega, con cuenta regresiva. Abajo, las 16 semanas con quices, talleres, laboratorios, exámenes, entregas de bitácora, coevaluaciones y retroalimentaciones. Se filtra por tipo y resalta la semana actual.',
  'bitacoras-de-calculo':
    'Qué va en cada una de las cuatro bitácoras de la planta de aceite esencial y cómo se califican: materia prima y diagrama de bloques; PFD, bombas, válvulas y agitación; arrastre de vapor con los datos del piloto y del Laboratorio 1, condensación, winterización y servicios; y la rectificación por lotes al vacío con el costo de la planta. Con la estructura de una bitácora, el formato, el manejo de fuentes, los errores comunes y las fechas de entrega.',
  'busqueda-bibliografica':
    'Once plataformas para encontrar, leer y sintetizar literatura científica: Google Scholar, Web of Science y Scopus, y ocho herramientas de IA (ChatGPT, Gemini, Gemini Notebook, Claude, Perplexity, SciSpace, Consensus y Connected Papers) con sus modelos y planes de noviembre de 2026. Trae estrategias de búsqueda con el caso del arrastre de vapor, un flujo de trabajo para el proyecto y la escala AIAS del curso: en las entregas se puede buscar y leer fuentes con IA, declarándolo.',
  'taller-01-analisis-de-pfd':
    'Se hace en papel, en la sesión del jueves 4 de febrero, en parejas que asigna el profesor. Cada pareja recibe su propio plano de una planta de ron a partir de melaza, con quince errores de dibujo y de ingeniería, y la hoja de consulta con las reglas de la Lectura 02. La pareja describe la planta con su PBD, sigue el azúcar hasta el etanol, encuentra y corrige los errores, analiza el sistema de la columna y dibuja el fermentador como en un P&ID; al final, cada uno responde solo un boleto de salida sobre el plano. La página trae un plano de práctica con su visor.',
  'taller-02-analisis-granulometrico':
    'Se resuelve en un cuaderno de Google Colab dentro de la sesión del jueves 11 de febrero, en parejas que asigna el profesor, y cada pareja trabaja con sus propios datos, que salen del número que recibe al comenzar. En la Parte A juzga una arena para el lecho de un filtro rápido contra tres criterios de la planta; en la Parte B compara un molino de martillos y uno de rodillos para el maíz de un alimento balanceado, donde ninguno gana en todo. El cuaderno trae la teoría, las funciones y un ejemplo resuelto con harina de trigo, y se sube a Bloque Neón antes de salir. Al final, cada uno responde solo un boleto de salida en papel.',
};

// Lecturas reescritas para 2027-10: su tiempo real de lectura y la fecha de la revisión.
const REVISADAS: Record<string, { readingMinutes: number; date: string; tags?: string[] }> = {
  'busqueda-bibliografica': { readingMinutes: 35, date: '2026-11-21' },
  'taller-01-analisis-de-pfd': {
    readingMinutes: 15, date: '2026-11-21',
    tags: ['PFD', 'P&ID', 'errores de dibujo', 'Turton', 'ISA-5.1', 'taller en papel'],
  },
  'taller-02-analisis-granulometrico': {
    readingMinutes: 10, date: '2026-11-22',
    tags: ['tamizado', 'distribución de tamaño', 'D80', 'molienda', 'Colab', 'datos por pareja'],
  },
};

// Guías de lectura de 2027-10 (decisión del profesor, 22 nov 2026): la lectura de cada
// semana son secciones del libro en libro.luishreyes.com, que pide usuario y clave; nada
// del libro va a este sitio. Las guías ocupan las entradas de las lecturas de cada
// semana; las lecturas largas de antes quedan en sus carpetas, sin entrada en el Material.
const GUIA = '/classroom/iqya-2031-2027-10/lecturas/Guias/';
const GUIAS_LECTURA: Record<string, Partial<Reading>> = {
  'lectura-01-operaciones-unitarias': {
    title: 'Guía de lectura · Semana 1: las operaciones unitarias',
    summary:
      'Qué leer del capítulo 1 del libro (secciones 1.1, 1.3, 1.4 y 1.5): qué es una operación unitaria, cómo se clasifica, qué diferencia aprovecha cada separación y la planta de aceite esencial como secuencia de operaciones. Con las preguntas de la semana y lo que pasa en clase. El quiz de práctica del jueves sale de ahí.',
    date: '2026-11-22', readingMinutes: 45,
    tags: ['guía de lectura', 'libro', 'operaciones unitarias', 'clasificación', 'aceite esencial'],
    href: GUIA + 'Guia_Semana_01.html',
  },
  'lectura-02-diagramas-ingenieria': {
    title: 'Guía de lectura · Semana 2: los diagramas de ingeniería',
    summary:
      'Qué leer del capítulo 2 del libro (secciones 2.2 a 2.5): los tres diagramas de una planta, el diagrama de bloques, el PFD con sus códigos, corrientes, servicios, lazos y alivios, y el P&ID con la etiqueta de cada instrumento. Con las preguntas de la semana. De ahí salen el Quiz 1 y lo que pide el Taller 1.',
    date: '2026-11-22', readingMinutes: 60,
    tags: ['guía de lectura', 'libro', 'PBD', 'PFD', 'P&ID', 'ISA-5.1', 'Turton'],
    href: GUIA + 'Guia_Semana_02.html',
  },
  'lectura-03-reduccion-tamano': {
    title: 'Guía de lectura · Semana 3: sólidos particulados',
    summary:
      'Qué leer de los capítulos 5, 6 y 7 del libro: la distribución de tamaños y sus modelos, el análisis por tamizado paso a paso, las máquinas de reducción de tamaño y cómo se trata la cáscara húmeda. Con las preguntas de la semana. De ahí salen el Quiz 2 y lo que pide el Taller 2.',
    date: '2026-11-22', readingMinutes: 55,
    tags: ['guía de lectura', 'libro', 'distribución de tamaños', 'tamizado', 'molienda', 'cáscara'],
    href: GUIA + 'Guia_Semana_03.html',
  },
  'lectura-05-bombas': {
    week: 6, order: 5,
    title: 'Guía de lectura · Semana 6: bombas',
    summary:
      'Qué leer del capítulo 11 del libro: las familias de bombas por dentro, la carta del fabricante y dónde debe trabajar una bomba, las leyes de afinidad y lo que cuesta cada manera de regular, el arreglo en serie y en paralelo, los líquidos viscosos, las de desplazamiento positivo con su válvula de alivio y la selección con su hoja de datos. Con las preguntas de la semana. De ahí sale el Quiz 4.',
    date: '2026-11-22', readingMinutes: 60,
    tags: ['guía de lectura', 'libro', 'bombas', 'curvas características', 'leyes de afinidad', 'desplazamiento positivo', 'hoja de datos'],
    href: GUIA + 'Guia_Semana_06_Bombas.html',
  },
  'lectura-06-agitacion': {
    week: 7, order: 7,
    title: 'Guía de lectura · Semana 7: agitación y escalado',
    summary:
      'Qué leer de los capítulos 14 y 15 del libro: el tanque y sus bafles, los impulsores y cuál escoger, el número de potencia, el caudal que bombea un impulsor y los remolinos más pequeños, los sólidos en suspensión, el tamaño de las gotas y las reglas para escalar un tanque agitado. Con las preguntas de la semana. De ahí sale el Quiz 6, y es la base del Laboratorio 2.',
    date: '2026-11-22', readingMinutes: 65,
    tags: ['guía de lectura', 'libro', 'agitación', 'impulsores', 'número de potencia', 'gotas', 'escalado'],
    href: GUIA + 'Guia_Semana_07.html',
  },
};

// Lecturas de pectina que no tienen lugar en 2027-10: el mezclado y el escalado
// (Lectura 07) entran en la guía de la semana 7, con el capítulo 15 del libro.
// Lo demás que sale lo decidió el profesor el 22 nov 2026: el equilibrio, el
// flash y McCabe-Thiele los da Fenómenos de Transporte Macroscópicos; los
// intercambiadores no tienen sesión propia (de ellos se queda el explorador, en
// la semana 9, para el condensador), y los talleres de pectina dan paso a los
// cinco de 2027-10.
const LECTURAS_RETIRADAS = new Set([
  'lectura-07-mezclado',
  'lectura-08-intercambiadores-de-calor', 'lectura-10-equilibrio-de-fases',
  'lectura-11-destilacion-flash', 'lectura-13-destilacion-continua',
  'taller-03-seleccion-de-bombas', 'taller-04-suspension-de-solidos',
  'taller-05-intercambiador-tubo-coraza', 'taller-06-filtracion-de-levadura',
  'taller-07-rachford-rice', 'taller-08-rayleigh', 'taller-09-mccabe-thiele',
]);
const PRESENTACIONES_RETIRADAS = new Set([
  'intercambiadores-i', 'intercambiadores-ii',
  'equilibrio-de-fases', 'destilacion-flash', 'destilacion-continua',
  // La de agitación y mezclado de 2027-10 junta en una las dos de pectina.
  'mezclado-de-fluidos',
]);
// El Explorador del ecofiltro es una actividad de flujo de fluidos. Siguen en
// la página pública de estrategias de docencia, que junta los de todos los
// semestres.
const SIMULADORES_RETIRADOS = new Set([
  'explorador-bernoulli', 'explorador-equilibrio-flash', 'explorador-ecofiltro',
]);
// La semana de 2027-10 de lo heredado que se queda, según su cronograma.
const SEMANA_2027: Record<string, number> = {
  filtracion: 10,
  'destilacion-diferencial': 13, 'diseno-de-platos': 15,
  'eficiencias-en-destilacion': 15, 'comunicacion-visual': 16,
  'explorador-intercambiadores': 9,
  'explorador-filtracion': 10, 'explorador-mccabe-thiele': 13,
  'explorador-destilacion-lotes': 13, 'explorador-torre-de-platos': 15,
  'explorador-graficos': 16,
  'lectura-12-destilacion-por-lotes': 13, 'lectura-14-comunicacion-visual': 16,
};
// La sesión de 2027-10 de las presentaciones heredadas, para que el Material las ordene
// con las nuevas (la de filtración, el jueves 8 de abril, es la sesión 20).
const SESION_2027: Record<string, number> = {
  filtracion: 20, 'destilacion-diferencial': 25, 'diseno-de-platos': 29, 'eficiencias-en-destilacion': 29,
};

// Descripciones que en 2026-20 hablaban de la planta de pectina.
const DESCRIPCIONES: Record<string, string> = {
  'presentacion-del-curso':
    'La sesión inaugural completa: bienvenida y la planta de aceite esencial, equipo docente, objetivos y resultados ABET, las ocho estaciones del proceso, metodología, módulos y ritmo del semestre, evaluación, uso de IA y expectativas.',
  'diagramas-ingenieria':
    'El diagrama de bloques y el PFD, con la planta de benceno del capítulo 2 del libro y sus figuras: los tres diagramas, los símbolos de la ISO 10628-2, los códigos de los equipos, las corrientes, la tabla de corrientes y sus tres comprobaciones, el balance con cierre de ±1 %, los servicios, los lazos de control, las plantas por lotes, las reglas del dibujo y el PFD de su planta en las bitácoras.',
  'pid-instrumentacion':
    'El P&ID del separador de alta V-102 de la planta de benceno, con las figuras y las animaciones del capítulo 2 del libro: la identificación de las líneas y su clase, la etiqueta de un instrumento y las letras de la ISA-5.1, globos, válvulas y líneas, un lazo del PFD al P&ID, la presión de ajuste de la PSV, un estudio de riesgos, los típicos, la lista de revisión y lo que agrega una planta de alimentos. Con el recuadro interactivo para leer los códigos del plano.',
  'propiedades-solidos-particulados':
    'Cómo se describe un sólido de millones de granos, con la caliza molida del capítulo 5 del libro y sus figuras: los diámetros equivalentes y la esfericidad, la difracción láser, el ensayo con la tamizadora de golpeteo y cuándo vale, la curva acumulada y sus tres modelos, el área que ponen los finos, las tres densidades, los índices de Carr y de Hausner, la explosividad de los polvos y el muestreo con el divisor de rifles. Con siete animaciones de los capítulos 5 y 6.',
  'reduccion-de-tamano':
    'Cómo se rompe un sólido y cuánta energía pide, con la planta de carbonato del capítulo 7 del libro y sus figuras: los mecanismos de rotura, las leyes de Rittinger, Kick y Bond con el índice de trabajo, las tres etapas, las máquinas por dentro, el molino de bolas, el circuito cerrado, el hierro y el calor que deja el molino, el corte de los alimentos, la pimienta y el calor, los fibrosos y la cáscara de naranja húmeda. Con seis animaciones del capítulo.',
  'arrastre-de-vapor':
    'Por qué el aceite de la cáscara sale con el vapor por debajo de 100 °C y por qué sale tan despacio, con el área 200 del capítulo 32 del libro y sus figuras: las tres formas del arrastre, el Clevenger del laboratorio, el equilibrio de dos líquidos inmiscibles y de un aceite de varios componentes, la hidrodifusión y la brecha con el equilibrio, los dos modelos de rendimiento y su ajuste, los criterios de corte del lote, el extractor por dentro, el escalado, el tiempo muerto, la batería de cuatro extractores, su P&ID y el balance del área. Con cuatro animaciones del capítulo.',
  'bombas':
    'Cómo se escoge una bomba, con la línea de agua de servicios del capítulo 11 del libro y sus figuras: las dos familias y lo que fija cada una, las ocho por dentro, la centrífuga y sus impulsores, la velocidad específica, la carta del fabricante y la ventana de operación, el punto de operación, la válvula, el variador y el recorte con las leyes de afinidad y lo que cuesta cada manera, la serie y el paralelo con sus riesgos, la corrección por viscosidad, la válvula de alivio, las reciprocantes y las rotatorias, y la selección con su hoja de datos. Con diez animaciones del capítulo.',
  'valvulas-control-vacio':
    'Qué válvula sirve para cada servicio y cómo se dimensiona la válvula de control de una línea con bomba, con la línea de agua del capítulo 13 del libro y la columna de rectificación del 12: las válvulas manuales por dentro y cuánto pierde cada una, la retención, la válvula de control con su posición de falla, el Cv, las características inherente e instalada y la cavitación; la válvula del caso con su carrera, su ganancia y su instalación, y los sistemas de vacío, con la carga de aire y limoneno y la elección para la columna. Con cinco animaciones y los cortes que se mueven de los capítulos.',
  'agitacion-y-mezclado':
    'Cómo se arma un tanque agitado y cómo se escala, con el reactor de extracción de los capítulos 14 y 15 del libro y sus figuras: las proporciones, los bafles y la altura que mueve cada impulsor, los siete impulsores en corte y en isométrico, el número de potencia, el motor, el caudal que bombea un impulsor y la escala de Kolmogorov, la suspensión de lo que se hunde y el arrastre de lo que flota, el tamaño de las gotas, el tiempo de mezcla y las reglas de escalado, con diez animaciones de los dos capítulos; cierra con el tanque de lavado de la Bitácora 2 y el Laboratorio 2.',
  'condensacion-y-decantacion':
    'Cómo condensa el vapor que sale de los extractores y cómo se separa el aceite del agua, con el tren de condensación de los capítulos 23 y 17 del libro y sus figuras: la película de condensado, los gases incondensables y el venteo, las disposiciones de un condensador, sus corazas, sus deflectores y el subenfriamiento, la curva de condensación del vapor con aceite, el rocío y la meseta, el agua de torre, E-201 por dentro y por zonas; después el florentino, con la regla del área, la gota de diseño, sus comprobaciones, la pierna del agua, el venteo y la seguridad, las gotas que no se juntan, los coalescedores, el hidrolato y el florentino en corte. Con siete animaciones de los dos capítulos.',
  'refrigeracion':
    'Cómo un refrigerante que hierve a baja presión enfría el aceite de la winterización, con el enfriador empacado de propano del capítulo 26 del libro y sus figuras: el frío en una planta de alimentos y la planta de frío de la juguera, los cuatro equipos del ciclo de compresión de vapor, el efecto refrigerante, la potencia y el COP, el ciclo en el diagrama presión-entalpía, la carga del lote y el ciclo del enfriador, el COP contra las dos temperaturas y el ciclo real; después los refrigerantes, con su clase de seguridad, su límite de concentración en Bogotá, su PCG y las reglas de cada país, el condensador en Bogotá con el evaporativo E-401 en isométrico, y los refrigerantes secundarios: el agua cerca de 0 °C, el propilenglicol y la diferencia de cada equipo. Con dos animaciones del capítulo; cierra con lo que pide la Bitácora 3.',
  'trabajo-en-equipo':
    'La sesión del quiz de práctica: qué distingue a un equipo que funciona, cuánto pesa el equipo en la nota, cómo la coevaluación convierte la nota del equipo en una nota individual para cada integrante, con un ejemplo que se mueve en vivo, y las ocho secciones del contrato que cada equipo firma en clase y sube a Bloque Neón.',
};

const REEMPLAZOS: Record<string, Presentation> = {
  'flujo-de-fluidos': {
    id: 'arrastre-de-vapor',
    week: 4,
    title: 'Arrastre de vapor',
    description: DESCRIPCIONES['arrastre-de-vapor'],
    sessionNumber: 7,
    file: 'Arrastre_de_Vapor/Presentacion_Arrastre_de_Vapor.html',
  },
  agitacion: {
    id: 'agitacion-y-mezclado',
    week: 7,
    title: 'Agitación y mezclado',
    description: DESCRIPCIONES['agitacion-y-mezclado'],
    sessionNumber: 13,
    file: 'Agitacion_y_Mezclado/Presentacion_Agitacion_y_Mezclado.html',
  },
  'bombas-centrifugas': {
    id: 'bombas',
    week: 6,
    title: 'Bombas',
    description: DESCRIPCIONES['bombas'],
    sessionNumber: 11,
    file: 'Bombas/Presentacion_Bombas.html',
  },
};

export const pou202710Course: Course = {
  ...pou202620Course,

  slug: 'iqya-2031-2027-10',
  term: '2027-10',
  // La tarjeta SÍ aparece en el índice del aula: el profesor necesita poder
  // entrar al curso desde ahí. Lo que restringe el acceso es la reja, no
  // esconder el curso.
  //
  // Solo entra el equipo docente: la reja muestra una sola puerta y pide
  // el código del equipo docente (`staffAccessHash`), el mismo del semestre
  // anterior. Un estudiante que
  // llegue a la tarjeta ve que el semestre se está armando y no pasa.
  staffOnlyAccess: true,
  identidad: 'uniandes',
  duration: '16 semanas y la de finales, con los pósters',

  // El horario de 2026-20 decía «BloqueNeón» y «Magistral»: en 2027-10 son clases.
  schedule: [
    { label: 'Clase', detail: 'Martes 11:00 a.m. a 12:20 p.m. · Salón según Bloque Neón' },
    { label: 'Clase', detail: 'Jueves 11:00 a.m. a 12:20 p.m. · Salón según Bloque Neón' },
  ],

  team: [
    pou202620Course.team[0],
    pou202620Course.team[1],
    { name: 'Eduardo Perea Castillo', role: 'Monitor', email: 'e.pereac@uniandes.edu.co' },
  ],

  // Los mismos objetivos del programa de 2027-10.
  objectives: [
    'Diseñar y dimensionar las operaciones unitarias de un proceso químico completo, que abarca el manejo de sólidos, el transporte de fluidos y la separación final por destilación.',
    'Elaborar e interpretar diagramas de ingeniería profesionales (PBD, PFD y P&ID) según estándares industriales.',
    'Calcular y especificar equipos de proceso con criterios técnicos, económicos y de sostenibilidad, a partir de catálogos y hojas de datos.',
    'Medir en el laboratorio los datos que pide el diseño y juzgar cuánto valen.',
    'Simular procesos completos en ASPEN Plus y validar con ellos los cálculos manuales.',
    'Documentar el diseño en bitácoras de cálculo profesionales y reportes ejecutivos.',
    'Trabajar en equipo, gestionando el tiempo y los recursos con eficacia.',
    'Aplicar pensamiento crítico al elegir alternativas de diseño y resolver problemas.',
    'Comunicar resultados técnicos a audiencias distintas mediante informes y presentaciones.',
  ],

  abet: {
    ...pou202620Course.abet,
    outcomes: pou202620Course.abet.outcomes.map((o, i) =>
      i === 0
        ? {
            ...o,
            indicators: o.indicators.map((ind) =>
              ind.startsWith('1.1.1')
                ? '1.1.1 Define el problema de diseño de la planta de aceite esencial, con sus dos destilaciones: el arrastre de vapor y la rectificación al vacío.'
                : ind,
            ),
          }
        : o,
    ),
  },

  // Ocho módulos. El 4, el 6 y parte del 8 cambiaron para no repetir lo que
  // da Fenómenos de Transporte Macroscópicos el mismo semestre.
  modules: [
    {
      title: 'Módulo 1 · Diagramas',
      topics: [
        'Introducción al proyecto y formación de equipos.',
        'Materia prima y alcance del proyecto.',
        'Diagramas de ingeniería: PBD, PFD y P&ID. El entregable es el PFD completo; el P&ID se practica en el Taller 1.',
        'Simbología: Turton e ISO 10628 para los equipos, ANSI/ISA-5.1 para los instrumentos.',
      ],
    },
    {
      title: 'Módulo 2 · Manejo de sólidos',
      topics: [
        'Caracterización y propiedades de sólidos.',
        'Distribución de tamaños de partícula.',
        'Teoría y equipos de reducción de tamaño.',
        'Desgarrado de la cáscara húmeda y potencia del molino de cuchillas.',
      ],
    },
    {
      title: 'Módulo 3 · Arrastre de vapor',
      topics: [
        'Equilibrio de líquidos inmiscibles.',
        'Relación de vapor e hidrodifusión del aceite en la cáscara.',
        'Diseño del extractor.',
        'Laboratorio 1: arrastre de vapor en Clevenger.',
      ],
    },
    {
      title: 'Módulo 4 · Bombas, válvulas y control',
      topics: [
        'Tipos y mecanismos de bombas: centrífugas y de desplazamiento positivo.',
        'Selección en catálogo, leyes de afinidad, bombas en serie y en paralelo, corrección por viscosidad.',
        'Válvulas según el servicio; válvula de control (Cv, característica y autoridad).',
        'Estrategia de control y sistemas de vacío para la columna.',
      ],
    },
    {
      title: 'Módulo 5 · Agitación',
      topics: [
        'Impulsores y número de potencia.',
        'Suspensión de sólidos y dispersión de gotas.',
        'Criterios de escalado del tanque de lavado y del tanque de enfriamiento.',
        'Laboratorio 2: tamaño de gota de una emulsión contra la velocidad de agitación.',
      ],
    },
    {
      title: 'Módulo 6 · Calor en la planta',
      topics: [
        'El condensador del arrastre: condensación con gases no condensables.',
        'Refrigeración por compresión de vapor: el enfriado de la winterización.',
        'Servicios de planta: vapor, trampas y agua de enfriamiento.',
        'Integración energética del proceso.',
      ],
    },
    {
      title: 'Módulo 7 · Separaciones mecánicas',
      topics: [
        'Decantación de aceite y agua en el florentino.',
        'Filtración con torta y resistencia del medio filtrante.',
        'Winterización: el enfriado y el filtro de profundidad del aceite.',
      ],
    },
    {
      title: 'Módulo 8 · Destilación del producto',
      topics: [
        'Destilación por lotes y políticas de reflujo.',
        'Vacío, efecto de la presión y azeótropos.',
        'Platos y empaques: inundación, diámetro, caída de presión y HETP.',
        'Laboratorio 3: destilación por lotes en modo de olla y en modo de reflujo.',
      ],
    },
  ],

  evaluation: [
    { component: 'Quices', percentage: 10, description: 'Individual · Trece, al empezar la clase, con LockDown Browser.' },
    { component: 'Exámenes', percentage: 25, description: 'Individual, con etapa en pareja · Tres, en papel y con calculadora.' },
    { component: 'Laboratorios', percentage: 15, description: 'Equipo, con prelaboratorio y pregunta oral individuales · Tres prácticas con memorando.' },
    { component: 'Talleres en clase', percentage: 10, description: 'Parejas, con boleto de salida individual · Cinco, dentro de la sesión.' },
    { component: 'Bitácoras de cálculo', percentage: 15, description: 'Grupos · 4 entregas durante el semestre.' },
    { component: 'Sustentaciones de seguimiento', percentage: 10, description: 'Grupos · 4 durante el semestre.' },
    { component: 'Proyecto final', percentage: 10, description: 'Grupos · Documento técnico.' },
    { component: 'Póster', percentage: 5, description: 'Grupos · Sesión de pósters en la semana de finales.' },
  ],

  aias: {
    ...pou202620Course.aias!,
    levels: [
      { level: 1, title: 'Sin IA', description: 'No se permite uso de IA.', application: 'Quices, exámenes, prelaboratorios y talleres en papel.' },
      { level: 2, title: 'IA para ideas', description: 'IA para generar ideas y estructurar.', application: 'Taller 2, en Colab.' },
      { level: 3, title: 'IA para edición', description: 'IA para refinar y mejorar claridad.', application: 'Memorandos de laboratorio, bitácoras, proyecto final y póster.' },
      { level: 4, title: 'IA con evaluación', description: 'IA para tareas con evaluación crítica.', application: 'No aplica en este curso.' },
      { level: 5, title: 'Uso completo', description: 'IA integral a discreción.', application: 'No aplica en este curso.' },
    ],
  },

  deliveries: {
    bitacoras: [
      { label: 'Entrega 1', date: 'Domingo 14 de febrero' },
      { label: 'Entrega 2', date: 'Domingo 14 de marzo' },
      { label: 'Entrega 3', date: 'Domingo 18 de abril' },
      { label: 'Entrega 4', date: 'Domingo 16 de mayo' },
    ],
    coevaluations: [
      { label: 'Coevaluación 1', date: 'Lunes 15 de febrero' },
      { label: 'Coevaluación 2', date: 'Lunes 15 de marzo' },
      { label: 'Coevaluación 3', date: 'Lunes 19 de abril' },
      { label: 'Coevaluación 4', date: 'Lunes 17 de mayo' },
      { label: 'Coevaluación 5', date: 'Semana de finales · documento y pósters' },
    ],
    feedback: [
      { label: 'Retroalimentación 1', date: 'Jueves 18 de febrero' },
      { label: 'Retroalimentación 2', date: 'Martes 30 de marzo' },
      { label: 'Retroalimentación 3', date: 'Jueves 22 de abril' },
      { label: 'Retroalimentación 4', date: 'Jueves 20 de mayo' },
    ],
  },

  // CRONOGRAMA_START
  // Escrito por scripts/pou-2027-10-cronograma.mjs: no editar a mano.
  cronograma: [
    { date: '2027-01-26', day: 'Martes', week: 1, topic: 'Presentación del curso', details: ['El reto: la planta de aceite esencial', 'Metodología, evaluación y uso de IA'], proyecto: 'Publicación del reto del semestre' },
    { date: '2027-01-28', day: 'Jueves', week: 1, topic: 'Equipos, coevaluación y contrato', details: ['Quiz de práctica con LockDown Browser, sin nota'] },
    { date: '2027-02-02', day: 'Martes', week: 2, topic: 'Diagramas de ingeniería: PBD, PFD y P&ID', details: ['Simbología de equipos e instrumentos', 'Codificación de equipos y corrientes'], quiz: 'Quiz 1' },
    { date: '2027-02-04', day: 'Jueves', week: 2, topic: 'Taller 1: análisis de un PFD con errores', details: ['Un plano distinto por pareja'], taller: 'Taller 1' },
    { date: '2027-02-09', day: 'Martes', week: 3, topic: 'Sólidos: caracterización, granulometría y reducción de tamaño', details: ['Distribuciones de tamaño', 'Desgarrado de la cáscara húmeda'], quiz: 'Quiz 2' },
    { date: '2027-02-11', day: 'Jueves', week: 3, topic: 'Taller 2: análisis granulométrico', details: ['En Colab, con datos por pareja'], taller: 'Taller 2', proyecto: 'Bitácora 1: domingo 14 de febrero · Coevaluación: lunes 15 de febrero' },
    { date: '2027-02-16', day: 'Martes', week: 4, topic: 'Arrastre de vapor', details: ['Equilibrio de líquidos inmiscibles', 'Relación de vapor e hidrodifusión', 'Diseño del extractor'], quiz: 'Quiz 3' },
    { date: '2027-02-18', day: 'Jueves', week: 4, topic: 'Retroalimentación 1', details: ['Sustentación de la Bitácora 1 por equipos'] },
    { date: '2027-02-23', day: 'Martes', week: 5, topic: 'Laboratorio 1: arrastre de vapor', details: ['Primera mitad de los equipos', 'Clevenger con cáscara de naranja'], laboratorio: 'Laboratorio 1' },
    { date: '2027-02-25', day: 'Jueves', week: 5, topic: 'Laboratorio 1: arrastre de vapor', details: ['Segunda mitad de los equipos', 'Clevenger con cáscara de naranja'], laboratorio: 'Laboratorio 1' },
    { date: '2027-03-02', day: 'Martes', week: 6, topic: 'Bombas: tipos, mecanismos y selección', details: ['Centrífugas y de desplazamiento positivo', 'Leyes de afinidad, serie y paralelo', 'Corrección por viscosidad'], quiz: 'Quiz 4' },
    { date: '2027-03-04', day: 'Jueves', week: 6, topic: 'Válvulas, control y vacío', details: ['Válvulas según el servicio', 'Válvula de control: Cv, característica y autoridad', 'Sistemas de vacío para la columna'], quiz: 'Quiz 5', proyecto: 'Memorando del Laboratorio 1: domingo 7 de marzo' },
    { date: '2027-03-09', day: 'Martes', week: 7, topic: 'Agitación y escalado', details: ['Impulsores y número de potencia', 'Suspensión y dispersión de gotas', 'Criterios de escalado'], quiz: 'Quiz 6' },
    { date: '2027-03-11', day: 'Jueves', week: 7, topic: 'Laboratorio 2: agitación y emulsión', details: ['Todos los equipos', 'Tamaño de gota en el Mastersizer'], laboratorio: 'Laboratorio 2', proyecto: 'Bitácora 2: domingo 14 de marzo · Coevaluación: lunes 15 de marzo' },
    { date: '2027-03-16', day: 'Martes', week: 8, topic: 'Taller 3: hoja de datos de una bomba y su válvula de control', details: ['Con catálogos impresos'], taller: 'Taller 3' },
    { date: '2027-03-18', day: 'Jueves', week: 8, topic: 'Examen 1: arrastre de vapor, bombas, válvulas, control y vacío', details: ['En papel: primero individual y después en pareja'], examen: 'Examen 1', proyecto: 'Memorando del Laboratorio 2: domingo 21 de marzo' },
    { date: '2027-03-30', day: 'Martes', week: 9, topic: 'Retroalimentación 2', details: ['Sustentación de la Bitácora 2 por equipos'] },
    { date: '2027-04-01', day: 'Jueves', week: 9, topic: 'Condensación y decantación', details: ['El condensador del arrastre', 'Gases no condensables y venteo', 'El decantador florentino'], quiz: 'Quiz 7' },
    { date: '2027-04-06', day: 'Martes', week: 10, topic: 'Refrigeración', details: ['Ciclo de compresión de vapor', 'El enfriado de la winterización'], quiz: 'Quiz 8' },
    { date: '2027-04-08', day: 'Jueves', week: 10, topic: 'Filtración y winterización', details: ['Ley de Darcy, torta y medio filtrante', 'Filtración de profundidad'], quiz: 'Quiz 9' },
    { date: '2027-04-13', day: 'Martes', week: 11, topic: 'Taller 4: el filtro de la winterización y el florentino', details: ['Con datos por pareja'], taller: 'Taller 4' },
    { date: '2027-04-15', day: 'Jueves', week: 11, topic: 'Servicios de planta e integración energética', details: ['Vapor, trampas y agua de enfriamiento', 'Recuperación de calor'], quiz: 'Quiz 10', proyecto: 'Bitácora 3: domingo 18 de abril · Coevaluación: lunes 19 de abril' },
    { date: '2027-04-20', day: 'Martes', week: 12, topic: 'Examen 2: condensación, refrigeración, separaciones mecánicas y servicios', details: ['En papel: primero individual y después en pareja'], examen: 'Examen 2' },
    { date: '2027-04-22', day: 'Jueves', week: 12, topic: 'Retroalimentación 3', details: ['Sustentación de la Bitácora 3 por equipos'] },
    { date: '2027-04-27', day: 'Martes', week: 13, topic: 'Destilación por lotes', details: ['Ecuación de Rayleigh', 'Políticas de reflujo'], quiz: 'Quiz 11' },
    { date: '2027-04-29', day: 'Jueves', week: 13, topic: 'Laboratorio 3: destilación por lotes', details: ['Primera mitad de los equipos', 'Air Still Pro en modo de olla y en modo de reflujo'], laboratorio: 'Laboratorio 3' },
    { date: '2027-05-04', day: 'Martes', week: 14, topic: 'Laboratorio 3: destilación por lotes', details: ['Segunda mitad de los equipos', 'Air Still Pro en modo de olla y en modo de reflujo'], laboratorio: 'Laboratorio 3' },
    { date: '2027-05-06', day: 'Jueves', week: 14, topic: 'Vacío y azeótropos', details: ['Efecto de la presión', 'Azeótropos y destilación especial'], quiz: 'Quiz 12', proyecto: 'Memorando del Laboratorio 3: domingo 9 de mayo' },
    { date: '2027-05-11', day: 'Martes', week: 15, topic: 'Platos y empaques', details: ['Inundación y diámetro', 'Caída de presión', 'HETP'], quiz: 'Quiz 13' },
    { date: '2027-05-13', day: 'Jueves', week: 15, topic: 'Taller 5: ¿platos o empaque para la columna al vacío?', details: ['Con la carta de Fair'], taller: 'Taller 5', proyecto: 'Bitácora 4: domingo 16 de mayo · Coevaluación: lunes 17 de mayo' },
    { date: '2027-05-18', day: 'Martes', week: 16, topic: 'Examen 3: destilación por lotes, vacío y azeótropos, platos y empaques', details: ['En papel: primero individual y después en pareja'], examen: 'Examen 3' },
    { date: '2027-05-20', day: 'Jueves', week: 16, topic: 'Retroalimentación 4', details: ['Sustentación de la Bitácora 4 por equipos'] },
    { date: '2027-05-25', day: 'Martes', week: 17, topic: 'Sesión de pósters', details: ['Semana de finales: fecha y salón según la programación de finales'], proyecto: 'Documento final y póster · Coevaluación 5' },
  ],
  // CRONOGRAMA_END

  // Con el nuevo formato, exámenes y talleres se cierran en la sesión, los
  // laboratorios tienen reglas propias y la demora se penaliza en memorandos
  // y documento final.
  policies: [
    ...pou202620Course.policies.map((p) => ({
      ...p,
      items: p.items.map((it) =>
        it.startsWith('Correo del curso:')
          ? 'Correo del curso: lh.reyes@uniandes.edu.co, af.infante@uniandes.edu.co, e.pereac@uniandes.edu.co.'
          : it.startsWith('La asistencia a las sesiones magistrales')
          ? 'La asistencia a las clases es obligatoria (control diario).'
          : it.startsWith('Talleres y documento final')
          ? 'Memorandos de laboratorio y documento final: -1 unidad por cada 15 minutos de demora.'
          : it.replace('BloqueNeón', 'Bloque Neón'),
      ),
    })),
    {
      category: 'Exámenes y talleres',
      items: [
        'Se entregan al final de la sesión, sin prórroga.',
        'Exámenes en papel, con calculadora científica no programable; sin computador, celular ni apuntes.',
        'La ausencia a un examen se maneja según el Reglamento General de Estudiantes de Pregrado.',
      ],
    },
    {
      category: 'Laboratorios',
      items: [
        'Sin prelaboratorio no se entra a la práctica.',
        'En el laboratorio se usan bata, gafas y zapato cerrado.',
        'El memorando parte de la hoja de datos firmada por el asistente; sin ella no se califica.',
      ],
    },
  ],

  community: pou202620Course.community.map((c) => ({
    ...c,
    items: c.items.map((it) =>
      it.startsWith('La fecha límite para retirarse')
        ? 'La fecha límite para retirarse del curso es la semana 11 (12 al 16 de abril), la misma semana del semestre que en 2026-20.'
        : it === 'Informa al profesor en las primeras dos semanas.'
        ? 'Informe al profesor en las primeras dos semanas.'
        : it,
    ),
  })),

  tagline:
    'Diseñe una planta de aceite esencial a partir de cáscara de cítricos',
  description:
    'En este curso diseñará, dimensionará y simulará una planta de aceite esencial de grado alimentario a partir de cáscara de cítricos, el residuo que deja una juguera. Bajo el enfoque de Diseño Integrado de Productos y Procesos, cada operación unitaria llega la semana en que su equipo la necesita para cerrar un balance: manejo de sólidos, transporte de fluidos, agitación, intercambio de calor, filtración y, sobre todo, destilación, que aquí no recupera un solvente sino que hace el producto. El arrastre de vapor lo extrae de la cáscara y la rectificación al vacío decide su calidad. El modelo es híbrido: aula invertida con lecturas previas, quices al iniciar clase, talleres en pareja dentro de la sesión, tres laboratorios, tres exámenes en papel y trabajo autónomo en equipos de 4-5 personas a lo largo de las 16 semanas.',

  // Naranjas Ambersweet (Keith Weller, USDA ARS, dominio público), en blanco y negro.
  bannerUrl: '/classroom/iqya-2031-2027-10/banner.jpg',

  challenges: {
    label: 'Hervir a 97 lo que hierve a 176',
    term: '2027-10',
    eyebrow: 'Reto del semestre',
    description:
      'Diseñe y dimensione una planta que extrae aceite esencial de la cáscara que deja una juguera. Abra la guía completa del proyecto.',
    href: '/classroom/iqya-2031-2027-10/reto-aceite-esencial.html',
  },

  project: {
    ...pou202620Course.project!,
    title: 'Planta de aceite esencial de cáscara de cítricos',
    overview:
      'Diseño integral de una planta que toma la cáscara que deja una juguera, con 70 a 75 % de humedad y entre 0,5 y 3 % de aceite esencial en base húmeda, y la lleva hasta aceite rectificado. El proceso físico tiene siete pasos: lavado y acondicionamiento, desgarrado a 5 a 10 mm, arrastre de vapor, condensación, decantador florentino, winterización a 5 a 10 °C y rectificación al vacío entre 10 y 20 mbar. La decisión que se toma en el desgarrado reaparece en el rendimiento del arrastre, y la pureza que se le exija a la columna es una decisión económica, no un número dado.',
    rawMaterials: [
      { name: 'Cáscara de lima Tahití', outcome: 'Residuo de exportación colombiano · aceite destilado de grado comercial' },
      { name: 'Cáscara de naranja Valencia', outcome: 'Mayor volumen disponible · aceite con 90 a 95 % de limoneno' },
      { name: 'Cáscara de mandarina', outcome: 'Perfil de oxigenados distinto · afecta el corte de la columna' },
      { name: 'Cáscara de toronja', outcome: 'Menor rendimiento, mayor valor por nota aromática' },
    ],
    // Formato «Etapa · Operación»: el landing de 2027-10 lo parte en dos.
    scope: [
      'Selección y caracterización de la materia prima · Materia prima',
      'Diagramas del proceso: el PFD completo · Diagramas',
      'Lavado, acondicionamiento y desgarrado · Sólidos y agitación',
      'Arrastre de vapor: el extractor · Destilación',
      'Transporte de fluidos y servicios · Fluidos',
      'Condensación y decantador florentino · Calor y decantación',
      'Winterización: enfriado y filtrado del aceite · Separaciones mecánicas',
      'Rectificación al vacío: la columna que hace el producto · Destilación',
    ],
  },

  // Presentaciones y simuladores se heredan apuntando a la carpeta de 2026-20,
  // donde están sus archivos: el sitio arma su ruta con el slug del curso, y
  // copiar `slides/` duplicaría 240 MB. Al actualizar una pieza para 2027-10 y
  // publicarla en la carpeta propia, se le quita `carpeta`.
  // Las que 2027-10 cambia por una nueva: la semana 4 de 2026-20 era flujo de
  // fluidos, que ahora da Fenómenos de Transporte Macroscópicos, y en 2027-10 la
  // sesión 7 es el arrastre de vapor; las bombas pasan de la semana 5 a la 6.
  presentations: pou202620Course.presentations
    .filter((p) => !PRESENTACIONES_RETIRADAS.has(p.id))
    .map((p) =>
      REEMPLAZOS[p.id]
        ? REEMPLAZOS[p.id]
        : PRESENTACIONES_PROPIAS.has(p.id)
        ? { ...p, description: DESCRIPCIONES[p.id] ?? p.description }
        : { ...p, carpeta: 'iqya-2031-2026-20', week: SEMANA_2027[p.id] ?? p.week,
            sessionNumber: SESION_2027[p.id] ?? p.sessionNumber },
    )
    // La clase de válvulas, control y vacío no tenía presentación en 2026-20.
    .concat([
      {
        id: 'valvulas-control-vacio',
        week: 6,
        title: 'Válvulas, control y vacío',
        description: DESCRIPCIONES['valvulas-control-vacio'],
        sessionNumber: 12,
        file: 'Valvulas_Control_Vacio/Presentacion_Valvulas_Control_Vacio.html',
      },
      // La de condensación y decantación ocupa el lugar de las dos de intercambiadores de 2026-20.
      {
        id: 'condensacion-y-decantacion',
        week: 9,
        title: 'Condensación y decantación',
        description: DESCRIPCIONES['condensacion-y-decantacion'],
        sessionNumber: 18,
        file: 'Condensacion_y_Decantacion/Presentacion_Condensacion_y_Decantacion.html',
      },
      // La clase de refrigeración no tenía presentación en 2026-20.
      {
        id: 'refrigeracion',
        week: 10,
        title: 'Refrigeración',
        description: DESCRIPCIONES['refrigeracion'],
        sessionNumber: 19,
        file: 'Refrigeracion/Presentacion_Refrigeracion.html',
      },
    ]),
  // Los simuladores se sirven desde 2026-20, salvo los que ya tienen versión
  // 2027-10. El de molienda trae la cáscara húmeda y el molino de cuchillas;
  // el Manual de diagramas es el mismo, con sus ejemplos de pectina pasados a
  // la unidad HDS o al proyecto de cada equipo.
  simulations: (pou202620Course.simulations ?? []).filter((sim) => !SIMULADORES_RETIRADOS.has(sim.id)).map((sim) =>
    sim.id === 'manual-diagramas'
      ? sim
      : sim.id === 'explorador-molienda'
      ? {
          ...sim,
          description:
            'Seleccione un equipo de reducción de tamaño y véalo operar, con su animación de física de partículas. Arranca con la cáscara cítrica húmeda de la planta de aceite esencial en un molino de cuchillas: el rotor corta contra las cuchillas fijas de la carcasa y la criba fija el tamaño. Esa cáscara no tiene índice de Bond, así que su energía se fija por consumo específico, entre 5 y 20 kWh/t, y se pasa a sólido seco con su agua; si la pone en un molino de impacto o de compresión, el simulador la marca inviable. Con los demás materiales (caliza, carbón, maíz, azúcar, arcilla y cáscara seca) calcula la energía con la Ley de Bond y los factores de Rowland, compara Bond, Kick y Rittinger, lleva la energía hasta el motor estándar IEC y resuelve el balance térmico. La granulometría usa Rosin-Rammler con tamizado ASTM E11 o Tyler y una tamizadora animada.',
        }
      : sim.id === 'explorador-agitacion'
      ? {
          // La versión de 2027-10, con el tanque de lavado y el modelo del libro, en la semana de agitación.
          ...sim,
          week: 7,
          sessionNumber: 13,
          bannerImg: '/classroom/iqya-2031-2027-10/simuladores-banners/explorador-agitacion.jpg',
          description:
            'Mire el tanque por dentro: una vista lateral en perspectiva y una vista en planta donde cientos de partículas siguen la circulación que se calcula para cada geometría (el chorro radial de la Rushton que se parte en dos lazos, el lazo único de la turbina de palas inclinadas, la cinta que sube por la pared), con el giro alrededor del eje, la turbulencia y el vórtice cuando faltan los bafles. Arranca con el tanque de lavado de la planta de aceite esencial, con números supuestos, donde la cáscara flota: súbale la velocidad hasta la que pide Joosten para hundirla y mire lo que cuesta. Inyecte un trazador y vea cómo se mezcla mientras tres sondas miden t₉₅, comparado con Grenville como en el capítulo 15 del libro. Escoja entre seis impulsores, la geometría, la velocidad y el fluido, y agregue sólidos que se hunden (Zwietering) o que flotan (Joosten), gotas de una emulsión o gas por un anillo distribuidor. Todo sale de las correlaciones de los capítulos 14 y 15 del libro: las curvas Nₚ-Re con y sin bafles, la potencia y el motor con la altitud, la potencia por volumen, t₉₅ contra N, la velocidad que pide el sólido según su densidad, el tamaño de las gotas, el mapa de régimen del gas con kLa, el escalado según lo que haya que conservar con lo que le pasa a todo lo demás y el calentamiento con vapor por la camisa. En su pestaña de configuraciones trae también el vaso del Laboratorio 2 con sus dos impulsores, el reactor y la marmita de papilla de los capítulos 14 y 15 y ejemplos propios.',
        }
      : sim.id === 'explorador-intercambiadores'
      ? {
          // La versión de 2027-10, sin la pectina y con el condensador del arrastre del capítulo 23, en la semana de condensación.
          ...sim,
          week: 9,
          sessionNumber: 18,
          bannerImg: '/classroom/iqya-2031-2027-10/simuladores-banners/explorador-intercambiadores.jpg',
          description:
            'Abre en el condensador del arrastre del capítulo 23 del libro: E-201 y E-202 de la planta de aceite esencial, con el vapor que llega del extractor, el agua de torre y el agua de servicios. El modelo es el del libro y reproduce su ejemplo: la curva de condensación con el agua de IAPWS-95 y el limoneno, el rocío y la meseta, las dos zonas de E-201 con su ΔTml, la película de gravedad y Boyko y Kruzhilin dentro de los tubos, el condensado que sigue bajando por la pared o el charco como cota baja, Bell-Delaware y Kern en la coraza, Silver, Bell y Ghaly, la caída de presión del vapor y la pierna hasta el florentino, E-202 por ε-NTU con los tres pares de tubos del libro y el venteo por la ley de Dalton, con el limoneno en el espacio de cabeza del florentino. Cambie el vapor, el aceite, el sitio, el agua de torre, los tubos y su largo, el subenfriador y su agua: las salidas las da el equipo instalado, y lo que pide el proceso va aparte, con el diseño del capítulo 23 para los mismos tubos. El corte de E-201 muestra cuánto tubo ocupa cada zona y qué pasa cuando no alcanza a condensar: el aceite es lo primero que se va por el venteo. Trae también los otros cuatro equipos (tubos y coraza, placas, doble tubo y aeroenfriador) con sus figuras en isométrico.',
          tags: ['condensador', 'E-201', 'E-202', 'arrastre de vapor', 'curva de condensación', 'incondensables', 'venteo', 'ΔTml por zonas', 'Bell-Delaware', 'ε-NTU', 'tubos y coraza', 'placas', 'doble tubo', 'aeroenfriador'],
        }
      : sim.id === 'explorador-bombas-centrifugas'
      ? {
          // La versión de 2027-10, sin la pectina, en la semana de bombas.
          ...sim,
          week: 6,
          sessionNumber: 11,
          description: sim.description.replace('o el extracto de pectina del proyecto', 'o un extracto acuoso caliente'),
        }
      : { ...sim, carpeta: 'iqya-2031-2026-20', week: SEMANA_2027[sim.id] ?? sim.week },
  ),

  // La metodología es la misma; solo cambia de qué planta se habla.
  methodology: {
    ...pou202620Course.methodology,
    summary:
      'Aprendizaje orientado a proyectos y basado en problemas (PO-PBL), con aula invertida. Durante todo el semestre su equipo diseña una planta real: la que saca aceite esencial de la cáscara de cítricos que deja una juguera. El proyecto le da contexto a cada tema, y cada tema llega la semana en que su equipo lo va a usar.',
    phases: pou202620Course.methodology.phases.map((f) => ({
      ...f,
      items: f.items.map((it) =>
        it === 'Aplicación de los conceptos al diseño de la planta de pectina.'
          ? 'Aplicación de los conceptos al diseño de la planta de aceite esencial.'
          : it === 'Taller en parejas con problemas reales.'
          ? 'Taller en pareja dentro de la sesión, laboratorio o examen en papel.'
          : it,
      ),
    })),
  },

  // Salvo lo que nombran PRESENTACIONES_PROPIAS y LECTURAS_PROPIAS, el material
  // todavía es el de pectina: se hereda del semestre anterior y los enlaces apuntan a /classroom/iqya-2031-2026-20/, donde los
  // archivos ya están. No se duplican 302 MB en el repositorio para una vista
  // previa. A medida que se escriba el material de aceite esencial, cada
  // entrada se copia a /classroom/iqya-2031-2027-10/ y se le cambia el enlace.
  //
  // OJO: mientras tanto, esos documentos son los MISMOS del curso vivo.
  // Editarlos desde aquí cambia lo que ven los estudiantes de 2026-20.
  readings: [
    {
      slug: 'pagina-del-curso',
      title: 'Página del curso',
      summary:
        'Qué se diseña este semestre, el tren de proceso de la planta de aceite esencial, cómo se trabaja en clase y cómo se califica.',
      date: '2026-10-17',
      category: 'guia',
      href: '/classroom/iqya-2031-2027-10/pagina.html',
    },
    ...pou202620Course.readings.filter((r) => !LECTURAS_RETIRADAS.has(r.slug)).map((r) =>
      GUIAS_LECTURA[r.slug]
        ? { ...r, ...GUIAS_LECTURA[r.slug] }
        : r.slug === 'lectura-04-transporte-liquidos'
        ? {
            // La semana 4 de 2027-10 es el arrastre de vapor: la guía remite al capítulo 32
            // del libro (22 nov 2026). La Lectura 04 queda en su carpeta, sin entrada.
            ...r,
            slug: 'lectura-04-arrastre-de-vapor',
            title: 'Guía de lectura · Semana 4: el arrastre de vapor',
            summary:
              'Qué leer del capítulo 32 del libro (secciones 32.1 a 32.4 y parte de la 32.5): las tres formas del arrastre y el Clevenger, el equilibrio de dos líquidos inmiscibles, la hidrodifusión y la brecha con el equilibrio, el rendimiento contra el tiempo y el corte del lote, y el extractor con su tiempo muerto. Con las preguntas de la semana y lo que pasa en clase. El Quiz 3 sale de ahí.',
            date: '2026-11-22',
            readingMinutes: 60,
            tags: ['guía de lectura', 'libro', 'arrastre de vapor', 'líquidos inmiscibles', 'hidrodifusión', 'extractor'],
            href: GUIA + 'Guia_Semana_04.html',
            bannerImg: undefined,
          }
        : LECTURAS_PROPIAS.has(r.slug)
        ? {
            ...r,
            summary: RESUMENES[r.slug] ?? r.summary,
            ...REVISADAS[r.slug],
            href: r.href?.replace('/iqya-2031-2026-20/', '/iqya-2031-2027-10/'),
          }
        : r.slug === 'reto-pectina'
        ? {
            ...r,
            slug: 'reto-aceite-esencial',
            title: 'Guía del reto: hervir a 97 lo que hierve a 176',
            summary:
              'La guía del proyecto semestral: diseñar y dimensionar una planta que extrae aceite esencial de la cáscara de cítricos que deja una juguera. Las ocho etapas a integrar, cómo elegir la materia prima, por qué el extractor pide cincuenta veces más vapor que el equilibrio, qué validar en ASPEN Plus y dónde no confiar, las bitácoras y los memorandos de laboratorio con sus fechas, y la rúbrica.',
            date: '2026-10-17',
            tags: ['proyecto', 'reto', 'aceite esencial', 'guía'],
            href: '/classroom/iqya-2031-2027-10/reto-aceite-esencial.html',
          }
        : r.slug === 'lectura-09-filtracion'
        ? {
            // La filtración de 2027-10 es su propia Lectura 12 (filtración y
            // winterización), no la Lectura 09 de pectina. Conserva el banner
            // de filtración de 2026-20 mientras no haya uno propio.
            ...r,
            slug: 'lectura-12-filtracion-winterizacion',
            order: 12,
            week: 10,
            title: 'Filtración industrial y winterización',
            summary:
              'La barrera porosa que separa sólidos y gotas de un líquido: mecanismos de retención, la ley de Darcy con la resistencia de la torta y la del medio, el ensayo a presión constante, la compresibilidad, los equipos, los medios y las ayudas filtrantes. Después, la filtración de profundidad con cartuchos y placas (retención nominal y absoluta, razón beta, caída de presión limpia, ensayos de capacidad y cambio del medio) y la winterización de la planta: enfriar el aceite del florentino a 5-10 °C y pasarlo por un filtro de profundidad para quitarle el agua y la turbidez. No es un desencerado.',
            date: '2026-10-23',
            readingMinutes: 45,
            tags: ['filtración', 'ley de Darcy', 'torta', 'resistencia del medio', 'filtración de profundidad', 'cartuchos', 'placas filtrantes', 'razón beta', 'winterización', 'aceite esencial'],
            href: '/classroom/iqya-2031-2027-10/lecturas/Lectura_12/Lectura_12_Filtracion.html',
          }
        : SEMANA_2027[r.slug]
        ? { ...r, week: SEMANA_2027[r.slug] }
        : r,
    ),
    {
      // La clase de válvulas, control y vacío no tenía lectura en 2026-20.
      slug: 'guia-semana-06-valvulas',
      week: 6,
      order: 6,
      title: 'Guía de lectura · Semana 6: válvulas, control y vacío',
      summary:
        'Qué leer de los capítulos 13 y 12 del libro: las válvulas manuales y cuánto pierde cada una, la válvula de control por dentro con su coeficiente de flujo, sus características inherente e instalada y la cavitación, la válvula de control del caso y los sistemas de vacío para la columna, con la carga de aire y vapor que tienen que sacar. Con las preguntas de la semana. De ahí sale el Quiz 5.',
      date: '2026-11-22',
      readingMinutes: 65,
      tags: ['guía de lectura', 'libro', 'válvulas', 'válvula de control', 'Cv', 'característica instalada', 'vacío'],
      category: 'lectura',
      href: GUIA + 'Guia_Semana_06_Valvulas.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l04.jpg',
    },
    {
      slug: 'laboratorio-01-arrastre-de-vapor',
      week: 5,
      order: 40,
      title: 'Laboratorio 1: arrastre de vapor en Clevenger',
      summary:
        'La guía de la práctica de los días 23 y 25 de febrero: rendimiento de aceite contra tiempo con dos tamaños de cáscara de naranja, el caudal de vapor medido con el condensado y los gramos de aceite por kilo de vapor, comparados con el equilibrio y con el extractor piloto. Con el montaje, la seguridad, el procedimiento, los cálculos, la hoja de datos para imprimir, la plantilla de Excel y la rúbrica del memorando.',
      date: '2026-11-22',
      readingMinutes: 15,
      tags: ['laboratorio', 'arrastre de vapor', 'Clevenger', 'rendimiento', 'memorando'],
      category: 'guia',
      href: '/classroom/iqya-2031-2027-10/laboratorios/Laboratorio_01/Laboratorio_01_Arrastre_de_Vapor.html',
    },
    {
      slug: 'laboratorio-02-agitacion-y-emulsion',
      week: 7,
      order: 40,
      title: 'Laboratorio 2: agitación y emulsión',
      summary:
        'La guía de la práctica del 11 de marzo: el número de potencia de una turbina Rushton y de una de palas inclinadas, medido con el par del agitador, y el tamaño de gota de una emulsión de aceite mineral en agua con Tween 80 a cuatro velocidades, medido en el Mastersizer y comparado con la ecuación del libro. Con el montaje impreso en 3D, el procedimiento, los cálculos, la hoja de datos para imprimir, la plantilla de Excel y la rúbrica del memorando.',
      date: '2026-11-22',
      readingMinutes: 15,
      tags: ['laboratorio', 'agitación', 'emulsión', 'número de potencia', 'Weber', 'memorando'],
      category: 'guia',
      href: '/classroom/iqya-2031-2027-10/laboratorios/Laboratorio_02/Laboratorio_02_Agitacion_y_Emulsion.html',
    },
    {
      // Nuevo en 2027-10: el Taller 3 de 2026-20 (selección de bombas de pectina) salió.
      slug: 'taller-03-bomba-y-valvula',
      week: 8,
      order: 103,
      title: 'Taller 3 · Hoja de datos de una bomba y su válvula de control',
      summary:
        'Se hace en papel, en la sesión del martes 16 de marzo, en parejas que asigna el profesor. Cada pareja recibe una línea de agua de la planta de aceite esencial, el catálogo impreso de bombas centrífugas y válvulas de control y la hoja de consulta. Arma la curva de la línea, calcula el NPSH disponible, escoge la bomba, el impulsor y el motor, dimensiona la válvula de igual porcentaje, revisa si cavita al caudal mínimo y deja todo en dos hojas de datos. Al final, cada integrante responde un boleto de salida. La página trae el catálogo, la hoja de consulta, las hojas de datos en blanco y un servicio de práctica.',
      date: '2026-11-23',
      readingMinutes: 15,
      tags: ['bombas', 'válvula de control', 'hoja de datos', 'NPSH', 'Cv', 'cavitación', 'catálogo', 'taller en papel'],
      category: 'taller',
      href: '/classroom/iqya-2031-2027-10/talleres/Taller_03/Taller_03_Bomba_y_Valvula.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l05.jpg',
    },
    {
      // La clase de condensación y decantación no tenía lectura propia en 2026-20.
      slug: 'guia-semana-09-condensacion',
      week: 9,
      order: 9,
      title: 'Guía de lectura · Semana 9: condensación y decantación',
      summary:
        'Qué leer de los capítulos 23 y 17 del libro: los gases incondensables y el venteo, las disposiciones de un condensador, el condensador del arrastre con su curva de condensación, su agua de torre y su condensado que baja por gravedad, y el florentino de la planta, con la regla del área, la pierna del agua, las gotas que no se juntan y el hidrolato. Con las preguntas de la semana. De ahí sale el Quiz 7, y es la base del condensador y el florentino de la Bitácora 3.',
      date: '2026-11-23',
      readingMinutes: 70,
      tags: ['guía de lectura', 'libro', 'condensación', 'incondensables', 'venteo', 'florentino', 'hidrolato'],
      category: 'lectura',
      href: GUIA + 'Guia_Semana_09.html',
      bannerImg: '/classroom/iqya-2031-2026-20/lecturas-banners/l08.jpg',
    },
    {
      // La clase de refrigeración no tenía lectura en 2026-20. El banner es el condensador
      // evaporativo del capítulo 26 del libro, una figura propia, sin sus rótulos.
      slug: 'guia-semana-10-refrigeracion',
      week: 10,
      order: 10,
      title: 'Guía de lectura · Semana 10: refrigeración',
      summary:
        'Qué leer del capítulo 26 del libro: el ciclo de compresión de vapor con su efecto refrigerante, su potencia y su COP, el enfriador de la winterización como primer ejemplo, la seguridad y el efecto en el ambiente de cada refrigerante, el condensador en Bogotá y los refrigerantes secundarios. Con las preguntas de la semana. De ahí sale el Quiz 8, y es la base de la refrigeración de la winterización en la Bitácora 3.',
      date: '2026-11-28',
      readingMinutes: 65,
      tags: ['guía de lectura', 'libro', 'refrigeración', 'ciclo de compresión de vapor', 'COP', 'refrigerantes', 'winterización'],
      category: 'lectura',
      href: GUIA + 'Guia_Semana_10_Refrigeracion.html',
      bannerImg: '/classroom/iqya-2031-2027-10/lecturas-banners/refrigeracion.jpg',
    },
  ],
};
