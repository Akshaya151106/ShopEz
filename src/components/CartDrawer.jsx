import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Sparkles } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveFromCart, onProceedToCheckout }) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

  // Calculate subtotals
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.discount 
      ? item.price * (1 - item.discount / 100) 
      : item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  const discountAmount = appliedPromo 
    ? subtotal * (appliedPromo.percent / 100) 
    : 0;

  const total = subtotal - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'SHOPEZ20') {
      setAppliedPromo({ code: 'SHOPEZ20', percent: 20 });
      setPromoError('');
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a code.');
    } else {
      setPromoError('Invalid coupon code. Try "SHOPEZ20".');
    }
  };

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end'
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
          background: 'rgba(5, 7, 12, 0.7)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* Drawer Drawer Body */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          borderRadius: 0,
          borderLeft: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.5)',
          animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        
        {/* Drawer Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-neon)' }} />
            <h3 style={{ fontSize: '1.25rem' }}>Your Cart</h3>
            <span style={{ 
              fontSize: '0.8rem', 
              background: 'var(--primary-gradient)', 
              borderRadius: '20px', 
              padding: '2px 8px',
              fontWeight: 600
            }}>
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-smooth)'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {cart.length === 0 ? (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              color: 'var(--text-secondary)'
            }}>
              <ShoppingBag size={48} style={{ strokeWidth: 1, color: 'var(--text-muted)', marginBottom: '16px' }} />
              <p style={{ fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Browse our catalog to add items to your cart.</p>
              <button 
                onClick={onClose}
                className="btn-primary" 
                style={{ marginTop: '20px', fontSize: '0.85rem' }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.discount 
                ? item.price * (1 - item.discount / 100) 
                : item.price;
              
              return (
                <div 
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center'
                  }}
                >
                  {/* Thumbnail Image */}
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    background: '#151c2c',
                    border: '1px solid var(--border-color)',
                    flexShrink: 0
                  }}>
                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  {/* Meta Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ 
                      fontSize: '0.95rem', 
                      fontWeight: 600, 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      marginBottom: '4px'
                    }}>
                      {item.name}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      Category: {item.category}
                    </p>
                    
                    {/* Quantity controls & price */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '6px',
                        padding: '2px'
                      }}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', padding: '0 8px', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-neon)' }}>
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>

                  </div>

                  {/* Remove Button */}
                  <button 
                    onClick={() => onRemoveFromCart(item.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '8px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer & Checkout details */}
        {cart.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid var(--border-color)',
            background: 'rgba(11, 15, 25, 0.9)'
          }}>
            
            {/* Promo Code Input Form */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Promo Code (Try SHOPEZ20)"
                value={promoCode} 
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                disabled={!!appliedPromo}
              />
              <button 
                type="submit" 
                className="btn-secondary" 
                style={{ padding: '8px 14px', fontSize: '0.85rem', flexShrink: 0 }}
                disabled={!!appliedPromo}
              >
                Apply
              </button>
            </form>

            {appliedPromo && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.85rem',
                color: 'var(--success)',
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.2)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '16px'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Sparkles size={14} /> Coupon {appliedPromo.code} Applied!
                </span>
                <span style={{ fontWeight: 700 }}>-{appliedPromo.percent}%</span>
              </div>
            )}

            {promoError && (
              <p style={{ fontSize: '0.8rem', color: 'var(--danger)', marginTop: '-8px', marginBottom: '16px', fontWeight: 500 }}>
                {promoError}
              </p>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              {appliedPromo && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--success)' }}>
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                fontSize: '1.2rem', 
                fontWeight: 700, 
                borderTop: '1px solid var(--border-color)', 
                paddingTop: '10px',
                marginTop: '4px'
              }}>
                <span>Total:</span>
                <span style={{ color: 'var(--accent-neon)' }}>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to checkout button */}
            <button 
              onClick={() => onProceedToCheckout({ appliedPromo, total, subtotal, discountAmount })}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '1rem' }}
            >
              <span>Proceed to Checkout</span>
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
