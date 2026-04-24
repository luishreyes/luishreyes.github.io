import type { Course, CronogramaEntry } from '../classroom';

const dpro4300Cronograma: CronogramaEntry[] = [
  {
    date: '2026-03-26',
    day: 'Jueves',
    week: 1,
    topic:
      'Introducción al diseño multiescala · Introducción al diseño molecular basado en computación (CAMD)',
    details: [
      '17:00 – 20:50 · 3h 50min',
      'Edificio Alberto Lleras',
      'Profesores: A. González / L. H. Reyes',
    ],
  },
  {
    date: '2026-03-27',
    day: 'Viernes',
    week: 1,
    topic:
      'Mecánica molecular y campos de fuerza · Interacciones moleculares y optimización geométrica de estructuras',
    details: [
      '08:00 – 12:20 · 4h 20min',
      'Edificio Alberto Lleras',
      'Profesor: A. González',
    ],
  },
  {
    date: '2026-03-27',
    day: 'Viernes',
    week: 1,
    topic:
      'Dinámica molecular · Fuerzas conservativas, métodos de integración, uso de GROMACS',
    details: [
      '14:00 – 15:20 · 1h 20min',
      'Edificio Alberto Lleras',
      'Profesor: A. González',
    ],
  },
  {
    date: '2026-04-23',
    day: 'Jueves',
    week: 5,
    topic:
      'Diseño computacional de enzimas y drogas · Docking molecular, algoritmo de docking',
    details: [
      '17:00 – 20:50 · 3h 50min',
      'Edificio Alberto Lleras',
      'Profesor: A. González',
    ],
  },
  {
    date: '2026-04-24',
    day: 'Viernes',
    week: 5,
    topic:
      'Uso de docking molecular · Deep learning en el diseño de inhibidores enzimáticos, uso de Boltz-2 y AlphaFold-3 para cribaje de moléculas',
    details: [
      '08:00 – 12:20 · 4h 20min',
      'Edificio Alberto Lleras',
      'Profesor: A. González',
    ],
  },
  {
    date: '2026-04-24',
    day: 'Viernes',
    week: 5,
    topic:
      'Del gen al fenotipo · El problema de escalar una molécula, el valle de la muerte, criterios para selección de chasis celular',
    details: [
      '14:00 – 15:20 · 1h 20min',
      'Edificio Alberto Lleras',
      'Profesor: L. H. Reyes',
    ],
  },
  {
    date: '2026-05-21',
    day: 'Jueves',
    week: 9,
    topic:
      'Modelos metabólicos a escala genómica (GEM) · Análisis de balance de flujos (FBA), demostración COBRApy · Cinética de crecimiento y producción (Monod, inhibición, Luedeking-Piret), diseño y operación de biorreactores',
    details: [
      '17:00 – 20:50 · 3h 50min',
      'Edificio Alberto Lleras',
      'Profesor: L. H. Reyes',
    ],
  },
  {
    date: '2026-05-22',
    day: 'Viernes',
    week: 9,
    topic:
      'Downstream processing y análisis tecno-económico · Operaciones de separación y purificación, integración upstream y downstream, evaluación de viabilidad económica del bioproducto',
    details: [
      '08:00 – 12:20 · 4h 20min',
      'Edificio Alberto Lleras',
      'Profesor: L. H. Reyes',
    ],
  },
  {
    date: '2026-05-22',
    day: 'Viernes',
    week: 9,
    topic:
      'Scale-up industrial · Criterios de escalamiento, aspectos regulatorios, casos reales de bioproductos',
    details: [
      '14:00 – 15:20 · 1h 20min',
      'Edificio Alberto Lleras',
      'Profesor: L. H. Reyes',
    ],
    quiz: 'Quiz final módulo bioprocesos',
  },
];

