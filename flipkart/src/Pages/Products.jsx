import { useState, useEffect, useRef } from "react";
import { products } from "../data/products";
import ProductCard from "../Component/ProductCard";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import "../styles/Products.css";

function Products() {
  const categories = ["All", "Electronics", "Home", "Wood", "Plastic", "Furniture", "Kitchen", "Sports", "Books", "Clothing"];
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  const { addToCart, addToWishlist } = useCart();
  const navigate = useNavigate();
  const productsRef = useRef(null);

  // Hero slides with reduced opacity
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070",
      title: "Up to 50% Off",
      subtitle: "Summer Collection 2024",
      description: "Discover amazing deals on premium products",
      cta: "Shop Now",
      badge: "Limited Time",
      color: "#fef3c7",
      discount: "50%"
    },
    {
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070",
      title: "New Arrivals",
      subtitle: "Latest Tech Gadgets",
      description: "Experience cutting-edge technology with exclusive offers",
      cta: "Explore",
      badge: "Exclusive",
      color: "#dbeafe",
      discount: "30%"
    },
    {
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070",
      title: "Free Shipping",
      subtitle: "On Orders Over ₹1999",
      description: "Fast delivery to your doorstep with premium service",
      cta: "Learn More",
      badge: "Special Offer",
      color: "#dcfce7",
      discount: "Free"
    }
  ];

  // Brands and offers
  const brands = [
    { name: 'Samsung', icon: 'bi-phone', count: 42 },
    { name: 'Apple', icon: 'bi-apple', count: 38 },
    { name: 'Nike', icon: 'bi-lightning', count: 56 },
    { name: 'Adidas', icon: 'bi-tshirt', count: 49 },
    { name: 'Sony', icon: 'bi-headphones', count: 31 },
    { name: 'Crompton', icon: 'bi-lightbulb', count: 27 },
    { name: 'ECOGLO', icon: 'bi-flower1', count: 23 },
    { name: 'LG', icon: 'bi-tv', count: 35 }
  ];

  const offers = [
    { value: 'sale', label: 'On Sale', badge: '🔥', color: '#ef4444', count: 128 },
    { value: 'free-shipping', label: 'Free Shipping', badge: '🚚', color: '#3b82f6', count: 95 },
    { value: 'new', label: 'New Arrivals', badge: '🆕', color: '#10b981', count: 76 },
    { value: 'best-seller', label: 'Best Seller', badge: '⭐', color: '#f59e0b', count: 210 },
    { value: 'limited', label: 'Limited Stock', badge: '⏳', color: '#8b5cf6', count: 43 }
  ];

  // Rotate hero images every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer for hero visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                          product.description?.toLowerCase().includes(search.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = product.rating >= ratingFilter;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesOffers = selectedOffers.every(offer => product.offers?.includes(offer));
    return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesBrand && matchesOffers;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch(sortBy) {
      case "price-low": return a.price - b.price;
      case "price-high": return b.price - a.price;
      case "rating": return b.rating - a.rating;
      case "name": return a.name.localeCompare(b.name);
      case "newest": return new Date(b.dateAdded) - new Date(a.dateAdded);
      default: return b.id - a.id;
    }
  });

  useEffect(() => {
    setFilteredCount(filteredProducts.length);
  }, [filteredProducts]);

  const pricePresets = [
    { label: "Under ₹1000", range: [0, 1000], icon: "bi-coin", count: products.filter(p => p.price < 1000).length },
    { label: "₹1000 - ₹5000", range: [1000, 5000], icon: "bi-wallet2", count: products.filter(p => p.price >= 1000 && p.price <= 5000).length },
    { label: "₹5000 - ₹20000", range: [5000, 20000], icon: "bi-cash-stack", count: products.filter(p => p.price > 5000 && p.price <= 20000).length },
    { label: "Over ₹20000", range: [20000, 100000], icon: "bi-gem", count: products.filter(p => p.price > 20000).length },
  ];

  const ratingOptions = [
    { value: 4, label: "4+ stars", count: products.filter(p => p.rating >= 4).length },
    { value: 3, label: "3+ stars", count: products.filter(p => p.rating >= 3).length },
    { value: 2, label: "2+ stars", count: products.filter(p => p.rating >= 2).length },
    { value: 1, label: "1+ stars", count: products.filter(p => p.rating >= 1).length }
  ];

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleOfferChange = (offer) => {
    setSelectedOffers(prev => 
      prev.includes(offer) ? prev.filter(o => o !== offer) : [...prev, offer]
    );
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, 100000]);
    setRatingFilter(0);
    setSearch("");
    setSelectedBrands([]);
    setSelectedOffers([]);
    setSortBy("featured");
  };

  const applyFilters = () => {
    setShowFilters(false);
  };

  const handleQuickTabChange = (tab) => {
    setActiveTab(tab);
    switch(tab) {
      case 'featured':
        setSelectedOffers(['best-seller']);
        break;
      case 'deals':
        setSelectedOffers(['sale']);
        break;
      case 'new':
        setSelectedOffers(['new']);
        break;
      case 'trending':
        setRatingFilter(4);
        break;
      default:
        resetFilters();
    }
  };

  const handlePrevSlide = () => {
    setHeroImageIndex(prev => prev === 0 ? heroSlides.length - 1 : prev - 1);
  };

  const handleNextSlide = () => {
    setHeroImageIndex(prev => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="products-page">
      {/* Hero Banner with Image Carousel */}
      <div className="products-hero">
        <div className="products-hero-background">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`products-hero-slide ${index === heroImageIndex ? 'active' : ''}`}
              style={{ 
                backgroundImage: `url(${slide.image})`,
                 // Reduced opacity
              }}
            />
          ))}
          <div className="products-hero-overlay"></div>
        </div>
        
        <div className="products-hero-content">
          <div className="products-hero-text-content">
            <div className="products-hero-main-content">
              <h1 className="products-hero-title">New & Premium Products</h1>
              <h2 className="products-hero-subtitle">Latest in Tech & Lifestyle 2024</h2>
              <p className="products-hero-description">
                Explore our exclusive collection with premium quality and innovative design.
                Curated just for your modern lifestyle.
              </p>
              
              <div className="products-hero-actions">
                <div className="products-hero-action-buttons">
                  <button className="products-hero-btn-explore" onClick={() => navigate('/products')}>
                    <span>Explore Now</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                  <button className="products-hero-btn-secondary" onClick={() => navigate('/products?filter=free-shipping')}>
                    <i className="bi bi-truck"></i>
                    <span>Free Shipping</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Hero Navigation Dots */}
        <div className="products-hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`products-hero-dot ${index === heroImageIndex ? 'active' : ''}`}
              onClick={() => setHeroImageIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div className="products-hero-dot-progress"></div>
            </button>
          ))}
        </div>
        
        {/* Hero Navigation Arrows */}
        {/* <button 
          className="products-hero-arrow products-hero-arrow-prev"
          onClick={handlePrevSlide}
          aria-label="Previous slide"
        >
          <i className="bi bi-chevron-left"></i>
        </button>
        <button 
          className="products-hero-arrow products-hero-arrow-next"
          onClick={handleNextSlide}
          aria-label="Next slide"
        >
          <i className="bi bi-chevron-right"></i>
        </button> */}
      </div>

      <div className="container" ref={productsRef}>
        {/* Quick Navigation Tabs */}
        <div className="products-quick-tabs">
          <div className="products-tabs-container">
            <button 
              className={`products-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => handleQuickTabChange('all')}
            >
              <i className="bi bi-grid-3x3-gap-fill"></i> All Products
              <span className="products-tab-count">{products.length}</span>
            </button>
            <button 
              className={`products-tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
              onClick={() => handleQuickTabChange('featured')}
            >
              <i className="bi bi-star-fill"></i> Featured
              <span className="products-tab-count">{products.filter(p => p.featured).length}</span>
            </button>
            <button 
              className={`products-tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
              onClick={() => handleQuickTabChange('trending')}
            >
              <i className="bi bi-fire"></i> Trending
              <span className="products-tab-count">{products.filter(p => p.trending).length}</span>
            </button>
            <button 
              className={`products-tab-btn ${activeTab === 'deals' ? 'active' : ''}`}
              onClick={() => handleQuickTabChange('deals')}
            >
              <i className="bi bi-lightning-fill"></i> Hot Deals
              <span className="products-tab-count">{products.filter(p => p.discount > 20).length}</span>
            </button>
            <button 
              className={`products-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => handleQuickTabChange('new')}
            >
              <i className="bi bi-bell-fill"></i> New Arrivals
              <span className="products-tab-count">{products.filter(p => p.isNew).length}</span>
            </button>
          </div>
        </div>

        <div className="products-main-layout">
          {/* Filters Sidebar - Clean Design */}
          <div className={`products-filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="products-sidebar-header">
              <div className="products-filter-title">
                <i className="bi bi-funnel"></i>
                <h3>Filters</h3>
              </div>
              <div className="products-filter-actions">
                <button className="products-btn-clear" onClick={resetFilters}>
                  <i className="bi bi-x-circle"></i>
                  Clear All
                </button>
                <button className="products-btn-close" onClick={() => setShowFilters(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="products-filter-search">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Categories */}
            <div className="products-filter-section">
              <div className="products-filter-section-header">
                <i className="bi bi-list"></i>
                <h4>Categories</h4>
                <span className="products-section-count">
                  {selectedCategory === 'All' ? products.length : 
                   products.filter(p => p.category === selectedCategory).length}
                </span>
              </div>
              <div className="products-category-grid">
                {categories.map((cat) => (
                  <div
                    key={cat}
                    className={`products-category-item ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <div className="products-category-icon">
                      {getCategoryIcon(cat)}
                    </div>
                    <span className="products-category-name">{cat}</span>
                    <span className="products-category-count">
                      {cat === 'All' ? products.length : products.filter(p => p.category === cat).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="products-filter-section">
              <div className="products-filter-section-header">
                <i className="bi bi-tags"></i>
                <h4>Price Range</h4>
              </div>
              
              <div className="products-price-range-card">
                <div className="products-price-display">
                  <div className="products-price-from">
                    <div className="products-price-label">From</div>
                    <div className="products-price-value">₹{priceRange[0].toLocaleString()}</div>
                  </div>
                  <div className="products-price-to">
                    <div className="products-price-label">To</div>
                    <div className="products-price-value">₹{priceRange[1].toLocaleString()}</div>
                  </div>
                </div>
                
                <div className="products-dual-slider">
                  <div className="products-slider-track"></div>
                  <div 
                    className="products-slider-progress"
                    style={{
                      left: `${(priceRange[0] / 100000) * 100}%`,
                      width: `${((priceRange[1] - priceRange[0]) / 100000) * 100}%`
                    }}
                  ></div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="100"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="products-range-slider products-min-slider"
                  />
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="products-range-slider products-max-slider"
                  />
                </div>

                <div className="products-price-presets">
                  {pricePresets.map((preset) => (
                    <button
                      key={preset.label}
                      className={`products-price-preset ${
                        priceRange[0] === preset.range[0] && priceRange[1] === preset.range[1] ? 'active' : ''
                      }`}
                      onClick={() => setPriceRange(preset.range)}
                    >
                      <i className={`bi ${preset.icon}`}></i>
                      <span className="products-preset-label">{preset.label}</span>
                      <span className="products-preset-count">({preset.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="products-filter-section">
              <div className="products-filter-section-header">
                <i className="bi bi-star"></i>
                <h4>Rating</h4>
              </div>
              <div className="products-rating-filter-cards">
                {ratingOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`products-rating-card ${ratingFilter === option.value ? 'active' : ''}`}
                    onClick={() => setRatingFilter(ratingFilter === option.value ? 0 : option.value)}
                  >
                    <div className="products-rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`bi bi-star${i < option.value ? '-fill' : ''}`}
                        ></i>
                      ))}
                    </div>
                    <div className="products-rating-text">
                      <span className="products-rating-value">{option.value}+ stars</span>
                      <span className="products-rating-count">({option.count})</span>
                    </div>
                    <div className="products-rating-check">
                      <i className="bi bi-check-lg"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="products-filter-section">
              <div className="products-filter-section-header">
                <i className="bi bi-shop"></i>
                <h4>Brands</h4>
                <span className="products-section-count">{selectedBrands.length}</span>
              </div>
              <div className="products-brands-grid">
                {brands.slice(0, 6).map((brand) => (
                  <label key={brand.name} className="products-brand-card">
                    <input
                      type="checkbox"
                      className="products-brand-checkbox"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => handleBrandChange(brand.name)}
                    />
                    <div className="products-brand-content">
                      <div className="products-brand-icon">
                        <i className={`bi ${brand.icon}`}></i>
                      </div>
                      <div className="products-brand-info">
                        <span className="products-brand-name">{brand.name}</span>
                        <span className="products-brand-count">{brand.count}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Offers */}
            <div className="products-filter-section">
              <div className="products-filter-section-header">
                <i className="bi bi-gift"></i>
                <h4>Offers</h4>
                <span className="products-section-count">{selectedOffers.length}</span>
              </div>
              <div className="products-offers-grid">
                {offers.map((offer) => (
                  <label key={offer.value} className="products-offer-card">
                    <input
                      type="checkbox"
                      className="products-offer-checkbox"
                      checked={selectedOffers.includes(offer.value)}
                      onChange={() => handleOfferChange(offer.value)}
                    />
                    <div 
                      className="products-offer-content"
                      style={{ '--offer-color': offer.color }}
                    >
                      <div className="products-offer-badge-icon">
                        <span>{offer.badge}</span>
                      </div>
                      <div className="products-offer-info">
                        <span className="products-offer-label">{offer.label}</span>
                        <span className="products-offer-count">{offer.count}</span>
                      </div>
                      <div className="products-offer-check">
                        <i className="bi bi-check-lg"></i>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Actions Bottom */}
            <div className="products-filter-actions-bottom">
              <button className="products-btn-apply-filters" onClick={applyFilters}>
                <i className="bi bi-check-lg"></i>
                Apply Filters ({filteredCount})
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="products-content-area">
            {/* Controls Bar */}
            <div className="products-controls-bar">
              <div className="products-controls-left">
                <div className="products-results-badge">
                  <div className="products-results-count">{filteredCount}</div>
                  <div className="products-results-text">Products Found</div>
                  <div className="products-results-trend">
                    <i className="bi bi-arrow-up"></i>
                    <span>+12%</span>
                  </div>
                </div>
                <button
                  className="products-filter-toggle-btn"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <i className={`bi bi-${showFilters ? 'x' : 'sliders'}`}></i>
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              <div className="products-controls-right">
                <div className="products-sort-dropdown">
                  <i className="bi bi-sort-down"></i>
                  <select
                    className="products-sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">Name: A to Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="products-grid">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="product-card-skeleton">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                      <div className="skeleton-line"></div>
                      <div className="skeleton-line short"></div>
                      <div className="skeleton-line shorter"></div>
                      <div className="skeleton-buttons">
                        <div className="skeleton-button"></div>
                        <div className="skeleton-button"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="products-no-products-state">
                <div className="products-no-products-icon">
                  <i className="bi bi-search"></i>
                </div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <div className="products-no-products-actions">
                  <button className="products-btn-reset-filters" onClick={resetFilters}>
                    <i className="bi bi-arrow-clockwise"></i>
                    Reset All Filters
                  </button>
                  <button className="products-btn-clear-search" onClick={() => setSearch('')}>
                    <i className="bi bi-x-circle"></i>
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                      addToWishlist={addToWishlist}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="products-modern-pagination">
                  <button className="products-pagination-btn products-pagination-prev">
                    <i className="bi bi-chevron-left"></i>
                    Previous
                  </button>
                  
                  <div className="products-page-numbers">
                    <span className="products-page-number active">1</span>
                    <span className="products-page-number">2</span>
                    <span className="products-page-number">3</span>
                    <span className="products-page-dots">...</span>
                    <span className="products-page-number">8</span>
                  </div>
                  
                  <div className="products-page-info">
                    Page <span className="products-current-page">1</span>
                    <span className="products-page-total">of 8</span>
                  </div>
                  
                  <button className="products-pagination-btn products-pagination-next">
                    Next
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    'All': 'bi-grid-fill',
    'Electronics': 'bi-laptop',
    'Home': 'bi-house-door',
    'Wood': 'bi-tree',
    'Plastic': 'bi-recycle',
    'Furniture': 'bi-couch',
    'Kitchen': 'bi-egg-fried',
    'Sports': 'bi-bicycle',
    'Books': 'bi-book',
    'Clothing': 'bi-tshirt'
  };
  return <i className={`bi ${icons[category] || 'bi-box'}`}></i>;
}

export default Products;