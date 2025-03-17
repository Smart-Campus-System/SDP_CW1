import express from "express";
import Event from "../models/Event.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendNotificationEmail } from "../utils/notificationService.js";


const router = express.Router();

// 🔹 Create an Event (Admin/Lecturer Only)
router.post("/", authMiddleware, async (req, res) => {
    try {
      const { title, description, date, time, location } = req.body;
  
      const event = new Event({
        title,
        description,
        date,
        time,
        location,
        createdBy: req.user.id,
      });
  
      await event.save();
  
      // Fetch all users (students)
      const users = await User.find({ role: "student" });
  
      // Send notification to each student
      users.forEach(async (user) => {
        const notification = new Notification({
          userId: user._id,
          message: `New Event: ${title} at ${location} on ${date} at ${time}`,
        });
  
        await notification.save();
  
        // Send email notification
        sendNotificationEmail(user.email, "New Event Notification", notification.message);
      });
  
      res.status(201).json({ msg: "Event created and notifications sent!", event });
    } catch (error) {
      res.status(500).json({ msg: "Server error", error });
    }
  });

  // 🔹 Get User Notifications
router.get("/notifications/:userId", authMiddleware, async (req, res) => {
    try {
      const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ msg: "Server error", error });
    }
  });

// 🔹 Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔹 Update an Event (Admin/Lecturer Only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    if (event.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const { title, description, date, time, location } = req.body;
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;

    await event.save();
    res.json({ msg: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔹 Delete an Event (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    await event.deleteOne();
    res.json({ msg: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

export default router;
