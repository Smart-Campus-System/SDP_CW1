import express from "express";
import Schedule from "../models/Schedule.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🔹 Create a Schedule (Lecturer/Admin Only)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, participants } = req.body;

    if (req.user.role === "student") {
      return res.status(403).json({ msg: "Access denied. Only lecturers or admins can create schedules." });
    }

    const schedule = new Schedule({
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      createdBy: req.user.id,
      participants
    });

    await schedule.save();
    res.status(201).json({ msg: "Schedule created successfully", schedule });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔹 Get Schedule for a User
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find({
      $or: [
        { createdBy: req.params.userId },
        { participants: req.params.userId }
      ]
    }).populate("createdBy", "name email").populate("participants", "name email");

    res.json(schedules);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔹 Update a Schedule (Lecturer/Admin Only)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);

    if (!schedule) return res.status(404).json({ msg: "Schedule not found" });

    if (schedule.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const { title, description, date, startTime, endTime, location, participants } = req.body;
    schedule.title = title || schedule.title;
    schedule.description = description || schedule.description;
    schedule.date = date || schedule.date;
    schedule.startTime = startTime || schedule.startTime;
    schedule.endTime = endTime || schedule.endTime;
    schedule.location = location || schedule.location;
    schedule.participants = participants || schedule.participants;

    await schedule.save();
    res.json({ msg: "Schedule updated successfully", schedule });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

// 🔹 Delete a Schedule (Admin Only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) return res.status(404).json({ msg: "Schedule not found" });

    await schedule.deleteOne();
    res.json({ msg: "Schedule deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
});

export default router;
