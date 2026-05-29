import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Anamaria Moreno Castaño',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'Clinical Data Manager at MSD', es: 'Gerente de Datos Clínicos en MSD' },
    linkedinUrl: 'https://www.linkedin.com/in/anamar%C3%ADa-moreno-castano-a139a612a/',
    thesisTitle: 'Integrating In-Silico and Experimental Approaches in the Discovery of Potential Pea Protein (Pisum sativum L.) Bioactive Peptides for the Food Industry',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'The food industry needs new, natural additives to improve food quality and safety. Bioactive peptides from plants like peas are promising, but finding the most effective ones is a slow and difficult process. The challenge is to efficiently discover pea peptides with useful antimicrobial properties.', es: 'La industria alimentaria necesita aditivos nuevos y naturales para mejorar la calidad y la inocuidad de los alimentos. Los péptidos bioactivos de plantas como la arveja son prometedores, pero encontrar los más eficaces es un proceso lento y difícil. El reto es descubrir de forma eficiente péptidos de arveja con propiedades antimicrobianas útiles.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research used a two-pronged strategy. First, a computer-based (in-silico) approach was used to simulate the breakdown of pea protein and predict which resulting peptides would have antimicrobial activity. Then, these predictions were tested in a real lab (in vitro) through experiments to see if the peptides actually stopped fungal growth.', es: 'Esta investigación empleó una estrategia de dos frentes. Primero, un enfoque computacional (in silico) simuló la degradación de la proteína de arveja y predijo cuáles de los péptidos resultantes tendrían actividad antimicrobiana. Luego, estas predicciones se pusieron a prueba en el laboratorio (in vitro) mediante experimentos para verificar si los péptidos efectivamente detenían el crecimiento de hongos.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The study successfully identified potential antimicrobial peptides from pea protein using computer models. While the lab experiments didn't fully match the computer predictions for antifungal activity, the work highlights the importance of combining computational and experimental methods. The findings show that pea protein is a valuable source of bioactive peptides that could be used as natural food preservatives, contributing to safer and healthier food products.", es: 'El estudio logró identificar posibles péptidos antimicrobianos de la proteína de arveja mediante modelos computacionales. Aunque los experimentos de laboratorio no coincidieron del todo con las predicciones computacionales en cuanto a la actividad antifúngica, el trabajo resalta la importancia de combinar métodos computacionales y experimentales. Los hallazgos muestran que la proteína de arveja es una valiosa fuente de péptidos bioactivos que podrían usarse como conservantes naturales de alimentos, contribuyendo a productos más seguros y saludables.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5740.JPG',
};

export default student;
