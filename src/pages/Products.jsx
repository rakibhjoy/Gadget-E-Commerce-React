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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FBE9DC] text-[#E98545] text-xs font-semibold mb-3">
          <span>Joy Mart Certified Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">
          All Gadgets & Tech Gear
        </h1>
        <p className="mt-2 text-sm text-[#777777] max-w-xl">
          Original smartphones, Apple & Windows laptops, studio audio, and everyday tech accessories with official Bangladesh warranty.
        </p>
      </div>

      {/* Search and Filters Bar — Glass */}
      <div className="glass rounded-2xl p-4 sm:p-5 mb-8 shadow-glass-card space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-between">
          
          {/* Search Box */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Joy Mart gadgets by name or specs..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#F3F1ED] border border-[#E7E5E1] rounded-xl focus:outline-none focus:border-[#E98545] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#252525]"
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
                  ? 'bg-[#E98545] border-[#D6742F] text-white'
                  : 'bg-[#F3F1ED] border-[#E7E5E1] text-[#252525] hover:bg-[#FBE9DC]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Flash Deals Only</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#777777]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs sm:text-sm bg-[#F3F1ED] border border-[#E7E5E1] rounded-xl px-3 py-2 text-[#252525] focus:outline-none focus:border-[#E98545]"
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
        <div className="flex items-center gap-2 overflow-x-auto pt-3 border-t border-[#E7E5E1] no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#E98545] text-white shadow-xs'
                    : 'bg-[#F3F1ED] text-[#777777] hover:bg-[#FBE9DC] hover:text-[#E98545]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Reset Controls */}
      <div className="flex items-center justify-between text-xs text-[#777777] mb-6">
        <span>
          Showing <strong className="text-[#252525]">{filteredProducts.length}</strong> of{' '}
          {products.length} Joy Mart gadgets
        </span>
        {(searchQuery || selectedCategory !== 'All' || dealsOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-[#252525] hover:text-[#E98545] font-bold inline-flex items-center gap-1 hover:underline"
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
        <div className="text-center py-20 glass rounded-3xl border border-dashed border-[#E7E5E1] shadow-glass-card">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F3F1ED] flex items-center justify-center text-[#777777] mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-[#252525]">No gadgets found</h3>
          <p className="text-xs text-[#777777] mt-1 max-w-sm mx-auto">
            We couldn't find any products matching your criteria. Try adjusting your search keyword or switching categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 bg-[#E98545] hover:bg-[#D6742F] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Clear Search & Filters
          </button>
        </div>
      )}

    </div>
  );
}
