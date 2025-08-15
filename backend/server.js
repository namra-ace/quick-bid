import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health check with DB state
app.get("/api/health", (_req, res) => {
  const states = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  res.json({
    status: "ok",
    dbState: states[mongoose.connection.readyState] ?? mongoose.connection.readyState,
  });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(); // don't start server until DB is up
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

start();
