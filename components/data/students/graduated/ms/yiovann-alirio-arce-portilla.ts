import type { GraduatedStudent } from '../../../../types';

const student: GraduatedStudent = {
    name: 'Yiovann Alirio Arce Portilla',
    degree: 'M.S.',
    program: { en: 'M.S. in Product and Process Design at Universidad de Los Andes', es: 'M.S. en Diseño de Producto y Proceso en la Universidad de Los Andes' },
    graduationYear: 2021,
    startedYear: 2018,
    currentPosition: undefined,
    thesisTitle: 'Formulation, Design, and Production of Craft Beer for the City of Florencia, Caquetá',
    laymanSummary: [
        {
            question: { en: 'What was the problem?', es: '¿Cuál era el problema?' },
            answer: { en: "The craft beer market in Florencia, Caquetá, was largely unexplored, with consumers having limited access to locally produced, high-quality beers. The challenge was to understand local taste preferences and then design and formulate two new craft beers that would appeal to the regional market.", es: 'El mercado de cerveza artesanal en Florencia, Caquetá, estaba en gran medida inexplorado, y los consumidores tenían acceso limitado a cervezas de alta calidad producidas localmente. El reto era comprender las preferencias de sabor locales y luego diseñar y formular dos nuevas cervezas artesanales que atrajeran al mercado regional.' }
        },
        {
            question: { en: 'What was the approach?', es: '¿Cuál fue el enfoque?' },
            answer: { en: "The research began with a market analysis, surveying 356 people in Florencia to identify their preferred sensory attributes in beer, such as aroma and flavor. Based on these findings, two beer styles were selected and formulated: an American Pale Ale (APA) with citrus notes and a Porter with caramel and woodsy aromas. The beers were then brewed at a pilot scale, and their chemical and microbiological properties were rigorously analyzed to ensure they met quality and safety standards.", es: 'La investigación comenzó con un análisis de mercado, encuestando a 356 personas en Florencia para identificar sus atributos sensoriales preferidos en la cerveza, como el aroma y el sabor. Con base en estos hallazgos, se seleccionaron y formularon dos estilos de cerveza: una American Pale Ale (APA) con notas cítricas y una Porter con aromas de caramelo y madera. Luego, las cervezas se elaboraron a escala piloto, y sus propiedades químicas y microbiológicas se analizaron rigurosamente para asegurar que cumplían los estándares de calidad e inocuidad.' }
        },
        {
            question: { en: 'What were the findings?', es: '¿Cuáles fueron los hallazgos?' },
            answer: { en: "The project successfully translated local consumer preferences into two distinct and well-formulated craft beer recipes. The APA ('La Catedral') and the Porter ('La Diosa del Chairá') both met the desired sensory profiles identified in the market research. Microbiological analysis confirmed that the beers were safe for consumption, and a financial analysis demonstrated the economic viability of producing them on a larger scale. This work provides a complete roadmap for establishing a craft brewery in the region, from consumer research to final product formulation.", es: 'El proyecto logró traducir las preferencias de los consumidores locales en dos recetas de cerveza artesanal distintas y bien formuladas. Tanto la APA («La Catedral») como la Porter («La Diosa del Chairá») cumplieron los perfiles sensoriales deseados identificados en el estudio de mercado. El análisis microbiológico confirmó que las cervezas eran seguras para el consumo, y un análisis financiero demostró la viabilidad económica de producirlas a mayor escala. Este trabajo aporta una hoja de ruta completa para establecer una cervecería artesanal en la región, desde la investigación de los consumidores hasta la formulación final del producto.' }
        }
    ],
    imageUrl: 'https://ourwyskhfdesnmnhlxof.supabase.co/storage/v1/object/public/Photos/IMG_5803.jpeg',
};

export default student;
