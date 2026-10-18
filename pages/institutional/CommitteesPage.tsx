import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { CommitteeCard } from '../../components/CommitteeCard';
import { useI18n, fill, localize } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';
import { committeesData, leadershipRolesData } from '../../components/data/institutional';
import type { Committee } from '../../types';

const ESTE_ANIO = new Date().getFullYear();
const vigente = (c: Committee) => c.endYear === 'Present' || (typeof c.endYear === 'number' && c.endYear >= ESTE_ANIO);
const fin = (c: Committee) => (c.endYear === 'Present' ? Infinity : c.endYear ?? c.startYear);

export const CommitteesPage: React.FC = () => {
  const { t, lang } = useI18n();

  // La iniciativa de IA tiene su propia página; aquí queda en el registro, ya cerrada.
  const iniciativa: Committee = {
    title: { en: t('committees.ai.title'), es: t('committees.ai.title') },
    role: { en: t('committees.ai.role'), es: t('committees.ai.role') },
    startYear: 2024,
    endYear: 2026,
    level: 'Faculty',
    description: [{ en: t('committees.ai.desc'), es: t('committees.ai.desc') }],
  };

  const todos = [...leadershipRolesData, ...committeesData];
  const actuales = todos.filter(vigente).sort((a, b) => b.startYear - a.startYear);
  const anteriores = [...todos.filter((c) => !vigente(c)), iniciativa].sort(
    (a, b) => fin(b) - fin(a) || b.startYear - a.startYear,
  );
  const primero = Math.min(...todos.map((c) => c.startYear));

  // Las fotos van con el cargo al que pertenecen, y solo con ese.
  const foto = (f: { src: string; alt: { en: string; es: string } | string }) => ({ src: f.src, alt: localize(f.alt, lang) });
  const fotosDe = (c: Committee) => {
    const titulo = typeof c.title === 'string' ? c.title : c.title.en;
    if (titulo.includes('Academia Joven')) return [foto(fotos.academiaJoven)];
    if (titulo.includes('AIChE Student Chapter')) return [foto(fotos.fenomenosTransporte), foto(fotos.chemECar)];
    return undefined;
  };

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('committees.title')}
        entrada={<p>{fill(t('committees.sub'), { first: primero })}</p>}
        foto={{ src: '/images/uniandes-bw.jpg', alt: t('service.img.building'), posicion: '62% 50%' }}
      />

      {/* ── Lo vigente, abierto ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('committees.current')}</h2></Sube>
          <ul className="a-registro !mt-8">
            {actuales.map((c) => (
              <CommitteeCard key={`${c.startYear}-${typeof c.title === 'string' ? c.title : c.title.en}`} committee={c} fotos={fotosDe(c)} open />
            ))}
          </ul>
        </div>
      </section>

      {/* ── Lo anterior, compacto ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('committees.past')}</h2></Sube>
          <ul className="a-registro !mt-8">
            {anteriores.map((c) => (
              <CommitteeCard
                key={`${c.startYear}-${typeof c.title === 'string' ? c.title : c.title.en}`}
                committee={c}
                fotos={fotosDe(c)}
                link={c === iniciativa ? { to: '/service/augmented-intelligence', label: t('committees.learnMore') } : undefined}
              />
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
