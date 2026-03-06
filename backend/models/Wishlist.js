const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  productId: String,
  name: String,
  price: Number,
  oldPrice: Number,
  image: String,
  category: String,
  stock: Number,
  rating: Number
}, { timestamps: true });

module.exports = mongoose.model("Wishlist", WishlistSchema);
