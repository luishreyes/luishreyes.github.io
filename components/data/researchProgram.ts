import type { Localized } from '../../context/i18n';
import type { ProgramLine } from '../../types';

/** Una herramienta del programa: las cinco líneas descritas en 2020 siguen en uso como herramientas (desde2020); las
 *  demás se sumaron después. */
export interface Herramienta {
  nombre: Localized;
  desde2020: boolean;
}

/** Una línea del programa de investigación, por el problema que resuelve: su nombre, el problema, las herramientas
 *  que usa y un trabajo de hoy. Los nombres de especies van entre asteriscos, en cursiva. */
export interface LineaPrograma {
  id: ProgramLine;
  titulo: Localized;
  problema: Localized;
  herramientas: Herramienta[];
  hoy: Localized;
}

const H = {
  bioprocesos: { nombre: { es: 'Ingeniería de bioprocesos', en: 'Bioprocess engineering' }, desde2020: true },
  bioprospeccion: { nombre: { es: 'Bioprospección', en: 'Bioprospecting' }, desde2020: true },
  molecular: { nombre: { es: 'Biología molecular y sintética', en: 'Molecular and synthetic biology' }, desde2020: true },
  inversa: { nombre: { es: 'Ingeniería inversa de microorganismos', en: 'Reverse engineering of microorganisms' }, desde2020: true },
  nano: { nombre: { es: 'Biomateriales y nanobiotecnología', en: 'Biomaterials and nanobiotechnology' }, desde2020: true },
  sostenibilidad: { nombre: { es: 'Sostenibilidad y economía circular', en: 'Sustainability and circular economy' }, desde2020: false },
  ia: { nombre: { es: 'Biología computacional e IA', en: 'Computational biology and AI' }, desde2020: false },
  sensorial: { nombre: { es: 'Diseño de experiencias multisensoriales', en: 'Multisensory experience design' }, desde2020: false },
  docencia: { nombre: { es: 'Investigación sobre mi docencia', en: 'Research on my teaching' }, desde2020: false },
} satisfies Record<string, Herramienta>;

/** El programa, en el orden en que se muestra. Cada producto lleva su línea en `programLine` (products.json) y, si
 *  cruza a otra, `programLineSecondary`. */
export const programa: LineaPrograma[] = [
  {
    id: 'Health',
    titulo: { es: 'Salud', en: 'Health' },
    problema: {
      es: 'Llevar fármacos, genes y péptidos a donde hacen falta: enfermedades raras, cáncer y la resistencia a los antimicrobianos.',
      en: 'Getting drugs, genes and peptides to where they are needed: rare diseases, cancer and antimicrobial resistance.',
    },
    herramientas: [H.nano, H.molecular, H.ia],
    hoy: {
      es: 'Edición genómica con CRISPR para enfermedades lisosomales; nanopartículas que llevan medicamentos y genes a la célula, y AMPs-Net, la red neuronal que encontró péptidos antimicrobianos en el genoma de *Escherichia coli*.',
      en: 'CRISPR genome editing for lysosomal diseases; nanoparticles that carry drugs and genes into the cell; and AMPs-Net, the neural network that found antimicrobial peptides in the genome of *Escherichia coli*.',
    },
  },
  {
    id: 'Food & Consumer',
    titulo: { es: 'Alimentos y consumo', en: 'Food and consumer products' },
    problema: {
      es: 'Productos que la gente quiera consumir y que le hagan bien.',
      en: 'Products that people want to consume and that are good for them.',
    },
    herramientas: [H.sensorial, H.bioprospeccion, H.nano],
    hoy: {
      es: 'Sonic Seasoning, que arma listas de música según el sabor; quesos con menos sal y un yogur de soya con proteína de levadura; levaduras nativas para cerveza en los frutos de la palma, e hidrogeles que encapsulan levaduras y probióticos.',
      en: 'Sonic Seasoning, which builds music playlists to match a flavor; cheeses with less salt and a soy yogurt with yeast protein; native brewing yeasts from oil palm fruits; and hydrogels that encapsulate yeasts and probiotics.',
    },
  },
  {
    id: 'Environment & Industry',
    titulo: { es: 'Ambiente e industria', en: 'Environment and industry' },
    problema: {
      es: 'Procesos biológicos que limpian, producen y sostienen: el aire de una central, los biocombustibles y el campo.',
      en: 'Biological processes that clean, produce and sustain: the air around a power plant, biofuels and farming.',
    },
    herramientas: [H.bioprocesos, H.inversa, H.sostenibilidad],
    hoy: {
      es: 'El biofiltro de la Central Hidroeléctrica El Paraíso, su modelo dinámico y su control, con Enel; la primera cepa descrita de *Clostridium thermocellum* que asimila hemicelulosa, y el índice de sostenibilidad de 3.808 palmicultores.',
      en: 'The biofilter of the El Paraíso Hydroelectric Power Plant, its dynamic model and its control, with Enel; the first reported strain of *Clostridium thermocellum* that assimilates hemicellulose; and the sustainability index of 3,808 oil palm growers.',
    },
  },
  {
    id: 'Engineering Education',
    titulo: { es: 'Enseñanza de la ingeniería', en: 'Engineering education' },
    problema: {
      es: 'Cómo se aprende ingeniería química, y qué hace la inteligencia artificial con ese aprendizaje.',
      en: 'How chemical engineering is learned, and what artificial intelligence does to that learning.',
    },
    herramientas: [H.docencia, H.ia],
    hoy: {
      es: 'CASF 2.0 en la red AIGEN, y NOVUS Tríada con el Tecnológico de Monterrey y la Pontificia Universidad Católica de Chile.',
      en: 'CASF 2.0 in the AIGEN network, and NOVUS Tríada with the Tecnológico de Monterrey and the Pontificia Universidad Católica de Chile.',
    },
  },
];

export const lineaPorId = Object.fromEntries(programa.map((l) => [l.id, l])) as Record<ProgramLine, LineaPrograma>;
