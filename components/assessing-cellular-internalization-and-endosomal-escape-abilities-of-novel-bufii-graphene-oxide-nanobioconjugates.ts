import type { Product } from '../../types';

const product: Product = {
    title: 'Assessing cellular internalization and endosomal escape abilities of novel BUFII-Graphene oxide nanobioconjugates',
    type: 'Research Paper',
    authors: ['Julian Daniel Torres-Vanegas', 'Javier Cifuentes', 'Paola Ruiz Puentes', 'Valentina Quezada', 'Andres J. Garcia-Brand', 'Juan C. Cruz', 'Luis H. Reyes'],
    publicationVenue: 'Frontiers in Chemistry, Volume 10, Pages 974218',
    publicationDate: '2022/09/15',
    doi: '10.3389/fchem.2022.974218',
    laymanSummary: [
        {
            question: 'Summary',
            answer: 'One of the biggest hurdles in modern medicine is ensuring that drugs reach their specific targets inside our cells. Often, after a drug is taken into a cell, it gets trapped and destroyed within small compartments called endosomes before it has a chance to work. To overcome this, scientists are designing microscopic "delivery vehicles" made from nanomaterials. These vehicles are engineered not only to carry drugs into cells but also to break out of the endosomes, a process known as "endosomal escape." This study describes the development of a novel nanovehicle built from graphene oxide (GO), which are single-atom-thick sheets of carbon. To give these GO sheets cell-penetrating and endosome-escaping abilities, the researchers attached a potent peptide called Buforin II (BUF-II). They created two different versions: one where BUF-II was connected via a "reducible" linker designed to break apart in the cell\'s internal environment, and another using a more stable, flexible polymer linker. These nanobioconjugates were then tested on two different cell lines (Vero and THP-1) to measure how well they could enter the cells and escape the endosomes. Using advanced confocal microscopy, the team was able to visually track the nanovehicles and quantify their location within the cells. The results showed that both types of nanovehicles were highly effective at entering the cells, achieving nearly 100% cellular coverage, and were also very biocompatible, causing little harm to blood components. Their ability to escape the endosomes, however, depended on the cell type and the linker used. In Vero cells, the nanovehicle with the breakable linker demonstrated a high endosomal escape rate of up to 45%. In contrast, both nanovehicles were less successful at escaping from the endosomes of THP-1 immune cells, with most remaining trapped. This work provides important insights for designing the next generation of carbon-based nanovehicles for targeted drug delivery. By demonstrating that the choice of linker chemistry can significantly alter how a nanocarrier behaves inside a cell, the research opens up new possibilities for engineering "smarter" delivery systems that can be tailored to overcome specific cellular barriers and treat diseases more effectively.',
        }
    ],
    keywords: ['nanobioconjugates', 'graphene oxide', 'endosomal escape', 'cell internalization', 'buforin II'],
    imageUrl: 'https://images.unsplash.com/photo-1599599915303-1a84b6183656?q=80&w=1600&auto=format=fit=crop',
};

export default product;