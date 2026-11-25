import { Link } from 'react-router-dom';
import { ArrowUpRight, Headphones, PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { categories, categoryPath } from '../data/catalog';
import { Brand } from './StoreUI';
import { formatBDT } from '../utils/format';

const support = [
  ['Contact', '/support/contact'], ['FAQ', '/support/faq'], ['Shipping & returns', '/support/shipping-returns'],
  ['Warranty', '/support/warranty'], ['Track order', '/track'],
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="benefit-bar"><div className="container benefits">
        <Link to="/support/shipping-returns"><Truck /><span><b>Nationwide delivery</b><small>Free standard delivery over {formatBDT(10000)}</small></span></Link>
        <Link to="/support/warranty"><ShieldCheck /><span><b>Brand warranty</b><small>Check coverage before purchase</small></span></Link>
        <Link to="/support/shipping-returns"><RotateCcw /><span><b>7-day replacement</b><small>For eligible defective items</small></span></Link>
        <Link to="/support/contact"><Headphones /><span><b>Customer support</b><small>Get help with your order</small></span></Link>
      </div></div>
      <div className="footer-dark"><div className="container">
        <div className="footer-grid">
          <div className="footer-about"><Brand /><p>Smartphones, laptops, audio and everyday tech for shoppers across Bangladesh.</p><Link to="/support/contact">Contact Joy Mart <ArrowUpRight size={15} /></Link></div>
          <div><h2>Shop</h2>{categories.slice(1).map((category) => <Link to={categoryPath(category)} key={category}>{category}</Link>)}</div>
          <div><h2>Support</h2>{support.map(([title, path]) => <Link to={path} key={path}>{title}</Link>)}</div>
          <div><h2>Your account</h2><Link to="/profile">My account</Link><Link to="/wishlist">Wishlist</Link><Link to="/compare">Compare products</Link><Link to="/cart">Cart</Link></div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Joy Mart</span><span><PackageCheck size={15} aria-hidden="true" /> Demo storefront · Bangladesh · BDT</span><div><Link to="/support/privacy">Privacy policy</Link><Link to="/support/terms">Terms</Link></div></div>
      </div></div>
    </footer>
  );
}
