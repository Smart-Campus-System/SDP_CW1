import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🔹 Fetch User Details (Protected Route)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔹 Update User Info (User or Admin)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, contact, preferences } = req.body;
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // Only the user themselves or an admin can update the profile
    if (user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    user.name = name || user.name;
    user.contact = contact || user.contact;
    user.preferences = preferences || user.preferences;

    await user.save();
    res.json({ msg: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔹 Delete User (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await user.deleteOne();
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

export default router;
