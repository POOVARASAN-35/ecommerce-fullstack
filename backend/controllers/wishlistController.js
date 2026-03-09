const Wishlist = require("../models/Wishlist");

/* ➕ Add to Wishlist */
exports.addToWishlist = async (req, res) => {
  try {

    const {
      userId,
      productId,
      name,
      price,
      oldPrice,
      image,
      category,
      stock,
      rating
    } = req.body;

    // validation
    if (!userId || !productId) {
      return res.status(400).json({
        message: "userId and productId required"
      });
    }

    // check existing
    const exists = await Wishlist.findOne({
      userId,
      productId
    });

    if (exists) {
      return res.json(exists);
    }

    // create wishlist item
    const item = await Wishlist.create({
      userId,
      productId,
      name,
      price,
      oldPrice,
      image,
      category,
      stock,
      rating
    });

    res.status(201).json(item);

  } catch (err) {

    console.error("Wishlist Error:", err);

    res.status(500).json({
      message: "Server error",
      error: err.message
    });

  }
};


/* 📥 Get Wishlist */
exports.getWishlist = async (req, res) => {
  try {

    const items = await Wishlist.find({
      userId: req.params.userId
    });

    res.json(items);

  } catch (err) {

    res.status(500).json({
      message: "Error fetching wishlist",
      error: err.message
    });

  }
};


/* ❌ Remove Item */
exports.removeFromWishlist = async (req, res) => {
  try {

    await Wishlist.findByIdAndDelete(req.params.id);

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({
      message: "Error deleting wishlist item",
      error: err.message
    });

  }
};


/* ❌ Clear All */
exports.clearWishlist = async (req, res) => {
  try {

    await Wishlist.deleteMany({
      userId: req.params.userId
    });

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({
      message: "Error clearing wishlist",
      error: err.message
    });

  }
};