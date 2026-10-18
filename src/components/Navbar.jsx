import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Search,
  Flame,
  Truck,
  PhoneCall,
  ChevronDown,
  MapPin,
  Package,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/products';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState('');

  const searchInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const { totalItems, notification } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcut Ctrl+K to toggle search
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setCategoryDropdownOpen(false);
        setUserDropdownOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(navSearchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setNavSearchQuery('');
    }
  };

  const trendingTags = ['JoyPhone Titanium', 'MacBlade M3', 'Aura ANC', '100W GaN', 'JoyWatch Ultra'];

  const navLinkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
      isActive
        ? 'bg-[#E98545] text-white shadow-sm'
        : 'text-[#777777] hover:text-[#252525] hover:bg-[#FBE9DC]'
    }`;

  return (
    <>
      {/* Top Bar */}
      <div className="bg-[#252525] text-white/70 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          
          <div className="flex items-center gap-2.5">
            <span className="bg-[#E98545] text-white font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              JOY MART 2026
            </span>
            <span className="text-white/60 text-[11px] sm:text-xs">
              Complimentary Priority Shipping in Bangladesh on orders &gt; ৳10,000
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[11px] text-white/50">
            <Link
              to="/track"
              className="hover:text-[#E98545] transition-colors flex items-center gap-1.5 font-medium"
            >
              <Truck className="w-3.5 h-3.5 text-[#E98545]" />
              <span>Track Parcel</span>
            </Link>
            <span className="text-white/20">•</span>
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-white/40" />
              <span>Hotline: +880 1700-JOYMART</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Glassmorphic Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-[#E7E5E1]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Brand Monogram & Name */}
            <div className="flex items-center gap-8 lg:gap-10">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-[#E98545] text-white flex items-center justify-center font-black text-sm tracking-widest shadow-sm group-hover:scale-105 transition-transform duration-200 glow-accent">
                  JM
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xl tracking-tight text-[#252525] leading-tight flex items-center gap-1">
                    JOY MART
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E98545] inline-block"></span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#777777] font-bold -mt-0.5">
                    Curated Hardware
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1.5 p-1 glass-chip rounded-full">
                <NavLink to="/" end className={navLinkClass}>
                  Home
                </NavLink>

                {/* Categories Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-[#777777] hover:text-[#252525] hover:bg-[#FBE9DC] transition-all"
                  >
                    <span>Categories</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#777777] transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 glass rounded-2xl shadow-glass-lg p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-1 mb-1 border-b border-[#E7E5E1]">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#777777]">
                          Hardware Collections
                        </span>
                      </div>
                      {categories.filter((c) => c !== 'All').map((cat) => (
                        <Link
                          key={cat}
                          to={`/products?category=${encodeURIComponent(cat)}`}
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="block px-3 py-2 text-xs font-semibold text-[#252525] hover:bg-[#FBE9DC] hover:text-[#E98545] rounded-xl transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                      <div className="pt-2 mt-1 border-t border-[#E7E5E1]">
                        <Link
                          to="/products"
                          onClick={() => setCategoryDropdownOpen(false)}
                          className="block px-3 py-1.5 text-xs font-bold text-[#E98545] hover:underline"
                        >
                          Browse All Products →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <NavLink to="/products" className={navLinkClass}>
                  All Gadgets
                </NavLink>

                <NavLink to="/products?deal=true" className={navLinkClass}>
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#E98545] fill-[#E98545]" />
                    <span>Deals</span>
                  </span>
                </NavLink>

              </nav>
            </div>

            {/* Right: Search Pill, Profile Dropdown, and Cart Button */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Refined Search Trigger Pill */}
              <button
                type="button"
                id="navbar-search-btn"
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center gap-3 h-10 px-4 rounded-full glass-chip text-[#777777] hover:border-[#E98545]/40 transition-all text-xs font-medium w-48 xl:w-64 shadow-sm group"
                aria-label="Open search modal"
              >
                <Search className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#E98545] transition-colors" />
                <span className="truncate text-[#777777] group-hover:text-[#252525]">Search gadgets...</span>
                <kbd className="ml-auto text-[10px] font-mono bg-white px-1.5 py-0.5 rounded-md border border-[#E7E5E1] text-[#777777] font-semibold shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Search Icon Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#252525] hover:text-[#E98545] hover:bg-[#FBE9DC] md:hidden transition-colors"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account Dropdown */}
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 h-10 px-2.5 rounded-full glass-chip hover:border-[#E98545]/40 transition-all shadow-sm"
                    aria-label="User Account"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-6 h-6 rounded-full object-cover ring-2 ring-[#E98545]/30"
                    />
                    <span className="hidden sm:inline text-xs font-bold text-[#252525] max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#777777] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 glass rounded-2xl shadow-glass-lg p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="p-3 border-b border-[#E7E5E1] mb-1 bg-[#FBE9DC]/40 rounded-xl">
                        <p className="text-xs font-black text-[#252525] truncate">{user.name}</p>
                        <p className="text-[11px] text-[#777777] truncate mt-0.5">{user.email}</p>
                      </div>

                      <Link
                        to="/profile?tab=profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#252525] hover:bg-[#FBE9DC] hover:text-[#E98545] rounded-xl transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[#777777]" />
                        <span>My Profile & Avatar</span>
                      </Link>

                      <Link
                        to="/profile?tab=addresses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#252525] hover:bg-[#FBE9DC] hover:text-[#E98545] rounded-xl transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#777777]" />
                        <span>Delivery Addresses</span>
                      </Link>

                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#252525] hover:bg-[#FBE9DC] hover:text-[#E98545] rounded-xl transition-colors"
                      >
                        <Package className="w-3.5 h-3.5 text-[#777777]" />
                        <span>My Orders</span>
                      </Link>

                      <div className="pt-1 mt-1 border-t border-[#E7E5E1]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#D9534F] hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-full glass-chip text-[#252525] hover:border-[#E98545]/40 hover:bg-[#FBE9DC] transition-all text-xs font-bold shadow-sm"
                >
                  <User className="w-3.5 h-3.5 text-[#777777]" />
                  <span>Sign In</span>
                </NavLink>
              )}

              {/* Shopping Cart Pill Button */}
              <Link
                to="/cart"
                id="navbar-cart-btn"
                className="relative inline-flex items-center gap-2 h-10 px-4 bg-[#E98545] text-white hover:bg-[#D6742F] active:scale-95 rounded-full text-xs font-black transition-all shadow-md"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-white/80" />
                <span className="hidden sm:inline">Cart</span>
                {totalItems > 0 && (
                  <span className="bg-white text-[#E98545] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center -mr-1">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-[#252525] hover:text-[#E98545] hover:bg-[#FBE9DC] lg:hidden transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>

          </div>
        </div>



        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#E7E5E1] glass px-6 py-6 space-y-5 shadow-glass animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#252525] font-extrabold text-base py-1"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#252525] font-bold py-1"
              >
                All Products
              </Link>
              <Link
                to="/products?deal=true"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#E98545] font-bold py-1 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-[#E98545] fill-[#E98545]" />
                <span>Flash Deals</span>
              </Link>


              {/* Categories Grid on Mobile */}
              <div className="pt-4 border-t border-[#E7E5E1]">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#777777] block mb-3">
                  Hardware Categories
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {categories.filter((c) => c !== 'All').map((cat) => (
                    <Link
                      key={cat}
                      to={`/products?category=${encodeURIComponent(cat)}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-xl bg-[#F3F1ED] text-[#252525] font-bold hover:bg-[#FBE9DC] hover:text-[#E98545] transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Account Controls on Mobile */}
              <div className="pt-4 border-t border-[#E7E5E1]">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-[#F3F1ED] border border-[#E7E5E1]"
                    >
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <p className="text-xs font-black text-[#252525]">{user.name}</p>
                        <p className="text-[11px] text-[#E98545] font-bold mt-0.5">Manage Profile & Addresses →</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 text-xs text-[#D9534F] font-bold"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#E98545] text-white font-bold text-xs"
                  >
                    <span>Sign In to Joy Mart</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Search Dropdown — appears just below the navbar, no overlay */}
      {searchOpen && (
        <>
          {/* Invisible click-away overlay */}
          <div
            className="fixed inset-0 z-[998]"
            onClick={() => setSearchOpen(false)}
          />
          {/* Search panel — drops down from top, sits just below sticky header */}
          <div className="fixed top-[80px] sm:top-[114px] left-0 right-0 z-[999] px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto glass rounded-2xl shadow-glass-lg p-4">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777777]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={navSearchQuery}
                  onChange={(e) => setNavSearchQuery(e.target.value)}
                  placeholder="Search gadgets, brands, models…"
                  className="w-full pl-11 pr-28 py-3 text-sm bg-[#F3F1ED] border border-[#E7E5E1] rounded-xl focus:outline-none focus:border-[#E98545] focus:bg-white transition-colors"
                />
                <div className="absolute right-2 flex items-center gap-1.5">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E98545] text-white text-xs font-bold rounded-lg hover:bg-[#D6742F] transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Trending Tags */}
              <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="font-bold text-xs text-[#777777] flex items-center gap-1 flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-[#E98545]" />
                  <span>Popular:</span>
                </span>
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(tag)}`);
                      setSearchOpen(false);
                    }}
                    className="px-3 py-1 rounded-full bg-[#FBE9DC] hover:bg-[#E98545] hover:text-white text-[#252525] whitespace-nowrap text-xs font-semibold transition-colors flex-shrink-0"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Global Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[1000] flex items-center gap-3 bg-[#252525] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm font-bold animate-bounce-subtle border border-white/10">
          <span className="w-2 h-2 rounded-full bg-[#E98545]"></span>
          <span>{notification}</span>
        </div>
      )}
    </>
  );
}
