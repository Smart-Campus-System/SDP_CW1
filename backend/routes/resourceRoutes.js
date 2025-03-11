import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Resource from "../models/Resource.js";
import NotificationService from "../utils/notificationService.js"; // ✅ Import notification utility

const router = express.Router();

// ✅ Get One Seat by Seat Number and Hall ID
router.get("/seat/:hallId/:seatNumber", authMiddleware, async (req, res) => {
  try {
      const { hallId, seatNumber } = req.params;  // Get hallId and seatNumber from request parameters

      // Fetch the resource and find the specific hall by hallId
      const resource = await Resource.findOne();
      if (!resource) return res.status(404).json({ message: "Resource not found" });

      // Find the hall by hallId
      const hall = resource.halls.id(hallId);  // Find the hall by its ObjectId
      if (!hall) return res.status(404).json({ message: "Hall not found" });

      // Find the seat by seatNumber inside the hall
      const seat = hall.seats.find(seat => seat.seatNumber === parseInt(seatNumber));  // Find seat by seatNumber

      if (!seat) {
          return res.status(404).json({ message: "Seat not found" });  // Seat not found
      }

      // Respond with seat data
      res.status(200).json({ seat });
  } catch (error) {
      console.error("Error fetching seat:", error);
      res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Get All Hall IDs
router.get("/halls", authMiddleware, async (req, res) => {
  try {
    // Fetch the resource
    const resource = await Resource.findOne();
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Extract hall IDs from the resource
    const hallIds = resource.halls.map((hall) => hall._id); // Extract only the _id of each hall
    res.status(200).json({ hallIds });
  } catch (error) {
    console.error("Error fetching hall IDs:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});



// Get Available Seats for a Hall
router.get("/availability/:hallId", authMiddleware, async (req, res) => {
  try {
      const resource = await Resource.findOne();
      const hall = resource.halls.id(req.params.hallId);

      if (!hall) return res.status(404).json({ message: "Hall not found" });

      const availableSeats = hall.seats.filter(seat => !seat.isBooked);
      res.json({ availableSeats, totalSeats: hall.seats.length });
  } catch (error) {
      res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Book a Seat (Students)
router.post("/book", authMiddleware, async (req, res) => {
  try {
      const { hallId, seatNumber } = req.body;  // Get hallId and seatNumber from the request body
      const userId = req.user._id;  // Get the logged-in user's ID

      // Fetch the resource (contains halls and seats)
      const resource = await Resource.findOne();
      if (!resource) {
          return res.status(404).json({ message: "Resource not found" });  // Resource not found
      }

      // Find the specific hall by hallId
      const hall = resource.halls.id(hallId);  // Using MongoDB's `id()` method to find the hall
      if (!hall) {
          return res.status(404).json({ message: "Hall not found" });  // Hall not found
      }

      // Find the seat in the selected hall by seatNumber
      const seat = hall.seats.find(seat => seat.seatNumber === seatNumber);
      if (!seat) {
          return res.status(404).json({ message: "Seat not found" });  // Seat not found
      }

      // Check if the seat is already booked
      if (seat.isBooked) {
          return res.status(400).json({ message: "Seat already booked" });  // Seat already booked
      }

      // ✅ Book the seat
      seat.isBooked = true;
      seat.bookedBy = userId;   // Booked by the logged-in user
      seat.bookedAt = new Date();  // Set the booking time
      await resource.save();  // Save the updated resource with the booked seat

      // ✅ Send notification to student
      NotificationService.sendNotification(userId, `Your seat ${seatNumber} in ${hall.hallName} is booked.`);

      res.status(200).json({ message: `Seat ${seatNumber} in ${hall.hallName} booked successfully!` });
  } catch (error) {
      console.error("Booking Error:", error);
      res.status(500).json({ message: "Server Error", error });
  }
});



// ✅ Cancel Seat Reservation (Students)
router.post("/cancel", authMiddleware, async (req, res) => {
  try {
    const { hallId, seatNumber } = req.body;
    const userId = req.user._id;

    const resource = await Resource.findOne();
    const hall = resource.halls.id(hallId);
    if (!hall) return res.status(404).json({ message: "Hall not found" });

    const seat = hall.seats.find(seat => seat.seatNumber === seatNumber);
    if (!seat || !seat.isBooked || seat.bookedBy.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Cannot cancel this seat" });
    }

    // ✅ Cancel seat reservation
    seat.isBooked = false;
    seat.bookedBy = null;
    seat.bookedAt = null;
    await resource.save();

    // ✅ Send notification to student
    NotificationService.sendNotification(userId, `Your booking for seat ${seatNumber} in ${hall.hallName} has been canceled.`);

    res.status(200).json({ message: `Seat ${seatNumber} canceled successfully!` });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// ✅ Book Entire Hall (Lecturer/Admin only)
router.post("/bookHall", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "lecturer") {
      return res.status(403).json({ message: "Unauthorized: Only lecturers or admins can book entire halls." });
    }

    const { hallId } = req.body;

    // Find the resource and the specific hall
    const resource = await Resource.findOne();
    const hall = resource.halls.id(hallId);
    if (!hall) return res.status(404).json({ message: "Hall not found" });

    // ✅ Book all seats in the hall
    hall.seats.forEach((seat) => {
      if (!seat.isBooked) {
        seat.isBooked = true;
        seat.bookedBy = req.user._id;
        seat.bookedAt = new Date();
      }
    });

    await resource.save();

    // ✅ Send notification to all students
    // NotificationService.sendNotificationToAll(
    //   "A hall has been booked by a lecturer or admin. Check your bookings."
    // );

    res.status(200).json({ message: "Hall booked successfully!" });
  } catch (error) {
    console.error("Hall Booking Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


export default router;
