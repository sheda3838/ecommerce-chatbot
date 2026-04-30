import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FloatingCart = ({ onClick }) => {
  const { totalItems } = useCart();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <motion.button 
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-24 right-6 z-50 bg-white/80 backdrop-blur-lg border border-white p-4 rounded-full shadow-2xl hover:bg-white transition-colors cursor-pointer"
    >
      <div className="relative">
        <ShoppingCart size={24} className="text-gray-900 drop-shadow-sm" />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border border-white shadow-sm"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
};

export default FloatingCart;
