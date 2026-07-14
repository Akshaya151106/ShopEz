import React, { useState, useMemo } from 'react';
import { Star, ShoppingCart, ArrowUpDown, Percent } from 'lucide-react';

export default function CatalogView({ products, searchQuery, onSelectProduct, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(500); // Max budget slider

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const finalPrice = product.discount 
          ? product.price * (1 - product.discount / 100) 
          : product.price;

        const matchesPrice = finalPrice <= priceRange;

        return matchesCategory && matchesSearch && matchesPrice;
      })
      .sort((a, b) => {
        const getFinalPrice = (p) => p.discount ? p.price * (1 - p.discount / 100) : p.price;
        
        if (sortBy === 'price-asc') {
          return getFinalPrice(a) - getFinalPrice(b);
        }
        if (sortBy === 'price-desc') {
          return getFinalPrice(b) - getFinalPrice(a);
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'discount') {
          return (b.discount || 0) - (a.discount || 0);
        }
        return a.id - b.id; // Featured
      });
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  // Helper for tag colors
  const getTagStyle = (tag) => {
    switch (tag) {
      case 'BESTSELLER':
        return { background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)', color: '#fff', boxShadow: '0 4px 10px rgba(124, 58, 237, 0.4)' };
      case 'HOT DEAL':
        return { background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)', color: '#fff', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' };
      case 'NEW RELEASE':
        return { background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', color: '#fff', boxShadow: '0 4px 10px rgba(6, 182, 212, 0.4)' };
      case 'TRENDING':
        return { background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', boxShadow: '0 4px 10px rgba(236, 72, 153, 0.4)' };
      case 'EXCLUSIVE':
        return { background: 'linear-gradient(135deg, #eab308 0%, #d97706 100%)', color: '#000', fontWeight: 800, boxShadow: '0 4px 10px rgba(234, 179, 8, 0.4)' };
      default:
        return { background: 'rgba(255,255,255,0.1)', color: '#fff' };
    }
  };

  return (
    <div className="catalog-container animate-fade-in" style={{ padding: '24px 0' }}>
      
      {/* Category Pills & Filters Panel */}
      <div className="filters-panel glass-panel" style={{ padding: '20px', marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Category Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Browse Categories
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  borderRadius: '30px',
                  fontSize: '0.9rem',
                  border: selectedCategory === cat ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'var(--primary-gradient)' : 'rgba(255,255,255,0.03)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-primary)',
                  boxShadow: selectedCategory === cat ? '0 4px 12px rgba(var(--primary-glow-rgb), 0.2)' : 'none'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sorting and Price Range Slider */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', alignItems: 'center' }}>
          
          {/* Price Range Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Max Price:</span>
              <span style={{ color: 'var(--accent-neon)', fontWeight: 700 }}>${priceRange.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={priceRange} 
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{
                accentColor: 'var(--primary-glow)',
                width: '100%',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* Sort By Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Sort Products:</span>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ArrowUpDown size={16} style={{ position: 'absolute', left: '12px', color: 'var(--text-secondary)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '38px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="discount">Biggest Savings</option>
              </select>
            </div>
          </div>

        </div>

      </div>

      {/* Catalog Results Grid */}
      {filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '10px' }}>No products found</h3>
          <p>Try modifying your search keywords, category filter, or price budget slider.</p>
        </div>
      ) : (
        <div className="grid-catalog">
          {filteredProducts.map((product, idx) => {
            const hasDiscount = product.discount > 0;
            const finalPrice = hasDiscount 
              ? product.price * (1 - product.discount / 100) 
              : product.price;

            const badgeStyles = getTagStyle(product.tag);

            return (
              <div 
                key={product.id} 
                className="glass-panel glass-panel-hover animate-slide-up"
                style={{ 
                  overflow: 'hidden', 
                  display: 'flex', 
                  flexDirection: 'column',
                  animationDelay: `${idx * 0.04}s`
                }}
              >
                
                {/* Product Image Section */}
                <div 
                  onClick={() => onSelectProduct(product)}
                  className="product-image"
                  style={{ 
                    position: 'relative', 
                    width: '100%', 
                    paddingTop: '75%', 
                    cursor: 'pointer',
                    background: '#131924',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={(product.images && product.images[0]) || product.image} 
                    alt={product.name}
                    className="primary"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.6s ease'
                    }}
                    onError={(e) => { e.target.onerror = null; e.target.src = product.image || '/headphones.jpg'; }}
                  />

                  {product.images && product.images[1] && (
                    <img
                      src={product.images[1]}
                      alt={`${product.name} alt`}
                      className="secondary"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'opacity 0.5s ease, transform 0.6s ease',
                        opacity: 0
                      }}
                      onError={(e) => { e.target.onerror = null; e.target.src = product.image || '/headphones.jpg'; }}
                    />
                  )}

                  {/* Promo Code Badges (BESTSELLER, HOT DEAL, etc) */}
                  {product.tag && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '30px',
                      letterSpacing: '0.05em',
                      zIndex: 2,
                      ...badgeStyles
                    }}>
                      {product.tag}
                    </div>
                  )}

                  {/* Discount Badge */}
                  {hasDiscount && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'var(--primary-gradient)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 4px 10px rgba(219, 39, 119, 0.4)',
                      zIndex: 2
                    }}>
                      <Percent size={11} />
                      <span>{product.discount}% OFF</span>
                    </div>
                  )}

                  {/* Category Overlay */}
                  <span style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(11, 15, 25, 0.8)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    zIndex: 2
                  }}>
                    {product.category}
                  </span>
                </div>

                {/* Product Meta Section */}
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 2 }}>
                  
                  <div>
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      style={{ 
                        fontSize: '1.15rem', 
                        marginBottom: '8px', 
                        cursor: 'pointer',
                        lineHeight: '1.3',
                        color: 'var(--text-primary)',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent-neon)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    >
                      {product.name}
                    </h3>

                    {/* Stars and rating counts */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', color: 'var(--warning)' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{product.rating}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>({product.ratingCount})</span>
                    </div>
                  </div>

                  <div>
                    {/* Price and Add button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {hasDiscount && (
                          <span style={{ textDecoration: 'line-through', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                        <span style={{ fontSize: '1.35rem', fontWeight: 700, color: hasDiscount ? 'var(--accent-neon)' : 'var(--text-primary)' }}>
                          ${finalPrice.toFixed(2)}
                        </span>
                      </div>

                      {product.stock > 0 ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(product);
                          }}
                          className="btn-primary"
                          style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}
                        >
                          <ShoppingCart size={15} />
                          <span>Add</span>
                        </button>
                      ) : (
                        <span style={{ 
                          fontSize: '0.85rem', 
                          fontWeight: 600, 
                          color: 'var(--danger)',
                          padding: '6px 12px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: 'var(--radius-sm)'
                        }}>
                          Out of stock
                        </span>
                      )}

                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
