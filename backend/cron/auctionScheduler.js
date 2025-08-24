import cron from "node-cron";
import Auction from "../models/Auction.js";
import { io } from "../server.js"; // Import the io instance

const startAuctionScheduler = () => {
  console.log("⏱️ Auction scheduler started.");

  // This cron job will run every minute to check for ended auctions.
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();

      // Find all auctions that have ended but are still marked as 'active'
      const endedAuctions = await Auction.find({
        endTime: { $lt: now },
        status: "active",
      }).populate('highestBidder seller', 'name email');

      if (endedAuctions.length > 0) {
        console.log(`✅ Found ${endedAuctions.length} auctions to finalize.`);
      }

      for (const auction of endedAuctions) {
        // Update status to 'ended'
        auction.status = "ended";
        await auction.save();

        console.log(`✅ Auction '${auction.title}' is now ended.`);

        // Notify the highest bidder and the seller
        if (auction.highestBidder) {
          io.to(auction.highestBidder._id.toString()).emit("auctionEnded", {
            auctionId: auction._id,
            message: `Congratulations! You won the auction for "${auction.title}".`,
          });
        }
        
        if (auction.seller) {
            io.to(auction.seller._id.toString()).emit("auctionEnded", {
                auctionId: auction._id,
                message: `Your auction for "${auction.title}" has ended.`,
            });
        }
      }
    } catch (error) {
      console.error("❌ Error in auction scheduler:", error);
    }
  });
};

export default startAuctionScheduler;