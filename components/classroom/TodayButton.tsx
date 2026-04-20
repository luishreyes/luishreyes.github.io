import React, { useState, useEffect, useRef } from 'react';
import type { Course, CronogramaEntry } from '../data/classroom';

interface TodayButtonProps {
  course: Course;
}

export const TodayButton: React.FC<TodayButtonProps> = ({ course }) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Don't render if no cronograma
  if (!course.cronograma || course.cronograma.length === 0) return null;

  // Get events in the next 7 days from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcoming = course.cronograma.filter((e) => {
    const d = new Date(e.date + 'T12:00:00');
    return d >= today && d < nextWeek;
  }).sort((a, b) => a.date.localeCompare(b.date));

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Format date nicely in Spanish
  const formatDate = (iso: string): string => {
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  // Check if a date is today
  const isToday = (iso: string): boolean => {
    const d = new Date(iso + 'T12:00:00');
    return d.toDateString() === today.toDateString();
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 bg-brand-yellow text-brand-dark font-semibold px-5 py-2.5 rounded-lg shadow-md hover:bg-brand-yellow-dark hover:shadow-lg transition-all text-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        ¿Qué hay para hoy?
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div
            ref={modalRef}
            className="bg-brand-dark rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-700">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow">
                  {course.code} · Próximos 7 días
                </p>
                <h2 className="mt-1 text-xl font-bold text-white">¿Qué hay para hoy?</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors p-1"
                aria-label="Cerrar"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto max-h-[60vh] space-y-4">
              {upcoming.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-zinc-400 text-lg">Sin actividades esta semana</p>
                  <p className="text-zinc-500 text-sm mt-2">Disfruta el descanso 🎉</p>
                </div>
              ) : (
                upcoming.map((entry, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 ${
                      isToday(entry.date)
                        ? 'bg-brand-yellow/10 border border-brand-yellow/30'
                        : 'bg-zinc-800/50'
                    }`}
                  >
                    {/* Date line */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${
                        isToday(entry.date) ? 'text-brand-yellow' : 'text-zinc-500'
                      }`}>
                        {isToday(entry.date) ? '📍 Hoy' : formatDate(entry.date)}
                      </span>
                      {isToday(entry.date) && (
                        <span className="text-xs text-zinc-500">· {formatDate(entry.date)}</span>
                      )}
                    </div>

                    {/* Topic */}
                    <h3 className="text-white font-semibold text-base">{entry.topic}</h3>

                    {/* Details */}
                    {entry.details && entry.details.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {entry.details.map((d, j) => (
                          <li key={j} className="text-sm text-zinc-400 flex gap-2">
                            <span className="text-brand-yellow-dark mt-0.5">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {entry.quiz && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                          📝 {entry.quiz}
                        </span>
                      )}
                      {entry.taller && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          🔧 {entry.taller}
                        </span>
                      )}
                      {entry.proyecto && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30">
                          📦 {entry.proyecto}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
