import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { GitCompareArrows, Heart, ShoppingBag } from 'lucide-react';
import { discountOf, productPath, stockOf } from '../data/catalog';
import { useCart, useFavorites } from '../context/storeContexts';
import { Price, ProductImage, Rating } from './StoreUI';

export function ProductActions({ id, name, only }) {
  const { wishlist, compare, toggleWishlist, toggleCompare } = useFavorites();
  const saved = wishlist.includes(id);
  const compared = compare.includes(id);
  const compareFull = compare.length >= 4 && !compared;
  return <div className="product-actions">
    {only !== 'compare' && <button type="button" className="icon-button save-action" aria-pressed={saved} aria-label={(saved ? 'Remove ' : 'Save ') + name + (saved ? ' from wishlist' : ' to wishlist')}
      onClick={() => toggleWishlist(id)}><Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /></button>}
    {only !== 'wishlist' && <button type="button" className="icon-button compare-action" aria-pressed={compared} disabled={compareFull}
      aria-label={compareFull ? 'Comparison is full' : (compared ? 'Remove from comparison: ' : 'Compare ') + name} title={compareFull ? 'Compare up to four products' : undefined}
      onClick={() => toggleCompare(id)}><GitCompareArrows size={17} aria-hidden="true" /></button>}
  </div>;
}

export default function ProductCard({ product, eager = false }) {
  const { addToCart } = useCart();
  const { id, name, category, price, originalPrice, image, rating, reviewsCount, variants } = product;
  const discount = discountOf(product);
  const available = stockOf(product) > 0;
  return (
    <article className="product-card">
      <div className="card-visual">
        <Link to={productPath(id)} tabIndex={-1} aria-hidden="true"><ProductImage src={image} alt={name} eager={eager} /></Link>
        {!available ? <span className="product-tag">Sold out</span> : discount > 0 && <span className="product-tag sale-tag">−{discount}%</span>}
        <ProductActions id={id} name={name} only="wishlist" />
      </div>
      <div className="card-content">
        <span className="card-category">{category}</span>
        <h3><Link to={productPath(id)}>{name}</Link></h3>
        <div className="card-meta"><Rating rating={rating} count={reviewsCount} /><ProductActions id={id} name={name} only="compare" /></div>
        <div className="card-bottom">
          <Price price={price} original={originalPrice} />
          {variants.length > 1 && available ?
            <Link className="icon-button bag-button" to={productPath(id)} aria-label={'Choose options for ' + name}><ShoppingBag size={18} aria-hidden="true" /></Link> :
            <button type="button" className="icon-button bag-button" disabled={!available} aria-label={'Add ' + name + ' to cart'} onClick={() => addToCart(product)}><ShoppingBag size={18} aria-hidden="true" /></button>}
        </div>
      </div>
    </article>
  );
}

ProductActions.propTypes = { id: PropTypes.string.isRequired, name: PropTypes.string.isRequired, only: PropTypes.oneOf(['wishlist', 'compare']) };
ProductCard.propTypes = { product: PropTypes.object.isRequired, eager: PropTypes.bool };
