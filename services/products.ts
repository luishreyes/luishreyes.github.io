/// <reference types="vite/client" />
import type { Product, ProductType, ResearchArea, LaymanSummaryPoint } from '../types';

/**
 * La producción académica (artículos, capítulos, libros, patentes…) vive en
 * `public/data/products.json`, versionado en el repositorio: para agregar o
 * corregir un producto se edita ese archivo en GitHub y el deploy lo publica.
 * Antes venía de Supabase; `scripts/export-supabase.mjs` hizo la migración.
 *
 * Cada entrada tiene la forma de `Product` más `citations` (número de citas o
 * null). Los campos de lista que falten se toman como vacíos, para que una
 * entrada escrita a mano no rompa la página.
 */
export const PRODUCTS_URL = `${import.meta.env.BASE_URL}data/products.json`;

type ProductRecord = Partial<Product> & { citations?: number | null };

const list = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

export const fetchInitialData = async (): Promise<{ products: Product[], dbCitations: Record<string, number | null> }> => {
    try {
        // no-cache: revalida contra el servidor (ETag), así una edición recién
        // desplegada se ve sin esperar a que caduque la caché del navegador.
        const response = await fetch(PRODUCTS_URL, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`HTTP ${response.status} al leer ${PRODUCTS_URL}`);

        const records: unknown = await response.json();
        if (!Array.isArray(records)) throw new Error(`${PRODUCTS_URL} no es un arreglo`);

        const dbCitations: Record<string, number | null> = {};
        const products: Product[] = (records as ProductRecord[]).map((p) => {
            if (p.doi) {
                dbCitations[p.doi] = typeof p.citations === 'number' ? p.citations : null;
            }
            return {
                title: p.title as string,
                type: p.type as ProductType,
                publicationVenue: p.publicationVenue as string,
                publicationDate: p.publicationDate as string,
                doi: p.doi as string,
                corpusId: p.corpusId,
                url: p.url,
                imageUrl: p.imageUrl as string,
                status: p.status,
                authors: list<string>(p.authors),
                keywords: list<string>(p.keywords),
                researchAreas: list<ResearchArea>(p.researchAreas),
                laymanSummary: list<LaymanSummaryPoint>(p.laymanSummary),
            };
        });

        return { products, dbCitations };
    } catch (err: any) {
        console.error("An error occurred in fetchInitialData: ", err.message);
        return { products: [], dbCitations: {} };
    }
};
