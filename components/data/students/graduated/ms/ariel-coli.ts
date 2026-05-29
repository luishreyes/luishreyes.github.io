import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Ariel Coli',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Ph.D. student at Saarland University, Germany', es: 'Estudiante de doctorado en la Universidad del Sarre, Alemania' },
    linkedinUrl: 'https://www.linkedin.com/in/ariel-coli/',
    thesisTitle: 'Efficient Cellular Penetration and Biocompatibility of FE23-Functionalized Magnetite Nanoparticles: A Promising Platform for Targeted Drug Delivery',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'A major challenge in medicine is designing drug delivery vehicles that can effectively penetrate cells and escape the internal traps that destroy them, limiting the effectiveness of many therapies.', es: 'Un gran reto en medicina es diseñar vehículos de entrega de fármacos capaces de penetrar eficazmente las células y escapar de las trampas internas que los destruyen, las cuales limitan la eficacia de muchas terapias.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research developed a novel nanocarrier by attaching a specially designed, cell-penetrating peptide (FE23) to magnetic nanoparticles. The team then rigorously tested the safety and performance of this new system in various cell lines.', es: 'Esta investigación desarrolló un novedoso nanoacarreador anclando un péptido penetrante de célula diseñado especialmente (FE23) a nanopartículas magnéticas. Luego, el equipo evaluó rigurosamente la seguridad y el desempeño de este nuevo sistema en diversas líneas celulares.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The engineered nanocarriers were highly successful. They proved to be very safe and biocompatible, and demonstrated excellent cell penetration and the ability to escape cellular traps. This work provides a promising new platform for creating more effective and targeted drug delivery systems.', es: 'Los nanoacarreadores diseñados tuvieron gran éxito. Resultaron muy seguros y biocompatibles, y demostraron una excelente penetración celular y la capacidad de escapar de las trampas celulares. Este trabajo aporta una prometedora nueva plataforma para crear sistemas de entrega de fármacos más eficaces y dirigidos.' }
        }
    ],
    imageUrl: 'https://luishreyes.github.io/images/students/ariel-coli.jpg',
};

export default student;
