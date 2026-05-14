import "dotenv/config";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { connectDb } from "../config/db.js";

const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
const password = process.env.SEED_ADMIN_PASSWORD || "admin123";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI is required");
  process.exit(1);
}

await connectDb(uri);
const existing = await User.findOne({ email: email.toLowerCase() });
if (existing) {
  if (existing.role !== "admin") {
    existing.role = "admin";
    await existing.save();
    console.log("Updated existing user to admin:", email);
  } else {
    console.log("Admin already exists:", email);
  }
  await mongoose.disconnect();
  process.exit(0);
}

await User.create({ email, password, role: "admin" });
console.log("Created admin user:", email);
await mongoose.disconnect();
process.exit(0);
