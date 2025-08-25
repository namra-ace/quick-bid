// server.js
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import auctionRoutes from "./routes/auctionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bidRoutes from "./routes/bidRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import startAuctionScheduler from "./cron/auctionScheduler.js";
import cors from "cors"; // Import cors middleware

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// Middleware
app.use(cors()); // Add this line to enable CORS for all routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auctions", auctionRoutes);
app.use("/api/auctions", bidRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

// Socket.IO for real-time bidding
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinAuction", (auctionId) => {
    socket.join(auctionId);
    console.log(`User ${socket.id} joined auction room ${auctionId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  startAuctionScheduler();
});

export { io };