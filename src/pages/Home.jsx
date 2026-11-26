import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Cable, Gamepad2, Headphones, Laptop, Smartphone, Watch } from 'lucide-react';
import { catalog, categoryPath, collectionIds, productById } from '../data/catalog';
import { useFavorites } from '../context/storeContexts';
import ProductCard from '../components/ProductCard';
import { ProductImage } from '../components/StoreUI';

const departments = [
  ['Smartphones', 'Phones', Smartphone],
  ['Laptops', 'Laptops', Laptop],
  ['Audio & Sound', 'Audio', Headphones],
  ['Smartwatches', 'Wearables', Watch],
  ['Gaming & Gear', 'Gaming', Gamepad2],
  ['Accessories', 'Accessories', Cable],
];

const collections = [
  { id: 'bestseller', title: 'Bestsellers', to: '/products?collection=bestseller', items: collectionIds.bestseller.map((id) => productById[id]) },
  { id: 'new', title: 'New arrivals', to: '/products?collection=new', items: collectionIds.new.map((id) => productById[id]) },
  { id: 'deals', title: 'Deals', to: '/products?deal=true', items: catalog.filter((item) => item.isDeal).sort((a, b) => b.reviewsCount - a.reviewsCount).slice(0, 4) },
];

const showcases = [
  { title: 'Work & create', description: 'Laptops for your desk and wherever work takes you.', image: productById['laptop-studio-16'].image, to: categoryPath('Laptops'), action: 'Shop laptops' },
  { title: 'Gaming deals', description: 'Save on controllers and selected gaming gear.', image: productById['gaming-controller-pro'].image, to: '/products?category=Gaming+%26+Gear&deal=true', action: 'Find gaming deals' },
];

export default function Home() {
  const [selection, setSelection] = useState('bestseller');
  const { recent, clearRecent } = useFavorites();
  const collectionHeading = useRef(null);
  const collection = collections.find(({ id }) => id === selection);

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <picture className="hero-media">
          <source media="(max-width: 700px)" srcSet={import.meta.env.BASE_URL + 'joy-mart-listening-mobile.jpg'} />
          <img className="hero-photo" src={import.meta.env.BASE_URL + 'joy-mart-listening.jpg'}
            alt="Graphite headphones on a stone plinth lit in blue" width="1536" height="1024" fetchPriority="high" />
        </picture>
        <div className="container hero-layout">
          <div className="hero-copy">
            <p className="hero-kicker">Audio &amp; sound</p>
            <h1 id="hero-title">A better way to listen.</h1>
            <p className="hero-description">Headphones, earbuds and speakers for the way you listen.</p>
            <div className="hero-actions">
              <Link className="button primary" to={categoryPath('Audio & Sound')}>Shop audio <ArrowUpRight size={16} aria-hidden="true" /></Link>
              <Link className="hero-link" to="/products">Explore all tech <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container home-showcases" aria-label="Featured categories and deals">
        {showcases.map(({ title, description, image, to, action }) => (
          <Link className="story-card" to={to} key={title}>
            <ProductImage src={image} alt="" sizes="(max-width: 700px) 100vw, 60vw" />
            <div className="story-copy">
              <h2>{title}</h2>
              <p>{description}</p>
              <span className="text-link">{action} <ArrowUpRight size={16} aria-hidden="true" /></span>
            </div>
          </Link>
        ))}
      </section>

      <section className="container home-section categories-section" aria-labelledby="categories-title">
        <div className="section-heading"><h2 id="categories-title">Explore categories</h2><Link className="text-link" to="/products">Shop all <ArrowRight size={16} aria-hidden="true" /></Link></div>
        <div className="category-grid">
          {departments.map(([category, label, Icon]) => (
            <Link to={categoryPath(category)} className="category-tile" key={category}>
              <Icon size={27} strokeWidth={1.55} aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container home-section home-collection" aria-labelledby="collection-title">
        <div className="section-heading"><h2 id="collection-title" ref={collectionHeading} tabIndex={-1}>Shop the collection</h2></div>
        <div className="collection-controls">
          <div className="collection-tabs" role="group" aria-label="Home product collections">
            {collections.map(({ id, title }) => (
              <button type="button" aria-pressed={selection === id} onClick={() => setSelection(id)} key={id}>{title}</button>
            ))}
          </div>
          <Link className="text-link" to={collection.to}>View {collection.title.toLowerCase()} <ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="product-grid" aria-label={collection.title}>
          {collection.items.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="container home-section" aria-labelledby="recent-title">
          <div className="section-heading">
            <h2 id="recent-title">Recently viewed</h2>
            <button type="button" className="link-button recent-clear" onClick={() => {
              clearRecent();
              collectionHeading.current?.focus();
            }}>Clear history</button>
          </div>
          <div className="product-grid">{recent.map((id) => <ProductCard product={productById[id]} key={id} />)}</div>
        </section>
      )}
    </div>
  );
}
