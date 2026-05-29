import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Angie Daniela Bolaños Barbosa',
    degree: 'M.S.',
    program: { en: 'M.S. in Chemical Engineering', es: 'M.S. en Ingeniería Química' },
    graduationYear: 2023,
    startedYear: 2021,
    currentPosition: { en: 'University Tutor at Fundación Alquería Cavelier', es: 'Tutora universitaria en la Fundación Alquería Cavelier' },
    linkedinUrl: 'https://www.linkedin.com/in/angiedanielabola%C3%B1osbarbosa/',
    thesisTitle: 'Formulation and characterization of calcium alginate capsules and different strains of the yeast Saccharomyces cerevisiae: impact on the sensory profile of fermented products obtained from a base malt wort.',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Breweries constantly seek new, unique beer flavors. However, using different yeast strains to achieve this can be challenging, as some may not perform well under standard brewing conditions. The goal was to find a method to effectively use various yeast strains to create novel flavor profiles.', es: 'Las cervecerías buscan constantemente sabores de cerveza nuevos y únicos. Sin embargo, usar distintas cepas de levadura para lograrlo puede ser difícil, pues algunas no se desempeñan bien en condiciones de fermentación estándar. El objetivo era hallar un método para emplear eficazmente diversas cepas de levadura y crear perfiles de sabor novedosos.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'This research explored encapsulating yeast cells in tiny, porous gel beads made from calcium alginate (a natural polymer from seaweed). The study identified the optimal bead formulation for stability and then conducted fermentations using four different yeast strains—including a local wild strain—trapped inside these capsules, comparing them to traditional fermentations with free yeast.', es: 'Esta investigación exploró la encapsulación de células de levadura en diminutas esferas de gel porosas hechas de alginato de calcio (un polímero natural de algas). El estudio identificó la formulación óptima de las esferas para garantizar estabilidad y luego realizó fermentaciones con cuatro cepas de levadura distintas —incluida una cepa silvestre local— atrapadas dentro de estas cápsulas, comparándolas con fermentaciones tradicionales con levadura libre.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "Yeast encapsulation proved to be a powerful tool for innovation. It significantly altered the final flavor and aroma of the beer, creating distinct sensory profiles. The technique also dramatically improved the performance of the wild yeast strain, boosting its alcohol production. The study demonstrates that encapsulation is a viable strategy for brewers to differentiate their products without needing to genetically modify the yeast.", es: 'La encapsulación de levadura resultó ser una herramienta poderosa para la innovación. Alteró significativamente el sabor y el aroma finales de la cerveza, creando perfiles sensoriales distintivos. La técnica también mejoró notablemente el desempeño de la cepa silvestre, aumentando su producción de alcohol. El estudio demuestra que la encapsulación es una estrategia viable para que los cerveceros diferencien sus productos sin necesidad de modificar genéticamente la levadura.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5804.jpeg',
};

export default student;
