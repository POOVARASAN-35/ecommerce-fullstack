import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "../styles/Home.css";

function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use cart context
  const { cart, addToCart, addToWishlist, removeFromWishlist, wishlist } = useCart();

  // Hero slides data
  const heroSlides = [
    {
      id: 1,
      title: "Summer Sale Collection",
      subtitle: "Up to 50% OFF on New Arrivals",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
      buttonText: "Shop Now",
      buttonColor: "primary",
    },
    {
      id: 2,
      title: "Premium Electronics",
      subtitle: "Latest Tech Gadgets with 2-Year Warranty",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
      buttonText: "Explore Tech",
      buttonColor: "info",
    },
    {
      id: 3,
      title: "Home & Living",
      subtitle: "Transform Your Space with Modern Furniture",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070",
      buttonText: "Discover Home",
      buttonColor: "success",
    }
  ];

  // Featured categories
  const categories = [
    { id: 1, name: "Electronics", icon: "bi-cpu", count: 120, color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { id: 2, name: "Home Decor", icon: "bi-house", count: 89, color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { id: 3, name: "Fashion", icon: "bi-tshirt", count: 245, color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { id: 4, name: "Sports", icon: "bi-bicycle", count: 67, color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  ];

  // Featured products
  const featuredProducts = [
    { 
      id: 1, 
      name: "Wireless Headphones", 
      price: 2999, 
      originalPrice: 4999, 
      rating: 4.5, 
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", 
      category: "Electronics",
      description: "Premium wireless headphones with noise cancellation",
      stock: true,
      reviewCount: 128
    },
    { 
      id: 2, 
      name: "Modern Sofa", 
      price: 24999, 
      originalPrice: 34999, 
      rating: 4.8, 
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500", 
      category: "Furniture",
      description: "Contemporary sofa with premium upholstery",
      stock: true,
      reviewCount: 89
    },
    { 
      id: 3, 
      name: "Smart Watch", 
      price: 8999, 
      originalPrice: 12999, 
      rating: 4.3, 
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", 
      category: "Electronics",
      description: "Advanced smartwatch with health tracking",
      stock: true,
      reviewCount: 256
    },
    { 
      id: 4, 
      name: "Designer Lamp", 
      price: 3999, 
      originalPrice: 5999, 
      rating: 4.7, 
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500", 
      category: "Home",
      description: "Modern designer lamp with adjustable lighting",
      stock: false,
      reviewCount: 67
    },
  ];

  // Stats data
  const stats = [
    { value: "10K+", label: "Happy Customers", icon: "bi-people-fill" },
    { value: "500+", label: "Premium Products", icon: "bi-box-seam-fill" },
    { value: "24/7", label: "Customer Support", icon: "bi-headset" },
    { value: "100%", label: "Secure Payments", icon: "bi-shield-check" },
  ];

  // Auto slide hero
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Manual slide control
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      qty: 1,
      stock: product.stock
    });
  };

  // Handle add to wishlist
  const handleAddToWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        _id: product.id, // Note: Wishlist expects _id
        id: product.id,
        productId: product.id, // Added productId for wishlist compatibility
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        description: product.description,
        rating: product.rating,
        reviewCount: product.reviewCount,
        stock: product.stock
      });
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay">
                <div className="container">
                  <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-subtitle">{slide.subtitle}</p>
                    <Link to="/products">
                      <button className={`btn btn-${slide.buttonColor} btn-lg hero-btn`}>
                        {slide.buttonText} <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <div className="scroll-down">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <div className="arrow">
            <i className="bi bi-chevron-down"></i>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories py-5">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Browse through our wide range of premium categories</p>
          </div>
          <div className="row g-4">
            {categories.map((category) => (
              <div className="col-md-3 col-sm-6" key={category.id}>
                <Link to={`/products?category=${category.name.toLowerCase()}`} className="category-card">
                  <div className="category-icon" style={{ background: category.color }}>
                    <i className={`bi ${category.icon}`}></i>
                  </div>
                  <h5 className="category-name">{category.name}</h5>
                  <p className="category-count">{category.count}+ Products</p>
                  <div className="category-hover">
                    <span>View All <i className="bi bi-arrow-right"></i></span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products py-5 bg-light">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Handpicked items just for you</p>
          </div>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div className="col-lg-3 col-md-6" key={product.id}>
                <div className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} loading="lazy" />
                    <div className="product-overlay">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleAddToCart(product)}
                      >
                        <i className="bi bi-cart-plus"></i> Add to Cart
                      </button>
                      <button 
                        className="btn btn-outline-light"
                        onClick={() => handleAddToWishlist(product)}
                      >
                        <i className={`bi ${isInWishlist(product.id) ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                      </button>
                    </div>
                    {product.originalPrice && (
                      <span className="product-badge">Sale</span>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h5 className="product-name">{product.name}</h5>
                    <div className="product-rating">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''} ${i < Math.floor(product.rating) ? 'text-warning' : 'text-secondary'}`}
                        ></i>
                      ))}
                      <span className="rating-text">({product.rating})</span>
                    </div>
                    <div className="product-price">
                      <span className="current-price">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/products" className="btn btn-outline-primary btn-lg">
              View All Products <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div className="col-md-3 col-sm-6" key={index}>
                <div className="stat-card">
                  <div className="stat-icon">
                    <i className={`bi ${stat.icon}`}></i>
                  </div>
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <h2 className="cta-title">Ready to Transform Your Shopping Experience?</h2>
                <p className="cta-text">Join thousands of satisfied customers who shop with confidence</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/products" className="btn btn-light btn-lg">
                  Start Shopping <i className="bi bi-arrow-right ms-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter py-5">
        <div className="container">
          <div className="newsletter-card">
            <div className="row align-items-center">
              <div className="col-md-6">
                <h3 className="newsletter-title">Subscribe to Our Newsletter</h3>
                <p className="newsletter-text">Get updates on new products and exclusive offers</p>
              </div>
              <div className="col-md-6">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    aria-label="Email for newsletter"
                  />
                  <button className="btn btn-primary" type="button">
                    Subscribe <i className="bi bi-send ms-2"></i>
                  </button>
                </div>
                <p className="newsletter-note small mt-2">By subscribing, you agree to our Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;