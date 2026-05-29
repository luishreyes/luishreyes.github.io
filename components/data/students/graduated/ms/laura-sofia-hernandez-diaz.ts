import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Laura Sofía Hernández Díaz',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2024,
    startedYear: 2022,
    currentPosition: { en: 'Improvement Management Analyst at Vitalis', es: 'Analista de Gestión de Mejora en Vitalis' },
    linkedinUrl: 'https://www.linkedin.com/in/laura-sof%C3%ADa-hernandez-d%C3%ADaz-8a051116a/',
    thesisTitle: 'Identification and Characterization of Native Yeast Strains in Sugarcane Plantations in Cali, Colombia, for the Efficient Production of Ethanol in the Brewing Industry',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "The Colombian brewing industry relies heavily on imported yeast strains, which limits product uniqueness and creates dependency. The country's rich biodiversity, particularly in sugarcane fields, is an untapped resource for native yeasts that could produce more authentic and sustainable local beers.", es: 'La industria cervecera colombiana depende en gran medida de cepas de levadura importadas, lo que limita la singularidad de los productos y genera dependencia. La rica biodiversidad del país, en particular en los cañaverales, es un recurso sin explotar de levaduras nativas que podrían producir cervezas locales más auténticas y sostenibles.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This project ventured into sugarcane plantations in Cali to isolate and identify native yeast strains directly from fresh sugarcane juice. The best candidates were characterized using microbiological and genomic techniques (PCR) to confirm they belonged to the Saccharomyces genus, which is ideal for brewing. Finally, their ability to produce ethanol and desirable flavors was tested in a controlled, lab-scale fermentation.', es: 'Este proyecto se adentró en los cañaverales de Cali para aislar e identificar cepas de levadura nativas directamente del jugo fresco de caña. Los mejores candidatos se caracterizaron mediante técnicas microbiológicas y genómicas (PCR) para confirmar que pertenecían al género Saccharomyces, ideal para la fabricación de cerveza. Finalmente, su capacidad para producir etanol y sabores deseables se evaluó en una fermentación controlada a escala de laboratorio.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The research successfully identified native yeast strains capable of fermenting sugars into ethanol. The resulting product had a characteristic beer-like aroma, confirming the potential of these local microbes to create unique beverages. This study lays the groundwork for a more independent and innovative Colombian brewing industry, leveraging local biodiversity to craft authentic products and reduce reliance on imported ingredients.", es: 'La investigación logró identificar cepas de levadura nativas capaces de fermentar azúcares en etanol. El producto resultante tenía un aroma característico a cerveza, confirmando el potencial de estos microbios locales para crear bebidas únicas. Este estudio sienta las bases para una industria cervecera colombiana más independiente e innovadora, aprovechando la biodiversidad local para elaborar productos auténticos y reducir la dependencia de ingredientes importados.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5722.JPG',
};

export default student;
