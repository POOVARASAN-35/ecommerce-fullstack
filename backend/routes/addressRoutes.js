const express = require("express");
const router = express.Router();
const Address = require("../models/Address");

/* GET all addresses */
router.get("/:userId", async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADD address */
router.post("/", async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* DELETE address */
router.delete("/:id", async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* SET DEFAULT */
router.put("/default/:id/:userId", async (req, res) => {
  try {
    await Address.updateMany(
      { userId: req.params.userId },
      { isDefault: false }
    );

    await Address.findByIdAndUpdate(req.params.id, {
      isDefault: true
    });

    res.json({ message: "Default address updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
