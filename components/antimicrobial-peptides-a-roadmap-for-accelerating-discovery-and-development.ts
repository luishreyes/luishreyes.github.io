import type { Product } from '../../types';

const product: Product = {
    title: 'Antimicrobial Peptides: A Roadmap for Accelerating Discovery and Development',
    type: 'Book',
    authors: ['Luis H. Reyes', 'Juan C. Cruz', 'Gregory R. Wiedman'],
    publicationVenue: 'Elsevier',
    publicationDate: '2025',
    doi: '978-0-443-15393-8', // ISBN
    url: 'https://shop.elsevier.com/books/antimicrobial-peptides/reyes/978-0-443-15393-8',
    laymanSummary: [
        {
            question: "What is the purpose of this book?",
            answer: "This book provides a comprehensive roadmap for accelerating the discovery and development of antimicrobial peptides (AMPs), which are promising alternatives to traditional antibiotics in the fight against drug-resistant superbugs."
        },
        {
            question: "Who is the intended audience?",
            answer: "It is written for scientists, engineers, and students in biotechnology, pharmaceuticals, and related fields who are involved in the entire pipeline of AMP development, from initial computational design to clinical application."
        },
        {
            question: "What key topics are covered?",
            answer: "The book covers everything from using AI and data science for peptide design to the practical challenges of production and purification. It bridges the gap between computational, experimental, and clinical approaches to provide a complete guide for developing new antimicrobial therapies."
        }
    ],
    keywords: ['Antimicrobial Peptides', 'Biotechnology', 'Drug Discovery', 'Antimicrobial Resistance', 'Computational Biology'],
    imageUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

export default product;
