import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/PageWrapper';
import { StatsSection } from '../components/StatsSection';
import { Sube } from '../components/Sube';
import { Apertura, Cabecera } from '../components/Apertura';
import { useI18n, localize, fill, type UIKey } from '../context/i18n';
import { metrics } from '../components/data/metrics';
import { graduatedStudentsData, studentsData } from '../components/data/students';
import { fotos } from '../components/data/fotos';
import { BarrasPorAno, type Serie } from '../components/ProductsOverTimeChart';
import { lineas2020, lineasNuevas, type LineaHoy } from '../components/data/researchLines2020';
import { scholar, publications, publicationsPerYear, SCHOLAR_URL, esPublicacion, webOfScience, authorship } from '../components/data/citations';
import { useAppData } from '../context/AppDataContext';
import { ResearchNetworkMap } from '../components/ResearchNetworkMap';

/** Texto con nombres de especies entre asteriscos, en cursiva. */
const Cursiva: React.FC<{ texto: string }> = ({ texto }) => (
  <>{texto.split('*').map((trozo, i) => (i % 2 ? <i key={i}>{trozo}</i> : <React.Fragment key={i}>{trozo}</React.Fragment>))}</>
);

const fecha = (iso: string, lang: 'en' | 'es') =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

export const ResearchOverviewPage: React.FC = () => {
  const { products } = useAppData();
  const { t, lang } = useI18n();
  const doctores = graduatedStudentsData.phd;
  const numero = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');

  const stats = [
    { label: t('rc.fig.pubs'), value: publications.total, note: t('rc.fig.pubs.note') },
    { label: t('rc.fig.q'), value: `${publications.q1 + publications.q2}/${publications.articles}`, note: t('rc.fig.q.note') },
    { label: t('rc.fig.cites'), value: scholar.citations, note: fill(t('rc.fig.cites.note'), { date: fecha(scholar.asOf, lang) }) },
    { label: fill(t('rc.fig.h'), { i10: scholar.i10Index }), value: scholar.hIndex, note: fill(t('rc.fig.cites.note'), { date: fecha(scholar.asOf, lang) }) },
    { label: t('rc.fig.senior.label'), value: t('rc.fig.senior'), note: t('rc.fig.senior.note') },
  ];

  const seriesPub: Serie[] = [
    { key: 'articles', label: t('rc.class.articles'), uno: t('rc.class.articles.one'), color: '#1D1D1B' },
    { key: 'chapters', label: t('rc.class.chapters'), uno: t('rc.class.chapters.one'), color: '#5E5E61' },
    { key: 'books', label: t('rc.class.books'), uno: t('rc.class.books.one'), color: '#8E8E92' },
    { key: 'other', label: t('rc.class.other'), uno: t('rc.class.other.one'), color: '#BDBDC1' },
  ];
  const citas = useMemo(
    () => Object.fromEntries(Object.entries(scholar.perYear).map(([a, v]) => [a, { cites: v }])) as Record<number, Record<string, number>>,
    [],
  );
  const conteo = useMemo(() => ({
    pubs: products.filter(esPublicacion).length || publications.total,
    patents: products.filter((p) => p.type === 'Patent').length || publications.patents,
    talks: products.filter((p) => p.type === 'Conference').length,
  }), [products]);

  const interiores = [
    { to: '/research/purpose', q: t('nav.purpose'), d: t('rc.more.purpose') },
    { to: '/research/program', q: t('nav.research.program'), d: t('rc.more.program') },
    { to: '/research/products', q: t('nav.research.products'), d: fill(t('rc.more.products'), conteo) },
    { to: '/research/grants', q: t('nav.research.grants'), d: fill(t('rc.more.grants'), { n: metrics.research.grants, active: metrics.research.activeGrants }) },
    {
      to: '/research/students',
      q: t('students.title'),
      d: fill(t('rc.more.students'), {
        grad: graduatedStudentsData.phd.length + graduatedStudentsData.ms.length,
        cur: studentsData.phd.length + studentsData.ms.length,
      }),
    },
  ];

  return (
    <PageWrapper noPadding>
      <Apertura
        // «investigación.» no cabe en el panel entre 1100 y 1500 px: el guion suave la parte solo si hace falta.
        palabra={t('nav.research').toLowerCase().replace('investigación', 'investiga\u00ADción')}
        entrada={t('rc.ov.lead')}
        foto={{ src: fotos.portadaInvestigacion.src, alt: localize(fotos.portadaInvestigacion.alt, lang), posicion: fotos.portadaInvestigacion.foco }}
        accion={{ to: '/research/program', label: t('rc.ov.cta') }}
      />

      {/* ── Las cifras, con su fuente y su fecha ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('rc.fig.title')} /></Sube>
          <Sube delay={0.06} className="mt-12 sm:mt-16">
            <StatsSection stats={stats} isLoading={false} />
          </Sube>
          <div className="mt-16 grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <Sube><p className="a-texto">{t('rc.fig.p1')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('rc.fig.p2')}</p></Sube>
            <Sube delay={0.1} className="lg:col-span-2">
              <p className="a-texto">{fill(t('rc.fig.wos'), {
                date: fecha(webOfScience.asOf, lang), pubs: webOfScience.publications, cites: numero(webOfScience.citations),
                noself: numero(webOfScience.citationsWithoutSelf), h: webOfScience.hIndex, patents: webOfScience.citingPatents,
              })}</p>
            </Sube>
          </div>
          <Sube className="mt-8">
            <a href={SCHOLAR_URL} target="_blank" rel="noopener noreferrer" className="a-enlace">
              {t('rc.fig.scholar')} <span aria-hidden="true">↗</span>
            </a>
          </Sube>
        </div>
      </section>

      {/* ── Año por año: publicaciones y citas ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('rc.chart.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-8 a-texto max-w-[68ch]">{fill(t('rc.chart.authors'), { since: authorship.since, last: authorship.last, second: authorship.secondToLast, n: authorship.articles })}</p>
          </Sube>
          <div className="mt-12 grid gap-x-16 gap-y-16 lg:grid-cols-2">
            <Sube className="min-w-0">
              <h3 className="a-h3 mb-6">{t('rc.chart.pubs.title')}</h3>
              <BarrasPorAno data={publicationsPerYear} series={seriesPub} inicial={2025} unidad={t('rc.chart.pubs.unit')} claroAntes={2017} hitos={{ 2017: t('rc.chart.arrival') }} />
              <p className="a-pie">{t('rc.chart.pubs.caption')}</p>
            </Sube>
            <Sube delay={0.08} className="min-w-0">
              <h3 className="a-h3 mb-6">{t('rc.chart.cites.title')}</h3>
              <BarrasPorAno
                data={citas}
                series={[{ key: 'cites', label: t('rc.class.cites'), color: '#3A3A3B' }]}
                inicial={2025}
                unidad={t('rc.chart.cites.unit')}
                notaAno={{ 2026: t('rc.chart.cites.partial') }}
                claroAntes={2017}
                hitos={{ 2017: t('rc.chart.arrival') }}
              />
              <p className="a-pie">{t('rc.chart.cites.caption')}</p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Las líneas: las cinco de 2020, que siguen abiertas, y las cuatro que se sumaron, cada una con un trabajo de hoy ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('rc.l20.title')} /></Sube>
          <div className="mt-12 grid gap-x-16 gap-y-6 lg:grid-cols-2">
            <Sube><p className="a-texto">{t('rc.l20.p1')}</p></Sube>
            <Sube delay={0.06}><p className="a-texto">{t('rc.l20.p2')}</p></Sube>
          </div>
          <Sube className="mt-16">
            <figure>
              {([['rc.l20.open', lineas2020, false], ['rc.l20.new', lineasNuevas, true]] as [UIKey, LineaHoy[], boolean][]).map(([titulo, filas, nueva]) => (
                <div key={titulo} className={nueva ? 'mt-14' : ''}>
                  <h3 className="flex items-center gap-3 pb-3 border-b-2 border-papel-100 font-semibold text-white">
                    {nueva && <span className="inline-block w-3 h-3 bg-resaltador" aria-hidden="true" />}
                    {t(titulo)}
                  </h3>
                  <ul>
                    {filas.map((f) => (
                      <li key={localize(f.linea, 'es')} className="grid gap-x-10 gap-y-2 py-5 border-b-2 border-tinta-700 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
                        <span className="font-semibold text-white leading-snug">{localize(f.linea, lang)}</span>
                        <span className="text-papel-200 max-w-[70ch]"><Cursiva texto={localize(f.hoy, lang)} /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <figcaption className="a-s text-tinta-300 mt-6 max-w-[64ch]">{t('rc.l20.caption')}</figcaption>
            </figure>
          </Sube>
        </div>
      </section>

      {/* ── Con quién: Juan Carlos Cruz y el mapa de la red, dentro y fuera de la Universidad ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('rc.net.title')} /></Sube>
          <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
            <div>
              <Sube><p className="a-texto">{t('rc.net.p1')}</p></Sube>
              <Sube delay={0.06}><p className="a-texto mt-6">{t('rc.net.p2')}</p></Sube>
            </div>
            <Sube delay={0.08}>
              <figure>
                <div className="overflow-hidden aspect-[4/3]">
                  <img src={fotos.sesionOlga.src} alt={localize(fotos.sesionOlga.alt, lang)} loading="lazy" className="a-foto a-bn" style={{ objectPosition: 'center 30%' }} />
                </div>
                <figcaption className="a-pie">{localize(fotos.sesionOlga.alt, lang)}.</figcaption>
              </figure>
            </Sube>
          </div>
          <Sube className="mt-16">
            <ResearchNetworkMap />
          </Sube>
        </div>
      </section>

      {/* ── Ponencias ── */}
      <section className="a-portada a-campo">
        <div className="a-c grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          {/* En pantallas angostas el texto va primero: el pie de la foto no queda encima del título. */}
          <Sube className="order-2 lg:order-1">
            <figure>
              <div className="overflow-hidden aspect-[16/9]">
                <img src={fotos.santoTomas.src} alt={localize(fotos.santoTomas.alt, lang)} loading="lazy" className="a-foto a-bn" />
              </div>
              <figcaption className="a-pie">{localize(fotos.santoTomas.alt, lang)}.</figcaption>
            </figure>
          </Sube>
          <div className="order-1 lg:order-2">
            <Sube><h2 className="a-titulo">{t('rc.talks.title')}.</h2></Sube>
            <Sube delay={0.06}>
              <p className="mt-6 a-texto">{t('rc.talks.text')}</p>
            </Sube>
            <Sube delay={0.1} className="mt-8">
              <Link to="/research/products?type=Conference" className="a-enlace">
                {t('rc.talks.cta')} <span aria-hidden="true">→</span>
              </Link>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Los doctores del grupo ── */}
      <section className="a-hundido a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('research.overview.group.title')} /></Sube>
          <Sube delay={0.06}>
            <p className="mt-8 a-texto">
              {t('research.overview.group.text')
                .replace('{phd}', String(graduatedStudentsData.phd.length))
                .replace('{ms}', String(graduatedStudentsData.ms.length))}
            </p>
          </Sube>
          <ul className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {doctores.map((d, i) => (
              <Sube as="li" key={d.name} delay={0.06 * i}>
                <img src={d.imageUrl} alt={d.name} loading="lazy" className="a-bn w-full aspect-[4/5] object-cover object-top" />
                <p className="mt-4 font-semibold leading-tight text-tinta-900">{d.name}</p>
                <p className="a-meta mt-1">{d.program ? localize(d.program, lang) : d.degree} · {d.graduationYear}</p>
                {d.currentPosition && <p className="a-s mt-2 text-tinta-700">{localize(d.currentPosition, lang)}</p>}
              </Sube>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Las páginas de la investigación ── */}
      <section className="a-papel a-campo">
        <div className="a-c">
          <Sube><h2 className="a-h3 mb-10">{t('rc.more.title')}.</h2></Sube>
          <ul className="a-filas">
            {interiores.map((r, i) => (
              <Sube as="li" key={r.to} delay={0.05 * i}>
                <Link to={r.to} className="a-fila">
                  <span className="q">{r.q}</span>
                  <span className="d">{r.d}</span>
                  <span className="ir" aria-hidden="true">→</span>
                </Link>
              </Sube>
            ))}
          </ul>
        </div>
      </section>
    </PageWrapper>
  );
};
