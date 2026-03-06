import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/wishlist.css";

const Wishlist = () => {
  const { wishlist, cart, removeFromWishlist, moveToCart } = useCart();
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();
  
  const isInCart = (item) => {
    return cart.some(c => c.id === item.productId);
  };

  // Filter wishlist items
  const filteredWishlist = wishlist.filter(item => {
    if (activeFilter === "in-stock") return item.stock;
    if (activeFilter === "out-of-stock") return !item.stock;
    return true;
  });

  // Calculate total savings
  const totalSavings = wishlist.reduce((total, item) => {
    if (item.originalPrice) {
      return total + (item.originalPrice - item.price);
    }
    return total;
  }, 0);

  // Function to handle quick preview
  const handleQuickPreview = (item) => {
    const productId = item.productId || item.id;
    navigate(`/product/${productId}`, {
      state: { product: item }
    });
  };


  // Function to handle explore recommendation
  const handleExploreRecommendation = () => {
    navigate("/products");
  };

  return (
    <div className="dream-wishlist">
      {/* Animated Background Elements */}
      <div className="dream-bg-elements">
        <div className="dream-circle dream-circle-1"></div>
        <div className="dream-circle dream-circle-2"></div>
        <div className="dream-circle dream-circle-3"></div>
        <div className="dream-heart-shape"></div>
      </div>

      <div className="dream-container">
        {/* Header Section with Stats */}
        <header className="dream-header">
          <div className="dream-header-content">
            <div className="dream-header-icon">
              <i className="bi bi-hearts dream-icon-main"></i>
            </div>
            <h1 className="dream-title">
              <span className="dream-title-gradient">My Dream List</span>
              <span className="dream-subtitle">Curate Your Desires</span>
            </h1>
            <div className="dream-stats">
              <div className="dream-stat-card">
                <div className="dream-stat-number">{wishlist.length}</div>
                <div className="dream-stat-label">Dream Items</div>
              </div>
              <div className="dream-stat-card">
                <div className="dream-stat-number">₹{totalSavings.toLocaleString()}</div>
                <div className="dream-stat-label">Total Savings</div>
              </div>
              <div className="dream-stat-card">
                <div className="dream-stat-number">
                  {wishlist.filter(item => item.stock).length}
                </div>
                <div className="dream-stat-label">Ready to Own</div>
              </div>
            </div>
          </div>
        </header>

        {/* Filter Section */}
        {wishlist.length > 0 && (
          <div className="dream-filters">
            <div className="dream-filter-buttons">
              <button 
                className={`dream-filter-btn ${activeFilter === "all" ? "dream-filter-active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Dreams ({wishlist.length})
              </button>
              <button 
                className={`dream-filter-btn ${activeFilter === "in-stock" ? "dream-filter-active" : ""}`}
                onClick={() => setActiveFilter("in-stock")}
              >
                <i className="bi bi-check-circle me-2"></i>
                Available ({wishlist.filter(item => item.stock).length})
              </button>
              <button 
                className={`dream-filter-btn ${activeFilter === "out-of-stock" ? "dream-filter-active" : ""}`}
                onClick={() => setActiveFilter("out-of-stock")}
              >
                <i className="bi bi-clock me-2"></i>
                Coming Soon ({wishlist.filter(item => !item.stock).length})
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="dream-main-content">
          {wishlist.length === 0 ? (
            /* Empty State */
            <div className="dream-empty-state">
              <div className="dream-empty-animation">
                <i className="bi bi-hearts dream-empty-icon"></i>
                <div className="dream-empty-hearts">
                  <i className="bi bi-heart-fill dream-heart-float-1"></i>
                  <i className="bi bi-heart-fill dream-heart-float-2"></i>
                  <i className="bi bi-heart-fill dream-heart-float-3"></i>
                </div>
              </div>
              <div className="dream-empty-text">
                <h2 className="dream-empty-title">Your Dream List Awaits</h2>
                <p className="dream-empty-description">
                  Capture your heart's desires. Every item you love finds its home here, 
                  waiting for the perfect moment to become yours.
                </p>
                <div className="dream-empty-actions">
                  <button 
                    className="dream-btn dream-btn-primary dream-btn-glow"
                    onClick={() => navigate("/products")}
                  >
                    <i className="bi bi-compass me-2"></i>
                    Begin Your Journey
                  </button>
                  <button 
                    className="dream-btn dream-btn-outline"
                    onClick={() => navigate("/trending")}
                  >
                    <i className="bi bi-fire me-2"></i>
                    Explore Trends
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Wishlist Grid */
            <div className="dream-grid">
              {filteredWishlist.map((item) => (
                <div 
                  className="dream-card-wrapper"
                  key={item._id}
                  onMouseEnter={() => setHoveredItem(item._id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className={`dream-card ${hoveredItem === item._id ? "dream-card-hover" : ""}`}>
                    {/* Card Badge */}
                    <div className="dream-card-badge">
                      <span className={`dream-badge ${item.stock ? "dream-badge-success" : "dream-badge-waiting"}`}>
                        {item.stock ? "Ready Now" : "Coming Soon"}
                      </span>
                      {item.originalPrice && (
                        <span className="dream-badge dream-badge-discount">
                          -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button 
                      className="dream-remove-btn"
                      onClick={() => removeFromWishlist(item._id)}
                      aria-label="Remove from dream list"
                    >
                      <i className="bi bi-heartbreak-fill"></i>
                    </button>

                    {/* Product Image */}
                    <div className="dream-card-image">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="dream-image"
                        loading="lazy"
                      />
                      <div className="dream-image-overlay">
                        <span className="dream-category-tag">
                          <i className="bi bi-tag-fill me-1"></i>
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="dream-card-content">
                      <h3 className="dream-product-title">{item.name}</h3>
                      
                      <p className="dream-product-description">
                        {item.description || "Exceptional quality crafted for those who appreciate excellence."}
                      </p>

                      {/* Rating */}
                      <div className="dream-rating">
                        <div className="dream-stars">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i}
                              className={`bi bi-star${i < Math.floor(item.rating || 4) ? '-fill' : ''}`}
                            ></i>
                          ))}
                        </div>
                        <span className="dream-review-count">
                          {item.reviewCount || "12"} reviews
                        </span>
                      </div>

                      {/* Price Section */}
                      <div className="dream-price-section">
                        <div className="dream-price-current">
                          <span className="dream-currency">₹</span>
                          <span className="dream-price">{item.price.toLocaleString()}</span>
                          {item.oldPrice && item.oldPrice > item.price && (
                            <span className="dream-old-price strike">
                              ₹{item.oldPrice.toLocaleString()}
                            </span>
                          )}

                        </div>
                        {item.originalPrice && (
                          <div className="dream-price-original">
                            <span className="dream-original-text">was</span>
                            <span className="dream-original-price">₹{item.originalPrice.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="dream-card-actions">
                        {isInCart(item) ? (
                          <button className="dream-btn dream-btn-added" disabled>
                            <i className="bi bi-check-circle-fill me-2"></i>
                            In Your Cart
                          </button>
                        ) : item.stock ? (
                          <button
                            className="dream-btn dream-btn-action"
                            onClick={() => moveToCart(item)}
                          >
                            <i className="bi bi-bag-plus-fill me-2"></i>
                            Make It Yours
                          </button>
                        ) : (
                          <button className="dream-btn dream-btn-waitlist" disabled>
                            <i className="bi bi-bell-fill me-2"></i>
                            Notify Me
                          </button>
                        )}

                        {hoveredItem === item._id && (
                          <button 
                            className="dream-btn dream-btn-quickview"
                            onClick={() => handleQuickPreview(item)}
                          >
                            <i className="bi bi-eye-fill me-2"></i>
                            Quick Preview
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bulk Actions */}
          {wishlist.length > 0 && (
            <div className="dream-bulk-actions">
              <div className="dream-bulk-card">
                <div className="dream-bulk-header">
                  <i className="bi bi-magic dream-bulk-icon"></i>
                  <h3 className="dream-bulk-title">Dream List Magic</h3>
                </div>
                <div className="dream-bulk-content">
                  <p className="dream-bulk-text">
                    Transform all your dreams into reality at once
                  </p>
                  <div className="dream-bulk-buttons">
                    <button 
                      className="dream-btn dream-btn-bulk-primary"
                      onClick={() => {
                        const inStockItems = wishlist.filter(item => item.stock);
                        inStockItems.forEach(item => moveToCart(item));
                      }}
                    >
                      <i className="bi bi-sparkles me-2"></i>
                      Add Available to Cart
                    </button>
                    <button 
                      className="dream-btn dream-btn-bulk-secondary"
                      onClick={() => {
                        if(window.confirm("Release all items from your dream list?")) {
                          wishlist.forEach(item => removeFromWishlist(item._id));
                        }
                      }}
                    >
                      <i className="bi bi-wind me-2"></i>
                      Clear Dream List
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="dream-recommendations">
            <div className="dream-recommendations-header">
              <i className="bi bi-stars dream-recommendations-icon"></i>
              <h2 className="dream-recommendations-title">
                Dreams You Might Love
                <span className="dream-recommendations-subtitle">Inspired by your current selections</span>
              </h2>
            </div>
            <div className="dream-recommendations-grid">
              {[1, 2, 3, 4].map((_, index) => (
                <div className="dream-recommendation-card" key={index}>
                  <div className="dream-recommendation-image">
                    <i className="bi bi-gem dream-recommendation-placeholder"></i>
                  </div>
                  <div className="dream-recommendation-content">
                    <h4 className="dream-recommendation-title">Premium Selection</h4>
                    <p className="dream-recommendation-description">
                      Discover matching treasures
                    </p>
                    <button 
                      className="dream-btn dream-btn-recommendation"
                      onClick={handleExploreRecommendation}
                    >
                      <i className="bi bi-plus-circle me-1"></i>
                      Explore
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer Note */}
        <footer className="dream-footer">
          <div className="dream-footer-note">
            <i className="bi bi-info-circle dream-footer-icon"></i>
            <p className="dream-footer-text">
              Your dream list is saved securely and syncs across all your devices.
              Items remain here until you make them yours or choose to let them go.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Wishlist;