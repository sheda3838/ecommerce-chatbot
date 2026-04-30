import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { cart, addToCart, updateQuantity, setQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const cartItem = cart.find(item => item.product_id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] p-4 shadow-sm border border-gray-100 hover:shadow-xl transition-all group flex flex-col"
    >
      {/* Image Area - Link to product detail page */}
      <Link 
        to={`/product/${product.id}`}
        className="w-full h-64 bg-gray-50 rounded-2xl overflow-hidden relative flex items-center justify-center p-4 block"
      >
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
          {product.category}
        </div>
      </Link>

      {/* Info Area */}
      <div className="mt-6 px-2">
        <h3 className="text-lg font-bold text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1 capitalize">{product.color} | {product.style}</p>
        
        <div className="flex items-center justify-between mt-6">
          <p className="text-xl font-bold text-gray-900">${product.price}</p>
          
          {cartItem ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1 border border-gray-200">
                <button 
                  onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1) }}
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-900 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <input 
                  type="number"
                  min="1"
                  max={product.stock_quantity}
                  value={cartItem.quantity}
                  onChange={(e) => { e.stopPropagation(); setQuantity(product.id, e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={(e) => {
                    if (e.target.value === '' || Number(e.target.value) < 1) {
                      setQuantity(product.id, 1);
                    }
                  }}
                  className="font-bold w-8 text-center text-sm bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 1) }}
                  className="w-7 h-7 flex items-center justify-center bg-gray-900 rounded-full shadow-sm hover:bg-black text-white transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full font-bold hover:bg-black hover:scale-105 transition-all shadow-md text-sm"
            >
              <ShoppingCart size={14} />
              Add
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
