import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Johana Valentina Pérez Bejarano',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering at Universidad de Los Andes', es: 'M.S. en Ingeniería Química en la Universidad de Los Andes' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Research and development Specialist (R&D) at Grupo Danec', es: 'Especialista de Investigación y Desarrollo (I+D) en Grupo Danec' },
    linkedinUrl: 'https://www.linkedin.com/in/jvperezb/',
    thesisTitle: 'Novel Biosurfactants: Rationally Designed Surface-Active Peptides and in silico Evaluation at the Decane-Water Interface',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Industrial products like detergents and cosmetics use surfactants (molecules that help oil and water mix), but most are made from petroleum and harm the environment. The goal was to design new, eco-friendly biosurfactants from peptides (short proteins) but it's hard to predict which ones will work well.", es: 'Productos industriales como detergentes y cosméticos usan surfactantes (moléculas que ayudan a mezclar aceite y agua), pero la mayoría se fabrica a partir de petróleo y daña el medio ambiente. El objetivo era diseñar nuevos biosurfactantes ecológicos a partir de péptidos (proteínas cortas), aunque es difícil predecir cuáles funcionarán bien.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "Instead of costly lab experiments, this research used powerful computer simulations (Molecular Dynamics) to design two new peptide-based biosurfactants from scratch. The computer models predicted how these new molecules would behave at the boundary between oil and water, and their performance was compared to a common commercial surfactant.", es: 'En lugar de costosos experimentos de laboratorio, esta investigación usó potentes simulaciones computacionales (Dinámica Molecular) para diseñar desde cero dos nuevos biosurfactantes basados en péptidos. Los modelos computacionales predijeron cómo se comportarían estas nuevas moléculas en la interfase entre aceite y agua, y su desempeño se comparó con el de un surfactante comercial común.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The computer simulations accurately predicted the behavior of the new biosurfactants, showing they effectively lower the tension between oil and water. The study also revealed how the peptides arrange themselves at the interface, forming clusters as their concentration increases. This work provides a powerful and efficient computational method to accelerate the design of greener, high-performance biosurfactants for a wide range of products.", es: 'Las simulaciones computacionales predijeron con precisión el comportamiento de los nuevos biosurfactantes, mostrando que reducen eficazmente la tensión entre el aceite y el agua. El estudio también reveló cómo se organizan los péptidos en la interfase, formando agregados a medida que aumenta su concentración. Este trabajo aporta un método computacional potente y eficiente para acelerar el diseño de biosurfactantes más ecológicos y de alto desempeño para una amplia gama de productos.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5761.JPG',
};

export default student;
