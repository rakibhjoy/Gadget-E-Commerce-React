import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { CartContext } from './storeContexts';
import { CART_KEY, COUPONS, lineId, lineStock, normalizeCart, totalsFor } from '../utils/commerce';
import { readList, readStorage } from '../utils/storage';

const COUPON_KEY = 'joymart_coupon';

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => normalizeCart(readList(CART_KEY)));
  const [coupon, setCoupon] = useState(() => {
    const saved = readStorage(COUPON_KEY, '');
    return Object.hasOwn(COUPONS, saved) ? saved : '';
  });
  const [notification, setNotification] = useState('');
  const activeCart = useRef(cart);
  const timeout = useRef(null);

  useEffect(() => () => window.clearTimeout(timeout.current), []);

  function showToast(message) {
    setNotification(message);
    window.clearTimeout(timeout.current);
    timeout.current = window.setTimeout(() => setNotification(''), 3000);
  }

  function saveCart(next) {
    try {
      const stored = next.map(({ product, ...line }) => ({ ...line, product: { id: product.id } }));
      localStorage.setItem(CART_KEY, JSON.stringify(stored));
      if (!next.length) setCoupon('');
    } catch {
      showToast('Browser storage is unavailable. Cart changes may be lost on refresh.');
      if (!next.length) setCoupon('');
    }
    activeCart.current = next;
    setCart(next);
  }

  useEffect(() => {
    try {
      localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    } catch {
      // The cart stays usable in memory when storage is blocked.
    }
  }, [coupon]);

  function addToCart(product, quantity = 1, variantId = product.variants[0].id) {
    const id = lineId(product.id, variantId);
    const current = activeCart.current;
    const existing = current.find((item) => item.id === id);
    const next = { id, product, variantId, quantity: (existing?.quantity ?? 0) + quantity };
    if (next.quantity > lineStock(next)) {
      showToast('The available stock is already in your cart.');
      return false;
    }
    showToast('Added to cart');
    saveCart(existing ? current.map((item) => item.id === id ? next : item) : [...current, next]);
    return true;
  }

  function updateQuantity(id, quantity) {
    const current = activeCart.current;
    const line = current.find((item) => item.id === id);
    if (!line || !Number.isSafeInteger(quantity) || quantity < 1 || (quantity > line.quantity && quantity > lineStock(line))) return;
    saveCart(current.map((item) => item.id === id ? { ...item, quantity } : item));
  }

  function removeFromCart(id) {
    showToast('Item removed from cart');
    saveCart(activeCart.current.filter((item) => item.id !== id));
  }

  function applyCoupon(input) {
    const code = input.trim().toUpperCase();
    if (!Object.hasOwn(COUPONS, code)) return 'Enter a valid demo coupon code.';
    setCoupon(code);
    return '';
  }

  return (
    <CartContext.Provider value={{
      cart, addToCart, updateQuantity, removeFromCart, clearCart: () => saveCart([]),
      totalItems: cart.reduce((sum, item) => sum + item.quantity, 0),
      totals: totalsFor(cart, coupon), coupon, applyCoupon, removeCoupon: () => setCoupon(''), notification,
    }}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = { children: PropTypes.node.isRequired };
