import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Module from "../models/Module.js"; // Ensure this line is present

const router = express.Router();

// Endpoint to get total students, lecturers, and all users
router.get('/dashboard/stats', authMiddleware, async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalLecturers = await User.countDocuments({ role: 'lecturer' });
    const totalUsers = await User.countDocuments();
    const enrolledModules = await Module.countDocuments();  // Assuming modules are stored in the Module collection

    res.status(200).json({
      totalStudents,
      totalLecturers,
      totalUsers,
      enrolledModules,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all users (Admins can access this)
router.get("/all", authMiddleware, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("-password"); // Exclude password field from response

    if (!users || users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    // Return the list of users
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});



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
