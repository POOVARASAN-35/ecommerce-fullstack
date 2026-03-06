import { Link } from "react-router-dom";
import "../styles/footer.css";

function ElegantFooter() {
  return (
    <footer className="nova-footer py-8 mt-auto">
      <div className="nova-container container">
        {/* Top wave divider */}
        <div className="nova-wave-divider">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path fill="rgba(255,255,255,0.02)" fillOpacity="1" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path>
          </svg>
        </div>

        <div className="nova-grid">
          {/* Brand Section */}
          <div className="nova-brand-section">
            <div className="nova-logo-wrapper">
              <div className="nova-logo-orb">
                <i className="bi bi-shop-window nova-logo-icon"></i>
                <div className="nova-logo-glow"></div>
              </div>
              <div className="nova-brand-content">
                <h2 className="nova-brand-name">ShopKart</h2>
                <p className="nova-tagline">REDEFINING ONLINE SHOPPING</p>
              </div>
            </div>
            <p className="nova-description">
              Experience premium shopping with our curated collection of Home, 
              Electronics, Wood, Plastic, and lifestyle products. Quality meets 
              affordability.
            </p>
            <div className="nova-awards">
              <span className="nova-award-badge">
                <i className="bi bi-star-fill me-1"></i>Trusted Store
              </span>
              <span className="nova-award-badge">
                <i className="bi bi-award me-1"></i>5-Star Rated
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="nova-links-section">
            <h3 className="nova-section-title">
              <span className="nova-title-icon">▸</span> Quick Navigation
            </h3>
            <div className="nova-links-grid">
              <Link to="/" className="nova-nav-link">
                <div className="nova-link-icon">
                  <i className="bi bi-house-heart"></i>
                </div>
                <span>Home</span>
                <div className="nova-link-arrow">→</div>
              </Link>
              <Link to="/products" className="nova-nav-link">
                <div className="nova-link-icon">
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </div>
                <span>All Products</span>
                <div className="nova-link-arrow">→</div>
              </Link>
              <Link to="/categories" className="nova-nav-link">
                <div className="nova-link-icon">
                  <i className="bi bi-tags-fill"></i>
                </div>
                <span>Categories</span>
                <div className="nova-link-arrow">→</div>
              </Link>
              <Link to="/deals" className="nova-nav-link">
                <div className="nova-link-icon">
                  <i className="bi bi-lightning-fill"></i>
                </div>
                <span>Hot Deals</span>
                <div className="nova-link-arrow">→</div>
              </Link>
            </div>
          </div>

          {/* Support Links */}
          <div className="nova-support-section">
            <h3 className="nova-section-title">
              <span className="nova-title-icon">▸</span> Customer Care
            </h3>
            <div className="nova-support-links">
              <Link to="/support" className="nova-support-link">
                <i className="bi bi-headset"></i>
                <div>
                  <div className="nova-support-title">24/7 Support</div>
                  <div className="nova-support-sub">Live Chat Available</div>
                </div>
              </Link>
              <Link to="/returns" className="nova-support-link">
                <i className="bi bi-arrow-return-left"></i>
                <div>
                  <div className="nova-support-title">Easy Returns</div>
                  <div className="nova-support-sub">30-Day Policy</div>
                </div>
              </Link>
              <Link to="/shipping" className="nova-support-link">
                <i className="bi bi-truck"></i>
                <div>
                  <div className="nova-support-title">Free Shipping</div>
                  <div className="nova-support-sub">Over ₹999</div>
                </div>
              </Link>
              <Link to="/secure" className="nova-support-link">
                <i className="bi bi-shield-check"></i>
                <div>
                  <div className="nova-support-title">100% Secure</div>
                  <div className="nova-support-sub">SSL Protected</div>
                </div>
              </Link>
            </div>
          </div>

          {/* Contact Section - Simplified Layout */}
          <div className="nova-contact-section">
            <div className="nova-contact-simple-layout">
              {/* Contact Info */}
              <div className="nova-contact-simple-card">
                <div className="nova-card-simple-header">
                  <i className="bi bi-geo-alt-fill nova-card-simple-icon"></i>
                  <h3 className="nova-card-simple-title">Contact Info</h3>
                </div>
                <p className="nova-card-simple-subtitle">Reach Out to Us</p>
                
                <div className="nova-contact-simple-details">
                  <div className="nova-contact-simple-item">
                    <i className="bi bi-geo-alt"></i>
                    <div>
                      <div className="nova-contact-simple-label">Our Location</div>
                      <div className="nova-contact-simple-value">Chennai, India</div>
                    </div>
                  </div>
                  
                  <div className="nova-contact-simple-item">
                    <i className="bi bi-telephone"></i>
                    <div>
                      <div className="nova-contact-simple-label">Call Us</div>
                      <div className="nova-contact-simple-value">+91 98765 43210</div>
                    </div>
                  </div>
                  
                  <div className="nova-contact-simple-item">
                    <i className="bi bi-envelope"></i>
                    <div>
                      <div className="nova-contact-simple-label">Email Us</div>
                      <a href="mailto:support@shopnova.com" className="nova-contact-simple-value">
                        support@shopnova.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="nova-newsletter-simple-card">
                <div className="nova-card-simple-header">
                  <i className="bi bi-envelope-open-fill nova-card-simple-icon"></i>
                  <h3 className="nova-card-simple-title">Newsletter</h3>
                </div>
                <p className="nova-card-simple-subtitle">Stay Updated</p>
                
                <div className="nova-newsletter-simple-content">
                  <div className="nova-simple-offer">
                    <i className="bi bi-gift-fill me-2"></i>
                    Get Exclusive Offers
                  </div>
                  
                  <p className="nova-newsletter-simple-description">
                    Subscribe to receive special offers, gift ideas, and shopping tips.
                  </p>
                  
                  <div className="nova-newsletter-simple-form">
                    <div className="nova-input-simple-wrapper">
                      <i className="bi bi-envelope nova-input-simple-icon"></i>
                      <input 
                        type="email" 
                        className="nova-email-input-simple" 
                        placeholder="Enter your email"
                        aria-label="Subscribe to newsletter"
                      />
                    </div>
                    <button className="nova-subscribe-button-simple" type="button">
                      Subscribe Now
                      <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                  
                  <div className="nova-privacy-simple-note">
                    <i className="bi bi-shield-check text-success me-1"></i>
                    <small>We respect your privacy. Unsubscribe anytime.</small>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="nova-social-simple-card">
                <div className="nova-card-simple-header">
                  <i className="bi bi-people-fill nova-card-simple-icon"></i>
                  <h3 className="nova-card-simple-title">Follow Us</h3>
                </div>
                <p className="nova-card-simple-subtitle">Join Our Community</p>
                
                <div className="nova-social-simple-content">
                  <p className="nova-social-simple-description">
                    Follow our journey and be part of our growing community.
                  </p>
                  
                  <div className="nova-social-simple-grid">
                    <a href="#" className="nova-social-simple-btn nova-social-fb" aria-label="Facebook">
                      <i className="bi bi-facebook"></i>
                      <span>Facebook</span>
                    </a>
                    
                    <a href="#" className="nova-social-simple-btn nova-social-ig" aria-label="Instagram">
                      <i className="bi bi-instagram"></i>
                      <span>Instagram</span>
                    </a>
                    
                    <a href="#" className="nova-social-simple-btn nova-social-tw" aria-label="Twitter">
                      <i className="bi bi-twitter"></i>
                      <span>Twitter</span>
                    </a>
                    
                    <a href="#" className="nova-social-simple-btn nova-social-li" aria-label="LinkedIn">
                      <i className="bi bi-linkedin"></i>
                      <span>LinkedIn</span>
                    </a>
                    
                    <a href="#" className="nova-social-simple-btn nova-social-yt" aria-label="YouTube">
                      <i className="bi bi-youtube"></i>
                      <span>YouTube</span>
                    </a>
                    
                    <a href="#" className="nova-social-simple-btn nova-social-pin" aria-label="Pinterest">
                      <i className="bi bi-pinterest"></i>
                      <span>Pinterest</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="nova-bottom-section">
          <div className="nova-divider">
            <div className="nova-divider-line"></div>
            <div className="nova-divider-orb">
              <i className="bi bi-diamond-fill"></i>
            </div>
            <div className="nova-divider-line"></div>
          </div>
          
          <div className="nova-bottom-simple-content">
            <div className="nova-copyright-simple">
              <div className="nova-copyright-simple-text">
                © {new Date().getFullYear()} <span className="nova-brand-highlight">ShopKart</span>. 
                All rights reserved.
              </div>
              <div className="nova-extra-simple-info">
                <span className="nova-extra-simple-item">
                  <i className="bi bi-globe me-1"></i>Worldwide Shipping
                </span>
                <span className="nova-extra-simple-item">
                  <i className="bi bi-credit-card me-1"></i>100+ Payment Options
                </span>
                <span className="nova-extra-simple-item">
                  <i className="bi bi-shield-lock me-1"></i>GDPR Compliant
                </span>
              </div>
            </div>
            
            <div className="nova-policy-simple-links">
              <Link to="/privacy" className="nova-policy-simple-link">Privacy Policy</Link>
              <Link to="/terms" className="nova-policy-simple-link">Terms of Service</Link>
              <Link to="/cookies" className="nova-policy-simple-link">Cookie Policy</Link>
              <Link to="/sitemap" className="nova-policy-simple-link">Sitemap</Link>
            </div>
          </div>
          
          {/* Back to Top */}
          <button 
            className="nova-back-to-top" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top"
          >
            <i className="bi bi-chevron-up"></i>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default ElegantFooter;