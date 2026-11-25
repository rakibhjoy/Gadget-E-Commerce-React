import PropTypes from 'prop-types';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, PackageSearch } from 'lucide-react';
import { useAuth, useOrders } from '../context/storeContexts';
import { Breadcrumbs, EmptyState, PageTitle } from '../components/StoreUI';
import { OrderTotals } from '../components/CheckoutFields';
import { formatBDT } from '../utils/format';

function orderDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-BD', { dateStyle: 'medium', timeZone: 'Asia/Dhaka' }).format(date);
}

export default function OrderTrack({ mode }) {
  const { orderId } = useParams();
  const [params, setParams] = useSearchParams();
  const { getOrder } = useOrders();
  const { user } = useAuth();
  const tracking = mode === 'track';
  const confirmation = mode === 'confirmation';
  const identifier = params.get('id') || '';
  const order = getOrder(tracking ? identifier : orderId);
  const showOrder = order && (order.customer?.isGuest || order.customer?.email?.toLowerCase() === user?.email?.toLowerCase());

  if (!tracking && !showOrder) return <EmptyState title="Order details unavailable" text="Open this order on the browser used at checkout. Sign in for orders placed from an account." to="/track" action="Look up an order" />;

  if (tracking) return <div className="container page">
    <Breadcrumbs items={[{ label: 'Track order' }]} />
    <PageTitle title="Track an order" subtitle="Look up a demo order saved on this browser." />
    <section className="panel tracking-panel stack">
      <PackageSearch size={30} />
      <p className="notice">Live shipment tracking is unavailable. Demo orders stay on this browser.</p>
      <form className="stack" key={identifier} onSubmit={(event) => {
        event.preventDefault();
        const next = new FormData(event.currentTarget).get('identifier').trim();
        setParams(next ? { id: next } : {});
      }}>
        <label>Order reference or Bangladesh mobile number<input name="identifier" defaultValue={identifier} placeholder="JM-…" required maxLength="36" /></label>
        <button type="submit" className="button primary">Look up order <ArrowRight size={17} /></button>
      </form>
      {identifier && <div className={order ? 'notice' : 'error-text'} role="status">
        {order ? <><b>{order.id} · Demo order saved</b><p>Created {orderDate(order.date)}. Shipment updates are unavailable.</p>{showOrder && <Link className="text-link" to={'/orders/' + order.id}>View order details <ArrowRight size={16} /></Link>}</> : <p>No matching demo order was found on this browser.</p>}
      </div>}
    </section>
  </div>;

  const title = confirmation ? 'Demo order saved' : 'Order ' + order.id;
  return <div className="container page">
    <Breadcrumbs items={[{ label: confirmation ? 'Confirmation' : 'Order details' }]} />
    {confirmation && <span className="account-icon"><CheckCircle2 size={27} /></span>}
    <PageTitle title={title} subtitle={confirmation ? 'Your local reference is ' + order.id + '.' : 'Demo order · ' + orderDate(order.date)} />
    <p className="notice checkout-notice">This order is stored on this browser. Payment, dispatch and courier updates are unavailable for demo orders.</p>
    <div className="summary-layout">
      <section className="panel stack checkout-panel">
        <h2>Order items</h2>
        <ul className="summary-items">{order.items?.map(({ product, quantity, variantId }, index) => <li key={product.id + ':' + (variantId ?? index)}>
          <span><Link className="text-link" to={'/products/' + product.id}>{product.name}</Link><small>× {quantity}{product.variants?.find((item) => item.id === variantId) && ' · ' + product.variants.find((item) => item.id === variantId).label}</small></span><strong>{formatBDT(product.price * quantity)}</strong>
        </li>)}</ul>
        <div className="review-address"><h3>Delivery details</h3><p>{order.customer?.name} · {order.customer?.phone}</p><p>{order.deliveryAddress?.address}, {order.deliveryAddress?.area}, {order.deliveryAddress?.city}</p>
          <p>{order.delivery?.label || 'Standard delivery'} · {order.paymentMethod}</p></div>
      </section>
      <aside className="panel summary-panel">
        <h2>Order summary</h2>
        <OrderTotals totals={{ ...order, discount: order.discount ?? 0 }} coupon={order.coupon} />
        <Link className="button secondary full-button" to={'/track?' + new URLSearchParams({ id: order.id })}>Look up order <ArrowRight size={17} /></Link>
        <Link className="button primary full-button" to="/products">Continue shopping <ArrowRight size={17} /></Link>
      </aside>
    </div>
  </div>;
}

OrderTrack.propTypes = { mode: PropTypes.oneOf(['track', 'detail', 'confirmation']).isRequired };
