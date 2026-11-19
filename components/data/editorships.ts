import type { Localized } from '../../context/i18n';

// Edited books and guest editorships. These are one-time appointments: a
// publisher or a journal asks for one volume or one collection. They are kept
// apart from `editorialData` (institutional.ts), which lists only the standing
// editorial board seats.

/** The name as printed on the volumes, used to set it apart in editor lists. */
export const MY_EDITOR_NAME = 'Luis H. Reyes';

export interface EditedBook {
  title: string;
  publisher: string;
  year: number;
  /** Set while the volume is announced but not out yet. It is not counted among the edited
   *  books until it comes out: then this line goes. */
  inPress?: Localized;
  /** Editors in the order printed on the cover. */
  editors: string[];
  /** Cover image under public/images/books/. When it is missing, PortadaLibro draws a paper block. */
  cover?: string;
  pages: number;
  /** Chapters in the whole volume, when the publisher lists them. */
  chapters?: number;
  /** Numbered chapters he wrote or co-wrote inside the volume. */
  authoredChapters: number;
  /** Whether he wrote or co-wrote the introduction to the volume. */
  authoredIntroduction: boolean;
  openAccess?: boolean;
  isbn?: string;
  doi?: string;
  url: string;
  summary: Localized;
}

export const editedBooksData: EditedBook[] = [
  {
    title: 'The Fundamentals of Customer-Centered Design of Food Products: A Multisensory Strategy Integrating Emerging Techniques',
    publisher: 'Academic Press (Elsevier)',
    year: 2027,
    inPress: { en: 'In press, out in February 2027', es: 'En prensa, sale en febrero de 2027' },
    editors: ['Luis H. Reyes', 'Andrea Sánchez-Camargo', 'Felipe Reinoso-Carvalho', 'Juan C. Cruz'],
    // The publisher's cover, cut above the editors' names: the preliminary cover still prints
    // placeholder names. Replace it with the final cover when the book comes out.
    cover: '/images/books/customer-centered-food.jpg',
    pages: 395,
    chapters: 17,
    authoredChapters: 0,
    authoredIntroduction: false,
    isbn: '978-0-443-44109-7',
    url: 'https://shop.elsevier.com/books/the-fundamentals-of-customer-centered-design-of-food-products/reyes/978-0-443-44109-7',
    summary: {
      en: 'How to design foods and beverages around the people who eat them: the psychology of multisensory perception and today’s consumer; how appearance, flavor, texture, aroma and sound are designed; and the tools that support that work, among them advanced sensory analysis, digital prototyping, smart sensors, data analytics and sustainable design.',
      es: 'Cómo diseñar alimentos y bebidas pensando en quien los come: la psicología de la percepción multisensorial y el consumidor de hoy; cómo se diseñan la apariencia, el sabor, la textura, el aroma y el sonido, y las herramientas que apoyan ese trabajo, entre ellas el análisis sensorial avanzado, los prototipos digitales, los sensores inteligentes, la analítica de datos y el diseño sostenible.',
    },
  },
  {
    title: 'Nanocarriers for Nucleic Acids and Proteins',
    publisher: 'CRC Press (Taylor & Francis)',
    year: 2025,
    editors: ['Luis H. Reyes', 'Juan C. Cruz', 'Yashwant V. Pathak'],
    cover: '/images/books/nanocarriers.jpg',
    pages: 418,
    chapters: 16,
    authoredChapters: 6,
    authoredIntroduction: false,
    doi: '10.1201/9781003473183',
    url: 'https://doi.org/10.1201/9781003473183',
    summary: {
      en: 'Nanoscale delivery systems for nucleic acids and proteins: design principles, lipid, polymer, inorganic and bioinspired nanocarriers, gene therapy and cancer immunotherapy, and what it takes to carry a laboratory result into the clinic.',
      es: 'Sistemas de entrega a escala nanométrica para ácidos nucleicos y proteínas: principios de diseño, nanoacarreadores lipídicos, poliméricos, inorgánicos y bioinspirados, terapia génica e inmunoterapia del cáncer, y lo que exige llevar un resultado de laboratorio a la clínica.',
    },
  },
  {
    title: 'Antimicrobial Peptides: A Roadmap for Accelerating Discovery and Development',
    publisher: 'Elsevier',
    year: 2024,
    editors: ['Luis H. Reyes', 'Juan C. Cruz', 'Gregory R. Wiedman'],
    cover: '/images/books/antimicrobial-peptides.jpg',
    pages: 350,
    authoredChapters: 7,
    authoredIntroduction: true,
    isbn: '978-0-443-15393-8',
    url: 'https://www.sciencedirect.com/book/9780443153938/antimicrobial-peptides',
    summary: {
      en: 'How emerging technologies can speed up the discovery, production and market entry of antimicrobial peptides: artificial intelligence and data science, molecular and fluid dynamics simulation, process simulation, microfluidics and 3D printing.',
      es: 'Cómo las tecnologías emergentes pueden acelerar el descubrimiento, la producción y la llegada al mercado de los péptidos antimicrobianos: inteligencia artificial y ciencia de datos, simulación molecular y de dinámica de fluidos, simulación de procesos, microfluídica e impresión 3D.',
    },
  },
  {
    title: 'Synthetic Genomics: From BioBricks to Synthetic Genomes',
    publisher: 'IntechOpen',
    year: 2022,
    editors: ['Miguel Fernández-Niño', 'Luis H. Reyes'],
    cover: '/images/books/synthetic-genomics.jpg',
    pages: 104,
    authoredChapters: 0,
    authoredIntroduction: true,
    openAccess: true,
    doi: '10.5772/intechopen.94713',
    url: 'https://doi.org/10.5772/intechopen.94713',
    summary: {
      en: 'The state of synthetic genomics, the emerging field that sets out to build entire genomes out of pre-designed building blocks obtained by chemical synthesis and rational design.',
      es: 'El estado de la genómica sintética, el campo emergente que busca construir genomas completos con bloques prediseñados, obtenidos por síntesis química y diseño racional.',
    },
  },
];

