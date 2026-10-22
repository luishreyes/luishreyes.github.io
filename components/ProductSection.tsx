import React, { useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '../types';
import { researchLinesMap } from './data/research';
import { useI18n, localize, fill, type UIKey } from '../context/i18n';
import { SALE } from './Sube';

interface ProductSectionProps {
  product: Product;
  citationCount: number | null;
  /** Portada local del libro, cuando existe (public/images/books). */
  cover?: string;
  /** Con la lista ordenada por citas no hay grupos por año: el año va en la ficha. */
  showYear?: boolean;
}

const ME = 'Luis H. Reyes';
const esDoi = (id: string) => /^10\.\d{4,9}\//.test(id);
const esIsbn = (id: string) => /^97[89][-\d]{10,14}$/.test(id.replace(/\s/g, ''));
const esAsin = (id: string) => /^B0[A-Z0-9]{8}$/.test(id);
// Algunas fichas viejas guardan un enlace de relleno (example.com): no se muestra.
const enlaceReal = (url?: string) => (url && /^https?:\/\//.test(url) && !/\/\/(www\.)?example\.com/.test(url) ? url : null);
const mismoDestino = (a: string, b: string) => a.replace(/^https?:\/\/(dx\.)?/, '') === b.replace(/^https?:\/\/(dx\.)?/, '');

/** Una ficha de producto en una línea: título, tipo y revista, citas. El resumen,
 *  los autores y los enlaces se abren a pedido. */
export const ProductSection = ({ product, citationCount, cover, showYear = false }: ProductSectionProps) => {
  const [open, setOpen] = useState(false);
  const { t, lang } = useI18n();
  const id = useId();

  const tipo = t(`products.type.${product.type}` as UIKey) ?? product.type;
  const ano = product.publicationDate.slice(0, 4);
  const citas =
    citationCount && citationCount > 0
      ? citationCount === 1
        ? t('products.citations.one')
        : fill(t('products.citations.many'), { n: citationCount.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US') })
      : null;
  const meta = [tipo, product.publicationVenue, product.status, showYear ? ano : null].filter(Boolean).join(' · ');

  // El identificador se nombra por lo que es: solo un DOI enlaza a doi.org.
  const ident = product.doi ?? '';
  const registro = enlaceReal(product.url);
  let identificador: React.ReactNode = null;
  let registroExtra = registro;
  if (esDoi(ident)) {
    const href = `https://doi.org/${ident}`;
    identificador = (
      <a href={href} target="_blank" rel="noopener noreferrer" className="a-enlace">
        DOI {ident} <span aria-hidden="true">↗</span>
      </a>
    );
    if (registro && mismoDestino(registro, href)) registroExtra = null;
  } else if (product.type === 'Patent') {
    identificador = `${t('products.id.patent')} ${ident}`;
  } else if (esIsbn(ident)) {
    identificador = `ISBN ${ident}`;
  } else if (esAsin(ident)) {
    identificador = `${t('products.id.asin')} ${ident}`;
  }

  const lineas = (product.researchAreas ?? []).map((a) => localize(researchLinesMap[a]?.title ?? a, lang));

  return (
    <div className={cover ? 'grid grid-cols-[5.5rem_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)] gap-x-5 sm:gap-x-8' : ''}>
      {cover && (
        <img
          src={cover}
          alt={`${t('products.cover.alt')} ${product.title}`}
          className="mt-5 w-full aspect-[7/10] object-cover"
        />
      )}
      <div className="min-w-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={id}
          className="group w-full text-left grid grid-cols-[minmax(0,1fr)_auto] gap-x-6 py-5 px-1 transition-colors duration-200 [@media(hover:hover)]:hover:bg-resaltador-suave"
        >
          <span className="font-semibold leading-snug text-tinta-900 max-w-[70ch]">{product.title}</span>
          <span className="row-span-2 flex items-start gap-3 pt-0.5">
            {citas && <span className="hidden sm:inline a-meta whitespace-nowrap">{citas}</span>}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={`mt-0.5 h-5 w-5 flex-none text-tinta-900 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </span>
          <span className="a-meta mt-1.5 max-w-[64ch]">
            {meta}
            {citas && <span className="sm:hidden"> · {citas}</span>}
          </span>
          <span className="sr-only">{open ? t('products.details.hide') : t('products.details.show')}</span>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={id}
              key="detalle"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: SALE }}
              className="overflow-hidden"
            >
              <div className="grid gap-x-12 gap-y-8 pb-8 pt-2 px-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {product.laymanSummary.length > 0 && (
                  <div>
                    <p className="a-s text-tinta-600">{t('products.summary')}</p>
                    <div className="mt-3 space-y-5">
                      {product.laymanSummary.map((item, i) => (
                        <div key={i}>
                          <p className="font-semibold text-tinta-900">{localize(item.question, lang)}</p>
                          <p className="mt-1 a-texto text-tinta-800">{localize(item.answer, lang)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="a-s space-y-5 text-tinta-800">
                  <div>
                    <p className="text-tinta-600">{t('products.authors')}</p>
                    <p className="mt-1">
                      {product.authors.map((autor, i) => (
                        <React.Fragment key={i}>
                          {autor === ME ? <strong className="font-semibold text-tinta-900">{autor}</strong> : autor}
                          {i < product.authors.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))}
                    </p>
                  </div>
                  {lineas.length > 0 && (
                    <div>
                      <p className="text-tinta-600">{t('products.lines')}</p>
                      <p className="mt-1">{lineas.join(' · ')}</p>
                    </div>
                  )}
                  {product.keywords.length > 0 && (
                    <div>
                      <p className="text-tinta-600">{t('products.keywords')}</p>
                      <p className="mt-1">{product.keywords.join(', ')}</p>
                    </div>
                  )}
                  {(identificador || registroExtra) && (
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {identificador && <span>{identificador}</span>}
                      {registroExtra && (
                        <a href={registroExtra} target="_blank" rel="noopener noreferrer" className="a-enlace">
                          {t('products.record')} <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
