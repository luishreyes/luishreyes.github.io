import React from 'react';

type LazyComponent = React.LazyExoticComponent<React.ComponentType<unknown>>;

export const readingsRegistry: Record<string, Record<string, LazyComponent>> = {
  'iqya-2031': {
    'bienvenida-pou': React.lazy(() => import('./iqya-2031/readings/bienvenida-pou')),
    'trabajo-en-equipo': React.lazy(() => import('./iqya-2031/readings/trabajo-en-equipo')),
  },
};

export const getReadingComponent = (
  courseSlug: string,
  readingSlug: string,
): LazyComponent | undefined => {
  return readingsRegistry[courseSlug]?.[readingSlug];
};
