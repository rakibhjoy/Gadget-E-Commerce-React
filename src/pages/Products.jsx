import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, ChevronRight, Gamepad2, Grid2X2, Headphones, Laptop,
  PackageSearch, Plug, Search, SlidersHorizontal, Smartphone, Watch, X,
} from 'lucide-react';
import { catalog, categories, collectionIds, matchesQuery, productById, productPath, stockOf } from '../data/catalog';
import { useFavorites } from '../context/storeContexts';
import { formatBDT } from '../utils/format';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs, ProductImage } from '../components/StoreUI';

const categoryShortcuts = [
  ['All', 'All gadgets', Grid2X2],
  ['Smartphones', 'Phones', Smartphone],
  ['Laptops', 'Laptops', Laptop],
  ['Audio & Sound', 'Audio', Headphones],
  ['Smartwatches', 'Watches', Watch],
  ['Gaming & Gear', 'Gaming', Gamepad2],
  ['Accessories', 'Accessories', Plug],
];

const sortOptions = [
  ['featured', 'Featured'],
  ['price-low', 'Lowest price'],
  ['price-high', 'Highest price'],
  ['rating', 'Highest rated'],
];

const availabilityOptions = [
  ['', 'Any availability'],
  ['in-stock', 'In stock'],
  ['sold-out', 'Sold out'],
];

const pricePresets = [
  ['Under ৳10,000', '', '9999'],
  ['৳10,000–৳49,999', '10000', '49999'],
  ['৳50,000 and up', '50000', ''],
];

