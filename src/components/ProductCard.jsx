import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatBDT } from '../utils/format';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative glass rounded-2xl p-3.5 flex flex-col transition-all duration-300 hover:shadow-glass-lg hover:border-[#E98545]/40">
      
      {/* Product Image Frame with Rounded Borders */}
      <Link
        to={`/products/${product.id}`}
        className="block relative aspect-square rounded-xl overflow-hidden bg-[#F3F1ED] cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.badge && (
            <span className="bg-[#252525] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#E98545] text-white text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md shadow-sm">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Floating Quick View Icon */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity glass-chip p-1.5 rounded-full text-[#252525] shadow-md">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Stock Status Indicator */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full glass-chip text-[#252525] shadow-xs">
            {product.availability}
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="pt-3.5 pb-1 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-[#777777] mb-1.5">
            <span className="font-bold text-[11px] uppercase tracking-wider text-[#777777]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 font-bold text-[#252525] bg-[#FBE9DC] px-2 py-0.5 rounded-full text-[10px]">
              <Star className="w-3 h-3 fill-[#E98545] text-[#E98545]" />
              <span>{product.rating}</span>
              <span className="text-[#777777] font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          <Link
            to={`/products/${product.id}`}
            className="block text-sm font-extrabold text-[#252525] group-hover:text-[#E98545] line-clamp-1 transition-colors leading-snug"
          >
            {product.name}
          </Link>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-[#E7E5E1] flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-[#252525]">
                {formatBDT(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-[#D9534F] line-through">
                  {formatBDT(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-[#777777] font-medium block">Official Warranty</span>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 bg-[#E98545] hover:bg-[#D6742F] active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

    </div>
  );
}
