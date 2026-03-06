// server/emailService.js
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send order confirmation email
const sendOrderConfirmation = async (orderData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: orderData.email,
    subject: `Order Confirmation - ${orderData.orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #2874f0; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Flipkart</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #388e3c;">Order Confirmed!</h2>
          <p>Dear ${orderData.name},</p>
          <p>Thank you for your order. Here are your order details:</p>
          
          <div style="background: white; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <h3>Order Summary</h3>
            <p><strong>Order ID:</strong> ${orderData.orderId}</p>
            <p><strong>Order Date:</strong> ${orderData.date}</p>
            <p><strong>Product:</strong> ${orderData.productName}</p>
            <p><strong>Total Amount:</strong> ₹${orderData.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
            <p><strong>Expected Delivery:</strong> ${orderData.deliveryDate}</p>
          </div>
          
          <p><strong>Delivery Address:</strong><br>
          ${orderData.address}</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #e8f5e9; border-radius: 4px;">
            <p style="margin: 0;">You can track your order from "My Orders" section.</p>
          </div>
          
          <p style="margin-top: 30px;">Thank you for shopping with us!</p>
          <p><strong>ShopKart Team</strong></p>
        </div>
        <div style="background: #212121; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>© {new Date().getFullYear()} ShopKart. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error };
  }
};

module.exports = { sendOrderConfirmation };