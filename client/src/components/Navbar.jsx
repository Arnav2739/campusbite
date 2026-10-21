// [Riya] Navbar.jsx - Role-aware navigation with cart badge & user dropdown
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, LogOut, Menu, X, ChefHat, UtensilsCrossed, History, Home } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, isStaff, logout } = useAuth();
  const { totalItemCount, toggleCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  // Helper: highlight active link
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: isActive(path) ? '#ffffff' : 'rgba(255,255,255,0.8)',
    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  });

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
          color: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#fff',
            fontWeight: 700,
            fontSize: '20px',
            letterSpacing: '-0.3px',
          }}
        >
          <UtensilsCrossed size={22} />
          CampusBite
        </Link>

        {/* Desktop Navigation Links */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          className="navbar-desktop-links"
        >
          <Link to="/" style={linkStyle('/')}>
            <Home size={15} /> Home
          </Link>

          {isStaff ? (
            // Staff sees only dashboard link
            <Link to="/staff-dashboard" style={linkStyle('/staff-dashboard')}>
              <ChefHat size={15} /> Kitchen Dashboard
            </Link>
          ) : (
            // Students see Menu and Order Tracking
            <>
              <Link to="/menu" style={linkStyle('/menu')}>
                <UtensilsCrossed size={15} /> Menu
              </Link>
              <Link to="/order-tracking" style={linkStyle('/order-tracking')}>
                Order Tracking
              </Link>
            </>
          )}

          {isAuthenticated && !isStaff && (
            <Link to="/history" style={linkStyle('/history')}>
              <History size={15} /> My Orders
            </Link>
          )}
        </div>

        {/* Right Section: Cart + User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Cart Button (hidden for staff) */}
          {!isStaff && (
            <button
              onClick={toggleCart}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
                color: '#fff',
                transition: 'background 0.2s',
              }}
              aria-label="Open Cart"
            >
              <ShoppingCart size={20} />
              {totalItemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#facc15',
                    color: '#1f2937',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }}
                >
                  {totalItemCount > 9 ? '9+' : totalItemCount}
                </span>
              )}
            </button>
          )}

          {/* User Actions */}
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen((p) => !p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
              >
                <User size={16} />
                <span className="navbar-desktop-links">{user?.name?.split(' ')[0]}</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  {/* Invisible overlay to close dropdown */}
                  <div
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      position: 'fixed',
                      inset: 0,
                      zIndex: 40,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '110%',
                      background: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                      minWidth: '200px',
                      padding: '8px',
                      zIndex: 50,
                      animation: 'fadeInDown 0.15s ease',
                    }}
                  >
                    {/* User Info Header */}
                    <div
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid #f3f4f6',
                        marginBottom: '4px',
                      }}
                    >
                      <p style={{ fontWeight: 600, color: '#1f2937', fontSize: '14px', margin: 0 }}>
                        {user?.name}
                      </p>
                      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '2px 0 0' }}>
                        {user?.email}
                      </p>
                      <span
                        style={{
                          display: 'inline-block',
                          marginTop: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '20px',
                          background: isStaff ? '#fef3c7' : '#dbeafe',
                          color: isStaff ? '#92400e' : '#1e40af',
                          textTransform: 'capitalize',
                        }}
                      >
                        {user?.role}
                      </span>
                    </div>

                    {/* Dropdown Links */}
                    {!isStaff && (
                      <Link
                        to="/history"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: '#374151',
                          fontSize: '13px',
                          transition: 'background 0.15s',
                        }}
                      >
                        <History size={14} /> Order History
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'transparent',
                        color: '#dc2626',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 18px',
                borderRadius: '10px',
                background: '#fff',
                color: '#ea580c',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '13px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
            >
              <User size={14} /> Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="navbar-mobile-toggle"
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
            zIndex: 49,
            padding: '80px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            animation: 'fadeInDown 0.2s ease',
          }}
        >
          <Link to="/" onClick={closeMobile} style={{ ...mobileLinkStyle }}>
            <Home size={18} /> Home
          </Link>
          {isStaff ? (
            <Link to="/staff-dashboard" onClick={closeMobile} style={mobileLinkStyle}>
              <ChefHat size={18} /> Kitchen Dashboard
            </Link>
          ) : (
            <>
              <Link to="/menu" onClick={closeMobile} style={mobileLinkStyle}>
                <UtensilsCrossed size={18} /> Menu
              </Link>
              <Link to="/order-tracking" onClick={closeMobile} style={mobileLinkStyle}>
                Order Tracking
              </Link>
            </>
          )}
          {isAuthenticated && !isStaff && (
            <Link to="/history" onClick={closeMobile} style={mobileLinkStyle}>
              <History size={18} /> My Orders
            </Link>
          )}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              style={{
                ...mobileLinkStyle,
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                cursor: 'pointer',
                marginTop: '16px',
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          )}
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .navbar-desktop-links { display: none !important; }
          .navbar-mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

// Shared mobile link styles
const mobileLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '14px 16px',
  borderRadius: '12px',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 500,
  background: 'rgba(255,255,255,0.08)',
  transition: 'background 0.2s',
};

export default Navbar;
