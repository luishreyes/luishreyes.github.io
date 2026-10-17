import React from 'react';
import { useI18n } from '../context/i18n';

const PERFILES = [
  { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=2vO8IrIAAAAJ&hl=en' },
  { name: 'ResearchGate', url: 'https://www.researchgate.net/profile/Luis-Reyes-26' },
  { name: 'LinkedIn', url: 'https://co.linkedin.com/in/luishreyes' },
];

/** Cierre del portafolio: el nombre vuelve a todo el ancho sobre azul noche. */
export const SiteFooter: React.FC<{ onDownloadCv: () => void }> = ({ onDownloadCv }) => {
  const { t } = useI18n();
  return (
    <footer className="a-hondo">
      <div className="a-c pt-24 pb-12 sm:pt-32">
        <p className="a-h1 text-andes-yellow" aria-hidden="true">Luis H. Reyes.</p>
        <div className="mt-12 grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <p className="max-w-[38ch]">{t('footer.role')}</p>
          <div>
            <p className="a-s a-sec">{t('footer.contact')}</p>
            <a className="a-enlace mt-2 inline-block" href="mailto:lh.reyes@uniandes.edu.co">
              lh.reyes@uniandes.edu.co
            </a>
            <div className="mt-6">
              <button type="button" onClick={onDownloadCv} className="a-boton">
                {t('nav.downloadCv')}
              </button>
            </div>
          </div>
          <div>
            <p className="a-s a-sec">{t('footer.profiles')}</p>
            <ul className="mt-2 space-y-2">
              {PERFILES.map((p) => (
                <li key={p.name}>
                  <a className="a-enlace" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                </li>
              ))}
              <li>
                <a className="a-enlace" href="https://luishreyes.myportfolio.com" target="_blank" rel="noopener noreferrer">
                  {t('footer.photography')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="a-s a-sec mt-20">© {new Date().getFullYear()} Luis H. Reyes</p>
      </div>
    </footer>
  );
};
