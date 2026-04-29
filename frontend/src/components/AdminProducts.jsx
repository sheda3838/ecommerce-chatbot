import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';

const initialForm = {
  name: '', description: '', price: '', category: '', color: '', style: '', image_url: '', stock_quantity: ''
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Derive unique categories and styles from existing products for autocomplete
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const uniqueStyles = [...new Set(products.map(p => p.style).filter(Boolean))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData(initialForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setFormData(product);
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await fetch(`http://localhost:3000/api/products/${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Frontend Validation
    const priceVal = parseFloat(formData.price);
    const stockVal = parseInt(formData.stock_quantity, 10);
    
    if (!formData.name.trim()) {
      return alert("Name is required");
    }
    if (!formData.category.trim()) {
      return alert("Category is required for the AI to locate this product");
    }
    if (isNaN(priceVal) || priceVal <= 0) {
      return alert("Price must be a valid number greater than 0");
    }
    if (isNaN(stockVal) || stockVal < 0) {
      return alert("Stock quantity must be a valid number (0 or greater)");
    }

    setProcessing(true);

    const payload = { ...formData, price: priceVal, stock_quantity: stockVal };

    try {
      const url = editingId ? `http://localhost:3000/api/products/${editingId}` : 'http://localhost:3000/api/products';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save');
      
      await fetchProducts();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving product.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
        <button 
          onClick={openAddModal}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors flex items-center gap-2 shadow-md"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-900" size={32} /></div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center p-1 overflow-hidden shrink-0 border border-gray-200">
                      {product.image_url ? (
                        <img src={product.image_url} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      ) : <ImageIcon size={20} className="text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{product.color} | {product.style}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-gray-900">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4 font-bold text-sm">
                    {product.stock_quantity > 0 ? (
                      <span className="text-green-600">{product.stock_quantity} in stock</span>
                    ) : (
                      <span className="text-red-500">Out of stock</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 p-8 no-scrollbar">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-black text-gray-900">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price ($) *</label>
                  <input required type="number" min="0.01" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity *</label>
                  <input required type="number" min="0" value={formData.stock_quantity} onChange={e => setFormData({...formData, stock_quantity: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <input list="category-options" type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                  <datalist id="category-options">
                    {uniqueCategories.map(cat => <option key={cat} value={cat} />)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Color</label>
                  <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Style</label>
                  <input list="style-options" type="text" value={formData.style} onChange={e => setFormData({...formData, style: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                  <datalist id="style-options">
                    {uniqueStyles.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Image URL</label>
                  <input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-gray-900 focus:outline-none" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors">Cancel</button>
                <button type="submit" disabled={processing} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-md disabled:opacity-70">
                  {processing && <Loader2 size={16} className="animate-spin" />} Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
