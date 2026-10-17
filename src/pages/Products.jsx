import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, RefreshCw, Flame, Check } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';
  const initialDealsOnly = searchParams.get('deal') === 'true';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [dealsOnly, setDealsOnly] = useState(initialDealsOnly);
  const [sortBy, setSortBy] = useState('featured');

  // Sync state if URL parameter changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && categories.includes(cat)) {
      setSelectedCategory(cat);
    } else if (!cat) {
      setSelectedCategory('All');
    }

    const search = searchParams.get('search');
    if (search !== null) {
      setSearchQuery(search);
    }

    const dealParam = searchParams.get('deal');
    setDealsOnly(dealParam === 'true');
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const toggleDealsOnly = () => {
    const nextState = !dealsOnly;
    setDealsOnly(nextState);
    const newParams = new URLSearchParams(searchParams);
    if (nextState) {
      newParams.set('deal', 'true');
    } else {
      newParams.delete('deal');
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setDealsOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.trim().toLowerCase());
      const matchesDeals = !dealsOnly || item.isDeal;
      return matchesCategory && matchesSearch && matchesDeals;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCategory, searchQuery, dealsOnly, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header & Description */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold mb-3">
          <span>Joy Mart Certified Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
          All Gadgets & Tech Gear
        </h1>
        <p className="mt-2 text-sm text-stone-500 max-w-xl">
          Original smartphones, Apple & Windows laptops, studio audio, and everyday tech accessories with official Bangladesh warranty.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Joy Mart gadgets by name or specs..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter: Deals Toggle & Sort */}
          <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
            <button
              onClick={toggleDealsOnly}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                dealsOnly
                  ? 'bg-amber-500 border-amber-600 text-stone-950'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Flash Deals Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-700 focus:outline-none focus:border-stone-900"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-stone-100 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-950'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Reset Controls */}
      <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
        <span>
          Showing <strong className="text-stone-900">{filteredProducts.length}</strong> of{' '}
          {products.length} Joy Mart gadgets
        </span>
        {(searchQuery || selectedCategory !== 'All' || dealsOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-stone-800 hover:text-stone-950 font-bold inline-flex items-center gap-1 hover:underline"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset all filters</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty / No Results State */
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-300 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-500 mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">No gadgets found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            We couldn't find any products matching your criteria. Try adjusting your search keyword or switching categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

    </div>
  );
}
