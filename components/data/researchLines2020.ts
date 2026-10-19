import type { Localized } from '../../context/i18n';

/** Las cinco líneas de investigación descritas en 2020, que siguen abiertas, y las cuatro que se sumaron después,
 *  cada una con un trabajo de hoy. Los nombres de especies van entre asteriscos, en cursiva. */
export interface LineaHoy {
  linea: Localized;
  hoy: Localized;
}

export const lineas2020: LineaHoy[] = [
  {
    linea: { es: 'Ingeniería de bioprocesos', en: 'Bioprocess engineering' },
    hoy: {
      es: 'El biofiltro de la Central Hidroeléctrica El Paraíso, su modelo dinámico y su control, con Enel.',
      en: 'The biofilter of the El Paraíso Hydroelectric Power Plant, its dynamic model and its control, with Enel.',
    },
  },
  {
    linea: { es: 'Bioprospección', en: 'Bioprospecting' },
    hoy: {
      es: 'Levaduras nativas para cerveza en los frutos de la palma y extractos de plantas medicinales nativas para formulaciones tópicas; antes, las masas madres colombianas, la levadura CW-12 y la Semilla Enel, el consorcio de bacterias del ecofiltro de El Paraíso.',
      en: 'Native brewing yeasts from oil palm fruits and extracts of native medicinal plants for topical formulations; before that, Colombian sourdoughs, the CW-12 yeast and the Semilla Enel, the bacterial consortium for the El Paraíso ecofilter.',
    },
  },
  {
    linea: { es: 'Biología molecular y sintética', en: 'Molecular and synthetic biology' },
    hoy: {
      es: 'Edición genómica con CRISPR para enfermedades lisosomales y vesículas de membrana externa que llevan proteínas.',
      en: 'CRISPR genome editing for lysosomal diseases, and outer membrane vesicles that carry proteins.',
    },
  },
  {
    linea: { es: 'Ingeniería inversa de microorganismos', en: 'Reverse engineering of microorganisms' },
    hoy: {
      es: 'La primera cepa descrita de *Clostridium thermocellum* que asimila hemicelulosa sin dejar de degradar celulosa, con el NREL.',
      en: 'The first reported strain of *Clostridium thermocellum* that assimilates hemicellulose while still degrading cellulose, with NREL.',
    },
  },
  {
    linea: { es: 'Nanobiotecnología, hoy biomateriales inteligentes y nanobiotecnología', en: 'Nanobiotechnology, today smart biomaterials and nanobiotechnology' },
    hoy: {
      es: 'Nanopartículas que llevan medicamentos y genes a la célula, e hidrogeles que encapsulan levaduras y probióticos.',
      en: 'Nanoparticles that carry drugs and genes into the cell, and hydrogels that encapsulate yeasts and probiotics.',
    },
  },
];

export const lineasNuevas: LineaHoy[] = [
  {
    linea: { es: 'Sostenibilidad y economía circular', en: 'Sustainability and circular economy' },
    hoy: {
      es: 'El análisis de ciclo de vida del tratamiento del gas en El Paraíso, de Gabriela Meléndez Plata, con Enel; el índice de sostenibilidad de 3.808 palmicultores, en el que Julián Fernando Becerra-Encinales encontró diez tipos de productor, y la cerveza artesanal medida en lo ambiental, lo económico y lo exergético.',
      en: 'Gabriela Meléndez Plata’s life cycle assessment of the gas treatment at El Paraíso, with Enel; the sustainability index of 3,808 oil palm growers, in which Julián Fernando Becerra-Encinales found ten kinds of producer; and craft beer measured in environmental, economic and exergetic terms.',
    },
  },
  {
    linea: { es: 'Biología computacional y diseño con inteligencia artificial', en: 'Computational biology and AI-driven design' },
    hoy: {
      es: 'AMPs-Net, la red neuronal que encontró péptidos antimicrobianos en el genoma de *Escherichia coli*.',
      en: 'AMPs-Net, the neural network that found antimicrobial peptides in the genome of *Escherichia coli*.',
    },
  },
  {
    linea: { es: 'Diseño de experiencias multisensoriales', en: 'Multisensory experience design' },
    hoy: {
      es: 'Sonic Seasoning, que arma listas de música según el sabor, quesos con menos sal y un yogur de soya con proteína de levadura.',
      en: 'Sonic Seasoning, which builds music playlists to match a flavor, cheeses with less salt and a soy yogurt with yeast protein.',
    },
  },
  {
    linea: { es: 'Investigación sobre mi docencia', en: 'Research on my teaching' },
    hoy: {
      es: 'CASF 2.0 en la red AIGEN, y NOVUS Tríada con el Tecnológico de Monterrey y la Pontificia Universidad Católica de Chile.',
      en: 'CASF 2.0 in the AIGEN network, and NOVUS Tríada with the Tecnológico de Monterrey and the Pontificia Universidad Católica de Chile.',
    },
  },
];
