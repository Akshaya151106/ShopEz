import React, { useState } from 'react';
import { X, Lock, User, Mail, Sparkles, UserPlus, LogIn } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, users, onLogin, onRegister }) {
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

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = users.find(
      u => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && 
      u.password === loginPassword
    );

    if (user) {
      onLogin(user);
      setLoginUsername('');
      setLoginPassword('');
      setLoginError('');
      onClose();
    } else {
      setLoginError('Invalid username or password. (Try "alex" / "password123")');
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    // Validations
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
    
    // Auto-login registered user
    onLogin(newUser);

    // Reset fields
    setRegFullName('');
    setRegEmail('');
    setRegUsername('');
    setRegPassword('');
    setRegError('');
    onClose();
  };

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 7, 12, 0.75)',
          backdropFilter: 'blur(6px)'
        }}
      />

      {/* Modal Box */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          border: '1px solid var(--border-glow)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)'
        }}
      >
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '24px', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveTab('login')}
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
              borderBottom: activeTab === 'login' ? '2px solid var(--primary-glow)' : '2px solid transparent',
              transition: 'var(--transition-smooth)'
            }}
          >
            <LogIn size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            <span>Sign In</span>
          </button>
          
          <button
            onClick={() => setActiveTab('register')}
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
              borderBottom: activeTab === 'register' ? '2px solid var(--primary-glow)' : '2px solid transparent',
              transition: 'var(--transition-smooth)'
            }}
          >
            <UserPlus size={15} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
            <span>Register</span>
          </button>
        </div>

        {/* LOGIN FORM PANEL */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Welcome Back</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Login to purchase items and share reviews.</p>
            </div>

            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Username (try 'alex')"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  placeholder="Password (try 'password123')"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            {loginError && (
              <p style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>
                {loginError}
              </p>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <LogIn size={16} />
              <span>Sign In Securely</span>
            </button>

          </form>
        )}

        {/* REGISTER FORM PANEL */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Create Account</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Join ShopEZ today for exclusive benefits.</p>
            </div>

            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Johnathan Doe"
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Email Address</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  placeholder="email@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Choose Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="e.g. johndoe"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ width: '100%', paddingLeft: '40px' }}
                  required
                />
              </div>
            </div>

            {regError && (
              <p style={{ fontSize: '0.8rem', color: 'var(--danger)', fontWeight: 500 }}>
                {regError}
              </p>
            )}

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <Sparkles size={16} />
              <span>Create Account</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
