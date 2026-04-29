import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Hero from './components/Hero'
import FloatingCart from './components/FloatingCart'
import ProductList from './components/ProductList'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import AdminModal from './components/AdminModal'
import { CartProvider } from './context/CartContext'
import ChatWidget from './components/ChatWidget'

import AdminLayout from './components/AdminLayout'
import AdminDashboard from './components/AdminDashboard'
import AdminProducts from './components/AdminProducts'
import AdminOrders from './components/AdminOrders'
import AdminChats from './components/AdminChats'
import Shop from './components/Shop'
import ProductDetail from './components/ProductDetail'
import CartPage from './components/CartPage'

const Storefront = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  return (
    <div className="font-sans antialiased bg-white">
      <Hero onAdminTrigger={() => setIsAdminModalOpen(true)} />
      <AdminModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </CartProvider>
  )
}

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPath && (
        <>
          <FloatingCart onClick={() => setIsCartOpen(true)} />
          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <ChatWidget />
        </>
      )}
      
      <Routes>
        {/* Public Storefront */}
        <Route path="/" element={<Storefront />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:id" element={<OrderConfirmation />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="chats" element={<AdminChats />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
