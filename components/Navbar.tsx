import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onDownloadCv: () => void;
}

const navItems = [
  {
    id: 'principles',
    title: 'Guiding Principles',
    defaultPath: '/principles/teaching',
    pathPrefix: '/principles',
    subItems: [
      { title: 'Teaching Purpose', path: '/principles/teaching' },
      { title: 'Research Purpose', path: '/principles/research' },
      { title: 'Service Purpose', path: '/principles/service' },
      { title: 'Teaching Philosophy', path: '/principles/philosophy' },
    ],
  },
  {
    id: 'research',
    title: 'Research',
    defaultPath: '/research',
    pathPrefix: '/research',
    subItems: [
      { title: 'Overview', path: '/research' },
      { title: 'Research Program', path: '/research/program' },
      { title: 'Products', path: '/research/products' },
      { title: 'Grants', path: '/research/grants' },
      { title: 'Grad Students', path: '/research/students' },
    ],
  },
  {
    id: 'teaching',
    title: 'Teaching',
    defaultPath: '/teaching',
    pathPrefix: '/teaching',
    subItems: [
      { title: 'Overview', path: '/teaching' },
      { title: 'Courses Taught', path: '/teaching/courses' },
      { title: 'Unit Ops Innovation', path: '/teaching/unit-ops' },
      { title: 'Continuing Education', path: '/teaching/continuing-education' },
      { title: 'Testimonials', path: '/teaching/testimonials' },
      { title: 'Scholarship of Teaching', path: '/teaching/scholarship' },
      { title: 'Professional Development', path: '/teaching/professional-development' },
    ],
  },
  {
    id: 'institutional',
    title: 'Service',
    defaultPath: '/service',
    pathPrefix: '/service',
    subItems: [
      { title: 'Overview', path: '/service' },
      { title: 'Augmented Intelligence', path: '/service/augmented-intelligence' },
      { title: 'Service & Leadership', path: '/service/committees' },
      { title: 'Editorial Boards', path: '/service/editorial' },
      { title: 'Outreach & Scouting', path: '/service/outreach' },
    ],
  },
  { id: 'recognition', title: 'Recognition', defaultPath: '/recognition', pathPrefix: '/recognition' },
  { id: 'classroom', title: 'Classroom', defaultPath: '/classroom', pathPrefix: '/classroom' },
];


export const Navbar = ({ onDownloadCv }: NavbarProps) => {
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

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
        if (window.innerWidth >= 768) {
            setIsMobileMenuOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);

    // Close on navigation
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu(null);

    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);


  return (
    <nav ref={navRef} className="fixed top-0 w-full z-30 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
             <Link
                to="/"
                className="text-xl font-bold text-brand-dark tracking-tight transition-opacity hover:opacity-80"
             >
                LHR
             </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center">
            <div className="flex items-baseline space-x-2 md:space-x-4">
                {navItems.map((item) => {
                const isParentActive = item.pathPrefix === '/recognition'
                  ? location.pathname === '/recognition'
                  : location.pathname.startsWith(item.pathPrefix);

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
                                navigate(item.defaultPath);
                                setOpenDesktopMenu(null);
                            }
                        }}
                        className={`${
                        isParentActive
                            ? 'text-brand-dark'
                            : 'text-brand-gray hover:text-brand-dark'
                        } relative px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center`}
                        aria-haspopup={!!item.subItems}
                        aria-expanded={openDesktopMenu === item.id}
                        aria-current={isParentActive ? 'page' : undefined}
                    >
                        {item.title}
                        {item.subItems && (
                        <svg className={`w-4 h-4 ml-1 transition-transform transform ${openDesktopMenu === item.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        )}
                        {isParentActive && (
                        <motion.div
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
                                    key={subItem.path}
                                    onClick={() => {
                                    navigate(subItem.path);
                                    setOpenDesktopMenu(null);
                                    }}
                                    className={`${
                                    location.pathname === subItem.path ? 'bg-zinc-100 text-brand-dark' : 'text-brand-gray'
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
                const isParentActive = item.pathPrefix === '/recognition'
                  ? location.pathname === '/recognition'
                  : location.pathname.startsWith(item.pathPrefix);
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
                                        key={subItem.path}
                                        onClick={() => navigate(subItem.path)}
                                        className={`${location.pathname === subItem.path ? 'bg-zinc-100 text-brand-dark' : 'text-brand-gray'} block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-50 transition-colors`}
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
                        onClick={() => navigate(item.defaultPath)}
                        className={`${location.pathname === item.defaultPath ? 'bg-zinc-100 text-brand-dark' : 'text-brand-gray'} block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-zinc-50 transition-colors`}
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
