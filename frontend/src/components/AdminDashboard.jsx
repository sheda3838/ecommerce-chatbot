import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, DollarSign, Clock, Loader2, ArrowRight } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-black text-gray-900 mt-1">{value}</h3>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  if (loading || !stats) {
    return <div className="h-full flex items-center justify-center min-h-[50vh]"><Loader2 className="animate-spin text-gray-900" size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Revenue" value={`$${(stats.total_revenue || 0).toFixed(2)}`} icon={<DollarSign size={28} className="text-blue-600" />} color="bg-blue-50" />
        <StatCard title="Total Orders" value={stats.total_orders || 0} icon={<ShoppingCart size={28} className="text-green-600" />} color="bg-green-50" />
        <StatCard title="Total Products" value={stats.total_products || 0} icon={<Package size={28} className="text-purple-600" />} color="bg-purple-50" />
        <StatCard title="Pending Orders" value={stats.pending_orders || 0} icon={<Clock size={28} className="text-orange-600" />} color="bg-orange-50" />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-black text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <tr>
                <th className="px-8 py-4">Order No.</th>
                <th className="px-8 py-4">Customer Email</th>
                <th className="px-8 py-4">Date</th>
                <th className="px-8 py-4">Total</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(stats.recent_orders || []).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-900">{order.order_number || order.id}</td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-600">{order.customer_email}</td>
                  <td className="px-8 py-5 text-sm font-medium text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-8 py-5 font-black text-gray-900">${(order.total_amount).toFixed(2)}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : ''}
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                      ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
