import type { CurrentStudent } from '../../../types';

export const studentsData: {
    phd: CurrentStudent[];
    ms: CurrentStudent[];
} = {
    phd: [
        { name: 'Martha Lizeth Castellanos Ordoñez', degree: 'Ph.D.', info: 'Developing an integrated management system for innovation and process optimization in odor control at the Paraíso Hydroelectric Plant.' },
        { name: 'Martha Liliana Diaz Bustamante', degree: 'Ph.D.', info: 'Applying a multiscale approach to bioproduct design in dairy and cocoa production.' },
    ],
    ms: [
        { name: 'Gabriela Melendez Plata', degree: 'M.S.', info: 'Conducting a life cycle analysis of odor removal strategies at the Paraíso Hydroelectric Plant.' },
        { name: 'Jesús Rafael Acevedo Mastrogiacomo', degree: 'M.S.', info: 'Optimizing the odor removal process implemented at the Paraíso Hydroelectric Plant.' },
        { name: 'Andrés Felipe Infante Bravo', degree: 'M.S.', info: 'Designing a biopercolation system for the removal of offensive gases.' },
        { name: 'Brayan Stick Chacón Fontecha', degree: 'M.S.', info: 'Extracting bioactive compounds from native fauna with potential biomedical applications.' },
        { name: 'Laura Daniela León', degree: 'M.S.', info: 'Designing and validating an innovation process for the evaluation and adoption of GenAI tools in university engineering courses.' },
    ]
};
