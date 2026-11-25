import { createContext, useContext } from 'react';

export const AuthContext = createContext();
export const CartContext = createContext();
export const OrderContext = createContext();
export const FavoritesContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const useCart = () => useContext(CartContext);
export const useOrders = () => useContext(OrderContext);
export const useFavorites = () => useContext(FavoritesContext);
