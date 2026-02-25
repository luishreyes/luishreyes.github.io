import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onDownloadCv: () => void;
}

const navItems = [
  { 
    id: 'principles', 
    title: 'Guiding Principles',
    defaultPage: 'principles.teaching',
    subItems: [
      { id: 'principles.teaching', title: 'Teaching Purpose' },
      { id: 'principles.research', title: 'Research Purpose' },
      { id: 'principles.service', title: 'Service Purpose' },
      { id: 'principles.philosophy', title: 'Teaching Philosophy' },
    ],
  },
  { 
    id: 'research', 
    title: 'Research',
    defaultPage: 'research.overview',
    subItems: [
      { id: 'research.overview', title: 'Overview' },
      { id: 'research.program', title: 'Research Program' },
      { id: 'research.products', title: 'Products' },
      { id: 'research.grants', title: 'Grants' },
      { id: 'research.students', title: 'Grad Students' },
    ],
  },
  { 
    id: 'teaching', 
    title: 'Teaching',
    defaultPage: 'teaching.overview',
    subItems: [
      { id: 'teaching.overview', title: 'Overview' },
      { id: 'teaching.courses', title: 'Courses Taught' },
      { id: 'teaching.unit-ops', title: 'Unit Ops Innovation' },
      { id: 'teaching.edco', title: 'Continuing Education' },
      { id: 'teaching.testimonials', title: 'Testimonials' },
      { id: 'teaching.sotl', title: 'Scholarship of Teaching' },
      { id: 'teaching.development', title: 'Professional Development' },
    ],
  },
  { 
    id: 'institutional', 
    title: 'Service',
    defaultPage: 'institutional.overview',
    subItems: [
      { id: 'institutional.overview', title: 'Overview' },
      { id: 'institutional.augmented-intelligence', title: 'Augmented Intelligence' },
      { id: 'institutional.committees', title: 'Service & Leadership' },
      { id: 'institutional.editorial', title: 'Editorial Boards' },
      { id: 'institutional.outreach', title: 'Outreach & Scouting' },
    ],
  },
  { id: 'recognition', title: 'Recognition', defaultPage: 'recognition' },
];