export const dpro4300Course: Course = {
  slug: 'dpro-4300',
  code: 'DPRO-4300',
  title: 'Diseño Sistémico de Bioproductos',
  term: '2026-10',
  credits: 4,
  modality: 'Presencial intensiva',
  duration: '9 sesiones en 3 bloques',
  tagline:
    'Del diseño molecular computacional al escalamiento industrial de bioproductos',
  description:
    'Este curso aborda el diseño de bioproductos mediante una aproximación sistémica y multiescala. Partiendo de la escala molecular, donde se optimizan computacionalmente las moléculas de interés, el curso avanza hacia la selección del organismo hospedero, el diseño metabólico celular, la operación de biorreactores, y finalmente la evaluación tecno-económica y el escalamiento industrial. Esta integración de escalas permite a los estudiantes comprender cómo las decisiones en cada nivel afectan el desempeño global del bioproceso, aplicando herramientas computacionales, modelos matemáticos y criterios de ingeniería para el diseño racional de bioprocesos viables.',
  accessCode: 'DSBP202610',
  bannerUrl: '/classroom/dpro-4300/banner.jpg',
  team: [
    {
      name: 'Andrés González',
      role: 'Profesor Asociado',
      email: 'andgonza@uniandes.edu.co',
    },
    {
      name: 'Luis H. Reyes',
      role: 'Profesor Asociado',
      email: 'lh.reyes@uniandes.edu.co',
    },
  ],
  schedule: [
    {
      label: 'Bloque 1 · Escala molecular, fundamentos',
      detail: 'Jueves 26 y Viernes 27 de marzo · Edificio Alberto Lleras',
    },
    {
      label: 'Bloque 2 · Escala molecular avanzada y transición a escala celular',
      detail: 'Jueves 23 y Viernes 24 de abril · Edificio Alberto Lleras',
    },
    {
      label: 'Bloque 3 · Escala celular, bioproceso y escalamiento',
      detail: 'Jueves 21 y Viernes 22 de mayo · Edificio Alberto Lleras',
    },
  ],
  objectives: [
    'Entender el marco conceptual del diseño multiescala de bioproductos, identificando cómo las decisiones a escala molecular, celular y de proceso se integran sistémicamente para lograr un bioproducto viable.',
    'Aplicar herramientas computacionales para el diseño molecular, incluyendo mecánica y dinámica molecular, docking molecular, y métodos de deep learning para la optimización de proteínas y moléculas de interés.',
    'Seleccionar chasis celulares apropiados y utilizar modelos metabólicos a escala genómica (GEM/FBA) para predecir y optimizar el comportamiento celular in-silico.',
    'Comprender la cinética de crecimiento y producción microbiana, y aplicar estos conceptos al diseño y operación de biorreactores.',
    'Evaluar la viabilidad técnica y económica de un bioproceso completo, incluyendo operaciones de downstream processing y criterios de escalamiento industrial.',
    'Integrar las diferentes escalas del diseño en un proyecto aplicado que recorra el camino completo de un bioproducto.',
  ],
  methodology: {
    summary: '',
    phases: [],
  },
  modules: [
    {
      title: 'Bloque 1 · Escala molecular, fundamentos (marzo 26–27)',
      topics: [
        'Introducción al diseño multiescala de bioproductos.',
        'Diseño molecular basado en computación (CAMD).',
        'Mecánica molecular y campos de fuerza.',
        'Interacciones moleculares y optimización geométrica de estructuras.',
        'Dinámica molecular, fuerzas conservativas y métodos de integración.',
        'Uso de GROMACS.',
      ],
    },
    {
      title:
        'Bloque 2 · Escala molecular avanzada y transición a escala celular (abril 23–24)',
      topics: [
        'Diseño computacional de enzimas y drogas.',
        'Docking molecular y algoritmo de docking.',
        'Deep learning en el diseño de inhibidores enzimáticos.',
        'Uso de Boltz-2 y AlphaFold-3 para cribaje de moléculas.',
        'Del gen al fenotipo: el problema de escalar una molécula y el valle de la muerte.',
        'Criterios para la selección de chasis celular.',
      ],
    },
    {
      title: 'Bloque 3 · Escala celular, bioproceso y escalamiento (mayo 21–22)',
      topics: [
        'Modelos metabólicos a escala genómica (GEM) y análisis de balance de flujos (FBA).',
        'Demostración con COBRApy.',
        'Cinética de crecimiento y producción microbiana (Monod, inhibición, Luedeking-Piret).',
        'Diseño y operación de biorreactores.',
        'Downstream processing: operaciones de separación y purificación.',
        'Integración upstream–downstream y análisis tecno-económico.',
        'Scale-up industrial: criterios de escalamiento, aspectos regulatorios y casos reales.',
      ],
    },
  ],
  evaluation: [
    {
      component: 'Quices realizados en clase y tareas',
      percentage: 30,
      description: 'Andrés González.',
    },
    {
      component: 'Proyecto final (módulo molecular)',
      percentage: 20,
      description: 'Andrés González.',
    },
    {
      component: 'Quices y talleres en clase (módulo bioprocesos)',
      percentage: 50,
      description: 'Luis H. Reyes.',
    },
  ],
  aias: {
    intro: '',
    levels: [],
    goals: [],
    declaration: ['Declaración de uso de IA en cada entrega.'],
  },
  policies: [
    {
      category: 'Asistencia',
      items: [
        'La asistencia a las sesiones es obligatoria.',
        'Ausencias justificadas deben reportarse con anticipación al profesor correspondiente.',
      ],
    },
    {
      category: 'Entregas',
      items: [
        'Todas las entregas se realizan a través de Bloque Neón.',
        'No se aceptan entregas tardías (penalización del 100%).',
      ],
    },
    {
      category: 'Comunicación',
      items: [
        'Correo del curso: lh.reyes@uniandes.edu.co.',
        'El asunto del correo DEBE incluir: [DPRO-4300] – Tema.',
        'Tiempo de respuesta: 48 horas hábiles.',
        'Si no se siguen estas reglas, el correo no será respondido oportunamente.',
      ],
    },
    {
      category: 'Integridad académica',
      items: [
        'Todo trabajo debe ser original.',
        'Las fuentes deben citarse apropiadamente (IEEE o APA).',
        'Declaración de uso de IA en cada entrega.',
        'El plagio resulta en nota de 0 y reporte al comité disciplinario.',
      ],
    },
  ],
  community: [
    {
      category: 'Política de retiros',
      items: [
        'La fecha límite para retirarse del curso corresponde a la establecida por la universidad para el semestre vigente.',
        'Para esa fecha se habrá publicado un porcentaje significativo de las calificaciones, permitiendo una decisión informada.',
      ],
    },
    {
      category: 'Protocolo MAAD',
      items: [
        'Línea MAAD: lineamaad@uniandes.edu.co',
        'Ombudsperson: ombudsperson@uniandes.edu.co',
        'Decanatura de Estudiantes: centrodeapoyo@uniandes.edu.co',
        'Red PACA: paca@uniandes.edu.co',
        'CEU: comiteacosoceu@uniandes.edu.co',
      ],
    },
    {
      category: 'Nombre identitario',
      items: [
        'Los estudiantes pueden solicitar ser identificados con el nombre y pronombres de su elección.',
        'Para modificar el nombre en el sistema universitario: cade@uniandes.edu.co.',
      ],
    },
    {
      category: 'Ajustes razonables para estudiantes con discapacidad',
      items: [
        'Informa al profesor en las primeras dos semanas.',
        'Los ajustes se implementarán confidencialmente.',
        'Objetivo: facilitar la experiencia educativa en igualdad de condiciones.',
      ],
    },
    {
      category: 'Compromiso con la diversidad',
      items: [
        'Valoramos la diversidad, promovemos el respeto mutuo y creamos un ambiente de aprendizaje inclusivo y seguro para todos.',
      ],
    },
  ],
  readings: [],
  presentations: [
    {
      id: 's06-del-gen-al-fenotipo',
      title: 'Sesión 6 · Del gen al fenotipo: diseño celular',
      sessionNumber: 6,
      date: '2026-04-24',
      description:
        'El valle de la muerte · biología molecular del scale-up · engineering del hospedero · tour de chasis · taller participativo · casos (lipasa, Trastuzumab, Humulin, artemisinina, mRNA) · puente a GEM/FBA.',
      file: 's06-del-gen-al-fenotipo.html',
    },
  ],
  cronograma: dpro4300Cronograma,
};
