import React, { useState, useEffect } from 'react';
import { Eye, X, Loader2, Package } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/orders'); 
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const viewOrder = async (order) => {
    setSelectedOrder(order);
    setDetailsLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${order.id}`);
      const data = await res.json();
      setOrderDetails(data);
    } catch (err) {
      console.error(err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders(); // refresh table
        if (selectedOrder && selectedOrder.id === id) {
          setSelectedOrder({...selectedOrder, status}); // update modal visual status
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Orders</h1>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-900" size={32} /></div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Order No.</th>
                <th className="px-6 py-4">Customer Email</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{order.order_number || order.id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{order.customer_email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-black text-gray-900">${(order.total_amount).toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 rounded-lg py-2 px-3 focus:ring-2 focus:ring-gray-900 focus:outline-none cursor-pointer shadow-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => viewOrder(order)} className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors inline-flex items-center gap-2 text-sm font-bold shadow-sm border border-transparent hover:border-gray-200">
                      <Eye size={16} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative z-10 p-8 no-scrollbar">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Order #{selectedOrder.order_number || selectedOrder.id}</h2>
                <p className="text-sm font-medium text-gray-500 mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>

            {detailsLoading ? (
              <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-900" size={32} /></div>
            ) : (
              <div className="space-y-8">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Customer Details</p>
                    <p className="font-bold text-gray-900">{selectedOrder.customer_name}</p>
                    <p className="text-gray-600 text-sm font-medium mt-1">{selectedOrder.customer_email}</p>
                    <p className="text-gray-600 text-sm font-medium">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</p>
                    <p className="text-gray-600 text-sm font-medium whitespace-pre-line">{selectedOrder.customer_address}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="col-span-1 md:col-span-2 mt-2 pt-4 border-t border-gray-200">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Order Notes</p>
                      <p className="text-gray-600 text-sm italic">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-4">Order Items</h3>
                  <div className="border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-100">
                    {orderDetails?.items?.map((item, idx) => {
                      const itemPrice = item.product_price || item.price || 0;
                      return (
                        <div key={idx} className="p-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-1 shrink-0 overflow-hidden">
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.product_name} className="w-full h-full object-contain mix-blend-multiply" />
                              ) : <Package size={20} className="text-gray-400" />}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 text-sm">{item.product_name || item.name || `Product #${item.product_id}`}</p>
                              <p className="text-xs font-bold text-gray-500 mt-1">Qty: {item.quantity} × ${itemPrice.toFixed(2)}</p>
                            </div>
                          </div>
                          <p className="font-black text-gray-900">${(itemPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <div className="text-right bg-gray-50 py-4 px-6 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Final Total</p>
                    <p className="text-3xl font-black text-gray-900">${(selectedOrder.total_amount).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
