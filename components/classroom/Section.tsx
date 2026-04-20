import React from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ id, eyebrow, title, description, children, className = '' }) => (
  <section id={id} className={`py-12 sm:py-16 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        {eyebrow && (
          <p className="text-xs font-semibold tracking-widest uppercase text-brand-yellow-dark">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-brand-gray leading-relaxed">{description}</p>
        )}
      </header>
      <div className="mt-8">{children}</div>
    </div>
  </section>
);
