import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Install: npm install framer-motion
import "../styles/ProductDetails.css";
import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Install: npm install react-icons
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart, addToWishlist, cart, wishlist } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
    useEffect(() => {
    const exists = wishlist.some(
      (item) => item.productId === product.id
    );
    setIsWishlisted(exists);
  }, [wishlist, product.id]);

  if (!product) {
    return (
      <div className="not-found-container">
        <h2>Product not found</h2>
        <button className="back-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>
      </div>
    );
  }

  const handleBuyNow = () => {
    navigate(`/checkout/${product.id}?quantity=${quantity}`);
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleShare = () => {
    navigator.share?.({
      title: product.name,
      text: product.description,
      url: window.location.href,
    }).catch(() => {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => {
          const index = i + 1;
          if (index <= Math.floor(rating)) {
            return <BsStarFill key={i} className="star-icon filled" />;
          } else if (index === Math.ceil(rating) && rating % 1 !== 0) {
            return <BsStarHalf key={i} className="star-icon half-filled" />;
          } else {
            return <BsStar key={i} className="star-icon empty" />;
          }
        })}
      </div>
    );
  };

  const productImages = [
    product.image,
    product.image, // In real app, use different images
    product.image,
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="product-details-page"
    >
      <button className="back-nav-btn" onClick={() => navigate(-1)}>
        <FiChevronLeft /> Back
      </button>

      <div className="product-details-container">
        {/* Left Column - Images */}
        <div className="image-section">
          <div className="main-image-wrapper">
            <img 
              src={productImages[selectedImage]} 
              alt={product.name}
              className="main-image"
            />
            {product.discount && (
              <span className="discount-badge">-{product.discount}%</span>
            )}
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => setIsWishlisted(!isWishlisted)}
            >
              <FiHeart />
            </button>
          </div>

          <div className="thumbnail-container">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`View ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Middle Column - Product Info */}
        <div className="product-info-section">
          <div className="breadcrumb">
            Home / {product.category} / <span>{product.name}</span>
          </div>

          <h1 className="product-title">{product.name}</h1>

          <div className="rating-section">
            <div className="rating-display">
              {renderStars(product.rating)}
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              <span className="reviews">(1,234 reviews)</span>
            </div>
            <div className="share-btn" onClick={handleShare}>
              <FiShare2 /> Share
            </div>
          </div>

          <div className="price-section">
            <span className="current-price">₹{product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
            )}
            {product.discount && (
              <span className="discount-text">{product.discount}% OFF</span>
            )}
          </div>

          <div className="delivery-info">
            <div className="info-card">
              <span className="info-icon">🚚</span>
              <div>
                <h4>Free Delivery</h4>
                <p>Delivered in 2-3 business days</p>
              </div>
            </div>
            <div className="info-card">
              <span className="info-icon">🔄</span>
              <div>
                <h4>Easy Returns</h4>
                <p>30-day return policy</p>
              </div>
            </div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="specifications">
            <h3>Specifications</h3>
            <div className="spec-grid">
              <div className="spec-item">
                <span className="spec-label">Brand</span>
                <span className="spec-value">{product.brand || "Brand Name"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Color</span>
                <span className="spec-value">{product.color || "Multiple"}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Warranty</span>
                <span className="spec-value">1 Year</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Purchase Options */}
        <div className="purchase-section">
          <div className="card">
            <h3>Purchase Options</h3>
            
            <div className="quantity-selector">
              <label>Quantity</label>
              <div className="quantity-control">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  –
                </button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="total-price">
              <span>Total:</span>
              <span className="total-amount">₹{(product.price * quantity).toLocaleString()}</span>
            </div>

            <div className="button-group">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                <FiShoppingCart /> Buy Now
              </motion.button>
              
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

            <div className="payment-methods">
              <p>Secure payment with</p>
              <div className="payment-icons">
                <span>💳</span>
                <span>🏦</span>
                <span>📱</span>
                <span>🔒</span>
              </div>
            </div>

            <div className="trust-badges">
              <div className="badge">
                <span>🔒</span>
                <span>Secure</span>
              </div>
              <div className="badge">
                <span>✓</span>
                <span>Genuine</span>
              </div>
              <div className="badge">
                <span>🚚</span>
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="related-products">
        <h2>You might also like</h2>
        <div className="related-grid">
          {/* Map through related products here */}
          <div className="related-card">
            <img src={product.image} alt="Related" />
            <h4>Similar Product</h4>
            <p>₹{Math.round(product.price * 0.8)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductDetails;