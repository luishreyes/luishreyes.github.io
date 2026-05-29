import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Camila Andrea Cáceres Villamizar',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Commercial Chief at Bavaria', es: 'Jefa Comercial en Bavaria' },
    linkedinUrl: 'https://www.linkedin.com/in/camilaandreacv/',
    thesisTitle: 'Genome Editing of Lactobacillus bulgaricus with CRISPR-Cas9 to Increase Its Bioprotective Potential in Dairy Products',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Dairy products like yogurt are susceptible to spoilage from bacteria and fungi. While natural preservatives exist, they are often not produced in large enough quantities by the microorganisms used in fermentation. This project aimed to genetically engineer a common yogurt bacterium, Lactobacillus bulgaricus, to make it a super-producer of diacetyl, a natural compound that not only enhances the buttery flavor of dairy products but also acts as a powerful antimicrobial agent.", es: 'Los productos lácteos como el yogur son susceptibles al deterioro por bacterias y hongos. Aunque existen conservantes naturales, los microorganismos usados en la fermentación a menudo no los producen en cantidades suficientes. Este proyecto buscó modificar genéticamente una bacteria común del yogur, Lactobacillus bulgaricus, para convertirla en una superproductora de diacetilo, un compuesto natural que no solo realza el sabor mantequilloso de los lácteos, sino que también actúa como un potente agente antimicrobiano.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "The research used the cutting-edge gene-editing tool CRISPR/Cas9 to precisely modify the bacterium's DNA. The team designed a strategy to simultaneously 'turn up' two genes (nox and alsS) that are responsible for producing diacetyl, while 'turning off' another gene (budA) that would otherwise convert the diacetyl into a less useful compound. This multi-gene editing was designed to create a synergistic effect, redirecting the bacterium's metabolism to maximize diacetyl production.", es: 'La investigación usó la herramienta de edición génica de vanguardia CRISPR/Cas9 para modificar con precisión el ADN de la bacteria. El equipo diseñó una estrategia para «encender» simultáneamente dos genes (nox y alsS) responsables de producir diacetilo, mientras «apagaba» otro gen (budA) que de otro modo convertiría el diacetilo en un compuesto menos útil. Esta edición multigénica se diseñó para generar un efecto sinérgico, redirigiendo el metabolismo de la bacteria para maximizar la producción de diacetilo.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study successfully designed a recombinant Lactobacillus bulgaricus strain with the potential for significantly increased diacetyl biosynthesis. By creating a genetic blueprint for overexpressing key production genes while simultaneously blocking a competing pathway, the research provides a powerful new strategy for developing natural bioprotectants. This work paves the way for creating dairy products with a longer shelf life and enhanced flavor, all through the power of precision genetic engineering.", es: 'El estudio logró diseñar una cepa recombinante de Lactobacillus bulgaricus con potencial para aumentar significativamente la biosíntesis de diacetilo. Al crear un plano genético para sobreexpresar genes clave de producción mientras se bloqueaba simultáneamente una vía competidora, la investigación aporta una potente nueva estrategia para desarrollar bioprotectores naturales. Este trabajo allana el camino para crear productos lácteos con mayor vida útil y sabor mejorado, todo gracias al poder de la ingeniería genética de precisión.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5764.jpg',
};

export default student;
