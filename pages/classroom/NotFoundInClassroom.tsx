import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../../components/PageWrapper';

export const NotFoundInClassroom: React.FC = () => (
  <PageWrapper>
    <div className="max-w-xl">
      <p className="text-sm font-semibold tracking-widest uppercase text-brand-yellow-dark">Classroom</p>
      <h1 className="mt-2 text-3xl font-bold text-brand-dark">No encontramos ese curso</h1>
      <p className="mt-3 text-brand-gray">
        Puede que el enlace esté desactualizado o que el curso aún no se haya publicado.
      </p>
      <Link
        to="/classroom"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-yellow text-brand-dark font-semibold rounded-md hover:bg-brand-yellow-dark transition-colors"
      >
        ← Volver a Classroom
      </Link>
    </div>
  </PageWrapper>
);
