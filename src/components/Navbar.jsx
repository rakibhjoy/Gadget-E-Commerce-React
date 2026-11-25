import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, GitCompareArrows, Heart, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react';
import { catalog, categoryPath, matchesQuery, productPath, searchPath } from '../data/catalog';
import { useAuth, useCart, useFavorites } from '../context/storeContexts';
import { Brand, ProductImage } from './StoreUI';
import { formatBDT } from '../utils/format';

const navItems = [
  ['Shop', '/products'],
  ['Phones', categoryPath('Smartphones')],
  ['Laptops', categoryPath('Laptops')],
  ['Audio', categoryPath('Audio & Sound')],
  ['Wearables', categoryPath('Smartwatches')],
  ['Gaming', categoryPath('Gaming & Gear')],
  ['Accessories', categoryPath('Accessories')],
  ['Deals', '/products?deal=true'],
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { wishlist, compare } = useFavorites();
  const { isAuthenticated } = useAuth();
  const { pathname, search, key } = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState(() => new URLSearchParams(search).get('search') || '');
  const [openPanel, setOpenPanel] = useState('');
  const menuButton = useRef(null);
  const searchButton = useRef(null);
  const searchInput = useRef(null);
  const menuOpen = openPanel === 'menu';
  const searchOpen = openPanel === 'search';
  const accountPath = isAuthenticated ? '/profile' : '/login';
  const suggestions = query.trim() ? catalog.filter((product) => matchesQuery(product, query)).slice(0, 5) : [];

  useEffect(() => {
    setQuery(new URLSearchParams(search).get('search') || '');
    setOpenPanel('');
  }, [key, search]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  function closePanel(event, button) {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    setOpenPanel('');
    button.current?.focus();
  }

  function submit(event) {
    event.preventDefault();
    setOpenPanel('');
    navigate(query.trim() ? searchPath(query.trim()) : '/products');
  }

  return (
    <header className="site-header">
      <div className="announcement"><div className="container announcement-inner">
        <span>Free standard delivery on orders over {formatBDT(10000)}</span>
        <Link to="/track">Track order <ArrowRight size={14} aria-hidden="true" /></Link>
      </div></div>
      <div className="container header-main">
        <button type="button" className="icon-button mobile-menu-button" ref={menuButton}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation"
          onClick={() => setOpenPanel(menuOpen ? '' : 'menu')} onKeyDown={(event) => closePanel(event, menuButton)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <Brand />
        <nav className="desktop-nav" aria-label="Shop categories">
          {navItems.map(([label, path]) => <Link key={label} to={path} aria-current={pathname + search === path ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <nav className="header-actions" aria-label="Account and shopping">
          <button type="button" className="head-action search-toggle" ref={searchButton} aria-label={searchOpen ? 'Close search' : 'Search'} aria-expanded={searchOpen}
            aria-controls="store-search" onClick={() => setOpenPanel(searchOpen ? '' : 'search')} onKeyDown={(event) => closePanel(event, searchButton)}>
            {searchOpen ? <X size={21} aria-hidden="true" /> : <Search size={20} aria-hidden="true" />}
          </button>
          <NavLink className="head-action account-link" to={accountPath} aria-label="Account"><UserRound size={20} aria-hidden="true" /></NavLink>
          <NavLink className="head-action compare-link" to="/compare" aria-label={'Compare, ' + compare.length + ' items'}><GitCompareArrows size={19} aria-hidden="true" />{compare.length > 0 && <b>{compare.length}</b>}</NavLink>
          <NavLink className="head-action" to="/wishlist" aria-label={'Wishlist, ' + wishlist.length + ' items'}><Heart size={20} aria-hidden="true" />{wishlist.length > 0 && <b>{wishlist.length}</b>}</NavLink>
          <NavLink className="head-action cart-link" to="/cart" aria-label={'Cart, ' + totalItems + ' items'}><ShoppingBag size={20} aria-hidden="true" /><b hidden={!totalItems}>{totalItems}</b></NavLink>
        </nav>
      </div>
      <nav id="mobile-navigation" className="mobile-nav container" aria-label="Mobile menu" hidden={!menuOpen}
        onKeyDown={(event) => closePanel(event, menuButton)}>
        {navItems.map(([label, path]) => <Link key={label} to={path}>{label}</Link>)}
        <Link to={accountPath}>Account</Link>
        <Link to="/compare">Compare ({compare.length})</Link><Link to="/track">Track order</Link><Link to="/support/contact">Contact</Link>
      </nav>
      <div id="store-search" className="search-panel" hidden={!searchOpen}
        onKeyDown={(event) => closePanel(event, searchButton)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget) && event.relatedTarget !== searchButton.current) setOpenPanel('');
        }}>
        <div className="container">
          <form className="header-search" role="search" onSubmit={submit}>
            <Search size={20} aria-hidden="true" />
            <input ref={searchInput} type="search" aria-label="Search gadgets" placeholder="Search gadgets or brands"
              value={query} onChange={(event) => setQuery(event.target.value)} />
            <button type="submit" aria-label="Submit search"><ArrowRight size={19} aria-hidden="true" /></button>
            {query.trim() && <div className="suggestions" aria-label="Search suggestions">
              <p role="status">{suggestions.length ? 'Suggested products' : 'No matching products'}</p>
              {suggestions.map((item) => <Link to={productPath(item.id)} key={item.id}>
                <ProductImage src={item.image} alt="" sizes="42px" /><span>{item.name}<small>{item.category}</small></span><strong>{formatBDT(item.price)}</strong>
              </Link>)}
              <Link to={searchPath(query.trim())}>See all search results <ArrowRight size={16} /></Link>
            </div>}
          </form>
        </div>
      </div>
    </header>
  );
}
