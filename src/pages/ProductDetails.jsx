import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, Maximize2, Minus, Plus, ShieldCheck, ShoppingBag, Truck, X } from 'lucide-react';
import { catalog, categoryPath, discountOf, productById } from '../data/catalog';
import { useCart, useFavorites } from '../context/storeContexts';
import ProductCard, { ProductActions } from '../components/ProductCard';
import { Breadcrumbs, EmptyState, Price, ProductImage, Rating } from '../components/StoreUI';
import { readList } from '../utils/storage';
import { formatBDT } from '../utils/format';

function Reviews({ product }) {
  const key = 'joymart_reviews_' + product.id;
  const [reviews, setReviews] = useState(() => readList(key));
  const [message, setMessage] = useState('');
  function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const comment = data.get('comment').trim();
    if (comment.length < 5) {
      setMessage('Write at least five characters.');
      return;
    }
    try {
      const next = [{ id: crypto.randomUUID(), rating: Number(data.get('rating')), comment }, ...readList(key)];
      localStorage.setItem(key, JSON.stringify(next));
      setReviews(next);
      form.reset();
      setMessage('Demo review saved on this browser.');
    } catch {
      setMessage('Your demo review could not be saved. Check browser storage.');
    }
  }

  return <section className="panel details-panel" id="reviews" aria-labelledby="reviews-title">
    <h2 id="reviews-title">Reviews</h2>
    <Rating rating={product.rating} count={product.reviewsCount} />
    <p className="muted">Demo catalog rating. Reviews written here are saved on this browser.</p>
    {reviews.length ? <ul className="review-list">{reviews.map((review) => <li key={review.id}><b>{review.rating} / 5</b><p>{review.comment}</p></li>)}</ul> : <p>No local reviews yet.</p>}
    <details><summary>Write a demo review</summary>
      <form className="stack" onSubmit={submit}>
        <label>Rating<select name="rating" defaultValue="5">{[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} out of 5</option>)}</select></label>
        <label>Review<textarea name="comment" minLength="5" maxLength="700" required rows="3" /></label>
        <button className="button secondary" type="submit">Save demo review</button>
      </form>
    </details>
    <p role="status">{message}</p>
  </section>;
}

