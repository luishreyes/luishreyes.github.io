import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Tatiana Carolina Beltrán González',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Teacher at Liceo Boston', es: 'Docente en el Liceo Boston' },
    linkedinUrl: 'https://www.linkedin.com/in/tatiana-beltrang/',
    thesisTitle: 'Development of a Nanoplatform for the Efficient Intracellular Delivery of Linearized Nucleic Acids: Applications in Gene Therapy',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Gene therapies like CRISPR/Cas9 need a safe and efficient way to deliver genetic material into target cells. While non-viral vectors (like nanoparticles) are safer than viruses, they often struggle with low efficiency and toxicity.', es: 'Las terapias génicas como CRISPR/Cas9 necesitan una forma segura y eficiente de entregar material genético en las células objetivo. Aunque los vectores no virales (como las nanopartículas) son más seguros que los virus, a menudo presentan baja eficiencia y toxicidad.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research developed a smart "nanoplatform" using a magnetic nanoparticle core. The nanoparticle was coated with molecules to help it penetrate cells and a special, reducible disulfide bond that acts as a "smart lock." This lock was used to attach a DNA tag, which in turn could carry the therapeutic genetic material. The platform was also armed with a protein (OmpA) to help it escape cellular traps.', es: 'Esta investigación desarrolló una «nanoplataforma» inteligente con un núcleo de nanopartícula magnética. La nanopartícula se recubrió con moléculas para ayudarla a penetrar las células y con un enlace disulfuro reducible especial que actúa como una «cerradura inteligente». Esta cerradura se usó para anclar una etiqueta de ADN que, a su vez, podía transportar el material genético terapéutico. La plataforma también se equipó con una proteína (OmpA) para ayudarla a escapar de las trampas celulares.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The nanoplatform was successfully constructed and showed high biocompatibility. It demonstrated the ability to effectively enter cells, escape cellular compartments, and release its cargo in response to the internal cell environment. This study provides a versatile and promising new vehicle for delivering linear nucleic acids, advancing the potential of gene therapy applications.', es: 'La nanoplataforma se construyó con éxito y mostró una alta biocompatibilidad. Demostró la capacidad de ingresar eficazmente a las células, escapar de los compartimentos celulares y liberar su carga en respuesta al entorno interno de la célula. Este estudio aporta un vehículo nuevo, versátil y prometedor para entregar ácidos nucleicos lineales, avanzando el potencial de las aplicaciones de terapia génica.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5753.JPG',
};

export default student;
