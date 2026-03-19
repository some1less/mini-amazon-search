import { type FormEvent, useEffect, useState, useRef } from "react";
import './Toolbar.css';

interface Props {
    initialQuery: string;
    onSearch: (query: string) => void;
    page: number;
    onPageChange: (page: number) => void;
    pageSize: number;
    onPageSizeChange: (size: number) => void;
}

export const Toolbar = ({ initialQuery, onSearch }: Props) => {
    const [inputValue, setInputValue] = useState(initialQuery);

    const filterWrapperRef = useRef<HTMLDivElement>(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const isSearchDisabled = inputValue.trim().length === 0 && initialQuery.trim().length === 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (filterWrapperRef.current && !filterWrapperRef.current.contains(target)) {
                setShowFilterDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isSearchDisabled) return;

        onSearch(inputValue);
        setShowFilterDropdown(false);
    };

    const toggleFilterDropdown = () => {
        setShowFilterDropdown(!showFilterDropdown);
    }

    return (
        <div className="toolbar-container">
            <form onSubmit={handleSubmit} className="combined-form">

                <div className="filter-dropdown-wrapper" ref={filterWrapperRef}>
                    <button type="button" className="filter-btn-left" onClick={toggleFilterDropdown}>
                        Filters
                        <svg className={`dropdown-icon ${showFilterDropdown ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    <div className={`filter-dropdown ${showFilterDropdown ? 'show' : ''}`}>
                        <div className="filter-options-vertical">
                            <button type="button" className="filter-option-clean-btn">Brands</button>
                            <button type="button" className="filter-option-clean-btn">Categories</button>
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

                <button
                    type="submit"
                    className={`search-button-right ${isSearchDisabled ? 'disabled' : ''}`}
                    disabled={isSearchDisabled}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </button>

            </form>
        </div>
    );
};