import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { sendEmail } from "../utils/mailer.js";
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

// Route to Add an Admin (No Authentication Required Initially)
router.post("/register-admin", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if an admin already exists
    let adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      return res.status(400).json({ msg: "An admin already exists!" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create Admin User
    user = new User({ name, email, password: hashedPassword, role: "admin", modules: [] });
    await user.save();

    res.status(201).json({ msg: "Admin registered successfully!" });
  } catch (error) {
    console.error("Admin Registration Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

// Admin & User Login Endpoint
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = {
      id: user._id,
      role: user.role, // Include role in token
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

// Admin-Only Register Route for Students & Lecturers
router.post("/register", authMiddleware, async (req, res) => {
  const { name, email, password, role, modules } = req.body;

  try {
    // Check if logged-in user is an Admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access Denied: Only admins can register users" });
    }

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // Generate a random password for the user
    const tempPassword = Math.random().toString(36).slice(-8); // Generate a temporary password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt); // Hash the password

    // Create New User (Lecturer/Student)
    user = new User({ name, email, password: hashedPassword, role, modules });
    await user.save();

    // Send email to the newly registered user with the temporary password
    const emailSubject = `Your Account has been Created on Smart Campus`;
    const emailText = `Dear ${name},\n\nYour account has been successfully created. Use the following temporary password to log in: ${tempPassword}\n\nPlease make sure to change your password after logging in.\n\nBest regards,\nSmart Campus Team`;
    const emailHtml = `
      <p>Dear ${name},</p>
      <p>Your account has been successfully created. Use the following temporary password to log in: <strong>${tempPassword}</strong></p>
      <p>Please make sure to change your password after logging in.</p>
      <p>Best regards,</p>
      <p>Smart Campus Team</p>
    `;

    // Send email with temporary password
    sendEmail(email, emailSubject, emailText, emailHtml);

    res.status(201).json({ msg: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});


// Get All Users (Admin Only)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    // Ensure only Admin can view users
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access Denied: Only admins can view users" });
    }

    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ msg: "Server error", error });
  }
});

// Get User Profile (Protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

export default router;