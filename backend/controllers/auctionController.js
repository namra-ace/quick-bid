import fs from "fs";
import Auction from "../models/Auction.js";
import cloudinary from "../utils/cloudinary.js";
import { validationResult } from "express-validator";

// Helper to compute correct status
const computeStatus = (startTime, endTime, now = new Date()) => {
  if (now < new Date(startTime)) return "upcoming";
  if (now > new Date(endTime)) return "ended";
  return "active";
};

const safeUnlink = (filePath) => {
  try {
    fs.unlinkSync(filePath);
  } catch (_) {
    /* ignore */
  }
};

/**
 * @desc Create new auction
 */
export const createAuction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      req.files.forEach((file) => safeUnlink(file.path));
    }
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, startingPrice, startTime, endTime } = req.body;

  try {
    if (new Date(endTime) <= new Date(startTime)) {
      if (req.files) {
        req.files.forEach((file) => safeUnlink(file.path));
      }
      return res.status(400).json({ message: "endTime must be after startTime" });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "auction_images",
            });
            return { url: result.secure_url, publicId: result.public_id };
          } finally {
            safeUnlink(file.path);
          }
        })
      );
      images = uploadResults;
    }

    const status = computeStatus(startTime, endTime);
    const auction = await Auction.create({
      title,
      description,
      startingPrice,
      currentPrice: startingPrice,
      startTime,
      endTime,
      seller: req.user._id,
      images,
      status,
    });

    res.status(201).json(auction);
  } catch (error) {
    console.error("Error creating auction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get all auctions
 */
export const getAllAuctions = async (_req, res) => {
  try {
    const auctions = await Auction.find().sort({ startTime: 1 });
    res.json(auctions);
  } catch (error) {
    console.error("Error fetching auctions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Get auction by ID
 */
export const getAuctionById = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    res.json(auction);
  } catch (error) {
    console.error("Error fetching auction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Update auction (seller only)
 */
export const updateAuction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.files) {
      req.files.forEach((file) => safeUnlink(file.path));
    }
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, startingPrice, startTime, endTime, replaceImages } = req.body;

  try {
    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this auction" });
    }

    let images = auction.images;

    if (req.files && req.files.length > 0) {
      const uploadResults = await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: "auction_images",
            });
            return { url: result.secure_url, publicId: result.public_id };
          } finally {
            safeUnlink(file.path);
          }
        })
      );

      const shouldReplace = replaceImages === "true" || replaceImages === true;
      if (shouldReplace) {
        if (auction.images?.length) {
          await Promise.all(
            auction.images.map((img) => cloudinary.uploader.destroy(img.publicId))
          );
        }
        images = uploadResults;
      } else {
        images = [...auction.images, ...uploadResults];
      }
    }

    // Update fields
    if (title) auction.title = title;
    if (description) auction.description = description;
    if (startingPrice != null) auction.startingPrice = startingPrice;
    if (startTime) auction.startTime = startTime;
    if (endTime) auction.endTime = endTime;
    auction.images = images;

    // Validate times
    if (new Date(auction.endTime) <= new Date(auction.startTime)) {
      return res.status(400).json({ message: "endTime must be after startTime" });
    }

    // Recompute status
    auction.status = computeStatus(auction.startTime, auction.endTime);

    await auction.save();
    res.json(auction);
  } catch (error) {
    console.error("Error updating auction:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @desc Delete auction (seller only)
 */
export const deleteAuction = async (req, res) => {
  const { id } = req.params;

  try {
    const auction = await Auction.findById(id);
    if (!auction) return res.status(404).json({ message: "Auction not found" });

    if (auction.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this auction" });
    }

    // delete images from Cloudinary
    if (auction.images?.length) {
      await Promise.all(
        auction.images.map((img) => cloudinary.uploader.destroy(img.publicId))
      );
    }

    await auction.deleteOne();
    res.json({ message: "Auction removed" });
  } catch (error) {
    console.error("Error deleting auction:", error);
    res.status(500).json({ message: "Server error" });
  }
};