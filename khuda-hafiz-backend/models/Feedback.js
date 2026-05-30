const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  message: { type: String, default: "" },
  userId: { type: String, default: null },
  email: { type: String, default: null },
  displayName: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
