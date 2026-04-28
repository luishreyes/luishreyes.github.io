import React from 'react';

type LazyComponent = React.LazyExoticComponent<React.ComponentType<unknown>>;

export const readingsRegistry: Record<string, Record<string, LazyComponent>> = {
  'iqya-2031': {
    'bienvenida-pou': React.lazy(() => import('./iqya-2031/readings/bienvenida-pou')),
    'trabajo-en-equipo': React.lazy(() => import('./iqya-2031/readings/trabajo-en-equipo')),
    'busqueda-bibliografica': React.lazy(() => import('./iqya-2031/readings/busqueda-bibliografica')),
    'bitacoras-de-calculo': React.lazy(() => import('./iqya-2031/readings/bitacoras-de-calculo')),
    'informe-final': React.lazy(() => import('./iqya-2031/readings/informe-final')),
    'operaciones-unitarias': React.lazy(() => import('./iqya-2031/readings/operaciones-unitarias')),
    'propiedades-solidos': React.lazy(() => import('./iqya-2031/readings/propiedades-solidos')),
    'reduccion-tamano': React.lazy(() => import('./iqya-2031/readings/reduccion-tamano')),
    'transporte-liquidos': React.lazy(() => import('./iqya-2031/readings/transporte-liquidos')),
    'bombas': React.lazy(() => import('./iqya-2031/readings/bombas')),
    'agitacion': React.lazy(() => import('./iqya-2031/readings/agitacion')),
  },
  'iqya-3050': {
    'propuesta-valor': React.lazy(() => import('./iqya-3050/readings/propuesta-valor')),
    'flujogramas': React.lazy(() => import('./iqya-3050/readings/flujogramas')),
  },
};

export const getReadingComponent = (
  courseSlug: string,
  readingSlug: string,
): LazyComponent | undefined => {
  return readingsRegistry[courseSlug]?.[readingSlug];
};
