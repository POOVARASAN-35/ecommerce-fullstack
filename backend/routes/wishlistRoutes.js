const express = require("express");
const router = express.Router();
const controller = require("../controllers/wishlistController");

router.post("/add", controller.addToWishlist);
router.get("/:userId", controller.getWishlist);
router.delete("/:id", controller.removeFromWishlist);
router.delete("/clear/:userId", controller.clearWishlist);

module.exports = router;
