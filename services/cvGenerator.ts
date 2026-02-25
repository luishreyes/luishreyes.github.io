// FIX: The module augmentation for jspdf was causing a TypeScript error.
// Removed the 'declare module' block and used type casting to 'any'
// where the dynamically added 'lastAutoTable' property is accessed.
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Product, Grant, Recognition, Education, WorkExperience, ProductType } from '../types';

// --- Constants ---
const MARGIN = 15;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FONT_NORMAL_SIZE = 10;
const FONT_SMALL_SIZE = 9;
const FONT_TINY_SIZE = 8;
const LINE_HEIGHT = 5;
const BRAND_YELLOW = '#FFBF00';

// --- Helper State ---
let yPos = 0;

// --- Helper Functions ---
const checkPageBreak = (doc: jsPDF, neededHeight: number) => {
    if (yPos + neededHeight > PAGE_HEIGHT - MARGIN) {
        doc.addPage();
        yPos = MARGIN;
        return true;
    }
    return false;
};

const addSectionHeader = (doc: jsPDF, text: string) => {
    checkPageBreak(doc, 20);
    yPos += LINE_HEIGHT * 2.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(50);
    doc.text(text, MARGIN, yPos);
    
    doc.setFillColor(BRAND_YELLOW);
    doc.rect(MARGIN, yPos + 1.5, 50, 2, 'F');
    
    yPos += LINE_HEIGHT * 2.5;
};

const addTwoColumnEntry = (doc: jsPDF, leftText: string[], rightText: string) => {
    const neededHeight = Math.max(leftText.length, 1) * LINE_HEIGHT + 5;
    checkPageBreak(doc, neededHeight);

    const rightTextWidth = doc.getStringUnitWidth(rightText) * FONT_SMALL_SIZE / doc.internal.scaleFactor;
    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(100);
    doc.text(rightText, PAGE_WIDTH - MARGIN - rightTextWidth, yPos);

    doc.setFontSize(FONT_NORMAL_SIZE);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text(leftText[0], MARGIN, yPos);
    yPos += LINE_HEIGHT;

    if (leftText.length > 1) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(FONT_SMALL_SIZE);
        doc.setTextColor(80);
        leftText.slice(1).forEach(line => {
            doc.text(line, MARGIN, yPos);
            yPos += LINE_HEIGHT;
        });
    }

    yPos += LINE_HEIGHT;
};

const getStartDate = (period: string): Date => {
    const startStr = period.split(' - ')[0];
    try {
        return new Date(startStr);
    } catch (e) {
        return new Date(0);
    }
};

