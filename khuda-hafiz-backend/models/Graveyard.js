const mongoose = require("mongoose");

const graveyardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true, // ensure the type field is present
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function (v) {
            return v.length === 2;
          },
          message: "Coordinates must be [longitude, latitude]",
        },
      },
    },

    contactNumber: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 📍 Geo index for nearby search
graveyardSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Graveyard", graveyardSchema);
