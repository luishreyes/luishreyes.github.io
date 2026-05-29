import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Andrés Felipe Leal',
    degree: 'Ph.D.',
    program: { en: 'Ph.D. Program in Biological Sciences at Pontificia Universidad Javeriana', es: 'Doctorado en Ciencias Biológicas en la Pontificia Universidad Javeriana' },
    graduationYear: 2023,
    startedYear: 2019,
    currentPosition: { en: 'Postdoctoral Researcher at IIMCB, Poland', es: 'Investigador posdoctoral en el IIMCB, Polonia' },
    linkedinUrl: 'https://www.linkedin.com/in/andr%C3%A9s-felipe-leal-4347b17a/',
    thesisTitle: 'CRISPR/nCas9-Based Genome Editing for GM2 Gangliosidoses and Mucopolysaccharidosis IVA Using Non-Viral Vectors',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Treating rare genetic disorders like Tay-Sachs disease and Morquio A syndrome is incredibly challenging. While gene therapy offers promise, safely and effectively delivering the necessary genetic tools into cells without using potentially risky viruses remains a major hurdle.', es: 'Tratar trastornos genéticos raros como la enfermedad de Tay-Sachs y el síndrome de Morquio A es enormemente difícil. Aunque la terapia génica resulta prometedora, entregar de forma segura y eficaz las herramientas genéticas necesarias en las células sin recurrir a virus potencialmente riesgosos sigue siendo un gran obstáculo.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research developed a novel gene-editing strategy using a safer, more precise version of CRISPR (nCas9). To deliver this tool, it employed custom-designed iron-oxide nanoparticles (IONPs) that act as tiny, non-viral magnetic delivery vehicles. The system was rigorously tested on patient-derived cells and in mouse models of the disease.', es: 'Esta investigación desarrolló una novedosa estrategia de edición génica usando una versión más segura y precisa de CRISPR (nCas9). Para entregar esta herramienta, empleó nanopartículas de óxido de hierro (IONP) diseñadas a la medida que actúan como diminutos vehículos magnéticos de entrega no virales. El sistema se probó rigurosamente en células derivadas de pacientes y en modelos murinos de la enfermedad.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'The strategy proved highly successful. The CRISPR/IONP system corrected the genetic defect in patient cells, restoring the function of the missing enzyme and reducing cellular stress. In mice with Morquio A syndrome, the treatment led to significant therapeutic effects in various tissues. This work demonstrates a powerful new platform for treating devastating genetic disorders, combining precise gene editing with a safe, innovative nanoparticle delivery system.', es: 'La estrategia resultó muy exitosa. El sistema CRISPR/IONP corrigió el defecto genético en las células de los pacientes, restaurando la función de la enzima ausente y reduciendo el estrés celular. En ratones con síndrome de Morquio A, el tratamiento produjo efectos terapéuticos significativos en varios tejidos. Este trabajo demuestra una potente nueva plataforma para tratar trastornos genéticos devastadores, combinando la edición génica precisa con un sistema de entrega por nanopartículas seguro e innovador.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5805.jpeg',
};

export default student;
