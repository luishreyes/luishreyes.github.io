import React, { useState } from 'react';
import { useI18n } from '../context/i18n';

/** La suma de vectores de la filosofía docente, para tocarla. El profesor apunta al
 *  aprendizaje con magnitud 1; el estudiante llega con la misma magnitud y el ángulo
 *  que el visitante escoja. Lo que avanza en la dirección del aprendizaje es la
 *  componente de la suma sobre esa dirección: 1 + cos θ (1,73 alineados a 43°,
 *  1,00 ortogonales, 0,13 opuestos a 150°, como en la figura del portafolio docente). */
const PRESETS = [
  { clave: 'home.vectors.aligned', grados: 43 },
  { clave: 'home.vectors.orthogonal', grados: 90 },
  { clave: 'home.vectors.opposed', grados: 150 },
] as const;

const W = 560, H = 330, OX = 70, OY = 250, L = 190;

export const Vectores: React.FC = () => {
  const { t, lang } = useI18n();
  const [grados, setGrados] = useState(43);
  const rad = (grados * Math.PI) / 180;
  const avance = 1 + Math.cos(rad);
  const fmt = (x: number) => x.toFixed(2).replace('.', lang === 'es' ? ',' : '.');

  // Cabeza del profesor, cola del estudiante: la suma va del origen a la punta del estudiante.
  const px = OX + L, py = OY;
  const sx = px + L * Math.cos(rad), sy = py - L * Math.sin(rad);
  const estado = grados < 65 ? 'home.vectors.aligned' : grados <= 115 ? 'home.vectors.orthogonal' : 'home.vectors.opposed';

  const flecha = (x1: number, y1: number, x2: number, y2: number, color: string, ancho: number) => {
    const a = Math.atan2(y2 - y1, x2 - x1), k = 14;
    const p1 = `${x2 - k * Math.cos(a - 0.42)},${y2 - k * Math.sin(a - 0.42)}`;
    const p2 = `${x2 - k * Math.cos(a + 0.42)},${y2 - k * Math.sin(a + 0.42)}`;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={ancho} strokeLinecap="square" />
        <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
      </g>
    );
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
      <figure>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
             aria-label={`${t('home.vectors.result')}: ${fmt(avance)}`}>
          {/* El eje del aprendizaje */}
          <line x1={20} y1={OY} x2={W - 20} y2={OY} stroke="#4A4A4C" strokeWidth={2} />
          {/* Lo que avanza: la proyección de la suma sobre el eje */}
          <line x1={OX} y1={OY + 22} x2={OX + L * avance} y2={OY + 22} stroke="#FFE900" strokeWidth={8} />
          {flecha(OX, OY, px, py, '#EBEBEC', 4)}
          {flecha(px, py, sx, sy, '#8E8E92', 4)}
          {flecha(OX, OY, sx, sy, '#FFE900', 3)}
          <text x={OX + L / 2} y={OY - 14} textAnchor="middle" fill="#EBEBEC" fontSize="15">{t('home.vectors.teacher')}</text>
          <text x={(px + sx) / 2 + 12} y={(py + sy) / 2 - 8} fill="#A9A9AD" fontSize="15">{t('home.vectors.student')}</text>
        </svg>
      </figure>
      <div>
        <p className="a-titulo text-white" aria-live="polite">{fmt(avance)}</p>
        <p className="mt-3 text-papel-100">{t('home.vectors.result')} · <strong className="font-semibold text-white">{t(estado)}</strong></p>
        <label htmlFor="angulo-vectores" className="mt-10 flex justify-between gap-4 a-s text-papel-100">
          {t('home.vectors.control')} <output htmlFor="angulo-vectores" className="tabular-nums">{grados}°</output>
        </label>
        <input
          id="angulo-vectores"
          type="range"
          min={0}
          max={180}
          step={1}
          value={grados}
          onChange={(e) => setGrados(parseInt(e.target.value, 10))}
          className="mt-2 w-full h-11 cursor-pointer accent-[#FFE900]"
        />
        <div className="a-filtros mt-6">
          {PRESETS.map((p) => (
            <button key={p.clave} type="button" aria-pressed={grados === p.grados} onClick={() => setGrados(p.grados)}>
              {t(p.clave)}
            </button>
          ))}
        </div>
        <p className="a-s a-sec mt-8 max-w-[44ch]">{t('home.vectors.note')}</p>
      </div>
    </div>
  );
};