const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const invalidPrice = (value) => value !== '' && (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)));

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { recent, clearRecent } = useFavorites();
  const results = useRef(null);
  const category = categories.includes(params.get('category')) ? params.get('category') : 'All';
  const query = params.get('search') || '';
  const selectedSort = params.get('sort');
  const sort = sortOptions.some(([value]) => value === selectedSort) ? selectedSort : 'featured';
  const collection = params.get('collection');
  const collectionOrder = Object.hasOwn(collectionIds, collection) ? collectionIds[collection] : null;
  const collectionLabel = collection === 'new' ? 'New arrivals' : 'Bestsellers';
  const deals = params.get('deal') === 'true';
  const availability = params.get('availability') || '';
  const availabilityLabel = availability && availabilityOptions.find(([value]) => value === availability)?.[1];
  const min = params.get('min') || '';
  const max = params.get('max') || '';
  const base = catalog.filter((item) => category === 'All' || item.category === category);
  const brands = unique(base.map((item) => item.brand));
  const selectedBrand = params.get('brand');
  const brand = brands.includes(selectedBrand) ? selectedBrand : '';
  const specs = category === 'All' ? [] : unique(base.flatMap((item) => Object.keys(item.attributes)));
  const priceError = invalidPrice(min) || invalidPrice(max)
    ? 'Enter a whole amount of ৳0 or more.'
    : min !== '' && max !== '' && Number(min) > Number(max) ? 'Maximum must be at least the minimum.' : '';

  const items = base.filter((item) =>
    matchesQuery(item, query) &&
    (!deals || item.isDeal) &&
    (!collectionOrder || collectionOrder.includes(item.id)) &&
    (!brand || item.brand === brand) &&
    (availability !== 'in-stock' || stockOf(item) > 0) &&
    (availability !== 'sold-out' || stockOf(item) === 0) &&
    (priceError || ((!min || item.price >= Number(min)) && (!max || item.price <= Number(max)))) &&
    specs.every((spec) => !params.get('spec:' + spec) || params.get('spec:' + spec) === item.attributes[spec]),
  );
  if (sort === 'price-low') items.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
  else if (collectionOrder) items.sort((a, b) => collectionOrder.indexOf(a.id) - collectionOrder.indexOf(b.id));
  else items.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  const activeFilters = [
    ['search', query && 'Search “' + query + '”'],
    ['collection', collectionOrder && collectionLabel],
    ['brand', brand],
    ['availability', availabilityLabel],
    ['deal', deals && 'Deals only'],
    ['min', min && 'From ' + (invalidPrice(min) ? min : formatBDT(min))],
    ['max', max && 'Up to ' + (invalidPrice(max) ? max : formatBDT(max))],
    ...specs.map((spec) => {
      const key = 'spec:' + spec;
      const value = params.get(key);
      return [key, value && spec + ' · ' + value];
    }),
  ].filter(([, label]) => label);

  const title = category !== 'All' ? category : deals ? 'Deals' : collectionOrder ? collectionLabel : 'Shop all gadgets';
  const resultCount = items.length + (items.length === 1 ? ' product' : ' products');
  const recentProducts = recent.map((id) => productById[id]);
  const recommendationCategory = category === 'All' ? recentProducts[0]?.category : category;
  const recommendations = catalog
    .filter((item) => !recent.includes(item.id) && stockOf(item) > 0)
    .sort((a, b) => Number(b.category === recommendationCategory) - Number(a.category === recommendationCategory) ||
      Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating)
    .slice(0, 4);

  function updateFilters(changes, replace = false) {
    const next = new URLSearchParams(params);
    if (Object.hasOwn(changes, 'category')) {
      for (const name of [...next.keys()]) if (name.startsWith('spec:') || name === 'brand') next.delete(name);
    }
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (next.toString() !== params.toString()) setParams(next, { replace, preventScrollReset: true });
  }

  function resetFilters() {
    const next = new URLSearchParams();
    if (category !== 'All') next.set('category', category);
    if (sort !== 'featured') next.set('sort', sort);
    setParams(next, { preventScrollReset: true });
  }

  function focusResults(preventScroll = false) {
    requestAnimationFrame(() => results.current?.focus({ preventScroll }));
  }

  function search(event) {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('query').trim();
    updateFilters({ search: value });
    focusResults();
  }

  return (
    <div className="container page catalog-page">
      <Breadcrumbs items={[
        { label: 'Shop', to: category === 'All' ? undefined : '/products' },
        ...(category === 'All' ? [] : [{ label: category }]),
      ]} />
      <header className="catalog-hero">
        <div className="catalog-intro">
          <h1>{title}</h1>
          <p>{category === 'All' ? 'Find your next phone, laptop, headphones or gaming gear.' : 'Narrow your search by brand, price and specifications.'}</p>
          <form role="search" aria-label="Search this catalog" className="catalog-search" onSubmit={search}>
            <input key={query} name="query" type="search" aria-label="Search this catalog"
              defaultValue={query} placeholder="Search gadgets" />
            <button type="submit" className="button dark"><Search size={18} aria-hidden="true" /> Search</button>
          </form>
        </div>
        <picture className="catalog-hero-media" aria-hidden="true">
          <source media="(max-width: 1100px)" srcSet={import.meta.env.BASE_URL + 'joy-mart-audio-hero-small.jpg'} />
          <img src={import.meta.env.BASE_URL + 'joy-mart-audio-hero.jpg'} alt="" width="1536" height="1024" />
        </picture>
      </header>

      <div className="catalog-categories" role="group" aria-label="Filter by category">
        {categoryShortcuts.map(([value, label, Icon]) => (
          <button key={value} type="button" className="button catalog-category" aria-pressed={category === value}
            onClick={() => { if (category !== value) updateFilters({ category: value === 'All' ? '' : value }); }}>
            <Icon size={19} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      {recentProducts.length > 0 && (
        <section className="catalog-history" aria-labelledby="catalog-history-title">
          <div className="between">
            <h2 id="catalog-history-title">Recently viewed</h2>
            <button type="button" className="link-button" onClick={() => { clearRecent(); focusResults(); }}>Clear history</button>
          </div>
          <ul className="catalog-history-list">
            {recentProducts.map((item) => (
              <li key={item.id}>
                <Link className="catalog-history-card" to={productPath(item.id)}>
                  <ProductImage src={item.image} alt="" sizes="54px" />
                  <span><strong>{item.name}</strong><small>{formatBDT(item.price)}</small></span>
                  <ChevronRight size={17} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="shop-layout">
        <div className="catalog-toolbar">
          <p className="catalog-count" role="status">{resultCount}</p>
          <button type="button" className="button secondary filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters"
            onClick={() => setFiltersOpen((open) => !open)}>
            <SlidersHorizontal size={18} aria-hidden="true" /> {filtersOpen ? 'Hide filters' : 'Filters'}
            {activeFilters.length > 0 && <span>({activeFilters.length})</span>}
          </button>
          <label className="sort-label">Sort by
            <select value={sort} onChange={(event) => updateFilters({ sort: event.target.value === 'featured' ? '' : event.target.value })}>
              {sortOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
            </select>
          </label>
        </div>

        <aside id="catalog-filters" className={'filters' + (filtersOpen ? ' filters-open' : '')} aria-labelledby="catalog-filters-title">
          <div className="catalog-filter-head">
            <h2 id="catalog-filters-title"><SlidersHorizontal size={19} aria-hidden="true" /> Filters</h2>
            <button type="button" className="link-button" disabled={!activeFilters.length} onClick={() => { resetFilters(); focusResults(true); }}>Reset</button>
          </div>
          <label>Brand
            <select value={brand} onChange={(event) => updateFilters({ brand: event.target.value })}>
              <option value="">All brands</option>
              {brands.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <fieldset>
            <legend>Price in BDT</legend>
            <div className="price-presets">
              {pricePresets.map(([label, from, to]) => (
                <button type="button" className="chip" key={label} aria-pressed={min === from && max === to}
                  onClick={() => updateFilters(min === from && max === to ? { min: '', max: '' } : { min: from, max: to })}>
                  {label}
                </button>
              ))}
            </div>
            <div className="form-grid minmax">
              <label>Minimum
                <input type="number" min="0" step="1" placeholder="0" value={min} inputMode="numeric"
                  aria-invalid={Boolean(priceError)} aria-describedby={priceError ? 'catalog-price-error' : undefined}
                  onChange={(event) => updateFilters({ min: event.target.value }, true)} />
              </label>
              <label>Maximum
                <input type="number" min="0" step="1" placeholder="Any" value={max} inputMode="numeric"
                  aria-invalid={Boolean(priceError)} aria-describedby={priceError ? 'catalog-price-error' : undefined}
                  onChange={(event) => updateFilters({ max: event.target.value }, true)} />
              </label>
            </div>
            {priceError && <p className="error-text" id="catalog-price-error" role="alert">{priceError}</p>}
          </fieldset>
          <fieldset className="catalog-availability">
            <legend>Availability</legend>
            {availabilityOptions.map(([value, label]) => (
              <label className="check-label" key={value}>
                <input type="radio" name="catalog-availability" value={value} checked={value === '' ? !availabilityLabel : availability === value}
                  onChange={() => updateFilters({ availability: value })} />
                {label}
              </label>
            ))}
          </fieldset>
          <label className="check-label catalog-deals">
            <input type="checkbox" checked={deals} onChange={(event) => updateFilters({ deal: event.target.checked ? 'true' : '' })} />
            Deals only
          </label>
          {specs.length > 0 && (
            <details className="catalog-specs" open>
              <summary>Specifications <ChevronDown size={18} aria-hidden="true" /></summary>
              <div>
                {specs.map((spec) => (
                  <label key={spec}>{spec}
                    <select value={params.get('spec:' + spec) || ''} onChange={(event) => updateFilters({ ['spec:' + spec]: event.target.value })}>
                      <option value="">Any</option>
                      {unique(base.map((item) => item.attributes[spec])).map((value) => <option key={value}>{value}</option>)}
                    </select>
                  </label>
                ))}
              </div>
            </details>
          )}
          <button type="button" className="button dark filter-results"
            onClick={() => { setFiltersOpen(false); focusResults(); }}>Show {resultCount}</button>
        </aside>

        <section className="catalog-results" aria-label="Product results" ref={results} tabIndex={-1}>
          {activeFilters.length > 0 && (
            <ul className="active-filters" aria-label="Active filters">
              {activeFilters.map(([key, label]) => (
                <li key={key}>
                  <button type="button" className="chip" aria-label={'Remove filter ' + label}
                    onClick={() => { updateFilters({ [key]: '' }); focusResults(true); }}>
                    {label}<X size={15} aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li><button type="button" className="link-button" onClick={() => { resetFilters(); focusResults(true); }}>Clear filters</button></li>
            </ul>
          )}
          {items.length > 0 ? (
            <div className="product-grid catalog-grid">
              {items.map((item) => <ProductCard product={item} key={item.id} />)}
            </div>
          ) : (
            <div className="catalog-empty">
              <PackageSearch size={36} aria-hidden="true" />
              <h2>No gadgets found</h2>
              <p>Try a broader search or clear your filters.</p>
              <button type="button" className="button dark" onClick={() => { resetFilters(); focusResults(); }}>Clear filters</button>
            </div>
          )}
        </section>
      </div>

      <section className="catalog-recommendations" aria-labelledby="catalog-recommendations-title">
        <div className="section-heading">
          <h2 id="catalog-recommendations-title">You may also like</h2>
          <Link className="text-link" to="/products?collection=bestseller" onClick={() => focusResults()}>Shop bestsellers <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="product-grid">
          {recommendations.map((item) => <ProductCard product={item} key={item.id} />)}
        </div>
      </section>
    </div>
  );
}
