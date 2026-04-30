import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ShoppingBag, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SUGGESTIONS = [
  "Black hats under 40",
  "Trendy trousers",
  "Gift for mom",
  "Summer dresses",
  "Where is my order?",
  "I want to cancel an order"
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chat_messages");
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { cart, addToCart, updateQuantity, setQuantity } = useCart();
  const { user } = useAuth();
  const [sessionToken, setSessionToken] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("chat_session_token");
    if (!token) {
      token = "sess_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("chat_session_token", token);
    }
    setSessionToken(token);
    
    // Initial greeting if empty
    if (messages.length === 0) {
      const initialMessage = [{ role: "assistant", content: "Hi! I'm Mia, your shopping assistant. How can I help you today?" }];
      setMessages(initialMessage);
      localStorage.setItem("chat_messages", JSON.stringify(initialMessage));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (text = inputValue) => {
    if (!text.trim()) return;
    
    const newMsg = { role: "user", content: text };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, sessionToken, userId: user?.id })
      });
      
      const data = await res.json();
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        products: data.products,
        orders: data.orders,
        hasMoreOrders: data.hasMoreOrders,
        suggestions: data.suggestions
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsTyping(false);
      // Auto-focus input after AI responds
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleCancelOrder = async (orderId, orderNumber) => {
    if (!window.confirm(`Are you sure you want to cancel order #${orderNumber}?`)) return;
    
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: `Order #${orderNumber} has been successfully cancelled.` }]);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to cancel order");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling order");
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-6 w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="font-bold text-sm">M</span>
                </div>
                <span className="font-semibold">Mia - Shopping Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content.replace(/\[(?:SEARCH|ORDER_LOOKUP|CANCEL_ORDER|STOCK_CHECK):.*?\]/g, '')}</p>
                  </div>
                  
                  {/* Orders Rendering */}
                  {msg.orders && msg.orders.length > 0 && (
                    <div className="mt-2 w-[90%] space-y-2">
                      {msg.orders.map(order => (
                        <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-sm text-gray-900">Order #{order.order_number}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>{order.status}</span>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <div className="text-xs text-gray-500">
                              <p>Total: <span className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</span></p>
                              <p>{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            {order.status === 'pending' && (
                              <button 
                                onClick={() => handleCancelOrder(order.id, order.order_number)}
                                className="text-[10px] bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded font-bold transition-colors border border-red-100"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      {msg.hasMoreOrders && (
                        <Link 
                          to="/shop" 
                          onClick={() => setIsOpen(false)}
                          className="block text-center text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest mt-2"
                        >
                          View My Orders
                        </Link>
                      )}
                    </div>
                  )}                  
                  {/* Product Cards Rendering */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2 w-[90%] space-y-2">
                      {msg.products.map(product => {
                        const cartItem = cart.find(item => item.product_id === product.id);
                        return (
                        <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-3 flex gap-3 shadow-sm hover:shadow-md transition-shadow">
                          <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-gray-100" />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <p className="font-semibold text-sm text-gray-900 truncate">{product.name}</p>
                              <p className="text-blue-600 font-bold text-sm">${product.price.toFixed(2)}</p>
                            </div>
                            <div className="flex gap-2 mt-1 items-center">
                              <Link 
                                to={`/product/${product.id}`}
                                onClick={() => setIsOpen(false)}
                                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1.5 rounded font-medium flex-1 text-center transition-colors h-full flex items-center justify-center"
                              >
                                View
                              </Link>
                              
                              {cartItem ? (
                                <div className="flex items-center gap-1 bg-gray-100 rounded p-0.5 border border-gray-200 flex-1 justify-center h-full">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, -1) }}
                                    className="w-5 h-5 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 text-gray-900 transition-colors"
                                  >
                                    <Minus size={10} />
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
                                    className="font-bold w-6 text-center text-xs bg-transparent outline-none appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0"
                                  />
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, 1) }}
                                    className="w-5 h-5 flex items-center justify-center bg-blue-600 rounded shadow-sm hover:bg-blue-700 text-white transition-colors"
                                  >
                                    <Plus size={10} />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleAddToCart(product) }}
                                  className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded font-medium flex-1 transition-colors flex items-center justify-center gap-1 h-full"
                                >
                                  <ShoppingCart size={12} /> Add
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )})}
                    </div>
                  )}

                  {/* Dynamic Suggestions Rendering */}
                  {idx === messages.length - 1 && msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && !isTyping && (
                    <div className="mt-3 flex flex-wrap gap-2 w-full">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSend(sug)}
                          className="text-[10px] bg-white text-blue-600 border border-blue-200 hover:border-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full font-bold transition-all uppercase tracking-wider shadow-sm active:scale-95"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1 items-center">
                    <span className="text-xs text-gray-500 font-medium mr-1">Mia is typing</span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-200 shrink-0">
              <div className="flex items-center gap-2">
                <input 
                  ref={inputRef}
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Mia anything..."
                  disabled={isTyping}
                  className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-600 focus:ring-0 text-sm rounded-full px-4 py-2.5 transition-all disabled:opacity-50"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2.5 rounded-full transition-colors flex shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-xl flex items-center justify-center z-40 hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </>
  );
}
