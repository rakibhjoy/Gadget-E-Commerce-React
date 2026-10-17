import { Link } from 'react-router-dom';
import { Shield, Truck, RotateCcw, CreditCard, PhoneCall, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-stone-200/90 bg-white">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-stone-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">Free Bangladesh Shipping</p>
              <p className="text-[11px] text-stone-500">Free delivery on orders over ৳10,000</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">7-Day Replacement</p>
              <p className="text-[11px] text-stone-500">Easy hardware exchange policy</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">Official Brand Warranty</p>
              <p className="text-[11px] text-stone-500">Direct authorized warranty support</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-stone-900">0% Interest EMI</p>
              <p className="text-[11px] text-stone-500">Up to 36 months bank financing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center font-extrabold text-xs">
                JM
              </div>
              <span className="font-extrabold text-lg tracking-tight text-stone-900">
                JOY MART
              </span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed max-w-sm mb-4">
              Joy Mart is your trusted destination for genuine smartphones, laptops, audio gear, and lifestyle tech gadgets in Bangladesh.
            </p>
            <div className="space-y-1.5 text-xs text-stone-600">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Gulshan-2, Dhaka 1212, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Hotline: +880 1700-JOYMART (9am - 10pm)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>support@joymart.com.bd</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link to="/products?category=Smartphones" className="hover:text-stone-900 transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Laptops" className="hover:text-stone-900 transition-colors">
                  Laptops & MacBooks
                </Link>
              </li>
              <li>
                <Link to="/products?category=Audio%20%26%20Sound" className="hover:text-stone-900 transition-colors">
                  Audio & Headphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=Smartwatches" className="hover:text-stone-900 transition-colors">
                  Smartwatches
                </Link>
              </li>
              <li>
                <Link to="/products?category=Gaming%20%26%20Gear" className="hover:text-stone-900 transition-colors">
                  Gaming Gear
                </Link>
              </li>
              <li>
                <Link to="/products?category=Accessories" className="hover:text-stone-900 transition-colors">
                  GaN Chargers & Cables
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Customer Hub
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link to="/products?deal=true" className="hover:text-amber-700 font-semibold transition-colors">
                  ⚡ Flash Sale Offers
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-stone-900 transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-stone-900 transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <span className="text-stone-400 cursor-default">Warranty Claim</span>
              </li>
              <li>
                <span className="text-stone-400 cursor-default">Store Locator</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Accepted Payments
            </h4>
            <div className="space-y-2 text-xs text-stone-500 leading-relaxed">
              <p>• bKash, Nagad & Rocket</p>
              <p>• Visa & MasterCard</p>
              <p>• Cash on Delivery (All BD)</p>
              <p>• 0% Bank EMI Facility</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Joy Mart Bangladesh Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium">Curated Luxury Tech & Minimal Hardware.</p>
        </div>
      </div>
    </footer>
  );
}
