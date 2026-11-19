import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Martha Liliana Díaz Bustamante',
    degree: 'Doctor',
    program: { en: 'Doctor of Engineering', es: 'Doctora en Ingeniería' },
    graduationYear: 2026,
    startedYear: 2020,
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'Healthier or more sustainable foods often lose out because they do not feel or behave like the products people already know. Dairy products are a clear case: taking out salt or replacing animal protein changes their texture and the way they are made.', es: 'Los alimentos más sanos o más sostenibles suelen perder porque no se sienten ni se comportan como los productos que la gente ya conoce. Los lácteos son un caso claro: quitarles sal o cambiar la proteína animal les cambia la textura y la manera de fabricarlos.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'A multiscale approach to bioproduct design in dairy and cocoa production: it links what happens to molecules and microorganisms with the structure, the texture and the process of the whole product.', es: 'Un enfoque multiescala al diseño de bioproductos en la producción de lácteos y cacao, que une lo que pasa con las moléculas y los microorganismos con la estructura, la textura y el proceso del producto completo.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'Two costeño cheeses with half and a quarter of the salt, cooked at 55 °C, resembled the original in composition and texture. In a soy yogurt, replacing 25 % of the protein with yeast grown on whey raised firmness by 54 % and cut fermentation to seven or eight hours, against almost 17.', es: 'Dos quesos costeños con la mitad y la cuarta parte de la sal, cocidos a 55 °C, se parecieron al original en composición y textura. En un yogur de soya, cambiar el 25 % de la proteína por levadura cultivada en lactosuero aumentó la firmeza 54 % y bajó la fermentación a siete u ocho horas, frente a casi 17.' }
        }
    ],
    imageUrl: '/images/students/martha-liliana-diaz-bustamante.jpg',
};

export default student;
