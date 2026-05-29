const path = require("path");
const mongoose = require("mongoose");
const Graveyard = require("../models/Graveyard");
const graveyards = require("./graveyards.data");

// ✅ Always load the backend .env reliably (absolute path)
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("🚀 Graveyard seed file started");

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("MONGODB_URI is required to seed graveyards.");
}

console.log("✅ SEED will connect to:", MONGO_URI);

async function seedGraveyards() {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("🧹 Clearing existing graveyards...");
    await Graveyard.deleteMany({});

    console.log("🌱 Inserting graveyards...");
    const inserted = await Graveyard.insertMany(graveyards);

    console.log(`✅ Inserted ${inserted.length} graveyards`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding graveyards:", err);
    process.exit(1);
  }
}

seedGraveyards();
