import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FavoritesContext } from './storeContexts';
import { productById } from '../data/catalog';
import { readList } from '../utils/storage';

const WISHLIST = 'joymart_wishlist';
const COMPARE = 'joymart_compare';
const RECENT = 'joymart_recent_views';
const RECENT_LIMIT = 4;

function savedProducts(key) {
  return [...new Set(readList(key).filter((id) => Object.hasOwn(productById, id)))];
}

export function FavoritesProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => savedProducts(WISHLIST));
  const [compare, setCompare] = useState(() => savedProducts(COMPARE).slice(0, 4));
  const [recent, setRecent] = useState(() => savedProducts(RECENT).slice(0, RECENT_LIMIT));

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST, JSON.stringify(wishlist));
      localStorage.setItem(COMPARE, JSON.stringify(compare));
      localStorage.setItem(RECENT, JSON.stringify(recent));
    } catch {
      // Saved products remain available during the current visit.
    }
  }, [wishlist, compare, recent]);

  function toggleWishlist(id) {
    setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function toggleCompare(id) {
    setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  const recordView = useCallback((id) => {
    setRecent((current) => current[0] === id ? current : [id, ...current.filter((item) => item !== id)].slice(0, RECENT_LIMIT));
  }, []);

  return <FavoritesContext.Provider value={{ wishlist, compare, recent, toggleWishlist, toggleCompare, recordView, clearRecent: () => setRecent([]) }}>{children}</FavoritesContext.Provider>;
}

FavoritesProvider.propTypes = { children: PropTypes.node.isRequired };
