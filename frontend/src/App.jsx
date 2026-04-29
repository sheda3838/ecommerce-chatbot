import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Hero from './components/Hero'
import FloatingCart from './components/FloatingCart'
import ProductList from './components/ProductList'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import AdminModal from './components/AdminModal'
import { CartProvider } from './context/CartContext'

import AdminLayout from './components/AdminLayout'
import AdminDashboard from './components/AdminDashboard'
import AdminProducts from './components/AdminProducts'
import AdminOrders from './components/AdminOrders'

const Storefront = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <div className="font-sans antialiased bg-white">
      <FloatingCart onClick={() => setIsCartOpen(true)} />
      <Hero onAdminTrigger={() => setIsAdminModalOpen(true)} />
      <ProductList />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront */}
          <Route path="/" element={<Storefront />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
