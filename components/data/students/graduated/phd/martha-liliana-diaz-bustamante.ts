import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Martha Liliana Díaz Bustamante',
    degree: 'Doctor',
    program: { en: 'Doctor of Engineering', es: 'Doctora en Ingeniería' },
    graduationYear: 2026,
    startedYear: 2020,
    thesisTitle: 'Multiscale design framework for structured bioproducts in dairy and cacao production',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: 'In many bioproducts, such as a protein gel or an emulsion, what the product does depends on how its components are organized, not only on which ones are used. Two sectors show it: dairy needs alternative proteins that still give the right texture, and cacao loses much of its harvest to frosty pod rot, while the natural compounds that could fight it are volatile and unstable. Designing such products is still largely trial and error.', es: 'En muchos bioproductos, como un gel de proteína o una emulsión, lo que hace el producto depende de cómo se organizan sus componentes y no solo de cuáles se usan. Dos sectores lo muestran: los lácteos necesitan proteínas alternativas que den la textura correcta, y el cacao pierde buena parte de la cosecha por la moniliasis, mientras los compuestos naturales que podrían combatirla son volátiles e inestables. Diseñar estos productos sigue siendo, en buena medida, ensayo y error.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: 'A framework of seven questions that a designer answers in order: what the product must do, which formulation variable to control, which process forms the structure, which structure mediates the function, which scale best explains the performance, how the function is measured and which competing responses limit the design. She tested it on two very different systems: a soy yogurt in which single-cell protein from the yeast Kluyveromyces lactis replaces part of the soy protein, and multiple emulsions (water in oil in water) that carry antifungal compounds against Moniliophthora roreri, the fungus behind frosty pod rot.', es: 'Un marco de siete preguntas que el diseñador responde en orden: qué debe hacer el producto, qué variable de formulación controla, qué proceso forma la estructura, qué estructura media la función, qué escala explica mejor el desempeño, cómo se mide la función y qué respuestas en competencia limitan el diseño. Lo probó en dos sistemas muy distintos: un yogur de soya en el que la proteína unicelular de la levadura Kluyveromyces lactis reemplaza parte de la proteína de soya, y unas emulsiones múltiples (agua en aceite en agua) que llevan compuestos antifúngicos contra Moniliophthora roreri, el hongo de la moniliasis del cacao.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: 'Replacing 25 % of the soy protein raised the firmness of the yogurt from 30.5 to 47.0 g; from 50 % on the gel weakened, and it held more water only at 75 %, so no formulation maximized both. The emulsions kept their structure when loaded with the antifungal compounds, and among eighteen natural compounds tested against four isolates of the fungus, one stood out as the most consistent inhibitor. Comparing the two systems gave four design principles, and the framework also organized a third product, an antibacterial hydrogel developed in the group.', es: 'Cambiar el 25 % de la proteína de soya subió la firmeza del yogur de 30,5 a 47,0 g; desde el 50 % el gel se debilitó, y solo retuvo más agua con el 75 %, así que ninguna formulación maximizó las dos cosas. Las emulsiones conservaron su estructura al cargarlas con los antifúngicos, y de dieciocho compuestos naturales probados contra cuatro aislamientos del hongo, uno sobresalió como el inhibidor más constante. La comparación de los dos sistemas dejó cuatro principios de diseño, y el marco sirvió también para ordenar un tercer producto, un hidrogel antibacteriano desarrollado en el grupo.' }
        }
    ],
    imageUrl: '/images/students/martha-liliana-diaz-bustamante.jpg',
};

export default student;
