const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    type: { type: String, default: "Home" },
    name: String,
    email: String,
    phone: String,
    altPhone: String,
    address: String,
    locality: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
