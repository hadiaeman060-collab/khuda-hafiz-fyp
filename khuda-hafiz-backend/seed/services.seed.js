const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Service = require("../models/Service");

dotenv.config();

const services = [
  {
    name: "Flowers",
    desc: "Fresh Sympathy Flowers",
    price: 1000,
  },
  {
    name: "Kafan",
    desc: "100% Pure White Cotton",
    price: 4000,
  },
  {
    name: "Tombstone",
    desc: "Tombstone with Inscription",
    price: 10000,
  },
  {
    name: "Grave",
    desc: "Grave Digging & Setup",
    price: 40000,
  },
  {
    name: "Catering",
    desc: "Meals Arranged with Care",
    price: 120000,
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Service.deleteMany();
    await Service.insertMany(services);
    console.log("✅ Services inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedServices();
