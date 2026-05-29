import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Daniela Rubio Olaya',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: { en: 'Senior Media Planning Analyst at Publicis Global Delivery', es: 'Analista Sénior de Planeación de Medios en Publicis Global Delivery' },
    linkedinUrl: 'https://www.linkedin.com/in/daniela-rubio-olaya/',
    thesisTitle: "Buforin II-Escherichia coli's DNA interactome: routes to elucidate the molecular mechanisms of its antimicrobial activity",
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "With bacteria becoming resistant to antibiotics, we need new ways to fight them. A promising molecule called Buforin II (BUFII) is known to kill bacteria by attacking their DNA, but exactly how it does this at a molecular level is unclear.", es: 'Con bacterias cada vez más resistentes a los antibióticos, necesitamos nuevas formas de combatirlas. Se sabe que una molécula prometedora llamada Buforina II (BUFII) mata bacterias atacando su ADN, pero no está claro cómo lo hace exactamente a nivel molecular.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "This research developed a novel technique to map out where BUFII binds to the DNA of E. coli. They attached BUFII to tiny magnetic nanoparticles, which acted as a 'hook.' When mixed with bacterial DNA, they could use a magnet to 'fish out' the specific DNA fragments attached to BUFII.", es: 'Esta investigación desarrolló una novedosa técnica para mapear dónde se une la BUFII al ADN de E. coli. Anclaron la BUFII a diminutas nanopartículas magnéticas, que actuaron como un «anzuelo». Al mezclarlas con ADN bacteriano, podían usar un imán para «pescar» los fragmentos de ADN específicos unidos a la BUFII.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study provided the first detailed look at this interaction, showing that BUFII causes DNA to form unique, super-coiled nanoscale structures. This deeper understanding of BUFII's mechanism is a critical step for developing it into a new antibiotic and could also be used to design new systems for gene therapy.", es: 'El estudio ofreció la primera mirada detallada de esta interacción, mostrando que la BUFII hace que el ADN forme estructuras únicas y superenrolladas a nanoescala. Esta comprensión más profunda del mecanismo de la BUFII es un paso clave para convertirla en un nuevo antibiótico y también podría servir para diseñar nuevos sistemas de terapia génica.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5773.JPG',
};

export default student;
