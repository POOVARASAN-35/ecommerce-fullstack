import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { products } from "../data/products";
import "../styles/Checkout.css";

const API = "http://localhost:5000/api/addresses";
const USER_ID = "64f1abc1234567890abcd123";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));
  
  // States
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [step, setStep] = useState(1);
  const [showAddressForm, setShowAddressForm] = useState(false);
  
  // Saved addresses states
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      _id: 1,
      type: "Home",
      name: "John Doe",
      phone: "9876543210",
      address: "Flat no. 301, Royal Apartments",
      locality: "MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      landmark: "Near Metro Station",
      altPhone: "9876543211",
      isDefault: true
    },
  ]);
  
  const [selectedAddress, setSelectedAddress] = useState(1);
  
  // Form states for new address
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    pincode: "",
    locality: "",
    address: "",
    city: "",
    state: "",
    landmark: "",
    altPhone: ""
  });

  const [payment, setPayment] = useState({
    method: "cod",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
    bank: ""
  });

  useEffect(() => {
    // Fetch addresses from API
    fetch(`${API}/${USER_ID}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setSavedAddresses(data);
          const def = data.find(a => a.isDefault);
          if (def) setSelectedAddress(def._id);
        }
      })
      .catch(error => {
        console.error("Error fetching addresses:", error);
        // Keep using the default addresses if API fails
      });

    // Set random delivery date
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 5) + 3);
    setDeliveryDate(date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    }));
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({
      ...newAddress,
      [name]: value
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment({
      ...payment,
      [name]: value
    });
  };

  const selectPaymentMethod = (method) => {
    setPayment({
      ...payment,
      method
    });
  };

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.pincode || !newAddress.address) {
      alert("Please fill required fields");
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAddress, userId: USER_ID })
      });

      const data = await res.json();
      setSavedAddresses(prev => [...prev, data]);
      setSelectedAddress(data._id);
      setShowAddressForm(false);

      setNewAddress({
        name: "", email: "", phone: "", pincode: "", locality: "",
        address: "", city: "", state: "", landmark: "", altPhone: ""
      });
      
      alert("Address saved successfully!");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  const removeAddress = async (id) => {
    if (!window.confirm("Remove this address?")) return;

    try {
      await fetch(`${API}/${id}`, { method: "DELETE" });
      setSavedAddresses(prev => prev.filter(a => a._id !== id));
      if (selectedAddress === id) setSelectedAddress(null);
    } catch (error) {
      console.error("Error removing address:", error);
      alert("Failed to remove address. Please try again.");
    }
  };

  const handlePlaceOrder = async () => {
    const address = savedAddresses.find(addr => addr._id === selectedAddress);
    if (!address) {
      alert("Please select a delivery address");
      return;
    }

    if (!validatePayment()) return;
    
    setIsProcessing(true);
    
    // Generate order ID
    const generatedOrderId = `OD${Math.floor(10000000 + Math.random() * 90000000)}`;
    setOrderId(generatedOrderId);
    
    // Simulate API delay
    // await new Promise(resolve => setTimeout(resolve, 2000));
    
    // // Send confirmation email
    // const emailSent = await sendOrderConfirmationEmail({
    //   id: generatedOrderId,
    //   customerName: address.name,
    //   customerEmail: `${address.name.toLowerCase().replace(/\s/g, '')}@example.com`,
    //   product: product.name,
    //   amount: product.price * 1.18,
    //   address: `${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`,
    //   payment: payment.method
    // });
    await fetch("http://localhost:5000/api/orders/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: address.email,
        name: address.name,
        orderId: generatedOrderId,
        product: product.name,
        amount: product.price * 1.18,
        address: `${address.address}, ${address.locality}, ${address.city}, ${address.state} - ${address.pincode}`,
        payment: payment.method === "cod" ? "Cash on Delivery" :
                payment.method === "card" ? "Card" :
                payment.method === "upi" ? "UPI" : "Net Banking"
      })
    });

    
    setIsProcessing(false);
    setOrderConfirmed(true);
    
    // Track order in analytics
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'purchase',
      ecommerce: {
        transaction_id: generatedOrderId,
        value: product.price * 1.18,
        items: [{
          item_name: product.name,
          item_id: product.id,
          price: product.price,
          quantity: 1
        }]
      }
    });
  };

  const validatePayment = () => {
    if (payment.method === "card") {
      if (!payment.cardNumber || !payment.expiry || !payment.cvv) {
        alert("Please enter card details");
        return false;
      }
      if (payment.cardNumber.replace(/\s/g, '').length !== 16) {
        alert("Please enter a valid 16-digit card number");
        return false;
      }
    }
    if (payment.method === "upi") {
      if (!payment.upiId || !payment.upiId.includes('@')) {
        alert("Please enter a valid UPI ID (e.g., name@upi)");
        return false;
      }
    }
    return true;
  };

  const sendOrderConfirmationEmail = async (orderDetails) => {
    try {
      // In a real app, call your backend API here
      console.log("Sending email to:", orderDetails.customerEmail);
      console.log("Order details:", orderDetails);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
      
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  };

  if (!product) {
    return (
      <div className="flipkart-container">
        <div className="error-page">
          <div className="error-icon">❌</div>
          <h2>Product Not Available</h2>
          <p>The product you're looking for is currently unavailable.</p>
          <button className="flipkart-btn primary" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flipkart-container">
      {/* Header */}
      <header className="flipkart-header">
        <div className="logo" onClick={() => navigate("/")}>
          {/* <span className="logo-text">Flipkart</span>
          <sup className="logo-sup">®</sup> */}
        </div>
        <div className="header-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-text">LOGIN</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-text">DELIVERY ADDRESS</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-text">PAYMENT</span>
          </div>
        </div>
        <div className="header-security">
          <span className="security-badge">🔒 100% SECURE</span>
        </div>
      </header>

      <div className="checkout-body">
        {/* Left Column - Main Content */}
        <div className="checkout-left">
          {/* Address Section */}
          {step === 1 && !orderConfirmed && (
            <div className="address-section">
              <div className="section-header">
                <h2>Select Delivery Address</h2>
                <button 
                  className="add-address-btn"
                  onClick={() => setShowAddressForm(true)}
                >
                  + ADD NEW ADDRESS
                </button>
              </div>
              
              {/* Saved Addresses */}
              <div className="addresses-list">
                {savedAddresses.map(address => (
                  <div 
                    key={address._id}
                    className={`address-card ${selectedAddress === address._id ? 'selected' : ''}`}
                    onClick={() => setSelectedAddress(address._id)}
                  >
                    <div className="address-header">
                      <span className="address-type">{address.type}</span>
                      {address.isDefault && (
                        <span className="default-badge">DEFAULT</span>
                      )}
                    </div>
                    <div className="address-content">
                      <h3>{address.name}</h3>
                      <p className="address-text">
                        {address.address}<br />
                        {address.locality && `${address.locality}, `}
                        {address.city}, {address.state} - {address.pincode}
                        {address.landmark && <><br />Landmark: {address.landmark}</>}
                      </p>
                      <p className="phone">Phone: {address.phone}</p>
                      {address.altPhone && (
                        <p className="phone">Alternate Phone: {address.altPhone}</p>
                      )}
                    </div>
                    <div className="address-actions">
                      <button className="edit-btn" onClick={(e) => {
                        e.stopPropagation();
                        // In real app, implement edit functionality
                        alert("Edit functionality would open here");
                      }}>
                        EDIT
                      </button>
                      {!address.isDefault && (
                        <button
                          className="remove-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAddress(address._id);
                          }}
                        >
                          REMOVE
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add New Address Form - Only shown when button clicked */}
              {showAddressForm && (
                <div className="address-form">
                  <div className="form-header">
                    <h3>Add New Address</h3>
                    <button 
                      className="close-form"
                      onClick={() => setShowAddressForm(false)}
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input 
                        type="text" 
                        name="email"
                        value={newAddress.email}
                        onChange={handleAddressChange}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="form-group">
                      <label>10-digit Mobile Number *</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        placeholder="98XXXXXX21"
                        maxLength="10"
                      />
                    </div>
                    <div className="form-group">
                      <label>Pincode *</label>
                      <input 
                        type="text" 
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressChange}
                        placeholder="110001"
                        maxLength="6"
                      />
                    </div>
                    <div className="form-group">
                      <label>Locality</label>
                      <input 
                        type="text" 
                        name="locality"
                        value={newAddress.locality}
                        onChange={handleAddressChange}
                        placeholder="Locality"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Address (Area and Street) *</label>
                      <textarea 
                        name="address"
                        value={newAddress.address}
                        onChange={handleAddressChange}
                        placeholder="Flat no. 123, Building name, Area, Street"
                        rows="3"
                      />
                    </div>
                    <div className="form-group">
                      <label>City/District/Town *</label>
                      <input 
                        type="text" 
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                      />
                    </div>
                    <div className="form-group">
                      <label>State *</label>
                      <select 
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                      >
                        <option value="">Select State</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Landmark (Optional)</label>
                      <input 
                        type="text" 
                        name="landmark"
                        value={newAddress.landmark}
                        onChange={handleAddressChange}
                        placeholder="E.g. Near Metro Station"
                      />
                    </div>
                    <div className="form-group">
                      <label>Alternate Phone (Optional)</label>
                      <input 
                        type="tel" 
                        name="altPhone"
                        value={newAddress.altPhone}
                        onChange={handleAddressChange}
                        placeholder="Alternate phone number"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button 
                      className="flipkart-btn primary"
                      onClick={handleAddAddress}
                    >
                      SAVE AND DELIVER HERE
                    </button>
                    <button 
                      className="flipkart-btn secondary"
                      onClick={() => {
                        setShowAddressForm(false);
                        setNewAddress({
                          name: "",
                          email: "",
                          phone: "",
                          pincode: "",
                          locality: "",
                          address: "",
                          city: "",
                          state: "",
                          landmark: "",
                          altPhone: ""
                        });
                      }}
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
              
              {/* Continue Button */}
              {!showAddressForm && savedAddresses.length > 0 && (
                <div className="continue-section">
                  <button 
                    className="flipkart-btn primary"
                    onClick={() => setStep(3)}
                  >
                    DELIVER HERE
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Payment Section */}
          {step === 3 && !orderConfirmed && (
            <div className="payment-section">
              <div className="selected-address-review">
                <h3>Deliver to:</h3>
                {(() => {
                  const address = savedAddresses.find(addr => addr._id === selectedAddress);
                  if (!address) return <p>No address selected</p>;
                  
                  return (
                    <div className="review-address">
                      <p><strong>{address.name}</strong> | {address.phone} | {address.email}</p>
                      <p>
                        {address.address}, {address.locality}, {address.city}, 
                        {address.state} - {address.pincode}
                      </p>
                      <button 
                        className="change-address-btn"
                        onClick={() => setStep(1)}
                      >
                        CHANGE
                      </button>
                    </div>
                  );
                })()}
              </div>
              
              <h2>Select Payment Method</h2>
              
              <div className="payment-options">
                <div 
                  className={`payment-option ${payment.method === 'cod' ? 'selected' : ''}`}
                  onClick={() => selectPaymentMethod('cod')}
                >
                  <div className="option-header">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={payment.method === 'cod'}
                      readOnly
                    />
                    <span className="option-title">Cash on Delivery</span>
                  </div>
                  <p className="option-desc">Pay when you receive the item</p>
                </div>

                <div 
                  className={`payment-option ${payment.method === 'upi' ? 'selected' : ''}`}
                  onClick={() => selectPaymentMethod('upi')}
                >
                  <div className="option-header">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={payment.method === 'upi'}
                      readOnly
                    />
                    <span className="option-title">UPI</span>
                  </div>
                  <div className="upi-apps">
                    <span className="upi-app">Google Pay</span>
                    <span className="upi-app">PhonePe</span>
                    <span className="upi-app">Paytm</span>
                    <span className="upi-app">BHIM</span>
                  </div>
                  {payment.method === 'upi' && (
                    <div className="upi-input">
                      <input 
                        type="text" 
                        placeholder="Enter UPI ID (e.g., name@upi)"
                        value={payment.upiId}
                        onChange={(e) => setPayment({...payment, upiId: e.target.value})}
                      />
                    </div>
                  )}
                </div>

                <div 
                  className={`payment-option ${payment.method === 'card' ? 'selected' : ''}`}
                  onClick={() => selectPaymentMethod('card')}
                >
                  <div className="option-header">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={payment.method === 'card'}
                      readOnly
                    />
                    <span className="option-title">Credit/Debit Card</span>
                  </div>
                  {payment.method === 'card' && (
                    <div className="card-inputs">
                      <input 
                        type="text" 
                        placeholder="Card Number" 
                        maxLength="19"
                        value={payment.cardNumber}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length > 16) value = value.substr(0, 16);
                          value = value.replace(/(\d{4})/g, '$1 ').trim();
                          setPayment({...payment, cardNumber: value});
                        }}
                      />
                      <div className="card-details">
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          maxLength="5"
                          value={payment.expiry}
                          onChange={(e) => setPayment({...payment, expiry: e.target.value})}
                        />
                        <input 
                          type="password" 
                          placeholder="CVV"
                          maxLength="3"
                          value={payment.cvv}
                          onChange={(e) => setPayment({...payment, cvv: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div 
                  className={`payment-option ${payment.method === 'netbanking' ? 'selected' : ''}`}
                  onClick={() => selectPaymentMethod('netbanking')}
                >
                  <div className="option-header">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={payment.method === 'netbanking'}
                      readOnly
                    />
                    <span className="option-title">Net Banking</span>
                  </div>
                  {payment.method === 'netbanking' && (
                    <select 
                      value={payment.bank}
                      onChange={(e) => setPayment({...payment, bank: e.target.value})}
                    >
                      <option value="">Select Bank</option>
                      <option value="hdfc">HDFC Bank</option>
                      <option value="icici">ICICI Bank</option>
                      <option value="sbi">State Bank of India</option>
                      <option value="axis">Axis Bank</option>
                    </select>
                  )}
                </div>
              </div>

              <button 
                className="flipkart-btn primary place-order-btn"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    PROCESSING ORDER...
                  </>
                ) : (
                  `PAY ₹${(product.price * 1.18).toLocaleString()}`
                )}
              </button>
            </div>
          )}

          {/* Order Confirmation */}
          {orderConfirmed && (
            <div className="order-confirmation">
              <div className="success-icon">🎉</div>
              <h2>Order Placed Successfully!</h2>
              
              <div className="confirmation-details">
                <div className="detail-row">
                  <span>Order ID:</span>
                  <strong>{orderId}</strong>
                </div>
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{new Date().toLocaleDateString('en-IN')}</span>
                </div>
                <div className="detail-row">
                  <span>Expected Delivery:</span>
                  <span className="delivery-date">{deliveryDate}</span>
                </div>
                <div className="detail-row">
                  <span>Payment Method:</span>
                  <span>{payment.method === 'cod' ? 'Cash on Delivery' : 
                        payment.method === 'card' ? 'Credit/Debit Card' :
                        payment.method === 'upi' ? 'UPI' : 'Net Banking'}</span>
                </div>
              </div>

              <div className="email-notification">
                <div className="email-icon">✉️</div>
                <div className="email-text">
                  <h4>Order confirmation email sent!</h4>
                  <p>A detailed confirmation email has been sent to your registered email address with all order details.</p>
                </div>
              </div>

              <div className="order-actions">
                <button
                  className="flipkart-btn primary"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  VIEW ORDER
                </button>

                <button className="flipkart-btn secondary" onClick={() => navigate("/products")}>
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Order Summary */}
        <div className="checkout-right">
          <div className="order-summary">
            <h3>PRICE DETAILS</h3>
            
            <div className="summary-row">
              <span>Price (1 item)</span>
              <span>₹{product.price.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charges</span>
              <span className="free">FREE</span>
            </div>
            <div className="summary-row">
              <span>GST (18%)</span>
              <span>₹{(product.price * 0.18).toLocaleString()}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total">
              <span>Total Amount</span>
              <span className="total-amount">₹{(product.price * 1.18).toLocaleString()}</span>
            </div>
            
            <div className="savings">
              You will save ₹{(product.price * 0.1).toLocaleString()} on this order
            </div>
          </div>

          <div className="delivery-info">
            <div className="delivery-icon">🚚</div>
            <div className="delivery-text">
              <strong>Free Delivery</strong>
              <p>Delivery by {deliveryDate}</p>
            </div>
          </div>

          <div className="product-preview">
            <img src={product.image} alt={product.name} />
            <div className="preview-details">
              <h4>{product.name}</h4>
              <div className="price-rating">
                <span className="price">₹{product.price.toLocaleString()}</span>
                <span className="rating">⭐ {product.rating}/5</span>
              </div>
              <p className="description">{product.description.substring(0, 80)}...</p>
            </div>
          </div>

          <div className="security-banner">
            <div className="security-icon">🔒</div>
            <p>
              <strong>Safe and Secure Payments.</strong><br />
              Easy returns. 100% Authentic products.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;