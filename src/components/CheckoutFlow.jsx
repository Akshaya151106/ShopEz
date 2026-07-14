import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, CreditCard, Sparkles, CheckCircle2, ChevronRight, ClipboardCheck } from 'lucide-react';

export default function CheckoutFlow({ cart, checkoutMeta, currentUser, onCompleteCheckout, onCancel }) {
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  
  // Shipping Form State
  const [shippingForm, setShippingForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  // Pre-fill shipping fields if user is authenticated
  useEffect(() => {
    if (currentUser) {
      setShippingForm(prev => ({
        ...prev,
        fullName: currentUser.fullName,
        email: currentUser.email
      }));
    }
  }, [currentUser]);

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [receipt, setReceipt] = useState(null);

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    
    // Generate Order Receipt Data
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000).toString(16).toUpperCase();
    const mockReceipt = {
      orderId,
      customerName: shippingForm.fullName,
      email: shippingForm.email,
      address: `${shippingForm.address}, ${shippingForm.city}, ${shippingForm.state} ${shippingForm.zipCode}`,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.discount ? item.price * (1 - item.discount / 100) : item.price,
        quantity: item.quantity
      })),
      subtotal: checkoutMeta.subtotal,
      discountAmount: checkoutMeta.discountAmount,
      total: checkoutMeta.total,
      date: new Date().toISOString()
    };

    setReceipt(mockReceipt);
    onCompleteCheckout(mockReceipt);
    setStep(3);
  };

  return (
    <div className="checkout-container animate-fade-in" style={{ padding: '24px 0', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Wizard Progress Steps Bar */}
      {step < 3 && (
        <div className="glass-panel" style={{ padding: '16px 24px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 1 ? 'var(--accent-neon)' : 'var(--success)' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: step === 1 ? 'var(--primary-gradient)' : 'var(--success)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {step > 1 ? '✓' : '1'}
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Shipping Details</span>
          </div>

          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: step === 2 ? 'var(--accent-neon)' : 'var(--text-muted)' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: step === 2 ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.05)',
              border: step === 2 ? 'none' : '1px solid var(--border-color)',
              color: step === 2 ? '#fff' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              2
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Secure Payment</span>
          </div>

          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              3
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Confirmation</span>
          </div>

        </div>
      )}

      {/* STEP 1: SHIPPING FORM */}
      {step === 1 && (
        <form onSubmit={handleShippingSubmit} className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <Truck size={22} style={{ color: 'var(--accent-neon)' }} />
            <h2 style={{ fontSize: '1.5rem' }}>Shipping Address</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={shippingForm.fullName}
                onChange={(e) => setShippingForm({...shippingForm, fullName: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Email Address</label>
              <input 
                type="email" 
                placeholder="johndoe@example.com"
                value={shippingForm.email}
                onChange={(e) => setShippingForm({...shippingForm, email: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Phone Number</label>
              <input 
                type="tel" 
                placeholder="(555) 000-0000"
                value={shippingForm.phone}
                onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Street Address</label>
              <input 
                type="text" 
                placeholder="123 Cyber Avenue, Apt 4B"
                value={shippingForm.address}
                onChange={(e) => setShippingForm({...shippingForm, address: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>City</label>
              <input 
                type="text" 
                placeholder="Neo City"
                value={shippingForm.city}
                onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>State</label>
                <input 
                  type="text" 
                  placeholder="NY"
                  value={shippingForm.state}
                  onChange={(e) => setShippingForm({...shippingForm, state: e.target.value})}
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>ZIP Code</label>
                <input 
                  type="text" 
                  placeholder="10001"
                  value={shippingForm.zipCode}
                  onChange={(e) => setShippingForm({...shippingForm, zipCode: e.target.value})}
                  required
                />
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <span>Continue to Payment</span>
              <ChevronRight size={16} />
            </button>
          </div>

        </form>
      )}

      {/* STEP 2: PAYMENT FORM */}
      {step === 2 && (
        <form onSubmit={handlePaymentSubmit} className="glass-panel animate-fade-in" style={{ padding: '32px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <CreditCard size={22} style={{ color: 'var(--accent-neon)' }} />
            <h2 style={{ fontSize: '1.5rem' }}>Secure Credit Card Payment</h2>
          </div>

          <div style={{ 
            background: 'rgba(124, 58, 237, 0.05)', 
            border: '1px solid var(--border-glow)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} style={{ color: 'var(--accent-neon)' }} />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Paying Total amount of</span>
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-neon)' }}>
              ${checkoutMeta.total.toFixed(2)}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Name on Card</label>
              <input 
                type="text" 
                placeholder="John Doe"
                value={paymentForm.cardName}
                onChange={(e) => setPaymentForm({...paymentForm, cardName: e.target.value})}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Card Number</label>
              <input 
                type="text" 
                placeholder="4111 2222 3333 4444"
                pattern="\d{16}"
                title="Please enter a 16-digit card number"
                value={paymentForm.cardNumber}
                onChange={(e) => setPaymentForm({...paymentForm, cardNumber: e.target.value.replace(/\D/g,'')})}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Expiration Date</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  maxLength="5"
                  value={paymentForm.expiry}
                  onChange={(e) => setPaymentForm({...paymentForm, expiry: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>CVV / CVC</label>
                <input 
                  type="password" 
                  placeholder="***"
                  maxLength="3"
                  pattern="\d{3}"
                  title="Please enter your 3-digit security code"
                  value={paymentForm.cvv}
                  onChange={(e) => setPaymentForm({...paymentForm, cvv: e.target.value.replace(/\D/g,'')})}
                  required
                />
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <button type="button" onClick={() => setStep(1)} className="btn-secondary">
              Back to Shipping
            </button>
            <button type="submit" className="btn-primary">
              <ShieldCheck size={16} />
              <span>Submit Secure Payment</span>
            </button>
          </div>

        </form>
      )}

      {/* STEP 3: ORDER CONFIRMATION */}
      {step === 3 && receipt && (
        <div className="glass-panel animate-fade-in" style={{ padding: '40px', borderTop: '4px solid var(--success)', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', color: 'var(--success)', marginBottom: '20px' }}>
            <CheckCircle2 size={64} style={{ fill: 'rgba(16,185,129,0.1)' }} />
          </div>

          <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Order Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Thank you for shopping with ShopEZ! We have sent a confirmation email to <span style={{ color: '#fff', fontWeight: 600 }}>{receipt.email}</span>.
          </p>

          <div className="glass-panel" style={{ 
            background: 'rgba(0,0,0,0.25)', 
            padding: '24px', 
            borderRadius: 'var(--radius-md)', 
            textAlign: 'left',
            marginBottom: '32px',
            border: '1px dashed var(--border-color)'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID</span>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--accent-neon)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ClipboardCheck size={14} /> {receipt.orderId}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Date</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{new Date(receipt.date).toLocaleDateString()}</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ship To</span>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px' }}>{receipt.customerName}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{receipt.address}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Items Summary</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                {receipt.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {item.name} <span style={{ color: 'var(--text-muted)' }}>x {item.quantity}</span>
                    </span>
                    <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>${receipt.subtotal.toFixed(2)}</span>
              </div>
              
              {receipt.discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--success)' }}>
                  <span>Discounts Applied:</span>
                  <span>-${receipt.discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', paddingTop: '4px' }}>
                <span>Final Amount Charged:</span>
                <span style={{ color: 'var(--accent-neon)' }}>${receipt.total.toFixed(2)}</span>
              </div>
            </div>

          </div>

          <button 
            onClick={onCancel}
            className="btn-primary"
            style={{ padding: '12px 30px' }}
          >
            <Sparkles size={16} />
            <span>Continue Shopping</span>
          </button>

        </div>
      )}

    </div>
  );
}
