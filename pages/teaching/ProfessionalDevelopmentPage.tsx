import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, fill, type UIKey } from '../../context/i18n';
import { professionalDevelopmentData } from '../../components/data/professionalDevelopment';
import { fotos } from '../../components/data/fotos';

// Las actividades que fueron en la propia universidad, contadas desde el registro.
const enUniandes = professionalDevelopmentData.filter((a) =>
  localize(a.institution, 'en').includes('Universidad de los Andes'),
).length;

const CAMPUS: { src: string; alt: UIKey }[] = [
  { src: '/images/site/campus-mision-historia-y-simbolos-0.webp', alt: 'profdev.place.alt1' },
  { src: '/images/site/generales-campus-2015-2015-69.jpg', alt: 'profdev.place.alt2' },
  { src: '/images/uniandes-bw.jpg', alt: 'profdev.place.alt3' },
];

export const ProfessionalDevelopmentPage = () => {
  const { t, lang } = useI18n();
  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('profdev.title')}
        entrada={
          <>
            <p>{t('profdev.lead')}</p>
            <p className="mt-6 text-[18px] leading-[1.55] font-normal text-tinta-800">{t('profdev.sub')}</p>
          </>
        }
        accion={{ to: '/teaching/scholarship', label: t('profdev.cta') }}
        foto={{ src: fotos.disenoCursos.src, alt: localize(fotos.disenoCursos.alt, lang), posicion: fotos.disenoCursos.foco }}
      />

      {/* ── El registro, año por año ── */}
      <section className="a-papel pt-10 sm:pt-14 pb-24 sm:pb-32">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-8">{t('profdev.record.title')}.</h2></Sube>
          <ol className="a-registro">
            {professionalDevelopmentData.map((a, i) => (
              <Sube as="li" key={`${a.period}-${i}`} delay={0.03 * (i % 4)}>
                <span className="cuando">{a.period.replace('-', '–')}</span>
                <div>
                  <p className="que">{localize(a.title, lang)}</p>
                  {a.institution && <p className="donde">{localize(a.institution, lang)}</p>}
                  <p className="detalle text-tinta-800">{localize(a.description, lang)}</p>
                  {a.details && (
                    <ul className="detalle list-disc pl-5 space-y-2 text-tinta-800 marker:text-tinta-500">
                      {a.details.map((d, k) => <li key={k}>{localize(d, lang)}</li>)}
                    </ul>
                  )}
                </div>
              </Sube>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Donde fue la mayor parte ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('profdev.place.title')}.</h2></Sube>
          <Sube delay={0.04}>
            <p className="mt-4 a-texto">{fill(t('profdev.place.text'), { n: enUniandes, total: professionalDevelopmentData.length })}</p>
          </Sube>
          <div className="mt-12 grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <Sube className="md:row-span-2">
              <figure className="h-full">
                <div className="overflow-hidden aspect-[4/3] md:aspect-auto md:h-full">
                  <img src={CAMPUS[0].src} alt={t(CAMPUS[0].alt)} loading="lazy" className="a-foto a-bn" />
                </div>
              </figure>
            </Sube>
            {CAMPUS.slice(1).map((c, i) => (
              <Sube key={c.src} delay={0.08 * (i + 1)}>
                <figure>
                  <div className="overflow-hidden aspect-[16/10]">
                    <img src={c.src} alt={t(c.alt)} loading="lazy" className="a-foto a-bn" />
                  </div>
                </figure>
              </Sube>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
