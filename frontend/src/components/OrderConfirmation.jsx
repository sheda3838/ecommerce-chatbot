import React from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const orderData = location.state;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden relative">
        
        {/* Top Green Bar */}
        <div className="bg-green-500 h-3 w-full absolute top-0 left-0"></div>

        <div className="p-8 sm:p-12 md:p-16 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 size={48} className="text-green-500" />
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 tracking-tight">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed mb-10 font-medium">
            Thank you for your purchase. We've received your order and our team is already getting it ready for shipment.
          </p>

          <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 w-full max-w-lg mb-10">
            <div className="flex items-center gap-4 mb-6 text-left">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <Package size={24} className="text-gray-900" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Order Number</p>
                <p className="text-2xl font-black text-gray-900">{orderData?.order_id || orderData?.orderNumber || id || 'N/A'}</p>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full mb-6"></div>

            <div className="grid grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Pending
                </span>
              </div>
              {orderData?.totalAmount !== undefined || orderData?.total_amount !== undefined ? (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
                  <p className="font-black text-gray-900 text-xl">${(orderData?.totalAmount || orderData?.total_amount || 0).toFixed(2)}</p>
                </div>
              ) : null}
            </div>
          </div>

          <p className="text-sm font-medium text-gray-500">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
