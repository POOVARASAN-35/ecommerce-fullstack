const express = require("express");
const router = express.Router();
const sendEmail = require("../utils/sendEmail");

/* CONFIRM ORDER + SEND EMAIL */
router.post("/confirm", async (req, res) => {
  try {
    const {
      email,
      name,
      orderId,
      product,
      amount,
      address,
      payment
    } = req.body;

    await sendEmail({
      to: email,
      subject: "✅ Order Confirmed Successfully",
      html: `
        <h2>Order Confirmed 🎉</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>Your order has been <b>confirmed successfully</b>.</p>

        <h3>Order Details</h3>
        <p><b>Order ID:</b> ${orderId}</p>
        <p><b>Product:</b> ${product}</p>
        <p><b>Total Amount:</b> ₹${amount}</p>
        <p><b>Payment:</b> ${payment}</p>

        <h3>Delivery Address</h3>
        <p>${address}</p>

        <br/>
        <p>Thank you for shopping with us ❤️</p>
        <p><b>Flipkart Team</b></p>
      `
    });

    res.json({ success: true, message: "Order confirmed & email sent" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, message: "Email failed" });
  }
});

module.exports = router;
