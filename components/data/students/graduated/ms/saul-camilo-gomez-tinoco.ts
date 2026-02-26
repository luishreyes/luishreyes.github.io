import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Saúl Camilo Gómez Tinoco',
    degree: 'M.S.',
    program: 'M.S. in Biomedical Engineering',
    graduationYear: 2021,
    startedYear: 2019,
    currentPosition: 'Medical Writer at Zimmer Biomet',
    linkedinUrl: 'https://www.linkedin.com/in/saul-camilo-g%C3%B3mez-tinoco-2022a51b3/',
    thesisTitle: 'Design and manufacture of a low-cost microfluidic platform for the synthesis of giant liposomes for the encapsulation and separation of yeasts: Applications for the screening of membrane-active peptides',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: "The discovery of new antibiotic alternatives, known as Membrane-Active Peptides (MAPs), is often slow and expensive. A key challenge is developing a high-throughput system to efficiently screen vast libraries of potential candidates to find effective new drugs."
        },
        {
            question: 'What was the approach?',
            answer: 'A low-cost "lab-on-a-chip" (microfluidic) platform was designed and built from the ground up. This platform first creates artificial cell membranes (GUVs) and then uses specialized micro-channels to mix them with particles that mimic yeast expressing the peptides to be tested. The entire system was optimized using advanced computer simulations.'
        },
        {
            question: 'What were the findings?',
            answer: "The microfluidic platform proved to be highly effective, showing great potential for rapidly screening new MAPs. The computational models accurately predicted the system's performance, providing a robust and affordable tool to accelerate the discovery of new drugs to combat antibiotic resistance."
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5775.JPG',
};

export default student;