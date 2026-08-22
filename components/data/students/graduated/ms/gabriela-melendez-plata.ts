import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Gabriela Meléndez Plata',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de los Andes', es: 'M.S. en Diseño de Productos y Procesos en la Universidad de los Andes' },
    graduationYear: 2026,
    startedYear: 2024,
    currentPosition: { en: 'Research Professional at Universidad de los Andes', es: 'Profesional de investigación en la Universidad de los Andes' },
    linkedinUrl: 'https://www.linkedin.com/in/gabriela-mel%C3%A9ndez-plata-1a6645212/',
    thesisTitle: 'Gate-to-Gate Life Cycle Assessment of Full-Scale Biological H₂S Odor Control in an Integrated Recirculating Biofilter–Biotrickling System',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Biological odor control removes the hydrogen sulfide that makes a facility smell, but the treatment itself runs on electricity, water, nutrients, and packing material that has to be replaced and disposed of. Whether the cure carries environmental costs of its own, and where those costs land, had not been measured on a full-scale system.', es: 'El control biológico de olores elimina el sulfuro de hidrógeno que hace que una instalación huela, pero el tratamiento mismo consume electricidad, agua, nutrientes y material de empaque que hay que reemplazar y disponer. No se había medido, en un sistema a escala real, si el remedio carga costos ambientales propios ni dónde recaen.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'A gate-to-gate life cycle assessment of the odor-control system at the El Paraíso hydroelectric facility, taking one cubic metre of treated gas as the functional unit. A steady-state Aspen Plus model supplied the mass and energy balances, openLCA and ecoinvent built the inventory, and impacts were characterized with the Environmental Footprint 3.1 method. A no-treatment counterfactual set the comparison and Monte Carlo simulation bounded the uncertainty.', es: 'Una evaluación de ciclo de vida de puerta a puerta del sistema de control de olores de la central hidroeléctrica El Paraíso, tomando un metro cúbico de gas tratado como unidad funcional. Un modelo estacionario en Aspen Plus aportó los balances de masa y energía, openLCA y ecoinvent construyeron el inventario, y los impactos se caracterizaron con el método Environmental Footprint 3.1. Un contrafactual sin tratamiento fijó la comparación y una simulación de Monte Carlo acotó la incertidumbre.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'Treating the gas is worth it. The system removed 85.3% of the incoming H₂S and cut freshwater ecotoxicity by 84.8%, from 33.26 to 5.05 CTUe per functional unit. What escapes untreated dominates everything else, accounting for more than 99% of that impact category, so keeping removal efficiency high matters more than trimming resource use. Electricity was the operational driver with the broadest reach, and disposal of spent packing traded off by category: neither composting nor landfill was better across the board.', es: 'Tratar el gas vale la pena. El sistema removió el 85,3% del H₂S entrante y redujo la ecotoxicidad de agua dulce en 84,8%, de 33,26 a 5,05 CTUe por unidad funcional. Lo que escapa sin tratar domina todo lo demás, con más del 99% de esa categoría de impacto, de modo que sostener la eficiencia de remoción pesa más que recortar el consumo de recursos. La electricidad fue el factor operativo de mayor alcance, y la disposición del empaque agotado presentó compensaciones según la categoría: ni el compostaje ni el relleno sanitario resultaron mejores en todas.' }
        }
    ],
    imageUrl: 'https://luishreyes.github.io/images/students/gabriela-melendez-plata.jpg',
};

export default student;
