import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          <span className="logo-main">ShopKart</span>
          <span className="logo-sub">Explore Plus</span>
        </Link>
      </div>


      <div className="nav-right">
        <Link to="/" className="nav-item">🏠 Home</Link>
        <Link to="/products" className="nav-item">🛍️ Products</Link>
        <Link to="/wishlist" className="nav-item">❤️ Wishlist</Link>
        <Link to="/cart" className="nav-item">🛒 Cart</Link>
      </div>
    </nav>
  );
}

export default Navbar;
