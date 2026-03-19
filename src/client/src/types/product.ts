export interface Product {
    id: string;
    name: string;
    imageUrl: string | null;
    brand: string | null;
    categories: string[];
}

export interface SearchProductRequest {
    typedWord?: string;
    page: number;
    pageSize: number;

    brands: string[] | undefined;
    categories: string[] | undefined;
}