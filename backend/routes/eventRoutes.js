import express from "express";
import Event from "../models/Event.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { sendNotificationEmail } from "../utils/notificationService.js";
import multer from "multer";

// Set up multer to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // specify the folder to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Set file name to avoid conflicts
  }
});

// Initialize multer with the storage engine
const upload = multer({ storage });


const router = express.Router();

// 🔹 Create an Event (Admin/Lecturer Only)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, time, location } = req.body;
    const image = req.file ? req.file.path : null; // Saves the relative path to the image

    // Now save the event with the image path in the database
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      image, // Store the image path
      createdBy: req.user.id,
    });

    await event.save();

    // Notify students about the new event
    const users = await User.find({ role: "student" });
    users.forEach(async (user) => {
      const notification = new Notification({
        userId: user._id,
        message: `New Event: ${title} at ${location} on ${date} at ${time}`,
      });

      await notification.save();
      sendNotificationEmail(user.email, "New Event Notification", notification.message);
    });

    res.status(201).json({ msg: "Event created and notifications sent!", event });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});


// 🔹 Get All Events (Include Image)
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

    const { title, description, date, time, location, image } = req.body;
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.image = image || event.image;

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
