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
import { ResearchConnectionsGraph } from '../components/ResearchConnectionsGraph';
import { scholar, publications, publicationsPerYear, SCHOLAR_URL, esPublicacion } from '../components/data/citations';
import { useAppData } from '../context/AppDataContext';

/** Resalta con el marcador una frase que ya está en el párrafo (una sola por página). */
const Resaltar: React.FC<{ texto: string; frase: string }> = ({ texto, frase }) => {
  const i = texto.indexOf(frase);
  if (i < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, i)}
      <span className="a-resaltado">{frase}</span>
      {texto.slice(i + frase.length)}
    </>
  );
};

/** Coautores de cada unidad de la Universidad, por la afiliación con que firman. */
const UNIDADES: { clave: UIKey; n: number }[] = [
  { clave: 'rc.unit.bme', n: 56 },
  { clave: 'rc.unit.own', n: 50 },
  { clave: 'rc.unit.eee', n: 8 },
  { clave: 'rc.unit.adm', n: 4 },
  { clave: 'rc.unit.sis', n: 2 },
  { clave: 'rc.unit.micro', n: 2 },
  { clave: 'rc.unit.cider', n: 2 },
  { clave: 'rc.unit.ai', n: 1 },
  { clave: 'rc.unit.cifi', n: 1 },
  { clave: 'rc.unit.bio', n: 1 },
];

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
    { label: fill(t('rc.fig.students'), { mentored: publications.studentFirstMentored }), value: publications.studentFirstDirected, note: fill(t('rc.fig.students.note'), { articles: publications.articles }) },
    { label: t('rc.fig.senior.label'), value: t('rc.fig.senior'), note: t('rc.fig.senior.note') },
  ];

  const seriesPub: Serie[] = [
    { key: 'articles', label: t('rc.class.articles'), color: '#1D1D1B' },
    { key: 'chapters', label: t('rc.class.chapters'), color: '#5E5E61' },
    { key: 'books', label: t('rc.class.books'), color: '#8E8E92' },
    { key: 'other', label: t('rc.class.other'), color: '#BDBDC1' },
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

  const maxUnidad = Math.max(...UNIDADES.map((u) => u.n));

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
        palabra={t('nav.research').toLowerCase()}
        entrada={t('rc.ov.lead')}
        foto={{ src: fotos.laboratorio.src, alt: localize(fotos.laboratorio.alt, lang), posicion: '60% center' }}
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
              <p className="a-texto text-tinta-900"><Resaltar texto={t('rc.fig.p3')} frase={t('rc.fig.p3.mark')} /></p>
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
          <div className="mt-12 grid gap-x-16 gap-y-16 lg:grid-cols-2">
            <Sube>
              <h3 className="a-h3 mb-6">{t('rc.chart.pubs.title')}</h3>
              <BarrasPorAno data={publicationsPerYear} series={seriesPub} inicial={2025} unidad={t('rc.chart.pubs.unit')} />
              <p className="a-pie">{t('rc.chart.pubs.caption')}</p>
            </Sube>
            <Sube delay={0.08}>
              <h3 className="a-h3 mb-6">{t('rc.chart.cites.title')}</h3>
              <BarrasPorAno
                data={citas}
                series={[{ key: 'cites', label: t('rc.class.cites'), color: '#3A3A3B' }]}
                inicial={2025}
                unidad={t('rc.chart.cites.unit')}
                notaAno={{ 2026: t('rc.chart.cites.partial') }}
              />
              <p className="a-pie">{t('rc.chart.cites.caption')}</p>
            </Sube>
          </div>
        </div>
      </section>

      {/* ── Las ocho líneas y cómo se cruzan: lo que se toca en la página ── */}
      <section className="a-oscuro a-campo">
        <div className="a-c">
          <Sube><Cabecera titulo={t('rc.lines.title')} className="mb-12" /></Sube>
          <Sube delay={0.06}>
            <ResearchConnectionsGraph products={products} />
          </Sube>
        </div>
      </section>

      {/* ── Con quién: Juan Carlos Cruz, las unidades de la Universidad y la red de fuera ── */}
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
            <figure>
              <h3 className="a-h3">{t('rc.net.units')}</h3>
              <ul className="mt-8 border-t-2 border-tinta-900">
                {UNIDADES.map((u) => (
                  <li
                    key={u.clave}
                    className="grid grid-cols-[minmax(0,1fr)_3rem] md:grid-cols-[minmax(0,22rem)_minmax(0,1fr)_3rem] gap-x-6 gap-y-2 items-center py-3 border-b-2 border-papel-300 transition-colors [@media(hover:hover)]:hover:bg-resaltador-suave"
                  >
                    <span className="a-s text-tinta-900">{t(u.clave)}</span>
                    <span className="hidden md:block h-3 bg-papel-200" aria-hidden="true">
                      <span className="block h-full bg-tinta-800" style={{ width: `${(u.n / maxUnidad) * 100}%` }} />
                    </span>
                    <span className="a-s text-tinta-900 font-semibold tabular-nums text-right">{numero(u.n)}</span>
                  </li>
                ))}
              </ul>
              <figcaption className="a-pie">{t('rc.net.units.caption')}</figcaption>
            </figure>
          </Sube>
        </div>
      </section>

      {/* ── Ponencias ── */}
      <section className="a-portada a-campo">
        <div className="a-c grid gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <Sube>
            <figure>
              <div className="overflow-hidden aspect-[16/9]">
                <img src={fotos.aiche2025.src} alt={localize(fotos.aiche2025.alt, lang)} loading="lazy" className="a-foto a-bn" />
              </div>
              <figcaption className="a-pie">{localize(fotos.aiche2025.alt, lang)}.</figcaption>
            </figure>
          </Sube>
          <div>
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
