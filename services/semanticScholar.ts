// NOTE: This service has been updated to use OpenAlex, Semantic Scholar, and SerpApi (Google Scholar).
import type { Product } from '../types';

// --- OpenAlex API ---
const OPENALEX_API_BASE_URL = 'https://api.openalex.org/works';
const BATCH_SIZE = 50; // OpenAlex API allows up to 50 OR filters

const fetchFromOpenAlexByDoi = async (dois: string[], onProgressUpdate: (updates: Record<string, number | null>) => void): Promise<void> => {
    if (dois.length === 0) return;

    const batches: string[][] = [];
    for (let i = 0; i < dois.length; i += BATCH_SIZE) {
        batches.push(dois.slice(i, i + BATCH_SIZE));
    }

    try {
        for (const batch of batches) {
            const filterValue = `doi:${batch.join('|')}`;
            const params = new URLSearchParams({
                'filter': filterValue,
                'select': 'doi,cited_by_count',
                'mailto': 'lh.reyes@uniandes.edu.co',
            });
            const url = `${OPENALEX_API_BASE_URL}?${params.toString()}`;
            
            try {
                const response = await fetch(url, { mode: 'cors' });
                if (!response.ok) {
                    console.error(`OpenAlex API request failed for batch`, await response.text());
                } else {
                    const data = await response.json();
                    const results = data.results || [];
                    const batchCounts: Record<string, number | null> = {};
                    results.forEach((result: any) => {
                        if (result && result.doi && typeof result.cited_by_count === 'number') {
                            const shortDoi = result.doi.replace('https://doi.org/', '');
                            batchCounts[shortDoi] = result.cited_by_count;
                        }
                    });
                     if (Object.keys(batchCounts).length > 0) {
                        onProgressUpdate(batchCounts);
                    }
                }
            } catch (batchError) {
                console.error(`Network error during OpenAlex batch request:`, batchError);
            }

            // Add a delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 110)); // ~9 requests per second
        }
    } catch (error) {
        console.error(`Error fetching batch citation counts from OpenAlex:`, error);
    }
};

const sanitizeTitleForSearch = (title: string): string => {
    // Remove characters that might break the OpenAlex search filter, like single/double quotes and commas.
    return title.replace(/['",]/g, '');
};

const fetchFromOpenAlexByTitle = async (product: Product): Promise<number | null> => {
    try {
        const sanitizedTitle = sanitizeTitleForSearch(product.title);
        
        // Make the search more specific by including the first author's last name to prevent 500 errors on generic titles.
        const firstAuthorLastName = product.authors[0]?.split(' ').pop()?.toLowerCase();
        let filterValue = `title.search:"${sanitizedTitle}"`;
        if (firstAuthorLastName) {
            filterValue += `,raw_author_name.search:${firstAuthorLastName}`;
        }
        
        const params = new URLSearchParams({
            'filter': filterValue,
            'select': 'doi,cited_by_count,authorships',
            'mailto': 'lh.reyes@uniandes.edu.co',
        });
        const url = `${OPENALEX_API_BASE_URL}?${params.toString()}`;

        const response = await fetch(url, { mode: 'cors' });
        if (!response.ok) {
            // Check for JSON error response first
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                console.error(`OpenAlex API request failed for title "${product.title}"`, JSON.stringify(errorData));
            } else {
                 console.error(`OpenAlex API request failed for title "${product.title}"`, await response.text());
            }
            return null;
        }
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const productAuthors = product.authors.map(a => a.toLowerCase());
            for (const result of data.results) {
                const resultAuthors = result.authorships.map((a: any) => a.author.display_name.toLowerCase());
                const authorLastName = (author: string) => author.split(' ').pop() || '';
                const authorOverlap = productAuthors.filter(author => resultAuthors.some((resAuthor: string) => resAuthor.includes(authorLastName(author)))).length;
                if (authorOverlap > 0) {
                    return result.cited_by_count;
                }
            }
            if (data.results.length === 1) {
                return data.results[0].cited_by_count;
            }
        }
        return null;
    } catch (error) {
        console.error(`Error fetching citation count from OpenAlex for title "${product.title}":`, error);
        return null;
    }
};

