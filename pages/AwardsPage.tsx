import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina, Cabecera } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { awardsData } from '../components/data/awards';
import { graduatedStudentsData } from '../components/data/students';
import { committeesData } from '../components/data/institutional';
import { fotos, type Foto } from '../components/data/fotos';
import { useI18n, localize, type Lang } from '../context/i18n';
import type { Recognition, GraduatedStudent, Committee } from '../types';

// El premio que encabeza la página, las dos distinciones nacionales de 2023 (van juntas y con
// el mismo peso) y el resto como registro. Todo sale de awards.ts.
const AICHE = 'AIChE Education Division';
const NACIONALES = ['National Academy of Medicine of Colombia', 'Fundación Alejandro Ángel Escobar'];
const FOTO_NACIONAL: Record<string, Foto> = {
  'National Academy of Medicine of Colombia': fotos.academiaMedicina,
  'Fundación Alejandro Ángel Escobar': fotos.angelEscobar,
};
// Coautores del grupo en el trabajo de 2023, con su ficha de egresado.
const COAUTORES = ['Andrés Felipe Leal', 'Carlos Emilio Torres Garay', 'Valentina Quezada Pérez', 'Saúl Camilo Gómez Tinoco'];

const autores = (a: Recognition) =>
  a.authors.map((autor, i) => (
    <React.Fragment key={autor}>
      {autor.includes('Reyes') ? <strong className="font-semibold text-tinta-900">{autor}</strong> : autor}
      {i < a.authors.length - 1 ? ', ' : ''}
    </React.Fragment>
  ));

const Fuente: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="a-enlace">
    {label} <span aria-hidden="true">↗</span>
  </a>
);

