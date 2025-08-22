import express from "express";
import { body, validationResult } from "express-validator";
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

const auctionValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("startingPrice")
    .isFloat({ min: 0 })
    .withMessage("Starting price must be a positive number"),
  body("startTime").isISO8601().withMessage("Start time must be a valid date"),
  body("endTime").isISO8601().withMessage("End time must be a valid date"),
];

// Add auction (seller only, with images)
router.post(
  "/",
  protect,
  sellerOnly,
  upload.array("images", 5),
  auctionValidation,
  createAuction
);

// Get all auctions
router.get("/", getAllAuctions);

// Get auction by ID
router.get("/:id", getAuctionById);

// Update auction (seller only)
router.put(
  "/:id",
  protect,
  sellerOnly,
  upload.array("images", 5),
  auctionValidation,
  updateAuction
);

// Delete auction (seller only)
router.delete("/:id", protect, sellerOnly, deleteAuction);

export default router;