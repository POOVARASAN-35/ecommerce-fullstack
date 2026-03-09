const express = require("express");
const router = express.Router();
const controller = require("../controllers/wishlistController");
router.get("/", (req, res) => {
  res.json({
    message: "Wishlist API is working",
    endpoint: "/api/wishlist/:userId"
  });
});
router.post("/add", controller.addToWishlist);
router.get("/:userId", controller.getWishlist);
router.delete("/:id", controller.removeFromWishlist);
router.delete("/clear/:userId", controller.clearWishlist);

module.exports = router;