/** The volumes already out, which are the ones counted. */
export const publishedBooksData = editedBooksData.filter((b) => !b.inPress);
/** The volumes announced by their publisher and not out yet. */
export const inPressBooksData = editedBooksData.filter((b) => b.inPress);

export type CollectionKind = 'special-issue' | 'themed-issue' | 'research-topic';

export interface GuestEditorship {
  /** Title of the collection, exactly as the journal publishes it. */
  issueTitle: string;
  kind: CollectionKind;
  journal: string;
  section?: Localized;
  publisher: Localized;
  period: string;
  /** Guest editors in the order the journal lists them. */
  editors: string[];
  /** The opening editorial signed by the guest editors, when there is one. */
  editorial?: { title: string; doi: string };
}

export const guestEditorshipsData: GuestEditorship[] = [
  {
    issueTitle: 'Latest pedagogical developments in chemical engineering education in Latin America: innovative approaches inside and outside the classroom',
    kind: 'special-issue',
    journal: 'Education for Chemical Engineers',
    publisher: {
      en: 'Elsevier, on behalf of the Institution of Chemical Engineers (IChemE)',
      es: 'Elsevier, por encargo de la Institution of Chemical Engineers (IChemE)',
    },
    period: '2024',
    editors: ['Luis H. Reyes', 'Juan C. Cruz', 'Óscar Alberto Álvarez Solano'],
    editorial: {
      title: 'Editorial: The modern face of chemical engineering in Latin America',
      doi: '10.1016/j.ece.2023.10.003',
    },
  },
  {
    issueTitle: 'Frontiers in Stimuli-Responsive Nanoplatforms: Pioneering Drug Delivery in Nanobiotechnology',
    kind: 'themed-issue',
    journal: 'Nanoscale Advances',
    publisher: { en: 'Royal Society of Chemistry (RSC)', es: 'Royal Society of Chemistry (RSC)' },
    period: '2024',
    editors: ['Juan C. Cruz', 'Luis H. Reyes'],
    editorial: {
      title: 'Frontiers in stimuli-responsive nanoplatforms: pioneering drug delivery in nanobiotechnology',
      doi: '10.1039/d4na90074j',
    },
  },
  {
    issueTitle: 'Biocompatible Hydrogels: Properties, Synthesis and Applications in Biomedicine',
    kind: 'research-topic',
    journal: 'Frontiers in Chemistry',
    section: { en: 'Polymer Chemistry section', es: 'Sección de Química de Polímeros' },
    publisher: { en: 'Frontiers', es: 'Frontiers' },
    period: '2024',
    editors: ['Lei Nie', 'Carolina Muñoz-Camargo', 'Sayan Ganguly', 'Lahoucine Bahsis', 'Juan C. Cruz', 'Reza Mohammadinejad', 'Aldo Nicosia', 'Luis H. Reyes', 'Xing Wang'],
    editorial: {
      title: 'Editorial: Biocompatible hydrogels: properties, synthesis and applications in biomedicine',
      doi: '10.3389/fchem.2024.1500836',
    },
  },
  {
    issueTitle: 'Polymeric Materials for Applications in the Food Industry',
    kind: 'special-issue',
    journal: 'Polymers',
    section: { en: 'Polymer Applications section', es: 'Sección Polymer Applications' },
    publisher: { en: 'MDPI', es: 'MDPI' },
    period: '2023-2024',
    editors: ['Luis H. Reyes', 'Juan C. Cruz'],
  },
];

/** Covers of the books he wrote (not edited), keyed by the identifier they carry in
 *  public/data/products.json (ISBN or ASIN). */
export const ownBookCovers: Record<string, string> = {
  '979-8255230075': '/images/books/brewing-yeasts.jpg',
  B0C17MBMMV: '/images/books/insectopia.jpg',
};
