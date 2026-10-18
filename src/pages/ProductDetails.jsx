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
        <h2 className="text-2xl font-bold text-[#252525]">Product Not Found</h2>
        <p className="mt-2 text-sm text-[#777777]">
          The requested device does not exist or has been discontinued.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#E98545] text-white rounded-xl text-sm font-semibold hover:bg-[#D6742F]"
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
      <nav className="flex items-center gap-2 text-xs text-[#777777] mb-8">
        <Link to="/" className="hover:text-[#E98545]">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-[#E98545]">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#E98545]">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#252525] font-bold truncate">{product.name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        
        {/* Left: Product Image Showcase — Glass */}
        <div className="glass rounded-3xl overflow-hidden aspect-square relative group shadow-glass-card p-4">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-[#F3F1ED] relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold glass-chip text-[#252525] shadow-sm">
                {product.availability}
              </span>
              {discountPercent > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E98545] text-white shadow-sm">
                  {discountPercent}% SAVINGS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Product Info & Actions — Glass */}
        <div className="glass rounded-3xl p-6 sm:p-10 shadow-glass-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E98545]">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#252525] bg-[#FBE9DC] px-3 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-[#E98545] text-[#E98545]" />
                <span className="font-bold text-[#252525]">{product.rating}</span>
                <span className="text-[#777777]">({product.reviewsCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="mt-3 text-2xl sm:text-4xl font-extrabold text-[#252525] tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Price and EMI Tag */}
            <div className="mt-4 pb-4 border-b border-[#E7E5E1]">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#252525]">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#D9534F] line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#777777]">
                <CreditCard className="w-3.5 h-3.5 text-[#E98545]" />
                <span>
                  Or pay from <strong className="text-[#252525]">{formatBDT(emiPerMonth)}/month</strong> with 0% EMI (up to 12 months)
                </span>
              </div>
            </div>

            <p className="mt-5 text-sm text-[#777777] leading-relaxed">
              {product.description}
            </p>

            {/* Hardware Specifications */}
            <div className="mt-6 pt-5 border-t border-[#E7E5E1]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#252525] mb-3">
                Key Technical Specifications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#777777]">
                {product.specs?.map((spec, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E98545] mt-2 flex-shrink-0"></span>
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Delivery Timeline info — Glass Accent */}
            <div className="mt-6 p-3.5 glass-accent rounded-2xl text-xs text-[#252525] space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-[#252525]">
                <MapPin className="w-4 h-4 text-[#E98545]" />
                <span>Joy Mart Express Delivery Coverage:</span>
              </div>
              <p className="text-[11px] text-[#777777] pl-6">
                • <strong>Dhaka City:</strong> Guaranteed delivery within 24 hours. <br />
                • <strong>Chittagong, Sylhet & Nationwide:</strong> 48 to 72 hours via courier.
              </p>
            </div>
          </div>

          {/* Quantity Selector & Add to Cart */}
          <div className="mt-8 pt-6 border-t border-[#E7E5E1] space-y-4">
            <div className="flex items-center gap-4">
              <label htmlFor="quantity-selector" className="text-xs font-bold text-[#252525]">
                Quantity:
              </label>
              <div className="inline-flex items-center border border-[#E7E5E1] rounded-xl bg-[#F3F1ED]">
                <button
                  type="button"
                  id="decrease-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#777777] hover:text-[#E98545] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span id="quantity-selector" className="w-10 text-center text-sm font-bold text-[#252525]">
                  {quantity}
                </span>
                <button
                  type="button"
                  id="increase-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-[#777777] hover:text-[#E98545] transition-colors"
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
                    ? 'bg-[#27845A] text-white'
                    : 'bg-[#252525] hover:bg-[#3a3a3a] text-white'
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
                className="py-4 px-6 rounded-xl font-bold text-sm bg-[#E98545] hover:bg-[#D6742F] text-white transition-colors shadow-xs"
              >
                Buy Now
              </button>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#E7E5E1] text-[11px] text-[#777777]">
                <Truck className="w-3.5 h-3.5 mx-auto mb-1 text-[#E98545]" />
                <span className="font-semibold block text-[#252525]">Express Ship</span>
                <span>All 64 Districts</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#E7E5E1] text-[11px] text-[#777777]">
                <RotateCcw className="w-3.5 h-3.5 mx-auto mb-1 text-[#E98545]" />
                <span className="font-semibold block text-[#252525]">7 Days</span>
                <span>Replacement</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F3F1ED] border border-[#E7E5E1] text-[11px] text-[#777777]">
                <ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1 text-[#E98545]" />
                <span className="font-semibold block text-[#252525]">Official</span>
                <span>Brand Warranty</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Back to Products CTA */}
      <div className="mt-14 pt-8 border-t border-[#E7E5E1]">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#252525] hover:text-[#E98545] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Joy Mart Hardware</span>
        </Link>
      </div>

    </div>
  );
}
