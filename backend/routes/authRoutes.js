import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/register",
  [
    body("name", "Name is required").notEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
  ],
  validateRequest,
  registerUser
);

router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password is required").notEmpty(),
  ],
  validateRequest,
  loginUser
);

export default router;
