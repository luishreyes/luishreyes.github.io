import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Julian Daniel Torres Vanegas',
    degree: 'Doctor',
    program: { en: 'Doctor of Engineering', es: 'Doctor en Ingeniería' },
    graduationYear: 2023,
    startedYear: 2019,
    currentPosition: { en: 'Assistant Professor at Universidad EAN', es: 'Profesor asistente en la Universidad EAN' },
    linkedinUrl: 'https://www.linkedin.com/in/julian-daniel-torres-vanegas-ua2019118/',
    thesisTitle: 'Rational Design of Carbon-Based Nanoplatforms for the Delivery of Therapeutic Agents: The Impact of Changing the Support and the Translocating Agent on Cell Internalization and Endosomal Escape Abilities',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Getting life-saving drugs inside our cells is a major challenge in medicine. Even when a drug gets in, it often gets trapped and destroyed in cellular 'recycling bins' called endosomes before it can do its job. This research aimed to design smarter, microscopic delivery vehicles that can not only carry drugs into cells but also break out of these traps.", es: 'Introducir medicamentos que salvan vidas dentro de nuestras células es un gran reto en medicina. Incluso cuando un fármaco logra entrar, a menudo queda atrapado y se destruye en los «depósitos de reciclaje» celulares llamados endosomas antes de poder cumplir su función. Esta investigación buscó diseñar vehículos de entrega microscópicos más inteligentes, capaces no solo de transportar fármacos al interior de las células, sino también de escapar de estas trampas.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'The study developed and tested tiny delivery vehicles, called "nanoplatforms," made from two advanced carbon materials: graphene oxide and carbon dots. To give them special "cell-unlocking" abilities, the researchers attached two different types of cell-penetrating peptides to their surface. They experimented with different chemical linkers to see which worked best and then used high-tech microscopy to watch how these nanovehicles behaved inside different types of human cells.', es: 'El estudio desarrolló y evaluó diminutos vehículos de entrega, llamados «nanoplataformas», fabricados con dos materiales avanzados de carbono: óxido de grafeno y puntos de carbono. Para dotarlos de capacidades especiales para «abrir» las células, los investigadores anclaron en su superficie dos tipos distintos de péptidos penetrantes de célula. Experimentaron con diferentes enlazadores químicos para identificar cuál funcionaba mejor y luego emplearon microscopía de alta tecnología para observar cómo se comportaban estos nanovehículos dentro de distintos tipos de células humanas.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The research revealed that a 'one-size-fits-all' approach doesn't work. The success of the delivery vehicle depended on a precise combination of the carbon material, the peptide, the chemical linker, and the target cell type. The study successfully created nanoplatforms that were excellent at entering cells and, in some cases, achieved up to 50% escape from the cellular traps. This work provides a valuable roadmap for rationally designing next-generation drug delivery systems, paving the way for more effective and targeted therapies.", es: 'La investigación reveló que un enfoque «de talla única» no funciona. El éxito del vehículo de entrega dependía de una combinación precisa del material de carbono, el péptido, el enlazador químico y el tipo de célula objetivo. El estudio logró crear nanoplataformas excelentes para ingresar a las células y, en algunos casos, alcanzó hasta un 50 % de escape de las trampas celulares. Este trabajo aporta una valiosa hoja de ruta para diseñar racionalmente sistemas de entrega de fármacos de próxima generación, allanando el camino hacia terapias más eficaces y dirigidas.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/Julian%20Daniel%20Torres%20Vanegas.JPG',
};

export default student;
