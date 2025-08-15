import express from "express";
import { getUserProfile, updateUserProfile, getUsers } from "../controllers/userController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Admin only - list all users (bonus)
router.get("/", protect, adminOnly, getUsers);

export default router;
