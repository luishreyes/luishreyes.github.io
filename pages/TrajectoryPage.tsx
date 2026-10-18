import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { useI18n, localize } from '../context/i18n';
import { educationData, specializationsData, credentialsData } from '../components/data/education';
import { workExperienceData } from '../components/data/experience';

/** Trayectoria: lo que antes vivía en la portada (formación, experiencia, cursos y
 *  certificados), en registros con el año en su columna. El relato por tramos del
 *  portafolio docente entra aquí cuando esté adaptado. */
export const TrajectoryPage: React.FC = () => {
  const { t, lang } = useI18n();
  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('trajectory.title')}
        entrada={t('trajectory.intro')}
        foto={{ src: '/images/site/1756469286343.jpg', alt: t('home.portrait.alt'), posicion: 'center 20%' }}
        accion={{ label: t('nav.downloadCv'), onClick: () => window.dispatchEvent(new Event('lhr:descargar-cv')) }}
      />

      <section className="a-papel pb-20 sm:pb-28">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('about.education.title')}.</h2></Sube>
          <ul className="a-registro mt-6">
            {educationData.map((e) => (
              <Sube as="li" key={e.institution}>
                <span className="cuando">{e.year}</span>
                <div>
                  <p className="que">{localize(e.degree, lang)}, {localize(e.field, lang)}</p>
                  <p className="donde">{e.institution} · {e.location}</p>
                </div>
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('about.experience.title')}.</h2></Sube>
          <ul className="a-registro mt-6">
            {workExperienceData.map((w) => (
              <Sube as="li" key={`${w.company}-${w.period}`}>
                <span className="cuando">{w.period}</span>
                <div>
                  <p className="que">{localize(w.role, lang)}</p>
                  <p className="donde">{w.company} · {w.location}</p>
                </div>
              </Sube>
            ))}
          </ul>
          {/* La Universidad de los Andes, donde trabaja desde 2017 */}
          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            {[
              '/images/uniandes-bw.jpg',
              '/images/site/campus-mision-historia-y-simbolos-0.webp',
              '/images/site/generales-campus-2015-2015-69.jpg',
            ].map((src, i) => (
              <Sube key={src} delay={0.06 * i}>
                <img src={src} alt="Universidad de los Andes" loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
              </Sube>
            ))}
          </div>
          <p className="a-pie">Universidad de los Andes, Bogotá.</p>
        </div>
      </section>

      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('about.continuing.title')}.</h2></Sube>
          <ul className="a-registro mt-6">
            {specializationsData.map((s) => (
              <Sube as="li" key={s.title}>
                <span className="cuando">{s.date}</span>
                <div>
                  <p className="que">{s.title}</p>
                  <p className="donde">{s.institution}</p>
                  <p className="detalle">{s.description}</p>
                  {s.skills.length > 0 && <p className="detalle">{s.skills.join(' · ')}</p>}
                </div>
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('about.licenses.title')}.</h2></Sube>
          <ul className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 border-t-2 border-tinta-900 pt-8">
            {credentialsData.map((c) => (
              <li key={`${c.title}-${c.issuer}`}>
                <p className="text-tinta-900 leading-snug">{c.title}</p>
                <p className="mt-1 text-tinta-700">{c.issuer} · {c.date.replace(/^Issued\s+/, '')}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
