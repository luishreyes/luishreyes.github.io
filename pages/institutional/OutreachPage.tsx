import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { outreachData, type OutreachActivity } from '../../components/data/outreach';
import { useI18n, localize, type Lang, type Localized, type UIKey } from '../../context/i18n';
import { fotos } from '../../components/data/fotos';

const MESES: Record<string, string> = {
  January: 'enero', February: 'febrero', March: 'marzo', April: 'abril', May: 'mayo', June: 'junio',
  July: 'julio', August: 'agosto', September: 'septiembre', October: 'octubre', November: 'noviembre', December: 'diciembre',
};

/** Las fechas del registro vienen en inglés («September 24», «Vol. 45, No. 3»); en español se dicen como en español. */
const fecha = (texto: string, lang: Lang) => {
  if (lang === 'en') return texto;
  let m = texto.match(/^([A-Z][a-z]+) (\d+(?:-\d+)?)$/);
  if (m && MESES[m[1]]) return `${m[2]} de ${MESES[m[1]]}`;
  if (/^[A-Z][a-z]+(-[A-Z][a-z]+)?$/.test(texto)) return texto.split('-').map((x) => MESES[x] ?? x).join('-');
  m = texto.match(/^Vol\. (\d+), No\. (\d+)$/);
  if (m) return `vol. ${m[1]}, n.º ${m[2]}`;
  m = texto.match(/^Issue (\d+)$/);
  if (m) return `n.º ${m[1]}`;
  return texto;
};

/** Las fotos que pertenecen a una entrada: el estreno del documental, el panel de ECOS, el
 *  profesor en su perfil y los egresados que firman lo que la entrada lleva al público. */
const FOTOS: { match: RegExp; src: string; alt: Localized; ancho?: boolean }[] = [
  { match: /Visionarios/, ...fotos.visionarios },
  { match: /^ECOS/, ...fotos.ecos, ancho: true },
  { match: /^Profile in Puntos/, src: '/images/site/1756469286343.jpg', alt: 'Luis H. Reyes' },
  { match: /Brayan Rodríguez/, src: '/images/students/brayan-rodriguez.jpg', alt: 'Brayan Rodríguez' },
  { match: /Becerra-Encinales/, src: '/images/students/julian-fernando-becerra-encinales.jpg', alt: 'Julián F. Becerra-Encinales' },
];

const Entrada: React.FC<{ a: OutreachActivity }> = ({ a }) => {
  const { t, lang } = useI18n();
  const texto = `${localize(a.title, 'en')} ${localize(a.description, 'en')}`;
  const persona = FOTOS.find((p) => p.match.test(texto));

  return (
    <Sube as="li">
      <span className="cuando">
        <span className="block font-semibold text-tinta-900">{a.year}</span>
        {fecha(a.date, lang)}
      </span>
      <div className={persona ? `sm:grid sm:gap-10 ${persona.ancho ? 'sm:grid-cols-[minmax(0,1fr)_260px]' : 'sm:grid-cols-[minmax(0,1fr)_180px]'}` : undefined}>
        <div>
          <p className="que">{localize(a.title, lang)}</p>
          <p className="donde">
            {localize(a.location, lang)} · {t(`outreach.type.${a.type}` as UIKey)}
          </p>
          <p className="detalle a-texto">{localize(a.description, lang)}</p>
          {a.url && (
            <p className="mt-6 pb-8">
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="a-boton">
                {t('outreach.watchShort')} <span aria-hidden="true">↗</span>
              </a>
            </p>
          )}
        </div>
        {persona && (
          <img
            src={persona.src}
            alt={localize(persona.alt, lang)}
            loading="lazy"
            className={`mt-6 sm:mt-1 sm:w-full object-cover object-top a-bn ${persona.ancho ? 'w-[260px] aspect-[4/3]' : 'w-[150px] aspect-[4/5]'}`}
          />
        )}
      </div>
    </Sube>
  );
};

export const OutreachPage: React.FC = () => {
  const { t, lang } = useI18n();
  const prensa = outreachData.filter((a) => a.type === 'Media Feature');
  const eventos = outreachData.filter((a) => a.type !== 'Media Feature');
  const episodio = outreachData.find((a) => a.url);

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('outreach.title')}
        entrada={<p>{t('outreach.sub')}</p>}
        accion={episodio?.url ? { href: episodio.url, label: t('outreach.watch') } : undefined}
        foto={{ src: fotos.scoutingPlanta.src, alt: localize(fotos.scoutingPlanta.alt, lang), posicion: '50% 45%' }}
      />

      {/* ── En la prensa y en pantalla ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3">{t('outreach.press.title')}</h2></Sube>
          <Sube delay={0.06}><p className="mt-6 a-texto">{t('outreach.press.lead')}</p></Sube>
          <ul className="a-registro !mt-8">
            {prensa.map((a, i) => <Entrada key={`${a.year}-${i}`} a={a} />)}
          </ul>
        </div>
      </section>

      {/* ── En colegios, ferias y en el campus ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <Sube><h2 className="a-h3">{t('outreach.events.title')}</h2></Sube>
              <Sube delay={0.06}><p className="mt-6 a-texto">{t('outreach.events.lead')}</p></Sube>
            </div>
            <Sube delay={0.1} className="overflow-hidden aspect-[16/9]">
              <img src={fotos.scoutingSelfie.src} alt={localize(fotos.scoutingSelfie.alt, lang)} loading="lazy" className="a-foto" style={{ objectPosition: '50% 40%' }} />
            </Sube>
          </div>
          <ul className="a-registro !mt-12">
            {eventos.map((a, i) => <Entrada key={`${a.year}-${i}`} a={a} />)}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
