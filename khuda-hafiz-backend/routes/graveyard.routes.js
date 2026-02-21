const express = require("express");
const router = express.Router();
const Graveyard = require("../models/Graveyard");

//
// ➕ Add Graveyard (Admin)
//
router.post("/", async (req, res) => {
  try {
    const { name, address, city, latitude, longitude, contactNumber } =
      req.body;

    if (!name || !address || !city || !latitude || !longitude) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const graveyard = new Graveyard({
      name,
      address,
      city,
      contactNumber,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });

    await graveyard.save();

    res.json({ success: true, graveyard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add graveyard" });
  }
});

//
// 📄 Get All Graveyards (Admin)
//
router.get("/", async (req, res) => {
  try {
    const graveyards = await Graveyard.find().sort({ createdAt: -1 });
    res.json(graveyards);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch graveyards" });
  }
});

//
// 📍 Search Nearby Graveyards (User)
//
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude & longitude required" });
    }

    const graveyards = await Graveyard.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 10000, // 10 km
        },
      },
    });

    res.json(graveyards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to search graveyards" });
  }
});

//
// ❌ Disable Graveyard (Admin)
//
router.patch("/:id/disable", async (req, res) => {
  try {
    await Graveyard.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to disable graveyard" });
  }
});
// 🌆 Get available cities (for dropdown)
router.get("/cities", async (req, res) => {
  try {
    const cities = await Graveyard.distinct("city", { isActive: true });
    cities.sort((a, b) => a.localeCompare(b));
    res.json({ success: true, cities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch cities" });
  }
});
// 🏙️ Get graveyards by city (for list)
router.get("/by-city", async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: "city is required" });

    const graveyards = await Graveyard.find({
      city: city.trim(),
      isActive: true,
    }).sort({ name: 1 });

    res.json({ success: true, graveyards });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch graveyards" });
  }
});

module.exports = router;