export const Navbar = ({ currentPage, setCurrentPage, onDownloadCv }: NavbarProps) => {
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDesktopMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu on page change or resize to desktop
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 768) { // md breakpoint
            setIsMobileMenuOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);
    
    // Close on navigation
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu(null); // Reset submenu state on navigation

    return () => window.removeEventListener('resize', handleResize);
  }, [currentPage]);


  return (
    <nav ref={navRef} className="fixed top-0 w-full z-30 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
             <button 
                onClick={() => setCurrentPage('about')} 
                className="text-xl font-bold text-brand-dark tracking-tight transition-opacity hover:opacity-80"
             >
                LHR
             </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-baseline space-x-2 md:space-x-4">
                {navItems.map((item) => {
                const isParentActive = currentPage.startsWith(item.id + '.');
                
                let dropdownPositionClass = 'left-1/2 -translate-x-1/2';
                if (item.id === 'research') {
                    dropdownPositionClass = 'left-0';
                } else if (item.id === 'institutional') {
                    dropdownPositionClass = 'right-0';
                }

                return (
                    <div
                    key={item.id}
                    className="relative"
                    >
                    <button
                        onClick={() => {
                            if (item.subItems) {
                                setOpenDesktopMenu(openDesktopMenu === item.id ? null : item.id);
                            } else {
                                setCurrentPage(item.defaultPage);
                                setOpenDesktopMenu(null);
                            }
                        }}
                        className={`${
                        (currentPage === item.id || isParentActive)
                            ? 'text-brand-dark'
                            : 'text-brand-gray hover:text-brand-dark'
                        } relative px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center`}
                        aria-haspopup={!!item.subItems}
                        aria-expanded={openDesktopMenu === item.id}
                        aria-current={(currentPage === item.id || isParentActive) ? 'page' : undefined}
                    >
                        {item.title}
                        {item.subItems && (
                        <svg className={`w-4 h-4 ml-1 transition-transform transform ${openDesktopMenu === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        )}
                        {(currentPage === item.id || isParentActive) && (
                        <motion.div
                            // FIX: Spread motion props to avoid TypeScript type errors.
                            {...{
                                layoutId: "underline",
                                transition: { type: 'spring', stiffness: 300, damping: 25 },
                            }}
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-400"
                        />
                        )}
                    </button>
                    <AnimatePresence>
                        {item.subItems && openDesktopMenu === item.id && (
                        <motion.div
                            // FIX: Spread motion props to avoid TypeScript type errors.
                            {...{
                                initial: { opacity: 0, y: 10 },
                                animate: { opacity: 1, y: 0 },
                                exit: { opacity: 0, y: 10 },
                                transition: { duration: 0.2 },
                            }}
                            className={`absolute top-full mt-2 w-60 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 ${dropdownPositionClass}`}
                        >
                            <div className="py-1">
                            {item.subItems.map(subItem => (
                                <button
                                    key={subItem.id}
                                    onClick={() => {
                                    setCurrentPage(subItem.id);
                                    setOpenDesktopMenu(null);
                                    }}
                                    className={`${
                                    currentPage === subItem.id ? 'bg-zinc-100 text-brand-dark' : 'text-brand-gray'
                                    } block w-full text-left px-4 py-2 text-sm hover:bg-zinc-100 transition-colors`}
                                >
                                {subItem.title}
                                </button>
                            ))}
                            </div>
                        </motion.div>
                        )}
                    </AnimatePresence>
                    </div>
                )
                })}
            </div>
            <button
                onClick={onDownloadCv}
                className="hidden md:flex items-center ml-6 text-brand-gray hover:text-brand-dark transition-colors duration-200 focus:outline-none"
                aria-label="Download CV"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onDownloadCv}
              className="p-2 rounded-md text-brand-gray hover:text-brand-dark transition-colors duration-200 focus:outline-none"
              aria-label="Download CV"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-brand-gray hover:text-brand-dark hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400"
            >
              <span className="sr-only">Open main menu</span>
              <AnimatePresence initial={false} mode="wait">
                  <motion.div
                    // FIX: Spread motion props to avoid TypeScript type errors.
                    {...{
                        key: isMobileMenuOpen ? 'close' : 'open',
                        initial: { rotate: -90, opacity: 0 },
                        animate: { rotate: 0, opacity: 1 },
                        exit: { rotate: 90, opacity: 0 },
                        transition: { duration: 0.2 },
                    }}
                  >
                  {isMobileMenuOpen ? (
                      <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                      <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  )}
                  </motion.div>
              </AnimatePresence>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            // FIX: Spread motion props to avoid TypeScript type errors.
            {...{
                initial: { opacity: 0, y: -20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: -20 },
                transition: { duration: 0.3, ease: 'easeInOut' },
            }}
            className="md:hidden absolute w-full bg-white border-t border-zinc-200 shadow-lg"
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map(item => {
                const isParentActive = currentPage.startsWith(item.id + '.');
                return (
                    <div key={item.id}>
                    {item.subItems ? (
                        <>
                        <button
                            onClick={() => setOpenMobileSubMenu(openMobileSubMenu === item.id ? null : item.id)}
                            className={`w-full flex justify-between items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${isParentActive ? 'text-brand-dark' : 'text-brand-gray'}`}
                        >
                            <span>{item.title}</span>
                            <svg className={`w-5 h-5 transition-transform transform ${openMobileSubMenu === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <AnimatePresence>
                            {openMobileSubMenu === item.id && (
                            <motion.div
                                // FIX: Spread motion props to avoid TypeScript type errors.
                                {...{
                                    initial: "collapsed",
                                    animate: "open",
                                    exit: "collapsed",
                                    variants: {
                                        open: { opacity: 1, height: 'auto' },
                                        collapsed: { opacity: 0, height: 0 }
                                    },
                                    transition: { duration: 0.3, ease: 'easeInOut' },
                                }}
                                className="pl-4 border-l-2 border-yellow-400/50 ml-3 overflow-hidden"
                            >
                                <div className="py-1">
                                    {item.subItems.map(subItem => (
                                    <button
                                        key={subItem.id}
                                        onClick={() => setCurrentPage(subItem.id)}
                                        className={`${currentPage === subItem.id ? 'bg-zinc-100 text-brand-dark' : 'text-brand-gray'} block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-50 transition-colors`}
                                    >
                                        {subItem.title}
                                    </button>
                                    ))}
                                </div>
                            </motion.div>
                            )}
                        </AnimatePresence>
                        </>
                    ) : (
                        <button
                        onClick={() => setCurrentPage(item.defaultPage)}
                        className={`${currentPage === item.id ? 'bg-zinc-100 text-brand-dark' : 'text-brand-gray'} block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-50 transition-colors`}
                        >
                        {item.title}
                        </button>
                    )}
                    </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};