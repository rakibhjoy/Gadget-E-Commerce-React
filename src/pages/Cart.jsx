import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  Phone,
  User as UserIcon,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Edit2
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatBDT } from '../utils/format';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, shipping, total } = useCart();
  const { user, isAuthenticated, addAddress } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  const [checkoutMode, setCheckoutMode] = useState(isAuthenticated ? 'account' : 'guest'); // 'account' | 'guest'
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  // Address Selection & Guest Details State
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestCity, setGuestCity] = useState('Dhaka');
  const [guestArea, setGuestArea] = useState('');
  const [guestAddress, setGuestAddress] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery'); // 'Cash on Delivery' | 'bKash / Nagad' | 'Card'
  const [checkoutError, setCheckoutError] = useState('');

  // Set default address when user is available
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedAddressId(def.id);
      setCheckoutMode('account');
    } else if (!isAuthenticated) {
      setCheckoutMode('guest');
    }
  }, [user, isAuthenticated]);

  const selectedUserAddress = user?.addresses?.find((a) => a.id === selectedAddressId) || user?.addresses?.[0];

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setCheckoutError('');

    if (cart.length === 0) return;

    let orderCustomer = {};
    let orderAddress = {};

    if (checkoutMode === 'account' && isAuthenticated) {
      if (!selectedUserAddress) {
        setCheckoutError('Please add or select a delivery address to proceed.');
        return;
      }
      orderCustomer = {
        name: selectedUserAddress.recipientName || user.name,
        email: user.email,
        phone: selectedUserAddress.phone || user.phone,
        isGuest: false,
      };
      orderAddress = {
        label: selectedUserAddress.label,
        city: selectedUserAddress.city,
        area: selectedUserAddress.area,
        address: selectedUserAddress.address,
      };
    } else {
      // Guest Checkout Validation (Requires valid 11-digit Bangladesh phone)
      const cleanPhone = guestPhone.trim().replace(/[^0-9]/g, '');
      if (cleanPhone.length < 10) {
        setCheckoutError('Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX).');
        return;
      }
      if (!guestName.trim()) {
        setCheckoutError('Please enter your recipient name.');
        return;
      }
      if (!guestAddress.trim()) {
        setCheckoutError('Please enter your full delivery street address.');
        return;
      }

      orderCustomer = {
        name: guestName.trim(),
        email: '',
        phone: cleanPhone,
        isGuest: true,
      };
      orderAddress = {
        label: 'Guest Delivery',
        city: guestCity,
        area: guestArea || guestCity,
        address: guestAddress.trim(),
      };
    }

    setIsCheckingOut(true);

    setTimeout(() => {
      const newOrder = placeOrder({
        customer: orderCustomer,
        deliveryAddress: orderAddress,
        items: [...cart],
        subtotal,
        shipping,
        total,
        paymentMethod,
      });

      setOrderComplete(newOrder);
      clearCart();
      setIsCheckingOut(false);
    }, 700);
  };

  // Order Confirmed Screen
  if (orderComplete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-stone-200/90 rounded-3xl p-8 sm:p-12 shadow-sm animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Placed Successfully
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
            Thank you, {orderComplete.customer?.name}!
          </h2>
          <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">
            Your Joy Mart parcel <strong className="text-stone-900 font-bold">{orderComplete.id}</strong> has been registered. An SMS update will be sent to <strong>{orderComplete.customer?.phone}</strong>.
          </p>

          <div className="mt-8 p-5 bg-stone-50 rounded-2xl border border-stone-200 text-left text-xs space-y-2.5">
            <div className="flex justify-between text-stone-600">
              <span>Order Number:</span>
              <strong className="text-stone-900">{orderComplete.id}</strong>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Payable on Delivery:</span>
              <span className="font-extrabold text-stone-900">{formatBDT(orderComplete.total)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Payment Type:</span>
              <span className="font-semibold text-stone-800">{orderComplete.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping Destination:</span>
              <span className="text-stone-800 font-medium">
                {orderComplete.deliveryAddress?.address}, {orderComplete.deliveryAddress?.city}
              </span>
            </div>
            <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-200/60">
              <span>Expected Delivery:</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                {orderComplete.estimatedDelivery}
              </span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/track?id=${orderComplete.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Truck className="w-4 h-4" />
              <span>Track This Parcel Live</span>
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Empty Cart Screen
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-white border border-stone-200 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-400 shadow-xs">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Your Cart is Empty</h2>
        <p className="mt-2 text-sm text-stone-500 max-w-sm mx-auto">
          You haven't added any Joy Mart gadgets to your shopping bag yet. Explore our curated collections to get started.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <span>Explore Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          Joy Mart Checkout
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-stone-500">
          Fast guest checkout with mobile number or order via your Joy Mart account
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items + Delivery Details (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cart Items List */}
          <div className="bg-white border border-stone-200/90 rounded-2xl divide-y divide-stone-100 shadow-xs overflow-hidden">
            <div className="p-4 bg-stone-50/70 border-b border-stone-100 flex items-center justify-between text-xs font-bold text-stone-700">
              <span>Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
              <button
                onClick={clearCart}
                className="text-stone-400 hover:text-rose-600 transition-colors font-medium"
              >
                Clear Cart
              </button>
            </div>

            {cart.map((item) => (
              <div key={item.product.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="w-16 h-16 bg-stone-100 rounded-xl overflow-hidden border border-stone-200 flex-shrink-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                      {item.product.category}
                    </span>
                    <Link
                      to={`/products/${item.product.id}`}
                      className="block text-sm font-bold text-stone-900 hover:text-amber-700 line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <span className="text-xs text-stone-500 mt-0.5 block">
                      Unit: {formatBDT(item.product.price)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls and Line Price */}
                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 self-end sm:self-auto">
                  <div className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1.5 text-stone-500 hover:text-stone-900"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1.5 text-stone-500 hover:text-stone-900"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-stone-900 block">
                      {formatBDT(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[11px] text-rose-500 hover:text-rose-700 inline-flex items-center gap-1 font-medium mt-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Checkout Mode Box */}
          <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Mode Selector (Account vs Guest) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-stone-100">
              <div>
                <h3 className="text-base font-extrabold text-stone-900">
                  Delivery & Shipping Details
                </h3>
                <p className="text-xs text-stone-500">
                  Select your saved address or enter mobile for instant guest dispatch
                </p>
              </div>

              {/* Mode Toggle Pills */}
              <div className="inline-flex p-1 bg-stone-100 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCheckoutMode('guest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    checkoutMode === 'guest'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  ⚡ Mobile Guest Checkout
                </button>
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => setCheckoutMode('account')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      checkoutMode === 'account'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Saved Account Address
                  </button>
                )}
              </div>
            </div>

            {/* OPTION 1: Guest Checkout Form (Only Mobile + Address) */}
            {checkoutMode === 'guest' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    <strong>Fast Guest Checkout:</strong> No password required. We'll verify and dispatch using your mobile number!
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number (Required) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Delivery City / District *
                    </label>
                    <select
                      value={guestCity}
                      onChange={(e) => setGuestCity(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900"
                    >
                      <option value="Dhaka">Dhaka (24h Delivery)</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Thana / Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestArea}
                      onChange={(e) => setGuestArea(e.target.value)}
                      placeholder="e.g. Gulshan, Mirpur, Uttara"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Complete Street Address & Landmark *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={guestAddress}
                    onChange={(e) => setGuestAddress(e.target.value)}
                    placeholder="House / Flat / Road number and nearby landmark for courier rider..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-stone-900 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* OPTION 2: Logged-in User Saved Addresses */}
            {checkoutMode === 'account' && isAuthenticated && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700">Choose from Saved Addresses:</span>
                  <Link to="/profile" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
                    <Edit2 className="w-3 h-3" />
                    <span>Manage Addresses</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(user.addresses || []).map((addr) => (
                    <label
                      key={addr.id}
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-amber-500 bg-amber-50/20 ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-xs text-stone-900">{addr.label}</span>
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="accent-amber-600"
                        />
                      </div>
                      <p className="text-xs text-stone-600 mt-2 font-medium">
                        {addr.recipientName || user.name} ({addr.phone || user.phone})
                      </p>
                      <p className="text-[11px] text-stone-500 mt-1">
                        {addr.address}, {addr.area}, {addr.city}
                      </p>
                    </label>
                  ))}
                </div>

                {(!user.addresses || user.addresses.length === 0) && (
                  <div className="text-center py-6 border border-dashed border-stone-200 rounded-2xl">
                    <p className="text-xs text-stone-500">You don't have any saved address yet.</p>
                    <Link to="/profile" className="mt-2 inline-block text-xs font-bold text-amber-700 underline">
                      Add an address in Profile
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="pt-6 border-t border-stone-100 space-y-3">
              <label className="block text-xs font-bold text-stone-700">
                Payment Option (Cash on Delivery or Mobile Banking)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Cash on Delivery</h4>
                    <p className="text-[10px] text-stone-400">Pay rider upon parcel inspection</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bKash / Nagad')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'bKash / Nagad'
                      ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-pink-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">bKash / Nagad</h4>
                    <p className="text-[10px] text-stone-400">Instant Mobile Banking</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Card')}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-amber-500 bg-amber-50/30 ring-2 ring-amber-500/20'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Visa / Master</h4>
                    <p className="text-[10px] text-stone-400">Cards & 0% Bank EMI</p>
                  </div>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Order Summary & Confirm (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-2xl p-6 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-stone-900 border-b border-stone-100 pb-3">
            Summary & Dispatch
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal ({cart.length} unique items)</span>
              <span className="font-bold text-stone-900">{formatBDT(subtotal)}</span>
            </div>

            <div className="flex justify-between text-stone-600">
              <span>Joy Express Delivery</span>
              <span className="font-bold text-stone-900">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-bold">Free (Order &gt; ৳10,000)</span>
                ) : (
                  formatBDT(shipping)
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-between text-sm font-black text-stone-900">
              <span>Total Payable</span>
              <span className="text-base">{formatBDT(total)}</span>
            </div>
          </div>

          {checkoutError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
              {checkoutError}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheckoutSubmit}
            disabled={isCheckingOut}
            className="w-full py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-sm font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {isCheckingOut ? (
              <span>Confirming Joy Mart Order...</span>
            ) : (
              <>
                <span>Place Order ({formatBDT(total)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-[11px] text-stone-500 space-y-2 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Official Bangladesh Warranty sealed box</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Free returns within 7 days if defective</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
