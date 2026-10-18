import React, { useMemo, useState } from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { Sube } from '../../components/Sube';
import { useI18n, localize, fill, type UIKey, type Lang } from '../../context/i18n';
import { testimonials, type Testimonial } from '../../components/data/teaching';
import { graduateByName } from '../../components/data/metrics';
import { fotos } from '../../components/data/fotos';

type FilterCategory = 'All' | Testimonial['category'];
const filterOptions: FilterCategory[] = ['All', 'Teaching & Mentorship', 'Research Advising'];
const categoryLabelKey: Record<FilterCategory, UIKey> = {
  All: 'testimonials.filter.all',
  'Teaching & Mentorship': 'testimonials.filter.teaching',
  'Research Advising': 'testimonials.filter.research',
};

// A graduate's job is stated once, in their student record. The testimonial's
// own info is the fallback for people who have no record, or whose record does
// not list a position.
const currentRole = (testimonial: Testimonial) => {
  const graduate = testimonial.graduateName ? graduateByName(testimonial.graduateName) : undefined;
  return graduate?.currentPosition || testimonial.info;
};

// Las tres voces que van grandes, en este orden, si tienen testimonio en la vista.
const DESTACADOS = ['Carlos Manuel Ramírez Acosta', 'Jason Bernal Sánchez', 'Julian Daniel Torres Vanegas', 'Brayan Rodríguez'];

interface Persona {
  name: string;
  imageUrl: string;
  role: Testimonial['info'];
  quotes: Testimonial[];
}

/** Una persona aparece una sola vez, con todos sus testimonios de la vista. */
const agrupar = (lista: Testimonial[]): Persona[] => {
  const porNombre = new Map<string, Persona>();
  for (const q of lista) {
    const p = porNombre.get(q.name);
    if (p) p.quotes.push(q);
    else porNombre.set(q.name, { name: q.name, imageUrl: q.imageUrl, role: currentRole(q), quotes: [q] });
  }
  return [...porNombre.values()].sort((a, b) => a.name.localeCompare(b.name));
};

const Parrafos: React.FC<{ quote: Testimonial; lang: Lang; className?: string }> = ({ quote, lang, className }) => (
  <>
    {localize(quote.quote, lang).split('\n\n').map((par, i) => (
      <p key={i} className={className}>{par}</p>
    ))}
  </>
);

export const TestimonialsPage = () => {
  const { t, lang } = useI18n();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');

  const { destacados, resto, total } = useMemo(() => {
    const vista = activeFilter === 'All' ? testimonials : testimonials.filter((q) => q.category === activeFilter);
    const personas = agrupar(vista);
    const elegidos = DESTACADOS.map((n) => personas.find((p) => p.name === n)).filter((p): p is Persona => Boolean(p)).slice(0, 3);
    return {
      destacados: elegidos,
      resto: personas.filter((p) => !elegidos.includes(p)),
      total: { quotes: vista.length, people: personas.length },
    };
  }, [activeFilter]);

  // La cita grande es la más corta de la persona; la otra, si hay, va a tamaño de lectura.
  const ordenarCitas = (p: Persona) =>
    [...p.quotes].sort((a, b) => localize(a.quote, lang).length - localize(b.quote, lang).length);

  return (
    <PageWrapper noPadding>
      <EncabezadoPagina
        titulo={t('testimonials.title')}
        entrada={<p>{t('testimonials.lead')}</p>}
        foto={{ src: fotos.ptarSalitre.src, alt: localize(fotos.ptarSalitre.alt, lang), posicion: 'center 35%' }}
      >
        <p className="mt-6 a-texto text-tinta-800">{t('testimonials.sub')}</p>
        <div className="a-filtros mt-10" role="group" aria-label={t('testimonials.title')}>
          {filterOptions.map((option) => (
            <button key={option} type="button" onClick={() => setActiveFilter(option)} aria-pressed={activeFilter === option}>
              {t(categoryLabelKey[option])}
            </button>
          ))}
        </div>
        <p className="a-meta mt-5" aria-live="polite">{fill(t('testimonials.count'), total)}</p>
      </EncabezadoPagina>

      {/* ── Tres voces grandes ── */}
      <section className="a-papel pb-24 sm:pb-32">
        <div className="a-c space-y-20 sm:space-y-28">
          {destacados.map((p, i) => {
            const [principal, ...otras] = ordenarCitas(p);
            return (
              <Sube key={`${activeFilter}-${p.name}`} delay={0.04 * i}>
                <figure className="grid gap-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-14 border-t-2 border-tinta-900 pt-10">
                  <img
                    src={p.imageUrl}
                    alt={fill(t('testimonials.photo'), { name: p.name })}
                    className="a-bn w-full max-w-[280px] aspect-[4/5] object-cover object-top"
                  />
                  <div>
                    <blockquote className="a-cita space-y-4 max-w-[40ch]">
                      <Parrafos quote={principal} lang={lang} />
                    </blockquote>
                    <figcaption className="mt-6">
                      <span className="block text-[18px] font-semibold text-tinta-900">{p.name}</span>
                      <span className="a-meta block">{localize(p.role, lang)}</span>
                      <span className="a-meta block">{localize(principal.context, lang)}</span>
                    </figcaption>
                    {otras.map((q) => (
                      <div key={q.category} className="mt-10 max-w-[64ch]">
                        <blockquote className="space-y-4 text-tinta-900">
                          <Parrafos quote={q} lang={lang} />
                        </blockquote>
                        <p className="a-meta mt-3">{localize(q.context, lang)}</p>
                      </div>
                    ))}
                  </div>
                </figure>
              </Sube>
            );
          })}
        </div>
      </section>

      {/* ── El resto, en columnas y sin cajas ── */}
      {resto.length > 0 && (
        <section className="a-hundido a-campo">
          <div className="a-c">
            <Sube><h2 className="a-h3">{t('testimonials.more')}.</h2></Sube>
            <div className="mt-12 lg:columns-2 lg:gap-16">
              {resto.map((p, i) => (
                <Sube key={`${activeFilter}-${p.name}`} delay={0.03 * (i % 4)} className="break-inside-avoid pb-14">
                  <div className="flex items-end gap-5 border-t-2 border-tinta-900 pt-6">
                    <img
                      src={p.imageUrl}
                      alt={fill(t('testimonials.photo'), { name: p.name })}
                      loading="lazy"
                      className="a-bn w-[140px] h-[140px] object-cover object-top flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="block text-[18px] leading-tight font-semibold text-tinta-900">{p.name}</span>
                      <span className="a-meta block mt-1">{localize(p.role, lang)}</span>
                    </div>
                  </div>
                  {p.quotes.map((q) => (
                    <div key={q.category} className="mt-6">
                      <blockquote className="space-y-4 text-tinta-900">
                        <Parrafos quote={q} lang={lang} />
                      </blockquote>
                      <p className="a-meta mt-3">{localize(q.context, lang)}</p>
                    </div>
                  ))}
                </Sube>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
};
