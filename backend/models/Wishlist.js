const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
{
  userId: {
    type: String,
    required: true,
    index: true
  },

  productId: {
    type: String,
    required: true
  },

  name: String,
  price: Number,
  oldPrice: Number,
  image: String,
  category: String,
  stock: Number,
  rating: Number
},
{ timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);