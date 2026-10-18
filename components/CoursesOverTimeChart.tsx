import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TaughtCourse } from '../components/data/teaching';
import { useI18n, fill, type UIKey } from '../context/i18n';

type CourseType = TaughtCourse['type'];

const typeKey: Record<CourseType | 'All', UIKey> = {
  All: 'teaching.type.all',
  Core: 'teaching.type.core',
  Elective: 'teaching.type.elective',
  CBU: 'teaching.type.cbu',
  EDCO: 'teaching.type.edco',
  Corporate: 'teaching.type.corporate',
  Coursera: 'teaching.type.coursera',
};
const types: (CourseType | 'All')[] = ['All', 'Core', 'Elective', 'CBU', 'EDCO', 'Corporate', 'Coursera'];

interface ChartData {
  year: number;
  count: number;
}

const chartHeight = 320;
const margin = { top: 28, right: 8, bottom: 40, left: 40 };

const processData = (courses: TaughtCourse[], filter: CourseType | 'All'): ChartData[] => {
  const filtered = filter === 'All' ? courses : courses.filter((c) => c.type === filter);
  const countsByYear: Record<number, number> = {};
  filtered.forEach((c) => {
    countsByYear[c.year] = (countsByYear[c.year] || 0) + 1;
  });
  return Object.entries(countsByYear)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year);
};

/** Cursos dictados por año, como el gráfico de productos: filtros cuadrados, barras en
 *  tinta y la barra que se toca en el resaltador, con su número encima. */
export const CoursesOverTimeChart = ({ courses }: { courses: TaughtCourse[] }) => {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState<CourseType | 'All'>('All');
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

  const innerWidth = Math.max(0, chartWidth - margin.left - margin.right);
  const innerHeight = chartHeight - margin.top - margin.bottom;

  const chartData = useMemo(() => processData(courses, activeFilter), [courses, activeFilter]);

  const { minYear, maxYear } = useMemo(() => {
    const years = courses.map((c) => c.year);
    const now = new Date().getFullYear();
    return years.length ? { minYear: Math.min(...years), maxYear: Math.max(...years) } : { minYear: now, maxYear: now };
  }, [courses]);

  const maxCount = Math.max(1, ...chartData.map((d) => d.count));
  const yAxisMax = Math.ceil(maxCount / 4) * 4 || 4;

  const slots = maxYear - minYear + 1;
  const slot = innerWidth / slots;
  const xScale = (year: number) => margin.left + (year - minYear + 0.5) * slot;
  const yScale = (count: number) => margin.top + innerHeight - (innerHeight * count) / yAxisMax;
  const barWidth = Math.max(6, slot * 0.62);

  // Un año por cada 56 px; en el teléfono, uno de cada dos.
  const stride = Math.max(1, Math.ceil(slots / Math.max(1, Math.floor(innerWidth / 56))));
  const ticks = Array.from({ length: slots }, (_, i) => minYear + i).filter((_, i) => i % stride === 0);

  const baseline = margin.top + innerHeight;

  return (
    <div>
      <div className="a-filtros mb-8">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => { setActiveFilter(type); setActiveYear(null); }}
            aria-pressed={activeFilter === type}
          >
            {t(typeKey[type])}
          </button>
        ))}
      </div>

      <div ref={chartContainerRef} className="w-full">
        {chartWidth > 0 && (
          <svg width={chartWidth} height={chartHeight} role="img" aria-label={t('teaching.overview.chart.title')}>
            {Array.from({ length: 5 }).map((_, i) => {
              const value = Math.round((yAxisMax / 4) * i);
              const y = yScale(value);
              return (
                <g key={i}>
                  <text x={margin.left - 10} y={y + 5} textAnchor="end" fontSize="15" fill="#76767A">{value}</text>
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
                    key={`${activeFilter}-${year}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onMouseEnter={() => setActiveYear(year)}
                    onMouseLeave={() => setActiveYear(null)}
                    onClick={() => setActiveYear(on ? null : year)}
                    style={{ cursor: 'pointer' }}
                  >
                    <title>{fill(t('teaching.chart.bar'), { count, year })}</title>
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
                        {count}
                      </text>
                    )}
                  </motion.g>
                );
              })}
            </AnimatePresence>

            {ticks.map((year) => (
              <text key={year} x={xScale(year)} y={baseline + 24} textAnchor="middle" fontSize="15" fill="#76767A">
                {year}
              </text>
            ))}
          </svg>
        )}
      </div>
    </div>
  );
};
