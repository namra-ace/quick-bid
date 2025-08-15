import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Auction from "./models/Auction.js";
import Bid from "./models/Bid.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear old data
    await Bid.deleteMany();
    await Auction.deleteMany();
    await User.deleteMany();

    // Create a test user
    const user = await User.create({
      name: "Test Seller",
      email: "seller@example.com",
      password: "123456",
      role: "seller",
    });

    // Create a test auction
    const auction = await Auction.create({
      title: "MacBook Pro 2021",
      description: "Like new, 16GB RAM, 512GB SSD",
      startingPrice: 1000,
      currentPrice: 1000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // ends in 24 hrs
      seller: user._id,
      status: "active",
    });

    // Create a test bid
    const bid = await Bid.create({
      auction: auction._id,
      bidder: user._id, // seller bidding on own auction just for test
      amount: 1050,
    });

    console.log("✅ Test data seeded:");
    console.log({ user, auction, bid });

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:", err);
    process.exit(1);
  }
};

seedData();
