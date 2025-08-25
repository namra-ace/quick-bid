import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc Register a new user
// @route POST /api/auth/register
// @desc Register a new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body; // <-- Include 'role' here

  try {
    const userExists = await User.findOne({ email: email?.toLowerCase() });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Allow role to be set to "seller" or default to "bidder"
    const finalRole = (role === "seller") ? "seller" : "bidder";

    const user = await User.create({ name, email: email.toLowerCase(), password, role: finalRole });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};