// --- Main PDF Generation Function ---
export const generateCvPdf = (
    products: Product[],
    grants: Grant[],
    recognitions: Recognition[],
    education: Education[],
    experience: WorkExperience[],
    researchAreaTitles: string[],
    citationCounts: Record<string, number | null>
) => {
    const doc = new jsPDF('p', 'mm', 'a4');
    yPos = 0;

    // --- HEADER ---
    yPos = 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('Luis H. Reyes, Ph.D.', MARGIN, yPos);
    
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80);
    doc.text('Associate Professor | Biotechnology, Nanotechnology, Generative AI', MARGIN, yPos);

    yPos += 12;
    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(50);
    
    const email = 'lh.reyes@uniandes.edu.co';
    const linkedinText = 'LinkedIn';
    const linkedinUrl = 'http://linkedin.com/in/luishreyes';
    const scholarText = 'Google Scholar Profile';
    const scholarUrl = 'https://scholar.google.com/citations?user=2vO8IrIAAAAJ&hl=en';

    const columnWidth = CONTENT_WIDTH / 3;
    doc.text(email, MARGIN, yPos);

    doc.setTextColor(0, 0, 238); // Blue for links
    (doc as any).textWithLink(linkedinText, MARGIN + columnWidth, yPos, { url: linkedinUrl });
    (doc as any).textWithLink(scholarText, MARGIN + columnWidth * 2, yPos, { url: scholarUrl });
    doc.setTextColor(50); // Reset color

    // --- PROFESSIONAL PROFILE ---
    addSectionHeader(doc, 'PROFESSIONAL PROFILE');
    const profileText = "Dedicated innovation leader at the intersection of biotechnology, nanotechnology, and generative AI. Focused on translating complex scientific challenges into practical, high-impact solutions for sustainable development. Proven expertise in building and leading interdisciplinary research teams, mentoring next-generation scientists, and driving pedagogical transformation in higher education.";
    const splitProfile = doc.splitTextToSize(profileText, CONTENT_WIDTH);
    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(80);
    doc.text(splitProfile, MARGIN, yPos);
    yPos += (splitProfile.length * LINE_HEIGHT) / 1.5;

    // --- WORK EXPERIENCE ---
    addSectionHeader(doc, 'WORK EXPERIENCE');
    const sortedExperience = [...experience].sort((a, b) => getStartDate(b.period).getTime() - getStartDate(a.period).getTime());
    sortedExperience.forEach(exp => {
        addTwoColumnEntry(doc, [exp.role, `${exp.company}, ${exp.location}`], exp.period);
    });

    // --- EDUCATION ---
    addSectionHeader(doc, 'EDUCATION');
    education.forEach(edu => {
        const degreeLine = `${edu.degree}, ${edu.field}`;
        const institutionLine = `${edu.institution}, ${edu.location}`;
        addTwoColumnEntry(doc, [degreeLine, institutionLine], edu.year);
    });

    // --- RESEARCH AREAS ---
    addSectionHeader(doc, 'RESEARCH AREAS');
    let xPos = MARGIN;
    let currentY = yPos;
    doc.setFontSize(FONT_TINY_SIZE);

    researchAreaTitles.forEach(area => {
        const textWidth = doc.getStringUnitWidth(area) * FONT_TINY_SIZE / doc.internal.scaleFactor;
        const pillWidth = textWidth + 8;
        if (xPos + pillWidth > PAGE_WIDTH - MARGIN) {
            xPos = MARGIN;
            currentY += 10;
        }
        if (checkPageBreak(doc, 10)) {
            // After page break, reset y position for pills
            addSectionHeader(doc, 'RESEARCH AREAS (Continued)');
            currentY = yPos;
        }
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(xPos, currentY, pillWidth, 7, 3, 3, 'F');
        doc.setTextColor(80);
        doc.text(area, xPos + 4, currentY + 4.5);
        xPos += pillWidth + 5;
    });
    yPos = currentY + 10;
    
    // --- PUBLICATIONS ---
    addSectionHeader(doc, 'PUBLICATIONS');
    const publicationsText = "For a complete and up-to-date list of publications, please visit my Google Scholar profile:";
    const googleScholarUrl = "https://scholar.google.com/citations?user=2vO8IrIAAAAJ&hl=en";

    const splitText = doc.splitTextToSize(publicationsText, CONTENT_WIDTH);
    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(80);
    doc.text(splitText, MARGIN, yPos);
    yPos += (splitText.length * LINE_HEIGHT) + LINE_HEIGHT;

    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(0, 0, 238); // Blue color for link
    (doc as any).textWithLink(googleScholarUrl, MARGIN, yPos, { url: googleScholarUrl });
    yPos += LINE_HEIGHT * 2;
    
    // --- FUNDED GRANTS ---
    addSectionHeader(doc, 'FUNDED GRANTS');
    const sortedGrants = [...grants].sort((a, b) => b.startYear - a.startYear);
    autoTable(doc, {
        startY: yPos,
        head: [['Year', 'Title', 'Organization', 'Role']],
        body: sortedGrants.map(g => {
            const yearDisplay = (g.endYear && g.endYear !== g.startYear)
                ? `${g.startYear} - ${g.endYear}`
                : g.startYear.toString();
            return [yearDisplay, g.title, g.organization, g.role];
        }),
        theme: 'grid',
        headStyles: { fillColor: [85, 85, 85], textColor: 255 },
        styles: { fontSize: FONT_TINY_SIZE, cellPadding: 2, overflow: 'linebreak' },
    });
    yPos = (doc as any).lastAutoTable.finalY;

    // --- AWARDS & RECOGNITION ---
    addSectionHeader(doc, 'AWARDS & RECOGNITION');
    const awardsIntroText = "Recognition for significant contributions to science, engineering, and gene therapy from national scientific bodies.";
    const splitAwardsIntro = doc.splitTextToSize(awardsIntroText, CONTENT_WIDTH);
    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(80);
    doc.text(splitAwardsIntro, MARGIN, yPos);
    yPos += (splitAwardsIntro.length * LINE_HEIGHT) / 1.5 + 4;
    
    const sortedRecognitions = [...recognitions].sort((a, b) => b.year - a.year);
     autoTable(doc, {
        startY: yPos,
        head: [['Year', 'Award', 'Awarding Body']],
        body: sortedRecognitions.map(a => [a.year.toString(), a.title, a.awarder]),
        theme: 'grid',
        headStyles: { fillColor: [85, 85, 85], textColor: 255 },
        styles: { fontSize: FONT_TINY_SIZE, cellPadding: 2, overflow: 'linebreak' },
    });
    yPos = (doc as any).lastAutoTable.finalY;

    // --- COMPLETE PORTFOLIO LINK ---
    addSectionHeader(doc, 'COMPLETE PORTFOLIO');
    const portfolioText = "The complete, interactive version of this portfolio can be found at:";
    const portfolioUrl = "https://teaching-portfolio-bold-906077265637.us-west1.run.app";

    const splitPortfolioText = doc.splitTextToSize(portfolioText, CONTENT_WIDTH);
    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(80);
    doc.text(splitPortfolioText, MARGIN, yPos);
    yPos += (splitPortfolioText.length * LINE_HEIGHT) + LINE_HEIGHT / 2;

    doc.setFontSize(FONT_SMALL_SIZE);
    doc.setTextColor(0, 0, 238); // Blue color for link
    (doc as any).textWithLink(portfolioUrl, MARGIN, yPos, { url: portfolioUrl });
    yPos += LINE_HEIGHT * 2;


    // --- Add footer to all pages ---
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(FONT_SMALL_SIZE);
        doc.setTextColor(150);
        const footerText = `Luis H. Reyes | CV | Page ${i} of ${pageCount}`;
        const textWidth = doc.getStringUnitWidth(footerText) * FONT_SMALL_SIZE / doc.internal.scaleFactor;
        doc.text(footerText, (PAGE_WIDTH - textWidth) / 2, PAGE_HEIGHT - 10);
    }

    doc.save('Luis_H_Reyes_CV.pdf');
};