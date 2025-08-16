import Auction from '../models/Auction.js';

// Create a new auction
export const createAuction = async (req, res) => {
  const { title, description, startingPrice, startTime, endTime } = req.body;

  try {
    const auction = await Auction.create({
      title,
      description,
      startingPrice,
      currentPrice: startingPrice,
      startTime,
      endTime,
      seller: req.user._id,
      status: 'upcoming',
    });

    res.status(201).json(auction);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all auctions
export const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().sort({ startTime: 1 });
    res.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get auction by ID
export const getAuctionById = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    res.json(auction);
  } catch (error) {
    console.error('Error fetching auction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update auction
export const updateAuction = async (req, res) => {
  const { id } = req.params;
  const { title, description, startingPrice, startTime, endTime } = req.body;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this auction' });
    }

    auction.title = title || auction.title;
    auction.description = description || auction.description;
    auction.startingPrice = startingPrice || auction.startingPrice;
    auction.startTime = startTime || auction.startTime;
    auction.endTime = endTime || auction.endTime;

    await auction.save();
    res.json(auction);
  } catch (error) {
    console.error('Error updating auction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete auction
export const deleteAuction = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }

    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this auction' });
    }

    await auction.remove();
    res.json({ message: 'Auction removed' });
  } catch (error) {
    console.error('Error deleting auction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
