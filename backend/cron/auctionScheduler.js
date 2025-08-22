import cron from "node-cron";
import Auction from "../models/Auction.js";

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
      });

      if (endedAuctions.length > 0) {
        console.log(`✅ Found ${endedAuctions.length} auctions to finalize.`);
      }

      for (const auction of endedAuctions) {
        // Update status to 'ended'
        auction.status = "ended";
        await auction.save();

        console.log(`✅ Auction '${auction.title}' is now ended.`);

        // TODO: Implement notification logic here
        // Notify the highest bidder that they won.
        // Notify the seller that the auction has concluded.
      }
    } catch (error) {
      console.error("❌ Error in auction scheduler:", error);
    }
  });
};

export default startAuctionScheduler;