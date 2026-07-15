import React, { useState, useEffect } from 'react';
import { ShoppingCart, LayoutDashboard, Store, Search, Sparkles, Palette, LogOut, Bell, X } from 'lucide-react';
import { initialProducts, initialReviews, initialOrders, initialUsers } from './data/mockData';

// Subcomponents
import CatalogView from './components/CatalogView';
import ProductDetailsView from './components/ProductDetailsView';
import CartDrawer from './components/CartDrawer';
import CheckoutFlow from './components/CheckoutFlow';
import SellerDashboard from './components/SellerDashboard';
import AuthView from './components/AuthView';

const normalizeProduct = (product) => {
  const image = product.image || '/headphones.jpg';
  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [image];

  return {
    ...product,
    image,
    images,
  };
};

export default function App() {
  // --- Persistent State Management ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('shopez_products');
    const base = saved ? JSON.parse(saved) : initialProducts;
    return Array.isArray(base) ? base.map(normalizeProduct) : initialProducts.map(normalizeProduct);
  });

  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('shopez_reviews');
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('shopez_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('shopez_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // --- Authentication State ---
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('shopez_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('shopez_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- Theme Accent Picker State ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('shopez_theme') || 'theme-purple';
  });

  // Navigation & Filtering State
  const [view, setView] = useState('catalog'); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMeta, setCheckoutMeta] = useState(null);
  const [animateCart, setAnimateCart] = useState(false);

  // --- Live Activity Sales Ticker State ---
  const [activity, setActivity] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('shopez_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('shopez_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('shopez_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('shopez_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('shopez_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shopez_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('shopez_current_user');
    }
  }, [currentUser]);

  // Sync theme to document body and localStorage
  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('shopez_theme', theme);
  }, [theme]);

  // --- Live Sales Activity Generator Interval ---
  useEffect(() => {
    const activities = [
      { name: "Sarah Jenkins", city: "Seattle", product: "NeoBeats Wireless Headphones", action: "just purchased" },
      { name: "David Chen", city: "Boston", product: "ErgoGlide Office Chair", action: "just ordered" },
      { name: "Emily Taylor", city: "Metropolis", product: "Chronos Smart Watch", action: "left a 5-star review on" },
      { name: "Marcus V.", city: "Neo City", product: "Lumina Minimalist Desk Lamp", action: "added to cart" },
      { name: "James Peterson", city: "Seattle", product: "AeroBuds Pro Wireless Earbuds", action: "just purchased" },
      { name: "Alex Rivera", city: "Los Angeles", product: "ZenFlow Smart Humidifier", action: "just ordered" }
    ];

    const cycleActivity = () => {
      // Pick random activity
      const randomAct = activities[Math.floor(Math.random() * activities.length)];
      setActivity(randomAct);

      // Hide after 6 seconds
      setTimeout(() => {
        setActivity(null);
      }, 6000);
    };

    // Cycle activity every 15 seconds
    const interval = setInterval(cycleActivity, 15000);
    
    // First trigger after 4 seconds
    const initialTimeout = setTimeout(cycleActivity, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, []);

  // --- Authentication Handlers ---
  const handleLogin = (user) => {
    setCurrentUser(user);
  };

  const handleRegister = (newUser) => {
    setUsers([...users, newUser]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]); 
    setView('catalog');
    setSelectedProduct(null);
  };

  // --- Cart Handlers ---
  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    const availableStock = product.stock;

    if (existingItem) {
      if (existingItem.quantity >= availableStock) {
        alert(`Cannot add more. Only ${availableStock} units available in stock.`);
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      if (availableStock <= 0) {
        alert("This item is currently out of stock.");
        return;
      }
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setAnimateCart(true);
    setTimeout(() => setAnimateCart(false), 500);
  };

  const handleUpdateCartQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }

    const prod = products.find(p => p.id === id);
    if (prod && newQty > prod.stock) {
      alert(`Only ${prod.stock} units available in stock.`);
      return;
    }

    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: newQty } : item
    ));
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handleLaunchCheckout = (meta) => {
    setCheckoutMeta(meta);
    setIsCartOpen(false);
    setView('checkout');
  };

  const handleCompleteCheckout = (receipt) => {
    setOrders([receipt, ...orders]);
    setProducts(prevProducts => 
      prevProducts.map(product => {
        const cartItem = cart.find(item => item.id === product.id);
        if (cartItem) {
          return {
            ...product,
            stock: Math.max(0, product.stock - cartItem.quantity)
          };
        }
        return product;
      })
    );
    setCart([]);
  };

  // --- Review Handlers ---
  const handleAddReview = (newReview) => {
    const reviewWithId = {
      ...newReview,
      id: Date.now()
    };
    
    const updatedReviews = [reviewWithId, ...reviews];
    setReviews(updatedReviews);

    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === newReview.productId) {
          const prodReviews = updatedReviews.filter(r => r.productId === product.id);
          const totalRatingSum = prodReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = totalRatingSum / prodReviews.length;
          
          return {
            ...product,
            rating: Number(avgRating.toFixed(1)),
            ratingCount: prodReviews.length
          };
        }
        return product;
      })
    );

    if (selectedProduct && selectedProduct.id === newReview.productId) {
      setSelectedProduct(prev => {
        const prodReviews = updatedReviews.filter(r => r.productId === prev.id);
        const totalRatingSum = prodReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = totalRatingSum / prodReviews.length;
        return {
          ...prev,
          rating: Number(avgRating.toFixed(1)),
          ratingCount: prodReviews.length
        };
      });
    }
  };

  // --- Seller Dashboard Handlers ---
  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    setCart(cart.filter(item => item.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(ord => ord.id === orderId ? { ...ord, status: newStatus } : ord));
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setView('product-details');
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // --- GATED ROUTER: GUEST GATED TO FULL-PAGE AUTH VIEW ---
  if (!currentUser) {
    return (
      <AuthView 
        users={users}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  // --- MAIN APP ---
  return (
    <div className="app-container">
      
      {/* GLOWING HEADER / NAVIGATION BAR */}
      <header className="glass-panel" style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderRadius: 0,
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Brand Identity */}
        <div 
          onClick={() => { setView('catalog'); setSelectedProduct(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
        >
          <Sparkles className="text-glow" style={{ color: 'var(--primary-glow)' }} size={24} />
          <h1 className="text-glow" style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '1.75rem', 
            fontWeight: 900, 
            background: 'var(--primary-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            ShopEZ
          </h1>
        </div>

        {/* Theme Accents Palette Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '6px 12px', borderRadius: '30px' }}>
          <Palette size={14} style={{ color: 'var(--text-secondary)' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'theme-purple', color: '#8b5cf6', label: 'Cyber Purple' },
              { id: 'theme-emerald', color: '#10b981', label: 'Emerald Aurora' },
              { id: 'theme-blue', color: '#0ea5e9', label: 'Ocean Breeze' },
              { id: 'theme-gold', color: '#f59e0b', label: 'Sunset Gold' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={t.label}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: t.color,
                  border: theme === t.id ? '2px solid #fff' : '1px solid transparent',
                  cursor: 'pointer',
                  transform: theme === t.id ? 'scale(1.2)' : 'none',
                  boxShadow: theme === t.id ? `0 0 10px ${t.color}` : 'none',
                  transition: 'transform 0.2s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Global Search Bar */}
        {view === 'catalog' && (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, maxWidth: '280px' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Search catalog products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '44px',
                borderRadius: '30px',
                background: 'rgba(0, 0, 0, 0.25)'
              }}
            />
          </div>
        )}

        {/* Navigation Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          <button 
            onClick={() => { setView('catalog'); setSelectedProduct(null); }}
            className="btn-text"
            style={{ 
              fontWeight: 600, 
              color: view === 'catalog' || view === 'product-details' ? 'var(--accent-neon)' : 'var(--text-secondary)'
            }}
          >
            <Store size={18} />
            <span>Market</span>
          </button>

          <button 
            onClick={() => setView('dashboard')}
            className="btn-text"
            style={{ 
              fontWeight: 600, 
              color: view === 'dashboard' ? 'var(--accent-neon)' : 'var(--text-secondary)'
            }}
          >
            <LayoutDashboard size={18} />
            <span>Seller Hub</span>
          </button>

          {/* User Profile / Logout details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              title={`Logged in as ${currentUser.fullName}`}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--primary-gradient)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem',
                border: '2px solid rgba(255,255,255,0.1)',
                boxShadow: '0 0 10px rgba(var(--primary-glow-rgb), 0.3)'
              }}
            >
              {getUserInitials(currentUser.fullName)}
            </div>
            
            <button 
              onClick={handleLogout}
              className="btn-secondary"
              style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', gap: '4px' }}
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>

          {/* Cart Icon Trigger */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className={`btn-primary ${animateCart ? 'cart-bounce-animation' : ''}`}
            style={{ padding: '8px 16px', borderRadius: '30px', gap: '8px' }}
          >
            <ShoppingCart size={18} />
            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </button>

        </div>

      </header>

      {/* CORE ROUTER BODY CONTAINER */}
      <main style={{ flex: 1, width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '0 24px 40px 24px' }}>
        
        {/* Marketplace Catalog Grid */}
        {view === 'catalog' && (
          <div>
            {searchQuery === '' && (
              <div className="hero-banner animate-fade-in" style={{ marginTop: '24px' }}>
                <h1 style={{ letterSpacing: '-0.04em' }}>Welcome back, {currentUser.fullName.split(' ')[0]}!</h1>
                <p>
                  Browse our fresh collection of premium goods. Don't forget to use coupon <b>SHOPEZ20</b> in your cart for 20% off!
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                  <button 
                    onClick={() => {
                      const el = document.querySelector('.catalog-container');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-primary"
                  >
                    <span>Start Shopping</span>
                  </button>
                  <button 
                    onClick={() => setView('dashboard')}
                    className="btn-secondary"
                  >
                    <span>Go to Seller Hub</span>
                  </button>
                </div>
              </div>
            )}

            <CatalogView 
              products={products}
              searchQuery={searchQuery}
              onSelectProduct={handleSelectProduct}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* Detailed Product spec view */}
        {view === 'product-details' && selectedProduct && (
          <ProductDetailsView 
            product={selectedProduct}
            reviews={reviews}
            currentUser={currentUser}
            onBack={() => setView('catalog')}
            onAddToCart={handleAddToCart}
            onAddReview={handleAddReview}
          />
        )}

        {/* Multi-step checkout wizard */}
        {view === 'checkout' && (
          <CheckoutFlow 
            cart={cart}
            checkoutMeta={checkoutMeta}
            currentUser={currentUser}
            onCompleteCheckout={handleCompleteCheckout}
            onCancel={() => { setView('catalog'); setCheckoutMeta(null); }}
          />
        )}

        {/* Seller Inventory analytics Dashboard */}
        {view === 'dashboard' && (
          <SellerDashboard 
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

      </main>

      {/* SLIDING SHOPPING CART DRAWER SIDEBAR */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onProceedToCheckout={handleLaunchCheckout}
      />

      {/* LIVE SALES SOCIAL PROOF TICKER TOAST */}
      {activity && (
        <div 
          className="glass-panel"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '320px',
            padding: '16px',
            zIndex: 4000,
            border: '1px solid rgba(var(--primary-glow-rgb), 0.35)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(var(--primary-glow-rgb), 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          {/* Pulsing indicator */}
          <div style={{ position: 'relative', display: 'flex', flexShrink: 0 }}>
            <div className="pulse-indicator" style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--primary-glow)'
            }} />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Bell size={11} style={{ color: 'var(--accent-neon)' }} />
              <span>Live Store Activity</span>
            </p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activity.name} <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>in {activity.city}</span>
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--accent-neon)', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {activity.action} <b>{activity.product}</b>
            </p>
          </div>

          <button 
            onClick={() => setActivity(null)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '4px',
              flexShrink: 0
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

    </div>
  );
}