/** Una de las dos distinciones nacionales de 2023: las dos llevan la misma forma. */
const Nacional: React.FC<{ a: Recognition; foto?: Foto; lang: Lang; delay: number }> = ({ a, foto, lang, delay }) => {
  const { t } = useI18n();
  return (
    <Sube delay={delay}>
      <article>
        {foto && (
          <figure className="mb-8">
            <img src={foto.src} alt={localize(foto.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
            <figcaption className="a-pie">{localize(foto.alt, lang)}</figcaption>
          </figure>
        )}
        <h3 className="a-h3">{localize(a.title, lang)}</h3>
        <p className="a-meta mt-3">{localize(a.awarder, lang)} · {localize(a.category, lang)} · {a.year}</p>
        <div className="mt-6 space-y-4">
          {a.summary.map((p, i) => <p key={i} className="a-texto">{localize(p, lang)}</p>)}
        </div>
        <p className="a-s mt-6 text-tinta-700 max-w-[64ch]">{t('awards.authors')} {autores(a)}</p>
        <p className="mt-6"><Fuente href={a.url} label={t('awards.source')} /></p>
      </article>
    </Sube>
  );
};

export const AwardsPage: React.FC = () => {
  const { t, lang } = useI18n();
  const aiche = awardsData.find((a) => localize(a.awarder, 'en') === AICHE);
  const nacionales = NACIONALES.map((n) => awardsData.find((a) => localize(a.awarder, 'en') === n)).filter((a): a is Recognition => Boolean(a));
  const otros = awardsData.filter((a) => a !== aiche && !nacionales.includes(a)).sort((x, y) => y.year - x.year);
  // La Academia Joven de Colombia no es un premio sino un ingreso por méritos: viene de los
  // comités (institutional.ts) y entra al registro con su año.
  const academia = committeesData.find((c: Committee) => localize(c.title, 'en') === 'Academia Joven de Colombia');
  const filas = [
    ...otros.map((a) => ({
      clave: a.url + a.year,
      year: a.year,
      titulo: localize(a.title, lang),
      donde: `${localize(a.awarder, lang)} · ${localize(a.category, lang)}`,
      linea: `${t('awards.work')} ${a.projectTitle}`,
      mas: a.summary.map((p) => localize(p, lang)),
      autores: a.authors.length > 1 ? <p className="a-s text-tinta-700 max-w-[64ch]">{t('awards.authors')} {autores(a)}</p> : null,
      url: a.url,
    })),
    ...(academia
      ? [{
          clave: 'academia-joven',
          year: academia.startYear,
          titulo: localize(academia.title, lang),
          donde: `${academia.role ? localize(academia.role, lang) : ''} · ${t('awards.academia.since')} ${academia.startYear}`,
          // Sin enlace de fuente: su descripción entera va a la vista, sin «Más detalles».
          linea: academia.description.map((p) => localize(p, lang)).join(' '),
          mas: [] as string[],
          autores: null,
          url: '',
        }]
      : []),
  ].sort((x, y) => y.year - x.year);
  const todos = [...graduatedStudentsData.phd, ...graduatedStudentsData.ms];
  const coautores = COAUTORES.map((n) => todos.find((g) => g.name === n)).filter((g): g is GraduatedStudent => Boolean(g));

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('awards.title')}
        entrada={<p>{t('awards.subtitle')}</p>}
        accion={{ to: '/teaching/unit-ops', label: t('awards.cta') }}
      />

      {/* ── El premio de AIChE: su propio bloque, con el peso que tiene ── */}
      {aiche && (
        <section className="a-oscuro a-campo">
          <div className="a-c">
            <Sube>
              <h2 className="text-[length:var(--t-l)] md:text-[length:var(--t-titulo)] leading-[1.04] tracking-[-.04em] font-bold text-white lg:max-w-[24ch]">
                {localize(aiche.title, lang)}
              </h2>
            </Sube>
            <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
              <div>
                <Sube delay={0.06}>
                  <p className="a-entrada max-w-[40ch]">{t('awards.lead.first')}</p>
                  <p className="a-meta mt-5">{localize(aiche.awarder, lang)} · {aiche.year}</p>
                </Sube>
                <div className="mt-10 space-y-4">
                  {aiche.summary.map((p, i) => (
                    <Sube key={i} delay={0.04 * i}><p className="a-texto">{localize(p, lang)}</p></Sube>
                  ))}
                </div>
                <Sube className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <Link to="/teaching/unit-ops" className="a-boton">
                    {t('awards.lead.course')} <span aria-hidden="true">→</span>
                  </Link>
                  <Fuente href={aiche.url} label={t('awards.lead.page')} />
                </Sube>
              </div>
              <Sube delay={0.12} className="lg:sticky lg:top-28 lg:self-start">
                <figure>
                  <img src={fotos.cursoGrupo.src} alt={localize(fotos.cursoGrupo.alt, lang)} className="a-bn w-full aspect-[4/3] object-cover" />
                  <figcaption className="a-pie !text-tinta-300">{localize(fotos.cursoGrupo.alt, lang)}</figcaption>
                </figure>
              </Sube>
            </div>
          </div>
        </section>
      )}

      {/* ── Las dos distinciones nacionales de 2023, juntas y con el mismo peso ── */}
      {nacionales.length > 0 && (
        <section className="a-hundido a-campo">
          <div className="a-c">
            <Sube><Cabecera titulo={t('awards.national.title')} /></Sube>
            <Sube delay={0.06}>
              <p className="a-entrada mt-8 max-w-[52ch]">{nacionales[0].projectTitle}</p>
            </Sube>
            <div className="mt-14 grid gap-14 md:grid-cols-2 md:gap-12">
              {nacionales.map((a, i) => <Nacional key={a.url} a={a} foto={FOTO_NACIONAL[localize(a.awarder, 'en')]} lang={lang} delay={0.06 * i} />)}
            </div>
            <ul className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {coautores.map((g, i) => (
                <Sube as="li" key={g.name} delay={0.06 * i}>
                  <img src={g.imageUrl} alt={g.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                  <p className="mt-4 font-semibold leading-tight text-tinta-900">{g.name}</p>
                  <p className="a-meta mt-1">{g.program ? localize(g.program, lang) : g.degree} · {g.graduationYear}</p>
                </Sube>
              ))}
            </ul>
            <Sube><p className="a-pie mt-10">{t('awards.national.coauthors')}</p></Sube>
          </div>
        </section>
      )}

      {/* ── El resto, como registro: año, distinción, quién la da y el trabajo; al margen, la Academia Joven ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('awards.others')} /></Sube>
          <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
            <ul className="a-registro !border-t-0 mt-2">
              {filas.map((f, i) => (
                <Sube as="li" key={f.clave} delay={0.04 * i}>
                  <span className="cuando">{f.year}</span>
                  <div>
                    <h3 className="que">{f.titulo}</h3>
                    <p className="donde">{f.donde}</p>
                    <p className="detalle a-texto">{f.linea}</p>
                    {f.mas.length > 0 && (
                      <details className="mt-4">
                        <summary className="a-s cursor-pointer text-tinta-900 underline underline-offset-4 w-fit">{t('awards.more')}</summary>
                        <div className="mt-4 space-y-3">
                          {f.mas.map((p, j) => <p key={j} className="a-texto">{p}</p>)}
                          {f.autores}
                        </div>
                      </details>
                    )}
                    {f.url && <p className="mt-4 a-s"><Fuente href={f.url} label={t('awards.source')} /></p>}
                  </div>
                </Sube>
              ))}
            </ul>
            {academia && (
              <Sube delay={0.1} className="lg:sticky lg:top-28 lg:self-start lg:mt-8">
                <figure>
                  <img src={fotos.academiaJoven.src} alt={localize(fotos.academiaJoven.alt, lang)} loading="lazy" className="a-bn w-full aspect-square object-cover object-top" />
                  <figcaption className="a-pie">{localize(fotos.academiaJoven.alt, lang)}</figcaption>
                </figure>
              </Sube>
            )}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};
