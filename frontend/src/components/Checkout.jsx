import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  
  const [validatedItems, setValidatedItems] = useState([]);
  const [totals, setTotals] = useState({ subtotal: 0, shipping: 0, total: 0 });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_address: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    // Empty cart protection
    if (cart.length === 0 && !isProcessing) {
      navigate('/');
      return;
    }

    const validateCart = async () => {
      try {
        const payload = {
          items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
        };

        const res = await fetch('http://localhost:3000/api/cart/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to validate cart prices.');

        const data = await res.json();
        
        if (data.items) {
          // Merge local image with validated data since validate endpoint might not return images
          const mergedItems = data.items.map(valItem => {
            const localItem = cart.find(c => c.product_id === valItem.product_id);
            return { ...valItem, image_url: localItem?.image_url };
          });

          setValidatedItems(mergedItems);
          const validatedTotal = data.totalCartAmount || data.items.reduce((sum, item) => sum + (item.total || item.price * item.quantity), 0);
          setTotals({
            subtotal: validatedTotal,
            shipping: 0,
            total: validatedTotal
          });
        }
      } catch (err) {
        console.error("Validation error:", err);
        setError('Failed to validate cart. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    validateCart();
  }, [cart, navigate, isProcessing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError('');

    try {
      const payload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_address: formData.customer_address,
        phone: formData.phone,
        notes: formData.notes,
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
      };

      const res = await fetch('http://localhost:3000/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Checkout failed');
      }

      const data = await res.json();
      
      // Post-success actions
      clearCart();
      localStorage.removeItem('cart');
      
      navigate(`/order/${data.order_id || data.orderNumber || data.id || 'success'}`, { state: data });
    } catch (err) {
      setError(err.message);
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-gray-900" />
          <p className="font-bold text-gray-600">Validating Cart Pricing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 font-bold transition-colors">
          <ArrowLeft size={20} />
          Back to Store
        </Link>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Form Section */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Checkout Details</h2>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    required 
                    type="text" 
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                  <input 
                    required 
                    type="email" 
                    name="customer_email"
                    value={formData.customer_email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all" 
                  placeholder="+1 (555) 000-0000" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Shipping Address *</label>
                <textarea 
                  required 
                  rows="3"
                  name="customer_address"
                  value={formData.customer_address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all resize-none" 
                  placeholder="123 Main St, City, Country" 
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Order Notes (Optional)</label>
                <textarea 
                  rows="2"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all resize-none" 
                  placeholder="Special instructions for delivery..." 
                ></textarea>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                  <ShieldCheck size={20} />
                  <span>Secure 256-bit SSL checkout</span>
                </div>
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full sm:w-auto bg-gray-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing...
                    </>
                  ) : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <ShoppingBag size={24} className="text-gray-900" />
                <h2 className="text-2xl font-black text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                {validatedItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100">
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.product_name || item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.product_name || item.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">Qty: <span className="font-bold text-gray-900">{item.quantity}</span></p>
                    </div>
                    <div className="flex flex-col justify-center items-end">
                      <p className="font-black text-gray-900">${item.total_price || (item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-[10px] text-gray-500">${item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-gray-900">${totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold uppercase text-green-500 tracking-wider">Free</span>
                </div>
                <div className="h-px bg-gray-200 w-full my-2"></div>
                <div className="flex justify-between text-gray-900 items-end">
                  <span className="font-black text-xl">Total</span>
                  <span className="font-black text-3xl">${totals.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
