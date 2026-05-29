import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Halil Ibrahim Kizilates',
    degree: 'M.S.',
    program: { en: 'M.S. in Bioengineering at Karlsruhe Institute of Technology & Universidad de los Andes', es: 'M.S. en Bioingeniería en el Karlsruhe Institute of Technology y la Universidad de los Andes' },
    graduationYear: 2025,
    startedYear: 2024,
    currentPosition: { en: 'Business Development (Geodata) at Frankfurt', es: 'Desarrollo de Negocios (Geodata) en Fráncfort' },
    linkedinUrl: 'https://www.linkedin.com/in/halil-kizilates-7712491ba/',
    thesisTitle: 'Enhancing Beer Sensory Profile and Wort Fermentation through Alginate-Peptone and Polyelectrolyte Complex Yeast Encapsulation: A Novel Approach',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Craft brewers are always looking for ways to create unique beer flavors and make their fermentation process more efficient and reusable.", es: 'Los cerveceros artesanales siempre buscan formas de crear sabores de cerveza únicos y de hacer su proceso de fermentación más eficiente y reutilizable.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "This study compared encapsulated yeast (yeast trapped in tiny gel capsules) with traditional free yeast to see how it affected beer flavor and if the capsules could be reused. Different capsule materials (alginate, polyelectrolyte complexes) were tested for strength and how they controlled the fermentation process. Advanced tools like an 'electronic nose' and 'electronic tongue' were used to analyze the sensory profiles.", es: 'Este estudio comparó la levadura encapsulada (levadura atrapada en diminutas cápsulas de gel) con la levadura libre tradicional para ver cómo afectaba el sabor de la cerveza y si las cápsulas podían reutilizarse. Se probaron distintos materiales de cápsula (alginato, complejos polielectrolíticos) en cuanto a resistencia y control del proceso de fermentación. Se usaron herramientas avanzadas como una «nariz electrónica» y una «lengua electrónica» para analizar los perfiles sensoriales.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "Encapsulating the yeast worked wonders. The capsules significantly enhanced desirable flavor notes like bitterness, richness, and fruity aromas, making the beer more complex and appealing. The encapsulated yeast was also more efficient at converting sugar to alcohol. The study found that a specific method—homogenizing chitosan and alginate to form polyelectrolyte capsules—provided the best balance of mechanical strength, controlled fermentation, and superior sensory quality, offering a powerful new technique for brewers.", es: 'Encapsular la levadura hizo maravillas. Las cápsulas realzaron notablemente notas de sabor deseables como el amargor, el cuerpo y los aromas frutales, haciendo la cerveza más compleja y atractiva. La levadura encapsulada también fue más eficiente al convertir el azúcar en alcohol. El estudio halló que un método específico —homogeneizar quitosano y alginato para formar cápsulas polielectrolíticas— ofrecía el mejor equilibrio entre resistencia mecánica, fermentación controlada y calidad sensorial superior, brindando una potente nueva técnica para los cerveceros.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Halil%20Ibrahim%20Kizilates.JPG',
};

export default student;
