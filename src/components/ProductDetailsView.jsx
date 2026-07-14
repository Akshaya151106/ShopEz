import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Star, ShoppingCart, Send, User, Calendar, ShieldCheck, Lock, Clock } from 'lucide-react';

export default function ProductDetailsView({ product, reviews, currentUser, onBack, onAddToCart, onAddReview, onTriggerAuth }) {
  const [authorName, setAuthorName] = useState('');
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [formError, setFormError] = useState('');

  // --- Real-time Countdown Timer State ---
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 14, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format single digit numbers to double digits
  const formatTime = (num) => String(num).padStart(2, '0');

  // Automatically sync logged-in name to review author field
  useEffect(() => {
    if (currentUser) {
      setAuthorName(currentUser.fullName);
    } else {
      setAuthorName('');
    }
  }, [currentUser]);

  // Reset gallery index when product changes
  useEffect(() => {
    setMainImageIndex(0);
  }, [product]);

  const productReviews = useMemo(() => {
    return reviews.filter(r => r.productId === product.id);
  }, [reviews, product.id]);

  const reviewBreakdown = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    productReviews.forEach(r => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    
    const total = productReviews.length || 1;
    return Object.keys(counts).reduce((acc, score) => {
      acc[score] = {
        count: counts[score],
        percentage: Math.round((counts[score] / total) * 100)
      };
      return acc;
    }, {});
  }, [productReviews]);

  const finalPrice = product.discount 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      onTriggerAuth();
      return;
    }
    if (!authorName.trim() || !reviewComment.trim()) {
      setFormError('Please fill out all fields.');
      return;
    }
    
    setFormError('');
    const newReview = {
      productId: product.id,
      author: authorName.trim(),
      rating: ratingInput,
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(newReview);
    setReviewComment('');
  };

  return (
    <div className="product-details-container animate-fade-in" style={{ padding: '20px 0' }}>
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="btn-text" 
        style={{ marginBottom: '24px', fontSize: '1rem', fontWeight: 500 }}
      >
        <ArrowLeft size={18} />
        <span>Back to catalog</span>
      </button>

      {/* Main Details Panel */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          
          {/* Left Column: Image */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ 
                borderRadius: 'var(--radius-md)', 
                overflow: 'hidden', 
                background: '#151c2c',
                border: '1px solid var(--border-color)',
                position: 'relative',
                paddingTop: '80%'
              }}>
                <img 
                  src={(product.images && product.images[mainImageIndex]) || product.image} 
                  alt={product.name} 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                  onError={(e) => { e.target.onerror = null; e.target.src = product.image || '/headphones.jpg'; }}
                />
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImageIndex(i)}
                      style={{
                        border: i === mainImageIndex ? `2px solid var(--primary-glow)` : `1px solid var(--border-color)`,
                        padding: 0,
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <img src={img} alt={`thumb-${i}`} style={{ width: 72, height: 56, objectFit: 'cover', display: 'block' }} onError={(e) => { e.target.onerror = null; e.target.src = product.image || '/headphones.jpg'; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)'
            }}>
              <ShieldCheck style={{ color: 'var(--success)' }} />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>ShopEZ Guarantee</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Secure checkout, fast shipping & 30-day return policy.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Info & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ 
                color: 'var(--accent-neon)', 
                fontSize: '0.85rem', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em' 
              }}>
                {product.category}
              </span>
              
              <h2 style={{ fontSize: '2.2rem', margin: '8px 0 16px 0', lineHeight: '1.2' }}>{product.name}</h2>
              
              {/* Product Rating Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', color: 'var(--warning)' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
                <span style={{ fontSize: '1rem', fontWeight: 700 }}>{product.rating}</span>
                <span style={{ color: 'var(--text-muted)' }}>|</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{productReviews.length} Verified Reviews</span>
              </div>

              {/* Ticking Countdown Flash Sale Timer Widget */}
              {product.discount > 0 && (
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(219, 39, 119, 0.15) 100%)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px'
                }}>
                  <Clock size={16} className="pulse-indicator" style={{ color: 'var(--danger)', borderRadius: '50%' }} />
                  <span>FLASH OFFER: Ends in</span>
                  <span style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                    {formatTime(timeLeft.hours)}h : {formatTime(timeLeft.minutes)}m : {formatTime(timeLeft.seconds)}s
                  </span>
                </div>
              )}

              {/* Price & Discounts Block */}
              <div className="glass-panel" style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.2)', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Price</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: product.discount ? 'var(--accent-neon)' : 'var(--text-primary)' }}>
                      ${finalPrice.toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {product.discount > 0 && (
                  <div style={{ 
                    background: 'var(--primary-gradient)', 
                    color: '#fff', 
                    borderRadius: '20px', 
                    padding: '6px 14px', 
                    fontWeight: 700, 
                    fontSize: '0.85rem',
                    boxShadow: '0 4px 12px rgba(219,39,119,0.3)' 
                  }}>
                    Save {product.discount}% Today
                  </div>
                )}
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
                {product.description}
              </p>

              {/* Specs Bullets */}
              {Array.isArray(product.specs) && product.specs.length > 0 ? (
                <div style={{ marginBottom: '28px' }}>
                  <h4 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Specifications</h4>
                  <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {product.specs.map((spec, i) => (
                      <li key={i} style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{spec}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* Cart Actions & Stock level */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Availability</span>
                <p style={{ marginTop: '4px' }}>
                  {product.stock > 0 ? (
                    <span style={{ color: product.stock < 10 ? 'var(--warning)' : 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: product.stock < 10 ? 'var(--warning)' : 'var(--success)' }}></span>
                      {product.stock} units in stock {product.stock < 10 && "(Low stock!)"}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Out of Stock</span>
                  )}
                </p>
              </div>

              {product.stock > 0 ? (
                <button 
                  onClick={() => onAddToCart(product)}
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '1.05rem' }}
                >
                  <ShoppingCart size={18} />
                  <span>Add to Shopping Cart</span>
                </button>
              ) : (
                <button 
                  disabled
                  className="btn-secondary"
                  style={{ opacity: 0.5, cursor: 'not-allowed', padding: '12px 28px' }}
                >
                  Out of Stock
                </button>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Reviews & Feedback Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        
        {/* Left Sub-column: Review Metrics & breakdown */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Customer Rating Summary</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '3rem', color: 'var(--accent-neon)' }}>{product.rating}</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>out of 5.0</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', color: 'var(--warning)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} 
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Based on {productReviews.length} reviews</span>
            </div>
          </div>

          {/* Breakdowns Progress bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[5, 4, 3, 2, 1].map(stars => {
              const row = reviewBreakdown[stars] || { count: 0, percentage: 0 };
              return (
                <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                  <span style={{ width: '45px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {stars} <Star size={12} fill="currentColor" style={{ color: 'var(--warning)' }} />
                  </span>
                  <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${row.percentage}%`, 
                      height: '100%', 
                      background: 'var(--primary-gradient)',
                      borderRadius: '4px'
                    }}></div>
                  </div>
                  <span style={{ width: '35px', textAlign: 'right', color: 'var(--text-muted)' }}>{row.percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sub-column: Add Review & Review List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Write a Review form */}
          <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
            
            {!currentUser && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(11, 16, 27, 0.85)',
                backdropFilter: 'blur(4px)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
                zIndex: 10
              }}>
                <Lock size={32} style={{ color: 'var(--accent-neon)', marginBottom: '12px' }} />
                <h4 style={{ marginBottom: '8px' }}>Reviews Restricted</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '240px' }}>
                  You must be signed in to submit product feedback.
                </p>
                <button onClick={onTriggerAuth} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Sign In / Register
                </button>
              </div>
            )}

            <h3 style={{ marginBottom: '16px' }}>Share Your Experience</h3>
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Your Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  value={authorName} 
                  onChange={(e) => setAuthorName(e.target.value)} 
                  required
                  disabled={!!currentUser} 
                  style={{ opacity: currentUser ? 0.75 : 1 }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Rating</label>
                <div style={{ display: 'flex', gap: '8px', color: 'var(--warning)' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', color: 'inherit' }}
                    >
                      <Star 
                        size={24} 
                        fill={(hoverRating || ratingInput) >= star ? 'currentColor' : 'none'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Review details</label>
                <textarea 
                  rows="3" 
                  placeholder="What did you like or dislike? How's the product quality?"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>

              {formError && (
                <span style={{ fontSize: '0.85rem', color: 'var(--danger)', fontWeight: 500 }}>{formError}</span>
              )}

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                <Send size={15} />
                <span>Submit Review</span>
              </button>

            </form>
          </div>

          {/* List of reviews */}
          <div className="glass-panel" style={{ padding: '24px', flex: 1 }}>
            <h3 style={{ marginBottom: '20px' }}>Review Feed ({productReviews.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '400px', overflowY: 'auto', paddingRight: '6px' }}>
              
              {productReviews.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center', padding: '20px 0' }}>
                  No reviews yet. Be the first to review this product!
                </p>
              ) : (
                productReviews.map((review) => (
                  <div key={review.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          background: 'rgba(255,255,255,0.05)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: 'var(--accent-neon)',
                          border: '1px solid var(--border-color)'
                        }}>
                          <User size={15} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{review.author}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={11} /> {review.date}
                          </span>
                        </div>
                      </div>

                      {/* Review stars */}
                      <div style={{ display: 'flex', color: 'var(--warning)' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < review.rating ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>

                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', paddingLeft: '40px' }}>
                      {review.comment}
                    </p>
                  </div>
                ))
              )}

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
