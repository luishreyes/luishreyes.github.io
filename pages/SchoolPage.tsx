import React from 'react';
import { PageWrapper } from '../components/PageWrapper';
import { EncabezadoPagina } from '../components/Apertura';
import { useI18n } from '../context/i18n';

/** Escuela: quienes he dirigido en pregrado, maestría y doctorado. En construcción. */
export const SchoolPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <PageWrapper noPadding>
      <EncabezadoPagina titulo={t('nav.students')} />
    </PageWrapper>
  );
};
