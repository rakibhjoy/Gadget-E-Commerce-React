import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { productById, productPath, stockOf } from '../data/catalog';
import { useFavorites } from '../context/storeContexts';
import ProductCard from '../components/ProductCard';
import { Breadcrumbs, EmptyState, PageTitle, ProductImage } from '../components/StoreUI';
import { formatBDT } from '../utils/format';

export default function Saved({ mode }) {
  const { wishlist, compare, toggleCompare } = useFavorites();
  const isCompare = mode === 'compare';
  const items = (isCompare ? compare : wishlist).map((id) => productById[id]);
  const title = isCompare ? 'Compare products' : 'Wishlist';
  if (!items.length) return <EmptyState title={isCompare ? 'Your comparison is empty' : 'Your wishlist is empty'} text={isCompare ? 'Choose the compare icon on up to four products to see their differences.' : 'Use the heart icon to save your favorite gadgets.'} />;

  const rows = [
    ['Price', (product) => formatBDT(product.price)],
    ['Availability', (product) => stockOf(product) > 0 ? 'In stock' : 'Sold out'],
    ['Category', (product) => product.category],
    ['Brand', (product) => product.brand],
    ...[...new Set(items.flatMap((item) => Object.keys(item.attributes)))].map((spec) => [spec, (product) => product.attributes[spec] || '—']),
    ['Other specifications', (product) => product.specs.join(' · ')],
  ];
  return <div className="container page">
    <Breadcrumbs items={[{ label: title }]} />
    <PageTitle title={title} subtitle={isCompare ? items.length + ' of 4 products selected. Highlighted rows show differences.' : items.length + (items.length === 1 ? ' saved product' : ' saved products')} />
    {!isCompare ? <div className="product-grid">{items.map((item) => <ProductCard key={item.id} product={item} />)}</div> :
      <>
        {items.length < 2 && <p>Add another gadget to compare specifications.</p>}
        <div className="table-scroll panel" tabIndex={0} role="region" aria-label="Product comparison table. Scroll for more products.">
          <table className="compare-table">
            <thead><tr><th scope="col">Product</th>{items.map((item) => <th scope="col" key={item.id}>
              <button type="button" className="icon-button" aria-label={'Remove ' + item.name + ' from comparison'} onClick={() => toggleCompare(item.id)}><X size={17} /></button>
              <Link to={productPath(item.id)}><ProductImage src={item.image} alt={item.name} sizes="175px" />{item.name}</Link>
            </th>)}</tr></thead>
            <tbody>{rows.map(([label, value]) => {
              const cells = items.map(value);
              const differs = new Set(cells).size > 1;
              return <tr key={label} className={differs ? 'different' : ''}><th scope="row">{label}</th>{cells.map((cell, index) => <td key={items[index].id}>{cell}</td>)}</tr>;
            })}</tbody>
          </table>
        </div>
      </>}
    <Link className="button secondary page-action" to="/products">Continue shopping</Link>
  </div>;
}

Saved.propTypes = { mode: PropTypes.oneOf(['compare', 'wishlist']).isRequired };