// --- Semantic Scholar API ---
const SEMANTIC_SCHOLAR_API_BASE_URL = 'https://api.semanticscholar.org/graph/v1/paper/batch';

const fetchFromSemanticScholar = async (products: Product[], onProgressUpdate: (updates: Record<string, number | null>) => void): Promise<void> => {
    if (products.length === 0) return;

    const SEMANTIC_BATCH_SIZE = 500;
    const batches: Product[][] = [];
    for (let i = 0; i < products.length; i += SEMANTIC_BATCH_SIZE) {
        batches.push(products.slice(i, i + SEMANTIC_BATCH_SIZE));
    }

    try {
        const batchPromises = batches.map(async (batch) => {
            const paperIds = batch.map(p => p.corpusId ? `CorpusID:${p.corpusId}` : `DOI:${p.doi}`);
            try {
                const response = await fetch(`${SEMANTIC_SCHOLAR_API_BASE_URL}?fields=citationCount,externalIds`, {
                    method: 'POST',
                    mode: 'cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: paperIds }),
                });

                if (!response.ok) {
                    console.error(`Semantic Scholar API request failed for batch`, await response.text());
                    return;
                }
                const data: any[] = await response.json();
                const results = data.filter(p => p !== null);
                const batchCounts: Record<string, number | null> = {};
                results.forEach(result => {
                     if (result && result.externalIds && result.externalIds.DOI && typeof result.citationCount === 'number') {
                        const doi = result.externalIds.DOI;
                        batchCounts[doi] = result.citationCount;
                    }
                });
                if (Object.keys(batchCounts).length > 0) {
                    onProgressUpdate(batchCounts);
                }
            } catch (batchError) {
                 console.error(`Network error during Semantic Scholar batch request:`, batchError);
            }
        });

        await Promise.all(batchPromises);

    } catch (error) {
        console.error(`Error fetching batch citation counts from Semantic Scholar:`, error);
    }
};

/**
 * Fetches citation counts for a list of products from multiple sources,
 * calling a progress callback with results as they become available.
 * @param products An array of product objects.
 * @param onProgressUpdate A callback function to handle incremental updates.
 */
export const fetchBatchCitationCounts = async (
    products: Product[], 
    onProgressUpdate: (updates: Record<string, number | null>) => void
): Promise<void> => {
    
    const productsWithValidDoi = products.filter(p => p.doi && p.doi.startsWith('10.'));
    const productsWithoutValidDoi = products.filter(p => !p.doi || !p.doi.startsWith('10.'));

    const validDois = productsWithValidDoi.map(p => p.doi);
    
    const productsForSemanticScholar = products.filter(p => (p.doi && p.doi.startsWith('10.')) || p.corpusId);

    if (productsForSemanticScholar.length === 0 && productsWithoutValidDoi.length === 0) {
        return;
    }

    const promises = [];

    // Fetch from OpenAlex by DOI (streams updates via callback)
    promises.push(fetchFromOpenAlexByDoi(validDois, onProgressUpdate));

    // Fetch from Semantic Scholar (streams updates via callback)
    promises.push(fetchFromSemanticScholar(productsForSemanticScholar, onProgressUpdate));
    
    // Fetch from OpenAlex by Title sequentially (streams updates via callback)
    const fetchTitlesAndUpdate = async () => {
        for (const p of productsWithoutValidDoi) {
            const count = await fetchFromOpenAlexByTitle(p);
            if (count !== null) {
                 onProgressUpdate({ [p.doi]: count });
            }
            // Throttle requests to respect API rate limits
            await new Promise(resolve => setTimeout(resolve, 110)); // ~9 req/s
        }
    }
    promises.push(fetchTitlesAndUpdate());

    // Wait for all fetching processes to complete
    await Promise.all(promises);
};
