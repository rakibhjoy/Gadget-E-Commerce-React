import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { GitCompareArrows, Heart } from 'lucide-react';
import { discountOf, productPath, stockOf } from '../data/catalog';
import { useCart, useFavorites } from '../context/storeContexts';
import { Price, ProductImage, Rating } from './StoreUI';

export function ProductActions({ id, name }) {
  const { wishlist, compare, toggleWishlist, toggleCompare } = useFavorites();
  const saved = wishlist.includes(id);
  const compared = compare.includes(id);
  const compareFull = compare.length >= 4 && !compared;
  return <div className="product-actions">
    <button type="button" className="icon-button save-action" aria-pressed={saved} aria-label={(saved ? 'Remove ' : 'Save ') + name + (saved ? ' from wishlist' : ' to wishlist')}
      onClick={() => toggleWishlist(id)}><Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" /></button>
    <button type="button" className="icon-button compare-action" aria-pressed={compared} disabled={compareFull}
      aria-label={compareFull ? 'Comparison is full' : (compared ? 'Remove from comparison: ' : 'Compare ') + name} title={compareFull ? 'Compare up to four products' : undefined}
      onClick={() => toggleCompare(id)}><GitCompareArrows size={17} aria-hidden="true" /></button>
  </div>;
}

export default function ProductCard({ product, eager = false }) {
  const { addToCart } = useCart();
  const { id, name, shortDescription, description, badge, price, originalPrice, image, rating, reviewsCount, variants } = product;
  const discount = discountOf(product);
  const label = badge || (discount > 0 ? `${discount}% off` : '');
  const available = stockOf(product) > 0;
  return (
    <article className="product-card">
      <div className="card-visual">
        <Link to={productPath(id)} tabIndex={-1} aria-hidden="true">
          <ProductImage src={image} alt={name} eager={eager} sizes="(max-width: 359px) 94vw, (max-width: 700px) 46vw, 320px" />
        </Link>
        {available && label && <span className="card-badge">{label}</span>}
        <ProductActions id={id} name={name} />
      </div>
      <div className="card-content">
        <h3><Link to={productPath(id)}>{name}</Link></h3>
        <p className="card-description">{shortDescription || description}</p>
        <Rating rating={rating} count={reviewsCount} />
        <div className="card-bottom">
          <Price price={price} original={originalPrice} />
          {available && variants.length > 1 ? (
            <Link className="button card-action" to={productPath(id)} aria-label={'Choose options for ' + name}>Choose options</Link>
          ) : (
            <button type="button" className="button card-action" disabled={!available}
              aria-label={available ? 'Add to cart: ' + name : undefined} onClick={() => addToCart(product)}>
              {available ? 'Add to cart' : 'Sold out'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

ProductActions.propTypes = { id: PropTypes.string.isRequired, name: PropTypes.string.isRequired };
ProductCard.propTypes = { product: PropTypes.object.isRequired, eager: PropTypes.bool };
