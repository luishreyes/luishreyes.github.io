import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductSection } from '../components/ProductSection';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina } from '../components/Apertura';
import { Sube } from '../components/Sube';
import { useAppData } from '../context/AppDataContext';
import { useI18n, localize, fill, type UIKey } from '../context/i18n';
import { researchLinesMap } from '../components/data/research';
import { editedBooksData } from '../components/data/editorships';
import { fotos, type Foto } from '../components/data/fotos';
import { scholar, esPublicacion } from '../components/data/citations';
import type { Product, ProductType, ResearchArea } from '../types';

type Orden = 'newest' | 'oldest' | 'cited';

const anoDe = (p: Product) => parseInt(p.publicationDate.slice(0, 4), 10);

// Las portadas que existen en public/images/books, por DOI o ISBN del libro.
const PORTADAS: Record<string, string> = Object.fromEntries(
  editedBooksData.flatMap((b) => [b.doi, b.isbn].filter((x): x is string => !!x).map((id) => [id, b.cover])),
);

// Fotos de los congresos de cada año, solo donde la lista tiene ponencias de ese congreso.
const FOTOS_DEL_ANO: Record<number, Foto[]> = {
  2025: [fotos.aiche2025, fotos.palmaCharla],
  2019: [fotos.aiche2019],
  2018: [fotos.aiche2018],
};

const campo = 'mt-2 w-full h-12 px-3 bg-papel-0 text-tinta-900 rounded-none border-0 border-b-2 border-tinta-900';

