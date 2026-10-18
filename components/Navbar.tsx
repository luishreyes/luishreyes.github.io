import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../context/i18n';

interface NavbarProps {
  onDownloadCv: () => void;
}

function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const cls = (on: boolean) =>
    on ? 'text-tinta-900 font-semibold' : 'text-tinta-500 hover:text-tinta-900 transition-colors';
  return (
    <div className={`flex items-center gap-1.5 text-[15px] ${className}`}>
      <button onClick={() => setLang('en')} className={cls(lang === 'en')} aria-label="English" aria-pressed={lang === 'en'}>
        EN
      </button>
      <span className="text-tinta-400" aria-hidden="true">/</span>
      <button onClick={() => setLang('es')} className={cls(lang === 'es')} aria-label="Español" aria-pressed={lang === 'es'}>
        ES
      </button>
    </div>
  );
}

const DownloadIcon = ({ className = 'h-5 w-5' }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const Chevron = ({ open, className = 'w-4 h-4' }: { open: boolean; className?: string }) => (
  <svg className={`${className} transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
);

/** El menú sigue los capítulos del portafolio docente: Perfil (Contexto, Trayectoria,
 *  Reconocimiento, Lo que sigue), Docencia con la formación a escala, Estudiantes,
 *  Investigación, Servicio y el Aula. Cada filosofía abre su capítulo. */
const navItems = (t: (key: import('../context/i18n').UIKey) => string) => [
  {
    id: 'about',
    title: t('nav.about'),
    defaultPath: '/context',
    pathPrefix: '/context',
    match: (p: string) => ['/context', '/trajectory', '/recognition', '/next'].includes(p),
    subItems: [
      { title: t('nav.context'), path: '/context' },
      { title: t('nav.trajectory'), path: '/trajectory' },
      { title: t('nav.recognition'), path: '/recognition' },
      { title: t('nav.next'), path: '/next' },
    ],
  },
  {
    id: 'teaching',
    title: t('nav.teaching'),
    defaultPath: '/teaching',
    pathPrefix: '/teaching',
    match: (p: string) => p.startsWith('/teaching'),
    subItems: [
      { title: t('nav.teaching.overview'), path: '/teaching' },
      { title: t('nav.purpose'), path: '/teaching/purpose' },
      { title: t('nav.teaching.philosophy'), path: '/teaching/philosophy' },
      { title: t('nav.teaching.courses'), path: '/teaching/courses' },
      { title: t('nav.teaching.unitops'), path: '/teaching/unit-ops' },
      { title: t('nav.teaching.scholarship'), path: '/teaching/scholarship' },
      { title: t('nav.teaching.testimonials'), path: '/teaching/testimonials' },
      { title: t('nav.teaching.continuing'), path: '/teaching/continuing-education' },
      { title: t('nav.teaching.profdev'), path: '/teaching/professional-development' },
    ],
  },
  {
    id: 'students',
    title: t('nav.students'),
    defaultPath: '/school',
    pathPrefix: '/school',
    match: (p: string) => p === '/school' || p === '/research/students',
    subItems: [
      { title: t('nav.students.school'), path: '/school' },
      { title: t('nav.students.graduate'), path: '/research/students' },
    ],
  },
  {
    id: 'research',
    title: t('nav.research'),
    defaultPath: '/research',
    pathPrefix: '/research',
    match: (p: string) => p.startsWith('/research') && p !== '/research/students',
    subItems: [
      { title: t('nav.research.overview'), path: '/research' },
      { title: t('nav.purpose'), path: '/research/purpose' },
      { title: t('nav.research.program'), path: '/research/program' },
      { title: t('nav.research.products'), path: '/research/products' },
      { title: t('nav.research.grants'), path: '/research/grants' },
    ],
  },
  {
    id: 'institutional',
    title: t('nav.service'),
    defaultPath: '/service',
    pathPrefix: '/service',
    match: (p: string) => p.startsWith('/service'),
    subItems: [
      { title: t('nav.service.overview'), path: '/service' },
      { title: t('nav.purpose'), path: '/service/purpose' },
      { title: t('nav.service.ai'), path: '/service/augmented-intelligence' },
      { title: t('nav.service.leadership'), path: '/service/committees' },
      { title: t('nav.service.editorial'), path: '/service/editorial' },
      { title: t('nav.service.editorships'), path: '/service/editorships' },
      { title: t('nav.service.outreach'), path: '/service/outreach' },
    ],
  },
  { id: 'classroom', title: t('nav.classroom'), defaultPath: '/classroom', pathPrefix: '/classroom', match: (p: string) => p.startsWith('/classroom') },
];


export const Navbar = ({ onDownloadCv }: NavbarProps) => {
  const { t } = useI18n();
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const items = navItems(t);

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
        if (window.innerWidth >= 1280) {
            setIsMobileMenuOpen(false);
        }
    };
    window.addEventListener('resize', handleResize);

    // Close on navigation
    setIsMobileMenuOpen(false);
    setOpenMobileSubMenu(null);

    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);


  const isActive = (item: ReturnType<typeof navItems>[number]) => item.match(location.pathname);

  // El cabezal del dossier: el nombre en versales espaciadas sobre el papel plano.
  return (
    <nav ref={navRef} className="fixed top-0 w-full z-30 bg-papel-0 font-archivo text-tinta-800">
      <div className="flex items-stretch justify-between h-16">
        <Link
          to="/"
          className="flex items-center pl-4 sm:pl-6 xl:pl-8 pr-4 text-[15px] font-light uppercase tracking-[0.24em] sm:tracking-[0.42em] text-tinta-900 whitespace-nowrap hover:bg-resaltador-suave transition-colors"
        >
          Luis H. Reyes
        </Link>

        {/* Menú de escritorio: solo desde 1280 px, donde cabe completo */}
        <div className="hidden xl:flex items-stretch pr-8">
          <div className="flex items-stretch gap-1">
            {items.map((item) => {
              const active = isActive(item);
              const dropdownPositionClass = item.id === 'institutional' ? 'right-0' : 'left-0';
              return (
                <div key={item.id} className="relative flex">
                  <button
                    onClick={() => {
                      if (item.subItems) {
                        setOpenDesktopMenu(openDesktopMenu === item.id ? null : item.id);
                      } else {
                        navigate(item.defaultPath);
                        setOpenDesktopMenu(null);
                      }
                    }}
                    className={`${active ? 'text-tinta-900' : 'text-tinta-600 hover:text-tinta-900'} relative flex items-center gap-1 px-3 text-[15px] transition-colors`}
                    aria-haspopup={!!item.subItems}
                    aria-expanded={item.subItems ? openDesktopMenu === item.id : undefined}
                    aria-current={active ? 'page' : undefined}
                  >
                    {/* El activo lleva el subrayado de marcador del dossier */}
                    <span className={active ? 'underline decoration-resaltador decoration-[0.5em] underline-offset-[-0.32em] [text-decoration-skip-ink:none]' : ''}>{item.title}</span>
                    {item.subItems && <Chevron open={openDesktopMenu === item.id} />}
                  </button>
                  <AnimatePresence>
                    {item.subItems && openDesktopMenu === item.id && (
                      <motion.div
                        {...{
                          initial: { opacity: 0, y: 8 },
                          animate: { opacity: 1, y: 0 },
                          exit: { opacity: 0, y: 8 },
                          transition: { duration: 0.18 },
                        }}
                        className={`absolute top-full w-72 bg-papel-0 border-t-2 border-tinta-900 shadow-[0_18px_36px_-14px_rgba(29,29,27,0.35)] ${dropdownPositionClass}`}
                      >
                        <div className="py-2">
                          {item.subItems.map((subItem) => (
                            <button
                              key={subItem.path}
                              onClick={() => {
                                navigate(subItem.path);
                                setOpenDesktopMenu(null);
                              }}
                              className={`${location.pathname === subItem.path ? 'bg-papel-100 text-tinta-900 font-semibold' : 'text-tinta-600 hover:text-tinta-900 hover:bg-resaltador-suave'} block w-full text-left px-5 py-2.5 text-[15px] transition-colors`}
                              aria-current={location.pathname === subItem.path ? 'page' : undefined}
                            >
                              {subItem.title}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
          <LangToggle className="ml-6" />
          <button
            onClick={onDownloadCv}
            className="ml-6 flex items-center gap-2 text-[15px] text-tinta-600 hover:text-tinta-900 transition-colors"
          >
            <DownloadIcon />
            CV
          </button>
        </div>

        {/* Teléfono y tableta */}
        <div className="xl:hidden flex items-center gap-1 pr-2 sm:pr-4">
          <LangToggle className="mr-2" />
          <button
            onClick={onDownloadCv}
            className="p-2.5 text-tinta-600 hover:text-tinta-900 transition-colors"
            aria-label={t('nav.downloadCv')}
          >
            <DownloadIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={t('nav.menu')}
            className="p-2.5 text-tinta-900 hover:bg-papel-100 transition-colors"
          >
            {isMobileMenuOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Panel del menú en teléfono y tableta */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            {...{
              initial: { opacity: 0, y: -12 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: -12 },
              transition: { duration: 0.22, ease: 'easeOut' },
            }}
            className="xl:hidden absolute w-full max-h-[calc(100svh-4rem)] overflow-y-auto bg-papel-0 border-b-2 border-tinta-900"
            id="mobile-menu"
          >
            <div className="px-4 sm:px-6 py-3">
              {items.map((item) => {
                const active = isActive(item);
                return (
                  <div key={item.id}>
                    {item.subItems ? (
                      <>
                        <button
                          onClick={() => setOpenMobileSubMenu(openMobileSubMenu === item.id ? null : item.id)}
                          className={`w-full flex justify-between items-center py-3 text-lg text-tinta-900 ${active ? 'font-semibold' : ''}`}
                          aria-expanded={openMobileSubMenu === item.id}
                        >
                          <span>{item.title}</span>
                          <Chevron open={openMobileSubMenu === item.id} className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {openMobileSubMenu === item.id && (
                            <motion.div
                              {...{
                                initial: 'collapsed',
                                animate: 'open',
                                exit: 'collapsed',
                                variants: {
                                  open: { opacity: 1, height: 'auto' },
                                  collapsed: { opacity: 0, height: 0 },
                                },
                                transition: { duration: 0.25, ease: 'easeInOut' },
                              }}
                              className="overflow-hidden bg-papel-100"
                            >
                              <div className="py-1">
                                {item.subItems.map((subItem) => (
                                  <button
                                    key={subItem.path}
                                    onClick={() => navigate(subItem.path)}
                                    className={`${location.pathname === subItem.path ? 'text-tinta-900 font-semibold' : 'text-tinta-600'} block w-full text-left px-4 py-2.5 text-base`}
                                    aria-current={location.pathname === subItem.path ? 'page' : undefined}
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
                        className={`block w-full text-left py-3 text-lg text-tinta-900 ${active ? 'font-semibold' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        {item.title}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