function ProductView({ product }) {
  const { cart, addToCart } = useCart();
  const { recordView } = useFavorites();
  const navigate = useNavigate();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [added, setAdded] = useState(false);
  const dialog = useRef(null);

  useEffect(() => { recordView(product.id); }, [product.id, recordView]);

  const variant = product.variants.find(({ id }) => id === variantId);
  const remaining = Math.max(0, variant.stock - (cart.find((line) => line.product.id === product.id && line.variantId === variantId)?.quantity ?? 0));
  const purchaseQuantity = Math.min(quantity, Math.max(remaining, 1));
  const related = [...catalog.filter((item) => item.category === product.category && item.id !== product.id), ...catalog.filter((item) => item.category !== product.category && item.isFeatured)].slice(0, 4);
  const discount = discountOf(product);
  const views = product.images.length === 1 ? [...product.images, { ...product.images[0], label: 'Detail crop' }] : product.images;
  const current = views[view];
  const crop = current.label === 'Detail crop';
  const buyLabel = !variant.stock ? 'Sold out' : !remaining ? 'Stock already in cart' : added ? 'Add another' : 'Add to cart';

  function add() {
    if (addToCart(product, purchaseQuantity, variantId)) {
      setAdded(true);
      setQuantity(1);
    }
  }

  function buyNow() {
    if (addToCart(product, purchaseQuantity, variantId)) navigate('/checkout');
  }

  return <div className="container page product-page">
    <Breadcrumbs items={[{ label: 'Shop', to: '/products' }, { label: product.category, to: categoryPath(product.category) }, { label: product.name }]} />
    <div className="product-layout">
      <section className="gallery" aria-label="Product image gallery">
        <button type="button" className="gallery-main" aria-label="Zoom product image" onClick={() => dialog.current.showModal()}>
          <ProductImage src={current.src} alt={product.name + ' — ' + current.label} className={crop ? 'detail-crop' : ''} sizes="(max-width: 790px) 94vw, 560px" eager />
          <span className="icon-button zoom-icon"><Maximize2 size={18} aria-hidden="true" /></span>
        </button>
        <div className="thumbnails">{views.map((image, index) => <button type="button" key={image.label} aria-label={'Show ' + image.label.toLowerCase()} aria-pressed={view === index} onClick={() => setView(index)}>
          <ProductImage src={image.src} alt={image.label} sizes="65px" className={image.label === 'Detail crop' ? 'detail-crop' : ''} />
        </button>)}</div>
        <dialog className="zoom-dialog" ref={dialog} aria-labelledby="zoom-title" onClose={() => setZoom(false)}>
          <div className="dialog-header"><strong id="zoom-title">{product.name}</strong><button type="button" className="icon-button" aria-label="Close image zoom" onClick={() => dialog.current.close()}><X size={22} /></button></div>
          <button type="button" className="zoom-stage" onClick={() => setZoom(!zoom)} aria-pressed={zoom} aria-label={zoom ? 'Zoom out' : 'Zoom in'}>
            <ProductImage src={current.src} alt={product.name + ' — ' + current.label} className={crop ? 'detail-crop' : ''} sizes="(max-width: 800px) 94vw, 780px" />
          </button>
        </dialog>
      </section>
      <section className="product-info">
        <div className="between product-meta"><span className="eyebrow">{product.brand} · {product.category}</span><ProductActions id={product.id} name={product.name} /></div>
        <h1>{product.name}</h1>
        <a href="#reviews" className="rating-link"><Rating rating={product.rating} count={product.reviewsCount} /></a>
        <div className="detail-price"><Price price={product.price} original={product.originalPrice} />{discount > 0 && <span className="chip sale-tag">Save {formatBDT(product.originalPrice - product.price)}</span>}</div>
        <p className="muted">{product.description}</p>
        {product.variants.length > 1 && <fieldset className="variant-field"><legend>Finish</legend>
          <div className="variant-options">{product.variants.map((item) => <label key={item.id}><input type="radio" name="variant" value={item.id} checked={item.id === variantId} onChange={() => {
            setVariantId(item.id); setQuantity(1); setAdded(false);
          }} /> {item.label}</label>)}</div><small className="muted">Demo finishes share the catalog photo.</small>
        </fieldset>}
        <p className={variant.stock ? 'stock in-stock' : 'stock sold-out'}><span />{variant.stock > 3 ? 'In stock' : variant.stock ? 'Only ' + variant.stock + ' left' : 'Out of stock'} · Demo inventory</p>
        <div className="purchase">
          <div className="quantity" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" disabled={purchaseQuantity <= 1} onClick={() => setQuantity(purchaseQuantity - 1)}><Minus size={16} /></button>
            <output aria-live="polite">{purchaseQuantity}</output>
            <button type="button" aria-label="Increase quantity" disabled={purchaseQuantity >= remaining} onClick={() => setQuantity(purchaseQuantity + 1)}><Plus size={16} /></button>
          </div>
          <button type="button" className="button primary desktop-purchase" disabled={!remaining} onClick={add}><ShoppingBag size={18} /> {buyLabel}</button>
          <button type="button" className="button primary" disabled={!remaining} onClick={buyNow}>Buy now</button>
          {added && <Link to="/cart" className="text-link"><Check size={17} /> View cart</Link>}
        </div>
        <div className="product-services">
          <Link to="/support/shipping-returns"><Truck size={21} /><span><b>Delivery across Bangladesh</b><small>See delivery options at checkout</small></span><ArrowRight size={16} /></Link>
          <Link to="/support/warranty"><ShieldCheck size={21} /><span><b>Brand warranty</b><small>Confirm coverage and duration with support</small></span><ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
    <div className="product-detail-grid">
      <section className="panel details-panel"><h2>Technical specifications</h2><dl className="spec-sheet"><div><dt>Brand</dt><dd>{product.brand}</dd></div>{Object.entries(product.attributes).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><ul className="spec-list">{product.specs.map((spec) => <li key={spec}>{spec}</li>)}</ul></section>
      <Reviews product={product} />
    </div>
    <section className="home-section"><div className="section-heading"><h2>Related products</h2><Link className="text-link" to={categoryPath(product.category)}>Explore category <ArrowRight size={17} /></Link></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.id} />)}</div></section>
    <div className="mobile-purchase"><strong>{formatBDT(product.price)}</strong><button type="button" className="button primary" disabled={!remaining} onClick={add}><ShoppingBag size={18} /> {buyLabel}</button></div>
  </div>;
}

Reviews.propTypes = { product: PropTypes.object.isRequired };
ProductView.propTypes = { product: PropTypes.object.isRequired };

export default function ProductDetails() {
  const { id } = useParams();
  const product = Object.hasOwn(productById, id) ? productById[id] : null;
  return product ? <ProductView product={product} key={product.id} /> : <EmptyState title="Product unavailable" text="This gadget could not be found in the current catalog." />;
}
