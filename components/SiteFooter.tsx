import React from 'react';
import { useI18n } from '../context/i18n';

const PERFILES = [
  { name: 'Google Scholar', url: 'https://scholar.google.com/citations?user=2vO8IrIAAAAJ&hl=en' },
  { name: 'ResearchGate', url: 'https://www.researchgate.net/profile/Luis-Reyes-26' },
  { name: 'LinkedIn', url: 'https://co.linkedin.com/in/luishreyes' },
];

/** Cierre del portafolio, armado como la portada del dossier: la palabra de
 *  apertura a la izquierda y, al otro lado del eje vertical, el filete que abre
 *  el bloque del nombre en versales espaciadas. */
export const SiteFooter: React.FC<{ onDownloadCv: () => void }> = ({ onDownloadCv }) => {
  const { t } = useI18n();
  return (
    <footer className="a-portada">
      <div className="a-c pt-20 pb-10 sm:pt-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <p className="a-marca" aria-hidden="true">{t('footer.wordmark')}.</p>
          <div className="lg:border-l-2 lg:border-tinta-900 lg:pl-10">
            <div className="border-t-2 border-tinta-900 pt-6">
              <p className="a-versal text-[15px] leading-[1.9] text-tinta-900">
                Luis H.<br />Reyes
              </p>
              <p className="mt-6 a-s max-w-[40ch]">{t('footer.role')}</p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <span className="a-ceja">{t('footer.contact')}</span>
                <a className="a-enlace mt-2 inline-block a-s" href="mailto:lh.reyes@uniandes.edu.co">
                  lh.reyes@uniandes.edu.co
                </a>
                <div className="mt-5">
                  <button type="button" onClick={onDownloadCv} className="a-boton">
                    {t('nav.downloadCv')}
                  </button>
                </div>
              </div>
              <div>
                <span className="a-ceja">{t('footer.profiles')}</span>
                <ul className="mt-2 space-y-1.5 a-s">
                  {PERFILES.map((p) => (
                    <li key={p.name}>
                      <a className="a-enlace" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                    </li>
                  ))}
                  <li>
                    <a className="a-enlace" href="https://photography.luishreyes.com" target="_blank" rel="noopener noreferrer">
                      {t('footer.photography')}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t-2 border-tinta-900 pt-4">
          <span className="a-meta">{t('footer.unit')} · Universidad de los Andes</span>
          <span className="a-meta">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
};
