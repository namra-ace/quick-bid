import express from "express";
import { body, validationResult } from "express-validator";
import Category from "../models/Category.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  [body("name").trim().notEmpty().withMessage("Category name is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { name } = req.body;
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) return res.status(400).json({ message: "Category already exists" });

      const category = await Category.create({ name });
      res.status(201).json(category);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/", async (_req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
