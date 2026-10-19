import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useI18n, localize, fill } from '../context/i18n';
import { researchNetwork } from './data/researchNetwork';

/** El mapa de la red: el profesor en el centro, tres ramas (la Universidad por unidad, Colombia y otros países) y
 *  una hoja por colaborador. El grosor de cada línea es el nivel del vínculo. En pantallas angostas va como lista. */
const R1 = 66, R2 = 254, R3 = 306, GR = 7, GG = 2.2;
const ANCHO = [1.2, 2.8, 5.6], PUNTO = [3.6, 5, 7];
const TINTA = '#1D1D1B', PAPEL = '#F5F5F3', GRIS = '#76767A', SECUNDARIO = '#5E5E61', MARCADOR = '#FFE900';
const NUMEROS = { es: ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'], en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'] };

const rad = (a: number) => (a * Math.PI) / 180;
const pt = (a: number, r: number): [number, number] => [r * Math.cos(rad(a)), r * Math.sin(rad(a))];
const curva = (a0: number, r0: number, a1: number, r1: number) => {
  const m = (r0 + r1) / 2, [x0, y0] = pt(a0, r0), [x1, y1] = pt(a0, m), [x2, y2] = pt(a1, m), [x3, y3] = pt(a1, r1);
  return `M${x0},${y0} C${x1},${y1} ${x2},${y2} ${x3},${y3}`;
};
// Los rótulos de la mitad izquierda se voltean para que nunca queden de cabeza.
const gira = (a: number) => { const n = ((a % 360) + 360) % 360, izq = n > 90 && n < 270; return { rot: izq ? n + 180 : n, izq }; };

/** Muestra del grosor de una línea, para la leyenda y la lista. */
const Raya: React.FC<{ nivel: 1 | 2 | 3 | 'doble' }> = ({ nivel }) => (
  <svg width="32" height="12" aria-hidden="true" className="shrink-0">
    {nivel === 'doble'
      ? <line x1={0} x2={32} y1={6} y2={6} stroke={TINTA} strokeWidth={1.6} strokeDasharray="4 3" />
      : <line x1={0} x2={32} y1={6} y2={6} stroke={TINTA} strokeWidth={ANCHO[nivel - 1]} opacity={nivel === 1 ? 0.55 : 1} />}
  </svg>
);

