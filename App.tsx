
import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { ClassroomIndexPage } from './pages/classroom/ClassroomIndexPage';
import { CourseLandingPage } from './pages/classroom/CourseLandingPage';
import { ReadingsIndexPage } from './pages/classroom/ReadingsIndexPage';
import { ReadingPage } from './pages/classroom/ReadingPage';
import { PresentationsIndexPage } from './pages/classroom/PresentationsIndexPage';
import { PresentationSharePage } from './pages/classroom/PresentationSharePage';
import { RetosPage } from './pages/classroom/RetosPage';
import { startSequentialImagePreloading } from './services/preloader';
import { AppDataContext } from './context/AppDataContext';

const App: React.FC = () => {
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

  const location = useLocation();

  useEffect(() => {
    const loadInitialData = async () => {
      setProductsLoading(true);
      setCitationData(prev => ({ ...prev, isLoading: true }));

      try {
        const { products: fetchedProducts, dbCitations } = await fetchInitialData();

        setProducts(fetchedProducts);

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

    const timer = setTimeout(() => {
      startSequentialImagePreloading();
    }, 1000);

    return () => clearTimeout(timer);
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

  const contextValue = useMemo(() => ({
    products,
    productsLoading,
    citationData,
  }), [products, productsLoading, citationData]);

  return (
    <AppDataContext.Provider value={contextValue}>
      <main className="relative">
        <Navbar onDownloadCv={handleDownloadCv} />
        <div>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AboutPage />} />
              <Route path="/principles/teaching" element={<TeachingPurposePage />} />
              <Route path="/principles/research" element={<ResearchPurposePage />} />
              <Route path="/principles/service" element={<ServicePurposePage />} />
              <Route path="/principles/philosophy" element={<TeachingPhilosophyPage />} />
              <Route path="/research" element={<ResearchOverviewPage />} />
              <Route path="/research/program" element={<ResearchProgramPage />} />
              <Route path="/research/products" element={<ProductsPage />} />
              <Route path="/research/grants" element={<GrantsPage />} />
              <Route path="/research/students" element={<StudentsPage />} />
              <Route path="/teaching" element={<TeachingOverviewPage />} />
              <Route path="/teaching/courses" element={<CoursesPage />} />
              <Route path="/teaching/unit-ops" element={<UnitOperationsInnovationPage />} />
              <Route path="/teaching/continuing-education" element={<ContinuingEducationPage />} />
              <Route path="/teaching/testimonials" element={<TestimonialsPage />} />
              <Route path="/teaching/scholarship" element={<ScholarshipOfTeachingPage />} />
              <Route path="/teaching/professional-development" element={<ProfessionalDevelopmentPage />} />
              <Route path="/service" element={<InstitutionalOverviewPage />} />
              <Route path="/service/augmented-intelligence" element={<AugmentedIntelligencePage />} />
              <Route path="/service/committees" element={<CommitteesPage />} />
              <Route path="/service/editorial" element={<EditorialPage />} />
              <Route path="/service/outreach" element={<OutreachPage />} />
              <Route path="/future" element={<FutureOverviewPage />} />
              <Route path="/future/research" element={<ResearchDirectionsPage />} />
              <Route path="/future/collaboration" element={<CollaborationPage />} />
              <Route path="/recognition" element={<AwardsPage />} />
              <Route path="/classroom" element={<ClassroomIndexPage />} />
              <Route path="/classroom/:courseSlug" element={<CourseLandingPage />} />
              <Route path="/classroom/:courseSlug/readings" element={<ReadingsIndexPage />} />
              <Route path="/classroom/:courseSlug/readings/:slug" element={<ReadingPage />} />
              <Route path="/classroom/:courseSlug/presentations" element={<PresentationsIndexPage />} />
              <Route path="/classroom/:courseSlug/share/:presentationId" element={<PresentationSharePage />} />
              <Route path="/classroom/:courseSlug/retos" element={<RetosPage />} />
              <Route path="*" element={<AboutPage />} />
            </Routes>
          </AnimatePresence>
        </div>
        <ScrollToTopButton />
      </main>
    </AppDataContext.Provider>
  );
};

export default App;
