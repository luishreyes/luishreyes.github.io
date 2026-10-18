import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TaughtCourse } from '../components/data/teaching';
import { useI18n, fill, type UIKey } from '../context/i18n';

/** El tipo de curso para el gráfico: los de posgrado van aparte, sea cual sea su tipo. */
type Categoria = 'Core' | 'Elective' | 'CBU' | 'Graduate';
type Filtro = Categoria | 'All';
type Medida = 'students' | 'sections';

const ETIQUETA: Record<Filtro, UIKey> = {
  All: 'tch.chart.all',
  Core: 'tch.chart.core',
  Elective: 'tch.chart.elective',
  CBU: 'tch.chart.cbu',
  Graduate: 'tch.chart.graduate',
};
const ORDEN: Categoria[] = ['Core', 'Elective', 'CBU', 'Graduate'];

const categoria = (c: TaughtCourse): Categoria | null =>
  c.level === 'Graduate' ? 'Graduate' : c.type === 'Core' || c.type === 'Elective' || c.type === 'CBU' ? c.type : null;

const chartHeight = 320;
const margin = { top: 28, right: 8, bottom: 40, left: 48 };

/** Estudiantes (o secciones) por año en los cursos de la Universidad, como el gráfico de
 *  productos: filtros cuadrados, barras en tinta y la barra que se toca en el resaltador,
 *  con su cifra encima. Los filtros salen de los tipos que tienen datos. */
