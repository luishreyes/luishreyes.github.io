import React from 'react';
import type { EditedBook } from './data/editorships';
import { useI18n } from '../context/i18n';

/**
 * La portada de un libro editado. Mientras la editorial no tenga la definitiva (un libro en
 * prensa), va un bloque de papel con el título y el estado, del mismo formato que una portada.
 * El bloque es decorativo: el título y el estado ya están en el texto de al lado.
 */
export const PortadaLibro: React.FC<{ book: EditedBook; alt: string; className?: string }> = ({ book, alt, className = '' }) => {
  const { t } = useI18n();
  if (book.cover) return <img src={book.cover} alt={alt} loading="lazy" className={className} />;
  const [titulo] = book.title.split(/:\s+/, 2);
  return (
    <div aria-hidden="true" className={`${className} a-portada aspect-[7/10] flex flex-col justify-between gap-3 p-3 sm:p-4`}>
      <span className="a-s font-semibold leading-[1.25] tracking-[-0.01em] text-tinta-900 [text-wrap:balance]">{titulo}</span>
      <span className="a-meta"><span className="a-resaltado">{t('editorships.inPress')}</span></span>
    </div>
  );
};
