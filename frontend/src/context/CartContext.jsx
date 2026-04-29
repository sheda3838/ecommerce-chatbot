import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id 
            ? { ...item, quantity: Math.min((Number(item.quantity) || 0) + 1, product.stock_quantity) } 
            : item
        );
      }
      return [...prev, { product_id: product.id, ...product, quantity: Math.min(1, product.stock_quantity) }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart((prev) => {
      const updated = prev.map(item => {
        if (item.product_id === productId) {
          let newQuantity = (Number(item.quantity) || 0) + amount;
          if (newQuantity > item.stock_quantity) newQuantity = item.stock_quantity;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated.filter(item => item.quantity > 0);
    });
  };

  const setQuantity = (productId, quantity) => {
    setCart((prev) => {
      const updated = prev.map(item => {
        if (item.product_id === productId) {
          let newQuantity = quantity === '' ? '' : parseInt(quantity, 10);
          if (newQuantity !== '' && isNaN(newQuantity)) newQuantity = 1;
          if (newQuantity !== '' && newQuantity > item.stock_quantity) newQuantity = item.stock_quantity;
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      // Allow '' temporarily so user can clear the input to type a new number
      return updated.filter(item => item.quantity === '' || item.quantity > 0);
    });
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (Number(item.quantity) || 0)), 0);
  const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, setQuantity, clearCart, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
