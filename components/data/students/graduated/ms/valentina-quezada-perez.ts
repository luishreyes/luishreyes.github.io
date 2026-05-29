import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Valentina Quezada Pérez',
    degree: 'M.S.',
    program: { en: 'M.S. in Biomedical Engineering', es: 'M.S. en Ingeniería Biomédica' },
    graduationYear: 2022,
    startedYear: 2020,
    currentPosition: { en: 'Researcher at Universidad de los Andes', es: 'Investigadora en la Universidad de los Andes' },
    linkedinUrl: 'https://www.linkedin.com/in/valentina-quezada-p%C3%A9rez/',
    thesisTitle: 'Formulation and evaluation of a peptide-based topical treatment against Fluconazole-resistant Candida sp.',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "Fungal infections caused by drug-resistant Candida are increasingly difficult to treat. There's a need for new, effective topical therapies that can fight these infections directly on the skin without causing systemic side effects.", es: 'Las infecciones fúngicas causadas por Candida resistente a los fármacos son cada vez más difíciles de tratar. Hace falta nuevas terapias tópicas eficaces capaces de combatir estas infecciones directamente sobre la piel sin causar efectos secundarios sistémicos.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research developed a novel hydrogel-based topical treatment containing a custom-designed antifungal peptide (KS22). The hydrogel was tested for its physical stability, texture, and rheological properties to ensure it was suitable for skin application. Its effectiveness was then evaluated against drug-resistant Candida species in both standard lab tests and advanced 3D skin and cervix models.', es: 'Esta investigación desarrolló un novedoso tratamiento tópico basado en hidrogel que contenía un péptido antifúngico diseñado a la medida (KS22). Se evaluaron la estabilidad física, la textura y las propiedades reológicas del hidrogel para asegurar que fuera apto para aplicación cutánea. Luego, su eficacia se evaluó contra especies de Candida resistentes a fármacos, tanto en pruebas de laboratorio estándar como en avanzados modelos 3D de piel y cuello uterino.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The peptide-infused hydrogel was highly effective, showing significant antifungal activity against resistant Candida strains. It was also found to be biocompatible, with very low toxicity to human cells and blood. The treatment worked successfully in advanced 3D models of skin and cervical infections, demonstrating its strong potential as a safe and potent new therapy for topical fungal infections.", es: 'El hidrogel con péptido fue muy eficaz, mostrando una actividad antifúngica significativa contra cepas resistentes de Candida. También resultó biocompatible, con una toxicidad muy baja para las células humanas y la sangre. El tratamiento funcionó con éxito en avanzados modelos 3D de infecciones cutáneas y cervicales, demostrando su gran potencial como una nueva terapia segura y potente para las infecciones fúngicas tópicas.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5755.JPG',
};

export default student;
