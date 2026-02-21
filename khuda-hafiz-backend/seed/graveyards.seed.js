const path = require("path");
const mongoose = require("mongoose");
const Graveyard = require("../models/Graveyard");

// ✅ Always load the backend .env reliably (absolute path)
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("🚀 Graveyard seed file started");

const MONGO_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/khuda-hafiz";

console.log("✅ SEED will connect to:", MONGO_URI);

// Dummy contact generator (NOT real numbers)
const contact = (n) => `+92-51-9000-${String(n).padStart(4, "0")}`;

const graveyards = [
  { name: "Model Town Graveyard", city: "Lahore", address: "Model Town, Lahore, Pakistan", contactNumber: contact(1001), isActive: true, location: { type: "Point", coordinates: [74.3239, 31.4756] } },
  { name: "Miani Sahib Graveyard", city: "Lahore", address: "Mozang Chungi, Lahore, Pakistan", contactNumber: contact(1002), isActive: true, location: { type: "Point", coordinates: [74.3122, 31.5567] } },

  { name: "G-6 Graveyard", city: "Islamabad", address: "G-6, Islamabad, Pakistan", contactNumber: contact(2001), isActive: true, location: { type: "Point", coordinates: [73.0479, 33.6940] } },
  { name: "G-7 Graveyard", city: "Islamabad", address: "G-7, Islamabad, Pakistan", contactNumber: contact(2002), isActive: true, location: { type: "Point", coordinates: [73.0665, 33.6868] } },
  { name: "F-8 Graveyard", city: "Islamabad", address: "F-8, Islamabad, Pakistan", contactNumber: contact(2003), isActive: true, location: { type: "Point", coordinates: [73.0358, 33.7080] } },
  { name: "F-7 Graveyard", city: "Islamabad", address: "F-7, Islamabad, Pakistan", contactNumber: contact(2004), isActive: true, location: { type: "Point", coordinates: [73.0286, 33.7112] } },
  { name: "I-8 Graveyard", city: "Islamabad", address: "I-8, Islamabad, Pakistan", contactNumber: contact(2005), isActive: true, location: { type: "Point", coordinates: [72.9991, 33.7104] } },
  { name: "I-9 Graveyard", city: "Islamabad", address: "I-9, Islamabad, Pakistan", contactNumber: contact(2006), isActive: true, location: { type: "Point", coordinates: [72.9950, 33.7056] } },
  { name: "H-8 Graveyard", city: "Islamabad", address: "H-8, Islamabad, Pakistan", contactNumber: contact(2007), isActive: true, location: { type: "Point", coordinates: [73.0660, 33.6889] } },
  { name: "H-9 Graveyard", city: "Islamabad", address: "H-9, Islamabad, Pakistan", contactNumber: contact(2008), isActive: true, location: { type: "Point", coordinates: [73.0702, 33.6796] } },
  { name: "Shah Allah Ditta Cemetery", city: "Islamabad", address: "Shah Allah Ditta, Islamabad, Pakistan", contactNumber: contact(2009), isActive: true, location: { type: "Point", coordinates: [72.9875, 33.7314] } },
  { name: "Saddar Graveyard (Islamabad)", city: "Islamabad", address: "Saddar, Islamabad, Pakistan", contactNumber: contact(2010), isActive: true, location: { type: "Point", coordinates: [73.0470, 33.6850] } },
  { name: "Golra Sharif Graveyard", city: "Islamabad", address: "Golra Sharif, Islamabad, Pakistan", contactNumber: contact(2011), isActive: true, location: { type: "Point", coordinates: [72.9451, 33.6862] } },
  { name: "Dhok Kala Khan Graveyard", city: "Islamabad", address: "Dhok Kala Khan, Islamabad, Pakistan", contactNumber: contact(2012), isActive: true, location: { type: "Point", coordinates: [73.0708, 33.7099] } },
  { name: "Bhara Kahu Graveyard", city: "Islamabad", address: "Bhara Kahu, Islamabad, Pakistan", contactNumber: contact(2013), isActive: true, location: { type: "Point", coordinates: [73.1102, 33.6891] } },
  { name: "Sihala Graveyard", city: "Islamabad", address: "Sihala, Islamabad, Pakistan", contactNumber: contact(2014), isActive: true, location: { type: "Point", coordinates: [73.0321, 33.5819] } },
  { name: "Chak Shahzad Graveyard", city: "Islamabad", address: "Chak Shahzad, Islamabad, Pakistan", contactNumber: contact(2015), isActive: true, location: { type: "Point", coordinates: [73.1320, 33.6615] } },
  { name: "Margalla Village Cemetery", city: "Islamabad", address: "Margalla Village, Islamabad, Pakistan", contactNumber: contact(2016), isActive: true, location: { type: "Point", coordinates: [73.0305, 33.7150] } },
  { name: "Bara Kahu Community Graveyard", city: "Islamabad", address: "Bara Kahu, Islamabad, Pakistan", contactNumber: contact(2017), isActive: true, location: { type: "Point", coordinates: [73.1245, 33.6887] } },
  { name: "F-11 Graveyard", city: "Islamabad", address: "F-11, Islamabad, Pakistan", contactNumber: contact(2018), isActive: true, location: { type: "Point", coordinates: [73.0434, 33.7079] } },
  { name: "G-10 Graveyard", city: "Islamabad", address: "G-10, Islamabad, Pakistan", contactNumber: contact(2019), isActive: true, location: { type: "Point", coordinates: [73.1200, 33.6720] } },
  { name: "I-10 Graveyard", city: "Islamabad", address: "I-10, Islamabad, Pakistan", contactNumber: contact(2020), isActive: true, location: { type: "Point", coordinates: [73.0125, 33.6881] } },
  { name: "Koral Graveyard", city: "Islamabad", address: "Koral, Islamabad, Pakistan", contactNumber: contact(2021), isActive: true, location: { type: "Point", coordinates: [72.9448, 33.6213] } },
  { name: "Saddar Margalla Graveyard", city: "Islamabad", address: "Saddar Margalla, Islamabad, Pakistan", contactNumber: contact(2022), isActive: true, location: { type: "Point", coordinates: [73.0369, 33.7001] } },
  { name: "Nur Khan Graveyard", city: "Islamabad", address: "Near Nur Khan, Islamabad, Pakistan", contactNumber: contact(2023), isActive: true, location: { type: "Point", coordinates: [72.8112, 33.5734] } },
  { name: "Dhoke Hassu Cemetery", city: "Islamabad", address: "Dhoke Hassu, Islamabad, Pakistan", contactNumber: contact(2024), isActive: true, location: { type: "Point", coordinates: [73.0555, 33.6782] } },
  { name: "Ramal Saddar Graveyard", city: "Islamabad", address: "Ramal Saddar, Islamabad, Pakistan", contactNumber: contact(2025), isActive: true, location: { type: "Point", coordinates: [73.0810, 33.6635] } },
  { name: "Taramri Graveyard", city: "Islamabad", address: "Taramri, Islamabad, Pakistan", contactNumber: contact(2026), isActive: true, location: { type: "Point", coordinates: [73.0568, 33.7260] } },
  { name: "Pind Begwal Cemetery", city: "Islamabad", address: "Pind Begwal, Islamabad, Pakistan", contactNumber: contact(2027), isActive: true, location: { type: "Point", coordinates: [73.1065, 33.6512] } },
  { name: "Lohi Bher Graveyard", city: "Islamabad", address: "Lohi Bher, Islamabad, Pakistan", contactNumber: contact(2028), isActive: true, location: { type: "Point", coordinates: [72.9850, 33.6320] } },
];

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