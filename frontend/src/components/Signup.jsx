import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      login(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#fafafa] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>

      <div className="max-w-2xl w-full space-y-6 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-black tracking-tighter text-blue-600 mb-1 italic">LUMIÈRE</h1>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p className="text-gray-500 mt-1 text-sm font-medium">Join the Lumière community today</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-xs font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 ml-1">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    autoFocus
                    className="w-full px-6 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 ml-1">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-6 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 ml-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full px-6 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 ml-1">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    className="w-full px-6 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1 ml-1">Shipping Address</label>
                <textarea
                  name="address"
                  required
                  rows="2"
                  className="w-full px-6 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-300 resize-none"
                  placeholder="123 Luxury St, Beverly Hills, CA"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold tracking-wide hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all disabled:opacity-50 active:scale-[0.98]"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
            
            <div className="text-center pt-2">
              <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors">
                Already have an account? <span className="text-blue-600">Sign in</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