export const ResearchNetworkMap: React.FC = () => {
  const { t, lang } = useI18n();
  const L = (v: Parameters<typeof localize>[0]) => localize(v, lang);
  const { totals, branches } = researchNetwork;
  const [activo, setActivo] = useState<string | null>(null);

  // Cada colaborador avanza un paso; entre grupos se suma GG y entre ramas GR. La Universidad queda centrada a la izquierda.
  const ramas = useMemo(() => {
    const hojas = branches.reduce((s, r) => s + r.groups.reduce((t, g) => t + g.people.length, 0), 0);
    const cortes = branches.reduce((s, r) => s + r.groups.length - 1, 0);
    const paso = (360 - branches.length * GR - cortes * GG) / hojas;
    const u = branches[0];
    const spanU = (u.groups.reduce((s, g) => s + g.people.length, 0) - 1) * paso + (u.groups.length - 1) * GG;
    let a = 180 - spanU / 2, primero = true;
    return branches.map((r) => {
      const grupos = r.groups.map((g, ig) => {
        const gente = g.people.map((x, ix) => {
          if (!primero) a += paso + (ix === 0 ? (ig === 0 ? GR : GG) : 0);
          primero = false;
          return { ...x, key: `${g.id}:${L(x.name)}`, ang: a };
        });
        return { ...g, gente, ang: gente.reduce((s, x) => s + x.ang, 0) / gente.length };
      });
      return { ...r, grupos, ang: grupos.reduce((s, g) => s + g.ang, 0) / grupos.length };
    });
  }, [branches, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // El lienzo se ajusta a lo que ocupan los rótulos, que dependen del idioma y de la letra.
  const dibujo = useRef<SVGGElement>(null);
  const [caja, setCaja] = useState('-620 -560 1240 1120');
  useLayoutEffect(() => {
    const medir = () => {
      const b = dibujo.current?.getBBox();
      if (b && b.width > 0) setCaja(`${Math.floor(b.x - 8)} ${Math.floor(b.y - 8)} ${Math.ceil(b.width + 16)} ${Math.ceil(b.height + 16)}`);
    };
    // Oculto (pantalla angosta) no mide nada: se vuelve a medir cuando la ventana cambia.
    medir();
    document.fonts?.ready.then(medir);
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [lang]);

  const textoPie = fill(t('rc.net.map.caption'), {
    people: totals.people, uniandes: totals.uniandes, units: NUMEROS[lang][totals.units] ?? totals.units, colombia: totals.colombia, abroad: totals.abroad,
  });

  return (
    <figure>
      {/* En pantallas anchas, el mapa */}
      <div className="hidden xl:block" aria-hidden="true">
        <svg viewBox={caja} className="block w-full h-auto mx-auto" style={{ maxWidth: 1240, fontFamily: 'var(--tipo)' }} onMouseLeave={() => setActivo(null)}>
          <g ref={dibujo}>
            {/* El camino que se toca, con marcador */}
            {ramas.map((r) => r.grupos.map((g) => g.gente.filter((x) => x.key === activo).map((x) => (
              <g key={'m' + x.key} stroke={MARCADOR} strokeWidth={12} strokeLinecap="round" fill="none">
                <path d={`M0,0 L${pt(r.ang, R1)[0]},${pt(r.ang, R1)[1]}`} />
                <path d={curva(r.ang, R1, g.ang, R2)} />
                <path d={curva(g.ang, R2, x.ang, R3)} />
              </g>
            ))))}
            {ramas.map((r) => (
              <g key={r.id} fill="none" stroke={TINTA}>
                <path d={`M0,0 L${pt(r.ang, R1)[0]},${pt(r.ang, R1)[1]}`} strokeWidth={4.4} />
                {r.grupos.map((g) => (
                  <g key={g.id}>
                    <path d={curva(r.ang, R1, g.ang, R2)} strokeWidth={2.4} />
                    {g.gente.map((x) => (
                      <path key={x.key} d={curva(g.ang, R2, x.ang, R3)} strokeWidth={ANCHO[x.level - 1]} opacity={x.level === 1 && x.key !== activo ? 0.55 : 1} />
                    ))}
                    {g.gente.filter((x) => x.also).map((x) => {
                      const o = r.grupos.find((h) => h.id === x.also);
                      return o && <path key={'t' + x.key} d={curva(o.ang, R2, x.ang, R3)} strokeWidth={1.6} strokeDasharray="5 4" />;
                    })}
                  </g>
                ))}
              </g>
            ))}
            {/* Los grupos, por dentro del círculo */}
            {ramas.map((r) => r.grupos.map((g) => {
              const [x, y] = pt(g.ang, R2), [lx, ly] = pt(g.ang, R2 - 10), q = gira(g.ang);
              return (
                <g key={'g' + g.id}>
                  <circle cx={x} cy={y} r={3.6} fill={TINTA} />
                  <text transform={`translate(${lx},${ly}) rotate(${q.rot})`} textAnchor={q.izq ? 'start' : 'end'} dominantBaseline="middle"
                    fontSize={13} fontStyle="italic" fill={SECUNDARIO} paintOrder="stroke" stroke={PAPEL} strokeWidth={5} strokeLinejoin="round">
                    {L(g.short)}
                  </text>
                </g>
              );
            }))}
            {/* Los colaboradores, por fuera */}
            {ramas.map((r) => r.grupos.map((g) => g.gente.map((x) => {
              const [px, py] = pt(x.ang, R3), [lx, ly] = pt(x.ang, R3 + 11), q = gira(x.ang), on = x.key === activo;
              return (
                <g key={'h' + x.key}>
                  <circle cx={px} cy={py} r={PUNTO[x.level - 1]} fill={x.level === 1 ? PAPEL : x.level === 2 ? GRIS : TINTA} stroke={TINTA} strokeWidth={x.level === 1 ? 1.4 : 0} />
                  <text transform={`translate(${lx},${ly}) rotate(${q.rot})`} textAnchor={q.izq ? 'end' : 'start'} dominantBaseline="middle"
                    fontSize={15} fontWeight={on || x.level === 3 ? 600 : 400} fill={TINTA}>
                    {L(x.label)}
                  </text>
                </g>
              );
            })))}
            {/* Las ramas, junto al centro */}
            {ramas.map((r) => {
              const [x, y] = pt(r.ang, R1);
              return (
                <g key={'r' + r.id}>
                  <circle cx={x} cy={y} r={5.5} fill={TINTA} />
                  <text x={x + (Math.cos(rad(r.ang)) < -0.5 ? 14 : 0)} y={y + (Math.sin(rad(r.ang)) > 0 ? 26 : -16)} textAnchor="middle"
                    fontSize={18} fontWeight={700} fill={TINTA} paintOrder="stroke" stroke={PAPEL} strokeWidth={6} strokeLinejoin="round">
                    {L(r.short)}
                  </text>
                </g>
              );
            })}
            <circle cx={0} cy={0} r={12} fill={MARCADOR} stroke={TINTA} strokeWidth={2} />
          </g>
          {/* Zonas sensibles: cada rótulo entero, no solo sus letras. Van fuera del dibujo para no agrandar el lienzo. */}
          {ramas.map((r) => r.grupos.map((g) => g.gente.map((x) => (
            <path key={'z' + x.key} d={curva(x.ang, R3 - 8, x.ang, R3 + 250)} stroke="transparent" strokeWidth={20} fill="none" onMouseEnter={() => setActivo(x.key)}>
              <title>{L(x.name)}</title>
            </path>
          ))))}
        </svg>
      </div>

      {/* En pantallas angostas (y para los lectores de pantalla), la misma red como lista */}
      <div className="xl:sr-only">
        {branches.map((r) => (
          <section key={r.id} className="mt-10 first:mt-0">
            <h3 className="a-h3">{L(r.name)}</h3>
            <div className="mt-4 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {r.groups.map((g) => (
                <div key={g.id} className="border-t-2 border-tinta-900 pt-3">
                  <h4 className="a-s font-semibold text-tinta-900">{L(g.name)}</h4>
                  <ul className="mt-2">
                    {g.people.map((x) => (
                      <li key={L(x.name)} className="flex items-center gap-3 py-1 a-s text-tinta-800">
                        <Raya nivel={x.level} />
                        <span className="sr-only">{t(`rc.net.level.${x.level}` as const)}: </span>
                        <span className={x.level === 3 ? 'font-semibold text-tinta-900' : undefined}>
                          {L(x.name)}
                          {x.also && <span className="text-tinta-600"> ({fill(t('rc.net.also'), { unit: L(r.groups.find((h) => h.id === x.also)?.name ?? '') })})</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Leyenda */}
      <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2 a-s text-tinta-800" aria-hidden="true">
        {([3, 2, 1] as const).map((n) => (
          <li key={n} className="flex items-center gap-2"><Raya nivel={n} />{t(`rc.net.level.${n}` as const)}</li>
        ))}
        <li className="hidden xl:flex items-center gap-2"><Raya nivel="doble" />{t('rc.net.level.dual')}</li>
      </ul>
      <figcaption className="a-pie">
        {textoPie} <span className="hidden xl:inline">{t('rc.net.map.how')}</span><span className="xl:hidden">{t('rc.net.list.how')}</span>
      </figcaption>
    </figure>
  );
};
