// controllers/userController.js
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc Get logged-in user's profile
// @route GET /api/users/profile
// @access Private
export const getUserProfile = async (req, res) => {
  try {
    // protect middleware attaches req.user (without password)
    if (!req.user) return res.status(401).json({ message: "Not authorized" });

    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
      updatedAt: req.user.updatedAt,
    });
  } catch (error) {
    console.error("getUserProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update logged-in user's profile
// @route PUT /api/users/profile
// @access Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;

    // Prevent role changes here; only name/email/password
    if (email && email !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists && exists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (password) user.password = password; // model pre-save will hash

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("updateUserProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===== Bonus: admin-only list users (useful later) =====
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    console.error("getUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
