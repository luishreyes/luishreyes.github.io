
import { createClient } from '@supabase/supabase-js';
import type { Product, ResearchArea, ProductType, LaymanSummaryPoint } from '../types';

const supabaseUrl = 'https://ourwyskhfdesnmnhlxof.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91cnd5c2toZmRlc25tbmhseG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMTQ3MDcsImV4cCI6MjA3MTg5MDcwN30.yCcUo1nnelUTN1IPXMuDj9mhrc-6I1589adbLz7bAf8';
const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchInitialData = async (): Promise<{ products: Product[], dbCitations: Record<string, number | null> }> => {
    try {
        const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*');

        if (productsError) {
            console.error('Error fetching base products from Supabase:', productsError);
            throw new Error(productsError.message);
        }
        if (!productsData) return { products: [], dbCitations: {} };
        
        const dbCitations: Record<string, number | null> = {};
        productsData.forEach((product: any) => {
            if (product.doi) {
                 dbCitations[product.doi] = typeof product.citations === 'number' ? product.citations : null;
            }
        });

        const productIds = productsData.map(p => p.id).filter(id => id != null);
        if (productIds.length === 0) return { products: [], dbCitations };

        const [
            authorsResponse,
            keywordsResponse,
            researchAreasResponse,
            summariesResponse
        ] = await Promise.all([
            supabase.from('products_authors').select('product_id, authors!inner(name)').in('product_id', productIds).order('product_id').order('position'),
            supabase.from('products_keywords').select('product_id, keywords!inner(keyword)').in('product_id', productIds),
            supabase.from('products_research_areas').select('product_id, research_areas!inner(area)').in('product_id', productIds),
            supabase.from('layman_summaries').select('product_id, question, answer').in('product_id', productIds).order('product_id').order('id')
        ]);

        if (authorsResponse.error) throw new Error(`Authors fetch failed: ${authorsResponse.error.message}`);
        if (keywordsResponse.error) throw new Error(`Keywords fetch failed: ${keywordsResponse.error.message}`);
        if (researchAreasResponse.error) throw new Error(`Research Areas fetch failed: ${researchAreasResponse.error.message}`);
        if (summariesResponse.error) throw new Error(`Summaries fetch failed: ${summariesResponse.error.message}`);

        const authorsMap = (authorsResponse.data || []).reduce((acc, item) => {
            const author = Array.isArray(item.authors) ? item.authors[0] : item.authors;
            if (author?.name) {
                if (!acc.has(item.product_id)) acc.set(item.product_id, []);
                acc.get(item.product_id)!.push(author.name);
            }
            return acc;
        }, new Map<number, string[]>());

        const keywordsMap = (keywordsResponse.data || []).reduce((acc, item) => {
            const keyword = Array.isArray(item.keywords) ? item.keywords[0] : item.keywords;
            if (keyword?.keyword) {
                if (!acc.has(item.product_id)) acc.set(item.product_id, []);
                acc.get(item.product_id)!.push(keyword.keyword);
            }
            return acc;
        }, new Map<number, string[]>());
        
        const researchAreasMap = (researchAreasResponse.data || []).reduce((acc, item) => {
            const researchArea = Array.isArray(item.research_areas) ? item.research_areas[0] : item.research_areas;
            if (researchArea?.area) {
                if (!acc.has(item.product_id)) acc.set(item.product_id, []);
                acc.get(item.product_id)!.push(researchArea.area as ResearchArea);
            }
            return acc;
        }, new Map<number, ResearchArea[]>());

        const summariesMap = (summariesResponse.data || []).reduce((acc, item) => {
            if (item.question && item.answer) {
                if (!acc.has(item.product_id)) acc.set(item.product_id, []);
                acc.get(item.product_id)!.push({ question: item.question, answer: item.answer });
            }
            return acc;
        }, new Map<number, LaymanSummaryPoint[]>());

        const products: Product[] = productsData.map((p: any) => ({
            title: p.title,
            type: p.type as ProductType,
            publicationVenue: p.publication_venue,
            publicationDate: p.publication_date,
            doi: p.doi,
            corpusId: p.corpus_id,
            url: p.url,
            imageUrl: p.image_url,
            status: p.status,
            authors: authorsMap.get(p.id) || [],
            keywords: keywordsMap.get(p.id) || [],
            researchAreas: researchAreasMap.get(p.id) || [],
            laymanSummary: summariesMap.get(p.id) || [],
        }));

        return { products, dbCitations };
    } catch (err: any) {
        console.error("An error occurred in fetchInitialData: ", err.message);
        return { products: [], dbCitations: {} };
    }
};
