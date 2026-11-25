import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { catalog, categories, collectionIds, matchesQuery, stockOf } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs, PageTitle } from '../components/StoreUI';

const sortOptions = [
  ['featured', 'Featured'], ['price-low', 'Price: low to high'], ['price-high', 'Price: high to low'], ['rating', 'Highest rated'],
];
const unique = (values) => [...new Set(values.filter(Boolean))].sort();

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const category = categories.includes(params.get('category')) ? params.get('category') : 'All';
  const query = params.get('search') || '';
  const sort = params.get('sort') || 'featured';
  const collection = params.get('collection');
  const collectionOrder = Object.hasOwn(collectionIds, collection) ? collectionIds[collection] : null;
  const deals = params.get('deal') === 'true';
  const brand = params.get('brand') || '';
  const availability = params.get('availability') || '';
  const min = params.get('min') || '';
  const max = params.get('max') || '';
  const base = catalog.filter((item) => category === 'All' || item.category === category);
  const specs = category === 'All' ? [] : unique(base.flatMap((item) => Object.keys(item.attributes)));
  const hasInvalidRange = min !== '' && max !== '' && Number(min) > Number(max);

  const items = base.filter((item) =>
    matchesQuery(item, query) &&
    (!deals || item.isDeal) &&
    (!collectionOrder || collectionOrder.includes(item.id)) &&
    (!brand || brand === item.brand) &&
    (availability !== 'in-stock' || stockOf(item) > 0) &&
    (availability !== 'sold-out' || stockOf(item) === 0) &&
    (!min || item.price >= Number(min)) &&
    (!max || item.price <= Number(max)) &&
    specs.every((spec) => !params.get('spec:' + spec) || params.get('spec:' + spec) === item.attributes[spec]),
  );
  if (sort === 'price-low') items.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') items.sort((a, b) => b.rating - a.rating);
  else if (collectionOrder) items.sort((a, b) => collectionOrder.indexOf(a.id) - collectionOrder.indexOf(b.id));
  else items.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  const title = category !== 'All' ? category : deals ? 'Deals' : collection === 'new' ? 'New arrivals' : collection === 'bestseller' ? 'Bestsellers' : 'Shop all gadgets';
  const filterKeys = [...params.keys()].filter((key) => key !== 'sort' && key !== 'category');
  function setFilter(key, value, replace = false) {
    const next = new URLSearchParams(params);
    if (key === 'category') {
      for (const name of [...next.keys()]) if (name.startsWith('spec:') || name === 'brand') next.delete(name);
    }
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace, preventScrollReset: true });
  }

  function clearFilters() {
    setParams(category === 'All' ? {} : { category });
  }

  function search(event) {
    event.preventDefault();
    setFilter('search', new FormData(event.currentTarget).get('query').trim());
  }

  return <div className="container page">
    <Breadcrumbs items={[{ label: 'Shop', to: category === 'All' ? undefined : '/products' }, ...(category === 'All' ? [] : [{ label: category }])]} />
    <PageTitle title={title} subtitle="Explore smartphones, laptops, audio, gaming gear and more." />
    <div className="shop-layout">
      <button type="button" className="button secondary filter-toggle" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(!filtersOpen)}>
        <SlidersHorizontal size={17} /> {filtersOpen ? 'Hide filters' : 'Show filters'} {filterKeys.length > 0 && '(' + filterKeys.length + ')'}
      </button>
      <aside id="catalog-filters" className={'filters panel' + (filtersOpen ? ' filters-open' : '')} aria-label="Product filters">
        <div className="between"><h2><SlidersHorizontal size={17} /> Filters</h2><button type="button" className="link-button" onClick={clearFilters}>Clear</button></div>
        <label>Category<select value={category} onChange={(event) => setFilter('category', event.target.value === 'All' ? '' : event.target.value)}>
          {categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Brand<select value={brand} onChange={(event) => setFilter('brand', event.target.value)}>
          <option value="">All brands</option>{unique(base.map((item) => item.brand)).map((item) => <option key={item}>{item}</option>)}</select></label>
        <fieldset><legend>Price (BDT)</legend><div className="form-grid minmax">
          <label>Minimum<input aria-invalid={hasInvalidRange || undefined} type="number" min="0" step="1" placeholder="0" value={min} onChange={(event) => setFilter('min', event.target.value, true)} /></label>
          <label>Maximum<input aria-invalid={hasInvalidRange || undefined} type="number" min="0" step="1" placeholder="Any" value={max} onChange={(event) => setFilter('max', event.target.value, true)} /></label>
        </div>{hasInvalidRange && <p className="error-text" role="alert">Maximum must be at least the minimum.</p>}</fieldset>
        <label>Availability<select value={availability} onChange={(event) => setFilter('availability', event.target.value)}>
          <option value="">All availability</option><option value="in-stock">In stock</option><option value="sold-out">Sold out</option></select></label>
        {specs.length > 0 && <fieldset className="spec-filters"><legend>Specifications</legend>{specs.map((spec) => <label key={spec}>{spec}<select value={params.get('spec:' + spec) || ''} onChange={(event) => setFilter('spec:' + spec, event.target.value)}>
          <option value="">Any</option>{unique(base.map((item) => item.attributes[spec])).map((value) => <option key={value}>{value}</option>)}
        </select></label>)}</fieldset>}
        <label className="check-label"><input type="checkbox" checked={deals} onChange={(event) => setFilter('deal', event.target.checked ? 'true' : '')} /> Deals only</label>
      </aside>
      <section className="catalog-results" aria-label="Catalog results">
        <div className="catalog-toolbar">
          <form role="search" aria-label="Search this catalog" className="inline-form" onSubmit={search} key={query}>
            <input name="query" type="search" aria-label="Search this catalog" defaultValue={query} placeholder="Search this catalog" />
            <button type="submit" className="icon-button" aria-label="Search catalog"><Search size={19} /></button>
          </form>
          <label className="sort-label">Sort by<select value={sort} onChange={(event) => setFilter('sort', event.target.value === 'featured' ? '' : event.target.value)}>
            {sortOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select></label>
        </div>
        <div className="active-filters">
          <p role="status">{items.length} {items.length === 1 ? 'product' : 'products'}</p>
          {query && <button type="button" className="chip" onClick={() => setFilter('search', '')}>Search: {query}<X size={14} /></button>}
          {collectionOrder && <button type="button" className="chip" onClick={() => setFilter('collection', '')}>{collection === 'new' ? 'New arrivals' : 'Bestsellers'}<X size={14} /></button>}
        </div>
        {items.length ? <div className="product-grid catalog-grid">{items.map((item) => <ProductCard product={item} key={item.id} />)}</div> :
          <div className="panel centered"><h2>No gadgets found</h2><p>Try a broader search or clear your filters.</p><button className="button secondary" type="button" onClick={clearFilters}>Clear filters</button> <Link className="button primary" to="/products">Shop all gadgets</Link></div>}
      </section>
    </div>
  </div>;
}
