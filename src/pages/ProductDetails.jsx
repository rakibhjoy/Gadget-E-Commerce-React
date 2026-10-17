import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  CreditCard,
  MapPin,
  Star
} from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { formatBDT } from '../utils/format';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-stone-900">Product Not Found</h2>
        <p className="mt-2 text-sm text-stone-500">
          The requested device does not exist or has been discontinued.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-semibold hover:bg-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Joy Mart Catalog</span>
        </Link>
      </div>
    );
  }

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const emiPerMonth = Math.round(product.price / 12);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-stone-900">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-stone-900">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-bold truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        {/* Left: Product Image Showcase */}
        <div className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 aspect-square relative group shadow-sm p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-stone-100 relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-stone-900 shadow-sm border border-stone-200">
                {product.availability}
              </span>
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white shadow-sm">
                  {discountPercent}% SAVINGS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-stone-700 bg-stone-100 px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="font-bold text-stone-900">{product.rating}</span>
                <span className="text-stone-500">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price and EMI Tag */}
            <div className="mt-4 pb-4 border-b border-stone-100">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-stone-900">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-stone-600">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Or pay from <strong>{formatBDT(emiPerMonth)}/month</strong> with 0% EMI (up to 12 months)
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm text-stone-600 leading-relaxed">
              {product.description}
            </p>

            {/* Hardware Specifications */}
            <div className="mt-6 pt-5 border-t border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                Key Technical Specifications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                {product.specs?.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 flex-shrink-0"></span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Timeline info */}
            <div className="mt-6 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Joy Mart Express Delivery Coverage:</span>
              </div>
              <p className="text-[11px] text-stone-600 pl-6">
                • <strong>Dhaka City:</strong> Guaranteed delivery within 24 hours. <br />
                • <strong>Chittagong, Sylhet & Nationwide:</strong> 48 to 72 hours via courier.
              </p>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="mt-8 pt-6 border-t border-stone-200 space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity-selector" className="text-xs font-bold text-stone-700">
                Quantity:
              </label>
              <div className="inline-flex items-center border border-stone-200 rounded-xl bg-stone-50">
                <button
                  type="button"
                  id="decrease-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span id="quantity-selector" className="w-10 text-center text-sm font-bold text-stone-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="increase-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                id="add-to-cart-detail-btn"
                className={`flex-1 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-900 hover:bg-stone-800 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart — {formatBDT(product.price * quantity)}</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/cart');
                }}
                className="py-4 px-6 rounded-xl font-bold text-sm bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors shadow-xs"
              >
                Buy Now
              </button>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
                <Truck className="w-3.5 h-3.5 mx-auto mb-1 text-stone-800" />
                <span className="font-semibold block text-stone-900">Express Ship</span>
                <span>All 64 Districts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
                <RotateCcw className="w-3.5 h-3.5 mx-auto mb-1 text-stone-800" />
                <span className="font-semibold block text-stone-900">7 Days</span>
                <span>Replacement</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600">
                <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-stone-800" />
                <span className="font-semibold block text-stone-900">Official</span>
                <span>Brand Warranty</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Back to Products CTA */}
      <div className="mt-14 pt-8 border-t border-stone-200">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 hover:text-stone-950 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Joy Mart Hardware</span>
        </Link>
      </div>

    </div>
  );
}
