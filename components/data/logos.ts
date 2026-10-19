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

/** Logos de las demás páginas, en la misma carpeta y con la misma regla: `ratio` es ancho/alto del viewBox. */
export interface LogoInstitucion {
  slug: string;
  ratio: number;
  name: Localized;
}

/** Quién otorgó cada reconocimiento, en el orden de la línea de tiempo de la página. */
export const logosReconocimiento: LogoInstitucion[] = [
  { slug: 'openai', ratio: 0.988, name: 'OpenAI' },
  { slug: 'aiche', ratio: 1.409, name: { en: 'AIChE Education Division', es: 'División de Educación del AIChE' } },
  { slug: 'mdpi', ratio: 1.513, name: 'Pharmaceutics (MDPI)' },
  { slug: 'academia-nacional-medicina', ratio: 0.911, name: { en: 'National Academy of Medicine of Colombia', es: 'Academia Nacional de Medicina de Colombia' } },
  { slug: 'fundacion-angel-escobar', ratio: 1.321, name: 'Fundación Alejandro Ángel Escobar' },
  { slug: 'minciencias', ratio: 1.224, name: { en: 'Ministry of Science, Technology and Innovation (Minciencias)', es: 'Ministerio de Ciencia, Tecnología e Innovación (Minciencias)' } },
  { slug: 'academia-joven', ratio: 2.256, name: 'Academia Joven de Colombia' },
  { slug: 'uniandes', ratio: 3.311, name: 'Universidad de los Andes' },
  { slug: 'cpiq', ratio: 1.563, name: 'Consejo Profesional de Ingeniería Química de Colombia (CPIQ)' },
  { slug: 'uis', ratio: 2.072, name: 'Universidad Industrial de Santander' },
  { slug: 'nrel', ratio: 3.769, name: 'National Renewable Energy Laboratory (NREL)' },
  { slug: 'es-tiempo-de-volver', ratio: 2.949, name: { en: 'Es Tiempo de Volver (Colciencias)', es: 'Es Tiempo de Volver (Colciencias)' } },
];

/** Donde he estudiado, trabajado o me he formado, en orden de llegada. */
export const logosTrayectoria: LogoInstitucion[] = [
  { slug: 'uis', ratio: 2.072, name: 'Universidad Industrial de Santander' },
  { slug: 'ecopetrol', ratio: 3.164, name: 'Ecopetrol' },
  { slug: 'texas-am', ratio: 1, name: 'Texas A&M University' },
  { slug: 'genomatica', ratio: 3.332, name: 'Genomatica' },
  { slug: 'nrel', ratio: 3.769, name: 'National Renewable Energy Laboratory (NREL)' },
  { slug: 'jgi', ratio: 1.983, name: 'Joint Genome Institute (JGI)' },
  { slug: 'javeriana', ratio: 0.76, name: 'Pontificia Universidad Javeriana' },
  { slug: 'uamerica', ratio: 1.099, name: 'Fundación Universidad de América' },
  { slug: 'uniandes', ratio: 3.311, name: 'Universidad de los Andes' },
];

/** El logo de cada revista de cuyo comité editorial es miembro, por el nombre de la revista. */
export const logosComites: Record<string, LogoInstitucion> = {
  'Education for Chemical Engineers': { slug: 'icheme-ece', ratio: 1, name: 'Education for Chemical Engineers (IChemE)' },
  'Scientific Reports': { slug: 'scientific-reports', ratio: 1, name: 'Scientific Reports' },
  'Discover Biotechnology': { slug: 'discover', ratio: 4.011, name: 'Discover Biotechnology' },
};
