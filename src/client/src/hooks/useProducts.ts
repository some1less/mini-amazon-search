import type {Product, SearchProductRequest} from "../types/product.ts";
import {useEffect, useState, useRef} from "react";
import {fetchProducts} from "../api/productApi.ts";

export const useProducts = (request: SearchProductRequest) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);

    const brandsKey = request.brands?.join(',') || '';
    const categoriesKey = request.categories?.join(',') || '';

    const prevSearchRef = useRef({
        typedWord: request.typedWord,
        brandsKey,
        categoriesKey
    });

    useEffect(() => {
        const abortController = new AbortController();

        const loadProducts = async () => {
            setLoading(true);
            setError(null);

            const isNewSearch =
                prevSearchRef.current.typedWord !== request.typedWord ||
                prevSearchRef.current.brandsKey !== brandsKey ||
                prevSearchRef.current.categoriesKey !== categoriesKey;

            if (isNewSearch) {
                setProducts([]);
            }

            try {
                const data = await fetchProducts(request);
                if (!abortController.signal.aborted) {
                    setProducts(prev => request.page === 1 ? data : [...prev, ...data]);

                    setHasMore(data.length === request.pageSize);
                }
            } catch (err: any) {
                if (!abortController.signal.aborted) setError(err.message);
            } finally {
                if (!abortController.signal.aborted) {
                    setLoading(false);
                    prevSearchRef.current = { typedWord: request.typedWord, brandsKey, categoriesKey };
                }
            }
        };

        loadProducts();

        return () => {
            abortController.abort();
        };
    }, [request.typedWord, request.page, request.pageSize, brandsKey, categoriesKey]);

    return {products, loading, error, hasMore};
};