import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 font-medium">Looks like you haven't added anything yet. Start exploring our collection!</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
          >
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
            <p className="text-gray-500 font-medium">You have {cart.length} items in your cart</p>
          </div>
          <Link to="/shop" className="text-blue-600 font-bold flex items-center gap-2 hover:text-blue-800 transition-colors">
            <ArrowLeft size={18} /> Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex gap-6 items-center hover:shadow-md transition-shadow">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">No Image</div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-gray-900 text-lg truncate">{item.name}</h3>
                  <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-50 text-gray-500 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                  <p className="text-xl font-black text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-green-600 font-bold uppercase tracking-widest text-xs">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-black text-blue-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl flex items-center justify-center gap-3"
              >
                Checkout <ArrowRight size={18} />
              </Link>
              
              <p className="text-[10px] text-gray-400 text-center mt-6 uppercase tracking-widest font-bold">
                Secured Checkout • 30 Day Returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