export const ProductsPage = () => {
  const { products, productsLoading, citationData } = useAppData();
  const { t, lang } = useI18n();
  const citas = citationData.counts;
  const [params, setParams] = useSearchParams();

  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState<Orden>('newest');
  const [tipos, setTipos] = useState<ProductType[]>(() => {
    const t0 = params.get('type');
    return t0 ? [t0 as ProductType] : [];
  });
  const [linea, setLinea] = useState<string>(() => params.get('area') ?? '');
  const [desde, setDesde] = useState<number | null>(null);
  const [hasta, setHasta] = useState<number | null>(null);

  // La línea y el tipo viajan en la dirección: el programa enlaza aquí cada línea.
  useEffect(() => {
    const next = new URLSearchParams();
    if (linea) next.set('area', linea);
    if (tipos.length === 1) next.set('type', tipos[0]);
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [linea, tipos, params, setParams]);

  const { tiposPorCuenta, cuentaTipo, lineas, anos, primerAno } = useMemo(() => {
    const cuentaTipo: Partial<Record<ProductType, number>> = {};
    const cuentaLinea: Record<string, number> = {};
    for (const p of products) {
      cuentaTipo[p.type] = (cuentaTipo[p.type] ?? 0) + 1;
      for (const a of p.researchAreas ?? []) cuentaLinea[a] = (cuentaLinea[a] ?? 0) + 1;
    }
    const anos = [...new Set<number>(products.map(anoDe).filter((n) => Number.isFinite(n)))].sort((a, b) => b - a);
    return {
      cuentaTipo,
      tiposPorCuenta: (Object.keys(cuentaTipo) as ProductType[]).sort((a, b) => (cuentaTipo[b] ?? 0) - (cuentaTipo[a] ?? 0)),
      lineas: Object.keys(cuentaLinea).sort((a, b) => cuentaLinea[b] - cuentaLinea[a]),
      anos,
      primerAno: anos.length ? anos[anos.length - 1] : null,
    };
  }, [products]);

  const nombreLinea = (a: string) => localize(researchLinesMap[a as ResearchArea]?.title ?? a, lang);
  const plural = (tipo: ProductType) => t(`products.types.${tipo}` as UIKey);

  const lista = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const filtrados = products.filter((p) => {
      if (q && !`${p.title} ${p.authors.join(' ')} ${p.keywords.join(' ')}`.toLowerCase().includes(q)) return false;
      if (tipos.length && !tipos.includes(p.type)) return false;
      if (linea && !(p.researchAreas ?? []).includes(linea as ResearchArea)) return false;
      const ano = anoDe(p);
      if (desde && ano < desde) return false;
      if (hasta && ano > hasta) return false;
      return true;
    });
    const fecha = (p: Product) => new Date(p.publicationDate).getTime();
    return filtrados.sort((a, b) => {
      if (orden === 'cited') return (citas[b.doi] ?? -1) - (citas[a.doi] ?? -1) || fecha(b) - fecha(a);
      return orden === 'newest' ? fecha(b) - fecha(a) : fecha(a) - fecha(b);
    });
  }, [products, busqueda, tipos, linea, desde, hasta, orden, citas]);

  // Por fecha, la lista va en grupos por año; por citas, en una sola columna.
  const grupos = useMemo(() => {
    if (orden === 'cited') return [{ ano: null as number | null, items: lista }];
    const out: { ano: number | null; items: Product[] }[] = [];
    for (const p of lista) {
      const ano = anoDe(p);
      const ultimo = out[out.length - 1];
      if (ultimo && ultimo.ano === ano) ultimo.items.push(p);
      else out.push({ ano, items: [p] });
    }
    return out;
  }, [lista, orden]);

  const hayFiltros = !!(busqueda || tipos.length || linea || desde || hasta);
  const limpiar = () => {
    setBusqueda('');
    setTipos([]);
    setLinea('');
    setDesde(null);
    setHasta(null);
  };
  const alternarTipo = (tipo: ProductType) =>
    setTipos((prev) => (prev.includes(tipo) ? prev.filter((x) => x !== tipo) : [...prev, tipo]));

  const numero = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');
  // La cifra de citas es la del perfil de Google Scholar, con su fecha.
  const intro = fill(t('rc.products.intro'), {
    pubs: products.filter(esPublicacion).length,
    first: primerAno ?? '',
    patents: products.filter((p) => p.type === 'Patent').length,
    talks: products.filter((p) => p.type === 'Conference').length,
    cites: numero(scholar.citations),
    date: new Date(`${scholar.asOf}T12:00:00`).toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
  });

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('products.title')}
        entrada={
          <p className="[text-wrap:pretty]">
            {productsLoading
              ? t('products.loading')
              : intro}
          </p>
        }
      />

      {/* ── Filtros: búsqueda, orden, tipo, línea y años. Nada fijo: no se comen la pantalla. ── */}
      <section className="a-hundido" aria-label={t('products.search.label')}>
        <div className="a-c py-10 sm:py-14 grid gap-x-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
          <div className="space-y-8 min-w-0">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <label className="block">
              <span className="a-s text-tinta-600">{t('products.search.label')}</span>
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder={t('products.search')}
                className={`${campo} px-4 placeholder:text-tinta-500`}
              />
            </label>
            <div>
              <span className="a-s text-tinta-600">{t('products.sortBy')}</span>
              <div className="a-filtros mt-2">
                {(['newest', 'oldest', 'cited'] as Orden[]).map((o) => (
                  <button key={o} type="button" aria-pressed={orden === o} onClick={() => setOrden(o)}>
                    {t(`products.sort.${o}` as UIKey)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="a-s text-tinta-600">{t('products.filter.type')}</span>
            <div className="a-filtros mt-2">
              <button type="button" aria-pressed={tipos.length === 0} onClick={() => setTipos([])}>
                {t('products.filter.allTypes')} {products.length}
              </button>
              {tiposPorCuenta.map((tipo) => (
                <button key={tipo} type="button" aria-pressed={tipos.includes(tipo)} onClick={() => alternarTipo(tipo)}>
                  {plural(tipo)} {cuentaTipo[tipo]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-x-6 gap-y-5 grid-cols-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
            <label className="block col-span-2 sm:hidden">
              <span className="a-s text-tinta-600">{t('products.filter.type')}</span>
              <select
                value={tipos.length === 1 ? tipos[0] : ''}
                onChange={(e) => setTipos(e.target.value ? [e.target.value as ProductType] : [])}
                className={campo}
              >
                <option value="">{t('products.filter.allTypes')} ({products.length})</option>
                {tiposPorCuenta.map((tipo) => (
                  <option key={tipo} value={tipo}>{plural(tipo)} ({cuentaTipo[tipo]})</option>
                ))}
              </select>
            </label>
            <label className="block col-span-2 sm:col-span-1">
              <span className="a-s text-tinta-600">{t('products.filter.area')}</span>
              <select value={linea} onChange={(e) => setLinea(e.target.value)} className={campo}>
                <option value="">{t('products.filter.allAreas')}</option>
                {lineas.map((a) => (
                  <option key={a} value={a}>{nombreLinea(a)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="a-s text-tinta-600">{t('products.filter.from')}</span>
              <select value={desde ?? ''} onChange={(e) => setDesde(e.target.value ? +e.target.value : null)} className={campo}>
                <option value="">{t('products.filter.anyYear')}</option>
                {[...anos].reverse().map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="a-s text-tinta-600">{t('products.filter.to')}</span>
              <select value={hasta ?? ''} onChange={(e) => setHasta(e.target.value ? +e.target.value : null)} className={campo}>
                <option value="">{t('products.filter.anyYear')}</option>
                {anos.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
          </div>

          <p className="a-s text-tinta-800" aria-live="polite">
            {fill(t('products.count'), { shown: lista.length, total: products.length })}
            {hayFiltros && (
              <>
                {' · '}
                <button type="button" onClick={limpiar} className="a-enlace">{t('products.clear')}</button>
              </>
            )}
          </p>
          </div>

          {/* La foto acompaña las herramientas en pantallas grandes; en el teléfono la lista va primero. */}
          <figure className="hidden lg:block">
            <div className="overflow-hidden aspect-[4/3]">
              <img src={fotos.acofi.src} alt={localize(fotos.acofi.alt, lang)} className="a-foto a-bn" style={{ objectPosition: fotos.acofi.foco }} />
            </div>
            <figcaption className="a-pie">{localize(fotos.acofi.alt, lang)}.</figcaption>
          </figure>
        </div>
      </section>

      {/* ── La lista: filas compactas agrupadas por año; el año acompaña su grupo ── */}
      <section className="a-papel pt-14 pb-24 sm:pt-20 sm:pb-32">
        <div className="a-c">
          {productsLoading ? (
            <p className="a-entrada">{t('products.loading')}</p>
          ) : lista.length === 0 ? (
            <div>
              <p className="a-h3">{t('products.empty.title')}</p>
              <p className="mt-3 a-texto">{t('products.empty.sub')}</p>
            </div>
          ) : (
            <div className="space-y-16 sm:space-y-20">
              {grupos.map((g) => (
                <section
                  key={g.ano ?? 'citas'}
                  className={g.ano !== null ? 'lg:grid lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-x-10' : ''}
                  aria-label={g.ano !== null ? String(g.ano) : undefined}
                >
                  {g.ano !== null && (
                    <div className="lg:sticky lg:top-24 lg:self-start flex items-baseline gap-4 lg:block mb-4 lg:mb-0">
                      <h2 className="a-titulo">{g.ano}</h2>
                      <p className="a-meta lg:mt-3">
                        {g.items.length === 1 ? t('products.year.one') : fill(t('products.year.many'), { n: g.items.length })}
                      </p>
                      {(FOTOS_DEL_ANO[g.ano] ?? []).map((f) => (
                        <figure key={f.src} className="hidden lg:block mt-6">
                          <img src={f.src} alt={localize(f.alt, lang)} loading="lazy" className="a-bn w-full aspect-[4/3] object-cover" />
                          <figcaption className="a-pie !mt-2 leading-snug">{localize(f.alt, lang)}.</figcaption>
                        </figure>
                      ))}
                    </div>
                  )}
                  <ul className="border-t-2 border-tinta-900">
                    {g.items.map((p, i) => (
                      <Sube as="li" key={p.doi} delay={0.03 * Math.min(i, 5)} className="border-b-2 border-papel-300">
                        <ProductSection
                          product={p}
                          citationCount={citas[p.doi] ?? null}
                          cover={PORTADAS[p.doi]}
                          showYear={g.ano === null}
                        />
                      </Sube>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};
