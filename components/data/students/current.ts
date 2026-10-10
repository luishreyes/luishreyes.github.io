import type { CurrentStudent } from '../../../types';

export const studentsData: {
    phd: CurrentStudent[];
    ms: CurrentStudent[];
} = {
    phd: [
        { name: 'Martha Lizeth Castellanos Ordoñez', degree: 'Ph.D.', info: { en: 'Developing an integrated management system for innovation and process optimization in odor control at the Paraíso Hydroelectric Plant.', es: 'Desarrolla un sistema integrado de gestión para la innovación y la optimización de procesos en el control de olores en la Central Hidroeléctrica del Paraíso.' } },
        { name: 'Martha Liliana Diaz Bustamante', degree: 'Ph.D.', info: { en: 'Applying a multiscale approach to bioproduct design in dairy and cocoa production.', es: 'Aplica un enfoque multiescala al diseño de bioproductos en la producción de lácteos y cacao.' } },
        { name: 'Carlos Yesiel González Murcia', degree: 'Ph.D.', info: { en: 'Exploring Colombian biodiversity for native yeasts for beer production. Co-advised with Nicolás Ríos Ratkovich.', es: 'Explora la biodiversidad colombiana en busca de levaduras nativas para la producción de cerveza. Codirigido con Nicolás Ríos Ratkovich.' } },
    ],
    ms: [
        { name: 'Andrés Felipe Infante Bravo', degree: 'M.S.', info: { en: 'Designing a biopercolation system for the removal of offensive gases.', es: 'Diseña un sistema de biopercolación para la eliminación de gases ofensivos.' } },
        { name: 'Brayan Stick Chacón Fontecha', degree: 'M.S.', info: { en: 'Extracting bioactive compounds from native fauna with potential biomedical applications.', es: 'Extrae compuestos bioactivos de fauna nativa con potenciales aplicaciones biomédicas.' } },
        { name: 'Andrés Felipe Becerra Zárrate', degree: 'M.S.', info: { en: "Master's student in the Department of Chemical and Food Engineering. Co-advised with Juan Carlos Cruz.", es: 'Estudiante de maestría del Departamento de Ingeniería Química y de Alimentos. Codirigido con Juan Carlos Cruz.' } },
        { name: 'Paula Andrea Villamarín Manrique', degree: 'M.S.', info: { en: 'M.S. in Biomedical Engineering, co-advised. As an undergraduate she worked with me on the scale-down of iron oxide nanoparticle production.', es: 'Maestría en Ingeniería Biomédica, en codirección. En el pregrado trabajó conmigo en el escalamiento descendente de la producción de nanopartículas de óxido de hierro.' } },
    ]
};
