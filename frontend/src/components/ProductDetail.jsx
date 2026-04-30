import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Loading Product...</div>;
  if (!product || product.error) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500">Product not found.</div>;

  const handleAdd = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full max-h-[90vh] flex flex-col">
        <Link to="/shop" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold mb-4 transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Store
        </Link>
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row flex-1">
          <div className="w-full md:w-1/2 bg-gray-100 h-64 md:h-auto overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">No Image</div>
            )}
          </div>
          
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
            <div className="uppercase tracking-widest text-xs font-bold text-gray-400 mb-2">{product.category}</div>
            <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4">{product.name}</h1>
            <p className="text-3xl font-bold text-blue-600 mb-6">${product.price.toFixed(2)}</p>
            
            <p className="text-gray-600 leading-relaxed mb-8 text-lg">{product.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Color</p>
                <p className="font-semibold text-gray-900 capitalize">{product.color || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Style</p>
                <p className="font-semibold text-gray-900 capitalize">{product.style || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stock</p>
                <p className="font-semibold text-gray-900">
                  {product.stock_quantity > 0 ? (
                    <span className="text-green-600">{product.stock_quantity} in stock</span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleAdd}
              disabled={product.stock_quantity === 0}
              className={`w-full py-4 rounded-xl font-bold tracking-wider uppercase text-sm flex items-center justify-center gap-3 transition-all ${
                added 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' 
                  : product.stock_quantity === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/30'
              }`}
            >
              {added ? (
                <><Check size={20} /> Added to Cart</>
              ) : (
                <><ShoppingBag size={20} /> Add to Cart</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
