import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/ProductCard.css";

function ProductCard({ product }) {

  const { addToCart, addToWishlist, wishlist } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const isWishlisted = wishlist.some(
    (item) => item.productId === String(product.id)
  );

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    addToWishlist(product);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const isOnSale =
    product.originalPrice && product.price < product.originalPrice;

  const discount = isOnSale
    ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
          100
      )
    : 0;

  return (
    <div
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >

      <div className="product-image-wrapper">

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />

        {isOnSale && (
          <div className="sale-badge">
            -{discount}%
          </div>
        )}

        <div className={`hover-actions ${isHovered ? "visible" : ""}`}>

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
            <i
              className={`bi ${
                isWishlisted ? "bi-heart-fill" : "bi-heart"
              }`}
            ></i>
          </button>

        </div>

      </div>

      <div className="product-info">

        <h3 className="product-name">
          {product.name}
        </h3>

        <div className="product-rating">

          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`bi ${
                  i < Math.floor(product.rating)
                    ? "bi-star-fill"
                    : "bi-star"
                }`}
              ></i>
            ))}
          </div>

          <span className="rating-count">
            ({product.reviews || 0})
          </span>

        </div>

        <div className="price-section">

          <span className="current-price">
            ₹{product.price.toLocaleString()}
          </span>

          {product.oldPrice &&
            product.oldPrice > product.price && (
              <span className="original-price">
                ₹{product.oldPrice.toLocaleString()}
              </span>
            )}

        </div>

        <div className="stock-status">

          {product.stock ? (
            <span className="in-stock">
              <i className="bi bi-check-circle"></i>
              In Stock
            </span>
          ) : (
            <span className="out-of-stock">
              <i className="bi bi-x-circle"></i>
              Out of Stock
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

export default ProductCard;