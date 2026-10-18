import type { Localized } from '../../context/i18n';
import type { EdcoOrgId } from './edco';

/** Logos de las organizaciones para las que el profesor ha dictado formación, en
 *  public/images/portafolio/logos/, vectorizados en dos tonos de gris. `ratio` es ancho/alto
 *  del viewBox: el muro lo usa para darles a todos el mismo peso visual. Semillas del Futuro
 *  lleva dos logos, el de Huawei y el del Ministerio TIC. */
export interface Logo {
  slug: string;
  org: EdcoOrgId;
  ratio: number;
  /** Nombre para el texto alternativo cuando no es el de la organización. */
  alt?: Localized;
}

export const logosOrganizaciones: Logo[] = [
  { slug: 'contraloria', org: 'contraloria', ratio: 3.823 },
  { slug: 'seguros-bolivar', org: 'bolivar', ratio: 3.429 },
  { slug: 'uniandes', org: 'uniandes', ratio: 3.311 },
  { slug: 'bancolombia', org: 'bancolombia', ratio: 7.774 },
  { slug: 'ecopetrol', org: 'ecopetrol', ratio: 3.164 },
  { slug: 'abbott', org: 'abbott', ratio: 4.0 },
  { slug: 'armada', org: 'armada', ratio: 0.534 },
  { slug: 'bbva', org: 'bbva', ratio: 3.338 },
  { slug: 'davivienda', org: 'davivienda', ratio: 11.667 },
  { slug: 'produbanco', org: 'produbanco', ratio: 4.248 },
  { slug: 'cenipalma', org: 'cenipalma', ratio: 2.805 },
  { slug: 'cocrea', org: 'cocrea', ratio: 7.521 },
  { slug: 'eljuri', org: 'eljuri', ratio: 3.336 },
  { slug: 'vecol', org: 'vecol', ratio: 1.064 },
  { slug: 'ceiba', org: 'ceiba', ratio: 0.865 },
  { slug: 'fsfb', org: 'fsfb', ratio: 2.959 },
  { slug: 'huawei', org: 'semillas', ratio: 4.546, alt: 'Huawei Technologies' },
  {
    slug: 'mintic', org: 'semillas', ratio: 3.321,
    alt: { en: 'Ministry of Information and Communications Technologies (MinTIC)', es: 'Ministerio de Tecnologías de la Información y las Comunicaciones (MinTIC)' },
  },
  { slug: 'indra', org: 'indra', ratio: 3.82 },
  { slug: 'ingetec', org: 'ingetec', ratio: 4.827 },
  { slug: 'sutherland', org: 'sutherland', ratio: 6.486 },
];
