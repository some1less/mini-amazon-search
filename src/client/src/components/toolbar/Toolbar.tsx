import { type FormEvent, useEffect, useState, useRef } from "react";
import { fetchTopBrands, fetchTopCategories } from "../../api/productApi.ts";
import './Toolbar.css';

interface Props {
    initialQuery: string;
    onSearch: (query: string) => void;
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
    selectedBrands: string[];
    onBrandsChange: (brands: string[]) => void;
    selectedCategories: string[];
    onCategoriesChange: (categories: string[]) => void;
    clearAll: () => void;
}

export const Toolbar = ({
                            initialQuery, onSearch,
                            selectedBrands, onBrandsChange,
                            selectedCategories, onCategoriesChange, clearAll
                        }: Props) => {
    const [inputValue, setInputValue] = useState(initialQuery);
    const filterWrapperRef = useRef<HTMLDivElement>(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const [expandedFilter, setExpandedFilter] = useState<'none' | 'brands' | 'categories'>('none');
    const [topBrands, setTopBrands] = useState<string[]>([]);
    const [topCategories, setTopCategories] = useState<string[]>([]);

    const isSearchDisabled = inputValue.trim().length === 0 && initialQuery.trim().length === 0;

    useEffect(() => {
        fetchTopBrands().then(setTopBrands).catch(console.error);
        fetchTopCategories().then(setTopCategories).catch(console.error);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (filterWrapperRef.current && !filterWrapperRef.current.contains(target)) {
                setShowFilterDropdown(false);
                setExpandedFilter('none');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSearchDisabled) return;
        onSearch(inputValue);
        setShowFilterDropdown(false);
        setExpandedFilter('none');
    };

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
        if (showFilterDropdown) setExpandedFilter('none');
    }

    const handleBrandToggle = (brand: string) => {
        const newBrands = selectedBrands.includes(brand)
            ? selectedBrands.filter(b => b !== brand)
            : [...selectedBrands, brand];
        onBrandsChange(newBrands);
    }

    const handleCategoryToggle = (category: string) => {
        const newCats = selectedCategories.includes(category)
            ? selectedCategories.filter(c => c !== category)
            : [...selectedCategories, category];
        onCategoriesChange(newCats);
    }

    const totalActiveFilters = selectedBrands.length + selectedCategories.length;

    return (
        <div className="toolbar-container">
            <form onSubmit={handleSubmit} className="combined-form">

                <div className="filter-dropdown-wrapper" ref={filterWrapperRef}>
                    <button type="button" className="filter-btn-left" onClick={toggleFilterDropdown}>
                        Filters {totalActiveFilters > 0 && <span className="filter-badge-count">{totalActiveFilters}</span>}
                        <svg className={`dropdown-icon ${showFilterDropdown ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <div className={`filter-dropdown ${showFilterDropdown ? 'show' : ''}`}>
                        <div className="filter-options-vertical">

                            <div className="filter-accordion-group">
                                <button type="button"
                                        className={`filter-option-clean-btn ${expandedFilter === 'brands' ? 'active' : ''}`}
                                        onClick={() => setExpandedFilter(expandedFilter === 'brands' ? 'none' : 'brands')}>
                                    Brands
                                </button>
                                <div className={`filter-accordion-content ${expandedFilter === 'brands' ? 'open' : ''}`}>
                                    {topBrands.map(brand => (
                                        <label key={brand} className="custom-checkbox-label">
                                            <input type="checkbox"
                                                   checked={selectedBrands.includes(brand)}
                                                   onChange={() => handleBrandToggle(brand)} />
                                            <span className="checkmark"></span>
                                            <span className="checkbox-text">{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="filter-accordion-group">
                                <button type="button"
                                        className={`filter-option-clean-btn ${expandedFilter === 'categories' ? 'active' : ''}`}
                                        onClick={() => setExpandedFilter(expandedFilter === 'categories' ? 'none' : 'categories')}>
                                    Categories
                                </button>
                                <div className={`filter-accordion-content ${expandedFilter === 'categories' ? 'open' : ''}`}>
                                    {topCategories.map(category => (
                                        <label key={category} className="custom-checkbox-label">
                                            <input type="checkbox"
                                                   checked={selectedCategories.includes(category)}
                                                   onChange={() => handleCategoryToggle(category)} />
                                            <span className="checkmark"></span>
                                            <span className="checkbox-text">{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search for snacks, drinks, or any groceries..."
                    className="search-input-sleek"
                />

                <button type="submit" className={`search-button-right ${isSearchDisabled ? 'disabled' : ''}`} disabled={isSearchDisabled}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>

            </form>

            {totalActiveFilters > 0 && (
                <div className="active-filters-container">
                    {selectedBrands.map(brand => (
                        <div key={`active-brand-${brand}`} className="active-filter-pill brand-pill">
                            {brand}
                            <button type="button" className="pill-remove-btn" onClick={() => handleBrandToggle(brand)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    ))}
                    {selectedCategories.map(category => (
                        <div key={`active-cat-${category}`} className="active-filter-pill cat-pill">
                            {category}
                            <button type="button" className="pill-remove-btn" onClick={() => handleCategoryToggle(category)}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    ))}
                    {totalActiveFilters > 1 && (
                        <button
                            type="button"
                            className="clear-all-filters-btn"
                            onClick={clearAll}
                        >
                            Clear all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};