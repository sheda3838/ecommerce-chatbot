import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, setQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const handleCheckoutClick = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-gray-900 p-2 rounded-xl">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Cart</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 max-w-[250px]">Looks like you haven't added anything to your cart yet.</p>
                  <button 
                    onClick={onClose}
                    className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex gap-4">
                      {/* Image */}
                      <div className="w-24 h-24 bg-white rounded-2xl p-2 shrink-0 border border-gray-100 relative group overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform"
                        />
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900 text-sm leading-tight pr-4">{item.name}</h4>
                            <button 
                              onClick={() => removeFromCart(item.product_id)}
                              className="text-gray-400 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 capitalize mt-1">{item.color} | {item.style}</p>
                          <p className="font-black text-gray-900 mt-2">${item.price}</p>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item.product_id, -1)}
                              className="w-7 h-7 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 text-gray-900 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <input 
                              type="number"
                              min="1"
                              max={item.stock_quantity}
                              value={item.quantity}
                              onChange={(e) => setQuantity(item.product_id, e.target.value)}
                              onBlur={(e) => {
                                if (e.target.value === '' || Number(e.target.value) < 1) {
                                  setQuantity(item.product_id, 1);
                                }
                              }}
                              className="font-bold text-sm w-8 text-center bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button 
                              onClick={() => updateQuantity(item.product_id, 1)}
                              className="w-7 h-7 flex items-center justify-center bg-gray-900 rounded shadow-sm hover:bg-black text-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 bg-gray-50 border-t border-gray-100 shrink-0">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-bold uppercase text-green-500 tracking-wider">Free</span>
                  </div>
                  <div className="h-px bg-gray-200 w-full my-4"></div>
                  <div className="flex justify-between text-gray-900 items-end">
                    <span className="font-black text-xl">Total</span>
                    <span className="font-black text-3xl">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleCheckoutClick}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:scale-[1.02] transition-all shadow-xl group"
                  >
                    Checkout Now
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={clearCart}
                    className="w-full py-3 text-sm font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Clear Cart
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
