import React, { useState, useMemo } from 'react';
import { DollarSign, ShoppingBag, BarChart3, AlertCircle, Plus, Eye, Edit3, Trash2, X, PlusCircle, CheckCircle, Package } from 'lucide-react';

export default function SellerDashboard({ products, orders, onAddProduct, onUpdateProduct, onDeleteProduct, onUpdateOrderStatus }) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'inventory'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State for Adding/Editing Product
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    discount: '0',
    image: '',
    description: '',
    specs: '',
    stock: ''
  });

  // Calculate Analytical Metrics dynamically
  const metrics = useMemo(() => {
    const totalRev = orders.reduce((sum, ord) => sum + ord.total, 0);
    const avgOrderVal = orders.length ? totalRev / orders.length : 0;
    const lowStockCount = products.filter(p => p.stock < 10).length;

    return {
      revenue: totalRev,
      ordersCount: orders.length,
      averageValue: avgOrderVal,
      lowStock: lowStockCount
    };
  }, [orders, products]);

  // Handler for adding/updating products
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Parse specs from lines
    const parsedSpecs = productForm.specs
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const priceNum = Number(productForm.price);
    const discountNum = Number(productForm.discount);
    const stockNum = Number(productForm.stock);

    const productPayload = {
      name: productForm.name,
      category: productForm.category,
      price: priceNum,
      discount: discountNum,
      image: productForm.image || '/headphones.jpg', // fallback image
      description: productForm.description,
      specs: parsedSpecs.length ? parsedSpecs : ['Premium Quality Product'],
      stock: stockNum,
      rating: editingProduct ? editingProduct.rating : 5.0,
      ratingCount: editingProduct ? editingProduct.ratingCount : 0
    };

    if (editingProduct) {
      onUpdateProduct({ ...editingProduct, ...productPayload });
      setEditingProduct(null);
    } else {
      onAddProduct({
        ...productPayload,
        id: Date.now() // temporary unique ID
      });
    }

    // Reset Form & Close Modal
    setProductForm({
      name: '',
      category: 'Electronics',
      price: '',
      discount: '0',
      image: '',
      description: '',
      specs: '',
      stock: ''
    });
    setShowAddModal(false);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      discount: product.discount.toString(),
      image: product.image,
      description: product.description,
      specs: product.specs.join('\n'),
      stock: product.stock.toString()
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = (productId) => {
    if (confirm("Are you sure you want to delete this product? It will be removed from the catalog.")) {
      onDeleteProduct(productId);
    }
  };

  // Mock Sales Graph SVG calculations
  const salesGraphData = [240, 320, 180, 480, 520, 390, 620]; // 7 days of sales
  const graphPoints = salesGraphData.map((val, idx) => {
    const x = 50 + idx * 80;
    const y = 200 - (val / 700) * 150; // map value to SVG coordinates
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="seller-dashboard animate-fade-in" style={{ padding: '20px 0' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Seller Hub</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor inventory statistics and order processing analytics.</p>
        </div>

        <button 
          onClick={() => {
            setEditingProduct(null);
            setProductForm({
              name: '',
              category: 'Electronics',
              price: '',
              discount: '0',
              image: '',
              description: '',
              specs: '',
              stock: ''
            });
            setShowAddModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Analytics KPI Matrix Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        {/* Total Revenue */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Revenue</span>
            <h3 style={{ fontSize: '1.5rem', marginTop: '4px' }}>${metrics.revenue.toFixed(2)}</h3>
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--info)', borderRadius: '12px' }}>
            <ShoppingBag size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Orders Fulfilled</span>
            <h3 style={{ fontSize: '1.5rem', marginTop: '4px' }}>{metrics.ordersCount}</h3>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '12px' }}>
            <BarChart3 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Avg. Order Size</span>
            <h3 style={{ fontSize: '1.5rem', marginTop: '4px' }}>${metrics.averageValue.toFixed(2)}</h3>
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="glass-panel" style={{ 
          padding: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          border: metrics.lowStock > 0 ? '1px solid rgba(239, 68, 68, 0.25)' : '1px solid var(--border-color)',
          background: metrics.lowStock > 0 ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-glass)'
        }}>
          <div style={{ 
            padding: '12px', 
            background: metrics.lowStock > 0 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)', 
            color: metrics.lowStock > 0 ? 'var(--danger)' : 'var(--text-secondary)', 
            borderRadius: '12px' 
          }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Low Stock Items</span>
            <h3 style={{ 
              fontSize: '1.5rem', 
              marginTop: '4px',
              color: metrics.lowStock > 0 ? 'var(--danger)' : 'var(--text-primary)'
            }}>{metrics.lowStock}</h3>
          </div>
        </div>

      </div>

      {/* Graphical sales trend overview & Navigation */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', marginBottom: '32px' }}>
        
        {/* Graphical Representation Card */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Weekly Sales Performance</h3>
          
          <div style={{ position: 'relative', width: '100%', height: '220px', display: 'flex', justifyContent: 'center' }}>
            <svg style={{ width: '100%', height: '100%' }}>
              {/* Grid Lines */}
              <line x1="50" y1="50" x2="530" y2="50" stroke="rgba(255,255,255,0.05)" />
              <line x1="50" y1="125" x2="530" y2="125" stroke="rgba(255,255,255,0.05)" />
              <line x1="50" y1="200" x2="530" y2="200" stroke="rgba(255,255,255,0.1)" />

              {/* Glowing gradient path */}
              <defs>
                <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area Under Graph */}
              <polygon 
                points={`50,200 ${graphPoints} 530,200`} 
                fill="url(#glowGrad)" 
              />

              {/* Line graph */}
              <polyline
                fill="none"
                stroke="var(--accent-neon)"
                strokeWidth="3"
                points={graphPoints}
              />

              {/* Interactive Point highlights */}
              {salesGraphData.map((val, idx) => {
                const x = 50 + idx * 80;
                const y = 200 - (val / 700) * 150;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="var(--primary-glow)" stroke="#fff" strokeWidth="1.5" />
                    <text x={x} y={y - 12} fill="var(--text-secondary)" fontSize="0.75rem" textAnchor="middle" fontWeight="bold">
                      ${val}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Labels */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <text key={idx} x={50 + idx * 80} y="218" fill="var(--text-muted)" fontSize="0.8rem" textAnchor="middle">
                  {day}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Right Dashboard navigation controls list */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Manage Workflows</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Switch tab contexts below to process customer order states or manage active product information.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              className="btn-secondary"
              style={{
                justifyContent: 'flex-start',
                padding: '14px 20px',
                border: activeTab === 'orders' ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                background: activeTab === 'orders' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                color: activeTab === 'orders' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <Package size={18} style={{ color: 'var(--accent-neon)' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Customer Orders</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Fulfill orders, change status to shipping.</p>
              </div>
            </button>

            <button 
              onClick={() => setActiveTab('inventory')}
              className="btn-secondary"
              style={{
                justifyContent: 'flex-start',
                padding: '14px 20px',
                border: activeTab === 'inventory' ? '1px solid var(--primary-glow)' : '1px solid var(--border-color)',
                background: activeTab === 'inventory' ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
                color: activeTab === 'inventory' ? '#fff' : 'var(--text-secondary)'
              }}
            >
              <Package size={18} style={{ color: 'var(--accent-neon)' }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Inventory Manager</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Add, edit details, set discounts or restock count.</p>
              </div>
            </button>
          </div>
        </div>

      </div>

      {/* DATA TABLES SECTION */}
      <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
        
        {/* ORDERS MANAGEMENT TABLE */}
        {activeTab === 'orders' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Active Customer Orders ({orders.length})</h3>
            
            {orders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', padding: '20px 0', textAlign: 'center', fontStyle: 'italic' }}>
                No customer orders recorded yet.
              </p>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <th style={{ padding: '12px 8px' }}>Order ID</th>
                    <th style={{ padding: '12px 8px' }}>Customer</th>
                    <th style={{ padding: '12px 8px' }}>Items</th>
                    <th style={{ padding: '12px 8px' }}>Amount Paid</th>
                    <th style={{ padding: '12px 8px' }}>Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    // Status styling dictionary
                    const statusColors = {
                      Pending: { bg: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' },
                      Processing: { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--info)' },
                      Shipped: { bg: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-neon)' },
                      Delivered: { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }
                    };
                    const badge = statusColors[order.status] || { bg: 'rgba(255,255,255,0.05)', color: '#fff' };

                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                        <td style={{ padding: '16px 8px', fontWeight: 600, color: 'var(--accent-neon)' }}>
                          {order.id}
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <div>
                            <p style={{ fontWeight: 600 }}>{order.customerName}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.email}</span>
                          </div>
                        </td>
                        <td style={{ padding: '16px 8px', color: 'var(--text-secondary)' }}>
                          {order.items.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                        </td>
                        <td style={{ padding: '16px 8px', fontWeight: 700 }}>
                          ${order.total.toFixed(2)}
                        </td>
                        <td style={{ padding: '16px 8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              fontSize: '0.8rem', 
                              fontWeight: 600, 
                              background: badge.bg, 
                              color: badge.color 
                            }}>
                              {order.status}
                            </span>
                            
                            {/* Update Status Dropdown */}
                            <select
                              value={order.status}
                              onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                              style={{ 
                                padding: '4px 8px', 
                                fontSize: '0.8rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* INVENTORY MANAGEMENT TABLE */}
        {activeTab === 'inventory' && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Product Catalog Inventory ({products.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px 8px' }}>Thumbnail</th>
                  <th style={{ padding: '12px 8px' }}>Product Details</th>
                  <th style={{ padding: '12px 8px' }}>Price (Discount)</th>
                  <th style={{ padding: '12px 8px' }}>Stock Qty</th>
                  <th style={{ padding: '12px 8px' }}>Rating</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const finalVal = product.discount 
                    ? product.price * (1 - product.discount / 100) 
                    : product.price;

                  return (
                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', background: '#151c2c', border: '1px solid var(--border-color)' }}>
                          <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <div>
                          <p style={{ fontWeight: 600 }}>{product.name}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: {product.category}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 700 }}>${finalVal.toFixed(2)}</span>
                          {product.discount > 0 && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--success)', background: 'rgba(16,185,129,0.1)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ 
                          fontWeight: 600, 
                          color: product.stock < 10 ? 'var(--danger)' : 'var(--text-primary)' 
                        }}>
                          {product.stock} units
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ★ {product.rating} <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({product.ratingCount})</span>
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          
                          <button
                            onClick={() => handleEditClick(product)}
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '4px',
                              color: 'var(--text-primary)',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'var(--transition-smooth)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-glow)'}
                            onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                          >
                            <Edit3 size={14} />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.05)',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              borderRadius: '4px',
                              color: 'var(--danger)',
                              padding: '6px 10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'var(--transition-smooth)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* ADD / EDIT PRODUCT MODAL OVERLAY */}
      {showAddModal && (
        <div className="animate-fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          
          {/* Backdrop overlay */}
          <div 
            onClick={() => setShowAddModal(false)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(5, 7, 12, 0.75)',
              backdropFilter: 'blur(5px)'
            }}
          />

          {/* Modal Container */}
          <div 
            className="glass-panel"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '540px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              border: '1px solid var(--border-glow)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
            }}
          >
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
              <h3 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={20} style={{ color: 'var(--accent-neon)' }} />
                {editingProduct ? 'Edit Product Details' : 'Add New Inventory Product'}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Product Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. HyperGlide Mouse"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Category</label>
                  <select 
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Stock Qty</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 15"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                    required
                  />
                </div>

              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Price ($ USD)</label>
                  <input 
                    type="number" 
                    placeholder="299.99"
                    step="0.01"
                    min="0.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                    required
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Discount (%)</label>
                  <input 
                    type="number" 
                    placeholder="15"
                    min="0"
                    max="90"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({...productForm, discount: e.target.value})}
                  />
                </div>

              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Image URL / Asset Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. /headphones.jpg (leave blank for default)"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Detailed Description</label>
                <textarea 
                  rows="3" 
                  placeholder="Detailed specifications and highlights..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Bullet Specifications (One per line)</label>
                <textarea 
                  rows="3" 
                  placeholder="e.g. Ultra high speed sensor&#10;Li-Ion Rechargeable Battery&#10;5 Button design"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({...productForm, specs: e.target.value})}
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '20px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
