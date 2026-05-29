import type { CurrentStudent } from '../../../types';

export const studentsData: {
    phd: CurrentStudent[];
    ms: CurrentStudent[];
} = {
    phd: [
        { name: 'Martha Lizeth Castellanos Ordoñez', degree: 'Ph.D.', info: { en: 'Developing an integrated management system for innovation and process optimization in odor control at the Paraíso Hydroelectric Plant.', es: 'Desarrolla un sistema integrado de gestión para la innovación y la optimización de procesos en el control de olores en la Central Hidroeléctrica del Paraíso.' } },
        { name: 'Martha Liliana Diaz Bustamante', degree: 'Ph.D.', info: { en: 'Applying a multiscale approach to bioproduct design in dairy and cocoa production.', es: 'Aplica un enfoque multiescala al diseño de bioproductos en la producción de lácteos y cacao.' } },
    ],
    ms: [
        { name: 'Gabriela Melendez Plata', degree: 'M.S.', info: { en: 'Conducting a life cycle analysis of odor removal strategies at the Paraíso Hydroelectric Plant.', es: 'Realiza un análisis de ciclo de vida de las estrategias de eliminación de olores en la Central Hidroeléctrica del Paraíso.' } },
        { name: 'Andrés Felipe Infante Bravo', degree: 'M.S.', info: { en: 'Designing a biopercolation system for the removal of offensive gases.', es: 'Diseña un sistema de biopercolación para la eliminación de gases ofensivos.' } },
        { name: 'Brayan Stick Chacón Fontecha', degree: 'M.S.', info: { en: 'Extracting bioactive compounds from native fauna with potential biomedical applications.', es: 'Extrae compuestos bioactivos de fauna nativa con potenciales aplicaciones biomédicas.' } },
    ]
};
