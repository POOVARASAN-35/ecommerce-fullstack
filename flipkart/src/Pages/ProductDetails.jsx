import { useParams, useNavigate } from "react-router-dom";
import { products } from "../data/products";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/ProductDetails.css";
import { FiShoppingCart, FiHeart, FiShare2, FiChevronLeft } from "react-icons/fi";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs";
import { useCart } from "../context/CartContext";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart, addToWishlist, wishlist } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === parseInt(id));

  /* Scroll top */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Check wishlist status safely */
  useEffect(() => {
    if (!product) return;

    const exists = wishlist.some(
      (item) => item.productId === String(product.id)
    );

    setIsWishlisted(exists);

  }, [wishlist, product]);

  /* Product not found safety */
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

  const handleWishlist = () => {
    addToWishlist(product);
    setIsWishlisted(true);
  };

  const handleBuyNow = () => {
    navigate(`/checkout/${product.id}?quantity=${quantity}`);
  };

  const renderStars = (rating) => {
    return (
      <div className="stars-container">
        {[...Array(5)].map((_, i) => {
          const index = i + 1;

          if (index <= Math.floor(rating)) {
            return <BsStarFill key={i} className="star-icon filled" />;
          }

          if (index === Math.ceil(rating) && rating % 1 !== 0) {
            return <BsStarHalf key={i} className="star-icon half-filled" />;
          }

          return <BsStar key={i} className="star-icon empty" />;
        })}
      </div>
    );
  };

  const productImages = [
    product.image,
    product.image,
    product.image
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

        {/* LEFT IMAGE SECTION */}

        <div className="image-section">

          <div className="main-image-wrapper">

            <img
              src={productImages[selectedImage]}
              alt={product.name}
              className="main-image"
            />

            {product.discount && (
              <span className="discount-badge">
                -{product.discount}%
              </span>
            )}

            <button
              className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={handleWishlist}
            >
              <FiHeart />
            </button>

          </div>

          <div className="thumbnail-container">

            {productImages.map((img, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                onClick={() => setSelectedImage(index)}
              >
                <img src={img} alt="thumbnail" />
              </button>
            ))}

          </div>

        </div>

        {/* PRODUCT INFO */}

        <div className="product-info-section">

          <div className="breadcrumb">
            Home / {product.category} / <span>{product.name}</span>
          </div>

          <h1 className="product-title">{product.name}</h1>

          <div className="rating-section">

            <div className="rating-display">
              {renderStars(product.rating)}
              <span className="rating-value">
                {product.rating.toFixed(1)}
              </span>
              <span className="reviews">(1,234 reviews)</span>
            </div>

            <div className="share-btn">
              <FiShare2 /> Share
            </div>

          </div>

          <div className="price-section">

            <span className="current-price">
              ₹{product.price.toLocaleString()}
            </span>

            {product.originalPrice && (
              <span className="original-price">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}

          </div>

          <div className="product-description">

            <h3>Description</h3>

            <p>{product.description}</p>

          </div>

        </div>

        {/* PURCHASE SECTION */}

        <div className="purchase-section">

          <div className="card">

            <h3>Purchase Options</h3>

            <div className="quantity-selector">

              <label>Quantity</label>

              <div className="quantity-control">

                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>

              </div>

            </div>

            <div className="total-price">

              <span>Total:</span>

              <span className="total-amount">
                ₹{(product.price * quantity).toLocaleString()}
              </span>

            </div>

            <div className="button-group">

              <button
                className="buy-now-btn"
                onClick={handleBuyNow}
              >
                <FiShoppingCart /> Buy Now
              </button>

              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      </div>

    </motion.div>
  );
}

export default ProductDetails;