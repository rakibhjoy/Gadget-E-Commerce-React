import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, ImageOff, PackageOpen, Star } from 'lucide-react';
import { sizedImage } from '../data/catalog';
import { formatBDT } from '../utils/format';

export function Brand() {
  return <Link to="/" className="brand" aria-label="Joy Mart home"><span className="brand-mark" aria-hidden="true">JM</span><span>Joy<span className="brand-divider"> </span>Mart</span></Link>;
}

export function ProductImage({ src, alt, sizes = '(max-width: 600px) 48vw, 320px', eager = false, className = '' }) {
  const [failed, setFailed] = useState('');
  const remote = src?.startsWith('https://images.unsplash.com/');
  return (
    <div className={'product-image ' + className}>
      {src && failed !== src ? (
        <img
          src={sizedImage(src, 720)}
          srcSet={remote ? [320, 480, 720, 1080, 1440].map((width) => sizedImage(src, width) + ' ' + width + 'w').join(', ') : undefined}
          sizes={remote ? sizes : undefined}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          width="720"
          height="720"
          onError={() => setFailed(src)}
        />
      ) : <span className="image-fallback" role="img" aria-label={alt + '. Image unavailable.'}><ImageOff size={24} /><span>Image unavailable</span></span>}
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">
    <Link to="/">Home</Link>
    {items.map(({ label, to }) => <span className="breadcrumb" key={label}><ChevronRight size={14} aria-hidden="true" />
      {to ? <Link to={to}>{label}</Link> : <span aria-current="page">{label}</span>}
    </span>)}
  </nav>;
}

export function PageTitle({ title, subtitle }) {
  return <header className="page-title"><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</header>;
}

export function EmptyState({ title, text, to = '/products', action = 'Explore the shop' }) {
  return <section className="container empty-state"><PackageOpen size={34} /><h1>{title}</h1><p>{text}</p><Link className="button primary" to={to}>{action}<ArrowRight size={16} /></Link></section>;
}

export function Price({ price, original }) {
  return <span className="price"><strong>{formatBDT(price)}</strong>{original > price && <del>{formatBDT(original)}</del>}</span>;
}

export function Rating({ rating, count }) {
  return <span className="rating" aria-label={rating.toFixed(1) + ' out of 5, ' + count + ' demo ratings'}><Star size={14} aria-hidden="true" fill="currentColor" /><b>{rating.toFixed(1)}</b><span>({count})</span></span>;
}

ProductImage.propTypes = { src: PropTypes.string, alt: PropTypes.string.isRequired, sizes: PropTypes.string, eager: PropTypes.bool, className: PropTypes.string };
Breadcrumbs.propTypes = { items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired, to: PropTypes.string })).isRequired };
PageTitle.propTypes = { title: PropTypes.string.isRequired, subtitle: PropTypes.string };
EmptyState.propTypes = { title: PropTypes.string.isRequired, text: PropTypes.string.isRequired, to: PropTypes.string, action: PropTypes.string };
Price.propTypes = { price: PropTypes.number.isRequired, original: PropTypes.number };
Rating.propTypes = { rating: PropTypes.number.isRequired, count: PropTypes.number.isRequired };
