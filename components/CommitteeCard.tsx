import React from 'react';
import { Link } from 'react-router-dom';
import type { Committee } from '../types';
import { useI18n, localize, fill, type UIKey } from '../context/i18n';
import { Sube } from './Sube';

const NIVEL: Record<NonNullable<Committee['level']>, UIKey> = {
  National: 'committees.national',
  University: 'committees.university',
  Faculty: 'committees.faculty',
  Department: 'committees.department',
};

/** Los años del cargo: uno solo si empezó y terminó el mismo año. */
export const useAnios = () => {
  const { t } = useI18n();
  return (c: Pick<Committee, 'startYear' | 'endYear'>) => {
    if (c.endYear === 'Present') return fill(t('committees.since'), { year: c.startYear });
    if (!c.endYear || c.endYear === c.startYear) return String(c.startYear);
    return `${c.startYear}–${c.endYear}`;
  };
};

/** Una fila del registro de cargos: años · comité · papel. Los vigentes muestran todo
 *  lo que hacen; los anteriores guardan el detalle en un desplegable nativo. */
export const CommitteeCard: React.FC<{
  committee: Committee;
  open?: boolean;
  link?: { to: string; label: string };
  /** Fotos del cargo, cuando las hay (el capítulo de AIChE, la Academia Joven). */
  fotos?: { src: string; alt: string }[];
}> = ({ committee, open = false, link, fotos = [] }) => {
  const { t, lang } = useI18n();
  const anios = useAnios();
  const donde = [
    committee.role ? localize(committee.role, lang) : null,
    committee.level ? t(NIVEL[committee.level]) : null,
  ].filter(Boolean).join(' · ');

  const detalle = (
    <>
      {committee.description.map((p, i) => (
        <p key={i} className="a-texto">{localize(p, lang)}</p>
      ))}
      {link && (
        <p className="mt-4">
          <Link to={link.to} className="a-enlace">{link.label} <span aria-hidden="true">→</span></Link>
        </p>
      )}
    </>
  );

  return (
    <Sube as="li">
      <span className="cuando">{anios(committee)}</span>
      {/* Abiertos, la foto va al lado del texto; compactos, en fila debajo, para no dejar un hueco. */}
      <div className={fotos.length && open ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12' : undefined}>
        <div>
          <p className="que">{localize(committee.title, lang)}</p>
          {donde && <p className="donde">{donde}</p>}
          {committee.description.length > 0 && (open ? (
            // Lo vigente se lee en dos columnas a lo ancho cuando no hay foto al lado.
            <div className={fotos.length ? 'detalle' : 'detalle lg:!max-w-none lg:columns-2 lg:gap-12 [&_p]:break-inside-avoid-column'}>{detalle}</div>
          ) : (
            <details className="group mt-3">
              <summary className="inline-flex items-center gap-2 cursor-pointer list-none text-tinta-900 underline underline-offset-[3px] decoration-1 hover:bg-resaltador-suave [&::-webkit-details-marker]:hidden">
                {t('committees.more')}
                <span aria-hidden="true" className="inline-block transition-transform duration-200 group-open:rotate-90">→</span>
              </summary>
              <div className="mt-4 max-w-[64ch]">{detalle}</div>
            </details>
          ))}
        </div>
        {fotos.length > 0 && (
          <div className={open ? 'mt-6 lg:mt-1 grid grid-cols-2 lg:grid-cols-1 gap-3 max-w-[420px]' : 'mt-6 grid grid-cols-2 gap-3 sm:gap-4 max-w-[600px]'}>
            {fotos.map((f) => (
              <img key={f.src} src={f.src} alt={f.alt} loading="lazy" className="block w-full aspect-[3/2] object-cover" />
            ))}
          </div>
        )}
      </div>
    </Sube>
  );
};
