import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, ShieldCheck, Truck, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductModal = ({ product, onClose }) => {
  const { cart, addToCart, updateQuantity, setQuantity, removeFromCart } = useCart();
  if (!product) return null;

  const cartItem = cart.find(item => item.product_id === product.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-white/40 backdrop-blur-md cursor-pointer"
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] h-full"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shadow-sm"
          >
            <X size={20} />
          </button>

          {/* Left: Image */}
          <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 h-1/3 md:h-full relative">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
            />
          </div>

          {/* Right: Details (No scrolling on main modal, flex layout) */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-2/3 md:h-full">
            <div className="overflow-y-auto pr-2 flex-1 no-scrollbar">
              <div className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-full mb-3">
                {product.category}
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-1 leading-tight">{product.name}</h2>
              <p className="text-2xl font-black text-gray-900 mb-4">${product.price}</p>
              
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                {product.description || "Premium quality product crafted with attention to detail. Designed for everyday comfort and timeless style."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6 border-y border-gray-100 py-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Color</p>
                  <p className="font-semibold text-sm text-gray-900 capitalize">{product.color}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Style</p>
                  <p className="font-semibold text-sm text-gray-900 capitalize">{product.style}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Stock</p>
                  <p className="font-semibold text-sm text-gray-900 capitalize">{product.stock_quantity > 0 ? `${product.stock_quantity} Available` : 'Out of Stock'}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                  <ShieldCheck size={16} className="text-gray-900" />
                  <span>1 Year Authentic Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                  <Truck size={16} className="text-gray-900" />
                  <span>Free Express Shipping over $100</span>
                </div>
              </div>
            </div>

            {/* Actions aligned at bottom */}
            <div className="mt-4 pt-4 border-t border-gray-100 shrink-0">
              {cartItem ? (
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 border border-gray-100">
                  <div className="px-4 text-xs font-bold text-gray-600 uppercase tracking-wider">In Cart</div>
                  <div className="flex flex-1 justify-end gap-2 items-center">
                    <div className="flex items-center gap-3 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
                      <button 
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-900 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <input 
                        type="number"
                        min="1"
                        max={product.stock_quantity}
                        value={cartItem.quantity}
                        onChange={(e) => setQuantity(product.id, e.target.value)}
                        onBlur={(e) => {
                          if (e.target.value === '' || Number(e.target.value) < 1) {
                            setQuantity(product.id, 1);
                          }
                        }}
                        className="font-black text-base w-8 text-center bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button 
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-900 rounded-lg hover:bg-black text-white transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(product.id)}
                      className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock_quantity === 0}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-wider text-sm"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              )}
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
