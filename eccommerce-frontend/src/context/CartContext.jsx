import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Determine if user is customer to fetch cart
    if (token && user?.role !== 'ADMIN') {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [token, user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart');
      const raw = response.data;
      // Normalize: backend may use items, cartItems, lineItems, products, etc.
      const normalized = {
        ...raw,
        items: raw.items ?? raw.cartItems ?? raw.lineItems ?? raw.products ?? [],
      };
      setCart(normalized);
    } catch (error) {
      console.error('Failed to fetch cart', error);
      if (error.response?.status === 404 || error.response?.status === 500) {
        setCart({ items: [] });
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      await fetchCart();
    } catch (error) {
      console.error('Failed to add to cart', error.response || error);
      // Rethrow so the calling component can display the error to the user
      throw error;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      await api.put(`/cart/item/${itemId}?quantity=${quantity}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update cart', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove from cart', error);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      await fetchCart();
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  };

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice = cart?.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;

  return (
    <CartContext.Provider value={{
      cart, loading, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