export const CoursesOverTimeChart = ({ courses }: { courses: TaughtCourse[] }) => {
  const { t, lang } = useI18n();
  const [filtro, setFiltro] = useState<Filtro>('All');
  const [medida, setMedida] = useState<Medida>('students');
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(800);

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) setChartWidth(chartContainerRef.current.offsetWidth);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filtros: Filtro[] = useMemo(
    () => ['All', ...ORDEN.filter((k) => courses.some((c) => categoria(c) === k))],
    [courses],
  );

  const innerWidth = Math.max(0, chartWidth - margin.left - margin.right);
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const chartData = useMemo(() => {
    const porAno: Record<number, number> = {};
    for (const c of courses) {
      const k = categoria(c);
      if (!k || (filtro !== 'All' && k !== filtro)) continue;
      porAno[c.year] = (porAno[c.year] || 0) + (medida === 'students' ? c.students : 1);
    }
    return Object.entries(porAno)
      .map(([year, count]) => ({ year: Number(year), count }))
      .sort((a, b) => a.year - b.year);
  }, [courses, filtro, medida]);

  const { minYear, maxYear } = useMemo(() => {
    const years = courses.map((c) => c.year);
    const now = new Date().getFullYear();
    return years.length ? { minYear: Math.min(...years), maxYear: Math.max(...years) } : { minYear: now, maxYear: now };
  }, [courses]);

  const maxCount = Math.max(1, ...chartData.map((d) => d.count));
  // Un tope redondo: múltiplos de 4 para las secciones y de 40 para los estudiantes.
  const paso = medida === 'students' ? 40 : 4;
  const yAxisMax = Math.ceil(maxCount / paso) * paso || paso;

  const slots = maxYear - minYear + 1;
  const slot = innerWidth / slots;
  const xScale = (year: number) => margin.left + (year - minYear + 0.5) * slot;
  const yScale = (count: number) => margin.top + innerHeight - (innerHeight * count) / yAxisMax;
  const barWidth = Math.max(6, slot * 0.62);

  // Un año por cada 56 px; en el teléfono, uno de cada dos.
  const stride = Math.max(1, Math.ceil(slots / Math.max(1, Math.floor(innerWidth / 56))));
  const ticks = Array.from({ length: slots }, (_, i) => minYear + i).filter((_, i) => i % stride === 0);

  const baseline = margin.top + innerHeight;
  const miles = (n: number) => n.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US');

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-x-10 gap-y-4">
        <div className="a-filtros" role="group" aria-label={t('tch.chart.filter')}>
          {filtros.map((f) => (
            <button key={f} type="button" onClick={() => { setFiltro(f); setActiveYear(null); }} aria-pressed={filtro === f}>
              {t(ETIQUETA[f])}
            </button>
          ))}
        </div>
        <div className="a-filtros" role="group" aria-label={t('tch.chart.measure')}>
          {(['students', 'sections'] as Medida[]).map((m) => (
            <button key={m} type="button" onClick={() => { setMedida(m); setActiveYear(null); }} aria-pressed={medida === m}>
              {t(m === 'students' ? 'tch.chart.students' : 'tch.chart.sections')}
            </button>
          ))}
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full">
        {chartWidth > 0 && (
          <svg width={chartWidth} height={chartHeight} role="img" aria-label={t('tch.ov.chart.title')}>
            {Array.from({ length: 5 }).map((_, i) => {
              const value = Math.round((yAxisMax / 4) * i);
              const y = yScale(value);
              return (
                <g key={i}>
                  <text x={margin.left - 10} y={y + 5} textAnchor="end" fontSize="15" fill="#5E5E61">{miles(value)}</text>
                  {i > 0 && <line x1={margin.left} y1={y} x2={chartWidth - margin.right} y2={y} stroke="#DCDCDE" />}
                </g>
              );
            })}
            <line x1={margin.left} y1={baseline} x2={chartWidth - margin.right} y2={baseline} stroke="#76767A" />

            <AnimatePresence>
              {chartData.map(({ year, count }) => {
                const on = activeYear === year;
                return (
                  <motion.g
                    key={`${filtro}-${medida}-${year}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setActiveYear(year)}
                    onMouseLeave={() => setActiveYear(null)}
                    onClick={() => setActiveYear(on ? null : year)}
                    style={{ cursor: 'pointer' }}
                  >
                    <title>{fill(t(medida === 'students' ? 'tch.chart.bar.students' : 'tch.chart.bar.sections'), { count: miles(count), year })}</title>
                    {/* La franja entera responde al dedo, no solo la barra */}
                    <rect x={xScale(year) - slot / 2} y={margin.top} width={slot} height={innerHeight} fill="transparent" />
                    <motion.rect
                      x={xScale(year) - barWidth / 2}
                      width={barWidth}
                      initial={{ y: baseline, height: 0 }}
                      animate={{ y: yScale(count), height: Math.max(0, baseline - yScale(count)) }}
                      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                      fill={on ? '#FFE900' : '#3A3A3B'}
                    />
                    {on && (
                      <text x={xScale(year)} y={yScale(count) - 8} textAnchor="middle" fontSize="15" fontWeight="600" fill="#1D1D1B">
                        {miles(count)}
                      </text>
                    )}
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {ticks.map((year) => (
              <text key={year} x={xScale(year)} y={baseline + 24} textAnchor="middle" fontSize="15" fill="#5E5E61">
                {year}
              </text>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};

// ── Una serie por semestre ─────────────────────────────────────────────────

export interface SerieBand { from: number; to: number; label: string }
export interface SerieEvent { at: number; label: string; /** Fila del rótulo en pantallas anchas (0 arriba), para que una línea no cruce otro rótulo. */ row?: number }

interface SemesterSeriesProps {
  /** Los semestres del eje, en orden (2017-20, 2018-10…). */
  terms: string[];
  /** El valor de cada semestre; null deja el hueco. */
  values: (number | null)[];
  min: number;
  max: number;
  ticks: number[];
  /** Etapas o cursos, como franjas alternas de tono. */
  bands?: SerieBand[];
  /** Hitos marcados arriba del gráfico (artículos, premios). */
  events?: SerieEvent[];
  /** Lo que se lee arriba del gráfico para el semestre i. */
  describe: (i: number) => React.ReactNode;
  /** Qué decir de un semestre sin valor. */
  gapNote?: (i: number) => string | null;
  label: string;
}

/** Puntos cuadrados en tinta unidos por una línea delgada, con un hueco donde no hay dato.
 *  El semestre que se toca (o el último, mientras no se toque nada) va en el resaltador y
 *  se lee arriba. En el teléfono, los rótulos de las franjas y los hitos que no caben van
 *  debajo, como lista. */
export const SemesterSeriesChart: React.FC<SemesterSeriesProps> = ({ terms, values, min, max, ticks, bands = [], events = [], describe, gapNote, label }) => {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const ultimo = values.map((v, i) => (v === null ? -1 : i)).filter((i) => i >= 0).pop() ?? 0;
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const medir = () => { if (ref.current) setWidth(ref.current.offsetWidth); };
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const ancho = width >= 900;
  const filasHitos = events.length && ancho ? 3 : events.length ? 1 : 0;
  const top = (filasHitos ? 20 : 10) + filasHitos * 20;
  const phone = width > 0 && width < 600;
  const height = (phone ? 260 : 320) + filasHitos * 20;
  const margin = { top, right: phone ? 6 : 12, bottom: 40, left: 44 };
  const innerWidth = Math.max(0, width - margin.left - margin.right);
  const innerHeight = height - margin.top - margin.bottom;
  const n = terms.length;
  const slot = innerWidth / n;
  const x = (i: number) => margin.left + (i + 0.5) * slot;
  const y = (v: number) => margin.top + ((max - v) / (max - min)) * innerHeight;

  // Segmentos sin huecos, para la línea.
  const segmentos: string[] = [];
  let actual: string[] = [];
  values.forEach((v, i) => {
    if (v === null) { if (actual.length) segmentos.push(actual.join(' ')); actual = []; }
    else actual.push(`${x(i)},${y(v)}`);
  });
  if (actual.length) segmentos.push(actual.join(' '));

  // Un rótulo por año (el primer semestre de cada año); en el teléfono, uno de cada dos años.
  const anos = terms
    .map((tm, i) => ({ i, year: tm.slice(0, 4) }))
    .filter((d, k, arr) => k === 0 || d.year !== arr[k - 1].year)
    .filter((_, k) => !phone || k % 2 === 0);

  const cabe = (b: SerieBand) => (b.to - b.from + 1) * slot >= b.label.length * 8.6 + 14;
  const franjasFuera = bands.filter((b) => !cabe(b));
  const shown = active ?? ultimo;

  return (
    <div>
      <p className="text-[18px] text-tinta-900 min-h-[3.2em] sm:min-h-[1.6em]" aria-live="polite">{describe(shown)}</p>
      <div ref={ref} className="mt-4 w-full overflow-hidden" style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} role="img" aria-label={label} onMouseLeave={() => setActive(null)}>
            {bands.map((b, k) => (
              <g key={b.label}>
                <rect x={margin.left + b.from * slot} y={margin.top} width={(b.to - b.from + 1) * slot} height={innerHeight} fill={k % 2 ? '#DCDCDE' : '#EBEBEC'} />
                {cabe(b) && (
                  <text x={margin.left + b.from * slot + 8} y={margin.top + 18} fontSize="15" fill="#4A4A4C">{b.label}</text>
                )}
              </g>
            ))}

            {ticks.map((v) => (
              <g key={v}>
                <line x1={margin.left} y1={y(v)} x2={width - margin.right} y2={y(v)} stroke="#CDCDD0" />
                <text x={margin.left - 10} y={y(v) + 5} textAnchor="end" fontSize="15" fill="#5E5E61">{v}</text>
              </g>
            ))}

            {events.map((e, k) => {
              const fila = ancho ? e.row ?? k % 3 : 0;
              const ty = 16 + fila * 20;
              const derecha = x(e.at) > width - 180;
              return (
                <g key={e.label}>
                  <line x1={x(e.at)} y1={ancho ? ty + 5 : 8} x2={x(e.at)} y2={margin.top} stroke="#76767A" strokeWidth="1.5" />
                  <path d={`M${x(e.at) - 5},${margin.top - 9} L${x(e.at) + 5},${margin.top - 9} L${x(e.at)},${margin.top - 1} z`} fill="#1D1D1B" />
                  {ancho && (
                    <text x={x(e.at) + (derecha ? -6 : 6)} y={ty} textAnchor={derecha ? 'end' : 'start'} fontSize="15" fill="#4A4A4C">{e.label}</text>
                  )}
                </g>
              );
            })}

            {segmentos.map((pts, k) => (
              <polyline key={k} points={pts} fill="none" stroke="#5E5E61" strokeWidth="2" strokeLinejoin="round" />
            ))}

            {values.map((v, i) => {
              const on = shown === i;
              return (
                <g key={terms[i]} onMouseEnter={() => setActive(i)} onClick={() => setActive(active === i ? null : i)} style={{ cursor: 'pointer' }}>
                  <title>{v === null ? `${terms[i]}: ${gapNote?.(i) ?? ''}` : `${terms[i]}: ${v}`}</title>
                  <rect x={margin.left + i * slot} y={margin.top} width={slot} height={innerHeight} fill="transparent" />
                  {v !== null && (
                    <rect
                      x={x(i) - (on ? 6 : 4.5)}
                      y={y(v) - (on ? 6 : 4.5)}
                      width={on ? 12 : 9}
                      height={on ? 12 : 9}
                      fill={on ? '#FFE900' : '#1D1D1B'}
                      stroke="#1D1D1B"
                      strokeWidth="2"
                    />
                  )}
                </g>
              );
            })}

            <line x1={margin.left} y1={margin.top + innerHeight} x2={width - margin.right} y2={margin.top + innerHeight} stroke="#76767A" />
            {anos.map(({ i, year }) => (
              <text key={year} x={margin.left + i * slot + 2} y={margin.top + innerHeight + 26} fontSize="15" fill="#5E5E61">{year}</text>
            ))}
          </svg>
        )}
      </div>
      {width > 0 && (franjasFuera.length > 0 || (!ancho && events.length > 0)) && (
        <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 a-s text-tinta-800">
          {franjasFuera.map((b) => (
            <li key={b.label}><span className="tabular-nums text-tinta-600">{fill(t('tch.range'), { a: terms[b.from], b: terms[b.to] })}</span> {b.label}</li>
          ))}
          {!ancho && events.map((e) => (
            <li key={e.label}><span className="tabular-nums text-tinta-600">{terms[e.at]}</span> {e.label}</li>
          ))}
        </ul>
      )}
    </div>
  );
};
