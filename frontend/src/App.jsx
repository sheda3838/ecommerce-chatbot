import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Hero from './components/Hero'
import FloatingCart from './components/FloatingCart'
import ProductList from './components/ProductList'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'
import OrderConfirmation from './components/OrderConfirmation'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ChatWidget from './components/ChatWidget'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'

import AdminLayout from './components/AdminLayout'
import AdminDashboard from './components/AdminDashboard'
import AdminProducts from './components/AdminProducts'
import AdminOrders from './components/AdminOrders'
import AdminChats from './components/AdminChats'
import Shop from './components/Shop'
import ProductDetail from './components/ProductDetail'

const Storefront = () => {
  return (
    <div className="font-sans antialiased bg-white">
      <Hero />
    </div>
  );
};

// Simple Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
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
          <Navbar />
          <div className="pt-16"> {/* Spacer for fixed navbar */}
            <FloatingCart onClick={() => setIsCartOpen(true)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <ChatWidget />
          </div>
        </>
      )}
      
      <Routes>
        {/* Public Storefront */}
        <Route path="/" element={<Storefront />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        
        {/* Protected Routes */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/order/:id" element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        } />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
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
