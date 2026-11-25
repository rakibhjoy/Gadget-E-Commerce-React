import { categories, products } from './products';

export { categories };

export const collectionIds = {
  bestseller: ['headphones-studio-anc', 'phone-zenith-1', 'laptop-air-craft', 'watch-titanium-ultra'],
  new: ['phone-minimal-lite', 'earbuds-sonic-pods', 'watch-slim-curve', 'acc-mech-keyboard'],
};

const details = {
  'phone-zenith-1': ['Joy', { Display: '6.7″ OLED', Refresh: '120 Hz', Camera: '48 MP' }, [['titanium', 'Natural titanium', 6], ['black', 'Black titanium', 4]]],
  'phone-minimal-lite': ['Joy', { Display: '6.3″ AMOLED', Refresh: '120 Hz', Camera: '50 MP' }],
  'phone-fold-ultra': ['Apex', { Display: '7.8″ foldable AMOLED', Water: 'IPX8' }, [['standard', 'Standard', 2]]],
  'laptop-air-craft': ['MacBlade', { Display: '14.2″ Liquid Retina XDR', Memory: '32 GB' }, [['silver', 'Silver', 5], ['gray', 'Space gray', 3]]],
  'laptop-studio-16': ['Carbon', { Display: '16″ 4K OLED', Memory: '64 GB', Storage: '2 TB SSD' }],
  'headphones-studio-anc': ['Joy', { Style: 'Over-ear', 'Noise cancellation': 'Active', Playback: '50 hours' }, [['standard', 'Standard', 8]]],
  'earbuds-sonic-pods': ['Pulse', { Style: 'Earbuds', 'Noise cancellation': 'Active', Playback: '32 hours' }],
  'speaker-studio-boom': ['VibeStone', { Style: 'Portable speaker', Playback: '24 hours', Water: 'IP67' }],
  'watch-titanium-ultra': ['Joy', { Display: 'Sapphire crystal', Case: '49 mm titanium', Battery: '72 hours' }],
  'watch-slim-curve': ['Vogue', { Display: '1.43″ AMOLED', Water: '5 ATM', Band: '22 mm' }],
  'gaming-controller-pro': ['Apex', { Type: 'Controller', Connection: 'Wireless' }],
  'gaming-headset-rgb': ['Quantum', { Type: 'Headset', Connection: 'Wireless / wired' }],
  'acc-gan-charger': ['Joy', { Type: 'Charger', Power: '100 W', Connection: 'USB-C / USB-A' }],
  'acc-mech-keyboard': ['Slate', { Type: 'Keyboard', Layout: '75%', Connection: 'Wireless / wired' }],
  'acc-mag-stand': ['Gravity', { Type: 'Stand', Mount: 'Magnetic' }],
  'acc-cable-braided': ['UltraWeave', { Type: 'Cable', Power: '240 W', Connection: 'USB-C' }, [['standard', 'Standard', 0]]],
};

export const catalog = products.map((product) => {
  const [brand, attributes, options = [['standard', 'Standard', 8]]] = details[product.id];
  return {
    ...product,
    brand,
    attributes,
    variants: options.map(([id, label, stock]) => ({ id, label, stock })),
    images: [{ src: product.image, label: 'Product photo' }],
  };
});
export const productById = Object.fromEntries(catalog.map((product) => [product.id, product]));
export const stockOf = (product) => product.variants.reduce((sum, variant) => sum + variant.stock, 0);
export const discountOf = (product) => Math.max(0, Math.round((1 - product.price / (product.originalPrice || product.price)) * 100));

export const categoryPath = (category) => '/products?' + new URLSearchParams({ category });
export const searchPath = (search) => '/products?' + new URLSearchParams({ search });
export const productPath = (id) => '/products/' + id;

export function matchesQuery(product, query) {
  const haystack = [product.name, product.brand, product.category, product.description, ...product.specs, ...Object.values(product.attributes)].join(' ').toLowerCase();
  return query.toLowerCase().trim().split(/\s+/).every((word) => haystack.includes(word));
}

export function sizedImage(source, width) {
  if (!source.startsWith('https://images.unsplash.com/')) return source;
  const url = new URL(source);
  url.searchParams.set('w', width);
  url.searchParams.set('q', '78');
  return url.toString();
}
