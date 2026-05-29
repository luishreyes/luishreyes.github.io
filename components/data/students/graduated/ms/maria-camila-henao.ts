import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Maria Camila Henao',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Scientist at VaxThera', es: 'Científica en VaxThera' },
    thesisTitle: 'Discovery and Validation of Novel Cell-Penetrating Peptides from the SARS-CoV-2 Spike Glycoprotein for Biomedical Applications',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Delivering drugs and other therapeutic molecules inside human cells is a major challenge, as cells have protective membranes that are difficult to cross. This research sought a new "key" to unlock these cellular doors, drawing inspiration from how viruses naturally invade cells.', es: 'Entregar fármacos y otras moléculas terapéuticas dentro de las células humanas es un gran reto, pues las células tienen membranas protectoras difíciles de atravesar. Esta investigación buscó una nueva «llave» para abrir estas puertas celulares, inspirándose en la forma en que los virus invaden naturalmente las células.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "The study focused on the spike protein of the SARS-CoV-2 virus, the tool it uses to enter human cells. Using advanced computer simulations, the team identified small fragments of the spike protein (peptides) with the potential to act as cell-penetrating agents. The most promising candidates were then synthesized, attached to nanoparticles, and tested for their ability to carry a cargo into living cells in a laboratory setting.", es: 'El estudio se centró en la proteína spike del virus SARS-CoV-2, la herramienta que usa para entrar en las células humanas. Mediante simulaciones computacionales avanzadas, el equipo identificó pequeños fragmentos de la proteína spike (péptidos) con potencial para actuar como agentes penetrantes de célula. Los candidatos más prometedores se sintetizaron, se anclaron a nanopartículas y se evaluaron por su capacidad de transportar una carga al interior de células vivas en un entorno de laboratorio.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "A novel peptide, named AHB-1, was discovered and validated as a highly effective cell-penetrating agent. The study confirmed that nanoparticles carrying AHB-1 could safely and efficiently enter cells and reach the cell's interior (cytosol), demonstrating its strong potential as a new tool for developing advanced and targeted drug delivery systems.", es: 'Se descubrió y validó un péptido novedoso, llamado AHB-1, como un agente penetrante de célula altamente eficaz. El estudio confirmó que las nanopartículas que portaban AHB-1 podían ingresar a las células de forma segura y eficiente y alcanzar el interior celular (el citosol), demostrando su gran potencial como nueva herramienta para desarrollar sistemas avanzados y dirigidos de entrega de fármacos.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5759.JPG',
};

export default student;
