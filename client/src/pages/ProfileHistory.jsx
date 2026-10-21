// [Riya] ProfileHistory.jsx - Student profile card & past order history with reorder
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import axiosInstance from '../api/axiosInstance';
import {
  User,
  Mail,
  Hash,
  Phone,
  Calendar,
  ShoppingBag,
  RefreshCcw,
  Package,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  ChefHat,
  UtensilsCrossed,
} from 'lucide-react';

// Status badge color mapping
const STATUS_CONFIG = {
  Placed: { bg: '#dbeafe', color: '#1d4ed8', icon: <Package size={13} /> },
  Preparing: { bg: '#fef3c7', color: '#92400e', icon: <ChefHat size={13} /> },
  Ready: { bg: '#d1fae5', color: '#065f46', icon: <CheckCircle2 size={13} /> },
  Completed: { bg: '#f0fdf4', color: '#166534', icon: <CheckCircle2 size={13} /> },
  Cancelled: { bg: '#fef2f2', color: '#991b1b', icon: <XCircle size={13} /> },
};

const ProfileHistory = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [reorderFeedback, setReorderFeedback] = useState('');

  // Fetch order history
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosInstance.get('/orders/my-orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // One-click reorder: push all items from an order into cart
  const handleReorder = (order) => {
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          _id: item.menuItemId?._id || item.menuItemId,
          name: item.name,
          price: item.price,
          isVeg: item.isVeg,
          imageUrl: item.imageUrl || '',
        });
      }
    });
    setReorderFeedback(`Added ${order.items.length} item(s) from order ${order.pickupToken} to cart!`);
    setTimeout(() => setReorderFeedback(''), 3000);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Order statistics
  const completedOrders = orders.filter((o) => o.orderStatus === 'Completed');
  const totalSpent = completedOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 60px)',
        background: 'linear-gradient(180deg, #fff7ed 0%, #f9fafb 40%)',
        padding: '32px 16px',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* ====== PROFILE CARD ====== */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            padding: '32px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '28px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#1f2937',
                  margin: '0 0 4px',
                }}
              >
                {user?.name || 'Student'}
              </h1>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  background: '#dbeafe',
                  color: '#1e40af',
                  textTransform: 'capitalize',
                  marginBottom: '12px',
                }}
              >
                {user?.role || 'student'}
              </span>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#6b7280',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} style={{ color: '#9ca3af' }} />
                  {user?.email || '—'}
                </div>
                {user?.rollNumber && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Hash size={14} style={{ color: '#9ca3af' }} />
                    {user.rollNumber}
                  </div>
                )}
                {user?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={14} style={{ color: '#9ca3af' }} />
                    {user.phone}
                  </div>
                )}
                {user?.createdAt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} style={{ color: '#9ca3af' }} />
                    Joined {formatDate(user.createdAt)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #f3f4f6',
            }}
          >
            {[
              {
                label: 'Total Orders',
                value: orders.length,
                icon: <ShoppingBag size={18} />,
                color: '#3b82f6',
              },
              {
                label: 'Completed',
                value: completedOrders.length,
                icon: <CheckCircle2 size={18} />,
                color: '#10b981',
              },
              {
                label: 'Total Spent',
                value: `₹${totalSpent}`,
                icon: <Package size={18} />,
                color: '#ea580c',
              },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '16px 8px',
                  borderRadius: '14px',
                  background: '#fafafa',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `${stat.color}15`,
                    color: stat.color,
                    marginBottom: '8px',
                  }}
                >
                  {stat.icon}
                </div>
                <p
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1f2937',
                    margin: '0 0 2px',
                  }}
                >
                  {stat.value}
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0, fontWeight: 500 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ====== REORDER FEEDBACK TOAST ====== */}
        {reorderFeedback && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#10b981',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <CheckCircle2 size={16} /> {reorderFeedback}
          </div>
        )}

        {/* ====== ORDER HISTORY SECTION ====== */}
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            padding: '28px 32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', margin: 0 }}>
              <ShoppingBag
                size={18}
                style={{ verticalAlign: 'text-bottom', marginRight: '8px', color: '#ea580c' }}
              />
              Order History
            </h2>
            <button
              onClick={fetchOrders}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#374151',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
                fontFamily: 'inherit',
              }}
            >
              <RefreshCcw size={13} /> Refresh
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: '#9ca3af',
              }}
            >
              <Loader2
                size={28}
                style={{ animation: 'spin 0.8s linear infinite', marginBottom: '12px' }}
              />
              <p style={{ fontSize: '14px', margin: 0 }}>Loading your orders...</p>
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '16px',
                borderRadius: '12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                fontSize: '13px',
              }}
            >
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && orders.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 16px',
                color: '#9ca3af',
              }}
            >
              <UtensilsCrossed size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p style={{ fontSize: '15px', fontWeight: 500, margin: '0 0 4px' }}>
                No orders yet
              </p>
              <p style={{ fontSize: '13px', margin: 0 }}>
                Head to the menu and place your first order!
              </p>
            </div>
          )}

          {/* Orders List */}
          {!loading &&
            !error &&
            orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              const statusConf = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Placed;

              return (
                <div
                  key={order._id}
                  style={{
                    border: '1px solid #f3f4f6',
                    borderRadius: '14px',
                    marginBottom: '12px',
                    overflow: 'hidden',
                    transition: 'box-shadow 0.2s',
                    boxShadow: isExpanded ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {/* Order Header (Clickable) */}
                  <button
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: isExpanded ? '#fafafa' : '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textAlign: 'left',
                      }}
                    >
                      {/* Pickup Token Badge */}
                      <div
                        style={{
                          padding: '6px 12px',
                          borderRadius: '10px',
                          background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                          color: '#fff',
                          fontSize: '13px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          flexShrink: 0,
                        }}
                      >
                        {order.pickupToken || 'CB-???'}
                      </div>

                      <div>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#1f2937',
                            margin: '0 0 2px',
                          }}
                        >
                          {order.items?.length || 0} item(s) · ₹{order.totalAmount || 0}
                        </p>
                        <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                          <Clock size={11} style={{ verticalAlign: 'text-bottom' }} />{' '}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Status Badge */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          background: statusConf.bg,
                          color: statusConf.color,
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {statusConf.icon} {order.orderStatus}
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={16} style={{ color: '#9ca3af' }} />
                      ) : (
                        <ChevronDown size={16} style={{ color: '#9ca3af' }} />
                      )}
                    </div>
                  </button>

                  {/* Order Details (Expanded) */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '0 16px 16px',
                        borderTop: '1px solid #f3f4f6',
                        animation: 'fadeInDown 0.2s ease',
                      }}
                    >
                      {/* Items Table */}
                      <div style={{ padding: '12px 0' }}>
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '8px 0',
                              borderBottom:
                                idx < order.items.length - 1 ? '1px solid #f9fafb' : 'none',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {/* Veg/Non-veg indicator */}
                              <span
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '2px',
                                  border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <span
                                  style={{
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    background: item.isVeg ? '#22c55e' : '#ef4444',
                                  }}
                                />
                              </span>
                              <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                                {item.name}
                              </span>
                              <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                                ×{item.quantity}
                              </span>
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937' }}>
                              ₹{item.price * item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Order Summary */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          padding: '12px',
                          background: '#fafafa',
                          borderRadius: '10px',
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '12px',
                        }}
                      >
                        <span>Subtotal</span>
                        <span style={{ textAlign: 'right' }}>₹{order.subtotal || 0}</span>
                        <span>Tax (5% GST)</span>
                        <span style={{ textAlign: 'right' }}>₹{order.taxAmount || 0}</span>
                        <span>Packaging</span>
                        <span style={{ textAlign: 'right' }}>₹{order.packagingFee || 0}</span>
                        <span style={{ fontWeight: 700, color: '#1f2937' }}>Total</span>
                        <span
                          style={{
                            textAlign: 'right',
                            fontWeight: 700,
                            color: '#1f2937',
                          }}
                        >
                          ₹{order.totalAmount || 0}
                        </span>
                      </div>

                      {/* Slot & Payment Info */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          flexWrap: 'wrap',
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '12px',
                        }}
                      >
                        {order.slotLabel && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={12} /> Slot: {order.slotLabel}
                          </span>
                        )}
                        {order.paymentMethod && (
                          <span>Payment: {order.paymentMethod.toUpperCase()}</span>
                        )}
                      </div>

                      {/* Reorder Button (only for completed/cancelled) */}
                      {(order.orderStatus === 'Completed' ||
                        order.orderStatus === 'Cancelled') && (
                        <button
                          onClick={() => handleReorder(order)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px',
                            borderRadius: '10px',
                            border: '2px solid #ea580c',
                            background: '#fff',
                            color: '#ea580c',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                          }}
                        >
                          <RefreshCcw size={14} /> Reorder This Meal
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ProfileHistory;
