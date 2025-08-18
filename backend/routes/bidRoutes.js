// routes/bidRoutes.js
import express from "express";
import { placeBid, getBidsForAuction } from "../controllers/bidController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Now correctly nested under /api/auctions
router.post("/:id/bid", protect, placeBid);   // POST /api/auctions/:id/bid
router.get("/:id/bids", getBidsForAuction);   // GET  /api/auctions/:id/bids

export default router;
