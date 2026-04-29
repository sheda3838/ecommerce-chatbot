import React from 'react';
import ProductList from './ProductList';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Shop = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-bold mb-8 transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
        <ProductList />
      </div>
    </div>
  );
};

export default Shop;
