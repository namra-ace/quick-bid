import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";
import auctionRoutes from "./routes/auctionRoutes.js;"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/auctions/",auctionRoutes);

// Simple health check with DB state
app.get("/api/health", (_req, res) => {
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    dbState: states[mongoose.connection.readyState] ?? mongoose.connection.readyState,
  });
});

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Hello ${req.user.name}, you have access!` });
});


const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(); // don't start server until DB is up
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();
