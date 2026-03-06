import { useCart } from "../context/CartContext";
import { useState } from "react";
import "../styles/cart.css";
import { useNavigate } from "react-router-dom";


const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const navigate = useNavigate();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "success", "error", "confirm"
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(() => () => {});

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? (subtotal > 5000 ? 0 : 99) : 0;
  const tax = subtotal * 0.18;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  // Handle quantity change
  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQty);
    }
  };

  // Handle coupon application
  const handleApplyCoupon = () => {
    if (couponCode === "SAVE10") {
      setCouponApplied(true);
      showSuccessModal("Coupon Applied!", "10% discount has been applied to your order!");
    } else {
      showErrorModal("Invalid Coupon", "The coupon code you entered is invalid. Please try again.");
    }
  };

  // Handle checkout
  const handleCheckout = () => {
    setIsCheckoutLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsCheckoutLoading(false);
      showSuccessModal(
        "Order Placed Successfully!",
        "Your order has been confirmed. You will receive an email with order details shortly.",
        () => {
          clearCart();
          setShowModal(false);
        }
      );
    }, 1500);
  };

  // Show confirmation modal for clearing cart
  const handleClearCart = () => {
    showConfirmModal(
      "Clear Cart",
      "Are you sure you want to clear all items from your cart?",
      () => {
        clearCart();
        setShowModal(false);
      }
    );
  };

  // Modal helper functions
  const showSuccessModal = (title, message, callback = () => {}) => {
    setModalType("success");
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => callback);
    setShowModal(true);
  };

  const showErrorModal = (title, message) => {
    setModalType("error");
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => () => setShowModal(false));
    setShowModal(true);
  };

  const showConfirmModal = (title, message, onConfirm) => {
    setModalType("confirm");
    setModalTitle(title);
    setModalMessage(message);
    setModalAction(() => onConfirm);
    setShowModal(true);
  };

  // Get modal icon based on type
  const getModalIcon = () => {
    switch(modalType) {
      case "success":
        return <i className="bi bi-check-circle display-4 text-success"></i>;
      case "error":
        return <i className="bi bi-x-circle display-4 text-danger"></i>;
      case "confirm":
        return <i className="bi bi-question-circle display-4 text-warning"></i>;
      default:
        return <i className="bi bi-info-circle display-4 text-primary"></i>;
    }
  };

  return (
    <div className="flipkart-cart-wrapper">

      {/* Main Container */}
      <div className="container flipkart-main-container">
        {/* Breadcrumb */}
        <nav className="flipkart-breadcrumb" aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/">Home</a></li>
            <li className="breadcrumb-item active" aria-current="page">Shopping Cart</li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="flipkart-page-title mb-4">
          <h1 className="display-6 fw-bold">
            <i className="bi bi-cart3 me-2 text-primary"></i>
            My Shopping Cart
            <span className="text-muted fs-6 ms-3">
              ({cart.length} item{cart.length > 1 ? 's' : ''})
            </span>
          </h1>
        </div>

        {/* Main Content */}
        {cart.length === 0 ? (
          <div className="flipkart-empty-cart">
            <div className="empty-cart-illustration">
              <div className="empty-cart-icon">
                <i className="bi bi-cart-x"></i>
              </div>
              <h3 className="mt-4 mb-3">Your cart is empty</h3>
              <p className="text-muted mb-4">
                It looks like you haven't added any items to your cart yet.
              </p>
              <div className="flipkart-empty-actions">
                <a href="/products" className="btn btn-primary btn-lg px-5">
                  <i className="bi bi-bag me-2"></i>Start Shopping
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            {/* Left Column - Cart Items */}
            <div className="col-lg-8 mb-4">
              {/* Cart Items Container */}
              <div className="flipkart-cart-items-container">
                {/* Delivery Info */}
                <div className="flipkart-delivery-card mb-3">
                  <div className="delivery-info">
                    <i className="bi bi-truck delivery-icon"></i>
                    <div className="delivery-details">
                      <h6 className="mb-1">Delivery by {new Date(Date.now() + 3*24*60*60*1000).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</h6>
                      <p className="text-muted small mb-0">
                        Free delivery on orders above ₹5000
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cart Items List */}
                <div className="flipkart-cart-items-list">
                  {cart.map((item) => (
                    <div className="flipkart-cart-item" key={item.id}>
                      {/* Item Selection */}
                      <div className="item-selector">
                        <input type="checkbox" defaultChecked />
                      </div>
                      
                      {/* Item Image */}
                      <div className="item-image-container">
                        <img 
                          src={item.image}
                          alt={item.name}
                          className="item-image clickable"
                          onClick={() => navigate(`/product/${item.id}`)}
                        />
                      </div>
                      
                      {/* Item Details */}
                      <div className="item-details">
                        <h5
                          className="item-title mb-2 clickable"
                          onClick={() => navigate(`/product/${item.id}`)}
                        >
                          {item.name}
                        </h5>
                        <p className="item-category text-muted small mb-2">
                          <i className="bi bi-tag-fill me-1"></i>{item.category}
                        </p>
                        
                        {/* Seller Info */}
                        <div className="seller-info mb-2">
                          <span className="badge bg-light text-dark me-2">
                            <i className="bi bi-shop me-1"></i>SuperSeller
                          </span>
                          <span className="text-success small">
                            <i className="bi bi-check-circle-fill me-1"></i>
                            {item.stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        
                        {/* Price Display */}
                        <div className="price-display mb-3">
                          <span className="current-price">₹{item.price.toLocaleString()}</span>
                          {item.originalPrice && (
                            <span className="original-price">₹{item.originalPrice.toLocaleString()}</span>
                          )}
                          {item.discount && (
                            <span className="discount-badge">{item.discount}% off</span>
                          )}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="quantity-controls">
                          <label className="form-label small mb-2">Quantity:</label>
                          <div className="flipkart-quantity-selector">
                            <button 
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                              disabled={item.qty <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="quantity-display">{item.qty}</span>
                            <button 
                              className="quantity-btn"
                              onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Item Actions */}
                      <div className="item-actions">
                        <div className="item-price-total mb-3">
                          <span className="text-muted small">Total:</span>
                          <h5 className="text-primary mb-0">₹{(item.price * item.qty).toLocaleString()}</h5>
                        </div>
                        
                        <div className="action-buttons">
                          <button 
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => {
                              showSuccessModal("Saved!", `${item.name} has been saved for later!`);
                            }}
                          >
                            <i className="bi bi-clock"></i> SAVE
                          </button>
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              showConfirmModal(
                                "Remove Item",
                                `Remove "${item.name}" from cart?`,
                                () => {
                                  removeFromCart(item.id);
                                  setShowModal(false);
                                }
                              );
                            }}
                          >
                            <i className="bi bi-trash"></i> REMOVE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Actions Bar */}
                <div className="flipkart-cart-actions-bar">
                  <div className="row align-items-center">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="coupon-section">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control coupon-input"
                            placeholder="Have a coupon? Enter code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <button 
                            className="btn btn-warning coupon-btn"
                            onClick={handleApplyCoupon}
                            disabled={couponApplied}
                          >
                            {couponApplied ? (
                              <>
                                <i className="bi bi-check-circle me-2"></i>Applied
                              </>
                            ) : (
                              'APPLY'
                            )}
                          </button>
                        </div>
                        {couponApplied && (
                          <div className="coupon-success mt-2">
                            <i className="bi bi-check-circle-fill text-success me-1"></i>
                            <span className="text-success">10% discount applied!</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <button 
                        className="btn btn-outline-secondary me-3"
                        onClick={handleClearCart}
                      >
                        <i className="bi bi-trash me-2"></i>Clear Cart
                      </button>
                      <a href="/products" className="btn btn-outline-primary">
                        <i className="bi bi-plus-circle me-2"></i>Add More Items
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="col-lg-4">
              <div className="flipkart-order-summary-card sticky-summary">
                <div className="order-summary-header">
                  <h5 className="mb-0">
                    <i className="bi bi-receipt me-2"></i>PRICE DETAILS
                  </h5>
                </div>
                
                <div className="order-summary-body">
                  {/* Price Breakdown */}
                  <div className="price-breakdown">
                    <div className="price-row">
                      <span>Price ({cart.length} items)</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="price-row text-success">
                        <span>Discount</span>
                        <span>-₹{discount.toLocaleString()}</span>
                      </div>
                    )}
                    
                    <div className="price-row">
                      <span>Delivery Charges</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-success">FREE</span>
                        ) : (
                          `₹${shipping}`
                        )}
                      </span>
                    </div>
                    
                    <div className="price-row">
                      <span>Tax (GST 18%)</span>
                      <span>₹{tax.toLocaleString()}</span>
                    </div>
                    
                    <div className="price-row total-row">
                      <span className="fw-bold">Total Amount</span>
                      <span className="fw-bold total-amount">
                        ₹{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Savings Info */}
                  {discount > 0 && (
                    <div className="savings-info">
                      <i className="bi bi-piggy-bank text-success me-2"></i>
                      <span>You will save ₹{discount.toLocaleString()} on this order</span>
                    </div>
                  )}
                  
                  {/* Checkout Button */}
                  <div className="checkout-section">
                    <button
                      className="btn btn-warning checkout-btn w-100"
                      onClick={handleCheckout}
                      disabled={isCheckoutLoading}
                    >
                      {isCheckoutLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          PROCESSING...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-lock-fill me-2"></i>
                          PLACE ORDER
                        </>
                      )}
                    </button>
                    <p className="text-center text-muted small mt-2 mb-0">
                      By continuing, you agree to our Terms of Use & Privacy Policy
                    </p>
                  </div>
                  
                  {/* Secure Payment */}
                  <div className="secure-payment">
                    <div className="secure-badge">
                      <i className="bi bi-shield-check text-success me-2"></i>
                      <span>Safe and Secure Payments</span>
                    </div>
                    <div className="payment-methods mt-3">
                      <p className="small text-muted mb-2">We accept:</p>
                      <div className="payment-icons">
                        <i className="bi bi-credit-card-2-front"></i>
                        <i className="bi bi-paypal"></i>
                        <i className="bi bi-google"></i>
                        <i className="bi bi-bank"></i>
                        <i className="bi bi-wallet2"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Security Banner */}
              <div className="flipkart-security-banner mt-3">
                <div className="security-content">
                  <i className="bi bi-shield-lock security-icon"></i>
                  <div className="security-text">
                    <h6 className="mb-1">100% SECURE PAYMENTS</h6>
                    <p className="small mb-0">All transactions are protected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}



        {/* Modal Component */}
        {showModal && (
          <div className="flipkart-modal-overlay">
            <div className="flipkart-modal-container">
              <div className="flipkart-modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{modalTitle}</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="modal-icon">
                    {getModalIcon()}
                  </div>
                  <p className="modal-message">{modalMessage}</p>
                </div>
                <div className="modal-footer">
                  {modalType === "confirm" ? (
                    <>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => modalAction()}
                      >
                        Confirm
                      </button>
                    </>
                  ) : (
                    <button 
                      type="button" 
                      className="btn btn-primary w-100"
                      onClick={() => {
                        modalAction();
                        setShowModal(false);
                      }}
                    >
                      OK
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>    
    </div>
  );
};

export default Cart;