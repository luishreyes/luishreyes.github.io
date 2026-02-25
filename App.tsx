
import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AboutPage } from './pages/AboutPage';
import { ResearchOverviewPage } from './pages/ResearchOverviewPage';
import { ProductsPage } from './pages/ProductsPage';
import { GrantsPage } from './pages/GrantsPage';
import { StudentsPage } from './pages/StudentsPage';
import { AnimatePresence } from 'framer-motion';
import { TeachingOverviewPage } from './pages/teaching/TeachingOverviewPage';
import { TeachingPhilosophyPage } from './pages/teaching/TeachingPhilosophyPage';
import { CoursesPage } from './pages/teaching/CoursesPage';
import { TestimonialsPage } from './pages/teaching/TestimonialsPage';
import { ResearchProgramPage } from './pages/ResearchProgramPage';
import { ScholarshipOfTeachingPage } from './pages/teaching/ScholarshipOfTeachingPage';
import { InstitutionalOverviewPage } from './pages/institutional/InstitutionalOverviewPage';
import { CommitteesPage } from './pages/institutional/CommitteesPage';
import { EditorialPage } from './pages/institutional/EditorialPage';
import { OutreachPage } from './pages/institutional/OutreachPage';
import { FutureOverviewPage } from './pages/future/FutureOverviewPage';
import { ResearchDirectionsPage } from './pages/future/ResearchDirectionsPage';
import { CollaborationPage } from './pages/future/CollaborationPage';
import { AwardsPage } from './pages/AwardsPage';
import { ContinuingEducationPage } from './pages/teaching/ContinuingEducationPage';
import { ProfessionalDevelopmentPage } from './pages/teaching/ProfessionalDevelopmentPage';
import { AugmentedIntelligencePage } from './pages/institutional/AugmentedIntelligencePage';
import { UnitOperationsInnovationPage } from './pages/teaching/UnitOperationsInnovationPage';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { SocialLinks } from './components/SocialLinks';
import { fetchInitialData } from './services/supabase';
import type { Product } from './types';
import { generateCvPdf } from './services/cvGenerator';
import { grantsData } from './components/data/grants';
import { awardsData } from './components/data/awards';
import { educationData } from './components/data/education';
import { workExperienceData } from './components/data/experience';
import { researchLines } from './components/data/research';
import { TeachingPurposePage } from './pages/purpose/TeachingPurposePage';
import { ResearchPurposePage } from './pages/purpose/ResearchPurposePage';
import { ServicePurposePage } from './pages/purpose/ServicePurposePage';
import { startSequentialImagePreloading } from './services/preloader';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('about');
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [citationData, setCitationData] = useState<{
    counts: Record<string, number | null>;
    total: number;
    hIndex: number;
    i10Index: number;
    isLoading: boolean;
  }>({
    counts: {},
    total: 0,
    hIndex: 0,
    i10Index: 0,
    isLoading: true,
  });

  useEffect(() => {
    const loadInitialData = async () => {
      setProductsLoading(true);
      setCitationData(prev => ({ ...prev, isLoading: true }));

      try {
        const { products: fetchedProducts, dbCitations } = await fetchInitialData();

        setProducts(fetchedProducts);

        // This logic was in the second useEffect. Now it runs as soon as data is available.
        const allCounts = {
          ...fetchedProducts.reduce((acc, p) => ({ ...acc, [p.doi]: null }), {}),
          ...dbCitations
        };

        const numericCounts: number[] = Object.values(allCounts).filter((c): c is number => c !== null);
        const total = numericCounts.reduce((sum, count) => sum + count, 0);

        numericCounts.sort((a, b) => b - a);
        let hIndex = 0;
        for (let i = 0; i < numericCounts.length; i++) {
          if (numericCounts[i] >= i + 1) {
            hIndex = i + 1;
          } else {
            break;
          }
        }
        const i10Index = numericCounts.filter(c => c >= 10).length;

        setCitationData({
          counts: allCounts,
          total,
          hIndex,
          i10Index,
          isLoading: false,
        });

      } catch (error) {
        console.error("Failed to load initial data:", error);
        setCitationData(prev => ({ ...prev, isLoading: false }));
      } finally {
        setProductsLoading(false);
      }
    };

    loadInitialData();

    // Delay preloading images so it doesn't block critical data fetching
    const timer = setTimeout(() => {
      startSequentialImagePreloading();
    }, 1000); // 1-second delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const handleDownloadCv = () => {
    if (citationData.isLoading) {
      alert("Citation data is still loading. Please wait a moment and try again.");
      return;
    }
    const researchAreaTitles = researchLines.map(line => line.title);
    generateCvPdf(
        products,
        grantsData,
        awardsData,
        educationData,
        workExperienceData,
        researchAreaTitles,
        citationData.counts
    );
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'research.overview':
        return <ResearchOverviewPage citationData={citationData} products={products} />;
      case 'research.program':
        return <ResearchProgramPage />;
      case 'research.products':
        return <ProductsPage 
                  products={products}
                  isLoadingProducts={productsLoading}
                  citationCounts={citationData.counts}
                  isLoadingCitations={citationData.isLoading}
                />;
      case 'research.grants':
        return <GrantsPage />;
      case 'research.students':
        return <StudentsPage />;
      case 'teaching.overview':
        return <TeachingOverviewPage />;
      case 'principles.philosophy':
        return <TeachingPhilosophyPage />;
      case 'teaching.courses':
        return <CoursesPage />;
      case 'teaching.unit-ops':
        return <UnitOperationsInnovationPage />;
      case 'teaching.edco':
        return <ContinuingEducationPage />;
      case 'teaching.testimonials':
        return <TestimonialsPage />;
      case 'teaching.sotl':
        return <ScholarshipOfTeachingPage products={products} />;
      case 'teaching.development':
        return <ProfessionalDevelopmentPage />;
      case 'institutional.overview':
        return <InstitutionalOverviewPage />;
      case 'institutional.committees':
        return <CommitteesPage />;
      case 'institutional.editorial':
        return <EditorialPage />;
      case 'institutional.outreach':
        return <OutreachPage />;
      case 'institutional.augmented-intelligence':
        return <AugmentedIntelligencePage />;
      case 'future.overview':
        return <FutureOverviewPage />;
      case 'future.research':
        return <ResearchDirectionsPage />;
      case 'future.collaboration':
        return <CollaborationPage />;
      case 'recognition':
        return <AwardsPage />;
      case 'principles.teaching':
        return <TeachingPurposePage />;
      case 'principles.research':
        return <ResearchPurposePage />;
      case 'principles.service':
        return <ServicePurposePage />;
      case 'about':
      default:
        return <AboutPage />;
    }
  };

  return (
    <main className="relative">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
        onDownloadCv={handleDownloadCv}
      />
      <div> {/* No offset, allows content to go under navbar */}
        <AnimatePresence mode="wait">
            {React.cloneElement(renderPage(), { key: currentPage, setCurrentPage })}
        </AnimatePresence>
      </div>
       <ScrollToTopButton />
    </main>
  );
};

export default App;