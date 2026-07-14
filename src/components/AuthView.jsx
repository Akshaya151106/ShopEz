import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, User, Lock, Mail, Store, ShieldCheck, BarChart3, ShoppingBag } from 'lucide-react';

export default function AuthView({ users, onLogin, onRegister }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form States
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form States
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regError, setRegError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      u => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && 
      u.password === loginPassword
    );

    if (user) {
      onLogin(user);
    } else {
      setLoginError('Invalid username or password. (Try username "alex" and password "password123")');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (users.some(u => u.username.toLowerCase() === regUsername.trim().toLowerCase())) {
      setRegError('Username is already taken.');
      return;
    }
    if (users.some(u => u.email.toLowerCase() === regEmail.trim().toLowerCase())) {
      setRegError('Email is already registered.');
      return;
    }

    const newUser = {
      username: regUsername.trim(),
      password: regPassword,
      fullName: regFullName.trim(),
      email: regEmail.trim()
    };

    onRegister(newUser);
    onLogin(newUser); // Auto login
  };

  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      background: 'var(--bg-deep)',
      position: 'relative'
    }}>
      
      {/* LEFT COLUMN: HERO INFORMATION PANEL */}
      <div style={{
        padding: '60px 40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderRight: '1px solid var(--border-color)',
        background: 'radial-gradient(circle at 10% 20%, rgba(var(--primary-glow-rgb), 0.15) 0%, transparent 60%)'
      }}>
        
        {/* Floating Sparkles decoration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
          <Sparkles className="text-glow" size={36} style={{ color: 'var(--primary-glow)' }} />
          <h1 className="text-glow" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.5rem',
            fontWeight: 900,
            background: 'var(--primary-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            ShopEZ
          </h1>
        </div>

        <h2 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: '1.1', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
          The Future of Online Shopping.
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', lineHeight: '1.6', marginBottom: '40px', maxWidth: '480px' }}>
          Experience a fluid e-commerce ecosystem. Effortlessly browse high-end items, access interactive buyer reviews, claim discounts, and monitor detailed seller sales analytics.
        </p>

        {/* Feature Checkmarks list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '8px', background: 'rgba(var(--primary-glow-rgb), 0.1)', color: 'var(--accent-neon)', borderRadius: '8px' }}>
              <Store size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Curated Product Catalog</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Browse premium electronics, decor, furniture and accessories.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px' }}>
              <ShoppingBag size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Secure Checkout & Coupon Systems</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Claim 20% discounts and complete safe card transactions instantly.</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)', borderRadius: '8px' }}>
              <BarChart3 size={18} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Robust Analytics Dashboard</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Track revenue metrics, chart daily sales, and manage store stock.</p>
            </div>
          </div>

        </div>

      </div>

      {/* RIGHT COLUMN: LOGIN / REGISTER CARD CONTAINER */}
      <div style={{
        padding: '60px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 90% 80%, rgba(219, 39, 119, 0.05) 0%, transparent 60%)'
      }}>
        
        <div className="glass-panel" style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          border: '1px solid var(--border-color)'
        }}>
          
          {/* Modal Header Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
            <button
              onClick={() => { setActiveTab('login'); setLoginError(''); }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '12px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.05rem',
                cursor: 'pointer',
                color: activeTab === 'login' ? 'var(--accent-neon)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'login' ? '2.5px solid var(--primary-glow)' : '2.5px solid transparent',
                transition: 'var(--transition-smooth)'
              }}
            >
              <LogIn size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              <span>Sign In</span>
            </button>
            
            <button
              onClick={() => { setActiveTab('register'); setRegError(''); }}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '12px',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.05rem',
                cursor: 'pointer',
                color: activeTab === 'register' ? 'var(--accent-neon)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'register' ? '2.5px solid var(--primary-glow)' : '2.5px solid transparent',
                transition: 'var(--transition-smooth)'
              }}
            >
              <UserPlus size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              <span>Register</span>
            </button>
          </div>

          {/* SIGN IN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Username</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Username (e.g. alex)"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    style={{ width: '100%', paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    placeholder="Password (e.g. password123)"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ width: '100%', paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              {loginError && (
                <p style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500, lineHeight: '1.4' }}>
                  {loginError}
                </p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '14px' }}>
                <LogIn size={16} />
                <span>Sign In Securely</span>
              </button>

              <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Demo Accounts: username <b style={{ color: 'var(--text-secondary)' }}>alex</b> or <b style={{ color: 'var(--text-secondary)' }}>jane</b> with password <b style={{ color: 'var(--text-secondary)' }}>password123</b>.
                </span>
              </div>

            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Alex Rivera"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="email" 
                    placeholder="alex@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    style={{ width: '100%', paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Username</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Username"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    style={{ width: '100%', paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                  <input 
                    type="password" 
                    placeholder="Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ width: '100%', paddingLeft: '42px' }}
                    required
                  />
                </div>
              </div>

              {regError && (
                <p style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>
                  {regError}
                </p>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px', padding: '14px' }}>
                <Sparkles size={16} />
                <span>Create Account</span>
              </button>

            </form>
          )}

        </div>

      </div>

    </div>
  );
}
