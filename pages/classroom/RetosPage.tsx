import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCourseBySlug } from '../../components/data/classroom';
import { CourseAccessGate } from '../../components/classroom/CourseAccessGate';
import { NotFoundInClassroom } from './NotFoundInClassroom';
import { spdpRetos, type Reto } from '../../components/data/classroom/spdp-retos';

type TabView = 'stats' | 'retos';

export const RetosPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = courseSlug ? getCourseBySlug(courseSlug) : undefined;

  const [view, setView] = useState<TabView>('stats');
  const [activeLinea, setActiveLinea] = useState<string>('Todas');
  const [search, setSearch] = useState<string>('');
  const [selectedReto, setSelectedReto] = useState<Reto | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedReto(null);
    };
    if (selectedReto) {
      document.addEventListener('keydown', onEsc);
      return () => document.removeEventListener('keydown', onEsc);
    }
  }, [selectedReto]);

  const stats = useMemo(() => {
    const totalRetos = spdpRetos.length;
    const asesoresSet = new Set(spdpRetos.map((r) => r.asesor));
    const totalProfesores = asesoresSet.size;
    const totalEstudiantes = spdpRetos.reduce((sum, r) => {
      const n = parseInt(r.integrantes.charAt(0), 10);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
    const totalAsignados = spdpRetos.filter((r) => r.seleccionado).length;

    const tipoCount: Record<string, number> = {};
    const lineaCount: Record<string, number> = {};
    const asesorCount: Record<string, number> = {};

    spdpRetos.forEach((r) => {
      tipoCount[r.tipo] = (tipoCount[r.tipo] || 0) + 1;
      lineaCount[r.linea] = (lineaCount[r.linea] || 0) + 1;
      asesorCount[r.asesor] = (asesorCount[r.asesor] || 0) + 1;
    });

    const tipos = Object.entries(tipoCount).sort((a, b) => b[1] - a[1]);
    const lineas = Object.entries(lineaCount).sort((a, b) => b[1] - a[1]);
    const asesores = Object.entries(asesorCount).sort((a, b) => b[1] - a[1]);

    return { totalRetos, totalProfesores, totalEstudiantes, totalAsignados, tipos, lineas, asesores };
  }, []);

  const lineas = useMemo(() => ['Todas', ...Array.from(new Set(spdpRetos.map((r) => r.linea))).sort()], []);

  const filteredRetos = useMemo(() => {
    const q = search.toLowerCase();
    return spdpRetos.filter((r) => {
      const matchLinea = activeLinea === 'Todas' || r.linea === activeLinea;
      const hay = `${r.asesor} ${r.reto} ${r.objetivos} ${r.linea} ${r.empresa}`.toLowerCase();
      return matchLinea && hay.includes(q);
    });
  }, [activeLinea, search]);

  if (!course) return <NotFoundInClassroom />;

  return (
    <CourseAccessGate course={course}>
      <motion.div
        {...{
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.4 },
        }}
        className="bg-zinc-50 min-h-screen"
      >
        <div className="bg-brand-dark pt-24 pb-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              to={`/classroom/${course.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase text-brand-yellow hover:text-zinc-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al curso
            </Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Retos del seminario {course.challenges?.term ?? ''}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-zinc-300">
              Departamento de Ingeniería Química y de Alimentos · Listado completo de retos con estadísticas,
              filtros por línea temática y detalles de asesor, objetivos y seguimiento.
            </p>
          </div>
        </div>

        <div className="bg-white border-b border-zinc-200 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <nav className="flex gap-6">
                <TabButton active={view === 'stats'} onClick={() => setView('stats')}>
                  Resumen estadístico
                </TabButton>
                <TabButton active={view === 'retos'} onClick={() => setView('retos')}>
                  Explorar retos
                </TabButton>
              </nav>
              {view === 'retos' && (
                <input
                  type="text"
                  placeholder="Buscar por palabra clave o profesor…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-80 mb-3 sm:mb-0 px-4 py-2 border-2 border-zinc-200 rounded-lg focus:outline-none focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow transition-colors bg-white text-sm"
                />
              )}
            </div>
          </div>
        </div>

        {view === 'stats' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Kpi label="Total de retos" value={stats.totalRetos} />
              <Kpi label="Profesores" value={stats.totalProfesores} />
              <Kpi label="Cupos estudiantes" value={stats.totalEstudiantes} />
              <Kpi label="Retos asignados" value={stats.totalAsignados} accent />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <StatsCard title="Tipo de proyecto" items={stats.tipos} accentYellow />
              <div className="lg:col-span-2">
                <StatsCard title="Proyectos por línea temática" items={stats.lineas} accentYellow />
              </div>
              <div className="lg:col-span-3">
                <StatsCard title="Retos propuestos por profesor" items={stats.asesores} />
              </div>
            </div>
          </section>
        )}

        {view === 'retos' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-6">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
                Filtrar por línea temática
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {lineas.map((linea) => (
                  <button
                    key={linea}
                    onClick={() => setActiveLinea(linea)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                      activeLinea === linea
                        ? 'bg-brand-yellow border-brand-yellow text-brand-dark'
                        : 'bg-white border-zinc-200 text-brand-gray hover:border-brand-yellow'
                    }`}
                  >
                    {linea}
                  </button>
                ))}
              </div>
            </div>

            {filteredRetos.length === 0 ? (
              <div className="bg-white rounded-xl border border-zinc-200 p-10 text-center">
                <p className="text-brand-gray">No se encontraron retos con los filtros actuales.</p>
                <button
                  onClick={() => {
                    setActiveLinea('Todas');
                    setSearch('');
                  }}
                  className="mt-4 px-4 py-2 bg-brand-yellow text-brand-dark font-semibold rounded-lg hover:bg-brand-yellow-dark transition-colors"
                >
                  Ver todos los retos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRetos.map((r) => (
                  <RetoCard key={r.id} reto={r} onClick={() => setSelectedReto(r)} />
                ))}
              </div>
            )}
          </section>
        )}

        <div className="pb-16" />

        {selectedReto && <RetoModal reto={selectedReto} onClose={() => setSelectedReto(null)} />}
      </motion.div>
    </CourseAccessGate>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => (
  <button
    onClick={onClick}
    className={`py-3 text-sm sm:text-base font-semibold transition-colors border-b-4 ${
      active ? 'border-brand-yellow text-brand-dark' : 'border-transparent text-brand-gray hover:text-brand-dark'
    }`}
  >
    {children}
  </button>
);

const Kpi: React.FC<{ label: string; value: number; accent?: boolean }> = ({ label, value, accent }) => (
  <div
    className={`bg-white rounded-xl border p-5 shadow-sm border-l-4 ${
      accent ? 'border-l-emerald-500 border-zinc-200' : 'border-l-brand-yellow border-zinc-200'
    }`}
  >
    <p className="text-xs font-semibold tracking-widest uppercase text-brand-gray">{label}</p>
    <p className={`mt-2 text-3xl font-bold ${accent ? 'text-emerald-600' : 'text-brand-dark'}`}>{value}</p>
  </div>
);

const StatsCard: React.FC<{ title: string; items: [string, number][]; accentYellow?: boolean }> = ({
  title,
  items,
  accentYellow,
}) => {
  const max = Math.max(...items.map(([, v]) => v), 1);
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm h-full">
      <h3 className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark mb-4">{title}</h3>
      <ul className="space-y-3">
        {items.map(([label, value]) => (
          <li key={label}>
            <div className="flex justify-between text-sm text-brand-dark">
              <span className="font-medium truncate pr-2">{label}</span>
              <span className="font-semibold">{value}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className={`h-full rounded-full ${accentYellow ? 'bg-brand-yellow' : 'bg-brand-dark'}`}
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RetoCard: React.FC<{ reto: Reto; onClick: () => void }> = ({ reto, onClick }) => {
  const retoCorto = reto.reto.length > 150 ? reto.reto.substring(0, 150) + '…' : reto.reto;
  return (
    <button
      onClick={onClick}
      className="text-left bg-white border-2 border-zinc-100 rounded-xl p-5 hover:shadow-lg hover:border-brand-yellow transition-all flex flex-col h-full focus:outline-none focus:ring-2 focus:ring-brand-yellow"
    >
      <div className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-brand-yellow px-2 py-1 rounded">
            {reto.linea}
          </span>
          {reto.seleccionado === true && (
            <span className="text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 px-2 py-1 rounded">
              Asignado
            </span>
          )}
          {reto.seleccionado === 'especial' && (
            <span className="text-xs font-bold uppercase tracking-wider text-white bg-purple-600 px-2 py-1 rounded">
              Proyecto especial
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-brand-dark leading-tight">Asesor: {reto.asesor}</h3>
        <p className="mt-2 text-sm text-brand-gray leading-relaxed">{retoCorto}</p>
      </div>
      <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-center">
        <span className="text-xs font-medium text-brand-gray flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {reto.integrantes}
        </span>
        <span className="text-xs font-bold text-brand-dark bg-zinc-100 px-2 py-1 rounded">{reto.tipo}</span>
      </div>
    </button>
  );
};

const RetoModal: React.FC<{ reto: Reto; onClose: () => void }> = ({ reto, onClose }) => (
  <div
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    <motion.div
      {...{
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.15 },
      }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
    >
      <header className="px-6 py-5 bg-brand-yellow flex justify-between items-start gap-4">
        <div className="flex-grow">
          <div className="flex flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-dark bg-white px-2 py-1 rounded">
              {reto.linea}
            </span>
            {reto.seleccionado === true && (
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 px-2 py-1 rounded">
                Asignado
              </span>
            )}
            {reto.seleccionado === 'especial' && (
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-purple-600 px-2 py-1 rounded">
                Proyecto especial
              </span>
            )}
          </div>
          <h2 className="mt-2 text-xl font-bold text-brand-dark">Asesor: {reto.asesor}</h2>
          <p className="text-sm text-brand-dark/80">Tipo de proyecto: {reto.tipo}</p>
        </div>
        <button
          onClick={onClose}
          className="text-brand-dark hover:text-brand-gray bg-white rounded-full p-1.5 transition-colors flex-shrink-0"
          aria-label="Cerrar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div className="p-6 overflow-y-auto flex-grow space-y-6">
        <section>
          <h3 className="font-bold text-base text-brand-dark border-b-2 border-brand-yellow inline-block mb-2">
            Pregunta de investigación / reto
          </h3>
          <p className="text-sm text-brand-gray whitespace-pre-wrap leading-relaxed">{reto.reto}</p>
        </section>

        <section>
          <h3 className="font-bold text-base text-brand-dark border-b-2 border-brand-yellow inline-block mb-2">
            Objetivos
          </h3>
          <p className="text-sm text-brand-gray whitespace-pre-wrap leading-relaxed">{reto.objetivos}</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 bg-zinc-50 p-4 rounded-lg border border-zinc-200">
          {reto.estudiantesAsignados && (
            <div className="sm:col-span-2 bg-emerald-50 p-3 rounded border border-emerald-200">
              <p className="text-xs font-bold tracking-widest uppercase text-emerald-800">
                Estudiantes asignados
              </p>
              <p className="mt-1 text-sm font-medium text-emerald-900">{reto.estudiantesAsignados}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-gray">Integrantes</p>
            <p className="mt-1 text-sm font-medium text-brand-dark">{reto.integrantes}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-brand-gray">Empresa</p>
            <p className="mt-1 text-sm font-medium text-brand-dark">{reto.empresa || 'Ninguna'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs font-bold tracking-widest uppercase text-brand-gray">Coasesor</p>
            <p className="mt-1 text-sm font-medium text-brand-dark">
              {reto.coasesor && reto.coasesor !== 'N/A' ? reto.coasesor : 'No aplica'}
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-bold text-base text-brand-dark border-b-2 border-brand-yellow inline-block mb-2">
            Tipo de seguimiento
          </h3>
          <p className="text-sm text-brand-gray whitespace-pre-wrap leading-relaxed">{reto.seguimiento}</p>
        </section>
      </div>

      <footer className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-brand-dark text-white font-semibold rounded-lg hover:bg-brand-gray transition-colors"
        >
          Cerrar
        </button>
      </footer>
    </motion.div>
  </div>
);
