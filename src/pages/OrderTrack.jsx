import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useOrders } from '../context/OrderContext';
import { formatBDT } from '../utils/format';

export default function OrderTrack() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const { getOrder, orders } = useOrders();

  const [query, setQuery] = useState(initialId);
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setQuery(idParam);
      const found = getOrder(idParam);
      setSearchedOrder(found);
      setSearchAttempted(true);
    } else if (orders.length > 0 && !searchedOrder) {
      // Default to latest order if available
      setSearchedOrder(orders[0]);
      setQuery(orders[0].id);
    }
  }, [searchParams, orders]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearchParams({ id: query.trim() });
    const found = getOrder(query.trim());
    setSearchedOrder(found);
    setSearchAttempted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-bold mb-3 border border-accent/20">
          <Truck className="w-3.5 h-3.5" />
          <span>Joy Express Logistics Tracker</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-text tracking-tight">
          Track Your Joy Mart Parcel
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-muted">
          Enter your Order Number (e.g. <strong className="text-primary-text">JM-849201</strong>) or your 11-digit Bangladesh mobile phone number.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID or Mobile (017XXXXXXXX)..."
              className="w-full pl-11 pr-4 py-3.5 text-sm bg-secondary-bg/50 border border-border rounded-2xl focus:outline-none focus:border-accent focus:bg-white transition-all shadow-xs"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-accent hover:bg-accent-hover text-white rounded-2xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Track Parcel</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick sample chips */}
        {orders.length > 0 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted flex-wrap">
            <span>Recent Orders:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setQuery(o.id);
                  setSearchedOrder(o);
                  setSearchParams({ id: o.id });
                }}
                className="font-bold text-primary-text hover:text-accent underline transition-colors"
              >
                {o.id}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Results Area */}
      {searchedOrder ? (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
          
          {/* Main Status Hero Card */}
          <div className="glass rounded-3xl p-6 sm:p-10 shadow-glass border border-border/80">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border/60 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-accent block mb-1">
                  Joy Express Delivery Status
                </span>
                <h2 className="text-2xl font-black text-primary-text flex items-center gap-2">
                  <span>{searchedOrder.id}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent text-white shadow-xs">
                    {searchedOrder.status}
                  </span>
                </h2>
                <p className="text-xs text-muted mt-1">
                  Ordered on {searchedOrder.date} • Courier: <strong className="text-primary-text">{searchedOrder.courier}</strong>
                </p>
              </div>

              <div className="sm:text-right bg-secondary-bg sm:bg-secondary-bg/50 p-3 sm:p-4 rounded-2xl border border-border/50 w-full sm:w-auto">
                <span className="text-xs text-muted block font-medium">Estimated Arrival</span>
                <span className="text-lg font-bold text-success">
                  {searchedOrder.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Visual Tracking Progress Timeline */}
            <div className="py-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-6">
                Shipment Milestones
              </h3>

              <div className="relative">
                <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-5 gap-3 relative">
                  {(searchedOrder.timeline || []).map((step, idx) => (
                    <div key={idx} className="relative flex sm:flex-col items-start gap-3 sm:gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold z-10 transition-all ${
                          step.completed
                            ? 'bg-primary-text text-white'
                            : 'bg-secondary-bg text-muted border border-border'
                        } ${step.current ? 'ring-4 ring-accent/30 bg-accent text-white shadow-sm' : ''}`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            step.completed ? 'text-primary-text' : 'text-muted'
                          } ${step.current ? 'text-accent' : ''}`}
                        >
                          {step.step}
                        </h4>
                        <span className="text-[10px] text-muted block mt-0.5">
                          {step.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery Details & Recipient Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border/60 text-xs">
              <div className="p-4 bg-secondary-bg/60 rounded-2xl border border-border/70 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-primary-text mb-1">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span>Delivery Destination</span>
                </div>
                <p className="font-semibold text-primary-text">
                  {searchedOrder.customer?.name} ({searchedOrder.customer?.phone})
                </p>
                <p className="text-primary-text/80">
                  {searchedOrder.deliveryAddress?.address}
                </p>
                <p className="text-muted">
                  {searchedOrder.deliveryAddress?.area}, {searchedOrder.deliveryAddress?.city}
                </p>
              </div>

              <div className="p-4 bg-secondary-bg/60 rounded-2xl border border-border/70 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-primary-text mb-1">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Payment & Logistics Info</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Payment Method:</span>
                  <strong className="text-primary-text">{searchedOrder.paymentMethod}</strong>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Total Amount:</span>
                  <strong className="text-primary-text font-black">{formatBDT(searchedOrder.total)}</strong>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Customer Type:</span>
                  <span className="text-primary-text font-medium">
                    {searchedOrder.customer?.isGuest ? 'Guest Checkout' : 'Verified Joy Mart Account'}
                  </span>
                </div>
              </div>
            </div>

            {/* Items in this parcel */}
            <div className="mt-8 pt-6 border-t border-border/60">
              <h4 className="text-xs font-bold text-primary-text uppercase tracking-wider mb-4">
                Parcel Contents ({(searchedOrder.items || []).length} items)
              </h4>

              <div className="divide-y divide-border/60">
                {(searchedOrder.items || []).map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.image}
                        alt={item.product?.name}
                        className="w-12 h-12 rounded-xl object-cover bg-secondary-bg border border-border"
                      />
                      <div>
                        <h5 className="font-bold text-xs text-primary-text">
                          {item.product?.name}
                        </h5>
                        <span className="text-[11px] text-muted">
                          Qty: {item.quantity} × {formatBDT(item.product?.price)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-primary-text">
                      {formatBDT((item.product?.price || 0) * (item.quantity || 1))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Hotline assistance strip */}
          <div className="p-5 glass rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-soft text-accent flex items-center justify-center flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-primary-text">Have questions about this parcel?</h4>
                <p className="text-[11px] text-muted">Call Joy Mart rider hotline for live status updates.</p>
              </div>
            </div>
            <a
              href="tel:+8801700000000"
              className="px-5 py-2.5 bg-primary-text hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors whitespace-nowrap shadow-xs"
            >
              Call +880 1700-JOYMART
            </a>
          </div>

        </div>
      ) : searchAttempted ? (
        /* Not found */
        <div className="max-w-md mx-auto py-16 text-center glass border border-dashed border-border rounded-3xl p-8">
          <AlertCircle className="w-10 h-10 text-sale mx-auto mb-3" />
          <h3 className="text-base font-bold text-primary-text">No Parcel Found</h3>
          <p className="text-xs text-muted mt-1 max-w-xs mx-auto">
            We couldn't find any orders matching "{query}". Please verify the Order ID or the phone number used during checkout.
          </p>
          <button
            onClick={() => setQuery('')}
            className="mt-5 px-5 py-2.5 bg-primary-text hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all"
          >
            Try Another Search
          </button>
        </div>
      ) : null}

    </div>
  );
}
