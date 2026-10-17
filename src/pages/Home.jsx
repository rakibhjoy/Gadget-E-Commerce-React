import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Gamepad2,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Flame,
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import { products, heroBanners } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // Auto-advance banner every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const activeBanner = heroBanners[currentBannerIndex];

  const featuredProducts = products.filter((p) => p.isFeatured);
  const flashDeals = products.filter((p) => p.isDeal).slice(0, 4);

  const categoryCards = [
    { name: 'Smartphones', icon: Smartphone, count: '3 Flagships', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=400&q=80' },
    { name: 'Laptops', icon: Laptop, count: '2 Workstations', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' },
    { name: 'Audio & Sound', icon: Headphones, count: '3 Studio Gear', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
    { name: 'Smartwatches', icon: Watch, count: '2 Models', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' },
    { name: 'Gaming & Gear', icon: Gamepad2, count: '2 Pro Devices', image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80' },
    { name: 'Accessories', icon: Zap, count: '4 Essentials', image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="space-y-14 sm:space-y-20 pb-20">
      
      {/* Grand Hero Promotional Banner Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white min-h-[460px] sm:min-h-[520px] flex items-center shadow-xl">
          
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src={activeBanner.image}
              alt={activeBanner.title}
              className="w-full h-full object-cover object-center opacity-40 scale-105 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent"></div>
          </div>

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide mb-6 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeBanner.tag} • {activeBanner.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {activeBanner.title}
            </h1>

            <p className="mt-5 text-sm sm:text-base text-stone-300 leading-relaxed font-light max-w-lg">
              {activeBanner.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to={activeBanner.link}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition-all text-sm shadow-md active:scale-95"
              >
                <span>{activeBanner.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all text-sm backdrop-blur-xs border border-white/10"
              >
                <span>Browse All Products</span>
              </Link>
            </div>

            {/* Slider Indicator Dots */}
            <div className="flex items-center gap-2 mt-10">
              {heroBanners.map((b, idx) => (
                <button
                  key={b.id}
                  onClick={() => setCurrentBannerIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentBannerIndex ? 'w-8 bg-amber-400' : 'w-2 bg-stone-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Trust & Guarantee Strip (Off-White Luxury Card) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">100% Genuine Tech</h4>
                <p className="text-[11px] text-stone-500">Official brand sealed packs</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">Fast BD Delivery</h4>
                <p className="text-[11px] text-stone-500">24h Dhaka, 48h Nationwide</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">0% EMI Available</h4>
                <p className="text-[11px] text-stone-500">Up to 36 months bank EMI</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900">7-Day Replacement</h4>
                <p className="text-[11px] text-stone-500">Hassle-free return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Deals / Hot Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-stone-50 to-amber-500/10 border border-amber-200/60 rounded-3xl p-6 sm:p-10 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs mb-2">
                <Flame className="w-4 h-4 fill-stone-950" />
                <span>LIMITED TIME DEALS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                Joy Mart Flash Sale
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Special markdown prices on top smartphones, audio, and wearables.
              </p>
            </div>

            <Link
              to="/products?deal=true"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold self-start sm:self-auto transition-colors"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* Categories Grid Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 block">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 hover:underline"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categoryCards.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group relative bg-white border border-stone-200 rounded-2xl p-4 flex flex-col items-center text-center hover:border-stone-900 hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-800 group-hover:bg-stone-900 group-hover:text-white transition-colors mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-amber-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-stone-400 mt-0.5">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Flagships Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
              Handpicked Essentials
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Featured Flagships
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-semibold text-stone-800 hover:underline flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Dual Promotional Campaign Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[320px] group shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
              alt="Pro Studio Headphones"
              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                Acoustic Clarity
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                Studio ANC Headphones <br /> engineered for audiophiles
              </h3>
            </div>
            <div className="relative z-10 pt-6">
              <Link
                to="/products?category=Audio%20%26%20Sound"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-950 font-bold rounded-xl text-xs hover:bg-stone-100 transition-colors"
              >
                <span>Shop Audio Gear</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-10 flex flex-col justify-between min-h-[320px] group shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
              alt="Pro Laptops"
              className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                Creator Workstations
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                MacBlade & Carbon Books <br /> with 0% EMI financing
              </h3>
            </div>
            <div className="relative z-10 pt-6">
              <Link
                to="/products?category=Laptops"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-stone-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition-colors"
              >
                <span>Discover Laptops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Joy Mart VIP Club / Discount Voucher Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-stone-200/90 rounded-3xl bg-white p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JOY MART PRIVILEGE CLUB</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Get ৳500 Off Your First Order
          </h3>
          <p className="mt-3 text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Join 45,000+ tech lovers across Bangladesh. Receive exclusive secret coupon codes, flash deal alerts, and warranty priority support.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your phone or email..."
              className="w-full sm:w-auto flex-grow px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-stone-900"
            />
            <button
              onClick={() => alert('Welcome to Joy Mart VIP Club! Your ৳500 voucher code is: JOY500')}
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors whitespace-nowrap"
            >
              Claim Voucher
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
