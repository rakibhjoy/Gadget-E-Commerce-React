import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';
import { useAuth, useCart, useOrders } from '../context/storeContexts';
import { AddressFields, OrderTotals } from '../components/CheckoutFields';
import { Breadcrumbs, EmptyState, PageTitle } from '../components/StoreUI';
import { deliveryOptions, normalizePhone, paymentMethods, stockProblem, totalsFor, validateAddress } from '../utils/commerce';
import { formatBDT } from '../utils/format';

const addressKeys = ['recipientName', 'phone', 'city', 'area', 'address'];

export default function Checkout() {
  const { user } = useAuth();
  const { cart, coupon, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const saved = user?.addresses ?? [];
  const [addressId, setAddressId] = useState(() => saved.find((item) => item.isDefault)?.id ?? saved[0]?.id ?? 'new');
  const [draft, setDraft] = useState({ recipientName: user?.name ?? '', phone: user?.phone ?? '', city: '' });
  const [email, setEmail] = useState('');
  const [city, setCity] = useState(draft.city);
  const [deliveryId, setDeliveryId] = useState('standard');
  const [payment, setPayment] = useState(paymentMethods[0].id);
  const [review, setReview] = useState(null);
  const [error, setError] = useState('');
  const busy = useRef(false);
  const stage = useRef(null);
  const address = saved.find((item) => item.id === addressId);
  const options = deliveryOptions(address?.city ?? city);
  const delivery = options.find((item) => item.id === deliveryId) ?? options[0];
  const totals = totalsFor(cart, coupon, delivery);
  if (!cart.length) return <EmptyState title="Your cart is empty" text="Add an item before checking out." />;
  const invalidStock = stockProblem(cart);

  function reviewOrder(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const typed = Object.fromEntries(addressKeys.map((key) => [key, String(form.get(key) ?? '').trim()]));
    const contact = address ? { ...address, recipientName: address.recipientName || user?.name, phone: address.phone || user?.phone } : typed;
    const invalid = validateAddress(contact);
    if (invalid) { setError(invalid + (address ? ' Edit the saved address or enter a new one.' : '')); return; }
    if (invalidStock) { setError('Some items exceed demo stock. Update your cart and try again.'); return; }
    if (!address) setDraft(typed);
    setReview({
      customer: { name: contact.recipientName, phone: normalizePhone(contact.phone), email: user?.email ?? email.trim(), isGuest: !user },
      deliveryAddress: { label: contact.label || 'Delivery', city: contact.city, area: contact.area, address: contact.address },
      delivery,
      paymentMethod: payment,
    });
    setError('');
    requestAnimationFrame(() => stage.current?.focus());
  }

  function submitOrder() {
    if (busy.current || !review) return;
    if (stockProblem(cart) || !paymentMethods.some((method) => method.available && method.id === review.paymentMethod)) {
      setError('Stock or payment availability changed. Review your cart and checkout details.');
      return;
    }
    busy.current = true;
    try {
      const order = placeOrder({ ...review, items: cart, coupon, ...totalsFor(cart, coupon, review.delivery) });
      navigate('/orders/' + order.id + '/confirmation', { replace: true });
      clearCart();
    } catch {
      busy.current = false;
      setError('The demo order could not be saved. Check browser storage and try again.');
    }
  }

  function edit() {
    setReview(null);
    setError('');
    requestAnimationFrame(() => stage.current?.focus());
  }

  return <div className="container page">
    <Breadcrumbs items={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
    <PageTitle title="Checkout" subtitle={review ? 'Step 2 of 2 · Review your order' : 'Step 1 of 2 · Delivery and payment'} />
    <p className="notice checkout-notice"><LockKeyhole size={17} /> Demo checkout. This flow saves an order on this browser. Payment collection and fulfillment are unavailable.</p>
    <div className="summary-layout">
      <div className="panel checkout-panel">
        {review ? <section className="stack" aria-labelledby="checkout-review">
          <h2 id="checkout-review" tabIndex={-1} ref={stage}>Review your order</h2>
          <div className="review-address"><b>Deliver to</b><p>{review.customer.name} · {review.customer.phone}</p><p>{review.deliveryAddress.address}, {review.deliveryAddress.area}, {review.deliveryAddress.city}</p>{review.customer.email && <p>{review.customer.email}</p>}</div>
          <div className="review-address"><b>{review.delivery.label}</b><p>Demo estimate: {review.delivery.estimate}</p><p>{review.paymentMethod} · Demo</p></div>
          {error && <p className="error-text" role="alert">{error}</p>}
          <div className="form-actions"><button type="button" className="button secondary" onClick={edit}><ArrowLeft size={17} /> Edit details</button><button type="button" className="button primary" onClick={submitOrder}>Place demo order <ArrowRight size={17} /></button></div>
        </section> : <form className="stack" onSubmit={reviewOrder} onChange={(event) => {
          if (event.target.name === 'city') setCity(event.target.value);
          if (error) setError('');
        }}>
          <div><h2 ref={stage} tabIndex={-1}>Delivery address</h2>{user ? <p className="muted small">Signed in as {user.email}</p> : <p className="muted small">Checking out as guest. <Link className="text-link" to="/login?redirect=%2Fcheckout">Sign in to use saved addresses</Link></p>}</div>
          {saved.length > 0 && <label>Use a saved address<select value={addressId} onChange={(event) => setAddressId(event.target.value)}>
            {saved.map((item) => <option value={item.id} key={item.id}>{item.label} · {item.area}, {item.city}</option>)}
            <option value="new">Enter a different address</option>
          </select></label>}
          {address ? <p className="notice">{address.recipientName || user.name}, {address.address}, {address.area}, {address.city}. <Link className="text-link" to="/profile?tab=addresses">Manage addresses</Link></p> :
            <AddressFields values={draft} />}
          {!user && <label>Email (optional)<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" maxLength="160" /></label>}
          <fieldset className="option-list"><legend>Delivery option</legend>
            {options.map((option) => <label key={option.id}><input type="radio" name="delivery" checked={option.id === delivery.id} onChange={() => setDeliveryId(option.id)} /><span><b>{option.label}</b><small>{option.estimate} · Demo estimate</small></span><strong>{totalsFor(cart, coupon, option).shipping ? formatBDT(option.fee) : 'Free'}</strong></label>)}
          </fieldset>
          <fieldset className="option-list"><legend>Payment method</legend>
            {paymentMethods.map((method) => <label key={method.id} className={method.available ? '' : 'option-unavailable'}>
              <input type="radio" name="payment" checked={method.id === payment} disabled={!method.available} onChange={() => setPayment(method.id)} /><span><b>{method.label || method.id}</b><small>{method.description}</small></span>
            </label>)}
          </fieldset>
          {invalidStock && <p className="error-text" role="alert">Some items exceed demo stock. <Link to="/cart">Update your cart</Link>.</p>}
          {error && <p className="error-text" role="alert">{error}</p>}
          <div className="form-actions"><Link className="button secondary" to="/cart"><ArrowLeft size={17} /> Back to cart</Link><button type="submit" className="button primary" disabled={Boolean(invalidStock)}>Review order <ArrowRight size={17} /></button></div>
        </form>}
      </div>
      <aside className="panel summary-panel" aria-label="Checkout summary">
        <h2>Order summary</h2>
        <ul className="summary-items">{cart.map((line) => <li key={line.id}><span>{line.product.name} <small>× {line.quantity} · {line.product.variants.find(({ id }) => id === line.variantId)?.label}</small></span><strong>{formatBDT(line.product.price * line.quantity)}</strong></li>)}</ul>
        <OrderTotals totals={review ? totalsFor(cart, coupon, review.delivery) : totals} coupon={coupon} />
      </aside>
    </div>
  </div>;
}
