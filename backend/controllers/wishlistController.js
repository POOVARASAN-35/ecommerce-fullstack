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

    if (!userId || !productId) {
      return res.status(400).json({
        message: "userId and productId required"
      });
    }

    const exists = await Wishlist.findOne({
      userId,
      productId
    });

    if (exists) {
      return res.json(exists);
    }

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

  } catch (error) {

    console.error("Wishlist Error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }
};