import React, { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import { useI18n } from '../context/i18n';

interface Stat {
  label: string;
  value: number | string;
  /** Optional qualifier: what the figure is measured over, or where it comes from. */
  note?: string;
}

interface StatsSectionProps {
  stats: Stat[];
  isLoading: boolean;
}

/** Cuenta hasta la cifra una sola vez, con el separador de miles del idioma. */
const Cifra: React.FC<{ value: number | string }> = ({ value }) => {
  const { lang } = useI18n();
  const reduce = useReducedMotion();
  const isNumber = typeof value === 'number';
  const [shown, setShown] = useState(isNumber && !reduce ? 0 : value);

  useEffect(() => {
    if (!isNumber || reduce) {
      setShown(value);
      return;
    }
    const controls = animate(0, value as number, {
      duration: 1.4,
      ease: [0.22, 0.8, 0.3, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, isNumber, reduce]);

  if (typeof shown !== 'number') return <>{shown}</>;
  return <>{shown.toLocaleString(lang === 'es' ? 'es-CO' : 'en-US')}</>;
};

/** Cifras sueltas sobre el campo de color, sin caja. */
export const StatsSection = ({ stats }: StatsSectionProps) => (
  <div className="a-cifras grande">
    {stats.map((stat) => (
      <div key={stat.label}>
        <b><Cifra value={stat.value} /></b>
        <span>{stat.label}</span>
        {stat.note && <span className="nota">{stat.note}</span>}
      </div>
    ))}
  </div>
);
