import { useUrlState } from './hooks/useUrlState';
import { useProducts } from './hooks/useProducts';
import { Toolbar } from './components/toolbar/Toolbar';
import { ProductGrid } from './components/product/ProductGrid';

function App() {
    const { requestParams, 
        updateSearch, updatePage, updatePageSize, updateBrands, updateCategories, clearAllFilters } = useUrlState();

    const { products, loading, error, hasMore } = useProducts(requestParams);

    const handleLoadMore = () => {
        updatePage(requestParams.page + 1);
    };

    return (
        <div style={{ 
            padding: '20px', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center' }}>

            <h1 style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '2.5rem',
                color: '#383737',
                marginBottom: '20px',
                marginTop: '60px',
                fontWeight: 550
            }}>
                It's like Amazon search, but w
                <span style={{ color: '#2ed9ff' }}>aaaaa</span>
                y simpler
            </h1>

            <Toolbar
                initialQuery={requestParams.typedWord || ''}
                onSearch={updateSearch}
                page={requestParams.page}
                onPageChange={updatePage}
                pageSize={requestParams.pageSize}
                onPageSizeChange={updatePageSize}

                selectedBrands={requestParams.brands || []}
                onBrandsChange={updateBrands}
                selectedCategories={requestParams.categories || []}
                onCategoriesChange={updateCategories}
                clearAll={clearAllFilters}
            />

            <ProductGrid
                products={products}
                loading={loading && requestParams.page === 1}
                error={error}
            />

            {products.length > 0 && hasMore && !error && (
                <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    style={{
                        marginTop: '30px',
                        padding: '12px 32px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        backgroundColor: '#f4f5f7',
                        color: '#333',
                        border: '1px solid #e5e7eb',
                        borderRadius: '999px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        fontFamily: 'system-ui, sans-serif'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f4f5f7'}
                >
                    {loading ? 'Loading...' : 'Load More'}
                </button>
            )}

        </div>
    );
}

export default App;