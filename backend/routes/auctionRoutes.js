import express from 'express';
import { body } from 'express-validator';
import { createAuction, getAllAuctions, getAuctionById, updateAuction, deleteAuction } from '../controllers/auctionController.js';
import protect, { sellerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new auction
router.post(
  '/',
  protect,
  sellerOnly,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('startingPrice').isNumeric().withMessage('Starting price must be a number'),
    body('startTime').notEmpty().withMessage('Start time is required'),
    body('endTime').notEmpty().withMessage('End time is required'),
  ],
  createAuction
);

// Get all auctions
router.get('/', getAllAuctions);

// Get auction by ID
router.get('/:id', getAuctionById);

// Update auction
router.put('/:id', protect, sellerOnly, updateAuction);

// Delete auction
router.delete('/:id', protect, sellerOnly, deleteAuction);

export default router;
