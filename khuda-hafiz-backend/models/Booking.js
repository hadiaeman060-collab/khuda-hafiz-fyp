const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID
  packageName: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
    },
  ],
  totalPrice: { type: Number, required: true },
  paymentMode: {
    type: String,
    enum: ["online", "cash_on_delivery"],
    default: "cash_on_delivery",
  },
  status: { type: String, default: "pending" }, // pending, paid, completed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
