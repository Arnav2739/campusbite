// [Riya] LandingPage.jsx - Hero banner, features showcase & CTA sections
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UtensilsCrossed,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChefHat,
  Smartphone,
  Star,
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, isStaff } = useAuth();

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      {/* ====== HERO SECTION ====== */}
      <section
        style={{
          position: 'relative',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 30%, #ffedd5 60%, #fee2e2 100%)',
          overflow: 'hidden',
          padding: '40px 24px',
        }}
      >
        {/* Decorative Floating Elements */}
        <div style={{
          position: 'absolute', top: '10%', left: '8%',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #fdba74, #fb923c)',
          opacity: 0.2, animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '10%',
          width: '120px', height: '120px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #f87171, #ef4444)',
          opacity: 0.15, animation: 'float 8s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '20%',
          width: '50px', height: '50px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          opacity: 0.2, animation: 'float 5s ease-in-out infinite 1s',
        }} />

        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '50px',
              background: 'rgba(234, 88, 12, 0.1)',
              color: '#ea580c',
              fontSize: '13px',
              fontWeight: 600,
              marginBottom: '24px',
              border: '1px solid rgba(234, 88, 12, 0.2)',
            }}
          >
            <Zap size={14} />
            Skip the Queue. Order Ahead.
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              color: '#1f2937',
              lineHeight: 1.15,
              margin: '0 0 20px',
              letterSpacing: '-1px',
            }}
          >
            Your Campus Canteen,{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Now Digital
            </span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#6b7280',
              lineHeight: 1.7,
              maxWidth: '560px',
              margin: '0 auto 36px',
            }}
          >
            Browse the full menu, pre-order your favourite meals, pick a
            convenient time slot, and grab your food with a unique pickup token
            — zero waiting in line!
          </p>

          {/* CTA Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '14px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link
              to={isAuthenticated ? (isStaff ? '/staff-dashboard' : '/menu') : '/menu'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 32px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '15px',
                boxShadow: '0 4px 20px rgba(234, 88, 12, 0.35)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              Explore Menu <ArrowRight size={16} />
            </Link>

            {!isAuthenticated && (
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 32px',
                  borderRadius: '14px',
                  background: '#fff',
                  color: '#1f2937',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '15px',
                  border: '2px solid #e5e7eb',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Social Proof */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '48px',
              color: '#9ca3af',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={14} style={{ color: '#f59e0b' }} />
              <span><strong style={{ color: '#374151' }}>4.8</strong> Student Rating</span>
            </div>
            <div style={{ width: '1px', height: '16px', background: '#d1d5db' }} />
            <div>
              <strong style={{ color: '#374151' }}>500+</strong> Orders Daily
            </div>
            <div style={{ width: '1px', height: '16px', background: '#d1d5db' }} />
            <div>
              <strong style={{ color: '#374151' }}>3 min</strong> Avg Pickup
            </div>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS SECTION ====== */}
      <section
        style={{
          padding: '80px 24px',
          background: '#fff',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '12px',
          }}
        >
          How It Works
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '48px', fontSize: '15px' }}>
          Three simple steps to skip the canteen queue forever
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '32px',
            maxWidth: '900px',
            margin: '0 auto',
          }}
        >
          {[
            {
              icon: <Smartphone size={28} />,
              step: '01',
              title: 'Browse & Order',
              desc: 'Pick your favourite items from the live digital menu with real-time availability.',
              gradient: 'linear-gradient(135deg, #fdba74, #fb923c)',
            },
            {
              icon: <Clock size={28} />,
              step: '02',
              title: 'Pick a Time Slot',
              desc: 'Choose a convenient pickup window so your food is ready exactly when you arrive.',
              gradient: 'linear-gradient(135deg, #f87171, #ef4444)',
            },
            {
              icon: <ChefHat size={28} />,
              step: '03',
              title: 'Grab & Go',
              desc: 'Show your unique pickup token at the counter and collect your meal — no queue!',
              gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                padding: '36px 28px',
                borderRadius: '20px',
                background: '#fafafa',
                border: '1px solid #f3f4f6',
                textAlign: 'left',
                transition: 'transform 0.25s, box-shadow 0.25s',
                cursor: 'default',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: item.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  marginBottom: '20px',
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#d1d5db',
                  letterSpacing: '1px',
                }}
              >
                STEP {item.step}
              </span>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#1f2937',
                  margin: '8px 0',
                }}
              >
                {item.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section
        style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: '48px',
          }}
        >
          Why Students Love CampusBite
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            maxWidth: '960px',
            margin: '0 auto',
          }}
        >
          {[
            {
              icon: <Zap size={22} />,
              title: 'Lightning Fast',
              desc: 'Pre-order and skip the rush-hour queue entirely.',
              color: '#f59e0b',
            },
            {
              icon: <ShieldCheck size={22} />,
              title: 'Secure Payments',
              desc: 'UPI, card and wallet payments with encrypted checkout.',
              color: '#10b981',
            },
            {
              icon: <Clock size={22} />,
              title: 'Live Tracking',
              desc: 'Real-time order status from Placed → Preparing → Ready.',
              color: '#3b82f6',
            },
            {
              icon: <UtensilsCrossed size={22} />,
              title: 'Full Menu Access',
              desc: 'Browse all categories with veg/non-veg filters and search.',
              color: '#ea580c',
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                padding: '32px 24px',
                borderRadius: '16px',
                background: '#fff',
                boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                textAlign: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${feature.color}15`,
                  color: feature.color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: '#1f2937',
                  margin: '0 0 8px',
                }}
              >
                {feature.title}
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6, margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== BOTTOM CTA ====== */}
      <section
        style={{
          padding: '60px 24px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
          color: '#fff',
        }}
      >
        <h2 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '12px' }}>
          Ready to Skip the Queue?
        </h2>
        <p
          style={{
            fontSize: '15px',
            opacity: 0.85,
            maxWidth: '480px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Join hundreds of students already ordering smarter on CampusBite.
        </p>
        <Link
          to={isAuthenticated ? '/menu' : '/login'}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 36px',
            borderRadius: '14px',
            background: '#fff',
            color: '#ea580c',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            transition: 'transform 0.2s',
          }}
        >
          {isAuthenticated ? 'Order Now' : 'Get Started'} <ArrowRight size={16} />
        </Link>
      </section>

      {/* ====== FOOTER ====== */}
      <footer
        style={{
          padding: '24px',
          textAlign: 'center',
          background: '#1f2937',
          color: '#9ca3af',
          fontSize: '13px',
        }}
      >
        <p style={{ margin: 0 }}>
          © 2026 CampusBite — Built with ❤️ for MIT Campus Canteen
        </p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
