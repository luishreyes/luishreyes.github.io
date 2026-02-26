import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Andrés Felipe Leal',
    degree: 'Ph.D.',
    program: 'Ph.D. Program in Biological Sciences at Pontificia Universidad Javeriana',
    graduationYear: 2023,
    startedYear: 2019,
    currentPosition: 'Postdoctoral Researcher at IIMCB, Poland',
    linkedinUrl: 'https://www.linkedin.com/in/andr%C3%A9s-felipe-leal-4347b17a/',
    thesisTitle: 'CRISPR/nCas9-Based Genome Editing for GM2 Gangliosidoses and Mucopolysaccharidosis IVA Using Non-Viral Vectors',
    laymanSummary: [
        {
            question: 'What was the problem?',
            answer: 'Treating rare genetic disorders like Tay-Sachs disease and Morquio A syndrome is incredibly challenging. While gene therapy offers promise, safely and effectively delivering the necessary genetic tools into cells without using potentially risky viruses remains a major hurdle.'
        },
        {
            question: 'What was the approach?',
            answer: 'This research developed a novel gene-editing strategy using a safer, more precise version of CRISPR (nCas9). To deliver this tool, it employed custom-designed iron-oxide nanoparticles (IONPs) that act as tiny, non-viral magnetic delivery vehicles. The system was rigorously tested on patient-derived cells and in mouse models of the disease.'
        },
        {
            question: 'What were the findings?',
            answer: 'The strategy proved highly successful. The CRISPR/IONP system corrected the genetic defect in patient cells, restoring the function of the missing enzyme and reducing cellular stress. In mice with Morquio A syndrome, the treatment led to significant therapeutic effects in various tissues. This work demonstrates a powerful new platform for treating devastating genetic disorders, combining precise gene editing with a safe, innovative nanoparticle delivery system.'
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5805.jpeg',
};

export default student;