

import type { Education, Specialization, Credential } from '../../types';

export const educationData: Education[] = [
    {
        degree: 'Ph.D.',
        field: 'Chemical Engineering (Emphasis in Biology and Evolutionary Engineering)',
        institution: 'Texas A&M University',
        location: 'College Station, TX, USA',
        year: '2008 - 2013',
    },
    {
        degree: 'B.S.',
        field: 'Chemical Engineering',
        institution: 'Universidad Industrial de Santander',
        location: 'Bucaramanga, Colombia',
        year: '2001 - 2007',
    },
];

export const specializationsData: Specialization[] = [
    {
        title: 'Online Master in AI & Innovation',
        institution: 'Founderz',
        date: 'Mar 2024 - Feb 2025',
        description: 'A comprehensive program focused on the practical application of artificial intelligence, innovation management, and the development of AI-driven products and services.',
        skills: ['Prompt Engineering', 'Chatbot Development', 'Custom GPTs', 'Generative AI Tools', 'Ethics', 'Innovation Management'],
    },
    {
        title: 'Prompt Engineering Specialization',
        institution: 'Vanderbilt University',
        date: 'Apr 2024',
        description: "Completed a specialization focused on utilizing generative AI like ChatGPT. The program prepared me to leverage AI creatively and efficiently in various professional settings.",
        skills: [
            'Design effective prompts for AI systems.',
            'Enhance productivity and solve complex issues using AI.',
            'Integrate AI into workflows, augmenting human intelligence.',
        ],
    },
    {
        title: 'Graphic Design Specialization',
        institution: 'California Institute of the Arts (via Coursera)',
        date: 'Jun 2020',
        description: "A four-course sequence on the fundamental skills of sophisticated graphic design: process, historical context, and communication through image-making and typography.",
        skills: [],
    }
];

export const credentialsData: Credential[] = [
    { title: 'Assessment in Higher Education: Professional Development for Teachers', issuer: 'Erasmus University Rotterdam', date: 'Issued May 2020' },
    { title: 'Barista Advanced Certificate', issuer: 'JuanBarista Coffee Academy', date: 'Issued Nov 2022' },
    { title: 'Boosting Creativity for Innovation', issuer: 'HEC Paris', date: 'Issued Jul 2020' },
    { title: 'Brand New Brand', issuer: 'California Institute of the Arts', date: 'Issued Jun 2020' },
    { title: 'ChatGPT Advanced Data Analysis', issuer: 'Vanderbilt University', date: 'Issued Apr 2024' },
    { title: 'Empower your workforce with Copilot for Microsoft 365 Use Cases', issuer: 'Microsoft', date: 'Issued May 2024' },
    { title: 'Fundamentals of Graphic Design', issuer: 'California Institute of the Arts', date: 'Issued May 2020' },
    { title: 'Get started with Copilot for Microsoft 365', issuer: 'Microsoft', date: 'Issued 2024' },
    { title: 'Graphic Design Specialization', issuer: 'California Institute of the Arts', date: 'Issued Jun 2020' },
    { title: 'Ideas from the History of Graphic Design', issuer: 'California Institute of the Arts', date: 'Issued Jun 2020' },
    { title: 'Ingenierías y Administración', issuer: 'CITI Program', date: 'Issued Aug 2025' },
    { title: 'Industrial Biotechnology', issuer: 'The University of Manchester', date: 'Issued May 2020' },
    { title: 'Innovative Teaching with ChatGPT', issuer: 'Vanderbilt University', date: 'Issued Apr 2024' },
    { title: 'Introduction to Generative AI', issuer: 'Google', date: 'Issued Mar 2024' },
    { title: 'Introduction to Imagemaking', issuer: 'California Institute of the Arts', date: 'Issued May 2020' },
    { title: 'Introduction to Large Language Models', issuer: 'Google', date: 'Issued Mar 2024' },
    { title: 'Introduction to Responsible AI', issuer: 'Google', date: 'Issued Mar 2024' },
    { title: 'Introduction to Typography', issuer: 'California Institute of the Arts', date: 'Issued May 2020' },
    { title: 'Leadership in the AI Era', issuer: 'Platzi', date: 'Issued May 2024' },
    { title: 'Máster Online en IA e Innovación 2024', issuer: 'Founderz', date: 'Issued Feb 2025' },
    { title: 'Prompt Design in Vertex AI', issuer: 'Google', date: 'Issued Mar 2024' },
    { title: 'Prompt Engineering for ChatGPT', issuer: 'Vanderbilt University', date: 'Issued Mar 2024' },
    { title: 'Prompt Engineering Specialization', issuer: 'Vanderbilt University', date: 'Issued Apr 2024' },
    { title: 'Responsible AI: Applying AI Principles with Google Cloud', issuer: 'Google', date: 'Issued Mar 2024' },
    { title: 'Trustworthy Generative AI', issuer: 'Vanderbilt University', date: 'Issued Apr 2024' },
    { title: 'Understanding Financial Markets', issuer: 'University of Geneva', date: 'Issued Apr 2022' },
    { title: 'Workshop on Microbial Genomics & Metagenomics', issuer: 'JGI Joint Genome Institute', date: 'Issued Sep 2014' },
];