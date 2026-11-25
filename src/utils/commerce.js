import { productById } from '../data/catalog';

export const CART_KEY = 'aether_cart';
export const FREE_DELIVERY_MINIMUM = 10000;
export const COUPONS = { JOY10: 0.1 };

export const paymentMethods = [
  { id: 'Cash on Delivery', available: true, description: 'Pay on delivery in live checkout. This demo collects no payment.' },
  { id: 'bKash / Nagad', available: false, description: 'Mobile payment is unavailable in demo checkout.' },
  { id: 'Card', label: 'Visa / Mastercard', available: false, description: 'Card payment is unavailable in demo checkout.' },
];

export function deliveryOptions(city) {
  const dhaka = city?.trim().toLowerCase() === 'dhaka';
  return [
    { id: 'standard', label: 'Standard delivery', estimate: dhaka ? '1–2 business days' : '2–3 business days', fee: 120 },
    ...(dhaka ? [{ id: 'express', label: 'Dhaka express', estimate: 'Within 24 hours', fee: 200 }] : []),
  ];
}

export function totalsFor(items, coupon, delivery = deliveryOptions()[0]) {
  const subtotal = items.reduce((sum, { product, quantity }) => sum + product.price * quantity, 0);
  const discount = Math.round(subtotal * (Object.hasOwn(COUPONS, coupon) ? COUPONS[coupon] : 0));
  const shipping = !subtotal || (delivery.id === 'standard' && subtotal > FREE_DELIVERY_MINIMUM) ? 0 : delivery.fee;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}

export const lineId = (productId, variantId) => productId + ':' + variantId;

export function normalizeCart(saved) {
  const lines = new Map();
  for (const entry of saved) {
    const productId = entry?.product?.id;
    const product = Object.hasOwn(productById, productId) ? productById[productId] : null;
    const quantity = Number(entry?.quantity);
    if (!product || !Number.isSafeInteger(quantity) || quantity < 1) continue;
    const variant = product.variants.find(({ id }) => id === entry.variantId) ?? product.variants[0];
    const id = lineId(product.id, variant.id);
    const previous = lines.get(id);
    lines.set(id, { id, product, variantId: variant.id, quantity: quantity + (previous?.quantity ?? 0) });
  }
  return [...lines.values()];
}

export function lineStock({ product, variantId }) {
  return productById[product.id]?.variants.find(({ id }) => id === variantId)?.stock ?? 0;
}

export function stockProblem(items) {
  return items.find((line) => line.quantity > lineStock(line));
}

export function normalizePhone(value = '') {
  return value.trim().replace(/[\s()-]/g, '').replace(/^(?:\+88|0088|88)(?=01)/, '');
}

export function validPhone(value) {
  return /^01[3-9]\d{8}$/.test(normalizePhone(value));
}

export function validateAddress(address) {
  if ((address.recipientName ?? '').trim().length < 2) return 'Enter the recipient’s full name.';
  if (!validPhone(address.phone)) return 'Enter a valid Bangladesh mobile number, such as 01711234567.';
  if ((address.city ?? '').trim().length < 2) return 'Enter your city or district.';
  if ((address.area ?? '').trim().length < 2) return 'Enter your area or upazila.';
  if ((address.address ?? '').trim().length < 8) return 'Enter a complete street address with house or building details.';
  return '';
}

export function accountDestination(value, fallback = '/profile') {
  if (!value?.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  return [...value].some((character) => character.charCodeAt(0) < 32) ? fallback : value;
}
