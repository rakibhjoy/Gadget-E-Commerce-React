import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, Tag, Trash2 } from 'lucide-react';
import { useCart } from '../context/storeContexts';
import { productPath } from '../data/catalog';
import { Breadcrumbs, EmptyState, PageTitle, ProductImage } from '../components/StoreUI';
import { OrderTotals } from '../components/CheckoutFields';
import { lineStock, stockProblem } from '../utils/commerce';
import { formatBDT } from '../utils/format';

export default function Cart() {
  const { cart, totalItems, totals, coupon, removeCoupon, applyCoupon, updateQuantity, removeFromCart } = useCart();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const invalidStock = stockProblem(cart);
  if (!cart.length) return <EmptyState title="Your cart is empty" text="Find a gadget you love and add it to your cart." />;

  return <div className="container page">
    <Breadcrumbs items={[{ label: 'Cart' }]} />
    <PageTitle title="Shopping cart" subtitle={totalItems + (totalItems === 1 ? ' item' : ' items')} />
    <div className="summary-layout">
      <section className="panel cart-lines" aria-label="Cart items">
        {cart.map((line) => {
          const { id, product, quantity, variantId } = line;
          const variant = product.variants.find((option) => option.id === variantId);
          const stock = lineStock(line);
          return <article className="cart-line" key={id}>
            <Link to={productPath(product.id)} tabIndex={-1} aria-hidden="true"><ProductImage src={product.image} alt={product.name} sizes="84px" /></Link>
            <div className="cart-item-info"><h2><Link to={productPath(product.id)}>{product.name}</Link></h2>
              <p className="muted">{variant.label} · {formatBDT(product.price)} each</p>
              {quantity > stock && <p className="error-text">{stock ? 'Only ' + stock + ' available. Reduce quantity to continue.' : 'Out of stock. Remove this item to continue.'}</p>}
              <div className="cart-item-actions"><div className="quantity">
                <button type="button" aria-label={'Decrease quantity for ' + product.name} disabled={quantity <= 1} onClick={() => updateQuantity(id, quantity - 1)}><Minus size={15} /></button>
                <output aria-label={product.name + ' quantity'}>{quantity}</output>
                <button type="button" aria-label={'Increase quantity for ' + product.name} disabled={quantity >= stock} onClick={() => updateQuantity(id, quantity + 1)}><Plus size={15} /></button>
              </div><button type="button" className="icon-button" aria-label={'Remove ' + product.name} onClick={() => removeFromCart(id)}><Trash2 size={16} /></button></div>
            </div>
            <strong>{formatBDT(quantity * product.price)}</strong>
          </article>;
        })}
        <Link className="text-link" to="/products">Continue shopping <ArrowRight size={16} /></Link>
      </section>
      <aside className="panel summary-panel" aria-label="Order summary">
        <h2>Order summary</h2>
        <OrderTotals totals={totals} coupon={coupon} />
        {coupon ? <div className="notice between"><span><Tag size={16} /> {coupon} applied</span><button className="link-button" type="button" onClick={() => { setError(''); removeCoupon(); }}>Remove coupon</button></div> :
          <form className="stack compact" onSubmit={(event) => {
            event.preventDefault();
            setError(applyCoupon(code));
          }}>
            <label htmlFor="coupon">Coupon code</label><div className="coupon-form"><input id="coupon" value={code} onChange={(event) => setCode(event.target.value)} placeholder="JOY10" required maxLength="30" /><button type="submit" className="button secondary">Apply</button></div>
            <small className="muted">Try JOY10 for 10% off in this demo.</small>
            {error && <p className="error-text" role="alert">{error}</p>}
          </form>}
        {invalidStock ? <p className="notice error-text" role="status">Update unavailable items to proceed to checkout.</p> :
          <Link className="button primary full-button" to="/checkout">Continue to checkout <ArrowRight size={18} /></Link>}
        <p className="muted small">Delivery total may change with the selected checkout option.</p>
      </aside>
    </div>
  </div>;
}
