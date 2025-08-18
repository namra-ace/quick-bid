import express from "express";
import {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuction,
  deleteAuction,
} from "../controllers/auctionController.js";
import protect, { sellerOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Add auction (seller only, with images)
router.post("/", protect, sellerOnly, upload.array("images", 5), createAuction);

// Get all auctions
router.get("/", getAllAuctions);

// Get auction by ID
router.get("/:id", getAuctionById);

// Update auction (seller only)
router.put("/:id", protect, sellerOnly, upload.array("images", 5), updateAuction);

// Delete auction (seller only)
router.delete("/:id", protect, sellerOnly, deleteAuction);

export default router;
