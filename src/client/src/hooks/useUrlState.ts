import {useSearchParams} from "react-router-dom";
import type {SearchProductRequest} from "../types/product.ts";

export const useUrlState = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const typedWord = searchParams.get('query') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const brands = searchParams.getAll('brand');
    const categories = searchParams.getAll('category');

    const updateSearch = (newWord: string) => {
        setSearchParams(prev => {
            if (newWord) prev.set('query', newWord);
            else prev.delete('query');
            prev.set('page', '1');
            return prev;
        });
    };

    const updatePage = (newPage: number) => {
        setSearchParams(prev => {
            prev.set('page', newPage.toString());
            return prev;
        });
    };

    const updatePageSize = (newPageSize: number) => {
        setSearchParams(prev => {
            prev.set('pageSize', newPageSize.toString());
            prev.set('page', '1');
            return prev;
        });
    };

    const updateBrands = (newBrands: string[]) => {
        setSearchParams(prev => {
            prev.delete('brand');
            if (newBrands && newBrands.length > 0) {
                newBrands.forEach(b => prev.append('brand', b));
            }
            prev.set('page', '1');
            return prev;
        });
    };

    const updateCategories = (newCategories: string[]) => {
        setSearchParams(prev => {
            prev.delete('category');
            if (newCategories && newCategories.length > 0) {
                newCategories.forEach(c => prev.append('category', c));
            }
            prev.set('page', '1');
            return prev;
        });
    };

    const clearAllFilters = () => {
        setSearchParams(prev => {
            prev.delete('brand');
            prev.delete('category');
            prev.set('page', '1');
            return prev;
        });
    };
    
    const requestParams: SearchProductRequest = {
        typedWord,
        page,
        pageSize,
        brands: brands.length > 0 ? brands : undefined,
        categories: categories.length > 0 ? categories : undefined
    };

    return {
        requestParams,
        updateSearch,
        updatePage,
        updatePageSize,
        updateBrands,
        updateCategories,
        clearAllFilters
    };
};