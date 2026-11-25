import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { useCart } from './context/storeContexts';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { EmptyState } from './components/StoreUI';
import Home from './pages/Home';

const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Saved = lazy(() => import('./pages/Saved'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Account = lazy(() => import('./pages/Account'));
const Profile = lazy(() => import('./pages/Profile'));
const Orders = lazy(() => import('./pages/OrderTrack'));
const Support = lazy(() => import('./pages/Support'));

function Storefront() {
  const { pathname } = useLocation();
  const { notification } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <div className="storefront">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<p className="container page muted" role="status">Loading page…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/wishlist" element={<Saved mode="wishlist" />} />
            <Route path="/compare" element={<Saved mode="compare" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<Account key="reset" mode="reset" />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders/:orderId" element={<Orders mode="detail" />} />
            <Route path="/orders/:orderId/confirmation" element={<Orders mode="confirmation" />} />
            <Route path="/track" element={<Orders mode="track" />} />
            <Route path="/track-order" element={<Orders mode="track" />} />
            <Route path="/support/:section" element={<Support />} />
            <Route path="*" element={<EmptyState title="Page not found" text="Check the address or continue to the shop." />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <div className={notification ? 'toast is-visible' : 'toast'} role="status">{notification}</div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <FavoritesProvider><Storefront /></FavoritesProvider>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
