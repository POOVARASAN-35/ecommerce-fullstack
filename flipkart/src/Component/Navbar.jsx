import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-left">
          <Link to="/" className="logo">
            <i className="bi bi-shop logo-icon"></i>
            <div className="logo-text">
              <span className="logo-main">ShopKart</span>
              <span className="logo-sub">Premium Shopping</span>
            </div>
          </Link>
        </div>

        <div className="nav-search">
          <input 
            type="text" 
            placeholder="Search for products, brands and more..." 
            className="search-input"
          />
          <button className="search-button">
            <i className="bi bi-search"></i>
          </button>
        </div>

        <div className={`nav-right ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-item">
            <i className="bi bi-house-door nav-icon"></i>
            <span className="nav-text">Home</span>
          </Link>
          <Link to="/products" className="nav-item">
            <i className="bi bi-grid nav-icon"></i>
            <span className="nav-text">Products</span>
          </Link>
          <Link to="/wishlist" className="nav-item">
            <i className="bi bi-heart nav-icon"></i>
            <span className="nav-text">Wishlist</span>
            {/* <span className="badge">3</span> */}
          </Link>
          <Link to="/cart" className="nav-item">
            <i className="bi bi-cart3 nav-icon"></i>
            <span className="nav-text">Cart</span>
            {/* <span className="badge">2</span> */}
          </Link>
          <div className="nav-item profile-item">
            <i className="bi bi-person-circle nav-icon"></i>
            <span className="nav-text">Profile</span>
          </div>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;