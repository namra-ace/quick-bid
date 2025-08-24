import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";
import { io } from "../server.js"; // Import the io instance

// Helper
const computeStatus = (startTime, endTime, now = new Date()) => {
  if (now < new Date(startTime)) return "upcoming";
  if (now > new Date(endTime)) return "ended";
  return "active";
};

/**
 * @desc Place a bid on an auction
 * @route POST /api/auctions/:id/bid
 * @access Private
 */
export const placeBid = async (req, res) => {
  const { id } = req.params; // auction ID
  const { amount } = req.body;
  const userId = req.user._id;

  try {
    if (amount == null || Number(amount) <= 0) {
      return res.status(400).json({ message: "Invalid bid amount" });
    }

    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    // Prevent self-bidding (optional but sane)
    if (auction.seller.toString() === userId.toString()) {
      return res.status(400).json({ message: "Seller cannot bid on own auction" });
    }

    // Ensure status is current
    const status = computeStatus(auction.startTime, auction.endTime);
    if (status !== auction.status) {
      auction.status = status;
      await auction.save();
    }

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    // Atomically find and update the auction to prevent race conditions
    const updatedAuction = await Auction.findOneAndUpdate(
      {
        _id: id,
        currentPrice: { $lt: Number(amount) }
      },
      {
        currentPrice: Number(amount),
        highestBidder: userId,
      },
      { new: true }
    );

    if (!updatedAuction) {
      return res.status(400).json({ message: "Bid must be higher than the current price or another bid was just placed." });
    }

    const bid = await Bid.create({
      auction: auction._id,
      bidder: userId,
      amount: Number(amount),
    });

    // Emit event to all clients in the auction room
    io.to(updatedAuction._id.toString()).emit("newBid", {
      bid,
      currentPrice: updatedAuction.currentPrice,
      highestBidder: updatedAuction.highestBidder,
    });

    res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (error) {
    console.error("Error placing bid:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all bids for an auction
 * @route GET /api/auctions/:id/bids
 * @access Public
 */
export const getBidsForAuction = async (req, res) => {
  const { id } = req.params;

  try {
    const bids = await Bid.find({ auction: id })
      .populate("bidder", "name email")
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Server error" });
  }
};