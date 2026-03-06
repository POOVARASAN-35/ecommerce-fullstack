import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductCard.css";

function ProductCard({ product, addToCart, addToWishlist }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    addToWishlist(product);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  // Check if product is on sale
  const isOnSale = product.originalPrice && product.price < product.originalPrice;
  const discount = isOnSale ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div 
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      {/* Product Image */}
      <div className="product-image-wrapper">
        <img 
          src={product.image} 
          alt={product.name}
          className="product-image"
        />
        
        {/* Sale Badge */}
        {isOnSale && (
          <div className="sale-badge">
            -{discount}%
          </div>
        )}
        
        {/* Only Add to Cart and Wishlist on hover */}
        <div className={`hover-actions ${isHovered ? 'visible' : ''}`}>
          <button 
            className="action-btn cart-btn"
            onClick={handleAddToCart}
          >
            <i className="bi bi-cart-plus"></i>
            <span>Add to Cart</span>
          </button>
          <button 
            className="action-btn wishlist-btn"
            onClick={handleWishlist}
          >
            <i className={`bi bi-heart${isWishlisted ? '-fill' : ''}`}></i> 
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <i 
                key={i}
                className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
              ></i>
            ))}
          </div>
          <span className="rating-count">({product.reviews || 0})</span>
        </div>
        
        <div className="price-section">
          <span className="current-price">₹{product.price.toLocaleString()}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="original-price">
              ₹{product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
        
        {/* Stock Status */}
        <div className="stock-status">
          {product.stock ? (
            <span className="in-stock">
              <i className="bi bi-check-circle"></i> In Stock
            </span>
          ) : (
            <span className="out-of-stock">
              <i className="bi bi-x-circle"></i> Out of Stock
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;