import Auction from "../models/Auction.js";
import Bid from "../models/Bid.js";

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

    if (Number(amount) <= Number(auction.currentPrice)) {
      return res.status(400).json({ message: "Bid must be higher than current price" });
    }

    const bid = await Bid.create({
      auction: auction._id,
      bidder: userId,
      amount: Number(amount),
    });

    auction.currentPrice = Number(amount);
    auction.highestBidder = userId;
    await auction.save();

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
      .populate("bidder", "name email") // ✅ correct fields
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    console.error("Error fetching bids:", error);
    res.status(500).json({ message: "Server error" });
  }
};
