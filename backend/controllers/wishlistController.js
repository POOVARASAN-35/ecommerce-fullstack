const Wishlist = require("../models/Wishlist");

/* ➕ Add to Wishlist */
exports.addToWishlist = async (req, res) => {
  try {
    const { userId, product } = req.body;

    const exists = await Wishlist.findOne({
      userId,
      productId: product.id
    });

    if (exists) {
      return res.json({ message: "Already in wishlist" });
    }

    const item = await Wishlist.create({
      userId,
      productId: product.id,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: product.image,
      category: product.category,
      stock: product.stock,
      rating: product.rating
    });

    res.json(item);
  } catch (err) {
    res.status(500).json(err);
  }
};

/* 📥 Get Wishlist */
exports.getWishlist = async (req, res) => {
  try {
    const items = await Wishlist.find({ userId: req.params.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ❌ Remove */
exports.removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* ❌ Clear All */
exports.clearWishlist = async (req, res) => {
  await Wishlist.deleteMany({ userId: req.params.userId });
  res.json({ success: true });
};
