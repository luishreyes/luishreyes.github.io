import React from 'react';
import { PageWrapper } from '../../components/PageWrapper';
import { EncabezadoPagina } from '../../components/Apertura';
import { useI18n } from '../../context/i18n';

/** Estrategias y material de los cursos. En construcción. */
export const StrategiesPage: React.FC = () => {
  const { t } = useI18n();
  return (
    <PageWrapper noPadding>
      <EncabezadoPagina titulo={t('nav.teaching')} />
    </PageWrapper>
  );
};
