import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Juan Manuel Perez',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Founder at Insuaecol', es: 'Fundador de Insuaecol' },
    thesisTitle: 'Extraction of Amino Acids from Soybean Cake Through Enzymatic Hydrolysis for Fertilizer Production',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Traditional agricultural fertilizers are often expensive and can be harmful to the environment. This project sought to create a sustainable and cost-effective alternative by upcycling a common agricultural byproduct: soybean cake.', es: 'Los fertilizantes agrícolas tradicionales suelen ser costosos y pueden ser dañinos para el medio ambiente. Este proyecto buscó crear una alternativa sostenible y rentable revalorizando un subproducto agrícola común: la torta de soya.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'The research focused on extracting valuable amino acids from soybean cake, which is the protein-rich residue left after oil extraction. Using a process called enzymatic hydrolysis, the proteins were broken down into amino acids, which can act as powerful biostimulants for plants. The effectiveness of this new natural fertilizer was then tested in a real-world field trial on a potato crop.', es: 'La investigación se centró en extraer valiosos aminoácidos de la torta de soya, que es el residuo rico en proteína que queda tras la extracción del aceite. Mediante un proceso llamado hidrólisis enzimática, las proteínas se descompusieron en aminoácidos, que pueden actuar como potentes bioestimulantes para las plantas. Luego, la eficacia de este nuevo fertilizante natural se evaluó en un ensayo de campo real en un cultivo de papa.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The method was highly successful. The enzymatic process efficiently converted the waste soybean cake into a nutrient-rich amino acid solution. When applied to potato plants, this natural fertilizer led to a significant increase in both the size and quantity of the harvested potatoes. This study demonstrates a viable circular economy model, turning agricultural waste into a high-value product that can improve crop yields sustainably.', es: 'El método fue muy exitoso. El proceso enzimático convirtió eficientemente la torta de soya residual en una solución de aminoácidos rica en nutrientes. Al aplicarse a las plantas de papa, este fertilizante natural produjo un aumento significativo tanto en el tamaño como en la cantidad de papas cosechadas. Este estudio demuestra un modelo viable de economía circular, transformando residuos agrícolas en un producto de alto valor capaz de mejorar los rendimientos de los cultivos de forma sostenible.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5747.JPG',
};

export default student;
