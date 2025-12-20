const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serviceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Package", packageSchema);
