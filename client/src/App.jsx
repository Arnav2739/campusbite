// [Pushkar] App.jsx - Pre-wires all routes & Context providers
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Shared Components
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages (Pre-wired so teammates work independently)
import LandingPage from './pages/LandingPage';
import LoginRegister from './pages/LoginRegister';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfileHistory from './pages/ProfileHistory';
import StaffDashboard from './pages/StaffDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <CartDrawer />
            <main className="flex-1">
              <Routes>
                {/* [Riya] Public landing & auth */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginRegister />} />

                {/* [Pushkar] Menu catalog */}
                <Route path="/menu" element={<MenuPage />} />

                {/* [Arnav] Cart checkout & time slots (Requires sign in) */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />

                {/* [Vedanti] Order token & status tracking (Requires sign in) */}
                <Route
                  path="/order-tracking"
                  element={
                    <ProtectedRoute>
                      <OrderTrackingPage />
                    </ProtectedRoute>
                  }
                />

                {/* [Riya] Student profile & past orders */}
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <ProfileHistory />
                    </ProtectedRoute>
                  }
                />

                {/* [Anish] Staff kitchen dashboard */}
                <Route
                  path="/staff-dashboard"
                  element={
                    <ProtectedRoute requiredRole="staff">
                      <StaffDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
